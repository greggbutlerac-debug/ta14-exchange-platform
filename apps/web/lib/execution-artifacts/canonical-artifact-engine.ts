/**
 * TA-14 Canonical Execution Artifact Engine
 *
 * Institutional record backbone for producing hundreds or thousands of
 * distinct execution artifacts while preserving one canonical discipline.
 *
 * Governing chain:
 * Reality -> Record -> Continuity -> Admissibility -> Binding -> Commit ->
 * Execution -> Outcome
 *
 * Governing rule:
 * No admissible evidence. No admissible execution.
 *
 * This module is intentionally dependency-free. It can execute in browser,
 * server, tests, export workers, and offline verification packages.
 */

export const ARTIFACT_ENGINE_VERSION = "2.1.0" as const;
export const ARTIFACT_SCHEMA_VERSION = "ta14.execution-artifact.v2.1" as const;
export const CANONICALIZATION_VERSION = "ta14.c14n.v1" as const;

export const DETERMINATIONS = ["ALLOW", "HOLD", "DENY", "ESCALATE"] as const;
export type ArtifactDetermination = (typeof DETERMINATIONS)[number];

export const CHAIN_LINKS = [
  "REALITY",
  "RECORD",
  "CONTINUITY",
  "ADMISSIBILITY",
  "BINDING",
  "COMMIT",
  "EXECUTION",
  "OUTCOME",
] as const;
export type ChainLink = (typeof CHAIN_LINKS)[number];

export const GATE_RESULTS = ["PASS", "FAIL", "UNRESOLVED", "NOT_APPLICABLE"] as const;
export type ArtifactGateResult = (typeof GATE_RESULTS)[number];

export const REQUIREMENT_LEVELS = ["MANDATORY", "CONDITIONAL", "ADVISORY"] as const;
export type RequirementLevel = (typeof REQUIREMENT_LEVELS)[number];

export const PUBLICATION_STATES = [
  "DRAFT",
  "INTERNAL_REVIEW",
  "READY",
  "PUBLISHED",
  "CHALLENGED",
  "CORRECTED",
  "SUPERSEDED",
  "WITHDRAWN",
] as const;
export type ArtifactPublicationState = (typeof PUBLICATION_STATES)[number];

export const DISCLOSURE_LEVELS = ["PUBLIC", "SELECTIVE", "RESTRICTED", "WITHHELD"] as const;
export type DisclosureLevel = (typeof DISCLOSURE_LEVELS)[number];

export const EVIDENCE_ADMISSIBILITY_STATES = [
  "ADMITTED",
  "REJECTED",
  "CONDITIONAL",
  "UNRESOLVED",
  "EXPIRED",
  "REVOKED",
] as const;
export type EvidenceAdmissibilityState =
  (typeof EVIDENCE_ADMISSIBILITY_STATES)[number];

export const AUTHORITY_STATES = [
  "VALID",
  "MISSING",
  "EXPIRED",
  "REVOKED",
  "OUT_OF_SCOPE",
  "CONFLICTED",
  "UNRESOLVED",
] as const;
export type AuthorityState = (typeof AUTHORITY_STATES)[number];

export const CONTINUITY_STATES = [
  "CONTINUOUS",
  "BROKEN",
  "STALE",
  "CHANGED",
  "UNRESOLVED",
] as const;
export type ContinuityState = (typeof CONTINUITY_STATES)[number];

export const EXECUTION_EFFECTS = [
  "RELEASED",
  "HELD",
  "BLOCKED",
  "REROUTED",
  "TERMINATED",
  "ROLLED_BACK",
  "HUMAN_CHECKPOINT_REQUIRED",
  "NO_ACTION",
] as const;
export type ExecutionEffectType = (typeof EXECUTION_EFFECTS)[number];

export const VERIFICATION_LEVELS = [0, 1, 2, 3, 4, 5, 6, 7] as const;
export type VerificationLevel = (typeof VERIFICATION_LEVELS)[number];

export type ISODateTimeString = string;
export type ArtifactId = string;
export type SeriesId = string;
export type RouteId = string;
export type GateId = string;
export type EvidenceId = string;
export type AuthorityId = string;
export type ActorId = string;
export type ReceiptId = string;
export type ReviewId = string;
export type ChallengeId = string;

export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };
export type JsonObject = { [key: string]: JsonValue };

export interface ArtifactIdentity {
  artifactId: ArtifactId;
  seriesId: SeriesId;
  sequence: number;
  title: string;
  slug: string;
  classification: string;
  primaryGovernance: string;
  supportingGovernances: readonly string[];
  sector: string;
  jurisdiction: string;
  owner: ActorReference;
  steward: ActorReference;
  createdAt: ISODateTimeString;
  updatedAt: ISODateTimeString;
  publishedAt?: ISODateTimeString;
  publicationState: ArtifactPublicationState;
  engineVersion: string;
  schemaVersion: string;
}

export interface ActorReference {
  actorId: ActorId;
  displayName: string;
  role: string;
  organization?: string;
  identityProvider?: string;
  identityAssurance?: string;
}

export interface ScenarioSnapshot {
  scenarioId: string;
  proposedAction: string;
  consequenceAtStake: string;
  affectedSubjects: readonly string[];
  environment: string;
  intendedDestination?: string;
  amountOrQuantity?: string;
  requestedModel?: string;
  requestedTool?: string;
  requestedAt: ISODateTimeString;
  executionDeadline?: ISODateTimeString;
  assumptions: readonly string[];
  declaredLimits: readonly string[];
  simulated: boolean;
  simulationDisclosure?: string;
  inputHash?: string;
}

export interface RouteSnapshot {
  routeId: RouteId;
  routeVersion: string;
  routeTitle: string;
  routeOwner: ActorReference;
  jurisdictionProfile: string;
  policyBasis: readonly PolicyReference[];
  gateSequence: readonly GateDefinition[];
  thresholds: readonly ThresholdDefinition[];
  permittedModels: readonly string[];
  permittedTools: readonly string[];
  permittedDestinations: readonly string[];
  revalidationTriggers: readonly RevalidationTrigger[];
  frozenAt: ISODateTimeString;
  frozenHash?: string;
}

export interface PolicyReference {
  policyId: string;
  title: string;
  version: string;
  authority: string;
  source?: string;
  bindingEffect: string;
}

export interface ThresholdDefinition {
  thresholdId: string;
  label: string;
  comparator: "LT" | "LTE" | "EQ" | "GTE" | "GT" | "IN" | "NOT_IN";
  expected: JsonValue;
  unit?: string;
  consequenceIfExceeded: ArtifactDetermination;
}

export interface RevalidationTrigger {
  triggerId: string;
  fieldPath: string;
  description: string;
  requiredResponse: "RECHECK" | "HOLD" | "DENY" | "ESCALATE";
}

export interface EvidenceItem {
  evidenceId: EvidenceId;
  title: string;
  description: string;
  sourceType: string;
  sourceName: string;
  sourceUri?: string;
  capturedAt: ISODateTimeString;
  receivedAt: ISODateTimeString;
  validFrom?: ISODateTimeString;
  validUntil?: ISODateTimeString;
  contentHash?: string;
  custody: readonly CustodyEvent[];
  freshness: "CURRENT" | "STALE" | "EXPIRED" | "UNKNOWN";
  identityLinked: boolean;
  routeLinked: boolean;
  disclosureLevel: DisclosureLevel;
  admissibility: EvidenceAdmissibilityState;
  admissibilityReasonCodes: readonly string[];
  supportsClaims: readonly string[];
  contradictsClaims: readonly string[];
  limitations: readonly string[];
  metadata: JsonObject;
}

export interface CustodyEvent {
  eventId: string;
  occurredAt: ISODateTimeString;
  actor: ActorReference;
  action: "CREATED" | "RECEIVED" | "TRANSFERRED" | "VERIFIED" | "SEALED" | "DISCLOSED";
  location?: string;
  note?: string;
  resultingHash?: string;
}

export interface AuthoritySnapshot {
  authorityId: AuthorityId;
  actor: ActorReference;
  authoritySource: string;
  authorityType: "LEGAL" | "REGULATORY" | "CONTRACTUAL" | "ORGANIZATIONAL" | "DELEGATED" | "TECHNICAL";
  scope: readonly string[];
  permittedActions: readonly string[];
  prohibitedActions: readonly string[];
  validFrom: ISODateTimeString;
  validUntil?: ISODateTimeString;
  revokedAt?: ISODateTimeString;
  delegationChain: readonly DelegationLink[];
  conflictState: "NONE" | "DISCLOSED" | "UNRESOLVED" | "DISQUALIFYING";
  separationOfDutiesSatisfied: boolean;
  evidenceIds: readonly EvidenceId[];
  state: AuthorityState;
  reasonCodes: readonly string[];
  frozenAt: ISODateTimeString;
}

export interface DelegationLink {
  linkId: string;
  grantor: ActorReference;
  grantee: ActorReference;
  scope: readonly string[];
  grantedAt: ISODateTimeString;
  expiresAt?: ISODateTimeString;
  revokedAt?: ISODateTimeString;
  evidenceId?: EvidenceId;
}

export interface ContinuityAssessment {
  assessedAt: ISODateTimeString;
  identityState: ContinuityState;
  evidenceState: ContinuityState;
  routeState: ContinuityState;
  authorityState: ContinuityState;
  environmentState: ContinuityState;
  changedFields: readonly ChangedCondition[];
  revalidationEvents: readonly RevalidationEvent[];
  overallState: ContinuityState;
  reasonCodes: readonly string[];
}

export interface ChangedCondition {
  changeId: string;
  fieldPath: string;
  previousValue: JsonValue;
  currentValue: JsonValue;
  detectedAt: ISODateTimeString;
  material: boolean;
  triggerId?: string;
}

export interface RevalidationEvent {
  eventId: string;
  triggerId: string;
  triggeredAt: ISODateTimeString;
  completedAt?: ISODateTimeString;
  result: "PENDING" | "PASSED" | "FAILED" | "ESCALATED";
  reviewedBy?: ActorReference;
  reasonCodes: readonly string[];
}

export interface AdmissibilityAssessment {
  assessedAt: ISODateTimeString;
  purpose: string;
  consequenceClass: string;
  jurisdiction: string;
  evidenceResults: readonly EvidenceAdmissibilityResult[];
  authorityResult: AuthorityAdmissibilityResult;
  overallResult: "ADMISSIBLE" | "INADMISSIBLE" | "CONDITIONAL" | "UNRESOLVED";
  reasonCodes: readonly string[];
  limitations: readonly string[];
}

export interface EvidenceAdmissibilityResult {
  evidenceId: EvidenceId;
  result: EvidenceAdmissibilityState;
  reasonCodes: readonly string[];
  supportsGateIds: readonly GateId[];
  limitations: readonly string[];
}

export interface AuthorityAdmissibilityResult {
  authorityId: AuthorityId;
  result: "ADMISSIBLE" | "INADMISSIBLE" | "CONDITIONAL" | "UNRESOLVED";
  reasonCodes: readonly string[];
}

export interface BindingAssessment {
  assessedAt: ISODateTimeString;
  appliedPolicies: readonly AppliedPolicy[];
  appliedThresholds: readonly AppliedThreshold[];
  prohibitions: readonly string[];
  obligations: readonly string[];
  permittedScope: readonly string[];
  prohibitedScope: readonly string[];
  reasonCodes: readonly string[];
}

export interface AppliedPolicy {
  policyId: string;
  version: string;
  factsApplied: readonly string[];
  resultingRequirement: string;
  gateIds: readonly GateId[];
}

export interface AppliedThreshold {
  thresholdId: string;
  observed: JsonValue;
  expected: JsonValue;
  satisfied: boolean;
  consequence: ArtifactDetermination;
}

export interface GateDefinition {
  gateId: GateId;
  sequence: number;
  chainLink: ChainLink;
  title: string;
  requirement: string;
  requirementLevel: RequirementLevel;
  failureDetermination: Exclude<ArtifactDetermination, "ALLOW">;
  evidenceRequirementIds: readonly EvidenceId[];
  authorityRequired: boolean;
  evaluation: GateEvaluationDefinition;
}

export type GateEvaluationDefinition =
  | { kind: "BOOLEAN"; fieldPath: string; expected: boolean }
  | { kind: "EXISTS"; fieldPath: string }
  | { kind: "EQUALS"; fieldPath: string; expected: JsonValue }
  | { kind: "IN_SET"; fieldPath: string; expected: readonly JsonPrimitive[] }
  | { kind: "CUSTOM"; evaluatorId: string };

export interface GateLedgerEntry {
  gateId: GateId;
  sequence: number;
  chainLink: ChainLink;
  title: string;
  requirementLevel: RequirementLevel;
  evaluatedAt: ISODateTimeString;
  result: ArtifactGateResult;
  reasonCodes: readonly string[];
  inputs: JsonObject;
  evidenceIds: readonly EvidenceId[];
  authorityIds: readonly AuthorityId[];
  reviewer?: ActorReference;
  earliestFailure: boolean;
  repairCondition?: string;
  notes: readonly string[];
}

export interface DeterminationCommit {
  commitId: string;
  determination: ArtifactDetermination;
  committedAt: ISODateTimeString;
  committedBy: ActorReference;
  earliestFailureGateId?: GateId;
  earliestFailureChainLink?: ChainLink;
  reasonCodes: readonly string[];
  explanation: string;
  permittedNextActions: readonly string[];
  prohibitedNextActions: readonly string[];
  exactAuthorizedScope: readonly string[];
  expiresAt?: ISODateTimeString;
  commitHash?: string;
}

