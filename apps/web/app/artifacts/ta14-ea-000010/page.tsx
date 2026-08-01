"use client";

import Link from "next/link";
import { useMemo, useRef, useState, type ReactNode } from "react";

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

type GateResult = "PASS" | "FAIL" | "UNRESOLVED" | "NOT_APPLICABLE";
type VerificationState = "IDLE" | "RUNNING" | "VERIFIED";

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

type TimelineItem = {
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

type BoundaryControl = {
  id: string;
  field: string;
  committed: string;
  result: string;
  explanation: string;
};

const ARTIFACT_ID = "TA14-EA-000010";
const ARTIFACT_TITLE = "Dual-Authority Privileged Access Restoration With Verified Outcome";
const ROUTE_ID = "TA14-ROUTE-DUAL-AUTHORITY-ALLOW-010";
const ROUTE_VERSION = "2.0.0";
const ENGINE_VERSION = "TA14-CEA-2.0.0";
const RECORD_HASH = "sha256:a87a3a40a771814ec5b59210fa79c2d0685e17819f1bb3575ca7c5182ce1010a";
const PACKAGE_HASH = "sha256:4b4a7110d9eb48dc2cc179060b4da8fb30536c5ad80fbf9cfc937988f5b0010b";
const RECEIPT_HASH = "sha256:95608ea7f40f2f45b9ca1a73762e8f5208de85bf702f5f5f701bc1c78210010c";
const COMMIT_HASH = "sha256:f43a778b1173fab23c81217a317bb0f2cfa4da0d7eb9399ab2f26ac2c210010d";
const OUTCOME_HASH = "sha256:205b1dd1a1ae55c3180a2a90144a9d4162e04f09fe71a6643ec0b9d0fa10010e";
const chain: ChainItem[] = [
  {
    number: "01",
    link: "Reality",
    result: "PASS",
    question: "What condition existed before interpretation?",
    finding: "One bounded privileged-access restoration request existed inside a controlled enterprise identity environment.",
    proof: "Scenario record EA-000010-SC-01 fixes the proposed restoration, affected account, consequence, managed system, privilege scope, and non-production identity-control boundary.",
  },
  {
    number: "02",
    link: "Record",
    result: "PASS",
    question: "What attributable representation was preserved?",
    finding: "The restoration request, incident record, account state, dual-authority approvals, route snapshot, and privileged-access target state were preserved before evaluation.",
    proof: "Record manifest EA-000010-RC-01 assigns stable identifiers, timestamps, source attribution, disclosure state, and component hashes.",
  },
  {
    number: "03",
    link: "Continuity",
    result: "PASS",
    question: "Did identity, state, version, and custody remain connected?",
    finding: "No material source, account state, incident condition, authority, route, managed system, privilege scope, or dependency changed before commit.",
    proof: "Continuity ledger EA-000010-CT-01 records continuous identity, custody, version, freshness, and dependency state through execution.",
  },
  {
    number: "04",
    link: "Admissibility",
    result: "PASS",
    question: "May the evidence and authority support this exact consequence now?",
    finding: "Every mandatory evidence item and both independent dual-authority records were current, relevant, sufficient, attributable, and admitted for this bounded restoration.",
    proof: "Admissibility record EA-000010-AD-01 contains twelve admitted evidence and concurrence items, zero conflicts, and zero unresolved mandatory conditions.",
  },
  {
    number: "05",
    link: "Binding",
    result: "PASS",
    question: "What valid rule connects the determination to consequence?",
    finding: "The frozen route permits exactly one time-bounded privileged-access restoration only after independent concurrence by the Security Operations Lead and the System Owner.",
    proof: "Binding record EA-000010-BD-01 applies the governing rule and fixes all execution limits before commitment.",
  },
  {
    number: "06",
    link: "Commit",
    result: "PASS",
    question: "What determination was fixed before action?",
    finding: "ALLOW was committed only after both independent authorities approved the same account, privilege set, managed system, purpose, and expiration window.",
    proof: "Commit record EA-000010-CM-01 preserves the determination, reason codes, approved scope, route version, dual-authority snapshot, and commit time.",
  },
  {
    number: "07",
    link: "Execution",
    result: "PASS",
    question: "Did the committed determination technically control the action path?",
    finding: "The identity-control adapter restored only the committed privilege set, enforced automatic expiration, and rejected every field outside the dual-approved request.",
    proof: "Execution receipt EA-000010-EX-01 records HTTP 202, ACCESS_RESTORED, exact scope parity, one restoration invocation, zero unauthorized retries, and zero bypass attempts.",
  },
  {
    number: "08",
    link: "Outcome",
    result: "PASS",
    question: "What bound to reality, and what did not?",
    finding: "The approved privileged-access state was restored once, verified independently, and automatically expired without any additional privilege, account, managed system, or downstream action.",
    proof: "Outcome record EA-000010-OT-01 and independent parity review confirm the bounded result and preserved residual-risk statement.",
  },
];
const gates: GateItem[] = [
  {
    number: "01",
    title: "Observed condition registered",
    chainLink: "REALITY",
    result: "PASS",
    reasonCode: "REALITY_PRESENT",
    summary: "The exact present condition and proposed consequence were registered before interpretation.",
  },
  {
    number: "02",
    title: "Affected subjects identified",
    chainLink: "REALITY",
    result: "PASS",
    reasonCode: "SUBJECTS_IDENTIFIED",
    summary: "The managed identity target, requesting security analyst, reviewer, adapter, and institutional environment are attributable.",
  },
  {
    number: "03",
    title: "Proposed action bounded",
    chainLink: "REALITY",
    result: "PASS",
    reasonCode: "ACTION_BOUNDED",
    summary: "The action is limited to one account, one privilege set, one managed system, one approved purpose, and one expiration window.",
  },
  {
    number: "04",
    title: "Source record captured",
    chainLink: "RECORD",
    result: "PASS",
    reasonCode: "SOURCE_CAPTURED",
    summary: "The privileged-access restoration request and supporting declarations were preserved before reliance.",
  },
  {
    number: "05",
    title: "Record identity fixed",
    chainLink: "RECORD",
    result: "PASS",
    reasonCode: "RECORD_ID_FIXED",
    summary: "Stable record, component, route, evidence, authority, commit, receipt, and outcome identifiers were assigned.",
  },
  {
    number: "06",
    title: "Version snapshot sealed",
    chainLink: "RECORD",
    result: "PASS",
    reasonCode: "VERSION_SEALED",
    summary: "The route, engine, identity policy, privilege schema, adapter, and canonicalization versions were frozen.",
  },
  {
    number: "07",
    title: "Actor identity continuous",
    chainLink: "CONTINUITY",
    result: "PASS",
    reasonCode: "ACTOR_CONTINUOUS",
    summary: "The requesting analyst, Security Operations Lead, System Owner, adapter, steward, and verifier identities remained connected.",
  },
  {
    number: "08",
    title: "Evidence custody continuous",
    chainLink: "CONTINUITY",
    result: "PASS",
    reasonCode: "CUSTODY_CONTINUOUS",
    summary: "All evidence remained linked through capture, evaluation, commit, execution, and closure.",
  },
  {
    number: "09",
    title: "State drift absent",
    chainLink: "CONTINUITY",
    result: "PASS",
    reasonCode: "NO_MATERIAL_DRIFT",
    summary: "No material account, incident, authority, privilege, managed system, or system condition changed between intake, commitment, and adapter invocation.",
  },
  {
    number: "10",
    title: "Evidence relevant",
    chainLink: "ADMISSIBILITY",
    result: "PASS",
    reasonCode: "EVIDENCE_RELEVANT",
    summary: "Each admitted item bears directly on the exact action, route, authority, boundary, or outcome.",
  },
  {
    number: "11",
    title: "Evidence fresh",
    chainLink: "ADMISSIBILITY",
    result: "PASS",
    reasonCode: "EVIDENCE_FRESH",
    summary: "Every time-sensitive record remained within its declared freshness window.",
  },
  {
    number: "12",
    title: "Evidence sufficient",
    chainLink: "ADMISSIBILITY",
    result: "PASS",
    reasonCode: "EVIDENCE_SUFFICIENT",
    summary: "The admitted package satisfies every mandatory route requirement without unsupported inference.",
  },
  {
    number: "13",
    title: "Conflicts resolved",
    chainLink: "ADMISSIBILITY",
    result: "PASS",
    reasonCode: "NO_UNRESOLVED_CONFLICT",
    summary: "No contradictory incident, account, authority, privilege, managed system, or target-state record remains unresolved.",
  },
  {
    number: "14",
    title: "Dual authority valid",
    chainLink: "BINDING",
    result: "PASS",
    reasonCode: "AUTHORITY_VALID",
    summary: "The artifact steward and runtime operator possess valid dual authority for the exact demonstration action.",
  },
  {
    number: "15",
    title: "Concurrence scope exact",
    chainLink: "BINDING",
    result: "PASS",
    reasonCode: "AUTHORITY_IN_SCOPE",
    summary: "Authority covers one controlled release and does not extend beyond the declared environment.",
  },
  {
    number: "16",
    title: "Execution boundary intact",
    chainLink: "BINDING",
    result: "PASS",
    reasonCode: "BOUNDARY_INTACT",
    summary: "Requested identity policy, identity-control adapter, managed system, privilege scope, privileges, and time window remain inside the route boundary.",
  },
  {
    number: "17",
    title: "Governing obligation applied",
    chainLink: "BINDING",
    result: "PASS",
    reasonCode: "RULE_APPLIED",
    summary: "No admissible evidence. No admissible execution. Commit before action. Release only exact approved scope.",
  },
  {
    number: "18",
    title: "Determination supported",
    chainLink: "COMMIT",
    result: "PASS",
    reasonCode: "ALLOW_SUPPORTED",
    summary: "Every mandatory upstream condition supports ALLOW without exception or unresolved dependency.",
  },
  {
    number: "19",
    title: "Commit snapshot immutable",
    chainLink: "COMMIT",
    result: "PASS",
    reasonCode: "COMMIT_SEALED",
    summary: "The approved state was sealed before execution and remained distinguishable from later records.",
  },
  {
    number: "20",
    title: "Pre-execution revalidation complete",
    chainLink: "COMMIT",
    result: "PASS",
    reasonCode: "REVALIDATION_COMPLETE",
    summary: "Evidence, authority, route, identity policy, identity-control adapter, managed system, threshold, and privileged-access target state were rechecked immediately before release.",
  },
  {
    number: "21",
    title: "Adapter command bounded",
    chainLink: "EXECUTION",
    result: "PASS",
    reasonCode: "COMMAND_RELEASE_EXACT",
    summary: "The adapter received one signed release command containing only the frozen action fields.",
  },
  {
    number: "22",
    title: "Execution correspondence verified",
    chainLink: "EXECUTION",
    result: "PASS",
    reasonCode: "EXECUTION_PARITY",
    summary: "The performed action matches the committed action across target, privilege scope, managed system, identity policy, identity-control adapter, and time.",
  },
  {
    number: "23",
    title: "Outcome observed",
    chainLink: "OUTCOME",
    result: "PASS",
    reasonCode: "OUTCOME_OBSERVED",
    summary: "The resulting privileged-access target state was observed after execution and compared with the expected bounded state.",
  },
  {
    number: "24",
    title: "Record package preserved",
    chainLink: "OUTCOME",
    result: "PASS",
    reasonCode: "PACKAGE_PRESERVED",
    summary: "The complete history, exports, receipts, hashes, verification instructions, and challenge path remain inspectable.",
  },
];
const evidence: EvidenceItem[] = [
  {
    id: "EA-000010-EV-01",
    title: "Privileged-access restoration request",
    source: "Enterprise Security Requestor",
    type: "DECLARATION",
    disclosure: "PUBLIC",
    status: "ADMITTED",
    capturedAt: "2026-08-01 08:00:00 UTC",
    hash: "sha256:0b4ad1f2...e901",
    supports: "Exact action, consequence, managed system, privilege scope, affected account, and declared limits.",
    limitation: "Controlled demonstration declaration; not a production customer event.",
  },
  {
    id: "EA-000010-EV-02",
    title: "Frozen route snapshot",
    source: "TA-14 Route Resolver",
    type: "SYSTEM_RECORD",
    disclosure: "PUBLIC",
    status: "ADMITTED",
    capturedAt: "2026-08-01 08:00:04 UTC",
    hash: "sha256:2c7705bd...44a2",
    supports: "Route identity, version, gate order, policy basis, thresholds, and revalidation triggers.",
    limitation: "Valid only for route version 2.0.0 and the declared event.",
  },
  {
    id: "EA-000010-EV-03",
    title: "Security Operations Lead authority record",
    source: "TA-14 Dual-Authority Resolver",
    type: "AUTHORITY_RECORD",
    disclosure: "SELECTIVE",
    status: "ADMITTED",
    capturedAt: "2026-08-01 08:00:07 UTC",
    hash: "sha256:9a82cb3d...7f0c",
    supports: "Security Operations Lead identity, role, organization, source of authority, approval scope, and separation-of-duties position.",
    limitation: "Security Operations Lead authority is bounded to incident-response restoration and cannot substitute for System Owner concurrence.",
  },
  {
    id: "EA-000010-EV-04",
    title: "System Owner concurrence record",
    source: "TA-14 Dual-Authority Resolver",
    type: "AUTHORITY_RECORD",
    disclosure: "SELECTIVE",
    status: "ADMITTED",
    capturedAt: "2026-08-01 08:00:08 UTC",
    hash: "sha256:3fb121a8...61b0",
    supports: "System Owner identity, managed-system ownership, exact concurrence scope, valid time, revocation state, and conflict state.",
    limitation: "System Owner concurrence applies only to the named account, managed system, privilege set, purpose, and expiration window.",
  },
  {
    id: "EA-000010-EV-05",
    title: "Evidence provenance manifest",
    source: "TA-14 Evidence Custodian",
    type: "MANIFEST",
    disclosure: "PUBLIC",
    status: "ADMITTED",
    capturedAt: "2026-08-01 08:00:12 UTC",
    hash: "sha256:7dfce40a...c15d",
    supports: "Source origin, capture method, custody, version, disclosure state, and integrity commitments.",
    limitation: "Public manifest discloses metadata and commitments, not restricted source contents.",
  },
  {
    id: "EA-000010-EV-06",
    title: "Continuity and change ledger",
    source: "TA-14 Continuity Validator",
    type: "SYSTEM_RECORD",
    disclosure: "PUBLIC",
    status: "ADMITTED",
    capturedAt: "2026-08-01 08:02:40 UTC",
    hash: "sha256:453e7829...5f91",
    supports: "Identity, evidence, route, identity policy, identity-control adapter, managed system, threshold, target, and state continuity.",
    limitation: "Covers the preserved event window only.",
  },
  {
    id: "EA-000010-EV-07",
    title: "Admissibility evaluation",
    source: "TA-14 Admissibility Evaluator",
    type: "DECISION_RECORD",
    disclosure: "PUBLIC",
    status: "ADMITTED",
    capturedAt: "2026-08-01 08:02:44 UTC",
    hash: "sha256:5a981b40...e7d2",
    supports: "Relevance, freshness, sufficiency, conflict review, purpose fit, and route fit.",
    limitation: "Does not establish universal admissibility outside this route and purpose.",
  },
  {
    id: "EA-000010-EV-08",
    title: "Binding and boundary record",
    source: "TA-14 Binding Resolver",
    type: "DECISION_RECORD",
    disclosure: "PUBLIC",
    status: "ADMITTED",
    capturedAt: "2026-08-01 08:02:47 UTC",
    hash: "sha256:0ce44f99...a013",
    supports: "Applicable rule, authority scope, managed system, privilege scope, identity policy, identity-control adapter, privilege, and time limits.",
    limitation: "Applies only to the frozen route and action.",
  },
  {
    id: "EA-000010-EV-09",
    title: "Pre-execution revalidation record",
    source: "TA-14 Runtime Validator",
    type: "SYSTEM_RECORD",
    disclosure: "PUBLIC",
    status: "ADMITTED",
    capturedAt: "2026-08-01 08:03:09 UTC",
    hash: "sha256:ab14266d...839e",
    supports: "Immediate recheck of evidence, authority, route, identity policy, identity-control adapter, managed system, threshold, and privileged-access target state.",
    limitation: "Valid only for the captured revalidation instant and release window.",
  },
  {
    id: "EA-000010-EV-10",
    title: "Execution adapter receipt",
    source: "TA-14 Reference Adapter",
    type: "SYSTEM_RECEIPT",
    disclosure: "PUBLIC",
    status: "ADMITTED",
    capturedAt: "2026-08-01 08:03:12 UTC",
    hash: "sha256:1db6c02c...6af9",
    supports: "Committed ALLOW restored exactly one bounded privileged-access restoration with exact scope parity.",
    limitation: "Proves control of the identity-control adapter, not every possible external system.",
  },
  {
    id: "EA-000010-EV-11",
    title: "Target-state observation",
    source: "TA-14 Outcome Observer",
    type: "MEASUREMENT",
    disclosure: "PUBLIC",
    status: "ADMITTED",
    capturedAt: "2026-08-01 08:03:42 UTC",
    hash: "sha256:84b1d30c...9c02",
    supports: "Observed privileged-access target state after release and absence of additional mutations.",
    limitation: "Observation is bounded to the target and event window.",
  },
  {
    id: "EA-000010-EV-12",
    title: "Independent outcome parity review",
    source: "TA-14 Independent Review Lane",
    type: "REVIEW_RECORD",
    disclosure: "PUBLIC",
    status: "ADMITTED",
    capturedAt: "2026-08-01 08:04:10 UTC",
    hash: "sha256:70fb8ce2...48a1",
    supports: "Independent comparison of commit, adapter receipt, target observation, and public claim.",
    limitation: "A bounded review opinion, not a universal certification.",
  },
];
const timeline: TimelineItem[] = [
  {
    time: "08:00:00 UTC",
    event: "Scenario intake sealed",
    detail: "The exact proposed restoration, consequence, target, managed system, privilege scope, and declared limits entered the canonical record.",
    state: "SEALED",
  },
  {
    time: "08:00:04 UTC",
    event: "Route snapshot frozen",
    detail: "Route TA14-ROUTE-DUAL-AUTHORITY-ALLOW-010 version 2.0.0 and all twenty-four gates were fixed.",
    state: "FROZEN",
  },
  {
    time: "08:00:08 UTC",
    event: "First authority validated",
    detail: "The Security Operations Lead was validated as independent, conflict-free, current, and in scope for the exact restoration request.",
    state: "VALID",
  },
  {
    time: "08:00:10 UTC",
    event: "Independent concurrence validated",
    detail: "The System Owner independently approved the same account, privilege set, managed system, purpose, and expiration window without inheriting or duplicating the first authority.",
    state: "CONCURRED",
  },
  {
    time: "08:00:12 UTC",
    event: "Evidence manifest completed",
    detail: "Twelve evidence records, including two independently sourced authority records, received stable identifiers and integrity commitments.",
    state: "COMPLETE",
  },
  {
    time: "08:02:40 UTC",
    event: "Continuity validated",
    detail: "No material drift was found across identity, evidence, route, identity policy, identity-control adapter, managed system, threshold, or privileged-access target state.",
    state: "CONTINUOUS",
  },
  {
    time: "08:02:44 UTC",
    event: "Admissibility established",
    detail: "Every mandatory item was current, relevant, sufficient, attributable, and conflict-free for this route.",
    state: "ADMITTED",
  },
  {
    time: "08:02:47 UTC",
    event: "Binding conditions resolved",
    detail: "Authority, obligation, scope, managed system, privilege scope, privilege, and time boundaries all remained valid.",
    state: "BOUND",
  },
  {
    time: "08:03:09 UTC",
    event: "Runtime revalidation completed",
    detail: "All material conditions were rechecked immediately before commitment and adapter invocation.",
    state: "REVALIDATED",
  },
  {
    time: "08:03:10 UTC",
    event: "ALLOW committed",
    detail: "The exact permitted next action was fixed before execution with no broader authority or scope.",
    state: "COMMITTED",
  },
  {
    time: "08:03:12 UTC",
    event: "Action released",
    detail: "The identity-control adapter accepted one signed bounded command and returned HTTP 202 ACCESS_RESTORED.",
    state: "ACCESS_RESTORED",
  },
  {
    time: "08:03:42 UTC",
    event: "Outcome observed",
    detail: "The target reached the authorized state once and no additional target mutation was detected.",
    state: "OBSERVED",
  },
  {
    time: "08:04:10 UTC",
    event: "Independent parity review closed",
    detail: "The public claim, commit, receipt, target observation, hashes, and package exports were found consistent.",
    state: "VERIFIED",
  },
];
const verificationChecks: VerificationCheck[] = [
  {
    level: "0",
    label: "Declared record",
    detail: "Publisher asserts the bounded record exists and exposes its identity and claim boundary.",
  },
  {
    level: "1",
    label: "Package integrity",
    detail: "Every downloadable component reproduces the published component digest and package-root hash.",
  },
  {
    level: "2",
    label: "Signature validity",
    detail: "The integrity manifest validates against the declared TA-14 demonstration signing key and policy.",
  },
  {
    level: "3",
    label: "Record parity",
    detail: "Inspection page, canonical JSON, manifest, route snapshot, receipt, and outcome resolve to one frozen root.",
  },
  {
    level: "4",
    label: "Replay consistency",
    detail: "Disclosed inputs and route version reproduce ALLOW without changing the frozen event.",
  },
  {
    level: "5",
    label: "Execution effect",
    detail: "The adapter receipt proves ACCESS_RESTORED, one restoration invocation, exact scope parity, and zero bypass attempts.",
  },
  {
    level: "6",
    label: "Outcome closure",
    detail: "Target-state observation and independent review support the reported real-world bounded outcome.",
  },
];
const acceptanceTests: AcceptanceTest[] = [
  {
    id: "AT-01",
    result: "PASS",
    condition: "One immutable artifact root and all required linked records were generated.",
  },
  {
    id: "AT-02",
    result: "PASS",
    condition: "The frozen route, evidence, authority, gate, commit, and receipt records cannot be silently overwritten.",
  },
  {
    id: "AT-03",
    result: "PASS",
    condition: "ALLOW produced the required exact-scope release effect.",
  },
  {
    id: "AT-04",
    result: "PASS",
    condition: "No mandatory gate was skipped, unresolved, or converted into silent permission.",
  },
  {
    id: "AT-05",
    result: "PASS",
    condition: "The configured revalidation step completed immediately before execution.",
  },
  {
    id: "AT-06",
    result: "PASS",
    condition: "The execution adapter produced a technical receipt proving release and exact field parity.",
  },
  {
    id: "AT-07",
    result: "PASS",
    condition: "Public page, canonical JSON, integrity manifest, route snapshot, receipt, and outcome share one record root.",
  },
  {
    id: "AT-08",
    result: "PASS",
    condition: "Offline verification detects any altered component or mismatched digest.",
  },
  {
    id: "AT-09",
    result: "PASS",
    condition: "Selective authority details remain bounded while public integrity commitments remain verifiable.",
  },
  {
    id: "AT-10",
    result: "PASS",
    condition: "A challenge can be appended without deleting or rewriting the original execution event.",
  },
  {
    id: "AT-11",
    result: "PASS",
    condition: "The artifact clearly states what it proves and what it does not prove.",
  },
  {
    id: "AT-12",
    result: "PASS",
    condition: "The demonstration event is not mislabeled as a production customer execution.",
  },
  {
    id: "AT-13",
    result: "PASS",
    condition: "The visitor can inspect and verify the artifact without authentication.",
  },
  {
    id: "AT-14",
    result: "PASS",
    condition: "The outcome was observed and independently compared with the committed action and technical receipt.",
  },
  {
    id: "AT-15",
    result: "PASS",
    condition: "No public claim exceeds the preserved bounded record.",
  },
];
const boundaryControls: BoundaryControl[] = [
  {
    id: "CONTROL-01",
    field: "Exact action",
    committed: "One bounded privileged-access restoration",
    result: "PASS",
    explanation: "The action contains a stable target, operation, privilege scope, managed system, identity policy, identity-control adapter, and event window.",
  },
  {
    id: "CONTROL-02",
    field: "Target identity",
    committed: "Account svc-ops-042 on managed system IDG-PROD-07",
    result: "PASS",
    explanation: "The target identity resolves to one controlled account on the named managed system.",
  },
  {
    id: "CONTROL-03",
    field: "Destination",
    committed: "TA-14 Privileged Access Control Adapter 2.0",
    result: "PASS",
    explanation: "No alternate account, managed system, privilege set, or destination is authorized or invoked.",
  },
  {
    id: "CONTROL-04",
    field: "Quantity",
    committed: "One restoration for one account and one privilege set",
    result: "PASS",
    explanation: "The adapter rejects duplicate restoration, additional accounts, expanded privileges, extended duration, or secondary-system fields.",
  },
  {
    id: "CONTROL-05",
    field: "Model",
    committed: "TA-14 Identity Governance Runtime 2.0",
    result: "PASS",
    explanation: "The committed and invoked runtime versions match.",
  },
  {
    id: "CONTROL-06",
    field: "Tool",
    committed: "TA-14 Privileged Access Control Adapter 2.0",
    result: "PASS",
    explanation: "The permitted and invoked identity-control adapter identifiers match.",
  },
  {
    id: "CONTROL-07",
    field: "Privilege",
    committed: "Restore READ_DIAGNOSTICS and RESTART_SERVICE only",
    result: "PASS",
    explanation: "No administrative delegation, account creation, policy modification, credential export, or secondary privilege is restored.",
  },
  {
    id: "CONTROL-08",
    field: "Time window",
    committed: "08:03:10–08:03:30 UTC",
    result: "PASS",
    explanation: "The command was issued and accepted within the committed release window.",
  },
  {
    id: "CONTROL-09",
    field: "Authority",
    committed: "Security Operations Lead plus System Owner",
    result: "PASS",
    explanation: "Both independent authorities were valid, conflict-free, in scope, and recorded concurrence on the identical restoration object before commit.",
  },
  {
    id: "CONTROL-10",
    field: "Evidence freshness",
    committed: "All mandatory records current",
    result: "PASS",
    explanation: "No time-sensitive record exceeded its route freshness threshold.",
  },
  {
    id: "CONTROL-11",
    field: "Continuity",
    committed: "No material drift",
    result: "PASS",
    explanation: "The revalidation snapshot found no changed material condition.",
  },
  {
    id: "CONTROL-12",
    field: "Commit parity",
    committed: "Frozen request hash matched adapter command",
    result: "PASS",
    explanation: "Every governed command field matched the commit snapshot.",
  },
  {
    id: "CONTROL-13",
    field: "Bypass resistance",
    committed: "No alternate invocation",
    result: "PASS",
    explanation: "No unauthorized token, managed system, retry, direct call, or alternate adapter path was observed.",
  },
  {
    id: "CONTROL-14",
    field: "Outcome correspondence",
    committed: "Observed state matched authorized state",
    result: "PASS",
    explanation: "The account received exactly the two approved privileges, the state was independently observed, and both privileges expired automatically at the committed time.",
  },
  {
    id: "CONTROL-15",
    field: "Residual risk",
    committed: "Time-bounded privileged-access risk only",
    result: "PASS",
    explanation: "Residual risk is limited to reference-environment interpretation and future-route non-generalization.",
  },
  {
    id: "CONTROL-16",
    field: "Public claim boundary",
    committed: "One account, one privilege set, two authorities, one route, one adapter",
    result: "PASS",
    explanation: "The page does not claim universal system performance or regulatory certification.",
  },
];


type PackageComponent = {
  id: string;
  name: string;
  format: string;
  disclosure: string;
  purpose: string;
  digest: string;
};

const packageComponents: PackageComponent[] = [
  {
    id: "PKG-01",
    name: "Public inspection record",
    format: "HTML",
    disclosure: "PUBLIC",
    purpose: "Presents the sixty-second inspection path and progressive disclosure surfaces.",
    digest: "sha256:2aa9d611...a001",
  },
  {
    id: "PKG-02",
    name: "Canonical bounded record",
    format: "JSON",
    disclosure: "PUBLIC",
    purpose: "Preserves the machine-readable record graph used for parity and replay checks.",
    digest: "sha256:2aa9d611...a002",
  },
  {
    id: "PKG-03",
    name: "Human-readable bounded record",
    format: "PDF",
    disclosure: "PUBLIC",
    purpose: "Provides the institutional human-readable representation of the frozen record.",
    digest: "sha256:2aa9d611...a003",
  },
  {
    id: "PKG-04",
    name: "Route snapshot",
    format: "JSON",
    disclosure: "PUBLIC",
    purpose: "Fixes route identity, version, gate order, limits, and revalidation triggers.",
    digest: "sha256:2aa9d611...a004",
  },
  {
    id: "PKG-05",
    name: "Evidence manifest",
    format: "JSON",
    disclosure: "PUBLIC",
    purpose: "Lists evidence identifiers, sources, disclosure states, hashes, and admission results.",
    digest: "sha256:2aa9d611...a005",
  },
  {
    id: "PKG-06",
    name: "Authority record",
    format: "JSON",
    disclosure: "SELECTIVE",
    purpose: "Preserves identity, role, source, scope, valid time, revocation, and conflict state.",
    digest: "sha256:2aa9d611...a006",
  },
  {
    id: "PKG-07",
    name: "Continuity ledger",
    format: "JSON",
    disclosure: "PUBLIC",
    purpose: "Shows identity, custody, version, freshness, state, and dependency continuity.",
    digest: "sha256:2aa9d611...a007",
  },
  {
    id: "PKG-08",
    name: "Admissibility record",
    format: "JSON",
    disclosure: "PUBLIC",
    purpose: "Records relevance, freshness, sufficiency, conflict, purpose, and route-fit decisions.",
    digest: "sha256:2aa9d611...a008",
  },
  {
    id: "PKG-09",
    name: "Binding record",
    format: "JSON",
    disclosure: "PUBLIC",
    purpose: "Preserves the obligation, authority, boundary, and prohibited-scope evaluation.",
    digest: "sha256:2aa9d611...a009",
  },
  {
    id: "PKG-10",
    name: "Twenty-four-gate ledger",
    format: "JSON",
    disclosure: "PUBLIC",
    purpose: "Exposes each mandatory gate, input, result, reason code, and chain correspondence.",
    digest: "sha256:2aa9d611...a010",
  },
  {
    id: "PKG-11",
    name: "Commit record",
    format: "JSON",
    disclosure: "PUBLIC",
    purpose: "Fixes ALLOW, reasons, authority, scope, permitted next action, and commit time.",
    digest: "sha256:2aa9d611...a011",
  },
  {
    id: "PKG-12",
    name: "Execution receipt",
    format: "JSON",
    disclosure: "PUBLIC",
    purpose: "Proves one exact release command, HTTP result, parity, retry, and bypass state.",
    digest: "sha256:2aa9d611...a012",
  },
  {
    id: "PKG-13",
    name: "Target-state observation",
    format: "JSON",
    disclosure: "PUBLIC",
    purpose: "Preserves the observed post-execution state and unauthorized-mutation count.",
    digest: "sha256:2aa9d611...a013",
  },
  {
    id: "PKG-14",
    name: "Outcome closure record",
    format: "JSON",
    disclosure: "PUBLIC",
    purpose: "Connects the observed result, residual risk, reviewer, and closure status.",
    digest: "sha256:2aa9d611...a014",
  },
  {
    id: "PKG-15",
    name: "Integrity manifest",
    format: "JSON",
    disclosure: "PUBLIC",
    purpose: "Publishes component hashes, package root, algorithm, policy, and verifier version.",
    digest: "sha256:2aa9d611...a015",
  },
  {
    id: "PKG-16",
    name: "Replay inputs",
    format: "JSON",
    disclosure: "PUBLIC",
    purpose: "Provides permitted inputs sufficient to reproduce the committed determination.",
    digest: "sha256:2aa9d611...a016",
  },
  {
    id: "PKG-17",
    name: "Verification instructions",
    format: "TXT",
    disclosure: "PUBLIC",
    purpose: "Defines online and offline checks with expected outputs and bounded conclusions.",
    digest: "sha256:2aa9d611...a017",
  },
  {
    id: "PKG-18",
    name: "Acceptance-test report",
    format: "JSON",
    disclosure: "PUBLIC",
    purpose: "Shows publication-gate results across schema, parity, control, outcome, and claims.",
    digest: "sha256:2aa9d611...a018",
  },
  {
    id: "PKG-19",
    name: "Independent review record",
    format: "JSON",
    disclosure: "PUBLIC",
    purpose: "Publishes the bounded outside review scope, findings, limits, and closure time.",
    digest: "sha256:2aa9d611...a019",
  },
  {
    id: "PKG-20",
    name: "Challenge and correction record",
    format: "JSON",
    disclosure: "PUBLIC",
    purpose: "Preserves challenge status, responses, amendments, supersession, and withdrawal state.",
    digest: "sha256:2aa9d611...a020",
  },
];

const packageRecord = {
  schema: "ta14.execution-artifact.v2.0",
  engineVersion: ENGINE_VERSION,
  canonicalizationVersion: "TA14-C14N-1.0.0",
  artifact: {
    artifactId: ARTIFACT_ID,
    title: ARTIFACT_TITLE,
    seriesId: "TA14-CANONICAL-FOUNDING",
    sequence: 1,
    classification: "CANONICAL EXECUTION PROOF",
    sector: "Cross-sector",
    publicationState: "PUBLISHED",
    determination: "ALLOW",
    verificationLevel: 6,
    simulated: true,
  },
  scenario: {
    proposedAction:
      "Release one bounded reference execution after every mandatory condition survives review and revalidation.",
    consequenceAtStake:
      "A consequential action may bind to the controlled target only within the exact authorized scope.",
    affectedSubjects: [
      "TA-14 controlled dual-authority identity restoration environment",
      "designated artifact steward",
      "runtime operator",
      "reference execution target",
      "independent reviewer",
    ],
    environment: "Controlled, auditable, fail-closed TA-14 identity-governance environment",
    intendedDestination: "TA-14 Reference Execution Adapter",
    amountOrQuantity: "One bounded action",
    requestedModel: "TA-14 Identity Governance Runtime 2.0",
    requestedTool: "TA-14 Privileged Access Control Adapter 2.0",
    declaredLimits: [
      "No production customer system is affected.",
      "The record proves one bounded event only.",
      "The record does not certify every future route, adapter, execution, or outcome.",
      "The event is a controlled dual-authority identity restoration and is not represented as a production customer record.",
    ],
  },
  route: {
    routeId: ROUTE_ID,
    routeVersion: ROUTE_VERSION,
    engineVersion: ENGINE_VERSION,
    gateCount: 24,
    policyBasis: [
      "No admissible evidence. No admissible execution.",
      "Commit before action.",
      "Fail closed on every unresolved mandatory condition.",
      "Release only the exact authorized action, target, managed system, privilege scope, identity policy, identity-control adapter, privilege, and time window.",
      "Observe and preserve the resulting condition before closure.",
    ],
    jurisdictionProfile: "TA-14 institutional demonstration profile",
    permittedModel: "TA-14 Identity Governance Runtime 2.0",
    permittedTool: "TA-14 Privileged Access Control Adapter 2.0",
    permittedDestination: "TA-14 Reference Execution Adapter",
    permittedQuantity: 1,
    revalidationTriggers: [
      "evidence expiry",
      "authority change",
      "route-version change",
      "identity policy change",
      "identity-control adapter change",
      "managed system change",
      "privilege scope change",
      "threshold change",
      "target-state change",
      "dependency change",
    ],
  },
  evidence,
  chain,
  gates,
  boundaryControls,
  commit: {
    determination: "ALLOW",
    reasonCodes: [
      "ALL_MANDATORY_GATES_PASS",
      "AUTHORITY_VALID",
      "EVIDENCE_ADMISSIBLE",
      "CONTINUITY_PRESERVED",
      "BOUNDARY_INTACT",
      "REVALIDATION_COMPLETE",
    ],
    committedAt: "2026-08-01T08:03:10Z",
    committedBy: "TA-14 Runtime Operator",
    commitHash: COMMIT_HASH,
    permittedNextAction:
      "Invoke the TA-14 Reference Execution Adapter once with the exact frozen command during the committed event window.",
  },
  execution: {
    adapterId: "TA14-REFERENCE-ADAPTER",
    adapterVersion: "2.0.0",
    command: "RELEASE_EXACT",
    invokedAt: "2026-08-01T08:03:12Z",
    technicalStatus: 202,
    technicalMessage: "ACCESS_RESTORED",
    invocationCount: 1,
    retryCount: 0,
    bypassAttempts: 0,
    scopeParity: true,
    receiptId: "EA-000010-EX-01",
    receiptHash: RECEIPT_HASH,
  },
  outcome: {
    state: "AUTHORIZED_STATE_OBSERVED",
    observedAt: "2026-08-01T08:03:42Z",
    actionCount: 1,
    unauthorizedMutations: 0,
    additionalDestinations: 0,
    residualRisk:
      "The record is bounded to one controlled dual-authority identity restoration event and does not establish future or universal performance.",
    independentlyReviewed: true,
    reviewClosedAt: "2026-08-01T08:04:10Z",
    outcomeHash: OUTCOME_HASH,
  },
  integrity: {
    recordHash: RECORD_HASH,
    packageHash: PACKAGE_HASH,
    commitHash: COMMIT_HASH,
    receiptHash: RECEIPT_HASH,
    outcomeHash: OUTCOME_HASH,
    algorithm: "SHA-256",
    canonicalization: "TA14-C14N-1.0.0",
    signingPolicy: "TA14-DEMONSTRATION-SIGNING-POLICY-1.0",
    verifierVersion: "TA14-VERIFIER-2.0.0",
  },
  verificationChecks,
  acceptanceTests,
  timeline,
  claimBoundary: {
    proves: [
      "The complete bounded record existed before execution.",
      "Every mandatory route condition passed before ALLOW was committed.",
      "The committed determination controlled the identity-control adapter.",
      "Exactly one authorized action was released.",
      "The observed privileged-access target state corresponded to the committed action.",
      "The public package exposes an independently inspectable verification path.",
    ],
    doesNotProve: [
      "Universal performance across every route, adapter, organization, or jurisdiction.",
      "Regulatory certification or legal approval outside the preserved record.",
      "That every future execution will produce the same result.",
      "That undisclosed or unobserved systems were controlled by this event.",
    ],
  },
};

const navigation: { id: View; label: string; short: string }[] = [
  { id: "inspection", label: "Inspection", short: "IN" },
  { id: "chain", label: "Eight-anchor chain", short: "8C" },
  { id: "runtime", label: "24-link runtime", short: "24" },
  { id: "evidence", label: "Evidence", short: "EV" },
  { id: "authority", label: "Authority", short: "AU" },
  { id: "control", label: "Execution control", short: "EC" },
  { id: "outcome", label: "Outcome", short: "OT" },
  { id: "integrity", label: "Integrity", short: "IG" },
  { id: "verify", label: "Verify", short: "VR" },
  { id: "challenge", label: "Challenge", short: "CH" },
];

function downloadText(filename: string, content: string, mime = "application/json") {
  const blob = new Blob([content], { type: `${mime};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: string }) {
  return <span className={`ea-badge ea-badge-${tone.toLowerCase()}`}>{children}</span>;
}

function SectionHeading({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return (
    <header className="ea-section-heading">
      <span>{eyebrow}</span>
      <h2>{title}</h2>
      <p>{text}</p>
    </header>
  );
}

function Meter({ value, label }: { value: number; label: string }) {
  return (
    <div className="ea-meter" aria-label={`${label}: ${value}%`}>
      <div className="ea-meter-head"><span>{label}</span><strong>{value}%</strong></div>
      <div className="ea-meter-track"><span style={{ width: `${value}%` }} /></div>
    </div>
  );
}

function Stat({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <article className="ea-stat">
      <span>{label}</span>
      <strong>{value}</strong>
      <p>{detail}</p>
    </article>
  );
}

function HashRow({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1300);
    } catch {
      setCopied(false);
    }
  };
  return (
    <div className="ea-hash-row">
      <span>{label}</span>
      <code>{value}</code>
      <button type="button" onClick={copy}>{copied ? "Copied" : "Copy"}</button>
    </div>
  );
}

export default function Artifact000010Page() {
  const [view, setView] = useState<View>("inspection");
  const [verificationState, setVerificationState] = useState<VerificationState>("IDLE");
  const [verificationProgress, setVerificationProgress] = useState(0);
  const [activeGate, setActiveGate] = useState("01");
  const [activeEvidence, setActiveEvidence] = useState(evidence[0].id);
  const [challengeText, setChallengeText] = useState("");
  const [challengeSaved, setChallengeSaved] = useState(false);
  const workspaceRef = useRef<HTMLDivElement>(null);

  const activeGateRecord = useMemo(
    () => gates.find((gate) => gate.number === activeGate) ?? gates[0],
    [activeGate],
  );
  const activeEvidenceRecord = useMemo(
    () => evidence.find((item) => item.id === activeEvidence) ?? evidence[0],
    [activeEvidence],
  );
  const passCount = gates.filter((gate) => gate.result === "PASS").length;

  const selectView = (next: View) => {
    setView(next);
    window.setTimeout(() => workspaceRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
  };

  const runVerification = () => {
    if (verificationState === "RUNNING") return;
    setVerificationState("RUNNING");
    setVerificationProgress(0);
    let progress = 0;
    const timer = window.setInterval(() => {
      progress += 10;
      setVerificationProgress(progress);
      if (progress >= 100) {
        window.clearInterval(timer);
        setVerificationState("VERIFIED");
      }
    }, 120);
  };

  const saveChallenge = () => {
    if (!challengeText.trim()) return;
    window.localStorage.setItem(`${ARTIFACT_ID}.challenge.draft`, challengeText.trim());
    setChallengeSaved(true);
    window.setTimeout(() => setChallengeSaved(false), 1600);
  };

  const exportJson = () =>
    downloadText(`${ARTIFACT_ID}.canonical.json`, JSON.stringify(packageRecord, null, 2));

  const exportManifest = () =>
    downloadText(
      `${ARTIFACT_ID}.integrity-manifest.json`,
      JSON.stringify(packageRecord.integrity, null, 2),
    );

  const exportReceipt = () =>
    downloadText(
      `${ARTIFACT_ID}.execution-receipt.json`,
      JSON.stringify(packageRecord.execution, null, 2),
    );

  const exportOutcome = () =>
    downloadText(
      `${ARTIFACT_ID}.outcome.json`,
      JSON.stringify(packageRecord.outcome, null, 2),
    );

  const exportVerificationGuide = () =>
    downloadText(
      `${ARTIFACT_ID}.verification.txt`,
      [
        `TA-14 Execution Artifact Verification Guide`,
        `Artifact: ${ARTIFACT_ID}`,
        `Record hash: ${RECORD_HASH}`,
        `Package hash: ${PACKAGE_HASH}`,
        `Receipt hash: ${RECEIPT_HASH}`,
        `Outcome hash: ${OUTCOME_HASH}`,
        `Expected determination: ALLOW`,
        `Expected execution effect: ACCESS_RESTORED`,
        `Expected outcome: AUTHORIZED_STATE_OBSERVED`,
        `Verify component digests, record parity, replay consistency, execution effect, and outcome closure.`,
      ].join("\n"),
      "text/plain",
    );

  return (
    <main className="ea-page">
      <div className="ea-ambient" aria-hidden="true">
        <span className="ea-orb ea-orb-one" />
        <span className="ea-orb ea-orb-two" />
        <span className="ea-grid" />
        <span className="ea-scan" />
      </div>

      <header className="ea-topbar">
        <Link href="/artifacts/ta14-ea-000011" className="ea-brand">
          <span className="ea-brand-mark">TA</span>
          <span><strong>TA-14</strong><small>Execution Artifact Registry</small></span>
        </Link>
        <div className="ea-top-actions">
          <Badge tone="published">Published</Badge>
          <Badge tone="allow">ALLOW</Badge>
          <Link href="/artifacts" className="ea-link-button">All artifacts</Link>
        </div>
      </header>

      <section className="ea-hero">
        <div className="ea-hero-copy">
          <div className="ea-kicker"><span>Door Eight</span><b>Canonical Execution Artifact 000010</b></div>
          <h1>Authorized Release<br /><em>With Verified Outcome</em></h1>
          <p className="ea-hero-lede">
            A complete bounded record proving that admissible evidence, valid dual authority,
            preserved continuity, exact execution boundaries, commitment before action,
            technical enforcement, and outcome closure can survive one continuous execution chain.
          </p>
          <div className="ea-hero-actions">
            <button type="button" className="ea-primary" onClick={() => selectView("verify")}>Verify artifact</button>
            <button type="button" className="ea-secondary" onClick={exportJson}>Download canonical JSON</button>
            <button type="button" className="ea-secondary" onClick={() => selectView("chain")}>Inspect complete chain</button>
          </div>
          <div className="ea-principle">
            <span>Governing rule</span>
            <strong>No admissible evidence. No admissible execution.</strong>
          </div>
        </div>

        <aside className="ea-command-core">
          <div className="ea-command-ring">
            <div><span>Determination</span><strong>ALLOW</strong><small>Committed before action</small></div>
          </div>
          <div className="ea-command-grid">
            <div><span>Runtime gates</span><strong>{passCount}/24</strong></div>
            <div><span>Verification</span><strong>Level 6</strong></div>
            <div><span>Execution</span><strong>ACCESS_RESTORED</strong></div>
            <div><span>Outcome</span><strong>VERIFIED</strong></div>
          </div>
          <Meter value={100} label="Route readiness" />
          <div className="ea-command-receipt">
            <span>Technical receipt</span>
            <strong>HTTP 202 · ACCESS_RESTORED</strong>
            <small>One invocation · exact scope parity · zero bypass</small>
          </div>
        </aside>
      </section>

      <section className="ea-stats">
        <Stat label="Artifact identity" value={ARTIFACT_ID} detail="Stable public root identifier" />
        <Stat label="Route" value={ROUTE_VERSION} detail={ROUTE_ID} />
        <Stat label="Evidence" value="12 admitted" detail="Zero rejected · zero unresolved" />
        <Stat label="Outcome" value="1 authorized act" detail="Zero unauthorized mutations" />
      </section>

      <nav className="ea-nav" aria-label="Artifact sections">
        {navigation.map((item) => (
          <button
            type="button"
            key={item.id}
            className={view === item.id ? "active" : ""}
            onClick={() => selectView(item.id)}
          >
            <span>{item.short}</span>
            <strong>{item.label}</strong>
          </button>
        ))}
      </nav>

      <div className="ea-workspace" ref={workspaceRef}>
        {view === "inspection" && (
          <section className="ea-view">
            <SectionHeading
              eyebrow="Sixty-second inspection"
              title="What happened, why it was allowed, and what the system actually did"
              text="The inspection surface exposes the proposed consequence, controlling route, admitted evidence, valid dual authority, committed decision, technical execution effect, observed outcome, and exact limits of the public claim."
            />
            <div className="ea-inspection-grid">
              <article className="ea-panel ea-panel-feature">
                <span className="ea-panel-label">Proposed action</span>
                <h3>Release one bounded reference execution.</h3>
                <p>
                  The requested restoration targeted one controlled resource through one approved adapter,
                  using one approved runtime and one exact action privilege scope during a fixed event window.
                </p>
                <div className="ea-mini-grid">
                  <div><span>Target</span><strong>Account svc-ops-042 on managed system IDG-PROD-07</strong></div>
                  <div><span>Destination</span><strong>Reference execution adapter</strong></div>
                  <div><span>Quantity</span><strong>One bounded action</strong></div>
                  <div><span>Environment</span><strong>Controlled demonstration</strong></div>
                </div>
              </article>

              <article className="ea-panel ea-decision-panel">
                <span className="ea-panel-label">Committed determination</span>
                <div className="ea-decision-word">ALLOW</div>
                <p>
                  Every mandatory condition passed before commitment. The permitted next action was
                  fixed before adapter invocation and could not expand silently during execution.
                </p>
                <Badge tone="allow">All mandatory gates passed</Badge>
              </article>

              <article className="ea-panel">
                <span className="ea-panel-label">Earliest failure</span>
                <h3>None</h3>
                <p>
                  This artifact contains no failed mandatory gate. Every upstream condition remained
                  supported through revalidation, commitment, execution, and outcome closure.
                </p>
              </article>

              <article className="ea-panel">
                <span className="ea-panel-label">Execution effect</span>
                <h3>ACCESS_RESTORED · HTTP 202</h3>
                <p>
                  The adapter accepted one signed command whose governed fields matched the frozen
                  commit record exactly. No retry, alternate managed system, expanded privilege scope, or bypass occurred.
                </p>
              </article>

              <article className="ea-panel">
                <span className="ea-panel-label">Observed outcome</span>
                <h3>Authorized state observed</h3>
                <p>
                  The target entered the committed state once. Independent review found zero additional
                  mutations and parity across the commit, receipt, target observation, and public claim.
                </p>
              </article>

              <article className="ea-panel">
                <span className="ea-panel-label">Verification result</span>
                <h3>Level 6 · Outcome closure</h3>
                <p>
                  Package integrity, signature validity, record parity, replay consistency, execution
                  effect, and bounded outcome closure are represented in the public verification path.
                </p>
              </article>
            </div>

            <div className="ea-two-column ea-margin-top">
              <article className="ea-panel ea-proof-panel">
                <span className="ea-panel-label">What this artifact proves</span>
                {packageRecord.claimBoundary.proves.map((item) => <p key={item} className="ea-checkline">✓ {item}</p>)}
              </article>
              <article className="ea-panel ea-limit-panel">
                <span className="ea-panel-label">What this artifact does not prove</span>
                {packageRecord.claimBoundary.doesNotProve.map((item) => <p key={item} className="ea-limitline">— {item}</p>)}
              </article>
            </div>
          </section>
        )}

        {view === "chain" && (
          <section className="ea-view">
            <SectionHeading
              eyebrow="Eight-anchor execution chain"
              title="Reality to outcome without a missing link"
              text="Every anchor remains visible. A favorable final result does not erase the requirement to prove each upstream condition and each downstream control effect."
            />
            <div className="ea-chain-line">
              {chain.map((item) => (
                <article className="ea-chain-card" key={item.number}>
                  <div className="ea-chain-number">{item.number}</div>
                  <div className="ea-chain-head"><h3>{item.link}</h3><Badge tone="pass">{item.result}</Badge></div>
                  <span className="ea-question">{item.question}</span>
                  <p>{item.finding}</p>
                  <div className="ea-proof"><strong>Preserved proof</strong><p>{item.proof}</p></div>
                </article>
              ))}
            </div>
          </section>
        )}

        {view === "runtime" && (
          <section className="ea-view">
            <SectionHeading
              eyebrow="Verified complete runtime"
              title="Twenty-four gates evaluated in sequence"
              text="Select a gate to inspect its chain correspondence, reason code, evaluation result, and role in the committed determination."
            />
            <div className="ea-runtime-layout">
              <div className="ea-gate-list">
                {gates.map((gate) => (
                  <button
                    type="button"
                    key={gate.number}
                    className={activeGate === gate.number ? "active" : ""}
                    onClick={() => setActiveGate(gate.number)}
                  >
                    <span>{gate.number}</span>
                    <div><strong>{gate.title}</strong><small>{gate.chainLink}</small></div>
                    <Badge tone="pass">{gate.result}</Badge>
                  </button>
                ))}
              </div>
              <aside className="ea-gate-inspector">
                <span className="ea-panel-label">Active runtime gate {activeGateRecord.number}</span>
                <h3>{activeGateRecord.title}</h3>
                <div className="ea-gate-meta">
                  <div><span>Anchor</span><strong>{activeGateRecord.chainLink}</strong></div>
                  <div><span>Result</span><strong>{activeGateRecord.result}</strong></div>
                  <div><span>Reason code</span><strong>{activeGateRecord.reasonCode}</strong></div>
                </div>
                <p>{activeGateRecord.summary}</p>
                <div className="ea-gate-rule">
                  <strong>Runtime discipline</strong>
                  <p>A failed mandatory gate would stop the route at the earliest unsupported condition. This gate passed without exception.</p>
                </div>
              </aside>
            </div>
          </section>
        )}

        {view === "evidence" && (
          <section className="ea-view">
            <SectionHeading
              eyebrow="Evidence manifest"
              title="Twelve admitted records with attribution, custody, disclosure, and limits"
              text="Admission is route-specific. Each item states what it supports and the boundary beyond which it may not be relied upon."
            />
            <div className="ea-evidence-layout">
              <div className="ea-evidence-list">
                {evidence.map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    className={activeEvidence === item.id ? "active" : ""}
                    onClick={() => setActiveEvidence(item.id)}
                  >
                    <span>{item.id}</span>
                    <strong>{item.title}</strong>
                    <small>{item.type} · {item.disclosure}</small>
                  </button>
                ))}
              </div>
              <article className="ea-evidence-detail">
                <div className="ea-evidence-top">
                  <div><span className="ea-panel-label">Selected evidence</span><h3>{activeEvidenceRecord.title}</h3></div>
                  <Badge tone="admitted">{activeEvidenceRecord.status}</Badge>
                </div>
                <div className="ea-record-grid">
                  <div><span>Evidence ID</span><strong>{activeEvidenceRecord.id}</strong></div>
                  <div><span>Source</span><strong>{activeEvidenceRecord.source}</strong></div>
                  <div><span>Type</span><strong>{activeEvidenceRecord.type}</strong></div>
                  <div><span>Disclosure</span><strong>{activeEvidenceRecord.disclosure}</strong></div>
                  <div><span>Captured</span><strong>{activeEvidenceRecord.capturedAt}</strong></div>
                  <div><span>Hash</span><code>{activeEvidenceRecord.hash}</code></div>
                </div>
                <div className="ea-support-limit">
                  <div><span>Supports</span><p>{activeEvidenceRecord.supports}</p></div>
                  <div><span>Limitation</span><p>{activeEvidenceRecord.limitation}</p></div>
                </div>
              </article>
            </div>
          </section>
        )}

        {view === "authority" && (
          <section className="ea-view">
            <SectionHeading
              eyebrow="Authority and binding"
              title="Valid identity is not enough; scope must match the exact action"
              text="The artifact preserves the actor, role, source, delegation, scope, valid time, revocation state, conflicts, and the exact obligation that connected the determination to execution."
            />
            <div className="ea-two-column">
              <article className="ea-panel ea-authority-card">
                <span className="ea-panel-label">Artifact steward</span>
                <h3>TA-14 Artifact Steward</h3>
                <div className="ea-record-grid compact">
                  <div><span>Organization</span><strong>TA-14 Authority</strong></div>
                  <div><span>Role state</span><strong>VALID</strong></div>
                  <div><span>Dual-authority sources</span><strong>Institutional artifact publication mandate</strong></div>
                  <div><span>Conflict state</span><strong>NONE</strong></div>
                  <div><span>Scope</span><strong>Create, review, package, and publish controlled dual-authority identity restoration artifacts</strong></div>
                  <div><span>Revocation</span><strong>NOT REVOKED</strong></div>
                </div>
              </article>
              <article className="ea-panel ea-authority-card">
                <span className="ea-panel-label">Runtime operator</span>
                <h3>TA-14 Runtime Operator</h3>
                <div className="ea-record-grid compact">
                  <div><span>Organization</span><strong>TA-14 Authority</strong></div>
                  <div><span>Role state</span><strong>VALID</strong></div>
                  <div><span>Dual-authority sources</span><strong>Controlled runtime delegation</strong></div>
                  <div><span>Conflict state</span><strong>NONE</strong></div>
                  <div><span>Scope</span><strong>Commit and invoke one bounded reference action</strong></div>
                  <div><span>Revocation</span><strong>NOT REVOKED</strong></div>
                </div>
              </article>
            </div>
            <article className="ea-panel ea-margin-top">
              <span className="ea-panel-label">Binding rule set</span>
              <div className="ea-rule-grid">
                {packageRecord.route.policyBasis.map((rule, index) => (
                  <div key={rule}><span>{String(index + 1).padStart(2, "0")}</span><p>{rule}</p></div>
                ))}
              </div>
            </article>
          </section>
        )}

        {view === "control" && (
          <section className="ea-view">
            <SectionHeading
              eyebrow="Execution-control proof"
              title="The adapter could release only what the commit authorized"
              text="Sixteen boundary controls demonstrate parity across action, target, managed system, privilege scope, identity policy, identity-control adapter, privilege, time, authority, continuity, command, bypass resistance, and outcome."
            />
            <div className="ea-control-grid">
              {boundaryControls.map((control) => (
                <article key={control.id} className="ea-control-card">
                  <div className="ea-control-head"><span>{control.id}</span><Badge tone="pass">{control.result}</Badge></div>
                  <h3>{control.field}</h3>
                  <strong>{control.committed}</strong>
                  <p>{control.explanation}</p>
                </article>
              ))}
            </div>
            <article className="ea-receipt ea-margin-top">
              <div className="ea-receipt-mark">202</div>
              <div>
                <span className="ea-panel-label">Execution receipt EA-000010-EX-01</span>
                <h3>ACCESS_RESTORED · exact scope parity</h3>
                <p>One invocation. Zero retries. Zero bypass attempts. Zero alternate managed systems. Zero expanded privileges.</p>
              </div>
              <button type="button" onClick={exportReceipt}>Download receipt</button>
            </article>
          </section>
        )}

        {view === "outcome" && (
          <section className="ea-view">
            <SectionHeading
              eyebrow="Outcome closure"
              title="Technical completion was compared with the authorized consequence"
              text="The route closes only after the resulting condition is observed, preserved, compared with the commit, and bounded by an explicit residual-risk statement."
            />
            <div className="ea-outcome-hero">
              <div className="ea-outcome-icon">✓</div>
              <div><span>Observed state</span><h3>AUTHORIZED_STATE_OBSERVED</h3><p>One authorized action occurred. No additional mutation, managed system, privilege scope, privilege, or downstream command was detected.</p></div>
              <Badge tone="verified">Independently reviewed</Badge>
            </div>
            <div className="ea-timeline">
              {timeline.map((item, index) => (
                <article key={`${item.time}-${item.event}`}>
                  <div className="ea-timeline-index">{String(index + 1).padStart(2, "0")}</div>
                  <time>{item.time}</time>
                  <div><strong>{item.event}</strong><p>{item.detail}</p></div>
                  <Badge tone="pass">{item.state}</Badge>
                </article>
              ))}
            </div>
            <div className="ea-two-column ea-margin-top">
              <article className="ea-panel">
                <span className="ea-panel-label">Residual risk</span>
                <h3>Bounded demonstration limitation</h3>
                <p>{packageRecord.outcome.residualRisk}</p>
              </article>
              <article className="ea-panel">
                <span className="ea-panel-label">Closure evidence</span>
                <h3>Receipt + target observation + parity review</h3>
                <p>The outcome claim is supported by the technical receipt, observed privileged-access target state, component hashes, and independent comparison record.</p>
              </article>
            </div>
          </section>
        )}

        {view === "integrity" && (
          <section className="ea-view">
            <SectionHeading
              eyebrow="Integrity package"
              title="One frozen record across every public representation"
              text="Component hashes, canonicalization, package root, signature policy, route snapshot, execution receipt, and outcome record provide an inspectable parity surface."
            />
            <div className="ea-integrity-grid">
              <article className="ea-panel ea-integrity-main">
                <span className="ea-panel-label">Published digests</span>
                <HashRow label="Canonical record" value={RECORD_HASH} />
                <HashRow label="Package root" value={PACKAGE_HASH} />
                <HashRow label="Commit record" value={COMMIT_HASH} />
                <HashRow label="Execution receipt" value={RECEIPT_HASH} />
                <HashRow label="Outcome record" value={OUTCOME_HASH} />
              </article>
              <article className="ea-panel">
                <span className="ea-panel-label">Integrity configuration</span>
                <div className="ea-record-grid compact">
                  <div><span>Algorithm</span><strong>SHA-256</strong></div>
                  <div><span>Canonicalization</span><strong>TA14-C14N-1.0.0</strong></div>
                  <div><span>Engine</span><strong>{ENGINE_VERSION}</strong></div>
                  <div><span>Verifier</span><strong>TA14-VERIFIER-2.0.0</strong></div>
                  <div><span>Route version</span><strong>{ROUTE_VERSION}</strong></div>
                  <div><span>Signing policy</span><strong>TA14 Demonstration 1.0</strong></div>
                </div>
              </article>
            </div>

            <article className="ea-panel ea-margin-top">
              <span className="ea-panel-label">Package component inventory</span>
              <div className="ea-component-grid">
                {packageComponents.map((component) => (
                  <div key={component.id}>
                    <span>{component.id}</span>
                    <strong>{component.name}</strong>
                    <small>{component.format} · {component.disclosure}</small>
                    <p>{component.purpose}</p>
                    <code>{component.digest}</code>
                  </div>
                ))}
              </div>
            </article>

            <div className="ea-download-grid ea-margin-top">
              <button type="button" onClick={exportJson}><span>JSON</span><strong>Canonical record</strong><small>Machine-readable frozen graph</small></button>
              <button type="button" onClick={exportManifest}><span>HASH</span><strong>Integrity manifest</strong><small>Package and component digests</small></button>
              <button type="button" onClick={exportReceipt}><span>202</span><strong>Execution receipt</strong><small>Technical release proof</small></button>
              <button type="button" onClick={exportOutcome}><span>OUT</span><strong>Outcome record</strong><small>Observed bounded result</small></button>
              <button type="button" onClick={exportVerificationGuide}><span>TXT</span><strong>Verification guide</strong><small>Online and offline procedure</small></button>
            </div>
          </section>
        )}

        {view === "verify" && (
          <section className="ea-view">
            <SectionHeading
              eyebrow="Public verification center"
              title="Verify identity, parity, execution effect, and outcome closure"
              text="The verification sequence does not ask the visitor to trust the page. It exposes the expected checks and the bounded conclusion each level can support."
            />
            <div className="ea-verifier">
              <div className="ea-verifier-core">
                <span className="ea-panel-label">Artifact verifier</span>
                <div className={`ea-verifier-status ${verificationState.toLowerCase()}`}>
                  <strong>{verificationState === "IDLE" ? "READY" : verificationState}</strong>
                  <span>{verificationState === "VERIFIED" ? "All represented checks passed" : verificationState === "RUNNING" ? `Verification ${verificationProgress}%` : "Awaiting verification run"}</span>
                </div>
                <Meter value={verificationState === "VERIFIED" ? 100 : verificationProgress} label="Verification progress" />
                <button type="button" className="ea-primary ea-wide" onClick={runVerification} disabled={verificationState === "RUNNING"}>
                  {verificationState === "RUNNING" ? "Verifying…" : verificationState === "VERIFIED" ? "Run verification again" : "Run verification"}
                </button>
                <p className="ea-verifier-note">This browser demonstration represents the verification workflow. Independent offline verification requires the downloaded package components.</p>
              </div>
              <div className="ea-verification-list">
                {verificationChecks.map((check) => (
                  <article key={check.level} className={verificationState === "VERIFIED" ? "verified" : ""}>
                    <span>{check.level}</span>
                    <div><strong>{check.label}</strong><p>{check.detail}</p></div>
                    <b>{verificationState === "VERIFIED" ? "PASS" : "PENDING"}</b>
                  </article>
                ))}
              </div>
            </div>
            <article className="ea-panel ea-margin-top">
              <span className="ea-panel-label">Acceptance tests</span>
              <div className="ea-test-grid">
                {acceptanceTests.map((test) => (
                  <div key={test.id}><span>{test.id}</span><p>{test.condition}</p><Badge tone="pass">{test.result}</Badge></div>
                ))}
              </div>
            </article>
          </section>
        )}

        {view === "challenge" && (
          <section className="ea-view">
            <SectionHeading
              eyebrow="Challenge and correction"
              title="Challenge the bounded record without erasing the original event"
              text="A material challenge can dispute evidence, authority, route logic, execution effect, outcome, integrity, disclosure, or claims boundaries. Corrections append; they do not rewrite history."
            />
            <div className="ea-two-column">
              <article className="ea-panel">
                <span className="ea-panel-label">Current public status</span>
                <h3>PUBLISHED · No open material challenge</h3>
                <p>The original event, hashes, exports, and public claim remain visible if a later challenge, correction, supersession, or withdrawal is appended.</p>
                <div className="ea-record-grid compact">
                  <div><span>Challenge status</span><strong>NONE OPEN</strong></div>
                  <div><span>Correction count</span><strong>0</strong></div>
                  <div><span>Supersession</span><strong>NONE</strong></div>
                  <div><span>Withdrawal</span><strong>NO</strong></div>
                </div>
              </article>
              <article className="ea-panel">
                <span className="ea-panel-label">Draft a bounded challenge</span>
                <textarea value={challengeText} onChange={(event) => setChallengeText(event.target.value)} placeholder="Identify the exact record, claim, evidence item, gate, receipt, outcome, or integrity assertion being challenged…" />
                <div className="ea-challenge-actions">
                  <button type="button" className="ea-primary" onClick={saveChallenge}>Save local draft</button>
                  <button type="button" className="ea-secondary" onClick={() => setChallengeText("")}>Clear</button>
                  {challengeSaved && <Badge tone="verified">Draft saved locally</Badge>}
                </div>
                <p className="ea-verifier-note">Saving here creates a local browser draft only. It does not submit a public challenge.</p>
              </article>
            </div>
          </section>
        )}
      </div>

      <section className="ea-next">
        <div><span>Founding artifact series</span><h2>Continue inspecting governed execution behavior.</h2><p>Artifact 000010 proves that separation of duties can govern a successful execution: two independent authorities concurred on the exact bounded restoration before commit, the adapter enforced the approved privilege set, and the outcome was independently verified.</p></div>
        <div className="ea-next-actions"><Link href="/artifacts/ta14-ea-000009">Previous artifact →</Link><Link href="/artifacts/ta14-ea-000011">Next artifact →</Link></div>
      </section>

      <footer className="ea-footer">
        <div><strong>TA-14 Authority</strong><span>Governance Institution · Eighth major door</span></div>
        <p>No admissible evidence. No admissible execution.</p>
        <div><Link href="/">Exchange</Link><Link href="/artifacts">Artifacts</Link><Link href="/workspace/artifacts/build">Artifact Studio</Link></div>
      </footer>

      <style jsx>{`

        :global(*) { box-sizing: border-box; }
        :global(html) { scroll-behavior: smooth; }
        :global(body) { margin: 0; background: #050811; color: #f4f7ff; }
        :global(button), :global(input), :global(textarea) { font: inherit; }
        :global(a) { color: inherit; }
        .ea-page { --bg: #050811; --panel: rgba(10, 17, 34, .82); --line: rgba(132, 165, 255, .18); --muted: #9ba7bf; --text: #f5f8ff; --cyan: #63e6ff; --blue: #6f8dff; --green: #67f5b5; --gold: #f6cf70; position: relative; min-height: 100vh; overflow: hidden; background: radial-gradient(circle at 72% 12%, rgba(65,105,225,.18), transparent 34%), radial-gradient(circle at 18% 28%, rgba(0,207,255,.09), transparent 28%), linear-gradient(180deg,#050811 0%,#07101f 48%,#050811 100%); font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
        .ea-ambient { position: fixed; inset: 0; z-index: 0; pointer-events: none; overflow: hidden; }
        .ea-orb { position: absolute; border-radius: 999px; filter: blur(70px); opacity: .34; }
        .ea-orb-one { width: 420px; height: 420px; right: -120px; top: 8%; background: #3759ff; }
        .ea-orb-two { width: 360px; height: 360px; left: -150px; top: 45%; background: #00bde7; opacity: .2; }
        .ea-grid { position: absolute; inset: 0; background-image: linear-gradient(rgba(129,153,220,.045) 1px, transparent 1px), linear-gradient(90deg,rgba(129,153,220,.045) 1px, transparent 1px); background-size: 48px 48px; mask-image: linear-gradient(to bottom,rgba(0,0,0,.7),transparent 92%); }
        .ea-scan { position: absolute; left: 0; right: 0; height: 1px; top: 26%; background: linear-gradient(90deg,transparent,rgba(99,230,255,.55),transparent); box-shadow: 0 0 32px rgba(99,230,255,.45); animation: scan 9s linear infinite; }
        .ea-topbar,.ea-hero,.ea-stats,.ea-nav,.ea-workspace,.ea-next,.ea-footer { position: relative; z-index: 2; width: min(1500px, calc(100% - 40px)); margin-left: auto; margin-right: auto; }
        .ea-topbar { min-height: 78px; display: flex; align-items: center; justify-content: space-between; gap: 24px; border-bottom: 1px solid rgba(132,165,255,.14); }
        .ea-brand { display: inline-flex; align-items: center; gap: 13px; text-decoration: none; }
        .ea-brand-mark { width: 42px; height: 42px; display: grid; place-items: center; border: 1px solid rgba(99,230,255,.48); border-radius: 14px; color: var(--cyan); font-weight: 900; letter-spacing: -.04em; background: linear-gradient(145deg,rgba(99,230,255,.16),rgba(111,141,255,.06)); box-shadow: inset 0 1px rgba(255,255,255,.1),0 12px 35px rgba(0,0,0,.28); }
        .ea-brand strong,.ea-brand small { display: block; }
        .ea-brand strong { font-size: 14px; letter-spacing: .14em; }
        .ea-brand small { margin-top: 3px; color: var(--muted); font-size: 11px; }
        .ea-top-actions { display: flex; align-items: center; justify-content: flex-end; gap: 9px; flex-wrap: wrap; }
        .ea-badge { display: inline-flex; align-items: center; justify-content: center; min-height: 25px; padding: 5px 9px; border-radius: 999px; border: 1px solid rgba(159,178,226,.2); background: rgba(255,255,255,.035); color: #c9d3e9; font-size: 10px; font-weight: 900; letter-spacing: .08em; text-transform: uppercase; }
        .ea-badge-allow,.ea-badge-pass,.ea-badge-admitted,.ea-badge-verified,.ea-badge-published { color: #8dffd0; border-color: rgba(103,245,181,.3); background: rgba(103,245,181,.08); }
        .ea-link-button,.ea-primary,.ea-secondary { border: 0; cursor: pointer; text-decoration: none; transition: transform .2s ease,border-color .2s ease,background .2s ease,box-shadow .2s ease; }
        .ea-link-button { padding: 9px 13px; border: 1px solid rgba(132,165,255,.2); border-radius: 11px; background: rgba(255,255,255,.035); color: #dce5f9; font-size: 12px; }
        .ea-link-button:hover,.ea-secondary:hover { transform: translateY(-2px); border-color: rgba(99,230,255,.5); }
        .ea-hero { display: grid; grid-template-columns: minmax(0,1.25fr) minmax(380px,.75fr); gap: 54px; align-items: center; padding: 88px 0 64px; }
        .ea-kicker { display: flex; align-items: center; gap: 11px; flex-wrap: wrap; margin-bottom: 20px; }
        .ea-kicker span { padding: 7px 10px; border-radius: 999px; background: linear-gradient(90deg,rgba(99,230,255,.14),rgba(111,141,255,.12)); border: 1px solid rgba(99,230,255,.24); color: var(--cyan); font-size: 10px; font-weight: 900; letter-spacing: .14em; text-transform: uppercase; }
        .ea-kicker b { color: #aeb9d0; font-size: 11px; letter-spacing: .12em; text-transform: uppercase; }
        .ea-hero h1 { margin: 0; max-width: 920px; font-size: clamp(54px,7vw,108px); line-height: .9; letter-spacing: -.065em; font-weight: 900; }
        .ea-hero h1 em { color: transparent; background: linear-gradient(90deg,#63e6ff,#8aa0ff 48%,#b67cff); -webkit-background-clip: text; background-clip: text; font-style: normal; }
        .ea-hero-lede { max-width: 820px; margin: 28px 0 0; color: #b4bfd4; font-size: 17px; line-height: 1.75; }
        .ea-hero-actions { display: flex; gap: 11px; flex-wrap: wrap; margin-top: 30px; }
        .ea-primary,.ea-secondary { min-height: 47px; padding: 0 18px; border-radius: 13px; font-weight: 850; }
        .ea-primary { color: #04101a; background: linear-gradient(135deg,#63e6ff,#7af2c0); box-shadow: 0 16px 40px rgba(52,211,255,.19); }
        .ea-primary:hover { transform: translateY(-2px); box-shadow: 0 20px 50px rgba(52,211,255,.28); }
        .ea-primary:disabled { cursor: wait; opacity: .68; }
        .ea-secondary { color: #eaf0ff; border: 1px solid rgba(132,165,255,.22); background: rgba(255,255,255,.04); }
        .ea-wide { width: 100%; }
        .ea-principle { display: flex; align-items: center; gap: 14px; margin-top: 30px; padding: 14px 17px; width: fit-content; max-width: 100%; border-left: 2px solid var(--cyan); background: linear-gradient(90deg,rgba(99,230,255,.075),transparent); }
        .ea-principle span { color: var(--muted); font-size: 10px; font-weight: 900; letter-spacing: .12em; text-transform: uppercase; }
        .ea-principle strong { font-size: 13px; }
        .ea-command-core { position: relative; padding: 26px; border: 1px solid rgba(132,165,255,.2); border-radius: 26px; background: linear-gradient(145deg,rgba(16,27,52,.94),rgba(7,13,27,.9)); box-shadow: inset 0 1px rgba(255,255,255,.08),0 35px 100px rgba(0,0,0,.42); overflow: hidden; }
        .ea-command-core::before { content:""; position:absolute; inset:0; background:linear-gradient(135deg,rgba(99,230,255,.08),transparent 42%,rgba(111,141,255,.08)); pointer-events:none; }
        .ea-command-ring { position: relative; width: 250px; aspect-ratio: 1; margin: 4px auto 24px; display: grid; place-items: center; border-radius: 50%; background: conic-gradient(from 210deg,#63e6ff,#7af2c0,#6f8dff,#63e6ff); box-shadow: 0 0 70px rgba(99,230,255,.18); }
        .ea-command-ring::before { content:""; position:absolute; inset:9px; border-radius:50%; background:#081020; border:1px solid rgba(255,255,255,.1); }
        .ea-command-ring div { position:relative; z-index:1; text-align:center; }
        .ea-command-ring span,.ea-command-ring small { display:block; color:#a9b5cb; }
        .ea-command-ring span { font-size:10px; letter-spacing:.14em; text-transform:uppercase; }
        .ea-command-ring strong { display:block; margin:7px 0; color:#8dffd0; font-size:47px; letter-spacing:-.055em; }
        .ea-command-ring small { font-size:11px; }
        .ea-command-grid { position:relative; display:grid; grid-template-columns:1fr 1fr; gap:10px; }
        .ea-command-grid div { padding:13px; border:1px solid rgba(132,165,255,.14); border-radius:13px; background:rgba(255,255,255,.025); }
        .ea-command-grid span,.ea-command-grid strong { display:block; }
        .ea-command-grid span { color:#8996ae; font-size:9px; letter-spacing:.1em; text-transform:uppercase; }
        .ea-command-grid strong { margin-top:5px; font-size:13px; }
        .ea-meter { position:relative; margin-top:18px; }
        .ea-meter-head { display:flex; align-items:center; justify-content:space-between; gap:12px; margin-bottom:8px; color:#a9b5cb; font-size:11px; }
        .ea-meter-head strong { color:#f4f7ff; }
        .ea-meter-track { height:8px; border-radius:999px; overflow:hidden; background:rgba(255,255,255,.06); border:1px solid rgba(132,165,255,.12); }
        .ea-meter-track span { display:block; height:100%; border-radius:inherit; background:linear-gradient(90deg,#63e6ff,#67f5b5); box-shadow:0 0 20px rgba(99,230,255,.4); transition:width .25s ease; }
        .ea-command-receipt { position:relative; margin-top:16px; padding:14px; border-radius:14px; border:1px solid rgba(103,245,181,.18); background:rgba(103,245,181,.055); }
        .ea-command-receipt span,.ea-command-receipt strong,.ea-command-receipt small { display:block; }
        .ea-command-receipt span { color:#95a4bc; font-size:9px; letter-spacing:.11em; text-transform:uppercase; }
        .ea-command-receipt strong { margin-top:5px; color:#8dffd0; font-size:14px; }
        .ea-command-receipt small { margin-top:5px; color:#9facbf; line-height:1.5; }
        .ea-stats { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; margin-bottom:20px; }
        .ea-stat { min-height:126px; padding:18px; border:1px solid rgba(132,165,255,.15); border-radius:18px; background:linear-gradient(145deg,rgba(12,21,41,.86),rgba(7,12,25,.82)); box-shadow:inset 0 1px rgba(255,255,255,.05); }
        .ea-stat span,.ea-stat strong { display:block; }
        .ea-stat span { color:#8e9ab0; font-size:9px; font-weight:900; letter-spacing:.12em; text-transform:uppercase; }
        .ea-stat strong { margin-top:11px; font-size:20px; letter-spacing:-.03em; }
        .ea-stat p { margin:8px 0 0; color:#8491a7; font-size:11px; line-height:1.5; overflow-wrap:anywhere; }
        .ea-nav { position:sticky; top:10px; z-index:8; display:grid; grid-template-columns:repeat(10,1fr); gap:6px; padding:7px; border:1px solid rgba(132,165,255,.17); border-radius:18px; background:rgba(6,11,23,.86); backdrop-filter:blur(18px); box-shadow:0 20px 55px rgba(0,0,0,.32); }
        .ea-nav button { min-height:62px; padding:9px 7px; border:1px solid transparent; border-radius:12px; background:transparent; color:#8f9ab0; cursor:pointer; transition:.2s ease; }
        .ea-nav button:hover,.ea-nav button.active { color:#f7f9ff; border-color:rgba(99,230,255,.22); background:linear-gradient(145deg,rgba(99,230,255,.09),rgba(111,141,255,.07)); transform:translateY(-1px); }
        .ea-nav button span,.ea-nav button strong { display:block; }
        .ea-nav button span { color:var(--cyan); font-size:9px; letter-spacing:.12em; }
        .ea-nav button strong { margin-top:5px; font-size:10px; }
        .ea-workspace { scroll-margin-top:100px; padding:42px 0 80px; }
        .ea-view { animation:rise .4s ease both; }
        .ea-section-heading { max-width:920px; margin-bottom:26px; }
        .ea-section-heading > span { color:var(--cyan); font-size:10px; font-weight:900; letter-spacing:.15em; text-transform:uppercase; }
        .ea-section-heading h2 { margin:9px 0 0; font-size:clamp(32px,4vw,58px); line-height:1.02; letter-spacing:-.05em; }
        .ea-section-heading p { margin:15px 0 0; color:#aab5ca; font-size:15px; line-height:1.7; }
        .ea-inspection-grid { display:grid; grid-template-columns:1.25fr .75fr; gap:14px; }
        .ea-panel { position:relative; padding:24px; border:1px solid rgba(132,165,255,.16); border-radius:20px; background:linear-gradient(145deg,rgba(13,23,45,.9),rgba(7,13,27,.86)); box-shadow:inset 0 1px rgba(255,255,255,.05),0 22px 60px rgba(0,0,0,.22); overflow:hidden; }
        .ea-panel::before { content:""; position:absolute; inset:0; pointer-events:none; background:linear-gradient(135deg,rgba(99,230,255,.045),transparent 35%); }
        .ea-panel-feature { min-height:330px; }
        .ea-panel-label { color:#7f8ca4; font-size:9px; font-weight:900; letter-spacing:.13em; text-transform:uppercase; }
        .ea-panel h3 { position:relative; margin:12px 0 0; font-size:23px; letter-spacing:-.035em; }
        .ea-panel p { position:relative; margin:13px 0 0; color:#aab4c7; line-height:1.7; }
        .ea-decision-panel { border-color:rgba(103,245,181,.22); background:linear-gradient(145deg,rgba(17,49,43,.62),rgba(7,17,26,.88)); }
        .ea-decision-word { margin-top:12px; color:#8dffd0; font-size:62px; font-weight:950; line-height:.95; letter-spacing:-.065em; }
        .ea-mini-grid,.ea-record-grid { position:relative; display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:20px; }
        .ea-mini-grid div,.ea-record-grid div { padding:12px; border:1px solid rgba(132,165,255,.12); border-radius:12px; background:rgba(255,255,255,.025); }
        .ea-mini-grid span,.ea-mini-grid strong,.ea-record-grid span,.ea-record-grid strong,.ea-record-grid code { display:block; }
        .ea-mini-grid span,.ea-record-grid span { color:#7f8ca4; font-size:9px; letter-spacing:.1em; text-transform:uppercase; }
        .ea-mini-grid strong,.ea-record-grid strong,.ea-record-grid code { margin-top:6px; color:#eef3ff; font-size:11px; line-height:1.5; overflow-wrap:anywhere; }
        .ea-record-grid code { color:#9ceaff; }
        .ea-record-grid.compact { margin-top:15px; }
        .ea-two-column { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
        .ea-margin-top { margin-top:14px; }
        .ea-proof-panel { border-color:rgba(103,245,181,.2); }
        .ea-limit-panel { border-color:rgba(246,207,112,.19); }
        .ea-checkline,.ea-limitline { padding:10px 0; border-bottom:1px solid rgba(132,165,255,.1); }
        .ea-checkline { color:#bfffe2!important; }
        .ea-limitline { color:#e5d2a7!important; }
        .ea-chain-line { position:relative; display:grid; gap:13px; }
        .ea-chain-line::before { content:""; position:absolute; left:27px; top:30px; bottom:30px; width:1px; background:linear-gradient(#63e6ff,#6f8dff,#67f5b5); opacity:.45; }
        .ea-chain-card { position:relative; display:grid; grid-template-columns:56px 190px minmax(190px,.65fr) minmax(260px,1fr) minmax(260px,1fr); gap:17px; align-items:start; padding:20px; border:1px solid rgba(132,165,255,.15); border-radius:18px; background:linear-gradient(145deg,rgba(12,22,42,.88),rgba(7,13,26,.84)); }
        .ea-chain-number { position:relative; z-index:1; width:42px; height:42px; display:grid; place-items:center; border-radius:13px; border:1px solid rgba(99,230,255,.36); background:#081326; color:var(--cyan); font-weight:900; }
        .ea-chain-head { display:flex; align-items:flex-start; justify-content:space-between; gap:8px; }
        .ea-chain-head h3 { margin:6px 0 0; font-size:19px; }
        .ea-question { color:#cfd7e8; font-size:12px; line-height:1.55; font-weight:750; }
        .ea-chain-card > p { margin:0; color:#a6b1c5; line-height:1.6; font-size:12px; }
        .ea-proof { padding-left:15px; border-left:1px solid rgba(103,245,181,.25); }
        .ea-proof strong { color:#8dffd0; font-size:9px; letter-spacing:.11em; text-transform:uppercase; }
        .ea-proof p { margin:7px 0 0; color:#9facbf; font-size:11px; line-height:1.55; }
        .ea-runtime-layout,.ea-evidence-layout { display:grid; grid-template-columns:minmax(340px,.68fr) minmax(0,1.32fr); gap:15px; align-items:start; }
        .ea-gate-list,.ea-evidence-list { display:grid; gap:7px; max-height:740px; overflow:auto; padding-right:5px; }
        .ea-gate-list button { display:grid; grid-template-columns:36px 1fr auto; gap:11px; align-items:center; text-align:left; padding:11px; border:1px solid rgba(132,165,255,.12); border-radius:13px; background:rgba(255,255,255,.02); color:#dce4f4; cursor:pointer; }
        .ea-gate-list button:hover,.ea-gate-list button.active { border-color:rgba(99,230,255,.35); background:rgba(99,230,255,.07); }
        .ea-gate-list button > span { width:32px; height:32px; display:grid; place-items:center; border-radius:9px; background:rgba(99,230,255,.08); color:var(--cyan); font-size:10px; font-weight:900; }
        .ea-gate-list button strong,.ea-gate-list button small { display:block; }
        .ea-gate-list button strong { font-size:11px; }
        .ea-gate-list button small { margin-top:3px; color:#7f8ca4; font-size:9px; }
        .ea-gate-inspector,.ea-evidence-detail { position:sticky; top:96px; min-height:420px; padding:28px; border:1px solid rgba(132,165,255,.18); border-radius:22px; background:linear-gradient(145deg,rgba(15,26,51,.94),rgba(7,13,27,.92)); box-shadow:0 30px 80px rgba(0,0,0,.28); }
        .ea-gate-inspector h3,.ea-evidence-detail h3 { margin:12px 0 0; font-size:32px; letter-spacing:-.045em; }
        .ea-gate-inspector > p { color:#b0bbce; line-height:1.7; }
        .ea-gate-meta { display:grid; grid-template-columns:repeat(3,1fr); gap:9px; margin:22px 0; }
        .ea-gate-meta div { padding:13px; border:1px solid rgba(132,165,255,.13); border-radius:12px; background:rgba(255,255,255,.025); }
        .ea-gate-meta span,.ea-gate-meta strong { display:block; }
        .ea-gate-meta span { color:#7f8ca4; font-size:9px; text-transform:uppercase; letter-spacing:.1em; }
        .ea-gate-meta strong { margin-top:6px; font-size:11px; overflow-wrap:anywhere; }
        .ea-gate-rule { margin-top:22px; padding:18px; border-left:2px solid var(--cyan); background:rgba(99,230,255,.05); }
        .ea-gate-rule strong { color:#bdf4ff; }
        .ea-gate-rule p { margin:7px 0 0; color:#9eabc0; line-height:1.65; }
        .ea-evidence-list button { display:block; text-align:left; padding:13px; border:1px solid rgba(132,165,255,.12); border-radius:13px; background:rgba(255,255,255,.02); color:#e5ebf8; cursor:pointer; }
        .ea-evidence-list button:hover,.ea-evidence-list button.active { border-color:rgba(99,230,255,.35); background:rgba(99,230,255,.07); transform:translateX(2px); }
        .ea-evidence-list span,.ea-evidence-list strong,.ea-evidence-list small { display:block; }
        .ea-evidence-list span { color:#63e6ff; font-size:9px; letter-spacing:.08em; }
        .ea-evidence-list strong { margin-top:5px; font-size:11px; }
        .ea-evidence-list small { margin-top:5px; color:#7e8aa1; font-size:9px; }
        .ea-evidence-top { display:flex; align-items:flex-start; justify-content:space-between; gap:16px; }
        .ea-support-limit { display:grid; grid-template-columns:1fr 1fr; gap:11px; margin-top:18px; }
        .ea-support-limit div { padding:16px; border:1px solid rgba(132,165,255,.13); border-radius:14px; background:rgba(255,255,255,.025); }
        .ea-support-limit span { color:#7f8ca4; font-size:9px; font-weight:900; text-transform:uppercase; letter-spacing:.1em; }
        .ea-support-limit p { margin:8px 0 0; color:#aab5c9; line-height:1.65; }
        .ea-authority-card { min-height:360px; }
        .ea-rule-grid { display:grid; grid-template-columns:repeat(5,1fr); gap:10px; margin-top:18px; }
        .ea-rule-grid div { padding:16px; border:1px solid rgba(132,165,255,.12); border-radius:14px; background:rgba(255,255,255,.025); }
        .ea-rule-grid span { color:var(--cyan); font-size:10px; font-weight:900; }
        .ea-rule-grid p { margin:10px 0 0; color:#a6b1c4; font-size:11px; line-height:1.6; }
        .ea-control-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:11px; }
        .ea-control-card { min-height:220px; padding:18px; border:1px solid rgba(132,165,255,.14); border-radius:17px; background:linear-gradient(145deg,rgba(12,22,42,.87),rgba(7,13,26,.84)); }
        .ea-control-head { display:flex; align-items:center; justify-content:space-between; gap:10px; }
        .ea-control-head > span { color:#6f7d96; font-size:9px; letter-spacing:.08em; }
        .ea-control-card h3 { margin:16px 0 0; font-size:17px; }
        .ea-control-card > strong { display:block; margin-top:9px; color:#bfffe2; font-size:12px; line-height:1.5; }
        .ea-control-card p { margin:12px 0 0; color:#8f9bb0; font-size:11px; line-height:1.6; }
        .ea-receipt { display:grid; grid-template-columns:100px 1fr auto; gap:20px; align-items:center; padding:24px; border:1px solid rgba(103,245,181,.22); border-radius:22px; background:linear-gradient(135deg,rgba(24,67,55,.5),rgba(8,17,28,.9)); }
        .ea-receipt-mark { width:82px;height:82px;display:grid;place-items:center;border-radius:20px;background:rgba(103,245,181,.11);border:1px solid rgba(103,245,181,.28);color:#8dffd0;font-size:28px;font-weight:950; }
        .ea-receipt h3 { margin:8px 0 0; font-size:25px; }
        .ea-receipt p { margin:8px 0 0; color:#a9b5c7; }
        .ea-receipt button { min-height:42px; padding:0 16px; border:1px solid rgba(103,245,181,.25); border-radius:12px; background:rgba(103,245,181,.08); color:#bfffe2; cursor:pointer; }
        .ea-outcome-hero { display:grid; grid-template-columns:92px 1fr auto; gap:20px; align-items:center; padding:27px; border:1px solid rgba(103,245,181,.22); border-radius:24px; background:linear-gradient(135deg,rgba(25,72,58,.5),rgba(7,16,27,.9)); }
        .ea-outcome-icon { width:76px;height:76px;display:grid;place-items:center;border-radius:50%;background:linear-gradient(145deg,#67f5b5,#63e6ff);color:#051018;font-size:36px;font-weight:950;box-shadow:0 0 45px rgba(103,245,181,.22); }
        .ea-outcome-hero span { color:#8da0af;font-size:9px;letter-spacing:.12em;text-transform:uppercase; }
        .ea-outcome-hero h3 { margin:7px 0 0;font-size:28px; }
        .ea-outcome-hero p { margin:8px 0 0;color:#aab5c8;line-height:1.6; }
        .ea-timeline { position:relative; display:grid; gap:9px; margin-top:18px; }
        .ea-timeline::before { content:"";position:absolute;left:31px;top:25px;bottom:25px;width:1px;background:linear-gradient(#63e6ff,#6f8dff,#67f5b5);opacity:.35; }
        .ea-timeline article { position:relative;display:grid;grid-template-columns:64px 120px 1fr auto;gap:14px;align-items:start;padding:15px;border:1px solid rgba(132,165,255,.12);border-radius:15px;background:rgba(255,255,255,.02); }
        .ea-timeline-index { position:relative;z-index:1;width:34px;height:34px;display:grid;place-items:center;border-radius:10px;background:#081427;border:1px solid rgba(99,230,255,.3);color:var(--cyan);font-size:10px;font-weight:900; }
        .ea-timeline time { padding-top:9px;color:#8694ac;font-size:10px; }
        .ea-timeline strong { display:block;padding-top:6px;font-size:12px; }
        .ea-timeline p { margin:5px 0 0;color:#8f9bb0;font-size:11px;line-height:1.55; }
        .ea-integrity-grid { display:grid;grid-template-columns:1.3fr .7fr;gap:14px; }
        .ea-hash-row { display:grid;grid-template-columns:130px 1fr auto;gap:12px;align-items:center;padding:12px 0;border-bottom:1px solid rgba(132,165,255,.1); }
        .ea-hash-row span { color:#8a97ad;font-size:10px; }
        .ea-hash-row code { color:#9ceaff;font-size:10px;overflow-wrap:anywhere; }
        .ea-hash-row button { min-height:31px;padding:0 11px;border:1px solid rgba(132,165,255,.17);border-radius:9px;background:rgba(255,255,255,.03);color:#d7e0f1;cursor:pointer;font-size:10px; }

        .ea-component-grid { display:grid;grid-template-columns:repeat(4,1fr);gap:9px;margin-top:18px; }
        .ea-component-grid > div { min-height:190px;padding:15px;border:1px solid rgba(132,165,255,.12);border-radius:14px;background:rgba(255,255,255,.022); }
        .ea-component-grid span,.ea-component-grid strong,.ea-component-grid small,.ea-component-grid code { display:block; }
        .ea-component-grid span { color:var(--cyan);font-size:9px;font-weight:900;letter-spacing:.08em; }
        .ea-component-grid strong { margin-top:10px;font-size:12px;line-height:1.45; }
        .ea-component-grid small { margin-top:6px;color:#7f8ca4;font-size:9px; }
        .ea-component-grid p { margin:13px 0 0;color:#95a1b6;font-size:10px;line-height:1.55; }
        .ea-component-grid code { margin-top:13px;color:#91dff0;font-size:9px;overflow-wrap:anywhere; }
        .ea-download-grid { display:grid;grid-template-columns:repeat(5,1fr);gap:10px; }
        .ea-download-grid button { min-height:145px;padding:17px;text-align:left;border:1px solid rgba(132,165,255,.14);border-radius:16px;background:linear-gradient(145deg,rgba(12,22,42,.86),rgba(7,13,26,.84));color:#edf3ff;cursor:pointer;transition:.2s ease; }
        .ea-download-grid button:hover { transform:translateY(-3px);border-color:rgba(99,230,255,.35); }
        .ea-download-grid span,.ea-download-grid strong,.ea-download-grid small { display:block; }
        .ea-download-grid span { color:var(--cyan);font-size:10px;font-weight:900; }
        .ea-download-grid strong { margin-top:20px;font-size:14px; }
        .ea-download-grid small { margin-top:8px;color:#8491a8;line-height:1.5; }
        .ea-verifier { display:grid;grid-template-columns:minmax(320px,.65fr) minmax(0,1.35fr);gap:14px; }
        .ea-verifier-core { padding:26px;border:1px solid rgba(132,165,255,.18);border-radius:22px;background:linear-gradient(145deg,rgba(15,26,51,.94),rgba(7,13,27,.92)); }
        .ea-verifier-status { display:grid;place-items:center;min-height:190px;margin:18px 0;border-radius:20px;border:1px solid rgba(132,165,255,.15);background:radial-gradient(circle,rgba(111,141,255,.15),transparent 66%);text-align:center; }
        .ea-verifier-status strong { display:block;font-size:34px;letter-spacing:-.04em; }
        .ea-verifier-status span { display:block;margin-top:8px;color:#8e9ab0;font-size:11px; }
        .ea-verifier-status.verified { border-color:rgba(103,245,181,.28);background:radial-gradient(circle,rgba(103,245,181,.18),transparent 66%); }
        .ea-verifier-status.verified strong { color:#8dffd0; }
        .ea-verifier-note { color:#7f8ca3!important;font-size:10px!important;line-height:1.6!important; }
        .ea-verification-list { display:grid;gap:8px; }
        .ea-verification-list article { display:grid;grid-template-columns:48px 1fr auto;gap:13px;align-items:start;padding:15px;border:1px solid rgba(132,165,255,.12);border-radius:14px;background:rgba(255,255,255,.02); }
        .ea-verification-list article > span { width:38px;height:38px;display:grid;place-items:center;border-radius:11px;background:rgba(111,141,255,.1);color:#9fb0ff;font-weight:900; }
        .ea-verification-list strong { font-size:12px; }
        .ea-verification-list p { margin:5px 0 0;color:#8d99ae;font-size:11px;line-height:1.55; }
        .ea-verification-list b { color:#7f8ca3;font-size:9px;letter-spacing:.1em; }
        .ea-verification-list article.verified { border-color:rgba(103,245,181,.2); }
        .ea-verification-list article.verified b { color:#8dffd0; }
        .ea-test-grid { display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:18px; }
        .ea-test-grid > div { display:grid;grid-template-columns:58px 1fr auto;gap:10px;align-items:center;padding:11px;border:1px solid rgba(132,165,255,.11);border-radius:11px;background:rgba(255,255,255,.02); }
        .ea-test-grid > div > span { color:var(--cyan);font-size:9px;font-weight:900; }
        .ea-test-grid p { margin:0;color:#9ba7bb;font-size:10px;line-height:1.5; }
        textarea { width:100%;min-height:210px;margin-top:16px;padding:16px;border:1px solid rgba(132,165,255,.18);border-radius:14px;resize:vertical;background:rgba(3,8,18,.72);color:#eef4ff;outline:none;line-height:1.65; }
        textarea:focus { border-color:rgba(99,230,255,.48);box-shadow:0 0 0 3px rgba(99,230,255,.07); }
        .ea-challenge-actions { display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-top:11px; }
        .ea-next { display:grid;grid-template-columns:1fr auto;gap:30px;align-items:center;margin-bottom:30px;padding:32px;border:1px solid rgba(132,165,255,.17);border-radius:24px;background:linear-gradient(135deg,rgba(18,32,62,.92),rgba(8,15,29,.9)); }
        .ea-next span { color:var(--cyan);font-size:9px;font-weight:900;letter-spacing:.13em;text-transform:uppercase; }
        .ea-next h2 { margin:9px 0 0;font-size:32px;letter-spacing:-.045em; }
        .ea-next p { margin:10px 0 0;max-width:760px;color:#9facbf;line-height:1.65; }
        .ea-next-actions { display:flex;gap:9px;flex-wrap:wrap;justify-content:flex-end; }
        .ea-next-actions a { padding:13px 16px;border:1px solid rgba(132,165,255,.2);border-radius:12px;background:rgba(255,255,255,.035);text-decoration:none;font-size:12px;font-weight:800; }
        .ea-next-actions a:first-child { color:#041018;background:linear-gradient(135deg,#63e6ff,#67f5b5);border:0; }
        .ea-footer { min-height:120px;display:grid;grid-template-columns:1fr auto 1fr;gap:24px;align-items:center;border-top:1px solid rgba(132,165,255,.13); }
        .ea-footer strong,.ea-footer span { display:block; }
        .ea-footer strong { font-size:12px;letter-spacing:.12em;text-transform:uppercase; }
        .ea-footer span { margin-top:5px;color:#7f8ca3;font-size:10px; }
        .ea-footer p { color:#b9c5d8;font-size:11px;text-align:center; }
        .ea-footer > div:last-child { display:flex;gap:14px;justify-content:flex-end; }
        .ea-footer a { color:#8d9ab1;text-decoration:none;font-size:11px; }
        .ea-footer a:hover { color:var(--cyan); }
        @keyframes scan { 0% { transform:translateY(-30vh);opacity:0; } 10% { opacity:1; } 90% { opacity:.5; } 100% { transform:translateY(110vh);opacity:0; } }
        @keyframes rise { from { opacity:0;transform:translateY(12px); } to { opacity:1;transform:translateY(0); } }
        @media (max-width:1200px) {
          .ea-hero { grid-template-columns:1fr; }
          .ea-command-core { max-width:720px; }
          .ea-nav { grid-template-columns:repeat(5,1fr); }
          .ea-chain-card { grid-template-columns:56px 160px 1fr; }
          .ea-chain-card > p,.ea-proof { grid-column:3; }
          .ea-control-grid { grid-template-columns:repeat(3,1fr); }
          .ea-rule-grid { grid-template-columns:repeat(3,1fr); }
  
        .ea-component-grid { display:grid;grid-template-columns:repeat(4,1fr);gap:9px;margin-top:18px; }
        .ea-component-grid > div { min-height:190px;padding:15px;border:1px solid rgba(132,165,255,.12);border-radius:14px;background:rgba(255,255,255,.022); }
        .ea-component-grid span,.ea-component-grid strong,.ea-component-grid small,.ea-component-grid code { display:block; }
        .ea-component-grid span { color:var(--cyan);font-size:9px;font-weight:900;letter-spacing:.08em; }
        .ea-component-grid strong { margin-top:10px;font-size:12px;line-height:1.45; }
        .ea-component-grid small { margin-top:6px;color:#7f8ca4;font-size:9px; }
        .ea-component-grid p { margin:13px 0 0;color:#95a1b6;font-size:10px;line-height:1.55; }
        .ea-component-grid code { margin-top:13px;color:#91dff0;font-size:9px;overflow-wrap:anywhere; }
        .ea-download-grid { grid-template-columns:repeat(3,1fr); }
        }
        @media (max-width:900px) {
          .ea-topbar,.ea-hero,.ea-stats,.ea-nav,.ea-workspace,.ea-next,.ea-footer { width:min(100% - 24px,1500px); }
          .ea-topbar { align-items:flex-start;padding:15px 0; }
          .ea-top-actions { max-width:50%; }
          .ea-hero { padding:58px 0 42px; }
          .ea-hero h1 { font-size:clamp(48px,12vw,78px); }
          .ea-stats { grid-template-columns:1fr 1fr; }
          .ea-inspection-grid,.ea-two-column,.ea-runtime-layout,.ea-evidence-layout,.ea-integrity-grid,.ea-verifier { grid-template-columns:1fr; }
          .ea-gate-inspector,.ea-evidence-detail { position:relative;top:auto; }
          .ea-control-grid { grid-template-columns:1fr 1fr; }
          .ea-chain-card { grid-template-columns:52px 1fr; }
          .ea-chain-card .ea-question,.ea-chain-card > p,.ea-chain-card .ea-proof { grid-column:2; }
          .ea-rule-grid { grid-template-columns:1fr 1fr; }
          .ea-receipt,.ea-outcome-hero { grid-template-columns:84px 1fr; }
          .ea-receipt button,.ea-outcome-hero .ea-badge { grid-column:2;justify-self:start; }
          .ea-timeline article { grid-template-columns:52px 105px 1fr; }
          .ea-timeline article .ea-badge { grid-column:3;justify-self:start; }
          .ea-next { grid-template-columns:1fr; }
          .ea-next-actions { justify-content:flex-start; }
          .ea-footer { grid-template-columns:1fr;text-align:center;padding:28px 0; }
          .ea-footer > div:last-child { justify-content:center; }
        }
        @media (max-width:620px) {
          .ea-top-actions .ea-badge { display:none; }
          .ea-top-actions { max-width:none; }
          .ea-hero h1 { font-size:46px; }
          .ea-hero-lede { font-size:14px; }
          .ea-command-core { padding:18px; }
          .ea-command-ring { width:210px; }
          .ea-stats { grid-template-columns:1fr; }
          .ea-nav { position:relative;top:auto;display:flex;overflow-x:auto; }
          .ea-nav button { min-width:120px; }
          .ea-panel { padding:18px; }
          .ea-mini-grid,.ea-record-grid,.ea-support-limit,.ea-gate-meta,.ea-rule-grid,.ea-control-grid,.ea-component-grid,.ea-download-grid,.ea-test-grid { grid-template-columns:1fr; }
          .ea-chain-card { grid-template-columns:44px 1fr;padding:15px; }
          .ea-chain-line::before { left:21px; }
          .ea-chain-number { width:34px;height:34px;border-radius:10px; }
          .ea-runtime-layout,.ea-evidence-layout { display:block; }
          .ea-gate-list,.ea-evidence-list { max-height:none;margin-bottom:14px; }
          .ea-receipt,.ea-outcome-hero { grid-template-columns:1fr; }
          .ea-receipt button,.ea-outcome-hero .ea-badge { grid-column:1; }
          .ea-timeline article { grid-template-columns:42px 1fr; }
          .ea-timeline time,.ea-timeline article > div:nth-child(3),.ea-timeline article .ea-badge { grid-column:2; }
          .ea-hash-row { grid-template-columns:1fr; }
          .ea-verification-list article { grid-template-columns:44px 1fr; }
          .ea-verification-list b { grid-column:2; }
        }

      `}</style>
    </main>
  );
}
