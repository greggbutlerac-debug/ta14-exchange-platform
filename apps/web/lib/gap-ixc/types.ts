export type GapIxcDimension = "G" | "A" | "P" | "I" | "X" | "C";

export type GapIxcState =
  | "ESTABLISHED"
  | "PARTIALLY_ESTABLISHED"
  | "UNESTABLISHED"
  | "INDETERMINATE"
  | "NOT_APPLICABLE";

export type GapIxcEvidenceBasis =
  | "REGISTRANT_EVIDENCE"
  | "TA14_EVIDENCE"
  | "INDEPENDENTLY_PRODUCED"
  | "INDEPENDENTLY_REPRODUCED"
  | "PUBLIC_SOURCE"
  | "CROSS_PARTY"
  | "NOT_INDEPENDENTLY_ESTABLISHED"
  | "NOT_SUBMITTED"
  | "NOT_PRESERVED"
  | "OUTSIDE_REVIEW_SCOPE";

export type GapIxcEvidenceClass =
  | "DIRECT"
  | "DERIVED"
  | "TESTIMONIAL"
  | "DOCUMENTARY"
  | "RUNTIME"
  | "OBSERVATIONAL"
  | "CRYPTOGRAPHIC"
  | "OTHER";

export type GapIxcCriterionDisposition = {
  criterionId: string;
  criterion: string;
  satisfied: boolean | null;
  evidenceIds: string[];
  qualification?: string;
};

export type GapIxcDetermination = {
  determinationId: string;
  architectureRegistryId: string;
  architectureVersion: string;
  propositionId: string;
  proposition: string;
  dimension: GapIxcDimension;
  state: GapIxcState;
  evidenceBasis: GapIxcEvidenceBasis[];
  evidenceIds: string[];
  evidenceClasses?: GapIxcEvidenceClass[];
  scope: string;
  exclusions: string[];
  materialQualification?: string;
  independenceBoundary: string;
  assessedAt: string;
  validThrough?: string;
  observationWindow?: string;
  revalidationTriggers: string[];
  unresolvedConditions: string[];
  contradictions: string[];
  criterionDispositions: GapIxcCriterionDisposition[];
  assessor: {
    id: string;
    role: string;
    independent: boolean;
  };
  historicalSourceId?: string;
  historicalVerificationLevel?: string;
};

export type GapIxcPropositionFreeze = {
  freezeId: string;
  architectureRegistryId: string;
  architectureVersion: string;
  propositionId: string;
  proposition: string;
  materialSubPropositions: Array<{ id: string; proposition: string }>;
  scope: string;
  exclusions: string[];
  routeId?: string;
  environment?: string;
  executionBoundary?: string;
  consequenceBoundary?: string;
  observationWindow?: string;
  applicableDimensions: GapIxcDimension[];
  evidenceAdmissionRules: string[];
  evidenceInventory: string[];
  outputSchemaVersion: string;
  frozenAt: string;
  frozenBy: string;
};

export type GapIxcPortableAssurance = Pick<
  GapIxcDetermination,
  | "determinationId"
  | "dimension"
  | "state"
  | "propositionId"
  | "architectureRegistryId"
  | "architectureVersion"
  | "evidenceBasis"
  | "materialQualification"
  | "independenceBoundary"
  | "historicalSourceId"
>;

export const GAP_IXC_DIMENSION_LABELS: Record<GapIxcDimension, string> = {
  G: "Governance-Basis Support",
  A: "Authority Standing",
  P: "Proposition Support",
  I: "Implementation Support",
  X: "Execution Support",
  C: "Consequence Support",
};

export const GAP_IXC_STATES: GapIxcState[] = [
  "ESTABLISHED",
  "PARTIALLY_ESTABLISHED",
  "UNESTABLISHED",
  "INDETERMINATE",
  "NOT_APPLICABLE",
];
