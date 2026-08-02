"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";

type Determination = "ALLOW" | "HOLD" | "DENY" | "ESCALATE";
type StageId = "intake" | "governance" | "canonical" | "integrity" | "verification" | "disclosure" | "attestation" | "publication";
type CheckState = "PASS" | "FAIL" | "REVIEW";
type SubmissionState = "DRAFT" | "READY_FOR_REVIEW" | "SUBMITTED" | "REGISTERED" | "REJECTED";
type DisclosureMode = "PUBLIC" | "SELECTIVE" | "RESTRICTED" | "WITHHELD";

type ArtifactCandidate = {
  artifactId: string;
  title: string;
  seriesId: string;
  sequence: number;
  classification: "DEMONSTRATION" | "PRODUCTION";
  determination: Determination;
  governanceRegistrationId: string;
  organizationName: string;
  architectureName: string;
  architectureVersion: string;
  routeId: string;
  routeVersion: string;
  sector: string;
  jurisdiction: string;
  proposedAction: string;
  consequence: string;
  evidenceCount: number;
  authorityCount: number;
  gateCount: number;
  executionReceiptId: string;
  executionEffect: string;
  outcome: string;
  canonicalHash: string;
  packageHash: string;
  verificationLevel: number;
  disclosureMode: DisclosureMode;
  claimsBoundary: string;
};

type RegistrationCheck = {
  id: string;
  label: string;
  state: CheckState;
  detail: string;
  blocking: boolean;
};

type RegistrationControl = {
  id: string;
  area: string;
  title: string;
  requirement: string;
  severity: "BLOCKING" | "REVIEW";
};

type ReviewQuestion = { id: string; area: string; prompt: string };

const STUDIO_STORAGE_KEY = "ta14.execution-artifact-studio.v2";
const REGISTRATION_STORAGE_KEY = "ta14.execution-artifact-registration.v1";
const REGISTRY_CANDIDATE_KEY = "ta14.execution-artifact-registry-candidate.v1";

const STAGES: Array<{ id: StageId; number: string; title: string; description: string }> = [
  { id: "intake", number: "01", title: "Artifact intake", description: "Import the completed Studio record and identify the exact bounded artifact." },
  { id: "governance", number: "02", title: "Governance eligibility", description: "Confirm an active registered AI governance owns and submits the artifact." },
  { id: "canonical", number: "03", title: "Canonical validation", description: "Validate required domains, route parity, determinations, receipts, and outcome closure." },
  { id: "integrity", number: "04", title: "Integrity package", description: "Inspect canonical, component, receipt, PDF, manifest, and package commitments." },
  { id: "verification", number: "05", title: "Verification", description: "Record earned verification levels and reliance limits without implying certification." },
  { id: "disclosure", number: "06", title: "Disclosure projection", description: "Preview the approved public or restricted projection and every redaction rationale." },
  { id: "attestation", number: "07", title: "Attestation", description: "Bind accountable publisher and reviewer statements to the exact submission digest." },
  { id: "publication", number: "08", title: "Registry submission", description: "Create a registry candidate, publication receipt, stable identity, and review package." },
];

const AREAS = ["IDENTITY","GOVERNANCE","ROUTE","EVIDENCE","AUTHORITY","CONTINUITY","DETERMINATION","EXECUTION","OUTCOME","INTEGRITY","DISCLOSURE","VERIFICATION","SIGNATURE","REGISTRY"] as const;

