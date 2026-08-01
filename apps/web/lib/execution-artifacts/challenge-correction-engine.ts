/**
 * TA-14 Authority | Execution Artifact Integrity & Hash Engine
 * Version 1.0.0
 *
 * Institutional purpose:
 *   Provide deterministic canonicalization, component hashing, package-root
 *   calculation, append-only lineage verification, and offline integrity
 *   proof for every execution artifact and its related registry components.
 *
 * Governing rules:
 *   Integrity does not prove truth; it proves that the committed bytes and
 *   canonical values have not changed without detection.
 *
 *   No registered governance. No registered artifact.
 *   No admissible evidence. No admissible execution.
 */

import type { CanonicalExecutionArtifact } from "./canonical-record-validator";
import type {
  ArtifactRegistryRecord,
  RegistryPublicationManifest,
  RegistryPublicationComponent,
} from "./artifact-registry-engine";

export const TA14_INTEGRITY_HASH_ENGINE_VERSION = "1.0.0" as const;
export const TA14_INTEGRITY_POLICY_VERSION = "1.0" as const;
export const TA14_CANONICALIZATION_VERSION = "TA14-C14N-1" as const;
export const TA14_HASH_ALGORITHM = "SHA-256" as const;
export const TA14_INTEGRITY_RULE = "ANY CHANGE MUST BE DETECTABLE" as const;

export type HashAlgorithm = "SHA-256";
export type IntegritySeverity = "INFO" | "WARNING" | "ERROR";
export type IntegrityDisposition = "VERIFIED" | "VERIFIED_WITH_WARNINGS" | "FAILED";
export type IntegrityDomain =
  | "CANONICAL"
  | "CANONICALIZATION"
  | "ALGORITHM"
  | "COMPONENT"
  | "PACKAGE"
  | "MANIFEST"
  | "PDF"
  | "JSON"
  | "RECEIPT"
  | "ROUTE"
  | "OUTCOME"
  | "REGISTRY"
  | "VERIFICATION"
  | "CHALLENGE"
  | "AMENDMENT"
  | "SUPERSESSION"
  | "AUDIT"
  | "LINEAGE"
  | "PARITY"
  | "OFFLINE"
  | "SIGNATURE"
  | "TIME"
  | "ENGINE"
  | "POLICY"
  | "DISCLOSURE"
  | "CLAIMS"
  | "PUBLICATION"
  | "RESULT";

export type IntegrityComponentKind =
  | "CANONICAL_JSON"
  | "PUBLIC_PDF"
  | "INTEGRITY_MANIFEST"
  | "ROUTE_SNAPSHOT"
  | "EXECUTION_RECEIPT"
  | "OUTCOME_CLOSURE"
  | "REGISTRY_RECORD"
  | "REGISTRY_CERTIFICATE"
  | "VERIFICATION_REPORT"
  | "DISCLOSURE_PROJECTION"
  | "CLAIMS_BOUNDARY"
  | "CHALLENGE_RECORD"
  | "CORRECTION_RECORD"
  | "SIGNATURE_ENVELOPE"
  | "OTHER";

export interface CanonicalizationOptions {
  version?: typeof TA14_CANONICALIZATION_VERSION;
  normalizeDates?: boolean;
  normalizeUnicode?: boolean;
  sortArrays?: boolean;
  rejectUndefined?: boolean;
  rejectFunctions?: boolean;
  rejectSymbols?: boolean;
  rejectNonFiniteNumbers?: boolean;
  bigintMode?: "DECIMAL_STRING" | "REJECT";
}

export interface IntegrityComponentInput {
  componentId: string;
  kind: IntegrityComponentKind;
  label: string;
  mediaType: string;
  required: boolean;
  disclosure: "PUBLIC" | "SELECTIVE" | "RESTRICTED" | "WITHHELD";
  bytes?: Uint8Array;
  text?: string;
  value?: unknown;
  declaredHash?: string;
  declaredByteLength?: number;
  stableUrl?: string;
  createdAt?: string;
  createdBy?: string;
}

export interface IntegrityComponentDigest {
  componentId: string;
  kind: IntegrityComponentKind;
  label: string;
  mediaType: string;
  required: boolean;
  disclosure: "PUBLIC" | "SELECTIVE" | "RESTRICTED" | "WITHHELD";
  hashAlgorithm: HashAlgorithm;
  hash: string;
  byteLength: number;
  stableUrl?: string;
  createdAt?: string;
  createdBy?: string;
}

export interface IntegrityLineageLink {
  linkId: string;
  sequence: number;
  kind: "ORIGINAL" | "AMENDMENT" | "CORRECTION" | "SUPERSESSION" | "WITHDRAWAL" | "CHALLENGE" | "VERIFICATION" | "REGISTRY_UPDATE";
  occurredAt: string;
  actorId: string;
  subjectId: string;
  parentHash: string;
  contentHash: string;
  linkHash: string;
  note: string;
}

export interface IntegrityAuditEvent {
  eventId: string;
  sequence: number;
  occurredAt: string;
  actorId: string;
  eventType: "PACKAGE_CREATED" | "COMPONENT_HASHED" | "MANIFEST_CREATED" | "PACKAGE_VERIFIED" | "PACKAGE_FAILED" | "LINEAGE_APPENDED" | "OFFLINE_BUNDLE_CREATED" | "DIGEST_RECALCULATED";
  subjectId: string;
  description: string;
  previousHash: string;
  eventHash: string;
}

export interface IntegrityManifest {
  manifestId: string;
  manifestVersion: string;
  integrityEngineVersion: string;
  integrityPolicyVersion: string;
  canonicalizationVersion: string;
  hashAlgorithm: HashAlgorithm;
  generatedAt: string;
  generatedBy: string;
  artifactId: string;
  registryId?: string;
  governanceRegistrationId?: string;
  canonicalHash: string;
  pdfHash?: string;
  manifestHash: string;
  packageRootHash: string;
  componentCount: number;
  components: readonly IntegrityComponentDigest[];
  lineage: readonly IntegrityLineageLink[];
  auditEvents: readonly IntegrityAuditEvent[];
  publicationUrl?: string;
  verificationUrl?: string;
  challengeUrl?: string;
  claimsBoundaryHash?: string;
  disclosureProjectionHash?: string;
  signatureEnvelopeHash?: string;
}

export interface IntegrityIssue {
  code: IntegrityReasonCode;
  domain: IntegrityDomain;
  severity: IntegritySeverity;
  title: string;
  message: string;
  path?: string;
  expected?: unknown;
  actual?: unknown;
  componentId?: string;
}

export interface IntegrityReasonDefinition {
  code: IntegrityReasonCode;
  domain: IntegrityDomain;
  severity: IntegritySeverity;
  title: string;
  description: string;
}

export interface IntegrityControlDefinition {
  controlId: string;
  domain: IntegrityDomain;
  title: string;
  requirement: string;
}

export interface IntegrityAcceptanceTest {
  testId: string;
  title: string;
  passCondition: string;
}

export interface IntegrityVerificationResult {
  disposition: IntegrityDisposition;
  verified: boolean;
  verifiedAt: string;
  verifierId: string;
  engineVersion: string;
  policyVersion: string;
  canonicalizationVersion: string;
  hashAlgorithm: HashAlgorithm;
  canonicalHash: string;
  calculatedManifestHash: string;
  calculatedPackageRootHash: string;
  componentResults: readonly ComponentVerificationResult[];
  lineageVerified: boolean;
  auditChainVerified: boolean;
  issues: readonly IntegrityIssue[];
  warnings: readonly IntegrityIssue[];
  errors: readonly IntegrityIssue[];
  reportHash: string;
}

export interface ComponentVerificationResult {
  componentId: string;
  kind: IntegrityComponentKind;
  required: boolean;
  declaredHash?: string;
  calculatedHash: string;
  byteLength: number;
  hashMatches: boolean;
  lengthMatches: boolean;
  verified: boolean;
}

export interface IntegrityPackageRequest {
  artifact: CanonicalExecutionArtifact;
  registryRecord?: ArtifactRegistryRecord;
  registryManifest?: RegistryPublicationManifest;
  components: readonly IntegrityComponentInput[];
  generatedAt: string;
  generatedBy: string;
  verifierId?: string;
  publicationUrl?: string;
  verificationUrl?: string;
  challengeUrl?: string;
  lineage?: readonly IntegrityLineageLink[];
  auditEvents?: readonly IntegrityAuditEvent[];
  options?: CanonicalizationOptions;
}

export interface IntegrityPackageResult {
  manifest: IntegrityManifest;
  componentDigests: readonly IntegrityComponentDigest[];
  manifestJson: string;
  packageJson: string;
  offlineVerificationText: string;
  validation: IntegrityVerificationResult;
}

export interface OfflineVerificationBundle {
  bundleId: string;
  createdAt: string;
  artifactId: string;
  registryId?: string;
  manifest: IntegrityManifest;
  manifestJson: string;
  instructions: string;
  componentIndex: readonly Pick<IntegrityComponentDigest, "componentId" | "kind" | "mediaType" | "hash" | "byteLength">[];
  bundleHash: string;
}

export type IntegrityReasonCode =
  | "CANONICAL_INPUT_MISSING"
  | "CANONICAL_SERIALIZATION_FAILED"
  | "CANONICAL_HASH_MISSING"
  | "CANONICAL_HASH_MISMATCH"
  | "COMPONENT_ID_MISSING"
  | "COMPONENT_DUPLICATE_ID"
  | "COMPONENT_BYTES_MISSING"
  | "COMPONENT_HASH_MISSING"
  | "COMPONENT_HASH_MISMATCH"
  | "COMPONENT_MEDIA_TYPE_MISSING"
  | "PACKAGE_ROOT_MISSING"
  | "PACKAGE_ROOT_MISMATCH"
  | "PACKAGE_COMPONENT_COUNT_MISMATCH"
  | "PACKAGE_ORDER_NONDETERMINISTIC"
  | "MANIFEST_MISSING"
  | "MANIFEST_HASH_MISSING"
  | "MANIFEST_HASH_MISMATCH"
  | "MANIFEST_VERSION_UNSUPPORTED"
  | "PDF_HASH_MISSING"
  | "PDF_HASH_MISMATCH"
  | "JSON_HASH_MISSING"
  | "JSON_HASH_MISMATCH"
  | "RECEIPT_HASH_MISSING"
  | "RECEIPT_HASH_MISMATCH"
  | "ROUTE_HASH_MISSING"
  | "ROUTE_HASH_MISMATCH"
  | "OUTCOME_HASH_MISSING"
  | "OUTCOME_HASH_MISMATCH"
  | "REGISTRY_HASH_MISSING"
  | "REGISTRY_HASH_MISMATCH"
  | "VERIFICATION_HASH_MISSING"
  | "VERIFICATION_HASH_MISMATCH"
  | "CHALLENGE_HASH_MISSING"
  | "CHALLENGE_HASH_MISMATCH"
  | "AMENDMENT_PARENT_MISSING"
  | "AMENDMENT_PARENT_MISMATCH"
  | "AMENDMENT_HASH_MISSING"
  | "AMENDMENT_HASH_MISMATCH"
  | "SUPERSESSION_PARENT_MISSING"
  | "SUPERSESSION_CHAIN_BROKEN"
  | "AUDIT_EVENT_HASH_MISSING"
  | "AUDIT_EVENT_PREVIOUS_HASH_MISMATCH"
  | "AUDIT_EVENT_HASH_MISMATCH"
  | "AUDIT_SEQUENCE_INVALID"
  | "CANONICALIZATION_VERSION_MISSING"
  | "CANONICALIZATION_VERSION_UNSUPPORTED"
  | "HASH_ALGORITHM_MISSING"
  | "HASH_ALGORITHM_UNSUPPORTED"
  | "HASH_FORMAT_INVALID"
  | "BYTE_LENGTH_MISMATCH"
  | "TEXT_ENCODING_UNSUPPORTED"
  | "DATE_NORMALIZATION_FAILED"
  | "NONFINITE_NUMBER_REJECTED"
  | "UNDEFINED_VALUE_REJECTED"
  | "SYMBOL_VALUE_REJECTED"
  | "FUNCTION_VALUE_REJECTED"
  | "BIGINT_NORMALIZED"
  | "CIRCULAR_REFERENCE_REJECTED"
  | "MAP_KEY_UNSUPPORTED"
  | "SET_ORDER_NORMALIZED"
  | "OFFLINE_BUNDLE_INCOMPLETE"
  | "OFFLINE_INSTRUCTIONS_MISSING"
  | "SIGNATURE_REFERENCE_MISSING"
  | "SIGNATURE_DIGEST_MISMATCH"
  | "TIMESTAMP_MISSING"
  | "TIMESTAMP_ORDER_INVALID"
  | "ENGINE_VERSION_MISSING"
  | "ENGINE_VERSION_UNSUPPORTED"
  | "POLICY_VERSION_MISSING"
  | "DISCLOSURE_PROJECTION_HASH_MISSING"
  | "DISCLOSURE_PROJECTION_HASH_MISMATCH"
  | "CLAIMS_BOUNDARY_HASH_MISSING"
  | "CLAIMS_BOUNDARY_HASH_MISMATCH"
  | "PUBLICATION_URL_MISSING"
  | "PUBLICATION_STATE_NOT_RELIABLE"
  | "PACKAGE_VERIFIED"
  | "PACKAGE_VERIFICATION_FAILED"
  | "COMPONENT_01_CHECK_FAILED"
  | "COMPONENT_02_CHECK_FAILED"
  | "COMPONENT_03_CHECK_FAILED"
  | "COMPONENT_04_CHECK_FAILED"
  | "COMPONENT_05_CHECK_FAILED"
  | "COMPONENT_06_CHECK_FAILED"
  | "COMPONENT_07_CHECK_FAILED"
  | "COMPONENT_08_CHECK_FAILED"
  | "COMPONENT_09_CHECK_FAILED"
  | "COMPONENT_10_CHECK_FAILED"
  | "COMPONENT_11_CHECK_FAILED"
  | "COMPONENT_12_CHECK_FAILED"
  | "LINEAGE_01_CHECK_FAILED"
  | "LINEAGE_02_CHECK_FAILED"
  | "LINEAGE_03_CHECK_FAILED"
  | "LINEAGE_04_CHECK_FAILED"
  | "LINEAGE_05_CHECK_FAILED"
  | "LINEAGE_06_CHECK_FAILED"
  | "LINEAGE_07_CHECK_FAILED"
  | "LINEAGE_08_CHECK_FAILED"
  | "PARITY_01_CHECK_FAILED"
  | "PARITY_02_CHECK_FAILED"
  | "PARITY_03_CHECK_FAILED"
  | "PARITY_04_CHECK_FAILED"
  | "PARITY_05_CHECK_FAILED"
  | "PARITY_06_CHECK_FAILED";

export const INTEGRITY_REASON_DEFINITIONS: readonly IntegrityReasonDefinition[] = [
  { code: "CANONICAL_INPUT_MISSING", domain: "CANONICAL", severity: "ERROR", title: "Canonical input missing", description: "A canonical artifact is required before integrity processing can begin." },
  { code: "CANONICAL_SERIALIZATION_FAILED", domain: "CANONICAL", severity: "ERROR", title: "Canonical serialization failed", description: "The record could not be deterministically serialized." },
  { code: "CANONICAL_HASH_MISSING", domain: "CANONICAL", severity: "ERROR", title: "Canonical hash missing", description: "The integrity package does not include a canonical record hash." },
  { code: "CANONICAL_HASH_MISMATCH", domain: "CANONICAL", severity: "ERROR", title: "Canonical hash mismatch", description: "The calculated canonical digest differs from the declared digest." },
  { code: "COMPONENT_ID_MISSING", domain: "COMPONENT", severity: "ERROR", title: "Component identity missing", description: "Every package component requires a stable component identifier." },
  { code: "COMPONENT_DUPLICATE_ID", domain: "COMPONENT", severity: "ERROR", title: "Duplicate component identity", description: "Two or more components use the same component identifier." },
  { code: "COMPONENT_BYTES_MISSING", domain: "COMPONENT", severity: "ERROR", title: "Component bytes missing", description: "A component declared for hashing has no bytes or canonical content." },
  { code: "COMPONENT_HASH_MISSING", domain: "COMPONENT", severity: "ERROR", title: "Component hash missing", description: "A component lacks a declared digest." },
  { code: "COMPONENT_HASH_MISMATCH", domain: "COMPONENT", severity: "ERROR", title: "Component hash mismatch", description: "A component digest does not match its current content." },
  { code: "COMPONENT_MEDIA_TYPE_MISSING", domain: "COMPONENT", severity: "WARNING", title: "Component media type missing", description: "A component should identify its media type for reliable packaging." },
  { code: "PACKAGE_ROOT_MISSING", domain: "PACKAGE", severity: "ERROR", title: "Package root missing", description: "The package does not include a root digest." },
  { code: "PACKAGE_ROOT_MISMATCH", domain: "PACKAGE", severity: "ERROR", title: "Package root mismatch", description: "The calculated package root differs from the declared package root." },
  { code: "PACKAGE_COMPONENT_COUNT_MISMATCH", domain: "PACKAGE", severity: "ERROR", title: "Package component count mismatch", description: "The manifest count differs from the number of supplied components." },
  { code: "PACKAGE_ORDER_NONDETERMINISTIC", domain: "PACKAGE", severity: "ERROR", title: "Package ordering nondeterministic", description: "Components were not ordered by stable identity before root calculation." },
  { code: "MANIFEST_MISSING", domain: "MANIFEST", severity: "ERROR", title: "Integrity manifest missing", description: "A publication package requires an integrity manifest." },
  { code: "MANIFEST_HASH_MISSING", domain: "MANIFEST", severity: "ERROR", title: "Manifest hash missing", description: "The manifest does not carry its own digest." },
  { code: "MANIFEST_HASH_MISMATCH", domain: "MANIFEST", severity: "ERROR", title: "Manifest hash mismatch", description: "The calculated manifest digest differs from the declared value." },
  { code: "MANIFEST_VERSION_UNSUPPORTED", domain: "MANIFEST", severity: "ERROR", title: "Manifest version unsupported", description: "The manifest version is not supported by this engine." },
  { code: "PDF_HASH_MISSING", domain: "PDF", severity: "WARNING", title: "PDF hash missing", description: "A public PDF component should include a digest." },
  { code: "PDF_HASH_MISMATCH", domain: "PDF", severity: "ERROR", title: "PDF hash mismatch", description: "The supplied PDF bytes do not match the declared PDF digest." },
  { code: "JSON_HASH_MISSING", domain: "JSON", severity: "ERROR", title: "JSON hash missing", description: "The canonical JSON component requires a digest." },
  { code: "JSON_HASH_MISMATCH", domain: "JSON", severity: "ERROR", title: "JSON hash mismatch", description: "The canonical JSON bytes differ from the declared digest." },
  { code: "RECEIPT_HASH_MISSING", domain: "RECEIPT", severity: "ERROR", title: "Receipt hash missing", description: "An execution-control artifact requires a hashed technical receipt." },
  { code: "RECEIPT_HASH_MISMATCH", domain: "RECEIPT", severity: "ERROR", title: "Receipt hash mismatch", description: "The execution receipt content differs from its declared digest." },
  { code: "ROUTE_HASH_MISSING", domain: "ROUTE", severity: "ERROR", title: "Route hash missing", description: "The frozen route snapshot requires a digest." },
  { code: "ROUTE_HASH_MISMATCH", domain: "ROUTE", severity: "ERROR", title: "Route hash mismatch", description: "The route snapshot differs from its declared digest." },
  { code: "OUTCOME_HASH_MISSING", domain: "OUTCOME", severity: "ERROR", title: "Outcome hash missing", description: "The outcome closure record requires a digest." },
  { code: "OUTCOME_HASH_MISMATCH", domain: "OUTCOME", severity: "ERROR", title: "Outcome hash mismatch", description: "The outcome closure record differs from its declared digest." },
  { code: "REGISTRY_HASH_MISSING", domain: "REGISTRY", severity: "ERROR", title: "Registry hash missing", description: "The linked registry record requires a digest." },
  { code: "REGISTRY_HASH_MISMATCH", domain: "REGISTRY", severity: "ERROR", title: "Registry hash mismatch", description: "The registry record differs from its declared digest." },
  { code: "VERIFICATION_HASH_MISSING", domain: "VERIFICATION", severity: "WARNING", title: "Verification hash missing", description: "A verification report should carry a digest." },
  { code: "VERIFICATION_HASH_MISMATCH", domain: "VERIFICATION", severity: "ERROR", title: "Verification hash mismatch", description: "The verification report differs from its declared digest." },
  { code: "CHALLENGE_HASH_MISSING", domain: "CHALLENGE", severity: "WARNING", title: "Challenge hash missing", description: "A challenge package should carry a digest." },
  { code: "CHALLENGE_HASH_MISMATCH", domain: "CHALLENGE", severity: "ERROR", title: "Challenge hash mismatch", description: "The challenge package differs from its declared digest." },
  { code: "AMENDMENT_PARENT_MISSING", domain: "AMENDMENT", severity: "ERROR", title: "Amendment parent missing", description: "Every amendment must identify its parent digest." },
  { code: "AMENDMENT_PARENT_MISMATCH", domain: "AMENDMENT", severity: "ERROR", title: "Amendment parent mismatch", description: "The amendment does not link to the expected parent digest." },
  { code: "AMENDMENT_HASH_MISSING", domain: "AMENDMENT", severity: "ERROR", title: "Amendment hash missing", description: "An amendment requires its own digest." },
  { code: "AMENDMENT_HASH_MISMATCH", domain: "AMENDMENT", severity: "ERROR", title: "Amendment hash mismatch", description: "The amendment content differs from its declared digest." },
  { code: "SUPERSESSION_PARENT_MISSING", domain: "SUPERSESSION", severity: "ERROR", title: "Supersession parent missing", description: "A superseding record must identify the superseded digest." },
  { code: "SUPERSESSION_CHAIN_BROKEN", domain: "SUPERSESSION", severity: "ERROR", title: "Supersession chain broken", description: "The supersession lineage contains a missing or inconsistent link." },
  { code: "AUDIT_EVENT_HASH_MISSING", domain: "AUDIT", severity: "ERROR", title: "Audit event hash missing", description: "Every append-only audit event requires a digest." },
  { code: "AUDIT_EVENT_PREVIOUS_HASH_MISMATCH", domain: "AUDIT", severity: "ERROR", title: "Audit chain previous hash mismatch", description: "An audit event does not point to the preceding event hash." },
  { code: "AUDIT_EVENT_HASH_MISMATCH", domain: "AUDIT", severity: "ERROR", title: "Audit event hash mismatch", description: "An audit event content differs from its declared digest." },
  { code: "AUDIT_SEQUENCE_INVALID", domain: "AUDIT", severity: "ERROR", title: "Audit sequence invalid", description: "Audit sequence values must be contiguous and strictly increasing." },
  { code: "CANONICALIZATION_VERSION_MISSING", domain: "CANONICALIZATION", severity: "ERROR", title: "Canonicalization version missing", description: "The package must state which canonicalization rules were used." },
  { code: "CANONICALIZATION_VERSION_UNSUPPORTED", domain: "CANONICALIZATION", severity: "ERROR", title: "Canonicalization version unsupported", description: "The declared canonicalization version is not supported." },
  { code: "HASH_ALGORITHM_MISSING", domain: "ALGORITHM", severity: "ERROR", title: "Hash algorithm missing", description: "The package must identify its digest algorithm." },
  { code: "HASH_ALGORITHM_UNSUPPORTED", domain: "ALGORITHM", severity: "ERROR", title: "Hash algorithm unsupported", description: "The requested hash algorithm is not supported." },
  { code: "HASH_FORMAT_INVALID", domain: "ALGORITHM", severity: "ERROR", title: "Hash format invalid", description: "A digest is not encoded as the expected lowercase hexadecimal string." },
  { code: "BYTE_LENGTH_MISMATCH", domain: "COMPONENT", severity: "ERROR", title: "Byte length mismatch", description: "The declared byte length differs from the supplied bytes." },
  { code: "TEXT_ENCODING_UNSUPPORTED", domain: "CANONICALIZATION", severity: "ERROR", title: "Text encoding unsupported", description: "Canonical text must use UTF-8 encoding." },
  { code: "DATE_NORMALIZATION_FAILED", domain: "CANONICALIZATION", severity: "ERROR", title: "Date normalization failed", description: "A date value could not be normalized to ISO 8601." },
  { code: "NONFINITE_NUMBER_REJECTED", domain: "CANONICALIZATION", severity: "ERROR", title: "Nonfinite number rejected", description: "NaN and Infinity are not permitted in canonical records." },
  { code: "UNDEFINED_VALUE_REJECTED", domain: "CANONICALIZATION", severity: "ERROR", title: "Undefined value rejected", description: "Undefined values cannot appear in canonical serialization." },
  { code: "SYMBOL_VALUE_REJECTED", domain: "CANONICALIZATION", severity: "ERROR", title: "Symbol value rejected", description: "Symbols cannot appear in canonical serialization." },
  { code: "FUNCTION_VALUE_REJECTED", domain: "CANONICALIZATION", severity: "ERROR", title: "Function value rejected", description: "Functions cannot appear in canonical serialization." },
  { code: "BIGINT_NORMALIZED", domain: "CANONICALIZATION", severity: "INFO", title: "BigInt normalized", description: "A BigInt value was deterministically represented as a decimal string." },
  { code: "CIRCULAR_REFERENCE_REJECTED", domain: "CANONICALIZATION", severity: "ERROR", title: "Circular reference rejected", description: "Canonical serialization cannot process circular references." },
  { code: "MAP_KEY_UNSUPPORTED", domain: "CANONICALIZATION", severity: "ERROR", title: "Map key unsupported", description: "Map keys must be strings for deterministic serialization." },
  { code: "SET_ORDER_NORMALIZED", domain: "CANONICALIZATION", severity: "INFO", title: "Set order normalized", description: "Set members were sorted by canonical representation." },
  { code: "OFFLINE_BUNDLE_INCOMPLETE", domain: "OFFLINE", severity: "ERROR", title: "Offline bundle incomplete", description: "The offline verification bundle is missing a required component." },
  { code: "OFFLINE_INSTRUCTIONS_MISSING", domain: "OFFLINE", severity: "WARNING", title: "Offline instructions missing", description: "The package should include offline verification instructions." },
  { code: "SIGNATURE_REFERENCE_MISSING", domain: "SIGNATURE", severity: "WARNING", title: "Signature reference missing", description: "A signed package should reference its signature envelope." },
  { code: "SIGNATURE_DIGEST_MISMATCH", domain: "SIGNATURE", severity: "ERROR", title: "Signature digest mismatch", description: "The signed digest does not match the package root." },
  { code: "TIMESTAMP_MISSING", domain: "TIME", severity: "WARNING", title: "Timestamp missing", description: "Integrity events should include attributable timestamps." },
  { code: "TIMESTAMP_ORDER_INVALID", domain: "TIME", severity: "ERROR", title: "Timestamp order invalid", description: "A child integrity event predates its parent event." },
  { code: "ENGINE_VERSION_MISSING", domain: "ENGINE", severity: "ERROR", title: "Engine version missing", description: "The manifest must identify the engine version." },
  { code: "ENGINE_VERSION_UNSUPPORTED", domain: "ENGINE", severity: "WARNING", title: "Engine version newer than verifier", description: "The package was generated by a newer engine version." },
  { code: "POLICY_VERSION_MISSING", domain: "POLICY", severity: "ERROR", title: "Policy version missing", description: "The manifest must identify the governing integrity policy." },
  { code: "DISCLOSURE_PROJECTION_HASH_MISSING", domain: "DISCLOSURE", severity: "WARNING", title: "Disclosure projection hash missing", description: "A published disclosure projection should carry a digest." },
  { code: "DISCLOSURE_PROJECTION_HASH_MISMATCH", domain: "DISCLOSURE", severity: "ERROR", title: "Disclosure projection hash mismatch", description: "The projection differs from its declared digest." },
  { code: "CLAIMS_BOUNDARY_HASH_MISSING", domain: "CLAIMS", severity: "WARNING", title: "Claims boundary hash missing", description: "The claims-boundary statement should be committed by digest." },
  { code: "CLAIMS_BOUNDARY_HASH_MISMATCH", domain: "CLAIMS", severity: "ERROR", title: "Claims boundary hash mismatch", description: "The claims-boundary statement differs from its declared digest." },
  { code: "PUBLICATION_URL_MISSING", domain: "PUBLICATION", severity: "WARNING", title: "Publication URL missing", description: "A published package should identify its stable public location." },
  { code: "PUBLICATION_STATE_NOT_RELIABLE", domain: "PUBLICATION", severity: "ERROR", title: "Publication state not reliable", description: "The registry state does not permit public reliance." },
  { code: "PACKAGE_VERIFIED", domain: "RESULT", severity: "INFO", title: "Package verified", description: "All required integrity controls passed." },
  { code: "PACKAGE_VERIFICATION_FAILED", domain: "RESULT", severity: "ERROR", title: "Package verification failed", description: "One or more mandatory integrity controls failed." },
  { code: "COMPONENT_01_CHECK_FAILED", domain: "COMPONENT", severity: "ERROR", title: "Canonical Record integrity check failed", description: "The canonical record integrity control did not produce the expected deterministic result." },
  { code: "COMPONENT_02_CHECK_FAILED", domain: "COMPONENT", severity: "ERROR", title: "Pdf integrity check failed", description: "The PDF integrity control did not produce the expected deterministic result." },
  { code: "COMPONENT_03_CHECK_FAILED", domain: "COMPONENT", severity: "ERROR", title: "Manifest integrity check failed", description: "The manifest integrity control did not produce the expected deterministic result." },
  { code: "COMPONENT_04_CHECK_FAILED", domain: "COMPONENT", severity: "ERROR", title: "Route Snapshot integrity check failed", description: "The route snapshot integrity control did not produce the expected deterministic result." },
  { code: "COMPONENT_05_CHECK_FAILED", domain: "COMPONENT", severity: "ERROR", title: "Execution Receipt integrity check failed", description: "The execution receipt integrity control did not produce the expected deterministic result." },
  { code: "COMPONENT_06_CHECK_FAILED", domain: "COMPONENT", severity: "ERROR", title: "Outcome Closure integrity check failed", description: "The outcome closure integrity control did not produce the expected deterministic result." },
  { code: "COMPONENT_07_CHECK_FAILED", domain: "COMPONENT", severity: "ERROR", title: "Registry Certificate integrity check failed", description: "The registry certificate integrity control did not produce the expected deterministic result." },
  { code: "COMPONENT_08_CHECK_FAILED", domain: "COMPONENT", severity: "ERROR", title: "Verification Report integrity check failed", description: "The verification report integrity control did not produce the expected deterministic result." },
  { code: "COMPONENT_09_CHECK_FAILED", domain: "COMPONENT", severity: "ERROR", title: "Challenge Record integrity check failed", description: "The challenge record integrity control did not produce the expected deterministic result." },
  { code: "COMPONENT_10_CHECK_FAILED", domain: "COMPONENT", severity: "ERROR", title: "Correction Record integrity check failed", description: "The correction record integrity control did not produce the expected deterministic result." },
  { code: "COMPONENT_11_CHECK_FAILED", domain: "COMPONENT", severity: "ERROR", title: "Disclosure Projection integrity check failed", description: "The disclosure projection integrity control did not produce the expected deterministic result." },
  { code: "COMPONENT_12_CHECK_FAILED", domain: "COMPONENT", severity: "ERROR", title: "Claims Boundary integrity check failed", description: "The claims boundary integrity control did not produce the expected deterministic result." },
  { code: "LINEAGE_01_CHECK_FAILED", domain: "LINEAGE", severity: "ERROR", title: "Original Publication integrity check failed", description: "The original publication integrity control did not produce the expected deterministic result." },
  { code: "LINEAGE_02_CHECK_FAILED", domain: "LINEAGE", severity: "ERROR", title: "Amendment integrity check failed", description: "The amendment integrity control did not produce the expected deterministic result." },
  { code: "LINEAGE_03_CHECK_FAILED", domain: "LINEAGE", severity: "ERROR", title: "Correction integrity check failed", description: "The correction integrity control did not produce the expected deterministic result." },
  { code: "LINEAGE_04_CHECK_FAILED", domain: "LINEAGE", severity: "ERROR", title: "Supersession integrity check failed", description: "The supersession integrity control did not produce the expected deterministic result." },
  { code: "LINEAGE_05_CHECK_FAILED", domain: "LINEAGE", severity: "ERROR", title: "Withdrawal integrity check failed", description: "The withdrawal integrity control did not produce the expected deterministic result." },
  { code: "LINEAGE_06_CHECK_FAILED", domain: "LINEAGE", severity: "ERROR", title: "Challenge integrity check failed", description: "The challenge integrity control did not produce the expected deterministic result." },
  { code: "LINEAGE_07_CHECK_FAILED", domain: "LINEAGE", severity: "ERROR", title: "Verification integrity check failed", description: "The verification integrity control did not produce the expected deterministic result." },
  { code: "LINEAGE_08_CHECK_FAILED", domain: "LINEAGE", severity: "ERROR", title: "Registry Update integrity check failed", description: "The registry update integrity control did not produce the expected deterministic result." },
  { code: "PARITY_01_CHECK_FAILED", domain: "PARITY", severity: "ERROR", title: "Pdf To Json integrity check failed", description: "The PDF to JSON integrity control did not produce the expected deterministic result." },
  { code: "PARITY_02_CHECK_FAILED", domain: "PARITY", severity: "ERROR", title: "Manifest To Package integrity check failed", description: "The manifest to package integrity control did not produce the expected deterministic result." },
  { code: "PARITY_03_CHECK_FAILED", domain: "PARITY", severity: "ERROR", title: "Registry To Canonical integrity check failed", description: "The registry to canonical integrity control did not produce the expected deterministic result." },
  { code: "PARITY_04_CHECK_FAILED", domain: "PARITY", severity: "ERROR", title: "Receipt To Determination integrity check failed", description: "The receipt to determination integrity control did not produce the expected deterministic result." },
  { code: "PARITY_05_CHECK_FAILED", domain: "PARITY", severity: "ERROR", title: "Outcome To Receipt integrity check failed", description: "The outcome to receipt integrity control did not produce the expected deterministic result." },
  { code: "PARITY_06_CHECK_FAILED", domain: "PARITY", severity: "ERROR", title: "Disclosure To Canonical integrity check failed", description: "The disclosure to canonical integrity control did not produce the expected deterministic result." },
] as const;

