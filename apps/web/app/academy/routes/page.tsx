"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type ReactNode } from "react";

type RouteState = "ALLOW" | "HOLD" | "DENY" | "ESCALATE";
type AnchorStatus = "supported" | "limited" | "failed";

type RouteExample = {
  id: string;
  title: string;
  domain: string;
  consequence: string;
  state: RouteState;
  summary: string;
  failure?: string;
  repair: string;
  lesson: string;
  anchors: Array<{
    label: string;
    value: string;
    status: AnchorStatus;
  }>;
};

type ReadingProtocolStep = {
  id: string;
  number: string;
  title: string;
  question: string;
  evidence: string;
  stopCondition: string;
};

type FailurePattern = {
  id: string;
  chainLink: string;
  title: string;
  signal: string;
  consequence: string;
  repair: string;
  severity: "warning" | "blocking" | "critical";
};

type GlossaryEntry = {
  term: string;
  definition: string;
  readingUse: string;
};

type ReviewQuestion = {
  id: string;
  category: string;
  question: string;
  expectedReading: string;
};

type SavedProgress = {
  version: "2.0";
  completed: string[];
  notes: Record<string, string>;
  updatedAt: string;
};

const STORAGE_KEY = "ta14-academy-route-reading-center-v2";

const routeExamples: RouteExample[] = [
  {
    id: "allow",
    title: "Bounded equipment restart",
    domain: "Facilities operations",
    consequence: "Restore one air-handling unit after a verified protective trip.",
    state: "ALLOW",
    summary:
      "Current evidence, valid authority, preserved continuity, and a bounded execution plan support one controlled restart with post-action verification.",
    repair: "No repair is required. The route must still preserve outcome evidence after the restart.",
    lesson: "ALLOW is permission for the exact committed action only. It is never a general authorization.",
    anchors: [
      { label: "Reality", value: "Protective trip occurred; no active fault remains.", status: "supported" },
      { label: "Record", value: "Timestamped controller history and technician measurements preserved.", status: "supported" },
      { label: "Continuity", value: "No material condition changed after inspection.", status: "supported" },
      { label: "Admissibility", value: "Evidence is current and sufficient for one restart decision.", status: "supported" },
      { label: "Binding", value: "Authorized facilities supervisor approved the bounded action.", status: "supported" },
      { label: "Commit", value: "Decision version and operating limits recorded before execution.", status: "supported" },
      { label: "Execution", value: "One restart only; no parameter changes permitted.", status: "supported" },
      { label: "Outcome", value: "Stable operation must be verified and preserved for 20 minutes.", status: "supported" },
    ],
  },
  {
    id: "hold",
    title: "Automated account suspension",
    domain: "Identity governance",
    consequence: "Suspend a user account based on an anomaly alert.",
    state: "HOLD",
    summary:
      "The alert is relevant, but the evidence is stale and the current authority boundary is incomplete. Execution must pause until the gaps are resolved.",
    failure: "Continuity is the earliest failed condition: the present identity state was not revalidated.",
    repair: "Refresh the identity state, establish current suspension authority, and rerun dependent gates.",
    lesson: "HOLD preserves the route while repair remains possible. It is not a soft approval.",
    anchors: [
      { label: "Reality", value: "Anomaly alert indicates unusual access behavior.", status: "supported" },
      { label: "Record", value: "Alert and source events are attributable.", status: "supported" },
      { label: "Continuity", value: "Latest identity state was not revalidated.", status: "failed" },
      { label: "Admissibility", value: "Evidence may no longer describe the present condition.", status: "limited" },
      { label: "Binding", value: "System role permits review but not automatic suspension.", status: "failed" },
      { label: "Commit", value: "No valid decision may be committed yet.", status: "limited" },
      { label: "Execution", value: "Suspension is blocked pending revalidation.", status: "failed" },
      { label: "Outcome", value: "No consequence is allowed to bind while held.", status: "supported" },
    ],
  },
  {
    id: "deny",
    title: "Unsupported reimbursement approval",
    domain: "Financial operations",
    consequence: "Release a reimbursement without required source documentation.",
    state: "DENY",
    summary:
      "The required evidence does not exist, and policy does not authorize a substitute. The requested execution is outside the admissible boundary.",
    failure: "Record is the earliest failed condition: the mandatory source evidence is absent.",
    repair: "A new request may be initiated only when the required source documentation exists and can be validated.",
    lesson: "DENY means the present action is prohibited under the preserved state. Later evidence cannot rewrite the original decision.",
    anchors: [
      { label: "Reality", value: "A reimbursement request exists.", status: "supported" },
      { label: "Record", value: "Required receipt and approval record are absent.", status: "failed" },
      { label: "Continuity", value: "There is no preserved source chain to validate.", status: "failed" },
      { label: "Admissibility", value: "The request cannot satisfy the evidence threshold.", status: "failed" },
      { label: "Binding", value: "No authority exists to waive the mandatory record.", status: "failed" },
      { label: "Commit", value: "A valid approval state cannot be created.", status: "failed" },
      { label: "Execution", value: "Payment release is prohibited.", status: "failed" },
      { label: "Outcome", value: "Denial and reason are preserved for challenge and correction.", status: "supported" },
    ],
  },
  {
    id: "escalate",
    title: "Conflicting clinical routing evidence",
    domain: "High-consequence workflow",
    consequence: "Route a case where two authoritative records materially conflict.",
    state: "ESCALATE",
    summary:
      "The system cannot resolve the conflict within its authorized scope. The case must move to a qualified decision authority without silently favoring either record.",
    failure: "Binding is the decisive limit: the current reviewer lacks authority to resolve the conflict.",
    repair: "Route the preserved conflict to a named qualified authority and require an attributable resolution.",
    lesson: "ESCALATE transfers judgment. It does not convert uncertainty into permission.",
    anchors: [
      { label: "Reality", value: "A consequential routing decision is pending.", status: "supported" },
      { label: "Record", value: "Two attributable records contain incompatible instructions.", status: "limited" },
      { label: "Continuity", value: "Both records are current and preserved.", status: "supported" },
      { label: "Admissibility", value: "Each record is relevant; neither can be silently displaced.", status: "limited" },
      { label: "Binding", value: "Current reviewer lacks authority to resolve the conflict.", status: "failed" },
      { label: "Commit", value: "Escalation state and conflict are preserved.", status: "supported" },
      { label: "Execution", value: "No downstream action occurs before qualified review.", status: "supported" },
      { label: "Outcome", value: "Resolution must return with attributable authority and rationale.", status: "supported" },
    ],
  },
];

