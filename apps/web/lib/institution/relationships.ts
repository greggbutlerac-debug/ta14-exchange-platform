/**
 * TA-14 Institutional Relationship Engine
 *
 * Repository path:
 *   apps/web/lib/institution/relationships.ts
 *
 * Institutional purpose:
 *   Provide one canonical, governed graph boundary for every relationship among
 *   TA-14 institutional records. This module prevents page-specific links from
 *   becoming institutional truth and gives Mission Control, Registry, entity
 *   pages, reviews, artifacts, scopes, credentials, challenges, corrections,
 *   outcomes, and analytics one shared relationship vocabulary.
 *
 * Governing principles:
 *   - Every relationship is typed, attributable, bounded, and version-aware.
 *   - Direction is explicit; inverse meaning is never silently inferred.
 *   - Corrections and supersession preserve prior institutional history.
 *   - Public projection is a deliberate policy decision.
 *   - Invalid record-type pairings are rejected before persistence.
 *   - Cycles are permitted only where the relationship contract allows them.
 *   - Relationship authority and temporal validity remain inspectable.
 */

import type {
  AuthorityContext,
  InstitutionalRecordSummary,
  InstitutionalRecordType,
  InstitutionalRelationship,
  ISODateTime,
  RecordId,
  RelationshipDirection,
  RelationshipId,
  RelationshipType,
  ResolvedRelationship,
  SubjectId,
  VisibilityBoundary,
} from "./record-resolver";

export const TA14_RELATIONSHIP_ENGINE_VERSION = "1.0.0" as const;
export const TA14_RELATIONSHIP_CONTRACT_VERSION = "1.0" as const;

// -----------------------------------------------------------------------------
// Canonical graph contracts
// -----------------------------------------------------------------------------

export type RelationshipLifecycleState =
  | "draft"
  | "active"
  | "suspended"
  | "expired"
  | "superseded"
  | "withdrawn"
  | "archived";

export type RelationshipStrength =
  | "informational"
  | "supporting"
  | "governing"
  | "blocking"
  | "constitutive";

export type RelationshipEvidenceState =
  | "declared"
  | "verified"
  | "disputed"
  | "stale"
  | "not_required";

export type RelationshipCardinality =
  | "ONE_TO_ONE"
  | "ONE_TO_MANY"
  | "MANY_TO_ONE"
  | "MANY_TO_MANY";

export type RelationshipCyclePolicy =
  | "FORBID"
  | "ALLOW"
  | "ALLOW_WITH_WARNING";

export type RelationshipProjectionMode =
  | "FULL"
  | "SUMMARY"
  | "REFERENCE_ONLY"
  | "HIDDEN";

export type RelationshipValidationSeverity = "info" | "warning" | "error";

export interface RelationshipValidationIssue {
  code: string;
  severity: RelationshipValidationSeverity;
  message: string;
  relationshipId?: RelationshipId;
  sourceRecordId?: RecordId;
  targetRecordId?: RecordId;
  field?: string;
  recoverable: boolean;
}

export interface InstitutionalRelationshipContract {
  relationshipType: RelationshipType;
  label: string;
  inverseLabel: string;
  description: string;
  sourceRecordTypes: readonly InstitutionalRecordType[] | "ANY";
  targetRecordTypes: readonly InstitutionalRecordType[] | "ANY";
  cardinality: RelationshipCardinality;
  strength: RelationshipStrength;
  cyclePolicy: RelationshipCyclePolicy;
  requiresAuthorityReference: boolean;
  requiresScope: boolean;
  requiresEvidence: boolean;
  permitsSelfReference: boolean;
  publicByDefault: boolean;
  defaultProjection: RelationshipProjectionMode;
  continuitySignificant: boolean;
  blockingPotential: boolean;
  inverseRelationshipType?: RelationshipType;
  notes: readonly string[];
}

export interface RelationshipAuthorityEnvelope {
  createdBy?: SubjectId;
  authorityReference?: string;
  authorityGrantIds: string[];
  appointmentRecordId?: RecordId;
  declaredCompetence?: string[];
  conflictDeclarationId?: RecordId;
  authorizedAt?: ISODateTime;
  expiresAt?: ISODateTime;
}

export interface RelationshipEvidenceEnvelope {
  state: RelationshipEvidenceState;
  evidenceRecordIds: RecordId[];
  rationale?: string;
  verifiedBy?: SubjectId;
  verifiedAt?: ISODateTime;
  limitations: string[];
}

export interface RelationshipVisibilityEnvelope {
  boundary: VisibilityBoundary;
  public: boolean;
  projectionMode: RelationshipProjectionMode;
  redactedMetadataFields: string[];
  embargoUntil?: ISODateTime;
  reason?: string;
}

export interface GovernedInstitutionalRelationship extends InstitutionalRelationship {
  contractVersion: typeof TA14_RELATIONSHIP_CONTRACT_VERSION;
  lifecycleState: RelationshipLifecycleState;
  strength: RelationshipStrength;
  evidence: RelationshipEvidenceEnvelope;
  authority: RelationshipAuthorityEnvelope;
  visibility: RelationshipVisibilityEnvelope;
  version: number;
  priorRelationshipId?: RelationshipId;
  supersededByRelationshipId?: RelationshipId;
  correlationId?: string;
  idempotencyKey?: string;
  createdFromEventId?: string;
  limitations: string[];
  tags: string[];
}

export interface RelationshipCreateInput {
  relationshipType: RelationshipType;
  sourceRecordId: RecordId;
  targetRecordId: RecordId;
  sourceRecordType: InstitutionalRecordType;
  targetRecordType: InstitutionalRecordType;
  createdBy?: SubjectId;
  createdAt?: ISODateTime;
  effectiveAt?: ISODateTime;
  expiresAt?: ISODateTime;
  authorityReference?: string;
  authorityGrantIds?: string[];
  appointmentRecordId?: RecordId;
  conflictDeclarationId?: RecordId;
  scope?: string;
  public?: boolean;
  visibilityBoundary?: VisibilityBoundary;
  projectionMode?: RelationshipProjectionMode;
  evidenceState?: RelationshipEvidenceState;
  evidenceRecordIds?: RecordId[];
  evidenceRationale?: string;
  metadata?: Record<string, unknown>;
  limitations?: string[];
  tags?: string[];
  correlationId?: string;
  idempotencyKey?: string;
  createdFromEventId?: string;
}

export interface RelationshipUpdateInput {
  relationshipId: RelationshipId;
  expectedVersion: number;
  lifecycleState?: RelationshipLifecycleState;
  effectiveAt?: ISODateTime;
  expiresAt?: ISODateTime;
  authorityReference?: string;
  authorityGrantIds?: string[];
  appointmentRecordId?: RecordId;
  conflictDeclarationId?: RecordId;
  scope?: string;
  visibilityBoundary?: VisibilityBoundary;
  projectionMode?: RelationshipProjectionMode;
  public?: boolean;
  evidenceState?: RelationshipEvidenceState;
  evidenceRecordIds?: RecordId[];
  evidenceRationale?: string;
  limitations?: string[];
  tags?: string[];
  metadata?: Record<string, unknown>;
  changedBy?: SubjectId;
  changedAt?: ISODateTime;
  changeReason: string;
  correlationId?: string;
  idempotencyKey?: string;
}

export interface RelationshipMutationResult {
  ok: boolean;
  relationship?: GovernedInstitutionalRelationship;
  priorRelationship?: GovernedInstitutionalRelationship;
  inverseRelationship?: GovernedInstitutionalRelationship;
  issues: RelationshipValidationIssue[];
  events: RelationshipDomainEvent[];
}

export interface RelationshipDomainEvent {
  eventType:
    | "relationship.created"
    | "relationship.updated"
    | "relationship.activated"
    | "relationship.suspended"
    | "relationship.expired"
    | "relationship.superseded"
    | "relationship.withdrawn"
    | "relationship.archived"
    | "relationship.projection_changed"
    | "relationship.evidence_changed"
    | "relationship.authority_changed";
  relationshipId: RelationshipId;
  sourceRecordId: RecordId;
  targetRecordId: RecordId;
  relationshipType: RelationshipType;
  actorSubjectId?: SubjectId;
  occurredAt: ISODateTime;
  priorState?: Record<string, unknown>;
  newState?: Record<string, unknown>;
  authorityReference?: string;
  reason?: string;
  correlationId?: string;
  idempotencyKey?: string;
  public: boolean;
}

export interface RelationshipQuery {
  recordIds?: RecordId[];
  sourceRecordIds?: RecordId[];
  targetRecordIds?: RecordId[];
  relationshipTypes?: RelationshipType[];
  lifecycleStates?: RelationshipLifecycleState[];
  strengths?: RelationshipStrength[];
  publicOnly?: boolean;
  activeAt?: ISODateTime;
  includeExpired?: boolean;
  includeSuperseded?: boolean;
  tags?: string[];
  authorityReference?: string;
  evidenceStates?: RelationshipEvidenceState[];
  limit?: number;
  cursor?: string;
}

export interface RelationshipQueryResult {
  relationships: GovernedInstitutionalRelationship[];
  nextCursor?: string;
  total: number;
  issues: RelationshipValidationIssue[];
}

export interface RelationshipGraphNode {
  record: InstitutionalRecordSummary;
  depth: number;
  inboundCount: number;
  outboundCount: number;
  relationshipTypes: RelationshipType[];
}

export interface RelationshipGraphEdge {
  relationship: GovernedInstitutionalRelationship;
  source: InstitutionalRecordSummary;
  target: InstitutionalRecordSummary;
  directionFromRoot?: RelationshipDirection;
  depth: number;
}

export interface InstitutionalRelationshipGraph {
  rootRecordId: RecordId;
  nodes: RelationshipGraphNode[];
  edges: RelationshipGraphEdge[];
  truncated: boolean;
  maxDepth: number;
  issues: RelationshipValidationIssue[];
}

export interface RelationshipPathStep {
  relationship: GovernedInstitutionalRelationship;
  fromRecordId: RecordId;
  toRecordId: RecordId;
  direction: RelationshipDirection;
}

export interface RelationshipPath {
  startRecordId: RecordId;
  endRecordId: RecordId;
  steps: RelationshipPathStep[];
  weight: number;
}

export interface RelationshipProjection {
  relationshipId: RelationshipId;
  relationshipType: RelationshipType;
  label: string;
  inverseLabel: string;
  sourceRecordId: RecordId;
  targetRecordId: RecordId;
  lifecycleState: RelationshipLifecycleState;
  effectiveAt?: ISODateTime;
  expiresAt?: ISODateTime;
  scope?: string;
  authorityReference?: string;
  evidenceState?: RelationshipEvidenceState;
  limitations: string[];
  metadata?: Record<string, unknown>;
  projectionMode: RelationshipProjectionMode;
}

export interface RelationshipRecordLookup {
  getRecord(recordId: RecordId): Promise<InstitutionalRecordSummary | null>;
  getRecords(recordIds: RecordId[]): Promise<InstitutionalRecordSummary[]>;
}