export interface ExecutionRequest {
  requestId: string;
  attemptedAt: ISODateTimeString;
  actor: ActorReference;
  adapterId: string;
  action: string;
  destination?: string;
  amountOrQuantity?: string;
  model?: string;
  tool?: string;
  parameters: JsonObject;
}

export interface ExecutionReceipt {
  receiptId: ReceiptId;
  requestId: string;
  adapterId: string;
  adapterVersion: string;
  determination: ArtifactDetermination;
  command: string;
  effect: ExecutionEffectType;
  attemptedAction: string;
  authorizedScope: readonly string[];
  actualScope: readonly string[];
  startedAt: ISODateTimeString;
  completedAt: ISODateTimeString;
  technicalStatusCode?: string;
  technicalMessage: string;
  bypassDetected: boolean;
  bypassDetails?: string;
  rollbackPerformed: boolean;
  rollbackReceiptId?: ReceiptId;
  externalReceipt?: string;
  receiptHash?: string;
  metadata: JsonObject;
}

export interface OutcomeClosure {
  outcomeId: string;
  closedAt: ISODateTimeString;
  closedBy: ActorReference;
  expectedOutcome: string;
  actualOutcome: string;
  consequenceState: "BOUND" | "PREVENTED" | "PARTIALLY_BOUND" | "UNKNOWN";
  executionEffectConfirmed: boolean;
  closureEvidenceIds: readonly EvidenceId[];
  residualRisks: readonly ResidualRisk[];
  correctiveActions: readonly CorrectiveAction[];
  followUpRequired: boolean;
  followUpDueAt?: ISODateTimeString;
  independentlyVerified: boolean;
  verifier?: ActorReference;
  verificationNotes: readonly string[];
}

export interface ResidualRisk {
  riskId: string;
  description: string;
  severity: "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
  owner: ActorReference;
  treatment: string;
  dueAt?: ISODateTimeString;
  status: "OPEN" | "MITIGATED" | "ACCEPTED" | "TRANSFERRED" | "CLOSED";
}

export interface CorrectiveAction {
  actionId: string;
  description: string;
  owner: ActorReference;
  openedAt: ISODateTimeString;
  dueAt?: ISODateTimeString;
  completedAt?: ISODateTimeString;
  status: "OPEN" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  evidenceIds: readonly EvidenceId[];
}

export interface IntegrityManifest {
  generatedAt: ISODateTimeString;
  canonicalizationVersion: string;
  hashAlgorithm: "SHA-256";
  recordHash: string;
  packageRootHash: string;
  componentHashes: Readonly<Record<string, string>>;
  signatureMethod?: string;
  signature?: string;
  publicKeyReference?: string;
  verifierVersion: string;
  verificationLevel: VerificationLevel;
  parityConfirmed: boolean;
}

export interface ArtifactReview {
  reviewId: ReviewId;
  reviewType: "SCHEMA" | "FACTUAL" | "TECHNICAL" | "INTEGRITY" | "PRIVACY" | "CLAIMS_BOUNDARY" | "INDEPENDENT";
  reviewer: ActorReference;
  reviewedAt: ISODateTimeString;
  result: "PASS" | "FAIL" | "QUALIFIED" | "PENDING";
  scope: readonly string[];
  findings: readonly ReviewFinding[];
  notes: readonly string[];
}

export interface ReviewFinding {
  findingId: string;
  severity: "INFO" | "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
  description: string;
  recordPath?: string;
  requiredAction?: string;
  resolvedAt?: ISODateTimeString;
}

export interface ArtifactChallenge {
  challengeId: ChallengeId;
  openedAt: ISODateTimeString;
  openedBy: ActorReference;
  title: string;
  claim: string;
  challengedPaths: readonly string[];
  submittedEvidenceIds: readonly EvidenceId[];
  status: "OPEN" | "UNDER_REVIEW" | "UPHELD" | "PARTIALLY_UPHELD" | "REJECTED" | "WITHDRAWN";
  response?: string;
  decidedAt?: ISODateTimeString;
  decidedBy?: ActorReference;
  amendmentId?: string;
}

export interface ArtifactAmendment {
  amendmentId: string;
  createdAt: ISODateTimeString;
  createdBy: ActorReference;
  type: "CORRECTION" | "CLARIFICATION" | "SUPERSESSION" | "WITHDRAWAL";
  reason: string;
  affectedPaths: readonly string[];
  replacementValues: JsonObject;
  previousRecordHash: string;
  amendmentHash?: string;
}

export interface ProofBoundary {
  proves: readonly string[];
  doesNotProve: readonly string[];
  relianceConditions: readonly string[];
  knownLimitations: readonly string[];
}

export interface CanonicalExecutionArtifact {
  identity: ArtifactIdentity;
  scenario: ScenarioSnapshot;
  route: RouteSnapshot;
  evidence: readonly EvidenceItem[];
  authorities: readonly AuthoritySnapshot[];
  continuity: ContinuityAssessment;
  admissibility: AdmissibilityAssessment;
  binding: BindingAssessment;
  gateLedger: readonly GateLedgerEntry[];
  commit: DeterminationCommit;
  executionRequests: readonly ExecutionRequest[];
  executionReceipts: readonly ExecutionReceipt[];
  outcome?: OutcomeClosure;
  integrity?: IntegrityManifest;
  reviews: readonly ArtifactReview[];
  challenges: readonly ArtifactChallenge[];
  amendments: readonly ArtifactAmendment[];
  proofBoundary: ProofBoundary;
}

export interface ArtifactDraftInput {
  identity: Omit<ArtifactIdentity, "engineVersion" | "schemaVersion">;
  scenario: ScenarioSnapshot;
  route: RouteSnapshot;
  evidence: readonly EvidenceItem[];
  authorities: readonly AuthoritySnapshot[];
  continuity?: ContinuityAssessment;
  admissibility?: AdmissibilityAssessment;
  binding?: BindingAssessment;
  proofBoundary: ProofBoundary;
}

export interface GateEvaluationContext {
  now: ISODateTimeString;
  artifact: Pick<CanonicalExecutionArtifact, "identity" | "scenario" | "route" | "evidence" | "authorities" | "continuity" | "admissibility" | "binding">;
  customEvaluators?: Readonly<Record<string, CustomGateEvaluator>>;
}

export type CustomGateEvaluator = (
  gate: GateDefinition,
  context: GateEvaluationContext,
) => Omit<GateLedgerEntry, "gateId" | "sequence" | "chainLink" | "title" | "requirementLevel" | "evaluatedAt" | "earliestFailure">;

export interface ExecutionAdapter {
  adapterId: string;
  adapterVersion: string;
  describe(): string;
  enforce(request: ExecutionRequest, commit: DeterminationCommit, artifact: CanonicalExecutionArtifact): Promise<ExecutionReceipt>;
}

export interface ArtifactEngineClock { now(): ISODateTimeString; }
export interface ArtifactEngineIdFactory { create(prefix: string): string; }
export interface ArtifactHashProvider { sha256(input: string): Promise<string>; }

export interface ArtifactEngineDependencies {
  clock?: ArtifactEngineClock;
  ids?: ArtifactEngineIdFactory;
  hash?: ArtifactHashProvider;
  customEvaluators?: Readonly<Record<string, CustomGateEvaluator>>;
}

export interface ValidationIssue {
  code: string;
  path: string;
  severity: "ERROR" | "WARNING";
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  issues: readonly ValidationIssue[];
}

export interface PublicationReadiness {
  ready: boolean;
  blockers: readonly ValidationIssue[];
  warnings: readonly ValidationIssue[];
  achievedVerificationLevel: VerificationLevel;
}

export interface ReasonCodeDefinition {
  code: string;
  chainLink: ChainLink;
  title: string;
  description: string;
  defaultDetermination: ArtifactDetermination;
  repairable: boolean;
  publicMessage: string;
}

const systemClock: ArtifactEngineClock = { now: () => new Date().toISOString() };
const defaultIds: ArtifactEngineIdFactory = {
  create(prefix: string): string {
    const random = typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
    return `${prefix}-${random}`;
  },
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asJsonValue(value: unknown): JsonValue {
  if (value === null || typeof value === "string" || typeof value === "number" || typeof value === "boolean") return value;
  if (Array.isArray(value)) return value.map(asJsonValue);
  if (isRecord(value)) {
    const result: Record<string, JsonValue> = {};
    for (const [key, child] of Object.entries(value)) {
      if (child !== undefined) result[key] = asJsonValue(child);
    }
    return result;
  }
  return String(value);
}

export function stableNormalize(value: unknown): JsonValue {
  if (value === null || typeof value === "string" || typeof value === "number" || typeof value === "boolean") return value;
  if (value instanceof Date) return value.toISOString();
  if (Array.isArray(value)) return value.map(stableNormalize);
  if (isRecord(value)) {
    const result: Record<string, JsonValue> = {};
    for (const key of Object.keys(value).sort()) {
      const child = value[key];
      if (child !== undefined) result[key] = stableNormalize(child);
    }
    return result;
  }
  return String(value);
}

export function canonicalStringify(value: unknown): string {
  return JSON.stringify(stableNormalize(value));
}

export function deepFreeze<T>(value: T): Readonly<T> {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const child of Object.values(value as Record<string, unknown>)) deepFreeze(child);
  }
  return value as Readonly<T>;
}

export function cloneJson<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export function getByPath(root: unknown, path: string): unknown {
  if (!path) return root;
  return path.split(".").reduce<unknown>((current, part) => {
    if (Array.isArray(current) && /^\d+$/.test(part)) return current[Number(part)];
    if (isRecord(current)) return current[part];
    return undefined;
  }, root);
}

function isoIsExpired(value: string | undefined, now: string): boolean {
  return Boolean(value && Date.parse(value) <= Date.parse(now));
}

function unique<T>(values: readonly T[]): T[] { return [...new Set(values)]; }

function determineOverallContinuity(states: readonly ContinuityState[]): ContinuityState {
  if (states.includes("BROKEN")) return "BROKEN";
  if (states.includes("CHANGED")) return "CHANGED";
  if (states.includes("STALE")) return "STALE";
  if (states.includes("UNRESOLVED")) return "UNRESOLVED";
  return "CONTINUOUS";
}

