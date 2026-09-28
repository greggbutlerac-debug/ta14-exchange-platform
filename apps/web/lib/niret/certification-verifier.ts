/**
 * Independent certification-verification source for NIRET Gate A execution authority (P17, Amendment A4).
 *
 * Verification comes only from rows an appointed verifier (never the technician) wrote to
 * ta14_niret_certification_verifications after checking the credential with its issuing
 * organization. A declared or documented certificate never verifies itself: the declared
 * type, reference and technician identity are matched exactly against those rows — no
 * trimming, case folding or partial matching — for the authenticated submitting account.
 */

import type { SupabaseClient } from "@supabase/supabase-js";

import type { CertificationVerifier } from "./server-evaluate";

export const VERIFICATIONS_TABLE = "ta14_niret_certification_verifications";
export const REVOCATIONS_TABLE = "ta14_niret_certification_revocations";
export const VERIFIER_PREFIX = "NIRET-CERT-VERIFIER:";

export interface CertificationVerificationRow {
  verification_id: string;
  technician_account_id: string;
  technician_identity: string;
  certification_type: string;
  certificate_ref: string;
  verifier_account_id: string;
  verified_at: string;
}

/** A source that could not be read is unavailable (ESCALATE), never "not verified". */
export const UNAVAILABLE_VERIFIER: CertificationVerifier = { verify: () => ({ status: "VERIFICATION_UNAVAILABLE" }) };

/**
 * Build the verifier for one evaluation from the verification rows visible to the submitting account.
 * Supervised-apprentice credentials belong to the supervisor's account, which this source cannot read:
 * they are reported as VERIFICATION_UNAVAILABLE.
 */
export function certificationVerifierFrom(
  rows: readonly CertificationVerificationRow[],
  revokedIds: ReadonlySet<string>,
  submitterAccountId: string,
  now: Date,
): CertificationVerifier {
  return {
    verify(credential) {
      if (credential.status !== "CERTIFIED") return { status: "VERIFICATION_UNAVAILABLE" };
      const match = rows.find((row) =>
        row.technician_account_id === submitterAccountId &&
        row.verifier_account_id !== submitterAccountId &&
        row.technician_identity === credential.technicianIdentity &&
        row.certification_type === credential.type &&
        row.certificate_ref === credential.reference &&
        !revokedIds.has(row.verification_id) &&
        Date.parse(row.verified_at) <= now.getTime());
      if (!match) return { status: "NOT_VERIFIED" };
      return {
        status: "VERIFIED",
        verifier: `${VERIFIER_PREFIX}${match.verifier_account_id}`,
        reference: `${VERIFICATIONS_TABLE}/${match.verification_id}`,
        verifiedAt: new Date(Date.parse(match.verified_at)).toISOString(),
      };
    },
  };
}

/** Read the submitting account's verifications and their revocations under its own session (RLS applies). */
export async function loadCertificationVerifier(
  supabase: SupabaseClient,
  submitterAccountId: string,
  now: Date,
): Promise<CertificationVerifier> {
  try {
    const verifications = await supabase
      .from(VERIFICATIONS_TABLE)
      .select("verification_id, technician_account_id, technician_identity, certification_type, certificate_ref, verifier_account_id, verified_at")
      .eq("technician_account_id", submitterAccountId);
    if (verifications.error || !verifications.data) return UNAVAILABLE_VERIFIER;
    const rows = verifications.data as CertificationVerificationRow[];
    if (rows.length === 0) return certificationVerifierFrom([], new Set(), submitterAccountId, now);
    const revocations = await supabase
      .from(REVOCATIONS_TABLE)
      .select("verification_id")
      .in("verification_id", rows.map((row) => row.verification_id));
    if (revocations.error || !revocations.data) return UNAVAILABLE_VERIFIER;
    const revoked = new Set((revocations.data as Array<{ verification_id: string }>).map((row) => row.verification_id));
    return certificationVerifierFrom(rows, revoked, submitterAccountId, now);
  } catch {
    return UNAVAILABLE_VERIFIER;
  }
}