export interface RelationshipRepository {
  getById(relationshipId: RelationshipId): Promise<GovernedInstitutionalRelationship | null>;
  find(query: RelationshipQuery): Promise<RelationshipQueryResult>;
  create(relationship: GovernedInstitutionalRelationship): Promise<GovernedInstitutionalRelationship>;
  update(relationship: GovernedInstitutionalRelationship): Promise<GovernedInstitutionalRelationship>;
}

export interface RelationshipEngineOptions {
  now?: () => Date;
  idFactory?: () => RelationshipId;
  maximumGraphDepth?: number;
  maximumGraphEdges?: number;
  maximumQueryLimit?: number;
  createInverseRelationships?: boolean;
}

// -----------------------------------------------------------------------------
// Canonical relationship vocabulary
// -----------------------------------------------------------------------------

const ANY: "ANY" = "ANY";

const ENTITY_TYPES = [
  "GOVERNANCE_ENTITY",
  "GOVERNANCE_REGISTRATION",
] as const satisfies readonly InstitutionalRecordType[];

const EVIDENCE_TYPES = [
  "EVIDENCE_PACKAGE",
  "EVIDENCE_ITEM",
  "ENVIRONMENTAL_RECORD",
  "AIR_RECORD",
  "PAIR_RECORD",
  "BUILDING_RECORD",
  "HVAC_RECORD",
  "RESEARCH_RECORD",
] as const satisfies readonly InstitutionalRecordType[];

const REVIEW_TYPES = [
  "BOUNDED_REVIEW",
  "REVIEW_FINDING",
] as const satisfies readonly InstitutionalRecordType[];

const EXECUTION_TYPES = [
  "GOVERNANCE_ROUTE",
  "EXECUTION_DETERMINATION",
  "EXECUTION_EVENT",
  "EXECUTION_ARTIFACT",
  "OUTCOME_RECORD",
] as const satisfies readonly InstitutionalRecordType[];

const CONTINUITY_TYPES = [
  "CHALLENGE",
  "CORRECTION",
  "REVALIDATION",
] as const satisfies readonly InstitutionalRecordType[];