const REGISTRATION_CONTROLS: RegistrationControl[] = [
  {
    id: "ARC-001",
    area: "IDENTITY",
    title: "Identity registration control 001",
    requirement: "Confirm the artifact, governance registration, accountable owner, and submitting steward remain attributable.",
    severity: "BLOCKING",
  },
  {
    id: "ARC-002",
    area: "GOVERNANCE",
    title: "Governance registration control 002",
    requirement: "Confirm the submitting governance is registered, active, in scope, and bound to the declared architecture version.",
    severity: "REVIEW",
  },
  {
    id: "ARC-003",
    area: "ROUTE",
    title: "Route registration control 003",
    requirement: "Confirm the frozen route, route receipt, jurisdiction, sector, and determination correspond to the submitted artifact.",
    severity: "REVIEW",
  },
  {
    id: "ARC-004",
    area: "EVIDENCE",
    title: "Evidence registration control 004",
    requirement: "Confirm admitted evidence is attributable, current, preserved, disclosure-classified, and sufficient for the claim.",
    severity: "REVIEW",
  },
  {
    id: "ARC-005",
    area: "AUTHORITY",
    title: "Authority registration control 005",
    requirement: "Confirm every actor has valid authority for the exact action, scope, review, attestation, and publication step.",
    severity: "BLOCKING",
  },
  {
    id: "ARC-006",
    area: "CONTINUITY",
    title: "Continuity registration control 006",
    requirement: "Confirm identity, provenance, custody, route version, evidence state, and authority remain connected through submission.",
    severity: "BLOCKING",
  },
  {
    id: "ARC-007",
    area: "DETERMINATION",
    title: "Determination registration control 007",
    requirement: "Confirm ALLOW, HOLD, DENY, or ESCALATE matches the gate ledger, reason codes, and technical execution effect.",
    severity: "REVIEW",
  },
  {
    id: "ARC-008",
    area: "EXECUTION",
    title: "Execution registration control 008",
    requirement: "Confirm the technical receipt proves the determination changed what the system could do.",
    severity: "REVIEW",
  },
  {
    id: "ARC-009",
    area: "OUTCOME",
    title: "Outcome registration control 009",
    requirement: "Confirm the actual consequence state, zero-action state, closure evidence, residual risk, and follow-up are preserved.",
    severity: "REVIEW",
  },
  {
    id: "ARC-010",
    area: "INTEGRITY",
    title: "Integrity registration control 010",
    requirement: "Confirm canonical, component, PDF, manifest, receipt, route, and package hashes are complete and mutually consistent.",
    severity: "BLOCKING",
  },
  {
    id: "ARC-011",
    area: "DISCLOSURE",
    title: "Disclosure registration control 011",
    requirement: "Confirm the public projection protects restricted information while preserving verifiable commitments and claims limits.",
    severity: "BLOCKING",
  },
  {
    id: "ARC-012",
    area: "VERIFICATION",
    title: "Verification registration control 012",
    requirement: "Confirm verification levels are earned, bounded, attributable, and do not imply certification.",
    severity: "REVIEW",
  },
  {
    id: "ARC-013",
    area: "SIGNATURE",
    title: "Signature registration control 013",
    requirement: "Confirm publisher and reviewer attestations bind exact digests, roles, timestamps, expirations, and revocation states.",
    severity: "REVIEW",
  },
  {
    id: "ARC-014",
    area: "REGISTRY",
    title: "Registry registration control 014",
    requirement: "Confirm duplicate prevention, stable identifiers, publication state, challenge path, and supersession rules are satisfied.",
    severity: "REVIEW",
  },
  {
    id: "ARC-015",
    area: "IDENTITY",
    title: "Identity registration control 015",
    requirement: "Confirm the artifact, governance registration, accountable owner, and submitting steward remain attributable.",
    severity: "BLOCKING",
  },
  {
    id: "ARC-016",
    area: "GOVERNANCE",
    title: "Governance registration control 016",
    requirement: "Confirm the submitting governance is registered, active, in scope, and bound to the declared architecture version.",
    severity: "BLOCKING",
  },
  {
    id: "ARC-017",
    area: "ROUTE",
    title: "Route registration control 017",
    requirement: "Confirm the frozen route, route receipt, jurisdiction, sector, and determination correspond to the submitted artifact.",
    severity: "REVIEW",
  },
  {
    id: "ARC-018",
    area: "EVIDENCE",
    title: "Evidence registration control 018",
    requirement: "Confirm admitted evidence is attributable, current, preserved, disclosure-classified, and sufficient for the claim.",
    severity: "REVIEW",
  },
  {
    id: "ARC-019",
    area: "AUTHORITY",
    title: "Authority registration control 019",
    requirement: "Confirm every actor has valid authority for the exact action, scope, review, attestation, and publication step.",
    severity: "REVIEW",
  },
  {
    id: "ARC-020",
    area: "CONTINUITY",
    title: "Continuity registration control 020",
    requirement: "Confirm identity, provenance, custody, route version, evidence state, and authority remain connected through submission.",
    severity: "BLOCKING",
  },
  {
    id: "ARC-021",
    area: "DETERMINATION",
    title: "Determination registration control 021",
    requirement: "Confirm ALLOW, HOLD, DENY, or ESCALATE matches the gate ledger, reason codes, and technical execution effect.",
    severity: "BLOCKING",
  },
  {
    id: "ARC-022",
    area: "EXECUTION",
    title: "Execution registration control 022",
    requirement: "Confirm the technical receipt proves the determination changed what the system could do.",
    severity: "REVIEW",
  },
  {
    id: "ARC-023",
    area: "OUTCOME",
    title: "Outcome registration control 023",
    requirement: "Confirm the actual consequence state, zero-action state, closure evidence, residual risk, and follow-up are preserved.",
    severity: "REVIEW",
  },
  {
    id: "ARC-024",
    area: "INTEGRITY",
    title: "Integrity registration control 024",
    requirement: "Confirm canonical, component, PDF, manifest, receipt, route, and package hashes are complete and mutually consistent.",
    severity: "REVIEW",
  },
  {
    id: "ARC-025",
    area: "DISCLOSURE",
    title: "Disclosure registration control 025",
    requirement: "Confirm the public projection protects restricted information while preserving verifiable commitments and claims limits.",
    severity: "BLOCKING",
  },
  {
    id: "ARC-026",
    area: "VERIFICATION",
    title: "Verification registration control 026",
    requirement: "Confirm verification levels are earned, bounded, attributable, and do not imply certification.",
    severity: "BLOCKING",
  },
  {
    id: "ARC-027",
    area: "SIGNATURE",
    title: "Signature registration control 027",
    requirement: "Confirm publisher and reviewer attestations bind exact digests, roles, timestamps, expirations, and revocation states.",
    severity: "REVIEW",
  },
  {
    id: "ARC-028",
    area: "REGISTRY",
    title: "Registry registration control 028",
    requirement: "Confirm duplicate prevention, stable identifiers, publication state, challenge path, and supersession rules are satisfied.",
    severity: "REVIEW",
  },
  {
    id: "ARC-029",
    area: "IDENTITY",
    title: "Identity registration control 029",
    requirement: "Confirm the artifact, governance registration, accountable owner, and submitting steward remain attributable.",
    severity: "REVIEW",
  },
  {
    id: "ARC-030",
    area: "GOVERNANCE",
    title: "Governance registration control 030",
    requirement: "Confirm the submitting governance is registered, active, in scope, and bound to the declared architecture version.",
    severity: "BLOCKING",
  },
  {
    id: "ARC-031",
    area: "ROUTE",
    title: "Route registration control 031",
    requirement: "Confirm the frozen route, route receipt, jurisdiction, sector, and determination correspond to the submitted artifact.",
    severity: "BLOCKING",
  },
  {
    id: "ARC-032",
    area: "EVIDENCE",
    title: "Evidence registration control 032",
    requirement: "Confirm admitted evidence is attributable, current, preserved, disclosure-classified, and sufficient for the claim.",
    severity: "REVIEW",
  },
  {
    id: "ARC-033",
    area: "AUTHORITY",
    title: "Authority registration control 033",
    requirement: "Confirm every actor has valid authority for the exact action, scope, review, attestation, and publication step.",
    severity: "REVIEW",
  },
  {
    id: "ARC-034",
    area: "CONTINUITY",
    title: "Continuity registration control 034",
    requirement: "Confirm identity, provenance, custody, route version, evidence state, and authority remain connected through submission.",
    severity: "REVIEW",
  },
  {
    id: "ARC-035",
    area: "DETERMINATION",
    title: "Determination registration control 035",
    requirement: "Confirm ALLOW, HOLD, DENY, or ESCALATE matches the gate ledger, reason codes, and technical execution effect.",
    severity: "BLOCKING",
  },
  {
    id: "ARC-036",
    area: "EXECUTION",
    title: "Execution registration control 036",
    requirement: "Confirm the technical receipt proves the determination changed what the system could do.",
    severity: "BLOCKING",
  },
  {
    id: "ARC-037",
    area: "OUTCOME",
    title: "Outcome registration control 037",
    requirement: "Confirm the actual consequence state, zero-action state, closure evidence, residual risk, and follow-up are preserved.",
    severity: "REVIEW",
  },
  {
    id: "ARC-038",
    area: "INTEGRITY",
    title: "Integrity registration control 038",
    requirement: "Confirm canonical, component, PDF, manifest, receipt, route, and package hashes are complete and mutually consistent.",
    severity: "REVIEW",
  },
  {
    id: "ARC-039",
    area: "DISCLOSURE",
    title: "Disclosure registration control 039",
    requirement: "Confirm the public projection protects restricted information while preserving verifiable commitments and claims limits.",
    severity: "REVIEW",
  },
  {
    id: "ARC-040",
    area: "VERIFICATION",
    title: "Verification registration control 040",
    requirement: "Confirm verification levels are earned, bounded, attributable, and do not imply certification.",
    severity: "BLOCKING",
  },
  {
    id: "ARC-041",
    area: "SIGNATURE",
    title: "Signature registration control 041",
    requirement: "Confirm publisher and reviewer attestations bind exact digests, roles, timestamps, expirations, and revocation states.",
    severity: "BLOCKING",
  },
  {
    id: "ARC-042",
    area: "REGISTRY",
    title: "Registry registration control 042",
    requirement: "Confirm duplicate prevention, stable identifiers, publication state, challenge path, and supersession rules are satisfied.",
    severity: "REVIEW",
  },
  {
    id: "ARC-043",
    area: "IDENTITY",
    title: "Identity registration control 043",
    requirement: "Confirm the artifact, governance registration, accountable owner, and submitting steward remain attributable.",
    severity: "REVIEW",
  },
  {
    id: "ARC-044",
    area: "GOVERNANCE",
    title: "Governance registration control 044",
    requirement: "Confirm the submitting governance is registered, active, in scope, and bound to the declared architecture version.",
    severity: "REVIEW",
  },
  {
    id: "ARC-045",
    area: "ROUTE",
    title: "Route registration control 045",
    requirement: "Confirm the frozen route, route receipt, jurisdiction, sector, and determination correspond to the submitted artifact.",
    severity: "BLOCKING",
  },
  {
    id: "ARC-046",
    area: "EVIDENCE",
    title: "Evidence registration control 046",
    requirement: "Confirm admitted evidence is attributable, current, preserved, disclosure-classified, and sufficient for the claim.",
    severity: "BLOCKING",
  },
  {
    id: "ARC-047",
    area: "AUTHORITY",
    title: "Authority registration control 047",
    requirement: "Confirm every actor has valid authority for the exact action, scope, review, attestation, and publication step.",
    severity: "REVIEW",
  },
  {
    id: "ARC-048",
    area: "CONTINUITY",
    title: "Continuity registration control 048",
    requirement: "Confirm identity, provenance, custody, route version, evidence state, and authority remain connected through submission.",
    severity: "REVIEW",
  },
  {
    id: "ARC-049",
    area: "DETERMINATION",
    title: "Determination registration control 049",
    requirement: "Confirm ALLOW, HOLD, DENY, or ESCALATE matches the gate ledger, reason codes, and technical execution effect.",
    severity: "REVIEW",
  },
  {
    id: "ARC-050",
    area: "EXECUTION",
    title: "Execution registration control 050",
    requirement: "Confirm the technical receipt proves the determination changed what the system could do.",
    severity: "BLOCKING",
  },
  {
    id: "ARC-051",
    area: "OUTCOME",
    title: "Outcome registration control 051",
    requirement: "Confirm the actual consequence state, zero-action state, closure evidence, residual risk, and follow-up are preserved.",
    severity: "BLOCKING",
  },
  {
    id: "ARC-052",
    area: "INTEGRITY",
    title: "Integrity registration control 052",
    requirement: "Confirm canonical, component, PDF, manifest, receipt, route, and package hashes are complete and mutually consistent.",
    severity: "REVIEW",
  },
  {
    id: "ARC-053",
    area: "DISCLOSURE",
    title: "Disclosure registration control 053",
    requirement: "Confirm the public projection protects restricted information while preserving verifiable commitments and claims limits.",
    severity: "REVIEW",
  },
  {
    id: "ARC-054",
    area: "VERIFICATION",
    title: "Verification registration control 054",
    requirement: "Confirm verification levels are earned, bounded, attributable, and do not imply certification.",
    severity: "REVIEW",
  },
  {
    id: "ARC-055",
    area: "SIGNATURE",
    title: "Signature registration control 055",
    requirement: "Confirm publisher and reviewer attestations bind exact digests, roles, timestamps, expirations, and revocation states.",
    severity: "BLOCKING",
  },
  {
    id: "ARC-056",
    area: "REGISTRY",
    title: "Registry registration control 056",
    requirement: "Confirm duplicate prevention, stable identifiers, publication state, challenge path, and supersession rules are satisfied.",
    severity: "BLOCKING",
  },
  {
    id: "ARC-057",
    area: "IDENTITY",
    title: "Identity registration control 057",
    requirement: "Confirm the artifact, governance registration, accountable owner, and submitting steward remain attributable.",
    severity: "REVIEW",
  },
  {
    id: "ARC-058",
    area: "GOVERNANCE",
    title: "Governance registration control 058",
    requirement: "Confirm the submitting governance is registered, active, in scope, and bound to the declared architecture version.",
    severity: "REVIEW",
  },
  {
    id: "ARC-059",
    area: "ROUTE",
    title: "Route registration control 059",
    requirement: "Confirm the frozen route, route receipt, jurisdiction, sector, and determination correspond to the submitted artifact.",
    severity: "REVIEW",
  },
  {
    id: "ARC-060",
    area: "EVIDENCE",
    title: "Evidence registration control 060",
    requirement: "Confirm admitted evidence is attributable, current, preserved, disclosure-classified, and sufficient for the claim.",
    severity: "BLOCKING",
  },
  {
    id: "ARC-061",
    area: "AUTHORITY",
    title: "Authority registration control 061",
    requirement: "Confirm every actor has valid authority for the exact action, scope, review, attestation, and publication step.",
    severity: "BLOCKING",
  },
  {
    id: "ARC-062",
    area: "CONTINUITY",
    title: "Continuity registration control 062",
    requirement: "Confirm identity, provenance, custody, route version, evidence state, and authority remain connected through submission.",
    severity: "REVIEW",
  },
  {
    id: "ARC-063",
    area: "DETERMINATION",
    title: "Determination registration control 063",
    requirement: "Confirm ALLOW, HOLD, DENY, or ESCALATE matches the gate ledger, reason codes, and technical execution effect.",
    severity: "REVIEW",
  },
  {
    id: "ARC-064",
    area: "EXECUTION",
    title: "Execution registration control 064",
    requirement: "Confirm the technical receipt proves the determination changed what the system could do.",
    severity: "REVIEW",
  },
  {
    id: "ARC-065",
    area: "OUTCOME",
    title: "Outcome registration control 065",
    requirement: "Confirm the actual consequence state, zero-action state, closure evidence, residual risk, and follow-up are preserved.",
    severity: "BLOCKING",
  },
  {
    id: "ARC-066",
    area: "INTEGRITY",
    title: "Integrity registration control 066",
    requirement: "Confirm canonical, component, PDF, manifest, receipt, route, and package hashes are complete and mutually consistent.",
    severity: "BLOCKING",
  },
  {
    id: "ARC-067",
    area: "DISCLOSURE",
    title: "Disclosure registration control 067",
    requirement: "Confirm the public projection protects restricted information while preserving verifiable commitments and claims limits.",
    severity: "REVIEW",
  },
  {
    id: "ARC-068",
    area: "VERIFICATION",
    title: "Verification registration control 068",
    requirement: "Confirm verification levels are earned, bounded, attributable, and do not imply certification.",
    severity: "REVIEW",
  },
  {
    id: "ARC-069",
    area: "SIGNATURE",
    title: "Signature registration control 069",
    requirement: "Confirm publisher and reviewer attestations bind exact digests, roles, timestamps, expirations, and revocation states.",
    severity: "REVIEW",
  },
  {
    id: "ARC-070",
    area: "REGISTRY",
    title: "Registry registration control 070",
    requirement: "Confirm duplicate prevention, stable identifiers, publication state, challenge path, and supersession rules are satisfied.",
    severity: "BLOCKING",
  },
  {
    id: "ARC-071",
    area: "IDENTITY",
    title: "Identity registration control 071",
    requirement: "Confirm the artifact, governance registration, accountable owner, and submitting steward remain attributable.",
    severity: "BLOCKING",
  },
  {
    id: "ARC-072",
    area: "GOVERNANCE",
    title: "Governance registration control 072",
    requirement: "Confirm the submitting governance is registered, active, in scope, and bound to the declared architecture version.",
    severity: "REVIEW",
  },
  {
    id: "ARC-073",
    area: "ROUTE",
    title: "Route registration control 073",
    requirement: "Confirm the frozen route, route receipt, jurisdiction, sector, and determination correspond to the submitted artifact.",
    severity: "REVIEW",
  },
  {
    id: "ARC-074",
    area: "EVIDENCE",
    title: "Evidence registration control 074",
    requirement: "Confirm admitted evidence is attributable, current, preserved, disclosure-classified, and sufficient for the claim.",
    severity: "REVIEW",
  },
  {
    id: "ARC-075",
    area: "AUTHORITY",
    title: "Authority registration control 075",
    requirement: "Confirm every actor has valid authority for the exact action, scope, review, attestation, and publication step.",
    severity: "BLOCKING",
  },
  {
    id: "ARC-076",
    area: "CONTINUITY",
    title: "Continuity registration control 076",
    requirement: "Confirm identity, provenance, custody, route version, evidence state, and authority remain connected through submission.",
    severity: "BLOCKING",
  },
  {
    id: "ARC-077",
    area: "DETERMINATION",
    title: "Determination registration control 077",
    requirement: "Confirm ALLOW, HOLD, DENY, or ESCALATE matches the gate ledger, reason codes, and technical execution effect.",
    severity: "REVIEW",
  },
  {
    id: "ARC-078",
    area: "EXECUTION",
    title: "Execution registration control 078",
    requirement: "Confirm the technical receipt proves the determination changed what the system could do.",
    severity: "REVIEW",
  },
  {
    id: "ARC-079",
    area: "OUTCOME",
    title: "Outcome registration control 079",
    requirement: "Confirm the actual consequence state, zero-action state, closure evidence, residual risk, and follow-up are preserved.",
    severity: "REVIEW",
  },
  {
    id: "ARC-080",
    area: "INTEGRITY",
    title: "Integrity registration control 080",
    requirement: "Confirm canonical, component, PDF, manifest, receipt, route, and package hashes are complete and mutually consistent.",
    severity: "BLOCKING",
  },
  {
    id: "ARC-081",
    area: "DISCLOSURE",
    title: "Disclosure registration control 081",
    requirement: "Confirm the public projection protects restricted information while preserving verifiable commitments and claims limits.",
    severity: "BLOCKING",
  },
  {
    id: "ARC-082",
    area: "VERIFICATION",
    title: "Verification registration control 082",
    requirement: "Confirm verification levels are earned, bounded, attributable, and do not imply certification.",
    severity: "REVIEW",
  },
  {
    id: "ARC-083",
    area: "SIGNATURE",
    title: "Signature registration control 083",
    requirement: "Confirm publisher and reviewer attestations bind exact digests, roles, timestamps, expirations, and revocation states.",
    severity: "REVIEW",
  },
  {
    id: "ARC-084",
    area: "REGISTRY",
    title: "Registry registration control 084",
    requirement: "Confirm duplicate prevention, stable identifiers, publication state, challenge path, and supersession rules are satisfied.",
    severity: "REVIEW",
  },
  {
    id: "ARC-085",
    area: "IDENTITY",
    title: "Identity registration control 085",
    requirement: "Confirm the artifact, governance registration, accountable owner, and submitting steward remain attributable.",
    severity: "BLOCKING",
  },
  {
    id: "ARC-086",
    area: "GOVERNANCE",
    title: "Governance registration control 086",
    requirement: "Confirm the submitting governance is registered, active, in scope, and bound to the declared architecture version.",
    severity: "BLOCKING",
  },
  {
    id: "ARC-087",
    area: "ROUTE",
    title: "Route registration control 087",
    requirement: "Confirm the frozen route, route receipt, jurisdiction, sector, and determination correspond to the submitted artifact.",
    severity: "REVIEW",
  },
  {
    id: "ARC-088",
    area: "EVIDENCE",
    title: "Evidence registration control 088",
    requirement: "Confirm admitted evidence is attributable, current, preserved, disclosure-classified, and sufficient for the claim.",
    severity: "REVIEW",
  },
  {
    id: "ARC-089",
    area: "AUTHORITY",
    title: "Authority registration control 089",
    requirement: "Confirm every actor has valid authority for the exact action, scope, review, attestation, and publication step.",
    severity: "REVIEW",
  },
  {
    id: "ARC-090",
    area: "CONTINUITY",
    title: "Continuity registration control 090",
    requirement: "Confirm identity, provenance, custody, route version, evidence state, and authority remain connected through submission.",
    severity: "BLOCKING",
  },
  {
    id: "ARC-091",
    area: "DETERMINATION",
    title: "Determination registration control 091",
    requirement: "Confirm ALLOW, HOLD, DENY, or ESCALATE matches the gate ledger, reason codes, and technical execution effect.",
    severity: "BLOCKING",
  },
  {
    id: "ARC-092",
    area: "EXECUTION",
    title: "Execution registration control 092",
    requirement: "Confirm the technical receipt proves the determination changed what the system could do.",
    severity: "REVIEW",
  },
  {
    id: "ARC-093",
    area: "OUTCOME",
    title: "Outcome registration control 093",
    requirement: "Confirm the actual consequence state, zero-action state, closure evidence, residual risk, and follow-up are preserved.",
    severity: "REVIEW",
  },
  {
    id: "ARC-094",
    area: "INTEGRITY",
    title: "Integrity registration control 094",
    requirement: "Confirm canonical, component, PDF, manifest, receipt, route, and package hashes are complete and mutually consistent.",
    severity: "REVIEW",
  },
  {
    id: "ARC-095",
    area: "DISCLOSURE",
    title: "Disclosure registration control 095",
    requirement: "Confirm the public projection protects restricted information while preserving verifiable commitments and claims limits.",
    severity: "BLOCKING",
  },
  {
    id: "ARC-096",
    area: "VERIFICATION",
    title: "Verification registration control 096",
    requirement: "Confirm verification levels are earned, bounded, attributable, and do not imply certification.",
    severity: "BLOCKING",
  },
  {
    id: "ARC-097",
    area: "SIGNATURE",
    title: "Signature registration control 097",
    requirement: "Confirm publisher and reviewer attestations bind exact digests, roles, timestamps, expirations, and revocation states.",
    severity: "REVIEW",
  },
  {
    id: "ARC-098",
    area: "REGISTRY",
    title: "Registry registration control 098",
    requirement: "Confirm duplicate prevention, stable identifiers, publication state, challenge path, and supersession rules are satisfied.",
    severity: "REVIEW",
  },
  {
    id: "ARC-099",
    area: "IDENTITY",
    title: "Identity registration control 099",
    requirement: "Confirm the artifact, governance registration, accountable owner, and submitting steward remain attributable.",
    severity: "REVIEW",
  },
  {
    id: "ARC-100",
    area: "GOVERNANCE",
    title: "Governance registration control 100",
    requirement: "Confirm the submitting governance is registered, active, in scope, and bound to the declared architecture version.",
    severity: "BLOCKING",
  },
  {
    id: "ARC-101",
    area: "ROUTE",
    title: "Route registration control 101",
    requirement: "Confirm the frozen route, route receipt, jurisdiction, sector, and determination correspond to the submitted artifact.",
    severity: "BLOCKING",
  },
  {
    id: "ARC-102",
    area: "EVIDENCE",
    title: "Evidence registration control 102",
    requirement: "Confirm admitted evidence is attributable, current, preserved, disclosure-classified, and sufficient for the claim.",
    severity: "REVIEW",
  },
  {
    id: "ARC-103",
    area: "AUTHORITY",
    title: "Authority registration control 103",
    requirement: "Confirm every actor has valid authority for the exact action, scope, review, attestation, and publication step.",
    severity: "REVIEW",
  },
  {
    id: "ARC-104",
    area: "CONTINUITY",
    title: "Continuity registration control 104",
    requirement: "Confirm identity, provenance, custody, route version, evidence state, and authority remain connected through submission.",
    severity: "REVIEW",
  },
  {
    id: "ARC-105",
    area: "DETERMINATION",
    title: "Determination registration control 105",
    requirement: "Confirm ALLOW, HOLD, DENY, or ESCALATE matches the gate ledger, reason codes, and technical execution effect.",
    severity: "BLOCKING",
  },
  {
    id: "ARC-106",
    area: "EXECUTION",
    title: "Execution registration control 106",
    requirement: "Confirm the technical receipt proves the determination changed what the system could do.",
    severity: "BLOCKING",
  },
  {
    id: "ARC-107",
    area: "OUTCOME",
    title: "Outcome registration control 107",
    requirement: "Confirm the actual consequence state, zero-action state, closure evidence, residual risk, and follow-up are preserved.",
    severity: "REVIEW",
  },
  {
    id: "ARC-108",
    area: "INTEGRITY",
    title: "Integrity registration control 108",
    requirement: "Confirm canonical, component, PDF, manifest, receipt, route, and package hashes are complete and mutually consistent.",
    severity: "REVIEW",
  },
  {
    id: "ARC-109",
    area: "DISCLOSURE",
    title: "Disclosure registration control 109",
    requirement: "Confirm the public projection protects restricted information while preserving verifiable commitments and claims limits.",
    severity: "REVIEW",
  },
  {
    id: "ARC-110",
    area: "VERIFICATION",
    title: "Verification registration control 110",
    requirement: "Confirm verification levels are earned, bounded, attributable, and do not imply certification.",
    severity: "BLOCKING",
  },
  {
    id: "ARC-111",
    area: "SIGNATURE",
    title: "Signature registration control 111",
    requirement: "Confirm publisher and reviewer attestations bind exact digests, roles, timestamps, expirations, and revocation states.",
    severity: "BLOCKING",
  },
  {
    id: "ARC-112",
    area: "REGISTRY",
    title: "Registry registration control 112",
    requirement: "Confirm duplicate prevention, stable identifiers, publication state, challenge path, and supersession rules are satisfied.",
    severity: "REVIEW",
  },
  {
    id: "ARC-113",
    area: "IDENTITY",
    title: "Identity registration control 113",
    requirement: "Confirm the artifact, governance registration, accountable owner, and submitting steward remain attributable.",
    severity: "REVIEW",
  },
  {
    id: "ARC-114",
    area: "GOVERNANCE",
    title: "Governance registration control 114",
    requirement: "Confirm the submitting governance is registered, active, in scope, and bound to the declared architecture version.",
    severity: "REVIEW",
  },
  {
    id: "ARC-115",
    area: "ROUTE",
    title: "Route registration control 115",
    requirement: "Confirm the frozen route, route receipt, jurisdiction, sector, and determination correspond to the submitted artifact.",
    severity: "BLOCKING",
  },
  {
    id: "ARC-116",
    area: "EVIDENCE",
    title: "Evidence registration control 116",
    requirement: "Confirm admitted evidence is attributable, current, preserved, disclosure-classified, and sufficient for the claim.",
    severity: "BLOCKING",
  },
  {
    id: "ARC-117",
    area: "AUTHORITY",
    title: "Authority registration control 117",
    requirement: "Confirm every actor has valid authority for the exact action, scope, review, attestation, and publication step.",
    severity: "REVIEW",
  },
  {
    id: "ARC-118",
    area: "CONTINUITY",
    title: "Continuity registration control 118",
    requirement: "Confirm identity, provenance, custody, route version, evidence state, and authority remain connected through submission.",
    severity: "REVIEW",
  },
  {
    id: "ARC-119",
    area: "DETERMINATION",
    title: "Determination registration control 119",
    requirement: "Confirm ALLOW, HOLD, DENY, or ESCALATE matches the gate ledger, reason codes, and technical execution effect.",
    severity: "REVIEW",
  },
  {
    id: "ARC-120",
    area: "EXECUTION",
    title: "Execution registration control 120",
    requirement: "Confirm the technical receipt proves the determination changed what the system could do.",
    severity: "BLOCKING",
  },
];

