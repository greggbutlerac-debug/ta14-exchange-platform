import type {
  TransferRouteDraft,
  TransferStageKey,
} from "./route-draft-transfer";
import {
  isAuthorityCurrent,
  isEvidenceCurrent,
} from "./evidence-hardening-engine";
import type {
  EvidenceBundle,
  EvidenceMode,
  EvidenceRung,
} from "./evidence-hardening-types";

export type AiGovernanceDecision = "ALLOW" | "HOLD" | "DENY" | "ESCALATE";
export type AiGovernanceRequirementId =
  | "AI-DOMAIN-COMPATIBILITY"
  | "AI-CHAIN-COMPLETENESS"
  | "AI-EVIDENCE-ADMISSIBILITY"
  | "AI-AUTHORITY-BINDING"
  | "AI-COMMIT-READINESS";
export type AiGovernanceRequirementStatus = "SATISFIED" | "UNSATISFIED" | "UNKNOWN";

export type AiGovernanceRequirementResult = {
  requirementId: AiGovernanceRequirementId;
  label: string;
  status: AiGovernanceRequirementStatus;
  reason: string;
  relatedStages: TransferStageKey[];
};

export type AiGovernanceAdapterResult = {
  adapter: "TA14_AI_GOVERNANCE_ADAPTER_V2";
  routeId: string;
  domain: string;
  decision: AiGovernanceDecision;
  evaluatedAt: string;
  deterministicFingerprint: string;
  evidenceMode: EvidenceMode;
  evidenceRung: EvidenceRung;
  claimBoundary: string;
  requirements: AiGovernanceRequirementResult[];
  satisfiedRequirements: number;
  unresolvedRequirements: number;
  failedRequirements: number;
  nextAction:
    | "SUPPLY_ADMISSIBLE_EVIDENCE"
    | "CORRECT_ROUTE_DEFINITION"
    | "ESCALATE_FOR_HUMAN_REVIEW"
    | "READY_FOR_COMMIT";
  limitations: string[];
  governingPrinciple: "No admissible evidence. No admissible execution.";
};

const REQUIRED_STAGE_KEYS: TransferStageKey[] = [
  "reality", "record", "continuity", "admissibility", "binding", "commit", "execution", "outcome",
];

