"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type ReactNode } from "react";

type View = "command" | "profile" | "routes" | "artifacts" | "verification" | "challenges" | "portfolio" | "members" | "controls" | "settings";
type Determination = "ALLOW" | "HOLD" | "DENY" | "ESCALATE";
type RouteStatus = "DRAFT" | "IN_REVIEW" | "READY" | "PUBLISHED";
type ArtifactStatus = "DRAFT" | "PUBLISHED" | "CHALLENGED" | "CORRECTED" | "SUPERSEDED" | "WITHDRAWN";
type ChallengeState = "PENDING" | "UNDER_REVIEW" | "UPHELD" | "MODIFIED" | "REVERSED" | "CLOSED";
type MemberStatus = "ACTIVE" | "INVITED" | "SUSPENDED";
type ExportState = "DRAFT" | "READY" | "GENERATING" | "FAILED";
type ControlStatus = "PASS" | "REVIEW" | "PENDING" | "FAIL";

type RouteRecord = { id:string; title:string; sector:string; version:string; status:RouteStatus; runs:number; owner:string; updated:string };
type ArtifactRecord = { id:string; title:string; determination:Determination; verification:number; status:ArtifactStatus; route:string; updated:string; challenges:number };
type ChallengeRecord = { id:string; artifact:string; issue:string; state:ChallengeState; opened:string; owner:string };
type MemberRecord = { id:string; name:string; role:string; status:MemberStatus; permissions:number; lastActive:string };
type ExportRecord = { id:string; name:string; format:string; state:ExportState; artifacts:number; updated:string };
type ControlRecord = { id:string; area:string; title:string; requirement:string; status:ControlStatus };

const ROUTES: RouteRecord[] = [
  {
    id: "RTE-001",
    title: "Bounded vendor payment",
    sector: "Financial execution",
    version: "v3.4",
    status: "READY" as RouteStatus,
    runs: 24,
    owner: "Route Steward",
    updated: "2026-08-25",
  },
  {
    id: "RTE-002",
    title: "Privileged access restoration",
    sector: "Cybersecurity",
    version: "v2.8",
    status: "PUBLISHED" as RouteStatus,
    runs: 18,
    owner: "Route Steward",
    updated: "2026-08-19",
  },
  {
    id: "RTE-003",
    title: "Clinical routing adjudication",
    sector: "Healthcare",
    version: "v1.9",
    status: "IN_REVIEW" as RouteStatus,
    runs: 12,
    owner: "Route Steward",
    updated: "2026-08-13",
  },
  {
    id: "RTE-004",
    title: "Model deployment boundary",
    sector: "AI operations",
    version: "v4.2",
    status: "READY" as RouteStatus,
    runs: 21,
    owner: "Route Steward",
    updated: "2026-08-22",
  },
  {
    id: "RTE-005",
    title: "Sterility evidence release",
    sector: "Life sciences",
    version: "v2.1",
    status: "DRAFT" as RouteStatus,
    runs: 9,
    owner: "Route Steward",
    updated: "2026-08-10",
  },
  {
    id: "RTE-006",
    title: "Water-treatment threshold change",
    sector: "Critical infrastructure",
    version: "v1.6",
    status: "PUBLISHED" as RouteStatus,
    runs: 17,
    owner: "Route Steward",
    updated: "2026-08-18",
  },
  {
    id: "RTE-007",
    title: "Cross-border evidence transfer",
    sector: "Data governance",
    version: "v3.0",
    status: "READY" as RouteStatus,
    runs: 15,
    owner: "Route Steward",
    updated: "2026-08-16",
  },
  {
    id: "RTE-008",
    title: "Autonomous building intervention",
    sector: "Physical systems",
    version: "v2.5",
    status: "DRAFT" as RouteStatus,
    runs: 7,
    owner: "Route Steward",
    updated: "2026-08-08",
  },
];

const ARTIFACTS: ArtifactRecord[] = [
  {
    id: "TA14-EA-000001",
    title: "Complete authorized execution",
    determination: "ALLOW" as Determination,
    verification: 4,
    status: "PUBLISHED" as ArtifactStatus,
    route: "RTE-001",
    updated: "2026-08-01",
    challenges: 0,
  },
  {
    id: "TA14-EA-000002",
    title: "Authority changed before execution",
    determination: "HOLD" as Determination,
    verification: 5,
    status: "PUBLISHED" as ArtifactStatus,
    route: "RTE-002",
    updated: "2026-08-02",
    challenges: 0,
  },
  {
    id: "TA14-EA-000003",
    title: "Requested action exceeds boundary",
    determination: "DENY" as Determination,
    verification: 6,
    status: "PUBLISHED" as ArtifactStatus,
    route: "RTE-003",
    updated: "2026-08-03",
    challenges: 0,
  },
  {
    id: "TA14-EA-000004",
    title: "Admissible evidence conflicts",
    determination: "ESCALATE" as Determination,
    verification: 7,
    status: "PUBLISHED" as ArtifactStatus,
    route: "RTE-004",
    updated: "2026-08-04",
    challenges: 1,
  },
  {
    id: "TA14-EA-000005",
    title: "Evidence expires before commit",
    determination: "ALLOW" as Determination,
    verification: 3,
    status: "PUBLISHED" as ArtifactStatus,
    route: "RTE-005",
    updated: "2026-08-05",
    challenges: 0,
  },
  {
    id: "TA14-EA-000006",
    title: "Unauthorized runtime version",
    determination: "HOLD" as Determination,
    verification: 4,
    status: "PUBLISHED" as ArtifactStatus,
    route: "RTE-006",
    updated: "2026-08-06",
    challenges: 0,
  },
  {
    id: "TA14-EA-000007",
    title: "Authorized threshold exceeded",
    determination: "DENY" as Determination,
    verification: 5,
    status: "PUBLISHED" as ArtifactStatus,
    route: "RTE-007",
    updated: "2026-08-07",
    challenges: 0,
  },
  {
    id: "TA14-EA-000008",
    title: "Material condition changed after approval",
    determination: "ESCALATE" as Determination,
    verification: 6,
    status: "PUBLISHED" as ArtifactStatus,
    route: "RTE-008",
    updated: "2026-08-08",
    challenges: 0,
  },
  {
    id: "TA14-EA-000009",
    title: "Mandatory gate bypass attempted",
    determination: "ALLOW" as Determination,
    verification: 7,
    status: "PUBLISHED" as ArtifactStatus,
    route: "RTE-001",
    updated: "2026-08-09",
    challenges: 1,
  },
  {
    id: "TA14-EA-000010",
    title: "Dual-authority execution",
    determination: "HOLD" as Determination,
    verification: 3,
    status: "PUBLISHED" as ArtifactStatus,
    route: "RTE-002",
    updated: "2026-08-10",
    challenges: 0,
  },
  {
    id: "TA14-EA-000011",
    title: "Confidential evidence verified without disclosure",
    determination: "DENY" as Determination,
    verification: 4,
    status: "PUBLISHED" as ArtifactStatus,
    route: "RTE-003",
    updated: "2026-08-11",
    challenges: 0,
  },
  {
    id: "TA14-EA-000012",
    title: "Preserved chain-of-custody closure",
    determination: "ESCALATE" as Determination,
    verification: 5,
    status: "PUBLISHED" as ArtifactStatus,
    route: "RTE-004",
    updated: "2026-08-12",
    challenges: 0,
  },
];

const CHALLENGES: ChallengeRecord[] = [
  {
    id: "CH-0001",
    artifact: "TA14-EA-000001",
    issue: "Authority scope",
    state: "UNDER_REVIEW" as ChallengeState,
    opened: "2026-07-11",
    owner: "Challenge Officer 1",
  },
  {
    id: "CH-0002",
    artifact: "TA14-EA-000002",
    issue: "Outcome closure",
    state: "UPHELD" as ChallengeState,
    opened: "2026-07-12",
    owner: "Challenge Officer 2",
  },
  {
    id: "CH-0003",
    artifact: "TA14-EA-000003",
    issue: "Disclosure boundary",
    state: "CLOSED" as ChallengeState,
    opened: "2026-07-13",
    owner: "Challenge Officer 3",
  },
  {
    id: "CH-0004",
    artifact: "TA14-EA-000004",
    issue: "Evidence sufficiency",
    state: "PENDING" as ChallengeState,
    opened: "2026-07-14",
    owner: "Challenge Officer 1",
  },
  {
    id: "CH-0005",
    artifact: "TA14-EA-000005",
    issue: "Authority scope",
    state: "UNDER_REVIEW" as ChallengeState,
    opened: "2026-07-15",
    owner: "Challenge Officer 2",
  },
  {
    id: "CH-0006",
    artifact: "TA14-EA-000006",
    issue: "Outcome closure",
    state: "UPHELD" as ChallengeState,
    opened: "2026-07-16",
    owner: "Challenge Officer 3",
  },
  {
    id: "CH-0007",
    artifact: "TA14-EA-000007",
    issue: "Disclosure boundary",
    state: "CLOSED" as ChallengeState,
    opened: "2026-07-17",
    owner: "Challenge Officer 1",
  },
  {
    id: "CH-0008",
    artifact: "TA14-EA-000008",
    issue: "Evidence sufficiency",
    state: "PENDING" as ChallengeState,
    opened: "2026-07-18",
    owner: "Challenge Officer 2",
  },
  {
    id: "CH-0009",
    artifact: "TA14-EA-000009",
    issue: "Authority scope",
    state: "UNDER_REVIEW" as ChallengeState,
    opened: "2026-07-19",
    owner: "Challenge Officer 3",
  },
  {
    id: "CH-0010",
    artifact: "TA14-EA-000010",
    issue: "Outcome closure",
    state: "UPHELD" as ChallengeState,
    opened: "2026-07-20",
    owner: "Challenge Officer 1",
  },
  {
    id: "CH-0011",
    artifact: "TA14-EA-000011",
    issue: "Disclosure boundary",
    state: "CLOSED" as ChallengeState,
    opened: "2026-07-21",
    owner: "Challenge Officer 2",
  },
  {
    id: "CH-0012",
    artifact: "TA14-EA-000012",
    issue: "Evidence sufficiency",
    state: "PENDING" as ChallengeState,
    opened: "2026-07-22",
    owner: "Challenge Officer 3",
  },
];

