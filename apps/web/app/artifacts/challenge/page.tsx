"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";

type Determination = "ALLOW" | "HOLD" | "DENY" | "ESCALATE";
type ChallengeState = "DRAFT" | "SUBMITTED" | "UNDER_REVIEW" | "UPHELD" | "MODIFIED" | "REVERSED" | "CLOSED";
type View = "command" | "builder" | "comparison" | "custody" | "review" | "resolution" | "history";
type ArtifactRef = { id: string; title: string; determination: Determination; route: string; receipt: string; rootHash: string; };
type ChallengeRecord = { id: string; artifactId: string; title: string; state: ChallengeState; submittedBy: string; submittedAt: string; basis: string; requestedRelief: string; evidenceCount: number; assignedReviewer: string; dueAt: string; };
type EvidenceItem = { id: string; title: string; source: string; capturedAt: string; disclosure: "PUBLIC" | "RESTRICTED" | "WITHHELD"; admissibility: "PENDING" | "ADMITTED" | "REJECTED"; hash: string; notes: string; };
type CustodyEvent = { sequence: number; time: string; actor: string; action: string; object: string; result: string; hash: string; };
type ReviewQuestion = { id: string; domain: string; question: string; passCondition: string; failureEffect: string; };

const ARTIFACTS: ArtifactRef[] = [
  {
    id: "TA14-EA-000001",
    title: "Authorized release with verified outcome",
    determination: "ALLOW",
    route: "TA14-ROUTE-ALLOW-000001",
    receipt: "HTTP 202 · TA14-RECEIPT-000001",
    rootHash: "01".repeat(32),
  },
  {
    id: "TA14-EA-000002",
    title: "Authority drift before execution",
    determination: "HOLD",
    route: "TA14-ROUTE-HOLD-000002",
    receipt: "HTTP 423 · TA14-RECEIPT-000002",
    rootHash: "02".repeat(32),
  },
  {
    id: "TA14-EA-000003",
    title: "Execution boundary violation prevented",
    determination: "DENY",
    route: "TA14-ROUTE-DENY-000003",
    receipt: "HTTP 403 · TA14-RECEIPT-000003",
    rootHash: "03".repeat(32),
  },
  {
    id: "TA14-EA-000004",
    title: "Conflicting admissible evidence escalated",
    determination: "ESCALATE",
    route: "TA14-ROUTE-ESCALATE-000004",
    receipt: "HTTP 202 · TA14-RECEIPT-000004",
    rootHash: "04".repeat(32),
  },
  {
    id: "TA14-EA-000005",
    title: "Evidence freshness expired before commit",
    determination: "ALLOW",
    route: "TA14-ROUTE-ALLOW-000005",
    receipt: "HTTP 202 · TA14-RECEIPT-000005",
    rootHash: "05".repeat(32),
  },
  {
    id: "TA14-EA-000006",
    title: "Unauthorized runtime version denied",
    determination: "HOLD",
    route: "TA14-ROUTE-HOLD-000006",
    receipt: "HTTP 423 · TA14-RECEIPT-000006",
    rootHash: "06".repeat(32),
  },
  {
    id: "TA14-EA-000007",
    title: "Authorized threshold exceeded",
    determination: "DENY",
    route: "TA14-ROUTE-DENY-000007",
    receipt: "HTTP 403 · TA14-RECEIPT-000007",
    rootHash: "07".repeat(32),
  },
  {
    id: "TA14-EA-000008",
    title: "Material condition changed after approval",
    determination: "ESCALATE",
    route: "TA14-ROUTE-ESCALATE-000008",
    receipt: "HTTP 202 · TA14-RECEIPT-000008",
    rootHash: "08".repeat(32),
  },
  {
    id: "TA14-EA-000009",
    title: "Mandatory gate bypass attempt prevented",
    determination: "ALLOW",
    route: "TA14-ROUTE-ALLOW-000009",
    receipt: "HTTP 202 · TA14-RECEIPT-000009",
    rootHash: "09".repeat(32),
  },
  {
    id: "TA14-EA-000010",
    title: "Dual-authority privileged access restoration",
    determination: "HOLD",
    route: "TA14-ROUTE-HOLD-000010",
    receipt: "HTTP 423 · TA14-RECEIPT-000010",
    rootHash: "0a".repeat(32),
  },
  {
    id: "TA14-EA-000011",
    title: "Confidential evidence verified without disclosure",
    determination: "DENY",
    route: "TA14-ROUTE-DENY-000011",
    receipt: "HTTP 403 · TA14-RECEIPT-000011",
    rootHash: "0b".repeat(32),
  },
  {
    id: "TA14-EA-000012",
    title: "Preserved chain-of-custody closure certificate",
    determination: "ESCALATE",
    route: "TA14-ROUTE-ESCALATE-000012",
    receipt: "HTTP 202 · TA14-RECEIPT-000012",
    rootHash: "0c".repeat(32),
  },
];

const INITIAL_CHALLENGES: ChallengeRecord[] = [
  {
    id: "TA14-CH-000001",
    artifactId: "TA14-EA-000001",
    title: "Bounded challenge review 01",
    state: "SUBMITTED",
    submittedBy: "Independent reviewer 01",
    submittedAt: "2026-08-02T11:00:00Z",
    basis: "Challenge 01 tests evidence parity, authority scope, route correspondence, execution effect, and outcome closure without rewriting the original record.",
    requestedRelief: "Append a bounded finding and, when supported, issue a correction or supersession notice for review item 01.",
    evidenceCount: 4,
    assignedReviewer: "TA-14 challenge officer 01",
    dueAt: "2026-08-13T17:00:00Z",
  },
  {
    id: "TA14-CH-000002",
    artifactId: "TA14-EA-000002",
    title: "Bounded challenge review 02",
    state: "UPHELD",
    submittedBy: "Independent reviewer 02",
    submittedAt: "2026-08-03T12:00:00Z",
    basis: "Challenge 02 tests evidence parity, authority scope, route correspondence, execution effect, and outcome closure without rewriting the original record.",
    requestedRelief: "Append a bounded finding and, when supported, issue a correction or supersession notice for review item 02.",
    evidenceCount: 5,
    assignedReviewer: "TA-14 challenge officer 02",
    dueAt: "2026-08-14T17:00:00Z",
  },
  {
    id: "TA14-CH-000003",
    artifactId: "TA14-EA-000003",
    title: "Bounded challenge review 03",
    state: "MODIFIED",
    submittedBy: "Independent reviewer 03",
    submittedAt: "2026-08-04T13:00:00Z",
    basis: "Challenge 03 tests evidence parity, authority scope, route correspondence, execution effect, and outcome closure without rewriting the original record.",
    requestedRelief: "Append a bounded finding and, when supported, issue a correction or supersession notice for review item 03.",
    evidenceCount: 6,
    assignedReviewer: "TA-14 challenge officer 03",
    dueAt: "2026-08-15T17:00:00Z",
  },
  {
    id: "TA14-CH-000004",
    artifactId: "TA14-EA-000004",
    title: "Bounded challenge review 04",
    state: "CLOSED",
    submittedBy: "Independent reviewer 04",
    submittedAt: "2026-08-05T14:00:00Z",
    basis: "Challenge 04 tests evidence parity, authority scope, route correspondence, execution effect, and outcome closure without rewriting the original record.",
    requestedRelief: "Append a bounded finding and, when supported, issue a correction or supersession notice for review item 04.",
    evidenceCount: 7,
    assignedReviewer: "TA-14 challenge officer 04",
    dueAt: "2026-08-16T17:00:00Z",
  },
  {
    id: "TA14-CH-000005",
    artifactId: "TA14-EA-000005",
    title: "Bounded challenge review 05",
    state: "UNDER_REVIEW",
    submittedBy: "Independent reviewer 05",
    submittedAt: "2026-08-06T15:00:00Z",
    basis: "Challenge 05 tests evidence parity, authority scope, route correspondence, execution effect, and outcome closure without rewriting the original record.",
    requestedRelief: "Append a bounded finding and, when supported, issue a correction or supersession notice for review item 05.",
    evidenceCount: 8,
    assignedReviewer: "TA-14 challenge officer 05",
    dueAt: "2026-08-17T17:00:00Z",
  },
  {
    id: "TA14-CH-000006",
    artifactId: "TA14-EA-000006",
    title: "Bounded challenge review 06",
    state: "SUBMITTED",
    submittedBy: "Independent reviewer 06",
    submittedAt: "2026-08-07T16:00:00Z",
    basis: "Challenge 06 tests evidence parity, authority scope, route correspondence, execution effect, and outcome closure without rewriting the original record.",
    requestedRelief: "Append a bounded finding and, when supported, issue a correction or supersession notice for review item 06.",
    evidenceCount: 3,
    assignedReviewer: "TA-14 challenge officer 06",
    dueAt: "2026-08-18T17:00:00Z",
  },
  {
    id: "TA14-CH-000007",
    artifactId: "TA14-EA-000007",
    title: "Bounded challenge review 07",
    state: "UPHELD",
    submittedBy: "Independent reviewer 07",
    submittedAt: "2026-08-08T17:00:00Z",
    basis: "Challenge 07 tests evidence parity, authority scope, route correspondence, execution effect, and outcome closure without rewriting the original record.",
    requestedRelief: "Append a bounded finding and, when supported, issue a correction or supersession notice for review item 07.",
    evidenceCount: 4,
    assignedReviewer: "TA-14 challenge officer 07",
    dueAt: "2026-08-19T17:00:00Z",
  },
  {
    id: "TA14-CH-000008",
    artifactId: "TA14-EA-000008",
    title: "Bounded challenge review 08",
    state: "MODIFIED",
    submittedBy: "Independent reviewer 08",
    submittedAt: "2026-08-09T18:00:00Z",
    basis: "Challenge 08 tests evidence parity, authority scope, route correspondence, execution effect, and outcome closure without rewriting the original record.",
    requestedRelief: "Append a bounded finding and, when supported, issue a correction or supersession notice for review item 08.",
    evidenceCount: 5,
    assignedReviewer: "TA-14 challenge officer 08",
    dueAt: "2026-08-20T17:00:00Z",
  },
  {
    id: "TA14-CH-000009",
    artifactId: "TA14-EA-000009",
    title: "Bounded challenge review 09",
    state: "CLOSED",
    submittedBy: "Independent reviewer 09",
    submittedAt: "2026-08-01T19:00:00Z",
    basis: "Challenge 09 tests evidence parity, authority scope, route correspondence, execution effect, and outcome closure without rewriting the original record.",
    requestedRelief: "Append a bounded finding and, when supported, issue a correction or supersession notice for review item 09.",
    evidenceCount: 6,
    assignedReviewer: "TA-14 challenge officer 09",
    dueAt: "2026-08-12T17:00:00Z",
  },
  {
    id: "TA14-CH-000010",
    artifactId: "TA14-EA-000010",
    title: "Bounded challenge review 10",
    state: "UNDER_REVIEW",
    submittedBy: "Independent reviewer 10",
    submittedAt: "2026-08-02T10:00:00Z",
    basis: "Challenge 10 tests evidence parity, authority scope, route correspondence, execution effect, and outcome closure without rewriting the original record.",
    requestedRelief: "Append a bounded finding and, when supported, issue a correction or supersession notice for review item 10.",
    evidenceCount: 7,
    assignedReviewer: "TA-14 challenge officer 10",
    dueAt: "2026-08-13T17:00:00Z",
  },
  {
    id: "TA14-CH-000011",
    artifactId: "TA14-EA-000011",
    title: "Bounded challenge review 11",
    state: "SUBMITTED",
    submittedBy: "Independent reviewer 11",
    submittedAt: "2026-08-03T11:00:00Z",
    basis: "Challenge 11 tests evidence parity, authority scope, route correspondence, execution effect, and outcome closure without rewriting the original record.",
    requestedRelief: "Append a bounded finding and, when supported, issue a correction or supersession notice for review item 11.",
    evidenceCount: 8,
    assignedReviewer: "TA-14 challenge officer 11",
    dueAt: "2026-08-14T17:00:00Z",
  },
  {
    id: "TA14-CH-000012",
    artifactId: "TA14-EA-000012",
    title: "Bounded challenge review 12",
    state: "UPHELD",
    submittedBy: "Independent reviewer 12",
    submittedAt: "2026-08-04T12:00:00Z",
    basis: "Challenge 12 tests evidence parity, authority scope, route correspondence, execution effect, and outcome closure without rewriting the original record.",
    requestedRelief: "Append a bounded finding and, when supported, issue a correction or supersession notice for review item 12.",
    evidenceCount: 3,
    assignedReviewer: "TA-14 challenge officer 12",
    dueAt: "2026-08-15T17:00:00Z",
  },
];