export const RELATIONSHIP_CONTRACTS: Readonly<Record<RelationshipType, InstitutionalRelationshipContract>> = {
  owns: contract({
    relationshipType: "owns",
    label: "Owns",
    inverseLabel: "Owned by",
    description: "Attributes institutional responsibility or stewardship to a subject record.",
    sourceRecordTypes: ENTITY_TYPES,
    targetRecordTypes: ANY,
    cardinality: "ONE_TO_MANY",
    strength: "constitutive",
    cyclePolicy: "FORBID",
    requiresAuthorityReference: true,
    requiresScope: false,
    requiresEvidence: false,
    permitsSelfReference: false,
    publicByDefault: true,
    defaultProjection: "SUMMARY",
    continuitySignificant: true,
    blockingPotential: true,
    notes: ["Ownership does not imply approval, certification, or execution authority."],
  }),
  declares: contract({
    relationshipType: "declares",
    label: "Declares",
    inverseLabel: "Declared by",
    description: "Connects an attributable entity or registration to a declared claim.",
    sourceRecordTypes: ENTITY_TYPES,
    targetRecordTypes: ["DECLARED_CLAIM"],
    cardinality: "ONE_TO_MANY",
    strength: "constitutive",
    cyclePolicy: "FORBID",
    requiresAuthorityReference: false,
    requiresScope: true,
    requiresEvidence: false,
    permitsSelfReference: false,
    publicByDefault: true,
    defaultProjection: "FULL",
    continuitySignificant: true,
    blockingPotential: false,
    notes: ["A declaration is attributable but not automatically supported."],
  }),
  supported_by: contract({
    relationshipType: "supported_by",
    label: "Supported by",
    inverseLabel: "Supports",
    description: "Identifies evidence admitted or declared as support for a claim, finding, determination, or outcome.",
    sourceRecordTypes: [
      "DECLARED_CLAIM",
      "REVIEW_FINDING",
      "EXECUTION_DETERMINATION",
      "OUTCOME_RECORD",
      "REGISTRY_RECORD",
    ],
    targetRecordTypes: EVIDENCE_TYPES,
    cardinality: "MANY_TO_MANY",
    strength: "supporting",
    cyclePolicy: "FORBID",
    requiresAuthorityReference: false,
    requiresScope: true,
    requiresEvidence: false,
    permitsSelfReference: false,
    publicByDefault: true,
    defaultProjection: "SUMMARY",
    continuitySignificant: true,
    blockingPotential: true,
    notes: ["The relationship must preserve evidence state and admission boundary."],
  }),
  reviewed_in: contract({
    relationshipType: "reviewed_in",
    label: "Reviewed in",
    inverseLabel: "Reviews",
    description: "Places a record or claim inside a bounded institutional review.",
    sourceRecordTypes: ANY,
    targetRecordTypes: ["BOUNDED_REVIEW"],
    cardinality: "MANY_TO_MANY",
    strength: "governing",
    cyclePolicy: "FORBID",
    requiresAuthorityReference: true,
    requiresScope: true,
    requiresEvidence: false,
    permitsSelfReference: false,
    publicByDefault: true,
    defaultProjection: "FULL",
    continuitySignificant: true,
    blockingPotential: true,
    notes: ["Review scope and reviewer authority must remain inspectable."],
  }),
  demonstrated_by: contract({
    relationshipType: "demonstrated_by",
    label: "Demonstrated by",
    inverseLabel: "Demonstrates",
    description: "Connects a bounded capability or claim to a governed demonstration.",
    sourceRecordTypes: ["DECLARED_CLAIM", "GOVERNANCE_ENTITY", "GOVERNANCE_REGISTRATION"],
    targetRecordTypes: ["GOVERNED_DEMONSTRATION"],
    cardinality: "MANY_TO_MANY",
    strength: "supporting",
    cyclePolicy: "FORBID",
    requiresAuthorityReference: true,
    requiresScope: true,
    requiresEvidence: true,
    permitsSelfReference: false,
    publicByDefault: true,
    defaultProjection: "FULL",
    continuitySignificant: true,
    blockingPotential: false,
    notes: ["A demonstration proves only the bounded capability actually observed."],
  }),
  governed_by: contract({
    relationshipType: "governed_by",
    label: "Governed by",
    inverseLabel: "Governs",
    description: "Connects a record or activity to an applicable route, standard, law, or authority record.",
    sourceRecordTypes: ANY,
    targetRecordTypes: ["GOVERNANCE_ROUTE", "STANDARD", "LAW_RECORD", "AUTHORITY_GRANT"],
    cardinality: "MANY_TO_MANY",
    strength: "governing",
    cyclePolicy: "ALLOW_WITH_WARNING",
    requiresAuthorityReference: true,
    requiresScope: true,
    requiresEvidence: false,
    permitsSelfReference: false,
    publicByDefault: true,
    defaultProjection: "SUMMARY",
    continuitySignificant: true,
    blockingPotential: true,
    notes: ["Applicable authority must be current at the consequential moment."],
  }),
  determined_by: contract({
    relationshipType: "determined_by",
    label: "Determined by",
    inverseLabel: "Determines",
    description: "Connects a governed question, route, or review to its committed determination.",
    sourceRecordTypes: ["BOUNDED_REVIEW", "GOVERNANCE_ROUTE", "GOVERNED_DEMONSTRATION"],
    targetRecordTypes: ["EXECUTION_DETERMINATION"],
    cardinality: "MANY_TO_ONE",
    strength: "constitutive",
    cyclePolicy: "FORBID",
    requiresAuthorityReference: true,
    requiresScope: true,
    requiresEvidence: true,
    permitsSelfReference: false,
    publicByDefault: true,
    defaultProjection: "FULL",
    continuitySignificant: true,
    blockingPotential: true,
    notes: ["Finding and execution determination remain separate concepts."],
  }),
  executed_through: contract({
    relationshipType: "executed_through",
    label: "Executed through",
    inverseLabel: "Executes",
    description: "Connects a determination to the governed route or execution event that enforced it.",
    sourceRecordTypes: ["EXECUTION_DETERMINATION"],
    targetRecordTypes: ["GOVERNANCE_ROUTE", "EXECUTION_EVENT"],
    cardinality: "ONE_TO_MANY",
    strength: "constitutive",
    cyclePolicy: "FORBID",
    requiresAuthorityReference: true,
    requiresScope: true,
    requiresEvidence: true,
    permitsSelfReference: false,
    publicByDefault: true,
    defaultProjection: "FULL",
    continuitySignificant: true,
    blockingPotential: true,
    notes: ["Execution correspondence must not be inferred solely from a determination."],
  }),
  produced: contract({
    relationshipType: "produced",
    label: "Produced",
    inverseLabel: "Produced by",
    description: "Connects a governed process to the artifact or record it generated.",
    sourceRecordTypes: [
      "GOVERNANCE_ROUTE",
      "GOVERNED_DEMONSTRATION",
      "BOUNDED_REVIEW",
      "EXECUTION_EVENT",
      "COMMERCIAL_SCOPE",
    ],
    targetRecordTypes: [
      "EXECUTION_ARTIFACT",
      "REGISTRY_RECORD",
      "PUBLICATION",
      "REVIEW_FINDING",
      "ACTION_REQUIREMENT",
    ],
    cardinality: "ONE_TO_MANY",
    strength: "constitutive",
    cyclePolicy: "FORBID",
    requiresAuthorityReference: false,
    requiresScope: true,
    requiresEvidence: false,
    permitsSelfReference: false,
    publicByDefault: true,
    defaultProjection: "FULL",
    continuitySignificant: true,
    blockingPotential: false,
    notes: ["Generated records must preserve source versions and correlation identifiers."],
  }),
  registered_as: contract({
    relationshipType: "registered_as",
    label: "Registered as",
    inverseLabel: "Registers",
    description: "Connects a source institutional record to its Registry projection or registration record.",
    sourceRecordTypes: ANY,
    targetRecordTypes: ["REGISTRY_RECORD", "GOVERNANCE_REGISTRATION"],
    cardinality: "ONE_TO_MANY",
    strength: "constitutive",
    cyclePolicy: "FORBID",
    requiresAuthorityReference: true,
    requiresScope: false,
    requiresEvidence: false,
    permitsSelfReference: false,
    publicByDefault: true,
    defaultProjection: "REFERENCE_ONLY",
    continuitySignificant: true,
    blockingPotential: false,
    notes: ["Registry projection does not change the evidentiary meaning of the source record."],
  }),
  verified_by: contract({
    relationshipType: "verified_by",
    label: "Verified by",
    inverseLabel: "Verifies",
    description: "Connects an outcome, artifact, or integrity assertion to verifying evidence or authority.",
    sourceRecordTypes: ["OUTCOME_RECORD", "EXECUTION_ARTIFACT", "REGISTRY_RECORD"],
    targetRecordTypes: [...EVIDENCE_TYPES, "AUTHORITY_GRANT", "ACADEMY_CREDENTIAL"],
    cardinality: "MANY_TO_MANY",
    strength: "supporting",
    cyclePolicy: "FORBID",
    requiresAuthorityReference: true,
    requiresScope: true,
    requiresEvidence: true,
    permitsSelfReference: false,
    publicByDefault: true,
    defaultProjection: "SUMMARY",
    continuitySignificant: true,
    blockingPotential: true,
    notes: ["Verification must identify the observed reality and permitted inference."],
  }),
  challenged_by: contract({
    relationshipType: "challenged_by",
    label: "Challenged by",
    inverseLabel: "Challenges",
    description: "Connects any challengeable institutional record to a preserved challenge record.",
    sourceRecordTypes: ANY,
    targetRecordTypes: ["CHALLENGE"],
    cardinality: "ONE_TO_MANY",
    strength: "governing",
    cyclePolicy: "FORBID",
    requiresAuthorityReference: false,
    requiresScope: true,
    requiresEvidence: false,
    permitsSelfReference: false,
    publicByDefault: true,
    defaultProjection: "FULL",
    continuitySignificant: true,
    blockingPotential: true,
    notes: ["A challenge is a new attributable record, not an in-place edit."],
  }),
  corrected_by: contract({
    relationshipType: "corrected_by",
    label: "Corrected by",
    inverseLabel: "Corrects",
    description: "Connects an earlier record to a later correction record or corrected version.",
    sourceRecordTypes: ANY,
    targetRecordTypes: ["CORRECTION", ...CONTINUITY_TYPES, "CUSTOM"],
    cardinality: "ONE_TO_MANY",
    strength: "constitutive",
    cyclePolicy: "FORBID",
    requiresAuthorityReference: true,
    requiresScope: true,
    requiresEvidence: true,
    permitsSelfReference: false,
    publicByDefault: true,
    defaultProjection: "FULL",
    continuitySignificant: true,
    blockingPotential: true,
    notes: ["Correction creates a new current state and never rewrites the past."],
  }),
  supersedes: contract({
    relationshipType: "supersedes",
    label: "Supersedes",
    inverseLabel: "Superseded by",
    description: "Declares that the source record becomes current in place of the target record.",
    sourceRecordTypes: ANY,
    targetRecordTypes: ANY,
    cardinality: "ONE_TO_MANY",
    strength: "constitutive",
    cyclePolicy: "FORBID",
    requiresAuthorityReference: true,
    requiresScope: true,
    requiresEvidence: false,
    permitsSelfReference: false,
    publicByDefault: true,
    defaultProjection: "FULL",
    continuitySignificant: true,
    blockingPotential: true,
    inverseRelationshipType: "superseded_by",
    notes: ["Source and target should normally share record family or explicit migration rationale."],
  }),
  superseded_by: contract({
    relationshipType: "superseded_by",
    label: "Superseded by",
    inverseLabel: "Supersedes",
    description: "Inverse continuity edge showing the record that replaced the source.",
    sourceRecordTypes: ANY,
    targetRecordTypes: ANY,
    cardinality: "MANY_TO_ONE",
    strength: "constitutive",
    cyclePolicy: "FORBID",
    requiresAuthorityReference: true,
    requiresScope: true,
    requiresEvidence: false,
    permitsSelfReference: false,
    publicByDefault: true,
    defaultProjection: "FULL",
    continuitySignificant: true,
    blockingPotential: true,
    inverseRelationshipType: "supersedes",
    notes: ["Normally generated as the explicit inverse of supersedes."],
  }),
  revalidates: contract({
    relationshipType: "revalidates",
    label: "Revalidates",
    inverseLabel: "Revalidated by",
    description: "Connects a revalidation record to the institutional record it reassesses after material change.",
    sourceRecordTypes: ["REVALIDATION"],
    targetRecordTypes: ANY,
    cardinality: "ONE_TO_MANY",
    strength: "governing",
    cyclePolicy: "FORBID",
    requiresAuthorityReference: true,
    requiresScope: true,
    requiresEvidence: true,
    permitsSelfReference: false,
    publicByDefault: true,
    defaultProjection: "FULL",
    continuitySignificant: true,
    blockingPotential: true,
    notes: ["Revalidation must preserve the changed element and affected claim boundary."],
  }),
  requires: contract({
    relationshipType: "requires",
    label: "Requires",
    inverseLabel: "Required by",
    description: "Declares a blocking or prerequisite dependency between institutional records.",
    sourceRecordTypes: ANY,
    targetRecordTypes: ANY,
    cardinality: "MANY_TO_MANY",
    strength: "blocking",
    cyclePolicy: "FORBID",
    requiresAuthorityReference: false,
    requiresScope: true,
    requiresEvidence: false,
    permitsSelfReference: false,
    publicByDefault: false,
    defaultProjection: "SUMMARY",
    continuitySignificant: true,
    blockingPotential: true,
    notes: ["Dependency cycles are rejected because they can deadlock institutional work."],
  }),
  authorized_by: contract({
    relationshipType: "authorized_by",
    label: "Authorized by",
    inverseLabel: "Authorizes",
    description: "Connects an action, assignment, review, route, or execution to a bounded authority grant.",
    sourceRecordTypes: ANY,
    targetRecordTypes: ["AUTHORITY_GRANT"],
    cardinality: "MANY_TO_MANY",
    strength: "governing",
    cyclePolicy: "FORBID",
    requiresAuthorityReference: true,
    requiresScope: true,
    requiresEvidence: false,
    permitsSelfReference: false,
    publicByDefault: true,
    defaultProjection: "SUMMARY",
    continuitySignificant: true,
    blockingPotential: true,
    notes: ["Authority grants are narrower than general competence credentials."],
  }),
  credentialed_by: contract({
    relationshipType: "credentialed_by",
    label: "Credentialed by",
    inverseLabel: "Credentials",
    description: "Connects an appointment, grant, or subject record to evidence of bounded competence.",
    sourceRecordTypes: ["AUTHORITY_GRANT", "PARTNER_ASSIGNMENT", "BOUNDED_REVIEW"],
    targetRecordTypes: ["ACADEMY_CREDENTIAL"],
    cardinality: "MANY_TO_MANY",
    strength: "supporting",
    cyclePolicy: "FORBID",
    requiresAuthorityReference: false,
    requiresScope: true,
    requiresEvidence: true,
    permitsSelfReference: false,
    publicByDefault: true,
    defaultProjection: "SUMMARY",
    continuitySignificant: true,
    blockingPotential: true,
    notes: ["Credential validity does not itself create an appointment."],
  }),
  scoped_by: contract({
    relationshipType: "scoped_by",
    label: "Scoped by",
    inverseLabel: "Scopes",
    description: "Connects institutional work to the commercial or review scope that bounded it.",
    sourceRecordTypes: ANY,
    targetRecordTypes: ["COMMERCIAL_SCOPE"],
    cardinality: "MANY_TO_ONE",
    strength: "governing",
    cyclePolicy: "FORBID",
    requiresAuthorityReference: false,
    requiresScope: false,
    requiresEvidence: false,
    permitsSelfReference: false,
    publicByDefault: false,
    defaultProjection: "REFERENCE_ONLY",
    continuitySignificant: true,
    blockingPotential: true,
    notes: ["Scope records bind deliverables and exclusions, not review outcomes."],
  }),
  paid_by: contract({
    relationshipType: "paid_by",
    label: "Paid by",
    inverseLabel: "Pays for",
    description: "Connects a governed scope or fulfillment record to its payment record.",
    sourceRecordTypes: ["COMMERCIAL_SCOPE", "PARTNER_ASSIGNMENT"],
    targetRecordTypes: ["PAYMENT_RECORD"],
    cardinality: "ONE_TO_MANY",
    strength: "informational",
    cyclePolicy: "FORBID",
    requiresAuthorityReference: false,
    requiresScope: false,
    requiresEvidence: false,
    permitsSelfReference: false,
    publicByDefault: false,
    defaultProjection: "REFERENCE_ONLY",
    continuitySignificant: true,
    blockingPotential: false,
    notes: ["Payment never creates approval, admissibility, authority, or favorable determination."],
  }),
  assigned_to: contract({
    relationshipType: "assigned_to",
    label: "Assigned to",
    inverseLabel: "Assigned work",
    description: "Connects an institutional action, review, or partner assignment to an accountable assignment record.",
    sourceRecordTypes: ["ACTION_REQUIREMENT", "BOUNDED_REVIEW", "PARTNER_ASSIGNMENT"],
    targetRecordTypes: ["PARTNER_ASSIGNMENT", "AUTHORITY_GRANT", "GOVERNANCE_ENTITY"],
    cardinality: "MANY_TO_MANY",
    strength: "governing",
    cyclePolicy: "ALLOW_WITH_WARNING",
    requiresAuthorityReference: true,
    requiresScope: true,
    requiresEvidence: false,
    permitsSelfReference: false,
    publicByDefault: false,
    defaultProjection: "SUMMARY",
    continuitySignificant: false,
    blockingPotential: true,
    notes: ["The responsible human or organization remains represented through subject identity."],
  }),
  published_as: contract({
    relationshipType: "published_as",
    label: "Published as",
    inverseLabel: "Publishes",
    description: "Connects a governed source record to an institutional publication or public projection.",
    sourceRecordTypes: ANY,
    targetRecordTypes: ["PUBLICATION", "REGISTRY_RECORD", "RESEARCH_RECORD"],
    cardinality: "ONE_TO_MANY",
    strength: "informational",
    cyclePolicy: "FORBID",
    requiresAuthorityReference: true,
    requiresScope: true,
    requiresEvidence: false,
    permitsSelfReference: false,
    publicByDefault: true,
    defaultProjection: "FULL",
    continuitySignificant: true,
    blockingPotential: false,
    notes: ["Publication permissions and confidentiality boundaries remain separate from evidentiary support."],
  }),
  derived_from: contract({
    relationshipType: "derived_from",
    label: "Derived from",
    inverseLabel: "Source for",
    description: "Connects a record to source records from which its content or calculation was derived.",
    sourceRecordTypes: ANY,
    targetRecordTypes: ANY,
    cardinality: "MANY_TO_MANY",
    strength: "supporting",
    cyclePolicy: "FORBID",
    requiresAuthorityReference: false,
    requiresScope: true,
    requiresEvidence: false,
    permitsSelfReference: false,
    publicByDefault: true,
    defaultProjection: "SUMMARY",
    continuitySignificant: true,
    blockingPotential: false,
    notes: ["Derivation must identify source versions and transformation method in metadata."],
  }),
  references: contract({
    relationshipType: "references",
    label: "References",
    inverseLabel: "Referenced by",
    description: "Creates a non-governing citation or contextual reference between records.",
    sourceRecordTypes: ANY,
    targetRecordTypes: ANY,
    cardinality: "MANY_TO_MANY",
    strength: "informational",
    cyclePolicy: "ALLOW",
    requiresAuthorityReference: false,
    requiresScope: false,
    requiresEvidence: false,
    permitsSelfReference: false,
    publicByDefault: true,
    defaultProjection: "REFERENCE_ONLY",
    continuitySignificant: false,
    blockingPotential: false,
    notes: ["A reference does not imply support, review, adoption, or authority."],
  }),
  applies_to: contract({
    relationshipType: "applies_to",
    label: "Applies to",
    inverseLabel: "Governed by applicability",
    description: "Connects a law, standard, authority, policy, or rule to the records within its bounded applicability.",
    sourceRecordTypes: ["STANDARD", "LAW_RECORD", "AUTHORITY_GRANT", "RESEARCH_RECORD"],
    targetRecordTypes: ANY,
    cardinality: "MANY_TO_MANY",
    strength: "governing",
    cyclePolicy: "ALLOW_WITH_WARNING",
    requiresAuthorityReference: true,
    requiresScope: true,
    requiresEvidence: false,
    permitsSelfReference: false,
    publicByDefault: true,
    defaultProjection: "SUMMARY",
    continuitySignificant: true,
    blockingPotential: true,
    notes: ["Applicability requires jurisdiction, subject, temporal, and scope analysis."],
  }),
  related_to: contract({
    relationshipType: "related_to",
    label: "Related to",
    inverseLabel: "Related to",
    description: "Fallback symmetric relationship for contextual association when no stronger canonical edge applies.",
    sourceRecordTypes: ANY,
    targetRecordTypes: ANY,
    cardinality: "MANY_TO_MANY",
    strength: "informational",
    cyclePolicy: "ALLOW",
    requiresAuthorityReference: false,
    requiresScope: false,
    requiresEvidence: false,
    permitsSelfReference: false,
    publicByDefault: true,
    defaultProjection: "REFERENCE_ONLY",
    continuitySignificant: false,
    blockingPotential: false,
    notes: ["Use only when no more precise canonical relationship is available."],
  }),
};

