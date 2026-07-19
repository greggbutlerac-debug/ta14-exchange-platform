import { createClient } from "./supabase/client";
import type {
  ImportedRouteReplayReceipt,
} from "./imported-route-replay-receipts";

type ImportedRouteReplayReceiptRow = {
  id: string;
  user_id: string;
  package_type: string;
  package_version: string;
  source_receipt_id: string;
  source_route_id: string;
  replay_status: ImportedRouteReplayReceipt["replayStatus"];
  recorded_sha256: string;
  calculated_sha256: string | null;
  hash_matches: boolean | null;
  artifact_receipt_reference_count: number;
  failures: string[];
  imported_package: ImportedRouteReplayReceipt["importedPackage"];
  replay_result: ImportedRouteReplayReceipt["replayResult"];
  replayed_at: string;
  created_at: string;
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

export async function listImportedRouteReplayReceipts(
  sourceReceiptId: string,
): Promise<ImportedRouteReplayReceipt[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("exchange_imported_route_package_replays")
    .select("*")
    .eq("source_receipt_id", sourceReceiptId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) =>
    mapRowToReceipt(
      row as unknown as ImportedRouteReplayReceiptRow,
    ),
  );
}