const REVIEW_QUESTIONS: ReviewQuestion[] = [
  {
    id: "RQ-001",
    domain: "IDENTITY",
    question: "Review question 001: does the challenged record preserve the exact identity condition required for this consequence?",
    passCondition: "The original record, challenge evidence, hashes, custody, and reviewer finding remain attributable and mutually consistent for checkpoint 001.",
    failureEffect: "Hold resolution at checkpoint 001; preserve the conflict and require a bounded correction, supersession, or withdrawal decision.",
  },
  {
    id: "RQ-002",
    domain: "RECORD",
    question: "Review question 002: does the challenged record preserve the exact record condition required for this consequence?",
    passCondition: "The original record, challenge evidence, hashes, custody, and reviewer finding remain attributable and mutually consistent for checkpoint 002.",
    failureEffect: "Hold resolution at checkpoint 002; preserve the conflict and require a bounded correction, supersession, or withdrawal decision.",
  },
  {
    id: "RQ-003",
    domain: "CONTINUITY",
    question: "Review question 003: does the challenged record preserve the exact continuity condition required for this consequence?",
    passCondition: "The original record, challenge evidence, hashes, custody, and reviewer finding remain attributable and mutually consistent for checkpoint 003.",
    failureEffect: "Hold resolution at checkpoint 003; preserve the conflict and require a bounded correction, supersession, or withdrawal decision.",
  },
  {
    id: "RQ-004",
    domain: "ADMISSIBILITY",
    question: "Review question 004: does the challenged record preserve the exact admissibility condition required for this consequence?",
    passCondition: "The original record, challenge evidence, hashes, custody, and reviewer finding remain attributable and mutually consistent for checkpoint 004.",
    failureEffect: "Hold resolution at checkpoint 004; preserve the conflict and require a bounded correction, supersession, or withdrawal decision.",
  },
  {
    id: "RQ-005",
    domain: "AUTHORITY",
    question: "Review question 005: does the challenged record preserve the exact authority condition required for this consequence?",
    passCondition: "The original record, challenge evidence, hashes, custody, and reviewer finding remain attributable and mutually consistent for checkpoint 005.",
    failureEffect: "Hold resolution at checkpoint 005; preserve the conflict and require a bounded correction, supersession, or withdrawal decision.",
  },
  {
    id: "RQ-006",
    domain: "BINDING",
    question: "Review question 006: does the challenged record preserve the exact binding condition required for this consequence?",
    passCondition: "The original record, challenge evidence, hashes, custody, and reviewer finding remain attributable and mutually consistent for checkpoint 006.",
    failureEffect: "Hold resolution at checkpoint 006; preserve the conflict and require a bounded correction, supersession, or withdrawal decision.",
  },
  {
    id: "RQ-007",
    domain: "COMMIT",
    question: "Review question 007: does the challenged record preserve the exact commit condition required for this consequence?",
    passCondition: "The original record, challenge evidence, hashes, custody, and reviewer finding remain attributable and mutually consistent for checkpoint 007.",
    failureEffect: "Hold resolution at checkpoint 007; preserve the conflict and require a bounded correction, supersession, or withdrawal decision.",
  },
  {
    id: "RQ-008",
    domain: "EXECUTION",
    question: "Review question 008: does the challenged record preserve the exact execution condition required for this consequence?",
    passCondition: "The original record, challenge evidence, hashes, custody, and reviewer finding remain attributable and mutually consistent for checkpoint 008.",
    failureEffect: "Hold resolution at checkpoint 008; preserve the conflict and require a bounded correction, supersession, or withdrawal decision.",
  },
  {
    id: "RQ-009",
    domain: "OUTCOME",
    question: "Review question 009: does the challenged record preserve the exact outcome condition required for this consequence?",
    passCondition: "The original record, challenge evidence, hashes, custody, and reviewer finding remain attributable and mutually consistent for checkpoint 009.",
    failureEffect: "Hold resolution at checkpoint 009; preserve the conflict and require a bounded correction, supersession, or withdrawal decision.",
  },
  {
    id: "RQ-010",
    domain: "INTEGRITY",
    question: "Review question 010: does the challenged record preserve the exact integrity condition required for this consequence?",
    passCondition: "The original record, challenge evidence, hashes, custody, and reviewer finding remain attributable and mutually consistent for checkpoint 010.",
    failureEffect: "Hold resolution at checkpoint 010; preserve the conflict and require a bounded correction, supersession, or withdrawal decision.",
  },
  {
    id: "RQ-011",
    domain: "IDENTITY",
    question: "Review question 011: does the challenged record preserve the exact identity condition required for this consequence?",
    passCondition: "The original record, challenge evidence, hashes, custody, and reviewer finding remain attributable and mutually consistent for checkpoint 011.",
    failureEffect: "Hold resolution at checkpoint 011; preserve the conflict and require a bounded correction, supersession, or withdrawal decision.",
  },
  {
    id: "RQ-012",
    domain: "RECORD",
    question: "Review question 012: does the challenged record preserve the exact record condition required for this consequence?",
    passCondition: "The original record, challenge evidence, hashes, custody, and reviewer finding remain attributable and mutually consistent for checkpoint 012.",
    failureEffect: "Hold resolution at checkpoint 012; preserve the conflict and require a bounded correction, supersession, or withdrawal decision.",
  },
  {
    id: "RQ-013",
    domain: "CONTINUITY",
    question: "Review question 013: does the challenged record preserve the exact continuity condition required for this consequence?",
    passCondition: "The original record, challenge evidence, hashes, custody, and reviewer finding remain attributable and mutually consistent for checkpoint 013.",
    failureEffect: "Hold resolution at checkpoint 013; preserve the conflict and require a bounded correction, supersession, or withdrawal decision.",
  },
  {
    id: "RQ-014",
    domain: "ADMISSIBILITY",
    question: "Review question 014: does the challenged record preserve the exact admissibility condition required for this consequence?",
    passCondition: "The original record, challenge evidence, hashes, custody, and reviewer finding remain attributable and mutually consistent for checkpoint 014.",
    failureEffect: "Hold resolution at checkpoint 014; preserve the conflict and require a bounded correction, supersession, or withdrawal decision.",
  },
  {
    id: "RQ-015",
    domain: "AUTHORITY",
    question: "Review question 015: does the challenged record preserve the exact authority condition required for this consequence?",
    passCondition: "The original record, challenge evidence, hashes, custody, and reviewer finding remain attributable and mutually consistent for checkpoint 015.",
    failureEffect: "Hold resolution at checkpoint 015; preserve the conflict and require a bounded correction, supersession, or withdrawal decision.",
  },
  {
    id: "RQ-016",
    domain: "BINDING",
    question: "Review question 016: does the challenged record preserve the exact binding condition required for this consequence?",
    passCondition: "The original record, challenge evidence, hashes, custody, and reviewer finding remain attributable and mutually consistent for checkpoint 016.",
    failureEffect: "Hold resolution at checkpoint 016; preserve the conflict and require a bounded correction, supersession, or withdrawal decision.",
  },
  {
    id: "RQ-017",
    domain: "COMMIT",
    question: "Review question 017: does the challenged record preserve the exact commit condition required for this consequence?",
    passCondition: "The original record, challenge evidence, hashes, custody, and reviewer finding remain attributable and mutually consistent for checkpoint 017.",
    failureEffect: "Hold resolution at checkpoint 017; preserve the conflict and require a bounded correction, supersession, or withdrawal decision.",
  },
  {
    id: "RQ-018",
    domain: "EXECUTION",
    question: "Review question 018: does the challenged record preserve the exact execution condition required for this consequence?",
    passCondition: "The original record, challenge evidence, hashes, custody, and reviewer finding remain attributable and mutually consistent for checkpoint 018.",
    failureEffect: "Hold resolution at checkpoint 018; preserve the conflict and require a bounded correction, supersession, or withdrawal decision.",
  },
  {
    id: "RQ-019",
    domain: "OUTCOME",
    question: "Review question 019: does the challenged record preserve the exact outcome condition required for this consequence?",
    passCondition: "The original record, challenge evidence, hashes, custody, and reviewer finding remain attributable and mutually consistent for checkpoint 019.",
    failureEffect: "Hold resolution at checkpoint 019; preserve the conflict and require a bounded correction, supersession, or withdrawal decision.",
  },
  {
    id: "RQ-020",
    domain: "INTEGRITY",
    question: "Review question 020: does the challenged record preserve the exact integrity condition required for this consequence?",
    passCondition: "The original record, challenge evidence, hashes, custody, and reviewer finding remain attributable and mutually consistent for checkpoint 020.",
    failureEffect: "Hold resolution at checkpoint 020; preserve the conflict and require a bounded correction, supersession, or withdrawal decision.",
  },
  {
    id: "RQ-021",
    domain: "IDENTITY",
    question: "Review question 021: does the challenged record preserve the exact identity condition required for this consequence?",
    passCondition: "The original record, challenge evidence, hashes, custody, and reviewer finding remain attributable and mutually consistent for checkpoint 021.",
    failureEffect: "Hold resolution at checkpoint 021; preserve the conflict and require a bounded correction, supersession, or withdrawal decision.",
  },
  {
    id: "RQ-022",
    domain: "RECORD",
    question: "Review question 022: does the challenged record preserve the exact record condition required for this consequence?",
    passCondition: "The original record, challenge evidence, hashes, custody, and reviewer finding remain attributable and mutually consistent for checkpoint 022.",
    failureEffect: "Hold resolution at checkpoint 022; preserve the conflict and require a bounded correction, supersession, or withdrawal decision.",
  },
  {
    id: "RQ-023",
    domain: "CONTINUITY",
    question: "Review question 023: does the challenged record preserve the exact continuity condition required for this consequence?",
    passCondition: "The original record, challenge evidence, hashes, custody, and reviewer finding remain attributable and mutually consistent for checkpoint 023.",
    failureEffect: "Hold resolution at checkpoint 023; preserve the conflict and require a bounded correction, supersession, or withdrawal decision.",
  },
  {
    id: "RQ-024",
    domain: "ADMISSIBILITY",
    question: "Review question 024: does the challenged record preserve the exact admissibility condition required for this consequence?",
    passCondition: "The original record, challenge evidence, hashes, custody, and reviewer finding remain attributable and mutually consistent for checkpoint 024.",
    failureEffect: "Hold resolution at checkpoint 024; preserve the conflict and require a bounded correction, supersession, or withdrawal decision.",
  },
  {
    id: "RQ-025",
    domain: "AUTHORITY",
    question: "Review question 025: does the challenged record preserve the exact authority condition required for this consequence?",
    passCondition: "The original record, challenge evidence, hashes, custody, and reviewer finding remain attributable and mutually consistent for checkpoint 025.",
    failureEffect: "Hold resolution at checkpoint 025; preserve the conflict and require a bounded correction, supersession, or withdrawal decision.",
  },
  {
    id: "RQ-026",
    domain: "BINDING",
    question: "Review question 026: does the challenged record preserve the exact binding condition required for this consequence?",
    passCondition: "The original record, challenge evidence, hashes, custody, and reviewer finding remain attributable and mutually consistent for checkpoint 026.",
    failureEffect: "Hold resolution at checkpoint 026; preserve the conflict and require a bounded correction, supersession, or withdrawal decision.",
  },
  {
    id: "RQ-027",
    domain: "COMMIT",
    question: "Review question 027: does the challenged record preserve the exact commit condition required for this consequence?",
    passCondition: "The original record, challenge evidence, hashes, custody, and reviewer finding remain attributable and mutually consistent for checkpoint 027.",
    failureEffect: "Hold resolution at checkpoint 027; preserve the conflict and require a bounded correction, supersession, or withdrawal decision.",
  },
  {
    id: "RQ-028",
    domain: "EXECUTION",
    question: "Review question 028: does the challenged record preserve the exact execution condition required for this consequence?",
    passCondition: "The original record, challenge evidence, hashes, custody, and reviewer finding remain attributable and mutually consistent for checkpoint 028.",
    failureEffect: "Hold resolution at checkpoint 028; preserve the conflict and require a bounded correction, supersession, or withdrawal decision.",
  },
  {
    id: "RQ-029",
    domain: "OUTCOME",
    question: "Review question 029: does the challenged record preserve the exact outcome condition required for this consequence?",
    passCondition: "The original record, challenge evidence, hashes, custody, and reviewer finding remain attributable and mutually consistent for checkpoint 029.",
    failureEffect: "Hold resolution at checkpoint 029; preserve the conflict and require a bounded correction, supersession, or withdrawal decision.",
  },
  {
    id: "RQ-030",
    domain: "INTEGRITY",
    question: "Review question 030: does the challenged record preserve the exact integrity condition required for this consequence?",
    passCondition: "The original record, challenge evidence, hashes, custody, and reviewer finding remain attributable and mutually consistent for checkpoint 030.",
    failureEffect: "Hold resolution at checkpoint 030; preserve the conflict and require a bounded correction, supersession, or withdrawal decision.",
  },
  {
    id: "RQ-031",
    domain: "IDENTITY",
    question: "Review question 031: does the challenged record preserve the exact identity condition required for this consequence?",
    passCondition: "The original record, challenge evidence, hashes, custody, and reviewer finding remain attributable and mutually consistent for checkpoint 031.",
    failureEffect: "Hold resolution at checkpoint 031; preserve the conflict and require a bounded correction, supersession, or withdrawal decision.",
  },
  {
    id: "RQ-032",
    domain: "RECORD",
    question: "Review question 032: does the challenged record preserve the exact record condition required for this consequence?",
    passCondition: "The original record, challenge evidence, hashes, custody, and reviewer finding remain attributable and mutually consistent for checkpoint 032.",
    failureEffect: "Hold resolution at checkpoint 032; preserve the conflict and require a bounded correction, supersession, or withdrawal decision.",
  },
  {
    id: "RQ-033",
    domain: "CONTINUITY",
    question: "Review question 033: does the challenged record preserve the exact continuity condition required for this consequence?",
    passCondition: "The original record, challenge evidence, hashes, custody, and reviewer finding remain attributable and mutually consistent for checkpoint 033.",
    failureEffect: "Hold resolution at checkpoint 033; preserve the conflict and require a bounded correction, supersession, or withdrawal decision.",
  },
  {
    id: "RQ-034",
    domain: "ADMISSIBILITY",
    question: "Review question 034: does the challenged record preserve the exact admissibility condition required for this consequence?",
    passCondition: "The original record, challenge evidence, hashes, custody, and reviewer finding remain attributable and mutually consistent for checkpoint 034.",
    failureEffect: "Hold resolution at checkpoint 034; preserve the conflict and require a bounded correction, supersession, or withdrawal decision.",
  },
  {
    id: "RQ-035",
    domain: "AUTHORITY",
    question: "Review question 035: does the challenged record preserve the exact authority condition required for this consequence?",
    passCondition: "The original record, challenge evidence, hashes, custody, and reviewer finding remain attributable and mutually consistent for checkpoint 035.",
    failureEffect: "Hold resolution at checkpoint 035; preserve the conflict and require a bounded correction, supersession, or withdrawal decision.",
  },
  {
    id: "RQ-036",
    domain: "BINDING",
    question: "Review question 036: does the challenged record preserve the exact binding condition required for this consequence?",
    passCondition: "The original record, challenge evidence, hashes, custody, and reviewer finding remain attributable and mutually consistent for checkpoint 036.",
    failureEffect: "Hold resolution at checkpoint 036; preserve the conflict and require a bounded correction, supersession, or withdrawal decision.",
  },
  {
    id: "RQ-037",
    domain: "COMMIT",
    question: "Review question 037: does the challenged record preserve the exact commit condition required for this consequence?",
    passCondition: "The original record, challenge evidence, hashes, custody, and reviewer finding remain attributable and mutually consistent for checkpoint 037.",
    failureEffect: "Hold resolution at checkpoint 037; preserve the conflict and require a bounded correction, supersession, or withdrawal decision.",
  },
  {
    id: "RQ-038",
    domain: "EXECUTION",
    question: "Review question 038: does the challenged record preserve the exact execution condition required for this consequence?",
    passCondition: "The original record, challenge evidence, hashes, custody, and reviewer finding remain attributable and mutually consistent for checkpoint 038.",
    failureEffect: "Hold resolution at checkpoint 038; preserve the conflict and require a bounded correction, supersession, or withdrawal decision.",
  },
  {
    id: "RQ-039",
    domain: "OUTCOME",
    question: "Review question 039: does the challenged record preserve the exact outcome condition required for this consequence?",
    passCondition: "The original record, challenge evidence, hashes, custody, and reviewer finding remain attributable and mutually consistent for checkpoint 039.",
    failureEffect: "Hold resolution at checkpoint 039; preserve the conflict and require a bounded correction, supersession, or withdrawal decision.",
  },
  {
    id: "RQ-040",
    domain: "INTEGRITY",
    question: "Review question 040: does the challenged record preserve the exact integrity condition required for this consequence?",
    passCondition: "The original record, challenge evidence, hashes, custody, and reviewer finding remain attributable and mutually consistent for checkpoint 040.",
    failureEffect: "Hold resolution at checkpoint 040; preserve the conflict and require a bounded correction, supersession, or withdrawal decision.",
  },
  {
    id: "RQ-041",
    domain: "IDENTITY",
    question: "Review question 041: does the challenged record preserve the exact identity condition required for this consequence?",
    passCondition: "The original record, challenge evidence, hashes, custody, and reviewer finding remain attributable and mutually consistent for checkpoint 041.",
    failureEffect: "Hold resolution at checkpoint 041; preserve the conflict and require a bounded correction, supersession, or withdrawal decision.",
  },
  {
    id: "RQ-042",
    domain: "RECORD",
    question: "Review question 042: does the challenged record preserve the exact record condition required for this consequence?",
    passCondition: "The original record, challenge evidence, hashes, custody, and reviewer finding remain attributable and mutually consistent for checkpoint 042.",
    failureEffect: "Hold resolution at checkpoint 042; preserve the conflict and require a bounded correction, supersession, or withdrawal decision.",
  },
  {
    id: "RQ-043",
    domain: "CONTINUITY",
    question: "Review question 043: does the challenged record preserve the exact continuity condition required for this consequence?",
    passCondition: "The original record, challenge evidence, hashes, custody, and reviewer finding remain attributable and mutually consistent for checkpoint 043.",
    failureEffect: "Hold resolution at checkpoint 043; preserve the conflict and require a bounded correction, supersession, or withdrawal decision.",
  },
  {
    id: "RQ-044",
    domain: "ADMISSIBILITY",
    question: "Review question 044: does the challenged record preserve the exact admissibility condition required for this consequence?",
    passCondition: "The original record, challenge evidence, hashes, custody, and reviewer finding remain attributable and mutually consistent for checkpoint 044.",
    failureEffect: "Hold resolution at checkpoint 044; preserve the conflict and require a bounded correction, supersession, or withdrawal decision.",
  },
  {
    id: "RQ-045",
    domain: "AUTHORITY",
    question: "Review question 045: does the challenged record preserve the exact authority condition required for this consequence?",
    passCondition: "The original record, challenge evidence, hashes, custody, and reviewer finding remain attributable and mutually consistent for checkpoint 045.",
    failureEffect: "Hold resolution at checkpoint 045; preserve the conflict and require a bounded correction, supersession, or withdrawal decision.",
  },
  {
    id: "RQ-046",
    domain: "BINDING",
    question: "Review question 046: does the challenged record preserve the exact binding condition required for this consequence?",
    passCondition: "The original record, challenge evidence, hashes, custody, and reviewer finding remain attributable and mutually consistent for checkpoint 046.",
    failureEffect: "Hold resolution at checkpoint 046; preserve the conflict and require a bounded correction, supersession, or withdrawal decision.",
  },
  {
    id: "RQ-047",
    domain: "COMMIT",
    question: "Review question 047: does the challenged record preserve the exact commit condition required for this consequence?",
    passCondition: "The original record, challenge evidence, hashes, custody, and reviewer finding remain attributable and mutually consistent for checkpoint 047.",
    failureEffect: "Hold resolution at checkpoint 047; preserve the conflict and require a bounded correction, supersession, or withdrawal decision.",
  },
  {
    id: "RQ-048",
    domain: "EXECUTION",
    question: "Review question 048: does the challenged record preserve the exact execution condition required for this consequence?",
    passCondition: "The original record, challenge evidence, hashes, custody, and reviewer finding remain attributable and mutually consistent for checkpoint 048.",
    failureEffect: "Hold resolution at checkpoint 048; preserve the conflict and require a bounded correction, supersession, or withdrawal decision.",
  },
  {
    id: "RQ-049",
    domain: "OUTCOME",
    question: "Review question 049: does the challenged record preserve the exact outcome condition required for this consequence?",
    passCondition: "The original record, challenge evidence, hashes, custody, and reviewer finding remain attributable and mutually consistent for checkpoint 049.",
    failureEffect: "Hold resolution at checkpoint 049; preserve the conflict and require a bounded correction, supersession, or withdrawal decision.",
  },
  {
    id: "RQ-050",
    domain: "INTEGRITY",
    question: "Review question 050: does the challenged record preserve the exact integrity condition required for this consequence?",
    passCondition: "The original record, challenge evidence, hashes, custody, and reviewer finding remain attributable and mutually consistent for checkpoint 050.",
    failureEffect: "Hold resolution at checkpoint 050; preserve the conflict and require a bounded correction, supersession, or withdrawal decision.",
  },
  {
    id: "RQ-051",
    domain: "IDENTITY",
    question: "Review question 051: does the challenged record preserve the exact identity condition required for this consequence?",
    passCondition: "The original record, challenge evidence, hashes, custody, and reviewer finding remain attributable and mutually consistent for checkpoint 051.",
    failureEffect: "Hold resolution at checkpoint 051; preserve the conflict and require a bounded correction, supersession, or withdrawal decision.",
  },
  {
    id: "RQ-052",
    domain: "RECORD",
    question: "Review question 052: does the challenged record preserve the exact record condition required for this consequence?",
    passCondition: "The original record, challenge evidence, hashes, custody, and reviewer finding remain attributable and mutually consistent for checkpoint 052.",
    failureEffect: "Hold resolution at checkpoint 052; preserve the conflict and require a bounded correction, supersession, or withdrawal decision.",
  },
  {
    id: "RQ-053",
    domain: "CONTINUITY",
    question: "Review question 053: does the challenged record preserve the exact continuity condition required for this consequence?",
    passCondition: "The original record, challenge evidence, hashes, custody, and reviewer finding remain attributable and mutually consistent for checkpoint 053.",
    failureEffect: "Hold resolution at checkpoint 053; preserve the conflict and require a bounded correction, supersession, or withdrawal decision.",
  },
  {
    id: "RQ-054",
    domain: "ADMISSIBILITY",
    question: "Review question 054: does the challenged record preserve the exact admissibility condition required for this consequence?",
    passCondition: "The original record, challenge evidence, hashes, custody, and reviewer finding remain attributable and mutually consistent for checkpoint 054.",
    failureEffect: "Hold resolution at checkpoint 054; preserve the conflict and require a bounded correction, supersession, or withdrawal decision.",
  },
  {
    id: "RQ-055",
    domain: "AUTHORITY",
    question: "Review question 055: does the challenged record preserve the exact authority condition required for this consequence?",
    passCondition: "The original record, challenge evidence, hashes, custody, and reviewer finding remain attributable and mutually consistent for checkpoint 055.",
    failureEffect: "Hold resolution at checkpoint 055; preserve the conflict and require a bounded correction, supersession, or withdrawal decision.",
  },
  {
    id: "RQ-056",
    domain: "BINDING",
    question: "Review question 056: does the challenged record preserve the exact binding condition required for this consequence?",
    passCondition: "The original record, challenge evidence, hashes, custody, and reviewer finding remain attributable and mutually consistent for checkpoint 056.",
    failureEffect: "Hold resolution at checkpoint 056; preserve the conflict and require a bounded correction, supersession, or withdrawal decision.",
  },
  {
    id: "RQ-057",
    domain: "COMMIT",
    question: "Review question 057: does the challenged record preserve the exact commit condition required for this consequence?",
    passCondition: "The original record, challenge evidence, hashes, custody, and reviewer finding remain attributable and mutually consistent for checkpoint 057.",
    failureEffect: "Hold resolution at checkpoint 057; preserve the conflict and require a bounded correction, supersession, or withdrawal decision.",
  },
  {
    id: "RQ-058",
    domain: "EXECUTION",
    question: "Review question 058: does the challenged record preserve the exact execution condition required for this consequence?",
    passCondition: "The original record, challenge evidence, hashes, custody, and reviewer finding remain attributable and mutually consistent for checkpoint 058.",
    failureEffect: "Hold resolution at checkpoint 058; preserve the conflict and require a bounded correction, supersession, or withdrawal decision.",
  },
  {
    id: "RQ-059",
    domain: "OUTCOME",
    question: "Review question 059: does the challenged record preserve the exact outcome condition required for this consequence?",
    passCondition: "The original record, challenge evidence, hashes, custody, and reviewer finding remain attributable and mutually consistent for checkpoint 059.",
    failureEffect: "Hold resolution at checkpoint 059; preserve the conflict and require a bounded correction, supersession, or withdrawal decision.",
  },
  {
    id: "RQ-060",
    domain: "INTEGRITY",
    question: "Review question 060: does the challenged record preserve the exact integrity condition required for this consequence?",
    passCondition: "The original record, challenge evidence, hashes, custody, and reviewer finding remain attributable and mutually consistent for checkpoint 060.",
    failureEffect: "Hold resolution at checkpoint 060; preserve the conflict and require a bounded correction, supersession, or withdrawal decision.",
  },
  {
    id: "RQ-061",
    domain: "IDENTITY",
    question: "Review question 061: does the challenged record preserve the exact identity condition required for this consequence?",
    passCondition: "The original record, challenge evidence, hashes, custody, and reviewer finding remain attributable and mutually consistent for checkpoint 061.",
    failureEffect: "Hold resolution at checkpoint 061; preserve the conflict and require a bounded correction, supersession, or withdrawal decision.",
  },
  {
    id: "RQ-062",
    domain: "RECORD",
    question: "Review question 062: does the challenged record preserve the exact record condition required for this consequence?",
    passCondition: "The original record, challenge evidence, hashes, custody, and reviewer finding remain attributable and mutually consistent for checkpoint 062.",
    failureEffect: "Hold resolution at checkpoint 062; preserve the conflict and require a bounded correction, supersession, or withdrawal decision.",
  },
  {
    id: "RQ-063",
    domain: "CONTINUITY",
    question: "Review question 063: does the challenged record preserve the exact continuity condition required for this consequence?",
    passCondition: "The original record, challenge evidence, hashes, custody, and reviewer finding remain attributable and mutually consistent for checkpoint 063.",
    failureEffect: "Hold resolution at checkpoint 063; preserve the conflict and require a bounded correction, supersession, or withdrawal decision.",
  },
  {
    id: "RQ-064",
    domain: "ADMISSIBILITY",
    question: "Review question 064: does the challenged record preserve the exact admissibility condition required for this consequence?",
    passCondition: "The original record, challenge evidence, hashes, custody, and reviewer finding remain attributable and mutually consistent for checkpoint 064.",
    failureEffect: "Hold resolution at checkpoint 064; preserve the conflict and require a bounded correction, supersession, or withdrawal decision.",
  },
  {
    id: "RQ-065",
    domain: "AUTHORITY",
    question: "Review question 065: does the challenged record preserve the exact authority condition required for this consequence?",
    passCondition: "The original record, challenge evidence, hashes, custody, and reviewer finding remain attributable and mutually consistent for checkpoint 065.",
    failureEffect: "Hold resolution at checkpoint 065; preserve the conflict and require a bounded correction, supersession, or withdrawal decision.",
  },
  {
    id: "RQ-066",
    domain: "BINDING",
    question: "Review question 066: does the challenged record preserve the exact binding condition required for this consequence?",
    passCondition: "The original record, challenge evidence, hashes, custody, and reviewer finding remain attributable and mutually consistent for checkpoint 066.",
    failureEffect: "Hold resolution at checkpoint 066; preserve the conflict and require a bounded correction, supersession, or withdrawal decision.",
  },
  {
    id: "RQ-067",
    domain: "COMMIT",
    question: "Review question 067: does the challenged record preserve the exact commit condition required for this consequence?",
    passCondition: "The original record, challenge evidence, hashes, custody, and reviewer finding remain attributable and mutually consistent for checkpoint 067.",
    failureEffect: "Hold resolution at checkpoint 067; preserve the conflict and require a bounded correction, supersession, or withdrawal decision.",
  },
  {
    id: "RQ-068",
    domain: "EXECUTION",
    question: "Review question 068: does the challenged record preserve the exact execution condition required for this consequence?",
    passCondition: "The original record, challenge evidence, hashes, custody, and reviewer finding remain attributable and mutually consistent for checkpoint 068.",
    failureEffect: "Hold resolution at checkpoint 068; preserve the conflict and require a bounded correction, supersession, or withdrawal decision.",
  },
  {
    id: "RQ-069",
    domain: "OUTCOME",
    question: "Review question 069: does the challenged record preserve the exact outcome condition required for this consequence?",
    passCondition: "The original record, challenge evidence, hashes, custody, and reviewer finding remain attributable and mutually consistent for checkpoint 069.",
    failureEffect: "Hold resolution at checkpoint 069; preserve the conflict and require a bounded correction, supersession, or withdrawal decision.",
  },
  {
    id: "RQ-070",
    domain: "INTEGRITY",
    question: "Review question 070: does the challenged record preserve the exact integrity condition required for this consequence?",
    passCondition: "The original record, challenge evidence, hashes, custody, and reviewer finding remain attributable and mutually consistent for checkpoint 070.",
    failureEffect: "Hold resolution at checkpoint 070; preserve the conflict and require a bounded correction, supersession, or withdrawal decision.",
  },
  {
    id: "RQ-071",
    domain: "IDENTITY",
    question: "Review question 071: does the challenged record preserve the exact identity condition required for this consequence?",
    passCondition: "The original record, challenge evidence, hashes, custody, and reviewer finding remain attributable and mutually consistent for checkpoint 071.",
    failureEffect: "Hold resolution at checkpoint 071; preserve the conflict and require a bounded correction, supersession, or withdrawal decision.",
  },
  {
    id: "RQ-072",
    domain: "RECORD",
    question: "Review question 072: does the challenged record preserve the exact record condition required for this consequence?",
    passCondition: "The original record, challenge evidence, hashes, custody, and reviewer finding remain attributable and mutually consistent for checkpoint 072.",
    failureEffect: "Hold resolution at checkpoint 072; preserve the conflict and require a bounded correction, supersession, or withdrawal decision.",
  },
  {
    id: "RQ-073",
    domain: "CONTINUITY",
    question: "Review question 073: does the challenged record preserve the exact continuity condition required for this consequence?",
    passCondition: "The original record, challenge evidence, hashes, custody, and reviewer finding remain attributable and mutually consistent for checkpoint 073.",
    failureEffect: "Hold resolution at checkpoint 073; preserve the conflict and require a bounded correction, supersession, or withdrawal decision.",
  },
  {
    id: "RQ-074",
    domain: "ADMISSIBILITY",
    question: "Review question 074: does the challenged record preserve the exact admissibility condition required for this consequence?",
    passCondition: "The original record, challenge evidence, hashes, custody, and reviewer finding remain attributable and mutually consistent for checkpoint 074.",
    failureEffect: "Hold resolution at checkpoint 074; preserve the conflict and require a bounded correction, supersession, or withdrawal decision.",
  },
  {
    id: "RQ-075",
    domain: "AUTHORITY",
    question: "Review question 075: does the challenged record preserve the exact authority condition required for this consequence?",
    passCondition: "The original record, challenge evidence, hashes, custody, and reviewer finding remain attributable and mutually consistent for checkpoint 075.",
    failureEffect: "Hold resolution at checkpoint 075; preserve the conflict and require a bounded correction, supersession, or withdrawal decision.",
  },
  {
    id: "RQ-076",
    domain: "BINDING",
    question: "Review question 076: does the challenged record preserve the exact binding condition required for this consequence?",
    passCondition: "The original record, challenge evidence, hashes, custody, and reviewer finding remain attributable and mutually consistent for checkpoint 076.",
    failureEffect: "Hold resolution at checkpoint 076; preserve the conflict and require a bounded correction, supersession, or withdrawal decision.",
  },
  {
    id: "RQ-077",
    domain: "COMMIT",
    question: "Review question 077: does the challenged record preserve the exact commit condition required for this consequence?",
    passCondition: "The original record, challenge evidence, hashes, custody, and reviewer finding remain attributable and mutually consistent for checkpoint 077.",
    failureEffect: "Hold resolution at checkpoint 077; preserve the conflict and require a bounded correction, supersession, or withdrawal decision.",
  },
  {
    id: "RQ-078",
    domain: "EXECUTION",
    question: "Review question 078: does the challenged record preserve the exact execution condition required for this consequence?",
    passCondition: "The original record, challenge evidence, hashes, custody, and reviewer finding remain attributable and mutually consistent for checkpoint 078.",
    failureEffect: "Hold resolution at checkpoint 078; preserve the conflict and require a bounded correction, supersession, or withdrawal decision.",
  },
  {
    id: "RQ-079",
    domain: "OUTCOME",
    question: "Review question 079: does the challenged record preserve the exact outcome condition required for this consequence?",
    passCondition: "The original record, challenge evidence, hashes, custody, and reviewer finding remain attributable and mutually consistent for checkpoint 079.",
    failureEffect: "Hold resolution at checkpoint 079; preserve the conflict and require a bounded correction, supersession, or withdrawal decision.",
  },
  {
    id: "RQ-080",
    domain: "INTEGRITY",
    question: "Review question 080: does the challenged record preserve the exact integrity condition required for this consequence?",
    passCondition: "The original record, challenge evidence, hashes, custody, and reviewer finding remain attributable and mutually consistent for checkpoint 080.",
    failureEffect: "Hold resolution at checkpoint 080; preserve the conflict and require a bounded correction, supersession, or withdrawal decision.",
  },
];

