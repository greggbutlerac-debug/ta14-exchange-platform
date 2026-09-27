/**
 * Server-side NIRET Gate A evaluation for the technician interface.
 *
 * The only place the UI path reaches the frozen engine. It stamps the
 * evaluation time and the authenticated submitter from the server, supplies
 * certification verification, authority establishment and the governed OEM
 * reference from server-side sources only (Amendments A4/A5/A7), and returns
 * the engine's canonical receipt unchanged. It adds no Gate-A rules.
 */

import { runGateA, type GateAReceipt } from "../../../../packages/domain/niret";
import { resolveOemReference, type OemRegistry, type OemResolution } from "../../../../packages/domain/niret/oem-registry";
import type {
  AuthorityElement,
  AuthorityEstablishment,
  CertificationVerification,
  MeasurementKey,
} from "../../../../packages/domain/niret/types";

/** An independent certification-verification source (none integrated yet). */
export interface CertificationVerifier {
  verify(credential: { status: string; type: unknown; reference: unknown; technicianIdentity: unknown }):
    Pick<CertificationVerification, "status" | "verifier" | "reference" | "verifiedAt">;
}

/** An independent source for authority/standing elements, e.g. dispatch or property records (none integrated yet). */
export interface AuthorityEstablisher {
  establish(element: AuthorityElement, declared: { technicianIdentity: unknown; authorization: unknown }): AuthorityEstablishment;
}

export interface EvaluationSources {
  /** The authenticated account submitting the record; establishes submission only. */
  submitter: { accountId: string } | null;
  certificationVerifier: CertificationVerifier | null;
  authorityEstablisher: AuthorityEstablisher | null;
  /** Amendment A7: the governed OEM reference registry (hash-pinned, independently reviewed records). */
  oemRegistry: OemRegistry | null;
}

export const NO_SOURCES: EvaluationSources = { submitter: null, certificationVerifier: null, authorityEstablisher: null, oemRegistry: null };

export interface Finding {
  proposition: string;
  result: "HOLD" | "DENY" | "ESCALATE" | "SATISFIED";
  reason: string;
  evidenceKeys: string[];
}

/** Submission metadata displayed beside — never inside — the canonical receipt. */
export interface SubmissionContext {
  certificationVerificationSource: "NONE_INTEGRATED" | "INTEGRATED";
  authorityEstablishmentSource: "NONE_INTEGRATED" | "INTEGRATED";
  oemReferenceSource: "NONE_INTEGRATED" | "INTEGRATED";
  /** A7: which OEM reference the engine was given (display only; the receipt is canonical). */
  oemReference: OemReferenceContext | null;
  note: string;
}

export interface OemReferenceContext {
  source: "GOVERNED_RECORD" | "MANUAL_TRANSCRIPTION";
  status: OemResolution["status"] | "NO_REGISTRY";
  recordId: string | null;
  document: string | null;
  measurementLocations: Partial<Record<MeasurementKey, { location: string; oemText: string }>>;
}

const AUTHORITY_ELEMENTS: readonly AuthorityElement[] = ["identity", "workScope", "sitePermission", "jurisdiction"];
const OEM_DESCRIPTIVE_FIELDS = ["manufacturer", "model", "documentId", "revision", "pageRef", "sourceRef"] as const;

/** A7: resolve the governed OEM record for the declared nameplate identity (exact match only). */
export function resolveSubmissionOem(input: unknown, sources: EvaluationSources): OemResolution | null {
  if (!sources.oemRegistry) return null;
  const equipment = (input as { evidence?: { equipment?: Record<string, unknown> } } | null)?.evidence?.equipment ?? {};
  return resolveOemReference(sources.oemRegistry, equipment);
}

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

export function stampEvaluatedAt(input: unknown, evaluatedAt: string): unknown {
  if (input === null || typeof input !== "object") return input;
  const candidate = input as { request?: unknown };
  if (candidate.request === null || typeof candidate.request !== "object") return input;
  return { ...candidate, request: { ...(candidate.request as Record<string, unknown>), evaluatedAt } };
}

/**
 * Trust boundary (A4/A5). The technician side supplies declarations only.
 * Submitter, certification verification, authority establishment and OEM
 * verification are replaced with server-side results; anything the client
 * asserted about them is discarded. Missing sources are recorded as unavailable.
 */