const MEMBERS: MemberRecord[] = [
  {
    id: "M-001",
    name: "Accountable Owner",
    role: "Accountable Owner",
    status: "ACTIVE" as MemberStatus,
    permissions: 4,
    lastActive: "2026-08-02",
  },
  {
    id: "M-002",
    name: "Governance Steward",
    role: "Governance Steward",
    status: "ACTIVE" as MemberStatus,
    permissions: 5,
    lastActive: "2026-08-03",
  },
  {
    id: "M-003",
    name: "Route Steward",
    role: "Route Steward",
    status: "ACTIVE" as MemberStatus,
    permissions: 6,
    lastActive: "2026-08-04",
  },
  {
    id: "M-004",
    name: "Evidence Custodian",
    role: "Evidence Custodian",
    status: "ACTIVE" as MemberStatus,
    permissions: 7,
    lastActive: "2026-08-05",
  },
  {
    id: "M-005",
    name: "Authority Resolver",
    role: "Authority Resolver",
    status: "ACTIVE" as MemberStatus,
    permissions: 8,
    lastActive: "2026-08-06",
  },
  {
    id: "M-006",
    name: "Independent Reviewer",
    role: "Independent Reviewer",
    status: "ACTIVE" as MemberStatus,
    permissions: 9,
    lastActive: "2026-08-07",
  },
  {
    id: "M-007",
    name: "Registry Publisher",
    role: "Registry Publisher",
    status: "ACTIVE" as MemberStatus,
    permissions: 10,
    lastActive: "2026-08-08",
  },
  {
    id: "M-008",
    name: "Challenge Officer",
    role: "Challenge Officer",
    status: "ACTIVE" as MemberStatus,
    permissions: 11,
    lastActive: "2026-08-09",
  },
];

const EXPORTS: ExportRecord[] = [
  {
    id: "EXP-001",
    name: "Board evidence portfolio",
    format: "PDF",
    state: "READY" as ExportState,
    artifacts: 4,
    updated: "2026-08-01",
  },
  {
    id: "EXP-002",
    name: "Procurement assurance package",
    format: "ZIP",
    state: "READY" as ExportState,
    artifacts: 5,
    updated: "2026-08-02",
  },
  {
    id: "EXP-003",
    name: "Regulatory submission",
    format: "JSON",
    state: "DRAFT" as ExportState,
    artifacts: 6,
    updated: "2026-08-03",
  },
  {
    id: "EXP-004",
    name: "Independent review packet",
    format: "PDF",
    state: "READY" as ExportState,
    artifacts: 7,
    updated: "2026-08-04",
  },
  {
    id: "EXP-005",
    name: "Sector comparison report",
    format: "CSV",
    state: "READY" as ExportState,
    artifacts: 8,
    updated: "2026-08-05",
  },
  {
    id: "EXP-006",
    name: "Challenge history export",
    format: "ZIP",
    state: "DRAFT" as ExportState,
    artifacts: 9,
    updated: "2026-08-06",
  },
];

