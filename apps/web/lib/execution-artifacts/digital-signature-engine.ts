/**
 * TA-14 Authority | Digital Signature & Attestation Engine
 * Version 1.0.0
 *
 * Institutional purpose:
 *   Bind accountable identities to exact execution-artifact bytes, canonical
 *   records, manifests, registry records, verification reports, challenges,
 *   corrections, and portfolio exports without claiming that a signature
 *   proves the underlying governance conclusion is true.
 *
 * Governing rules:
 *   A signature proves who accepted responsibility, when, under which policy,
 *   and exactly what was signed. It does not prove truth, admissibility,
 *   authority, execution effect, or outcome closure by itself.
 *
 *   No registered governance. No registered artifact.
 *   No admissible evidence. No admissible execution.
 */

import type { CanonicalExecutionArtifact } from "./canonical-record-validator";
import type {
  ArtifactRegistryRecord,
  RegistryPublicationManifest,
} from "./artifact-registry-engine";
import type {
  IntegrityManifest,
  IntegrityComponentDigest,
} from "./integrity-hash-engine";
import {
  TA14_CANONICALIZATION_VERSION,
  TA14_HASH_ALGORITHM,
  canonicalize,
  constantTimeHexEqual,
  sha256Hex,
} from "./integrity-hash-engine";

export const TA14_SIGNATURE_ENGINE_VERSION = "1.0.0" as const;
export const TA14_SIGNATURE_POLICY_VERSION = "1.0" as const;
export const TA14_SIGNATURE_ENVELOPE_VERSION = "TA14-SIG-1" as const;
export const TA14_ATTESTATION_RULE =
  "A SIGNATURE PROVES ATTRIBUTABLE ACCEPTANCE OF EXACT BYTES; IT DOES NOT PROVE TRUTH" as const;

export type SignatureAlgorithm =
  | "ED25519"
  | "ECDSA_P256_SHA256"
  | "RSA_PSS_SHA256"
  | "EXTERNAL_QUALIFIED_SIGNATURE";

export type SignatureEncoding = "BASE64" | "BASE64URL" | "HEX";
export type SignatureStatus =
  | "UNSIGNED"
  | "VALID"
  | "INVALID"
  | "EXPIRED"
  | "REVOKED"
  | "KEY_UNKNOWN"
  | "POLICY_REJECTED"
  | "VERIFICATION_UNAVAILABLE";
export type AttestationRole =
  | "GOVERNANCE_ACCOUNTABLE_OWNER"
  | "ARTIFACT_PUBLISHER"
  | "ROUTE_STEWARD"
  | "EVIDENCE_CUSTODIAN"
  | "AUTHORITY_RESOLVER"
  | "EXECUTION_ADAPTER_OWNER"
  | "OUTCOME_VERIFIER"
  | "ARTIFACT_REVIEWER"
  | "INDEPENDENT_REVIEWER"
  | "CHALLENGE_OFFICER"
  | "REGISTRY_STEWARD"
  | "REGULATORY_REVIEWER"
  | "CONTRACTUAL_REVIEWER";
export type SignatureSubjectKind =
  | "CANONICAL_ARTIFACT"
  | "PUBLIC_PDF"
  | "INTEGRITY_MANIFEST"
  | "REGISTRY_RECORD"
  | "REGISTRY_MANIFEST"
  | "VERIFICATION_REPORT"
  | "DISCLOSURE_PROJECTION"
  | "CHALLENGE_RECORD"
  | "CORRECTION_RECORD"
  | "SUPERSESSION_RECORD"
  | "WITHDRAWAL_RECORD"
  | "PORTFOLIO_EXPORT"
  | "OTHER";
export type AttestationDecision =
  | "ACCEPTED"
  | "ACCEPTED_WITH_LIMITS"
  | "DECLINED"
  | "WITHDRAWN";
export type SignatureSeverity = "INFO" | "WARNING" | "ERROR";
export type SignatureDisposition =
  | "VERIFIED"
  | "VERIFIED_WITH_WARNINGS"
  | "FAILED"
  | "INDETERMINATE";

export interface SignerIdentity {
  signerId: string;
  displayName: string;
  organizationId: string;
  governanceRegistrationId?: string;
  role: AttestationRole;
  email?: string;
  jurisdiction?: string;
  identityProvider?: string;
  identityAssuranceLevel?: "LOW" | "SUBSTANTIAL" | "HIGH";
  credentialId?: string;
}

export interface PublicKeyDescriptor {
  keyId: string;
  algorithm: SignatureAlgorithm;
  encoding: "JWK" | "PEM" | "DER" | "DID" | "EXTERNAL_REFERENCE";
  publicKey: string;
  fingerprint: string;
  issuedAt: string;
  expiresAt?: string;
  revokedAt?: string;
  revocationReason?: string;
  issuer?: string;
  certificateChain?: readonly string[];
  usage: readonly ("SIGN" | "VERIFY" | "ATTEST")[];
}

export interface SignaturePolicy {
  policyId: string;
  version: string;
  title: string;
  acceptedAlgorithms: readonly SignatureAlgorithm[];
  minimumIdentityAssurance: "LOW" | "SUBSTANTIAL" | "HIGH";
  requireGovernanceRegistration: boolean;
  requireRegistryPublication: boolean;
  requireTrustedTimestamp: boolean;
  maximumSignatureAgeDays?: number;
  requiredRoles: readonly AttestationRole[];
  minimumIndependentReviewers: number;
  allowExpiredKeyForHistoricalVerification: boolean;
  allowRevokedKeyForPreRevocationSignature: boolean;
  permittedSubjectKinds: readonly SignatureSubjectKind[];
}

export interface SignatureSubject {
  subjectId: string;
  kind: SignatureSubjectKind;
  mediaType: string;
  canonicalizationVersion: string;
  hashAlgorithm: "SHA-256";
  digest: string;
  byteLength?: number;
  version?: string;
  stableUrl?: string;
  createdAt?: string;
}

export interface AttestationStatement {
  attestationId: string;
  statementVersion: string;
  decision: AttestationDecision;
  role: AttestationRole;
  statement: string;
  claimsAccepted: readonly string[];
  claimsExcluded: readonly string[];
  limitations: readonly string[];
  effectiveAt: string;
  expiresAt?: string;
  policyId: string;
  policyVersion: string;
}

export interface SignatureEnvelope {
  envelopeId: string;
  envelopeVersion: typeof TA14_SIGNATURE_ENVELOPE_VERSION;
  signatureEngineVersion: string;
  signaturePolicyVersion: string;
  createdAt: string;
  signedAt: string;
  signer: SignerIdentity;
  publicKey: PublicKeyDescriptor;
  subject: SignatureSubject;
  attestation: AttestationStatement;
  protectedHeaders: Readonly<Record<string, string>>;
  signingPayloadDigest: string;
  signatureAlgorithm: SignatureAlgorithm;
  signatureEncoding: SignatureEncoding;
  signatureValue: string;
  trustedTimestamp?: TrustedTimestamp;
  parentEnvelopeId?: string;
  parentEnvelopeHash?: string;
  envelopeHash: string;
}

export interface TrustedTimestamp {
  timestampId: string;
  authorityId: string;
  issuedAt: string;
  subjectDigest: string;
  token: string;
  tokenEncoding: SignatureEncoding;
  verificationUrl?: string;
}

export interface SignatureChainEntry {
  sequence: number;
  envelopeId: string;
  envelopeHash: string;
  signerId: string;
  signerRole: AttestationRole;
  signedAt: string;
  subjectDigest: string;
  parentEnvelopeHash?: string;
}

export interface SignatureManifest {
  manifestId: string;
  manifestVersion: string;
  artifactId: string;
  registryId?: string;
  governanceRegistrationId?: string;
  generatedAt: string;
  generatedBy: string;
  signaturePolicyId: string;
  signaturePolicyVersion: string;
  subjectDigests: readonly SignatureSubject[];
  envelopes: readonly SignatureEnvelope[];
  chain: readonly SignatureChainEntry[];
  requiredRoles: readonly AttestationRole[];
  satisfiedRoles: readonly AttestationRole[];
  missingRoles: readonly AttestationRole[];
  manifestHash: string;
}

export interface SignatureIssue {
  code: SignatureReasonCode;
  severity: SignatureSeverity;
  title: string;
  message: string;
  envelopeId?: string;
  signerId?: string;
  keyId?: string;
  path?: string;
  expected?: unknown;
  actual?: unknown;
}

export interface SignatureVerificationResult {
  disposition: SignatureDisposition;
  status: SignatureStatus;
  verified: boolean;
  verifiedAt: string;
  verifierId: string;
  engineVersion: string;
  policyVersion: string;
  envelopeId: string;
  envelopeHash: string;
  subjectDigestMatches: boolean;
  payloadDigestMatches: boolean;
  cryptographicSignatureValid: boolean | null;
  timestampValid: boolean | null;
  identityAccepted: boolean;
  keyAccepted: boolean;
  policyAccepted: boolean;
  issues: readonly SignatureIssue[];
}

export interface SignatureManifestVerificationResult {
  disposition: SignatureDisposition;
  verified: boolean;
  verifiedAt: string;
  verifierId: string;
  manifestHashMatches: boolean;
  chainValid: boolean;
  requiredRolesSatisfied: boolean;
  envelopeResults: readonly SignatureVerificationResult[];
  issues: readonly SignatureIssue[];
}

export interface SignatureProvider {
  providerId: string;
  supportedAlgorithms: readonly SignatureAlgorithm[];
  sign(request: {
    algorithm: SignatureAlgorithm;
    keyId: string;
    payload: Uint8Array;
  }): Promise<{ signature: Uint8Array; signedAt?: string }>;
  verify(request: {
    algorithm: SignatureAlgorithm;
    publicKey: PublicKeyDescriptor;
    payload: Uint8Array;
    signature: Uint8Array;
  }): Promise<boolean>;
}

export interface TimestampProvider {
  providerId: string;
  issue(subjectDigest: string): Promise<TrustedTimestamp>;
  verify(timestamp: TrustedTimestamp): Promise<boolean>;
}

export interface CreateSignatureEnvelopeRequest {
  signer: SignerIdentity;
  publicKey: PublicKeyDescriptor;
  subject: SignatureSubject;
  attestation: AttestationStatement;
  policy: SignaturePolicy;
  provider: SignatureProvider;
  timestampProvider?: TimestampProvider;
  protectedHeaders?: Readonly<Record<string, string>>;
  parentEnvelope?: SignatureEnvelope;
  now?: string;
  signatureEncoding?: SignatureEncoding;
}

export interface VerifySignatureEnvelopeRequest {
  envelope: SignatureEnvelope;
  policy: SignaturePolicy;
  provider?: SignatureProvider;
  timestampProvider?: TimestampProvider;
  expectedSubject?: SignatureSubject;
  expectedSignerId?: string;
  verifierId: string;
  now?: string;
}

export interface CreateSignatureManifestRequest {
  artifactId: string;
  registryId?: string;
  governanceRegistrationId?: string;
  generatedBy: string;
  policy: SignaturePolicy;
  subjects: readonly SignatureSubject[];
  envelopes: readonly SignatureEnvelope[];
  generatedAt?: string;
}

export interface SignatureAttestationCertificate {
  certificateId: string;
  artifactId: string;
  registryId?: string;
  governanceRegistrationId?: string;
  signerId: string;
  signerName: string;
  signerRole: AttestationRole;
  organizationId: string;
  decision: AttestationDecision;
  subjectId: string;
  subjectDigest: string;
  signedAt: string;
  signatureAlgorithm: SignatureAlgorithm;
  keyId: string;
  keyFingerprint: string;
  envelopeId: string;
  envelopeHash: string;
  statement: string;
  limitations: readonly string[];
  verificationStatus: SignatureStatus;
  certificateHash: string;
}

export interface SignatureAuditEvent {
  eventId: string;
  sequence: number;
  occurredAt: string;
  actorId: string;
  eventType:
    | "SIGNATURE_REQUESTED"
    | "SIGNATURE_CREATED"
    | "SIGNATURE_VERIFIED"
    | "SIGNATURE_FAILED"
    | "KEY_REVOKED"
    | "ATTESTATION_WITHDRAWN"
    | "MANIFEST_CREATED"
    | "MANIFEST_VERIFIED";
  subjectId: string;
  envelopeId?: string;
  description: string;
  previousHash: string;
  eventHash: string;
}

export interface SignatureControlDefinition {
  controlId: string;
  title: string;
  requirement: string;
  domain: "IDENTITY" | "KEY" | "SUBJECT" | "PAYLOAD" | "SIGNATURE" | "TIME" | "POLICY" | "CHAIN" | "MANIFEST" | "ATTESTATION";
}

export interface SignatureAcceptanceTest {
  testId: string;
  title: string;
  passCondition: string;
}

export interface SignatureReasonDefinition {
  code: SignatureReasonCode;
  severity: SignatureSeverity;
  title: string;
  description: string;
}

export type SignatureReasonCode =
  | "SIGNATURE_VALID"
  | "SIGNATURE_INVALID"
  | "SIGNATURE_MISSING"
  | "SIGNATURE_VERIFICATION_UNAVAILABLE"
  | "ALGORITHM_UNSUPPORTED"
  | "ALGORITHM_POLICY_REJECTED"
  | "SIGNATURE_ENCODING_INVALID"
  | "SIGNATURE_VALUE_EMPTY"
  | "ENVELOPE_ID_MISSING"
  | "ENVELOPE_VERSION_UNSUPPORTED"
  | "ENVELOPE_HASH_MISMATCH"
  | "PAYLOAD_DIGEST_MISMATCH"
  | "SUBJECT_DIGEST_MISMATCH"
  | "SUBJECT_ID_MISMATCH"
  | "SUBJECT_KIND_POLICY_REJECTED"
  | "SUBJECT_MEDIA_TYPE_MISSING"
  | "SUBJECT_HASH_INVALID"
  | "SUBJECT_BYTE_LENGTH_INVALID"
  | "CANONICALIZATION_VERSION_MISMATCH"
  | "HASH_ALGORITHM_MISMATCH"
  | "SIGNER_ID_MISSING"
  | "SIGNER_NAME_MISSING"
  | "SIGNER_ORGANIZATION_MISSING"
  | "SIGNER_ROLE_MISSING"
  | "SIGNER_ROLE_POLICY_REJECTED"
  | "SIGNER_GOVERNANCE_REGISTRATION_MISSING"
  | "IDENTITY_ASSURANCE_INSUFFICIENT"
  | "IDENTITY_PROVIDER_MISSING"
  | "KEY_ID_MISSING"
  | "KEY_UNKNOWN"
  | "KEY_FINGERPRINT_MISMATCH"
  | "KEY_ALGORITHM_MISMATCH"
  | "KEY_USAGE_REJECTED"
  | "KEY_NOT_YET_VALID"
  | "KEY_EXPIRED"
  | "KEY_REVOKED"
  | "KEY_REVOCATION_AMBIGUOUS"
  | "CERTIFICATE_CHAIN_INVALID"
  | "TRUST_ANCHOR_UNKNOWN"
  | "SIGNATURE_TIME_MISSING"
  | "SIGNATURE_TIME_IN_FUTURE"
  | "SIGNATURE_TOO_OLD"
  | "ATTESTATION_ID_MISSING"
  | "ATTESTATION_STATEMENT_EMPTY"
  | "ATTESTATION_POLICY_MISMATCH"
  | "ATTESTATION_ROLE_MISMATCH"
  | "ATTESTATION_EXPIRED"
  | "ATTESTATION_WITHDRAWN"
  | "CLAIMS_ACCEPTED_EMPTY"
  | "CLAIMS_BOUNDARY_MISSING"
  | "LIMITATIONS_MISSING"
  | "TRUSTED_TIMESTAMP_REQUIRED"
  | "TRUSTED_TIMESTAMP_MISSING"
  | "TRUSTED_TIMESTAMP_INVALID"
  | "TRUSTED_TIMESTAMP_SUBJECT_MISMATCH"
  | "PARENT_ENVELOPE_MISSING"
  | "PARENT_ENVELOPE_HASH_MISMATCH"
  | "SIGNATURE_CHAIN_SEQUENCE_INVALID"
  | "SIGNATURE_CHAIN_BROKEN"
  | "SIGNATURE_CHAIN_DUPLICATE"
  | "MANIFEST_ID_MISSING"
  | "MANIFEST_HASH_MISMATCH"
  | "MANIFEST_SUBJECT_MISSING"
  | "MANIFEST_ENVELOPE_MISSING"
  | "MANIFEST_REQUIRED_ROLE_MISSING"
  | "MANIFEST_DUPLICATE_SIGNER"
  | "MANIFEST_DUPLICATE_ROLE"
  | "REGISTRY_ID_MISSING"
  | "GOVERNANCE_REGISTRATION_MISMATCH"
  | "ARTIFACT_ID_MISMATCH"
  | "REGISTRY_PUBLICATION_REQUIRED"
  | "INDEPENDENT_REVIEW_REQUIRED"
  | "INDEPENDENT_REVIEWER_CONFLICT"
  | "MULTISIGNATURE_THRESHOLD_NOT_MET"
  | "PUBLISHER_SIGNATURE_REQUIRED"
  | "ACCOUNTABLE_OWNER_SIGNATURE_REQUIRED"
  | "SIGNATURE_PROVIDER_FAILED"
  | "TIMESTAMP_PROVIDER_FAILED"
  | "POLICY_ID_MISSING"
  | "POLICY_VERSION_MISMATCH"
  | "POLICY_ACCEPTED"
  | "HISTORICAL_SIGNATURE_ACCEPTED"
  | "HISTORICAL_SIGNATURE_REJECTED"
  | "REVOCATION_AFTER_SIGNATURE_ACCEPTED"
  | "REVOCATION_BEFORE_SIGNATURE_REJECTED"
  | "EXTERNAL_SIGNATURE_UNVERIFIED"
  | "SIGNATURE_MANIFEST_VALID"
  | "SIGNATURE_MANIFEST_INVALID"
  | "ATTESTATION_CERTIFICATE_CREATED"
  | "AUDIT_CHAIN_INVALID"
  | "AUDIT_EVENT_HASH_MISMATCH"
  | "INPUT_INVALID"
  | "ENGINE_ERROR";

