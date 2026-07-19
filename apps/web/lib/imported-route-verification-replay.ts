import type {
  RouteVerificationPackageImportResult,
} from "./route-verification-receipt-import";

export type ImportedRoutePackageReplayStatus =
  | "VERIFIED"
  | "MISMATCH"
  | "INCOMPLETE"
  | "UNVERIFIABLE";

export type ImportedRoutePackageReplayResult = {
  status: ImportedRoutePackageReplayStatus;
  receiptId: string;
  routeId: string;
  recordedSha256: string;
  calculatedSha256: string | null;
  hashMatches: boolean | null;
  artifactReceiptReferenceCount: number;
  replayedAt: string;
  message: string;
  failures: string[];
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
  const encoded = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", encoded);

  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function collectCompletenessFailures(
  importedPackage: RouteVerificationPackageImportResult,
): string[] {
  const failures: string[] = [];
  const { receipt } = importedPackage;

  if (!receipt.routeSnapshotJson) {
    failures.push("The route snapshot is missing.");
  }

  if (!receipt.receiptSha256) {
    failures.push("The preserved receipt SHA-256 is missing.");
  }

  if (!receipt.routeId) {
    failures.push("The route ID is missing.");
  }

  if (!receipt.id) {
    failures.push("The receipt ID is missing.");
  }

  if (!Array.isArray(receipt.artifactReceiptIds)) {
    failures.push(
      "Artifact verification receipt references are unavailable.",
    );
  }

  if (
    receipt.artifactCount !== receipt.artifactReceiptIds.length
  ) {
    failures.push(
      "The artifact count does not match the number of referenced artifact verification receipts.",
    );
  }

  return failures;
}

export async function replayImportedRouteVerificationPackage(
  importedPackage: RouteVerificationPackageImportResult,
): Promise<ImportedRoutePackageReplayResult> {
  const completenessFailures =
    collectCompletenessFailures(importedPackage);

  if (completenessFailures.length > 0) {
    return {
      status: "INCOMPLETE",
      receiptId: importedPackage.receipt.id,
      routeId: importedPackage.receipt.routeId,
      recordedSha256: importedPackage.receipt.receiptSha256,
      calculatedSha256: null,
      hashMatches: null,
      artifactReceiptReferenceCount:
        importedPackage.receipt.artifactReceiptIds.length,
      replayedAt: new Date().toISOString(),
      message:
        "The imported package cannot be replayed because required receipt data is incomplete.",
      failures: completenessFailures,
    };
  }

  try {
    const calculatedSha256 = await sha256Text(
      canonicalize(
        importedPackage.receipt.routeSnapshotJson,
      ),
    );
    const recordedSha256 =
      importedPackage.receipt.receiptSha256.toLowerCase();
    const hashMatches =
      calculatedSha256.toLowerCase() === recordedSha256;

    if (!hashMatches) {
      return {
        status: "MISMATCH",
        receiptId: importedPackage.receipt.id,
        routeId: importedPackage.receipt.routeId,
        recordedSha256,
        calculatedSha256,
        hashMatches: false,
        artifactReceiptReferenceCount:
          importedPackage.receipt.artifactReceiptIds.length,
        replayedAt: new Date().toISOString(),
        message:
          "The imported route snapshot does not match the preserved receipt SHA-256.",
        failures: [
          "The recalculated route snapshot digest differs from the recorded receipt digest.",
        ],
      };
    }

    return {
      status: "VERIFIED",
      receiptId: importedPackage.receipt.id,
      routeId: importedPackage.receipt.routeId,
      recordedSha256,
      calculatedSha256,
      hashMatches: true,
      artifactReceiptReferenceCount:
        importedPackage.receipt.artifactReceiptIds.length,
      replayedAt: new Date().toISOString(),
      message:
        "The imported package was independently replayed and its route snapshot digest matches the preserved receipt.",
      failures: [],
    };
  } catch (error) {
    return {
      status: "UNVERIFIABLE",
      receiptId: importedPackage.receipt.id,
      routeId: importedPackage.receipt.routeId,
      recordedSha256: importedPackage.receipt.receiptSha256,
      calculatedSha256: null,
      hashMatches: null,
      artifactReceiptReferenceCount:
        importedPackage.receipt.artifactReceiptIds.length,
      replayedAt: new Date().toISOString(),
      message:
        error instanceof Error
          ? error.message
          : "The imported package could not be independently replayed.",
      failures: [
        "The replay engine could not calculate a canonical route snapshot digest.",
      ],
    };
  }
}
