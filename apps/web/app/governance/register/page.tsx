"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type ReactNode } from "react";

type StepId = "identity" | "architecture" | "scope" | "owners" | "claims" | "review" | "submitted";
type RegistrationState = "DRAFT" | "READY" | "SUBMITTED" | "UNDER_REVIEW" | "REGISTERED" | "RETURNED";
type Determination = "ALLOW" | "HOLD" | "DENY" | "ESCALATE";
type ControlState = "PASS" | "REVIEW" | "MISSING";

type Owner = { id: string; name: string; email: string; role: string; accountable: boolean };
type Claim = { id: string; title: string; statement: string; limit: string; selected: boolean };
type RegistrationDraft = {
  organizationName: string;
  legalName: string;
  website: string;
  country: string;
  registrationNumber: string;
  architectureName: string;
  architectureVersion: string;
  architectureSummary: string;
  architectureHash: string;
  sectors: string[];
  jurisdictions: string[];
  determinations: Determination[];
  owners: Owner[];
  claims: Claim[];
  declaredLimits: string;
  publicSummary: string;
  acceptsTerms: boolean;
  attestsAccuracy: boolean;
  attestsAuthority: boolean;
};

type Control = { id: string; area: string; title: string; requirement: string };

const STEPS: Array<{ id: StepId; number: string; title: string; description: string }> = [
  { id: "identity", number: "01", title: "Organization identity", description: "Establish the attributable legal and operating identity that will own the governance registration." },
  { id: "architecture", number: "02", title: "Governance architecture", description: "Describe and version the governance system that will produce governed routes and execution artifacts." },
  { id: "scope", number: "03", title: "Scope and determinations", description: "Declare where the governance applies, what it can decide, and where it does not apply." },
  { id: "owners", number: "04", title: "Accountable owners", description: "Name the people responsible for the registration, architecture, evidence, and publication decisions." },
  { id: "claims", number: "05", title: "Claims and limits", description: "Publish bounded capability claims together with explicit limitations and non-claims." },
  { id: "review", number: "06", title: "Institutional review", description: "Inspect completeness, resolve blocking conditions, accept terms, and freeze the submission package." },
  { id: "submitted", number: "07", title: "Submission receipt", description: "Preserve the candidate registration ID, package hash, next steps, and review status." },
];

const SECTORS = [
  "AI operations",
  "Financial services",
  "Healthcare",
  "Life sciences",
  "Cybersecurity",
  "Critical infrastructure",
  "Public sector",
  "Education",
  "Employment",
  "Insurance",
  "Legal operations",
  "Procurement",
  "Data governance",
  "Physical systems",
  "Environmental systems",
  "Mobility",
  "Digital platforms",
  "Research governance",
  "Enterprise operations",
  "Records governance",
] as const;

const JURISDICTIONS = [
  "United States",
  "European Union",
  "United Kingdom",
  "Canada",
  "Australia",
  "Singapore",
  "Japan",
  "Global / multi-jurisdiction",
  "Organization-specific private domain",
] as const;

const CLAIM_TEMPLATES: Claim[] = [
  {
    id: "claim-01",
    title: "Evidence governance",
    statement: "Preserves attributable evidence, provenance, custody, freshness, sufficiency, and conflicts.",
    limit: "Capability is limited to declared routes, sectors, jurisdictions, authority sources, technical adapters, and verified versions.",
    selected: false,
  },
  {
    id: "claim-02",
    title: "Authority governance",
    statement: "Resolves identity, role, delegation, scope, expiry, revocation, and concurrence before consequence.",
    limit: "Capability is limited to declared routes, sectors, jurisdictions, authority sources, technical adapters, and verified versions.",
    selected: false,
  },
  {
    id: "claim-03",
    title: "Execution boundaries",
    statement: "Defines permitted destination, privilege, amount, model, tool, time, and prohibited actions.",
    limit: "Capability is limited to declared routes, sectors, jurisdictions, authority sources, technical adapters, and verified versions.",
    selected: false,
  },
  {
    id: "claim-04",
    title: "Commit discipline",
    statement: "Freezes the governed route, determination, reasons, actor, and dependencies before execution.",
    limit: "Capability is limited to declared routes, sectors, jurisdictions, authority sources, technical adapters, and verified versions.",
    selected: false,
  },
  {
    id: "claim-05",
    title: "Runtime enforcement",
    statement: "Connects ALLOW, HOLD, DENY, and ESCALATE to technical effects that control what the system can do.",
    limit: "Capability is limited to declared routes, sectors, jurisdictions, authority sources, technical adapters, and verified versions.",
    selected: false,
  },
  {
    id: "claim-06",
    title: "Outcome closure",
    statement: "Preserves what actually bound to reality, residual conditions, verification, and follow-up obligations.",
    limit: "Capability is limited to declared routes, sectors, jurisdictions, authority sources, technical adapters, and verified versions.",
    selected: false,
  },
  {
    id: "claim-07",
    title: "Challenge and correction",
    statement: "Maintains append-only challenge, amendment, supersession, withdrawal, and prospective-reliance history.",
    limit: "Capability is limited to declared routes, sectors, jurisdictions, authority sources, technical adapters, and verified versions.",
    selected: false,
  },
  {
    id: "claim-08",
    title: "Privacy-preserving proof",
    statement: "Supports public proof while protecting confidential evidence, sensitive data, and proprietary implementation.",
    limit: "Capability is limited to declared routes, sectors, jurisdictions, authority sources, technical adapters, and verified versions.",
    selected: false,
  },
];