export const SIGNATURE_REASON_DEFINITIONS: readonly SignatureReasonDefinition[] = [
  { code: "SIGNATURE_VALID", severity: "INFO", title: "Signature Valid", description: "Institutional signature condition: signature valid." },
  { code: "SIGNATURE_INVALID", severity: "ERROR", title: "Signature Invalid", description: "Institutional signature condition: signature invalid." },
  { code: "SIGNATURE_MISSING", severity: "WARNING", title: "Signature Missing", description: "Institutional signature condition: signature missing." },
  { code: "SIGNATURE_VERIFICATION_UNAVAILABLE", severity: "WARNING", title: "Signature Verification Unavailable", description: "Institutional signature condition: signature verification unavailable." },
  { code: "ALGORITHM_UNSUPPORTED", severity: "ERROR", title: "Algorithm Unsupported", description: "Institutional signature condition: algorithm unsupported." },
  { code: "ALGORITHM_POLICY_REJECTED", severity: "ERROR", title: "Algorithm Policy Rejected", description: "Institutional signature condition: algorithm policy rejected." },
  { code: "SIGNATURE_ENCODING_INVALID", severity: "ERROR", title: "Signature Encoding Invalid", description: "Institutional signature condition: signature encoding invalid." },
  { code: "SIGNATURE_VALUE_EMPTY", severity: "ERROR", title: "Signature Value Empty", description: "Institutional signature condition: signature value empty." },
  { code: "ENVELOPE_ID_MISSING", severity: "WARNING", title: "Envelope Id Missing", description: "Institutional signature condition: envelope id missing." },
  { code: "ENVELOPE_VERSION_UNSUPPORTED", severity: "ERROR", title: "Envelope Version Unsupported", description: "Institutional signature condition: envelope version unsupported." },
  { code: "ENVELOPE_HASH_MISMATCH", severity: "ERROR", title: "Envelope Hash Mismatch", description: "Institutional signature condition: envelope hash mismatch." },
  { code: "PAYLOAD_DIGEST_MISMATCH", severity: "ERROR", title: "Payload Digest Mismatch", description: "Institutional signature condition: payload digest mismatch." },
  { code: "SUBJECT_DIGEST_MISMATCH", severity: "ERROR", title: "Subject Digest Mismatch", description: "Institutional signature condition: subject digest mismatch." },
  { code: "SUBJECT_ID_MISMATCH", severity: "ERROR", title: "Subject Id Mismatch", description: "Institutional signature condition: subject id mismatch." },
  { code: "SUBJECT_KIND_POLICY_REJECTED", severity: "ERROR", title: "Subject Kind Policy Rejected", description: "Institutional signature condition: subject kind policy rejected." },
  { code: "SUBJECT_MEDIA_TYPE_MISSING", severity: "WARNING", title: "Subject Media Type Missing", description: "Institutional signature condition: subject media type missing." },
  { code: "SUBJECT_HASH_INVALID", severity: "ERROR", title: "Subject Hash Invalid", description: "Institutional signature condition: subject hash invalid." },
  { code: "SUBJECT_BYTE_LENGTH_INVALID", severity: "ERROR", title: "Subject Byte Length Invalid", description: "Institutional signature condition: subject byte length invalid." },
  { code: "CANONICALIZATION_VERSION_MISMATCH", severity: "ERROR", title: "Canonicalization Version Mismatch", description: "Institutional signature condition: canonicalization version mismatch." },
  { code: "HASH_ALGORITHM_MISMATCH", severity: "ERROR", title: "Hash Algorithm Mismatch", description: "Institutional signature condition: hash algorithm mismatch." },
  { code: "SIGNER_ID_MISSING", severity: "WARNING", title: "Signer Id Missing", description: "Institutional signature condition: signer id missing." },
  { code: "SIGNER_NAME_MISSING", severity: "WARNING", title: "Signer Name Missing", description: "Institutional signature condition: signer name missing." },
  { code: "SIGNER_ORGANIZATION_MISSING", severity: "WARNING", title: "Signer Organization Missing", description: "Institutional signature condition: signer organization missing." },
  { code: "SIGNER_ROLE_MISSING", severity: "WARNING", title: "Signer Role Missing", description: "Institutional signature condition: signer role missing." },
  { code: "SIGNER_ROLE_POLICY_REJECTED", severity: "ERROR", title: "Signer Role Policy Rejected", description: "Institutional signature condition: signer role policy rejected." },
  { code: "SIGNER_GOVERNANCE_REGISTRATION_MISSING", severity: "WARNING", title: "Signer Governance Registration Missing", description: "Institutional signature condition: signer governance registration missing." },
  { code: "IDENTITY_ASSURANCE_INSUFFICIENT", severity: "ERROR", title: "Identity Assurance Insufficient", description: "Institutional signature condition: identity assurance insufficient." },
  { code: "IDENTITY_PROVIDER_MISSING", severity: "WARNING", title: "Identity Provider Missing", description: "Institutional signature condition: identity provider missing." },
  { code: "KEY_ID_MISSING", severity: "WARNING", title: "Key Id Missing", description: "Institutional signature condition: key id missing." },
  { code: "KEY_UNKNOWN", severity: "ERROR", title: "Key Unknown", description: "Institutional signature condition: key unknown." },
  { code: "KEY_FINGERPRINT_MISMATCH", severity: "ERROR", title: "Key Fingerprint Mismatch", description: "Institutional signature condition: key fingerprint mismatch." },
  { code: "KEY_ALGORITHM_MISMATCH", severity: "ERROR", title: "Key Algorithm Mismatch", description: "Institutional signature condition: key algorithm mismatch." },
  { code: "KEY_USAGE_REJECTED", severity: "ERROR", title: "Key Usage Rejected", description: "Institutional signature condition: key usage rejected." },
  { code: "KEY_NOT_YET_VALID", severity: "ERROR", title: "Key Not Yet Valid", description: "Institutional signature condition: key not yet valid." },
  { code: "KEY_EXPIRED", severity: "ERROR", title: "Key Expired", description: "Institutional signature condition: key expired." },
  { code: "KEY_REVOKED", severity: "ERROR", title: "Key Revoked", description: "Institutional signature condition: key revoked." },
  { code: "KEY_REVOCATION_AMBIGUOUS", severity: "WARNING", title: "Key Revocation Ambiguous", description: "Institutional signature condition: key revocation ambiguous." },
  { code: "CERTIFICATE_CHAIN_INVALID", severity: "ERROR", title: "Certificate Chain Invalid", description: "Institutional signature condition: certificate chain invalid." },
  { code: "TRUST_ANCHOR_UNKNOWN", severity: "ERROR", title: "Trust Anchor Unknown", description: "Institutional signature condition: trust anchor unknown." },
  { code: "SIGNATURE_TIME_MISSING", severity: "WARNING", title: "Signature Time Missing", description: "Institutional signature condition: signature time missing." },
  { code: "SIGNATURE_TIME_IN_FUTURE", severity: "ERROR", title: "Signature Time In Future", description: "Institutional signature condition: signature time in future." },
  { code: "SIGNATURE_TOO_OLD", severity: "ERROR", title: "Signature Too Old", description: "Institutional signature condition: signature too old." },
  { code: "ATTESTATION_ID_MISSING", severity: "WARNING", title: "Attestation Id Missing", description: "Institutional signature condition: attestation id missing." },
  { code: "ATTESTATION_STATEMENT_EMPTY", severity: "ERROR", title: "Attestation Statement Empty", description: "Institutional signature condition: attestation statement empty." },
  { code: "ATTESTATION_POLICY_MISMATCH", severity: "ERROR", title: "Attestation Policy Mismatch", description: "Institutional signature condition: attestation policy mismatch." },
  { code: "ATTESTATION_ROLE_MISMATCH", severity: "ERROR", title: "Attestation Role Mismatch", description: "Institutional signature condition: attestation role mismatch." },
  { code: "ATTESTATION_EXPIRED", severity: "ERROR", title: "Attestation Expired", description: "Institutional signature condition: attestation expired." },
  { code: "ATTESTATION_WITHDRAWN", severity: "ERROR", title: "Attestation Withdrawn", description: "Institutional signature condition: attestation withdrawn." },
  { code: "CLAIMS_ACCEPTED_EMPTY", severity: "ERROR", title: "Claims Accepted Empty", description: "Institutional signature condition: claims accepted empty." },
  { code: "CLAIMS_BOUNDARY_MISSING", severity: "WARNING", title: "Claims Boundary Missing", description: "Institutional signature condition: claims boundary missing." },
  { code: "LIMITATIONS_MISSING", severity: "WARNING", title: "Limitations Missing", description: "Institutional signature condition: limitations missing." },
  { code: "TRUSTED_TIMESTAMP_REQUIRED", severity: "ERROR", title: "Trusted Timestamp Required", description: "Institutional signature condition: trusted timestamp required." },
  { code: "TRUSTED_TIMESTAMP_MISSING", severity: "WARNING", title: "Trusted Timestamp Missing", description: "Institutional signature condition: trusted timestamp missing." },
  { code: "TRUSTED_TIMESTAMP_INVALID", severity: "ERROR", title: "Trusted Timestamp Invalid", description: "Institutional signature condition: trusted timestamp invalid." },
  { code: "TRUSTED_TIMESTAMP_SUBJECT_MISMATCH", severity: "ERROR", title: "Trusted Timestamp Subject Mismatch", description: "Institutional signature condition: trusted timestamp subject mismatch." },
  { code: "PARENT_ENVELOPE_MISSING", severity: "WARNING", title: "Parent Envelope Missing", description: "Institutional signature condition: parent envelope missing." },
  { code: "PARENT_ENVELOPE_HASH_MISMATCH", severity: "ERROR", title: "Parent Envelope Hash Mismatch", description: "Institutional signature condition: parent envelope hash mismatch." },
  { code: "SIGNATURE_CHAIN_SEQUENCE_INVALID", severity: "ERROR", title: "Signature Chain Sequence Invalid", description: "Institutional signature condition: signature chain sequence invalid." },
  { code: "SIGNATURE_CHAIN_BROKEN", severity: "ERROR", title: "Signature Chain Broken", description: "Institutional signature condition: signature chain broken." },
  { code: "SIGNATURE_CHAIN_DUPLICATE", severity: "ERROR", title: "Signature Chain Duplicate", description: "Institutional signature condition: signature chain duplicate." },
  { code: "MANIFEST_ID_MISSING", severity: "WARNING", title: "Manifest Id Missing", description: "Institutional signature condition: manifest id missing." },
  { code: "MANIFEST_HASH_MISMATCH", severity: "ERROR", title: "Manifest Hash Mismatch", description: "Institutional signature condition: manifest hash mismatch." },
  { code: "MANIFEST_SUBJECT_MISSING", severity: "WARNING", title: "Manifest Subject Missing", description: "Institutional signature condition: manifest subject missing." },
  { code: "MANIFEST_ENVELOPE_MISSING", severity: "WARNING", title: "Manifest Envelope Missing", description: "Institutional signature condition: manifest envelope missing." },
  { code: "MANIFEST_REQUIRED_ROLE_MISSING", severity: "WARNING", title: "Manifest Required Role Missing", description: "Institutional signature condition: manifest required role missing." },
  { code: "MANIFEST_DUPLICATE_SIGNER", severity: "ERROR", title: "Manifest Duplicate Signer", description: "Institutional signature condition: manifest duplicate signer." },
  { code: "MANIFEST_DUPLICATE_ROLE", severity: "ERROR", title: "Manifest Duplicate Role", description: "Institutional signature condition: manifest duplicate role." },
  { code: "REGISTRY_ID_MISSING", severity: "WARNING", title: "Registry Id Missing", description: "Institutional signature condition: registry id missing." },
  { code: "GOVERNANCE_REGISTRATION_MISMATCH", severity: "ERROR", title: "Governance Registration Mismatch", description: "Institutional signature condition: governance registration mismatch." },
  { code: "ARTIFACT_ID_MISMATCH", severity: "ERROR", title: "Artifact Id Mismatch", description: "Institutional signature condition: artifact id mismatch." },
  { code: "REGISTRY_PUBLICATION_REQUIRED", severity: "ERROR", title: "Registry Publication Required", description: "Institutional signature condition: registry publication required." },
  { code: "INDEPENDENT_REVIEW_REQUIRED", severity: "ERROR", title: "Independent Review Required", description: "Institutional signature condition: independent review required." },
  { code: "INDEPENDENT_REVIEWER_CONFLICT", severity: "ERROR", title: "Independent Reviewer Conflict", description: "Institutional signature condition: independent reviewer conflict." },
  { code: "MULTISIGNATURE_THRESHOLD_NOT_MET", severity: "ERROR", title: "Multisignature Threshold Not Met", description: "Institutional signature condition: multisignature threshold not met." },
  { code: "PUBLISHER_SIGNATURE_REQUIRED", severity: "ERROR", title: "Publisher Signature Required", description: "Institutional signature condition: publisher signature required." },
  { code: "ACCOUNTABLE_OWNER_SIGNATURE_REQUIRED", severity: "ERROR", title: "Accountable Owner Signature Required", description: "Institutional signature condition: accountable owner signature required." },
  { code: "SIGNATURE_PROVIDER_FAILED", severity: "ERROR", title: "Signature Provider Failed", description: "Institutional signature condition: signature provider failed." },
  { code: "TIMESTAMP_PROVIDER_FAILED", severity: "ERROR", title: "Timestamp Provider Failed", description: "Institutional signature condition: timestamp provider failed." },
  { code: "POLICY_ID_MISSING", severity: "WARNING", title: "Policy Id Missing", description: "Institutional signature condition: policy id missing." },
  { code: "POLICY_VERSION_MISMATCH", severity: "ERROR", title: "Policy Version Mismatch", description: "Institutional signature condition: policy version mismatch." },
  { code: "POLICY_ACCEPTED", severity: "INFO", title: "Policy Accepted", description: "Institutional signature condition: policy accepted." },
  { code: "HISTORICAL_SIGNATURE_ACCEPTED", severity: "INFO", title: "Historical Signature Accepted", description: "Institutional signature condition: historical signature accepted." },
  { code: "HISTORICAL_SIGNATURE_REJECTED", severity: "ERROR", title: "Historical Signature Rejected", description: "Institutional signature condition: historical signature rejected." },
  { code: "REVOCATION_AFTER_SIGNATURE_ACCEPTED", severity: "INFO", title: "Revocation After Signature Accepted", description: "Institutional signature condition: revocation after signature accepted." },
  { code: "REVOCATION_BEFORE_SIGNATURE_REJECTED", severity: "ERROR", title: "Revocation Before Signature Rejected", description: "Institutional signature condition: revocation before signature rejected." },
  { code: "EXTERNAL_SIGNATURE_UNVERIFIED", severity: "WARNING", title: "External Signature Unverified", description: "Institutional signature condition: external signature unverified." },
  { code: "SIGNATURE_MANIFEST_VALID", severity: "INFO", title: "Signature Manifest Valid", description: "Institutional signature condition: signature manifest valid." },
  { code: "SIGNATURE_MANIFEST_INVALID", severity: "ERROR", title: "Signature Manifest Invalid", description: "Institutional signature condition: signature manifest invalid." },
  { code: "ATTESTATION_CERTIFICATE_CREATED", severity: "INFO", title: "Attestation Certificate Created", description: "Institutional signature condition: attestation certificate created." },
  { code: "AUDIT_CHAIN_INVALID", severity: "ERROR", title: "Audit Chain Invalid", description: "Institutional signature condition: audit chain invalid." },
  { code: "AUDIT_EVENT_HASH_MISMATCH", severity: "ERROR", title: "Audit Event Hash Mismatch", description: "Institutional signature condition: audit event hash mismatch." },
  { code: "INPUT_INVALID", severity: "ERROR", title: "Input Invalid", description: "Institutional signature condition: input invalid." },
  { code: "ENGINE_ERROR", severity: "ERROR", title: "Engine Error", description: "Institutional signature condition: engine error." },
] as const;

