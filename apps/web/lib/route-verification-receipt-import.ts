import type { RouteVerificationReceipt } from "./route-verification-receipts";
import type { RouteReceiptVerificationResult } from "./route-verification-receipt-validator";
import type { RouteVerificationExportPackage } from "./route-verification-receipt-export";

export type RouteVerificationPackageImportResult = {
  exportPackage: RouteVerificationExportPackage;
  receipt: RouteVerificationReceipt;
  validation: RouteReceiptVerificationResult | null;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function requireString(
  record: Record<string, unknown>,
  key: string,
): string {
  const value = record[key];

  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(
      `Invalid verification package: "${key}" must be a non-empty string.`,
    );
  }

  return value;
}

function requireNumber(
  record: Record<string, unknown>,
  key: string,
): number {
  const value = record[key];

  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(
      `Invalid verification package: "${key}" must be a finite number.`,
    );
  }

  return value;
}

function requireBoolean(
  record: Record<string, unknown>,
  key: string,
): boolean {
  const value = record[key];

  if (typeof value !== "boolean") {
    throw new Error(
      `Invalid verification package: "${key}" must be a boolean.`,
    );
  }

  return value;
}

function requireStringArray(
  record: Record<string, unknown>,
  key: string,
): string[] {
  const value = record[key];

  if (
    !Array.isArray(value) ||
    value.some((item) => typeof item !== "string")
  ) {
    throw new Error(
      `Invalid verification package: "${key}" must be an array of strings.`,
    );
  }

  return value;
}

function parseReceipt(value: unknown): RouteVerificationReceipt {
  if (!isRecord(value)) {
    throw new Error(
      "Invalid verification package: receipt is missing.",
    );
  }

  const snapshot = value.routeSnapshotJson;

  if (!isRecord(snapshot)) {
    throw new Error(
      'Invalid verification package: "routeSnapshotJson" must be an object.',
    );
  }

  return {
    id: requireString(value, "id"),
    routeRecordId: requireString(value, "routeRecordId"),
    routeId: requireString(value, "routeId"),
    readinessStatus: requireString(
      value,
      "readinessStatus",
    ) as RouteVerificationReceipt["readinessStatus"],
    readinessScore: requireNumber(value, "readinessScore"),
    readinessMaximumScore: requireNumber(
      value,
      "readinessMaximumScore",
    ),
    readinessPercentage: requireNumber(
      value,
      "readinessPercentage",
    ),
    artifactCount: requireNumber(value, "artifactCount"),
    verifiedCount: requireNumber(value, "verifiedCount"),
    mismatchCount: requireNumber(value, "mismatchCount"),
    missingCount: requireNumber(value, "missingCount"),
    unverifiedCount: requireNumber(value, "unverifiedCount"),
    artifactReceiptIds: requireStringArray(
      value,
      "artifactReceiptIds",
    ),
    routeSnapshotJson: snapshot,
    receiptSha256: requireString(value, "receiptSha256"),
    createdAt: requireString(value, "createdAt"),
  };
}

function parseValidation(
  value: unknown,
): RouteReceiptVerificationResult | null {
  if (value === null || value === undefined) {
    return null;
  }

  if (!isRecord(value)) {
    throw new Error(
      "Invalid verification package: validation must be an object or null.",
    );
  }

  return {
    status: requireString(
      value,
      "status",
    ) as RouteReceiptVerificationResult["status"],
    receiptId: requireString(value, "receiptId"),
    recordedSha256: requireString(value, "recordedSha256"),
    calculatedSha256: requireString(
      value,
      "calculatedSha256",
    ),
    hashMatches: requireBoolean(value, "hashMatches"),
    referencedArtifactReceiptCount: requireNumber(
      value,
      "referencedArtifactReceiptCount",
    ),
    existingArtifactReceiptCount: requireNumber(
      value,
      "existingArtifactReceiptCount",
    ),
    missingArtifactReceiptIds: requireStringArray(
      value,
      "missingArtifactReceiptIds",
    ),
    checkedAt: requireString(value, "checkedAt"),
    message: requireString(value, "message"),
  };
}

export function parseRouteVerificationExportPackage(
  jsonText: string,
): RouteVerificationPackageImportResult {
  let parsed: unknown;

  try {
    parsed = JSON.parse(jsonText);
  } catch {
    throw new Error(
      "The selected file is not valid JSON.",
    );
  }

  if (!isRecord(parsed)) {
    throw new Error(
      "Invalid verification package: the root value must be an object.",
    );
  }

  if (
    parsed.packageType !==
    "TA14_ROUTE_VERIFICATION_RECEIPT"
  ) {
    throw new Error(
      "Invalid verification package: unsupported package type.",
    );
  }

  if (parsed.packageVersion !== "1.0") {
    throw new Error(
      "Invalid verification package: unsupported package version.",
    );
  }

  const exportedAt = requireString(parsed, "exportedAt");
  const receipt = parseReceipt(parsed.receipt);
  const validation = parseValidation(parsed.validation);

  const exportPackage: RouteVerificationExportPackage = {
    packageType: "TA14_ROUTE_VERIFICATION_RECEIPT",
    packageVersion: "1.0",
    exportedAt,
    receipt,
    validation,
  };

  return {
    exportPackage,
    receipt,
    validation,
  };
}

export async function readRouteVerificationExportFile(
  file: File,
): Promise<RouteVerificationPackageImportResult> {
  const text = await file.text();

  return parseRouteVerificationExportPackage(text);
}