// -----------------------------------------------------------------------------
// Relationship engine
// -----------------------------------------------------------------------------

export class InstitutionalRelationshipEngine {
  private readonly repository: RelationshipRepository;
  private readonly records: RelationshipRecordLookup;
  private readonly now: () => Date;
  private readonly idFactory: () => RelationshipId;
  private readonly maximumGraphDepth: number;
  private readonly maximumGraphEdges: number;
  private readonly maximumQueryLimit: number;
  private readonly createInverseRelationships: boolean;

  constructor(
    repository: RelationshipRepository,
    records: RelationshipRecordLookup,
    options: RelationshipEngineOptions = {},
  ) {
    this.repository = repository;
    this.records = records;
    this.now = options.now ?? (() => new Date());
    this.idFactory = options.idFactory ?? defaultRelationshipIdFactory;
    this.maximumGraphDepth = clampInteger(options.maximumGraphDepth ?? 6, 1, 20);
    this.maximumGraphEdges = clampInteger(options.maximumGraphEdges ?? 500, 10, 10_000);
    this.maximumQueryLimit = clampInteger(options.maximumQueryLimit ?? 500, 10, 5_000);
    this.createInverseRelationships = options.createInverseRelationships ?? false;
  }

  getContract(relationshipType: RelationshipType): InstitutionalRelationshipContract {
    return RELATIONSHIP_CONTRACTS[relationshipType];
  }

  async create(input: RelationshipCreateInput): Promise<RelationshipMutationResult> {
    const createdAt = normalizeIso(input.createdAt ?? this.now().toISOString());
    const contractDefinition = this.getContract(input.relationshipType);
    const issues = validateCreateInput(input, contractDefinition, createdAt);

    const [source, target] = await Promise.all([
      this.records.getRecord(input.sourceRecordId),
      this.records.getRecord(input.targetRecordId),
    ]);

    issues.push(...validateRecordsAgainstInput(input, source, target));

    if (hasErrors(issues)) {
      return { ok: false, issues, events: [] };
    }

    const duplicateResult = await this.repository.find({
      sourceRecordIds: [input.sourceRecordId],
      targetRecordIds: [input.targetRecordId],
      relationshipTypes: [input.relationshipType],
      includeExpired: true,
      includeSuperseded: true,
      limit: this.maximumQueryLimit,
    });

    const duplicate = duplicateResult.relationships.find((item) =>
      item.lifecycleState !== "withdrawn" && item.lifecycleState !== "archived",
    );

    if (duplicate) {
      issues.push(issue(
        "RELATIONSHIP_DUPLICATE",
        "error",
        `An active ${input.relationshipType} relationship already exists between the selected records.`,
        false,
        { relationshipId: duplicate.relationshipId, sourceRecordId: input.sourceRecordId, targetRecordId: input.targetRecordId },
      ));
      return { ok: false, issues, events: [] };
    }

    if (contractDefinition.cyclePolicy !== "ALLOW") {
      const wouldCycle = await this.wouldCreateCycle(input.sourceRecordId, input.targetRecordId, input.relationshipType);
      if (wouldCycle) {
        issues.push(issue(
          "RELATIONSHIP_CYCLE",
          contractDefinition.cyclePolicy === "FORBID" ? "error" : "warning",
          `Creating ${input.relationshipType} would introduce a cycle in the governed graph.`,
          contractDefinition.cyclePolicy !== "FORBID",
          { sourceRecordId: input.sourceRecordId, targetRecordId: input.targetRecordId },
        ));
      }
    }

    if (hasErrors(issues)) {
      return { ok: false, issues, events: [] };
    }

    const relationship = buildRelationship(input, contractDefinition, createdAt, this.idFactory());
    const persisted = await this.repository.create(relationship);
    const events = [buildEvent("relationship.created", persisted, input.createdBy, createdAt, undefined, snapshot(persisted), input.authorityReference, "Relationship created")];

    let inverseRelationship: GovernedInstitutionalRelationship | undefined;
    if (this.createInverseRelationships && contractDefinition.inverseRelationshipType) {
      const inverseContract = this.getContract(contractDefinition.inverseRelationshipType);
      const inverse = buildRelationship(
        {
          ...input,
          relationshipType: contractDefinition.inverseRelationshipType,
          sourceRecordId: input.targetRecordId,
          targetRecordId: input.sourceRecordId,
          sourceRecordType: input.targetRecordType,
          targetRecordType: input.sourceRecordType,
          metadata: {
            ...(input.metadata ?? {}),
            generatedInverseOf: persisted.relationshipId,
          },
          idempotencyKey: input.idempotencyKey ? `${input.idempotencyKey}:inverse` : undefined,
        },
        inverseContract,
        createdAt,
        this.idFactory(),
      );
      inverseRelationship = await this.repository.create(inverse);
      events.push(buildEvent("relationship.created", inverseRelationship, input.createdBy, createdAt, undefined, snapshot(inverseRelationship), input.authorityReference, "Generated inverse relationship"));
    }

    return {
      ok: true,
      relationship: persisted,
      inverseRelationship,
      issues,
      events,
    };
  }

  async update(input: RelationshipUpdateInput): Promise<RelationshipMutationResult> {
    const existing = await this.repository.getById(input.relationshipId);
    if (!existing) {
      return {
        ok: false,
        issues: [issue("RELATIONSHIP_NOT_FOUND", "error", "The relationship could not be found.", false, { relationshipId: input.relationshipId })],
        events: [],
      };
    }

    if (existing.version !== input.expectedVersion) {
      return {
        ok: false,
        issues: [issue(
          "RELATIONSHIP_VERSION_CONFLICT",
          "error",
          `Expected relationship version ${input.expectedVersion}, but current version is ${existing.version}.`,
          true,
          { relationshipId: existing.relationshipId },
        )],
        events: [],
      };
    }

    const changedAt = normalizeIso(input.changedAt ?? this.now().toISOString());
    const updated = applyUpdate(existing, input, changedAt);
    const contractDefinition = this.getContract(updated.relationshipType);
    const issues = validateGovernedRelationship(updated, contractDefinition, changedAt);

    if (hasErrors(issues)) {
      return { ok: false, priorRelationship: existing, issues, events: [] };
    }

    const persisted = await this.repository.update(updated);
    const events = buildUpdateEvents(existing, persisted, input, changedAt);

    return {
      ok: true,
      relationship: persisted,
      priorRelationship: existing,
      issues,
      events,
    };
  }

  async query(query: RelationshipQuery): Promise<RelationshipQueryResult> {
    const normalized: RelationshipQuery = {
      ...query,
      limit: clampInteger(query.limit ?? 100, 1, this.maximumQueryLimit),
      includeExpired: query.includeExpired ?? false,
      includeSuperseded: query.includeSuperseded ?? false,
    };
    const result = await this.repository.find(normalized);
    return {
      ...result,
      relationships: result.relationships
        .filter((item) => normalized.includeExpired || item.lifecycleState !== "expired")
        .filter((item) => normalized.includeSuperseded || item.lifecycleState !== "superseded")
        .sort(compareRelationships),
    };
  }

  async resolveForRecord(
    record: InstitutionalRecordSummary,
    authority: AuthorityContext,
    options: {
      includeInbound?: boolean;
      includeOutbound?: boolean;
      activeAt?: ISODateTime;
      includeExpired?: boolean;
      includeSuperseded?: boolean;
    } = {},
  ): Promise<ResolvedRelationship[]> {
    const includeInbound = options.includeInbound ?? true;
    const includeOutbound = options.includeOutbound ?? true;
    const result = await this.query({
      recordIds: [record.identity.recordId],
      activeAt: options.activeAt,
      includeExpired: options.includeExpired,
      includeSuperseded: options.includeSuperseded,
      limit: this.maximumQueryLimit,
    });

    const relatedIds = unique(result.relationships.flatMap((item) => [item.sourceRecordId, item.targetRecordId]))
      .filter((recordId) => recordId !== record.identity.recordId);
    const relatedRecords = await this.records.getRecords(relatedIds);
    const recordMap = new Map(relatedRecords.map((item) => [item.identity.recordId, item]));

    const resolved: ResolvedRelationship[] = [];
    for (const relationship of result.relationships) {
      const outbound = relationship.sourceRecordId === record.identity.recordId;
      if (outbound && !includeOutbound) continue;
      if (!outbound && !includeInbound) continue;
      if (!canProjectRelationship(relationship, authority, record.identity.recordId, this.now())) continue;

      const relatedRecordId = outbound ? relationship.targetRecordId : relationship.sourceRecordId;
      const relatedRecord = recordMap.get(relatedRecordId);
      if (!relatedRecord) continue;

      resolved.push({
        relationship: toResolverRelationship(relationship),
        direction: outbound ? "OUTBOUND" : "INBOUND",
        relatedRecord,
      });
    }

    return resolved.sort(compareResolvedRelationships);
  }