const CUSTODY_EVENTS: CustodyEvent[] = [
  {
    sequence: 1,
    time: "2026-08-02T09:07:00Z",
    actor: "Custody actor 01",
    action: "HASHED",
    object: "Challenge package component 01",
    result: "Custody event 01 preserved without overwriting the original artifact.",
    hash: "CUSTODY-001-" + "1".repeat(48),
  },
  {
    sequence: 2,
    time: "2026-08-03T10:14:00Z",
    actor: "Custody actor 02",
    action: "TRANSFERRED",
    object: "Challenge package component 02",
    result: "Custody event 02 preserved without overwriting the original artifact.",
    hash: "CUSTODY-002-" + "2".repeat(48),
  },
  {
    sequence: 3,
    time: "2026-08-04T11:21:00Z",
    actor: "Custody actor 03",
    action: "REVIEWED",
    object: "Challenge package component 03",
    result: "Custody event 03 preserved without overwriting the original artifact.",
    hash: "CUSTODY-003-" + "3".repeat(48),
  },
  {
    sequence: 4,
    time: "2026-08-05T12:28:00Z",
    actor: "Custody actor 04",
    action: "SEALED",
    object: "Challenge package component 04",
    result: "Custody event 04 preserved without overwriting the original artifact.",
    hash: "CUSTODY-004-" + "4".repeat(48),
  },
  {
    sequence: 5,
    time: "2026-08-06T13:35:00Z",
    actor: "Custody actor 05",
    action: "APPENDED",
    object: "Challenge package component 05",
    result: "Custody event 05 preserved without overwriting the original artifact.",
    hash: "CUSTODY-005-" + "5".repeat(48),
  },
  {
    sequence: 6,
    time: "2026-08-07T14:42:00Z",
    actor: "Custody actor 06",
    action: "CAPTURED",
    object: "Challenge package component 06",
    result: "Custody event 06 preserved without overwriting the original artifact.",
    hash: "CUSTODY-006-" + "6".repeat(48),
  },
  {
    sequence: 7,
    time: "2026-08-08T15:49:00Z",
    actor: "Custody actor 07",
    action: "HASHED",
    object: "Challenge package component 07",
    result: "Custody event 07 preserved without overwriting the original artifact.",
    hash: "CUSTODY-007-" + "7".repeat(48),
  },
  {
    sequence: 8,
    time: "2026-08-09T16:56:00Z",
    actor: "Custody actor 08",
    action: "TRANSFERRED",
    object: "Challenge package component 08",
    result: "Custody event 08 preserved without overwriting the original artifact.",
    hash: "CUSTODY-008-" + "8".repeat(48),
  },
  {
    sequence: 9,
    time: "2026-08-01T17:03:00Z",
    actor: "Custody actor 09",
    action: "REVIEWED",
    object: "Challenge package component 09",
    result: "Custody event 09 preserved without overwriting the original artifact.",
    hash: "CUSTODY-009-" + "9".repeat(48),
  },
  {
    sequence: 10,
    time: "2026-08-02T08:10:00Z",
    actor: "Custody actor 10",
    action: "SEALED",
    object: "Challenge package component 10",
    result: "Custody event 10 preserved without overwriting the original artifact.",
    hash: "CUSTODY-010-" + "0".repeat(48),
  },
  {
    sequence: 11,
    time: "2026-08-03T09:17:00Z",
    actor: "Custody actor 11",
    action: "APPENDED",
    object: "Challenge package component 11",
    result: "Custody event 11 preserved without overwriting the original artifact.",
    hash: "CUSTODY-011-" + "1".repeat(48),
  },
  {
    sequence: 12,
    time: "2026-08-04T10:24:00Z",
    actor: "Custody actor 12",
    action: "CAPTURED",
    object: "Challenge package component 12",
    result: "Custody event 12 preserved without overwriting the original artifact.",
    hash: "CUSTODY-012-" + "2".repeat(48),
  },
  {
    sequence: 13,
    time: "2026-08-05T11:31:00Z",
    actor: "Custody actor 13",
    action: "HASHED",
    object: "Challenge package component 13",
    result: "Custody event 13 preserved without overwriting the original artifact.",
    hash: "CUSTODY-013-" + "3".repeat(48),
  },
  {
    sequence: 14,
    time: "2026-08-06T12:38:00Z",
    actor: "Custody actor 14",
    action: "TRANSFERRED",
    object: "Challenge package component 14",
    result: "Custody event 14 preserved without overwriting the original artifact.",
    hash: "CUSTODY-014-" + "4".repeat(48),
  },
  {
    sequence: 15,
    time: "2026-08-07T13:45:00Z",
    actor: "Custody actor 15",
    action: "REVIEWED",
    object: "Challenge package component 15",
    result: "Custody event 15 preserved without overwriting the original artifact.",
    hash: "CUSTODY-015-" + "5".repeat(48),
  },
  {
    sequence: 16,
    time: "2026-08-08T14:52:00Z",
    actor: "Custody actor 16",
    action: "SEALED",
    object: "Challenge package component 16",
    result: "Custody event 16 preserved without overwriting the original artifact.",
    hash: "CUSTODY-016-" + "6".repeat(48),
  },
  {
    sequence: 17,
    time: "2026-08-09T15:59:00Z",
    actor: "Custody actor 17",
    action: "APPENDED",
    object: "Challenge package component 17",
    result: "Custody event 17 preserved without overwriting the original artifact.",
    hash: "CUSTODY-017-" + "7".repeat(48),
  },
  {
    sequence: 18,
    time: "2026-08-01T16:06:00Z",
    actor: "Custody actor 18",
    action: "CAPTURED",
    object: "Challenge package component 18",
    result: "Custody event 18 preserved without overwriting the original artifact.",
    hash: "CUSTODY-018-" + "8".repeat(48),
  },
  {
    sequence: 19,
    time: "2026-08-02T17:13:00Z",
    actor: "Custody actor 19",
    action: "HASHED",
    object: "Challenge package component 19",
    result: "Custody event 19 preserved without overwriting the original artifact.",
    hash: "CUSTODY-019-" + "9".repeat(48),
  },
  {
    sequence: 20,
    time: "2026-08-03T08:20:00Z",
    actor: "Custody actor 20",
    action: "TRANSFERRED",
    object: "Challenge package component 20",
    result: "Custody event 20 preserved without overwriting the original artifact.",
    hash: "CUSTODY-020-" + "0".repeat(48),
  },
  {
    sequence: 21,
    time: "2026-08-04T09:27:00Z",
    actor: "Custody actor 21",
    action: "REVIEWED",
    object: "Challenge package component 21",
    result: "Custody event 21 preserved without overwriting the original artifact.",
    hash: "CUSTODY-021-" + "1".repeat(48),
  },
  {
    sequence: 22,
    time: "2026-08-05T10:34:00Z",
    actor: "Custody actor 22",
    action: "SEALED",
    object: "Challenge package component 22",
    result: "Custody event 22 preserved without overwriting the original artifact.",
    hash: "CUSTODY-022-" + "2".repeat(48),
  },
  {
    sequence: 23,
    time: "2026-08-06T11:41:00Z",
    actor: "Custody actor 23",
    action: "APPENDED",
    object: "Challenge package component 23",
    result: "Custody event 23 preserved without overwriting the original artifact.",
    hash: "CUSTODY-023-" + "3".repeat(48),
  },
  {
    sequence: 24,
    time: "2026-08-07T12:48:00Z",
    actor: "Custody actor 24",
    action: "CAPTURED",
    object: "Challenge package component 24",
    result: "Custody event 24 preserved without overwriting the original artifact.",
    hash: "CUSTODY-024-" + "4".repeat(48),
  },
  {
    sequence: 25,
    time: "2026-08-08T13:55:00Z",
    actor: "Custody actor 25",
    action: "HASHED",
    object: "Challenge package component 25",
    result: "Custody event 25 preserved without overwriting the original artifact.",
    hash: "CUSTODY-025-" + "5".repeat(48),
  },
  {
    sequence: 26,
    time: "2026-08-09T14:02:00Z",
    actor: "Custody actor 26",
    action: "TRANSFERRED",
    object: "Challenge package component 26",
    result: "Custody event 26 preserved without overwriting the original artifact.",
    hash: "CUSTODY-026-" + "6".repeat(48),
  },
  {
    sequence: 27,
    time: "2026-08-01T15:09:00Z",
    actor: "Custody actor 27",
    action: "REVIEWED",
    object: "Challenge package component 27",
    result: "Custody event 27 preserved without overwriting the original artifact.",
    hash: "CUSTODY-027-" + "7".repeat(48),
  },
  {
    sequence: 28,
    time: "2026-08-02T16:16:00Z",
    actor: "Custody actor 28",
    action: "SEALED",
    object: "Challenge package component 28",
    result: "Custody event 28 preserved without overwriting the original artifact.",
    hash: "CUSTODY-028-" + "8".repeat(48),
  },
  {
    sequence: 29,
    time: "2026-08-03T17:23:00Z",
    actor: "Custody actor 29",
    action: "APPENDED",
    object: "Challenge package component 29",
    result: "Custody event 29 preserved without overwriting the original artifact.",
    hash: "CUSTODY-029-" + "9".repeat(48),
  },
  {
    sequence: 30,
    time: "2026-08-04T08:30:00Z",
    actor: "Custody actor 30",
    action: "CAPTURED",
    object: "Challenge package component 30",
    result: "Custody event 30 preserved without overwriting the original artifact.",
    hash: "CUSTODY-030-" + "0".repeat(48),
  },
  {
    sequence: 31,
    time: "2026-08-05T09:37:00Z",
    actor: "Custody actor 31",
    action: "HASHED",
    object: "Challenge package component 31",
    result: "Custody event 31 preserved without overwriting the original artifact.",
    hash: "CUSTODY-031-" + "1".repeat(48),
  },
  {
    sequence: 32,
    time: "2026-08-06T10:44:00Z",
    actor: "Custody actor 32",
    action: "TRANSFERRED",
    object: "Challenge package component 32",
    result: "Custody event 32 preserved without overwriting the original artifact.",
    hash: "CUSTODY-032-" + "2".repeat(48),
  },
  {
    sequence: 33,
    time: "2026-08-07T11:51:00Z",
    actor: "Custody actor 33",
    action: "REVIEWED",
    object: "Challenge package component 33",
    result: "Custody event 33 preserved without overwriting the original artifact.",
    hash: "CUSTODY-033-" + "3".repeat(48),
  },
  {
    sequence: 34,
    time: "2026-08-08T12:58:00Z",
    actor: "Custody actor 34",
    action: "SEALED",
    object: "Challenge package component 34",
    result: "Custody event 34 preserved without overwriting the original artifact.",
    hash: "CUSTODY-034-" + "4".repeat(48),
  },
  {
    sequence: 35,
    time: "2026-08-09T13:05:00Z",
    actor: "Custody actor 35",
    action: "APPENDED",
    object: "Challenge package component 35",
    result: "Custody event 35 preserved without overwriting the original artifact.",
    hash: "CUSTODY-035-" + "5".repeat(48),
  },
  {
    sequence: 36,
    time: "2026-08-01T14:12:00Z",
    actor: "Custody actor 36",
    action: "CAPTURED",
    object: "Challenge package component 36",
    result: "Custody event 36 preserved without overwriting the original artifact.",
    hash: "CUSTODY-036-" + "6".repeat(48),
  },
  {
    sequence: 37,
    time: "2026-08-02T15:19:00Z",
    actor: "Custody actor 37",
    action: "HASHED",
    object: "Challenge package component 37",
    result: "Custody event 37 preserved without overwriting the original artifact.",
    hash: "CUSTODY-037-" + "7".repeat(48),
  },
  {
    sequence: 38,
    time: "2026-08-03T16:26:00Z",
    actor: "Custody actor 38",
    action: "TRANSFERRED",
    object: "Challenge package component 38",
    result: "Custody event 38 preserved without overwriting the original artifact.",
    hash: "CUSTODY-038-" + "8".repeat(48),
  },
  {
    sequence: 39,
    time: "2026-08-04T17:33:00Z",
    actor: "Custody actor 39",
    action: "REVIEWED",
    object: "Challenge package component 39",
    result: "Custody event 39 preserved without overwriting the original artifact.",
    hash: "CUSTODY-039-" + "9".repeat(48),
  },
  {
    sequence: 40,
    time: "2026-08-05T08:40:00Z",
    actor: "Custody actor 40",
    action: "SEALED",
    object: "Challenge package component 40",
    result: "Custody event 40 preserved without overwriting the original artifact.",
    hash: "CUSTODY-040-" + "0".repeat(48),
  },
  {
    sequence: 41,
    time: "2026-08-06T09:47:00Z",
    actor: "Custody actor 41",
    action: "APPENDED",
    object: "Challenge package component 41",
    result: "Custody event 41 preserved without overwriting the original artifact.",
    hash: "CUSTODY-041-" + "1".repeat(48),
  },
  {
    sequence: 42,
    time: "2026-08-07T10:54:00Z",
    actor: "Custody actor 42",
    action: "CAPTURED",
    object: "Challenge package component 42",
    result: "Custody event 42 preserved without overwriting the original artifact.",
    hash: "CUSTODY-042-" + "2".repeat(48),
  },
  {
    sequence: 43,
    time: "2026-08-08T11:01:00Z",
    actor: "Custody actor 43",
    action: "HASHED",
    object: "Challenge package component 43",
    result: "Custody event 43 preserved without overwriting the original artifact.",
    hash: "CUSTODY-043-" + "3".repeat(48),
  },
  {
    sequence: 44,
    time: "2026-08-09T12:08:00Z",
    actor: "Custody actor 44",
    action: "TRANSFERRED",
    object: "Challenge package component 44",
    result: "Custody event 44 preserved without overwriting the original artifact.",
    hash: "CUSTODY-044-" + "4".repeat(48),
  },
  {
    sequence: 45,
    time: "2026-08-01T13:15:00Z",
    actor: "Custody actor 45",
    action: "REVIEWED",
    object: "Challenge package component 45",
    result: "Custody event 45 preserved without overwriting the original artifact.",
    hash: "CUSTODY-045-" + "5".repeat(48),
  },
  {
    sequence: 46,
    time: "2026-08-02T14:22:00Z",
    actor: "Custody actor 46",
    action: "SEALED",
    object: "Challenge package component 46",
    result: "Custody event 46 preserved without overwriting the original artifact.",
    hash: "CUSTODY-046-" + "6".repeat(48),
  },
  {
    sequence: 47,
    time: "2026-08-03T15:29:00Z",
    actor: "Custody actor 47",
    action: "APPENDED",
    object: "Challenge package component 47",
    result: "Custody event 47 preserved without overwriting the original artifact.",
    hash: "CUSTODY-047-" + "7".repeat(48),
  },
  {
    sequence: 48,
    time: "2026-08-04T16:36:00Z",
    actor: "Custody actor 48",
    action: "CAPTURED",
    object: "Challenge package component 48",
    result: "Custody event 48 preserved without overwriting the original artifact.",
    hash: "CUSTODY-048-" + "8".repeat(48),
  },
];

