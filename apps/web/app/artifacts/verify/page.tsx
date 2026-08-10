"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

type Determination = "ALLOW" | "HOLD" | "DENY" | "ESCALATE";
type VerificationView = "command" | "artifact" | "package" | "receipt" | "custody" | "report";
type CheckState = "PENDING" | "PASS" | "FAIL" | "NOT_AVAILABLE";
type Artifact = {
  id: string;
  sequence: number;
  title: string;
  determination: Determination;
  anchor: string;
  receipt: string;
  sector: string;
  routeId: string;
  receiptId: string;
  verificationLevel: number;
  summary: string;
  rootHash: string;
  packageHash: string;
  signature: string;
};
type VerificationCheck = { id: string; title: string; description: string; state: CheckState; detail: string; };
type Activity = { id: string; time: string; action: string; subject: string; result: string; };

const ARTIFACTS: Artifact[] = [
  {
    id: "TA14-EA-000001",
    sequence: 1,
    title: "Authorized release with verified outcome",
    determination: "ALLOW",
    anchor: "OUTCOME",
    receipt: "HTTP 202 · RELEASED",
    sector: "Cross-sector demonstration",
    routeId: "TA14-ROUTE-ALLOW-000001",
    receiptId: "TA14-RECEIPT-000001",
    verificationLevel: 6,
    summary: "Complete route released one bounded action and independently verified the resulting state.",
    rootHash: "de8f213452782f64e0707f8f2f362d4a46b7f370fd2bf6e695bdcd6ab03f1e11",
    packageHash: "c51388ca0e90f893609011ef54e5e51bc51b61efc537c8353150c227cba31d04",
    signature: "TA14-SIG-000001-V2",
  },
  {
    id: "TA14-EA-000002",
    sequence: 2,
    title: "Authority drift before execution",
    determination: "HOLD",
    anchor: "CONTINUITY",
    receipt: "HTTP 423 · HELD",
    sector: "Financial execution",
    routeId: "TA14-ROUTE-HOLD-000002",
    receiptId: "TA14-RECEIPT-000002",
    verificationLevel: 6,
    summary: "Authority changed after approval; transmission remained closed pending repaired authority and revalidation.",
    rootHash: "4c4f4f98ec77c9c61526af0a704a31adfcd1d647e6883f88a061c4a99d59bc2f",
    packageHash: "ed4f35ff5117bb0895185d360be3132fab44c9321ee8a09714422f736ff3ce97",
    signature: "TA14-SIG-000002-V2",
  },
  {
    id: "TA14-EA-000003",
    sequence: 3,
    title: "Execution boundary violation prevented",
    determination: "DENY",
    anchor: "BINDING",
    receipt: "HTTP 403 · DEPLOYMENT_DENIED",
    sector: "AI operations",
    routeId: "TA14-ROUTE-DENY-000003",
    receiptId: "TA14-RECEIPT-000003",
    verificationLevel: 6,
    summary: "Requested production write privileges exceeded the authorized staging-only boundary.",
    rootHash: "9c31298e31c2c90e30cf8c3ba61857f59e00486d5bfde98de2bedca4194d1aa4",
    packageHash: "4e6b1f7cc6a08120c4fe9f53f286cf84df9aa43a84d32497e1f78128c7ee32bd",
    signature: "TA14-SIG-000003-V2",
  },
  {
    id: "TA14-EA-000004",
    sequence: 4,
    title: "Conflicting admissible evidence escalated",
    determination: "ESCALATE",
    anchor: "ADMISSIBILITY",
    receipt: "HTTP 202 · HELD_AND_ROUTED",
    sector: "Healthcare",
    routeId: "TA14-ROUTE-ESCALATE-000004",
    receiptId: "TA14-RECEIPT-000004",
    verificationLevel: 6,
    summary: "Two current admissible sources conflicted; neither was silently preferred and adjudication was required.",
    rootHash: "4f9b5339148f4ddac3dd3d4c77034df9678ee1c7ba7a34c861f018a82691744a",
    packageHash: "4a074ca48d8f7619b90eb2d09c246a9f7f89c9b92399b574bb0a3e95f84e174d",
    signature: "TA14-SIG-000004-V2",
  },
  {
    id: "TA14-EA-000005",
    sequence: 5,
    title: "Evidence freshness expired before commit",
    determination: "HOLD",
    anchor: "ADMISSIBILITY",
    receipt: "HTTP 423 · HELD",
    sector: "Life sciences",
    routeId: "TA14-ROUTE-HOLD-000005",
    receiptId: "TA14-RECEIPT-000005",
    verificationLevel: 6,
    summary: "Required sterility evidence expired before commitment; zero batches were released.",
    rootHash: "ab9612f3e6c1fd0a4c61ce01af12b4287d551cf218c85d310d9faed60fa27a05",
    packageHash: "2ff3a8a01de880d2df0c8f33d2ee1bf951476ddb41b61f81562046f57ab0cf66",
    signature: "TA14-SIG-000005-V2",
  },
  {
    id: "TA14-EA-000006",
    sequence: 6,
    title: "Unauthorized runtime version denied",
    determination: "DENY",
    anchor: "COMMIT",
    receipt: "HTTP 403 · RUNTIME_VERSION_DENIED",
    sector: "AI runtime",
    routeId: "TA14-ROUTE-DENY-000006",
    receiptId: "TA14-RECEIPT-000006",
    verificationLevel: 6,
    summary: "Requested runtime v7.4 did not match the approved v7.3 commit snapshot.",
    rootHash: "9c31298e31c2c90e30cf8c3ba61857f59e00486d5bfde98de2bedca4194d1aa4",
    packageHash: "4e6b1f7cc6a08120c4fe9f53f286cf84df9aa43a84d32497e1f78128c7ee32bd",
    signature: "TA14-SIG-000006-V2",
  },
  {
    id: "TA14-EA-000007",
    sequence: 7,
    title: "Authorized threshold exceeded",
    determination: "ESCALATE",
    anchor: "BINDING",
    receipt: "HTTP 202 · ESCALATED",
    sector: "Water treatment",
    routeId: "TA14-ROUTE-ESCALATE-000007",
    receiptId: "TA14-RECEIPT-000007",
    verificationLevel: 6,
    summary: "A 12 percent dosing change exceeded the operator delegated ceiling and was routed for executive review.",
    rootHash: "7d81d14fc4e0d831e9aee4ab1c57cd9e03837bd2ba50a180e9d19a73da270007",
    packageHash: "f2bcf193630ce0d15df79f5886909ff84f8b506de8a2d03237f5d4dd93070007",
    signature: "TA14-SIG-000007-V2",
  },
  {
    id: "TA14-EA-000008",
    sequence: 8,
    title: "Material condition changed after approval",
    determination: "HOLD",
    anchor: "CONTINUITY",
    receipt: "HTTP 423 · AWAITING_REVALIDATION",
    sector: "Environmental systems",
    routeId: "TA14-ROUTE-HOLD-000008",
    receiptId: "TA14-RECEIPT-000008",
    verificationLevel: 6,
    summary: "Exterior PM2.5 changed materially after approval; execution was suspended for revalidation.",
    rootHash: "8e17c901cb4a8f157e2e8c632d2bb49d6814b48b22e6c7b99d9c7f43acb90008",
    packageHash: "4af24876a1126dd1dd6e84f6f443dfad1d1fb5fb3e453715c74918f5027f0008",
    signature: "TA14-SIG-000008-V2",
  },
  {
    id: "TA14-EA-000009",
    sequence: 9,
    title: "Mandatory gate bypass attempt prevented",
    determination: "DENY",
    anchor: "EXECUTION",
    receipt: "HTTP 403 · GOVERNANCE_GATE_DENIED",
    sector: "Cybersecurity",
    routeId: "TA14-ROUTE-DENY-000009",
    receiptId: "TA14-RECEIPT-000009",
    verificationLevel: 6,
    summary: "An alternate path attempted to bypass a mandatory governance gate; the token was revoked.",
    rootHash: "09c9b27b8a63fd3102bd9b26d5f979c3e6f55c877b2aa7f24b0e9f22a9300009",
    packageHash: "98f42cb675a6d51dd2ca443b90353e7e47425d95665f5f060ff7e0cde1900009",
    signature: "TA14-SIG-000009-V2",
  },
  {
    id: "TA14-EA-000010",
    sequence: 10,
    title: "Dual-authority privileged access restoration",
    determination: "ALLOW",
    anchor: "COMMIT",
    receipt: "HTTP 202 · ACCESS_RESTORED",
    sector: "Cybersecurity",
    routeId: "TA14-ROUTE-ALLOW-000010",
    receiptId: "TA14-RECEIPT-000010",
    verificationLevel: 6,
    summary: "Independent Security Operations Lead and System Owner concurrence enabled one time-bounded restoration.",
    rootHash: "a87a3a40a771814ec5b59210fa79c2d0685e17819f1bb3575ca7c5182ce1010a",
    packageHash: "4b4a7110d9eb48dc2cc179060b4da8fb30536c5ad80fbf9cfc937988f5b0010b",
    signature: "TA14-SIG-000010-V2",
  },
  {
    id: "TA14-EA-000011",
    sequence: 11,
    title: "Confidential evidence verified without disclosure",
    determination: "ALLOW",
    anchor: "ADMISSIBILITY",
    receipt: "HTTP 202 · CERTIFICATE_ISSUED",
    sector: "Confidential assurance",
    routeId: "TA14-ROUTE-ALLOW-000011",
    receiptId: "TA14-RECEIPT-000011",
    verificationLevel: 6,
    summary: "Protected evidence remained sealed while hashes, custody, and bounded attestations supported release.",
    rootHash: "c8f032f0819b146d43785a54fa56b8dfc2a6dd7ef8f65a49672712e4cd11011a",
    packageHash: "e5ea918c28c1f4a3fe1af6b63a41052f60f1c0b7405de8d1f6fe30c64a11011b",
    signature: "TA14-SIG-000011-V2",
  },
  {
    id: "TA14-EA-000012",
    sequence: 12,
    title: "Preserved chain-of-custody closure certificate",
    determination: "ALLOW",
    anchor: "OUTCOME",
    receipt: "HTTP 202 · CERTIFICATE_ISSUED",
    sector: "Institutional assurance",
    routeId: "TA14-ROUTE-ALLOW-000012",
    receiptId: "TA14-RECEIPT-000012",
    verificationLevel: 6,
    summary: "Independent outcome corroboration and preserved custody supported bounded closure certification.",
    rootHash: "c8f032f0819b146d43785a54fa56b8dfc2a6dd7ef8f65a49672712e4cd12012a",
    packageHash: "e5ea918c28c1f4a3fe1af6b63a41052f60f1c0b7405de8d1f6fe30c64a12012b",
    signature: "TA14-SIG-000012-V2",
  },
];

const RUNTIME_LINKS = [
  { index: 1, name: "REALITY", description: "Runtime link 01 verifies reality evidence, state, authority, or execution correspondence before reliance." },
  { index: 2, name: "RECORD", description: "Runtime link 02 verifies record evidence, state, authority, or execution correspondence before reliance." },
  { index: 3, name: "IDENTITY", description: "Runtime link 03 verifies identity evidence, state, authority, or execution correspondence before reliance." },
  { index: 4, name: "PROVENANCE", description: "Runtime link 04 verifies provenance evidence, state, authority, or execution correspondence before reliance." },
  { index: 5, name: "TIME", description: "Runtime link 05 verifies time evidence, state, authority, or execution correspondence before reliance." },
  { index: 6, name: "CUSTODY", description: "Runtime link 06 verifies custody evidence, state, authority, or execution correspondence before reliance." },
  { index: 7, name: "INTEGRITY", description: "Runtime link 07 verifies integrity evidence, state, authority, or execution correspondence before reliance." },
  { index: 8, name: "CONTINUITY", description: "Runtime link 08 verifies continuity evidence, state, authority, or execution correspondence before reliance." },
  { index: 9, name: "RELEVANCE", description: "Runtime link 09 verifies relevance evidence, state, authority, or execution correspondence before reliance." },
  { index: 10, name: "FRESHNESS", description: "Runtime link 10 verifies freshness evidence, state, authority, or execution correspondence before reliance." },
  { index: 11, name: "SUFFICIENCY", description: "Runtime link 11 verifies sufficiency evidence, state, authority, or execution correspondence before reliance." },
  { index: 12, name: "CONFLICT", description: "Runtime link 12 verifies conflict evidence, state, authority, or execution correspondence before reliance." },
  { index: 13, name: "ADMISSIBILITY", description: "Runtime link 13 verifies admissibility evidence, state, authority, or execution correspondence before reliance." },
  { index: 14, name: "AUTHORITY", description: "Runtime link 14 verifies authority evidence, state, authority, or execution correspondence before reliance." },
  { index: 15, name: "BOUNDARY", description: "Runtime link 15 verifies boundary evidence, state, authority, or execution correspondence before reliance." },
  { index: 16, name: "OBLIGATION", description: "Runtime link 16 verifies obligation evidence, state, authority, or execution correspondence before reliance." },
  { index: 17, name: "BINDING", description: "Runtime link 17 verifies binding evidence, state, authority, or execution correspondence before reliance." },
  { index: 18, name: "DETERMINATION", description: "Runtime link 18 verifies determination evidence, state, authority, or execution correspondence before reliance." },
  { index: 19, name: "COMMIT", description: "Runtime link 19 verifies commit evidence, state, authority, or execution correspondence before reliance." },
  { index: 20, name: "REVALIDATION", description: "Runtime link 20 verifies revalidation evidence, state, authority, or execution correspondence before reliance." },
  { index: 21, name: "EXECUTION", description: "Runtime link 21 verifies execution evidence, state, authority, or execution correspondence before reliance." },
  { index: 22, name: "CORRESPONDENCE", description: "Runtime link 22 verifies correspondence evidence, state, authority, or execution correspondence before reliance." },
  { index: 23, name: "OUTCOME", description: "Runtime link 23 verifies outcome evidence, state, authority, or execution correspondence before reliance." },
  { index: 24, name: "PRESERVATION", description: "Runtime link 24 verifies preservation evidence, state, authority, or execution correspondence before reliance." },
] as const;

const PACKAGE_COMPONENTS = [
  { id: "PKG-01", title: "Public inspection page", required: true, description: "Public inspection page must resolve to the same frozen artifact root and remain independently inspectable." },
  { id: "PKG-02", title: "Canonical JSON", required: true, description: "Canonical JSON must resolve to the same frozen artifact root and remain independently inspectable." },
  { id: "PKG-03", title: "Human-readable record", required: true, description: "Human-readable record must resolve to the same frozen artifact root and remain independently inspectable." },
  { id: "PKG-04", title: "Route snapshot", required: true, description: "Route snapshot must resolve to the same frozen artifact root and remain independently inspectable." },
  { id: "PKG-05", title: "Evidence manifest", required: true, description: "Evidence manifest must resolve to the same frozen artifact root and remain independently inspectable." },
  { id: "PKG-06", title: "Authority record", required: true, description: "Authority record must resolve to the same frozen artifact root and remain independently inspectable." },
  { id: "PKG-07", title: "Continuity record", required: true, description: "Continuity record must resolve to the same frozen artifact root and remain independently inspectable." },
  { id: "PKG-08", title: "Admissibility record", required: true, description: "Admissibility record must resolve to the same frozen artifact root and remain independently inspectable." },
  { id: "PKG-09", title: "24-link gate ledger", required: true, description: "24-link gate ledger must resolve to the same frozen artifact root and remain independently inspectable." },
  { id: "PKG-10", title: "Commit record", required: true, description: "Commit record must resolve to the same frozen artifact root and remain independently inspectable." },
  { id: "PKG-11", title: "Execution receipt", required: true, description: "Execution receipt must resolve to the same frozen artifact root and remain independently inspectable." },
  { id: "PKG-12", title: "Outcome evidence", required: true, description: "Outcome evidence must resolve to the same frozen artifact root and remain independently inspectable." },
  { id: "PKG-13", title: "Integrity manifest", required: true, description: "Integrity manifest must resolve to the same frozen artifact root and remain independently inspectable." },
  { id: "PKG-14", title: "Component hashes", required: true, description: "Component hashes must resolve to the same frozen artifact root and remain independently inspectable." },
  { id: "PKG-15", title: "Package-root hash", required: true, description: "Package-root hash must resolve to the same frozen artifact root and remain independently inspectable." },
  { id: "PKG-16", title: "Verification instructions", required: true, description: "Verification instructions must resolve to the same frozen artifact root and remain independently inspectable." },
  { id: "PKG-17", title: "Replay inputs", required: false, description: "Replay inputs must resolve to the same frozen artifact root and remain independently inspectable." },
  { id: "PKG-18", title: "Claims-boundary statement", required: false, description: "Claims-boundary statement must resolve to the same frozen artifact root and remain independently inspectable." },
  { id: "PKG-19", title: "Challenge record", required: false, description: "Challenge record must resolve to the same frozen artifact root and remain independently inspectable." },
  { id: "PKG-20", title: "Correction history", required: false, description: "Correction history must resolve to the same frozen artifact root and remain independently inspectable." },
] as const;

const VERIFICATION_LEVELS = [
  { code: "L0", title: "Declared", description: "Publisher asserts the record exists." },
  { code: "L1", title: "Package integrity", description: "Component hashes confirm the downloaded package has not changed." },
  { code: "L2", title: "Signature validity", description: "The record signature validates against the published signing policy." },
  { code: "L3", title: "Record parity", description: "Page, JSON, manifest, receipt, and route resolve to one frozen event." },
  { code: "L4", title: "Replay consistency", description: "Permitted replay reproduces the committed determination." },
  { code: "L5", title: "Execution effect", description: "Technical receipt verifies release, hold, denial, or escalation." },
  { code: "L6", title: "Outcome closure", description: "Independent evidence supports the preserved outcome." },
  { code: "L7", title: "Independent review", description: "A qualified outside reviewer publishes a bounded opinion." },
] as const;

const BASE_CHECKS: VerificationCheck[] = [
  { id: "identity", title: "Artifact identity", description: "Stable artifact ID, title, series, owner, and publication state resolve.", state: "PENDING", detail: "Stable identifier resolved against the Door Eight founding series." },
  { id: "route", title: "Route snapshot", description: "Route ID, version, gate order, and revalidation triggers are frozen.", state: "PENDING", detail: "Route snapshot is present and parity-linked." },
  { id: "evidence", title: "Evidence manifest", description: "Evidence identifiers, hashes, custody, freshness, and disclosure states are present.", state: "PENDING", detail: "Evidence manifest contains bounded public metadata." },
  { id: "authority", title: "Authority record", description: "Actor, role, authority source, scope, expiry, revocation, and conflicts resolve.", state: "PENDING", detail: "Authority state is preserved at commit time." },
  { id: "continuity", title: "Continuity record", description: "Identity, provenance, time, custody, version, and dependency continuity are explicit.", state: "PENDING", detail: "Continuity state is preserved without silent repair." },
  { id: "gates", title: "Runtime gate ledger", description: "All 24 links are present and the earliest controlling condition is explicit.", state: "PENDING", detail: "Complete runtime ledger is available." },
  { id: "commit", title: "Commit record", description: "Determination and permitted next action were fixed before execution.", state: "PENDING", detail: "Commit timestamp precedes adapter invocation." },
  { id: "receipt", title: "Execution receipt", description: "Adapter status and technical effect agree with the committed determination.", state: "PENDING", detail: "Receipt status is internally consistent." },
  { id: "outcome", title: "Outcome closure", description: "Actual result, residual risk, and closure evidence are preserved.", state: "PENDING", detail: "Outcome evidence is linked to the artifact root." },
  { id: "hashes", title: "Integrity hashes", description: "Component, canonical record, and package-root hashes are present.", state: "PENDING", detail: "Hash inventory is complete." },
  { id: "parity", title: "Cross-format parity", description: "Page, JSON, manifest, receipt, and package identify the same event.", state: "PENDING", detail: "All declared components resolve to one root." },
  { id: "claims", title: "Claims boundary", description: "The artifact states what it proves and what it does not prove.", state: "PENDING", detail: "Bounded claims statement is present." },
];

const INITIAL_ACTIVITY: Activity[] = [
  { id: "ACT-001", time: "2026-08-01T08:07:00-04:00", action: "FOUNDING_ARTIFACT_INDEXED", subject: "TA14-EA-000001", result: "AVAILABLE_FOR_PUBLIC_VERIFICATION" },
  { id: "ACT-002", time: "2026-08-01T08:14:00-04:00", action: "FOUNDING_ARTIFACT_INDEXED", subject: "TA14-EA-000002", result: "AVAILABLE_FOR_PUBLIC_VERIFICATION" },
  { id: "ACT-003", time: "2026-08-01T08:21:00-04:00", action: "FOUNDING_ARTIFACT_INDEXED", subject: "TA14-EA-000003", result: "AVAILABLE_FOR_PUBLIC_VERIFICATION" },
  { id: "ACT-004", time: "2026-08-01T09:28:00-04:00", action: "FOUNDING_ARTIFACT_INDEXED", subject: "TA14-EA-000004", result: "AVAILABLE_FOR_PUBLIC_VERIFICATION" },
  { id: "ACT-005", time: "2026-08-01T09:35:00-04:00", action: "FOUNDING_ARTIFACT_INDEXED", subject: "TA14-EA-000005", result: "AVAILABLE_FOR_PUBLIC_VERIFICATION" },
  { id: "ACT-006", time: "2026-08-01T09:42:00-04:00", action: "FOUNDING_ARTIFACT_INDEXED", subject: "TA14-EA-000006", result: "AVAILABLE_FOR_PUBLIC_VERIFICATION" },
  { id: "ACT-007", time: "2026-08-01T09:49:00-04:00", action: "FOUNDING_ARTIFACT_INDEXED", subject: "TA14-EA-000007", result: "AVAILABLE_FOR_PUBLIC_VERIFICATION" },
  { id: "ACT-008", time: "2026-08-01T10:56:00-04:00", action: "FOUNDING_ARTIFACT_INDEXED", subject: "TA14-EA-000008", result: "AVAILABLE_FOR_PUBLIC_VERIFICATION" },
  { id: "ACT-009", time: "2026-08-01T10:03:00-04:00", action: "FOUNDING_ARTIFACT_INDEXED", subject: "TA14-EA-000009", result: "AVAILABLE_FOR_PUBLIC_VERIFICATION" },
  { id: "ACT-010", time: "2026-08-01T10:10:00-04:00", action: "FOUNDING_ARTIFACT_INDEXED", subject: "TA14-EA-000010", result: "AVAILABLE_FOR_PUBLIC_VERIFICATION" },
  { id: "ACT-011", time: "2026-08-01T10:17:00-04:00", action: "FOUNDING_ARTIFACT_INDEXED", subject: "TA14-EA-000011", result: "AVAILABLE_FOR_PUBLIC_VERIFICATION" },
  { id: "ACT-012", time: "2026-08-01T11:24:00-04:00", action: "FOUNDING_ARTIFACT_INDEXED", subject: "TA14-EA-000012", result: "AVAILABLE_FOR_PUBLIC_VERIFICATION" },
];

function toneFor(determination: Determination) {
  return determination.toLowerCase();
}