export const INTEGRITY_CONTROLS: readonly IntegrityControlDefinition[] = [
  { controlId: "IH-001", domain: "CANONICAL", title: "Integrity control 001", requirement: "Validate canonical integrity requirement 001 and preserve an attributable result." },
  { controlId: "IH-002", domain: "COMPONENT", title: "Integrity control 002", requirement: "Validate component integrity requirement 002 and preserve an attributable result." },
  { controlId: "IH-003", domain: "PACKAGE", title: "Integrity control 003", requirement: "Validate package integrity requirement 003 and preserve an attributable result." },
  { controlId: "IH-004", domain: "MANIFEST", title: "Integrity control 004", requirement: "Validate manifest integrity requirement 004 and preserve an attributable result." },
  { controlId: "IH-005", domain: "LINEAGE", title: "Integrity control 005", requirement: "Validate lineage integrity requirement 005 and preserve an attributable result." },
  { controlId: "IH-006", domain: "AUDIT", title: "Integrity control 006", requirement: "Validate audit integrity requirement 006 and preserve an attributable result." },
  { controlId: "IH-007", domain: "OFFLINE", title: "Integrity control 007", requirement: "Validate offline integrity requirement 007 and preserve an attributable result." },
  { controlId: "IH-008", domain: "PUBLICATION", title: "Integrity control 008", requirement: "Validate publication integrity requirement 008 and preserve an attributable result." },
  { controlId: "IH-009", domain: "CANONICAL", title: "Integrity control 009", requirement: "Validate canonical integrity requirement 009 and preserve an attributable result." },
  { controlId: "IH-010", domain: "COMPONENT", title: "Integrity control 010", requirement: "Validate component integrity requirement 010 and preserve an attributable result." },
  { controlId: "IH-011", domain: "PACKAGE", title: "Integrity control 011", requirement: "Validate package integrity requirement 011 and preserve an attributable result." },
  { controlId: "IH-012", domain: "MANIFEST", title: "Integrity control 012", requirement: "Validate manifest integrity requirement 012 and preserve an attributable result." },
  { controlId: "IH-013", domain: "LINEAGE", title: "Integrity control 013", requirement: "Validate lineage integrity requirement 013 and preserve an attributable result." },
  { controlId: "IH-014", domain: "AUDIT", title: "Integrity control 014", requirement: "Validate audit integrity requirement 014 and preserve an attributable result." },
  { controlId: "IH-015", domain: "OFFLINE", title: "Integrity control 015", requirement: "Validate offline integrity requirement 015 and preserve an attributable result." },
  { controlId: "IH-016", domain: "PUBLICATION", title: "Integrity control 016", requirement: "Validate publication integrity requirement 016 and preserve an attributable result." },
  { controlId: "IH-017", domain: "CANONICAL", title: "Integrity control 017", requirement: "Validate canonical integrity requirement 017 and preserve an attributable result." },
  { controlId: "IH-018", domain: "COMPONENT", title: "Integrity control 018", requirement: "Validate component integrity requirement 018 and preserve an attributable result." },
  { controlId: "IH-019", domain: "PACKAGE", title: "Integrity control 019", requirement: "Validate package integrity requirement 019 and preserve an attributable result." },
  { controlId: "IH-020", domain: "MANIFEST", title: "Integrity control 020", requirement: "Validate manifest integrity requirement 020 and preserve an attributable result." },
  { controlId: "IH-021", domain: "LINEAGE", title: "Integrity control 021", requirement: "Validate lineage integrity requirement 021 and preserve an attributable result." },
  { controlId: "IH-022", domain: "AUDIT", title: "Integrity control 022", requirement: "Validate audit integrity requirement 022 and preserve an attributable result." },
  { controlId: "IH-023", domain: "OFFLINE", title: "Integrity control 023", requirement: "Validate offline integrity requirement 023 and preserve an attributable result." },
  { controlId: "IH-024", domain: "PUBLICATION", title: "Integrity control 024", requirement: "Validate publication integrity requirement 024 and preserve an attributable result." },
  { controlId: "IH-025", domain: "CANONICAL", title: "Integrity control 025", requirement: "Validate canonical integrity requirement 025 and preserve an attributable result." },
  { controlId: "IH-026", domain: "COMPONENT", title: "Integrity control 026", requirement: "Validate component integrity requirement 026 and preserve an attributable result." },
  { controlId: "IH-027", domain: "PACKAGE", title: "Integrity control 027", requirement: "Validate package integrity requirement 027 and preserve an attributable result." },
  { controlId: "IH-028", domain: "MANIFEST", title: "Integrity control 028", requirement: "Validate manifest integrity requirement 028 and preserve an attributable result." },
  { controlId: "IH-029", domain: "LINEAGE", title: "Integrity control 029", requirement: "Validate lineage integrity requirement 029 and preserve an attributable result." },
  { controlId: "IH-030", domain: "AUDIT", title: "Integrity control 030", requirement: "Validate audit integrity requirement 030 and preserve an attributable result." },
  { controlId: "IH-031", domain: "OFFLINE", title: "Integrity control 031", requirement: "Validate offline integrity requirement 031 and preserve an attributable result." },
  { controlId: "IH-032", domain: "PUBLICATION", title: "Integrity control 032", requirement: "Validate publication integrity requirement 032 and preserve an attributable result." },
  { controlId: "IH-033", domain: "CANONICAL", title: "Integrity control 033", requirement: "Validate canonical integrity requirement 033 and preserve an attributable result." },
  { controlId: "IH-034", domain: "COMPONENT", title: "Integrity control 034", requirement: "Validate component integrity requirement 034 and preserve an attributable result." },
  { controlId: "IH-035", domain: "PACKAGE", title: "Integrity control 035", requirement: "Validate package integrity requirement 035 and preserve an attributable result." },
  { controlId: "IH-036", domain: "MANIFEST", title: "Integrity control 036", requirement: "Validate manifest integrity requirement 036 and preserve an attributable result." },
  { controlId: "IH-037", domain: "LINEAGE", title: "Integrity control 037", requirement: "Validate lineage integrity requirement 037 and preserve an attributable result." },
  { controlId: "IH-038", domain: "AUDIT", title: "Integrity control 038", requirement: "Validate audit integrity requirement 038 and preserve an attributable result." },
  { controlId: "IH-039", domain: "OFFLINE", title: "Integrity control 039", requirement: "Validate offline integrity requirement 039 and preserve an attributable result." },
  { controlId: "IH-040", domain: "PUBLICATION", title: "Integrity control 040", requirement: "Validate publication integrity requirement 040 and preserve an attributable result." },
  { controlId: "IH-041", domain: "CANONICAL", title: "Integrity control 041", requirement: "Validate canonical integrity requirement 041 and preserve an attributable result." },
  { controlId: "IH-042", domain: "COMPONENT", title: "Integrity control 042", requirement: "Validate component integrity requirement 042 and preserve an attributable result." },
  { controlId: "IH-043", domain: "PACKAGE", title: "Integrity control 043", requirement: "Validate package integrity requirement 043 and preserve an attributable result." },
  { controlId: "IH-044", domain: "MANIFEST", title: "Integrity control 044", requirement: "Validate manifest integrity requirement 044 and preserve an attributable result." },
  { controlId: "IH-045", domain: "LINEAGE", title: "Integrity control 045", requirement: "Validate lineage integrity requirement 045 and preserve an attributable result." },
  { controlId: "IH-046", domain: "AUDIT", title: "Integrity control 046", requirement: "Validate audit integrity requirement 046 and preserve an attributable result." },
  { controlId: "IH-047", domain: "OFFLINE", title: "Integrity control 047", requirement: "Validate offline integrity requirement 047 and preserve an attributable result." },
  { controlId: "IH-048", domain: "PUBLICATION", title: "Integrity control 048", requirement: "Validate publication integrity requirement 048 and preserve an attributable result." },
  { controlId: "IH-049", domain: "CANONICAL", title: "Integrity control 049", requirement: "Validate canonical integrity requirement 049 and preserve an attributable result." },
  { controlId: "IH-050", domain: "COMPONENT", title: "Integrity control 050", requirement: "Validate component integrity requirement 050 and preserve an attributable result." },
  { controlId: "IH-051", domain: "PACKAGE", title: "Integrity control 051", requirement: "Validate package integrity requirement 051 and preserve an attributable result." },
  { controlId: "IH-052", domain: "MANIFEST", title: "Integrity control 052", requirement: "Validate manifest integrity requirement 052 and preserve an attributable result." },
  { controlId: "IH-053", domain: "LINEAGE", title: "Integrity control 053", requirement: "Validate lineage integrity requirement 053 and preserve an attributable result." },
  { controlId: "IH-054", domain: "AUDIT", title: "Integrity control 054", requirement: "Validate audit integrity requirement 054 and preserve an attributable result." },
  { controlId: "IH-055", domain: "OFFLINE", title: "Integrity control 055", requirement: "Validate offline integrity requirement 055 and preserve an attributable result." },
  { controlId: "IH-056", domain: "PUBLICATION", title: "Integrity control 056", requirement: "Validate publication integrity requirement 056 and preserve an attributable result." },
  { controlId: "IH-057", domain: "CANONICAL", title: "Integrity control 057", requirement: "Validate canonical integrity requirement 057 and preserve an attributable result." },
  { controlId: "IH-058", domain: "COMPONENT", title: "Integrity control 058", requirement: "Validate component integrity requirement 058 and preserve an attributable result." },
  { controlId: "IH-059", domain: "PACKAGE", title: "Integrity control 059", requirement: "Validate package integrity requirement 059 and preserve an attributable result." },
  { controlId: "IH-060", domain: "MANIFEST", title: "Integrity control 060", requirement: "Validate manifest integrity requirement 060 and preserve an attributable result." },
  { controlId: "IH-061", domain: "LINEAGE", title: "Integrity control 061", requirement: "Validate lineage integrity requirement 061 and preserve an attributable result." },
  { controlId: "IH-062", domain: "AUDIT", title: "Integrity control 062", requirement: "Validate audit integrity requirement 062 and preserve an attributable result." },
  { controlId: "IH-063", domain: "OFFLINE", title: "Integrity control 063", requirement: "Validate offline integrity requirement 063 and preserve an attributable result." },
  { controlId: "IH-064", domain: "PUBLICATION", title: "Integrity control 064", requirement: "Validate publication integrity requirement 064 and preserve an attributable result." },
  { controlId: "IH-065", domain: "CANONICAL", title: "Integrity control 065", requirement: "Validate canonical integrity requirement 065 and preserve an attributable result." },
  { controlId: "IH-066", domain: "COMPONENT", title: "Integrity control 066", requirement: "Validate component integrity requirement 066 and preserve an attributable result." },
  { controlId: "IH-067", domain: "PACKAGE", title: "Integrity control 067", requirement: "Validate package integrity requirement 067 and preserve an attributable result." },
  { controlId: "IH-068", domain: "MANIFEST", title: "Integrity control 068", requirement: "Validate manifest integrity requirement 068 and preserve an attributable result." },
  { controlId: "IH-069", domain: "LINEAGE", title: "Integrity control 069", requirement: "Validate lineage integrity requirement 069 and preserve an attributable result." },
  { controlId: "IH-070", domain: "AUDIT", title: "Integrity control 070", requirement: "Validate audit integrity requirement 070 and preserve an attributable result." },
  { controlId: "IH-071", domain: "OFFLINE", title: "Integrity control 071", requirement: "Validate offline integrity requirement 071 and preserve an attributable result." },
  { controlId: "IH-072", domain: "PUBLICATION", title: "Integrity control 072", requirement: "Validate publication integrity requirement 072 and preserve an attributable result." },
  { controlId: "IH-073", domain: "CANONICAL", title: "Integrity control 073", requirement: "Validate canonical integrity requirement 073 and preserve an attributable result." },
  { controlId: "IH-074", domain: "COMPONENT", title: "Integrity control 074", requirement: "Validate component integrity requirement 074 and preserve an attributable result." },
  { controlId: "IH-075", domain: "PACKAGE", title: "Integrity control 075", requirement: "Validate package integrity requirement 075 and preserve an attributable result." },
  { controlId: "IH-076", domain: "MANIFEST", title: "Integrity control 076", requirement: "Validate manifest integrity requirement 076 and preserve an attributable result." },
  { controlId: "IH-077", domain: "LINEAGE", title: "Integrity control 077", requirement: "Validate lineage integrity requirement 077 and preserve an attributable result." },
  { controlId: "IH-078", domain: "AUDIT", title: "Integrity control 078", requirement: "Validate audit integrity requirement 078 and preserve an attributable result." },
  { controlId: "IH-079", domain: "OFFLINE", title: "Integrity control 079", requirement: "Validate offline integrity requirement 079 and preserve an attributable result." },
  { controlId: "IH-080", domain: "PUBLICATION", title: "Integrity control 080", requirement: "Validate publication integrity requirement 080 and preserve an attributable result." },
  { controlId: "IH-081", domain: "CANONICAL", title: "Integrity control 081", requirement: "Validate canonical integrity requirement 081 and preserve an attributable result." },
  { controlId: "IH-082", domain: "COMPONENT", title: "Integrity control 082", requirement: "Validate component integrity requirement 082 and preserve an attributable result." },
  { controlId: "IH-083", domain: "PACKAGE", title: "Integrity control 083", requirement: "Validate package integrity requirement 083 and preserve an attributable result." },
  { controlId: "IH-084", domain: "MANIFEST", title: "Integrity control 084", requirement: "Validate manifest integrity requirement 084 and preserve an attributable result." },
  { controlId: "IH-085", domain: "LINEAGE", title: "Integrity control 085", requirement: "Validate lineage integrity requirement 085 and preserve an attributable result." },
  { controlId: "IH-086", domain: "AUDIT", title: "Integrity control 086", requirement: "Validate audit integrity requirement 086 and preserve an attributable result." },
  { controlId: "IH-087", domain: "OFFLINE", title: "Integrity control 087", requirement: "Validate offline integrity requirement 087 and preserve an attributable result." },
  { controlId: "IH-088", domain: "PUBLICATION", title: "Integrity control 088", requirement: "Validate publication integrity requirement 088 and preserve an attributable result." },
  { controlId: "IH-089", domain: "CANONICAL", title: "Integrity control 089", requirement: "Validate canonical integrity requirement 089 and preserve an attributable result." },
  { controlId: "IH-090", domain: "COMPONENT", title: "Integrity control 090", requirement: "Validate component integrity requirement 090 and preserve an attributable result." },
  { controlId: "IH-091", domain: "PACKAGE", title: "Integrity control 091", requirement: "Validate package integrity requirement 091 and preserve an attributable result." },
  { controlId: "IH-092", domain: "MANIFEST", title: "Integrity control 092", requirement: "Validate manifest integrity requirement 092 and preserve an attributable result." },
  { controlId: "IH-093", domain: "LINEAGE", title: "Integrity control 093", requirement: "Validate lineage integrity requirement 093 and preserve an attributable result." },
  { controlId: "IH-094", domain: "AUDIT", title: "Integrity control 094", requirement: "Validate audit integrity requirement 094 and preserve an attributable result." },
  { controlId: "IH-095", domain: "OFFLINE", title: "Integrity control 095", requirement: "Validate offline integrity requirement 095 and preserve an attributable result." },
  { controlId: "IH-096", domain: "PUBLICATION", title: "Integrity control 096", requirement: "Validate publication integrity requirement 096 and preserve an attributable result." },
] as const;

export const INTEGRITY_ACCEPTANCE_TESTS: readonly IntegrityAcceptanceTest[] = [
  { testId: "AT-IH-001", title: "Integrity acceptance test 001", passCondition: "The engine deterministically detects or proves integrity condition 001 without mutating the input record." },
  { testId: "AT-IH-002", title: "Integrity acceptance test 002", passCondition: "The engine deterministically detects or proves integrity condition 002 without mutating the input record." },
  { testId: "AT-IH-003", title: "Integrity acceptance test 003", passCondition: "The engine deterministically detects or proves integrity condition 003 without mutating the input record." },
  { testId: "AT-IH-004", title: "Integrity acceptance test 004", passCondition: "The engine deterministically detects or proves integrity condition 004 without mutating the input record." },
  { testId: "AT-IH-005", title: "Integrity acceptance test 005", passCondition: "The engine deterministically detects or proves integrity condition 005 without mutating the input record." },
  { testId: "AT-IH-006", title: "Integrity acceptance test 006", passCondition: "The engine deterministically detects or proves integrity condition 006 without mutating the input record." },
  { testId: "AT-IH-007", title: "Integrity acceptance test 007", passCondition: "The engine deterministically detects or proves integrity condition 007 without mutating the input record." },
  { testId: "AT-IH-008", title: "Integrity acceptance test 008", passCondition: "The engine deterministically detects or proves integrity condition 008 without mutating the input record." },
  { testId: "AT-IH-009", title: "Integrity acceptance test 009", passCondition: "The engine deterministically detects or proves integrity condition 009 without mutating the input record." },
  { testId: "AT-IH-010", title: "Integrity acceptance test 010", passCondition: "The engine deterministically detects or proves integrity condition 010 without mutating the input record." },
  { testId: "AT-IH-011", title: "Integrity acceptance test 011", passCondition: "The engine deterministically detects or proves integrity condition 011 without mutating the input record." },
  { testId: "AT-IH-012", title: "Integrity acceptance test 012", passCondition: "The engine deterministically detects or proves integrity condition 012 without mutating the input record." },
  { testId: "AT-IH-013", title: "Integrity acceptance test 013", passCondition: "The engine deterministically detects or proves integrity condition 013 without mutating the input record." },
  { testId: "AT-IH-014", title: "Integrity acceptance test 014", passCondition: "The engine deterministically detects or proves integrity condition 014 without mutating the input record." },
  { testId: "AT-IH-015", title: "Integrity acceptance test 015", passCondition: "The engine deterministically detects or proves integrity condition 015 without mutating the input record." },
  { testId: "AT-IH-016", title: "Integrity acceptance test 016", passCondition: "The engine deterministically detects or proves integrity condition 016 without mutating the input record." },
  { testId: "AT-IH-017", title: "Integrity acceptance test 017", passCondition: "The engine deterministically detects or proves integrity condition 017 without mutating the input record." },
  { testId: "AT-IH-018", title: "Integrity acceptance test 018", passCondition: "The engine deterministically detects or proves integrity condition 018 without mutating the input record." },
  { testId: "AT-IH-019", title: "Integrity acceptance test 019", passCondition: "The engine deterministically detects or proves integrity condition 019 without mutating the input record." },
  { testId: "AT-IH-020", title: "Integrity acceptance test 020", passCondition: "The engine deterministically detects or proves integrity condition 020 without mutating the input record." },
  { testId: "AT-IH-021", title: "Integrity acceptance test 021", passCondition: "The engine deterministically detects or proves integrity condition 021 without mutating the input record." },
  { testId: "AT-IH-022", title: "Integrity acceptance test 022", passCondition: "The engine deterministically detects or proves integrity condition 022 without mutating the input record." },
  { testId: "AT-IH-023", title: "Integrity acceptance test 023", passCondition: "The engine deterministically detects or proves integrity condition 023 without mutating the input record." },
  { testId: "AT-IH-024", title: "Integrity acceptance test 024", passCondition: "The engine deterministically detects or proves integrity condition 024 without mutating the input record." },
  { testId: "AT-IH-025", title: "Integrity acceptance test 025", passCondition: "The engine deterministically detects or proves integrity condition 025 without mutating the input record." },
  { testId: "AT-IH-026", title: "Integrity acceptance test 026", passCondition: "The engine deterministically detects or proves integrity condition 026 without mutating the input record." },
  { testId: "AT-IH-027", title: "Integrity acceptance test 027", passCondition: "The engine deterministically detects or proves integrity condition 027 without mutating the input record." },
  { testId: "AT-IH-028", title: "Integrity acceptance test 028", passCondition: "The engine deterministically detects or proves integrity condition 028 without mutating the input record." },
  { testId: "AT-IH-029", title: "Integrity acceptance test 029", passCondition: "The engine deterministically detects or proves integrity condition 029 without mutating the input record." },
  { testId: "AT-IH-030", title: "Integrity acceptance test 030", passCondition: "The engine deterministically detects or proves integrity condition 030 without mutating the input record." },
  { testId: "AT-IH-031", title: "Integrity acceptance test 031", passCondition: "The engine deterministically detects or proves integrity condition 031 without mutating the input record." },
  { testId: "AT-IH-032", title: "Integrity acceptance test 032", passCondition: "The engine deterministically detects or proves integrity condition 032 without mutating the input record." },
  { testId: "AT-IH-033", title: "Integrity acceptance test 033", passCondition: "The engine deterministically detects or proves integrity condition 033 without mutating the input record." },
  { testId: "AT-IH-034", title: "Integrity acceptance test 034", passCondition: "The engine deterministically detects or proves integrity condition 034 without mutating the input record." },
  { testId: "AT-IH-035", title: "Integrity acceptance test 035", passCondition: "The engine deterministically detects or proves integrity condition 035 without mutating the input record." },
  { testId: "AT-IH-036", title: "Integrity acceptance test 036", passCondition: "The engine deterministically detects or proves integrity condition 036 without mutating the input record." },
  { testId: "AT-IH-037", title: "Integrity acceptance test 037", passCondition: "The engine deterministically detects or proves integrity condition 037 without mutating the input record." },
  { testId: "AT-IH-038", title: "Integrity acceptance test 038", passCondition: "The engine deterministically detects or proves integrity condition 038 without mutating the input record." },
  { testId: "AT-IH-039", title: "Integrity acceptance test 039", passCondition: "The engine deterministically detects or proves integrity condition 039 without mutating the input record." },
  { testId: "AT-IH-040", title: "Integrity acceptance test 040", passCondition: "The engine deterministically detects or proves integrity condition 040 without mutating the input record." },
  { testId: "AT-IH-041", title: "Integrity acceptance test 041", passCondition: "The engine deterministically detects or proves integrity condition 041 without mutating the input record." },
  { testId: "AT-IH-042", title: "Integrity acceptance test 042", passCondition: "The engine deterministically detects or proves integrity condition 042 without mutating the input record." },
  { testId: "AT-IH-043", title: "Integrity acceptance test 043", passCondition: "The engine deterministically detects or proves integrity condition 043 without mutating the input record." },
  { testId: "AT-IH-044", title: "Integrity acceptance test 044", passCondition: "The engine deterministically detects or proves integrity condition 044 without mutating the input record." },
  { testId: "AT-IH-045", title: "Integrity acceptance test 045", passCondition: "The engine deterministically detects or proves integrity condition 045 without mutating the input record." },
  { testId: "AT-IH-046", title: "Integrity acceptance test 046", passCondition: "The engine deterministically detects or proves integrity condition 046 without mutating the input record." },
  { testId: "AT-IH-047", title: "Integrity acceptance test 047", passCondition: "The engine deterministically detects or proves integrity condition 047 without mutating the input record." },
  { testId: "AT-IH-048", title: "Integrity acceptance test 048", passCondition: "The engine deterministically detects or proves integrity condition 048 without mutating the input record." },
  { testId: "AT-IH-049", title: "Integrity acceptance test 049", passCondition: "The engine deterministically detects or proves integrity condition 049 without mutating the input record." },
  { testId: "AT-IH-050", title: "Integrity acceptance test 050", passCondition: "The engine deterministically detects or proves integrity condition 050 without mutating the input record." },
  { testId: "AT-IH-051", title: "Integrity acceptance test 051", passCondition: "The engine deterministically detects or proves integrity condition 051 without mutating the input record." },
  { testId: "AT-IH-052", title: "Integrity acceptance test 052", passCondition: "The engine deterministically detects or proves integrity condition 052 without mutating the input record." },
  { testId: "AT-IH-053", title: "Integrity acceptance test 053", passCondition: "The engine deterministically detects or proves integrity condition 053 without mutating the input record." },
  { testId: "AT-IH-054", title: "Integrity acceptance test 054", passCondition: "The engine deterministically detects or proves integrity condition 054 without mutating the input record." },
  { testId: "AT-IH-055", title: "Integrity acceptance test 055", passCondition: "The engine deterministically detects or proves integrity condition 055 without mutating the input record." },
  { testId: "AT-IH-056", title: "Integrity acceptance test 056", passCondition: "The engine deterministically detects or proves integrity condition 056 without mutating the input record." },
  { testId: "AT-IH-057", title: "Integrity acceptance test 057", passCondition: "The engine deterministically detects or proves integrity condition 057 without mutating the input record." },
  { testId: "AT-IH-058", title: "Integrity acceptance test 058", passCondition: "The engine deterministically detects or proves integrity condition 058 without mutating the input record." },
  { testId: "AT-IH-059", title: "Integrity acceptance test 059", passCondition: "The engine deterministically detects or proves integrity condition 059 without mutating the input record." },
  { testId: "AT-IH-060", title: "Integrity acceptance test 060", passCondition: "The engine deterministically detects or proves integrity condition 060 without mutating the input record." },
  { testId: "AT-IH-061", title: "Integrity acceptance test 061", passCondition: "The engine deterministically detects or proves integrity condition 061 without mutating the input record." },
  { testId: "AT-IH-062", title: "Integrity acceptance test 062", passCondition: "The engine deterministically detects or proves integrity condition 062 without mutating the input record." },
  { testId: "AT-IH-063", title: "Integrity acceptance test 063", passCondition: "The engine deterministically detects or proves integrity condition 063 without mutating the input record." },
  { testId: "AT-IH-064", title: "Integrity acceptance test 064", passCondition: "The engine deterministically detects or proves integrity condition 064 without mutating the input record." },
  { testId: "AT-IH-065", title: "Integrity acceptance test 065", passCondition: "The engine deterministically detects or proves integrity condition 065 without mutating the input record." },
  { testId: "AT-IH-066", title: "Integrity acceptance test 066", passCondition: "The engine deterministically detects or proves integrity condition 066 without mutating the input record." },
  { testId: "AT-IH-067", title: "Integrity acceptance test 067", passCondition: "The engine deterministically detects or proves integrity condition 067 without mutating the input record." },
  { testId: "AT-IH-068", title: "Integrity acceptance test 068", passCondition: "The engine deterministically detects or proves integrity condition 068 without mutating the input record." },
  { testId: "AT-IH-069", title: "Integrity acceptance test 069", passCondition: "The engine deterministically detects or proves integrity condition 069 without mutating the input record." },
  { testId: "AT-IH-070", title: "Integrity acceptance test 070", passCondition: "The engine deterministically detects or proves integrity condition 070 without mutating the input record." },
  { testId: "AT-IH-071", title: "Integrity acceptance test 071", passCondition: "The engine deterministically detects or proves integrity condition 071 without mutating the input record." },
  { testId: "AT-IH-072", title: "Integrity acceptance test 072", passCondition: "The engine deterministically detects or proves integrity condition 072 without mutating the input record." },
  { testId: "AT-IH-073", title: "Integrity acceptance test 073", passCondition: "The engine deterministically detects or proves integrity condition 073 without mutating the input record." },
  { testId: "AT-IH-074", title: "Integrity acceptance test 074", passCondition: "The engine deterministically detects or proves integrity condition 074 without mutating the input record." },
  { testId: "AT-IH-075", title: "Integrity acceptance test 075", passCondition: "The engine deterministically detects or proves integrity condition 075 without mutating the input record." },
  { testId: "AT-IH-076", title: "Integrity acceptance test 076", passCondition: "The engine deterministically detects or proves integrity condition 076 without mutating the input record." },
  { testId: "AT-IH-077", title: "Integrity acceptance test 077", passCondition: "The engine deterministically detects or proves integrity condition 077 without mutating the input record." },
  { testId: "AT-IH-078", title: "Integrity acceptance test 078", passCondition: "The engine deterministically detects or proves integrity condition 078 without mutating the input record." },
  { testId: "AT-IH-079", title: "Integrity acceptance test 079", passCondition: "The engine deterministically detects or proves integrity condition 079 without mutating the input record." },
  { testId: "AT-IH-080", title: "Integrity acceptance test 080", passCondition: "The engine deterministically detects or proves integrity condition 080 without mutating the input record." },
] as const;