export const SIGNATURE_CONTROLS: readonly SignatureControlDefinition[] = [
  { controlId: "SIG-C-001", domain: "IDENTITY", title: "Identity control 001", requirement: "The engine shall preserve and verify bounded identity condition 001 without silently expanding the signed claim." },
  { controlId: "SIG-C-002", domain: "KEY", title: "Key control 002", requirement: "The engine shall preserve and verify bounded key condition 002 without silently expanding the signed claim." },
  { controlId: "SIG-C-003", domain: "SUBJECT", title: "Subject control 003", requirement: "The engine shall preserve and verify bounded subject condition 003 without silently expanding the signed claim." },
  { controlId: "SIG-C-004", domain: "PAYLOAD", title: "Payload control 004", requirement: "The engine shall preserve and verify bounded payload condition 004 without silently expanding the signed claim." },
  { controlId: "SIG-C-005", domain: "SIGNATURE", title: "Signature control 005", requirement: "The engine shall preserve and verify bounded signature condition 005 without silently expanding the signed claim." },
  { controlId: "SIG-C-006", domain: "TIME", title: "Time control 006", requirement: "The engine shall preserve and verify bounded time condition 006 without silently expanding the signed claim." },
  { controlId: "SIG-C-007", domain: "POLICY", title: "Policy control 007", requirement: "The engine shall preserve and verify bounded policy condition 007 without silently expanding the signed claim." },
  { controlId: "SIG-C-008", domain: "CHAIN", title: "Chain control 008", requirement: "The engine shall preserve and verify bounded chain condition 008 without silently expanding the signed claim." },
  { controlId: "SIG-C-009", domain: "MANIFEST", title: "Manifest control 009", requirement: "The engine shall preserve and verify bounded manifest condition 009 without silently expanding the signed claim." },
  { controlId: "SIG-C-010", domain: "ATTESTATION", title: "Attestation control 010", requirement: "The engine shall preserve and verify bounded attestation condition 010 without silently expanding the signed claim." },
  { controlId: "SIG-C-011", domain: "IDENTITY", title: "Identity control 011", requirement: "The engine shall preserve and verify bounded identity condition 011 without silently expanding the signed claim." },
  { controlId: "SIG-C-012", domain: "KEY", title: "Key control 012", requirement: "The engine shall preserve and verify bounded key condition 012 without silently expanding the signed claim." },
  { controlId: "SIG-C-013", domain: "SUBJECT", title: "Subject control 013", requirement: "The engine shall preserve and verify bounded subject condition 013 without silently expanding the signed claim." },
  { controlId: "SIG-C-014", domain: "PAYLOAD", title: "Payload control 014", requirement: "The engine shall preserve and verify bounded payload condition 014 without silently expanding the signed claim." },
  { controlId: "SIG-C-015", domain: "SIGNATURE", title: "Signature control 015", requirement: "The engine shall preserve and verify bounded signature condition 015 without silently expanding the signed claim." },
  { controlId: "SIG-C-016", domain: "TIME", title: "Time control 016", requirement: "The engine shall preserve and verify bounded time condition 016 without silently expanding the signed claim." },
  { controlId: "SIG-C-017", domain: "POLICY", title: "Policy control 017", requirement: "The engine shall preserve and verify bounded policy condition 017 without silently expanding the signed claim." },
  { controlId: "SIG-C-018", domain: "CHAIN", title: "Chain control 018", requirement: "The engine shall preserve and verify bounded chain condition 018 without silently expanding the signed claim." },
  { controlId: "SIG-C-019", domain: "MANIFEST", title: "Manifest control 019", requirement: "The engine shall preserve and verify bounded manifest condition 019 without silently expanding the signed claim." },
  { controlId: "SIG-C-020", domain: "ATTESTATION", title: "Attestation control 020", requirement: "The engine shall preserve and verify bounded attestation condition 020 without silently expanding the signed claim." },
  { controlId: "SIG-C-021", domain: "IDENTITY", title: "Identity control 021", requirement: "The engine shall preserve and verify bounded identity condition 021 without silently expanding the signed claim." },
  { controlId: "SIG-C-022", domain: "KEY", title: "Key control 022", requirement: "The engine shall preserve and verify bounded key condition 022 without silently expanding the signed claim." },
  { controlId: "SIG-C-023", domain: "SUBJECT", title: "Subject control 023", requirement: "The engine shall preserve and verify bounded subject condition 023 without silently expanding the signed claim." },
  { controlId: "SIG-C-024", domain: "PAYLOAD", title: "Payload control 024", requirement: "The engine shall preserve and verify bounded payload condition 024 without silently expanding the signed claim." },
  { controlId: "SIG-C-025", domain: "SIGNATURE", title: "Signature control 025", requirement: "The engine shall preserve and verify bounded signature condition 025 without silently expanding the signed claim." },
  { controlId: "SIG-C-026", domain: "TIME", title: "Time control 026", requirement: "The engine shall preserve and verify bounded time condition 026 without silently expanding the signed claim." },
  { controlId: "SIG-C-027", domain: "POLICY", title: "Policy control 027", requirement: "The engine shall preserve and verify bounded policy condition 027 without silently expanding the signed claim." },
  { controlId: "SIG-C-028", domain: "CHAIN", title: "Chain control 028", requirement: "The engine shall preserve and verify bounded chain condition 028 without silently expanding the signed claim." },
  { controlId: "SIG-C-029", domain: "MANIFEST", title: "Manifest control 029", requirement: "The engine shall preserve and verify bounded manifest condition 029 without silently expanding the signed claim." },
  { controlId: "SIG-C-030", domain: "ATTESTATION", title: "Attestation control 030", requirement: "The engine shall preserve and verify bounded attestation condition 030 without silently expanding the signed claim." },
  { controlId: "SIG-C-031", domain: "IDENTITY", title: "Identity control 031", requirement: "The engine shall preserve and verify bounded identity condition 031 without silently expanding the signed claim." },
  { controlId: "SIG-C-032", domain: "KEY", title: "Key control 032", requirement: "The engine shall preserve and verify bounded key condition 032 without silently expanding the signed claim." },
  { controlId: "SIG-C-033", domain: "SUBJECT", title: "Subject control 033", requirement: "The engine shall preserve and verify bounded subject condition 033 without silently expanding the signed claim." },
  { controlId: "SIG-C-034", domain: "PAYLOAD", title: "Payload control 034", requirement: "The engine shall preserve and verify bounded payload condition 034 without silently expanding the signed claim." },
  { controlId: "SIG-C-035", domain: "SIGNATURE", title: "Signature control 035", requirement: "The engine shall preserve and verify bounded signature condition 035 without silently expanding the signed claim." },
  { controlId: "SIG-C-036", domain: "TIME", title: "Time control 036", requirement: "The engine shall preserve and verify bounded time condition 036 without silently expanding the signed claim." },
  { controlId: "SIG-C-037", domain: "POLICY", title: "Policy control 037", requirement: "The engine shall preserve and verify bounded policy condition 037 without silently expanding the signed claim." },
  { controlId: "SIG-C-038", domain: "CHAIN", title: "Chain control 038", requirement: "The engine shall preserve and verify bounded chain condition 038 without silently expanding the signed claim." },
  { controlId: "SIG-C-039", domain: "MANIFEST", title: "Manifest control 039", requirement: "The engine shall preserve and verify bounded manifest condition 039 without silently expanding the signed claim." },
  { controlId: "SIG-C-040", domain: "ATTESTATION", title: "Attestation control 040", requirement: "The engine shall preserve and verify bounded attestation condition 040 without silently expanding the signed claim." },
  { controlId: "SIG-C-041", domain: "IDENTITY", title: "Identity control 041", requirement: "The engine shall preserve and verify bounded identity condition 041 without silently expanding the signed claim." },
  { controlId: "SIG-C-042", domain: "KEY", title: "Key control 042", requirement: "The engine shall preserve and verify bounded key condition 042 without silently expanding the signed claim." },
  { controlId: "SIG-C-043", domain: "SUBJECT", title: "Subject control 043", requirement: "The engine shall preserve and verify bounded subject condition 043 without silently expanding the signed claim." },
  { controlId: "SIG-C-044", domain: "PAYLOAD", title: "Payload control 044", requirement: "The engine shall preserve and verify bounded payload condition 044 without silently expanding the signed claim." },
  { controlId: "SIG-C-045", domain: "SIGNATURE", title: "Signature control 045", requirement: "The engine shall preserve and verify bounded signature condition 045 without silently expanding the signed claim." },
  { controlId: "SIG-C-046", domain: "TIME", title: "Time control 046", requirement: "The engine shall preserve and verify bounded time condition 046 without silently expanding the signed claim." },
  { controlId: "SIG-C-047", domain: "POLICY", title: "Policy control 047", requirement: "The engine shall preserve and verify bounded policy condition 047 without silently expanding the signed claim." },
  { controlId: "SIG-C-048", domain: "CHAIN", title: "Chain control 048", requirement: "The engine shall preserve and verify bounded chain condition 048 without silently expanding the signed claim." },
  { controlId: "SIG-C-049", domain: "MANIFEST", title: "Manifest control 049", requirement: "The engine shall preserve and verify bounded manifest condition 049 without silently expanding the signed claim." },
  { controlId: "SIG-C-050", domain: "ATTESTATION", title: "Attestation control 050", requirement: "The engine shall preserve and verify bounded attestation condition 050 without silently expanding the signed claim." },
  { controlId: "SIG-C-051", domain: "IDENTITY", title: "Identity control 051", requirement: "The engine shall preserve and verify bounded identity condition 051 without silently expanding the signed claim." },
  { controlId: "SIG-C-052", domain: "KEY", title: "Key control 052", requirement: "The engine shall preserve and verify bounded key condition 052 without silently expanding the signed claim." },
  { controlId: "SIG-C-053", domain: "SUBJECT", title: "Subject control 053", requirement: "The engine shall preserve and verify bounded subject condition 053 without silently expanding the signed claim." },
  { controlId: "SIG-C-054", domain: "PAYLOAD", title: "Payload control 054", requirement: "The engine shall preserve and verify bounded payload condition 054 without silently expanding the signed claim." },
  { controlId: "SIG-C-055", domain: "SIGNATURE", title: "Signature control 055", requirement: "The engine shall preserve and verify bounded signature condition 055 without silently expanding the signed claim." },
  { controlId: "SIG-C-056", domain: "TIME", title: "Time control 056", requirement: "The engine shall preserve and verify bounded time condition 056 without silently expanding the signed claim." },
  { controlId: "SIG-C-057", domain: "POLICY", title: "Policy control 057", requirement: "The engine shall preserve and verify bounded policy condition 057 without silently expanding the signed claim." },
  { controlId: "SIG-C-058", domain: "CHAIN", title: "Chain control 058", requirement: "The engine shall preserve and verify bounded chain condition 058 without silently expanding the signed claim." },
  { controlId: "SIG-C-059", domain: "MANIFEST", title: "Manifest control 059", requirement: "The engine shall preserve and verify bounded manifest condition 059 without silently expanding the signed claim." },
  { controlId: "SIG-C-060", domain: "ATTESTATION", title: "Attestation control 060", requirement: "The engine shall preserve and verify bounded attestation condition 060 without silently expanding the signed claim." },
  { controlId: "SIG-C-061", domain: "IDENTITY", title: "Identity control 061", requirement: "The engine shall preserve and verify bounded identity condition 061 without silently expanding the signed claim." },
  { controlId: "SIG-C-062", domain: "KEY", title: "Key control 062", requirement: "The engine shall preserve and verify bounded key condition 062 without silently expanding the signed claim." },
  { controlId: "SIG-C-063", domain: "SUBJECT", title: "Subject control 063", requirement: "The engine shall preserve and verify bounded subject condition 063 without silently expanding the signed claim." },
  { controlId: "SIG-C-064", domain: "PAYLOAD", title: "Payload control 064", requirement: "The engine shall preserve and verify bounded payload condition 064 without silently expanding the signed claim." },
  { controlId: "SIG-C-065", domain: "SIGNATURE", title: "Signature control 065", requirement: "The engine shall preserve and verify bounded signature condition 065 without silently expanding the signed claim." },
  { controlId: "SIG-C-066", domain: "TIME", title: "Time control 066", requirement: "The engine shall preserve and verify bounded time condition 066 without silently expanding the signed claim." },
  { controlId: "SIG-C-067", domain: "POLICY", title: "Policy control 067", requirement: "The engine shall preserve and verify bounded policy condition 067 without silently expanding the signed claim." },
  { controlId: "SIG-C-068", domain: "CHAIN", title: "Chain control 068", requirement: "The engine shall preserve and verify bounded chain condition 068 without silently expanding the signed claim." },
  { controlId: "SIG-C-069", domain: "MANIFEST", title: "Manifest control 069", requirement: "The engine shall preserve and verify bounded manifest condition 069 without silently expanding the signed claim." },
  { controlId: "SIG-C-070", domain: "ATTESTATION", title: "Attestation control 070", requirement: "The engine shall preserve and verify bounded attestation condition 070 without silently expanding the signed claim." },
  { controlId: "SIG-C-071", domain: "IDENTITY", title: "Identity control 071", requirement: "The engine shall preserve and verify bounded identity condition 071 without silently expanding the signed claim." },
  { controlId: "SIG-C-072", domain: "KEY", title: "Key control 072", requirement: "The engine shall preserve and verify bounded key condition 072 without silently expanding the signed claim." },
  { controlId: "SIG-C-073", domain: "SUBJECT", title: "Subject control 073", requirement: "The engine shall preserve and verify bounded subject condition 073 without silently expanding the signed claim." },
  { controlId: "SIG-C-074", domain: "PAYLOAD", title: "Payload control 074", requirement: "The engine shall preserve and verify bounded payload condition 074 without silently expanding the signed claim." },
  { controlId: "SIG-C-075", domain: "SIGNATURE", title: "Signature control 075", requirement: "The engine shall preserve and verify bounded signature condition 075 without silently expanding the signed claim." },
  { controlId: "SIG-C-076", domain: "TIME", title: "Time control 076", requirement: "The engine shall preserve and verify bounded time condition 076 without silently expanding the signed claim." },
  { controlId: "SIG-C-077", domain: "POLICY", title: "Policy control 077", requirement: "The engine shall preserve and verify bounded policy condition 077 without silently expanding the signed claim." },
  { controlId: "SIG-C-078", domain: "CHAIN", title: "Chain control 078", requirement: "The engine shall preserve and verify bounded chain condition 078 without silently expanding the signed claim." },
  { controlId: "SIG-C-079", domain: "MANIFEST", title: "Manifest control 079", requirement: "The engine shall preserve and verify bounded manifest condition 079 without silently expanding the signed claim." },
  { controlId: "SIG-C-080", domain: "ATTESTATION", title: "Attestation control 080", requirement: "The engine shall preserve and verify bounded attestation condition 080 without silently expanding the signed claim." },
  { controlId: "SIG-C-081", domain: "IDENTITY", title: "Identity control 081", requirement: "The engine shall preserve and verify bounded identity condition 081 without silently expanding the signed claim." },
  { controlId: "SIG-C-082", domain: "KEY", title: "Key control 082", requirement: "The engine shall preserve and verify bounded key condition 082 without silently expanding the signed claim." },
  { controlId: "SIG-C-083", domain: "SUBJECT", title: "Subject control 083", requirement: "The engine shall preserve and verify bounded subject condition 083 without silently expanding the signed claim." },
  { controlId: "SIG-C-084", domain: "PAYLOAD", title: "Payload control 084", requirement: "The engine shall preserve and verify bounded payload condition 084 without silently expanding the signed claim." },
  { controlId: "SIG-C-085", domain: "SIGNATURE", title: "Signature control 085", requirement: "The engine shall preserve and verify bounded signature condition 085 without silently expanding the signed claim." },
  { controlId: "SIG-C-086", domain: "TIME", title: "Time control 086", requirement: "The engine shall preserve and verify bounded time condition 086 without silently expanding the signed claim." },
  { controlId: "SIG-C-087", domain: "POLICY", title: "Policy control 087", requirement: "The engine shall preserve and verify bounded policy condition 087 without silently expanding the signed claim." },
  { controlId: "SIG-C-088", domain: "CHAIN", title: "Chain control 088", requirement: "The engine shall preserve and verify bounded chain condition 088 without silently expanding the signed claim." },
  { controlId: "SIG-C-089", domain: "MANIFEST", title: "Manifest control 089", requirement: "The engine shall preserve and verify bounded manifest condition 089 without silently expanding the signed claim." },
  { controlId: "SIG-C-090", domain: "ATTESTATION", title: "Attestation control 090", requirement: "The engine shall preserve and verify bounded attestation condition 090 without silently expanding the signed claim." },
  { controlId: "SIG-C-091", domain: "IDENTITY", title: "Identity control 091", requirement: "The engine shall preserve and verify bounded identity condition 091 without silently expanding the signed claim." },
  { controlId: "SIG-C-092", domain: "KEY", title: "Key control 092", requirement: "The engine shall preserve and verify bounded key condition 092 without silently expanding the signed claim." },
  { controlId: "SIG-C-093", domain: "SUBJECT", title: "Subject control 093", requirement: "The engine shall preserve and verify bounded subject condition 093 without silently expanding the signed claim." },
  { controlId: "SIG-C-094", domain: "PAYLOAD", title: "Payload control 094", requirement: "The engine shall preserve and verify bounded payload condition 094 without silently expanding the signed claim." },
  { controlId: "SIG-C-095", domain: "SIGNATURE", title: "Signature control 095", requirement: "The engine shall preserve and verify bounded signature condition 095 without silently expanding the signed claim." },
  { controlId: "SIG-C-096", domain: "TIME", title: "Time control 096", requirement: "The engine shall preserve and verify bounded time condition 096 without silently expanding the signed claim." },
] as const;

