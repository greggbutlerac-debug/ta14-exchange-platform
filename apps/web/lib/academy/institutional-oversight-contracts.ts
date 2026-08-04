/**
 * TA-14 Authority Governance Institution
 * ACD-027 — Institutional Oversight Contracts
 *
 * Create:
 *   apps/web/lib/academy/institutional-oversight-contracts.ts
 *
 * Purpose:
 *   Govern independent institutional oversight of assurance,
 *   stewardship, strategy, governance performance, corrective action,
 *   and institutional reform without rewriting historical records.
 */

export const TA14_INSTITUTIONAL_OVERSIGHT_ENGINE_ID =
  "TA14-ACD-INSTITUTIONAL-OVERSIGHT-000001" as const;

export const TA14_INSTITUTIONAL_OVERSIGHT_ENGINE_VERSION =
  "1.0.0" as const;

export const TA14_INSTITUTIONAL_OVERSIGHT_BOUNDARY =
  "Institutional oversight evaluates the institution, requires accountable follow-up, and initiates future governance action without rewriting historical governance records." as const;

export const INSTITUTIONAL_OVERSIGHT_STATES = [
  "draft",
  "scheduled",
  "active",
  "evidence_requested",
  "under_review",
  "follow_up_required",
  "held",
  "escalated",
  "completed",
  "withdrawn",
  "superseded",
  "archived",
] as const;

export type InstitutionalOversightState =
  (typeof INSTITUTIONAL_OVERSIGHT_STATES)[number];

export const INSTITUTIONAL_OVERSIGHT_TYPES = [
  "governance_health",
  "assurance_review",
  "stewardship_review",
  "strategy_alignment",
  "authority_review",
  "registry_integrity",
  "execution_integrity",
  "continuity_integrity",
  "institutional_risk",
  "corrective_action",
  "independent_review",
  "special_inquiry",
] as const;

export type InstitutionalOversightType =
  (typeof INSTITUTIONAL_OVERSIGHT_TYPES)[number];

export const INSTITUTIONAL_OVERSIGHT_OUTCOMES = [
  "satisfactory",
  "satisfactory_with_conditions",
  "improvement_required",
  "corrective_action_required",
  "revalidation_required",
  "independent_review_required",
  "hold",
  "escalate",
  "institutional_reform_required",
] as const;

export type InstitutionalOversightOutcome =
  (typeof INSTITUTIONAL_OVERSIGHT_OUTCOMES)[number];

export const INSTITUTIONAL_OVERSIGHT_SEVERITIES = [
  "informational",
  "low",
  "moderate",
  "high",
  "critical",
] as const;

export type InstitutionalOversightSeverity =
  (typeof INSTITUTIONAL_OVERSIGHT_SEVERITIES)[number];

export interface InstitutionalOversightDefinition {
  readonly definitionId: string;
  readonly title: string;
  readonly description: string;
  readonly version: string;
  readonly active: boolean;
  readonly supportedTypes: readonly InstitutionalOversightType[];
  readonly allowedReviewerRoles: readonly string[];
  readonly minimumReviewerCount: number;
  readonly independentReviewerRequired: boolean;
  readonly conflictCheckRequired: boolean;
  readonly authorityCheckRequired: boolean;
  readonly evidenceRequired: boolean;
  readonly followUpRequiredForAdverseOutcome: boolean;
  readonly preservesHistory: true;
  readonly rewritesHistory: false;
  readonly boundary: string;
  readonly effectiveAt: string;
  readonly contentHash: string;
}

export interface InstitutionalOversightScope {
  readonly scopeId: string;
  readonly organizationIds: readonly string[];
  readonly divisionIds: readonly string[];
  readonly governanceCycleIds: readonly string[];
  readonly assuranceRecordIds: readonly string[];
  readonly stewardshipRecordIds: readonly string[];
  readonly strategyRecordIds: readonly string[];
  readonly authorityRecordIds: readonly string[];
  readonly registryRecordIds: readonly string[];
  readonly artifactIds: readonly string[];
  readonly executionIds: readonly string[];
  readonly outcomeIds: readonly string[];
  readonly continuityIds: readonly string[];
  readonly includedQuestions: readonly string[];
  readonly excludedQuestions: readonly string[];
  readonly limitations: readonly string[];
}