const REVIEW_QUESTIONS: ReviewQuestion[] = [
  {
    id: "RQ-001",
    area: "EVIDENCE",
    prompt: "What preserved record proves that admitted evidence is current, preserved, and sufficient?",
  },
  {
    id: "RQ-002",
    area: "AUTHORITY",
    prompt: "What preserved record proves that authority is valid for the exact submission and publication scope?",
  },
  {
    id: "RQ-003",
    area: "CONTINUITY",
    prompt: "What preserved record proves that identity, provenance, custody, and state remain connected?",
  },
  {
    id: "RQ-004",
    area: "DETERMINATION",
    prompt: "What preserved record proves that the determination follows from the gate ledger and reason codes?",
  },
  {
    id: "RQ-005",
    area: "EXECUTION",
    prompt: "What preserved record proves that the technical receipt proves the determination controlled execution?",
  },
  {
    id: "RQ-006",
    area: "OUTCOME",
    prompt: "What preserved record proves that the actual or zero-action outcome is independently supportable?",
  },
  {
    id: "RQ-007",
    area: "INTEGRITY",
    prompt: "What preserved record proves that all component hashes resolve to the same package root?",
  },
  {
    id: "RQ-008",
    area: "DISCLOSURE",
    prompt: "What preserved record proves that the projection preserves proof without exposing protected content?",
  },
  {
    id: "RQ-009",
    area: "VERIFICATION",
    prompt: "What preserved record proves that the declared verification level is earned and bounded?",
  },
  {
    id: "RQ-010",
    area: "SIGNATURE",
    prompt: "What preserved record proves that attestations bind exact digests and accountable roles?",
  },
  {
    id: "RQ-011",
    area: "REGISTRY",
    prompt: "What preserved record proves that the candidate is unique and eligible for append-only publication?",
  },
  {
    id: "RQ-012",
    area: "IDENTITY",
    prompt: "What preserved record proves that the artifact and submitting governance remain attributable?",
  },
  {
    id: "RQ-013",
    area: "GOVERNANCE",
    prompt: "What preserved record proves that the submitting governance is registered and active?",
  },
  {
    id: "RQ-014",
    area: "ROUTE",
    prompt: "What preserved record proves that the frozen route and route version correspond to the artifact?",
  },
  {
    id: "RQ-015",
    area: "EVIDENCE",
    prompt: "What preserved record proves that admitted evidence is current, preserved, and sufficient?",
  },
  {
    id: "RQ-016",
    area: "AUTHORITY",
    prompt: "What preserved record proves that authority is valid for the exact submission and publication scope?",
  },
  {
    id: "RQ-017",
    area: "CONTINUITY",
    prompt: "What preserved record proves that identity, provenance, custody, and state remain connected?",
  },
  {
    id: "RQ-018",
    area: "DETERMINATION",
    prompt: "What preserved record proves that the determination follows from the gate ledger and reason codes?",
  },
  {
    id: "RQ-019",
    area: "EXECUTION",
    prompt: "What preserved record proves that the technical receipt proves the determination controlled execution?",
  },
  {
    id: "RQ-020",
    area: "OUTCOME",
    prompt: "What preserved record proves that the actual or zero-action outcome is independently supportable?",
  },
  {
    id: "RQ-021",
    area: "INTEGRITY",
    prompt: "What preserved record proves that all component hashes resolve to the same package root?",
  },
  {
    id: "RQ-022",
    area: "DISCLOSURE",
    prompt: "What preserved record proves that the projection preserves proof without exposing protected content?",
  },
  {
    id: "RQ-023",
    area: "VERIFICATION",
    prompt: "What preserved record proves that the declared verification level is earned and bounded?",
  },
  {
    id: "RQ-024",
    area: "SIGNATURE",
    prompt: "What preserved record proves that attestations bind exact digests and accountable roles?",
  },
  {
    id: "RQ-025",
    area: "REGISTRY",
    prompt: "What preserved record proves that the candidate is unique and eligible for append-only publication?",
  },
  {
    id: "RQ-026",
    area: "IDENTITY",
    prompt: "What preserved record proves that the artifact and submitting governance remain attributable?",
  },
  {
    id: "RQ-027",
    area: "GOVERNANCE",
    prompt: "What preserved record proves that the submitting governance is registered and active?",
  },
  {
    id: "RQ-028",
    area: "ROUTE",
    prompt: "What preserved record proves that the frozen route and route version correspond to the artifact?",
  },
  {
    id: "RQ-029",
    area: "EVIDENCE",
    prompt: "What preserved record proves that admitted evidence is current, preserved, and sufficient?",
  },
  {
    id: "RQ-030",
    area: "AUTHORITY",
    prompt: "What preserved record proves that authority is valid for the exact submission and publication scope?",
  },
  {
    id: "RQ-031",
    area: "CONTINUITY",
    prompt: "What preserved record proves that identity, provenance, custody, and state remain connected?",
  },
  {
    id: "RQ-032",
    area: "DETERMINATION",
    prompt: "What preserved record proves that the determination follows from the gate ledger and reason codes?",
  },
  {
    id: "RQ-033",
    area: "EXECUTION",
    prompt: "What preserved record proves that the technical receipt proves the determination controlled execution?",
  },
  {
    id: "RQ-034",
    area: "OUTCOME",
    prompt: "What preserved record proves that the actual or zero-action outcome is independently supportable?",
  },
  {
    id: "RQ-035",
    area: "INTEGRITY",
    prompt: "What preserved record proves that all component hashes resolve to the same package root?",
  },
  {
    id: "RQ-036",
    area: "DISCLOSURE",
    prompt: "What preserved record proves that the projection preserves proof without exposing protected content?",
  },
  {
    id: "RQ-037",
    area: "VERIFICATION",
    prompt: "What preserved record proves that the declared verification level is earned and bounded?",
  },
  {
    id: "RQ-038",
    area: "SIGNATURE",
    prompt: "What preserved record proves that attestations bind exact digests and accountable roles?",
  },
  {
    id: "RQ-039",
    area: "REGISTRY",
    prompt: "What preserved record proves that the candidate is unique and eligible for append-only publication?",
  },
  {
    id: "RQ-040",
    area: "IDENTITY",
    prompt: "What preserved record proves that the artifact and submitting governance remain attributable?",
  },
  {
    id: "RQ-041",
    area: "GOVERNANCE",
    prompt: "What preserved record proves that the submitting governance is registered and active?",
  },
  {
    id: "RQ-042",
    area: "ROUTE",
    prompt: "What preserved record proves that the frozen route and route version correspond to the artifact?",
  },
  {
    id: "RQ-043",
    area: "EVIDENCE",
    prompt: "What preserved record proves that admitted evidence is current, preserved, and sufficient?",
  },
  {
    id: "RQ-044",
    area: "AUTHORITY",
    prompt: "What preserved record proves that authority is valid for the exact submission and publication scope?",
  },
  {
    id: "RQ-045",
    area: "CONTINUITY",
    prompt: "What preserved record proves that identity, provenance, custody, and state remain connected?",
  },
  {
    id: "RQ-046",
    area: "DETERMINATION",
    prompt: "What preserved record proves that the determination follows from the gate ledger and reason codes?",
  },
  {
    id: "RQ-047",
    area: "EXECUTION",
    prompt: "What preserved record proves that the technical receipt proves the determination controlled execution?",
  },
  {
    id: "RQ-048",
    area: "OUTCOME",
    prompt: "What preserved record proves that the actual or zero-action outcome is independently supportable?",
  },
  {
    id: "RQ-049",
    area: "INTEGRITY",
    prompt: "What preserved record proves that all component hashes resolve to the same package root?",
  },
  {
    id: "RQ-050",
    area: "DISCLOSURE",
    prompt: "What preserved record proves that the projection preserves proof without exposing protected content?",
  },
  {
    id: "RQ-051",
    area: "VERIFICATION",
    prompt: "What preserved record proves that the declared verification level is earned and bounded?",
  },
  {
    id: "RQ-052",
    area: "SIGNATURE",
    prompt: "What preserved record proves that attestations bind exact digests and accountable roles?",
  },
  {
    id: "RQ-053",
    area: "REGISTRY",
    prompt: "What preserved record proves that the candidate is unique and eligible for append-only publication?",
  },
  {
    id: "RQ-054",
    area: "IDENTITY",
    prompt: "What preserved record proves that the artifact and submitting governance remain attributable?",
  },
  {
    id: "RQ-055",
    area: "GOVERNANCE",
    prompt: "What preserved record proves that the submitting governance is registered and active?",
  },
  {
    id: "RQ-056",
    area: "ROUTE",
    prompt: "What preserved record proves that the frozen route and route version correspond to the artifact?",
  },
  {
    id: "RQ-057",
    area: "EVIDENCE",
    prompt: "What preserved record proves that admitted evidence is current, preserved, and sufficient?",
  },
  {
    id: "RQ-058",
    area: "AUTHORITY",
    prompt: "What preserved record proves that authority is valid for the exact submission and publication scope?",
  },
  {
    id: "RQ-059",
    area: "CONTINUITY",
    prompt: "What preserved record proves that identity, provenance, custody, and state remain connected?",
  },
  {
    id: "RQ-060",
    area: "DETERMINATION",
    prompt: "What preserved record proves that the determination follows from the gate ledger and reason codes?",
  },
  {
    id: "RQ-061",
    area: "EXECUTION",
    prompt: "What preserved record proves that the technical receipt proves the determination controlled execution?",
  },
  {
    id: "RQ-062",
    area: "OUTCOME",
    prompt: "What preserved record proves that the actual or zero-action outcome is independently supportable?",
  },
  {
    id: "RQ-063",
    area: "INTEGRITY",
    prompt: "What preserved record proves that all component hashes resolve to the same package root?",
  },
  {
    id: "RQ-064",
    area: "DISCLOSURE",
    prompt: "What preserved record proves that the projection preserves proof without exposing protected content?",
  },
  {
    id: "RQ-065",
    area: "VERIFICATION",
    prompt: "What preserved record proves that the declared verification level is earned and bounded?",
  },
  {
    id: "RQ-066",
    area: "SIGNATURE",
    prompt: "What preserved record proves that attestations bind exact digests and accountable roles?",
  },
  {
    id: "RQ-067",
    area: "REGISTRY",
    prompt: "What preserved record proves that the candidate is unique and eligible for append-only publication?",
  },
  {
    id: "RQ-068",
    area: "IDENTITY",
    prompt: "What preserved record proves that the artifact and submitting governance remain attributable?",
  },
  {
    id: "RQ-069",
    area: "GOVERNANCE",
    prompt: "What preserved record proves that the submitting governance is registered and active?",
  },
  {
    id: "RQ-070",
    area: "ROUTE",
    prompt: "What preserved record proves that the frozen route and route version correspond to the artifact?",
  },
  {
    id: "RQ-071",
    area: "EVIDENCE",
    prompt: "What preserved record proves that admitted evidence is current, preserved, and sufficient?",
  },
  {
    id: "RQ-072",
    area: "AUTHORITY",
    prompt: "What preserved record proves that authority is valid for the exact submission and publication scope?",
  },
  {
    id: "RQ-073",
    area: "CONTINUITY",
    prompt: "What preserved record proves that identity, provenance, custody, and state remain connected?",
  },
  {
    id: "RQ-074",
    area: "DETERMINATION",
    prompt: "What preserved record proves that the determination follows from the gate ledger and reason codes?",
  },
  {
    id: "RQ-075",
    area: "EXECUTION",
    prompt: "What preserved record proves that the technical receipt proves the determination controlled execution?",
  },
  {
    id: "RQ-076",
    area: "OUTCOME",
    prompt: "What preserved record proves that the actual or zero-action outcome is independently supportable?",
  },
  {
    id: "RQ-077",
    area: "INTEGRITY",
    prompt: "What preserved record proves that all component hashes resolve to the same package root?",
  },
  {
    id: "RQ-078",
    area: "DISCLOSURE",
    prompt: "What preserved record proves that the projection preserves proof without exposing protected content?",
  },
  {
    id: "RQ-079",
    area: "VERIFICATION",
    prompt: "What preserved record proves that the declared verification level is earned and bounded?",
  },
  {
    id: "RQ-080",
    area: "SIGNATURE",
    prompt: "What preserved record proves that attestations bind exact digests and accountable roles?",
  },
];