  async buildGraph(
    rootRecordId: RecordId,
    authority: AuthorityContext,
    options: {
      maxDepth?: number;
      relationshipTypes?: RelationshipType[];
      includeExpired?: boolean;
      includeSuperseded?: boolean;
      direction?: "BOTH" | RelationshipDirection;
    } = {},
  ): Promise<InstitutionalRelationshipGraph> {
    const maxDepth = clampInteger(options.maxDepth ?? 3, 1, this.maximumGraphDepth);
    const direction = options.direction ?? "BOTH";
    const root = await this.records.getRecord(rootRecordId);
    if (!root) {
      return {
        rootRecordId,
        nodes: [],
        edges: [],
        truncated: false,
        maxDepth,
        issues: [issue("GRAPH_ROOT_NOT_FOUND", "error", "The graph root record could not be resolved.", false, { sourceRecordId: rootRecordId })],
      };
    }

    const nodeMap = new Map<RecordId, RelationshipGraphNode>();
    const edgeMap = new Map<RelationshipId, RelationshipGraphEdge>();
    const queue: Array<{ record: InstitutionalRecordSummary; depth: number }> = [{ record: root, depth: 0 }];
    const expandedAtDepth = new Map<RecordId, number>();
    let truncated = false;

    nodeMap.set(rootRecordId, {
      record: root,
      depth: 0,
      inboundCount: 0,
      outboundCount: 0,
      relationshipTypes: [],
    });

    while (queue.length > 0) {
      const current = queue.shift();
      if (!current) break;
      if (current.depth >= maxDepth) continue;
      const priorDepth = expandedAtDepth.get(current.record.identity.recordId);
      if (priorDepth !== undefined && priorDepth <= current.depth) continue;
      expandedAtDepth.set(current.record.identity.recordId, current.depth);

      const resolved = await this.resolveForRecord(current.record, authority, {
        includeInbound: direction !== "OUTBOUND",
        includeOutbound: direction !== "INBOUND",
        includeExpired: options.includeExpired,
        includeSuperseded: options.includeSuperseded,
      });

      for (const item of resolved) {
        if (options.relationshipTypes && !options.relationshipTypes.includes(item.relationship.relationshipType)) continue;
        const governed = await this.repository.getById(item.relationship.relationshipId);
        if (!governed) continue;
        if (edgeMap.has(governed.relationshipId)) continue;
        if (edgeMap.size >= this.maximumGraphEdges) {
          truncated = true;
          break;
        }

        const source = governed.sourceRecordId === current.record.identity.recordId
          ? current.record
          : item.relatedRecord;
        const target = governed.targetRecordId === current.record.identity.recordId
          ? current.record
          : item.relatedRecord;
        const depth = current.depth + 1;

        edgeMap.set(governed.relationshipId, {
          relationship: governed,
          source,
          target,
          directionFromRoot: item.direction,
          depth,
        });

        upsertGraphNode(nodeMap, source, source.identity.recordId === rootRecordId ? 0 : depth, governed.relationshipType, "OUTBOUND");
        upsertGraphNode(nodeMap, target, target.identity.recordId === rootRecordId ? 0 : depth, governed.relationshipType, "INBOUND");

        if (depth < maxDepth) {
          queue.push({ record: item.relatedRecord, depth });
        }
      }
      if (truncated) break;
    }

    return {
      rootRecordId,
      nodes: [...nodeMap.values()].sort((a, b) => a.depth - b.depth || a.record.identity.institutionalId.localeCompare(b.record.identity.institutionalId)),
      edges: [...edgeMap.values()].sort((a, b) => a.depth - b.depth || compareRelationships(a.relationship, b.relationship)),
      truncated,
      maxDepth,
      issues: truncated
        ? [issue("GRAPH_TRUNCATED", "warning", `The graph exceeded ${this.maximumGraphEdges} edges and was truncated.`, true, { sourceRecordId: rootRecordId })]
        : [],
    };
  }

  async findShortestPath(
    startRecordId: RecordId,
    endRecordId: RecordId,
    authority: AuthorityContext,
    options: {
      relationshipTypes?: RelationshipType[];
      maxDepth?: number;
      includeExpired?: boolean;
      includeSuperseded?: boolean;
    } = {},
  ): Promise<RelationshipPath | null> {
    if (startRecordId === endRecordId) {
      return { startRecordId, endRecordId, steps: [], weight: 0 };
    }

    const maxDepth = clampInteger(options.maxDepth ?? 6, 1, this.maximumGraphDepth);
    const start = await this.records.getRecord(startRecordId);
    if (!start) return null;

    const queue: Array<{ record: InstitutionalRecordSummary; steps: RelationshipPathStep[] }> = [{ record: start, steps: [] }];
    const visited = new Set<RecordId>([startRecordId]);

    while (queue.length > 0) {
      const current = queue.shift();
      if (!current) break;
      if (current.steps.length >= maxDepth) continue;

      const related = await this.resolveForRecord(current.record, authority, {
        includeInbound: true,
        includeOutbound: true,
        includeExpired: options.includeExpired,
        includeSuperseded: options.includeSuperseded,
      });

      for (const item of related) {
        if (options.relationshipTypes && !options.relationshipTypes.includes(item.relationship.relationshipType)) continue;
        const governed = await this.repository.getById(item.relationship.relationshipId);
        if (!governed) continue;
        const nextId = item.relatedRecord.identity.recordId;
        const step: RelationshipPathStep = {
          relationship: governed,
          fromRecordId: current.record.identity.recordId,
          toRecordId: nextId,
          direction: item.direction,
        };
        const steps = [...current.steps, step];
        if (nextId === endRecordId) {
          return { startRecordId, endRecordId, steps, weight: calculatePathWeight(steps) };
        }
        if (!visited.has(nextId)) {
          visited.add(nextId);
          queue.push({ record: item.relatedRecord, steps });
        }
      }
    }

    return null;
  }

  async wouldCreateCycle(
    sourceRecordId: RecordId,
    targetRecordId: RecordId,
    relationshipType: RelationshipType,
  ): Promise<boolean> {
    if (sourceRecordId === targetRecordId) return true;
    const contractDefinition = this.getContract(relationshipType);
    if (contractDefinition.cyclePolicy === "ALLOW") return false;

    const anonymousAuthority: AuthorityContext = {
      audience: "SERVICE",
      organizationIds: [],
      roleCodes: [],
      authorityGrantIds: [],
      credentialIds: [],
      assignedRecordIds: [],
      conflictRecordIds: [],
      serviceRole: true,
      requestedAt: this.now().toISOString(),
    };
    const path = await this.findShortestPath(targetRecordId, sourceRecordId, anonymousAuthority, {
      relationshipTypes: cycleRelevantTypes(relationshipType),
      maxDepth: this.maximumGraphDepth,
      includeExpired: false,
      includeSuperseded: false,
    });
    return path !== null;
  }

  project(
    relationship: GovernedInstitutionalRelationship,
    authority: AuthorityContext,
    perspectiveRecordId?: RecordId,
  ): RelationshipProjection | null {
    if (!canProjectRelationship(relationship, authority, perspectiveRecordId, this.now())) return null;
    const contractDefinition = this.getContract(relationship.relationshipType);
    const privileged = hasPrivilegedRelationshipAccess(relationship, authority);
    const mode = privileged ? relationship.visibility.projectionMode : publicProjectionMode(relationship);
    if (mode === "HIDDEN") return null;

    const metadata = mode === "FULL"
      ? redactMetadata(relationship.metadata, relationship.visibility.redactedMetadataFields)
      : mode === "SUMMARY"
        ? summarizeMetadata(relationship.metadata, relationship.visibility.redactedMetadataFields)
        : undefined;

    return {
      relationshipId: relationship.relationshipId,
      relationshipType: relationship.relationshipType,
      label: contractDefinition.label,
      inverseLabel: contractDefinition.inverseLabel,
      sourceRecordId: relationship.sourceRecordId,
      targetRecordId: relationship.targetRecordId,
      lifecycleState: relationship.lifecycleState,
      effectiveAt: relationship.effectiveAt,
      expiresAt: relationship.expiresAt,
      scope: mode === "REFERENCE_ONLY" ? undefined : relationship.scope,
      authorityReference: privileged || relationship.public ? relationship.authorityReference : undefined,
      evidenceState: mode === "FULL" || mode === "SUMMARY" ? relationship.evidence.state : undefined,
      limitations: mode === "REFERENCE_ONLY" ? [] : [...relationship.limitations],
      metadata,
      projectionMode: mode,
    };
  }
}

// -----------------------------------------------------------------------------
// In-memory repository for tests, demonstrations, and incremental migration
// -----------------------------------------------------------------------------

export class InMemoryRelationshipRepository implements RelationshipRepository {
  private readonly relationships = new Map<RelationshipId, GovernedInstitutionalRelationship>();

  constructor(seed: GovernedInstitutionalRelationship[] = []) {
    for (const relationship of seed) {
      this.relationships.set(relationship.relationshipId, cloneRelationship(relationship));
    }
  }

  async getById(relationshipId: RelationshipId): Promise<GovernedInstitutionalRelationship | null> {
    const relationship = this.relationships.get(relationshipId);
    return relationship ? cloneRelationship(relationship) : null;
  }

  async find(query: RelationshipQuery): Promise<RelationshipQueryResult> {
    let values = [...this.relationships.values()];
    const activeAt = query.activeAt ? Date.parse(query.activeAt) : undefined;

    if (query.recordIds?.length) {
      const ids = new Set(query.recordIds);
      values = values.filter((item) => ids.has(item.sourceRecordId) || ids.has(item.targetRecordId));
    }
    if (query.sourceRecordIds?.length) {
      const ids = new Set(query.sourceRecordIds);
      values = values.filter((item) => ids.has(item.sourceRecordId));
    }
    if (query.targetRecordIds?.length) {
      const ids = new Set(query.targetRecordIds);
      values = values.filter((item) => ids.has(item.targetRecordId));
    }
    if (query.relationshipTypes?.length) {
      const types = new Set(query.relationshipTypes);
      values = values.filter((item) => types.has(item.relationshipType));
    }
    if (query.lifecycleStates?.length) {
      const states = new Set(query.lifecycleStates);
      values = values.filter((item) => states.has(item.lifecycleState));
    }
    if (query.strengths?.length) {
      const strengths = new Set(query.strengths);
      values = values.filter((item) => strengths.has(item.strength));
    }
    if (query.evidenceStates?.length) {
      const states = new Set(query.evidenceStates);
      values = values.filter((item) => states.has(item.evidence.state));
    }
    if (query.publicOnly) values = values.filter((item) => item.public && item.visibility.public);
    if (!query.includeExpired) values = values.filter((item) => item.lifecycleState !== "expired");
    if (!query.includeSuperseded) values = values.filter((item) => item.lifecycleState !== "superseded");
    if (query.tags?.length) {
      const tags = new Set(query.tags);
      values = values.filter((item) => item.tags.some((tag) => tags.has(tag)));
    }
    if (query.authorityReference) values = values.filter((item) => item.authorityReference === query.authorityReference);
    if (activeAt !== undefined && Number.isFinite(activeAt)) {
      values = values.filter((item) => {
        const effective = item.effectiveAt ? Date.parse(item.effectiveAt) : Number.NEGATIVE_INFINITY;
        const expires = item.expiresAt ? Date.parse(item.expiresAt) : Number.POSITIVE_INFINITY;
        return effective <= activeAt && activeAt < expires;
      });
    }

    values.sort(compareRelationships);
    const total = values.length;
    const offset = decodeCursor(query.cursor);
    const limit = clampInteger(query.limit ?? 100, 1, 5_000);
    const page = values.slice(offset, offset + limit).map(cloneRelationship);
    const nextCursor = offset + limit < total ? encodeCursor(offset + limit) : undefined;
    return { relationships: page, nextCursor, total, issues: [] };
  }

