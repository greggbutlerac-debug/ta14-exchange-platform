import type {
  EnvironmentalPropositionBoundary,
  PropositionEntitlement,
} from "./proposition-entitlement";

export type EnvironmentalDeterminationState =
  | "SUPPORTED"
  | "PARTIALLY_SUPPORTED"
  | "UNSUPPORTED"
  | "INDETERMINATE";

export type BoundedEnvironmentalDetermination = {
  determinationId: string;
  entitlementId: string;
  proposition: string;
  state: EnvironmentalDeterminationState;
  determinationText: string;
  establishedBoundary: EnvironmentalPropositionBoundary;
  evidenceRefs: string[];
  unresolvedConditions: string[];
  prohibitedExtensions: string[];
  createdAt: string;
};

export type BoundingResult = {
  valid: boolean;
  reasons: string[];
};

function normalized(value?: string) {
  return (value ?? "").trim().toLowerCase();
}

function boundaryExpansion(
  entitled?: string,
  determined?: string,
  reason?: string,
): string | null {
  const allowed = normalized(entitled);
  const actual = normalized(determined);
  if (!actual || !allowed || actual === allowed) return null;
  if (allowed.includes(actual)) return null;
  return reason ?? "DET_SCOPE_EXPANSION";
}

function validateStandingState(
  standing: PropositionEntitlement["standing"],
  state: EnvironmentalDeterminationState,
): string | null {
  switch (standing) {
    case "ESTABLISHED":
      return null;
    case "PARTIAL":
      return state === "PARTIALLY_SUPPORTED" || state === "UNSUPPORTED" || state === "INDETERMINATE"
        ? null
        : "ENT_STANDING_PARTIAL";
    case "NOT_ESTABLISHED":
      return state === "UNSUPPORTED" || state === "INDETERMINATE"
        ? null
        : "DET_STATE_EXCEEDS_UNESTABLISHED_STANDING";
    case "CONFLICT":
      return state === "INDETERMINATE"
        ? null
        : "DET_STATE_INCOMPATIBLE_WITH_CONFLICT";
    default:
      return "DET_UNKNOWN_ENTITLEMENT_STANDING";
  }
}

export function validateDeterminationBoundary(
  entitlement: PropositionEntitlement,
  determination: BoundedEnvironmentalDetermination,
): BoundingResult {
  const reasons: string[] = [];

  if (determination.entitlementId !== entitlement.entitlementId) {
    reasons.push("DET_ENTITLEMENT_ID_MISMATCH");
  }

  if (normalized(determination.proposition) !== normalized(entitlement.proposition)) {
    reasons.push("DET_PROPOSITION_SCOPE_EXPANSION");
  }

  const checks = [
    boundaryExpansion(
      entitlement.boundary.inspectionObject,
      determination.establishedBoundary.inspectionObject,
      "DET_OBJECT_SCOPE_EXPANSION",
    ),
    boundaryExpansion(
      entitlement.boundary.temporalBoundary,
      determination.establishedBoundary.temporalBoundary,
      "DET_TEMPORAL_SCOPE_EXPANSION",
    ),
    boundaryExpansion(
      entitlement.boundary.spatialBoundary,
      determination.establishedBoundary.spatialBoundary,
      "DET_SPATIAL_SCOPE_EXPANSION",
    ),
    boundaryExpansion(
      entitlement.boundary.thresholdReference,
      determination.establishedBoundary.thresholdReference,
      "DET_THRESHOLD_SCOPE_EXPANSION",
    ),
  ];

  for (const check of checks) {
    if (check) reasons.push(check);
  }

  const text = normalized(determination.determinationText);
  if (/\b(caused|causes|because of|resulted from|attributable to)\b/.test(text)) {
    reasons.push("DET_CAUSAL_EXPANSION");
  }
  if (/\b(diagnos|disease|illness|injury|health outcome|medical)\b/.test(text)) {
    reasons.push("DET_HEALTH_SCOPE_EXPANSION");
  }
  if (/\b(authoriz(?:e|ed|es|ation|ing)?|permission to execute|may execute|must execute|intervention required)\b/.test(text)) {
    reasons.push("DET_AUTHORITY_SCOPE_EXPANSION");
  }

  const standingStateFailure = validateStandingState(
    entitlement.standing,
    determination.state,
  );
  if (standingStateFailure) reasons.push(standingStateFailure);

  return { valid: reasons.length === 0, reasons: [...new Set(reasons)] };
}