const readingProtocol: ReadingProtocolStep[] = [
  {
    id: "PROTOCOL-01",
    number: "01",
    title: "Name the proposed consequence",
    question: "What exact action may bind to reality?",
    evidence: "A bounded action statement naming scope, destination, subject, quantity, and time.",
    stopCondition: "Stop when the action is vague, compound, or broader than the stated authority.",
  },
  {
    id: "PROTOCOL-02",
    number: "02",
    title: "Establish present reality",
    question: "What condition actually exists now?",
    evidence: "Current observations, measurements, declarations, and affected subjects.",
    stopCondition: "Stop when the route relies on assumptions instead of present conditions.",
  },
  {
    id: "PROTOCOL-03",
    number: "03",
    title: "Locate the source record",
    question: "What was captured, by whom, when, and in what form?",
    evidence: "Attributable records with timestamps, source identity, and preservation method.",
    stopCondition: "Stop when the record cannot be inspected or tied to a source.",
  },
  {
    id: "PROTOCOL-04",
    number: "04",
    title: "Test continuity",
    question: "Did identity, state, version, custody, and context remain connected?",
    evidence: "Version history, custody trail, freshness, and changed-condition checks.",
    stopCondition: "Stop when the present state may no longer match the preserved record.",
  },
  {
    id: "PROTOCOL-05",
    number: "05",
    title: "Determine admissibility",
    question: "May this evidence support this consequence here and now?",
    evidence: "Fitness by purpose, time, jurisdiction, reliability, and consequence.",
    stopCondition: "Stop when relevant evidence is stale, unsupported, contradictory, or outside purpose.",
  },
  {
    id: "PROTOCOL-06",
    number: "06",
    title: "Resolve authority",
    question: "Who may bind this decision and within what scope?",
    evidence: "Identity, role, delegation, expiry, revocation, and conflict state.",
    stopCondition: "Stop when authority is missing, expired, conflicted, or too narrow.",
  },
  {
    id: "PROTOCOL-07",
    number: "07",
    title: "Apply binding conditions",
    question: "Which rules, thresholds, prohibitions, and obligations govern?",
    evidence: "Route version, policy basis, limits, exceptions, and mandatory gates.",
    stopCondition: "Stop when the route cannot identify what governs the consequence.",
  },
  {
    id: "PROTOCOL-08",
    number: "08",
    title: "Find earliest failure",
    question: "Which first unsupported link controls every downstream state?",
    evidence: "Ordered gate results with one explicit earliest-failure marker.",
    stopCondition: "Stop reading forward as though a later approval can cure the earlier break.",
  },
  {
    id: "PROTOCOL-09",
    number: "09",
    title: "Read the commit",
    question: "What determination was fixed before action?",
    evidence: "ALLOW, HOLD, DENY, or ESCALATE with reason codes and permitted next action.",
    stopCondition: "Stop when the decision is inferred after execution or can still be silently changed.",
  },
  {
    id: "PROTOCOL-10",
    number: "10",
    title: "Inspect execution effect",
    question: "Did the determination technically change what could happen?",
    evidence: "Release, hold, refusal, reroute, termination, rollback, or human checkpoint receipt.",
    stopCondition: "Stop when the artifact proves only monitoring, recommendation, or documentation.",
  },
  {
    id: "PROTOCOL-11",
    number: "11",
    title: "Close the outcome",
    question: "What actually happened after the committed determination?",
    evidence: "Outcome evidence, residual risk, rollback, correction, and final state.",
    stopCondition: "Stop when the route claims success without preserved consequence evidence.",
  },
  {
    id: "PROTOCOL-12",
    number: "12",
    title: "State the proof boundary",
    question: "What does this record prove, and what does it not prove?",
    evidence: "A bounded claim tied to the route, event, evidence, execution effect, and outcome.",
    stopCondition: "Stop when the claim expands beyond the preserved record.",
  },
];

