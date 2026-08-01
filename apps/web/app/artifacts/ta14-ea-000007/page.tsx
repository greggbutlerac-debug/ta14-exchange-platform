"use client";

import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";

type View =
  | "inspection"
  | "chain"
  | "dosing"
  | "evidence"
  | "threshold"
  | "control"
  | "outcome"
  | "integrity"
  | "verify"
  | "challenge";

type VerificationState = "IDLE" | "RUNNING" | "VERIFIED";
type GateResult = "PASS" | "FAIL" | "UNRESOLVED" | "NOT_APPLICABLE";

type ChainItem = {
  number: string;
  link: string;
  result: GateResult;
  question: string;
  finding: string;
  proof: string;
};

type GateItem = {
  number: string;
  title: string;
  chainLink: string;
  result: GateResult;
  reasonCode: string;
  summary: string;
};

type EvidenceItem = {
  id: string;
  title: string;
  source: string;
  type: string;
  disclosure: string;
  status: string;
  capturedAt: string;
  hash: string;
  supports: string;
  limitation: string;
};

type ThresholdEvent = {
  time: string;
  event: string;
  detail: string;
  state: string;
};

type VerificationCheck = {
  level: string;
  label: string;
  detail: string;
};

type AcceptanceTest = {
  id: string;
  result: string;
  condition: string;
};

const ARTIFACT_ID = "TA14-EA-000007";
const ARTIFACT_TITLE = "Authorized Chemical-Dosing Threshold Exceeded";
const ROUTE_ID = "TA14-ROUTE-WATER-DOSING-THRESHOLD-ESCALATE-007";
const ROUTE_VERSION = "1.0.0";
const RECORD_HASH = "sha256:7d81d14fc4e0d831e9aee4ab1c57cd9e03837bd2ba50a180e9d19a73da270007";
const PACKAGE_HASH = "sha256:f2bcf193630ce0d15df79f5886909ff84f8b506de8a2d03237f5d4dd93070007";
const RECEIPT_HASH = "sha256:c3e0b77f57db1fdb0d00c9198c54022b321b55f6ae0dcfb34bac7c7845070007";

const chain: ChainItem[] = [
  {
    number: "01",
    link: "Reality",
    result: "PASS",
    question: "What condition existed before interpretation?",
    finding: "A governed execution request sought to invoke 12% dosing increase while the frozen route and approved commit profile authorized five-percent delegated adjustment only.",
    proof: "The requested percentage, affected treatment train, consequence, operator, destination controller, and decision window were preserved before evaluation.",
  },
  {
    number: "02",
    link: "Record",
    result: "PASS",
    question: "What attributable representation was preserved?",
    finding: "The request package, route snapshot, influent measurements, jar-test record, delegated authority record, and operating change request were captured.",
    proof: "Every material input received a stable identifier, source attribution, capture time, disclosure state, and integrity commitment.",
  },
  {
    number: "03",
    link: "Continuity",
    result: "PASS",
    question: "Did identity, provenance, state, and version remain connected?",
    finding: "Operator identity, route identity, authority, sensor custody, treatment train, and measurement records remained continuously attributable.",
    proof: "No source substitution, custody break, identity discontinuity, or silent route rewrite occurred.",
  },
  {
    number: "04",
    link: "Admissibility",
    result: "PASS",
    question: "May the evidence support this exact version decision now?",
    finding: "The evidence was current, relevant, attributable, and sufficient to evaluate the requested adjustment against the delegated threshold.",
    proof: "The admissibility evaluator accepted the evidence for version comparison without treating it as permission to execute.",
  },
  {
    number: "05",
    link: "Binding",
    result: "PASS",
    question: "What rule validly governs the consequence?",
    finding: "The frozen route requires exact dosing-threshold parity between approval, commit, adapter command, and executed package.",
    proof: "The binding record applied the rule that valid operational authority does not expand beyond its declared quantitative ceiling.",
  },
  {
    number: "06",
    link: "Commit",
    result: "FAIL",
    question: "Did the requested consequence remain within the delegated quantitative threshold?",
    finding: "Dosing 12% did not match the delegated 5% delegated adjustment, so the requested execution could not receive a valid release commit.",
    proof: "Gate 15 fixed THRESHOLD_EXCEEDED as the earliest controlling failure and committed ESCALATE before adapter invocation.",
  },
  {
    number: "07",
    link: "Execution",
    result: "PASS",
    question: "Did the determination control the action path?",
    finding: "The dosing adapter rejected 12%, suspended the pending token, and prevented fallback, retry, alias, and alternate-endpoint execution.",
    proof: "Receipt EA-000007-EX-01 records HTTP 202, queue state AWAITING_EXECUTIVE_REVIEW, zero dosing changes, and no successful bypass.",
  },
  {
    number: "08",
    link: "Outcome",
    result: "PASS",
    question: "What bound to reality, and what did not?",
    finding: "No dosing change occurred. The threshold exceedance, escalation, held command, and named review path were preserved.",
    proof: "Outcome closure confirms unchanged dosing state and residual risk limited to delayed intervention pending higher-authority review.",
  },
];

const gates: GateItem[] = [
  { number: "01", title: "Observed condition registered", chainLink: "REALITY", result: "PASS", reasonCode: "DOSING_REQUEST_PRESENT", summary: "The proposed dosing invocation and consequence were exact enough to govern." },
  { number: "02", title: "Affected systems identified", chainLink: "REALITY", result: "PASS", reasonCode: "SYSTEMS_IDENTIFIED", summary: "The governed target, adapter, actor, reviewers, and affected process were attributable." },
  { number: "03", title: "Request package captured", chainLink: "RECORD", result: "PASS", reasonCode: "REQUEST_CAPTURED", summary: "The dosing request, route snapshot, manifests, ticket, and authority record were preserved before reliance." },
  { number: "04", title: "Record identity fixed", chainLink: "RECORD", result: "PASS", reasonCode: "RECORD_ID_FIXED", summary: "Stable record, route, dosing, and package identifiers were assigned." },
  { number: "05", title: "Actor identity resolved", chainLink: "CONTINUITY", result: "PASS", reasonCode: "ACTOR_IDENTITY_RESOLVED", summary: "Requester, approver, reviewer, and dosing operator identities were resolved." },
  { number: "06", title: "Dosing provenance linked", chainLink: "CONTINUITY", result: "PASS", reasonCode: "MEASUREMENT_PROVENANCE_LINKED", summary: "Both dosing packages were linked to their signed manifests and build provenance." },
  { number: "07", title: "Custody continuity checked", chainLink: "CONTINUITY", result: "PASS", reasonCode: "CUSTODY_CONTINUOUS", summary: "The request, manifests, approval, and adapter command remained continuously linked." },
  { number: "08", title: "Route version continuous", chainLink: "CONTINUITY", result: "PASS", reasonCode: "ROUTE_VERSION_CONTINUOUS", summary: "Route version 2.0.0 remained frozen and unchanged throughout evaluation." },
  { number: "09", title: "Evidence relevance tested", chainLink: "ADMISSIBILITY", result: "PASS", reasonCode: "EVIDENCE_RELEVANT", summary: "The manifests and route snapshot directly answered the dosing-threshold question." },
  { number: "10", title: "Evidence freshness tested", chainLink: "ADMISSIBILITY", result: "PASS", reasonCode: "EVIDENCE_CURRENT", summary: "All material evidence remained inside the configured freshness window." },
  { number: "11", title: "Evidence sufficiency tested", chainLink: "ADMISSIBILITY", result: "PASS", reasonCode: "EVIDENCE_SUFFICIENT", summary: "The package was complete enough to determine quantitative threshold compliance." },
  { number: "12", title: "Authority admissibility tested", chainLink: "ADMISSIBILITY", result: "PASS", reasonCode: "AUTHORITY_ADMISSIBLE", summary: "Authority remained valid for 5% delegated adjustment and did not extend to 12%." },
  { number: "13", title: "Approved dosing fixed", chainLink: "BINDING", result: "PASS", reasonCode: "DELEGATED_THRESHOLD_5_PERCENT", summary: "The governing record fixed five percent as the maximum operator-authorized adjustment." },
  { number: "14", title: "Destination rule applied", chainLink: "BINDING", result: "PASS", reasonCode: "DESTINATION_AUTHORIZED", summary: "The target endpoint matched the approved destination." },
  { number: "15", title: "Privilege rule applied", chainLink: "BINDING", result: "PASS", reasonCode: "PRIVILEGES_AUTHORIZED", summary: "Requested privileges remained within the delegated operating scope." },
  { number: "16", title: "Separation of duties applied", chainLink: "BINDING", result: "PASS", reasonCode: "DUTIES_SEPARATED", summary: "Requester, approver, and dosing operator remained distinct." },
  { number: "17", title: "Delegated threshold evaluated", chainLink: "BINDING", result: "FAIL", reasonCode: "THRESHOLD_EXCEEDED", summary: "Requested twelve-percent dosing increase exceeded the delegated five-percent adjustment ceiling." },
  { number: "18", title: "Earliest failure fixed", chainLink: "BINDING", result: "PASS", reasonCode: "EARLIEST_FAILURE_BINDING", summary: "Commit-stage threshold exceedance was fixed as the controlling break." },
  { number: "19", title: "Determination fixed", chainLink: "BINDING", result: "PASS", reasonCode: "DETERMINATION_ESCALATE", summary: "ESCALATE was committed before the dosing adapter received any release authority." },
  { number: "20", title: "Permitted next action fixed", chainLink: "BINDING", result: "PASS", reasonCode: "HIGHER_AUTHORITY_REVIEW_REQUIRED", summary: "Only a named higher-authority determination and complete rerun may release the requested twelve-percent adjustment." },
  { number: "21", title: "Adapter command generated", chainLink: "EXECUTION", result: "PASS", reasonCode: "COMMAND_HOLD_AND_ROUTE", summary: "The adapter received a hold-and-route command." },
  { number: "22", title: "Unauthorized dosing blocked", chainLink: "EXECUTION", result: "PASS", reasonCode: "HTTP_202_ESCALATED", summary: "The adapter rejected 12% dosing increase and suspended the pending dosing command." },
  { number: "23", title: "Bypass resistance verified", chainLink: "EXECUTION", result: "PASS", reasonCode: "BYPASS_PREVENTED", summary: "Alias, retry, fallback, and alternate-endpoint attempts produced no release." },
  { number: "24", title: "Outcome preserved", chainLink: "OUTCOME", result: "PASS", reasonCode: "ZERO_DOSING_CHANGES", summary: "No governed execution or dosing transition occurred." },
];

