/**
 * TA-14 Governance Registration Gate and Artifact Eligibility Engine
 * -----------------------------------------------------------------------------
 * Registry admission control for the TA-14 Execution Artifact Registry.
 *
 * Governing registry rule:
 *   No registered governance. No registered artifact.
 *
 * This module deterministically establishes whether a governance registration
 * is eligible to sponsor an execution artifact and whether a submitted artifact
 * remains inside the identity, architecture, version, sector, jurisdiction,
 * route, ownership, authority, and publication boundaries of that registration.
 *
 * It does not certify a governance, create authority, repair an artifact,
 * publish a registry record, or silently broaden a registration. It produces a
 * bounded eligibility decision and an attributable audit record for downstream
 * registry workflows.
 */

import type {
  ArtifactClassification,
  CanonicalExecutionArtifact,
  Determination,
  PublicationStatus,
  ValidationSummary,
} from "./canonical-record-validator";
import {
  stableValidationJson,
  validateCanonicalExecutionArtifact,
} from "./canonical-record-validator";

export const TA14_GOVERNANCE_GATE_VERSION = "1.0.0" as const;
export const TA14_REGISTRY_RULE = "NO_REGISTERED_GOVERNANCE_NO_REGISTERED_ARTIFACT" as const;

export type GovernanceRegistrationStatus =
  | "DRAFT"
  | "PENDING_REVIEW"
  | "ACTIVE"
  | "SUSPENDED"
  | "EXPIRED"
  | "WITHDRAWN"
  | "REJECTED";

export type GovernanceVerificationState =
  | "UNVERIFIED"
  | "IDENTITY_VERIFIED"
  | "INSTITUTION_VERIFIED"
  | "INDEPENDENTLY_REVIEWED";

export type EligibilityDisposition =
  | "ELIGIBLE"
  | "HOLD"
  | "INELIGIBLE"
  | "ESCALATE";

export type RegistrationControlResult = "PASS" | "HOLD" | "FAIL" | "ESCALATE" | "NOT_APPLICABLE";

export type GovernanceRegistrationKind =
  | "ORGANIZATION"
  | "INDEPENDENT_PRACTITIONER"
  | "RESEARCH_INSTITUTION"
  | "PUBLIC_AUTHORITY"
  | "ACADEMIC_PROGRAM"
  | "CONSORTIUM";

export type GovernanceClaimType =
  | "EVIDENCE_GOVERNANCE"
  | "AUTHORITY_GOVERNANCE"
  | "EXECUTION_GOVERNANCE"
  | "OUTCOME_GOVERNANCE"
  | "MODEL_GOVERNANCE"
  | "AGENT_GOVERNANCE"
  | "DATA_GOVERNANCE"
  | "SECTOR_GOVERNANCE"
  | "COMPLIANCE_ASSURANCE"
  | "INDEPENDENT_REVIEW";

export interface GovernanceClaim {
  claimId: string;
  claimType: GovernanceClaimType;
  statement: string;
  declaredLimits: string[];
  supportedSectors: string[];
  supportingArtifactIds: string[];
  status: "DECLARED" | "SUPPORTED" | "CHALLENGED" | "WITHDRAWN";
}

export interface RegisteredArchitecture {
  architectureId: string;
  name: string;
  version: string;
  releaseDate: string;
  canonicalHash: string;
  declaredCapabilities: string[];
  declaredLimitations: string[];
  supportedDeterminations: Determination[];
  supportedClassifications: ArtifactClassification[];
  supportedRouteIds: string[];
  supportedRouteVersions: Record<string, string[]>;
  retiredVersions: string[];
}

export interface RegisteredOrganization {
  legalName: string;
  displayName: string;
  legalEntityId: string;
  jurisdictionOfFormation: string;
  registeredAddressCountry: string;
  website?: string;
  accountableOwnerId: string;
  accountableOwnerName: string;
  accountableOwnerRole: string;
  registryStewardId: string;
  registryStewardName: string;
}

export interface AuthorizedSubmitter {
  submitterId: string;
  name: string;
  role: string;
  validFrom: string;
  validUntil?: string;
  revokedAt?: string;
  artifactClassifications: ArtifactClassification[];
  sectors: string[];
  routeIds: string[];
  maySubmit: boolean;
  mayAmend: boolean;
  mayWithdraw: boolean;
}

export interface GovernanceScope {
  sectors: string[];
  jurisdictions: string[];
  actionClasses: string[];
  consequenceClasses: string[];
  evidenceClasses: string[];
  authorityModels: string[];
  executionAdapters: string[];
  excludedUses: string[];
  maximumConsequenceStatement: string;
}

export interface GovernanceRegistration {
  governanceRegistrationId: string;
  kind: GovernanceRegistrationKind;
  organization: RegisteredOrganization;
  architecture: RegisteredArchitecture;
  scope: GovernanceScope;
  claims: GovernanceClaim[];
  authorizedSubmitters: AuthorizedSubmitter[];
  status: GovernanceRegistrationStatus;
  verificationState: GovernanceVerificationState;
  registeredAt: string;
  activatedAt?: string;
  validFrom: string;
  validUntil?: string;
  suspendedAt?: string;
  suspensionReason?: string;
  withdrawnAt?: string;
  withdrawalReason?: string;
  registryTermsVersion: string;
  registrationHash: string;
  publicProfileUrl?: string;
  notes: string[];
}

export interface ArtifactSubmissionContext {
  submittedBy: string;
  submittedAt: string;
  intendedRegistryStatus: Exclude<PublicationStatus, "PUBLISHED"> | "PUBLISHED";
  sector: string;
  jurisdiction: string;
  actionClass: string;
  consequenceClass: string;
  architectureId: string;
  architectureVersion: string;
  governanceRegistrationId: string;
  declaredRouteId: string;
  declaredRouteVersion: string;
  requestedVerificationLevel: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
  submissionChannel: "PLAYGROUND" | "API" | "MANUAL_IMPORT" | "PARTNER_REVIEW";
  attestations: string[];
}

export interface ArtifactRegistrationRequest {
  artifact: CanonicalExecutionArtifact;
  governance: GovernanceRegistration | null;
  context: ArtifactSubmissionContext;
}

export type EligibilityReasonCode =
  | "GOVERNANCE_REGISTRATION_MISSING"
  | "GOVERNANCE_REGISTRATION_ID_MISMATCH"
  | "GOVERNANCE_REGISTRATION_NOT_ACTIVE"
  | "GOVERNANCE_REGISTRATION_SUSPENDED"
  | "GOVERNANCE_REGISTRATION_EXPIRED"
  | "GOVERNANCE_REGISTRATION_WITHDRAWN"
  | "GOVERNANCE_REGISTRATION_REJECTED"
  | "GOVERNANCE_IDENTITY_NOT_VERIFIED"
  | "GOVERNANCE_INSTITUTION_NOT_VERIFIED"
  | "REGISTRATION_HASH_MISSING"
  | "REGISTRY_TERMS_VERSION_MISSING"
  | "ACCOUNTABLE_OWNER_MISSING"
  | "REGISTRY_STEWARD_MISSING"
  | "ARCHITECTURE_ID_MISMATCH"
  | "ARCHITECTURE_VERSION_MISMATCH"
  | "ARCHITECTURE_VERSION_RETIRED"
  | "ARCHITECTURE_HASH_MISSING"
  | "DETERMINATION_NOT_SUPPORTED"
  | "CLASSIFICATION_NOT_SUPPORTED"
  | "SECTOR_OUTSIDE_REGISTERED_SCOPE"
  | "JURISDICTION_OUTSIDE_REGISTERED_SCOPE"
  | "ACTION_CLASS_OUTSIDE_REGISTERED_SCOPE"
  | "CONSEQUENCE_CLASS_OUTSIDE_REGISTERED_SCOPE"
  | "ROUTE_NOT_REGISTERED"
  | "ROUTE_VERSION_NOT_REGISTERED"
  | "ARTIFACT_OWNER_MISMATCH"
  | "ARTIFACT_STEWARD_MISMATCH"
  | "SUBMITTER_NOT_AUTHORIZED"
  | "SUBMITTER_AUTHORIZATION_EXPIRED"
  | "SUBMITTER_AUTHORIZATION_REVOKED"
  | "SUBMITTER_CLASSIFICATION_NOT_AUTHORIZED"
  | "SUBMITTER_SECTOR_NOT_AUTHORIZED"
  | "SUBMITTER_ROUTE_NOT_AUTHORIZED"
  | "ARTIFACT_VALIDATION_FAILED"
  | "ARTIFACT_NOT_PUBLICATION_READY"
  | "ARTIFACT_REGISTRATION_ATTESTATION_MISSING"
  | "ARTIFACT_GOVERNANCE_LINK_MISSING"
  | "ARTIFACT_ARCHITECTURE_LINK_MISSING"
  | "ARTIFACT_ROUTE_LINK_MISSING"
  | "ARTIFACT_DUPLICATE_ID"
  | "ARTIFACT_DUPLICATE_HASH"
  | "ARTIFACT_SCOPE_AMBIGUOUS"
  | "ARTIFACT_CLAIM_OUTSIDE_REGISTRATION"
  | "GOVERNANCE_CLAIMS_EMPTY"
  | "GOVERNANCE_SCOPE_EMPTY"
  | "AUTHORIZED_SUBMITTERS_EMPTY"
  | "REGISTRATION_VALID_FROM_INVALID"
  | "REGISTRATION_VALID_UNTIL_INVALID"
  | "SUBMISSION_TIME_INVALID"
  | "SUBMISSION_BEFORE_REGISTRATION"
  | "SUBMISSION_AFTER_EXPIRY"
  | "PLAYGROUND_ROUTE_PARITY_MISSING"
  | "MANUAL_IMPORT_REQUIRES_ESCALATION"
  | "INDEPENDENT_REVIEW_REQUIRED"
  | "HIGH_CONSEQUENCE_REVIEW_REQUIRED"
  | "PRODUCTION_ARTIFACT_REQUIRES_INSTITUTION_VERIFICATION"
  | "DEMONSTRATION_ARTIFACT_LABEL_MISSING"
  | "GOVERNANCE_PROFILE_URL_MISSING"
  | "REGISTRATION_CONTROL_FAILURE"
  | "REGISTRATION_CONTROL_HOLD"
  | "REGISTRATION_CONTROL_ESCALATION";

export interface EligibilityReasonDefinition {
  code: EligibilityReasonCode;
  title: string;
  message: string;
  disposition: EligibilityDisposition;
  blocksRegistration: boolean;
  repairHint: string;
  controlFamily: RegistrationControlFamily;
}

export interface EligibilityFinding {
  code: EligibilityReasonCode;
  path: string;
  message: string;
  disposition: EligibilityDisposition;
  blocksRegistration: boolean;
  repairHint: string;
  details?: Record<string, unknown>;
}

export type RegistrationControlFamily =
  | "IDENTITY"
  | "STATUS"
  | "ARCHITECTURE"
  | "SCOPE"
  | "SUBMITTER"
  | "ARTIFACT"
  | "ROUTE"
  | "CLAIMS"
  | "TIMING"
  | "VERIFICATION"
  | "PUBLICATION"
  | "AUDIT";

export interface RegistrationControlDefinition {
  controlId: string;
  sequence: number;
  family: RegistrationControlFamily;
  title: string;
  requirement: string;
  failureCode: EligibilityReasonCode;
  mandatory: boolean;
  publicRelianceRelevant: boolean;
}

export interface RegistrationControlEvaluation {
  control: RegistrationControlDefinition;
  result: RegistrationControlResult;
  evaluatedAt: string;
  evidenceRefs: string[];
  explanation: string;
}

export interface GovernanceEligibilitySnapshot {
  governanceRegistrationId: string | null;
  organizationName: string | null;
  architectureId: string | null;
  architectureVersion: string | null;
  registrationStatus: GovernanceRegistrationStatus | null;
  verificationState: GovernanceVerificationState | null;
  submitterId: string;
  artifactId: string;
  artifactHash: string;
  routeId: string;
  routeVersion: string;
  sector: string;
  jurisdiction: string;
  determination: Determination;
  classification: ArtifactClassification;
  evaluatedAt: string;
}

export interface ArtifactEligibilityDecision {
  eligible: boolean;
  disposition: EligibilityDisposition;
  registryRule: typeof TA14_REGISTRY_RULE;
  governanceRegistrationId: string | null;
  artifactId: string;
  evaluationId: string;
  evaluatedAt: string;
  findings: EligibilityFinding[];
  controls: RegistrationControlEvaluation[];
  artifactValidation: ValidationSummary;
  snapshot: GovernanceEligibilitySnapshot;
  permittedNextAction:
    | "REGISTER_ARTIFACT"
    | "REPAIR_AND_RESUBMIT"
    | "ESCALATE_FOR_REVIEW"
    | "REJECT_SUBMISSION";
  requiredRepairs: string[];
  auditEvents: RegistryEligibilityAuditEvent[];
}

export interface RegistryEligibilityAuditEvent {
  eventId: string;
  occurredAt: string;
  actorId: string;
  eventType:
    | "ELIGIBILITY_EVALUATION_STARTED"
    | "GOVERNANCE_REGISTRATION_RESOLVED"
    | "SUBMITTER_RESOLVED"
    | "ARTIFACT_VALIDATED"
    | "CONTROL_EVALUATED"
    | "ELIGIBILITY_DECISION_COMMITTED";
  subjectId: string;
  detail: string;
  previousHash: string;
  eventHash: string;
}

export interface RegistryDuplicateIndex {
  artifactIds: ReadonlySet<string>;
  canonicalHashes: ReadonlySet<string>;
}

export interface EligibilityEvaluationOptions {
  now?: string;
  strict?: boolean;
  duplicateIndex?: RegistryDuplicateIndex;
  requirePublicProfileForPublication?: boolean;
  requireIndependentReviewAtOrAboveLevel?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
  highConsequenceActionClasses?: string[];
}

export interface RegistrationTransitionRequest {
  from: GovernanceRegistrationStatus;
  to: GovernanceRegistrationStatus;
  actorId: string;
  reason: string;
  occurredAt: string;
}

export interface RegistrationTransitionDecision {
  allowed: boolean;
  from: GovernanceRegistrationStatus;
  to: GovernanceRegistrationStatus;
  reason: string;
}

export interface GovernanceRegistrationSummary {
  governanceRegistrationId: string;
  legalName: string;
  displayName: string;
  architecture: string;
  architectureVersion: string;
  status: GovernanceRegistrationStatus;
  verificationState: GovernanceVerificationState;
  sectors: string[];
  jurisdictions: string[];
  claimCount: number;
  authorizedSubmitterCount: number;
  validFrom: string;
  validUntil?: string;
  publicProfileUrl?: string;
}

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/;
const GOVERNANCE_REGISTRATION_ID_PATTERN = /^TA14-GOV-[A-Z0-9]{6,32}$/;
const REQUIRED_ATTESTATIONS = Object.freeze([
  "ARTIFACT_IS_ATTRIBUTABLE_TO_REGISTERED_GOVERNANCE",
  "ARTIFACT_USES_REGISTERED_ARCHITECTURE_VERSION",
  "ARTIFACT_REMAINS_WITHIN_REGISTERED_SCOPE",
  "SUBMITTER_IS_AUTHORIZED",
  "CANONICAL_RECORD_IS_FROZEN",
] as const);

type RequiredAttestation = (typeof REQUIRED_ATTESTATIONS)[number];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isIsoDate(value: unknown): value is string {
  return isNonEmptyString(value) && ISO_DATE_PATTERN.test(value) && !Number.isNaN(Date.parse(value));
}

function compareIso(left: string, right: string): number {
  return Date.parse(left) - Date.parse(right);
}

function includesNormalized(values: readonly string[], candidate: string): boolean {
  const target = candidate.trim().toLowerCase();
  return values.some((value) => value.trim().toLowerCase() === target);
}

function unique(values: readonly string[]): string[] {
  return [...new Set(values.filter(isNonEmptyString))];
}

function stableStringify(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).sort();
  return `{${keys.map((key) => `${JSON.stringify(key)}:${stableStringify(record[key])}`).join(",")}}`;
}