const DEFAULT_CANDIDATE: ArtifactCandidate = {
  artifactId: "TA14-EA-CANDIDATE-000013",
  title: "Untitled execution artifact candidate",
  seriesId: "TA14-FOUNDING-SERIES-B",
  sequence: 13,
  classification: "DEMONSTRATION",
  determination: "HOLD",
  governanceRegistrationId: "",
  organizationName: "",
  architectureName: "",
  architectureVersion: "",
  routeId: "",
  routeVersion: "",
  sector: "",
  jurisdiction: "",
  proposedAction: "",
  consequence: "",
  evidenceCount: 0,
  authorityCount: 0,
  gateCount: 0,
  executionReceiptId: "",
  executionEffect: "",
  outcome: "",
  canonicalHash: "",
  packageHash: "",
  verificationLevel: 0,
  disclosureMode: "PUBLIC",
  claimsBoundary: "This candidate has not yet completed registry admission and may not be relied upon as a registered artifact.",
};

function asObject(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
}
function asArray(value: unknown): unknown[] { return Array.isArray(value) ? value : []; }
function asString(value: unknown, fallback = ""): string { return typeof value === "string" ? value : fallback; }
function asNumber(value: unknown, fallback = 0): number { return typeof value === "number" && Number.isFinite(value) ? value : fallback; }
function safeParse(raw: string | null): unknown { if (!raw) return null; try { return JSON.parse(raw); } catch { return null; } }
function shortHash(source: string): string {
  let a = 2166136261;
  let b = 2246822519;
  for (let index = 0; index < source.length; index += 1) {
    const code = source.charCodeAt(index);
    a ^= code;
    a = Math.imul(a, 16777619);
    b ^= code + index;
    b = Math.imul(b, 3266489917);
  }
  const part = (value: number) => (value >>> 0).toString(16).padStart(8, "0");
  return `${part(a)}${part(b)}${part(a ^ b)}${part(Math.imul(a, b))}`;
}
function candidateId(candidate: ArtifactCandidate): string {
  return `REG-CAND-${candidate.governanceRegistrationId || "UNBOUND"}-${candidate.sequence.toString().padStart(6, "0")}`;
}
function fromStudio(raw: unknown): ArtifactCandidate | null {
  const root = asObject(raw);
  if (!Object.keys(root).length) return null;
  const governance = asObject(root.governance);
  const scenario = asObject(root.scenario);
  const route = asObject(root.route);
  const execution = asObject(root.execution);
  const outcome = asObject(root.outcome);
  const integrity = asObject(root.integrity);
  const determinationRaw = asString(root.determination, "HOLD");
  const determination: Determination = ["ALLOW", "HOLD", "DENY", "ESCALATE"].includes(determinationRaw) ? determinationRaw as Determination : "HOLD";
  return {
    artifactId: asString(root.artifactId, asString(integrity.artifactId, `TA14-EA-CANDIDATE-${Date.now()}`)),
    title: asString(scenario.title, "Execution artifact candidate"),
    seriesId: asString(scenario.seriesId, "TA14-ARTIFACT-SERIES"),
    sequence: asNumber(scenario.sequence, 1),
    classification: asString(scenario.classification).includes("PRODUCTION") ? "PRODUCTION" : "DEMONSTRATION",
    determination,
    governanceRegistrationId: asString(governance.registrationId),
    organizationName: asString(governance.organizationName),
    architectureName: asString(governance.architectureName),
    architectureVersion: asString(governance.architectureVersion),
    routeId: asString(route.routeId),
    routeVersion: asString(route.routeVersion),
    sector: asString(scenario.sector),
    jurisdiction: asString(scenario.jurisdiction),
    proposedAction: asString(scenario.proposedAction),
    consequence: asString(scenario.consequenceAtStake),
    evidenceCount: asArray(root.evidence).length,
    authorityCount: asArray(root.authorities).length,
    gateCount: asArray(root.gates).length,
    executionReceiptId: asString(execution.receiptId),
    executionEffect: asString(execution.actualEffect, asString(execution.expectedEffect)),
    outcome: asString(outcome.actualResult),
    canonicalHash: asString(integrity.canonicalHash, asString(integrity.recordHash)),
    packageHash: asString(integrity.packageHash),
    verificationLevel: asNumber(integrity.verificationLevel, 0),
    disclosureMode: "PUBLIC",
    claimsBoundary: asString(root.doesNotProve, asString(root.proves, DEFAULT_CANDIDATE.claimsBoundary)),
  };
}

