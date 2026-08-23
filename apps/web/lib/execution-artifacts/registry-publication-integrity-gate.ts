import type { ArtifactRegistryRecord } from "./artifact-registry-engine";
import {
  evaluateCorpusIntegrityCollisions,
  type CorpusDigestClaim,
  type CorpusIntegrityCollisionReport,
} from "./corpus-integrity-collision-gate";

export interface PublicationIntegrityGateResult {
  allowed: boolean;
  disposition: "PASS" | "HOLD";
  reasonCode: "PUBLICATION_INTEGRITY_CLEAR" | "CORPUS_INTEGRITY_COLLISION_HOLD";
  report: CorpusIntegrityCollisionReport;
  message: string;
}

export interface PublicationIntegrityOptions {
  /**
   * Explicit lineage declarations keyed by artifact id. A duplicate digest is
   * excused only when all colliding records declare the same lineage id.
   */
  sharedLineageByArtifactId?: Readonly<Record<string, string>>;
}

function claimsForRecord(
  record: ArtifactRegistryRecord,
  sharedLineageId?: string,
): CorpusDigestClaim[] {
  const claims: CorpusDigestClaim[] = [
    {
      artifactId: record.artifactId,
      registryId: record.registryId,
      kind: "CANONICAL",
      digest: record.canonicalHash,
      source: "artifact-registry-record.canonicalHash",
      sharedLineageId,
    },
    {
      artifactId: record.artifactId,
      registryId: record.registryId,
      kind: "PACKAGE",
      digest: record.packageHash,
      source: "artifact-registry-record.packageHash",
      sharedLineageId,
    },
    {
      artifactId: record.artifactId,
      registryId: record.registryId,
      kind: "MANIFEST",
      digest: record.manifestHash,
      source: "artifact-registry-record.manifestHash",
      sharedLineageId,
    },
  ];

  // Receipt identity is not assumed to be a digest. Only digest-shaped receipt
  // identifiers enter the collision comparison.
  if (record.receiptId && /^(sha256:)?[a-f0-9]{64}$/i.test(record.receiptId.trim())) {
    claims.push({
      artifactId: record.artifactId,
      registryId: record.registryId,
      kind: "RECEIPT",
      digest: record.receiptId,
      source: "artifact-registry-record.receiptId",
      sharedLineageId,
    });
  }

  return claims;
}

/**
 * Publication/reliance gate for a complete registry corpus.
 *
 * This function does not mutate records, generate replacement digests, or
 * infer fraud. It converts unexplained cross-artifact digest correspondence
 * into HOLD before public reliance is granted.
 */
export function evaluateRegistryCorpusForPublication(
  records: readonly ArtifactRegistryRecord[],
  options: PublicationIntegrityOptions = {},
): PublicationIntegrityGateResult {
  const claims = records.flatMap((record) =>
    claimsForRecord(record, options.sharedLineageByArtifactId?.[record.artifactId]),
  );
  const report = evaluateCorpusIntegrityCollisions(claims);

  if (!report.validForPublication) {
    return {
      allowed: false,
      disposition: "HOLD",
      reasonCode: "CORPUS_INTEGRITY_COLLISION_HOLD",
      report,
      message: `${report.unexplainedCollisionCount} unexplained cross-artifact digest collision(s) require source-correspondence review before publication reliance.`,
    };
  }

  return {
    allowed: true,
    disposition: "PASS",
    reasonCode: "PUBLICATION_INTEGRITY_CLEAR",
    report,
    message: "No unexplained cross-artifact digest collision blocks publication reliance.",
  };
}

export function assertRegistryCorpusPublicationIntegrity(
  records: readonly ArtifactRegistryRecord[],
  options: PublicationIntegrityOptions = {},
): void {
  const result = evaluateRegistryCorpusForPublication(records, options);
  if (result.allowed) return;
  throw new Error(`TA-14 publication reliance HOLD: ${result.message}`);
}
