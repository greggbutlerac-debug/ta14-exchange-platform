import type {
  ImportedReplayHistoryExportPackage,
} from "./imported-route-replay-history-export";
import type {
  ImportedRouteReplayReceipt,
} from "./imported-route-replay-receipts";

export type ImportedReplayHistoryImportResult = {
  package: ImportedReplayHistoryExportPackage;
  receiptCountMatches: boolean;
  sourceReceiptContinuity: boolean;
  sourceRouteContinuity: boolean;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isStringArray(value: unknown): value is string[] {
  return (
    Array.isArray(value) &&
    value.every((item) => typeof item === "string")
  );
}

function isReplayStatus(
  value: unknown,
): value is ImportedRouteReplayReceipt["replayStatus"] {
  return (
    value === "VERIFIED" ||
    value === "MISMATCH" ||
    value === "INCOMPLETE" ||
    value === "UNVERIFIABLE"
  );
}

function isReplayReceipt(
  value: unknown,
): value is ImportedRouteReplayReceipt {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id === "string" &&
    typeof value.packageType === "string" &&
    typeof value.packageVersion === "string" &&
    typeof value.sourceReceiptId === "string" &&
    typeof value.sourceRouteId === "string" &&
    isReplayStatus(value.replayStatus) &&
    typeof value.recordedSha256 === "string" &&
    (typeof value.calculatedSha256 === "string" ||
      value.calculatedSha256 === null) &&
    (typeof value.hashMatches === "boolean" ||
      value.hashMatches === null) &&
    typeof value.artifactReceiptReferenceCount === "number" &&
    Number.isInteger(value.artifactReceiptReferenceCount) &&
    value.artifactReceiptReferenceCount >= 0 &&
    isStringArray(value.failures) &&
    isRecord(value.importedPackage) &&
    isRecord(value.replayResult) &&
    typeof value.replayedAt === "string" &&
    typeof value.createdAt === "string"
  );
}

export function validateImportedReplayHistoryExport(
  value: unknown,
): ImportedReplayHistoryImportResult {
  if (!isRecord(value)) {
    throw new Error(
      "The imported replay-history file must contain a JSON object.",
    );
  }

  if (
    value.packageType !== "TA14_IMPORTED_ROUTE_REPLAY_HISTORY"
  ) {
    throw new Error(
      "The imported file is not a TA-14 replay-history package.",
    );
  }

  if (value.packageVersion !== "1.0") {
    throw new Error(
      "The replay-history package version is not supported.",
    );
  }

  if (
    typeof value.sourceReceiptId !== "string" ||
    value.sourceReceiptId.length === 0
  ) {
    throw new Error(
      "The replay-history package is missing its source receipt ID.",
    );
  }

  if (
    typeof value.sourceRouteId !== "string" ||
    value.sourceRouteId.length === 0
  ) {
    throw new Error(
      "The replay-history package is missing its source route ID.",
    );
  }

  if (
    typeof value.replayReceiptCount !== "number" ||
    !Number.isInteger(value.replayReceiptCount) ||
    value.replayReceiptCount < 0
  ) {
    throw new Error(
      "The replay-history package has an invalid receipt count.",
    );
  }

  if (typeof value.exportedAt !== "string") {
    throw new Error(
      "The replay-history package is missing its export timestamp.",
    );
  }

  if (
    !Array.isArray(value.replayReceipts) ||
    !value.replayReceipts.every(isReplayReceipt)
  ) {
    throw new Error(
      "The replay-history package contains invalid replay receipts.",
    );
  }

  const replayReceipts = value.replayReceipts;

  const receiptCountMatches =
    value.replayReceiptCount === replayReceipts.length;

  const sourceReceiptContinuity = replayReceipts.every(
    (receipt) =>
      receipt.sourceReceiptId === value.sourceReceiptId,
  );

  const sourceRouteContinuity = replayReceipts.every(
    (receipt) =>
      receipt.sourceRouteId === value.sourceRouteId,
  );

  if (!receiptCountMatches) {
    throw new Error(
      "The declared replay-receipt count does not match the package contents.",
    );
  }

  if (!sourceReceiptContinuity) {
    throw new Error(
      "The replay-history package contains receipts from multiple source receipts.",
    );
  }

  if (!sourceRouteContinuity) {
    throw new Error(
      "The replay-history package contains receipts from multiple routes.",
    );
  }

  return {
    package: {
      packageType:
        "TA14_IMPORTED_ROUTE_REPLAY_HISTORY",
      packageVersion: "1.0",
      sourceReceiptId: value.sourceReceiptId,
      sourceRouteId: value.sourceRouteId,
      replayReceiptCount: value.replayReceiptCount,
      exportedAt: value.exportedAt,
      replayReceipts,
    },
    receiptCountMatches,
    sourceReceiptContinuity,
    sourceRouteContinuity,
  };
}

export async function readImportedReplayHistoryFile(
  file: File,
): Promise<ImportedReplayHistoryImportResult> {
  let parsed: unknown;

  try {
    parsed = JSON.parse(await file.text()) as unknown;
  } catch {
    throw new Error(
      "The selected replay-history file is not valid JSON.",
    );
  }

  return validateImportedReplayHistoryExport(parsed);
}