const CONTROLS: ControlRecord[] = [
  {
    id: "GC-001",
    area: "Identity",
    title: "Identity control 001",
    requirement: "Preserve attributable identity evidence and prevent silent state drift before reliance.",
    status: "PASS" as ControlStatus,
  },
  {
    id: "GC-002",
    area: "Ownership",
    title: "Ownership control 002",
    requirement: "Preserve attributable ownership evidence and prevent silent state drift before reliance.",
    status: "PASS" as ControlStatus,
  },
  {
    id: "GC-003",
    area: "Architecture",
    title: "Architecture control 003",
    requirement: "Preserve attributable architecture evidence and prevent silent state drift before reliance.",
    status: "REVIEW" as ControlStatus,
  },
  {
    id: "GC-004",
    area: "Scope",
    title: "Scope control 004",
    requirement: "Preserve attributable scope evidence and prevent silent state drift before reliance.",
    status: "PENDING" as ControlStatus,
  },
  {
    id: "GC-005",
    area: "Route",
    title: "Route control 005",
    requirement: "Preserve attributable route evidence and prevent silent state drift before reliance.",
    status: "PASS" as ControlStatus,
  },
  {
    id: "GC-006",
    area: "Evidence",
    title: "Evidence control 006",
    requirement: "Preserve attributable evidence evidence and prevent silent state drift before reliance.",
    status: "PASS" as ControlStatus,
  },
  {
    id: "GC-007",
    area: "Authority",
    title: "Authority control 007",
    requirement: "Preserve attributable authority evidence and prevent silent state drift before reliance.",
    status: "PASS" as ControlStatus,
  },
  {
    id: "GC-008",
    area: "Continuity",
    title: "Continuity control 008",
    requirement: "Preserve attributable continuity evidence and prevent silent state drift before reliance.",
    status: "REVIEW" as ControlStatus,
  },
  {
    id: "GC-009",
    area: "Admissibility",
    title: "Admissibility control 009",
    requirement: "Preserve attributable admissibility evidence and prevent silent state drift before reliance.",
    status: "PENDING" as ControlStatus,
  },
  {
    id: "GC-010",
    area: "Binding",
    title: "Binding control 010",
    requirement: "Preserve attributable binding evidence and prevent silent state drift before reliance.",
    status: "PASS" as ControlStatus,
  },
  {
    id: "GC-011",
    area: "Commit",
    title: "Commit control 011",
    requirement: "Preserve attributable commit evidence and prevent silent state drift before reliance.",
    status: "PASS" as ControlStatus,
  },
  {
    id: "GC-012",
    area: "Execution",
    title: "Execution control 012",
    requirement: "Preserve attributable execution evidence and prevent silent state drift before reliance.",
    status: "PASS" as ControlStatus,
  },
  {
    id: "GC-013",
    area: "Outcome",
    title: "Outcome control 013",
    requirement: "Preserve attributable outcome evidence and prevent silent state drift before reliance.",
    status: "REVIEW" as ControlStatus,
  },
  {
    id: "GC-014",
    area: "Integrity",
    title: "Integrity control 014",
    requirement: "Preserve attributable integrity evidence and prevent silent state drift before reliance.",
    status: "PENDING" as ControlStatus,
  },
  {
    id: "GC-015",
    area: "Verification",
    title: "Verification control 015",
    requirement: "Preserve attributable verification evidence and prevent silent state drift before reliance.",
    status: "PASS" as ControlStatus,
  },
  {
    id: "GC-016",
    area: "Challenge",
    title: "Challenge control 016",
    requirement: "Preserve attributable challenge evidence and prevent silent state drift before reliance.",
    status: "PASS" as ControlStatus,
  },
  {
    id: "GC-017",
    area: "Publication",
    title: "Publication control 017",
    requirement: "Preserve attributable publication evidence and prevent silent state drift before reliance.",
    status: "PASS" as ControlStatus,
  },
  {
    id: "GC-018",
    area: "Portfolio",
    title: "Portfolio control 018",
    requirement: "Preserve attributable portfolio evidence and prevent silent state drift before reliance.",
    status: "REVIEW" as ControlStatus,
  },
  {
    id: "GC-019",
    area: "Identity",
    title: "Identity control 019",
    requirement: "Preserve attributable identity evidence and prevent silent state drift before reliance.",
    status: "PENDING" as ControlStatus,
  },
  {
    id: "GC-020",
    area: "Ownership",
    title: "Ownership control 020",
    requirement: "Preserve attributable ownership evidence and prevent silent state drift before reliance.",
    status: "PASS" as ControlStatus,
  },
  {
    id: "GC-021",
    area: "Architecture",
    title: "Architecture control 021",
    requirement: "Preserve attributable architecture evidence and prevent silent state drift before reliance.",
    status: "PASS" as ControlStatus,
  },
  {
    id: "GC-022",
    area: "Scope",
    title: "Scope control 022",
    requirement: "Preserve attributable scope evidence and prevent silent state drift before reliance.",
    status: "PASS" as ControlStatus,
  },
  {
    id: "GC-023",
    area: "Route",
    title: "Route control 023",
    requirement: "Preserve attributable route evidence and prevent silent state drift before reliance.",
    status: "REVIEW" as ControlStatus,
  },
  {
    id: "GC-024",
    area: "Evidence",
    title: "Evidence control 024",
    requirement: "Preserve attributable evidence evidence and prevent silent state drift before reliance.",
    status: "PENDING" as ControlStatus,
  },
  {
    id: "GC-025",
    area: "Authority",
    title: "Authority control 025",
    requirement: "Preserve attributable authority evidence and prevent silent state drift before reliance.",
    status: "PASS" as ControlStatus,
  },
  {
    id: "GC-026",
    area: "Continuity",
    title: "Continuity control 026",
    requirement: "Preserve attributable continuity evidence and prevent silent state drift before reliance.",
    status: "PASS" as ControlStatus,
  },
  {
    id: "GC-027",
    area: "Admissibility",
    title: "Admissibility control 027",
    requirement: "Preserve attributable admissibility evidence and prevent silent state drift before reliance.",
    status: "PASS" as ControlStatus,
  },
  {
    id: "GC-028",
    area: "Binding",
    title: "Binding control 028",
    requirement: "Preserve attributable binding evidence and prevent silent state drift before reliance.",
    status: "REVIEW" as ControlStatus,
  },
  {
    id: "GC-029",
    area: "Commit",
    title: "Commit control 029",
    requirement: "Preserve attributable commit evidence and prevent silent state drift before reliance.",
    status: "PENDING" as ControlStatus,
  },
  {
    id: "GC-030",
    area: "Execution",
    title: "Execution control 030",
    requirement: "Preserve attributable execution evidence and prevent silent state drift before reliance.",
    status: "PASS" as ControlStatus,
  },
  {
    id: "GC-031",
    area: "Outcome",
    title: "Outcome control 031",
    requirement: "Preserve attributable outcome evidence and prevent silent state drift before reliance.",
    status: "PASS" as ControlStatus,
  },
  {
    id: "GC-032",
    area: "Integrity",
    title: "Integrity control 032",
    requirement: "Preserve attributable integrity evidence and prevent silent state drift before reliance.",
    status: "PASS" as ControlStatus,
  },
  {
    id: "GC-033",
    area: "Verification",
    title: "Verification control 033",
    requirement: "Preserve attributable verification evidence and prevent silent state drift before reliance.",
    status: "REVIEW" as ControlStatus,
  },
  {
    id: "GC-034",
    area: "Challenge",
    title: "Challenge control 034",
    requirement: "Preserve attributable challenge evidence and prevent silent state drift before reliance.",
    status: "PENDING" as ControlStatus,
  },
  {
    id: "GC-035",
    area: "Publication",
    title: "Publication control 035",
    requirement: "Preserve attributable publication evidence and prevent silent state drift before reliance.",
    status: "PASS" as ControlStatus,
  },
  {
    id: "GC-036",
    area: "Portfolio",
    title: "Portfolio control 036",
    requirement: "Preserve attributable portfolio evidence and prevent silent state drift before reliance.",
    status: "PASS" as ControlStatus,
  },
  {
    id: "GC-037",
    area: "Identity",
    title: "Identity control 037",
    requirement: "Preserve attributable identity evidence and prevent silent state drift before reliance.",
    status: "PASS" as ControlStatus,
  },
  {
    id: "GC-038",
    area: "Ownership",
    title: "Ownership control 038",
    requirement: "Preserve attributable ownership evidence and prevent silent state drift before reliance.",
    status: "REVIEW" as ControlStatus,
  },
  {
    id: "GC-039",
    area: "Architecture",
    title: "Architecture control 039",
    requirement: "Preserve attributable architecture evidence and prevent silent state drift before reliance.",
    status: "PENDING" as ControlStatus,
  },
  {
    id: "GC-040",
    area: "Scope",
    title: "Scope control 040",
    requirement: "Preserve attributable scope evidence and prevent silent state drift before reliance.",
    status: "PASS" as ControlStatus,
  },
  {
    id: "GC-041",
    area: "Route",
    title: "Route control 041",
    requirement: "Preserve attributable route evidence and prevent silent state drift before reliance.",
    status: "PASS" as ControlStatus,
  },
  {
    id: "GC-042",
    area: "Evidence",
    title: "Evidence control 042",
    requirement: "Preserve attributable evidence evidence and prevent silent state drift before reliance.",
    status: "PASS" as ControlStatus,
  },
  {
    id: "GC-043",
    area: "Authority",
    title: "Authority control 043",
    requirement: "Preserve attributable authority evidence and prevent silent state drift before reliance.",
    status: "REVIEW" as ControlStatus,
  },
  {
    id: "GC-044",
    area: "Continuity",
    title: "Continuity control 044",
    requirement: "Preserve attributable continuity evidence and prevent silent state drift before reliance.",
    status: "PENDING" as ControlStatus,
  },
  {
    id: "GC-045",
    area: "Admissibility",
    title: "Admissibility control 045",
    requirement: "Preserve attributable admissibility evidence and prevent silent state drift before reliance.",
    status: "PASS" as ControlStatus,
  },
  {
    id: "GC-046",
    area: "Binding",
    title: "Binding control 046",
    requirement: "Preserve attributable binding evidence and prevent silent state drift before reliance.",
    status: "PASS" as ControlStatus,
  },
  {
    id: "GC-047",
    area: "Commit",
    title: "Commit control 047",
    requirement: "Preserve attributable commit evidence and prevent silent state drift before reliance.",
    status: "PASS" as ControlStatus,
  },
  {
    id: "GC-048",
    area: "Execution",
    title: "Execution control 048",
    requirement: "Preserve attributable execution evidence and prevent silent state drift before reliance.",
    status: "REVIEW" as ControlStatus,
  },
  {
    id: "GC-049",
    area: "Outcome",
    title: "Outcome control 049",
    requirement: "Preserve attributable outcome evidence and prevent silent state drift before reliance.",
    status: "PENDING" as ControlStatus,
  },
  {
    id: "GC-050",
    area: "Integrity",
    title: "Integrity control 050",
    requirement: "Preserve attributable integrity evidence and prevent silent state drift before reliance.",
    status: "PASS" as ControlStatus,
  },
  {
    id: "GC-051",
    area: "Verification",
    title: "Verification control 051",
    requirement: "Preserve attributable verification evidence and prevent silent state drift before reliance.",
    status: "PASS" as ControlStatus,
  },
  {
    id: "GC-052",
    area: "Challenge",
    title: "Challenge control 052",
    requirement: "Preserve attributable challenge evidence and prevent silent state drift before reliance.",
    status: "PASS" as ControlStatus,
  },
  {
    id: "GC-053",
    area: "Publication",
    title: "Publication control 053",
    requirement: "Preserve attributable publication evidence and prevent silent state drift before reliance.",
    status: "REVIEW" as ControlStatus,
  },
  {
    id: "GC-054",
    area: "Portfolio",
    title: "Portfolio control 054",
    requirement: "Preserve attributable portfolio evidence and prevent silent state drift before reliance.",
    status: "PENDING" as ControlStatus,
  },
  {
    id: "GC-055",
    area: "Identity",
    title: "Identity control 055",
    requirement: "Preserve attributable identity evidence and prevent silent state drift before reliance.",
    status: "PASS" as ControlStatus,
  },
  {
    id: "GC-056",
    area: "Ownership",
    title: "Ownership control 056",
    requirement: "Preserve attributable ownership evidence and prevent silent state drift before reliance.",
    status: "PASS" as ControlStatus,
  },
  {
    id: "GC-057",
    area: "Architecture",
    title: "Architecture control 057",
    requirement: "Preserve attributable architecture evidence and prevent silent state drift before reliance.",
    status: "PASS" as ControlStatus,
  },
  {
    id: "GC-058",
    area: "Scope",
    title: "Scope control 058",
    requirement: "Preserve attributable scope evidence and prevent silent state drift before reliance.",
    status: "REVIEW" as ControlStatus,
  },
  {
    id: "GC-059",
    area: "Route",
    title: "Route control 059",
    requirement: "Preserve attributable route evidence and prevent silent state drift before reliance.",
    status: "PENDING" as ControlStatus,
  },
  {
    id: "GC-060",
    area: "Evidence",
    title: "Evidence control 060",
    requirement: "Preserve attributable evidence evidence and prevent silent state drift before reliance.",
    status: "PASS" as ControlStatus,
  },
  {
    id: "GC-061",
    area: "Authority",
    title: "Authority control 061",
    requirement: "Preserve attributable authority evidence and prevent silent state drift before reliance.",
    status: "PASS" as ControlStatus,
  },
  {
    id: "GC-062",
    area: "Continuity",
    title: "Continuity control 062",
    requirement: "Preserve attributable continuity evidence and prevent silent state drift before reliance.",
    status: "PASS" as ControlStatus,
  },
  {
    id: "GC-063",
    area: "Admissibility",
    title: "Admissibility control 063",
    requirement: "Preserve attributable admissibility evidence and prevent silent state drift before reliance.",
    status: "REVIEW" as ControlStatus,
  },
  {
    id: "GC-064",
    area: "Binding",
    title: "Binding control 064",
    requirement: "Preserve attributable binding evidence and prevent silent state drift before reliance.",
    status: "PENDING" as ControlStatus,
  },
  {
    id: "GC-065",
    area: "Commit",
    title: "Commit control 065",
    requirement: "Preserve attributable commit evidence and prevent silent state drift before reliance.",
    status: "PASS" as ControlStatus,
  },
  {
    id: "GC-066",
    area: "Execution",
    title: "Execution control 066",
    requirement: "Preserve attributable execution evidence and prevent silent state drift before reliance.",
    status: "PASS" as ControlStatus,
  },
  {
    id: "GC-067",
    area: "Outcome",
    title: "Outcome control 067",
    requirement: "Preserve attributable outcome evidence and prevent silent state drift before reliance.",
    status: "PASS" as ControlStatus,
  },
  {
    id: "GC-068",
    area: "Integrity",
    title: "Integrity control 068",
    requirement: "Preserve attributable integrity evidence and prevent silent state drift before reliance.",
    status: "REVIEW" as ControlStatus,
  },
  {
    id: "GC-069",
    area: "Verification",
    title: "Verification control 069",
    requirement: "Preserve attributable verification evidence and prevent silent state drift before reliance.",
    status: "PENDING" as ControlStatus,
  },
  {
    id: "GC-070",
    area: "Challenge",
    title: "Challenge control 070",
    requirement: "Preserve attributable challenge evidence and prevent silent state drift before reliance.",
    status: "PASS" as ControlStatus,
  },
  {
    id: "GC-071",
    area: "Publication",
    title: "Publication control 071",
    requirement: "Preserve attributable publication evidence and prevent silent state drift before reliance.",
    status: "PASS" as ControlStatus,
  },
  {
    id: "GC-072",
    area: "Portfolio",
    title: "Portfolio control 072",
    requirement: "Preserve attributable portfolio evidence and prevent silent state drift before reliance.",
    status: "PASS" as ControlStatus,
  },
  {
    id: "GC-073",
    area: "Identity",
    title: "Identity control 073",
    requirement: "Preserve attributable identity evidence and prevent silent state drift before reliance.",
    status: "REVIEW" as ControlStatus,
  },
  {
    id: "GC-074",
    area: "Ownership",
    title: "Ownership control 074",
    requirement: "Preserve attributable ownership evidence and prevent silent state drift before reliance.",
    status: "PENDING" as ControlStatus,
  },
  {
    id: "GC-075",
    area: "Architecture",
    title: "Architecture control 075",
    requirement: "Preserve attributable architecture evidence and prevent silent state drift before reliance.",
    status: "PASS" as ControlStatus,
  },
  {
    id: "GC-076",
    area: "Scope",
    title: "Scope control 076",
    requirement: "Preserve attributable scope evidence and prevent silent state drift before reliance.",
    status: "PASS" as ControlStatus,
  },
  {
    id: "GC-077",
    area: "Route",
    title: "Route control 077",
    requirement: "Preserve attributable route evidence and prevent silent state drift before reliance.",
    status: "PASS" as ControlStatus,
  },
  {
    id: "GC-078",
    area: "Evidence",
    title: "Evidence control 078",
    requirement: "Preserve attributable evidence evidence and prevent silent state drift before reliance.",
    status: "REVIEW" as ControlStatus,
  },
  {
    id: "GC-079",
    area: "Authority",
    title: "Authority control 079",
    requirement: "Preserve attributable authority evidence and prevent silent state drift before reliance.",
    status: "PENDING" as ControlStatus,
  },
  {
    id: "GC-080",
    area: "Continuity",
    title: "Continuity control 080",
    requirement: "Preserve attributable continuity evidence and prevent silent state drift before reliance.",
    status: "PASS" as ControlStatus,
  },
  {
    id: "GC-081",
    area: "Admissibility",
    title: "Admissibility control 081",
    requirement: "Preserve attributable admissibility evidence and prevent silent state drift before reliance.",
    status: "PASS" as ControlStatus,
  },
  {
    id: "GC-082",
    area: "Binding",
    title: "Binding control 082",
    requirement: "Preserve attributable binding evidence and prevent silent state drift before reliance.",
    status: "PASS" as ControlStatus,
  },
  {
    id: "GC-083",
    area: "Commit",
    title: "Commit control 083",
    requirement: "Preserve attributable commit evidence and prevent silent state drift before reliance.",
    status: "REVIEW" as ControlStatus,
  },
  {
    id: "GC-084",
    area: "Execution",
    title: "Execution control 084",
    requirement: "Preserve attributable execution evidence and prevent silent state drift before reliance.",
    status: "PENDING" as ControlStatus,
  },
  {
    id: "GC-085",
    area: "Outcome",
    title: "Outcome control 085",
    requirement: "Preserve attributable outcome evidence and prevent silent state drift before reliance.",
    status: "PASS" as ControlStatus,
  },
  {
    id: "GC-086",
    area: "Integrity",
    title: "Integrity control 086",
    requirement: "Preserve attributable integrity evidence and prevent silent state drift before reliance.",
    status: "PASS" as ControlStatus,
  },
  {
    id: "GC-087",
    area: "Verification",
    title: "Verification control 087",
    requirement: "Preserve attributable verification evidence and prevent silent state drift before reliance.",
    status: "PASS" as ControlStatus,
  },
  {
    id: "GC-088",
    area: "Challenge",
    title: "Challenge control 088",
    requirement: "Preserve attributable challenge evidence and prevent silent state drift before reliance.",
    status: "REVIEW" as ControlStatus,
  },
  {
    id: "GC-089",
    area: "Publication",
    title: "Publication control 089",
    requirement: "Preserve attributable publication evidence and prevent silent state drift before reliance.",
    status: "PENDING" as ControlStatus,
  },
  {
    id: "GC-090",
    area: "Portfolio",
    title: "Portfolio control 090",
    requirement: "Preserve attributable portfolio evidence and prevent silent state drift before reliance.",
    status: "PASS" as ControlStatus,
  },
  {
    id: "GC-091",
    area: "Identity",
    title: "Identity control 091",
    requirement: "Preserve attributable identity evidence and prevent silent state drift before reliance.",
    status: "PASS" as ControlStatus,
  },
  {
    id: "GC-092",
    area: "Ownership",
    title: "Ownership control 092",
    requirement: "Preserve attributable ownership evidence and prevent silent state drift before reliance.",
    status: "PASS" as ControlStatus,
  },
  {
    id: "GC-093",
    area: "Architecture",
    title: "Architecture control 093",
    requirement: "Preserve attributable architecture evidence and prevent silent state drift before reliance.",
    status: "REVIEW" as ControlStatus,
  },
  {
    id: "GC-094",
    area: "Scope",
    title: "Scope control 094",
    requirement: "Preserve attributable scope evidence and prevent silent state drift before reliance.",
    status: "PENDING" as ControlStatus,
  },
  {
    id: "GC-095",
    area: "Route",
    title: "Route control 095",
    requirement: "Preserve attributable route evidence and prevent silent state drift before reliance.",
    status: "PASS" as ControlStatus,
  },
  {
    id: "GC-096",
    area: "Evidence",
    title: "Evidence control 096",
    requirement: "Preserve attributable evidence evidence and prevent silent state drift before reliance.",
    status: "PASS" as ControlStatus,
  },
  {
    id: "GC-097",
    area: "Authority",
    title: "Authority control 097",
    requirement: "Preserve attributable authority evidence and prevent silent state drift before reliance.",
    status: "PASS" as ControlStatus,
  },
  {
    id: "GC-098",
    area: "Continuity",
    title: "Continuity control 098",
    requirement: "Preserve attributable continuity evidence and prevent silent state drift before reliance.",
    status: "REVIEW" as ControlStatus,
  },
  {
    id: "GC-099",
    area: "Admissibility",
    title: "Admissibility control 099",
    requirement: "Preserve attributable admissibility evidence and prevent silent state drift before reliance.",
    status: "PENDING" as ControlStatus,
  },
  {
    id: "GC-100",
    area: "Binding",
    title: "Binding control 100",
    requirement: "Preserve attributable binding evidence and prevent silent state drift before reliance.",
    status: "PASS" as ControlStatus,
  },
  {
    id: "GC-101",
    area: "Commit",
    title: "Commit control 101",
    requirement: "Preserve attributable commit evidence and prevent silent state drift before reliance.",
    status: "PASS" as ControlStatus,
  },
  {
    id: "GC-102",
    area: "Execution",
    title: "Execution control 102",
    requirement: "Preserve attributable execution evidence and prevent silent state drift before reliance.",
    status: "PASS" as ControlStatus,
  },
  {
    id: "GC-103",
    area: "Outcome",
    title: "Outcome control 103",
    requirement: "Preserve attributable outcome evidence and prevent silent state drift before reliance.",
    status: "REVIEW" as ControlStatus,
  },
  {
    id: "GC-104",
    area: "Integrity",
    title: "Integrity control 104",
    requirement: "Preserve attributable integrity evidence and prevent silent state drift before reliance.",
    status: "PENDING" as ControlStatus,
  },
  {
    id: "GC-105",
    area: "Verification",
    title: "Verification control 105",
    requirement: "Preserve attributable verification evidence and prevent silent state drift before reliance.",
    status: "PASS" as ControlStatus,
  },
  {
    id: "GC-106",
    area: "Challenge",
    title: "Challenge control 106",
    requirement: "Preserve attributable challenge evidence and prevent silent state drift before reliance.",
    status: "PASS" as ControlStatus,
  },
  {
    id: "GC-107",
    area: "Publication",
    title: "Publication control 107",
    requirement: "Preserve attributable publication evidence and prevent silent state drift before reliance.",
    status: "PASS" as ControlStatus,
  },
  {
    id: "GC-108",
    area: "Portfolio",
    title: "Portfolio control 108",
    requirement: "Preserve attributable portfolio evidence and prevent silent state drift before reliance.",
    status: "REVIEW" as ControlStatus,
  },
];