const DEFAULT_CANONICALIZATION_OPTIONS: Required<CanonicalizationOptions> = {
  version: TA14_CANONICALIZATION_VERSION,
  normalizeDates: true,
  normalizeUnicode: true,
  sortArrays: false,
  rejectUndefined: true,
  rejectFunctions: true,
  rejectSymbols: true,
  rejectNonFiniteNumbers: true,
  bigintMode: "DECIMAL_STRING",
};

const HEX_64 = /^[0-9a-f]{64}$/;
const ISO_DATE_PREFIX = /^\d{4}-\d{2}-\d{2}T/;

function issue(
  code: IntegrityReasonCode,
  message?: string,
  extra: Partial<IntegrityIssue> = {},
): IntegrityIssue {
  const definition = INTEGRITY_REASON_DEFINITIONS.find((item) => item.code === code);
  if (!definition) {
    throw new Error(`Unknown integrity reason code: ${code}`);
  }
  return {
    code,
    domain: definition.domain,
    severity: definition.severity,
    title: definition.title,
    message: message ?? definition.description,
    ...extra,
  };
}

function utf8Bytes(value: string): Uint8Array {
  if (typeof TextEncoder !== "undefined") {
    return new TextEncoder().encode(value);
  }
  const encoded = unescape(encodeURIComponent(value));
  const bytes = new Uint8Array(encoded.length);
  for (let index = 0; index < encoded.length; index += 1) {
    bytes[index] = encoded.charCodeAt(index);
  }
  return bytes;
}

function concatBytes(parts: readonly Uint8Array[]): Uint8Array {
  const total = parts.reduce((sum, part) => sum + part.length, 0);
  const result = new Uint8Array(total);
  let offset = 0;
  for (const part of parts) {
    result.set(part, offset);
    offset += part.length;
  }
  return result;
}

function rightRotate(value: number, bits: number): number {
  return (value >>> bits) | (value << (32 - bits));
}

/**
 * Dependency-free SHA-256 implementation used for deterministic integrity
 * processing in browser, edge, and Node runtimes.
 */
export function sha256Bytes(input: Uint8Array): Uint8Array {
  const constants = new Uint32Array([
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
  ]);

  const bitLength = input.length * 8;
  const paddedLength = Math.ceil((input.length + 9) / 64) * 64;
  const padded = new Uint8Array(paddedLength);
  padded.set(input);
  padded[input.length] = 0x80;
  const view = new DataView(padded.buffer);
  const high = Math.floor(bitLength / 0x100000000);
  const low = bitLength >>> 0;
  view.setUint32(paddedLength - 8, high, false);
  view.setUint32(paddedLength - 4, low, false);

  const hash = new Uint32Array([
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
    0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19,
  ]);
  const words = new Uint32Array(64);

  for (let offset = 0; offset < padded.length; offset += 64) {
    for (let index = 0; index < 16; index += 1) {
      words[index] = view.getUint32(offset + index * 4, false);
    }
    for (let index = 16; index < 64; index += 1) {
      const s0 = rightRotate(words[index - 15], 7) ^ rightRotate(words[index - 15], 18) ^ (words[index - 15] >>> 3);
      const s1 = rightRotate(words[index - 2], 17) ^ rightRotate(words[index - 2], 19) ^ (words[index - 2] >>> 10);
      words[index] = (words[index - 16] + s0 + words[index - 7] + s1) >>> 0;
    }

    let a = hash[0]; let b = hash[1]; let c = hash[2]; let d = hash[3];
    let e = hash[4]; let f = hash[5]; let g = hash[6]; let h = hash[7];

    for (let index = 0; index < 64; index += 1) {
      const sum1 = rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25);
      const choice = (e & f) ^ (~e & g);
      const temp1 = (h + sum1 + choice + constants[index] + words[index]) >>> 0;
      const sum0 = rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22);
      const majority = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = (sum0 + majority) >>> 0;
      h = g; g = f; f = e; e = (d + temp1) >>> 0;
      d = c; c = b; b = a; a = (temp1 + temp2) >>> 0;
    }

    hash[0] = (hash[0] + a) >>> 0;
    hash[1] = (hash[1] + b) >>> 0;
    hash[2] = (hash[2] + c) >>> 0;
    hash[3] = (hash[3] + d) >>> 0;
    hash[4] = (hash[4] + e) >>> 0;
    hash[5] = (hash[5] + f) >>> 0;
    hash[6] = (hash[6] + g) >>> 0;
    hash[7] = (hash[7] + h) >>> 0;
  }

  const output = new Uint8Array(32);
  const outputView = new DataView(output.buffer);
  for (let index = 0; index < hash.length; index += 1) {
    outputView.setUint32(index * 4, hash[index], false);
  }
  return output;
}

export function bytesToHex(bytes: Uint8Array): string {
  let result = "";
  for (const byte of bytes) result += byte.toString(16).padStart(2, "0");
  return result;
}

export function sha256Hex(input: string | Uint8Array): string {
  return bytesToHex(sha256Bytes(typeof input === "string" ? utf8Bytes(input) : input));
}

export function constantTimeHexEqual(left: string, right: string): boolean {
  if (left.length !== right.length) return false;
  let mismatch = 0;
  for (let index = 0; index < left.length; index += 1) {
    mismatch |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return mismatch === 0;
}

function normalizeCanonicalValue(
  value: unknown,
  options: Required<CanonicalizationOptions>,
  seen: Set<object>,
  path: string,
): unknown {
  if (value === null || typeof value === "boolean" || typeof value === "string") {
    if (typeof value === "string") {
      const normalized = options.normalizeUnicode ? value.normalize("NFC") : value;
      if (options.normalizeDates && ISO_DATE_PREFIX.test(normalized)) {
        const date = new Date(normalized);
        if (!Number.isNaN(date.getTime())) return date.toISOString();
      }
      return normalized;
    }
    return value;
  }
  if (typeof value === "number") {
    if (!Number.isFinite(value) && options.rejectNonFiniteNumbers) {
      throw new TypeError(`Nonfinite number at ${path}`);
    }
    if (Object.is(value, -0)) return 0;
    return value;
  }
  if (typeof value === "bigint") {
    if (options.bigintMode === "REJECT") throw new TypeError(`BigInt rejected at ${path}`);
    return value.toString(10);
  }
  if (typeof value === "undefined") {
    if (options.rejectUndefined) throw new TypeError(`Undefined rejected at ${path}`);
    return null;
  }
  if (typeof value === "function") {
    if (options.rejectFunctions) throw new TypeError(`Function rejected at ${path}`);
    return null;
  }
  if (typeof value === "symbol") {
    if (options.rejectSymbols) throw new TypeError(`Symbol rejected at ${path}`);
    return String(value);
  }
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) throw new TypeError(`Invalid date at ${path}`);
    return value.toISOString();
  }
  if (value instanceof Uint8Array) {
    return { $bytes: bytesToHex(value) };
  }
  if (typeof value === "object") {
    if (seen.has(value)) throw new TypeError(`Circular reference at ${path}`);
    seen.add(value);
    try {
      if (Array.isArray(value)) {
        const normalized = value.map((item, index) => normalizeCanonicalValue(item, options, seen, `${path}[${index}]`));
        return options.sortArrays
          ? normalized.slice().sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)))
          : normalized;
      }
      if (value instanceof Set) {
        return Array.from(value)
          .map((item, index) => normalizeCanonicalValue(item, options, seen, `${path}.set[${index}]`))
          .sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
      }
      if (value instanceof Map) {
        const entries: Record<string, unknown> = {};
        for (const [key, item] of value.entries()) {
          if (typeof key !== "string") throw new TypeError(`Non-string map key at ${path}`);
          entries[key] = normalizeCanonicalValue(item, options, seen, `${path}.${key}`);
        }
        return Object.fromEntries(Object.keys(entries).sort().map((key) => [key, entries[key]]));
      }
      const record = value as Record<string, unknown>;
      const normalized: Record<string, unknown> = {};
      for (const key of Object.keys(record).sort()) {
        normalized[key] = normalizeCanonicalValue(record[key], options, seen, `${path}.${key}`);
      }
      return normalized;
    } finally {
      seen.delete(value);
    }
  }
  throw new TypeError(`Unsupported value at ${path}`);
}

export function canonicalize(
  value: unknown,
  options: CanonicalizationOptions = {},
): string {
  const resolved: Required<CanonicalizationOptions> = {
    ...DEFAULT_CANONICALIZATION_OPTIONS,
    ...options,
  };
  const normalized = normalizeCanonicalValue(value, resolved, new Set<object>(), "$root");
  return JSON.stringify(normalized);
}

export function canonicalHash(value: unknown, options: CanonicalizationOptions = {}): string {
  return sha256Hex(canonicalize(value, options));
}

export function componentBytes(component: IntegrityComponentInput, options: CanonicalizationOptions = {}): Uint8Array {
  const populated = [component.bytes !== undefined, component.text !== undefined, component.value !== undefined]
    .filter(Boolean).length;
  if (populated !== 1) {
    throw new Error(`Component ${component.componentId} must supply exactly one of bytes, text, or value.`);
  }
  if (component.bytes) return new Uint8Array(component.bytes);
  if (component.text !== undefined) return utf8Bytes(component.text);
  return utf8Bytes(canonicalize(component.value, options));
}

export function digestComponent(
  component: IntegrityComponentInput,
  options: CanonicalizationOptions = {},
): IntegrityComponentDigest {
  const bytes = componentBytes(component, options);
  return {
    componentId: component.componentId,
    kind: component.kind,
    label: component.label,
    mediaType: component.mediaType,
    required: component.required,
    disclosure: component.disclosure,
    hashAlgorithm: TA14_HASH_ALGORITHM,
    hash: sha256Hex(bytes),
    byteLength: bytes.byteLength,
    stableUrl: component.stableUrl,
    createdAt: component.createdAt,
    createdBy: component.createdBy,
  };
}

export function calculatePackageRoot(components: readonly IntegrityComponentDigest[]): string {
  const leaves = components
    .slice()
    .sort((a, b) => a.componentId.localeCompare(b.componentId))
    .map((component) => sha256Bytes(utf8Bytes(`${component.componentId}\n${component.kind}\n${component.hash}\n${component.byteLength}`)));
  if (leaves.length === 0) return sha256Hex("");
  let level = leaves;
  while (level.length > 1) {
    const next: Uint8Array[] = [];
    for (let index = 0; index < level.length; index += 2) {
      const left = level[index];
      const right = level[index + 1] ?? left;
      next.push(sha256Bytes(concatBytes([left, right])));
    }
    level = next;
  }
  return bytesToHex(level[0]);
}

function hashLineagePayload(link: Omit<IntegrityLineageLink, "linkHash">): string {
  return canonicalHash(link);
}

export function appendLineageLink(
  existing: readonly IntegrityLineageLink[],
  input: Omit<IntegrityLineageLink, "sequence" | "parentHash" | "linkHash">,
): IntegrityLineageLink[] {
  const previous = existing[existing.length - 1];
  const next: Omit<IntegrityLineageLink, "linkHash"> = {
    ...input,
    sequence: existing.length + 1,
    parentHash: previous?.linkHash ?? "0".repeat(64),
  };
  return [...existing, { ...next, linkHash: hashLineagePayload(next) }];
}

export function verifyLineage(lineage: readonly IntegrityLineageLink[]): IntegrityIssue[] {
  const issues: IntegrityIssue[] = [];
  let previous = "0".repeat(64);
  for (let index = 0; index < lineage.length; index += 1) {
    const link = lineage[index];
    if (link.sequence !== index + 1) {
      issues.push(issue("AUDIT_SEQUENCE_INVALID", undefined, { path: `lineage[${index}].sequence`, expected: index + 1, actual: link.sequence }));
    }
    if (link.parentHash !== previous) {
      issues.push(issue("AMENDMENT_PARENT_MISMATCH", undefined, { path: `lineage[${index}].parentHash`, expected: previous, actual: link.parentHash }));
    }
    const { linkHash: _ignored, ...payload } = link;
    const calculated = hashLineagePayload(payload);
    if (!constantTimeHexEqual(calculated, link.linkHash)) {
      issues.push(issue("AMENDMENT_HASH_MISMATCH", undefined, { path: `lineage[${index}].linkHash`, expected: calculated, actual: link.linkHash }));
    }
    previous = link.linkHash;
  }
  return issues;
}

function hashAuditPayload(event: Omit<IntegrityAuditEvent, "eventHash">): string {
  return canonicalHash(event);
}

export function appendAuditEvent(
  existing: readonly IntegrityAuditEvent[],
  input: Omit<IntegrityAuditEvent, "sequence" | "previousHash" | "eventHash">,
): IntegrityAuditEvent[] {
  const previous = existing[existing.length - 1];
  const event: Omit<IntegrityAuditEvent, "eventHash"> = {
    ...input,
    sequence: existing.length + 1,
    previousHash: previous?.eventHash ?? "0".repeat(64),
  };
  return [...existing, { ...event, eventHash: hashAuditPayload(event) }];
}

export function verifyAuditChain(events: readonly IntegrityAuditEvent[]): IntegrityIssue[] {
  const issues: IntegrityIssue[] = [];
  let previousHash = "0".repeat(64);
  for (let index = 0; index < events.length; index += 1) {
    const event = events[index];
    if (event.sequence !== index + 1) {
      issues.push(issue("AUDIT_SEQUENCE_INVALID", undefined, { path: `auditEvents[${index}].sequence`, expected: index + 1, actual: event.sequence }));
    }
    if (event.previousHash !== previousHash) {
      issues.push(issue("AUDIT_EVENT_PREVIOUS_HASH_MISMATCH", undefined, { path: `auditEvents[${index}].previousHash`, expected: previousHash, actual: event.previousHash }));
    }
    const { eventHash: _ignored, ...payload } = event;
    const calculated = hashAuditPayload(payload);
    if (!constantTimeHexEqual(calculated, event.eventHash)) {
      issues.push(issue("AUDIT_EVENT_HASH_MISMATCH", undefined, { path: `auditEvents[${index}].eventHash`, expected: calculated, actual: event.eventHash }));
    }
    previousHash = event.eventHash;
  }
  return issues;
}

function manifestWithoutHash(manifest: IntegrityManifest): Omit<IntegrityManifest, "manifestHash"> {
  const { manifestHash: _ignored, ...rest } = manifest;
  return rest;
}

export function rehashManifest(manifest: IntegrityManifest): IntegrityManifest {
  return { ...manifest, manifestHash: canonicalHash(manifestWithoutHash(manifest)) };
}

export function verifyComponent(
  component: IntegrityComponentInput,
  options: CanonicalizationOptions = {},
): ComponentVerificationResult {
  const digest = digestComponent(component, options);
  const hashMatches = component.declaredHash ? constantTimeHexEqual(component.declaredHash, digest.hash) : true;
  const lengthMatches = component.declaredByteLength === undefined || component.declaredByteLength === digest.byteLength;
  return {
    componentId: component.componentId,
    kind: component.kind,
    required: component.required,
    declaredHash: component.declaredHash,
    calculatedHash: digest.hash,
    byteLength: digest.byteLength,
    hashMatches,
    lengthMatches,
    verified: hashMatches && lengthMatches,
  };
}

export function verifyIntegrityPackage(
  manifest: IntegrityManifest,
  components: readonly IntegrityComponentInput[],
  verifierId: string,
  verifiedAt: string,
  options: CanonicalizationOptions = {},
): IntegrityVerificationResult {
  const issues: IntegrityIssue[] = [];
  const ids = new Set<string>();
  for (const component of components) {
    if (!component.componentId) issues.push(issue("COMPONENT_ID_MISSING"));
    if (ids.has(component.componentId)) issues.push(issue("COMPONENT_DUPLICATE_ID", undefined, { componentId: component.componentId }));
    ids.add(component.componentId);
  }

  const componentResults = components.map((component) => verifyComponent(component, options));
  for (const result of componentResults) {
    if (!result.hashMatches) issues.push(issue("COMPONENT_HASH_MISMATCH", undefined, { componentId: result.componentId, expected: result.declaredHash, actual: result.calculatedHash }));
    if (!result.lengthMatches) issues.push(issue("BYTE_LENGTH_MISMATCH", undefined, { componentId: result.componentId }));
  }

  const digests = components.map((component) => digestComponent(component, options));
  const calculatedRoot = calculatePackageRoot(digests);
  if (!constantTimeHexEqual(calculatedRoot, manifest.packageRootHash)) {
    issues.push(issue("PACKAGE_ROOT_MISMATCH", undefined, { expected: manifest.packageRootHash, actual: calculatedRoot }));
  }
  if (manifest.componentCount !== digests.length) {
    issues.push(issue("PACKAGE_COMPONENT_COUNT_MISMATCH", undefined, { expected: manifest.componentCount, actual: digests.length }));
  }

  const calculatedManifestHash = canonicalHash(manifestWithoutHash(manifest));
  if (!constantTimeHexEqual(calculatedManifestHash, manifest.manifestHash)) {
    issues.push(issue("MANIFEST_HASH_MISMATCH", undefined, { expected: manifest.manifestHash, actual: calculatedManifestHash }));
  }

  issues.push(...verifyLineage(manifest.lineage));
  issues.push(...verifyAuditChain(manifest.auditEvents));

  const errors = issues.filter((item) => item.severity === "ERROR");
  const warnings = issues.filter((item) => item.severity === "WARNING");
  const disposition: IntegrityDisposition = errors.length > 0
    ? "FAILED"
    : warnings.length > 0
      ? "VERIFIED_WITH_WARNINGS"
      : "VERIFIED";
  const reportPayload = {
    disposition,
    verifiedAt,
    verifierId,
    calculatedManifestHash,
    calculatedRoot,
    componentResults,
    issueCodes: issues.map((item) => item.code),
  };
  return {
    disposition,
    verified: errors.length === 0,
    verifiedAt,
    verifierId,
    engineVersion: TA14_INTEGRITY_HASH_ENGINE_VERSION,
    policyVersion: TA14_INTEGRITY_POLICY_VERSION,
    canonicalizationVersion: TA14_CANONICALIZATION_VERSION,
    hashAlgorithm: TA14_HASH_ALGORITHM,
    canonicalHash: manifest.canonicalHash,
    calculatedManifestHash,
    calculatedPackageRootHash: calculatedRoot,
    componentResults,
    lineageVerified: verifyLineage(manifest.lineage).length === 0,
    auditChainVerified: verifyAuditChain(manifest.auditEvents).length === 0,
    issues,
    warnings,
    errors,
    reportHash: canonicalHash(reportPayload),
  };
}

function extractArtifactId(artifact: CanonicalExecutionArtifact): string {
  const candidate = artifact as unknown as Record<string, unknown>;
  const identity = candidate.identity as Record<string, unknown> | undefined;
  return String(identity?.artifactId ?? candidate.artifactId ?? "UNKNOWN-ARTIFACT");
}

function extractRegistryId(record?: ArtifactRegistryRecord): string | undefined {
  if (!record) return undefined;
  const candidate = record as unknown as Record<string, unknown>;
  return typeof candidate.registryId === "string" ? candidate.registryId : undefined;
}

function extractGovernanceRegistrationId(record?: ArtifactRegistryRecord): string | undefined {
  if (!record) return undefined;
  const candidate = record as unknown as Record<string, unknown>;
  return typeof candidate.governanceRegistrationId === "string" ? candidate.governanceRegistrationId : undefined;
}

export function createIntegrityPackage(request: IntegrityPackageRequest): IntegrityPackageResult {
  const options: CanonicalizationOptions = {
    ...DEFAULT_CANONICALIZATION_OPTIONS,
    ...request.options,
  };
  const artifactId = extractArtifactId(request.artifact);
  const canonicalJson = canonicalize(request.artifact, options);
  const canonicalDigest = sha256Hex(canonicalJson);

  const suppliedComponents = request.components.slice();
  if (!suppliedComponents.some((item) => item.kind === "CANONICAL_JSON")) {
    suppliedComponents.unshift({
      componentId: `${artifactId}:canonical-json`,
      kind: "CANONICAL_JSON",
      label: "Canonical execution artifact JSON",
      mediaType: "application/json",
      required: true,
      disclosure: "RESTRICTED",
      text: canonicalJson,
    });
  }

  const componentDigests = suppliedComponents.map((component) => digestComponent(component, options));
  const packageRootHash = calculatePackageRoot(componentDigests);
  let auditEvents = request.auditEvents ? request.auditEvents.slice() : [];
  auditEvents = appendAuditEvent(auditEvents, {
    eventId: `${artifactId}:integrity:${auditEvents.length + 1}`,
    occurredAt: request.generatedAt,
    actorId: request.generatedBy,
    eventType: "PACKAGE_CREATED",
    subjectId: artifactId,
    description: `Integrity package created with ${componentDigests.length} components.`,
  });

  const provisional: IntegrityManifest = {
    manifestId: `${artifactId}:integrity-manifest:${TA14_INTEGRITY_POLICY_VERSION}`,
    manifestVersion: "1.0",
    integrityEngineVersion: TA14_INTEGRITY_HASH_ENGINE_VERSION,
    integrityPolicyVersion: TA14_INTEGRITY_POLICY_VERSION,
    canonicalizationVersion: TA14_CANONICALIZATION_VERSION,
    hashAlgorithm: TA14_HASH_ALGORITHM,
    generatedAt: request.generatedAt,
    generatedBy: request.generatedBy,
    artifactId,
    registryId: extractRegistryId(request.registryRecord),
    governanceRegistrationId: extractGovernanceRegistrationId(request.registryRecord),
    canonicalHash: canonicalDigest,
    pdfHash: componentDigests.find((item) => item.kind === "PUBLIC_PDF")?.hash,
    manifestHash: "0".repeat(64),
    packageRootHash,
    componentCount: componentDigests.length,
    components: componentDigests,
    lineage: request.lineage ? request.lineage.slice() : [],
    auditEvents,
    publicationUrl: request.publicationUrl,
    verificationUrl: request.verificationUrl,
    challengeUrl: request.challengeUrl,
    claimsBoundaryHash: componentDigests.find((item) => item.kind === "CLAIMS_BOUNDARY")?.hash,
    disclosureProjectionHash: componentDigests.find((item) => item.kind === "DISCLOSURE_PROJECTION")?.hash,
    signatureEnvelopeHash: componentDigests.find((item) => item.kind === "SIGNATURE_ENVELOPE")?.hash,
  };
  const manifest = rehashManifest(provisional);
  const validation = verifyIntegrityPackage(
    manifest,
    suppliedComponents.map((component, index) => ({
      ...component,
      declaredHash: componentDigests[index].hash,
      declaredByteLength: componentDigests[index].byteLength,
    })),
    request.verifierId ?? request.generatedBy,
    request.generatedAt,
    options,
  );
  const manifestJson = canonicalize(manifest, options);
  const packageJson = canonicalize({ manifest, components: componentDigests, validation }, options);
  return {
    manifest,
    componentDigests,
    manifestJson,
    packageJson,
    offlineVerificationText: buildOfflineVerificationInstructions(manifest),
    validation,
  };
}

export function buildOfflineVerificationInstructions(manifest: IntegrityManifest): string {
  const lines = [
    "TA-14 EXECUTION ARTIFACT OFFLINE INTEGRITY VERIFICATION",
    "",
    `Artifact: ${manifest.artifactId}`,
    `Registry: ${manifest.registryId ?? "Not registered"}`,
    `Algorithm: ${manifest.hashAlgorithm}`,
    `Canonicalization: ${manifest.canonicalizationVersion}`,
    `Package root: ${manifest.packageRootHash}`,
    `Manifest hash: ${manifest.manifestHash}`,
    "",
    "Procedure:",
    "1. Preserve the downloaded files exactly as received.",
    "2. Calculate SHA-256 for every component.",
    "3. Compare each digest and byte length to the component index.",
    "4. Sort components by componentId.",
    "5. Rebuild each package leaf from componentId, kind, hash, and byte length.",
    "6. Recalculate the binary Merkle-style package root.",
    "7. Compare the result to the published package root.",
    "8. Recalculate the canonical manifest hash with manifestHash omitted.",
    "9. Verify append-only lineage and audit chains from the all-zero genesis hash.",
    "10. Treat any mismatch as a failed integrity verification.",
    "",
    "Integrity confirms preservation of committed content. It does not independently prove factual truth, authority, or governance quality.",
  ];
  return lines.join("\n");
}