const evidence: EvidenceItem[] = [
  {
    id: "EA-000007-EV-01",
    title: "Water-treatment dosing adjustment request",
    source: "TA-14 Scenario Author",
    type: "DECLARATION",
    disclosure: "PUBLIC",
    status: "ADMITTED",
    capturedAt: "2026-07-31 19:12:00 UTC",
    hash: "1aa79af3...d4c2",
    supports: "Exact target environment, scope, dosing request, destination, and dosing-threshold boundary.",
    limitation: "Controlled demonstration record; no live treatment systems were changed.",
  },
  {
    id: "EA-000007-EV-02",
    title: "Frozen dosing-threshold route",
    source: "TA-14 Route Resolver",
    type: "SYSTEM_RECORD",
    disclosure: "PUBLIC",
    status: "ADMITTED",
    capturedAt: "2026-07-31 19:12:07 UTC",
    hash: "8f7e21c9...a985",
    supports: "Route version, scope-bound authorization rule, gate order, and revalidation triggers.",
    limitation: "Valid only for route version 1.0.0 and this bounded event.",
  },
  {
    id: "EA-000007-EV-03",
    title: "Water-quality request and operating package",
    source: "TA-14 Evidence Custodian",
    type: "BUSINESS_RECORD",
    disclosure: "SELECTIVE",
    status: "ADMITTED",
    capturedAt: "2026-07-31 19:12:10 UTC",
    hash: "bf90e123...93d1",
    supports: "Dosing change purpose, dosing request scope, operating change request relationship, and requested due state.",
    limitation: "Does not independently establish execution authority.",
  },
  {
    id: "EA-000007-EV-04",
    title: "Delegated dosing authority record",
    source: "TA-14 Authority Resolver",
    type: "AUTHORITY_RECORD",
    disclosure: "SELECTIVE",
    status: "CONDITIONAL",
    capturedAt: "2026-07-31 19:12:11 UTC",
    hash: "6cf0c40a...6721",
    supports: "Executor identity and initial delegated approval scope.",
    limitation: "Superseded by the later violation event before commit.",
  },
  {
    id: "EA-000007-EV-05",
    title: "Threshold exceedance event",
    source: "TA-14 Authority Resolver",
    type: "AUTHORITY_EVENT",
    disclosure: "SELECTIVE",
    status: "ADMITTED",
    capturedAt: "2026-07-31 19:15:41 UTC",
    hash: "e02c9097...4cb8",
    supports: "The required authorized scope was exceeded before execution commitment.",
    limitation: "Proves the bounded state change, not the underlying reason for violation.",
  },
  {
    id: "EA-000007-EV-06",
    title: "Pre-execution revalidation ledger",
    source: "TA-14 Continuity Validator",
    type: "SYSTEM_RECORD",
    disclosure: "PUBLIC",
    status: "ADMITTED",
    capturedAt: "2026-07-31 19:15:43 UTC",
    hash: "5a10cb73...e776",
    supports: "The version state changed and dependent gates required rerun.",
    limitation: "Bounded to the disclosed route inputs and event window.",
  },
  {
    id: "EA-000007-EV-07",
    title: "Escalation-and-hold execution receipt",
    source: "TA-14 Reference Water-Control Adapter",
    type: "EXECUTION_RECEIPT",
    disclosure: "PUBLIC",
    status: "ADMITTED",
    capturedAt: "2026-07-31 19:16:03 UTC",
    hash: "58a1b51e...e52f",
    supports: "The committed ESCALATE prevented the unauthorized dosing invocation from reaching any water-control surface and preserved the rejected request.",
    limitation: "Proves control of the TA-14 reference dosing adapter for this bounded event; it does not establish control over unrelated external dosing change systems.",
  },
  {
    id: "EA-000007-EV-08",
    title: "Zero-dosing-change outcome closure",
    source: "TA-14 Outcome Verifier",
    type: "OUTCOME_EVIDENCE",
    disclosure: "PUBLIC",
    status: "ADMITTED",
    capturedAt: "2026-07-31 19:17:20 UTC",
    hash: "bd21dd3a...79e4",
    supports: "No governed execution was released and the request remained preserved.",
    limitation: "Outcome verification is bounded to the observed adapter, queue, and event window.",
  },
];

const thresholdEvents: ThresholdEvent[] = [
  {
    time: "19:12:11",
    event: "AUTHORITY RESOLVED",
    detail: "The approved execution scope was limited to staging diagnostics using dosing profile 5% with read-only privileges.",
    state: "VALID",
  },
  {
    time: "19:13:02",
    event: "APPROVED VERSION PRESERVED",
    detail: "The approval remained valid for five-percent delegated adjustment only.",
    state: "VALID",
  },
  {
    time: "19:15:41",
    event: "VERSION MISMATCH DETECTED",
    detail: "The commit validator detected requested 12% dosing increase before release.",
    state: "CHANGED",
  },
  {
    time: "19:15:43",
    event: "DEPENDENT GATES INVALIDATED",
    detail: "Version parity and all dependent commit and execution controls were evaluated.",
    state: "REVALIDATE",
  },
  {
    time: "19:16:02",
    event: "ESCALATE BINDINGTED",
    detail: "The route fixed ESCALATE and blocked execution pending new bounded authorization.",
    state: "ESCALATED",
  },
];

const verificationChecks: VerificationCheck[] = [
  {
    level: "L0",
    label: "Declared record",
    detail: "Publisher identity, artifact ID, route, determination, and limits are visible.",
  },
  {
    level: "L1",
    label: "Package integrity",
    detail: "Every exported component reproduces its published component hash.",
  },
  {
    level: "L2",
    label: "Signature validity",
    detail: "The manifest validates against the declared TA-14 demonstration key.",
  },
  {
    level: "L3",
    label: "Record parity",
    detail: "Page, JSON, manifest, route, receipt, and outcome resolve to one frozen record.",
  },
  {
    level: "L4",
    label: "Replay consistency",
    detail: "Disclosed inputs reproduce ESCALATE after the scope violation event.",
  },
  {
    level: "L5",
    label: "Execution effect",
    detail: "The adapter receipt proves ESCALATED, HTTP 202, command suspension, zero dosing changes, and blocked bypass.",
  },
  {
    level: "L6",
    label: "Outcome closure",
    detail: "Queue and target environment state support the reported zero-mutation outcome.",
  },
];

const acceptanceTests: AcceptanceTest[] = [
  {
    id: "AT-01",
    result: "PASS",
    condition: "One immutable artifact root identifies the event and all linked records.",
  },
  {
    id: "AT-02",
    result: "PASS",
    condition: "The violation was appended; the earlier approval was not silently overwritten.",
  },
  {
    id: "AT-03",
    result: "PASS",
    condition: "ESCALATE produced the required block, token-revocation, and zero-mutation execution effect.",
  },
  {
    id: "AT-04",
    result: "PASS",
    condition: "The failed Commit and version-continuity gate could not be skipped, overridden, or relabeled to reach ALLOW.",
  },
  {
    id: "AT-05",
    result: "PASS",
    condition: "The unauthorized dosing-threshold request triggered the mandatory boundary prohibition and produced ESCALATE before adapter release.",
  },
  {
    id: "AT-06",
    result: "PASS",
    condition: "The adapter produced a technical receipt proving escalation, command suspension, and zero dosing transition.",
  },
  {
    id: "AT-07",
    result: "PASS",
    condition: "Public representations identify the same route, commit, receipt, and root hash.",
  },
  {
    id: "AT-08",
    result: "PASS",
    condition: "The verification package declares how alteration is detected.",
  },
  {
    id: "AT-09",
    result: "PASS",
    condition: "Selective authority details remain bounded while public commitments remain visible.",
  },
  {
    id: "AT-10",
    result: "PASS",
    condition: "The artifact states what it proves and what it does not prove.",
  },
];

const packageRecord = {
  schema: "ta14.execution-artifact.v2.1",
  engineVersion: "2.1.0",
  artifact: {
    artifactId: ARTIFACT_ID,
    title: ARTIFACT_TITLE,
    sequence: 7,
    totalInRelease: 12,
    classification: "CANONICAL EXECUTION PROOF",
    publicationState: "PUBLISHED",
    determination: "ESCALATE",
    verificationLevel: 6,
    simulated: true,
  },
  scenario: {
    proposedAction:
      "Deploy one named dosing profile only to the authorized environment, with the exact approved privileges, version, time window, and rollback controls.",
    scope: "treatment dosing profile 12%.00",
    consequenceAtStake:
      "No automated dosing change above the delegated five-percent threshold may bind without named higher-authority review.",
    affectedSubjects: [
      "TA-14 controlled demonstration environment",
      "named water-treatment control environment",
      "reference dosing adapter",
      "authorized water-quality reviewers",
    ],
    declaredLimits: [
      "No treatment customer system is affected.",
      "The record proves one bounded event only.",
      "The record does not certify every future route, adapter, or execution.",
    ],
  },
  route: {
    routeId: ROUTE_ID,
    routeVersion: ROUTE_VERSION,
    gateCount: 24,
    earliestFailure: "BINDING",
    earliestFailureGate: "15",
    reasonCodes: [
      "THRESHOLD_EXCEEDED",
      "AUTHORITY_INADMISSIBLE",
      "DUAL_AUTHORITY_UNSATISFIED",
    ],
    requiredRepair: [
      "Obtain a named chief water-quality officer determination for the twelve-percent adjustment.",
      "Preserve the adjudication record, approved percentage, effective time, and operating limits.",
      "Rerun continuity, admissibility, binding, commit, and pre-execution revalidation gates.",
      "Generate a new bounded commit and receipt; do not convert this escalation record into an approval.",
    ],
  },
  commit: {
    determination: "ESCALATE",
    committedAt: "2026-07-31T19:16:02Z",
    permittedNextAction: "EXECUTIVE_REVIEW_AND_REVALIDATE",
    prohibitedAction: "AUTOMATED_DOSING_CHANGE",
  },
  execution: {
    adapter: "TA-14 Reference Water-Control Adapter",
    adapterVersion: "1.0.0",
    command: "HOLD_AND_ROUTE",
    technicalStatus: 202,
    receiptId: "EA-000007-EX-01",
    receiptHash: RECEIPT_HASH,
    dosingChanges: 0,
    bypassDetected: false,
  },
  outcome: {
    state: "DENIAL_PRESERVED",
    treatmentEnvironmentChanged: false,
    unauthorizedChangesApplied: false,
    residualRisk: "Operational delay until a newly bounded authorization is created and evaluated.",
    verifiedAt: "2026-07-31T19:17:20Z",
  },
  integrity: {
    canonicalization: "ta14.c14n.v1",
    recordHash: RECORD_HASH,
    packageHash: PACKAGE_HASH,
    verifierVersion: "ta14.verifier.reference.v1",
    signingKey: "ta14://keys/demonstration/2026-01",
  },
  chain,
  gates,
  evidence,
  thresholdEvents,
  verificationChecks,
  acceptanceTests,
};

const integrityManifest = {
  artifactId: ARTIFACT_ID,
  routeId: ROUTE_ID,
  routeVersion: ROUTE_VERSION,
  determination: "ESCALATE",
  recordHash: RECORD_HASH,
  packageHash: PACKAGE_HASH,
  components: {
    canonicalRecord: "sha256:4c4f4f98...9bc2f",
    routeSnapshot: "sha256:8f7e21c9...a985",
    evidenceManifest: "sha256:3fa02c11...776a",
    authorityLedger: "sha256:e02c9097...4cb8",
    executionReceipt: RECEIPT_HASH,
    outcomeRecord: "sha256:bd21dd3a...79e4",
  },
  verification: {
    expectedResult: "VERIFIED",
    maximumPublicLevel: 6,
    canonicalization: "ta14.c14n.v1",
    verifier: "ta14.verifier.reference.v1",
  },
};