export interface InstitutionalOversightEvidence {
  readonly evidenceId: string;
  readonly title: string;
  readonly sourceType:
    | "assurance"
    | "stewardship"
    | "strategy"
    | "authority"
    | "registry"
    | "artifact"
    | "execution"
    | "outcome"
    | "continuity"
    | "policy"
    | "standard"
    | "law"
    | "external_review"
    | "other";
  readonly sourceRecordId: string;
  readonly sourceVersion?: string;
  readonly sourceHash: string;
  readonly attributable: boolean;
  readonly permitted: boolean;
  readonly current: boolean;
  readonly integrityVerified: boolean;
  readonly provenanceVerified: boolean;
  readonly relevant: boolean;
  readonly limitations: readonly string[];
}

export interface InstitutionalOversightReviewer {
  readonly reviewerId: string;
  readonly subjectId: string;
  readonly role: string;
  readonly independent: boolean;
  readonly conflictChecked: boolean;
  readonly authorityChecked: boolean;
  readonly competenceChecked: boolean;
  readonly assignedAt: string;
  readonly active: boolean;
  readonly limitations: readonly string[];
}

export interface InstitutionalOversightFinding {
  readonly findingId: string;
  readonly title: string;
  readonly statement: string;
  readonly severity: InstitutionalOversightSeverity;
  readonly supported: boolean;
  readonly evidenceIds: readonly string[];
  readonly affectedRecordIds: readonly string[];
  readonly limitations: readonly string[];
  readonly createdByReviewerId: string;
  readonly createdAt: string;
  readonly findingCreatedDetermination: false;
  readonly findingCreatedPublication: false;
  readonly findingCreatedExecutionArtifact: false;
  readonly findingCreatedExecution: false;
}

export interface InstitutionalOversightRecommendation {
  readonly recommendationId: string;
  readonly title: string;
  readonly description: string;
  readonly priority:
    | "routine"
    | "important"
    | "urgent"
    | "critical";
  readonly ownerId?: string;
  readonly dueAt?: string;
  readonly requiredAction:
    | "document"
    | "correct"
    | "revalidate"
    | "review_authority"
    | "review_strategy"
    | "review_stewardship"
    | "review_assurance"
    | "hold_activity"
    | "escalate"
    | "institutional_reform"
    | "other";
  readonly completionCondition: string;
  readonly consequenceOfInaction: string;
  readonly relatedFindingIds: readonly string[];
  readonly limitations: readonly string[];
}

export interface InstitutionalOversightCorrectiveAction {
  readonly correctiveActionId: string;
  readonly recommendationId: string;
  readonly ownerId: string;
  readonly state:
    | "open"
    | "in_progress"
    | "evidence_submitted"
    | "verified"
    | "returned"
    | "held"
    | "escalated"
    | "closed";
  readonly actionPlan: string;
  readonly evidenceIds: readonly string[];
  readonly openedAt: string;
  readonly dueAt?: string;
  readonly completedAt?: string;
  readonly verifiedAt?: string;
  readonly limitations: readonly string[];
}

export interface InstitutionalOversightConcurrence {
  readonly concurrenceId: string;
  readonly state:
    | "not_evaluated"
    | "unanimous"
    | "majority"
    | "qualified"
    | "disputed"
    | "insufficient_reviewers";
  readonly concurringReviewerIds: readonly string[];
  readonly qualifiedReviewerIds: readonly string[];
  readonly dissentingReviewerIds: readonly string[];
  readonly abstainingReviewerIds: readonly string[];
  readonly recusedReviewerIds: readonly string[];
  readonly minimumReviewerCountSatisfied: boolean;
  readonly independenceSatisfied: boolean;
  readonly evaluatedAt: string;
}

export interface InstitutionalOversightRecord {
  readonly oversightId: string;
  readonly definitionId: string;
  readonly oversightType: InstitutionalOversightType;
  readonly state: InstitutionalOversightState;
  readonly title: string;
  readonly purpose: string;
  readonly scope: InstitutionalOversightScope;
  readonly evidence: readonly InstitutionalOversightEvidence[];
  readonly reviewers: readonly InstitutionalOversightReviewer[];
  readonly findings: readonly InstitutionalOversightFinding[];
  readonly recommendations: readonly InstitutionalOversightRecommendation[];
  readonly correctiveActions: readonly InstitutionalOversightCorrectiveAction[];
  readonly concurrence: InstitutionalOversightConcurrence;
  readonly outcome?: InstitutionalOversightOutcome;
  readonly outcomeRationale?: string;
  readonly createdBySubjectId: string;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly completedAt?: string;
  readonly heldAt?: string;
  readonly escalatedAt?: string;
  readonly withdrawnAt?: string;
  readonly supersededAt?: string;
  readonly preservesHistory: true;
  readonly rewritesHistory: false;
  readonly createdFinding: false;
  readonly createdDetermination: false;
  readonly createdRegistryPublication: false;
  readonly createdExecutionArtifact: false;
  readonly createdExecution: false;
  readonly correlationId: string;
  readonly integrityHash: string;
}