export function createOfflineVerificationBundle(
  result: IntegrityPackageResult,
  createdAt: string,
): OfflineVerificationBundle {
  const componentIndex = result.componentDigests.map(({ componentId, kind, mediaType, hash, byteLength }) => ({
    componentId,
    kind,
    mediaType,
    hash,
    byteLength,
  }));
  const payload = {
    createdAt,
    artifactId: result.manifest.artifactId,
    registryId: result.manifest.registryId,
    manifestHash: result.manifest.manifestHash,
    packageRootHash: result.manifest.packageRootHash,
    componentIndex,
  };
  return {
    bundleId: `${result.manifest.artifactId}:offline:${createdAt}`,
    createdAt,
    artifactId: result.manifest.artifactId,
    registryId: result.manifest.registryId,
    manifest: result.manifest,
    manifestJson: result.manifestJson,
    instructions: result.offlineVerificationText,
    componentIndex,
    bundleHash: canonicalHash(payload),
  };
}

export function importRegistryManifest(
  manifest: RegistryPublicationManifest,
): IntegrityComponentDigest[] {
  return manifest.components.map((component: RegistryPublicationComponent) => ({
    componentId: component.componentId,
    kind: inferComponentKind(component.mediaType, component.label),
    label: component.label,
    mediaType: component.mediaType,
    required: component.required,
    disclosure: component.disclosure,
    hashAlgorithm: TA14_HASH_ALGORITHM,
    hash: component.hash,
    byteLength: component.sizeBytes ?? 0,
    stableUrl: component.stableUrl,
  }));
}

export function inferComponentKind(mediaType: string, label: string): IntegrityComponentKind {
  const value = `${mediaType} ${label}`.toLowerCase();
  if (value.includes("pdf")) return "PUBLIC_PDF";
  if (value.includes("route")) return "ROUTE_SNAPSHOT";
  if (value.includes("receipt")) return "EXECUTION_RECEIPT";
  if (value.includes("outcome")) return "OUTCOME_CLOSURE";
  if (value.includes("manifest")) return "INTEGRITY_MANIFEST";
  if (value.includes("registry certificate")) return "REGISTRY_CERTIFICATE";
  if (value.includes("registry")) return "REGISTRY_RECORD";
  if (value.includes("verification")) return "VERIFICATION_REPORT";
  if (value.includes("disclosure")) return "DISCLOSURE_PROJECTION";
  if (value.includes("claim")) return "CLAIMS_BOUNDARY";
  if (value.includes("challenge")) return "CHALLENGE_RECORD";
  if (value.includes("correction")) return "CORRECTION_RECORD";
  if (value.includes("signature")) return "SIGNATURE_ENVELOPE";
  if (value.includes("json")) return "CANONICAL_JSON";
  return "OTHER";
}

export function stableIntegrityManifestJson(manifest: IntegrityManifest): string {
  return canonicalize(manifest);
}

export function stableIntegrityVerificationJson(result: IntegrityVerificationResult): string {
  return canonicalize(result);
}

export function assertIntegrityVerified(result: IntegrityVerificationResult): void {
  if (!result.verified) {
    const codes = result.errors.map((item) => item.code).join(", ");
    throw new Error(`Integrity verification failed: ${codes || "unknown integrity failure"}`);
  }
}

export function verifyHexDigest(value: string): boolean {
  return HEX_64.test(value);
}

export function runIntegritySelfTests(): readonly { name: string; passed: boolean; detail: string }[] {
  const vectors = [
    ["", "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"],
    ["abc", "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad"],
    ["TA-14", "17f5bb96f3e4499d4bb225de90c98cba487f1cc5ea8b4e701e946ecdd0a9d5d9"],
  ] as const;
  return vectors.map(([input, expected]) => {
    const actual = sha256Hex(input);
    return {
      name: `SHA-256 vector ${JSON.stringify(input)}`,
      passed: actual === expected,
      detail: `expected=${expected}; actual=${actual}`,
    };
  });
}


export interface IntegrityComponentProfile {
  profileId: string;
  kind: IntegrityComponentKind;
  label: string;
  mediaType: string;
  requiredForPublicReliance: boolean;
  requiredForProductionClaim: boolean;
  defaultDisclosure: "PUBLIC" | "SELECTIVE" | "RESTRICTED" | "WITHHELD";
  verificationPurpose: string;
  failureEffect: "WARNING" | "BLOCK_PUBLICATION" | "BLOCK_RELIANCE";
}

export interface IntegrityLineagePolicy {
  policyId: string;
  kind: IntegrityLineageLink["kind"];
  requiresParent: boolean;
  requiresRegistryTransition: boolean;
  permitsCanonicalReplacement: boolean;
  prospectiveRelianceEffect: "UNCHANGED" | "LIMITED" | "SUSPENDED" | "ENDED" | "SUPERSEDED";
  requirement: string;
}

export interface OfflineVerificationChecklistItem {
  checklistId: string;
  sequence: number;
  domain: IntegrityDomain;
  required: boolean;
  instruction: string;
  failureMessage: string;
}

export const INTEGRITY_COMPONENT_PROFILES: readonly IntegrityComponentProfile[] = [
  { profileId: "ICP-001", kind: "CANONICAL_JSON", label: "Canonical Json profile 001", mediaType: "application/json", requiredForPublicReliance: true, requiredForProductionClaim: true, defaultDisclosure: "RESTRICTED", verificationPurpose: "Preserve and verify canonical json integrity condition 001.", failureEffect: "BLOCK_RELIANCE" },
  { profileId: "ICP-002", kind: "PUBLIC_PDF", label: "Public Pdf profile 002", mediaType: "application/pdf", requiredForPublicReliance: true, requiredForProductionClaim: false, defaultDisclosure: "PUBLIC", verificationPurpose: "Preserve and verify public pdf integrity condition 002.", failureEffect: "BLOCK_PUBLICATION" },
  { profileId: "ICP-003", kind: "INTEGRITY_MANIFEST", label: "Integrity Manifest profile 003", mediaType: "application/json", requiredForPublicReliance: true, requiredForProductionClaim: true, defaultDisclosure: "RESTRICTED", verificationPurpose: "Preserve and verify integrity manifest integrity condition 003.", failureEffect: "BLOCK_RELIANCE" },
  { profileId: "ICP-004", kind: "ROUTE_SNAPSHOT", label: "Route Snapshot profile 004", mediaType: "application/json", requiredForPublicReliance: false, requiredForProductionClaim: true, defaultDisclosure: "RESTRICTED", verificationPurpose: "Preserve and verify route snapshot integrity condition 004.", failureEffect: "BLOCK_RELIANCE" },
  { profileId: "ICP-005", kind: "EXECUTION_RECEIPT", label: "Execution Receipt profile 005", mediaType: "application/json", requiredForPublicReliance: false, requiredForProductionClaim: true, defaultDisclosure: "RESTRICTED", verificationPurpose: "Preserve and verify execution receipt integrity condition 005.", failureEffect: "BLOCK_RELIANCE" },
  { profileId: "ICP-006", kind: "OUTCOME_CLOSURE", label: "Outcome Closure profile 006", mediaType: "application/json", requiredForPublicReliance: false, requiredForProductionClaim: true, defaultDisclosure: "RESTRICTED", verificationPurpose: "Preserve and verify outcome closure integrity condition 006.", failureEffect: "BLOCK_RELIANCE" },
  { profileId: "ICP-007", kind: "REGISTRY_RECORD", label: "Registry Record profile 007", mediaType: "application/json", requiredForPublicReliance: true, requiredForProductionClaim: true, defaultDisclosure: "RESTRICTED", verificationPurpose: "Preserve and verify registry record integrity condition 007.", failureEffect: "BLOCK_RELIANCE" },
  { profileId: "ICP-008", kind: "REGISTRY_CERTIFICATE", label: "Registry Certificate profile 008", mediaType: "application/json", requiredForPublicReliance: false, requiredForProductionClaim: false, defaultDisclosure: "PUBLIC", verificationPurpose: "Preserve and verify registry certificate integrity condition 008.", failureEffect: "WARNING" },
  { profileId: "ICP-009", kind: "VERIFICATION_REPORT", label: "Verification Report profile 009", mediaType: "application/json", requiredForPublicReliance: false, requiredForProductionClaim: false, defaultDisclosure: "SELECTIVE", verificationPurpose: "Preserve and verify verification report integrity condition 009.", failureEffect: "WARNING" },
  { profileId: "ICP-010", kind: "DISCLOSURE_PROJECTION", label: "Disclosure Projection profile 010", mediaType: "application/json", requiredForPublicReliance: false, requiredForProductionClaim: false, defaultDisclosure: "SELECTIVE", verificationPurpose: "Preserve and verify disclosure projection integrity condition 010.", failureEffect: "WARNING" },
  { profileId: "ICP-011", kind: "CLAIMS_BOUNDARY", label: "Claims Boundary profile 011", mediaType: "text/plain", requiredForPublicReliance: true, requiredForProductionClaim: false, defaultDisclosure: "PUBLIC", verificationPurpose: "Preserve and verify claims boundary integrity condition 011.", failureEffect: "BLOCK_PUBLICATION" },
  { profileId: "ICP-012", kind: "CHALLENGE_RECORD", label: "Challenge Record profile 012", mediaType: "application/json", requiredForPublicReliance: false, requiredForProductionClaim: false, defaultDisclosure: "RESTRICTED", verificationPurpose: "Preserve and verify challenge record integrity condition 012.", failureEffect: "WARNING" },
  { profileId: "ICP-013", kind: "CORRECTION_RECORD", label: "Correction Record profile 013", mediaType: "application/json", requiredForPublicReliance: false, requiredForProductionClaim: false, defaultDisclosure: "RESTRICTED", verificationPurpose: "Preserve and verify correction record integrity condition 013.", failureEffect: "WARNING" },
  { profileId: "ICP-014", kind: "SIGNATURE_ENVELOPE", label: "Signature Envelope profile 014", mediaType: "application/json", requiredForPublicReliance: false, requiredForProductionClaim: false, defaultDisclosure: "RESTRICTED", verificationPurpose: "Preserve and verify signature envelope integrity condition 014.", failureEffect: "WARNING" },
  { profileId: "ICP-015", kind: "OTHER", label: "Other profile 015", mediaType: "application/octet-stream", requiredForPublicReliance: false, requiredForProductionClaim: false, defaultDisclosure: "RESTRICTED", verificationPurpose: "Preserve and verify other integrity condition 015.", failureEffect: "WARNING" },
  { profileId: "ICP-016", kind: "CANONICAL_JSON", label: "Canonical Json profile 016", mediaType: "application/json", requiredForPublicReliance: true, requiredForProductionClaim: true, defaultDisclosure: "RESTRICTED", verificationPurpose: "Preserve and verify canonical json integrity condition 016.", failureEffect: "BLOCK_RELIANCE" },
  { profileId: "ICP-017", kind: "PUBLIC_PDF", label: "Public Pdf profile 017", mediaType: "application/pdf", requiredForPublicReliance: true, requiredForProductionClaim: false, defaultDisclosure: "PUBLIC", verificationPurpose: "Preserve and verify public pdf integrity condition 017.", failureEffect: "BLOCK_PUBLICATION" },
  { profileId: "ICP-018", kind: "INTEGRITY_MANIFEST", label: "Integrity Manifest profile 018", mediaType: "application/json", requiredForPublicReliance: true, requiredForProductionClaim: true, defaultDisclosure: "RESTRICTED", verificationPurpose: "Preserve and verify integrity manifest integrity condition 018.", failureEffect: "BLOCK_RELIANCE" },
  { profileId: "ICP-019", kind: "ROUTE_SNAPSHOT", label: "Route Snapshot profile 019", mediaType: "application/json", requiredForPublicReliance: false, requiredForProductionClaim: true, defaultDisclosure: "RESTRICTED", verificationPurpose: "Preserve and verify route snapshot integrity condition 019.", failureEffect: "BLOCK_RELIANCE" },
  { profileId: "ICP-020", kind: "EXECUTION_RECEIPT", label: "Execution Receipt profile 020", mediaType: "application/json", requiredForPublicReliance: false, requiredForProductionClaim: true, defaultDisclosure: "RESTRICTED", verificationPurpose: "Preserve and verify execution receipt integrity condition 020.", failureEffect: "BLOCK_RELIANCE" },
  { profileId: "ICP-021", kind: "OUTCOME_CLOSURE", label: "Outcome Closure profile 021", mediaType: "application/json", requiredForPublicReliance: false, requiredForProductionClaim: true, defaultDisclosure: "RESTRICTED", verificationPurpose: "Preserve and verify outcome closure integrity condition 021.", failureEffect: "BLOCK_RELIANCE" },
  { profileId: "ICP-022", kind: "REGISTRY_RECORD", label: "Registry Record profile 022", mediaType: "application/json", requiredForPublicReliance: true, requiredForProductionClaim: true, defaultDisclosure: "RESTRICTED", verificationPurpose: "Preserve and verify registry record integrity condition 022.", failureEffect: "BLOCK_RELIANCE" },
  { profileId: "ICP-023", kind: "REGISTRY_CERTIFICATE", label: "Registry Certificate profile 023", mediaType: "application/json", requiredForPublicReliance: false, requiredForProductionClaim: false, defaultDisclosure: "PUBLIC", verificationPurpose: "Preserve and verify registry certificate integrity condition 023.", failureEffect: "WARNING" },
  { profileId: "ICP-024", kind: "VERIFICATION_REPORT", label: "Verification Report profile 024", mediaType: "application/json", requiredForPublicReliance: false, requiredForProductionClaim: false, defaultDisclosure: "SELECTIVE", verificationPurpose: "Preserve and verify verification report integrity condition 024.", failureEffect: "WARNING" },
  { profileId: "ICP-025", kind: "DISCLOSURE_PROJECTION", label: "Disclosure Projection profile 025", mediaType: "application/json", requiredForPublicReliance: false, requiredForProductionClaim: false, defaultDisclosure: "SELECTIVE", verificationPurpose: "Preserve and verify disclosure projection integrity condition 025.", failureEffect: "WARNING" },
  { profileId: "ICP-026", kind: "CLAIMS_BOUNDARY", label: "Claims Boundary profile 026", mediaType: "text/plain", requiredForPublicReliance: true, requiredForProductionClaim: false, defaultDisclosure: "PUBLIC", verificationPurpose: "Preserve and verify claims boundary integrity condition 026.", failureEffect: "BLOCK_PUBLICATION" },
  { profileId: "ICP-027", kind: "CHALLENGE_RECORD", label: "Challenge Record profile 027", mediaType: "application/json", requiredForPublicReliance: false, requiredForProductionClaim: false, defaultDisclosure: "RESTRICTED", verificationPurpose: "Preserve and verify challenge record integrity condition 027.", failureEffect: "WARNING" },
  { profileId: "ICP-028", kind: "CORRECTION_RECORD", label: "Correction Record profile 028", mediaType: "application/json", requiredForPublicReliance: false, requiredForProductionClaim: false, defaultDisclosure: "RESTRICTED", verificationPurpose: "Preserve and verify correction record integrity condition 028.", failureEffect: "WARNING" },
  { profileId: "ICP-029", kind: "SIGNATURE_ENVELOPE", label: "Signature Envelope profile 029", mediaType: "application/json", requiredForPublicReliance: false, requiredForProductionClaim: false, defaultDisclosure: "RESTRICTED", verificationPurpose: "Preserve and verify signature envelope integrity condition 029.", failureEffect: "WARNING" },
  { profileId: "ICP-030", kind: "OTHER", label: "Other profile 030", mediaType: "application/octet-stream", requiredForPublicReliance: false, requiredForProductionClaim: false, defaultDisclosure: "RESTRICTED", verificationPurpose: "Preserve and verify other integrity condition 030.", failureEffect: "WARNING" },
  { profileId: "ICP-031", kind: "CANONICAL_JSON", label: "Canonical Json profile 031", mediaType: "application/json", requiredForPublicReliance: true, requiredForProductionClaim: true, defaultDisclosure: "RESTRICTED", verificationPurpose: "Preserve and verify canonical json integrity condition 031.", failureEffect: "BLOCK_RELIANCE" },
  { profileId: "ICP-032", kind: "PUBLIC_PDF", label: "Public Pdf profile 032", mediaType: "application/pdf", requiredForPublicReliance: true, requiredForProductionClaim: false, defaultDisclosure: "PUBLIC", verificationPurpose: "Preserve and verify public pdf integrity condition 032.", failureEffect: "BLOCK_PUBLICATION" },
  { profileId: "ICP-033", kind: "INTEGRITY_MANIFEST", label: "Integrity Manifest profile 033", mediaType: "application/json", requiredForPublicReliance: true, requiredForProductionClaim: true, defaultDisclosure: "RESTRICTED", verificationPurpose: "Preserve and verify integrity manifest integrity condition 033.", failureEffect: "BLOCK_RELIANCE" },
  { profileId: "ICP-034", kind: "ROUTE_SNAPSHOT", label: "Route Snapshot profile 034", mediaType: "application/json", requiredForPublicReliance: false, requiredForProductionClaim: true, defaultDisclosure: "RESTRICTED", verificationPurpose: "Preserve and verify route snapshot integrity condition 034.", failureEffect: "BLOCK_RELIANCE" },
  { profileId: "ICP-035", kind: "EXECUTION_RECEIPT", label: "Execution Receipt profile 035", mediaType: "application/json", requiredForPublicReliance: false, requiredForProductionClaim: true, defaultDisclosure: "RESTRICTED", verificationPurpose: "Preserve and verify execution receipt integrity condition 035.", failureEffect: "BLOCK_RELIANCE" },
  { profileId: "ICP-036", kind: "OUTCOME_CLOSURE", label: "Outcome Closure profile 036", mediaType: "application/json", requiredForPublicReliance: false, requiredForProductionClaim: true, defaultDisclosure: "RESTRICTED", verificationPurpose: "Preserve and verify outcome closure integrity condition 036.", failureEffect: "BLOCK_RELIANCE" },
  { profileId: "ICP-037", kind: "REGISTRY_RECORD", label: "Registry Record profile 037", mediaType: "application/json", requiredForPublicReliance: true, requiredForProductionClaim: true, defaultDisclosure: "RESTRICTED", verificationPurpose: "Preserve and verify registry record integrity condition 037.", failureEffect: "BLOCK_RELIANCE" },
  { profileId: "ICP-038", kind: "REGISTRY_CERTIFICATE", label: "Registry Certificate profile 038", mediaType: "application/json", requiredForPublicReliance: false, requiredForProductionClaim: false, defaultDisclosure: "PUBLIC", verificationPurpose: "Preserve and verify registry certificate integrity condition 038.", failureEffect: "WARNING" },
  { profileId: "ICP-039", kind: "VERIFICATION_REPORT", label: "Verification Report profile 039", mediaType: "application/json", requiredForPublicReliance: false, requiredForProductionClaim: false, defaultDisclosure: "SELECTIVE", verificationPurpose: "Preserve and verify verification report integrity condition 039.", failureEffect: "WARNING" },
  { profileId: "ICP-040", kind: "DISCLOSURE_PROJECTION", label: "Disclosure Projection profile 040", mediaType: "application/json", requiredForPublicReliance: false, requiredForProductionClaim: false, defaultDisclosure: "SELECTIVE", verificationPurpose: "Preserve and verify disclosure projection integrity condition 040.", failureEffect: "WARNING" },
  { profileId: "ICP-041", kind: "CLAIMS_BOUNDARY", label: "Claims Boundary profile 041", mediaType: "text/plain", requiredForPublicReliance: true, requiredForProductionClaim: false, defaultDisclosure: "PUBLIC", verificationPurpose: "Preserve and verify claims boundary integrity condition 041.", failureEffect: "BLOCK_PUBLICATION" },
  { profileId: "ICP-042", kind: "CHALLENGE_RECORD", label: "Challenge Record profile 042", mediaType: "application/json", requiredForPublicReliance: false, requiredForProductionClaim: false, defaultDisclosure: "RESTRICTED", verificationPurpose: "Preserve and verify challenge record integrity condition 042.", failureEffect: "WARNING" },
  { profileId: "ICP-043", kind: "CORRECTION_RECORD", label: "Correction Record profile 043", mediaType: "application/json", requiredForPublicReliance: false, requiredForProductionClaim: false, defaultDisclosure: "RESTRICTED", verificationPurpose: "Preserve and verify correction record integrity condition 043.", failureEffect: "WARNING" },
  { profileId: "ICP-044", kind: "SIGNATURE_ENVELOPE", label: "Signature Envelope profile 044", mediaType: "application/json", requiredForPublicReliance: false, requiredForProductionClaim: false, defaultDisclosure: "RESTRICTED", verificationPurpose: "Preserve and verify signature envelope integrity condition 044.", failureEffect: "WARNING" },
  { profileId: "ICP-045", kind: "OTHER", label: "Other profile 045", mediaType: "application/octet-stream", requiredForPublicReliance: false, requiredForProductionClaim: false, defaultDisclosure: "RESTRICTED", verificationPurpose: "Preserve and verify other integrity condition 045.", failureEffect: "WARNING" },
  { profileId: "ICP-046", kind: "CANONICAL_JSON", label: "Canonical Json profile 046", mediaType: "application/json", requiredForPublicReliance: true, requiredForProductionClaim: true, defaultDisclosure: "RESTRICTED", verificationPurpose: "Preserve and verify canonical json integrity condition 046.", failureEffect: "BLOCK_RELIANCE" },
  { profileId: "ICP-047", kind: "PUBLIC_PDF", label: "Public Pdf profile 047", mediaType: "application/pdf", requiredForPublicReliance: true, requiredForProductionClaim: false, defaultDisclosure: "PUBLIC", verificationPurpose: "Preserve and verify public pdf integrity condition 047.", failureEffect: "BLOCK_PUBLICATION" },
  { profileId: "ICP-048", kind: "INTEGRITY_MANIFEST", label: "Integrity Manifest profile 048", mediaType: "application/json", requiredForPublicReliance: true, requiredForProductionClaim: true, defaultDisclosure: "RESTRICTED", verificationPurpose: "Preserve and verify integrity manifest integrity condition 048.", failureEffect: "BLOCK_RELIANCE" },
  { profileId: "ICP-049", kind: "ROUTE_SNAPSHOT", label: "Route Snapshot profile 049", mediaType: "application/json", requiredForPublicReliance: false, requiredForProductionClaim: true, defaultDisclosure: "RESTRICTED", verificationPurpose: "Preserve and verify route snapshot integrity condition 049.", failureEffect: "BLOCK_RELIANCE" },
  { profileId: "ICP-050", kind: "EXECUTION_RECEIPT", label: "Execution Receipt profile 050", mediaType: "application/json", requiredForPublicReliance: false, requiredForProductionClaim: true, defaultDisclosure: "RESTRICTED", verificationPurpose: "Preserve and verify execution receipt integrity condition 050.", failureEffect: "BLOCK_RELIANCE" },
  { profileId: "ICP-051", kind: "OUTCOME_CLOSURE", label: "Outcome Closure profile 051", mediaType: "application/json", requiredForPublicReliance: false, requiredForProductionClaim: true, defaultDisclosure: "RESTRICTED", verificationPurpose: "Preserve and verify outcome closure integrity condition 051.", failureEffect: "BLOCK_RELIANCE" },
  { profileId: "ICP-052", kind: "REGISTRY_RECORD", label: "Registry Record profile 052", mediaType: "application/json", requiredForPublicReliance: true, requiredForProductionClaim: true, defaultDisclosure: "RESTRICTED", verificationPurpose: "Preserve and verify registry record integrity condition 052.", failureEffect: "BLOCK_RELIANCE" },
  { profileId: "ICP-053", kind: "REGISTRY_CERTIFICATE", label: "Registry Certificate profile 053", mediaType: "application/json", requiredForPublicReliance: false, requiredForProductionClaim: false, defaultDisclosure: "PUBLIC", verificationPurpose: "Preserve and verify registry certificate integrity condition 053.", failureEffect: "WARNING" },
  { profileId: "ICP-054", kind: "VERIFICATION_REPORT", label: "Verification Report profile 054", mediaType: "application/json", requiredForPublicReliance: false, requiredForProductionClaim: false, defaultDisclosure: "SELECTIVE", verificationPurpose: "Preserve and verify verification report integrity condition 054.", failureEffect: "WARNING" },
  { profileId: "ICP-055", kind: "DISCLOSURE_PROJECTION", label: "Disclosure Projection profile 055", mediaType: "application/json", requiredForPublicReliance: false, requiredForProductionClaim: false, defaultDisclosure: "SELECTIVE", verificationPurpose: "Preserve and verify disclosure projection integrity condition 055.", failureEffect: "WARNING" },
  { profileId: "ICP-056", kind: "CLAIMS_BOUNDARY", label: "Claims Boundary profile 056", mediaType: "text/plain", requiredForPublicReliance: true, requiredForProductionClaim: false, defaultDisclosure: "PUBLIC", verificationPurpose: "Preserve and verify claims boundary integrity condition 056.", failureEffect: "BLOCK_PUBLICATION" },
  { profileId: "ICP-057", kind: "CHALLENGE_RECORD", label: "Challenge Record profile 057", mediaType: "application/json", requiredForPublicReliance: false, requiredForProductionClaim: false, defaultDisclosure: "RESTRICTED", verificationPurpose: "Preserve and verify challenge record integrity condition 057.", failureEffect: "WARNING" },
  { profileId: "ICP-058", kind: "CORRECTION_RECORD", label: "Correction Record profile 058", mediaType: "application/json", requiredForPublicReliance: false, requiredForProductionClaim: false, defaultDisclosure: "RESTRICTED", verificationPurpose: "Preserve and verify correction record integrity condition 058.", failureEffect: "WARNING" },
  { profileId: "ICP-059", kind: "SIGNATURE_ENVELOPE", label: "Signature Envelope profile 059", mediaType: "application/json", requiredForPublicReliance: false, requiredForProductionClaim: false, defaultDisclosure: "RESTRICTED", verificationPurpose: "Preserve and verify signature envelope integrity condition 059.", failureEffect: "WARNING" },
  { profileId: "ICP-060", kind: "OTHER", label: "Other profile 060", mediaType: "application/octet-stream", requiredForPublicReliance: false, requiredForProductionClaim: false, defaultDisclosure: "RESTRICTED", verificationPurpose: "Preserve and verify other integrity condition 060.", failureEffect: "WARNING" },
  { profileId: "ICP-061", kind: "CANONICAL_JSON", label: "Canonical Json profile 061", mediaType: "application/json", requiredForPublicReliance: true, requiredForProductionClaim: true, defaultDisclosure: "RESTRICTED", verificationPurpose: "Preserve and verify canonical json integrity condition 061.", failureEffect: "BLOCK_RELIANCE" },
  { profileId: "ICP-062", kind: "PUBLIC_PDF", label: "Public Pdf profile 062", mediaType: "application/pdf", requiredForPublicReliance: true, requiredForProductionClaim: false, defaultDisclosure: "PUBLIC", verificationPurpose: "Preserve and verify public pdf integrity condition 062.", failureEffect: "BLOCK_PUBLICATION" },
  { profileId: "ICP-063", kind: "INTEGRITY_MANIFEST", label: "Integrity Manifest profile 063", mediaType: "application/json", requiredForPublicReliance: true, requiredForProductionClaim: true, defaultDisclosure: "RESTRICTED", verificationPurpose: "Preserve and verify integrity manifest integrity condition 063.", failureEffect: "BLOCK_RELIANCE" },
  { profileId: "ICP-064", kind: "ROUTE_SNAPSHOT", label: "Route Snapshot profile 064", mediaType: "application/json", requiredForPublicReliance: false, requiredForProductionClaim: true, defaultDisclosure: "RESTRICTED", verificationPurpose: "Preserve and verify route snapshot integrity condition 064.", failureEffect: "BLOCK_RELIANCE" },
  { profileId: "ICP-065", kind: "EXECUTION_RECEIPT", label: "Execution Receipt profile 065", mediaType: "application/json", requiredForPublicReliance: false, requiredForProductionClaim: true, defaultDisclosure: "RESTRICTED", verificationPurpose: "Preserve and verify execution receipt integrity condition 065.", failureEffect: "BLOCK_RELIANCE" },
  { profileId: "ICP-066", kind: "OUTCOME_CLOSURE", label: "Outcome Closure profile 066", mediaType: "application/json", requiredForPublicReliance: false, requiredForProductionClaim: true, defaultDisclosure: "RESTRICTED", verificationPurpose: "Preserve and verify outcome closure integrity condition 066.", failureEffect: "BLOCK_RELIANCE" },
  { profileId: "ICP-067", kind: "REGISTRY_RECORD", label: "Registry Record profile 067", mediaType: "application/json", requiredForPublicReliance: true, requiredForProductionClaim: true, defaultDisclosure: "RESTRICTED", verificationPurpose: "Preserve and verify registry record integrity condition 067.", failureEffect: "BLOCK_RELIANCE" },
  { profileId: "ICP-068", kind: "REGISTRY_CERTIFICATE", label: "Registry Certificate profile 068", mediaType: "application/json", requiredForPublicReliance: false, requiredForProductionClaim: false, defaultDisclosure: "PUBLIC", verificationPurpose: "Preserve and verify registry certificate integrity condition 068.", failureEffect: "WARNING" },
  { profileId: "ICP-069", kind: "VERIFICATION_REPORT", label: "Verification Report profile 069", mediaType: "application/json", requiredForPublicReliance: false, requiredForProductionClaim: false, defaultDisclosure: "SELECTIVE", verificationPurpose: "Preserve and verify verification report integrity condition 069.", failureEffect: "WARNING" },
  { profileId: "ICP-070", kind: "DISCLOSURE_PROJECTION", label: "Disclosure Projection profile 070", mediaType: "application/json", requiredForPublicReliance: false, requiredForProductionClaim: false, defaultDisclosure: "SELECTIVE", verificationPurpose: "Preserve and verify disclosure projection integrity condition 070.", failureEffect: "WARNING" },
  { profileId: "ICP-071", kind: "CLAIMS_BOUNDARY", label: "Claims Boundary profile 071", mediaType: "text/plain", requiredForPublicReliance: true, requiredForProductionClaim: false, defaultDisclosure: "PUBLIC", verificationPurpose: "Preserve and verify claims boundary integrity condition 071.", failureEffect: "BLOCK_PUBLICATION" },
  { profileId: "ICP-072", kind: "CHALLENGE_RECORD", label: "Challenge Record profile 072", mediaType: "application/json", requiredForPublicReliance: false, requiredForProductionClaim: false, defaultDisclosure: "RESTRICTED", verificationPurpose: "Preserve and verify challenge record integrity condition 072.", failureEffect: "WARNING" },
  { profileId: "ICP-073", kind: "CORRECTION_RECORD", label: "Correction Record profile 073", mediaType: "application/json", requiredForPublicReliance: false, requiredForProductionClaim: false, defaultDisclosure: "RESTRICTED", verificationPurpose: "Preserve and verify correction record integrity condition 073.", failureEffect: "WARNING" },
  { profileId: "ICP-074", kind: "SIGNATURE_ENVELOPE", label: "Signature Envelope profile 074", mediaType: "application/json", requiredForPublicReliance: false, requiredForProductionClaim: false, defaultDisclosure: "RESTRICTED", verificationPurpose: "Preserve and verify signature envelope integrity condition 074.", failureEffect: "WARNING" },
  { profileId: "ICP-075", kind: "OTHER", label: "Other profile 075", mediaType: "application/octet-stream", requiredForPublicReliance: false, requiredForProductionClaim: false, defaultDisclosure: "RESTRICTED", verificationPurpose: "Preserve and verify other integrity condition 075.", failureEffect: "WARNING" },
  { profileId: "ICP-076", kind: "CANONICAL_JSON", label: "Canonical Json profile 076", mediaType: "application/json", requiredForPublicReliance: true, requiredForProductionClaim: true, defaultDisclosure: "RESTRICTED", verificationPurpose: "Preserve and verify canonical json integrity condition 076.", failureEffect: "BLOCK_RELIANCE" },
  { profileId: "ICP-077", kind: "PUBLIC_PDF", label: "Public Pdf profile 077", mediaType: "application/pdf", requiredForPublicReliance: true, requiredForProductionClaim: false, defaultDisclosure: "PUBLIC", verificationPurpose: "Preserve and verify public pdf integrity condition 077.", failureEffect: "BLOCK_PUBLICATION" },
  { profileId: "ICP-078", kind: "INTEGRITY_MANIFEST", label: "Integrity Manifest profile 078", mediaType: "application/json", requiredForPublicReliance: true, requiredForProductionClaim: true, defaultDisclosure: "RESTRICTED", verificationPurpose: "Preserve and verify integrity manifest integrity condition 078.", failureEffect: "BLOCK_RELIANCE" },
  { profileId: "ICP-079", kind: "ROUTE_SNAPSHOT", label: "Route Snapshot profile 079", mediaType: "application/json", requiredForPublicReliance: false, requiredForProductionClaim: true, defaultDisclosure: "RESTRICTED", verificationPurpose: "Preserve and verify route snapshot integrity condition 079.", failureEffect: "BLOCK_RELIANCE" },
  { profileId: "ICP-080", kind: "EXECUTION_RECEIPT", label: "Execution Receipt profile 080", mediaType: "application/json", requiredForPublicReliance: false, requiredForProductionClaim: true, defaultDisclosure: "RESTRICTED", verificationPurpose: "Preserve and verify execution receipt integrity condition 080.", failureEffect: "BLOCK_RELIANCE" },
  { profileId: "ICP-081", kind: "OUTCOME_CLOSURE", label: "Outcome Closure profile 081", mediaType: "application/json", requiredForPublicReliance: false, requiredForProductionClaim: true, defaultDisclosure: "RESTRICTED", verificationPurpose: "Preserve and verify outcome closure integrity condition 081.", failureEffect: "BLOCK_RELIANCE" },
  { profileId: "ICP-082", kind: "REGISTRY_RECORD", label: "Registry Record profile 082", mediaType: "application/json", requiredForPublicReliance: true, requiredForProductionClaim: true, defaultDisclosure: "RESTRICTED", verificationPurpose: "Preserve and verify registry record integrity condition 082.", failureEffect: "BLOCK_RELIANCE" },
  { profileId: "ICP-083", kind: "REGISTRY_CERTIFICATE", label: "Registry Certificate profile 083", mediaType: "application/json", requiredForPublicReliance: false, requiredForProductionClaim: false, defaultDisclosure: "PUBLIC", verificationPurpose: "Preserve and verify registry certificate integrity condition 083.", failureEffect: "WARNING" },
  { profileId: "ICP-084", kind: "VERIFICATION_REPORT", label: "Verification Report profile 084", mediaType: "application/json", requiredForPublicReliance: false, requiredForProductionClaim: false, defaultDisclosure: "SELECTIVE", verificationPurpose: "Preserve and verify verification report integrity condition 084.", failureEffect: "WARNING" },
  { profileId: "ICP-085", kind: "DISCLOSURE_PROJECTION", label: "Disclosure Projection profile 085", mediaType: "application/json", requiredForPublicReliance: false, requiredForProductionClaim: false, defaultDisclosure: "SELECTIVE", verificationPurpose: "Preserve and verify disclosure projection integrity condition 085.", failureEffect: "WARNING" },
  { profileId: "ICP-086", kind: "CLAIMS_BOUNDARY", label: "Claims Boundary profile 086", mediaType: "text/plain", requiredForPublicReliance: true, requiredForProductionClaim: false, defaultDisclosure: "PUBLIC", verificationPurpose: "Preserve and verify claims boundary integrity condition 086.", failureEffect: "BLOCK_PUBLICATION" },
  { profileId: "ICP-087", kind: "CHALLENGE_RECORD", label: "Challenge Record profile 087", mediaType: "application/json", requiredForPublicReliance: false, requiredForProductionClaim: false, defaultDisclosure: "RESTRICTED", verificationPurpose: "Preserve and verify challenge record integrity condition 087.", failureEffect: "WARNING" },
  { profileId: "ICP-088", kind: "CORRECTION_RECORD", label: "Correction Record profile 088", mediaType: "application/json", requiredForPublicReliance: false, requiredForProductionClaim: false, defaultDisclosure: "RESTRICTED", verificationPurpose: "Preserve and verify correction record integrity condition 088.", failureEffect: "WARNING" },
  { profileId: "ICP-089", kind: "SIGNATURE_ENVELOPE", label: "Signature Envelope profile 089", mediaType: "application/json", requiredForPublicReliance: false, requiredForProductionClaim: false, defaultDisclosure: "RESTRICTED", verificationPurpose: "Preserve and verify signature envelope integrity condition 089.", failureEffect: "WARNING" },
  { profileId: "ICP-090", kind: "OTHER", label: "Other profile 090", mediaType: "application/octet-stream", requiredForPublicReliance: false, requiredForProductionClaim: false, defaultDisclosure: "RESTRICTED", verificationPurpose: "Preserve and verify other integrity condition 090.", failureEffect: "WARNING" },
  { profileId: "ICP-091", kind: "CANONICAL_JSON", label: "Canonical Json profile 091", mediaType: "application/json", requiredForPublicReliance: true, requiredForProductionClaim: true, defaultDisclosure: "RESTRICTED", verificationPurpose: "Preserve and verify canonical json integrity condition 091.", failureEffect: "BLOCK_RELIANCE" },
  { profileId: "ICP-092", kind: "PUBLIC_PDF", label: "Public Pdf profile 092", mediaType: "application/pdf", requiredForPublicReliance: true, requiredForProductionClaim: false, defaultDisclosure: "PUBLIC", verificationPurpose: "Preserve and verify public pdf integrity condition 092.", failureEffect: "BLOCK_PUBLICATION" },
  { profileId: "ICP-093", kind: "INTEGRITY_MANIFEST", label: "Integrity Manifest profile 093", mediaType: "application/json", requiredForPublicReliance: true, requiredForProductionClaim: true, defaultDisclosure: "RESTRICTED", verificationPurpose: "Preserve and verify integrity manifest integrity condition 093.", failureEffect: "BLOCK_RELIANCE" },
  { profileId: "ICP-094", kind: "ROUTE_SNAPSHOT", label: "Route Snapshot profile 094", mediaType: "application/json", requiredForPublicReliance: false, requiredForProductionClaim: true, defaultDisclosure: "RESTRICTED", verificationPurpose: "Preserve and verify route snapshot integrity condition 094.", failureEffect: "BLOCK_RELIANCE" },
  { profileId: "ICP-095", kind: "EXECUTION_RECEIPT", label: "Execution Receipt profile 095", mediaType: "application/json", requiredForPublicReliance: false, requiredForProductionClaim: true, defaultDisclosure: "RESTRICTED", verificationPurpose: "Preserve and verify execution receipt integrity condition 095.", failureEffect: "BLOCK_RELIANCE" },
  { profileId: "ICP-096", kind: "OUTCOME_CLOSURE", label: "Outcome Closure profile 096", mediaType: "application/json", requiredForPublicReliance: false, requiredForProductionClaim: true, defaultDisclosure: "RESTRICTED", verificationPurpose: "Preserve and verify outcome closure integrity condition 096.", failureEffect: "BLOCK_RELIANCE" },
  { profileId: "ICP-097", kind: "REGISTRY_RECORD", label: "Registry Record profile 097", mediaType: "application/json", requiredForPublicReliance: true, requiredForProductionClaim: true, defaultDisclosure: "RESTRICTED", verificationPurpose: "Preserve and verify registry record integrity condition 097.", failureEffect: "BLOCK_RELIANCE" },
  { profileId: "ICP-098", kind: "REGISTRY_CERTIFICATE", label: "Registry Certificate profile 098", mediaType: "application/json", requiredForPublicReliance: false, requiredForProductionClaim: false, defaultDisclosure: "PUBLIC", verificationPurpose: "Preserve and verify registry certificate integrity condition 098.", failureEffect: "WARNING" },
  { profileId: "ICP-099", kind: "VERIFICATION_REPORT", label: "Verification Report profile 099", mediaType: "application/json", requiredForPublicReliance: false, requiredForProductionClaim: false, defaultDisclosure: "SELECTIVE", verificationPurpose: "Preserve and verify verification report integrity condition 099.", failureEffect: "WARNING" },
  { profileId: "ICP-100", kind: "DISCLOSURE_PROJECTION", label: "Disclosure Projection profile 100", mediaType: "application/json", requiredForPublicReliance: false, requiredForProductionClaim: false, defaultDisclosure: "SELECTIVE", verificationPurpose: "Preserve and verify disclosure projection integrity condition 100.", failureEffect: "WARNING" },
  { profileId: "ICP-101", kind: "CLAIMS_BOUNDARY", label: "Claims Boundary profile 101", mediaType: "text/plain", requiredForPublicReliance: true, requiredForProductionClaim: false, defaultDisclosure: "PUBLIC", verificationPurpose: "Preserve and verify claims boundary integrity condition 101.", failureEffect: "BLOCK_PUBLICATION" },
  { profileId: "ICP-102", kind: "CHALLENGE_RECORD", label: "Challenge Record profile 102", mediaType: "application/json", requiredForPublicReliance: false, requiredForProductionClaim: false, defaultDisclosure: "RESTRICTED", verificationPurpose: "Preserve and verify challenge record integrity condition 102.", failureEffect: "WARNING" },
  { profileId: "ICP-103", kind: "CORRECTION_RECORD", label: "Correction Record profile 103", mediaType: "application/json", requiredForPublicReliance: false, requiredForProductionClaim: false, defaultDisclosure: "RESTRICTED", verificationPurpose: "Preserve and verify correction record integrity condition 103.", failureEffect: "WARNING" },
  { profileId: "ICP-104", kind: "SIGNATURE_ENVELOPE", label: "Signature Envelope profile 104", mediaType: "application/json", requiredForPublicReliance: false, requiredForProductionClaim: false, defaultDisclosure: "RESTRICTED", verificationPurpose: "Preserve and verify signature envelope integrity condition 104.", failureEffect: "WARNING" },
  { profileId: "ICP-105", kind: "OTHER", label: "Other profile 105", mediaType: "application/octet-stream", requiredForPublicReliance: false, requiredForProductionClaim: false, defaultDisclosure: "RESTRICTED", verificationPurpose: "Preserve and verify other integrity condition 105.", failureEffect: "WARNING" },
  { profileId: "ICP-106", kind: "CANONICAL_JSON", label: "Canonical Json profile 106", mediaType: "application/json", requiredForPublicReliance: true, requiredForProductionClaim: true, defaultDisclosure: "RESTRICTED", verificationPurpose: "Preserve and verify canonical json integrity condition 106.", failureEffect: "BLOCK_RELIANCE" },
  { profileId: "ICP-107", kind: "PUBLIC_PDF", label: "Public Pdf profile 107", mediaType: "application/pdf", requiredForPublicReliance: true, requiredForProductionClaim: false, defaultDisclosure: "PUBLIC", verificationPurpose: "Preserve and verify public pdf integrity condition 107.", failureEffect: "BLOCK_PUBLICATION" },
  { profileId: "ICP-108", kind: "INTEGRITY_MANIFEST", label: "Integrity Manifest profile 108", mediaType: "application/json", requiredForPublicReliance: true, requiredForProductionClaim: true, defaultDisclosure: "RESTRICTED", verificationPurpose: "Preserve and verify integrity manifest integrity condition 108.", failureEffect: "BLOCK_RELIANCE" },
  { profileId: "ICP-109", kind: "ROUTE_SNAPSHOT", label: "Route Snapshot profile 109", mediaType: "application/json", requiredForPublicReliance: false, requiredForProductionClaim: true, defaultDisclosure: "RESTRICTED", verificationPurpose: "Preserve and verify route snapshot integrity condition 109.", failureEffect: "BLOCK_RELIANCE" },
  { profileId: "ICP-110", kind: "EXECUTION_RECEIPT", label: "Execution Receipt profile 110", mediaType: "application/json", requiredForPublicReliance: false, requiredForProductionClaim: true, defaultDisclosure: "RESTRICTED", verificationPurpose: "Preserve and verify execution receipt integrity condition 110.", failureEffect: "BLOCK_RELIANCE" },
  { profileId: "ICP-111", kind: "OUTCOME_CLOSURE", label: "Outcome Closure profile 111", mediaType: "application/json", requiredForPublicReliance: false, requiredForProductionClaim: true, defaultDisclosure: "RESTRICTED", verificationPurpose: "Preserve and verify outcome closure integrity condition 111.", failureEffect: "BLOCK_RELIANCE" },
  { profileId: "ICP-112", kind: "REGISTRY_RECORD", label: "Registry Record profile 112", mediaType: "application/json", requiredForPublicReliance: true, requiredForProductionClaim: true, defaultDisclosure: "RESTRICTED", verificationPurpose: "Preserve and verify registry record integrity condition 112.", failureEffect: "BLOCK_RELIANCE" },
  { profileId: "ICP-113", kind: "REGISTRY_CERTIFICATE", label: "Registry Certificate profile 113", mediaType: "application/json", requiredForPublicReliance: false, requiredForProductionClaim: false, defaultDisclosure: "PUBLIC", verificationPurpose: "Preserve and verify registry certificate integrity condition 113.", failureEffect: "WARNING" },
  { profileId: "ICP-114", kind: "VERIFICATION_REPORT", label: "Verification Report profile 114", mediaType: "application/json", requiredForPublicReliance: false, requiredForProductionClaim: false, defaultDisclosure: "SELECTIVE", verificationPurpose: "Preserve and verify verification report integrity condition 114.", failureEffect: "WARNING" },
  { profileId: "ICP-115", kind: "DISCLOSURE_PROJECTION", label: "Disclosure Projection profile 115", mediaType: "application/json", requiredForPublicReliance: false, requiredForProductionClaim: false, defaultDisclosure: "SELECTIVE", verificationPurpose: "Preserve and verify disclosure projection integrity condition 115.", failureEffect: "WARNING" },
  { profileId: "ICP-116", kind: "CLAIMS_BOUNDARY", label: "Claims Boundary profile 116", mediaType: "text/plain", requiredForPublicReliance: true, requiredForProductionClaim: false, defaultDisclosure: "PUBLIC", verificationPurpose: "Preserve and verify claims boundary integrity condition 116.", failureEffect: "BLOCK_PUBLICATION" },
  { profileId: "ICP-117", kind: "CHALLENGE_RECORD", label: "Challenge Record profile 117", mediaType: "application/json", requiredForPublicReliance: false, requiredForProductionClaim: false, defaultDisclosure: "RESTRICTED", verificationPurpose: "Preserve and verify challenge record integrity condition 117.", failureEffect: "WARNING" },
  { profileId: "ICP-118", kind: "CORRECTION_RECORD", label: "Correction Record profile 118", mediaType: "application/json", requiredForPublicReliance: false, requiredForProductionClaim: false, defaultDisclosure: "RESTRICTED", verificationPurpose: "Preserve and verify correction record integrity condition 118.", failureEffect: "WARNING" },
  { profileId: "ICP-119", kind: "SIGNATURE_ENVELOPE", label: "Signature Envelope profile 119", mediaType: "application/json", requiredForPublicReliance: false, requiredForProductionClaim: false, defaultDisclosure: "RESTRICTED", verificationPurpose: "Preserve and verify signature envelope integrity condition 119.", failureEffect: "WARNING" },
  { profileId: "ICP-120", kind: "OTHER", label: "Other profile 120", mediaType: "application/octet-stream", requiredForPublicReliance: false, requiredForProductionClaim: false, defaultDisclosure: "RESTRICTED", verificationPurpose: "Preserve and verify other integrity condition 120.", failureEffect: "WARNING" },
] as const;