const CONTROLS: Control[] = [
  {
    id: "GR-001",
    area: "Identity",
    title: "Identity registration control 001",
    requirement: "Confirm that the submitted governance record preserves the required identity condition without overstating registration as certification.",
  },
  {
    id: "GR-002",
    area: "Ownership",
    title: "Ownership registration control 002",
    requirement: "Confirm that the submitted governance record preserves the required ownership condition without overstating registration as certification.",
  },
  {
    id: "GR-003",
    area: "Architecture",
    title: "Architecture registration control 003",
    requirement: "Confirm that the submitted governance record preserves the required architecture condition without overstating registration as certification.",
  },
  {
    id: "GR-004",
    area: "Scope",
    title: "Scope registration control 004",
    requirement: "Confirm that the submitted governance record preserves the required scope condition without overstating registration as certification.",
  },
  {
    id: "GR-005",
    area: "Authority",
    title: "Authority registration control 005",
    requirement: "Confirm that the submitted governance record preserves the required authority condition without overstating registration as certification.",
  },
  {
    id: "GR-006",
    area: "Evidence",
    title: "Evidence registration control 006",
    requirement: "Confirm that the submitted governance record preserves the required evidence condition without overstating registration as certification.",
  },
  {
    id: "GR-007",
    area: "Route",
    title: "Route registration control 007",
    requirement: "Confirm that the submitted governance record preserves the required route condition without overstating registration as certification.",
  },
  {
    id: "GR-008",
    area: "Runtime",
    title: "Runtime registration control 008",
    requirement: "Confirm that the submitted governance record preserves the required runtime condition without overstating registration as certification.",
  },
  {
    id: "GR-009",
    area: "Outcome",
    title: "Outcome registration control 009",
    requirement: "Confirm that the submitted governance record preserves the required outcome condition without overstating registration as certification.",
  },
  {
    id: "GR-010",
    area: "Integrity",
    title: "Integrity registration control 010",
    requirement: "Confirm that the submitted governance record preserves the required integrity condition without overstating registration as certification.",
  },
  {
    id: "GR-011",
    area: "Disclosure",
    title: "Disclosure registration control 011",
    requirement: "Confirm that the submitted governance record preserves the required disclosure condition without overstating registration as certification.",
  },
  {
    id: "GR-012",
    area: "Review",
    title: "Review registration control 012",
    requirement: "Confirm that the submitted governance record preserves the required review condition without overstating registration as certification.",
  },
  {
    id: "GR-013",
    area: "Identity",
    title: "Identity registration control 013",
    requirement: "Confirm that the submitted governance record preserves the required identity condition without overstating registration as certification.",
  },
  {
    id: "GR-014",
    area: "Ownership",
    title: "Ownership registration control 014",
    requirement: "Confirm that the submitted governance record preserves the required ownership condition without overstating registration as certification.",
  },
  {
    id: "GR-015",
    area: "Architecture",
    title: "Architecture registration control 015",
    requirement: "Confirm that the submitted governance record preserves the required architecture condition without overstating registration as certification.",
  },
  {
    id: "GR-016",
    area: "Scope",
    title: "Scope registration control 016",
    requirement: "Confirm that the submitted governance record preserves the required scope condition without overstating registration as certification.",
  },
  {
    id: "GR-017",
    area: "Authority",
    title: "Authority registration control 017",
    requirement: "Confirm that the submitted governance record preserves the required authority condition without overstating registration as certification.",
  },
  {
    id: "GR-018",
    area: "Evidence",
    title: "Evidence registration control 018",
    requirement: "Confirm that the submitted governance record preserves the required evidence condition without overstating registration as certification.",
  },
  {
    id: "GR-019",
    area: "Route",
    title: "Route registration control 019",
    requirement: "Confirm that the submitted governance record preserves the required route condition without overstating registration as certification.",
  },
  {
    id: "GR-020",
    area: "Runtime",
    title: "Runtime registration control 020",
    requirement: "Confirm that the submitted governance record preserves the required runtime condition without overstating registration as certification.",
  },
  {
    id: "GR-021",
    area: "Outcome",
    title: "Outcome registration control 021",
    requirement: "Confirm that the submitted governance record preserves the required outcome condition without overstating registration as certification.",
  },
  {
    id: "GR-022",
    area: "Integrity",
    title: "Integrity registration control 022",
    requirement: "Confirm that the submitted governance record preserves the required integrity condition without overstating registration as certification.",
  },
  {
    id: "GR-023",
    area: "Disclosure",
    title: "Disclosure registration control 023",
    requirement: "Confirm that the submitted governance record preserves the required disclosure condition without overstating registration as certification.",
  },
  {
    id: "GR-024",
    area: "Review",
    title: "Review registration control 024",
    requirement: "Confirm that the submitted governance record preserves the required review condition without overstating registration as certification.",
  },
  {
    id: "GR-025",
    area: "Identity",
    title: "Identity registration control 025",
    requirement: "Confirm that the submitted governance record preserves the required identity condition without overstating registration as certification.",
  },
  {
    id: "GR-026",
    area: "Ownership",
    title: "Ownership registration control 026",
    requirement: "Confirm that the submitted governance record preserves the required ownership condition without overstating registration as certification.",
  },
  {
    id: "GR-027",
    area: "Architecture",
    title: "Architecture registration control 027",
    requirement: "Confirm that the submitted governance record preserves the required architecture condition without overstating registration as certification.",
  },
  {
    id: "GR-028",
    area: "Scope",
    title: "Scope registration control 028",
    requirement: "Confirm that the submitted governance record preserves the required scope condition without overstating registration as certification.",
  },
  {
    id: "GR-029",
    area: "Authority",
    title: "Authority registration control 029",
    requirement: "Confirm that the submitted governance record preserves the required authority condition without overstating registration as certification.",
  },
  {
    id: "GR-030",
    area: "Evidence",
    title: "Evidence registration control 030",
    requirement: "Confirm that the submitted governance record preserves the required evidence condition without overstating registration as certification.",
  },
  {
    id: "GR-031",
    area: "Route",
    title: "Route registration control 031",
    requirement: "Confirm that the submitted governance record preserves the required route condition without overstating registration as certification.",
  },
  {
    id: "GR-032",
    area: "Runtime",
    title: "Runtime registration control 032",
    requirement: "Confirm that the submitted governance record preserves the required runtime condition without overstating registration as certification.",
  },
  {
    id: "GR-033",
    area: "Outcome",
    title: "Outcome registration control 033",
    requirement: "Confirm that the submitted governance record preserves the required outcome condition without overstating registration as certification.",
  },
  {
    id: "GR-034",
    area: "Integrity",
    title: "Integrity registration control 034",
    requirement: "Confirm that the submitted governance record preserves the required integrity condition without overstating registration as certification.",
  },
  {
    id: "GR-035",
    area: "Disclosure",
    title: "Disclosure registration control 035",
    requirement: "Confirm that the submitted governance record preserves the required disclosure condition without overstating registration as certification.",
  },
  {
    id: "GR-036",
    area: "Review",
    title: "Review registration control 036",
    requirement: "Confirm that the submitted governance record preserves the required review condition without overstating registration as certification.",
  },
  {
    id: "GR-037",
    area: "Identity",
    title: "Identity registration control 037",
    requirement: "Confirm that the submitted governance record preserves the required identity condition without overstating registration as certification.",
  },
  {
    id: "GR-038",
    area: "Ownership",
    title: "Ownership registration control 038",
    requirement: "Confirm that the submitted governance record preserves the required ownership condition without overstating registration as certification.",
  },
  {
    id: "GR-039",
    area: "Architecture",
    title: "Architecture registration control 039",
    requirement: "Confirm that the submitted governance record preserves the required architecture condition without overstating registration as certification.",
  },
  {
    id: "GR-040",
    area: "Scope",
    title: "Scope registration control 040",
    requirement: "Confirm that the submitted governance record preserves the required scope condition without overstating registration as certification.",
  },
  {
    id: "GR-041",
    area: "Authority",
    title: "Authority registration control 041",
    requirement: "Confirm that the submitted governance record preserves the required authority condition without overstating registration as certification.",
  },
  {
    id: "GR-042",
    area: "Evidence",
    title: "Evidence registration control 042",
    requirement: "Confirm that the submitted governance record preserves the required evidence condition without overstating registration as certification.",
  },
  {
    id: "GR-043",
    area: "Route",
    title: "Route registration control 043",
    requirement: "Confirm that the submitted governance record preserves the required route condition without overstating registration as certification.",
  },
  {
    id: "GR-044",
    area: "Runtime",
    title: "Runtime registration control 044",
    requirement: "Confirm that the submitted governance record preserves the required runtime condition without overstating registration as certification.",
  },
  {
    id: "GR-045",
    area: "Outcome",
    title: "Outcome registration control 045",
    requirement: "Confirm that the submitted governance record preserves the required outcome condition without overstating registration as certification.",
  },
  {
    id: "GR-046",
    area: "Integrity",
    title: "Integrity registration control 046",
    requirement: "Confirm that the submitted governance record preserves the required integrity condition without overstating registration as certification.",
  },
  {
    id: "GR-047",
    area: "Disclosure",
    title: "Disclosure registration control 047",
    requirement: "Confirm that the submitted governance record preserves the required disclosure condition without overstating registration as certification.",
  },
  {
    id: "GR-048",
    area: "Review",
    title: "Review registration control 048",
    requirement: "Confirm that the submitted governance record preserves the required review condition without overstating registration as certification.",
  },
  {
    id: "GR-049",
    area: "Identity",
    title: "Identity registration control 049",
    requirement: "Confirm that the submitted governance record preserves the required identity condition without overstating registration as certification.",
  },
  {
    id: "GR-050",
    area: "Ownership",
    title: "Ownership registration control 050",
    requirement: "Confirm that the submitted governance record preserves the required ownership condition without overstating registration as certification.",
  },
  {
    id: "GR-051",
    area: "Architecture",
    title: "Architecture registration control 051",
    requirement: "Confirm that the submitted governance record preserves the required architecture condition without overstating registration as certification.",
  },
  {
    id: "GR-052",
    area: "Scope",
    title: "Scope registration control 052",
    requirement: "Confirm that the submitted governance record preserves the required scope condition without overstating registration as certification.",
  },
  {
    id: "GR-053",
    area: "Authority",
    title: "Authority registration control 053",
    requirement: "Confirm that the submitted governance record preserves the required authority condition without overstating registration as certification.",
  },
  {
    id: "GR-054",
    area: "Evidence",
    title: "Evidence registration control 054",
    requirement: "Confirm that the submitted governance record preserves the required evidence condition without overstating registration as certification.",
  },
  {
    id: "GR-055",
    area: "Route",
    title: "Route registration control 055",
    requirement: "Confirm that the submitted governance record preserves the required route condition without overstating registration as certification.",
  },
  {
    id: "GR-056",
    area: "Runtime",
    title: "Runtime registration control 056",
    requirement: "Confirm that the submitted governance record preserves the required runtime condition without overstating registration as certification.",
  },
  {
    id: "GR-057",
    area: "Outcome",
    title: "Outcome registration control 057",
    requirement: "Confirm that the submitted governance record preserves the required outcome condition without overstating registration as certification.",
  },
  {
    id: "GR-058",
    area: "Integrity",
    title: "Integrity registration control 058",
    requirement: "Confirm that the submitted governance record preserves the required integrity condition without overstating registration as certification.",
  },
  {
    id: "GR-059",
    area: "Disclosure",
    title: "Disclosure registration control 059",
    requirement: "Confirm that the submitted governance record preserves the required disclosure condition without overstating registration as certification.",
  },
  {
    id: "GR-060",
    area: "Review",
    title: "Review registration control 060",
    requirement: "Confirm that the submitted governance record preserves the required review condition without overstating registration as certification.",
  },
  {
    id: "GR-061",
    area: "Identity",
    title: "Identity registration control 061",
    requirement: "Confirm that the submitted governance record preserves the required identity condition without overstating registration as certification.",
  },
  {
    id: "GR-062",
    area: "Ownership",
    title: "Ownership registration control 062",
    requirement: "Confirm that the submitted governance record preserves the required ownership condition without overstating registration as certification.",
  },
  {
    id: "GR-063",
    area: "Architecture",
    title: "Architecture registration control 063",
    requirement: "Confirm that the submitted governance record preserves the required architecture condition without overstating registration as certification.",
  },
  {
    id: "GR-064",
    area: "Scope",
    title: "Scope registration control 064",
    requirement: "Confirm that the submitted governance record preserves the required scope condition without overstating registration as certification.",
  },
  {
    id: "GR-065",
    area: "Authority",
    title: "Authority registration control 065",
    requirement: "Confirm that the submitted governance record preserves the required authority condition without overstating registration as certification.",
  },
  {
    id: "GR-066",
    area: "Evidence",
    title: "Evidence registration control 066",
    requirement: "Confirm that the submitted governance record preserves the required evidence condition without overstating registration as certification.",
  },
  {
    id: "GR-067",
    area: "Route",
    title: "Route registration control 067",
    requirement: "Confirm that the submitted governance record preserves the required route condition without overstating registration as certification.",
  },
  {
    id: "GR-068",
    area: "Runtime",
    title: "Runtime registration control 068",
    requirement: "Confirm that the submitted governance record preserves the required runtime condition without overstating registration as certification.",
  },
  {
    id: "GR-069",
    area: "Outcome",
    title: "Outcome registration control 069",
    requirement: "Confirm that the submitted governance record preserves the required outcome condition without overstating registration as certification.",
  },
  {
    id: "GR-070",
    area: "Integrity",
    title: "Integrity registration control 070",
    requirement: "Confirm that the submitted governance record preserves the required integrity condition without overstating registration as certification.",
  },
  {
    id: "GR-071",
    area: "Disclosure",
    title: "Disclosure registration control 071",
    requirement: "Confirm that the submitted governance record preserves the required disclosure condition without overstating registration as certification.",
  },
  {
    id: "GR-072",
    area: "Review",
    title: "Review registration control 072",
    requirement: "Confirm that the submitted governance record preserves the required review condition without overstating registration as certification.",
  },
  {
    id: "GR-073",
    area: "Identity",
    title: "Identity registration control 073",
    requirement: "Confirm that the submitted governance record preserves the required identity condition without overstating registration as certification.",
  },
  {
    id: "GR-074",
    area: "Ownership",
    title: "Ownership registration control 074",
    requirement: "Confirm that the submitted governance record preserves the required ownership condition without overstating registration as certification.",
  },
  {
    id: "GR-075",
    area: "Architecture",
    title: "Architecture registration control 075",
    requirement: "Confirm that the submitted governance record preserves the required architecture condition without overstating registration as certification.",
  },
  {
    id: "GR-076",
    area: "Scope",
    title: "Scope registration control 076",
    requirement: "Confirm that the submitted governance record preserves the required scope condition without overstating registration as certification.",
  },
  {
    id: "GR-077",
    area: "Authority",
    title: "Authority registration control 077",
    requirement: "Confirm that the submitted governance record preserves the required authority condition without overstating registration as certification.",
  },
  {
    id: "GR-078",
    area: "Evidence",
    title: "Evidence registration control 078",
    requirement: "Confirm that the submitted governance record preserves the required evidence condition without overstating registration as certification.",
  },
  {
    id: "GR-079",
    area: "Route",
    title: "Route registration control 079",
    requirement: "Confirm that the submitted governance record preserves the required route condition without overstating registration as certification.",
  },
  {
    id: "GR-080",
    area: "Runtime",
    title: "Runtime registration control 080",
    requirement: "Confirm that the submitted governance record preserves the required runtime condition without overstating registration as certification.",
  },
  {
    id: "GR-081",
    area: "Outcome",
    title: "Outcome registration control 081",
    requirement: "Confirm that the submitted governance record preserves the required outcome condition without overstating registration as certification.",
  },
  {
    id: "GR-082",
    area: "Integrity",
    title: "Integrity registration control 082",
    requirement: "Confirm that the submitted governance record preserves the required integrity condition without overstating registration as certification.",
  },
  {
    id: "GR-083",
    area: "Disclosure",
    title: "Disclosure registration control 083",
    requirement: "Confirm that the submitted governance record preserves the required disclosure condition without overstating registration as certification.",
  },
  {
    id: "GR-084",
    area: "Review",
    title: "Review registration control 084",
    requirement: "Confirm that the submitted governance record preserves the required review condition without overstating registration as certification.",
  },
  {
    id: "GR-085",
    area: "Identity",
    title: "Identity registration control 085",
    requirement: "Confirm that the submitted governance record preserves the required identity condition without overstating registration as certification.",
  },
  {
    id: "GR-086",
    area: "Ownership",
    title: "Ownership registration control 086",
    requirement: "Confirm that the submitted governance record preserves the required ownership condition without overstating registration as certification.",
  },
  {
    id: "GR-087",
    area: "Architecture",
    title: "Architecture registration control 087",
    requirement: "Confirm that the submitted governance record preserves the required architecture condition without overstating registration as certification.",
  },
  {
    id: "GR-088",
    area: "Scope",
    title: "Scope registration control 088",
    requirement: "Confirm that the submitted governance record preserves the required scope condition without overstating registration as certification.",
  },
  {
    id: "GR-089",
    area: "Authority",
    title: "Authority registration control 089",
    requirement: "Confirm that the submitted governance record preserves the required authority condition without overstating registration as certification.",
  },
  {
    id: "GR-090",
    area: "Evidence",
    title: "Evidence registration control 090",
    requirement: "Confirm that the submitted governance record preserves the required evidence condition without overstating registration as certification.",
  },
  {
    id: "GR-091",
    area: "Route",
    title: "Route registration control 091",
    requirement: "Confirm that the submitted governance record preserves the required route condition without overstating registration as certification.",
  },
  {
    id: "GR-092",
    area: "Runtime",
    title: "Runtime registration control 092",
    requirement: "Confirm that the submitted governance record preserves the required runtime condition without overstating registration as certification.",
  },
  {
    id: "GR-093",
    area: "Outcome",
    title: "Outcome registration control 093",
    requirement: "Confirm that the submitted governance record preserves the required outcome condition without overstating registration as certification.",
  },
  {
    id: "GR-094",
    area: "Integrity",
    title: "Integrity registration control 094",
    requirement: "Confirm that the submitted governance record preserves the required integrity condition without overstating registration as certification.",
  },
  {
    id: "GR-095",
    area: "Disclosure",
    title: "Disclosure registration control 095",
    requirement: "Confirm that the submitted governance record preserves the required disclosure condition without overstating registration as certification.",
  },
  {
    id: "GR-096",
    area: "Review",
    title: "Review registration control 096",
    requirement: "Confirm that the submitted governance record preserves the required review condition without overstating registration as certification.",
  },
  {
    id: "GR-097",
    area: "Identity",
    title: "Identity registration control 097",
    requirement: "Confirm that the submitted governance record preserves the required identity condition without overstating registration as certification.",
  },
  {
    id: "GR-098",
    area: "Ownership",
    title: "Ownership registration control 098",
    requirement: "Confirm that the submitted governance record preserves the required ownership condition without overstating registration as certification.",
  },
  {
    id: "GR-099",
    area: "Architecture",
    title: "Architecture registration control 099",
    requirement: "Confirm that the submitted governance record preserves the required architecture condition without overstating registration as certification.",
  },
  {
    id: "GR-100",
    area: "Scope",
    title: "Scope registration control 100",
    requirement: "Confirm that the submitted governance record preserves the required scope condition without overstating registration as certification.",
  },
  {
    id: "GR-101",
    area: "Authority",
    title: "Authority registration control 101",
    requirement: "Confirm that the submitted governance record preserves the required authority condition without overstating registration as certification.",
  },
  {
    id: "GR-102",
    area: "Evidence",
    title: "Evidence registration control 102",
    requirement: "Confirm that the submitted governance record preserves the required evidence condition without overstating registration as certification.",
  },
  {
    id: "GR-103",
    area: "Route",
    title: "Route registration control 103",
    requirement: "Confirm that the submitted governance record preserves the required route condition without overstating registration as certification.",
  },
  {
    id: "GR-104",
    area: "Runtime",
    title: "Runtime registration control 104",
    requirement: "Confirm that the submitted governance record preserves the required runtime condition without overstating registration as certification.",
  },
  {
    id: "GR-105",
    area: "Outcome",
    title: "Outcome registration control 105",
    requirement: "Confirm that the submitted governance record preserves the required outcome condition without overstating registration as certification.",
  },
  {
    id: "GR-106",
    area: "Integrity",
    title: "Integrity registration control 106",
    requirement: "Confirm that the submitted governance record preserves the required integrity condition without overstating registration as certification.",
  },
  {
    id: "GR-107",
    area: "Disclosure",
    title: "Disclosure registration control 107",
    requirement: "Confirm that the submitted governance record preserves the required disclosure condition without overstating registration as certification.",
  },
  {
    id: "GR-108",
    area: "Review",
    title: "Review registration control 108",
    requirement: "Confirm that the submitted governance record preserves the required review condition without overstating registration as certification.",
  },
];