function evaluate(candidate: ArtifactCandidate): RegistrationCheck[] {
  const effectPattern = candidate.determination === "ALLOW"
    ? /release|allow|execut|restor|issu/i
    : candidate.determination === "HOLD"
      ? /hold|lock|suspend|revalid/i
      : candidate.determination === "DENY"
        ? /deny|block|reject|revok|terminate/i
        : /escalat|route|adjudicat|review/i;
  return [
    { id: "governance", label: "Registered governance bound", state: candidate.governanceRegistrationId && candidate.organizationName ? "PASS" : "FAIL", detail: candidate.governanceRegistrationId ? `${candidate.governanceRegistrationId} · ${candidate.organizationName}` : "A registered governance is mandatory.", blocking: true },
    { id: "architecture", label: "Architecture version declared", state: candidate.architectureName && candidate.architectureVersion ? "PASS" : "FAIL", detail: candidate.architectureName ? `${candidate.architectureName} v${candidate.architectureVersion}` : "Architecture identity or version is missing.", blocking: true },
    { id: "route", label: "Frozen route identified", state: candidate.routeId && candidate.routeVersion ? "PASS" : "FAIL", detail: candidate.routeId ? `${candidate.routeId} · v${candidate.routeVersion}` : "A frozen route and version are required.", blocking: true },
    { id: "scope", label: "Sector and jurisdiction bounded", state: candidate.sector && candidate.jurisdiction ? "PASS" : "FAIL", detail: candidate.sector && candidate.jurisdiction ? `${candidate.sector} · ${candidate.jurisdiction}` : "Sector or jurisdiction is missing.", blocking: true },
    { id: "scenario", label: "Proposed action and consequence preserved", state: candidate.proposedAction && candidate.consequence ? "PASS" : "FAIL", detail: candidate.proposedAction && candidate.consequence ? "Bounded scenario present." : "Action or consequence is incomplete.", blocking: true },
    { id: "evidence", label: "Evidence package present", state: candidate.evidenceCount > 0 ? "PASS" : "FAIL", detail: `${candidate.evidenceCount} evidence entries detected.`, blocking: true },
    { id: "authority", label: "Authority package present", state: candidate.authorityCount > 0 ? "PASS" : "FAIL", detail: `${candidate.authorityCount} authority entries detected.`, blocking: true },
    { id: "gates", label: "Runtime gate ledger complete", state: candidate.gateCount >= 8 ? "PASS" : candidate.gateCount > 0 ? "REVIEW" : "FAIL", detail: `${candidate.gateCount} gate records detected.`, blocking: true },
    { id: "receipt", label: "Technical execution receipt present", state: candidate.executionReceiptId ? "PASS" : "FAIL", detail: candidate.executionReceiptId || "No execution receipt ID found.", blocking: true },
    { id: "effect", label: "Determination and effect correspond", state: effectPattern.test(candidate.executionEffect) ? "PASS" : candidate.executionEffect ? "REVIEW" : "FAIL", detail: candidate.executionEffect || "Technical effect is missing.", blocking: true },
    { id: "outcome", label: "Outcome closure preserved", state: candidate.outcome ? "PASS" : "FAIL", detail: candidate.outcome || "Actual or zero-action outcome is missing.", blocking: true },
    { id: "canonical", label: "Canonical hash present", state: candidate.canonicalHash.length >= 16 ? "PASS" : "FAIL", detail: candidate.canonicalHash || "Canonical hash missing.", blocking: true },
    { id: "package", label: "Package root present", state: candidate.packageHash.length >= 16 ? "PASS" : "FAIL", detail: candidate.packageHash || "Package hash missing.", blocking: true },
    { id: "verification", label: "Verification level declared", state: candidate.verificationLevel >= 1 ? "PASS" : "REVIEW", detail: `Level ${candidate.verificationLevel} declared. Verification is not certification.`, blocking: false },
    { id: "boundary", label: "Claims boundary explicit", state: candidate.claimsBoundary.length >= 40 ? "PASS" : "REVIEW", detail: candidate.claimsBoundary || "Claims boundary is incomplete.", blocking: false },
  ];
}

function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: string }) {
  return <span className={`badge badge-${tone.toLowerCase()}`}>{children}</span>;
}
function Metric({ label, value, detail }: { label: string; value: string | number; detail: string }) {
  return <article className="metric"><span>{label}</span><strong>{value}</strong><p>{detail}</p></article>;
}
function Field({ label, value, onChange, multiline = false }: { label: string; value: string; onChange: (value: string) => void; multiline?: boolean }) {
  return <label className="field"><span>{label}</span>{multiline ? <textarea value={value} onChange={event => onChange(event.target.value)} /> : <input value={value} onChange={event => onChange(event.target.value)} />}</label>;
}