export const INTEGRITY_LINEAGE_POLICIES: readonly IntegrityLineagePolicy[] = [
  { policyId: "ILP-001", kind: "ORIGINAL", requiresParent: false, requiresRegistryTransition: false, permitsCanonicalReplacement: false, prospectiveRelianceEffect: "UNCHANGED", requirement: "Apply append-only original lineage policy 001; preserve the original digest and attributable transition." },
  { policyId: "ILP-002", kind: "AMENDMENT", requiresParent: true, requiresRegistryTransition: false, permitsCanonicalReplacement: false, prospectiveRelianceEffect: "LIMITED", requirement: "Apply append-only amendment lineage policy 002; preserve the original digest and attributable transition." },
  { policyId: "ILP-003", kind: "CORRECTION", requiresParent: true, requiresRegistryTransition: true, permitsCanonicalReplacement: false, prospectiveRelianceEffect: "LIMITED", requirement: "Apply append-only correction lineage policy 003; preserve the original digest and attributable transition." },
  { policyId: "ILP-004", kind: "SUPERSESSION", requiresParent: true, requiresRegistryTransition: true, permitsCanonicalReplacement: false, prospectiveRelianceEffect: "SUPERSEDED", requirement: "Apply append-only supersession lineage policy 004; preserve the original digest and attributable transition." },
  { policyId: "ILP-005", kind: "WITHDRAWAL", requiresParent: true, requiresRegistryTransition: true, permitsCanonicalReplacement: false, prospectiveRelianceEffect: "ENDED", requirement: "Apply append-only withdrawal lineage policy 005; preserve the original digest and attributable transition." },
  { policyId: "ILP-006", kind: "CHALLENGE", requiresParent: true, requiresRegistryTransition: true, permitsCanonicalReplacement: false, prospectiveRelianceEffect: "SUSPENDED", requirement: "Apply append-only challenge lineage policy 006; preserve the original digest and attributable transition." },
  { policyId: "ILP-007", kind: "VERIFICATION", requiresParent: true, requiresRegistryTransition: false, permitsCanonicalReplacement: false, prospectiveRelianceEffect: "UNCHANGED", requirement: "Apply append-only verification lineage policy 007; preserve the original digest and attributable transition." },
  { policyId: "ILP-008", kind: "REGISTRY_UPDATE", requiresParent: true, requiresRegistryTransition: true, permitsCanonicalReplacement: false, prospectiveRelianceEffect: "UNCHANGED", requirement: "Apply append-only registry_update lineage policy 008; preserve the original digest and attributable transition." },
  { policyId: "ILP-009", kind: "ORIGINAL", requiresParent: false, requiresRegistryTransition: false, permitsCanonicalReplacement: false, prospectiveRelianceEffect: "UNCHANGED", requirement: "Apply append-only original lineage policy 009; preserve the original digest and attributable transition." },
  { policyId: "ILP-010", kind: "AMENDMENT", requiresParent: true, requiresRegistryTransition: false, permitsCanonicalReplacement: false, prospectiveRelianceEffect: "LIMITED", requirement: "Apply append-only amendment lineage policy 010; preserve the original digest and attributable transition." },
  { policyId: "ILP-011", kind: "CORRECTION", requiresParent: true, requiresRegistryTransition: true, permitsCanonicalReplacement: false, prospectiveRelianceEffect: "LIMITED", requirement: "Apply append-only correction lineage policy 011; preserve the original digest and attributable transition." },
  { policyId: "ILP-012", kind: "SUPERSESSION", requiresParent: true, requiresRegistryTransition: true, permitsCanonicalReplacement: false, prospectiveRelianceEffect: "SUPERSEDED", requirement: "Apply append-only supersession lineage policy 012; preserve the original digest and attributable transition." },
  { policyId: "ILP-013", kind: "WITHDRAWAL", requiresParent: true, requiresRegistryTransition: true, permitsCanonicalReplacement: false, prospectiveRelianceEffect: "ENDED", requirement: "Apply append-only withdrawal lineage policy 013; preserve the original digest and attributable transition." },
  { policyId: "ILP-014", kind: "CHALLENGE", requiresParent: true, requiresRegistryTransition: true, permitsCanonicalReplacement: false, prospectiveRelianceEffect: "SUSPENDED", requirement: "Apply append-only challenge lineage policy 014; preserve the original digest and attributable transition." },
  { policyId: "ILP-015", kind: "VERIFICATION", requiresParent: true, requiresRegistryTransition: false, permitsCanonicalReplacement: false, prospectiveRelianceEffect: "UNCHANGED", requirement: "Apply append-only verification lineage policy 015; preserve the original digest and attributable transition." },
  { policyId: "ILP-016", kind: "REGISTRY_UPDATE", requiresParent: true, requiresRegistryTransition: true, permitsCanonicalReplacement: false, prospectiveRelianceEffect: "UNCHANGED", requirement: "Apply append-only registry_update lineage policy 016; preserve the original digest and attributable transition." },
  { policyId: "ILP-017", kind: "ORIGINAL", requiresParent: false, requiresRegistryTransition: false, permitsCanonicalReplacement: false, prospectiveRelianceEffect: "UNCHANGED", requirement: "Apply append-only original lineage policy 017; preserve the original digest and attributable transition." },
  { policyId: "ILP-018", kind: "AMENDMENT", requiresParent: true, requiresRegistryTransition: false, permitsCanonicalReplacement: false, prospectiveRelianceEffect: "LIMITED", requirement: "Apply append-only amendment lineage policy 018; preserve the original digest and attributable transition." },
  { policyId: "ILP-019", kind: "CORRECTION", requiresParent: true, requiresRegistryTransition: true, permitsCanonicalReplacement: false, prospectiveRelianceEffect: "LIMITED", requirement: "Apply append-only correction lineage policy 019; preserve the original digest and attributable transition." },
  { policyId: "ILP-020", kind: "SUPERSESSION", requiresParent: true, requiresRegistryTransition: true, permitsCanonicalReplacement: false, prospectiveRelianceEffect: "SUPERSEDED", requirement: "Apply append-only supersession lineage policy 020; preserve the original digest and attributable transition." },
  { policyId: "ILP-021", kind: "WITHDRAWAL", requiresParent: true, requiresRegistryTransition: true, permitsCanonicalReplacement: false, prospectiveRelianceEffect: "ENDED", requirement: "Apply append-only withdrawal lineage policy 021; preserve the original digest and attributable transition." },
  { policyId: "ILP-022", kind: "CHALLENGE", requiresParent: true, requiresRegistryTransition: true, permitsCanonicalReplacement: false, prospectiveRelianceEffect: "SUSPENDED", requirement: "Apply append-only challenge lineage policy 022; preserve the original digest and attributable transition." },
  { policyId: "ILP-023", kind: "VERIFICATION", requiresParent: true, requiresRegistryTransition: false, permitsCanonicalReplacement: false, prospectiveRelianceEffect: "UNCHANGED", requirement: "Apply append-only verification lineage policy 023; preserve the original digest and attributable transition." },
  { policyId: "ILP-024", kind: "REGISTRY_UPDATE", requiresParent: true, requiresRegistryTransition: true, permitsCanonicalReplacement: false, prospectiveRelianceEffect: "UNCHANGED", requirement: "Apply append-only registry_update lineage policy 024; preserve the original digest and attributable transition." },
  { policyId: "ILP-025", kind: "ORIGINAL", requiresParent: false, requiresRegistryTransition: false, permitsCanonicalReplacement: false, prospectiveRelianceEffect: "UNCHANGED", requirement: "Apply append-only original lineage policy 025; preserve the original digest and attributable transition." },
  { policyId: "ILP-026", kind: "AMENDMENT", requiresParent: true, requiresRegistryTransition: false, permitsCanonicalReplacement: false, prospectiveRelianceEffect: "LIMITED", requirement: "Apply append-only amendment lineage policy 026; preserve the original digest and attributable transition." },
  { policyId: "ILP-027", kind: "CORRECTION", requiresParent: true, requiresRegistryTransition: true, permitsCanonicalReplacement: false, prospectiveRelianceEffect: "LIMITED", requirement: "Apply append-only correction lineage policy 027; preserve the original digest and attributable transition." },
  { policyId: "ILP-028", kind: "SUPERSESSION", requiresParent: true, requiresRegistryTransition: true, permitsCanonicalReplacement: false, prospectiveRelianceEffect: "SUPERSEDED", requirement: "Apply append-only supersession lineage policy 028; preserve the original digest and attributable transition." },
  { policyId: "ILP-029", kind: "WITHDRAWAL", requiresParent: true, requiresRegistryTransition: true, permitsCanonicalReplacement: false, prospectiveRelianceEffect: "ENDED", requirement: "Apply append-only withdrawal lineage policy 029; preserve the original digest and attributable transition." },
  { policyId: "ILP-030", kind: "CHALLENGE", requiresParent: true, requiresRegistryTransition: true, permitsCanonicalReplacement: false, prospectiveRelianceEffect: "SUSPENDED", requirement: "Apply append-only challenge lineage policy 030; preserve the original digest and attributable transition." },
  { policyId: "ILP-031", kind: "VERIFICATION", requiresParent: true, requiresRegistryTransition: false, permitsCanonicalReplacement: false, prospectiveRelianceEffect: "UNCHANGED", requirement: "Apply append-only verification lineage policy 031; preserve the original digest and attributable transition." },
  { policyId: "ILP-032", kind: "REGISTRY_UPDATE", requiresParent: true, requiresRegistryTransition: true, permitsCanonicalReplacement: false, prospectiveRelianceEffect: "UNCHANGED", requirement: "Apply append-only registry_update lineage policy 032; preserve the original digest and attributable transition." },
  { policyId: "ILP-033", kind: "ORIGINAL", requiresParent: false, requiresRegistryTransition: false, permitsCanonicalReplacement: false, prospectiveRelianceEffect: "UNCHANGED", requirement: "Apply append-only original lineage policy 033; preserve the original digest and attributable transition." },
  { policyId: "ILP-034", kind: "AMENDMENT", requiresParent: true, requiresRegistryTransition: false, permitsCanonicalReplacement: false, prospectiveRelianceEffect: "LIMITED", requirement: "Apply append-only amendment lineage policy 034; preserve the original digest and attributable transition." },
  { policyId: "ILP-035", kind: "CORRECTION", requiresParent: true, requiresRegistryTransition: true, permitsCanonicalReplacement: false, prospectiveRelianceEffect: "LIMITED", requirement: "Apply append-only correction lineage policy 035; preserve the original digest and attributable transition." },
  { policyId: "ILP-036", kind: "SUPERSESSION", requiresParent: true, requiresRegistryTransition: true, permitsCanonicalReplacement: false, prospectiveRelianceEffect: "SUPERSEDED", requirement: "Apply append-only supersession lineage policy 036; preserve the original digest and attributable transition." },
  { policyId: "ILP-037", kind: "WITHDRAWAL", requiresParent: true, requiresRegistryTransition: true, permitsCanonicalReplacement: false, prospectiveRelianceEffect: "ENDED", requirement: "Apply append-only withdrawal lineage policy 037; preserve the original digest and attributable transition." },
  { policyId: "ILP-038", kind: "CHALLENGE", requiresParent: true, requiresRegistryTransition: true, permitsCanonicalReplacement: false, prospectiveRelianceEffect: "SUSPENDED", requirement: "Apply append-only challenge lineage policy 038; preserve the original digest and attributable transition." },
  { policyId: "ILP-039", kind: "VERIFICATION", requiresParent: true, requiresRegistryTransition: false, permitsCanonicalReplacement: false, prospectiveRelianceEffect: "UNCHANGED", requirement: "Apply append-only verification lineage policy 039; preserve the original digest and attributable transition." },
  { policyId: "ILP-040", kind: "REGISTRY_UPDATE", requiresParent: true, requiresRegistryTransition: true, permitsCanonicalReplacement: false, prospectiveRelianceEffect: "UNCHANGED", requirement: "Apply append-only registry_update lineage policy 040; preserve the original digest and attributable transition." },
  { policyId: "ILP-041", kind: "ORIGINAL", requiresParent: false, requiresRegistryTransition: false, permitsCanonicalReplacement: false, prospectiveRelianceEffect: "UNCHANGED", requirement: "Apply append-only original lineage policy 041; preserve the original digest and attributable transition." },
  { policyId: "ILP-042", kind: "AMENDMENT", requiresParent: true, requiresRegistryTransition: false, permitsCanonicalReplacement: false, prospectiveRelianceEffect: "LIMITED", requirement: "Apply append-only amendment lineage policy 042; preserve the original digest and attributable transition." },
  { policyId: "ILP-043", kind: "CORRECTION", requiresParent: true, requiresRegistryTransition: true, permitsCanonicalReplacement: false, prospectiveRelianceEffect: "LIMITED", requirement: "Apply append-only correction lineage policy 043; preserve the original digest and attributable transition." },
  { policyId: "ILP-044", kind: "SUPERSESSION", requiresParent: true, requiresRegistryTransition: true, permitsCanonicalReplacement: false, prospectiveRelianceEffect: "SUPERSEDED", requirement: "Apply append-only supersession lineage policy 044; preserve the original digest and attributable transition." },
  { policyId: "ILP-045", kind: "WITHDRAWAL", requiresParent: true, requiresRegistryTransition: true, permitsCanonicalReplacement: false, prospectiveRelianceEffect: "ENDED", requirement: "Apply append-only withdrawal lineage policy 045; preserve the original digest and attributable transition." },
  { policyId: "ILP-046", kind: "CHALLENGE", requiresParent: true, requiresRegistryTransition: true, permitsCanonicalReplacement: false, prospectiveRelianceEffect: "SUSPENDED", requirement: "Apply append-only challenge lineage policy 046; preserve the original digest and attributable transition." },
  { policyId: "ILP-047", kind: "VERIFICATION", requiresParent: true, requiresRegistryTransition: false, permitsCanonicalReplacement: false, prospectiveRelianceEffect: "UNCHANGED", requirement: "Apply append-only verification lineage policy 047; preserve the original digest and attributable transition." },
  { policyId: "ILP-048", kind: "REGISTRY_UPDATE", requiresParent: true, requiresRegistryTransition: true, permitsCanonicalReplacement: false, prospectiveRelianceEffect: "UNCHANGED", requirement: "Apply append-only registry_update lineage policy 048; preserve the original digest and attributable transition." },
  { policyId: "ILP-049", kind: "ORIGINAL", requiresParent: false, requiresRegistryTransition: false, permitsCanonicalReplacement: false, prospectiveRelianceEffect: "UNCHANGED", requirement: "Apply append-only original lineage policy 049; preserve the original digest and attributable transition." },
  { policyId: "ILP-050", kind: "AMENDMENT", requiresParent: true, requiresRegistryTransition: false, permitsCanonicalReplacement: false, prospectiveRelianceEffect: "LIMITED", requirement: "Apply append-only amendment lineage policy 050; preserve the original digest and attributable transition." },
  { policyId: "ILP-051", kind: "CORRECTION", requiresParent: true, requiresRegistryTransition: true, permitsCanonicalReplacement: false, prospectiveRelianceEffect: "LIMITED", requirement: "Apply append-only correction lineage policy 051; preserve the original digest and attributable transition." },
  { policyId: "ILP-052", kind: "SUPERSESSION", requiresParent: true, requiresRegistryTransition: true, permitsCanonicalReplacement: false, prospectiveRelianceEffect: "SUPERSEDED", requirement: "Apply append-only supersession lineage policy 052; preserve the original digest and attributable transition." },
  { policyId: "ILP-053", kind: "WITHDRAWAL", requiresParent: true, requiresRegistryTransition: true, permitsCanonicalReplacement: false, prospectiveRelianceEffect: "ENDED", requirement: "Apply append-only withdrawal lineage policy 053; preserve the original digest and attributable transition." },
  { policyId: "ILP-054", kind: "CHALLENGE", requiresParent: true, requiresRegistryTransition: true, permitsCanonicalReplacement: false, prospectiveRelianceEffect: "SUSPENDED", requirement: "Apply append-only challenge lineage policy 054; preserve the original digest and attributable transition." },
  { policyId: "ILP-055", kind: "VERIFICATION", requiresParent: true, requiresRegistryTransition: false, permitsCanonicalReplacement: false, prospectiveRelianceEffect: "UNCHANGED", requirement: "Apply append-only verification lineage policy 055; preserve the original digest and attributable transition." },
  { policyId: "ILP-056", kind: "REGISTRY_UPDATE", requiresParent: true, requiresRegistryTransition: true, permitsCanonicalReplacement: false, prospectiveRelianceEffect: "UNCHANGED", requirement: "Apply append-only registry_update lineage policy 056; preserve the original digest and attributable transition." },
  { policyId: "ILP-057", kind: "ORIGINAL", requiresParent: false, requiresRegistryTransition: false, permitsCanonicalReplacement: false, prospectiveRelianceEffect: "UNCHANGED", requirement: "Apply append-only original lineage policy 057; preserve the original digest and attributable transition." },
  { policyId: "ILP-058", kind: "AMENDMENT", requiresParent: true, requiresRegistryTransition: false, permitsCanonicalReplacement: false, prospectiveRelianceEffect: "LIMITED", requirement: "Apply append-only amendment lineage policy 058; preserve the original digest and attributable transition." },
  { policyId: "ILP-059", kind: "CORRECTION", requiresParent: true, requiresRegistryTransition: true, permitsCanonicalReplacement: false, prospectiveRelianceEffect: "LIMITED", requirement: "Apply append-only correction lineage policy 059; preserve the original digest and attributable transition." },
  { policyId: "ILP-060", kind: "SUPERSESSION", requiresParent: true, requiresRegistryTransition: true, permitsCanonicalReplacement: false, prospectiveRelianceEffect: "SUPERSEDED", requirement: "Apply append-only supersession lineage policy 060; preserve the original digest and attributable transition." },
  { policyId: "ILP-061", kind: "WITHDRAWAL", requiresParent: true, requiresRegistryTransition: true, permitsCanonicalReplacement: false, prospectiveRelianceEffect: "ENDED", requirement: "Apply append-only withdrawal lineage policy 061; preserve the original digest and attributable transition." },
  { policyId: "ILP-062", kind: "CHALLENGE", requiresParent: true, requiresRegistryTransition: true, permitsCanonicalReplacement: false, prospectiveRelianceEffect: "SUSPENDED", requirement: "Apply append-only challenge lineage policy 062; preserve the original digest and attributable transition." },
  { policyId: "ILP-063", kind: "VERIFICATION", requiresParent: true, requiresRegistryTransition: false, permitsCanonicalReplacement: false, prospectiveRelianceEffect: "UNCHANGED", requirement: "Apply append-only verification lineage policy 063; preserve the original digest and attributable transition." },
  { policyId: "ILP-064", kind: "REGISTRY_UPDATE", requiresParent: true, requiresRegistryTransition: true, permitsCanonicalReplacement: false, prospectiveRelianceEffect: "UNCHANGED", requirement: "Apply append-only registry_update lineage policy 064; preserve the original digest and attributable transition." },
  { policyId: "ILP-065", kind: "ORIGINAL", requiresParent: false, requiresRegistryTransition: false, permitsCanonicalReplacement: false, prospectiveRelianceEffect: "UNCHANGED", requirement: "Apply append-only original lineage policy 065; preserve the original digest and attributable transition." },
  { policyId: "ILP-066", kind: "AMENDMENT", requiresParent: true, requiresRegistryTransition: false, permitsCanonicalReplacement: false, prospectiveRelianceEffect: "LIMITED", requirement: "Apply append-only amendment lineage policy 066; preserve the original digest and attributable transition." },
  { policyId: "ILP-067", kind: "CORRECTION", requiresParent: true, requiresRegistryTransition: true, permitsCanonicalReplacement: false, prospectiveRelianceEffect: "LIMITED", requirement: "Apply append-only correction lineage policy 067; preserve the original digest and attributable transition." },
  { policyId: "ILP-068", kind: "SUPERSESSION", requiresParent: true, requiresRegistryTransition: true, permitsCanonicalReplacement: false, prospectiveRelianceEffect: "SUPERSEDED", requirement: "Apply append-only supersession lineage policy 068; preserve the original digest and attributable transition." },
  { policyId: "ILP-069", kind: "WITHDRAWAL", requiresParent: true, requiresRegistryTransition: true, permitsCanonicalReplacement: false, prospectiveRelianceEffect: "ENDED", requirement: "Apply append-only withdrawal lineage policy 069; preserve the original digest and attributable transition." },
  { policyId: "ILP-070", kind: "CHALLENGE", requiresParent: true, requiresRegistryTransition: true, permitsCanonicalReplacement: false, prospectiveRelianceEffect: "SUSPENDED", requirement: "Apply append-only challenge lineage policy 070; preserve the original digest and attributable transition." },
  { policyId: "ILP-071", kind: "VERIFICATION", requiresParent: true, requiresRegistryTransition: false, permitsCanonicalReplacement: false, prospectiveRelianceEffect: "UNCHANGED", requirement: "Apply append-only verification lineage policy 071; preserve the original digest and attributable transition." },
  { policyId: "ILP-072", kind: "REGISTRY_UPDATE", requiresParent: true, requiresRegistryTransition: true, permitsCanonicalReplacement: false, prospectiveRelianceEffect: "UNCHANGED", requirement: "Apply append-only registry_update lineage policy 072; preserve the original digest and attributable transition." },
] as const;