const NAV: {id:View; label:string; eyebrow:string; icon:string}[] = [
  {id:"command",label:"Mission Control",eyebrow:"Overview",icon:"MC"},
  {id:"profile",label:"Governance Profile",eyebrow:"Registration",icon:"GP"},
  {id:"routes",label:"Route Library",eyebrow:"Build",icon:"RT"},
  {id:"artifacts",label:"Artifacts",eyebrow:"Proof",icon:"EA"},
  {id:"verification",label:"Verification",eyebrow:"Reliance",icon:"VR"},
  {id:"challenges",label:"Challenges",eyebrow:"Correction",icon:"CH"},
  {id:"portfolio",label:"Portfolio Exports",eyebrow:"Evidence",icon:"PX"},
  {id:"members",label:"People & Roles",eyebrow:"Authority",icon:"PR"},
  {id:"controls",label:"Control Center",eyebrow:"Readiness",icon:"CC"},
  {id:"settings",label:"Workspace Settings",eyebrow:"Configuration",icon:"WS"},
];

const palette:Record<Determination,string>={ALLOW:"#36d399",HOLD:"#f6c85f",DENY:"#ff6b7a",ESCALATE:"#8ab4ff"};

function Badge({children,tone="neutral"}:{children:ReactNode;tone?:string}){return <span className={`badge ${tone}`}>{children}</span>}
function Meter({value,label}:{value:number;label:string}){return <div className="meter"><div className="meter-head"><span>{label}</span><strong>{value}%</strong></div><div className="meter-track"><span style={{width:`${value}%`}} /></div></div>}
function Card({children,className=""}:{children:ReactNode;className?:string}){return <section className={`card ${className}`}>{children}</section>}
function Stat({label,value,detail}:{label:string;value:string;detail:string}){return <div className="stat"><span>{label}</span><strong>{value}</strong><small>{detail}</small></div>}

