import type {
  TransferRouteDraft,
  TransferStageKey,
} from "./route-draft-transfer";

export type AiGovernanceDecision =
  | "ALLOW"
  | "HOLD"
  | "DENY"
  | "ESCALATE";

export type AiGovernanceRequirementId =
  | "AI-DOMAIN-COMPATIBILITY"
  | "AI-CHAIN-COMPLETENESS"
  | "AI-EVIDENCE-ADMISSIBILITY"
  | "AI-AUTHORITY-BINDING"
  | "AI-EXECUTION-CORRESPONDENCE"
  | "AI-OUTCOME-CORRESPONDENCE";

export type AiGovernanceRequirementStatus =
  | "SATISFIED"
  | "UNSATISFIED"
  | "UNKNOWN";

export type AiGovernanceRequirementResult = {
  requirementId: AiGovernanceRequirementId;
  label: string;
  status: AiGovernanceRequirementStatus;
  reason: string;
  relatedStages: TransferStageKey[];
};

export type AiGovernanceAdapterResult = {
  adapter: "TA14_AI_GOVERNANCE_ADAPTER_V1";
  routeId: string;
  domain: string;
  decision: AiGovernanceDecision;
  evaluatedAt: string;
  deterministicFingerprint: string;
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
  governingPrinciple:
    "No admissible evidence. No admissible execution.";
};

const REQUIRED_STAGE_KEYS: TransferStageKey[] = [
  "reality",
  "record",
  "continuity",
  "admissibility",
  "binding",
  "commit",
  "execution",
  "outcome",
];

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

function isUnknown(value: string | undefined): boolean {
  if (!value) return true;

  const normalized = normalize(value);

  return (
    normalized.length === 0 ||
    normalized === "unknown" ||
    normalized === "not declared" ||
    normalized === "not provided"
  );
}

function isAiGovernanceDomain(
  draft: TransferRouteDraft,
): boolean {
  const domain = normalize(draft.metadata.domain);
  const routeName = normalize(draft.metadata.name);

  return (
    domain === "ai governance" ||
    domain === "artificial intelligence governance" ||
    domain === "ai" ||
    routeName.includes("ai agent") ||
    routeName.includes("artificial intelligence")
  );
}

function hasCompleteDeclaredChain(
  draft: TransferRouteDraft,
): boolean {
  return REQUIRED_STAGE_KEYS.every(
    (key) => !isUnknown(draft.chain[key]),
  );
}

function canonicalize(value: unknown): string {
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value);
  }

  if (Array.isArray(value)) {
    return `[${value
      .map((item) => canonicalize(item))
      .join(",")}]`;
  }

  const entries = Object.entries(
    value as Record<string, unknown>,
  ).sort(([left], [right]) =>
    left.localeCompare(right),
  );

  return `{${entries
    .map(
      ([key, entryValue]) =>
        `${JSON.stringify(key)}:${canonicalize(
          entryValue,
        )}`,
    )
    .join(",")}}`;
}

function simpleDeterministicHash(value: string): string {
  let first = 0x811c9dc5;
  let second = 0x9e3779b9;

  for (let index = 0; index < value.length; index += 1) {
    const code = value.charCodeAt(index);

    first ^= code;
    first = Math.imul(first, 0x01000193);

    second ^= code + index;
    second = Math.imul(second, 0x85ebca6b);
  }

  const firstHex = (first >>> 0)
    .toString(16)
    .padStart(8, "0");

  const secondHex = (second >>> 0)
    .toString(16)
    .padStart(8, "0");

  return `aigov-v1-${firstHex}${secondHex}`;
}

function requirement(
  requirementId: AiGovernanceRequirementId,
  label: string,
  status: AiGovernanceRequirementStatus,
  reason: string,
  relatedStages: TransferStageKey[],
): AiGovernanceRequirementResult {
  return {
    requirementId,
    label,
    status,
    reason,
    relatedStages,
  };
}