export const SIGNATURE_ACCEPTANCE_TESTS: readonly SignatureAcceptanceTest[] = [
  { testId: "SIG-AT-001", title: "Signature acceptance test 001", passCondition: "The signature engine deterministically detects, preserves, or rejects test condition 001 without changing the canonical subject." },
  { testId: "SIG-AT-002", title: "Signature acceptance test 002", passCondition: "The signature engine deterministically detects, preserves, or rejects test condition 002 without changing the canonical subject." },
  { testId: "SIG-AT-003", title: "Signature acceptance test 003", passCondition: "The signature engine deterministically detects, preserves, or rejects test condition 003 without changing the canonical subject." },
  { testId: "SIG-AT-004", title: "Signature acceptance test 004", passCondition: "The signature engine deterministically detects, preserves, or rejects test condition 004 without changing the canonical subject." },
  { testId: "SIG-AT-005", title: "Signature acceptance test 005", passCondition: "The signature engine deterministically detects, preserves, or rejects test condition 005 without changing the canonical subject." },
  { testId: "SIG-AT-006", title: "Signature acceptance test 006", passCondition: "The signature engine deterministically detects, preserves, or rejects test condition 006 without changing the canonical subject." },
  { testId: "SIG-AT-007", title: "Signature acceptance test 007", passCondition: "The signature engine deterministically detects, preserves, or rejects test condition 007 without changing the canonical subject." },
  { testId: "SIG-AT-008", title: "Signature acceptance test 008", passCondition: "The signature engine deterministically detects, preserves, or rejects test condition 008 without changing the canonical subject." },
  { testId: "SIG-AT-009", title: "Signature acceptance test 009", passCondition: "The signature engine deterministically detects, preserves, or rejects test condition 009 without changing the canonical subject." },
  { testId: "SIG-AT-010", title: "Signature acceptance test 010", passCondition: "The signature engine deterministically detects, preserves, or rejects test condition 010 without changing the canonical subject." },
  { testId: "SIG-AT-011", title: "Signature acceptance test 011", passCondition: "The signature engine deterministically detects, preserves, or rejects test condition 011 without changing the canonical subject." },
  { testId: "SIG-AT-012", title: "Signature acceptance test 012", passCondition: "The signature engine deterministically detects, preserves, or rejects test condition 012 without changing the canonical subject." },
  { testId: "SIG-AT-013", title: "Signature acceptance test 013", passCondition: "The signature engine deterministically detects, preserves, or rejects test condition 013 without changing the canonical subject." },
  { testId: "SIG-AT-014", title: "Signature acceptance test 014", passCondition: "The signature engine deterministically detects, preserves, or rejects test condition 014 without changing the canonical subject." },
  { testId: "SIG-AT-015", title: "Signature acceptance test 015", passCondition: "The signature engine deterministically detects, preserves, or rejects test condition 015 without changing the canonical subject." },
  { testId: "SIG-AT-016", title: "Signature acceptance test 016", passCondition: "The signature engine deterministically detects, preserves, or rejects test condition 016 without changing the canonical subject." },
  { testId: "SIG-AT-017", title: "Signature acceptance test 017", passCondition: "The signature engine deterministically detects, preserves, or rejects test condition 017 without changing the canonical subject." },
  { testId: "SIG-AT-018", title: "Signature acceptance test 018", passCondition: "The signature engine deterministically detects, preserves, or rejects test condition 018 without changing the canonical subject." },
  { testId: "SIG-AT-019", title: "Signature acceptance test 019", passCondition: "The signature engine deterministically detects, preserves, or rejects test condition 019 without changing the canonical subject." },
  { testId: "SIG-AT-020", title: "Signature acceptance test 020", passCondition: "The signature engine deterministically detects, preserves, or rejects test condition 020 without changing the canonical subject." },
  { testId: "SIG-AT-021", title: "Signature acceptance test 021", passCondition: "The signature engine deterministically detects, preserves, or rejects test condition 021 without changing the canonical subject." },
  { testId: "SIG-AT-022", title: "Signature acceptance test 022", passCondition: "The signature engine deterministically detects, preserves, or rejects test condition 022 without changing the canonical subject." },
  { testId: "SIG-AT-023", title: "Signature acceptance test 023", passCondition: "The signature engine deterministically detects, preserves, or rejects test condition 023 without changing the canonical subject." },
  { testId: "SIG-AT-024", title: "Signature acceptance test 024", passCondition: "The signature engine deterministically detects, preserves, or rejects test condition 024 without changing the canonical subject." },
  { testId: "SIG-AT-025", title: "Signature acceptance test 025", passCondition: "The signature engine deterministically detects, preserves, or rejects test condition 025 without changing the canonical subject." },
  { testId: "SIG-AT-026", title: "Signature acceptance test 026", passCondition: "The signature engine deterministically detects, preserves, or rejects test condition 026 without changing the canonical subject." },
  { testId: "SIG-AT-027", title: "Signature acceptance test 027", passCondition: "The signature engine deterministically detects, preserves, or rejects test condition 027 without changing the canonical subject." },
  { testId: "SIG-AT-028", title: "Signature acceptance test 028", passCondition: "The signature engine deterministically detects, preserves, or rejects test condition 028 without changing the canonical subject." },
  { testId: "SIG-AT-029", title: "Signature acceptance test 029", passCondition: "The signature engine deterministically detects, preserves, or rejects test condition 029 without changing the canonical subject." },
  { testId: "SIG-AT-030", title: "Signature acceptance test 030", passCondition: "The signature engine deterministically detects, preserves, or rejects test condition 030 without changing the canonical subject." },
  { testId: "SIG-AT-031", title: "Signature acceptance test 031", passCondition: "The signature engine deterministically detects, preserves, or rejects test condition 031 without changing the canonical subject." },
  { testId: "SIG-AT-032", title: "Signature acceptance test 032", passCondition: "The signature engine deterministically detects, preserves, or rejects test condition 032 without changing the canonical subject." },
  { testId: "SIG-AT-033", title: "Signature acceptance test 033", passCondition: "The signature engine deterministically detects, preserves, or rejects test condition 033 without changing the canonical subject." },
  { testId: "SIG-AT-034", title: "Signature acceptance test 034", passCondition: "The signature engine deterministically detects, preserves, or rejects test condition 034 without changing the canonical subject." },
  { testId: "SIG-AT-035", title: "Signature acceptance test 035", passCondition: "The signature engine deterministically detects, preserves, or rejects test condition 035 without changing the canonical subject." },
  { testId: "SIG-AT-036", title: "Signature acceptance test 036", passCondition: "The signature engine deterministically detects, preserves, or rejects test condition 036 without changing the canonical subject." },
  { testId: "SIG-AT-037", title: "Signature acceptance test 037", passCondition: "The signature engine deterministically detects, preserves, or rejects test condition 037 without changing the canonical subject." },
  { testId: "SIG-AT-038", title: "Signature acceptance test 038", passCondition: "The signature engine deterministically detects, preserves, or rejects test condition 038 without changing the canonical subject." },
  { testId: "SIG-AT-039", title: "Signature acceptance test 039", passCondition: "The signature engine deterministically detects, preserves, or rejects test condition 039 without changing the canonical subject." },
  { testId: "SIG-AT-040", title: "Signature acceptance test 040", passCondition: "The signature engine deterministically detects, preserves, or rejects test condition 040 without changing the canonical subject." },
  { testId: "SIG-AT-041", title: "Signature acceptance test 041", passCondition: "The signature engine deterministically detects, preserves, or rejects test condition 041 without changing the canonical subject." },
  { testId: "SIG-AT-042", title: "Signature acceptance test 042", passCondition: "The signature engine deterministically detects, preserves, or rejects test condition 042 without changing the canonical subject." },
  { testId: "SIG-AT-043", title: "Signature acceptance test 043", passCondition: "The signature engine deterministically detects, preserves, or rejects test condition 043 without changing the canonical subject." },
  { testId: "SIG-AT-044", title: "Signature acceptance test 044", passCondition: "The signature engine deterministically detects, preserves, or rejects test condition 044 without changing the canonical subject." },
  { testId: "SIG-AT-045", title: "Signature acceptance test 045", passCondition: "The signature engine deterministically detects, preserves, or rejects test condition 045 without changing the canonical subject." },
  { testId: "SIG-AT-046", title: "Signature acceptance test 046", passCondition: "The signature engine deterministically detects, preserves, or rejects test condition 046 without changing the canonical subject." },
  { testId: "SIG-AT-047", title: "Signature acceptance test 047", passCondition: "The signature engine deterministically detects, preserves, or rejects test condition 047 without changing the canonical subject." },
  { testId: "SIG-AT-048", title: "Signature acceptance test 048", passCondition: "The signature engine deterministically detects, preserves, or rejects test condition 048 without changing the canonical subject." },
  { testId: "SIG-AT-049", title: "Signature acceptance test 049", passCondition: "The signature engine deterministically detects, preserves, or rejects test condition 049 without changing the canonical subject." },
  { testId: "SIG-AT-050", title: "Signature acceptance test 050", passCondition: "The signature engine deterministically detects, preserves, or rejects test condition 050 without changing the canonical subject." },
  { testId: "SIG-AT-051", title: "Signature acceptance test 051", passCondition: "The signature engine deterministically detects, preserves, or rejects test condition 051 without changing the canonical subject." },
  { testId: "SIG-AT-052", title: "Signature acceptance test 052", passCondition: "The signature engine deterministically detects, preserves, or rejects test condition 052 without changing the canonical subject." },
  { testId: "SIG-AT-053", title: "Signature acceptance test 053", passCondition: "The signature engine deterministically detects, preserves, or rejects test condition 053 without changing the canonical subject." },
  { testId: "SIG-AT-054", title: "Signature acceptance test 054", passCondition: "The signature engine deterministically detects, preserves, or rejects test condition 054 without changing the canonical subject." },
  { testId: "SIG-AT-055", title: "Signature acceptance test 055", passCondition: "The signature engine deterministically detects, preserves, or rejects test condition 055 without changing the canonical subject." },
  { testId: "SIG-AT-056", title: "Signature acceptance test 056", passCondition: "The signature engine deterministically detects, preserves, or rejects test condition 056 without changing the canonical subject." },
  { testId: "SIG-AT-057", title: "Signature acceptance test 057", passCondition: "The signature engine deterministically detects, preserves, or rejects test condition 057 without changing the canonical subject." },
  { testId: "SIG-AT-058", title: "Signature acceptance test 058", passCondition: "The signature engine deterministically detects, preserves, or rejects test condition 058 without changing the canonical subject." },
  { testId: "SIG-AT-059", title: "Signature acceptance test 059", passCondition: "The signature engine deterministically detects, preserves, or rejects test condition 059 without changing the canonical subject." },
  { testId: "SIG-AT-060", title: "Signature acceptance test 060", passCondition: "The signature engine deterministically detects, preserves, or rejects test condition 060 without changing the canonical subject." },
  { testId: "SIG-AT-061", title: "Signature acceptance test 061", passCondition: "The signature engine deterministically detects, preserves, or rejects test condition 061 without changing the canonical subject." },
  { testId: "SIG-AT-062", title: "Signature acceptance test 062", passCondition: "The signature engine deterministically detects, preserves, or rejects test condition 062 without changing the canonical subject." },
  { testId: "SIG-AT-063", title: "Signature acceptance test 063", passCondition: "The signature engine deterministically detects, preserves, or rejects test condition 063 without changing the canonical subject." },
  { testId: "SIG-AT-064", title: "Signature acceptance test 064", passCondition: "The signature engine deterministically detects, preserves, or rejects test condition 064 without changing the canonical subject." },
  { testId: "SIG-AT-065", title: "Signature acceptance test 065", passCondition: "The signature engine deterministically detects, preserves, or rejects test condition 065 without changing the canonical subject." },
  { testId: "SIG-AT-066", title: "Signature acceptance test 066", passCondition: "The signature engine deterministically detects, preserves, or rejects test condition 066 without changing the canonical subject." },
  { testId: "SIG-AT-067", title: "Signature acceptance test 067", passCondition: "The signature engine deterministically detects, preserves, or rejects test condition 067 without changing the canonical subject." },
  { testId: "SIG-AT-068", title: "Signature acceptance test 068", passCondition: "The signature engine deterministically detects, preserves, or rejects test condition 068 without changing the canonical subject." },
  { testId: "SIG-AT-069", title: "Signature acceptance test 069", passCondition: "The signature engine deterministically detects, preserves, or rejects test condition 069 without changing the canonical subject." },
  { testId: "SIG-AT-070", title: "Signature acceptance test 070", passCondition: "The signature engine deterministically detects, preserves, or rejects test condition 070 without changing the canonical subject." },
  { testId: "SIG-AT-071", title: "Signature acceptance test 071", passCondition: "The signature engine deterministically detects, preserves, or rejects test condition 071 without changing the canonical subject." },
  { testId: "SIG-AT-072", title: "Signature acceptance test 072", passCondition: "The signature engine deterministically detects, preserves, or rejects test condition 072 without changing the canonical subject." },
  { testId: "SIG-AT-073", title: "Signature acceptance test 073", passCondition: "The signature engine deterministically detects, preserves, or rejects test condition 073 without changing the canonical subject." },
  { testId: "SIG-AT-074", title: "Signature acceptance test 074", passCondition: "The signature engine deterministically detects, preserves, or rejects test condition 074 without changing the canonical subject." },
  { testId: "SIG-AT-075", title: "Signature acceptance test 075", passCondition: "The signature engine deterministically detects, preserves, or rejects test condition 075 without changing the canonical subject." },
  { testId: "SIG-AT-076", title: "Signature acceptance test 076", passCondition: "The signature engine deterministically detects, preserves, or rejects test condition 076 without changing the canonical subject." },
  { testId: "SIG-AT-077", title: "Signature acceptance test 077", passCondition: "The signature engine deterministically detects, preserves, or rejects test condition 077 without changing the canonical subject." },
  { testId: "SIG-AT-078", title: "Signature acceptance test 078", passCondition: "The signature engine deterministically detects, preserves, or rejects test condition 078 without changing the canonical subject." },
  { testId: "SIG-AT-079", title: "Signature acceptance test 079", passCondition: "The signature engine deterministically detects, preserves, or rejects test condition 079 without changing the canonical subject." },
  { testId: "SIG-AT-080", title: "Signature acceptance test 080", passCondition: "The signature engine deterministically detects, preserves, or rejects test condition 080 without changing the canonical subject." },
] as const;


const TEXT_ENCODER = new TextEncoder();

function nowIso(value?: string): string {
  const resolved = value ?? new Date().toISOString();
  if (Number.isNaN(Date.parse(resolved))) {
    throw new Error(`Invalid ISO timestamp: ${resolved}`);
  }
  return new Date(resolved).toISOString();
}

function issue(
  code: SignatureReasonCode,
  message: string,
  context: Partial<SignatureIssue> = {},
): SignatureIssue {
  const definition = signatureReasonDefinition(code);
  return {
    code,
    severity: definition.severity,
    title: definition.title,
    message,
    ...context,
  };
}

function unique<T>(values: readonly T[]): T[] {
  return [...new Set(values)];
}

function identityRank(level: SignerIdentity["identityAssuranceLevel"]): number {
  if (level === "HIGH") return 3;
  if (level === "SUBSTANTIAL") return 2;
  return 1;
}

function decodeHex(value: string): Uint8Array {
  if (!/^[0-9a-f]*$/i.test(value) || value.length % 2 !== 0) {
    throw new Error("Invalid hexadecimal signature encoding");
  }
  const bytes = new Uint8Array(value.length / 2);
  for (let index = 0; index < bytes.length; index += 1) {
    bytes[index] = Number.parseInt(value.slice(index * 2, index * 2 + 2), 16);
  }
  return bytes;
}

function encodeHex(bytes: Uint8Array): string {
  return Array.from(bytes, (value) => value.toString(16).padStart(2, "0")).join("");
}

function bytesToBase64(bytes: Uint8Array): string {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  let result = "";
  for (let index = 0; index < bytes.length; index += 3) {
    const a = bytes[index] ?? 0;
    const b = bytes[index + 1] ?? 0;
    const c = bytes[index + 2] ?? 0;
    const triple = (a << 16) | (b << 8) | c;
    result += alphabet[(triple >>> 18) & 63];
    result += alphabet[(triple >>> 12) & 63];
    result += index + 1 < bytes.length ? alphabet[(triple >>> 6) & 63] : "=";
    result += index + 2 < bytes.length ? alphabet[triple & 63] : "=";
  }
  return result;
}

function base64ToBytes(value: string): Uint8Array {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const clean = normalized.replace(/\s+/g, "");
  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(clean)) throw new Error("Invalid base64 signature encoding");
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  const bytes: number[] = [];
  for (let index = 0; index < clean.length; index += 4) {
    const chars = clean.slice(index, index + 4);
    const values = chars.split("").map((char) => (char === "=" ? 0 : alphabet.indexOf(char)));
    if (values.some((entry) => entry < 0)) throw new Error("Invalid base64 signature encoding");
    const triple = (values[0] << 18) | (values[1] << 12) | (values[2] << 6) | values[3];
    bytes.push((triple >>> 16) & 255);
    if (chars[2] !== "=") bytes.push((triple >>> 8) & 255);
    if (chars[3] !== "=") bytes.push(triple & 255);
  }
  return new Uint8Array(bytes);
}

function encodeSignature(bytes: Uint8Array, encoding: SignatureEncoding): string {
  if (encoding === "HEX") return encodeHex(bytes);
  const base64 = bytesToBase64(bytes);
  return encoding === "BASE64URL"
    ? base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "")
    : base64;
}

function decodeSignature(value: string, encoding: SignatureEncoding): Uint8Array {
  if (encoding === "HEX") return decodeHex(value);
  if (encoding === "BASE64URL") {
    const padded = value + "=".repeat((4 - (value.length % 4)) % 4);
    return base64ToBytes(padded);
  }
  return base64ToBytes(value);
}

export function signatureReasonDefinition(code: SignatureReasonCode): SignatureReasonDefinition {
  const definition = SIGNATURE_REASON_DEFINITIONS.find((entry) => entry.code === code);
  if (!definition) throw new Error(`Unknown signature reason code: ${code}`);
  return definition;
}