const failurePatterns: FailurePattern[] = [
  {
    id: "PATTERN-001",
    chainLink: "REALITY",
    title: "Primary: Proposed consequence is not bounded",
    signal: "The requested action lacks an exact subject, destination, amount, tool, or time window.",
    consequence: "The route cannot know what it is governing.",
    repair: "Rewrite the action as one exact consequence-bearing event.",
    severity: "warning",
  },
  {
    id: "PATTERN-002",
    chainLink: "RECORD",
    title: "Primary: Source record is not attributable",
    signal: "The evidence cannot be tied to a named source, capture time, or preserved form.",
    consequence: "The route has no inspectable basis for reliance.",
    repair: "Capture and preserve an attributable source record.",
    severity: "blocking",
  },
  {
    id: "PATTERN-003",
    chainLink: "CONTINUITY",
    title: "Primary: Present state was not revalidated",
    signal: "Identity, version, custody, or environmental state may have changed.",
    consequence: "The preserved evidence may no longer describe the execution moment.",
    repair: "Revalidate all changed conditions and rerun dependent gates.",
    severity: "critical",
  },
  {
    id: "PATTERN-004",
    chainLink: "ADMISSIBILITY",
    title: "Primary: Evidence is relevant but not fit",
    signal: "The material is stale, unsupported, contradictory, incomplete, or outside purpose.",
    consequence: "The route may not rely on the material for this consequence.",
    repair: "Cure the evidence defect or preserve a HOLD, DENY, or ESCALATE state.",
    severity: "warning",
  },
  {
    id: "PATTERN-005",
    chainLink: "BINDING",
    title: "Primary: Authority or rule boundary is unresolved",
    signal: "The actor lacks scope, delegation, conflict clearance, or governing rule support.",
    consequence: "No valid consequence may be bound under the present authority state.",
    repair: "Resolve authority and the exact binding conditions before commit.",
    severity: "blocking",
  },
  {
    id: "PATTERN-006",
    chainLink: "COMMIT",
    title: "Primary: Decision was not fixed before action",
    signal: "The determination can still be edited, inferred, or backdated.",
    consequence: "The record cannot prove pre-execution governance.",
    repair: "Freeze the determination, reasons, scope, and permitted next action.",
    severity: "critical",
  },
  {
    id: "PATTERN-007",
    chainLink: "EXECUTION",
    title: "Primary: No technical control receipt exists",
    signal: "The route records a decision but does not prove release, block, hold, reroute, or termination.",
    consequence: "The artifact proves policy evaluation, not execution governance.",
    repair: "Capture a technical receipt showing the determination controlled the action path.",
    severity: "warning",
  },
  {
    id: "PATTERN-008",
    chainLink: "OUTCOME",
    title: "Primary: Outcome is asserted without closure evidence",
    signal: "The final consequence state, residual risk, and follow-up were not preserved.",
    consequence: "The route cannot prove what bound to reality.",
    repair: "Capture closure evidence and append residual risk without rewriting the original event.",
    severity: "blocking",
  },
  {
    id: "PATTERN-009",
    chainLink: "REALITY",
    title: "Changed-condition: Proposed consequence is not bounded",
    signal: "The requested action lacks an exact subject, destination, amount, tool, or time window.",
    consequence: "The route cannot know what it is governing.",
    repair: "Rewrite the action as one exact consequence-bearing event.",
    severity: "critical",
  },
  {
    id: "PATTERN-010",
    chainLink: "RECORD",
    title: "Changed-condition: Source record is not attributable",
    signal: "The evidence cannot be tied to a named source, capture time, or preserved form.",
    consequence: "The route has no inspectable basis for reliance.",
    repair: "Capture and preserve an attributable source record.",
    severity: "warning",
  },
  {
    id: "PATTERN-011",
    chainLink: "CONTINUITY",
    title: "Changed-condition: Present state was not revalidated",
    signal: "Identity, version, custody, or environmental state may have changed.",
    consequence: "The preserved evidence may no longer describe the execution moment.",
    repair: "Revalidate all changed conditions and rerun dependent gates.",
    severity: "blocking",
  },
  {
    id: "PATTERN-012",
    chainLink: "ADMISSIBILITY",
    title: "Changed-condition: Evidence is relevant but not fit",
    signal: "The material is stale, unsupported, contradictory, incomplete, or outside purpose.",
    consequence: "The route may not rely on the material for this consequence.",
    repair: "Cure the evidence defect or preserve a HOLD, DENY, or ESCALATE state.",
    severity: "critical",
  },
  {
    id: "PATTERN-013",
    chainLink: "BINDING",
    title: "Changed-condition: Authority or rule boundary is unresolved",
    signal: "The actor lacks scope, delegation, conflict clearance, or governing rule support.",
    consequence: "No valid consequence may be bound under the present authority state.",
    repair: "Resolve authority and the exact binding conditions before commit.",
    severity: "warning",
  },
  {
    id: "PATTERN-014",
    chainLink: "COMMIT",
    title: "Changed-condition: Decision was not fixed before action",
    signal: "The determination can still be edited, inferred, or backdated.",
    consequence: "The record cannot prove pre-execution governance.",
    repair: "Freeze the determination, reasons, scope, and permitted next action.",
    severity: "blocking",
  },
  {
    id: "PATTERN-015",
    chainLink: "EXECUTION",
    title: "Changed-condition: No technical control receipt exists",
    signal: "The route records a decision but does not prove release, block, hold, reroute, or termination.",
    consequence: "The artifact proves policy evaluation, not execution governance.",
    repair: "Capture a technical receipt showing the determination controlled the action path.",
    severity: "critical",
  },
  {
    id: "PATTERN-016",
    chainLink: "OUTCOME",
    title: "Changed-condition: Outcome is asserted without closure evidence",
    signal: "The final consequence state, residual risk, and follow-up were not preserved.",
    consequence: "The route cannot prove what bound to reality.",
    repair: "Capture closure evidence and append residual risk without rewriting the original event.",
    severity: "warning",
  },
  {
    id: "PATTERN-017",
    chainLink: "REALITY",
    title: "Authority-linked: Proposed consequence is not bounded",
    signal: "The requested action lacks an exact subject, destination, amount, tool, or time window.",
    consequence: "The route cannot know what it is governing.",
    repair: "Rewrite the action as one exact consequence-bearing event.",
    severity: "blocking",
  },
  {
    id: "PATTERN-018",
    chainLink: "RECORD",
    title: "Authority-linked: Source record is not attributable",
    signal: "The evidence cannot be tied to a named source, capture time, or preserved form.",
    consequence: "The route has no inspectable basis for reliance.",
    repair: "Capture and preserve an attributable source record.",
    severity: "critical",
  },
  {
    id: "PATTERN-019",
    chainLink: "CONTINUITY",
    title: "Authority-linked: Present state was not revalidated",
    signal: "Identity, version, custody, or environmental state may have changed.",
    consequence: "The preserved evidence may no longer describe the execution moment.",
    repair: "Revalidate all changed conditions and rerun dependent gates.",
    severity: "warning",
  },
  {
    id: "PATTERN-020",
    chainLink: "ADMISSIBILITY",
    title: "Authority-linked: Evidence is relevant but not fit",
    signal: "The material is stale, unsupported, contradictory, incomplete, or outside purpose.",
    consequence: "The route may not rely on the material for this consequence.",
    repair: "Cure the evidence defect or preserve a HOLD, DENY, or ESCALATE state.",
    severity: "blocking",
  },
  {
    id: "PATTERN-021",
    chainLink: "BINDING",
    title: "Authority-linked: Authority or rule boundary is unresolved",
    signal: "The actor lacks scope, delegation, conflict clearance, or governing rule support.",
    consequence: "No valid consequence may be bound under the present authority state.",
    repair: "Resolve authority and the exact binding conditions before commit.",
    severity: "critical",
  },
  {
    id: "PATTERN-022",
    chainLink: "COMMIT",
    title: "Authority-linked: Decision was not fixed before action",
    signal: "The determination can still be edited, inferred, or backdated.",
    consequence: "The record cannot prove pre-execution governance.",
    repair: "Freeze the determination, reasons, scope, and permitted next action.",
    severity: "warning",
  },
  {
    id: "PATTERN-023",
    chainLink: "EXECUTION",
    title: "Authority-linked: No technical control receipt exists",
    signal: "The route records a decision but does not prove release, block, hold, reroute, or termination.",
    consequence: "The artifact proves policy evaluation, not execution governance.",
    repair: "Capture a technical receipt showing the determination controlled the action path.",
    severity: "blocking",
  },
  {
    id: "PATTERN-024",
    chainLink: "OUTCOME",
    title: "Authority-linked: Outcome is asserted without closure evidence",
    signal: "The final consequence state, residual risk, and follow-up were not preserved.",
    consequence: "The route cannot prove what bound to reality.",
    repair: "Capture closure evidence and append residual risk without rewriting the original event.",
    severity: "critical",
  },
  {
    id: "PATTERN-025",
    chainLink: "REALITY",
    title: "Cross-system: Proposed consequence is not bounded",
    signal: "The requested action lacks an exact subject, destination, amount, tool, or time window.",
    consequence: "The route cannot know what it is governing.",
    repair: "Rewrite the action as one exact consequence-bearing event.",
    severity: "warning",
  },
  {
    id: "PATTERN-026",
    chainLink: "RECORD",
    title: "Cross-system: Source record is not attributable",
    signal: "The evidence cannot be tied to a named source, capture time, or preserved form.",
    consequence: "The route has no inspectable basis for reliance.",
    repair: "Capture and preserve an attributable source record.",
    severity: "blocking",
  },
  {
    id: "PATTERN-027",
    chainLink: "CONTINUITY",
    title: "Cross-system: Present state was not revalidated",
    signal: "Identity, version, custody, or environmental state may have changed.",
    consequence: "The preserved evidence may no longer describe the execution moment.",
    repair: "Revalidate all changed conditions and rerun dependent gates.",
    severity: "critical",
  },
  {
    id: "PATTERN-028",
    chainLink: "ADMISSIBILITY",
    title: "Cross-system: Evidence is relevant but not fit",
    signal: "The material is stale, unsupported, contradictory, incomplete, or outside purpose.",
    consequence: "The route may not rely on the material for this consequence.",
    repair: "Cure the evidence defect or preserve a HOLD, DENY, or ESCALATE state.",
    severity: "warning",
  },
  {
    id: "PATTERN-029",
    chainLink: "BINDING",
    title: "Cross-system: Authority or rule boundary is unresolved",
    signal: "The actor lacks scope, delegation, conflict clearance, or governing rule support.",
    consequence: "No valid consequence may be bound under the present authority state.",
    repair: "Resolve authority and the exact binding conditions before commit.",
    severity: "blocking",
  },
  {
    id: "PATTERN-030",
    chainLink: "COMMIT",
    title: "Cross-system: Decision was not fixed before action",
    signal: "The determination can still be edited, inferred, or backdated.",
    consequence: "The record cannot prove pre-execution governance.",
    repair: "Freeze the determination, reasons, scope, and permitted next action.",
    severity: "critical",
  },
  {
    id: "PATTERN-031",
    chainLink: "EXECUTION",
    title: "Cross-system: No technical control receipt exists",
    signal: "The route records a decision but does not prove release, block, hold, reroute, or termination.",
    consequence: "The artifact proves policy evaluation, not execution governance.",
    repair: "Capture a technical receipt showing the determination controlled the action path.",
    severity: "warning",
  },
  {
    id: "PATTERN-032",
    chainLink: "OUTCOME",
    title: "Cross-system: Outcome is asserted without closure evidence",
    signal: "The final consequence state, residual risk, and follow-up were not preserved.",
    consequence: "The route cannot prove what bound to reality.",
    repair: "Capture closure evidence and append residual risk without rewriting the original event.",
    severity: "blocking",
  },
];