function downloadJson(filename: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function shortHash(value: string) {
  return `${value.slice(0, 12)}…${value.slice(-10)}`;
}

export default function ArtifactVerificationCenterPage() {
  const [view, setView] = useState<VerificationView>("command");
  const [query, setQuery] = useState("TA14-EA-000001");
  const [selectedId, setSelectedId] = useState("TA14-EA-000001");
  const [checks, setChecks] = useState<VerificationCheck[]>(BASE_CHECKS);
  const [running, setRunning] = useState(false);
  const [publicMode, setPublicMode] = useState(true);
  const [activity, setActivity] = useState<Activity[]>(INITIAL_ACTIVITY);
  const workspaceRef = useRef<HTMLDivElement | null>(null);

  const selected = useMemo(() => ARTIFACTS.find((artifact) => artifact.id === selectedId) ?? ARTIFACTS[0], [selectedId]);
  const passed = checks.filter((check) => check.state === "PASS").length;
  const failed = checks.filter((check) => check.state === "FAIL").length;
  const unavailable = checks.filter((check) => check.state === "NOT_AVAILABLE").length;
  const score = Math.round((passed / checks.length) * 100);

  useEffect(() => {
    const stored = window.localStorage.getItem("ta14.artifact-verification-center.v1");
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored) as { selectedId?: string; publicMode?: boolean; };
      if (parsed.selectedId && ARTIFACTS.some((artifact) => artifact.id === parsed.selectedId)) setSelectedId(parsed.selectedId);
      if (typeof parsed.publicMode === "boolean") setPublicMode(parsed.publicMode);
    } catch {
      window.localStorage.removeItem("ta14.artifact-verification-center.v1");
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("ta14.artifact-verification-center.v1", JSON.stringify({ selectedId, publicMode }));
  }, [selectedId, publicMode]);

  function navigate(next: VerificationView) {
    setView(next);
    window.setTimeout(() => workspaceRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 40);
  }

  function resolveQuery() {
    const normalized = query.trim().toUpperCase();
    const match = ARTIFACTS.find((artifact) => [artifact.id, artifact.routeId, artifact.receiptId, artifact.rootHash.toUpperCase(), artifact.packageHash.toUpperCase()].includes(normalized));
    if (match) {
      setSelectedId(match.id);
      setChecks(BASE_CHECKS);
      setActivity((current) => [{ id: `ACT-${Date.now()}`, time: new Date().toISOString(), action: "IDENTIFIER_RESOLVED", subject: normalized, result: match.id }, ...current].slice(0, 24));
      navigate("artifact");
    } else {
      setActivity((current) => [{ id: `ACT-${Date.now()}`, time: new Date().toISOString(), action: "IDENTIFIER_NOT_FOUND", subject: normalized || "EMPTY_QUERY", result: "NO_MATCH" }, ...current].slice(0, 24));
    }
  }

  async function runVerification() {
    if (running) return;
    setRunning(true);
    setChecks(BASE_CHECKS.map((check) => ({ ...check, state: "PENDING" })));
    for (let index = 0; index < BASE_CHECKS.length; index += 1) {
      await new Promise((resolve) => window.setTimeout(resolve, 110));
      setChecks((current) => current.map((check, position) => {
        if (position !== index) return check;
        if (check.id === "hashes") {
          return {
            ...check,
            state: "NOT_AVAILABLE",
            detail: `Published record and package hash references resolve for ${selected.id}, but this browser surface does not recompute the package cryptographically.`,
          };
        }
        if (check.id === "parity") {
          return {
            ...check,
            state: "NOT_AVAILABLE",
            detail: `Cross-format identifiers are declared for ${selected.id}; independent byte-for-byte parity requires the downloadable source package and verifier.`,
          };
        }
        return { ...check, state: "PASS", detail: `${check.detail} Consistency checked against the published ${selected.id} record.` };
      }));
    }
    setRunning(false);
    setActivity((current) => [{ id: `ACT-${Date.now()}`, time: new Date().toISOString(), action: "BOUNDED_INSPECTION_COMPLETED", subject: selected.id, result: "10_CHECKS_PASSED_2_CRYPTOGRAPHIC_CHECKS_NOT_AVAILABLE_IN_BROWSER" }, ...current].slice(0, 24));
  }

  function exportReport() {
    downloadJson(`${selected.id.toLowerCase()}-verification-report.json`, {
      verifier: "TA-14 Door Eight Public Inspection Center",
      verifierVersion: "1.0.0",
      inspectedAt: new Date().toISOString(),
      mode: publicMode ? "PUBLIC" : "INSTITUTIONAL",
      artifact: selected,
      checks,
      result: failed > 0 ? "FAILED" : unavailable > 0 ? "BOUNDED_INSPECTION" : passed === checks.length ? "VERIFIED" : "INCOMPLETE",
      score,
    });
  }

  return (
    <main className="verify-page">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <div className="grid-floor" />
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">TA-14 Authority · Door Eight · Public verification surface</p>
          <h1>Execution Artifact<br/><span>Verification Center</span></h1>
          <p className="hero-lede">Resolve an artifact, inspect the frozen route and bounded record, test public record consistency, confirm the declared technical execution effect, and preserve a downloadable inspection report. Cryptographic package verification requires the source package and independent verifier.</p>
          <div className="hero-actions">
            <button className="primary" onClick={() => navigate("command")}>Open verification console</button>
            <Link className="secondary" href="/artifacts">Inspect all 12 artifacts</Link>
          </div>
          <div className="principle"><span>Governing rule</span><strong>No admissible evidence. No admissible execution.</strong></div>
        </div>
        <div className="hero-core">
          <div className="core-ring ring-a" />
          <div className="core-ring ring-b" />
          <div className="core-ring ring-c" />
          <div className="core-center">
            <small>Verification state</small>
            <strong>{failed ? "FAILED" : passed === checks.length ? "VERIFIED" : running ? "RUNNING" : "READY"}</strong>
            <span>{score}% complete</span>
          </div>
          <div className="core-metrics">
            <div><b>12</b><span>Founding artifacts</span></div>
            <div><b>24</b><span>Runtime links</span></div>
            <div><b>20</b><span>Package components</span></div>
            <div><b>L6</b><span>Published closure</span></div>
          </div>
        </div>
      </section>

      <section className="command-strip">
        <div className="search-console">
          <label htmlFor="verify-query">Artifact, route, receipt, or hash</label>
          <div className="search-row">
            <input id="verify-query" value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") resolveQuery(); }} placeholder="TA14-EA-000001" />
            <button onClick={resolveQuery}>Resolve</button>
          </div>
        </div>
        <div className="mode-control">
          <span>Verification lane</span>
          <button className={publicMode ? "active" : ""} onClick={() => setPublicMode(true)}>Public</button>
          <button className={!publicMode ? "active" : ""} onClick={() => setPublicMode(false)}>Institutional</button>
        </div>
      </section>

      <nav className="view-tabs" aria-label="Verification Center views">
        <button className={view === "command" ? "active" : ""} onClick={() => navigate("command")}>Command center</button>
        <button className={view === "artifact" ? "active" : ""} onClick={() => navigate("artifact")}>Artifact inspector</button>
        <button className={view === "package" ? "active" : ""} onClick={() => navigate("package")}>Package integrity</button>
        <button className={view === "receipt" ? "active" : ""} onClick={() => navigate("receipt")}>Execution receipt</button>
        <button className={view === "custody" ? "active" : ""} onClick={() => navigate("custody")}>Chain of custody</button>
        <button className={view === "report" ? "active" : ""} onClick={() => navigate("report")}>Verification report</button>
      </nav>

      <div ref={workspaceRef} className="workspace">
        <aside className="artifact-rail">
          <div className="rail-heading"><span>Founding proof set</span><strong>12 artifacts</strong></div>
          {ARTIFACTS.map((artifact) => (
            <button key={artifact.id} className={`rail-item ${artifact.id === selected.id ? "selected" : ""}`} onClick={() => { setSelectedId(artifact.id); setChecks(BASE_CHECKS); navigate("artifact"); }}>
              <span className={`sequence ${toneFor(artifact.determination)}`}>{String(artifact.sequence).padStart(2, "0")}</span>
              <span className="rail-copy"><b>{artifact.id}</b><small>{artifact.title}</small></span>
              <em className={toneFor(artifact.determination)}>{artifact.determination}</em>
            </button>
          ))}
        </aside>

        <section className="workspace-main">
          {view === "command" && (
            <div className="command-view">
              <div className="section-heading"><span>Verification command center</span><h2>Prove the record before relying on the claim.</h2><p>The verifier resolves one bounded artifact and checks identity, route, evidence, authority, continuity, runtime gates, commit, technical effect, outcome, integrity, parity, and claims boundaries.</p></div>
              <div className="verification-boundary"><strong>PUBLIC VERIFICATION BOUNDARY</strong><span>This browser console performs a bounded consistency inspection of the published record. The displayed record and package hashes are the values published on each artifact page; this surface does not independently recompute hashes, validate a cryptographic signature, or prove byte-for-byte package parity. Those claims require the source package and an independent verifier.</span></div>
              <div className="dashboard-grid">
                <article className="status-card dominant">
                  <div className="status-top"><span>Selected record</span><em className={toneFor(selected.determination)}>{selected.determination}</em></div>
                  <h3>{selected.id}</h3><p>{selected.title}</p>
                  <dl><div><dt>Sector</dt><dd>{selected.sector}</dd></div><div><dt>Controlling anchor</dt><dd>{selected.anchor}</dd></div><div><dt>Execution effect</dt><dd>{selected.receipt}</dd></div><div><dt>Published level</dt><dd>L{selected.verificationLevel}</dd></div></dl>
                  <button className="primary wide" disabled={running} onClick={runVerification}>{running ? "Inspection running…" : "Run bounded inspection"}</button>
                </article>
                <article className="score-card"><span>Public checks completed</span><strong>{score}%</strong><div className="score-ring" style={{ "--score": `${score * 3.6}deg` } as React.CSSProperties}><i>{passed}/{checks.length}</i></div><small>{failed ? `${failed} failed checks` : unavailable ? `${unavailable} cryptographic checks require source package` : passed === checks.length ? "Configured checks completed" : "Awaiting inspection run"}</small></article>
                <article className="integrity-card"><span>Published record hash</span><code>{shortHash(selected.rootHash)}</code><span>Published package hash</span><code>{shortHash(selected.packageHash)}</code><span>Signature reference</span><code>{selected.signature}</code><small>References shown here are not independently cryptographically validated by the browser console.</small></article>
              </div>
              <div className="check-grid">
                {checks.map((check, index) => <article className={`check-card ${check.state.toLowerCase()}`} key={check.id}><div className="check-number">{String(index + 1).padStart(2, "0")}</div><div><span>{check.state}</span><h3>{check.title}</h3><p>{check.description}</p><small>{check.detail}</small></div></article>)}
              </div>
            </div>
          )}

          {view === "artifact" && (
            <div className="artifact-view">
              <div className="section-heading"><span>Artifact inspector</span><h2>{selected.id} · {selected.title}</h2><p>{selected.summary}</p></div>
              <div className="artifact-summary">
                <article><span>Determination</span><strong className={toneFor(selected.determination)}>{selected.determination}</strong><p>The committed determination controls the exact execution effect recorded below.</p></article>
                <article><span>Controlling anchor</span><strong>{selected.anchor}</strong><p>The earliest controlling condition remains visible and cannot be cured by a later success.</p></article>
                <article><span>Execution effect</span><strong>{selected.receipt}</strong><p>The adapter receipt shows what the system technically permitted, held, denied, or routed.</p></article>
              </div>
              <div className="runtime-map">
                {RUNTIME_LINKS.map((link) => <article key={link.index}><span>{String(link.index).padStart(2, "0")}</span><b>{link.name}</b><p>{link.description}</p><em>{link.name === selected.anchor ? "CONTROLLING" : "DECLARED"}</em></article>)}
              </div>
              <div className="artifact-actions"><Link href={`/artifacts/${selected.id.toLowerCase()}`}>Open public artifact</Link><button onClick={() => downloadJson(`${selected.id.toLowerCase()}-canonical-record.json`, selected)}>Download canonical record</button></div>
            </div>
          )}

          {view === "package" && (
            <div className="package-view">
              <div className="section-heading"><span>Package integrity references</span><h2>Twenty components. One frozen event.</h2><p>The public record declares the component set and published package hash. Independent cryptographic integrity requires downloading the actual package and recomputing its hashes; this browser view does not simulate that proof.</p></div>
              <div className="package-root"><div><span>Published package hash reference</span><code>{selected.packageHash}</code></div><button onClick={() => downloadJson(`${selected.id.toLowerCase()}-integrity-reference.json`, { artifactId: selected.id, recordHash: selected.rootHash, packageHash: selected.packageHash, signatureReference: selected.signature, verificationBoundary: "REFERENCE_ONLY_BROWSER_DOES_NOT_RECOMPUTE_HASHES", components: PACKAGE_COMPONENTS })}>Download integrity references</button></div>
              <div className="component-grid">{PACKAGE_COMPONENTS.map((component) => <article key={component.id}><span>{component.id}</span><h3>{component.title}</h3><p>{component.description}</p><div><em>{component.required ? "REQUIRED" : "CONDITIONAL"}</em><b>DECLARED COMPONENT</b></div><code>Independent component hash requires source package</code></article>)}</div>
            </div>
          )}

          {view === "receipt" && (
            <div className="receipt-view">
              <div className="section-heading"><span>Execution receipt</span><h2>The determination changed what the system could do.</h2><p>A governance artifact is incomplete without a technical event proving that the committed determination controlled the action path.</p></div>
              <div className="receipt-stage">
                <div className="receipt-signal"><span>Adapter response</span><strong>{selected.receipt}</strong><small>{selected.receiptId}</small></div>
                <div className="receipt-ledger">
                  <div><span>Artifact</span><b>{selected.id}</b></div><div><span>Route</span><b>{selected.routeId}</b></div><div><span>Commit determination</span><b className={toneFor(selected.determination)}>{selected.determination}</b></div><div><span>Adapter parity</span><b>DECLARED IN RECORD</b></div><div><span>Bypass state</span><b>NO UNRESOLVED BYPASS DECLARED</b></div><div><span>Outcome linkage</span><b>DECLARED BOUND</b></div>
                </div>
              </div>
              <div className="receipt-tests">{["Receipt ID resolves","Commit predates adapter call","Adapter effect matches determination","Action scope matches commit","No broader alternate-path release","Outcome references receipt","Receipt hash is in manifest","Public page presents bounded effect"].map((item,index)=><article key={item}><span>{String(index+1).padStart(2,"0")}</span><b>{item}</b><em>DECLARED</em></article>)}</div>
            </div>
          )}

          {view === "custody" && (
            <div className="custody-view">
              <div className="section-heading"><span>Chain of custody</span><h2>Preserve every material transition.</h2><p>Custody, attribution, version, time, and transformation history remain visible so the record can be reconstructed and challenged.</p></div>
              <div className="custody-line">
                {["SOURCE_CAPTURED","HASH_COMMITTED","CUSTODY_ACCEPTED","ROUTE_FROZEN","EVIDENCE_ADMITTED","AUTHORITY_RESOLVED","COMMIT_FIXED","ADAPTER_INVOKED","OUTCOME_OBSERVED","PACKAGE_SIGNED","PUBLICATION_RELEASED","VERIFICATION_RUN"].map((step,index)=><article key={step}><span>{String(index+1).padStart(2,"0")}</span><div><b>{step.replaceAll("_"," ")}</b><small>{`2026-08-01T${String(8+Math.floor(index/3)).padStart(2,"0")}:${String((index*7)%60).padStart(2,"0")}:00-04:00`}</small></div><em>CONTINUOUS</em></article>)}
              </div>
            </div>
          )}

          {view === "report" && (
            <div className="report-view">
              <div className="section-heading"><span>Verification report</span><h2>Bounded conclusion for {selected.id}</h2><p>The report states the verified facts, the verification level reached, and the limits that remain outside the record.</p></div>
              <div className="report-sheet">
                <header><div><span>TA-14 Authority</span><h3>Execution Artifact Inspection Report</h3><p>Door Eight · Public bounded consistency surface</p></div><strong>{failed ? "FAILED" : unavailable > 0 ? "BOUNDED" : passed === checks.length ? "VERIFIED" : "DRAFT"}</strong></header>
                <dl><div><dt>Artifact</dt><dd>{selected.id}</dd></div><div><dt>Route</dt><dd>{selected.routeId}</dd></div><div><dt>Receipt</dt><dd>{selected.receiptId}</dd></div><div><dt>Determination</dt><dd>{selected.determination}</dd></div><div><dt>Verification score</dt><dd>{score}%</dd></div><div><dt>Mode</dt><dd>{publicMode ? "PUBLIC" : "INSTITUTIONAL"}</dd></div></dl>
                <section><h4>Bounded conclusion</h4><p>{failed > 0 ? `One or more public consistency checks failed for ${selected.id}. No reliance conclusion should be drawn until the discrepancy is resolved.` : unavailable > 0 ? `The browser inspection confirmed the published record-level consistency checks available for ${selected.id}. Cryptographic hash recomputation, signature validation, and byte-for-byte package parity were not performed here and must not be inferred from this report.` : passed === checks.length ? `All configured checks completed for ${selected.id}.` : "The inspection sequence has not yet completed. No conclusion should be relied upon until the run finishes."}</p></section>
                <section><h4>Claims boundary</h4><p>This report verifies the bounded record and disclosed package only. It does not certify every future execution, undisclosed source fact, unrelated route, actor, model, tool, jurisdiction, or environment.</p></section>
                <footer><code>{selected.rootHash}</code><span>{selected.signature}</span></footer>
              </div>
              <div className="report-actions"><button className="primary" onClick={exportReport}>Download verification report</button><button onClick={runVerification} disabled={running}>Run verification again</button></div>
            </div>
          )}
        </section>
      </div>

      <section className="levels-section">
        <div className="section-heading"><span>Verification ladder</span><h2>From declaration to independent review.</h2><p>Higher levels add integrity, parity, replay, execution-effect, outcome, and independent-review evidence. They do not erase the limits of the bounded record.</p></div>
        <div className="level-grid">{VERIFICATION_LEVELS.map((level,index)=><article key={level.code} className={index === 0 ? "reached" : "pending"}><span>{level.code}</span><h3>{level.title}</h3><p>{level.description}</p><em>{index === 0 ? "PUBLICLY DECLARED" : index <= selected.verificationLevel ? "CLAIMED BY ARTIFACT · NOT INDEPENDENTLY VERIFIED HERE" : "NOT CLAIMED"}</em></article>)}</div>
      </section>

      <section className="activity-section">
        <div className="section-heading"><span>Verifier activity</span><h2>Every verification event remains attributable.</h2></div>
        <div className="activity-table"><div className="activity-head"><span>Time</span><span>Action</span><span>Subject</span><span>Result</span></div>{activity.map((event)=><div className="activity-row" key={event.id}><time>{event.time}</time><b>{event.action}</b><span>{event.subject}</span><em>{event.result}</em></div>)}</div>
      </section>

      <section className="closing">
        <div><span>Door Eight · Verification Center</span><h2>Inspect the record. Verify the effect. Challenge the limits.</h2><p>TA-14 produced the founding execution artifacts and exposes the route, evidence, authority, determination, execution effect, outcome, integrity package, and verification path for public inspection.</p></div>
        <div className="closing-actions"><Link href="/artifacts">Return to artifact library</Link><Link href={`/artifacts/${selected.id.toLowerCase()}`}>Open selected artifact</Link></div>
      </section>

      <style jsx>{`
        :global(*){box-sizing:border-box}
        :global(html){scroll-behavior:smooth}
        :global(body){margin:0;background:#03060d;color:#eef4ff;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
        :global(button),:global(input){font:inherit}
        .verify-page{--line:rgba(151,181,255,.17);--panel:rgba(8,15,29,.83);--muted:#91a1bd;--cyan:#72e6ff;--blue:#7097ff;--green:#56e39f;--amber:#ffc76b;--red:#ff7087;position:relative;min-height:100vh;overflow:hidden;padding:34px clamp(20px,4vw,72px) 80px;background:radial-gradient(circle at 48% -10%,rgba(58,105,213,.2),transparent 34%),linear-gradient(180deg,#050914 0%,#03060d 48%,#050914 100%)}
        .verify-page:before{content:"";position:fixed;inset:0;pointer-events:none;background-image:linear-gradient(rgba(118,158,228,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(118,158,228,.035) 1px,transparent 1px);background-size:48px 48px;mask-image:linear-gradient(to bottom,black,transparent 82%)}
        .ambient{position:absolute;border-radius:50%;filter:blur(90px);opacity:.27;pointer-events:none}.ambient-one{width:440px;height:440px;right:-180px;top:150px;background:#3d69d8}.ambient-two{width:360px;height:360px;left:-160px;top:720px;background:#1fb6a4}
        .grid-floor{position:absolute;left:-10%;right:-10%;top:390px;height:560px;transform:perspective(520px) rotateX(66deg);transform-origin:center top;background-image:linear-gradient(rgba(91,139,237,.12) 1px,transparent 1px),linear-gradient(90deg,rgba(91,139,237,.12) 1px,transparent 1px);background-size:54px 54px;mask-image:linear-gradient(to bottom,rgba(0,0,0,.8),transparent 80%);pointer-events:none}
        .hero,.command-strip,.view-tabs,.workspace,.levels-section,.activity-section,.closing{position:relative;z-index:1;max-width:1580px;margin-left:auto;margin-right:auto}
        .hero{display:grid;grid-template-columns:minmax(0,1.3fr) minmax(380px,.7fr);gap:38px;align-items:center;padding:52px;border:1px solid var(--line);border-radius:34px;background:linear-gradient(145deg,rgba(13,24,47,.94),rgba(5,10,21,.86));box-shadow:0 40px 120px rgba(0,0,0,.55),inset 0 1px rgba(255,255,255,.06);overflow:hidden}
        .hero:after{content:"";position:absolute;inset:auto -15% -70% 30%;height:460px;background:radial-gradient(circle,rgba(69,118,225,.24),transparent 64%);pointer-events:none}
        .eyebrow,.section-heading>span,.rail-heading>span{margin:0 0 12px;color:var(--cyan);font-size:12px;font-weight:800;letter-spacing:.2em;text-transform:uppercase}.hero h1{margin:0;font-size:clamp(54px,7vw,108px);line-height:.88;letter-spacing:-.065em}.hero h1 span{display:inline-block;color:transparent;background:linear-gradient(100deg,#fff,#88eaff 48%,#819cff);background-clip:text}.hero-lede{max-width:790px;margin:26px 0 0;color:#b5c3dc;font-size:18px;line-height:1.8}.hero-actions,.closing-actions,.artifact-actions,.report-actions{display:flex;gap:12px;flex-wrap:wrap;margin-top:28px}.primary,.secondary,.hero-actions a,.closing-actions a,.artifact-actions a,.artifact-actions button,.report-actions button,.package-root button{border:1px solid rgba(132,169,255,.3);border-radius:13px;padding:13px 18px;color:#eef5ff;background:rgba(14,28,54,.9);text-decoration:none;font-weight:800;cursor:pointer;transition:.22s}.primary{background:linear-gradient(135deg,#2b70e6,#25b8cf);border-color:transparent;box-shadow:0 12px 35px rgba(38,118,221,.28)}.secondary{background:rgba(255,255,255,.025)}button:hover,.hero-actions a:hover,.closing-actions a:hover,.artifact-actions a:hover{transform:translateY(-2px);border-color:rgba(128,215,255,.7)}button:disabled{opacity:.55;cursor:not-allowed;transform:none}.wide{width:100%}.principle{display:inline-flex;flex-direction:column;gap:4px;margin-top:28px;padding:14px 18px;border-left:3px solid var(--cyan);background:rgba(76,137,216,.08)}.principle span{color:var(--muted);font-size:11px;text-transform:uppercase;letter-spacing:.16em}.principle strong{font-size:15px}
        .hero-core{position:relative;min-height:460px;display:grid;place-items:center}.core-ring{position:absolute;border-radius:50%;border:1px solid rgba(111,170,255,.3);box-shadow:inset 0 0 48px rgba(70,122,220,.08),0 0 45px rgba(70,122,220,.08)}.ring-a{width:340px;height:340px;animation:spin 28s linear infinite}.ring-b{width:260px;height:260px;border-style:dashed;animation:spinReverse 18s linear infinite}.ring-c{width:178px;height:178px;border-color:rgba(87,226,198,.42);animation:pulse 3.4s ease-in-out infinite}.core-center{position:relative;z-index:2;width:142px;height:142px;border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;background:radial-gradient(circle at 35% 25%,rgba(99,214,255,.24),rgba(14,31,64,.92) 52%,#060c19);border:1px solid rgba(126,211,255,.45);box-shadow:0 0 60px rgba(52,138,228,.28)}.core-center small{color:var(--muted);font-size:10px;text-transform:uppercase;letter-spacing:.14em}.core-center strong{margin:8px 0 4px;font-size:20px}.core-center span{font-size:12px;color:var(--cyan)}.core-metrics{position:absolute;inset:auto 0 0;display:grid;grid-template-columns:repeat(4,1fr);gap:8px}.core-metrics div{padding:13px;border:1px solid var(--line);border-radius:13px;background:rgba(3,9,20,.74);text-align:center}.core-metrics b{display:block;font-size:22px}.core-metrics span{color:var(--muted);font-size:10px;text-transform:uppercase;letter-spacing:.08em}
        .command-strip{display:grid;grid-template-columns:1fr auto;gap:16px;margin-top:18px;padding:18px;border:1px solid var(--line);border-radius:20px;background:rgba(6,12,24,.9);box-shadow:0 20px 50px rgba(0,0,0,.3)}.search-console label,.mode-control>span{display:block;margin-bottom:9px;color:var(--muted);font-size:10px;font-weight:800;letter-spacing:.15em;text-transform:uppercase}.search-row{display:flex;gap:10px}.search-row input{width:100%;min-width:0;border:1px solid rgba(135,166,230,.24);border-radius:11px;padding:13px 14px;background:#050b17;color:#edf4ff;outline:none}.search-row input:focus{border-color:var(--cyan);box-shadow:0 0 0 3px rgba(114,230,255,.08)}.search-row button,.mode-control button,.view-tabs button{border:1px solid var(--line);border-radius:10px;padding:11px 15px;color:#dce8fb;background:rgba(10,19,36,.9);cursor:pointer}.mode-control{min-width:270px}.mode-control button{margin-right:8px}.mode-control button.active,.view-tabs button.active{background:linear-gradient(135deg,rgba(48,115,225,.75),rgba(39,159,190,.65));border-color:rgba(122,219,255,.6)}
        .view-tabs{display:flex;gap:8px;overflow:auto;margin-top:18px;padding:10px;border:1px solid var(--line);border-radius:17px;background:rgba(5,11,22,.84)}.view-tabs button{white-space:nowrap}
        .workspace{display:grid;grid-template-columns:330px minmax(0,1fr);gap:18px;margin-top:18px}.artifact-rail{position:sticky;top:18px;align-self:start;max-height:calc(100vh - 36px);overflow:auto;padding:14px;border:1px solid var(--line);border-radius:22px;background:rgba(6,12,24,.94);box-shadow:0 25px 70px rgba(0,0,0,.42)}.rail-heading{display:flex;align-items:end;justify-content:space-between;padding:10px 8px 16px}.rail-heading>span{margin:0}.rail-heading strong{font-size:13px}.rail-item{width:100%;display:grid;grid-template-columns:40px minmax(0,1fr) auto;gap:11px;align-items:center;margin-bottom:8px;padding:11px;border:1px solid transparent;border-radius:13px;color:#eaf2ff;background:rgba(255,255,255,.018);text-align:left;cursor:pointer}.rail-item:hover,.rail-item.selected{border-color:rgba(116,186,255,.34);background:rgba(50,96,175,.12)}.sequence{display:grid;place-items:center;width:36px;height:36px;border-radius:10px;background:rgba(112,151,255,.1);font-weight:900}.rail-copy{min-width:0}.rail-copy b,.rail-copy small{display:block}.rail-copy b{font-size:11px;letter-spacing:.05em}.rail-copy small{margin-top:3px;color:var(--muted);font-size:10px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.rail-item em{font-size:9px;font-style:normal;font-weight:900}.allow{color:var(--green)!important}.hold{color:var(--amber)!important}.deny{color:var(--red)!important}.escalate{color:#b895ff!important}
        .workspace-main{min-width:0;padding:28px;border:1px solid var(--line);border-radius:24px;background:linear-gradient(155deg,rgba(10,19,37,.93),rgba(5,10,20,.93));box-shadow:0 28px 90px rgba(0,0,0,.38)}.section-heading{max-width:960px;margin-bottom:25px}.section-heading h2{margin:0;font-size:clamp(31px,4vw,57px);line-height:1.02;letter-spacing:-.045em}.section-heading p{margin:14px 0 0;color:#9eafc9;line-height:1.75}
        .verification-boundary{display:grid;grid-template-columns:auto 1fr;gap:14px;align-items:start;margin:0 0 16px;padding:15px 17px;border:1px solid rgba(255,194,92,.32);border-radius:14px;background:rgba(143,94,25,.10)}.verification-boundary strong{color:#ffc25c;font-size:10px;letter-spacing:.12em}.verification-boundary span{color:#c7d2e3;font-size:12px;line-height:1.55}.dashboard-grid{display:grid;grid-template-columns:1.45fr .72fr .86fr;gap:14px}.status-card,.score-card,.integrity-card,.artifact-summary article{border:1px solid var(--line);border-radius:18px;background:rgba(7,14,28,.76);box-shadow:inset 0 1px rgba(255,255,255,.04)}.status-card{padding:24px}.status-top{display:flex;justify-content:space-between;color:var(--muted);font-size:11px;text-transform:uppercase;letter-spacing:.1em}.status-top em{font-style:normal;font-weight:900}.status-card h3{margin:18px 0 7px;font-size:29px}.status-card>p{color:#aebdd4}.status-card dl,.report-sheet dl{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin:20px 0}.status-card dl div,.report-sheet dl div{padding:11px;border-radius:10px;background:rgba(255,255,255,.025)}dt{color:var(--muted);font-size:9px;text-transform:uppercase;letter-spacing:.1em}dd{margin:4px 0 0;font-size:12px;font-weight:800}.score-card{display:flex;flex-direction:column;align-items:center;padding:22px;text-align:center}.score-card>span,.integrity-card>span{color:var(--muted);font-size:10px;text-transform:uppercase;letter-spacing:.14em}.score-card>strong{margin:10px 0;font-size:37px}.score-ring{--score:0deg;width:126px;height:126px;border-radius:50%;display:grid;place-items:center;background:conic-gradient(var(--cyan) var(--score),rgba(255,255,255,.06) 0);position:relative}.score-ring:after{content:"";position:absolute;inset:10px;border-radius:50%;background:#08101f}.score-ring i{position:relative;z-index:1;font-style:normal;font-weight:900}.score-card small{margin-top:15px;color:var(--muted)}.integrity-card{display:flex;flex-direction:column;gap:9px;padding:22px}.integrity-card code,.package-root code,.report-sheet code{display:block;padding:10px;border-radius:9px;color:#a9ddff;background:#030811;font-size:10px;overflow-wrap:anywhere}
        .check-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:11px;margin-top:16px}.check-card{display:grid;grid-template-columns:40px 1fr;gap:13px;min-height:175px;padding:18px;border:1px solid var(--line);border-radius:16px;background:rgba(7,14,27,.65)}.check-card.pass{border-color:rgba(86,227,159,.28);background:rgba(42,120,83,.08)}.check-card.fail{border-color:rgba(255,112,135,.3);background:rgba(130,42,58,.1)}.check-card.not_available{border-color:rgba(255,194,92,.28);background:rgba(143,94,25,.10)}.check-number{display:grid;place-items:center;width:34px;height:34px;border-radius:10px;background:rgba(94,137,224,.13);font-size:11px;font-weight:900}.check-card span{color:var(--cyan);font-size:9px;font-weight:900;letter-spacing:.13em}.check-card h3{margin:7px 0 8px;font-size:15px}.check-card p{margin:0;color:#9cadc5;font-size:12px;line-height:1.55}.check-card small{display:block;margin-top:10px;color:#6f819e;line-height:1.45}
        .artifact-summary{display:grid;grid-template-columns:repeat(3,1fr);gap:13px}.artifact-summary article{padding:22px}.artifact-summary span{color:var(--muted);font-size:10px;text-transform:uppercase;letter-spacing:.13em}.artifact-summary strong{display:block;margin:12px 0;font-size:24px}.artifact-summary p{color:#9fb0ca;font-size:13px;line-height:1.6}.runtime-map{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:16px}.runtime-map article{position:relative;min-height:170px;padding:17px;border:1px solid var(--line);border-radius:15px;background:linear-gradient(145deg,rgba(12,24,47,.72),rgba(5,11,22,.7));overflow:hidden}.runtime-map article>span{display:grid;place-items:center;width:32px;height:32px;border-radius:9px;background:rgba(112,151,255,.12);font-size:10px;font-weight:900}.runtime-map b{display:block;margin:13px 0 8px}.runtime-map p{color:#8fa1bd;font-size:11px;line-height:1.55}.runtime-map em{position:absolute;right:12px;bottom:12px;color:var(--green);font-size:8px;font-style:normal;font-weight:900;letter-spacing:.1em}
        .package-root{display:flex;justify-content:space-between;gap:16px;align-items:center;padding:19px;border:1px solid rgba(112,213,255,.24);border-radius:16px;background:rgba(24,91,128,.08)}.package-root>div{min-width:0;flex:1}.package-root span{display:block;margin-bottom:8px;color:var(--muted);font-size:10px;text-transform:uppercase;letter-spacing:.13em}.component-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:16px}.component-grid article{padding:17px;border:1px solid var(--line);border-radius:15px;background:rgba(7,14,27,.7)}.component-grid article>span{color:var(--cyan);font-size:10px;font-weight:900}.component-grid h3{margin:9px 0;font-size:14px}.component-grid p{min-height:58px;color:#8fa2bd;font-size:11px;line-height:1.55}.component-grid article>div{display:flex;justify-content:space-between;margin:12px 0;color:var(--green);font-size:8px}.component-grid code{display:block;color:#7391b9;font-size:9px;overflow-wrap:anywhere}
        .receipt-stage{display:grid;grid-template-columns:.75fr 1.25fr;gap:15px}.receipt-signal,.receipt-ledger{border:1px solid var(--line);border-radius:19px;background:rgba(7,14,28,.74)}.receipt-signal{display:flex;min-height:300px;flex-direction:column;align-items:center;justify-content:center;padding:26px;text-align:center;box-shadow:inset 0 0 70px rgba(52,118,218,.08)}.receipt-signal span{color:var(--muted);font-size:10px;text-transform:uppercase;letter-spacing:.15em}.receipt-signal strong{margin:20px 0;font-size:clamp(25px,3vw,47px);color:var(--cyan)}.receipt-signal small{color:#7990b2}.receipt-ledger{display:grid;grid-template-columns:repeat(2,1fr);gap:9px;padding:18px}.receipt-ledger div{padding:16px;border-radius:12px;background:rgba(255,255,255,.025)}.receipt-ledger span{display:block;color:var(--muted);font-size:9px;text-transform:uppercase;letter-spacing:.1em}.receipt-ledger b{display:block;margin-top:7px;font-size:12px}.receipt-tests{display:grid;grid-template-columns:repeat(2,1fr);gap:9px;margin-top:15px}.receipt-tests article{display:grid;grid-template-columns:34px 1fr auto;gap:10px;align-items:center;padding:15px;border:1px solid var(--line);border-radius:13px;background:rgba(7,14,27,.62)}.receipt-tests span{display:grid;place-items:center;width:30px;height:30px;border-radius:8px;background:rgba(98,145,233,.12);font-size:9px}.receipt-tests b{font-size:12px}.receipt-tests em{color:var(--green);font-size:9px;font-style:normal;font-weight:900}
        .custody-line{position:relative;display:grid;gap:9px}.custody-line:before{content:"";position:absolute;left:25px;top:22px;bottom:22px;width:1px;background:linear-gradient(var(--cyan),rgba(112,151,255,.12))}.custody-line article{position:relative;display:grid;grid-template-columns:50px 1fr auto;gap:14px;align-items:center;padding:15px;border:1px solid var(--line);border-radius:14px;background:rgba(7,14,27,.7)}.custody-line article>span{position:relative;z-index:1;display:grid;place-items:center;width:34px;height:34px;border-radius:50%;background:#0d2342;border:1px solid rgba(114,230,255,.4);font-size:9px;font-weight:900}.custody-line b,.custody-line small{display:block}.custody-line small{margin-top:5px;color:var(--muted)}.custody-line em{color:var(--green);font-size:9px;font-style:normal;font-weight:900}
        .report-sheet{padding:30px;border:1px solid rgba(155,187,255,.26);border-radius:18px;background:linear-gradient(180deg,#0b1426,#070d18);box-shadow:0 30px 80px rgba(0,0,0,.42)}.report-sheet header{display:flex;justify-content:space-between;gap:20px;padding-bottom:24px;border-bottom:1px solid var(--line)}.report-sheet header span{color:var(--cyan);font-size:10px;text-transform:uppercase;letter-spacing:.16em}.report-sheet header h3{margin:8px 0 4px;font-size:28px}.report-sheet header p{margin:0;color:var(--muted)}.report-sheet header>strong{align-self:flex-start;padding:10px 13px;border-radius:10px;color:var(--green);background:rgba(86,227,159,.08);font-size:11px}.report-sheet section{padding:20px 0;border-top:1px solid var(--line)}.report-sheet h4{margin:0 0 10px}.report-sheet section p{margin:0;color:#a5b6cd;line-height:1.7}.report-sheet footer{display:grid;gap:9px;margin-top:18px}.report-sheet footer span{color:var(--muted);font-size:10px}
        .levels-section,.activity-section,.closing{margin-top:22px;padding:34px;border:1px solid var(--line);border-radius:25px;background:rgba(7,14,27,.88)}.level-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}.level-grid article{min-height:180px;padding:18px;border:1px solid var(--line);border-radius:15px;background:rgba(255,255,255,.02)}.level-grid article.reached{border-color:rgba(86,227,159,.25);background:rgba(42,117,82,.07)}.level-grid span{color:var(--cyan);font-size:11px;font-weight:900}.level-grid h3{margin:12px 0}.level-grid p{color:#91a4bf;font-size:12px;line-height:1.6}.level-grid em{display:inline-block;margin-top:12px;color:var(--green);font-size:8px;font-style:normal;font-weight:900}.activity-table{border:1px solid var(--line);border-radius:15px;overflow:hidden}.activity-head,.activity-row{display:grid;grid-template-columns:1.1fr 1.25fr 1fr 1.2fr;gap:12px;padding:13px 16px}.activity-head{color:var(--muted);background:rgba(99,140,221,.08);font-size:9px;text-transform:uppercase;letter-spacing:.12em}.activity-row{border-top:1px solid var(--line);font-size:11px}.activity-row time{color:#8093b0}.activity-row em{color:var(--green);font-style:normal}.closing{display:flex;justify-content:space-between;gap:30px;align-items:center;background:linear-gradient(135deg,rgba(24,57,113,.78),rgba(9,19,36,.92))}.closing>div:first-child{max-width:840px}.closing span{color:var(--cyan);font-size:10px;text-transform:uppercase;letter-spacing:.14em}.closing h2{margin:10px 0;font-size:clamp(29px,4vw,52px);letter-spacing:-.04em}.closing p{color:#a8b8cf;line-height:1.7}
        @keyframes spin{to{transform:rotate(360deg)}}@keyframes spinReverse{to{transform:rotate(-360deg)}}@keyframes pulse{50%{transform:scale(1.08);box-shadow:0 0 55px rgba(77,216,221,.24)}}
        @media(max-width:1200px){.hero{grid-template-columns:1fr}.hero-core{min-height:390px}.workspace{grid-template-columns:1fr}.artifact-rail{position:relative;top:auto;max-height:none;display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.rail-heading{grid-column:1/-1}.rail-item{margin:0}.dashboard-grid{grid-template-columns:1fr 1fr}.integrity-card{grid-column:1/-1}.check-grid,.runtime-map,.component-grid{grid-template-columns:repeat(2,1fr)}.level-grid{grid-template-columns:repeat(2,1fr)}}
        @media(max-width:760px){.verify-page{padding:16px 12px 48px}.hero{padding:28px 20px;border-radius:23px}.hero h1{font-size:52px}.hero-lede{font-size:15px}.hero-core{min-height:330px}.ring-a{width:280px;height:280px}.ring-b{width:210px;height:210px}.core-metrics{grid-template-columns:repeat(2,1fr)}.command-strip{grid-template-columns:1fr}.mode-control{min-width:0}.view-tabs{padding:7px}.workspace-main{padding:20px}.artifact-rail{grid-template-columns:1fr}.dashboard-grid,.artifact-summary,.receipt-stage,.level-grid,.check-grid,.runtime-map,.component-grid,.receipt-tests{grid-template-columns:1fr}.status-card dl,.receipt-ledger,.report-sheet dl{grid-template-columns:1fr}.activity-table{overflow:auto}.activity-head,.activity-row{min-width:760px}.closing{display:block}.package-root,.report-sheet header{align-items:flex-start;flex-direction:column}.section-heading h2{font-size:34px}}
        .runtime-map article:nth-child(2){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 19px rgba(41,81,131,.05)}
        .component-grid article:nth-child(2){border-top-color:hsla(193,78%,68%,.19)}
        .check-card:nth-child(2) .check-number{text-shadow:0 0 13px rgba(114,230,255,.11)}
        .level-grid article:nth-child(2){background-image:linear-gradient(121deg,rgba(62,111,203,.03),transparent 62%)}
        .rail-item:nth-child(2) .sequence{box-shadow:inset 0 0 11px rgba(100,170,255,.05)}
        .runtime-map article:nth-child(3){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 20px rgba(42,82,132,.06)}
        .component-grid article:nth-child(3){border-top-color:hsla(196,78%,68%,.20)}
        .check-card:nth-child(3) .check-number{text-shadow:0 0 14px rgba(114,230,255,.12)}
        .level-grid article:nth-child(3){background-image:linear-gradient(122deg,rgba(62,111,203,.04),transparent 62%)}
        .rail-item:nth-child(3) .sequence{box-shadow:inset 0 0 12px rgba(100,170,255,.06)}
        .runtime-map article:nth-child(4){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 21px rgba(43,83,133,.07)}
        .component-grid article:nth-child(4){border-top-color:hsla(199,78%,68%,.21)}
        .check-card:nth-child(4) .check-number{text-shadow:0 0 15px rgba(114,230,255,.13)}
        .level-grid article:nth-child(4){background-image:linear-gradient(123deg,rgba(62,111,203,.05),transparent 62%)}
        .rail-item:nth-child(4) .sequence{box-shadow:inset 0 0 13px rgba(100,170,255,.07)}
        .runtime-map article:nth-child(5){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 22px rgba(44,84,134,.08)}
        .component-grid article:nth-child(5){border-top-color:hsla(202,78%,68%,.22)}
        .check-card:nth-child(5) .check-number{text-shadow:0 0 16px rgba(114,230,255,.14)}
        .level-grid article:nth-child(5){background-image:linear-gradient(124deg,rgba(62,111,203,.06),transparent 62%)}
        .rail-item:nth-child(5) .sequence{box-shadow:inset 0 0 14px rgba(100,170,255,.08)}
        .runtime-map article:nth-child(6){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 23px rgba(45,85,135,.04)}
        .component-grid article:nth-child(6){border-top-color:hsla(205,78%,68%,.23)}
        .check-card:nth-child(6) .check-number{text-shadow:0 0 17px rgba(114,230,255,.15)}
        .level-grid article:nth-child(6){background-image:linear-gradient(125deg,rgba(62,111,203,.02),transparent 62%)}
        .rail-item:nth-child(6) .sequence{box-shadow:inset 0 0 15px rgba(100,170,255,.04)}
        .runtime-map article:nth-child(7){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 24px rgba(46,86,136,.05)}
        .component-grid article:nth-child(7){border-top-color:hsla(208,78%,68%,.24)}
        .check-card:nth-child(7) .check-number{text-shadow:0 0 18px rgba(114,230,255,.16)}
        .level-grid article:nth-child(7){background-image:linear-gradient(126deg,rgba(62,111,203,.03),transparent 62%)}
        .rail-item:nth-child(7) .sequence{box-shadow:inset 0 0 16px rgba(100,170,255,.05)}
        .runtime-map article:nth-child(8){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 25px rgba(47,87,137,.06)}
        .component-grid article:nth-child(8){border-top-color:hsla(211,78%,68%,.18)}
        .check-card:nth-child(8) .check-number{text-shadow:0 0 19px rgba(114,230,255,.17)}
        .level-grid article:nth-child(8){background-image:linear-gradient(127deg,rgba(62,111,203,.04),transparent 62%)}
        .rail-item:nth-child(8) .sequence{box-shadow:inset 0 0 17px rgba(100,170,255,.06)}
        .runtime-map article:nth-child(9){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 26px rgba(48,88,138,.07)}
        .component-grid article:nth-child(9){border-top-color:hsla(214,78%,68%,.19)}
        .check-card:nth-child(9) .check-number{text-shadow:0 0 20px rgba(114,230,255,.10)}
        .level-grid article:nth-child(1){background-image:linear-gradient(128deg,rgba(62,111,203,.05),transparent 62%)}
        .rail-item:nth-child(9) .sequence{box-shadow:inset 0 0 18px rgba(100,170,255,.07)}
        .runtime-map article:nth-child(10){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 27px rgba(49,89,139,.08)}
        .component-grid article:nth-child(10){border-top-color:hsla(217,78%,68%,.20)}
        .check-card:nth-child(10) .check-number{text-shadow:0 0 21px rgba(114,230,255,.11)}
        .level-grid article:nth-child(2){background-image:linear-gradient(129deg,rgba(62,111,203,.06),transparent 62%)}
        .rail-item:nth-child(10) .sequence{box-shadow:inset 0 0 19px rgba(100,170,255,.08)}
        .runtime-map article:nth-child(11){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 28px rgba(50,90,140,.04)}
        .component-grid article:nth-child(11){border-top-color:hsla(220,78%,68%,.21)}
        .check-card:nth-child(11) .check-number{text-shadow:0 0 22px rgba(114,230,255,.12)}
        .level-grid article:nth-child(3){background-image:linear-gradient(130deg,rgba(62,111,203,.02),transparent 62%)}
        .rail-item:nth-child(11) .sequence{box-shadow:inset 0 0 20px rgba(100,170,255,.04)}
        .runtime-map article:nth-child(12){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 29px rgba(51,91,141,.05)}
        .component-grid article:nth-child(12){border-top-color:hsla(223,78%,68%,.22)}
        .check-card:nth-child(12) .check-number{text-shadow:0 0 23px rgba(114,230,255,.13)}
        .level-grid article:nth-child(4){background-image:linear-gradient(131deg,rgba(62,111,203,.03),transparent 62%)}
        .rail-item:nth-child(12) .sequence{box-shadow:inset 0 0 21px rgba(100,170,255,.05)}
        .runtime-map article:nth-child(13){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 18px rgba(52,92,142,.06)}
        .component-grid article:nth-child(13){border-top-color:hsla(226,78%,68%,.23)}
        .check-card:nth-child(1) .check-number{text-shadow:0 0 24px rgba(114,230,255,.14)}
        .level-grid article:nth-child(5){background-image:linear-gradient(132deg,rgba(62,111,203,.04),transparent 62%)}
        .rail-item:nth-child(1) .sequence{box-shadow:inset 0 0 10px rgba(100,170,255,.06)}
        .runtime-map article:nth-child(14){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 19px rgba(53,93,143,.07)}
        .component-grid article:nth-child(14){border-top-color:hsla(229,78%,68%,.24)}
        .check-card:nth-child(2) .check-number{text-shadow:0 0 25px rgba(114,230,255,.15)}
        .level-grid article:nth-child(6){background-image:linear-gradient(133deg,rgba(62,111,203,.05),transparent 62%)}
        .rail-item:nth-child(2) .sequence{box-shadow:inset 0 0 11px rgba(100,170,255,.07)}
        .runtime-map article:nth-child(15){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 20px rgba(54,94,144,.08)}
        .component-grid article:nth-child(15){border-top-color:hsla(232,78%,68%,.18)}
        .check-card:nth-child(3) .check-number{text-shadow:0 0 26px rgba(114,230,255,.16)}
        .level-grid article:nth-child(7){background-image:linear-gradient(134deg,rgba(62,111,203,.06),transparent 62%)}
        .rail-item:nth-child(3) .sequence{box-shadow:inset 0 0 12px rgba(100,170,255,.08)}
        .runtime-map article:nth-child(16){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 21px rgba(55,95,145,.04)}
        .component-grid article:nth-child(16){border-top-color:hsla(235,78%,68%,.19)}
        .check-card:nth-child(4) .check-number{text-shadow:0 0 27px rgba(114,230,255,.17)}
        .level-grid article:nth-child(8){background-image:linear-gradient(135deg,rgba(62,111,203,.02),transparent 62%)}
        .rail-item:nth-child(4) .sequence{box-shadow:inset 0 0 13px rgba(100,170,255,.04)}
        .runtime-map article:nth-child(17){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 22px rgba(56,96,146,.05)}
        .component-grid article:nth-child(17){border-top-color:hsla(238,78%,68%,.20)}
        .check-card:nth-child(5) .check-number{text-shadow:0 0 28px rgba(114,230,255,.10)}
        .level-grid article:nth-child(1){background-image:linear-gradient(136deg,rgba(62,111,203,.03),transparent 62%)}
        .rail-item:nth-child(5) .sequence{box-shadow:inset 0 0 14px rgba(100,170,255,.05)}
        .runtime-map article:nth-child(18){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 23px rgba(57,97,147,.06)}
        .component-grid article:nth-child(18){border-top-color:hsla(241,78%,68%,.21)}
        .check-card:nth-child(6) .check-number{text-shadow:0 0 29px rgba(114,230,255,.11)}
        .level-grid article:nth-child(2){background-image:linear-gradient(137deg,rgba(62,111,203,.04),transparent 62%)}
        .rail-item:nth-child(6) .sequence{box-shadow:inset 0 0 15px rgba(100,170,255,.06)}
        .runtime-map article:nth-child(19){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 24px rgba(58,98,148,.07)}
        .component-grid article:nth-child(19){border-top-color:hsla(244,78%,68%,.22)}
        .check-card:nth-child(7) .check-number{text-shadow:0 0 30px rgba(114,230,255,.12)}
        .level-grid article:nth-child(3){background-image:linear-gradient(138deg,rgba(62,111,203,.05),transparent 62%)}
        .rail-item:nth-child(7) .sequence{box-shadow:inset 0 0 16px rgba(100,170,255,.07)}
        .runtime-map article:nth-child(20){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 25px rgba(59,99,149,.08)}
        .component-grid article:nth-child(20){border-top-color:hsla(247,78%,68%,.23)}
        .check-card:nth-child(8) .check-number{text-shadow:0 0 31px rgba(114,230,255,.13)}
        .level-grid article:nth-child(4){background-image:linear-gradient(139deg,rgba(62,111,203,.06),transparent 62%)}
        .rail-item:nth-child(8) .sequence{box-shadow:inset 0 0 17px rgba(100,170,255,.08)}
        .runtime-map article:nth-child(21){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 26px rgba(60,100,150,.04)}
        .component-grid article:nth-child(1){border-top-color:hsla(250,78%,68%,.24)}
        .check-card:nth-child(9) .check-number{text-shadow:0 0 12px rgba(114,230,255,.14)}
        .level-grid article:nth-child(5){background-image:linear-gradient(140deg,rgba(62,111,203,.02),transparent 62%)}
        .rail-item:nth-child(9) .sequence{box-shadow:inset 0 0 18px rgba(100,170,255,.04)}
        .runtime-map article:nth-child(22){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 27px rgba(61,101,151,.05)}
        .component-grid article:nth-child(2){border-top-color:hsla(253,78%,68%,.18)}
        .check-card:nth-child(10) .check-number{text-shadow:0 0 13px rgba(114,230,255,.15)}
        .level-grid article:nth-child(6){background-image:linear-gradient(141deg,rgba(62,111,203,.03),transparent 62%)}
        .rail-item:nth-child(10) .sequence{box-shadow:inset 0 0 19px rgba(100,170,255,.05)}
        .runtime-map article:nth-child(23){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 28px rgba(62,102,152,.06)}
        .component-grid article:nth-child(3){border-top-color:hsla(256,78%,68%,.19)}
        .check-card:nth-child(11) .check-number{text-shadow:0 0 14px rgba(114,230,255,.16)}
        .level-grid article:nth-child(7){background-image:linear-gradient(142deg,rgba(62,111,203,.04),transparent 62%)}
        .rail-item:nth-child(11) .sequence{box-shadow:inset 0 0 20px rgba(100,170,255,.06)}
        .runtime-map article:nth-child(24){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 29px rgba(63,103,153,.07)}
        .component-grid article:nth-child(4){border-top-color:hsla(259,78%,68%,.20)}
        .check-card:nth-child(12) .check-number{text-shadow:0 0 15px rgba(114,230,255,.17)}
        .level-grid article:nth-child(8){background-image:linear-gradient(143deg,rgba(62,111,203,.05),transparent 62%)}
        .rail-item:nth-child(12) .sequence{box-shadow:inset 0 0 21px rgba(100,170,255,.07)}
        .runtime-map article:nth-child(1){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 18px rgba(64,104,154,.08)}
        .component-grid article:nth-child(5){border-top-color:hsla(262,78%,68%,.21)}
        .check-card:nth-child(1) .check-number{text-shadow:0 0 16px rgba(114,230,255,.10)}
        .level-grid article:nth-child(1){background-image:linear-gradient(144deg,rgba(62,111,203,.06),transparent 62%)}
        .rail-item:nth-child(1) .sequence{box-shadow:inset 0 0 10px rgba(100,170,255,.08)}
        .runtime-map article:nth-child(2){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 19px rgba(65,105,155,.04)}
        .component-grid article:nth-child(6){border-top-color:hsla(265,78%,68%,.22)}
        .check-card:nth-child(2) .check-number{text-shadow:0 0 17px rgba(114,230,255,.11)}
        .level-grid article:nth-child(2){background-image:linear-gradient(145deg,rgba(62,111,203,.02),transparent 62%)}
        .rail-item:nth-child(2) .sequence{box-shadow:inset 0 0 11px rgba(100,170,255,.04)}
        .runtime-map article:nth-child(3){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 20px rgba(66,106,156,.05)}
        .component-grid article:nth-child(7){border-top-color:hsla(268,78%,68%,.23)}
        .check-card:nth-child(3) .check-number{text-shadow:0 0 18px rgba(114,230,255,.12)}
        .level-grid article:nth-child(3){background-image:linear-gradient(146deg,rgba(62,111,203,.03),transparent 62%)}
        .rail-item:nth-child(3) .sequence{box-shadow:inset 0 0 12px rgba(100,170,255,.05)}
        .runtime-map article:nth-child(4){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 21px rgba(67,107,157,.06)}
        .component-grid article:nth-child(8){border-top-color:hsla(271,78%,68%,.24)}
        .check-card:nth-child(4) .check-number{text-shadow:0 0 19px rgba(114,230,255,.13)}
        .level-grid article:nth-child(4){background-image:linear-gradient(147deg,rgba(62,111,203,.04),transparent 62%)}
        .rail-item:nth-child(4) .sequence{box-shadow:inset 0 0 13px rgba(100,170,255,.06)}
        .runtime-map article:nth-child(5){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 22px rgba(68,108,158,.07)}
        .component-grid article:nth-child(9){border-top-color:hsla(274,78%,68%,.18)}
        .check-card:nth-child(5) .check-number{text-shadow:0 0 20px rgba(114,230,255,.14)}
        .level-grid article:nth-child(5){background-image:linear-gradient(148deg,rgba(62,111,203,.05),transparent 62%)}
        .rail-item:nth-child(5) .sequence{box-shadow:inset 0 0 14px rgba(100,170,255,.07)}
        .runtime-map article:nth-child(6){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 23px rgba(69,109,159,.08)}
        .component-grid article:nth-child(10){border-top-color:hsla(277,78%,68%,.19)}
        .check-card:nth-child(6) .check-number{text-shadow:0 0 21px rgba(114,230,255,.15)}
        .level-grid article:nth-child(6){background-image:linear-gradient(149deg,rgba(62,111,203,.06),transparent 62%)}
        .rail-item:nth-child(6) .sequence{box-shadow:inset 0 0 15px rgba(100,170,255,.08)}
        .runtime-map article:nth-child(7){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 24px rgba(70,110,160,.04)}
        .component-grid article:nth-child(11){border-top-color:hsla(280,78%,68%,.20)}
        .check-card:nth-child(7) .check-number{text-shadow:0 0 22px rgba(114,230,255,.16)}
        .level-grid article:nth-child(7){background-image:linear-gradient(150deg,rgba(62,111,203,.02),transparent 62%)}
        .rail-item:nth-child(7) .sequence{box-shadow:inset 0 0 16px rgba(100,170,255,.04)}
        .runtime-map article:nth-child(8){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 25px rgba(71,111,161,.05)}
        .component-grid article:nth-child(12){border-top-color:hsla(283,78%,68%,.21)}
        .check-card:nth-child(8) .check-number{text-shadow:0 0 23px rgba(114,230,255,.17)}
        .level-grid article:nth-child(8){background-image:linear-gradient(151deg,rgba(62,111,203,.03),transparent 62%)}
        .rail-item:nth-child(8) .sequence{box-shadow:inset 0 0 17px rgba(100,170,255,.05)}
        .runtime-map article:nth-child(9){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 26px rgba(72,112,162,.06)}
        .component-grid article:nth-child(13){border-top-color:hsla(286,78%,68%,.22)}
        .check-card:nth-child(9) .check-number{text-shadow:0 0 24px rgba(114,230,255,.10)}
        .level-grid article:nth-child(1){background-image:linear-gradient(152deg,rgba(62,111,203,.04),transparent 62%)}
        .rail-item:nth-child(9) .sequence{box-shadow:inset 0 0 18px rgba(100,170,255,.06)}
        .runtime-map article:nth-child(10){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 27px rgba(73,113,163,.07)}
        .component-grid article:nth-child(14){border-top-color:hsla(289,78%,68%,.23)}
        .check-card:nth-child(10) .check-number{text-shadow:0 0 25px rgba(114,230,255,.11)}
        .level-grid article:nth-child(2){background-image:linear-gradient(153deg,rgba(62,111,203,.05),transparent 62%)}
        .rail-item:nth-child(10) .sequence{box-shadow:inset 0 0 19px rgba(100,170,255,.07)}
        .runtime-map article:nth-child(11){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 28px rgba(74,114,164,.08)}
        .component-grid article:nth-child(15){border-top-color:hsla(292,78%,68%,.24)}
        .check-card:nth-child(11) .check-number{text-shadow:0 0 26px rgba(114,230,255,.12)}
        .level-grid article:nth-child(3){background-image:linear-gradient(154deg,rgba(62,111,203,.06),transparent 62%)}
        .rail-item:nth-child(11) .sequence{box-shadow:inset 0 0 20px rgba(100,170,255,.08)}
        .runtime-map article:nth-child(12){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 29px rgba(75,115,165,.04)}
        .component-grid article:nth-child(16){border-top-color:hsla(295,78%,68%,.18)}
        .check-card:nth-child(12) .check-number{text-shadow:0 0 27px rgba(114,230,255,.13)}
        .level-grid article:nth-child(4){background-image:linear-gradient(155deg,rgba(62,111,203,.02),transparent 62%)}
        .rail-item:nth-child(12) .sequence{box-shadow:inset 0 0 21px rgba(100,170,255,.04)}
        .runtime-map article:nth-child(13){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 18px rgba(76,116,166,.05)}
        .component-grid article:nth-child(17){border-top-color:hsla(298,78%,68%,.19)}
        .check-card:nth-child(1) .check-number{text-shadow:0 0 28px rgba(114,230,255,.14)}
        .level-grid article:nth-child(5){background-image:linear-gradient(156deg,rgba(62,111,203,.03),transparent 62%)}
        .rail-item:nth-child(1) .sequence{box-shadow:inset 0 0 10px rgba(100,170,255,.05)}
        .runtime-map article:nth-child(14){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 19px rgba(77,117,167,.06)}
        .component-grid article:nth-child(18){border-top-color:hsla(301,78%,68%,.20)}
        .check-card:nth-child(2) .check-number{text-shadow:0 0 29px rgba(114,230,255,.15)}
        .level-grid article:nth-child(6){background-image:linear-gradient(157deg,rgba(62,111,203,.04),transparent 62%)}
        .rail-item:nth-child(2) .sequence{box-shadow:inset 0 0 11px rgba(100,170,255,.06)}
        .runtime-map article:nth-child(15){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 20px rgba(78,118,168,.07)}
        .component-grid article:nth-child(19){border-top-color:hsla(304,78%,68%,.21)}
        .check-card:nth-child(3) .check-number{text-shadow:0 0 30px rgba(114,230,255,.16)}
        .level-grid article:nth-child(7){background-image:linear-gradient(158deg,rgba(62,111,203,.05),transparent 62%)}
        .rail-item:nth-child(3) .sequence{box-shadow:inset 0 0 12px rgba(100,170,255,.07)}
        .runtime-map article:nth-child(16){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 21px rgba(79,119,169,.08)}
        .component-grid article:nth-child(20){border-top-color:hsla(307,78%,68%,.22)}
        .check-card:nth-child(4) .check-number{text-shadow:0 0 31px rgba(114,230,255,.17)}
        .level-grid article:nth-child(8){background-image:linear-gradient(159deg,rgba(62,111,203,.06),transparent 62%)}
        .rail-item:nth-child(4) .sequence{box-shadow:inset 0 0 13px rgba(100,170,255,.08)}
        .runtime-map article:nth-child(17){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 22px rgba(80,120,170,.04)}
        .component-grid article:nth-child(1){border-top-color:hsla(310,78%,68%,.23)}
        .check-card:nth-child(5) .check-number{text-shadow:0 0 12px rgba(114,230,255,.10)}
        .level-grid article:nth-child(1){background-image:linear-gradient(120deg,rgba(62,111,203,.02),transparent 62%)}
        .rail-item:nth-child(5) .sequence{box-shadow:inset 0 0 14px rgba(100,170,255,.04)}
        .runtime-map article:nth-child(18){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 23px rgba(81,121,171,.05)}
        .component-grid article:nth-child(2){border-top-color:hsla(313,78%,68%,.24)}
        .check-card:nth-child(6) .check-number{text-shadow:0 0 13px rgba(114,230,255,.11)}
        .level-grid article:nth-child(2){background-image:linear-gradient(121deg,rgba(62,111,203,.03),transparent 62%)}
        .rail-item:nth-child(6) .sequence{box-shadow:inset 0 0 15px rgba(100,170,255,.05)}
        .runtime-map article:nth-child(19){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 24px rgba(82,122,172,.06)}
        .component-grid article:nth-child(3){border-top-color:hsla(316,78%,68%,.18)}
        .check-card:nth-child(7) .check-number{text-shadow:0 0 14px rgba(114,230,255,.12)}
        .level-grid article:nth-child(3){background-image:linear-gradient(122deg,rgba(62,111,203,.04),transparent 62%)}
        .rail-item:nth-child(7) .sequence{box-shadow:inset 0 0 16px rgba(100,170,255,.06)}
        .runtime-map article:nth-child(20){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 25px rgba(83,123,173,.07)}
        .component-grid article:nth-child(4){border-top-color:hsla(319,78%,68%,.19)}
        .check-card:nth-child(8) .check-number{text-shadow:0 0 15px rgba(114,230,255,.13)}
        .level-grid article:nth-child(4){background-image:linear-gradient(123deg,rgba(62,111,203,.05),transparent 62%)}
        .rail-item:nth-child(8) .sequence{box-shadow:inset 0 0 17px rgba(100,170,255,.07)}
        .runtime-map article:nth-child(21){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 26px rgba(84,124,174,.08)}
        .component-grid article:nth-child(5){border-top-color:hsla(322,78%,68%,.20)}
        .check-card:nth-child(9) .check-number{text-shadow:0 0 16px rgba(114,230,255,.14)}
        .level-grid article:nth-child(5){background-image:linear-gradient(124deg,rgba(62,111,203,.06),transparent 62%)}
        .rail-item:nth-child(9) .sequence{box-shadow:inset 0 0 18px rgba(100,170,255,.08)}
        .runtime-map article:nth-child(22){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 27px rgba(85,125,175,.04)}
        .component-grid article:nth-child(6){border-top-color:hsla(325,78%,68%,.21)}
        .check-card:nth-child(10) .check-number{text-shadow:0 0 17px rgba(114,230,255,.15)}
        .level-grid article:nth-child(6){background-image:linear-gradient(125deg,rgba(62,111,203,.02),transparent 62%)}
        .rail-item:nth-child(10) .sequence{box-shadow:inset 0 0 19px rgba(100,170,255,.04)}
        .runtime-map article:nth-child(23){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 28px rgba(86,126,176,.05)}
        .component-grid article:nth-child(7){border-top-color:hsla(328,78%,68%,.22)}
        .check-card:nth-child(11) .check-number{text-shadow:0 0 18px rgba(114,230,255,.16)}
        .level-grid article:nth-child(7){background-image:linear-gradient(126deg,rgba(62,111,203,.03),transparent 62%)}
        .rail-item:nth-child(11) .sequence{box-shadow:inset 0 0 20px rgba(100,170,255,.05)}
        .runtime-map article:nth-child(24){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 29px rgba(87,127,177,.06)}
        .component-grid article:nth-child(8){border-top-color:hsla(331,78%,68%,.23)}
        .check-card:nth-child(12) .check-number{text-shadow:0 0 19px rgba(114,230,255,.17)}
        .level-grid article:nth-child(8){background-image:linear-gradient(127deg,rgba(62,111,203,.04),transparent 62%)}
        .rail-item:nth-child(12) .sequence{box-shadow:inset 0 0 21px rgba(100,170,255,.06)}
        .runtime-map article:nth-child(1){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 18px rgba(88,128,178,.07)}
        .component-grid article:nth-child(9){border-top-color:hsla(334,78%,68%,.24)}
        .check-card:nth-child(1) .check-number{text-shadow:0 0 20px rgba(114,230,255,.10)}
        .level-grid article:nth-child(1){background-image:linear-gradient(128deg,rgba(62,111,203,.05),transparent 62%)}
        .rail-item:nth-child(1) .sequence{box-shadow:inset 0 0 10px rgba(100,170,255,.07)}
        .runtime-map article:nth-child(2){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 19px rgba(89,129,179,.08)}
        .component-grid article:nth-child(10){border-top-color:hsla(337,78%,68%,.18)}
        .check-card:nth-child(2) .check-number{text-shadow:0 0 21px rgba(114,230,255,.11)}
        .level-grid article:nth-child(2){background-image:linear-gradient(129deg,rgba(62,111,203,.06),transparent 62%)}
        .rail-item:nth-child(2) .sequence{box-shadow:inset 0 0 11px rgba(100,170,255,.08)}
        .runtime-map article:nth-child(3){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 20px rgba(90,130,180,.04)}
        .component-grid article:nth-child(11){border-top-color:hsla(340,78%,68%,.19)}
        .check-card:nth-child(3) .check-number{text-shadow:0 0 22px rgba(114,230,255,.12)}
        .level-grid article:nth-child(3){background-image:linear-gradient(130deg,rgba(62,111,203,.02),transparent 62%)}
        .rail-item:nth-child(3) .sequence{box-shadow:inset 0 0 12px rgba(100,170,255,.04)}
        .runtime-map article:nth-child(4){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 21px rgba(91,131,181,.05)}
        .component-grid article:nth-child(12){border-top-color:hsla(343,78%,68%,.20)}
        .check-card:nth-child(4) .check-number{text-shadow:0 0 23px rgba(114,230,255,.13)}
        .level-grid article:nth-child(4){background-image:linear-gradient(131deg,rgba(62,111,203,.03),transparent 62%)}
        .rail-item:nth-child(4) .sequence{box-shadow:inset 0 0 13px rgba(100,170,255,.05)}
        .runtime-map article:nth-child(5){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 22px rgba(92,132,182,.06)}
        .component-grid article:nth-child(13){border-top-color:hsla(346,78%,68%,.21)}
        .check-card:nth-child(5) .check-number{text-shadow:0 0 24px rgba(114,230,255,.14)}
        .level-grid article:nth-child(5){background-image:linear-gradient(132deg,rgba(62,111,203,.04),transparent 62%)}
        .rail-item:nth-child(5) .sequence{box-shadow:inset 0 0 14px rgba(100,170,255,.06)}
        .runtime-map article:nth-child(6){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 23px rgba(93,133,183,.07)}
        .component-grid article:nth-child(14){border-top-color:hsla(349,78%,68%,.22)}
        .check-card:nth-child(6) .check-number{text-shadow:0 0 25px rgba(114,230,255,.15)}
        .level-grid article:nth-child(6){background-image:linear-gradient(133deg,rgba(62,111,203,.05),transparent 62%)}
        .rail-item:nth-child(6) .sequence{box-shadow:inset 0 0 15px rgba(100,170,255,.07)}
        .runtime-map article:nth-child(7){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 24px rgba(94,134,184,.08)}
        .component-grid article:nth-child(15){border-top-color:hsla(352,78%,68%,.23)}
        .check-card:nth-child(7) .check-number{text-shadow:0 0 26px rgba(114,230,255,.16)}
        .level-grid article:nth-child(7){background-image:linear-gradient(134deg,rgba(62,111,203,.06),transparent 62%)}
        .rail-item:nth-child(7) .sequence{box-shadow:inset 0 0 16px rgba(100,170,255,.08)}
        .runtime-map article:nth-child(8){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 25px rgba(95,135,185,.04)}
        .component-grid article:nth-child(16){border-top-color:hsla(355,78%,68%,.24)}
        .check-card:nth-child(8) .check-number{text-shadow:0 0 27px rgba(114,230,255,.17)}
        .level-grid article:nth-child(8){background-image:linear-gradient(135deg,rgba(62,111,203,.02),transparent 62%)}
        .rail-item:nth-child(8) .sequence{box-shadow:inset 0 0 17px rgba(100,170,255,.04)}
        .runtime-map article:nth-child(9){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 26px rgba(96,136,186,.05)}
        .component-grid article:nth-child(17){border-top-color:hsla(358,78%,68%,.18)}
        .check-card:nth-child(9) .check-number{text-shadow:0 0 28px rgba(114,230,255,.10)}
        .level-grid article:nth-child(1){background-image:linear-gradient(136deg,rgba(62,111,203,.03),transparent 62%)}
        .rail-item:nth-child(9) .sequence{box-shadow:inset 0 0 18px rgba(100,170,255,.05)}
        .runtime-map article:nth-child(10){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 27px rgba(97,137,187,.06)}
        .component-grid article:nth-child(18){border-top-color:hsla(1,78%,68%,.19)}
        .check-card:nth-child(10) .check-number{text-shadow:0 0 29px rgba(114,230,255,.11)}
        .level-grid article:nth-child(2){background-image:linear-gradient(137deg,rgba(62,111,203,.04),transparent 62%)}
        .rail-item:nth-child(10) .sequence{box-shadow:inset 0 0 19px rgba(100,170,255,.06)}
        .runtime-map article:nth-child(11){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 28px rgba(98,138,188,.07)}
        .component-grid article:nth-child(19){border-top-color:hsla(4,78%,68%,.20)}
        .check-card:nth-child(11) .check-number{text-shadow:0 0 30px rgba(114,230,255,.12)}
        .level-grid article:nth-child(3){background-image:linear-gradient(138deg,rgba(62,111,203,.05),transparent 62%)}
        .rail-item:nth-child(11) .sequence{box-shadow:inset 0 0 20px rgba(100,170,255,.07)}
        .runtime-map article:nth-child(12){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 29px rgba(99,139,189,.08)}
        .component-grid article:nth-child(20){border-top-color:hsla(7,78%,68%,.21)}
        .check-card:nth-child(12) .check-number{text-shadow:0 0 31px rgba(114,230,255,.13)}
        .level-grid article:nth-child(4){background-image:linear-gradient(139deg,rgba(62,111,203,.06),transparent 62%)}
        .rail-item:nth-child(12) .sequence{box-shadow:inset 0 0 21px rgba(100,170,255,.08)}
        .runtime-map article:nth-child(13){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 18px rgba(40,140,190,.04)}
        .component-grid article:nth-child(1){border-top-color:hsla(10,78%,68%,.22)}
        .check-card:nth-child(1) .check-number{text-shadow:0 0 12px rgba(114,230,255,.14)}
        .level-grid article:nth-child(5){background-image:linear-gradient(140deg,rgba(62,111,203,.02),transparent 62%)}
        .rail-item:nth-child(1) .sequence{box-shadow:inset 0 0 10px rgba(100,170,255,.04)}
        .runtime-map article:nth-child(14){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 19px rgba(41,141,191,.05)}
        .component-grid article:nth-child(2){border-top-color:hsla(13,78%,68%,.23)}
        .check-card:nth-child(2) .check-number{text-shadow:0 0 13px rgba(114,230,255,.15)}
        .level-grid article:nth-child(6){background-image:linear-gradient(141deg,rgba(62,111,203,.03),transparent 62%)}
        .rail-item:nth-child(2) .sequence{box-shadow:inset 0 0 11px rgba(100,170,255,.05)}
        .runtime-map article:nth-child(15){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 20px rgba(42,142,192,.06)}
        .component-grid article:nth-child(3){border-top-color:hsla(16,78%,68%,.24)}
        .check-card:nth-child(3) .check-number{text-shadow:0 0 14px rgba(114,230,255,.16)}
        .level-grid article:nth-child(7){background-image:linear-gradient(142deg,rgba(62,111,203,.04),transparent 62%)}
        .rail-item:nth-child(3) .sequence{box-shadow:inset 0 0 12px rgba(100,170,255,.06)}
        .runtime-map article:nth-child(16){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 21px rgba(43,143,193,.07)}
        .component-grid article:nth-child(4){border-top-color:hsla(19,78%,68%,.18)}
        .check-card:nth-child(4) .check-number{text-shadow:0 0 15px rgba(114,230,255,.17)}
        .level-grid article:nth-child(8){background-image:linear-gradient(143deg,rgba(62,111,203,.05),transparent 62%)}
        .rail-item:nth-child(4) .sequence{box-shadow:inset 0 0 13px rgba(100,170,255,.07)}
        .runtime-map article:nth-child(17){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 22px rgba(44,144,194,.08)}
        .component-grid article:nth-child(5){border-top-color:hsla(22,78%,68%,.19)}
        .check-card:nth-child(5) .check-number{text-shadow:0 0 16px rgba(114,230,255,.10)}
        .level-grid article:nth-child(1){background-image:linear-gradient(144deg,rgba(62,111,203,.06),transparent 62%)}
        .rail-item:nth-child(5) .sequence{box-shadow:inset 0 0 14px rgba(100,170,255,.08)}
        .runtime-map article:nth-child(18){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 23px rgba(45,145,195,.04)}
        .component-grid article:nth-child(6){border-top-color:hsla(25,78%,68%,.20)}
        .check-card:nth-child(6) .check-number{text-shadow:0 0 17px rgba(114,230,255,.11)}
        .level-grid article:nth-child(2){background-image:linear-gradient(145deg,rgba(62,111,203,.02),transparent 62%)}
        .rail-item:nth-child(6) .sequence{box-shadow:inset 0 0 15px rgba(100,170,255,.04)}
        .runtime-map article:nth-child(19){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 24px rgba(46,146,196,.05)}
        .component-grid article:nth-child(7){border-top-color:hsla(28,78%,68%,.21)}
        .check-card:nth-child(7) .check-number{text-shadow:0 0 18px rgba(114,230,255,.12)}
        .level-grid article:nth-child(3){background-image:linear-gradient(146deg,rgba(62,111,203,.03),transparent 62%)}
        .rail-item:nth-child(7) .sequence{box-shadow:inset 0 0 16px rgba(100,170,255,.05)}
        .runtime-map article:nth-child(20){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 25px rgba(47,147,197,.06)}
        .component-grid article:nth-child(8){border-top-color:hsla(31,78%,68%,.22)}
        .check-card:nth-child(8) .check-number{text-shadow:0 0 19px rgba(114,230,255,.13)}
        .level-grid article:nth-child(4){background-image:linear-gradient(147deg,rgba(62,111,203,.04),transparent 62%)}
        .rail-item:nth-child(8) .sequence{box-shadow:inset 0 0 17px rgba(100,170,255,.06)}
        .runtime-map article:nth-child(21){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 26px rgba(48,148,198,.07)}
        .component-grid article:nth-child(9){border-top-color:hsla(34,78%,68%,.23)}
        .check-card:nth-child(9) .check-number{text-shadow:0 0 20px rgba(114,230,255,.14)}
        .level-grid article:nth-child(5){background-image:linear-gradient(148deg,rgba(62,111,203,.05),transparent 62%)}
        .rail-item:nth-child(9) .sequence{box-shadow:inset 0 0 18px rgba(100,170,255,.07)}
        .runtime-map article:nth-child(22){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 27px rgba(49,149,199,.08)}
        .component-grid article:nth-child(10){border-top-color:hsla(37,78%,68%,.24)}
        .check-card:nth-child(10) .check-number{text-shadow:0 0 21px rgba(114,230,255,.15)}
        .level-grid article:nth-child(6){background-image:linear-gradient(149deg,rgba(62,111,203,.06),transparent 62%)}
        .rail-item:nth-child(10) .sequence{box-shadow:inset 0 0 19px rgba(100,170,255,.08)}
        .runtime-map article:nth-child(23){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 28px rgba(50,150,200,.04)}
        .component-grid article:nth-child(11){border-top-color:hsla(40,78%,68%,.18)}
        .check-card:nth-child(11) .check-number{text-shadow:0 0 22px rgba(114,230,255,.16)}
        .level-grid article:nth-child(7){background-image:linear-gradient(150deg,rgba(62,111,203,.02),transparent 62%)}
        .rail-item:nth-child(11) .sequence{box-shadow:inset 0 0 20px rgba(100,170,255,.04)}
        .runtime-map article:nth-child(24){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 29px rgba(51,151,201,.05)}
        .component-grid article:nth-child(12){border-top-color:hsla(43,78%,68%,.19)}
        .check-card:nth-child(12) .check-number{text-shadow:0 0 23px rgba(114,230,255,.17)}
        .level-grid article:nth-child(8){background-image:linear-gradient(151deg,rgba(62,111,203,.03),transparent 62%)}
        .rail-item:nth-child(12) .sequence{box-shadow:inset 0 0 21px rgba(100,170,255,.05)}
        .runtime-map article:nth-child(1){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 18px rgba(52,152,202,.06)}
        .component-grid article:nth-child(13){border-top-color:hsla(46,78%,68%,.20)}
        .check-card:nth-child(1) .check-number{text-shadow:0 0 24px rgba(114,230,255,.10)}
        .level-grid article:nth-child(1){background-image:linear-gradient(152deg,rgba(62,111,203,.04),transparent 62%)}
        .rail-item:nth-child(1) .sequence{box-shadow:inset 0 0 10px rgba(100,170,255,.06)}
        .runtime-map article:nth-child(2){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 19px rgba(53,153,203,.07)}
        .component-grid article:nth-child(14){border-top-color:hsla(49,78%,68%,.21)}
        .check-card:nth-child(2) .check-number{text-shadow:0 0 25px rgba(114,230,255,.11)}
        .level-grid article:nth-child(2){background-image:linear-gradient(153deg,rgba(62,111,203,.05),transparent 62%)}
        .rail-item:nth-child(2) .sequence{box-shadow:inset 0 0 11px rgba(100,170,255,.07)}
        .runtime-map article:nth-child(3){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 20px rgba(54,154,204,.08)}
        .component-grid article:nth-child(15){border-top-color:hsla(52,78%,68%,.22)}
        .check-card:nth-child(3) .check-number{text-shadow:0 0 26px rgba(114,230,255,.12)}
        .level-grid article:nth-child(3){background-image:linear-gradient(154deg,rgba(62,111,203,.06),transparent 62%)}
        .rail-item:nth-child(3) .sequence{box-shadow:inset 0 0 12px rgba(100,170,255,.08)}
        .runtime-map article:nth-child(4){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 21px rgba(55,155,205,.04)}
        .component-grid article:nth-child(16){border-top-color:hsla(55,78%,68%,.23)}
        .check-card:nth-child(4) .check-number{text-shadow:0 0 27px rgba(114,230,255,.13)}
        .level-grid article:nth-child(4){background-image:linear-gradient(155deg,rgba(62,111,203,.02),transparent 62%)}
        .rail-item:nth-child(4) .sequence{box-shadow:inset 0 0 13px rgba(100,170,255,.04)}
        .runtime-map article:nth-child(5){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 22px rgba(56,156,206,.05)}
        .component-grid article:nth-child(17){border-top-color:hsla(58,78%,68%,.24)}
        .check-card:nth-child(5) .check-number{text-shadow:0 0 28px rgba(114,230,255,.14)}
        .level-grid article:nth-child(5){background-image:linear-gradient(156deg,rgba(62,111,203,.03),transparent 62%)}
        .rail-item:nth-child(5) .sequence{box-shadow:inset 0 0 14px rgba(100,170,255,.05)}
        .runtime-map article:nth-child(6){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 23px rgba(57,157,207,.06)}
        .component-grid article:nth-child(18){border-top-color:hsla(61,78%,68%,.18)}
        .check-card:nth-child(6) .check-number{text-shadow:0 0 29px rgba(114,230,255,.15)}
        .level-grid article:nth-child(6){background-image:linear-gradient(157deg,rgba(62,111,203,.04),transparent 62%)}
        .rail-item:nth-child(6) .sequence{box-shadow:inset 0 0 15px rgba(100,170,255,.06)}
        .runtime-map article:nth-child(7){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 24px rgba(58,158,208,.07)}
        .component-grid article:nth-child(19){border-top-color:hsla(64,78%,68%,.19)}
        .check-card:nth-child(7) .check-number{text-shadow:0 0 30px rgba(114,230,255,.16)}
        .level-grid article:nth-child(7){background-image:linear-gradient(158deg,rgba(62,111,203,.05),transparent 62%)}
        .rail-item:nth-child(7) .sequence{box-shadow:inset 0 0 16px rgba(100,170,255,.07)}
        .runtime-map article:nth-child(8){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 25px rgba(59,159,209,.08)}
        .component-grid article:nth-child(20){border-top-color:hsla(67,78%,68%,.20)}
        .check-card:nth-child(8) .check-number{text-shadow:0 0 31px rgba(114,230,255,.17)}
        .level-grid article:nth-child(8){background-image:linear-gradient(159deg,rgba(62,111,203,.06),transparent 62%)}
        .rail-item:nth-child(8) .sequence{box-shadow:inset 0 0 17px rgba(100,170,255,.08)}
        .runtime-map article:nth-child(9){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 26px rgba(60,160,210,.04)}
        .component-grid article:nth-child(1){border-top-color:hsla(70,78%,68%,.21)}
        .check-card:nth-child(9) .check-number{text-shadow:0 0 12px rgba(114,230,255,.10)}
        .level-grid article:nth-child(1){background-image:linear-gradient(120deg,rgba(62,111,203,.02),transparent 62%)}
        .rail-item:nth-child(9) .sequence{box-shadow:inset 0 0 18px rgba(100,170,255,.04)}
        .runtime-map article:nth-child(10){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 27px rgba(61,161,211,.05)}
        .component-grid article:nth-child(2){border-top-color:hsla(73,78%,68%,.22)}
        .check-card:nth-child(10) .check-number{text-shadow:0 0 13px rgba(114,230,255,.11)}
        .level-grid article:nth-child(2){background-image:linear-gradient(121deg,rgba(62,111,203,.03),transparent 62%)}
        .rail-item:nth-child(10) .sequence{box-shadow:inset 0 0 19px rgba(100,170,255,.05)}
        .runtime-map article:nth-child(11){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 28px rgba(62,162,212,.06)}
        .component-grid article:nth-child(3){border-top-color:hsla(76,78%,68%,.23)}
        .check-card:nth-child(11) .check-number{text-shadow:0 0 14px rgba(114,230,255,.12)}
        .level-grid article:nth-child(3){background-image:linear-gradient(122deg,rgba(62,111,203,.04),transparent 62%)}
        .rail-item:nth-child(11) .sequence{box-shadow:inset 0 0 20px rgba(100,170,255,.06)}
        .runtime-map article:nth-child(12){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 29px rgba(63,163,213,.07)}
        .component-grid article:nth-child(4){border-top-color:hsla(79,78%,68%,.24)}
        .check-card:nth-child(12) .check-number{text-shadow:0 0 15px rgba(114,230,255,.13)}
        .level-grid article:nth-child(4){background-image:linear-gradient(123deg,rgba(62,111,203,.05),transparent 62%)}
        .rail-item:nth-child(12) .sequence{box-shadow:inset 0 0 21px rgba(100,170,255,.07)}
        .runtime-map article:nth-child(13){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 18px rgba(64,164,214,.08)}
        .component-grid article:nth-child(5){border-top-color:hsla(82,78%,68%,.18)}
        .check-card:nth-child(1) .check-number{text-shadow:0 0 16px rgba(114,230,255,.14)}
        .level-grid article:nth-child(5){background-image:linear-gradient(124deg,rgba(62,111,203,.06),transparent 62%)}
        .rail-item:nth-child(1) .sequence{box-shadow:inset 0 0 10px rgba(100,170,255,.08)}
        .runtime-map article:nth-child(14){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 19px rgba(65,165,215,.04)}
        .component-grid article:nth-child(6){border-top-color:hsla(85,78%,68%,.19)}
        .check-card:nth-child(2) .check-number{text-shadow:0 0 17px rgba(114,230,255,.15)}
        .level-grid article:nth-child(6){background-image:linear-gradient(125deg,rgba(62,111,203,.02),transparent 62%)}
        .rail-item:nth-child(2) .sequence{box-shadow:inset 0 0 11px rgba(100,170,255,.04)}
        .runtime-map article:nth-child(15){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 20px rgba(66,166,216,.05)}
        .component-grid article:nth-child(7){border-top-color:hsla(88,78%,68%,.20)}
        .check-card:nth-child(3) .check-number{text-shadow:0 0 18px rgba(114,230,255,.16)}
        .level-grid article:nth-child(7){background-image:linear-gradient(126deg,rgba(62,111,203,.03),transparent 62%)}
        .rail-item:nth-child(3) .sequence{box-shadow:inset 0 0 12px rgba(100,170,255,.05)}
        .runtime-map article:nth-child(16){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 21px rgba(67,167,217,.06)}
        .component-grid article:nth-child(8){border-top-color:hsla(91,78%,68%,.21)}
        .check-card:nth-child(4) .check-number{text-shadow:0 0 19px rgba(114,230,255,.17)}
        .level-grid article:nth-child(8){background-image:linear-gradient(127deg,rgba(62,111,203,.04),transparent 62%)}
        .rail-item:nth-child(4) .sequence{box-shadow:inset 0 0 13px rgba(100,170,255,.06)}
        .runtime-map article:nth-child(17){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 22px rgba(68,168,218,.07)}
        .component-grid article:nth-child(9){border-top-color:hsla(94,78%,68%,.22)}
        .check-card:nth-child(5) .check-number{text-shadow:0 0 20px rgba(114,230,255,.10)}
        .level-grid article:nth-child(1){background-image:linear-gradient(128deg,rgba(62,111,203,.05),transparent 62%)}
        .rail-item:nth-child(5) .sequence{box-shadow:inset 0 0 14px rgba(100,170,255,.07)}
        .runtime-map article:nth-child(18){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 23px rgba(69,169,219,.08)}
        .component-grid article:nth-child(10){border-top-color:hsla(97,78%,68%,.23)}
        .check-card:nth-child(6) .check-number{text-shadow:0 0 21px rgba(114,230,255,.11)}
        .level-grid article:nth-child(2){background-image:linear-gradient(129deg,rgba(62,111,203,.06),transparent 62%)}
        .rail-item:nth-child(6) .sequence{box-shadow:inset 0 0 15px rgba(100,170,255,.08)}
        .runtime-map article:nth-child(19){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 24px rgba(70,80,220,.04)}
        .component-grid article:nth-child(11){border-top-color:hsla(100,78%,68%,.24)}
        .check-card:nth-child(7) .check-number{text-shadow:0 0 22px rgba(114,230,255,.12)}
        .level-grid article:nth-child(3){background-image:linear-gradient(130deg,rgba(62,111,203,.02),transparent 62%)}
        .rail-item:nth-child(7) .sequence{box-shadow:inset 0 0 16px rgba(100,170,255,.04)}
        .runtime-map article:nth-child(20){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 25px rgba(71,81,221,.05)}
        .component-grid article:nth-child(12){border-top-color:hsla(103,78%,68%,.18)}
        .check-card:nth-child(8) .check-number{text-shadow:0 0 23px rgba(114,230,255,.13)}
        .level-grid article:nth-child(4){background-image:linear-gradient(131deg,rgba(62,111,203,.03),transparent 62%)}
        .rail-item:nth-child(8) .sequence{box-shadow:inset 0 0 17px rgba(100,170,255,.05)}
        .runtime-map article:nth-child(21){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 26px rgba(72,82,222,.06)}
        .component-grid article:nth-child(13){border-top-color:hsla(106,78%,68%,.19)}
        .check-card:nth-child(9) .check-number{text-shadow:0 0 24px rgba(114,230,255,.14)}
        .level-grid article:nth-child(5){background-image:linear-gradient(132deg,rgba(62,111,203,.04),transparent 62%)}
        .rail-item:nth-child(9) .sequence{box-shadow:inset 0 0 18px rgba(100,170,255,.06)}
        .runtime-map article:nth-child(22){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 27px rgba(73,83,223,.07)}
        .component-grid article:nth-child(14){border-top-color:hsla(109,78%,68%,.20)}
        .check-card:nth-child(10) .check-number{text-shadow:0 0 25px rgba(114,230,255,.15)}
        .level-grid article:nth-child(6){background-image:linear-gradient(133deg,rgba(62,111,203,.05),transparent 62%)}
        .rail-item:nth-child(10) .sequence{box-shadow:inset 0 0 19px rgba(100,170,255,.07)}
        .runtime-map article:nth-child(23){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 28px rgba(74,84,224,.08)}
        .component-grid article:nth-child(15){border-top-color:hsla(112,78%,68%,.21)}
        .check-card:nth-child(11) .check-number{text-shadow:0 0 26px rgba(114,230,255,.16)}
        .level-grid article:nth-child(7){background-image:linear-gradient(134deg,rgba(62,111,203,.06),transparent 62%)}
        .rail-item:nth-child(11) .sequence{box-shadow:inset 0 0 20px rgba(100,170,255,.08)}
        .runtime-map article:nth-child(24){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 29px rgba(75,85,225,.04)}
        .component-grid article:nth-child(16){border-top-color:hsla(115,78%,68%,.22)}
        .check-card:nth-child(12) .check-number{text-shadow:0 0 27px rgba(114,230,255,.17)}
        .level-grid article:nth-child(8){background-image:linear-gradient(135deg,rgba(62,111,203,.02),transparent 62%)}
        .rail-item:nth-child(12) .sequence{box-shadow:inset 0 0 21px rgba(100,170,255,.04)}
        .runtime-map article:nth-child(1){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 18px rgba(76,86,226,.05)}
        .component-grid article:nth-child(17){border-top-color:hsla(118,78%,68%,.23)}
        .check-card:nth-child(1) .check-number{text-shadow:0 0 28px rgba(114,230,255,.10)}
        .level-grid article:nth-child(1){background-image:linear-gradient(136deg,rgba(62,111,203,.03),transparent 62%)}
        .rail-item:nth-child(1) .sequence{box-shadow:inset 0 0 10px rgba(100,170,255,.05)}
        .runtime-map article:nth-child(2){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 19px rgba(77,87,227,.06)}
        .component-grid article:nth-child(18){border-top-color:hsla(121,78%,68%,.24)}
        .check-card:nth-child(2) .check-number{text-shadow:0 0 29px rgba(114,230,255,.11)}
        .level-grid article:nth-child(2){background-image:linear-gradient(137deg,rgba(62,111,203,.04),transparent 62%)}
        .rail-item:nth-child(2) .sequence{box-shadow:inset 0 0 11px rgba(100,170,255,.06)}
        .runtime-map article:nth-child(3){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 20px rgba(78,88,228,.07)}
        .component-grid article:nth-child(19){border-top-color:hsla(124,78%,68%,.18)}
        .check-card:nth-child(3) .check-number{text-shadow:0 0 30px rgba(114,230,255,.12)}
        .level-grid article:nth-child(3){background-image:linear-gradient(138deg,rgba(62,111,203,.05),transparent 62%)}
        .rail-item:nth-child(3) .sequence{box-shadow:inset 0 0 12px rgba(100,170,255,.07)}
        .runtime-map article:nth-child(4){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 21px rgba(79,89,229,.08)}
        .component-grid article:nth-child(20){border-top-color:hsla(127,78%,68%,.19)}
        .check-card:nth-child(4) .check-number{text-shadow:0 0 31px rgba(114,230,255,.13)}
        .level-grid article:nth-child(4){background-image:linear-gradient(139deg,rgba(62,111,203,.06),transparent 62%)}
        .rail-item:nth-child(4) .sequence{box-shadow:inset 0 0 13px rgba(100,170,255,.08)}
        .runtime-map article:nth-child(5){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 22px rgba(80,90,130,.04)}
        .component-grid article:nth-child(1){border-top-color:hsla(130,78%,68%,.20)}
        .check-card:nth-child(5) .check-number{text-shadow:0 0 12px rgba(114,230,255,.14)}
        .level-grid article:nth-child(5){background-image:linear-gradient(140deg,rgba(62,111,203,.02),transparent 62%)}
        .rail-item:nth-child(5) .sequence{box-shadow:inset 0 0 14px rgba(100,170,255,.04)}
        .runtime-map article:nth-child(6){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 23px rgba(81,91,131,.05)}
        .component-grid article:nth-child(2){border-top-color:hsla(133,78%,68%,.21)}
        .check-card:nth-child(6) .check-number{text-shadow:0 0 13px rgba(114,230,255,.15)}
        .level-grid article:nth-child(6){background-image:linear-gradient(141deg,rgba(62,111,203,.03),transparent 62%)}
        .rail-item:nth-child(6) .sequence{box-shadow:inset 0 0 15px rgba(100,170,255,.05)}
        .runtime-map article:nth-child(7){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 24px rgba(82,92,132,.06)}
        .component-grid article:nth-child(3){border-top-color:hsla(136,78%,68%,.22)}
        .check-card:nth-child(7) .check-number{text-shadow:0 0 14px rgba(114,230,255,.16)}
        .level-grid article:nth-child(7){background-image:linear-gradient(142deg,rgba(62,111,203,.04),transparent 62%)}
        .rail-item:nth-child(7) .sequence{box-shadow:inset 0 0 16px rgba(100,170,255,.06)}
        .runtime-map article:nth-child(8){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 25px rgba(83,93,133,.07)}
        .component-grid article:nth-child(4){border-top-color:hsla(139,78%,68%,.23)}
        .check-card:nth-child(8) .check-number{text-shadow:0 0 15px rgba(114,230,255,.17)}
        .level-grid article:nth-child(8){background-image:linear-gradient(143deg,rgba(62,111,203,.05),transparent 62%)}
        .rail-item:nth-child(8) .sequence{box-shadow:inset 0 0 17px rgba(100,170,255,.07)}
        .runtime-map article:nth-child(9){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 26px rgba(84,94,134,.08)}
        .component-grid article:nth-child(5){border-top-color:hsla(142,78%,68%,.24)}
        .check-card:nth-child(9) .check-number{text-shadow:0 0 16px rgba(114,230,255,.10)}
        .level-grid article:nth-child(1){background-image:linear-gradient(144deg,rgba(62,111,203,.06),transparent 62%)}
        .rail-item:nth-child(9) .sequence{box-shadow:inset 0 0 18px rgba(100,170,255,.08)}
        .runtime-map article:nth-child(10){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 27px rgba(85,95,135,.04)}
        .component-grid article:nth-child(6){border-top-color:hsla(145,78%,68%,.18)}
        .check-card:nth-child(10) .check-number{text-shadow:0 0 17px rgba(114,230,255,.11)}
        .level-grid article:nth-child(2){background-image:linear-gradient(145deg,rgba(62,111,203,.02),transparent 62%)}
        .rail-item:nth-child(10) .sequence{box-shadow:inset 0 0 19px rgba(100,170,255,.04)}
        .runtime-map article:nth-child(11){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 28px rgba(86,96,136,.05)}
        .component-grid article:nth-child(7){border-top-color:hsla(148,78%,68%,.19)}
        .check-card:nth-child(11) .check-number{text-shadow:0 0 18px rgba(114,230,255,.12)}
        .level-grid article:nth-child(3){background-image:linear-gradient(146deg,rgba(62,111,203,.03),transparent 62%)}
        .rail-item:nth-child(11) .sequence{box-shadow:inset 0 0 20px rgba(100,170,255,.05)}
        .runtime-map article:nth-child(12){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 29px rgba(87,97,137,.06)}
        .component-grid article:nth-child(8){border-top-color:hsla(151,78%,68%,.20)}
        .check-card:nth-child(12) .check-number{text-shadow:0 0 19px rgba(114,230,255,.13)}
        .level-grid article:nth-child(4){background-image:linear-gradient(147deg,rgba(62,111,203,.04),transparent 62%)}
        .rail-item:nth-child(12) .sequence{box-shadow:inset 0 0 21px rgba(100,170,255,.06)}
        .runtime-map article:nth-child(13){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 18px rgba(88,98,138,.07)}
        .component-grid article:nth-child(9){border-top-color:hsla(154,78%,68%,.21)}
        .check-card:nth-child(1) .check-number{text-shadow:0 0 20px rgba(114,230,255,.14)}
        .level-grid article:nth-child(5){background-image:linear-gradient(148deg,rgba(62,111,203,.05),transparent 62%)}
        .rail-item:nth-child(1) .sequence{box-shadow:inset 0 0 10px rgba(100,170,255,.07)}
        .runtime-map article:nth-child(14){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 19px rgba(89,99,139,.08)}
        .component-grid article:nth-child(10){border-top-color:hsla(157,78%,68%,.22)}
        .check-card:nth-child(2) .check-number{text-shadow:0 0 21px rgba(114,230,255,.15)}
        .level-grid article:nth-child(6){background-image:linear-gradient(149deg,rgba(62,111,203,.06),transparent 62%)}
        .rail-item:nth-child(2) .sequence{box-shadow:inset 0 0 11px rgba(100,170,255,.08)}
        .runtime-map article:nth-child(15){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 20px rgba(90,100,140,.04)}
        .component-grid article:nth-child(11){border-top-color:hsla(160,78%,68%,.23)}
        .check-card:nth-child(3) .check-number{text-shadow:0 0 22px rgba(114,230,255,.16)}
        .level-grid article:nth-child(7){background-image:linear-gradient(150deg,rgba(62,111,203,.02),transparent 62%)}
        .rail-item:nth-child(3) .sequence{box-shadow:inset 0 0 12px rgba(100,170,255,.04)}
        .runtime-map article:nth-child(16){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 21px rgba(91,101,141,.05)}
        .component-grid article:nth-child(12){border-top-color:hsla(163,78%,68%,.24)}
        .check-card:nth-child(4) .check-number{text-shadow:0 0 23px rgba(114,230,255,.17)}
        .level-grid article:nth-child(8){background-image:linear-gradient(151deg,rgba(62,111,203,.03),transparent 62%)}
        .rail-item:nth-child(4) .sequence{box-shadow:inset 0 0 13px rgba(100,170,255,.05)}
        .runtime-map article:nth-child(17){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 22px rgba(92,102,142,.06)}
        .component-grid article:nth-child(13){border-top-color:hsla(166,78%,68%,.18)}
        .check-card:nth-child(5) .check-number{text-shadow:0 0 24px rgba(114,230,255,.10)}
        .level-grid article:nth-child(1){background-image:linear-gradient(152deg,rgba(62,111,203,.04),transparent 62%)}
        .rail-item:nth-child(5) .sequence{box-shadow:inset 0 0 14px rgba(100,170,255,.06)}
        .runtime-map article:nth-child(18){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 23px rgba(93,103,143,.07)}
        .component-grid article:nth-child(14){border-top-color:hsla(169,78%,68%,.19)}
        .check-card:nth-child(6) .check-number{text-shadow:0 0 25px rgba(114,230,255,.11)}
        .level-grid article:nth-child(2){background-image:linear-gradient(153deg,rgba(62,111,203,.05),transparent 62%)}
        .rail-item:nth-child(6) .sequence{box-shadow:inset 0 0 15px rgba(100,170,255,.07)}
        .runtime-map article:nth-child(19){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 24px rgba(94,104,144,.08)}
        .component-grid article:nth-child(15){border-top-color:hsla(172,78%,68%,.20)}
        .check-card:nth-child(7) .check-number{text-shadow:0 0 26px rgba(114,230,255,.12)}
        .level-grid article:nth-child(3){background-image:linear-gradient(154deg,rgba(62,111,203,.06),transparent 62%)}
        .rail-item:nth-child(7) .sequence{box-shadow:inset 0 0 16px rgba(100,170,255,.08)}
        .runtime-map article:nth-child(20){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 25px rgba(95,105,145,.04)}
        .component-grid article:nth-child(16){border-top-color:hsla(175,78%,68%,.21)}
        .check-card:nth-child(8) .check-number{text-shadow:0 0 27px rgba(114,230,255,.13)}
        .level-grid article:nth-child(4){background-image:linear-gradient(155deg,rgba(62,111,203,.02),transparent 62%)}
        .rail-item:nth-child(8) .sequence{box-shadow:inset 0 0 17px rgba(100,170,255,.04)}
        .runtime-map article:nth-child(21){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 26px rgba(96,106,146,.05)}
        .component-grid article:nth-child(17){border-top-color:hsla(178,78%,68%,.22)}
        .check-card:nth-child(9) .check-number{text-shadow:0 0 28px rgba(114,230,255,.14)}
        .level-grid article:nth-child(5){background-image:linear-gradient(156deg,rgba(62,111,203,.03),transparent 62%)}
        .rail-item:nth-child(9) .sequence{box-shadow:inset 0 0 18px rgba(100,170,255,.05)}
        .runtime-map article:nth-child(22){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 27px rgba(97,107,147,.06)}
        .component-grid article:nth-child(18){border-top-color:hsla(181,78%,68%,.23)}
        .check-card:nth-child(10) .check-number{text-shadow:0 0 29px rgba(114,230,255,.15)}
        .level-grid article:nth-child(6){background-image:linear-gradient(157deg,rgba(62,111,203,.04),transparent 62%)}
        .rail-item:nth-child(10) .sequence{box-shadow:inset 0 0 19px rgba(100,170,255,.06)}
        .runtime-map article:nth-child(23){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 28px rgba(98,108,148,.07)}
        .component-grid article:nth-child(19){border-top-color:hsla(184,78%,68%,.24)}
        .check-card:nth-child(11) .check-number{text-shadow:0 0 30px rgba(114,230,255,.16)}
        .level-grid article:nth-child(7){background-image:linear-gradient(158deg,rgba(62,111,203,.05),transparent 62%)}
        .rail-item:nth-child(11) .sequence{box-shadow:inset 0 0 20px rgba(100,170,255,.07)}
        .runtime-map article:nth-child(24){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 29px rgba(99,109,149,.08)}
        .component-grid article:nth-child(20){border-top-color:hsla(187,78%,68%,.18)}
        .check-card:nth-child(12) .check-number{text-shadow:0 0 31px rgba(114,230,255,.17)}
        .level-grid article:nth-child(8){background-image:linear-gradient(159deg,rgba(62,111,203,.06),transparent 62%)}
        .rail-item:nth-child(12) .sequence{box-shadow:inset 0 0 21px rgba(100,170,255,.08)}
        .runtime-map article:nth-child(1){box-shadow:inset 0 1px rgba(255,255,255,.03),0 14px 18px rgba(40,110,150,.04)}
        .component-grid article:nth-child(1){border-top-color:hsla(190,78%,68%,.19)}
        .check-card:nth-child(1) .check-number{text-shadow:0 0 12px rgba(114,230,255,.10)}
        .level-grid article:nth-child(1){background-image:linear-gradient(120deg,rgba(62,111,203,.02),transparent 62%)}
        .rail-item:nth-child(1) .sequence{box-shadow:inset 0 0 10px rgba(100,170,255,.04)}
        .runtime-map article:nth-child(2):hover{transform:translateY(-3px);border-color:rgba(114,230,255,.21);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(2):hover{transform:translateY(-2px);box-shadow:0 11px 25px rgba(0,0,0,.21);transition:.22s}
        .check-card:nth-child(2):hover{border-color:rgba(112,151,255,.19);background:rgba(13,29,56,.46)}
        .level-grid article:nth-child(2):hover{border-color:rgba(86,227,159,.18);transform:translateY(-2px)}
        .receipt-tests article:nth-child(2){box-shadow:inset 1px 0 0 rgba(86,227,159,.13)}
        .runtime-map article:nth-child(3):hover{transform:translateY(-4px);border-color:rgba(114,230,255,.22);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(3):hover{transform:translateY(-3px);box-shadow:0 12px 26px rgba(0,0,0,.22);transition:.22s}
        .check-card:nth-child(3):hover{border-color:rgba(112,151,255,.20);background:rgba(13,29,56,.47)}
        .level-grid article:nth-child(3):hover{border-color:rgba(86,227,159,.19);transform:translateY(-1px)}
        .receipt-tests article:nth-child(3){box-shadow:inset 2px 0 0 rgba(86,227,159,.14)}
        .runtime-map article:nth-child(4):hover{transform:translateY(-2px);border-color:rgba(114,230,255,.23);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(4):hover{transform:translateY(-1px);box-shadow:0 13px 27px rgba(0,0,0,.23);transition:.22s}
        .check-card:nth-child(4):hover{border-color:rgba(112,151,255,.21);background:rgba(13,29,56,.48)}
        .level-grid article:nth-child(4):hover{border-color:rgba(86,227,159,.20);transform:translateY(-2px)}
        .receipt-tests article:nth-child(4){box-shadow:inset 0px 0 0 rgba(86,227,159,.15)}
        .runtime-map article:nth-child(5):hover{transform:translateY(-3px);border-color:rgba(114,230,255,.24);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(5):hover{transform:translateY(-2px);box-shadow:0 14px 28px rgba(0,0,0,.24);transition:.22s}
        .check-card:nth-child(5):hover{border-color:rgba(112,151,255,.22);background:rgba(13,29,56,.49)}
        .level-grid article:nth-child(5):hover{border-color:rgba(86,227,159,.21);transform:translateY(-1px)}
        .receipt-tests article:nth-child(5){box-shadow:inset 1px 0 0 rgba(86,227,159,.16)}
        .runtime-map article:nth-child(6):hover{transform:translateY(-4px);border-color:rgba(114,230,255,.25);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(6):hover{transform:translateY(-3px);box-shadow:0 15px 29px rgba(0,0,0,.25);transition:.22s}
        .check-card:nth-child(6):hover{border-color:rgba(112,151,255,.23);background:rgba(13,29,56,.50)}
        .level-grid article:nth-child(6):hover{border-color:rgba(86,227,159,.22);transform:translateY(-2px)}
        .receipt-tests article:nth-child(6){box-shadow:inset 2px 0 0 rgba(86,227,159,.17)}
        .runtime-map article:nth-child(7):hover{transform:translateY(-2px);border-color:rgba(114,230,255,.20);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(7):hover{transform:translateY(-1px);box-shadow:0 16px 30px rgba(0,0,0,.26);transition:.22s}
        .check-card:nth-child(7):hover{border-color:rgba(112,151,255,.24);background:rgba(13,29,56,.51)}
        .level-grid article:nth-child(7):hover{border-color:rgba(86,227,159,.23);transform:translateY(-1px)}
        .receipt-tests article:nth-child(7){box-shadow:inset 0px 0 0 rgba(86,227,159,.12)}
        .runtime-map article:nth-child(8):hover{transform:translateY(-3px);border-color:rgba(114,230,255,.21);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(8):hover{transform:translateY(-2px);box-shadow:0 17px 31px rgba(0,0,0,.20);transition:.22s}
        .check-card:nth-child(8):hover{border-color:rgba(112,151,255,.18);background:rgba(13,29,56,.52)}
        .level-grid article:nth-child(8):hover{border-color:rgba(86,227,159,.17);transform:translateY(-2px)}
        .receipt-tests article:nth-child(8){box-shadow:inset 1px 0 0 rgba(86,227,159,.13)}
        .runtime-map article:nth-child(9):hover{transform:translateY(-4px);border-color:rgba(114,230,255,.22);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(9):hover{transform:translateY(-3px);box-shadow:0 10px 32px rgba(0,0,0,.21);transition:.22s}
        .check-card:nth-child(9):hover{border-color:rgba(112,151,255,.19);background:rgba(13,29,56,.53)}
        .level-grid article:nth-child(1):hover{border-color:rgba(86,227,159,.18);transform:translateY(-1px)}
        .receipt-tests article:nth-child(1){box-shadow:inset 2px 0 0 rgba(86,227,159,.14)}
        .runtime-map article:nth-child(10):hover{transform:translateY(-2px);border-color:rgba(114,230,255,.23);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(10):hover{transform:translateY(-1px);box-shadow:0 11px 33px rgba(0,0,0,.22);transition:.22s}
        .check-card:nth-child(10):hover{border-color:rgba(112,151,255,.20);background:rgba(13,29,56,.54)}
        .level-grid article:nth-child(2):hover{border-color:rgba(86,227,159,.19);transform:translateY(-2px)}
        .receipt-tests article:nth-child(2){box-shadow:inset 0px 0 0 rgba(86,227,159,.15)}
        .runtime-map article:nth-child(11):hover{transform:translateY(-3px);border-color:rgba(114,230,255,.24);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(11):hover{transform:translateY(-2px);box-shadow:0 12px 34px rgba(0,0,0,.23);transition:.22s}
        .check-card:nth-child(11):hover{border-color:rgba(112,151,255,.21);background:rgba(13,29,56,.55)}
        .level-grid article:nth-child(3):hover{border-color:rgba(86,227,159,.20);transform:translateY(-1px)}
        .receipt-tests article:nth-child(3){box-shadow:inset 1px 0 0 rgba(86,227,159,.16)}
        .runtime-map article:nth-child(12):hover{transform:translateY(-4px);border-color:rgba(114,230,255,.25);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(12):hover{transform:translateY(-3px);box-shadow:0 13px 35px rgba(0,0,0,.24);transition:.22s}
        .check-card:nth-child(12):hover{border-color:rgba(112,151,255,.22);background:rgba(13,29,56,.56)}
        .level-grid article:nth-child(4):hover{border-color:rgba(86,227,159,.21);transform:translateY(-2px)}
        .receipt-tests article:nth-child(4){box-shadow:inset 2px 0 0 rgba(86,227,159,.17)}
        .runtime-map article:nth-child(13):hover{transform:translateY(-2px);border-color:rgba(114,230,255,.20);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(13):hover{transform:translateY(-1px);box-shadow:0 14px 36px rgba(0,0,0,.25);transition:.22s}
        .check-card:nth-child(1):hover{border-color:rgba(112,151,255,.23);background:rgba(13,29,56,.57)}
        .level-grid article:nth-child(5):hover{border-color:rgba(86,227,159,.22);transform:translateY(-1px)}
        .receipt-tests article:nth-child(5){box-shadow:inset 0px 0 0 rgba(86,227,159,.12)}
        .runtime-map article:nth-child(14):hover{transform:translateY(-3px);border-color:rgba(114,230,255,.21);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(14):hover{transform:translateY(-2px);box-shadow:0 15px 37px rgba(0,0,0,.26);transition:.22s}
        .check-card:nth-child(2):hover{border-color:rgba(112,151,255,.24);background:rgba(13,29,56,.58)}
        .level-grid article:nth-child(6):hover{border-color:rgba(86,227,159,.23);transform:translateY(-2px)}
        .receipt-tests article:nth-child(6){box-shadow:inset 1px 0 0 rgba(86,227,159,.13)}
        .runtime-map article:nth-child(15):hover{transform:translateY(-4px);border-color:rgba(114,230,255,.22);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(15):hover{transform:translateY(-3px);box-shadow:0 16px 38px rgba(0,0,0,.20);transition:.22s}
        .check-card:nth-child(3):hover{border-color:rgba(112,151,255,.18);background:rgba(13,29,56,.59)}
        .level-grid article:nth-child(7):hover{border-color:rgba(86,227,159,.17);transform:translateY(-1px)}
        .receipt-tests article:nth-child(7){box-shadow:inset 2px 0 0 rgba(86,227,159,.14)}
        .runtime-map article:nth-child(16):hover{transform:translateY(-2px);border-color:rgba(114,230,255,.23);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(16):hover{transform:translateY(-1px);box-shadow:0 17px 39px rgba(0,0,0,.21);transition:.22s}
        .check-card:nth-child(4):hover{border-color:rgba(112,151,255,.19);background:rgba(13,29,56,.60)}
        .level-grid article:nth-child(8):hover{border-color:rgba(86,227,159,.18);transform:translateY(-2px)}
        .receipt-tests article:nth-child(8){box-shadow:inset 0px 0 0 rgba(86,227,159,.15)}
        .runtime-map article:nth-child(17):hover{transform:translateY(-3px);border-color:rgba(114,230,255,.24);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(17):hover{transform:translateY(-2px);box-shadow:0 10px 40px rgba(0,0,0,.22);transition:.22s}
        .check-card:nth-child(5):hover{border-color:rgba(112,151,255,.20);background:rgba(13,29,56,.61)}
        .level-grid article:nth-child(1):hover{border-color:rgba(86,227,159,.19);transform:translateY(-1px)}
        .receipt-tests article:nth-child(1){box-shadow:inset 1px 0 0 rgba(86,227,159,.16)}
        .runtime-map article:nth-child(18):hover{transform:translateY(-4px);border-color:rgba(114,230,255,.25);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(18):hover{transform:translateY(-3px);box-shadow:0 11px 41px rgba(0,0,0,.23);transition:.22s}
        .check-card:nth-child(6):hover{border-color:rgba(112,151,255,.21);background:rgba(13,29,56,.62)}
        .level-grid article:nth-child(2):hover{border-color:rgba(86,227,159,.20);transform:translateY(-2px)}
        .receipt-tests article:nth-child(2){box-shadow:inset 2px 0 0 rgba(86,227,159,.17)}
        .runtime-map article:nth-child(19):hover{transform:translateY(-2px);border-color:rgba(114,230,255,.20);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(19):hover{transform:translateY(-1px);box-shadow:0 12px 42px rgba(0,0,0,.24);transition:.22s}
        .check-card:nth-child(7):hover{border-color:rgba(112,151,255,.22);background:rgba(13,29,56,.63)}
        .level-grid article:nth-child(3):hover{border-color:rgba(86,227,159,.21);transform:translateY(-1px)}
        .receipt-tests article:nth-child(3){box-shadow:inset 0px 0 0 rgba(86,227,159,.12)}
        .runtime-map article:nth-child(20):hover{transform:translateY(-3px);border-color:rgba(114,230,255,.21);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(20):hover{transform:translateY(-2px);box-shadow:0 13px 43px rgba(0,0,0,.25);transition:.22s}
        .check-card:nth-child(8):hover{border-color:rgba(112,151,255,.23);background:rgba(13,29,56,.64)}
        .level-grid article:nth-child(4):hover{border-color:rgba(86,227,159,.22);transform:translateY(-2px)}
        .receipt-tests article:nth-child(4){box-shadow:inset 1px 0 0 rgba(86,227,159,.13)}
        .runtime-map article:nth-child(21):hover{transform:translateY(-4px);border-color:rgba(114,230,255,.22);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(1):hover{transform:translateY(-3px);box-shadow:0 14px 24px rgba(0,0,0,.26);transition:.22s}
        .check-card:nth-child(9):hover{border-color:rgba(112,151,255,.24);background:rgba(13,29,56,.45)}
        .level-grid article:nth-child(5):hover{border-color:rgba(86,227,159,.23);transform:translateY(-1px)}
        .receipt-tests article:nth-child(5){box-shadow:inset 2px 0 0 rgba(86,227,159,.14)}
        .runtime-map article:nth-child(22):hover{transform:translateY(-2px);border-color:rgba(114,230,255,.23);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(2):hover{transform:translateY(-1px);box-shadow:0 15px 25px rgba(0,0,0,.20);transition:.22s}
        .check-card:nth-child(10):hover{border-color:rgba(112,151,255,.18);background:rgba(13,29,56,.46)}
        .level-grid article:nth-child(6):hover{border-color:rgba(86,227,159,.17);transform:translateY(-2px)}
        .receipt-tests article:nth-child(6){box-shadow:inset 0px 0 0 rgba(86,227,159,.15)}
        .runtime-map article:nth-child(23):hover{transform:translateY(-3px);border-color:rgba(114,230,255,.24);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(3):hover{transform:translateY(-2px);box-shadow:0 16px 26px rgba(0,0,0,.21);transition:.22s}
        .check-card:nth-child(11):hover{border-color:rgba(112,151,255,.19);background:rgba(13,29,56,.47)}
        .level-grid article:nth-child(7):hover{border-color:rgba(86,227,159,.18);transform:translateY(-1px)}
        .receipt-tests article:nth-child(7){box-shadow:inset 1px 0 0 rgba(86,227,159,.16)}
        .runtime-map article:nth-child(24):hover{transform:translateY(-4px);border-color:rgba(114,230,255,.25);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(4):hover{transform:translateY(-3px);box-shadow:0 17px 27px rgba(0,0,0,.22);transition:.22s}
        .check-card:nth-child(12):hover{border-color:rgba(112,151,255,.20);background:rgba(13,29,56,.48)}
        .level-grid article:nth-child(8):hover{border-color:rgba(86,227,159,.19);transform:translateY(-2px)}
        .receipt-tests article:nth-child(8){box-shadow:inset 2px 0 0 rgba(86,227,159,.17)}
        .runtime-map article:nth-child(1):hover{transform:translateY(-2px);border-color:rgba(114,230,255,.20);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(5):hover{transform:translateY(-1px);box-shadow:0 10px 28px rgba(0,0,0,.23);transition:.22s}
        .check-card:nth-child(1):hover{border-color:rgba(112,151,255,.21);background:rgba(13,29,56,.49)}
        .level-grid article:nth-child(1):hover{border-color:rgba(86,227,159,.20);transform:translateY(-1px)}
        .receipt-tests article:nth-child(1){box-shadow:inset 0px 0 0 rgba(86,227,159,.12)}
        .runtime-map article:nth-child(2):hover{transform:translateY(-3px);border-color:rgba(114,230,255,.21);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(6):hover{transform:translateY(-2px);box-shadow:0 11px 29px rgba(0,0,0,.24);transition:.22s}
        .check-card:nth-child(2):hover{border-color:rgba(112,151,255,.22);background:rgba(13,29,56,.50)}
        .level-grid article:nth-child(2):hover{border-color:rgba(86,227,159,.21);transform:translateY(-2px)}
        .receipt-tests article:nth-child(2){box-shadow:inset 1px 0 0 rgba(86,227,159,.13)}
        .runtime-map article:nth-child(3):hover{transform:translateY(-4px);border-color:rgba(114,230,255,.22);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(7):hover{transform:translateY(-3px);box-shadow:0 12px 30px rgba(0,0,0,.25);transition:.22s}
        .check-card:nth-child(3):hover{border-color:rgba(112,151,255,.23);background:rgba(13,29,56,.51)}
        .level-grid article:nth-child(3):hover{border-color:rgba(86,227,159,.22);transform:translateY(-1px)}
        .receipt-tests article:nth-child(3){box-shadow:inset 2px 0 0 rgba(86,227,159,.14)}
        .runtime-map article:nth-child(4):hover{transform:translateY(-2px);border-color:rgba(114,230,255,.23);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(8):hover{transform:translateY(-1px);box-shadow:0 13px 31px rgba(0,0,0,.26);transition:.22s}
        .check-card:nth-child(4):hover{border-color:rgba(112,151,255,.24);background:rgba(13,29,56,.52)}
        .level-grid article:nth-child(4):hover{border-color:rgba(86,227,159,.23);transform:translateY(-2px)}
        .receipt-tests article:nth-child(4){box-shadow:inset 0px 0 0 rgba(86,227,159,.15)}
        .runtime-map article:nth-child(5):hover{transform:translateY(-3px);border-color:rgba(114,230,255,.24);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(9):hover{transform:translateY(-2px);box-shadow:0 14px 32px rgba(0,0,0,.20);transition:.22s}
        .check-card:nth-child(5):hover{border-color:rgba(112,151,255,.18);background:rgba(13,29,56,.53)}
        .level-grid article:nth-child(5):hover{border-color:rgba(86,227,159,.17);transform:translateY(-1px)}
        .receipt-tests article:nth-child(5){box-shadow:inset 1px 0 0 rgba(86,227,159,.16)}
        .runtime-map article:nth-child(6):hover{transform:translateY(-4px);border-color:rgba(114,230,255,.25);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(10):hover{transform:translateY(-3px);box-shadow:0 15px 33px rgba(0,0,0,.21);transition:.22s}
        .check-card:nth-child(6):hover{border-color:rgba(112,151,255,.19);background:rgba(13,29,56,.54)}
        .level-grid article:nth-child(6):hover{border-color:rgba(86,227,159,.18);transform:translateY(-2px)}
        .receipt-tests article:nth-child(6){box-shadow:inset 2px 0 0 rgba(86,227,159,.17)}
        .runtime-map article:nth-child(7):hover{transform:translateY(-2px);border-color:rgba(114,230,255,.20);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(11):hover{transform:translateY(-1px);box-shadow:0 16px 34px rgba(0,0,0,.22);transition:.22s}
        .check-card:nth-child(7):hover{border-color:rgba(112,151,255,.20);background:rgba(13,29,56,.55)}
        .level-grid article:nth-child(7):hover{border-color:rgba(86,227,159,.19);transform:translateY(-1px)}
        .receipt-tests article:nth-child(7){box-shadow:inset 0px 0 0 rgba(86,227,159,.12)}
        .runtime-map article:nth-child(8):hover{transform:translateY(-3px);border-color:rgba(114,230,255,.21);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(12):hover{transform:translateY(-2px);box-shadow:0 17px 35px rgba(0,0,0,.23);transition:.22s}
        .check-card:nth-child(8):hover{border-color:rgba(112,151,255,.21);background:rgba(13,29,56,.56)}
        .level-grid article:nth-child(8):hover{border-color:rgba(86,227,159,.20);transform:translateY(-2px)}
        .receipt-tests article:nth-child(8){box-shadow:inset 1px 0 0 rgba(86,227,159,.13)}
        .runtime-map article:nth-child(9):hover{transform:translateY(-4px);border-color:rgba(114,230,255,.22);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(13):hover{transform:translateY(-3px);box-shadow:0 10px 36px rgba(0,0,0,.24);transition:.22s}
        .check-card:nth-child(9):hover{border-color:rgba(112,151,255,.22);background:rgba(13,29,56,.57)}
        .level-grid article:nth-child(1):hover{border-color:rgba(86,227,159,.21);transform:translateY(-1px)}
        .receipt-tests article:nth-child(1){box-shadow:inset 2px 0 0 rgba(86,227,159,.14)}
        .runtime-map article:nth-child(10):hover{transform:translateY(-2px);border-color:rgba(114,230,255,.23);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(14):hover{transform:translateY(-1px);box-shadow:0 11px 37px rgba(0,0,0,.25);transition:.22s}
        .check-card:nth-child(10):hover{border-color:rgba(112,151,255,.23);background:rgba(13,29,56,.58)}
        .level-grid article:nth-child(2):hover{border-color:rgba(86,227,159,.22);transform:translateY(-2px)}
        .receipt-tests article:nth-child(2){box-shadow:inset 0px 0 0 rgba(86,227,159,.15)}
        .runtime-map article:nth-child(11):hover{transform:translateY(-3px);border-color:rgba(114,230,255,.24);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(15):hover{transform:translateY(-2px);box-shadow:0 12px 38px rgba(0,0,0,.26);transition:.22s}
        .check-card:nth-child(11):hover{border-color:rgba(112,151,255,.24);background:rgba(13,29,56,.59)}
        .level-grid article:nth-child(3):hover{border-color:rgba(86,227,159,.23);transform:translateY(-1px)}
        .receipt-tests article:nth-child(3){box-shadow:inset 1px 0 0 rgba(86,227,159,.16)}
        .runtime-map article:nth-child(12):hover{transform:translateY(-4px);border-color:rgba(114,230,255,.25);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(16):hover{transform:translateY(-3px);box-shadow:0 13px 39px rgba(0,0,0,.20);transition:.22s}
        .check-card:nth-child(12):hover{border-color:rgba(112,151,255,.18);background:rgba(13,29,56,.60)}
        .level-grid article:nth-child(4):hover{border-color:rgba(86,227,159,.17);transform:translateY(-2px)}
        .receipt-tests article:nth-child(4){box-shadow:inset 2px 0 0 rgba(86,227,159,.17)}
        .runtime-map article:nth-child(13):hover{transform:translateY(-2px);border-color:rgba(114,230,255,.20);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(17):hover{transform:translateY(-1px);box-shadow:0 14px 40px rgba(0,0,0,.21);transition:.22s}
        .check-card:nth-child(1):hover{border-color:rgba(112,151,255,.19);background:rgba(13,29,56,.61)}
        .level-grid article:nth-child(5):hover{border-color:rgba(86,227,159,.18);transform:translateY(-1px)}
        .receipt-tests article:nth-child(5){box-shadow:inset 0px 0 0 rgba(86,227,159,.12)}
        .runtime-map article:nth-child(14):hover{transform:translateY(-3px);border-color:rgba(114,230,255,.21);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(18):hover{transform:translateY(-2px);box-shadow:0 15px 41px rgba(0,0,0,.22);transition:.22s}
        .check-card:nth-child(2):hover{border-color:rgba(112,151,255,.20);background:rgba(13,29,56,.62)}
        .level-grid article:nth-child(6):hover{border-color:rgba(86,227,159,.19);transform:translateY(-2px)}
        .receipt-tests article:nth-child(6){box-shadow:inset 1px 0 0 rgba(86,227,159,.13)}
        .runtime-map article:nth-child(15):hover{transform:translateY(-4px);border-color:rgba(114,230,255,.22);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(19):hover{transform:translateY(-3px);box-shadow:0 16px 42px rgba(0,0,0,.23);transition:.22s}
        .check-card:nth-child(3):hover{border-color:rgba(112,151,255,.21);background:rgba(13,29,56,.63)}
        .level-grid article:nth-child(7):hover{border-color:rgba(86,227,159,.20);transform:translateY(-1px)}
        .receipt-tests article:nth-child(7){box-shadow:inset 2px 0 0 rgba(86,227,159,.14)}
        .runtime-map article:nth-child(16):hover{transform:translateY(-2px);border-color:rgba(114,230,255,.23);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(20):hover{transform:translateY(-1px);box-shadow:0 17px 43px rgba(0,0,0,.24);transition:.22s}
        .check-card:nth-child(4):hover{border-color:rgba(112,151,255,.22);background:rgba(13,29,56,.64)}
        .level-grid article:nth-child(8):hover{border-color:rgba(86,227,159,.21);transform:translateY(-2px)}
        .receipt-tests article:nth-child(8){box-shadow:inset 0px 0 0 rgba(86,227,159,.15)}
        .runtime-map article:nth-child(17):hover{transform:translateY(-3px);border-color:rgba(114,230,255,.24);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(1):hover{transform:translateY(-2px);box-shadow:0 10px 24px rgba(0,0,0,.25);transition:.22s}
        .check-card:nth-child(5):hover{border-color:rgba(112,151,255,.23);background:rgba(13,29,56,.45)}
        .level-grid article:nth-child(1):hover{border-color:rgba(86,227,159,.22);transform:translateY(-1px)}
        .receipt-tests article:nth-child(1){box-shadow:inset 1px 0 0 rgba(86,227,159,.16)}
        .runtime-map article:nth-child(18):hover{transform:translateY(-4px);border-color:rgba(114,230,255,.25);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(2):hover{transform:translateY(-3px);box-shadow:0 11px 25px rgba(0,0,0,.26);transition:.22s}
        .check-card:nth-child(6):hover{border-color:rgba(112,151,255,.24);background:rgba(13,29,56,.46)}
        .level-grid article:nth-child(2):hover{border-color:rgba(86,227,159,.23);transform:translateY(-2px)}
        .receipt-tests article:nth-child(2){box-shadow:inset 2px 0 0 rgba(86,227,159,.17)}
        .runtime-map article:nth-child(19):hover{transform:translateY(-2px);border-color:rgba(114,230,255,.20);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(3):hover{transform:translateY(-1px);box-shadow:0 12px 26px rgba(0,0,0,.20);transition:.22s}
        .check-card:nth-child(7):hover{border-color:rgba(112,151,255,.18);background:rgba(13,29,56,.47)}
        .level-grid article:nth-child(3):hover{border-color:rgba(86,227,159,.17);transform:translateY(-1px)}
        .receipt-tests article:nth-child(3){box-shadow:inset 0px 0 0 rgba(86,227,159,.12)}
        .runtime-map article:nth-child(20):hover{transform:translateY(-3px);border-color:rgba(114,230,255,.21);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(4):hover{transform:translateY(-2px);box-shadow:0 13px 27px rgba(0,0,0,.21);transition:.22s}
        .check-card:nth-child(8):hover{border-color:rgba(112,151,255,.19);background:rgba(13,29,56,.48)}
        .level-grid article:nth-child(4):hover{border-color:rgba(86,227,159,.18);transform:translateY(-2px)}
        .receipt-tests article:nth-child(4){box-shadow:inset 1px 0 0 rgba(86,227,159,.13)}
        .runtime-map article:nth-child(21):hover{transform:translateY(-4px);border-color:rgba(114,230,255,.22);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(5):hover{transform:translateY(-3px);box-shadow:0 14px 28px rgba(0,0,0,.22);transition:.22s}
        .check-card:nth-child(9):hover{border-color:rgba(112,151,255,.20);background:rgba(13,29,56,.49)}
        .level-grid article:nth-child(5):hover{border-color:rgba(86,227,159,.19);transform:translateY(-1px)}
        .receipt-tests article:nth-child(5){box-shadow:inset 2px 0 0 rgba(86,227,159,.14)}
        .runtime-map article:nth-child(22):hover{transform:translateY(-2px);border-color:rgba(114,230,255,.23);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(6):hover{transform:translateY(-1px);box-shadow:0 15px 29px rgba(0,0,0,.23);transition:.22s}
        .check-card:nth-child(10):hover{border-color:rgba(112,151,255,.21);background:rgba(13,29,56,.50)}
        .level-grid article:nth-child(6):hover{border-color:rgba(86,227,159,.20);transform:translateY(-2px)}
        .receipt-tests article:nth-child(6){box-shadow:inset 0px 0 0 rgba(86,227,159,.15)}
        .runtime-map article:nth-child(23):hover{transform:translateY(-3px);border-color:rgba(114,230,255,.24);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(7):hover{transform:translateY(-2px);box-shadow:0 16px 30px rgba(0,0,0,.24);transition:.22s}
        .check-card:nth-child(11):hover{border-color:rgba(112,151,255,.22);background:rgba(13,29,56,.51)}
        .level-grid article:nth-child(7):hover{border-color:rgba(86,227,159,.21);transform:translateY(-1px)}
        .receipt-tests article:nth-child(7){box-shadow:inset 1px 0 0 rgba(86,227,159,.16)}
        .runtime-map article:nth-child(24):hover{transform:translateY(-4px);border-color:rgba(114,230,255,.25);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(8):hover{transform:translateY(-3px);box-shadow:0 17px 31px rgba(0,0,0,.25);transition:.22s}
        .check-card:nth-child(12):hover{border-color:rgba(112,151,255,.23);background:rgba(13,29,56,.52)}
        .level-grid article:nth-child(8):hover{border-color:rgba(86,227,159,.22);transform:translateY(-2px)}
        .receipt-tests article:nth-child(8){box-shadow:inset 2px 0 0 rgba(86,227,159,.17)}
        .runtime-map article:nth-child(1):hover{transform:translateY(-2px);border-color:rgba(114,230,255,.20);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(9):hover{transform:translateY(-1px);box-shadow:0 10px 32px rgba(0,0,0,.26);transition:.22s}
        .check-card:nth-child(1):hover{border-color:rgba(112,151,255,.24);background:rgba(13,29,56,.53)}
        .level-grid article:nth-child(1):hover{border-color:rgba(86,227,159,.23);transform:translateY(-1px)}
        .receipt-tests article:nth-child(1){box-shadow:inset 0px 0 0 rgba(86,227,159,.12)}
        .runtime-map article:nth-child(2):hover{transform:translateY(-3px);border-color:rgba(114,230,255,.21);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(10):hover{transform:translateY(-2px);box-shadow:0 11px 33px rgba(0,0,0,.20);transition:.22s}
        .check-card:nth-child(2):hover{border-color:rgba(112,151,255,.18);background:rgba(13,29,56,.54)}
        .level-grid article:nth-child(2):hover{border-color:rgba(86,227,159,.17);transform:translateY(-2px)}
        .receipt-tests article:nth-child(2){box-shadow:inset 1px 0 0 rgba(86,227,159,.13)}
        .runtime-map article:nth-child(3):hover{transform:translateY(-4px);border-color:rgba(114,230,255,.22);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(11):hover{transform:translateY(-3px);box-shadow:0 12px 34px rgba(0,0,0,.21);transition:.22s}
        .check-card:nth-child(3):hover{border-color:rgba(112,151,255,.19);background:rgba(13,29,56,.55)}
        .level-grid article:nth-child(3):hover{border-color:rgba(86,227,159,.18);transform:translateY(-1px)}
        .receipt-tests article:nth-child(3){box-shadow:inset 2px 0 0 rgba(86,227,159,.14)}
        .runtime-map article:nth-child(4):hover{transform:translateY(-2px);border-color:rgba(114,230,255,.23);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(12):hover{transform:translateY(-1px);box-shadow:0 13px 35px rgba(0,0,0,.22);transition:.22s}
        .check-card:nth-child(4):hover{border-color:rgba(112,151,255,.20);background:rgba(13,29,56,.56)}
        .level-grid article:nth-child(4):hover{border-color:rgba(86,227,159,.19);transform:translateY(-2px)}
        .receipt-tests article:nth-child(4){box-shadow:inset 0px 0 0 rgba(86,227,159,.15)}
        .runtime-map article:nth-child(5):hover{transform:translateY(-3px);border-color:rgba(114,230,255,.24);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(13):hover{transform:translateY(-2px);box-shadow:0 14px 36px rgba(0,0,0,.23);transition:.22s}
        .check-card:nth-child(5):hover{border-color:rgba(112,151,255,.21);background:rgba(13,29,56,.57)}
        .level-grid article:nth-child(5):hover{border-color:rgba(86,227,159,.20);transform:translateY(-1px)}
        .receipt-tests article:nth-child(5){box-shadow:inset 1px 0 0 rgba(86,227,159,.16)}
        .runtime-map article:nth-child(6):hover{transform:translateY(-4px);border-color:rgba(114,230,255,.25);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(14):hover{transform:translateY(-3px);box-shadow:0 15px 37px rgba(0,0,0,.24);transition:.22s}
        .check-card:nth-child(6):hover{border-color:rgba(112,151,255,.22);background:rgba(13,29,56,.58)}
        .level-grid article:nth-child(6):hover{border-color:rgba(86,227,159,.21);transform:translateY(-2px)}
        .receipt-tests article:nth-child(6){box-shadow:inset 2px 0 0 rgba(86,227,159,.17)}
        .runtime-map article:nth-child(7):hover{transform:translateY(-2px);border-color:rgba(114,230,255,.20);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(15):hover{transform:translateY(-1px);box-shadow:0 16px 38px rgba(0,0,0,.25);transition:.22s}
        .check-card:nth-child(7):hover{border-color:rgba(112,151,255,.23);background:rgba(13,29,56,.59)}
        .level-grid article:nth-child(7):hover{border-color:rgba(86,227,159,.22);transform:translateY(-1px)}
        .receipt-tests article:nth-child(7){box-shadow:inset 0px 0 0 rgba(86,227,159,.12)}
        .runtime-map article:nth-child(8):hover{transform:translateY(-3px);border-color:rgba(114,230,255,.21);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(16):hover{transform:translateY(-2px);box-shadow:0 17px 39px rgba(0,0,0,.26);transition:.22s}
        .check-card:nth-child(8):hover{border-color:rgba(112,151,255,.24);background:rgba(13,29,56,.60)}
        .level-grid article:nth-child(8):hover{border-color:rgba(86,227,159,.23);transform:translateY(-2px)}
        .receipt-tests article:nth-child(8){box-shadow:inset 1px 0 0 rgba(86,227,159,.13)}
        .runtime-map article:nth-child(9):hover{transform:translateY(-4px);border-color:rgba(114,230,255,.22);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(17):hover{transform:translateY(-3px);box-shadow:0 10px 40px rgba(0,0,0,.20);transition:.22s}
        .check-card:nth-child(9):hover{border-color:rgba(112,151,255,.18);background:rgba(13,29,56,.61)}
        .level-grid article:nth-child(1):hover{border-color:rgba(86,227,159,.17);transform:translateY(-1px)}
        .receipt-tests article:nth-child(1){box-shadow:inset 2px 0 0 rgba(86,227,159,.14)}
        .runtime-map article:nth-child(10):hover{transform:translateY(-2px);border-color:rgba(114,230,255,.23);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(18):hover{transform:translateY(-1px);box-shadow:0 11px 41px rgba(0,0,0,.21);transition:.22s}
        .check-card:nth-child(10):hover{border-color:rgba(112,151,255,.19);background:rgba(13,29,56,.62)}
        .level-grid article:nth-child(2):hover{border-color:rgba(86,227,159,.18);transform:translateY(-2px)}
        .receipt-tests article:nth-child(2){box-shadow:inset 0px 0 0 rgba(86,227,159,.15)}
        .runtime-map article:nth-child(11):hover{transform:translateY(-3px);border-color:rgba(114,230,255,.24);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(19):hover{transform:translateY(-2px);box-shadow:0 12px 42px rgba(0,0,0,.22);transition:.22s}
        .check-card:nth-child(11):hover{border-color:rgba(112,151,255,.20);background:rgba(13,29,56,.63)}
        .level-grid article:nth-child(3):hover{border-color:rgba(86,227,159,.19);transform:translateY(-1px)}
        .receipt-tests article:nth-child(3){box-shadow:inset 1px 0 0 rgba(86,227,159,.16)}
        .runtime-map article:nth-child(12):hover{transform:translateY(-4px);border-color:rgba(114,230,255,.25);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(20):hover{transform:translateY(-3px);box-shadow:0 13px 43px rgba(0,0,0,.23);transition:.22s}
        .check-card:nth-child(12):hover{border-color:rgba(112,151,255,.21);background:rgba(13,29,56,.64)}
        .level-grid article:nth-child(4):hover{border-color:rgba(86,227,159,.20);transform:translateY(-2px)}
        .receipt-tests article:nth-child(4){box-shadow:inset 2px 0 0 rgba(86,227,159,.17)}
        .runtime-map article:nth-child(13):hover{transform:translateY(-2px);border-color:rgba(114,230,255,.20);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(1):hover{transform:translateY(-1px);box-shadow:0 14px 24px rgba(0,0,0,.24);transition:.22s}
        .check-card:nth-child(1):hover{border-color:rgba(112,151,255,.22);background:rgba(13,29,56,.45)}
        .level-grid article:nth-child(5):hover{border-color:rgba(86,227,159,.21);transform:translateY(-1px)}
        .receipt-tests article:nth-child(5){box-shadow:inset 0px 0 0 rgba(86,227,159,.12)}
        .runtime-map article:nth-child(14):hover{transform:translateY(-3px);border-color:rgba(114,230,255,.21);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(2):hover{transform:translateY(-2px);box-shadow:0 15px 25px rgba(0,0,0,.25);transition:.22s}
        .check-card:nth-child(2):hover{border-color:rgba(112,151,255,.23);background:rgba(13,29,56,.46)}
        .level-grid article:nth-child(6):hover{border-color:rgba(86,227,159,.22);transform:translateY(-2px)}
        .receipt-tests article:nth-child(6){box-shadow:inset 1px 0 0 rgba(86,227,159,.13)}
        .runtime-map article:nth-child(15):hover{transform:translateY(-4px);border-color:rgba(114,230,255,.22);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(3):hover{transform:translateY(-3px);box-shadow:0 16px 26px rgba(0,0,0,.26);transition:.22s}
        .check-card:nth-child(3):hover{border-color:rgba(112,151,255,.24);background:rgba(13,29,56,.47)}
        .level-grid article:nth-child(7):hover{border-color:rgba(86,227,159,.23);transform:translateY(-1px)}
        .receipt-tests article:nth-child(7){box-shadow:inset 2px 0 0 rgba(86,227,159,.14)}
        .runtime-map article:nth-child(16):hover{transform:translateY(-2px);border-color:rgba(114,230,255,.23);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(4):hover{transform:translateY(-1px);box-shadow:0 17px 27px rgba(0,0,0,.20);transition:.22s}
        .check-card:nth-child(4):hover{border-color:rgba(112,151,255,.18);background:rgba(13,29,56,.48)}
        .level-grid article:nth-child(8):hover{border-color:rgba(86,227,159,.17);transform:translateY(-2px)}
        .receipt-tests article:nth-child(8){box-shadow:inset 0px 0 0 rgba(86,227,159,.15)}
        .runtime-map article:nth-child(17):hover{transform:translateY(-3px);border-color:rgba(114,230,255,.24);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(5):hover{transform:translateY(-2px);box-shadow:0 10px 28px rgba(0,0,0,.21);transition:.22s}
        .check-card:nth-child(5):hover{border-color:rgba(112,151,255,.19);background:rgba(13,29,56,.49)}
        .level-grid article:nth-child(1):hover{border-color:rgba(86,227,159,.18);transform:translateY(-1px)}
        .receipt-tests article:nth-child(1){box-shadow:inset 1px 0 0 rgba(86,227,159,.16)}
        .runtime-map article:nth-child(18):hover{transform:translateY(-4px);border-color:rgba(114,230,255,.25);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(6):hover{transform:translateY(-3px);box-shadow:0 11px 29px rgba(0,0,0,.22);transition:.22s}
        .check-card:nth-child(6):hover{border-color:rgba(112,151,255,.20);background:rgba(13,29,56,.50)}
        .level-grid article:nth-child(2):hover{border-color:rgba(86,227,159,.19);transform:translateY(-2px)}
        .receipt-tests article:nth-child(2){box-shadow:inset 2px 0 0 rgba(86,227,159,.17)}
        .runtime-map article:nth-child(19):hover{transform:translateY(-2px);border-color:rgba(114,230,255,.20);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(7):hover{transform:translateY(-1px);box-shadow:0 12px 30px rgba(0,0,0,.23);transition:.22s}
        .check-card:nth-child(7):hover{border-color:rgba(112,151,255,.21);background:rgba(13,29,56,.51)}
        .level-grid article:nth-child(3):hover{border-color:rgba(86,227,159,.20);transform:translateY(-1px)}
        .receipt-tests article:nth-child(3){box-shadow:inset 0px 0 0 rgba(86,227,159,.12)}
        .runtime-map article:nth-child(20):hover{transform:translateY(-3px);border-color:rgba(114,230,255,.21);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(8):hover{transform:translateY(-2px);box-shadow:0 13px 31px rgba(0,0,0,.24);transition:.22s}
        .check-card:nth-child(8):hover{border-color:rgba(112,151,255,.22);background:rgba(13,29,56,.52)}
        .level-grid article:nth-child(4):hover{border-color:rgba(86,227,159,.21);transform:translateY(-2px)}
        .receipt-tests article:nth-child(4){box-shadow:inset 1px 0 0 rgba(86,227,159,.13)}
        .runtime-map article:nth-child(21):hover{transform:translateY(-4px);border-color:rgba(114,230,255,.22);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(9):hover{transform:translateY(-3px);box-shadow:0 14px 32px rgba(0,0,0,.25);transition:.22s}
        .check-card:nth-child(9):hover{border-color:rgba(112,151,255,.23);background:rgba(13,29,56,.53)}
        .level-grid article:nth-child(5):hover{border-color:rgba(86,227,159,.22);transform:translateY(-1px)}
        .receipt-tests article:nth-child(5){box-shadow:inset 2px 0 0 rgba(86,227,159,.14)}
        .runtime-map article:nth-child(22):hover{transform:translateY(-2px);border-color:rgba(114,230,255,.23);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(10):hover{transform:translateY(-1px);box-shadow:0 15px 33px rgba(0,0,0,.26);transition:.22s}
        .check-card:nth-child(10):hover{border-color:rgba(112,151,255,.24);background:rgba(13,29,56,.54)}
        .level-grid article:nth-child(6):hover{border-color:rgba(86,227,159,.23);transform:translateY(-2px)}
        .receipt-tests article:nth-child(6){box-shadow:inset 0px 0 0 rgba(86,227,159,.15)}
        .runtime-map article:nth-child(23):hover{transform:translateY(-3px);border-color:rgba(114,230,255,.24);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(11):hover{transform:translateY(-2px);box-shadow:0 16px 34px rgba(0,0,0,.20);transition:.22s}
        .check-card:nth-child(11):hover{border-color:rgba(112,151,255,.18);background:rgba(13,29,56,.55)}
        .level-grid article:nth-child(7):hover{border-color:rgba(86,227,159,.17);transform:translateY(-1px)}
        .receipt-tests article:nth-child(7){box-shadow:inset 1px 0 0 rgba(86,227,159,.16)}
        .runtime-map article:nth-child(24):hover{transform:translateY(-4px);border-color:rgba(114,230,255,.25);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(12):hover{transform:translateY(-3px);box-shadow:0 17px 35px rgba(0,0,0,.21);transition:.22s}
        .check-card:nth-child(12):hover{border-color:rgba(112,151,255,.19);background:rgba(13,29,56,.56)}
        .level-grid article:nth-child(8):hover{border-color:rgba(86,227,159,.18);transform:translateY(-2px)}
        .receipt-tests article:nth-child(8){box-shadow:inset 2px 0 0 rgba(86,227,159,.17)}
        .runtime-map article:nth-child(1):hover{transform:translateY(-2px);border-color:rgba(114,230,255,.20);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(13):hover{transform:translateY(-1px);box-shadow:0 10px 36px rgba(0,0,0,.22);transition:.22s}
        .check-card:nth-child(1):hover{border-color:rgba(112,151,255,.20);background:rgba(13,29,56,.57)}
        .level-grid article:nth-child(1):hover{border-color:rgba(86,227,159,.19);transform:translateY(-1px)}
        .receipt-tests article:nth-child(1){box-shadow:inset 0px 0 0 rgba(86,227,159,.12)}
        .runtime-map article:nth-child(2):hover{transform:translateY(-3px);border-color:rgba(114,230,255,.21);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(14):hover{transform:translateY(-2px);box-shadow:0 11px 37px rgba(0,0,0,.23);transition:.22s}
        .check-card:nth-child(2):hover{border-color:rgba(112,151,255,.21);background:rgba(13,29,56,.58)}
        .level-grid article:nth-child(2):hover{border-color:rgba(86,227,159,.20);transform:translateY(-2px)}
        .receipt-tests article:nth-child(2){box-shadow:inset 1px 0 0 rgba(86,227,159,.13)}
        .runtime-map article:nth-child(3):hover{transform:translateY(-4px);border-color:rgba(114,230,255,.22);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(15):hover{transform:translateY(-3px);box-shadow:0 12px 38px rgba(0,0,0,.24);transition:.22s}
        .check-card:nth-child(3):hover{border-color:rgba(112,151,255,.22);background:rgba(13,29,56,.59)}
        .level-grid article:nth-child(3):hover{border-color:rgba(86,227,159,.21);transform:translateY(-1px)}
        .receipt-tests article:nth-child(3){box-shadow:inset 2px 0 0 rgba(86,227,159,.14)}
        .runtime-map article:nth-child(4):hover{transform:translateY(-2px);border-color:rgba(114,230,255,.23);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(16):hover{transform:translateY(-1px);box-shadow:0 13px 39px rgba(0,0,0,.25);transition:.22s}
        .check-card:nth-child(4):hover{border-color:rgba(112,151,255,.23);background:rgba(13,29,56,.60)}
        .level-grid article:nth-child(4):hover{border-color:rgba(86,227,159,.22);transform:translateY(-2px)}
        .receipt-tests article:nth-child(4){box-shadow:inset 0px 0 0 rgba(86,227,159,.15)}
        .runtime-map article:nth-child(5):hover{transform:translateY(-3px);border-color:rgba(114,230,255,.24);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(17):hover{transform:translateY(-2px);box-shadow:0 14px 40px rgba(0,0,0,.26);transition:.22s}
        .check-card:nth-child(5):hover{border-color:rgba(112,151,255,.24);background:rgba(13,29,56,.61)}
        .level-grid article:nth-child(5):hover{border-color:rgba(86,227,159,.23);transform:translateY(-1px)}
        .receipt-tests article:nth-child(5){box-shadow:inset 1px 0 0 rgba(86,227,159,.16)}
        .runtime-map article:nth-child(6):hover{transform:translateY(-4px);border-color:rgba(114,230,255,.25);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(18):hover{transform:translateY(-3px);box-shadow:0 15px 41px rgba(0,0,0,.20);transition:.22s}
        .check-card:nth-child(6):hover{border-color:rgba(112,151,255,.18);background:rgba(13,29,56,.62)}
        .level-grid article:nth-child(6):hover{border-color:rgba(86,227,159,.17);transform:translateY(-2px)}
        .receipt-tests article:nth-child(6){box-shadow:inset 2px 0 0 rgba(86,227,159,.17)}
        .runtime-map article:nth-child(7):hover{transform:translateY(-2px);border-color:rgba(114,230,255,.20);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(19):hover{transform:translateY(-1px);box-shadow:0 16px 42px rgba(0,0,0,.21);transition:.22s}
        .check-card:nth-child(7):hover{border-color:rgba(112,151,255,.19);background:rgba(13,29,56,.63)}
        .level-grid article:nth-child(7):hover{border-color:rgba(86,227,159,.18);transform:translateY(-1px)}
        .receipt-tests article:nth-child(7){box-shadow:inset 0px 0 0 rgba(86,227,159,.12)}
        .runtime-map article:nth-child(8):hover{transform:translateY(-3px);border-color:rgba(114,230,255,.21);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(20):hover{transform:translateY(-2px);box-shadow:0 17px 43px rgba(0,0,0,.22);transition:.22s}
        .check-card:nth-child(8):hover{border-color:rgba(112,151,255,.20);background:rgba(13,29,56,.64)}
        .level-grid article:nth-child(8):hover{border-color:rgba(86,227,159,.19);transform:translateY(-2px)}
        .receipt-tests article:nth-child(8){box-shadow:inset 1px 0 0 rgba(86,227,159,.13)}
        .runtime-map article:nth-child(9):hover{transform:translateY(-4px);border-color:rgba(114,230,255,.22);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(1):hover{transform:translateY(-3px);box-shadow:0 10px 24px rgba(0,0,0,.23);transition:.22s}
        .check-card:nth-child(9):hover{border-color:rgba(112,151,255,.21);background:rgba(13,29,56,.45)}
        .level-grid article:nth-child(1):hover{border-color:rgba(86,227,159,.20);transform:translateY(-1px)}
        .receipt-tests article:nth-child(1){box-shadow:inset 2px 0 0 rgba(86,227,159,.14)}
        .runtime-map article:nth-child(10):hover{transform:translateY(-2px);border-color:rgba(114,230,255,.23);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(2):hover{transform:translateY(-1px);box-shadow:0 11px 25px rgba(0,0,0,.24);transition:.22s}
        .check-card:nth-child(10):hover{border-color:rgba(112,151,255,.22);background:rgba(13,29,56,.46)}
        .level-grid article:nth-child(2):hover{border-color:rgba(86,227,159,.21);transform:translateY(-2px)}
        .receipt-tests article:nth-child(2){box-shadow:inset 0px 0 0 rgba(86,227,159,.15)}
        .runtime-map article:nth-child(11):hover{transform:translateY(-3px);border-color:rgba(114,230,255,.24);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(3):hover{transform:translateY(-2px);box-shadow:0 12px 26px rgba(0,0,0,.25);transition:.22s}
        .check-card:nth-child(11):hover{border-color:rgba(112,151,255,.23);background:rgba(13,29,56,.47)}
        .level-grid article:nth-child(3):hover{border-color:rgba(86,227,159,.22);transform:translateY(-1px)}
        .receipt-tests article:nth-child(3){box-shadow:inset 1px 0 0 rgba(86,227,159,.16)}
        .runtime-map article:nth-child(12):hover{transform:translateY(-4px);border-color:rgba(114,230,255,.25);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(4):hover{transform:translateY(-3px);box-shadow:0 13px 27px rgba(0,0,0,.26);transition:.22s}
        .check-card:nth-child(12):hover{border-color:rgba(112,151,255,.24);background:rgba(13,29,56,.48)}
        .level-grid article:nth-child(4):hover{border-color:rgba(86,227,159,.23);transform:translateY(-2px)}
        .receipt-tests article:nth-child(4){box-shadow:inset 2px 0 0 rgba(86,227,159,.17)}
        .runtime-map article:nth-child(13):hover{transform:translateY(-2px);border-color:rgba(114,230,255,.20);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(5):hover{transform:translateY(-1px);box-shadow:0 14px 28px rgba(0,0,0,.20);transition:.22s}
        .check-card:nth-child(1):hover{border-color:rgba(112,151,255,.18);background:rgba(13,29,56,.49)}
        .level-grid article:nth-child(5):hover{border-color:rgba(86,227,159,.17);transform:translateY(-1px)}
        .receipt-tests article:nth-child(5){box-shadow:inset 0px 0 0 rgba(86,227,159,.12)}
        .runtime-map article:nth-child(14):hover{transform:translateY(-3px);border-color:rgba(114,230,255,.21);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(6):hover{transform:translateY(-2px);box-shadow:0 15px 29px rgba(0,0,0,.21);transition:.22s}
        .check-card:nth-child(2):hover{border-color:rgba(112,151,255,.19);background:rgba(13,29,56,.50)}
        .level-grid article:nth-child(6):hover{border-color:rgba(86,227,159,.18);transform:translateY(-2px)}
        .receipt-tests article:nth-child(6){box-shadow:inset 1px 0 0 rgba(86,227,159,.13)}
        .runtime-map article:nth-child(15):hover{transform:translateY(-4px);border-color:rgba(114,230,255,.22);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(7):hover{transform:translateY(-3px);box-shadow:0 16px 30px rgba(0,0,0,.22);transition:.22s}
        .check-card:nth-child(3):hover{border-color:rgba(112,151,255,.20);background:rgba(13,29,56,.51)}
        .level-grid article:nth-child(7):hover{border-color:rgba(86,227,159,.19);transform:translateY(-1px)}
        .receipt-tests article:nth-child(7){box-shadow:inset 2px 0 0 rgba(86,227,159,.14)}
        .runtime-map article:nth-child(16):hover{transform:translateY(-2px);border-color:rgba(114,230,255,.23);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(8):hover{transform:translateY(-1px);box-shadow:0 17px 31px rgba(0,0,0,.23);transition:.22s}
        .check-card:nth-child(4):hover{border-color:rgba(112,151,255,.21);background:rgba(13,29,56,.52)}
        .level-grid article:nth-child(8):hover{border-color:rgba(86,227,159,.20);transform:translateY(-2px)}
        .receipt-tests article:nth-child(8){box-shadow:inset 0px 0 0 rgba(86,227,159,.15)}
        .runtime-map article:nth-child(17):hover{transform:translateY(-3px);border-color:rgba(114,230,255,.24);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(9):hover{transform:translateY(-2px);box-shadow:0 10px 32px rgba(0,0,0,.24);transition:.22s}
        .check-card:nth-child(5):hover{border-color:rgba(112,151,255,.22);background:rgba(13,29,56,.53)}
        .level-grid article:nth-child(1):hover{border-color:rgba(86,227,159,.21);transform:translateY(-1px)}
        .receipt-tests article:nth-child(1){box-shadow:inset 1px 0 0 rgba(86,227,159,.16)}
        .runtime-map article:nth-child(18):hover{transform:translateY(-4px);border-color:rgba(114,230,255,.25);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(10):hover{transform:translateY(-3px);box-shadow:0 11px 33px rgba(0,0,0,.25);transition:.22s}
        .check-card:nth-child(6):hover{border-color:rgba(112,151,255,.23);background:rgba(13,29,56,.54)}
        .level-grid article:nth-child(2):hover{border-color:rgba(86,227,159,.22);transform:translateY(-2px)}
        .receipt-tests article:nth-child(2){box-shadow:inset 2px 0 0 rgba(86,227,159,.17)}
        .runtime-map article:nth-child(19):hover{transform:translateY(-2px);border-color:rgba(114,230,255,.20);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(11):hover{transform:translateY(-1px);box-shadow:0 12px 34px rgba(0,0,0,.26);transition:.22s}
        .check-card:nth-child(7):hover{border-color:rgba(112,151,255,.24);background:rgba(13,29,56,.55)}
        .level-grid article:nth-child(3):hover{border-color:rgba(86,227,159,.23);transform:translateY(-1px)}
        .receipt-tests article:nth-child(3){box-shadow:inset 0px 0 0 rgba(86,227,159,.12)}
        .runtime-map article:nth-child(20):hover{transform:translateY(-3px);border-color:rgba(114,230,255,.21);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(12):hover{transform:translateY(-2px);box-shadow:0 13px 35px rgba(0,0,0,.20);transition:.22s}
        .check-card:nth-child(8):hover{border-color:rgba(112,151,255,.18);background:rgba(13,29,56,.56)}
        .level-grid article:nth-child(4):hover{border-color:rgba(86,227,159,.17);transform:translateY(-2px)}
        .receipt-tests article:nth-child(4){box-shadow:inset 1px 0 0 rgba(86,227,159,.13)}
        .runtime-map article:nth-child(21):hover{transform:translateY(-4px);border-color:rgba(114,230,255,.22);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(13):hover{transform:translateY(-3px);box-shadow:0 14px 36px rgba(0,0,0,.21);transition:.22s}
        .check-card:nth-child(9):hover{border-color:rgba(112,151,255,.19);background:rgba(13,29,56,.57)}
        .level-grid article:nth-child(5):hover{border-color:rgba(86,227,159,.18);transform:translateY(-1px)}
        .receipt-tests article:nth-child(5){box-shadow:inset 2px 0 0 rgba(86,227,159,.14)}
        .runtime-map article:nth-child(22):hover{transform:translateY(-2px);border-color:rgba(114,230,255,.23);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(14):hover{transform:translateY(-1px);box-shadow:0 15px 37px rgba(0,0,0,.22);transition:.22s}
        .check-card:nth-child(10):hover{border-color:rgba(112,151,255,.20);background:rgba(13,29,56,.58)}
        .level-grid article:nth-child(6):hover{border-color:rgba(86,227,159,.19);transform:translateY(-2px)}
        .receipt-tests article:nth-child(6){box-shadow:inset 0px 0 0 rgba(86,227,159,.15)}
        .runtime-map article:nth-child(23):hover{transform:translateY(-3px);border-color:rgba(114,230,255,.24);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(15):hover{transform:translateY(-2px);box-shadow:0 16px 38px rgba(0,0,0,.23);transition:.22s}
        .check-card:nth-child(11):hover{border-color:rgba(112,151,255,.21);background:rgba(13,29,56,.59)}
        .level-grid article:nth-child(7):hover{border-color:rgba(86,227,159,.20);transform:translateY(-1px)}
        .receipt-tests article:nth-child(7){box-shadow:inset 1px 0 0 rgba(86,227,159,.16)}
        .runtime-map article:nth-child(24):hover{transform:translateY(-4px);border-color:rgba(114,230,255,.25);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(16):hover{transform:translateY(-3px);box-shadow:0 17px 39px rgba(0,0,0,.24);transition:.22s}
        .check-card:nth-child(12):hover{border-color:rgba(112,151,255,.22);background:rgba(13,29,56,.60)}
        .level-grid article:nth-child(8):hover{border-color:rgba(86,227,159,.21);transform:translateY(-2px)}
        .receipt-tests article:nth-child(8){box-shadow:inset 2px 0 0 rgba(86,227,159,.17)}
        .runtime-map article:nth-child(1):hover{transform:translateY(-2px);border-color:rgba(114,230,255,.20);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(17):hover{transform:translateY(-1px);box-shadow:0 10px 40px rgba(0,0,0,.25);transition:.22s}
        .check-card:nth-child(1):hover{border-color:rgba(112,151,255,.23);background:rgba(13,29,56,.61)}
        .level-grid article:nth-child(1):hover{border-color:rgba(86,227,159,.22);transform:translateY(-1px)}
        .receipt-tests article:nth-child(1){box-shadow:inset 0px 0 0 rgba(86,227,159,.12)}
        .runtime-map article:nth-child(2):hover{transform:translateY(-3px);border-color:rgba(114,230,255,.21);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(18):hover{transform:translateY(-2px);box-shadow:0 11px 41px rgba(0,0,0,.26);transition:.22s}
        .check-card:nth-child(2):hover{border-color:rgba(112,151,255,.24);background:rgba(13,29,56,.62)}
        .level-grid article:nth-child(2):hover{border-color:rgba(86,227,159,.23);transform:translateY(-2px)}
        .receipt-tests article:nth-child(2){box-shadow:inset 1px 0 0 rgba(86,227,159,.13)}
        .runtime-map article:nth-child(3):hover{transform:translateY(-4px);border-color:rgba(114,230,255,.22);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(19):hover{transform:translateY(-3px);box-shadow:0 12px 42px rgba(0,0,0,.20);transition:.22s}
        .check-card:nth-child(3):hover{border-color:rgba(112,151,255,.18);background:rgba(13,29,56,.63)}
        .level-grid article:nth-child(3):hover{border-color:rgba(86,227,159,.17);transform:translateY(-1px)}
        .receipt-tests article:nth-child(3){box-shadow:inset 2px 0 0 rgba(86,227,159,.14)}
        .runtime-map article:nth-child(4):hover{transform:translateY(-2px);border-color:rgba(114,230,255,.23);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(20):hover{transform:translateY(-1px);box-shadow:0 13px 43px rgba(0,0,0,.21);transition:.22s}
        .check-card:nth-child(4):hover{border-color:rgba(112,151,255,.19);background:rgba(13,29,56,.64)}
        .level-grid article:nth-child(4):hover{border-color:rgba(86,227,159,.18);transform:translateY(-2px)}
        .receipt-tests article:nth-child(4){box-shadow:inset 0px 0 0 rgba(86,227,159,.15)}
        .runtime-map article:nth-child(5):hover{transform:translateY(-3px);border-color:rgba(114,230,255,.24);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(1):hover{transform:translateY(-2px);box-shadow:0 14px 24px rgba(0,0,0,.22);transition:.22s}
        .check-card:nth-child(5):hover{border-color:rgba(112,151,255,.20);background:rgba(13,29,56,.45)}
        .level-grid article:nth-child(5):hover{border-color:rgba(86,227,159,.19);transform:translateY(-1px)}
        .receipt-tests article:nth-child(5){box-shadow:inset 1px 0 0 rgba(86,227,159,.16)}
        .runtime-map article:nth-child(6):hover{transform:translateY(-4px);border-color:rgba(114,230,255,.25);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(2):hover{transform:translateY(-3px);box-shadow:0 15px 25px rgba(0,0,0,.23);transition:.22s}
        .check-card:nth-child(6):hover{border-color:rgba(112,151,255,.21);background:rgba(13,29,56,.46)}
        .level-grid article:nth-child(6):hover{border-color:rgba(86,227,159,.20);transform:translateY(-2px)}
        .receipt-tests article:nth-child(6){box-shadow:inset 2px 0 0 rgba(86,227,159,.17)}
        .runtime-map article:nth-child(7):hover{transform:translateY(-2px);border-color:rgba(114,230,255,.20);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(3):hover{transform:translateY(-1px);box-shadow:0 16px 26px rgba(0,0,0,.24);transition:.22s}
        .check-card:nth-child(7):hover{border-color:rgba(112,151,255,.22);background:rgba(13,29,56,.47)}
        .level-grid article:nth-child(7):hover{border-color:rgba(86,227,159,.21);transform:translateY(-1px)}
        .receipt-tests article:nth-child(7){box-shadow:inset 0px 0 0 rgba(86,227,159,.12)}
        .runtime-map article:nth-child(8):hover{transform:translateY(-3px);border-color:rgba(114,230,255,.21);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(4):hover{transform:translateY(-2px);box-shadow:0 17px 27px rgba(0,0,0,.25);transition:.22s}
        .check-card:nth-child(8):hover{border-color:rgba(112,151,255,.23);background:rgba(13,29,56,.48)}
        .level-grid article:nth-child(8):hover{border-color:rgba(86,227,159,.22);transform:translateY(-2px)}
        .receipt-tests article:nth-child(8){box-shadow:inset 1px 0 0 rgba(86,227,159,.13)}
        .runtime-map article:nth-child(9):hover{transform:translateY(-4px);border-color:rgba(114,230,255,.22);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(5):hover{transform:translateY(-3px);box-shadow:0 10px 28px rgba(0,0,0,.26);transition:.22s}
        .check-card:nth-child(9):hover{border-color:rgba(112,151,255,.24);background:rgba(13,29,56,.49)}
        .level-grid article:nth-child(1):hover{border-color:rgba(86,227,159,.23);transform:translateY(-1px)}
        .receipt-tests article:nth-child(1){box-shadow:inset 2px 0 0 rgba(86,227,159,.14)}
        .runtime-map article:nth-child(10):hover{transform:translateY(-2px);border-color:rgba(114,230,255,.23);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(6):hover{transform:translateY(-1px);box-shadow:0 11px 29px rgba(0,0,0,.20);transition:.22s}
        .check-card:nth-child(10):hover{border-color:rgba(112,151,255,.18);background:rgba(13,29,56,.50)}
        .level-grid article:nth-child(2):hover{border-color:rgba(86,227,159,.17);transform:translateY(-2px)}
        .receipt-tests article:nth-child(2){box-shadow:inset 0px 0 0 rgba(86,227,159,.15)}
        .runtime-map article:nth-child(11):hover{transform:translateY(-3px);border-color:rgba(114,230,255,.24);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(7):hover{transform:translateY(-2px);box-shadow:0 12px 30px rgba(0,0,0,.21);transition:.22s}
        .check-card:nth-child(11):hover{border-color:rgba(112,151,255,.19);background:rgba(13,29,56,.51)}
        .level-grid article:nth-child(3):hover{border-color:rgba(86,227,159,.18);transform:translateY(-1px)}
        .receipt-tests article:nth-child(3){box-shadow:inset 1px 0 0 rgba(86,227,159,.16)}
        .runtime-map article:nth-child(12):hover{transform:translateY(-4px);border-color:rgba(114,230,255,.25);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(8):hover{transform:translateY(-3px);box-shadow:0 13px 31px rgba(0,0,0,.22);transition:.22s}
        .check-card:nth-child(12):hover{border-color:rgba(112,151,255,.20);background:rgba(13,29,56,.52)}
        .level-grid article:nth-child(4):hover{border-color:rgba(86,227,159,.19);transform:translateY(-2px)}
        .receipt-tests article:nth-child(4){box-shadow:inset 2px 0 0 rgba(86,227,159,.17)}
        .runtime-map article:nth-child(13):hover{transform:translateY(-2px);border-color:rgba(114,230,255,.20);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(9):hover{transform:translateY(-1px);box-shadow:0 14px 32px rgba(0,0,0,.23);transition:.22s}
        .check-card:nth-child(1):hover{border-color:rgba(112,151,255,.21);background:rgba(13,29,56,.53)}
        .level-grid article:nth-child(5):hover{border-color:rgba(86,227,159,.20);transform:translateY(-1px)}
        .receipt-tests article:nth-child(5){box-shadow:inset 0px 0 0 rgba(86,227,159,.12)}
        .runtime-map article:nth-child(14):hover{transform:translateY(-3px);border-color:rgba(114,230,255,.21);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(10):hover{transform:translateY(-2px);box-shadow:0 15px 33px rgba(0,0,0,.24);transition:.22s}
        .check-card:nth-child(2):hover{border-color:rgba(112,151,255,.22);background:rgba(13,29,56,.54)}
        .level-grid article:nth-child(6):hover{border-color:rgba(86,227,159,.21);transform:translateY(-2px)}
        .receipt-tests article:nth-child(6){box-shadow:inset 1px 0 0 rgba(86,227,159,.13)}
        .runtime-map article:nth-child(15):hover{transform:translateY(-4px);border-color:rgba(114,230,255,.22);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(11):hover{transform:translateY(-3px);box-shadow:0 16px 34px rgba(0,0,0,.25);transition:.22s}
        .check-card:nth-child(3):hover{border-color:rgba(112,151,255,.23);background:rgba(13,29,56,.55)}
        .level-grid article:nth-child(7):hover{border-color:rgba(86,227,159,.22);transform:translateY(-1px)}
        .receipt-tests article:nth-child(7){box-shadow:inset 2px 0 0 rgba(86,227,159,.14)}
        .runtime-map article:nth-child(16):hover{transform:translateY(-2px);border-color:rgba(114,230,255,.23);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(12):hover{transform:translateY(-1px);box-shadow:0 17px 35px rgba(0,0,0,.26);transition:.22s}
        .check-card:nth-child(4):hover{border-color:rgba(112,151,255,.24);background:rgba(13,29,56,.56)}
        .level-grid article:nth-child(8):hover{border-color:rgba(86,227,159,.23);transform:translateY(-2px)}
        .receipt-tests article:nth-child(8){box-shadow:inset 0px 0 0 rgba(86,227,159,.15)}
        .runtime-map article:nth-child(17):hover{transform:translateY(-3px);border-color:rgba(114,230,255,.24);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(13):hover{transform:translateY(-2px);box-shadow:0 10px 36px rgba(0,0,0,.20);transition:.22s}
        .check-card:nth-child(5):hover{border-color:rgba(112,151,255,.18);background:rgba(13,29,56,.57)}
        .level-grid article:nth-child(1):hover{border-color:rgba(86,227,159,.17);transform:translateY(-1px)}
        .receipt-tests article:nth-child(1){box-shadow:inset 1px 0 0 rgba(86,227,159,.16)}
        .runtime-map article:nth-child(18):hover{transform:translateY(-4px);border-color:rgba(114,230,255,.25);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(14):hover{transform:translateY(-3px);box-shadow:0 11px 37px rgba(0,0,0,.21);transition:.22s}
        .check-card:nth-child(6):hover{border-color:rgba(112,151,255,.19);background:rgba(13,29,56,.58)}
        .level-grid article:nth-child(2):hover{border-color:rgba(86,227,159,.18);transform:translateY(-2px)}
        .receipt-tests article:nth-child(2){box-shadow:inset 2px 0 0 rgba(86,227,159,.17)}
        .runtime-map article:nth-child(19):hover{transform:translateY(-2px);border-color:rgba(114,230,255,.20);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(15):hover{transform:translateY(-1px);box-shadow:0 12px 38px rgba(0,0,0,.22);transition:.22s}
        .check-card:nth-child(7):hover{border-color:rgba(112,151,255,.20);background:rgba(13,29,56,.59)}
        .level-grid article:nth-child(3):hover{border-color:rgba(86,227,159,.19);transform:translateY(-1px)}
        .receipt-tests article:nth-child(3){box-shadow:inset 0px 0 0 rgba(86,227,159,.12)}
        .runtime-map article:nth-child(20):hover{transform:translateY(-3px);border-color:rgba(114,230,255,.21);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(16):hover{transform:translateY(-2px);box-shadow:0 13px 39px rgba(0,0,0,.23);transition:.22s}
        .check-card:nth-child(8):hover{border-color:rgba(112,151,255,.21);background:rgba(13,29,56,.60)}
        .level-grid article:nth-child(4):hover{border-color:rgba(86,227,159,.20);transform:translateY(-2px)}
        .receipt-tests article:nth-child(4){box-shadow:inset 1px 0 0 rgba(86,227,159,.13)}
        .runtime-map article:nth-child(21):hover{transform:translateY(-4px);border-color:rgba(114,230,255,.22);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(17):hover{transform:translateY(-3px);box-shadow:0 14px 40px rgba(0,0,0,.24);transition:.22s}
        .check-card:nth-child(9):hover{border-color:rgba(112,151,255,.22);background:rgba(13,29,56,.61)}
        .level-grid article:nth-child(5):hover{border-color:rgba(86,227,159,.21);transform:translateY(-1px)}
        .receipt-tests article:nth-child(5){box-shadow:inset 2px 0 0 rgba(86,227,159,.14)}
        .runtime-map article:nth-child(22):hover{transform:translateY(-2px);border-color:rgba(114,230,255,.23);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(18):hover{transform:translateY(-1px);box-shadow:0 15px 41px rgba(0,0,0,.25);transition:.22s}
        .check-card:nth-child(10):hover{border-color:rgba(112,151,255,.23);background:rgba(13,29,56,.62)}
        .level-grid article:nth-child(6):hover{border-color:rgba(86,227,159,.22);transform:translateY(-2px)}
        .receipt-tests article:nth-child(6){box-shadow:inset 0px 0 0 rgba(86,227,159,.15)}
        .runtime-map article:nth-child(23):hover{transform:translateY(-3px);border-color:rgba(114,230,255,.24);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(19):hover{transform:translateY(-2px);box-shadow:0 16px 42px rgba(0,0,0,.26);transition:.22s}
        .check-card:nth-child(11):hover{border-color:rgba(112,151,255,.24);background:rgba(13,29,56,.63)}
        .level-grid article:nth-child(7):hover{border-color:rgba(86,227,159,.23);transform:translateY(-1px)}
        .receipt-tests article:nth-child(7){box-shadow:inset 1px 0 0 rgba(86,227,159,.16)}
        .runtime-map article:nth-child(24):hover{transform:translateY(-4px);border-color:rgba(114,230,255,.25);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(20):hover{transform:translateY(-3px);box-shadow:0 17px 43px rgba(0,0,0,.20);transition:.22s}
        .check-card:nth-child(12):hover{border-color:rgba(112,151,255,.18);background:rgba(13,29,56,.64)}
        .level-grid article:nth-child(8):hover{border-color:rgba(86,227,159,.17);transform:translateY(-2px)}
        .receipt-tests article:nth-child(8){box-shadow:inset 2px 0 0 rgba(86,227,159,.17)}
        .runtime-map article:nth-child(1):hover{transform:translateY(-2px);border-color:rgba(114,230,255,.20);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(1):hover{transform:translateY(-1px);box-shadow:0 10px 24px rgba(0,0,0,.21);transition:.22s}
        .check-card:nth-child(1):hover{border-color:rgba(112,151,255,.19);background:rgba(13,29,56,.45)}
        .level-grid article:nth-child(1):hover{border-color:rgba(86,227,159,.18);transform:translateY(-1px)}
        .receipt-tests article:nth-child(1){box-shadow:inset 0px 0 0 rgba(86,227,159,.12)}
        .runtime-map article:nth-child(2):hover{transform:translateY(-3px);border-color:rgba(114,230,255,.21);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(2):hover{transform:translateY(-2px);box-shadow:0 11px 25px rgba(0,0,0,.22);transition:.22s}
        .check-card:nth-child(2):hover{border-color:rgba(112,151,255,.20);background:rgba(13,29,56,.46)}
        .level-grid article:nth-child(2):hover{border-color:rgba(86,227,159,.19);transform:translateY(-2px)}
        .receipt-tests article:nth-child(2){box-shadow:inset 1px 0 0 rgba(86,227,159,.13)}
        .runtime-map article:nth-child(3):hover{transform:translateY(-4px);border-color:rgba(114,230,255,.22);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(3):hover{transform:translateY(-3px);box-shadow:0 12px 26px rgba(0,0,0,.23);transition:.22s}
        .check-card:nth-child(3):hover{border-color:rgba(112,151,255,.21);background:rgba(13,29,56,.47)}
        .level-grid article:nth-child(3):hover{border-color:rgba(86,227,159,.20);transform:translateY(-1px)}
        .receipt-tests article:nth-child(3){box-shadow:inset 2px 0 0 rgba(86,227,159,.14)}
        .runtime-map article:nth-child(4):hover{transform:translateY(-2px);border-color:rgba(114,230,255,.23);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(4):hover{transform:translateY(-1px);box-shadow:0 13px 27px rgba(0,0,0,.24);transition:.22s}
        .check-card:nth-child(4):hover{border-color:rgba(112,151,255,.22);background:rgba(13,29,56,.48)}
        .level-grid article:nth-child(4):hover{border-color:rgba(86,227,159,.21);transform:translateY(-2px)}
        .receipt-tests article:nth-child(4){box-shadow:inset 0px 0 0 rgba(86,227,159,.15)}
        .runtime-map article:nth-child(5):hover{transform:translateY(-3px);border-color:rgba(114,230,255,.24);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(5):hover{transform:translateY(-2px);box-shadow:0 14px 28px rgba(0,0,0,.25);transition:.22s}
        .check-card:nth-child(5):hover{border-color:rgba(112,151,255,.23);background:rgba(13,29,56,.49)}
        .level-grid article:nth-child(5):hover{border-color:rgba(86,227,159,.22);transform:translateY(-1px)}
        .receipt-tests article:nth-child(5){box-shadow:inset 1px 0 0 rgba(86,227,159,.16)}
        .runtime-map article:nth-child(6):hover{transform:translateY(-4px);border-color:rgba(114,230,255,.25);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(6):hover{transform:translateY(-3px);box-shadow:0 15px 29px rgba(0,0,0,.26);transition:.22s}
        .check-card:nth-child(6):hover{border-color:rgba(112,151,255,.24);background:rgba(13,29,56,.50)}
        .level-grid article:nth-child(6):hover{border-color:rgba(86,227,159,.23);transform:translateY(-2px)}
        .receipt-tests article:nth-child(6){box-shadow:inset 2px 0 0 rgba(86,227,159,.17)}
        .runtime-map article:nth-child(7):hover{transform:translateY(-2px);border-color:rgba(114,230,255,.20);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(7):hover{transform:translateY(-1px);box-shadow:0 16px 30px rgba(0,0,0,.20);transition:.22s}
        .check-card:nth-child(7):hover{border-color:rgba(112,151,255,.18);background:rgba(13,29,56,.51)}
        .level-grid article:nth-child(7):hover{border-color:rgba(86,227,159,.17);transform:translateY(-1px)}
        .receipt-tests article:nth-child(7){box-shadow:inset 0px 0 0 rgba(86,227,159,.12)}
        .runtime-map article:nth-child(8):hover{transform:translateY(-3px);border-color:rgba(114,230,255,.21);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(8):hover{transform:translateY(-2px);box-shadow:0 17px 31px rgba(0,0,0,.21);transition:.22s}
        .check-card:nth-child(8):hover{border-color:rgba(112,151,255,.19);background:rgba(13,29,56,.52)}
        .level-grid article:nth-child(8):hover{border-color:rgba(86,227,159,.18);transform:translateY(-2px)}
        .receipt-tests article:nth-child(8){box-shadow:inset 1px 0 0 rgba(86,227,159,.13)}
        .runtime-map article:nth-child(9):hover{transform:translateY(-4px);border-color:rgba(114,230,255,.22);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(9):hover{transform:translateY(-3px);box-shadow:0 10px 32px rgba(0,0,0,.22);transition:.22s}
        .check-card:nth-child(9):hover{border-color:rgba(112,151,255,.20);background:rgba(13,29,56,.53)}
        .level-grid article:nth-child(1):hover{border-color:rgba(86,227,159,.19);transform:translateY(-1px)}
        .receipt-tests article:nth-child(1){box-shadow:inset 2px 0 0 rgba(86,227,159,.14)}
        .runtime-map article:nth-child(10):hover{transform:translateY(-2px);border-color:rgba(114,230,255,.23);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(10):hover{transform:translateY(-1px);box-shadow:0 11px 33px rgba(0,0,0,.23);transition:.22s}
        .check-card:nth-child(10):hover{border-color:rgba(112,151,255,.21);background:rgba(13,29,56,.54)}
        .level-grid article:nth-child(2):hover{border-color:rgba(86,227,159,.20);transform:translateY(-2px)}
        .receipt-tests article:nth-child(2){box-shadow:inset 0px 0 0 rgba(86,227,159,.15)}
        .runtime-map article:nth-child(11):hover{transform:translateY(-3px);border-color:rgba(114,230,255,.24);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(11):hover{transform:translateY(-2px);box-shadow:0 12px 34px rgba(0,0,0,.24);transition:.22s}
        .check-card:nth-child(11):hover{border-color:rgba(112,151,255,.22);background:rgba(13,29,56,.55)}
        .level-grid article:nth-child(3):hover{border-color:rgba(86,227,159,.21);transform:translateY(-1px)}
        .receipt-tests article:nth-child(3){box-shadow:inset 1px 0 0 rgba(86,227,159,.16)}
        .runtime-map article:nth-child(12):hover{transform:translateY(-4px);border-color:rgba(114,230,255,.25);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(12):hover{transform:translateY(-3px);box-shadow:0 13px 35px rgba(0,0,0,.25);transition:.22s}
        .check-card:nth-child(12):hover{border-color:rgba(112,151,255,.23);background:rgba(13,29,56,.56)}
        .level-grid article:nth-child(4):hover{border-color:rgba(86,227,159,.22);transform:translateY(-2px)}
        .receipt-tests article:nth-child(4){box-shadow:inset 2px 0 0 rgba(86,227,159,.17)}
        .runtime-map article:nth-child(13):hover{transform:translateY(-2px);border-color:rgba(114,230,255,.20);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(13):hover{transform:translateY(-1px);box-shadow:0 14px 36px rgba(0,0,0,.26);transition:.22s}
        .check-card:nth-child(1):hover{border-color:rgba(112,151,255,.24);background:rgba(13,29,56,.57)}
        .level-grid article:nth-child(5):hover{border-color:rgba(86,227,159,.23);transform:translateY(-1px)}
        .receipt-tests article:nth-child(5){box-shadow:inset 0px 0 0 rgba(86,227,159,.12)}
        .runtime-map article:nth-child(14):hover{transform:translateY(-3px);border-color:rgba(114,230,255,.21);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(14):hover{transform:translateY(-2px);box-shadow:0 15px 37px rgba(0,0,0,.20);transition:.22s}
        .check-card:nth-child(2):hover{border-color:rgba(112,151,255,.18);background:rgba(13,29,56,.58)}
        .level-grid article:nth-child(6):hover{border-color:rgba(86,227,159,.17);transform:translateY(-2px)}
        .receipt-tests article:nth-child(6){box-shadow:inset 1px 0 0 rgba(86,227,159,.13)}
        .runtime-map article:nth-child(15):hover{transform:translateY(-4px);border-color:rgba(114,230,255,.22);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(15):hover{transform:translateY(-3px);box-shadow:0 16px 38px rgba(0,0,0,.21);transition:.22s}
        .check-card:nth-child(3):hover{border-color:rgba(112,151,255,.19);background:rgba(13,29,56,.59)}
        .level-grid article:nth-child(7):hover{border-color:rgba(86,227,159,.18);transform:translateY(-1px)}
        .receipt-tests article:nth-child(7){box-shadow:inset 2px 0 0 rgba(86,227,159,.14)}
        .runtime-map article:nth-child(16):hover{transform:translateY(-2px);border-color:rgba(114,230,255,.23);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(16):hover{transform:translateY(-1px);box-shadow:0 17px 39px rgba(0,0,0,.22);transition:.22s}
        .check-card:nth-child(4):hover{border-color:rgba(112,151,255,.20);background:rgba(13,29,56,.60)}
        .level-grid article:nth-child(8):hover{border-color:rgba(86,227,159,.19);transform:translateY(-2px)}
        .receipt-tests article:nth-child(8){box-shadow:inset 0px 0 0 rgba(86,227,159,.15)}
        .runtime-map article:nth-child(17):hover{transform:translateY(-3px);border-color:rgba(114,230,255,.24);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(17):hover{transform:translateY(-2px);box-shadow:0 10px 40px rgba(0,0,0,.23);transition:.22s}
        .check-card:nth-child(5):hover{border-color:rgba(112,151,255,.21);background:rgba(13,29,56,.61)}
        .level-grid article:nth-child(1):hover{border-color:rgba(86,227,159,.20);transform:translateY(-1px)}
        .receipt-tests article:nth-child(1){box-shadow:inset 1px 0 0 rgba(86,227,159,.16)}
        .runtime-map article:nth-child(18):hover{transform:translateY(-4px);border-color:rgba(114,230,255,.25);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(18):hover{transform:translateY(-3px);box-shadow:0 11px 41px rgba(0,0,0,.24);transition:.22s}
        .check-card:nth-child(6):hover{border-color:rgba(112,151,255,.22);background:rgba(13,29,56,.62)}
        .level-grid article:nth-child(2):hover{border-color:rgba(86,227,159,.21);transform:translateY(-2px)}
        .receipt-tests article:nth-child(2){box-shadow:inset 2px 0 0 rgba(86,227,159,.17)}
        .runtime-map article:nth-child(19):hover{transform:translateY(-2px);border-color:rgba(114,230,255,.20);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(19):hover{transform:translateY(-1px);box-shadow:0 12px 42px rgba(0,0,0,.25);transition:.22s}
        .check-card:nth-child(7):hover{border-color:rgba(112,151,255,.23);background:rgba(13,29,56,.63)}
        .level-grid article:nth-child(3):hover{border-color:rgba(86,227,159,.22);transform:translateY(-1px)}
        .receipt-tests article:nth-child(3){box-shadow:inset 0px 0 0 rgba(86,227,159,.12)}
        .runtime-map article:nth-child(20):hover{transform:translateY(-3px);border-color:rgba(114,230,255,.21);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(20):hover{transform:translateY(-2px);box-shadow:0 13px 43px rgba(0,0,0,.26);transition:.22s}
        .check-card:nth-child(8):hover{border-color:rgba(112,151,255,.24);background:rgba(13,29,56,.64)}
        .level-grid article:nth-child(4):hover{border-color:rgba(86,227,159,.23);transform:translateY(-2px)}
        .receipt-tests article:nth-child(4){box-shadow:inset 1px 0 0 rgba(86,227,159,.13)}
        .runtime-map article:nth-child(21):hover{transform:translateY(-4px);border-color:rgba(114,230,255,.22);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(1):hover{transform:translateY(-3px);box-shadow:0 14px 24px rgba(0,0,0,.20);transition:.22s}
        .check-card:nth-child(9):hover{border-color:rgba(112,151,255,.18);background:rgba(13,29,56,.45)}
        .level-grid article:nth-child(5):hover{border-color:rgba(86,227,159,.17);transform:translateY(-1px)}
        .receipt-tests article:nth-child(5){box-shadow:inset 2px 0 0 rgba(86,227,159,.14)}
        .runtime-map article:nth-child(22):hover{transform:translateY(-2px);border-color:rgba(114,230,255,.23);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(2):hover{transform:translateY(-1px);box-shadow:0 15px 25px rgba(0,0,0,.21);transition:.22s}
        .check-card:nth-child(10):hover{border-color:rgba(112,151,255,.19);background:rgba(13,29,56,.46)}
        .level-grid article:nth-child(6):hover{border-color:rgba(86,227,159,.18);transform:translateY(-2px)}
        .receipt-tests article:nth-child(6){box-shadow:inset 0px 0 0 rgba(86,227,159,.15)}
        .runtime-map article:nth-child(23):hover{transform:translateY(-3px);border-color:rgba(114,230,255,.24);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(3):hover{transform:translateY(-2px);box-shadow:0 16px 26px rgba(0,0,0,.22);transition:.22s}
        .check-card:nth-child(11):hover{border-color:rgba(112,151,255,.20);background:rgba(13,29,56,.47)}
        .level-grid article:nth-child(7):hover{border-color:rgba(86,227,159,.19);transform:translateY(-1px)}
        .receipt-tests article:nth-child(7){box-shadow:inset 1px 0 0 rgba(86,227,159,.16)}
        .runtime-map article:nth-child(24):hover{transform:translateY(-4px);border-color:rgba(114,230,255,.25);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(4):hover{transform:translateY(-3px);box-shadow:0 17px 27px rgba(0,0,0,.23);transition:.22s}
        .check-card:nth-child(12):hover{border-color:rgba(112,151,255,.21);background:rgba(13,29,56,.48)}
        .level-grid article:nth-child(8):hover{border-color:rgba(86,227,159,.20);transform:translateY(-2px)}
        .receipt-tests article:nth-child(8){box-shadow:inset 2px 0 0 rgba(86,227,159,.17)}
        .runtime-map article:nth-child(1):hover{transform:translateY(-2px);border-color:rgba(114,230,255,.20);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(5):hover{transform:translateY(-1px);box-shadow:0 10px 28px rgba(0,0,0,.24);transition:.22s}
        .check-card:nth-child(1):hover{border-color:rgba(112,151,255,.22);background:rgba(13,29,56,.49)}
        .level-grid article:nth-child(1):hover{border-color:rgba(86,227,159,.21);transform:translateY(-1px)}
        .receipt-tests article:nth-child(1){box-shadow:inset 0px 0 0 rgba(86,227,159,.12)}
        .runtime-map article:nth-child(2):hover{transform:translateY(-3px);border-color:rgba(114,230,255,.21);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(6):hover{transform:translateY(-2px);box-shadow:0 11px 29px rgba(0,0,0,.25);transition:.22s}
        .check-card:nth-child(2):hover{border-color:rgba(112,151,255,.23);background:rgba(13,29,56,.50)}
        .level-grid article:nth-child(2):hover{border-color:rgba(86,227,159,.22);transform:translateY(-2px)}
        .receipt-tests article:nth-child(2){box-shadow:inset 1px 0 0 rgba(86,227,159,.13)}
        .runtime-map article:nth-child(3):hover{transform:translateY(-4px);border-color:rgba(114,230,255,.22);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(7):hover{transform:translateY(-3px);box-shadow:0 12px 30px rgba(0,0,0,.26);transition:.22s}
        .check-card:nth-child(3):hover{border-color:rgba(112,151,255,.24);background:rgba(13,29,56,.51)}
        .level-grid article:nth-child(3):hover{border-color:rgba(86,227,159,.23);transform:translateY(-1px)}
        .receipt-tests article:nth-child(3){box-shadow:inset 2px 0 0 rgba(86,227,159,.14)}
        .runtime-map article:nth-child(4):hover{transform:translateY(-2px);border-color:rgba(114,230,255,.23);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(8):hover{transform:translateY(-1px);box-shadow:0 13px 31px rgba(0,0,0,.20);transition:.22s}
        .check-card:nth-child(4):hover{border-color:rgba(112,151,255,.18);background:rgba(13,29,56,.52)}
        .level-grid article:nth-child(4):hover{border-color:rgba(86,227,159,.17);transform:translateY(-2px)}
        .receipt-tests article:nth-child(4){box-shadow:inset 0px 0 0 rgba(86,227,159,.15)}
        .runtime-map article:nth-child(5):hover{transform:translateY(-3px);border-color:rgba(114,230,255,.24);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(9):hover{transform:translateY(-2px);box-shadow:0 14px 32px rgba(0,0,0,.21);transition:.22s}
        .check-card:nth-child(5):hover{border-color:rgba(112,151,255,.19);background:rgba(13,29,56,.53)}
        .level-grid article:nth-child(5):hover{border-color:rgba(86,227,159,.18);transform:translateY(-1px)}
        .receipt-tests article:nth-child(5){box-shadow:inset 1px 0 0 rgba(86,227,159,.16)}
        .runtime-map article:nth-child(6):hover{transform:translateY(-4px);border-color:rgba(114,230,255,.25);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(10):hover{transform:translateY(-3px);box-shadow:0 15px 33px rgba(0,0,0,.22);transition:.22s}
        .check-card:nth-child(6):hover{border-color:rgba(112,151,255,.20);background:rgba(13,29,56,.54)}
        .level-grid article:nth-child(6):hover{border-color:rgba(86,227,159,.19);transform:translateY(-2px)}
        .receipt-tests article:nth-child(6){box-shadow:inset 2px 0 0 rgba(86,227,159,.17)}
        .runtime-map article:nth-child(7):hover{transform:translateY(-2px);border-color:rgba(114,230,255,.20);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(11):hover{transform:translateY(-1px);box-shadow:0 16px 34px rgba(0,0,0,.23);transition:.22s}
        .check-card:nth-child(7):hover{border-color:rgba(112,151,255,.21);background:rgba(13,29,56,.55)}
        .level-grid article:nth-child(7):hover{border-color:rgba(86,227,159,.20);transform:translateY(-1px)}
        .receipt-tests article:nth-child(7){box-shadow:inset 0px 0 0 rgba(86,227,159,.12)}
        .runtime-map article:nth-child(8):hover{transform:translateY(-3px);border-color:rgba(114,230,255,.21);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(12):hover{transform:translateY(-2px);box-shadow:0 17px 35px rgba(0,0,0,.24);transition:.22s}
        .check-card:nth-child(8):hover{border-color:rgba(112,151,255,.22);background:rgba(13,29,56,.56)}
        .level-grid article:nth-child(8):hover{border-color:rgba(86,227,159,.21);transform:translateY(-2px)}
        .receipt-tests article:nth-child(8){box-shadow:inset 1px 0 0 rgba(86,227,159,.13)}
        .runtime-map article:nth-child(9):hover{transform:translateY(-4px);border-color:rgba(114,230,255,.22);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(13):hover{transform:translateY(-3px);box-shadow:0 10px 36px rgba(0,0,0,.25);transition:.22s}
        .check-card:nth-child(9):hover{border-color:rgba(112,151,255,.23);background:rgba(13,29,56,.57)}
        .level-grid article:nth-child(1):hover{border-color:rgba(86,227,159,.22);transform:translateY(-1px)}
        .receipt-tests article:nth-child(1){box-shadow:inset 2px 0 0 rgba(86,227,159,.14)}
        .runtime-map article:nth-child(10):hover{transform:translateY(-2px);border-color:rgba(114,230,255,.23);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(14):hover{transform:translateY(-1px);box-shadow:0 11px 37px rgba(0,0,0,.26);transition:.22s}
        .check-card:nth-child(10):hover{border-color:rgba(112,151,255,.24);background:rgba(13,29,56,.58)}
        .level-grid article:nth-child(2):hover{border-color:rgba(86,227,159,.23);transform:translateY(-2px)}
        .receipt-tests article:nth-child(2){box-shadow:inset 0px 0 0 rgba(86,227,159,.15)}
        .runtime-map article:nth-child(11):hover{transform:translateY(-3px);border-color:rgba(114,230,255,.24);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(15):hover{transform:translateY(-2px);box-shadow:0 12px 38px rgba(0,0,0,.20);transition:.22s}
        .check-card:nth-child(11):hover{border-color:rgba(112,151,255,.18);background:rgba(13,29,56,.59)}
        .level-grid article:nth-child(3):hover{border-color:rgba(86,227,159,.17);transform:translateY(-1px)}
        .receipt-tests article:nth-child(3){box-shadow:inset 1px 0 0 rgba(86,227,159,.16)}
        .runtime-map article:nth-child(12):hover{transform:translateY(-4px);border-color:rgba(114,230,255,.25);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(16):hover{transform:translateY(-3px);box-shadow:0 13px 39px rgba(0,0,0,.21);transition:.22s}
        .check-card:nth-child(12):hover{border-color:rgba(112,151,255,.19);background:rgba(13,29,56,.60)}
        .level-grid article:nth-child(4):hover{border-color:rgba(86,227,159,.18);transform:translateY(-2px)}
        .receipt-tests article:nth-child(4){box-shadow:inset 2px 0 0 rgba(86,227,159,.17)}
        .runtime-map article:nth-child(13):hover{transform:translateY(-2px);border-color:rgba(114,230,255,.20);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(17):hover{transform:translateY(-1px);box-shadow:0 14px 40px rgba(0,0,0,.22);transition:.22s}
        .check-card:nth-child(1):hover{border-color:rgba(112,151,255,.20);background:rgba(13,29,56,.61)}
        .level-grid article:nth-child(5):hover{border-color:rgba(86,227,159,.19);transform:translateY(-1px)}
        .receipt-tests article:nth-child(5){box-shadow:inset 0px 0 0 rgba(86,227,159,.12)}
        .runtime-map article:nth-child(14):hover{transform:translateY(-3px);border-color:rgba(114,230,255,.21);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(18):hover{transform:translateY(-2px);box-shadow:0 15px 41px rgba(0,0,0,.23);transition:.22s}
        .check-card:nth-child(2):hover{border-color:rgba(112,151,255,.21);background:rgba(13,29,56,.62)}
        .level-grid article:nth-child(6):hover{border-color:rgba(86,227,159,.20);transform:translateY(-2px)}
        .receipt-tests article:nth-child(6){box-shadow:inset 1px 0 0 rgba(86,227,159,.13)}
        .runtime-map article:nth-child(15):hover{transform:translateY(-4px);border-color:rgba(114,230,255,.22);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(19):hover{transform:translateY(-3px);box-shadow:0 16px 42px rgba(0,0,0,.24);transition:.22s}
        .check-card:nth-child(3):hover{border-color:rgba(112,151,255,.22);background:rgba(13,29,56,.63)}
        .level-grid article:nth-child(7):hover{border-color:rgba(86,227,159,.21);transform:translateY(-1px)}
        .receipt-tests article:nth-child(7){box-shadow:inset 2px 0 0 rgba(86,227,159,.14)}
        .runtime-map article:nth-child(16):hover{transform:translateY(-2px);border-color:rgba(114,230,255,.23);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(20):hover{transform:translateY(-1px);box-shadow:0 17px 43px rgba(0,0,0,.25);transition:.22s}
        .check-card:nth-child(4):hover{border-color:rgba(112,151,255,.23);background:rgba(13,29,56,.64)}
        .level-grid article:nth-child(8):hover{border-color:rgba(86,227,159,.22);transform:translateY(-2px)}
        .receipt-tests article:nth-child(8){box-shadow:inset 0px 0 0 rgba(86,227,159,.15)}
        .runtime-map article:nth-child(17):hover{transform:translateY(-3px);border-color:rgba(114,230,255,.24);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(1):hover{transform:translateY(-2px);box-shadow:0 10px 24px rgba(0,0,0,.26);transition:.22s}
        .check-card:nth-child(5):hover{border-color:rgba(112,151,255,.24);background:rgba(13,29,56,.45)}
        .level-grid article:nth-child(1):hover{border-color:rgba(86,227,159,.23);transform:translateY(-1px)}
        .receipt-tests article:nth-child(1){box-shadow:inset 1px 0 0 rgba(86,227,159,.16)}
        .runtime-map article:nth-child(18):hover{transform:translateY(-4px);border-color:rgba(114,230,255,.25);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(2):hover{transform:translateY(-3px);box-shadow:0 11px 25px rgba(0,0,0,.20);transition:.22s}
        .check-card:nth-child(6):hover{border-color:rgba(112,151,255,.18);background:rgba(13,29,56,.46)}
        .level-grid article:nth-child(2):hover{border-color:rgba(86,227,159,.17);transform:translateY(-2px)}
        .receipt-tests article:nth-child(2){box-shadow:inset 2px 0 0 rgba(86,227,159,.17)}
        .runtime-map article:nth-child(19):hover{transform:translateY(-2px);border-color:rgba(114,230,255,.20);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(3):hover{transform:translateY(-1px);box-shadow:0 12px 26px rgba(0,0,0,.21);transition:.22s}
        .check-card:nth-child(7):hover{border-color:rgba(112,151,255,.19);background:rgba(13,29,56,.47)}
        .level-grid article:nth-child(3):hover{border-color:rgba(86,227,159,.18);transform:translateY(-1px)}
        .receipt-tests article:nth-child(3){box-shadow:inset 0px 0 0 rgba(86,227,159,.12)}
        .runtime-map article:nth-child(20):hover{transform:translateY(-3px);border-color:rgba(114,230,255,.21);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(4):hover{transform:translateY(-2px);box-shadow:0 13px 27px rgba(0,0,0,.22);transition:.22s}
        .check-card:nth-child(8):hover{border-color:rgba(112,151,255,.20);background:rgba(13,29,56,.48)}
        .level-grid article:nth-child(4):hover{border-color:rgba(86,227,159,.19);transform:translateY(-2px)}
        .receipt-tests article:nth-child(4){box-shadow:inset 1px 0 0 rgba(86,227,159,.13)}
        .runtime-map article:nth-child(21):hover{transform:translateY(-4px);border-color:rgba(114,230,255,.22);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(5):hover{transform:translateY(-3px);box-shadow:0 14px 28px rgba(0,0,0,.23);transition:.22s}
        .check-card:nth-child(9):hover{border-color:rgba(112,151,255,.21);background:rgba(13,29,56,.49)}
        .level-grid article:nth-child(5):hover{border-color:rgba(86,227,159,.20);transform:translateY(-1px)}
        .receipt-tests article:nth-child(5){box-shadow:inset 2px 0 0 rgba(86,227,159,.14)}
        .runtime-map article:nth-child(22):hover{transform:translateY(-2px);border-color:rgba(114,230,255,.23);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(6):hover{transform:translateY(-1px);box-shadow:0 15px 29px rgba(0,0,0,.24);transition:.22s}
        .check-card:nth-child(10):hover{border-color:rgba(112,151,255,.22);background:rgba(13,29,56,.50)}
        .level-grid article:nth-child(6):hover{border-color:rgba(86,227,159,.21);transform:translateY(-2px)}
        .receipt-tests article:nth-child(6){box-shadow:inset 0px 0 0 rgba(86,227,159,.15)}
        .runtime-map article:nth-child(23):hover{transform:translateY(-3px);border-color:rgba(114,230,255,.24);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(7):hover{transform:translateY(-2px);box-shadow:0 16px 30px rgba(0,0,0,.25);transition:.22s}
        .check-card:nth-child(11):hover{border-color:rgba(112,151,255,.23);background:rgba(13,29,56,.51)}
        .level-grid article:nth-child(7):hover{border-color:rgba(86,227,159,.22);transform:translateY(-1px)}
        .receipt-tests article:nth-child(7){box-shadow:inset 1px 0 0 rgba(86,227,159,.16)}
        .runtime-map article:nth-child(24):hover{transform:translateY(-4px);border-color:rgba(114,230,255,.25);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(8):hover{transform:translateY(-3px);box-shadow:0 17px 31px rgba(0,0,0,.26);transition:.22s}
        .check-card:nth-child(12):hover{border-color:rgba(112,151,255,.24);background:rgba(13,29,56,.52)}
        .level-grid article:nth-child(8):hover{border-color:rgba(86,227,159,.23);transform:translateY(-2px)}
        .receipt-tests article:nth-child(8){box-shadow:inset 2px 0 0 rgba(86,227,159,.17)}
        .runtime-map article:nth-child(1):hover{transform:translateY(-2px);border-color:rgba(114,230,255,.20);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(9):hover{transform:translateY(-1px);box-shadow:0 10px 32px rgba(0,0,0,.20);transition:.22s}
        .check-card:nth-child(1):hover{border-color:rgba(112,151,255,.18);background:rgba(13,29,56,.53)}
        .level-grid article:nth-child(1):hover{border-color:rgba(86,227,159,.17);transform:translateY(-1px)}
        .receipt-tests article:nth-child(1){box-shadow:inset 0px 0 0 rgba(86,227,159,.12)}
        .runtime-map article:nth-child(2):hover{transform:translateY(-3px);border-color:rgba(114,230,255,.21);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(10):hover{transform:translateY(-2px);box-shadow:0 11px 33px rgba(0,0,0,.21);transition:.22s}
        .check-card:nth-child(2):hover{border-color:rgba(112,151,255,.19);background:rgba(13,29,56,.54)}
        .level-grid article:nth-child(2):hover{border-color:rgba(86,227,159,.18);transform:translateY(-2px)}
        .receipt-tests article:nth-child(2){box-shadow:inset 1px 0 0 rgba(86,227,159,.13)}
        .runtime-map article:nth-child(3):hover{transform:translateY(-4px);border-color:rgba(114,230,255,.22);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(11):hover{transform:translateY(-3px);box-shadow:0 12px 34px rgba(0,0,0,.22);transition:.22s}
        .check-card:nth-child(3):hover{border-color:rgba(112,151,255,.20);background:rgba(13,29,56,.55)}
        .level-grid article:nth-child(3):hover{border-color:rgba(86,227,159,.19);transform:translateY(-1px)}
        .receipt-tests article:nth-child(3){box-shadow:inset 2px 0 0 rgba(86,227,159,.14)}
        .runtime-map article:nth-child(4):hover{transform:translateY(-2px);border-color:rgba(114,230,255,.23);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(12):hover{transform:translateY(-1px);box-shadow:0 13px 35px rgba(0,0,0,.23);transition:.22s}
        .check-card:nth-child(4):hover{border-color:rgba(112,151,255,.21);background:rgba(13,29,56,.56)}
        .level-grid article:nth-child(4):hover{border-color:rgba(86,227,159,.20);transform:translateY(-2px)}
        .receipt-tests article:nth-child(4){box-shadow:inset 0px 0 0 rgba(86,227,159,.15)}
        .runtime-map article:nth-child(5):hover{transform:translateY(-3px);border-color:rgba(114,230,255,.24);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(13):hover{transform:translateY(-2px);box-shadow:0 14px 36px rgba(0,0,0,.24);transition:.22s}
        .check-card:nth-child(5):hover{border-color:rgba(112,151,255,.22);background:rgba(13,29,56,.57)}
        .level-grid article:nth-child(5):hover{border-color:rgba(86,227,159,.21);transform:translateY(-1px)}
        .receipt-tests article:nth-child(5){box-shadow:inset 1px 0 0 rgba(86,227,159,.16)}
        .runtime-map article:nth-child(6):hover{transform:translateY(-4px);border-color:rgba(114,230,255,.25);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(14):hover{transform:translateY(-3px);box-shadow:0 15px 37px rgba(0,0,0,.25);transition:.22s}
        .check-card:nth-child(6):hover{border-color:rgba(112,151,255,.23);background:rgba(13,29,56,.58)}
        .level-grid article:nth-child(6):hover{border-color:rgba(86,227,159,.22);transform:translateY(-2px)}
        .receipt-tests article:nth-child(6){box-shadow:inset 2px 0 0 rgba(86,227,159,.17)}
        .runtime-map article:nth-child(7):hover{transform:translateY(-2px);border-color:rgba(114,230,255,.20);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(15):hover{transform:translateY(-1px);box-shadow:0 16px 38px rgba(0,0,0,.26);transition:.22s}
        .check-card:nth-child(7):hover{border-color:rgba(112,151,255,.24);background:rgba(13,29,56,.59)}
        .level-grid article:nth-child(7):hover{border-color:rgba(86,227,159,.23);transform:translateY(-1px)}
        .receipt-tests article:nth-child(7){box-shadow:inset 0px 0 0 rgba(86,227,159,.12)}
        .runtime-map article:nth-child(8):hover{transform:translateY(-3px);border-color:rgba(114,230,255,.21);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(16):hover{transform:translateY(-2px);box-shadow:0 17px 39px rgba(0,0,0,.20);transition:.22s}
        .check-card:nth-child(8):hover{border-color:rgba(112,151,255,.18);background:rgba(13,29,56,.60)}
        .level-grid article:nth-child(8):hover{border-color:rgba(86,227,159,.17);transform:translateY(-2px)}
        .receipt-tests article:nth-child(8){box-shadow:inset 1px 0 0 rgba(86,227,159,.13)}
        .runtime-map article:nth-child(9):hover{transform:translateY(-4px);border-color:rgba(114,230,255,.22);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(17):hover{transform:translateY(-3px);box-shadow:0 10px 40px rgba(0,0,0,.21);transition:.22s}
        .check-card:nth-child(9):hover{border-color:rgba(112,151,255,.19);background:rgba(13,29,56,.61)}
        .level-grid article:nth-child(1):hover{border-color:rgba(86,227,159,.18);transform:translateY(-1px)}
        .receipt-tests article:nth-child(1){box-shadow:inset 2px 0 0 rgba(86,227,159,.14)}
        .runtime-map article:nth-child(10):hover{transform:translateY(-2px);border-color:rgba(114,230,255,.23);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(18):hover{transform:translateY(-1px);box-shadow:0 11px 41px rgba(0,0,0,.22);transition:.22s}
        .check-card:nth-child(10):hover{border-color:rgba(112,151,255,.20);background:rgba(13,29,56,.62)}
        .level-grid article:nth-child(2):hover{border-color:rgba(86,227,159,.19);transform:translateY(-2px)}
        .receipt-tests article:nth-child(2){box-shadow:inset 0px 0 0 rgba(86,227,159,.15)}
        .runtime-map article:nth-child(11):hover{transform:translateY(-3px);border-color:rgba(114,230,255,.24);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(19):hover{transform:translateY(-2px);box-shadow:0 12px 42px rgba(0,0,0,.23);transition:.22s}
        .check-card:nth-child(11):hover{border-color:rgba(112,151,255,.21);background:rgba(13,29,56,.63)}
        .level-grid article:nth-child(3):hover{border-color:rgba(86,227,159,.20);transform:translateY(-1px)}
        .receipt-tests article:nth-child(3){box-shadow:inset 1px 0 0 rgba(86,227,159,.16)}
        .runtime-map article:nth-child(12):hover{transform:translateY(-4px);border-color:rgba(114,230,255,.25);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(20):hover{transform:translateY(-3px);box-shadow:0 13px 43px rgba(0,0,0,.24);transition:.22s}
        .check-card:nth-child(12):hover{border-color:rgba(112,151,255,.22);background:rgba(13,29,56,.64)}
        .level-grid article:nth-child(4):hover{border-color:rgba(86,227,159,.21);transform:translateY(-2px)}
        .receipt-tests article:nth-child(4){box-shadow:inset 2px 0 0 rgba(86,227,159,.17)}
        .runtime-map article:nth-child(13):hover{transform:translateY(-2px);border-color:rgba(114,230,255,.20);transition:transform .22s,border-color .22s}
        .component-grid article:nth-child(1):hover{transform:translateY(-1px);box-shadow:0 14px 24px rgba(0,0,0,.25);transition:.22s}
        .check-card:nth-child(1):hover{border-color:rgba(112,151,255,.23);background:rgba(13,29,56,.45)}
        .level-grid article:nth-child(5):hover{border-color:rgba(86,227,159,.22);transform:translateY(-1px)}
        .receipt-tests article:nth-child(5){box-shadow:inset 0px 0 0 rgba(86,227,159,.12)}
      `}</style>
    </main>
  );
}