const RESOLUTION_STEPS = [
  {
    id: "STEP-01",
    title: "Resolution discipline 01",
    description: "Preserve the original event, evaluate challenge evidence, document the reviewer boundary, and append the resolution state for step 01.",
    requiredOutput: "Append-only resolution record 01",
  },
  {
    id: "STEP-02",
    title: "Resolution discipline 02",
    description: "Preserve the original event, evaluate challenge evidence, document the reviewer boundary, and append the resolution state for step 02.",
    requiredOutput: "Append-only resolution record 02",
  },
  {
    id: "STEP-03",
    title: "Resolution discipline 03",
    description: "Preserve the original event, evaluate challenge evidence, document the reviewer boundary, and append the resolution state for step 03.",
    requiredOutput: "Append-only resolution record 03",
  },
  {
    id: "STEP-04",
    title: "Resolution discipline 04",
    description: "Preserve the original event, evaluate challenge evidence, document the reviewer boundary, and append the resolution state for step 04.",
    requiredOutput: "Append-only resolution record 04",
  },
  {
    id: "STEP-05",
    title: "Resolution discipline 05",
    description: "Preserve the original event, evaluate challenge evidence, document the reviewer boundary, and append the resolution state for step 05.",
    requiredOutput: "Append-only resolution record 05",
  },
  {
    id: "STEP-06",
    title: "Resolution discipline 06",
    description: "Preserve the original event, evaluate challenge evidence, document the reviewer boundary, and append the resolution state for step 06.",
    requiredOutput: "Append-only resolution record 06",
  },
  {
    id: "STEP-07",
    title: "Resolution discipline 07",
    description: "Preserve the original event, evaluate challenge evidence, document the reviewer boundary, and append the resolution state for step 07.",
    requiredOutput: "Append-only resolution record 07",
  },
  {
    id: "STEP-08",
    title: "Resolution discipline 08",
    description: "Preserve the original event, evaluate challenge evidence, document the reviewer boundary, and append the resolution state for step 08.",
    requiredOutput: "Append-only resolution record 08",
  },
  {
    id: "STEP-09",
    title: "Resolution discipline 09",
    description: "Preserve the original event, evaluate challenge evidence, document the reviewer boundary, and append the resolution state for step 09.",
    requiredOutput: "Append-only resolution record 09",
  },
  {
    id: "STEP-10",
    title: "Resolution discipline 10",
    description: "Preserve the original event, evaluate challenge evidence, document the reviewer boundary, and append the resolution state for step 10.",
    requiredOutput: "Append-only resolution record 10",
  },
  {
    id: "STEP-11",
    title: "Resolution discipline 11",
    description: "Preserve the original event, evaluate challenge evidence, document the reviewer boundary, and append the resolution state for step 11.",
    requiredOutput: "Append-only resolution record 11",
  },
  {
    id: "STEP-12",
    title: "Resolution discipline 12",
    description: "Preserve the original event, evaluate challenge evidence, document the reviewer boundary, and append the resolution state for step 12.",
    requiredOutput: "Append-only resolution record 12",
  },
  {
    id: "STEP-13",
    title: "Resolution discipline 13",
    description: "Preserve the original event, evaluate challenge evidence, document the reviewer boundary, and append the resolution state for step 13.",
    requiredOutput: "Append-only resolution record 13",
  },
  {
    id: "STEP-14",
    title: "Resolution discipline 14",
    description: "Preserve the original event, evaluate challenge evidence, document the reviewer boundary, and append the resolution state for step 14.",
    requiredOutput: "Append-only resolution record 14",
  },
  {
    id: "STEP-15",
    title: "Resolution discipline 15",
    description: "Preserve the original event, evaluate challenge evidence, document the reviewer boundary, and append the resolution state for step 15.",
    requiredOutput: "Append-only resolution record 15",
  },
  {
    id: "STEP-16",
    title: "Resolution discipline 16",
    description: "Preserve the original event, evaluate challenge evidence, document the reviewer boundary, and append the resolution state for step 16.",
    requiredOutput: "Append-only resolution record 16",
  },
  {
    id: "STEP-17",
    title: "Resolution discipline 17",
    description: "Preserve the original event, evaluate challenge evidence, document the reviewer boundary, and append the resolution state for step 17.",
    requiredOutput: "Append-only resolution record 17",
  },
  {
    id: "STEP-18",
    title: "Resolution discipline 18",
    description: "Preserve the original event, evaluate challenge evidence, document the reviewer boundary, and append the resolution state for step 18.",
    requiredOutput: "Append-only resolution record 18",
  },
  {
    id: "STEP-19",
    title: "Resolution discipline 19",
    description: "Preserve the original event, evaluate challenge evidence, document the reviewer boundary, and append the resolution state for step 19.",
    requiredOutput: "Append-only resolution record 19",
  },
  {
    id: "STEP-20",
    title: "Resolution discipline 20",
    description: "Preserve the original event, evaluate challenge evidence, document the reviewer boundary, and append the resolution state for step 20.",
    requiredOutput: "Append-only resolution record 20",
  },
  {
    id: "STEP-21",
    title: "Resolution discipline 21",
    description: "Preserve the original event, evaluate challenge evidence, document the reviewer boundary, and append the resolution state for step 21.",
    requiredOutput: "Append-only resolution record 21",
  },
  {
    id: "STEP-22",
    title: "Resolution discipline 22",
    description: "Preserve the original event, evaluate challenge evidence, document the reviewer boundary, and append the resolution state for step 22.",
    requiredOutput: "Append-only resolution record 22",
  },
  {
    id: "STEP-23",
    title: "Resolution discipline 23",
    description: "Preserve the original event, evaluate challenge evidence, document the reviewer boundary, and append the resolution state for step 23.",
    requiredOutput: "Append-only resolution record 23",
  },
  {
    id: "STEP-24",
    title: "Resolution discipline 24",
    description: "Preserve the original event, evaluate challenge evidence, document the reviewer boundary, and append the resolution state for step 24.",
    requiredOutput: "Append-only resolution record 24",
  },
];