const reviewQuestions: ReviewQuestion[] = [
  {
    id: "QUESTION-01",
    category: "Scope",
    question: "Can the proposed action be executed in more than one materially different way?",
    expectedReading: "A readable route allows only the exact committed action.",
  },
  {
    id: "QUESTION-02",
    category: "Scope",
    question: "Are subject, destination, amount, model, tool, and time window explicit?",
    expectedReading: "Every consequence-bearing dimension is bounded.",
  },
  {
    id: "QUESTION-03",
    category: "Reality",
    question: "Does the route distinguish observed conditions from assumptions?",
    expectedReading: "Assumptions remain declared and cannot substitute for present reality.",
  },
  {
    id: "QUESTION-04",
    category: "Record",
    question: "Can an outside reviewer identify who captured each material record?",
    expectedReading: "Every relied-upon item is attributable.",
  },
  {
    id: "QUESTION-05",
    category: "Record",
    question: "Does each source have a capture time and stable identity?",
    expectedReading: "The route can establish timing and source parity.",
  },
  {
    id: "QUESTION-06",
    category: "Continuity",
    question: "Could any relevant state have changed after evidence capture?",
    expectedReading: "Changed-condition triggers are named and checked.",
  },
  {
    id: "QUESTION-07",
    category: "Continuity",
    question: "Are route, model, tool, and destination versions preserved?",
    expectedReading: "The execution moment resolves to one frozen configuration.",
  },
  {
    id: "QUESTION-08",
    category: "Admissibility",
    question: "Is relevance being mistaken for sufficiency?",
    expectedReading: "Relevant material must still be fit for purpose and consequence.",
  },
  {
    id: "QUESTION-09",
    category: "Admissibility",
    question: "Are contradictions visible rather than silently averaged?",
    expectedReading: "Material conflicts produce HOLD or ESCALATE unless the route authorizes resolution.",
  },
  {
    id: "QUESTION-10",
    category: "Authority",
    question: "Is the approving actor authorized for this exact action now?",
    expectedReading: "Authority includes scope, time, delegation, and conflict state.",
  },
  {
    id: "QUESTION-11",
    category: "Authority",
    question: "Does human approval exceed the authority source?",
    expectedReading: "Human involvement cannot cure an invalid authority boundary.",
  },
  {
    id: "QUESTION-12",
    category: "Binding",
    question: "Can the reviewer identify the rule that controls each mandatory gate?",
    expectedReading: "Every gate resolves to a preserved governing condition.",
  },
  {
    id: "QUESTION-13",
    category: "Binding",
    question: "Are exceptions explicit and bounded?",
    expectedReading: "No exception silently becomes general permission.",
  },
  {
    id: "QUESTION-14",
    category: "Commit",
    question: "Was the determination fixed before execution?",
    expectedReading: "The commit is timestamped, immutable, and attributable.",
  },
  {
    id: "QUESTION-15",
    category: "Commit",
    question: "Does the commit state the only permitted next action?",
    expectedReading: "ALLOW, HOLD, DENY, and ESCALATE each constrain the next step.",
  },
  {
    id: "QUESTION-16",
    category: "Execution",
    question: "Is there a technical control effect rather than a narrative claim?",
    expectedReading: "A receipt proves what was released, blocked, held, rerouted, or terminated.",
  },
  {
    id: "QUESTION-17",
    category: "Execution",
    question: "Could an alternate path bypass the committed result?",
    expectedReading: "Bypass attempts are prevented and preserved.",
  },
  {
    id: "QUESTION-18",
    category: "Outcome",
    question: "Does outcome evidence show what actually bound to reality?",
    expectedReading: "Closure is supported rather than inferred.",
  },
  {
    id: "QUESTION-19",
    category: "Outcome",
    question: "Are residual risk and correction preserved append-only?",
    expectedReading: "Later learning does not rewrite the original event.",
  },
  {
    id: "QUESTION-20",
    category: "Integrity",
    question: "Do public page, PDF, JSON, and manifest resolve to the same record?",
    expectedReading: "Every representation maintains parity.",
  },
  {
    id: "QUESTION-21",
    category: "Integrity",
    question: "Can an altered component be detected offline?",
    expectedReading: "Hashes and canonicalization rules reveal tampering.",
  },
  {
    id: "QUESTION-22",
    category: "Boundary",
    question: "Does the artifact say what it does not prove?",
    expectedReading: "The public claim remains no broader than the record.",
  },
  {
    id: "QUESTION-23",
    category: "Challenge",
    question: "Can a reviewer dispute the record without erasing it?",
    expectedReading: "Challenge, correction, supersession, and withdrawal are append-only.",
  },
  {
    id: "QUESTION-24",
    category: "Transfer",
    question: "Would the same chain remain visible in another sector?",
    expectedReading: "Terminology may change; the execution chain may not.",
  },
];

const glossary: GlossaryEntry[] = [
  {
    term: "Admissibility",
    definition: "Fitness of evidence and authority for a specific route, purpose, time, jurisdiction, and consequence.",
    readingUse: "Ask whether the material may be relied upon here—not merely whether it exists.",
  },
  {
    term: "Binding",
    definition: "Application of governing rules, limits, thresholds, authority scopes, and prohibitions to the preserved facts.",
    readingUse: "Identify what turns facts into a constrained decision.",
  },
  {
    term: "Commit",
    definition: "The fixed determination preserved before action.",
    readingUse: "Verify that ALLOW, HOLD, DENY, or ESCALATE existed before execution.",
  },
  {
    term: "Continuity",
    definition: "Unbroken linkage of identity, state, version, custody, freshness, and context.",
    readingUse: "Look for changed conditions that disconnect source from decision.",
  },
  {
    term: "Determination",
    definition: "The committed runtime state: ALLOW, HOLD, DENY, or ESCALATE.",
    readingUse: "Read the state together with reasons and permitted next action.",
  },
  {
    term: "Earliest failure",
    definition: "The first unsupported chain link that controls every later result.",
    readingUse: "Do not let a downstream success cure an upstream break.",
  },
  {
    term: "Execution effect",
    definition: "The technical event that releases, holds, blocks, reroutes, rolls back, or terminates an action.",
    readingUse: "Demand a receipt, not a description.",
  },
  {
    term: "Outcome closure",
    definition: "Preserved evidence of what actually happened after the determination.",
    readingUse: "Separate expected effect from actual consequence.",
  },
  {
    term: "Route snapshot",
    definition: "The frozen version of gate order, thresholds, policy basis, jurisdiction, model, tool, and destination.",
    readingUse: "Check parity across every export.",
  },
  {
    term: "Evidence manifest",
    definition: "Inventory of sources, hashes, capture metadata, disclosure, freshness, and admissibility results.",
    readingUse: "Trace every relied-upon claim to its evidence identity.",
  },
  {
    term: "Authority scope",
    definition: "The exact actions, subjects, amounts, systems, and time for which an actor may bind consequence.",
    readingUse: "Approval outside scope is not authority.",
  },
  {
    term: "Fail closed",
    definition: "Default behavior that prevents execution when a mandatory condition is missing or unresolved.",
    readingUse: "Look for explicit block or hold behavior.",
  },
  {
    term: "Revalidation",
    definition: "Required reevaluation after evidence, authority, state, route, model, tool, destination, or threshold changes.",
    readingUse: "Ask what changed between approval and execution.",
  },
  {
    term: "Repair condition",
    definition: "The precise condition that must be cured before a held route may proceed.",
    readingUse: "A valid HOLD names the cure.",
  },
  {
    term: "Bypass resistance",
    definition: "Prevention of alternate-path release under the same invalid state.",
    readingUse: "Inspect retries, alternate tools, destinations, and credentials.",
  },
  {
    term: "Record parity",
    definition: "Agreement among public page, PDF, JSON, manifests, receipts, and route snapshot.",
    readingUse: "One frozen record must underlie every representation.",
  },
  {
    term: "Canonicalization",
    definition: "Versioned rules that serialize structured records consistently for hashing.",
    readingUse: "The same record should produce the same digest.",
  },
  {
    term: "Challenge record",
    definition: "Append-only dispute, response, decision, amendment, and status history.",
    readingUse: "Correction must not erase the original event.",
  },
  {
    term: "Demonstration artifact",
    definition: "A bounded record from a controlled, clearly labeled simulated environment.",
    readingUse: "Do not mistake demonstration proof for production proof.",
  },
  {
    term: "Production artifact",
    definition: "A bounded record from an authentic consequential workflow with real systems and authorized participants.",
    readingUse: "Demand genuine execution effect and outcome evidence.",
  },
  {
    term: "Disclosure boundary",
    definition: "The rule governing what is public, selective, restricted, or withheld.",
    readingUse: "Confidentiality may limit disclosure but not integrity commitments.",
  },
  {
    term: "Residual risk",
    definition: "Remaining uncertainty or exposure after execution or closure.",
    readingUse: "A successful action can still preserve unresolved risk.",
  },
  {
    term: "Scope-bounded competency",
    definition: "Demonstrated capability for a defined route, consequence, and level of authority.",
    readingUse: "Completion alone does not grant operational authority.",
  },
  {
    term: "Proof boundary",
    definition: "The explicit line between what the artifact establishes and what remains unproven.",
    readingUse: "Reject claims broader than the preserved event.",
  },
];

const DETERMINATION_ORDER: RouteState[] = ["ALLOW", "HOLD", "DENY", "ESCALATE"];
const CHAIN_ORDER = ["REALITY", "RECORD", "CONTINUITY", "ADMISSIBILITY", "BINDING", "COMMIT", "EXECUTION", "OUTCOME"] as const;