function reason(code: string): ReasonCodeDefinition {
  return REASON_CODE_BY_CODE[code] ?? {
    code,
    chainLink: "RECORD",
    title: "Unregistered reason",
    description: "The record contains a reason code not yet present in the canonical dictionary.",
    defaultDetermination: "HOLD",
    repairable: true,
    publicMessage: "A required condition remains unresolved.",
  };
}
export const REASON_CODES = [
  {
    code: "PROPOSED_ACTION_UNDEFINED",
    chainLink: "REALITY",
    title: "Proposed action undefined",
    description: "The proposed action is not specific enough to govern.",
    defaultDetermination: "HOLD",
    repairable: true,
    publicMessage: "The proposed action is not specific enough to govern.",
  },
  {
    code: "CONSEQUENCE_UNDEFINED",
    chainLink: "REALITY",
    title: "Consequence undefined",
    description: "The consequence at stake has not been bounded.",
    defaultDetermination: "HOLD",
    repairable: true,
    publicMessage: "The consequence at stake has not been bounded.",
  },
  {
    code: "AFFECTED_SUBJECTS_UNKNOWN",
    chainLink: "REALITY",
    title: "Affected subjects unknown",
    description: "Affected subjects or systems have not been identified.",
    defaultDetermination: "HOLD",
    repairable: true,
    publicMessage: "Affected subjects or systems have not been identified.",
  },
  {
    code: "ENVIRONMENT_UNBOUND",
    chainLink: "REALITY",
    title: "Environment unbound",
    description: "The operating environment is not fixed.",
    defaultDetermination: "HOLD",
    repairable: true,
    publicMessage: "The operating environment is not fixed.",
  },
  {
    code: "SIMULATION_UNDISCLOSED",
    chainLink: "REALITY",
    title: "Simulation undisclosed",
    description: "A simulated event is not clearly labeled.",
    defaultDetermination: "DENY",
    repairable: true,
    publicMessage: "A simulated event is not clearly labeled.",
  },
  {
    code: "EVIDENCE_MISSING",
    chainLink: "RECORD",
    title: "Required evidence missing",
    description: "A mandatory evidence item is absent.",
    defaultDetermination: "HOLD",
    repairable: true,
    publicMessage: "A mandatory evidence item is absent.",
  },
  {
    code: "SOURCE_UNATTRIBUTED",
    chainLink: "RECORD",
    title: "Source unattributed",
    description: "Evidence lacks attributable source metadata.",
    defaultDetermination: "HOLD",
    repairable: true,
    publicMessage: "Evidence lacks attributable source metadata.",
  },
  {
    code: "HASH_MISSING",
    chainLink: "RECORD",
    title: "Integrity hash missing",
    description: "A required integrity commitment is absent.",
    defaultDetermination: "HOLD",
    repairable: true,
    publicMessage: "A required integrity commitment is absent.",
  },
  {
    code: "HASH_MISMATCH",
    chainLink: "RECORD",
    title: "Integrity hash mismatch",
    description: "Evidence content does not match its recorded digest.",
    defaultDetermination: "DENY",
    repairable: false,
    publicMessage: "Evidence content does not match its recorded digest.",
  },
  {
    code: "CAPTURE_TIME_MISSING",
    chainLink: "RECORD",
    title: "Capture time missing",
    description: "The record cannot establish when evidence was captured.",
    defaultDetermination: "HOLD",
    repairable: true,
    publicMessage: "The record cannot establish when evidence was captured.",
  },
  {
    code: "IDENTITY_CONTINUITY_BROKEN",
    chainLink: "CONTINUITY",
    title: "Identity continuity broken",
    description: "The actor or subject identity changed or cannot be linked.",
    defaultDetermination: "DENY",
    repairable: false,
    publicMessage: "The actor or subject identity changed or cannot be linked.",
  },
  {
    code: "EVIDENCE_STALE",
    chainLink: "CONTINUITY",
    title: "Evidence stale",
    description: "Evidence exceeded the permitted freshness window.",
    defaultDetermination: "HOLD",
    repairable: true,
    publicMessage: "Evidence exceeded the permitted freshness window.",
  },
  {
    code: "ROUTE_VERSION_CHANGED",
    chainLink: "CONTINUITY",
    title: "Route version changed",
    description: "The active route differs from the frozen route snapshot.",
    defaultDetermination: "DENY",
    repairable: true,
    publicMessage: "The active route differs from the frozen route snapshot.",
  },
  {
    code: "AUTHORITY_CHANGED",
    chainLink: "CONTINUITY",
    title: "Authority changed",
    description: "Authority changed after the route was initially evaluated.",
    defaultDetermination: "HOLD",
    repairable: true,
    publicMessage: "Authority changed after the route was initially evaluated.",
  },
  {
    code: "MATERIAL_CONDITION_CHANGED",
    chainLink: "CONTINUITY",
    title: "Material condition changed",
    description: "A route-defined material condition changed before execution.",
    defaultDetermination: "HOLD",
    repairable: true,
    publicMessage: "A route-defined material condition changed before execution.",
  },
  {
    code: "EVIDENCE_INADMISSIBLE",
    chainLink: "ADMISSIBILITY",
    title: "Evidence inadmissible",
    description: "Evidence is not fit for this purpose, time, jurisdiction, or consequence.",
    defaultDetermination: "DENY",
    repairable: true,
    publicMessage: "Evidence is not fit for this purpose, time, jurisdiction, or consequence.",
  },
  {
    code: "AUTHORITY_INADMISSIBLE",
    chainLink: "ADMISSIBILITY",
    title: "Authority inadmissible",
    description: "The authority record cannot support this consequence.",
    defaultDetermination: "DENY",
    repairable: true,
    publicMessage: "The authority record cannot support this consequence.",
  },
  {
    code: "PURPOSE_MISMATCH",
    chainLink: "ADMISSIBILITY",
    title: "Purpose mismatch",
    description: "Evidence valid for another purpose is being used here.",
    defaultDetermination: "DENY",
    repairable: true,
    publicMessage: "Evidence valid for another purpose is being used here.",
  },
  {
    code: "JURISDICTION_MISMATCH",
    chainLink: "ADMISSIBILITY",
    title: "Jurisdiction mismatch",
    description: "The record does not support reliance in this jurisdiction.",
    defaultDetermination: "HOLD",
    repairable: true,
    publicMessage: "The record does not support reliance in this jurisdiction.",
  },
  {
    code: "CONFLICT_UNRESOLVED",
    chainLink: "ADMISSIBILITY",
    title: "Admissible conflict unresolved",
    description: "Credible admitted evidence conflicts without a resolving rule.",
    defaultDetermination: "ESCALATE",
    repairable: true,
    publicMessage: "Credible admitted evidence conflicts without a resolving rule.",
  },
  {
    code: "POLICY_BASIS_MISSING",
    chainLink: "BINDING",
    title: "Policy basis missing",
    description: "No governing rule has been bound to the facts.",
    defaultDetermination: "HOLD",
    repairable: true,
    publicMessage: "No governing rule has been bound to the facts.",
  },
  {
    code: "THRESHOLD_EXCEEDED",
    chainLink: "BINDING",
    title: "Authorized threshold exceeded",
    description: "The proposed action exceeds an applicable threshold.",
    defaultDetermination: "ESCALATE",
    repairable: true,
    publicMessage: "The proposed action exceeds an applicable threshold.",
  },
  {
    code: "PROHIBITED_SCOPE",
    chainLink: "BINDING",
    title: "Prohibited scope requested",
    description: "The action enters an expressly prohibited scope.",
    defaultDetermination: "DENY",
    repairable: false,
    publicMessage: "The action enters an expressly prohibited scope.",
  },
  {
    code: "DESTINATION_NOT_PERMITTED",
    chainLink: "BINDING",
    title: "Destination not permitted",
    description: "The requested destination is outside the bound route.",
    defaultDetermination: "DENY",
    repairable: true,
    publicMessage: "The requested destination is outside the bound route.",
  },
  {
    code: "MODEL_NOT_PERMITTED",
    chainLink: "BINDING",
    title: "Model not permitted",
    description: "The requested model is not included in the frozen route.",
    defaultDetermination: "DENY",
    repairable: true,
    publicMessage: "The requested model is not included in the frozen route.",
  },
  {
    code: "COMMIT_MISSING",
    chainLink: "COMMIT",
    title: "Determination not committed",
    description: "No fixed determination exists before action.",
    defaultDetermination: "HOLD",
    repairable: true,
    publicMessage: "No fixed determination exists before action.",
  },
  {
    code: "COMMIT_EXPIRED",
    chainLink: "COMMIT",
    title: "Commit expired",
    description: "The committed decision expired before execution.",
    defaultDetermination: "HOLD",
    repairable: true,
    publicMessage: "The committed decision expired before execution.",
  },
  {
    code: "COMMIT_SCOPE_MISMATCH",
    chainLink: "COMMIT",
    title: "Commit scope mismatch",
    description: "The requested action is broader than the committed scope.",
    defaultDetermination: "DENY",
    repairable: true,
    publicMessage: "The requested action is broader than the committed scope.",
  },
  {
    code: "LATE_APPROVAL_ATTEMPT",
    chainLink: "COMMIT",
    title: "Late approval attempt",
    description: "An approval was attempted after execution began.",
    defaultDetermination: "DENY",
    repairable: false,
    publicMessage: "An approval was attempted after execution began.",
  },
  {
    code: "REASON_CODES_MISSING",
    chainLink: "COMMIT",
    title: "Commit reasons missing",
    description: "The determination lacks bounded reasons.",
    defaultDetermination: "HOLD",
    repairable: true,
    publicMessage: "The determination lacks bounded reasons.",
  },
  {
    code: "ADAPTER_UNAVAILABLE",
    chainLink: "EXECUTION",
    title: "Execution adapter unavailable",
    description: "The technical control cannot be invoked.",
    defaultDetermination: "HOLD",
    repairable: true,
    publicMessage: "The technical control cannot be invoked.",
  },
  {
    code: "BYPASS_ATTEMPT",
    chainLink: "EXECUTION",
    title: "Mandatory gate bypass attempted",
    description: "An alternate path attempted to avoid the committed route.",
    defaultDetermination: "DENY",
    repairable: false,
    publicMessage: "An alternate path attempted to avoid the committed route.",
  },
  {
    code: "CONTROL_RECEIPT_MISSING",
    chainLink: "EXECUTION",
    title: "Control receipt missing",
    description: "There is no technical receipt proving the execution effect.",
    defaultDetermination: "HOLD",
    repairable: true,
    publicMessage: "There is no technical receipt proving the execution effect.",
  },
  {
    code: "EXECUTION_SCOPE_MISMATCH",
    chainLink: "EXECUTION",
    title: "Execution scope mismatch",
    description: "The adapter attempted or released a broader scope.",
    defaultDetermination: "DENY",
    repairable: false,
    publicMessage: "The adapter attempted or released a broader scope.",
  },
  {
    code: "ROLLBACK_FAILED",
    chainLink: "EXECUTION",
    title: "Rollback failed",
    description: "The required rollback did not complete.",
    defaultDetermination: "ESCALATE",
    repairable: true,
    publicMessage: "The required rollback did not complete.",
  },
  {
    code: "OUTCOME_UNCLOSED",
    chainLink: "OUTCOME",
    title: "Outcome not closed",
    description: "The artifact claims full-chain proof without closure.",
    defaultDetermination: "HOLD",
    repairable: true,
    publicMessage: "The artifact claims full-chain proof without closure.",
  },
  {
    code: "CLOSURE_EVIDENCE_MISSING",
    chainLink: "OUTCOME",
    title: "Closure evidence missing",
    description: "The reported outcome lacks supporting evidence.",
    defaultDetermination: "HOLD",
    repairable: true,
    publicMessage: "The reported outcome lacks supporting evidence.",
  },
  {
    code: "CONSEQUENCE_STATE_UNKNOWN",
    chainLink: "OUTCOME",
    title: "Consequence state unknown",
    description: "The record cannot establish whether consequence bound to reality.",
    defaultDetermination: "HOLD",
    repairable: true,
    publicMessage: "The record cannot establish whether consequence bound to reality.",
  },
  {
    code: "RESIDUAL_RISK_UNASSIGNED",
    chainLink: "OUTCOME",
    title: "Residual risk unassigned",
    description: "A residual risk has no accountable owner.",
    defaultDetermination: "HOLD",
    repairable: true,
    publicMessage: "A residual risk has no accountable owner.",
  },
  {
    code: "OUTCOME_CONTRADICTS_RECEIPT",
    chainLink: "OUTCOME",
    title: "Outcome contradicts receipt",
    description: "Closure evidence conflicts with the execution receipt.",
    defaultDetermination: "ESCALATE",
    repairable: true,
    publicMessage: "Closure evidence conflicts with the execution receipt.",
  },
  {
    code: "REALITY_CONTROL_01",
    chainLink: "REALITY",
    title: "Reality control condition 01",
    description: "Canonical reality control condition 01 used by route-specific artifact configurations when a more specialized code is not required.",
    defaultDetermination: "DENY",
    repairable: true,
    publicMessage: "Canonical reality control condition 01 used by route-specific artifact configurations when a more specialized code is not required.",
  },
  {
    code: "REALITY_CONTROL_02",
    chainLink: "REALITY",
    title: "Reality control condition 02",
    description: "Canonical reality control condition 02 used by route-specific artifact configurations when a more specialized code is not required.",
    defaultDetermination: "ESCALATE",
    repairable: true,
    publicMessage: "Canonical reality control condition 02 used by route-specific artifact configurations when a more specialized code is not required.",
  },
  {
    code: "REALITY_CONTROL_03",
    chainLink: "REALITY",
    title: "Reality control condition 03",
    description: "Canonical reality control condition 03 used by route-specific artifact configurations when a more specialized code is not required.",
    defaultDetermination: "HOLD",
    repairable: true,
    publicMessage: "Canonical reality control condition 03 used by route-specific artifact configurations when a more specialized code is not required.",
  },
  {
    code: "REALITY_CONTROL_04",
    chainLink: "REALITY",
    title: "Reality control condition 04",
    description: "Canonical reality control condition 04 used by route-specific artifact configurations when a more specialized code is not required.",
    defaultDetermination: "DENY",
    repairable: true,
    publicMessage: "Canonical reality control condition 04 used by route-specific artifact configurations when a more specialized code is not required.",
  },
  {
    code: "REALITY_CONTROL_05",
    chainLink: "REALITY",
    title: "Reality control condition 05",
    description: "Canonical reality control condition 05 used by route-specific artifact configurations when a more specialized code is not required.",
    defaultDetermination: "ESCALATE",
    repairable: true,
    publicMessage: "Canonical reality control condition 05 used by route-specific artifact configurations when a more specialized code is not required.",
  },
  {
    code: "REALITY_CONTROL_06",
    chainLink: "REALITY",
    title: "Reality control condition 06",
    description: "Canonical reality control condition 06 used by route-specific artifact configurations when a more specialized code is not required.",
    defaultDetermination: "HOLD",
    repairable: true,
    publicMessage: "Canonical reality control condition 06 used by route-specific artifact configurations when a more specialized code is not required.",
  },
  {
    code: "REALITY_CONTROL_07",
    chainLink: "REALITY",
    title: "Reality control condition 07",
    description: "Canonical reality control condition 07 used by route-specific artifact configurations when a more specialized code is not required.",
    defaultDetermination: "DENY",
    repairable: true,
    publicMessage: "Canonical reality control condition 07 used by route-specific artifact configurations when a more specialized code is not required.",
  },
  {
    code: "REALITY_CONTROL_08",
    chainLink: "REALITY",
    title: "Reality control condition 08",
    description: "Canonical reality control condition 08 used by route-specific artifact configurations when a more specialized code is not required.",
    defaultDetermination: "ESCALATE",
    repairable: true,
    publicMessage: "Canonical reality control condition 08 used by route-specific artifact configurations when a more specialized code is not required.",
  },
  {
    code: "REALITY_CONTROL_09",
    chainLink: "REALITY",
    title: "Reality control condition 09",
    description: "Canonical reality control condition 09 used by route-specific artifact configurations when a more specialized code is not required.",
    defaultDetermination: "HOLD",
    repairable: true,
    publicMessage: "Canonical reality control condition 09 used by route-specific artifact configurations when a more specialized code is not required.",
  },
  {
    code: "REALITY_CONTROL_10",
    chainLink: "REALITY",
    title: "Reality control condition 10",
    description: "Canonical reality control condition 10 used by route-specific artifact configurations when a more specialized code is not required.",
    defaultDetermination: "DENY",
    repairable: true,
    publicMessage: "Canonical reality control condition 10 used by route-specific artifact configurations when a more specialized code is not required.",
  },
  {
    code: "RECORD_CONTROL_01",
    chainLink: "RECORD",
    title: "Record control condition 01",
    description: "Canonical record control condition 01 used by route-specific artifact configurations when a more specialized code is not required.",
    defaultDetermination: "DENY",
    repairable: true,
    publicMessage: "Canonical record control condition 01 used by route-specific artifact configurations when a more specialized code is not required.",
  },
  {
    code: "RECORD_CONTROL_02",
    chainLink: "RECORD",
    title: "Record control condition 02",
    description: "Canonical record control condition 02 used by route-specific artifact configurations when a more specialized code is not required.",
    defaultDetermination: "ESCALATE",
    repairable: true,
    publicMessage: "Canonical record control condition 02 used by route-specific artifact configurations when a more specialized code is not required.",
  },
  {
    code: "RECORD_CONTROL_03",
    chainLink: "RECORD",
    title: "Record control condition 03",
    description: "Canonical record control condition 03 used by route-specific artifact configurations when a more specialized code is not required.",
    defaultDetermination: "HOLD",
    repairable: true,
    publicMessage: "Canonical record control condition 03 used by route-specific artifact configurations when a more specialized code is not required.",
  },
  {
    code: "RECORD_CONTROL_04",
    chainLink: "RECORD",
    title: "Record control condition 04",
    description: "Canonical record control condition 04 used by route-specific artifact configurations when a more specialized code is not required.",
    defaultDetermination: "DENY",
    repairable: true,
    publicMessage: "Canonical record control condition 04 used by route-specific artifact configurations when a more specialized code is not required.",
  },
  {
    code: "RECORD_CONTROL_05",
    chainLink: "RECORD",
    title: "Record control condition 05",
    description: "Canonical record control condition 05 used by route-specific artifact configurations when a more specialized code is not required.",
    defaultDetermination: "ESCALATE",
    repairable: true,
    publicMessage: "Canonical record control condition 05 used by route-specific artifact configurations when a more specialized code is not required.",
  },
  {
    code: "RECORD_CONTROL_06",
    chainLink: "RECORD",
    title: "Record control condition 06",
    description: "Canonical record control condition 06 used by route-specific artifact configurations when a more specialized code is not required.",
    defaultDetermination: "HOLD",
    repairable: true,
    publicMessage: "Canonical record control condition 06 used by route-specific artifact configurations when a more specialized code is not required.",
  },
  {
    code: "RECORD_CONTROL_07",
    chainLink: "RECORD",
    title: "Record control condition 07",
    description: "Canonical record control condition 07 used by route-specific artifact configurations when a more specialized code is not required.",
    defaultDetermination: "DENY",
    repairable: true,
    publicMessage: "Canonical record control condition 07 used by route-specific artifact configurations when a more specialized code is not required.",
  },
  {
    code: "RECORD_CONTROL_08",
    chainLink: "RECORD",
    title: "Record control condition 08",
    description: "Canonical record control condition 08 used by route-specific artifact configurations when a more specialized code is not required.",
    defaultDetermination: "ESCALATE",
    repairable: true,
    publicMessage: "Canonical record control condition 08 used by route-specific artifact configurations when a more specialized code is not required.",
  },
  {
    code: "RECORD_CONTROL_09",
    chainLink: "RECORD",
    title: "Record control condition 09",
    description: "Canonical record control condition 09 used by route-specific artifact configurations when a more specialized code is not required.",
    defaultDetermination: "HOLD",
    repairable: true,
    publicMessage: "Canonical record control condition 09 used by route-specific artifact configurations when a more specialized code is not required.",
  },
  {
    code: "RECORD_CONTROL_10",
    chainLink: "RECORD",
    title: "Record control condition 10",
    description: "Canonical record control condition 10 used by route-specific artifact configurations when a more specialized code is not required.",
    defaultDetermination: "DENY",
    repairable: true,
    publicMessage: "Canonical record control condition 10 used by route-specific artifact configurations when a more specialized code is not required.",
  },
  {
    code: "CONTINUITY_CONTROL_01",
    chainLink: "CONTINUITY",
    title: "Continuity control condition 01",
    description: "Canonical continuity control condition 01 used by route-specific artifact configurations when a more specialized code is not required.",
    defaultDetermination: "DENY",
    repairable: true,
    publicMessage: "Canonical continuity control condition 01 used by route-specific artifact configurations when a more specialized code is not required.",
  },
  {
    code: "CONTINUITY_CONTROL_02",
    chainLink: "CONTINUITY",
    title: "Continuity control condition 02",
    description: "Canonical continuity control condition 02 used by route-specific artifact configurations when a more specialized code is not required.",
    defaultDetermination: "ESCALATE",
    repairable: true,
    publicMessage: "Canonical continuity control condition 02 used by route-specific artifact configurations when a more specialized code is not required.",
  },
  {
    code: "CONTINUITY_CONTROL_03",
    chainLink: "CONTINUITY",
    title: "Continuity control condition 03",
    description: "Canonical continuity control condition 03 used by route-specific artifact configurations when a more specialized code is not required.",
    defaultDetermination: "HOLD",
    repairable: true,
    publicMessage: "Canonical continuity control condition 03 used by route-specific artifact configurations when a more specialized code is not required.",
  },
  {
    code: "CONTINUITY_CONTROL_04",
    chainLink: "CONTINUITY",
    title: "Continuity control condition 04",
    description: "Canonical continuity control condition 04 used by route-specific artifact configurations when a more specialized code is not required.",
    defaultDetermination: "DENY",
    repairable: true,
    publicMessage: "Canonical continuity control condition 04 used by route-specific artifact configurations when a more specialized code is not required.",
  },
  {
    code: "CONTINUITY_CONTROL_05",
    chainLink: "CONTINUITY",
    title: "Continuity control condition 05",
    description: "Canonical continuity control condition 05 used by route-specific artifact configurations when a more specialized code is not required.",
    defaultDetermination: "ESCALATE",
    repairable: true,
    publicMessage: "Canonical continuity control condition 05 used by route-specific artifact configurations when a more specialized code is not required.",
  },
  {
    code: "CONTINUITY_CONTROL_06",
    chainLink: "CONTINUITY",
    title: "Continuity control condition 06",
    description: "Canonical continuity control condition 06 used by route-specific artifact configurations when a more specialized code is not required.",
    defaultDetermination: "HOLD",
    repairable: true,
    publicMessage: "Canonical continuity control condition 06 used by route-specific artifact configurations when a more specialized code is not required.",
  },
  {
    code: "CONTINUITY_CONTROL_07",
    chainLink: "CONTINUITY",
    title: "Continuity control condition 07",
    description: "Canonical continuity control condition 07 used by route-specific artifact configurations when a more specialized code is not required.",
    defaultDetermination: "DENY",
    repairable: true,
    publicMessage: "Canonical continuity control condition 07 used by route-specific artifact configurations when a more specialized code is not required.",
  },
  {
    code: "CONTINUITY_CONTROL_08",
    chainLink: "CONTINUITY",
    title: "Continuity control condition 08",
    description: "Canonical continuity control condition 08 used by route-specific artifact configurations when a more specialized code is not required.",
    defaultDetermination: "ESCALATE",
    repairable: true,
    publicMessage: "Canonical continuity control condition 08 used by route-specific artifact configurations when a more specialized code is not required.",
  },
  {
    code: "CONTINUITY_CONTROL_09",
    chainLink: "CONTINUITY",
    title: "Continuity control condition 09",
    description: "Canonical continuity control condition 09 used by route-specific artifact configurations when a more specialized code is not required.",
    defaultDetermination: "HOLD",
    repairable: true,
    publicMessage: "Canonical continuity control condition 09 used by route-specific artifact configurations when a more specialized code is not required.",
  },
  {
    code: "CONTINUITY_CONTROL_10",
    chainLink: "CONTINUITY",
    title: "Continuity control condition 10",
    description: "Canonical continuity control condition 10 used by route-specific artifact configurations when a more specialized code is not required.",
    defaultDetermination: "DENY",
    repairable: true,
    publicMessage: "Canonical continuity control condition 10 used by route-specific artifact configurations when a more specialized code is not required.",
  },
  {
    code: "ADMISSIBILITY_CONTROL_01",
    chainLink: "ADMISSIBILITY",
    title: "Admissibility control condition 01",
    description: "Canonical admissibility control condition 01 used by route-specific artifact configurations when a more specialized code is not required.",
    defaultDetermination: "DENY",
    repairable: true,
    publicMessage: "Canonical admissibility control condition 01 used by route-specific artifact configurations when a more specialized code is not required.",
  },
  {
    code: "ADMISSIBILITY_CONTROL_02",
    chainLink: "ADMISSIBILITY",
    title: "Admissibility control condition 02",
    description: "Canonical admissibility control condition 02 used by route-specific artifact configurations when a more specialized code is not required.",
    defaultDetermination: "ESCALATE",
    repairable: true,
    publicMessage: "Canonical admissibility control condition 02 used by route-specific artifact configurations when a more specialized code is not required.",
  },
  {
    code: "ADMISSIBILITY_CONTROL_03",
    chainLink: "ADMISSIBILITY",
    title: "Admissibility control condition 03",
    description: "Canonical admissibility control condition 03 used by route-specific artifact configurations when a more specialized code is not required.",
    defaultDetermination: "HOLD",
    repairable: true,
    publicMessage: "Canonical admissibility control condition 03 used by route-specific artifact configurations when a more specialized code is not required.",
  },
  {
    code: "ADMISSIBILITY_CONTROL_04",
    chainLink: "ADMISSIBILITY",
    title: "Admissibility control condition 04",
    description: "Canonical admissibility control condition 04 used by route-specific artifact configurations when a more specialized code is not required.",
    defaultDetermination: "DENY",
    repairable: true,
    publicMessage: "Canonical admissibility control condition 04 used by route-specific artifact configurations when a more specialized code is not required.",
  },
  {
    code: "ADMISSIBILITY_CONTROL_05",
    chainLink: "ADMISSIBILITY",
    title: "Admissibility control condition 05",
    description: "Canonical admissibility control condition 05 used by route-specific artifact configurations when a more specialized code is not required.",
    defaultDetermination: "ESCALATE",
    repairable: true,
    publicMessage: "Canonical admissibility control condition 05 used by route-specific artifact configurations when a more specialized code is not required.",
  },
  {
    code: "ADMISSIBILITY_CONTROL_06",
    chainLink: "ADMISSIBILITY",
    title: "Admissibility control condition 06",
    description: "Canonical admissibility control condition 06 used by route-specific artifact configurations when a more specialized code is not required.",
    defaultDetermination: "HOLD",
    repairable: true,
    publicMessage: "Canonical admissibility control condition 06 used by route-specific artifact configurations when a more specialized code is not required.",
  },
  {
    code: "ADMISSIBILITY_CONTROL_07",
    chainLink: "ADMISSIBILITY",
    title: "Admissibility control condition 07",
    description: "Canonical admissibility control condition 07 used by route-specific artifact configurations when a more specialized code is not required.",
    defaultDetermination: "DENY",
    repairable: true,
    publicMessage: "Canonical admissibility control condition 07 used by route-specific artifact configurations when a more specialized code is not required.",
  },
  {
    code: "ADMISSIBILITY_CONTROL_08",
    chainLink: "ADMISSIBILITY",
    title: "Admissibility control condition 08",
    description: "Canonical admissibility control condition 08 used by route-specific artifact configurations when a more specialized code is not required.",
    defaultDetermination: "ESCALATE",
    repairable: true,
    publicMessage: "Canonical admissibility control condition 08 used by route-specific artifact configurations when a more specialized code is not required.",
  },
  {
    code: "ADMISSIBILITY_CONTROL_09",
    chainLink: "ADMISSIBILITY",
    title: "Admissibility control condition 09",
    description: "Canonical admissibility control condition 09 used by route-specific artifact configurations when a more specialized code is not required.",
    defaultDetermination: "HOLD",
    repairable: true,
    publicMessage: "Canonical admissibility control condition 09 used by route-specific artifact configurations when a more specialized code is not required.",
  },
  {
    code: "ADMISSIBILITY_CONTROL_10",
    chainLink: "ADMISSIBILITY",
    title: "Admissibility control condition 10",
    description: "Canonical admissibility control condition 10 used by route-specific artifact configurations when a more specialized code is not required.",
    defaultDetermination: "DENY",
    repairable: true,
    publicMessage: "Canonical admissibility control condition 10 used by route-specific artifact configurations when a more specialized code is not required.",
  },
  {
    code: "BINDING_CONTROL_01",
    chainLink: "BINDING",
    title: "Binding control condition 01",
    description: "Canonical binding control condition 01 used by route-specific artifact configurations when a more specialized code is not required.",
    defaultDetermination: "DENY",
    repairable: true,
    publicMessage: "Canonical binding control condition 01 used by route-specific artifact configurations when a more specialized code is not required.",
  },
  {
    code: "BINDING_CONTROL_02",
    chainLink: "BINDING",
    title: "Binding control condition 02",
    description: "Canonical binding control condition 02 used by route-specific artifact configurations when a more specialized code is not required.",
    defaultDetermination: "ESCALATE",
    repairable: true,
    publicMessage: "Canonical binding control condition 02 used by route-specific artifact configurations when a more specialized code is not required.",
  },
  {
    code: "BINDING_CONTROL_03",
    chainLink: "BINDING",
    title: "Binding control condition 03",
    description: "Canonical binding control condition 03 used by route-specific artifact configurations when a more specialized code is not required.",
    defaultDetermination: "HOLD",
    repairable: true,
    publicMessage: "Canonical binding control condition 03 used by route-specific artifact configurations when a more specialized code is not required.",
  },
  {
    code: "BINDING_CONTROL_04",
    chainLink: "BINDING",
    title: "Binding control condition 04",
    description: "Canonical binding control condition 04 used by route-specific artifact configurations when a more specialized code is not required.",
    defaultDetermination: "DENY",
    repairable: true,
    publicMessage: "Canonical binding control condition 04 used by route-specific artifact configurations when a more specialized code is not required.",
  },
  {
    code: "BINDING_CONTROL_05",
    chainLink: "BINDING",
    title: "Binding control condition 05",
    description: "Canonical binding control condition 05 used by route-specific artifact configurations when a more specialized code is not required.",
    defaultDetermination: "ESCALATE",
    repairable: true,
    publicMessage: "Canonical binding control condition 05 used by route-specific artifact configurations when a more specialized code is not required.",
  },
  {
    code: "BINDING_CONTROL_06",
    chainLink: "BINDING",
    title: "Binding control condition 06",
    description: "Canonical binding control condition 06 used by route-specific artifact configurations when a more specialized code is not required.",
    defaultDetermination: "HOLD",
    repairable: true,
    publicMessage: "Canonical binding control condition 06 used by route-specific artifact configurations when a more specialized code is not required.",
  },
  {
    code: "BINDING_CONTROL_07",
    chainLink: "BINDING",
    title: "Binding control condition 07",
    description: "Canonical binding control condition 07 used by route-specific artifact configurations when a more specialized code is not required.",
    defaultDetermination: "DENY",
    repairable: true,
    publicMessage: "Canonical binding control condition 07 used by route-specific artifact configurations when a more specialized code is not required.",
  },
  {
    code: "BINDING_CONTROL_08",
    chainLink: "BINDING",
    title: "Binding control condition 08",
    description: "Canonical binding control condition 08 used by route-specific artifact configurations when a more specialized code is not required.",
    defaultDetermination: "ESCALATE",
    repairable: true,
    publicMessage: "Canonical binding control condition 08 used by route-specific artifact configurations when a more specialized code is not required.",
  },
  {
    code: "BINDING_CONTROL_09",
    chainLink: "BINDING",
    title: "Binding control condition 09",
    description: "Canonical binding control condition 09 used by route-specific artifact configurations when a more specialized code is not required.",
    defaultDetermination: "HOLD",
    repairable: true,
    publicMessage: "Canonical binding control condition 09 used by route-specific artifact configurations when a more specialized code is not required.",
  },
  {
    code: "BINDING_CONTROL_10",
    chainLink: "BINDING",
    title: "Binding control condition 10",
    description: "Canonical binding control condition 10 used by route-specific artifact configurations when a more specialized code is not required.",
    defaultDetermination: "DENY",
    repairable: true,
    publicMessage: "Canonical binding control condition 10 used by route-specific artifact configurations when a more specialized code is not required.",
  },
  {
    code: "COMMIT_CONTROL_01",
    chainLink: "COMMIT",
    title: "Commit control condition 01",
    description: "Canonical commit control condition 01 used by route-specific artifact configurations when a more specialized code is not required.",
    defaultDetermination: "DENY",
    repairable: true,
    publicMessage: "Canonical commit control condition 01 used by route-specific artifact configurations when a more specialized code is not required.",
  },
  {
    code: "COMMIT_CONTROL_02",
    chainLink: "COMMIT",
    title: "Commit control condition 02",
    description: "Canonical commit control condition 02 used by route-specific artifact configurations when a more specialized code is not required.",
    defaultDetermination: "ESCALATE",
    repairable: true,
    publicMessage: "Canonical commit control condition 02 used by route-specific artifact configurations when a more specialized code is not required.",
  },
  {
    code: "COMMIT_CONTROL_03",
    chainLink: "COMMIT",
    title: "Commit control condition 03",
    description: "Canonical commit control condition 03 used by route-specific artifact configurations when a more specialized code is not required.",
    defaultDetermination: "HOLD",
    repairable: true,
    publicMessage: "Canonical commit control condition 03 used by route-specific artifact configurations when a more specialized code is not required.",
  },
  {
    code: "COMMIT_CONTROL_04",
    chainLink: "COMMIT",
    title: "Commit control condition 04",
    description: "Canonical commit control condition 04 used by route-specific artifact configurations when a more specialized code is not required.",
    defaultDetermination: "DENY",
    repairable: true,
    publicMessage: "Canonical commit control condition 04 used by route-specific artifact configurations when a more specialized code is not required.",
  },
  {
    code: "COMMIT_CONTROL_05",
    chainLink: "COMMIT",
    title: "Commit control condition 05",
    description: "Canonical commit control condition 05 used by route-specific artifact configurations when a more specialized code is not required.",
    defaultDetermination: "ESCALATE",
    repairable: true,
    publicMessage: "Canonical commit control condition 05 used by route-specific artifact configurations when a more specialized code is not required.",
  },
  {
    code: "COMMIT_CONTROL_06",
    chainLink: "COMMIT",
    title: "Commit control condition 06",
    description: "Canonical commit control condition 06 used by route-specific artifact configurations when a more specialized code is not required.",
    defaultDetermination: "HOLD",
    repairable: true,
    publicMessage: "Canonical commit control condition 06 used by route-specific artifact configurations when a more specialized code is not required.",
  },
  {
    code: "COMMIT_CONTROL_07",
    chainLink: "COMMIT",
    title: "Commit control condition 07",
    description: "Canonical commit control condition 07 used by route-specific artifact configurations when a more specialized code is not required.",
    defaultDetermination: "DENY",
    repairable: true,
    publicMessage: "Canonical commit control condition 07 used by route-specific artifact configurations when a more specialized code is not required.",
  },
  {
    code: "COMMIT_CONTROL_08",
    chainLink: "COMMIT",
    title: "Commit control condition 08",
    description: "Canonical commit control condition 08 used by route-specific artifact configurations when a more specialized code is not required.",
    defaultDetermination: "ESCALATE",
    repairable: true,
    publicMessage: "Canonical commit control condition 08 used by route-specific artifact configurations when a more specialized code is not required.",
  },
  {
    code: "COMMIT_CONTROL_09",
    chainLink: "COMMIT",
    title: "Commit control condition 09",
    description: "Canonical commit control condition 09 used by route-specific artifact configurations when a more specialized code is not required.",
    defaultDetermination: "HOLD",
    repairable: true,
    publicMessage: "Canonical commit control condition 09 used by route-specific artifact configurations when a more specialized code is not required.",
  },
  {
    code: "COMMIT_CONTROL_10",
    chainLink: "COMMIT",
    title: "Commit control condition 10",
    description: "Canonical commit control condition 10 used by route-specific artifact configurations when a more specialized code is not required.",
    defaultDetermination: "DENY",
    repairable: true,
    publicMessage: "Canonical commit control condition 10 used by route-specific artifact configurations when a more specialized code is not required.",
  },
  {
    code: "EXECUTION_CONTROL_01",
    chainLink: "EXECUTION",
    title: "Execution control condition 01",
    description: "Canonical execution control condition 01 used by route-specific artifact configurations when a more specialized code is not required.",
    defaultDetermination: "DENY",
    repairable: true,
    publicMessage: "Canonical execution control condition 01 used by route-specific artifact configurations when a more specialized code is not required.",
  },
  {
    code: "EXECUTION_CONTROL_02",
    chainLink: "EXECUTION",
    title: "Execution control condition 02",
    description: "Canonical execution control condition 02 used by route-specific artifact configurations when a more specialized code is not required.",
    defaultDetermination: "ESCALATE",
    repairable: true,
    publicMessage: "Canonical execution control condition 02 used by route-specific artifact configurations when a more specialized code is not required.",
  },
  {
    code: "EXECUTION_CONTROL_03",
    chainLink: "EXECUTION",
    title: "Execution control condition 03",
    description: "Canonical execution control condition 03 used by route-specific artifact configurations when a more specialized code is not required.",
    defaultDetermination: "HOLD",
    repairable: true,
    publicMessage: "Canonical execution control condition 03 used by route-specific artifact configurations when a more specialized code is not required.",
  },
  {
    code: "EXECUTION_CONTROL_04",
    chainLink: "EXECUTION",
    title: "Execution control condition 04",
    description: "Canonical execution control condition 04 used by route-specific artifact configurations when a more specialized code is not required.",
    defaultDetermination: "DENY",
    repairable: true,
    publicMessage: "Canonical execution control condition 04 used by route-specific artifact configurations when a more specialized code is not required.",
  },
  {
    code: "EXECUTION_CONTROL_05",
    chainLink: "EXECUTION",
    title: "Execution control condition 05",
    description: "Canonical execution control condition 05 used by route-specific artifact configurations when a more specialized code is not required.",
    defaultDetermination: "ESCALATE",
    repairable: true,
    publicMessage: "Canonical execution control condition 05 used by route-specific artifact configurations when a more specialized code is not required.",
  },
  {
    code: "EXECUTION_CONTROL_06",
    chainLink: "EXECUTION",
    title: "Execution control condition 06",
    description: "Canonical execution control condition 06 used by route-specific artifact configurations when a more specialized code is not required.",
    defaultDetermination: "HOLD",
    repairable: true,
    publicMessage: "Canonical execution control condition 06 used by route-specific artifact configurations when a more specialized code is not required.",
  },
  {
    code: "EXECUTION_CONTROL_07",
    chainLink: "EXECUTION",
    title: "Execution control condition 07",
    description: "Canonical execution control condition 07 used by route-specific artifact configurations when a more specialized code is not required.",
    defaultDetermination: "DENY",
    repairable: true,
    publicMessage: "Canonical execution control condition 07 used by route-specific artifact configurations when a more specialized code is not required.",
  },
  {
    code: "EXECUTION_CONTROL_08",
    chainLink: "EXECUTION",
    title: "Execution control condition 08",
    description: "Canonical execution control condition 08 used by route-specific artifact configurations when a more specialized code is not required.",
    defaultDetermination: "ESCALATE",
    repairable: true,
    publicMessage: "Canonical execution control condition 08 used by route-specific artifact configurations when a more specialized code is not required.",
  },
  {
    code: "EXECUTION_CONTROL_09",
    chainLink: "EXECUTION",
    title: "Execution control condition 09",
    description: "Canonical execution control condition 09 used by route-specific artifact configurations when a more specialized code is not required.",
    defaultDetermination: "HOLD",
    repairable: true,
    publicMessage: "Canonical execution control condition 09 used by route-specific artifact configurations when a more specialized code is not required.",
  },
  {
    code: "EXECUTION_CONTROL_10",
    chainLink: "EXECUTION",
    title: "Execution control condition 10",
    description: "Canonical execution control condition 10 used by route-specific artifact configurations when a more specialized code is not required.",
    defaultDetermination: "DENY",
    repairable: true,
    publicMessage: "Canonical execution control condition 10 used by route-specific artifact configurations when a more specialized code is not required.",
  },
  {
    code: "OUTCOME_CONTROL_01",
    chainLink: "OUTCOME",
    title: "Outcome control condition 01",
    description: "Canonical outcome control condition 01 used by route-specific artifact configurations when a more specialized code is not required.",
    defaultDetermination: "DENY",
    repairable: true,
    publicMessage: "Canonical outcome control condition 01 used by route-specific artifact configurations when a more specialized code is not required.",
  },
  {
    code: "OUTCOME_CONTROL_02",
    chainLink: "OUTCOME",
    title: "Outcome control condition 02",
    description: "Canonical outcome control condition 02 used by route-specific artifact configurations when a more specialized code is not required.",
    defaultDetermination: "ESCALATE",
    repairable: true,
    publicMessage: "Canonical outcome control condition 02 used by route-specific artifact configurations when a more specialized code is not required.",
  },
  {
    code: "OUTCOME_CONTROL_03",
    chainLink: "OUTCOME",
    title: "Outcome control condition 03",
    description: "Canonical outcome control condition 03 used by route-specific artifact configurations when a more specialized code is not required.",
    defaultDetermination: "HOLD",
    repairable: true,
    publicMessage: "Canonical outcome control condition 03 used by route-specific artifact configurations when a more specialized code is not required.",
  },
  {
    code: "OUTCOME_CONTROL_04",
    chainLink: "OUTCOME",
    title: "Outcome control condition 04",
    description: "Canonical outcome control condition 04 used by route-specific artifact configurations when a more specialized code is not required.",
    defaultDetermination: "DENY",
    repairable: true,
    publicMessage: "Canonical outcome control condition 04 used by route-specific artifact configurations when a more specialized code is not required.",
  },
  {
    code: "OUTCOME_CONTROL_05",
    chainLink: "OUTCOME",
    title: "Outcome control condition 05",
    description: "Canonical outcome control condition 05 used by route-specific artifact configurations when a more specialized code is not required.",
    defaultDetermination: "ESCALATE",
    repairable: true,
    publicMessage: "Canonical outcome control condition 05 used by route-specific artifact configurations when a more specialized code is not required.",
  },
  {
    code: "OUTCOME_CONTROL_06",
    chainLink: "OUTCOME",
    title: "Outcome control condition 06",
    description: "Canonical outcome control condition 06 used by route-specific artifact configurations when a more specialized code is not required.",
    defaultDetermination: "HOLD",
    repairable: true,
    publicMessage: "Canonical outcome control condition 06 used by route-specific artifact configurations when a more specialized code is not required.",
  },
  {
    code: "OUTCOME_CONTROL_07",
    chainLink: "OUTCOME",
    title: "Outcome control condition 07",
    description: "Canonical outcome control condition 07 used by route-specific artifact configurations when a more specialized code is not required.",
    defaultDetermination: "DENY",
    repairable: true,
    publicMessage: "Canonical outcome control condition 07 used by route-specific artifact configurations when a more specialized code is not required.",
  },
  {
    code: "OUTCOME_CONTROL_08",
    chainLink: "OUTCOME",
    title: "Outcome control condition 08",
    description: "Canonical outcome control condition 08 used by route-specific artifact configurations when a more specialized code is not required.",
    defaultDetermination: "ESCALATE",
    repairable: true,
    publicMessage: "Canonical outcome control condition 08 used by route-specific artifact configurations when a more specialized code is not required.",
  },
  {
    code: "OUTCOME_CONTROL_09",
    chainLink: "OUTCOME",
    title: "Outcome control condition 09",
    description: "Canonical outcome control condition 09 used by route-specific artifact configurations when a more specialized code is not required.",
    defaultDetermination: "HOLD",
    repairable: true,
    publicMessage: "Canonical outcome control condition 09 used by route-specific artifact configurations when a more specialized code is not required.",
  },
  {
    code: "OUTCOME_CONTROL_10",
    chainLink: "OUTCOME",
    title: "Outcome control condition 10",
    description: "Canonical outcome control condition 10 used by route-specific artifact configurations when a more specialized code is not required.",
    defaultDetermination: "DENY",
    repairable: true,
    publicMessage: "Canonical outcome control condition 10 used by route-specific artifact configurations when a more specialized code is not required.",
  },
] as const satisfies readonly ReasonCodeDefinition[];