const CHALLENGE_GOVERNANCE_CONTROLS = [
  {
    id: "CGC-001",
    domain: "IDENTITY",
    control: "Challenge governance control 001 preserves original-state visibility, bounded review authority, admissible counter-evidence, append-only correction, and independent verification.",
    evidence: "Control evidence 001 must identify actor, source, time, custody, integrity, route relationship, decision effect, and public claims boundary.",
    stopCondition: "Stop resolution when control 001 is unsupported, conflicted, stale, outside scope, or unable to preserve the original event.",
  },
  {
    id: "CGC-002",
    domain: "RECORD",
    control: "Challenge governance control 002 preserves original-state visibility, bounded review authority, admissible counter-evidence, append-only correction, and independent verification.",
    evidence: "Control evidence 002 must identify actor, source, time, custody, integrity, route relationship, decision effect, and public claims boundary.",
    stopCondition: "Stop resolution when control 002 is unsupported, conflicted, stale, outside scope, or unable to preserve the original event.",
  },
  {
    id: "CGC-003",
    domain: "CONTINUITY",
    control: "Challenge governance control 003 preserves original-state visibility, bounded review authority, admissible counter-evidence, append-only correction, and independent verification.",
    evidence: "Control evidence 003 must identify actor, source, time, custody, integrity, route relationship, decision effect, and public claims boundary.",
    stopCondition: "Stop resolution when control 003 is unsupported, conflicted, stale, outside scope, or unable to preserve the original event.",
  },
  {
    id: "CGC-004",
    domain: "ADMISSIBILITY",
    control: "Challenge governance control 004 preserves original-state visibility, bounded review authority, admissible counter-evidence, append-only correction, and independent verification.",
    evidence: "Control evidence 004 must identify actor, source, time, custody, integrity, route relationship, decision effect, and public claims boundary.",
    stopCondition: "Stop resolution when control 004 is unsupported, conflicted, stale, outside scope, or unable to preserve the original event.",
  },
  {
    id: "CGC-005",
    domain: "AUTHORITY",
    control: "Challenge governance control 005 preserves original-state visibility, bounded review authority, admissible counter-evidence, append-only correction, and independent verification.",
    evidence: "Control evidence 005 must identify actor, source, time, custody, integrity, route relationship, decision effect, and public claims boundary.",
    stopCondition: "Stop resolution when control 005 is unsupported, conflicted, stale, outside scope, or unable to preserve the original event.",
  },
  {
    id: "CGC-006",
    domain: "BINDING",
    control: "Challenge governance control 006 preserves original-state visibility, bounded review authority, admissible counter-evidence, append-only correction, and independent verification.",
    evidence: "Control evidence 006 must identify actor, source, time, custody, integrity, route relationship, decision effect, and public claims boundary.",
    stopCondition: "Stop resolution when control 006 is unsupported, conflicted, stale, outside scope, or unable to preserve the original event.",
  },
  {
    id: "CGC-007",
    domain: "COMMIT",
    control: "Challenge governance control 007 preserves original-state visibility, bounded review authority, admissible counter-evidence, append-only correction, and independent verification.",
    evidence: "Control evidence 007 must identify actor, source, time, custody, integrity, route relationship, decision effect, and public claims boundary.",
    stopCondition: "Stop resolution when control 007 is unsupported, conflicted, stale, outside scope, or unable to preserve the original event.",
  },
  {
    id: "CGC-008",
    domain: "EXECUTION",
    control: "Challenge governance control 008 preserves original-state visibility, bounded review authority, admissible counter-evidence, append-only correction, and independent verification.",
    evidence: "Control evidence 008 must identify actor, source, time, custody, integrity, route relationship, decision effect, and public claims boundary.",
    stopCondition: "Stop resolution when control 008 is unsupported, conflicted, stale, outside scope, or unable to preserve the original event.",
  },
  {
    id: "CGC-009",
    domain: "OUTCOME",
    control: "Challenge governance control 009 preserves original-state visibility, bounded review authority, admissible counter-evidence, append-only correction, and independent verification.",
    evidence: "Control evidence 009 must identify actor, source, time, custody, integrity, route relationship, decision effect, and public claims boundary.",
    stopCondition: "Stop resolution when control 009 is unsupported, conflicted, stale, outside scope, or unable to preserve the original event.",
  },
  {
    id: "CGC-010",
    domain: "INTEGRITY",
    control: "Challenge governance control 010 preserves original-state visibility, bounded review authority, admissible counter-evidence, append-only correction, and independent verification.",
    evidence: "Control evidence 010 must identify actor, source, time, custody, integrity, route relationship, decision effect, and public claims boundary.",
    stopCondition: "Stop resolution when control 010 is unsupported, conflicted, stale, outside scope, or unable to preserve the original event.",
  },
  {
    id: "CGC-011",
    domain: "IDENTITY",
    control: "Challenge governance control 011 preserves original-state visibility, bounded review authority, admissible counter-evidence, append-only correction, and independent verification.",
    evidence: "Control evidence 011 must identify actor, source, time, custody, integrity, route relationship, decision effect, and public claims boundary.",
    stopCondition: "Stop resolution when control 011 is unsupported, conflicted, stale, outside scope, or unable to preserve the original event.",
  },
  {
    id: "CGC-012",
    domain: "RECORD",
    control: "Challenge governance control 012 preserves original-state visibility, bounded review authority, admissible counter-evidence, append-only correction, and independent verification.",
    evidence: "Control evidence 012 must identify actor, source, time, custody, integrity, route relationship, decision effect, and public claims boundary.",
    stopCondition: "Stop resolution when control 012 is unsupported, conflicted, stale, outside scope, or unable to preserve the original event.",
  },
  {
    id: "CGC-013",
    domain: "CONTINUITY",
    control: "Challenge governance control 013 preserves original-state visibility, bounded review authority, admissible counter-evidence, append-only correction, and independent verification.",
    evidence: "Control evidence 013 must identify actor, source, time, custody, integrity, route relationship, decision effect, and public claims boundary.",
    stopCondition: "Stop resolution when control 013 is unsupported, conflicted, stale, outside scope, or unable to preserve the original event.",
  },
  {
    id: "CGC-014",
    domain: "ADMISSIBILITY",
    control: "Challenge governance control 014 preserves original-state visibility, bounded review authority, admissible counter-evidence, append-only correction, and independent verification.",
    evidence: "Control evidence 014 must identify actor, source, time, custody, integrity, route relationship, decision effect, and public claims boundary.",
    stopCondition: "Stop resolution when control 014 is unsupported, conflicted, stale, outside scope, or unable to preserve the original event.",
  },
  {
    id: "CGC-015",
    domain: "AUTHORITY",
    control: "Challenge governance control 015 preserves original-state visibility, bounded review authority, admissible counter-evidence, append-only correction, and independent verification.",
    evidence: "Control evidence 015 must identify actor, source, time, custody, integrity, route relationship, decision effect, and public claims boundary.",
    stopCondition: "Stop resolution when control 015 is unsupported, conflicted, stale, outside scope, or unable to preserve the original event.",
  },
  {
    id: "CGC-016",
    domain: "BINDING",
    control: "Challenge governance control 016 preserves original-state visibility, bounded review authority, admissible counter-evidence, append-only correction, and independent verification.",
    evidence: "Control evidence 016 must identify actor, source, time, custody, integrity, route relationship, decision effect, and public claims boundary.",
    stopCondition: "Stop resolution when control 016 is unsupported, conflicted, stale, outside scope, or unable to preserve the original event.",
  },
  {
    id: "CGC-017",
    domain: "COMMIT",
    control: "Challenge governance control 017 preserves original-state visibility, bounded review authority, admissible counter-evidence, append-only correction, and independent verification.",
    evidence: "Control evidence 017 must identify actor, source, time, custody, integrity, route relationship, decision effect, and public claims boundary.",
    stopCondition: "Stop resolution when control 017 is unsupported, conflicted, stale, outside scope, or unable to preserve the original event.",
  },
  {
    id: "CGC-018",
    domain: "EXECUTION",
    control: "Challenge governance control 018 preserves original-state visibility, bounded review authority, admissible counter-evidence, append-only correction, and independent verification.",
    evidence: "Control evidence 018 must identify actor, source, time, custody, integrity, route relationship, decision effect, and public claims boundary.",
    stopCondition: "Stop resolution when control 018 is unsupported, conflicted, stale, outside scope, or unable to preserve the original event.",
  },
  {
    id: "CGC-019",
    domain: "OUTCOME",
    control: "Challenge governance control 019 preserves original-state visibility, bounded review authority, admissible counter-evidence, append-only correction, and independent verification.",
    evidence: "Control evidence 019 must identify actor, source, time, custody, integrity, route relationship, decision effect, and public claims boundary.",
    stopCondition: "Stop resolution when control 019 is unsupported, conflicted, stale, outside scope, or unable to preserve the original event.",
  },
  {
    id: "CGC-020",
    domain: "INTEGRITY",
    control: "Challenge governance control 020 preserves original-state visibility, bounded review authority, admissible counter-evidence, append-only correction, and independent verification.",
    evidence: "Control evidence 020 must identify actor, source, time, custody, integrity, route relationship, decision effect, and public claims boundary.",
    stopCondition: "Stop resolution when control 020 is unsupported, conflicted, stale, outside scope, or unable to preserve the original event.",
  },
  {
    id: "CGC-021",
    domain: "IDENTITY",
    control: "Challenge governance control 021 preserves original-state visibility, bounded review authority, admissible counter-evidence, append-only correction, and independent verification.",
    evidence: "Control evidence 021 must identify actor, source, time, custody, integrity, route relationship, decision effect, and public claims boundary.",
    stopCondition: "Stop resolution when control 021 is unsupported, conflicted, stale, outside scope, or unable to preserve the original event.",
  },
  {
    id: "CGC-022",
    domain: "RECORD",
    control: "Challenge governance control 022 preserves original-state visibility, bounded review authority, admissible counter-evidence, append-only correction, and independent verification.",
    evidence: "Control evidence 022 must identify actor, source, time, custody, integrity, route relationship, decision effect, and public claims boundary.",
    stopCondition: "Stop resolution when control 022 is unsupported, conflicted, stale, outside scope, or unable to preserve the original event.",
  },
  {
    id: "CGC-023",
    domain: "CONTINUITY",
    control: "Challenge governance control 023 preserves original-state visibility, bounded review authority, admissible counter-evidence, append-only correction, and independent verification.",
    evidence: "Control evidence 023 must identify actor, source, time, custody, integrity, route relationship, decision effect, and public claims boundary.",
    stopCondition: "Stop resolution when control 023 is unsupported, conflicted, stale, outside scope, or unable to preserve the original event.",
  },
  {
    id: "CGC-024",
    domain: "ADMISSIBILITY",
    control: "Challenge governance control 024 preserves original-state visibility, bounded review authority, admissible counter-evidence, append-only correction, and independent verification.",
    evidence: "Control evidence 024 must identify actor, source, time, custody, integrity, route relationship, decision effect, and public claims boundary.",
    stopCondition: "Stop resolution when control 024 is unsupported, conflicted, stale, outside scope, or unable to preserve the original event.",
  },
  {
    id: "CGC-025",
    domain: "AUTHORITY",
    control: "Challenge governance control 025 preserves original-state visibility, bounded review authority, admissible counter-evidence, append-only correction, and independent verification.",
    evidence: "Control evidence 025 must identify actor, source, time, custody, integrity, route relationship, decision effect, and public claims boundary.",
    stopCondition: "Stop resolution when control 025 is unsupported, conflicted, stale, outside scope, or unable to preserve the original event.",
  },
  {
    id: "CGC-026",
    domain: "BINDING",
    control: "Challenge governance control 026 preserves original-state visibility, bounded review authority, admissible counter-evidence, append-only correction, and independent verification.",
    evidence: "Control evidence 026 must identify actor, source, time, custody, integrity, route relationship, decision effect, and public claims boundary.",
    stopCondition: "Stop resolution when control 026 is unsupported, conflicted, stale, outside scope, or unable to preserve the original event.",
  },
  {
    id: "CGC-027",
    domain: "COMMIT",
    control: "Challenge governance control 027 preserves original-state visibility, bounded review authority, admissible counter-evidence, append-only correction, and independent verification.",
    evidence: "Control evidence 027 must identify actor, source, time, custody, integrity, route relationship, decision effect, and public claims boundary.",
    stopCondition: "Stop resolution when control 027 is unsupported, conflicted, stale, outside scope, or unable to preserve the original event.",
  },
  {
    id: "CGC-028",
    domain: "EXECUTION",
    control: "Challenge governance control 028 preserves original-state visibility, bounded review authority, admissible counter-evidence, append-only correction, and independent verification.",
    evidence: "Control evidence 028 must identify actor, source, time, custody, integrity, route relationship, decision effect, and public claims boundary.",
    stopCondition: "Stop resolution when control 028 is unsupported, conflicted, stale, outside scope, or unable to preserve the original event.",
  },
  {
    id: "CGC-029",
    domain: "OUTCOME",
    control: "Challenge governance control 029 preserves original-state visibility, bounded review authority, admissible counter-evidence, append-only correction, and independent verification.",
    evidence: "Control evidence 029 must identify actor, source, time, custody, integrity, route relationship, decision effect, and public claims boundary.",
    stopCondition: "Stop resolution when control 029 is unsupported, conflicted, stale, outside scope, or unable to preserve the original event.",
  },
  {
    id: "CGC-030",
    domain: "INTEGRITY",
    control: "Challenge governance control 030 preserves original-state visibility, bounded review authority, admissible counter-evidence, append-only correction, and independent verification.",
    evidence: "Control evidence 030 must identify actor, source, time, custody, integrity, route relationship, decision effect, and public claims boundary.",
    stopCondition: "Stop resolution when control 030 is unsupported, conflicted, stale, outside scope, or unable to preserve the original event.",
  },
  {
    id: "CGC-031",
    domain: "IDENTITY",
    control: "Challenge governance control 031 preserves original-state visibility, bounded review authority, admissible counter-evidence, append-only correction, and independent verification.",
    evidence: "Control evidence 031 must identify actor, source, time, custody, integrity, route relationship, decision effect, and public claims boundary.",
    stopCondition: "Stop resolution when control 031 is unsupported, conflicted, stale, outside scope, or unable to preserve the original event.",
  },
  {
    id: "CGC-032",
    domain: "RECORD",
    control: "Challenge governance control 032 preserves original-state visibility, bounded review authority, admissible counter-evidence, append-only correction, and independent verification.",
    evidence: "Control evidence 032 must identify actor, source, time, custody, integrity, route relationship, decision effect, and public claims boundary.",
    stopCondition: "Stop resolution when control 032 is unsupported, conflicted, stale, outside scope, or unable to preserve the original event.",
  },
  {
    id: "CGC-033",
    domain: "CONTINUITY",
    control: "Challenge governance control 033 preserves original-state visibility, bounded review authority, admissible counter-evidence, append-only correction, and independent verification.",
    evidence: "Control evidence 033 must identify actor, source, time, custody, integrity, route relationship, decision effect, and public claims boundary.",
    stopCondition: "Stop resolution when control 033 is unsupported, conflicted, stale, outside scope, or unable to preserve the original event.",
  },
  {
    id: "CGC-034",
    domain: "ADMISSIBILITY",
    control: "Challenge governance control 034 preserves original-state visibility, bounded review authority, admissible counter-evidence, append-only correction, and independent verification.",
    evidence: "Control evidence 034 must identify actor, source, time, custody, integrity, route relationship, decision effect, and public claims boundary.",
    stopCondition: "Stop resolution when control 034 is unsupported, conflicted, stale, outside scope, or unable to preserve the original event.",
  },
  {
    id: "CGC-035",
    domain: "AUTHORITY",
    control: "Challenge governance control 035 preserves original-state visibility, bounded review authority, admissible counter-evidence, append-only correction, and independent verification.",
    evidence: "Control evidence 035 must identify actor, source, time, custody, integrity, route relationship, decision effect, and public claims boundary.",
    stopCondition: "Stop resolution when control 035 is unsupported, conflicted, stale, outside scope, or unable to preserve the original event.",
  },
  {
    id: "CGC-036",
    domain: "BINDING",
    control: "Challenge governance control 036 preserves original-state visibility, bounded review authority, admissible counter-evidence, append-only correction, and independent verification.",
    evidence: "Control evidence 036 must identify actor, source, time, custody, integrity, route relationship, decision effect, and public claims boundary.",
    stopCondition: "Stop resolution when control 036 is unsupported, conflicted, stale, outside scope, or unable to preserve the original event.",
  },
  {
    id: "CGC-037",
    domain: "COMMIT",
    control: "Challenge governance control 037 preserves original-state visibility, bounded review authority, admissible counter-evidence, append-only correction, and independent verification.",
    evidence: "Control evidence 037 must identify actor, source, time, custody, integrity, route relationship, decision effect, and public claims boundary.",
    stopCondition: "Stop resolution when control 037 is unsupported, conflicted, stale, outside scope, or unable to preserve the original event.",
  },
  {
    id: "CGC-038",
    domain: "EXECUTION",
    control: "Challenge governance control 038 preserves original-state visibility, bounded review authority, admissible counter-evidence, append-only correction, and independent verification.",
    evidence: "Control evidence 038 must identify actor, source, time, custody, integrity, route relationship, decision effect, and public claims boundary.",
    stopCondition: "Stop resolution when control 038 is unsupported, conflicted, stale, outside scope, or unable to preserve the original event.",
  },
  {
    id: "CGC-039",
    domain: "OUTCOME",
    control: "Challenge governance control 039 preserves original-state visibility, bounded review authority, admissible counter-evidence, append-only correction, and independent verification.",
    evidence: "Control evidence 039 must identify actor, source, time, custody, integrity, route relationship, decision effect, and public claims boundary.",
    stopCondition: "Stop resolution when control 039 is unsupported, conflicted, stale, outside scope, or unable to preserve the original event.",
  },
  {
    id: "CGC-040",
    domain: "INTEGRITY",
    control: "Challenge governance control 040 preserves original-state visibility, bounded review authority, admissible counter-evidence, append-only correction, and independent verification.",
    evidence: "Control evidence 040 must identify actor, source, time, custody, integrity, route relationship, decision effect, and public claims boundary.",
    stopCondition: "Stop resolution when control 040 is unsupported, conflicted, stale, outside scope, or unable to preserve the original event.",
  },
  {
    id: "CGC-041",
    domain: "IDENTITY",
    control: "Challenge governance control 041 preserves original-state visibility, bounded review authority, admissible counter-evidence, append-only correction, and independent verification.",
    evidence: "Control evidence 041 must identify actor, source, time, custody, integrity, route relationship, decision effect, and public claims boundary.",
    stopCondition: "Stop resolution when control 041 is unsupported, conflicted, stale, outside scope, or unable to preserve the original event.",
  },
  {
    id: "CGC-042",
    domain: "RECORD",
    control: "Challenge governance control 042 preserves original-state visibility, bounded review authority, admissible counter-evidence, append-only correction, and independent verification.",
    evidence: "Control evidence 042 must identify actor, source, time, custody, integrity, route relationship, decision effect, and public claims boundary.",
    stopCondition: "Stop resolution when control 042 is unsupported, conflicted, stale, outside scope, or unable to preserve the original event.",
  },
] as const;

