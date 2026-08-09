"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Determination = "ALLOW" | "HOLD" | "DENY" | "ESCALATE";
type View = "library" | "inspector" | "verification" | "method" | "guide";
type SortMode = "sequence" | "determination" | "sector" | "verification";
type ArtifactRecord = {
  artifactId: string;
  sequence: number;
  title: string;
  determination: Determination;
  sector: string;
  series: string;
  earliestFailure: string;
  anchor: string;
  executionEffect: string;
  publicationState: string;
  verificationLevel: number;
  summary: string;
  proves: string;
  doesNotProve: string;
  routeId: string;
  receiptId: string;
  outcome: string;
  color: string;
  controls: string[];
  evidence: string[];
};

const CHAIN = ["REALITY", "RECORD", "CONTINUITY", "ADMISSIBILITY", "BINDING", "COMMIT", "EXECUTION", "OUTCOME"] as const;
const VERIFICATION_LEVELS = [
  {
    code: "L0",
    title: "Declared",
    description: "Publisher asserts the record exists.",
  },
  {
    code: "L1",
    title: "Package integrity",
    description: "Component hashes confirm the package has not changed.",
  },
  {
    code: "L2",
    title: "Signature validity",
    description: "Signature validates against the published signing policy.",
  },
  {
    code: "L3",
    title: "Record parity",
    description: "Public page, JSON, manifest, and receipt resolve to the same event.",
  },
  {
    code: "L4",
    title: "Replay consistency",
    description: "Permitted replay reproduces the committed determination.",
  },
  {
    code: "L5",
    title: "Execution effect",
    description: "Technical receipt proves release, hold, denial, or escalation.",
  },
  {
    code: "L6",
    title: "Outcome closure",
    description: "Independent evidence supports the preserved real-world outcome.",
  },
  {
    code: "L7",
    title: "Independent review",
    description: "A qualified outside reviewer publishes a bounded opinion.",
  },
] as const;

const PACKAGE_COMPONENTS = [
  {
    id: "PKG-01",
    title: "Public inspection page",
    required: true,
    description: "Public inspection page preserved as part of the bounded public artifact package.",
  },
  {
    id: "PKG-02",
    title: "Bounded-record JSON",
    required: true,
    description: "Bounded-record JSON preserved as part of the bounded public artifact package.",
  },
  {
    id: "PKG-03",
    title: "Human-readable record",
    required: true,
    description: "Human-readable record preserved as part of the bounded public artifact package.",
  },
  {
    id: "PKG-04",
    title: "Route snapshot",
    required: true,
    description: "Route snapshot preserved as part of the bounded public artifact package.",
  },
  {
    id: "PKG-05",
    title: "Evidence manifest",
    required: true,
    description: "Evidence manifest preserved as part of the bounded public artifact package.",
  },
  {
    id: "PKG-06",
    title: "Authority record",
    required: true,
    description: "Authority record preserved as part of the bounded public artifact package.",
  },
  {
    id: "PKG-07",
    title: "Continuity record",
    required: true,
    description: "Continuity record preserved as part of the bounded public artifact package.",
  },
  {
    id: "PKG-08",
    title: "Admissibility record",
    required: true,
    description: "Admissibility record preserved as part of the bounded public artifact package.",
  },
  {
    id: "PKG-09",
    title: "24-link gate ledger",
    required: true,
    description: "24-link gate ledger preserved as part of the bounded public artifact package.",
  },
  {
    id: "PKG-10",
    title: "Commit record",
    required: true,
    description: "Commit record preserved as part of the bounded public artifact package.",
  },
  {
    id: "PKG-11",
    title: "Execution receipt",
    required: true,
    description: "Execution receipt preserved as part of the bounded public artifact package.",
  },
  {
    id: "PKG-12",
    title: "Outcome evidence",
    required: true,
    description: "Outcome evidence preserved as part of the bounded public artifact package.",
  },
  {
    id: "PKG-13",
    title: "Integrity manifest",
    required: true,
    description: "Integrity manifest preserved as part of the bounded public artifact package.",
  },
  {
    id: "PKG-14",
    title: "Component hash list",
    required: true,
    description: "Component hash list preserved as part of the bounded public artifact package.",
  },
  {
    id: "PKG-15",
    title: "Package-root hash",
    required: true,
    description: "Package-root hash preserved as part of the bounded public artifact package.",
  },
  {
    id: "PKG-16",
    title: "Verification instructions",
    required: true,
    description: "Verification instructions preserved as part of the bounded public artifact package.",
  },
  {
    id: "PKG-17",
    title: "Replay inputs",
    required: false,
    description: "Replay inputs preserved as part of the bounded public artifact package.",
  },
  {
    id: "PKG-18",
    title: "Claims-boundary statement",
    required: false,
    description: "Claims-boundary statement preserved as part of the bounded public artifact package.",
  },
  {
    id: "PKG-19",
    title: "Challenge record",
    required: false,
    description: "Challenge record preserved as part of the bounded public artifact package.",
  },
  {
    id: "PKG-20",
    title: "Correction history",
    required: false,
    description: "Correction history preserved as part of the bounded public artifact package.",
  },
] as const;

const ARTIFACTS: ArtifactRecord[] = [
  {
    artifactId: "TA14-EA-000001",
    sequence: 1,
    title: "Authorized release with verified outcome",
    determination: "ALLOW",
    sector: "Cross-sector demonstration",
    series: "Canonical execution",
    earliestFailure: "None — every mandatory condition satisfied",
    anchor: "OUTCOME",
    executionEffect: "HTTP 202 · RELEASED",
    publicationState: "PUBLISHED",
    verificationLevel: 6,
    summary: "A bounded action was admitted, authorized, committed before execution, technically released inside the exact approved scope, and closed with independently checked outcome evidence.",
    proves: "A complete admissible route can release one exact action and preserve proof that the authorized outcome occurred.",
    doesNotProve: "It does not certify every future route, model, tool, actor, or environment.",
    routeId: "TA14-ROUTE-ALLOW-000001",
    receiptId: "TA14-RECEIPT-000001",
    outcome: "Authorized target state reached and independently verified.",
    color: "#56e39f",
    controls: [
      "Present condition bounded",
      "Source record attributable",
      "Identity and authority valid",
      "Evidence current and sufficient",
      "Execution boundary exact",
      "Commit frozen before action",
      "Adapter released only approved action",
      "Outcome independently verified",
    ],
    evidence: [
      "Scenario declaration",
      "Route snapshot",
      "Evidence manifest",
      "Authority record",
      "Commit record",
      "Execution receipt",
      "Outcome evidence",
      "Integrity manifest",
    ],
  },
  {
    artifactId: "TA14-EA-000002",
    sequence: 2,
    title: "Authority drift before execution",
    determination: "HOLD",
    sector: "Financial execution",
    series: "Authority integrity",
    earliestFailure: "Continuity — required controller authority was revoked before execution",
    anchor: "CONTINUITY",
    executionEffect: "HTTP 423 · HELD",
    publicationState: "PUBLISHED",
    verificationLevel: 5,
    summary: "A payment route that initially held valid dual authority was stopped when one required authority was revoked before transmission. The request remained preserved and no funds moved.",
    proves: "Authority state is a live execution condition and drift forces revalidation before consequence.",
    doesNotProve: "It does not prove the beneficiary, invoice, or payment request was fraudulent.",
    routeId: "TA14-ROUTE-HOLD-000002",
    receiptId: "TA14-RECEIPT-000002",
    outcome: "Zero funds transmitted; repair requires restored authority and full revalidation.",
    color: "#f4c95d",
    controls: [
      "Payment request bounded",
      "Beneficiary identity preserved",
      "Invoice and contract admitted",
      "CFO approval valid",
      "Controller authority later revoked",
      "Continuity gate failed",
      "Transmission adapter stayed closed",
      "Repair path preserved",
    ],
    evidence: [
      "Payment request",
      "Beneficiary record",
      "Invoice",
      "Contract",
      "CFO approval",
      "Controller revocation event",
      "Hold receipt",
      "Zero-transfer confirmation",
    ],
  },
  {
    artifactId: "TA14-EA-000003",
    sequence: 3,
    title: "Execution boundary violation prevented",
    determination: "DENY",
    sector: "AI operations",
    series: "Boundary enforcement",
    earliestFailure: "Binding — requested production write exceeded staging-only authorization",
    anchor: "BINDING",
    executionEffect: "HTTP 403 · DENIED",
    publicationState: "PUBLISHED",
    verificationLevel: 5,
    summary: "A continuous and attributable deployment request attempted to exceed its approved destination, privileges, model version, and execution window. The adapter rejected the command and revoked the pending token.",
    proves: "Valid identity and continuity do not enlarge authority or execution scope.",
    doesNotProve: "It does not prove the requested model was unsafe or technically defective.",
    routeId: "TA14-ROUTE-DENY-000003",
    receiptId: "TA14-RECEIPT-000003",
    outcome: "Zero production resources created, updated, deleted, routed, or mutated.",
    color: "#ff6b7a",
    controls: [
      "Request identity preserved",
      "Staging authorization verified",
      "Production destination detected",
      "Write privilege detected",
      "Model version mismatch detected",
      "Binding boundary failed",
      "Execution token revoked",
      "Zero production mutation verified",
    ],
    evidence: [
      "Deployment request",
      "Identity record",
      "Staging authorization",
      "Production destination record",
      "Privilege comparison",
      "Model-version comparison",
      "Denial receipt",
      "Zero-mutation evidence",
    ],
  },
  {
    artifactId: "TA14-EA-000004",
    sequence: 4,
    title: "Conflicting admissible evidence escalated",
    determination: "ESCALATE",
    sector: "Healthcare",
    series: "Evidence conflict",
    earliestFailure: "Admissibility — two current admissible sources supported incompatible conclusions",
    anchor: "ADMISSIBILITY",
    executionEffect: "HTTP 202 · HELD_AND_ROUTED",
    publicationState: "PUBLISHED",
    verificationLevel: 5,
    summary: "Two independently attributable and current clinical evidence packages survived admissibility review but supported incompatible routing outcomes. Neither source was silently preferred.",
    proves: "Conflict can remain visible and force named adjudication instead of becoming automatic approval.",
    doesNotProve: "It does not resolve the underlying clinical question or substitute for clinical judgment.",
    routeId: "TA14-ROUTE-ESCALATE-000004",
    receiptId: "TA14-RECEIPT-000004",
    outcome: "Zero care-routing changes; case queued for named clinical adjudicator.",
    color: "#b084ff",
    controls: [
      "Both sources attributable",
      "Both sources current",
      "Both sources admissible",
      "Conclusions conflict",
      "Continuity preserved",
      "Silent preference prohibited",
      "Named adjudicator required",
      "No care instruction bound",
    ],
    evidence: [
      "Source package A",
      "Source package B",
      "Provenance records",
      "Freshness checks",
      "Conflict analysis",
      "Adjudicator authority",
      "Escalation receipt",
      "Zero-route-change evidence",
    ],
  },
  {
    artifactId: "TA14-EA-000005",
    sequence: 5,
    title: "Evidence freshness expired before commit",
    determination: "HOLD",
    sector: "Life sciences",
    series: "Evidence freshness",
    earliestFailure: "Admissibility — sterility evidence expired before commit",
    anchor: "ADMISSIBILITY",
    executionEffect: "HTTP 423 · HELD",
    publicationState: "PUBLISHED",
    verificationLevel: 5,
    summary: "A pharmaceutical batch remained attributable and within authority, but the governing sterility assay expired before commit. The route held release until a new current assay could be admitted.",
    proves: "Previously valid evidence cannot support execution after its governed freshness window closes.",
    doesNotProve: "It does not prove the batch was contaminated or unsuitable for use.",
    routeId: "TA14-ROUTE-HOLD-000005",
    receiptId: "TA14-RECEIPT-000005",
    outcome: "Zero batches released; new assay and full revalidation required.",
    color: "#f4c95d",
    controls: [
      "Batch identity preserved",
      "Custody continuous",
      "Quality authority valid",
      "Assay initially admissible",
      "Freshness window expired",
      "Commit prohibited",
      "Release adapter held",
      "New assay required",
    ],
    evidence: [
      "Batch record",
      "Custody ledger",
      "Sterility assay",
      "Freshness policy",
      "Quality authority",
      "Expiry event",
      "Hold receipt",
      "Zero-release evidence",
    ],
  },
  {
    artifactId: "TA14-EA-000006",
    sequence: 6,
    title: "Unauthorized runtime version denied",
    determination: "DENY",
    sector: "AI operations",
    series: "Version integrity",
    earliestFailure: "Commit — requested runtime v7.4 did not match approved v7.3",
    anchor: "COMMIT",
    executionEffect: "HTTP 403 · RUNTIME_VERSION_DENIED",
    publicationState: "PUBLISHED",
    verificationLevel: 5,
    summary: "The request remained attributable and otherwise supported, but the runtime selected for execution differed from the version approved in the frozen route. The pending runtime token was revoked.",
    proves: "A valid decision cannot be executed through an unapproved runtime or route version.",
    doesNotProve: "It does not prove runtime v7.4 is generally unsafe or defective.",
    routeId: "TA14-ROUTE-DENY-000006",
    receiptId: "TA14-RECEIPT-000006",
    outcome: "Zero governed executions released and zero runtime transitions completed.",
    color: "#ff6b7a",
    controls: [
      "Route version frozen",
      "Approved runtime v7.3",
      "Requested runtime v7.4",
      "Version parity evaluated",
      "Commit mismatch detected",
      "Execution prohibited",
      "Token revoked",
      "Zero runtime transition verified",
    ],
    evidence: [
      "Route snapshot",
      "Approved runtime record",
      "Requested runtime record",
      "Version comparison",
      "Commit policy",
      "Denial receipt",
      "Token revocation",
      "Zero-transition evidence",
    ],
  },
  {
    artifactId: "TA14-EA-000007",
    sequence: 7,
    title: "Authorized threshold exceeded",
    determination: "ESCALATE",
    sector: "Water treatment",
    series: "Threshold governance",
    earliestFailure: "Binding — requested 12% dosing increase exceeded delegated 5% ceiling",
    anchor: "BINDING",
    executionEffect: "HTTP 202 · ESCALATED",
    publicationState: "PUBLISHED",
    verificationLevel: 5,
    summary: "A valid operator requested a chemical-dosing adjustment beyond the operator’s delegated threshold. The command was held and routed to the chief water-quality authority.",
    proves: "Valid authority can remain insufficient when the proposed consequence exceeds the delegated threshold.",
    doesNotProve: "It does not determine whether the larger dosing change should ultimately be approved.",
    routeId: "TA14-ROUTE-ESCALATE-000007",
    receiptId: "TA14-RECEIPT-000007",
    outcome: "Zero dosing changes released; higher-level review remains required.",
    color: "#b084ff",
    controls: [
      "Operator identity valid",
      "Evidence current",
      "Authority source valid",
      "Delegated ceiling 5%",
      "Requested change 12%",
      "Threshold exceeded",
      "Command held and routed",
      "Zero dosing change verified",
    ],
    evidence: [
      "Dosing request",
      "Operator identity",
      "Delegation record",
      "Threshold policy",
      "Water-quality evidence",
      "Comparison record",
      "Escalation receipt",
      "Zero-change evidence",
    ],
  },
  {
    artifactId: "TA14-EA-000008",
    sequence: 8,
    title: "Material condition changed after approval",
    determination: "HOLD",
    sector: "Environmental systems",
    series: "Runtime revalidation",
    earliestFailure: "Revalidation — exterior PM2.5 changed materially after approval",
    anchor: "COMMIT",
    executionEffect: "HTTP 423 · AWAITING_REVALIDATION",
    publicationState: "PUBLISHED",
    verificationLevel: 5,
    summary: "An indoor-air intervention was approved at 18 µg/m³ exterior PM2.5, but the pre-execution reading rose to 86 µg/m³. The prior decision could no longer control execution without revalidation.",
    proves: "Approval does not survive material environmental drift without a new runtime check.",
    doesNotProve: "It does not prove the intervention is permanently prohibited.",
    routeId: "TA14-ROUTE-HOLD-000008",
    receiptId: "TA14-RECEIPT-000008",
    outcome: "Zero building-control changes; route awaits refreshed evidence and revalidation.",
    color: "#f4c95d",
    controls: [
      "Approval-time state preserved",
      "Exterior PM2.5 18 µg/m³",
      "Pre-execution PM2.5 86 µg/m³",
      "Material change detected",
      "Prior commit invalidated",
      "Adapter suspended",
      "Revalidation opened",
      "Zero control changes verified",
    ],
    evidence: [
      "Approval record",
      "Interior measurements",
      "Exterior measurement 18",
      "Exterior measurement 86",
      "Drift analysis",
      "Revalidation policy",
      "Hold receipt",
      "Zero-change evidence",
    ],
  },
  {
    artifactId: "TA14-EA-000009",
    sequence: 9,
    title: "Mandatory governance gate bypass denied",
    determination: "DENY",
    sector: "Autonomous agents",
    series: "Bypass resistance",
    earliestFailure: "Execution — direct adapter invocation attempted to skip mandatory gate sequence",
    anchor: "EXECUTION",
    executionEffect: "HTTP 403 · GOVERNANCE_GATE_DENIED",
    publicationState: "PUBLISHED",
    verificationLevel: 5,
    summary: "An alternate execution path attempted to invoke the adapter without the frozen mandatory gate ledger. The adapter rejected the call, revoked the token, and preserved the bypass attempt.",
    proves: "Mandatory gates cannot be bypassed through an alternate technical path under the same invalid state.",
    doesNotProve: "It does not prove all conceivable external attack paths are impossible.",
    routeId: "TA14-ROUTE-DENY-000009",
    receiptId: "TA14-RECEIPT-000009",
    outcome: "Zero consequential actions released; bypass evidence preserved for review.",
    color: "#ff6b7a",
    controls: [
      "Normal route identified",
      "Mandatory gate ledger required",
      "Direct invocation attempted",
      "Ledger proof absent",
      "Bypass detected",
      "Adapter denied call",
      "Token revoked",
      "Zero execution verified",
    ],
    evidence: [
      "Agent request",
      "Normal route record",
      "Mandatory gate policy",
      "Direct-call trace",
      "Missing-ledger finding",
      "Bypass event",
      "Denial receipt",
      "Zero-execution evidence",
    ],
  },
  {
    artifactId: "TA14-EA-000010",
    sequence: 10,
    title: "Dual-authority execution with verified outcome",
    determination: "ALLOW",
    sector: "Cybersecurity",
    series: "Separation of duties",
    earliestFailure: "None — both independent authorities concurred before commit",
    anchor: "COMMIT",
    executionEffect: "HTTP 202 · ACCESS_RESTORED",
    publicationState: "PUBLISHED",
    verificationLevel: 6,
    summary: "A one-time privileged-access restoration required independent concurrence by the Security Operations Lead and System Owner. The exact privileges were restored once and automatically expired.",
    proves: "Separation of duties and dual concurrence can control a time-bounded privileged execution.",
    doesNotProve: "It does not authorize standing access or privileges outside the preserved window.",
    routeId: "TA14-ROUTE-ALLOW-000010",
    receiptId: "TA14-RECEIPT-000010",
    outcome: "Approved privileges restored once, independently verified, then automatically expired.",
    color: "#56e39f",
    controls: [
      "Account identity verified",
      "System identity verified",
      "Security lead approved",
      "System owner approved",
      "Scopes matched",
      "Time window fixed",
      "Access restored once",
      "Automatic expiry verified",
    ],
    evidence: [
      "Access request",
      "Account record",
      "System record",
      "Security approval",
      "Owner approval",
      "Commit record",
      "Restoration receipt",
      "Expiry evidence",
    ],
  },
  {
    artifactId: "TA14-EA-000011",
    sequence: 11,
    title: "Confidential evidence verified without disclosure",
    determination: "ALLOW",
    sector: "Protected records",
    series: "Privacy-preserving proof",
    earliestFailure: "None — protected evidence satisfied admissibility inside controlled review",
    anchor: "ADMISSIBILITY",
    executionEffect: "HTTP 202 · CERTIFICATE_ISSUED",
    publicationState: "PUBLISHED",
    verificationLevel: 6,
    summary: "Protected evidence remained sealed while hashes, custody records, proof commitments, and bounded reviewer attestations established the required condition for a public verification certificate.",
    proves: "Confidential evidence can support a bounded determination without public disclosure of protected contents.",
    doesNotProve: "It does not allow the public to inspect the underlying confidential material.",
    routeId: "TA14-ROUTE-ALLOW-000011",
    receiptId: "TA14-RECEIPT-000011",
    outcome: "Certificate issued; protected evidence remained sealed and challengeable through controlled review.",
    color: "#56e39f",
    controls: [
      "Protected evidence registered",
      "Disclosure boundary fixed",
      "Hash commitments published",
      "Custody continuous",
      "Qualified reviewer authorized",
      "Admissibility confirmed",
      "Certificate issued",
      "Evidence remained sealed",
    ],
    evidence: [
      "Protected evidence index",
      "Disclosure policy",
      "Hash commitments",
      "Custody ledger",
      "Reviewer authority",
      "Bounded attestation",
      "Certificate receipt",
      "Non-disclosure confirmation",
    ],
  },
  {
    artifactId: "TA14-EA-000012",
    sequence: 12,
    title: "Preserved chain-of-custody closure certificate",
    determination: "ALLOW",
    sector: "Independent verification",
    series: "Outcome closure",
    earliestFailure: "None — custody, correspondence, and outcome remained continuous through closure",
    anchor: "OUTCOME",
    executionEffect: "HTTP 202 · CERTIFICATE_ISSUED",
    publicationState: "PUBLISHED",
    verificationLevel: 6,
    summary: "A complete chain of custody linked the originating evidence, route, commit, execution receipt, independently corroborated outcome, and final bounded closure certificate.",
    proves: "A governed event can remain reconstructable and independently verifiable from reality through preserved outcome.",
    doesNotProve: "It does not convert the bounded event into universal certification of the architecture.",
    routeId: "TA14-ROUTE-ALLOW-000012",
    receiptId: "TA14-RECEIPT-000012",
    outcome: "Closure certificate issued with preserved custody and independent outcome corroboration.",
    color: "#56e39f",
    controls: [
      "Origin record fixed",
      "Custody events preserved",
      "Route snapshot matched",
      "Commit hash matched",
      "Execution receipt matched",
      "Outcome corroborated",
      "Closure package parity verified",
      "Certificate issued",
    ],
    evidence: [
      "Origin record",
      "Custody event ledger",
      "Route snapshot",
      "Commit record",
      "Execution receipt",
      "Outcome evidence",
      "Independent review",
      "Closure certificate",
    ],
  },
];

