import { createHash, randomUUID } from "node:crypto";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { RecordId } from "./types";
import type { PreservedRuntimeGovernedRecord } from "./runtime-preserved-governed-record";
import type {
  AuthoritativePreservationReceipt,
  AuthoritativeRuntimeRecordStore,
} from "./runtime-authoritative-preservation";

function canonicalize(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonicalize).join(",")}]`;
  const object = value as Record<string, unknown>;
  return `{${Object.keys(object).sort().map((key) => `${JSON.stringify(key)}:${canonicalize(object[key])}`).join(",")}}`;
}

export function runtimeRecordDigest(record: PreservedRuntimeGovernedRecord): string {
  return createHash("sha256").update(canonicalize(record), "utf8").digest("hex");
}

function serviceClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("AUTHORITATIVE_RUNTIME_LEDGER_NOT_CONFIGURED");
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export class SupabaseAuthoritativeRuntimeRecordStore implements AuthoritativeRuntimeRecordStore {
  constructor(
    private readonly actorUserId: string,
    private readonly db: SupabaseClient = serviceClient(),
  ) {}

  async preserve(record: PreservedRuntimeGovernedRecord): Promise<AuthoritativePreservationReceipt> {
    const contentDigest = runtimeRecordDigest(record);
    const receiptId = randomUUID();
    const { data, error } = await this.db
      .from("runtime_governed_records")
      .insert({
        record_id: record.recordId,
        receipt_id: receiptId,
        actor_user_id: this.actorUserId,
        schema_version: record.schemaVersion,
        visibility: record.visibility,
        determination: record.determination,
        route_draft_id: record.lineage.routeDraftId,
        stored_run_id: record.lineage.storedRunId,
        content_digest: contentDigest,
        record_json: record,
      })
      .select("record_id,receipt_id,content_digest,persisted_at")
      .single();

    if (error || !data) {
      throw new Error(`AUTHORITATIVE_RUNTIME_PRESERVATION_FAILED:${error?.code ?? "UNKNOWN"}`);
    }

    return {
      recordId: data.record_id as RecordId,
      receiptId: data.receipt_id,
      persistedAt: data.persisted_at,
      contentDigest: data.content_digest,
      storageAuthority: "AUTHORITATIVE_SERVER_APPEND_ONLY",
      immutable: true,
    };
  }

  async get(recordId: RecordId): Promise<PreservedRuntimeGovernedRecord | undefined> {
    const { data, error } = await this.db
      .from("runtime_governed_records")
      .select("record_json,content_digest")
      .eq("record_id", recordId)
      .maybeSingle();
    if (error) throw new Error(`AUTHORITATIVE_RUNTIME_RETRIEVAL_FAILED:${error.code}`);
    if (!data) return undefined;
    const record = data.record_json as PreservedRuntimeGovernedRecord;
    if (runtimeRecordDigest(record) !== data.content_digest) {
      throw new Error("AUTHORITATIVE_RUNTIME_DIGEST_MISMATCH");
    }
    return record;
  }
}
