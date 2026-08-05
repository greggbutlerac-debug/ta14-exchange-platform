/**
 * TA-14 Authority Governance Institution
 * TA-14 Academy Embedded Learning Engine
 *
 * AIE-001 — Institutional Engine
 *
 * Create:
 *   apps/web/lib/academy/institutional-engine.ts
 *
 * Purpose:
 *   Assemble the Academy contract layer into one canonical institutional
 *   lifecycle without collapsing the boundaries between learning, authority,
 *   governed work, findings, determinations, Registry governance, execution,
 *   outcomes, continuity, and future governance cycles.
 *
 * This module:
 *   - provides one stable import for application code;
 *   - exposes every contract module under a namespaced key;
 *   - defines the canonical stage registry;
 *   - validates lifecycle order and boundary declarations;
 *   - resolves stages, transitions, and user-visible status;
 *   - provides Mission Control summaries and action recommendations;
 *   - preserves the rule that later stages never rewrite earlier records.
 *
 * This module does not:
 *   - create credentials;
 *   - grant authority;
 *   - create assignments;
 *   - create findings;
 *   - make determinations;
 *   - publish Registry records;
 *   - create execution artifacts;
 *   - execute actions;
 *   - rewrite institutional history.
 */

/* ========================================================================== *
 * Contract module imports
 * ========================================================================== */

import * as LessonContracts from "./lesson-contracts";
import * as ContextResolver from "./context-resolver";
import * as AcademyEvents from "./academy-events";
import * as SimulationContracts from "./simulation-contracts";
import * as AssessmentContracts from "./assessment-contracts";
import * as CredentialContracts from "./credential-contracts";
import * as AuthorityReviewContracts from "./authority-review-contracts";
import * as AssignmentContracts from "./assignment-contracts";
import * as GovernedWorkContracts from "./governed-work-contracts";
import * as FindingContracts from "./finding-contracts";
import * as DeterminationContracts from "./determination-contracts";
import * as RegistryReviewContracts from "./registry-review-contracts";
import * as RegistryPublicationContracts from "./registry-publication-contracts";
import * as ExecutionArtifactContracts from "./execution-artifact-contracts";
import * as ExecutionContracts from "./execution-contracts";
import * as OutcomeContracts from "./outcome-contracts";
import * as ContinuityContracts from "./continuity-contracts";
import * as RevalidationContracts from "./revalidation-contracts";
import * as GovernanceCycleContracts from "./governance-cycle-contracts";
import * as InstitutionalEvolutionContracts from "./institutional-evolution-contracts";
import * as InstitutionalMemoryContracts from "./institutional-memory-contracts";
import * as InstitutionalKnowledgeContracts from "./institutional-knowledge-contracts";
import * as InstitutionalIntelligenceContracts from "./institutional-intelligence-contracts";
import * as InstitutionalStrategyContracts from "./institutional-strategy-contracts";
import * as InstitutionalStewardshipContracts from "./institutional-stewardship-contracts";
import * as InstitutionalAssuranceContracts from "./institutional-assurance-contracts";
import * as InstitutionalOversightContracts from "./institutional-oversight-contracts";
import * as InstitutionalAccountabilityContracts from "./institutional-accountability-contracts";
import * as InstitutionalTransparencyContracts from "./institutional-transparency-contracts";
import * as InstitutionalTrustContracts from "./institutional-trust-contracts";
import * as InstitutionalLegitimacyContracts from "./institutional-legitimacy-contracts";
import * as InstitutionalContinuityGovernanceContracts from "./institutional-continuity-governance-contracts";
import * as InstitutionalResilienceContracts from "./institutional-resilience-contracts";
import * as InstitutionalSustainabilityContracts from "./institutional-sustainability-contracts";

/* ========================================================================== *
 * Engine identity
 * ========================================================================== */

export const TA14_INSTITUTIONAL_ENGINE_ID =
  "TA14-AIE-INSTITUTIONAL-ENGINE-000001" as const;

export const TA14_INSTITUTIONAL_ENGINE_VERSION = "1.0.0" as const;

export const TA14_INSTITUTIONAL_ENGINE_BOUNDARY =
  "The institutional engine coordinates contract modules and lifecycle visibility. It does not create institutional effects that belong to the underlying governed stages." as const;

export const TA14_INSTITUTIONAL_ENGINE_PRINCIPLE =
  "No admissible evidence. No admissible execution." as const;

export const TA14_CANONICAL_CHAIN = [
  "reality",
  "record",
  "context",
  "relationship",
  "lesson",
  "simulation",
  "assessment",
  "credential",
  "authority_review",
  "authority",
  "assignment",
  "governed_work",
  "finding",
  "determination",
  "registry_review",
  "registry_publication",
  "execution_artifact",
  "execution",
  "outcome",
  "continuity",
  "revalidation",
  "governance_cycle",
  "institutional_evolution",
  "institutional_memory",
  "institutional_knowledge",
  "institutional_intelligence",
  "institutional_strategy",
  "institutional_stewardship",
  "institutional_assurance",
  "institutional_oversight",
  "institutional_accountability",
  "institutional_transparency",
  "institutional_trust",
  "institutional_legitimacy",
  "institutional_continuity_governance",
  "institutional_resilience",
  "institutional_sustainability",
] as const;

export type InstitutionalStageId =
  (typeof TA14_CANONICAL_CHAIN)[number];

/* ========================================================================== *
 * Stage classifications
 * ========================================================================== */

export const INSTITUTIONAL_STAGE_CLASSES = [
  "reality",
  "record",
  "learning",
  "eligibility",
  "authority",
  "work",
  "judgment",
  "registry",
  "execution",
  "outcome",
  "continuity",
  "future_governance",
  "institutional_capacity",
] as const;

export type InstitutionalStageClass =
  (typeof INSTITUTIONAL_STAGE_CLASSES)[number];

export const INSTITUTIONAL_STAGE_EFFECTS = [
  "none",
  "learning_record",
  "eligibility_evidence",
  "credential",
  "authority_review",
  "authority_grant",
  "assignment",
  "governed_work",
  "finding",
  "determination",
  "registry_review",
  "registry_publication",
  "execution_artifact",
  "execution",
  "outcome",
  "continuity",
  "revalidation",
  "future_cycle",
  "institutional_record",
] as const;

export type InstitutionalStageEffect =
  (typeof INSTITUTIONAL_STAGE_EFFECTS)[number];

export const INSTITUTIONAL_STAGE_MATURITY = [
  "substantive",
  "boundary",
  "conceptual",
] as const;

export type InstitutionalStageMaturity =
  (typeof INSTITUTIONAL_STAGE_MATURITY)[number];

export const INSTITUTIONAL_ACTION_TYPES = [
  "open",
  "inspect",
  "continue",
  "correct",
  "submit",
  "review",
  "approve",
  "hold",
  "deny",
  "escalate",
  "publish",
  "seal",
  "execute",
  "verify",
  "revalidate",
  "supersede",
  "withdraw",
  "archive",
  "none",
] as const;

export type InstitutionalActionType =
  (typeof INSTITUTIONAL_ACTION_TYPES)[number];

/* ========================================================================== *
 * Stage contracts
 * ========================================================================== */

export interface InstitutionalStageDefinition {
  readonly id: InstitutionalStageId;
  readonly order: number;
  readonly title: string;
  readonly shortTitle: string;
  readonly description: string;
  readonly stageClass: InstitutionalStageClass;
  readonly effect: InstitutionalStageEffect;
  readonly maturity: InstitutionalStageMaturity;

  readonly contractFile?: string;
  readonly contractCode?: string;
  readonly moduleKey?: keyof InstitutionalContractModules;

  readonly priorStageIds: readonly InstitutionalStageId[];
  readonly nextStageIds: readonly InstitutionalStageId[];

  readonly createsRecord: boolean;
  readonly recordType?: string;
  readonly createsAuthority: boolean;
  readonly createsDetermination: boolean;
  readonly createsRegistryPublication: boolean;
  readonly createsExecutionArtifact: boolean;
  readonly createsExecution: boolean;

  readonly preservesPriorRecords: true;
  readonly rewritesPriorRecords: false;

  readonly userVisible: boolean;
  readonly missionControlVisible: boolean;
  readonly academyVisible: boolean;
  readonly registryVisible: boolean;

  readonly completionLabel: string;
  readonly incompleteLabel: string;
  readonly blockedLabel: string;

  readonly entryRequirements: readonly string[];
  readonly completionRequirements: readonly string[];
  readonly prohibitedEffects: readonly string[];
  readonly boundaryStatement: string;
}