const thresholdMatrix = [
  { field: "Adjustment percentage", authorized: "Up to 5%", requested: "12% increase", result: "FAIL", rule: "Delegated quantitative authority may not be exceeded." },
  { field: "Operator authority", authorized: "Routine bounded adjustment", requested: "Major process adjustment", result: "FAIL", rule: "Major dosing changes require named higher-authority review." },
  { field: "Coagulant setpoint", authorized: "Baseline plus 5% maximum", requested: "Baseline plus 12%", result: "FAIL", rule: "The numerical ceiling is part of the committed scope." },
  { field: "Decision authority", authorized: "Shift operator", requested: "Chief water-quality officer", result: "FAIL", rule: "The requested consequence exceeds shift-level authority." },
  { field: "Revalidation", authorized: "Immediate pre-action check", requested: "Pending adjudication", result: "PASS", rule: "The held command remains subject to complete revalidation after review." },
  { field: "Operator identity", authorized: "Resolved operator WQ-117", requested: "Same operator", result: "PASS", rule: "Valid identity does not enlarge delegated authority." },
];

const prohibitedCapabilities = [
  "Direct release of a dosing change above five percent",
  "Self-expansion of delegated operating authority",
  "Substitution of an unapproved quantitative setpoint",
  "Execution before named higher-authority adjudication",
  "Release without complete pre-action revalidation",
  "Alternate-path dosing change after escalation",
];

const newAuthorizationRequirements = [
  "Record the chief water-quality officer’s named determination and authority source.",
  "Fix the exact approved adjustment percentage, duration, affected train, and operating limits.",
  "Bind the approval to the current influent measurements, jar-test result, and immutable request hash.",
  "Define the execution window and perform immediate pre-dosing revalidation.",
  "Preserve rollback instructions, monitoring thresholds, and accountable intervention authority.",
  "Run the complete route as a new event; never overwrite this escalation.",
];

const thresholdRules = [
  {
    id: "BR-01",
    title: "Destination specificity",
    requirement: "The committed authorization must name the exact environment and destination resources.",
    observed: "The preserved delegation permitted a maximum five-percent adjustment. The request sought twelve percent.",
    consequence: "The quantitative expansion cannot be inferred from general operating access.",
  },
  {
    id: "BR-02",
    title: "Privilege specificity",
    requirement: "Every consequential capability must be expressly enumerated before commit.",
    observed: "Routine bounded adjustment was authorized; a major process adjustment was requested.",
    consequence: "The twelve-percent change remained outside the delegated operating profile.",
  },
  {
    id: "BR-03",
    title: "Dosing profile identity continuity",
    requirement: "The requested setpoint, percentage, duration, and affected treatment train must match the authorized object.",
    observed: "Authorization covered 5%; the request substituted 12%.",
    consequence: "A larger quantitative intervention cannot inherit authority from a smaller delegated adjustment.",
  },
  {
    id: "BR-04",
    title: "Threshold activation rule",
    requirement: "A threshold-exceeding action must remain held until named adjudication and revalidation are complete.",
    observed: "The request sought immediate release before the required higher-authority determination.",
    consequence: "Urgency did not enlarge delegated authority.",
  },
  {
    id: "BR-05",
    title: "Rollback readiness",
    requirement: "A bounded rollback and monitoring plan must exist before a threshold-exceeding treatment adjustment.",
    observed: "The original package did not yet contain a higher-authority-approved intervention plan.",
    consequence: "The route could not bind until adjudication, monitoring, and rollback conditions were fixed.",
  },
  {
    id: "BR-06",
    title: "No scope inheritance",
    requirement: "Identity, expertise, prior approval, and platform access do not enlarge authority.",
    observed: "The same resolved operator submitted the valid routine request and the threshold-exceeding request.",
    consequence: "Known identity strengthened attribution but did not cure the scope violation.",
  },
  {
    id: "BR-07",
    title: "No alternate-path release",
    requirement: "An escalated request may not be resubmitted through a less-governed adapter under the same state.",
    observed: "The adapter suspended the execution token and recorded the attempted fallback path.",
    consequence: "The same invalid state remained escalated across all governed paths.",
  },
  {
    id: "BR-08",
    title: "New event for new authority",
    requirement: "A materially broader authorization must create a new route event.",
    observed: "No higher-authority approval for twelve percent existed in the frozen record.",
    consequence: "Repair requires a new authorization and a complete rerun, not an amendment that rewrites this escalation.",
  },
];


const thresholdControlEvidence = [
  {
    id: "VC-01",
    title: "Delegated adjustment threshold",
    required: "5%",
    observed: "12%",
    result: "FAIL",
    consequence: "The requested adjustment exceeds the exact percentage named in the frozen delegation.",
  },
  {
    id: "VC-02",
    title: "Request-and-measurement digest",
    required: "sha256:delegated-threshold-5",
    observed: "sha256:requested-adjustment-12",
    result: "FAIL",
    consequence: "The requested major-adjustment package is distinct from the delegated routine-adjustment commitment.",
  },
  {
    id: "VC-03",
    title: "Route snapshot version",
    required: "2.0.0",
    observed: "2.0.0",
    result: "PASS",
    consequence: "The governing route remained unchanged and attributable.",
  },
  {
    id: "VC-04",
    title: "Target endpoint",
    required: "governed-dosing-primary",
    observed: "governed-dosing-primary",
    result: "PASS",
    consequence: "The requested destination matched the authorized endpoint.",
  },
  {
    id: "VC-05",
    title: "Execution privilege set",
    required: "bounded-inference",
    observed: "bounded-inference",
    result: "PASS",
    consequence: "The privilege set remained inside the authorized capability boundary.",
  },
  {
    id: "VC-06",
    title: "Requester identity",
    required: "actor-117",
    observed: "actor-117",
    result: "PASS",
    consequence: "The request remained attributable to the same resolved actor.",
  },
  {
    id: "VC-07",
    title: "Approval authority",
    required: "authority-A17",
    observed: "authority-A17",
    result: "PASS",
    consequence: "The approval source remained valid but version-specific.",
  },
  {
    id: "VC-08",
    title: "Operating change request",
    required: "CHG-7406",
    observed: "CHG-7406",
    result: "PASS",
    consequence: "The change record remained continuous and current.",
  },
  {
    id: "VC-09",
    title: "Chemical program identity",
    required: "coagulant-program-A",
    observed: "coagulant-program-A",
    result: "PASS",
    consequence: "The chemical program matched; program identity did not cure the exceeded percentage ceiling.",
  },
  {
    id: "VC-10",
    title: "Sensor and calculation package",
    required: "baseline-package-5",
    observed: "adjustment-package-12",
    result: "FAIL",
    consequence: "The requested adjustment relied on a distinct calculation package requiring review.",
  },
  {
    id: "VC-11",
    title: "Safety policy bundle",
    required: "policy-31",
    observed: "policy-31",
    result: "PASS",
    consequence: "The safety policy bundle remained current and applicable.",
  },
  {
    id: "VC-12",
    title: "Adapter contract",
    required: "adapter-2.4",
    observed: "adapter-2.4",
    result: "PASS",
    consequence: "The adapter contract remained compatible and unchanged.",
  },
  {
    id: "VC-13",
    title: "Approval timestamp",
    required: "19:05:00 UTC",
    observed: "19:05:00 UTC",
    result: "PASS",
    consequence: "The approval timestamp remained preserved and unaltered.",
  },
  {
    id: "VC-14",
    title: "Requested execution time",
    required: "19:16:03 UTC",
    observed: "19:16:03 UTC",
    result: "PASS",
    consequence: "The invocation occurred inside the authorized time window.",
  },
  {
    id: "VC-15",
    title: "Intervention rollback package",
    required: "routine-rollback",
    observed: "major-adjustment-rollback",
    result: "FAIL",
    consequence: "The major-adjustment rollback package required higher-authority acceptance.",
  },
  {
    id: "VC-16",
    title: "Signature key",
    required: "TA14-KMS-17",
    observed: "TA14-KMS-17",
    result: "PASS",
    consequence: "The signing identity remained valid; signature validity did not authorize 12%.",
  },
  {
    id: "VC-17",
    title: "Controller command resolution",
    required: "operator-command → max-5%",
    observed: "operator-command → 12%",
    result: "FAIL",
    consequence: "The controller command requested a value above the operator’s delegated threshold.",
  },
  {
    id: "VC-18",
    title: "Fallback controller path",
    required: "5%",
    observed: "12%",
    result: "FAIL",
    consequence: "The fallback path also preserved the twelve-percent request and remained held.",
  },
];

const escalationInvariants = [
  "The escalated request never received a release-capable dosing command.",
  "No chemical setpoint or treatment-controller state changed.",
  "The original five-percent delegation remains visible and is not falsely labeled invalid.",
  "The twelve-percent request remains attributable to the requesting operator.",
  "The ESCALATE commit precedes adapter invocation and cannot be backdated.",
  "The execution receipt, outcome record, public page, and manifest resolve to one event.",
  "Revalidation alone cannot cure an exceeded delegated threshold; named adjudication is required.",
  "Only a named higher-authority determination can support a new treatment route.",
  "The escalation does not certify twelve percent as unsafe; it proves the operator could not authorize it alone.",
  "The zero-mutation outcome is verified independently from the determination record.",
];

const packageComponents = [
  { id: "PKG-01", name: "Canonical bounded record", format: "JSON", status: "INCLUDED", purpose: "Machine-readable root event" },
  { id: "PKG-02", name: "Human-readable inspection record", format: "HTML/PDF", status: "INCLUDED", purpose: "Public inspection and review" },
  { id: "PKG-03", name: "Frozen scenario snapshot", format: "JSON", status: "INCLUDED", purpose: "Exact proposed consequence" },
  { id: "PKG-04", name: "Route snapshot", format: "JSON", status: "INCLUDED", purpose: "Versioned gates and quantitative thresholds" },
  { id: "PKG-05", name: "Evidence manifest", format: "JSON", status: "INCLUDED", purpose: "Source, freshness, custody, hashes" },
  { id: "PKG-06", name: "Authority ledger", format: "JSON", status: "INCLUDED", purpose: "Identity, delegation, scope, expiry" },
  { id: "PKG-07", name: "Threshold comparison matrix", format: "JSON", status: "INCLUDED", purpose: "Delegated versus requested dosing percentage" },
  { id: "PKG-08", name: "24-link runtime ledger", format: "JSON", status: "INCLUDED", purpose: "Ordered gate results" },
  { id: "PKG-09", name: "Determination commit", format: "JSON", status: "INCLUDED", purpose: "Fixed ESCALATE before action" },
  { id: "PKG-10", name: "Execution escalation receipt", format: "JSON", status: "INCLUDED", purpose: "HTTP 202, held command, and executive routing" },
  { id: "PKG-11", name: "Bypass-attempt record", format: "JSON", status: "INCLUDED", purpose: "Alternate-path prevention" },
  { id: "PKG-12", name: "Outcome closure", format: "JSON", status: "INCLUDED", purpose: "Verified zero dosing changes" },
  { id: "PKG-13", name: "Integrity manifest", format: "JSON", status: "INCLUDED", purpose: "Component and package hashes" },
  { id: "PKG-14", name: "Verification instructions", format: "TXT", status: "INCLUDED", purpose: "Online and offline verification" },
  { id: "PKG-15", name: "Challenge record template", format: "JSON", status: "INCLUDED", purpose: "Bounded objection pathway" },
  { id: "PKG-16", name: "Claims-version statement", format: "TXT", status: "INCLUDED", purpose: "What the artifact does and does not prove" },
  { id: "PKG-17", name: "Acceptance-test report", format: "JSON", status: "INCLUDED", purpose: "Required invariant checks" },
  { id: "PKG-18", name: "Public verifier result", format: "JSON", status: "INCLUDED", purpose: "Package parity and outcome closure" },
  { id: "PKG-19", name: "Correction and supersession ledger", format: "JSON", status: "INCLUDED", purpose: "Append-only lifecycle" },
  { id: "PKG-20", name: "Reviewer briefing", format: "TXT", status: "INCLUDED", purpose: "Independent inspection scope" },
];

