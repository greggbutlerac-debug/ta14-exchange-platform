import { createClient } from "./supabase/client";
import {
  calculateFileSha256,
  ROUTE_ARTIFACT_BUCKET,
} from "./route-artifact-storage";
import type { RouteArtifact } from "./supabase-route-artifacts";

export type ArtifactVerificationStatus =
  | "VERIFIED"
  | "MISMATCH"
  | "MISSING"
  | "UNVERIFIED";

export type ArtifactVerificationResult = {
  artifactId: string;
  status: ArtifactVerificationStatus;
  checkedAt: string | null;
  calculatedSha256: string | null;
  recordedSha256: string | null;
  storageObjectPresent: boolean;
  hashMatches: boolean | null;
  sizeMatches: boolean | null;
  mimeTypeMatches: boolean | null;
  message: string;
};

function normalizeMimeType(value: string | null): string | null {
  if (!value) {
    return null;
  }

  return value.split(";")[0]?.trim().toLowerCase() || null;
}

export function createUnverifiedArtifactResult(
  artifact: RouteArtifact,
): ArtifactVerificationResult {
  return {
    artifactId: artifact.id,
    status: "UNVERIFIED",
    checkedAt: null,
    calculatedSha256: null,
    recordedSha256: artifact.sha256,
    storageObjectPresent: false,
    hashMatches: null,
    sizeMatches: null,
    mimeTypeMatches: null,
    message: artifact.storagePath
      ? "The stored object has not been verified in this session."
      : "No stored object is bound to this artifact.",
  };
}

export async function verifyRouteArtifactFile(
  artifact: RouteArtifact,
): Promise<ArtifactVerificationResult> {
  const checkedAt = new Date().toISOString();

  if (!artifact.storagePath) {
    return {
      ...createUnverifiedArtifactResult(artifact),
      status: "MISSING",
      checkedAt,
      message: "No storage path is recorded for this artifact.",
    };
  }

  if (!artifact.sha256) {
    return {
      ...createUnverifiedArtifactResult(artifact),
      status: "MISMATCH",
      checkedAt,
      storageObjectPresent: true,
      message:
        "A storage path is recorded, but no SHA-256 digest is available for comparison.",
    };
  }

  const supabase = createClient();
  const { data, error } = await supabase.storage
    .from(ROUTE_ARTIFACT_BUCKET)
    .download(artifact.storagePath);

  if (error || !data) {
    return {
      ...createUnverifiedArtifactResult(artifact),
      status: "MISSING",
      checkedAt,
      message:
        error?.message ||
        "The stored object could not be retrieved from private storage.",
    };
  }

  const verificationFile = new File(
    [data],
    artifact.originalFilename || "stored-artifact",
    {
      type:
        data.type ||
        artifact.mimeType ||
        "application/octet-stream",
    },
  );

  const calculatedSha256 =
    await calculateFileSha256(verificationFile);
  const recordedSha256 = artifact.sha256.toLowerCase();
  const hashMatches =
    calculatedSha256.toLowerCase() === recordedSha256;
  const sizeMatches =
    artifact.sizeBytes === null
      ? false
      : data.size === artifact.sizeBytes;

  const recordedMimeType = normalizeMimeType(
    artifact.mimeType,
  );
  const downloadedMimeType = normalizeMimeType(data.type);
  const mimeTypeMatches =
    recordedMimeType === null
      ? false
      : downloadedMimeType === recordedMimeType;

  const metadataComplete =
    Boolean(artifact.originalFilename) &&
    artifact.sizeBytes !== null &&
    Boolean(recordedMimeType);

  const verified =
    hashMatches &&
    sizeMatches &&
    mimeTypeMatches &&
    metadataComplete;

  return {
    artifactId: artifact.id,
    status: verified ? "VERIFIED" : "MISMATCH",
    checkedAt,
    calculatedSha256,
    recordedSha256,
    storageObjectPresent: true,
    hashMatches,
    sizeMatches,
    mimeTypeMatches,
    message: verified
      ? "Stored object, digest, size, and MIME metadata match the governed record."
      : "The stored object does not fully match the governed digest or recorded metadata.",
  };
}