  async create(relationship: GovernedInstitutionalRelationship): Promise<GovernedInstitutionalRelationship> {
    if (this.relationships.has(relationship.relationshipId)) {
      throw new Error(`Relationship ${relationship.relationshipId} already exists.`);
    }
    const clone = cloneRelationship(relationship);
    this.relationships.set(clone.relationshipId, clone);
    return cloneRelationship(clone);
  }

  async update(relationship: GovernedInstitutionalRelationship): Promise<GovernedInstitutionalRelationship> {
    const current = this.relationships.get(relationship.relationshipId);
    if (!current) throw new Error(`Relationship ${relationship.relationshipId} does not exist.`);
    if (relationship.version <= current.version) {
      throw new Error(`Relationship ${relationship.relationshipId} version must increase.`);
    }
    const clone = cloneRelationship(relationship);
    this.relationships.set(clone.relationshipId, clone);
    return cloneRelationship(clone);
  }

  snapshot(): GovernedInstitutionalRelationship[] {
    return [...this.relationships.values()].map(cloneRelationship).sort(compareRelationships);
  }
}

export class InMemoryRelationshipRecordLookup implements RelationshipRecordLookup {
  private readonly records = new Map<RecordId, InstitutionalRecordSummary>();

  constructor(records: InstitutionalRecordSummary[] = []) {
    for (const record of records) this.records.set(record.identity.recordId, cloneRecordSummary(record));
  }

  async getRecord(recordId: RecordId): Promise<InstitutionalRecordSummary | null> {
    const record = this.records.get(recordId);
    return record ? cloneRecordSummary(record) : null;
  }

  async getRecords(recordIds: RecordId[]): Promise<InstitutionalRecordSummary[]> {
    return unique(recordIds)
      .map((recordId) => this.records.get(recordId))
      .filter((record): record is InstitutionalRecordSummary => Boolean(record))
      .map(cloneRecordSummary);
  }

  set(record: InstitutionalRecordSummary): void {
    this.records.set(record.identity.recordId, cloneRecordSummary(record));
  }
}

// -----------------------------------------------------------------------------
// Validation and policy helpers
// -----------------------------------------------------------------------------

export function validateRelationshipPair(
  relationshipType: RelationshipType,
  sourceRecordType: InstitutionalRecordType,
  targetRecordType: InstitutionalRecordType,
): RelationshipValidationIssue[] {
  const contractDefinition = RELATIONSHIP_CONTRACTS[relationshipType];
  const issues: RelationshipValidationIssue[] = [];
  if (!recordTypeAllowed(contractDefinition.sourceRecordTypes, sourceRecordType)) {
    issues.push(issue(
      "RELATIONSHIP_SOURCE_TYPE_INVALID",
      "error",
      `${sourceRecordType} is not a permitted source type for ${relationshipType}.`,
      false,
      { field: "sourceRecordType" },
    ));
  }
  if (!recordTypeAllowed(contractDefinition.targetRecordTypes, targetRecordType)) {
    issues.push(issue(
      "RELATIONSHIP_TARGET_TYPE_INVALID",
      "error",
      `${targetRecordType} is not a permitted target type for ${relationshipType}.`,
      false,
      { field: "targetRecordType" },
    ));
  }
  return issues;
}

export function validateCreateInput(
  input: RelationshipCreateInput,
  contractDefinition: InstitutionalRelationshipContract = RELATIONSHIP_CONTRACTS[input.relationshipType],
  nowIso: ISODateTime = new Date().toISOString(),
): RelationshipValidationIssue[] {
  const issues = validateRelationshipPair(input.relationshipType, input.sourceRecordType, input.targetRecordType);

  if (!input.sourceRecordId.trim()) issues.push(issue("SOURCE_RECORD_REQUIRED", "error", "Source record ID is required.", false, { field: "sourceRecordId" }));
  if (!input.targetRecordId.trim()) issues.push(issue("TARGET_RECORD_REQUIRED", "error", "Target record ID is required.", false, { field: "targetRecordId" }));
  if (input.sourceRecordId === input.targetRecordId && !contractDefinition.permitsSelfReference) {
    issues.push(issue("SELF_RELATIONSHIP_FORBIDDEN", "error", `${input.relationshipType} does not permit self-reference.`, false, {
      sourceRecordId: input.sourceRecordId,
      targetRecordId: input.targetRecordId,
    }));
  }
  if (contractDefinition.requiresAuthorityReference && !input.authorityReference?.trim()) {
    issues.push(issue("AUTHORITY_REFERENCE_REQUIRED", "error", `${input.relationshipType} requires an authority reference.`, false, { field: "authorityReference" }));
  }
  if (contractDefinition.requiresScope && !input.scope?.trim()) {
    issues.push(issue("RELATIONSHIP_SCOPE_REQUIRED", "error", `${input.relationshipType} requires a bounded scope.`, false, { field: "scope" }));
  }
  if (contractDefinition.requiresEvidence && !(input.evidenceRecordIds?.length || input.evidenceRationale?.trim())) {
    issues.push(issue("RELATIONSHIP_EVIDENCE_REQUIRED", "error", `${input.relationshipType} requires evidence records or a preserved evidence rationale.`, false, { field: "evidenceRecordIds" }));
  }
  issues.push(...validateTemporalRange(input.effectiveAt, input.expiresAt, nowIso));
  return issues;
}

export function validateGovernedRelationship(
  relationship: GovernedInstitutionalRelationship,
  contractDefinition: InstitutionalRelationshipContract = RELATIONSHIP_CONTRACTS[relationship.relationshipType],
  nowIso: ISODateTime = new Date().toISOString(),
): RelationshipValidationIssue[] {
  const issues = validateRelationshipPair(
    relationship.relationshipType,
    metadataRecordType(relationship.metadata, "sourceRecordType"),
    metadataRecordType(relationship.metadata, "targetRecordType"),
  );

  if (relationship.contractVersion !== TA14_RELATIONSHIP_CONTRACT_VERSION) {
    issues.push(issue("RELATIONSHIP_CONTRACT_VERSION_UNSUPPORTED", "error", `Unsupported relationship contract version ${relationship.contractVersion}.`, false, { relationshipId: relationship.relationshipId }));
  }
  if (relationship.version < 1 || !Number.isInteger(relationship.version)) {
    issues.push(issue("RELATIONSHIP_VERSION_INVALID", "error", "Relationship version must be a positive integer.", false, { relationshipId: relationship.relationshipId, field: "version" }));
  }
  if (relationship.sourceRecordId === relationship.targetRecordId && !contractDefinition.permitsSelfReference) {
    issues.push(issue("SELF_RELATIONSHIP_FORBIDDEN", "error", `${relationship.relationshipType} does not permit self-reference.`, false, { relationshipId: relationship.relationshipId }));
  }
  if (contractDefinition.requiresAuthorityReference && !relationship.authorityReference?.trim()) {
    issues.push(issue("AUTHORITY_REFERENCE_REQUIRED", "error", `${relationship.relationshipType} requires an authority reference.`, false, { relationshipId: relationship.relationshipId }));
  }
  if (contractDefinition.requiresScope && !relationship.scope?.trim()) {
    issues.push(issue("RELATIONSHIP_SCOPE_REQUIRED", "error", `${relationship.relationshipType} requires a bounded scope.`, false, { relationshipId: relationship.relationshipId }));
  }
  if (contractDefinition.requiresEvidence && relationship.evidence.state === "not_required") {
    issues.push(issue("RELATIONSHIP_EVIDENCE_REQUIRED", "error", `${relationship.relationshipType} cannot use evidence state not_required.`, false, { relationshipId: relationship.relationshipId }));
  }
  issues.push(...validateTemporalRange(relationship.effectiveAt, relationship.expiresAt, nowIso));
  return issues;
}

export function canProjectRelationship(
  relationship: GovernedInstitutionalRelationship,
  authority: AuthorityContext,
  perspectiveRecordId?: RecordId,
  now: Date = new Date(),
): boolean {
  if (relationship.lifecycleState === "withdrawn" || relationship.lifecycleState === "archived") {
    return hasPrivilegedRelationshipAccess(relationship, authority);
  }
  if (relationship.lifecycleState === "draft" && !hasPrivilegedRelationshipAccess(relationship, authority)) return false;
  if (!isRelationshipEffective(relationship, now) && !hasPrivilegedRelationshipAccess(relationship, authority)) return false;
  if (relationship.visibility.boundary === "embargoed" && relationship.visibility.embargoUntil) {
    const embargo = Date.parse(relationship.visibility.embargoUntil);
    if (Number.isFinite(embargo) && embargo > now.getTime() && !hasPrivilegedRelationshipAccess(relationship, authority)) return false;
  }
  if (hasPrivilegedRelationshipAccess(relationship, authority)) return true;
  if (relationship.visibility.boundary === "public" && relationship.public && relationship.visibility.public) return true;
  if (relationship.visibility.boundary === "mixed" && relationship.public && relationship.visibility.projectionMode !== "HIDDEN") return true;
  if (perspectiveRecordId && authority.assignedRecordIds.includes(perspectiveRecordId)) return true;
  return false;
}

export function hasPrivilegedRelationshipAccess(
  relationship: GovernedInstitutionalRelationship,
  authority: AuthorityContext,
): boolean {
  if (authority.serviceRole || authority.audience === "SERVICE" || authority.audience === "INSTITUTIONAL_ADMIN") return true;
  if (!authority.actorSubjectId) return false;
  if (relationship.createdBy === authority.actorSubjectId) return true;
  if (relationship.authority.createdBy === authority.actorSubjectId) return true;
  if (relationship.authority.authorityGrantIds.some((grantId) => authority.authorityGrantIds.includes(grantId))) return true;
  if (authority.assignedRecordIds.includes(relationship.sourceRecordId)) return true;
  if (authority.assignedRecordIds.includes(relationship.targetRecordId)) return true;
  return false;
}

export function isRelationshipEffective(
  relationship: GovernedInstitutionalRelationship,
  now: Date = new Date(),
): boolean {
  if (!["active", "suspended"].includes(relationship.lifecycleState)) return false;
  const nowTime = now.getTime();
  const effective = relationship.effectiveAt ? Date.parse(relationship.effectiveAt) : Number.NEGATIVE_INFINITY;
  const expires = relationship.expiresAt ? Date.parse(relationship.expiresAt) : Number.POSITIVE_INFINITY;
  return effective <= nowTime && nowTime < expires;
}

export function relationshipLabel(
  relationshipType: RelationshipType,
  direction: RelationshipDirection = "OUTBOUND",
): string {
  const contractDefinition = RELATIONSHIP_CONTRACTS[relationshipType];
  return direction === "OUTBOUND" ? contractDefinition.label : contractDefinition.inverseLabel;
}

export function relationshipIsContinuitySignificant(relationshipType: RelationshipType): boolean {
  return RELATIONSHIP_CONTRACTS[relationshipType].continuitySignificant;
}

export function relationshipCanBlock(relationshipType: RelationshipType): boolean {
  return RELATIONSHIP_CONTRACTS[relationshipType].blockingPotential;
}

