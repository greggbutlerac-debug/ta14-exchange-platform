export type CorpusDigestKind = "CANONICAL" | "PACKAGE" | "RECEIPT" | "MANIFEST" | "ROOT";

export interface CorpusDigestClaim {
  artifactId: string;
  registryId?: string;
  kind: CorpusDigestKind;
  digest: string;
  source: string;
  sharedLineageId?: string;
}

export type CorpusCollisionDisposition = "PASS" | "HOLD";

export interface CorpusDigestCollision {
  kind: CorpusDigestKind;
  digest: string;
  artifactIds: string[];
  sources: string[];
  disposition: CorpusCollisionDisposition;
  reasonCode: "CORPUS_DIGEST_COLLISION_UNEXPLAINED" | "CORPUS_DIGEST_SHARED_LINEAGE_DECLARED";
  message: string;
}

export interface CorpusIntegrityCollisionReport {
  validForPublication: boolean;
  checkedClaims: number;
  collisionCount: number;
  unexplainedCollisionCount: number;
  collisions: CorpusDigestCollision[];
}

const normalizedDigest = (value: string) => value.trim().toLowerCase().replace(/^sha256:/, "");

/**
 * Corpus-level safeguard.
 *
 * A digest duplicate is not treated as proof of falsity. It is a correspondence
 * condition. Publication is held unless every claimant explicitly declares the
 * same non-empty sharedLineageId. This prevents copied/template integrity values
 * from silently passing while preserving legitimate shared-package lineage.
 */
export function evaluateCorpusIntegrityCollisions(
  claims: readonly CorpusDigestClaim[],
): CorpusIntegrityCollisionReport {
  const buckets = new Map<string, CorpusDigestClaim[]>();

  for (const claim of claims) {
    const digest = normalizedDigest(claim.digest);
    if (!digest) continue;
    const key = `${claim.kind}:${digest}`;
    const bucket = buckets.get(key) ?? [];
    bucket.push({ ...claim, digest });
    buckets.set(key, bucket);
  }

  const collisions: CorpusDigestCollision[] = [];

  for (const bucket of buckets.values()) {
    const artifactIds = [...new Set(bucket.map((claim) => claim.artifactId))];
    if (artifactIds.length < 2) continue;

    const lineageIds = [...new Set(bucket.map((claim) => claim.sharedLineageId?.trim()).filter(Boolean))];
    const everyClaimDeclaresLineage = bucket.every((claim) => Boolean(claim.sharedLineageId?.trim()));
    const sharedLineageDeclared = everyClaimDeclaresLineage && lineageIds.length === 1;
    const first = bucket[0];

    collisions.push({
      kind: first.kind,
      digest: first.digest,
      artifactIds,
      sources: [...new Set(bucket.map((claim) => claim.source))],
      disposition: sharedLineageDeclared ? "PASS" : "HOLD",
      reasonCode: sharedLineageDeclared
        ? "CORPUS_DIGEST_SHARED_LINEAGE_DECLARED"
        : "CORPUS_DIGEST_COLLISION_UNEXPLAINED",
      message: sharedLineageDeclared
        ? `Digest is shared by ${artifactIds.join(", ")} under declared lineage ${lineageIds[0]}.`
        : `Digest is claimed by multiple artifacts (${artifactIds.join(", ")}) without one explicit shared-lineage declaration. Preserve records and reconcile source correspondence before publication reliance.`,
    });
  }

  const unexplainedCollisionCount = collisions.filter((collision) => collision.disposition === "HOLD").length;

  return {
    validForPublication: unexplainedCollisionCount === 0,
    checkedClaims: claims.length,
    collisionCount: collisions.length,
    unexplainedCollisionCount,
    collisions,
  };
}

export function assertCorpusIntegrityForPublication(claims: readonly CorpusDigestClaim[]): void {
  const report = evaluateCorpusIntegrityCollisions(claims);
  if (report.validForPublication) return;

  const summary = report.collisions
    .filter((collision) => collision.disposition === "HOLD")
    .map((collision) => `${collision.kind}:${collision.digest} => ${collision.artifactIds.join(",")}`)
    .join("; ");

  throw new Error(`TA-14 corpus integrity HOLD: ${summary}`);
}