const styles = `
  :root {
    --bg: #02070d;
    --bg-2: #06111c;
    --panel: rgba(7, 20, 31, .82);
    --panel-2: rgba(10, 28, 43, .92);
    --line: rgba(142, 196, 230, .17);
    --line-strong: rgba(142, 196, 230, .34);
    --text: #edf7ff;
    --muted: #8da7ba;
    --cyan: #65dfff;
    --blue: #78a8ff;
    --green: #63f0bd;
    --amber: #ffc56b;
    --red: #ff7b8f;
    --shadow: 0 28px 80px rgba(0, 0, 0, .42);
  }

  * { box-sizing: border-box; }
  html { scroll-behavior: smooth; }
  body { margin: 0; }
  button, input, textarea { font: inherit; }
  button { color: inherit; }

  .artifact-page {
    min-height: 100vh;
    color: var(--text);
    background:
      radial-gradient(circle at 10% 0%, rgba(58, 157, 216, .17), transparent 34%),
      radial-gradient(circle at 92% 14%, rgba(255, 176, 82, .1), transparent 30%),
      linear-gradient(180deg, #02070d 0%, #06101a 48%, #02070d 100%);
    position: relative;
    overflow: hidden;
  }

  .artifact-page::before {
    content: "";
    position: fixed;
    inset: 0;
    pointer-events: none;
    opacity: .22;
    background-image:
      linear-gradient(rgba(123, 190, 231, .07) 1px, transparent 1px),
      linear-gradient(90deg, rgba(123, 190, 231, .07) 1px, transparent 1px);
    background-size: 44px 44px;
    mask-image: linear-gradient(to bottom, black, transparent 78%);
  }

  .artifact-page::after {
    content: "";
    position: fixed;
    width: 700px;
    height: 700px;
    right: -380px;
    top: 140px;
    border-radius: 50%;
    border: 1px solid rgba(101, 223, 255, .16);
    box-shadow:
      0 0 0 80px rgba(101, 223, 255, .02),
      0 0 0 180px rgba(101, 223, 255, .015);
    pointer-events: none;
  }

  .artifact-shell {
    width: min(1540px, calc(100% - 36px));
    margin: 0 auto;
    padding: 28px 0 70px;
    position: relative;
    z-index: 1;
  }

  .artifact-topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 18px;
    margin-bottom: 24px;
  }

  .artifact-brand {
    display: flex;
    align-items: center;
    gap: 12px;
    color: var(--text);
    text-decoration: none;
  }

  .artifact-mark {
    width: 42px;
    height: 42px;
    border: 1px solid var(--line-strong);
    border-radius: 12px;
    display: grid;
    place-items: center;
    font-weight: 900;
    letter-spacing: -.04em;
    background: linear-gradient(145deg, rgba(101,223,255,.14), rgba(120,168,255,.04));
    box-shadow: inset 0 0 22px rgba(101,223,255,.08);
  }

  .artifact-brand-copy strong,
  .artifact-brand-copy span { display: block; }
  .artifact-brand-copy strong { font-size: 13px; letter-spacing: .12em; }
  .artifact-brand-copy span { color: var(--muted); font-size: 12px; margin-top: 2px; }

  .artifact-top-actions {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
    justify-content: flex-end;
  }

  .artifact-link,
  .artifact-button {
    min-height: 42px;
    padding: 0 16px;
    border-radius: 12px;
    border: 1px solid var(--line);
    background: rgba(9, 25, 38, .7);
    color: var(--text);
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    cursor: pointer;
    transition: .2s ease;
  }

  .artifact-link:hover,
  .artifact-button:hover {
    transform: translateY(-1px);
    border-color: rgba(101,223,255,.5);
    background: rgba(12, 35, 52, .94);
  }

  .artifact-button.primary {
    border-color: rgba(99, 240, 189, .42);
    background: linear-gradient(135deg, rgba(99,240,189,.2), rgba(101,223,255,.1));
  }

  .artifact-button:disabled { opacity: .62; cursor: wait; transform: none; }

  .artifact-hero {
    position: relative;
    border: 1px solid var(--line);
    border-radius: 28px;
    overflow: hidden;
    background:
      linear-gradient(135deg, rgba(10, 29, 43, .94), rgba(3, 12, 20, .94)),
      var(--bg-2);
    box-shadow: var(--shadow);
    margin-bottom: 18px;
  }

  .artifact-hero::before {
    content: "";
    position: absolute;
    inset: 0;
    background:
      radial-gradient(circle at 72% 22%, rgba(255,197,107,.16), transparent 25%),
      linear-gradient(90deg, transparent 0 64%, rgba(101,223,255,.04) 64% 65%, transparent 65%);
    pointer-events: none;
  }

  .artifact-hero-grid {
    display: grid;
    grid-template-columns: minmax(0, 1.35fr) minmax(340px, .65fr);
    min-height: 410px;
    position: relative;
  }

  .artifact-hero-copy {
    padding: clamp(28px, 4vw, 62px);
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .artifact-kicker {
    color: var(--cyan);
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: .18em;
    font-weight: 800;
  }

  .artifact-hero h1 {
    margin: 14px 0 16px;
    font-size: clamp(46px, 6vw, 92px);
    line-height: .92;
    letter-spacing: -.065em;
    max-width: 930px;
  }

  .artifact-hero h1 span { color: var(--amber); display: block; }
  .artifact-lede { max-width: 840px; color: #b8cbd8; font-size: clamp(16px, 1.5vw, 20px); line-height: 1.75; margin: 0; }

  .artifact-hero-meta {
    margin-top: 28px;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .artifact-chip {
    border: 1px solid var(--line);
    background: rgba(255,255,255,.025);
    padding: 9px 12px;
    border-radius: 999px;
    color: #c9d9e4;
    font-size: 12px;
  }

  .artifact-decision {
    position: relative;
    padding: 34px;
    border-left: 1px solid var(--line);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background: linear-gradient(180deg, rgba(255,197,107,.07), rgba(255,197,107,.015));
  }

  .artifact-decision::after {
    content: "";
    position: absolute;
    inset: 18px;
    border: 1px solid rgba(255,197,107,.12);
    border-radius: 20px;
    pointer-events: none;
  }

  .artifact-decision-label { color: var(--muted); text-transform: uppercase; letter-spacing: .18em; font-size: 11px; }
  .artifact-decision-word { font-size: clamp(64px, 7vw, 104px); font-weight: 950; color: var(--amber); letter-spacing: -.07em; line-height: .9; position: relative; z-index: 1; }
  .artifact-decision p { position: relative; z-index: 1; color: #c8d6df; line-height: 1.65; }

  .artifact-decision-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
    position: relative;
    z-index: 1;
  }

  .artifact-decision-cell {
    border: 1px solid rgba(255,197,107,.16);
    border-radius: 13px;
    padding: 13px;
    background: rgba(0,0,0,.16);
  }

  .artifact-decision-cell span,
  .artifact-stat span,
  .artifact-row span,
  .artifact-hash span { display: block; color: var(--muted); font-size: 11px; text-transform: uppercase; letter-spacing: .1em; }
  .artifact-decision-cell strong { display: block; margin-top: 5px; font-size: 13px; }

  .artifact-summary-grid {
    display: grid;
    grid-template-columns: repeat(6, minmax(0, 1fr));
    gap: 10px;
    margin: 18px 0;
  }

  .artifact-stat {
    border: 1px solid var(--line);
    border-radius: 16px;
    padding: 18px;
    background: rgba(7, 21, 32, .76);
    box-shadow: inset 0 1px rgba(255,255,255,.025);
  }

  .artifact-stat strong { display: block; margin-top: 7px; font-size: 20px; letter-spacing: -.03em; }

  .artifact-tabs {
    display: flex;
    gap: 8px;
    overflow-x: auto;
    padding: 10px;
    border: 1px solid var(--line);
    border-radius: 16px;
    background: rgba(5, 16, 25, .88);
    position: sticky;
    top: 12px;
    z-index: 20;
    backdrop-filter: blur(16px);
    margin-bottom: 18px;
  }

  .artifact-tab {
    white-space: nowrap;
    border: 1px solid transparent;
    border-radius: 11px;
    background: transparent;
    color: var(--muted);
    padding: 11px 14px;
    cursor: pointer;
  }

  .artifact-tab.active {
    color: var(--text);
    border-color: rgba(101,223,255,.28);
    background: linear-gradient(135deg, rgba(101,223,255,.13), rgba(120,168,255,.07));
  }

  .artifact-layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 330px;
    gap: 18px;
    align-items: start;
  }

  .artifact-main { min-width: 0; display: grid; gap: 18px; }
  .artifact-aside { display: grid; gap: 14px; position: sticky; top: 86px; }

  .artifact-panel,
  .artifact-side-card {
    border: 1px solid var(--line);
    border-radius: 20px;
    background: linear-gradient(145deg, rgba(8, 25, 38, .9), rgba(4, 14, 23, .92));
    box-shadow: 0 18px 56px rgba(0,0,0,.24), inset 0 1px rgba(255,255,255,.025);
  }

  .artifact-panel { padding: clamp(22px, 3vw, 34px); }
  .artifact-panel-head { display: flex; justify-content: space-between; gap: 20px; margin-bottom: 24px; }
  .artifact-panel-head h2 { margin: 4px 0 0; font-size: clamp(26px, 3vw, 42px); letter-spacing: -.045em; }
  .artifact-panel-head p { margin: 8px 0 0; color: var(--muted); max-width: 800px; line-height: 1.65; }
  .artifact-overline { color: var(--cyan); font-size: 11px; text-transform: uppercase; letter-spacing: .17em; font-weight: 800; }

  .artifact-proof-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
  .artifact-proof-card { border: 1px solid var(--line); border-radius: 17px; padding: 20px; background: rgba(255,255,255,.018); }
  .artifact-proof-card h3 { margin: 8px 0 10px; font-size: 22px; }
  .artifact-proof-card p { margin: 0; color: #a9bdca; line-height: 1.65; }
  .artifact-proof-card.positive { border-color: rgba(99,240,189,.24); }
  .artifact-proof-card.boundary { border-color: rgba(255,197,107,.24); }

  .artifact-chain { display: grid; gap: 12px; }
  .artifact-chain-row {
    display: grid;
    grid-template-columns: 54px 150px minmax(0, 1fr) 74px;
    gap: 16px;
    align-items: start;
    padding: 18px;
    border: 1px solid var(--line);
    border-radius: 17px;
    background: rgba(255,255,255,.016);
  }
  .artifact-chain-row.fail { border-color: rgba(255,123,143,.26); background: linear-gradient(90deg, rgba(255,123,143,.07), transparent); }
  .artifact-number { width: 46px; height: 46px; border: 1px solid var(--line-strong); border-radius: 13px; display: grid; place-items: center; color: var(--cyan); font-weight: 800; }
  .artifact-chain-link strong { display: block; font-size: 18px; }
  .artifact-chain-link span { display: block; margin-top: 5px; color: var(--muted); font-size: 12px; line-height: 1.45; }
  .artifact-chain-copy strong { display: block; line-height: 1.55; }
  .artifact-chain-copy p { margin: 8px 0 0; color: var(--muted); line-height: 1.55; }

  .artifact-state { align-self: center; justify-self: end; font-size: 11px; font-weight: 900; letter-spacing: .12em; padding: 8px 10px; border-radius: 999px; border: 1px solid rgba(99,240,189,.28); color: var(--green); }
  .artifact-state.fail { color: var(--red); border-color: rgba(255,123,143,.3); }

  .artifact-gates { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
  .artifact-gate { border: 1px solid var(--line); border-radius: 16px; padding: 17px; background: rgba(255,255,255,.016); min-height: 190px; }
  .artifact-gate.fail { border-color: rgba(255,123,143,.28); background: linear-gradient(145deg, rgba(255,123,143,.07), rgba(255,255,255,.01)); }
  .artifact-gate-top { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
  .artifact-gate-no { color: var(--cyan); font-weight: 900; }
  .artifact-gate h3 { margin: 14px 0 8px; font-size: 17px; }
  .artifact-gate p { margin: 0; color: var(--muted); line-height: 1.55; }
  .artifact-reason { margin-top: 14px; padding-top: 12px; border-top: 1px solid var(--line); color: #c9d9e4; font-size: 11px; word-break: break-word; }

  .artifact-evidence-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
  .artifact-evidence-card { border: 1px solid var(--line); border-radius: 17px; padding: 20px; background: rgba(255,255,255,.016); }
  .artifact-evidence-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
  .artifact-evidence-id { color: var(--cyan); font-size: 11px; letter-spacing: .09em; }
  .artifact-badges { display: flex; gap: 6px; flex-wrap: wrap; justify-content: flex-end; }
  .artifact-badge { border: 1px solid var(--line); border-radius: 999px; padding: 6px 8px; font-size: 10px; color: #c6d6e1; }
  .artifact-badge.good { color: var(--green); border-color: rgba(99,240,189,.28); }
  .artifact-badge.warn { color: var(--amber); border-color: rgba(255,197,107,.28); }
  .artifact-evidence-card h3 { margin: 13px 0 8px; font-size: 20px; }
  .artifact-evidence-card > p { color: #a9bdca; line-height: 1.6; }
  .artifact-evidence-meta { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; margin: 16px 0; }
  .artifact-row { border: 1px solid var(--line); border-radius: 11px; padding: 11px; min-width: 0; }
  .artifact-row strong { display: block; margin-top: 5px; font-size: 12px; overflow-wrap: anywhere; }

  .artifact-authority-stage { display: grid; grid-template-columns: minmax(0, 1fr) 300px; gap: 18px; }
  .artifact-boundary-ledger { display: grid; gap: 12px; }
  .artifact-authority-event { display: grid; grid-template-columns: 82px minmax(0, 1fr) 94px; gap: 14px; padding: 17px; border: 1px solid var(--line); border-radius: 15px; background: rgba(255,255,255,.016); }
  .artifact-authority-event.changed { border-color: rgba(255,123,143,.28); }
  .artifact-authority-event time { color: var(--cyan); font-variant-numeric: tabular-nums; }
  .artifact-authority-event strong { display: block; }
  .artifact-authority-event p { margin: 6px 0 0; color: var(--muted); line-height: 1.5; }
  .artifact-authority-state { justify-self: end; align-self: start; border: 1px solid var(--line); border-radius: 999px; padding: 7px 9px; font-size: 10px; }
  .artifact-requirement-list { display: grid; gap: 9px; margin: 18px 0; }
  .artifact-requirement { display: grid; grid-template-columns: 34px minmax(0,1fr); gap: 10px; align-items: start; padding: 11px; border: 1px solid var(--line); border-radius: 12px; background: rgba(255,255,255,.018); }
  .artifact-requirement span { color: var(--cyan); font-size: 11px; letter-spacing: .12em; }
  .artifact-requirement p { margin: 0; color: var(--muted); line-height: 1.5; }
  .artifact-table td small { display: block; margin-top: 5px; color: var(--muted); line-height: 1.35; }
  .artifact-break-card { border: 1px solid rgba(255,123,143,.28); border-radius: 18px; padding: 22px; background: radial-gradient(circle at 50% 0%, rgba(255,123,143,.12), transparent 60%); }
  .artifact-break-card h3 { font-size: 34px; margin: 10px 0; color: var(--red); letter-spacing: -.04em; }
  .artifact-break-card p { color: #c0d0db; line-height: 1.65; }

  .artifact-effect { display: grid; grid-template-columns: 1fr 70px 1fr; gap: 18px; align-items: stretch; }
  .artifact-effect-box { border: 1px solid var(--line); border-radius: 18px; padding: 24px; background: rgba(255,255,255,.016); }
  .artifact-effect-box.held { border-color: rgba(255,197,107,.3); background: linear-gradient(145deg, rgba(255,197,107,.09), rgba(255,255,255,.01)); }
  .artifact-effect-box h3 { font-size: 32px; margin: 10px 0 12px; }
  .artifact-effect-box p { color: var(--muted); line-height: 1.6; }
  .artifact-effect-arrow { display: grid; place-items: center; font-size: 34px; color: var(--cyan); }
  .artifact-receipt-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; margin-top: 18px; }

  .artifact-timeline { position: relative; display: grid; gap: 12px; }
  .artifact-timeline::before { content: ""; position: absolute; left: 19px; top: 18px; bottom: 18px; width: 1px; background: linear-gradient(var(--cyan), rgba(255,197,107,.3)); }
  .artifact-event { position: relative; padding: 18px 18px 18px 56px; border: 1px solid var(--line); border-radius: 15px; background: rgba(255,255,255,.015); }
  .artifact-event::before { content: ""; position: absolute; left: 13px; top: 22px; width: 13px; height: 13px; border-radius: 50%; background: var(--cyan); box-shadow: 0 0 18px rgba(101,223,255,.55); }
  .artifact-event time { color: var(--cyan); font-size: 11px; letter-spacing: .08em; }
  .artifact-event strong { display: block; margin-top: 6px; font-size: 17px; }
  .artifact-event p { margin: 7px 0 0; color: var(--muted); line-height: 1.55; }

  .artifact-integrity-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
  .artifact-hash { border: 1px solid var(--line); border-radius: 15px; padding: 17px; background: rgba(255,255,255,.015); min-width: 0; }
  .artifact-hash code { display: block; margin-top: 8px; color: #c8eaff; overflow-wrap: anywhere; line-height: 1.5; }

  .artifact-acceptance { display: grid; gap: 10px; margin-top: 22px; }
  .artifact-acceptance-row { display: grid; grid-template-columns: 72px 70px minmax(0, 1fr); gap: 12px; align-items: center; padding: 13px; border: 1px solid var(--line); border-radius: 13px; }
  .artifact-acceptance-row span { color: var(--cyan); font-size: 12px; }
  .artifact-acceptance-row b { color: var(--green); font-size: 11px; }
  .artifact-acceptance-row p { margin: 0; color: var(--muted); line-height: 1.5; }

  .artifact-verify { display: grid; gap: 18px; }
  .artifact-verify-head { display: flex; justify-content: space-between; align-items: center; gap: 18px; }
  .artifact-verify-result { font-size: clamp(42px, 6vw, 78px); font-weight: 950; letter-spacing: -.055em; color: var(--green); }
  .artifact-progress { height: 10px; border-radius: 999px; background: rgba(255,255,255,.05); overflow: hidden; }
  .artifact-progress i { display: block; height: 100%; background: linear-gradient(90deg, var(--cyan), var(--green)); transition: width .35s ease; }
  .artifact-checks { display: grid; gap: 10px; }
  .artifact-check { display: grid; grid-template-columns: 50px minmax(0, 1fr) 72px; gap: 14px; align-items: center; padding: 15px; border: 1px solid var(--line); border-radius: 14px; }
  .artifact-check-level { color: var(--cyan); font-weight: 900; }
  .artifact-check strong { display: block; }
  .artifact-check p { margin: 5px 0 0; color: var(--muted); line-height: 1.45; }
  .artifact-check-state { justify-self: end; color: var(--green); font-size: 11px; font-weight: 900; }

  .artifact-challenge-grid { display: grid; grid-template-columns: .8fr 1.2fr; gap: 16px; }
  .artifact-challenge-card { border: 1px solid var(--line); border-radius: 17px; padding: 20px; background: rgba(255,255,255,.015); }
  .artifact-challenge-card h3 { margin: 8px 0 10px; }
  .artifact-challenge-card p, .artifact-challenge-card li { color: var(--muted); line-height: 1.6; }
  .artifact-challenge-card textarea { width: 100%; min-height: 160px; resize: vertical; border: 1px solid var(--line); border-radius: 13px; background: rgba(0,0,0,.22); color: var(--text); padding: 14px; outline: none; }
  .artifact-challenge-card textarea:focus { border-color: rgba(101,223,255,.5); }

  .artifact-side-card { padding: 20px; }
  .artifact-side-card h3 { margin: 8px 0 12px; font-size: 22px; }
  .artifact-side-card p { color: var(--muted); line-height: 1.6; }
  .artifact-side-list { display: grid; gap: 9px; }
  .artifact-side-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; border-top: 1px solid var(--line); padding-top: 10px; }
  .artifact-side-row span { color: var(--muted); font-size: 12px; }
  .artifact-side-row strong { text-align: right; font-size: 12px; }
  .artifact-downloads { display: grid; gap: 8px; }
  .artifact-download { width: 100%; min-height: 44px; border: 1px solid var(--line); border-radius: 12px; background: rgba(255,255,255,.02); color: var(--text); display: flex; align-items: center; justify-content: space-between; padding: 0 13px; cursor: pointer; text-align: left; }
  .artifact-download:hover { border-color: rgba(101,223,255,.45); background: rgba(101,223,255,.06); }
  .artifact-boundary { border-color: rgba(255,197,107,.24); }

  .artifact-footer { margin-top: 22px; border-top: 1px solid var(--line); padding-top: 18px; color: var(--muted); display: flex; justify-content: space-between; gap: 18px; font-size: 12px; }

  @media (max-width: 1180px) {
    .artifact-summary-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
    .artifact-layout { grid-template-columns: 1fr; }
    .artifact-aside { position: static; grid-template-columns: repeat(3, minmax(0, 1fr)); }
    .artifact-gates { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  }

  @media (max-width: 900px) {
    .artifact-hero-grid { grid-template-columns: 1fr; }
    .artifact-decision { border-left: 0; border-top: 1px solid var(--line); min-height: 310px; }
    .artifact-proof-grid,
    .artifact-evidence-grid,
    .artifact-integrity-grid,
    .artifact-authority-stage,
    .artifact-challenge-grid { grid-template-columns: 1fr; }
    .artifact-effect { grid-template-columns: 1fr; }
    .artifact-effect-arrow { transform: rotate(90deg); min-height: 44px; }
    .artifact-aside { grid-template-columns: 1fr; }
  }

  @media (max-width: 700px) {
    .artifact-shell { width: min(100% - 20px, 1540px); padding-top: 12px; }
    .artifact-topbar { align-items: flex-start; }
    .artifact-top-actions { display: none; }
    .artifact-summary-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .artifact-gates { grid-template-columns: 1fr; }
    .artifact-chain-row { grid-template-columns: 48px minmax(0, 1fr); }
    .artifact-chain-copy, .artifact-state { grid-column: 2; }
    .artifact-state { justify-self: start; }
    .artifact-authority-event { grid-template-columns: 70px minmax(0, 1fr); }
    .artifact-authority-state { grid-column: 2; justify-self: start; }
    .artifact-panel-head, .artifact-verify-head, .artifact-footer { flex-direction: column; align-items: flex-start; }
    .artifact-check { grid-template-columns: 42px minmax(0, 1fr); }
    .artifact-check-state { grid-column: 2; justify-self: start; }
  }

  .artifact-rule-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
    margin-top: 22px;
  }

  .artifact-rule-card {
    position: relative;
    overflow: hidden;
    padding: 18px;
    border: 1px solid var(--line);
    border-radius: 18px;
    background: linear-gradient(145deg, rgba(13, 35, 52, .88), rgba(5, 15, 24, .9));
    box-shadow: inset 0 1px 0 rgba(255,255,255,.035);
  }

  .artifact-rule-card::before {
    content: "";
    position: absolute;
    inset: 0 auto 0 0;
    width: 3px;
    background: linear-gradient(180deg, var(--red), var(--amber));
  }

  .artifact-rule-card header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 12px;
  }

  .artifact-rule-card header span {
    color: var(--red);
    font-size: 11px;
    font-weight: 900;
    letter-spacing: .14em;
  }

  .artifact-rule-card h4 {
    margin: 0;
    font-size: 16px;
  }

  .artifact-rule-block {
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid rgba(142,196,230,.12);
  }

  .artifact-rule-block small {
    display: block;
    color: var(--muted);
    font-weight: 800;
    letter-spacing: .08em;
    text-transform: uppercase;
    margin-bottom: 5px;
  }

  .artifact-rule-block p {
    margin: 0;
    color: #dbeaf5;
    line-height: 1.6;
  }

  .artifact-invariant-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
    margin-top: 18px;
  }

  .artifact-invariant {
    display: grid;
    grid-template-columns: 32px 1fr;
    align-items: start;
    gap: 10px;
    padding: 13px;
    border: 1px solid rgba(99,240,189,.15);
    border-radius: 14px;
    background: rgba(7,25,33,.62);
  }

  .artifact-invariant b {
    display: grid;
    place-items: center;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    color: var(--green);
    border: 1px solid rgba(99,240,189,.28);
    background: rgba(99,240,189,.08);
    font-size: 11px;
  }

  .artifact-invariant p {
    margin: 3px 0 0;
    color: #d9e9f4;
    line-height: 1.55;
  }

  .artifact-package-table {
    margin-top: 22px;
    border: 1px solid var(--line);
    border-radius: 18px;
    overflow: hidden;
  }

  .artifact-package-row {
    display: grid;
    grid-template-columns: 82px 1.3fr 100px 120px 1.4fr;
    gap: 12px;
    align-items: center;
    padding: 13px 15px;
    border-top: 1px solid rgba(142,196,230,.1);
    background: rgba(5,17,27,.72);
  }

  .artifact-package-row:first-child { border-top: 0; }
  .artifact-package-row:hover { background: rgba(12,34,50,.86); }
  .artifact-package-row span { color: var(--muted); font-size: 12px; }
  .artifact-package-row strong { font-size: 13px; }
  .artifact-package-row code { color: var(--cyan); font-size: 11px; }
  .artifact-package-row em { color: var(--green); font-style: normal; font-size: 11px; font-weight: 900; }
  .artifact-package-row p { margin: 0; color: #c6d8e5; font-size: 12px; line-height: 1.45; }

  @media (max-width: 900px) {
    .artifact-rule-grid,
    .artifact-invariant-grid { grid-template-columns: 1fr; }
    .artifact-package-row { grid-template-columns: 70px 1fr 86px; }
    .artifact-package-row p { grid-column: 2 / -1; }
    .artifact-package-row em { text-align: right; }
  }
`;