export function evaluateAiGovernanceRoute(
  draft: TransferRouteDraft,
  evaluatedAt = new Date().toISOString(),
): AiGovernanceAdapterResult {
  const domainCompatible = isAiGovernanceDomain(draft);
  const completeChain = hasCompleteDeclaredChain(draft);

  const requirements: AiGovernanceRequirementResult[] = [
    requirement(
      "AI-DOMAIN-COMPATIBILITY",
      "AI governance domain compatibility",
      domainCompatible ? "SATISFIED" : "UNSATISFIED",
      domainCompatible
        ? "The route identifies an AI governance or AI-agent consequence domain."
        : "The route does not identify an AI governance domain and cannot be evaluated by this adapter.",
      ["reality", "execution"],
    ),

    requirement(
      "AI-CHAIN-COMPLETENESS",
      "Canonical chain completeness",
      completeChain ? "SATISFIED" : "UNSATISFIED",
      completeChain
        ? "All eight Reality → Outcome stages contain declared route content."
        : "One or more required canonical stages remain UNKNOWN or undeclared.",
      REQUIRED_STAGE_KEYS,
    ),

    requirement(
      "AI-EVIDENCE-ADMISSIBILITY",
      "Admissible evidence",
      "UNKNOWN",
      "The builder transferred declared descriptions, but no independently verifiable evidence objects, source digests, custody records, timestamps, or evidence-to-requirement bindings were supplied to the adapter.",
      [
        "reality",
        "record",
        "continuity",
        "admissibility",
      ],
    ),

    requirement(
      "AI-AUTHORITY-BINDING",
      "Authority and actor binding",
      "UNKNOWN",
      "The route describes binding requirements, but no signed delegation, actor identity proof, authority scope, affected-party binding, tool identity, or execution-environment identity was supplied.",
      ["admissibility", "binding", "commit"],
    ),

    requirement(
      "AI-EXECUTION-CORRESPONDENCE",
      "Execution correspondence",
      "UNKNOWN",
      "No committed action digest or authoritative tool-call receipt exists yet, so the adapter cannot determine whether an execution corresponds to the declared route.",
      ["commit", "execution"],
    ),

    requirement(
      "AI-OUTCOME-CORRESPONDENCE",
      "Outcome correspondence",
      "UNKNOWN",
      "No authoritative post-execution system state, tool receipt, affected-resource record, or reconciliation artifact was supplied.",
      ["execution", "outcome"],
    ),
  ];

  const satisfiedRequirements = requirements.filter(
    (item) => item.status === "SATISFIED",
  ).length;

  const unresolvedRequirements = requirements.filter(
    (item) => item.status === "UNKNOWN",
  ).length;

  const failedRequirements = requirements.filter(
    (item) => item.status === "UNSATISFIED",
  ).length;

  let decision: AiGovernanceDecision;
  let nextAction: AiGovernanceAdapterResult["nextAction"];

  if (!domainCompatible) {
    decision = "DENY";
    nextAction = "CORRECT_ROUTE_DEFINITION";
  } else if (!completeChain) {
    decision = "HOLD";
    nextAction = "CORRECT_ROUTE_DEFINITION";
  } else if (
    failedRequirements > 0 &&
    unresolvedRequirements > 0
  ) {
    decision = "ESCALATE";
    nextAction = "ESCALATE_FOR_HUMAN_REVIEW";
  } else if (unresolvedRequirements > 0) {
    decision = "HOLD";
    nextAction = "SUPPLY_ADMISSIBLE_EVIDENCE";
  } else {
    decision = "ALLOW";
    nextAction = "READY_FOR_COMMIT";
  }

  const fingerprintInput = {
    adapter: "TA14_AI_GOVERNANCE_ADAPTER_V1",
    routeId: draft.routeId,
    metadata: draft.metadata,
    chain: draft.chain,
    requirements: requirements.map((item) => ({
      requirementId: item.requirementId,
      status: item.status,
      reason: item.reason,
      relatedStages: item.relatedStages,
    })),
    decision,
    nextAction,
  };

  return {
    adapter: "TA14_AI_GOVERNANCE_ADAPTER_V1",
    routeId: draft.routeId,
    domain: draft.metadata.domain,
    decision,
    evaluatedAt,
    deterministicFingerprint:
      simpleDeterministicHash(
        canonicalize(fingerprintInput),
      ),
    requirements,
    satisfiedRequirements,
    unresolvedRequirements,
    failedRequirements,
    nextAction,
    limitations: [
      "This adapter evaluates the transferred route definition only.",
      "Declared route text is not treated as proof that evidence exists.",
      "No production identity, authorization, policy, model, tool, custody, execution, or outcome service is connected in this version.",
      "An ALLOW decision is impossible while required evidence, authority, execution correspondence, or outcome correspondence remains UNKNOWN.",
      "This result is not independent certification, legal approval, regulatory approval, or permission to execute.",
    ],
    governingPrinciple:
      "No admissible evidence. No admissible execution.",
  };
}