export const REASON_CODE_BY_CODE: Readonly<Record<string, ReasonCodeDefinition>> = Object.freeze(
  Object.fromEntries(REASON_CODES.map((item) => [item.code, item])),
);


export function createContinuityAssessment(
  artifact: Pick<CanonicalExecutionArtifact, "scenario" | "route" | "evidence" | "authorities">,
  now: ISODateTimeString,
  changedFields: readonly ChangedCondition[] = [],
  revalidationEvents: readonly RevalidationEvent[] = [],
): ContinuityAssessment {
  const evidenceState: ContinuityState = artifact.evidence.some((item) => item.contentHash === undefined)
    ? "UNRESOLVED"
    : artifact.evidence.some((item) => item.freshness === "EXPIRED")
      ? "STALE"
      : "CONTINUOUS";
  const authorityState: ContinuityState = artifact.authorities.some((item) => item.state !== "VALID")
    ? "BROKEN"
    : artifact.authorities.some((item) => isoIsExpired(item.validUntil, now))
      ? "STALE"
      : "CONTINUOUS";
  const routeState: ContinuityState = artifact.route.frozenAt ? "CONTINUOUS" : "UNRESOLVED";
  const identityState: ContinuityState = artifact.evidence.every((item) => item.identityLinked)
    ? "CONTINUOUS"
    : "BROKEN";
  const environmentState: ContinuityState = changedFields.some((item) => item.material)
    ? "CHANGED"
    : "CONTINUOUS";
  const states = [identityState, evidenceState, routeState, authorityState, environmentState];
  const overallState = determineOverallContinuity(states);
  const reasonCodes: string[] = [];
  if (identityState === "BROKEN") reasonCodes.push("IDENTITY_CONTINUITY_BROKEN");
  if (evidenceState === "STALE") reasonCodes.push("EVIDENCE_STALE");
  if (routeState !== "CONTINUOUS") reasonCodes.push("ROUTE_VERSION_CHANGED");
  if (authorityState !== "CONTINUOUS") reasonCodes.push("AUTHORITY_CHANGED");
  if (environmentState === "CHANGED") reasonCodes.push("MATERIAL_CONDITION_CHANGED");
  return {
    assessedAt: now,
    identityState,
    evidenceState,
    routeState,
    authorityState,
    environmentState,
    changedFields,
    revalidationEvents,
    overallState,
    reasonCodes,
  };
}