type ReviewQuestion = { id: string; area: string; question: string; guidance: string };

const REVIEW_QUESTIONS: ReviewQuestion[] = [
  {
    id: "RQ-001",
    area: "Identity",
    question: "What preserved evidence demonstrates registration requirement 001 for the identity domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-002",
    area: "Architecture",
    question: "What preserved evidence demonstrates registration requirement 002 for the architecture domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-003",
    area: "Scope",
    question: "What preserved evidence demonstrates registration requirement 003 for the scope domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-004",
    area: "Ownership",
    question: "What preserved evidence demonstrates registration requirement 004 for the ownership domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-005",
    area: "Claims",
    question: "What preserved evidence demonstrates registration requirement 005 for the claims domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-006",
    area: "Limits",
    question: "What preserved evidence demonstrates registration requirement 006 for the limits domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-007",
    area: "Authority",
    question: "What preserved evidence demonstrates registration requirement 007 for the authority domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-008",
    area: "Evidence",
    question: "What preserved evidence demonstrates registration requirement 008 for the evidence domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-009",
    area: "Runtime",
    question: "What preserved evidence demonstrates registration requirement 009 for the runtime domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-010",
    area: "Integrity",
    question: "What preserved evidence demonstrates registration requirement 010 for the integrity domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-011",
    area: "Disclosure",
    question: "What preserved evidence demonstrates registration requirement 011 for the disclosure domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-012",
    area: "Review",
    question: "What preserved evidence demonstrates registration requirement 012 for the review domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-013",
    area: "Identity",
    question: "What preserved evidence demonstrates registration requirement 013 for the identity domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-014",
    area: "Architecture",
    question: "What preserved evidence demonstrates registration requirement 014 for the architecture domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-015",
    area: "Scope",
    question: "What preserved evidence demonstrates registration requirement 015 for the scope domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-016",
    area: "Ownership",
    question: "What preserved evidence demonstrates registration requirement 016 for the ownership domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-017",
    area: "Claims",
    question: "What preserved evidence demonstrates registration requirement 017 for the claims domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-018",
    area: "Limits",
    question: "What preserved evidence demonstrates registration requirement 018 for the limits domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-019",
    area: "Authority",
    question: "What preserved evidence demonstrates registration requirement 019 for the authority domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-020",
    area: "Evidence",
    question: "What preserved evidence demonstrates registration requirement 020 for the evidence domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-021",
    area: "Runtime",
    question: "What preserved evidence demonstrates registration requirement 021 for the runtime domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-022",
    area: "Integrity",
    question: "What preserved evidence demonstrates registration requirement 022 for the integrity domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-023",
    area: "Disclosure",
    question: "What preserved evidence demonstrates registration requirement 023 for the disclosure domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-024",
    area: "Review",
    question: "What preserved evidence demonstrates registration requirement 024 for the review domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-025",
    area: "Identity",
    question: "What preserved evidence demonstrates registration requirement 025 for the identity domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-026",
    area: "Architecture",
    question: "What preserved evidence demonstrates registration requirement 026 for the architecture domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-027",
    area: "Scope",
    question: "What preserved evidence demonstrates registration requirement 027 for the scope domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-028",
    area: "Ownership",
    question: "What preserved evidence demonstrates registration requirement 028 for the ownership domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-029",
    area: "Claims",
    question: "What preserved evidence demonstrates registration requirement 029 for the claims domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-030",
    area: "Limits",
    question: "What preserved evidence demonstrates registration requirement 030 for the limits domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-031",
    area: "Authority",
    question: "What preserved evidence demonstrates registration requirement 031 for the authority domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-032",
    area: "Evidence",
    question: "What preserved evidence demonstrates registration requirement 032 for the evidence domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-033",
    area: "Runtime",
    question: "What preserved evidence demonstrates registration requirement 033 for the runtime domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-034",
    area: "Integrity",
    question: "What preserved evidence demonstrates registration requirement 034 for the integrity domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-035",
    area: "Disclosure",
    question: "What preserved evidence demonstrates registration requirement 035 for the disclosure domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-036",
    area: "Review",
    question: "What preserved evidence demonstrates registration requirement 036 for the review domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-037",
    area: "Identity",
    question: "What preserved evidence demonstrates registration requirement 037 for the identity domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-038",
    area: "Architecture",
    question: "What preserved evidence demonstrates registration requirement 038 for the architecture domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-039",
    area: "Scope",
    question: "What preserved evidence demonstrates registration requirement 039 for the scope domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-040",
    area: "Ownership",
    question: "What preserved evidence demonstrates registration requirement 040 for the ownership domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-041",
    area: "Claims",
    question: "What preserved evidence demonstrates registration requirement 041 for the claims domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-042",
    area: "Limits",
    question: "What preserved evidence demonstrates registration requirement 042 for the limits domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-043",
    area: "Authority",
    question: "What preserved evidence demonstrates registration requirement 043 for the authority domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-044",
    area: "Evidence",
    question: "What preserved evidence demonstrates registration requirement 044 for the evidence domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-045",
    area: "Runtime",
    question: "What preserved evidence demonstrates registration requirement 045 for the runtime domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-046",
    area: "Integrity",
    question: "What preserved evidence demonstrates registration requirement 046 for the integrity domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-047",
    area: "Disclosure",
    question: "What preserved evidence demonstrates registration requirement 047 for the disclosure domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-048",
    area: "Review",
    question: "What preserved evidence demonstrates registration requirement 048 for the review domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-049",
    area: "Identity",
    question: "What preserved evidence demonstrates registration requirement 049 for the identity domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-050",
    area: "Architecture",
    question: "What preserved evidence demonstrates registration requirement 050 for the architecture domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-051",
    area: "Scope",
    question: "What preserved evidence demonstrates registration requirement 051 for the scope domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-052",
    area: "Ownership",
    question: "What preserved evidence demonstrates registration requirement 052 for the ownership domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-053",
    area: "Claims",
    question: "What preserved evidence demonstrates registration requirement 053 for the claims domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-054",
    area: "Limits",
    question: "What preserved evidence demonstrates registration requirement 054 for the limits domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-055",
    area: "Authority",
    question: "What preserved evidence demonstrates registration requirement 055 for the authority domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-056",
    area: "Evidence",
    question: "What preserved evidence demonstrates registration requirement 056 for the evidence domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-057",
    area: "Runtime",
    question: "What preserved evidence demonstrates registration requirement 057 for the runtime domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-058",
    area: "Integrity",
    question: "What preserved evidence demonstrates registration requirement 058 for the integrity domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-059",
    area: "Disclosure",
    question: "What preserved evidence demonstrates registration requirement 059 for the disclosure domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-060",
    area: "Review",
    question: "What preserved evidence demonstrates registration requirement 060 for the review domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-061",
    area: "Identity",
    question: "What preserved evidence demonstrates registration requirement 061 for the identity domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-062",
    area: "Architecture",
    question: "What preserved evidence demonstrates registration requirement 062 for the architecture domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-063",
    area: "Scope",
    question: "What preserved evidence demonstrates registration requirement 063 for the scope domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-064",
    area: "Ownership",
    question: "What preserved evidence demonstrates registration requirement 064 for the ownership domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-065",
    area: "Claims",
    question: "What preserved evidence demonstrates registration requirement 065 for the claims domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-066",
    area: "Limits",
    question: "What preserved evidence demonstrates registration requirement 066 for the limits domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-067",
    area: "Authority",
    question: "What preserved evidence demonstrates registration requirement 067 for the authority domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-068",
    area: "Evidence",
    question: "What preserved evidence demonstrates registration requirement 068 for the evidence domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-069",
    area: "Runtime",
    question: "What preserved evidence demonstrates registration requirement 069 for the runtime domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-070",
    area: "Integrity",
    question: "What preserved evidence demonstrates registration requirement 070 for the integrity domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-071",
    area: "Disclosure",
    question: "What preserved evidence demonstrates registration requirement 071 for the disclosure domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-072",
    area: "Review",
    question: "What preserved evidence demonstrates registration requirement 072 for the review domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-073",
    area: "Identity",
    question: "What preserved evidence demonstrates registration requirement 073 for the identity domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-074",
    area: "Architecture",
    question: "What preserved evidence demonstrates registration requirement 074 for the architecture domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-075",
    area: "Scope",
    question: "What preserved evidence demonstrates registration requirement 075 for the scope domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-076",
    area: "Ownership",
    question: "What preserved evidence demonstrates registration requirement 076 for the ownership domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-077",
    area: "Claims",
    question: "What preserved evidence demonstrates registration requirement 077 for the claims domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-078",
    area: "Limits",
    question: "What preserved evidence demonstrates registration requirement 078 for the limits domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-079",
    area: "Authority",
    question: "What preserved evidence demonstrates registration requirement 079 for the authority domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-080",
    area: "Evidence",
    question: "What preserved evidence demonstrates registration requirement 080 for the evidence domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-081",
    area: "Runtime",
    question: "What preserved evidence demonstrates registration requirement 081 for the runtime domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-082",
    area: "Integrity",
    question: "What preserved evidence demonstrates registration requirement 082 for the integrity domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-083",
    area: "Disclosure",
    question: "What preserved evidence demonstrates registration requirement 083 for the disclosure domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-084",
    area: "Review",
    question: "What preserved evidence demonstrates registration requirement 084 for the review domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-085",
    area: "Identity",
    question: "What preserved evidence demonstrates registration requirement 085 for the identity domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-086",
    area: "Architecture",
    question: "What preserved evidence demonstrates registration requirement 086 for the architecture domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-087",
    area: "Scope",
    question: "What preserved evidence demonstrates registration requirement 087 for the scope domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-088",
    area: "Ownership",
    question: "What preserved evidence demonstrates registration requirement 088 for the ownership domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-089",
    area: "Claims",
    question: "What preserved evidence demonstrates registration requirement 089 for the claims domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-090",
    area: "Limits",
    question: "What preserved evidence demonstrates registration requirement 090 for the limits domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-091",
    area: "Authority",
    question: "What preserved evidence demonstrates registration requirement 091 for the authority domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-092",
    area: "Evidence",
    question: "What preserved evidence demonstrates registration requirement 092 for the evidence domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-093",
    area: "Runtime",
    question: "What preserved evidence demonstrates registration requirement 093 for the runtime domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-094",
    area: "Integrity",
    question: "What preserved evidence demonstrates registration requirement 094 for the integrity domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-095",
    area: "Disclosure",
    question: "What preserved evidence demonstrates registration requirement 095 for the disclosure domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-096",
    area: "Review",
    question: "What preserved evidence demonstrates registration requirement 096 for the review domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-097",
    area: "Identity",
    question: "What preserved evidence demonstrates registration requirement 097 for the identity domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-098",
    area: "Architecture",
    question: "What preserved evidence demonstrates registration requirement 098 for the architecture domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-099",
    area: "Scope",
    question: "What preserved evidence demonstrates registration requirement 099 for the scope domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-100",
    area: "Ownership",
    question: "What preserved evidence demonstrates registration requirement 100 for the ownership domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-101",
    area: "Claims",
    question: "What preserved evidence demonstrates registration requirement 101 for the claims domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-102",
    area: "Limits",
    question: "What preserved evidence demonstrates registration requirement 102 for the limits domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-103",
    area: "Authority",
    question: "What preserved evidence demonstrates registration requirement 103 for the authority domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-104",
    area: "Evidence",
    question: "What preserved evidence demonstrates registration requirement 104 for the evidence domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-105",
    area: "Runtime",
    question: "What preserved evidence demonstrates registration requirement 105 for the runtime domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-106",
    area: "Integrity",
    question: "What preserved evidence demonstrates registration requirement 106 for the integrity domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-107",
    area: "Disclosure",
    question: "What preserved evidence demonstrates registration requirement 107 for the disclosure domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-108",
    area: "Review",
    question: "What preserved evidence demonstrates registration requirement 108 for the review domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-109",
    area: "Identity",
    question: "What preserved evidence demonstrates registration requirement 109 for the identity domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-110",
    area: "Architecture",
    question: "What preserved evidence demonstrates registration requirement 110 for the architecture domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-111",
    area: "Scope",
    question: "What preserved evidence demonstrates registration requirement 111 for the scope domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-112",
    area: "Ownership",
    question: "What preserved evidence demonstrates registration requirement 112 for the ownership domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-113",
    area: "Claims",
    question: "What preserved evidence demonstrates registration requirement 113 for the claims domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-114",
    area: "Limits",
    question: "What preserved evidence demonstrates registration requirement 114 for the limits domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-115",
    area: "Authority",
    question: "What preserved evidence demonstrates registration requirement 115 for the authority domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-116",
    area: "Evidence",
    question: "What preserved evidence demonstrates registration requirement 116 for the evidence domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-117",
    area: "Runtime",
    question: "What preserved evidence demonstrates registration requirement 117 for the runtime domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-118",
    area: "Integrity",
    question: "What preserved evidence demonstrates registration requirement 118 for the integrity domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-119",
    area: "Disclosure",
    question: "What preserved evidence demonstrates registration requirement 119 for the disclosure domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
  {
    id: "RQ-120",
    area: "Review",
    question: "What preserved evidence demonstrates registration requirement 120 for the review domain?",
    guidance: "Answer with attributable records, declared limits, accountable ownership, and a versioned source. A narrative assertion alone is insufficient.",
  },
];

type GlossaryTerm = { id: string; term: string; definition: string };

const REGISTRATION_GLOSSARY: GlossaryTerm[] = [
  {
    id: "TERM-001",
    term: "Accountable owner",
    definition: "TA-14 registration meaning for accountable owner: a bounded institutional concept that must be attributable, versioned, and interpreted within the declared governance scope.",
  },
  {
    id: "TERM-002",
    term: "Architecture version",
    definition: "TA-14 registration meaning for architecture version: a bounded institutional concept that must be attributable, versioned, and interpreted within the declared governance scope.",
  },
  {
    id: "TERM-003",
    term: "Artifact eligibility",
    definition: "TA-14 registration meaning for artifact eligibility: a bounded institutional concept that must be attributable, versioned, and interpreted within the declared governance scope.",
  },
  {
    id: "TERM-004",
    term: "Authority source",
    definition: "TA-14 registration meaning for authority source: a bounded institutional concept that must be attributable, versioned, and interpreted within the declared governance scope.",
  },
  {
    id: "TERM-005",
    term: "Bounded claim",
    definition: "TA-14 registration meaning for bounded claim: a bounded institutional concept that must be attributable, versioned, and interpreted within the declared governance scope.",
  },
  {
    id: "TERM-006",
    term: "Canonical record",
    definition: "TA-14 registration meaning for canonical record: a bounded institutional concept that must be attributable, versioned, and interpreted within the declared governance scope.",
  },
  {
    id: "TERM-007",
    term: "Challenge history",
    definition: "TA-14 registration meaning for challenge history: a bounded institutional concept that must be attributable, versioned, and interpreted within the declared governance scope.",
  },
  {
    id: "TERM-008",
    term: "Correction chain",
    definition: "TA-14 registration meaning for correction chain: a bounded institutional concept that must be attributable, versioned, and interpreted within the declared governance scope.",
  },
  {
    id: "TERM-009",
    term: "Declared limit",
    definition: "TA-14 registration meaning for declared limit: a bounded institutional concept that must be attributable, versioned, and interpreted within the declared governance scope.",
  },
  {
    id: "TERM-010",
    term: "Determination",
    definition: "TA-14 registration meaning for determination: a bounded institutional concept that must be attributable, versioned, and interpreted within the declared governance scope.",
  },
  {
    id: "TERM-011",
    term: "Disclosure level",
    definition: "TA-14 registration meaning for disclosure level: a bounded institutional concept that must be attributable, versioned, and interpreted within the declared governance scope.",
  },
  {
    id: "TERM-012",
    term: "Evidence custody",
    definition: "TA-14 registration meaning for evidence custody: a bounded institutional concept that must be attributable, versioned, and interpreted within the declared governance scope.",
  },
  {
    id: "TERM-013",
    term: "Evidence freshness",
    definition: "TA-14 registration meaning for evidence freshness: a bounded institutional concept that must be attributable, versioned, and interpreted within the declared governance scope.",
  },
  {
    id: "TERM-014",
    term: "Governance registration",
    definition: "TA-14 registration meaning for governance registration: a bounded institutional concept that must be attributable, versioned, and interpreted within the declared governance scope.",
  },
  {
    id: "TERM-015",
    term: "Institutional review",
    definition: "TA-14 registration meaning for institutional review: a bounded institutional concept that must be attributable, versioned, and interpreted within the declared governance scope.",
  },
  {
    id: "TERM-016",
    term: "Jurisdiction scope",
    definition: "TA-14 registration meaning for jurisdiction scope: a bounded institutional concept that must be attributable, versioned, and interpreted within the declared governance scope.",
  },
  {
    id: "TERM-017",
    term: "Legal entity",
    definition: "TA-14 registration meaning for legal entity: a bounded institutional concept that must be attributable, versioned, and interpreted within the declared governance scope.",
  },
  {
    id: "TERM-018",
    term: "Non-claim",
    definition: "TA-14 registration meaning for non-claim: a bounded institutional concept that must be attributable, versioned, and interpreted within the declared governance scope.",
  },
  {
    id: "TERM-019",
    term: "Organization identity",
    definition: "TA-14 registration meaning for organization identity: a bounded institutional concept that must be attributable, versioned, and interpreted within the declared governance scope.",
  },
  {
    id: "TERM-020",
    term: "Portfolio history",
    definition: "TA-14 registration meaning for portfolio history: a bounded institutional concept that must be attributable, versioned, and interpreted within the declared governance scope.",
  },
  {
    id: "TERM-021",
    term: "Prospective reliance",
    definition: "TA-14 registration meaning for prospective reliance: a bounded institutional concept that must be attributable, versioned, and interpreted within the declared governance scope.",
  },
  {
    id: "TERM-022",
    term: "Public summary",
    definition: "TA-14 registration meaning for public summary: a bounded institutional concept that must be attributable, versioned, and interpreted within the declared governance scope.",
  },
  {
    id: "TERM-023",
    term: "Registered governance",
    definition: "TA-14 registration meaning for registered governance: a bounded institutional concept that must be attributable, versioned, and interpreted within the declared governance scope.",
  },
  {
    id: "TERM-024",
    term: "Registration candidate",
    definition: "TA-14 registration meaning for registration candidate: a bounded institutional concept that must be attributable, versioned, and interpreted within the declared governance scope.",
  },
  {
    id: "TERM-025",
    term: "Registration ID",
    definition: "TA-14 registration meaning for registration id: a bounded institutional concept that must be attributable, versioned, and interpreted within the declared governance scope.",
  },
  {
    id: "TERM-026",
    term: "Registration state",
    definition: "TA-14 registration meaning for registration state: a bounded institutional concept that must be attributable, versioned, and interpreted within the declared governance scope.",
  },
  {
    id: "TERM-027",
    term: "Responsible steward",
    definition: "TA-14 registration meaning for responsible steward: a bounded institutional concept that must be attributable, versioned, and interpreted within the declared governance scope.",
  },
  {
    id: "TERM-028",
    term: "Route ownership",
    definition: "TA-14 registration meaning for route ownership: a bounded institutional concept that must be attributable, versioned, and interpreted within the declared governance scope.",
  },
  {
    id: "TERM-029",
    term: "Sector scope",
    definition: "TA-14 registration meaning for sector scope: a bounded institutional concept that must be attributable, versioned, and interpreted within the declared governance scope.",
  },
  {
    id: "TERM-030",
    term: "Submission package",
    definition: "TA-14 registration meaning for submission package: a bounded institutional concept that must be attributable, versioned, and interpreted within the declared governance scope.",
  },
  {
    id: "TERM-031",
    term: "Supported determination",
    definition: "TA-14 registration meaning for supported determination: a bounded institutional concept that must be attributable, versioned, and interpreted within the declared governance scope.",
  },
  {
    id: "TERM-032",
    term: "Verification level",
    definition: "TA-14 registration meaning for verification level: a bounded institutional concept that must be attributable, versioned, and interpreted within the declared governance scope.",
  },
  {
    id: "TERM-033",
    term: "Withdrawal state",
    definition: "TA-14 registration meaning for withdrawal state: a bounded institutional concept that must be attributable, versioned, and interpreted within the declared governance scope.",
  },
  {
    id: "TERM-034",
    term: "Architecture hash",
    definition: "TA-14 registration meaning for architecture hash: a bounded institutional concept that must be attributable, versioned, and interpreted within the declared governance scope.",
  },
  {
    id: "TERM-035",
    term: "Artifact registry",
    definition: "TA-14 registration meaning for artifact registry: a bounded institutional concept that must be attributable, versioned, and interpreted within the declared governance scope.",
  },
  {
    id: "TERM-036",
    term: "Attestation",
    definition: "TA-14 registration meaning for attestation: a bounded institutional concept that must be attributable, versioned, and interpreted within the declared governance scope.",
  },
  {
    id: "TERM-037",
    term: "Boundary",
    definition: "TA-14 registration meaning for boundary: a bounded institutional concept that must be attributable, versioned, and interpreted within the declared governance scope.",
  },
  {
    id: "TERM-038",
    term: "Commit",
    definition: "TA-14 registration meaning for commit: a bounded institutional concept that must be attributable, versioned, and interpreted within the declared governance scope.",
  },
  {
    id: "TERM-039",
    term: "Continuity",
    definition: "TA-14 registration meaning for continuity: a bounded institutional concept that must be attributable, versioned, and interpreted within the declared governance scope.",
  },
  {
    id: "TERM-040",
    term: "Evidence provenance",
    definition: "TA-14 registration meaning for evidence provenance: a bounded institutional concept that must be attributable, versioned, and interpreted within the declared governance scope.",
  },
  {
    id: "TERM-041",
    term: "Execution effect",
    definition: "TA-14 registration meaning for execution effect: a bounded institutional concept that must be attributable, versioned, and interpreted within the declared governance scope.",
  },
  {
    id: "TERM-042",
    term: "Integrity commitment",
    definition: "TA-14 registration meaning for integrity commitment: a bounded institutional concept that must be attributable, versioned, and interpreted within the declared governance scope.",
  },
  {
    id: "TERM-043",
    term: "Outcome closure",
    definition: "TA-14 registration meaning for outcome closure: a bounded institutional concept that must be attributable, versioned, and interpreted within the declared governance scope.",
  },
  {
    id: "TERM-044",
    term: "Publication state",
    definition: "TA-14 registration meaning for publication state: a bounded institutional concept that must be attributable, versioned, and interpreted within the declared governance scope.",
  },
  {
    id: "TERM-045",
    term: "Revalidation trigger",
    definition: "TA-14 registration meaning for revalidation trigger: a bounded institutional concept that must be attributable, versioned, and interpreted within the declared governance scope.",
  },
  {
    id: "TERM-046",
    term: "Route version",
    definition: "TA-14 registration meaning for route version: a bounded institutional concept that must be attributable, versioned, and interpreted within the declared governance scope.",
  },
  {
    id: "TERM-047",
    term: "Scope parity",
    definition: "TA-14 registration meaning for scope parity: a bounded institutional concept that must be attributable, versioned, and interpreted within the declared governance scope.",
  },
  {
    id: "TERM-048",
    term: "Supersession",
    definition: "TA-14 registration meaning for supersession: a bounded institutional concept that must be attributable, versioned, and interpreted within the declared governance scope.",
  },
  {
    id: "TERM-049",
    term: "Technical receipt",
    definition: "TA-14 registration meaning for technical receipt: a bounded institutional concept that must be attributable, versioned, and interpreted within the declared governance scope.",
  },
  {
    id: "TERM-050",
    term: "Verification manifest",
    definition: "TA-14 registration meaning for verification manifest: a bounded institutional concept that must be attributable, versioned, and interpreted within the declared governance scope.",
  },
  {
    id: "TERM-051",
    term: "ALLOW",
    definition: "TA-14 registration meaning for allow: a bounded institutional concept that must be attributable, versioned, and interpreted within the declared governance scope.",
  },
  {
    id: "TERM-052",
    term: "HOLD",
    definition: "TA-14 registration meaning for hold: a bounded institutional concept that must be attributable, versioned, and interpreted within the declared governance scope.",
  },
  {
    id: "TERM-053",
    term: "DENY",
    definition: "TA-14 registration meaning for deny: a bounded institutional concept that must be attributable, versioned, and interpreted within the declared governance scope.",
  },
  {
    id: "TERM-054",
    term: "ESCALATE",
    definition: "TA-14 registration meaning for escalate: a bounded institutional concept that must be attributable, versioned, and interpreted within the declared governance scope.",
  },
  {
    id: "TERM-055",
    term: "Public profile",
    definition: "TA-14 registration meaning for public profile: a bounded institutional concept that must be attributable, versioned, and interpreted within the declared governance scope.",
  },
  {
    id: "TERM-056",
    term: "Private implementation",
    definition: "TA-14 registration meaning for private implementation: a bounded institutional concept that must be attributable, versioned, and interpreted within the declared governance scope.",
  },
  {
    id: "TERM-057",
    term: "Registry admission",
    definition: "TA-14 registration meaning for registry admission: a bounded institutional concept that must be attributable, versioned, and interpreted within the declared governance scope.",
  },
  {
    id: "TERM-058",
    term: "Review officer",
    definition: "TA-14 registration meaning for review officer: a bounded institutional concept that must be attributable, versioned, and interpreted within the declared governance scope.",
  },
  {
    id: "TERM-059",
    term: "Governance claim",
    definition: "TA-14 registration meaning for governance claim: a bounded institutional concept that must be attributable, versioned, and interpreted within the declared governance scope.",
  },
  {
    id: "TERM-060",
    term: "Eligibility gate",
    definition: "TA-14 registration meaning for eligibility gate: a bounded institutional concept that must be attributable, versioned, and interpreted within the declared governance scope.",
  },
  {
    id: "TERM-061",
    term: "Append-only history",
    definition: "TA-14 registration meaning for append-only history: a bounded institutional concept that must be attributable, versioned, and interpreted within the declared governance scope.",
  },
  {
    id: "TERM-062",
    term: "Material change",
    definition: "TA-14 registration meaning for material change: a bounded institutional concept that must be attributable, versioned, and interpreted within the declared governance scope.",
  },
  {
    id: "TERM-063",
    term: "Independent review",
    definition: "TA-14 registration meaning for independent review: a bounded institutional concept that must be attributable, versioned, and interpreted within the declared governance scope.",
  },
  {
    id: "TERM-064",
    term: "Legal authority",
    definition: "TA-14 registration meaning for legal authority: a bounded institutional concept that must be attributable, versioned, and interpreted within the declared governance scope.",
  },
  {
    id: "TERM-065",
    term: "Responsible publication",
    definition: "TA-14 registration meaning for responsible publication: a bounded institutional concept that must be attributable, versioned, and interpreted within the declared governance scope.",
  },
  {
    id: "TERM-066",
    term: "Registration suspension",
    definition: "TA-14 registration meaning for registration suspension: a bounded institutional concept that must be attributable, versioned, and interpreted within the declared governance scope.",
  },
  {
    id: "TERM-067",
    term: "Architecture identity",
    definition: "TA-14 registration meaning for architecture identity: a bounded institutional concept that must be attributable, versioned, and interpreted within the declared governance scope.",
  },
  {
    id: "TERM-068",
    term: "Evidence history",
    definition: "TA-14 registration meaning for evidence history: a bounded institutional concept that must be attributable, versioned, and interpreted within the declared governance scope.",
  },
  {
    id: "TERM-069",
    term: "Public inspection",
    definition: "TA-14 registration meaning for public inspection: a bounded institutional concept that must be attributable, versioned, and interpreted within the declared governance scope.",
  },
  {
    id: "TERM-070",
    term: "Marketplace linkage",
    definition: "TA-14 registration meaning for marketplace linkage: a bounded institutional concept that must be attributable, versioned, and interpreted within the declared governance scope.",
  },
  {
    id: "TERM-071",
    term: "Playground route",
    definition: "TA-14 registration meaning for playground route: a bounded institutional concept that must be attributable, versioned, and interpreted within the declared governance scope.",
  },
  {
    id: "TERM-072",
    term: "Execution Artifact Studio",
    definition: "TA-14 registration meaning for execution artifact studio: a bounded institutional concept that must be attributable, versioned, and interpreted within the declared governance scope.",
  },
];

const INITIAL_DRAFT: RegistrationDraft = {
  organizationName: "",
  legalName: "",
  website: "",
  country: "",
  registrationNumber: "",
  architectureName: "",
  architectureVersion: "v1.0",
  architectureSummary: "",
  architectureHash: "",
  sectors: [],
  jurisdictions: [],
  determinations: ["ALLOW", "HOLD", "DENY", "ESCALATE"],
  owners: [{ id: "owner-1", name: "", email: "", role: "Accountable owner", accountable: true }],
  claims: CLAIM_TEMPLATES,
  declaredLimits: "",
  publicSummary: "",
  acceptsTerms: false,
  attestsAccuracy: false,
  attestsAuthority: false,
};

function cx(...values: Array<string | false | null | undefined>) { return values.filter(Boolean).join(" "); }
function slug(value: string) { return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 42); }
function pseudoHash(value: string) {
  let h1 = 0x811c9dc5; let h2 = 0x9e3779b9;
  for (let i = 0; i < value.length; i += 1) { h1 = Math.imul(h1 ^ value.charCodeAt(i), 16777619); h2 = Math.imul(h2 ^ (value.charCodeAt(i) + i), 2246822519); }
  const block = `${(h1 >>> 0).toString(16).padStart(8, "0")}${(h2 >>> 0).toString(16).padStart(8, "0")}`;
  return Array.from({ length: 4 }, (_, index) => pseudoMix(block, index)).join("");
}
function pseudoMix(block: string, index: number) { let n = index + 1; return block.split("").map((c, i) => ((parseInt(c, 16) + i + n) % 16).toString(16)).join(""); }
function downloadJson(name: string, value: unknown) {
  const blob = new Blob([JSON.stringify(value, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a"); anchor.href = url; anchor.download = name; anchor.click();
  URL.revokeObjectURL(url);
}

function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: string }) { return <span className={`badge badge-${tone}`}>{children}</span>; }
function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) { return <label className="field"><span className="field-label">{label}</span>{children}{hint ? <span className="field-hint">{hint}</span> : null}</label>; }
function ToggleCard({ active, title, description, onClick }: { active: boolean; title: string; description: string; onClick: () => void }) { return <button type="button" className={cx("toggle-card", active && "active")} onClick={onClick}><span className="toggle-check">{active ? "✓" : "+"}</span><span><strong>{title}</strong><small>{description}</small></span></button>; }

