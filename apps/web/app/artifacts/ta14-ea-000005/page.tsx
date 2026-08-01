"use client";

import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";

type View =
  | "inspection"
  | "chain"
  | "runtime"
  | "evidence"
  | "evidence"
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

type EvidenceEvent = {
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

type FreshnessControl = {
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

const ARTIFACT_ID = "TA14-EA-000005";
const ARTIFACT_TITLE = "Evidence Freshness Expired Before Commit";
const ROUTE_ID = "TA14-ROUTE-EVIDENCE-FRESHNESS-HOLD-005";
const ROUTE_VERSION = "2.0.0";
const RECORD_HASH = "sha256:ab9612f3e6c1fd0a4c61ce01af12b4287d551cf218c85d310d9faed60fa27a05";
const PACKAGE_HASH = "sha256:2ff3a8a01de880d2df0c8f33d2ee1bf951476ddb41b61f81562046f57ab0cf66";
const RECEIPT_HASH = "sha256:f91c9d7d6d55985e845fb0f8c24fd961a11ef1fd781fb9330c0d8bf31c856605";

const chain: ChainItem[] = [
  {
    number: "01",
    link: "Reality",
    result: "PASS",
    question: "What condition existed before interpretation?",
    finding: "A release request existed for pharmaceutical batch RX-24-0719 inside the TA-14 controlled demonstration environment.",
    proof: "The proposed action, batch identity, lot, distribution destination, consequence, and declared boundary were preserved before evaluation.",
  },
  {
    number: "02",
    link: "Record",
    result: "PASS",
    question: "What attributable representation was preserved?",
    finding: "The sterility assay, batch identity, sampling record, chain of custody, route snapshot, and quality-release authority were captured.",
    proof: "Every input received a stable identifier, capture time, source attribution, disclosure state, and integrity commitment.",
  },
  {
    number: "03",
    link: "Continuity",
    result: "PASS",
    question: "Did identity, provenance, time, custody, and version remain connected?",
    finding: "The laboratory identity, sampling event, assay result, custody trail, route version, and batch identity remained continuously linked.",
    proof: "No source substitution, custody break, version change, or identity discontinuity occurred before commit.",
  },
  {
    number: "04",
    link: "Admissibility",
    result: "FAIL",
    question: "May the material support this exact consequence now?",
    finding: "The evidence package was attributable and intact, but the sterility assay expired before commit and could no longer support release.",
    proof: "The admissibility evaluator rejects reliance on evidence outside the route-defined validity window.",
  },
  {
    number: "05",
    link: "Binding",
    result: "FAIL",
    question: "What rule validly governs the consequence?",
    finding: "The frozen route requires a current sterility assay at commit. The freshness condition failed.",
    proof: "The binding record applies the fail-closed rule and prevents downstream permission from curing the earlier break.",
  },
  {
    number: "06",
    link: "Commit",
    result: "PASS",
    question: "What determination was fixed before action?",
    finding: "HOLD was committed before the adapter could release the batch.",
    proof: "The commit record preserves the reason codes, earliest failure, repair condition, and permitted next action.",
  },
  {
    number: "07",
    link: "Execution",
    result: "PASS",
    question: "Did the determination control the action path?",
    finding: "The batch release adapter refused release and retained the request in a non-releasable queue.",
    proof: "Receipt EA-000005-EX-01 records HTTP 423, zero batches released, no bypass, and no alternate-path release.",
  },
  {
    number: "08",
    link: "Outcome",
    result: "PASS",
    question: "What bound to reality, and what did not?",
    finding: "No batch release authorization was issued. The request remained preserved for fresh evidence and revalidation.",
    proof: "Outcome closure confirms unchanged distribution state, held queue state, and residual risk limited to delayed release.",
  },
];

const gates: GateItem[] = [
  {
    number: "01",
    title: "Observed condition registered",
    chainLink: "REALITY",
    result: "PASS",
    reasonCode: "BATCH_RELEASE_REQUEST_PRESENT",
    summary: "The proposed action and consequence are exact enough to govern.",
  },
  {
    number: "02",
    title: "Affected subjects identified",
    chainLink: "REALITY",
    result: "PASS",
    reasonCode: "SUBJECTS_IDENTIFIED",
    summary: "Organization, distribution target, adapter, and reviewers are attributable.",
  },
  {
    number: "03",
    title: "Source record captured",
    chainLink: "RECORD",
    result: "PASS",
    reasonCode: "SOURCE_CAPTURED",
    summary: "Assay report and request were preserved before reliance.",
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
    title: "Laboratory source identity resolved",
    chainLink: "CONTINUITY",
    result: "PASS",
    reasonCode: "IDENTITY_RESOLVED",
    summary: "The testing laboratory, quality reviewer, and release steward identities were resolved.",
  },
  {
    number: "06",
    title: "Evidence provenance linked",
    chainLink: "CONTINUITY",
    result: "PASS",
    reasonCode: "EVIDENCE_PROVENANCE_LINKED",
    summary: "The assay validity policy was linked to the evidence record.",
  },
  {
    number: "07",
    title: "Custody continuity checked",
    chainLink: "CONTINUITY",
    result: "PASS",
    reasonCode: "CUSTODY_CONTINUOUS",
    summary: "The sample, assay, reviewer, and batch remained continuously linked.",
  },
  {
    number: "08",
    title: "Route version continuous",
    chainLink: "CONTINUITY",
    result: "PASS",
    reasonCode: "ROUTE_VERSION_CONTINUOUS",
    summary: "Route version 2.0.0 remained unchanged.",
  },
  {
    number: "09",
    title: "Evidence relevance tested",
    chainLink: "ADMISSIBILITY",
    result: "PASS",
    reasonCode: "EVIDENCE_RELEVANT",
    summary: "The assay, batch, sampling, and chain-of-custody records bear directly on batch release.",
  },
  {
    number: "10",
    title: "Evidence freshness tested",
    chainLink: "ADMISSIBILITY",
    result: "FAIL",
    reasonCode: "EVIDENCE_EXPIRED",
    summary: "The assay exceeded the configured validity window before the commit timestamp.",
  },
  {
    number: "11",
    title: "Evidence sufficiency tested",
    chainLink: "ADMISSIBILITY",
    result: "PASS",
    reasonCode: "EVIDENCE_STRUCTURALLY_COMPLETE",
    summary: "The package contained all required records, but completeness could not cure expired freshness.",
  },
  {
    number: "12",
    title: "Evidence admissibility tested",
    chainLink: "ADMISSIBILITY",
    result: "FAIL",
    reasonCode: "EVIDENCE_OUTSIDE_VALIDITY_WINDOW",
    summary: "Expired evidence cannot support the present batch-release consequence.",
  },
  {
    number: "13",
    title: "Evidence validity rule applied",
    chainLink: "BINDING",
    result: "FAIL",
    reasonCode: "FRESHNESS_REQUIREMENT_UNSATISFIED",
    summary: "The route requires a current sterility assay at the exact commit time.",
  },
  {
    number: "14",
    title: "Batch identity boundary applied",
    chainLink: "BINDING",
    result: "PASS",
    reasonCode: "BATCH_IDENTITY_WITHIN_SCOPE",
    summary: "The proposed release remained limited to the identified batch and lot.",
  },
  {
    number: "15",
    title: "Distribution destination boundary applied",
    chainLink: "BINDING",
    result: "PASS",
    reasonCode: "DESTINATION_AUTHORIZED",
    summary: "The distribution destination matched the frozen release request.",
  },
  {
    number: "16",
    title: "Quality-release separation applied",
    chainLink: "BINDING",
    result: "PASS",
    reasonCode: "DUTIES_SEPARATED",
    summary: "Laboratory, quality reviewer, release steward, and runtime operator remained separate.",
  },
  {
    number: "17",
    title: "Earliest failure fixed",
    chainLink: "COMMIT",
    result: "PASS",
    reasonCode: "EARLIEST_FAILURE_ADMISSIBILITY",
    summary: "Admissibility was fixed as the controlling break.",
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
    reasonCode: "REFRESH_EVIDENCE_AND_REVALIDATE",
    summary: "Only fresh evidence capture and dependent-gate rerun are permitted.",
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
    title: "Release blocked",
    chainLink: "EXECUTION",
    result: "PASS",
    reasonCode: "HTTP_423_HELD",
    summary: "The batch-release endpoint returned HELD.",
  },
  {
    number: "22",
    title: "Bypass resistance checked",
    chainLink: "EXECUTION",
    result: "PASS",
    reasonCode: "NO_BYPASS",
    summary: "No alternate path or retry released the batch.",
  },
  {
    number: "23",
    title: "Outcome observed",
    chainLink: "OUTCOME",
    result: "PASS",
    reasonCode: "ZERO_RELEASE_CONFIRMED",
    summary: "No batch-release authorization entered the distribution state.",
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
    id: "EA-000005-EV-01",
    title: "Critical batch release request",
    source: "TA-14 Scenario Author",
    type: "DECLARATION",
    disclosure: "PUBLIC",
    status: "ADMITTED",
    capturedAt: "2026-07-31 19:12:00 UTC",
    hash: "1aa79af3...d4c2",
    supports: "Exact batch, lot, assay, distribution destination, and release boundary.",
    limitation: "Controlled demonstration record; no manufactured product entered distribution.",
  },
  {
    id: "EA-000005-EV-02",
    title: "Frozen evidence-freshness route",
    source: "TA-14 Route Resolver",
    type: "SYSTEM_RECORD",
    disclosure: "PUBLIC",
    status: "ADMITTED",
    capturedAt: "2026-07-31 19:12:07 UTC",
    hash: "8f7e21c9...a985",
    supports: "Route version, freshness rule, gate order, validity window, and revalidation triggers.",
    limitation: "Valid only for route version 2.0.0 and this bounded event.",
  },
  {
    id: "EA-000005-EV-03",
    title: "Sterility assay and batch package",
    source: "TA-14 Evidence Custodian",
    type: "LABORATORY_RECORD",
    disclosure: "SELECTIVE",
    status: "ADMITTED",
    capturedAt: "2026-07-31 19:12:10 UTC",
    hash: "bf90e123...93d1",
    supports: "Batch identity, sampling event, assay result, quality status, and proposed release state.",
    limitation: "Does not independently authorize release after its validity window expires.",
  },
  {
    id: "EA-000005-EV-04",
    title: "Sterility assay certificate",
    source: "TA-14 Evidence Validator",
    type: "LABORATORY_CERTIFICATE",
    disclosure: "SELECTIVE",
    status: "CONDITIONAL",
    capturedAt: "2026-07-31 19:12:11 UTC",
    hash: "6cf0c40a...6721",
    supports: "Laboratory identity, assay method, capture time, result, and original validity window.",
    limitation: "Expired before commit under the frozen route validity rule.",
  },
  {
    id: "EA-000005-EV-05",
    title: "Evidence expiration event",
    source: "TA-14 Evidence Validator",
    type: "EVIDENCE_STATE_EVENT",
    disclosure: "SELECTIVE",
    status: "ADMITTED",
    capturedAt: "2026-07-31 19:15:41 UTC",
    hash: "e02c9097...4cb8",
    supports: "The required assay crossed its validity boundary before execution commitment.",
    limitation: "Proves the bounded validity-state change, not universal assay reliability.",
  },
  {
    id: "EA-000005-EV-06",
    title: "Admissibility revalidation ledger",
    source: "TA-14 Admissibility Validator",
    type: "SYSTEM_RECORD",
    disclosure: "PUBLIC",
    status: "ADMITTED",
    capturedAt: "2026-07-31 19:15:43 UTC",
    hash: "5a10cb73...e776",
    supports: "The evidence validity state changed and dependent gates required rerun.",
    limitation: "Bounded to the disclosed route inputs and event window.",
  },
  {
    id: "EA-000005-EV-07",
    title: "Held-release execution receipt",
    source: "TA-14 Reference Batch-Release Adapter",
    type: "EXECUTION_RECEIPT",
    disclosure: "PUBLIC",
    status: "ADMITTED",
    capturedAt: "2026-07-31 19:16:03 UTC",
    hash: "58a1b51e...e52f",
    supports: "The committed HOLD prevented release and retained the request for fresh evidence.",
    limitation: "Proves control of the reference adapter, not every external manufacturing or distribution system.",
  },
  {
    id: "EA-000005-EV-08",
    title: "No-release outcome closure",
    source: "TA-14 Outcome Verifier",
    type: "OUTCOME_EVIDENCE",
    disclosure: "PUBLIC",
    status: "ADMITTED",
    capturedAt: "2026-07-31 19:17:20 UTC",
    hash: "bd21dd3a...79e4",
    supports: "No batch was released and the request remained preserved.",
    limitation: "Outcome verification is bounded to the observed adapter, queue, and event window.",
  },
];

const evidenceEvents: EvidenceEvent[] = [
  {
    time: "19:12:11",
    event: "EVIDENCE VALIDITY RESOLVED",
    detail: "The sterility assay was valid through 19:15:00 UTC for the identified batch.",
    state: "VALID",
  },
  {
    time: "19:13:02",
    event: "QUALITY AUTHORITY PRESERVED",
    detail: "Quality-release authority was attributable, in scope, and current.",
    state: "VALID",
  },
  {
    time: "19:15:41",
    event: "ASSAY VALIDITY EXPIRED",
    detail: "The evidence validator recorded expiration before commit.",
    state: "CHANGED",
  },
  {
    time: "19:15:43",
    event: "DEPENDENT GATES INVALIDATED",
    detail: "Freshness, admissibility, binding, and commit gates were rerun.",
    state: "REVALIDATE",
  },
  {
    time: "19:16:02",
    event: "HOLD COMMITTED",
    detail: "The route fixed HOLD and blocked execution pending evidence refresh.",
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
    detail: "Disclosed inputs reproduce HOLD after the evidence expiration event.",
  },
  {
    level: "L5",
    label: "Execution effect",
    detail: "The adapter receipt proves HELD, HTTP 423, zero release, and no bypass.",
  },
  {
    level: "L6",
    label: "Outcome closure",
    detail: "Queue and distribution state support the reported no-release outcome.",
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
    condition: "The expiration was appended; the earlier approval was not silently overwritten.",
  },
  {
    id: "AT-03",
    result: "PASS",
    condition: "HOLD produced the required non-release execution effect.",
  },
  {
    id: "AT-04",
    result: "PASS",
    condition: "The failed admissibility gate could not be skipped to reach ALLOW.",
  },
  {
    id: "AT-05",
    result: "PASS",
    condition: "The evidence expiry triggered immediate dependent-gate revalidation.",
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
    condition: "Selective evidence details remain bounded while public commitments remain visible.",
  },
  {
    id: "AT-10",
    result: "PASS",
    condition: "The artifact states what it proves and what it does not prove.",
  },
];

const freshnessControls: FreshnessControl[] = [
  {
    id: "AC-01",
    control: "Release steward identity",
    requiredState: "Resolved and attributable",
    observedState: "Quality-release steward identity verified against the institutional directory",
    result: "PASS",
    consequence: "The request remained attributable to a known release steward.",
  },
  {
    id: "AC-02",
    control: "Quality-release authority",
    requiredState: "Active at commit",
    observedState: "Active throughout intake, evaluation, and commit",
    result: "PASS",
    consequence: "The required release authority remained valid.",
  },
  {
    id: "AC-03",
    control: "Testing laboratory identity",
    requiredState: "Resolved and attributable",
    observedState: "Testing laboratory identity remained known after expiration",
    result: "PASS",
    consequence: "Identity continuity survived even though evidence freshness did not.",
  },
  {
    id: "AC-04",
    control: "Assay validity window",
    requiredState: "Active at commit",
    observedState: "Expired at 19:15:00 UTC before commit",
    result: "FAIL",
    consequence: "The route lost one mandatory freshness condition.",
  },
  {
    id: "AC-05",
    control: "Batch and method scope",
    requiredState: "The identified batch and lot only",
    observedState: "The assay matched batch RX-24-0719, lot 07A, and the declared method",
    result: "PASS",
    consequence: "Scope was not the controlling failure; freshness was.",
  },
  {
    id: "AC-06",
    control: "Validity-rule source",
    requiredState: "Linked to the frozen route and laboratory method policy",
    observedState: "Source record EV-FRESH-2026-044 preserved",
    result: "PASS",
    consequence: "The original certificate, validity window, and expiration event are reconstructable.",
  },
  {
    id: "AC-07",
    control: "Expiration visibility",
    requiredState: "Visible before determination",
    observedState: "Evidence event stream delivered expiration before commit",
    result: "PASS",
    consequence: "The route had an opportunity and obligation to fail closed.",
  },
  {
    id: "AC-08",
    control: "Freshness-at-commit rule",
    requiredState: "Current assay plus valid quality-release authority",
    observedState: "Quality authority active; assay expired",
    result: "FAIL",
    consequence: "Mandatory freshness condition was not satisfied.",
  },
  {
    id: "AC-09",
    control: "Separation of duties",
    requiredState: "Initiator cannot replace missing approver",
    observedState: "No substitution or self-approval permitted",
    result: "PASS",
    consequence: "The architecture preserved separation between laboratory testing, quality approval, and runtime execution.",
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
    consequence: "The adapter could not release the batch despite the preserved request.",
  },
  {
    id: "AC-12",
    control: "Revalidation requirement",
    requiredState: "All dependent gates rerun after repair",
    observedState: "Repair pending; no revalidation completed",
    result: "FAIL",
    consequence: "The route remains held until fresh evidence survives review and revalidation.",
  },
];

const repairSteps: RepairStep[] = [
  {
    sequence: "01",
    title: "Capture a new sterility assay",
    owner: "Accredited testing laboratory",
    requiredEvidence: "New assay certificate with batch, lot, sample, method, result, capture time, validity window, and integrity commitment",
    completionRule: "The assay must be current for this exact batch, method, and release route.",
  },
  {
    sequence: "02",
    title: "Preserve the repaired evidence validity state",
    owner: "Evidence validator",
    requiredEvidence: "New assay snapshot linked to the original held request without overwriting the original event",
    completionRule: "The repaired state must receive a new stable identifier and timestamp.",
  },
  {
    sequence: "03",
    title: "Recheck identity and scope",
    owner: "Route operator",
    requiredEvidence: "Laboratory identity, method, batch, sample, and validity-window comparison",
    completionRule: "Laboratory, quality authority, release steward, and runtime operator must remain distinct and attributable.",
  },
  {
    sequence: "04",
    title: "Revalidate the complete release evidence package",
    owner: "Evidence custodian",
    requiredEvidence: "Fresh assay, batch identity, custody, quality, and destination records",
    completionRule: "No material batch, sample, method, authority, custody, or destination condition may drift while the request is held.",
  },
  {
    sequence: "05",
    title: "Rerun dependent admissibility gates",
    owner: "TA-14 runtime",
    requiredEvidence: "New continuity and freshness ledger covering identity, provenance, custody, route, destination, and time",
    completionRule: "Every mandatory continuity and freshness condition must pass in the repaired state.",
  },
  {
    sequence: "06",
    title: "Rerun admissibility and binding gates",
    owner: "TA-14 runtime",
    requiredEvidence: "New admissibility and binding records referencing the repaired evidence snapshot",
    completionRule: "The route must establish current evidence and the freshness obligation.",
  },
  {
    sequence: "07",
    title: "Create a new determination commit",
    owner: "Authorized runtime operator",
    requiredEvidence: "New commit record with route version, admitted evidence snapshot, authority state, and reason codes",
    completionRule: "The new commit may not alter, replace, or backdate the original HOLD.",
  },
  {
    sequence: "08",
    title: "Invoke the adapter only from the new commit",
    owner: "Reference batch-release adapter",
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
  { id: "PKG-07", name: "Evidence validity ledger", format: "JSON", status: "AVAILABLE", purpose: "Original validity window, expiration event, current state, and refresh boundary." },
  { id: "PKG-08", name: "Admissibility record", format: "JSON", status: "AVAILABLE", purpose: "Identity, provenance, custody, route, time, and state-change continuity findings." },
  { id: "PKG-09", name: "Admissibility record", format: "JSON", status: "AVAILABLE", purpose: "Item-by-item reliance findings for evidence and quality authority." },
  { id: "PKG-10", name: "Binding record", format: "JSON", status: "AVAILABLE", purpose: "Freshness-at-commit rule, batch boundary, destination, and fail-closed obligation." },
  { id: "PKG-11", name: "Gate ledger", format: "JSON", status: "AVAILABLE", purpose: "All twenty-four runtime results and earliest-failure finding." },
  { id: "PKG-12", name: "Commit record", format: "JSON", status: "AVAILABLE", purpose: "Immutable HOLD determination, reason codes, and permitted next action." },
  { id: "PKG-13", name: "Execution receipt", format: "JSON", status: "AVAILABLE", purpose: "HTTP 423 refusal, held queue state, zero release, and bypass result." },
  { id: "PKG-14", name: "Outcome closure", format: "JSON", status: "AVAILABLE", purpose: "Observed no-release result, residual risk, and follow-up requirement." },
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
      "Release one critical pharmaceutical batch only if the required sterility evidence remains valid through commit.",
    batch: "RX-24-0719",
    lot: "07A",
    consequenceAtStake:
      "A manufactured batch may enter distribution only while required release evidence remains current and admissible.",
    affectedSubjects: [
      "TA-14 controlled demonstration environment",
      "identified pharmaceutical batch",
      "reference batch-release adapter",
      "authorized laboratory and quality reviewers",
    ],
    declaredLimits: [
      "No manufactured product or production distribution system is affected.",
      "The record proves one bounded event only.",
      "The record does not certify every future route, adapter, or execution.",
    ],
  },
  route: {
    routeId: ROUTE_ID,
    routeVersion: ROUTE_VERSION,
    gateCount: 24,
    earliestFailure: "ADMISSIBILITY",
    earliestFailureGate: "10",
    reasonCodes: [
      "EVIDENCE_FRESHNESS_EXPIRED",
      "EVIDENCE_OUTSIDE_VALIDITY_WINDOW",
      "FRESHNESS_REQUIREMENT_UNSATISFIED",
    ],
    requiredRepair: [
      "Capture and admit a new current sterility assay.",
      "Preserve the new assay certificate, validity window, and effective time.",
      "Rerun continuity, freshness, admissibility, binding, and commit gates.",
      "Generate a new commit and execution receipt; do not amend the original event into ALLOW.",
    ],
  },
  commit: {
    determination: "HOLD",
    committedAt: "2026-07-31T19:16:02Z",
    permittedNextAction: "REFRESH_EVIDENCE_AND_REVALIDATE",
    prohibitedAction: "BATCH_DISTRIBUTION_RELEASE",
  },
  execution: {
    adapter: "TA-14 Reference Batch-Release Adapter",
    adapterVersion: "1.0.0",
    command: "HOLD_RELEASE",
    technicalStatus: 423,
    receiptId: "EA-000005-EX-01",
    receiptHash: RECEIPT_HASH,
    batchesReleased: 0,
    bypassDetected: false,
  },
  outcome: {
    state: "RELEASE_HOLD_PRESERVED",
    distributionStateChanged: false,
    batchReleased: false,
    residualRisk: "Release delay until current sterility evidence is captured, admitted, and the route is revalidated.",
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
  evidenceEvents,
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
    evidenceLedger: "sha256:e02c9097...4cb8",
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

  .artifact-evidence-stage { display: grid; grid-template-columns: minmax(0, 1fr) 300px; gap: 18px; }
  .artifact-evidence-ledger { display: grid; gap: 12px; }
  .artifact-evidence-event { display: grid; grid-template-columns: 82px minmax(0, 1fr) 94px; gap: 14px; padding: 17px; border: 1px solid var(--line); border-radius: 15px; background: rgba(255,255,255,.016); }
  .artifact-evidence-event.changed { border-color: rgba(255,123,143,.28); }
  .artifact-evidence-event time { color: var(--cyan); font-variant-numeric: tabular-nums; }
  .artifact-evidence-event strong { display: block; }
  .artifact-evidence-event p { margin: 6px 0 0; color: var(--muted); line-height: 1.5; }
  .artifact-evidence-state { justify-self: end; align-self: start; border: 1px solid var(--line); border-radius: 999px; padding: 7px 9px; font-size: 10px; }
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
    .artifact-evidence-stage,
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
    .artifact-evidence-event { grid-template-columns: 70px minmax(0, 1fr); }
    .artifact-evidence-state { grid-column: 2; justify-self: start; }
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
  URL.expireObjectURL(url);
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
    { id: "evidence", label: "Evidence expiry" },
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
            <Link className="artifact-link" href="/artifacts/ta14-ea-000004">← Artifact 000004</Link>
            <Link className="artifact-link" href="/artifacts">Artifact library</Link>
            <Link className="artifact-link" href="/workspace/artifacts/build">Build an artifact</Link>
          </div>
        </header>

        <section className="artifact-hero">
          <div className="artifact-hero-grid">
            <div className="artifact-hero-copy">
              <div className="artifact-kicker">Execution artifact 02 of 12 · canonical evidence integrity proof</div>
              <h1>
                Evidence expiry
                <span>stopped execution.</span>
              </h1>
              <p className="artifact-lede">
                A sterility assay was current when the batch-release route began.
                That evidence expired before commitment. TA-14 preserved the state change,
                invalidated dependent gates, committed HOLD, blocked release, and closed
                the outcome with zero product released.
              </p>
              <div className="artifact-hero-meta">
                <span className="artifact-chip">{ARTIFACT_ID}</span>
                <span className="artifact-chip">Route {ROUTE_VERSION}</span>
                <span className="artifact-chip">Earliest failure: ADMISSIBILITY</span>
                <span className="artifact-chip">Verification level: 6</span>
                <span className="artifact-chip">Controlled demonstration</span>
              </div>
            </div>

            <aside className="artifact-decision">
              <div>
                <div className="artifact-decision-label">Committed determination</div>
                <div className="artifact-decision-word">HOLD</div>
                <p>
                  Do not release. Preserve the request, capture current evidence, and rerun every
                  dependent gate before a new commit is considered.
                </p>
              </div>
              <div className="artifact-decision-grid">
                <div className="artifact-decision-cell">
                  <span>Control effect</span>
                  <strong>HTTP 423 · HELD</strong>
                </div>
                <div className="artifact-decision-cell">
                  <span>Batches released</span>
                  <strong>$0.00</strong>
                </div>
                <div className="artifact-decision-cell">
                  <span>Earliest break</span>
                  <strong>Gate 07</strong>
                </div>
                <div className="artifact-decision-cell">
                  <span>Repair path</span>
                  <strong>Evidence + revalidation</strong>
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
                    <h3>Release pharmaceutical batch RX-24-0719, lot 07A, to the frozen distribution destination.</h3>
                    <p>
                      The route required a current sterility assay, frozen batch and destination identity,
                      valid quality-release authority, preserved continuity, and a
                      final pre-execution revalidation.
                    </p>
                  </article>
                  <article className="artifact-proof-card">
                    <div className="artifact-overline">Controlling condition</div>
                    <h3>Assay evidence expiryd before commit.</h3>
                    <p>
                      The initial assay was valid when captured but no longer current at commit. The expiration event
                      occurred before the route fixed its determination, so the earlier approval could
                      not carry forward into execution.
                    </p>
                  </article>
                  <article className="artifact-proof-card positive">
                    <div className="artifact-overline">What this proves</div>
                    <h3>The architecture failed closed on expired evidence.</h3>
                    <p>
                      TA-14 did not treat an earlier valid approval as permanent permission. It
                      preserved the changed evidence validity state, reran dependent gates, committed HOLD,
                      and produced a technical non-release receipt.
                    </p>
                  </article>
                  <article className="artifact-proof-card boundary">
                    <div className="artifact-overline">What this does not prove</div>
                    <h3>No universal or production certification is claimed.</h3>
                    <p>
                      This controlled demonstration proves one bounded event through the TA-14
                      reference engine and adapter. It does not certify every laboratory, manufacturer, batch-release
                      rail, evidence system, or future execution.
                    </p>
                  </article>
                </div>
              </Panel>
            ) : null}

            {view === "chain" ? (
              <Panel
                eyebrow="Canonical chain"
                title="The earliest unsupported link controlled the route."
                subtitle="Later success cannot repair an earlier admissibility failure. Each anchor remains visible even when the path stops."
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

            {view === "evidence" ? (
              <Panel
                eyebrow="Evidence integrity"
                title="The evidence was valid—until its freshness window closed."
                subtitle="The architecture preserves both states. It does not rewrite the earlier approval, and it does not allow that earlier approval to survive a later expiration."
              >
                <div className="artifact-evidence-stage">
                  <div className="artifact-evidence-ledger">
                    {evidenceEvents.map((event) => (
                      <article
                        className={`artifact-evidence-event ${event.state === "CHANGED" ? "changed" : ""}`}
                        key={`${event.time}-${event.event}`}
                      >
                        <time>{event.time}</time>
                        <div>
                          <strong>{event.event}</strong>
                          <p>{event.detail}</p>
                        </div>
                        <span className="artifact-evidence-state">{event.state}</span>
                      </article>
                    ))}
                  </div>
                  <aside className="artifact-break-card">
                    <div className="artifact-overline">Earliest failure</div>
                    <h3>Admissibility</h3>
                    <p>
                      Actor identity remained known, but the evidence validity state no longer matched the
                      state that supported initial approval. This break occurred before commit and
                      controlled every downstream consequence.
                    </p>
                    <div className="artifact-row"><span>Gate</span><strong>10 · Evidence freshness tested</strong></div>
                    <div className="artifact-row" style={{ marginTop: 10 }}><span>Reason</span><strong>EVIDENCE_FRESHNESS_EXPIRED</strong></div>
                  </aside>
                </div>
                <div className="artifact-control-matrix">
                  {freshnessControls.map((control) => (
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
                subtitle="This is the difference between governance and description. The reference adapter received a control command, refused release, and generated a technical receipt."
              >
                <div className="artifact-effect">
                  <article className="artifact-effect-box">
                    <div className="artifact-overline">Attempted action</div>
                    <h3>Release batch RX-24-0719</h3>
                    <p>
                      Batch, lot, sample, method, destination, evidence chain, route version, and event
                      window were frozen before runtime evaluation.
                    </p>
                    <div className="artifact-receipt-grid">
                      <div className="artifact-row"><span>Adapter</span><strong>Reference Batch release Adapter</strong></div>
                      <div className="artifact-row"><span>Route</span><strong>{ROUTE_ID}</strong></div>
                    </div>
                  </article>
                  <div className="artifact-effect-arrow">→</div>
                  <article className="artifact-effect-box held">
                    <div className="artifact-overline">Enforced result</div>
                    <h3>HELD · HTTP 423</h3>
                    <p>
                      The release endpoint remained closed. The request was retained in a
                      controlled queue with no alternate-path release and no backdated approval.
                    </p>
                    <div className="artifact-receipt-grid">
                      <div className="artifact-row"><span>Receipt</span><strong>EA-000005-EX-01</strong></div>
                      <div className="artifact-row"><span>Released</span><strong>$0.00</strong></div>
                      <div className="artifact-row"><span>Bypass</span><strong>NONE DETECTED</strong></div>
                      <div className="artifact-row"><span>Queue</span><strong>RELEASE_HOLD_PRESERVED</strong></div>
                    </div>
                  </article>
                </div>
              </Panel>
            ) : null}

            {view === "outcome" ? (
              <Panel
                eyebrow="Outcome closure"
                title="The no-release state was observed and preserved."
                subtitle="A HOLD artifact does not claim successful execution. It proves that the invalid action did not bind to reality and that a bounded repair path remains available."
              >
                <div className="artifact-timeline">
                  <article className="artifact-event"><time>19:12:00 UTC</time><strong>Scenario intake sealed</strong><p>The exact batch, lot, proposed release, destination, consequence, and declared limits entered the frozen record.</p></article>
                  <article className="artifact-event"><time>19:12:11 UTC</time><strong>Initial evidence admitted</strong><p>The sterility assay and quality-release authority were attributable and initially in scope.</p></article>
                  <article className="artifact-event"><time>19:15:00 UTC</time><strong>Assay validity window expired</strong><p>The evidence validator recorded the changed state before commit.</p></article>
                  <article className="artifact-event"><time>19:15:43 UTC</time><strong>Dependent gates rerun</strong><p>Freshness, admissibility, binding, and commit logic were re-evaluated.</p></article>
                  <article className="artifact-event"><time>19:16:02 UTC</time><strong>HOLD committed</strong><p>The no-release state and repair requirement were fixed before adapter invocation.</p></article>
                  <article className="artifact-event"><time>19:16:03 UTC</time><strong>Release blocked</strong><p>Receipt EA-000005-EX-01 recorded HTTP 423 and zero batches released.</p></article>
                  <article className="artifact-event"><time>19:17:20 UTC</time><strong>Outcome closed</strong><p>Distribution state remained unchanged and the request remained in RELEASE_HOLD_PRESERVED.</p></article>
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
                subtitle="A challenge may dispute evidence, evidence interpretation, route logic, technical effect, outcome closure, integrity, or the public claim. It may not silently rewrite the original event."
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
                <div className="artifact-side-row"><span>Earliest failure</span><strong>ADMISSIBILITY</strong></div>
                <div className="artifact-side-row"><span>Route</span><strong>{ROUTE_ID}</strong></div>
                <div className="artifact-side-row"><span>Route version</span><strong>{ROUTE_VERSION}</strong></div>
                <div className="artifact-side-row"><span>Status</span><strong>PUBLISHED DEMONSTRATION</strong></div>
              </div>
            </section>

            <section className="artifact-side-card">
              <div className="artifact-overline">Repair condition</div>
              <h3>Evidence must be restored.</h3>
              <p>
                Capture a new current sterility assay, preserve the new state,
                rerun every dependent gate, and generate a new commit. The original HOLD remains
                immutable.
              </p>
              <button className="artifact-button" type="button" onClick={() => selectView("evidence")}>Inspect freshness ledger</button>
            </section>

            <section className="artifact-side-card">
              <div className="artifact-overline">Download package</div>
              <h3>Inspect offline.</h3>
              <p>Download public representations generated from this bounded demonstration record.</p>
              <div className="artifact-downloads">
                <button className="artifact-download" type="button" onClick={() => downloadText(`${ARTIFACT_ID}.json`, packageRecord)}>Canonical JSON <span>↓</span></button>
                <button className="artifact-download" type="button" onClick={() => downloadText(`${ARTIFACT_ID}-integrity-manifest.json`, integrityManifest)}>Integrity manifest <span>↓</span></button>
                <button className="artifact-download" type="button" onClick={() => downloadText(`${ARTIFACT_ID}-execution-receipt.json`, packageRecord.execution)}>Execution receipt <span>↓</span></button>
                <button className="artifact-download" type="button" onClick={() => downloadText(`${ARTIFACT_ID}-evidence-ledger.json`, evidenceEvents)}>Evidence validity ledger <span>↓</span></button>
                <button className="artifact-download" type="button" onClick={() => downloadText(`${ARTIFACT_ID}-verification.txt`, `Artifact: ${ARTIFACT_ID}\nExpected result: VERIFIED\nMaximum public level: 6\nRecord hash: ${RECORD_HASH}\nPackage hash: ${PACKAGE_HASH}\n`)}>Verification guide <span>↓</span></button>
              </div>
            </section>

            <section className="artifact-side-card artifact-boundary">
              <div className="artifact-overline">Claims boundary</div>
              <h3>Controlled demonstration.</h3>
              <p>
                This artifact proves one reference-engine event in which expired evidence produced
                a technical hold and a preserved no-release outcome. It does not claim external
                certification or universal performance.
              </p>
            </section>
          </aside>
        </div>

        <footer className="artifact-footer">
          <span>TA-14 Evidence · Admissible Execution Architecture · {ARTIFACT_ID}</span>
          <span>No admissible evidence. No admissible execution.</span>
        </footer>
      </div>
    </main>
  );
}
