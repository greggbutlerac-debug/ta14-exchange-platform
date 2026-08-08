
"use client";

import Link from "next/link";
import {
  ChangeEvent,
  DragEvent,
  KeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import {
  ARTIFACT_ENGINE_VERSION,
  CHAIN_LINKS,
  DETERMINATIONS,
  GOVERNANCE_ARTIFACT_PROFILES,
  REASON_CODES,
  canonicalStringify,
  createArtifactId,
  createDefaultGateSequence,
} from "../../../lib/execution-artifacts/canonical-artifact-engine";
import { createClient } from "../../../lib/supabase/client";

type WorkspaceTab =
  | "command"
  | "scenario"
  | "route"
  | "evidence"
  | "authority"
  | "continuity"
  | "admissibility"
  | "runtime"
  | "commit"
  | "execution"
  | "outcome"
  | "integrity"
  | "review"
  | "publication"
  | "timeline"
  | "diff"
  | "templates"
  | "reports";

type Determination = (typeof DETERMINATIONS)[number];
type ChainLink = (typeof CHAIN_LINKS)[number];
type GateStatus = "PENDING" | "PASS" | "FAIL" | "UNRESOLVED" | "NOT_APPLICABLE";
type Disclosure = "PUBLIC" | "SELECTIVE" | "RESTRICTED" | "WITHHELD";
type EvidenceState = "DRAFT" | "ADMITTED" | "REJECTED" | "CONDITIONAL" | "EXPIRED";
type AuthorityState = "VALID" | "MISSING" | "EXPIRED" | "REVOKED" | "OUT_OF_SCOPE" | "CONFLICTED";
type PublicationState = "DRAFT" | "INTERNAL_REVIEW" | "READY" | "PUBLISHED" | "CHALLENGED" | "CORRECTED" | "SUPERSEDED" | "WITHDRAWN";

type ScenarioForm = {
  title: string;
  seriesId: string;
  sequence: number;
  classification: string;
  primaryGovernance: string;
  sector: string;
  jurisdiction: string;
  proposedAction: string;
  consequenceAtStake: string;
  affectedSubjects: string;
  environment: string;
  intendedDestination: string;
  amountOrQuantity: string;
  requestedModel: string;
  requestedTool: string;
  assumptions: string;
  declaredLimits: string;
  simulated: boolean;
};

type RouteForm = {
  routeId: string;
  routeTitle: string;
  routeVersion: string;
  jurisdictionProfile: string;
  policyBasis: string;
  permittedModels: string;
  permittedTools: string;
  permittedDestinations: string;
  revalidationTriggers: string;
};

type RegisteredGovernanceHandoff = {
  registrationId: string;
  organizationName: string;
  architectureName: string;
  version: string;
  status: "REGISTERED" | "REVIEW_REQUIRED" | "SUSPENDED";
  sectors: string[];
  jurisdictions: string[];
  supportedDeterminations: Determination[];
  routeCount: number;
  artifactCount: number;
  verificationLevel: number;
};

type RouteStudioHandoff = {
  handoffVersion: "2.0";
  createdAt: string;
  governance: RegisteredGovernanceHandoff;
  route: {
    rid: string | null;
    name: string;
    domain: string;
    owner: string;
    version: number;
    selectedStage: string;
    stageDeclarations: Record<string, string | undefined>;
    decision: Determination | null;
    receiptId: string | null;
    correlationId: string | null;
  };
  scope: {
    sector: string;
    jurisdiction: string;
    classification: "DEMONSTRATION" | "PRODUCTION_CANDIDATE";
  };
};

type GovernanceBinding = {
  registrationId: string;
  organizationName: string;
  architectureName: string;
  architectureVersion: string;
  registrationStatus: RegisteredGovernanceHandoff["status"] | "UNBOUND";
  verificationLevel: number;
  sourceHandoffAt: string;
  routeOwner: string;
  routeDomain: string;
  selectedStage: string;
  sourceRouteReceiptId: string;
  correlationId: string;
};

type RegistryBindingRecord = {
  id: string;
  governanceName: string;
  shortName: string | null;
  organizationName: string | null;
  currentSteward: string | null;
  currentVersion: string;
  category: string;
  status: string;
  registryIdentifier: string | null;
  registrationState?: string | null;
  needsAttention?: boolean;
};

type RegistryBindingResponse = {
  records?: RegistryBindingRecord[];
  message?: string;
};

type EvidenceDraft = {
  id: string;
  title: string;
  description: string;
  sourceType: string;
  sourceName: string;
  sourceUri: string;
  capturedAt: string;
  validUntil: string;
  custody: string;
  freshnessHours: number;
  hash: string;
  disclosure: Disclosure;
  state: EvidenceState;
  notes: string;
};

type AuthorityDraft = {
  id: string;
  actor: string;
  role: string;
  organization: string;
  authoritySource: string;
  scope: string;
  delegatedBy: string;
  validFrom: string;
  validUntil: string;
  state: AuthorityState;
  conflict: string;
  notes: string;
};

type GateDraft = {
  id: string;
  sequence: number;
  chainLink: ChainLink;
  title: string;
  requirement: string;
  status: GateStatus;
  reasonCode: string;
  inputSummary: string;
  resultSummary: string;
  mandatory: boolean;
};

type ExecutionDraft = {
  adapterId: string;
  adapterVersion: string;
  requestedAction: string;
  expectedEffect: string;
  actualEffect: string;
  technicalStatusCode: string;
  technicalMessage: string;
  receiptId: string;
  receiptHash: string;
  bypassDetected: boolean;
  rollbackPerformed: boolean;
};

type OutcomeDraft = {
  actualResult: string;
  consequenceState: string;
  closureEvidence: string;
  residualRisk: string;
  correctiveAction: string;
  independentlyVerified: boolean;
  verifier: string;
  verifiedAt: string;
};

type StudioSnapshot = {
  governance: GovernanceBinding;
  scenario: ScenarioForm;
  route: RouteForm;
  evidence: EvidenceDraft[];
  authorities: AuthorityDraft[];
  gates: GateDraft[];
  determination: Determination;
  commitReason: string;
  execution: ExecutionDraft;
  outcome: OutcomeDraft;
  publicationState: PublicationState;
  proves: string;
  doesNotProve: string;
  updatedAt: string;
};

type ControlPattern = {
  id: string;
  domain: string;
  severity: string;
  title: string;
  description: string;
  repair: string;
  tags: string[];
};

type EvidenceTemplate = {
  id: string;
  title: string;
  category: string;
  requiredFields: string[];
  admissibilityQuestion: string;
  defaultDisclosure: Disclosure;
  notes: string;
};

type RouteTemplate = {
  id: string;
  name: string;
  sector: string;
  expectedDetermination: Determination;
  gateCount: number;
  version: string;
  consequenceClass: string;
  description: string;
};

const STORAGE_KEY = "ta14.execution-artifact-studio.v2";
const ROUTE_STUDIO_HANDOFF_KEY = "ta14:registered-governance-route-handoff:v2";
const AUTOSAVE_DELAY = 650;
const nowLocal = () => new Date().toISOString().slice(0, 16);
const makeId = (prefix: string) => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`.toUpperCase();

const defaultGovernanceBinding: GovernanceBinding = {
  registrationId: "UNBOUND",
  organizationName: "No registered governance selected",
  architectureName: "Unbound governance architecture",
  architectureVersion: "",
  registrationStatus: "UNBOUND",
  verificationLevel: 0,
  sourceHandoffAt: "",
  routeOwner: "",
  routeDomain: "",
  selectedStage: "",
  sourceRouteReceiptId: "",
  correlationId: "",
};

const defaultScenario: ScenarioForm = {
  title: "Authorized release with verified outcome",
  seriesId: "TA14-CANONICAL-FOUNDING",
  sequence: 1,
  classification: "CANONICAL EXECUTION PROOF",
  primaryGovernance: "Execution Governance",
  sector: "Cross-sector",
  jurisdiction: "TA-14 Institutional Demonstration Environment",
  proposedAction: "Release a bounded execution request after every mandatory condition survives review.",
  consequenceAtStake: "A consequential action may bind to reality only within the exact authorized scope.",
  affectedSubjects: "TA-14 demonstration environment; designated reviewer; controlled execution target",
  environment: "Controlled, auditable, fail-closed demonstration environment",
  intendedDestination: "TA-14 reference execution adapter",
  amountOrQuantity: "One bounded action",
  requestedModel: "TA-14 Reference Runtime",
  requestedTool: "Canonical Execution Adapter",
  assumptions: "All demonstration data is explicitly labeled; no production system is affected.",
  declaredLimits: "This record proves the bounded event only; it does not certify every future execution.",
  simulated: true,
};

const defaultRoute: RouteForm = {
  routeId: "TA14-ROUTE-CANONICAL-ALLOW-001",
  routeTitle: "Canonical Authorized Release Route",
  routeVersion: "1.0.0",
  jurisdictionProfile: "TA-14 institutional demonstration profile",
  policyBasis: "No admissible evidence. No admissible execution.\nCommit before action.\nFail closed on unresolved mandatory conditions.",
  permittedModels: "TA-14 Reference Runtime",
  permittedTools: "Canonical Execution Adapter",
  permittedDestinations: "TA-14 reference execution adapter",
  revalidationTriggers: "Evidence expiry; authority change; route version change; destination change; model change; threshold change",
};

const defaultEvidence: EvidenceDraft[] = [
  {
    id: "EVIDENCE-001",
    title: "Proposed action declaration",
    description: "Bounded description of the requested action and consequence at stake.",
    sourceType: "DECLARATION",
    sourceName: "Scenario author",
    sourceUri: "ta14://artifact-studio/scenario",
    capturedAt: nowLocal(),
    validUntil: "",
    custody: "Captured directly in Artifact Studio; append-only after commit.",
    freshnessHours: 24,
    hash: "PENDING-CANONICALIZATION",
    disclosure: "PUBLIC",
    state: "ADMITTED",
    notes: "Required for the Reality and Record links.",
  },
  {
    id: "EVIDENCE-002",
    title: "Route configuration snapshot",
    description: "Frozen route identity, gate order, thresholds, and revalidation triggers.",
    sourceType: "SYSTEM_RECORD",
    sourceName: "TA-14 route resolver",
    sourceUri: "ta14://artifact-studio/route",
    capturedAt: nowLocal(),
    validUntil: "",
    custody: "Generated from the active route configuration and frozen at commit.",
    freshnessHours: 1,
    hash: "PENDING-CANONICALIZATION",
    disclosure: "PUBLIC",
    state: "ADMITTED",
    notes: "Route parity must survive PDF, JSON, manifest, and inspection-page export.",
  },
];

const defaultAuthorities: AuthorityDraft[] = [
  {
    id: "AUTHORITY-001",
    actor: "TA-14 Artifact Steward",
    role: "Artifact Steward",
    organization: "TA-14 Authority",
    authoritySource: "TA-14 institutional artifact publication mandate",
    scope: "Create, review, commit, package, and publish controlled demonstration artifacts",
    delegatedBy: "TA-14 Authority",
    validFrom: nowLocal(),
    validUntil: "",
    state: "VALID",
    conflict: "None declared",
    notes: "Authority is bounded to the controlled demonstration environment.",
  },
];

const defaultGates: GateDraft[] = createDefaultGateSequence().map((gate, index) => ({
  id: gate.gateId,
  sequence: index + 1,
  chainLink: gate.chainLink,
  title: gate.title,
  requirement: gate.requirement,
  status: "PENDING",
  reasonCode: "",
  inputSummary: "Awaiting evaluation",
  resultSummary: "Not yet evaluated",
  mandatory: gate.requirementLevel === "MANDATORY",
}));

const defaultExecution: ExecutionDraft = {
  adapterId: "TA14-REFERENCE-ADAPTER",
  adapterVersion: "1.0.0",
  requestedAction: "Release the exact committed action to the controlled destination.",
  expectedEffect: "RELEASED",
  actualEffect: "NO_ACTION",
  technicalStatusCode: "",
  technicalMessage: "Execution has not been invoked.",
  receiptId: "",
  receiptHash: "",
  bypassDetected: false,
  rollbackPerformed: false,
};

const defaultOutcome: OutcomeDraft = {
  actualResult: "",
  consequenceState: "NOT_CLOSED",
  closureEvidence: "",
  residualRisk: "",
  correctiveAction: "",
  independentlyVerified: false,
  verifier: "",
  verifiedAt: "",
};

const initialSnapshot: StudioSnapshot = {
  governance: defaultGovernanceBinding,
  scenario: defaultScenario,
  route: defaultRoute,
  evidence: defaultEvidence,
  authorities: defaultAuthorities,
  gates: defaultGates,
  determination: "HOLD",
  commitReason: "Artifact remains held until every mandatory gate is evaluated and a commit is explicitly fixed.",
  execution: defaultExecution,
  outcome: defaultOutcome,
  publicationState: "DRAFT",
  proves: "When complete, this artifact will prove that the recorded determination technically controlled the bounded action path.",
  doesNotProve: "It will not prove universal performance, regulatory certification, or behavior outside the preserved route and event.",
  updatedAt: new Date().toISOString(),
};

function isRouteStudioHandoff(value: unknown): value is RouteStudioHandoff {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<RouteStudioHandoff>;
  return candidate.handoffVersion === "2.0"
    && typeof candidate.createdAt === "string"
    && Boolean(candidate.governance?.registrationId)
    && Boolean(candidate.governance?.organizationName)
    && Boolean(candidate.route?.name)
    && Boolean(candidate.scope?.sector)
    && Boolean(candidate.scope?.jurisdiction);
}

function applyRouteStudioHandoff(base: StudioSnapshot, handoff: RouteStudioHandoff): StudioSnapshot {
  const stageDeclarations = Object.entries(handoff.route.stageDeclarations)
    .filter(([, value]) => typeof value === "string" && value.trim().length > 0)
    .map(([stage, value]) => `${stage.toUpperCase()}: ${value!.trim()}`)
    .join("\n");
  const routeId = handoff.route.rid?.trim() || `PENDING-${handoff.governance.registrationId}-${handoff.route.version}`;
  const decision = handoff.route.decision ?? base.determination;
  const simulated = handoff.scope.classification === "DEMONSTRATION";

  return {
    ...base,
    governance: {
      registrationId: handoff.governance.registrationId,
      organizationName: handoff.governance.organizationName,
      architectureName: handoff.governance.architectureName,
      architectureVersion: handoff.governance.version,
      registrationStatus: handoff.governance.status,
      verificationLevel: handoff.governance.verificationLevel,
      sourceHandoffAt: handoff.createdAt,
      routeOwner: handoff.route.owner,
      routeDomain: handoff.route.domain,
      selectedStage: handoff.route.selectedStage,
      sourceRouteReceiptId: handoff.route.receiptId ?? "",
      correlationId: handoff.route.correlationId ?? "",
    },
    scenario: {
      ...base.scenario,
      title: `${handoff.route.name} execution artifact`,
      classification: handoff.scope.classification === "DEMONSTRATION"
        ? "REGISTERED GOVERNANCE DEMONSTRATION"
        : "REGISTERED GOVERNANCE PRODUCTION CANDIDATE",
      primaryGovernance: `${handoff.governance.organizationName} — ${handoff.governance.architectureName} v${handoff.governance.version}`,
      sector: handoff.scope.sector,
      jurisdiction: handoff.scope.jurisdiction,
      proposedAction: handoff.route.stageDeclarations.execution?.trim()
        || handoff.route.stageDeclarations.reality?.trim()
        || base.scenario.proposedAction,
      consequenceAtStake: handoff.route.stageDeclarations.outcome?.trim()
        || base.scenario.consequenceAtStake,
      assumptions: [
        base.scenario.assumptions,
        `Registered governance: ${handoff.governance.registrationId}.`,
        `Architecture: ${handoff.governance.architectureName} v${handoff.governance.version}.`,
        `Route classification: ${handoff.scope.classification}.`,
      ].filter(Boolean).join("\n"),
      simulated,
    },
    route: {
      ...base.route,
      routeId,
      routeTitle: handoff.route.name,
      routeVersion: String(handoff.route.version),
      jurisdictionProfile: `${handoff.scope.jurisdiction} / ${handoff.scope.sector}`,
      policyBasis: stageDeclarations || base.route.policyBasis,
      revalidationTriggers: handoff.route.stageDeclarations.continuity?.trim()
        || base.route.revalidationTriggers,
    },
    determination: decision,
    commitReason: handoff.route.decision
      ? `Imported route determination ${handoff.route.decision}. The Artifact Studio must independently validate every mandatory gate before artifact commitment or execution.`
      : "Imported route context has no final determination. The Artifact Studio must evaluate and commit the bounded record before action.",
    execution: {
      ...base.execution,
      requestedAction: handoff.route.stageDeclarations.execution?.trim()
        || base.execution.requestedAction,
      expectedEffect: expectedEffect(decision),
      technicalMessage: handoff.route.receiptId
        ? `Source route receipt ${handoff.route.receiptId} imported as route evidence. It is not an artifact execution receipt.`
        : "Registered governance route context imported. Artifact execution has not been invoked.",
    },
    proves: `When completed, this artifact will prove how registered governance ${handoff.governance.registrationId} governed the bounded route ${routeId}.`,
    doesNotProve: "Route import does not itself prove admissibility, execution control, outcome closure, certification, or universal governance performance.",
    updatedAt: new Date().toISOString(),
  };
}

const controlPatterns: ControlPattern[] = [
  {
    id: "STUDIO-CONTROL-001",
    domain: "RECORD",
    severity: "WARNING",
    title: "Institutional control pattern 001",
    description: "Reusable control pattern 001 for evaluating record integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "record", "control-001"],
  },
  {
    id: "STUDIO-CONTROL-002",
    domain: "CONTINUITY",
    severity: "BLOCKING",
    title: "Institutional control pattern 002",
    description: "Reusable control pattern 002 for evaluating continuity integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "continuity", "control-002"],
  },
  {
    id: "STUDIO-CONTROL-003",
    domain: "ADMISSIBILITY",
    severity: "CRITICAL",
    title: "Institutional control pattern 003",
    description: "Reusable control pattern 003 for evaluating admissibility integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "admissibility", "control-003"],
  },
  {
    id: "STUDIO-CONTROL-004",
    domain: "BINDING",
    severity: "INFO",
    title: "Institutional control pattern 004",
    description: "Reusable control pattern 004 for evaluating binding integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "binding", "control-004"],
  },
  {
    id: "STUDIO-CONTROL-005",
    domain: "COMMIT",
    severity: "WARNING",
    title: "Institutional control pattern 005",
    description: "Reusable control pattern 005 for evaluating commit integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "commit", "control-005"],
  },
  {
    id: "STUDIO-CONTROL-006",
    domain: "EXECUTION",
    severity: "BLOCKING",
    title: "Institutional control pattern 006",
    description: "Reusable control pattern 006 for evaluating execution integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "execution", "control-006"],
  },
  {
    id: "STUDIO-CONTROL-007",
    domain: "OUTCOME",
    severity: "CRITICAL",
    title: "Institutional control pattern 007",
    description: "Reusable control pattern 007 for evaluating outcome integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "outcome", "control-007"],
  },
  {
    id: "STUDIO-CONTROL-008",
    domain: "REALITY",
    severity: "INFO",
    title: "Institutional control pattern 008",
    description: "Reusable control pattern 008 for evaluating reality integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "reality", "control-008"],
  },
  {
    id: "STUDIO-CONTROL-009",
    domain: "RECORD",
    severity: "WARNING",
    title: "Institutional control pattern 009",
    description: "Reusable control pattern 009 for evaluating record integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "record", "control-009"],
  },
  {
    id: "STUDIO-CONTROL-010",
    domain: "CONTINUITY",
    severity: "BLOCKING",
    title: "Institutional control pattern 010",
    description: "Reusable control pattern 010 for evaluating continuity integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "continuity", "control-010"],
  },
  {
    id: "STUDIO-CONTROL-011",
    domain: "ADMISSIBILITY",
    severity: "CRITICAL",
    title: "Institutional control pattern 011",
    description: "Reusable control pattern 011 for evaluating admissibility integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "admissibility", "control-011"],
  },
  {
    id: "STUDIO-CONTROL-012",
    domain: "BINDING",
    severity: "INFO",
    title: "Institutional control pattern 012",
    description: "Reusable control pattern 012 for evaluating binding integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "binding", "control-012"],
  },
  {
    id: "STUDIO-CONTROL-013",
    domain: "COMMIT",
    severity: "WARNING",
    title: "Institutional control pattern 013",
    description: "Reusable control pattern 013 for evaluating commit integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "commit", "control-013"],
  },
  {
    id: "STUDIO-CONTROL-014",
    domain: "EXECUTION",
    severity: "BLOCKING",
    title: "Institutional control pattern 014",
    description: "Reusable control pattern 014 for evaluating execution integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "execution", "control-014"],
  },
  {
    id: "STUDIO-CONTROL-015",
    domain: "OUTCOME",
    severity: "CRITICAL",
    title: "Institutional control pattern 015",
    description: "Reusable control pattern 015 for evaluating outcome integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "outcome", "control-015"],
  },
  {
    id: "STUDIO-CONTROL-016",
    domain: "REALITY",
    severity: "INFO",
    title: "Institutional control pattern 016",
    description: "Reusable control pattern 016 for evaluating reality integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "reality", "control-016"],
  },
  {
    id: "STUDIO-CONTROL-017",
    domain: "RECORD",
    severity: "WARNING",
    title: "Institutional control pattern 017",
    description: "Reusable control pattern 017 for evaluating record integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "record", "control-017"],
  },
  {
    id: "STUDIO-CONTROL-018",
    domain: "CONTINUITY",
    severity: "BLOCKING",
    title: "Institutional control pattern 018",
    description: "Reusable control pattern 018 for evaluating continuity integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "continuity", "control-018"],
  },
  {
    id: "STUDIO-CONTROL-019",
    domain: "ADMISSIBILITY",
    severity: "CRITICAL",
    title: "Institutional control pattern 019",
    description: "Reusable control pattern 019 for evaluating admissibility integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "admissibility", "control-019"],
  },
  {
    id: "STUDIO-CONTROL-020",
    domain: "BINDING",
    severity: "INFO",
    title: "Institutional control pattern 020",
    description: "Reusable control pattern 020 for evaluating binding integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "binding", "control-020"],
  },
  {
    id: "STUDIO-CONTROL-021",
    domain: "COMMIT",
    severity: "WARNING",
    title: "Institutional control pattern 021",
    description: "Reusable control pattern 021 for evaluating commit integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "commit", "control-021"],
  },
  {
    id: "STUDIO-CONTROL-022",
    domain: "EXECUTION",
    severity: "BLOCKING",
    title: "Institutional control pattern 022",
    description: "Reusable control pattern 022 for evaluating execution integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "execution", "control-022"],
  },
  {
    id: "STUDIO-CONTROL-023",
    domain: "OUTCOME",
    severity: "CRITICAL",
    title: "Institutional control pattern 023",
    description: "Reusable control pattern 023 for evaluating outcome integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "outcome", "control-023"],
  },
  {
    id: "STUDIO-CONTROL-024",
    domain: "REALITY",
    severity: "INFO",
    title: "Institutional control pattern 024",
    description: "Reusable control pattern 024 for evaluating reality integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "reality", "control-024"],
  },
  {
    id: "STUDIO-CONTROL-025",
    domain: "RECORD",
    severity: "WARNING",
    title: "Institutional control pattern 025",
    description: "Reusable control pattern 025 for evaluating record integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "record", "control-025"],
  },
  {
    id: "STUDIO-CONTROL-026",
    domain: "CONTINUITY",
    severity: "BLOCKING",
    title: "Institutional control pattern 026",
    description: "Reusable control pattern 026 for evaluating continuity integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "continuity", "control-026"],
  },
  {
    id: "STUDIO-CONTROL-027",
    domain: "ADMISSIBILITY",
    severity: "CRITICAL",
    title: "Institutional control pattern 027",
    description: "Reusable control pattern 027 for evaluating admissibility integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "admissibility", "control-027"],
  },
  {
    id: "STUDIO-CONTROL-028",
    domain: "BINDING",
    severity: "INFO",
    title: "Institutional control pattern 028",
    description: "Reusable control pattern 028 for evaluating binding integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "binding", "control-028"],
  },
  {
    id: "STUDIO-CONTROL-029",
    domain: "COMMIT",
    severity: "WARNING",
    title: "Institutional control pattern 029",
    description: "Reusable control pattern 029 for evaluating commit integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "commit", "control-029"],
  },
  {
    id: "STUDIO-CONTROL-030",
    domain: "EXECUTION",
    severity: "BLOCKING",
    title: "Institutional control pattern 030",
    description: "Reusable control pattern 030 for evaluating execution integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "execution", "control-030"],
  },
  {
    id: "STUDIO-CONTROL-031",
    domain: "OUTCOME",
    severity: "CRITICAL",
    title: "Institutional control pattern 031",
    description: "Reusable control pattern 031 for evaluating outcome integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "outcome", "control-031"],
  },
  {
    id: "STUDIO-CONTROL-032",
    domain: "REALITY",
    severity: "INFO",
    title: "Institutional control pattern 032",
    description: "Reusable control pattern 032 for evaluating reality integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "reality", "control-032"],
  },
  {
    id: "STUDIO-CONTROL-033",
    domain: "RECORD",
    severity: "WARNING",
    title: "Institutional control pattern 033",
    description: "Reusable control pattern 033 for evaluating record integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "record", "control-033"],
  },
  {
    id: "STUDIO-CONTROL-034",
    domain: "CONTINUITY",
    severity: "BLOCKING",
    title: "Institutional control pattern 034",
    description: "Reusable control pattern 034 for evaluating continuity integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "continuity", "control-034"],
  },
  {
    id: "STUDIO-CONTROL-035",
    domain: "ADMISSIBILITY",
    severity: "CRITICAL",
    title: "Institutional control pattern 035",
    description: "Reusable control pattern 035 for evaluating admissibility integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "admissibility", "control-035"],
  },
  {
    id: "STUDIO-CONTROL-036",
    domain: "BINDING",
    severity: "INFO",
    title: "Institutional control pattern 036",
    description: "Reusable control pattern 036 for evaluating binding integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "binding", "control-036"],
  },
  {
    id: "STUDIO-CONTROL-037",
    domain: "COMMIT",
    severity: "WARNING",
    title: "Institutional control pattern 037",
    description: "Reusable control pattern 037 for evaluating commit integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "commit", "control-037"],
  },
  {
    id: "STUDIO-CONTROL-038",
    domain: "EXECUTION",
    severity: "BLOCKING",
    title: "Institutional control pattern 038",
    description: "Reusable control pattern 038 for evaluating execution integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "execution", "control-038"],
  },
  {
    id: "STUDIO-CONTROL-039",
    domain: "OUTCOME",
    severity: "CRITICAL",
    title: "Institutional control pattern 039",
    description: "Reusable control pattern 039 for evaluating outcome integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "outcome", "control-039"],
  },
  {
    id: "STUDIO-CONTROL-040",
    domain: "REALITY",
    severity: "INFO",
    title: "Institutional control pattern 040",
    description: "Reusable control pattern 040 for evaluating reality integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "reality", "control-040"],
  },
  {
    id: "STUDIO-CONTROL-041",
    domain: "RECORD",
    severity: "WARNING",
    title: "Institutional control pattern 041",
    description: "Reusable control pattern 041 for evaluating record integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "record", "control-041"],
  },
  {
    id: "STUDIO-CONTROL-042",
    domain: "CONTINUITY",
    severity: "BLOCKING",
    title: "Institutional control pattern 042",
    description: "Reusable control pattern 042 for evaluating continuity integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "continuity", "control-042"],
  },
  {
    id: "STUDIO-CONTROL-043",
    domain: "ADMISSIBILITY",
    severity: "CRITICAL",
    title: "Institutional control pattern 043",
    description: "Reusable control pattern 043 for evaluating admissibility integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "admissibility", "control-043"],
  },
  {
    id: "STUDIO-CONTROL-044",
    domain: "BINDING",
    severity: "INFO",
    title: "Institutional control pattern 044",
    description: "Reusable control pattern 044 for evaluating binding integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "binding", "control-044"],
  },
  {
    id: "STUDIO-CONTROL-045",
    domain: "COMMIT",
    severity: "WARNING",
    title: "Institutional control pattern 045",
    description: "Reusable control pattern 045 for evaluating commit integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "commit", "control-045"],
  },
  {
    id: "STUDIO-CONTROL-046",
    domain: "EXECUTION",
    severity: "BLOCKING",
    title: "Institutional control pattern 046",
    description: "Reusable control pattern 046 for evaluating execution integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "execution", "control-046"],
  },
  {
    id: "STUDIO-CONTROL-047",
    domain: "OUTCOME",
    severity: "CRITICAL",
    title: "Institutional control pattern 047",
    description: "Reusable control pattern 047 for evaluating outcome integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "outcome", "control-047"],
  },
  {
    id: "STUDIO-CONTROL-048",
    domain: "REALITY",
    severity: "INFO",
    title: "Institutional control pattern 048",
    description: "Reusable control pattern 048 for evaluating reality integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "reality", "control-048"],
  },
  {
    id: "STUDIO-CONTROL-049",
    domain: "RECORD",
    severity: "WARNING",
    title: "Institutional control pattern 049",
    description: "Reusable control pattern 049 for evaluating record integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "record", "control-049"],
  },
  {
    id: "STUDIO-CONTROL-050",
    domain: "CONTINUITY",
    severity: "BLOCKING",
    title: "Institutional control pattern 050",
    description: "Reusable control pattern 050 for evaluating continuity integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "continuity", "control-050"],
  },
  {
    id: "STUDIO-CONTROL-051",
    domain: "ADMISSIBILITY",
    severity: "CRITICAL",
    title: "Institutional control pattern 051",
    description: "Reusable control pattern 051 for evaluating admissibility integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "admissibility", "control-051"],
  },
  {
    id: "STUDIO-CONTROL-052",
    domain: "BINDING",
    severity: "INFO",
    title: "Institutional control pattern 052",
    description: "Reusable control pattern 052 for evaluating binding integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "binding", "control-052"],
  },
  {
    id: "STUDIO-CONTROL-053",
    domain: "COMMIT",
    severity: "WARNING",
    title: "Institutional control pattern 053",
    description: "Reusable control pattern 053 for evaluating commit integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "commit", "control-053"],
  },
  {
    id: "STUDIO-CONTROL-054",
    domain: "EXECUTION",
    severity: "BLOCKING",
    title: "Institutional control pattern 054",
    description: "Reusable control pattern 054 for evaluating execution integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "execution", "control-054"],
  },
  {
    id: "STUDIO-CONTROL-055",
    domain: "OUTCOME",
    severity: "CRITICAL",
    title: "Institutional control pattern 055",
    description: "Reusable control pattern 055 for evaluating outcome integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "outcome", "control-055"],
  },
  {
    id: "STUDIO-CONTROL-056",
    domain: "REALITY",
    severity: "INFO",
    title: "Institutional control pattern 056",
    description: "Reusable control pattern 056 for evaluating reality integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "reality", "control-056"],
  },
  {
    id: "STUDIO-CONTROL-057",
    domain: "RECORD",
    severity: "WARNING",
    title: "Institutional control pattern 057",
    description: "Reusable control pattern 057 for evaluating record integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "record", "control-057"],
  },
  {
    id: "STUDIO-CONTROL-058",
    domain: "CONTINUITY",
    severity: "BLOCKING",
    title: "Institutional control pattern 058",
    description: "Reusable control pattern 058 for evaluating continuity integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "continuity", "control-058"],
  },
  {
    id: "STUDIO-CONTROL-059",
    domain: "ADMISSIBILITY",
    severity: "CRITICAL",
    title: "Institutional control pattern 059",
    description: "Reusable control pattern 059 for evaluating admissibility integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "admissibility", "control-059"],
  },
  {
    id: "STUDIO-CONTROL-060",
    domain: "BINDING",
    severity: "INFO",
    title: "Institutional control pattern 060",
    description: "Reusable control pattern 060 for evaluating binding integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "binding", "control-060"],
  },
  {
    id: "STUDIO-CONTROL-061",
    domain: "COMMIT",
    severity: "WARNING",
    title: "Institutional control pattern 061",
    description: "Reusable control pattern 061 for evaluating commit integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "commit", "control-061"],
  },
  {
    id: "STUDIO-CONTROL-062",
    domain: "EXECUTION",
    severity: "BLOCKING",
    title: "Institutional control pattern 062",
    description: "Reusable control pattern 062 for evaluating execution integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "execution", "control-062"],
  },
  {
    id: "STUDIO-CONTROL-063",
    domain: "OUTCOME",
    severity: "CRITICAL",
    title: "Institutional control pattern 063",
    description: "Reusable control pattern 063 for evaluating outcome integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "outcome", "control-063"],
  },
  {
    id: "STUDIO-CONTROL-064",
    domain: "REALITY",
    severity: "INFO",
    title: "Institutional control pattern 064",
    description: "Reusable control pattern 064 for evaluating reality integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "reality", "control-064"],
  },
  {
    id: "STUDIO-CONTROL-065",
    domain: "RECORD",
    severity: "WARNING",
    title: "Institutional control pattern 065",
    description: "Reusable control pattern 065 for evaluating record integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "record", "control-065"],
  },
  {
    id: "STUDIO-CONTROL-066",
    domain: "CONTINUITY",
    severity: "BLOCKING",
    title: "Institutional control pattern 066",
    description: "Reusable control pattern 066 for evaluating continuity integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "continuity", "control-066"],
  },
  {
    id: "STUDIO-CONTROL-067",
    domain: "ADMISSIBILITY",
    severity: "CRITICAL",
    title: "Institutional control pattern 067",
    description: "Reusable control pattern 067 for evaluating admissibility integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "admissibility", "control-067"],
  },
  {
    id: "STUDIO-CONTROL-068",
    domain: "BINDING",
    severity: "INFO",
    title: "Institutional control pattern 068",
    description: "Reusable control pattern 068 for evaluating binding integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "binding", "control-068"],
  },
  {
    id: "STUDIO-CONTROL-069",
    domain: "COMMIT",
    severity: "WARNING",
    title: "Institutional control pattern 069",
    description: "Reusable control pattern 069 for evaluating commit integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "commit", "control-069"],
  },
  {
    id: "STUDIO-CONTROL-070",
    domain: "EXECUTION",
    severity: "BLOCKING",
    title: "Institutional control pattern 070",
    description: "Reusable control pattern 070 for evaluating execution integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "execution", "control-070"],
  },
  {
    id: "STUDIO-CONTROL-071",
    domain: "OUTCOME",
    severity: "CRITICAL",
    title: "Institutional control pattern 071",
    description: "Reusable control pattern 071 for evaluating outcome integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "outcome", "control-071"],
  },
  {
    id: "STUDIO-CONTROL-072",
    domain: "REALITY",
    severity: "INFO",
    title: "Institutional control pattern 072",
    description: "Reusable control pattern 072 for evaluating reality integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "reality", "control-072"],
  },
  {
    id: "STUDIO-CONTROL-073",
    domain: "RECORD",
    severity: "WARNING",
    title: "Institutional control pattern 073",
    description: "Reusable control pattern 073 for evaluating record integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "record", "control-073"],
  },
  {
    id: "STUDIO-CONTROL-074",
    domain: "CONTINUITY",
    severity: "BLOCKING",
    title: "Institutional control pattern 074",
    description: "Reusable control pattern 074 for evaluating continuity integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "continuity", "control-074"],
  },
  {
    id: "STUDIO-CONTROL-075",
    domain: "ADMISSIBILITY",
    severity: "CRITICAL",
    title: "Institutional control pattern 075",
    description: "Reusable control pattern 075 for evaluating admissibility integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "admissibility", "control-075"],
  },
  {
    id: "STUDIO-CONTROL-076",
    domain: "BINDING",
    severity: "INFO",
    title: "Institutional control pattern 076",
    description: "Reusable control pattern 076 for evaluating binding integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "binding", "control-076"],
  },
  {
    id: "STUDIO-CONTROL-077",
    domain: "COMMIT",
    severity: "WARNING",
    title: "Institutional control pattern 077",
    description: "Reusable control pattern 077 for evaluating commit integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "commit", "control-077"],
  },
  {
    id: "STUDIO-CONTROL-078",
    domain: "EXECUTION",
    severity: "BLOCKING",
    title: "Institutional control pattern 078",
    description: "Reusable control pattern 078 for evaluating execution integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "execution", "control-078"],
  },
  {
    id: "STUDIO-CONTROL-079",
    domain: "OUTCOME",
    severity: "CRITICAL",
    title: "Institutional control pattern 079",
    description: "Reusable control pattern 079 for evaluating outcome integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "outcome", "control-079"],
  },
  {
    id: "STUDIO-CONTROL-080",
    domain: "REALITY",
    severity: "INFO",
    title: "Institutional control pattern 080",
    description: "Reusable control pattern 080 for evaluating reality integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "reality", "control-080"],
  },
  {
    id: "STUDIO-CONTROL-081",
    domain: "RECORD",
    severity: "WARNING",
    title: "Institutional control pattern 081",
    description: "Reusable control pattern 081 for evaluating record integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "record", "control-081"],
  },
  {
    id: "STUDIO-CONTROL-082",
    domain: "CONTINUITY",
    severity: "BLOCKING",
    title: "Institutional control pattern 082",
    description: "Reusable control pattern 082 for evaluating continuity integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "continuity", "control-082"],
  },
  {
    id: "STUDIO-CONTROL-083",
    domain: "ADMISSIBILITY",
    severity: "CRITICAL",
    title: "Institutional control pattern 083",
    description: "Reusable control pattern 083 for evaluating admissibility integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "admissibility", "control-083"],
  },
  {
    id: "STUDIO-CONTROL-084",
    domain: "BINDING",
    severity: "INFO",
    title: "Institutional control pattern 084",
    description: "Reusable control pattern 084 for evaluating binding integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "binding", "control-084"],
  },
  {
    id: "STUDIO-CONTROL-085",
    domain: "COMMIT",
    severity: "WARNING",
    title: "Institutional control pattern 085",
    description: "Reusable control pattern 085 for evaluating commit integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "commit", "control-085"],
  },
  {
    id: "STUDIO-CONTROL-086",
    domain: "EXECUTION",
    severity: "BLOCKING",
    title: "Institutional control pattern 086",
    description: "Reusable control pattern 086 for evaluating execution integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "execution", "control-086"],
  },
  {
    id: "STUDIO-CONTROL-087",
    domain: "OUTCOME",
    severity: "CRITICAL",
    title: "Institutional control pattern 087",
    description: "Reusable control pattern 087 for evaluating outcome integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "outcome", "control-087"],
  },
  {
    id: "STUDIO-CONTROL-088",
    domain: "REALITY",
    severity: "INFO",
    title: "Institutional control pattern 088",
    description: "Reusable control pattern 088 for evaluating reality integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "reality", "control-088"],
  },
  {
    id: "STUDIO-CONTROL-089",
    domain: "RECORD",
    severity: "WARNING",
    title: "Institutional control pattern 089",
    description: "Reusable control pattern 089 for evaluating record integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "record", "control-089"],
  },
  {
    id: "STUDIO-CONTROL-090",
    domain: "CONTINUITY",
    severity: "BLOCKING",
    title: "Institutional control pattern 090",
    description: "Reusable control pattern 090 for evaluating continuity integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "continuity", "control-090"],
  },
  {
    id: "STUDIO-CONTROL-091",
    domain: "ADMISSIBILITY",
    severity: "CRITICAL",
    title: "Institutional control pattern 091",
    description: "Reusable control pattern 091 for evaluating admissibility integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "admissibility", "control-091"],
  },
  {
    id: "STUDIO-CONTROL-092",
    domain: "BINDING",
    severity: "INFO",
    title: "Institutional control pattern 092",
    description: "Reusable control pattern 092 for evaluating binding integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "binding", "control-092"],
  },
  {
    id: "STUDIO-CONTROL-093",
    domain: "COMMIT",
    severity: "WARNING",
    title: "Institutional control pattern 093",
    description: "Reusable control pattern 093 for evaluating commit integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "commit", "control-093"],
  },
  {
    id: "STUDIO-CONTROL-094",
    domain: "EXECUTION",
    severity: "BLOCKING",
    title: "Institutional control pattern 094",
    description: "Reusable control pattern 094 for evaluating execution integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "execution", "control-094"],
  },
  {
    id: "STUDIO-CONTROL-095",
    domain: "OUTCOME",
    severity: "CRITICAL",
    title: "Institutional control pattern 095",
    description: "Reusable control pattern 095 for evaluating outcome integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "outcome", "control-095"],
  },
  {
    id: "STUDIO-CONTROL-096",
    domain: "REALITY",
    severity: "INFO",
    title: "Institutional control pattern 096",
    description: "Reusable control pattern 096 for evaluating reality integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "reality", "control-096"],
  },
  {
    id: "STUDIO-CONTROL-097",
    domain: "RECORD",
    severity: "WARNING",
    title: "Institutional control pattern 097",
    description: "Reusable control pattern 097 for evaluating record integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "record", "control-097"],
  },
  {
    id: "STUDIO-CONTROL-098",
    domain: "CONTINUITY",
    severity: "BLOCKING",
    title: "Institutional control pattern 098",
    description: "Reusable control pattern 098 for evaluating continuity integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "continuity", "control-098"],
  },
  {
    id: "STUDIO-CONTROL-099",
    domain: "ADMISSIBILITY",
    severity: "CRITICAL",
    title: "Institutional control pattern 099",
    description: "Reusable control pattern 099 for evaluating admissibility integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "admissibility", "control-099"],
  },
  {
    id: "STUDIO-CONTROL-100",
    domain: "BINDING",
    severity: "INFO",
    title: "Institutional control pattern 100",
    description: "Reusable control pattern 100 for evaluating binding integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "binding", "control-100"],
  },
  {
    id: "STUDIO-CONTROL-101",
    domain: "COMMIT",
    severity: "WARNING",
    title: "Institutional control pattern 101",
    description: "Reusable control pattern 101 for evaluating commit integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "commit", "control-101"],
  },
  {
    id: "STUDIO-CONTROL-102",
    domain: "EXECUTION",
    severity: "BLOCKING",
    title: "Institutional control pattern 102",
    description: "Reusable control pattern 102 for evaluating execution integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "execution", "control-102"],
  },
  {
    id: "STUDIO-CONTROL-103",
    domain: "OUTCOME",
    severity: "CRITICAL",
    title: "Institutional control pattern 103",
    description: "Reusable control pattern 103 for evaluating outcome integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "outcome", "control-103"],
  },
  {
    id: "STUDIO-CONTROL-104",
    domain: "REALITY",
    severity: "INFO",
    title: "Institutional control pattern 104",
    description: "Reusable control pattern 104 for evaluating reality integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "reality", "control-104"],
  },
  {
    id: "STUDIO-CONTROL-105",
    domain: "RECORD",
    severity: "WARNING",
    title: "Institutional control pattern 105",
    description: "Reusable control pattern 105 for evaluating record integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "record", "control-105"],
  },
  {
    id: "STUDIO-CONTROL-106",
    domain: "CONTINUITY",
    severity: "BLOCKING",
    title: "Institutional control pattern 106",
    description: "Reusable control pattern 106 for evaluating continuity integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "continuity", "control-106"],
  },
  {
    id: "STUDIO-CONTROL-107",
    domain: "ADMISSIBILITY",
    severity: "CRITICAL",
    title: "Institutional control pattern 107",
    description: "Reusable control pattern 107 for evaluating admissibility integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "admissibility", "control-107"],
  },
  {
    id: "STUDIO-CONTROL-108",
    domain: "BINDING",
    severity: "INFO",
    title: "Institutional control pattern 108",
    description: "Reusable control pattern 108 for evaluating binding integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "binding", "control-108"],
  },
  {
    id: "STUDIO-CONTROL-109",
    domain: "COMMIT",
    severity: "WARNING",
    title: "Institutional control pattern 109",
    description: "Reusable control pattern 109 for evaluating commit integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "commit", "control-109"],
  },
  {
    id: "STUDIO-CONTROL-110",
    domain: "EXECUTION",
    severity: "BLOCKING",
    title: "Institutional control pattern 110",
    description: "Reusable control pattern 110 for evaluating execution integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "execution", "control-110"],
  },
  {
    id: "STUDIO-CONTROL-111",
    domain: "OUTCOME",
    severity: "CRITICAL",
    title: "Institutional control pattern 111",
    description: "Reusable control pattern 111 for evaluating outcome integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "outcome", "control-111"],
  },
  {
    id: "STUDIO-CONTROL-112",
    domain: "REALITY",
    severity: "INFO",
    title: "Institutional control pattern 112",
    description: "Reusable control pattern 112 for evaluating reality integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "reality", "control-112"],
  },
  {
    id: "STUDIO-CONTROL-113",
    domain: "RECORD",
    severity: "WARNING",
    title: "Institutional control pattern 113",
    description: "Reusable control pattern 113 for evaluating record integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "record", "control-113"],
  },
  {
    id: "STUDIO-CONTROL-114",
    domain: "CONTINUITY",
    severity: "BLOCKING",
    title: "Institutional control pattern 114",
    description: "Reusable control pattern 114 for evaluating continuity integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "continuity", "control-114"],
  },
  {
    id: "STUDIO-CONTROL-115",
    domain: "ADMISSIBILITY",
    severity: "CRITICAL",
    title: "Institutional control pattern 115",
    description: "Reusable control pattern 115 for evaluating admissibility integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "admissibility", "control-115"],
  },
  {
    id: "STUDIO-CONTROL-116",
    domain: "BINDING",
    severity: "INFO",
    title: "Institutional control pattern 116",
    description: "Reusable control pattern 116 for evaluating binding integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "binding", "control-116"],
  },
  {
    id: "STUDIO-CONTROL-117",
    domain: "COMMIT",
    severity: "WARNING",
    title: "Institutional control pattern 117",
    description: "Reusable control pattern 117 for evaluating commit integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "commit", "control-117"],
  },
  {
    id: "STUDIO-CONTROL-118",
    domain: "EXECUTION",
    severity: "BLOCKING",
    title: "Institutional control pattern 118",
    description: "Reusable control pattern 118 for evaluating execution integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "execution", "control-118"],
  },
  {
    id: "STUDIO-CONTROL-119",
    domain: "OUTCOME",
    severity: "CRITICAL",
    title: "Institutional control pattern 119",
    description: "Reusable control pattern 119 for evaluating outcome integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "outcome", "control-119"],
  },
  {
    id: "STUDIO-CONTROL-120",
    domain: "REALITY",
    severity: "INFO",
    title: "Institutional control pattern 120",
    description: "Reusable control pattern 120 for evaluating reality integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "reality", "control-120"],
  },
  {
    id: "STUDIO-CONTROL-121",
    domain: "RECORD",
    severity: "WARNING",
    title: "Institutional control pattern 121",
    description: "Reusable control pattern 121 for evaluating record integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "record", "control-121"],
  },
  {
    id: "STUDIO-CONTROL-122",
    domain: "CONTINUITY",
    severity: "BLOCKING",
    title: "Institutional control pattern 122",
    description: "Reusable control pattern 122 for evaluating continuity integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "continuity", "control-122"],
  },
  {
    id: "STUDIO-CONTROL-123",
    domain: "ADMISSIBILITY",
    severity: "CRITICAL",
    title: "Institutional control pattern 123",
    description: "Reusable control pattern 123 for evaluating admissibility integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "admissibility", "control-123"],
  },
  {
    id: "STUDIO-CONTROL-124",
    domain: "BINDING",
    severity: "INFO",
    title: "Institutional control pattern 124",
    description: "Reusable control pattern 124 for evaluating binding integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "binding", "control-124"],
  },
  {
    id: "STUDIO-CONTROL-125",
    domain: "COMMIT",
    severity: "WARNING",
    title: "Institutional control pattern 125",
    description: "Reusable control pattern 125 for evaluating commit integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "commit", "control-125"],
  },
  {
    id: "STUDIO-CONTROL-126",
    domain: "EXECUTION",
    severity: "BLOCKING",
    title: "Institutional control pattern 126",
    description: "Reusable control pattern 126 for evaluating execution integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "execution", "control-126"],
  },
  {
    id: "STUDIO-CONTROL-127",
    domain: "OUTCOME",
    severity: "CRITICAL",
    title: "Institutional control pattern 127",
    description: "Reusable control pattern 127 for evaluating outcome integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "outcome", "control-127"],
  },
  {
    id: "STUDIO-CONTROL-128",
    domain: "REALITY",
    severity: "INFO",
    title: "Institutional control pattern 128",
    description: "Reusable control pattern 128 for evaluating reality integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "reality", "control-128"],
  },
  {
    id: "STUDIO-CONTROL-129",
    domain: "RECORD",
    severity: "WARNING",
    title: "Institutional control pattern 129",
    description: "Reusable control pattern 129 for evaluating record integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "record", "control-129"],
  },
  {
    id: "STUDIO-CONTROL-130",
    domain: "CONTINUITY",
    severity: "BLOCKING",
    title: "Institutional control pattern 130",
    description: "Reusable control pattern 130 for evaluating continuity integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "continuity", "control-130"],
  },
  {
    id: "STUDIO-CONTROL-131",
    domain: "ADMISSIBILITY",
    severity: "CRITICAL",
    title: "Institutional control pattern 131",
    description: "Reusable control pattern 131 for evaluating admissibility integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "admissibility", "control-131"],
  },
  {
    id: "STUDIO-CONTROL-132",
    domain: "BINDING",
    severity: "INFO",
    title: "Institutional control pattern 132",
    description: "Reusable control pattern 132 for evaluating binding integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "binding", "control-132"],
  },
  {
    id: "STUDIO-CONTROL-133",
    domain: "COMMIT",
    severity: "WARNING",
    title: "Institutional control pattern 133",
    description: "Reusable control pattern 133 for evaluating commit integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "commit", "control-133"],
  },
  {
    id: "STUDIO-CONTROL-134",
    domain: "EXECUTION",
    severity: "BLOCKING",
    title: "Institutional control pattern 134",
    description: "Reusable control pattern 134 for evaluating execution integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "execution", "control-134"],
  },
  {
    id: "STUDIO-CONTROL-135",
    domain: "OUTCOME",
    severity: "CRITICAL",
    title: "Institutional control pattern 135",
    description: "Reusable control pattern 135 for evaluating outcome integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "outcome", "control-135"],
  },
  {
    id: "STUDIO-CONTROL-136",
    domain: "REALITY",
    severity: "INFO",
    title: "Institutional control pattern 136",
    description: "Reusable control pattern 136 for evaluating reality integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "reality", "control-136"],
  },
  {
    id: "STUDIO-CONTROL-137",
    domain: "RECORD",
    severity: "WARNING",
    title: "Institutional control pattern 137",
    description: "Reusable control pattern 137 for evaluating record integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "record", "control-137"],
  },
  {
    id: "STUDIO-CONTROL-138",
    domain: "CONTINUITY",
    severity: "BLOCKING",
    title: "Institutional control pattern 138",
    description: "Reusable control pattern 138 for evaluating continuity integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "continuity", "control-138"],
  },
  {
    id: "STUDIO-CONTROL-139",
    domain: "ADMISSIBILITY",
    severity: "CRITICAL",
    title: "Institutional control pattern 139",
    description: "Reusable control pattern 139 for evaluating admissibility integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "admissibility", "control-139"],
  },
  {
    id: "STUDIO-CONTROL-140",
    domain: "BINDING",
    severity: "INFO",
    title: "Institutional control pattern 140",
    description: "Reusable control pattern 140 for evaluating binding integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "binding", "control-140"],
  },
  {
    id: "STUDIO-CONTROL-141",
    domain: "COMMIT",
    severity: "WARNING",
    title: "Institutional control pattern 141",
    description: "Reusable control pattern 141 for evaluating commit integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "commit", "control-141"],
  },
  {
    id: "STUDIO-CONTROL-142",
    domain: "EXECUTION",
    severity: "BLOCKING",
    title: "Institutional control pattern 142",
    description: "Reusable control pattern 142 for evaluating execution integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "execution", "control-142"],
  },
  {
    id: "STUDIO-CONTROL-143",
    domain: "OUTCOME",
    severity: "CRITICAL",
    title: "Institutional control pattern 143",
    description: "Reusable control pattern 143 for evaluating outcome integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "outcome", "control-143"],
  },
  {
    id: "STUDIO-CONTROL-144",
    domain: "REALITY",
    severity: "INFO",
    title: "Institutional control pattern 144",
    description: "Reusable control pattern 144 for evaluating reality integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "reality", "control-144"],
  },
  {
    id: "STUDIO-CONTROL-145",
    domain: "RECORD",
    severity: "WARNING",
    title: "Institutional control pattern 145",
    description: "Reusable control pattern 145 for evaluating record integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "record", "control-145"],
  },
  {
    id: "STUDIO-CONTROL-146",
    domain: "CONTINUITY",
    severity: "BLOCKING",
    title: "Institutional control pattern 146",
    description: "Reusable control pattern 146 for evaluating continuity integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "continuity", "control-146"],
  },
  {
    id: "STUDIO-CONTROL-147",
    domain: "ADMISSIBILITY",
    severity: "CRITICAL",
    title: "Institutional control pattern 147",
    description: "Reusable control pattern 147 for evaluating admissibility integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "admissibility", "control-147"],
  },
  {
    id: "STUDIO-CONTROL-148",
    domain: "BINDING",
    severity: "INFO",
    title: "Institutional control pattern 148",
    description: "Reusable control pattern 148 for evaluating binding integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "binding", "control-148"],
  },
  {
    id: "STUDIO-CONTROL-149",
    domain: "COMMIT",
    severity: "WARNING",
    title: "Institutional control pattern 149",
    description: "Reusable control pattern 149 for evaluating commit integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "commit", "control-149"],
  },
  {
    id: "STUDIO-CONTROL-150",
    domain: "EXECUTION",
    severity: "BLOCKING",
    title: "Institutional control pattern 150",
    description: "Reusable control pattern 150 for evaluating execution integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "execution", "control-150"],
  },
  {
    id: "STUDIO-CONTROL-151",
    domain: "OUTCOME",
    severity: "CRITICAL",
    title: "Institutional control pattern 151",
    description: "Reusable control pattern 151 for evaluating outcome integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "outcome", "control-151"],
  },
  {
    id: "STUDIO-CONTROL-152",
    domain: "REALITY",
    severity: "INFO",
    title: "Institutional control pattern 152",
    description: "Reusable control pattern 152 for evaluating reality integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "reality", "control-152"],
  },
  {
    id: "STUDIO-CONTROL-153",
    domain: "RECORD",
    severity: "WARNING",
    title: "Institutional control pattern 153",
    description: "Reusable control pattern 153 for evaluating record integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "record", "control-153"],
  },
  {
    id: "STUDIO-CONTROL-154",
    domain: "CONTINUITY",
    severity: "BLOCKING",
    title: "Institutional control pattern 154",
    description: "Reusable control pattern 154 for evaluating continuity integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "continuity", "control-154"],
  },
  {
    id: "STUDIO-CONTROL-155",
    domain: "ADMISSIBILITY",
    severity: "CRITICAL",
    title: "Institutional control pattern 155",
    description: "Reusable control pattern 155 for evaluating admissibility integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "admissibility", "control-155"],
  },
  {
    id: "STUDIO-CONTROL-156",
    domain: "BINDING",
    severity: "INFO",
    title: "Institutional control pattern 156",
    description: "Reusable control pattern 156 for evaluating binding integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "binding", "control-156"],
  },
  {
    id: "STUDIO-CONTROL-157",
    domain: "COMMIT",
    severity: "WARNING",
    title: "Institutional control pattern 157",
    description: "Reusable control pattern 157 for evaluating commit integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "commit", "control-157"],
  },
  {
    id: "STUDIO-CONTROL-158",
    domain: "EXECUTION",
    severity: "BLOCKING",
    title: "Institutional control pattern 158",
    description: "Reusable control pattern 158 for evaluating execution integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "execution", "control-158"],
  },
  {
    id: "STUDIO-CONTROL-159",
    domain: "OUTCOME",
    severity: "CRITICAL",
    title: "Institutional control pattern 159",
    description: "Reusable control pattern 159 for evaluating outcome integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "outcome", "control-159"],
  },
  {
    id: "STUDIO-CONTROL-160",
    domain: "REALITY",
    severity: "INFO",
    title: "Institutional control pattern 160",
    description: "Reusable control pattern 160 for evaluating reality integrity, route fitness, authority scope, and execution consequences.",
    repair: "Resolve the controlling condition, preserve the repair evidence, and re-run every dependent gate before commitment.",
    tags: ["artifact-studio", "reality", "control-160"],
  },
];

const evidenceTemplates: EvidenceTemplate[] = [
  {
    id: "EV-TEMPLATE-001",
    title: "Measurement template 001",
    category: "MEASUREMENT",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this measurement support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "SELECTIVE",
    notes: "Template 001 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-002",
    title: "Attestation template 002",
    category: "ATTESTATION",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this attestation support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "RESTRICTED",
    notes: "Template 002 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-003",
    title: "Authority Record template 003",
    category: "AUTHORITY_RECORD",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this authority record support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "WITHHELD",
    notes: "Template 003 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-004",
    title: "System Receipt template 004",
    category: "SYSTEM_RECEIPT",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this system receipt support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "PUBLIC",
    notes: "Template 004 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-005",
    title: "Outcome Evidence template 005",
    category: "OUTCOME_EVIDENCE",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this outcome evidence support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "SELECTIVE",
    notes: "Template 005 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-006",
    title: "Primary Source template 006",
    category: "PRIMARY_SOURCE",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this primary source support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "RESTRICTED",
    notes: "Template 006 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-007",
    title: "Measurement template 007",
    category: "MEASUREMENT",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this measurement support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "WITHHELD",
    notes: "Template 007 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-008",
    title: "Attestation template 008",
    category: "ATTESTATION",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this attestation support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "PUBLIC",
    notes: "Template 008 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-009",
    title: "Authority Record template 009",
    category: "AUTHORITY_RECORD",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this authority record support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "SELECTIVE",
    notes: "Template 009 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-010",
    title: "System Receipt template 010",
    category: "SYSTEM_RECEIPT",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this system receipt support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "RESTRICTED",
    notes: "Template 010 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-011",
    title: "Outcome Evidence template 011",
    category: "OUTCOME_EVIDENCE",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this outcome evidence support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "WITHHELD",
    notes: "Template 011 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-012",
    title: "Primary Source template 012",
    category: "PRIMARY_SOURCE",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this primary source support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "PUBLIC",
    notes: "Template 012 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-013",
    title: "Measurement template 013",
    category: "MEASUREMENT",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this measurement support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "SELECTIVE",
    notes: "Template 013 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-014",
    title: "Attestation template 014",
    category: "ATTESTATION",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this attestation support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "RESTRICTED",
    notes: "Template 014 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-015",
    title: "Authority Record template 015",
    category: "AUTHORITY_RECORD",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this authority record support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "WITHHELD",
    notes: "Template 015 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-016",
    title: "System Receipt template 016",
    category: "SYSTEM_RECEIPT",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this system receipt support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "PUBLIC",
    notes: "Template 016 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-017",
    title: "Outcome Evidence template 017",
    category: "OUTCOME_EVIDENCE",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this outcome evidence support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "SELECTIVE",
    notes: "Template 017 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-018",
    title: "Primary Source template 018",
    category: "PRIMARY_SOURCE",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this primary source support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "RESTRICTED",
    notes: "Template 018 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-019",
    title: "Measurement template 019",
    category: "MEASUREMENT",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this measurement support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "WITHHELD",
    notes: "Template 019 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-020",
    title: "Attestation template 020",
    category: "ATTESTATION",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this attestation support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "PUBLIC",
    notes: "Template 020 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-021",
    title: "Authority Record template 021",
    category: "AUTHORITY_RECORD",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this authority record support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "SELECTIVE",
    notes: "Template 021 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-022",
    title: "System Receipt template 022",
    category: "SYSTEM_RECEIPT",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this system receipt support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "RESTRICTED",
    notes: "Template 022 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-023",
    title: "Outcome Evidence template 023",
    category: "OUTCOME_EVIDENCE",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this outcome evidence support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "WITHHELD",
    notes: "Template 023 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-024",
    title: "Primary Source template 024",
    category: "PRIMARY_SOURCE",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this primary source support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "PUBLIC",
    notes: "Template 024 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-025",
    title: "Measurement template 025",
    category: "MEASUREMENT",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this measurement support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "SELECTIVE",
    notes: "Template 025 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-026",
    title: "Attestation template 026",
    category: "ATTESTATION",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this attestation support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "RESTRICTED",
    notes: "Template 026 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-027",
    title: "Authority Record template 027",
    category: "AUTHORITY_RECORD",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this authority record support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "WITHHELD",
    notes: "Template 027 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-028",
    title: "System Receipt template 028",
    category: "SYSTEM_RECEIPT",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this system receipt support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "PUBLIC",
    notes: "Template 028 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-029",
    title: "Outcome Evidence template 029",
    category: "OUTCOME_EVIDENCE",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this outcome evidence support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "SELECTIVE",
    notes: "Template 029 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-030",
    title: "Primary Source template 030",
    category: "PRIMARY_SOURCE",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this primary source support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "RESTRICTED",
    notes: "Template 030 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-031",
    title: "Measurement template 031",
    category: "MEASUREMENT",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this measurement support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "WITHHELD",
    notes: "Template 031 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-032",
    title: "Attestation template 032",
    category: "ATTESTATION",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this attestation support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "PUBLIC",
    notes: "Template 032 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-033",
    title: "Authority Record template 033",
    category: "AUTHORITY_RECORD",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this authority record support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "SELECTIVE",
    notes: "Template 033 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-034",
    title: "System Receipt template 034",
    category: "SYSTEM_RECEIPT",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this system receipt support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "RESTRICTED",
    notes: "Template 034 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-035",
    title: "Outcome Evidence template 035",
    category: "OUTCOME_EVIDENCE",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this outcome evidence support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "WITHHELD",
    notes: "Template 035 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-036",
    title: "Primary Source template 036",
    category: "PRIMARY_SOURCE",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this primary source support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "PUBLIC",
    notes: "Template 036 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-037",
    title: "Measurement template 037",
    category: "MEASUREMENT",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this measurement support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "SELECTIVE",
    notes: "Template 037 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-038",
    title: "Attestation template 038",
    category: "ATTESTATION",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this attestation support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "RESTRICTED",
    notes: "Template 038 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-039",
    title: "Authority Record template 039",
    category: "AUTHORITY_RECORD",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this authority record support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "WITHHELD",
    notes: "Template 039 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-040",
    title: "System Receipt template 040",
    category: "SYSTEM_RECEIPT",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this system receipt support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "PUBLIC",
    notes: "Template 040 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-041",
    title: "Outcome Evidence template 041",
    category: "OUTCOME_EVIDENCE",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this outcome evidence support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "SELECTIVE",
    notes: "Template 041 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-042",
    title: "Primary Source template 042",
    category: "PRIMARY_SOURCE",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this primary source support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "RESTRICTED",
    notes: "Template 042 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-043",
    title: "Measurement template 043",
    category: "MEASUREMENT",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this measurement support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "WITHHELD",
    notes: "Template 043 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-044",
    title: "Attestation template 044",
    category: "ATTESTATION",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this attestation support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "PUBLIC",
    notes: "Template 044 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-045",
    title: "Authority Record template 045",
    category: "AUTHORITY_RECORD",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this authority record support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "SELECTIVE",
    notes: "Template 045 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-046",
    title: "System Receipt template 046",
    category: "SYSTEM_RECEIPT",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this system receipt support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "RESTRICTED",
    notes: "Template 046 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-047",
    title: "Outcome Evidence template 047",
    category: "OUTCOME_EVIDENCE",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this outcome evidence support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "WITHHELD",
    notes: "Template 047 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-048",
    title: "Primary Source template 048",
    category: "PRIMARY_SOURCE",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this primary source support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "PUBLIC",
    notes: "Template 048 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-049",
    title: "Measurement template 049",
    category: "MEASUREMENT",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this measurement support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "SELECTIVE",
    notes: "Template 049 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-050",
    title: "Attestation template 050",
    category: "ATTESTATION",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this attestation support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "RESTRICTED",
    notes: "Template 050 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-051",
    title: "Authority Record template 051",
    category: "AUTHORITY_RECORD",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this authority record support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "WITHHELD",
    notes: "Template 051 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-052",
    title: "System Receipt template 052",
    category: "SYSTEM_RECEIPT",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this system receipt support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "PUBLIC",
    notes: "Template 052 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-053",
    title: "Outcome Evidence template 053",
    category: "OUTCOME_EVIDENCE",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this outcome evidence support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "SELECTIVE",
    notes: "Template 053 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-054",
    title: "Primary Source template 054",
    category: "PRIMARY_SOURCE",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this primary source support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "RESTRICTED",
    notes: "Template 054 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-055",
    title: "Measurement template 055",
    category: "MEASUREMENT",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this measurement support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "WITHHELD",
    notes: "Template 055 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-056",
    title: "Attestation template 056",
    category: "ATTESTATION",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this attestation support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "PUBLIC",
    notes: "Template 056 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-057",
    title: "Authority Record template 057",
    category: "AUTHORITY_RECORD",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this authority record support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "SELECTIVE",
    notes: "Template 057 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-058",
    title: "System Receipt template 058",
    category: "SYSTEM_RECEIPT",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this system receipt support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "RESTRICTED",
    notes: "Template 058 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-059",
    title: "Outcome Evidence template 059",
    category: "OUTCOME_EVIDENCE",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this outcome evidence support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "WITHHELD",
    notes: "Template 059 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-060",
    title: "Primary Source template 060",
    category: "PRIMARY_SOURCE",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this primary source support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "PUBLIC",
    notes: "Template 060 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-061",
    title: "Measurement template 061",
    category: "MEASUREMENT",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this measurement support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "SELECTIVE",
    notes: "Template 061 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-062",
    title: "Attestation template 062",
    category: "ATTESTATION",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this attestation support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "RESTRICTED",
    notes: "Template 062 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-063",
    title: "Authority Record template 063",
    category: "AUTHORITY_RECORD",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this authority record support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "WITHHELD",
    notes: "Template 063 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-064",
    title: "System Receipt template 064",
    category: "SYSTEM_RECEIPT",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this system receipt support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "PUBLIC",
    notes: "Template 064 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-065",
    title: "Outcome Evidence template 065",
    category: "OUTCOME_EVIDENCE",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this outcome evidence support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "SELECTIVE",
    notes: "Template 065 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-066",
    title: "Primary Source template 066",
    category: "PRIMARY_SOURCE",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this primary source support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "RESTRICTED",
    notes: "Template 066 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-067",
    title: "Measurement template 067",
    category: "MEASUREMENT",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this measurement support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "WITHHELD",
    notes: "Template 067 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-068",
    title: "Attestation template 068",
    category: "ATTESTATION",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this attestation support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "PUBLIC",
    notes: "Template 068 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-069",
    title: "Authority Record template 069",
    category: "AUTHORITY_RECORD",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this authority record support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "SELECTIVE",
    notes: "Template 069 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-070",
    title: "System Receipt template 070",
    category: "SYSTEM_RECEIPT",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this system receipt support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "RESTRICTED",
    notes: "Template 070 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-071",
    title: "Outcome Evidence template 071",
    category: "OUTCOME_EVIDENCE",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this outcome evidence support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "WITHHELD",
    notes: "Template 071 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-072",
    title: "Primary Source template 072",
    category: "PRIMARY_SOURCE",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this primary source support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "PUBLIC",
    notes: "Template 072 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-073",
    title: "Measurement template 073",
    category: "MEASUREMENT",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this measurement support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "SELECTIVE",
    notes: "Template 073 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-074",
    title: "Attestation template 074",
    category: "ATTESTATION",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this attestation support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "RESTRICTED",
    notes: "Template 074 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-075",
    title: "Authority Record template 075",
    category: "AUTHORITY_RECORD",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this authority record support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "WITHHELD",
    notes: "Template 075 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-076",
    title: "System Receipt template 076",
    category: "SYSTEM_RECEIPT",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this system receipt support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "PUBLIC",
    notes: "Template 076 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-077",
    title: "Outcome Evidence template 077",
    category: "OUTCOME_EVIDENCE",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this outcome evidence support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "SELECTIVE",
    notes: "Template 077 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-078",
    title: "Primary Source template 078",
    category: "PRIMARY_SOURCE",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this primary source support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "RESTRICTED",
    notes: "Template 078 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-079",
    title: "Measurement template 079",
    category: "MEASUREMENT",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this measurement support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "WITHHELD",
    notes: "Template 079 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-080",
    title: "Attestation template 080",
    category: "ATTESTATION",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this attestation support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "PUBLIC",
    notes: "Template 080 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-081",
    title: "Authority Record template 081",
    category: "AUTHORITY_RECORD",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this authority record support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "SELECTIVE",
    notes: "Template 081 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-082",
    title: "System Receipt template 082",
    category: "SYSTEM_RECEIPT",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this system receipt support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "RESTRICTED",
    notes: "Template 082 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-083",
    title: "Outcome Evidence template 083",
    category: "OUTCOME_EVIDENCE",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this outcome evidence support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "WITHHELD",
    notes: "Template 083 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-084",
    title: "Primary Source template 084",
    category: "PRIMARY_SOURCE",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this primary source support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "PUBLIC",
    notes: "Template 084 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-085",
    title: "Measurement template 085",
    category: "MEASUREMENT",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this measurement support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "SELECTIVE",
    notes: "Template 085 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-086",
    title: "Attestation template 086",
    category: "ATTESTATION",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this attestation support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "RESTRICTED",
    notes: "Template 086 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-087",
    title: "Authority Record template 087",
    category: "AUTHORITY_RECORD",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this authority record support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "WITHHELD",
    notes: "Template 087 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-088",
    title: "System Receipt template 088",
    category: "SYSTEM_RECEIPT",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this system receipt support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "PUBLIC",
    notes: "Template 088 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-089",
    title: "Outcome Evidence template 089",
    category: "OUTCOME_EVIDENCE",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this outcome evidence support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "SELECTIVE",
    notes: "Template 089 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-090",
    title: "Primary Source template 090",
    category: "PRIMARY_SOURCE",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this primary source support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "RESTRICTED",
    notes: "Template 090 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-091",
    title: "Measurement template 091",
    category: "MEASUREMENT",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this measurement support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "WITHHELD",
    notes: "Template 091 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-092",
    title: "Attestation template 092",
    category: "ATTESTATION",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this attestation support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "PUBLIC",
    notes: "Template 092 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-093",
    title: "Authority Record template 093",
    category: "AUTHORITY_RECORD",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this authority record support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "SELECTIVE",
    notes: "Template 093 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-094",
    title: "System Receipt template 094",
    category: "SYSTEM_RECEIPT",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this system receipt support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "RESTRICTED",
    notes: "Template 094 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-095",
    title: "Outcome Evidence template 095",
    category: "OUTCOME_EVIDENCE",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this outcome evidence support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "WITHHELD",
    notes: "Template 095 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-096",
    title: "Primary Source template 096",
    category: "PRIMARY_SOURCE",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this primary source support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "PUBLIC",
    notes: "Template 096 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-097",
    title: "Measurement template 097",
    category: "MEASUREMENT",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this measurement support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "SELECTIVE",
    notes: "Template 097 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-098",
    title: "Attestation template 098",
    category: "ATTESTATION",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this attestation support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "RESTRICTED",
    notes: "Template 098 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-099",
    title: "Authority Record template 099",
    category: "AUTHORITY_RECORD",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this authority record support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "WITHHELD",
    notes: "Template 099 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-100",
    title: "System Receipt template 100",
    category: "SYSTEM_RECEIPT",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this system receipt support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "PUBLIC",
    notes: "Template 100 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-101",
    title: "Outcome Evidence template 101",
    category: "OUTCOME_EVIDENCE",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this outcome evidence support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "SELECTIVE",
    notes: "Template 101 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-102",
    title: "Primary Source template 102",
    category: "PRIMARY_SOURCE",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this primary source support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "RESTRICTED",
    notes: "Template 102 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-103",
    title: "Measurement template 103",
    category: "MEASUREMENT",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this measurement support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "WITHHELD",
    notes: "Template 103 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-104",
    title: "Attestation template 104",
    category: "ATTESTATION",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this attestation support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "PUBLIC",
    notes: "Template 104 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-105",
    title: "Authority Record template 105",
    category: "AUTHORITY_RECORD",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this authority record support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "SELECTIVE",
    notes: "Template 105 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-106",
    title: "System Receipt template 106",
    category: "SYSTEM_RECEIPT",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this system receipt support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "RESTRICTED",
    notes: "Template 106 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-107",
    title: "Outcome Evidence template 107",
    category: "OUTCOME_EVIDENCE",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this outcome evidence support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "WITHHELD",
    notes: "Template 107 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-108",
    title: "Primary Source template 108",
    category: "PRIMARY_SOURCE",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this primary source support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "PUBLIC",
    notes: "Template 108 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-109",
    title: "Measurement template 109",
    category: "MEASUREMENT",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this measurement support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "SELECTIVE",
    notes: "Template 109 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-110",
    title: "Attestation template 110",
    category: "ATTESTATION",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this attestation support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "RESTRICTED",
    notes: "Template 110 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-111",
    title: "Authority Record template 111",
    category: "AUTHORITY_RECORD",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this authority record support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "WITHHELD",
    notes: "Template 111 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-112",
    title: "System Receipt template 112",
    category: "SYSTEM_RECEIPT",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this system receipt support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "PUBLIC",
    notes: "Template 112 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-113",
    title: "Outcome Evidence template 113",
    category: "OUTCOME_EVIDENCE",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this outcome evidence support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "SELECTIVE",
    notes: "Template 113 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-114",
    title: "Primary Source template 114",
    category: "PRIMARY_SOURCE",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this primary source support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "RESTRICTED",
    notes: "Template 114 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-115",
    title: "Measurement template 115",
    category: "MEASUREMENT",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this measurement support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "WITHHELD",
    notes: "Template 115 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-116",
    title: "Attestation template 116",
    category: "ATTESTATION",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this attestation support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "PUBLIC",
    notes: "Template 116 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-117",
    title: "Authority Record template 117",
    category: "AUTHORITY_RECORD",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this authority record support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "SELECTIVE",
    notes: "Template 117 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-118",
    title: "System Receipt template 118",
    category: "SYSTEM_RECEIPT",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this system receipt support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "RESTRICTED",
    notes: "Template 118 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-119",
    title: "Outcome Evidence template 119",
    category: "OUTCOME_EVIDENCE",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this outcome evidence support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "WITHHELD",
    notes: "Template 119 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
  {
    id: "EV-TEMPLATE-120",
    title: "Primary Source template 120",
    category: "PRIMARY_SOURCE",
    requiredFields: ["source", "capturedAt", "custody", "freshness", "hash", "disclosure"],
    admissibilityQuestion: "May this primary source support the proposed consequence for this route, purpose, jurisdiction, and time?",
    defaultDisclosure: "PUBLIC",
    notes: "Template 120 preserves attribution, continuity, admissibility status, and review boundaries.",
  },
];

const routeTemplates: RouteTemplate[] = [
  {
    id: "ROUTE-TEMPLATE-001",
    name: "Governed route template 001",
    sector: "Finance",
    expectedDetermination: "HOLD",
    gateCount: 9,
    version: "1.1.0",
    consequenceClass: "MODERATE",
    description: "Reference route 001 with frozen gate order, threshold rules, revalidation triggers, authority checks, and execution-adapter boundaries.",
  },
  {
    id: "ROUTE-TEMPLATE-002",
    name: "Governed route template 002",
    sector: "Healthcare",
    expectedDetermination: "DENY",
    gateCount: 10,
    version: "1.2.0",
    consequenceClass: "HIGH",
    description: "Reference route 002 with frozen gate order, threshold rules, revalidation triggers, authority checks, and execution-adapter boundaries.",
  },
  {
    id: "ROUTE-TEMPLATE-003",
    name: "Governed route template 003",
    sector: "Procurement",
    expectedDetermination: "ESCALATE",
    gateCount: 11,
    version: "1.3.0",
    consequenceClass: "CRITICAL",
    description: "Reference route 003 with frozen gate order, threshold rules, revalidation triggers, authority checks, and execution-adapter boundaries.",
  },
  {
    id: "ROUTE-TEMPLATE-004",
    name: "Governed route template 004",
    sector: "Environmental integrity",
    expectedDetermination: "ALLOW",
    gateCount: 12,
    version: "1.4.0",
    consequenceClass: "LOW",
    description: "Reference route 004 with frozen gate order, threshold rules, revalidation triggers, authority checks, and execution-adapter boundaries.",
  },
  {
    id: "ROUTE-TEMPLATE-005",
    name: "Governed route template 005",
    sector: "Infrastructure",
    expectedDetermination: "HOLD",
    gateCount: 13,
    version: "1.5.0",
    consequenceClass: "MODERATE",
    description: "Reference route 005 with frozen gate order, threshold rules, revalidation triggers, authority checks, and execution-adapter boundaries.",
  },
  {
    id: "ROUTE-TEMPLATE-006",
    name: "Governed route template 006",
    sector: "Education",
    expectedDetermination: "DENY",
    gateCount: 14,
    version: "1.6.0",
    consequenceClass: "HIGH",
    description: "Reference route 006 with frozen gate order, threshold rules, revalidation triggers, authority checks, and execution-adapter boundaries.",
  },
  {
    id: "ROUTE-TEMPLATE-007",
    name: "Governed route template 007",
    sector: "Autonomous agents",
    expectedDetermination: "ESCALATE",
    gateCount: 15,
    version: "1.7.0",
    consequenceClass: "CRITICAL",
    description: "Reference route 007 with frozen gate order, threshold rules, revalidation triggers, authority checks, and execution-adapter boundaries.",
  },
  {
    id: "ROUTE-TEMPLATE-008",
    name: "Governed route template 008",
    sector: "Cross-sector",
    expectedDetermination: "ALLOW",
    gateCount: 16,
    version: "1.8.0",
    consequenceClass: "LOW",
    description: "Reference route 008 with frozen gate order, threshold rules, revalidation triggers, authority checks, and execution-adapter boundaries.",
  },
  {
    id: "ROUTE-TEMPLATE-009",
    name: "Governed route template 009",
    sector: "Finance",
    expectedDetermination: "HOLD",
    gateCount: 17,
    version: "1.9.0",
    consequenceClass: "MODERATE",
    description: "Reference route 009 with frozen gate order, threshold rules, revalidation triggers, authority checks, and execution-adapter boundaries.",
  },
  {
    id: "ROUTE-TEMPLATE-010",
    name: "Governed route template 010",
    sector: "Healthcare",
    expectedDetermination: "DENY",
    gateCount: 18,
    version: "1.10.0",
    consequenceClass: "HIGH",
    description: "Reference route 010 with frozen gate order, threshold rules, revalidation triggers, authority checks, and execution-adapter boundaries.",
  },
  {
    id: "ROUTE-TEMPLATE-011",
    name: "Governed route template 011",
    sector: "Procurement",
    expectedDetermination: "ESCALATE",
    gateCount: 19,
    version: "1.11.0",
    consequenceClass: "CRITICAL",
    description: "Reference route 011 with frozen gate order, threshold rules, revalidation triggers, authority checks, and execution-adapter boundaries.",
  },
  {
    id: "ROUTE-TEMPLATE-012",
    name: "Governed route template 012",
    sector: "Environmental integrity",
    expectedDetermination: "ALLOW",
    gateCount: 20,
    version: "1.12.0",
    consequenceClass: "LOW",
    description: "Reference route 012 with frozen gate order, threshold rules, revalidation triggers, authority checks, and execution-adapter boundaries.",
  },
  {
    id: "ROUTE-TEMPLATE-013",
    name: "Governed route template 013",
    sector: "Infrastructure",
    expectedDetermination: "HOLD",
    gateCount: 21,
    version: "1.13.0",
    consequenceClass: "MODERATE",
    description: "Reference route 013 with frozen gate order, threshold rules, revalidation triggers, authority checks, and execution-adapter boundaries.",
  },
  {
    id: "ROUTE-TEMPLATE-014",
    name: "Governed route template 014",
    sector: "Education",
    expectedDetermination: "DENY",
    gateCount: 22,
    version: "1.14.0",
    consequenceClass: "HIGH",
    description: "Reference route 014 with frozen gate order, threshold rules, revalidation triggers, authority checks, and execution-adapter boundaries.",
  },
  {
    id: "ROUTE-TEMPLATE-015",
    name: "Governed route template 015",
    sector: "Autonomous agents",
    expectedDetermination: "ESCALATE",
    gateCount: 23,
    version: "1.15.0",
    consequenceClass: "CRITICAL",
    description: "Reference route 015 with frozen gate order, threshold rules, revalidation triggers, authority checks, and execution-adapter boundaries.",
  },
  {
    id: "ROUTE-TEMPLATE-016",
    name: "Governed route template 016",
    sector: "Cross-sector",
    expectedDetermination: "ALLOW",
    gateCount: 24,
    version: "1.16.0",
    consequenceClass: "LOW",
    description: "Reference route 016 with frozen gate order, threshold rules, revalidation triggers, authority checks, and execution-adapter boundaries.",
  },
  {
    id: "ROUTE-TEMPLATE-017",
    name: "Governed route template 017",
    sector: "Finance",
    expectedDetermination: "HOLD",
    gateCount: 8,
    version: "1.17.0",
    consequenceClass: "MODERATE",
    description: "Reference route 017 with frozen gate order, threshold rules, revalidation triggers, authority checks, and execution-adapter boundaries.",
  },
  {
    id: "ROUTE-TEMPLATE-018",
    name: "Governed route template 018",
    sector: "Healthcare",
    expectedDetermination: "DENY",
    gateCount: 9,
    version: "1.18.0",
    consequenceClass: "HIGH",
    description: "Reference route 018 with frozen gate order, threshold rules, revalidation triggers, authority checks, and execution-adapter boundaries.",
  },
  {
    id: "ROUTE-TEMPLATE-019",
    name: "Governed route template 019",
    sector: "Procurement",
    expectedDetermination: "ESCALATE",
    gateCount: 10,
    version: "1.19.0",
    consequenceClass: "CRITICAL",
    description: "Reference route 019 with frozen gate order, threshold rules, revalidation triggers, authority checks, and execution-adapter boundaries.",
  },
  {
    id: "ROUTE-TEMPLATE-020",
    name: "Governed route template 020",
    sector: "Environmental integrity",
    expectedDetermination: "ALLOW",
    gateCount: 11,
    version: "2.0.0",
    consequenceClass: "LOW",
    description: "Reference route 020 with frozen gate order, threshold rules, revalidation triggers, authority checks, and execution-adapter boundaries.",
  },
  {
    id: "ROUTE-TEMPLATE-021",
    name: "Governed route template 021",
    sector: "Infrastructure",
    expectedDetermination: "HOLD",
    gateCount: 12,
    version: "2.1.0",
    consequenceClass: "MODERATE",
    description: "Reference route 021 with frozen gate order, threshold rules, revalidation triggers, authority checks, and execution-adapter boundaries.",
  },
  {
    id: "ROUTE-TEMPLATE-022",
    name: "Governed route template 022",
    sector: "Education",
    expectedDetermination: "DENY",
    gateCount: 13,
    version: "2.2.0",
    consequenceClass: "HIGH",
    description: "Reference route 022 with frozen gate order, threshold rules, revalidation triggers, authority checks, and execution-adapter boundaries.",
  },
  {
    id: "ROUTE-TEMPLATE-023",
    name: "Governed route template 023",
    sector: "Autonomous agents",
    expectedDetermination: "ESCALATE",
    gateCount: 14,
    version: "2.3.0",
    consequenceClass: "CRITICAL",
    description: "Reference route 023 with frozen gate order, threshold rules, revalidation triggers, authority checks, and execution-adapter boundaries.",
  },
  {
    id: "ROUTE-TEMPLATE-024",
    name: "Governed route template 024",
    sector: "Cross-sector",
    expectedDetermination: "ALLOW",
    gateCount: 15,
    version: "2.4.0",
    consequenceClass: "LOW",
    description: "Reference route 024 with frozen gate order, threshold rules, revalidation triggers, authority checks, and execution-adapter boundaries.",
  },
  {
    id: "ROUTE-TEMPLATE-025",
    name: "Governed route template 025",
    sector: "Finance",
    expectedDetermination: "HOLD",
    gateCount: 16,
    version: "2.5.0",
    consequenceClass: "MODERATE",
    description: "Reference route 025 with frozen gate order, threshold rules, revalidation triggers, authority checks, and execution-adapter boundaries.",
  },
  {
    id: "ROUTE-TEMPLATE-026",
    name: "Governed route template 026",
    sector: "Healthcare",
    expectedDetermination: "DENY",
    gateCount: 17,
    version: "2.6.0",
    consequenceClass: "HIGH",
    description: "Reference route 026 with frozen gate order, threshold rules, revalidation triggers, authority checks, and execution-adapter boundaries.",
  },
  {
    id: "ROUTE-TEMPLATE-027",
    name: "Governed route template 027",
    sector: "Procurement",
    expectedDetermination: "ESCALATE",
    gateCount: 18,
    version: "2.7.0",
    consequenceClass: "CRITICAL",
    description: "Reference route 027 with frozen gate order, threshold rules, revalidation triggers, authority checks, and execution-adapter boundaries.",
  },
  {
    id: "ROUTE-TEMPLATE-028",
    name: "Governed route template 028",
    sector: "Environmental integrity",
    expectedDetermination: "ALLOW",
    gateCount: 19,
    version: "2.8.0",
    consequenceClass: "LOW",
    description: "Reference route 028 with frozen gate order, threshold rules, revalidation triggers, authority checks, and execution-adapter boundaries.",
  },
  {
    id: "ROUTE-TEMPLATE-029",
    name: "Governed route template 029",
    sector: "Infrastructure",
    expectedDetermination: "HOLD",
    gateCount: 20,
    version: "2.9.0",
    consequenceClass: "MODERATE",
    description: "Reference route 029 with frozen gate order, threshold rules, revalidation triggers, authority checks, and execution-adapter boundaries.",
  },
  {
    id: "ROUTE-TEMPLATE-030",
    name: "Governed route template 030",
    sector: "Education",
    expectedDetermination: "DENY",
    gateCount: 21,
    version: "2.10.0",
    consequenceClass: "HIGH",
    description: "Reference route 030 with frozen gate order, threshold rules, revalidation triggers, authority checks, and execution-adapter boundaries.",
  },
  {
    id: "ROUTE-TEMPLATE-031",
    name: "Governed route template 031",
    sector: "Autonomous agents",
    expectedDetermination: "ESCALATE",
    gateCount: 22,
    version: "2.11.0",
    consequenceClass: "CRITICAL",
    description: "Reference route 031 with frozen gate order, threshold rules, revalidation triggers, authority checks, and execution-adapter boundaries.",
  },
  {
    id: "ROUTE-TEMPLATE-032",
    name: "Governed route template 032",
    sector: "Cross-sector",
    expectedDetermination: "ALLOW",
    gateCount: 23,
    version: "2.12.0",
    consequenceClass: "LOW",
    description: "Reference route 032 with frozen gate order, threshold rules, revalidation triggers, authority checks, and execution-adapter boundaries.",
  },
  {
    id: "ROUTE-TEMPLATE-033",
    name: "Governed route template 033",
    sector: "Finance",
    expectedDetermination: "HOLD",
    gateCount: 24,
    version: "2.13.0",
    consequenceClass: "MODERATE",
    description: "Reference route 033 with frozen gate order, threshold rules, revalidation triggers, authority checks, and execution-adapter boundaries.",
  },
  {
    id: "ROUTE-TEMPLATE-034",
    name: "Governed route template 034",
    sector: "Healthcare",
    expectedDetermination: "DENY",
    gateCount: 8,
    version: "2.14.0",
    consequenceClass: "HIGH",
    description: "Reference route 034 with frozen gate order, threshold rules, revalidation triggers, authority checks, and execution-adapter boundaries.",
  },
  {
    id: "ROUTE-TEMPLATE-035",
    name: "Governed route template 035",
    sector: "Procurement",
    expectedDetermination: "ESCALATE",
    gateCount: 9,
    version: "2.15.0",
    consequenceClass: "CRITICAL",
    description: "Reference route 035 with frozen gate order, threshold rules, revalidation triggers, authority checks, and execution-adapter boundaries.",
  },
  {
    id: "ROUTE-TEMPLATE-036",
    name: "Governed route template 036",
    sector: "Environmental integrity",
    expectedDetermination: "ALLOW",
    gateCount: 10,
    version: "2.16.0",
    consequenceClass: "LOW",
    description: "Reference route 036 with frozen gate order, threshold rules, revalidation triggers, authority checks, and execution-adapter boundaries.",
  },
  {
    id: "ROUTE-TEMPLATE-037",
    name: "Governed route template 037",
    sector: "Infrastructure",
    expectedDetermination: "HOLD",
    gateCount: 11,
    version: "2.17.0",
    consequenceClass: "MODERATE",
    description: "Reference route 037 with frozen gate order, threshold rules, revalidation triggers, authority checks, and execution-adapter boundaries.",
  },
  {
    id: "ROUTE-TEMPLATE-038",
    name: "Governed route template 038",
    sector: "Education",
    expectedDetermination: "DENY",
    gateCount: 12,
    version: "2.18.0",
    consequenceClass: "HIGH",
    description: "Reference route 038 with frozen gate order, threshold rules, revalidation triggers, authority checks, and execution-adapter boundaries.",
  },
  {
    id: "ROUTE-TEMPLATE-039",
    name: "Governed route template 039",
    sector: "Autonomous agents",
    expectedDetermination: "ESCALATE",
    gateCount: 13,
    version: "2.19.0",
    consequenceClass: "CRITICAL",
    description: "Reference route 039 with frozen gate order, threshold rules, revalidation triggers, authority checks, and execution-adapter boundaries.",
  },
  {
    id: "ROUTE-TEMPLATE-040",
    name: "Governed route template 040",
    sector: "Cross-sector",
    expectedDetermination: "ALLOW",
    gateCount: 14,
    version: "3.0.0",
    consequenceClass: "LOW",
    description: "Reference route 040 with frozen gate order, threshold rules, revalidation triggers, authority checks, and execution-adapter boundaries.",
  },
  {
    id: "ROUTE-TEMPLATE-041",
    name: "Governed route template 041",
    sector: "Finance",
    expectedDetermination: "HOLD",
    gateCount: 15,
    version: "3.1.0",
    consequenceClass: "MODERATE",
    description: "Reference route 041 with frozen gate order, threshold rules, revalidation triggers, authority checks, and execution-adapter boundaries.",
  },
  {
    id: "ROUTE-TEMPLATE-042",
    name: "Governed route template 042",
    sector: "Healthcare",
    expectedDetermination: "DENY",
    gateCount: 16,
    version: "3.2.0",
    consequenceClass: "HIGH",
    description: "Reference route 042 with frozen gate order, threshold rules, revalidation triggers, authority checks, and execution-adapter boundaries.",
  },
  {
    id: "ROUTE-TEMPLATE-043",
    name: "Governed route template 043",
    sector: "Procurement",
    expectedDetermination: "ESCALATE",
    gateCount: 17,
    version: "3.3.0",
    consequenceClass: "CRITICAL",
    description: "Reference route 043 with frozen gate order, threshold rules, revalidation triggers, authority checks, and execution-adapter boundaries.",
  },
  {
    id: "ROUTE-TEMPLATE-044",
    name: "Governed route template 044",
    sector: "Environmental integrity",
    expectedDetermination: "ALLOW",
    gateCount: 18,
    version: "3.4.0",
    consequenceClass: "LOW",
    description: "Reference route 044 with frozen gate order, threshold rules, revalidation triggers, authority checks, and execution-adapter boundaries.",
  },
  {
    id: "ROUTE-TEMPLATE-045",
    name: "Governed route template 045",
    sector: "Infrastructure",
    expectedDetermination: "HOLD",
    gateCount: 19,
    version: "3.5.0",
    consequenceClass: "MODERATE",
    description: "Reference route 045 with frozen gate order, threshold rules, revalidation triggers, authority checks, and execution-adapter boundaries.",
  },
  {
    id: "ROUTE-TEMPLATE-046",
    name: "Governed route template 046",
    sector: "Education",
    expectedDetermination: "DENY",
    gateCount: 20,
    version: "3.6.0",
    consequenceClass: "HIGH",
    description: "Reference route 046 with frozen gate order, threshold rules, revalidation triggers, authority checks, and execution-adapter boundaries.",
  },
  {
    id: "ROUTE-TEMPLATE-047",
    name: "Governed route template 047",
    sector: "Autonomous agents",
    expectedDetermination: "ESCALATE",
    gateCount: 21,
    version: "3.7.0",
    consequenceClass: "CRITICAL",
    description: "Reference route 047 with frozen gate order, threshold rules, revalidation triggers, authority checks, and execution-adapter boundaries.",
  },
  {
    id: "ROUTE-TEMPLATE-048",
    name: "Governed route template 048",
    sector: "Cross-sector",
    expectedDetermination: "ALLOW",
    gateCount: 22,
    version: "3.8.0",
    consequenceClass: "LOW",
    description: "Reference route 048 with frozen gate order, threshold rules, revalidation triggers, authority checks, and execution-adapter boundaries.",
  },
  {
    id: "ROUTE-TEMPLATE-049",
    name: "Governed route template 049",
    sector: "Finance",
    expectedDetermination: "HOLD",
    gateCount: 23,
    version: "3.9.0",
    consequenceClass: "MODERATE",
    description: "Reference route 049 with frozen gate order, threshold rules, revalidation triggers, authority checks, and execution-adapter boundaries.",
  },
  {
    id: "ROUTE-TEMPLATE-050",
    name: "Governed route template 050",
    sector: "Healthcare",
    expectedDetermination: "DENY",
    gateCount: 24,
    version: "3.10.0",
    consequenceClass: "HIGH",
    description: "Reference route 050 with frozen gate order, threshold rules, revalidation triggers, authority checks, and execution-adapter boundaries.",
  },
  {
    id: "ROUTE-TEMPLATE-051",
    name: "Governed route template 051",
    sector: "Procurement",
    expectedDetermination: "ESCALATE",
    gateCount: 8,
    version: "3.11.0",
    consequenceClass: "CRITICAL",
    description: "Reference route 051 with frozen gate order, threshold rules, revalidation triggers, authority checks, and execution-adapter boundaries.",
  },
  {
    id: "ROUTE-TEMPLATE-052",
    name: "Governed route template 052",
    sector: "Environmental integrity",
    expectedDetermination: "ALLOW",
    gateCount: 9,
    version: "3.12.0",
    consequenceClass: "LOW",
    description: "Reference route 052 with frozen gate order, threshold rules, revalidation triggers, authority checks, and execution-adapter boundaries.",
  },
  {
    id: "ROUTE-TEMPLATE-053",
    name: "Governed route template 053",
    sector: "Infrastructure",
    expectedDetermination: "HOLD",
    gateCount: 10,
    version: "3.13.0",
    consequenceClass: "MODERATE",
    description: "Reference route 053 with frozen gate order, threshold rules, revalidation triggers, authority checks, and execution-adapter boundaries.",
  },
  {
    id: "ROUTE-TEMPLATE-054",
    name: "Governed route template 054",
    sector: "Education",
    expectedDetermination: "DENY",
    gateCount: 11,
    version: "3.14.0",
    consequenceClass: "HIGH",
    description: "Reference route 054 with frozen gate order, threshold rules, revalidation triggers, authority checks, and execution-adapter boundaries.",
  },
  {
    id: "ROUTE-TEMPLATE-055",
    name: "Governed route template 055",
    sector: "Autonomous agents",
    expectedDetermination: "ESCALATE",
    gateCount: 12,
    version: "3.15.0",
    consequenceClass: "CRITICAL",
    description: "Reference route 055 with frozen gate order, threshold rules, revalidation triggers, authority checks, and execution-adapter boundaries.",
  },
  {
    id: "ROUTE-TEMPLATE-056",
    name: "Governed route template 056",
    sector: "Cross-sector",
    expectedDetermination: "ALLOW",
    gateCount: 13,
    version: "3.16.0",
    consequenceClass: "LOW",
    description: "Reference route 056 with frozen gate order, threshold rules, revalidation triggers, authority checks, and execution-adapter boundaries.",
  },
  {
    id: "ROUTE-TEMPLATE-057",
    name: "Governed route template 057",
    sector: "Finance",
    expectedDetermination: "HOLD",
    gateCount: 14,
    version: "3.17.0",
    consequenceClass: "MODERATE",
    description: "Reference route 057 with frozen gate order, threshold rules, revalidation triggers, authority checks, and execution-adapter boundaries.",
  },
  {
    id: "ROUTE-TEMPLATE-058",
    name: "Governed route template 058",
    sector: "Healthcare",
    expectedDetermination: "DENY",
    gateCount: 15,
    version: "3.18.0",
    consequenceClass: "HIGH",
    description: "Reference route 058 with frozen gate order, threshold rules, revalidation triggers, authority checks, and execution-adapter boundaries.",
  },
  {
    id: "ROUTE-TEMPLATE-059",
    name: "Governed route template 059",
    sector: "Procurement",
    expectedDetermination: "ESCALATE",
    gateCount: 16,
    version: "3.19.0",
    consequenceClass: "CRITICAL",
    description: "Reference route 059 with frozen gate order, threshold rules, revalidation triggers, authority checks, and execution-adapter boundaries.",
  },
  {
    id: "ROUTE-TEMPLATE-060",
    name: "Governed route template 060",
    sector: "Environmental integrity",
    expectedDetermination: "ALLOW",
    gateCount: 17,
    version: "4.0.0",
    consequenceClass: "LOW",
    description: "Reference route 060 with frozen gate order, threshold rules, revalidation triggers, authority checks, and execution-adapter boundaries.",
  },
  {
    id: "ROUTE-TEMPLATE-061",
    name: "Governed route template 061",
    sector: "Infrastructure",
    expectedDetermination: "HOLD",
    gateCount: 18,
    version: "4.1.0",
    consequenceClass: "MODERATE",
    description: "Reference route 061 with frozen gate order, threshold rules, revalidation triggers, authority checks, and execution-adapter boundaries.",
  },
  {
    id: "ROUTE-TEMPLATE-062",
    name: "Governed route template 062",
    sector: "Education",
    expectedDetermination: "DENY",
    gateCount: 19,
    version: "4.2.0",
    consequenceClass: "HIGH",
    description: "Reference route 062 with frozen gate order, threshold rules, revalidation triggers, authority checks, and execution-adapter boundaries.",
  },
  {
    id: "ROUTE-TEMPLATE-063",
    name: "Governed route template 063",
    sector: "Autonomous agents",
    expectedDetermination: "ESCALATE",
    gateCount: 20,
    version: "4.3.0",
    consequenceClass: "CRITICAL",
    description: "Reference route 063 with frozen gate order, threshold rules, revalidation triggers, authority checks, and execution-adapter boundaries.",
  },
  {
    id: "ROUTE-TEMPLATE-064",
    name: "Governed route template 064",
    sector: "Cross-sector",
    expectedDetermination: "ALLOW",
    gateCount: 21,
    version: "4.4.0",
    consequenceClass: "LOW",
    description: "Reference route 064 with frozen gate order, threshold rules, revalidation triggers, authority checks, and execution-adapter boundaries.",
  },
  {
    id: "ROUTE-TEMPLATE-065",
    name: "Governed route template 065",
    sector: "Finance",
    expectedDetermination: "HOLD",
    gateCount: 22,
    version: "4.5.0",
    consequenceClass: "MODERATE",
    description: "Reference route 065 with frozen gate order, threshold rules, revalidation triggers, authority checks, and execution-adapter boundaries.",
  },
  {
    id: "ROUTE-TEMPLATE-066",
    name: "Governed route template 066",
    sector: "Healthcare",
    expectedDetermination: "DENY",
    gateCount: 23,
    version: "4.6.0",
    consequenceClass: "HIGH",
    description: "Reference route 066 with frozen gate order, threshold rules, revalidation triggers, authority checks, and execution-adapter boundaries.",
  },
  {
    id: "ROUTE-TEMPLATE-067",
    name: "Governed route template 067",
    sector: "Procurement",
    expectedDetermination: "ESCALATE",
    gateCount: 24,
    version: "4.7.0",
    consequenceClass: "CRITICAL",
    description: "Reference route 067 with frozen gate order, threshold rules, revalidation triggers, authority checks, and execution-adapter boundaries.",
  },
  {
    id: "ROUTE-TEMPLATE-068",
    name: "Governed route template 068",
    sector: "Environmental integrity",
    expectedDetermination: "ALLOW",
    gateCount: 8,
    version: "4.8.0",
    consequenceClass: "LOW",
    description: "Reference route 068 with frozen gate order, threshold rules, revalidation triggers, authority checks, and execution-adapter boundaries.",
  },
  {
    id: "ROUTE-TEMPLATE-069",
    name: "Governed route template 069",
    sector: "Infrastructure",
    expectedDetermination: "HOLD",
    gateCount: 9,
    version: "4.9.0",
    consequenceClass: "MODERATE",
    description: "Reference route 069 with frozen gate order, threshold rules, revalidation triggers, authority checks, and execution-adapter boundaries.",
  },
  {
    id: "ROUTE-TEMPLATE-070",
    name: "Governed route template 070",
    sector: "Education",
    expectedDetermination: "DENY",
    gateCount: 10,
    version: "4.10.0",
    consequenceClass: "HIGH",
    description: "Reference route 070 with frozen gate order, threshold rules, revalidation triggers, authority checks, and execution-adapter boundaries.",
  },
  {
    id: "ROUTE-TEMPLATE-071",
    name: "Governed route template 071",
    sector: "Autonomous agents",
    expectedDetermination: "ESCALATE",
    gateCount: 11,
    version: "4.11.0",
    consequenceClass: "CRITICAL",
    description: "Reference route 071 with frozen gate order, threshold rules, revalidation triggers, authority checks, and execution-adapter boundaries.",
  },
  {
    id: "ROUTE-TEMPLATE-072",
    name: "Governed route template 072",
    sector: "Cross-sector",
    expectedDetermination: "ALLOW",
    gateCount: 12,
    version: "4.12.0",
    consequenceClass: "LOW",
    description: "Reference route 072 with frozen gate order, threshold rules, revalidation triggers, authority checks, and execution-adapter boundaries.",
  },
  {
    id: "ROUTE-TEMPLATE-073",
    name: "Governed route template 073",
    sector: "Finance",
    expectedDetermination: "HOLD",
    gateCount: 13,
    version: "4.13.0",
    consequenceClass: "MODERATE",
    description: "Reference route 073 with frozen gate order, threshold rules, revalidation triggers, authority checks, and execution-adapter boundaries.",
  },
  {
    id: "ROUTE-TEMPLATE-074",
    name: "Governed route template 074",
    sector: "Healthcare",
    expectedDetermination: "DENY",
    gateCount: 14,
    version: "4.14.0",
    consequenceClass: "HIGH",
    description: "Reference route 074 with frozen gate order, threshold rules, revalidation triggers, authority checks, and execution-adapter boundaries.",
  },
  {
    id: "ROUTE-TEMPLATE-075",
    name: "Governed route template 075",
    sector: "Procurement",
    expectedDetermination: "ESCALATE",
    gateCount: 15,
    version: "4.15.0",
    consequenceClass: "CRITICAL",
    description: "Reference route 075 with frozen gate order, threshold rules, revalidation triggers, authority checks, and execution-adapter boundaries.",
  },
  {
    id: "ROUTE-TEMPLATE-076",
    name: "Governed route template 076",
    sector: "Environmental integrity",
    expectedDetermination: "ALLOW",
    gateCount: 16,
    version: "4.16.0",
    consequenceClass: "LOW",
    description: "Reference route 076 with frozen gate order, threshold rules, revalidation triggers, authority checks, and execution-adapter boundaries.",
  },
  {
    id: "ROUTE-TEMPLATE-077",
    name: "Governed route template 077",
    sector: "Infrastructure",
    expectedDetermination: "HOLD",
    gateCount: 17,
    version: "4.17.0",
    consequenceClass: "MODERATE",
    description: "Reference route 077 with frozen gate order, threshold rules, revalidation triggers, authority checks, and execution-adapter boundaries.",
  },
  {
    id: "ROUTE-TEMPLATE-078",
    name: "Governed route template 078",
    sector: "Education",
    expectedDetermination: "DENY",
    gateCount: 18,
    version: "4.18.0",
    consequenceClass: "HIGH",
    description: "Reference route 078 with frozen gate order, threshold rules, revalidation triggers, authority checks, and execution-adapter boundaries.",
  },
  {
    id: "ROUTE-TEMPLATE-079",
    name: "Governed route template 079",
    sector: "Autonomous agents",
    expectedDetermination: "ESCALATE",
    gateCount: 19,
    version: "4.19.0",
    consequenceClass: "CRITICAL",
    description: "Reference route 079 with frozen gate order, threshold rules, revalidation triggers, authority checks, and execution-adapter boundaries.",
  },
  {
    id: "ROUTE-TEMPLATE-080",
    name: "Governed route template 080",
    sector: "Cross-sector",
    expectedDetermination: "ALLOW",
    gateCount: 20,
    version: "5.0.0",
    consequenceClass: "LOW",
    description: "Reference route 080 with frozen gate order, threshold rules, revalidation triggers, authority checks, and execution-adapter boundaries.",
  },
];


const ENGINE_STACK = [
  { id: "ENG-01", title: "Canonical Record Validator", state: "CONNECTED", purpose: "Validates the bounded record and reason-code discipline before any downstream action." },
  { id: "ENG-02", title: "PDF Engine", state: "CONNECTED", purpose: "Renders the frozen canonical record into a stable human-readable institutional artifact." },
  { id: "ENG-03", title: "Governance Registration Gate", state: "CONNECTED", purpose: "Enforces the rule: no registered governance, no registered artifact." },
  { id: "ENG-04", title: "Artifact Registry Engine", state: "CONNECTED", purpose: "Assigns permanent registry identity and preserves append-only publication history." },
  { id: "ENG-05", title: "Disclosure Policy Engine", state: "CONNECTED", purpose: "Produces public, selective, restricted, and withheld projections without changing the source record." },
  { id: "ENG-06", title: "Verification & Reliance Engine", state: "CONNECTED", purpose: "States exactly what has been verified and what reliance the available evidence supports." },
  { id: "ENG-07", title: "Challenge & Correction Engine", state: "CONNECTED", purpose: "Preserves the original artifact while appending challenge, response, correction, and prospective reliance." },
  { id: "ENG-08", title: "Integrity & Hash Engine", state: "CONNECTED", purpose: "Detects any post-commit mutation across records, receipts, PDFs, manifests, and packages." },
  { id: "ENG-09", title: "Digital Signature Engine", state: "CONNECTED", purpose: "Binds accountable signers to the exact subject digests they attest and publish." },
  { id: "ENG-10", title: "Portfolio Export Engine", state: "CONNECTED", purpose: "Creates procurement, audit, regulatory, research, and comparative portfolios without collapsing artifact boundaries." },
] as const;

const navItems: { id: WorkspaceTab; label: string; eyebrow: string }[] = [
  { id: "command", label: "Command", eyebrow: "01" },
  { id: "scenario", label: "Scenario", eyebrow: "02" },
  { id: "route", label: "Route", eyebrow: "03" },
  { id: "evidence", label: "Evidence", eyebrow: "04" },
  { id: "authority", label: "Authority", eyebrow: "05" },
  { id: "continuity", label: "Continuity", eyebrow: "06" },
  { id: "admissibility", label: "Admissibility", eyebrow: "07" },
  { id: "runtime", label: "Gate runtime", eyebrow: "08" },
  { id: "commit", label: "Commit", eyebrow: "09" },
  { id: "execution", label: "Execution", eyebrow: "10" },
  { id: "outcome", label: "Outcome", eyebrow: "11" },
  { id: "integrity", label: "Integrity", eyebrow: "12" },
  { id: "review", label: "Review", eyebrow: "13" },
  { id: "publication", label: "Publication", eyebrow: "14" },
  { id: "timeline", label: "Timeline", eyebrow: "15" },
  { id: "diff", label: "Diff", eyebrow: "16" },
  { id: "templates", label: "Templates", eyebrow: "17" },
  { id: "reports", label: "Reports", eyebrow: "18" },
];

function splitLines(value: string): string[] {
  return value.split(/\n|,/).map((item) => item.trim()).filter(Boolean);
}

function downloadText(filename: string, text: string, type = "application/json") {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function completionScore(snapshot: StudioSnapshot): number {
  const checks = [
    snapshot.governance.registrationStatus === "REGISTERED" && snapshot.governance.registrationId !== "UNBOUND",
    Boolean(snapshot.scenario.proposedAction.trim()),
    Boolean(snapshot.scenario.consequenceAtStake.trim()),
    Boolean(snapshot.route.routeId.trim()),
    Boolean(snapshot.route.routeVersion.trim()),
    snapshot.evidence.length > 0,
    snapshot.evidence.every((item) => item.sourceName.trim() && item.capturedAt),
    snapshot.authorities.length > 0,
    snapshot.authorities.some((item) => item.state === "VALID"),
    snapshot.gates.length > 0,
    snapshot.gates.every((gate) => gate.status !== "PENDING"),
    Boolean(snapshot.commitReason.trim()),
    Boolean(snapshot.execution.receiptId.trim()),
    Boolean(snapshot.outcome.actualResult.trim()),
    Boolean(snapshot.proves.trim()),
    Boolean(snapshot.doesNotProve.trim()),
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

function determineFromGates(gates: GateDraft[]): Determination {
  const ordered = [...gates].sort((a, b) => a.sequence - b.sequence);
  const firstFailure = ordered.find((gate) => gate.mandatory && gate.status === "FAIL");
  if (firstFailure) {
    if (firstFailure.chainLink === "AUTHORITY" as ChainLink) return "DENY";
    if (["BINDING", "EXECUTION"].includes(firstFailure.chainLink)) return "DENY";
    return "HOLD";
  }
  if (ordered.some((gate) => gate.status === "UNRESOLVED")) return "ESCALATE";
  if (ordered.some((gate) => gate.status === "PENDING")) return "HOLD";
  return "ALLOW";
}

function expectedEffect(determination: Determination) {
  if (determination === "ALLOW") return "RELEASED";
  if (determination === "HOLD") return "HELD";
  if (determination === "DENY") return "BLOCKED";
  return "HUMAN_CHECKPOINT_REQUIRED";
}

function makeExport(snapshot: StudioSnapshot) {
  const artifactId = createArtifactId(snapshot.scenario.sequence);
  return {
    schema: "ta14.artifact-studio.workspace.v2",
    engineVersion: ARTIFACT_ENGINE_VERSION,
    artifactId,
    generatedAt: new Date().toISOString(),
    publicationState: snapshot.publicationState,
    identity: {
      artifactId,
      seriesId: snapshot.scenario.seriesId,
      sequence: snapshot.scenario.sequence,
      title: snapshot.scenario.title,
      classification: snapshot.scenario.classification,
      primaryGovernance: snapshot.scenario.primaryGovernance,
      sector: snapshot.scenario.sector,
      jurisdiction: snapshot.scenario.jurisdiction,
    },
    scenario: snapshot.scenario,
    route: snapshot.route,
    evidence: snapshot.evidence,
    authorities: snapshot.authorities,
    gateLedger: snapshot.gates,
    commit: {
      determination: snapshot.determination,
      reason: snapshot.commitReason,
      expectedExecutionEffect: expectedEffect(snapshot.determination),
    },
    execution: snapshot.execution,
    outcome: snapshot.outcome,
    proofBoundary: {
      proves: splitLines(snapshot.proves),
      doesNotProve: splitLines(snapshot.doesNotProve),
    },
  };
}

function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: string }) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}

function SectionTitle({ eyebrow, title, description, actions }: { eyebrow: string; title: string; description: string; actions?: ReactNode }) {
  return (
    <div className="section-title">
      <div>
        <span>{eyebrow}</span>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      {actions ? <div className="section-actions">{actions}</div> : null}
    </div>
  );
}

function Field({ label, hint, children, wide = false }: { label: string; hint?: string; children: ReactNode; wide?: boolean }) {
  return (
    <label className={`field ${wide ? "field-wide" : ""}`}>
      <span className="field-label">{label}</span>
      {children}
      {hint ? <small>{hint}</small> : null}
    </label>
  );
}

function Metric({ label, value, note, tone = "cyan" }: { label: string; value: string | number; note: string; tone?: string }) {
  return (
    <article className={`metric metric-${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      <p>{note}</p>
    </article>
  );
}