export function createSignatureSubject(
  input: {
    subjectId: string;
    kind: SignatureSubjectKind;
    mediaType: string;
    value?: unknown;
    bytes?: Uint8Array;
    digest?: string;
    byteLength?: number;
    version?: string;
    stableUrl?: string;
    createdAt?: string;
  },
): SignatureSubject {
  if (!input.subjectId.trim()) throw new Error("Signature subject ID is required");
  let digest = input.digest;
  let byteLength = input.byteLength;
  if (!digest) {
    if (input.bytes) {
      digest = sha256Hex(input.bytes);
      byteLength = input.bytes.byteLength;
    } else if (input.value !== undefined) {
      const canonical = canonicalize(input.value);
      digest = sha256Hex(canonical);
      byteLength = TEXT_ENCODER.encode(canonical).byteLength;
    } else {
      throw new Error("Signature subject requires bytes, value, or digest");
    }
  }
  const resolvedDigest = digest;
  if (!resolvedDigest || !/^[0-9a-f]{64}$/i.test(resolvedDigest)) {
    throw new Error("Signature subject digest must be SHA-256 hex");
  }
  return {
    subjectId: input.subjectId,
    kind: input.kind,
    mediaType: input.mediaType,
    canonicalizationVersion: TA14_CANONICALIZATION_VERSION,
    hashAlgorithm: TA14_HASH_ALGORITHM,
    digest: resolvedDigest.toLowerCase(),
    byteLength,
    version: input.version,
    stableUrl: input.stableUrl,
    createdAt: input.createdAt,
  };
}

export function subjectFromCanonicalArtifact(artifact: CanonicalExecutionArtifact): SignatureSubject {
  const artifactId = (artifact as { artifactId?: string }).artifactId ?? "UNIDENTIFIED-ARTIFACT";
  return createSignatureSubject({
    subjectId: artifactId,
    kind: "CANONICAL_ARTIFACT",
    mediaType: "application/json",
    value: artifact,
  });
}

export function subjectFromRegistryRecord(record: ArtifactRegistryRecord): SignatureSubject {
  return createSignatureSubject({
    subjectId: record.registryId,
    kind: "REGISTRY_RECORD",
    mediaType: "application/json",
    value: record,
  });
}

export function subjectFromRegistryManifest(manifest: RegistryPublicationManifest): SignatureSubject {
  return createSignatureSubject({
    subjectId: manifest.manifestId,
    kind: "REGISTRY_MANIFEST",
    mediaType: "application/json",
    value: manifest,
  });
}

export function subjectFromIntegrityManifest(manifest: IntegrityManifest): SignatureSubject {
  return createSignatureSubject({
    subjectId: manifest.manifestId,
    kind: "INTEGRITY_MANIFEST",
    mediaType: "application/json",
    value: manifest,
  });
}

export function subjectFromIntegrityComponent(component: IntegrityComponentDigest): SignatureSubject {
  return {
    subjectId: component.componentId,
    kind: component.kind === "PUBLIC_PDF" ? "PUBLIC_PDF" : "OTHER",
    mediaType: component.mediaType,
    canonicalizationVersion: TA14_CANONICALIZATION_VERSION,
    hashAlgorithm: TA14_HASH_ALGORITHM,
    digest: component.hash,
    byteLength: component.byteLength,
    stableUrl: component.stableUrl,
    createdAt: component.createdAt,
  };
}

export function createAttestationStatement(input: {
  attestationId: string;
  decision: AttestationDecision;
  role: AttestationRole;
  statement: string;
  claimsAccepted: readonly string[];
  claimsExcluded?: readonly string[];
  limitations: readonly string[];
  effectiveAt?: string;
  expiresAt?: string;
  policy: SignaturePolicy;
}): AttestationStatement {
  if (!input.statement.trim()) throw new Error("Attestation statement is required");
  if (input.claimsAccepted.length === 0) throw new Error("At least one accepted claim is required");
  if (input.limitations.length === 0) throw new Error("At least one attestation limitation is required");
  return {
    attestationId: input.attestationId,
    statementVersion: "1.0",
    decision: input.decision,
    role: input.role,
    statement: input.statement,
    claimsAccepted: unique(input.claimsAccepted),
    claimsExcluded: unique(input.claimsExcluded ?? []),
    limitations: unique(input.limitations),
    effectiveAt: nowIso(input.effectiveAt),
    expiresAt: input.expiresAt ? nowIso(input.expiresAt) : undefined,
    policyId: input.policy.policyId,
    policyVersion: input.policy.version,
  };
}

export function buildSigningPayload(input: {
  envelopeVersion?: string;
  signer: SignerIdentity;
  publicKey: PublicKeyDescriptor;
  subject: SignatureSubject;
  attestation: AttestationStatement;
  protectedHeaders?: Readonly<Record<string, string>>;
  parentEnvelopeHash?: string;
}): string {
  return canonicalize({
    envelopeVersion: input.envelopeVersion ?? TA14_SIGNATURE_ENVELOPE_VERSION,
    signer: input.signer,
    publicKey: {
      keyId: input.publicKey.keyId,
      algorithm: input.publicKey.algorithm,
      fingerprint: input.publicKey.fingerprint,
      issuer: input.publicKey.issuer,
    },
    subject: input.subject,
    attestation: input.attestation,
    protectedHeaders: input.protectedHeaders ?? {},
    parentEnvelopeHash: input.parentEnvelopeHash ?? null,
  });
}

function validatePolicyPreconditions(
  request: CreateSignatureEnvelopeRequest,
): SignatureIssue[] {
  const issues: SignatureIssue[] = [];
  const { signer, publicKey, subject, attestation, policy } = request;
  if (!signer.signerId.trim()) issues.push(issue("SIGNER_ID_MISSING", "Signer ID is required"));
  if (!signer.displayName.trim()) issues.push(issue("SIGNER_NAME_MISSING", "Signer display name is required"));
  if (!signer.organizationId.trim()) issues.push(issue("SIGNER_ORGANIZATION_MISSING", "Signer organization is required"));
  if (policy.requireGovernanceRegistration && !signer.governanceRegistrationId) {
    issues.push(issue("SIGNER_GOVERNANCE_REGISTRATION_MISSING", "Policy requires governance registration identity"));
  }
  if (!policy.acceptedAlgorithms.includes(publicKey.algorithm)) {
    issues.push(issue("ALGORITHM_POLICY_REJECTED", `Algorithm ${publicKey.algorithm} is not accepted by policy`));
  }
  if (!publicKey.usage.includes("SIGN")) issues.push(issue("KEY_USAGE_REJECTED", "Key is not authorized for signing"));
  if (identityRank(signer.identityAssuranceLevel) < identityRank(policy.minimumIdentityAssurance)) {
    issues.push(issue("IDENTITY_ASSURANCE_INSUFFICIENT", "Signer identity assurance is below policy minimum"));
  }
  if (!policy.permittedSubjectKinds.includes(subject.kind)) {
    issues.push(issue("SUBJECT_KIND_POLICY_REJECTED", `Subject kind ${subject.kind} is not permitted`));
  }
  if (attestation.policyId !== policy.policyId || attestation.policyVersion !== policy.version) {
    issues.push(issue("ATTESTATION_POLICY_MISMATCH", "Attestation policy does not match signing policy"));
  }
  if (attestation.role !== signer.role) {
    issues.push(issue("ATTESTATION_ROLE_MISMATCH", "Attestation role does not match signer role"));
  }
  if (publicKey.revokedAt) issues.push(issue("KEY_REVOKED", "Signing key is revoked"));
  if (publicKey.expiresAt && Date.parse(publicKey.expiresAt) <= Date.now()) {
    issues.push(issue("KEY_EXPIRED", "Signing key has expired"));
  }
  if (policy.requireTrustedTimestamp && !request.timestampProvider) {
    issues.push(issue("TRUSTED_TIMESTAMP_REQUIRED", "Policy requires a trusted timestamp provider"));
  }
  return issues;
}

export async function createSignatureEnvelope(
  request: CreateSignatureEnvelopeRequest,
): Promise<SignatureEnvelope> {
  const issues = validatePolicyPreconditions(request);
  if (issues.some((entry) => entry.severity === "ERROR")) {
    throw new Error(`Signature creation blocked: ${issues.map((entry) => entry.code).join(", ")}`);
  }
  if (!request.provider.supportedAlgorithms.includes(request.publicKey.algorithm)) {
    throw new Error("Signature provider does not support the requested algorithm");
  }
  const signedAt = nowIso(request.now);
  const protectedHeaders = {
    typ: "TA14-SIGNATURE-ENVELOPE",
    alg: request.publicKey.algorithm,
    kid: request.publicKey.keyId,
    c14n: TA14_CANONICALIZATION_VERSION,
    ...request.protectedHeaders,
  };
  const payload = buildSigningPayload({
    signer: request.signer,
    publicKey: request.publicKey,
    subject: request.subject,
    attestation: request.attestation,
    protectedHeaders,
    parentEnvelopeHash: request.parentEnvelope?.envelopeHash,
  });
  const payloadBytes = TEXT_ENCODER.encode(payload);
  const signingPayloadDigest = sha256Hex(payloadBytes);
  const signed = await request.provider.sign({
    algorithm: request.publicKey.algorithm,
    keyId: request.publicKey.keyId,
    payload: payloadBytes,
  });
  const signatureEncoding = request.signatureEncoding ?? "BASE64URL";
  const signatureValue = encodeSignature(signed.signature, signatureEncoding);
  const trustedTimestamp = request.timestampProvider
    ? await request.timestampProvider.issue(signingPayloadDigest)
    : undefined;
  const envelopeWithoutHash = {
    envelopeId: `SIG-${sha256Hex(`${request.subject.subjectId}|${request.signer.signerId}|${signedAt}`).slice(0, 24).toUpperCase()}`,
    envelopeVersion: TA14_SIGNATURE_ENVELOPE_VERSION,
    signatureEngineVersion: TA14_SIGNATURE_ENGINE_VERSION,
    signaturePolicyVersion: TA14_SIGNATURE_POLICY_VERSION,
    createdAt: signedAt,
    signedAt: signed.signedAt ? nowIso(signed.signedAt) : signedAt,
    signer: request.signer,
    publicKey: request.publicKey,
    subject: request.subject,
    attestation: request.attestation,
    protectedHeaders,
    signingPayloadDigest,
    signatureAlgorithm: request.publicKey.algorithm,
    signatureEncoding,
    signatureValue,
    trustedTimestamp,
    parentEnvelopeId: request.parentEnvelope?.envelopeId,
    parentEnvelopeHash: request.parentEnvelope?.envelopeHash,
  };
  return {
    ...envelopeWithoutHash,
    envelopeHash: sha256Hex(canonicalize(envelopeWithoutHash)),
  };
}

function expectedEnvelopeHash(envelope: SignatureEnvelope): string {
  const { envelopeHash: _ignored, ...withoutHash } = envelope;
  return sha256Hex(canonicalize(withoutHash));
}

function verificationDisposition(issues: readonly SignatureIssue[], cryptoValid: boolean | null): SignatureDisposition {
  if (issues.some((entry) => entry.severity === "ERROR")) return "FAILED";
  if (cryptoValid === null) return "INDETERMINATE";
  if (issues.some((entry) => entry.severity === "WARNING")) return "VERIFIED_WITH_WARNINGS";
  return "VERIFIED";
}

export async function verifySignatureEnvelope(
  request: VerifySignatureEnvelopeRequest,
): Promise<SignatureVerificationResult> {
  const issues: SignatureIssue[] = [];
  const { envelope, policy } = request;
  const verifiedAt = nowIso(request.now);
  const calculatedEnvelopeHash = expectedEnvelopeHash(envelope);
  const envelopeHashMatches = constantTimeHexEqual(calculatedEnvelopeHash, envelope.envelopeHash);
  if (!envelopeHashMatches) issues.push(issue("ENVELOPE_HASH_MISMATCH", "Envelope hash does not match envelope content", { envelopeId: envelope.envelopeId }));
  const payload = buildSigningPayload({
    envelopeVersion: envelope.envelopeVersion,
    signer: envelope.signer,
    publicKey: envelope.publicKey,
    subject: envelope.subject,
    attestation: envelope.attestation,
    protectedHeaders: envelope.protectedHeaders,
    parentEnvelopeHash: envelope.parentEnvelopeHash,
  });
  const payloadBytes = TEXT_ENCODER.encode(payload);
  const calculatedPayloadDigest = sha256Hex(payloadBytes);
  const payloadDigestMatches = constantTimeHexEqual(calculatedPayloadDigest, envelope.signingPayloadDigest);
  if (!payloadDigestMatches) issues.push(issue("PAYLOAD_DIGEST_MISMATCH", "Signing payload digest does not match", { envelopeId: envelope.envelopeId }));
  const subjectDigestMatches = request.expectedSubject
    ? constantTimeHexEqual(request.expectedSubject.digest, envelope.subject.digest)
    : true;
  if (!subjectDigestMatches) issues.push(issue("SUBJECT_DIGEST_MISMATCH", "Expected subject digest does not match signed subject", { envelopeId: envelope.envelopeId }));
  if (request.expectedSignerId && request.expectedSignerId !== envelope.signer.signerId) {
    issues.push(issue("SIGNER_ID_MISSING", "Expected signer does not match envelope signer", { expected: request.expectedSignerId, actual: envelope.signer.signerId }));
  }
  const identityAccepted = identityRank(envelope.signer.identityAssuranceLevel) >= identityRank(policy.minimumIdentityAssurance);
  if (!identityAccepted) issues.push(issue("IDENTITY_ASSURANCE_INSUFFICIENT", "Signer identity assurance is below policy minimum"));
  let keyAccepted = true;
  const signedAtMs = Date.parse(envelope.signedAt);
  const nowMs = Date.parse(verifiedAt);
  if (!policy.acceptedAlgorithms.includes(envelope.signatureAlgorithm)) {
    keyAccepted = false;
    issues.push(issue("ALGORITHM_POLICY_REJECTED", "Signature algorithm is rejected by policy"));
  }
  if (envelope.publicKey.expiresAt && Date.parse(envelope.publicKey.expiresAt) < signedAtMs) {
    keyAccepted = false;
    issues.push(issue("KEY_EXPIRED", "Key had expired before the signature was created"));
  } else if (envelope.publicKey.expiresAt && Date.parse(envelope.publicKey.expiresAt) < nowMs && !policy.allowExpiredKeyForHistoricalVerification) {
    keyAccepted = false;
    issues.push(issue("HISTORICAL_SIGNATURE_REJECTED", "Policy rejects historical verification with an expired key"));
  } else if (envelope.publicKey.expiresAt && Date.parse(envelope.publicKey.expiresAt) < nowMs) {
    issues.push(issue("HISTORICAL_SIGNATURE_ACCEPTED", "Expired key is accepted for historical verification because it was valid at signing time"));
  }
  if (envelope.publicKey.revokedAt) {
    const revokedAtMs = Date.parse(envelope.publicKey.revokedAt);
    if (revokedAtMs <= signedAtMs || !policy.allowRevokedKeyForPreRevocationSignature) {
      keyAccepted = false;
      issues.push(issue("REVOCATION_BEFORE_SIGNATURE_REJECTED", "Key revocation invalidates this signature under policy"));
    } else {
      issues.push(issue("REVOCATION_AFTER_SIGNATURE_ACCEPTED", "Signature predates key revocation and is accepted for historical verification"));
    }
  }
  if (policy.maximumSignatureAgeDays !== undefined) {
    const ageDays = (nowMs - signedAtMs) / 86_400_000;
    if (ageDays > policy.maximumSignatureAgeDays) issues.push(issue("SIGNATURE_TOO_OLD", "Signature exceeds policy maximum age"));
  }
  let cryptographicSignatureValid: boolean | null = null;
  if (request.provider) {
    try {
      cryptographicSignatureValid = await request.provider.verify({
        algorithm: envelope.signatureAlgorithm,
        publicKey: envelope.publicKey,
        payload: payloadBytes,
        signature: decodeSignature(envelope.signatureValue, envelope.signatureEncoding),
      });
      if (!cryptographicSignatureValid) issues.push(issue("SIGNATURE_INVALID", "Cryptographic signature verification failed"));
    } catch (error) {
      issues.push(issue("SIGNATURE_PROVIDER_FAILED", error instanceof Error ? error.message : "Signature provider failed"));
    }
  } else {
    issues.push(issue("SIGNATURE_VERIFICATION_UNAVAILABLE", "No cryptographic verification provider was supplied"));
  }
  let timestampValid: boolean | null = null;
  if (envelope.trustedTimestamp) {
    if (!constantTimeHexEqual(envelope.trustedTimestamp.subjectDigest, envelope.signingPayloadDigest)) {
      timestampValid = false;
      issues.push(issue("TRUSTED_TIMESTAMP_SUBJECT_MISMATCH", "Timestamp subject digest does not match signing payload"));
    } else if (request.timestampProvider) {
      try {
        timestampValid = await request.timestampProvider.verify(envelope.trustedTimestamp);
        if (!timestampValid) issues.push(issue("TRUSTED_TIMESTAMP_INVALID", "Trusted timestamp verification failed"));
      } catch (error) {
        issues.push(issue("TIMESTAMP_PROVIDER_FAILED", error instanceof Error ? error.message : "Timestamp provider failed"));
      }
    }
  } else if (policy.requireTrustedTimestamp) {
    issues.push(issue("TRUSTED_TIMESTAMP_MISSING", "Required trusted timestamp is missing"));
  }
  const policyAccepted = !issues.some((entry) => entry.severity === "ERROR" && [
    "ALGORITHM_POLICY_REJECTED",
    "IDENTITY_ASSURANCE_INSUFFICIENT",
    "HISTORICAL_SIGNATURE_REJECTED",
    "REVOCATION_BEFORE_SIGNATURE_REJECTED",
    "TRUSTED_TIMESTAMP_MISSING",
  ].includes(entry.code));
  const disposition = verificationDisposition(issues, cryptographicSignatureValid);
  const verified = disposition === "VERIFIED" || disposition === "VERIFIED_WITH_WARNINGS";
  const status: SignatureStatus = cryptographicSignatureValid === false
    ? "INVALID"
    : !keyAccepted && envelope.publicKey.revokedAt
      ? "REVOKED"
      : !keyAccepted && envelope.publicKey.expiresAt
        ? "EXPIRED"
        : !policyAccepted
          ? "POLICY_REJECTED"
          : cryptographicSignatureValid === null
            ? "VERIFICATION_UNAVAILABLE"
            : "VALID";
  return {
    disposition,
    status,
    verified,
    verifiedAt,
    verifierId: request.verifierId,
    engineVersion: TA14_SIGNATURE_ENGINE_VERSION,
    policyVersion: policy.version,
    envelopeId: envelope.envelopeId,
    envelopeHash: envelope.envelopeHash,
    subjectDigestMatches,
    payloadDigestMatches,
    cryptographicSignatureValid,
    timestampValid,
    identityAccepted,
    keyAccepted,
    policyAccepted,
    issues,
  };
}

