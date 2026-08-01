"use client";

import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";

type View =
  | "inspection"
  | "chain"
  | "runtime"
  | "evidence"
  | "version"
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

type BypassEvent = {
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

const ARTIFACT_ID = "TA14-EA-000009";
const ARTIFACT_TITLE = "Mandatory Governance Gate Bypass Attempt";
const ROUTE_ID = "TA14-ROUTE-MANDATORY-GATE-BYPASS-DENY-009";
const ROUTE_VERSION = "1.0.0";
const RECORD_HASH = "sha256:09c9b27b8a63fd3102bd9b26d5f979c3e6f55c877b2aa7f24b0e9f22a9300009";
const PACKAGE_HASH = "sha256:98f42cb675a6d51dd2ca443b90353e7e47425d95665f5f060ff7e0cde1900009";
const RECEIPT_HASH = "sha256:de4e9a3b8f89c1fd61ad92536f3de568f5f7772b9833d28c4f903d1228100009";

const chain: ChainItem[] = [
  {
    number: "01",
    link: "Reality",
    result: "PASS",
    question: "What condition existed before interpretation?",
    finding: "An authenticated caller attempted to invoke the execution adapter directly, skipping the frozen 24-gate route and its required commit token.",
    proof: "The attempted direct invocation, target system, consequence, actor, destination, and execution window were preserved before enforcement.",
  },
  {
    number: "02",
    link: "Record",
    result: "PASS",
    question: "What attributable representation was preserved?",
    finding: "The request package, route snapshot, required gate sequence manifest, bypass path manifest, authority record, and change ticket were captured.",
    proof: "Every material input received a stable identifier, source attribution, capture time, disclosure state, and integrity commitment.",
  },
  {
    number: "03",
    link: "Continuity",
    result: "PASS",
    question: "Did identity, provenance, state, and version remain connected?",
    finding: "Actor identity, route identity, authority, custody, target system, and both route manifests remained continuously attributable.",
    proof: "No source substitution, custody break, identity discontinuity, or silent route rewrite occurred.",
  },
  {
    number: "04",
    link: "Admissibility",
    result: "PASS",
    question: "May the evidence support this exact bypass decision now?",
    finding: "The evidence was current, relevant, attributable, and sufficient to compare the required gate sequence against the bypass path.",
    proof: "The admissibility evaluator accepted the evidence for gate-order comparison without treating it as permission to execute.",
  },
  {
    number: "05",
    link: "Binding",
    result: "PASS",
    question: "What rule validly governs the consequence?",
    finding: "The frozen route requires every mandatory gate to complete in order before a valid commit token can authorize adapter execution.",
    proof: "The binding record applied the rule that authenticated access cannot substitute for a completed governed route and valid commit token.",
  },
  {
    number: "06",
    link: "Commit",
    result: "PASS",
    question: "Was a valid commit required before adapter action?",
    finding: "The route required a valid commit token derived from all mandatory gates. No such token existed for the direct invocation.",
    proof: "The preserved commit record proves that no ALLOW state was fixed for the attempted direct adapter path.",
  },
  {
    number: "07",
    link: "Execution",
    result: "FAIL",
    question: "Did the execution request attempt to bypass mandatory governance?",
    finding: "The execution adapter received a direct invocation without a valid commit token and identified the mandatory-gate bypass attempt as the earliest controlling failure.",
    proof: "Receipt EA-000009-EX-01 records HTTP 403, token revocation, zero consequential actions released, and no successful alternate path.",
  },
  {
    number: "08",
    link: "Outcome",
    result: "PASS",
    question: "What bound to reality, and what did not?",
    finding: "No consequential execution occurred. The unauthorized request, denial, token revocation, and required fresh governed-route path were preserved.",
    proof: "Outcome closure confirms the target state remained unchanged and residual risk was limited to repeated bypass attempts requiring continued enforcement and review.",
  },
];

const gates: GateItem[] = [
  { number: "01", title: "Observed condition registered", chainLink: "REALITY", result: "PASS", reasonCode: "DIRECT_INVOCATION_PRESENT", summary: "The proposed adapter invocation and consequence were exact enough to govern." },
  { number: "02", title: "Affected systems identified", chainLink: "REALITY", result: "PASS", reasonCode: "SYSTEMS_IDENTIFIED", summary: "The governed target, adapter, actor, reviewers, and affected process were attributable." },
  { number: "03", title: "Request package captured", chainLink: "RECORD", result: "PASS", reasonCode: "REQUEST_CAPTURED", summary: "The execution request, route snapshot, manifests, ticket, and authority record were preserved before reliance." },
  { number: "04", title: "Record identity fixed", chainLink: "RECORD", result: "PASS", reasonCode: "RECORD_ID_FIXED", summary: "Stable record, route, invocation, and package identifiers were assigned." },
  { number: "05", title: "Actor identity resolved", chainLink: "CONTINUITY", result: "PASS", reasonCode: "ACTOR_IDENTITY_RESOLVED", summary: "Requester, route steward, reviewer, and adapter operator identities were resolved." },
  { number: "06", title: "Invocation provenance linked", chainLink: "CONTINUITY", result: "PASS", reasonCode: "INVOCATION_PROVENANCE_LINKED", summary: "The governed route package and direct invocation were linked to their source manifests and request provenance." },
  { number: "07", title: "Custody continuity checked", chainLink: "CONTINUITY", result: "PASS", reasonCode: "CUSTODY_CONTINUOUS", summary: "The request, manifests, support, and adapter command remained continuously linked." },
  { number: "08", title: "Route version continuous", chainLink: "CONTINUITY", result: "PASS", reasonCode: "ROUTE_VERSION_CONTINUOUS", summary: "Route version 2.0.0 remained frozen and unchanged throughout evaluation." },
  { number: "09", title: "Evidence relevance tested", chainLink: "ADMISSIBILITY", result: "PASS", reasonCode: "EVIDENCE_RELEVANT", summary: "The manifests and route snapshot directly answered the mandatory-gate bypass question." },
  { number: "10", title: "Evidence freshness tested", chainLink: "ADMISSIBILITY", result: "PASS", reasonCode: "EVIDENCE_CURRENT", summary: "All material evidence remained inside the configured freshness window." },
  { number: "11", title: "Evidence sufficiency tested", chainLink: "ADMISSIBILITY", result: "PASS", reasonCode: "EVIDENCE_SUFFICIENT", summary: "The package was complete enough to determine exact gate-order integrity." },
  { number: "12", title: "Authority admissibility tested", chainLink: "ADMISSIBILITY", result: "PASS", reasonCode: "AUTHORITY_ADMISSIBLE", summary: "Authority remained valid for the frozen 24-gate route and did not extend to direct adapter call." },
  { number: "13", title: "Required gate sequence fixed", chainLink: "BINDING", result: "PASS", reasonCode: "REQUIRED_GATE_SEQUENCE_V7_3", summary: "The governing record fixed the frozen 24-gate route as the only admissible path to a release commit." },
  { number: "14", title: "Destination rule applied", chainLink: "BINDING", result: "PASS", reasonCode: "DESTINATION_AUTHORIZED", summary: "The target endpoint matched the approved destination." },
  { number: "15", title: "Privilege rule applied", chainLink: "BINDING", result: "PASS", reasonCode: "PRIVILEGES_AUTHORIZED", summary: "Requested privileges remained within the approved capability set." },
  { number: "16", title: "Separation of duties applied", chainLink: "BINDING", result: "PASS", reasonCode: "DUTIES_SEPARATED", summary: "Requester, approver, and runtime operator remained distinct." },
  { number: "17", title: "Gate-order integrity evaluated", chainLink: "EXECUTION", result: "FAIL", reasonCode: "MANDATORY_GATE_BYPASS_ATTEMPT", summary: "The direct adapter invocation attempted to skip the frozen 24-gate route and reach execution without a valid commit token." },
  { number: "18", title: "Earliest failure fixed", chainLink: "EXECUTION", result: "PASS", reasonCode: "EARLIEST_FAILURE_EXECUTION", summary: "Execution-stage bypass resistance fixed the direct adapter invocation as the controlling break." },
  { number: "19", title: "Determination fixed", chainLink: "EXECUTION", result: "PASS", reasonCode: "DETERMINATION_DENY", summary: "DENY was committed before the execution adapter received any release authority." },
  { number: "20", title: "Permitted next action fixed", chainLink: "EXECUTION", result: "PASS", reasonCode: "FRESH_GOVERNED_ROUTE_REQUIRED", summary: "Only removal of the bypass path and a fresh execution of every mandatory gate may create a new determination." },
  { number: "21", title: "Adapter command generated", chainLink: "EXECUTION", result: "PASS", reasonCode: "COMMAND_DENY", summary: "The adapter received a deny-and-revoke command." },
  { number: "22", title: "Unauthorized direct invocation blocked", chainLink: "EXECUTION", result: "PASS", reasonCode: "HTTP_403_DENIED", summary: "The adapter rejected direct adapter invocation and revoked the pending execution token." },
  { number: "23", title: "Bypass resistance verified", chainLink: "EXECUTION", result: "PASS", reasonCode: "BYPASS_PREVENTED", summary: "Alias, retry, fallback, and alternate-endpoint attempts produced no release." },
  { number: "24", title: "Outcome preserved", chainLink: "OUTCOME", result: "PASS", reasonCode: "ZERO_CONSEQUENTIAL_EXECUTIONS", summary: "No consequential execution occurred; the bypass attempt was preserved as evidence." },
];

const evidence: EvidenceItem[] = [
  {
    id: "EA-000009-EV-01",
    title: "Adapter invocation request",
    source: "TA-14 Scenario Author",
    type: "DECLARATION",
    disclosure: "PUBLIC",
    status: "ADMITTED",
    capturedAt: "2026-07-31 19:12:00 UTC",
    hash: "1aa79af3...d4c2",
    supports: "Exact target environment, scope, execution request, destination, and mandatory-gate boundary.",
    limitation: "Controlled demonstration record; no external production system was affected.",
  },
  {
    id: "EA-000009-EV-02",
    title: "Frozen bypass-sensitive route",
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
    id: "EA-000009-EV-03",
    title: "Direct invocation and change ticket package",
    source: "TA-14 Evidence Custodian",
    type: "BUSINESS_RECORD",
    disclosure: "SELECTIVE",
    status: "ADMITTED",
    capturedAt: "2026-07-31 19:12:10 UTC",
    hash: "bf90e123...93d1",
    supports: "Execution purpose, execution request scope, change ticket relationship, and requested due state.",
    limitation: "Does not independently establish execution authority.",
  },
  {
    id: "EA-000009-EV-04",
    title: "Frozen governed-route authority",
    source: "TA-14 Authority Resolver",
    type: "AUTHORITY_RECORD",
    disclosure: "SELECTIVE",
    status: "CONDITIONAL",
    capturedAt: "2026-07-31 19:12:11 UTC",
    hash: "6cf0c40a...6721",
    supports: "Actor identity, authenticated access, and authority to use the governed route.",
    limitation: "Does not authorize any direct adapter path outside the governed route.",
  },
  {
    id: "EA-000009-EV-05",
    title: "Mandatory-gate bypass attempt",
    source: "TA-14 Authority Resolver",
    type: "AUTHORITY_EVENT",
    disclosure: "SELECTIVE",
    status: "ADMITTED",
    capturedAt: "2026-07-31 19:15:41 UTC",
    hash: "e02c9097...4cb8",
    supports: "A direct adapter invocation attempted to skip required evidence, authority, commit, and revalidation gates.",
    limitation: "Proves the attempted bypass event, not the caller's intent.",
  },
  {
    id: "EA-000009-EV-06",
    title: "Gate-order enforcement ledger",
    source: "TA-14 Continuity Validator",
    type: "SYSTEM_RECORD",
    disclosure: "PUBLIC",
    status: "ADMITTED",
    capturedAt: "2026-07-31 19:15:43 UTC",
    hash: "5a10cb73...e776",
    supports: "The ledger shows the required gate sequence, absent commit token, and enforcement response.",
    limitation: "Bounded to the disclosed route inputs and event window.",
  },
  {
    id: "EA-000009-EV-07",
    title: "Denied-action execution receipt",
    source: "TA-14 Reference Execution Adapter",
    type: "EXECUTION_RECEIPT",
    disclosure: "PUBLIC",
    status: "ADMITTED",
    capturedAt: "2026-07-31 19:16:03 UTC",
    hash: "58a1b51e...e52f",
    supports: "The committed DENY prevented the unauthorized direct adapter invocation from reaching any consequence-bearing control surface and preserved the rejected request.",
    limitation: "Proves control of the TA-14 reference execution adapter for this bounded event; it does not establish control over unrelated external execution systems.",
  },
  {
    id: "EA-000009-EV-08",
    title: "Zero-mutation outcome closure",
    source: "TA-14 Outcome Verifier",
    type: "OUTCOME_EVIDENCE",
    disclosure: "PUBLIC",
    status: "ADMITTED",
    capturedAt: "2026-07-31 19:17:20 UTC",
    hash: "bd21dd3a...79e4",
    supports: "No consequential execution was released, and the bypass attempt remained preserved.",
    limitation: "Outcome verification is bounded to the observed adapter, queue, and event window.",
  },
];

const bypassEvents: BypassEvent[] = [
  {
    time: "19:12:11",
    event: "AUTHORITY RESOLVED",
    detail: "Authenticated access was valid only through the governed 24-gate route and its resulting commit token.",
    state: "VALID",
  },
  {
    time: "19:13:02",
    event: "FROZEN GATE SEQUENCE PRESERVED",
    detail: "The frozen route and mandatory gate order remained the sole authorized path.",
    state: "VALID",
  },
  {
    time: "19:15:41",
    event: "BYPASS ATTEMPT DETECTED",
    detail: "The adapter detected a direct invocation without a valid commit token before any release.",
    state: "CHANGED",
  },
  {
    time: "19:15:43",
    event: "DEPENDENT GATES INVALIDATED",
    detail: "Gate-order integrity and all dependent commit and execution controls were evaluated.",
    state: "REVALIDATE",
  },
  {
    time: "19:16:02",
    event: "DENY COMMITTED",
    detail: "The route fixed DENY, blocked execution, revoked the pending token, and preserved the bypass attempt as evidence.",
    state: "DENIED",
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
    detail: "Disclosed inputs reproduce DENY after the mandatory-gate bypass attempt.",
  },
  {
    level: "L5",
    label: "Execution effect",
    detail: "The adapter receipt proves DENIED, HTTP 403, token revocation, zero consequential execution transitions, and blocked bypass.",
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
    condition: "The bypass attempt was appended without rewriting valid upstream identity, evidence, or route records.",
  },
  {
    id: "AT-03",
    result: "PASS",
    condition: "DENY produced the required block, token-revocation, and zero-mutation execution effect.",
  },
  {
    id: "AT-04",
    result: "PASS",
    condition: "The failed execution bypass-resistance gate could not be skipped, overridden, or relabeled to reach ALLOW.",
  },
  {
    id: "AT-05",
    result: "PASS",
    condition: "The direct adapter invocation triggered the hard bypass prohibition and produced DENY before any consequential adapter release.",
  },
  {
    id: "AT-06",
    result: "PASS",
    condition: "The adapter produced a technical receipt proving denial, token revocation, and zero consequential execution transition.",
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
    sequence: 2,
    totalInRelease: 12,
    classification: "CANONICAL EXECUTION PROOF",
    publicationState: "PUBLISHED",
    determination: "DENY",
    verificationLevel: 6,
    simulated: true,
  },
  scenario: {
    proposedAction:
      "Deploy one named action only to the authorized environment, with the exact approved privileges, version, time window, and rollback controls.",
    scope: "governed action direct adapter call.00",
    consequenceAtStake:
      "No consequential execution may occur outside the frozen route, mandatory gate order, authority scope, destination, time window, and rollback boundary.",
    affectedSubjects: [
      "TA-14 controlled demonstration environment",
      "named governed environment",
      "reference execution adapter",
      "authorized financial reviewers",
    ],
    declaredLimits: [
      "No governed customer system is affected.",
      "The record proves one bounded event only.",
      "The record does not certify every future route, adapter, or execution.",
    ],
  },
  route: {
    routeId: ROUTE_ID,
    routeVersion: ROUTE_VERSION,
    gateCount: 24,
    earliestFailure: "EXECUTION",
    earliestFailureGate: "19",
    reasonCodes: [
      "MANDATORY_GATE_BYPASS_ATTEMPT",
      "AUTHORITY_INADMISSIBLE",
      "DUAL_AUTHORITY_UNSATISFIED",
    ],
    requiredRepair: [
      "Create a fresh governed route that expressly covers the requested action.",
      "Preserve the new route snapshot and complete gate ledger with its effective time.",
      "Rerun continuity, admissibility, binding, and commit gates.",
      "Generate a new commit and execution receipt; do not amend the original event into ALLOW.",
    ],
  },
  commit: {
    determination: "DENY",
    committedAt: "2026-07-31T19:16:02Z",
    permittedNextAction: "REPAIR_AND_REVALIDATE",
    prohibitedAction: "PRODUCTION_EXECUTION",
  },
  execution: {
    adapter: "TA-14 Reference Execution Adapter",
    adapterVersion: "1.0.0",
    command: "DENY_AND_REVOKE",
    technicalStatus: 403,
    receiptId: "EA-000009-EX-01",
    receiptHash: RECEIPT_HASH,
    governedMutations: 0,
    bypassDetected: false,
  },
  outcome: {
    state: "DENIAL_PRESERVED",
    governedEnvironmentChanged: false,
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
  bypassEvents,
  verificationChecks,
  acceptanceTests,
};

const integrityManifest = {
  artifactId: ARTIFACT_ID,
  routeId: ROUTE_ID,
  routeVersion: ROUTE_VERSION,
  determination: "DENY",
  recordHash: RECORD_HASH,
  packageHash: PACKAGE_HASH,
  components: {
    canonicalRecord: "sha256:4c4f4f98...9bc2f",
    routeSnapshot: "sha256:8f7e21c9...a985",
    evidenceManifest: "sha256:3fa02c11...776a",
    governanceStateLedger: "sha256:e02c9097...4cb8",
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



const bypassMatrix = [
  { field: "Environment", authorized: "Staging", requested: "Governed", result: "FAIL", rule: "Destination may not expand after support." },
  { field: "Privileges", authorized: "Read-only diagnostics", requested: "Create, update, delete", result: "FAIL", rule: "Write capability requires separate authority." },
  { field: "Gate path", authorized: "24-gate route", requested: "direct adapter call", result: "FAIL", rule: "Action identity is part of the committed scope." },
  { field: "Change window", authorized: "02:00-02:30 UTC", requested: "Immediate", result: "FAIL", rule: "Execution outside the approved time window is prohibited." },
  { field: "Rollback", authorized: "Required and tested", requested: "Not supplied", result: "FAIL", rule: "Governed release requires an executable rollback path." },
  { field: "Approver", authorized: "Release authority A-17", requested: "Same approver", result: "PASS", rule: "Identity remained valid but could not enlarge scope." },
];

const prohibitedCapabilities = [
  "Governed write access",
  "Privilege escalation",
  "Unapproved route or adapter substitution",
  "Execution outside the maintenance window",
  "Release without tested rollback",
  "Alternate-path execution after denial",
];

const newAuthorizationRequirements = [
  "Name the governed environment and exact destination resources.",
  "Declare each permitted create, update, delete, and network capability.",
  "Bind the authorization to action direct adapter call and its immutable package hash.",
  "Define a new execution window and immediate pre-runtime revalidation.",
  "Attach a tested rollback package and accountable rollback authority.",
  "Run the complete route as a new event; never overwrite this denial.",
];

const bypassRules = [
  {
    id: "BR-01",
    title: "Destination specificity",
    requirement: "The committed authorization must name the exact environment and destination resources.",
    observed: "The preserved authorization named the frozen 24-gate route. The request named direct adapter invocation.",
    consequence: "The destination expansion is prohibited and cannot be inferred from general access.",
  },
  {
    id: "BR-02",
    title: "Privilege specificity",
    requirement: "Every consequential capability must be expressly enumerated before commit.",
    observed: "Read-only diagnostics were authorized; consequence-bearing release authority were requested.",
    consequence: "Runtime direct adapter call remained outside the approved commit profile.",
  },
  {
    id: "BR-03",
    title: "Action identity continuity",
    requirement: "The action package, gate ledger, and commit token must match the authorized object.",
    observed: "Authorization covered 24-gate route; the request substituted direct adapter call.",
    consequence: "A direct adapter call cannot inherit authority from a route it bypassed.",
  },
  {
    id: "BR-04",
    title: "Commit-token activation rule",
    requirement: "Execution must occur inside the authorized change window.",
    observed: "The request demanded immediate release outside 02:00-02:30 UTC.",
    consequence: "Urgency did not create a new execution window.",
  },
  {
    id: "BR-05",
    title: "Rollback readiness",
    requirement: "A tested rollback package and accountable rollback authority must exist before consequence-bearing release.",
    observed: "No tested rollback package accompanied the request.",
    consequence: "The governed route could not bind without recoverability evidence.",
  },
  {
    id: "BR-06",
    title: "No scope inheritance",
    requirement: "Identity, expertise, prior support, and platform access do not enlarge authority.",
    observed: "The same actor submitted the valid 24-gate route package and the unauthorized direct adapter call request.",
    consequence: "Known identity strengthened attribution but did not cure the scope bypass.",
  },
  {
    id: "BR-07",
    title: "No alternate-path release",
    requirement: "A denied request may not be resubmitted through a less-governed adapter under the same state.",
    observed: "The adapter revoked the execution token and recorded the attempted fallback path.",
    consequence: "The same invalid state remained denied across all governed paths.",
  },
  {
    id: "BR-08",
    title: "New event for a new governed route",
    requirement: "A materially broader authorization must create a new route event.",
    observed: "No governed authorization existed in the frozen record.",
    consequence: "Repair requires a fresh governed route and a complete rerun, not an amendment that rewrites this denial.",
  },
];


const bypassControlEvidence = [
  {
    id: "VC-01",
    title: "Required gate sequence identifier",
    required: "24-gate route",
    observed: "direct adapter call",
    result: "FAIL",
    consequence: "The bypass path differs from the exact version named in the frozen route.",
  },
  {
    id: "VC-02",
    title: "Approved manifest digest",
    required: "sha256:approved-24-gate route",
    observed: "sha256:requested-direct adapter call",
    result: "FAIL",
    consequence: "The requested package digest does not equal the approved manifest commitment.",
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
    required: "governed-runtime-primary",
    observed: "governed-runtime-primary",
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
    title: "Route authority",
    required: "authority-A17",
    observed: "authority-A17",
    result: "PASS",
    consequence: "The authority source remained valid but version-specific.",
  },
  {
    id: "VC-08",
    title: "Change ticket",
    required: "CHG-7406",
    observed: "CHG-7406",
    result: "PASS",
    consequence: "The change record remained continuous and current.",
  },
  {
    id: "VC-09",
    title: "Action family",
    required: "TA14-runtime",
    observed: "TA14-runtime",
    result: "PASS",
    consequence: "The requested action family matched, but action similarity could not cure a mandatory-gate bypass attempt.",
  },
  {
    id: "VC-10",
    title: "Dependency lockfile",
    required: "lock-24-gate route",
    observed: "lock-direct adapter call",
    result: "FAIL",
    consequence: "Dependency state attempted bypass with the unrequired gate sequence package.",
  },
  {
    id: "VC-11",
    title: "Safety policy bundle",
    required: "policy-31",
    observed: "policy-31",
    result: "PASS",
    consequence: "The safety policy bundle remained the frozen gate sequence.",
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
    title: "Support timestamp",
    required: "19:05:00 UTC",
    observed: "19:05:00 UTC",
    result: "PASS",
    consequence: "The support timestamp remained preserved and unaltered.",
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
    title: "Rollback package",
    required: "rollback-24-gate route",
    observed: "rollback-direct adapter call",
    result: "FAIL",
    consequence: "The rollback package corresponded to the unapproved governance gate.",
  },
  {
    id: "VC-16",
    title: "Signature key",
    required: "TA14-KMS-17",
    observed: "TA14-KMS-17",
    result: "PASS",
    consequence: "The signing identity remained valid; signature validity did not authorize direct adapter call.",
  },
  {
    id: "VC-17",
    title: "Alias resolution",
    required: "runtime-current → 24-gate route",
    observed: "runtime-current → direct adapter call",
    result: "FAIL",
    consequence: "An alias change attempted to redirect execution to an unfrozen gate sequence.",
  },
  {
    id: "VC-18",
    title: "Fallback runtime",
    required: "24-gate route",
    observed: "direct adapter call",
    result: "FAIL",
    consequence: "The fallback configuration also named the unauthorized runtime.",
  },
];

const denialInvariants = [
  "The denied request never received a governed execution token.",
  "No create, update, delete, migration, or network-change command reached the target environment.",
  "The original 24-gate route authorization remains visible and is not falsely labeled invalid.",
  "The broader governed request remains attributable to the requesting actor.",
  "The DENY commit precedes adapter invocation and cannot be backdated.",
  "The execution receipt, outcome record, public page, and manifest resolve to one event.",
  "Revalidation of unchanged facts cannot cure a hard scope bypass.",
  "Only a a newly evaluated route with every mandatory gate satisfied can support a new governed route.",
  "The denial does not certify the action as unsafe; it proves the request was unauthorized.",
  "The zero-mutation outcome is verified independently from the determination record.",
];

const packageComponents = [
  { id: "PKG-01", name: "Canonical bounded record", format: "JSON", status: "INCLUDED", purpose: "Machine-readable root event" },
  { id: "PKG-02", name: "Human-readable inspection record", format: "HTML/PDF", status: "INCLUDED", purpose: "Public inspection and review" },
  { id: "PKG-03", name: "Frozen scenario snapshot", format: "JSON", status: "INCLUDED", purpose: "Exact proposed consequence" },
  { id: "PKG-04", name: "Route snapshot", format: "JSON", status: "INCLUDED", purpose: "Frozen route, mandatory gate order, and enforcement thresholds" },
  { id: "PKG-05", name: "Evidence manifest", format: "JSON", status: "INCLUDED", purpose: "Source, freshness, custody, hashes" },
  { id: "PKG-06", name: "Authority ledger", format: "JSON", status: "INCLUDED", purpose: "Identity, delegation, scope, expiry" },
  { id: "PKG-07", name: "Gate-bypass comparison matrix", format: "JSON", status: "INCLUDED", purpose: "Required route versus attempted bypass" },
  { id: "PKG-08", name: "24-link runtime ledger", format: "JSON", status: "INCLUDED", purpose: "Ordered gate results" },
  { id: "PKG-09", name: "Determination commit", format: "JSON", status: "INCLUDED", purpose: "Fixed DENY before action" },
  { id: "PKG-10", name: "Execution denial receipt", format: "JSON", status: "INCLUDED", purpose: "HTTP 403 and token revocation" },
  { id: "PKG-11", name: "Bypass-attempt record", format: "JSON", status: "INCLUDED", purpose: "Alternate-path prevention" },
  { id: "PKG-12", name: "Outcome closure", format: "JSON", status: "INCLUDED", purpose: "Verified zero consequential execution transitions" },
  { id: "PKG-13", name: "Integrity manifest", format: "JSON", status: "INCLUDED", purpose: "Component and package hashes" },
  { id: "PKG-14", name: "Verification instructions", format: "TXT", status: "INCLUDED", purpose: "Online and offline verification" },
  { id: "PKG-15", name: "Challenge record template", format: "JSON", status: "INCLUDED", purpose: "Bounded objection pathway" },
  { id: "PKG-16", name: "Claims-gate statement", format: "TXT", status: "INCLUDED", purpose: "What the artifact does and does not prove" },
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
  .artifact-authority-event.attempted bypass { border-color: rgba(255,123,143,.28); }
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
  URL.revokeObjectURL(url);
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

export default function ExecutionArtifact000009Page() {
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
    { id: "runtime", label: "24-gate runtime" },
    { id: "evidence", label: "Evidence manifest" },
    { id: "bypass", label: "Mandatory governance gate bypass attempt" },
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
            <Link className="artifact-link" href="/artifacts/ta14-ea-000008">← Artifact 000008</Link>
            <Link className="artifact-link" href="/artifacts">Artifact library</Link>
            <Link className="artifact-link" href="/workspace/artifacts/build">Build an artifact</Link>
          </div>
        </header>

        <section className="artifact-hero">
          <div className="artifact-hero-grid">
            <div className="artifact-hero-copy">
              <div className="artifact-kicker">Execution artifact 06 of 12 · canonical bypass-resistance proof</div>
              <h1>
                Mandatory governance gate bypass attempt
                <span>stopped execution.</span>
              </h1>
              <p className="artifact-lede">
                A executor possessed valid authenticated access when the governed route began.
                Authenticated access existed, but the caller attempted to bypass the governed route. TA-14 preserved the attempt,
                denied the direct invocation, revoked the execution token, and closed
                the outcome with zero consequential actions executed.
              </p>
              <div className="artifact-hero-meta">
                <span className="artifact-chip">{ARTIFACT_ID}</span>
                <span className="artifact-chip">Route {ROUTE_VERSION}</span>
                <span className="artifact-chip">Earliest failure: EXECUTION / BYPASS RESISTANCE</span>
                <span className="artifact-chip">Verification level: 6</span>
                <span className="artifact-chip">Controlled demonstration</span>
              </div>
            </div>

            <aside className="artifact-decision">
              <div>
                <div className="artifact-decision-label">Committed determination</div>
                <div className="artifact-decision-word">DENY</div>
                <p>
                  Do not transmit. Preserve the request, remove the bypass path, and rerun every
                  dependent gate before a new commit is considered.
                </p>
              </div>
              <div className="artifact-decision-grid">
                <div className="artifact-decision-cell">
                  <span>Control effect</span>
                  <strong>HTTP 403 · GOVERNANCE GATE DENIED</strong>
                </div>
                <div className="artifact-decision-cell">
                  <span>Consequential actions released</span>
                  <strong>0</strong>
                </div>
                <div className="artifact-decision-cell">
                  <span>Earliest break</span>
                  <strong>Gate 21</strong>
                </div>
                <div className="artifact-decision-cell">
                  <span>Repair path</span>
                  <strong>Remove bypass + rerun route</strong>
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section className="artifact-summary-grid" aria-label="Artifact summary">
          <div className="artifact-stat"><span>Runtime gates</span><strong>24</strong></div>
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
                subtitle="This view answers what was proposed, what governed it, why the decision occurred, whether the decision attempted bypass the action path, and what outcome followed."
              >
                <div className="artifact-proof-grid">
                  <article className="artifact-proof-card">
                    <div className="artifact-overline">Proposed consequence</div>
                    <h3>Invoke the execution adapter directly while skipping mandatory evidence, authority, commit, and revalidation gates.</h3>
                    <p>
                      The route required current gate evidence, a frozen target environment destination,
                      valid authority, preserved continuity, a complete mandatory gate ledger, a fixed commit token, and final pre-execution revalidation.
                    </p>
                  </article>
                  <article className="artifact-proof-card">
                    <div className="artifact-overline">Controlling condition</div>
                    <h3>Mandatory gates were intentionally skipped before adapter invocation.</h3>
                    <p>
                      The initial delegation was real but no longer current. The bypass attempt
                      occurred before the route fixed its determination, so the partial upstream support could
                      not carry forward into execution.
                    </p>
                  </article>
                  <article className="artifact-proof-card positive">
                    <div className="artifact-overline">What this proves</div>
                    <h3>The architecture failed closed on mandatory-gate bypass attempt.</h3>
                    <p>
                      TA-14 did not treat an partial upstream support as permanent permission. It
                      preserved the attempted bypass state, reran dependent gates, committed DENY,
                      and produced a technical non-release receipt.
                    </p>
                  </article>
                  <article className="artifact-proof-card boundary">
                    <div className="artifact-overline">What this does not prove</div>
                    <h3>No universal or production certification is claimed.</h3>
                    <p>
                      This controlled demonstration proves one bounded event through the TA-14
                      reference engine and adapter. It does not certify every organization, execution
                      adapter, authority system, external platform, or future execution.
                    </p>
                  </article>
                </div>
              </Panel>
            ) : null}

            {view === "chain" ? (
              <Panel
                eyebrow="Canonical chain"
                title="The earliest unsupported link controlled the route."
                subtitle="Later success cannot repair an execution-stage mandatory-gate bypass attempt. Each anchor remains visible even when the path stops."
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

            {view === "runtime" ? (
              <Panel
                eyebrow="Complete runtime"
                title="Twenty-four gates preserved the decision path."
                subtitle="The first controlling failure occurred at gate 21 when the direct adapter invocation skipped the frozen 24-gate route."
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

            {view === "bypass" ? (
              <Panel
                eyebrow="Governance gate integrity"
                title="Authenticated access and identity were valid. The direct adapter path was not a governed route."
                subtitle="The architecture preserves the valid 24-gate route authorization while refusing to transform it into permission for unrequired gate sequence direct adapter call."
              >
                <div className="artifact-authority-stage">
                  <div className="artifact-boundary-ledger">
                    {bypassEvents.map((event) => (
                      <article
                        className={`artifact-authority-event ${event.state === "CHANGED" ? "attempted bypass" : ""}`}
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
                    <h3>Commit / governance gate continuity</h3>
                    <p>
                      Identity, provenance, continuity, evidence, authority, destination, and privileges remained intact. The controlling failure occurred at execution because a direct adapter invocation attempted to skip the frozen 24-gate route and proceed without a valid commit token.
                    </p>
                    <div className="artifact-row"><span>Gate</span><strong>17 · Gate-order integrity evaluated</strong></div>
                    <div className="artifact-row" style={{ marginTop: 10 }}><span>Reason</span><strong>MANDATORY_GATE_BYPASS_ATTEMPT</strong></div>
                  </aside>
                </div>
                <div className="artifact-section-heading" style={{ marginTop: 28 }}>
                  <div>
                    <div className="artifact-overline">Bypass-resistance rulebook</div>
                    <h3>Eight independent controls prevented gate-order inheritance.</h3>
                  </div>
                </div>
                <div className="artifact-rule-grid">
                  {bypassRules.map((rule) => (
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
                    <div className="artifact-overline">Bypass-control evidence</div>
                    <h3>Eighteen checks isolate the mismatch without rewriting valid upstream state.</h3>
                  </div>
                </div>
                <div className="artifact-rule-grid">
                  {bypassControlEvidence.map((control) => (
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
                  {denialInvariants.map((item, index) => (
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
                title="The determination attempted bypass what the system could do."
                subtitle="This is the difference between governance and description. The reference execution adapter received a DENY command, rejected the unauthorized direct consequence-bearing invocation, revoked the pending execution token, and generated a technical receipt."
              >
                <div className="artifact-effect">
                  <article className="artifact-effect-box">
                    <div className="artifact-overline">Attempted action</div>
                    <h3>Transmit governed action direct adapter call</h3>
                    <p>
                      Target environment, scope, destination, authority chain, route version, and event
                      window were frozen before runtime evaluation.
                    </p>
                    <div className="artifact-receipt-grid">
                      <div className="artifact-row"><span>Adapter</span><strong>Reference Execution Adapter</strong></div>
                      <div className="artifact-row"><span>Route</span><strong>{ROUTE_ID}</strong></div>
                    </div>
                  </article>
                  <div className="artifact-effect-arrow">→</div>
                  <article className="artifact-effect-box held">
                    <div className="artifact-overline">Enforced result</div>
                    <h3>DENIED · HTTP 403</h3>
                    <p>
                      The adapter invocation endpoint remained closed to the unauthorized scope. The rejected request was retained in a
                      controlled queue with no alternate-path release and no backdated support.
                    </p>
                    <div className="artifact-receipt-grid">
                      <div className="artifact-row"><span>Receipt</span><strong>EA-000009-EX-01</strong></div>
                      <div className="artifact-row"><span>Governed mutations</span><strong>0</strong></div>
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
                subtitle="A DENY artifact proves that a prohibited action did not bind to reality. Revalidation alone cannot cure a hard mandatory-gate bypass attempt; only a new, independently evaluated authorization can create a different route."
              >
                <div className="artifact-timeline">
                  <article className="artifact-event"><time>19:12:00 UTC</time><strong>Scenario intake sealed</strong><p>The exact execution, target environment, consequence, and declared limits entered the frozen record.</p></article>
                  <article className="artifact-event"><time>19:12:11 UTC</time><strong>Required gate sequence resolved</strong><p>The authority record and required gate sequence 24-gate route manifest were attributable, current, and internally consistent.</p></article>
                  <article className="artifact-event"><time>19:15:41 UTC</time><strong>Mandatory governance gate bypass attempt detected</strong><p>The execution adapter detected a direct invocation that attempted to skip the frozen 24-gate route and reach consequence without a valid commit token.</p></article>
                  <article className="artifact-event"><time>19:15:43 UTC</time><strong>Dependent gates rerun</strong><p>Admissibility, authority scope, binding, and commit logic were evaluated against the frozen request.</p></article>
                  <article className="artifact-event"><time>19:16:02 UTC</time><strong>DENY committed</strong><p>The no-release state and repair requirement were fixed before adapter invocation.</p></article>
                  <article className="artifact-event"><time>19:16:03 UTC</time><strong>Unauthorized direct adapter invocation blocked</strong><p>Receipt EA-000009-EX-01 recorded HTTP 403 and zero consequential actions executed.</p></article>
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
                    <h3>Twenty components preserve one bounded denial event.</h3>
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
                <div className="artifact-side-row"><span>Determination</span><strong>DENY</strong></div>
                <div className="artifact-side-row"><span>Earliest failure</span><strong>EXECUTION / BYPASS</strong></div>
                <div className="artifact-side-row"><span>Route</span><strong>{ROUTE_ID}</strong></div>
                <div className="artifact-side-row"><span>Route version</span><strong>{ROUTE_VERSION}</strong></div>
                <div className="artifact-side-row"><span>Status</span><strong>PUBLISHED DEMONSTRATION</strong></div>
              </div>
            </section>

            <section className="artifact-side-card">
              <div className="artifact-overline">Repair condition</div>
              <h3>A a newly evaluated route with every mandatory gate satisfied is required.</h3>
              <p>
                Remove the direct adapter bypass path and create a fresh governed route that executes every mandatory gate, preserve it as a new record, rerun every dependent gate, and generate a new commit. The original DENY remains
                immutable.
              </p>
              <div className="artifact-requirement-list">{newAuthorizationRequirements.map((item, index) => <div className="artifact-requirement" key={item}><span>{String(index + 1).padStart(2, "0")}</span><p>{item}</p></div>)}</div>
              <button className="artifact-button" type="button" onClick={() => selectView("bypass")}>Inspect mandatory-gate bypass attempt</button>
            </section>

            <section className="artifact-side-card">
              <div className="artifact-overline">Download package</div>
              <h3>Inspect offline.</h3>
              <p>Download public representations generated from this bounded demonstration record.</p>
              <div className="artifact-downloads">
                <button className="artifact-download" type="button" onClick={() => downloadText(`${ARTIFACT_ID}.json`, packageRecord)}>Canonical JSON <span>↓</span></button>
                <button className="artifact-download" type="button" onClick={() => downloadText(`${ARTIFACT_ID}-integrity-manifest.json`, integrityManifest)}>Integrity manifest <span>↓</span></button>
                <button className="artifact-download" type="button" onClick={() => downloadText(`${ARTIFACT_ID}-execution-receipt.json`, packageRecord.execution)}>Execution receipt <span>↓</span></button>
                <button className="artifact-download" type="button" onClick={() => downloadText(`${ARTIFACT_ID}-bypass-ledger.json`, bypassEvents)}>Bypass ledger <span>↓</span></button>
                <button className="artifact-download" type="button" onClick={() => downloadText(`${ARTIFACT_ID}-verification.txt`, `Artifact: ${ARTIFACT_ID}\nExpected result: VERIFIED\nMaximum public level: 6\nRecord hash: ${RECORD_HASH}\nPackage hash: ${PACKAGE_HASH}\n`)}>Verification guide <span>↓</span></button>
              </div>
            </section>

            <section className="artifact-side-card artifact-boundary">
              <div className="artifact-overline">Claims boundary</div>
              <h3>Controlled demonstration.</h3>
              <p>
                This artifact proves one reference-engine event in which an out-of-scope adapter invocation produced
                a technical denial and a preserved zero-mutation outcome. It does not claim external
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
