export type EntitlementStanding =
  | "ESTABLISHED"
  | "PARTIAL"
  | "NOT_ESTABLISHED"
  | "CONFLICT";

export type EnvironmentalPropositionBoundary = {
  inspectionObject: string;
  temporalBoundary?: string;
  spatialBoundary?: string;
  environmentalMediumOrSystem?: string;
  conditionOrVariable?: string;
  thresholdReference?: string;
};

export type PropositionEntitlement = {
  entitlementId: string;
  proposition: string;
  evidenceRefs: string[];
  boundary: EnvironmentalPropositionBoundary;
  standing: EntitlementStanding;
  limitations: string[];
  prohibitedExtensions: string[];
  createdAt: string;
};

export type EntitlementInput = {
  proposition: string;
  inspectionObject: string;
  evidenceRefs: string[];
  temporalBoundary?: string;
  spatialBoundary?: string;
  environmentalMediumOrSystem?: string;
  conditionOrVariable?: string;
  thresholdReference?: string;
  continuityEstablished: boolean;
  objectEstablished: boolean;
  propositionEstablished: boolean;
  conflictPresent?: boolean;
  limitations?: string[];
  prohibitedExtensions?: string[];
  createdAt?: string;
};

function stableToken(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0").toUpperCase();
}

export function establishPropositionEntitlement(
  input: EntitlementInput,
): PropositionEntitlement {
  const limitations = [...(input.limitations ?? [])];
  const prohibitedExtensions = [
    "Do not expand the determination beyond the declared environmental object.",
    "Do not expand the determination beyond the declared temporal or spatial boundary.",
    "Do not infer causation, health outcome, or execution authority without separate standing.",
    ...(input.prohibitedExtensions ?? []),
  ];

  let standing: EntitlementStanding = "ESTABLISHED";

  if (input.conflictPresent) {
    standing = "CONFLICT";
    limitations.push("Material evidentiary conflict remains unresolved.");
  } else if (!input.objectEstablished || !input.propositionEstablished) {
    standing = "NOT_ESTABLISHED";
    if (!input.objectEstablished) {
      limitations.push("The environmental object is not sufficiently established.");
    }
    if (!input.propositionEstablished) {
      limitations.push("The proposition is not sufficiently bounded.");
    }
  } else if (!input.continuityEstablished) {
    standing = "PARTIAL";
    limitations.push(
      "Continuity is not fully established; entitlement is limited to the evidence intervals actually supported.",
    );
  }

  const identitySeed = JSON.stringify({
    proposition: input.proposition.trim(),
    inspectionObject: input.inspectionObject.trim(),
    evidenceRefs: [...input.evidenceRefs].sort(),
    temporalBoundary: input.temporalBoundary ?? "",
    spatialBoundary: input.spatialBoundary ?? "",
    environmentalMediumOrSystem: input.environmentalMediumOrSystem ?? "",
    conditionOrVariable: input.conditionOrVariable ?? "",
    thresholdReference: input.thresholdReference ?? "",
  });

  return {
    entitlementId: `TA14-ENT-${stableToken(identitySeed)}`,
    proposition: input.proposition.trim(),
    evidenceRefs: [...input.evidenceRefs],
    boundary: {
      inspectionObject: input.inspectionObject.trim(),
      temporalBoundary: input.temporalBoundary,
      spatialBoundary: input.spatialBoundary,
      environmentalMediumOrSystem: input.environmentalMediumOrSystem,
      conditionOrVariable: input.conditionOrVariable,
      thresholdReference: input.thresholdReference,
    },
    standing,
    limitations,
    prohibitedExtensions,
    createdAt: input.createdAt ?? new Date().toISOString(),
  };
}