export function createAdmissibilityAssessment(
  artifact: Pick<CanonicalExecutionArtifact, "identity" | "scenario" | "evidence" | "authorities">,
  now: ISODateTimeString,
): AdmissibilityAssessment {
  const evidenceResults: EvidenceAdmissibilityResult[] = artifact.evidence.map((item) => ({
    evidenceId: item.evidenceId,
    result: item.admissibility,
    reasonCodes: item.admissibilityReasonCodes,
    supportsGateIds: [],
    limitations: item.limitations,
  }));
  const primaryAuthority = artifact.authorities[0];
  const authorityResult: AuthorityAdmissibilityResult = {
    authorityId: primaryAuthority?.authorityId ?? "authority-missing",
    result: !primaryAuthority
      ? "INADMISSIBLE"
      : primaryAuthority.state === "VALID"
        ? "ADMISSIBLE"
        : primaryAuthority.state === "UNRESOLVED" || primaryAuthority.state === "CONFLICTED"
          ? "UNRESOLVED"
          : "INADMISSIBLE",
    reasonCodes: primaryAuthority?.reasonCodes ?? ["AUTHORITY_INADMISSIBLE"],
  };
  const anyRejected = evidenceResults.some((item) => ["REJECTED", "EXPIRED", "REVOKED"].includes(item.result));
  const anyUnresolved = evidenceResults.some((item) => item.result === "UNRESOLVED");
  const anyConditional = evidenceResults.some((item) => item.result === "CONDITIONAL");
  const overallResult = authorityResult.result === "INADMISSIBLE" || anyRejected
    ? "INADMISSIBLE"
    : authorityResult.result === "UNRESOLVED" || anyUnresolved
      ? "UNRESOLVED"
      : anyConditional || authorityResult.result === "CONDITIONAL"
        ? "CONDITIONAL"
        : "ADMISSIBLE";
  return {
    assessedAt: now,
    purpose: artifact.scenario.proposedAction,
    consequenceClass: artifact.identity.classification,
    jurisdiction: artifact.identity.jurisdiction,
    evidenceResults,
    authorityResult,
    overallResult,
    reasonCodes: unique([
      ...evidenceResults.flatMap((item) => item.reasonCodes),
      ...authorityResult.reasonCodes,
    ]),
    limitations: unique(evidenceResults.flatMap((item) => item.limitations)),
  };
}

