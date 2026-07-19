import type {
  ImportedRouteReplayReceipt,
} from "./imported-route-replay-receipts";

export type ImportedReplayHistoryExportPackage = {
  packageType: "TA14_IMPORTED_ROUTE_REPLAY_HISTORY";
  packageVersion: "1.0";
  sourceReceiptId: string;
  sourceRouteId: string;
  replayReceiptCount: number;
  exportedAt: string;
  replayReceipts: ImportedRouteReplayReceipt[];
};

function sanitizeFileSegment(value: string): string {
  const sanitized = value
    .trim()
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return sanitized || "route-receipt";
}

export function buildImportedReplayHistoryExportPackage(
  replayReceipts: ImportedRouteReplayReceipt[],
): ImportedReplayHistoryExportPackage {
  if (replayReceipts.length === 0) {
    throw new Error(
      "At least one preserved imported replay receipt is required.",
    );
  }

  const sourceReceiptId = replayReceipts[0].sourceReceiptId;
  const sourceRouteId = replayReceipts[0].sourceRouteId;

  const hasMixedSourceReceipts = replayReceipts.some(
    (receipt) => receipt.sourceReceiptId !== sourceReceiptId,
  );

  if (hasMixedSourceReceipts) {
    throw new Error(
      "Replay history export cannot contain multiple source receipt IDs.",
    );
  }

  const hasMixedRoutes = replayReceipts.some(
    (receipt) => receipt.sourceRouteId !== sourceRouteId,
  );

  if (hasMixedRoutes) {
    throw new Error(
      "Replay history export cannot contain multiple source route IDs.",
    );
  }

  return {
    packageType: "TA14_IMPORTED_ROUTE_REPLAY_HISTORY",
    packageVersion: "1.0",
    sourceReceiptId,
    sourceRouteId,
    replayReceiptCount: replayReceipts.length,
    exportedAt: new Date().toISOString(),
    replayReceipts,
  };
}

export function downloadImportedReplayHistoryExport(
  replayReceipts: ImportedRouteReplayReceipt[],
): void {
  const exportPackage =
    buildImportedReplayHistoryExportPackage(replayReceipts);

  const blob = new Blob(
    [JSON.stringify(exportPackage, null, 2)],
    {
      type: "application/json",
    },
  );

  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = objectUrl;
  anchor.download = [
    "ta14-imported-replay-history",
    sanitizeFileSegment(exportPackage.sourceRouteId),
    sanitizeFileSegment(exportPackage.sourceReceiptId),
    ".json",
  ].join("-");

  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  URL.revokeObjectURL(objectUrl);
}
