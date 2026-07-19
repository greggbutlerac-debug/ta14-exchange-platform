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
  receiptId: string | null;
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

type VerificationReceiptRow = {
  id: string;
  artifact_id: string;
  status: ArtifactVerificationStatus;
  recorded_sha256: string | null;
  calculated_sha256: string | null;
  storage_object_present: boolean;
  hash_matches: boolean | null;
  size_matches: boolean | null;
  mime_type_matches: boolean | null;
  message: string;
  checked_at: string;
};

function normalizeMimeType(value: string | null): string | null {
  if (!value) {
    return null;
  }

  return value.split(";")[0]?.trim().toLowerCase() || null;
}

function mapReceiptRow(
  row: VerificationReceiptRow,
): ArtifactVerificationResult {
  return {
    receiptId: row.id,
    artifactId: row.artifact_id,
    status: row.status,
    checkedAt: row.checked_at,
    calculatedSha256: row.calculated_sha256,
    recordedSha256: row.recorded_sha256,
    storageObjectPresent: row.storage_object_present,
    hashMatches: row.hash_matches,
    sizeMatches: row.size_matches,
    mimeTypeMatches: row.mime_type_matches,
    message: row.message,
  };
}

export function createUnverifiedArtifactResult(
  artifact: RouteArtifact,
): ArtifactVerificationResult {
  return {
    receiptId: null,
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
      ? "The stored object has not yet been verified."
      : "No stored object is bound to this artifact.",
  };
}

async function preserveVerificationReceipt(
  artifact: RouteArtifact,
  result: ArtifactVerificationResult,
): Promise<ArtifactVerificationResult> {
  const supabase = createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  if (!user) {
    throw new Error(
      "Authentication is required to preserve a verification receipt.",
    );
  }

  const { data, error } = await supabase
    .from("exchange_route_artifact_verifications")
    .insert({
      artifact_id: artifact.id,
      route_record_id: artifact.routeRecordId,
      user_id: user.id,
      route_id: artifact.routeId,
      status: result.status,
      recorded_sha256: result.recordedSha256,
      calculated_sha256: result.calculatedSha256,
      storage_object_present: result.storageObjectPresent,
      hash_matches: result.hashMatches,
      size_matches: result.sizeMatches,
      mime_type_matches: result.mimeTypeMatches,
      message: result.message,
      verification_json: {
        artifactId: result.artifactId,
        status: result.status,
        checkedAt: result.checkedAt,
        recordedSha256: result.recordedSha256,
        calculatedSha256: result.calculatedSha256,
        storageObjectPresent: result.storageObjectPresent,
        hashMatches: result.hashMatches,
        sizeMatches: result.sizeMatches,
        mimeTypeMatches: result.mimeTypeMatches,
      },
      checked_at: result.checkedAt ?? new Date().toISOString(),
    })
    .select(
      [
        "id",
        "artifact_id",
        "status",
        "recorded_sha256",
        "calculated_sha256",
        "storage_object_present",
        "hash_matches",
        "size_matches",
        "mime_type_matches",
        "message",
        "checked_at",
      ].join(","),
    )
    .single();

  if (error) {
    throw error;
  }

  return mapReceiptRow(data as unknown as VerificationReceiptRow);
}

export async function listLatestArtifactVerificationReceipts(
  routeRecordId: string,
): Promise<Record<string, ArtifactVerificationResult>> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("exchange_route_artifact_verifications")
    .select(
      [
        "id",
        "artifact_id",
        "status",
        "recorded_sha256",
        "calculated_sha256",
        "storage_object_present",
        "hash_matches",
        "size_matches",
        "mime_type_matches",
        "message",
        "checked_at",
      ].join(","),
    )
    .eq("route_record_id", routeRecordId)
    .order("checked_at", { ascending: false });

  if (error) {
    throw error;
  }

  const latestByArtifact: Record<
    string,
    ArtifactVerificationResult
  > = {};

  for (const rawRow of data ?? []) {
    const row = rawRow as unknown as VerificationReceiptRow;

    if (!latestByArtifact[row.artifact_id]) {
      latestByArtifact[row.artifact_id] =
        mapReceiptRow(row);
    }
  }

  return latestByArtifact;
}

export async function verifyRouteArtifactFile(
  artifact: RouteArtifact,
): Promise<ArtifactVerificationResult> {
  const checkedAt = new Date().toISOString();
  let result: ArtifactVerificationResult;

  if (!artifact.storagePath) {
    result = {
      ...createUnverifiedArtifactResult(artifact),
      status: "MISSING",
      checkedAt,
      message: "No storage path is recorded for this artifact.",
    };

    return preserveVerificationReceipt(artifact, result);
  }

  if (!artifact.sha256) {
    result = {
      ...createUnverifiedArtifactResult(artifact),
      status: "MISMATCH",
      checkedAt,
      message:
        "A storage path is recorded, but no SHA-256 digest is available for comparison.",
    };

    return preserveVerificationReceipt(artifact, result);
  }

  const supabase = createClient();
  const { data, error } = await supabase.storage
    .from(ROUTE_ARTIFACT_BUCKET)
    .download(artifact.storagePath);

  if (error || !data) {
    result = {
      ...createUnverifiedArtifactResult(artifact),
      status: "MISSING",
      checkedAt,
      message:
        error?.message ||
        "The stored object could not be retrieved from private storage.",
    };

    return preserveVerificationReceipt(artifact, result);
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

  result = {
    receiptId: null,
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

  return preserveVerificationReceipt(artifact, result);
}