export interface InstitutionalContractModules {
  readonly lessonContracts: typeof LessonContracts;
  readonly contextResolver: typeof ContextResolver;
  readonly academyEvents: typeof AcademyEvents;
  readonly simulationContracts: typeof SimulationContracts;
  readonly assessmentContracts: typeof AssessmentContracts;
  readonly credentialContracts: typeof CredentialContracts;
  readonly authorityReviewContracts: typeof AuthorityReviewContracts;
  readonly assignmentContracts: typeof AssignmentContracts;
  readonly governedWorkContracts: typeof GovernedWorkContracts;
  readonly findingContracts: typeof FindingContracts;
  readonly determinationContracts: typeof DeterminationContracts;
  readonly registryReviewContracts: typeof RegistryReviewContracts;
  readonly registryPublicationContracts: typeof RegistryPublicationContracts;
  readonly executionArtifactContracts: typeof ExecutionArtifactContracts;
  readonly executionContracts: typeof ExecutionContracts;
  readonly outcomeContracts: typeof OutcomeContracts;
  readonly continuityContracts: typeof ContinuityContracts;
  readonly revalidationContracts: typeof RevalidationContracts;
  readonly governanceCycleContracts: typeof GovernanceCycleContracts;
  readonly institutionalEvolutionContracts: typeof InstitutionalEvolutionContracts;
  readonly institutionalMemoryContracts: typeof InstitutionalMemoryContracts;
  readonly institutionalKnowledgeContracts: typeof InstitutionalKnowledgeContracts;
  readonly institutionalIntelligenceContracts: typeof InstitutionalIntelligenceContracts;
  readonly institutionalStrategyContracts: typeof InstitutionalStrategyContracts;
  readonly institutionalStewardshipContracts: typeof InstitutionalStewardshipContracts;
  readonly institutionalAssuranceContracts: typeof InstitutionalAssuranceContracts;
  readonly institutionalOversightContracts: typeof InstitutionalOversightContracts;
  readonly institutionalAccountabilityContracts: typeof InstitutionalAccountabilityContracts;
  readonly institutionalTransparencyContracts: typeof InstitutionalTransparencyContracts;
  readonly institutionalTrustContracts: typeof InstitutionalTrustContracts;
  readonly institutionalLegitimacyContracts: typeof InstitutionalLegitimacyContracts;
  readonly institutionalContinuityGovernanceContracts:
    typeof InstitutionalContinuityGovernanceContracts;
  readonly institutionalResilienceContracts: typeof InstitutionalResilienceContracts;
  readonly institutionalSustainabilityContracts:
    typeof InstitutionalSustainabilityContracts;
}

export const institutionalContractModules: InstitutionalContractModules =
  Object.freeze({
    lessonContracts: LessonContracts,
    contextResolver: ContextResolver,
    academyEvents: AcademyEvents,
    simulationContracts: SimulationContracts,
    assessmentContracts: AssessmentContracts,
    credentialContracts: CredentialContracts,
    authorityReviewContracts: AuthorityReviewContracts,
    assignmentContracts: AssignmentContracts,
    governedWorkContracts: GovernedWorkContracts,
    findingContracts: FindingContracts,
    determinationContracts: DeterminationContracts,
    registryReviewContracts: RegistryReviewContracts,
    registryPublicationContracts: RegistryPublicationContracts,
    executionArtifactContracts: ExecutionArtifactContracts,
    executionContracts: ExecutionContracts,
    outcomeContracts: OutcomeContracts,
    continuityContracts: ContinuityContracts,
    revalidationContracts: RevalidationContracts,
    governanceCycleContracts: GovernanceCycleContracts,
    institutionalEvolutionContracts: InstitutionalEvolutionContracts,
    institutionalMemoryContracts: InstitutionalMemoryContracts,
    institutionalKnowledgeContracts: InstitutionalKnowledgeContracts,
    institutionalIntelligenceContracts: InstitutionalIntelligenceContracts,
    institutionalStrategyContracts: InstitutionalStrategyContracts,
    institutionalStewardshipContracts: InstitutionalStewardshipContracts,
    institutionalAssuranceContracts: InstitutionalAssuranceContracts,
    institutionalOversightContracts: InstitutionalOversightContracts,
    institutionalAccountabilityContracts: InstitutionalAccountabilityContracts,
    institutionalTransparencyContracts: InstitutionalTransparencyContracts,
    institutionalTrustContracts: InstitutionalTrustContracts,
    institutionalLegitimacyContracts: InstitutionalLegitimacyContracts,
    institutionalContinuityGovernanceContracts:
      InstitutionalContinuityGovernanceContracts,
    institutionalResilienceContracts: InstitutionalResilienceContracts,
    institutionalSustainabilityContracts:
      InstitutionalSustainabilityContracts,
  });

/* ========================================================================== *
 * Canonical stage registry
 * ========================================================================== */

function stage(
  value: InstitutionalStageDefinition,
): InstitutionalStageDefinition {
  return Object.freeze({
    ...value,
    priorStageIds: Object.freeze([...value.priorStageIds]),
    nextStageIds: Object.freeze([...value.nextStageIds]),
    entryRequirements: Object.freeze([...value.entryRequirements]),
    completionRequirements: Object.freeze([...value.completionRequirements]),
    prohibitedEffects: Object.freeze([...value.prohibitedEffects]),
  });
}