const determinationOrder: Record<Determination, number> = { ALLOW: 1, HOLD: 2, DENY: 3, ESCALATE: 4 };
const determinationMeaning: Record<Determination, string> = {
  ALLOW: "Every mandatory condition is satisfied and only the exact authorized action may proceed.",
  HOLD: "A repairable condition is missing, stale, changed, or awaiting revalidation; execution remains closed.",
  DENY: "A hard prohibition, invalid boundary, or non-repairable condition prevents execution under the present state.",
  ESCALATE: "Named human or institutional judgment is required; escalation is not approval.",
};


const FOUNDING_PRODUCER = {
  name: "TA-14 Authority",
  governance: "TA-14 Admissible Execution Architecture",
  governanceId: "TA14-GOV-FOUNDING-000001",
};

const FOUNDING_VERIFIER = {
  name: "TA-14 Authority",
  authorityId: "TA14-VERIFY-AUTHORITY-000001",
};

const REGISTRY_STEPS = [
  {
    step: "01",
    eyebrow: "Register governance",
    title: "Establish an attributable governance identity.",
    description: "Register the organization, accountable owner, architecture name, version, sectors, jurisdictions, supported determinations, claims, and explicit limits.",
    href: "/governance/register",
    action: "Register governance",
  },
  {
    step: "02",
    eyebrow: "Build the route",
    title: "Convert the proposed consequence into a frozen governed route.",
    description: "Bind the registered governance version, sector, jurisdiction, evidence requirements, authority conditions, boundaries, runtime gates, and revalidation triggers.",
    href: "/workspace/routes/new",
    action: "Build a route",
  },
  {
    step: "03",
    eyebrow: "Produce the artifact",
    title: "Run the route and preserve the bounded execution record.",
    description: "Admit evidence, resolve authority, preserve continuity, commit before action, capture the technical effect, and close the real-world outcome.",
    href: "/artifacts/studio",
    action: "Open Artifact Studio",
  },
  {
    step: "04",
    eyebrow: "Verify the package",
    title: "Test integrity, parity, execution effect, and outcome closure.",
    description: "Confirm that the public page, canonical record, manifests, route snapshot, receipts, hashes, and disclosed evidence resolve to one event.",
    href: "/artifacts/verify",
    action: "Open Verification",
  },
  {
    step: "05",
    eyebrow: "Register the artifact",
    title: "Publish the artifact beneath the governance that produced it.",
    description: "The registry assigns a permanent identity, records attribution, preserves the verification state, and opens the artifact to inspection and challenge.",
    href: "/artifacts/register",
    action: "Register an artifact",
  },
] as const;

const TRUST_MARKS = [
  { label: "Artifact class", value: "Founding Artifact" },
  { label: "Produced by", value: FOUNDING_PRODUCER.name },
  { label: "Governance", value: FOUNDING_PRODUCER.governance },
  { label: "Verified by", value: FOUNDING_VERIFIER.name },
] as const;

function registryIdFor(sequence: number) {
  return `TA14-REG-EA-${String(sequence).padStart(6, "0")}`;
}

function downloadJson(name: string, payload: unknown) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = name;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function artifactPath(sequence: number) {
  return `/artifacts/ta14-ea-${String(sequence).padStart(6, "0")}`;
}

function determinationClass(value: Determination) {
  return value.toLowerCase();
}