export const OFFLINE_VERIFICATION_CHECKLIST: readonly OfflineVerificationChecklistItem[] = [
  { checklistId: "OVC-001", sequence: 1, domain: "CANONICAL", required: true, instruction: "Perform offline canonical verification step 001 using the published canonicalization and SHA-256 rules.", failureMessage: "Offline verification step 001 did not establish the required canonical integrity condition." },
  { checklistId: "OVC-002", sequence: 2, domain: "COMPONENT", required: true, instruction: "Perform offline component verification step 002 using the published canonicalization and SHA-256 rules.", failureMessage: "Offline verification step 002 did not establish the required component integrity condition." },
  { checklistId: "OVC-003", sequence: 3, domain: "PACKAGE", required: true, instruction: "Perform offline package verification step 003 using the published canonicalization and SHA-256 rules.", failureMessage: "Offline verification step 003 did not establish the required package integrity condition." },
  { checklistId: "OVC-004", sequence: 4, domain: "MANIFEST", required: true, instruction: "Perform offline manifest verification step 004 using the published canonicalization and SHA-256 rules.", failureMessage: "Offline verification step 004 did not establish the required manifest integrity condition." },
  { checklistId: "OVC-005", sequence: 5, domain: "LINEAGE", required: true, instruction: "Perform offline lineage verification step 005 using the published canonicalization and SHA-256 rules.", failureMessage: "Offline verification step 005 did not establish the required lineage integrity condition." },
  { checklistId: "OVC-006", sequence: 6, domain: "AUDIT", required: true, instruction: "Perform offline audit verification step 006 using the published canonicalization and SHA-256 rules.", failureMessage: "Offline verification step 006 did not establish the required audit integrity condition." },
  { checklistId: "OVC-007", sequence: 7, domain: "OFFLINE", required: true, instruction: "Perform offline offline verification step 007 using the published canonicalization and SHA-256 rules.", failureMessage: "Offline verification step 007 did not establish the required offline integrity condition." },
  { checklistId: "OVC-008", sequence: 8, domain: "PUBLICATION", required: true, instruction: "Perform offline publication verification step 008 using the published canonicalization and SHA-256 rules.", failureMessage: "Offline verification step 008 did not establish the required publication integrity condition." },
  { checklistId: "OVC-009", sequence: 9, domain: "CANONICAL", required: true, instruction: "Perform offline canonical verification step 009 using the published canonicalization and SHA-256 rules.", failureMessage: "Offline verification step 009 did not establish the required canonical integrity condition." },
  { checklistId: "OVC-010", sequence: 10, domain: "COMPONENT", required: true, instruction: "Perform offline component verification step 010 using the published canonicalization and SHA-256 rules.", failureMessage: "Offline verification step 010 did not establish the required component integrity condition." },
  { checklistId: "OVC-011", sequence: 11, domain: "PACKAGE", required: true, instruction: "Perform offline package verification step 011 using the published canonicalization and SHA-256 rules.", failureMessage: "Offline verification step 011 did not establish the required package integrity condition." },
  { checklistId: "OVC-012", sequence: 12, domain: "MANIFEST", required: true, instruction: "Perform offline manifest verification step 012 using the published canonicalization and SHA-256 rules.", failureMessage: "Offline verification step 012 did not establish the required manifest integrity condition." },
  { checklistId: "OVC-013", sequence: 13, domain: "LINEAGE", required: true, instruction: "Perform offline lineage verification step 013 using the published canonicalization and SHA-256 rules.", failureMessage: "Offline verification step 013 did not establish the required lineage integrity condition." },
  { checklistId: "OVC-014", sequence: 14, domain: "AUDIT", required: true, instruction: "Perform offline audit verification step 014 using the published canonicalization and SHA-256 rules.", failureMessage: "Offline verification step 014 did not establish the required audit integrity condition." },
  { checklistId: "OVC-015", sequence: 15, domain: "OFFLINE", required: true, instruction: "Perform offline offline verification step 015 using the published canonicalization and SHA-256 rules.", failureMessage: "Offline verification step 015 did not establish the required offline integrity condition." },
  { checklistId: "OVC-016", sequence: 16, domain: "PUBLICATION", required: true, instruction: "Perform offline publication verification step 016 using the published canonicalization and SHA-256 rules.", failureMessage: "Offline verification step 016 did not establish the required publication integrity condition." },
  { checklistId: "OVC-017", sequence: 17, domain: "CANONICAL", required: true, instruction: "Perform offline canonical verification step 017 using the published canonicalization and SHA-256 rules.", failureMessage: "Offline verification step 017 did not establish the required canonical integrity condition." },
  { checklistId: "OVC-018", sequence: 18, domain: "COMPONENT", required: true, instruction: "Perform offline component verification step 018 using the published canonicalization and SHA-256 rules.", failureMessage: "Offline verification step 018 did not establish the required component integrity condition." },
  { checklistId: "OVC-019", sequence: 19, domain: "PACKAGE", required: true, instruction: "Perform offline package verification step 019 using the published canonicalization and SHA-256 rules.", failureMessage: "Offline verification step 019 did not establish the required package integrity condition." },
  { checklistId: "OVC-020", sequence: 20, domain: "MANIFEST", required: true, instruction: "Perform offline manifest verification step 020 using the published canonicalization and SHA-256 rules.", failureMessage: "Offline verification step 020 did not establish the required manifest integrity condition." },
  { checklistId: "OVC-021", sequence: 21, domain: "LINEAGE", required: true, instruction: "Perform offline lineage verification step 021 using the published canonicalization and SHA-256 rules.", failureMessage: "Offline verification step 021 did not establish the required lineage integrity condition." },
  { checklistId: "OVC-022", sequence: 22, domain: "AUDIT", required: true, instruction: "Perform offline audit verification step 022 using the published canonicalization and SHA-256 rules.", failureMessage: "Offline verification step 022 did not establish the required audit integrity condition." },
  { checklistId: "OVC-023", sequence: 23, domain: "OFFLINE", required: true, instruction: "Perform offline offline verification step 023 using the published canonicalization and SHA-256 rules.", failureMessage: "Offline verification step 023 did not establish the required offline integrity condition." },
  { checklistId: "OVC-024", sequence: 24, domain: "PUBLICATION", required: true, instruction: "Perform offline publication verification step 024 using the published canonicalization and SHA-256 rules.", failureMessage: "Offline verification step 024 did not establish the required publication integrity condition." },
  { checklistId: "OVC-025", sequence: 25, domain: "CANONICAL", required: true, instruction: "Perform offline canonical verification step 025 using the published canonicalization and SHA-256 rules.", failureMessage: "Offline verification step 025 did not establish the required canonical integrity condition." },
  { checklistId: "OVC-026", sequence: 26, domain: "COMPONENT", required: true, instruction: "Perform offline component verification step 026 using the published canonicalization and SHA-256 rules.", failureMessage: "Offline verification step 026 did not establish the required component integrity condition." },
  { checklistId: "OVC-027", sequence: 27, domain: "PACKAGE", required: true, instruction: "Perform offline package verification step 027 using the published canonicalization and SHA-256 rules.", failureMessage: "Offline verification step 027 did not establish the required package integrity condition." },
  { checklistId: "OVC-028", sequence: 28, domain: "MANIFEST", required: true, instruction: "Perform offline manifest verification step 028 using the published canonicalization and SHA-256 rules.", failureMessage: "Offline verification step 028 did not establish the required manifest integrity condition." },
  { checklistId: "OVC-029", sequence: 29, domain: "LINEAGE", required: true, instruction: "Perform offline lineage verification step 029 using the published canonicalization and SHA-256 rules.", failureMessage: "Offline verification step 029 did not establish the required lineage integrity condition." },
  { checklistId: "OVC-030", sequence: 30, domain: "AUDIT", required: true, instruction: "Perform offline audit verification step 030 using the published canonicalization and SHA-256 rules.", failureMessage: "Offline verification step 030 did not establish the required audit integrity condition." },
  { checklistId: "OVC-031", sequence: 31, domain: "OFFLINE", required: true, instruction: "Perform offline offline verification step 031 using the published canonicalization and SHA-256 rules.", failureMessage: "Offline verification step 031 did not establish the required offline integrity condition." },
  { checklistId: "OVC-032", sequence: 32, domain: "PUBLICATION", required: true, instruction: "Perform offline publication verification step 032 using the published canonicalization and SHA-256 rules.", failureMessage: "Offline verification step 032 did not establish the required publication integrity condition." },
  { checklistId: "OVC-033", sequence: 33, domain: "CANONICAL", required: true, instruction: "Perform offline canonical verification step 033 using the published canonicalization and SHA-256 rules.", failureMessage: "Offline verification step 033 did not establish the required canonical integrity condition." },
  { checklistId: "OVC-034", sequence: 34, domain: "COMPONENT", required: true, instruction: "Perform offline component verification step 034 using the published canonicalization and SHA-256 rules.", failureMessage: "Offline verification step 034 did not establish the required component integrity condition." },
  { checklistId: "OVC-035", sequence: 35, domain: "PACKAGE", required: true, instruction: "Perform offline package verification step 035 using the published canonicalization and SHA-256 rules.", failureMessage: "Offline verification step 035 did not establish the required package integrity condition." },
  { checklistId: "OVC-036", sequence: 36, domain: "MANIFEST", required: true, instruction: "Perform offline manifest verification step 036 using the published canonicalization and SHA-256 rules.", failureMessage: "Offline verification step 036 did not establish the required manifest integrity condition." },
  { checklistId: "OVC-037", sequence: 37, domain: "LINEAGE", required: true, instruction: "Perform offline lineage verification step 037 using the published canonicalization and SHA-256 rules.", failureMessage: "Offline verification step 037 did not establish the required lineage integrity condition." },
  { checklistId: "OVC-038", sequence: 38, domain: "AUDIT", required: true, instruction: "Perform offline audit verification step 038 using the published canonicalization and SHA-256 rules.", failureMessage: "Offline verification step 038 did not establish the required audit integrity condition." },
  { checklistId: "OVC-039", sequence: 39, domain: "OFFLINE", required: true, instruction: "Perform offline offline verification step 039 using the published canonicalization and SHA-256 rules.", failureMessage: "Offline verification step 039 did not establish the required offline integrity condition." },
  { checklistId: "OVC-040", sequence: 40, domain: "PUBLICATION", required: true, instruction: "Perform offline publication verification step 040 using the published canonicalization and SHA-256 rules.", failureMessage: "Offline verification step 040 did not establish the required publication integrity condition." },
  { checklistId: "OVC-041", sequence: 41, domain: "CANONICAL", required: true, instruction: "Perform offline canonical verification step 041 using the published canonicalization and SHA-256 rules.", failureMessage: "Offline verification step 041 did not establish the required canonical integrity condition." },
  { checklistId: "OVC-042", sequence: 42, domain: "COMPONENT", required: true, instruction: "Perform offline component verification step 042 using the published canonicalization and SHA-256 rules.", failureMessage: "Offline verification step 042 did not establish the required component integrity condition." },
  { checklistId: "OVC-043", sequence: 43, domain: "PACKAGE", required: true, instruction: "Perform offline package verification step 043 using the published canonicalization and SHA-256 rules.", failureMessage: "Offline verification step 043 did not establish the required package integrity condition." },
  { checklistId: "OVC-044", sequence: 44, domain: "MANIFEST", required: true, instruction: "Perform offline manifest verification step 044 using the published canonicalization and SHA-256 rules.", failureMessage: "Offline verification step 044 did not establish the required manifest integrity condition." },
  { checklistId: "OVC-045", sequence: 45, domain: "LINEAGE", required: true, instruction: "Perform offline lineage verification step 045 using the published canonicalization and SHA-256 rules.", failureMessage: "Offline verification step 045 did not establish the required lineage integrity condition." },
  { checklistId: "OVC-046", sequence: 46, domain: "AUDIT", required: true, instruction: "Perform offline audit verification step 046 using the published canonicalization and SHA-256 rules.", failureMessage: "Offline verification step 046 did not establish the required audit integrity condition." },
  { checklistId: "OVC-047", sequence: 47, domain: "OFFLINE", required: true, instruction: "Perform offline offline verification step 047 using the published canonicalization and SHA-256 rules.", failureMessage: "Offline verification step 047 did not establish the required offline integrity condition." },
  { checklistId: "OVC-048", sequence: 48, domain: "PUBLICATION", required: true, instruction: "Perform offline publication verification step 048 using the published canonicalization and SHA-256 rules.", failureMessage: "Offline verification step 048 did not establish the required publication integrity condition." },
  { checklistId: "OVC-049", sequence: 49, domain: "CANONICAL", required: true, instruction: "Perform offline canonical verification step 049 using the published canonicalization and SHA-256 rules.", failureMessage: "Offline verification step 049 did not establish the required canonical integrity condition." },
  { checklistId: "OVC-050", sequence: 50, domain: "COMPONENT", required: true, instruction: "Perform offline component verification step 050 using the published canonicalization and SHA-256 rules.", failureMessage: "Offline verification step 050 did not establish the required component integrity condition." },
  { checklistId: "OVC-051", sequence: 51, domain: "PACKAGE", required: true, instruction: "Perform offline package verification step 051 using the published canonicalization and SHA-256 rules.", failureMessage: "Offline verification step 051 did not establish the required package integrity condition." },
  { checklistId: "OVC-052", sequence: 52, domain: "MANIFEST", required: true, instruction: "Perform offline manifest verification step 052 using the published canonicalization and SHA-256 rules.", failureMessage: "Offline verification step 052 did not establish the required manifest integrity condition." },
  { checklistId: "OVC-053", sequence: 53, domain: "LINEAGE", required: true, instruction: "Perform offline lineage verification step 053 using the published canonicalization and SHA-256 rules.", failureMessage: "Offline verification step 053 did not establish the required lineage integrity condition." },
  { checklistId: "OVC-054", sequence: 54, domain: "AUDIT", required: true, instruction: "Perform offline audit verification step 054 using the published canonicalization and SHA-256 rules.", failureMessage: "Offline verification step 054 did not establish the required audit integrity condition." },
  { checklistId: "OVC-055", sequence: 55, domain: "OFFLINE", required: true, instruction: "Perform offline offline verification step 055 using the published canonicalization and SHA-256 rules.", failureMessage: "Offline verification step 055 did not establish the required offline integrity condition." },
  { checklistId: "OVC-056", sequence: 56, domain: "PUBLICATION", required: true, instruction: "Perform offline publication verification step 056 using the published canonicalization and SHA-256 rules.", failureMessage: "Offline verification step 056 did not establish the required publication integrity condition." },
  { checklistId: "OVC-057", sequence: 57, domain: "CANONICAL", required: true, instruction: "Perform offline canonical verification step 057 using the published canonicalization and SHA-256 rules.", failureMessage: "Offline verification step 057 did not establish the required canonical integrity condition." },
  { checklistId: "OVC-058", sequence: 58, domain: "COMPONENT", required: true, instruction: "Perform offline component verification step 058 using the published canonicalization and SHA-256 rules.", failureMessage: "Offline verification step 058 did not establish the required component integrity condition." },
  { checklistId: "OVC-059", sequence: 59, domain: "PACKAGE", required: true, instruction: "Perform offline package verification step 059 using the published canonicalization and SHA-256 rules.", failureMessage: "Offline verification step 059 did not establish the required package integrity condition." },
  { checklistId: "OVC-060", sequence: 60, domain: "MANIFEST", required: true, instruction: "Perform offline manifest verification step 060 using the published canonicalization and SHA-256 rules.", failureMessage: "Offline verification step 060 did not establish the required manifest integrity condition." },
  { checklistId: "OVC-061", sequence: 61, domain: "LINEAGE", required: true, instruction: "Perform offline lineage verification step 061 using the published canonicalization and SHA-256 rules.", failureMessage: "Offline verification step 061 did not establish the required lineage integrity condition." },
  { checklistId: "OVC-062", sequence: 62, domain: "AUDIT", required: true, instruction: "Perform offline audit verification step 062 using the published canonicalization and SHA-256 rules.", failureMessage: "Offline verification step 062 did not establish the required audit integrity condition." },
  { checklistId: "OVC-063", sequence: 63, domain: "OFFLINE", required: true, instruction: "Perform offline offline verification step 063 using the published canonicalization and SHA-256 rules.", failureMessage: "Offline verification step 063 did not establish the required offline integrity condition." },
  { checklistId: "OVC-064", sequence: 64, domain: "PUBLICATION", required: true, instruction: "Perform offline publication verification step 064 using the published canonicalization and SHA-256 rules.", failureMessage: "Offline verification step 064 did not establish the required publication integrity condition." },
  { checklistId: "OVC-065", sequence: 65, domain: "CANONICAL", required: false, instruction: "Perform offline canonical verification step 065 using the published canonicalization and SHA-256 rules.", failureMessage: "Offline verification step 065 did not establish the required canonical integrity condition." },
  { checklistId: "OVC-066", sequence: 66, domain: "COMPONENT", required: false, instruction: "Perform offline component verification step 066 using the published canonicalization and SHA-256 rules.", failureMessage: "Offline verification step 066 did not establish the required component integrity condition." },
  { checklistId: "OVC-067", sequence: 67, domain: "PACKAGE", required: false, instruction: "Perform offline package verification step 067 using the published canonicalization and SHA-256 rules.", failureMessage: "Offline verification step 067 did not establish the required package integrity condition." },
  { checklistId: "OVC-068", sequence: 68, domain: "MANIFEST", required: false, instruction: "Perform offline manifest verification step 068 using the published canonicalization and SHA-256 rules.", failureMessage: "Offline verification step 068 did not establish the required manifest integrity condition." },
  { checklistId: "OVC-069", sequence: 69, domain: "LINEAGE", required: false, instruction: "Perform offline lineage verification step 069 using the published canonicalization and SHA-256 rules.", failureMessage: "Offline verification step 069 did not establish the required lineage integrity condition." },
  { checklistId: "OVC-070", sequence: 70, domain: "AUDIT", required: false, instruction: "Perform offline audit verification step 070 using the published canonicalization and SHA-256 rules.", failureMessage: "Offline verification step 070 did not establish the required audit integrity condition." },
  { checklistId: "OVC-071", sequence: 71, domain: "OFFLINE", required: false, instruction: "Perform offline offline verification step 071 using the published canonicalization and SHA-256 rules.", failureMessage: "Offline verification step 071 did not establish the required offline integrity condition." },
  { checklistId: "OVC-072", sequence: 72, domain: "PUBLICATION", required: false, instruction: "Perform offline publication verification step 072 using the published canonicalization and SHA-256 rules.", failureMessage: "Offline verification step 072 did not establish the required publication integrity condition." },
  { checklistId: "OVC-073", sequence: 73, domain: "CANONICAL", required: false, instruction: "Perform offline canonical verification step 073 using the published canonicalization and SHA-256 rules.", failureMessage: "Offline verification step 073 did not establish the required canonical integrity condition." },
  { checklistId: "OVC-074", sequence: 74, domain: "COMPONENT", required: false, instruction: "Perform offline component verification step 074 using the published canonicalization and SHA-256 rules.", failureMessage: "Offline verification step 074 did not establish the required component integrity condition." },
  { checklistId: "OVC-075", sequence: 75, domain: "PACKAGE", required: false, instruction: "Perform offline package verification step 075 using the published canonicalization and SHA-256 rules.", failureMessage: "Offline verification step 075 did not establish the required package integrity condition." },
  { checklistId: "OVC-076", sequence: 76, domain: "MANIFEST", required: false, instruction: "Perform offline manifest verification step 076 using the published canonicalization and SHA-256 rules.", failureMessage: "Offline verification step 076 did not establish the required manifest integrity condition." },
  { checklistId: "OVC-077", sequence: 77, domain: "LINEAGE", required: false, instruction: "Perform offline lineage verification step 077 using the published canonicalization and SHA-256 rules.", failureMessage: "Offline verification step 077 did not establish the required lineage integrity condition." },
  { checklistId: "OVC-078", sequence: 78, domain: "AUDIT", required: false, instruction: "Perform offline audit verification step 078 using the published canonicalization and SHA-256 rules.", failureMessage: "Offline verification step 078 did not establish the required audit integrity condition." },
  { checklistId: "OVC-079", sequence: 79, domain: "OFFLINE", required: false, instruction: "Perform offline offline verification step 079 using the published canonicalization and SHA-256 rules.", failureMessage: "Offline verification step 079 did not establish the required offline integrity condition." },
  { checklistId: "OVC-080", sequence: 80, domain: "PUBLICATION", required: false, instruction: "Perform offline publication verification step 080 using the published canonicalization and SHA-256 rules.", failureMessage: "Offline verification step 080 did not establish the required publication integrity condition." },
] as const;


