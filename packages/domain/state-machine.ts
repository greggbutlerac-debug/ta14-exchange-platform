export type DeterministicDecision = "ALLOW" | "HOLD" | "DENY" | "ESCALATE";
export type RouteScopeState = "IN_SCOPE" | "OUT_OF_SCOPE";
export type LifecycleState =
  | "DRAFT"
  | "TESTABLE"
  | DeterministicDecision
  | "SELF_DECLARED"
  | "REVIEWABLE"
  | "VERIFIED"
  | "CONTINUOUSLY_VERIFIED"
  | "UNDER_REVIEW"
  | "SUSPENDED"
  | "EXPIRED"
  | "REVOKED";

export interface RequirementResult {
  requirementId: string;
  requirementVersion: string;
  result: "SATISFIED" | "HOLD" | "DENY" | "ESCALATE";
  reason: string;
  evidenceIds: string[];
}

const rank: Record<RequirementResult["result"], number> = {
  SATISFIED: 0,
  HOLD: 1,
  ESCALATE: 2,
  DENY: 3,
};

export function deriveDecision(results: readonly RequirementResult[]): DeterministicDecision {
  if (results.length === 0) return "HOLD";
  const highest = results.reduce((a, b) => (rank[b.result] > rank[a.result] ? b : a));
  if (highest.result === "DENY") return "DENY";
  if (highest.result === "ESCALATE") return "ESCALATE";
  if (highest.result === "HOLD") return "HOLD";
  return "ALLOW";
}

export function nextPermissibleAction(decision: DeterministicDecision): string {
  switch (decision) {
    case "DENY": return "Stop execution, preserve evidence, remediate, create a new route version, and retest.";
    case "ESCALATE": return "Route to the named responsible authority; no automated approval is permitted.";
    case "HOLD": return "Show exact failed requirements and permit free correction on the same route lineage.";
    case "ALLOW": return "Permit bounded progression and preserve the signed decision receipt.";
  }
}

export function paymentMayChangeDecision(): false { return false; }