export function createBindingAssessment(
  route: RouteSnapshot,
  scenario: ScenarioSnapshot,
  now: ISODateTimeString,
): BindingAssessment {
  void now;
  const appliedPolicies = route.policyBasis.map<AppliedPolicy>((policy) => ({
    policyId: policy.policyId,
    version: policy.version,
    factsApplied: [scenario.proposedAction, scenario.consequenceAtStake],
    resultingRequirement: policy.bindingEffect,
    gateIds: route.gateSequence.filter((gate) => gate.chainLink === "BINDING").map((gate) => gate.gateId),
  }));
  const appliedThresholds = route.thresholds.map<AppliedThreshold>((threshold) => ({
    thresholdId: threshold.thresholdId,
    observed: scenario.amountOrQuantity ?? null,
    expected: threshold.expected,
    satisfied: true,
    consequence: threshold.consequenceIfExceeded,
  }));
  return {
    assessedAt: new Date().toISOString(),
    appliedPolicies,
    appliedThresholds,
    prohibitions: route.policyBasis.filter((item) => /prohibit|deny|must not/i.test(item.bindingEffect)).map((item) => item.bindingEffect),
    obligations: route.policyBasis.map((item) => item.bindingEffect),
    permittedScope: route.permittedDestinations,
    prohibitedScope: [],
    reasonCodes: route.policyBasis.length ? [] : ["POLICY_BASIS_MISSING"],
  };
}

function evaluateBuiltInGate(gate: GateDefinition, context: GateEvaluationContext): Omit<GateLedgerEntry, "gateId" | "sequence" | "chainLink" | "title" | "requirementLevel" | "evaluatedAt" | "earliestFailure"> {
  const value = getByPath(context.artifact, gate.evaluation.kind === "CUSTOM" ? "" : gate.evaluation.fieldPath);
  let passed = false;
  switch (gate.evaluation.kind) {
    case "BOOLEAN": passed = value === gate.evaluation.expected; break;
    case "EXISTS": passed = value !== undefined && value !== null && value !== ""; break;
    case "EQUALS": passed = canonicalStringify(value) === canonicalStringify(gate.evaluation.expected); break;
    case "IN_SET": passed = gate.evaluation.expected.some((expected) => canonicalStringify(expected) === canonicalStringify(value)); break;
    case "CUSTOM": {
      const evaluator = context.customEvaluators?.[gate.evaluation.evaluatorId];
      if (!evaluator) {
        return { result: "UNRESOLVED", reasonCodes: ["EXECUTION_CONTROL_01"], inputs: {}, evidenceIds: gate.evidenceRequirementIds, authorityIds: [], notes: ["Custom evaluator is not registered."], repairCondition: `Register evaluator ${gate.evaluation.evaluatorId}.` };
      }
      return evaluator(gate, context);
    }
  }
  return {
    result: passed ? "PASS" : "FAIL",
    reasonCodes: passed ? [] : [defaultReasonForLink(gate.chainLink)],
    inputs: { observed: asJsonValue(value), expected: asJsonValue(gate.evaluation.kind === "BOOLEAN" || gate.evaluation.kind === "EQUALS" || gate.evaluation.kind === "IN_SET" ? gate.evaluation.expected : true) },
    evidenceIds: gate.evidenceRequirementIds,
    authorityIds: gate.authorityRequired ? context.artifact.authorities.map((item) => item.authorityId) : [],
    notes: [],
    repairCondition: passed ? undefined : gate.requirement,
  };
}

export function defaultReasonForLink(link: ChainLink): string {
  const map: Record<ChainLink, string> = {
    REALITY: "PROPOSED_ACTION_UNDEFINED",
    RECORD: "EVIDENCE_MISSING",
    CONTINUITY: "MATERIAL_CONDITION_CHANGED",
    ADMISSIBILITY: "EVIDENCE_INADMISSIBLE",
    BINDING: "POLICY_BASIS_MISSING",
    COMMIT: "COMMIT_MISSING",
    EXECUTION: "CONTROL_RECEIPT_MISSING",
    OUTCOME: "OUTCOME_UNCLOSED",
  };
  return map[link];
}

export function runGateLedger(route: RouteSnapshot, context: GateEvaluationContext): GateLedgerEntry[] {
  const ordered = [...route.gateSequence].sort((a, b) => a.sequence - b.sequence);
  const entries = ordered.map<GateLedgerEntry>((gate) => ({
    gateId: gate.gateId,
    sequence: gate.sequence,
    chainLink: gate.chainLink,
    title: gate.title,
    requirementLevel: gate.requirementLevel,
    evaluatedAt: context.now,
    earliestFailure: false,
    ...evaluateBuiltInGate(gate, context),
  }));
  const firstIndex = entries.findIndex((entry) => entry.requirementLevel === "MANDATORY" && entry.result !== "PASS" && entry.result !== "NOT_APPLICABLE");
  if (firstIndex >= 0) entries[firstIndex] = { ...entries[firstIndex]!, earliestFailure: true };
  return entries;
}

export function determineFromLedger(entries: readonly GateLedgerEntry[]): { determination: ArtifactDetermination; earliest?: GateLedgerEntry; reasonCodes: readonly string[] } {
  const earliest = [...entries].sort((a, b) => a.sequence - b.sequence).find((entry) => entry.earliestFailure);
  if (!earliest) return { determination: "ALLOW", reasonCodes: [] };
  const reasons = earliest.reasonCodes.map(reason);
  const determination = reasons.some((item) => item.defaultDetermination === "DENY")
    ? "DENY"
    : reasons.some((item) => item.defaultDetermination === "ESCALATE")
      ? "ESCALATE"
      : "HOLD";
  return { determination, earliest, reasonCodes: earliest.reasonCodes };
}

export function createCommit(
  ledger: readonly GateLedgerEntry[],
  actor: ActorReference,
  clock: ArtifactEngineClock = systemClock,
  ids: ArtifactEngineIdFactory = defaultIds,
): DeterminationCommit {
  const result = determineFromLedger(ledger);
  return {
    commitId: ids.create("commit"),
    determination: result.determination,
    committedAt: clock.now(),
    committedBy: actor,
    earliestFailureGateId: result.earliest?.gateId,
    earliestFailureChainLink: result.earliest?.chainLink,
    reasonCodes: result.reasonCodes,
    explanation: result.determination === "ALLOW"
      ? "All mandatory route conditions passed before action."
      : result.earliest?.repairCondition ?? "A mandatory route condition did not pass.",
    permittedNextActions: result.determination === "ALLOW"
      ? ["EXECUTE_EXACT_COMMITTED_SCOPE"]
      : result.determination === "ESCALATE"
        ? ["ROUTE_TO_NAMED_AUTHORITY"]
        : result.determination === "HOLD"
          ? ["REPAIR_AND_REVALIDATE"]
          : ["PRESERVE_DENIAL_RECORD"],
    prohibitedNextActions: result.determination === "ALLOW" ? ["EXPAND_SCOPE_WITHOUT_REVALIDATION"] : ["EXECUTE", "BYPASS", "BACKDATE_APPROVAL"],
    exactAuthorizedScope: result.determination === "ALLOW" ? ["SCENARIO_PROPOSED_ACTION_ONLY"] : [],
  };
}

export function expectedExecutionEffect(determination: ArtifactDetermination): ExecutionEffectType {
  if (determination === "ALLOW") return "RELEASED";
  if (determination === "HOLD") return "HELD";
  if (determination === "DENY") return "BLOCKED";
  return "HUMAN_CHECKPOINT_REQUIRED";
}