export default function RegisteredGovernanceWorkspacePage() {
  const [view,setView]=useState<View>("command");
  const [query,setQuery]=useState("");
  const [determination,setDetermination]=useState<"ALL"|Determination>("ALL");
  const [savedAt,setSavedAt]=useState<string>("");
  const [profile,setProfile]=useState({
    organization:"TA-14 Authority",
    architecture:"TA-14 Admissible Execution Architecture",
    version:"2.0",
    registrationId:"GOV-TA14-000001",
    status:"REGISTERED",
    accountableOwner:"Governance Institution",
    sectors:"AI operations, financial execution, healthcare, critical infrastructure, cybersecurity, life sciences",
    jurisdictions:"United States, European Union, United Kingdom",
    declaredLimits:"Registration establishes attributable identity and scope. It does not certify every execution or artifact.",
  });

  useEffect(()=>{
    const raw=window.localStorage.getItem("ta14-governance-workspace");
    if(raw){try{const parsed=JSON.parse(raw) as {view?:View;profile?:typeof profile};if(parsed.view)setView(parsed.view);if(parsed.profile)setProfile(parsed.profile);}catch{}}
  },[]);

  useEffect(()=>{
    window.localStorage.setItem("ta14-governance-workspace",JSON.stringify({view,profile}));
    setSavedAt(new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}));
  },[view,profile]);

  const filteredArtifacts=useMemo(()=>ARTIFACTS.filter(a=>{
    const matchesDetermination=determination==="ALL"||a.determination===determination;
    const hay=`${a.id} ${a.title} ${a.route} ${a.status}`.toLowerCase();
    return matchesDetermination&&hay.includes(query.toLowerCase());
  }),[query,determination]);

  const readiness=Math.round((CONTROLS.filter(c=>c.status==="PASS").length/CONTROLS.length)*100);
  const published=ARTIFACTS.filter(a=>a.status==="PUBLISHED").length;
  const openChallenges=CHALLENGES.filter(c=>c.state==="PENDING"||c.state==="UNDER_REVIEW").length;
  const avgVerification=(ARTIFACTS.reduce((n,a)=>n+a.verification,0)/ARTIFACTS.length).toFixed(1);

  const downloadWorkspace=()=>{
    const payload={generatedAt:new Date().toISOString(),profile,routes:ROUTES,artifacts:ARTIFACTS,challenges:CHALLENGES,exports:EXPORTS,controls:CONTROLS};
    const blob=new Blob([JSON.stringify(payload,null,2)],{type:"application/json"});
    const url=URL.createObjectURL(blob);const anchor=document.createElement("a");anchor.href=url;anchor.download="ta14-governance-workspace.json";anchor.click();URL.revokeObjectURL(url);
  };

  return <main className="workspace-shell">
    <div className="ambient ambient-a"/><div className="ambient ambient-b"/><div className="grid-floor"/>
    <header className="topbar">
      <Link href="/" className="brand"><span className="brand-mark">TA</span><span><strong>TA-14</strong><small>Registered Governance Workspace</small></span></Link>
      <div className="top-actions"><span className="save-state">Saved {savedAt||"locally"}</span><Link href="/artifacts/studio" className="button primary">Open Artifact Studio</Link><button className="button" onClick={downloadWorkspace}>Export workspace</button></div>
    </header>

    <div className="workspace-frame">
      <aside className="sidebar">
        <div className="identity-card"><span className="kicker">Registered AI governance</span><h2>{profile.architecture}</h2><p>{profile.registrationId}</p><div className="identity-status"><i/>{profile.status}</div></div>
        <nav>{NAV.map(item=><button key={item.id} className={view===item.id?"active":""} onClick={()=>setView(item.id)}><span>{item.icon}</span><div><small>{item.eyebrow}</small><strong>{item.label}</strong></div></button>)}</nav>
        <div className="sidebar-footer"><p>No registered governance. No registered artifact.</p><Link href="/artifacts/registry">Open public registry →</Link></div>
      </aside>

      <section className="content">
        <div className="hero">
          <div><span className="kicker">Governance operating environment</span><h1>{view==="command"?"Governance Mission Control":NAV.find(n=>n.id===view)?.label}</h1><p>Manage attributable identity, governed routes, execution artifacts, verification, challenges, portfolios, people, and institutional controls from one preserved workspace.</p></div>
          <div className="hero-seal"><span>REGISTERED</span><strong>{profile.version}</strong><small>Architecture version</small></div>
        </div>

        {view==="command"&&<CommandView readiness={readiness} published={published} openChallenges={openChallenges} avgVerification={avgVerification} setView={setView}/>}
        {view==="profile"&&<ProfileView profile={profile} setProfile={setProfile}/>}
        {view==="routes"&&<RoutesView/>}
        {view==="artifacts"&&<ArtifactsView query={query} setQuery={setQuery} determination={determination} setDetermination={setDetermination} artifacts={filteredArtifacts}/>}
        {view==="verification"&&<VerificationView/>}
        {view==="challenges"&&<ChallengesView/>}
        {view==="portfolio"&&<PortfolioView/>}
        {view==="members"&&<MembersView/>}
        {view==="controls"&&<ControlsView readiness={readiness}/>}
        {view==="settings"&&<SettingsView/>}
      </section>
    </div>
    <style jsx global>{STYLES}</style>
  </main>;
}

function CommandView({readiness,published,openChallenges,avgVerification,setView}:{readiness:number;published:number;openChallenges:number;avgVerification:string;setView:(v:View)=>void}){
 return <div className="stack">
  <div className="stat-grid"><Stat label="Control readiness" value={`${readiness}%`} detail="Institutional controls passing"/><Stat label="Published artifacts" value={String(published)} detail="Registered evidence records"/><Stat label="Open challenges" value={String(openChallenges)} detail="Pending or under review"/><Stat label="Average verification" value={`L${avgVerification}`} detail="Across published artifacts"/></div>
  <div className="command-grid">
   <Card className="command-core"><div className="section-head"><div><span className="kicker">Operating posture</span><h2>Execution evidence command core</h2></div><Badge tone="allow">OPERATIONAL</Badge></div><div className="orbit"><div className="orbit-center"><strong>{readiness}%</strong><span>ready</span></div>{["Reality","Record","Continuity","Admissibility","Binding","Commit","Execution","Outcome"].map((x,i)=><div key={x} className={`orbit-node node-${i+1}`}><b>{String(i+1).padStart(2,"0")}</b><span>{x}</span></div>)}</div><div className="quick-actions"><button onClick={()=>setView("routes")}>Build a route</button><Link href="/artifacts/studio">Create artifact</Link><button onClick={()=>setView("verification")}>Verify package</button><button onClick={()=>setView("portfolio")}>Generate portfolio</button></div></Card>
   <Card><div className="section-head"><div><span className="kicker">Attention queue</span><h2>What needs action</h2></div></div><div className="attention-list">{[{n:"03",t:"Routes awaiting review",d:"Freeze route versions before additional execution."},{n:"02",t:"Challenges under review",d:"Preserve response and counter-evidence deadlines."},{n:"07",t:"Controls pending",d:"Complete publication and reviewer controls."},{n:"01",t:"Portfolio draft",d:"Board evidence portfolio requires signature."}].map(x=><button key={x.t}><span>{x.n}</span><div><strong>{x.t}</strong><p>{x.d}</p></div><b>→</b></button>)}</div></Card>
  </div>
  <div className="two-col"><Card><div className="section-head"><div><span className="kicker">Recent artifacts</span><h2>Evidence history</h2></div><button className="text-button" onClick={()=>setView("artifacts")}>View all →</button></div><div className="artifact-mini-list">{ARTIFACTS.slice(0,6).map(a=><Link key={a.id} href={`/artifacts/${a.id.toLowerCase()}`}><span style={{background:palette[a.determination]}}/><div><strong>{a.id}</strong><p>{a.title}</p></div><Badge tone={a.determination.toLowerCase()}>{a.determination}</Badge></Link>)}</div></Card><Card><div className="section-head"><div><span className="kicker">Architecture health</span><h2>Institutional readiness</h2></div></div><Meter value={readiness} label="Control coverage"/><Meter value={92} label="Route parity"/><Meter value={88} label="Artifact verification"/><Meter value={81} label="Independent review"/><div className="health-note"><strong>Registration remains active.</strong><p>Registration establishes attributable identity and scope. Every artifact must still earn its own verification and reliance level.</p></div></Card></div>
 </div>
}

function ProfileView({profile,setProfile}:{profile:any;setProfile:(p:any)=>void}){const field=(key:string,label:string,area=false)=><label><span>{label}</span>{area?<textarea value={profile[key]} onChange={e=>setProfile({...profile,[key]:e.target.value})}/>:<input value={profile[key]} onChange={e=>setProfile({...profile,[key]:e.target.value})}/>}</label>;return <div className="stack"><div className="two-col"><Card><div className="section-head"><div><span className="kicker">Registry identity</span><h2>Governance registration</h2></div><Badge tone="allow">ACTIVE</Badge></div><div className="form-grid">{field("organization","Organization")}{field("architecture","Architecture")}{field("version","Architecture version")}{field("registrationId","Registration ID")}{field("accountableOwner","Accountable owner")}{field("status","Registration status")}</div></Card><Card><span className="kicker">Claims boundary</span><h2>What registration means</h2><div className="principle-box"><strong>No registered governance. No registered artifact.</strong><p>Registration binds artifacts to an attributable governance identity, accountable owner, architecture version, declared scope, and evidence history.</p></div><div className="principle-box muted"><strong>Registration is not certification.</strong><p>Each route, execution, artifact, verification result, and portfolio claim must remain independently supported.</p></div></Card></div><Card><div className="section-head"><div><span className="kicker">Declared applicability</span><h2>Scope and institutional limits</h2></div></div><div className="form-grid wide">{field("sectors","Supported sectors",true)}{field("jurisdictions","Supported jurisdictions",true)}{field("declaredLimits","Declared limits",true)}</div></Card></div>}