export function toResolverRelationship(
  relationship: GovernedInstitutionalRelationship,
): InstitutionalRelationship {
  return {
    relationshipId: relationship.relationshipId,
    relationshipType: relationship.relationshipType,
    sourceRecordId: relationship.sourceRecordId,
    targetRecordId: relationship.targetRecordId,
    createdAt: relationship.createdAt,
    createdBy: relationship.createdBy,
    effectiveAt: relationship.effectiveAt,
    expiresAt: relationship.expiresAt,
    authorityReference: relationship.authorityReference,
    scope: relationship.scope,
    public: relationship.public,
    metadata: {
      ...(relationship.metadata ?? {}),
      lifecycleState: relationship.lifecycleState,
      strength: relationship.strength,
      evidenceState: relationship.evidence.state,
      visibilityBoundary: relationship.visibility.boundary,
      relationshipVersion: relationship.version,
      contractVersion: relationship.contractVersion,
      limitations: relationship.limitations,
      tags: relationship.tags,
    },
  };
}

// -----------------------------------------------------------------------------
// Construction and mutation helpers
// -----------------------------------------------------------------------------

function buildRelationship(
  input: RelationshipCreateInput,
  contractDefinition: InstitutionalRelationshipContract,
  createdAt: ISODateTime,
  relationshipId: RelationshipId,
): GovernedInstitutionalRelationship {
  const boundary = input.visibilityBoundary ?? (input.public ?? contractDefinition.publicByDefault ? "public" : "controlled");
  const publicValue = input.public ?? contractDefinition.publicByDefault;
  return {
    relationshipId,
    relationshipType: input.relationshipType,
    sourceRecordId: input.sourceRecordId,
    targetRecordId: input.targetRecordId,
    createdAt,
    createdBy: input.createdBy,
    effectiveAt: input.effectiveAt ? normalizeIso(input.effectiveAt) : createdAt,
    expiresAt: input.expiresAt ? normalizeIso(input.expiresAt) : undefined,
    authorityReference: input.authorityReference,
    scope: input.scope,
    public: publicValue,
    metadata: {
      ...(input.metadata ?? {}),
      sourceRecordType: input.sourceRecordType,
      targetRecordType: input.targetRecordType,
    },
    contractVersion: TA14_RELATIONSHIP_CONTRACT_VERSION,
    lifecycleState: "active",
    strength: contractDefinition.strength,
    evidence: {
      state: input.evidenceState ?? (contractDefinition.requiresEvidence ? "declared" : "not_required"),
      evidenceRecordIds: unique(input.evidenceRecordIds ?? []),
      rationale: input.evidenceRationale,
      limitations: [],
    },
    authority: {
      createdBy: input.createdBy,
      authorityReference: input.authorityReference,
      authorityGrantIds: unique(input.authorityGrantIds ?? []),
      appointmentRecordId: input.appointmentRecordId,
      conflictDeclarationId: input.conflictDeclarationId,
      authorizedAt: input.authorityReference ? createdAt : undefined,
      expiresAt: input.expiresAt,
    },
    visibility: {
      boundary,
      public: publicValue,
      projectionMode: input.projectionMode ?? contractDefinition.defaultProjection,
      redactedMetadataFields: [],
    },
    version: 1,
    correlationId: input.correlationId,
    idempotencyKey: input.idempotencyKey,
    createdFromEventId: input.createdFromEventId,
    limitations: unique(input.limitations ?? []),
    tags: unique(input.tags ?? []),
  };
}

function applyUpdate(
  existing: GovernedInstitutionalRelationship,
  input: RelationshipUpdateInput,
  changedAt: ISODateTime,
): GovernedInstitutionalRelationship {
  const publicValue = input.public ?? existing.public;
  return {
    ...cloneRelationship(existing),
    lifecycleState: input.lifecycleState ?? existing.lifecycleState,
    effectiveAt: input.effectiveAt ? normalizeIso(input.effectiveAt) : existing.effectiveAt,
    expiresAt: input.expiresAt ? normalizeIso(input.expiresAt) : existing.expiresAt,
    authorityReference: input.authorityReference ?? existing.authorityReference,
    scope: input.scope ?? existing.scope,
    public: publicValue,
    metadata: input.metadata ? { ...existing.metadata, ...input.metadata } : existing.metadata,
    evidence: {
      ...existing.evidence,
      state: input.evidenceState ?? existing.evidence.state,
      evidenceRecordIds: input.evidenceRecordIds ? unique(input.evidenceRecordIds) : existing.evidence.evidenceRecordIds,
      rationale: input.evidenceRationale ?? existing.evidence.rationale,
    },
    authority: {
      ...existing.authority,
      authorityReference: input.authorityReference ?? existing.authority.authorityReference,
      authorityGrantIds: input.authorityGrantIds ? unique(input.authorityGrantIds) : existing.authority.authorityGrantIds,
      appointmentRecordId: input.appointmentRecordId ?? existing.authority.appointmentRecordId,
      conflictDeclarationId: input.conflictDeclarationId ?? existing.authority.conflictDeclarationId,
    },
    visibility: {
      ...existing.visibility,
      boundary: input.visibilityBoundary ?? existing.visibility.boundary,
      public: publicValue,
      projectionMode: input.projectionMode ?? existing.visibility.projectionMode,
    },
    version: existing.version + 1,
    correlationId: input.correlationId ?? existing.correlationId,
    idempotencyKey: input.idempotencyKey ?? existing.idempotencyKey,
    limitations: input.limitations ? unique(input.limitations) : existing.limitations,
    tags: input.tags ? unique(input.tags) : existing.tags,
    createdAt: existing.createdAt,
    createdBy: existing.createdBy,
  };
}

function buildUpdateEvents(
  prior: GovernedInstitutionalRelationship,
  current: GovernedInstitutionalRelationship,
  input: RelationshipUpdateInput,
  changedAt: ISODateTime,
): RelationshipDomainEvent[] {
  const eventTypes = new Set<RelationshipDomainEvent["eventType"]>(["relationship.updated"]);
  if (prior.lifecycleState !== current.lifecycleState) {
    const lifecycleMap: Partial<Record<RelationshipLifecycleState, RelationshipDomainEvent["eventType"]>> = {
      active: "relationship.activated",
      suspended: "relationship.suspended",
      expired: "relationship.expired",
      superseded: "relationship.superseded",
      withdrawn: "relationship.withdrawn",
      archived: "relationship.archived",
    };
    const lifecycleEvent = lifecycleMap[current.lifecycleState];
    if (lifecycleEvent) eventTypes.add(lifecycleEvent);
  }
  if (!deepEqual(prior.visibility, current.visibility) || prior.public !== current.public) eventTypes.add("relationship.projection_changed");
  if (!deepEqual(prior.evidence, current.evidence)) eventTypes.add("relationship.evidence_changed");
  if (!deepEqual(prior.authority, current.authority) || prior.authorityReference !== current.authorityReference) eventTypes.add("relationship.authority_changed");

  return [...eventTypes].map((eventType) => buildEvent(
    eventType,
    current,
    input.changedBy,
    changedAt,
    snapshot(prior),
    snapshot(current),
    current.authorityReference,
    input.changeReason,
    input.correlationId,
    input.idempotencyKey,
  ));
}

function buildEvent(
  eventType: RelationshipDomainEvent["eventType"],
  relationship: GovernedInstitutionalRelationship,
  actorSubjectId: SubjectId | undefined,
  occurredAt: ISODateTime,
  priorState: Record<string, unknown> | undefined,
  newState: Record<string, unknown> | undefined,
  authorityReference: string | undefined,
  reason: string | undefined,
  correlationId = relationship.correlationId,
  idempotencyKey = relationship.idempotencyKey,
): RelationshipDomainEvent {
  return {
    eventType,
    relationshipId: relationship.relationshipId,
    sourceRecordId: relationship.sourceRecordId,
    targetRecordId: relationship.targetRecordId,
    relationshipType: relationship.relationshipType,
    actorSubjectId,
    occurredAt,
    priorState,
    newState,
    authorityReference,
    reason,
    correlationId,
    idempotencyKey,
    public: relationship.public,
  };
}

// -----------------------------------------------------------------------------
// Internal helpers
// -----------------------------------------------------------------------------

function contract(
  value: Omit<InstitutionalRelationshipContract, "inverseRelationshipType"> & {
    inverseRelationshipType?: RelationshipType;
  },
): InstitutionalRelationshipContract {
  return value;
}

function validateRecordsAgainstInput(
  input: RelationshipCreateInput,
  source: InstitutionalRecordSummary | null,
  target: InstitutionalRecordSummary | null,
): RelationshipValidationIssue[] {
  const issues: RelationshipValidationIssue[] = [];
  if (!source) {
    issues.push(issue("SOURCE_RECORD_NOT_FOUND", "error", "The source institutional record could not be resolved.", false, { sourceRecordId: input.sourceRecordId }));
  } else if (source.identity.recordType !== input.sourceRecordType) {
    issues.push(issue("SOURCE_RECORD_TYPE_MISMATCH", "error", `Source record resolves as ${source.identity.recordType}, not ${input.sourceRecordType}.`, false, { sourceRecordId: input.sourceRecordId }));
  }
  if (!target) {
    issues.push(issue("TARGET_RECORD_NOT_FOUND", "error", "The target institutional record could not be resolved.", false, { targetRecordId: input.targetRecordId }));
  } else if (target.identity.recordType !== input.targetRecordType) {
    issues.push(issue("TARGET_RECORD_TYPE_MISMATCH", "error", `Target record resolves as ${target.identity.recordType}, not ${input.targetRecordType}.`, false, { targetRecordId: input.targetRecordId }));
  }
  return issues;
}

function validateTemporalRange(
  effectiveAt: ISODateTime | undefined,
  expiresAt: ISODateTime | undefined,
  nowIso: ISODateTime,
): RelationshipValidationIssue[] {
  const issues: RelationshipValidationIssue[] = [];
  const now = Date.parse(nowIso);
  const effective = effectiveAt ? Date.parse(effectiveAt) : now;
  const expires = expiresAt ? Date.parse(expiresAt) : undefined;
  if (!Number.isFinite(effective)) issues.push(issue("EFFECTIVE_AT_INVALID", "error", "effectiveAt must be a valid ISO date-time.", false, { field: "effectiveAt" }));
  if (expiresAt && (expires === undefined || !Number.isFinite(expires))) issues.push(issue("EXPIRES_AT_INVALID", "error", "expiresAt must be a valid ISO date-time.", false, { field: "expiresAt" }));
  if (Number.isFinite(effective) && expires !== undefined && Number.isFinite(expires) && expires <= effective) {
    issues.push(issue("RELATIONSHIP_TEMPORAL_RANGE_INVALID", "error", "expiresAt must occur after effectiveAt.", false, { field: "expiresAt" }));
  }
  return issues;
}

function recordTypeAllowed(
  permitted: readonly InstitutionalRecordType[] | "ANY",
  recordType: InstitutionalRecordType,
): boolean {
  return permitted === ANY || permitted.includes(recordType);
}

function metadataRecordType(
  metadata: Record<string, unknown> | undefined,
  key: "sourceRecordType" | "targetRecordType",
): InstitutionalRecordType {
  const value = metadata?.[key];
  return typeof value === "string" ? value as InstitutionalRecordType : "CUSTOM";
}