export const INSTITUTIONAL_STAGE_REGISTRY:
readonly InstitutionalStageDefinition[] = Object.freeze([
  stage({
    id: "reality",
    order: 1,
    title: "Reality",
    shortTitle: "Reality",
    description:
      "The external condition, event, environment, system state, or human circumstance that governance is intended to observe.",
    stageClass: "reality",
    effect: "none",
    maturity: "substantive",
    priorStageIds: [],
    nextStageIds: ["record"],
    createsRecord: false,
    createsAuthority: false,
    createsDetermination: false,
    createsRegistryPublication: false,
    createsExecutionArtifact: false,
    createsExecution: false,
    preservesPriorRecords: true,
    rewritesPriorRecords: false,
    userVisible: true,
    missionControlVisible: true,
    academyVisible: true,
    registryVisible: false,
    completionLabel: "Reality observed",
    incompleteLabel: "Reality not yet observed",
    blockedLabel: "Observation blocked",
    entryRequirements: [],
    completionRequirements: [
      "A bounded subject or condition has been identified.",
      "Observation is attributable to a permitted source.",
    ],
    prohibitedEffects: [
      "Reality alone cannot become an institutional determination.",
      "Reality alone cannot authorize execution.",
    ],
    boundaryStatement:
      "Reality is not yet a governed record.",
  }),

  stage({
    id: "record",
    order: 2,
    title: "Governed Record",
    shortTitle: "Record",
    description:
      "An attributable, versioned, integrity-protected representation of observed reality.",
    stageClass: "record",
    effect: "institutional_record",
    maturity: "substantive",
    priorStageIds: ["reality"],
    nextStageIds: ["context"],
    createsRecord: true,
    recordType: "governed_record",
    createsAuthority: false,
    createsDetermination: false,
    createsRegistryPublication: false,
    createsExecutionArtifact: false,
    createsExecution: false,
    preservesPriorRecords: true,
    rewritesPriorRecords: false,
    userVisible: true,
    missionControlVisible: true,
    academyVisible: true,
    registryVisible: true,
    completionLabel: "Record preserved",
    incompleteLabel: "Record incomplete",
    blockedLabel: "Record inadmissible",
    entryRequirements: [
      "Observed reality exists.",
      "The record source is attributable.",
    ],
    completionRequirements: [
      "Identity, version, timestamp, source, and integrity are preserved.",
      "Confidentiality and permission boundaries are recorded.",
    ],
    prohibitedEffects: [
      "A record cannot create authority.",
      "A record cannot make a determination.",
      "A record cannot authorize execution.",
    ],
    boundaryStatement:
      "Record is not finding, determination, publication, or execution.",
  }),

  stage({
    id: "context",
    order: 3,
    title: "Institutional Context",
    shortTitle: "Context",
    description:
      "The identity, role, authority, organization, jurisdiction, route, and record context needed to interpret the governed record.",
    stageClass: "record",
    effect: "institutional_record",
    maturity: "substantive",
    contractFile: "context-resolver.ts",
    contractCode: "ACD-002",
    moduleKey: "contextResolver",
    priorStageIds: ["record"],
    nextStageIds: ["relationship"],
    createsRecord: true,
    recordType: "context",
    createsAuthority: false,
    createsDetermination: false,
    createsRegistryPublication: false,
    createsExecutionArtifact: false,
    createsExecution: false,
    preservesPriorRecords: true,
    rewritesPriorRecords: false,
    userVisible: true,
    missionControlVisible: true,
    academyVisible: true,
    registryVisible: false,
    completionLabel: "Context resolved",
    incompleteLabel: "Context unresolved",
    blockedLabel: "Context conflict",
    entryRequirements: ["A governed record exists."],
    completionRequirements: [
      "Relevant institutional identity and route context are resolved.",
      "Unknown or conflicting context is preserved.",
    ],
    prohibitedEffects: [
      "Context resolution cannot grant authority.",
      "Context resolution cannot make a determination.",
    ],
    boundaryStatement:
      "Resolved context informs governance but does not substitute for authority.",
  }),

  stage({
    id: "relationship",
    order: 4,
    title: "Institutional Relationships",
    shortTitle: "Relationships",
    description:
      "The explicit links among records, entities, routes, evidence, lessons, authority, and institutional work.",
    stageClass: "record",
    effect: "institutional_record",
    maturity: "substantive",
    priorStageIds: ["context"],
    nextStageIds: ["lesson"],
    createsRecord: true,
    recordType: "relationship",
    createsAuthority: false,
    createsDetermination: false,
    createsRegistryPublication: false,
    createsExecutionArtifact: false,
    createsExecution: false,
    preservesPriorRecords: true,
    rewritesPriorRecords: false,
    userVisible: false,
    missionControlVisible: false,
    academyVisible: true,
    registryVisible: false,
    completionLabel: "Relationships resolved",
    incompleteLabel: "Relationships incomplete",
    blockedLabel: "Relationship conflict",
    entryRequirements: ["Institutional context has been resolved."],
    completionRequirements: [
      "Relevant upstream and downstream records are linked.",
      "Relationship type and direction are explicit.",
    ],
    prohibitedEffects: [
      "A relationship cannot create a finding or determination.",
    ],
    boundaryStatement:
      "Relationships connect records without collapsing their meanings.",
  }),

  stage({
    id: "lesson",
    order: 5,
    title: "Embedded Lesson",
    shortTitle: "Lesson",
    description:
      "Contextual institutional learning attached to the real work, record, decision, or route a participant is using.",
    stageClass: "learning",
    effect: "learning_record",
    maturity: "substantive",
    contractFile: "lesson-contracts.ts",
    contractCode: "ACD-001",
    moduleKey: "lessonContracts",
    priorStageIds: ["relationship"],
    nextStageIds: ["simulation"],
    createsRecord: true,
    recordType: "academy_learning",
    createsAuthority: false,
    createsDetermination: false,
    createsRegistryPublication: false,
    createsExecutionArtifact: false,
    createsExecution: false,
    preservesPriorRecords: true,
    rewritesPriorRecords: false,
    userVisible: true,
    missionControlVisible: true,
    academyVisible: true,
    registryVisible: false,
    completionLabel: "Lesson completed",
    incompleteLabel: "Lesson available",
    blockedLabel: "Lesson unavailable",
    entryRequirements: [
      "A participant and institutional context are known.",
    ],
    completionRequirements: [
      "Required lesson content is presented.",
      "Completion is recorded through Academy events.",
    ],
    prohibitedEffects: [
      "Lesson completion does not create competence.",
      "Lesson completion does not create a credential.",
      "Lesson completion does not create authority.",
    ],
    boundaryStatement:
      "Learning informs future eligibility but never creates institutional authority.",
  }),

  stage({
    id: "simulation",
    order: 6,
    title: "Governance Simulation",
    shortTitle: "Simulation",
    description:
      "A non-production environment where a participant practices routes, evidence gates, determinations, and continuity without institutional effect.",
    stageClass: "learning",
    effect: "learning_record",
    maturity: "substantive",
    contractFile: "simulation-contracts.ts",
    contractCode: "ACD-004",
    moduleKey: "simulationContracts",
    priorStageIds: ["lesson"],
    nextStageIds: ["assessment"],
    createsRecord: true,
    recordType: "simulation",
    createsAuthority: false,
    createsDetermination: false,
    createsRegistryPublication: false,
    createsExecutionArtifact: false,
    createsExecution: false,
    preservesPriorRecords: true,
    rewritesPriorRecords: false,
    userVisible: true,
    missionControlVisible: true,
    academyVisible: true,
    registryVisible: false,
    completionLabel: "Simulation completed",
    incompleteLabel: "Simulation incomplete",
    blockedLabel: "Simulation held",
    entryRequirements: [
      "Required lessons are complete.",
      "Simulation scenario is available.",
    ],
    completionRequirements: [
      "Required gates and branches have been exercised.",
      "Simulation outcomes and failures are preserved.",
    ],
    prohibitedEffects: [
      "Simulation cannot create production effects.",
      "Simulation cannot create real authority.",
      "Simulation cannot publish Registry records.",
    ],
    boundaryStatement:
      "Simulation is practice, not production governance.",
  }),

  stage({
    id: "assessment",
    order: 7,
    title: "Assessment",
    shortTitle: "Assessment",
    description:
      "A bounded evaluation of demonstrated knowledge or capability that produces eligibility evidence only.",
    stageClass: "eligibility",
    effect: "eligibility_evidence",
    maturity: "substantive",
    contractFile: "assessment-contracts.ts",
    contractCode: "ACD-005",
    moduleKey: "assessmentContracts",
    priorStageIds: ["simulation"],
    nextStageIds: ["credential"],
    createsRecord: true,
    recordType: "assessment",
    createsAuthority: false,
    createsDetermination: false,
    createsRegistryPublication: false,
    createsExecutionArtifact: false,
    createsExecution: false,
    preservesPriorRecords: true,
    rewritesPriorRecords: false,
    userVisible: true,
    missionControlVisible: true,
    academyVisible: true,
    registryVisible: false,
    completionLabel: "Assessment completed",
    incompleteLabel: "Assessment required",
    blockedLabel: "Assessment held",
    entryRequirements: [
      "Required learning and simulations are complete.",
    ],
    completionRequirements: [
      "Assessment evidence is attributable and preserved.",
      "Result and limitations are recorded.",
    ],
    prohibitedEffects: [
      "Assessment does not grant a credential automatically.",
      "Assessment does not grant authority.",
      "Assessment does not assign work.",
    ],
    boundaryStatement:
      "Assessment creates eligibility evidence, not authority.",
  }),

  stage({
    id: "credential",
    order: 8,
    title: "Credential",
    shortTitle: "Credential",
    description:
      "An institutional recognition of completed learning and eligibility requirements that remains separate from authority.",
    stageClass: "eligibility",
    effect: "credential",
    maturity: "substantive",
    contractFile: "credential-contracts.ts",
    contractCode: "ACD-006",
    moduleKey: "credentialContracts",
    priorStageIds: ["assessment"],
    nextStageIds: ["authority_review"],
    createsRecord: true,
    recordType: "credential",
    createsAuthority: false,
    createsDetermination: false,
    createsRegistryPublication: false,
    createsExecutionArtifact: false,
    createsExecution: false,
    preservesPriorRecords: true,
    rewritesPriorRecords: false,
    userVisible: true,
    missionControlVisible: true,
    academyVisible: true,
    registryVisible: true,
    completionLabel: "Credential issued",
    incompleteLabel: "Credential not issued",
    blockedLabel: "Credential held",
    entryRequirements: [
      "Credential eligibility requirements are satisfied.",
      "Required assessment evidence is current.",
    ],
    completionRequirements: [
      "Credential identity, scope, version, and expiry are preserved.",
    ],
    prohibitedEffects: [
      "Credential does not create authority.",
      "Credential does not create assignment.",
      "Credential does not create a determination.",
    ],
    boundaryStatement:
      "Credential is evidence of qualification, not institutional authority.",
  }),

  stage({
    id: "authority_review",
    order: 9,
    title: "Authority Review",
    shortTitle: "Authority Review",
    description:
      "A governed evaluation of whether a credentialed subject may receive bounded institutional authority.",
    stageClass: "authority",
    effect: "authority_review",
    maturity: "substantive",
    contractFile: "authority-review-contracts.ts",
    contractCode: "ACD-007",
    moduleKey: "authorityReviewContracts",
    priorStageIds: ["credential"],
    nextStageIds: ["authority"],
    createsRecord: true,
    recordType: "authority_review",
    createsAuthority: false,
    createsDetermination: false,
    createsRegistryPublication: false,
    createsExecutionArtifact: false,
    createsExecution: false,
    preservesPriorRecords: true,
    rewritesPriorRecords: false,
    userVisible: true,
    missionControlVisible: true,
    academyVisible: true,
    registryVisible: true,
    completionLabel: "Authority review completed",
    incompleteLabel: "Authority review required",
    blockedLabel: "Authority review held",
    entryRequirements: [
      "Credential is current.",
      "Authority purpose and scope are declared.",
    ],
    completionRequirements: [
      "Role, scope, jurisdiction, organization, restrictions, and duration are reviewed.",
      "Conflicts and limitations are preserved.",
    ],
    prohibitedEffects: [
      "Authority review does not itself assign work.",
      "Authority review does not make a route determination.",
    ],
    boundaryStatement:
      "Authority review evaluates authority; assignment remains separate.",
  }),

  stage({
    id: "authority",
    order: 10,
    title: "Authority Grant",
    shortTitle: "Authority",
    description:
      "A bounded, attributable institutional grant that permits specific actions or decisions under declared constraints.",
    stageClass: "authority",
    effect: "authority_grant",
    maturity: "substantive",
    contractFile: "authority-review-contracts.ts",
    contractCode: "ACD-007",
    moduleKey: "authorityReviewContracts",
    priorStageIds: ["authority_review"],
    nextStageIds: ["assignment"],
    createsRecord: true,
    recordType: "authority_grant",
    createsAuthority: true,
    createsDetermination: false,
    createsRegistryPublication: false,
    createsExecutionArtifact: false,
    createsExecution: false,
    preservesPriorRecords: true,
    rewritesPriorRecords: false,
    userVisible: true,
    missionControlVisible: true,
    academyVisible: true,
    registryVisible: true,
    completionLabel: "Authority active",
    incompleteLabel: "Authority unavailable",
    blockedLabel: "Authority held or expired",
    entryRequirements: [
      "Authority review is complete.",
      "Approving authority is valid.",
    ],
    completionRequirements: [
      "Authority scope, actions, decisions, restrictions, duration, and revocation controls are preserved.",
    ],
    prohibitedEffects: [
      "Authority does not create an assignment.",
      "Authority does not create a finding.",
      "Authority does not create a determination.",
    ],
    boundaryStatement:
      "Authority permits bounded institutional action but does not assign it.",
  }),

  stage({
    id: "assignment",
    order: 11,
    title: "Assignment",
    shortTitle: "Assignment",
    description:
      "A bounded allocation of authorized institutional work to a qualified subject.",
    stageClass: "work",
    effect: "assignment",
    maturity: "substantive",
    contractFile: "assignment-contracts.ts",
    contractCode: "ACD-008",
    moduleKey: "assignmentContracts",
    priorStageIds: ["authority"],
    nextStageIds: ["governed_work"],
    createsRecord: true,
    recordType: "assignment",
    createsAuthority: false,
    createsDetermination: false,
    createsRegistryPublication: false,
    createsExecutionArtifact: false,
    createsExecution: false,
    preservesPriorRecords: true,
    rewritesPriorRecords: false,
    userVisible: true,
    missionControlVisible: true,
    academyVisible: true,
    registryVisible: true,
    completionLabel: "Assignment accepted",
    incompleteLabel: "Assignment pending",
    blockedLabel: "Assignment blocked",
    entryRequirements: [
      "Current authority covers the assignment.",
      "Target record and work scope are declared.",
    ],
    completionRequirements: [
      "Assignee, scope, authority, deadlines, supervision, and completion conditions are preserved.",
    ],
    prohibitedEffects: [
      "Assignment does not create a finding.",
      "Assignment does not make a determination.",
    ],
    boundaryStatement:
      "Authority is not assignment, and assignment is not judgment.",
  }),

  stage({
    id: "governed_work",
    order: 12,
    title: "Governed Work",
    shortTitle: "Governed Work",
    description:
      "The controlled workspace where authorized participants inspect evidence, resolve issues, preserve boundaries, and prepare attributable work.",
    stageClass: "work",
    effect: "governed_work",
    maturity: "substantive",
    contractFile: "governed-work-contracts.ts",
    contractCode: "ACD-009",
    moduleKey: "governedWorkContracts",
    priorStageIds: ["assignment"],
    nextStageIds: ["finding"],
    createsRecord: true,
    recordType: "governed_work",
    createsAuthority: false,
    createsDetermination: false,
    createsRegistryPublication: false,
    createsExecutionArtifact: false,
    createsExecution: false,
    preservesPriorRecords: true,
    rewritesPriorRecords: false,
    userVisible: true,
    missionControlVisible: true,
    academyVisible: true,
    registryVisible: true,
    completionLabel: "Work ready for finding",
    incompleteLabel: "Work in progress",
    blockedLabel: "Work held",
    entryRequirements: [
      "Assignment is current and accepted.",
      "Authority, scope, target version, and confidentiality controls are valid.",
    ],
    completionRequirements: [
      "Evidence inspection is complete.",
      "Blocking issues are resolved or preserved.",
      "Submission package and readiness evaluation are complete.",
    ],
    prohibitedEffects: [
      "Governed work does not create a finding automatically.",
      "Governed work does not create a determination.",
      "Governed work does not create Registry effects.",
      "Governed work does not execute.",
    ],
    boundaryStatement:
      "Governed Work is not Finding; Finding is not Determination.",
  }),

  stage({
    id: "finding",
    order: 13,
    title: "Institutional Finding",
    shortTitle: "Finding",
    description:
      "An attributable statement of what completed governed work supports, does not support, or cannot resolve within a declared boundary.",
    stageClass: "judgment",
    effect: "finding",
    maturity: "substantive",
    contractFile: "finding-contracts.ts",
    contractCode: "ACD-010",
    moduleKey: "findingContracts",
    priorStageIds: ["governed_work"],
    nextStageIds: ["determination"],
    createsRecord: true,
    recordType: "finding",
    createsAuthority: false,
    createsDetermination: false,
    createsRegistryPublication: false,
    createsExecutionArtifact: false,
    createsExecution: false,
    preservesPriorRecords: true,
    rewritesPriorRecords: false,
    userVisible: true,
    missionControlVisible: true,
    academyVisible: true,
    registryVisible: true,
    completionLabel: "Finding accepted",
    incompleteLabel: "Finding under review",
    blockedLabel: "Finding held or escalated",
    entryRequirements: [
      "Governed work is ready for finding.",
      "Evidence mappings and scope are preserved.",
    ],
    completionRequirements: [
      "Finding type, statement, rationale, confidence, limitations, concurrence, and dissent are preserved.",
    ],
    prohibitedEffects: [
      "Finding does not create determination.",
      "Finding does not publish itself.",
      "Finding does not create an artifact.",
      "Finding does not execute.",
    ],
    boundaryStatement:
      "Finding is not Determination.",
  }),

  stage({
    id: "determination",
    order: 14,
    title: "Institutional Determination",
    shortTitle: "Determination",
    description:
      "A formally committed ALLOW, HOLD, DENY, or ESCALATE decision supported by findings, evidence, authority, scope, review, and signatures.",
    stageClass: "judgment",
    effect: "determination",
    maturity: "substantive",
    contractFile: "determination-contracts.ts",
    contractCode: "ACD-011",
    moduleKey: "determinationContracts",
    priorStageIds: ["finding"],
    nextStageIds: ["registry_review"],
    createsRecord: true,
    recordType: "determination",
    createsAuthority: false,
    createsDetermination: true,
    createsRegistryPublication: false,
    createsExecutionArtifact: false,
    createsExecution: false,
    preservesPriorRecords: true,
    rewritesPriorRecords: false,
    userVisible: true,
    missionControlVisible: true,
    academyVisible: true,
    registryVisible: true,
    completionLabel: "Determination committed",
    incompleteLabel: "Determination pending",
    blockedLabel: "Determination held or escalated",
    entryRequirements: [
      "Required findings are accepted and current.",
      "Authority, scope, evidence, continuity, concurrence, and signatures are sufficient.",
    ],
    completionRequirements: [
      "Determination type, rationale, conditions, limitations, signatures, integrity hash, and commit hash are preserved.",
    ],
    prohibitedEffects: [
      "Determination does not create Registry review automatically.",
      "Determination does not publish itself.",
      "Determination does not create an execution artifact.",
      "Determination does not execute.",
    ],
    boundaryStatement:
      "Determination is not Registry Review, publication, artifact, or execution.",
  }),

  stage({
    id: "registry_review",
    order: 15,
    title: "Registry Review",
    shortTitle: "Registry Review",
    description:
      "A governed review of whether a committed determination satisfies the requirements for registration.",
    stageClass: "registry",
    effect: "registry_review",
    maturity: "boundary",
    contractFile: "registry-review-contracts.ts",
    contractCode: "ACD-012",
    moduleKey: "registryReviewContracts",
    priorStageIds: ["determination"],
    nextStageIds: ["registry_publication"],
    createsRecord: true,
    recordType: "registry_review",
    createsAuthority: false,
    createsDetermination: false,
    createsRegistryPublication: false,
    createsExecutionArtifact: false,
    createsExecution: false,
    preservesPriorRecords: true,
    rewritesPriorRecords: false,
    userVisible: true,
    missionControlVisible: true,
    academyVisible: true,
    registryVisible: true,
    completionLabel: "Accepted for registration",
    incompleteLabel: "Registry review pending",
    blockedLabel: "Registry review held or returned",
    entryRequirements: [
      "A committed determination exists.",
      "Reviewer authority is current.",
    ],
    completionRequirements: [
      "Review outcome and rationale are preserved.",
    ],
    prohibitedEffects: [
      "Registry review does not publish.",
      "Registry review does not create an artifact.",
      "Registry review does not execute.",
    ],
    boundaryStatement:
      "Registry Review is not Registry Publication.",
  }),

  stage({
    id: "registry_publication",
    order: 16,
    title: "Registry Publication",
    shortTitle: "Publication",
    description:
      "The controlled publication of a Registry-approved institutional record with stable identity and integrity.",
    stageClass: "registry",
    effect: "registry_publication",
    maturity: "boundary",
    contractFile: "registry-publication-contracts.ts",
    contractCode: "ACD-013",
    moduleKey: "registryPublicationContracts",
    priorStageIds: ["registry_review"],
    nextStageIds: ["execution_artifact"],
    createsRecord: true,
    recordType: "registry_publication",
    createsAuthority: false,
    createsDetermination: false,
    createsRegistryPublication: true,
    createsExecutionArtifact: false,
    createsExecution: false,
    preservesPriorRecords: true,
    rewritesPriorRecords: false,
    userVisible: true,
    missionControlVisible: true,
    academyVisible: true,
    registryVisible: true,
    completionLabel: "Registry record published",
    incompleteLabel: "Publication pending",
    blockedLabel: "Publication blocked",
    entryRequirements: [
      "Registry review accepted the record for registration.",
    ],
    completionRequirements: [
      "Registry identifier, projection, publication hash, and publication time are preserved.",
    ],
    prohibitedEffects: [
      "Publication does not create an execution artifact automatically.",
      "Publication does not execute.",
    ],
    boundaryStatement:
      "Publication is not Execution Artifact and is not Execution.",
  }),

  stage({
    id: "execution_artifact",
    order: 17,
    title: "Execution Artifact",
    shortTitle: "Artifact",
    description:
      "An integrity-protected package that preserves the admissible execution pathway and associated evidence.",
    stageClass: "execution",
    effect: "execution_artifact",
    maturity: "boundary",
    contractFile: "execution-artifact-contracts.ts",
    contractCode: "ACD-014",
    moduleKey: "executionArtifactContracts",
    priorStageIds: ["registry_publication"],
    nextStageIds: ["execution"],
    createsRecord: true,
    recordType: "execution_artifact",
    createsAuthority: false,
    createsDetermination: false,
    createsRegistryPublication: false,
    createsExecutionArtifact: true,
    createsExecution: false,
    preservesPriorRecords: true,
    rewritesPriorRecords: false,
    userVisible: true,
    missionControlVisible: true,
    academyVisible: true,
    registryVisible: true,
    completionLabel: "Artifact sealed",
    incompleteLabel: "Artifact assembly pending",
    blockedLabel: "Artifact held",
    entryRequirements: [
      "Required Registry publication exists.",
      "Artifact scope and evidence boundary are declared.",
    ],
    completionRequirements: [
      "Artifact identity, hash, seal, references, and limitations are preserved.",
    ],
    prohibitedEffects: [
      "Execution artifact does not execute.",
      "Execution artifact does not rewrite determination or publication.",
    ],
    boundaryStatement:
      "Execution Artifact is evidence of the pathway, not execution.",
  }),

  stage({
    id: "execution",
    order: 18,
    title: "Governed Execution",
    shortTitle: "Execution",
    description:
      "The controlled performance of an authorized action using an admissible execution artifact.",
    stageClass: "execution",
    effect: "execution",
    maturity: "boundary",
    contractFile: "execution-contracts.ts",
    contractCode: "ACD-015",
    moduleKey: "executionContracts",
    priorStageIds: ["execution_artifact"],
    nextStageIds: ["outcome"],
    createsRecord: true,
    recordType: "execution",
    createsAuthority: false,
    createsDetermination: false,
    createsRegistryPublication: false,
    createsExecutionArtifact: false,
    createsExecution: true,
    preservesPriorRecords: true,
    rewritesPriorRecords: false,
    userVisible: true,
    missionControlVisible: true,
    academyVisible: true,
    registryVisible: true,
    completionLabel: "Execution completed",
    incompleteLabel: "Execution pending",
    blockedLabel: "Execution held or failed",
    entryRequirements: [
      "A current, authorized execution artifact exists.",
      "Execution authority and conditions remain valid.",
    ],
    completionRequirements: [
      "Execution state, timestamps, result, hash, and failures are preserved.",
    ],
    prohibitedEffects: [
      "Execution cannot rewrite determination.",
      "Execution cannot rewrite Registry review or publication.",
      "Execution cannot rewrite the artifact.",
    ],
    boundaryStatement:
      "Execution consumes governance but cannot rewrite it.",
  }),

  stage({
    id: "outcome",
    order: 19,
    title: "Outcome",
    shortTitle: "Outcome",
    description:
      "The observed and verified reality produced after execution.",
    stageClass: "outcome",
    effect: "outcome",
    maturity: "boundary",
    contractFile: "outcome-contracts.ts",
    contractCode: "ACD-016",
    moduleKey: "outcomeContracts",
    priorStageIds: ["execution"],
    nextStageIds: ["continuity"],
    createsRecord: true,
    recordType: "outcome",
    createsAuthority: false,
    createsDetermination: false,
    createsRegistryPublication: false,
    createsExecutionArtifact: false,
    createsExecution: false,
    preservesPriorRecords: true,
    rewritesPriorRecords: false,
    userVisible: true,
    missionControlVisible: true,
    academyVisible: true,
    registryVisible: true,
    completionLabel: "Outcome verified",
    incompleteLabel: "Outcome observation pending",
    blockedLabel: "Outcome disputed",
    entryRequirements: ["Execution has produced an observable result."],
    completionRequirements: [
      "Outcome identity, observation, verification, state, and integrity hash are preserved.",
    ],
    prohibitedEffects: [
      "Outcome cannot rewrite execution.",
      "Outcome cannot rewrite the artifact, publication, review, or determination.",
    ],
    boundaryStatement:
      "Outcome records reality after execution without rewriting governance.",
  }),

  stage({
    id: "continuity",
    order: 20,
    title: "Continuity",
    shortTitle: "Continuity",
    description:
      "The preserved institutional memory that carries verified outcomes and governance context forward.",
    stageClass: "continuity",
    effect: "continuity",
    maturity: "boundary",
    contractFile: "continuity-contracts.ts",
    contractCode: "ACD-017",
    moduleKey: "continuityContracts",
    priorStageIds: ["outcome"],
    nextStageIds: ["revalidation"],
    createsRecord: true,
    recordType: "continuity",
    createsAuthority: false,
    createsDetermination: false,
    createsRegistryPublication: false,
    createsExecutionArtifact: false,
    createsExecution: false,
    preservesPriorRecords: true,
    rewritesPriorRecords: false,
    userVisible: true,
    missionControlVisible: true,
    academyVisible: true,
    registryVisible: true,
    completionLabel: "Continuity current",
    incompleteLabel: "Continuity pending",
    blockedLabel: "Revalidation required",
    entryRequirements: ["Outcome record exists."],
    completionRequirements: [
      "Historical lineage and forward continuity state are preserved.",
    ],
    prohibitedEffects: [
      "Continuity cannot rewrite outcome or upstream governance.",
    ],
    boundaryStatement:
      "Continuity extends history; it does not rewrite history.",
  }),

  stage({
    id: "revalidation",
    order: 21,
    title: "Revalidation",
    shortTitle: "Revalidation",
    description:
      "A governed review triggered by material change, expiry, contradiction, drift, challenge, or new evidence.",
    stageClass: "future_governance",
    effect: "revalidation",
    maturity: "substantive",
    contractFile: "revalidation-contracts.ts",
    contractCode: "ACD-018",
    moduleKey: "revalidationContracts",
    priorStageIds: ["continuity"],
    nextStageIds: ["governance_cycle"],
    createsRecord: true,
    recordType: "revalidation",
    createsAuthority: false,
    createsDetermination: false,
    createsRegistryPublication: false,
    createsExecutionArtifact: false,
    createsExecution: false,
    preservesPriorRecords: true,
    rewritesPriorRecords: false,
    userVisible: true,
    missionControlVisible: true,
    academyVisible: true,
    registryVisible: true,
    completionLabel: "Revalidation completed",
    incompleteLabel: "Revalidation required",
    blockedLabel: "Revalidation held or escalated",
    entryRequirements: [
      "A continuity record or material-change trigger exists.",
    ],
    completionRequirements: [
      "Trigger, screening, impact, authority, scope, evidence, concurrence, and decision are preserved.",
    ],
    prohibitedEffects: [
      "Revalidation cannot rewrite historical records.",
      "Revalidation cannot automatically create a finding or determination.",
      "Revalidation cannot automatically publish or execute.",
    ],
    boundaryStatement:
      "Revalidation opens a new governed cycle without mutating the prior cycle.",
  }),

  stage({
    id: "governance_cycle",
    order: 22,
    title: "Governance Cycle",
    shortTitle: "Cycle",
    description:
      "A versioned future governance cycle linked to preserved continuity and revalidation history.",
    stageClass: "future_governance",
    effect: "future_cycle",
    maturity: "conceptual",
    contractFile: "governance-cycle-contracts.ts",
    contractCode: "ACD-019",
    moduleKey: "governanceCycleContracts",
    priorStageIds: ["revalidation"],
    nextStageIds: ["institutional_evolution"],
    createsRecord: true,
    recordType: "governance_cycle",
    createsAuthority: false,
    createsDetermination: false,
    createsRegistryPublication: false,
    createsExecutionArtifact: false,
    createsExecution: false,
    preservesPriorRecords: true,
    rewritesPriorRecords: false,
    userVisible: true,
    missionControlVisible: true,
    academyVisible: true,
    registryVisible: false,
    completionLabel: "Cycle established",
    incompleteLabel: "Cycle not established",
    blockedLabel: "Cycle held",
    entryRequirements: ["Revalidation has defined the future review need."],
    completionRequirements: [
      "Prior cycle, continuity source, new cycle identity, and version are linked.",
    ],
    prohibitedEffects: [
      "A new cycle cannot mutate a prior cycle.",
    ],
    boundaryStatement:
      "Each governance cycle creates new records while preserving all prior cycles.",
  }),

  ...[
    ["institutional_evolution", 23, "Institutional Evolution", "Evolution", "institutional-evolution-contracts.ts", "ACD-020", "institutionalEvolutionContracts"],
    ["institutional_memory", 24, "Institutional Memory", "Memory", "institutional-memory-contracts.ts", "ACD-021", "institutionalMemoryContracts"],
    ["institutional_knowledge", 25, "Institutional Knowledge", "Knowledge", "institutional-knowledge-contracts.ts", "ACD-022", "institutionalKnowledgeContracts"],
    ["institutional_intelligence", 26, "Institutional Intelligence", "Intelligence", "institutional-intelligence-contracts.ts", "ACD-023", "institutionalIntelligenceContracts"],
    ["institutional_strategy", 27, "Institutional Strategy", "Strategy", "institutional-strategy-contracts.ts", "ACD-024", "institutionalStrategyContracts"],
    ["institutional_stewardship", 28, "Institutional Stewardship", "Stewardship", "institutional-stewardship-contracts.ts", "ACD-025", "institutionalStewardshipContracts"],
    ["institutional_assurance", 29, "Institutional Assurance", "Assurance", "institutional-assurance-contracts.ts", "ACD-026", "institutionalAssuranceContracts"],
    ["institutional_oversight", 30, "Institutional Oversight", "Oversight", "institutional-oversight-contracts.ts", "ACD-027", "institutionalOversightContracts"],
    ["institutional_accountability", 31, "Institutional Accountability", "Accountability", "institutional-accountability-contracts.ts", "ACD-028", "institutionalAccountabilityContracts"],
    ["institutional_transparency", 32, "Institutional Transparency", "Transparency", "institutional-transparency-contracts.ts", "ACD-029", "institutionalTransparencyContracts"],
    ["institutional_trust", 33, "Institutional Trust", "Trust", "institutional-trust-contracts.ts", "ACD-030", "institutionalTrustContracts"],
    ["institutional_legitimacy", 34, "Institutional Legitimacy", "Legitimacy", "institutional-legitimacy-contracts.ts", "ACD-031", "institutionalLegitimacyContracts"],
    ["institutional_continuity_governance", 35, "Institutional Continuity Governance", "Continuity Governance", "institutional-continuity-governance-contracts.ts", "ACD-032", "institutionalContinuityGovernanceContracts"],
    ["institutional_resilience", 36, "Institutional Resilience", "Resilience", "institutional-resilience-contracts.ts", "ACD-033", "institutionalResilienceContracts"],
    ["institutional_sustainability", 37, "Institutional Sustainability", "Sustainability", "institutional-sustainability-contracts.ts", "ACD-034", "institutionalSustainabilityContracts"],
  ].map((value, index, all) => {
    const [
      id,
      order,
      title,
      shortTitle,
      contractFile,
      contractCode,
      moduleKey,
    ] = value as unknown as readonly [
      InstitutionalStageId,
      number,
      string,
      string,
      string,
      string,
      keyof InstitutionalContractModules,
    ];

    const prior =
      index === 0
        ? "governance_cycle"
        : (all[index - 1][0] as InstitutionalStageId);

    const next =
      index === all.length - 1
        ? []
        : [all[index + 1][0] as InstitutionalStageId];

    return stage({
      id,
      order,
      title,
      shortTitle,
      description:
        `${title} is a preserved institutional-capacity record that extends future governance without altering the historical chain.`,
      stageClass: "institutional_capacity",
      effect: "institutional_record",
      maturity: id === "institutional_oversight" ? "substantive" : "conceptual",
      contractFile,
      contractCode,
      moduleKey,
      priorStageIds: [prior],
      nextStageIds: next,
      createsRecord: true,
      recordType: id,
      createsAuthority: false,
      createsDetermination: false,
      createsRegistryPublication: false,
      createsExecutionArtifact: false,
      createsExecution: false,
      preservesPriorRecords: true,
      rewritesPriorRecords: false,
      userVisible: true,
      missionControlVisible: true,
      academyVisible: true,
      registryVisible: false,
      completionLabel: `${shortTitle} record current`,
      incompleteLabel: `${shortTitle} record pending`,
      blockedLabel: `${shortTitle} held`,
      entryRequirements: [
        `The prior institutional stage ${prior} is preserved.`,
      ],
      completionRequirements: [
        `${title} identity, lineage, state, and integrity are preserved.`,
      ],
      prohibitedEffects: [
        `${title} cannot rewrite historical governance records.`,
        `${title} cannot independently create a determination, publication, artifact, or execution.`,
      ],
      boundaryStatement:
        `${title} extends institutional capacity while preserving immutable governance history.`,
    });
  }),
]);