export interface InstitutionalOversightValidationIssue {
  readonly path: string;
  readonly code:
    | "required"
    | "invalid_state"
    | "invalid_type"
    | "invalid_hash"
    | "history_not_preserved"
    | "history_rewrite_attempt"
    | "insufficient_reviewers"
    | "independence_not_satisfied"
    | "conflict_check_missing"
    | "authority_check_missing"
    | "evidence_not_verified"
    | "unauthorized_effect";
  readonly message: string;
  readonly severity: "error" | "warning";
}

export interface InstitutionalOversightValidationResult {
  readonly ok: boolean;
  readonly issues: readonly InstitutionalOversightValidationIssue[];
}

export function validateInstitutionalOversight(
  value: InstitutionalOversightRecord,
  definition?: InstitutionalOversightDefinition,
): InstitutionalOversightValidationResult {
  const issues: InstitutionalOversightValidationIssue[] = [];

  if (!value.oversightId.trim()) {
    issues.push({
      path: "$.oversightId",
      code: "required",
      message: "oversightId is required.",
      severity: "error",
    });
  }

  if (!INSTITUTIONAL_OVERSIGHT_STATES.includes(value.state)) {
    issues.push({
      path: "$.state",
      code: "invalid_state",
      message: "Unsupported institutional oversight state.",
      severity: "error",
    });
  }

  if (!INSTITUTIONAL_OVERSIGHT_TYPES.includes(value.oversightType)) {
    issues.push({
      path: "$.oversightType",
      code: "invalid_type",
      message: "Unsupported institutional oversight type.",
      severity: "error",
    });
  }

  if (!value.preservesHistory) {
    issues.push({
      path: "$.preservesHistory",
      code: "history_not_preserved",
      message: "Institutional oversight must preserve historical records.",
      severity: "error",
    });
  }

  if (value.rewritesHistory) {
    issues.push({
      path: "$.rewritesHistory",
      code: "history_rewrite_attempt",
      message: "Institutional oversight cannot rewrite historical records.",
      severity: "error",
    });
  }

  const prohibitedEffects = [
    value.createdFinding,
    value.createdDetermination,
    value.createdRegistryPublication,
    value.createdExecutionArtifact,
    value.createdExecution,
  ];

  if (prohibitedEffects.some(Boolean)) {
    issues.push({
      path: "$",
      code: "unauthorized_effect",
      message:
        "Institutional oversight cannot directly create findings, determinations, publications, artifacts, or executions.",
      severity: "error",
    });
  }

  if (!/^sha256:[a-fA-F0-9]{64}$/.test(value.integrityHash)) {
    issues.push({
      path: "$.integrityHash",
      code: "invalid_hash",
      message: "integrityHash must be a SHA-256 hash.",
      severity: "error",
    });
  }

  if (definition) {
    if (value.reviewers.length < definition.minimumReviewerCount) {
      issues.push({
        path: "$.reviewers",
        code: "insufficient_reviewers",
        message: "Minimum reviewer count is not satisfied.",
        severity: "error",
      });
    }

    if (
      definition.independentReviewerRequired &&
      !value.reviewers.some((reviewer) => reviewer.independent)
    ) {
      issues.push({
        path: "$.reviewers",
        code: "independence_not_satisfied",
        message: "An independent reviewer is required.",
        severity: "error",
      });
    }

    if (
      definition.conflictCheckRequired &&
      value.reviewers.some((reviewer) => !reviewer.conflictChecked)
    ) {
      issues.push({
        path: "$.reviewers",
        code: "conflict_check_missing",
        message: "All reviewers require completed conflict checks.",
        severity: "error",
      });
    }

    if (
      definition.authorityCheckRequired &&
      value.reviewers.some((reviewer) => !reviewer.authorityChecked)
    ) {
      issues.push({
        path: "$.reviewers",
        code: "authority_check_missing",
        message: "All reviewers require completed authority checks.",
        severity: "error",
      });
    }
  }

  for (const evidence of value.evidence) {
    if (
      !evidence.attributable ||
      !evidence.permitted ||
      !evidence.integrityVerified ||
      !evidence.provenanceVerified
    ) {
      issues.push({
        path: `$.evidence.${evidence.evidenceId}`,
        code: "evidence_not_verified",
        message:
          "Oversight evidence must be attributable, permitted, integrity-verified, and provenance-verified.",
        severity: "error",
      });
    }
  }

  return {
    ok: !issues.some((issue) => issue.severity === "error"),
    issues,
  };
}

