"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type ReactNode } from "react";

type StepId = "identity" | "architecture" | "purpose" | "claims" | "sectors" | "jurisdictions" | "determinations" | "owners" | "evidence" | "implementation" | "limits" | "confidentiality" | "publication" | "review" | "submitted";
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
  governancePurpose: string;
  intendedUsers: string;
  consequenceBoundary: string;
  sectors: string[];
  jurisdictions: string[];
  determinations: Determination[];
  owners: Owner[];
  claims: Claim[];
  evidenceSummary: string;
  evidenceReferences: string;
  evidenceStatus: string;
  implementationState: string;
  runtimeBoundary: string;
  declaredLimits: string;
  nonClaims: string;
  confidentialityBoundary: string;
  proprietaryBoundary: string;
  publicationPermission: string;
  publicSummary: string;
  acceptsTerms: boolean;
  attestsAccuracy: boolean;
  attestsAuthority: boolean;
};

type Control = { id: string; area: string; title: string; requirement: string };

const EXCHANGE_LIFECYCLE = [
  { label: "Credentials", href: "/foundation", state: "complete" },
  { label: "Architecture", href: "/workspace/ai-governance/registry", state: "complete" },
  { label: "Governance Registration", href: "/governance/register", state: "current" },
  { label: "Governance Workspace", href: "/governance/workspace", state: "future" },
  { label: "Route Builder", href: "/workspace/routes/new", state: "future" },
  { label: "Artifact Studio", href: "/artifacts/studio", state: "future" },
  { label: "Artifact Registry", href: "/artifacts/registry", state: "future" },
  { label: "Verification", href: "/artifacts/verify", state: "future" },
] as const;

const AFTER_REGISTRATION = [
  { title: "Governance Registration ID issued", detail: "A permanent, attributable identifier replaces the local candidate ID after institutional approval." },
  { title: "Public registry profile created", detail: "The organization, architecture, claims, limits, version, owners, and status become inspectable." },
  { title: "Governance Workspace activated", detail: "Accountable owners and stewards can manage versions, routes, artifacts, reviews, and corrections." },
  { title: "Registered Route Builder unlocked", detail: "Every new route is bound to the active governance registration and architecture version." },
  { title: "Execution Artifact Studio enabled", detail: "The registered governance may produce bounded execution records from frozen routes." },
  { title: "Artifact Registry eligibility granted", detail: "Only then may execution artifacts be submitted for permanent registry admission." },
  { title: "Verification and challenge pathways opened", detail: "Published records can be verified, challenged, corrected, superseded, or withdrawn without rewriting history." },
] as const;