/* ========================================================================== *
 * Stage lookup indexes
 * ========================================================================== */

const STAGE_BY_ID =
  new Map<InstitutionalStageId, InstitutionalStageDefinition>(
    INSTITUTIONAL_STAGE_REGISTRY.map((definition) => [
      definition.id,
      definition,
    ]),
  );

const STAGE_BY_ORDER =
  new Map<number, InstitutionalStageDefinition>(
    INSTITUTIONAL_STAGE_REGISTRY.map((definition) => [
      definition.order,
      definition,
    ]),
  );

export function getInstitutionalStage(
  stageId: InstitutionalStageId,
): InstitutionalStageDefinition {
  const definition = STAGE_BY_ID.get(stageId);

  if (!definition) {
    throw new Error(`Unknown institutional stage: ${stageId}`);
  }

  return definition;
}

export function getInstitutionalStageByOrder(
  order: number,
): InstitutionalStageDefinition | null {
  return STAGE_BY_ORDER.get(order) ?? null;
}

export function listInstitutionalStages(
  options: {
    readonly stageClass?: InstitutionalStageClass;
    readonly maturity?: InstitutionalStageMaturity;
    readonly missionControlVisible?: boolean;
    readonly academyVisible?: boolean;
    readonly registryVisible?: boolean;
  } = {},
): readonly InstitutionalStageDefinition[] {
  return Object.freeze(
    INSTITUTIONAL_STAGE_REGISTRY.filter((definition) => {
      if (
        options.stageClass &&
        definition.stageClass !== options.stageClass
      ) {
        return false;
      }

      if (
        options.maturity &&
        definition.maturity !== options.maturity
      ) {
        return false;
      }

      if (
        options.missionControlVisible !== undefined &&
        definition.missionControlVisible !==
          options.missionControlVisible
      ) {
        return false;
      }

      if (
        options.academyVisible !== undefined &&
        definition.academyVisible !== options.academyVisible
      ) {
        return false;
      }

      if (
        options.registryVisible !== undefined &&
        definition.registryVisible !== options.registryVisible
      ) {
        return false;
      }

      return true;
    }),
  );
}