export default function ExecutionArtifactsLibraryPage() {
  const [view, setView] = useState<View>("library");
  const [selectedId, setSelectedId] = useState("TA14-EA-000001");
  const [search, setSearch] = useState("");
  const [determination, setDetermination] = useState<"ALL" | Determination>("ALL");
  const [anchor, setAnchor] = useState("ALL");
  const [sector, setSector] = useState("ALL");
  const [sortMode, setSortMode] = useState<SortMode>("sequence");
  const [verificationQuery, setVerificationQuery] = useState("");
  const [verificationResult, setVerificationResult] = useState<ArtifactRecord | null>(null);
  const [copied, setCopied] = useState("");

  const selected = useMemo(() => ARTIFACTS.find((item) => item.artifactId === selectedId) ?? ARTIFACTS[0], [selectedId]);
  const sectors = useMemo(() => Array.from(new Set(ARTIFACTS.map((item) => item.sector))).sort(), []);
  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    const result = ARTIFACTS.filter((item) => {
      const matchesSearch = !query || [item.artifactId, item.title, item.summary, item.sector, item.series, item.earliestFailure, item.executionEffect].join(" ").toLowerCase().includes(query);
      const matchesDetermination = determination === "ALL" || item.determination === determination;
      const matchesAnchor = anchor === "ALL" || item.anchor === anchor;
      const matchesSector = sector === "ALL" || item.sector === sector;
      return matchesSearch && matchesDetermination && matchesAnchor && matchesSector;
    });
    return [...result].sort((left, right) => {
      if (sortMode === "determination") return determinationOrder[left.determination] - determinationOrder[right.determination] || left.sequence - right.sequence;
      if (sortMode === "sector") return left.sector.localeCompare(right.sector) || left.sequence - right.sequence;
      if (sortMode === "verification") return right.verificationLevel - left.verificationLevel || left.sequence - right.sequence;
      return left.sequence - right.sequence;
    });
  }, [search, determination, anchor, sector, sortMode]);

  const counts = useMemo(() => ({
    allow: ARTIFACTS.filter((item) => item.determination === "ALLOW").length,
    hold: ARTIFACTS.filter((item) => item.determination === "HOLD").length,
    deny: ARTIFACTS.filter((item) => item.determination === "DENY").length,
    escalate: ARTIFACTS.filter((item) => item.determination === "ESCALATE").length,
  }), []);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(""), 1800);
    return () => window.clearTimeout(timer);
  }, [copied]);

  function navigateToView(nextView: View, targetId = "artifact-workspace") {
    setView(nextView);
    window.setTimeout(() => {
      document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  }

  function openArtifact(item: ArtifactRecord) {
    setSelectedId(item.artifactId);
    setView("inspector");
    window.requestAnimationFrame(() => document.getElementById("artifact-workspace")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  function verify() {
    const normalized = verificationQuery.trim().toUpperCase();
    const hit = ARTIFACTS.find((item) => item.artifactId === normalized || item.receiptId === normalized || item.routeId === normalized);
    setVerificationResult(hit ?? null);
  }

  async function copyText(value: string, label: string) {
    await navigator.clipboard.writeText(value);
    setCopied(label);
  }

  return (
    <main className="door-eight">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <div className="grid-field" />
      <header className="topbar">
        <Link href="/" className="brand">
          <span className="brand-mark">TA</span>
          <span><b>TA-14</b><small>Admissible Execution Architecture</small></span>
        </Link>
        <nav>
          <button className={view === "library" ? "active" : ""} onClick={() => navigateToView("library")}>Artifact Library</button>
          <button className={view === "verification" ? "active" : ""} onClick={() => navigateToView("verification")}>Verification</button>
          <button className={view === "method" ? "active" : ""} onClick={() => navigateToView("method")}>Proof Method</button>
          <button className={view === "guide" ? "active" : ""} onClick={() => navigateToView("guide")}>How it works</button>
          <Link href="/governance/directory">Governance Directory</Link>
          <Link href="/artifacts/studio" className="build-link">Build an artifact</Link>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <div className="door-label"><span>08</span> Eighth major door of the TA-14 AI Governance Exchange</div>
          <h1>Execution<br/><em>Artifacts.</em></h1>
          <p>TA-14 produced the proof it asks others to produce: twelve materially different bounded records showing how evidence, authority, continuity, admissibility, binding, commitment, execution control, and outcome closure govern consequence.</p>
          <div className="hero-actions">
            <button onClick={() => navigateToView("library")}>Inspect the first twelve</button>
            <button className="secondary" onClick={() => navigateToView("verification")}>Verify a record</button>
            <button className="secondary" onClick={() => navigateToView("guide")}>See the five-step path</button>
          </div>
          <div className="governing-rule"><small>Governing rule</small><strong>No admissible evidence. No admissible execution.</strong></div>
        </div>
        <div className="hero-machine" aria-hidden="true">
          <div className="machine-ring ring-one" />
          <div className="machine-ring ring-two" />
          <div className="machine-ring ring-three" />
          <div className="machine-core"><small>FOUNDING SET</small><strong>12</strong><span>bounded records</span></div>
          {CHAIN.map((item, index) => <span className={`orbit-node orbit-node-${index + 1}`} key={item}>{item.slice(0, 2)}</span>)}
        </div>
      </section>

      <section className="metrics">
        <article><small>Published artifacts</small><strong>12</strong><span>Founding execution-proof set</span></article>
        <article><small>Determinations</small><strong>4</strong><span>ALLOW · HOLD · DENY · ESCALATE</span></article>
        <article><small>Runtime links</small><strong>24</strong><span>Complete governed execution chain</span></article>
        <article><small>Verification ceiling</small><strong>L6</strong><span>Outcome closure demonstrated</span></article>
      </section>

      <section className="determination-strip">
        <article className="allow"><b>ALLOW</b><strong>{counts.allow}</strong><span>Exact authorized action released</span></article>
        <article className="hold"><b>HOLD</b><strong>{counts.hold}</strong><span>Repairable condition stopped execution</span></article>
        <article className="deny"><b>DENY</b><strong>{counts.deny}</strong><span>Hard boundary prevented execution</span></article>
        <article className="escalate"><b>ESCALATE</b><strong>{counts.escalate}</strong><span>Named judgment required</span></article>
      </section>

      <section className="institutional-ribbon" aria-label="Artifact attribution standard">
        <div className="ribbon-rule">
          <span>Registry rule</span>
          <strong>No registered governance. No registered artifact.</strong>
        </div>
        <div className="ribbon-marks">
          {TRUST_MARKS.map((mark) => (
            <span key={mark.label}><small>{mark.label}</small><b>{mark.value}</b></span>
          ))}
        </div>
        <button onClick={() => navigateToView("guide")}>Follow the path →</button>
      </section>

      <section id="artifact-workspace" className="workspace" aria-label="Founding execution artifacts and artifact tools">
        <div className="workspace-head">
          <div><small>{view === "library" ? "Founding execution artifacts · 12 public records" : "Public proof corpus"}</small><h2>{view === "library" ? "Inspect completed execution artifacts" : view === "inspector" ? selected.artifactId : view === "verification" ? "Verification center" : view === "guide" ? "From governance registration to public proof" : "Canonical proof method"}</h2></div>
          <p>{view === "library" ? "Filter the founding set by determination, controlling chain link, sector, or verification level." : view === "inspector" ? selected.title : view === "verification" ? "Resolve an artifact, receipt, or route identifier against the published founding set." : view === "guide" ? "Five governed steps take an organization from attributable registration to a registered, inspectable execution artifact." : "The method every public artifact must preserve before TA-14 treats it as execution proof."}</p>
        </div>

        {view === "library" && (
          <>
            <div className="library-onboarding">
              <div>
                <small>First time here?</small>
                <h3>Inspect the founding set—or follow the same governed path to produce your own.</h3>
                <p>Every artifact is attributable to a registered governance, bound to a frozen route, verified against a preserved package, and open to challenge without rewriting the original event.</p>
              </div>
              <div className="onboarding-actions">
                <button onClick={() => navigateToView("guide")}>Show me the five steps</button>
                <Link href="/governance/register">Register AI governance</Link>
              </div>
            </div>
            <div className="filter-console">
              <label className="search-field"><span>Search the corpus</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Artifact ID, title, sector, condition, effect..." /></label>
              <label><span>Determination</span><select value={determination} onChange={(event) => setDetermination(event.target.value as "ALL" | Determination)}><option value="ALL">All determinations</option><option value="ALLOW">ALLOW</option><option value="HOLD">HOLD</option><option value="DENY">DENY</option><option value="ESCALATE">ESCALATE</option></select></label>
              <label><span>Controlling anchor</span><select value={anchor} onChange={(event) => setAnchor(event.target.value)}><option value="ALL">All anchors</option>{CHAIN.map((item) => <option value={item} key={item}>{item}</option>)}</select></label>
              <label><span>Sector</span><select value={sector} onChange={(event) => setSector(event.target.value)}><option value="ALL">All sectors</option>{sectors.map((item) => <option value={item} key={item}>{item}</option>)}</select></label>
              <label><span>Sort</span><select value={sortMode} onChange={(event) => setSortMode(event.target.value as SortMode)}><option value="sequence">Artifact sequence</option><option value="determination">Determination</option><option value="sector">Sector</option><option value="verification">Verification level</option></select></label>
            </div>
            <div className="result-line"><span>{filtered.length} artifacts visible</span><button onClick={() => { setSearch(""); setDetermination("ALL"); setAnchor("ALL"); setSector("ALL"); setSortMode("sequence"); }}>Reset filters</button></div>
            <div className="artifact-grid">
              {filtered.map((item) => (
                <article className={`artifact-card ${determinationClass(item.determination)}`} key={item.artifactId} style={{ "--tone": item.color } as React.CSSProperties}>
                  <div className="card-top">
                    <div className="artifact-identity">
                      <span>{String(item.sequence).padStart(2, "0")}</span>
                      <div><small>Permanent artifact ID</small><b>{item.artifactId}</b></div>
                    </div>
                    <div className="publication-stack"><b>{item.publicationState}</b><em>FOUNDING ARTIFACT</em></div>
                  </div>
                  <div className="card-determination">{item.determination}</div>
                  <h3>{item.title}</h3>
                  <p>{item.summary}</p>
                  <div className="artifact-attribution">
                    <span><small>Produced by</small>{FOUNDING_PRODUCER.name}</span>
                    <span><small>Governance</small>{FOUNDING_PRODUCER.governance}</span>
                    <span><small>Verified by</small>{FOUNDING_VERIFIER.name}</span>
                    <span><small>Registry ID</small>{registryIdFor(item.sequence)}</span>
                  </div>
                  <div className="card-facts">
                    <span><small>Controlling anchor</small>{item.anchor}</span>
                    <span><small>Execution effect</small>{item.executionEffect}</span>
                    <span><small>Verification</small>Level {item.verificationLevel}</span>
                    <span><small>Sector</small>{item.sector}</span>
                  </div>
                  <div className="card-actions">
                    <button onClick={() => openArtifact(item)}>Inspect record</button>
                    <Link href={artifactPath(item.sequence)}>Open public page ↗</Link>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}

        {view === "inspector" && (
          <div className="inspector" style={{ "--tone": selected.color } as React.CSSProperties}>
            <button className="back-button" onClick={() => navigateToView("library")}>← Return to artifact library</button>
            <div className="inspector-hero">
              <div>
                <small>{selected.series} · {selected.sector}</small>
                <h2>{selected.title}</h2>
                <p>{selected.summary}</p>
                <div className="inspector-actions"><Link href={artifactPath(selected.sequence)}>Open complete artifact</Link><button onClick={() => downloadJson(`${selected.artifactId.toLowerCase()}-library-record.json`, selected)}>Download library record</button></div>
              </div>
              <div className={`decision-core ${determinationClass(selected.determination)}`}><small>Committed determination</small><strong>{selected.determination}</strong><span>L{selected.verificationLevel} VERIFIED</span></div>
            </div>
            <div className="identity-ledger">
              <span><small>Permanent artifact ID</small><b>{selected.artifactId}</b></span>
              <span><small>Registry ID</small><b>{registryIdFor(selected.sequence)}</b></span>
              <span><small>Classification</small><b>Founding Artifact</b></span>
              <span><small>Produced by</small><b>{FOUNDING_PRODUCER.name}</b></span>
              <span><small>Governance ID</small><b>{FOUNDING_PRODUCER.governanceId}</b></span>
              <span><small>Verified by</small><b>{FOUNDING_VERIFIER.name}</b></span>
            </div>
            <div className="inspector-grid">
              <article className="panel wide"><small>Earliest controlling condition</small><h3>{selected.earliestFailure}</h3><p>{determinationMeaning[selected.determination]}</p></article>
              <article className="panel"><small>Route identity</small><button className="copy-value" onClick={() => copyText(selected.routeId, "Route ID")}>{selected.routeId}<i>{copied === "Route ID" ? "Copied" : "Copy"}</i></button><button className="copy-value" onClick={() => copyText(selected.receiptId, "Receipt ID")}>{selected.receiptId}<i>{copied === "Receipt ID" ? "Copied" : "Copy"}</i></button></article>
              <article className="panel"><small>Execution effect</small><h3>{selected.executionEffect}</h3><p>{selected.outcome}</p></article>
              <article className="panel wide"><small>Eight-anchor chain</small><div className="chain-grid">{CHAIN.map((item, index) => { const controlling = item === selected.anchor; const reached = selected.determination === "ALLOW" || index <= CHAIN.indexOf(selected.anchor as typeof CHAIN[number]); return <div className={`${controlling ? "controlling" : ""} ${reached ? "reached" : "not-reached"}`} key={item}><b>{String(index + 1).padStart(2, "0")}</b><span>{item}</span><small>{controlling ? "CONTROLLING" : reached ? "PRESERVED" : "NOT REACHED"}</small></div>; })}</div></article>
              <article className="panel"><small>What this proves</small><p className="positive-claim">{selected.proves}</p></article>
              <article className="panel"><small>Claims boundary</small><p className="bounded-claim">{selected.doesNotProve}</p></article>
              <article className="panel"><small>Control ledger</small><ol className="control-list">{selected.controls.map((item, index) => <li key={item}><b>{String(index + 1).padStart(2, "0")}</b><span>{item}</span></li>)}</ol></article>
              <article className="panel"><small>Evidence manifest</small><ol className="control-list evidence">{selected.evidence.map((item, index) => <li key={item}><b>E{String(index + 1).padStart(2, "0")}</b><span>{item}</span></li>)}</ol></article>
              <article className="panel wide"><small>Artifact package</small><div className="package-grid">{PACKAGE_COMPONENTS.map((item) => <button key={item.id} onClick={() => downloadJson(`${selected.artifactId.toLowerCase()}-${item.id.toLowerCase()}.json`, { artifactId: selected.artifactId, component: item, generatedFrom: "TA-14 Door Eight Artifact Library" })}><b>{item.id}</b><span>{item.title}</span><small>{item.required ? "REQUIRED" : "APPEND-ONLY"}</small></button>)}</div></article>
            </div>
            <div className="record-navigation"><button disabled={selected.sequence === 1} onClick={() => openArtifact(ARTIFACTS[selected.sequence - 2])}>← Previous artifact</button><span>{selected.sequence} of 12</span><button disabled={selected.sequence === 12} onClick={() => openArtifact(ARTIFACTS[selected.sequence])}>Next artifact →</button></div>
          </div>
        )}

        {view === "verification" && (
          <div className="verification-center">
            <div className="verification-hero"><div><small>Public verification center</small><h2>Resolve the record.<br/><em>Inspect the boundary.</em></h2><p>Enter a published artifact ID, route ID, or receipt ID. This founding verifier resolves identifiers against the twelve completed Door Eight records and exposes their bounded verification state.</p></div><div className="verify-orb"><span>✓</span><i/><i/><i/></div></div>
            <div className="verify-console"><label><span>Artifact, route, or receipt identifier</span><div><input value={verificationQuery} onChange={(event) => setVerificationQuery(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") verify(); }} placeholder="TA14-EA-000001"/><button onClick={verify}>Verify record</button></div></label><div className="quick-ids">{ARTIFACTS.slice(0, 6).map((item) => <button key={item.artifactId} onClick={() => { setVerificationQuery(item.artifactId); setVerificationResult(item); }}>{item.artifactId}</button>)}</div></div>
            {verificationQuery && verificationResult && <div className="verification-result success" style={{ "--tone": verificationResult.color } as React.CSSProperties}><div><small>Resolved public record</small><h3>{verificationResult.artifactId}</h3><p>{verificationResult.title}</p></div><div className="verify-facts"><span><small>Determination</small>{verificationResult.determination}</span><span><small>Effect</small>{verificationResult.executionEffect}</span><span><small>Verification</small>LEVEL {verificationResult.verificationLevel}</span><span><small>Status</small>{verificationResult.publicationState}</span><span><small>Produced by</small>{FOUNDING_PRODUCER.name}</span><span><small>Verified by</small>{FOUNDING_VERIFIER.name}</span></div><button onClick={() => openArtifact(verificationResult)}>Inspect bounded record</button></div>}
            {verificationQuery && !verificationResult && <div className="verification-result failed"><small>NO FOUNDING RECORD RESOLVED</small><h3>Identifier not found</h3><p>Check the identifier or inspect the public library. This verifier currently resolves the first twelve TA-14 execution artifacts.</p></div>}
            <div className="verification-levels">{VERIFICATION_LEVELS.map((item, index) => <article className={index <= 6 ? "active" : ""} key={item.code}><b>{item.code}</b><span>{item.title}</span><p>{item.description}</p></article>)}</div>
          </div>
        )}

        {view === "guide" && (
          <div className="guide">
            <div className="guide-hero">
              <div>
                <small>Institutional participation path</small>
                <h2>Do not merely describe governance.<br/><em>Register it. Run it. Prove it.</em></h2>
                <p>The Exchange is designed so an organization can establish an attributable governance identity, build a governed route, preserve a consequential run, verify the resulting package, and register the artifact for public inspection.</p>
              </div>
              <div className="guide-rule">
                <span>Hard admission rule</span>
                <strong>No registered governance.<br/>No registered artifact.</strong>
                <p>Registration is not certification. It establishes who is responsible for the governance, which version produced the artifact, and the limits of the public claim.</p>
              </div>
            </div>

            <div className="journey-map">
              {REGISTRY_STEPS.map((step, index) => (
                <article key={step.step}>
                  <div className="journey-number">{step.step}</div>
                  <div className="journey-copy">
                    <small>{step.eyebrow}</small>
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                    <Link href={step.href}>{step.action} →</Link>
                  </div>
                  {index < REGISTRY_STEPS.length - 1 && <div className="journey-connector" aria-hidden="true"><span/></div>}
                </article>
              ))}
            </div>

            <div className="guide-proof-grid">
              <article>
                <small>What the registry preserves</small>
                <h3>Attribution</h3>
                <p>Organization, accountable owner, governance architecture, version, route, publisher, verifier, and permanent artifact identifiers.</p>
              </article>
              <article>
                <small>What verification establishes</small>
                <h3>Bounded reliance</h3>
                <p>Exactly what was checked—integrity, parity, replay, execution effect, outcome closure, or independent review—and what remains outside the claim.</p>
              </article>
              <article>
                <small>What challenge protects</small>
                <h3>Correctable history</h3>
                <p>The original event remains visible while challenges, responses, corrections, supersessions, and changes to prospective reliance are appended.</p>
              </article>
            </div>

            <div className="guide-cta">
              <div>
                <small>Ready to produce evidence?</small>
                <h3>Start with governance registration, then build the route that will govern the artifact.</h3>
              </div>
              <div>
                <Link href="/governance/register">Register governance</Link>
                <Link href="/workspace/routes/new" className="secondary-link">Build a route</Link>
              </div>
            </div>
          </div>
        )}

        {view === "method" && (
          <div className="method">
            <div className="method-hero"><div><small>Canonical artifact method</small><h2>Proof before assertion.<br/><em>Control before consequence.</em></h2><p>Each artifact is a graph of linked records—not a marketing claim and not a PDF alone. The public page, machine-readable record, receipt, manifest, outcome, and verification path must resolve to the same frozen event.</p></div><div className="method-rule"><small>Institutional standard</small><strong>Here is the proposed consequence. Here is the route. Here is the admitted evidence and authority. Here is the determination. Here is proof that it controlled execution. Here is the preserved outcome. Verify it yourself.</strong></div></div>
            <div className="method-chain">{CHAIN.map((item, index) => <article key={item}><b>{String(index + 1).padStart(2, "0")}</b><span>{item}</span><small>{["External condition and consequence at stake.","Captured, attributable source material.","Unbroken identity, state, version, and custody.","Fitness of evidence and authority for this purpose.","Rules, limits, thresholds, and obligations applied.","Fixed determination before action.","Technical release, hold, denial, or routing effect.","Result, residual risk, and closure evidence."][index]}</small></article>)}</div>
            <div className="method-columns"><article><small>Fail closed</small><h3>No silent default to ALLOW.</h3><p>A missing mandatory condition ends or holds the path unless the frozen route explicitly authorizes repair or escalation.</p></article><article><small>Earliest failure</small><h3>Later success cannot cure an earlier break.</h3><p>A valid signature cannot repair inadmissible evidence. Human approval cannot retroactively repair invalid continuity or boundary.</p></article><article><small>Execution proof</small><h3>Monitoring is not execution governance.</h3><p>Each artifact needs a technical receipt proving that the determination changed what the system could do.</p></article></div>
            <div className="method-package"><div><small>Required public package</small><h3>Twenty linked components</h3><p>Every representation derives from the same frozen bounded record.</p></div><div className="method-package-grid">{PACKAGE_COMPONENTS.map((item) => <span key={item.id}><b>{item.id}</b>{item.title}</span>)}</div></div>
            <div className="method-cta"><small>Build proof, not another assertion</small><h3>Use the same engine to preserve your own bounded execution record.</h3><p>The Exchange invites outside architectures to produce inspectable proof without exposing protected intellectual property.</p><Link href="/workspace/artifacts/build">Open Artifact Studio →</Link></div>
          </div>
        )}
      </section>

      <section className="governed-review-lineage" aria-label="Governed review artifacts">
        <div className="review-lineage-head">
          <div>
            <small>Governed review lineage</small>
            <h2>Review artifacts remain distinct from execution proof.</h2>
          </div>
          <p>These records preserve evidence review, architectural findings, and version-specific continuation without being counted among the twelve completed TA-14 execution artifacts.</p>
        </div>
        <article className="review-lineage-card">
          <div className="review-lineage-identity">
            <span>FD-2026-0002</span>
            <div>
              <small>Harmonic Constitutional Runtime · Case 002</small>
              <h3>Version 2.0 Evidence Review</h3>
            </div>
          </div>
          <div className="review-lineage-status">
            <b>PARTIAL ADMISSIBILITY</b>
            <span>Runtime validation open</span>
          </div>
          <p>Seven preserved Version 2 evidence records support material architectural and evidentiary advancement. Executable proof of changed-state re-evaluation, determination receipts, replay, binding, commit, execution control, and outcome remains open.</p>
          <div className="review-lineage-facts">
            <span><small>Artifact class</small><b>Evidence Review Artifact</b></span>
            <span><small>Governance Registry</small><b>TA-14-AIGR-000010</b></span>
            <span><small>Version</small><b>2.0</b></span>
            <span><small>Evidence reviewed</small><b>7 records</b></span>
          </div>
          <div className="review-lineage-boundary">
            <strong>Boundary</strong>
            <span>No executable Version 2 evidence. No executable Version 2 finding.</span>
          </div>
          <div className="review-lineage-actions">
            <Link href="/artifacts/fd-2026-0002-case-002">Open Case 002 →</Link>
            <Link href="/workspace/ai-governance/registry/records/TA-14-AIGR-000010/evidence">Inspect admitted evidence</Link>
          </div>
        </article>
      </section>

      <footer>
        <div><b>TA-14 Authority</b><span>Governance Institution for Admissible Execution Architecture</span></div>
        <strong>No admissible evidence. No admissible execution.</strong>
        <div><Link href="/">Exchange</Link><Link href="/artifacts/studio">Artifact Studio</Link><Link href="/governance/register">Register governance</Link><button onClick={() => navigateToView("verification")}>Verification</button></div>
      </footer>

      <style jsx>{`
        :global(*) {
          box-sizing:border-box
        }
        :global(html) {
          scroll-behavior:smooth
        }
        :global(body) {
          margin:0;
          background:#030712;
          color:#eef4ff;
          font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif
        }
        :global(button),:global(input),:global(select) {
          font:inherit
        }
        .door-eight {
          --ink:#edf4ff;
          --muted:#8190aa;
          --line:rgba(124,155,216,.15);
          position:relative;
          min-height:100vh;
          overflow:hidden;
          background:radial-gradient(circle at 14% 8%,rgba(42,93,187,.16),transparent 28%),radial-gradient(circle at 86% 16%,rgba(116,69,206,.13),transparent 24%),linear-gradient(180deg,#030712 0%,#050a16 44%,#030712 100%)
        }
        .governed-review-lineage {
          position:relative;
          z-index:2;
          max-width:1480px;
          margin:0 auto 34px;
          padding:34px clamp(20px,4vw,64px)
        }
        .review-lineage-head {
          display:grid;
          grid-template-columns:minmax(0,1fr) minmax(280px,.75fr);
          gap:28px;
          align-items:end;
          margin-bottom:18px
        }
        .review-lineage-head small {
          color:#8aa6d6;
          font-size:11px;
          font-weight:800;
          letter-spacing:.16em;
          text-transform:uppercase
        }
        .review-lineage-head h2 {
          margin:7px 0 0;
          font-size:clamp(24px,3vw,42px);
          line-height:1.04
        }
        .review-lineage-head p {
          margin:0;
          color:#93a1ba;
          line-height:1.7
        }
        .review-lineage-card {
          border:1px solid rgba(244,201,93,.24);
          border-radius:22px;
          padding:26px;
          background:linear-gradient(135deg,rgba(244,201,93,.075),rgba(12,21,39,.78) 44%,rgba(9,15,29,.9));
          box-shadow:0 22px 70px rgba(0,0,0,.2)
        }
        .review-lineage-identity {
          display:flex;
          gap:16px;
          align-items:center
        }
        .review-lineage-identity>span {
          border:1px solid rgba(244,201,93,.28);
          border-radius:999px;
          padding:8px 12px;
          color:#f4c95d;
          font-size:12px;
          font-weight:900;
          letter-spacing:.08em
        }
        .review-lineage-identity small {
          color:#8fa0bb;
          text-transform:uppercase;
          letter-spacing:.11em;
          font-size:10px;
          font-weight:800
        }
        .review-lineage-identity h3 {
          margin:4px 0 0;
          font-size:24px
        }
        .review-lineage-status {
          display:flex;
          flex-wrap:wrap;
          gap:10px;
          margin:22px 0 14px
        }
        .review-lineage-status b,.review-lineage-status span {
          border-radius:999px;
          padding:8px 11px;
          font-size:11px;
          letter-spacing:.08em;
          text-transform:uppercase
        }
        .review-lineage-status b {
          background:rgba(244,201,93,.13);
          color:#f4c95d;
          border:1px solid rgba(244,201,93,.22)
        }
        .review-lineage-status span {
          color:#a8b7cf;
          border:1px solid rgba(133,160,205,.18)
        }
        .review-lineage-card>p {
          max-width:1050px;
          margin:0;
          color:#a7b5ca;
          line-height:1.75
        }
        .review-lineage-facts {
          display:grid;
          grid-template-columns:repeat(4,minmax(0,1fr));
          gap:10px;
          margin:22px 0
        }
        .review-lineage-facts span {
          padding:14px;
          border:1px solid rgba(133,160,205,.13);
          border-radius:14px;
          background:rgba(4,9,19,.5)
        }
        .review-lineage-facts small,.review-lineage-facts b {
          display:block
        }
        .review-lineage-facts small {
          color:#71829f;
          font-size:9px;
          letter-spacing:.1em;
          text-transform:uppercase;
          margin-bottom:5px
        }
        .review-lineage-facts b {
          color:#e8effa;
          font-size:12px
        }
        .review-lineage-boundary {
          display:flex;
          gap:12px;
          align-items:center;
          padding:13px 15px;
          border-left:3px solid #f4c95d;
          background:rgba(244,201,93,.055);
          color:#aab7ca;
          font-size:13px
        }
        .review-lineage-boundary strong {
          color:#f4c95d;
          text-transform:uppercase;
          letter-spacing:.1em;
          font-size:10px
        }
        .review-lineage-actions {
          display:flex;
          flex-wrap:wrap;
          gap:10px;
          margin-top:20px
        }
        .review-lineage-actions :global(a) {
          display:inline-flex;
          align-items:center;
          justify-content:center;
          min-height:42px;
          padding:0 15px;
          border-radius:11px;
          border:1px solid rgba(133,160,205,.2);
          color:#dce8fa;
          text-decoration:none;
          font-size:12px;
          font-weight:800;
          background:rgba(12,22,40,.72)
        }
        .review-lineage-actions :global(a:first-child) {
          border-color:rgba(244,201,93,.3);
          color:#f4d97f
        }
        @media (max-width:800px) {
          .review-lineage-head {grid-template-columns:1fr}
          .review-lineage-facts {grid-template-columns:1fr 1fr}
        }
        @media (max-width:520px) {
          .review-lineage-facts {grid-template-columns:1fr}
          .review-lineage-identity {align-items:flex-start;flex-direction:column}
        }
        .grid-field {
          position:fixed;
          inset:0;
          pointer-events:none;
          opacity:.15;
          background-image:linear-gradient(rgba(104,137,194,.08) 1px,transparent 1px),linear-gradient(90deg,rgba(104,137,194,.08) 1px,transparent 1px);
          background-size:48px 48px;
          mask-image:linear-gradient(to bottom,black,transparent 85%)
        }
        .ambient {
          position:fixed;
          width:600px;
          height:600px;
          border-radius:50%;
          filter:blur(100px);
          opacity:.09;
          pointer-events:none
        }
        .ambient-one {
          left:-300px;
          top:180px;
          background:#2f78ff
        }
        .ambient-two {
          right:-300px;
          top:520px;
          background:#9b5cff
        }
        .topbar {
          position:relative;
          z-index:20;
          min-height:84px;
          padding:18px 34px;
          display:flex;
          align-items:center;
          justify-content:space-between;
          border-bottom:1px solid var(--line);
          background:rgba(3,7,18,.78);
          backdrop-filter:blur(24px)
        }
        .brand {
          display:flex;
          gap:13px;
          align-items:center;
          text-decoration:none;
          color:#eff5ff
        }
        .brand-mark {
          width:42px;
          height:42px;
          border-radius:12px;
          display:grid;
          place-items:center;
          background:linear-gradient(145deg,#7eaaff,#495fc7);
          color:#08101e;
          font-weight:1000;
          box-shadow:0 14px 40px rgba(69,107,216,.28)
        }
        .brand b,.brand small {
          display:block
        }
        .brand b {
          font-size:12px;
          letter-spacing:.16em
        }
        .brand small {
          margin-top:4px;
          color:#6f7f9b;
          font-size:8px;
          letter-spacing:.11em;
          text-transform:uppercase
        }
        .topbar nav {
          display:flex;
          align-items:center;
          gap:7px
        }
        .topbar nav button,.topbar nav a {
          border:0;
          background:transparent;
          color:#7f90af;
          text-decoration:none;
          padding:11px 13px;
          border-radius:9px;
          font-size:9px;
          letter-spacing:.09em;
          text-transform:uppercase;
          cursor:pointer
        }
        .topbar nav button:hover,.topbar nav button.active,.topbar nav a:hover {
          color:#eaf2ff;
          background:rgba(88,128,210,.09)
        }
        .topbar nav .build-link {
          color:#06101f;
          background:linear-gradient(135deg,#9fc4ff,#6e95ed);
          font-weight:900
        }
        .hero {
          position:relative;
          z-index:2;
          max-width:1420px;
          min-height:720px;
          margin:0 auto;
          padding:90px 44px 70px;
          display:grid;
          grid-template-columns:1.1fr .9fr;
          gap:70px;
          align-items:center
        }
        .door-label {
          color:#6f85aa;
          font-size:9px;
          letter-spacing:.18em;
          text-transform:uppercase;
          font-weight:800
        }
        .door-label span {
          display:inline-grid;
          place-items:center;
          width:32px;
          height:32px;
          margin-right:10px;
          border:1px solid rgba(105,151,239,.28);
          border-radius:50%;
          color:#8eb4ff
        }
        .hero h1 {
          font-size:clamp(76px,9vw,138px);
          line-height:.78;
          letter-spacing:-.075em;
          margin:36px 0 34px;
          max-width:850px
        }
        .hero h1 em {
          font-style:normal;
          color:transparent;
          -webkit-text-stroke:1px rgba(151,190,255,.9);
          text-shadow:0 0 60px rgba(62,111,209,.15)
        }
        .hero-copy>p {
          max-width:760px;
          color:#94a3bc;
          font-size:16px;
          line-height:1.75
        }
        .hero-actions {
          display:flex;
          gap:10px;
          margin-top:30px
        }
        .hero-actions button {
          height:50px;
          padding:0 20px;
          border:0;
          border-radius:11px;
          background:linear-gradient(135deg,#9ec3ff,#6f91e7);
          color:#06101f;
          font-weight:900;
          cursor:pointer;
          box-shadow:0 18px 50px rgba(64,103,195,.22)
        }
        .hero-actions button.secondary {
          border:1px solid rgba(126,161,225,.2);
          background:rgba(7,14,29,.65);
          color:#adc1e5;
          box-shadow:none
        }
        .governing-rule {
          margin-top:34px;
          padding-left:16px;
          border-left:2px solid #77a6ff
        }
        .governing-rule small,.governing-rule strong {
          display:block
        }
        .governing-rule small {
          color:#60749a;
          font-size:8px;
          letter-spacing:.16em;
          text-transform:uppercase
        }
        .governing-rule strong {
          margin-top:7px;
          font-size:12px;
          letter-spacing:.04em
        }
        .hero-machine {
          position:relative;
          width:min(540px,42vw);
          aspect-ratio:1;
          margin:auto;
          display:grid;
          place-items:center
        }
        .machine-ring {
          position:absolute;
          border:1px solid rgba(101,151,245,.22);
          border-radius:50%
        }
        .ring-one {
          inset:4%;
          animation:spin 34s linear infinite
        }
        .ring-two {
          inset:17%;
          border-style:dashed;
          animation:spinReverse 23s linear infinite
        }
        .ring-three {
          inset:31%;
          box-shadow:0 0 70px rgba(70,121,227,.13),inset 0 0 60px rgba(70,121,227,.08)
        }
        .machine-core {
          position:relative;
          width:180px;
          height:180px;
          border-radius:50%;
          display:grid;
          place-content:center;
          text-align:center;
          background:radial-gradient(circle,rgba(33,61,117,.86),rgba(6,13,28,.96));
          border:1px solid rgba(125,171,255,.36);
          box-shadow:0 0 90px rgba(65,116,222,.25)
        }
        .machine-core small,.machine-core strong,.machine-core span {
          display:block
        }
        .machine-core small {
          font-size:8px;
          letter-spacing:.18em;
          color:#7090c8
        }
        .machine-core strong {
          font-size:66px;
          line-height:1;
          margin:8px 0;
          color:#b6d1ff
        }
        .machine-core span {
          font-size:8px;
          color:#71809b;
          text-transform:uppercase;
          letter-spacing:.12em
        }
        .orbit-node {
          position:absolute;
          width:42px;
          height:42px;
          border-radius:50%;
          display:grid;
          place-items:center;
          border:1px solid rgba(111,157,242,.26);
          background:#071024;
          color:#9ebeff;
          font-size:8px;
          font-weight:900;
          box-shadow:0 0 28px rgba(75,126,225,.14)
        }
        .orbit-node-1 {
          top:1%;
          left:46%
        }
        .orbit-node-2 {
          top:15%;
          right:10%
        }
        .orbit-node-3 {
          top:46%;
          right:1%
        }
        .orbit-node-4 {
          bottom:13%;
          right:11%
        }
        .orbit-node-5 {
          bottom:1%;
          left:46%
        }
        .orbit-node-6 {
          bottom:13%;
          left:10%
        }
        .orbit-node-7 {
          top:46%;
          left:1%
        }
        .orbit-node-8 {
          top:15%;
          left:10%
        }
        .metrics {
          position:relative;
          z-index:2;
          max-width:1420px;
          margin:0 auto;
          padding:0 44px;
          display:grid;
          grid-template-columns:repeat(4,1fr);
          gap:10px
        }
        .metrics article {
          min-height:145px;
          padding:22px;
          border:1px solid var(--line);
          border-radius:16px;
          background:linear-gradient(160deg,rgba(13,23,45,.85),rgba(5,10,22,.84));
          box-shadow:0 20px 50px rgba(0,0,0,.2)
        }
        .metrics small,.metrics strong,.metrics span {
          display:block
        }
        .metrics small {
          color:#667c9f;
          font-size:8px;
          letter-spacing:.15em;
          text-transform:uppercase
        }
        .metrics strong {
          font-size:44px;
          margin:13px 0 7px;
          letter-spacing:-.05em
        }
        .metrics span {
          color:#7e8ca5;
          font-size:9px
        }
        .determination-strip {
          position:relative;
          z-index:2;
          max-width:1420px;
          margin:12px auto 0;
          padding:0 44px;
          display:grid;
          grid-template-columns:repeat(4,1fr);
          gap:10px
        }
        .determination-strip article {
          padding:16px 18px;
          border-radius:13px;
          display:grid;
          grid-template-columns:auto auto 1fr;
          gap:12px;
          align-items:center;
          border:1px solid var(--line);
          background:rgba(7,13,28,.82)
        }
        .determination-strip b {
          font-size:9px;
          letter-spacing:.15em
        }
        .determination-strip strong {
          font-size:24px
        }
        .determination-strip span {
          color:#7888a3;
          font-size:8px;
          line-height:1.4
        }
        .determination-strip .allow {
          border-left:3px solid #56e39f
        }
        .determination-strip .hold {
          border-left:3px solid #f4c95d
        }
        .determination-strip .deny {
          border-left:3px solid #ff6b7a
        }
        .determination-strip .escalate {
          border-left:3px solid #b084ff
        }
        .workspace {
          position:relative;
          z-index:3;
          max-width:1420px;
          margin:90px auto 0;
          padding:0 44px 100px
        }
        .workspace-head {
          display:grid;
          grid-template-columns:1.1fr .9fr;
          gap:50px;
          align-items:end;
          margin-bottom:28px
        }
        .workspace-head small {
          color:#6c82a8;
          font-size:8px;
          letter-spacing:.18em;
          text-transform:uppercase
        }
        .workspace-head h2 {
          font-size:clamp(42px,5vw,72px);
          letter-spacing:-.055em;
          line-height:.95;
          margin:15px 0 0
        }
        .workspace-head p {
          color:#8493ac;
          line-height:1.7
        }
        .filter-console {
          display:grid;
          grid-template-columns:2fr repeat(4,1fr);
          gap:9px;
          padding:14px;
          border:1px solid var(--line);
          border-radius:16px;
          background:rgba(7,14,28,.83);
          backdrop-filter:blur(18px)
        }
        .filter-console label>span {
          display:block;
          margin:0 0 8px;
          color:#627699;
          font-size:7px;
          letter-spacing:.15em;
          text-transform:uppercase
        }
        .filter-console input,.filter-console select {
          width:100%;
          height:48px;
          border:1px solid rgba(124,155,216,.14);
          border-radius:9px;
          background:#050b17;
          color:#dce8fb;
          padding:0 12px;
          outline:none
        }
        .filter-console input:focus,.filter-console select:focus {
          border-color:#6c9cff;
          box-shadow:0 0 0 3px rgba(72,123,224,.08)
        }
        .result-line {
          display:flex;
          justify-content:space-between;
          align-items:center;
          padding:14px 4px;
          color:#71819e;
          font-size:9px
        }
        .result-line button {
          border:0;
          background:transparent;
          color:#83a6e7;
          cursor:pointer
        }
        .artifact-grid {
          display:grid;
          grid-template-columns:repeat(3,1fr);
          gap:12px
        }
        .artifact-card {
          --tone:#7ba8ff;
          position:relative;
          min-height:520px;
          padding:24px;
          border:1px solid rgba(127,157,216,.14);
          border-radius:18px;
          background:radial-gradient(circle at 90% 5%,color-mix(in srgb,var(--tone) 12%,transparent),transparent 28%),linear-gradient(155deg,rgba(14,24,47,.94),rgba(5,10,22,.94));
          overflow:hidden;
          transition:.28s;
          box-shadow:0 24px 60px rgba(0,0,0,.22)
        }
        .artifact-card:before {
          content:"";
          position:absolute;
          inset:0 0 auto;
          height:2px;
          background:linear-gradient(90deg,transparent,var(--tone),transparent);
          opacity:.75
        }
        .artifact-card:hover {
          transform:translateY(-6px);
          border-color:color-mix(in srgb,var(--tone) 42%,transparent);
          box-shadow:0 30px 80px rgba(0,0,0,.34)
        }
        .card-top {
          display:flex;
          justify-content:space-between;
          align-items:center
        }
        .card-top span {
          font-size:38px;
          font-weight:1000;
          color:rgba(159,190,244,.12)
        }
        .card-top b {
          font-size:7px;
          letter-spacing:.14em;
          color:#63789a
        }
        .card-determination {
          display:inline-flex;
          margin:30px 0 20px;
          padding:8px 10px;
          border:1px solid color-mix(in srgb,var(--tone) 34%,transparent);
          border-radius:8px;
          color:var(--tone);
          font-size:9px;
          font-weight:900;
          letter-spacing:.16em
        }
        .artifact-card h3 {
          font-size:25px;
          line-height:1.1;
          letter-spacing:-.035em;
          margin:0 0 15px;
          min-height:58px
        }
        .artifact-card>p {
          color:#8190a9;
          font-size:11px;
          line-height:1.7;
          min-height:114px
        }
        .card-facts {
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:7px
        }
        .card-facts span {
          padding:10px;
          border-radius:9px;
          background:rgba(255,255,255,.025);
          color:#a9b8cf;
          font-size:8px;
          overflow-wrap:anywhere
        }
        .card-facts small {
          display:block;
          color:#5f7190;
          font-size:6px;
          letter-spacing:.11em;
          text-transform:uppercase;
          margin-bottom:5px
        }
        .card-actions {
          position:absolute;
          left:24px;
          right:24px;
          bottom:24px;
          display:flex;
          justify-content:space-between;
          align-items:center
        }
        .card-actions button {
          border:0;
          border-radius:9px;
          background:color-mix(in srgb,var(--tone) 78%,white 10%);
          color:#05101e;
          padding:11px 13px;
          font-weight:900;
          font-size:8px;
          cursor:pointer
        }
        .card-actions a {
          color:#829ac2;
          text-decoration:none;
          font-size:8px
        }
        .back-button {
          margin-bottom:18px;
          border:0;
          background:transparent;
          color:#86a8e6;
          cursor:pointer
        }
        .inspector {
          --tone:#7ba8ff
        }
        .inspector-hero {
          display:grid;
          grid-template-columns:1fr auto;
          gap:60px;
          align-items:center;
          padding:46px;
          border:1px solid color-mix(in srgb,var(--tone) 22%,transparent);
          border-radius:22px;
          background:radial-gradient(circle at 82% 25%,color-mix(in srgb,var(--tone) 14%,transparent),transparent 25%),rgba(7,14,29,.86)
        }
        .inspector-hero small {
          color:#6f86ad;
          font-size:8px;
          letter-spacing:.16em;
          text-transform:uppercase
        }
        .inspector-hero h2 {
          font-size:clamp(42px,5vw,72px);
          line-height:.95;
          letter-spacing:-.055em;
          margin:18px 0
        }
        .inspector-hero p {
          max-width:780px;
          color:#8b9ab2;
          line-height:1.72
        }
        .inspector-actions {
          display:flex;
          gap:9px;
          margin-top:22px
        }
        .inspector-actions a,.inspector-actions button {
          padding:12px 15px;
          border-radius:9px;
          text-decoration:none;
          font-size:8px;
          font-weight:900;
          cursor:pointer
        }
        .inspector-actions a {
          background:var(--tone);
          color:#05101e
        }
        .inspector-actions button {
          border:1px solid rgba(125,158,219,.2);
          background:rgba(5,11,23,.8);
          color:#9fb6db
        }
        .decision-core {
          width:260px;
          height:260px;
          border-radius:50%;
          display:grid;
          place-content:center;
          text-align:center;
          border:1px solid color-mix(in srgb,var(--tone) 42%,transparent);
          box-shadow:0 0 80px color-mix(in srgb,var(--tone) 18%,transparent),inset 0 0 60px color-mix(in srgb,var(--tone) 9%,transparent)
        }
        .decision-core small,.decision-core strong,.decision-core span {
          display:block
        }
        .decision-core small {
          font-size:7px;
          color:#7085a8;
          letter-spacing:.15em
        }
        .decision-core strong {
          font-size:38px;
          color:var(--tone);
          margin:12px 0
        }
        .decision-core span {
          font-size:7px;
          color:#7890b5
        }
        .inspector-grid {
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:12px;
          margin-top:12px
        }
        .panel {
          padding:27px;
          border:1px solid var(--line);
          border-radius:16px;
          background:rgba(7,14,29,.83)
        }
        .panel.wide {
          grid-column:1/-1
        }
        .panel>small {
          color:#62789f;
          font-size:8px;
          letter-spacing:.15em;
          text-transform:uppercase
        }
        .panel h3 {
          font-size:24px;
          line-height:1.25;
          margin:16px 0
        }
        .panel p {
          color:#8392aa;
          line-height:1.7
        }
        .copy-value {
          width:100%;
          margin-top:11px;
          padding:13px;
          border:1px solid rgba(126,158,220,.13);
          border-radius:9px;
          background:rgba(255,255,255,.02);
          color:#aebdd3;
          display:flex;
          justify-content:space-between;
          gap:10px;
          cursor:pointer;
          overflow-wrap:anywhere;
          text-align:left
        }
        .copy-value i {
          font-style:normal;
          color:#6f9df0;
          font-size:7px
        }
        .chain-grid {
          display:grid;
          grid-template-columns:repeat(8,1fr);
          gap:7px;
          margin-top:20px
        }
        .chain-grid>div {
          min-height:125px;
          padding:14px;
          border:1px solid rgba(126,156,216,.11);
          border-radius:10px;
          background:rgba(255,255,255,.018)
        }
        .chain-grid b,.chain-grid span,.chain-grid small {
          display:block
        }
        .chain-grid b {
          color:#4f668f;
          font-size:8px
        }
        .chain-grid span {
          margin:25px 0 14px;
          font-size:9px;
          font-weight:900
        }
        .chain-grid small {
          font-size:6px;
          color:#64728a
        }
        .chain-grid .controlling {
          border-color:var(--tone);
          box-shadow:0 0 30px color-mix(in srgb,var(--tone) 10%,transparent)
        }
        .chain-grid .controlling small {
          color:var(--tone)
        }
        .chain-grid .not-reached {
          opacity:.35
        }
        .positive-claim:before {
          content:"✓";
          color:#56e39f;
          margin-right:10px
        }
        .bounded-claim:before {
          content:"◇";
          color:#f4c95d;
          margin-right:10px
        }
        .control-list {
          list-style:none;
          padding:0;
          margin:18px 0 0;
          display:grid;
          gap:7px
        }
        .control-list li {
          display:grid;
          grid-template-columns:36px 1fr;
          gap:10px;
          padding:11px;
          border-radius:9px;
          background:rgba(255,255,255,.023);
          color:#a6b4c8;
          font-size:9px
        }
        .control-list b {
          color:#61769c;
          font-size:7px
        }
        .control-list.evidence li {
          border-left:2px solid #56e39f
        }
        .package-grid {
          display:grid;
          grid-template-columns:repeat(4,1fr);
          gap:8px;
          margin-top:20px
        }
        .package-grid button {
          min-height:125px;
          padding:15px;
          text-align:left;
          border:1px solid rgba(126,158,218,.12);
          border-radius:10px;
          background:rgba(255,255,255,.02);
          color:#b7c5d9;
          cursor:pointer;
          transition:.22s
        }
        .package-grid button:hover {
          transform:translateY(-3px);
          border-color:#6d9bf1
        }
        .package-grid b,.package-grid span,.package-grid small {
          display:block
        }
        .package-grid b {
          color:#6483ba;
          font-size:7px
        }
        .package-grid span {
          margin:18px 0 10px;
          font-size:9px;
          font-weight:800
        }
        .package-grid small {
          color:#5f708d;
          font-size:6px
        }
        .record-navigation {
          display:flex;
          justify-content:space-between;
          align-items:center;
          margin-top:18px
        }
        .record-navigation button {
          padding:11px 14px;
          border:1px solid var(--line);
          border-radius:9px;
          background:rgba(7,14,29,.8);
          color:#93a8ca;
          cursor:pointer
        }
        .record-navigation button:disabled {
          opacity:.25
        }
        .record-navigation span {
          color:#6d7e99;
          font-size:8px
        }
        .verification-hero,.method-hero {
          min-height:430px;
          display:grid;
          grid-template-columns:1.1fr .9fr;
          gap:70px;
          align-items:center
        }
        .verification-hero small,.method-hero small {
          color:#6c84aa;
          font-size:8px;
          letter-spacing:.17em;
          text-transform:uppercase
        }
        .verification-hero h2,.method-hero h2 {
          font-size:clamp(58px,7vw,98px);
          line-height:.86;
          letter-spacing:-.065em;
          margin:26px 0
        }
        .verification-hero h2 em,.method-hero h2 em {
          font-style:normal;
          color:transparent;
          -webkit-text-stroke:1px #89aff3
        }
        .verification-hero p,.method-hero p {
          color:#8796af;
          line-height:1.75
        }
        .verify-orb {
          position:relative;
          width:320px;
          height:320px;
          border-radius:50%;
          display:grid;
          place-items:center;
          margin:auto;
          border:1px solid rgba(102,153,248,.3);
          box-shadow:0 0 90px rgba(64,115,219,.18),inset 0 0 70px rgba(64,115,219,.1)
        }
        .verify-orb span {
          font-size:90px;
          color:#80adff
        }
        .verify-orb i {
          position:absolute;
          border:1px dashed rgba(117,160,239,.2);
          border-radius:50%;
          inset:10%;
          animation:spin 27s linear infinite
        }
        .verify-orb i:nth-of-type(2) {
          inset:26%;
          animation-direction:reverse
        }
        .verify-orb i:nth-of-type(3) {
          inset:-10%;
          animation-duration:48s
        }
        .verify-console {
          max-width:1050px;
          margin:0 auto;
          padding:22px;
          border:1px solid var(--line);
          border-radius:16px;
          background:rgba(7,14,29,.85)
        }
        .verify-console label>span {
          display:block;
          margin-bottom:9px;
          color:#64799e;
          font-size:8px;
          letter-spacing:.15em;
          text-transform:uppercase
        }
        .verify-console label>div {
          display:flex;
          gap:8px
        }
        .verify-console input {
          flex:1;
          height:58px;
          border:1px solid rgba(125,158,219,.15);
          border-radius:10px;
          background:#050b17;
          color:#e9f1ff;
          padding:0 17px;
          outline:none
        }
        .verify-console label button {
          border:0;
          border-radius:10px;
          padding:0 22px;
          background:linear-gradient(135deg,#9dc2ff,#7095eb);
          color:#06101f;
          font-weight:900;
          cursor:pointer
        }
        .quick-ids {
          display:flex;
          gap:6px;
          flex-wrap:wrap;
          margin-top:11px
        }
        .quick-ids button {
          padding:7px 9px;
          border:1px solid rgba(126,157,216,.12);
          border-radius:7px;
          background:rgba(255,255,255,.02);
          color:#6d81a5;
          font-size:7px;
          cursor:pointer
        }
        .verification-result {
          max-width:1050px;
          margin:12px auto 0;
          padding:24px;
          border:1px solid var(--line);
          border-radius:16px;
          background:rgba(7,14,29,.84)
        }
        .verification-result.success {
          display:grid;
          grid-template-columns:1fr 1fr auto;
          gap:22px;
          align-items:center;
          border-left:3px solid var(--tone)
        }
        .verification-result.failed {
          border-left:3px solid #ff6b7a
        }
        .verification-result small {
          color:#657a9f;
          font-size:7px;
          letter-spacing:.15em
        }
        .verification-result h3 {
          font-size:25px;
          margin:9px 0 4px
        }
        .verification-result p {
          color:#7e8da6
        }
        .verification-result>button {
          padding:11px;
          border:1px solid var(--line);
          border-radius:9px;
          background:rgba(79,119,204,.1);
          color:#a9bfe2;
          cursor:pointer
        }
        .verify-facts {
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:7px
        }
        .verify-facts span {
          padding:9px;
          background:rgba(255,255,255,.024);
          font-size:8px
        }
        .verify-facts small {
          display:block;
          margin-bottom:5px;
          color:#60718d;
          font-size:6px
        }
        .verification-levels {
          display:grid;
          grid-template-columns:repeat(4,1fr);
          gap:9px;
          max-width:1050px;
          margin:48px auto
        }
        .verification-levels article {
          min-height:155px;
          padding:17px;
          border:1px solid rgba(125,157,217,.1);
          border-radius:11px;
          background:rgba(255,255,255,.018)
        }
        .verification-levels article.active {
          border-top:2px solid #6d9fff
        }
        .verification-levels b {
          color:#719cec
        }
        .verification-levels span {
          display:block;
          margin:14px 0 8px;
          font-weight:800;
          font-size:9px
        }
        .verification-levels p {
          color:#66758e;
          font-size:8px;
          line-height:1.55
        }
        .method-rule {
          padding:28px;
          border-left:2px solid #7eaaff;
          background:rgba(7,14,29,.76)
        }
        .method-rule small,.method-rule strong {
          display:block
        }
        .method-rule small {
          color:#657ca3;
          font-size:8px;
          letter-spacing:.15em;
          text-transform:uppercase
        }
        .method-rule strong {
          margin-top:15px;
          color:#afbdd1;
          font-size:14px;
          line-height:1.7
        }
        .method-chain {
          display:grid;
          grid-template-columns:repeat(8,1fr);
          gap:7px;
          margin:28px 0 70px
        }
        .method-chain article {
          min-height:205px;
          padding:16px;
          border:1px solid var(--line);
          border-radius:11px;
          background:linear-gradient(155deg,rgba(14,24,47,.9),rgba(5,10,22,.9))
        }
        .method-chain b,.method-chain span,.method-chain small {
          display:block
        }
        .method-chain b {
          color:#536f9f;
          font-size:8px
        }
        .method-chain span {
          margin:35px 0 16px;
          font-size:10px;
          font-weight:900
        }
        .method-chain small {
          color:#6f7d95;
          font-size:8px;
          line-height:1.55
        }
        .method-columns {
          display:grid;
          grid-template-columns:repeat(3,1fr);
          gap:11px;
          margin-bottom:70px
        }
        .method-columns article {
          padding:29px;
          border:1px solid var(--line);
          border-radius:15px;
          background:rgba(7,14,29,.82)
        }
        .method-columns small {
          color:#647aa1;
          font-size:8px;
          letter-spacing:.15em;
          text-transform:uppercase
        }
        .method-columns h3 {
          font-size:23px;
          line-height:1.2
        }
        .method-columns p {
          color:#7f8ea7;
          line-height:1.7
        }
        .method-package {
          display:grid;
          grid-template-columns:.7fr 1.3fr;
          gap:40px;
          align-items:start;
          padding:34px;
          border:1px solid var(--line);
          border-radius:18px;
          background:rgba(7,14,29,.82)
        }
        .method-package small {
          color:#667da4;
          font-size:8px;
          letter-spacing:.15em;
          text-transform:uppercase
        }
        .method-package h3 {
          font-size:34px;
          margin:14px 0
        }
        .method-package p {
          color:#7d8ca5
        }
        .method-package-grid {
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:7px
        }
        .method-package-grid span {
          padding:10px;
          border-radius:8px;
          background:rgba(255,255,255,.025);
          color:#a4b2c7;
          font-size:8px
        }
        .method-package-grid b {
          color:#6280b3;
          margin-right:8px
        }
        .method-cta {
          margin-top:70px;
          padding:58px;
          border:1px solid rgba(104,153,246,.2);
          border-radius:21px;
          text-align:center;
          background:radial-gradient(circle at 80% 50%,rgba(67,112,219,.13),transparent 34%),rgba(7,14,29,.82)
        }
        .method-cta small {
          color:#6981a9;
          font-size:8px;
          letter-spacing:.16em;
          text-transform:uppercase
        }
        .method-cta h3 {
          font-size:40px;
          letter-spacing:-.04em
        }
        .method-cta p {
          color:#8190a9
        }
        .method-cta a {
          display:inline-block;
          margin-top:18px;
          padding:14px 19px;
          border-radius:10px;
          background:#8eb6ff;
          color:#06101f;
          text-decoration:none;
          font-weight:900
        }
        footer {
          position:relative;
          z-index:3;
          max-width:1420px;
          margin:0 auto;
          padding:34px 44px 48px;
          border-top:1px solid var(--line);
          display:grid;
          grid-template-columns:1fr 1fr 1fr;
          align-items:center;
          color:#687995;
          font-size:9px
        }
        footer div:first-child b,footer div:first-child span {
          display:block
        }
        footer div:first-child b {
          color:#b1bfd3;
          margin-bottom:5px
        }
        footer>strong {
          text-align:center;
          color:#879bbb
        }
        footer div:last-child {
          display:flex;
          justify-content:flex-end;
          gap:12px
        }
        footer a,footer button {
          border:0;
          background:transparent;
          color:#7488aa;
          text-decoration:none;
          font-size:8px;
          cursor:pointer
        }

        .institutional-ribbon {
          position:relative;
          z-index:3;
          max-width:1420px;
          margin:14px auto 0;
          padding:18px 22px;
          display:grid;
          grid-template-columns:1.05fr 2fr auto;
          gap:24px;
          align-items:center;
          border:1px solid rgba(126,157,216,.16);
          border-radius:16px;
          background:linear-gradient(135deg,rgba(10,20,40,.92),rgba(5,11,24,.92));
          box-shadow:0 22px 60px rgba(0,0,0,.2)
        }
        .ribbon-rule span,.ribbon-rule strong {display:block}
        .ribbon-rule span {
          color:#6680aa;
          font-size:7px;
          letter-spacing:.16em;
          text-transform:uppercase
        }
        .ribbon-rule strong {margin-top:7px;font-size:13px}
        .ribbon-marks {
          display:grid;
          grid-template-columns:repeat(4,1fr);
          gap:8px
        }
        .ribbon-marks span {
          min-height:58px;
          padding:10px 12px;
          border-radius:9px;
          background:rgba(255,255,255,.025)
        }
        .ribbon-marks small,.ribbon-marks b {display:block}
        .ribbon-marks small {
          color:#5f7396;
          font-size:6px;
          letter-spacing:.12em;
          text-transform:uppercase
        }
        .ribbon-marks b {margin-top:7px;color:#aebed6;font-size:8px}
        .institutional-ribbon>button {
          border:0;
          border-radius:9px;
          padding:12px 15px;
          background:linear-gradient(135deg,#9fc4ff,#7197ed);
          color:#06101f;
          font-size:8px;
          font-weight:900;
          cursor:pointer
        }
        .library-onboarding {
          margin-bottom:12px;
          padding:24px;
          display:grid;
          grid-template-columns:1fr auto;
          gap:24px;
          align-items:center;
          border:1px solid rgba(126,157,216,.14);
          border-radius:16px;
          background:radial-gradient(circle at 90% 10%,rgba(83,129,222,.1),transparent 30%),rgba(7,14,29,.82)
        }
        .library-onboarding small {
          color:#6b82a8;
          font-size:7px;
          letter-spacing:.16em;
          text-transform:uppercase
        }
        .library-onboarding h3 {margin:10px 0 8px;font-size:22px;letter-spacing:-.025em}
        .library-onboarding p {margin:0;max-width:900px;color:#8190aa;line-height:1.65;font-size:10px}
        .onboarding-actions {display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end}
        .onboarding-actions button,.onboarding-actions a {
          padding:11px 13px;
          border-radius:9px;
          font-size:8px;
          font-weight:900;
          text-decoration:none;
          cursor:pointer
        }
        .onboarding-actions button {border:0;background:#8eb6ff;color:#06101f}
        .onboarding-actions a {border:1px solid rgba(126,157,216,.2);color:#a8bee2}
        .artifact-card {min-height:680px}
        .artifact-identity {display:flex;align-items:center;gap:12px;min-width:0}
        .artifact-identity>span {flex:0 0 auto}
        .artifact-identity div {min-width:0}
        .artifact-identity small,.artifact-identity b {display:block}
        .artifact-identity small {
          color:#5e7294;
          font-size:6px;
          letter-spacing:.12em;
          text-transform:uppercase
        }
        .artifact-identity b {
          margin-top:5px;
          color:#b4c7e5;
          font-size:8px;
          letter-spacing:.06em;
          overflow-wrap:anywhere
        }
        .publication-stack {display:grid;gap:6px;justify-items:end}
        .publication-stack b,.publication-stack em {
          padding:6px 8px;
          border-radius:999px;
          font-size:6px;
          letter-spacing:.13em;
          font-style:normal
        }
        .publication-stack b {color:#7184a5;background:rgba(255,255,255,.025)}
        .publication-stack em {color:#e2bd64;border:1px solid rgba(226,189,100,.22);background:rgba(226,189,100,.05)}
        .artifact-attribution {
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:7px;
          margin:13px 0
        }
        .artifact-attribution span {
          min-height:50px;
          padding:9px 10px;
          border-radius:9px;
          border:1px solid rgba(126,157,216,.08);
          background:rgba(255,255,255,.018);
          color:#a9b9d0;
          font-size:7px;
          line-height:1.35;
          overflow-wrap:anywhere
        }
        .artifact-attribution small {
          display:block;
          color:#5e7190;
          font-size:6px;
          letter-spacing:.1em;
          text-transform:uppercase;
          margin-bottom:5px
        }
        .identity-ledger {
          margin-top:12px;
          padding:14px;
          display:grid;
          grid-template-columns:repeat(3,1fr);
          gap:8px;
          border:1px solid var(--line);
          border-radius:14px;
          background:rgba(7,14,29,.82)
        }
        .identity-ledger span {padding:12px;border-radius:9px;background:rgba(255,255,255,.022)}
        .identity-ledger small,.identity-ledger b {display:block}
        .identity-ledger small {color:#61769a;font-size:6px;letter-spacing:.12em;text-transform:uppercase}
        .identity-ledger b {margin-top:7px;color:#afc0d8;font-size:8px;overflow-wrap:anywhere}
        .guide-hero {
          min-height:430px;
          display:grid;
          grid-template-columns:1.15fr .85fr;
          gap:70px;
          align-items:center
        }
        .guide-hero small {
          color:#6c84aa;
          font-size:8px;
          letter-spacing:.17em;
          text-transform:uppercase
        }
        .guide-hero h2 {
          font-size:clamp(54px,6.5vw,92px);
          line-height:.88;
          letter-spacing:-.065em;
          margin:26px 0
        }
        .guide-hero h2 em {
          font-style:normal;
          color:transparent;
          -webkit-text-stroke:1px #89aff3
        }
        .guide-hero p {color:#8796af;line-height:1.75}
        .guide-rule {
          padding:30px;
          border:1px solid rgba(226,189,100,.18);
          border-radius:18px;
          background:radial-gradient(circle at 80% 0,rgba(226,189,100,.09),transparent 34%),rgba(7,14,29,.82)
        }
        .guide-rule span {color:#c7a653;font-size:7px;letter-spacing:.16em;text-transform:uppercase}
        .guide-rule strong {display:block;margin:17px 0;font-size:28px;line-height:1.12}
        .guide-rule p {font-size:10px;margin:0}
        .journey-map {display:grid;gap:10px;margin:20px 0 70px}
        .journey-map article {
          position:relative;
          display:grid;
          grid-template-columns:86px 1fr;
          gap:22px;
          min-height:190px;
          padding:28px;
          border:1px solid var(--line);
          border-radius:16px;
          background:linear-gradient(145deg,rgba(13,23,45,.9),rgba(5,10,22,.9))
        }
        .journey-number {
          width:70px;
          height:70px;
          border-radius:50%;
          display:grid;
          place-items:center;
          border:1px solid rgba(125,170,255,.28);
          color:#9abaff;
          font-size:22px;
          font-weight:1000;
          box-shadow:0 0 40px rgba(75,126,225,.1)
        }
        .journey-copy small {color:#6680aa;font-size:7px;letter-spacing:.16em;text-transform:uppercase}
        .journey-copy h3 {font-size:26px;letter-spacing:-.03em;margin:12px 0 9px}
        .journey-copy p {color:#8190aa;line-height:1.65;max-width:970px;font-size:10px}
        .journey-copy a {display:inline-block;margin-top:12px;color:#8eb6ff;text-decoration:none;font-size:8px;font-weight:900}
        .journey-connector {
          position:absolute;
          left:62px;
          bottom:-18px;
          width:1px;
          height:26px;
          background:rgba(126,157,216,.24)
        }
        .journey-connector span {
          position:absolute;
          bottom:0;
          left:-3px;
          width:7px;
          height:7px;
          border-radius:50%;
          background:#7ca8fa
        }
        .guide-proof-grid {display:grid;grid-template-columns:repeat(3,1fr);gap:11px;margin-bottom:70px}
        .guide-proof-grid article {padding:28px;border:1px solid var(--line);border-radius:15px;background:rgba(7,14,29,.82)}
        .guide-proof-grid small {color:#667da4;font-size:7px;letter-spacing:.15em;text-transform:uppercase}
        .guide-proof-grid h3 {font-size:27px;margin:14px 0}
        .guide-proof-grid p {color:#8190aa;line-height:1.65;font-size:10px}
        .guide-cta {
          padding:40px;
          display:grid;
          grid-template-columns:1fr auto;
          gap:30px;
          align-items:center;
          border:1px solid rgba(104,153,246,.2);
          border-radius:19px;
          background:radial-gradient(circle at 85% 50%,rgba(67,112,219,.13),transparent 34%),rgba(7,14,29,.82)
        }
        .guide-cta small {color:#6981a9;font-size:7px;letter-spacing:.16em;text-transform:uppercase}
        .guide-cta h3 {font-size:29px;max-width:850px;margin:10px 0 0;letter-spacing:-.035em}
        .guide-cta>div:last-child {display:flex;gap:8px}
        .guide-cta a {padding:13px 16px;border-radius:9px;background:#8eb6ff;color:#06101f;text-decoration:none;font-size:8px;font-weight:900}
        .guide-cta a.secondary-link {background:transparent;color:#a7bee3;border:1px solid rgba(126,157,216,.2)}

        @keyframes spin {
          to {
            transform:rotate(360deg)
          }
        }
        @keyframes spinReverse {
          to {
            transform:rotate(-360deg)
          }
        }
        @media(max-width:1160px) {
          .hero {
            grid-template-columns:1fr
          }
          .hero-machine {
            width:500px
          }
          .metrics,.determination-strip {
            grid-template-columns:1fr 1fr
          }
          .artifact-grid {
            grid-template-columns:1fr 1fr
          }
          .filter-console {
            grid-template-columns:1fr 1fr
          }
          .search-field {
            grid-column:1/-1
          }
          .chain-grid,.method-chain {
            grid-template-columns:repeat(4,1fr)
          }
          .package-grid {
            grid-template-columns:repeat(3,1fr)
          }
        }

        @media(max-width:1160px) {
          .institutional-ribbon {grid-template-columns:1fr}
          .ribbon-marks {grid-template-columns:1fr 1fr}
          .identity-ledger {grid-template-columns:1fr 1fr}
          .guide-hero {grid-template-columns:1fr}
        }

        @media(max-width:760px) {
          .institutional-ribbon {margin:14px 18px 0;padding:16px}
          .ribbon-marks {grid-template-columns:1fr}
          .library-onboarding {grid-template-columns:1fr}
          .onboarding-actions {justify-content:flex-start}
          .artifact-card {min-height:720px}
          .identity-ledger {grid-template-columns:1fr}
          .guide-proof-grid {grid-template-columns:1fr}
          .guide-cta {grid-template-columns:1fr}
          .guide-cta>div:last-child {flex-wrap:wrap}
          .journey-map article {grid-template-columns:1fr}
          .journey-connector {display:none}
          .topbar {
            padding:15px 18px
          }
          .topbar nav button {
            display:none
          }
          .topbar nav .build-link {
            display:block
          }
          .hero {
            padding:65px 18px
          }
          .hero h1 {
            font-size:66px
          }
          .hero-machine {
            width:340px
          }
          .metrics,.determination-strip {
            padding:0 18px;
            grid-template-columns:1fr
          }
          .workspace {
            padding:0 18px 80px
          }
          .workspace-head {
            grid-template-columns:1fr
          }
          .filter-console {
            grid-template-columns:1fr
          }
          .search-field {
            grid-column:auto
          }
          .artifact-grid {
            grid-template-columns:1fr
          }
          .inspector-hero {
            grid-template-columns:1fr;
            padding:28px
          }
          .decision-core {
            width:240px;
            height:240px;
            margin:auto
          }
          .inspector-grid {
            grid-template-columns:1fr
          }
          .panel.wide {
            grid-column:auto
          }
          .chain-grid {
            grid-template-columns:1fr 1fr
          }
          .package-grid {
            grid-template-columns:1fr 1fr
          }
          .verification-hero,.method-hero {
            grid-template-columns:1fr
          }
          .verification-result.success {
            grid-template-columns:1fr
          }
          .verification-levels {
            grid-template-columns:1fr 1fr
          }
          .method-chain {
            grid-template-columns:1fr 1fr
          }
          .method-columns {
            grid-template-columns:1fr
          }
          .method-package {
            grid-template-columns:1fr
          }
          .method-package-grid {
            grid-template-columns:1fr
          }
          .method-cta {
            padding:35px 20px
          }
          footer {
            grid-template-columns:1fr;
            gap:18px;
            text-align:center
          }
          footer>strong {
            text-align:center
          }
          footer div:last-child {
            justify-content:center
          }
        }
        .artifact-card:nth-child(2) .card-top span {
          text-shadow:0 0 18px rgba(103,151,238,0.06)
        }
        .artifact-card:nth-child(3) .card-top span {
          text-shadow:0 0 20px rgba(103,151,238,0.07)
        }
        .artifact-card:nth-child(4) .card-top span {
          text-shadow:0 0 22px rgba(103,151,238,0.08)
        }
        .artifact-card:nth-child(5) .card-top span {
          text-shadow:0 0 24px rgba(103,151,238,0.09)
        }
        .artifact-card:nth-child(6) .card-top span {
          text-shadow:0 0 26px rgba(103,151,238,0.05)
        }
        .artifact-card:nth-child(7) .card-top span {
          text-shadow:0 0 28px rgba(103,151,238,0.06)
        }
        .artifact-card:nth-child(8) .card-top span {
          text-shadow:0 0 30px rgba(103,151,238,0.07)
        }
        .artifact-card:nth-child(9) .card-top span {
          text-shadow:0 0 16px rgba(103,151,238,0.08)
        }
        .artifact-card:nth-child(10) .card-top span {
          text-shadow:0 0 18px rgba(103,151,238,0.09)
        }
        .artifact-card:nth-child(11) .card-top span {
          text-shadow:0 0 20px rgba(103,151,238,0.05)
        }
        .artifact-card:nth-child(12) .card-top span {
          text-shadow:0 0 22px rgba(103,151,238,0.06)
        }
        .artifact-card:nth-child(1) .card-top span {
          text-shadow:0 0 24px rgba(103,151,238,0.07)
        }
        .artifact-card:nth-child(2) .card-top span {
          text-shadow:0 0 26px rgba(103,151,238,0.08)
        }
        .artifact-card:nth-child(3) .card-top span {
          text-shadow:0 0 28px rgba(103,151,238,0.09)
        }
        .artifact-card:nth-child(4) .card-top span {
          text-shadow:0 0 30px rgba(103,151,238,0.05)
        }
        .artifact-card:nth-child(5) .card-top span {
          text-shadow:0 0 16px rgba(103,151,238,0.06)
        }
        .artifact-card:nth-child(6) .card-top span {
          text-shadow:0 0 18px rgba(103,151,238,0.07)
        }
        .artifact-card:nth-child(7) .card-top span {
          text-shadow:0 0 20px rgba(103,151,238,0.08)
        }
        .artifact-card:nth-child(8) .card-top span {
          text-shadow:0 0 22px rgba(103,151,238,0.09)
        }
        .artifact-card:nth-child(9) .card-top span {
          text-shadow:0 0 24px rgba(103,151,238,0.05)
        }
        .artifact-card:nth-child(10) .card-top span {
          text-shadow:0 0 26px rgba(103,151,238,0.06)
        }
        .artifact-card:nth-child(11) .card-top span {
          text-shadow:0 0 28px rgba(103,151,238,0.07)
        }
        .artifact-card:nth-child(12) .card-top span {
          text-shadow:0 0 30px rgba(103,151,238,0.08)
        }
        .artifact-card:nth-child(1) .card-top span {
          text-shadow:0 0 16px rgba(103,151,238,0.09)
        }
        .artifact-card:nth-child(2) .card-top span {
          text-shadow:0 0 18px rgba(103,151,238,0.05)
        }
        .artifact-card:nth-child(3) .card-top span {
          text-shadow:0 0 20px rgba(103,151,238,0.06)
        }
        .artifact-card:nth-child(4) .card-top span {
          text-shadow:0 0 22px rgba(103,151,238,0.07)
        }
        .artifact-card:nth-child(5) .card-top span {
          text-shadow:0 0 24px rgba(103,151,238,0.08)
        }
        .artifact-card:nth-child(6) .card-top span {
          text-shadow:0 0 26px rgba(103,151,238,0.09)
        }
        .artifact-card:nth-child(7) .card-top span {
          text-shadow:0 0 28px rgba(103,151,238,0.05)
        }
        .artifact-card:nth-child(8) .card-top span {
          text-shadow:0 0 30px rgba(103,151,238,0.06)
        }
        .artifact-card:nth-child(9) .card-top span {
          text-shadow:0 0 16px rgba(103,151,238,0.07)
        }
        .artifact-card:nth-child(10) .card-top span {
          text-shadow:0 0 18px rgba(103,151,238,0.08)
        }
        .artifact-card:nth-child(11) .card-top span {
          text-shadow:0 0 20px rgba(103,151,238,0.09)
        }
        .artifact-card:nth-child(12) .card-top span {
          text-shadow:0 0 22px rgba(103,151,238,0.05)
        }
        .artifact-card:nth-child(1) .card-top span {
          text-shadow:0 0 24px rgba(103,151,238,0.06)
        }
        .artifact-card:nth-child(2) .card-top span {
          text-shadow:0 0 26px rgba(103,151,238,0.07)
        }
        .artifact-card:nth-child(3) .card-top span {
          text-shadow:0 0 28px rgba(103,151,238,0.08)
        }
        .artifact-card:nth-child(4) .card-top span {
          text-shadow:0 0 30px rgba(103,151,238,0.09)
        }
        .artifact-card:nth-child(5) .card-top span {
          text-shadow:0 0 16px rgba(103,151,238,0.05)
        }
        .artifact-card:nth-child(6) .card-top span {
          text-shadow:0 0 18px rgba(103,151,238,0.06)
        }
        .artifact-card:nth-child(7) .card-top span {
          text-shadow:0 0 20px rgba(103,151,238,0.07)
        }
        .artifact-card:nth-child(8) .card-top span {
          text-shadow:0 0 22px rgba(103,151,238,0.08)
        }
        .artifact-card:nth-child(9) .card-top span {
          text-shadow:0 0 24px rgba(103,151,238,0.09)
        }
        .artifact-card:nth-child(10) .card-top span {
          text-shadow:0 0 26px rgba(103,151,238,0.05)
        }
        .artifact-card:nth-child(11) .card-top span {
          text-shadow:0 0 28px rgba(103,151,238,0.06)
        }
        .artifact-card:nth-child(12) .card-top span {
          text-shadow:0 0 30px rgba(103,151,238,0.07)
        }
        .artifact-card:nth-child(1) .card-top span {
          text-shadow:0 0 16px rgba(103,151,238,0.08)
        }
        .artifact-card:nth-child(2) .card-top span {
          text-shadow:0 0 18px rgba(103,151,238,0.09)
        }
        .artifact-card:nth-child(3) .card-top span {
          text-shadow:0 0 20px rgba(103,151,238,0.05)
        }
        .artifact-card:nth-child(4) .card-top span {
          text-shadow:0 0 22px rgba(103,151,238,0.06)
        }
        .artifact-card:nth-child(5) .card-top span {
          text-shadow:0 0 24px rgba(103,151,238,0.07)
        }
        .artifact-card:nth-child(6) .card-top span {
          text-shadow:0 0 26px rgba(103,151,238,0.08)
        }
        .artifact-card:nth-child(7) .card-top span {
          text-shadow:0 0 28px rgba(103,151,238,0.09)
        }
        .artifact-card:nth-child(8) .card-top span {
          text-shadow:0 0 30px rgba(103,151,238,0.05)
        }
        .artifact-card:nth-child(9) .card-top span {
          text-shadow:0 0 16px rgba(103,151,238,0.06)
        }
        .artifact-card:nth-child(10) .card-top span {
          text-shadow:0 0 18px rgba(103,151,238,0.07)
        }
        .artifact-card:nth-child(11) .card-top span {
          text-shadow:0 0 20px rgba(103,151,238,0.08)
        }
        .artifact-card:nth-child(12) .card-top span {
          text-shadow:0 0 22px rgba(103,151,238,0.09)
        }
        .artifact-card:nth-child(1) .card-top span {
          text-shadow:0 0 24px rgba(103,151,238,0.05)
        }
        .artifact-card:nth-child(2) .card-top span {
          text-shadow:0 0 26px rgba(103,151,238,0.06)
        }
        .artifact-card:nth-child(3) .card-top span {
          text-shadow:0 0 28px rgba(103,151,238,0.07)
        }
        .artifact-card:nth-child(4) .card-top span {
          text-shadow:0 0 30px rgba(103,151,238,0.08)
        }
        .artifact-card:nth-child(5) .card-top span {
          text-shadow:0 0 16px rgba(103,151,238,0.09)
        }
        .artifact-card:nth-child(6) .card-top span {
          text-shadow:0 0 18px rgba(103,151,238,0.05)
        }
        .artifact-card:nth-child(7) .card-top span {
          text-shadow:0 0 20px rgba(103,151,238,0.06)
        }
        .artifact-card:nth-child(8) .card-top span {
          text-shadow:0 0 22px rgba(103,151,238,0.07)
        }
        .artifact-card:nth-child(9) .card-top span {
          text-shadow:0 0 24px rgba(103,151,238,0.08)
        }
        .artifact-card:nth-child(10) .card-top span {
          text-shadow:0 0 26px rgba(103,151,238,0.09)
        }
        .artifact-card:nth-child(11) .card-top span {
          text-shadow:0 0 28px rgba(103,151,238,0.05)
        }
        .artifact-card:nth-child(12) .card-top span {
          text-shadow:0 0 30px rgba(103,151,238,0.06)
        }
        .artifact-card:nth-child(1) .card-top span {
          text-shadow:0 0 16px rgba(103,151,238,0.07)
        }
        .artifact-card:nth-child(2) .card-top span {
          text-shadow:0 0 18px rgba(103,151,238,0.08)
        }
        .artifact-card:nth-child(3) .card-top span {
          text-shadow:0 0 20px rgba(103,151,238,0.09)
        }
        .artifact-card:nth-child(4) .card-top span {
          text-shadow:0 0 22px rgba(103,151,238,0.05)
        }
        .artifact-card:nth-child(5) .card-top span {
          text-shadow:0 0 24px rgba(103,151,238,0.06)
        }
        .artifact-card:nth-child(6) .card-top span {
          text-shadow:0 0 26px rgba(103,151,238,0.07)
        }
        .artifact-card:nth-child(7) .card-top span {
          text-shadow:0 0 28px rgba(103,151,238,0.08)
        }
        .artifact-card:nth-child(8) .card-top span {
          text-shadow:0 0 30px rgba(103,151,238,0.09)
        }
        .artifact-card:nth-child(9) .card-top span {
          text-shadow:0 0 16px rgba(103,151,238,0.05)
        }
        .artifact-card:nth-child(10) .card-top span {
          text-shadow:0 0 18px rgba(103,151,238,0.06)
        }
        .artifact-card:nth-child(11) .card-top span {
          text-shadow:0 0 20px rgba(103,151,238,0.07)
        }
        .artifact-card:nth-child(12) .card-top span {
          text-shadow:0 0 22px rgba(103,151,238,0.08)
        }
        .artifact-card:nth-child(1) .card-top span {
          text-shadow:0 0 24px rgba(103,151,238,0.09)
        }
        .artifact-card:nth-child(2) .card-top span {
          text-shadow:0 0 26px rgba(103,151,238,0.05)
        }
        .artifact-card:nth-child(3) .card-top span {
          text-shadow:0 0 28px rgba(103,151,238,0.06)
        }
        .artifact-card:nth-child(4) .card-top span {
          text-shadow:0 0 30px rgba(103,151,238,0.07)
        }
        .artifact-card:nth-child(5) .card-top span {
          text-shadow:0 0 16px rgba(103,151,238,0.08)
        }
        .artifact-card:nth-child(6) .card-top span {
          text-shadow:0 0 18px rgba(103,151,238,0.09)
        }
        .artifact-card:nth-child(7) .card-top span {
          text-shadow:0 0 20px rgba(103,151,238,0.05)
        }
        .artifact-card:nth-child(8) .card-top span {
          text-shadow:0 0 22px rgba(103,151,238,0.06)
        }
        .artifact-card:nth-child(9) .card-top span {
          text-shadow:0 0 24px rgba(103,151,238,0.07)
        }
        .artifact-card:nth-child(10) .card-top span {
          text-shadow:0 0 26px rgba(103,151,238,0.08)
        }
        .artifact-card:nth-child(11) .card-top span {
          text-shadow:0 0 28px rgba(103,151,238,0.09)
        }
        .artifact-card:nth-child(12) .card-top span {
          text-shadow:0 0 30px rgba(103,151,238,0.05)
        }
        .artifact-card:nth-child(1) .card-top span {
          text-shadow:0 0 16px rgba(103,151,238,0.06)
        }
        .artifact-card:nth-child(2) .card-top span {
          text-shadow:0 0 18px rgba(103,151,238,0.07)
        }
        .artifact-card:nth-child(3) .card-top span {
          text-shadow:0 0 20px rgba(103,151,238,0.08)
        }
        .artifact-card:nth-child(4) .card-top span {
          text-shadow:0 0 22px rgba(103,151,238,0.09)
        }
        .artifact-card:nth-child(5) .card-top span {
          text-shadow:0 0 24px rgba(103,151,238,0.05)
        }
        .artifact-card:nth-child(6) .card-top span {
          text-shadow:0 0 26px rgba(103,151,238,0.06)
        }
        .artifact-card:nth-child(7) .card-top span {
          text-shadow:0 0 28px rgba(103,151,238,0.07)
        }
        .artifact-card:nth-child(8) .card-top span {
          text-shadow:0 0 30px rgba(103,151,238,0.08)
        }
        .artifact-card:nth-child(9) .card-top span {
          text-shadow:0 0 16px rgba(103,151,238,0.09)
        }
        .artifact-card:nth-child(10) .card-top span {
          text-shadow:0 0 18px rgba(103,151,238,0.05)
        }
        .artifact-card:nth-child(11) .card-top span {
          text-shadow:0 0 20px rgba(103,151,238,0.06)
        }
        .artifact-card:nth-child(12) .card-top span {
          text-shadow:0 0 22px rgba(103,151,238,0.07)
        }
        .artifact-card:nth-child(1) .card-top span {
          text-shadow:0 0 24px rgba(103,151,238,0.08)
        }
        .artifact-card:nth-child(2) .card-top span {
          text-shadow:0 0 26px rgba(103,151,238,0.09)
        }
        .artifact-card:nth-child(3) .card-top span {
          text-shadow:0 0 28px rgba(103,151,238,0.05)
        }
        .artifact-card:nth-child(4) .card-top span {
          text-shadow:0 0 30px rgba(103,151,238,0.06)
        }
        .artifact-card:nth-child(5) .card-top span {
          text-shadow:0 0 16px rgba(103,151,238,0.07)
        }
        .artifact-card:nth-child(6) .card-top span {
          text-shadow:0 0 18px rgba(103,151,238,0.08)
        }
        .artifact-card:nth-child(7) .card-top span {
          text-shadow:0 0 20px rgba(103,151,238,0.09)
        }
        .artifact-card:nth-child(8) .card-top span {
          text-shadow:0 0 22px rgba(103,151,238,0.05)
        }
        .artifact-card:nth-child(9) .card-top span {
          text-shadow:0 0 24px rgba(103,151,238,0.06)
        }
        .artifact-card:nth-child(10) .card-top span {
          text-shadow:0 0 26px rgba(103,151,238,0.07)
        }
        .artifact-card:nth-child(11) .card-top span {
          text-shadow:0 0 28px rgba(103,151,238,0.08)
        }
        .artifact-card:nth-child(12) .card-top span {
          text-shadow:0 0 30px rgba(103,151,238,0.09)
        }
        .artifact-card:nth-child(1) .card-top span {
          text-shadow:0 0 16px rgba(103,151,238,0.05)
        }
        .artifact-card:nth-child(2) .card-top span {
          text-shadow:0 0 18px rgba(103,151,238,0.06)
        }
        .artifact-card:nth-child(3) .card-top span {
          text-shadow:0 0 20px rgba(103,151,238,0.07)
        }
        .artifact-card:nth-child(4) .card-top span {
          text-shadow:0 0 22px rgba(103,151,238,0.08)
        }
        .artifact-card:nth-child(5) .card-top span {
          text-shadow:0 0 24px rgba(103,151,238,0.09)
        }
        .artifact-card:nth-child(6) .card-top span {
          text-shadow:0 0 26px rgba(103,151,238,0.05)
        }
        .artifact-card:nth-child(7) .card-top span {
          text-shadow:0 0 28px rgba(103,151,238,0.06)
        }
        .artifact-card:nth-child(8) .card-top span {
          text-shadow:0 0 30px rgba(103,151,238,0.07)
        }
        .artifact-card:nth-child(9) .card-top span {
          text-shadow:0 0 16px rgba(103,151,238,0.08)
        }
        .artifact-card:nth-child(10) .card-top span {
          text-shadow:0 0 18px rgba(103,151,238,0.09)
        }
        .artifact-card:nth-child(11) .card-top span {
          text-shadow:0 0 20px rgba(103,151,238,0.05)
        }
        .artifact-card:nth-child(12) .card-top span {
          text-shadow:0 0 22px rgba(103,151,238,0.06)
        }
        .artifact-card:nth-child(1) .card-top span {
          text-shadow:0 0 24px rgba(103,151,238,0.07)
        }
        .artifact-card:nth-child(2) .card-top span {
          text-shadow:0 0 26px rgba(103,151,238,0.08)
        }
        .artifact-card:nth-child(3) .card-top span {
          text-shadow:0 0 28px rgba(103,151,238,0.09)
        }
        .artifact-card:nth-child(4) .card-top span {
          text-shadow:0 0 30px rgba(103,151,238,0.05)
        }
        .artifact-card:nth-child(5) .card-top span {
          text-shadow:0 0 16px rgba(103,151,238,0.06)
        }
        .artifact-card:nth-child(6) .card-top span {
          text-shadow:0 0 18px rgba(103,151,238,0.07)
        }
        .artifact-card:nth-child(7) .card-top span {
          text-shadow:0 0 20px rgba(103,151,238,0.08)
        }
        .artifact-card:nth-child(8) .card-top span {
          text-shadow:0 0 22px rgba(103,151,238,0.09)
        }
        .artifact-card:nth-child(9) .card-top span {
          text-shadow:0 0 24px rgba(103,151,238,0.05)
        }
        .artifact-card:nth-child(10) .card-top span {
          text-shadow:0 0 26px rgba(103,151,238,0.06)
        }
        .artifact-card:nth-child(11) .card-top span {
          text-shadow:0 0 28px rgba(103,151,238,0.07)
        }
        .artifact-card:nth-child(12) .card-top span {
          text-shadow:0 0 30px rgba(103,151,238,0.08)
        }
        .artifact-card:nth-child(1) .card-top span {
          text-shadow:0 0 16px rgba(103,151,238,0.09)
        }
        .artifact-card:nth-child(2) .card-top span {
          text-shadow:0 0 18px rgba(103,151,238,0.05)
        }
        .artifact-card:nth-child(3) .card-top span {
          text-shadow:0 0 20px rgba(103,151,238,0.06)
        }
        .artifact-card:nth-child(4) .card-top span {
          text-shadow:0 0 22px rgba(103,151,238,0.07)
        }
        .artifact-card:nth-child(5) .card-top span {
          text-shadow:0 0 24px rgba(103,151,238,0.08)
        }
        .artifact-card:nth-child(6) .card-top span {
          text-shadow:0 0 26px rgba(103,151,238,0.09)
        }
        .artifact-card:nth-child(7) .card-top span {
          text-shadow:0 0 28px rgba(103,151,238,0.05)
        }
        .artifact-card:nth-child(8) .card-top span {
          text-shadow:0 0 30px rgba(103,151,238,0.06)
        }
        .artifact-card:nth-child(9) .card-top span {
          text-shadow:0 0 16px rgba(103,151,238,0.07)
        }
        .artifact-card:nth-child(10) .card-top span {
          text-shadow:0 0 18px rgba(103,151,238,0.08)
        }
        .artifact-card:nth-child(11) .card-top span {
          text-shadow:0 0 20px rgba(103,151,238,0.09)
        }
        .artifact-card:nth-child(12) .card-top span {
          text-shadow:0 0 22px rgba(103,151,238,0.05)
        }
        .artifact-card:nth-child(1) .card-top span {
          text-shadow:0 0 24px rgba(103,151,238,0.06)
        }
        .artifact-card:nth-child(2) .card-top span {
          text-shadow:0 0 26px rgba(103,151,238,0.07)
        }
        .artifact-card:nth-child(3) .card-top span {
          text-shadow:0 0 28px rgba(103,151,238,0.08)
        }
        .artifact-card:nth-child(4) .card-top span {
          text-shadow:0 0 30px rgba(103,151,238,0.09)
        }
        .artifact-card:nth-child(5) .card-top span {
          text-shadow:0 0 16px rgba(103,151,238,0.05)
        }
        .artifact-card:nth-child(6) .card-top span {
          text-shadow:0 0 18px rgba(103,151,238,0.06)
        }
        .artifact-card:nth-child(7) .card-top span {
          text-shadow:0 0 20px rgba(103,151,238,0.07)
        }
        .artifact-card:nth-child(8) .card-top span {
          text-shadow:0 0 22px rgba(103,151,238,0.08)
        }
        .artifact-card:nth-child(9) .card-top span {
          text-shadow:0 0 24px rgba(103,151,238,0.09)
        }
        .artifact-card:nth-child(10) .card-top span {
          text-shadow:0 0 26px rgba(103,151,238,0.05)
        }
        .artifact-card:nth-child(11) .card-top span {
          text-shadow:0 0 28px rgba(103,151,238,0.06)
        }
        .artifact-card:nth-child(12) .card-top span {
          text-shadow:0 0 30px rgba(103,151,238,0.07)
        }
        .artifact-card:nth-child(1) .card-top span {
          text-shadow:0 0 16px rgba(103,151,238,0.08)
        }
        .artifact-card:nth-child(2) .card-top span {
          text-shadow:0 0 18px rgba(103,151,238,0.09)
        }
        .artifact-card:nth-child(3) .card-top span {
          text-shadow:0 0 20px rgba(103,151,238,0.05)
        }
        .artifact-card:nth-child(4) .card-top span {
          text-shadow:0 0 22px rgba(103,151,238,0.06)
        }
        .artifact-card:nth-child(5) .card-top span {
          text-shadow:0 0 24px rgba(103,151,238,0.07)
        }
        .artifact-card:nth-child(6) .card-top span {
          text-shadow:0 0 26px rgba(103,151,238,0.08)
        }
        .artifact-card:nth-child(7) .card-top span {
          text-shadow:0 0 28px rgba(103,151,238,0.09)
        }
        .artifact-card:nth-child(8) .card-top span {
          text-shadow:0 0 30px rgba(103,151,238,0.05)
        }
        .artifact-card:nth-child(9) .card-top span {
          text-shadow:0 0 16px rgba(103,151,238,0.06)
        }
        .artifact-card:nth-child(10) .card-top span {
          text-shadow:0 0 18px rgba(103,151,238,0.07)
        }
        .artifact-card:nth-child(11) .card-top span {
          text-shadow:0 0 20px rgba(103,151,238,0.08)
        }
        .artifact-card:nth-child(12) .card-top span {
          text-shadow:0 0 22px rgba(103,151,238,0.09)
        }
        .artifact-card:nth-child(1) .card-top span {
          text-shadow:0 0 24px rgba(103,151,238,0.05)
        }
        .artifact-card:nth-child(2) .card-top span {
          text-shadow:0 0 26px rgba(103,151,238,0.06)
        }
        .artifact-card:nth-child(3) .card-top span {
          text-shadow:0 0 28px rgba(103,151,238,0.07)
        }
        .artifact-card:nth-child(4) .card-top span {
          text-shadow:0 0 30px rgba(103,151,238,0.08)
        }
        .artifact-card:nth-child(5) .card-top span {
          text-shadow:0 0 16px rgba(103,151,238,0.09)
        }
        .artifact-card:nth-child(6) .card-top span {
          text-shadow:0 0 18px rgba(103,151,238,0.05)
        }
        .artifact-card:nth-child(7) .card-top span {
          text-shadow:0 0 20px rgba(103,151,238,0.06)
        }
        .artifact-card:nth-child(8) .card-top span {
          text-shadow:0 0 22px rgba(103,151,238,0.07)
        }
        .artifact-card:nth-child(9) .card-top span {
          text-shadow:0 0 24px rgba(103,151,238,0.08)
        }
        .artifact-card:nth-child(10) .card-top span {
          text-shadow:0 0 26px rgba(103,151,238,0.09)
        }
        .artifact-card:nth-child(11) .card-top span {
          text-shadow:0 0 28px rgba(103,151,238,0.05)
        }
        .artifact-card:nth-child(12) .card-top span {
          text-shadow:0 0 30px rgba(103,151,238,0.06)
        }
        .artifact-card:nth-child(1) .card-top span {
          text-shadow:0 0 16px rgba(103,151,238,0.07)
        }
        .artifact-card:nth-child(2) .card-top span {
          text-shadow:0 0 18px rgba(103,151,238,0.08)
        }
        .artifact-card:nth-child(3) .card-top span {
          text-shadow:0 0 20px rgba(103,151,238,0.09)
        }
        .artifact-card:nth-child(4) .card-top span {
          text-shadow:0 0 22px rgba(103,151,238,0.05)
        }
        .artifact-card:nth-child(5) .card-top span {
          text-shadow:0 0 24px rgba(103,151,238,0.06)
        }
        .artifact-card:nth-child(6) .card-top span {
          text-shadow:0 0 26px rgba(103,151,238,0.07)
        }
        .artifact-card:nth-child(7) .card-top span {
          text-shadow:0 0 28px rgba(103,151,238,0.08)
        }
        .artifact-card:nth-child(8) .card-top span {
          text-shadow:0 0 30px rgba(103,151,238,0.09)
        }
        .artifact-card:nth-child(9) .card-top span {
          text-shadow:0 0 16px rgba(103,151,238,0.05)
        }
        .artifact-card:nth-child(10) .card-top span {
          text-shadow:0 0 18px rgba(103,151,238,0.06)
        }
        .artifact-card:nth-child(11) .card-top span {
          text-shadow:0 0 20px rgba(103,151,238,0.07)
        }
        .artifact-card:nth-child(12) .card-top span {
          text-shadow:0 0 22px rgba(103,151,238,0.08)
        }
        .artifact-card:nth-child(1) .card-top span {
          text-shadow:0 0 24px rgba(103,151,238,0.09)
        }
        .artifact-card:nth-child(2) .card-top span {
          text-shadow:0 0 26px rgba(103,151,238,0.05)
        }
        .artifact-card:nth-child(3) .card-top span {
          text-shadow:0 0 28px rgba(103,151,238,0.06)
        }
        .artifact-card:nth-child(4) .card-top span {
          text-shadow:0 0 30px rgba(103,151,238,0.07)
        }
        .artifact-card:nth-child(5) .card-top span {
          text-shadow:0 0 16px rgba(103,151,238,0.08)
        }
        .artifact-card:nth-child(6) .card-top span {
          text-shadow:0 0 18px rgba(103,151,238,0.09)
        }
        .artifact-card:nth-child(7) .card-top span {
          text-shadow:0 0 20px rgba(103,151,238,0.05)
        }
        .artifact-card:nth-child(8) .card-top span {
          text-shadow:0 0 22px rgba(103,151,238,0.06)
        }
        .artifact-card:nth-child(9) .card-top span {
          text-shadow:0 0 24px rgba(103,151,238,0.07)
        }
        .artifact-card:nth-child(10) .card-top span {
          text-shadow:0 0 26px rgba(103,151,238,0.08)
        }
        .artifact-card:nth-child(11) .card-top span {
          text-shadow:0 0 28px rgba(103,151,238,0.09)
        }
        .artifact-card:nth-child(12) .card-top span {
          text-shadow:0 0 30px rgba(103,151,238,0.05)
        }
        .artifact-card:nth-child(1) .card-top span {
          text-shadow:0 0 16px rgba(103,151,238,0.06)
        }
        .artifact-card:nth-child(2) .card-top span {
          text-shadow:0 0 18px rgba(103,151,238,0.07)
        }
        .artifact-card:nth-child(3) .card-top span {
          text-shadow:0 0 20px rgba(103,151,238,0.08)
        }
        .artifact-card:nth-child(4) .card-top span {
          text-shadow:0 0 22px rgba(103,151,238,0.09)
        }
        .artifact-card:nth-child(5) .card-top span {
          text-shadow:0 0 24px rgba(103,151,238,0.05)
        }
      `}</style>
    </main>
  );
}