export function applyServerEvidence(input: unknown, sources: EvaluationSources): unknown {
  if (input === null || typeof input !== "object") return input;
  const root = clone(input) as { evidence?: Record<string, unknown>; oem?: Record<string, unknown> };
  const evidence = root.evidence;
  if (evidence && typeof evidence === "object") {
    delete evidence.submittedBy;
    if (sources.submitter) evidence.submittedBy = { accountId: sources.submitter.accountId, method: "AUTHENTICATED_SESSION" };

    const technician = evidence.technician as { identity?: unknown; certification?: Record<string, unknown> } | undefined;
    evidence.authorityEstablishment = Object.fromEntries(AUTHORITY_ELEMENTS.map((element) => [
      element,
      sources.authorityEstablisher
        ? sources.authorityEstablisher.establish(element, { technicianIdentity: technician?.identity, authorization: evidence.authorization })
        : { status: "SOURCE_UNAVAILABLE" },
    ]));

    const certification = technician?.certification;
    if (certification && (certification.status === "CERTIFIED" || certification.status === "SUPERVISED_APPRENTICE")) {
      const supplied = certification.verification as { assurance?: unknown } | undefined;
      const assurance = supplied?.assurance === "DOCUMENTED" ? "DOCUMENTED" : "DECLARED";
      const outcome = sources.certificationVerifier
        ? sources.certificationVerifier.verify({
            status: String(certification.status),
            type: certification.status === "CERTIFIED" ? certification.type : certification.supervisorType,
            reference: certification.status === "CERTIFIED" ? certification.certificateRef : certification.supervisorCertificateRef,
            technicianIdentity: technician?.identity,
          })
        : { status: "VERIFICATION_UNAVAILABLE" as const };
      certification.verification = clone({ assurance, ...outcome });
    }
  }

  // Amendment A7: a VERIFIED, CURRENT governed record replaces every submitted OEM value. Otherwise the
  // submitted values remain a manual transcription whose provenance is never verified.
  const oem = root.oem;
  if (oem && typeof oem === "object") {
    const resolution = resolveSubmissionOem(root, sources);
    if (resolution?.status === "RESOLVED") {
      root.oem = clone(resolution.reference) as unknown as Record<string, unknown>;
    } else {
      const supplied = (oem.provenance ?? {}) as Record<string, unknown>;
      const declared: Record<string, string> = {};
      for (const field of OEM_DESCRIPTIVE_FIELDS) if (typeof supplied[field] === "string") declared[field] = supplied[field] as string;
      const unavailable = resolution === null || resolution.status === "REGISTRY_UNAVAILABLE";
      oem.provenance = { acquisitionMethod: "MANUAL_TRANSCRIPTION", verification: unavailable ? "VERIFICATION_UNAVAILABLE" : "NOT_VERIFIED", ...declared };
    }
  }
  return root;
}

export function evaluateNiretSubmission(
  input: unknown,
  now: Date = new Date(),
  sources: EvaluationSources = NO_SOURCES,
): { receipt: GateAReceipt; findings: Finding[]; oemReference: OemReferenceContext | null } {
  const prepared = applyServerEvidence(stampEvaluatedAt(input, now.toISOString()), sources);
  const { receipt, evaluation } = runGateA(prepared);
  // Per-check detail from the same evaluation, for precise field messages. The receipt remains canonical.
  const findings = evaluation.checks
    .filter((check) => check.result !== "SATISFIED")
    .map((check) => ({ proposition: check.proposition, result: check.result, reason: check.reason, evidenceKeys: check.evidenceKeys }));
  return { receipt, findings, oemReference: oemReferenceContext(input, sources) };
}

export function oemReferenceContext(input: unknown, sources: EvaluationSources): OemReferenceContext | null {
  if (input === null || typeof input !== "object" || !(input as { oem?: unknown }).oem) return null;
  const resolution = resolveSubmissionOem(input, sources);
  if (resolution?.status === "RESOLVED") {
    const { record } = resolution;
    return {
      source: "GOVERNED_RECORD",
      status: "RESOLVED",
      recordId: record.recordId,
      document: [record.equipment.manufacturer, record.document.documentId, record.document.revision, record.document.title].filter(Boolean).join(" · "),
      measurementLocations: Object.fromEntries(Object.entries(record.criteria.measurementLocations)
        .map(([key, value]) => [key, { location: value?.location ?? "", oemText: value?.oemText ?? "" }])),
    };
  }
  return {
    source: "MANUAL_TRANSCRIPTION",
    status: resolution?.status ?? "NO_REGISTRY",
    recordId: resolution?.status === "NOT_VERIFIED" ? resolution.recordId : null,
    document: null,
    measurementLocations: {},
  };
}

export function submissionContext(sources: EvaluationSources = NO_SOURCES, oemReference: OemReferenceContext | null = null): SubmissionContext {
  const state = (present: unknown): "INTEGRATED" | "NONE_INTEGRATED" => (present ? "INTEGRATED" : "NONE_INTEGRATED");
  return {
    certificationVerificationSource: state(sources.certificationVerifier),
    authorityEstablishmentSource: state(sources.authorityEstablisher),
    oemReferenceSource: state(sources.oemRegistry),
    oemReference,
    note: "Submission context is not part of the canonical Gate-A receipt. The receipt records submitted_by, authority_status, certification_status and oem_reference_provenance.",
  };
}