export function getStageModule(
  stageId: InstitutionalStageId,
): unknown {
  const stageDefinition = getInstitutionalStage(stageId);

  if (!stageDefinition.moduleKey) {
    return null;
  }

  return institutionalContractModules[stageDefinition.moduleKey];
}

/* ========================================================================== *
 * Transition contracts
 * ========================================================================== */

export const INSTITUTIONAL_TRANSITION_STATES = [
  "available",
  "ready",
  "blocked",
  "held",
  "escalated",
  "completed",
  "not_applicable",
] as const;

export type InstitutionalTransitionState =
  (typeof INSTITUTIONAL_TRANSITION_STATES)[number];

export interface InstitutionalTransitionDefinition {
  readonly transitionId: string;
  readonly fromStageId: InstitutionalStageId;
  readonly toStageId: InstitutionalStageId;
  readonly title: string;
  readonly description: string;
  readonly requiredConditions: readonly string[];
  readonly prohibitedShortcuts: readonly string[];
  readonly preservesSourceRecord: true;
  readonly rewritesSourceRecord: false;
}

export interface InstitutionalTransitionEvaluation {
  readonly transitionId: string;
  readonly fromStageId: InstitutionalStageId;
  readonly toStageId: InstitutionalStageId;
  readonly state: InstitutionalTransitionState;
  readonly ready: boolean;
  readonly satisfiedConditions: readonly string[];
  readonly unsatisfiedConditions: readonly string[];
  readonly blockingReasons: readonly string[];
  readonly warnings: readonly string[];
  readonly evaluatedAt: string;
}