function fnv1a(input: string): string {
  let hash = 0x811c9dc5;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return `fnv1a-${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

function makeEvaluationId(request: ArtifactRegistrationRequest, evaluatedAt: string): string {
  return `TA14-ELIG-${fnv1a(`${request.context.governanceRegistrationId}|${request.artifact.identity.artifactId}|${evaluatedAt}`)
    .replace("fnv1a-", "")
    .toUpperCase()}`;
}

function highestDisposition(findings: readonly EligibilityFinding[]): EligibilityDisposition {
  const rank: Record<EligibilityDisposition, number> = {
    ELIGIBLE: 0,
    HOLD: 1,
    ESCALATE: 2,
    INELIGIBLE: 3,
  };
  return findings.reduce<EligibilityDisposition>(
    (highest, finding) => (rank[finding.disposition] > rank[highest] ? finding.disposition : highest),
    "ELIGIBLE",
  );
}

function createFinding(
  code: EligibilityReasonCode,
  path: string,
  details?: Record<string, unknown>,
): EligibilityFinding {
  const definition = ELIGIBILITY_REASON_DICTIONARY[code];
  return {
    code,
    path,
    message: definition.message,
    disposition: definition.disposition,
    blocksRegistration: definition.blocksRegistration,
    repairHint: definition.repairHint,
    ...(details ? { details } : {}),
  };
}

function auditEvent(
  previousHash: string,
  occurredAt: string,
  actorId: string,
  eventType: RegistryEligibilityAuditEvent["eventType"],
  subjectId: string,
  detail: string,
): RegistryEligibilityAuditEvent {
  const eventHash = fnv1a(stableStringify({ previousHash, occurredAt, actorId, eventType, subjectId, detail }));
  return {
    eventId: `AUD-${eventHash.replace("fnv1a-", "").toUpperCase()}`,
    occurredAt,
    actorId,
    eventType,
    subjectId,
    detail,
    previousHash,
    eventHash,
  };
}
export const ELIGIBILITY_REASON_DICTIONARY: Readonly<Record<EligibilityReasonCode, EligibilityReasonDefinition>> = Object.freeze({
  GOVERNANCE_REGISTRATION_MISSING: Object.freeze({ code: "GOVERNANCE_REGISTRATION_MISSING", title: 'Governance registration missing', message: 'The artifact cannot enter the registry because no governance registration was supplied.', disposition: "INELIGIBLE", blocksRegistration: true, repairHint: 'Register the governance before submitting an artifact.', controlFamily: "IDENTITY" }),
  GOVERNANCE_REGISTRATION_ID_MISMATCH: Object.freeze({ code: "GOVERNANCE_REGISTRATION_ID_MISMATCH", title: 'Governance registration identifier mismatch', message: 'The submitted governance registration ID does not match the resolved governance profile.', disposition: "INELIGIBLE", blocksRegistration: true, repairHint: 'Use the exact active governance registration ID.', controlFamily: "IDENTITY" }),
  GOVERNANCE_REGISTRATION_NOT_ACTIVE: Object.freeze({ code: "GOVERNANCE_REGISTRATION_NOT_ACTIVE", title: 'Governance registration is not active', message: 'Only an ACTIVE governance registration may sponsor a registry artifact.', disposition: "INELIGIBLE", blocksRegistration: true, repairHint: 'Complete registration review and activate the governance profile.', controlFamily: "STATUS" }),
  GOVERNANCE_REGISTRATION_SUSPENDED: Object.freeze({ code: "GOVERNANCE_REGISTRATION_SUSPENDED", title: 'Governance registration suspended', message: 'A suspended governance cannot register new artifacts.', disposition: "INELIGIBLE", blocksRegistration: true, repairHint: 'Resolve the suspension and restore ACTIVE status.', controlFamily: "STATUS" }),
  GOVERNANCE_REGISTRATION_EXPIRED: Object.freeze({ code: "GOVERNANCE_REGISTRATION_EXPIRED", title: 'Governance registration expired', message: 'The governance registration validity period ended before submission.', disposition: "INELIGIBLE", blocksRegistration: true, repairHint: 'Renew the governance registration.', controlFamily: "TIMING" }),
  GOVERNANCE_REGISTRATION_WITHDRAWN: Object.freeze({ code: "GOVERNANCE_REGISTRATION_WITHDRAWN", title: 'Governance registration withdrawn', message: 'A withdrawn governance cannot sponsor new registry artifacts.', disposition: "INELIGIBLE", blocksRegistration: true, repairHint: 'Create or reactivate an eligible governance registration.', controlFamily: "STATUS" }),
  GOVERNANCE_REGISTRATION_REJECTED: Object.freeze({ code: "GOVERNANCE_REGISTRATION_REJECTED", title: 'Governance registration rejected', message: 'A rejected governance registration cannot sponsor artifacts.', disposition: "INELIGIBLE", blocksRegistration: true, repairHint: 'Correct the governance registration and submit a new review.', controlFamily: "STATUS" }),
  GOVERNANCE_IDENTITY_NOT_VERIFIED: Object.freeze({ code: "GOVERNANCE_IDENTITY_NOT_VERIFIED", title: 'Governance identity not verified', message: 'The organization identity has not reached the minimum verified state.', disposition: "HOLD", blocksRegistration: true, repairHint: 'Complete identity verification.', controlFamily: "VERIFICATION" }),
  GOVERNANCE_INSTITUTION_NOT_VERIFIED: Object.freeze({ code: "GOVERNANCE_INSTITUTION_NOT_VERIFIED", title: 'Institution verification required', message: 'The requested artifact class requires institution-level governance verification.', disposition: "HOLD", blocksRegistration: true, repairHint: 'Complete institution verification.', controlFamily: "VERIFICATION" }),
  REGISTRATION_HASH_MISSING: Object.freeze({ code: "REGISTRATION_HASH_MISSING", title: 'Registration integrity hash missing', message: 'The governance registration lacks an integrity commitment.', disposition: "HOLD", blocksRegistration: true, repairHint: 'Generate and preserve the registration hash.', controlFamily: "AUDIT" }),
  REGISTRY_TERMS_VERSION_MISSING: Object.freeze({ code: "REGISTRY_TERMS_VERSION_MISSING", title: 'Registry terms version missing', message: 'The governance registration does not identify the accepted registry terms version.', disposition: "HOLD", blocksRegistration: true, repairHint: 'Accept and record the current registry terms.', controlFamily: "PUBLICATION" }),
  ACCOUNTABLE_OWNER_MISSING: Object.freeze({ code: "ACCOUNTABLE_OWNER_MISSING", title: 'Accountable owner missing', message: 'The governance profile lacks an attributable accountable owner.', disposition: "INELIGIBLE", blocksRegistration: true, repairHint: 'Assign an accountable owner.', controlFamily: "IDENTITY" }),
  REGISTRY_STEWARD_MISSING: Object.freeze({ code: "REGISTRY_STEWARD_MISSING", title: 'Registry steward missing', message: 'The governance profile lacks an attributable registry steward.', disposition: "HOLD", blocksRegistration: true, repairHint: 'Assign a registry steward.', controlFamily: "IDENTITY" }),
  ARCHITECTURE_ID_MISMATCH: Object.freeze({ code: "ARCHITECTURE_ID_MISMATCH", title: 'Architecture identifier mismatch', message: 'The artifact names a different governance architecture than the registered profile.', disposition: "INELIGIBLE", blocksRegistration: true, repairHint: 'Submit under the registered architecture or update the governance registration first.', controlFamily: "ARCHITECTURE" }),
  ARCHITECTURE_VERSION_MISMATCH: Object.freeze({ code: "ARCHITECTURE_VERSION_MISMATCH", title: 'Architecture version mismatch', message: 'The artifact architecture version does not match the registered active version.', disposition: "INELIGIBLE", blocksRegistration: true, repairHint: 'Use a registered architecture version.', controlFamily: "ARCHITECTURE" }),
  ARCHITECTURE_VERSION_RETIRED: Object.freeze({ code: "ARCHITECTURE_VERSION_RETIRED", title: 'Architecture version retired', message: 'The artifact relies on a governance architecture version marked retired.', disposition: "HOLD", blocksRegistration: true, repairHint: 'Migrate the artifact to a supported version or obtain bounded review.', controlFamily: "ARCHITECTURE" }),
  ARCHITECTURE_HASH_MISSING: Object.freeze({ code: "ARCHITECTURE_HASH_MISSING", title: 'Architecture hash missing', message: 'The registered architecture lacks a canonical integrity hash.', disposition: "HOLD", blocksRegistration: true, repairHint: 'Publish the architecture hash.', controlFamily: "ARCHITECTURE" }),
  DETERMINATION_NOT_SUPPORTED: Object.freeze({ code: "DETERMINATION_NOT_SUPPORTED", title: 'Determination unsupported', message: 'The registered architecture does not declare support for the artifact determination.', disposition: "INELIGIBLE", blocksRegistration: true, repairHint: 'Update the registration or use a supported determination model.', controlFamily: "ARCHITECTURE" }),
  CLASSIFICATION_NOT_SUPPORTED: Object.freeze({ code: "CLASSIFICATION_NOT_SUPPORTED", title: 'Artifact classification unsupported', message: 'The governance registration does not support this demonstration or production classification.', disposition: "INELIGIBLE", blocksRegistration: true, repairHint: 'Use a supported classification or amend the registration.', controlFamily: "SCOPE" }),
  SECTOR_OUTSIDE_REGISTERED_SCOPE: Object.freeze({ code: "SECTOR_OUTSIDE_REGISTERED_SCOPE", title: 'Sector outside registered scope', message: 'The artifact sector is not included in the governance registration.', disposition: "INELIGIBLE", blocksRegistration: true, repairHint: 'Register the sector before submitting artifacts in it.', controlFamily: "SCOPE" }),
  JURISDICTION_OUTSIDE_REGISTERED_SCOPE: Object.freeze({ code: "JURISDICTION_OUTSIDE_REGISTERED_SCOPE", title: 'Jurisdiction outside registered scope', message: 'The artifact jurisdiction is outside the governance registration.', disposition: "INELIGIBLE", blocksRegistration: true, repairHint: 'Add the jurisdiction through governance registration review.', controlFamily: "SCOPE" }),
  ACTION_CLASS_OUTSIDE_REGISTERED_SCOPE: Object.freeze({ code: "ACTION_CLASS_OUTSIDE_REGISTERED_SCOPE", title: 'Action class outside registered scope', message: 'The proposed action class is outside the registered governance scope.', disposition: "INELIGIBLE", blocksRegistration: true, repairHint: 'Register the action class or submit a different artifact.', controlFamily: "SCOPE" }),
  CONSEQUENCE_CLASS_OUTSIDE_REGISTERED_SCOPE: Object.freeze({ code: "CONSEQUENCE_CLASS_OUTSIDE_REGISTERED_SCOPE", title: 'Consequence class outside registered scope', message: 'The consequence class is outside the registered governance scope.', disposition: "INELIGIBLE", blocksRegistration: true, repairHint: 'Register the consequence class before submission.', controlFamily: "SCOPE" }),
  ROUTE_NOT_REGISTERED: Object.freeze({ code: "ROUTE_NOT_REGISTERED", title: 'Route not registered', message: 'The artifact route is not linked to the governance registration.', disposition: "INELIGIBLE", blocksRegistration: true, repairHint: 'Register the route under the governance profile.', controlFamily: "ROUTE" }),
  ROUTE_VERSION_NOT_REGISTERED: Object.freeze({ code: "ROUTE_VERSION_NOT_REGISTERED", title: 'Route version not registered', message: 'The artifact route version is not an approved registered version.', disposition: "INELIGIBLE", blocksRegistration: true, repairHint: 'Register the route version or rebuild using an approved version.', controlFamily: "ROUTE" }),
  ARTIFACT_OWNER_MISMATCH: Object.freeze({ code: "ARTIFACT_OWNER_MISMATCH", title: 'Artifact owner mismatch', message: 'The artifact owner does not match the registered legal entity or approved owner identity.', disposition: "ESCALATE", blocksRegistration: true, repairHint: 'Resolve ownership and attribution before registration.', controlFamily: "IDENTITY" }),
  ARTIFACT_STEWARD_MISMATCH: Object.freeze({ code: "ARTIFACT_STEWARD_MISMATCH", title: 'Artifact steward mismatch', message: 'The artifact steward is not an authorized governance steward or submitter.', disposition: "HOLD", blocksRegistration: true, repairHint: 'Assign an authorized steward.', controlFamily: "IDENTITY" }),
  SUBMITTER_NOT_AUTHORIZED: Object.freeze({ code: "SUBMITTER_NOT_AUTHORIZED", title: 'Submitter not authorized', message: 'The submitting actor is not authorized under the governance registration.', disposition: "INELIGIBLE", blocksRegistration: true, repairHint: 'Use an active authorized submitter.', controlFamily: "SUBMITTER" }),
  SUBMITTER_AUTHORIZATION_EXPIRED: Object.freeze({ code: "SUBMITTER_AUTHORIZATION_EXPIRED", title: 'Submitter authorization expired', message: 'The submitter authorization expired before artifact submission.', disposition: "INELIGIBLE", blocksRegistration: true, repairHint: 'Renew submitter authorization.', controlFamily: "SUBMITTER" }),
  SUBMITTER_AUTHORIZATION_REVOKED: Object.freeze({ code: "SUBMITTER_AUTHORIZATION_REVOKED", title: 'Submitter authorization revoked', message: 'The submitter authorization was revoked before artifact submission.', disposition: "INELIGIBLE", blocksRegistration: true, repairHint: 'Use a currently authorized submitter.', controlFamily: "SUBMITTER" }),
  SUBMITTER_CLASSIFICATION_NOT_AUTHORIZED: Object.freeze({ code: "SUBMITTER_CLASSIFICATION_NOT_AUTHORIZED", title: 'Submitter classification not authorized', message: 'The submitter may not submit artifacts of this classification.', disposition: "INELIGIBLE", blocksRegistration: true, repairHint: 'Use a submitter authorized for this artifact classification.', controlFamily: "SUBMITTER" }),
  SUBMITTER_SECTOR_NOT_AUTHORIZED: Object.freeze({ code: "SUBMITTER_SECTOR_NOT_AUTHORIZED", title: 'Submitter sector not authorized', message: 'The submitter is not authorized for this sector.', disposition: "INELIGIBLE", blocksRegistration: true, repairHint: 'Update submitter sector authority.', controlFamily: "SUBMITTER" }),
  SUBMITTER_ROUTE_NOT_AUTHORIZED: Object.freeze({ code: "SUBMITTER_ROUTE_NOT_AUTHORIZED", title: 'Submitter route not authorized', message: 'The submitter is not authorized to submit this route.', disposition: "INELIGIBLE", blocksRegistration: true, repairHint: 'Authorize the submitter for the route.', controlFamily: "SUBMITTER" }),
  ARTIFACT_VALIDATION_FAILED: Object.freeze({ code: "ARTIFACT_VALIDATION_FAILED", title: 'Artifact validation failed', message: 'The canonical artifact validator reported blocking issues.', disposition: "INELIGIBLE", blocksRegistration: true, repairHint: 'Repair the canonical record and validate again.', controlFamily: "ARTIFACT" }),
  ARTIFACT_NOT_PUBLICATION_READY: Object.freeze({ code: "ARTIFACT_NOT_PUBLICATION_READY", title: 'Artifact not publication ready', message: 'The artifact is not ready for the requested registry publication state.', disposition: "HOLD", blocksRegistration: true, repairHint: 'Complete publication requirements before registration.', controlFamily: "PUBLICATION" }),
  ARTIFACT_REGISTRATION_ATTESTATION_MISSING: Object.freeze({ code: "ARTIFACT_REGISTRATION_ATTESTATION_MISSING", title: 'Required attestation missing', message: 'One or more mandatory registry submission attestations are absent.', disposition: "HOLD", blocksRegistration: true, repairHint: 'Provide all mandatory attestations.', controlFamily: "PUBLICATION" }),
  ARTIFACT_GOVERNANCE_LINK_MISSING: Object.freeze({ code: "ARTIFACT_GOVERNANCE_LINK_MISSING", title: 'Artifact governance link missing', message: 'The artifact package does not preserve a governance registration link.', disposition: "HOLD", blocksRegistration: true, repairHint: 'Bind the artifact package to the governance registration ID.', controlFamily: "ARTIFACT" }),
  ARTIFACT_ARCHITECTURE_LINK_MISSING: Object.freeze({ code: "ARTIFACT_ARCHITECTURE_LINK_MISSING", title: 'Artifact architecture link missing', message: 'The artifact package does not preserve the registered architecture identity.', disposition: "HOLD", blocksRegistration: true, repairHint: 'Bind the artifact to the registered architecture ID and version.', controlFamily: "ARCHITECTURE" }),
  ARTIFACT_ROUTE_LINK_MISSING: Object.freeze({ code: "ARTIFACT_ROUTE_LINK_MISSING", title: 'Artifact route link missing', message: 'The artifact package does not preserve the declared registered route link.', disposition: "HOLD", blocksRegistration: true, repairHint: 'Bind the artifact to the registered route and version.', controlFamily: "ROUTE" }),
  ARTIFACT_DUPLICATE_ID: Object.freeze({ code: "ARTIFACT_DUPLICATE_ID", title: 'Duplicate artifact identifier', message: 'The artifact ID already exists in the registry index.', disposition: "INELIGIBLE", blocksRegistration: true, repairHint: 'Use the existing record or issue a valid version or amendment ID.', controlFamily: "ARTIFACT" }),
  ARTIFACT_DUPLICATE_HASH: Object.freeze({ code: "ARTIFACT_DUPLICATE_HASH", title: 'Duplicate artifact canonical hash', message: 'An artifact with the same canonical hash already exists.', disposition: "ESCALATE", blocksRegistration: true, repairHint: 'Resolve whether this is a duplicate, version, mirror, or correction.', controlFamily: "ARTIFACT" }),
  ARTIFACT_SCOPE_AMBIGUOUS: Object.freeze({ code: "ARTIFACT_SCOPE_AMBIGUOUS", title: 'Artifact scope ambiguous', message: 'The artifact cannot be reliably mapped to the registered governance scope.', disposition: "ESCALATE", blocksRegistration: true, repairHint: 'Clarify sector, action, consequence, and jurisdiction boundaries.', controlFamily: "SCOPE" }),
  ARTIFACT_CLAIM_OUTSIDE_REGISTRATION: Object.freeze({ code: "ARTIFACT_CLAIM_OUTSIDE_REGISTRATION", title: 'Artifact claim outside registration', message: 'The artifact makes a governance claim not declared by the registration.', disposition: "INELIGIBLE", blocksRegistration: true, repairHint: 'Bound the claim or update the governance registration first.', controlFamily: "CLAIMS" }),
  GOVERNANCE_CLAIMS_EMPTY: Object.freeze({ code: "GOVERNANCE_CLAIMS_EMPTY", title: 'Governance claims empty', message: 'The governance profile has no declared claims against which artifacts can be linked.', disposition: "HOLD", blocksRegistration: true, repairHint: 'Declare bounded governance claims.', controlFamily: "CLAIMS" }),
  GOVERNANCE_SCOPE_EMPTY: Object.freeze({ code: "GOVERNANCE_SCOPE_EMPTY", title: 'Governance scope empty', message: 'The governance profile has no usable sector or jurisdiction scope.', disposition: "HOLD", blocksRegistration: true, repairHint: 'Define governance scope.', controlFamily: "SCOPE" }),
  AUTHORIZED_SUBMITTERS_EMPTY: Object.freeze({ code: "AUTHORIZED_SUBMITTERS_EMPTY", title: 'Authorized submitter list empty', message: 'The governance registration has no active artifact submitter.', disposition: "HOLD", blocksRegistration: true, repairHint: 'Authorize at least one submitter.', controlFamily: "SUBMITTER" }),
  REGISTRATION_VALID_FROM_INVALID: Object.freeze({ code: "REGISTRATION_VALID_FROM_INVALID", title: 'Registration valid-from invalid', message: 'The governance registration valid-from date is invalid.', disposition: "INELIGIBLE", blocksRegistration: true, repairHint: 'Correct the registration validity date.', controlFamily: "TIMING" }),
  REGISTRATION_VALID_UNTIL_INVALID: Object.freeze({ code: "REGISTRATION_VALID_UNTIL_INVALID", title: 'Registration valid-until invalid', message: 'The governance registration valid-until date is invalid.', disposition: "INELIGIBLE", blocksRegistration: true, repairHint: 'Correct the registration expiry date.', controlFamily: "TIMING" }),
  SUBMISSION_TIME_INVALID: Object.freeze({ code: "SUBMISSION_TIME_INVALID", title: 'Submission time invalid', message: 'The artifact submission timestamp is invalid.', disposition: "INELIGIBLE", blocksRegistration: true, repairHint: 'Provide a valid UTC submission timestamp.', controlFamily: "TIMING" }),
  SUBMISSION_BEFORE_REGISTRATION: Object.freeze({ code: "SUBMISSION_BEFORE_REGISTRATION", title: 'Submission predates registration', message: 'The artifact submission predates the governance registration validity window.', disposition: "INELIGIBLE", blocksRegistration: true, repairHint: 'Register the governance before artifact submission.', controlFamily: "TIMING" }),
  SUBMISSION_AFTER_EXPIRY: Object.freeze({ code: "SUBMISSION_AFTER_EXPIRY", title: 'Submission after expiry', message: 'The artifact was submitted after registration expiry.', disposition: "INELIGIBLE", blocksRegistration: true, repairHint: 'Renew the governance registration.', controlFamily: "TIMING" }),
  PLAYGROUND_ROUTE_PARITY_MISSING: Object.freeze({ code: "PLAYGROUND_ROUTE_PARITY_MISSING", title: 'Playground route parity missing', message: 'A Playground submission lacks route parity with the registered route snapshot.', disposition: "HOLD", blocksRegistration: true, repairHint: 'Preserve the exact Playground route identity and version.', controlFamily: "ROUTE" }),
  MANUAL_IMPORT_REQUIRES_ESCALATION: Object.freeze({ code: "MANUAL_IMPORT_REQUIRES_ESCALATION", title: 'Manual import requires review', message: 'Manual imports require bounded institutional review before registry admission.', disposition: "ESCALATE", blocksRegistration: false, repairHint: 'Route the submission to institutional review.', controlFamily: "VERIFICATION" }),
  INDEPENDENT_REVIEW_REQUIRED: Object.freeze({ code: "INDEPENDENT_REVIEW_REQUIRED", title: 'Independent review required', message: 'The requested verification level requires an independent review record.', disposition: "HOLD", blocksRegistration: true, repairHint: 'Complete independent review.', controlFamily: "VERIFICATION" }),
  HIGH_CONSEQUENCE_REVIEW_REQUIRED: Object.freeze({ code: "HIGH_CONSEQUENCE_REVIEW_REQUIRED", title: 'High consequence review required', message: 'The action class requires named institutional review before registration.', disposition: "ESCALATE", blocksRegistration: true, repairHint: 'Complete the high-consequence review lane.', controlFamily: "VERIFICATION" }),
  PRODUCTION_ARTIFACT_REQUIRES_INSTITUTION_VERIFICATION: Object.freeze({ code: "PRODUCTION_ARTIFACT_REQUIRES_INSTITUTION_VERIFICATION", title: 'Production artifact requires institution verification', message: 'Production artifacts require an institution-verified governance registration.', disposition: "HOLD", blocksRegistration: true, repairHint: 'Complete institution verification.', controlFamily: "VERIFICATION" }),
  DEMONSTRATION_ARTIFACT_LABEL_MISSING: Object.freeze({ code: "DEMONSTRATION_ARTIFACT_LABEL_MISSING", title: 'Demonstration labeling missing', message: 'A demonstration artifact must remain visibly distinguished from production.', disposition: "HOLD", blocksRegistration: true, repairHint: 'Restore explicit demonstration classification and claims boundary.', controlFamily: "PUBLICATION" }),
  GOVERNANCE_PROFILE_URL_MISSING: Object.freeze({ code: "GOVERNANCE_PROFILE_URL_MISSING", title: 'Governance profile URL missing', message: 'Public publication requires a stable governance profile URL.', disposition: "HOLD", blocksRegistration: true, repairHint: 'Publish the governance profile and stable URL.', controlFamily: "PUBLICATION" }),
  REGISTRATION_CONTROL_FAILURE: Object.freeze({ code: "REGISTRATION_CONTROL_FAILURE", title: 'Registration control failed', message: 'A mandatory registration control failed.', disposition: "INELIGIBLE", blocksRegistration: true, repairHint: 'Repair the failed control before submission.', controlFamily: "AUDIT" }),
  REGISTRATION_CONTROL_HOLD: Object.freeze({ code: "REGISTRATION_CONTROL_HOLD", title: 'Registration control on hold', message: 'A mandatory registration control is unresolved.', disposition: "HOLD", blocksRegistration: true, repairHint: 'Resolve the control hold.', controlFamily: "AUDIT" }),
  REGISTRATION_CONTROL_ESCALATION: Object.freeze({ code: "REGISTRATION_CONTROL_ESCALATION", title: 'Registration control escalated', message: 'A registration control requires named institutional judgment.', disposition: "ESCALATE", blocksRegistration: false, repairHint: 'Complete the designated review.', controlFamily: "AUDIT" }),
});

export const REGISTRATION_CONTROLS: readonly RegistrationControlDefinition[] = Object.freeze([
  Object.freeze({ controlId: "REG-001", sequence: 1, family: "IDENTITY", title: 'Governance registration resolved', requirement: 'A governance registration must exist and match the submission.', failureCode: "GOVERNANCE_REGISTRATION_MISSING", mandatory: true, publicRelianceRelevant: true }),
  Object.freeze({ controlId: "REG-002", sequence: 2, family: "IDENTITY", title: 'Registration identifier parity', requirement: 'Submission and profile governance registration IDs must match.', failureCode: "GOVERNANCE_REGISTRATION_ID_MISMATCH", mandatory: true, publicRelianceRelevant: true }),
  Object.freeze({ controlId: "REG-003", sequence: 3, family: "STATUS", title: 'Active registration state', requirement: 'Only ACTIVE governance registrations may sponsor artifacts.', failureCode: "GOVERNANCE_REGISTRATION_NOT_ACTIVE", mandatory: true, publicRelianceRelevant: true }),
  Object.freeze({ controlId: "REG-004", sequence: 4, family: "VERIFICATION", title: 'Identity verification', requirement: 'Governance identity must be verified.', failureCode: "GOVERNANCE_IDENTITY_NOT_VERIFIED", mandatory: true, publicRelianceRelevant: false }),
  Object.freeze({ controlId: "REG-005", sequence: 5, family: "VERIFICATION", title: 'Institution verification for production', requirement: 'Production artifacts require institution verification.', failureCode: "PRODUCTION_ARTIFACT_REQUIRES_INSTITUTION_VERIFICATION", mandatory: true, publicRelianceRelevant: false }),
  Object.freeze({ controlId: "REG-006", sequence: 6, family: "AUDIT", title: 'Registration integrity commitment', requirement: 'Registration hash must be present.', failureCode: "REGISTRATION_HASH_MISSING", mandatory: true, publicRelianceRelevant: false }),
  Object.freeze({ controlId: "REG-007", sequence: 7, family: "PUBLICATION", title: 'Registry terms acceptance', requirement: 'Registry terms version must be recorded.', failureCode: "REGISTRY_TERMS_VERSION_MISSING", mandatory: true, publicRelianceRelevant: true }),
  Object.freeze({ controlId: "REG-008", sequence: 8, family: "IDENTITY", title: 'Accountable owner attribution', requirement: 'An accountable owner must be attributable.', failureCode: "ACCOUNTABLE_OWNER_MISSING", mandatory: true, publicRelianceRelevant: true }),
  Object.freeze({ controlId: "REG-009", sequence: 9, family: "IDENTITY", title: 'Registry steward attribution', requirement: 'A registry steward must be attributable.', failureCode: "REGISTRY_STEWARD_MISSING", mandatory: true, publicRelianceRelevant: true }),
  Object.freeze({ controlId: "REG-010", sequence: 10, family: "ARCHITECTURE", title: 'Architecture identifier parity', requirement: 'Artifact architecture ID must match the registration.', failureCode: "ARCHITECTURE_ID_MISMATCH", mandatory: true, publicRelianceRelevant: true }),
  Object.freeze({ controlId: "REG-011", sequence: 11, family: "ARCHITECTURE", title: 'Architecture version parity', requirement: 'Artifact architecture version must be registered.', failureCode: "ARCHITECTURE_VERSION_MISMATCH", mandatory: true, publicRelianceRelevant: true }),
  Object.freeze({ controlId: "REG-012", sequence: 12, family: "ARCHITECTURE", title: 'Architecture version active', requirement: 'Artifact architecture version must not be retired.', failureCode: "ARCHITECTURE_VERSION_RETIRED", mandatory: true, publicRelianceRelevant: true }),
  Object.freeze({ controlId: "REG-013", sequence: 13, family: "ARCHITECTURE", title: 'Architecture integrity commitment', requirement: 'Registered architecture hash must be present.', failureCode: "ARCHITECTURE_HASH_MISSING", mandatory: true, publicRelianceRelevant: true }),
  Object.freeze({ controlId: "REG-014", sequence: 14, family: "ARCHITECTURE", title: 'Determination support', requirement: 'Architecture must support the committed determination.', failureCode: "DETERMINATION_NOT_SUPPORTED", mandatory: true, publicRelianceRelevant: true }),
  Object.freeze({ controlId: "REG-015", sequence: 15, family: "SCOPE", title: 'Artifact classification support', requirement: 'Governance must support the artifact classification.', failureCode: "CLASSIFICATION_NOT_SUPPORTED", mandatory: true, publicRelianceRelevant: true }),
  Object.freeze({ controlId: "REG-016", sequence: 16, family: "SCOPE", title: 'Sector scope', requirement: 'Artifact sector must be registered.', failureCode: "SECTOR_OUTSIDE_REGISTERED_SCOPE", mandatory: true, publicRelianceRelevant: true }),
  Object.freeze({ controlId: "REG-017", sequence: 17, family: "SCOPE", title: 'Jurisdiction scope', requirement: 'Artifact jurisdiction must be registered.', failureCode: "JURISDICTION_OUTSIDE_REGISTERED_SCOPE", mandatory: true, publicRelianceRelevant: true }),
  Object.freeze({ controlId: "REG-018", sequence: 18, family: "SCOPE", title: 'Action class scope', requirement: 'Action class must be registered.', failureCode: "ACTION_CLASS_OUTSIDE_REGISTERED_SCOPE", mandatory: true, publicRelianceRelevant: true }),
  Object.freeze({ controlId: "REG-019", sequence: 19, family: "SCOPE", title: 'Consequence class scope', requirement: 'Consequence class must be registered.', failureCode: "CONSEQUENCE_CLASS_OUTSIDE_REGISTERED_SCOPE", mandatory: true, publicRelianceRelevant: true }),
  Object.freeze({ controlId: "REG-020", sequence: 20, family: "ROUTE", title: 'Route registration', requirement: 'Artifact route must be registered.', failureCode: "ROUTE_NOT_REGISTERED", mandatory: true, publicRelianceRelevant: true }),
  Object.freeze({ controlId: "REG-021", sequence: 21, family: "ROUTE", title: 'Route version registration', requirement: 'Artifact route version must be registered.', failureCode: "ROUTE_VERSION_NOT_REGISTERED", mandatory: true, publicRelianceRelevant: true }),
  Object.freeze({ controlId: "REG-022", sequence: 22, family: "IDENTITY", title: 'Artifact ownership parity', requirement: 'Artifact owner must map to the registered organization.', failureCode: "ARTIFACT_OWNER_MISMATCH", mandatory: true, publicRelianceRelevant: true }),
  Object.freeze({ controlId: "REG-023", sequence: 23, family: "IDENTITY", title: 'Artifact steward authority', requirement: 'Artifact steward must be authorized.', failureCode: "ARTIFACT_STEWARD_MISMATCH", mandatory: true, publicRelianceRelevant: true }),
  Object.freeze({ controlId: "REG-024", sequence: 24, family: "SUBMITTER", title: 'Submitter authorization', requirement: 'Submitting actor must be authorized.', failureCode: "SUBMITTER_NOT_AUTHORIZED", mandatory: true, publicRelianceRelevant: false }),
  Object.freeze({ controlId: "REG-025", sequence: 25, family: "SUBMITTER", title: 'Submitter validity window', requirement: 'Submitter authorization must be current.', failureCode: "SUBMITTER_AUTHORIZATION_EXPIRED", mandatory: true, publicRelianceRelevant: false }),
  Object.freeze({ controlId: "REG-026", sequence: 26, family: "SUBMITTER", title: 'Submitter revocation state', requirement: 'Submitter authorization must not be revoked.', failureCode: "SUBMITTER_AUTHORIZATION_REVOKED", mandatory: true, publicRelianceRelevant: false }),
  Object.freeze({ controlId: "REG-027", sequence: 27, family: "SUBMITTER", title: 'Submitter classification authority', requirement: 'Submitter must be authorized for the classification.', failureCode: "SUBMITTER_CLASSIFICATION_NOT_AUTHORIZED", mandatory: true, publicRelianceRelevant: false }),
  Object.freeze({ controlId: "REG-028", sequence: 28, family: "SUBMITTER", title: 'Submitter sector authority', requirement: 'Submitter must be authorized for the sector.', failureCode: "SUBMITTER_SECTOR_NOT_AUTHORIZED", mandatory: true, publicRelianceRelevant: false }),
  Object.freeze({ controlId: "REG-029", sequence: 29, family: "SUBMITTER", title: 'Submitter route authority', requirement: 'Submitter must be authorized for the route.', failureCode: "SUBMITTER_ROUTE_NOT_AUTHORIZED", mandatory: true, publicRelianceRelevant: false }),
  Object.freeze({ controlId: "REG-030", sequence: 30, family: "ARTIFACT", title: 'Canonical validation', requirement: 'Canonical artifact validation must pass.', failureCode: "ARTIFACT_VALIDATION_FAILED", mandatory: true, publicRelianceRelevant: true }),
  Object.freeze({ controlId: "REG-031", sequence: 31, family: "PUBLICATION", title: 'Publication readiness', requirement: 'Artifact must be publication ready for public registration.', failureCode: "ARTIFACT_NOT_PUBLICATION_READY", mandatory: true, publicRelianceRelevant: true }),
  Object.freeze({ controlId: "REG-032", sequence: 32, family: "PUBLICATION", title: 'Mandatory attestations', requirement: 'All required attestations must be present.', failureCode: "ARTIFACT_REGISTRATION_ATTESTATION_MISSING", mandatory: true, publicRelianceRelevant: true }),
  Object.freeze({ controlId: "REG-033", sequence: 33, family: "ARTIFACT", title: 'Governance linkage', requirement: 'Artifact package must link to governance registration.', failureCode: "ARTIFACT_GOVERNANCE_LINK_MISSING", mandatory: true, publicRelianceRelevant: true }),
  Object.freeze({ controlId: "REG-034", sequence: 34, family: "ARCHITECTURE", title: 'Architecture linkage', requirement: 'Artifact package must link to architecture identity.', failureCode: "ARTIFACT_ARCHITECTURE_LINK_MISSING", mandatory: true, publicRelianceRelevant: true }),
  Object.freeze({ controlId: "REG-035", sequence: 35, family: "ROUTE", title: 'Route linkage', requirement: 'Artifact package must link to route identity.', failureCode: "ARTIFACT_ROUTE_LINK_MISSING", mandatory: true, publicRelianceRelevant: true }),
  Object.freeze({ controlId: "REG-036", sequence: 36, family: "ARTIFACT", title: 'Unique artifact identifier', requirement: 'Artifact ID must be unique.', failureCode: "ARTIFACT_DUPLICATE_ID", mandatory: true, publicRelianceRelevant: true }),
  Object.freeze({ controlId: "REG-037", sequence: 37, family: "ARTIFACT", title: 'Unique canonical record', requirement: 'Canonical hash must not duplicate an existing artifact without review.', failureCode: "ARTIFACT_DUPLICATE_HASH", mandatory: true, publicRelianceRelevant: true }),
  Object.freeze({ controlId: "REG-038", sequence: 38, family: "SCOPE", title: 'Scope clarity', requirement: 'Artifact scope must be unambiguous.', failureCode: "ARTIFACT_SCOPE_AMBIGUOUS", mandatory: true, publicRelianceRelevant: true }),
  Object.freeze({ controlId: "REG-039", sequence: 39, family: "CLAIMS", title: 'Claim registration parity', requirement: 'Artifact claims must be declared by the governance profile.', failureCode: "ARTIFACT_CLAIM_OUTSIDE_REGISTRATION", mandatory: true, publicRelianceRelevant: false }),
  Object.freeze({ controlId: "REG-040", sequence: 40, family: "CLAIMS", title: 'Governance claim availability', requirement: 'Governance profile must contain bounded claims.', failureCode: "GOVERNANCE_CLAIMS_EMPTY", mandatory: true, publicRelianceRelevant: false }),
  Object.freeze({ controlId: "REG-041", sequence: 41, family: "SCOPE", title: 'Governance scope availability', requirement: 'Governance profile must contain usable scope.', failureCode: "GOVERNANCE_SCOPE_EMPTY", mandatory: true, publicRelianceRelevant: true }),
  Object.freeze({ controlId: "REG-042", sequence: 42, family: "SUBMITTER", title: 'Authorized submitter availability', requirement: 'Governance profile must have an authorized submitter.', failureCode: "AUTHORIZED_SUBMITTERS_EMPTY", mandatory: true, publicRelianceRelevant: false }),
  Object.freeze({ controlId: "REG-043", sequence: 43, family: "TIMING", title: 'Registration start validity', requirement: 'Registration valid-from must be a valid timestamp.', failureCode: "REGISTRATION_VALID_FROM_INVALID", mandatory: true, publicRelianceRelevant: false }),
  Object.freeze({ controlId: "REG-044", sequence: 44, family: "TIMING", title: 'Registration expiry validity', requirement: 'Registration valid-until must be valid when present.', failureCode: "REGISTRATION_VALID_UNTIL_INVALID", mandatory: true, publicRelianceRelevant: false }),
  Object.freeze({ controlId: "REG-045", sequence: 45, family: "TIMING", title: 'Submission timestamp validity', requirement: 'Submission time must be valid UTC.', failureCode: "SUBMISSION_TIME_INVALID", mandatory: true, publicRelianceRelevant: false }),
  Object.freeze({ controlId: "REG-046", sequence: 46, family: "TIMING", title: 'Registration before submission', requirement: 'Governance registration must precede artifact submission.', failureCode: "SUBMISSION_BEFORE_REGISTRATION", mandatory: true, publicRelianceRelevant: false }),
  Object.freeze({ controlId: "REG-047", sequence: 47, family: "TIMING", title: 'Submission before expiry', requirement: 'Submission must occur before registration expiry.', failureCode: "SUBMISSION_AFTER_EXPIRY", mandatory: true, publicRelianceRelevant: false }),
  Object.freeze({ controlId: "REG-048", sequence: 48, family: "ROUTE", title: 'Playground route parity', requirement: 'Playground artifacts must preserve route parity.', failureCode: "PLAYGROUND_ROUTE_PARITY_MISSING", mandatory: true, publicRelianceRelevant: true }),
  Object.freeze({ controlId: "REG-049", sequence: 49, family: "VERIFICATION", title: 'Manual import review', requirement: 'Manual imports require institutional review.', failureCode: "MANUAL_IMPORT_REQUIRES_ESCALATION", mandatory: true, publicRelianceRelevant: false }),
  Object.freeze({ controlId: "REG-050", sequence: 50, family: "VERIFICATION", title: 'Independent review threshold', requirement: 'Requested high verification level must have review evidence.', failureCode: "INDEPENDENT_REVIEW_REQUIRED", mandatory: true, publicRelianceRelevant: false }),
  Object.freeze({ controlId: "REG-051", sequence: 51, family: "VERIFICATION", title: 'High consequence review', requirement: 'High consequence action classes require named review.', failureCode: "HIGH_CONSEQUENCE_REVIEW_REQUIRED", mandatory: true, publicRelianceRelevant: false }),
  Object.freeze({ controlId: "REG-052", sequence: 52, family: "PUBLICATION", title: 'Demonstration labeling', requirement: 'Demonstration artifacts must remain visibly labeled.', failureCode: "DEMONSTRATION_ARTIFACT_LABEL_MISSING", mandatory: true, publicRelianceRelevant: true }),
  Object.freeze({ controlId: "REG-053", sequence: 53, family: "PUBLICATION", title: 'Public governance profile', requirement: 'Public artifacts require a stable governance profile URL.', failureCode: "GOVERNANCE_PROFILE_URL_MISSING", mandatory: true, publicRelianceRelevant: true }),
  Object.freeze({ controlId: "REG-054", sequence: 54, family: "VERIFICATION", title: 'Institutional control 54', requirement: 'Institutional registry control 54 must be evaluated and preserved in the eligibility ledger.', failureCode: "REGISTRATION_CONTROL_FAILURE", mandatory: true, publicRelianceRelevant: false }),
  Object.freeze({ controlId: "REG-055", sequence: 55, family: "PUBLICATION", title: 'Institutional control 55', requirement: 'Institutional registry control 55 must be evaluated and preserved in the eligibility ledger.', failureCode: "REGISTRATION_CONTROL_HOLD", mandatory: true, publicRelianceRelevant: true }),
  Object.freeze({ controlId: "REG-056", sequence: 56, family: "AUDIT", title: 'Institutional control 56', requirement: 'Institutional registry control 56 must be evaluated and preserved in the eligibility ledger.', failureCode: "REGISTRATION_CONTROL_ESCALATION", mandatory: true, publicRelianceRelevant: false }),
  Object.freeze({ controlId: "REG-057", sequence: 57, family: "ARTIFACT", title: 'Institutional control 57', requirement: 'Institutional registry control 57 must be evaluated and preserved in the eligibility ledger.', failureCode: "REGISTRATION_CONTROL_FAILURE", mandatory: true, publicRelianceRelevant: true }),
  Object.freeze({ controlId: "REG-058", sequence: 58, family: "VERIFICATION", title: 'Institutional control 58', requirement: 'Institutional registry control 58 must be evaluated and preserved in the eligibility ledger.', failureCode: "REGISTRATION_CONTROL_HOLD", mandatory: true, publicRelianceRelevant: false }),
  Object.freeze({ controlId: "REG-059", sequence: 59, family: "PUBLICATION", title: 'Institutional control 59', requirement: 'Institutional registry control 59 must be evaluated and preserved in the eligibility ledger.', failureCode: "REGISTRATION_CONTROL_ESCALATION", mandatory: true, publicRelianceRelevant: true }),
  Object.freeze({ controlId: "REG-060", sequence: 60, family: "AUDIT", title: 'Institutional control 60', requirement: 'Institutional registry control 60 must be evaluated and preserved in the eligibility ledger.', failureCode: "REGISTRATION_CONTROL_FAILURE", mandatory: true, publicRelianceRelevant: false }),
  Object.freeze({ controlId: "REG-061", sequence: 61, family: "ARTIFACT", title: 'Institutional control 61', requirement: 'Institutional registry control 61 must be evaluated and preserved in the eligibility ledger.', failureCode: "REGISTRATION_CONTROL_HOLD", mandatory: true, publicRelianceRelevant: true }),
  Object.freeze({ controlId: "REG-062", sequence: 62, family: "VERIFICATION", title: 'Institutional control 62', requirement: 'Institutional registry control 62 must be evaluated and preserved in the eligibility ledger.', failureCode: "REGISTRATION_CONTROL_ESCALATION", mandatory: true, publicRelianceRelevant: false }),
  Object.freeze({ controlId: "REG-063", sequence: 63, family: "PUBLICATION", title: 'Institutional control 63', requirement: 'Institutional registry control 63 must be evaluated and preserved in the eligibility ledger.', failureCode: "REGISTRATION_CONTROL_FAILURE", mandatory: true, publicRelianceRelevant: true }),
  Object.freeze({ controlId: "REG-064", sequence: 64, family: "AUDIT", title: 'Institutional control 64', requirement: 'Institutional registry control 64 must be evaluated and preserved in the eligibility ledger.', failureCode: "REGISTRATION_CONTROL_HOLD", mandatory: true, publicRelianceRelevant: false }),
  Object.freeze({ controlId: "REG-065", sequence: 65, family: "ARTIFACT", title: 'Institutional control 65', requirement: 'Institutional registry control 65 must be evaluated and preserved in the eligibility ledger.', failureCode: "REGISTRATION_CONTROL_ESCALATION", mandatory: true, publicRelianceRelevant: true }),
  Object.freeze({ controlId: "REG-066", sequence: 66, family: "VERIFICATION", title: 'Institutional control 66', requirement: 'Institutional registry control 66 must be evaluated and preserved in the eligibility ledger.', failureCode: "REGISTRATION_CONTROL_FAILURE", mandatory: true, publicRelianceRelevant: false }),
  Object.freeze({ controlId: "REG-067", sequence: 67, family: "PUBLICATION", title: 'Institutional control 67', requirement: 'Institutional registry control 67 must be evaluated and preserved in the eligibility ledger.', failureCode: "REGISTRATION_CONTROL_HOLD", mandatory: true, publicRelianceRelevant: true }),
  Object.freeze({ controlId: "REG-068", sequence: 68, family: "AUDIT", title: 'Institutional control 68', requirement: 'Institutional registry control 68 must be evaluated and preserved in the eligibility ledger.', failureCode: "REGISTRATION_CONTROL_ESCALATION", mandatory: true, publicRelianceRelevant: false }),
  Object.freeze({ controlId: "REG-069", sequence: 69, family: "ARTIFACT", title: 'Institutional control 69', requirement: 'Institutional registry control 69 must be evaluated and preserved in the eligibility ledger.', failureCode: "REGISTRATION_CONTROL_FAILURE", mandatory: true, publicRelianceRelevant: true }),
  Object.freeze({ controlId: "REG-070", sequence: 70, family: "VERIFICATION", title: 'Institutional control 70', requirement: 'Institutional registry control 70 must be evaluated and preserved in the eligibility ledger.', failureCode: "REGISTRATION_CONTROL_HOLD", mandatory: true, publicRelianceRelevant: false }),
  Object.freeze({ controlId: "REG-071", sequence: 71, family: "PUBLICATION", title: 'Institutional control 71', requirement: 'Institutional registry control 71 must be evaluated and preserved in the eligibility ledger.', failureCode: "REGISTRATION_CONTROL_ESCALATION", mandatory: true, publicRelianceRelevant: true }),
  Object.freeze({ controlId: "REG-072", sequence: 72, family: "AUDIT", title: 'Institutional control 72', requirement: 'Institutional registry control 72 must be evaluated and preserved in the eligibility ledger.', failureCode: "REGISTRATION_CONTROL_FAILURE", mandatory: true, publicRelianceRelevant: false }),
]);


export const REGISTRATION_STATUS_TRANSITIONS = Object.freeze({
  DRAFT: Object.freeze(["PENDING_REVIEW", "WITHDRAWN"] as GovernanceRegistrationStatus[]),
  PENDING_REVIEW: Object.freeze(["ACTIVE", "REJECTED", "WITHDRAWN"] as GovernanceRegistrationStatus[]),
  ACTIVE: Object.freeze(["SUSPENDED", "EXPIRED", "WITHDRAWN"] as GovernanceRegistrationStatus[]),
  SUSPENDED: Object.freeze(["ACTIVE", "WITHDRAWN", "EXPIRED"] as GovernanceRegistrationStatus[]),
  EXPIRED: Object.freeze(["PENDING_REVIEW", "WITHDRAWN"] as GovernanceRegistrationStatus[]),
  WITHDRAWN: Object.freeze([] as GovernanceRegistrationStatus[]),
  REJECTED: Object.freeze(["DRAFT"] as GovernanceRegistrationStatus[]),
}) satisfies Readonly<Record<GovernanceRegistrationStatus, readonly GovernanceRegistrationStatus[]>>;

export function evaluateRegistrationTransition(
  request: RegistrationTransitionRequest,
): RegistrationTransitionDecision {
  const allowed = REGISTRATION_STATUS_TRANSITIONS[request.from].includes(request.to);
  return {
    allowed,
    from: request.from,
    to: request.to,
    reason: allowed
      ? `Transition ${request.from} -> ${request.to} is permitted.`
      : `Transition ${request.from} -> ${request.to} is not permitted by the registry state model.`,
  };
}

export function summarizeGovernanceRegistration(
  registration: GovernanceRegistration,
): GovernanceRegistrationSummary {
  return {
    governanceRegistrationId: registration.governanceRegistrationId,
    legalName: registration.organization.legalName,
    displayName: registration.organization.displayName,
    architecture: registration.architecture.name,
    architectureVersion: registration.architecture.version,
    status: registration.status,
    verificationState: registration.verificationState,
    sectors: [...registration.scope.sectors],
    jurisdictions: [...registration.scope.jurisdictions],
    claimCount: registration.claims.length,
    authorizedSubmitterCount: registration.authorizedSubmitters.filter((submitter) => submitter.maySubmit).length,
    validFrom: registration.validFrom,
    ...(registration.validUntil ? { validUntil: registration.validUntil } : {}),
    ...(registration.publicProfileUrl ? { publicProfileUrl: registration.publicProfileUrl } : {}),
  };
}

function resolveAuthorizedSubmitter(
  registration: GovernanceRegistration,
  submitterId: string,
): AuthorizedSubmitter | undefined {
  return registration.authorizedSubmitters.find((submitter) => submitter.submitterId === submitterId);
}

function evaluateStatus(
  registration: GovernanceRegistration,
  findings: EligibilityFinding[],
): void {
  if (registration.status === "ACTIVE") return;
  const codeByStatus: Partial<Record<GovernanceRegistrationStatus, EligibilityReasonCode>> = {
    SUSPENDED: "GOVERNANCE_REGISTRATION_SUSPENDED",
    EXPIRED: "GOVERNANCE_REGISTRATION_EXPIRED",
    WITHDRAWN: "GOVERNANCE_REGISTRATION_WITHDRAWN",
    REJECTED: "GOVERNANCE_REGISTRATION_REJECTED",
  };
  findings.push(createFinding(codeByStatus[registration.status] ?? "GOVERNANCE_REGISTRATION_NOT_ACTIVE", "governance.status", { status: registration.status }));
}

function evaluateTiming(
  registration: GovernanceRegistration,
  submittedAt: string,
  findings: EligibilityFinding[],
): void {
  if (!isIsoDate(registration.validFrom)) {
    findings.push(createFinding("REGISTRATION_VALID_FROM_INVALID", "governance.validFrom"));
  }
  if (registration.validUntil && !isIsoDate(registration.validUntil)) {
    findings.push(createFinding("REGISTRATION_VALID_UNTIL_INVALID", "governance.validUntil"));
  }
  if (!isIsoDate(submittedAt)) {
    findings.push(createFinding("SUBMISSION_TIME_INVALID", "context.submittedAt"));
    return;
  }
  if (isIsoDate(registration.validFrom) && compareIso(submittedAt, registration.validFrom) < 0) {
    findings.push(createFinding("SUBMISSION_BEFORE_REGISTRATION", "context.submittedAt", { submittedAt, validFrom: registration.validFrom }));
  }
  if (registration.validUntil && isIsoDate(registration.validUntil) && compareIso(submittedAt, registration.validUntil) > 0) {
    findings.push(createFinding("SUBMISSION_AFTER_EXPIRY", "context.submittedAt", { submittedAt, validUntil: registration.validUntil }));
  }
}

function evaluateGovernanceIdentity(
  registration: GovernanceRegistration,
  context: ArtifactSubmissionContext,
  findings: EligibilityFinding[],
): void {
  if (!GOVERNANCE_REGISTRATION_ID_PATTERN.test(registration.governanceRegistrationId)) {
    findings.push(createFinding("GOVERNANCE_REGISTRATION_ID_MISMATCH", "governance.governanceRegistrationId", { actual: registration.governanceRegistrationId }));
  }
  if (registration.governanceRegistrationId !== context.governanceRegistrationId) {
    findings.push(createFinding("GOVERNANCE_REGISTRATION_ID_MISMATCH", "context.governanceRegistrationId", {
      submitted: context.governanceRegistrationId,
      resolved: registration.governanceRegistrationId,
    }));
  }
  if (!isNonEmptyString(registration.organization.accountableOwnerId) || !isNonEmptyString(registration.organization.accountableOwnerName)) {
    findings.push(createFinding("ACCOUNTABLE_OWNER_MISSING", "governance.organization.accountableOwnerId"));
  }
  if (!isNonEmptyString(registration.organization.registryStewardId) || !isNonEmptyString(registration.organization.registryStewardName)) {
    findings.push(createFinding("REGISTRY_STEWARD_MISSING", "governance.organization.registryStewardId"));
  }
  if (!isNonEmptyString(registration.registrationHash)) {
    findings.push(createFinding("REGISTRATION_HASH_MISSING", "governance.registrationHash"));
  }
  if (!isNonEmptyString(registration.registryTermsVersion)) {
    findings.push(createFinding("REGISTRY_TERMS_VERSION_MISSING", "governance.registryTermsVersion"));
  }
}

function evaluateVerification(
  registration: GovernanceRegistration,
  artifact: CanonicalExecutionArtifact,
  context: ArtifactSubmissionContext,
  findings: EligibilityFinding[],
): void {
  if (registration.verificationState === "UNVERIFIED") {
    findings.push(createFinding("GOVERNANCE_IDENTITY_NOT_VERIFIED", "governance.verificationState"));
  }
  if (
    artifact.identity.classification === "PRODUCTION" &&
    !["INSTITUTION_VERIFIED", "INDEPENDENTLY_REVIEWED"].includes(registration.verificationState)
  ) {
    findings.push(createFinding("PRODUCTION_ARTIFACT_REQUIRES_INSTITUTION_VERIFICATION", "governance.verificationState"));
  }
  if (context.requestedVerificationLevel >= 7 && registration.verificationState !== "INDEPENDENTLY_REVIEWED") {
    findings.push(createFinding("INDEPENDENT_REVIEW_REQUIRED", "context.requestedVerificationLevel"));
  }
}

function evaluateArchitecture(
  registration: GovernanceRegistration,
  artifact: CanonicalExecutionArtifact,
  context: ArtifactSubmissionContext,
  findings: EligibilityFinding[],
): void {
  const architecture = registration.architecture;
  if (context.architectureId !== architecture.architectureId) {
    findings.push(createFinding("ARCHITECTURE_ID_MISMATCH", "context.architectureId", {
      submitted: context.architectureId,
      registered: architecture.architectureId,
    }));
  }
  if (context.architectureVersion !== architecture.version) {
    findings.push(createFinding("ARCHITECTURE_VERSION_MISMATCH", "context.architectureVersion", {
      submitted: context.architectureVersion,
      registered: architecture.version,
    }));
  }
  if (architecture.retiredVersions.includes(context.architectureVersion)) {
    findings.push(createFinding("ARCHITECTURE_VERSION_RETIRED", "context.architectureVersion"));
  }
  if (!isNonEmptyString(architecture.canonicalHash)) {
    findings.push(createFinding("ARCHITECTURE_HASH_MISSING", "governance.architecture.canonicalHash"));
  }
  if (!architecture.supportedDeterminations.includes(artifact.commit.determination)) {
    findings.push(createFinding("DETERMINATION_NOT_SUPPORTED", "artifact.commit.determination"));
  }
  if (!architecture.supportedClassifications.includes(artifact.identity.classification)) {
    findings.push(createFinding("CLASSIFICATION_NOT_SUPPORTED", "artifact.identity.classification"));
  }
}

function evaluateScope(
  registration: GovernanceRegistration,
  context: ArtifactSubmissionContext,
  findings: EligibilityFinding[],
): void {
  const scope = registration.scope;
  if (scope.sectors.length === 0 || scope.jurisdictions.length === 0) {
    findings.push(createFinding("GOVERNANCE_SCOPE_EMPTY", "governance.scope"));
  }
  if (!includesNormalized(scope.sectors, context.sector)) {
    findings.push(createFinding("SECTOR_OUTSIDE_REGISTERED_SCOPE", "context.sector", { sector: context.sector }));
  }
  if (!includesNormalized(scope.jurisdictions, context.jurisdiction)) {
    findings.push(createFinding("JURISDICTION_OUTSIDE_REGISTERED_SCOPE", "context.jurisdiction", { jurisdiction: context.jurisdiction }));
  }
  if (!includesNormalized(scope.actionClasses, context.actionClass)) {
    findings.push(createFinding("ACTION_CLASS_OUTSIDE_REGISTERED_SCOPE", "context.actionClass", { actionClass: context.actionClass }));
  }
  if (!includesNormalized(scope.consequenceClasses, context.consequenceClass)) {
    findings.push(createFinding("CONSEQUENCE_CLASS_OUTSIDE_REGISTERED_SCOPE", "context.consequenceClass", { consequenceClass: context.consequenceClass }));
  }
}

function evaluateRoute(
  registration: GovernanceRegistration,
  artifact: CanonicalExecutionArtifact,
  context: ArtifactSubmissionContext,
  findings: EligibilityFinding[],
): void {
  const architecture = registration.architecture;
  if (artifact.route.routeId !== context.declaredRouteId) {
    findings.push(createFinding("ARTIFACT_ROUTE_LINK_MISSING", "context.declaredRouteId", {
      declared: context.declaredRouteId,
      artifact: artifact.route.routeId,
    }));
  }
  if (artifact.route.version !== context.declaredRouteVersion) {
    findings.push(createFinding("ARTIFACT_ROUTE_LINK_MISSING", "context.declaredRouteVersion", {
      declared: context.declaredRouteVersion,
      artifact: artifact.route.version,
    }));
  }
  if (!architecture.supportedRouteIds.includes(artifact.route.routeId)) {
    findings.push(createFinding("ROUTE_NOT_REGISTERED", "artifact.route.routeId", { routeId: artifact.route.routeId }));
  }
  const versions = architecture.supportedRouteVersions[artifact.route.routeId] ?? [];
  if (!versions.includes(artifact.route.version)) {
    findings.push(createFinding("ROUTE_VERSION_NOT_REGISTERED", "artifact.route.version", {
      routeId: artifact.route.routeId,
      version: artifact.route.version,
    }));
  }
  if (context.submissionChannel === "PLAYGROUND" && (
    artifact.route.routeId !== context.declaredRouteId || artifact.route.version !== context.declaredRouteVersion
  )) {
    findings.push(createFinding("PLAYGROUND_ROUTE_PARITY_MISSING", "context.submissionChannel"));
  }
}

function evaluateSubmitter(
  registration: GovernanceRegistration,
  artifact: CanonicalExecutionArtifact,
  context: ArtifactSubmissionContext,
  findings: EligibilityFinding[],
): AuthorizedSubmitter | undefined {
  if (registration.authorizedSubmitters.length === 0) {
    findings.push(createFinding("AUTHORIZED_SUBMITTERS_EMPTY", "governance.authorizedSubmitters"));
  }
  const submitter = resolveAuthorizedSubmitter(registration, context.submittedBy);
  if (!submitter || !submitter.maySubmit) {
    findings.push(createFinding("SUBMITTER_NOT_AUTHORIZED", "context.submittedBy", { submittedBy: context.submittedBy }));
    return submitter;
  }
  if (submitter.revokedAt && compareIso(context.submittedAt, submitter.revokedAt) >= 0) {
    findings.push(createFinding("SUBMITTER_AUTHORIZATION_REVOKED", "governance.authorizedSubmitters", { revokedAt: submitter.revokedAt }));
  }
  if (submitter.validUntil && compareIso(context.submittedAt, submitter.validUntil) > 0) {
    findings.push(createFinding("SUBMITTER_AUTHORIZATION_EXPIRED", "governance.authorizedSubmitters", { validUntil: submitter.validUntil }));
  }
  if (!submitter.artifactClassifications.includes(artifact.identity.classification)) {
    findings.push(createFinding("SUBMITTER_CLASSIFICATION_NOT_AUTHORIZED", "governance.authorizedSubmitters"));
  }
  if (submitter.sectors.length > 0 && !includesNormalized(submitter.sectors, context.sector)) {
    findings.push(createFinding("SUBMITTER_SECTOR_NOT_AUTHORIZED", "governance.authorizedSubmitters"));
  }
  if (submitter.routeIds.length > 0 && !submitter.routeIds.includes(artifact.route.routeId)) {
    findings.push(createFinding("SUBMITTER_ROUTE_NOT_AUTHORIZED", "governance.authorizedSubmitters"));
  }
  return submitter;
}

function evaluateOwnership(
  registration: GovernanceRegistration,
  artifact: CanonicalExecutionArtifact,
  submitter: AuthorizedSubmitter | undefined,
  findings: EligibilityFinding[],
): void {
  const organizationNames = [
    registration.organization.legalName,
    registration.organization.displayName,
    registration.organization.legalEntityId,
  ];
  if (!organizationNames.some((value) => includesNormalized([value], artifact.identity.owner))) {
    findings.push(createFinding("ARTIFACT_OWNER_MISMATCH", "artifact.identity.owner", {
      artifactOwner: artifact.identity.owner,
      legalName: registration.organization.legalName,
    }));
  }
  const stewardIds = unique([
    registration.organization.registryStewardId,
    registration.organization.registryStewardName,
    ...(submitter ? [submitter.submitterId, submitter.name] : []),
  ]);
  if (!stewardIds.some((value) => includesNormalized([value], artifact.identity.steward))) {
    findings.push(createFinding("ARTIFACT_STEWARD_MISMATCH", "artifact.identity.steward", {
      artifactSteward: artifact.identity.steward,
    }));
  }
}

function evaluateClaims(
  registration: GovernanceRegistration,
  artifact: CanonicalExecutionArtifact,
  findings: EligibilityFinding[],
): void {
  if (registration.claims.length === 0) {
    findings.push(createFinding("GOVERNANCE_CLAIMS_EMPTY", "governance.claims"));
    return;
  }
  const artifactClaims = artifact.review.claimsBoundary.proves;
  const declaredText = registration.claims.map((claim) => claim.statement.toLowerCase()).join(" ");
  for (const claim of artifactClaims) {
    const tokens = claim.toLowerCase().split(/\W+/).filter((token) => token.length >= 5);
    const supported = tokens.length === 0 || tokens.some((token) => declaredText.includes(token));
    if (!supported) {
      findings.push(createFinding("ARTIFACT_CLAIM_OUTSIDE_REGISTRATION", "artifact.review.claimsBoundary.proves", { claim }));
    }
  }
}

function evaluateAttestations(
  context: ArtifactSubmissionContext,
  findings: EligibilityFinding[],
): void {
  for (const attestation of REQUIRED_ATTESTATIONS) {
    if (!context.attestations.includes(attestation)) {
      findings.push(createFinding("ARTIFACT_REGISTRATION_ATTESTATION_MISSING", "context.attestations", { attestation }));
    }
  }
}

function evaluateDuplicates(
  artifact: CanonicalExecutionArtifact,
  duplicateIndex: RegistryDuplicateIndex | undefined,
  findings: EligibilityFinding[],
): void {
  if (!duplicateIndex) return;
  if (duplicateIndex.artifactIds.has(artifact.identity.artifactId)) {
    findings.push(createFinding("ARTIFACT_DUPLICATE_ID", "artifact.identity.artifactId"));
  }
  if (duplicateIndex.canonicalHashes.has(artifact.integrity.canonicalHash)) {
    findings.push(createFinding("ARTIFACT_DUPLICATE_HASH", "artifact.integrity.canonicalHash"));
  }
}

function evaluateSpecialReview(
  registration: GovernanceRegistration,
  artifact: CanonicalExecutionArtifact,
  context: ArtifactSubmissionContext,
  options: EligibilityEvaluationOptions,
  findings: EligibilityFinding[],
): void {
  if (context.submissionChannel === "MANUAL_IMPORT") {
    findings.push(createFinding("MANUAL_IMPORT_REQUIRES_ESCALATION", "context.submissionChannel"));
  }
  if (options.highConsequenceActionClasses?.some((value) => includesNormalized([value], context.actionClass))) {
    if (registration.verificationState !== "INDEPENDENTLY_REVIEWED") {
      findings.push(createFinding("HIGH_CONSEQUENCE_REVIEW_REQUIRED", "context.actionClass"));
    }
  }
  if (
    artifact.identity.classification === "DEMONSTRATION" &&
    artifact.scenario.classification !== "DEMONSTRATION"
  ) {
    findings.push(createFinding("DEMONSTRATION_ARTIFACT_LABEL_MISSING", "artifact.scenario.classification"));
  }
  if (
    options.requirePublicProfileForPublication !== false &&
    context.intendedRegistryStatus === "PUBLISHED" &&
    !isNonEmptyString(registration.publicProfileUrl)
  ) {
    findings.push(createFinding("GOVERNANCE_PROFILE_URL_MISSING", "governance.publicProfileUrl"));
  }
}

function controlResultForFinding(
  control: RegistrationControlDefinition,
  findings: readonly EligibilityFinding[],
): RegistrationControlResult {
  const matching = findings.filter((finding) => finding.code === control.failureCode);
  if (matching.length === 0) return "PASS";
  const disposition = highestDisposition(matching);
  if (disposition === "INELIGIBLE") return "FAIL";
  if (disposition === "ESCALATE") return "ESCALATE";
  if (disposition === "HOLD") return "HOLD";
  return "PASS";
}

function buildControlEvaluations(
  findings: readonly EligibilityFinding[],
  evaluatedAt: string,
): RegistrationControlEvaluation[] {
  return REGISTRATION_CONTROLS.map((control) => {
    const result = controlResultForFinding(control, findings);
    return {
      control,
      result,
      evaluatedAt,
      evidenceRefs: findings.filter((finding) => finding.code === control.failureCode).map((finding) => finding.path),
      explanation: result === "PASS"
        ? `Control ${control.controlId} passed.`
        : `Control ${control.controlId} produced ${result} through ${control.failureCode}.`,
    };
  });
}

function buildAuditEvents(
  request: ArtifactRegistrationRequest,
  decision: Omit<ArtifactEligibilityDecision, "auditEvents">,
): RegistryEligibilityAuditEvent[] {
  const events: RegistryEligibilityAuditEvent[] = [];
  let previousHash = "GENESIS";
  const add = (eventType: RegistryEligibilityAuditEvent["eventType"], subjectId: string, detail: string) => {
    const event = auditEvent(previousHash, decision.evaluatedAt, request.context.submittedBy, eventType, subjectId, detail);
    events.push(event);
    previousHash = event.eventHash;
  };
  add("ELIGIBILITY_EVALUATION_STARTED", decision.evaluationId, "Artifact registry eligibility evaluation started.");
  add(
    "GOVERNANCE_REGISTRATION_RESOLVED",
    decision.governanceRegistrationId ?? "UNRESOLVED",
    request.governance ? `Resolved ${request.governance.organization.displayName}.` : "No governance registration resolved.",
  );
  add("SUBMITTER_RESOLVED", request.context.submittedBy, "Submitting actor evaluated against governance authorization.");
  add("ARTIFACT_VALIDATED", request.artifact.identity.artifactId, `Canonical validation issue count: ${decision.artifactValidation.issueCount}.`);
  for (const evaluation of decision.controls) {
    add("CONTROL_EVALUATED", evaluation.control.controlId, `${evaluation.result}: ${evaluation.explanation}`);
  }
  add("ELIGIBILITY_DECISION_COMMITTED", decision.evaluationId, `${decision.disposition}; next action ${decision.permittedNextAction}.`);
  return events;
}

export function evaluateArtifactRegistrationEligibility(
  request: ArtifactRegistrationRequest,
  options: EligibilityEvaluationOptions = {},
): ArtifactEligibilityDecision {
  const evaluatedAt = options.now ?? new Date().toISOString();
  const findings: EligibilityFinding[] = [];
  const validation = validateCanonicalExecutionArtifact(request.artifact, {
    now: evaluatedAt,
    intendedUse: request.context.intendedRegistryStatus === "PUBLISHED" ? "PUBLICATION" : "INTERNAL_REVIEW",
    strict: options.strict ?? true,
    requireSignature: false,
    requireOfflineVerification: request.context.requestedVerificationLevel >= 1,
  });

  if (!request.governance) {
    findings.push(createFinding("GOVERNANCE_REGISTRATION_MISSING", "governance"));
  } else {
    evaluateGovernanceIdentity(request.governance, request.context, findings);
    evaluateStatus(request.governance, findings);
    evaluateTiming(request.governance, request.context.submittedAt, findings);
    evaluateVerification(request.governance, request.artifact, request.context, findings);
    evaluateArchitecture(request.governance, request.artifact, request.context, findings);
    evaluateScope(request.governance, request.context, findings);
    evaluateRoute(request.governance, request.artifact, request.context, findings);
    const submitter = evaluateSubmitter(request.governance, request.artifact, request.context, findings);
    evaluateOwnership(request.governance, request.artifact, submitter, findings);
    evaluateClaims(request.governance, request.artifact, findings);
    evaluateSpecialReview(request.governance, request.artifact, request.context, options, findings);
  }

  if (!validation.valid) {
    findings.push(createFinding("ARTIFACT_VALIDATION_FAILED", "artifact", { issueCount: validation.issueCount }));
  }
  if (request.context.intendedRegistryStatus === "PUBLISHED" && !validation.publicationReady) {
    findings.push(createFinding("ARTIFACT_NOT_PUBLICATION_READY", "artifact", { validation: stableValidationJson(validation) }));
  }

  evaluateAttestations(request.context, findings);
  evaluateDuplicates(request.artifact, options.duplicateIndex, findings);

  const disposition = highestDisposition(findings);
  const controls = buildControlEvaluations(findings, evaluatedAt);
  const eligible = disposition === "ELIGIBLE" && validation.valid;
  const requiredRepairs = unique(findings.map((finding) => finding.repairHint));
  const permittedNextAction: ArtifactEligibilityDecision["permittedNextAction"] = eligible
    ? "REGISTER_ARTIFACT"
    : disposition === "ESCALATE"
      ? "ESCALATE_FOR_REVIEW"
      : disposition === "HOLD"
        ? "REPAIR_AND_RESUBMIT"
        : "REJECT_SUBMISSION";

  const snapshot: GovernanceEligibilitySnapshot = {
    governanceRegistrationId: request.governance?.governanceRegistrationId ?? null,
    organizationName: request.governance?.organization.displayName ?? null,
    architectureId: request.governance?.architecture.architectureId ?? null,
    architectureVersion: request.governance?.architecture.version ?? null,
    registrationStatus: request.governance?.status ?? null,
    verificationState: request.governance?.verificationState ?? null,
    submitterId: request.context.submittedBy,
    artifactId: request.artifact.identity.artifactId,
    artifactHash: request.artifact.integrity.canonicalHash,
    routeId: request.artifact.route.routeId,
    routeVersion: request.artifact.route.version,
    sector: request.context.sector,
    jurisdiction: request.context.jurisdiction,
    determination: request.artifact.commit.determination,
    classification: request.artifact.identity.classification,
    evaluatedAt,
  };

  const withoutAudit: Omit<ArtifactEligibilityDecision, "auditEvents"> = {
    eligible,
    disposition,
    registryRule: TA14_REGISTRY_RULE,
    governanceRegistrationId: request.governance?.governanceRegistrationId ?? null,
    artifactId: request.artifact.identity.artifactId,
    evaluationId: makeEvaluationId(request, evaluatedAt),
    evaluatedAt,
    findings,
    controls,
    artifactValidation: validation,
    snapshot,
    permittedNextAction,
    requiredRepairs,
  };

  return {
    ...withoutAudit,
    auditEvents: buildAuditEvents(request, withoutAudit),
  };
}

export function assertArtifactRegistrationEligible(
  decision: ArtifactEligibilityDecision,
): void {
  if (!decision.eligible) {
    const codes = decision.findings.map((finding) => finding.code).join(", ");
    throw new Error(`Artifact ${decision.artifactId} is not eligible for registration: ${codes}`);
  }
}

export function stableEligibilityJson(decision: ArtifactEligibilityDecision): string {
  return stableStringify({
    eligible: decision.eligible,
    disposition: decision.disposition,
    registryRule: decision.registryRule,
    governanceRegistrationId: decision.governanceRegistrationId,
    artifactId: decision.artifactId,
    evaluationId: decision.evaluationId,
    evaluatedAt: decision.evaluatedAt,
    findings: decision.findings,
    controls: decision.controls,
    artifactValidation: decision.artifactValidation,
    snapshot: decision.snapshot,
    permittedNextAction: decision.permittedNextAction,
    requiredRepairs: decision.requiredRepairs,
    auditEvents: decision.auditEvents,
  });
}

export function stableGovernanceRegistrationJson(registration: GovernanceRegistration): string {
  return stableStringify(registration);
}

export function buildGovernanceRegistrationHash(registration: Omit<GovernanceRegistration, "registrationHash">): string {
  return fnv1a(stableStringify(registration));
}

export function listEligibilityReasons(
  family?: RegistrationControlFamily,
): EligibilityReasonDefinition[] {
  const definitions = Object.values(ELIGIBILITY_REASON_DICTIONARY);
  return family ? definitions.filter((definition) => definition.controlFamily === family) : definitions;
}

export function listRegistrationControls(
  family?: RegistrationControlFamily,
): RegistrationControlDefinition[] {
  return family ? REGISTRATION_CONTROLS.filter((control) => control.family === family) : [...REGISTRATION_CONTROLS];
}

export function requiredArtifactRegistrationAttestations(): readonly RequiredAttestation[] {
  return REQUIRED_ATTESTATIONS;
}

export function governanceCanSponsorArtifacts(registration: GovernanceRegistration, now = new Date().toISOString()): boolean {
  if (registration.status !== "ACTIVE") return false;
  if (registration.verificationState === "UNVERIFIED") return false;
  if (!isIsoDate(registration.validFrom) || compareIso(now, registration.validFrom) < 0) return false;
  if (registration.validUntil && (!isIsoDate(registration.validUntil) || compareIso(now, registration.validUntil) > 0)) return false;
  return registration.authorizedSubmitters.some((submitter) => submitter.maySubmit && !submitter.revokedAt);
}

export function validateGovernanceRegistrationShape(value: unknown): value is GovernanceRegistration {
  if (!isRecord(value)) return false;
  return (
    isNonEmptyString(value.governanceRegistrationId) &&
    GOVERNANCE_REGISTRATION_ID_PATTERN.test(value.governanceRegistrationId) &&
    isRecord(value.organization) &&
    isRecord(value.architecture) &&
    isRecord(value.scope) &&
    Array.isArray(value.claims) &&
    Array.isArray(value.authorizedSubmitters) &&
    isNonEmptyString(value.status) &&
    isNonEmptyString(value.verificationState) &&
    isNonEmptyString(value.validFrom)
  );
}

export const GOVERNANCE_REGISTRATION_PRINCIPLES = Object.freeze([
  "Registration precedes artifact admission.",
  "Registration is attribution, not certification.",
  "Only ACTIVE governances may sponsor new artifacts.",
  "Governance identity, architecture identity, and artifact identity must remain linked.",
  "An artifact may not exceed registered sector, jurisdiction, route, action, or consequence scope.",
  "A submitting actor must possess current, unrevoked, scope-bounded authority.",
  "Production artifacts require institution-level governance verification.",
  "Manual imports require bounded institutional review.",
  "Registration changes do not rewrite previously registered artifacts.",
  "Suspension, withdrawal, rejection, and expiry remain visible in the registry history.",
  "Duplicate artifact IDs fail closed; duplicate hashes require review.",
  "No registered governance. No registered artifact.",
] as const);

export const GOVERNANCE_REGISTRATION_GATE_SELF_TESTS = Object.freeze([
  "Missing governance registration produces INELIGIBLE.",
  "Inactive governance registration produces INELIGIBLE.",
  "Suspended governance registration cannot sponsor new artifacts.",
  "Expired governance registration cannot sponsor new artifacts.",
  "Architecture mismatch produces INELIGIBLE.",
  "Architecture version mismatch produces INELIGIBLE.",
  "Retired architecture version produces HOLD.",
  "Unsupported determination produces INELIGIBLE.",
  "Unsupported classification produces INELIGIBLE.",
  "Sector outside scope produces INELIGIBLE.",
  "Jurisdiction outside scope produces INELIGIBLE.",
  "Action class outside scope produces INELIGIBLE.",
  "Consequence class outside scope produces INELIGIBLE.",
  "Unregistered route produces INELIGIBLE.",
  "Unregistered route version produces INELIGIBLE.",
  "Unauthorized submitter produces INELIGIBLE.",
  "Expired submitter authority produces INELIGIBLE.",
  "Revoked submitter authority produces INELIGIBLE.",
  "Duplicate artifact ID produces INELIGIBLE.",
  "Duplicate canonical hash produces ESCALATE.",
  "Manual import produces ESCALATE.",
  "Production artifact without institution verification produces HOLD.",
  "Missing required attestations produces HOLD.",
  "Canonical validation failure produces INELIGIBLE.",
  "Publication request without publication readiness produces HOLD.",
  "Eligible artifact permits REGISTER_ARTIFACT only after every mandatory check passes.",
] as const);

export const REGISTRATION_CONTROL_GUIDANCE: Readonly<Record<string, readonly string[]>> = Object.freeze({
  "REG-001": Object.freeze([
    "Family: IDENTITY.",
    "Control: Governance registration resolved.",
    "Requirement: A governance registration must exist and match the submission.",
    "Failure reason: GOVERNANCE_REGISTRATION_MISSING.",
    "Evidence expected: attributable record references sufficient to reproduce control REG-001.",
    "Registry effect: the control result is preserved in the eligibility decision and append-only audit ledger.",
  ]),
  "REG-002": Object.freeze([
    "Family: IDENTITY.",
    "Control: Registration identifier parity.",
    "Requirement: Submission and profile governance registration IDs must match.",
    "Failure reason: GOVERNANCE_REGISTRATION_ID_MISMATCH.",
    "Evidence expected: attributable record references sufficient to reproduce control REG-002.",
    "Registry effect: the control result is preserved in the eligibility decision and append-only audit ledger.",
  ]),
  "REG-003": Object.freeze([
    "Family: STATUS.",
    "Control: Active registration state.",
    "Requirement: Only ACTIVE governance registrations may sponsor artifacts.",
    "Failure reason: GOVERNANCE_REGISTRATION_NOT_ACTIVE.",
    "Evidence expected: attributable record references sufficient to reproduce control REG-003.",
    "Registry effect: the control result is preserved in the eligibility decision and append-only audit ledger.",
  ]),
  "REG-004": Object.freeze([
    "Family: VERIFICATION.",
    "Control: Identity verification.",
    "Requirement: Governance identity must be verified.",
    "Failure reason: GOVERNANCE_IDENTITY_NOT_VERIFIED.",
    "Evidence expected: attributable record references sufficient to reproduce control REG-004.",
    "Registry effect: the control result is preserved in the eligibility decision and append-only audit ledger.",
  ]),
  "REG-005": Object.freeze([
    "Family: VERIFICATION.",
    "Control: Institution verification for production.",
    "Requirement: Production artifacts require institution verification.",
    "Failure reason: PRODUCTION_ARTIFACT_REQUIRES_INSTITUTION_VERIFICATION.",
    "Evidence expected: attributable record references sufficient to reproduce control REG-005.",
    "Registry effect: the control result is preserved in the eligibility decision and append-only audit ledger.",
  ]),
  "REG-006": Object.freeze([
    "Family: AUDIT.",
    "Control: Registration integrity commitment.",
    "Requirement: Registration hash must be present.",
    "Failure reason: REGISTRATION_HASH_MISSING.",
    "Evidence expected: attributable record references sufficient to reproduce control REG-006.",
    "Registry effect: the control result is preserved in the eligibility decision and append-only audit ledger.",
  ]),
  "REG-007": Object.freeze([
    "Family: PUBLICATION.",
    "Control: Registry terms acceptance.",
    "Requirement: Registry terms version must be recorded.",
    "Failure reason: REGISTRY_TERMS_VERSION_MISSING.",
    "Evidence expected: attributable record references sufficient to reproduce control REG-007.",
    "Registry effect: the control result is preserved in the eligibility decision and append-only audit ledger.",
  ]),
  "REG-008": Object.freeze([
    "Family: IDENTITY.",
    "Control: Accountable owner attribution.",
    "Requirement: An accountable owner must be attributable.",
    "Failure reason: ACCOUNTABLE_OWNER_MISSING.",
    "Evidence expected: attributable record references sufficient to reproduce control REG-008.",
    "Registry effect: the control result is preserved in the eligibility decision and append-only audit ledger.",
  ]),
  "REG-009": Object.freeze([
    "Family: IDENTITY.",
    "Control: Registry steward attribution.",
    "Requirement: A registry steward must be attributable.",
    "Failure reason: REGISTRY_STEWARD_MISSING.",
    "Evidence expected: attributable record references sufficient to reproduce control REG-009.",
    "Registry effect: the control result is preserved in the eligibility decision and append-only audit ledger.",
  ]),
  "REG-010": Object.freeze([
    "Family: ARCHITECTURE.",
    "Control: Architecture identifier parity.",
    "Requirement: Artifact architecture ID must match the registration.",
    "Failure reason: ARCHITECTURE_ID_MISMATCH.",
    "Evidence expected: attributable record references sufficient to reproduce control REG-010.",
    "Registry effect: the control result is preserved in the eligibility decision and append-only audit ledger.",
  ]),
  "REG-011": Object.freeze([
    "Family: ARCHITECTURE.",
    "Control: Architecture version parity.",
    "Requirement: Artifact architecture version must be registered.",
    "Failure reason: ARCHITECTURE_VERSION_MISMATCH.",
    "Evidence expected: attributable record references sufficient to reproduce control REG-011.",
    "Registry effect: the control result is preserved in the eligibility decision and append-only audit ledger.",
  ]),
  "REG-012": Object.freeze([
    "Family: ARCHITECTURE.",
    "Control: Architecture version active.",
    "Requirement: Artifact architecture version must not be retired.",
    "Failure reason: ARCHITECTURE_VERSION_RETIRED.",
    "Evidence expected: attributable record references sufficient to reproduce control REG-012.",
    "Registry effect: the control result is preserved in the eligibility decision and append-only audit ledger.",
  ]),
  "REG-013": Object.freeze([
    "Family: ARCHITECTURE.",
    "Control: Architecture integrity commitment.",
    "Requirement: Registered architecture hash must be present.",
    "Failure reason: ARCHITECTURE_HASH_MISSING.",
    "Evidence expected: attributable record references sufficient to reproduce control REG-013.",
    "Registry effect: the control result is preserved in the eligibility decision and append-only audit ledger.",
  ]),
  "REG-014": Object.freeze([
    "Family: ARCHITECTURE.",
    "Control: Determination support.",
    "Requirement: Architecture must support the committed determination.",
    "Failure reason: DETERMINATION_NOT_SUPPORTED.",
    "Evidence expected: attributable record references sufficient to reproduce control REG-014.",
    "Registry effect: the control result is preserved in the eligibility decision and append-only audit ledger.",
  ]),
  "REG-015": Object.freeze([
    "Family: SCOPE.",
    "Control: Artifact classification support.",
    "Requirement: Governance must support the artifact classification.",
    "Failure reason: CLASSIFICATION_NOT_SUPPORTED.",
    "Evidence expected: attributable record references sufficient to reproduce control REG-015.",
    "Registry effect: the control result is preserved in the eligibility decision and append-only audit ledger.",
  ]),
  "REG-016": Object.freeze([
    "Family: SCOPE.",
    "Control: Sector scope.",
    "Requirement: Artifact sector must be registered.",
    "Failure reason: SECTOR_OUTSIDE_REGISTERED_SCOPE.",
    "Evidence expected: attributable record references sufficient to reproduce control REG-016.",
    "Registry effect: the control result is preserved in the eligibility decision and append-only audit ledger.",
  ]),
  "REG-017": Object.freeze([
    "Family: SCOPE.",
    "Control: Jurisdiction scope.",
    "Requirement: Artifact jurisdiction must be registered.",
    "Failure reason: JURISDICTION_OUTSIDE_REGISTERED_SCOPE.",
    "Evidence expected: attributable record references sufficient to reproduce control REG-017.",
    "Registry effect: the control result is preserved in the eligibility decision and append-only audit ledger.",
  ]),
  "REG-018": Object.freeze([
    "Family: SCOPE.",
    "Control: Action class scope.",
    "Requirement: Action class must be registered.",
    "Failure reason: ACTION_CLASS_OUTSIDE_REGISTERED_SCOPE.",
    "Evidence expected: attributable record references sufficient to reproduce control REG-018.",
    "Registry effect: the control result is preserved in the eligibility decision and append-only audit ledger.",
  ]),
  "REG-019": Object.freeze([
    "Family: SCOPE.",
    "Control: Consequence class scope.",
    "Requirement: Consequence class must be registered.",
    "Failure reason: CONSEQUENCE_CLASS_OUTSIDE_REGISTERED_SCOPE.",
    "Evidence expected: attributable record references sufficient to reproduce control REG-019.",
    "Registry effect: the control result is preserved in the eligibility decision and append-only audit ledger.",
  ]),
  "REG-020": Object.freeze([
    "Family: ROUTE.",
    "Control: Route registration.",
    "Requirement: Artifact route must be registered.",
    "Failure reason: ROUTE_NOT_REGISTERED.",
    "Evidence expected: attributable record references sufficient to reproduce control REG-020.",
    "Registry effect: the control result is preserved in the eligibility decision and append-only audit ledger.",
  ]),
  "REG-021": Object.freeze([
    "Family: ROUTE.",
    "Control: Route version registration.",
    "Requirement: Artifact route version must be registered.",
    "Failure reason: ROUTE_VERSION_NOT_REGISTERED.",
    "Evidence expected: attributable record references sufficient to reproduce control REG-021.",
    "Registry effect: the control result is preserved in the eligibility decision and append-only audit ledger.",
  ]),
  "REG-022": Object.freeze([
    "Family: IDENTITY.",
    "Control: Artifact ownership parity.",
    "Requirement: Artifact owner must map to the registered organization.",
    "Failure reason: ARTIFACT_OWNER_MISMATCH.",
    "Evidence expected: attributable record references sufficient to reproduce control REG-022.",
    "Registry effect: the control result is preserved in the eligibility decision and append-only audit ledger.",
  ]),
  "REG-023": Object.freeze([
    "Family: IDENTITY.",
    "Control: Artifact steward authority.",
    "Requirement: Artifact steward must be authorized.",
    "Failure reason: ARTIFACT_STEWARD_MISMATCH.",
    "Evidence expected: attributable record references sufficient to reproduce control REG-023.",
    "Registry effect: the control result is preserved in the eligibility decision and append-only audit ledger.",
  ]),
  "REG-024": Object.freeze([
    "Family: SUBMITTER.",
    "Control: Submitter authorization.",
    "Requirement: Submitting actor must be authorized.",
    "Failure reason: SUBMITTER_NOT_AUTHORIZED.",
    "Evidence expected: attributable record references sufficient to reproduce control REG-024.",
    "Registry effect: the control result is preserved in the eligibility decision and append-only audit ledger.",
  ]),
  "REG-025": Object.freeze([
    "Family: SUBMITTER.",
    "Control: Submitter validity window.",
    "Requirement: Submitter authorization must be current.",
    "Failure reason: SUBMITTER_AUTHORIZATION_EXPIRED.",
    "Evidence expected: attributable record references sufficient to reproduce control REG-025.",
    "Registry effect: the control result is preserved in the eligibility decision and append-only audit ledger.",
  ]),
  "REG-026": Object.freeze([
    "Family: SUBMITTER.",
    "Control: Submitter revocation state.",
    "Requirement: Submitter authorization must not be revoked.",
    "Failure reason: SUBMITTER_AUTHORIZATION_REVOKED.",
    "Evidence expected: attributable record references sufficient to reproduce control REG-026.",
    "Registry effect: the control result is preserved in the eligibility decision and append-only audit ledger.",
  ]),
  "REG-027": Object.freeze([
    "Family: SUBMITTER.",
    "Control: Submitter classification authority.",
    "Requirement: Submitter must be authorized for the classification.",
    "Failure reason: SUBMITTER_CLASSIFICATION_NOT_AUTHORIZED.",
    "Evidence expected: attributable record references sufficient to reproduce control REG-027.",
    "Registry effect: the control result is preserved in the eligibility decision and append-only audit ledger.",
  ]),
  "REG-028": Object.freeze([
    "Family: SUBMITTER.",
    "Control: Submitter sector authority.",
    "Requirement: Submitter must be authorized for the sector.",
    "Failure reason: SUBMITTER_SECTOR_NOT_AUTHORIZED.",
    "Evidence expected: attributable record references sufficient to reproduce control REG-028.",
    "Registry effect: the control result is preserved in the eligibility decision and append-only audit ledger.",
  ]),
  "REG-029": Object.freeze([
    "Family: SUBMITTER.",
    "Control: Submitter route authority.",
    "Requirement: Submitter must be authorized for the route.",
    "Failure reason: SUBMITTER_ROUTE_NOT_AUTHORIZED.",
    "Evidence expected: attributable record references sufficient to reproduce control REG-029.",
    "Registry effect: the control result is preserved in the eligibility decision and append-only audit ledger.",
  ]),
  "REG-030": Object.freeze([
    "Family: ARTIFACT.",
    "Control: Canonical validation.",
    "Requirement: Canonical artifact validation must pass.",
    "Failure reason: ARTIFACT_VALIDATION_FAILED.",
    "Evidence expected: attributable record references sufficient to reproduce control REG-030.",
    "Registry effect: the control result is preserved in the eligibility decision and append-only audit ledger.",
  ]),
  "REG-031": Object.freeze([
    "Family: PUBLICATION.",
    "Control: Publication readiness.",
    "Requirement: Artifact must be publication ready for public registration.",
    "Failure reason: ARTIFACT_NOT_PUBLICATION_READY.",
    "Evidence expected: attributable record references sufficient to reproduce control REG-031.",
    "Registry effect: the control result is preserved in the eligibility decision and append-only audit ledger.",
  ]),
  "REG-032": Object.freeze([
    "Family: PUBLICATION.",
    "Control: Mandatory attestations.",
    "Requirement: All required attestations must be present.",
    "Failure reason: ARTIFACT_REGISTRATION_ATTESTATION_MISSING.",
    "Evidence expected: attributable record references sufficient to reproduce control REG-032.",
    "Registry effect: the control result is preserved in the eligibility decision and append-only audit ledger.",
  ]),
  "REG-033": Object.freeze([
    "Family: ARTIFACT.",
    "Control: Governance linkage.",
    "Requirement: Artifact package must link to governance registration.",
    "Failure reason: ARTIFACT_GOVERNANCE_LINK_MISSING.",
    "Evidence expected: attributable record references sufficient to reproduce control REG-033.",
    "Registry effect: the control result is preserved in the eligibility decision and append-only audit ledger.",
  ]),
  "REG-034": Object.freeze([
    "Family: ARCHITECTURE.",
    "Control: Architecture linkage.",
    "Requirement: Artifact package must link to architecture identity.",
    "Failure reason: ARTIFACT_ARCHITECTURE_LINK_MISSING.",
    "Evidence expected: attributable record references sufficient to reproduce control REG-034.",
    "Registry effect: the control result is preserved in the eligibility decision and append-only audit ledger.",
  ]),
  "REG-035": Object.freeze([
    "Family: ROUTE.",
    "Control: Route linkage.",
    "Requirement: Artifact package must link to route identity.",
    "Failure reason: ARTIFACT_ROUTE_LINK_MISSING.",
    "Evidence expected: attributable record references sufficient to reproduce control REG-035.",
    "Registry effect: the control result is preserved in the eligibility decision and append-only audit ledger.",
  ]),
  "REG-036": Object.freeze([
    "Family: ARTIFACT.",
    "Control: Unique artifact identifier.",
    "Requirement: Artifact ID must be unique.",
    "Failure reason: ARTIFACT_DUPLICATE_ID.",
    "Evidence expected: attributable record references sufficient to reproduce control REG-036.",
    "Registry effect: the control result is preserved in the eligibility decision and append-only audit ledger.",
  ]),
  "REG-037": Object.freeze([
    "Family: ARTIFACT.",
    "Control: Unique canonical record.",
    "Requirement: Canonical hash must not duplicate an existing artifact without review.",
    "Failure reason: ARTIFACT_DUPLICATE_HASH.",
    "Evidence expected: attributable record references sufficient to reproduce control REG-037.",
    "Registry effect: the control result is preserved in the eligibility decision and append-only audit ledger.",
  ]),
  "REG-038": Object.freeze([
    "Family: SCOPE.",
    "Control: Scope clarity.",
    "Requirement: Artifact scope must be unambiguous.",
    "Failure reason: ARTIFACT_SCOPE_AMBIGUOUS.",
    "Evidence expected: attributable record references sufficient to reproduce control REG-038.",
    "Registry effect: the control result is preserved in the eligibility decision and append-only audit ledger.",
  ]),
  "REG-039": Object.freeze([
    "Family: CLAIMS.",
    "Control: Claim registration parity.",
    "Requirement: Artifact claims must be declared by the governance profile.",
    "Failure reason: ARTIFACT_CLAIM_OUTSIDE_REGISTRATION.",
    "Evidence expected: attributable record references sufficient to reproduce control REG-039.",
    "Registry effect: the control result is preserved in the eligibility decision and append-only audit ledger.",
  ]),
  "REG-040": Object.freeze([
    "Family: CLAIMS.",
    "Control: Governance claim availability.",
    "Requirement: Governance profile must contain bounded claims.",
    "Failure reason: GOVERNANCE_CLAIMS_EMPTY.",
    "Evidence expected: attributable record references sufficient to reproduce control REG-040.",
    "Registry effect: the control result is preserved in the eligibility decision and append-only audit ledger.",
  ]),
  "REG-041": Object.freeze([
    "Family: SCOPE.",
    "Control: Governance scope availability.",
    "Requirement: Governance profile must contain usable scope.",
    "Failure reason: GOVERNANCE_SCOPE_EMPTY.",
    "Evidence expected: attributable record references sufficient to reproduce control REG-041.",
    "Registry effect: the control result is preserved in the eligibility decision and append-only audit ledger.",
  ]),
  "REG-042": Object.freeze([
    "Family: SUBMITTER.",
    "Control: Authorized submitter availability.",
    "Requirement: Governance profile must have an authorized submitter.",
    "Failure reason: AUTHORIZED_SUBMITTERS_EMPTY.",
    "Evidence expected: attributable record references sufficient to reproduce control REG-042.",
    "Registry effect: the control result is preserved in the eligibility decision and append-only audit ledger.",
  ]),
  "REG-043": Object.freeze([
    "Family: TIMING.",
    "Control: Registration start validity.",
    "Requirement: Registration valid-from must be a valid timestamp.",
    "Failure reason: REGISTRATION_VALID_FROM_INVALID.",
    "Evidence expected: attributable record references sufficient to reproduce control REG-043.",
    "Registry effect: the control result is preserved in the eligibility decision and append-only audit ledger.",
  ]),
  "REG-044": Object.freeze([
    "Family: TIMING.",
    "Control: Registration expiry validity.",
    "Requirement: Registration valid-until must be valid when present.",
    "Failure reason: REGISTRATION_VALID_UNTIL_INVALID.",
    "Evidence expected: attributable record references sufficient to reproduce control REG-044.",
    "Registry effect: the control result is preserved in the eligibility decision and append-only audit ledger.",
  ]),
  "REG-045": Object.freeze([
    "Family: TIMING.",
    "Control: Submission timestamp validity.",
    "Requirement: Submission time must be valid UTC.",
    "Failure reason: SUBMISSION_TIME_INVALID.",
    "Evidence expected: attributable record references sufficient to reproduce control REG-045.",
    "Registry effect: the control result is preserved in the eligibility decision and append-only audit ledger.",
  ]),
  "REG-046": Object.freeze([
    "Family: TIMING.",
    "Control: Registration before submission.",
    "Requirement: Governance registration must precede artifact submission.",
    "Failure reason: SUBMISSION_BEFORE_REGISTRATION.",
    "Evidence expected: attributable record references sufficient to reproduce control REG-046.",
    "Registry effect: the control result is preserved in the eligibility decision and append-only audit ledger.",
  ]),
  "REG-047": Object.freeze([
    "Family: TIMING.",
    "Control: Submission before expiry.",
    "Requirement: Submission must occur before registration expiry.",
    "Failure reason: SUBMISSION_AFTER_EXPIRY.",
    "Evidence expected: attributable record references sufficient to reproduce control REG-047.",
    "Registry effect: the control result is preserved in the eligibility decision and append-only audit ledger.",
  ]),
  "REG-048": Object.freeze([
    "Family: ROUTE.",
    "Control: Playground route parity.",
    "Requirement: Playground artifacts must preserve route parity.",
    "Failure reason: PLAYGROUND_ROUTE_PARITY_MISSING.",
    "Evidence expected: attributable record references sufficient to reproduce control REG-048.",
    "Registry effect: the control result is preserved in the eligibility decision and append-only audit ledger.",
  ]),
  "REG-049": Object.freeze([
    "Family: VERIFICATION.",
    "Control: Manual import review.",
    "Requirement: Manual imports require institutional review.",
    "Failure reason: MANUAL_IMPORT_REQUIRES_ESCALATION.",
    "Evidence expected: attributable record references sufficient to reproduce control REG-049.",
    "Registry effect: the control result is preserved in the eligibility decision and append-only audit ledger.",
  ]),
  "REG-050": Object.freeze([
    "Family: VERIFICATION.",
    "Control: Independent review threshold.",
    "Requirement: Requested high verification level must have review evidence.",
    "Failure reason: INDEPENDENT_REVIEW_REQUIRED.",
    "Evidence expected: attributable record references sufficient to reproduce control REG-050.",
    "Registry effect: the control result is preserved in the eligibility decision and append-only audit ledger.",
  ]),
  "REG-051": Object.freeze([
    "Family: VERIFICATION.",
    "Control: High consequence review.",
    "Requirement: High consequence action classes require named review.",
    "Failure reason: HIGH_CONSEQUENCE_REVIEW_REQUIRED.",
    "Evidence expected: attributable record references sufficient to reproduce control REG-051.",
    "Registry effect: the control result is preserved in the eligibility decision and append-only audit ledger.",
  ]),
  "REG-052": Object.freeze([
    "Family: PUBLICATION.",
    "Control: Demonstration labeling.",
    "Requirement: Demonstration artifacts must remain visibly labeled.",
    "Failure reason: DEMONSTRATION_ARTIFACT_LABEL_MISSING.",
    "Evidence expected: attributable record references sufficient to reproduce control REG-052.",
    "Registry effect: the control result is preserved in the eligibility decision and append-only audit ledger.",
  ]),
  "REG-053": Object.freeze([
    "Family: PUBLICATION.",
    "Control: Public governance profile.",
    "Requirement: Public artifacts require a stable governance profile URL.",
    "Failure reason: GOVERNANCE_PROFILE_URL_MISSING.",
    "Evidence expected: attributable record references sufficient to reproduce control REG-053.",
    "Registry effect: the control result is preserved in the eligibility decision and append-only audit ledger.",
  ]),
  "REG-054": Object.freeze([
    "Family: VERIFICATION.",
    "Control: Institutional control 54.",
    "Requirement: Institutional registry control 54 must be evaluated and preserved in the eligibility ledger.",
    "Failure reason: REGISTRATION_CONTROL_FAILURE.",
    "Evidence expected: attributable record references sufficient to reproduce control REG-054.",
    "Registry effect: the control result is preserved in the eligibility decision and append-only audit ledger.",
  ]),
  "REG-055": Object.freeze([
    "Family: PUBLICATION.",
    "Control: Institutional control 55.",
    "Requirement: Institutional registry control 55 must be evaluated and preserved in the eligibility ledger.",
    "Failure reason: REGISTRATION_CONTROL_HOLD.",
    "Evidence expected: attributable record references sufficient to reproduce control REG-055.",
    "Registry effect: the control result is preserved in the eligibility decision and append-only audit ledger.",
  ]),
  "REG-056": Object.freeze([
    "Family: AUDIT.",
    "Control: Institutional control 56.",
    "Requirement: Institutional registry control 56 must be evaluated and preserved in the eligibility ledger.",
    "Failure reason: REGISTRATION_CONTROL_ESCALATION.",
    "Evidence expected: attributable record references sufficient to reproduce control REG-056.",
    "Registry effect: the control result is preserved in the eligibility decision and append-only audit ledger.",
  ]),
  "REG-057": Object.freeze([
    "Family: ARTIFACT.",
    "Control: Institutional control 57.",
    "Requirement: Institutional registry control 57 must be evaluated and preserved in the eligibility ledger.",
    "Failure reason: REGISTRATION_CONTROL_FAILURE.",
    "Evidence expected: attributable record references sufficient to reproduce control REG-057.",
    "Registry effect: the control result is preserved in the eligibility decision and append-only audit ledger.",
  ]),
  "REG-058": Object.freeze([
    "Family: VERIFICATION.",
    "Control: Institutional control 58.",
    "Requirement: Institutional registry control 58 must be evaluated and preserved in the eligibility ledger.",
    "Failure reason: REGISTRATION_CONTROL_HOLD.",
    "Evidence expected: attributable record references sufficient to reproduce control REG-058.",
    "Registry effect: the control result is preserved in the eligibility decision and append-only audit ledger.",
  ]),
  "REG-059": Object.freeze([
    "Family: PUBLICATION.",
    "Control: Institutional control 59.",
    "Requirement: Institutional registry control 59 must be evaluated and preserved in the eligibility ledger.",
    "Failure reason: REGISTRATION_CONTROL_ESCALATION.",
    "Evidence expected: attributable record references sufficient to reproduce control REG-059.",
    "Registry effect: the control result is preserved in the eligibility decision and append-only audit ledger.",
  ]),
  "REG-060": Object.freeze([
    "Family: AUDIT.",
    "Control: Institutional control 60.",
    "Requirement: Institutional registry control 60 must be evaluated and preserved in the eligibility ledger.",
    "Failure reason: REGISTRATION_CONTROL_FAILURE.",
    "Evidence expected: attributable record references sufficient to reproduce control REG-060.",
    "Registry effect: the control result is preserved in the eligibility decision and append-only audit ledger.",
  ]),
  "REG-061": Object.freeze([
    "Family: ARTIFACT.",
    "Control: Institutional control 61.",
    "Requirement: Institutional registry control 61 must be evaluated and preserved in the eligibility ledger.",
    "Failure reason: REGISTRATION_CONTROL_HOLD.",
    "Evidence expected: attributable record references sufficient to reproduce control REG-061.",
    "Registry effect: the control result is preserved in the eligibility decision and append-only audit ledger.",
  ]),
  "REG-062": Object.freeze([
    "Family: VERIFICATION.",
    "Control: Institutional control 62.",
    "Requirement: Institutional registry control 62 must be evaluated and preserved in the eligibility ledger.",
    "Failure reason: REGISTRATION_CONTROL_ESCALATION.",
    "Evidence expected: attributable record references sufficient to reproduce control REG-062.",
    "Registry effect: the control result is preserved in the eligibility decision and append-only audit ledger.",
  ]),
  "REG-063": Object.freeze([
    "Family: PUBLICATION.",
    "Control: Institutional control 63.",
    "Requirement: Institutional registry control 63 must be evaluated and preserved in the eligibility ledger.",
    "Failure reason: REGISTRATION_CONTROL_FAILURE.",
    "Evidence expected: attributable record references sufficient to reproduce control REG-063.",
    "Registry effect: the control result is preserved in the eligibility decision and append-only audit ledger.",
  ]),
  "REG-064": Object.freeze([
    "Family: AUDIT.",
    "Control: Institutional control 64.",
    "Requirement: Institutional registry control 64 must be evaluated and preserved in the eligibility ledger.",
    "Failure reason: REGISTRATION_CONTROL_HOLD.",
    "Evidence expected: attributable record references sufficient to reproduce control REG-064.",
    "Registry effect: the control result is preserved in the eligibility decision and append-only audit ledger.",
  ]),
  "REG-065": Object.freeze([
    "Family: ARTIFACT.",
    "Control: Institutional control 65.",
    "Requirement: Institutional registry control 65 must be evaluated and preserved in the eligibility ledger.",
    "Failure reason: REGISTRATION_CONTROL_ESCALATION.",
    "Evidence expected: attributable record references sufficient to reproduce control REG-065.",
    "Registry effect: the control result is preserved in the eligibility decision and append-only audit ledger.",
  ]),
  "REG-066": Object.freeze([
    "Family: VERIFICATION.",
    "Control: Institutional control 66.",
    "Requirement: Institutional registry control 66 must be evaluated and preserved in the eligibility ledger.",
    "Failure reason: REGISTRATION_CONTROL_FAILURE.",
    "Evidence expected: attributable record references sufficient to reproduce control REG-066.",
    "Registry effect: the control result is preserved in the eligibility decision and append-only audit ledger.",
  ]),
  "REG-067": Object.freeze([
    "Family: PUBLICATION.",
    "Control: Institutional control 67.",
    "Requirement: Institutional registry control 67 must be evaluated and preserved in the eligibility ledger.",
    "Failure reason: REGISTRATION_CONTROL_HOLD.",
    "Evidence expected: attributable record references sufficient to reproduce control REG-067.",
    "Registry effect: the control result is preserved in the eligibility decision and append-only audit ledger.",
  ]),
  "REG-068": Object.freeze([
    "Family: AUDIT.",
    "Control: Institutional control 68.",
    "Requirement: Institutional registry control 68 must be evaluated and preserved in the eligibility ledger.",
    "Failure reason: REGISTRATION_CONTROL_ESCALATION.",
    "Evidence expected: attributable record references sufficient to reproduce control REG-068.",
    "Registry effect: the control result is preserved in the eligibility decision and append-only audit ledger.",
  ]),
  "REG-069": Object.freeze([
    "Family: ARTIFACT.",
    "Control: Institutional control 69.",
    "Requirement: Institutional registry control 69 must be evaluated and preserved in the eligibility ledger.",
    "Failure reason: REGISTRATION_CONTROL_FAILURE.",
    "Evidence expected: attributable record references sufficient to reproduce control REG-069.",
    "Registry effect: the control result is preserved in the eligibility decision and append-only audit ledger.",
  ]),
  "REG-070": Object.freeze([
    "Family: VERIFICATION.",
    "Control: Institutional control 70.",
    "Requirement: Institutional registry control 70 must be evaluated and preserved in the eligibility ledger.",
    "Failure reason: REGISTRATION_CONTROL_HOLD.",
    "Evidence expected: attributable record references sufficient to reproduce control REG-070.",
    "Registry effect: the control result is preserved in the eligibility decision and append-only audit ledger.",
  ]),
  "REG-071": Object.freeze([
    "Family: PUBLICATION.",
    "Control: Institutional control 71.",
    "Requirement: Institutional registry control 71 must be evaluated and preserved in the eligibility ledger.",
    "Failure reason: REGISTRATION_CONTROL_ESCALATION.",
    "Evidence expected: attributable record references sufficient to reproduce control REG-071.",
    "Registry effect: the control result is preserved in the eligibility decision and append-only audit ledger.",
  ]),
  "REG-072": Object.freeze([
    "Family: AUDIT.",
    "Control: Institutional control 72.",
    "Requirement: Institutional registry control 72 must be evaluated and preserved in the eligibility ledger.",
    "Failure reason: REGISTRATION_CONTROL_FAILURE.",
    "Evidence expected: attributable record references sufficient to reproduce control REG-072.",
    "Registry effect: the control result is preserved in the eligibility decision and append-only audit ledger.",
  ]),
});


export function registrationControlGuidance(controlId: string): readonly string[] {
  return REGISTRATION_CONTROL_GUIDANCE[controlId] ?? Object.freeze(["No guidance is registered for this control."]);
}

export function eligibilityDecisionDigest(decision: ArtifactEligibilityDecision): string {
  return fnv1a(stableEligibilityJson(decision));
}

export function registrationPortfolioKey(registration: GovernanceRegistration): string {
  return [
    registration.governanceRegistrationId,
    registration.architecture.architectureId,
    registration.architecture.version,
    registration.status,
  ].join("::");
}

export function artifactGovernanceLinkKey(request: ArtifactRegistrationRequest): string {
  return [
    request.context.governanceRegistrationId,
    request.context.architectureId,
    request.context.architectureVersion,
    request.artifact.route.routeId,
    request.artifact.route.version,
    request.artifact.identity.artifactId,
  ].join("::");
}

export function eligibleArtifactSummary(decision: ArtifactEligibilityDecision): Record<string, unknown> {
  return {
    artifactId: decision.artifactId,
    governanceRegistrationId: decision.governanceRegistrationId,
    eligible: decision.eligible,
    disposition: decision.disposition,
    permittedNextAction: decision.permittedNextAction,
    evaluationId: decision.evaluationId,
    evaluatedAt: decision.evaluatedAt,
    determination: decision.snapshot.determination,
    classification: decision.snapshot.classification,
    route: `${decision.snapshot.routeId}@${decision.snapshot.routeVersion}`,
    architecture: decision.snapshot.architectureId && decision.snapshot.architectureVersion
      ? `${decision.snapshot.architectureId}@${decision.snapshot.architectureVersion}`
      : null,
    findingCodes: decision.findings.map((finding) => finding.code),
    controlCounts: decision.controls.reduce<Record<RegistrationControlResult, number>>(
      (counts, control) => {
        counts[control.result] += 1;
        return counts;
      },
      { PASS: 0, HOLD: 0, FAIL: 0, ESCALATE: 0, NOT_APPLICABLE: 0 },
    ),
    digest: eligibilityDecisionDigest(decision),
  };
}

// Typed reason-code helpers for downstream registry UI and API consumers.
export function isGovernanceRegistrationMissing(value: string): value is "GOVERNANCE_REGISTRATION_MISSING" {
  return value === "GOVERNANCE_REGISTRATION_MISSING";
}

export const GOVERNANCE_REGISTRATION_MISSING_ELIGIBILITY_DEFINITION = ELIGIBILITY_REASON_DICTIONARY.GOVERNANCE_REGISTRATION_MISSING;

export function isGovernanceRegistrationIdMismatch(value: string): value is "GOVERNANCE_REGISTRATION_ID_MISMATCH" {
  return value === "GOVERNANCE_REGISTRATION_ID_MISMATCH";
}

export const GOVERNANCE_REGISTRATION_ID_MISMATCH_ELIGIBILITY_DEFINITION = ELIGIBILITY_REASON_DICTIONARY.GOVERNANCE_REGISTRATION_ID_MISMATCH;

export function isGovernanceRegistrationNotActive(value: string): value is "GOVERNANCE_REGISTRATION_NOT_ACTIVE" {
  return value === "GOVERNANCE_REGISTRATION_NOT_ACTIVE";
}

export const GOVERNANCE_REGISTRATION_NOT_ACTIVE_ELIGIBILITY_DEFINITION = ELIGIBILITY_REASON_DICTIONARY.GOVERNANCE_REGISTRATION_NOT_ACTIVE;

export function isGovernanceRegistrationSuspended(value: string): value is "GOVERNANCE_REGISTRATION_SUSPENDED" {
  return value === "GOVERNANCE_REGISTRATION_SUSPENDED";
}

export const GOVERNANCE_REGISTRATION_SUSPENDED_ELIGIBILITY_DEFINITION = ELIGIBILITY_REASON_DICTIONARY.GOVERNANCE_REGISTRATION_SUSPENDED;

export function isGovernanceRegistrationExpired(value: string): value is "GOVERNANCE_REGISTRATION_EXPIRED" {
  return value === "GOVERNANCE_REGISTRATION_EXPIRED";
}

export const GOVERNANCE_REGISTRATION_EXPIRED_ELIGIBILITY_DEFINITION = ELIGIBILITY_REASON_DICTIONARY.GOVERNANCE_REGISTRATION_EXPIRED;

export function isGovernanceRegistrationWithdrawn(value: string): value is "GOVERNANCE_REGISTRATION_WITHDRAWN" {
  return value === "GOVERNANCE_REGISTRATION_WITHDRAWN";
}

export const GOVERNANCE_REGISTRATION_WITHDRAWN_ELIGIBILITY_DEFINITION = ELIGIBILITY_REASON_DICTIONARY.GOVERNANCE_REGISTRATION_WITHDRAWN;

export function isGovernanceRegistrationRejected(value: string): value is "GOVERNANCE_REGISTRATION_REJECTED" {
  return value === "GOVERNANCE_REGISTRATION_REJECTED";
}

export const GOVERNANCE_REGISTRATION_REJECTED_ELIGIBILITY_DEFINITION = ELIGIBILITY_REASON_DICTIONARY.GOVERNANCE_REGISTRATION_REJECTED;

export function isGovernanceIdentityNotVerified(value: string): value is "GOVERNANCE_IDENTITY_NOT_VERIFIED" {
  return value === "GOVERNANCE_IDENTITY_NOT_VERIFIED";
}

export const GOVERNANCE_IDENTITY_NOT_VERIFIED_ELIGIBILITY_DEFINITION = ELIGIBILITY_REASON_DICTIONARY.GOVERNANCE_IDENTITY_NOT_VERIFIED;

export function isGovernanceInstitutionNotVerified(value: string): value is "GOVERNANCE_INSTITUTION_NOT_VERIFIED" {
  return value === "GOVERNANCE_INSTITUTION_NOT_VERIFIED";
}

export const GOVERNANCE_INSTITUTION_NOT_VERIFIED_ELIGIBILITY_DEFINITION = ELIGIBILITY_REASON_DICTIONARY.GOVERNANCE_INSTITUTION_NOT_VERIFIED;

export function isRegistrationHashMissing(value: string): value is "REGISTRATION_HASH_MISSING" {
  return value === "REGISTRATION_HASH_MISSING";
}

export const REGISTRATION_HASH_MISSING_ELIGIBILITY_DEFINITION = ELIGIBILITY_REASON_DICTIONARY.REGISTRATION_HASH_MISSING;

export function isRegistryTermsVersionMissing(value: string): value is "REGISTRY_TERMS_VERSION_MISSING" {
  return value === "REGISTRY_TERMS_VERSION_MISSING";
}

export const REGISTRY_TERMS_VERSION_MISSING_ELIGIBILITY_DEFINITION = ELIGIBILITY_REASON_DICTIONARY.REGISTRY_TERMS_VERSION_MISSING;

export function isAccountableOwnerMissing(value: string): value is "ACCOUNTABLE_OWNER_MISSING" {
  return value === "ACCOUNTABLE_OWNER_MISSING";
}

export const ACCOUNTABLE_OWNER_MISSING_ELIGIBILITY_DEFINITION = ELIGIBILITY_REASON_DICTIONARY.ACCOUNTABLE_OWNER_MISSING;

export function isRegistryStewardMissing(value: string): value is "REGISTRY_STEWARD_MISSING" {
  return value === "REGISTRY_STEWARD_MISSING";
}

export const REGISTRY_STEWARD_MISSING_ELIGIBILITY_DEFINITION = ELIGIBILITY_REASON_DICTIONARY.REGISTRY_STEWARD_MISSING;

export function isArchitectureIdMismatch(value: string): value is "ARCHITECTURE_ID_MISMATCH" {
  return value === "ARCHITECTURE_ID_MISMATCH";
}

export const ARCHITECTURE_ID_MISMATCH_ELIGIBILITY_DEFINITION = ELIGIBILITY_REASON_DICTIONARY.ARCHITECTURE_ID_MISMATCH;

export function isArchitectureVersionMismatch(value: string): value is "ARCHITECTURE_VERSION_MISMATCH" {
  return value === "ARCHITECTURE_VERSION_MISMATCH";
}

export const ARCHITECTURE_VERSION_MISMATCH_ELIGIBILITY_DEFINITION = ELIGIBILITY_REASON_DICTIONARY.ARCHITECTURE_VERSION_MISMATCH;

export function isArchitectureVersionRetired(value: string): value is "ARCHITECTURE_VERSION_RETIRED" {
  return value === "ARCHITECTURE_VERSION_RETIRED";
}

export const ARCHITECTURE_VERSION_RETIRED_ELIGIBILITY_DEFINITION = ELIGIBILITY_REASON_DICTIONARY.ARCHITECTURE_VERSION_RETIRED;

export function isArchitectureHashMissing(value: string): value is "ARCHITECTURE_HASH_MISSING" {
  return value === "ARCHITECTURE_HASH_MISSING";
}

export const ARCHITECTURE_HASH_MISSING_ELIGIBILITY_DEFINITION = ELIGIBILITY_REASON_DICTIONARY.ARCHITECTURE_HASH_MISSING;

export function isDeterminationNotSupported(value: string): value is "DETERMINATION_NOT_SUPPORTED" {
  return value === "DETERMINATION_NOT_SUPPORTED";
}

export const DETERMINATION_NOT_SUPPORTED_ELIGIBILITY_DEFINITION = ELIGIBILITY_REASON_DICTIONARY.DETERMINATION_NOT_SUPPORTED;

export function isClassificationNotSupported(value: string): value is "CLASSIFICATION_NOT_SUPPORTED" {
  return value === "CLASSIFICATION_NOT_SUPPORTED";
}

export const CLASSIFICATION_NOT_SUPPORTED_ELIGIBILITY_DEFINITION = ELIGIBILITY_REASON_DICTIONARY.CLASSIFICATION_NOT_SUPPORTED;

export function isSectorOutsideRegisteredScope(value: string): value is "SECTOR_OUTSIDE_REGISTERED_SCOPE" {
  return value === "SECTOR_OUTSIDE_REGISTERED_SCOPE";
}

export const SECTOR_OUTSIDE_REGISTERED_SCOPE_ELIGIBILITY_DEFINITION = ELIGIBILITY_REASON_DICTIONARY.SECTOR_OUTSIDE_REGISTERED_SCOPE;

export function isJurisdictionOutsideRegisteredScope(value: string): value is "JURISDICTION_OUTSIDE_REGISTERED_SCOPE" {
  return value === "JURISDICTION_OUTSIDE_REGISTERED_SCOPE";
}

export const JURISDICTION_OUTSIDE_REGISTERED_SCOPE_ELIGIBILITY_DEFINITION = ELIGIBILITY_REASON_DICTIONARY.JURISDICTION_OUTSIDE_REGISTERED_SCOPE;

export function isActionClassOutsideRegisteredScope(value: string): value is "ACTION_CLASS_OUTSIDE_REGISTERED_SCOPE" {
  return value === "ACTION_CLASS_OUTSIDE_REGISTERED_SCOPE";
}

export const ACTION_CLASS_OUTSIDE_REGISTERED_SCOPE_ELIGIBILITY_DEFINITION = ELIGIBILITY_REASON_DICTIONARY.ACTION_CLASS_OUTSIDE_REGISTERED_SCOPE;

export function isConsequenceClassOutsideRegisteredScope(value: string): value is "CONSEQUENCE_CLASS_OUTSIDE_REGISTERED_SCOPE" {
  return value === "CONSEQUENCE_CLASS_OUTSIDE_REGISTERED_SCOPE";
}

export const CONSEQUENCE_CLASS_OUTSIDE_REGISTERED_SCOPE_ELIGIBILITY_DEFINITION = ELIGIBILITY_REASON_DICTIONARY.CONSEQUENCE_CLASS_OUTSIDE_REGISTERED_SCOPE;

export function isRouteNotRegistered(value: string): value is "ROUTE_NOT_REGISTERED" {
  return value === "ROUTE_NOT_REGISTERED";
}

export const ROUTE_NOT_REGISTERED_ELIGIBILITY_DEFINITION = ELIGIBILITY_REASON_DICTIONARY.ROUTE_NOT_REGISTERED;

export function isRouteVersionNotRegistered(value: string): value is "ROUTE_VERSION_NOT_REGISTERED" {
  return value === "ROUTE_VERSION_NOT_REGISTERED";
}

export const ROUTE_VERSION_NOT_REGISTERED_ELIGIBILITY_DEFINITION = ELIGIBILITY_REASON_DICTIONARY.ROUTE_VERSION_NOT_REGISTERED;

export function isArtifactOwnerMismatch(value: string): value is "ARTIFACT_OWNER_MISMATCH" {
  return value === "ARTIFACT_OWNER_MISMATCH";
}

export const ARTIFACT_OWNER_MISMATCH_ELIGIBILITY_DEFINITION = ELIGIBILITY_REASON_DICTIONARY.ARTIFACT_OWNER_MISMATCH;

export function isArtifactStewardMismatch(value: string): value is "ARTIFACT_STEWARD_MISMATCH" {
  return value === "ARTIFACT_STEWARD_MISMATCH";
}

export const ARTIFACT_STEWARD_MISMATCH_ELIGIBILITY_DEFINITION = ELIGIBILITY_REASON_DICTIONARY.ARTIFACT_STEWARD_MISMATCH;

export function isSubmitterNotAuthorized(value: string): value is "SUBMITTER_NOT_AUTHORIZED" {
  return value === "SUBMITTER_NOT_AUTHORIZED";
}

export const SUBMITTER_NOT_AUTHORIZED_ELIGIBILITY_DEFINITION = ELIGIBILITY_REASON_DICTIONARY.SUBMITTER_NOT_AUTHORIZED;

export function isSubmitterAuthorizationExpired(value: string): value is "SUBMITTER_AUTHORIZATION_EXPIRED" {
  return value === "SUBMITTER_AUTHORIZATION_EXPIRED";
}

export const SUBMITTER_AUTHORIZATION_EXPIRED_ELIGIBILITY_DEFINITION = ELIGIBILITY_REASON_DICTIONARY.SUBMITTER_AUTHORIZATION_EXPIRED;

export function isSubmitterAuthorizationRevoked(value: string): value is "SUBMITTER_AUTHORIZATION_REVOKED" {
  return value === "SUBMITTER_AUTHORIZATION_REVOKED";
}

export const SUBMITTER_AUTHORIZATION_REVOKED_ELIGIBILITY_DEFINITION = ELIGIBILITY_REASON_DICTIONARY.SUBMITTER_AUTHORIZATION_REVOKED;

export function isSubmitterClassificationNotAuthorized(value: string): value is "SUBMITTER_CLASSIFICATION_NOT_AUTHORIZED" {
  return value === "SUBMITTER_CLASSIFICATION_NOT_AUTHORIZED";
}

export const SUBMITTER_CLASSIFICATION_NOT_AUTHORIZED_ELIGIBILITY_DEFINITION = ELIGIBILITY_REASON_DICTIONARY.SUBMITTER_CLASSIFICATION_NOT_AUTHORIZED;

export function isSubmitterSectorNotAuthorized(value: string): value is "SUBMITTER_SECTOR_NOT_AUTHORIZED" {
  return value === "SUBMITTER_SECTOR_NOT_AUTHORIZED";
}

export const SUBMITTER_SECTOR_NOT_AUTHORIZED_ELIGIBILITY_DEFINITION = ELIGIBILITY_REASON_DICTIONARY.SUBMITTER_SECTOR_NOT_AUTHORIZED;

export function isSubmitterRouteNotAuthorized(value: string): value is "SUBMITTER_ROUTE_NOT_AUTHORIZED" {
  return value === "SUBMITTER_ROUTE_NOT_AUTHORIZED";
}

export const SUBMITTER_ROUTE_NOT_AUTHORIZED_ELIGIBILITY_DEFINITION = ELIGIBILITY_REASON_DICTIONARY.SUBMITTER_ROUTE_NOT_AUTHORIZED;

export function isArtifactValidationFailed(value: string): value is "ARTIFACT_VALIDATION_FAILED" {
  return value === "ARTIFACT_VALIDATION_FAILED";
}

export const ARTIFACT_VALIDATION_FAILED_ELIGIBILITY_DEFINITION = ELIGIBILITY_REASON_DICTIONARY.ARTIFACT_VALIDATION_FAILED;

export function isArtifactNotPublicationReady(value: string): value is "ARTIFACT_NOT_PUBLICATION_READY" {
  return value === "ARTIFACT_NOT_PUBLICATION_READY";
}

export const ARTIFACT_NOT_PUBLICATION_READY_ELIGIBILITY_DEFINITION = ELIGIBILITY_REASON_DICTIONARY.ARTIFACT_NOT_PUBLICATION_READY;

export function isArtifactRegistrationAttestationMissing(value: string): value is "ARTIFACT_REGISTRATION_ATTESTATION_MISSING" {
  return value === "ARTIFACT_REGISTRATION_ATTESTATION_MISSING";
}

export const ARTIFACT_REGISTRATION_ATTESTATION_MISSING_ELIGIBILITY_DEFINITION = ELIGIBILITY_REASON_DICTIONARY.ARTIFACT_REGISTRATION_ATTESTATION_MISSING;

export function isArtifactGovernanceLinkMissing(value: string): value is "ARTIFACT_GOVERNANCE_LINK_MISSING" {
  return value === "ARTIFACT_GOVERNANCE_LINK_MISSING";
}

export const ARTIFACT_GOVERNANCE_LINK_MISSING_ELIGIBILITY_DEFINITION = ELIGIBILITY_REASON_DICTIONARY.ARTIFACT_GOVERNANCE_LINK_MISSING;

export function isArtifactArchitectureLinkMissing(value: string): value is "ARTIFACT_ARCHITECTURE_LINK_MISSING" {
  return value === "ARTIFACT_ARCHITECTURE_LINK_MISSING";
}

export const ARTIFACT_ARCHITECTURE_LINK_MISSING_ELIGIBILITY_DEFINITION = ELIGIBILITY_REASON_DICTIONARY.ARTIFACT_ARCHITECTURE_LINK_MISSING;

export function isArtifactRouteLinkMissing(value: string): value is "ARTIFACT_ROUTE_LINK_MISSING" {
  return value === "ARTIFACT_ROUTE_LINK_MISSING";
}

export const ARTIFACT_ROUTE_LINK_MISSING_ELIGIBILITY_DEFINITION = ELIGIBILITY_REASON_DICTIONARY.ARTIFACT_ROUTE_LINK_MISSING;

export function isArtifactDuplicateId(value: string): value is "ARTIFACT_DUPLICATE_ID" {
  return value === "ARTIFACT_DUPLICATE_ID";
}

export const ARTIFACT_DUPLICATE_ID_ELIGIBILITY_DEFINITION = ELIGIBILITY_REASON_DICTIONARY.ARTIFACT_DUPLICATE_ID;

export function isArtifactDuplicateHash(value: string): value is "ARTIFACT_DUPLICATE_HASH" {
  return value === "ARTIFACT_DUPLICATE_HASH";
}

export const ARTIFACT_DUPLICATE_HASH_ELIGIBILITY_DEFINITION = ELIGIBILITY_REASON_DICTIONARY.ARTIFACT_DUPLICATE_HASH;

export function isArtifactScopeAmbiguous(value: string): value is "ARTIFACT_SCOPE_AMBIGUOUS" {
  return value === "ARTIFACT_SCOPE_AMBIGUOUS";
}

export const ARTIFACT_SCOPE_AMBIGUOUS_ELIGIBILITY_DEFINITION = ELIGIBILITY_REASON_DICTIONARY.ARTIFACT_SCOPE_AMBIGUOUS;

export function isArtifactClaimOutsideRegistration(value: string): value is "ARTIFACT_CLAIM_OUTSIDE_REGISTRATION" {
  return value === "ARTIFACT_CLAIM_OUTSIDE_REGISTRATION";
}

export const ARTIFACT_CLAIM_OUTSIDE_REGISTRATION_ELIGIBILITY_DEFINITION = ELIGIBILITY_REASON_DICTIONARY.ARTIFACT_CLAIM_OUTSIDE_REGISTRATION;

export function isGovernanceClaimsEmpty(value: string): value is "GOVERNANCE_CLAIMS_EMPTY" {
  return value === "GOVERNANCE_CLAIMS_EMPTY";
}

export const GOVERNANCE_CLAIMS_EMPTY_ELIGIBILITY_DEFINITION = ELIGIBILITY_REASON_DICTIONARY.GOVERNANCE_CLAIMS_EMPTY;

export function isGovernanceScopeEmpty(value: string): value is "GOVERNANCE_SCOPE_EMPTY" {
  return value === "GOVERNANCE_SCOPE_EMPTY";
}

export const GOVERNANCE_SCOPE_EMPTY_ELIGIBILITY_DEFINITION = ELIGIBILITY_REASON_DICTIONARY.GOVERNANCE_SCOPE_EMPTY;

export function isAuthorizedSubmittersEmpty(value: string): value is "AUTHORIZED_SUBMITTERS_EMPTY" {
  return value === "AUTHORIZED_SUBMITTERS_EMPTY";
}

export const AUTHORIZED_SUBMITTERS_EMPTY_ELIGIBILITY_DEFINITION = ELIGIBILITY_REASON_DICTIONARY.AUTHORIZED_SUBMITTERS_EMPTY;

export function isRegistrationValidFromInvalid(value: string): value is "REGISTRATION_VALID_FROM_INVALID" {
  return value === "REGISTRATION_VALID_FROM_INVALID";
}

export const REGISTRATION_VALID_FROM_INVALID_ELIGIBILITY_DEFINITION = ELIGIBILITY_REASON_DICTIONARY.REGISTRATION_VALID_FROM_INVALID;

export function isRegistrationValidUntilInvalid(value: string): value is "REGISTRATION_VALID_UNTIL_INVALID" {
  return value === "REGISTRATION_VALID_UNTIL_INVALID";
}

export const REGISTRATION_VALID_UNTIL_INVALID_ELIGIBILITY_DEFINITION = ELIGIBILITY_REASON_DICTIONARY.REGISTRATION_VALID_UNTIL_INVALID;

export function isSubmissionTimeInvalid(value: string): value is "SUBMISSION_TIME_INVALID" {
  return value === "SUBMISSION_TIME_INVALID";
}

export const SUBMISSION_TIME_INVALID_ELIGIBILITY_DEFINITION = ELIGIBILITY_REASON_DICTIONARY.SUBMISSION_TIME_INVALID;

export function isSubmissionBeforeRegistration(value: string): value is "SUBMISSION_BEFORE_REGISTRATION" {
  return value === "SUBMISSION_BEFORE_REGISTRATION";
}

export const SUBMISSION_BEFORE_REGISTRATION_ELIGIBILITY_DEFINITION = ELIGIBILITY_REASON_DICTIONARY.SUBMISSION_BEFORE_REGISTRATION;

export function isSubmissionAfterExpiry(value: string): value is "SUBMISSION_AFTER_EXPIRY" {
  return value === "SUBMISSION_AFTER_EXPIRY";
}

export const SUBMISSION_AFTER_EXPIRY_ELIGIBILITY_DEFINITION = ELIGIBILITY_REASON_DICTIONARY.SUBMISSION_AFTER_EXPIRY;

export function isPlaygroundRouteParityMissing(value: string): value is "PLAYGROUND_ROUTE_PARITY_MISSING" {
  return value === "PLAYGROUND_ROUTE_PARITY_MISSING";
}

export const PLAYGROUND_ROUTE_PARITY_MISSING_ELIGIBILITY_DEFINITION = ELIGIBILITY_REASON_DICTIONARY.PLAYGROUND_ROUTE_PARITY_MISSING;

export function isManualImportRequiresEscalation(value: string): value is "MANUAL_IMPORT_REQUIRES_ESCALATION" {
  return value === "MANUAL_IMPORT_REQUIRES_ESCALATION";
}

export const MANUAL_IMPORT_REQUIRES_ESCALATION_ELIGIBILITY_DEFINITION = ELIGIBILITY_REASON_DICTIONARY.MANUAL_IMPORT_REQUIRES_ESCALATION;

export function isIndependentReviewRequired(value: string): value is "INDEPENDENT_REVIEW_REQUIRED" {
  return value === "INDEPENDENT_REVIEW_REQUIRED";
}

export const INDEPENDENT_REVIEW_REQUIRED_ELIGIBILITY_DEFINITION = ELIGIBILITY_REASON_DICTIONARY.INDEPENDENT_REVIEW_REQUIRED;

export function isHighConsequenceReviewRequired(value: string): value is "HIGH_CONSEQUENCE_REVIEW_REQUIRED" {
  return value === "HIGH_CONSEQUENCE_REVIEW_REQUIRED";
}

export const HIGH_CONSEQUENCE_REVIEW_REQUIRED_ELIGIBILITY_DEFINITION = ELIGIBILITY_REASON_DICTIONARY.HIGH_CONSEQUENCE_REVIEW_REQUIRED;

export function isProductionArtifactRequiresInstitutionVerification(value: string): value is "PRODUCTION_ARTIFACT_REQUIRES_INSTITUTION_VERIFICATION" {
  return value === "PRODUCTION_ARTIFACT_REQUIRES_INSTITUTION_VERIFICATION";
}

export const PRODUCTION_ARTIFACT_REQUIRES_INSTITUTION_VERIFICATION_ELIGIBILITY_DEFINITION = ELIGIBILITY_REASON_DICTIONARY.PRODUCTION_ARTIFACT_REQUIRES_INSTITUTION_VERIFICATION;

export function isDemonstrationArtifactLabelMissing(value: string): value is "DEMONSTRATION_ARTIFACT_LABEL_MISSING" {
  return value === "DEMONSTRATION_ARTIFACT_LABEL_MISSING";
}

export const DEMONSTRATION_ARTIFACT_LABEL_MISSING_ELIGIBILITY_DEFINITION = ELIGIBILITY_REASON_DICTIONARY.DEMONSTRATION_ARTIFACT_LABEL_MISSING;

export function isGovernanceProfileUrlMissing(value: string): value is "GOVERNANCE_PROFILE_URL_MISSING" {
  return value === "GOVERNANCE_PROFILE_URL_MISSING";
}

export const GOVERNANCE_PROFILE_URL_MISSING_ELIGIBILITY_DEFINITION = ELIGIBILITY_REASON_DICTIONARY.GOVERNANCE_PROFILE_URL_MISSING;

export function isRegistrationControlFailure(value: string): value is "REGISTRATION_CONTROL_FAILURE" {
  return value === "REGISTRATION_CONTROL_FAILURE";
}

export const REGISTRATION_CONTROL_FAILURE_ELIGIBILITY_DEFINITION = ELIGIBILITY_REASON_DICTIONARY.REGISTRATION_CONTROL_FAILURE;

export function isRegistrationControlHold(value: string): value is "REGISTRATION_CONTROL_HOLD" {
  return value === "REGISTRATION_CONTROL_HOLD";
}

export const REGISTRATION_CONTROL_HOLD_ELIGIBILITY_DEFINITION = ELIGIBILITY_REASON_DICTIONARY.REGISTRATION_CONTROL_HOLD;

export function isRegistrationControlEscalation(value: string): value is "REGISTRATION_CONTROL_ESCALATION" {
  return value === "REGISTRATION_CONTROL_ESCALATION";
}

export const REGISTRATION_CONTROL_ESCALATION_ELIGIBILITY_DEFINITION = ELIGIBILITY_REASON_DICTIONARY.REGISTRATION_CONTROL_ESCALATION;

export default evaluateArtifactRegistrationEligibility;