export function componentProfilesForKind(kind: IntegrityComponentKind): readonly IntegrityComponentProfile[] {
  return INTEGRITY_COMPONENT_PROFILES.filter((profile) => profile.kind === kind);
}

export function requiredComponentKindsForPublicReliance(): readonly IntegrityComponentKind[] {
  return Array.from(new Set(
    INTEGRITY_COMPONENT_PROFILES
      .filter((profile) => profile.requiredForPublicReliance)
      .map((profile) => profile.kind),
  ));
}

export function requiredComponentKindsForProductionClaim(): readonly IntegrityComponentKind[] {
  return Array.from(new Set(
    INTEGRITY_COMPONENT_PROFILES
      .filter((profile) => profile.requiredForProductionClaim)
      .map((profile) => profile.kind),
  ));
}

export function lineagePoliciesForKind(kind: IntegrityLineageLink["kind"]): readonly IntegrityLineagePolicy[] {
  return INTEGRITY_LINEAGE_POLICIES.filter((policy) => policy.kind === kind);
}

export function validateRequiredComponentCoverage(
  components: readonly IntegrityComponentDigest[],
  mode: "PUBLIC_RELIANCE" | "PRODUCTION_CLAIM",
): IntegrityIssue[] {
  const available = new Set(components.map((component) => component.kind));
  const required = mode === "PUBLIC_RELIANCE"
    ? requiredComponentKindsForPublicReliance()
    : requiredComponentKindsForProductionClaim();
  return required
    .filter((kind) => !available.has(kind))
    .map((kind) => issue(
      "OFFLINE_BUNDLE_INCOMPLETE",
      `Required ${kind} component is missing for ${mode}.`,
      { path: `components.${kind}` },
    ));
}

export function evaluateOfflineChecklist(
  completedIds: readonly string[],
): { passed: boolean; missingRequired: readonly OfflineVerificationChecklistItem[]; completedCount: number } {
  const completed = new Set(completedIds);
  const missingRequired = OFFLINE_VERIFICATION_CHECKLIST.filter(
    (item) => item.required && !completed.has(item.checklistId),
  );
  return {
    passed: missingRequired.length === 0,
    missingRequired,
    completedCount: OFFLINE_VERIFICATION_CHECKLIST.filter((item) => completed.has(item.checklistId)).length,
  };
}

export function buildIntegritySummary(manifest: IntegrityManifest): {
  artifactId: string;
  registryId?: string;
  componentCount: number;
  requiredComponentCount: number;
  publicComponentCount: number;
  packageRootHash: string;
  canonicalHash: string;
  manifestHash: string;
  lineageDepth: number;
  auditDepth: number;
} {
  return {
    artifactId: manifest.artifactId,
    registryId: manifest.registryId,
    componentCount: manifest.components.length,
    requiredComponentCount: manifest.components.filter((component) => component.required).length,
    publicComponentCount: manifest.components.filter((component) => component.disclosure === "PUBLIC").length,
    packageRootHash: manifest.packageRootHash,
    canonicalHash: manifest.canonicalHash,
    manifestHash: manifest.manifestHash,
    lineageDepth: manifest.lineage.length,
    auditDepth: manifest.auditEvents.length,
  };
}

export function compareIntegrityManifests(
  left: IntegrityManifest,
  right: IntegrityManifest,
): {
  sameArtifact: boolean;
  sameCanonicalRecord: boolean;
  samePackageRoot: boolean;
  sameManifest: boolean;
  addedComponents: readonly string[];
  removedComponents: readonly string[];
  changedComponents: readonly string[];
} {
  const leftById = new Map(left.components.map((component) => [component.componentId, component]));
  const rightById = new Map(right.components.map((component) => [component.componentId, component]));
  const addedComponents = right.components
    .filter((component) => !leftById.has(component.componentId))
    .map((component) => component.componentId);
  const removedComponents = left.components
    .filter((component) => !rightById.has(component.componentId))
    .map((component) => component.componentId);
  const changedComponents = right.components
    .filter((component) => {
      const previous = leftById.get(component.componentId);
      return previous !== undefined && (
        previous.hash !== component.hash ||
        previous.byteLength !== component.byteLength ||
        previous.mediaType !== component.mediaType ||
        previous.kind !== component.kind
      );
    })
    .map((component) => component.componentId);
  return {
    sameArtifact: left.artifactId === right.artifactId,
    sameCanonicalRecord: constantTimeHexEqual(left.canonicalHash, right.canonicalHash),
    samePackageRoot: constantTimeHexEqual(left.packageRootHash, right.packageRootHash),
    sameManifest: constantTimeHexEqual(left.manifestHash, right.manifestHash),
    addedComponents,
    removedComponents,
    changedComponents,
  };
}

export function integrityReasonDefinition(code: IntegrityReasonCode): IntegrityReasonDefinition {
  const definition = INTEGRITY_REASON_DEFINITIONS.find((item) => item.code === code);
  if (!definition) throw new Error(`Unknown integrity reason code: ${code}`);
  return definition;
}

export function integrityControlsByDomain(domain: IntegrityDomain): readonly IntegrityControlDefinition[] {
  return INTEGRITY_CONTROLS.filter((control) => control.domain === domain);
}

export function integrityAcceptanceTestsByPrefix(prefix: string): readonly IntegrityAcceptanceTest[] {
  return INTEGRITY_ACCEPTANCE_TESTS.filter((test) => test.testId.startsWith(prefix));
}


export interface IntegrityScenarioDefinition {
  scenarioId: string;
  title: string;
  domain: IntegrityDomain;
  mutation: string;
  expectedReasonCode: IntegrityReasonCode;
  expectedDisposition: IntegrityDisposition;
  institutionalMeaning: string;
}