export function createTransitionDefinition(
  fromStageId: InstitutionalStageId,
  toStageId: InstitutionalStageId,
): InstitutionalTransitionDefinition {
  const from = getInstitutionalStage(fromStageId);
  const to = getInstitutionalStage(toStageId);

  if (!from.nextStageIds.includes(toStageId)) {
    throw new Error(
      `${toStageId} is not a canonical next stage for ${fromStageId}.`,
    );
  }

  return Object.freeze({
    transitionId: `TA14-TRANSITION-${from.order}-${to.order}`,
    fromStageId,
    toStageId,
    title: `${from.shortTitle} to ${to.shortTitle}`,
    description:
      `Evaluates whether ${from.title} may advance to ${to.title} without collapsing their institutional boundaries.`,
    requiredConditions: Object.freeze([
      `${from.title} completion requirements are satisfied.`,
      `${to.title} entry requirements are satisfied.`,
      "Source record identity, version, and integrity remain preserved.",
      "The transition is attributable to an authorized subject or service.",
    ]),
    prohibitedShortcuts: Object.freeze([
      `${from.title} cannot silently create the institutional effect of ${to.title}.`,
      "The source record cannot be mutated to imitate the target record.",
      "Missing evidence, authority, scope, or continuity cannot be inferred.",
    ]),
    preservesSourceRecord: true,
    rewritesSourceRecord: false,
  });
}

export function evaluateTransition(
  transition: InstitutionalTransitionDefinition,
  input: {
    readonly satisfiedConditions: readonly string[];
    readonly blockingReasons?: readonly string[];
    readonly warnings?: readonly string[];
    readonly held?: boolean;
    readonly escalated?: boolean;
    readonly completed?: boolean;
    readonly evaluatedAt?: string;
  },
): InstitutionalTransitionEvaluation {
  const satisfied = new Set(input.satisfiedConditions);

  const unsatisfiedConditions =
    transition.requiredConditions.filter(
      (condition) => !satisfied.has(condition),
    );

  const blockingReasons = [
    ...(input.blockingReasons ?? []),
  ];

  if (unsatisfiedConditions.length > 0) {
    blockingReasons.push(
      ...unsatisfiedConditions.map(
        (condition) => `Unsatisfied condition: ${condition}`,
      ),
    );
  }

  const ready =
    blockingReasons.length === 0 &&
    !input.held &&
    !input.escalated;

  const state: InstitutionalTransitionState =
    input.completed
      ? "completed"
      : input.escalated
        ? "escalated"
        : input.held
          ? "held"
          : ready
            ? "ready"
            : "blocked";

  return Object.freeze({
    transitionId: transition.transitionId,
    fromStageId: transition.fromStageId,
    toStageId: transition.toStageId,
    state,
    ready,
    satisfiedConditions: Object.freeze([
      ...input.satisfiedConditions,
    ]),
    unsatisfiedConditions: Object.freeze(unsatisfiedConditions),
    blockingReasons: Object.freeze(blockingReasons),
    warnings: Object.freeze([...(input.warnings ?? [])]),
    evaluatedAt:
      input.evaluatedAt ?? new Date().toISOString(),
  });
}

/* ========================================================================== *
 * Institutional work state
 * ========================================================================== */

export interface InstitutionalStageRecordRef {
  readonly stageId: InstitutionalStageId;
  readonly recordId: string;
  readonly recordType?: string;
  readonly recordVersion?: string;
  readonly integrityHash?: string;
  readonly state: string;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  readonly completedAt?: string;
  readonly ownerSubjectId?: string;
  readonly organizationId?: string;
  readonly routeId?: string;
  readonly correlationId?: string;
  readonly limitations?: readonly string[];
}

