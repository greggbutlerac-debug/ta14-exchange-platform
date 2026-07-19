import type { RouteVerificationReceipt } from "./route-verification-receipts";
import type { RouteReceiptVerificationResult } from "./route-verification-receipt-validator";

export type RouteVerificationExportPackage = {
  packageType: "TA14_ROUTE_VERIFICATION_RECEIPT";
  packageVersion: "1.0";
  exportedAt: string;
  receipt: RouteVerificationReceipt;
  validation: RouteReceiptVerificationResult | null;
};

function sanitizeFilenamePart(value: string): string {
  return value
    .trim()
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function buildRouteVerificationExportPackage(
  receipt: RouteVerificationReceipt,
  validation: RouteReceiptVerificationResult | null,
): RouteVerificationExportPackage {
  return {
    packageType: "TA14_ROUTE_VERIFICATION_RECEIPT",
    packageVersion: "1.0",
    exportedAt: new Date().toISOString(),
    receipt,
    validation,
  };
}

export function downloadRouteVerificationExportPackage(
  receipt: RouteVerificationReceipt,
  validation: RouteReceiptVerificationResult | null,
): void {
  const exportPackage = buildRouteVerificationExportPackage(
    receipt,
    validation,
  );

  const json = JSON.stringify(exportPackage, null, 2);
  const blob = new Blob([json], {
    type: "application/json;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);

  const routePart =
    sanitizeFilenamePart(receipt.routeId) || "route";
  const timestampPart = new Date(receipt.createdAt)
    .toISOString()
    .replace(/[:.]/g, "-");

  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `ta14-${routePart}-verification-receipt-${timestampPart}.json`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  URL.revokeObjectURL(url);
}