export function createSignatureChain(envelopes: readonly SignatureEnvelope[]): readonly SignatureChainEntry[] {
  return envelopes.map((envelope, index) => ({
    sequence: index + 1,
    envelopeId: envelope.envelopeId,
    envelopeHash: envelope.envelopeHash,
    signerId: envelope.signer.signerId,
    signerRole: envelope.signer.role,
    signedAt: envelope.signedAt,
    subjectDigest: envelope.subject.digest,
    parentEnvelopeHash: envelope.parentEnvelopeHash,
  }));
}

export function verifySignatureChain(chain: readonly SignatureChainEntry[]): SignatureIssue[] {
  const issues: SignatureIssue[] = [];
  const seen = new Set<string>();
  chain.forEach((entry, index) => {
    if (entry.sequence !== index + 1) issues.push(issue("SIGNATURE_CHAIN_SEQUENCE_INVALID", `Expected sequence ${index + 1} but received ${entry.sequence}`));
    if (seen.has(entry.envelopeHash)) issues.push(issue("SIGNATURE_CHAIN_DUPLICATE", `Duplicate envelope hash at sequence ${entry.sequence}`));
    seen.add(entry.envelopeHash);
    if (index > 0 && entry.parentEnvelopeHash !== chain[index - 1].envelopeHash) {
      issues.push(issue("SIGNATURE_CHAIN_BROKEN", `Envelope ${entry.envelopeId} does not link to the prior envelope`));
    }
  });
  return issues;
}

export function createSignatureManifest(
  request: CreateSignatureManifestRequest,
): SignatureManifest {
  const generatedAt = nowIso(request.generatedAt);
  const chain = createSignatureChain(request.envelopes);
  const satisfiedRoles = unique(request.envelopes.map((envelope) => envelope.signer.role));
  const missingRoles = request.policy.requiredRoles.filter((role) => !satisfiedRoles.includes(role));
  const manifestWithoutHash = {
    manifestId: `SIG-MAN-${sha256Hex(`${request.artifactId}|${generatedAt}`).slice(0, 24).toUpperCase()}`,
    manifestVersion: "1.0",
    artifactId: request.artifactId,
    registryId: request.registryId,
    governanceRegistrationId: request.governanceRegistrationId,
    generatedAt,
    generatedBy: request.generatedBy,
    signaturePolicyId: request.policy.policyId,
    signaturePolicyVersion: request.policy.version,
    subjectDigests: [...request.subjects],
    envelopes: [...request.envelopes],
    chain,
    requiredRoles: [...request.policy.requiredRoles],
    satisfiedRoles,
    missingRoles,
  };
  return {
    ...manifestWithoutHash,
    manifestHash: sha256Hex(canonicalize(manifestWithoutHash)),
  };
}

export async function verifySignatureManifest(input: {
  manifest: SignatureManifest;
  policy: SignaturePolicy;
  provider?: SignatureProvider;
  timestampProvider?: TimestampProvider;
  verifierId: string;
  now?: string;
}): Promise<SignatureManifestVerificationResult> {
  const issues: SignatureIssue[] = [];
  const { manifestHash: _ignored, ...withoutHash } = input.manifest;
  const manifestHashMatches = constantTimeHexEqual(
    input.manifest.manifestHash,
    sha256Hex(canonicalize(withoutHash)),
  );
  if (!manifestHashMatches) issues.push(issue("MANIFEST_HASH_MISMATCH", "Signature manifest hash does not match content"));
  const chainIssues = verifySignatureChain(input.manifest.chain);
  issues.push(...chainIssues);
  const envelopeResults: SignatureVerificationResult[] = [];
  for (const envelope of input.manifest.envelopes) {
    envelopeResults.push(await verifySignatureEnvelope({
      envelope,
      policy: input.policy,
      provider: input.provider,
      timestampProvider: input.timestampProvider,
      verifierId: input.verifierId,
      now: input.now,
    }));
  }
  const satisfiedRoles = new Set(
    envelopeResults
      .filter((result) => result.verified)
      .map((result) => input.manifest.envelopes.find((envelope) => envelope.envelopeId === result.envelopeId)?.signer.role)
      .filter((role): role is AttestationRole => Boolean(role)),
  );
  const missingRoles = input.policy.requiredRoles.filter((role) => !satisfiedRoles.has(role));
  if (missingRoles.length > 0) issues.push(issue("MANIFEST_REQUIRED_ROLE_MISSING", `Missing verified roles: ${missingRoles.join(", ")}`));
  const independentCount = [...satisfiedRoles].filter((role) => role === "INDEPENDENT_REVIEWER").length;
  if (independentCount < input.policy.minimumIndependentReviewers) {
    issues.push(issue("INDEPENDENT_REVIEW_REQUIRED", `Policy requires ${input.policy.minimumIndependentReviewers} independent reviewer(s)`));
  }
  const verified = manifestHashMatches
    && chainIssues.every((entry) => entry.severity !== "ERROR")
    && missingRoles.length === 0
    && envelopeResults.every((result) => result.verified);
  const disposition: SignatureDisposition = verified
    ? issues.some((entry) => entry.severity === "WARNING") ? "VERIFIED_WITH_WARNINGS" : "VERIFIED"
    : envelopeResults.some((result) => result.disposition === "INDETERMINATE") ? "INDETERMINATE" : "FAILED";
  return {
    disposition,
    verified,
    verifiedAt: nowIso(input.now),
    verifierId: input.verifierId,
    manifestHashMatches,
    chainValid: chainIssues.every((entry) => entry.severity !== "ERROR"),
    requiredRolesSatisfied: missingRoles.length === 0,
    envelopeResults,
    issues,
  };
}

export function createAttestationCertificate(input: {
  artifactId: string;
  registryId?: string;
  governanceRegistrationId?: string;
  envelope: SignatureEnvelope;
  verification: SignatureVerificationResult;
}): SignatureAttestationCertificate {
  const certificateWithoutHash = {
    certificateId: `ATT-CERT-${sha256Hex(`${input.envelope.envelopeId}|${input.verification.verifiedAt}`).slice(0, 24).toUpperCase()}`,
    artifactId: input.artifactId,
    registryId: input.registryId,
    governanceRegistrationId: input.governanceRegistrationId,
    signerId: input.envelope.signer.signerId,
    signerName: input.envelope.signer.displayName,
    signerRole: input.envelope.signer.role,
    organizationId: input.envelope.signer.organizationId,
    decision: input.envelope.attestation.decision,
    subjectId: input.envelope.subject.subjectId,
    subjectDigest: input.envelope.subject.digest,
    signedAt: input.envelope.signedAt,
    signatureAlgorithm: input.envelope.signatureAlgorithm,
    keyId: input.envelope.publicKey.keyId,
    keyFingerprint: input.envelope.publicKey.fingerprint,
    envelopeId: input.envelope.envelopeId,
    envelopeHash: input.envelope.envelopeHash,
    statement: input.envelope.attestation.statement,
    limitations: input.envelope.attestation.limitations,
    verificationStatus: input.verification.status,
  };
  return {
    ...certificateWithoutHash,
    certificateHash: sha256Hex(canonicalize(certificateWithoutHash)),
  };
}

export function appendSignatureAuditEvent(
  events: readonly SignatureAuditEvent[],
  input: Omit<SignatureAuditEvent, "eventId" | "sequence" | "previousHash" | "eventHash">,
): SignatureAuditEvent[] {
  const sequence = events.length + 1;
  const previousHash = events.at(-1)?.eventHash ?? "GENESIS";
  const eventWithoutHash = {
    eventId: `SIG-EVT-${sequence.toString().padStart(6, "0")}`,
    sequence,
    occurredAt: nowIso(input.occurredAt),
    actorId: input.actorId,
    eventType: input.eventType,
    subjectId: input.subjectId,
    envelopeId: input.envelopeId,
    description: input.description,
    previousHash,
  };
  return [...events, { ...eventWithoutHash, eventHash: sha256Hex(canonicalize(eventWithoutHash)) }];
}

export function verifySignatureAuditChain(events: readonly SignatureAuditEvent[]): SignatureIssue[] {
  const issues: SignatureIssue[] = [];
  events.forEach((event, index) => {
    const expectedPrevious = index === 0 ? "GENESIS" : events[index - 1].eventHash;
    if (event.previousHash !== expectedPrevious) issues.push(issue("AUDIT_CHAIN_INVALID", `Audit event ${event.eventId} has an invalid previous hash`));
    const { eventHash: _ignored, ...withoutHash } = event;
    const expectedHash = sha256Hex(canonicalize(withoutHash));
    if (!constantTimeHexEqual(expectedHash, event.eventHash)) issues.push(issue("AUDIT_EVENT_HASH_MISMATCH", `Audit event ${event.eventId} hash does not match`));
  });
  return issues;
}

export function stableSignatureEnvelopeJson(envelope: SignatureEnvelope): string {
  return canonicalize(envelope);
}

export function stableSignatureManifestJson(manifest: SignatureManifest): string {
  return canonicalize(manifest);
}

export function stableSignatureVerificationJson(result: SignatureVerificationResult | SignatureManifestVerificationResult): string {
  return canonicalize(result);
}

export function signatureControlsByDomain(domain: SignatureControlDefinition["domain"]): readonly SignatureControlDefinition[] {
  return SIGNATURE_CONTROLS.filter((control) => control.domain === domain);
}

export function signatureAcceptanceTestsByPrefix(prefix: string): readonly SignatureAcceptanceTest[] {
  return SIGNATURE_ACCEPTANCE_TESTS.filter((test) => test.testId.startsWith(prefix));
}

export function createDefaultSignaturePolicy(input: {
  policyId?: string;
  version?: string;
  requireRegistryPublication?: boolean;
  requireTrustedTimestamp?: boolean;
  requiredRoles?: readonly AttestationRole[];
  minimumIndependentReviewers?: number;
} = {}): SignaturePolicy {
  return {
    policyId: input.policyId ?? "TA14-SIGNATURE-POLICY",
    version: input.version ?? TA14_SIGNATURE_POLICY_VERSION,
    title: "TA-14 Execution Artifact Signature and Attestation Policy",
    acceptedAlgorithms: ["ED25519", "ECDSA_P256_SHA256", "RSA_PSS_SHA256", "EXTERNAL_QUALIFIED_SIGNATURE"],
    minimumIdentityAssurance: "SUBSTANTIAL",
    requireGovernanceRegistration: true,
    requireRegistryPublication: input.requireRegistryPublication ?? true,
    requireTrustedTimestamp: input.requireTrustedTimestamp ?? false,
    maximumSignatureAgeDays: undefined,
    requiredRoles: input.requiredRoles ?? ["GOVERNANCE_ACCOUNTABLE_OWNER", "ARTIFACT_PUBLISHER"],
    minimumIndependentReviewers: input.minimumIndependentReviewers ?? 0,
    allowExpiredKeyForHistoricalVerification: true,
    allowRevokedKeyForPreRevocationSignature: true,
    permittedSubjectKinds: [
      "CANONICAL_ARTIFACT",
      "PUBLIC_PDF",
      "INTEGRITY_MANIFEST",
      "REGISTRY_RECORD",
      "REGISTRY_MANIFEST",
      "VERIFICATION_REPORT",
      "DISCLOSURE_PROJECTION",
      "CHALLENGE_RECORD",
      "CORRECTION_RECORD",
      "SUPERSESSION_RECORD",
      "WITHDRAWAL_RECORD",
      "PORTFOLIO_EXPORT",
      "OTHER",
    ],
  };
}

export function describeSignatureEngine(): string {
  return [
    "TA-14 Digital Signature & Attestation Engine",
    `Engine version: ${TA14_SIGNATURE_ENGINE_VERSION}`,
    `Policy version: ${TA14_SIGNATURE_POLICY_VERSION}`,
    `Envelope version: ${TA14_SIGNATURE_ENVELOPE_VERSION}`,
    TA14_ATTESTATION_RULE,
    "The engine never fabricates a cryptographic signature. Signing and verification require an explicit provider.",
  ].join("\n");
}

export function runSignatureSelfTests(): readonly { name: string; passed: boolean; detail: string }[] {
  const subject = createSignatureSubject({
    subjectId: "SELF-TEST",
    kind: "OTHER",
    mediaType: "text/plain",
    value: { value: 1 },
  });
  const deterministic = subject.digest === createSignatureSubject({
    subjectId: "SELF-TEST",
    kind: "OTHER",
    mediaType: "text/plain",
    value: { value: 1 },
  }).digest;
  const changed = subject.digest !== createSignatureSubject({
    subjectId: "SELF-TEST",
    kind: "OTHER",
    mediaType: "text/plain",
    value: { value: 2 },
  }).digest;
  const chain = createSignatureChain([]);
  return [
    { name: "deterministic subject digest", passed: deterministic, detail: subject.digest },
    { name: "mutation changes digest", passed: changed, detail: "Changed canonical value changes SHA-256 digest" },
    { name: "empty chain accepted", passed: verifySignatureChain(chain).length === 0, detail: "Empty chain has no broken links" },
    { name: "reason dictionary complete", passed: SIGNATURE_REASON_DEFINITIONS.length > 80, detail: `${SIGNATURE_REASON_DEFINITIONS.length} reason definitions` },
    { name: "control catalog complete", passed: SIGNATURE_CONTROLS.length === 96, detail: `${SIGNATURE_CONTROLS.length} controls` },
    { name: "acceptance tests complete", passed: SIGNATURE_ACCEPTANCE_TESTS.length === 80, detail: `${SIGNATURE_ACCEPTANCE_TESTS.length} tests` },
  ];
}

export const SIGNATURE_ENGINE_EXPORTS = {
  engineVersion: TA14_SIGNATURE_ENGINE_VERSION,
  policyVersion: TA14_SIGNATURE_POLICY_VERSION,
  envelopeVersion: TA14_SIGNATURE_ENVELOPE_VERSION,
  rule: TA14_ATTESTATION_RULE,
  reasonDefinitions: SIGNATURE_REASON_DEFINITIONS,
  controls: SIGNATURE_CONTROLS,
  acceptanceTests: SIGNATURE_ACCEPTANCE_TESTS,
} as const;


export interface SignatureRoleProfile {
  profileId: string;
  role: AttestationRole;
  minimumIdentityAssurance: "LOW" | "SUBSTANTIAL" | "HIGH";
  permittedSubjectKinds: readonly SignatureSubjectKind[];
  requiredClaims: readonly string[];
  mandatoryLimitations: readonly string[];
}

export interface SignatureScenarioPolicy {
  scenarioId: string;
  title: string;
  subjectKind: SignatureSubjectKind;
  requiredRoles: readonly AttestationRole[];
  minimumIndependentReviewers: number;
  trustedTimestampRequired: boolean;
  institutionalPurpose: string;
}

