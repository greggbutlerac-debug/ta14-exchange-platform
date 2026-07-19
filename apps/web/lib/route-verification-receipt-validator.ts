import { createClient } from "./supabase/client";
import type {
  RouteVerificationReceipt,
} from "./route-verification-receipts";

export type RouteReceiptVerificationStatus =
  | "VERIFIED"
  | "MISMATCH"
  | "MISSING_REFERENCES";

export type RouteReceiptVerificationResult = {
  status: RouteReceiptVerificationStatus;
  receiptId: string;
  recordedSha256: string;
  calculatedSha256: string;
  hashMatches: boolean;
  referencedArtifactReceiptCount: number;
  existingArtifactReceiptCount: number;
  missingArtifactReceiptIds: string[];
  checkedAt: string;
  message: string;
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

export async function verifyRouteVerificationReceipt(
  receipt: RouteVerificationReceipt,
): Promise<RouteReceiptVerificationResult> {
  const calculatedSha256 = await sha256Text(
    canonicalize(receipt.routeSnapshotJson),
  );
  const recordedSha256 = receipt.receiptSha256.toLowerCase();
  const hashMatches =
    calculatedSha256.toLowerCase() === recordedSha256;

  const referencedIds = [...receipt.artifactReceiptIds].sort();
  let existingIds: string[] = [];

  if (referencedIds.length > 0) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("exchange_route_artifact_verifications")
      .select("id")
      .in("id", referencedIds);

    if (error) {
      throw error;
    }

    existingIds = (data ?? [])
      .map((row) => {
        const typedRow = row as unknown as { id: string };
        return typedRow.id;
      })
      .sort();
  }

  const existingIdSet = new Set(existingIds);
  const missingArtifactReceiptIds = referencedIds.filter(
    (id) => !existingIdSet.has(id),
  );

  let status: RouteReceiptVerificationStatus;
  let message: string;

  if (!hashMatches) {
    status = "MISMATCH";
    message =
      "The preserved route snapshot no longer matches its recorded SHA-256 digest.";
  } else if (missingArtifactReceiptIds.length > 0) {
    status = "MISSING_REFERENCES";
    message =
      "The route receipt digest is valid, but one or more referenced artifact verification receipts are unavailable.";
  } else {
    status = "VERIFIED";
    message =
      "The route receipt digest matches and every referenced artifact verification receipt is present.";
  }

  return {
    status,
    receiptId: receipt.id,
    recordedSha256,
    calculatedSha256,
    hashMatches,
    referencedArtifactReceiptCount: referencedIds.length,
    existingArtifactReceiptCount: existingIds.length,
    missingArtifactReceiptIds,
    checkedAt: new Date().toISOString(),
    message,
  };
}