export interface InstitutionalLifecycleSnapshot {
  readonly snapshotId: string;
  readonly subjectId?: string;
  readonly organizationId?: string;
  readonly governanceEntityId?: string;
  readonly routeId?: string;
  readonly targetRecordId?: string;
  readonly records: readonly InstitutionalStageRecordRef[];
  readonly generatedAt: string;
}

export interface InstitutionalStageStatus {
  readonly stageId: InstitutionalStageId;
  readonly order: number;
  readonly title: string;
  readonly status:
    | "not_started"
    | "available"
    | "active"
    | "completed"
    | "held"
    | "escalated"
    | "blocked"
    | "superseded"
    | "withdrawn"
    | "invalidated";
  readonly recordRefs: readonly InstitutionalStageRecordRef[];
  readonly currentRecordRef?: InstitutionalStageRecordRef;
  readonly completionLabel: string;
  readonly nextAction?: InstitutionalActionRecommendation;
}

export interface InstitutionalActionRecommendation {
  readonly actionId: string;
  readonly actionType: InstitutionalActionType;
  readonly title: string;
  readonly description: string;
  readonly stageId: InstitutionalStageId;
  readonly basis: string;
  readonly ownerSubjectId?: string;
  readonly completionCondition: string;
  readonly consequenceOfInaction: string;
  readonly priority: "routine" | "important" | "urgent" | "critical";
  readonly href?: string;
}

function normalizeRecordState(
  state: string,
): InstitutionalStageStatus["status"] {
  const normalized = state.toLowerCase();

  if (
    ["completed", "accepted", "committed", "published", "sealed", "verified", "current", "active", "closed", "sustained"].includes(
      normalized,
    )
  ) {
    return "completed";
  }

  if (
    ["held", "hold", "revalidation_required"].includes(normalized)
  ) {
    return "held";
  }

  if (["escalated", "escalate", "disputed"].includes(normalized)) {
    return "escalated";
  }

  if (["blocked", "failed", "returned_for_correction"].includes(normalized)) {
    return "blocked";
  }

  if (normalized === "superseded") {
    return "superseded";
  }

  if (normalized === "withdrawn") {
    return "withdrawn";
  }

  if (normalized === "invalidated") {
    return "invalidated";
  }

  if (
    ["draft", "pending", "under_review", "in_progress", "executing", "screening"].includes(
      normalized,
    )
  ) {
    return "active";
  }

  return "active";
}

export function resolveLifecycleStatus(
  snapshot: InstitutionalLifecycleSnapshot,
): readonly InstitutionalStageStatus[] {
  const recordsByStage =
    new Map<InstitutionalStageId, InstitutionalStageRecordRef[]>();

  for (const record of snapshot.records) {
    const values = recordsByStage.get(record.stageId) ?? [];
    values.push(record);
    recordsByStage.set(record.stageId, values);
  }

  let priorCompleted = true;

  const statuses =
    INSTITUTIONAL_STAGE_REGISTRY.map((definition) => {
      const recordRefs = recordsByStage.get(definition.id) ?? [];

      const currentRecordRef =
        [...recordRefs].sort((a, b) => {
          const aTime = Date.parse(
            a.updatedAt ?? a.createdAt ?? "1970-01-01T00:00:00Z",
          );
          const bTime = Date.parse(
            b.updatedAt ?? b.createdAt ?? "1970-01-01T00:00:00Z",
          );
          return bTime - aTime;
        })[0];

      let status: InstitutionalStageStatus["status"];

      if (currentRecordRef) {
        status = normalizeRecordState(currentRecordRef.state);
      } else if (priorCompleted) {
        status = "available";
      } else {
        status = "not_started";
      }

      const nextAction =
        createActionRecommendation(
          definition,
          status,
          currentRecordRef,
        );

      const stageStatus: InstitutionalStageStatus = {
        stageId: definition.id,
        order: definition.order,
        title: definition.title,
        status,
        recordRefs: Object.freeze([...recordRefs]),
        currentRecordRef,
        completionLabel: definition.completionLabel,
        nextAction,
      };

      priorCompleted =
        status === "completed" ||
        status === "superseded";

      return Object.freeze(stageStatus);
    });

  return Object.freeze(statuses);
}

function createActionRecommendation(
  stageDefinition: InstitutionalStageDefinition,
  status: InstitutionalStageStatus["status"],
  record?: InstitutionalStageRecordRef,
): InstitutionalActionRecommendation | undefined {
  if (status === "completed" || status === "superseded") {
    return undefined;
  }

  const actionType: InstitutionalActionType =
    status === "available"
      ? "open"
      : status === "active"
        ? "continue"
        : status === "held"
          ? "correct"
          : status === "escalated"
            ? "review"
            : status === "blocked"
              ? "correct"
              : status === "invalidated"
                ? "revalidate"
                : status === "withdrawn"
                  ? "review"
                  : "none";

  if (actionType === "none") {
    return undefined;
  }

  const priority:
    InstitutionalActionRecommendation["priority"] =
    status === "invalidated" || status === "escalated"
      ? "critical"
      : status === "held" || status === "blocked"
        ? "urgent"
        : status === "active"
          ? "important"
          : "routine";

  return Object.freeze({
    actionId:
      `TA14-ACTION-${stageDefinition.id}-${record?.recordId ?? "new"}`,
    actionType,
    title:
      status === "available"
        ? `Begin ${stageDefinition.title}`
        : status === "active"
          ? `Continue ${stageDefinition.title}`
          : status === "held"
            ? `Resolve ${stageDefinition.title} hold`
            : status === "escalated"
              ? `Review ${stageDefinition.title} escalation`
              : status === "invalidated"
                ? `Revalidate ${stageDefinition.title}`
                : `Correct ${stageDefinition.title}`,
    description:
      status === "available"
        ? stageDefinition.description
        : `${stageDefinition.title} is currently ${status}.`,
    stageId: stageDefinition.id,
    basis:
      record
        ? `Current record ${record.recordId} is ${record.state}.`
        : `The prior canonical stage is complete and ${stageDefinition.title} is available.`,
    ownerSubjectId: record?.ownerSubjectId,
    completionCondition:
      stageDefinition.completionRequirements.join(" "),
    consequenceOfInaction:
      `The institutional lifecycle cannot safely advance beyond ${stageDefinition.title}.`,
    priority,
  });
}

/* ========================================================================== *
 * Mission Control summaries
 * ========================================================================== */

export interface InstitutionalMissionControlSummary {
  readonly snapshotId: string;
  readonly generatedAt: string;
  readonly currentStage?: InstitutionalStageStatus;
  readonly nextStage?: InstitutionalStageStatus;
  readonly completedStageCount: number;
  readonly activeStageCount: number;
  readonly heldStageCount: number;
  readonly escalatedStageCount: number;
  readonly blockedStageCount: number;
  readonly criticalActionCount: number;
  readonly urgentActionCount: number;
  readonly actions: readonly InstitutionalActionRecommendation[];
  readonly lifecycleProgressPercent: number;
  readonly institutionalBoundary: string;
}

export function buildMissionControlSummary(
  snapshot: InstitutionalLifecycleSnapshot,
): InstitutionalMissionControlSummary {
  const statuses = resolveLifecycleStatus(snapshot);

  const completedStatuses = statuses.filter(
    (status) =>
      status.status === "completed" ||
      status.status === "superseded",
  );

  const activeStatuses = statuses.filter(
    (status) => status.status === "active",
  );

  const heldStatuses = statuses.filter(
    (status) => status.status === "held",
  );

  const escalatedStatuses = statuses.filter(
    (status) => status.status === "escalated",
  );

  const blockedStatuses = statuses.filter(
    (status) => status.status === "blocked",
  );

  const currentStage =
    [...statuses]
      .reverse()
      .find(
        (status) =>
          status.status === "completed" ||
          status.status === "active" ||
          status.status === "held" ||
          status.status === "escalated" ||
          status.status === "blocked",
      );

  const nextStage =
    currentStage
      ? statuses.find(
          (status) =>
            status.order > currentStage.order &&
            status.status !== "not_started",
        ) ??
        statuses.find(
          (status) =>
            status.order > currentStage.order,
        )
      : statuses[0];

  const actions =
    statuses
      .flatMap((status) =>
        status.nextAction ? [status.nextAction] : [],
      )
      .sort((a, b) => {
        const rank = {
          critical: 4,
          urgent: 3,
          important: 2,
          routine: 1,
        } as const;

        return rank[b.priority] - rank[a.priority];
      });

  const lifecycleProgressPercent =
    Math.round(
      (
        completedStatuses.length /
        INSTITUTIONAL_STAGE_REGISTRY.length
      ) * 100,
    );

  return Object.freeze({
    snapshotId: snapshot.snapshotId,
    generatedAt: snapshot.generatedAt,
    currentStage,
    nextStage,
    completedStageCount: completedStatuses.length,
    activeStageCount: activeStatuses.length,
    heldStageCount: heldStatuses.length,
    escalatedStageCount: escalatedStatuses.length,
    blockedStageCount: blockedStatuses.length,
    criticalActionCount:
      actions.filter((action) => action.priority === "critical").length,
    urgentActionCount:
      actions.filter((action) => action.priority === "urgent").length,
    actions: Object.freeze(actions),
    lifecycleProgressPercent,
    institutionalBoundary:
      TA14_INSTITUTIONAL_ENGINE_BOUNDARY,
  });
}

/* ========================================================================== *
 * Engine validation
 * ========================================================================== */