export const SIGNATURE_ROLE_PROFILES: readonly SignatureRoleProfile[] = [
  {
    profileId: "SIG-ROLE-001",
    role: "GOVERNANCE_ACCOUNTABLE_OWNER",
    minimumIdentityAssurance: "HIGH",
    permittedSubjectKinds: ["CANONICAL_ARTIFACT", "PUBLIC_PDF", "INTEGRITY_MANIFEST", "REGISTRY_RECORD", "VERIFICATION_REPORT", "OTHER"],
    requiredClaims: ["Identity is attributable", "Subject digest is exact", "Attestation is bounded"],
    mandatoryLimitations: ["Signature does not prove truth", "Signature does not expand authority", "Signature applies only to the identified subject digest"],
  },
  {
    profileId: "SIG-ROLE-002",
    role: "ARTIFACT_PUBLISHER",
    minimumIdentityAssurance: "SUBSTANTIAL",
    permittedSubjectKinds: ["CANONICAL_ARTIFACT", "PUBLIC_PDF", "INTEGRITY_MANIFEST", "REGISTRY_RECORD", "VERIFICATION_REPORT", "OTHER"],
    requiredClaims: ["Identity is attributable", "Subject digest is exact", "Attestation is bounded"],
    mandatoryLimitations: ["Signature does not prove truth", "Signature does not expand authority", "Signature applies only to the identified subject digest"],
  },
  {
    profileId: "SIG-ROLE-003",
    role: "ROUTE_STEWARD",
    minimumIdentityAssurance: "SUBSTANTIAL",
    permittedSubjectKinds: ["CANONICAL_ARTIFACT", "PUBLIC_PDF", "INTEGRITY_MANIFEST", "REGISTRY_RECORD", "VERIFICATION_REPORT", "OTHER"],
    requiredClaims: ["Identity is attributable", "Subject digest is exact", "Attestation is bounded"],
    mandatoryLimitations: ["Signature does not prove truth", "Signature does not expand authority", "Signature applies only to the identified subject digest"],
  },
  {
    profileId: "SIG-ROLE-004",
    role: "EVIDENCE_CUSTODIAN",
    minimumIdentityAssurance: "SUBSTANTIAL",
    permittedSubjectKinds: ["CANONICAL_ARTIFACT", "PUBLIC_PDF", "INTEGRITY_MANIFEST", "REGISTRY_RECORD", "VERIFICATION_REPORT", "OTHER"],
    requiredClaims: ["Identity is attributable", "Subject digest is exact", "Attestation is bounded"],
    mandatoryLimitations: ["Signature does not prove truth", "Signature does not expand authority", "Signature applies only to the identified subject digest"],
  },
  {
    profileId: "SIG-ROLE-005",
    role: "AUTHORITY_RESOLVER",
    minimumIdentityAssurance: "SUBSTANTIAL",
    permittedSubjectKinds: ["CANONICAL_ARTIFACT", "PUBLIC_PDF", "INTEGRITY_MANIFEST", "REGISTRY_RECORD", "VERIFICATION_REPORT", "OTHER"],
    requiredClaims: ["Identity is attributable", "Subject digest is exact", "Attestation is bounded"],
    mandatoryLimitations: ["Signature does not prove truth", "Signature does not expand authority", "Signature applies only to the identified subject digest"],
  },
  {
    profileId: "SIG-ROLE-006",
    role: "EXECUTION_ADAPTER_OWNER",
    minimumIdentityAssurance: "SUBSTANTIAL",
    permittedSubjectKinds: ["CANONICAL_ARTIFACT", "PUBLIC_PDF", "INTEGRITY_MANIFEST", "REGISTRY_RECORD", "VERIFICATION_REPORT", "OTHER"],
    requiredClaims: ["Identity is attributable", "Subject digest is exact", "Attestation is bounded"],
    mandatoryLimitations: ["Signature does not prove truth", "Signature does not expand authority", "Signature applies only to the identified subject digest"],
  },
  {
    profileId: "SIG-ROLE-007",
    role: "OUTCOME_VERIFIER",
    minimumIdentityAssurance: "SUBSTANTIAL",
    permittedSubjectKinds: ["CANONICAL_ARTIFACT", "PUBLIC_PDF", "INTEGRITY_MANIFEST", "REGISTRY_RECORD", "VERIFICATION_REPORT", "OTHER"],
    requiredClaims: ["Identity is attributable", "Subject digest is exact", "Attestation is bounded"],
    mandatoryLimitations: ["Signature does not prove truth", "Signature does not expand authority", "Signature applies only to the identified subject digest"],
  },
  {
    profileId: "SIG-ROLE-008",
    role: "ARTIFACT_REVIEWER",
    minimumIdentityAssurance: "SUBSTANTIAL",
    permittedSubjectKinds: ["CANONICAL_ARTIFACT", "PUBLIC_PDF", "INTEGRITY_MANIFEST", "REGISTRY_RECORD", "VERIFICATION_REPORT", "OTHER"],
    requiredClaims: ["Identity is attributable", "Subject digest is exact", "Attestation is bounded"],
    mandatoryLimitations: ["Signature does not prove truth", "Signature does not expand authority", "Signature applies only to the identified subject digest"],
  },
  {
    profileId: "SIG-ROLE-009",
    role: "INDEPENDENT_REVIEWER",
    minimumIdentityAssurance: "HIGH",
    permittedSubjectKinds: ["CANONICAL_ARTIFACT", "PUBLIC_PDF", "INTEGRITY_MANIFEST", "REGISTRY_RECORD", "VERIFICATION_REPORT", "OTHER"],
    requiredClaims: ["Identity is attributable", "Subject digest is exact", "Attestation is bounded"],
    mandatoryLimitations: ["Signature does not prove truth", "Signature does not expand authority", "Signature applies only to the identified subject digest"],
  },
  {
    profileId: "SIG-ROLE-010",
    role: "CHALLENGE_OFFICER",
    minimumIdentityAssurance: "SUBSTANTIAL",
    permittedSubjectKinds: ["CANONICAL_ARTIFACT", "PUBLIC_PDF", "INTEGRITY_MANIFEST", "REGISTRY_RECORD", "VERIFICATION_REPORT", "OTHER"],
    requiredClaims: ["Identity is attributable", "Subject digest is exact", "Attestation is bounded"],
    mandatoryLimitations: ["Signature does not prove truth", "Signature does not expand authority", "Signature applies only to the identified subject digest"],
  },
  {
    profileId: "SIG-ROLE-011",
    role: "REGISTRY_STEWARD",
    minimumIdentityAssurance: "HIGH",
    permittedSubjectKinds: ["CANONICAL_ARTIFACT", "PUBLIC_PDF", "INTEGRITY_MANIFEST", "REGISTRY_RECORD", "VERIFICATION_REPORT", "OTHER"],
    requiredClaims: ["Identity is attributable", "Subject digest is exact", "Attestation is bounded"],
    mandatoryLimitations: ["Signature does not prove truth", "Signature does not expand authority", "Signature applies only to the identified subject digest"],
  },
  {
    profileId: "SIG-ROLE-012",
    role: "REGULATORY_REVIEWER",
    minimumIdentityAssurance: "HIGH",
    permittedSubjectKinds: ["CANONICAL_ARTIFACT", "PUBLIC_PDF", "INTEGRITY_MANIFEST", "REGISTRY_RECORD", "VERIFICATION_REPORT", "OTHER"],
    requiredClaims: ["Identity is attributable", "Subject digest is exact", "Attestation is bounded"],
    mandatoryLimitations: ["Signature does not prove truth", "Signature does not expand authority", "Signature applies only to the identified subject digest"],
  },
  {
    profileId: "SIG-ROLE-013",
    role: "CONTRACTUAL_REVIEWER",
    minimumIdentityAssurance: "SUBSTANTIAL",
    permittedSubjectKinds: ["CANONICAL_ARTIFACT", "PUBLIC_PDF", "INTEGRITY_MANIFEST", "REGISTRY_RECORD", "VERIFICATION_REPORT", "OTHER"],
    requiredClaims: ["Identity is attributable", "Subject digest is exact", "Attestation is bounded"],
    mandatoryLimitations: ["Signature does not prove truth", "Signature does not expand authority", "Signature applies only to the identified subject digest"],
  },
] as const;