export function evaluateInstitutionalOversightOutcome(
  record: InstitutionalOversightRecord,
): InstitutionalOversightOutcome {
  const criticalFinding = record.findings.some(
    (finding) => finding.severity === "critical" && finding.supported,
  );

  const highFinding = record.findings.some(
    (finding) => finding.severity === "high" && finding.supported,
  );

  const openCriticalAction = record.correctiveActions.some(
    (action) =>
      ["open", "in_progress", "returned", "held", "escalated"].includes(
        action.state,
      ) &&
      record.recommendations.some(
        (recommendation) =>
          recommendation.recommendationId === action.recommendationId &&
          recommendation.priority === "critical",
      ),
  );

  const reformRequired = record.recommendations.some(
    (recommendation) =>
      recommendation.requiredAction === "institutional_reform",
  );

  const revalidationRequired = record.recommendations.some(
    (recommendation) =>
      recommendation.requiredAction === "revalidate",
  );

  const escalationRequired = record.recommendations.some(
    (recommendation) =>
      recommendation.requiredAction === "escalate",
  );

  if (reformRequired) return "institutional_reform_required";
  if (criticalFinding || escalationRequired) return "escalate";
  if (openCriticalAction) return "hold";
  if (revalidationRequired) return "revalidation_required";
  if (highFinding) return "corrective_action_required";

  if (
    record.recommendations.length > 0 ||
    record.findings.some(
      (finding) =>
        finding.supported &&
        ["moderate", "low"].includes(finding.severity),
    )
  ) {
    return "improvement_required";
  }

  if (
    record.findings.some(
      (finding) => finding.limitations.length > 0,
    )
  ) {
    return "satisfactory_with_conditions";
  }

  return "satisfactory";
}

export function completeInstitutionalOversight(
  record: InstitutionalOversightRecord,
  now: string,
): InstitutionalOversightRecord {
  if (
    ["completed", "withdrawn", "superseded", "archived"].includes(record.state)
  ) {
    throw new Error(
      `Institutional oversight ${record.oversightId} is immutable in state ${record.state}.`,
    );
  }

  const outcome = evaluateInstitutionalOversightOutcome(record);

  return Object.freeze({
    ...record,
    state:
      outcome === "hold"
        ? "held"
        : outcome === "escalate" ||
            outcome === "institutional_reform_required"
          ? "escalated"
          : outcome === "corrective_action_required" ||
              outcome === "revalidation_required" ||
              outcome === "improvement_required"
            ? "follow_up_required"
            : "completed",
    outcome,
    outcomeRationale:
      `Oversight completed with outcome ${outcome}. ` +
      TA14_INSTITUTIONAL_OVERSIGHT_BOUNDARY,
    completedAt:
      ["satisfactory", "satisfactory_with_conditions"].includes(outcome)
        ? now
        : undefined,
    heldAt: outcome === "hold" ? now : record.heldAt,
    escalatedAt:
      outcome === "escalate" ||
      outcome === "institutional_reform_required"
        ? now
        : record.escalatedAt,
    updatedAt: now,
  });
}

export const institutionalOversightDefinition:
InstitutionalOversightDefinition = Object.freeze({
  definitionId: "TA14-OVERSIGHT-DEF-INSTITUTIONAL-000001",
  title: "TA-14 Institutional Oversight Review",
  description:
    "Independent review of institutional governance health, assurance, stewardship, strategy, authority, Registry integrity, execution integrity, continuity, and institutional risk.",
  version: "1.0.0",
  active: true,
  supportedTypes: INSTITUTIONAL_OVERSIGHT_TYPES,
  allowedReviewerRoles: [
    "authorized_reviewer",
    "registry_reviewer",
    "academy_standards_reviewer",
    "institutional_administrator",
  ],
  minimumReviewerCount: 1,
  independentReviewerRequired: false,
  conflictCheckRequired: true,
  authorityCheckRequired: true,
  evidenceRequired: true,
  followUpRequiredForAdverseOutcome: true,
  preservesHistory: true,
  rewritesHistory: false,
  boundary: TA14_INSTITUTIONAL_OVERSIGHT_BOUNDARY,
  effectiveAt: "2026-08-04T00:00:00Z",
  contentHash:
    "sha256:0000000000000000000000000000000000000000000000000000000000000000",
});