const downloadJson = (name: string, data: unknown) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = name;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
};

const tone = (value: string) => value.toLowerCase().replaceAll("_", "-");

export default function ChallengeCorrectionCenterPage() {
  const [view, setView] = useState<View>("command");
  const [selectedArtifactId, setSelectedArtifactId] = useState("TA14-EA-000004");
  const [search, setSearch] = useState("");
  const [stateFilter, setStateFilter] = useState<ChallengeState | "ALL">("ALL");
  const [challengeState, setChallengeState] = useState<ChallengeState>("DRAFT");
  const [challengeTitle, setChallengeTitle] = useState("Challenge the claimed execution effect");
  const [basis, setBasis] = useState("The public package may not establish parity between the committed determination, execution receipt, and preserved outcome.");
  const [requestedRelief, setRequestedRelief] = useState("Append a bounded reviewer finding and correct the public interpretation if the challenge is upheld.");
  const [evidence, setEvidence] = useState<EvidenceItem[]>([
    {
      id: "CH-EV-001",
      title: "Challenge evidence item 01",
      source: "Independent source 01",
      capturedAt: "2026-08-01T10:00:00Z",
      disclosure: "RESTRICTED",
      admissibility: "ADMITTED",
      hash: "CHALLENGE-EVIDENCE-001-" + "1".repeat(40),
      notes: "Evidence item 01 is preserved separately from the original artifact and may only support the bounded challenge question.",
    },
    {
      id: "CH-EV-002",
      title: "Challenge evidence item 02",
      source: "Independent source 02",
      capturedAt: "2026-08-01T11:00:00Z",
      disclosure: "WITHHELD",
      admissibility: "REJECTED",
      hash: "CHALLENGE-EVIDENCE-002-" + "2".repeat(40),
      notes: "Evidence item 02 is preserved separately from the original artifact and may only support the bounded challenge question.",
    },
    {
      id: "CH-EV-003",
      title: "Challenge evidence item 03",
      source: "Independent source 03",
      capturedAt: "2026-08-01T12:00:00Z",
      disclosure: "PUBLIC",
      admissibility: "PENDING",
      hash: "CHALLENGE-EVIDENCE-003-" + "3".repeat(40),
      notes: "Evidence item 03 is preserved separately from the original artifact and may only support the bounded challenge question.",
    },
    {
      id: "CH-EV-004",
      title: "Challenge evidence item 04",
      source: "Independent source 04",
      capturedAt: "2026-08-01T13:00:00Z",
      disclosure: "RESTRICTED",
      admissibility: "ADMITTED",
      hash: "CHALLENGE-EVIDENCE-004-" + "4".repeat(40),
      notes: "Evidence item 04 is preserved separately from the original artifact and may only support the bounded challenge question.",
    },
    {
      id: "CH-EV-005",
      title: "Challenge evidence item 05",
      source: "Independent source 05",
      capturedAt: "2026-08-01T14:00:00Z",
      disclosure: "WITHHELD",
      admissibility: "REJECTED",
      hash: "CHALLENGE-EVIDENCE-005-" + "5".repeat(40),
      notes: "Evidence item 05 is preserved separately from the original artifact and may only support the bounded challenge question.",
    },
    {
      id: "CH-EV-006",
      title: "Challenge evidence item 06",
      source: "Independent source 06",
      capturedAt: "2026-08-01T15:00:00Z",
      disclosure: "PUBLIC",
      admissibility: "PENDING",
      hash: "CHALLENGE-EVIDENCE-006-" + "6".repeat(40),
      notes: "Evidence item 06 is preserved separately from the original artifact and may only support the bounded challenge question.",
    },
  ]);
  const workspaceRef = useRef<HTMLDivElement>(null);
  const selectedArtifact = useMemo(() => ARTIFACTS.find((item) => item.id === selectedArtifactId) ?? ARTIFACTS[0], [selectedArtifactId]);
  const filteredChallenges = useMemo(() => INITIAL_CHALLENGES.filter((item) => {
    const query = search.trim().toLowerCase();
    const matchesQuery = !query || `${item.id} ${item.artifactId} ${item.title} ${item.basis} ${item.submittedBy}`.toLowerCase().includes(query);
    const matchesState = stateFilter === "ALL" || item.state === stateFilter;
    return matchesQuery && matchesState;
  }), [search, stateFilter]);
  const admittedCount = evidence.filter((item) => item.admissibility === "ADMITTED").length;
  const switchView = (next: View) => { setView(next); window.setTimeout(() => workspaceRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 30); };
  const addEvidence = () => setEvidence((items) => [...items, { id: `CH-EV-${String(items.length + 1).padStart(3, "0")}`, title: "New challenge evidence", source: "Unregistered source", capturedAt: new Date().toISOString(), disclosure: "RESTRICTED", admissibility: "PENDING", hash: `PENDING-${Date.now()}`, notes: "Complete source, custody, integrity, relevance, and disclosure review before admission." }]);
  const packagePayload = { generatedAt: new Date().toISOString(), challengeState, selectedArtifact, challengeTitle, basis, requestedRelief, evidence, custody: CUSTODY_EVENTS, reviewQuestions: REVIEW_QUESTIONS, resolutionSteps: RESOLUTION_STEPS };

  return (
    <main className="challenge-center">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <section className="hero shell">
        <div className="hero-copy">
          <p className="eyebrow">TA-14 Authority · Door Eight · Governed dispute operations</p>
          <h1>Challenge &amp; Correction Center</h1>
          <p className="lede">Contest a bounded execution artifact without erasing the original event. Preserve the challenge, admit counter-evidence, inspect custody, assign review authority, append the resolution, and keep every version independently verifiable.</p>
          <div className="hero-actions">
            <button className="primary" onClick={() => switchView("builder")}>Build a challenge package</button>
            <Link className="secondary" href="/artifacts/verify">Open Verification Center</Link>
            <Link className="secondary" href="/artifacts">Return to artifact library</Link>
          </div>
        </div>
        <aside className="hero-core">
          <span className="core-label">Selected artifact</span>
          <strong>{selectedArtifact.id}</strong>
          <span>{selectedArtifact.title}</span>
          <div className={`determination ${tone(selectedArtifact.determination)}`}>{selectedArtifact.determination}</div>
          <small>Original record remains immutable. All challenge activity is append-only.</small>
        </aside>
      </section>

      <section className="metrics shell">
        <article className="metric">
          <span>Founding artifacts</span>
          <strong>12</strong>
          <small>Challengeable public records</small>
        </article>
        <article className="metric">
          <span>Open challenges</span>
          <strong>7</strong>
          <small>Submitted or under review</small>
        </article>
        <article className="metric">
          <span>Custody events</span>
          <strong>48</strong>
          <small>Append-only transfer events</small>
        </article>
        <article className="metric">
          <span>Review controls</span>
          <strong>80</strong>
          <small>Bounded inspection questions</small>
        </article>
      </section>

      <nav className="view-tabs shell" aria-label="Challenge workspace views">
        <button className={view === "command" ? "active" : ""} onClick={() => switchView("command")}>Command</button>
        <button className={view === "builder" ? "active" : ""} onClick={() => switchView("builder")}>Challenge Builder</button>
        <button className={view === "comparison" ? "active" : ""} onClick={() => switchView("comparison")}>Record Comparison</button>
        <button className={view === "custody" ? "active" : ""} onClick={() => switchView("custody")}>Chain of Custody</button>
        <button className={view === "review" ? "active" : ""} onClick={() => switchView("review")}>Review Center</button>
        <button className={view === "resolution" ? "active" : ""} onClick={() => switchView("resolution")}>Resolution</button>
        <button className={view === "history" ? "active" : ""} onClick={() => switchView("history")}>Version History</button>
      </nav>

      <section className="workspace shell" ref={workspaceRef}>
        {view === "command" && (
          <div className="stack">
            <header className="section-head"><div><p className="eyebrow">Challenge command</p><h2>Find, inspect, and route bounded disputes</h2></div><button className="secondary" onClick={() => downloadJson("ta14-challenge-command-snapshot.json", packagePayload)}>Download command snapshot</button></header>
            <div className="filter-bar">
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search challenge ID, artifact, reviewer, or basis" />
              <select value={stateFilter} onChange={(event) => setStateFilter(event.target.value as ChallengeState | "ALL")}><option value="ALL">All states</option>{["DRAFT","SUBMITTED","UNDER_REVIEW","UPHELD","MODIFIED","REVERSED","CLOSED"].map((state) => <option key={state} value={state}>{state.replaceAll("_", " ")}</option>)}</select>
            </div>
            <div className="challenge-grid">
              {filteredChallenges.map((item) => <article className="challenge-card" key={item.id}><div className="card-top"><span>{item.id}</span><b className={`status ${tone(item.state)}`}>{item.state.replaceAll("_", " ")}</b></div><h3>{item.title}</h3><p>{item.basis}</p><dl><div><dt>Artifact</dt><dd>{item.artifactId}</dd></div><div><dt>Evidence</dt><dd>{item.evidenceCount}</dd></div><div><dt>Reviewer</dt><dd>{item.assignedReviewer}</dd></div><div><dt>Due</dt><dd>{item.dueAt.slice(0, 10)}</dd></div></dl><button onClick={() => { setSelectedArtifactId(item.artifactId); switchView("comparison"); }}>Inspect challenge</button></article>)}
            </div>
          </div>
        )}

        {view === "builder" && (
          <div className="stack">
            <header className="section-head"><div><p className="eyebrow">Challenge package builder</p><h2>Preserve a bounded challenge</h2></div><span className={`status ${tone(challengeState)}`}>{challengeState.replaceAll("_", " ")}</span></header>
            <div className="two-col">
              <article className="panel form-panel">
                <label>Artifact<select value={selectedArtifactId} onChange={(event) => setSelectedArtifactId(event.target.value)}>{ARTIFACTS.map((item) => <option key={item.id} value={item.id}>{item.id} · {item.title}</option>)}</select></label>
                <label>Challenge title<input value={challengeTitle} onChange={(event) => setChallengeTitle(event.target.value)} /></label>
                <label>Bounded basis<textarea value={basis} onChange={(event) => setBasis(event.target.value)} rows={7} /></label>
                <label>Requested relief<textarea value={requestedRelief} onChange={(event) => setRequestedRelief(event.target.value)} rows={6} /></label>
                <label>Workflow state<select value={challengeState} onChange={(event) => setChallengeState(event.target.value as ChallengeState)}>{["DRAFT","SUBMITTED","UNDER_REVIEW","UPHELD","MODIFIED","REVERSED","CLOSED"].map((state) => <option key={state} value={state}>{state.replaceAll("_", " ")}</option>)}</select></label>
                <div className="button-row"><button className="primary" onClick={() => setChallengeState("SUBMITTED")}>Submit bounded challenge</button><button className="secondary" onClick={() => downloadJson(`challenge-${selectedArtifact.id}.json`, packagePayload)}>Download package</button></div>
              </article>
              <article className="panel artifact-lock"><p className="eyebrow">Immutable original</p><h3>{selectedArtifact.id}</h3><strong>{selectedArtifact.title}</strong><div className={`determination ${tone(selectedArtifact.determination)}`}>{selectedArtifact.determination}</div><dl><div><dt>Route</dt><dd>{selectedArtifact.route}</dd></div><div><dt>Receipt</dt><dd>{selectedArtifact.receipt}</dd></div><div><dt>Root hash</dt><dd className="mono">{selectedArtifact.rootHash}</dd></div></dl><p>The original artifact remains visible and unchanged regardless of the challenge result. Corrections append public understanding; they never rewrite history.</p><Link href={`/artifacts/${selectedArtifact.id.toLowerCase()}`}>Open original artifact →</Link></article>
            </div>
            <header className="subhead"><div><p className="eyebrow">Counter-evidence</p><h3>{admittedCount} admitted of {evidence.length} submitted items</h3></div><button className="secondary" onClick={addEvidence}>Add evidence item</button></header>
            <div className="evidence-grid">{evidence.map((item, index) => <article className="evidence-card" key={item.id}><div className="card-top"><span>{item.id}</span><b className={`status ${tone(item.admissibility)}`}>{item.admissibility}</b></div><input value={item.title} onChange={(event) => setEvidence((items) => items.map((entry, entryIndex) => entryIndex === index ? { ...entry, title: event.target.value } : entry))} /><p>{item.source}</p><code>{item.hash}</code><select value={item.admissibility} onChange={(event) => setEvidence((items) => items.map((entry, entryIndex) => entryIndex === index ? { ...entry, admissibility: event.target.value as EvidenceItem["admissibility"] } : entry))}><option value="PENDING">PENDING</option><option value="ADMITTED">ADMITTED</option><option value="REJECTED">REJECTED</option></select><textarea value={item.notes} onChange={(event) => setEvidence((items) => items.map((entry, entryIndex) => entryIndex === index ? { ...entry, notes: event.target.value } : entry))} rows={5} /></article>)}</div>
          </div>
        )}

        {view === "comparison" && (
          <div className="stack">
            <header className="section-head"><div><p className="eyebrow">Side-by-side comparison</p><h2>Original, challenged, and corrected states</h2></div><select value={selectedArtifactId} onChange={(event) => setSelectedArtifactId(event.target.value)}>{ARTIFACTS.map((item) => <option key={item.id} value={item.id}>{item.id}</option>)}</select></header>
            <div className="comparison-grid">
              <article className="comparison-card original"><span>Original artifact</span><h3>{selectedArtifact.id}</h3><p>Frozen event, route, evidence snapshot, authority, determination, execution effect, outcome, and original hashes.</p><ul><li>Record identity preserved</li><li>Hashes remain independently verifiable</li><li>Authority and scope remain explicit</li><li>Claims stay bounded to the reviewed event</li></ul></article>
              <article className="comparison-card challenged"><span>Challenge overlay</span><h3>{selectedArtifact.id}</h3><p>Counter-evidence, claimed discrepancy, review scope, disclosure boundary, custody events, and requested relief.</p><ul><li>Record identity preserved</li><li>Hashes remain independently verifiable</li><li>Authority and scope remain explicit</li><li>Claims stay bounded to the reviewed event</li></ul></article>
              <article className="comparison-card corrected"><span>Corrected interpretation</span><h3>{selectedArtifact.id}</h3><p>Append-only finding, amendment hash, supersession status, corrected public statement, and preserved original relationship.</p><ul><li>Record identity preserved</li><li>Hashes remain independently verifiable</li><li>Authority and scope remain explicit</li><li>Claims stay bounded to the reviewed event</li></ul></article>
            </div>
            <div className="review-table"><div className="table-head"><span>Domain</span><span>Original state</span><span>Challenge assertion</span><span>Required resolution</span></div>{["Reality","Record","Continuity","Admissibility","Binding","Commit","Execution","Outcome"].map((domain, index) => <div className="table-row" key={domain}><strong>{String(index + 1).padStart(2, "0")} · {domain}</strong><span>Frozen and attributable</span><span>{index % 3 === 0 ? "Material discrepancy alleged" : "No contradiction alleged"}</span><span>{index % 3 === 0 ? "Reviewer finding required" : "Preserve original state"}</span></div>)}</div>
          </div>
        )}

        {view === "custody" && (
          <div className="stack">
            <header className="section-head"><div><p className="eyebrow">Chain of custody</p><h2>Every challenge transfer remains visible</h2></div><button className="secondary" onClick={() => downloadJson("ta14-challenge-custody.json", CUSTODY_EVENTS)}>Download custody ledger</button></header>
            <div className="timeline">{CUSTODY_EVENTS.map((event) => <article className="timeline-event" key={event.sequence}><div className="timeline-index">{String(event.sequence).padStart(2, "0")}</div><div><div className="card-top"><strong>{event.action}</strong><time>{event.time}</time></div><h3>{event.object}</h3><p>{event.result}</p><dl><div><dt>Actor</dt><dd>{event.actor}</dd></div><div><dt>Hash</dt><dd className="mono">{event.hash}</dd></div></dl></div></article>)}</div>
          </div>
        )}

        {view === "review" && (
          <div className="stack">
            <header className="section-head"><div><p className="eyebrow">Artifact review center</p><h2>Apply eighty bounded review controls</h2></div><span className="status under-review">UNDER REVIEW</span></header>
            <div className="review-question-grid">{REVIEW_QUESTIONS.map((item) => <article className="review-question" key={item.id}><div className="card-top"><span>{item.id}</span><b>{item.domain}</b></div><h3>{item.question}</h3><p><strong>Pass:</strong> {item.passCondition}</p><p><strong>Failure:</strong> {item.failureEffect}</p><div className="mini-actions"><button>Pass</button><button>Hold</button><button>Escalate</button></div></article>)}</div>
          </div>
        )}

        {view === "resolution" && (
          <div className="stack">
            <header className="section-head"><div><p className="eyebrow">Resolution chamber</p><h2>Append the finding without erasing the event</h2></div><button className="primary" onClick={() => setChallengeState("CLOSED")}>Commit resolution</button></header>
            <div className="resolution-hero"><div><span>Current workflow state</span><strong>{challengeState.replaceAll("_", " ")}</strong><p>{challengeTitle}</p></div><div><span>Admitted counter-evidence</span><strong>{admittedCount}/{evidence.length}</strong><p>Only admitted evidence may support the final finding.</p></div><div><span>Original artifact</span><strong>{selectedArtifact.id}</strong><p>Original event remains immutable and publicly traceable.</p></div></div>
            <div className="resolution-grid">{RESOLUTION_STEPS.map((step) => <article className="resolution-step" key={step.id}><span>{step.id}</span><h3>{step.title}</h3><p>{step.description}</p><strong>{step.requiredOutput}</strong></article>)}</div>
            <article className="panel final-directive"><p className="eyebrow">Final directive</p><h3>Correct the public understanding, never the past.</h3><p>A challenge can be upheld, modified, reversed, rejected, superseded, or closed. Every result must preserve the original root, append a new amendment hash, identify the deciding authority, state the evidence boundary, and remain independently challengeable.</p><div className="button-row"><button className="primary" onClick={() => downloadJson(`resolution-${selectedArtifact.id}.json`, packagePayload)}>Download correction package</button><Link className="secondary" href="/artifacts/verify">Verify amended record</Link></div></article>
          </div>
        )}

        {view === "history" && (
          <div className="stack">
            <header className="section-head"><div><p className="eyebrow">Version history</p><h2>Original, challenge, review, and resolution remain reconstructable</h2></div></header>
            <div className="history-map">{["ORIGINAL PUBLISHED","CHALLENGE OPENED","COUNTER-EVIDENCE ADMITTED","REVIEW ASSIGNED","FINDING COMMITTED","CORRECTION PUBLISHED","PACKAGE REVERIFIED"].map((item, index) => <article key={item}><span>{String(index + 1).padStart(2, "0")}</span><h3>{item}</h3><p>Version {index + 1}.0 preserves its own timestamp, actor, scope, component hashes, and relationship to the immutable original.</p><code>TA14-HISTORY-{selectedArtifact.sequence}-{index + 1}</code></article>)}</div>
          </div>
        )}
      </section>

      <section className="principles shell">
        <article><span>01</span><h3>Original remains visible</h3><p>The challenge process never deletes or rewrites the original execution event.</p></article>
        <article><span>02</span><h3>Counter-evidence must be admitted</h3><p>New material does not govern until attribution, continuity, integrity, relevance, and disclosure are resolved.</p></article>
        <article><span>03</span><h3>Review authority is bounded</h3><p>A reviewer may decide only within the assigned scope and declared authority.</p></article>
        <article><span>04</span><h3>Corrections are append-only</h3><p>A corrected interpretation receives a new amendment hash while retaining the original root.</p></article>
        <article><span>05</span><h3>Challenges remain challengeable</h3><p>The resolution itself is a governed record and may be independently inspected.</p></article>
      </section>

      <footer className="footer shell"><div><strong>TA-14 Challenge &amp; Correction Center</strong><p>No admissible evidence. No admissible execution. No silent correction.</p></div><nav><Link href="/artifacts">Artifact Library</Link><Link href="/artifacts/verify">Verification Center</Link><Link href="/workspace/artifacts/build">Artifact Studio</Link></nav></footer>

      <style jsx>{`
        :global(*) { box-sizing: border-box; }
        :global(html) { scroll-behavior: smooth; }
        :global(body) { margin: 0; background: #050914; color: #eef6ff; }
        :global(button), :global(input), :global(select), :global(textarea) { font: inherit; }
        .challenge-center { min-height: 100vh; position: relative; overflow: hidden; padding: 32px 0 80px; background: radial-gradient(circle at 20% 10%, rgba(24, 112, 255, .18), transparent 34%), radial-gradient(circle at 82% 18%, rgba(187, 74, 255, .15), transparent 32%), linear-gradient(180deg, #07101f 0%, #03060d 100%); }
        .challenge-center:before { content: ""; position: fixed; inset: 0; pointer-events: none; opacity: .24; background-image: linear-gradient(rgba(106,177,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(106,177,255,.08) 1px, transparent 1px); background-size: 46px 46px; mask-image: linear-gradient(to bottom, black, transparent 75%); }
        .ambient { position: fixed; width: 520px; height: 520px; border-radius: 50%; filter: blur(90px); opacity: .17; pointer-events: none; }
        .ambient-one { background: #1f75ff; left: -220px; top: 180px; }
        .ambient-two { background: #b14cff; right: -240px; top: 620px; }
        .shell { width: min(1460px, calc(100% - 40px)); margin: 0 auto; position: relative; z-index: 1; }
        .hero { display: grid; grid-template-columns: 1.45fr .55fr; gap: 26px; padding: 48px; border: 1px solid rgba(153,204,255,.22); border-radius: 30px; background: linear-gradient(135deg, rgba(14,30,58,.94), rgba(8,14,28,.86)); box-shadow: 0 30px 90px rgba(0,0,0,.42), inset 0 1px rgba(255,255,255,.05); }
        .eyebrow { margin: 0 0 10px; color: #79baff; text-transform: uppercase; letter-spacing: .16em; font-size: 12px; font-weight: 800; }
        h1 { margin: 0; max-width: 900px; font-size: clamp(44px, 6vw, 84px); line-height: .94; letter-spacing: -.055em; }
        .lede { max-width: 900px; color: #b8c8dc; line-height: 1.8; font-size: 17px; }
        .hero-actions, .button-row { display: flex; flex-wrap: wrap; gap: 12px; }
        .primary, .secondary, button, a { transition: transform .2s ease, border-color .2s ease, background .2s ease, color .2s ease; }
        .primary, .secondary, .challenge-card button, .mini-actions button { border: 1px solid rgba(133,194,255,.24); border-radius: 12px; padding: 12px 16px; cursor: pointer; text-decoration: none; color: #eaf5ff; background: rgba(255,255,255,.045); }
        .primary { border-color: rgba(99,181,255,.55); background: linear-gradient(135deg, #1274ff, #7448ee); font-weight: 800; }
        .primary:hover, .secondary:hover, button:hover, a:hover { transform: translateY(-2px); border-color: rgba(133,194,255,.7); }
        .hero-core { display: flex; flex-direction: column; justify-content: center; gap: 12px; padding: 26px; border-radius: 24px; border: 1px solid rgba(137,196,255,.22); background: radial-gradient(circle at top, rgba(70,132,255,.22), transparent 55%), rgba(3,8,18,.72); }
        .hero-core strong { font-size: 30px; }
        .hero-core span:not(.core-label) { color: #bcd0e5; }
        .core-label { color: #76b9ff; font-size: 11px; text-transform: uppercase; letter-spacing: .14em; }
        .determination { display: inline-flex; width: fit-content; padding: 8px 12px; border-radius: 999px; font-weight: 900; letter-spacing: .08em; font-size: 12px; }
        .allow { color: #96ffd0; background: rgba(20,193,119,.13); border: 1px solid rgba(51,234,153,.34); }
        .hold { color: #ffe39c; background: rgba(245,171,31,.13); border: 1px solid rgba(255,194,74,.34); }
        .deny { color: #ffb2b2; background: rgba(232,61,61,.13); border: 1px solid rgba(255,96,96,.34); }
        .escalate { color: #d5bdff; background: rgba(138,86,255,.14); border: 1px solid rgba(174,131,255,.36); }
        .metrics { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-top: 18px; }
        .metric { min-height: 140px; padding: 22px; border-radius: 20px; border: 1px solid rgba(126,183,239,.16); background: linear-gradient(180deg, rgba(18,34,60,.82), rgba(7,13,25,.82)); }
        .metric span, .metric small { color: #8fa8c1; }
        .metric strong { display: block; margin: 12px 0; font-size: 34px; }
        .view-tabs { display: flex; gap: 8px; overflow-x: auto; margin-top: 22px; padding: 8px; border: 1px solid rgba(126,183,239,.15); border-radius: 16px; background: rgba(6,12,23,.75); }
        .view-tabs button { white-space: nowrap; border: 0; border-radius: 11px; padding: 12px 15px; color: #93aac1; background: transparent; cursor: pointer; }
        .view-tabs button.active { color: white; background: linear-gradient(135deg, rgba(29,116,255,.76), rgba(112,67,230,.76)); }
        .workspace { margin-top: 18px; padding: 30px; min-height: 600px; border-radius: 26px; border: 1px solid rgba(132,190,246,.18); background: linear-gradient(180deg, rgba(8,18,34,.94), rgba(4,9,18,.94)); box-shadow: 0 30px 80px rgba(0,0,0,.34); }
        .stack { display: grid; gap: 24px; }
        .section-head, .subhead, .card-top { display: flex; justify-content: space-between; gap: 20px; align-items: center; }
        .section-head h2, .subhead h3 { margin: 0; font-size: clamp(28px, 3vw, 46px); letter-spacing: -.03em; }
        .filter-bar { display: grid; grid-template-columns: 1fr 260px; gap: 12px; }
        input, select, textarea { width: 100%; color: #eef7ff; border: 1px solid rgba(133,194,255,.22); border-radius: 12px; padding: 13px 14px; background: rgba(2,7,15,.72); outline: none; }
        input:focus, select:focus, textarea:focus { border-color: rgba(104,181,255,.7); box-shadow: 0 0 0 3px rgba(52,136,255,.12); }
        label { display: grid; gap: 8px; color: #a9bdd1; font-size: 13px; font-weight: 700; }
        .challenge-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; }
        .challenge-card, .panel, .evidence-card, .review-question, .resolution-step, .comparison-card { border: 1px solid rgba(128,187,244,.16); border-radius: 18px; padding: 20px; background: linear-gradient(180deg, rgba(18,34,60,.72), rgba(7,13,25,.72)); }
        .challenge-card h3, .panel h3, .evidence-card h3, .review-question h3, .resolution-step h3, .comparison-card h3 { margin: 12px 0; }
        .challenge-card p, .panel p, .evidence-card p, .review-question p, .resolution-step p, .comparison-card p { color: #9eb3c8; line-height: 1.65; }
        dl { display: grid; gap: 9px; margin: 18px 0; }
        dl div { display: grid; grid-template-columns: 110px 1fr; gap: 12px; }
        dt { color: #7f9ab4; }
        dd { margin: 0; word-break: break-word; }
        .status { display: inline-flex; padding: 6px 9px; border-radius: 999px; color: #d9eaff; background: rgba(104,145,190,.17); border: 1px solid rgba(128,187,244,.22); font-size: 11px; letter-spacing: .06em; }
        .under-review, .submitted { color: #d6c3ff; border-color: rgba(167,119,255,.34); background: rgba(136,81,231,.15); }
        .upheld, .closed { color: #a9ffd2; border-color: rgba(68,225,146,.34); background: rgba(31,176,111,.15); }
        .modified, .reversed { color: #ffe3a4; border-color: rgba(255,192,80,.34); background: rgba(213,146,23,.14); }
        .two-col { display: grid; grid-template-columns: 1.2fr .8fr; gap: 18px; }
        .form-panel { display: grid; gap: 15px; }
        .artifact-lock { position: sticky; top: 20px; align-self: start; }
        .mono, code { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 11px; color: #8bc9ff; word-break: break-all; }
        .evidence-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
        .evidence-card { display: grid; gap: 12px; }
        .comparison-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; }
        .comparison-card.original { box-shadow: inset 0 3px #2f8cff; }
        .comparison-card.challenged { box-shadow: inset 0 3px #ac6cff; }
        .comparison-card.corrected { box-shadow: inset 0 3px #45db9a; }
        .comparison-card span { color: #7ebdff; font-size: 12px; text-transform: uppercase; letter-spacing: .12em; }
        .comparison-card ul { padding-left: 18px; color: #b5c8da; line-height: 1.8; }
        .review-table { overflow: hidden; border: 1px solid rgba(128,187,244,.16); border-radius: 16px; }
        .table-head, .table-row { display: grid; grid-template-columns: 1fr 1fr 1.2fr 1.2fr; gap: 12px; padding: 14px 16px; }
        .table-head { color: #79baff; background: rgba(28,80,136,.18); font-size: 12px; text-transform: uppercase; letter-spacing: .08em; }
        .table-row { color: #a9bed1; border-top: 1px solid rgba(128,187,244,.1); }
        .timeline { display: grid; gap: 12px; }
        .timeline-event { display: grid; grid-template-columns: 58px 1fr; gap: 16px; padding: 18px; border: 1px solid rgba(128,187,244,.14); border-radius: 16px; background: rgba(10,22,40,.7); }
        .timeline-index { display: grid; place-items: center; height: 50px; border-radius: 14px; color: #9dd1ff; background: linear-gradient(135deg, rgba(27,114,255,.3), rgba(137,74,239,.25)); font-weight: 900; }
        .review-question-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 13px; }
        .mini-actions { display: flex; gap: 8px; margin-top: 14px; }
        .mini-actions button { flex: 1; padding: 8px; font-size: 11px; }
        .resolution-hero { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
        .resolution-hero > div { padding: 22px; border-radius: 18px; border: 1px solid rgba(128,187,244,.16); background: rgba(11,25,45,.72); }
        .resolution-hero span { color: #86a5c2; }
        .resolution-hero strong { display: block; margin: 10px 0; font-size: 26px; }
        .resolution-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
        .resolution-step span { color: #78baff; font-size: 11px; letter-spacing: .1em; }
        .final-directive { padding: 30px; background: linear-gradient(135deg, rgba(24,89,178,.24), rgba(111,52,186,.18)); }
        .history-map { display: grid; grid-template-columns: repeat(7, minmax(180px, 1fr)); gap: 12px; overflow-x: auto; padding-bottom: 8px; }
        .history-map article { min-height: 240px; padding: 18px; border-radius: 16px; border: 1px solid rgba(128,187,244,.16); background: rgba(10,22,40,.72); }
        .history-map article > span { display: grid; place-items: center; width: 38px; height: 38px; border-radius: 50%; background: rgba(41,126,255,.22); color: #9cd0ff; font-weight: 900; }
        .principles { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; margin-top: 22px; }
        .principles article { padding: 20px; border-radius: 17px; border: 1px solid rgba(128,187,244,.14); background: rgba(8,18,33,.76); }
        .principles span { color: #76b9ff; }
        .principles p { color: #92abc2; line-height: 1.6; }
        .footer { display: flex; justify-content: space-between; gap: 24px; margin-top: 24px; padding: 28px; border-top: 1px solid rgba(128,187,244,.16); color: #91a7bc; }
        .footer nav { display: flex; flex-wrap: wrap; gap: 18px; }
        .footer a { color: #b9d8f5; text-decoration: none; }
        @media (max-width: 1100px) { .hero { grid-template-columns: 1fr; } .metrics, .principles { grid-template-columns: repeat(2, 1fr); } .challenge-grid, .evidence-grid, .comparison-grid { grid-template-columns: repeat(2, 1fr); } .two-col { grid-template-columns: 1fr; } .artifact-lock { position: static; } .resolution-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 760px) { .shell { width: min(100% - 22px, 1460px); } .challenge-center { padding-top: 14px; } .hero, .workspace { padding: 22px; border-radius: 20px; } .metrics, .principles, .challenge-grid, .evidence-grid, .comparison-grid, .review-question-grid, .resolution-hero, .resolution-grid { grid-template-columns: 1fr; } .filter-bar { grid-template-columns: 1fr; } .section-head, .subhead, .footer { align-items: flex-start; flex-direction: column; } .table-head { display: none; } .table-row { grid-template-columns: 1fr; } .timeline-event { grid-template-columns: 1fr; } h1 { font-size: 46px; } }
      `}</style>
    </main>
  );
}