function EmptyState({ title, text }: { title: string; text: string }) {
  return <div className="empty"><strong>{title}</strong><p>{text}</p></div>;
}

function StudioPage() {
  const [tab, setTab] = useState<WorkspaceTab>("command");
  const [snapshot, setSnapshot] = useState<StudioSnapshot>(initialSnapshot);
  const [savedAt, setSavedAt] = useState<string>("");
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");
  const [selectedEvidence, setSelectedEvidence] = useState<string>(defaultEvidence[0]?.id ?? "");
  const [selectedAuthority, setSelectedAuthority] = useState<string>(defaultAuthorities[0]?.id ?? "");
  const [selectedGate, setSelectedGate] = useState<string>(defaultGates[0]?.id ?? "");
  const [showJson, setShowJson] = useState(false);
  const [history, setHistory] = useState<StudioSnapshot[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [dragActive, setDragActive] = useState(false);
  const importRef = useRef<HTMLInputElement>(null);
  const [registryRecords, setRegistryRecords] = useState<RegistryBindingRecord[]>([]);
  const [registryRecordsLoading, setRegistryRecordsLoading] = useState(true);
  const [registryRecordsError, setRegistryRecordsError] = useState("");
  const [showGovernancePicker, setShowGovernancePicker] = useState(false);
  const supabase = useMemo(() => {
    try {
      return createClient();
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    try {
      let recovered: StudioSnapshot = initialSnapshot;
      let recoveredDraft = false;
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<StudioSnapshot>;
        if (parsed?.scenario && parsed?.route && Array.isArray(parsed?.gates)) {
          recovered = {
            ...initialSnapshot,
            ...parsed,
            governance: parsed.governance ?? initialSnapshot.governance,
            scenario: { ...initialSnapshot.scenario, ...parsed.scenario },
            route: { ...initialSnapshot.route, ...parsed.route },
            execution: { ...initialSnapshot.execution, ...parsed.execution },
            outcome: { ...initialSnapshot.outcome, ...parsed.outcome },
          } as StudioSnapshot;
          recoveredDraft = true;
        }
      }

      const handoffRaw = localStorage.getItem(ROUTE_STUDIO_HANDOFF_KEY);
      if (handoffRaw) {
        const handoffCandidate: unknown = JSON.parse(handoffRaw);
        if (isRouteStudioHandoff(handoffCandidate)) {
          recovered = applyRouteStudioHandoff(recovered, handoffCandidate);
          localStorage.removeItem(ROUTE_STUDIO_HANDOFF_KEY);
          setSnapshot(recovered);
          setNotice(`Imported registered governance ${handoffCandidate.governance.registrationId} and route ${handoffCandidate.route.rid ?? handoffCandidate.route.name}. Source route receipts remain evidence only until the Studio creates an execution receipt.`);
          return;
        }
        localStorage.removeItem(ROUTE_STUDIO_HANDOFF_KEY);
        setNotice("The registered-governance route handoff was invalid and was not imported.");
      }

      if (recoveredDraft) {
        setSnapshot(recovered);
        setNotice("Recovered the last local Artifact Studio draft.");
      }
    } catch {
      setNotice("A stored draft or route handoff could not be recovered. A clean workspace was loaded.");
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadRegisteredGovernance() {
      setRegistryRecordsLoading(true);
      setRegistryRecordsError("");

      try {
        if (!supabase) {
          throw new Error("Registry connection is not configured in this browser.");
        }

        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;
        if (!session?.access_token) {
          throw new Error("Sign in to select one of your registered governance records.");
        }

        const response = await fetch("/api/registry/my-records", {
          method: "GET",
          cache: "no-store",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            Accept: "application/json",
          },
        });

        const payload = await response.json() as RegistryBindingResponse;
        if (!response.ok) {
          throw new Error(payload.message || "Registered governance records could not be loaded.");
        }

        const eligible = (payload.records ?? []).filter((record) => {
          const normalizedStatus = record.status.trim().toLowerCase();
          const normalizedRegistrationState = record.registrationState?.trim().toLowerCase() ?? "";
          const completedRegistryState =
            normalizedStatus === "registered"
            || normalizedStatus === "published"
            || normalizedRegistrationState === "registered"
            || normalizedRegistrationState === "published";

          return Boolean(record.registryIdentifier)
            && completedRegistryState
            && !record.needsAttention;
        });

        if (!cancelled) setRegistryRecords(eligible);
      } catch (caught) {
        if (!cancelled) {
          setRegistryRecords([]);
          setRegistryRecordsError(caught instanceof Error ? caught.message : "Registered governance records could not be loaded.");
        }
      } finally {
        if (!cancelled) setRegistryRecordsLoading(false);
      }
    }

    void loadRegisteredGovernance();
    return () => {
      cancelled = true;
    };
  }, [supabase]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const next = { ...snapshot, updatedAt: new Date().toISOString() };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        setSavedAt(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
      } catch {
        setNotice("Local persistence is unavailable in this browser context.");
      }
    }, AUTOSAVE_DELAY);
    return () => window.clearTimeout(timer);
  }, [snapshot]);

  useEffect(() => {
    const onKey = (event: globalThis.KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        exportJson();
      }
      if (event.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        event.preventDefault();
        document.getElementById("studio-search")?.focus();
      }
      if (event.key === "Escape") {
        setShowJson(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const score = useMemo(() => completionScore(snapshot), [snapshot]);
  const governanceBound = snapshot.governance.registrationStatus === "REGISTERED" && snapshot.governance.registrationId !== "UNBOUND";
  const artifactId = useMemo(() => createArtifactId(snapshot.scenario.sequence), [snapshot.scenario.sequence]);
  const earliestFailure = useMemo(
    () => [...snapshot.gates].sort((a, b) => a.sequence - b.sequence).find((gate) => gate.mandatory && ["FAIL", "UNRESOLVED", "PENDING"].includes(gate.status)),
    [snapshot.gates],
  );
  const filteredPatterns = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return controlPatterns.slice(0, 32);
    return controlPatterns.filter((item) => canonicalStringify(item).toLowerCase().includes(q)).slice(0, 80);
  }, [query]);
  const filteredEvidenceTemplates = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return evidenceTemplates.slice(0, 24);
    return evidenceTemplates.filter((item) => canonicalStringify(item).toLowerCase().includes(q)).slice(0, 60);
  }, [query]);
  const filteredRoutes = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return routeTemplates.slice(0, 24);
    return routeTemplates.filter((item) => canonicalStringify(item).toLowerCase().includes(q)).slice(0, 60);
  }, [query]);

  function mutate(updater: (draft: StudioSnapshot) => StudioSnapshot, track = true) {
    setSnapshot((current) => {
      if (track) {
        setHistory((items) => [...items.slice(-24), current]);
        setHistoryIndex(-1);
      }
      return updater(current);
    });
  }

  function updateScenario<K extends keyof ScenarioForm>(key: K, value: ScenarioForm[K]) {
    mutate((current) => ({ ...current, scenario: { ...current.scenario, [key]: value } }));
  }

  function updateRoute<K extends keyof RouteForm>(key: K, value: RouteForm[K]) {
    mutate((current) => ({ ...current, route: { ...current.route, [key]: value } }));
  }

  function updateEvidence(id: string, patch: Partial<EvidenceDraft>) {
    mutate((current) => ({ ...current, evidence: current.evidence.map((item) => item.id === id ? { ...item, ...patch } : item) }));
  }

  function updateAuthority(id: string, patch: Partial<AuthorityDraft>) {
    mutate((current) => ({ ...current, authorities: current.authorities.map((item) => item.id === id ? { ...item, ...patch } : item) }));
  }

  function updateGate(id: string, patch: Partial<GateDraft>) {
    mutate((current) => ({ ...current, gates: current.gates.map((item) => item.id === id ? { ...item, ...patch } : item) }));
  }

  function addEvidence(template?: EvidenceTemplate) {
    const id = makeId("EVIDENCE");
    const item: EvidenceDraft = {
      id,
      title: template?.title ?? "New evidence item",
      description: template?.notes ?? "Describe the fact, source, and consequence this evidence supports.",
      sourceType: template?.category ?? "DOCUMENT",
      sourceName: "",
      sourceUri: "",
      capturedAt: nowLocal(),
      validUntil: "",
      custody: "",
      freshnessHours: 24,
      hash: "PENDING-CANONICALIZATION",
      disclosure: template?.defaultDisclosure ?? "SELECTIVE",
      state: "DRAFT",
      notes: template?.admissibilityQuestion ?? "",
    };
    mutate((current) => ({ ...current, evidence: [...current.evidence, item] }));
    setSelectedEvidence(id);
    setTab("evidence");
  }

  function addAuthority() {
    const id = makeId("AUTHORITY");
    const item: AuthorityDraft = {
      id,
      actor: "New authority actor",
      role: "",
      organization: "",
      authoritySource: "",
      scope: "",
      delegatedBy: "",
      validFrom: nowLocal(),
      validUntil: "",
      state: "UNRESOLVED" as AuthorityState,
      conflict: "Not reviewed",
      notes: "",
    };
    mutate((current) => ({ ...current, authorities: [...current.authorities, item] }));
    setSelectedAuthority(id);
    setTab("authority");
  }

  function evaluateAllGates() {
    mutate((current) => {
      const hasEvidence = current.evidence.some((item) => item.state === "ADMITTED");
      const validAuthority = current.authorities.some((item) => item.state === "VALID");
      const gates = current.gates.map((gate) => {
        let status: GateStatus = "PASS";
        let resultSummary = "Required condition satisfied by the current draft state.";
        let reasonCode = "GATE_PASS";
        if (gate.chainLink === "RECORD" && !hasEvidence) {
          status = "FAIL"; resultSummary = "No admitted evidence supports the proposed action."; reasonCode = "EVIDENCE_REQUIRED";
        }
        if (gate.chainLink === "CONTINUITY" && current.evidence.some((item) => item.state === "EXPIRED")) {
          status = "FAIL"; resultSummary = "At least one required evidence item is expired."; reasonCode = "EVIDENCE_EXPIRED";
        }
        if (gate.chainLink === "ADMISSIBILITY" && current.evidence.some((item) => ["DRAFT", "REJECTED"].includes(item.state))) {
          status = "UNRESOLVED"; resultSummary = "Evidence admissibility remains unresolved or rejected."; reasonCode = "ADMISSIBILITY_UNRESOLVED";
        }
        if (gate.chainLink === "BINDING" && !current.route.policyBasis.trim()) {
          status = "FAIL"; resultSummary = "No binding policy basis is recorded."; reasonCode = "BINDING_BASIS_MISSING";
        }
        if (gate.chainLink === "COMMIT" && !validAuthority) {
          status = "FAIL"; resultSummary = "No valid authority can commit this action."; reasonCode = "AUTHORITY_INVALID";
        }
        return { ...gate, status, resultSummary, reasonCode, inputSummary: `Evaluated against ${current.evidence.length} evidence item(s) and ${current.authorities.length} authority record(s).` };
      });
      const determination = determineFromGates(gates);
      return {
        ...current,
        gates,
        determination,
        commitReason: `Runtime evaluation produced ${determination}. Earliest controlling condition: ${gates.find((g) => g.status !== "PASS")?.title ?? "all mandatory gates passed"}.`,
        execution: { ...current.execution, expectedEffect: expectedEffect(determination) },
      };
    });
    setNotice("Gate runtime completed and the earliest controlling condition was recomputed.");
  }

  function commitDetermination() {
    mutate((current) => ({
      ...current,
      determination: determineFromGates(current.gates),
      commitReason: current.commitReason || "Determination committed from the frozen gate ledger.",
      publicationState: "INTERNAL_REVIEW",
    }));
    setNotice("Determination committed. The current route, evidence, authority, and gate state should now be treated as frozen for this event.");
  }

  function executeReferenceAdapter() {
    mutate((current) => {
      const effect = expectedEffect(current.determination);
      const statusCode = effect === "RELEASED" ? "200" : effect === "HELD" ? "423" : effect === "BLOCKED" ? "403" : "202";
      return {
        ...current,
        execution: {
          ...current.execution,
          actualEffect: effect,
          technicalStatusCode: statusCode,
          technicalMessage: `Reference adapter enforced ${current.determination} as ${effect}.`,
          receiptId: makeId("RECEIPT"),
          receiptHash: `sha256:pending-${Date.now().toString(16)}`,
        },
      };
    });
    setNotice("Reference execution adapter produced a technical control receipt.");
  }

  function closeOutcome() {
    mutate((current) => ({
      ...current,
      outcome: {
        ...current.outcome,
        actualResult: current.execution.actualEffect === "RELEASED" ? "The exact bounded action was released to the controlled destination." : `The proposed action did not bind to reality; the adapter produced ${current.execution.actualEffect}.`,
        consequenceState: current.execution.actualEffect === "RELEASED" ? "BOUNDED_CONSEQUENCE_OCCURRED" : "CONSEQUENCE_PREVENTED",
        closureEvidence: `Execution receipt ${current.execution.receiptId || "not yet generated"}; adapter status ${current.execution.technicalStatusCode || "pending"}.`,
        residualRisk: "Residual risk is limited to the declared demonstration boundary and future state changes requiring revalidation.",
        correctiveAction: current.determination === "ALLOW" ? "No corrective action required." : "Repair the earliest failed condition and create a new governed run; do not alter the original event.",
      },
    }));
    setNotice("Outcome closure created from the preserved execution effect.");
  }

  function publishArtifact() {
    if (!governanceBound) {
      setTab("command");
      setNotice("Publication blocked: select a completed registered governance record first. No registered governance. No registered artifact.");
      return;
    }
    if (score < 80) {
      setNotice("Publication blocked: the artifact has not reached the minimum publication-readiness threshold.");
      return;
    }
    mutate((current) => ({ ...current, publicationState: "PUBLISHED" }));
    setNotice(`Artifact ${artifactId} marked PUBLISHED in this workspace under ${snapshot.governance.registrationId}. Registration and publication are not certification.`);
  }

  function exportJson() {
    const payload = makeExport(snapshot);
    downloadText(`${artifactId}.canonical.json`, JSON.stringify(payload, null, 2));
    setNotice("Canonical JSON workspace package downloaded.");
  }

  function exportManifest() {
    const payload = makeExport(snapshot);
    const manifest = {
      artifactId,
      engineVersion: ARTIFACT_ENGINE_VERSION,
      canonicalization: "ta14.c14n.v1",
      generatedAt: new Date().toISOString(),
      recordHash: "PENDING-CRYPTOGRAPHIC-PACKAGER",
      packageRootHash: "PENDING-CRYPTOGRAPHIC-PACKAGER",
      components: [
        "bounded-record.pdf",
        "canonical-record.json",
        "evidence-manifest.json",
        "authority-record.json",
        "gate-ledger.json",
        "commit-record.json",
        "execution-receipt.json",
        "outcome-record.json",
        "integrity-manifest.json",
        "verification-instructions.txt",
      ],
      paritySource: canonicalStringify(payload),
    };
    downloadText(`${artifactId}.integrity-manifest.json`, JSON.stringify(manifest, null, 2));
    setNotice("Integrity manifest scaffold downloaded.");
  }

  function exportCsv() {
    const rows = snapshot.gates.map((gate) => [gate.sequence, gate.id, gate.chainLink, gate.title, gate.status, gate.reasonCode, gate.resultSummary]);
    const csv = [["sequence", "gate_id", "chain_link", "title", "status", "reason_code", "result"], ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(","))
      .join("\n");
    downloadText(`${artifactId}.gate-ledger.csv`, csv, "text/csv");
    setNotice("Gate ledger CSV downloaded.");
  }

  async function importFile(file: File) {
    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as StudioSnapshot | { workspace?: StudioSnapshot };
      const candidate = "workspace" in parsed && parsed.workspace ? parsed.workspace : parsed as StudioSnapshot;
      if (!candidate.scenario || !candidate.route || !Array.isArray(candidate.gates)) throw new Error("Invalid workspace package");
      setHistory((items) => [...items.slice(-24), snapshot]);
      setSnapshot(candidate);
      setNotice(`Imported ${file.name}.`);
    } catch {
      setNotice("Import failed. Select a valid TA-14 Artifact Studio JSON workspace package.");
    }
  }

  function onDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragActive(false);
    const file = event.dataTransfer.files?.[0];
    if (file) void importFile(file);
  }

  function undo() {
    if (!history.length) return;
    const target = history[history.length - 1];
    setHistory((items) => items.slice(0, -1));
    setSnapshot(target);
    setHistoryIndex(history.length - 1);
    setNotice("Restored the previous workspace snapshot.");
  }

  function resetWorkspace() {
    if (!window.confirm("Reset the Artifact Studio workspace? The current browser draft will be replaced.")) return;
    setHistory((items) => [...items.slice(-24), snapshot]);
    setSnapshot({ ...initialSnapshot, updatedAt: new Date().toISOString() });
    setNotice("Artifact Studio reset to the canonical founding scenario.");
  }

  const selectedEvidenceItem = snapshot.evidence.find((item) => item.id === selectedEvidence) ?? snapshot.evidence[0];
  const selectedAuthorityItem = snapshot.authorities.find((item) => item.id === selectedAuthority) ?? snapshot.authorities[0];
  const selectedGateItem = snapshot.gates.find((item) => item.id === selectedGate) ?? snapshot.gates[0];

  function bindRegisteredGovernance(record: RegistryBindingRecord) {
    const normalizedStatus = record.status.trim().toLowerCase();
    const normalizedRegistrationState = record.registrationState?.trim().toLowerCase() ?? "";
    const completedRegistryState =
      normalizedStatus === "registered"
      || normalizedStatus === "published"
      || normalizedRegistrationState === "registered"
      || normalizedRegistrationState === "published";

    if (!record.registryIdentifier || !completedRegistryState || record.needsAttention) {
      setNotice("Only completed Registry records with permanent TA-14 identifiers can sponsor an artifact.");
      return;
    }

    const boundAt = new Date().toISOString();
    mutate((draft) => ({
      ...draft,
      governance: {
        registrationId: record.registryIdentifier!,
        organizationName: record.organizationName?.trim() || record.currentSteward?.trim() || record.governanceName,
        architectureName: record.governanceName,
        architectureVersion: record.currentVersion,
        registrationStatus: "REGISTERED",
        verificationLevel: 0,
        sourceHandoffAt: boundAt,
        routeOwner: "",
        routeDomain: "",
        selectedStage: "",
        sourceRouteReceiptId: "",
        correlationId: "",
      },
      scenario: {
        ...draft.scenario,
        primaryGovernance: `${record.governanceName} v${record.currentVersion}`,
      },
      updatedAt: boundAt,
    }));
    setShowGovernancePicker(false);
    setNotice(`Bound this artifact workspace to ${record.registryIdentifier} — ${record.governanceName} v${record.currentVersion}. The Registry record remains unchanged.`);
  }

  function clearGovernanceBinding() {
    mutate((draft) => ({
      ...draft,
      governance: { ...defaultGovernanceBinding },
      updatedAt: new Date().toISOString(),
    }));
    setShowGovernancePicker(false);
    setNotice("Removed the workspace governance binding. No Registry record was changed.");
  }

  function renderCommand() {
    return (
      <section>
        <SectionTitle eyebrow="Institutional command" title="Artifact production command center" description="Build the record, run the route, prove the control effect, close the outcome, and package the exact event for independent inspection." actions={<><button onClick={evaluateAllGates}>Run all gates</button><button className="primary" onClick={commitDetermination}>Commit determination</button></>} />
        <div className="three-col">
          <article className="panel">
            <h3>Registered governance binding</h3>
            <p><strong>{snapshot.governance.organizationName}</strong></p>
            <p>{snapshot.governance.architectureName}{snapshot.governance.architectureVersion ? ` v${snapshot.governance.architectureVersion}` : ""}</p>
            <div className="tag-row"><Badge tone={snapshot.governance.registrationStatus === "REGISTERED" ? "pass" : "hold"}>{snapshot.governance.registrationStatus}</Badge><code>{snapshot.governance.registrationId}</code></div>
            <div className="button-row" style={{ marginTop: 12 }}>
              <button type="button" onClick={() => setShowGovernancePicker((value) => !value)}>
                {snapshot.governance.registrationStatus === "REGISTERED" ? "Change registered governance" : "Select registered governance"}
              </button>
              {snapshot.governance.registrationStatus === "REGISTERED" ? (
                <button type="button" onClick={clearGovernanceBinding}>Clear binding</button>
              ) : null}
            </div>
            {showGovernancePicker ? (
              <div style={{ marginTop: 12 }}>
                {registryRecordsLoading ? <small>Loading your completed Registry records…</small> : null}
                {!registryRecordsLoading && registryRecordsError ? (
                  <small>{registryRecordsError}</small>
                ) : null}
                {!registryRecordsLoading && !registryRecordsError && registryRecords.length === 0 ? (
                  <small>No eligible registered governance records were found for this signed-in account. Complete registration first, then return to the Studio.</small>
                ) : null}
                {!registryRecordsLoading && registryRecords.length > 0 ? (
                  <label style={{ display: "grid", gap: 6 }}>
                    <span>Select one of your registered governance records</span>
                    <select
                      defaultValue=""
                      onChange={(event) => {
                        const selected = registryRecords.find((record) => record.registryIdentifier === event.target.value);
                        if (selected) bindRegisteredGovernance(selected);
                      }}
                    >
                      <option value="" disabled>Choose a Registry record…</option>
                      {registryRecords.map((record) => (
                        <option key={record.id} value={record.registryIdentifier ?? ""}>
                          {record.registryIdentifier} — {record.governanceName} — v{record.currentVersion}
                        </option>
                      ))}
                    </select>
                  </label>
                ) : null}
                <p style={{ marginTop: 10 }}><small>Binding links this workspace to the selected permanent Registry identity. It does not modify, certify, endorse, or replace the Registry record.</small></p>
                <Link href="/workspace/ai-governance/registry/my-records">Open My Registry Records →</Link>
              </div>
            ) : null}
          </article>
          <article className="panel">
            <h3>Imported route identity</h3>
            <p><strong>{snapshot.route.routeId}</strong></p>
            <p>{snapshot.route.routeTitle} · v{snapshot.route.routeVersion}</p>
            <small>{snapshot.governance.routeDomain || "Route domain not declared"} · {snapshot.governance.routeOwner || "Route owner not declared"}</small>
          </article>
          <article className="panel">
            <h3>Handoff provenance</h3>
            <p>Correlation: <code>{snapshot.governance.correlationId || "NOT PROVIDED"}</code></p>
            <p>Route receipt: <code>{snapshot.governance.sourceRouteReceiptId || "NOT PROVIDED"}</code></p>
            <small>The route receipt is preserved as source evidence and never substituted for an artifact execution receipt.</small>
          </article>
        </div>

        <div className="metrics">
          <Metric label="Readiness" value={`${score}%`} note="Required workspace domains populated" tone={score >= 90 ? "green" : "cyan"} />
          <Metric label="Determination" value={snapshot.determination} note={`Expected effect: ${expectedEffect(snapshot.determination)}`} tone={snapshot.determination.toLowerCase()} />
          <Metric label="Evidence" value={snapshot.evidence.length} note={`${snapshot.evidence.filter((item) => item.state === "ADMITTED").length} admitted`} tone="gold" />
          <Metric label="Gate ledger" value={snapshot.gates.length} note={`${snapshot.gates.filter((gate) => gate.status === "PASS").length} passed`} tone="violet" />
          <Metric label="Verification" value={snapshot.outcome.independentlyVerified ? "L6" : snapshot.execution.receiptId ? "L5" : "L0"} note="Current achievable verification level" tone="green" />
          <Metric label="Publication" value={snapshot.publicationState} note={`Local save ${savedAt || "pending"}`} tone="cyan" />
        </div>

        <div className="engine-orchestration">
          <div className="engine-orchestration-head">
            <div><span>Ten-engine orchestration layer</span><h3>One governed workflow. One canonical record.</h3><p>The Studio coordinates the complete institutional stack while keeping every engine bounded to its own responsibility.</p></div>
            <div className="engine-health"><strong>10 / 10</strong><span>engines connected</span></div>
          </div>
          <div className="engine-grid">
            {ENGINE_STACK.map((engine, index) => <article key={engine.id}><div><span>{String(index + 1).padStart(2, "0")}</span><Badge tone="pass">{engine.state}</Badge></div><h4>{engine.title}</h4><p>{engine.purpose}</p></article>)}
          </div>
          <div className="engine-flow">
            <span>REGISTER GOVERNANCE</span><i>→</i><span>BUILD ROUTE</span><i>→</i><span>CREATE RECORD</span><i>→</i><span>VALIDATE</span><i>→</i><span>RENDER PDF</span><i>→</i><span>VERIFY</span><i>→</i><span>REGISTER ARTIFACT</span>
          </div>
        </div>

        <div className="command-grid">
          <article className="hero-panel">
            <div className="hero-kicker">Eighth door / artifact institution</div>
            <h3>{artifactId}</h3>
            <h4>{snapshot.scenario.title}</h4>
            <p>{snapshot.scenario.consequenceAtStake}</p>
            <div className="chain-strip">
              {CHAIN_LINKS.map((link) => {
                const gates = snapshot.gates.filter((gate) => gate.chainLink === link);
                const state = gates.some((gate) => gate.status === "FAIL") ? "fail" : gates.some((gate) => ["PENDING", "UNRESOLVED"].includes(gate.status)) ? "pending" : "pass";
                return <button key={link} className={`chain-link chain-${state}`} onClick={() => { setTab(link === "EXECUTION" ? "execution" : link === "OUTCOME" ? "outcome" : link === "COMMIT" ? "commit" : link === "BINDING" ? "admissibility" : link.toLowerCase() as WorkspaceTab); }}>{link}</button>;
              })}
            </div>
            <div className="proof-callout">
              <span>Earliest controlling condition</span>
              <strong>{earliestFailure ? `${earliestFailure.sequence}. ${earliestFailure.title}` : "No unresolved mandatory condition"}</strong>
              <p>{earliestFailure?.resultSummary ?? "All mandatory gates presently support the committed path."}</p>
            </div>
          </article>
          <article className="panel">
            <h3>Run sequence</h3>
            <ol className="run-sequence">
              <li><button onClick={() => setTab("scenario")}>Define proposed consequence</button><Badge tone={snapshot.scenario.proposedAction ? "pass" : "hold"}>{snapshot.scenario.proposedAction ? "READY" : "MISSING"}</Badge></li>
              <li><button onClick={() => setTab("route")}>Freeze route and version</button><Badge tone={snapshot.route.routeVersion ? "pass" : "hold"}>{snapshot.route.routeVersion || "MISSING"}</Badge></li>
              <li><button onClick={() => setTab("evidence")}>Admit evidence</button><Badge tone={snapshot.evidence.some((e) => e.state === "ADMITTED") ? "pass" : "hold"}>{snapshot.evidence.filter((e) => e.state === "ADMITTED").length}</Badge></li>
              <li><button onClick={() => setTab("authority")}>Resolve authority</button><Badge tone={snapshot.authorities.some((a) => a.state === "VALID") ? "pass" : "deny"}>{snapshot.authorities.filter((a) => a.state === "VALID").length}</Badge></li>
              <li><button onClick={evaluateAllGates}>Evaluate mandatory gates</button><Badge tone={snapshot.gates.every((g) => g.status !== "PENDING") ? "pass" : "hold"}>{snapshot.gates.filter((g) => g.status === "PENDING").length} pending</Badge></li>
              <li><button onClick={commitDetermination}>Commit before action</button><Badge tone={snapshot.publicationState !== "DRAFT" ? "pass" : "hold"}>{snapshot.determination}</Badge></li>
              <li><button onClick={executeReferenceAdapter}>Enforce technical effect</button><Badge tone={snapshot.execution.receiptId ? "pass" : "hold"}>{snapshot.execution.actualEffect}</Badge></li>
              <li><button onClick={closeOutcome}>Close and verify outcome</button><Badge tone={snapshot.outcome.actualResult ? "pass" : "hold"}>{snapshot.outcome.consequenceState}</Badge></li>
            </ol>
          </article>
        </div>
        <div className="three-col">
          <article className="panel"><h3>What this record proves</h3><p>{snapshot.proves}</p><button onClick={() => setTab("publication")}>Edit proof boundary</button></article>
          <article className="panel"><h3>What this record does not prove</h3><p>{snapshot.doesNotProve}</p><button onClick={() => setTab("publication")}>Review claims boundary</button></article>
          <article className="panel"><h3>Package status</h3><ul className="compact-list"><li>Canonical JSON <Badge tone="pass">AVAILABLE</Badge></li><li>Integrity manifest <Badge tone={snapshot.execution.receiptId ? "pass" : "hold"}>{snapshot.execution.receiptId ? "READY" : "WAITING"}</Badge></li><li>Bounded-record PDF <Badge tone="hold">RENDERER NEXT</Badge></li><li>Verification instructions <Badge tone="pass">SCAFFOLDED</Badge></li></ul></article>
        </div>
      </section>
    );
  }

  function renderScenario() {
    return <section><SectionTitle eyebrow="Reality / proposed consequence" title="Scenario builder" description="Define exactly what is proposed, what may bind to reality, who is affected, and which boundaries must remain visible." />
      <div className="form-grid">
        <Field label="Artifact title"><input value={snapshot.scenario.title} onChange={(e) => updateScenario("title", e.target.value)} /></Field>
        <Field label="Series ID"><input value={snapshot.scenario.seriesId} onChange={(e) => updateScenario("seriesId", e.target.value)} /></Field>
        <Field label="Sequence"><input type="number" min={1} value={snapshot.scenario.sequence} onChange={(e) => updateScenario("sequence", Math.max(1, Number(e.target.value) || 1))} /></Field>
        <Field label="Classification"><input value={snapshot.scenario.classification} onChange={(e) => updateScenario("classification", e.target.value)} /></Field>
        <Field label="Primary governance"><select value={snapshot.scenario.primaryGovernance} onChange={(e) => updateScenario("primaryGovernance", e.target.value)}><option value={snapshot.scenario.primaryGovernance}>{snapshot.scenario.primaryGovernance}</option>{GOVERNANCE_ARTIFACT_PROFILES.filter((p) => p.title !== snapshot.scenario.primaryGovernance).map((p) => <option key={p.profileId}>{p.title}</option>)}</select></Field>
        <Field label="Sector"><input value={snapshot.scenario.sector} onChange={(e) => updateScenario("sector", e.target.value)} /></Field>
        <Field label="Jurisdiction" wide><input value={snapshot.scenario.jurisdiction} onChange={(e) => updateScenario("jurisdiction", e.target.value)} /></Field>
        <Field label="Proposed action" wide><textarea rows={5} value={snapshot.scenario.proposedAction} onChange={(e) => updateScenario("proposedAction", e.target.value)} /></Field>
        <Field label="Consequence at stake" wide><textarea rows={5} value={snapshot.scenario.consequenceAtStake} onChange={(e) => updateScenario("consequenceAtStake", e.target.value)} /></Field>
        <Field label="Affected subjects" wide><textarea rows={3} value={snapshot.scenario.affectedSubjects} onChange={(e) => updateScenario("affectedSubjects", e.target.value)} /></Field>
        <Field label="Environment" wide><textarea rows={3} value={snapshot.scenario.environment} onChange={(e) => updateScenario("environment", e.target.value)} /></Field>
        <Field label="Intended destination"><input value={snapshot.scenario.intendedDestination} onChange={(e) => updateScenario("intendedDestination", e.target.value)} /></Field>
        <Field label="Amount or quantity"><input value={snapshot.scenario.amountOrQuantity} onChange={(e) => updateScenario("amountOrQuantity", e.target.value)} /></Field>
        <Field label="Requested model"><input value={snapshot.scenario.requestedModel} onChange={(e) => updateScenario("requestedModel", e.target.value)} /></Field>
        <Field label="Requested tool"><input value={snapshot.scenario.requestedTool} onChange={(e) => updateScenario("requestedTool", e.target.value)} /></Field>
        <Field label="Assumptions" wide><textarea rows={4} value={snapshot.scenario.assumptions} onChange={(e) => updateScenario("assumptions", e.target.value)} /></Field>
        <Field label="Declared limits" wide><textarea rows={4} value={snapshot.scenario.declaredLimits} onChange={(e) => updateScenario("declaredLimits", e.target.value)} /></Field>
        <Field label="Demonstration classification"><label className="check"><input type="checkbox" checked={snapshot.scenario.simulated} onChange={(e) => updateScenario("simulated", e.target.checked)} /> Explicitly label this as a controlled demonstration event.</label></Field>
      </div>
    </section>;
  }

  function renderRoute() {
    return <section><SectionTitle eyebrow="Route resolver" title="Frozen governing route" description="Select the route, version, mandatory gate order, policy basis, permitted tools, destinations, and revalidation triggers before commitment." actions={<button onClick={() => setTab("templates")}>Browse route templates</button>} />
      <div className="form-grid">
        <Field label="Route ID"><input value={snapshot.route.routeId} onChange={(e) => updateRoute("routeId", e.target.value)} /></Field>
        <Field label="Route title"><input value={snapshot.route.routeTitle} onChange={(e) => updateRoute("routeTitle", e.target.value)} /></Field>
        <Field label="Route version"><input value={snapshot.route.routeVersion} onChange={(e) => updateRoute("routeVersion", e.target.value)} /></Field>
        <Field label="Jurisdiction profile"><input value={snapshot.route.jurisdictionProfile} onChange={(e) => updateRoute("jurisdictionProfile", e.target.value)} /></Field>
        <Field label="Binding policy basis" wide><textarea rows={8} value={snapshot.route.policyBasis} onChange={(e) => updateRoute("policyBasis", e.target.value)} /></Field>
        <Field label="Permitted models" wide><textarea rows={3} value={snapshot.route.permittedModels} onChange={(e) => updateRoute("permittedModels", e.target.value)} /></Field>
        <Field label="Permitted tools" wide><textarea rows={3} value={snapshot.route.permittedTools} onChange={(e) => updateRoute("permittedTools", e.target.value)} /></Field>
        <Field label="Permitted destinations" wide><textarea rows={3} value={snapshot.route.permittedDestinations} onChange={(e) => updateRoute("permittedDestinations", e.target.value)} /></Field>
        <Field label="Revalidation triggers" wide><textarea rows={5} value={snapshot.route.revalidationTriggers} onChange={(e) => updateRoute("revalidationTriggers", e.target.value)} /></Field>
      </div>
      <div className="panel"><h3>Frozen gate sequence</h3><div className="ledger compact">{snapshot.gates.map((gate) => <button key={gate.id} onClick={() => { setSelectedGate(gate.id); setTab("runtime"); }}><span>{String(gate.sequence).padStart(2, "0")}</span><strong>{gate.title}</strong><Badge tone={gate.status.toLowerCase()}>{gate.status}</Badge></button>)}</div></div>
    </section>;
  }

  function renderEvidence() {
    return <section><SectionTitle eyebrow="Record / evidence intake" title="Evidence manifest" description="Register source identity, capture time, custody, freshness, integrity commitment, disclosure state, and admissibility status." actions={<><button onClick={() => setTab("templates")}>Templates</button><button className="primary" onClick={() => addEvidence()}>Add evidence</button></>} />
      <div className="split">
        <div className="record-list">{snapshot.evidence.map((item) => <button key={item.id} className={selectedEvidenceItem?.id === item.id ? "active" : ""} onClick={() => setSelectedEvidence(item.id)}><span>{item.id}</span><strong>{item.title}</strong><small>{item.sourceType} · {item.state}</small></button>)}</div>
        {selectedEvidenceItem ? <div className="panel form-grid">
          <Field label="Evidence ID"><input value={selectedEvidenceItem.id} disabled /></Field>
          <Field label="State"><select value={selectedEvidenceItem.state} onChange={(e) => updateEvidence(selectedEvidenceItem.id, { state: e.target.value as EvidenceState })}>{["DRAFT","ADMITTED","REJECTED","CONDITIONAL","EXPIRED"].map((v) => <option key={v}>{v}</option>)}</select></Field>
          <Field label="Title" wide><input value={selectedEvidenceItem.title} onChange={(e) => updateEvidence(selectedEvidenceItem.id, { title: e.target.value })} /></Field>
          <Field label="Description" wide><textarea rows={4} value={selectedEvidenceItem.description} onChange={(e) => updateEvidence(selectedEvidenceItem.id, { description: e.target.value })} /></Field>
          <Field label="Source type"><input value={selectedEvidenceItem.sourceType} onChange={(e) => updateEvidence(selectedEvidenceItem.id, { sourceType: e.target.value })} /></Field>
          <Field label="Source name"><input value={selectedEvidenceItem.sourceName} onChange={(e) => updateEvidence(selectedEvidenceItem.id, { sourceName: e.target.value })} /></Field>
          <Field label="Source URI" wide><input value={selectedEvidenceItem.sourceUri} onChange={(e) => updateEvidence(selectedEvidenceItem.id, { sourceUri: e.target.value })} /></Field>
          <Field label="Captured at"><input type="datetime-local" value={selectedEvidenceItem.capturedAt} onChange={(e) => updateEvidence(selectedEvidenceItem.id, { capturedAt: e.target.value })} /></Field>
          <Field label="Valid until"><input type="datetime-local" value={selectedEvidenceItem.validUntil} onChange={(e) => updateEvidence(selectedEvidenceItem.id, { validUntil: e.target.value })} /></Field>
          <Field label="Freshness hours"><input type="number" min={0} value={selectedEvidenceItem.freshnessHours} onChange={(e) => updateEvidence(selectedEvidenceItem.id, { freshnessHours: Number(e.target.value) || 0 })} /></Field>
          <Field label="Disclosure"><select value={selectedEvidenceItem.disclosure} onChange={(e) => updateEvidence(selectedEvidenceItem.id, { disclosure: e.target.value as Disclosure })}>{["PUBLIC","SELECTIVE","RESTRICTED","WITHHELD"].map((v) => <option key={v}>{v}</option>)}</select></Field>
          <Field label="Custody" wide><textarea rows={3} value={selectedEvidenceItem.custody} onChange={(e) => updateEvidence(selectedEvidenceItem.id, { custody: e.target.value })} /></Field>
          <Field label="Hash commitment" wide><input value={selectedEvidenceItem.hash} onChange={(e) => updateEvidence(selectedEvidenceItem.id, { hash: e.target.value })} /></Field>
          <Field label="Notes" wide><textarea rows={4} value={selectedEvidenceItem.notes} onChange={(e) => updateEvidence(selectedEvidenceItem.id, { notes: e.target.value })} /></Field>
          <button className="danger" onClick={() => mutate((current) => ({ ...current, evidence: current.evidence.filter((item) => item.id !== selectedEvidenceItem.id) }))}>Remove evidence item</button>
        </div> : <EmptyState title="No evidence selected" text="Add or select an evidence item to inspect its provenance and admissibility fields." />}
      </div>
    </section>;
  }

  function renderAuthority() {
    return <section><SectionTitle eyebrow="Authority resolver" title="Identity, delegation, scope, and conflict" description="Authority is an execution condition. Resolve who may commit, approve, review, execute, and publish before consequence can bind." actions={<button className="primary" onClick={addAuthority}>Add authority</button>} />
      <div className="split">
        <div className="record-list">{snapshot.authorities.map((item) => <button key={item.id} className={selectedAuthorityItem?.id === item.id ? "active" : ""} onClick={() => setSelectedAuthority(item.id)}><span>{item.id}</span><strong>{item.actor}</strong><small>{item.role} · {item.state}</small></button>)}</div>
        {selectedAuthorityItem ? <div className="panel form-grid">
          <Field label="Authority ID"><input value={selectedAuthorityItem.id} disabled /></Field>
          <Field label="State"><select value={selectedAuthorityItem.state} onChange={(e) => updateAuthority(selectedAuthorityItem.id, { state: e.target.value as AuthorityState })}>{["VALID","MISSING","EXPIRED","REVOKED","OUT_OF_SCOPE","CONFLICTED"].map((v) => <option key={v}>{v}</option>)}</select></Field>
          <Field label="Actor"><input value={selectedAuthorityItem.actor} onChange={(e) => updateAuthority(selectedAuthorityItem.id, { actor: e.target.value })} /></Field>
          <Field label="Role"><input value={selectedAuthorityItem.role} onChange={(e) => updateAuthority(selectedAuthorityItem.id, { role: e.target.value })} /></Field>
          <Field label="Organization"><input value={selectedAuthorityItem.organization} onChange={(e) => updateAuthority(selectedAuthorityItem.id, { organization: e.target.value })} /></Field>
          <Field label="Delegated by"><input value={selectedAuthorityItem.delegatedBy} onChange={(e) => updateAuthority(selectedAuthorityItem.id, { delegatedBy: e.target.value })} /></Field>
          <Field label="Authority source" wide><textarea rows={4} value={selectedAuthorityItem.authoritySource} onChange={(e) => updateAuthority(selectedAuthorityItem.id, { authoritySource: e.target.value })} /></Field>
          <Field label="Scope" wide><textarea rows={5} value={selectedAuthorityItem.scope} onChange={(e) => updateAuthority(selectedAuthorityItem.id, { scope: e.target.value })} /></Field>
          <Field label="Valid from"><input type="datetime-local" value={selectedAuthorityItem.validFrom} onChange={(e) => updateAuthority(selectedAuthorityItem.id, { validFrom: e.target.value })} /></Field>
          <Field label="Valid until"><input type="datetime-local" value={selectedAuthorityItem.validUntil} onChange={(e) => updateAuthority(selectedAuthorityItem.id, { validUntil: e.target.value })} /></Field>
          <Field label="Conflict state" wide><textarea rows={3} value={selectedAuthorityItem.conflict} onChange={(e) => updateAuthority(selectedAuthorityItem.id, { conflict: e.target.value })} /></Field>
          <Field label="Notes" wide><textarea rows={4} value={selectedAuthorityItem.notes} onChange={(e) => updateAuthority(selectedAuthorityItem.id, { notes: e.target.value })} /></Field>
        </div> : <EmptyState title="No authority selected" text="Add an authority record to resolve identity, delegation, scope, expiry, revocation, and conflicts." />}
      </div>
    </section>;
  }

  function renderContinuity() {
    const rows = [
      ["Evidence identity", snapshot.evidence.every((e) => e.id && e.sourceName), "Every relied-upon item remains attributable to the same source and record identity."],
      ["Evidence freshness", snapshot.evidence.every((e) => e.state !== "EXPIRED"), "Time-sensitive evidence remains within the route's admissible window."],
      ["Route continuity", Boolean(snapshot.route.routeId && snapshot.route.routeVersion), "The same route version governs intake, commitment, execution, and replay."],
      ["Authority continuity", snapshot.authorities.some((a) => a.state === "VALID"), "At least one valid authority remains active and in scope."],
      ["Destination continuity", Boolean(snapshot.scenario.intendedDestination && snapshot.route.permittedDestinations.includes(snapshot.scenario.intendedDestination)), "Requested and permitted destinations remain aligned."],
      ["Model continuity", Boolean(snapshot.scenario.requestedModel && snapshot.route.permittedModels.includes(snapshot.scenario.requestedModel)), "Requested model matches the frozen route allowance."],
    ] as const;
    return <section><SectionTitle eyebrow="Continuity validator" title="Prove that the same state survived" description="A valid snapshot cannot govern a different model, destination, evidence state, authority, or route without revalidation." />
      <div className="continuity-grid">{rows.map(([label, pass, note]) => <article key={label} className={pass ? "continuity-pass" : "continuity-fail"}><Badge tone={pass ? "pass" : "deny"}>{pass ? "CONTINUOUS" : "REVALIDATE"}</Badge><h3>{label}</h3><p>{note}</p></article>)}</div>
      <article className="panel"><h3>Configured revalidation triggers</h3>{splitLines(snapshot.route.revalidationTriggers).map((item) => <div className="trigger" key={item}><span>RECHECK</span><strong>{item}</strong><button onClick={() => setNotice(`${item} marked for revalidation review.`)}>Simulate change</button></div>)}</article>
    </section>;
  }

  function renderAdmissibility() {
    return <section><SectionTitle eyebrow="Admissibility / binding" title="May this material support this consequence?" description="Validity alone is not enough. Test purpose, time, jurisdiction, route, authority, disclosure, conflict, and consequence fit." actions={<button onClick={evaluateAllGates}>Re-evaluate</button>} />
      <div className="matrix-table"><div className="matrix-head"><span>Item</span><span>Source</span><span>Freshness</span><span>Disclosure</span><span>Decision</span></div>{snapshot.evidence.map((item) => <div className="matrix-row" key={item.id}><strong>{item.title}</strong><span>{item.sourceName || "Unresolved"}</span><span>{item.validUntil ? "Time bounded" : "No expiry stated"}</span><span>{item.disclosure}</span><Badge tone={item.state === "ADMITTED" ? "pass" : item.state === "REJECTED" ? "deny" : "hold"}>{item.state}</Badge></div>)}</div>
      <div className="two-col"><article className="panel"><h3>Binding policy basis</h3>{splitLines(snapshot.route.policyBasis).map((item) => <p className="binding-rule" key={item}>{item}</p>)}</article><article className="panel"><h3>Admissibility stop conditions</h3>{REASON_CODES.filter((r) => ["ADMISSIBILITY", "AUTHORITY", "CONTINUITY"].includes(r.chainLink)).slice(0, 16).map((r) => <div className="reason" key={r.code}><Badge tone={r.defaultDetermination.toLowerCase()}>{r.defaultDetermination}</Badge><strong>{r.code}</strong><p>{r.description}</p></div>)}</article></div>
    </section>;
  }

  function renderRuntime() {
    return <section><SectionTitle eyebrow="Gate runtime console" title="Evaluate the route in fixed order" description="Later gates cannot cure an earlier failure. The ledger preserves each input, result, reason, reviewer state, and earliest controlling condition." actions={<button className="primary" onClick={evaluateAllGates}>Run all gates</button>} />
      <div className="split runtime-split">
        <div className="ledger">{snapshot.gates.map((gate) => <button key={gate.id} className={selectedGateItem?.id === gate.id ? "active" : ""} onClick={() => setSelectedGate(gate.id)}><span>{String(gate.sequence).padStart(2, "0")}</span><div><strong>{gate.title}</strong><small>{gate.chainLink} · {gate.requirement}</small></div><Badge tone={gate.status.toLowerCase()}>{gate.status}</Badge></button>)}</div>
        {selectedGateItem ? <article className="panel form-grid"><Field label="Gate ID"><input disabled value={selectedGateItem.id} /></Field><Field label="Chain link"><select value={selectedGateItem.chainLink} onChange={(e) => updateGate(selectedGateItem.id, { chainLink: e.target.value as ChainLink })}>{CHAIN_LINKS.map((v) => <option key={v}>{v}</option>)}</select></Field><Field label="Title" wide><input value={selectedGateItem.title} onChange={(e) => updateGate(selectedGateItem.id, { title: e.target.value })} /></Field><Field label="Requirement" wide><textarea rows={4} value={selectedGateItem.requirement} onChange={(e) => updateGate(selectedGateItem.id, { requirement: e.target.value })} /></Field><Field label="Status"><select value={selectedGateItem.status} onChange={(e) => updateGate(selectedGateItem.id, { status: e.target.value as GateStatus })}>{["PENDING","PASS","FAIL","UNRESOLVED","NOT_APPLICABLE"].map((v) => <option key={v}>{v}</option>)}</select></Field><Field label="Reason code"><input value={selectedGateItem.reasonCode} onChange={(e) => updateGate(selectedGateItem.id, { reasonCode: e.target.value })} /></Field><Field label="Input summary" wide><textarea rows={4} value={selectedGateItem.inputSummary} onChange={(e) => updateGate(selectedGateItem.id, { inputSummary: e.target.value })} /></Field><Field label="Result summary" wide><textarea rows={5} value={selectedGateItem.resultSummary} onChange={(e) => updateGate(selectedGateItem.id, { resultSummary: e.target.value })} /></Field><label className="check"><input type="checkbox" checked={selectedGateItem.mandatory} onChange={(e) => updateGate(selectedGateItem.id, { mandatory: e.target.checked })} /> Mandatory gate</label></article> : null}
      </div>
    </section>;
  }

  function renderCommit() {
    return <section><SectionTitle eyebrow="Pre-action commitment" title="Fix the determination before execution" description="Commit ALLOW, HOLD, DENY, or ESCALATE from the frozen ledger. Do not backdate human approval or broaden the permitted action after commitment." actions={<button className="primary" onClick={commitDetermination}>Commit now</button>} />
      <div className="determinations">{DETERMINATIONS.map((det) => <button key={det} className={snapshot.determination === det ? "active" : ""} onClick={() => mutate((current) => ({ ...current, determination: det, execution: { ...current.execution, expectedEffect: expectedEffect(det) } }))}><span>{det}</span><p>{det === "ALLOW" ? "Release only the exact authorized action." : det === "HOLD" ? "Do not execute until the repair condition survives revalidation." : det === "DENY" ? "Block or terminate the prohibited action." : "Route to named authority without treating escalation as approval."}</p></button>)}</div>
      <div className="form-grid"><Field label="Commit reason" wide><textarea rows={7} value={snapshot.commitReason} onChange={(e) => mutate((current) => ({ ...current, commitReason: e.target.value }))} /></Field><Field label="Expected technical effect"><input value={expectedEffect(snapshot.determination)} disabled /></Field><Field label="Earliest controlling condition"><input value={earliestFailure?.title ?? "All mandatory conditions satisfied"} disabled /></Field></div>
    </section>;
  }

  function renderExecution() {
    return <section><SectionTitle eyebrow="Execution adapter console" title="Prove the determination changed what could happen" description="A governance claim is not complete until a technical control releases, holds, blocks, reroutes, terminates, rolls back, or requires a named checkpoint." actions={<button className="primary" onClick={executeReferenceAdapter}>Invoke reference adapter</button>} />
      <div className="form-grid"><Field label="Adapter ID"><input value={snapshot.execution.adapterId} onChange={(e) => mutate((c) => ({ ...c, execution: { ...c.execution, adapterId: e.target.value } }))} /></Field><Field label="Adapter version"><input value={snapshot.execution.adapterVersion} onChange={(e) => mutate((c) => ({ ...c, execution: { ...c.execution, adapterVersion: e.target.value } }))} /></Field><Field label="Requested action" wide><textarea rows={5} value={snapshot.execution.requestedAction} onChange={(e) => mutate((c) => ({ ...c, execution: { ...c.execution, requestedAction: e.target.value } }))} /></Field><Field label="Expected effect"><input value={snapshot.execution.expectedEffect} disabled /></Field><Field label="Actual effect"><input value={snapshot.execution.actualEffect} onChange={(e) => mutate((c) => ({ ...c, execution: { ...c.execution, actualEffect: e.target.value } }))} /></Field><Field label="Technical status code"><input value={snapshot.execution.technicalStatusCode} onChange={(e) => mutate((c) => ({ ...c, execution: { ...c.execution, technicalStatusCode: e.target.value } }))} /></Field><Field label="Receipt ID"><input value={snapshot.execution.receiptId} onChange={(e) => mutate((c) => ({ ...c, execution: { ...c.execution, receiptId: e.target.value } }))} /></Field><Field label="Technical message" wide><textarea rows={4} value={snapshot.execution.technicalMessage} onChange={(e) => mutate((c) => ({ ...c, execution: { ...c.execution, technicalMessage: e.target.value } }))} /></Field><Field label="Receipt hash" wide><input value={snapshot.execution.receiptHash} onChange={(e) => mutate((c) => ({ ...c, execution: { ...c.execution, receiptHash: e.target.value } }))} /></Field><label className="check"><input type="checkbox" checked={snapshot.execution.bypassDetected} onChange={(e) => mutate((c) => ({ ...c, execution: { ...c.execution, bypassDetected: e.target.checked } }))} /> Bypass attempt detected</label><label className="check"><input type="checkbox" checked={snapshot.execution.rollbackPerformed} onChange={(e) => mutate((c) => ({ ...c, execution: { ...c.execution, rollbackPerformed: e.target.checked } }))} /> Rollback performed</label></div>
      <div className={`receipt receipt-${snapshot.execution.actualEffect.toLowerCase()}`}><span>Technical execution receipt</span><strong>{snapshot.execution.receiptId || "NOT YET GENERATED"}</strong><p>{snapshot.execution.technicalMessage}</p><code>{snapshot.execution.receiptHash || "No integrity commitment yet"}</code></div>
    </section>;
  }

  function renderOutcome() {
    return <section><SectionTitle eyebrow="Outcome closure" title="Preserve what bound to reality - and what did not" description="Capture actual consequence state, closure evidence, residual risk, rollback, correction, independent verification, and follow-up." actions={<button className="primary" onClick={closeOutcome}>Generate closure from receipt</button>} />
      <div className="form-grid"><Field label="Actual result" wide><textarea rows={6} value={snapshot.outcome.actualResult} onChange={(e) => mutate((c) => ({ ...c, outcome: { ...c.outcome, actualResult: e.target.value } }))} /></Field><Field label="Consequence state"><input value={snapshot.outcome.consequenceState} onChange={(e) => mutate((c) => ({ ...c, outcome: { ...c.outcome, consequenceState: e.target.value } }))} /></Field><Field label="Closure evidence" wide><textarea rows={5} value={snapshot.outcome.closureEvidence} onChange={(e) => mutate((c) => ({ ...c, outcome: { ...c.outcome, closureEvidence: e.target.value } }))} /></Field><Field label="Residual risk" wide><textarea rows={4} value={snapshot.outcome.residualRisk} onChange={(e) => mutate((c) => ({ ...c, outcome: { ...c.outcome, residualRisk: e.target.value } }))} /></Field><Field label="Corrective action" wide><textarea rows={4} value={snapshot.outcome.correctiveAction} onChange={(e) => mutate((c) => ({ ...c, outcome: { ...c.outcome, correctiveAction: e.target.value } }))} /></Field><label className="check"><input type="checkbox" checked={snapshot.outcome.independentlyVerified} onChange={(e) => mutate((c) => ({ ...c, outcome: { ...c.outcome, independentlyVerified: e.target.checked } }))} /> Independently verified</label><Field label="Verifier"><input value={snapshot.outcome.verifier} onChange={(e) => mutate((c) => ({ ...c, outcome: { ...c.outcome, verifier: e.target.value } }))} /></Field><Field label="Verified at"><input type="datetime-local" value={snapshot.outcome.verifiedAt} onChange={(e) => mutate((c) => ({ ...c, outcome: { ...c.outcome, verifiedAt: e.target.value } }))} /></Field></div>
    </section>;
  }

  function renderIntegrity() {
    const components = ["bounded-record.pdf","canonical-record.json","evidence-manifest.json","authority-record.json","continuity-record.json","gate-ledger.json","commit-record.json","execution-receipt.json","outcome-record.json","integrity-manifest.json","verification-instructions.txt","challenge-record.json"];
    return <section><SectionTitle eyebrow="Integrity packager" title="Create the machine-verifiable artifact package" description="Canonicalize the record, hash every component, calculate the package root, confirm parity, and preserve verification instructions." actions={<><button onClick={exportManifest}>Download manifest</button><button className="primary" onClick={exportJson}>Download canonical JSON</button></>} />
      <div className="package-grid">{components.map((name, index) => <article key={name}><Badge tone={index < 2 || snapshot.execution.receiptId ? "pass" : "hold"}>{index < 2 || snapshot.execution.receiptId ? "READY" : "PENDING"}</Badge><strong>{name}</strong><code>{index === 1 ? `record:${artifactId}` : `sha256:pending-${index.toString(16).padStart(2,"0")}`}</code></article>)}</div>
      <article className="panel"><h3>Parity requirements</h3><div className="checklist">{["Public inspection page resolves to the same artifact ID.","PDF and JSON preserve the same route version.","Evidence manifest matches admitted evidence snapshot.","Authority record matches the committed authority state.","Gate ledger preserves order and earliest failure.","Execution receipt proves the control effect.","Outcome record states what bound to reality.","Corrections append without rewriting the original event."].map((x) => <label key={x}><input type="checkbox" /> {x}</label>)}</div></article>
    </section>;
  }

  function renderReview() {
    return <section><SectionTitle eyebrow="Artifact review center" title="Claims, privacy, schema, parity, and technical review" description="Publication remains blocked when the execution effect lacks a receipt, outcome claims lack support, exports disagree, or the public claim exceeds the record." />
      <div className="review-grid">{["Schema completeness","Route parity","Evidence integrity","Authority validity","Continuity","Admissibility","Binding basis","Gate ledger","Commit timing","Execution receipt","Outcome support","Privacy disclosure","Claims boundary","Independent review","Challenge pathway","Accessibility"].map((name, index) => <article key={name}><span>{String(index+1).padStart(2,"0")}</span><h3>{name}</h3><select defaultValue={index < 9 ? "PASS" : "PENDING"}><option>PASS</option><option>PENDING</option><option>FAIL</option><option>NOT APPLICABLE</option></select><textarea rows={3} placeholder="Reviewer note" /></article>)}</div>
    </section>;
  }

  function renderPublication() {
    return <section><SectionTitle eyebrow="Publisher" title="Bound the claim and publish the exact record" description="Registration, publication, or display is not certification. State precisely what this artifact proves and what remains outside the record." />
      <div className="form-grid"><Field label="Publication state"><select value={snapshot.publicationState} onChange={(e) => { const nextState = e.target.value as PublicationState; if (nextState === "PUBLISHED" && !governanceBound) { setTab("command"); setNotice("Publication blocked: select a completed registered governance record first. No registered governance. No registered artifact."); return; } mutate((c) => ({ ...c, publicationState: nextState })); }}>{["DRAFT","INTERNAL_REVIEW","READY","PUBLISHED","CHALLENGED","CORRECTED","SUPERSEDED","WITHDRAWN"].map((v) => <option key={v}>{v}</option>)}</select></Field><Field label="Stable public URL"><input value={`/artifacts/${artifactId.toLowerCase()}`} readOnly /></Field><Field label="What this artifact proves" wide><textarea rows={7} value={snapshot.proves} onChange={(e) => mutate((c) => ({ ...c, proves: e.target.value }))} /></Field><Field label="What this artifact does not prove" wide><textarea rows={7} value={snapshot.doesNotProve} onChange={(e) => mutate((c) => ({ ...c, doesNotProve: e.target.value }))} /></Field></div>
      <div className="publication-actions"><button onClick={exportJson}>Download JSON</button><button onClick={exportCsv}>Download gate CSV</button><button onClick={exportManifest}>Download manifest</button><button onClick={() => window.print()}>Print bounded brief</button><button className="primary" disabled={score < 80 || !governanceBound} onClick={publishArtifact}>Publish artifact</button></div>
    </section>;
  }

  function renderTimeline() {
    const events = [
      ["Scenario created", snapshot.updatedAt, snapshot.scenario.proposedAction],
      ["Route selected", snapshot.updatedAt, `${snapshot.route.routeId} v${snapshot.route.routeVersion}`],
      ...snapshot.evidence.map((e) => [`Evidence registered: ${e.title}`, e.capturedAt, `${e.state} / ${e.disclosure}`]),
      ...snapshot.authorities.map((a) => [`Authority resolved: ${a.actor}`, a.validFrom, `${a.state} / ${a.scope}`]),
      ...snapshot.gates.filter((g) => g.status !== "PENDING").map((g) => [`Gate ${g.sequence}: ${g.title}`, snapshot.updatedAt, `${g.status} / ${g.reasonCode}`]),
      ["Determination", snapshot.updatedAt, `${snapshot.determination} / ${snapshot.commitReason}`],
      ["Execution effect", snapshot.updatedAt, `${snapshot.execution.actualEffect} / ${snapshot.execution.receiptId || "No receipt"}`],
      ["Outcome closure", snapshot.outcome.verifiedAt || snapshot.updatedAt, snapshot.outcome.actualResult || "Outcome remains open"],
    ];
    return <section><SectionTitle eyebrow="Replay" title="Event timeline and decision reconstruction" description="Inspect what happened, in what order, under whose authority, using which evidence, and whether the final conclusion survived scrutiny." />
      <div className="timeline">{events.map(([title,date,text], index) => <article key={`${title}-${index}`}><span>{String(index+1).padStart(2,"0")}</span><div><small>{date || "Time not fixed"}</small><h3>{title}</h3><p>{text}</p></div></article>)}</div>
    </section>;
  }

  function renderDiff() {
    const previous = history[history.length - 1];
    const currentText = JSON.stringify(makeExport(snapshot), null, 2).split("\n");
    const previousText = previous ? JSON.stringify(makeExport(previous), null, 2).split("\n") : [];
    return <section><SectionTitle eyebrow="State comparison" title="Workspace diff and change awareness" description="Compare the current draft with the most recent preserved local snapshot before freezing the event." actions={<button onClick={undo} disabled={!history.length}>Restore previous</button>} />
      {!previous ? <EmptyState title="No previous snapshot" text="Make a change to create a comparison point. The Studio preserves up to twenty-five local snapshots for this browser session." /> : <div className="diff-grid"><article><h3>Previous snapshot</h3><pre>{previousText.slice(0,260).join("\n")}</pre></article><article><h3>Current snapshot</h3><pre>{currentText.slice(0,260).join("\n")}</pre></article></div>}
    </section>;
  }

  function renderTemplates() {
    return <section><SectionTitle eyebrow="Institutional template library" title="Route, evidence, and control patterns" description="Use governed templates as starting points, then preserve the materially different scenario, evidence, authority, execution effect, and outcome for each artifact." />
      <div className="template-columns"><div><h3>Route templates</h3>{filteredRoutes.map((item) => <article className="template-card" key={item.id}><Badge tone={item.expectedDetermination.toLowerCase()}>{item.expectedDetermination}</Badge><small>{item.id} · {item.version}</small><h4>{item.name}</h4><p>{item.description}</p><button onClick={() => { mutate((c) => ({ ...c, route: { ...c.route, routeId: item.id, routeTitle: item.name, routeVersion: item.version }, determination: item.expectedDetermination })); setTab("route"); }}>Use route</button></article>)}</div><div><h3>Evidence templates</h3>{filteredEvidenceTemplates.map((item) => <article className="template-card" key={item.id}><Badge tone="cyan">{item.category}</Badge><small>{item.id}</small><h4>{item.title}</h4><p>{item.admissibilityQuestion}</p><button onClick={() => addEvidence(item)}>Add evidence</button></article>)}</div><div><h3>Control patterns</h3>{filteredPatterns.map((item) => <article className="template-card" key={item.id}><Badge tone={item.severity === "CRITICAL" ? "deny" : item.severity === "BLOCKING" ? "hold" : "neutral"}>{item.severity}</Badge><small>{item.id} · {item.domain}</small><h4>{item.title}</h4><p>{item.description}</p><details><summary>Repair condition</summary><p>{item.repair}</p></details></article>)}</div></div>
    </section>;
  }

  function renderReports() {
    const byStatus = ["PASS","FAIL","UNRESOLVED","PENDING","NOT_APPLICABLE"].map((status) => ({ status, count: snapshot.gates.filter((g) => g.status === status).length }));
    return <section><SectionTitle eyebrow="Analytics and reporting" title="Artifact readiness and control report" description="Measure completeness, control effect, earliest failures, evidence states, authority conditions, and package readiness without confusing activity with proof." actions={<button onClick={exportCsv}>Export CSV</button>} />
      <div className="metrics"><Metric label="Completion" value={`${score}%`} note="Workspace completeness" /><Metric label="Admitted evidence" value={snapshot.evidence.filter((e) => e.state === "ADMITTED").length} note={`of ${snapshot.evidence.length} items`} /><Metric label="Valid authorities" value={snapshot.authorities.filter((a) => a.state === "VALID").length} note={`of ${snapshot.authorities.length} records`} /><Metric label="Gate failures" value={snapshot.gates.filter((g) => g.status === "FAIL").length} note="Mandatory and conditional" tone="deny" /></div>
      <div className="two-col"><article className="panel"><h3>Gate distribution</h3>{byStatus.map((item) => <div className="bar" key={item.status}><span>{item.status}</span><div><i style={{ "--width": `${snapshot.gates.length ? (item.count/snapshot.gates.length)*100 : 0}%` } as CSSProperties} /></div><strong>{item.count}</strong></div>)}</article><article className="panel"><h3>Institutional interpretation</h3><p>The artifact currently resolves to <strong>{snapshot.determination}</strong> with expected execution effect <strong>{expectedEffect(snapshot.determination)}</strong>.</p><p>{earliestFailure ? `The earliest controlling condition is gate ${earliestFailure.sequence}: ${earliestFailure.title}.` : "No unresolved mandatory condition is presently recorded."}</p><p>{snapshot.execution.receiptId ? `Technical receipt ${snapshot.execution.receiptId} preserves the actual control effect.` : "No technical execution receipt has been preserved, so full-chain proof is not yet available."}</p></article></div>
    </section>;
  }

  function renderActive() {
    if (tab === "command") return renderCommand();
    if (tab === "scenario") return renderScenario();
    if (tab === "route") return renderRoute();
    if (tab === "evidence") return renderEvidence();
    if (tab === "authority") return renderAuthority();
    if (tab === "continuity") return renderContinuity();
    if (tab === "admissibility") return renderAdmissibility();
    if (tab === "runtime") return renderRuntime();
    if (tab === "commit") return renderCommit();
    if (tab === "execution") return renderExecution();
    if (tab === "outcome") return renderOutcome();
    if (tab === "integrity") return renderIntegrity();
    if (tab === "review") return renderReview();
    if (tab === "publication") return renderPublication();
    if (tab === "timeline") return renderTimeline();
    if (tab === "diff") return renderDiff();
    if (tab === "templates") return renderTemplates();
    return renderReports();
  }

  return (
    <main className="studio-shell" onDragOver={(e) => { e.preventDefault(); setDragActive(true); }} onDragLeave={() => setDragActive(false)} onDrop={onDrop}>
      <header className="topbar"><div><Link href="/artifacts" className="brand">TA-14 <span>Execution Artifact Studio</span></Link><span className="engine">Studio {ARTIFACT_ENGINE_VERSION}</span></div><div className="top-actions"><input id="studio-search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search templates and controls /" /><button onClick={undo} disabled={!history.length}>Undo</button><button onClick={() => importRef.current?.click()}>Import</button><button onClick={exportJson}>Export</button><button className="primary" onClick={() => setShowJson(true)}>Inspect JSON</button></div></header>
      <div className="workspace">
        <aside><div className="door-mark"><span>DOOR</span><strong>08</strong><p>Build the record. Prove the effect.</p></div><nav>{navItems.map((item) => <button key={item.id} className={tab === item.id ? "active" : ""} onClick={() => setTab(item.id)}><span>{item.eyebrow}</span>{item.label}</button>)}</nav><div className="aside-footer"><div className="readiness"><span>Publication readiness</span><strong>{score}%</strong><i><b style={{ width: `${score}%` }} /></i></div><button onClick={resetWorkspace}>Reset workspace</button><Link href="/artifacts/verify">Verification Center</Link></div></aside>
        <div className="content"><div className="record-header"><div><span>{artifactId}</span><h1>{snapshot.scenario.title}</h1><p>{snapshot.scenario.proposedAction}</p></div><div><Badge tone={snapshot.determination.toLowerCase()}>{snapshot.determination}</Badge><Badge tone={snapshot.publicationState === "PUBLISHED" ? "pass" : "neutral"}>{snapshot.publicationState}</Badge></div></div>{notice ? <button className="notice" onClick={() => setNotice("")}>{notice}<span>Dismiss</span></button> : null}{renderActive()}</div>
      </div>
      <input ref={importRef} type="file" accept="application/json,.json" hidden onChange={(e: ChangeEvent<HTMLInputElement>) => { const file = e.target.files?.[0]; if (file) void importFile(file); e.target.value = ""; }} />
      {dragActive ? <div className="dropzone">Drop a TA-14 Artifact Studio JSON workspace package</div> : null}
      {showJson ? <div className="modal" role="dialog" aria-modal="true"><div className="modal-card"><div><h2>Canonical workspace inspection</h2><button onClick={() => setShowJson(false)}>Close</button></div><pre>{JSON.stringify(makeExport(snapshot), null, 2)}</pre></div></div> : null}
      <style jsx global>{`
.engine-orchestration{margin:0 0 18px;padding:20px;border:1px solid rgba(82,229,255,.2);border-radius:20px;background:radial-gradient(circle at 85% 0,rgba(184,156,255,.1),transparent 34%),linear-gradient(155deg,rgba(82,229,255,.055),rgba(255,255,255,.015));box-shadow:var(--shadow)}.engine-orchestration-head{display:flex;align-items:flex-start;justify-content:space-between;gap:20px;margin-bottom:16px}.engine-orchestration-head>div:first-child>span{font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:var(--gold)}.engine-orchestration-head h3{margin:7px 0 6px;font-size:24px}.engine-orchestration-head p{margin:0;max-width:820px;color:var(--muted);line-height:1.55}.engine-health{min-width:138px;padding:14px;border:1px solid rgba(115,240,176,.25);border-radius:14px;background:rgba(115,240,176,.05);text-align:center}.engine-health strong{display:block;font-size:28px;color:var(--green)}.engine-health span{font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:var(--muted)}.engine-grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:10px}.engine-grid article{min-height:150px;padding:14px;border:1px solid var(--line);border-radius:14px;background:linear-gradient(155deg,#0c1621,#081019);transition:.2s ease}.engine-grid article:hover{transform:translateY(-3px);border-color:rgba(82,229,255,.45);box-shadow:0 14px 34px rgba(0,0,0,.24)}.engine-grid article>div{display:flex;align-items:center;justify-content:space-between;gap:8px}.engine-grid article>div>span{font-size:11px;color:var(--cyan)}.engine-grid h4{margin:14px 0 8px;font-size:14px}.engine-grid p{margin:0;color:var(--muted);font-size:11px;line-height:1.5}.engine-flow{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:9px;margin-top:14px;padding:12px;border:1px solid rgba(245,200,107,.18);border-radius:12px;background:rgba(245,200,107,.035)}.engine-flow span{font-size:9px;letter-spacing:.1em;color:#c8d7e5}.engine-flow i{font-style:normal;color:var(--gold)}
:root{color-scheme:dark;--bg:#05070b;--panel:#0b111a;--panel2:#101925;--line:#203042;--text:#edf7ff;--muted:#91a5b8;--cyan:#52e5ff;--gold:#f5c86b;--green:#73f0b0;--red:#ff7187;--violet:#b89cff;--shadow:0 28px 80px rgba(0,0,0,.35)}
*{box-sizing:border-box}.studio-shell{min-height:100vh;background:radial-gradient(circle at 18% 0,rgba(40,139,173,.16),transparent 28%),radial-gradient(circle at 90% 10%,rgba(170,117,38,.13),transparent 25%),var(--bg);color:var(--text);font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}.topbar{height:70px;position:sticky;top:0;z-index:40;display:flex;align-items:center;justify-content:space-between;padding:0 24px;border-bottom:1px solid rgba(82,229,255,.16);background:rgba(5,7,11,.89);backdrop-filter:blur(22px)}.topbar>div,.top-actions{display:flex;align-items:center;gap:12px}.brand{font-weight:900;letter-spacing:.12em;color:var(--text);text-decoration:none}.brand span{color:var(--cyan);font-weight:600}.engine{font-size:11px;color:var(--muted);padding:6px 8px;border:1px solid var(--line);border-radius:999px}.top-actions input{width:260px}.workspace{display:grid;grid-template-columns:260px minmax(0,1fr);min-height:calc(100vh - 70px)}aside{position:sticky;top:70px;height:calc(100vh - 70px);overflow:auto;padding:22px 14px;border-right:1px solid var(--line);background:rgba(7,11,17,.72)}.door-mark{padding:18px;margin-bottom:18px;border:1px solid rgba(82,229,255,.22);border-radius:18px;background:linear-gradient(145deg,rgba(82,229,255,.08),rgba(245,200,107,.04))}.door-mark span{font-size:10px;letter-spacing:.25em;color:var(--muted)}.door-mark strong{display:block;font-size:44px;line-height:1;color:var(--cyan)}.door-mark p{margin:8px 0 0;color:var(--muted);font-size:12px}aside nav{display:grid;gap:4px}aside nav button{display:flex;align-items:center;gap:12px;width:100%;padding:10px 12px;border:1px solid transparent;border-radius:10px;background:transparent;color:var(--muted);text-align:left}aside nav button span{font-size:10px;color:#5f7388}aside nav button:hover,aside nav button.active{color:var(--text);border-color:rgba(82,229,255,.22);background:rgba(82,229,255,.08)}.aside-footer{display:grid;gap:10px;margin-top:18px;padding-top:16px;border-top:1px solid var(--line)}.aside-footer>a,.aside-footer>button{color:var(--muted);text-decoration:none;background:none;border:0;text-align:left;padding:8px}.readiness{padding:12px;border:1px solid var(--line);border-radius:12px}.readiness span{font-size:11px;color:var(--muted)}.readiness strong{display:block;font-size:28px}.readiness i{display:block;height:5px;background:#13202d;border-radius:999px;overflow:hidden}.readiness b{display:block;height:100%;background:linear-gradient(90deg,var(--cyan),var(--green))}.content{min-width:0;padding:28px 32px 80px}.record-header{display:flex;justify-content:space-between;gap:20px;align-items:flex-start;padding:24px 0 30px}.record-header>div:last-child{display:flex;gap:8px}.record-header span{font-size:11px;letter-spacing:.16em;color:var(--cyan)}.record-header h1{margin:7px 0 8px;font-size:clamp(28px,4vw,56px);line-height:1;max-width:1000px}.record-header p{max-width:880px;color:var(--muted);font-size:15px;line-height:1.65}.section-title{display:flex;align-items:flex-end;justify-content:space-between;gap:20px;margin:10px 0 24px}.section-title span{font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--gold)}.section-title h2{margin:7px 0 8px;font-size:32px}.section-title p{margin:0;max-width:800px;color:var(--muted);line-height:1.6}.section-actions,.publication-actions{display:flex;flex-wrap:wrap;gap:10px}button,input,textarea,select{font:inherit}button{cursor:pointer;border:1px solid var(--line);border-radius:10px;padding:9px 13px;background:#101a26;color:var(--text)}button:hover{border-color:var(--cyan);transform:translateY(-1px)}button:disabled{opacity:.45;cursor:not-allowed;transform:none}.primary{background:linear-gradient(135deg,#0d6575,#0a8f82);border-color:#35d8db}.danger{border-color:rgba(255,113,135,.5);color:#ff9bab}input,textarea,select{width:100%;border:1px solid var(--line);border-radius:10px;background:#071019;color:var(--text);padding:11px 12px;outline:none}input:focus,textarea:focus,select:focus{border-color:var(--cyan);box-shadow:0 0 0 3px rgba(82,229,255,.1)}textarea{resize:vertical;line-height:1.5}.metrics{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:12px;margin-bottom:18px}.metric{position:relative;overflow:hidden;padding:16px;border:1px solid var(--line);border-radius:15px;background:linear-gradient(160deg,rgba(255,255,255,.03),rgba(255,255,255,.01))}.metric:before{content:"";position:absolute;inset:0 auto 0 0;width:3px;background:var(--cyan)}.metric-gold:before{background:var(--gold)}.metric-green:before,.metric-allow:before{background:var(--green)}.metric-deny:before{background:var(--red)}.metric-hold:before{background:var(--gold)}.metric-escalate:before,.metric-violet:before{background:var(--violet)}.metric span{font-size:10px;letter-spacing:.12em;color:var(--muted);text-transform:uppercase}.metric strong{display:block;margin:8px 0 3px;font-size:26px}.metric p{margin:0;color:var(--muted);font-size:11px;line-height:1.4}.panel,.hero-panel{padding:20px;border:1px solid var(--line);border-radius:18px;background:linear-gradient(160deg,rgba(15,26,39,.96),rgba(8,14,22,.96));box-shadow:var(--shadow)}.panel h3,.hero-panel h3{margin-top:0}.command-grid{display:grid;grid-template-columns:minmax(0,1.55fr) minmax(320px,.75fr);gap:16px;margin-bottom:16px}.hero-panel{background:radial-gradient(circle at 100% 0,rgba(82,229,255,.15),transparent 35%),linear-gradient(160deg,#0d1824,#080e16)}.hero-kicker{font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:var(--gold)}.hero-panel h3{font-size:42px;margin:18px 0 4px}.hero-panel h4{font-size:22px;margin:0 0 8px}.hero-panel>p{color:var(--muted);line-height:1.6}.chain-strip{display:grid;grid-template-columns:repeat(8,1fr);gap:7px;margin:24px 0}.chain-link{font-size:9px;padding:10px 4px}.chain-pass{border-color:rgba(115,240,176,.45);color:var(--green)}.chain-fail{border-color:rgba(255,113,135,.55);color:var(--red)}.chain-pending{border-color:rgba(245,200,107,.45);color:var(--gold)}.proof-callout{padding:16px;border-left:3px solid var(--gold);background:rgba(245,200,107,.06)}.proof-callout span{display:block;font-size:10px;letter-spacing:.12em;color:var(--gold)}.proof-callout strong{display:block;margin:8px 0}.proof-callout p{margin:0;color:var(--muted)}.run-sequence{list-style:none;padding:0;margin:0;display:grid;gap:8px}.run-sequence li{display:flex;gap:8px;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid rgba(32,48,66,.6)}.run-sequence button{border:0;background:none;padding:0;text-align:left}.three-col,.two-col{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}.two-col{grid-template-columns:repeat(2,minmax(0,1fr))}.compact-list{list-style:none;padding:0}.compact-list li{display:flex;justify-content:space-between;gap:8px;padding:9px 0;border-bottom:1px solid var(--line)}.badge{display:inline-flex;align-items:center;justify-content:center;white-space:nowrap;padding:5px 8px;border:1px solid var(--line);border-radius:999px;font-size:9px;letter-spacing:.11em}.badge-pass,.badge-allow{color:var(--green);border-color:rgba(115,240,176,.35);background:rgba(115,240,176,.07)}.badge-fail,.badge-deny{color:var(--red);border-color:rgba(255,113,135,.35);background:rgba(255,113,135,.07)}.badge-hold,.badge-pending,.badge-unresolved{color:var(--gold);border-color:rgba(245,200,107,.35);background:rgba(245,200,107,.07)}.badge-escalate{color:var(--violet);border-color:rgba(184,156,255,.35);background:rgba(184,156,255,.07)}.badge-cyan{color:var(--cyan)}.form-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}.field{display:grid;gap:7px}.field-wide{grid-column:1/-1}.field-label{font-size:11px;letter-spacing:.08em;color:#b9cada}.field small{color:var(--muted)}.check{display:flex;align-items:center;gap:9px;color:var(--muted)}.check input{width:auto}.split{display:grid;grid-template-columns:310px minmax(0,1fr);gap:16px}.record-list,.ledger{display:grid;gap:7px;align-content:start}.record-list button,.ledger button{display:grid;gap:4px;text-align:left;padding:13px}.record-list button.active,.ledger button.active{border-color:var(--cyan);background:rgba(82,229,255,.08)}.record-list span,.record-list small,.ledger small{font-size:10px;color:var(--muted)}.ledger button{grid-template-columns:34px minmax(0,1fr) auto;align-items:center}.ledger.compact{grid-template-columns:repeat(2,minmax(0,1fr))}.ledger.compact button{grid-template-columns:30px minmax(0,1fr) auto}.empty{padding:50px;text-align:center;border:1px dashed var(--line);border-radius:18px;color:var(--muted)}.empty strong{display:block;color:var(--text);font-size:20px}.continuity-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;margin-bottom:16px}.continuity-grid article{padding:18px;border:1px solid var(--line);border-radius:15px}.continuity-pass{background:rgba(115,240,176,.05)}.continuity-fail{background:rgba(255,113,135,.05)}.continuity-grid p{color:var(--muted);line-height:1.5}.trigger{display:grid;grid-template-columns:90px minmax(0,1fr) auto;gap:12px;align-items:center;padding:12px;border-top:1px solid var(--line)}.trigger span{font-size:10px;color:var(--gold)}.matrix-table{border:1px solid var(--line);border-radius:16px;overflow:hidden;margin-bottom:16px}.matrix-head,.matrix-row{display:grid;grid-template-columns:1.4fr 1fr .8fr .7fr .6fr;gap:12px;align-items:center;padding:12px 15px}.matrix-head{background:#111d29;color:var(--muted);font-size:10px;letter-spacing:.1em}.matrix-row{border-top:1px solid var(--line)}.binding-rule{padding:12px;border-left:3px solid var(--cyan);background:rgba(82,229,255,.05)}.reason{padding:12px 0;border-bottom:1px solid var(--line)}.reason strong{margin-left:8px}.reason p{color:var(--muted);font-size:12px}.runtime-split{grid-template-columns:minmax(360px,.8fr) minmax(0,1.2fr)}.determinations{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:20px}.determinations button{text-align:left;padding:20px;min-height:145px}.determinations button.active{border-color:var(--cyan);background:rgba(82,229,255,.08)}.determinations span{font-size:22px;font-weight:900}.determinations p{color:var(--muted);line-height:1.5}.receipt{margin-top:18px;padding:24px;border:1px solid var(--line);border-radius:18px;background:#080e15}.receipt span{font-size:10px;letter-spacing:.15em;color:var(--gold)}.receipt strong{display:block;font-size:24px;margin:10px 0}.receipt p{color:var(--muted)}.receipt code{font-size:11px;color:var(--cyan)}.package-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin-bottom:16px}.package-grid article{display:grid;gap:10px;padding:16px;border:1px solid var(--line);border-radius:14px;background:#0a121c}.package-grid code{font-size:10px;color:var(--muted);overflow-wrap:anywhere}.checklist{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.checklist label{padding:12px;border:1px solid var(--line);border-radius:10px;color:var(--muted)}.checklist input{width:auto}.review-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}.review-grid article{padding:15px;border:1px solid var(--line);border-radius:14px;background:#0a121c}.review-grid article>span{color:var(--cyan);font-size:11px}.review-grid h3{min-height:44px}.review-grid textarea{margin-top:8px}.publication-actions{margin-top:18px}.timeline{position:relative;display:grid;gap:0}.timeline:before{content:"";position:absolute;left:20px;top:0;bottom:0;width:1px;background:var(--line)}.timeline article{position:relative;display:grid;grid-template-columns:42px minmax(0,1fr);gap:18px;padding:0 0 24px}.timeline article>span{z-index:1;width:42px;height:42px;display:grid;place-items:center;border:1px solid var(--cyan);border-radius:50%;background:var(--bg);font-size:10px}.timeline h3{margin:5px 0}.timeline small,.timeline p{color:var(--muted)}.diff-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}.diff-grid article{min-width:0}.diff-grid pre,.modal pre{max-height:70vh;overflow:auto;padding:16px;border:1px solid var(--line);border-radius:14px;background:#020509;color:#b7d2e8;font-size:11px;line-height:1.55}.template-columns{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}.template-columns>div{display:grid;gap:10px;align-content:start}.template-card{padding:14px;border:1px solid var(--line);border-radius:14px;background:#0a121c}.template-card small{display:block;margin:9px 0;color:var(--muted)}.template-card h4{margin:4px 0 6px}.template-card p{color:var(--muted);font-size:12px;line-height:1.5}.bar{display:grid;grid-template-columns:110px minmax(0,1fr) 30px;gap:12px;align-items:center;padding:10px 0}.bar>div{height:8px;background:#152331;border-radius:999px;overflow:hidden}.bar i{display:block;width:var(--width);height:100%;background:linear-gradient(90deg,var(--cyan),var(--violet))}.notice{width:100%;display:flex;justify-content:space-between;margin-bottom:16px;border-color:rgba(82,229,255,.35);background:rgba(82,229,255,.07);text-align:left}.notice span{color:var(--muted)}.dropzone{position:fixed;inset:20px;z-index:100;display:grid;place-items:center;border:2px dashed var(--cyan);border-radius:24px;background:rgba(2,8,12,.94);font-size:24px}.modal{position:fixed;inset:0;z-index:90;display:grid;place-items:center;padding:24px;background:rgba(0,0,0,.78)}.modal-card{width:min(1100px,95vw);max-height:92vh;padding:20px;border:1px solid var(--line);border-radius:20px;background:#071019}.modal-card>div{display:flex;justify-content:space-between;align-items:center}.modal-card h2{margin:0}.modal-card pre{max-height:75vh}.top-actions button,.top-actions input{font-size:12px}@media(max-width:1200px){.engine-grid{grid-template-columns:repeat(2,1fr)}.metrics{grid-template-columns:repeat(3,1fr)}.review-grid{grid-template-columns:repeat(2,1fr)}.template-columns{grid-template-columns:1fr}.package-grid{grid-template-columns:repeat(2,1fr)}}@media(max-width:900px){.workspace{grid-template-columns:1fr}aside{position:relative;top:0;height:auto;border-right:0;border-bottom:1px solid var(--line)}aside nav{grid-template-columns:repeat(3,1fr)}.topbar{height:auto;align-items:flex-start;padding:14px;gap:12px}.topbar,.top-actions{flex-wrap:wrap}.top-actions input{width:100%}.content{padding:20px}.command-grid,.split,.runtime-split,.two-col,.three-col,.diff-grid{grid-template-columns:1fr}.chain-strip{grid-template-columns:repeat(4,1fr)}.continuity-grid{grid-template-columns:repeat(2,1fr)}.determinations{grid-template-columns:repeat(2,1fr)}}@media(max-width:620px){.engine-orchestration-head{display:block}.engine-health{margin-top:12px}.engine-grid{grid-template-columns:1fr}.engine-flow{justify-content:flex-start}.metrics,.form-grid,.review-grid,.package-grid,.continuity-grid,.checklist{grid-template-columns:1fr}.field-wide{grid-column:auto}.matrix-head{display:none}.matrix-row{grid-template-columns:1fr}.record-header,.section-title{display:block}.section-actions{margin-top:12px}.content{padding:14px}.top-actions{width:100%}aside nav{grid-template-columns:repeat(2,1fr)}.trigger{grid-template-columns:1fr}.ledger.compact{grid-template-columns:1fr}}@media print{.topbar,aside,.section-actions,.publication-actions,.notice,button{display:none!important}.workspace{display:block}.content{padding:0;color:#111}.studio-shell{background:#fff;color:#111}.panel,.hero-panel{box-shadow:none;background:#fff;border-color:#bbb}.record-header p,.section-title p,.metric p,.panel p{color:#444}.badge{color:#111;border-color:#777}.record-header{padding-top:0}}
`}</style>
    </main>
  );
}

export default StudioPage;