const stateVisual: Record<RouteState, { badge: string; glow: string; ring: string; label: string; index: string }> = {
  ALLOW: {
    badge: "border-emerald-300/35 bg-emerald-300/10 text-emerald-100",
    glow: "from-emerald-400/20 via-emerald-400/5 to-transparent",
    ring: "border-emerald-300/30",
    label: "Authorized boundary",
    index: "text-emerald-200",
  },
  HOLD: {
    badge: "border-amber-300/35 bg-amber-300/10 text-amber-100",
    glow: "from-amber-400/20 via-amber-400/5 to-transparent",
    ring: "border-amber-300/30",
    label: "Repair required",
    index: "text-amber-200",
  },
  DENY: {
    badge: "border-rose-300/35 bg-rose-300/10 text-rose-100",
    glow: "from-rose-400/20 via-rose-400/5 to-transparent",
    ring: "border-rose-300/30",
    label: "Execution prohibited",
    index: "text-rose-200",
  },
  ESCALATE: {
    badge: "border-violet-300/35 bg-violet-300/10 text-violet-100",
    glow: "from-violet-400/20 via-violet-400/5 to-transparent",
    ring: "border-violet-300/30",
    label: "Qualified judgment required",
    index: "text-violet-200",
  },
};

const anchorVisual: Record<AnchorStatus, { card: string; dot: string; word: string }> = {
  supported: {
    card: "border-emerald-300/20 bg-emerald-300/[0.045] hover:border-emerald-300/35",
    dot: "bg-emerald-300 shadow-[0_0_18px_rgba(110,231,183,0.55)]",
    word: "text-emerald-200",
  },
  limited: {
    card: "border-amber-300/20 bg-amber-300/[0.045] hover:border-amber-300/35",
    dot: "bg-amber-300 shadow-[0_0_18px_rgba(252,211,77,0.55)]",
    word: "text-amber-200",
  },
  failed: {
    card: "border-rose-300/20 bg-rose-300/[0.045] hover:border-rose-300/35",
    dot: "bg-rose-300 shadow-[0_0_18px_rgba(253,164,175,0.55)]",
    word: "text-rose-200",
  },
};

function MetricCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <article className="group relative overflow-hidden rounded-[26px] border border-white/10 bg-white/[0.045] p-5 shadow-[0_22px_60px_rgba(0,0,0,0.24)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-cyan-300/25">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/55 to-transparent opacity-70" />
      <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-500">{label}</p>
      <p className="mt-3 text-3xl font-black tracking-tight text-white">{value}</p>
      <p className="mt-2 text-xs leading-5 text-slate-400">{detail}</p>
    </article>
  );
}

function AcademyLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="rounded-full border border-white/10 bg-white/[0.035] px-4 py-2 text-xs font-bold text-slate-300 transition hover:border-cyan-300/35 hover:bg-cyan-300/[0.07] hover:text-white"
    >
      {children}
    </Link>
  );
}

function SectionHeading({ eyebrow, title, copy }: { eyebrow: string; title: string; copy: string }) {
  return (
    <div className="max-w-4xl">
      <p className="text-[10px] font-black uppercase tracking-[0.26em] text-cyan-300">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-black tracking-[-0.035em] text-white sm:text-4xl">{title}</h2>
      <p className="mt-4 text-sm leading-7 text-slate-400 sm:text-base">{copy}</p>
    </div>
  );
}

function ProtocolCard({ step }: { step: ReadingProtocolStep }) {
  return (
    <article className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.035] p-6 transition duration-300 hover:-translate-y-1 hover:border-cyan-300/25 hover:bg-white/[0.055]">
      <div className="absolute right-4 top-3 text-6xl font-black text-white/[0.035]">{step.number}</div>
      <div className="relative">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-300/25 bg-cyan-300/[0.08] text-xs font-black text-cyan-100">{step.number}</span>
        <h3 className="mt-5 text-xl font-black text-white">{step.title}</h3>
        <p className="mt-3 text-sm font-bold leading-6 text-cyan-100">{step.question}</p>
        <div className="mt-5 rounded-2xl border border-white/8 bg-black/20 p-4">
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">Required reading evidence</p>
          <p className="mt-2 text-sm leading-6 text-slate-300">{step.evidence}</p>
        </div>
        <div className="mt-3 rounded-2xl border border-rose-300/15 bg-rose-300/[0.04] p-4">
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-rose-200">Stop condition</p>
          <p className="mt-2 text-sm leading-6 text-slate-300">{step.stopCondition}</p>
        </div>
      </div>
    </article>
  );
}