export default function GovernanceRegistrationPage() {
  const [step, setStep] = useState<StepId>("identity");
  const [state, setState] = useState<RegistrationState>("DRAFT");
  const [draft, setDraft] = useState<RegistrationDraft>(INITIAL_DRAFT);
  const [controlFilter, setControlFilter] = useState("ALL");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const stored = window.localStorage.getItem("ta14-governance-registration-draft-v1");
    if (stored) { try { setDraft(JSON.parse(stored) as RegistrationDraft); } catch { /* retain clean draft */ } }
  }, []);
  useEffect(() => { window.localStorage.setItem("ta14-governance-registration-draft-v1", JSON.stringify(draft)); }, [draft]);

  const selectedClaims = useMemo(() => draft.claims.filter((claim) => claim.selected), [draft.claims]);
  const registrationPayload = useMemo(() => ({
    schema: "ta14.governance.registration.candidate.v1",
    organization: { display_name: draft.organizationName, legal_name: draft.legalName, website: draft.website, country: draft.country, registration_number: draft.registrationNumber },
    architecture: { name: draft.architectureName, version: draft.architectureVersion, summary: draft.architectureSummary, declared_hash: draft.architectureHash || null },
    scope: { sectors: draft.sectors, jurisdictions: draft.jurisdictions, determinations: draft.determinations },
    owners: draft.owners, claims: selectedClaims, declared_limits: draft.declaredLimits, public_summary: draft.publicSummary,
    attestations: { terms: draft.acceptsTerms, accuracy: draft.attestsAccuracy, authority: draft.attestsAuthority },
  }), [draft, selectedClaims]);
  const packageHash = useMemo(() => pseudoHash(JSON.stringify(registrationPayload)), [registrationPayload]);
  const candidateId = useMemo(() => `TA14-GOV-CAND-${slug(draft.organizationName || "unassigned").toUpperCase()}-${packageHash.slice(0, 8).toUpperCase()}`, [draft.organizationName, packageHash]);

  const checks = useMemo(() => ({
    identity: Boolean(draft.organizationName.trim() && draft.legalName.trim() && draft.country.trim()),
    architecture: Boolean(draft.architectureName.trim() && draft.architectureVersion.trim() && draft.architectureSummary.trim().length >= 80),
    scope: draft.sectors.length > 0 && draft.jurisdictions.length > 0 && draft.determinations.length > 0,
    owners: draft.owners.some((owner) => owner.accountable && owner.name.trim() && owner.email.trim()),
    claims: selectedClaims.length > 0 && Boolean(draft.declaredLimits.trim() && draft.publicSummary.trim()),
    attestations: draft.acceptsTerms && draft.attestsAccuracy && draft.attestsAuthority,
  }), [draft, selectedClaims]);
  const passed = Object.values(checks).filter(Boolean).length;
  const readiness = Math.round((passed / Object.values(checks).length) * 100);
  const ready = Object.values(checks).every(Boolean);
  useEffect(() => { if (state === "DRAFT" && readiness === 100) setState("READY"); if (state === "READY" && readiness < 100) setState("DRAFT"); }, [readiness, state]);

  const controlState = (control: Control): ControlState => {
    const map: Record<string, boolean> = { Identity: checks.identity, Ownership: checks.owners, Architecture: checks.architecture, Scope: checks.scope, Authority: checks.owners, Evidence: checks.claims, Route: checks.scope, Runtime: checks.architecture, Outcome: checks.claims, Integrity: Boolean(packageHash), Disclosure: Boolean(draft.publicSummary), Review: checks.attestations };
    if (map[control.area]) return "PASS";
    return control.area === "Review" && readiness > 70 ? "REVIEW" : "MISSING";
  };
  const visibleControls = useMemo(() => CONTROLS.filter((control) => controlFilter === "ALL" || control.area === controlFilter || controlState(control) === controlFilter), [controlFilter, readiness, draft]);

  const patch = <K extends keyof RegistrationDraft>(key: K, value: RegistrationDraft[K]) => setDraft((current) => ({ ...current, [key]: value }));
  const toggleArray = (key: "sectors" | "jurisdictions", value: string) => patch(key, draft[key].includes(value) ? draft[key].filter((item) => item !== value) : [...draft[key], value]);
  const toggleDetermination = (value: Determination) => patch("determinations", draft.determinations.includes(value) ? draft.determinations.filter((item) => item !== value) : [...draft.determinations, value]);
  const updateOwner = (id: string, field: keyof Owner, value: string | boolean) => patch("owners", draft.owners.map((owner) => owner.id === id ? { ...owner, [field]: value } : owner));
  const addOwner = () => patch("owners", [...draft.owners, { id: `owner-${Date.now()}`, name: "", email: "", role: "Governance steward", accountable: false }]);
  const removeOwner = (id: string) => patch("owners", draft.owners.filter((owner) => owner.id !== id));
  const toggleClaim = (id: string) => patch("claims", draft.claims.map((claim) => claim.id === id ? { ...claim, selected: !claim.selected } : claim));

  const submit = () => {
    if (!ready) { setNotice("Submission blocked. Complete every required registration condition before freezing the candidate package."); return; }
    setState("SUBMITTED"); setStep("submitted"); setNotice("Candidate registration package preserved locally. Institutional review is required before a Governance Registration ID is issued.");
  };

  return (
    <main className="registration-page">
      <div className="ambient ambient-one" /><div className="ambient ambient-two" /><div className="grid-plane" />
      <header className="topbar">
        <Link className="brand" href="/"><span className="brand-mark">TA</span><span><b>TA-14 Authority</b><small>Governance Registration Center</small></span></Link>
        <nav><Link href="/governance/workspace">Governance Workspace</Link><Link href="/artifacts/registry">Artifact Registry</Link><Link href="/artifacts/studio">Artifact Studio</Link></nav>
        <Badge tone={state.toLowerCase()}>{state.replaceAll("_", " ")}</Badge>
      </header>

      <section className="hero">
        <div className="hero-copy"><p className="eyebrow">Institutional onboarding · Registered governance required</p><h1>Register the governance before registering the artifact.</h1><p className="hero-lede">Create the attributable governance identity that will own routes, submit execution artifacts, accept challenge, preserve corrections, and build a public evidence history.</p><div className="hero-actions"><button type="button" className="primary" onClick={() => setStep("identity")}>Begin registration</button><Link className="secondary" href="/artifacts">Inspect founding artifacts</Link></div></div>
        <div className="hero-core"><div className="core-ring"><span>{readiness}%</span><small>registration readiness</small></div><div className="core-rule"><b>No registered governance.</b><strong>No registered artifact.</strong><p>Registration creates attribution and eligibility. It is not certification.</p></div></div>
      </section>

      <section className="metric-strip">
        <article><span>Registration state</span><strong>{state.replaceAll("_", " ")}</strong><small>Candidate lifecycle</small></article>
        <article><span>Required conditions</span><strong>{passed} / 6</strong><small>Completed checks</small></article>
        <article><span>Selected sectors</span><strong>{draft.sectors.length}</strong><small>Declared applicability</small></article>
        <article><span>Capability claims</span><strong>{selectedClaims.length}</strong><small>Bounded public claims</small></article>
      </section>

      <section className="workspace">
        <aside className="step-rail">
          <div className="rail-title"><span>Registration route</span><strong>Seven governed stages</strong></div>
          {STEPS.map((item) => { const currentIndex = STEPS.findIndex((entry) => entry.id === step); const index = STEPS.findIndex((entry) => entry.id === item.id); const complete = index < currentIndex || item.id === "submitted" && state === "SUBMITTED"; return <button type="button" key={item.id} className={cx("step-button", step === item.id && "active", complete && "complete")} onClick={() => setStep(item.id)}><span>{complete ? "✓" : item.number}</span><b>{item.title}</b><small>{item.description}</small></button>; })}
          <div className="rail-rule"><b>Admission boundary</b><p>Only a governance with an issued registration ID may submit an artifact for permanent registry admission.</p></div>
        </aside>

        <div className="stage">
          {notice ? <div className="notice"><span>Institutional notice</span><p>{notice}</p><button type="button" onClick={() => setNotice("")}>Dismiss</button></div> : null}
          {step === "identity" ? <section className="panel stage-panel"><StageHeader number="01" title="Organization identity" text="Establish the attributable legal identity and public-facing organization that will own this governance registration." />
            <div className="form-grid two"><Field label="Public organization name"><input value={draft.organizationName} onChange={(event) => patch("organizationName", event.target.value)} placeholder="Example Governance Institute" /></Field><Field label="Legal entity name"><input value={draft.legalName} onChange={(event) => patch("legalName", event.target.value)} placeholder="Example Governance Institute, Inc." /></Field><Field label="Website"><input value={draft.website} onChange={(event) => patch("website", event.target.value)} placeholder="https://example.org" /></Field><Field label="Country of registration"><input value={draft.country} onChange={(event) => patch("country", event.target.value)} placeholder="United States" /></Field><Field label="Legal registration number" hint="Optional for demonstrations; required before institutional approval."><input value={draft.registrationNumber} onChange={(event) => patch("registrationNumber", event.target.value)} placeholder="Entity or company number" /></Field></div>
            <GateResult passed={checks.identity} success="Organization identity is attributable enough to continue." failure="Public name, legal name, and country are required." />
          </section> : null}

          {step === "architecture" ? <section className="panel stage-panel"><StageHeader number="02" title="Governance architecture" text="Register the named, versioned architecture that will own routes and produce execution artifacts." /><div className="form-grid two"><Field label="Architecture name"><input value={draft.architectureName} onChange={(event) => patch("architectureName", event.target.value)} placeholder="Admissible Execution Architecture" /></Field><Field label="Version"><input value={draft.architectureVersion} onChange={(event) => patch("architectureVersion", event.target.value)} placeholder="v1.0" /></Field><Field label="Declared architecture hash" hint="Optional until the architecture package is frozen."><input value={draft.architectureHash} onChange={(event) => patch("architectureHash", event.target.value)} placeholder="sha256:..." /></Field></div><Field label="Architecture summary" hint="Minimum 80 characters. Describe evidence, authority, route, runtime control, outcome, and correction discipline."><textarea value={draft.architectureSummary} onChange={(event) => patch("architectureSummary", event.target.value)} rows={8} placeholder="Describe how the governance architecture earns the right to bind consequence to reality..." /></Field><div className="architecture-chain">{["Reality","Record","Continuity","Admissibility","Binding","Commit","Execution","Outcome"].map((item, index) => <div key={item}><span>{String(index + 1).padStart(2,"0")}</span><b>{item}</b></div>)}</div><GateResult passed={checks.architecture} success="Architecture identity and version are sufficiently described." failure="Architecture name, version, and an 80-character summary are required." /></section> : null}

          {step === "scope" ? <section className="panel stage-panel"><StageHeader number="03" title="Scope and determinations" text="Declare where this governance applies and which decision effects it can legitimately produce." /><h3 className="subhead">Supported sectors</h3><div className="selection-grid">{SECTORS.map((item) => <ToggleCard key={item} active={draft.sectors.includes(item)} title={item} description="Include this sector in the registered applicability boundary." onClick={() => toggleArray("sectors", item)} />)}</div><h3 className="subhead">Jurisdictions</h3><div className="selection-grid compact">{JURISDICTIONS.map((item) => <ToggleCard key={item} active={draft.jurisdictions.includes(item)} title={item} description="Declare applicability; registration does not grant legal authority." onClick={() => toggleArray("jurisdictions", item)} />)}</div><h3 className="subhead">Supported determinations</h3><div className="determination-grid">{(["ALLOW","HOLD","DENY","ESCALATE"] as Determination[]).map((item) => <button type="button" key={item} className={cx("determination", item.toLowerCase(), draft.determinations.includes(item) && "active")} onClick={() => toggleDetermination(item)}><strong>{item}</strong><small>{item === "ALLOW" ? "Release exact committed scope" : item === "HOLD" ? "Pause pending repair or revalidation" : item === "DENY" ? "Block prohibited or invalid execution" : "Route to named authority"}</small></button>)}</div><GateResult passed={checks.scope} success="Sector, jurisdiction, and determination scope are declared." failure="Select at least one sector, jurisdiction, and determination." /></section> : null}

          {step === "owners" ? <section className="panel stage-panel"><StageHeader number="04" title="Accountable owners" text="Assign the human responsibility required to own the registration and answer for its public claims." /><div className="owner-list">{draft.owners.map((owner, index) => <article className="owner-card" key={owner.id}><div className="owner-number">{String(index + 1).padStart(2,"0")}</div><div className="form-grid two"><Field label="Name"><input value={owner.name} onChange={(event) => updateOwner(owner.id,"name",event.target.value)} /></Field><Field label="Email"><input type="email" value={owner.email} onChange={(event) => updateOwner(owner.id,"email",event.target.value)} /></Field><Field label="Institutional role"><input value={owner.role} onChange={(event) => updateOwner(owner.id,"role",event.target.value)} /></Field><label className="check-row"><input type="checkbox" checked={owner.accountable} onChange={(event) => updateOwner(owner.id,"accountable",event.target.checked)} /><span><b>Accountable owner</b><small>This person accepts responsibility for registration accuracy and prospective reliance.</small></span></label></div>{draft.owners.length > 1 ? <button type="button" className="danger-link" onClick={() => removeOwner(owner.id)}>Remove owner</button> : null}</article>)}</div><button type="button" className="secondary" onClick={addOwner}>Add governance steward</button><GateResult passed={checks.owners} success="At least one attributable accountable owner is established." failure="An accountable owner with a name and email is required." /></section> : null}

          {step === "claims" ? <section className="panel stage-panel"><StageHeader number="05" title="Claims and declared limits" text="State what this governance claims to do, and publish the limits that prevent those claims from expanding silently." /><div className="claim-grid">{draft.claims.map((claim) => <button type="button" key={claim.id} className={cx("claim-card", claim.selected && "selected")} onClick={() => toggleClaim(claim.id)}><span>{claim.selected ? "Selected" : "Add claim"}</span><strong>{claim.title}</strong><p>{claim.statement}</p><small>{claim.limit}</small></button>)}</div><Field label="Public governance summary" hint="Describe the governance in language suitable for the public registry profile."><textarea rows={6} value={draft.publicSummary} onChange={(event) => patch("publicSummary", event.target.value)} /></Field><Field label="Declared limits and non-claims" hint="State where this governance does not apply and what registration does not prove."><textarea rows={7} value={draft.declaredLimits} onChange={(event) => patch("declaredLimits", event.target.value)} /></Field><GateResult passed={checks.claims} success="Claims are bounded by a public summary and explicit limitations." failure="Select at least one claim and provide both a public summary and declared limits." /></section> : null}

          {step === "review" ? <section className="panel stage-panel"><StageHeader number="06" title="Institutional review" text="Inspect the frozen registration candidate before submission. Registration creates attribution and eligibility; it is not certification." /><div className="review-grid"><article className="review-score"><div className="score-ring"><strong>{readiness}%</strong><span>ready</span></div><h3>{ready ? "Candidate package ready" : "Conditions remain unresolved"}</h3><p>{ready ? "All mandatory registration conditions are represented. Submission will freeze the candidate package for institutional review." : "Resolve every missing condition before submitting. The registration center fails closed."}</p></article><article className="candidate-card"><span>Candidate registration ID</span><strong>{candidateId}</strong><small>Package root</small><code>{packageHash}</code></article></div><div className="checklist">{Object.entries(checks).map(([key,value]) => <div key={key} className={cx("check-item", value && "pass")}><span>{value ? "✓" : "!"}</span><b>{key.replaceAll("_"," ")}</b><small>{value ? "Satisfied" : "Required before submission"}</small></div>)}</div><div className="attestations"><label className="check-row"><input type="checkbox" checked={draft.acceptsTerms} onChange={(event) => patch("acceptsTerms",event.target.checked)} /><span><b>Institutional terms</b><small>I accept append-only registration, review, correction, suspension, and withdrawal rules.</small></span></label><label className="check-row"><input type="checkbox" checked={draft.attestsAccuracy} onChange={(event) => patch("attestsAccuracy",event.target.checked)} /><span><b>Accuracy attestation</b><small>I attest that the submitted information is complete and not materially misleading.</small></span></label><label className="check-row"><input type="checkbox" checked={draft.attestsAuthority} onChange={(event) => patch("attestsAuthority",event.target.checked)} /><span><b>Authority attestation</b><small>I possess authority to submit this governance registration on behalf of the organization.</small></span></label></div><div className="review-actions"><button type="button" className="secondary" onClick={() => downloadJson(`${slug(draft.organizationName || "governance")}-registration-candidate.json`, { candidate_id: candidateId, package_hash: packageHash, ...registrationPayload })}>Download candidate JSON</button><button type="button" className="primary" disabled={!ready} onClick={submit}>Freeze and submit for review</button></div></section> : null}

          {step === "submitted" ? <section className="panel stage-panel submitted-panel"><StageHeader number="07" title="Submission receipt" text="The candidate package has been frozen locally and is ready for institutional intake." /><div className="seal"><span>TA-14</span><strong>Registration candidate preserved</strong><small>{candidateId}</small></div><div className="receipt-grid"><article><span>Candidate ID</span><strong>{candidateId}</strong></article><article><span>Package hash</span><code>{packageHash}</code></article><article><span>Organization</span><strong>{draft.organizationName || "Unassigned"}</strong></article><article><span>Architecture</span><strong>{draft.architectureName} {draft.architectureVersion}</strong></article><article><span>Status</span><strong>SUBMITTED</strong></article><article><span>Next state</span><strong>UNDER REVIEW</strong></article></div><div className="important"><b>Registration is not certification.</b><p>A permanent Governance Registration ID is issued only after identity, architecture, scope, ownership, claims, and institutional review are complete. Artifact registry admission remains blocked until registration is active.</p></div><div className="review-actions"><button type="button" className="secondary" onClick={() => downloadJson(`${candidateId.toLowerCase()}-submission.json`, { candidate_id: candidateId, package_hash: packageHash, state: "SUBMITTED", submitted_at: new Date().toISOString(), registration: registrationPayload })}>Download submission receipt</button><Link className="primary" href="/governance/workspace">Open governance workspace</Link></div></section> : null}

          <section className="panel glossary-panel">
            <div className="section-heading">
              <div>
                <span>Institutional language</span>
                <h2>Registration glossary</h2>
              </div>
              <Badge tone="neutral">{REGISTRATION_GLOSSARY.length} TERMS</Badge>
            </div>
            <div className="glossary-grid">
              {REGISTRATION_GLOSSARY.map((entry) => (
                <article key={entry.id}>
                  <span>{entry.id}</span>
                  <strong>{entry.term}</strong>
                  <p>{entry.definition}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="panel questions-panel">
            <div className="section-heading">
              <div>
                <span>Registration inspection protocol</span>
                <h2>120 bounded review questions</h2>
              </div>
              <Badge tone={ready ? "pass" : "review"}>{ready ? "READY TO ANSWER" : "PREPARE EVIDENCE"}</Badge>
            </div>
            <div className="question-grid">
              {REVIEW_QUESTIONS.map((question) => (
                <article className="question-card" key={question.id}>
                  <div>
                    <span>{question.id}</span>
                    <Badge tone="neutral">{question.area}</Badge>
                  </div>
                  <strong>{question.question}</strong>
                  <p>{question.guidance}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="panel controls-panel"><div className="section-heading"><div><span>Institutional control ledger</span><h2>108 registration controls</h2></div><select value={controlFilter} onChange={(event) => setControlFilter(event.target.value)}><option value="ALL">All controls</option><option value="PASS">Passing</option><option value="REVIEW">Review</option><option value="MISSING">Missing</option><option value="Identity">Identity</option><option value="Ownership">Ownership</option><option value="Architecture">Architecture</option><option value="Scope">Scope</option><option value="Authority">Authority</option><option value="Evidence">Evidence</option><option value="Route">Route</option><option value="Runtime">Runtime</option><option value="Outcome">Outcome</option><option value="Integrity">Integrity</option><option value="Disclosure">Disclosure</option><option value="Review">Review</option></select></div><div className="control-list">{visibleControls.map((control) => { const result = controlState(control); return <article key={control.id} className={cx("control-row", result.toLowerCase())}><span>{control.id}</span><Badge tone={result.toLowerCase()}>{result}</Badge><div><strong>{control.title}</strong><p>{control.requirement}</p></div><small>{control.area}</small></article>; })}</div></section>
        </div>
      </section>

      <footer><div><strong>TA-14 AI Governance Exchange</strong><span>Governance Registration Center</span></div><p>No registered governance. No registered artifact.</p><nav><Link href="/">Exchange</Link><Link href="/governance/workspace">Workspace</Link><Link href="/artifacts/registry">Registry</Link></nav></footer>
      <style jsx global>{`

:root{color-scheme:dark;--bg:#030712;--panel:rgba(9,18,35,.82);--panel2:rgba(13,27,51,.92);--line:rgba(124,167,211,.2);--line2:rgba(77,209,255,.35);--text:#f5f8ff;--muted:#9fb0c5;--cyan:#4dd1ff;--cyan2:#1aa8e8;--gold:#e9c46a;--green:#53e3a6;--red:#ff6b7d;--orange:#ffb35c;--shadow:0 30px 90px rgba(0,0,0,.45)}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:#030712;color:var(--text);font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}.registration-page{position:relative;min-height:100vh;overflow:hidden;background:radial-gradient(circle at 50% -10%,rgba(30,120,190,.18),transparent 34%),linear-gradient(180deg,#02050c 0%,#07111f 50%,#030712 100%)}.grid-plane{position:fixed;inset:0;pointer-events:none;opacity:.16;background-image:linear-gradient(rgba(77,209,255,.1) 1px,transparent 1px),linear-gradient(90deg,rgba(77,209,255,.1) 1px,transparent 1px);background-size:48px 48px;mask-image:linear-gradient(to bottom,black,transparent 82%)}.ambient{position:fixed;width:520px;height:520px;border-radius:50%;filter:blur(100px);pointer-events:none;opacity:.17}.ambient-one{top:5%;left:-220px;background:#1362a2}.ambient-two{right:-240px;top:36%;background:#8e6e1e}.topbar{position:relative;z-index:10;display:flex;align-items:center;justify-content:space-between;gap:24px;max-width:1500px;margin:auto;padding:22px 38px;border-bottom:1px solid var(--line)}.brand{display:flex;align-items:center;gap:12px;color:inherit;text-decoration:none}.brand-mark{display:grid;place-items:center;width:44px;height:44px;border:1px solid rgba(233,196,106,.55);background:linear-gradient(145deg,rgba(233,196,106,.22),rgba(77,209,255,.08));color:var(--gold);font-weight:900}.brand b,.brand small{display:block}.brand small{margin-top:3px;color:var(--muted);font-size:11px;letter-spacing:.12em;text-transform:uppercase}.topbar nav{display:flex;gap:18px}.topbar nav a,footer a{color:var(--muted);text-decoration:none;font-size:13px}.topbar nav a:hover,footer a:hover{color:var(--cyan)}.badge{display:inline-flex;align-items:center;justify-content:center;padding:6px 10px;border:1px solid var(--line);border-radius:999px;font-size:10px;font-weight:900;letter-spacing:.12em;text-transform:uppercase;background:rgba(255,255,255,.04)}.badge-pass,.badge-ready,.badge-registered{color:var(--green);border-color:rgba(83,227,166,.4);background:rgba(83,227,166,.08)}.badge-review,.badge-under_review,.badge-submitted{color:var(--gold);border-color:rgba(233,196,106,.4);background:rgba(233,196,106,.08)}.badge-missing,.badge-returned{color:var(--red);border-color:rgba(255,107,125,.4);background:rgba(255,107,125,.08)}.badge-draft{color:var(--cyan)}.hero{position:relative;z-index:2;display:grid;grid-template-columns:minmax(0,1.3fr) minmax(320px,.7fr);gap:42px;max-width:1450px;margin:0 auto;padding:96px 42px 70px}.eyebrow{margin:0 0 18px;color:var(--gold);font-size:12px;font-weight:900;letter-spacing:.18em;text-transform:uppercase}.hero h1{max-width:920px;margin:0;font-family:Georgia,serif;font-size:clamp(48px,7vw,100px);line-height:.94;letter-spacing:-.055em}.hero-lede{max-width:790px;margin:28px 0 0;color:#bfd0e3;font-size:20px;line-height:1.65}.hero-actions,.review-actions{display:flex;flex-wrap:wrap;gap:12px;margin-top:30px}.primary,.secondary{display:inline-flex;align-items:center;justify-content:center;min-height:46px;padding:0 18px;border-radius:5px;border:1px solid var(--line2);font-size:13px;font-weight:900;text-decoration:none;cursor:pointer}.primary{background:linear-gradient(135deg,#21b8ed,#4dd1ff);color:#011018;box-shadow:0 15px 38px rgba(32,185,238,.22)}.primary:disabled{opacity:.35;cursor:not-allowed}.secondary{background:rgba(8,21,38,.82);color:#dce9f8}.hero-core{position:relative;display:grid;place-items:center;min-height:460px;border:1px solid var(--line);background:radial-gradient(circle at center,rgba(31,142,203,.18),transparent 58%),rgba(4,12,24,.72);box-shadow:inset 0 0 80px rgba(77,209,255,.05),var(--shadow)}.core-ring{display:grid;place-items:center;width:230px;height:230px;border-radius:50%;border:1px solid rgba(77,209,255,.46);box-shadow:0 0 0 24px rgba(77,209,255,.035),0 0 80px rgba(77,209,255,.16);background:radial-gradient(circle,rgba(77,209,255,.13),rgba(3,7,18,.92) 68%)}.core-ring span{font-size:54px;font-weight:200}.core-ring small{text-transform:uppercase;letter-spacing:.16em;color:var(--muted)}.core-rule{position:absolute;left:24px;right:24px;bottom:24px;padding:18px;border-left:3px solid var(--gold);background:rgba(3,7,18,.82)}.core-rule b,.core-rule strong{display:block}.core-rule b{color:var(--gold)}.core-rule strong{font-size:24px}.core-rule p{margin:8px 0 0;color:var(--muted)}.metric-strip{position:relative;z-index:3;display:grid;grid-template-columns:repeat(4,1fr);max-width:1450px;margin:0 auto 32px;border:1px solid var(--line);background:rgba(5,13,26,.88);box-shadow:var(--shadow)}.metric-strip article{padding:24px 26px;border-right:1px solid var(--line)}.metric-strip article:last-child{border-right:0}.metric-strip span,.metric-strip small{display:block;color:var(--muted);font-size:11px;text-transform:uppercase;letter-spacing:.12em}.metric-strip strong{display:block;margin:8px 0;font-size:27px}.workspace{position:relative;z-index:3;display:grid;grid-template-columns:330px minmax(0,1fr);gap:24px;max-width:1500px;margin:auto;padding:20px 30px 80px}.step-rail{position:sticky;top:18px;align-self:start;max-height:calc(100vh - 36px);overflow:auto;border:1px solid var(--line);background:rgba(5,13,26,.92);box-shadow:var(--shadow)}.rail-title{padding:22px;border-bottom:1px solid var(--line)}.rail-title span,.section-heading span{display:block;color:var(--gold);font-size:10px;font-weight:900;letter-spacing:.16em;text-transform:uppercase}.rail-title strong{display:block;margin-top:7px}.step-button{width:100%;display:grid;grid-template-columns:38px 1fr;text-align:left;gap:4px 10px;padding:18px 16px;border:0;border-bottom:1px solid var(--line);background:transparent;color:inherit;cursor:pointer}.step-button>span{grid-row:1/3;display:grid;place-items:center;width:34px;height:34px;border:1px solid var(--line);color:var(--muted)}.step-button b{font-size:13px}.step-button small{color:var(--muted);line-height:1.45}.step-button:hover,.step-button.active{background:rgba(77,209,255,.07)}.step-button.active>span{border-color:var(--cyan);color:var(--cyan)}.step-button.complete>span{color:var(--green);border-color:rgba(83,227,166,.42)}.rail-rule{margin:18px;padding:18px;border:1px solid rgba(233,196,106,.3);background:rgba(233,196,106,.05)}.rail-rule b{color:var(--gold)}.rail-rule p{color:var(--muted);line-height:1.55}.stage{min-width:0}.panel{border:1px solid var(--line);background:linear-gradient(155deg,rgba(11,24,45,.94),rgba(4,11,23,.94));box-shadow:var(--shadow)}.stage-panel{padding:34px}.stage-header{display:grid;grid-template-columns:64px 1fr;gap:18px;margin-bottom:30px}.stage-number{display:grid;place-items:center;width:58px;height:58px;border:1px solid rgba(233,196,106,.45);color:var(--gold);font-family:Georgia,serif;font-size:22px}.stage-header span{color:var(--cyan);font-size:11px;font-weight:900;letter-spacing:.16em;text-transform:uppercase}.stage-header h2{margin:5px 0 8px;font-family:Georgia,serif;font-size:38px}.stage-header p{margin:0;color:var(--muted);line-height:1.6}.form-grid{display:grid;gap:18px}.form-grid.two{grid-template-columns:repeat(2,minmax(0,1fr))}.field{display:block;margin-bottom:18px}.field-label{display:block;margin-bottom:8px;font-size:12px;font-weight:800}.field-hint{display:block;margin-top:7px;color:var(--muted);font-size:11px;line-height:1.5}input,textarea,select{width:100%;border:1px solid var(--line);border-radius:3px;background:rgba(1,7,15,.72);color:var(--text);padding:13px 14px;outline:none;font:inherit}input:focus,textarea:focus,select:focus{border-color:var(--cyan);box-shadow:0 0 0 3px rgba(77,209,255,.08)}textarea{resize:vertical}.gate-result{display:flex;align-items:center;gap:13px;margin-top:20px;padding:16px;border:1px solid rgba(255,107,125,.3);background:rgba(255,107,125,.05)}.gate-result.pass{border-color:rgba(83,227,166,.3);background:rgba(83,227,166,.05)}.gate-result>span{display:grid;place-items:center;width:34px;height:34px;border-radius:50%;background:rgba(255,255,255,.05)}.gate-result b{display:block}.gate-result small{display:block;margin-top:3px;color:var(--muted)}.architecture-chain{display:grid;grid-template-columns:repeat(8,1fr);gap:8px;margin:24px 0}.architecture-chain div{padding:14px 8px;border:1px solid var(--line);text-align:center;background:rgba(77,209,255,.035)}.architecture-chain span,.architecture-chain b{display:block}.architecture-chain span{color:var(--cyan);font-size:10px}.architecture-chain b{margin-top:5px;font-size:11px}.subhead{margin:30px 0 14px;font-family:Georgia,serif;font-size:24px}.selection-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}.selection-grid.compact{grid-template-columns:repeat(2,minmax(0,1fr))}.toggle-card{display:grid;grid-template-columns:34px 1fr;gap:12px;text-align:left;padding:16px;border:1px solid var(--line);background:rgba(1,7,15,.52);color:inherit;cursor:pointer}.toggle-card.active{border-color:rgba(77,209,255,.5);background:rgba(77,209,255,.08)}.toggle-check{display:grid;place-items:center;width:30px;height:30px;border:1px solid var(--line)}.toggle-card strong,.toggle-card small{display:block}.toggle-card small{margin-top:5px;color:var(--muted);line-height:1.4}.determination-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}.determination{padding:20px;border:1px solid var(--line);background:rgba(1,7,15,.55);color:inherit;text-align:left;cursor:pointer;opacity:.55}.determination.active{opacity:1;transform:translateY(-2px)}.determination strong,.determination small{display:block}.determination small{margin-top:8px;color:var(--muted);line-height:1.45}.determination.allow.active{border-color:rgba(83,227,166,.6);background:rgba(83,227,166,.07)}.determination.hold.active{border-color:rgba(255,179,92,.6);background:rgba(255,179,92,.07)}.determination.deny.active{border-color:rgba(255,107,125,.6);background:rgba(255,107,125,.07)}.determination.escalate.active{border-color:rgba(77,209,255,.6);background:rgba(77,209,255,.07)}.owner-list{display:grid;gap:14px;margin-bottom:18px}.owner-card{position:relative;display:grid;grid-template-columns:56px 1fr;gap:16px;padding:22px;border:1px solid var(--line);background:rgba(1,7,15,.45)}.owner-number{display:grid;place-items:center;width:48px;height:48px;border:1px solid var(--line);color:var(--cyan)}.check-row{display:flex;gap:12px;align-items:flex-start;padding:14px;border:1px solid var(--line);background:rgba(255,255,255,.02)}.check-row input{width:auto;margin-top:3px}.check-row b,.check-row small{display:block}.check-row small{margin-top:4px;color:var(--muted);line-height:1.45}.danger-link{position:absolute;right:18px;bottom:12px;border:0;background:transparent;color:var(--red);cursor:pointer}.claim-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin-bottom:24px}.claim-card{padding:20px;border:1px solid var(--line);background:rgba(1,7,15,.5);color:inherit;text-align:left;cursor:pointer}.claim-card.selected{border-color:rgba(233,196,106,.55);background:rgba(233,196,106,.06)}.claim-card span{color:var(--gold);font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:.14em}.claim-card strong{display:block;margin:9px 0;font-size:18px}.claim-card p,.claim-card small{color:var(--muted);line-height:1.55}.review-grid{display:grid;grid-template-columns:.8fr 1.2fr;gap:14px}.review-score,.candidate-card{padding:24px;border:1px solid var(--line);background:rgba(1,7,15,.5)}.score-ring{display:grid;place-items:center;width:130px;height:130px;margin-bottom:18px;border-radius:50%;border:8px solid rgba(77,209,255,.22);box-shadow:inset 0 0 35px rgba(77,209,255,.08)}.score-ring strong,.score-ring span{display:block}.score-ring strong{font-size:34px}.score-ring span{color:var(--muted);font-size:11px;text-transform:uppercase}.review-score h3{font-family:Georgia,serif;font-size:25px}.review-score p{color:var(--muted);line-height:1.6}.candidate-card span,.candidate-card small{display:block;color:var(--muted);font-size:11px;text-transform:uppercase;letter-spacing:.12em}.candidate-card strong{display:block;margin:10px 0 24px;font-size:21px;word-break:break-word}.candidate-card code,.receipt-grid code{display:block;color:var(--cyan);word-break:break-all;line-height:1.6}.checklist{display:grid;grid-template-columns:repeat(3,1fr);gap:9px;margin:18px 0}.check-item{display:grid;grid-template-columns:30px 1fr;gap:4px 9px;padding:14px;border:1px solid rgba(255,107,125,.24);background:rgba(255,107,125,.04)}.check-item.pass{border-color:rgba(83,227,166,.26);background:rgba(83,227,166,.04)}.check-item>span{grid-row:1/3}.check-item b{text-transform:capitalize}.check-item small{color:var(--muted)}.attestations{display:grid;gap:8px}.notice{display:grid;grid-template-columns:150px 1fr auto;gap:14px;align-items:center;margin-bottom:14px;padding:16px;border:1px solid rgba(233,196,106,.35);background:rgba(233,196,106,.07)}.notice span{color:var(--gold);font-size:10px;font-weight:900;text-transform:uppercase}.notice p{margin:0;color:#e4d9b6}.notice button{border:0;background:transparent;color:var(--muted);cursor:pointer}.submitted-panel{text-align:center}.submitted-panel .stage-header{text-align:left}.seal{display:grid;place-items:center;min-height:250px;margin:12px 0 24px;border:1px solid rgba(233,196,106,.42);background:radial-gradient(circle,rgba(233,196,106,.09),transparent 60%)}.seal span{display:grid;place-items:center;width:92px;height:92px;border:1px solid var(--gold);border-radius:50%;color:var(--gold);font-family:Georgia,serif;font-size:28px}.seal strong{font-family:Georgia,serif;font-size:30px}.seal small{color:var(--muted)}.receipt-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;text-align:left}.receipt-grid article{padding:18px;border:1px solid var(--line);background:rgba(1,7,15,.5)}.receipt-grid span,.receipt-grid strong{display:block}.receipt-grid span{color:var(--muted);font-size:10px;text-transform:uppercase;letter-spacing:.12em}.receipt-grid strong{margin-top:7px}.important{margin-top:18px;padding:20px;text-align:left;border-left:3px solid var(--gold);background:rgba(233,196,106,.06)}.important b{color:var(--gold)}.important p{margin-bottom:0;color:var(--muted);line-height:1.6}.controls-panel{margin-top:24px}.section-heading{display:flex;justify-content:space-between;align-items:end;gap:20px;padding:25px;border-bottom:1px solid var(--line)}.section-heading h2{margin:6px 0 0;font-family:Georgia,serif;font-size:30px}.section-heading select{width:240px}.control-list{max-height:680px;overflow:auto}.control-row{display:grid;grid-template-columns:76px 84px minmax(0,1fr) 120px;gap:12px;align-items:start;padding:16px 22px;border-bottom:1px solid var(--line)}.control-row>span{color:var(--cyan);font-family:monospace}.control-row strong{display:block}.control-row p{margin:5px 0 0;color:var(--muted);line-height:1.45}.control-row>small{text-align:right;color:var(--muted)}footer{position:relative;z-index:2;display:flex;justify-content:space-between;align-items:center;gap:24px;padding:32px 42px;border-top:1px solid var(--line);background:#02050c}footer strong,footer span{display:block}footer span,footer p{color:var(--muted)}footer nav{display:flex;gap:15px}.glossary-panel{margin-top:24px}.glossary-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));max-height:640px;overflow:auto}.glossary-grid article{padding:18px;border-right:1px solid var(--line);border-bottom:1px solid var(--line);background:rgba(255,255,255,.015)}.glossary-grid span{display:block;color:var(--cyan);font-family:monospace;font-size:10px}.glossary-grid strong{display:block;margin:8px 0}.glossary-grid p{margin:0;color:var(--muted);font-size:12px;line-height:1.55}.questions-panel{margin-top:24px}.question-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));max-height:720px;overflow:auto}.question-card{padding:20px;border-right:1px solid var(--line);border-bottom:1px solid var(--line);background:rgba(1,7,15,.35)}.question-card>div{display:flex;align-items:center;justify-content:space-between;gap:12px}.question-card>div>span{color:var(--cyan);font-family:monospace;font-size:12px}.question-card strong{display:block;margin:14px 0 8px;line-height:1.45}.question-card p{margin:0;color:var(--muted);line-height:1.55;font-size:12px}@media(max-width:1100px){.hero{grid-template-columns:1fr}.hero-core{min-height:390px}.workspace{grid-template-columns:1fr}.step-rail{position:relative;top:0;max-height:none;display:grid;grid-template-columns:repeat(2,1fr)}.rail-title,.rail-rule{grid-column:1/-1}.metric-strip{grid-template-columns:repeat(2,1fr)}.selection-grid{grid-template-columns:repeat(2,1fr)}.determination-grid{grid-template-columns:repeat(2,1fr)}.architecture-chain{grid-template-columns:repeat(4,1fr)}}@media(max-width:720px){.topbar{padding:18px}.topbar nav{display:none}.hero{padding:60px 20px 40px}.hero h1{font-size:52px}.hero-lede{font-size:17px}.metric-strip{margin:0 18px 24px;grid-template-columns:1fr}.metric-strip article{border-right:0;border-bottom:1px solid var(--line)}.workspace{padding:12px 14px 60px}.step-rail{display:block}.stage-panel{padding:22px}.form-grid.two,.selection-grid,.selection-grid.compact,.claim-grid,.review-grid,.receipt-grid,.checklist,.question-grid,.glossary-grid{grid-template-columns:1fr}.determination-grid{grid-template-columns:1fr}.architecture-chain{grid-template-columns:repeat(2,1fr)}.owner-card{grid-template-columns:1fr}.control-row{grid-template-columns:64px 80px 1fr}.control-row>small{display:none}.section-heading{align-items:stretch;flex-direction:column}.section-heading select{width:100%}.notice{grid-template-columns:1fr}.hero-core{min-height:430px}footer{align-items:flex-start;flex-direction:column}}
      `}</style>
    </main>
  );
}

function StageHeader({ number, title, text }: { number: string; title: string; text: string }) { return <div className="stage-header"><div className="stage-number">{number}</div><div><span>Governance registration stage</span><h2>{title}</h2><p>{text}</p></div></div>; }
function GateResult({ passed, success, failure }: { passed: boolean; success: string; failure: string }) { return <div className={cx("gate-result", passed && "pass")}><span>{passed ? "✓" : "!"}</span><div><b>{passed ? "Condition satisfied" : "Condition unresolved"}</b><small>{passed ? success : failure}</small></div></div>; }
