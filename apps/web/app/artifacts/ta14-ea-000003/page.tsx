"use client";

import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";

type View =
  | "inspection"
  | "chain"
  | "runtime"
  | "evidence"
  | "boundary"
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

type BoundaryEvent = {
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

const ARTIFACT_ID = "TA14-EA-000003";
const ARTIFACT_TITLE = "Boundary Violation Prevented";
const ROUTE_ID = "TA14-ROUTE-BOUNDARY-DENY-003";
const ROUTE_VERSION = "1.0.0";
const RECORD_HASH = "sha256:9c31298e31c2c90e30cf8c3ba61857f59e00486d5bfde98de2bedca4194d1aa4";
const PACKAGE_HASH = "sha256:4e6b1f7cc6a08120c4fe9f53f286cf84df9aa43a84d32497e1f78128c7ee32bd";
const RECEIPT_HASH = "sha256:e8c4d1abf93d6ad0c63a5a46bd791f072632a5e61c901c31aec5592047f23156";

const chain: ChainItem[] = [
  {
    number: "01",
    link: "Reality",
    result: "PASS",
    question: "What condition existed before interpretation?",
    finding: "A request sought to deploy model v7.4 into the production decision environment with write access beyond the approved staging-only boundary.",
    proof: "The proposed action, target environment, scope, destination, consequence, and declared boundary were preserved before evaluation.",
  },
  {
    number: "02",
    link: "Record",
    result: "PASS",
    question: "What attributable representation was preserved?",
    finding: "The deployment package, target environment, change ticket, route snapshot, approved scope, and requested production privileges were captured.",
    proof: "Every input received a stable identifier, capture time, source attribution, disclosure state, and integrity commitment.",
  },
  {
    number: "03",
    link: "Continuity",
    result: "FAIL",
    question: "Did identity, authority, state, and version remain connected?",
    finding: "The requested destination and privileges exceeded the frozen authorization: staging-only approval was presented for production deployment with write access.",
    proof: "The authority event stream records the violation and breaks continuity at the earliest controlling link.",
  },
  {
    number: "04",
    link: "Admissibility",
    result: "FAIL",
    question: "May the material support this exact consequence now?",
    finding: "The technical package remained attributable, but it could not support an execution outside the approved destination, privilege set, and change window.",
    proof: "The admissibility evaluator rejects reliance on the superseded delegation for this route and event window.",
  },
  {
    number: "05",
    link: "Binding",
    result: "FAIL",
    question: "What rule validly governs the consequence?",
    finding: "The frozen route permits staging deployment with read-only diagnostics. The request sought production deployment with write privileges, so the hard boundary failed.",
    proof: "The binding record applies the fail-closed rule and prevents downstream permission from curing the earlier break.",
  },
  {
    number: "06",
    link: "Commit",
    result: "PASS",
    question: "What determination was fixed before action?",
    finding: "DENY was committed before the deployment adapter could create, update, or route any production resource.",
    proof: "The commit record preserves the reason codes, earliest failure, repair condition, and permitted next action.",
  },
  {
    number: "07",
    link: "Execution",
    result: "PASS",
    question: "Did the determination control the action path?",
    finding: "The deployment adapter rejected the command, revoked the pending execution token, and prevented alternate-path release.",
    proof: "Receipt EA-000003-EX-01 records HTTP 403, zero unauthorized actions executed, no bypass, and no alternate-path release.",
  },
  {
    number: "08",
    link: "Outcome",
    result: "PASS",
    question: "What bound to reality, and what did not?",
    finding: "No production resource changed. The denied request, attempted bypass, and required new-authorization path were preserved.",
    proof: "Outcome closure confirms unchanged production state, revoked execution capability, and residual risk limited to operational delay.",
  },
];

const gates: GateItem[] = [
  {
    number: "01",
    title: "Observed condition registered",
    chainLink: "REALITY",
    result: "PASS",
    reasonCode: "DEPLOYMENT_REQUEST_PRESENT",
    summary: "The proposed action and consequence are exact enough to govern.",
  },
  {
    number: "02",
    title: "Affected subjects identified",
    chainLink: "REALITY",
    result: "PASS",
    reasonCode: "SUBJECTS_IDENTIFIED",
    summary: "Organization, target environment, adapter, and reviewers are attributable.",
  },
  {
    number: "03",
    title: "Source record captured",
    chainLink: "RECORD",
    result: "PASS",
    reasonCode: "SOURCE_CAPTURED",
    summary: "Deployment request, target environment, requested privileges, model identity, and execution window were preserved before reliance.",
  },
  {
    number: "04",
    title: "Record identity fixed",
    chainLink: "RECORD",
    result: "PASS",
    reasonCode: "RECORD_ID_FIXED",
    summary: "Stable IDs and version references were assigned.",
  },
  {
    number: "05",
    title: "Actor identity resolved",
    chainLink: "CONTINUITY",
    result: "PASS",
    reasonCode: "IDENTITY_RESOLVED",
    summary: "approver and executor identities were resolved.",
  },
  {
    number: "06",
    title: "Authorization source linked",
    chainLink: "CONTINUITY",
    result: "PASS",
    reasonCode: "AUTHORITY_SOURCE_LINKED",
    summary: "Delegation source was linked to the actor record.",
  },
  {
    number: "07",
    title: "Delegation continuity checked",
    chainLink: "BINDING",
    result: "FAIL",
    reasonCode: "EXECUTION_BOUNDARY_EXCEEDED",
    summary: "Approved execution scope was exceeded before commit.",
  },
  {
    number: "08",
    title: "Route version continuous",
    chainLink: "CONTINUITY",
    result: "PASS",
    reasonCode: "ROUTE_VERSION_CONTINUOUS",
    summary: "Route version 1.0.0 remained unchanged.",
  },
  {
    number: "09",
    title: "Evidence relevance tested",
    chainLink: "ADMISSIBILITY",
    result: "PASS",
    reasonCode: "EVIDENCE_RELEVANT",
    summary: "Deployment request, change ticket, and target environment records bear on the deployment.",
  },
  {
    number: "10",
    title: "Evidence freshness tested",
    chainLink: "ADMISSIBILITY",
    result: "PASS",
    reasonCode: "EVIDENCE_CURRENT",
    summary: "Evidence remained within the configured freshness window.",
  },
  {
    number: "11",
    title: "Evidence sufficiency tested",
    chainLink: "ADMISSIBILITY",
    result: "PASS",
    reasonCode: "EVIDENCE_SUFFICIENT",
    summary: "Deployment evidence was complete for evaluation.",
  },
  {
    number: "12",
    title: "Authority admissibility tested",
    chainLink: "ADMISSIBILITY",
    result: "FAIL",
    reasonCode: "AUTHORITY_INADMISSIBLE",
    summary: "Exceeded authority cannot support the present consequence.",
  },
  {
    number: "13",
    title: "Dual approval rule applied",
    chainLink: "BINDING",
    result: "FAIL",
    reasonCode: "DUAL_AUTHORITY_UNSATISFIED",
    summary: "The route requires a valid release authority whose delegation expressly covers the exact production environment, model version, privileges, execution window, and rollback package.",
  },
  {
    number: "14",
    title: "Scope ceiling applied",
    chainLink: "BINDING",
    result: "PASS",
    reasonCode: "AMOUNT_WITHIN_LIMIT",
    summary: "The scope remained within the declared ceiling.",
  },
  {
    number: "15",
    title: "Destination boundary applied",
    chainLink: "BINDING",
    result: "PASS",
    reasonCode: "DESTINATION_AUTHORIZED",
    summary: "The destination matched the frozen target environment endpoint.",
  },
  {
    number: "16",
    title: "Separation of duties applied",
    chainLink: "BINDING",
    result: "PASS",
    reasonCode: "DUTIES_SEPARATED",
    summary: "Requester, approvers, and runtime operator remained separate.",
  },
  {
    number: "17",
    title: "Earliest failure fixed",
    chainLink: "COMMIT",
    result: "PASS",
    reasonCode: "EXECUTION_BOUNDARY_EXCEEDED",
    summary: "Continuity was fixed as the controlling break.",
  },
  {
    number: "18",
    title: "Determination fixed",
    chainLink: "COMMIT",
    result: "PASS",
    reasonCode: "DETERMINATION_DENY",
    summary: "DENY was committed before adapter invocation.",
  },
  {
    number: "19",
    title: "Permitted next action fixed",
    chainLink: "COMMIT",
    result: "PASS",
    reasonCode: "REPAIR_AND_REVALIDATE",
    summary: "Only new bounded authorization and dependent-gate rerun are permitted.",
  },
  {
    number: "20",
    title: "Adapter command generated",
    chainLink: "EXECUTION",
    result: "PASS",
    reasonCode: "COMMAND_DENY",
    summary: "The adapter received a non-release command.",
  },
  {
    number: "21",
    title: "Production deployment blocked",
    chainLink: "EXECUTION",
    result: "PASS",
    reasonCode: "HTTP_403_DENIED",
    summary: "The execution endpoint returned DENIED.",
  },
  {
    number: "22",
    title: "Bypass resistance checked",
    chainLink: "EXECUTION",
    result: "PASS",
    reasonCode: "NO_BYPASS",
    summary: "No alternate path or retry released the deployment.",
  },
  {
    number: "23",
    title: "Outcome observed",
    chainLink: "OUTCOME",
    result: "PASS",
    reasonCode: "ZERO_TRANSFER_CONFIRMED",
    summary: "No production changes left the controlled account state.",
  },
  {
    number: "24",
    title: "Record package preserved",
    chainLink: "OUTCOME",
    result: "PASS",
    reasonCode: "PACKAGE_PRESERVED",
    summary: "The event, receipt, outcome, and limits were packaged for verification.",
  },
];

const evidence: EvidenceItem[] = [
  {
    id: "EA-000003-EV-01",
    title: "Production deployment request",
    source: "TA-14 Scenario Author",
    type: "DECLARATION",
    disclosure: "PUBLIC",
    status: "ADMITTED",
    capturedAt: "2026-07-31 19:12:00 UTC",
    hash: "1aa79af3...d4c2",
    supports: "Exact target environment, scope, deployment request, destination, and deployment boundary.",
    limitation: "Controlled demonstration record; no production systems were changed.",
  },
  {
    id: "EA-000003-EV-02",
    title: "Frozen boundary-sensitive route",
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
    id: "EA-000003-EV-03",
    title: "Deployment request and change ticket package",
    source: "TA-14 Evidence Custodian",
    type: "BUSINESS_RECORD",
    disclosure: "SELECTIVE",
    status: "ADMITTED",
    capturedAt: "2026-07-31 19:12:10 UTC",
    hash: "bf90e123...93d1",
    supports: "Deployment purpose, deployment request scope, change ticket relationship, and requested due state.",
    limitation: "Does not independently establish execution authority.",
  },
  {
    id: "EA-000003-EV-04",
    title: "Initial approved execution scope",
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
    id: "EA-000003-EV-05",
    title: "Scope violation event",
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
    id: "EA-000003-EV-06",
    title: "Continuity revalidation ledger",
    source: "TA-14 Continuity Validator",
    type: "SYSTEM_RECORD",
    disclosure: "PUBLIC",
    status: "ADMITTED",
    capturedAt: "2026-07-31 19:15:43 UTC",
    hash: "5a10cb73...e776",
    supports: "The boundary state changed and dependent gates required rerun.",
    limitation: "Bounded to the disclosed route inputs and event window.",
  },
  {
    id: "EA-000003-EV-07",
    title: "Denied-action execution receipt",
    source: "TA-14 Reference Deployment Adapter",
    type: "EXECUTION_RECEIPT",
    disclosure: "PUBLIC",
    status: "ADMITTED",
    capturedAt: "2026-07-31 19:16:03 UTC",
    hash: "58a1b51e...e52f",
    supports: "The committed DENY prevented transmission and retained the request.",
    limitation: "Proves control of the reference adapter, not every external deployment rail.",
  },
  {
    id: "EA-000003-EV-08",
    title: "Zero-mutation outcome closure",
    source: "TA-14 Outcome Verifier",
    type: "OUTCOME_EVIDENCE",
    disclosure: "PUBLIC",
    status: "ADMITTED",
    capturedAt: "2026-07-31 19:17:20 UTC",
    hash: "bd21dd3a...79e4",
    supports: "No production changes were transmitted and the request remained preserved.",
    limitation: "Outcome verification is bounded to the observed adapter, queue, and event window.",
  },
];

const boundaryEvents: BoundaryEvent[] = [
  {
    time: "19:12:11",
    event: "AUTHORITY RESOLVED",
    detail: "The approved execution scope was limited to staging diagnostics using model v7.3 with read-only privileges.",
    state: "VALID",
  },
  {
    time: "19:13:02",
    event: "RELEASE AUTHORITY PRESERVED",
    detail: "Release authority A-17 remained attributable, current, and valid only for the original staging scope.",
    state: "VALID",
  },
  {
    time: "19:15:41",
    event: "BOUNDARY VIOLATION DETECTED",
    detail: "The authority resolver received a violation before commit.",
    state: "CHANGED",
  },
  {
    time: "19:15:43",
    event: "DEPENDENT GATES INVALIDATED",
    detail: "Continuity, admissibility, binding, and commit gates were rerun.",
    state: "REVALIDATE",
  },
  {
    time: "19:16:02",
    event: "DENY COMMITTED",
    detail: "The route fixed DENY and blocked execution pending new bounded authorization.",
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
    detail: "Disclosed inputs reproduce DENY after the scope violation event.",
  },
  {
    level: "L5",
    label: "Execution effect",
    detail: "The adapter receipt proves DENIED, HTTP 403, token revocation, zero production mutations, and blocked bypass.",
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
    condition: "DENY produced the required block, token-revocation, and zero-mutation execution effect.",
  },
  {
    id: "AT-04",
    result: "PASS",
    condition: "The failed continuity gate could not be skipped to reach ALLOW.",
  },
  {
    id: "AT-05",
    result: "PASS",
    condition: "The out-of-scope request triggered immediate dependent-gate failure and denied execution.",
  },
  {
    id: "AT-06",
    result: "PASS",
    condition: "The adapter produced a technical receipt proving denial, token revocation, and zero production mutation.",
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
      "Deploy one named model only to the authorized environment, with the exact approved privileges, version, time window, and rollback controls.",
    scope: "production model v7.4.00",
    consequenceAtStake:
      "No production mutation may occur outside the frozen destination, privilege, model, time, and rollback boundary.",
    affectedSubjects: [
      "TA-14 controlled demonstration environment",
      "named production environment",
      "reference deployment adapter",
      "authorized financial reviewers",
    ],
    declaredLimits: [
      "No production customer system is affected.",
      "The record proves one bounded event only.",
      "The record does not certify every future route, adapter, or execution.",
    ],
  },
  route: {
    routeId: ROUTE_ID,
    routeVersion: ROUTE_VERSION,
    gateCount: 24,
    earliestFailure: "BINDING",
    earliestFailureGate: "07",
    reasonCodes: [
      "EXECUTION_BOUNDARY_EXCEEDED",
      "AUTHORITY_INADMISSIBLE",
      "DUAL_AUTHORITY_UNSATISFIED",
    ],
    requiredRepair: [
      "Create a new authorization that expressly covers the requested action.",
      "Preserve the new boundary and authorization record with its effective time.",
      "Rerun continuity, admissibility, binding, and commit gates.",
      "Generate a new commit and execution receipt; do not amend the original event into ALLOW.",
    ],
  },
  commit: {
    determination: "DENY",
    committedAt: "2026-07-31T19:16:02Z",
    permittedNextAction: "REPAIR_AND_REVALIDATE",
    prohibitedAction: "PRODUCTION_DEPLOYMENT",
  },
  execution: {
    adapter: "TA-14 Reference Deployment Adapter",
    adapterVersion: "1.0.0",
    command: "DENY_AND_REVOKE",
    technicalStatus: 403,
    receiptId: "EA-000003-EX-01",
    receiptHash: RECEIPT_HASH,
    productionMutations: 0,
    bypassDetected: false,
  },
  outcome: {
    state: "DENIAL_PRESERVED",
    productionEnvironmentChanged: false,
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
  boundaryEvents,
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



const boundaryMatrix = [
  { field: "Environment", authorized: "Staging", requested: "Production", result: "FAIL", rule: "Destination may not expand after approval." },
  { field: "Privileges", authorized: "Read-only diagnostics", requested: "Create, update, delete", result: "FAIL", rule: "Write capability requires separate authority." },
  { field: "Model version", authorized: "v7.3", requested: "v7.4", result: "FAIL", rule: "Model identity is part of the committed scope." },
  { field: "Change window", authorized: "02:00-02:30 UTC", requested: "Immediate", result: "FAIL", rule: "Execution outside the approved time window is prohibited." },
  { field: "Rollback", authorized: "Required and tested", requested: "Not supplied", result: "FAIL", rule: "Production release requires an executable rollback path." },
  { field: "Approver", authorized: "Release authority A-17", requested: "Same approver", result: "PASS", rule: "Identity remained valid but could not enlarge scope." },
];

const prohibitedCapabilities = [
  "Production write access",
  "Privilege escalation",
  "Unapproved model-version substitution",
  "Execution outside the maintenance window",
  "Release without tested rollback",
  "Alternate-path deployment after denial",
];

const newAuthorizationRequirements = [
  "Name the production environment and exact destination resources.",
  "Declare each permitted create, update, delete, and network capability.",
  "Bind the authorization to model v7.4 and its immutable package hash.",
  "Define a new execution window and immediate pre-runtime revalidation.",
  "Attach a tested rollback package and accountable rollback authority.",
  "Run the complete route as a new event; never overwrite this denial.",
];

const boundaryRules = [
  {
    id: "BR-01",
    title: "Destination specificity",
    requirement: "The committed authorization must name the exact environment and destination resources.",
    observed: "The preserved authorization named staging. The request targeted production.",
    consequence: "The destination expansion is prohibited and cannot be inferred from general access.",
  },
  {
    id: "BR-02",
    title: "Privilege specificity",
    requirement: "Every consequential capability must be expressly enumerated before commit.",
    observed: "Read-only diagnostics were authorized; create, update, and delete privileges were requested.",
    consequence: "Write capability remained outside the execution boundary.",
  },
  {
    id: "BR-03",
    title: "Model identity continuity",
    requirement: "The model package, version, and digest must match the authorized object.",
    observed: "Authorization covered v7.3; the request substituted v7.4.",
    consequence: "A different model cannot inherit another model's authorization.",
  },
  {
    id: "BR-04",
    title: "Temporal boundary",
    requirement: "Execution must occur inside the authorized change window.",
    observed: "The request demanded immediate release outside 02:00-02:30 UTC.",
    consequence: "Urgency did not create a new execution window.",
  },
  {
    id: "BR-05",
    title: "Rollback readiness",
    requirement: "A tested rollback package and accountable rollback authority must exist before production release.",
    observed: "No tested rollback package accompanied the request.",
    consequence: "The production route could not bind without recoverability evidence.",
  },
  {
    id: "BR-06",
    title: "No scope inheritance",
    requirement: "Identity, expertise, prior approval, and platform access do not enlarge authority.",
    observed: "The same actor submitted both the valid staging request and the invalid production request.",
    consequence: "Known identity strengthened attribution but did not cure the scope violation.",
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
    title: "New event for new authority",
    requirement: "A materially broader authorization must create a new route event.",
    observed: "No production authorization existed in the frozen record.",
    consequence: "Repair requires a new authorization and a complete rerun, not an amendment that rewrites this denial.",
  },
];

const denialInvariants = [
  "The denied request never received a production execution token.",
  "No create, update, delete, migration, or network-change command reached the target environment.",
  "The original staging authorization remains visible and is not falsely labeled invalid.",
  "The broader production request remains attributable to the requesting actor.",
  "The DENY commit precedes adapter invocation and cannot be backdated.",
  "The execution receipt, outcome record, public page, and manifest resolve to one event.",
  "Revalidation of unchanged facts cannot cure a hard scope violation.",
  "Only a new bounded authorization can support a new production route.",
  "The denial does not certify the model as unsafe; it proves the request was unauthorized.",
  "The zero-mutation outcome is verified independently from the determination record.",
];

const packageComponents = [
  { id: "PKG-01", name: "Canonical bounded record", format: "JSON", status: "INCLUDED", purpose: "Machine-readable root event" },
  { id: "PKG-02", name: "Human-readable inspection record", format: "HTML/PDF", status: "INCLUDED", purpose: "Public inspection and review" },
  { id: "PKG-03", name: "Frozen scenario snapshot", format: "JSON", status: "INCLUDED", purpose: "Exact proposed consequence" },
  { id: "PKG-04", name: "Route snapshot", format: "JSON", status: "INCLUDED", purpose: "Versioned gates and thresholds" },
  { id: "PKG-05", name: "Evidence manifest", format: "JSON", status: "INCLUDED", purpose: "Source, freshness, custody, hashes" },
  { id: "PKG-06", name: "Authority ledger", format: "JSON", status: "INCLUDED", purpose: "Identity, delegation, scope, expiry" },
  { id: "PKG-07", name: "Boundary comparison matrix", format: "JSON", status: "INCLUDED", purpose: "Authorized versus requested scope" },
  { id: "PKG-08", name: "24-link runtime ledger", format: "JSON", status: "INCLUDED", purpose: "Ordered gate results" },
  { id: "PKG-09", name: "Determination commit", format: "JSON", status: "INCLUDED", purpose: "Fixed DENY before action" },
  { id: "PKG-10", name: "Execution denial receipt", format: "JSON", status: "INCLUDED", purpose: "HTTP 403 and token revocation" },
  { id: "PKG-11", name: "Bypass-attempt record", format: "JSON", status: "INCLUDED", purpose: "Alternate-path prevention" },
  { id: "PKG-12", name: "Outcome closure", format: "JSON", status: "INCLUDED", purpose: "Verified zero production mutations" },
  { id: "PKG-13", name: "Integrity manifest", format: "JSON", status: "INCLUDED", purpose: "Component and package hashes" },
  { id: "PKG-14", name: "Verification instructions", format: "TXT", status: "INCLUDED", purpose: "Online and offline verification" },
  { id: "PKG-15", name: "Challenge record template", format: "JSON", status: "INCLUDED", purpose: "Bounded objection pathway" },
  { id: "PKG-16", name: "Claims-boundary statement", format: "TXT", status: "INCLUDED", purpose: "What the artifact does and does not prove" },
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

export default function ExecutionArtifact000003Page() {
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
    { id: "boundary", label: "Boundary violation" },
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
            <Link className="artifact-link" href="/artifacts/ta14-ea-000001">← Artifact 000001</Link>
            <Link className="artifact-link" href="/artifacts">Artifact library</Link>
            <Link className="artifact-link" href="/workspace/artifacts/build">Build an artifact</Link>
          </div>
        </header>

        <section className="artifact-hero">
          <div className="artifact-hero-grid">
            <div className="artifact-hero-copy">
              <div className="artifact-kicker">Execution artifact 02 of 12 · canonical execution-boundary proof</div>
              <h1>
                Boundary violation
                <span>stopped execution.</span>
              </h1>
              <p className="artifact-lede">
                A executor possessed valid delegated authority when the deployment route began.
                That authority was exceeded before commitment. TA-14 preserved the change,
                invalidated dependent gates, committed DENY, blocked transmission, and closed
                the outcome with zero unauthorized actions executed.
              </p>
              <div className="artifact-hero-meta">
                <span className="artifact-chip">{ARTIFACT_ID}</span>
                <span className="artifact-chip">Route {ROUTE_VERSION}</span>
                <span className="artifact-chip">Earliest failure: BINDING / EXECUTION BOUNDARY</span>
                <span className="artifact-chip">Verification level: 6</span>
                <span className="artifact-chip">Controlled demonstration</span>
              </div>
            </div>

            <aside className="artifact-decision">
              <div>
                <div className="artifact-decision-label">Committed determination</div>
                <div className="artifact-decision-word">DENY</div>
                <p>
                  Do not transmit. Preserve the request, restore valid authority, and rerun every
                  dependent gate before a new commit is considered.
                </p>
              </div>
              <div className="artifact-decision-grid">
                <div className="artifact-decision-cell">
                  <span>Control effect</span>
                  <strong>HTTP 403 · DENIED</strong>
                </div>
                <div className="artifact-decision-cell">
                  <span>Production changes released</span>
                  <strong>$0.00</strong>
                </div>
                <div className="artifact-decision-cell">
                  <span>Earliest break</span>
                  <strong>Gate 07</strong>
                </div>
                <div className="artifact-decision-cell">
                  <span>Repair path</span>
                  <strong>Boundary + authorization</strong>
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
                subtitle="This view answers what was proposed, what governed it, why the decision occurred, whether the decision changed the action path, and what outcome followed."
              >
                <div className="artifact-proof-grid">
                  <article className="artifact-proof-card">
                    <div className="artifact-overline">Proposed consequence</div>
                    <h3>Deploy model v7.4 to the production decision environment with create, update, and delete privileges.</h3>
                    <p>
                      The route required current deployment evidence, a frozen target environment destination,
                      valid release authority, preserved continuity, an explicit execution boundary, and a
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
                    <h3>The architecture failed closed on boundary violation.</h3>
                    <p>
                      TA-14 did not treat an earlier valid approval as permanent permission. It
                      preserved the changed boundary state, reran dependent gates, committed DENY,
                      and produced a technical non-release receipt.
                    </p>
                  </article>
                  <article className="artifact-proof-card boundary">
                    <div className="artifact-overline">What this does not prove</div>
                    <h3>No universal or production certification is claimed.</h3>
                    <p>
                      This controlled demonstration proves one bounded event through the TA-14
                      reference engine and adapter. It does not certify every organization, deployment
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
                subtitle="Later success cannot repair an earlier continuity failure. Each anchor remains visible even when the path stops."
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
                subtitle="The first controlling failure occurred at gate 07. Dependent admissibility and binding gates also failed, but they did not replace the earliest-failure finding."
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

            {view === "boundary" ? (
              <Panel
                eyebrow="Boundary integrity"
                title="The identity was valid. The requested consequence was not within its boundary."
                subtitle="The architecture preserves the valid underlying identity and the narrower authorization while refusing to transform either into authority for a broader production consequence."
              >
                <div className="artifact-authority-stage">
                  <div className="artifact-boundary-ledger">
                    {boundaryEvents.map((event) => (
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
                    <h3>Binding / execution boundary</h3>
                    <p>
                      Identity, provenance, and continuity remained intact. The controlling failure occurred because the requested production action exceeded the authority and execution boundary preserved by the route. That hard scope violation controlled every downstream consequence.
                    </p>
                    <div className="artifact-row"><span>Gate</span><strong>17 · Binding boundary enforced</strong></div>
                    <div className="artifact-row" style={{ marginTop: 10 }}><span>Reason</span><strong>EXECUTION_BOUNDARY_EXCEEDED</strong></div>
                  </aside>
                </div>
                <div className="artifact-section-heading" style={{ marginTop: 28 }}>
                  <div>
                    <div className="artifact-overline">Boundary rulebook</div>
                    <h3>Eight independent controls prevented scope inheritance.</h3>
                  </div>
                </div>
                <div className="artifact-rule-grid">
                  {boundaryRules.map((rule) => (
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
                title="The determination changed what the system could do."
                subtitle="This is the difference between governance and description. The reference adapter received a control command, refused transmission, and generated a technical receipt."
              >
                <div className="artifact-effect">
                  <article className="artifact-effect-box">
                    <div className="artifact-overline">Attempted action</div>
                    <h3>Transmit production model v7.4</h3>
                    <p>
                      Target environment, scope, destination, authority chain, route version, and event
                      window were frozen before runtime evaluation.
                    </p>
                    <div className="artifact-receipt-grid">
                      <div className="artifact-row"><span>Adapter</span><strong>Reference Deployment Adapter</strong></div>
                      <div className="artifact-row"><span>Route</span><strong>{ROUTE_ID}</strong></div>
                    </div>
                  </article>
                  <div className="artifact-effect-arrow">→</div>
                  <article className="artifact-effect-box held">
                    <div className="artifact-overline">Enforced result</div>
                    <h3>DENIED · HTTP 403</h3>
                    <p>
                      The transmission endpoint remained closed. The request was retained in a
                      controlled queue with no alternate-path release and no backdated approval.
                    </p>
                    <div className="artifact-receipt-grid">
                      <div className="artifact-row"><span>Receipt</span><strong>EA-000003-EX-01</strong></div>
                      <div className="artifact-row"><span>Production mutations</span><strong>0</strong></div>
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
                subtitle="A DENY artifact proves that a prohibited action did not bind to reality. Revalidation alone cannot cure a hard boundary violation; only a new, independently evaluated authorization can create a different route."
              >
                <div className="artifact-timeline">
                  <article className="artifact-event"><time>19:12:00 UTC</time><strong>Scenario intake sealed</strong><p>The exact deployment, target environment, consequence, and declared limits entered the frozen record.</p></article>
                  <article className="artifact-event"><time>19:12:11 UTC</time><strong>Initial authority resolved</strong><p>Release authority A-17 and the original staging-only scope were attributable, current, and internally consistent.</p></article>
                  <article className="artifact-event"><time>19:15:41 UTC</time><strong>Approved execution scope exceeded</strong><p>The boundary evaluator detected that the requested production environment, write privileges, model version, timing, and rollback posture exceeded the approved scope.</p></article>
                  <article className="artifact-event"><time>19:15:43 UTC</time><strong>Dependent gates rerun</strong><p>Admissibility, authority scope, binding, and commit logic were evaluated against the frozen request.</p></article>
                  <article className="artifact-event"><time>19:16:02 UTC</time><strong>DENY committed</strong><p>The no-release state and repair requirement were fixed before adapter invocation.</p></article>
                  <article className="artifact-event"><time>19:16:03 UTC</time><strong>Production deployment blocked</strong><p>Receipt EA-000003-EX-01 recorded HTTP 403 and zero unauthorized actions executed.</p></article>
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
                <div className="artifact-side-row"><span>Earliest failure</span><strong>BINDING / BOUNDARY</strong></div>
                <div className="artifact-side-row"><span>Route</span><strong>{ROUTE_ID}</strong></div>
                <div className="artifact-side-row"><span>Route version</span><strong>{ROUTE_VERSION}</strong></div>
                <div className="artifact-side-row"><span>Status</span><strong>PUBLISHED DEMONSTRATION</strong></div>
              </div>
            </section>

            <section className="artifact-side-card">
              <div className="artifact-overline">Repair condition</div>
              <h3>A new bounded authorization is required.</h3>
              <p>
                Create a new authorization that explicitly covers the requested scope, preserve it as a new record, rerun every dependent gate, and generate a new commit. The original DENY remains
                immutable.
              </p>
              <div className="artifact-requirement-list">{newAuthorizationRequirements.map((item, index) => <div className="artifact-requirement" key={item}><span>{String(index + 1).padStart(2, "0")}</span><p>{item}</p></div>)}</div>
              <button className="artifact-button" type="button" onClick={() => selectView("boundary")}>Inspect boundary violation</button>
            </section>

            <section className="artifact-side-card">
              <div className="artifact-overline">Download package</div>
              <h3>Inspect offline.</h3>
              <p>Download public representations generated from this bounded demonstration record.</p>
              <div className="artifact-downloads">
                <button className="artifact-download" type="button" onClick={() => downloadText(`${ARTIFACT_ID}.json`, packageRecord)}>Canonical JSON <span>↓</span></button>
                <button className="artifact-download" type="button" onClick={() => downloadText(`${ARTIFACT_ID}-integrity-manifest.json`, integrityManifest)}>Integrity manifest <span>↓</span></button>
                <button className="artifact-download" type="button" onClick={() => downloadText(`${ARTIFACT_ID}-execution-receipt.json`, packageRecord.execution)}>Execution receipt <span>↓</span></button>
                <button className="artifact-download" type="button" onClick={() => downloadText(`${ARTIFACT_ID}-boundary-ledger.json`, boundaryEvents)}>Boundary ledger <span>↓</span></button>
                <button className="artifact-download" type="button" onClick={() => downloadText(`${ARTIFACT_ID}-verification.txt`, `Artifact: ${ARTIFACT_ID}\nExpected result: VERIFIED\nMaximum public level: 6\nRecord hash: ${RECORD_HASH}\nPackage hash: ${PACKAGE_HASH}\n`)}>Verification guide <span>↓</span></button>
              </div>
            </section>

            <section className="artifact-side-card artifact-boundary">
              <div className="artifact-overline">Claims boundary</div>
              <h3>Controlled demonstration.</h3>
              <p>
                This artifact proves one reference-engine event in which an out-of-scope production deployment produced
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