export class ReferenceExecutionAdapter implements ExecutionAdapter {
  readonly adapterId = "ta14-reference-adapter";
  readonly adapterVersion = "1.0.0";
  constructor(private readonly deps: Pick<ArtifactEngineDependencies, "clock" | "ids"> = {}) {}
  describe(): string { return "Deterministic reference adapter that records enforcement without invoking an external system."; }
  async enforce(request: ExecutionRequest, commit: DeterminationCommit): Promise<ExecutionReceipt> {
    const clock = this.deps.clock ?? systemClock;
    const ids = this.deps.ids ?? defaultIds;
    const startedAt = clock.now();
    const effect = expectedExecutionEffect(commit.determination);
    return {
      receiptId: ids.create("receipt"), requestId: request.requestId, adapterId: this.adapterId, adapterVersion: this.adapterVersion,
      determination: commit.determination, command: effect, effect, attemptedAction: request.action,
      authorizedScope: commit.exactAuthorizedScope, actualScope: effect === "RELEASED" ? [request.action] : [],
      startedAt, completedAt: clock.now(), technicalStatusCode: effect === "RELEASED" ? "200" : effect === "HELD" ? "423" : effect === "BLOCKED" ? "403" : "202",
      technicalMessage: `Reference adapter produced ${effect}.`, bypassDetected: false, rollbackPerformed: false,
      metadata: { deterministic: true, externalSideEffect: false },
    };
  }
}

export class CanonicalArtifactEngine {
  private readonly clock: ArtifactEngineClock;
  private readonly ids: ArtifactEngineIdFactory;
  private readonly hash?: ArtifactHashProvider;
  private readonly customEvaluators: Readonly<Record<string, CustomGateEvaluator>>;
  constructor(deps: ArtifactEngineDependencies = {}) {
    this.clock = deps.clock ?? systemClock;
    this.ids = deps.ids ?? defaultIds;
    this.hash = deps.hash;
    this.customEvaluators = deps.customEvaluators ?? {};
  }

  createDraft(input: ArtifactDraftInput): CanonicalExecutionArtifact {
    const now = this.clock.now();
    const base = {
      identity: { ...input.identity, engineVersion: ARTIFACT_ENGINE_VERSION, schemaVersion: ARTIFACT_SCHEMA_VERSION },
      scenario: cloneJson(input.scenario), route: cloneJson(input.route), evidence: cloneJson(input.evidence), authorities: cloneJson(input.authorities),
    };
    const continuity = input.continuity ?? createContinuityAssessment(base, now);
    const admissibility = input.admissibility ?? createAdmissibilityAssessment({ ...base, continuity } as CanonicalExecutionArtifact, now);
    const binding = input.binding ?? createBindingAssessment(base.route, base.scenario, now);
    const contextArtifact = { ...base, continuity, admissibility, binding };
    const gateLedger = runGateLedger(base.route, { now, artifact: contextArtifact, customEvaluators: this.customEvaluators });
    const commit = createCommit(gateLedger, input.identity.steward, this.clock, this.ids);
    return deepFreeze({ ...contextArtifact, gateLedger, commit, executionRequests: [], executionReceipts: [], reviews: [], challenges: [], amendments: [], proofBoundary: cloneJson(input.proofBoundary) }) as CanonicalExecutionArtifact;
  }

  async enforce(artifact: CanonicalExecutionArtifact, request: ExecutionRequest, adapter: ExecutionAdapter): Promise<CanonicalExecutionArtifact> {
    const receipt = await adapter.enforce(request, artifact.commit, artifact);
    const next = cloneJson(artifact);
    next.executionRequests = [...next.executionRequests, request];
    next.executionReceipts = [...next.executionReceipts, receipt];
    next.identity = { ...next.identity, updatedAt: this.clock.now() };
    return deepFreeze(next) as CanonicalExecutionArtifact;
  }

  closeOutcome(artifact: CanonicalExecutionArtifact, outcome: OutcomeClosure): CanonicalExecutionArtifact {
    const next = cloneJson(artifact);
    next.outcome = outcome;
    next.identity = { ...next.identity, updatedAt: this.clock.now() };
    return deepFreeze(next) as CanonicalExecutionArtifact;
  }

  appendReview(artifact: CanonicalExecutionArtifact, review: ArtifactReview): CanonicalExecutionArtifact {
    const next = cloneJson(artifact);
    next.reviews = [...next.reviews, review];
    next.identity = { ...next.identity, updatedAt: this.clock.now() };
    return deepFreeze(next) as CanonicalExecutionArtifact;
  }

  appendChallenge(artifact: CanonicalExecutionArtifact, challenge: ArtifactChallenge): CanonicalExecutionArtifact {
    const next = cloneJson(artifact);
    next.challenges = [...next.challenges, challenge];
    next.identity = { ...next.identity, publicationState: "CHALLENGED", updatedAt: this.clock.now() };
    return deepFreeze(next) as CanonicalExecutionArtifact;
  }

  appendAmendment(artifact: CanonicalExecutionArtifact, amendment: ArtifactAmendment): CanonicalExecutionArtifact {
    const next = cloneJson(artifact);
    next.amendments = [...next.amendments, amendment];
    next.identity = { ...next.identity, publicationState: amendment.type === "WITHDRAWAL" ? "WITHDRAWN" : amendment.type === "SUPERSESSION" ? "SUPERSEDED" : "CORRECTED", updatedAt: this.clock.now() };
    return deepFreeze(next) as CanonicalExecutionArtifact;
  }

  async generateIntegrityManifest(artifact: CanonicalExecutionArtifact, componentPayloads: Readonly<Record<string, string>> = {}): Promise<IntegrityManifest> {
    if (!this.hash) throw new Error("An ArtifactHashProvider is required to generate integrity manifests.");
    const recordWithoutIntegrity = { ...cloneJson(artifact), integrity: undefined };
    const recordHash = await this.hash.sha256(canonicalStringify(recordWithoutIntegrity));
    const componentHashes: Record<string, string> = { "canonical-record.json": recordHash };
    for (const [name, payload] of Object.entries(componentPayloads)) componentHashes[name] = await this.hash.sha256(payload);
    const packageRootHash = await this.hash.sha256(canonicalStringify(componentHashes));
    return {
      generatedAt: this.clock.now(), canonicalizationVersion: CANONICALIZATION_VERSION, hashAlgorithm: "SHA-256",
      recordHash, packageRootHash, componentHashes, verifierVersion: ARTIFACT_ENGINE_VERSION,
      verificationLevel: artifact.outcome?.independentlyVerified ? 6 : artifact.executionReceipts.length ? 5 : 3,
      parityConfirmed: true,
    };
  }

  attachIntegrity(artifact: CanonicalExecutionArtifact, integrity: IntegrityManifest): CanonicalExecutionArtifact {
    const next = cloneJson(artifact); next.integrity = integrity; next.identity = { ...next.identity, updatedAt: this.clock.now() };
    return deepFreeze(next) as CanonicalExecutionArtifact;
  }
}

export function validateArtifact(artifact: CanonicalExecutionArtifact): ValidationResult {
  const issues: ValidationIssue[] = [];
  const add = (code: string, path: string, severity: "ERROR" | "WARNING", message: string) => issues.push({ code, path, severity, message });
  if (!artifact.identity.artifactId) add("ID_REQUIRED", "identity.artifactId", "ERROR", "Stable artifact ID is required.");
  if (!artifact.scenario.proposedAction) add("ACTION_REQUIRED", "scenario.proposedAction", "ERROR", "Proposed action is required.");
  if (!artifact.scenario.consequenceAtStake) add("CONSEQUENCE_REQUIRED", "scenario.consequenceAtStake", "ERROR", "Consequence at stake is required.");
  if (!artifact.route.routeId || !artifact.route.routeVersion) add("ROUTE_SNAPSHOT_REQUIRED", "route", "ERROR", "Frozen route ID and version are required.");
  if (!artifact.route.gateSequence.length) add("GATES_REQUIRED", "route.gateSequence", "ERROR", "At least one gate is required.");
  if (!artifact.gateLedger.length) add("LEDGER_REQUIRED", "gateLedger", "ERROR", "Gate ledger is required.");
  if (!artifact.commit?.determination) add("COMMIT_REQUIRED", "commit", "ERROR", "Pre-action determination commit is required.");
  if (artifact.executionReceipts.length === 0) add("RECEIPT_REQUIRED", "executionReceipts", "ERROR", "Technical execution receipt is required.");
  if (!artifact.outcome) add("OUTCOME_REQUIRED", "outcome", "ERROR", "Outcome closure is required for full-chain publication.");
  if (!artifact.integrity) add("INTEGRITY_REQUIRED", "integrity", "ERROR", "Integrity manifest is required.");
  if (!artifact.proofBoundary.proves.length) add("PROOF_BOUNDARY_REQUIRED", "proofBoundary.proves", "ERROR", "Artifact must state what it proves.");
  if (!artifact.proofBoundary.doesNotProve.length) add("NON_PROOF_BOUNDARY_REQUIRED", "proofBoundary.doesNotProve", "ERROR", "Artifact must state what it does not prove.");
  const mandatoryGateIds = artifact.route.gateSequence.filter((g) => g.requirementLevel === "MANDATORY").map((g) => g.gateId);
  for (const gateId of mandatoryGateIds) if (!artifact.gateLedger.some((entry) => entry.gateId === gateId)) add("MANDATORY_GATE_MISSING", `gateLedger.${gateId}`, "ERROR", `Mandatory gate ${gateId} is absent from the ledger.`);
  const expected = expectedExecutionEffect(artifact.commit.determination);
  for (const receipt of artifact.executionReceipts) if (receipt.effect !== expected && !(artifact.commit.determination === "HOLD" && receipt.effect === "ROLLED_BACK")) add("EFFECT_MISMATCH", `executionReceipts.${receipt.receiptId}`, "ERROR", `Receipt effect ${receipt.effect} does not match determination ${artifact.commit.determination}.`);
  if (artifact.scenario.simulated && !artifact.scenario.simulationDisclosure) add("SIMULATION_DISCLOSURE_REQUIRED", "scenario.simulationDisclosure", "ERROR", "Simulated artifacts must disclose their simulated status.");
  return { valid: !issues.some((item) => item.severity === "ERROR"), issues };
}

export function assessPublicationReadiness(artifact: CanonicalExecutionArtifact): PublicationReadiness {
  const validation = validateArtifact(artifact);
  const blockers = validation.issues.filter((item) => item.severity === "ERROR");
  const warnings = validation.issues.filter((item) => item.severity === "WARNING");
  const level: VerificationLevel = artifact.reviews.some((review) => review.reviewType === "INDEPENDENT" && review.result === "PASS")
    ? 7 : artifact.outcome?.independentlyVerified ? 6 : artifact.executionReceipts.length ? 5 : artifact.integrity?.parityConfirmed ? 3 : artifact.integrity ? 1 : 0;
  return { ready: blockers.length === 0, blockers, warnings, achievedVerificationLevel: level };
}

export function createPublicInspectionSummary(artifact: CanonicalExecutionArtifact): JsonObject {
  const earliest = artifact.gateLedger.find((entry) => entry.earliestFailure);
  return {
    artifactId: artifact.identity.artifactId,
    title: artifact.identity.title,
    status: artifact.identity.publicationState,
    proposedAction: artifact.scenario.proposedAction,
    consequenceAtStake: artifact.scenario.consequenceAtStake,
    route: `${artifact.route.routeId}@${artifact.route.routeVersion}`,
    determination: artifact.commit.determination,
    earliestFailure: earliest ? `${earliest.gateId}: ${earliest.title}` : null,
    executionEffect: artifact.executionReceipts.at(-1)?.effect ?? "NO_ACTION",
    consequenceState: artifact.outcome?.consequenceState ?? "UNKNOWN",
    verificationLevel: artifact.integrity?.verificationLevel ?? 0,
    proves: [...artifact.proofBoundary.proves],
    doesNotProve: [...artifact.proofBoundary.doesNotProve],
  };
}

export function exportCanonicalJson(artifact: CanonicalExecutionArtifact, pretty = true): string {
  return pretty ? JSON.stringify(stableNormalize(artifact), null, 2) : canonicalStringify(artifact);
}

export function createArtifactId(sequence: number, prefix = "TA14-EA"): ArtifactId {
  if (!Number.isInteger(sequence) || sequence <= 0) throw new Error("Artifact sequence must be a positive integer.");
  return `${prefix}-${String(sequence).padStart(6, "0")}`;
}

export function createDefaultGateSequence(): GateDefinition[] {
  return CHAIN_LINKS.map((chainLink, index) => ({
    gateId: `gate-${String(index + 1).padStart(2, "0")}-${chainLink.toLowerCase()}`,
    sequence: index + 1,
    chainLink,
    title: `${chainLink[0]}${chainLink.slice(1).toLowerCase()} integrity`,
    requirement: `${chainLink} must satisfy its canonical artifact requirements.`,
    requirementLevel: "MANDATORY",
    failureDetermination: reason(defaultReasonForLink(chainLink)).defaultDetermination as Exclude<ArtifactDetermination, "ALLOW">,
    evidenceRequirementIds: [],
    authorityRequired: chainLink === "ADMISSIBILITY" || chainLink === "BINDING" || chainLink === "COMMIT",
    evaluation: { kind: "CUSTOM", evaluatorId: `ta14.${chainLink.toLowerCase()}.default` },
  }));
}

export const PUBLICATION_STOP_CONDITIONS = [
  "No technical execution receipt.",
  "No route version snapshot.",
  "No identified authority state.",
  "No evidence integrity or provenance record.",
  "No outcome closure for an artifact claiming full-chain proof.",
  "Exports disagree with the canonical record.",
  "A demonstration is presented as a production event.",
  "The public claim exceeds the bounded record.",
] as const;