function RoutesView(){return <div className="stack"><div className="toolbar"><div><span className="kicker">Governed route library</span><h2>Routes owned by this governance</h2></div><div><Link href="/workspace/artifacts/build" className="button">Route Builder</Link><Link href="/artifacts/studio" className="button primary">Launch Studio</Link></div></div><div className="route-grid">{ROUTES.map(r=><Card key={r.id} className="route-card"><div className="route-top"><Badge tone={r.status.toLowerCase()}>{r.status}</Badge><span>{r.version}</span></div><h3>{r.title}</h3><p>{r.sector}</p><div className="route-meta"><span><b>{r.runs}</b> preserved runs</span><span>{r.owner}</span><span>{r.updated}</span></div><div className="route-actions"><button>Inspect route</button><Link href="/artifacts/studio">Run in Studio →</Link></div></Card>)}</div></div>}

function ArtifactsView({query,setQuery,determination,setDetermination,artifacts}:{query:string;setQuery:(v:string)=>void;determination:"ALL"|Determination;setDetermination:(v:"ALL"|Determination)=>void;artifacts:ArtifactRecord[]}){return <div className="stack"><div className="toolbar"><div><span className="kicker">Registered evidence history</span><h2>Execution artifacts</h2></div><Link href="/artifacts/studio" className="button primary">Create artifact</Link></div><Card><div className="filter-row"><input placeholder="Search ID, title, route, or state" value={query} onChange={e=>setQuery(e.target.value)}/><div className="segmented">{(["ALL","ALLOW","HOLD","DENY","ESCALATE"] as const).map(d=><button key={d} className={determination===d?"active":""} onClick={()=>setDetermination(d)}>{d}</button>)}</div></div></Card><div className="artifact-table"><div className="table-head"><span>Artifact</span><span>Determination</span><span>Route</span><span>Verification</span><span>Status</span><span>Updated</span></div>{artifacts.map(a=><Link href={`/artifacts/${a.id.toLowerCase()}`} key={a.id} className="table-row"><div><strong>{a.id}</strong><small>{a.title}</small></div><Badge tone={a.determination.toLowerCase()}>{a.determination}</Badge><span>{a.route}</span><span>L{a.verification}</span><span>{a.status}{a.challenges?` · ${a.challenges} challenge`:""}</span><span>{a.updated}</span></Link>)}</div></div>}

