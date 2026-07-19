import { createClient } from "./supabase/client";
import type {
  RouteVerificationPackageImportResult,
} from "./route-verification-receipt-import";
import type {
  ImportedRoutePackageReplayResult,
} from "./imported-route-verification-replay";

type ImportedRouteReplayReceiptRow = {
  id: string;
  user_id: string;
  package_type: string;
  package_version: string;
  source_receipt_id: string;
  source_route_id: string;
  replay_status: ImportedRoutePackageReplayResult["status"];
  recorded_sha256: string;
  calculated_sha256: string | null;
  hash_matches: boolean | null;
  artifact_receipt_reference_count: number;
  failures: string[];
  imported_package: RouteVerificationPackageImportResult["exportPackage"];
  replay_result: ImportedRoutePackageReplayResult;
  replayed_at: string;
  created_at: string;
};

export type ImportedRouteReplayReceipt = {
  id: string;
  packageType: string;
  packageVersion: string;
  sourceReceiptId: string;
  sourceRouteId: string;
  replayStatus: ImportedRoutePackageReplayResult["status"];
  recordedSha256: string;
  calculatedSha256: string | null;
  hashMatches: boolean | null;
  artifactReceiptReferenceCount: number;
  failures: string[];
  importedPackage: RouteVerificationPackageImportResult["exportPackage"];
  replayResult: ImportedRoutePackageReplayResult;
  replayedAt: string;
  createdAt: string;
};

function mapRowToReceipt(
  row: ImportedRouteReplayReceiptRow,
): ImportedRouteReplayReceipt {
  return {
    id: row.id,
    packageType: row.package_type,
    packageVersion: row.package_version,
    sourceReceiptId: row.source_receipt_id,
    sourceRouteId: row.source_route_id,
    replayStatus: row.replay_status,
    recordedSha256: row.recorded_sha256,
    calculatedSha256: row.calculated_sha256,
    hashMatches: row.hash_matches,
    artifactReceiptReferenceCount:
      row.artifact_receipt_reference_count,
    failures: row.failures,
    importedPackage: row.imported_package,
    replayResult: row.replay_result,
    replayedAt: row.replayed_at,
    createdAt: row.created_at,
  };
}

async function getAuthenticatedUserId(): Promise<string> {
  const supabase = createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw new Error(error.message);
  }

  if (!user) {
    throw new Error(
      "You must be signed in to preserve imported replay receipts.",
    );
  }

  return user.id;
}

export async function createImportedRouteReplayReceipt(
  importedPackage: RouteVerificationPackageImportResult,
  replayResult: ImportedRoutePackageReplayResult,
): Promise<ImportedRouteReplayReceipt> {
  const supabase = createClient();
  const userId = await getAuthenticatedUserId();

  const { data, error } = await supabase
    .from("exchange_imported_route_package_replays")
    .insert({
      user_id: userId,
      package_type: importedPackage.exportPackage.packageType,
      package_version: importedPackage.exportPackage.packageVersion,
      source_receipt_id: importedPackage.receipt.id,
      source_route_id: importedPackage.receipt.routeId,
      replay_status: replayResult.status,
      recorded_sha256: replayResult.recordedSha256,
      calculated_sha256: replayResult.calculatedSha256,
      hash_matches: replayResult.hashMatches,
      artifact_receipt_reference_count:
        replayResult.artifactReceiptReferenceCount,
      failures: replayResult.failures,
      imported_package: importedPackage.exportPackage,
      replay_result: replayResult,
      replayed_at: replayResult.replayedAt,
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapRowToReceipt(
    data as unknown as ImportedRouteReplayReceiptRow,
  );
}

export async function getLatestImportedRouteReplayReceipt(
  sourceReceiptId: string,
): Promise<ImportedRouteReplayReceipt | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("exchange_imported_route_package_replays")
    .select("*")
    .eq("source_receipt_id", sourceReceiptId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    return null;
  }

  return mapRowToReceipt(
    data as unknown as ImportedRouteReplayReceiptRow,
  );
}
