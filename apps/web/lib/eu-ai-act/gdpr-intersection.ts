export type Ternary = "yes" | "no" | "unknown";
export type BoundaryState = "SUPPORTED" | "INCOMPLETE" | "REVIEW_REQUIRED" | "OUT_OF_SCOPE";

export type IntersectionInput = {
  personalData: Ternary;
  lawfulBasis: Ternary;
  gdprEvidence: Ternary;
  aiInScope: Ternary;
  aiClassified: Ternary;
  aiEvidence: Ternary;
  materialChange: Ternary;
};

export type IntersectionResult = {
  gdpr: BoundaryState;
  aiAct: BoundaryState;
  revalidationRequired: boolean;
};

export function evaluateGdprAiActIntersection(input: IntersectionInput): IntersectionResult {
  const revalidationRequired = input.materialChange !== "no";

  const gdpr: BoundaryState = input.personalData === "no"
    ? "OUT_OF_SCOPE"
    : input.personalData === "unknown"
      ? "REVIEW_REQUIRED"
      : input.lawfulBasis === "yes" && input.gdprEvidence === "yes" && !revalidationRequired
        ? "SUPPORTED"
        : "INCOMPLETE";

  const aiAct: BoundaryState = input.aiInScope === "no"
    ? "OUT_OF_SCOPE"
    : input.aiInScope === "unknown"
      ? "REVIEW_REQUIRED"
      : input.aiClassified === "yes" && input.aiEvidence === "yes" && !revalidationRequired
        ? "SUPPORTED"
        : "INCOMPLETE";

  return {gdpr, aiAct, revalidationRequired};
}