export type InstitutionalEngineValidationCode =
  | "duplicate_stage_id"
  | "duplicate_stage_order"
  | "missing_stage"
  | "invalid_order"
  | "invalid_prior_reference"
  | "invalid_next_reference"
  | "asymmetric_transition"
  | "history_rewrite_allowed"
  | "unauthorized_effect"
  | "missing_boundary"
  | "missing_contract_module"
  | "canonical_chain_mismatch";

export interface InstitutionalEngineValidationIssue {
  readonly code: InstitutionalEngineValidationCode;
  readonly message: string;
  readonly stageId?: InstitutionalStageId;
  readonly severity: "error" | "warning";
}

export interface InstitutionalEngineValidationResult {
  readonly ok: boolean;
  readonly issues: readonly InstitutionalEngineValidationIssue[];
}

export function validateInstitutionalEngine():
InstitutionalEngineValidationResult {
  const issues: InstitutionalEngineValidationIssue[] = [];

  const ids = new Set<InstitutionalStageId>();
  const orders = new Set<number>();

  for (const definition of INSTITUTIONAL_STAGE_REGISTRY) {
    if (ids.has(definition.id)) {
      issues.push({
        code: "duplicate_stage_id",
        message: `Duplicate stage id ${definition.id}.`,
        stageId: definition.id,
        severity: "error",
      });
    }

    ids.add(definition.id);

    if (orders.has(definition.order)) {
      issues.push({
        code: "duplicate_stage_order",
        message: `Duplicate stage order ${definition.order}.`,
        stageId: definition.id,
        severity: "error",
      });
    }

    orders.add(definition.order);

    if (definition.rewritesPriorRecords) {
      issues.push({
        code: "history_rewrite_allowed",
        message:
          `${definition.id} improperly allows prior-record rewriting.`,
        stageId: definition.id,
        severity: "error",
      });
    }

    if (!definition.boundaryStatement.trim()) {
      issues.push({
        code: "missing_boundary",
        message: `${definition.id} has no boundary statement.`,
        stageId: definition.id,
        severity: "error",
      });
    }

    if (
      definition.moduleKey &&
      !institutionalContractModules[definition.moduleKey]
    ) {
      issues.push({
        code: "missing_contract_module",
        message:
          `${definition.id} references unavailable module ${definition.moduleKey}.`,
        stageId: definition.id,
        severity: "error",
      });
    }

    for (const priorStageId of definition.priorStageIds) {
      if (!STAGE_BY_ID.has(priorStageId)) {
        issues.push({
          code: "invalid_prior_reference",
          message:
            `${definition.id} references missing prior stage ${priorStageId}.`,
          stageId: definition.id,
          severity: "error",
        });
      }
    }

    for (const nextStageId of definition.nextStageIds) {
      const nextDefinition = STAGE_BY_ID.get(nextStageId);

      if (!nextDefinition) {
        issues.push({
          code: "invalid_next_reference",
          message:
            `${definition.id} references missing next stage ${nextStageId}.`,
          stageId: definition.id,
          severity: "error",
        });
        continue;
      }

      if (!nextDefinition.priorStageIds.includes(definition.id)) {
        issues.push({
          code: "asymmetric_transition",
          message:
            `${definition.id} -> ${nextStageId} is not mirrored by the target stage.`,
          stageId: definition.id,
          severity: "error",
        });
      }
    }
  }

  TA14_CANONICAL_CHAIN.forEach((stageId, index) => {
    const definition = STAGE_BY_ID.get(stageId);

    if (!definition) {
      issues.push({
        code: "missing_stage",
        message: `Canonical stage ${stageId} is missing.`,
        stageId,
        severity: "error",
      });
      return;
    }

    if (definition.order !== index + 1) {
      issues.push({
        code: "canonical_chain_mismatch",
        message:
          `${stageId} has order ${definition.order}; expected ${index + 1}.`,
        stageId,
        severity: "error",
      });
    }
  });

  return Object.freeze({
    ok: !issues.some((issue) => issue.severity === "error"),
    issues: Object.freeze(issues),
  });
}

/* ========================================================================== *
 * Self-check
 * ========================================================================== */

export interface InstitutionalEngineSelfCheck {
  readonly ok: boolean;
  readonly engineId: typeof TA14_INSTITUTIONAL_ENGINE_ID;
  readonly engineVersion: typeof TA14_INSTITUTIONAL_ENGINE_VERSION;
  readonly canonicalStageCount: number;
  readonly registeredStageCount: number;
  readonly registeredModuleCount: number;
  readonly substantiveStageCount: number;
  readonly boundaryStageCount: number;
  readonly conceptualStageCount: number;
  readonly preservesHistory: true;
  readonly rewritesHistory: false;
  readonly createsCredential: false;
  readonly createsAuthority: false;
  readonly createsAssignment: false;
  readonly createsFinding: false;
  readonly createsDetermination: false;
  readonly createsRegistryPublication: false;
  readonly createsExecutionArtifact: false;
  readonly createsExecution: false;
  readonly issues: readonly InstitutionalEngineValidationIssue[];
}

export function runInstitutionalEngineSelfCheck():
InstitutionalEngineSelfCheck {
  const validation = validateInstitutionalEngine();

  return Object.freeze({
    ok: validation.ok,
    engineId: TA14_INSTITUTIONAL_ENGINE_ID,
    engineVersion: TA14_INSTITUTIONAL_ENGINE_VERSION,
    canonicalStageCount: TA14_CANONICAL_CHAIN.length,
    registeredStageCount: INSTITUTIONAL_STAGE_REGISTRY.length,
    registeredModuleCount: Object.keys(institutionalContractModules).length,
    substantiveStageCount:
      INSTITUTIONAL_STAGE_REGISTRY.filter(
        (stageDefinition) =>
          stageDefinition.maturity === "substantive",
      ).length,
    boundaryStageCount:
      INSTITUTIONAL_STAGE_REGISTRY.filter(
        (stageDefinition) =>
          stageDefinition.maturity === "boundary",
      ).length,
    conceptualStageCount:
      INSTITUTIONAL_STAGE_REGISTRY.filter(
        (stageDefinition) =>
          stageDefinition.maturity === "conceptual",
      ).length,
    preservesHistory: true,
    rewritesHistory: false,
    createsCredential: false,
    createsAuthority: false,
    createsAssignment: false,
    createsFinding: false,
    createsDetermination: false,
    createsRegistryPublication: false,
    createsExecutionArtifact: false,
    createsExecution: false,
    issues: validation.issues,
  });
}

/* ========================================================================== *
 * Public lifecycle projection
 * ========================================================================== */

export interface PublicInstitutionalLifecycleStage {
  readonly id: InstitutionalStageId;
  readonly order: number;
  readonly title: string;
  readonly shortTitle: string;
  readonly description: string;
  readonly maturity: InstitutionalStageMaturity;
  readonly boundaryStatement: string;
  readonly completionLabel: string;
}

export interface PublicInstitutionalLifecycleProjection {
  readonly engineId: typeof TA14_INSTITUTIONAL_ENGINE_ID;
  readonly engineVersion: typeof TA14_INSTITUTIONAL_ENGINE_VERSION;
  readonly principle: typeof TA14_INSTITUTIONAL_ENGINE_PRINCIPLE;
  readonly boundary: typeof TA14_INSTITUTIONAL_ENGINE_BOUNDARY;
  readonly stages: readonly PublicInstitutionalLifecycleStage[];
  readonly generatedAt: string;
}

export function projectPublicInstitutionalLifecycle(
  generatedAt = new Date().toISOString(),
): PublicInstitutionalLifecycleProjection {
  return Object.freeze({
    engineId: TA14_INSTITUTIONAL_ENGINE_ID,
    engineVersion: TA14_INSTITUTIONAL_ENGINE_VERSION,
    principle: TA14_INSTITUTIONAL_ENGINE_PRINCIPLE,
    boundary: TA14_INSTITUTIONAL_ENGINE_BOUNDARY,
    stages: Object.freeze(
      INSTITUTIONAL_STAGE_REGISTRY
        .filter((stageDefinition) => stageDefinition.userVisible)
        .map((stageDefinition) =>
          Object.freeze({
            id: stageDefinition.id,
            order: stageDefinition.order,
            title: stageDefinition.title,
            shortTitle: stageDefinition.shortTitle,
            description: stageDefinition.description,
            maturity: stageDefinition.maturity,
            boundaryStatement:
              stageDefinition.boundaryStatement,
            completionLabel:
              stageDefinition.completionLabel,
          }),
        ),
    ),
    generatedAt,
  });
}

/* ========================================================================== *
 * Default export
 * ========================================================================== */

const institutionalEngine = Object.freeze({
  engineId: TA14_INSTITUTIONAL_ENGINE_ID,
  engineVersion: TA14_INSTITUTIONAL_ENGINE_VERSION,
  principle: TA14_INSTITUTIONAL_ENGINE_PRINCIPLE,
  boundary: TA14_INSTITUTIONAL_ENGINE_BOUNDARY,

  canonicalChain: TA14_CANONICAL_CHAIN,
  stageRegistry: INSTITUTIONAL_STAGE_REGISTRY,
  modules: institutionalContractModules,

  getInstitutionalStage,
  getInstitutionalStageByOrder,
  listInstitutionalStages,
  getStageModule,

  createTransitionDefinition,
  evaluateTransition,

  resolveLifecycleStatus,
  buildMissionControlSummary,

  validateInstitutionalEngine,
  runInstitutionalEngineSelfCheck,
  projectPublicInstitutionalLifecycle,
});

export default institutionalEngine;