function VerificationView(){return <div className="stack"><div className="toolbar"><div><span className="kicker">Bounded reliance</span><h2>Verification center</h2></div><Link href="/artifacts/verify" className="button primary">Open public verifier</Link></div><div className="verification-grid">{[0,1,2,3,4,5,6,7].map(level=><Card key={level} className="verification-card"><span className="level">L{level}</span><h3>{["Declared","Package integrity","Signature validity","Record parity","Replay consistency","Execution effect","Outcome closure","Independent review"][level]}</h3><p>{["Publisher asserts the record exists.","Published components match committed hashes.","Signature validates under the published policy.","PDF, JSON, manifest, route, and page resolve together.","Permitted replay reproduces the determination.","Receipt proves release, hold, block, or reroute.","Independent evidence supports the reported result.","Qualified external reviewer publishes a bounded opinion."][level]}</p><strong>{ARTIFACTS.filter(a=>a.verification>=level).length} artifacts</strong></Card>)}</div><Card><div className="section-head"><div><span className="kicker">Reliance rule</span><h2>Verification is not certification</h2></div></div><p className="large-copy">Verification records exactly what has been checked, what remains unverified, and what reliance is justified by available evidence. It never silently expands the artifact's claims boundary.</p></Card></div>}

function ChallengesView(){return <div className="stack"><div className="toolbar"><div><span className="kicker">Append-only dispute record</span><h2>Challenge and correction queue</h2></div><Link href="/artifacts/challenge" className="button primary">Open Challenge Center</Link></div><div className="challenge-list">{CHALLENGES.map(c=><Card key={c.id} className="challenge-card"><div><Badge tone={c.state.toLowerCase()}>{c.state}</Badge><strong>{c.id}</strong></div><h3>{c.issue}</h3><p>{c.artifact} · Opened {c.opened}</p><span>{c.owner}</span><button>Inspect challenge →</button></Card>)}</div></div>}

function PortfolioView(){return <div className="stack"><div className="toolbar"><div><span className="kicker">Institutional evidence packages</span><h2>Portfolio and comparative exports</h2></div><button className="button primary">Create export</button></div><div className="export-grid">{EXPORTS.map(e=><Card key={e.id}><div className="section-head"><Badge tone={e.state.toLowerCase()}>{e.state}</Badge><span>{e.format}</span></div><h3>{e.name}</h3><p>{e.artifacts} independently bounded artifacts</p><div className="route-meta"><span>{e.id}</span><span>{e.updated}</span></div><button className="wide-button">Open export workspace</button></Card>)}</div><Card><span className="kicker">Portfolio boundary</span><h2>A portfolio never replaces its artifacts</h2><p className="large-copy">Portfolio outputs organize independently verifiable records for procurement, regulation, audit, contracting, research, and executive review. They do not merge canonical records or imply broader claims than the included artifacts support.</p></Card></div>}

function MembersView(){return <div className="stack"><div className="toolbar"><div><span className="kicker">Identity and authority</span><h2>People, roles, and delegations</h2></div><button className="button primary">Invite collaborator</button></div><div className="member-grid">{MEMBERS.map(m=><Card key={m.id} className="member-card"><div className="avatar">{m.role.split(" ").map(x=>x[0]).join("").slice(0,2)}</div><div><Badge tone="allow">{m.status}</Badge><h3>{m.name}</h3><p>{m.role}</p><small>{m.permissions} bounded permissions · Active {m.lastActive}</small></div><button>Manage →</button></Card>)}</div></div>}

function ControlsView({readiness}:{readiness:number}){const [area,setArea]=useState("ALL");const areas=["ALL",...Array.from(new Set(CONTROLS.map(c=>c.area)))];const list=CONTROLS.filter(c=>area==="ALL"||c.area===area);return <div className="stack"><div className="toolbar"><div><span className="kicker">Institutional readiness</span><h2>Governance control center</h2></div><Badge tone={readiness>70?"allow":"hold"}>{readiness}% READY</Badge></div><Card><div className="filter-row"><div className="segmented wrap">{areas.map(a=><button key={a} className={area===a?"active":""} onClick={()=>setArea(a)}>{a}</button>)}</div></div></Card><div className="control-list">{list.map(c=><div key={c.id} className="control-row"><span>{c.id}</span><div><strong>{c.title}</strong><p>{c.requirement}</p></div><Badge tone={c.status.toLowerCase()}>{c.status}</Badge></div>)}</div></div>}

function SettingsView(){return <div className="stack"><div className="two-col"><Card><span className="kicker">Publication policy</span><h2>Default disclosure lane</h2><div className="setting-list">{["PUBLIC projection requires verification L3+","Restricted evidence remains hash-committed","Independent review required for high-consequence claims","Challenge links remain visible after correction","Withdrawn artifacts preserve the reason"].map((x,i)=><label key={x}><input type="checkbox" defaultChecked={i!==0}/><span>{x}</span></label>)}</div></Card><Card><span className="kicker">Workspace protection</span><h2>Operational safeguards</h2><div className="setting-list">{["Require dual approval for publication","Lock architecture version after artifact commit","Require reauthentication for signature operations","Fail closed on export parity errors","Preserve local draft recovery"].map(x=><label key={x}><input type="checkbox" defaultChecked/><span>{x}</span></label>)}</div></Card></div><Card><span className="kicker">Danger zone</span><h2>Registration state</h2><p className="large-copy">Suspending or withdrawing governance registration prevents new artifacts from entering the registry. Existing records remain preserved with attributable status history.</p><div className="danger-actions"><button>Suspend new submissions</button><button>Request registration withdrawal</button></div></Card></div>}

const STYLES=`
:root
{
  color-scheme:dark;
  --bg:#050914;
  --panel:rgba(12,20,38,.78);
  --panel2:rgba(16,27,49,.92);
  --line:rgba(142,176,255,.16);
  --text:#f5f7ff;
  --muted:#93a0bd;
  --gold:#f0c775;
  --cyan:#72d9ff;
  --allow:#36d399;
  --hold:#f6c85f;
  --deny:#ff6b7a;
  --escalate:#8ab4ff
}
*
{
  box-sizing:border-box
}
html
{
  background:var(--bg)
}
body
{
  margin:0;
  background:radial-gradient(circle at 80% 0%,#172448 0,transparent 36%),#050914;
  color:var(--text);
  font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif
}
button,input,textarea
{
  font:inherit
}
button,a
{
  -webkit-tap-highlight-color:transparent
}
a
{
  color:inherit;
  text-decoration:none
}
.workspace-shell
{
  min-height:100vh;
  position:relative;
  overflow:hidden;
  background:linear-gradient(180deg,rgba(5,9,20,.75),rgba(5,9,20,.98))
}
.ambient
{
  position:fixed;
  border-radius:50%;
  filter:blur(100px);
  opacity:.18;
  pointer-events:none
}
.ambient-a
{
  width:520px;
  height:520px;
  background:#145c9e;
  right:-160px;
  top:40px
}
.ambient-b
{
  width:420px;
  height:420px;
  background:#9e6c14;
  left:20%;
  bottom:-240px
}
.grid-floor
{
  position:fixed;
  inset:0;
  pointer-events:none;
  background-image:linear-gradient(rgba(102,153,255,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(102,153,255,.035) 1px,transparent 1px);
  background-size:48px 48px;
  mask-image:linear-gradient(to bottom,black,transparent 85%)
}
.topbar
{
  height:82px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  padding:0 28px;
  border-bottom:1px solid var(--line);
  background:rgba(4,8,18,.86);
  backdrop-filter:blur(22px);
  position:sticky;
  top:0;
  z-index:20
}
.brand
{
  display:flex;
  align-items:center;
  gap:12px
}
.brand-mark
{
  width:42px;
  height:42px;
  display:grid;
  place-items:center;
  border:1px solid rgba(240,199,117,.55);
  border-radius:12px;
  color:var(--gold);
  font-weight:900;
  letter-spacing:.05em;
  background:linear-gradient(145deg,rgba(240,199,117,.15),transparent)
}
.brand strong,.brand small
{
  display:block
}
.brand small
{
  color:var(--muted);
  margin-top:2px
}
.top-actions
{
  display:flex;
  align-items:center;
  gap:10px
}
.save-state
{
  color:var(--muted);
  font-size:12px;
  margin-right:8px
}
.button,.wide-button,.quick-actions button,.quick-actions a,.route-actions button,.route-actions a,.text-button,.danger-actions button
{
  border:1px solid var(--line);
  background:rgba(255,255,255,.045);
  color:var(--text);
  padding:11px 15px;
  border-radius:11px;
  cursor:pointer;
  transition:.2s ease
}
.button:hover,.wide-button:hover,.quick-actions button:hover,.quick-actions a:hover,.route-actions button:hover,.route-actions a:hover
{
  transform:translateY(-1px);
  border-color:rgba(114,217,255,.45);
  background:rgba(114,217,255,.09)
}
.button.primary
{
  background:linear-gradient(135deg,#1f6faa,#2d9bc1);
  border-color:rgba(114,217,255,.55);
  box-shadow:0 12px 30px rgba(31,111,170,.24)
}
.workspace-frame
{
  display:grid;
  grid-template-columns:290px minmax(0,1fr);
  max-width:1800px;
  margin:0 auto;
  min-height:calc(100vh - 82px)
}
.sidebar
{
  border-right:1px solid var(--line);
  padding:22px 16px;
  position:sticky;
  top:82px;
  height:calc(100vh - 82px);
  overflow:auto;
  background:rgba(5,10,21,.66);
  backdrop-filter:blur(18px)
}
.identity-card
{
  padding:18px;
  border:1px solid rgba(240,199,117,.24);
  border-radius:18px;
  background:linear-gradient(145deg,rgba(240,199,117,.09),rgba(255,255,255,.02));
  margin-bottom:18px
}
.identity-card h2
{
  font-size:16px;
  line-height:1.35;
  margin:9px 0
}
.identity-card p
{
  font-size:12px;
  color:var(--muted);
  word-break:break-word
}
.identity-status
{
  display:flex;
  align-items:center;
  gap:8px;
  color:var(--allow);
  font-size:12px;
  font-weight:800
}
.identity-status i
{
  width:8px;
  height:8px;
  border-radius:50%;
  background:var(--allow);
  box-shadow:0 0 16px var(--allow)
}
.kicker
{
  text-transform:uppercase;
  letter-spacing:.14em;
  color:var(--cyan);
  font-size:10px;
  font-weight:900
}
.sidebar nav
{
  display:grid;
  gap:5px
}
.sidebar nav button
{
  display:flex;
  align-items:center;
  gap:12px;
  width:100%;
  border:0;
  background:transparent;
  color:var(--muted);
  padding:11px;
  border-radius:12px;
  text-align:left;
  cursor:pointer
}
.sidebar nav button>span
{
  width:36px;
  height:36px;
  display:grid;
  place-items:center;
  border:1px solid var(--line);
  border-radius:10px;
  font-size:11px;
  font-weight:900
}
.sidebar nav button small,.sidebar nav button strong
{
  display:block
}
.sidebar nav button small
{
  font-size:9px;
  text-transform:uppercase;
  letter-spacing:.12em
}
.sidebar nav button strong
{
  font-size:13px;
  color:#dce5fa;
  margin-top:2px
}
.sidebar nav button.active
{
  background:linear-gradient(90deg,rgba(114,217,255,.12),rgba(114,217,255,.03));
  box-shadow:inset 3px 0 var(--cyan)
}
.sidebar nav button.active>span
{
  border-color:rgba(114,217,255,.5);
  color:var(--cyan)
}
.sidebar-footer
{
  margin-top:26px;
  padding:16px;
  border-top:1px solid var(--line);
  font-size:12px;
  color:var(--muted)
}
.sidebar-footer a
{
  color:var(--cyan);
  font-weight:700
}
.content
{
  padding:30px;
  min-width:0
}
.hero
{
  min-height:220px;
  border:1px solid var(--line);
  border-radius:24px;
  padding:34px;
  display:flex;
  justify-content:space-between;
  align-items:center;
  gap:30px;
  background:radial-gradient(circle at 80% 30%,rgba(114,217,255,.13),transparent 32%),linear-gradient(135deg,rgba(18,32,58,.95),rgba(8,14,28,.9));
  box-shadow:0 30px 80px rgba(0,0,0,.28),inset 0 1px rgba(255,255,255,.05);
  position:relative;
  overflow:hidden;
  margin-bottom:24px
}
.hero:after
{
  content:"";
  position:absolute;
  width:300px;
  height:300px;
  border:1px solid rgba(240,199,117,.16);
  border-radius:50%;
  right:5%;
  top:-40%;
  box-shadow:0 0 0 30px rgba(240,199,117,.025),0 0 0 70px rgba(114,217,255,.018)
}
.hero h1
{
  font-size:clamp(32px,4vw,58px);
  line-height:1;
  margin:10px 0 16px;
  max-width:900px
}
.hero p
{
  max-width:850px;
  color:#b8c3da;
  line-height:1.7;
  font-size:16px
}
.hero-seal
{
  width:170px;
  height:170px;
  border-radius:50%;
  display:grid;
  place-content:center;
  text-align:center;
  border:1px solid rgba(240,199,117,.52);
  background:radial-gradient(circle,rgba(240,199,117,.14),rgba(240,199,117,.02));
  box-shadow:0 0 50px rgba(240,199,117,.12);
  z-index:1;
  flex:none
}
.hero-seal span,.hero-seal small
{
  font-size:10px;
  letter-spacing:.16em;
  color:var(--gold)
}
.hero-seal strong
{
  font-size:46px;
  margin:4px 0
}
.stack
{
  display:grid;
  gap:22px
}
.card
{
  border:1px solid var(--line);
  background:linear-gradient(145deg,var(--panel2),var(--panel));
  border-radius:20px;
  padding:22px;
  box-shadow:0 20px 50px rgba(0,0,0,.22),inset 0 1px rgba(255,255,255,.035)
}
.card h2
{
  margin:6px 0 14px;
  font-size:22px
}
.card h3
{
  margin:14px 0 7px
}
.card p
{
  color:var(--muted);
  line-height:1.6
}
.section-head,.toolbar
{
  display:flex;
  justify-content:space-between;
  align-items:flex-start;
  gap:20px
}
.toolbar
{
  padding:8px 2px
}
.toolbar h2
{
  margin:7px 0 0;
  font-size:30px
}
.toolbar>div:last-child
{
  display:flex;
  gap:10px
}
.stat-grid
{
  display:grid;
  grid-template-columns:repeat(4,1fr);
  gap:14px
}
.stat
{
  padding:18px;
  border:1px solid var(--line);
  border-radius:16px;
  background:rgba(11,20,38,.76)
}
.stat span,.stat small,.stat strong
{
  display:block
}
.stat span
{
  text-transform:uppercase;
  letter-spacing:.12em;
  color:var(--muted);
  font-size:9px
}
.stat strong
{
  font-size:32px;
  margin:9px 0;
  color:#fff
}
.stat small
{
  color:#8fa0bf
}
.command-grid
{
  display:grid;
  grid-template-columns:1.5fr 1fr;
  gap:22px
}
.two-col
{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:22px
}
.command-core
{
  min-height:520px
}
.orbit
{
  width:410px;
  height:410px;
  margin:0 auto;
  position:relative;
  border:1px solid rgba(114,217,255,.22);
  border-radius:50%;
  box-shadow:inset 0 0 50px rgba(114,217,255,.06),0 0 50px rgba(0,0,0,.24)
}
.orbit:before,.orbit:after
{
  content:"";
  position:absolute;
  border-radius:50%;
  border:1px dashed rgba(240,199,117,.15);
  inset:52px
}
.orbit:after
{
  inset:112px;
  border-style:solid;
  border-color:rgba(114,217,255,.15)
}
.orbit-center
{
  position:absolute;
  inset:135px;
  border-radius:50%;
  display:grid;
  place-content:center;
  text-align:center;
  background:radial-gradient(circle,rgba(114,217,255,.22),rgba(8,18,34,.96));
  border:1px solid rgba(114,217,255,.5);
  z-index:2
}
.orbit-center strong
{
  font-size:45px
}
.orbit-center span
{
  color:var(--cyan);
  text-transform:uppercase;
  letter-spacing:.18em;
  font-size:10px
}
.orbit-node
{
  position:absolute;
  width:82px;
  height:54px;
  border:1px solid var(--line);
  border-radius:13px;
  background:#0c172b;
  display:grid;
  place-content:center;
  text-align:center;
  z-index:3
}
.orbit-node b
{
  color:var(--gold);
  font-size:10px
}
.orbit-node span
{
  font-size:11px
}
.node-1
{
  left:164px;
  top:-15px
}
.node-2
{
  right:1px;
  top:72px
}
.node-3
{
  right:-20px;
  top:190px
}
.node-4
{
  right:32px;
  bottom:30px
}
.node-5
{
  left:164px;
  bottom:-18px
}
.node-6
{
  left:20px;
  bottom:40px
}
.node-7
{
  left:-24px;
  top:190px
}
.node-8
{
  left:14px;
  top:66px
}
.quick-actions
{
  display:grid;
  grid-template-columns:repeat(4,1fr);
  gap:8px;
  margin-top:22px
}
.attention-list
{
  display:grid;
  gap:8px
}
.attention-list button
{
  display:grid;
  grid-template-columns:38px 1fr auto;
  gap:12px;
  align-items:center;
  border:1px solid transparent;
  background:rgba(255,255,255,.025);
  color:inherit;
  text-align:left;
  padding:13px;
  border-radius:12px;
  cursor:pointer
}
.attention-list button:hover
{
  border-color:var(--line);
  background:rgba(114,217,255,.06)
}
.attention-list button>span
{
  color:var(--gold);
  font-weight:900
}
.attention-list p
{
  margin:3px 0;
  font-size:12px
}
.artifact-mini-list
{
  display:grid
}
.artifact-mini-list a
{
  display:grid;
  grid-template-columns:5px 1fr auto;
  gap:12px;
  align-items:center;
  padding:13px 0;
  border-bottom:1px solid var(--line)
}
.artifact-mini-list a>span
{
  height:100%;
  border-radius:5px
}
.artifact-mini-list p
{
  margin:3px 0;
  font-size:12px
}
.badge
{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  border:1px solid var(--line);
  background:rgba(255,255,255,.04);
  border-radius:999px;
  padding:5px 9px;
  font-size:9px;
  font-weight:900;
  letter-spacing:.08em;
  white-space:nowrap
}
.badge.allow,.badge.pass,.badge.active,.badge.ready,.badge.published,.badge.upheld,.badge.closed
{
  color:var(--allow);
  border-color:rgba(54,211,153,.35);
  background:rgba(54,211,153,.08)
}
.badge.hold,.badge.pending,.badge.review,.badge.in_review,.badge.draft,.badge.generating
{
  color:var(--hold);
  border-color:rgba(246,200,95,.35);
  background:rgba(246,200,95,.08)
}
.badge.deny,.badge.fail,.badge.reversed,.badge.withdrawn,.badge.failed
{
  color:var(--deny);
  border-color:rgba(255,107,122,.35);
  background:rgba(255,107,122,.08)
}
.badge.escalate,.badge.under_review,.badge.modified,.badge.corrected,.badge.superseded
{
  color:var(--escalate);
  border-color:rgba(138,180,255,.35);
  background:rgba(138,180,255,.08)
}
.meter
{
  margin:18px 0
}
.meter-head
{
  display:flex;
  justify-content:space-between;
  font-size:12px;
  color:var(--muted)
}
.meter-track
{
  height:9px;
  background:rgba(255,255,255,.06);
  border-radius:999px;
  margin-top:8px;
  overflow:hidden
}
.meter-track span
{
  display:block;
  height:100%;
  border-radius:inherit;
  background:linear-gradient(90deg,#2c8ec4,#72d9ff)
}
.health-note,.principle-box
{
  padding:16px;
  border:1px solid rgba(114,217,255,.2);
  border-radius:14px;
  background:rgba(114,217,255,.05);
  margin-top:18px
}
.principle-box.muted
{
  border-color:var(--line);
  background:rgba(255,255,255,.025)
}
.form-grid
{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:14px
}
.form-grid.wide
{
  grid-template-columns:repeat(3,1fr)
}
label span
{
  display:block;
  color:var(--muted);
  font-size:11px;
  margin-bottom:7px
}
input,textarea
{
  width:100%;
  border:1px solid var(--line);
  background:#091225;
  color:var(--text);
  border-radius:10px;
  padding:12px;
  outline:none
}
input:focus,textarea:focus
{
  border-color:rgba(114,217,255,.5);
  box-shadow:0 0 0 3px rgba(114,217,255,.06)
}
textarea
{
  min-height:120px;
  resize:vertical
}
.route-grid,.challenge-list,.export-grid
{
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:16px
}
.route-card
{
  min-height:270px;
  display:flex;
  flex-direction:column
}
.route-top,.route-meta,.route-actions
{
  display:flex;
  justify-content:space-between;
  align-items:center;
  gap:8px
}
.route-meta
{
  margin-top:auto;
  padding-top:18px;
  color:var(--muted);
  font-size:11px;
  flex-wrap:wrap
}
.route-actions
{
  margin-top:16px
}
.route-actions button,.route-actions a
{
  flex:1;
  text-align:center;
  font-size:12px
}
.filter-row
{
  display:flex;
  gap:14px;
  align-items:center
}
.filter-row>input
{
  max-width:430px
}
.segmented
{
  display:flex;
  gap:5px;
  flex-wrap:wrap
}
.segmented button
{
  border:1px solid var(--line);
  background:transparent;
  color:var(--muted);
  padding:8px 11px;
  border-radius:9px;
  cursor:pointer;
  font-size:10px;
  font-weight:800
}
.segmented button.active
{
  color:var(--cyan);
  background:rgba(114,217,255,.08);
  border-color:rgba(114,217,255,.4)
}
.artifact-table
{
  border:1px solid var(--line);
  border-radius:18px;
  overflow:hidden
}
.table-head,.table-row
{
  display:grid;
  grid-template-columns:2fr 1fr 1fr .8fr 1.2fr .9fr;
  gap:15px;
  align-items:center;
  padding:15px 18px
}
.table-head
{
  background:#101c32;
  color:var(--muted);
  text-transform:uppercase;
  letter-spacing:.1em;
  font-size:9px
}
.table-row
{
  border-top:1px solid var(--line);
  background:rgba(10,18,34,.72);
  transition:.2s
}
.table-row:hover
{
  background:rgba(114,217,255,.055)
}
.table-row strong,.table-row small
{
  display:block
}
.table-row small
{
  color:var(--muted);
  margin-top:4px
}
.verification-grid
{
  display:grid;
  grid-template-columns:repeat(4,1fr);
  gap:14px
}
.verification-card
{
  min-height:210px
}
.verification-card .level
{
  width:46px;
  height:46px;
  border-radius:12px;
  display:grid;
  place-items:center;
  color:var(--cyan);
  border:1px solid rgba(114,217,255,.32);
  background:rgba(114,217,255,.07);
  font-weight:900
}
.verification-card>strong
{
  color:var(--gold)
}
.large-copy
{
  font-size:16px;
  max-width:1000px
}
.challenge-card
{
  position:relative
}
.challenge-card>div
{
  display:flex;
  justify-content:space-between;
  align-items:center
}
.challenge-card button,.member-card button
{
  border:0;
  background:transparent;
  color:var(--cyan);
  padding:12px 0;
  cursor:pointer
}
.wide-button
{
  width:100%;
  margin-top:18px
}
.member-grid
{
  display:grid;
  grid-template-columns:repeat(2,1fr);
  gap:16px
}
.member-card
{
  display:grid;
  grid-template-columns:60px 1fr auto;
  gap:15px;
  align-items:center
}
.avatar
{
  width:54px;
  height:54px;
  border-radius:16px;
  display:grid;
  place-items:center;
  background:linear-gradient(135deg,#1c5682,#173254);
  border:1px solid rgba(114,217,255,.25);
  color:var(--cyan);
  font-weight:900
}
.member-card h3,.member-card p
{
  margin:5px 0
}
.member-card small
{
  color:var(--muted)
}
.control-list
{
  border:1px solid var(--line);
  border-radius:18px;
  overflow:hidden
}
.control-row
{
  display:grid;
  grid-template-columns:80px 1fr auto;
  gap:15px;
  align-items:center;
  padding:14px 18px;
  border-bottom:1px solid var(--line);
  background:rgba(10,18,34,.7)
}
.control-row>span
{
  color:var(--gold);
  font-size:11px;
  font-weight:900
}
.control-row p
{
  margin:4px 0;
  font-size:12px
}
.setting-list
{
  display:grid;
  gap:9px;
  margin-top:18px
}
.setting-list label
{
  display:flex;
  gap:10px;
  align-items:center;
  padding:12px;
  border:1px solid var(--line);
  border-radius:11px;
  background:rgba(255,255,255,.02)
}
.setting-list input
{
  width:auto
}
.setting-list label span
{
  margin:0;
  color:#dbe5fa
}
.danger-actions
{
  display:flex;
  gap:10px
}
.danger-actions button
{
  border-color:rgba(255,107,122,.25);
  color:var(--deny)
}
@media(max-width:1250px)
{
  .workspace-frame
  {
    grid-template-columns:240px 1fr
  }
  .stat-grid
  {
    grid-template-columns:repeat(2,1fr)
  }
  .command-grid,.two-col
  {
    grid-template-columns:1fr
  }
  .route-grid,.challenge-list,.export-grid
  {
    grid-template-columns:repeat(2,1fr)
  }
  .verification-grid
  {
    grid-template-columns:repeat(2,1fr)
  }
  .form-grid.wide
  {
    grid-template-columns:1fr
  }
}
@media(max-width:850px)
{
  .topbar
  {
    height:auto;
    padding:14px;
    align-items:flex-start
  }
  .top-actions
  {
    flex-wrap:wrap;
    justify-content:flex-end
  }
  .save-state
  {
    display:none
  }
  .workspace-frame
  {
    display:block
  }
  .sidebar
  {
    position:relative;
    top:0;
    height:auto;
    border-right:0;
    border-bottom:1px solid var(--line)
  }
  .sidebar nav
  {
    display:flex;
    overflow:auto;
    padding-bottom:8px
  }
  .sidebar nav button
  {
    min-width:170px
  }
  .identity-card,.sidebar-footer
  {
    display:none
  }
  .content
  {
    padding:16px
  }
  .hero
  {
    padding:24px;
    min-height:auto
  }
  .hero-seal
  {
    display:none
  }
  .route-grid,.challenge-list,.export-grid,.member-grid
  {
    grid-template-columns:1fr
  }
  .table-head
  {
    display:none
  }
  .table-row
  {
    grid-template-columns:1fr 1fr
  }
  .orbit
  {
    transform:scale(.78);
    margin:-35px auto
  }
  .quick-actions
  {
    grid-template-columns:1fr 1fr
  }
}
@media(max-width:560px)
{
  .brand small
  {
    display:none
  }
  .top-actions .button:not(.primary)
  {
    display:none
  }
  .hero h1
  {
    font-size:34px
  }
  .stat-grid,.verification-grid
  {
    grid-template-columns:1fr
  }
  .form-grid
  {
    grid-template-columns:1fr
  }
  .filter-row
  {
    display:grid
  }
  .table-row
  {
    grid-template-columns:1fr
  }
  .orbit
  {
    transform:scale(.62);
    margin:-75px auto
  }
  .control-row
  {
    grid-template-columns:1fr
  }
}
`;