export interface InstitutionalOversightRepository {
  getOversight(
    oversightId: string,
  ): Promise<InstitutionalOversightRecord | null>;

  saveOversight(
    record: InstitutionalOversightRecord,
  ): Promise<void>;

  listByState(
    state: InstitutionalOversightState,
  ): Promise<readonly InstitutionalOversightRecord[]>;

  listByType(
    oversightType: InstitutionalOversightType,
  ): Promise<readonly InstitutionalOversightRecord[]>;
}

export class InMemoryInstitutionalOversightRepository
implements InstitutionalOversightRepository {
  private readonly values =
    new Map<string, InstitutionalOversightRecord>();

  async getOversight(
    oversightId: string,
  ): Promise<InstitutionalOversightRecord | null> {
    return this.values.get(oversightId) ?? null;
  }

  async saveOversight(
    record: InstitutionalOversightRecord,
  ): Promise<void> {
    const validation = validateInstitutionalOversight(
      record,
      institutionalOversightDefinition,
    );

    if (!validation.ok) {
      throw new Error(
        validation.issues
          .map((issue) => `${issue.path}: ${issue.message}`)
          .join("; "),
      );
    }

    this.values.set(record.oversightId, Object.freeze(record));
  }

  async listByState(
    state: InstitutionalOversightState,
  ): Promise<readonly InstitutionalOversightRecord[]> {
    return Object.freeze(
      Array.from(this.values.values()).filter(
        (record) => record.state === state,
      ),
    );
  }

  async listByType(
    oversightType: InstitutionalOversightType,
  ): Promise<readonly InstitutionalOversightRecord[]> {
    return Object.freeze(
      Array.from(this.values.values()).filter(
        (record) => record.oversightType === oversightType,
      ),
    );
  }
}

export interface InstitutionalOversightEngineSelfCheck {
  readonly ok: boolean;
  readonly definitionValid: boolean;
  readonly preservesHistory: true;
  readonly rewritesHistory: false;
  readonly createdFinding: false;
  readonly createdDetermination: false;
  readonly createdRegistryPublication: false;
  readonly createdExecutionArtifact: false;
  readonly createdExecution: false;
  readonly issues: readonly string[];
}

export function runInstitutionalOversightEngineSelfCheck():
InstitutionalOversightEngineSelfCheck {
  const issues: string[] = [];

  if (!institutionalOversightDefinition.preservesHistory) {
    issues.push("Canonical oversight definition does not preserve history.");
  }

  if (institutionalOversightDefinition.rewritesHistory) {
    issues.push("Canonical oversight definition permits history rewriting.");
  }

  if (
    institutionalOversightDefinition.minimumReviewerCount < 1
  ) {
    issues.push("Minimum reviewer count must be at least one.");
  }

  return {
    ok: issues.length === 0,
    definitionValid: issues.length === 0,
    preservesHistory: true,
    rewritesHistory: false,
    createdFinding: false,
    createdDetermination: false,
    createdRegistryPublication: false,
    createdExecutionArtifact: false,
    createdExecution: false,
    issues,
  };
}

const institutionalOversightContracts = {
  engineId: TA14_INSTITUTIONAL_OVERSIGHT_ENGINE_ID,
  engineVersion: TA14_INSTITUTIONAL_OVERSIGHT_ENGINE_VERSION,
  boundary: TA14_INSTITUTIONAL_OVERSIGHT_BOUNDARY,
  states: INSTITUTIONAL_OVERSIGHT_STATES,
  types: INSTITUTIONAL_OVERSIGHT_TYPES,
  outcomes: INSTITUTIONAL_OVERSIGHT_OUTCOMES,
  severities: INSTITUTIONAL_OVERSIGHT_SEVERITIES,
  validateInstitutionalOversight,
  evaluateInstitutionalOversightOutcome,
  completeInstitutionalOversight,
  institutionalOversightDefinition,
  InMemoryInstitutionalOversightRepository,
  runInstitutionalOversightEngineSelfCheck,
};

export default institutionalOversightContracts;