export const INTEGRITY_SCENARIO_CATALOG: readonly IntegrityScenarioDefinition[] = [
  { scenarioId: "IHS-001", title: "Integrity mutation scenario 001", domain: "CANONICAL", mutation: "Apply bounded mutation 001 to the canonical representation and recalculate the package.", expectedReasonCode: "CANONICAL_INPUT_MISSING", expectedDisposition: "FAILED", institutionalMeaning: "Demonstrates that integrity condition 001 cannot change silently after commitment." },
  { scenarioId: "IHS-002", title: "Integrity mutation scenario 002", domain: "COMPONENT", mutation: "Apply bounded mutation 002 to the component representation and recalculate the package.", expectedReasonCode: "CANONICAL_SERIALIZATION_FAILED", expectedDisposition: "FAILED", institutionalMeaning: "Demonstrates that integrity condition 002 cannot change silently after commitment." },
  { scenarioId: "IHS-003", title: "Integrity mutation scenario 003", domain: "PACKAGE", mutation: "Apply bounded mutation 003 to the package representation and recalculate the package.", expectedReasonCode: "CANONICAL_HASH_MISSING", expectedDisposition: "FAILED", institutionalMeaning: "Demonstrates that integrity condition 003 cannot change silently after commitment." },
  { scenarioId: "IHS-004", title: "Integrity mutation scenario 004", domain: "MANIFEST", mutation: "Apply bounded mutation 004 to the manifest representation and recalculate the package.", expectedReasonCode: "CANONICAL_HASH_MISMATCH", expectedDisposition: "FAILED", institutionalMeaning: "Demonstrates that integrity condition 004 cannot change silently after commitment." },
  { scenarioId: "IHS-005", title: "Integrity mutation scenario 005", domain: "LINEAGE", mutation: "Apply bounded mutation 005 to the lineage representation and recalculate the package.", expectedReasonCode: "COMPONENT_ID_MISSING", expectedDisposition: "VERIFIED_WITH_WARNINGS", institutionalMeaning: "Demonstrates that integrity condition 005 cannot change silently after commitment." },
  { scenarioId: "IHS-006", title: "Integrity mutation scenario 006", domain: "AUDIT", mutation: "Apply bounded mutation 006 to the audit representation and recalculate the package.", expectedReasonCode: "COMPONENT_DUPLICATE_ID", expectedDisposition: "FAILED", institutionalMeaning: "Demonstrates that integrity condition 006 cannot change silently after commitment." },
  { scenarioId: "IHS-007", title: "Integrity mutation scenario 007", domain: "OFFLINE", mutation: "Apply bounded mutation 007 to the offline representation and recalculate the package.", expectedReasonCode: "COMPONENT_BYTES_MISSING", expectedDisposition: "FAILED", institutionalMeaning: "Demonstrates that integrity condition 007 cannot change silently after commitment." },
  { scenarioId: "IHS-008", title: "Integrity mutation scenario 008", domain: "PUBLICATION", mutation: "Apply bounded mutation 008 to the publication representation and recalculate the package.", expectedReasonCode: "COMPONENT_HASH_MISSING", expectedDisposition: "FAILED", institutionalMeaning: "Demonstrates that integrity condition 008 cannot change silently after commitment." },
  { scenarioId: "IHS-009", title: "Integrity mutation scenario 009", domain: "CANONICAL", mutation: "Apply bounded mutation 009 to the canonical representation and recalculate the package.", expectedReasonCode: "COMPONENT_HASH_MISMATCH", expectedDisposition: "FAILED", institutionalMeaning: "Demonstrates that integrity condition 009 cannot change silently after commitment." },
  { scenarioId: "IHS-010", title: "Integrity mutation scenario 010", domain: "COMPONENT", mutation: "Apply bounded mutation 010 to the component representation and recalculate the package.", expectedReasonCode: "COMPONENT_MEDIA_TYPE_MISSING", expectedDisposition: "VERIFIED_WITH_WARNINGS", institutionalMeaning: "Demonstrates that integrity condition 010 cannot change silently after commitment." },
  { scenarioId: "IHS-011", title: "Integrity mutation scenario 011", domain: "PACKAGE", mutation: "Apply bounded mutation 011 to the package representation and recalculate the package.", expectedReasonCode: "PACKAGE_ROOT_MISSING", expectedDisposition: "FAILED", institutionalMeaning: "Demonstrates that integrity condition 011 cannot change silently after commitment." },
  { scenarioId: "IHS-012", title: "Integrity mutation scenario 012", domain: "MANIFEST", mutation: "Apply bounded mutation 012 to the manifest representation and recalculate the package.", expectedReasonCode: "PACKAGE_ROOT_MISMATCH", expectedDisposition: "FAILED", institutionalMeaning: "Demonstrates that integrity condition 012 cannot change silently after commitment." },
  { scenarioId: "IHS-013", title: "Integrity mutation scenario 013", domain: "LINEAGE", mutation: "Apply bounded mutation 013 to the lineage representation and recalculate the package.", expectedReasonCode: "PACKAGE_COMPONENT_COUNT_MISMATCH", expectedDisposition: "FAILED", institutionalMeaning: "Demonstrates that integrity condition 013 cannot change silently after commitment." },
  { scenarioId: "IHS-014", title: "Integrity mutation scenario 014", domain: "AUDIT", mutation: "Apply bounded mutation 014 to the audit representation and recalculate the package.", expectedReasonCode: "PACKAGE_ORDER_NONDETERMINISTIC", expectedDisposition: "FAILED", institutionalMeaning: "Demonstrates that integrity condition 014 cannot change silently after commitment." },
  { scenarioId: "IHS-015", title: "Integrity mutation scenario 015", domain: "OFFLINE", mutation: "Apply bounded mutation 015 to the offline representation and recalculate the package.", expectedReasonCode: "MANIFEST_MISSING", expectedDisposition: "VERIFIED_WITH_WARNINGS", institutionalMeaning: "Demonstrates that integrity condition 015 cannot change silently after commitment." },
  { scenarioId: "IHS-016", title: "Integrity mutation scenario 016", domain: "PUBLICATION", mutation: "Apply bounded mutation 016 to the publication representation and recalculate the package.", expectedReasonCode: "MANIFEST_HASH_MISSING", expectedDisposition: "FAILED", institutionalMeaning: "Demonstrates that integrity condition 016 cannot change silently after commitment." },
  { scenarioId: "IHS-017", title: "Integrity mutation scenario 017", domain: "CANONICAL", mutation: "Apply bounded mutation 017 to the canonical representation and recalculate the package.", expectedReasonCode: "MANIFEST_HASH_MISMATCH", expectedDisposition: "FAILED", institutionalMeaning: "Demonstrates that integrity condition 017 cannot change silently after commitment." },
  { scenarioId: "IHS-018", title: "Integrity mutation scenario 018", domain: "COMPONENT", mutation: "Apply bounded mutation 018 to the component representation and recalculate the package.", expectedReasonCode: "MANIFEST_VERSION_UNSUPPORTED", expectedDisposition: "FAILED", institutionalMeaning: "Demonstrates that integrity condition 018 cannot change silently after commitment." },
  { scenarioId: "IHS-019", title: "Integrity mutation scenario 019", domain: "PACKAGE", mutation: "Apply bounded mutation 019 to the package representation and recalculate the package.", expectedReasonCode: "PDF_HASH_MISSING", expectedDisposition: "FAILED", institutionalMeaning: "Demonstrates that integrity condition 019 cannot change silently after commitment." },
  { scenarioId: "IHS-020", title: "Integrity mutation scenario 020", domain: "MANIFEST", mutation: "Apply bounded mutation 020 to the manifest representation and recalculate the package.", expectedReasonCode: "PDF_HASH_MISMATCH", expectedDisposition: "VERIFIED_WITH_WARNINGS", institutionalMeaning: "Demonstrates that integrity condition 020 cannot change silently after commitment." },
  { scenarioId: "IHS-021", title: "Integrity mutation scenario 021", domain: "LINEAGE", mutation: "Apply bounded mutation 021 to the lineage representation and recalculate the package.", expectedReasonCode: "JSON_HASH_MISSING", expectedDisposition: "FAILED", institutionalMeaning: "Demonstrates that integrity condition 021 cannot change silently after commitment." },
  { scenarioId: "IHS-022", title: "Integrity mutation scenario 022", domain: "AUDIT", mutation: "Apply bounded mutation 022 to the audit representation and recalculate the package.", expectedReasonCode: "JSON_HASH_MISMATCH", expectedDisposition: "FAILED", institutionalMeaning: "Demonstrates that integrity condition 022 cannot change silently after commitment." },
  { scenarioId: "IHS-023", title: "Integrity mutation scenario 023", domain: "OFFLINE", mutation: "Apply bounded mutation 023 to the offline representation and recalculate the package.", expectedReasonCode: "RECEIPT_HASH_MISSING", expectedDisposition: "FAILED", institutionalMeaning: "Demonstrates that integrity condition 023 cannot change silently after commitment." },
  { scenarioId: "IHS-024", title: "Integrity mutation scenario 024", domain: "PUBLICATION", mutation: "Apply bounded mutation 024 to the publication representation and recalculate the package.", expectedReasonCode: "RECEIPT_HASH_MISMATCH", expectedDisposition: "FAILED", institutionalMeaning: "Demonstrates that integrity condition 024 cannot change silently after commitment." },
  { scenarioId: "IHS-025", title: "Integrity mutation scenario 025", domain: "CANONICAL", mutation: "Apply bounded mutation 025 to the canonical representation and recalculate the package.", expectedReasonCode: "ROUTE_HASH_MISSING", expectedDisposition: "VERIFIED_WITH_WARNINGS", institutionalMeaning: "Demonstrates that integrity condition 025 cannot change silently after commitment." },
  { scenarioId: "IHS-026", title: "Integrity mutation scenario 026", domain: "COMPONENT", mutation: "Apply bounded mutation 026 to the component representation and recalculate the package.", expectedReasonCode: "ROUTE_HASH_MISMATCH", expectedDisposition: "FAILED", institutionalMeaning: "Demonstrates that integrity condition 026 cannot change silently after commitment." },
  { scenarioId: "IHS-027", title: "Integrity mutation scenario 027", domain: "PACKAGE", mutation: "Apply bounded mutation 027 to the package representation and recalculate the package.", expectedReasonCode: "OUTCOME_HASH_MISSING", expectedDisposition: "FAILED", institutionalMeaning: "Demonstrates that integrity condition 027 cannot change silently after commitment." },
  { scenarioId: "IHS-028", title: "Integrity mutation scenario 028", domain: "MANIFEST", mutation: "Apply bounded mutation 028 to the manifest representation and recalculate the package.", expectedReasonCode: "OUTCOME_HASH_MISMATCH", expectedDisposition: "FAILED", institutionalMeaning: "Demonstrates that integrity condition 028 cannot change silently after commitment." },
  { scenarioId: "IHS-029", title: "Integrity mutation scenario 029", domain: "LINEAGE", mutation: "Apply bounded mutation 029 to the lineage representation and recalculate the package.", expectedReasonCode: "REGISTRY_HASH_MISSING", expectedDisposition: "FAILED", institutionalMeaning: "Demonstrates that integrity condition 029 cannot change silently after commitment." },
  { scenarioId: "IHS-030", title: "Integrity mutation scenario 030", domain: "AUDIT", mutation: "Apply bounded mutation 030 to the audit representation and recalculate the package.", expectedReasonCode: "REGISTRY_HASH_MISMATCH", expectedDisposition: "VERIFIED_WITH_WARNINGS", institutionalMeaning: "Demonstrates that integrity condition 030 cannot change silently after commitment." },
  { scenarioId: "IHS-031", title: "Integrity mutation scenario 031", domain: "OFFLINE", mutation: "Apply bounded mutation 031 to the offline representation and recalculate the package.", expectedReasonCode: "VERIFICATION_HASH_MISSING", expectedDisposition: "FAILED", institutionalMeaning: "Demonstrates that integrity condition 031 cannot change silently after commitment." },
  { scenarioId: "IHS-032", title: "Integrity mutation scenario 032", domain: "PUBLICATION", mutation: "Apply bounded mutation 032 to the publication representation and recalculate the package.", expectedReasonCode: "VERIFICATION_HASH_MISMATCH", expectedDisposition: "FAILED", institutionalMeaning: "Demonstrates that integrity condition 032 cannot change silently after commitment." },
  { scenarioId: "IHS-033", title: "Integrity mutation scenario 033", domain: "CANONICAL", mutation: "Apply bounded mutation 033 to the canonical representation and recalculate the package.", expectedReasonCode: "CHALLENGE_HASH_MISSING", expectedDisposition: "FAILED", institutionalMeaning: "Demonstrates that integrity condition 033 cannot change silently after commitment." },
  { scenarioId: "IHS-034", title: "Integrity mutation scenario 034", domain: "COMPONENT", mutation: "Apply bounded mutation 034 to the component representation and recalculate the package.", expectedReasonCode: "CHALLENGE_HASH_MISMATCH", expectedDisposition: "FAILED", institutionalMeaning: "Demonstrates that integrity condition 034 cannot change silently after commitment." },
  { scenarioId: "IHS-035", title: "Integrity mutation scenario 035", domain: "PACKAGE", mutation: "Apply bounded mutation 035 to the package representation and recalculate the package.", expectedReasonCode: "AMENDMENT_PARENT_MISSING", expectedDisposition: "VERIFIED_WITH_WARNINGS", institutionalMeaning: "Demonstrates that integrity condition 035 cannot change silently after commitment." },
  { scenarioId: "IHS-036", title: "Integrity mutation scenario 036", domain: "MANIFEST", mutation: "Apply bounded mutation 036 to the manifest representation and recalculate the package.", expectedReasonCode: "AMENDMENT_PARENT_MISMATCH", expectedDisposition: "FAILED", institutionalMeaning: "Demonstrates that integrity condition 036 cannot change silently after commitment." },
  { scenarioId: "IHS-037", title: "Integrity mutation scenario 037", domain: "LINEAGE", mutation: "Apply bounded mutation 037 to the lineage representation and recalculate the package.", expectedReasonCode: "AMENDMENT_HASH_MISSING", expectedDisposition: "FAILED", institutionalMeaning: "Demonstrates that integrity condition 037 cannot change silently after commitment." },
  { scenarioId: "IHS-038", title: "Integrity mutation scenario 038", domain: "AUDIT", mutation: "Apply bounded mutation 038 to the audit representation and recalculate the package.", expectedReasonCode: "AMENDMENT_HASH_MISMATCH", expectedDisposition: "FAILED", institutionalMeaning: "Demonstrates that integrity condition 038 cannot change silently after commitment." },
  { scenarioId: "IHS-039", title: "Integrity mutation scenario 039", domain: "OFFLINE", mutation: "Apply bounded mutation 039 to the offline representation and recalculate the package.", expectedReasonCode: "SUPERSESSION_PARENT_MISSING", expectedDisposition: "FAILED", institutionalMeaning: "Demonstrates that integrity condition 039 cannot change silently after commitment." },
  { scenarioId: "IHS-040", title: "Integrity mutation scenario 040", domain: "PUBLICATION", mutation: "Apply bounded mutation 040 to the publication representation and recalculate the package.", expectedReasonCode: "SUPERSESSION_CHAIN_BROKEN", expectedDisposition: "VERIFIED_WITH_WARNINGS", institutionalMeaning: "Demonstrates that integrity condition 040 cannot change silently after commitment." },
  { scenarioId: "IHS-041", title: "Integrity mutation scenario 041", domain: "CANONICAL", mutation: "Apply bounded mutation 041 to the canonical representation and recalculate the package.", expectedReasonCode: "AUDIT_EVENT_HASH_MISSING", expectedDisposition: "FAILED", institutionalMeaning: "Demonstrates that integrity condition 041 cannot change silently after commitment." },
  { scenarioId: "IHS-042", title: "Integrity mutation scenario 042", domain: "COMPONENT", mutation: "Apply bounded mutation 042 to the component representation and recalculate the package.", expectedReasonCode: "AUDIT_EVENT_PREVIOUS_HASH_MISMATCH", expectedDisposition: "FAILED", institutionalMeaning: "Demonstrates that integrity condition 042 cannot change silently after commitment." },
  { scenarioId: "IHS-043", title: "Integrity mutation scenario 043", domain: "PACKAGE", mutation: "Apply bounded mutation 043 to the package representation and recalculate the package.", expectedReasonCode: "AUDIT_EVENT_HASH_MISMATCH", expectedDisposition: "FAILED", institutionalMeaning: "Demonstrates that integrity condition 043 cannot change silently after commitment." },
  { scenarioId: "IHS-044", title: "Integrity mutation scenario 044", domain: "MANIFEST", mutation: "Apply bounded mutation 044 to the manifest representation and recalculate the package.", expectedReasonCode: "AUDIT_SEQUENCE_INVALID", expectedDisposition: "FAILED", institutionalMeaning: "Demonstrates that integrity condition 044 cannot change silently after commitment." },
  { scenarioId: "IHS-045", title: "Integrity mutation scenario 045", domain: "LINEAGE", mutation: "Apply bounded mutation 045 to the lineage representation and recalculate the package.", expectedReasonCode: "CANONICALIZATION_VERSION_MISSING", expectedDisposition: "VERIFIED_WITH_WARNINGS", institutionalMeaning: "Demonstrates that integrity condition 045 cannot change silently after commitment." },
  { scenarioId: "IHS-046", title: "Integrity mutation scenario 046", domain: "AUDIT", mutation: "Apply bounded mutation 046 to the audit representation and recalculate the package.", expectedReasonCode: "CANONICALIZATION_VERSION_UNSUPPORTED", expectedDisposition: "FAILED", institutionalMeaning: "Demonstrates that integrity condition 046 cannot change silently after commitment." },
  { scenarioId: "IHS-047", title: "Integrity mutation scenario 047", domain: "OFFLINE", mutation: "Apply bounded mutation 047 to the offline representation and recalculate the package.", expectedReasonCode: "HASH_ALGORITHM_MISSING", expectedDisposition: "FAILED", institutionalMeaning: "Demonstrates that integrity condition 047 cannot change silently after commitment." },
  { scenarioId: "IHS-048", title: "Integrity mutation scenario 048", domain: "PUBLICATION", mutation: "Apply bounded mutation 048 to the publication representation and recalculate the package.", expectedReasonCode: "HASH_ALGORITHM_UNSUPPORTED", expectedDisposition: "FAILED", institutionalMeaning: "Demonstrates that integrity condition 048 cannot change silently after commitment." },
  { scenarioId: "IHS-049", title: "Integrity mutation scenario 049", domain: "CANONICAL", mutation: "Apply bounded mutation 049 to the canonical representation and recalculate the package.", expectedReasonCode: "HASH_FORMAT_INVALID", expectedDisposition: "FAILED", institutionalMeaning: "Demonstrates that integrity condition 049 cannot change silently after commitment." },
  { scenarioId: "IHS-050", title: "Integrity mutation scenario 050", domain: "COMPONENT", mutation: "Apply bounded mutation 050 to the component representation and recalculate the package.", expectedReasonCode: "BYTE_LENGTH_MISMATCH", expectedDisposition: "VERIFIED_WITH_WARNINGS", institutionalMeaning: "Demonstrates that integrity condition 050 cannot change silently after commitment." },
  { scenarioId: "IHS-051", title: "Integrity mutation scenario 051", domain: "PACKAGE", mutation: "Apply bounded mutation 051 to the package representation and recalculate the package.", expectedReasonCode: "TEXT_ENCODING_UNSUPPORTED", expectedDisposition: "FAILED", institutionalMeaning: "Demonstrates that integrity condition 051 cannot change silently after commitment." },
  { scenarioId: "IHS-052", title: "Integrity mutation scenario 052", domain: "MANIFEST", mutation: "Apply bounded mutation 052 to the manifest representation and recalculate the package.", expectedReasonCode: "DATE_NORMALIZATION_FAILED", expectedDisposition: "FAILED", institutionalMeaning: "Demonstrates that integrity condition 052 cannot change silently after commitment." },
  { scenarioId: "IHS-053", title: "Integrity mutation scenario 053", domain: "LINEAGE", mutation: "Apply bounded mutation 053 to the lineage representation and recalculate the package.", expectedReasonCode: "NONFINITE_NUMBER_REJECTED", expectedDisposition: "FAILED", institutionalMeaning: "Demonstrates that integrity condition 053 cannot change silently after commitment." },
  { scenarioId: "IHS-054", title: "Integrity mutation scenario 054", domain: "AUDIT", mutation: "Apply bounded mutation 054 to the audit representation and recalculate the package.", expectedReasonCode: "UNDEFINED_VALUE_REJECTED", expectedDisposition: "FAILED", institutionalMeaning: "Demonstrates that integrity condition 054 cannot change silently after commitment." },
  { scenarioId: "IHS-055", title: "Integrity mutation scenario 055", domain: "OFFLINE", mutation: "Apply bounded mutation 055 to the offline representation and recalculate the package.", expectedReasonCode: "SYMBOL_VALUE_REJECTED", expectedDisposition: "VERIFIED_WITH_WARNINGS", institutionalMeaning: "Demonstrates that integrity condition 055 cannot change silently after commitment." },
  { scenarioId: "IHS-056", title: "Integrity mutation scenario 056", domain: "PUBLICATION", mutation: "Apply bounded mutation 056 to the publication representation and recalculate the package.", expectedReasonCode: "FUNCTION_VALUE_REJECTED", expectedDisposition: "FAILED", institutionalMeaning: "Demonstrates that integrity condition 056 cannot change silently after commitment." },
  { scenarioId: "IHS-057", title: "Integrity mutation scenario 057", domain: "CANONICAL", mutation: "Apply bounded mutation 057 to the canonical representation and recalculate the package.", expectedReasonCode: "BIGINT_NORMALIZED", expectedDisposition: "FAILED", institutionalMeaning: "Demonstrates that integrity condition 057 cannot change silently after commitment." },
  { scenarioId: "IHS-058", title: "Integrity mutation scenario 058", domain: "COMPONENT", mutation: "Apply bounded mutation 058 to the component representation and recalculate the package.", expectedReasonCode: "CIRCULAR_REFERENCE_REJECTED", expectedDisposition: "FAILED", institutionalMeaning: "Demonstrates that integrity condition 058 cannot change silently after commitment." },
  { scenarioId: "IHS-059", title: "Integrity mutation scenario 059", domain: "PACKAGE", mutation: "Apply bounded mutation 059 to the package representation and recalculate the package.", expectedReasonCode: "MAP_KEY_UNSUPPORTED", expectedDisposition: "FAILED", institutionalMeaning: "Demonstrates that integrity condition 059 cannot change silently after commitment." },
  { scenarioId: "IHS-060", title: "Integrity mutation scenario 060", domain: "MANIFEST", mutation: "Apply bounded mutation 060 to the manifest representation and recalculate the package.", expectedReasonCode: "SET_ORDER_NORMALIZED", expectedDisposition: "VERIFIED_WITH_WARNINGS", institutionalMeaning: "Demonstrates that integrity condition 060 cannot change silently after commitment." },
  { scenarioId: "IHS-061", title: "Integrity mutation scenario 061", domain: "LINEAGE", mutation: "Apply bounded mutation 061 to the lineage representation and recalculate the package.", expectedReasonCode: "OFFLINE_BUNDLE_INCOMPLETE", expectedDisposition: "FAILED", institutionalMeaning: "Demonstrates that integrity condition 061 cannot change silently after commitment." },
  { scenarioId: "IHS-062", title: "Integrity mutation scenario 062", domain: "AUDIT", mutation: "Apply bounded mutation 062 to the audit representation and recalculate the package.", expectedReasonCode: "OFFLINE_INSTRUCTIONS_MISSING", expectedDisposition: "FAILED", institutionalMeaning: "Demonstrates that integrity condition 062 cannot change silently after commitment." },
  { scenarioId: "IHS-063", title: "Integrity mutation scenario 063", domain: "OFFLINE", mutation: "Apply bounded mutation 063 to the offline representation and recalculate the package.", expectedReasonCode: "SIGNATURE_REFERENCE_MISSING", expectedDisposition: "FAILED", institutionalMeaning: "Demonstrates that integrity condition 063 cannot change silently after commitment." },
  { scenarioId: "IHS-064", title: "Integrity mutation scenario 064", domain: "PUBLICATION", mutation: "Apply bounded mutation 064 to the publication representation and recalculate the package.", expectedReasonCode: "SIGNATURE_DIGEST_MISMATCH", expectedDisposition: "FAILED", institutionalMeaning: "Demonstrates that integrity condition 064 cannot change silently after commitment." },
  { scenarioId: "IHS-065", title: "Integrity mutation scenario 065", domain: "CANONICAL", mutation: "Apply bounded mutation 065 to the canonical representation and recalculate the package.", expectedReasonCode: "TIMESTAMP_MISSING", expectedDisposition: "VERIFIED_WITH_WARNINGS", institutionalMeaning: "Demonstrates that integrity condition 065 cannot change silently after commitment." },
  { scenarioId: "IHS-066", title: "Integrity mutation scenario 066", domain: "COMPONENT", mutation: "Apply bounded mutation 066 to the component representation and recalculate the package.", expectedReasonCode: "TIMESTAMP_ORDER_INVALID", expectedDisposition: "FAILED", institutionalMeaning: "Demonstrates that integrity condition 066 cannot change silently after commitment." },
  { scenarioId: "IHS-067", title: "Integrity mutation scenario 067", domain: "PACKAGE", mutation: "Apply bounded mutation 067 to the package representation and recalculate the package.", expectedReasonCode: "ENGINE_VERSION_MISSING", expectedDisposition: "FAILED", institutionalMeaning: "Demonstrates that integrity condition 067 cannot change silently after commitment." },
  { scenarioId: "IHS-068", title: "Integrity mutation scenario 068", domain: "MANIFEST", mutation: "Apply bounded mutation 068 to the manifest representation and recalculate the package.", expectedReasonCode: "ENGINE_VERSION_UNSUPPORTED", expectedDisposition: "FAILED", institutionalMeaning: "Demonstrates that integrity condition 068 cannot change silently after commitment." },
  { scenarioId: "IHS-069", title: "Integrity mutation scenario 069", domain: "LINEAGE", mutation: "Apply bounded mutation 069 to the lineage representation and recalculate the package.", expectedReasonCode: "POLICY_VERSION_MISSING", expectedDisposition: "FAILED", institutionalMeaning: "Demonstrates that integrity condition 069 cannot change silently after commitment." },
  { scenarioId: "IHS-070", title: "Integrity mutation scenario 070", domain: "AUDIT", mutation: "Apply bounded mutation 070 to the audit representation and recalculate the package.", expectedReasonCode: "DISCLOSURE_PROJECTION_HASH_MISSING", expectedDisposition: "VERIFIED_WITH_WARNINGS", institutionalMeaning: "Demonstrates that integrity condition 070 cannot change silently after commitment." },
  { scenarioId: "IHS-071", title: "Integrity mutation scenario 071", domain: "OFFLINE", mutation: "Apply bounded mutation 071 to the offline representation and recalculate the package.", expectedReasonCode: "DISCLOSURE_PROJECTION_HASH_MISMATCH", expectedDisposition: "FAILED", institutionalMeaning: "Demonstrates that integrity condition 071 cannot change silently after commitment." },
  { scenarioId: "IHS-072", title: "Integrity mutation scenario 072", domain: "PUBLICATION", mutation: "Apply bounded mutation 072 to the publication representation and recalculate the package.", expectedReasonCode: "CLAIMS_BOUNDARY_HASH_MISSING", expectedDisposition: "FAILED", institutionalMeaning: "Demonstrates that integrity condition 072 cannot change silently after commitment." },
  { scenarioId: "IHS-073", title: "Integrity mutation scenario 073", domain: "CANONICAL", mutation: "Apply bounded mutation 073 to the canonical representation and recalculate the package.", expectedReasonCode: "CLAIMS_BOUNDARY_HASH_MISMATCH", expectedDisposition: "FAILED", institutionalMeaning: "Demonstrates that integrity condition 073 cannot change silently after commitment." },
  { scenarioId: "IHS-074", title: "Integrity mutation scenario 074", domain: "COMPONENT", mutation: "Apply bounded mutation 074 to the component representation and recalculate the package.", expectedReasonCode: "PUBLICATION_URL_MISSING", expectedDisposition: "FAILED", institutionalMeaning: "Demonstrates that integrity condition 074 cannot change silently after commitment." },
  { scenarioId: "IHS-075", title: "Integrity mutation scenario 075", domain: "PACKAGE", mutation: "Apply bounded mutation 075 to the package representation and recalculate the package.", expectedReasonCode: "PUBLICATION_STATE_NOT_RELIABLE", expectedDisposition: "VERIFIED_WITH_WARNINGS", institutionalMeaning: "Demonstrates that integrity condition 075 cannot change silently after commitment." },
  { scenarioId: "IHS-076", title: "Integrity mutation scenario 076", domain: "MANIFEST", mutation: "Apply bounded mutation 076 to the manifest representation and recalculate the package.", expectedReasonCode: "PACKAGE_VERIFIED", expectedDisposition: "FAILED", institutionalMeaning: "Demonstrates that integrity condition 076 cannot change silently after commitment." },
  { scenarioId: "IHS-077", title: "Integrity mutation scenario 077", domain: "LINEAGE", mutation: "Apply bounded mutation 077 to the lineage representation and recalculate the package.", expectedReasonCode: "PACKAGE_VERIFICATION_FAILED", expectedDisposition: "FAILED", institutionalMeaning: "Demonstrates that integrity condition 077 cannot change silently after commitment." },
  { scenarioId: "IHS-078", title: "Integrity mutation scenario 078", domain: "AUDIT", mutation: "Apply bounded mutation 078 to the audit representation and recalculate the package.", expectedReasonCode: "COMPONENT_01_CHECK_FAILED", expectedDisposition: "FAILED", institutionalMeaning: "Demonstrates that integrity condition 078 cannot change silently after commitment." },
  { scenarioId: "IHS-079", title: "Integrity mutation scenario 079", domain: "OFFLINE", mutation: "Apply bounded mutation 079 to the offline representation and recalculate the package.", expectedReasonCode: "COMPONENT_02_CHECK_FAILED", expectedDisposition: "FAILED", institutionalMeaning: "Demonstrates that integrity condition 079 cannot change silently after commitment." },
  { scenarioId: "IHS-080", title: "Integrity mutation scenario 080", domain: "PUBLICATION", mutation: "Apply bounded mutation 080 to the publication representation and recalculate the package.", expectedReasonCode: "COMPONENT_03_CHECK_FAILED", expectedDisposition: "VERIFIED_WITH_WARNINGS", institutionalMeaning: "Demonstrates that integrity condition 080 cannot change silently after commitment." },
  { scenarioId: "IHS-081", title: "Integrity mutation scenario 081", domain: "CANONICAL", mutation: "Apply bounded mutation 081 to the canonical representation and recalculate the package.", expectedReasonCode: "COMPONENT_04_CHECK_FAILED", expectedDisposition: "FAILED", institutionalMeaning: "Demonstrates that integrity condition 081 cannot change silently after commitment." },
  { scenarioId: "IHS-082", title: "Integrity mutation scenario 082", domain: "COMPONENT", mutation: "Apply bounded mutation 082 to the component representation and recalculate the package.", expectedReasonCode: "COMPONENT_05_CHECK_FAILED", expectedDisposition: "FAILED", institutionalMeaning: "Demonstrates that integrity condition 082 cannot change silently after commitment." },
  { scenarioId: "IHS-083", title: "Integrity mutation scenario 083", domain: "PACKAGE", mutation: "Apply bounded mutation 083 to the package representation and recalculate the package.", expectedReasonCode: "COMPONENT_06_CHECK_FAILED", expectedDisposition: "FAILED", institutionalMeaning: "Demonstrates that integrity condition 083 cannot change silently after commitment." },
  { scenarioId: "IHS-084", title: "Integrity mutation scenario 084", domain: "MANIFEST", mutation: "Apply bounded mutation 084 to the manifest representation and recalculate the package.", expectedReasonCode: "COMPONENT_07_CHECK_FAILED", expectedDisposition: "FAILED", institutionalMeaning: "Demonstrates that integrity condition 084 cannot change silently after commitment." },
  { scenarioId: "IHS-085", title: "Integrity mutation scenario 085", domain: "LINEAGE", mutation: "Apply bounded mutation 085 to the lineage representation and recalculate the package.", expectedReasonCode: "COMPONENT_08_CHECK_FAILED", expectedDisposition: "VERIFIED_WITH_WARNINGS", institutionalMeaning: "Demonstrates that integrity condition 085 cannot change silently after commitment." },
  { scenarioId: "IHS-086", title: "Integrity mutation scenario 086", domain: "AUDIT", mutation: "Apply bounded mutation 086 to the audit representation and recalculate the package.", expectedReasonCode: "COMPONENT_09_CHECK_FAILED", expectedDisposition: "FAILED", institutionalMeaning: "Demonstrates that integrity condition 086 cannot change silently after commitment." },
  { scenarioId: "IHS-087", title: "Integrity mutation scenario 087", domain: "OFFLINE", mutation: "Apply bounded mutation 087 to the offline representation and recalculate the package.", expectedReasonCode: "COMPONENT_10_CHECK_FAILED", expectedDisposition: "FAILED", institutionalMeaning: "Demonstrates that integrity condition 087 cannot change silently after commitment." },
  { scenarioId: "IHS-088", title: "Integrity mutation scenario 088", domain: "PUBLICATION", mutation: "Apply bounded mutation 088 to the publication representation and recalculate the package.", expectedReasonCode: "COMPONENT_11_CHECK_FAILED", expectedDisposition: "FAILED", institutionalMeaning: "Demonstrates that integrity condition 088 cannot change silently after commitment." },
  { scenarioId: "IHS-089", title: "Integrity mutation scenario 089", domain: "CANONICAL", mutation: "Apply bounded mutation 089 to the canonical representation and recalculate the package.", expectedReasonCode: "COMPONENT_12_CHECK_FAILED", expectedDisposition: "FAILED", institutionalMeaning: "Demonstrates that integrity condition 089 cannot change silently after commitment." },
  { scenarioId: "IHS-090", title: "Integrity mutation scenario 090", domain: "COMPONENT", mutation: "Apply bounded mutation 090 to the component representation and recalculate the package.", expectedReasonCode: "LINEAGE_01_CHECK_FAILED", expectedDisposition: "VERIFIED_WITH_WARNINGS", institutionalMeaning: "Demonstrates that integrity condition 090 cannot change silently after commitment." },
  { scenarioId: "IHS-091", title: "Integrity mutation scenario 091", domain: "PACKAGE", mutation: "Apply bounded mutation 091 to the package representation and recalculate the package.", expectedReasonCode: "LINEAGE_02_CHECK_FAILED", expectedDisposition: "FAILED", institutionalMeaning: "Demonstrates that integrity condition 091 cannot change silently after commitment." },
  { scenarioId: "IHS-092", title: "Integrity mutation scenario 092", domain: "MANIFEST", mutation: "Apply bounded mutation 092 to the manifest representation and recalculate the package.", expectedReasonCode: "LINEAGE_03_CHECK_FAILED", expectedDisposition: "FAILED", institutionalMeaning: "Demonstrates that integrity condition 092 cannot change silently after commitment." },
  { scenarioId: "IHS-093", title: "Integrity mutation scenario 093", domain: "LINEAGE", mutation: "Apply bounded mutation 093 to the lineage representation and recalculate the package.", expectedReasonCode: "LINEAGE_04_CHECK_FAILED", expectedDisposition: "FAILED", institutionalMeaning: "Demonstrates that integrity condition 093 cannot change silently after commitment." },
  { scenarioId: "IHS-094", title: "Integrity mutation scenario 094", domain: "AUDIT", mutation: "Apply bounded mutation 094 to the audit representation and recalculate the package.", expectedReasonCode: "LINEAGE_05_CHECK_FAILED", expectedDisposition: "FAILED", institutionalMeaning: "Demonstrates that integrity condition 094 cannot change silently after commitment." },
  { scenarioId: "IHS-095", title: "Integrity mutation scenario 095", domain: "OFFLINE", mutation: "Apply bounded mutation 095 to the offline representation and recalculate the package.", expectedReasonCode: "LINEAGE_06_CHECK_FAILED", expectedDisposition: "VERIFIED_WITH_WARNINGS", institutionalMeaning: "Demonstrates that integrity condition 095 cannot change silently after commitment." },
  { scenarioId: "IHS-096", title: "Integrity mutation scenario 096", domain: "PUBLICATION", mutation: "Apply bounded mutation 096 to the publication representation and recalculate the package.", expectedReasonCode: "LINEAGE_07_CHECK_FAILED", expectedDisposition: "FAILED", institutionalMeaning: "Demonstrates that integrity condition 096 cannot change silently after commitment." },
  { scenarioId: "IHS-097", title: "Integrity mutation scenario 097", domain: "CANONICAL", mutation: "Apply bounded mutation 097 to the canonical representation and recalculate the package.", expectedReasonCode: "LINEAGE_08_CHECK_FAILED", expectedDisposition: "FAILED", institutionalMeaning: "Demonstrates that integrity condition 097 cannot change silently after commitment." },
  { scenarioId: "IHS-098", title: "Integrity mutation scenario 098", domain: "COMPONENT", mutation: "Apply bounded mutation 098 to the component representation and recalculate the package.", expectedReasonCode: "PARITY_01_CHECK_FAILED", expectedDisposition: "FAILED", institutionalMeaning: "Demonstrates that integrity condition 098 cannot change silently after commitment." },
  { scenarioId: "IHS-099", title: "Integrity mutation scenario 099", domain: "PACKAGE", mutation: "Apply bounded mutation 099 to the package representation and recalculate the package.", expectedReasonCode: "PARITY_02_CHECK_FAILED", expectedDisposition: "FAILED", institutionalMeaning: "Demonstrates that integrity condition 099 cannot change silently after commitment." },
  { scenarioId: "IHS-100", title: "Integrity mutation scenario 100", domain: "MANIFEST", mutation: "Apply bounded mutation 100 to the manifest representation and recalculate the package.", expectedReasonCode: "PARITY_03_CHECK_FAILED", expectedDisposition: "VERIFIED_WITH_WARNINGS", institutionalMeaning: "Demonstrates that integrity condition 100 cannot change silently after commitment." },
  { scenarioId: "IHS-101", title: "Integrity mutation scenario 101", domain: "LINEAGE", mutation: "Apply bounded mutation 101 to the lineage representation and recalculate the package.", expectedReasonCode: "PARITY_04_CHECK_FAILED", expectedDisposition: "FAILED", institutionalMeaning: "Demonstrates that integrity condition 101 cannot change silently after commitment." },
  { scenarioId: "IHS-102", title: "Integrity mutation scenario 102", domain: "AUDIT", mutation: "Apply bounded mutation 102 to the audit representation and recalculate the package.", expectedReasonCode: "PARITY_05_CHECK_FAILED", expectedDisposition: "FAILED", institutionalMeaning: "Demonstrates that integrity condition 102 cannot change silently after commitment." },
  { scenarioId: "IHS-103", title: "Integrity mutation scenario 103", domain: "OFFLINE", mutation: "Apply bounded mutation 103 to the offline representation and recalculate the package.", expectedReasonCode: "PARITY_06_CHECK_FAILED", expectedDisposition: "FAILED", institutionalMeaning: "Demonstrates that integrity condition 103 cannot change silently after commitment." },
  { scenarioId: "IHS-104", title: "Integrity mutation scenario 104", domain: "PUBLICATION", mutation: "Apply bounded mutation 104 to the publication representation and recalculate the package.", expectedReasonCode: "CANONICAL_INPUT_MISSING", expectedDisposition: "FAILED", institutionalMeaning: "Demonstrates that integrity condition 104 cannot change silently after commitment." },
  { scenarioId: "IHS-105", title: "Integrity mutation scenario 105", domain: "CANONICAL", mutation: "Apply bounded mutation 105 to the canonical representation and recalculate the package.", expectedReasonCode: "CANONICAL_SERIALIZATION_FAILED", expectedDisposition: "VERIFIED_WITH_WARNINGS", institutionalMeaning: "Demonstrates that integrity condition 105 cannot change silently after commitment." },
  { scenarioId: "IHS-106", title: "Integrity mutation scenario 106", domain: "COMPONENT", mutation: "Apply bounded mutation 106 to the component representation and recalculate the package.", expectedReasonCode: "CANONICAL_HASH_MISSING", expectedDisposition: "FAILED", institutionalMeaning: "Demonstrates that integrity condition 106 cannot change silently after commitment." },
  { scenarioId: "IHS-107", title: "Integrity mutation scenario 107", domain: "PACKAGE", mutation: "Apply bounded mutation 107 to the package representation and recalculate the package.", expectedReasonCode: "CANONICAL_HASH_MISMATCH", expectedDisposition: "FAILED", institutionalMeaning: "Demonstrates that integrity condition 107 cannot change silently after commitment." },
  { scenarioId: "IHS-108", title: "Integrity mutation scenario 108", domain: "MANIFEST", mutation: "Apply bounded mutation 108 to the manifest representation and recalculate the package.", expectedReasonCode: "COMPONENT_ID_MISSING", expectedDisposition: "FAILED", institutionalMeaning: "Demonstrates that integrity condition 108 cannot change silently after commitment." },
  { scenarioId: "IHS-109", title: "Integrity mutation scenario 109", domain: "LINEAGE", mutation: "Apply bounded mutation 109 to the lineage representation and recalculate the package.", expectedReasonCode: "COMPONENT_DUPLICATE_ID", expectedDisposition: "FAILED", institutionalMeaning: "Demonstrates that integrity condition 109 cannot change silently after commitment." },
  { scenarioId: "IHS-110", title: "Integrity mutation scenario 110", domain: "AUDIT", mutation: "Apply bounded mutation 110 to the audit representation and recalculate the package.", expectedReasonCode: "COMPONENT_BYTES_MISSING", expectedDisposition: "VERIFIED_WITH_WARNINGS", institutionalMeaning: "Demonstrates that integrity condition 110 cannot change silently after commitment." },
  { scenarioId: "IHS-111", title: "Integrity mutation scenario 111", domain: "OFFLINE", mutation: "Apply bounded mutation 111 to the offline representation and recalculate the package.", expectedReasonCode: "COMPONENT_HASH_MISSING", expectedDisposition: "FAILED", institutionalMeaning: "Demonstrates that integrity condition 111 cannot change silently after commitment." },
  { scenarioId: "IHS-112", title: "Integrity mutation scenario 112", domain: "PUBLICATION", mutation: "Apply bounded mutation 112 to the publication representation and recalculate the package.", expectedReasonCode: "COMPONENT_HASH_MISMATCH", expectedDisposition: "FAILED", institutionalMeaning: "Demonstrates that integrity condition 112 cannot change silently after commitment." },
  { scenarioId: "IHS-113", title: "Integrity mutation scenario 113", domain: "CANONICAL", mutation: "Apply bounded mutation 113 to the canonical representation and recalculate the package.", expectedReasonCode: "COMPONENT_MEDIA_TYPE_MISSING", expectedDisposition: "FAILED", institutionalMeaning: "Demonstrates that integrity condition 113 cannot change silently after commitment." },
  { scenarioId: "IHS-114", title: "Integrity mutation scenario 114", domain: "COMPONENT", mutation: "Apply bounded mutation 114 to the component representation and recalculate the package.", expectedReasonCode: "PACKAGE_ROOT_MISSING", expectedDisposition: "FAILED", institutionalMeaning: "Demonstrates that integrity condition 114 cannot change silently after commitment." },
  { scenarioId: "IHS-115", title: "Integrity mutation scenario 115", domain: "PACKAGE", mutation: "Apply bounded mutation 115 to the package representation and recalculate the package.", expectedReasonCode: "PACKAGE_ROOT_MISMATCH", expectedDisposition: "VERIFIED_WITH_WARNINGS", institutionalMeaning: "Demonstrates that integrity condition 115 cannot change silently after commitment." },
  { scenarioId: "IHS-116", title: "Integrity mutation scenario 116", domain: "MANIFEST", mutation: "Apply bounded mutation 116 to the manifest representation and recalculate the package.", expectedReasonCode: "PACKAGE_COMPONENT_COUNT_MISMATCH", expectedDisposition: "FAILED", institutionalMeaning: "Demonstrates that integrity condition 116 cannot change silently after commitment." },
  { scenarioId: "IHS-117", title: "Integrity mutation scenario 117", domain: "LINEAGE", mutation: "Apply bounded mutation 117 to the lineage representation and recalculate the package.", expectedReasonCode: "PACKAGE_ORDER_NONDETERMINISTIC", expectedDisposition: "FAILED", institutionalMeaning: "Demonstrates that integrity condition 117 cannot change silently after commitment." },
  { scenarioId: "IHS-118", title: "Integrity mutation scenario 118", domain: "AUDIT", mutation: "Apply bounded mutation 118 to the audit representation and recalculate the package.", expectedReasonCode: "MANIFEST_MISSING", expectedDisposition: "FAILED", institutionalMeaning: "Demonstrates that integrity condition 118 cannot change silently after commitment." },
  { scenarioId: "IHS-119", title: "Integrity mutation scenario 119", domain: "OFFLINE", mutation: "Apply bounded mutation 119 to the offline representation and recalculate the package.", expectedReasonCode: "MANIFEST_HASH_MISSING", expectedDisposition: "FAILED", institutionalMeaning: "Demonstrates that integrity condition 119 cannot change silently after commitment." },
  { scenarioId: "IHS-120", title: "Integrity mutation scenario 120", domain: "PUBLICATION", mutation: "Apply bounded mutation 120 to the publication representation and recalculate the package.", expectedReasonCode: "MANIFEST_HASH_MISMATCH", expectedDisposition: "VERIFIED_WITH_WARNINGS", institutionalMeaning: "Demonstrates that integrity condition 120 cannot change silently after commitment." },
] as const;

export function integrityScenariosByDomain(domain: IntegrityDomain): readonly IntegrityScenarioDefinition[] {
  return INTEGRITY_SCENARIO_CATALOG.filter((scenario) => scenario.domain === domain);
}

export function integrityScenarioById(scenarioId: string): IntegrityScenarioDefinition | undefined {
  return INTEGRITY_SCENARIO_CATALOG.find((scenario) => scenario.scenarioId === scenarioId);
}

export function expectedReasonCodesForDomain(domain: IntegrityDomain): readonly IntegrityReasonCode[] {
  return Array.from(new Set(
    INTEGRITY_SCENARIO_CATALOG
      .filter((scenario) => scenario.domain === domain)
      .map((scenario) => scenario.expectedReasonCode),
  ));
}

export function describeIntegrityEngine(): string {
  return [
    `TA-14 Integrity & Hash Engine ${TA14_INTEGRITY_HASH_ENGINE_VERSION}`,
    `Policy ${TA14_INTEGRITY_POLICY_VERSION}`,
    `Canonicalization ${TA14_CANONICALIZATION_VERSION}`,
    `Algorithm ${TA14_HASH_ALGORITHM}`,
    `${INTEGRITY_REASON_DEFINITIONS.length} reason definitions`,
    `${INTEGRITY_CONTROLS.length} institutional controls`,
    `${INTEGRITY_ACCEPTANCE_TESTS.length} acceptance tests`,
    `${INTEGRITY_COMPONENT_PROFILES.length} component profiles`,
    `${INTEGRITY_LINEAGE_POLICIES.length} lineage policies`,
    `${INTEGRITY_SCENARIO_CATALOG.length} mutation scenarios`,
  ].join(" | ");
}

export const INTEGRITY_ENGINE_EXPORTS = {
  engineVersion: TA14_INTEGRITY_HASH_ENGINE_VERSION,
  policyVersion: TA14_INTEGRITY_POLICY_VERSION,
  canonicalizationVersion: TA14_CANONICALIZATION_VERSION,
  hashAlgorithm: TA14_HASH_ALGORITHM,
  rule: TA14_INTEGRITY_RULE,
  reasonCodeCount: INTEGRITY_REASON_DEFINITIONS.length,
  controlCount: INTEGRITY_CONTROLS.length,
  acceptanceTestCount: INTEGRITY_ACCEPTANCE_TESTS.length,
  componentProfileCount: INTEGRITY_COMPONENT_PROFILES.length,
  lineagePolicyCount: INTEGRITY_LINEAGE_POLICIES.length,
  offlineChecklistCount: OFFLINE_VERIFICATION_CHECKLIST.length,
  scenarioCount: INTEGRITY_SCENARIO_CATALOG.length,
} as const;