function issue(
  code: string,
  severity: RelationshipValidationSeverity,
  message: string,
  recoverable: boolean,
  context: Partial<RelationshipValidationIssue> = {},
): RelationshipValidationIssue {
  return { code, severity, message, recoverable, ...context };
}

function hasErrors(issues: RelationshipValidationIssue[]): boolean {
  return issues.some((item) => item.severity === "error");
}

function normalizeIso(value: ISODateTime): ISODateTime {
  const time = Date.parse(value);
  if (!Number.isFinite(time)) return value;
  return new Date(time).toISOString();
}

function unique<T>(values: readonly T[]): T[] {
  return [...new Set(values)];
}

function clampInteger(value: number, minimum: number, maximum: number): number {
  if (!Number.isFinite(value)) return minimum;
  return Math.min(maximum, Math.max(minimum, Math.trunc(value)));
}

function defaultRelationshipIdFactory(): RelationshipId {
  const random = Math.random().toString(36).slice(2, 10).toUpperCase();
  const time = Date.now().toString(36).toUpperCase();
  return `TA14-REL-${time}-${random}`;
}

function compareRelationships(
  a: GovernedInstitutionalRelationship,
  b: GovernedInstitutionalRelationship,
): number {
  const activeRank: Record<RelationshipLifecycleState, number> = {
    active: 0,
    draft: 1,
    suspended: 2,
    expired: 3,
    superseded: 4,
    withdrawn: 5,
    archived: 6,
  };
  const state = activeRank[a.lifecycleState] - activeRank[b.lifecycleState];
  if (state !== 0) return state;
  const type = a.relationshipType.localeCompare(b.relationshipType);
  if (type !== 0) return type;
  const source = a.sourceRecordId.localeCompare(b.sourceRecordId);
  if (source !== 0) return source;
  const target = a.targetRecordId.localeCompare(b.targetRecordId);
  if (target !== 0) return target;
  return b.createdAt.localeCompare(a.createdAt);
}

function compareResolvedRelationships(a: ResolvedRelationship, b: ResolvedRelationship): number {
  const type = a.relationship.relationshipType.localeCompare(b.relationship.relationshipType);
  if (type !== 0) return type;
  const direction = a.direction.localeCompare(b.direction);
  if (direction !== 0) return direction;
  return a.relatedRecord.identity.institutionalId.localeCompare(b.relatedRecord.identity.institutionalId);
}

function upsertGraphNode(
  nodes: Map<RecordId, RelationshipGraphNode>,
  record: InstitutionalRecordSummary,
  depth: number,
  relationshipType: RelationshipType,
  direction: RelationshipDirection,
): void {
  const existing = nodes.get(record.identity.recordId);
  if (!existing) {
    nodes.set(record.identity.recordId, {
      record,
      depth,
      inboundCount: direction === "INBOUND" ? 1 : 0,
      outboundCount: direction === "OUTBOUND" ? 1 : 0,
      relationshipTypes: [relationshipType],
    });
    return;
  }
  existing.depth = Math.min(existing.depth, depth);
  if (direction === "INBOUND") existing.inboundCount += 1;
  else existing.outboundCount += 1;
  existing.relationshipTypes = unique([...existing.relationshipTypes, relationshipType]);
}

function cycleRelevantTypes(relationshipType: RelationshipType): RelationshipType[] {
  const continuity: RelationshipType[] = ["supersedes", "superseded_by", "corrected_by", "revalidates"];
  const dependency: RelationshipType[] = ["requires", "authorized_by", "credentialed_by", "scoped_by"];
  const provenance: RelationshipType[] = ["produced", "derived_from", "supported_by", "determined_by", "executed_through"];
  if (continuity.includes(relationshipType)) return continuity;
  if (dependency.includes(relationshipType)) return dependency;
  if (provenance.includes(relationshipType)) return provenance;
  return [relationshipType];
}

function calculatePathWeight(steps: RelationshipPathStep[]): number {
  const strengthWeight: Record<RelationshipStrength, number> = {
    constitutive: 1,
    governing: 2,
    blocking: 2,
    supporting: 3,
    informational: 5,
  };
  return steps.reduce((total, step) => total + strengthWeight[step.relationship.strength], 0);
}

function publicProjectionMode(relationship: GovernedInstitutionalRelationship): RelationshipProjectionMode {
  if (!relationship.public || !relationship.visibility.public) return "HIDDEN";
  if (relationship.visibility.boundary === "confidential" || relationship.visibility.boundary === "controlled") return "HIDDEN";
  return relationship.visibility.projectionMode;
}

function redactMetadata(
  metadata: Record<string, unknown> | undefined,
  redactedFields: string[],
): Record<string, unknown> | undefined {
  if (!metadata) return undefined;
  const output: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(metadata)) {
    if (!redactedFields.includes(key)) output[key] = cloneUnknown(value);
  }
  return output;
}

function summarizeMetadata(
  metadata: Record<string, unknown> | undefined,
  redactedFields: string[],
): Record<string, unknown> | undefined {
  const redacted = redactMetadata(metadata, redactedFields);
  if (!redacted) return undefined;
  const allowed = ["summary", "category", "jurisdiction", "framework", "recordFamily", "sourceRecordType", "targetRecordType"];
  const output: Record<string, unknown> = {};
  for (const key of allowed) {
    if (key in redacted) output[key] = redacted[key];
  }
  return output;
}

function cloneRelationship(value: GovernedInstitutionalRelationship): GovernedInstitutionalRelationship {
  return {
    ...value,
    metadata: value.metadata ? cloneUnknown(value.metadata) as Record<string, unknown> : undefined,
    evidence: {
      ...value.evidence,
      evidenceRecordIds: [...value.evidence.evidenceRecordIds],
      limitations: [...value.evidence.limitations],
    },
    authority: {
      ...value.authority,
      authorityGrantIds: [...value.authority.authorityGrantIds],
      declaredCompetence: value.authority.declaredCompetence ? [...value.authority.declaredCompetence] : undefined,
    },
    visibility: {
      ...value.visibility,
      redactedMetadataFields: [...value.visibility.redactedMetadataFields],
    },
    limitations: [...value.limitations],
    tags: [...value.tags],
  };
}

function cloneRecordSummary(value: InstitutionalRecordSummary): InstitutionalRecordSummary {
  return {
    ...value,
    identity: { ...value.identity },
    version: { ...value.version },
    states: { ...value.states },
    visibility: { ...value.visibility, redactedFields: [...value.visibility.redactedFields] },
    steward: value.steward ? { ...value.steward } : undefined,
    owner: value.owner ? { ...value.owner } : undefined,
    authorityGrantIds: [...value.authorityGrantIds],
    claimBoundary: {
      supportedClaims: [...value.claimBoundary.supportedClaims],
      partiallySupportedClaims: [...value.claimBoundary.partiallySupportedClaims],
      unsupportedClaims: [...value.claimBoundary.unsupportedClaims],
      outsideScopeClaims: [...value.claimBoundary.outsideScopeClaims],
      nonClaims: [...value.claimBoundary.nonClaims],
      limitations: [...value.claimBoundary.limitations],
      expiredOrWithdrawnClaims: [...value.claimBoundary.expiredOrWithdrawnClaims],
    },
    integrity: value.integrity ? { ...value.integrity } : undefined,
    tags: [...value.tags],
    jurisdictions: [...value.jurisdictions],
    frameworks: [...value.frameworks],
  };
}

function cloneUnknown(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(cloneUnknown);
  if (value && typeof value === "object") {
    const output: Record<string, unknown> = {};
    for (const [key, child] of Object.entries(value as Record<string, unknown>)) output[key] = cloneUnknown(child);
    return output;
  }
  return value;
}

function snapshot(value: GovernedInstitutionalRelationship): Record<string, unknown> {
  return cloneUnknown(value) as Record<string, unknown>;
}

function deepEqual(a: unknown, b: unknown): boolean {
  return stableStringify(a) === stableStringify(b);
}

function stableStringify(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  if (value && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>).sort(([aKey], [bKey]) => aKey.localeCompare(bKey));
    return `{${entries.map(([key, child]) => `${JSON.stringify(key)}:${stableStringify(child)}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

function encodeCursor(offset: number): string {
  return `offset:${Math.max(0, Math.trunc(offset))}`;
}

function decodeCursor(cursor: string | undefined): number {
  if (!cursor) return 0;
  const match = /^offset:(\d+)$/.exec(cursor);
  return match ? Number(match[1]) : 0;
}

// -----------------------------------------------------------------------------
// Canonical exports for adapters, UI, Registry, and analytics
// -----------------------------------------------------------------------------

export const CONTINUITY_RELATIONSHIP_TYPES: readonly RelationshipType[] = [
  "challenged_by",
  "corrected_by",
  "supersedes",
  "superseded_by",
  "revalidates",
] as const;

export const EVIDENTIARY_RELATIONSHIP_TYPES: readonly RelationshipType[] = [
  "supported_by",
  "verified_by",
  "derived_from",
  "demonstrated_by",
] as const;

export const AUTHORITY_RELATIONSHIP_TYPES: readonly RelationshipType[] = [
  "governed_by",
  "authorized_by",
  "credentialed_by",
  "assigned_to",
] as const;

export const COMMERCIAL_RELATIONSHIP_TYPES: readonly RelationshipType[] = [
  "scoped_by",
  "paid_by",
  "produced",
] as const;

export const EXECUTION_RELATIONSHIP_TYPES: readonly RelationshipType[] = [
  "determined_by",
  "executed_through",
  "produced",
  "verified_by",
] as const;

export function contractsForSourceType(
  recordType: InstitutionalRecordType,
): InstitutionalRelationshipContract[] {
  return Object.values(RELATIONSHIP_CONTRACTS)
    .filter((definition) => recordTypeAllowed(definition.sourceRecordTypes, recordType))
    .sort((a, b) => a.label.localeCompare(b.label));
}

export function contractsForTargetType(
  recordType: InstitutionalRecordType,
): InstitutionalRelationshipContract[] {
  return Object.values(RELATIONSHIP_CONTRACTS)
    .filter((definition) => recordTypeAllowed(definition.targetRecordTypes, recordType))
    .sort((a, b) => a.inverseLabel.localeCompare(b.inverseLabel));
}

export function compatibleRelationshipTypes(
  sourceRecordType: InstitutionalRecordType,
  targetRecordType: InstitutionalRecordType,
): RelationshipType[] {
  return (Object.keys(RELATIONSHIP_CONTRACTS) as RelationshipType[])
    .filter((relationshipType) => validateRelationshipPair(relationshipType, sourceRecordType, targetRecordType).length === 0)
    .sort();
}

export function summarizeRelationship(
  relationship: GovernedInstitutionalRelationship,
  direction: RelationshipDirection = "OUTBOUND",
): string {
  const label = relationshipLabel(relationship.relationshipType, direction);
  const scope = relationship.scope ? ` - ${relationship.scope}` : "";
  const state = relationship.lifecycleState !== "active" ? ` [${relationship.lifecycleState}]` : "";
  return `${label}${scope}${state}`;
}