function StateDoctrine({ state }: { state: RouteState }) {
  const content: Record<RouteState, { title: string; rule: string; effect: string; misuse: string }> = {
    ALLOW: {
      title: "Exact permission—not general approval",
      rule: "Every mandatory condition is satisfied for the exact committed scope.",
      effect: "Release only the authorized action, destination, model, tool, amount, and time window.",
      misuse: "Treating ALLOW as permission for adjacent, future, or broader actions.",
    },
    HOLD: {
      title: "Repairable stop—not soft permission",
      rule: "A required condition is missing, stale, changed, unresolved, or awaiting revalidation.",
      effect: "Do not execute. Preserve the precise hold reason and repair condition.",
      misuse: "Allowing execution while paperwork or evidence catches up later.",
    },
    DENY: {
      title: "Prohibited present action",
      rule: "A hard boundary, invalid authority, inadmissible evidence, or prohibited condition exists.",
      effect: "Block or terminate the action and prevent alternate-path release under the same state.",
      misuse: "Rewriting the original denial after later evidence appears.",
    },
    ESCALATE: {
      title: "Transfer of judgment—not approval",
      rule: "The route requires named human or institutional judgment beyond current authority.",
      effect: "Route to the designated authority while preserving the unresolved conflict or exception.",
      misuse: "Treating escalation as a favorable recommendation or implied approval.",
    },
  };
  const item = content[state];
  const visual = stateVisual[state];
  return (
    <article className={`relative overflow-hidden rounded-[28px] border ${visual.ring} bg-white/[0.035] p-6`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${visual.glow}`} />
      <div className="relative">
        <span className={`rounded-full border px-3 py-1.5 text-[10px] font-black tracking-[0.16em] ${visual.badge}`}>{state}</span>
        <h3 className="mt-5 text-2xl font-black text-white">{item.title}</h3>
        <div className="mt-5 space-y-4">
          <div><p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">Decision rule</p><p className="mt-2 text-sm leading-6 text-slate-300">{item.rule}</p></div>
          <div><p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">Required effect</p><p className="mt-2 text-sm leading-6 text-slate-300">{item.effect}</p></div>
          <div><p className="text-[9px] font-black uppercase tracking-[0.2em] text-rose-200">Common misuse</p><p className="mt-2 text-sm leading-6 text-slate-300">{item.misuse}</p></div>
        </div>
      </div>
    </article>
  );
}

export default function RouteReadingCenterPage() {
  const [activeId, setActiveId] = useState(routeExamples[0].id);
  const [completed, setCompleted] = useState<string[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [saveState, setSaveState] = useState<"idle" | "saved" | "error">("idle");
  const [patternQuery, setPatternQuery] = useState("");
  const [patternLink, setPatternLink] = useState("ALL");
  const [glossaryQuery, setGlossaryQuery] = useState("");

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as SavedProgress;
      if (saved.version !== "2.0") return;
      setCompleted(saved.completed ?? []);
      setNotes(saved.notes ?? {});
    } catch {
      setSaveState("error");
    }
  }, []);

  const activeRoute = useMemo(
    () => routeExamples.find((route) => route.id === activeId) ?? routeExamples[0],
    [activeId],
  );

  const filteredPatterns = useMemo(() => {
    const query = patternQuery.trim().toLowerCase();
    return failurePatterns.filter((pattern) => {
      const matchesLink = patternLink === "ALL" || pattern.chainLink === patternLink;
      const matchesQuery = !query || [pattern.title, pattern.signal, pattern.consequence, pattern.repair, pattern.chainLink].join(" ").toLowerCase().includes(query);
      return matchesLink && matchesQuery;
    });
  }, [patternLink, patternQuery]);

  const filteredGlossary = useMemo(() => {
    const query = glossaryQuery.trim().toLowerCase();
    if (!query) return glossary;
    return glossary.filter((entry) => [entry.term, entry.definition, entry.readingUse].join(" ").toLowerCase().includes(query));
  }, [glossaryQuery]);

  const progress = Math.round((completed.length / routeExamples.length) * 100);
  const supportedCount = activeRoute.anchors.filter((anchor) => anchor.status === "supported").length;
  const limitedCount = activeRoute.anchors.filter((anchor) => anchor.status === "limited").length;
  const failedCount = activeRoute.anchors.filter((anchor) => anchor.status === "failed").length;
  const activeVisual = stateVisual[activeRoute.state];

  function toggleCompleted(id: string) {
    setCompleted((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
    setSaveState("idle");
  }

  function saveProgress() {
    try {
      const payload: SavedProgress = {
        version: "2.0",
        completed,
        notes,
        updatedAt: new Date().toISOString(),
      };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      setSaveState("saved");
    } catch {
      setSaveState("error");
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#020711] text-slate-100">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.022)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.022)_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:linear-gradient(to_bottom,black,transparent_82%)]" />
        <div className="absolute -left-28 top-8 h-[460px] w-[460px] rounded-full bg-cyan-500/12 blur-[130px]" />
        <div className="absolute right-[-140px] top-[28%] h-[500px] w-[500px] rounded-full bg-violet-500/10 blur-[145px]" />
        <div className="absolute bottom-[-140px] left-[35%] h-[430px] w-[430px] rounded-full bg-emerald-500/8 blur-[145px]" />
      </div>

      <div className="relative mx-auto max-w-[1480px] px-4 py-6 sm:px-7 lg:px-10 lg:py-9">
        <header className="rounded-[28px] border border-white/10 bg-[#07111f]/75 px-5 py-4 shadow-[0_28px_100px_rgba(0,0,0,0.35)] backdrop-blur-2xl sm:px-7">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-center gap-4">
              <div className="grid h-12 w-12 place-items-center rounded-2xl border border-cyan-300/30 bg-cyan-300/10 text-sm font-black tracking-[0.12em] text-cyan-100 shadow-[0_0_30px_rgba(34,211,238,0.12)]">
                T14
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.26em] text-cyan-300">TA-14 Academy</p>
                <p className="mt-1 text-sm font-bold text-white">Route Reading Center</p>
              </div>
            </div>

            <nav className="flex flex-wrap gap-2" aria-label="Academy navigation">
              <AcademyLink href="/academy/mission-control">Mission Control</AcademyLink>
              <AcademyLink href="/academy/architecture-explorer">Architecture Explorer</AcademyLink>
              <AcademyLink href="/academy/simulator">Simulation Center</AcademyLink>
            </nav>
          </div>
        </header>

        <section className="relative mt-6 overflow-hidden rounded-[36px] border border-white/10 bg-[#07111f]/78 px-6 py-10 shadow-[0_36px_110px_rgba(0,0,0,0.38)] backdrop-blur-2xl sm:px-9 lg:px-12 lg:py-14">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_0%,rgba(34,211,238,0.16),transparent_34%),radial-gradient(circle_at_88%_34%,rgba(139,92,246,0.13),transparent_32%)]" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent" />

          <div className="relative grid gap-10 xl:grid-cols-[1.25fr_0.75fr] xl:items-end">
            <div>
              <div className="inline-flex items-center gap-3 rounded-full border border-cyan-300/20 bg-cyan-300/[0.07] px-4 py-2">
                <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_16px_rgba(103,232,249,0.7)]" />
                <span className="text-[10px] font-black uppercase tracking-[0.28em] text-cyan-100">Read before you build</span>
              </div>
              <h1 className="mt-6 max-w-5xl text-4xl font-black leading-[0.98] tracking-[-0.045em] text-white sm:text-5xl lg:text-7xl">
                Learn to read the route before you trust the result.
              </h1>
              <p className="mt-6 max-w-4xl text-base leading-8 text-slate-300 sm:text-lg">
                Inspect complete and defective routes across all four determination states. Follow the chain from reality to outcome, find the earliest unsupported condition, and distinguish permission from completion.
              </p>
            </div>

            <aside className="rounded-[28px] border border-white/10 bg-black/20 p-6 shadow-inner shadow-black/20">
              <p className="text-[10px] font-black uppercase tracking-[0.26em] text-slate-500">Governing principle</p>
              <blockquote className="mt-4 text-2xl font-black leading-tight text-white">
                No admissible evidence.
                <br />
                <span className="text-cyan-200">No admissible execution.</span>
              </blockquote>
              <p className="mt-4 text-sm leading-6 text-slate-400">
                The first unsupported link controls the route. Later confidence cannot repair an earlier failure.
              </p>
            </aside>
          </div>

          <div className="relative mt-9 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard label="Examples reviewed" value={`${completed.length}/${routeExamples.length}`} detail="Four canonical decision states" />
            <MetricCard label="Learning progress" value={`${progress}%`} detail="Preserved locally in this browser" />
            <MetricCard label="Active route support" value={`${supportedCount}/8`} detail={`${limitedCount} limited · ${failedCount} failed`} />
            <MetricCard label="Reading discipline" value="Earliest failure" detail="Read from reality forward" />
          </div>

          <div className="relative mt-5 overflow-hidden rounded-full border border-white/10 bg-black/25 p-1">
            <div className="h-2 rounded-full bg-gradient-to-r from-cyan-300 via-sky-300 to-violet-300 transition-all duration-700" style={{ width: `${Math.max(progress, 2)}%` }} />
          </div>
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
          <aside className="xl:sticky xl:top-6 xl:self-start">
            <div className="rounded-[30px] border border-white/10 bg-[#07111f]/78 p-4 shadow-[0_28px_90px_rgba(0,0,0,0.32)] backdrop-blur-2xl">
              <div className="px-2 pb-4 pt-2">
                <p className="text-[10px] font-black uppercase tracking-[0.26em] text-cyan-300">Demonstration routes</p>
                <p className="mt-2 text-sm leading-6 text-slate-400">Compare the same execution chain across four final states.</p>
              </div>

              <div className="space-y-3">
                {routeExamples.map((route, index) => {
                  const isActive = route.id === activeRoute.id;
                  const isComplete = completed.includes(route.id);
                  const visual = stateVisual[route.state];

                  return (
                    <button
                      key={route.id}
                      type="button"
                      onClick={() => setActiveId(route.id)}
                      className={`group relative w-full overflow-hidden rounded-[24px] border p-4 text-left transition-all duration-300 ${
                        isActive
                          ? `${visual.ring} bg-white/[0.075] shadow-[0_20px_55px_rgba(0,0,0,0.24)]`
                          : "border-white/8 bg-black/15 hover:-translate-y-0.5 hover:border-white/18 hover:bg-white/[0.045]"
                      }`}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${visual.glow} transition-opacity group-hover:opacity-70 ${isActive ? "opacity-100" : "opacity-0"}`} />
                      <div className="relative">
                        <div className="flex items-center justify-between gap-3">
                          <span className={`text-xs font-black tracking-[0.2em] ${visual.index}`}>{String(index + 1).padStart(2, "0")}</span>
                          <span className={`rounded-full border px-2.5 py-1 text-[9px] font-black tracking-[0.16em] ${visual.badge}`}>{route.state}</span>
                        </div>
                        <h2 className="mt-4 text-base font-black leading-snug text-white">{route.title}</h2>
                        <p className="mt-1.5 text-xs leading-5 text-slate-400">{route.domain}</p>
                        <div className="mt-4 flex items-center justify-between border-t border-white/8 pt-3">
                          <span className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">{visual.label}</span>
                          {isComplete ? <span className="text-xs font-bold text-emerald-200">Reviewed ✓</span> : <span className="text-xs text-slate-600">Open →</span>}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          <div className="min-w-0 space-y-6">
            <article className="relative overflow-hidden rounded-[34px] border border-white/10 bg-[#07111f]/80 p-6 shadow-[0_28px_90px_rgba(0,0,0,0.32)] backdrop-blur-2xl sm:p-8 lg:p-10">
              <div className={`absolute inset-0 bg-gradient-to-br ${activeVisual.glow}`} />
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/45 to-transparent" />

              <div className="relative">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.28em] text-cyan-300">{activeRoute.domain}</p>
                    <h2 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">{activeRoute.title}</h2>
                  </div>
                  <div className="flex flex-col items-start gap-2 lg:items-end">
                    <span className={`rounded-full border px-5 py-2.5 text-xs font-black tracking-[0.2em] ${activeVisual.badge}`}>{activeRoute.state}</span>
                    <span className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">{activeVisual.label}</span>
                  </div>
                </div>

                <div className="mt-8 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                  <section className="rounded-[25px] border border-white/10 bg-black/22 p-5 sm:p-6">
                    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">Proposed consequence</p>
                    <p className="mt-3 text-lg font-bold leading-8 text-white">{activeRoute.consequence}</p>
                  </section>
                  <section className="rounded-[25px] border border-white/10 bg-white/[0.04] p-5 sm:p-6">
                    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">Reading result</p>
                    <p className="mt-3 text-sm leading-7 text-slate-300">{activeRoute.summary}</p>
                  </section>
                </div>

                {activeRoute.failure ? (
                  <div className="mt-5 rounded-[24px] border border-amber-300/20 bg-amber-300/[0.055] p-5">
                    <div className="flex items-start gap-4">
                      <div className="mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-amber-300/25 bg-amber-300/10 text-sm font-black text-amber-100">!</div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-200">Earliest controlling condition</p>
                        <p className="mt-2 text-sm leading-6 text-amber-50">{activeRoute.failure}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mt-5 rounded-[24px] border border-emerald-300/20 bg-emerald-300/[0.055] p-5">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-200">Route integrity</p>
                    <p className="mt-2 text-sm leading-6 text-emerald-50">Every required link is supported for the exact bounded action.</p>
                  </div>
                )}
              </div>
            </article>

            <section className="rounded-[34px] border border-white/10 bg-[#07111f]/72 p-5 shadow-[0_28px_90px_rgba(0,0,0,0.28)] backdrop-blur-2xl sm:p-7 lg:p-9">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.26em] text-cyan-300">Architecture correspondence</p>
                  <h2 className="mt-3 text-2xl font-black tracking-tight text-white sm:text-3xl">Read the eight-link chain in order.</h2>
                </div>
                <div className="flex flex-wrap gap-2 text-[10px] font-black uppercase tracking-[0.14em]">
                  <span className="rounded-full border border-emerald-300/20 bg-emerald-300/[0.06] px-3 py-1.5 text-emerald-200">{supportedCount} supported</span>
                  <span className="rounded-full border border-amber-300/20 bg-amber-300/[0.06] px-3 py-1.5 text-amber-200">{limitedCount} limited</span>
                  <span className="rounded-full border border-rose-300/20 bg-rose-300/[0.06] px-3 py-1.5 text-rose-200">{failedCount} failed</span>
                </div>
              </div>

              <div className="relative mt-7 grid gap-4 md:grid-cols-2">
                <div className="pointer-events-none absolute bottom-0 left-7 top-0 hidden w-px bg-gradient-to-b from-cyan-300/40 via-white/10 to-transparent md:block" />
                {activeRoute.anchors.map((anchor, index) => {
                  const visual = anchorVisual[anchor.status];
                  return (
                    <article key={anchor.label} className={`group relative rounded-[24px] border p-5 transition duration-300 hover:-translate-y-0.5 ${visual.card}`}>
                      <div className="flex items-start gap-4">
                        <div className="relative z-10 grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-white/10 bg-[#07111f] text-xs font-black text-cyan-100 shadow-[0_12px_30px_rgba(0,0,0,0.24)]">
                          {String(index + 1).padStart(2, "0")}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <h3 className="text-lg font-black text-white">{anchor.label}</h3>
                            <span className={`inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.16em] ${visual.word}`}>
                              <span className={`h-2 w-2 rounded-full ${visual.dot}`} />
                              {anchor.status}
                            </span>
                          </div>
                          <p className="mt-2 text-sm leading-6 text-slate-300">{anchor.value}</p>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-2">
              <article className="rounded-[30px] border border-white/10 bg-[#07111f]/75 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.25)] backdrop-blur-2xl sm:p-7">
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-cyan-300">Repair condition</p>
                <h2 className="mt-3 text-2xl font-black text-white">What must change?</h2>
                <p className="mt-4 text-sm leading-7 text-slate-300">{activeRoute.repair}</p>
              </article>
              <article className="rounded-[30px] border border-white/10 bg-[#07111f]/75 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.25)] backdrop-blur-2xl sm:p-7">
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-violet-300">Learning objective</p>
                <h2 className="mt-3 text-2xl font-black text-white">What does this state teach?</h2>
                <p className="mt-4 text-sm leading-7 text-slate-300">{activeRoute.lesson}</p>
              </article>
            </section>

            <section className="rounded-[34px] border border-white/10 bg-[#07111f]/80 p-6 shadow-[0_28px_90px_rgba(0,0,0,0.3)] backdrop-blur-2xl sm:p-8 lg:p-10">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.26em] text-cyan-300">Learner analysis</p>
                  <h2 className="mt-3 text-2xl font-black text-white sm:text-3xl">Preserve your reading of the route.</h2>
                </div>
                <span className="text-xs font-bold text-slate-500">Saved locally</span>
              </div>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-400">
                Identify the earliest failed or limited condition, explain why the final state follows, and state what evidence or authority would be required to change it.
              </p>

              <textarea
                id="route-notes"
                value={notes[activeRoute.id] ?? ""}
                onChange={(event) => {
                  setNotes((current) => ({ ...current, [activeRoute.id]: event.target.value }));
                  setSaveState("idle");
                }}
                rows={8}
                className="mt-6 w-full resize-y rounded-[24px] border border-white/10 bg-black/25 p-5 text-sm leading-7 text-white shadow-inner shadow-black/20 outline-none transition placeholder:text-slate-600 focus:border-cyan-300/40 focus:ring-4 focus:ring-cyan-300/[0.06]"
                placeholder="Example: The route cannot proceed because continuity was not revalidated after the identity state changed. The repair condition is..."
              />

              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={() => toggleCompleted(activeRoute.id)}
                  className={`rounded-2xl border px-5 py-3 text-sm font-black transition ${
                    completed.includes(activeRoute.id)
                      ? "border-emerald-300/30 bg-emerald-300/10 text-emerald-100"
                      : "border-white/10 bg-white/[0.04] text-white hover:border-cyan-300/35 hover:bg-cyan-300/[0.07]"
                  }`}
                >
                  {completed.includes(activeRoute.id) ? "Reviewed ✓" : "Mark example reviewed"}
                </button>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  {saveState === "saved" ? <span className="text-xs font-bold text-emerald-200">Progress preserved.</span> : null}
                  {saveState === "error" ? <span className="text-xs font-bold text-rose-200">Progress could not be saved.</span> : null}
                  <button
                    type="button"
                    onClick={saveProgress}
                    className="rounded-2xl bg-gradient-to-r from-cyan-300 to-sky-300 px-6 py-3 text-sm font-black text-slate-950 shadow-[0_16px_45px_rgba(34,211,238,0.2)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_55px_rgba(34,211,238,0.28)]"
                  >
                    Save progress
                  </button>
                </div>
              </div>
            </section>

            <section className="rounded-[34px] border border-white/10 bg-[#07111f]/76 p-6 shadow-[0_28px_90px_rgba(0,0,0,0.3)] backdrop-blur-2xl sm:p-8 lg:p-10">
              <SectionHeading
                eyebrow="Canonical reading protocol"
                title="Twelve moves from proposed consequence to proof boundary."
                copy="Use this sequence whenever you inspect a governed route. The order matters because a later success cannot repair an earlier unsupported condition."
              />
              <div className="mt-8 grid gap-5 lg:grid-cols-2 2xl:grid-cols-3">
                {readingProtocol.map((step) => <ProtocolCard key={step.id} step={step} />)}
              </div>
            </section>

            <section className="rounded-[34px] border border-white/10 bg-[#07111f]/74 p-6 shadow-[0_28px_90px_rgba(0,0,0,0.28)] backdrop-blur-2xl sm:p-8 lg:p-10">
              <SectionHeading
                eyebrow="Determination doctrine"
                title="Read the state by its execution consequence."
                copy="A determination is not a label. Each state constrains the next action and must produce a different technical effect."
              />
              <div className="mt-8 grid gap-5 xl:grid-cols-2">
                {DETERMINATION_ORDER.map((state) => <StateDoctrine key={state} state={state} />)}
              </div>
            </section>

            <section className="rounded-[34px] border border-white/10 bg-[#07111f]/76 p-6 shadow-[0_28px_90px_rgba(0,0,0,0.3)] backdrop-blur-2xl sm:p-8 lg:p-10">
              <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
                <SectionHeading
                  eyebrow="Failure-pattern library"
                  title="Recognize where routes break before consequence binds."
                  copy="Search thirty-two institutional reading patterns across the complete execution chain. Each pattern names the visible signal, consequence, and repair discipline."
                />
                <div className="grid gap-3 sm:grid-cols-[220px_190px]">
                  <input value={patternQuery} onChange={(event) => setPatternQuery(event.target.value)} placeholder="Search patterns" className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-300/35" />
                  <select value={patternLink} onChange={(event) => setPatternLink(event.target.value)} className="rounded-2xl border border-white/10 bg-[#081321] px-4 py-3 text-sm text-white outline-none focus:border-cyan-300/35">
                    <option value="ALL">All chain links</option>
                    {CHAIN_ORDER.map((link) => <option key={link} value={link}>{link}</option>)}
                  </select>
                </div>
              </div>
              <div className="mt-5 flex items-center justify-between rounded-2xl border border-white/8 bg-black/20 px-4 py-3">
                <p className="text-xs text-slate-400">Showing <strong className="text-white">{filteredPatterns.length}</strong> patterns</p>
                <button type="button" onClick={() => { setPatternQuery(""); setPatternLink("ALL"); }} className="text-xs font-black text-cyan-200 hover:text-white">Reset filters</button>
              </div>
              <div className="mt-6 grid gap-4 lg:grid-cols-2">
                {filteredPatterns.map((pattern) => (
                  <details key={pattern.id} className="group rounded-[24px] border border-white/10 bg-white/[0.03] p-5 open:border-cyan-300/20 open:bg-white/[0.05]">
                    <summary className="cursor-pointer list-none">
                      <div className="flex items-start justify-between gap-4">
                        <div><p className="text-[9px] font-black uppercase tracking-[0.2em] text-cyan-300">{pattern.chainLink} · {pattern.id}</p><h3 className="mt-2 text-lg font-black text-white">{pattern.title}</h3></div>
                        <span className={`rounded-full border px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.14em] ${pattern.severity === "critical" ? "border-rose-300/25 bg-rose-300/[0.07] text-rose-200" : pattern.severity === "blocking" ? "border-amber-300/25 bg-amber-300/[0.07] text-amber-200" : "border-cyan-300/25 bg-cyan-300/[0.07] text-cyan-200"}`}>{pattern.severity}</span>
                      </div>
                    </summary>
                    <div className="mt-5 grid gap-4 border-t border-white/8 pt-5 md:grid-cols-3">
                      <div><p className="text-[9px] font-black uppercase tracking-[0.18em] text-slate-500">Visible signal</p><p className="mt-2 text-sm leading-6 text-slate-300">{pattern.signal}</p></div>
                      <div><p className="text-[9px] font-black uppercase tracking-[0.18em] text-slate-500">Consequence</p><p className="mt-2 text-sm leading-6 text-slate-300">{pattern.consequence}</p></div>
                      <div><p className="text-[9px] font-black uppercase tracking-[0.18em] text-emerald-200">Repair discipline</p><p className="mt-2 text-sm leading-6 text-slate-300">{pattern.repair}</p></div>
                    </div>
                  </details>
                ))}
              </div>
            </section>

            <section className="rounded-[34px] border border-white/10 bg-[#07111f]/74 p-6 shadow-[0_28px_90px_rgba(0,0,0,0.28)] backdrop-blur-2xl sm:p-8 lg:p-10">
              <SectionHeading
                eyebrow="Reviewer question bank"
                title="Twenty-four questions that expose route theater."
                copy="Use these prompts during peer review, assessment, independent inspection, or before accepting a route as execution proof."
              />
              <div className="mt-8 overflow-hidden rounded-[26px] border border-white/10">
                <div className="hidden grid-cols-[150px_1fr_1fr] gap-4 border-b border-white/10 bg-white/[0.04] px-5 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 md:grid">
                  <span>Domain</span><span>Inspection question</span><span>Expected reading</span>
                </div>
                {reviewQuestions.map((item, index) => (
                  <article key={item.id} className={`grid gap-4 px-5 py-5 md:grid-cols-[150px_1fr_1fr] ${index !== reviewQuestions.length - 1 ? "border-b border-white/8" : ""}`}>
                    <div><span className="rounded-full border border-cyan-300/20 bg-cyan-300/[0.06] px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.16em] text-cyan-200">{item.category}</span></div>
                    <p className="text-sm font-bold leading-6 text-white">{item.question}</p>
                    <p className="text-sm leading-6 text-slate-400">{item.expectedReading}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="rounded-[34px] border border-white/10 bg-[#07111f]/76 p-6 shadow-[0_28px_90px_rgba(0,0,0,0.3)] backdrop-blur-2xl sm:p-8 lg:p-10">
              <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
                <SectionHeading
                  eyebrow="Route-reading glossary"
                  title="Use the institution's terms precisely."
                  copy="Search the core vocabulary used throughout the Academy, Exchange, artifact engine, review lanes, and verification surfaces."
                />
                <input value={glossaryQuery} onChange={(event) => setGlossaryQuery(event.target.value)} placeholder="Search glossary" className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-300/35 xl:max-w-xs" />
              </div>
              <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {filteredGlossary.map((entry) => (
                  <article key={entry.term} className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5 transition hover:-translate-y-0.5 hover:border-cyan-300/20 hover:bg-white/[0.05]">
                    <h3 className="text-lg font-black text-white">{entry.term}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-300">{entry.definition}</p>
                    <div className="mt-4 border-t border-white/8 pt-4"><p className="text-[9px] font-black uppercase tracking-[0.18em] text-cyan-300">Reading use</p><p className="mt-2 text-sm leading-6 text-slate-400">{entry.readingUse}</p></div>
                  </article>
                ))}
              </div>
            </section>

            <section className="relative overflow-hidden rounded-[34px] border border-cyan-300/15 bg-gradient-to-br from-cyan-300/[0.08] via-[#07111f] to-violet-300/[0.07] p-7 shadow-[0_28px_90px_rgba(0,0,0,0.3)] sm:p-9">
              <div className="absolute right-0 top-0 h-44 w-44 rounded-full bg-cyan-300/10 blur-3xl" />
              <div className="relative grid gap-7 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.26em] text-cyan-300">Reading discipline</p>
                  <h2 className="mt-3 text-3xl font-black tracking-tight text-white">Do not begin with the desired outcome.</h2>
                  <p className="mt-4 max-w-4xl text-sm leading-7 text-slate-300">
                    Read from reality forward. A favorable objective cannot repair missing evidence, broken continuity, invalid authority, or execution beyond the committed boundary.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                  <Link href="/academy/governance-thinking" className="rounded-2xl border border-white/12 bg-white/[0.05] px-5 py-3 text-center text-sm font-black text-white transition hover:border-cyan-300/35 hover:bg-cyan-300/[0.07]">
                    Return to Governance Thinking
                  </Link>
                  <Link href="/academy/simulator" className="rounded-2xl bg-white px-5 py-3 text-center text-sm font-black text-slate-950 transition hover:-translate-y-0.5">
                    Continue to Simulation Center →
                  </Link>
                </div>
              </div>
            </section>
          </div>
        </section>

        <footer className="mt-8 border-t border-white/10 py-7 text-center">
          <p className="text-sm font-black text-white">No admissible evidence. No admissible execution.</p>
          <p className="mt-2 text-xs leading-6 text-slate-500">Route completion reflects learner analysis and does not grant operational authority.</p>
        </footer>
      </div>
    </main>
  );
}