export const SIGNATURE_SCENARIO_POLICIES: readonly SignatureScenarioPolicy[] = [
  {
    scenarioId: "SIG-SCEN-001",
    title: "Institutional signature scenario 001",
    subjectKind: "CANONICAL_ARTIFACT",
    requiredRoles: ["GOVERNANCE_ACCOUNTABLE_OWNER", "ARTIFACT_PUBLISHER"],
    minimumIndependentReviewers: 0,
    trustedTimestampRequired: false,
    institutionalPurpose: "Bind accountable signers to the exact canonical artifact subject without expanding the underlying claim.",
  },
  {
    scenarioId: "SIG-SCEN-002",
    title: "Institutional signature scenario 002",
    subjectKind: "PUBLIC_PDF",
    requiredRoles: ["ARTIFACT_PUBLISHER", "ROUTE_STEWARD"],
    minimumIndependentReviewers: 0,
    trustedTimestampRequired: false,
    institutionalPurpose: "Bind accountable signers to the exact public pdf subject without expanding the underlying claim.",
  },
  {
    scenarioId: "SIG-SCEN-003",
    title: "Institutional signature scenario 003",
    subjectKind: "INTEGRITY_MANIFEST",
    requiredRoles: ["ROUTE_STEWARD", "EVIDENCE_CUSTODIAN"],
    minimumIndependentReviewers: 0,
    trustedTimestampRequired: true,
    institutionalPurpose: "Bind accountable signers to the exact integrity manifest subject without expanding the underlying claim.",
  },
  {
    scenarioId: "SIG-SCEN-004",
    title: "Institutional signature scenario 004",
    subjectKind: "REGISTRY_RECORD",
    requiredRoles: ["EVIDENCE_CUSTODIAN", "AUTHORITY_RESOLVER"],
    minimumIndependentReviewers: 1,
    trustedTimestampRequired: false,
    institutionalPurpose: "Bind accountable signers to the exact registry record subject without expanding the underlying claim.",
  },
  {
    scenarioId: "SIG-SCEN-005",
    title: "Institutional signature scenario 005",
    subjectKind: "REGISTRY_MANIFEST",
    requiredRoles: ["AUTHORITY_RESOLVER", "EXECUTION_ADAPTER_OWNER"],
    minimumIndependentReviewers: 0,
    trustedTimestampRequired: false,
    institutionalPurpose: "Bind accountable signers to the exact registry manifest subject without expanding the underlying claim.",
  },
  {
    scenarioId: "SIG-SCEN-006",
    title: "Institutional signature scenario 006",
    subjectKind: "VERIFICATION_REPORT",
    requiredRoles: ["EXECUTION_ADAPTER_OWNER", "OUTCOME_VERIFIER"],
    minimumIndependentReviewers: 0,
    trustedTimestampRequired: true,
    institutionalPurpose: "Bind accountable signers to the exact verification report subject without expanding the underlying claim.",
  },
  {
    scenarioId: "SIG-SCEN-007",
    title: "Institutional signature scenario 007",
    subjectKind: "DISCLOSURE_PROJECTION",
    requiredRoles: ["OUTCOME_VERIFIER", "ARTIFACT_REVIEWER"],
    minimumIndependentReviewers: 0,
    trustedTimestampRequired: false,
    institutionalPurpose: "Bind accountable signers to the exact disclosure projection subject without expanding the underlying claim.",
  },
  {
    scenarioId: "SIG-SCEN-008",
    title: "Institutional signature scenario 008",
    subjectKind: "CHALLENGE_RECORD",
    requiredRoles: ["ARTIFACT_REVIEWER", "INDEPENDENT_REVIEWER"],
    minimumIndependentReviewers: 1,
    trustedTimestampRequired: false,
    institutionalPurpose: "Bind accountable signers to the exact challenge record subject without expanding the underlying claim.",
  },
  {
    scenarioId: "SIG-SCEN-009",
    title: "Institutional signature scenario 009",
    subjectKind: "CORRECTION_RECORD",
    requiredRoles: ["INDEPENDENT_REVIEWER", "CHALLENGE_OFFICER"],
    minimumIndependentReviewers: 0,
    trustedTimestampRequired: true,
    institutionalPurpose: "Bind accountable signers to the exact correction record subject without expanding the underlying claim.",
  },
  {
    scenarioId: "SIG-SCEN-010",
    title: "Institutional signature scenario 010",
    subjectKind: "SUPERSESSION_RECORD",
    requiredRoles: ["CHALLENGE_OFFICER", "REGISTRY_STEWARD"],
    minimumIndependentReviewers: 0,
    trustedTimestampRequired: false,
    institutionalPurpose: "Bind accountable signers to the exact supersession record subject without expanding the underlying claim.",
  },
  {
    scenarioId: "SIG-SCEN-011",
    title: "Institutional signature scenario 011",
    subjectKind: "WITHDRAWAL_RECORD",
    requiredRoles: ["REGISTRY_STEWARD", "REGULATORY_REVIEWER"],
    minimumIndependentReviewers: 0,
    trustedTimestampRequired: false,
    institutionalPurpose: "Bind accountable signers to the exact withdrawal record subject without expanding the underlying claim.",
  },
  {
    scenarioId: "SIG-SCEN-012",
    title: "Institutional signature scenario 012",
    subjectKind: "PORTFOLIO_EXPORT",
    requiredRoles: ["REGULATORY_REVIEWER", "CONTRACTUAL_REVIEWER"],
    minimumIndependentReviewers: 1,
    trustedTimestampRequired: true,
    institutionalPurpose: "Bind accountable signers to the exact portfolio export subject without expanding the underlying claim.",
  },
  {
    scenarioId: "SIG-SCEN-013",
    title: "Institutional signature scenario 013",
    subjectKind: "CANONICAL_ARTIFACT",
    requiredRoles: ["CONTRACTUAL_REVIEWER", "GOVERNANCE_ACCOUNTABLE_OWNER"],
    minimumIndependentReviewers: 0,
    trustedTimestampRequired: false,
    institutionalPurpose: "Bind accountable signers to the exact canonical artifact subject without expanding the underlying claim.",
  },
  {
    scenarioId: "SIG-SCEN-014",
    title: "Institutional signature scenario 014",
    subjectKind: "PUBLIC_PDF",
    requiredRoles: ["GOVERNANCE_ACCOUNTABLE_OWNER", "ARTIFACT_PUBLISHER"],
    minimumIndependentReviewers: 0,
    trustedTimestampRequired: false,
    institutionalPurpose: "Bind accountable signers to the exact public pdf subject without expanding the underlying claim.",
  },
  {
    scenarioId: "SIG-SCEN-015",
    title: "Institutional signature scenario 015",
    subjectKind: "INTEGRITY_MANIFEST",
    requiredRoles: ["ARTIFACT_PUBLISHER", "ROUTE_STEWARD"],
    minimumIndependentReviewers: 0,
    trustedTimestampRequired: true,
    institutionalPurpose: "Bind accountable signers to the exact integrity manifest subject without expanding the underlying claim.",
  },
  {
    scenarioId: "SIG-SCEN-016",
    title: "Institutional signature scenario 016",
    subjectKind: "REGISTRY_RECORD",
    requiredRoles: ["ROUTE_STEWARD", "EVIDENCE_CUSTODIAN"],
    minimumIndependentReviewers: 1,
    trustedTimestampRequired: false,
    institutionalPurpose: "Bind accountable signers to the exact registry record subject without expanding the underlying claim.",
  },
  {
    scenarioId: "SIG-SCEN-017",
    title: "Institutional signature scenario 017",
    subjectKind: "REGISTRY_MANIFEST",
    requiredRoles: ["EVIDENCE_CUSTODIAN", "AUTHORITY_RESOLVER"],
    minimumIndependentReviewers: 0,
    trustedTimestampRequired: false,
    institutionalPurpose: "Bind accountable signers to the exact registry manifest subject without expanding the underlying claim.",
  },
  {
    scenarioId: "SIG-SCEN-018",
    title: "Institutional signature scenario 018",
    subjectKind: "VERIFICATION_REPORT",
    requiredRoles: ["AUTHORITY_RESOLVER", "EXECUTION_ADAPTER_OWNER"],
    minimumIndependentReviewers: 0,
    trustedTimestampRequired: true,
    institutionalPurpose: "Bind accountable signers to the exact verification report subject without expanding the underlying claim.",
  },
  {
    scenarioId: "SIG-SCEN-019",
    title: "Institutional signature scenario 019",
    subjectKind: "DISCLOSURE_PROJECTION",
    requiredRoles: ["EXECUTION_ADAPTER_OWNER", "OUTCOME_VERIFIER"],
    minimumIndependentReviewers: 0,
    trustedTimestampRequired: false,
    institutionalPurpose: "Bind accountable signers to the exact disclosure projection subject without expanding the underlying claim.",
  },
  {
    scenarioId: "SIG-SCEN-020",
    title: "Institutional signature scenario 020",
    subjectKind: "CHALLENGE_RECORD",
    requiredRoles: ["OUTCOME_VERIFIER", "ARTIFACT_REVIEWER"],
    minimumIndependentReviewers: 1,
    trustedTimestampRequired: false,
    institutionalPurpose: "Bind accountable signers to the exact challenge record subject without expanding the underlying claim.",
  },
  {
    scenarioId: "SIG-SCEN-021",
    title: "Institutional signature scenario 021",
    subjectKind: "CORRECTION_RECORD",
    requiredRoles: ["ARTIFACT_REVIEWER", "INDEPENDENT_REVIEWER"],
    minimumIndependentReviewers: 0,
    trustedTimestampRequired: true,
    institutionalPurpose: "Bind accountable signers to the exact correction record subject without expanding the underlying claim.",
  },
  {
    scenarioId: "SIG-SCEN-022",
    title: "Institutional signature scenario 022",
    subjectKind: "SUPERSESSION_RECORD",
    requiredRoles: ["INDEPENDENT_REVIEWER", "CHALLENGE_OFFICER"],
    minimumIndependentReviewers: 0,
    trustedTimestampRequired: false,
    institutionalPurpose: "Bind accountable signers to the exact supersession record subject without expanding the underlying claim.",
  },
  {
    scenarioId: "SIG-SCEN-023",
    title: "Institutional signature scenario 023",
    subjectKind: "WITHDRAWAL_RECORD",
    requiredRoles: ["CHALLENGE_OFFICER", "REGISTRY_STEWARD"],
    minimumIndependentReviewers: 0,
    trustedTimestampRequired: false,
    institutionalPurpose: "Bind accountable signers to the exact withdrawal record subject without expanding the underlying claim.",
  },
  {
    scenarioId: "SIG-SCEN-024",
    title: "Institutional signature scenario 024",
    subjectKind: "PORTFOLIO_EXPORT",
    requiredRoles: ["REGISTRY_STEWARD", "REGULATORY_REVIEWER"],
    minimumIndependentReviewers: 1,
    trustedTimestampRequired: true,
    institutionalPurpose: "Bind accountable signers to the exact portfolio export subject without expanding the underlying claim.",
  },
  {
    scenarioId: "SIG-SCEN-025",
    title: "Institutional signature scenario 025",
    subjectKind: "CANONICAL_ARTIFACT",
    requiredRoles: ["REGULATORY_REVIEWER", "CONTRACTUAL_REVIEWER"],
    minimumIndependentReviewers: 0,
    trustedTimestampRequired: false,
    institutionalPurpose: "Bind accountable signers to the exact canonical artifact subject without expanding the underlying claim.",
  },
  {
    scenarioId: "SIG-SCEN-026",
    title: "Institutional signature scenario 026",
    subjectKind: "PUBLIC_PDF",
    requiredRoles: ["CONTRACTUAL_REVIEWER", "GOVERNANCE_ACCOUNTABLE_OWNER"],
    minimumIndependentReviewers: 0,
    trustedTimestampRequired: false,
    institutionalPurpose: "Bind accountable signers to the exact public pdf subject without expanding the underlying claim.",
  },
  {
    scenarioId: "SIG-SCEN-027",
    title: "Institutional signature scenario 027",
    subjectKind: "INTEGRITY_MANIFEST",
    requiredRoles: ["GOVERNANCE_ACCOUNTABLE_OWNER", "ARTIFACT_PUBLISHER"],
    minimumIndependentReviewers: 0,
    trustedTimestampRequired: true,
    institutionalPurpose: "Bind accountable signers to the exact integrity manifest subject without expanding the underlying claim.",
  },
  {
    scenarioId: "SIG-SCEN-028",
    title: "Institutional signature scenario 028",
    subjectKind: "REGISTRY_RECORD",
    requiredRoles: ["ARTIFACT_PUBLISHER", "ROUTE_STEWARD"],
    minimumIndependentReviewers: 1,
    trustedTimestampRequired: false,
    institutionalPurpose: "Bind accountable signers to the exact registry record subject without expanding the underlying claim.",
  },
  {
    scenarioId: "SIG-SCEN-029",
    title: "Institutional signature scenario 029",
    subjectKind: "REGISTRY_MANIFEST",
    requiredRoles: ["ROUTE_STEWARD", "EVIDENCE_CUSTODIAN"],
    minimumIndependentReviewers: 0,
    trustedTimestampRequired: false,
    institutionalPurpose: "Bind accountable signers to the exact registry manifest subject without expanding the underlying claim.",
  },
  {
    scenarioId: "SIG-SCEN-030",
    title: "Institutional signature scenario 030",
    subjectKind: "VERIFICATION_REPORT",
    requiredRoles: ["EVIDENCE_CUSTODIAN", "AUTHORITY_RESOLVER"],
    minimumIndependentReviewers: 0,
    trustedTimestampRequired: true,
    institutionalPurpose: "Bind accountable signers to the exact verification report subject without expanding the underlying claim.",
  },
  {
    scenarioId: "SIG-SCEN-031",
    title: "Institutional signature scenario 031",
    subjectKind: "DISCLOSURE_PROJECTION",
    requiredRoles: ["AUTHORITY_RESOLVER", "EXECUTION_ADAPTER_OWNER"],
    minimumIndependentReviewers: 0,
    trustedTimestampRequired: false,
    institutionalPurpose: "Bind accountable signers to the exact disclosure projection subject without expanding the underlying claim.",
  },
  {
    scenarioId: "SIG-SCEN-032",
    title: "Institutional signature scenario 032",
    subjectKind: "CHALLENGE_RECORD",
    requiredRoles: ["EXECUTION_ADAPTER_OWNER", "OUTCOME_VERIFIER"],
    minimumIndependentReviewers: 1,
    trustedTimestampRequired: false,
    institutionalPurpose: "Bind accountable signers to the exact challenge record subject without expanding the underlying claim.",
  },
  {
    scenarioId: "SIG-SCEN-033",
    title: "Institutional signature scenario 033",
    subjectKind: "CORRECTION_RECORD",
    requiredRoles: ["OUTCOME_VERIFIER", "ARTIFACT_REVIEWER"],
    minimumIndependentReviewers: 0,
    trustedTimestampRequired: true,
    institutionalPurpose: "Bind accountable signers to the exact correction record subject without expanding the underlying claim.",
  },
  {
    scenarioId: "SIG-SCEN-034",
    title: "Institutional signature scenario 034",
    subjectKind: "SUPERSESSION_RECORD",
    requiredRoles: ["ARTIFACT_REVIEWER", "INDEPENDENT_REVIEWER"],
    minimumIndependentReviewers: 0,
    trustedTimestampRequired: false,
    institutionalPurpose: "Bind accountable signers to the exact supersession record subject without expanding the underlying claim.",
  },
  {
    scenarioId: "SIG-SCEN-035",
    title: "Institutional signature scenario 035",
    subjectKind: "WITHDRAWAL_RECORD",
    requiredRoles: ["INDEPENDENT_REVIEWER", "CHALLENGE_OFFICER"],
    minimumIndependentReviewers: 0,
    trustedTimestampRequired: false,
    institutionalPurpose: "Bind accountable signers to the exact withdrawal record subject without expanding the underlying claim.",
  },
  {
    scenarioId: "SIG-SCEN-036",
    title: "Institutional signature scenario 036",
    subjectKind: "PORTFOLIO_EXPORT",
    requiredRoles: ["CHALLENGE_OFFICER", "REGISTRY_STEWARD"],
    minimumIndependentReviewers: 1,
    trustedTimestampRequired: true,
    institutionalPurpose: "Bind accountable signers to the exact portfolio export subject without expanding the underlying claim.",
  },
  {
    scenarioId: "SIG-SCEN-037",
    title: "Institutional signature scenario 037",
    subjectKind: "CANONICAL_ARTIFACT",
    requiredRoles: ["REGISTRY_STEWARD", "REGULATORY_REVIEWER"],
    minimumIndependentReviewers: 0,
    trustedTimestampRequired: false,
    institutionalPurpose: "Bind accountable signers to the exact canonical artifact subject without expanding the underlying claim.",
  },
  {
    scenarioId: "SIG-SCEN-038",
    title: "Institutional signature scenario 038",
    subjectKind: "PUBLIC_PDF",
    requiredRoles: ["REGULATORY_REVIEWER", "CONTRACTUAL_REVIEWER"],
    minimumIndependentReviewers: 0,
    trustedTimestampRequired: false,
    institutionalPurpose: "Bind accountable signers to the exact public pdf subject without expanding the underlying claim.",
  },
  {
    scenarioId: "SIG-SCEN-039",
    title: "Institutional signature scenario 039",
    subjectKind: "INTEGRITY_MANIFEST",
    requiredRoles: ["CONTRACTUAL_REVIEWER", "GOVERNANCE_ACCOUNTABLE_OWNER"],
    minimumIndependentReviewers: 0,
    trustedTimestampRequired: true,
    institutionalPurpose: "Bind accountable signers to the exact integrity manifest subject without expanding the underlying claim.",
  },
  {
    scenarioId: "SIG-SCEN-040",
    title: "Institutional signature scenario 040",
    subjectKind: "REGISTRY_RECORD",
    requiredRoles: ["GOVERNANCE_ACCOUNTABLE_OWNER", "ARTIFACT_PUBLISHER"],
    minimumIndependentReviewers: 1,
    trustedTimestampRequired: false,
    institutionalPurpose: "Bind accountable signers to the exact registry record subject without expanding the underlying claim.",
  },
  {
    scenarioId: "SIG-SCEN-041",
    title: "Institutional signature scenario 041",
    subjectKind: "REGISTRY_MANIFEST",
    requiredRoles: ["ARTIFACT_PUBLISHER", "ROUTE_STEWARD"],
    minimumIndependentReviewers: 0,
    trustedTimestampRequired: false,
    institutionalPurpose: "Bind accountable signers to the exact registry manifest subject without expanding the underlying claim.",
  },
  {
    scenarioId: "SIG-SCEN-042",
    title: "Institutional signature scenario 042",
    subjectKind: "VERIFICATION_REPORT",
    requiredRoles: ["ROUTE_STEWARD", "EVIDENCE_CUSTODIAN"],
    minimumIndependentReviewers: 0,
    trustedTimestampRequired: true,
    institutionalPurpose: "Bind accountable signers to the exact verification report subject without expanding the underlying claim.",
  },
  {
    scenarioId: "SIG-SCEN-043",
    title: "Institutional signature scenario 043",
    subjectKind: "DISCLOSURE_PROJECTION",
    requiredRoles: ["EVIDENCE_CUSTODIAN", "AUTHORITY_RESOLVER"],
    minimumIndependentReviewers: 0,
    trustedTimestampRequired: false,
    institutionalPurpose: "Bind accountable signers to the exact disclosure projection subject without expanding the underlying claim.",
  },
  {
    scenarioId: "SIG-SCEN-044",
    title: "Institutional signature scenario 044",
    subjectKind: "CHALLENGE_RECORD",
    requiredRoles: ["AUTHORITY_RESOLVER", "EXECUTION_ADAPTER_OWNER"],
    minimumIndependentReviewers: 1,
    trustedTimestampRequired: false,
    institutionalPurpose: "Bind accountable signers to the exact challenge record subject without expanding the underlying claim.",
  },
  {
    scenarioId: "SIG-SCEN-045",
    title: "Institutional signature scenario 045",
    subjectKind: "CORRECTION_RECORD",
    requiredRoles: ["EXECUTION_ADAPTER_OWNER", "OUTCOME_VERIFIER"],
    minimumIndependentReviewers: 0,
    trustedTimestampRequired: true,
    institutionalPurpose: "Bind accountable signers to the exact correction record subject without expanding the underlying claim.",
  },
  {
    scenarioId: "SIG-SCEN-046",
    title: "Institutional signature scenario 046",
    subjectKind: "SUPERSESSION_RECORD",
    requiredRoles: ["OUTCOME_VERIFIER", "ARTIFACT_REVIEWER"],
    minimumIndependentReviewers: 0,
    trustedTimestampRequired: false,
    institutionalPurpose: "Bind accountable signers to the exact supersession record subject without expanding the underlying claim.",
  },
  {
    scenarioId: "SIG-SCEN-047",
    title: "Institutional signature scenario 047",
    subjectKind: "WITHDRAWAL_RECORD",
    requiredRoles: ["ARTIFACT_REVIEWER", "INDEPENDENT_REVIEWER"],
    minimumIndependentReviewers: 0,
    trustedTimestampRequired: false,
    institutionalPurpose: "Bind accountable signers to the exact withdrawal record subject without expanding the underlying claim.",
  },
  {
    scenarioId: "SIG-SCEN-048",
    title: "Institutional signature scenario 048",
    subjectKind: "PORTFOLIO_EXPORT",
    requiredRoles: ["INDEPENDENT_REVIEWER", "CHALLENGE_OFFICER"],
    minimumIndependentReviewers: 1,
    trustedTimestampRequired: true,
    institutionalPurpose: "Bind accountable signers to the exact portfolio export subject without expanding the underlying claim.",
  },
  {
    scenarioId: "SIG-SCEN-049",
    title: "Institutional signature scenario 049",
    subjectKind: "CANONICAL_ARTIFACT",
    requiredRoles: ["CHALLENGE_OFFICER", "REGISTRY_STEWARD"],
    minimumIndependentReviewers: 0,
    trustedTimestampRequired: false,
    institutionalPurpose: "Bind accountable signers to the exact canonical artifact subject without expanding the underlying claim.",
  },
  {
    scenarioId: "SIG-SCEN-050",
    title: "Institutional signature scenario 050",
    subjectKind: "PUBLIC_PDF",
    requiredRoles: ["REGISTRY_STEWARD", "REGULATORY_REVIEWER"],
    minimumIndependentReviewers: 0,
    trustedTimestampRequired: false,
    institutionalPurpose: "Bind accountable signers to the exact public pdf subject without expanding the underlying claim.",
  },
  {
    scenarioId: "SIG-SCEN-051",
    title: "Institutional signature scenario 051",
    subjectKind: "INTEGRITY_MANIFEST",
    requiredRoles: ["REGULATORY_REVIEWER", "CONTRACTUAL_REVIEWER"],
    minimumIndependentReviewers: 0,
    trustedTimestampRequired: true,
    institutionalPurpose: "Bind accountable signers to the exact integrity manifest subject without expanding the underlying claim.",
  },
  {
    scenarioId: "SIG-SCEN-052",
    title: "Institutional signature scenario 052",
    subjectKind: "REGISTRY_RECORD",
    requiredRoles: ["CONTRACTUAL_REVIEWER", "GOVERNANCE_ACCOUNTABLE_OWNER"],
    minimumIndependentReviewers: 1,
    trustedTimestampRequired: false,
    institutionalPurpose: "Bind accountable signers to the exact registry record subject without expanding the underlying claim.",
  },
  {
    scenarioId: "SIG-SCEN-053",
    title: "Institutional signature scenario 053",
    subjectKind: "REGISTRY_MANIFEST",
    requiredRoles: ["GOVERNANCE_ACCOUNTABLE_OWNER", "ARTIFACT_PUBLISHER"],
    minimumIndependentReviewers: 0,
    trustedTimestampRequired: false,
    institutionalPurpose: "Bind accountable signers to the exact registry manifest subject without expanding the underlying claim.",
  },
  {
    scenarioId: "SIG-SCEN-054",
    title: "Institutional signature scenario 054",
    subjectKind: "VERIFICATION_REPORT",
    requiredRoles: ["ARTIFACT_PUBLISHER", "ROUTE_STEWARD"],
    minimumIndependentReviewers: 0,
    trustedTimestampRequired: true,
    institutionalPurpose: "Bind accountable signers to the exact verification report subject without expanding the underlying claim.",
  },
  {
    scenarioId: "SIG-SCEN-055",
    title: "Institutional signature scenario 055",
    subjectKind: "DISCLOSURE_PROJECTION",
    requiredRoles: ["ROUTE_STEWARD", "EVIDENCE_CUSTODIAN"],
    minimumIndependentReviewers: 0,
    trustedTimestampRequired: false,
    institutionalPurpose: "Bind accountable signers to the exact disclosure projection subject without expanding the underlying claim.",
  },
  {
    scenarioId: "SIG-SCEN-056",
    title: "Institutional signature scenario 056",
    subjectKind: "CHALLENGE_RECORD",
    requiredRoles: ["EVIDENCE_CUSTODIAN", "AUTHORITY_RESOLVER"],
    minimumIndependentReviewers: 1,
    trustedTimestampRequired: false,
    institutionalPurpose: "Bind accountable signers to the exact challenge record subject without expanding the underlying claim.",
  },
  {
    scenarioId: "SIG-SCEN-057",
    title: "Institutional signature scenario 057",
    subjectKind: "CORRECTION_RECORD",
    requiredRoles: ["AUTHORITY_RESOLVER", "EXECUTION_ADAPTER_OWNER"],
    minimumIndependentReviewers: 0,
    trustedTimestampRequired: true,
    institutionalPurpose: "Bind accountable signers to the exact correction record subject without expanding the underlying claim.",
  },
  {
    scenarioId: "SIG-SCEN-058",
    title: "Institutional signature scenario 058",
    subjectKind: "SUPERSESSION_RECORD",
    requiredRoles: ["EXECUTION_ADAPTER_OWNER", "OUTCOME_VERIFIER"],
    minimumIndependentReviewers: 0,
    trustedTimestampRequired: false,
    institutionalPurpose: "Bind accountable signers to the exact supersession record subject without expanding the underlying claim.",
  },
  {
    scenarioId: "SIG-SCEN-059",
    title: "Institutional signature scenario 059",
    subjectKind: "WITHDRAWAL_RECORD",
    requiredRoles: ["OUTCOME_VERIFIER", "ARTIFACT_REVIEWER"],
    minimumIndependentReviewers: 0,
    trustedTimestampRequired: false,
    institutionalPurpose: "Bind accountable signers to the exact withdrawal record subject without expanding the underlying claim.",
  },
  {
    scenarioId: "SIG-SCEN-060",
    title: "Institutional signature scenario 060",
    subjectKind: "PORTFOLIO_EXPORT",
    requiredRoles: ["ARTIFACT_REVIEWER", "INDEPENDENT_REVIEWER"],
    minimumIndependentReviewers: 1,
    trustedTimestampRequired: true,
    institutionalPurpose: "Bind accountable signers to the exact portfolio export subject without expanding the underlying claim.",
  },
] as const;

export function signatureRoleProfile(role: AttestationRole): SignatureRoleProfile | undefined {
  return SIGNATURE_ROLE_PROFILES.find((profile) => profile.role === role);
}

export function signatureScenarioPolicy(scenarioId: string): SignatureScenarioPolicy | undefined {
  return SIGNATURE_SCENARIO_POLICIES.find((scenario) => scenario.scenarioId === scenarioId);
}

export function signatureScenariosForSubject(kind: SignatureSubjectKind): readonly SignatureScenarioPolicy[] {
  return SIGNATURE_SCENARIO_POLICIES.filter((scenario) => scenario.subjectKind === kind);
}

export function buildPolicyFromScenario(
  scenario: SignatureScenarioPolicy,
  policyId = `TA14-${scenario.scenarioId}-POLICY`,
): SignaturePolicy {
  return createDefaultSignaturePolicy({
    policyId,
    requiredRoles: scenario.requiredRoles,
    minimumIndependentReviewers: scenario.minimumIndependentReviewers,
    requireTrustedTimestamp: scenario.trustedTimestampRequired,
  });
}

export function assertSignatureManifestVerified(result: SignatureManifestVerificationResult): void {
  if (!result.verified) {
    throw new Error(`Signature manifest verification failed: ${result.issues.map((entry) => entry.code).join(", ")}`);
  }
}

export function assertSignatureEnvelopeVerified(result: SignatureVerificationResult): void {
  if (!result.verified) {
    throw new Error(`Signature envelope verification failed: ${result.issues.map((entry) => entry.code).join(", ")}`);
  }
}

export const SIGNATURE_ENGINE_CATALOGS = {
  roleProfiles: SIGNATURE_ROLE_PROFILES,
  scenarioPolicies: SIGNATURE_SCENARIO_POLICIES,
} as const;