function normalize(value: string): string { return value.trim().toLowerCase(); }
function isUnknown(value: string | undefined): boolean {
  if (!value) return true;
  const normalized = normalize(value);
  return normalized.length === 0 || normalized === "unknown" || normalized === "not declared" || normalized === "not provided";
}
function isAiGovernanceDomain(draft: TransferRouteDraft): boolean {
  const domain = normalize(draft.metadata.domain);
  const routeName = normalize(draft.metadata.name);
  return domain === "ai governance" || domain === "artificial intelligence governance" || domain === "ai" || routeName.includes("ai agent") || routeName.includes("artificial intelligence");
}
function hasCompleteDeclaredChain(draft: TransferRouteDraft): boolean {
  return REQUIRED_STAGE_KEYS.every((key) => !isUnknown(draft.chain[key]));
}
function canonicalize(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((item) => canonicalize(item)).join(",")}]`;
  const entries = Object.entries(value as Record<string, unknown>).sort(([a], [b]) => a.localeCompare(b));
  return `{${entries.map(([key, item]) => `${JSON.stringify(key)}:${canonicalize(item)}`).join(",")}}`;
}
function simpleDeterministicHash(value: string): string {
  let first = 0x811c9dc5;
  let second = 0x9e3779b9;
  for (let index = 0; index < value.length; index += 1) {
    const code = value.charCodeAt(index);
    first ^= code; first = Math.imul(first, 0x01000193);
    second ^= code + index; second = Math.imul(second, 0x85ebca6b);
  }
  return `aigov-v2-${(first >>> 0).toString(16).padStart(8, "0")}${(second >>> 0).toString(16).padStart(8, "0")}`;
}
function requirement(requirementId: AiGovernanceRequirementId, label: string, status: AiGovernanceRequirementStatus, reason: string, relatedStages: TransferStageKey[]): AiGovernanceRequirementResult {
  return { requirementId, label, status, reason, relatedStages };
}

export function evaluateAiGovernanceRoute(
  draft: TransferRouteDraft,
  evaluatedAt = new Date().toISOString(),
  evidenceBundle?: EvidenceBundle,
): AiGovernanceAdapterResult {
  const at = new Date(evaluatedAt);
  const domainCompatible = isAiGovernanceDomain(draft);
  const completeChain = hasCompleteDeclaredChain(draft);
  const evidenceSupplied = (evidenceBundle?.evidence.length ?? 0) > 0;
  const currentEvidence = evidenceBundle?.evidence.filter((item) => isEvidenceCurrent(item, at)) ?? [];
  const evidenceAdmissible = evidenceSupplied && currentEvidence.length === evidenceBundle?.evidence.length;
  const authoritySupplied = (evidenceBundle?.authority.length ?? 0) > 0;
  const currentAuthority = evidenceBundle?.authority.filter((item) => isAuthorityCurrent(item, at)) ?? [];
  const authorityAdmissible = authoritySupplied && currentAuthority.length > 0;

  const requirements: AiGovernanceRequirementResult[] = [
    requirement("AI-DOMAIN-COMPATIBILITY", "AI governance domain compatibility", domainCompatible ? "SATISFIED" : "UNSATISFIED", domainCompatible ? "The route identifies an AI governance or AI-agent consequence domain." : "The route does not identify an AI governance domain and cannot be evaluated by this adapter.", ["reality", "execution"]),
    requirement("AI-CHAIN-COMPLETENESS", "Canonical chain completeness", completeChain ? "SATISFIED" : "UNSATISFIED", completeChain ? "All eight Reality → Outcome stages contain declared route content. This establishes route completeness, not external truth." : "One or more required canonical stages remain UNKNOWN or undeclared.", REQUIRED_STAGE_KEYS),
    requirement("AI-EVIDENCE-ADMISSIBILITY", "Admissible evidence", !evidenceSupplied ? "UNKNOWN" : evidenceAdmissible ? "SATISFIED" : "UNSATISFIED", !evidenceSupplied ? "No typed evidence bundle was supplied. Declared route descriptions are not evidence." : evidenceAdmissible ? "All supplied evidence objects are currently admitted and within declared validity windows." : "One or more supplied evidence objects are stale, rejected, conflicting, unavailable, or unresolved.", ["reality", "record", "continuity", "admissibility"]),
    requirement("AI-AUTHORITY-BINDING", "Authority and actor binding", !authoritySupplied ? "UNKNOWN" : authorityAdmissible ? "SATISFIED" : "UNSATISFIED", !authoritySupplied ? "No typed authority object was supplied." : authorityAdmissible ? "At least one supplied authority object is active and within its validity window." : "Supplied authority is revoked, expired, not yet valid, or unresolved.", ["admissibility", "binding", "commit"]),
    requirement("AI-COMMIT-READINESS", "Commit readiness", evidenceAdmissible && authorityAdmissible ? "SATISFIED" : "UNKNOWN", evidenceAdmissible && authorityAdmissible ? "Evidence and authority prerequisites are resolved for commit formation. Exact target/action parity must still be enforced by the protected adapter." : "Commit formation remains unavailable until admissible evidence and current authority are established.", ["binding", "commit"]),
  ];

  const satisfiedRequirements = requirements.filter((item) => item.status === "SATISFIED").length;
  const unresolvedRequirements = requirements.filter((item) => item.status === "UNKNOWN").length;
  const failedRequirements = requirements.filter((item) => item.status === "UNSATISFIED").length;

  let decision: AiGovernanceDecision;
  let nextAction: AiGovernanceAdapterResult["nextAction"];
  if (!domainCompatible) { decision = "DENY"; nextAction = "CORRECT_ROUTE_DEFINITION"; }
  else if (!completeChain) { decision = "HOLD"; nextAction = "CORRECT_ROUTE_DEFINITION"; }
  else if (failedRequirements > 0) { decision = "HOLD"; nextAction = "ESCALATE_FOR_HUMAN_REVIEW"; }
  else if (unresolvedRequirements > 0) { decision = "HOLD"; nextAction = "SUPPLY_ADMISSIBLE_EVIDENCE"; }
  else { decision = "ALLOW"; nextAction = "READY_FOR_COMMIT"; }

  const hasExternal = evidenceBundle?.evidence.some((item) => item.sourceClass === "EXTERNAL_SYSTEM" || item.sourceClass === "TARGET_SYSTEM") ?? false;
  const evidenceMode: EvidenceMode = hasExternal ? "EXTERNAL_OBSERVATION" : "SYNTHETIC_EXECUTION";
  const evidenceRung: EvidenceRung = hasExternal ? "E3" : "E1";
  const claimBoundary = hasExternal
    ? "External evidence was supplied to the adapter; this determination alone does not establish causal execution control or outcome correspondence."
    : "This adapter result demonstrates deterministic governance behavior over declared/supplied conditions only. It does not establish external event occurrence.";

  const fingerprintInput = { adapter: "TA14_AI_GOVERNANCE_ADAPTER_V2", routeId: draft.routeId, metadata: draft.metadata, chain: draft.chain, evidenceIds: evidenceBundle?.evidence.map((item) => item.evidenceId) ?? [], authorityIds: evidenceBundle?.authority.map((item) => item.authorityId) ?? [], requirements: requirements.map(({ requirementId, status }) => ({ requirementId, status })), decision, nextAction };

  return {
    adapter: "TA14_AI_GOVERNANCE_ADAPTER_V2",
    routeId: draft.routeId,
    domain: draft.metadata.domain,
    decision,
    evaluatedAt,
    deterministicFingerprint: simpleDeterministicHash(canonicalize(fingerprintInput)),
    evidenceMode,
    evidenceRung,
    claimBoundary,
    requirements,
    satisfiedRequirements,
    unresolvedRequirements,
    failedRequirements,
    nextAction,
    limitations: [
      "Declared route text is not treated as proof that evidence exists.",
      "ALLOW means commit-ready under the supplied evidence and authority; it is not itself proof of execution or outcome.",
      "E3-E5 standing requires the corresponding external observation, causal enforcement, target evidence, or independent replay receipts.",
      "This result is not independent certification, legal approval, regulatory approval, or permission to execute outside a protected adapter.",
    ],
    governingPrinciple: "No admissible evidence. No admissible execution.",
  };
}