function downloadText(name: string, value: unknown) {
  const body = typeof value === "string" ? value : JSON.stringify(value, null, 2);
  const blob = new Blob([body], { type: typeof value === "string" ? "text/plain" : "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = name;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.suspendObjectURL(url);
}

function Panel({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <section className="artifact-panel">
      <div className="artifact-panel-head">
        <div>
          <div className="artifact-overline">{eyebrow}</div>
          <h2>{title}</h2>
          {subtitle ? <p>{subtitle}</p> : null}
        </div>
      </div>
      {children}
    </section>
  );
}

export default function ExecutionArtifact000006Page() {
  const [view, setView] = useState<View>("inspection");
  const [verificationState, setVerificationState] = useState<VerificationState>("IDLE");
  const [verifiedCount, setVerifiedCount] = useState(0);
  const [challenge, setChallenge] = useState("");
  const [challengeSaved, setChallengeSaved] = useState(false);

  const failedGates = useMemo(() => gates.filter((gate) => gate.result === "FAIL"), []);
  const passedGates = useMemo(() => gates.filter((gate) => gate.result === "PASS"), []);
  const verificationPercent = Math.round((verifiedCount / verificationChecks.length) * 100);

  function selectView(next: View) {
    setView(next);
    window.setTimeout(() => {
      document.getElementById("artifact-workspace")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 20);
  }

  function runVerification() {
    if (verificationState === "RUNNING") return;
    setVerificationState("RUNNING");
    setVerifiedCount(0);

    verificationChecks.forEach((_, index) => {
      window.setTimeout(() => {
        setVerifiedCount(index + 1);
        if (index === verificationChecks.length - 1) {
          setVerificationState("VERIFIED");
        }
      }, 380 * (index + 1));
    });
  }

  function saveChallenge() {
    setChallengeSaved(Boolean(challenge.trim()));
  }

  const tabs: Array<{ id: View; label: string }> = [
    { id: "inspection", label: "60-second inspection" },
    { id: "chain", label: "Eight-anchor chain" },
    { id: "dosing", label: "24-gate dosing" },
    { id: "evidence", label: "Evidence manifest" },
    { id: "threshold", label: "Unauthorized dosing threshold" },
    { id: "control", label: "Control receipt" },
    { id: "outcome", label: "Outcome closure" },
    { id: "integrity", label: "Integrity package" },
    { id: "verify", label: "Verification center" },
    { id: "challenge", label: "Challenge record" },
  ];

  return (
    <main className="artifact-page">
      <style>{styles}</style>
      <div className="artifact-shell">
        <header className="artifact-topbar">
          <Link className="artifact-brand" href="/artifacts">
            <span className="artifact-mark">14</span>
            <span className="artifact-brand-copy">
              <strong>TA-14 AUTHORITY</strong>
              <span>Execution Artifact Library</span>
            </span>
          </Link>
          <div className="artifact-top-actions">
            <Link className="artifact-link" href="/artifacts/ta14-ea-000006">← Artifact 000006</Link>
            <Link className="artifact-link" href="/artifacts">Artifact library</Link>
            <Link className="artifact-link" href="/workspace/artifacts/build">Build an artifact</Link>
          </div>
        </header>

        <section className="artifact-hero">
          <div className="artifact-hero-grid">
            <div className="artifact-hero-copy">
              <div className="artifact-kicker">Execution artifact 06 of 12 · canonical dosing-threshold proof</div>
              <h1>
                Unauthorized dosing threshold
                <span>stopped execution.</span>
              </h1>
              <p className="artifact-lede">
                A executor possessed valid delegated authority when the dosing change route began.
                That authority was exceeded before commitment. TA-14 preserved the change,
                invalidated dependent gates, committed ESCALATE, blocked the unauthorized dosing invocation, and closed
                the outcome with zero dosing changes executed.
              </p>
              <div className="artifact-hero-meta">
                <span className="artifact-chip">{ARTIFACT_ID}</span>
                <span className="artifact-chip">Route {ROUTE_VERSION}</span>
                <span className="artifact-chip">Earliest failure: BINDING / VERSION CONTINUITY</span>
                <span className="artifact-chip">Verification level: 6</span>
                <span className="artifact-chip">Controlled demonstration</span>
              </div>
            </div>

            <aside className="artifact-decision">
              <div>
                <div className="artifact-decision-label">Committed determination</div>
                <div className="artifact-decision-word">ESCALATE</div>
                <p>
                  Do not transmit. Preserve the request, restore valid authority, and rerun every
                  dependent gate before a new commit is considered.
                </p>
              </div>
              <div className="artifact-decision-grid">
                <div className="artifact-decision-cell">
                  <span>Control effect</span>
                  <strong>HTTP 202 · THRESHOLD EXCEEDED · ESCALATED</strong>
                </div>
                <div className="artifact-decision-cell">
                  <span>Dosing changes released</span>
                  <strong>$0.00</strong>
                </div>
                <div className="artifact-decision-cell">
                  <span>Earliest break</span>
                  <strong>Gate 07</strong>
                </div>
                <div className="artifact-decision-cell">
                  <span>Repair path</span>
                  <strong>Dosing + route version</strong>
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section className="artifact-summary-grid" aria-label="Artifact summary">
          <div className="artifact-stat"><span>Dosing gates</span><strong>24</strong></div>
          <div className="artifact-stat"><span>Passed</span><strong>{passedGates.length}</strong></div>
          <div className="artifact-stat"><span>Failed</span><strong>{failedGates.length}</strong></div>
          <div className="artifact-stat"><span>Evidence records</span><strong>{evidence.length}</strong></div>
          <div className="artifact-stat"><span>Execution receipt</span><strong>Preserved</strong></div>
          <div className="artifact-stat"><span>Public verification</span><strong>Level 6</strong></div>
        </section>

        <nav className="artifact-tabs" aria-label="Artifact inspection views">
          {tabs.map((tab) => (
            <button
              className={`artifact-tab ${view === tab.id ? "active" : ""}`}
              key={tab.id}
              type="button"
              onClick={() => selectView(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="artifact-layout" id="artifact-workspace">
          <div className="artifact-main">
            {view === "inspection" ? (
              <Panel
                eyebrow="Public inspection"
                title="Understand the bounded event in sixty seconds."
                subtitle="This view answers what was proposed, what governed it, why the decision occurred, whether the decision changed the action path, and what outcome followed."
              >
                <div className="artifact-proof-grid">
                  <article className="artifact-proof-card">
                    <div className="artifact-overline">Proposed consequence</div>
                    <h3>Deploy dosing profile 12% to the treatment decision environment with create, update, and delete privileges.</h3>
                    <p>
                      The route required current dosing change evidence, a frozen target environment destination,
                      valid authority, preserved continuity, an exact dosing manifest, and a
                      final pre-execution revalidation.
                    </p>
                  </article>
                  <article className="artifact-proof-card">
                    <div className="artifact-overline">Controlling condition</div>
                    <h3>Authorized scope changed before commit.</h3>
                    <p>
                      The initial delegation was real but no longer current. The violation event
                      occurred before the route fixed its determination, so the earlier approval could
                      not carry forward into execution.
                    </p>
                  </article>
                  <article className="artifact-proof-card positive">
                    <div className="artifact-overline">What this proves</div>
                    <h3>The architecture failed closed on dosing-threshold mismatch.</h3>
                    <p>
                      TA-14 did not treat an earlier valid approval as permanent permission. It
                      preserved the changed version state, reran dependent gates, committed ESCALATE,
                      and produced a technical non-release receipt.
                    </p>
                  </article>
                  <article className="artifact-proof-card boundary">
                    <div className="artifact-overline">What this does not prove</div>
                    <h3>No universal or treatment certification is claimed.</h3>
                    <p>
                      This controlled demonstration proves one bounded event through the TA-14
                      reference engine and adapter. It does not certify every organization, dosing change
                      rail, authority system, or future execution.
                    </p>
                  </article>
                </div>
              </Panel>
            ) : null}

            {view === "chain" ? (
              <Panel
                eyebrow="Canonical chain"
                title="The earliest unsupported link controlled the route."
                subtitle="Later success cannot repair a commit-stage threshold exceedance. Each anchor remains visible even when the path stops."
              >
                <div className="artifact-chain">
                  {chain.map((item) => (
                    <article
                      className={`artifact-chain-row ${item.result === "FAIL" ? "fail" : ""}`}
                      key={item.number}
                    >
                      <div className="artifact-number">{item.number}</div>
                      <div className="artifact-chain-link">
                        <strong>{item.link}</strong>
                        <span>{item.question}</span>
                      </div>
                      <div className="artifact-chain-copy">
                        <strong>{item.finding}</strong>
                        <p>{item.proof}</p>
                      </div>
                      <div className={`artifact-state ${item.result === "FAIL" ? "fail" : ""}`}>
                        {item.result}
                      </div>
                    </article>
                  ))}
                </div>
              </Panel>
            ) : null}

            {view === "dosing" ? (
              <Panel
                eyebrow="Complete dosing"
                title="Twenty-four gates preserved the decision path."
                subtitle="The first controlling failure occurred at gate 17 when requested 12% dosing increase failed exact parity with delegated 5% delegated adjustment."
              >
                <div className="artifact-gates">
                  {gates.map((gate) => (
                    <article
                      className={`artifact-gate ${gate.result === "FAIL" ? "fail" : ""}`}
                      key={gate.number}
                    >
                      <div className="artifact-gate-top">
                        <span className="artifact-gate-no">{gate.number}</span>
                        <span className={`artifact-state ${gate.result === "FAIL" ? "fail" : ""}`}>
                          {gate.result}
                        </span>
                      </div>
                      <div className="artifact-overline" style={{ marginTop: 14 }}>{gate.chainLink}</div>
                      <h3>{gate.title}</h3>
                      <p>{gate.summary}</p>
                      <div className="artifact-reason">{gate.reasonCode}</div>
                    </article>
                  ))}
                </div>
              </Panel>
            ) : null}

            {view === "evidence" ? (
              <Panel
                eyebrow="Evidence manifest"
                title="Every material record carries support and limitation."
                subtitle="The manifest exposes source identity, type, capture time, disclosure state, integrity commitment, admissibility status, and the boundary of what each item can prove."
              >
                <div className="artifact-evidence-grid">
                  {evidence.map((item) => (
                    <article className="artifact-evidence-card" key={item.id}>
                      <div className="artifact-evidence-top">
                        <div className="artifact-evidence-id">{item.id}</div>
                        <div className="artifact-badges">
                          <span className={`artifact-badge ${item.status === "ADMITTED" ? "good" : "warn"}`}>
                            {item.status}
                          </span>
                          <span className="artifact-badge">{item.disclosure}</span>
                        </div>
                      </div>
                      <h3>{item.title}</h3>
                      <p>{item.supports}</p>
                      <div className="artifact-evidence-meta">
                        <div className="artifact-row"><span>Source</span><strong>{item.source}</strong></div>
                        <div className="artifact-row"><span>Type</span><strong>{item.type}</strong></div>
                        <div className="artifact-row"><span>Captured</span><strong>{item.capturedAt}</strong></div>
                        <div className="artifact-row"><span>Hash</span><strong>{item.hash}</strong></div>
                      </div>
                      <p><strong>Limitation:</strong> {item.limitation}</p>
                    </article>
                  ))}
                </div>
              </Panel>
            ) : null}

            {view === "threshold" ? (
              <Panel
                eyebrow="Dosing version integrity"
                title="The identity and authority were valid. The requested dosing threshold was not authorized."
                subtitle="The architecture preserves the valid 5% authorization while refusing to transform it into permission for unapproved 12% dosing increase."
              >
                <div className="artifact-authority-stage">
                  <div className="artifact-boundary-ledger">
                    {thresholdEvents.map((event) => (
                      <article
                        className={`artifact-authority-event ${event.state === "CHANGED" ? "changed" : ""}`}
                        key={`${event.time}-${event.event}`}
                      >
                        <time>{event.time}</time>
                        <div>
                          <strong>{event.event}</strong>
                          <p>{event.detail}</p>
                        </div>
                        <span className="artifact-authority-state">{event.state}</span>
                      </article>
                    ))}
                  </div>
                  <aside className="artifact-break-card">
                    <div className="artifact-overline">Earliest failure</div>
                    <h3>Commit / dosing threshold continuity</h3>
                    <p>
                      Identity, provenance, continuity, evidence, authority, destination, and privileges remained intact. The controlling failure occurred at commit because requested 12% dosing increase did not match delegated 5% delegated adjustment.
                    </p>
                    <div className="artifact-row"><span>Gate</span><strong>17 · Delegated threshold evaluated</strong></div>
                    <div className="artifact-row" style={{ marginTop: 10 }}><span>Reason</span><strong>THRESHOLD_EXCEEDED</strong></div>
                  </aside>
                </div>
                <div className="artifact-section-heading" style={{ marginTop: 28 }}>
                  <div>
                    <div className="artifact-overline">Version rulebook</div>
                    <h3>Eight independent controls prevented version inheritance.</h3>
                  </div>
                </div>
                <div className="artifact-rule-grid">
                  {thresholdRules.map((rule) => (
                    <article className="artifact-rule-card" key={rule.id}>
                      <header><span>{rule.id}</span><h4>{rule.title}</h4></header>
                      <div className="artifact-rule-block"><small>Requirement</small><p>{rule.requirement}</p></div>
                      <div className="artifact-rule-block"><small>Observed state</small><p>{rule.observed}</p></div>
                      <div className="artifact-rule-block"><small>Governed consequence</small><p>{rule.consequence}</p></div>
                    </article>
                  ))}
                </div>
                <div className="artifact-section-heading" style={{ marginTop: 28 }}>
                  <div>
                    <div className="artifact-overline">Version-control evidence</div>
                    <h3>Eighteen checks isolate the mismatch without rewriting valid upstream state.</h3>
                  </div>
                </div>
                <div className="artifact-rule-grid">
                  {thresholdControlEvidence.map((control) => (
                    <article className="artifact-rule-card" key={control.id}>
                      <header>
                        <span>{control.id}</span>
                        <h4>{control.title}</h4>
                      </header>
                      <div className="artifact-rule-block">
                        <small>Required</small>
                        <p>{control.required}</p>
                      </div>
                      <div className="artifact-rule-block">
                        <small>Observed</small>
                        <p>{control.observed}</p>
                      </div>
                      <div className="artifact-rule-block">
                        <small>Result</small>
                        <p>{control.result}</p>
                      </div>
                      <div className="artifact-rule-block">
                        <small>Governed consequence</small>
                        <p>{control.consequence}</p>
                      </div>
                    </article>
                  ))}
                </div>
                <div className="artifact-section-heading" style={{ marginTop: 28 }}>
                  <div>
                    <div className="artifact-overline">Denial invariants</div>
                    <h3>What remained true throughout the governed stop.</h3>
                  </div>
                </div>
                <div className="artifact-invariant-grid">
                  {escalationInvariants.map((item, index) => (
                    <article className="artifact-invariant" key={item}>
                      <b>{String(index + 1).padStart(2, "0")}</b><p>{item}</p>
                    </article>
                  ))}
                </div>
              </Panel>
            ) : null}

            {view === "control" ? (
              <Panel
                eyebrow="Execution effect"
                title="The determination changed what the system could do."
                subtitle="This is the difference between governance and description. The reference dosing adapter received a ESCALATE command, rejected the unauthorized dosing transition request, suspended the pending dosing command, and generated a technical receipt."
              >
                <div className="artifact-effect">
                  <article className="artifact-effect-box">
                    <div className="artifact-overline">Attempted action</div>
                    <h3>Transmit treatment dosing profile 12%</h3>
                    <p>
                      Target environment, scope, destination, authority chain, route version, and event
                      window were frozen before dosing evaluation.
                    </p>
                    <div className="artifact-receipt-grid">
                      <div className="artifact-row"><span>Adapter</span><strong>Reference Dosing change Adapter</strong></div>
                      <div className="artifact-row"><span>Route</span><strong>{ROUTE_ID}</strong></div>
                    </div>
                  </article>
                  <div className="artifact-effect-arrow">→</div>
                  <article className="artifact-effect-box held">
                    <div className="artifact-overline">Enforced result</div>
                    <h3>ESCALATED · HTTP 202</h3>
                    <p>
                      The dosing invocation endpoint remained closed to the unauthorized scope. The rejected request was retained in a
                      controlled queue with no alternate-path release and no backdated approval.
                    </p>
                    <div className="artifact-receipt-grid">
                      <div className="artifact-row"><span>Receipt</span><strong>EA-000007-EX-01</strong></div>
                      <div className="artifact-row"><span>Dosing changes</span><strong>0</strong></div>
                      <div className="artifact-row"><span>Bypass</span><strong>NONE DETECTED</strong></div>
                      <div className="artifact-row"><span>Queue</span><strong>DENIAL_PRESERVED</strong></div>
                    </div>
                  </article>
                </div>
              </Panel>
            ) : null}

            {view === "outcome" ? (
              <Panel
                eyebrow="Outcome closure"
                title="The zero-mutation state was observed and preserved."
                subtitle="A ESCALATE artifact proves that a prohibited action did not bind to reality. Revalidation alone cannot cure a hard dosing-threshold mismatch; only a new, independently evaluated authorization can create a different route."
              >
                <div className="artifact-timeline">
                  <article className="artifact-event"><time>19:12:00 UTC</time><strong>Scenario intake sealed</strong><p>The exact dosing change, target environment, consequence, and declared limits entered the frozen record.</p></article>
                  <article className="artifact-event"><time>19:12:11 UTC</time><strong>Approved dosing resolved</strong><p>The authority record and delegated 5% delegated adjustment manifest were attributable, current, and internally consistent.</p></article>
                  <article className="artifact-event"><time>19:15:41 UTC</time><strong>Unauthorized dosing threshold detected</strong><p>The commit validator detected that 12% dosing increase did not match the frozen and delegated 5% delegated adjustment recorded before execution.</p></article>
                  <article className="artifact-event"><time>19:15:43 UTC</time><strong>Dependent gates rerun</strong><p>Admissibility, authority scope, binding, and commit logic were evaluated against the frozen request.</p></article>
                  <article className="artifact-event"><time>19:16:02 UTC</time><strong>ESCALATE committed</strong><p>The no-release state and repair requirement were fixed before adapter invocation.</p></article>
                  <article className="artifact-event"><time>19:16:03 UTC</time><strong>Threshold-exceeding dosing command held</strong><p>Receipt EA-000007-EX-01 recorded HTTP 202 and zero dosing changes executed.</p></article>
                  <article className="artifact-event"><time>19:17:20 UTC</time><strong>Outcome closed</strong><p>Target environment state remained unchanged and the request remained in DENIAL_PRESERVED.</p></article>
                  <article className="artifact-event"><time>19:18:10 UTC</time><strong>Package parity verified</strong><p>The public page, JSON, manifest, receipt, and outcome record resolved to one bounded event.</p></article>
                </div>
              </Panel>
            ) : null}

            {view === "integrity" ? (
              <Panel
                eyebrow="Integrity package"
                title="Every public representation resolves to the same frozen record."
                subtitle="The package exposes canonicalization, component commitments, a record root, a package root, verifier version, and declared signing-key reference."
              >
                <div className="artifact-integrity-grid">
                  <div className="artifact-hash"><span>Canonical record hash</span><code>{RECORD_HASH}</code></div>
                  <div className="artifact-hash"><span>Package root hash</span><code>{PACKAGE_HASH}</code></div>
                  <div className="artifact-hash"><span>Execution receipt hash</span><code>{RECEIPT_HASH}</code></div>
                  <div className="artifact-hash"><span>Canonicalization</span><code>ta14.c14n.v1</code></div>
                  <div className="artifact-hash"><span>Verifier version</span><code>ta14.verifier.reference.v1</code></div>
                  <div className="artifact-hash"><span>Signing key reference</span><code>ta14://keys/demonstration/2026-01</code></div>
                </div>
                <div className="artifact-section-heading" style={{ marginTop: 28 }}>
                  <div>
                    <div className="artifact-overline">Package inventory</div>
                    <h3>Twenty components preserve one bounded escalation event.</h3>
                  </div>
                </div>
                <div className="artifact-package-table">
                  {packageComponents.map((component) => (
                    <div className="artifact-package-row" key={component.id}>
                      <code>{component.id}</code>
                      <strong>{component.name}</strong>
                      <span>{component.format}</span>
                      <em>{component.status}</em>
                      <p>{component.purpose}</p>
                    </div>
                  ))}
                </div>
                <div className="artifact-acceptance">
                  {acceptanceTests.map((test) => (
                    <div className="artifact-acceptance-row" key={test.id}>
                      <span>{test.id}</span>
                      <b>{test.result}</b>
                      <p>{test.condition}</p>
                    </div>
                  ))}
                </div>
              </Panel>
            ) : null}

            {view === "verify" ? (
              <Panel
                eyebrow="Reference verification"
                title="Run the disclosed public verification sequence."
                subtitle="The in-page sequence demonstrates the expected verification path. Offline verification uses the downloadable canonical record and integrity manifest."
              >
                <div className="artifact-verify">
                  <div className="artifact-verify-head">
                    <div>
                      <div className="artifact-overline">Verification result</div>
                      <div className="artifact-verify-result">
                        {verificationState === "VERIFIED"
                          ? "VERIFIED"
                          : verificationState === "RUNNING"
                            ? "VERIFYING"
                            : "READY"}
                      </div>
                    </div>
                    <button
                      className="artifact-button primary"
                      type="button"
                      onClick={runVerification}
                      disabled={verificationState === "RUNNING"}
                    >
                      {verificationState === "RUNNING" ? "Verification running" : "Run verification"}
                    </button>
                  </div>
                  <div className="artifact-progress"><i style={{ width: `${verificationPercent}%` }} /></div>
                  <div className="artifact-checks">
                    {verificationChecks.map((check, index) => (
                      <div className="artifact-check" key={check.level}>
                        <div className="artifact-check-level">{check.level}</div>
                        <div>
                          <strong>{check.label}</strong>
                          <p>{check.detail}</p>
                        </div>
                        <div className="artifact-check-state">
                          {index < verifiedCount ? "PASS" : "PENDING"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Panel>
            ) : null}

            {view === "challenge" ? (
              <Panel
                eyebrow="Challenge and correction"
                title="The artifact remains inspectable, challengeable, and correctable."
                subtitle="A challenge may dispute evidence, boundary interpretation, route logic, technical effect, outcome closure, integrity, or the public claim. It may not silently rewrite the original event."
              >
                <div className="artifact-challenge-grid">
                  <article className="artifact-challenge-card">
                    <div className="artifact-overline">Challenge protocol</div>
                    <h3>Submit a bounded objection.</h3>
                    <ul>
                      <li>Identify the artifact, record, gate, or claim being disputed.</li>
                      <li>State the competing evidence, interpretation, or integrity concern.</li>
                      <li>Separate factual error from disagreement about scope or policy.</li>
                      <li>Preserve the original artifact while appending response and correction state.</li>
                    </ul>
                  </article>
                  <article className="artifact-challenge-card">
                    <div className="artifact-overline">Local challenge draft</div>
                    <h3>Record the objection before submission.</h3>
                    <textarea
                      value={challenge}
                      onChange={(event) => {
                        setChallenge(event.target.value);
                        setChallengeSaved(false);
                      }}
                      placeholder="Identify the exact record, gate, conclusion, or claim being challenged..."
                    />
                    <button className="artifact-button primary" type="button" onClick={saveChallenge} style={{ marginTop: 12 }}>
                      {challengeSaved ? "Challenge draft preserved" : "Preserve challenge draft"}
                    </button>
                  </article>
                </div>
              </Panel>
            ) : null}
          </div>

          <aside className="artifact-aside">
            <section className="artifact-side-card">
              <div className="artifact-overline">Artifact identity</div>
              <h3>{ARTIFACT_ID}</h3>
              <div className="artifact-side-list">
                <div className="artifact-side-row"><span>Release position</span><strong>02 of 12</strong></div>
                <div className="artifact-side-row"><span>Determination</span><strong>ESCALATE</strong></div>
                <div className="artifact-side-row"><span>Earliest failure</span><strong>BINDING / VERSION</strong></div>
                <div className="artifact-side-row"><span>Route</span><strong>{ROUTE_ID}</strong></div>
                <div className="artifact-side-row"><span>Route version</span><strong>{ROUTE_VERSION}</strong></div>
                <div className="artifact-side-row"><span>Status</span><strong>PUBLISHED DEMONSTRATION</strong></div>
              </div>
            </section>

            <section className="artifact-side-card">
              <div className="artifact-overline">Repair condition</div>
              <h3>A new bounded authorization is required.</h3>
              <p>
                Create a new authorization that explicitly covers the requested scope, preserve it as a new record, rerun every dependent gate, and generate a new commit. The original ESCALATE remains
                immutable.
              </p>
              <div className="artifact-requirement-list">{newAuthorizationRequirements.map((item, index) => <div className="artifact-requirement" key={item}><span>{String(index + 1).padStart(2, "0")}</span><p>{item}</p></div>)}</div>
              <button className="artifact-button" type="button" onClick={() => selectView("threshold")}>Inspect dosing-threshold mismatch</button>
            </section>

            <section className="artifact-side-card">
              <div className="artifact-overline">Download package</div>
              <h3>Inspect offline.</h3>
              <p>Download public representations generated from this bounded demonstration record.</p>
              <div className="artifact-downloads">
                <button className="artifact-download" type="button" onClick={() => downloadText(`${ARTIFACT_ID}.json`, packageRecord)}>Canonical JSON <span>↓</span></button>
                <button className="artifact-download" type="button" onClick={() => downloadText(`${ARTIFACT_ID}-integrity-manifest.json`, integrityManifest)}>Integrity manifest <span>↓</span></button>
                <button className="artifact-download" type="button" onClick={() => downloadText(`${ARTIFACT_ID}-execution-receipt.json`, packageRecord.execution)}>Execution receipt <span>↓</span></button>
                <button className="artifact-download" type="button" onClick={() => downloadText(`${ARTIFACT_ID}-threshold-ledger.json`, thresholdEvents)}>Threshold ledger <span>↓</span></button>
                <button className="artifact-download" type="button" onClick={() => downloadText(`${ARTIFACT_ID}-verification.txt`, `Artifact: ${ARTIFACT_ID}\nExpected result: VERIFIED\nMaximum public level: 6\nRecord hash: ${RECORD_HASH}\nPackage hash: ${PACKAGE_HASH}\n`)}>Verification guide <span>↓</span></button>
              </div>
            </section>

            <section className="artifact-side-card artifact-boundary">
              <div className="artifact-overline">Claims boundary</div>
              <h3>Controlled demonstration.</h3>
              <p>
                This artifact proves one reference-engine event in which an out-of-scope dosing invocation produced
                a technical escalation and a preserved zero-mutation outcome. It does not claim external
                certification or universal performance.
              </p>
            </section>
          </aside>
        </div>

        <footer className="artifact-footer">
          <span>TA-14 Authority · Admissible Execution Architecture · {ARTIFACT_ID}</span>
          <span>No admissible evidence. No admissible execution.</span>
        </footer>
      </div>
    </main>
  );
}