export const REQUIRED_PUBLIC_PACKAGE_COMPONENTS = [
  "public-inspection.json",
  "bounded-record.pdf",
  "canonical-record.json",
  "route-snapshot.json",
  "evidence-manifest.json",
  "authority-record.json",
  "continuity-record.json",
  "gate-ledger.json",
  "commit-record.json",
  "execution-receipts.json",
  "outcome-record.json",
  "integrity-manifest.json",
  "verification-instructions.txt",
  "proof-boundary.json",
] as const;

export type RequiredPublicPackageComponent = (typeof REQUIRED_PUBLIC_PACKAGE_COMPONENTS)[number];

export function buildPackagePayloads(artifact: CanonicalExecutionArtifact): Record<RequiredPublicPackageComponent, string> {
  return {
    "public-inspection.json": JSON.stringify(createPublicInspectionSummary(artifact), null, 2),
    "bounded-record.pdf": "PDF_GENERATION_REQUIRED",
    "canonical-record.json": exportCanonicalJson(artifact),
    "route-snapshot.json": JSON.stringify(stableNormalize(artifact.route), null, 2),
    "evidence-manifest.json": JSON.stringify(stableNormalize(artifact.evidence), null, 2),
    "authority-record.json": JSON.stringify(stableNormalize(artifact.authorities), null, 2),
    "continuity-record.json": JSON.stringify(stableNormalize(artifact.continuity), null, 2),
    "gate-ledger.json": JSON.stringify(stableNormalize(artifact.gateLedger), null, 2),
    "commit-record.json": JSON.stringify(stableNormalize(artifact.commit), null, 2),
    "execution-receipts.json": JSON.stringify(stableNormalize(artifact.executionReceipts), null, 2),
    "outcome-record.json": JSON.stringify(stableNormalize(artifact.outcome ?? null), null, 2),
    "integrity-manifest.json": JSON.stringify(stableNormalize(artifact.integrity ?? null), null, 2),
    "verification-instructions.txt": [
      `Artifact: ${artifact.identity.artifactId}`,
      `Schema: ${artifact.identity.schemaVersion}`,
      `Canonicalization: ${artifact.integrity?.canonicalizationVersion ?? CANONICALIZATION_VERSION}`,
      "1. Hash each package component with SHA-256.",
      "2. Compare component hashes with integrity-manifest.json.",
      "3. Canonicalize canonical-record.json using the declared canonicalization version.",
      "4. Confirm the resulting record hash and package-root hash.",
      "5. Confirm PDF, JSON, public page, route snapshot, receipts, and outcome resolve to the same artifact ID.",
    ].join("\n"),
    "proof-boundary.json": JSON.stringify(stableNormalize(artifact.proofBoundary), null, 2),
  };
}

export function compareArtifactParity(a: CanonicalExecutionArtifact, b: CanonicalExecutionArtifact): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const compare = (path: string) => {
    const left = getByPath(a, path); const right = getByPath(b, path);
    if (canonicalStringify(left) !== canonicalStringify(right)) issues.push({ code: "PARITY_MISMATCH", path, severity: "ERROR", message: `${path} differs between artifact representations.` });
  };
  ["identity.artifactId", "identity.schemaVersion", "scenario", "route.routeId", "route.routeVersion", "gateLedger", "commit", "executionReceipts", "outcome", "proofBoundary"].forEach(compare);
  return issues;
}

export function isPublishedArtifact(value: CanonicalExecutionArtifact): boolean {
  return value.identity.publicationState === "PUBLISHED" || value.identity.publicationState === "CHALLENGED" || value.identity.publicationState === "CORRECTED" || value.identity.publicationState === "SUPERSEDED";
}

export function hasFullChainProof(value: CanonicalExecutionArtifact): boolean {
  return CHAIN_LINKS.every((link) => value.gateLedger.some((gate) => gate.chainLink === link)) && value.executionReceipts.length > 0 && Boolean(value.outcome) && Boolean(value.integrity);
}

export function summarizeReasonCodes(codes: readonly string[]): readonly ReasonCodeDefinition[] {
  return unique(codes).map(reason);
}

export interface GovernanceArtifactProfile {
  profileId: string;
  title: string;
  purpose: string;
  primaryChainLinks: readonly ChainLink[];
  defaultProofQuestions: readonly string[];
  defaultGateIds: readonly string[];
}

export const GOVERNANCE_ARTIFACT_PROFILES = [
  {
    profileId: "general-execution",
    title: "General Execution",
    purpose: "Produce bounded execution artifacts for general execution while preserving the complete TA-14 chain.",
    primaryChainLinks: ["REALITY", "RECORD", "ADMISSIBILITY"],
    defaultProofQuestions: [
      "What consequence was proposed?",
      "Which evidence and authority were admitted?",
      "Did the committed determination control execution?",
      "What consequence did or did not bind to reality?",
    ],
    defaultGateIds: ["profile-01-reality", "profile-01-authority", "profile-01-control"],
  },
  {
    profileId: "runtime-execution",
    title: "Runtime Execution",
    purpose: "Produce bounded execution artifacts for runtime execution while preserving the complete TA-14 chain.",
    primaryChainLinks: ["RECORD", "CONTINUITY", "BINDING"],
    defaultProofQuestions: [
      "What consequence was proposed?",
      "Which evidence and authority were admitted?",
      "Did the committed determination control execution?",
      "What consequence did or did not bind to reality?",
    ],
    defaultGateIds: ["profile-02-reality", "profile-02-authority", "profile-02-control"],
  },
  {
    profileId: "model-evaluation",
    title: "Model Evaluation",
    purpose: "Produce bounded execution artifacts for model evaluation while preserving the complete TA-14 chain.",
    primaryChainLinks: ["CONTINUITY", "ADMISSIBILITY", "COMMIT"],
    defaultProofQuestions: [
      "What consequence was proposed?",
      "Which evidence and authority were admitted?",
      "Did the committed determination control execution?",
      "What consequence did or did not bind to reality?",
    ],
    defaultGateIds: ["profile-03-reality", "profile-03-authority", "profile-03-control"],
  },
  {
    profileId: "data-provenance",
    title: "Data Provenance",
    purpose: "Produce bounded execution artifacts for data provenance while preserving the complete TA-14 chain.",
    primaryChainLinks: ["ADMISSIBILITY", "BINDING", "EXECUTION"],
    defaultProofQuestions: [
      "What consequence was proposed?",
      "Which evidence and authority were admitted?",
      "Did the committed determination control execution?",
      "What consequence did or did not bind to reality?",
    ],
    defaultGateIds: ["profile-04-reality", "profile-04-authority", "profile-04-control"],
  },
  {
    profileId: "agent-tools",
    title: "Agent Tools",
    purpose: "Produce bounded execution artifacts for agent tools while preserving the complete TA-14 chain.",
    primaryChainLinks: ["BINDING", "COMMIT", "OUTCOME"],
    defaultProofQuestions: [
      "What consequence was proposed?",
      "Which evidence and authority were admitted?",
      "Did the committed determination control execution?",
      "What consequence did or did not bind to reality?",
    ],
    defaultGateIds: ["profile-05-reality", "profile-05-authority", "profile-05-control"],
  },
  {
    profileId: "decision",
    title: "Decision",
    purpose: "Produce bounded execution artifacts for decision while preserving the complete TA-14 chain.",
    primaryChainLinks: ["COMMIT", "EXECUTION", "REALITY"],
    defaultProofQuestions: [
      "What consequence was proposed?",
      "Which evidence and authority were admitted?",
      "Did the committed determination control execution?",
      "What consequence did or did not bind to reality?",
    ],
    defaultGateIds: ["profile-06-reality", "profile-06-authority", "profile-06-control"],
  },
  {
    profileId: "human-oversight",
    title: "Human Oversight",
    purpose: "Produce bounded execution artifacts for human oversight while preserving the complete TA-14 chain.",
    primaryChainLinks: ["EXECUTION", "OUTCOME", "RECORD"],
    defaultProofQuestions: [
      "What consequence was proposed?",
      "Which evidence and authority were admitted?",
      "Did the committed determination control execution?",
      "What consequence did or did not bind to reality?",
    ],
    defaultGateIds: ["profile-07-reality", "profile-07-authority", "profile-07-control"],
  },
  {
    profileId: "policy-controls",
    title: "Policy Controls",
    purpose: "Produce bounded execution artifacts for policy controls while preserving the complete TA-14 chain.",
    primaryChainLinks: ["OUTCOME", "REALITY", "CONTINUITY"],
    defaultProofQuestions: [
      "What consequence was proposed?",
      "Which evidence and authority were admitted?",
      "Did the committed determination control execution?",
      "What consequence did or did not bind to reality?",
    ],
    defaultGateIds: ["profile-08-reality", "profile-08-authority", "profile-08-control"],
  },
  {
    profileId: "risk",
    title: "Risk",
    purpose: "Produce bounded execution artifacts for risk while preserving the complete TA-14 chain.",
    primaryChainLinks: ["REALITY", "RECORD", "ADMISSIBILITY"],
    defaultProofQuestions: [
      "What consequence was proposed?",
      "Which evidence and authority were admitted?",
      "Did the committed determination control execution?",
      "What consequence did or did not bind to reality?",
    ],
    defaultGateIds: ["profile-09-reality", "profile-09-authority", "profile-09-control"],
  },
  {
    profileId: "compliance-regulatory",
    title: "Compliance Regulatory",
    purpose: "Produce bounded execution artifacts for compliance regulatory while preserving the complete TA-14 chain.",
    primaryChainLinks: ["RECORD", "CONTINUITY", "BINDING"],
    defaultProofQuestions: [
      "What consequence was proposed?",
      "Which evidence and authority were admitted?",
      "Did the committed determination control execution?",
      "What consequence did or did not bind to reality?",
    ],
    defaultGateIds: ["profile-10-reality", "profile-10-authority", "profile-10-control"],
  },
  {
    profileId: "security-third-party",
    title: "Security Third Party",
    purpose: "Produce bounded execution artifacts for security third party while preserving the complete TA-14 chain.",
    primaryChainLinks: ["CONTINUITY", "ADMISSIBILITY", "COMMIT"],
    defaultProofQuestions: [
      "What consequence was proposed?",
      "Which evidence and authority were admitted?",
      "Did the committed determination control execution?",
      "What consequence did or did not bind to reality?",
    ],
    defaultGateIds: ["profile-11-reality", "profile-11-authority", "profile-11-control"],
  },
  {
    profileId: "outcome-assurance",
    title: "Outcome Assurance",
    purpose: "Produce bounded execution artifacts for outcome assurance while preserving the complete TA-14 chain.",
    primaryChainLinks: ["ADMISSIBILITY", "BINDING", "EXECUTION"],
    defaultProofQuestions: [
      "What consequence was proposed?",
      "Which evidence and authority were admitted?",
      "Did the committed determination control execution?",
      "What consequence did or did not bind to reality?",
    ],
    defaultGateIds: ["profile-12-reality", "profile-12-authority", "profile-12-control"],
  },
] as const satisfies readonly GovernanceArtifactProfile[];


export const CANONICAL_ENGINE_ACCEPTANCE_TESTS = [
  { id: "AT-01", requirement: "A completed route generates one immutable artifact root and all required linked records." },
  { id: "AT-02", requirement: "Changing a frozen route or evidence item creates a new version or amendment and never silently alters the committed event." },
  { id: "AT-03", requirement: "All four determinations produce the correct execution effect." },
  { id: "AT-04", requirement: "A missing mandatory gate cannot be skipped to reach ALLOW." },
  { id: "AT-05", requirement: "A changed condition triggers the configured revalidation behavior." },
  { id: "AT-06", requirement: "An execution adapter proves block, hold, release, escalation, rollback, or termination with a receipt." },
  { id: "AT-07", requirement: "PDF, JSON, public page, and manifest resolve to the same record hash." },
  { id: "AT-08", requirement: "Offline verification detects any altered component." },
  { id: "AT-09", requirement: "Confidential evidence can remain private while public hash commitments and bounded review remain verifiable." },
  { id: "AT-10", requirement: "A challenge can be appended without deleting or rewriting the original artifact." },
  { id: "AT-11", requirement: "The founding artifacts cover all required canonical behaviors." },
  { id: "AT-12", requirement: "The artifact library filters correctly and preserves stable IDs." },
  { id: "AT-13", requirement: "A visitor can inspect and verify a public artifact without authentication." },
  { id: "AT-14", requirement: "Every artifact states what it proves and what it does not prove." },
  { id: "AT-15", requirement: "No demonstration artifact is mislabeled as production execution." },
] as const;

export function engineSelfCheck(): ValidationResult {
  const issues: ValidationIssue[] = [];
  if (CHAIN_LINKS.length !== 8) issues.push({ code: "CHAIN_LENGTH", path: "CHAIN_LINKS", severity: "ERROR", message: "Canonical chain must contain eight anchor links." });
  if (new Set(REASON_CODES.map((item) => item.code)).size !== REASON_CODES.length) issues.push({ code: "DUPLICATE_REASON_CODE", path: "REASON_CODES", severity: "ERROR", message: "Reason codes must be unique." });
  if (new Set(GOVERNANCE_ARTIFACT_PROFILES.map((item) => item.profileId)).size !== GOVERNANCE_ARTIFACT_PROFILES.length) issues.push({ code: "DUPLICATE_PROFILE", path: "GOVERNANCE_ARTIFACT_PROFILES", severity: "ERROR", message: "Governance profile IDs must be unique." });
  for (const determination of DETERMINATIONS) {
    const effect = expectedExecutionEffect(determination);
    if (!EXECUTION_EFFECTS.includes(effect)) issues.push({ code: "EFFECT_MAPPING", path: `DETERMINATIONS.${determination}`, severity: "ERROR", message: "Determination lacks a valid execution effect mapping." });
  }
  return { valid: issues.length === 0, issues };
}