const STEPS: Array<{ id: Exclude<StepId, "submitted">; number: string; title: string; description: string }> = [
  { id: "identity", number: "01", title: "Entity identity", description: "Who is entering the public governance record?" },
  { id: "architecture", number: "02", title: "Architecture identity", description: "Name and version the governance architecture or system." },
  { id: "purpose", number: "03", title: "Declared purpose", description: "State what the governance exists to do and for whom." },
  { id: "claims", number: "04", title: "Bounded claims", description: "Select only the capabilities the entity actually claims." },
  { id: "sectors", number: "05", title: "Sector scope", description: "Declare the operational sectors where the claims apply." },
  { id: "jurisdictions", number: "06", title: "Jurisdiction scope", description: "Declare geographic or organizational applicability." },
  { id: "determinations", number: "07", title: "Decision effects", description: "Declare which governance determinations the architecture supports." },
  { id: "owners", number: "08", title: "Stewardship", description: "Identify the accountable person or people behind the registration." },
  { id: "evidence", number: "09", title: "Evidence surface", description: "Describe the evidence available to support the declared baseline." },
  { id: "implementation", number: "10", title: "Implementation state", description: "Distinguish designed, tested, deployed, and runtime-supported capability." },
  { id: "limits", number: "11", title: "Limits and non-claims", description: "State what the architecture does not establish or control." },
  { id: "confidentiality", number: "12", title: "Confidentiality boundary", description: "Separate public evidence from closed or proprietary implementation." },
  { id: "publication", number: "13", title: "Public record", description: "Choose what may appear in the public registry record." },
  { id: "review", number: "14", title: "Review and attestation", description: "Review the baseline, accept the terms, and submit." },
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
  governancePurpose: "",
  intendedUsers: "",
  consequenceBoundary: "",
  sectors: [],
  jurisdictions: [],
  determinations: [],
  owners: [{ id: "owner-1", name: "", email: "", role: "Accountable owner", accountable: true }],
  claims: CLAIM_TEMPLATES,
  evidenceSummary: "",
  evidenceReferences: "",
  evidenceStatus: "DECLARED",
  implementationState: "",
  runtimeBoundary: "",
  declaredLimits: "",
  nonClaims: "",
  confidentialityBoundary: "",
  proprietaryBoundary: "",
  publicationPermission: "PUBLIC_BASELINE",
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
function ToggleCard({ active, title, description, onClick }: { key?: string; active: boolean; title: string; description: string; onClick: () => void }) { return <button type="button" className={cx("toggle-card", active && "active")} onClick={onClick}><span className="toggle-check">{active ? "✓" : "+"}</span><span><strong>{title}</strong><small>{description}</small></span></button>; }

export default function GovernanceRegistrationPage() {
  const [step, setStep] = useState<StepId>("identity");
  const [state, setState] = useState<RegistrationState>("DRAFT");
  const [draft, setDraft] = useState<RegistrationDraft>(INITIAL_DRAFT);
  const [controlFilter, setControlFilter] = useState("ALL");
  const [notice, setNotice] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem("ta14-governance-registration-draft-v2");
    if (stored) {
      try { setDraft({ ...INITIAL_DRAFT, ...(JSON.parse(stored) as Partial<RegistrationDraft>) }); }
      catch { /* retain clean draft */ }
    }
  }, []);
  useEffect(() => {
    window.localStorage.setItem("ta14-governance-registration-draft-v2", JSON.stringify(draft));
  }, [draft]);

  const selectedClaims = useMemo(() => draft.claims.filter((claim) => claim.selected), [draft.claims]);
  const patch = <K extends keyof RegistrationDraft>(key: K, value: RegistrationDraft[K]) => setDraft((current) => ({ ...current, [key]: value }));
  const toggleArray = (key: "sectors" | "jurisdictions", value: string) => patch(key, draft[key].includes(value) ? draft[key].filter((item) => item !== value) : [...draft[key], value]);
  const toggleDetermination = (value: Determination) => patch("determinations", draft.determinations.includes(value) ? draft.determinations.filter((item) => item !== value) : [...draft.determinations, value]);
  const updateOwner = (id: string, field: keyof Owner, value: string | boolean) => patch("owners", draft.owners.map((owner) => owner.id === id ? { ...owner, [field]: value } : owner));
  const addOwner = () => patch("owners", [...draft.owners, { id: `owner-${Date.now()}`, name: "", email: "", role: "Governance steward", accountable: false }]);
  const removeOwner = (id: string) => patch("owners", draft.owners.filter((owner) => owner.id !== id));
  const toggleClaim = (id: string) => patch("claims", draft.claims.map((claim) => claim.id === id ? { ...claim, selected: !claim.selected } : claim));

  const stepChecks: Record<Exclude<StepId, "submitted">, boolean> = {
    identity: Boolean(draft.organizationName.trim() && draft.legalName.trim() && draft.country.trim()),
    architecture: Boolean(draft.architectureName.trim() && draft.architectureVersion.trim() && draft.architectureSummary.trim().length >= 80),
    purpose: Boolean(draft.governancePurpose.trim().length >= 40 && draft.intendedUsers.trim() && draft.consequenceBoundary.trim().length >= 30),
    claims: selectedClaims.length > 0,
    sectors: draft.sectors.length > 0,
    jurisdictions: draft.jurisdictions.length > 0,
    determinations: draft.determinations.length > 0,
    owners: draft.owners.some((owner) => owner.accountable && owner.name.trim() && owner.email.trim()),
    evidence: Boolean(draft.evidenceSummary.trim().length >= 40 && draft.evidenceStatus.trim()),
    implementation: Boolean(draft.implementationState.trim() && draft.runtimeBoundary.trim().length >= 30),
    limits: Boolean(draft.declaredLimits.trim().length >= 30 && draft.nonClaims.trim().length >= 20),
    confidentiality: Boolean(draft.confidentialityBoundary.trim().length >= 20 && draft.proprietaryBoundary.trim().length >= 20),
    publication: Boolean(draft.publicationPermission.trim() && draft.publicSummary.trim().length >= 40),
    review: draft.acceptsTerms && draft.attestsAccuracy && draft.attestsAuthority,
  };

  const currentIndex = Math.max(0, STEPS.findIndex((item) => item.id === step));
  const currentStep = STEPS[currentIndex] ?? STEPS[0];
  const currentComplete = step === "submitted" ? true : stepChecks[step as Exclude<StepId, "submitted">];
  const completedCount = STEPS.filter((item) => stepChecks[item.id]).length;
  const readiness = Math.round((completedCount / STEPS.length) * 100);
  const ready = STEPS.every((item) => stepChecks[item.id]);

  const registrationPayload = useMemo(() => ({
    schema: "ta14.governance.registration.candidate.v2",
    instrument: "TA14-RET-001",
    participant_experience: "TA14-14-STEP-GUIDED-REGISTRATION",
    organization: { display_name: draft.organizationName, legal_name: draft.legalName, website: draft.website, country: draft.country, registration_number: draft.registrationNumber },
    architecture: { name: draft.architectureName, version: draft.architectureVersion, summary: draft.architectureSummary, declared_hash: draft.architectureHash || null },
    purpose: { governance_purpose: draft.governancePurpose, intended_users: draft.intendedUsers, consequence_boundary: draft.consequenceBoundary },
    scope: { sectors: draft.sectors, jurisdictions: draft.jurisdictions, determinations: draft.determinations },
    owners: draft.owners,
    claims: selectedClaims,
    evidence: { summary: draft.evidenceSummary, references: draft.evidenceReferences, status: draft.evidenceStatus },
    implementation: { state: draft.implementationState, runtime_boundary: draft.runtimeBoundary },
    boundaries: { declared_limits: draft.declaredLimits, non_claims: draft.nonClaims, confidentiality: draft.confidentialityBoundary, proprietary: draft.proprietaryBoundary },
    publication: { permission: draft.publicationPermission, public_summary: draft.publicSummary },
    attestations: { terms: draft.acceptsTerms, accuracy: draft.attestsAccuracy, authority: draft.attestsAuthority },
  }), [draft, selectedClaims]);

  const packageHash = useMemo(() => pseudoHash(JSON.stringify(registrationPayload)), [registrationPayload]);
  const candidateId = useMemo(() => `TA14-GOV-CAND-${slug(draft.organizationName || "unassigned").toUpperCase()}-${packageHash.slice(0, 8).toUpperCase()}`, [draft.organizationName, packageHash]);

  useEffect(() => {
    if (state === "DRAFT" && ready) setState("READY");
    if (state === "READY" && !ready) setState("DRAFT");
  }, [ready, state]);

  const controlState = (control: Control): ControlState => {
    const map: Record<string, boolean> = {
      Identity: stepChecks.identity,
      Ownership: stepChecks.owners,
      Architecture: stepChecks.architecture,
      Scope: stepChecks.sectors && stepChecks.jurisdictions,
      Authority: stepChecks.owners,
      Evidence: stepChecks.evidence,
      Route: stepChecks.determinations,
      Runtime: stepChecks.implementation,
      Outcome: stepChecks.limits,
      Integrity: Boolean(packageHash),
      Disclosure: stepChecks.publication,
      Review: stepChecks.review,
    };
    if (map[control.area]) return "PASS";
    return control.area === "Review" && readiness > 70 ? "REVIEW" : "MISSING";
  };
  const visibleControls = useMemo(() => CONTROLS.filter((control) => controlFilter === "ALL" || control.area === controlFilter || controlState(control) === controlFilter), [controlFilter, readiness, draft]);

  const goToStep = (target: StepId) => {
    setStep(target);
    window.requestAnimationFrame(() => document.getElementById("guided-registration")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };
  const goNext = () => {
    if (step === "submitted") return;
    if (!currentComplete) { setNotice("Complete the required information on this step before continuing."); return; }
    const next = STEPS[currentIndex + 1];
    if (next) goToStep(next.id);
  };
  const goBack = () => {
    const previous = STEPS[currentIndex - 1];
    if (previous) goToStep(previous.id);
  };
  const submit = () => {
    if (!ready) { setNotice("Submission blocked. Complete all fourteen registration steps before freezing the candidate package."); return; }
    setState("SUBMITTED"); setStep("submitted"); setNotice("Candidate registration package preserved locally. Institutional review is required before a Governance Registration ID is issued.");
  };

  const Preview = () => (
    <div className="preview-grid">
      <article><small>Candidate registration ID</small><strong>{candidateId}</strong></article>
      <article><small>Registration state</small><strong>{state.replaceAll("_", " ")}</strong></article>
      <article><small>Organization</small><strong>{draft.organizationName || "Not yet declared"}</strong><span>{draft.legalName || "Legal entity pending"}</span></article>
      <article><small>Governance architecture</small><strong>{draft.architectureName || "Not yet declared"}</strong><span>{draft.architectureVersion || "Version pending"}</span></article>
      <article><small>Accountable owner</small><strong>{draft.owners.find((owner) => owner.accountable)?.name || "Not yet established"}</strong><span>{draft.owners.find((owner) => owner.accountable)?.role || "Accountable role pending"}</span></article>
      <article><small>Public applicability</small><strong>{draft.sectors.length} sectors · {draft.jurisdictions.length} jurisdictions</strong><span>{draft.determinations.join(" · ") || "Determinations pending"}</span></article>
      <article className="preview-wide"><small>Public summary</small><p>{draft.publicSummary || "The public-facing explanation of this governance will appear here as it is written."}</p></article>
      <article className="preview-wide"><small>Claims and declared limits</small><strong>{selectedClaims.length} bounded claims selected</strong><p>{draft.declaredLimits || "Explicit limitations and non-claims remain required before review."}</p></article>
    </div>
  );

  const StepFrame = ({ children, note, example }: { children: ReactNode; note: string; example?: string }) => (
    <section className="guided-card">
      <div className="guided-head"><div className="guided-number">{currentStep.number}</div><div><span>TA-14 guided governance registration</span><h2>{currentStep.title}</h2><p>{currentStep.description}</p></div></div>
      <div className="guided-body">
        <div className="guide-note"><b>Why this matters</b><p>{note}</p></div>
        {example ? <div className="example-box"><b>Example</b><p>{example}</p></div> : null}
        {children}
      </div>
      <div className="guided-actions">
        <div className="guided-actions-left"><button type="button" className="secondary" disabled={currentIndex === 0} onClick={goBack}>← Back</button><span className={cx("step-status", currentComplete && "pass")}>{currentComplete ? "✓ Step complete" : "Required information remains"}</span></div>
        <div className="guided-actions-right"><button type="button" className="primary" disabled={!currentComplete || currentIndex === STEPS.length - 1} onClick={goNext}>{currentIndex === STEPS.length - 1 ? "Final step" : `Continue to Step ${currentIndex + 2} →`}</button></div>
      </div>
    </section>
  );

  return (
    <main className="registration-page">
      <div className="ambient ambient-one" /><div className="ambient ambient-two" /><div className="grid-plane" />
      <header className="topbar">
        <Link className="brand" href="/"><span className="brand-mark">TA</span><span><b>TA-14 Authority</b><small>Governance Registration Center</small></span></Link>
        <nav><Link href="/governance/workspace">Governance Workspace</Link><Link href="/artifacts/registry">Artifact Registry</Link><Link href="/artifacts/studio">Artifact Studio</Link></nav>
        <Badge tone={state.toLowerCase()}>{state.replaceAll("_", " ")}</Badge>
      </header>

      <section className="lifecycle-shell" aria-label="TA-14 institutional lifecycle">
        <div className="lifecycle-heading"><span>Institutional lifecycle</span><strong>Registration establishes the attributable governance identity that must exist before routes and execution artifacts can enter governed pathways.</strong></div>
        <div className="lifecycle-track">{EXCHANGE_LIFECYCLE.map((item, index) => <div className={cx("lifecycle-node", item.state)} key={item.label}><Link href={item.href}><span>{item.state === "complete" ? "✓" : String(index + 1).padStart(2, "0")}</span><b>{item.label}</b><small>{item.state === "current" ? "CURRENT STAGE" : item.state === "complete" ? "ESTABLISHED" : "UNLOCKS AFTER REGISTRATION"}</small></Link>{index < EXCHANGE_LIFECYCLE.length - 1 ? <i aria-hidden="true">→</i> : null}</div>)}</div>
      </section>

      <section className="hero">
        <div className="hero-copy"><p className="eyebrow">Guided institutional onboarding · 14 steps</p><h1>Declare it. Bound it. Evidence it. Register it.</h1><p className="hero-lede">A guided registration that teaches each requirement while preserving the institutional controls underneath. You only see what you need for the step you are completing.</p><div className="hero-actions"><button type="button" className="primary" onClick={() => goToStep("identity")}>Begin registration</button><Link className="secondary" href="/governance/registration-evidence-terms">Read Registration & Evidence Terms</Link></div></div>
        <div className="hero-core"><div className="institution-status"><span>REGISTRATION PROGRESS</span><strong>{completedCount} OF 14 STEPS COMPLETE</strong><small>{readiness}% of the participant intake satisfied</small></div><div className="readiness-ledger">{STEPS.slice(0,6).map((item) => <div className={cx("readiness-row", stepChecks[item.id] && "pass")} key={item.id}><span>{stepChecks[item.id] ? "✓" : "!"}</span><b>{item.title}</b><small>{stepChecks[item.id] ? "Satisfied" : "Not yet complete"}</small></div>)}</div><div className="core-rule"><b>Participant experience</b><strong>One governed step at a time.</strong><p>The 108 controls and review protocols remain available for institutional inspection without obstructing the registration intake.</p></div></div>
      </section>

      <section id="guided-registration" className="guided-shell">
        <div className="guided-progress"><div><div className="guided-progress-copy"><span>Step {currentIndex + 1} of 14</span><strong>{step === "submitted" ? "Submission receipt" : currentStep.title}</strong></div><div className="guided-progress-track"><div className="guided-progress-fill" style={{ width: `${step === "submitted" ? 100 : ((currentIndex + 1) / 14) * 100}%` }} /></div></div><Badge tone={ready ? "pass" : "review"}>{completedCount}/14 COMPLETE</Badge></div>
        <div className="quick-progress">{STEPS.map((item, index) => <button type="button" aria-label={`Go to step ${index + 1}: ${item.title}`} title={`Step ${index + 1}: ${item.title}`} className={cx(step === item.id && "active", stepChecks[item.id] && "complete")} key={item.id} onClick={() => goToStep(item.id)} />)}</div>

        <div className="preview-drawer"><button type="button" className="preview-toggle" onClick={() => setShowPreview((value) => !value)}><strong>{showPreview ? "Hide" : "Preview"} public registration record</strong><span>{candidateId}</span></button>{showPreview ? <Preview /> : null}</div>
        {notice ? <div className="notice"><span>Institutional notice</span><p>{notice}</p><button type="button" onClick={() => setNotice("")}>Dismiss</button></div> : null}

        {step === "identity" ? <StepFrame note="The Registry needs an attributable entity before it can preserve claims, evidence, or later versions against that identity." example="Public organization: Shango. Legal entity: the company or individual legally responsible for the registration."><div className="form-grid two"><Field label="Public organization name"><input value={draft.organizationName} onChange={(e) => patch("organizationName", e.target.value)} placeholder="Organization or governance entity name" /></Field><Field label="Legal entity name"><input value={draft.legalName} onChange={(e) => patch("legalName", e.target.value)} placeholder="Legal company, organization, or responsible individual" /></Field><Field label="Website"><input value={draft.website} onChange={(e) => patch("website", e.target.value)} placeholder="https://example.org" /></Field><Field label="Country of registration"><input value={draft.country} onChange={(e) => patch("country", e.target.value)} placeholder="United States" /></Field><Field label="Legal registration number" hint="Optional for an initial baseline; may be required before institutional approval."><input value={draft.registrationNumber} onChange={(e) => patch("registrationNumber", e.target.value)} /></Field></div><GateResult passed={stepChecks.identity} success="Entity identity is attributable enough to continue." failure="Public name, legal name, and country are required." /></StepFrame> : null}

        {step === "architecture" ? <StepFrame note="A governance entity can change over time. Naming and versioning the architecture prevents later work from silently rewriting the baseline." example="Architecture: Harmonic Constitutional Runtime · Version 1.0"><div className="form-grid two"><Field label="Architecture or governance system name"><input value={draft.architectureName} onChange={(e) => patch("architectureName", e.target.value)} /></Field><Field label="Version"><input value={draft.architectureVersion} onChange={(e) => patch("architectureVersion", e.target.value)} /></Field><Field label="Declared architecture hash" hint="Optional until a specific architecture package is frozen."><input value={draft.architectureHash} onChange={(e) => patch("architectureHash", e.target.value)} placeholder="sha256:..." /></Field></div><Field label="Architecture summary" hint="Minimum 80 characters. Describe the architecture in your own terms; TA-14 should not define it for you."><textarea rows={8} value={draft.architectureSummary} onChange={(e) => patch("architectureSummary", e.target.value)} /></Field><GateResult passed={stepChecks.architecture} success="Architecture identity and version are sufficiently described." failure="Name, version, and an 80-character architecture summary are required." /></StepFrame> : null}

        {step === "purpose" ? <StepFrame note="A capability claim means little without the intended purpose, intended user, and consequence boundary that give the claim context." example="Purpose: prevent an AI action from persisting unless the governed decision and receipt commit atomically."><Field label="Declared governance purpose"><textarea rows={6} value={draft.governancePurpose} onChange={(e) => patch("governancePurpose", e.target.value)} /></Field><Field label="Intended users"><input value={draft.intendedUsers} onChange={(e) => patch("intendedUsers", e.target.value)} placeholder="AI builders, regulated operators, reviewers..." /></Field><Field label="Consequence boundary" hint="What kind of consequential action, decision, or state change is this governance intended to control or preserve?"><textarea rows={5} value={draft.consequenceBoundary} onChange={(e) => patch("consequenceBoundary", e.target.value)} /></Field><GateResult passed={stepChecks.purpose} success="Purpose, users, and consequence boundary are declared." failure="Describe the purpose, intended users, and consequence boundary." /></StepFrame> : null}

        {step === "claims" ? <StepFrame note="Claims are the statements later evidence and review may support, qualify, or reject. Select only what the registered architecture actually claims today." example="A narrow claim is stronger than an inflated one: 'A governed decision and its evidence commit atomically.'"><div className="claim-grid">{draft.claims.map((claim) => <button type="button" key={claim.id} className={cx("claim-card", claim.selected && "selected")} onClick={() => toggleClaim(claim.id)}><span>{claim.selected ? "Selected" : "Add claim"}</span><strong>{claim.title}</strong><p>{claim.statement}</p><small>{claim.limit}</small></button>)}</div><GateResult passed={stepChecks.claims} success={`${selectedClaims.length} bounded capability claim${selectedClaims.length === 1 ? "" : "s"} selected.`} failure="Select at least one capability claim." /></StepFrame> : null}

        {step === "sectors" ? <StepFrame note="Sector scope prevents a governance claim from silently expanding into industries or operating environments that were never declared." example="A system may be registered for AI operations and legal operations without claiming healthcare applicability."><div className="selection-grid">{SECTORS.map((item) => <ToggleCard key={item} active={draft.sectors.includes(item)} title={item} description="Include this sector in the registered applicability boundary." onClick={() => toggleArray("sectors", item)} />)}</div><GateResult passed={stepChecks.sectors} success={`${draft.sectors.length} sector${draft.sectors.length === 1 ? "" : "s"} declared.`} failure="Select at least one sector." /></StepFrame> : null}

        {step === "jurisdictions" ? <StepFrame note="Jurisdiction is an applicability statement, not a grant of legal authority. Keep the distinction visible." example="Global / multi-jurisdiction may describe intended reach; it does not establish legal compliance in every jurisdiction."><div className="selection-grid compact">{JURISDICTIONS.map((item) => <ToggleCard key={item} active={draft.jurisdictions.includes(item)} title={item} description="Declare applicability; registration does not grant legal authority." onClick={() => toggleArray("jurisdictions", item)} />)}</div><GateResult passed={stepChecks.jurisdictions} success="Jurisdiction scope is declared." failure="Select at least one jurisdiction or private-domain scope." /></StepFrame> : null}

        {step === "determinations" ? <StepFrame note="Governance is not proven only by allowing action. HOLD, DENY, and ESCALATE are legitimate consequence controls when conditions are not admissible." example="Select only the decision effects the architecture actually supports today."><div className="determination-grid">{(["ALLOW","HOLD","DENY","ESCALATE"] as Determination[]).map((item) => <button type="button" key={item} className={cx("determination", item.toLowerCase(), draft.determinations.includes(item) && "active")} onClick={() => toggleDetermination(item)}><strong>{item}</strong><small>{item === "ALLOW" ? "Release exact committed scope" : item === "HOLD" ? "Pause pending repair or revalidation" : item === "DENY" ? "Block prohibited or invalid execution" : "Route to named authority"}</small></button>)}</div><GateResult passed={stepChecks.determinations} success="Supported decision effects are declared." failure="Select at least one supported determination." /></StepFrame> : null}

        {step === "owners" ? <StepFrame note="A public governance record needs a human or institutional steward who can answer for the declared baseline and later corrections." example="The accountable owner is the person authorized to stand behind the registration; additional stewards may be added."><div className="owner-list">{draft.owners.map((owner, index) => <article className="owner-card" key={owner.id}><div className="owner-number">{String(index + 1).padStart(2,"0")}</div><div className="form-grid two"><Field label="Name"><input value={owner.name} onChange={(e) => updateOwner(owner.id,"name",e.target.value)} /></Field><Field label="Email"><input type="email" value={owner.email} onChange={(e) => updateOwner(owner.id,"email",e.target.value)} /></Field><Field label="Institutional role"><input value={owner.role} onChange={(e) => updateOwner(owner.id,"role",e.target.value)} /></Field><label className="check-row"><input type="checkbox" checked={owner.accountable} onChange={(e) => updateOwner(owner.id,"accountable",e.target.checked)} /><span><b>Accountable owner</b><small>This person accepts responsibility for registration accuracy and prospective reliance.</small></span></label></div>{draft.owners.length > 1 ? <button type="button" className="danger-link" onClick={() => removeOwner(owner.id)}>Remove owner</button> : null}</article>)}</div><button type="button" className="secondary" onClick={addOwner}>Add governance steward</button><GateResult passed={stepChecks.owners} success="At least one accountable owner is attributable." failure="Provide a name and email for at least one accountable owner." /></StepFrame> : null}

        {step === "evidence" ? <StepFrame note="Registration preserves the entity's declared evidence surface without silently upgrading submitted material into independent proof." example="Outputs, receipts, conformance results, published documentation, demonstrations, test results, or public repositories can be named without surrendering closed internals."><Field label="Evidence summary"><textarea rows={7} value={draft.evidenceSummary} onChange={(e) => patch("evidenceSummary", e.target.value)} placeholder="Describe what evidence exists today and what it can support." /></Field><Field label="Evidence references" hint="Optional URLs, document names, repository references, receipt identifiers, or other attributable sources."><textarea rows={5} value={draft.evidenceReferences} onChange={(e) => patch("evidenceReferences", e.target.value)} /></Field><Field label="Evidence status"><select value={draft.evidenceStatus} onChange={(e) => patch("evidenceStatus", e.target.value)}><option value="DECLARED">Declared by registrant</option><option value="PUBLICLY_INSPECTABLE">Publicly inspectable</option><option value="REPRODUCIBLE">Reproducible by third party</option><option value="NOT_REPORTED">Not reported</option></select></Field><GateResult passed={stepChecks.evidence} success="The current evidence surface is described and bounded." failure="Provide an evidence summary and evidence status." /></StepFrame> : null}

        {step === "implementation" ? <StepFrame note="Architecture diagrams, test scaffolding, and shipped runtime mechanisms are not the same thing. This step preserves the implementation state without flattering blanks." example="Production runtime · prototype · test-only mechanism · designed but not implemented · mechanism not reported."><Field label="Current implementation state"><select value={draft.implementationState} onChange={(e) => patch("implementationState", e.target.value)}><option value="">Select current state</option><option value="PRODUCTION_RUNTIME">Production runtime</option><option value="CONTROLLED_PILOT">Controlled pilot</option><option value="PROTOTYPE">Prototype</option><option value="TEST_SCAFFOLDING">Test scaffolding</option><option value="DESIGNED_NOT_IMPLEMENTED">Designed, not implemented</option><option value="MECHANISM_NOT_REPORTED">Mechanism not reported</option></select></Field><Field label="Runtime / execution boundary" hint="Describe what is actually controlled at runtime and what remains outside the mechanism."><textarea rows={7} value={draft.runtimeBoundary} onChange={(e) => patch("runtimeBoundary", e.target.value)} /></Field><GateResult passed={stepChecks.implementation} success="Implementation state and runtime boundary are explicit." failure="Select the implementation state and describe the runtime boundary." /></StepFrame> : null}

        {step === "limits" ? <StepFrame note="A material limitation belongs with the claim it limits. Registration should preserve what the architecture cannot establish just as visibly as what it claims." example="The chain commits what reaches the gate; a write that bypasses the gate may remain absent and undetectable from inside the system."><Field label="Declared limitations"><textarea rows={7} value={draft.declaredLimits} onChange={(e) => patch("declaredLimits", e.target.value)} /></Field><Field label="Explicit non-claims"><textarea rows={6} value={draft.nonClaims} onChange={(e) => patch("nonClaims", e.target.value)} placeholder="What does this registration or architecture explicitly not claim?" /></Field><GateResult passed={stepChecks.limits} success="Limitations and non-claims are preserved as part of the baseline." failure="State both material limitations and explicit non-claims." /></StepFrame> : null}

        {step === "confidentiality" ? <StepFrame note="Registration should not require a closed implementation to become open. Public evidence and proprietary internals can have different disclosure boundaries." example="Public: receipts and conformance outputs. Closed: source code, private datasets, credentials, internal deployment topology."><Field label="Confidential evidence boundary"><textarea rows={6} value={draft.confidentialityBoundary} onChange={(e) => patch("confidentialityBoundary", e.target.value)} placeholder="What submitted or referenced material must remain confidential or restricted?" /></Field><Field label="Proprietary implementation boundary"><textarea rows={6} value={draft.proprietaryBoundary} onChange={(e) => patch("proprietaryBoundary", e.target.value)} placeholder="What source code, trade secrets, private data, or internals are outside the public record?" /></Field><GateResult passed={stepChecks.confidentiality} success="Public and closed information boundaries are distinguishable." failure="Describe both confidentiality and proprietary implementation boundaries." /></StepFrame> : null}

        {step === "publication" ? <StepFrame note="The participant should know what can become inspectable before submitting. Publication permission does not silently expand beyond the declared boundary." example="Public baseline may include identity, version, bounded claims, non-claims, limitations, evidence references, and stewardship while excluding closed evidence objects."><Field label="Publication permission"><select value={draft.publicationPermission} onChange={(e) => patch("publicationPermission", e.target.value)}><option value="PUBLIC_BASELINE">Public baseline record</option><option value="PUBLIC_WITH_RESTRICTED_EVIDENCE">Public baseline; evidence objects restricted</option><option value="REVIEW_BEFORE_PUBLICATION">Require publication review before public release</option></select></Field><Field label="Public registry summary" hint="Minimum 40 characters. Write the description you are comfortable having a third party read as the public baseline."><textarea rows={7} value={draft.publicSummary} onChange={(e) => patch("publicSummary", e.target.value)} /></Field><GateResult passed={stepChecks.publication} success="Publication boundary and public summary are declared." failure="Choose a publication boundary and provide a public summary." /></StepFrame> : null}

        {step === "review" ? <section className="guided-card"><div className="guided-head"><div className="guided-number">14</div><div><span>TA-14 guided governance registration</span><h2>Review and attestation</h2><p>Inspect the complete baseline before submission. Registration establishes attributable identity and chronology; it is not certification or a favorable finding.</p></div></div><div className="guided-body"><div className="review-summary"><article><small>Organization</small><strong>{draft.organizationName}</strong><p>{draft.legalName} · {draft.country}</p></article><article><small>Architecture</small><strong>{draft.architectureName}</strong><p>{draft.architectureVersion}</p></article><article className="wide"><small>Purpose</small><p>{draft.governancePurpose}</p></article><article><small>Claims</small><strong>{selectedClaims.length}</strong><p>{selectedClaims.map((c) => c.title).join(" · ")}</p></article><article><small>Scope</small><strong>{draft.sectors.length} sectors · {draft.jurisdictions.length} jurisdictions</strong><p>{draft.determinations.join(" · ")}</p></article><article className="wide"><small>Limitations</small><p>{draft.declaredLimits}</p></article><article className="wide"><small>Non-claims</small><p>{draft.nonClaims}</p></article><article><small>Implementation</small><strong>{draft.implementationState.replaceAll("_"," ")}</strong><p>{draft.runtimeBoundary}</p></article><article><small>Evidence status</small><strong>{draft.evidenceStatus.replaceAll("_"," ")}</strong><p>{draft.evidenceSummary}</p></article></div><div className="attestations"><label className="check-row"><input type="checkbox" checked={draft.acceptsTerms} onChange={(e) => patch("acceptsTerms",e.target.checked)} /><span><b>Registration & Evidence Terms</b><small>I accept the published operating terms governing registration, evidence, versioning, publication, correction, withdrawal, IP, and institutional recordkeeping.</small></span></label><label className="check-row"><input type="checkbox" checked={draft.attestsAccuracy} onChange={(e) => patch("attestsAccuracy",e.target.checked)} /><span><b>Accuracy attestation</b><small>I attest that the submitted information is complete and not materially misleading to the best of my knowledge.</small></span></label><label className="check-row"><input type="checkbox" checked={draft.attestsAuthority} onChange={(e) => patch("attestsAuthority",e.target.checked)} /><span><b>Authority attestation</b><small>I possess authority to submit this governance registration on behalf of the named entity.</small></span></label></div><GateResult passed={stepChecks.review && ready} success="All fourteen steps are complete and the package is ready to submit." failure="Complete every step and all three attestations before submission." /><div className="review-actions guided-submit"><button type="button" className="secondary" onClick={goBack}>← Back to Step 13</button><button type="button" className="secondary" onClick={() => downloadJson(`${slug(draft.organizationName || "governance")}-registration-candidate.json`, { candidate_id: candidateId, package_hash: packageHash, ...registrationPayload })}>Download candidate JSON</button><button type="button" className="primary" disabled={!ready} onClick={submit}>Freeze and submit for review</button></div></div></section> : null}

        {step === "submitted" ? <section className="panel stage-panel submitted-panel"><StageHeader number="✓" title="Submission receipt" text="The candidate package has been frozen locally and is ready for institutional intake." /><div className="seal"><span>TA-14</span><strong>Registration candidate preserved</strong><small>{candidateId}</small></div><div className="receipt-grid"><article><span>Candidate ID</span><strong>{candidateId}</strong></article><article><span>Package hash</span><code>{packageHash}</code></article><article><span>Organization</span><strong>{draft.organizationName || "Unassigned"}</strong></article><article><span>Architecture</span><strong>{draft.architectureName} {draft.architectureVersion}</strong></article><article><span>Status</span><strong>SUBMITTED</strong></article><article><span>Next state</span><strong>UNDER REVIEW</strong></article></div><div className="important"><b>Registration is not certification.</b><p>A permanent Governance Registration ID is issued only after institutional review. Artifact registry admission remains blocked until registration is active.</p></div><div className="review-actions"><button type="button" className="secondary" onClick={() => downloadJson(`${candidateId.toLowerCase()}-submission.json`, { candidate_id: candidateId, package_hash: packageHash, state: "SUBMITTED", submitted_at: new Date().toISOString(), registration: registrationPayload })}>Download submission receipt</button><Link className="primary" href="/governance/workspace">Open governance workspace</Link></div></section> : null}

        <details className="advanced-institutional">
          <summary>Institutional inspection layer <small>72-term glossary · 120 bounded review questions · 108 registration controls. This material remains available without obstructing the participant intake.</small></summary>
          <div className="advanced-content">
            <section className="panel glossary-panel"><div className="section-heading"><div><span>Institutional language</span><h2>Registration glossary</h2></div><Badge tone="neutral">{REGISTRATION_GLOSSARY.length} TERMS</Badge></div><div className="glossary-grid">{REGISTRATION_GLOSSARY.map((entry) => <article key={entry.id}><span>{entry.id}</span><strong>{entry.term}</strong><p>{entry.definition}</p></article>)}</div></section>
            <section className="panel questions-panel"><div className="section-heading"><div><span>Registration inspection protocol</span><h2>120 bounded review questions</h2></div><Badge tone={ready ? "pass" : "review"}>{ready ? "READY TO ANSWER" : "PREPARE EVIDENCE"}</Badge></div><div className="question-grid">{REVIEW_QUESTIONS.map((question) => <article className="question-card" key={question.id}><div><span>{question.id}</span><Badge tone="neutral">{question.area}</Badge></div><strong>{question.question}</strong><p>{question.guidance}</p></article>)}</div></section>
            <section className="panel controls-panel"><div className="section-heading"><div><span>Institutional control ledger</span><h2>108 registration controls</h2></div><select value={controlFilter} onChange={(event) => setControlFilter(event.target.value)}><option value="ALL">All controls</option><option value="PASS">Passing</option><option value="REVIEW">Review</option><option value="MISSING">Missing</option><option value="Identity">Identity</option><option value="Ownership">Ownership</option><option value="Architecture">Architecture</option><option value="Scope">Scope</option><option value="Authority">Authority</option><option value="Evidence">Evidence</option><option value="Route">Route</option><option value="Runtime">Runtime</option><option value="Outcome">Outcome</option><option value="Integrity">Integrity</option><option value="Disclosure">Disclosure</option><option value="Review">Review</option></select></div><div className="control-list">{visibleControls.map((control) => { const result = controlState(control); return <article key={control.id} className={cx("control-row", result.toLowerCase())}><span>{control.id}</span><Badge tone={result.toLowerCase()}>{result}</Badge><div><strong>{control.title}</strong><p>{control.requirement}</p></div><small>{control.area}</small></article>; })}</div></section>
          </div>
        </details>
      </section>

      <section className="after-registration"><div className="after-heading"><span>What happens after approval</span><h2>Registration is the beginning of the evidence lifecycle.</h2><p>Approval does not certify the governance. It establishes the attributable identity and active status required to build routes and register execution artifacts.</p></div><div className="after-track">{AFTER_REGISTRATION.map((item, index) => <article key={item.title}><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{item.title}</strong><p>{item.detail}</p></div></article>)}</div><div className="after-actions"><Link className="secondary" href="/governance/directory">Browse registered governances</Link><Link className="primary" href="/artifacts">Inspect execution artifacts</Link></div></section>
      <footer><div><strong>TA-14 AI Governance Exchange</strong><span>Governance Registration Center</span></div><p>No registered governance. No registered artifact.</p><nav><Link href="/">Exchange</Link><Link href="/governance/workspace">Workspace</Link><Link href="/artifacts/registry">Registry</Link></nav></footer>
      <style jsx global>{`
:root{color-scheme:dark;--bg:#030712;--panel:rgba(9,18,35,.82);--panel2:rgba(13,27,51,.92);--line:rgba(124,167,211,.2);--line2:rgba(77,209,255,.35);--text:#f5f8ff;--muted:#9fb0c5;--cyan:#4dd1ff;--cyan2:#1aa8e8;--gold:#e9c46a;--green:#53e3a6;--red:#ff6b7d;--orange:#ffb35c;--shadow:0 30px 90px rgba(0,0,0,.45)}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:#030712;color:var(--text);font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}.registration-page{position:relative;min-height:100vh;overflow:hidden;background:radial-gradient(circle at 50% -10%,rgba(30,120,190,.18),transparent 34%),linear-gradient(180deg,#02050c 0%,#07111f 50%,#030712 100%)}.grid-plane{position:fixed;inset:0;pointer-events:none;opacity:.16;background-image:linear-gradient(rgba(77,209,255,.1) 1px,transparent 1px),linear-gradient(90deg,rgba(77,209,255,.1) 1px,transparent 1px);background-size:48px 48px;mask-image:linear-gradient(to bottom,black,transparent 82%)}.ambient{position:fixed;width:520px;height:520px;border-radius:50%;filter:blur(100px);pointer-events:none;opacity:.17}.ambient-one{top:5%;left:-220px;background:#1362a2}.ambient-two{right:-240px;top:36%;background:#8e6e1e}.topbar{position:relative;z-index:10;display:flex;align-items:center;justify-content:space-between;gap:24px;max-width:1500px;margin:auto;padding:22px 38px;border-bottom:1px solid var(--line)}.brand{display:flex;align-items:center;gap:12px;color:inherit;text-decoration:none}.brand-mark{display:grid;place-items:center;width:44px;height:44px;border:1px solid rgba(233,196,106,.55);background:linear-gradient(145deg,rgba(233,196,106,.22),rgba(77,209,255,.08));color:var(--gold);font-weight:900}.brand b,.brand small{display:block}.brand small{margin-top:3px;color:var(--muted);font-size:11px;letter-spacing:.12em;text-transform:uppercase}.topbar nav{display:flex;gap:18px}.topbar nav a,footer a{color:var(--muted);text-decoration:none;font-size:13px}.topbar nav a:hover,footer a:hover{color:var(--cyan)}.badge{display:inline-flex;align-items:center;justify-content:center;padding:6px 10px;border:1px solid var(--line);border-radius:999px;font-size:10px;font-weight:900;letter-spacing:.12em;text-transform:uppercase;background:rgba(255,255,255,.04)}.badge-pass,.badge-ready,.badge-registered{color:var(--green);border-color:rgba(83,227,166,.4);background:rgba(83,227,166,.08)}.badge-review,.badge-under_review,.badge-submitted{color:var(--gold);border-color:rgba(233,196,106,.4);background:rgba(233,196,106,.08)}.badge-missing,.badge-returned{color:var(--red);border-color:rgba(255,107,125,.4);background:rgba(255,107,125,.08)}.badge-draft{color:var(--cyan)}.hero{position:relative;z-index:2;display:grid;grid-template-columns:minmax(0,1.3fr) minmax(320px,.7fr);gap:42px;max-width:1450px;margin:0 auto;padding:96px 42px 70px}.eyebrow{margin:0 0 18px;color:var(--gold);font-size:12px;font-weight:900;letter-spacing:.18em;text-transform:uppercase}.hero h1{max-width:920px;margin:0;font-family:Georgia,serif;font-size:clamp(48px,7vw,100px);line-height:.94;letter-spacing:-.055em}.hero-lede{max-width:790px;margin:28px 0 0;color:#bfd0e3;font-size:20px;line-height:1.65}.hero-actions,.review-actions{display:flex;flex-wrap:wrap;gap:12px;margin-top:30px}.primary,.secondary{display:inline-flex;align-items:center;justify-content:center;min-height:46px;padding:0 18px;border-radius:5px;border:1px solid var(--line2);font-size:13px;font-weight:900;text-decoration:none;cursor:pointer}.primary{background:linear-gradient(135deg,#21b8ed,#4dd1ff);color:#011018;box-shadow:0 15px 38px rgba(32,185,238,.22)}.primary:disabled{opacity:.35;cursor:not-allowed}.secondary{background:rgba(8,21,38,.82);color:#dce9f8}.hero-core{position:relative;display:grid;place-items:center;min-height:460px;border:1px solid var(--line);background:radial-gradient(circle at center,rgba(31,142,203,.18),transparent 58%),rgba(4,12,24,.72);box-shadow:inset 0 0 80px rgba(77,209,255,.05),var(--shadow)}.core-ring{display:grid;place-items:center;width:230px;height:230px;border-radius:50%;border:1px solid rgba(77,209,255,.46);box-shadow:0 0 0 24px rgba(77,209,255,.035),0 0 80px rgba(77,209,255,.16);background:radial-gradient(circle,rgba(77,209,255,.13),rgba(3,7,18,.92) 68%)}.core-ring span{font-size:54px;font-weight:200}.core-ring small{text-transform:uppercase;letter-spacing:.16em;color:var(--muted)}.core-rule{position:absolute;left:24px;right:24px;bottom:24px;padding:18px;border-left:3px solid var(--gold);background:rgba(3,7,18,.82)}.core-rule b,.core-rule strong{display:block}.core-rule b{color:var(--gold)}.core-rule strong{font-size:24px}.core-rule p{margin:8px 0 0;color:var(--muted)}.metric-strip{position:relative;z-index:3;display:grid;grid-template-columns:repeat(4,1fr);max-width:1450px;margin:0 auto 32px;border:1px solid var(--line);background:rgba(5,13,26,.88);box-shadow:var(--shadow)}.metric-strip article{padding:24px 26px;border-right:1px solid var(--line)}.metric-strip article:last-child{border-right:0}.metric-strip span,.metric-strip small{display:block;color:var(--muted);font-size:11px;text-transform:uppercase;letter-spacing:.12em}.metric-strip strong{display:block;margin:8px 0;font-size:27px}.workspace{position:relative;z-index:3;display:grid;grid-template-columns:330px minmax(0,1fr);gap:24px;max-width:1500px;margin:auto;padding:20px 30px 80px}.step-rail{position:sticky;top:18px;align-self:start;max-height:calc(100vh - 36px);overflow:auto;border:1px solid var(--line);background:rgba(5,13,26,.92);box-shadow:var(--shadow)}.rail-title{padding:22px;border-bottom:1px solid var(--line)}.rail-title span,.section-heading span{display:block;color:var(--gold);font-size:10px;font-weight:900;letter-spacing:.16em;text-transform:uppercase}.rail-title strong{display:block;margin-top:7px}.step-button{width:100%;display:grid;grid-template-columns:38px 1fr;text-align:left;gap:4px 10px;padding:18px 16px;border:0;border-bottom:1px solid var(--line);background:transparent;color:inherit;cursor:pointer}.step-button>span{grid-row:1/3;display:grid;place-items:center;width:34px;height:34px;border:1px solid var(--line);color:var(--muted)}.step-button b{font-size:13px}.step-button small{color:var(--muted);line-height:1.45}.step-button:hover,.step-button.active{background:rgba(77,209,255,.07)}.step-button.active>span{border-color:var(--cyan);color:var(--cyan)}.step-button.complete>span{color:var(--green);border-color:rgba(83,227,166,.42)}.rail-rule{margin:18px;padding:18px;border:1px solid rgba(233,196,106,.3);background:rgba(233,196,106,.05)}.rail-rule b{color:var(--gold)}.rail-rule p{color:var(--muted);line-height:1.55}.stage{min-width:0}.panel{border:1px solid var(--line);background:linear-gradient(155deg,rgba(11,24,45,.94),rgba(4,11,23,.94));box-shadow:var(--shadow)}.stage-panel{padding:34px}.stage-header{display:grid;grid-template-columns:64px 1fr;gap:18px;margin-bottom:30px}.stage-number{display:grid;place-items:center;width:58px;height:58px;border:1px solid rgba(233,196,106,.45);color:var(--gold);font-family:Georgia,serif;font-size:22px}.stage-header span{color:var(--cyan);font-size:11px;font-weight:900;letter-spacing:.16em;text-transform:uppercase}.stage-header h2{margin:5px 0 8px;font-family:Georgia,serif;font-size:38px}.stage-header p{margin:0;color:var(--muted);line-height:1.6}.form-grid{display:grid;gap:18px}.form-grid.two{grid-template-columns:repeat(2,minmax(0,1fr))}.field{display:block;margin-bottom:18px}.field-label{display:block;margin-bottom:8px;font-size:12px;font-weight:800}.field-hint{display:block;margin-top:7px;color:var(--muted);font-size:11px;line-height:1.5}input,textarea,select{width:100%;border:1px solid var(--line);border-radius:3px;background:rgba(1,7,15,.72);color:var(--text);padding:13px 14px;outline:none;font:inherit}input:focus,textarea:focus,select:focus{border-color:var(--cyan);box-shadow:0 0 0 3px rgba(77,209,255,.08)}textarea{resize:vertical}.gate-result{display:flex;align-items:center;gap:13px;margin-top:20px;padding:16px;border:1px solid rgba(255,107,125,.3);background:rgba(255,107,125,.05)}.gate-result.pass{border-color:rgba(83,227,166,.3);background:rgba(83,227,166,.05)}.gate-result>span{display:grid;place-items:center;width:34px;height:34px;border-radius:50%;background:rgba(255,255,255,.05)}.gate-result b{display:block}.gate-result small{display:block;margin-top:3px;color:var(--muted)}.architecture-chain{display:grid;grid-template-columns:repeat(8,1fr);gap:8px;margin:24px 0}.architecture-chain div{padding:14px 8px;border:1px solid var(--line);text-align:center;background:rgba(77,209,255,.035)}.architecture-chain span,.architecture-chain b{display:block}.architecture-chain span{color:var(--cyan);font-size:10px}.architecture-chain b{margin-top:5px;font-size:11px}.subhead{margin:30px 0 14px;font-family:Georgia,serif;font-size:24px}.selection-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}.selection-grid.compact{grid-template-columns:repeat(2,minmax(0,1fr))}.toggle-card{display:grid;grid-template-columns:34px 1fr;gap:12px;text-align:left;padding:16px;border:1px solid var(--line);background:rgba(1,7,15,.52);color:inherit;cursor:pointer}.toggle-card.active{border-color:rgba(77,209,255,.5);background:rgba(77,209,255,.08)}.toggle-check{display:grid;place-items:center;width:30px;height:30px;border:1px solid var(--line)}.toggle-card strong,.toggle-card small{display:block}.toggle-card small{margin-top:5px;color:var(--muted);line-height:1.4}.determination-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}.determination{padding:20px;border:1px solid var(--line);background:rgba(1,7,15,.55);color:inherit;text-align:left;cursor:pointer;opacity:.55}.determination.active{opacity:1;transform:translateY(-2px)}.determination strong,.determination small{display:block}.determination small{margin-top:8px;color:var(--muted);line-height:1.45}.determination.allow.active{border-color:rgba(83,227,166,.6);background:rgba(83,227,166,.07)}.determination.hold.active{border-color:rgba(255,179,92,.6);background:rgba(255,179,92,.07)}.determination.deny.active{border-color:rgba(255,107,125,.6);background:rgba(255,107,125,.07)}.determination.escalate.active{border-color:rgba(77,209,255,.6);background:rgba(77,209,255,.07)}.owner-list{display:grid;gap:14px;margin-bottom:18px}.owner-card{position:relative;display:grid;grid-template-columns:56px 1fr;gap:16px;padding:22px;border:1px solid var(--line);background:rgba(1,7,15,.45)}.owner-number{display:grid;place-items:center;width:48px;height:48px;border:1px solid var(--line);color:var(--cyan)}.check-row{display:flex;gap:12px;align-items:flex-start;padding:14px;border:1px solid var(--line);background:rgba(255,255,255,.02)}.check-row input{width:auto;margin-top:3px}.check-row b,.check-row small{display:block}.check-row small{margin-top:4px;color:var(--muted);line-height:1.45}.danger-link{position:absolute;right:18px;bottom:12px;border:0;background:transparent;color:var(--red);cursor:pointer}.claim-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin-bottom:24px}.claim-card{padding:20px;border:1px solid var(--line);background:rgba(1,7,15,.5);color:inherit;text-align:left;cursor:pointer}.claim-card.selected{border-color:rgba(233,196,106,.55);background:rgba(233,196,106,.06)}.claim-card span{color:var(--gold);font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:.14em}.claim-card strong{display:block;margin:9px 0;font-size:18px}.claim-card p,.claim-card small{color:var(--muted);line-height:1.55}.review-grid{display:grid;grid-template-columns:.8fr 1.2fr;gap:14px}.review-score,.candidate-card{padding:24px;border:1px solid var(--line);background:rgba(1,7,15,.5)}.score-ring{display:grid;place-items:center;width:130px;height:130px;margin-bottom:18px;border-radius:50%;border:8px solid rgba(77,209,255,.22);box-shadow:inset 0 0 35px rgba(77,209,255,.08)}.score-ring strong,.score-ring span{display:block}.score-ring strong{font-size:34px}.score-ring span{color:var(--muted);font-size:11px;text-transform:uppercase}.review-score h3{font-family:Georgia,serif;font-size:25px}.review-score p{color:var(--muted);line-height:1.6}.candidate-card span,.candidate-card small{display:block;color:var(--muted);font-size:11px;text-transform:uppercase;letter-spacing:.12em}.candidate-card strong{display:block;margin:10px 0 24px;font-size:21px;word-break:break-word}.candidate-card code,.receipt-grid code{display:block;color:var(--cyan);word-break:break-all;line-height:1.6}.checklist{display:grid;grid-template-columns:repeat(3,1fr);gap:9px;margin:18px 0}.check-item{display:grid;grid-template-columns:30px 1fr;gap:4px 9px;padding:14px;border:1px solid rgba(255,107,125,.24);background:rgba(255,107,125,.04)}.check-item.pass{border-color:rgba(83,227,166,.26);background:rgba(83,227,166,.04)}.check-item>span{grid-row:1/3}.check-item b{text-transform:capitalize}.check-item small{color:var(--muted)}.attestations{display:grid;gap:8px}.notice{display:grid;grid-template-columns:150px 1fr auto;gap:14px;align-items:center;margin-bottom:14px;padding:16px;border:1px solid rgba(233,196,106,.35);background:rgba(233,196,106,.07)}.notice span{color:var(--gold);font-size:10px;font-weight:900;text-transform:uppercase}.notice p{margin:0;color:#e4d9b6}.notice button{border:0;background:transparent;color:var(--muted);cursor:pointer}.submitted-panel{text-align:center}.submitted-panel .stage-header{text-align:left}.seal{display:grid;place-items:center;min-height:250px;margin:12px 0 24px;border:1px solid rgba(233,196,106,.42);background:radial-gradient(circle,rgba(233,196,106,.09),transparent 60%)}.seal span{display:grid;place-items:center;width:92px;height:92px;border:1px solid var(--gold);border-radius:50%;color:var(--gold);font-family:Georgia,serif;font-size:28px}.seal strong{font-family:Georgia,serif;font-size:30px}.seal small{color:var(--muted)}.receipt-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;text-align:left}.receipt-grid article{padding:18px;border:1px solid var(--line);background:rgba(1,7,15,.5)}.receipt-grid span,.receipt-grid strong{display:block}.receipt-grid span{color:var(--muted);font-size:10px;text-transform:uppercase;letter-spacing:.12em}.receipt-grid strong{margin-top:7px}.important{margin-top:18px;padding:20px;text-align:left;border-left:3px solid var(--gold);background:rgba(233,196,106,.06)}.important b{color:var(--gold)}.important p{margin-bottom:0;color:var(--muted);line-height:1.6}.controls-panel{margin-top:24px}.section-heading{display:flex;justify-content:space-between;align-items:end;gap:20px;padding:25px;border-bottom:1px solid var(--line)}.section-heading h2{margin:6px 0 0;font-family:Georgia,serif;font-size:30px}.section-heading select{width:240px}.control-list{max-height:680px;overflow:auto}.control-row{display:grid;grid-template-columns:76px 84px minmax(0,1fr) 120px;gap:12px;align-items:start;padding:16px 22px;border-bottom:1px solid var(--line)}.control-row>span{color:var(--cyan);font-family:monospace}.control-row strong{display:block}.control-row p{margin:5px 0 0;color:var(--muted);line-height:1.45}.control-row>small{text-align:right;color:var(--muted)}footer{position:relative;z-index:2;display:flex;justify-content:space-between;align-items:center;gap:24px;padding:32px 42px;border-top:1px solid var(--line);background:#02050c}footer strong,footer span{display:block}footer span,footer p{color:var(--muted)}footer nav{display:flex;gap:15px}.glossary-panel{margin-top:24px}.glossary-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));max-height:640px;overflow:auto}.glossary-grid article{padding:18px;border-right:1px solid var(--line);border-bottom:1px solid var(--line);background:rgba(255,255,255,.015)}.glossary-grid span{display:block;color:var(--cyan);font-family:monospace;font-size:10px}.glossary-grid strong{display:block;margin:8px 0}.glossary-grid p{margin:0;color:var(--muted);font-size:12px;line-height:1.55}.questions-panel{margin-top:24px}.question-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));max-height:720px;overflow:auto}.question-card{padding:20px;border-right:1px solid var(--line);border-bottom:1px solid var(--line);background:rgba(1,7,15,.35)}.question-card>div{display:flex;align-items:center;justify-content:space-between;gap:12px}.question-card>div>span{color:var(--cyan);font-family:monospace;font-size:12px}.question-card strong{display:block;margin:14px 0 8px;line-height:1.45}.question-card p{margin:0;color:var(--muted);line-height:1.55;font-size:12px}
.lifecycle-shell{position:relative;z-index:3;max-width:1500px;margin:22px auto 0;padding:0 30px}.lifecycle-heading{display:flex;align-items:flex-end;justify-content:space-between;gap:30px;margin-bottom:12px}.lifecycle-heading span{color:var(--gold);font-size:10px;font-weight:900;letter-spacing:.17em;text-transform:uppercase}.lifecycle-heading strong{max-width:760px;color:#b7c9dc;font-size:12px;line-height:1.55;text-align:right}.lifecycle-track{display:grid;grid-template-columns:repeat(8,minmax(0,1fr));border:1px solid var(--line);background:rgba(4,12,24,.86);box-shadow:var(--shadow)}.lifecycle-node{position:relative;min-width:0}.lifecycle-node>a{min-height:116px;display:flex;flex-direction:column;justify-content:center;padding:15px;border-right:1px solid var(--line);color:inherit;text-decoration:none}.lifecycle-node>a>span{display:grid;place-items:center;width:30px;height:30px;margin-bottom:10px;border:1px solid var(--line);color:var(--muted);font-size:9px}.lifecycle-node b{font-size:11px;line-height:1.35}.lifecycle-node small{margin-top:6px;color:#718399;font-size:7px;letter-spacing:.08em}.lifecycle-node i{position:absolute;right:-8px;top:49px;z-index:2;color:var(--gold);font-style:normal}.lifecycle-node.complete>a>span{color:var(--green);border-color:rgba(83,227,166,.45)}.lifecycle-node.current>a{background:linear-gradient(145deg,rgba(77,209,255,.14),rgba(233,196,106,.06));box-shadow:inset 0 -3px 0 var(--cyan)}.lifecycle-node.current>a>span{color:#02121b;border-color:var(--cyan);background:var(--cyan)}.lifecycle-node.current b{color:#dff7ff}.lifecycle-node.future{opacity:.64}.institution-status{width:100%;padding:22px 22px 16px;border-bottom:1px solid var(--line)}.institution-status span,.institution-status strong,.institution-status small{display:block}.institution-status span{color:var(--gold);font-size:9px;font-weight:900;letter-spacing:.16em}.institution-status strong{margin-top:8px;font-family:Georgia,serif;font-size:24px}.institution-status small{margin-top:5px;color:var(--muted)}.readiness-ledger{width:100%;display:grid;grid-template-columns:1fr 1fr;padding:18px 22px 118px;gap:8px}.readiness-row{display:grid;grid-template-columns:30px 1fr;gap:3px 9px;padding:11px;border:1px solid rgba(255,107,125,.22);background:rgba(255,107,125,.035)}.readiness-row>span{grid-row:1/3;display:grid;place-items:center;width:28px;height:28px;border:1px solid currentColor;color:var(--red)}.readiness-row b{font-size:11px}.readiness-row small{color:var(--muted);font-size:8px;line-height:1.35}.readiness-row.pass{border-color:rgba(83,227,166,.25);background:rgba(83,227,166,.04)}.readiness-row.pass>span{color:var(--green)}.public-preview-panel{margin-bottom:24px}.preview-head{display:flex;align-items:flex-start;justify-content:space-between;gap:24px;padding:28px;border-bottom:1px solid var(--line);background:radial-gradient(circle at 90% 0%,rgba(77,209,255,.11),transparent 34%)}.preview-head span{color:var(--gold);font-size:10px;font-weight:900;letter-spacing:.16em;text-transform:uppercase}.preview-head h2{margin:7px 0 8px;font-family:Georgia,serif;font-size:34px}.preview-head p{max-width:780px;margin:0;color:var(--muted);line-height:1.55}.preview-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr))}.preview-grid article{min-height:120px;padding:20px;border-right:1px solid var(--line);border-bottom:1px solid var(--line);background:rgba(1,7,15,.34)}.preview-grid small,.preview-grid strong,.preview-grid span{display:block}.preview-grid small{color:var(--cyan);font-size:8px;font-weight:900;letter-spacing:.13em;text-transform:uppercase}.preview-grid strong{margin-top:12px;font-size:15px;overflow-wrap:anywhere}.preview-grid span,.preview-grid p{margin:6px 0 0;color:var(--muted);font-size:11px;line-height:1.5}.preview-grid .preview-wide{grid-column:span 3;min-height:auto}.after-registration{position:relative;z-index:3;max-width:1440px;margin:10px auto 80px;padding:50px 42px;border:1px solid rgba(233,196,106,.25);background:radial-gradient(circle at 100% 0%,rgba(233,196,106,.12),transparent 30%),linear-gradient(155deg,rgba(11,24,45,.95),rgba(4,11,23,.96));box-shadow:var(--shadow)}.after-heading{display:grid;grid-template-columns:.7fr 1.3fr;gap:40px;align-items:end;margin-bottom:30px}.after-heading span{color:var(--gold);font-size:10px;font-weight:900;letter-spacing:.17em;text-transform:uppercase}.after-heading h2{margin:8px 0 0;font-family:Georgia,serif;font-size:42px}.after-heading p{margin:0;color:var(--muted);line-height:1.65}.after-track{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:8px}.after-track article{min-height:210px;padding:18px;border:1px solid var(--line);background:rgba(1,7,15,.45)}.after-track article>span{display:grid;place-items:center;width:34px;height:34px;border:1px solid rgba(77,209,255,.4);color:var(--cyan);font-size:9px}.after-track strong{display:block;margin-top:25px;font-size:13px;line-height:1.35}.after-track p{color:var(--muted);font-size:10px;line-height:1.55}.after-actions{display:flex;justify-content:flex-end;gap:10px;margin-top:24px}
@media(max-width:1100px){.lifecycle-track{grid-template-columns:repeat(4,1fr)}.lifecycle-node:nth-child(4n)>a{border-right:0}.preview-grid{grid-template-columns:repeat(2,1fr)}.preview-grid .preview-wide{grid-column:span 2}.after-track{grid-template-columns:repeat(2,1fr)}.after-heading{grid-template-columns:1fr}.readiness-ledger{grid-template-columns:1fr 1fr}.hero{grid-template-columns:1fr}.hero-core{min-height:390px}.workspace{grid-template-columns:1fr}.step-rail{position:relative;top:0;max-height:none;display:grid;grid-template-columns:repeat(2,1fr)}.rail-title,.rail-rule{grid-column:1/-1}.metric-strip{grid-template-columns:repeat(2,1fr)}.selection-grid{grid-template-columns:repeat(2,1fr)}.determination-grid{grid-template-columns:repeat(2,1fr)}.architecture-chain{grid-template-columns:repeat(4,1fr)}}@media(max-width:720px){.lifecycle-shell{padding:0 14px}.lifecycle-heading{display:block}.lifecycle-heading strong{display:block;margin-top:8px;text-align:left}.lifecycle-track{grid-template-columns:1fr 1fr}.lifecycle-node i{display:none}.lifecycle-node>a{min-height:100px}.readiness-ledger{grid-template-columns:1fr;padding-bottom:130px}.preview-head{display:block}.preview-head .badge{margin-top:14px}.preview-grid{grid-template-columns:1fr}.preview-grid .preview-wide{grid-column:auto}.after-registration{margin:10px 14px 60px;padding:32px 20px}.after-track{grid-template-columns:1fr}.after-actions{justify-content:stretch;flex-direction:column}.topbar{padding:18px}.topbar nav{display:none}.hero{padding:60px 20px 40px}.hero h1{font-size:52px}.hero-lede{font-size:17px}.metric-strip{margin:0 18px 24px;grid-template-columns:1fr}.metric-strip article{border-right:0;border-bottom:1px solid var(--line)}.workspace{padding:12px 14px 60px}.step-rail{display:block}.stage-panel{padding:22px}.form-grid.two,.selection-grid,.selection-grid.compact,.claim-grid,.review-grid,.receipt-grid,.checklist,.question-grid,.glossary-grid{grid-template-columns:1fr}.determination-grid{grid-template-columns:1fr}.architecture-chain{grid-template-columns:repeat(2,1fr)}.owner-card{grid-template-columns:1fr}.control-row{grid-template-columns:64px 80px 1fr}.control-row>small{display:none}.section-heading{align-items:stretch;flex-direction:column}.section-heading select{width:100%}.notice{grid-template-columns:1fr}.hero-core{min-height:430px}footer{align-items:flex-start;flex-direction:column}}

/* Guided 14-step participant experience */
.guided-shell{position:relative;z-index:3;max-width:1240px;margin:0 auto;padding:28px 30px 90px}
.guided-progress{display:grid;grid-template-columns:1fr auto;gap:18px;align-items:center;margin-bottom:16px;padding:18px 20px;border:1px solid var(--line);background:rgba(5,13,26,.9);box-shadow:var(--shadow)}
.guided-progress-track{height:8px;border-radius:999px;background:rgba(255,255,255,.06);overflow:hidden}.guided-progress-fill{height:100%;background:linear-gradient(90deg,var(--cyan2),var(--cyan));transition:width .25s ease}
.guided-progress-copy span,.guided-progress-copy strong{display:block}.guided-progress-copy span{color:var(--gold);font-size:10px;font-weight:900;letter-spacing:.16em;text-transform:uppercase}.guided-progress-copy strong{margin-top:5px;font-size:14px}
.guided-card{border:1px solid var(--line);background:linear-gradient(155deg,rgba(11,24,45,.96),rgba(4,11,23,.96));box-shadow:var(--shadow);overflow:hidden}
.guided-head{display:grid;grid-template-columns:76px 1fr;gap:20px;padding:30px 32px;border-bottom:1px solid var(--line);background:radial-gradient(circle at 100% 0%,rgba(77,209,255,.1),transparent 34%)}
.guided-number{display:grid;place-items:center;width:68px;height:68px;border:1px solid rgba(233,196,106,.5);color:var(--gold);font:700 24px Georgia,serif}.guided-head span{color:var(--cyan);font-size:10px;font-weight:900;letter-spacing:.16em;text-transform:uppercase}.guided-head h2{margin:6px 0 8px;font:700 38px Georgia,serif}.guided-head p{margin:0;max-width:820px;color:var(--muted);line-height:1.6}
.guided-body{padding:32px}.guide-note{margin:0 0 24px;padding:18px 20px;border-left:3px solid var(--gold);background:rgba(233,196,106,.055)}.guide-note b{display:block;color:var(--gold)}.guide-note p{margin:7px 0 0;color:var(--muted);line-height:1.6}.example-box{margin:18px 0;padding:16px;border:1px dashed rgba(77,209,255,.35);background:rgba(77,209,255,.035)}.example-box b{color:var(--cyan)}.example-box p{margin:6px 0 0;color:var(--muted);line-height:1.55}
.guided-actions{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:22px 32px;border-top:1px solid var(--line);background:rgba(1,7,15,.45)}.guided-actions-left,.guided-actions-right{display:flex;gap:10px;align-items:center}.step-status{font-size:11px;color:var(--muted)}.step-status.pass{color:var(--green)}
.quick-progress{display:grid;grid-template-columns:repeat(14,1fr);gap:5px;margin:0 0 18px}.quick-progress button{height:8px;border:0;border-radius:999px;background:rgba(255,255,255,.08);cursor:pointer;padding:0}.quick-progress button.active{background:var(--cyan)}.quick-progress button.complete{background:var(--green)}
.preview-drawer{margin-bottom:18px}.preview-toggle{width:100%;display:flex;justify-content:space-between;align-items:center;padding:16px 18px;border:1px solid var(--line);background:rgba(5,13,26,.9);color:inherit;cursor:pointer}.preview-toggle strong{font-size:13px}.preview-toggle span{color:var(--muted);font-size:11px}.preview-drawer .preview-grid{border:1px solid var(--line);border-top:0;background:rgba(1,7,15,.45)}
.advanced-institutional{margin-top:28px;border:1px solid var(--line);background:rgba(5,13,26,.7)}.advanced-institutional>summary{cursor:pointer;padding:20px 22px;font-weight:900;color:#dce9f8}.advanced-institutional>summary small{display:block;margin-top:5px;color:var(--muted);font-weight:400}.advanced-content{padding:0 20px 20px}.advanced-content .panel{margin-top:18px}
.review-summary{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-bottom:22px}.review-summary article{padding:16px;border:1px solid var(--line);background:rgba(1,7,15,.45)}.review-summary small,.review-summary strong,.review-summary p{display:block}.review-summary small{color:var(--cyan);font-size:9px;text-transform:uppercase;letter-spacing:.13em}.review-summary strong{margin-top:8px}.review-summary p{margin:8px 0 0;color:var(--muted);line-height:1.5;white-space:pre-wrap}.review-summary .wide{grid-column:span 2}.guided-submit{margin-top:22px}.required-mark{color:var(--gold)}
@media(max-width:800px){.guided-shell{padding:18px 14px 60px}.guided-head{grid-template-columns:1fr;padding:24px 20px}.guided-number{width:54px;height:54px}.guided-head h2{font-size:31px}.guided-body{padding:22px 20px}.guided-actions{padding:18px 20px;align-items:stretch;flex-direction:column}.guided-actions-left,.guided-actions-right{width:100%}.guided-actions button{flex:1}.quick-progress{gap:3px}.review-summary{grid-template-columns:1fr}.review-summary .wide{grid-column:auto}.guided-progress{grid-template-columns:1fr}.form-grid.two{grid-template-columns:1fr}}

      `}</style>
    </main>
  );
}

function StageHeader({ number, title, text }: { number: string; title: string; text: string }) { return <div className="stage-header"><div className="stage-number">{number}</div><div><span>Governance registration stage</span><h2>{title}</h2><p>{text}</p></div></div>; }
function GateResult({ passed, success, failure }: { passed: boolean; success: string; failure: string }) { return <div className={cx("gate-result", passed && "pass")}><span>{passed ? "✓" : "!"}</span><div><b>{passed ? "Condition satisfied" : "Condition unresolved"}</b><small>{passed ? success : failure}</small></div></div>; }
