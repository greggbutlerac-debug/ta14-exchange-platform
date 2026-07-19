import { createClient } from "./supabase/client";
import type {
  ArtifactVerificationResult,
  ArtifactVerificationStatus,
} from "./route-artifact-verification";

export type RouteReadinessStatus =
  | "READY_FOR_REVIEW"
  | "NEEDS_EVIDENCE"
  | "NOT_READY";

export type RouteVerificationReceiptInput = {
  routeRecordId: string;
  routeId: string;
  readinessStatus: RouteReadinessStatus;
  readinessScore: number;
  readinessMaximumScore: number;
  readinessPercentage: number;
  artifactVerifications: ArtifactVerificationResult[];
};

export type RouteVerificationReceipt = {
  id: string;
  routeRecordId: string;
  routeId: string;
  readinessStatus: RouteReadinessStatus;
  readinessScore: number;
  readinessMaximumScore: number;
  readinessPercentage: number;
  artifactCount: number;
  verifiedCount: number;
  mismatchCount: number;
  missingCount: number;
  unverifiedCount: number;
  artifactReceiptIds: string[];
  routeSnapshotJson: Record<string, unknown>;
  receiptSha256: string;
  createdAt: string;
};

type RouteVerificationReceiptRow = {
  id: string;
  route_record_id: string;
  route_id: string;
  readiness_status: RouteReadinessStatus;
  readiness_score: number;
  readiness_maximum_score: number;
  readiness_percentage: number;
  artifact_count: number;
  verified_count: number;
  mismatch_count: number;
  missing_count: number;
  unverified_count: number;
  artifact_receipt_ids: string[];
  route_snapshot_json: Record<string, unknown>;
  receipt_sha256: string;
  created_at: string;
};

function canonicalize(value: unknown): string {
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value);
  }

  if (Array.isArray(value)) {
    return `[${value.map((item) => canonicalize(item)).join(",")}]`;
  }

  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).sort();

  return `{${keys
    .map(
      (key) =>
        `${JSON.stringify(key)}:${canonicalize(record[key])}`,
    )
    .join(",")}}`;
}

async function sha256Text(value: string): Promise<string> {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);

  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function countStatus(
  verifications: ArtifactVerificationResult[],
  status: ArtifactVerificationStatus,
): number {
  return verifications.filter(
    (verification) => verification.status === status,
  ).length;
}

function mapRow(
  row: RouteVerificationReceiptRow,
): RouteVerificationReceipt {
  return {
    id: row.id,
    routeRecordId: row.route_record_id,
    routeId: row.route_id,
    readinessStatus: row.readiness_status,
    readinessScore: row.readiness_score,
    readinessMaximumScore: row.readiness_maximum_score,
    readinessPercentage: row.readiness_percentage,
    artifactCount: row.artifact_count,
    verifiedCount: row.verified_count,
    mismatchCount: row.mismatch_count,
    missingCount: row.missing_count,
    unverifiedCount: row.unverified_count,
    artifactReceiptIds: row.artifact_receipt_ids,
    routeSnapshotJson: row.route_snapshot_json,
    receiptSha256: row.receipt_sha256,
    createdAt: row.created_at,
  };
}

export async function createRouteVerificationReceipt(
  input: RouteVerificationReceiptInput,
): Promise<RouteVerificationReceipt> {
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
      "Authentication is required to preserve a route verification receipt.",
    );
  }

  const artifactReceiptIds = input.artifactVerifications
    .map((verification) => verification.receiptId)
    .filter((receiptId): receiptId is string => Boolean(receiptId))
    .sort();

  const routeSnapshotJson = {
    routeRecordId: input.routeRecordId,
    routeId: input.routeId,
    readinessStatus: input.readinessStatus,
    readinessScore: input.readinessScore,
    readinessMaximumScore: input.readinessMaximumScore,
    readinessPercentage: input.readinessPercentage,
    artifactCount: input.artifactVerifications.length,
    verifiedCount: countStatus(
      input.artifactVerifications,
      "VERIFIED",
    ),
    mismatchCount: countStatus(
      input.artifactVerifications,
      "MISMATCH",
    ),
    missingCount: countStatus(
      input.artifactVerifications,
      "MISSING",
    ),
    unverifiedCount: countStatus(
      input.artifactVerifications,
      "UNVERIFIED",
    ),
    artifactReceipts: input.artifactVerifications
      .map((verification) => ({
        artifactId: verification.artifactId,
        receiptId: verification.receiptId,
        status: verification.status,
        checkedAt: verification.checkedAt,
        recordedSha256: verification.recordedSha256,
        calculatedSha256: verification.calculatedSha256,
        storageObjectPresent:
          verification.storageObjectPresent,
        hashMatches: verification.hashMatches,
        sizeMatches: verification.sizeMatches,
        mimeTypeMatches: verification.mimeTypeMatches,
      }))
      .sort((left, right) =>
        left.artifactId.localeCompare(right.artifactId),
      ),
  };

  const receiptSha256 = await sha256Text(
    canonicalize(routeSnapshotJson),
  );

  const { data, error } = await supabase
    .from("exchange_route_verification_receipts")
    .insert({
      route_record_id: input.routeRecordId,
      user_id: user.id,
      route_id: input.routeId,
      readiness_status: input.readinessStatus,
      readiness_score: input.readinessScore,
      readiness_maximum_score:
        input.readinessMaximumScore,
      readiness_percentage: input.readinessPercentage,
      artifact_count: input.artifactVerifications.length,
      verified_count: routeSnapshotJson.verifiedCount,
      mismatch_count: routeSnapshotJson.mismatchCount,
      missing_count: routeSnapshotJson.missingCount,
      unverified_count: routeSnapshotJson.unverifiedCount,
      artifact_receipt_ids: artifactReceiptIds,
      route_snapshot_json: routeSnapshotJson,
      receipt_sha256: receiptSha256,
    })
    .select(
      [
        "id",
        "route_record_id",
        "route_id",
        "readiness_status",
        "readiness_score",
        "readiness_maximum_score",
        "readiness_percentage",
        "artifact_count",
        "verified_count",
        "mismatch_count",
        "missing_count",
        "unverified_count",
        "artifact_receipt_ids",
        "route_snapshot_json",
        "receipt_sha256",
        "created_at",
      ].join(","),
    )
    .single();

  if (error) {
    throw error;
  }

  return mapRow(
    data as unknown as RouteVerificationReceiptRow,
  );
}

export async function getLatestRouteVerificationReceipt(
  routeRecordId: string,
): Promise<RouteVerificationReceipt | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("exchange_route_verification_receipts")
    .select(
      [
        "id",
        "route_record_id",
        "route_id",
        "readiness_status",
        "readiness_score",
        "readiness_maximum_score",
        "readiness_percentage",
        "artifact_count",
        "verified_count",
        "mismatch_count",
        "missing_count",
        "unverified_count",
        "artifact_receipt_ids",
        "route_snapshot_json",
        "receipt_sha256",
        "created_at",
      ].join(","),
    )
    .eq("route_record_id", routeRecordId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  return mapRow(
    data as unknown as RouteVerificationReceiptRow,
  );
}