export default function ArtifactRegistrationWizardPage() {
  const [candidate, setCandidate] = useState<ArtifactCandidate>(DEFAULT_CANDIDATE);
  const [stage, setStage] = useState<StageId>("intake");
  const [notes, setNotes] = useState("");
  const [submissionState, setSubmissionState] = useState<SubmissionState>("DRAFT");
  const [attestations, setAttestations] = useState<Record<string, boolean>>({ publisher: false, accuracy: false, authority: false, disclosure: false, challenge: false });
  const [toast, setToast] = useState("");
  const [controlFilter, setControlFilter] = useState("ALL");
  const [questionFilter, setQuestionFilter] = useState("ALL");
  const fileInput = useRef<HTMLInputElement>(null);

  const checks = useMemo(() => evaluate(candidate), [candidate]);
  const blockingFailures = checks.filter(check => check.blocking && check.state === "FAIL");
  const reviewItems = checks.filter(check => check.state === "REVIEW");
  const passed = checks.filter(check => check.state === "PASS").length;
  const readiness = Math.round((passed / checks.length) * 100);
  const allAttested = Object.values(attestations).every(Boolean);
  const eligible = blockingFailures.length === 0 && allAttested;
  const currentIndex = STAGES.findIndex(item => item.id === stage);
  const filteredControls = REGISTRATION_CONTROLS.filter(control => controlFilter === "ALL" || control.area === controlFilter);
  const filteredQuestions = REVIEW_QUESTIONS.filter(question => questionFilter === "ALL" || question.area === questionFilter);
  const registryId = `TA14-REGISTRY-${candidate.sequence.toString().padStart(6, "0")}-${shortHash(candidate.artifactId + candidate.packageHash).slice(0, 10).toUpperCase()}`;

  useEffect(() => {
    const saved = asObject(safeParse(localStorage.getItem(REGISTRATION_STORAGE_KEY)));
    if (!Object.keys(saved).length) return;
    const savedCandidate = asObject(saved.candidate);
    setCandidate(previous => ({ ...previous, ...savedCandidate } as ArtifactCandidate));
    const savedStage = asString(saved.stage);
    if (STAGES.some(item => item.id === savedStage)) setStage(savedStage as StageId);
    setNotes(asString(saved.notes));
    const savedAttestations = asObject(saved.attestations);
    setAttestations(previous => ({ ...previous, ...savedAttestations } as Record<string, boolean>));
    const state = asString(saved.submissionState);
    if (["DRAFT", "READY_FOR_REVIEW", "SUBMITTED", "REGISTERED", "REJECTED"].includes(state)) setSubmissionState(state as SubmissionState);
  }, []);

  useEffect(() => {
    localStorage.setItem(REGISTRATION_STORAGE_KEY, JSON.stringify({ candidate, stage, checks, attestations, notes, submissionState, updatedAt: new Date().toISOString() }));
  }, [candidate, stage, checks, attestations, notes, submissionState]);

  const update = <K extends keyof ArtifactCandidate>(key: K, value: ArtifactCandidate[K]) => setCandidate(current => ({ ...current, [key]: value }));
  const flash = (message: string) => { setToast(message); window.setTimeout(() => setToast(""), 3200); };
  const download = (name: string, payload: unknown) => {
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = name;
    anchor.click();
    URL.revokeObjectURL(url);
  };
  const importStudio = () => {
    const imported = fromStudio(safeParse(localStorage.getItem(STUDIO_STORAGE_KEY)));
    if (!imported) { flash("No completed Artifact Studio snapshot was found in this browser."); return; }
    setCandidate(imported);
    setSubmissionState("DRAFT");
    flash("Artifact Studio record imported. Registry checks have been recalculated.");
  };
  const importJson = async (file: File) => {
    try {
      const parsed = JSON.parse(await file.text());
      const imported = fromStudio(parsed) ?? (asObject(parsed).candidate as ArtifactCandidate | undefined);
      if (!imported) throw new Error("No recognizable artifact record was found.");
      setCandidate(current => ({ ...current, ...imported }));
      setSubmissionState("DRAFT");
      flash("Artifact JSON imported. Registry checks have been recalculated.");
    } catch (error) {
      flash(error instanceof Error ? error.message : "The selected file could not be imported.");
    }
  };
  const submit = () => {
    if (!eligible) { flash(`Submission blocked: ${blockingFailures.length} blocking issue(s) remain.`); return; }
    const receipt = {
      registryCandidateId: candidateId(candidate),
      proposedRegistryId: registryId,
      artifactId: candidate.artifactId,
      governanceRegistrationId: candidate.governanceRegistrationId,
      canonicalHash: candidate.canonicalHash,
      packageHash: candidate.packageHash,
      determination: candidate.determination,
      submittedAt: new Date().toISOString(),
      state: "READY_FOR_REVIEW",
      verificationLevel: candidate.verificationLevel,
      disclosureMode: candidate.disclosureMode,
      claimsBoundary: candidate.claimsBoundary,
      checks,
      attestations,
      notice: "This is a local registry candidate receipt. Permanent publication requires connected persistence, institutional review, and stable identity assignment.",
    };
    localStorage.setItem(REGISTRY_CANDIDATE_KEY, JSON.stringify(receipt));
    setSubmissionState("READY_FOR_REVIEW");
    download(`${candidateId(candidate)}.json`, receipt);
    flash("Registry candidate created and preserved locally.");
  };

  const stagePanel = () => {
    if (stage === "intake") return <section className="stage-panel"><header><Badge tone="cyan">Stage 01</Badge><h2>Import the completed execution artifact</h2><p>Begin from the frozen Artifact Studio record. Registration does not create missing evidence, authority, receipts, or outcomes.</p></header><div className="action-grid"><button onClick={importStudio}><strong>Import from Artifact Studio</strong><span>Read the locally preserved Studio v2 snapshot.</span></button><button onClick={() => fileInput.current?.click()}><strong>Import artifact JSON</strong><span>Load a canonical or Studio export.</span></button><input hidden ref={fileInput} type="file" accept="application/json,.json" onChange={event => { const file = event.target.files?.[0]; if (file) void importJson(file); event.currentTarget.value = ""; }} /><button onClick={() => download(`${candidate.artifactId}-draft.json`, { candidate, checks })}><strong>Export registration draft</strong><span>Preserve the current workspace.</span></button></div><div className="form-grid"><Field label="Artifact ID" value={candidate.artifactId} onChange={value => update("artifactId", value)} /><Field label="Title" value={candidate.title} onChange={value => update("title", value)} /><Field label="Series ID" value={candidate.seriesId} onChange={value => update("seriesId", value)} /><label className="field"><span>Determination</span><select value={candidate.determination} onChange={event => update("determination", event.target.value as Determination)}>{["ALLOW","HOLD","DENY","ESCALATE"].map(value => <option key={value}>{value}</option>)}</select></label></div></section>;
    if (stage === "governance") return <section className="stage-panel"><header><Badge tone="gold">Stage 02</Badge><h2>Prove governance eligibility</h2><p>An artifact cannot enter the registry unless an active registered AI governance owns it and the artifact remains inside that governance's declared scope.</p></header><div className="form-grid"><Field label="Governance registration ID" value={candidate.governanceRegistrationId} onChange={value => update("governanceRegistrationId", value)} /><Field label="Registered organization" value={candidate.organizationName} onChange={value => update("organizationName", value)} /><Field label="Architecture name" value={candidate.architectureName} onChange={value => update("architectureName", value)} /><Field label="Architecture version" value={candidate.architectureVersion} onChange={value => update("architectureVersion", value)} /><Field label="Sector" value={candidate.sector} onChange={value => update("sector", value)} /><Field label="Jurisdiction" value={candidate.jurisdiction} onChange={value => update("jurisdiction", value)} /></div><div className="rule-card"><strong>No registered governance. No registered artifact.</strong><p>Registration creates attribution. It does not certify the governance or guarantee acceptance of the submitted artifact.</p></div></section>;
    if (stage === "canonical") return <section className="stage-panel"><header><Badge tone="violet">Stage 03</Badge><h2>Canonical record validation</h2><p>Inspect the route, scenario, evidence, authority, runtime gates, determination, execution effect, and outcome as one bounded record.</p></header><div className="form-grid"><Field label="Frozen route ID" value={candidate.routeId} onChange={value => update("routeId", value)} /><Field label="Route version" value={candidate.routeVersion} onChange={value => update("routeVersion", value)} /><Field multiline label="Proposed action" value={candidate.proposedAction} onChange={value => update("proposedAction", value)} /><Field multiline label="Consequence at stake" value={candidate.consequence} onChange={value => update("consequence", value)} /><Field label="Technical receipt ID" value={candidate.executionReceiptId} onChange={value => update("executionReceiptId", value)} /><Field multiline label="Execution effect" value={candidate.executionEffect} onChange={value => update("executionEffect", value)} /><Field multiline label="Outcome closure" value={candidate.outcome} onChange={value => update("outcome", value)} /></div><div className="count-grid"><Metric label="Evidence" value={candidate.evidenceCount} detail="Preserved evidence entries" /><Metric label="Authority" value={candidate.authorityCount} detail="Authority records" /><Metric label="Runtime gates" value={candidate.gateCount} detail="Gate ledger entries" /></div></section>;
    if (stage === "integrity") return <section className="stage-panel"><header><Badge tone="green">Stage 04</Badge><h2>Integrity package</h2><p>Integrity detects change. It does not prove truth. Every published component must resolve to one package root.</p></header><div className="form-grid"><Field label="Canonical record hash" value={candidate.canonicalHash} onChange={value => update("canonicalHash", value)} /><Field label="Package root hash" value={candidate.packageHash} onChange={value => update("packageHash", value)} /></div><div className="hash-stage"><span>Candidate digest</span><code>{shortHash(JSON.stringify(candidate))}</code><span>Proposed registry digest</span><code>{shortHash(registryId + candidate.packageHash + candidate.canonicalHash)}</code></div></section>;
    if (stage === "verification") return <section className="stage-panel"><header><Badge tone="blue">Stage 05</Badge><h2>Verification and bounded reliance</h2><p>Record what was checked, what remains unverified, and the reliance justified by available evidence. Verification is not certification.</p></header><label className="range-field"><span>Earned verification level</span><input type="range" min="0" max="7" value={candidate.verificationLevel} onChange={event => update("verificationLevel", Number(event.target.value))} /><strong>Level {candidate.verificationLevel}</strong></label><div className="verification-ladder">{["Declared","Package integrity","Signature validity","Record parity","Replay consistency","Execution effect","Outcome closure","Independent review"].map((label,index) => <div className={index <= candidate.verificationLevel ? "level active" : "level"} key={label}><span>{index}</span><strong>{label}</strong></div>)}</div></section>;
    if (stage === "disclosure") return <section className="stage-panel"><header><Badge tone="pink">Stage 06</Badge><h2>Disclosure projection</h2><p>Publish proof without silently publishing protected evidence, personal information, security details, proprietary logic, or trade secrets.</p></header><label className="field"><span>Disclosure mode</span><select value={candidate.disclosureMode} onChange={event => update("disclosureMode", event.target.value as DisclosureMode)}>{["PUBLIC","SELECTIVE","RESTRICTED","WITHHELD"].map(value => <option key={value}>{value}</option>)}</select></label><Field multiline label="Claims boundary" value={candidate.claimsBoundary} onChange={value => update("claimsBoundary", value)} /><div className="projection"><h3>Public projection preview</h3><p><strong>{candidate.artifactId}</strong> is a {candidate.classification.toLowerCase()} execution artifact produced by {candidate.organizationName || "an unbound governance"}. It records a {candidate.determination} determination and an execution effect of “{candidate.executionEffect || "not yet declared"}.”</p><p>{candidate.claimsBoundary}</p></div></section>;
    if (stage === "attestation") return <section className="stage-panel"><header><Badge tone="orange">Stage 07</Badge><h2>Publisher attestations</h2><p>Attestation identifies who accepts responsibility for publication, when, and exactly what they attest. It does not prove that the artifact is correct.</p></header><div className="attestation-list">{[
      ["publisher","I am authorized to submit this artifact for the registered governance."],
      ["accuracy","The submission accurately represents the frozen canonical record."],
      ["authority","Authority, route, determination, receipt, and outcome states have not been invented or backdated."],
      ["disclosure","The selected disclosure projection protects restricted information and accurately states its limits."],
      ["challenge","I accept append-only challenge, correction, supersession, and withdrawal procedures."],
    ].map(([key,label]) => <label key={key}><input type="checkbox" checked={Boolean(attestations[key])} onChange={event => setAttestations(current => ({ ...current, [key]: event.target.checked }))} /><span>{label}</span></label>)}</div><Field multiline label="Submission notes" value={notes} onChange={setNotes} /></section>;
    return <section className="stage-panel"><header><Badge tone="green">Stage 08</Badge><h2>Create the registry candidate</h2><p>A successful local candidate is not permanent publication. Institutional review, connected persistence, stable registry assignment, and publication-state transition remain required.</p></header><div className="registry-id"><span>Proposed Registry ID</span><strong>{registryId}</strong><code>{candidateId(candidate)}</code></div><div className="summary-grid"><Metric label="Readiness" value={`${readiness}%`} detail={`${passed} of ${checks.length} checks pass`} /><Metric label="Blocking" value={blockingFailures.length} detail="Must be repaired" /><Metric label="Review" value={reviewItems.length} detail="Requires judgment" /><Metric label="Attestations" value={Object.values(attestations).filter(Boolean).length} detail="of 5 completed" /></div><button className="submit-button" disabled={!eligible} onClick={submit}>{eligible ? "Create registry candidate →" : "Submission blocked"}</button><p className="submission-note">State: <strong>{submissionState}</strong>. Permanent registry publication is never implied by a local receipt.</p></section>;
  };

  return <main className="page-shell">
    <div className="ambient ambient-one" /><div className="ambient ambient-two" /><div className="grid-field" />
    <header className="topbar"><Link href="/artifacts" className="brand"><span>TA-14</span><strong>Execution Artifact Registration</strong></Link><nav><Link href="/artifacts/studio">Artifact Studio</Link><Link href="/artifacts/registry">Registry</Link><Link href="/artifacts/verify">Verify</Link><Link href="/artifacts/challenge">Challenge</Link></nav></header>
    <section className="hero"><div className="eyebrow">Door Eight · Registry admission</div><h1>Register the evidence.<br /><em>Not the claim.</em></h1><p>Move a completed execution artifact from the Studio through governance eligibility, canonical validation, integrity, verification, disclosure, attestation, and bounded registry admission.</p><div className="hero-actions"><button onClick={importStudio}>Import Studio record →</button><Link href="/governance/register">Register governance</Link></div><div className="principle"><span>Institutional rule</span><strong>No registered governance. No registered artifact.</strong></div></section>
    <section className="metrics"><Metric label="Readiness" value={`${readiness}%`} detail={`${passed} checks currently pass`} /><Metric label="Blocking issues" value={blockingFailures.length} detail="Fail-closed conditions" /><Metric label="Verification" value={`L${candidate.verificationLevel}`} detail="Declared earned level" /><Metric label="Submission" value={submissionState} detail="Candidate lifecycle state" /></section>
    <section className="workspace"><aside className="stage-rail"><div className="rail-title"><span>Registration sequence</span><strong>{currentIndex + 1} / {STAGES.length}</strong></div>{STAGES.map((item,index) => <button className={stage === item.id ? "stage-button active" : index < currentIndex ? "stage-button complete" : "stage-button"} key={item.id} onClick={() => setStage(item.id)}><span>{item.number}</span><div><strong>{item.title}</strong><small>{item.description}</small></div></button>)}</aside><div className="stage-workspace">{stagePanel()}<div className="stage-navigation"><button disabled={currentIndex === 0} onClick={() => setStage(STAGES[Math.max(0,currentIndex - 1)].id)}>← Previous</button><span>{STAGES[currentIndex].title}</span><button disabled={currentIndex === STAGES.length - 1} onClick={() => setStage(STAGES[Math.min(STAGES.length - 1,currentIndex + 1)].id)}>Next →</button></div></div><aside className="check-rail"><div className="rail-title"><span>Admission checks</span><Badge tone={blockingFailures.length ? "red" : "green"}>{blockingFailures.length ? "BLOCKED" : "ELIGIBLE"}</Badge></div>{checks.map(check => <article className={`check check-${check.state.toLowerCase()}`} key={check.id}><div><span>{check.state}</span>{check.blocking && <small>mandatory</small>}</div><strong>{check.label}</strong><p>{check.detail}</p></article>)}</aside></section>
    <section className="institutional-section"><header><span>Control register</span><h2>120 controls for registry admission</h2><p>Controls expose what must be proven before a bounded artifact can enter institutional review.</p></header><div className="filter-row">{["ALL",...AREAS].map(value => <button className={controlFilter === value ? "active" : ""} key={value} onClick={() => setControlFilter(value)}>{value}</button>)}</div><div className="control-grid">{filteredControls.map(control => <article key={control.id}><div><Badge tone={control.severity === "BLOCKING" ? "red" : "gold"}>{control.severity}</Badge><code>{control.id}</code></div><h3>{control.title}</h3><p>{control.requirement}</p></article>)}</div></section>
    <section className="institutional-section questions"><header><span>Review protocol</span><h2>80 bounded questions</h2><p>Reviewers must identify the preserved record that supports every material registration conclusion.</p></header><div className="filter-row">{["ALL",...AREAS].map(value => <button className={questionFilter === value ? "active" : ""} key={value} onClick={() => setQuestionFilter(value)}>{value}</button>)}</div><div className="question-list">{filteredQuestions.map((question,index) => <article key={question.id}><span>{String(index + 1).padStart(2,"0")}</span><div><code>{question.id} · {question.area}</code><p>{question.prompt}</p></div></article>)}</div></section>
    <section className="closing"><div><span>Complete the lifecycle</span><h2>Build. Prove. Verify. Register.</h2><p>The registry preserves attributable evidence history. It does not replace independent judgment, guarantee truth, or certify the submitting governance.</p></div><div><Link href="/artifacts/studio">Return to Studio</Link><Link href="/artifacts/registry">Open Registry →</Link></div></section>
    <footer><strong>TA-14 Execution Artifact Registry</strong><span>No admissible evidence. No admissible execution.</span><Link href="/">Return to Exchange</Link></footer>
    {toast && <div className="toast">{toast}</div>}
    <style jsx>{`
      :global(*){box-sizing:border-box} :global(html){scroll-behavior:smooth} :global(body){margin:0;background:#050914;color:#f7f9ff;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
      :global(a){color:inherit;text-decoration:none} :global(button),:global(input),:global(textarea),:global(select){font:inherit}
      .page-shell{min-height:100vh;position:relative;overflow:hidden;background:radial-gradient(circle at 80% 10%,rgba(26,130,255,.16),transparent 28%),radial-gradient(circle at 12% 35%,rgba(157,80,255,.12),transparent 30%),linear-gradient(180deg,#070b16 0%,#050914 50%,#070b16 100%)}
      .grid-field{position:fixed;inset:0;pointer-events:none;opacity:.18;background-image:linear-gradient(rgba(255,255,255,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.035) 1px,transparent 1px);background-size:44px 44px;mask-image:linear-gradient(to bottom,black,transparent 75%)}
      .ambient{position:fixed;width:540px;height:540px;border-radius:50%;filter:blur(110px);pointer-events:none;opacity:.12}.ambient-one{background:#00c9ff;top:-260px;right:-130px}.ambient-two{background:#7a42ff;bottom:-300px;left:-180px}
      .topbar{position:relative;z-index:20;display:flex;align-items:center;justify-content:space-between;padding:20px clamp(24px,5vw,76px);border-bottom:1px solid rgba(255,255,255,.08);background:rgba(5,9,20,.82);backdrop-filter:blur(20px)}
      .brand{display:flex;align-items:center;gap:14px}.brand span{width:48px;height:48px;display:grid;place-items:center;border:1px solid rgba(81,203,255,.4);border-radius:14px;background:linear-gradient(145deg,rgba(42,155,255,.25),rgba(92,67,255,.12));font-weight:900;color:#77d9ff}.brand strong{font-size:14px;letter-spacing:.08em;text-transform:uppercase}.topbar nav{display:flex;gap:22px;color:#9eabc3;font-size:13px}
      .hero{position:relative;z-index:2;max-width:1500px;margin:0 auto;padding:100px clamp(24px,6vw,100px) 64px}.eyebrow{color:#69d9ff;font-size:12px;font-weight:800;letter-spacing:.2em;text-transform:uppercase;margin-bottom:24px}.hero h1{font-size:clamp(52px,7vw,108px);line-height:.94;letter-spacing:-.065em;margin:0;max-width:1050px}.hero h1 em{font-style:normal;background:linear-gradient(90deg,#62dcff,#a28cff,#ffcf72);background-clip:text;color:transparent}.hero>p{max-width:840px;font-size:clamp(17px,2vw,22px);line-height:1.7;color:#aab6ca;margin:34px 0}.hero-actions{display:flex;gap:14px;flex-wrap:wrap}.hero-actions button,.hero-actions a{border:1px solid rgba(255,255,255,.15);padding:15px 22px;border-radius:13px;background:rgba(255,255,255,.06);color:#fff;cursor:pointer}.hero-actions button{background:linear-gradient(135deg,#168eea,#6458ea);border:0;font-weight:800}.principle{margin-top:54px;display:inline-flex;flex-direction:column;gap:6px;padding:18px 22px;border-left:3px solid #5bd7ff;background:rgba(31,87,133,.16);border-radius:0 14px 14px 0}.principle span{font-size:10px;text-transform:uppercase;letter-spacing:.2em;color:#77d9ff}
      .metrics{position:relative;z-index:2;max-width:1500px;margin:0 auto;padding:0 clamp(24px,6vw,100px) 38px;display:grid;grid-template-columns:repeat(4,1fr);gap:14px}.metric{padding:20px;border:1px solid rgba(255,255,255,.09);border-radius:18px;background:linear-gradient(145deg,rgba(19,29,52,.82),rgba(8,13,27,.88));box-shadow:0 20px 60px rgba(0,0,0,.18)}.metric span{font-size:10px;text-transform:uppercase;letter-spacing:.16em;color:#7888a3}.metric strong{display:block;font-size:27px;margin:8px 0}.metric p{margin:0;color:#8898b1;font-size:12px;line-height:1.5}
      .workspace{position:relative;z-index:2;max-width:1600px;margin:0 auto;padding:20px clamp(18px,3vw,48px) 90px;display:grid;grid-template-columns:270px minmax(0,1fr) 300px;gap:18px;align-items:start}.stage-rail,.check-rail{position:sticky;top:22px;border:1px solid rgba(255,255,255,.09);border-radius:22px;background:rgba(8,13,27,.88);backdrop-filter:blur(20px);padding:14px;max-height:calc(100vh - 44px);overflow:auto}.rail-title{display:flex;align-items:center;justify-content:space-between;padding:10px 8px 16px;color:#93a4bf;font-size:11px;text-transform:uppercase;letter-spacing:.12em}
      .stage-button{width:100%;display:flex;gap:12px;text-align:left;padding:14px 10px;border:0;border-top:1px solid rgba(255,255,255,.055);background:transparent;color:#8c9ab2;cursor:pointer}.stage-button>span{width:32px;height:32px;display:grid;place-items:center;border-radius:10px;background:rgba(255,255,255,.05);font-size:11px}.stage-button strong{display:block;color:#dbe3f2;font-size:13px;margin-bottom:5px}.stage-button small{font-size:10px;line-height:1.45;color:#71809a}.stage-button.active{background:linear-gradient(90deg,rgba(34,143,255,.18),transparent);border-radius:13px}.stage-button.active>span{background:#168eea;color:#fff}.stage-button.complete>span{background:rgba(74,213,149,.15);color:#62dea5}
      .stage-panel{min-height:680px;border:1px solid rgba(255,255,255,.1);border-radius:24px;padding:clamp(24px,4vw,46px);background:linear-gradient(145deg,rgba(17,25,45,.9),rgba(7,12,25,.95));box-shadow:0 30px 90px rgba(0,0,0,.26)}.stage-panel header h2{font-size:clamp(29px,4vw,50px);letter-spacing:-.04em;margin:16px 0 12px}.stage-panel header p{max-width:760px;color:#9aa8be;line-height:1.7;margin:0 0 34px}
      .badge{display:inline-flex;padding:6px 10px;border-radius:999px;font-size:9px;font-weight:900;letter-spacing:.13em;text-transform:uppercase;border:1px solid rgba(255,255,255,.1)}.badge-cyan,.badge-blue{color:#75ddff;background:rgba(50,177,255,.1)}.badge-gold,.badge-orange{color:#ffd17a;background:rgba(255,176,50,.1)}.badge-violet,.badge-pink{color:#c8a7ff;background:rgba(152,91,255,.12)}.badge-green{color:#6ee2aa;background:rgba(57,211,142,.1)}.badge-red{color:#ff8f9f;background:rgba(255,71,95,.1)}
      .action-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:32px}.action-grid button{text-align:left;padding:22px;border:1px solid rgba(255,255,255,.09);border-radius:17px;background:rgba(255,255,255,.035);color:#fff;cursor:pointer}.action-grid strong{display:block;margin-bottom:9px}.action-grid span{font-size:11px;color:#8391aa}.form-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}.field{display:flex;flex-direction:column;gap:8px}.field>span,.range-field>span{font-size:10px;text-transform:uppercase;letter-spacing:.14em;color:#8090a9}.field input,.field textarea,.field select{width:100%;color:#eef4ff;background:#080e1d;border:1px solid rgba(255,255,255,.11);border-radius:12px;padding:13px 14px;outline:none}.field textarea{min-height:120px;resize:vertical}
      .rule-card,.projection{margin-top:24px;padding:22px;border-radius:16px;border:1px solid rgba(79,204,255,.18);background:rgba(31,112,157,.1)}.rule-card p,.projection p{color:#92a1ba;line-height:1.65}.count-grid,.summary-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-top:24px}.count-grid{grid-template-columns:repeat(3,1fr)}.hash-stage{margin-top:30px;padding:24px;border:1px solid rgba(255,255,255,.08);border-radius:18px;background:#060b16;display:grid;gap:9px}.hash-stage span{font-size:10px;text-transform:uppercase;letter-spacing:.13em;color:#76859e}.hash-stage code,.registry-id code{font-size:11px;color:#6bdcff;overflow-wrap:anywhere}
      .range-field{display:grid;grid-template-columns:1fr 3fr auto;align-items:center;gap:20px;padding:22px;border:1px solid rgba(255,255,255,.09);border-radius:16px;background:rgba(255,255,255,.03)}.verification-ladder{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:24px}.level{padding:17px;border:1px solid rgba(255,255,255,.07);border-radius:14px;color:#67758e}.level span{display:grid;place-items:center;width:28px;height:28px;border-radius:50%;background:rgba(255,255,255,.05);margin-bottom:10px}.level strong{font-size:11px}.level.active{border-color:rgba(73,209,255,.32);color:#eaf8ff;background:rgba(35,146,207,.11)}.attestation-list{display:grid;gap:12px}.attestation-list label{display:flex;align-items:flex-start;gap:12px;padding:17px;border:1px solid rgba(255,255,255,.08);border-radius:14px;background:rgba(255,255,255,.025);color:#b8c3d5;font-size:13px;line-height:1.55}
      .registry-id{padding:25px;border:1px solid rgba(74,215,159,.25);border-radius:18px;background:linear-gradient(135deg,rgba(37,147,104,.12),rgba(33,90,155,.08));display:flex;flex-direction:column;gap:8px}.registry-id span{font-size:10px;text-transform:uppercase;letter-spacing:.16em;color:#70dfa9}.registry-id strong{font-size:clamp(18px,3vw,29px);overflow-wrap:anywhere}.submit-button{width:100%;margin-top:28px;border:0;border-radius:14px;padding:18px;background:linear-gradient(135deg,#1d9e69,#1d8cca);color:#fff;font-weight:900;cursor:pointer}.submit-button:disabled{background:#303848;color:#758096}.submission-note{text-align:center;color:#75849d;font-size:12px}
      .stage-navigation{display:flex;justify-content:space-between;align-items:center;padding:17px 6px}.stage-navigation button{border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.04);color:#dce5f4;border-radius:10px;padding:10px 14px}.stage-navigation button:disabled{opacity:.3}.stage-navigation span{font-size:11px;text-transform:uppercase;letter-spacing:.12em;color:#72819a}.check{padding:14px 8px;border-top:1px solid rgba(255,255,255,.06)}.check>div{display:flex;justify-content:space-between}.check>div span{font-size:9px;font-weight:900}.check strong{display:block;font-size:12px;margin:7px 0}.check p{font-size:10px;line-height:1.5;color:#77869d;margin:0}.check-pass>div span{color:#62dda5}.check-fail>div span{color:#ff7d91}.check-review>div span{color:#ffc86a}
      .institutional-section{position:relative;z-index:2;max-width:1500px;margin:0 auto;padding:70px clamp(24px,6vw,100px)}.institutional-section header>span,.closing>div>span{font-size:10px;text-transform:uppercase;letter-spacing:.17em;color:#67d5ff}.institutional-section header h2,.closing h2{font-size:clamp(34px,5vw,64px);letter-spacing:-.045em;margin:12px 0}.institutional-section header p{color:#8e9db4;max-width:760px}.filter-row{display:flex;gap:8px;flex-wrap:wrap;margin:28px 0}.filter-row button{border:1px solid rgba(255,255,255,.08);border-radius:999px;padding:8px 12px;background:rgba(255,255,255,.03);color:#7f8ea5;font-size:9px}.filter-row button.active{background:#1d8fd0;color:#fff}.control-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:13px}.control-grid article{padding:20px;border:1px solid rgba(255,255,255,.08);border-radius:17px;background:rgba(12,19,34,.8)}.control-grid article>div{display:flex;justify-content:space-between}.control-grid code,.question-list code{font-size:9px;color:#64738c}.control-grid h3{font-size:14px}.control-grid p{font-size:11px;color:#7e8da5;line-height:1.6}.question-list{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}.question-list article{display:flex;gap:14px;padding:18px;border:1px solid rgba(255,255,255,.07);border-radius:15px;background:rgba(255,255,255,.025)}.question-list article>span{font-size:22px;color:#263752;font-weight:900}.question-list p{font-size:12px;color:#9ba8bc;line-height:1.6}
      .closing{position:relative;z-index:2;max-width:1350px;margin:60px auto 100px;padding:55px;border:1px solid rgba(87,209,255,.2);border-radius:28px;background:linear-gradient(135deg,rgba(21,92,133,.17),rgba(76,43,132,.12));display:flex;justify-content:space-between;align-items:end;gap:30px}.closing p{max-width:720px;color:#8d9bb1;line-height:1.65}.closing>div:last-child{display:flex;gap:12px}.closing a{padding:13px 17px;border:1px solid rgba(255,255,255,.12);border-radius:11px;background:rgba(255,255,255,.05)}footer{position:relative;z-index:2;padding:28px clamp(24px,6vw,100px);border-top:1px solid rgba(255,255,255,.08);display:flex;justify-content:space-between;color:#77869e;font-size:11px}.toast{position:fixed;right:24px;bottom:24px;z-index:100;padding:16px 20px;border:1px solid rgba(74,214,255,.24);border-radius:13px;background:#0b1728;color:#dff7ff}
      @media(max-width:1200px){.workspace{grid-template-columns:240px 1fr}.check-rail{position:relative;grid-column:1/-1;display:grid;grid-template-columns:repeat(3,1fr);max-height:none}.control-grid{grid-template-columns:repeat(2,1fr)}}
      @media(max-width:850px){.topbar nav{display:none}.metrics{grid-template-columns:repeat(2,1fr)}.workspace{display:block}.stage-rail{position:relative;display:flex;overflow:auto;max-height:none;margin-bottom:14px}.rail-title{display:none}.stage-button{min-width:185px}.check-rail{display:grid;grid-template-columns:repeat(2,1fr);margin-top:15px}.action-grid,.form-grid,.verification-ladder,.summary-grid,.count-grid{grid-template-columns:1fr 1fr}.control-grid,.question-list{grid-template-columns:1fr}.closing{margin-left:20px;margin-right:20px;display:block}}
      @media(max-width:560px){.hero h1{font-size:48px}.metrics,.action-grid,.form-grid,.verification-ladder,.summary-grid,.count-grid,.check-rail{grid-template-columns:1fr}.stage-panel{padding:22px;min-height:auto}.range-field{grid-template-columns:1fr}footer{flex-direction:column;gap:10px}}
    `}</style>
  </main>;
}
