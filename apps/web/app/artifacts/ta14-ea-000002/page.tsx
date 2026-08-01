"use client";

import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";

type View =
  | "inspection"
  | "chain"
  | "runtime"
  | "evidence"
  | "authority"
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

type AuthorityEvent = {
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

type AuthorityControl = {
  id: string;
  control: string;
  requiredState: string;
  observedState: string;
  result: GateResult;
  consequence: string;
};

type RepairStep = {
  sequence: string;
  title: string;
  owner: string;
  requiredEvidence: string;
  completionRule: string;
};

type PackageComponent = {
  id: string;
  name: string;
  format: string;
  status: string;
  purpose: string;
};

const ARTIFACT_ID = "TA14-EA-000002";
const ARTIFACT_TITLE = "Authority Drift Before Execution";
const ROUTE_ID = "TA14-ROUTE-AUTHORITY-DRIFT-HOLD-002";
const ROUTE_VERSION = "2.0.0";
const RECORD_HASH = "sha256:4c4f4f98ec77c9c61526af0a704a31adfcd1d647e6883f88a061c4a99d59bc2f";
const PACKAGE_HASH = "sha256:ed4f35ff5117bb0895185d360be3132fab44c9321ee8a09714422f736ff3ce97";
const RECEIPT_HASH = "sha256:58a1b51e87cdd2f2ae403c548db7df76b21c971686ff4d72744af3c3466fe52f";

const chain: ChainItem[] = [
  {
    number: "01",
    link: "Reality",
    result: "PASS",
    question: "What condition existed before interpretation?",
    finding: "A $48,750 vendor payment request existed inside the TA-14 controlled demonstration environment.",
    proof: "The proposed action, beneficiary, amount, destination, consequence, and declared boundary were preserved before evaluation.",
  },
  {
    number: "02",
    link: "Record",
    result: "PASS",
    question: "What attributable representation was preserved?",
    finding: "The invoice, beneficiary identity, contract reference, route snapshot, and initial approval chain were captured.",
    proof: "Every input received a stable identifier, capture time, source attribution, disclosure state, and integrity commitment.",
  },
  {
    number: "03",
    link: "Continuity",
    result: "FAIL",
    question: "Did identity, authority, state, and version remain connected?",
    finding: "The controller delegation was revoked after initial approval and before the final execution commit.",
    proof: "The authority event stream records the revocation and breaks continuity at the earliest controlling link.",
  },
  {
    number: "04",
    link: "Admissibility",
    result: "FAIL",
    question: "May the material support this exact consequence now?",
    finding: "The payment evidence remained admissible, but the revoked authority could not support present execution.",
    proof: "The admissibility evaluator rejects reliance on the superseded delegation for this route and event window.",
  },
  {
    number: "05",
    link: "Binding",
    result: "FAIL",
    question: "What rule validly governs the consequence?",
    finding: "The frozen route requires active CFO and controller authority at commit. The controller condition failed.",
    proof: "The binding record applies the fail-closed rule and prevents downstream permission from curing the earlier break.",
  },
  {
    number: "06",
    link: "Commit",
    result: "PASS",
    question: "What determination was fixed before action?",
    finding: "HOLD was committed before the adapter could transmit funds.",
    proof: "The commit record preserves the reason codes, earliest failure, repair condition, and permitted next action.",
  },
  {
    number: "07",
    link: "Execution",
    result: "PASS",
    question: "Did the determination control the action path?",
    finding: "The payment adapter refused transmission and retained the request in a non-releasable queue.",
    proof: "Receipt EA-000002-EX-01 records HTTP 423, zero dollars transmitted, no bypass, and no alternate-path release.",
  },
  {
    number: "08",
    link: "Outcome",
    result: "PASS",
    question: "What bound to reality, and what did not?",
    finding: "No payment was sent. The request remained preserved for authorized repair and revalidation.",
    proof: "Outcome closure confirms unchanged beneficiary state, held queue state, and residual risk limited to delayed payment.",
  },
];

const gates: GateItem[] = [
  {
    number: "01",
    title: "Observed condition registered",
    chainLink: "REALITY",
    result: "PASS",
    reasonCode: "PAYMENT_REQUEST_PRESENT",
    summary: "The proposed action and consequence are exact enough to govern.",
  },
  {
    number: "02",
    title: "Affected subjects identified",
    chainLink: "REALITY",
    result: "PASS",
    reasonCode: "SUBJECTS_IDENTIFIED",
    summary: "Organization, beneficiary, adapter, and reviewers are attributable.",
  },
  {
    number: "03",
    title: "Source record captured",
    chainLink: "RECORD",
    result: "PASS",
    reasonCode: "SOURCE_CAPTURED",
    summary: "Invoice and request were preserved before reliance.",
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
    summary: "CFO and controller identities were resolved.",
  },
  {
    number: "06",
    title: "Authority source linked",
    chainLink: "CONTINUITY",
    result: "PASS",
    reasonCode: "AUTHORITY_SOURCE_LINKED",
    summary: "Delegation source was linked to the actor record.",
  },
  {
    number: "07",
    title: "Delegation continuity checked",
    chainLink: "CONTINUITY",
    result: "FAIL",
    reasonCode: "AUTHORITY_STATE_CHANGED",
    summary: "Controller delegation was revoked before commit.",
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
    summary: "Invoice, contract, and beneficiary records bear on the payment.",
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
    summary: "Payment evidence was complete for evaluation.",
  },
  {
    number: "12",
    title: "Authority admissibility tested",
    chainLink: "ADMISSIBILITY",
    result: "FAIL",
    reasonCode: "AUTHORITY_INADMISSIBLE",
    summary: "Revoked authority cannot support the present consequence.",
  },
  {
    number: "13",
    title: "Dual approval rule applied",
    chainLink: "BINDING",
    result: "FAIL",
    reasonCode: "DUAL_AUTHORITY_UNSATISFIED",
    summary: "The route requires active CFO plus controller authority.",
  },
  {
    number: "14",
    title: "Amount ceiling applied",
    chainLink: "BINDING",
    result: "PASS",
    reasonCode: "AMOUNT_WITHIN_LIMIT",
    summary: "The amount remained within the declared ceiling.",
  },
  {
    number: "15",
    title: "Destination boundary applied",
    chainLink: "BINDING",
    result: "PASS",
    reasonCode: "DESTINATION_AUTHORIZED",
    summary: "The destination matched the frozen beneficiary endpoint.",
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
    reasonCode: "EARLIEST_FAILURE_CONTINUITY",
    summary: "Continuity was fixed as the controlling break.",
  },
  {
    number: "18",
    title: "Determination fixed",
    chainLink: "COMMIT",
    result: "PASS",
    reasonCode: "DETERMINATION_HOLD",
    summary: "HOLD was committed before adapter invocation.",
  },
  {
    number: "19",
    title: "Permitted next action fixed",
    chainLink: "COMMIT",
    result: "PASS",
    reasonCode: "REPAIR_AND_REVALIDATE",
    summary: "Only authority repair and dependent-gate rerun are permitted.",
  },
  {
    number: "20",
    title: "Adapter command generated",
    chainLink: "EXECUTION",
    result: "PASS",
    reasonCode: "COMMAND_HOLD",
    summary: "The adapter received a non-release command.",
  },
  {
    number: "21",
    title: "Transmission blocked",
    chainLink: "EXECUTION",
    result: "PASS",
    reasonCode: "HTTP_423_HELD",
    summary: "The payment transmission endpoint returned HELD.",
  },
  {
    number: "22",
    title: "Bypass resistance checked",
    chainLink: "EXECUTION",
    result: "PASS",
    reasonCode: "NO_BYPASS",
    summary: "No alternate path or retry released the payment.",
  },
  {
    number: "23",
    title: "Outcome observed",
    chainLink: "OUTCOME",
    result: "PASS",
    reasonCode: "ZERO_TRANSFER_CONFIRMED",
    summary: "No funds left the controlled account state.",
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
    id: "EA-000002-EV-01",
    title: "Vendor payment request",
    source: "TA-14 Scenario Author",
    type: "DECLARATION",
    disclosure: "PUBLIC",
    status: "ADMITTED",
    capturedAt: "2026-07-31 19:12:00 UTC",
    hash: "1aa79af3...d4c2",
    supports: "Exact beneficiary, amount, invoice, destination, and payment boundary.",
    limitation: "Controlled demonstration record; no production funds were used.",
  },
  {
    id: "EA-000002-EV-02",
    title: "Frozen authority-sensitive route",
    source: "TA-14 Route Resolver",
    type: "SYSTEM_RECORD",
    disclosure: "PUBLIC",
    status: "ADMITTED",
    capturedAt: "2026-07-31 19:12:07 UTC",
    hash: "8f7e21c9...a985",
    supports: "Route version, dual-authority rule, gate order, and revalidation triggers.",
    limitation: "Valid only for route version 1.0.0 and this bounded event.",
  },
  {
    id: "EA-000002-EV-03",
    title: "Invoice and contract package",
    source: "TA-14 Evidence Custodian",
    type: "BUSINESS_RECORD",
    disclosure: "SELECTIVE",
    status: "ADMITTED",
    capturedAt: "2026-07-31 19:12:10 UTC",
    hash: "bf90e123...93d1",
    supports: "Payment purpose, invoice amount, contract relationship, and requested due state.",
    limitation: "Does not independently establish execution authority.",
  },
  {
    id: "EA-000002-EV-04",
    title: "Initial controller delegation",
    source: "TA-14 Authority Resolver",
    type: "AUTHORITY_RECORD",
    disclosure: "SELECTIVE",
    status: "CONDITIONAL",
    capturedAt: "2026-07-31 19:12:11 UTC",
    hash: "6cf0c40a...6721",
    supports: "Controller identity and initial delegated approval scope.",
    limitation: "Superseded by the later revocation event before commit.",
  },
  {
    id: "EA-000002-EV-05",
    title: "Authority revocation event",
    source: "TA-14 Authority Resolver",
    type: "AUTHORITY_EVENT",
    disclosure: "SELECTIVE",
    status: "ADMITTED",
    capturedAt: "2026-07-31 19:15:41 UTC",
    hash: "e02c9097...4cb8",
    supports: "The required controller authority was revoked before execution commitment.",
    limitation: "Proves the bounded state change, not the underlying reason for revocation.",
  },
  {
    id: "EA-000002-EV-06",
    title: "Continuity revalidation ledger",
    source: "TA-14 Continuity Validator",
    type: "SYSTEM_RECORD",
    disclosure: "PUBLIC",
    status: "ADMITTED",
    capturedAt: "2026-07-31 19:15:43 UTC",
    hash: "5a10cb73...e776",
    supports: "The authority state changed and dependent gates required rerun.",
    limitation: "Bounded to the disclosed route inputs and event window.",
  },
  {
    id: "EA-000002-EV-07",
    title: "Held-payment execution receipt",
    source: "TA-14 Reference Payment Adapter",
    type: "EXECUTION_RECEIPT",
    disclosure: "PUBLIC",
    status: "ADMITTED",
    capturedAt: "2026-07-31 19:16:03 UTC",
    hash: "58a1b51e...e52f",
    supports: "The committed HOLD prevented transmission and retained the request.",
    limitation: "Proves control of the reference adapter, not every external payment rail.",
  },
  {
    id: "EA-000002-EV-08",
    title: "No-transfer outcome closure",
    source: "TA-14 Outcome Verifier",
    type: "OUTCOME_EVIDENCE",
    disclosure: "PUBLIC",
    status: "ADMITTED",
    capturedAt: "2026-07-31 19:17:20 UTC",
    hash: "bd21dd3a...79e4",
    supports: "No funds were transmitted and the request remained preserved.",
    limitation: "Outcome verification is bounded to the observed adapter, queue, and event window.",
  },
];

const authorityEvents: AuthorityEvent[] = [
  {
    time: "19:12:11",
    event: "AUTHORITY RESOLVED",
    detail: "Controller delegation was valid for vendor payments up to $50,000.",
    state: "VALID",
  },
  {
    time: "19:13:02",
    event: "CFO APPROVAL PRESERVED",
    detail: "CFO approval was attributable, in scope, and current.",
    state: "VALID",
  },
  {
    time: "19:15:41",
    event: "CONTROLLER DELEGATION REVOKED",
    detail: "The authority resolver received a revocation before commit.",
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
    event: "HOLD COMMITTED",
    detail: "The route fixed HOLD and blocked execution pending authority repair.",
    state: "HELD",
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
    detail: "Disclosed inputs reproduce HOLD after the authority revocation event.",
  },
  {
    level: "L5",
    label: "Execution effect",
    detail: "The adapter receipt proves HELD, HTTP 423, zero transmission, and no bypass.",
  },
  {
    level: "L6",
    label: "Outcome closure",
    detail: "Queue and beneficiary state support the reported no-transfer outcome.",
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
    condition: "The revocation was appended; the earlier approval was not silently overwritten.",
  },
  {
    id: "AT-03",
    result: "PASS",
    condition: "HOLD produced the required non-release execution effect.",
  },
  {
    id: "AT-04",
    result: "PASS",
    condition: "The failed continuity gate could not be skipped to reach ALLOW.",
  },
  {
    id: "AT-05",
    result: "PASS",
    condition: "The authority change triggered immediate dependent-gate revalidation.",
  },
  {
    id: "AT-06",
    result: "PASS",
    condition: "The adapter produced a technical receipt proving the hold.",
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

const authorityControls: AuthorityControl[] = [
  {
    id: "AC-01",
    control: "Initiating actor identity",
    requiredState: "Resolved and attributable",
    observedState: "CFO identity verified against the institutional directory",
    result: "PASS",
    consequence: "The request remained attributable to a known initiating authority.",
  },
  {
    id: "AC-02",
    control: "CFO role assignment",
    requiredState: "Active at commit",
    observedState: "Active throughout intake, evaluation, and commit",
    result: "PASS",
    consequence: "The first required approval remained valid.",
  },
  {
    id: "AC-03",
    control: "Controller identity",
    requiredState: "Resolved and attributable",
    observedState: "Controller identity remained known after revocation",
    result: "PASS",
    consequence: "Identity continuity survived even though authority continuity did not.",
  },
  {
    id: "AC-04",
    control: "Controller delegation",
    requiredState: "Active at commit",
    observedState: "Revoked at 19:15:41 UTC before commit",
    result: "FAIL",
    consequence: "The route lost one mandatory authority condition.",
  },
  {
    id: "AC-05",
    control: "Delegation scope",
    requiredState: "Vendor payments up to $50,000",
    observedState: "Historical scope matched the proposed amount",
    result: "PASS",
    consequence: "Scope was not the controlling failure; current validity was.",
  },
  {
    id: "AC-06",
    control: "Delegation source",
    requiredState: "Linked to an institutional authority record",
    observedState: "Source record AUTH-CTRL-2026-044 preserved",
    result: "PASS",
    consequence: "The original authority and later revocation are both reconstructable.",
  },
  {
    id: "AC-07",
    control: "Revocation visibility",
    requiredState: "Visible before determination",
    observedState: "Authority event stream delivered revocation before commit",
    result: "PASS",
    consequence: "The route had an opportunity and obligation to fail closed.",
  },
  {
    id: "AC-08",
    control: "Dual approval rule",
    requiredState: "CFO plus active controller",
    observedState: "CFO active; controller revoked",
    result: "FAIL",
    consequence: "Mandatory dual approval was not satisfied.",
  },
  {
    id: "AC-09",
    control: "Separation of duties",
    requiredState: "Initiator cannot replace missing approver",
    observedState: "No substitution or self-approval permitted",
    result: "PASS",
    consequence: "The architecture prevented authority collapse into one actor.",
  },
  {
    id: "AC-10",
    control: "Backdating prohibition",
    requiredState: "No later approval may rewrite the original event",
    observedState: "Original HOLD remains immutable",
    result: "PASS",
    consequence: "Any repaired execution must create a new commit and receipt.",
  },
  {
    id: "AC-11",
    control: "Execution token state",
    requiredState: "Token issued only after valid commit",
    observedState: "No releasable token issued",
    result: "PASS",
    consequence: "The adapter could not transmit despite the preserved request.",
  },
  {
    id: "AC-12",
    control: "Revalidation requirement",
    requiredState: "All dependent gates rerun after repair",
    observedState: "Repair pending; no revalidation completed",
    result: "FAIL",
    consequence: "The route remains held until a new authority state survives review.",
  },
];

const repairSteps: RepairStep[] = [
  {
    sequence: "01",
    title: "Issue or identify a valid controller delegation",
    owner: "Institutional authority administrator",
    requiredEvidence: "New delegation record with actor, role, scope, issuer, effective time, and integrity commitment",
    completionRule: "The delegation must be active for this exact payment route and amount ceiling.",
  },
  {
    sequence: "02",
    title: "Preserve the repaired authority state",
    owner: "Authority resolver",
    requiredEvidence: "Authority snapshot linked to the original held request without overwriting the original event",
    completionRule: "The repaired state must receive a new stable identifier and timestamp.",
  },
  {
    sequence: "03",
    title: "Recheck identity and scope",
    owner: "Route operator",
    requiredEvidence: "Identity resolution and scope comparison for the CFO and controller",
    completionRule: "Both actors must remain distinct, attributable, active, and in scope.",
  },
  {
    sequence: "04",
    title: "Revalidate payment evidence",
    owner: "Evidence custodian",
    requiredEvidence: "Fresh beneficiary, invoice, contract, and destination records",
    completionRule: "No material payment condition may have drifted while the request was held.",
  },
  {
    sequence: "05",
    title: "Rerun dependent continuity gates",
    owner: "TA-14 runtime",
    requiredEvidence: "New continuity ledger covering identity, authority, route, destination, and custody",
    completionRule: "Every mandatory continuity condition must pass in the repaired state.",
  },
  {
    sequence: "06",
    title: "Rerun admissibility and binding gates",
    owner: "TA-14 runtime",
    requiredEvidence: "New admissibility and binding records referencing the repaired authority snapshot",
    completionRule: "The route must establish current authority and the dual approval obligation.",
  },
  {
    sequence: "07",
    title: "Create a new determination commit",
    owner: "Authorized runtime operator",
    requiredEvidence: "New commit record with route version, admitted evidence, authority snapshot, and reason codes",
    completionRule: "The new commit may not alter, replace, or backdate the original HOLD.",
  },
  {
    sequence: "08",
    title: "Invoke the adapter only from the new commit",
    owner: "Reference payment adapter",
    requiredEvidence: "New execution token and technical receipt",
    completionRule: "The adapter must reject any token derived from the original held commit.",
  },
];

const packageComponents: PackageComponent[] = [
  { id: "PKG-01", name: "Public inspection record", format: "HTML", status: "PUBLISHED", purpose: "Sixty-second review of the bounded event and claim limits." },
  { id: "PKG-02", name: "Canonical bounded record", format: "JSON", status: "AVAILABLE", purpose: "Machine-readable root record for the artifact." },
  { id: "PKG-03", name: "Human-readable bounded record", format: "PDF", status: "GENERATABLE", purpose: "Institutional export derived from the frozen record." },
  { id: "PKG-04", name: "Scenario snapshot", format: "JSON", status: "AVAILABLE", purpose: "Proposed action, consequence, subjects, environment, and limits." },
  { id: "PKG-05", name: "Route snapshot", format: "JSON", status: "AVAILABLE", purpose: "Frozen route version, gate order, rules, thresholds, and revalidation triggers." },
  { id: "PKG-06", name: "Evidence manifest", format: "JSON", status: "AVAILABLE", purpose: "Evidence identity, provenance, disclosure, integrity, and admissibility state." },
  { id: "PKG-07", name: "Authority ledger", format: "JSON", status: "AVAILABLE", purpose: "Original delegation, revocation event, current state, and repair boundary." },
  { id: "PKG-08", name: "Continuity record", format: "JSON", status: "AVAILABLE", purpose: "Identity, authority, route, custody, and state-change continuity findings." },
  { id: "PKG-09", name: "Admissibility record", format: "JSON", status: "AVAILABLE", purpose: "Item-by-item reliance findings for evidence and authority." },
  { id: "PKG-10", name: "Binding record", format: "JSON", status: "AVAILABLE", purpose: "Dual approval rule, amount ceiling, destination, and fail-closed obligation." },
  { id: "PKG-11", name: "Gate ledger", format: "JSON", status: "AVAILABLE", purpose: "All twenty-four runtime results and earliest-failure finding." },
  { id: "PKG-12", name: "Commit record", format: "JSON", status: "AVAILABLE", purpose: "Immutable HOLD determination, reason codes, and permitted next action." },
  { id: "PKG-13", name: "Execution receipt", format: "JSON", status: "AVAILABLE", purpose: "HTTP 423 refusal, held queue state, zero transfer, and bypass result." },
  { id: "PKG-14", name: "Outcome closure", format: "JSON", status: "AVAILABLE", purpose: "Observed no-transfer result, residual risk, and follow-up requirement." },
  { id: "PKG-15", name: "Integrity manifest", format: "JSON", status: "AVAILABLE", purpose: "Canonical hash, package hash, component hashes, and verifier metadata." },
  { id: "PKG-16", name: "Verification instructions", format: "TXT", status: "AVAILABLE", purpose: "Online and offline steps with expected verification outputs." },
  { id: "PKG-17", name: "Replay input", format: "JSON", status: "AVAILABLE", purpose: "Disclosed inputs sufficient to reproduce the HOLD determination." },
  { id: "PKG-18", name: "Acceptance-test report", format: "JSON", status: "AVAILABLE", purpose: "Pass results for schema, control, parity, integrity, and claims boundaries." },
  { id: "PKG-19", name: "Challenge record", format: "JSON", status: "OPEN", purpose: "Append-only pathway for bounded disputes and corrections." },
  { id: "PKG-20", name: "Repair protocol", format: "JSON", status: "AVAILABLE", purpose: "Exact conditions required before a new commit may be considered." },
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
    determination: "HOLD",
    verificationLevel: 6,
    simulated: true,
  },
  scenario: {
    proposedAction:
      "Transmit one high-value vendor payment only if the required authority remains valid through commit.",
    amount: "$48,750.00",
    consequenceAtStake:
      "Funds may leave the governed organization only under continuously valid dual authority.",
    affectedSubjects: [
      "TA-14 controlled demonstration environment",
      "vendor beneficiary",
      "reference payment adapter",
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
    earliestFailure: "CONTINUITY",
    earliestFailureGate: "07",
    reasonCodes: [
      "AUTHORITY_STATE_CHANGED",
      "AUTHORITY_INADMISSIBLE",
      "DUAL_AUTHORITY_UNSATISFIED",
    ],
    requiredRepair: [
      "Resolve a presently valid controller authority source.",
      "Preserve the new authority record and effective time.",
      "Rerun continuity, admissibility, binding, and commit gates.",
      "Generate a new commit and execution receipt; do not amend the original event into ALLOW.",
    ],
  },
  commit: {
    determination: "HOLD",
    committedAt: "2026-07-31T19:16:02Z",
    permittedNextAction: "REPAIR_AND_REVALIDATE",
    prohibitedAction: "PAYMENT_TRANSMISSION",
  },
  execution: {
    adapter: "TA-14 Reference Payment Adapter",
    adapterVersion: "1.0.0",
    command: "HOLD",
    technicalStatus: 423,
    receiptId: "EA-000002-EX-01",
    receiptHash: RECEIPT_HASH,
    amountTransmitted: "$0.00",
    bypassDetected: false,
  },
  outcome: {
    state: "HOLD_PRESERVED",
    beneficiaryChanged: false,
    fundsTransmitted: false,
    residualRisk: "Payment delay until valid authority is restored and the route is revalidated.",
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
  authorityEvents,
  verificationChecks,
  acceptanceTests,
};

const integrityManifest = {
  artifactId: ARTIFACT_ID,
  routeId: ROUTE_ID,
  routeVersion: ROUTE_VERSION,
  determination: "HOLD",
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
  .artifact-authority-ledger { display: grid; gap: 12px; }
  .artifact-authority-event { display: grid; grid-template-columns: 82px minmax(0, 1fr) 94px; gap: 14px; padding: 17px; border: 1px solid var(--line); border-radius: 15px; background: rgba(255,255,255,.016); }
  .artifact-authority-event.changed { border-color: rgba(255,123,143,.28); }
  .artifact-authority-event time { color: var(--cyan); font-variant-numeric: tabular-nums; }
  .artifact-authority-event strong { display: block; }
  .artifact-authority-event p { margin: 6px 0 0; color: var(--muted); line-height: 1.5; }
  .artifact-authority-state { justify-self: end; align-self: start; border: 1px solid var(--line); border-radius: 999px; padding: 7px 9px; font-size: 10px; }
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

  .artifact-control-matrix { display: grid; gap: 10px; margin-top: 22px; }
  .artifact-control-row { display: grid; grid-template-columns: 74px 1.1fr 1fr 1fr 84px; gap: 12px; align-items: start; border: 1px solid var(--line); border-radius: 14px; padding: 15px; background: rgba(255,255,255,.014); }
  .artifact-control-row.fail { border-color: rgba(255,123,143,.28); background: linear-gradient(90deg, rgba(255,123,143,.065), transparent); }
  .artifact-control-row span { color: var(--muted); font-size: 12px; line-height: 1.5; }
  .artifact-control-row strong { font-size: 13px; line-height: 1.45; }
  .artifact-control-result { justify-self: end; border: 1px solid rgba(99,240,189,.28); color: var(--green); border-radius: 999px; padding: 7px 9px; font-size: 10px; font-weight: 900; }
  .artifact-control-row.fail .artifact-control-result { border-color: rgba(255,123,143,.3); color: var(--red); }
  .artifact-repair-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; margin-top: 20px; }
  .artifact-repair-card { border: 1px solid var(--line); border-radius: 16px; padding: 18px; background: rgba(255,255,255,.015); }
  .artifact-repair-card h3 { margin: 8px 0 12px; font-size: 19px; }
  .artifact-repair-card p { margin: 7px 0 0; color: var(--muted); line-height: 1.55; }
  .artifact-repair-number { width: 38px; height: 38px; display: grid; place-items: center; border: 1px solid rgba(101,223,255,.32); border-radius: 11px; color: var(--cyan); font-weight: 900; }
  .artifact-package-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; margin-top: 20px; }
  .artifact-package-item { border: 1px solid var(--line); border-radius: 14px; padding: 15px; background: rgba(255,255,255,.014); }
  .artifact-package-top { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
  .artifact-package-item h3 { margin: 10px 0 7px; font-size: 16px; }
  .artifact-package-item p { margin: 0; color: var(--muted); line-height: 1.5; font-size: 12px; }
  .artifact-package-status { border: 1px solid var(--line); border-radius: 999px; padding: 6px 8px; font-size: 9px; color: var(--green); }

  @media (max-width: 1180px) {
    .artifact-summary-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
    .artifact-layout { grid-template-columns: 1fr; }
    .artifact-aside { position: static; grid-template-columns: repeat(3, minmax(0, 1fr)); }
    .artifact-gates { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .artifact-control-row { grid-template-columns: 60px 1fr 1fr; }
    .artifact-control-row span:nth-of-type(3), .artifact-control-result { grid-column: 2 / -1; justify-self: start; }
  }

  @media (max-width: 900px) {
    .artifact-hero-grid { grid-template-columns: 1fr; }
    .artifact-decision { border-left: 0; border-top: 1px solid var(--line); min-height: 310px; }
    .artifact-proof-grid,
    .artifact-evidence-grid,
    .artifact-repair-grid,
    .artifact-package-grid,
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

export default function ExecutionArtifact000002Page() {
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
    { id: "authority", label: "Authority drift" },
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
              <div className="artifact-kicker">Execution artifact 02 of 12 · canonical authority integrity proof</div>
              <h1>
                Authority drift
                <span>stopped execution.</span>
              </h1>
              <p className="artifact-lede">
                A controller possessed valid delegated authority when the payment route began.
                That authority was revoked before commitment. TA-14 preserved the change,
                invalidated dependent gates, committed HOLD, blocked transmission, and closed
                the outcome with zero funds released.
              </p>
              <div className="artifact-hero-meta">
                <span className="artifact-chip">{ARTIFACT_ID}</span>
                <span className="artifact-chip">Route {ROUTE_VERSION}</span>
                <span className="artifact-chip">Earliest failure: CONTINUITY</span>
                <span className="artifact-chip">Verification level: 6</span>
                <span className="artifact-chip">Controlled demonstration</span>
              </div>
            </div>

            <aside className="artifact-decision">
              <div>
                <div className="artifact-decision-label">Committed determination</div>
                <div className="artifact-decision-word">HOLD</div>
                <p>
                  Do not transmit. Preserve the request, restore valid authority, and rerun every
                  dependent gate before a new commit is considered.
                </p>
              </div>
              <div className="artifact-decision-grid">
                <div className="artifact-decision-cell">
                  <span>Control effect</span>
                  <strong>HTTP 423 · HELD</strong>
                </div>
                <div className="artifact-decision-cell">
                  <span>Funds released</span>
                  <strong>$0.00</strong>
                </div>
                <div className="artifact-decision-cell">
                  <span>Earliest break</span>
                  <strong>Gate 07</strong>
                </div>
                <div className="artifact-decision-cell">
                  <span>Repair path</span>
                  <strong>Authority + revalidation</strong>
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
                    <h3>Transmit $48,750 to one vendor beneficiary.</h3>
                    <p>
                      The route required current payment evidence, a frozen beneficiary destination,
                      valid CFO authority, valid controller authority, preserved continuity, and a
                      final pre-execution revalidation.
                    </p>
                  </article>
                  <article className="artifact-proof-card">
                    <div className="artifact-overline">Controlling condition</div>
                    <h3>Controller authority changed before commit.</h3>
                    <p>
                      The initial delegation was real but no longer current. The revocation event
                      occurred before the route fixed its determination, so the earlier approval could
                      not carry forward into execution.
                    </p>
                  </article>
                  <article className="artifact-proof-card positive">
                    <div className="artifact-overline">What this proves</div>
                    <h3>The architecture failed closed on authority drift.</h3>
                    <p>
                      TA-14 did not treat an earlier valid approval as permanent permission. It
                      preserved the changed authority state, reran dependent gates, committed HOLD,
                      and produced a technical non-release receipt.
                    </p>
                  </article>
                  <article className="artifact-proof-card boundary">
                    <div className="artifact-overline">What this does not prove</div>
                    <h3>No universal or production certification is claimed.</h3>
                    <p>
                      This controlled demonstration proves one bounded event through the TA-14
                      reference engine and adapter. It does not certify every organization, payment
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

            {view === "authority" ? (
              <Panel
                eyebrow="Authority integrity"
                title="The delegation was valid—until it was not."
                subtitle="The architecture preserves both states. It does not rewrite the earlier approval, and it does not allow that earlier approval to survive a later revocation."
              >
                <div className="artifact-authority-stage">
                  <div className="artifact-authority-ledger">
                    {authorityEvents.map((event) => (
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
                    <h3>Continuity</h3>
                    <p>
                      Actor identity remained known, but the authority state no longer matched the
                      state that supported initial approval. This break occurred before commit and
                      controlled every downstream consequence.
                    </p>
                    <div className="artifact-row"><span>Gate</span><strong>07 · Delegation continuity checked</strong></div>
                    <div className="artifact-row" style={{ marginTop: 10 }}><span>Reason</span><strong>AUTHORITY_STATE_CHANGED</strong></div>
                  </aside>
                </div>
                <div className="artifact-control-matrix">
                  {authorityControls.map((control) => (
                    <article className={`artifact-control-row ${control.result === "FAIL" ? "fail" : ""}`} key={control.id}>
                      <strong>{control.id}</strong>
                      <div><span>Control</span><strong>{control.control}</strong></div>
                      <div><span>Required state</span><strong>{control.requiredState}</strong></div>
                      <div><span>Observed state</span><strong>{control.observedState}</strong><span>{control.consequence}</span></div>
                      <div className="artifact-control-result">{control.result}</div>
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
                    <h3>Transmit $48,750</h3>
                    <p>
                      Beneficiary, amount, destination, authority chain, route version, and event
                      window were frozen before runtime evaluation.
                    </p>
                    <div className="artifact-receipt-grid">
                      <div className="artifact-row"><span>Adapter</span><strong>Reference Payment Adapter</strong></div>
                      <div className="artifact-row"><span>Route</span><strong>{ROUTE_ID}</strong></div>
                    </div>
                  </article>
                  <div className="artifact-effect-arrow">→</div>
                  <article className="artifact-effect-box held">
                    <div className="artifact-overline">Enforced result</div>
                    <h3>HELD · HTTP 423</h3>
                    <p>
                      The transmission endpoint remained closed. The request was retained in a
                      controlled queue with no alternate-path release and no backdated approval.
                    </p>
                    <div className="artifact-receipt-grid">
                      <div className="artifact-row"><span>Receipt</span><strong>EA-000002-EX-01</strong></div>
                      <div className="artifact-row"><span>Released</span><strong>$0.00</strong></div>
                      <div className="artifact-row"><span>Bypass</span><strong>NONE DETECTED</strong></div>
                      <div className="artifact-row"><span>Queue</span><strong>HOLD_PRESERVED</strong></div>
                    </div>
                  </article>
                </div>
              </Panel>
            ) : null}

            {view === "outcome" ? (
              <Panel
                eyebrow="Outcome closure"
                title="The no-transfer state was observed and preserved."
                subtitle="A HOLD artifact does not claim successful execution. It proves that the invalid action did not bind to reality and that a bounded repair path remains available."
              >
                <div className="artifact-timeline">
                  <article className="artifact-event"><time>19:12:00 UTC</time><strong>Scenario intake sealed</strong><p>The exact payment, beneficiary, consequence, and declared limits entered the frozen record.</p></article>
                  <article className="artifact-event"><time>19:12:11 UTC</time><strong>Initial authority resolved</strong><p>CFO and controller authority were attributable and initially in scope.</p></article>
                  <article className="artifact-event"><time>19:15:41 UTC</time><strong>Controller delegation revoked</strong><p>The authority resolver recorded the changed state before commit.</p></article>
                  <article className="artifact-event"><time>19:15:43 UTC</time><strong>Dependent gates rerun</strong><p>Continuity, admissibility, binding, and commit logic were re-evaluated.</p></article>
                  <article className="artifact-event"><time>19:16:02 UTC</time><strong>HOLD committed</strong><p>The no-release state and repair requirement were fixed before adapter invocation.</p></article>
                  <article className="artifact-event"><time>19:16:03 UTC</time><strong>Transmission blocked</strong><p>Receipt EA-000002-EX-01 recorded HTTP 423 and zero funds released.</p></article>
                  <article className="artifact-event"><time>19:17:20 UTC</time><strong>Outcome closed</strong><p>Beneficiary state remained unchanged and the request remained in HOLD_PRESERVED.</p></article>
                  <article className="artifact-event"><time>19:18:10 UTC</time><strong>Package parity verified</strong><p>The public page, JSON, manifest, receipt, and outcome record resolved to one bounded event.</p></article>
                </div>
                <div className="artifact-repair-grid">
                  {repairSteps.map((step) => (
                    <article className="artifact-repair-card" key={step.sequence}>
                      <div className="artifact-repair-number">{step.sequence}</div>
                      <h3>{step.title}</h3>
                      <p><strong>Owner:</strong> {step.owner}</p>
                      <p><strong>Required evidence:</strong> {step.requiredEvidence}</p>
                      <p><strong>Completion rule:</strong> {step.completionRule}</p>
                    </article>
                  ))}
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
                <div className="artifact-package-grid">
                  {packageComponents.map((component) => (
                    <article className="artifact-package-item" key={component.id}>
                      <div className="artifact-package-top">
                        <span className="artifact-evidence-id">{component.id} · {component.format}</span>
                        <span className="artifact-package-status">{component.status}</span>
                      </div>
                      <h3>{component.name}</h3>
                      <p>{component.purpose}</p>
                    </article>
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
                subtitle="A challenge may dispute evidence, authority interpretation, route logic, technical effect, outcome closure, integrity, or the public claim. It may not silently rewrite the original event."
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
                <div className="artifact-side-row"><span>Determination</span><strong>HOLD</strong></div>
                <div className="artifact-side-row"><span>Earliest failure</span><strong>CONTINUITY</strong></div>
                <div className="artifact-side-row"><span>Route</span><strong>{ROUTE_ID}</strong></div>
                <div className="artifact-side-row"><span>Route version</span><strong>{ROUTE_VERSION}</strong></div>
                <div className="artifact-side-row"><span>Status</span><strong>PUBLISHED DEMONSTRATION</strong></div>
              </div>
            </section>

            <section className="artifact-side-card">
              <div className="artifact-overline">Repair condition</div>
              <h3>Authority must be restored.</h3>
              <p>
                Resolve a currently valid controller authority source, preserve the new state,
                rerun every dependent gate, and generate a new commit. The original HOLD remains
                immutable.
              </p>
              <button className="artifact-button" type="button" onClick={() => selectView("authority")}>Inspect authority drift</button>
            </section>

            <section className="artifact-side-card">
              <div className="artifact-overline">Download package</div>
              <h3>Inspect offline.</h3>
              <p>Download public representations generated from this bounded demonstration record.</p>
              <div className="artifact-downloads">
                <button className="artifact-download" type="button" onClick={() => downloadText(`${ARTIFACT_ID}.json`, packageRecord)}>Canonical JSON <span>↓</span></button>
                <button className="artifact-download" type="button" onClick={() => downloadText(`${ARTIFACT_ID}-integrity-manifest.json`, integrityManifest)}>Integrity manifest <span>↓</span></button>
                <button className="artifact-download" type="button" onClick={() => downloadText(`${ARTIFACT_ID}-execution-receipt.json`, packageRecord.execution)}>Execution receipt <span>↓</span></button>
                <button className="artifact-download" type="button" onClick={() => downloadText(`${ARTIFACT_ID}-authority-ledger.json`, authorityEvents)}>Authority ledger <span>↓</span></button>
                <button className="artifact-download" type="button" onClick={() => downloadText(`${ARTIFACT_ID}-verification.txt`, `Artifact: ${ARTIFACT_ID}\nExpected result: VERIFIED\nMaximum public level: 6\nRecord hash: ${RECORD_HASH}\nPackage hash: ${PACKAGE_HASH}\n`)}>Verification guide <span>↓</span></button>
              </div>
            </section>

            <section className="artifact-side-card artifact-boundary">
              <div className="artifact-overline">Claims boundary</div>
              <h3>Controlled demonstration.</h3>
              <p>
                This artifact proves one reference-engine event in which authority drift produced
                a technical hold and a preserved no-transfer outcome. It does not claim external
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
