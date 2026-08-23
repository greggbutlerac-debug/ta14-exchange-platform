import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import type { RecordId } from "../../../lib/governance-playgrounds/types";
import type { PreservedRuntimeGovernedRecord } from "../../../lib/governance-playgrounds/runtime-preserved-governed-record";
import { SupabaseAuthoritativeRuntimeRecordStore } from "../../../lib/governance-playgrounds/runtime-authoritative-supabase-store";

function bearerToken(request: NextRequest): string | null {
  const header = request.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) return null;
  return header.slice(7).trim() || null;
}

async function authenticatedUserId(request: NextRequest): Promise<string | null> {
  const token = bearerToken(request);
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!token || !url || !anonKey) return null;
  const client = createClient(url, anonKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data, error } = await client.auth.getUser(token);
  if (error || !data.user) return null;
  return data.user.id;
}

function isCandidate(value: unknown): value is PreservedRuntimeGovernedRecord {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<PreservedRuntimeGovernedRecord>;
  return Boolean(candidate.recordId && candidate.schemaVersion && candidate.lineage && candidate.determination);
}

export async function POST(request: NextRequest) {
  const actorUserId = await authenticatedUserId(request);
  if (!actorUserId) return NextResponse.json({ error: "AUTHENTICATION_REQUIRED" }, { status: 401 });

  let body: unknown;
  try { body = await request.json(); }
  catch { return NextResponse.json({ error: "INVALID_JSON" }, { status: 400 }); }
  if (!isCandidate(body)) return NextResponse.json({ error: "INVALID_RUNTIME_RECORD" }, { status: 400 });

  try {
    const store = new SupabaseAuthoritativeRuntimeRecordStore(actorUserId);
    const receipt = await store.preserve(body);
    return NextResponse.json({ receipt }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "AUTHORITATIVE_RUNTIME_PRESERVATION_FAILED";
    return NextResponse.json({ error: message }, { status: 503 });
  }
}

export async function GET(request: NextRequest) {
  const actorUserId = await authenticatedUserId(request);
  if (!actorUserId) return NextResponse.json({ error: "AUTHENTICATION_REQUIRED" }, { status: 401 });
  const recordId = request.nextUrl.searchParams.get("recordId");
  if (!recordId) return NextResponse.json({ error: "RECORD_ID_REQUIRED" }, { status: 400 });

  try {
    const store = new SupabaseAuthoritativeRuntimeRecordStore(actorUserId);
    const record = await store.get(recordId as RecordId);
    if (!record) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
    return NextResponse.json({ record }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "AUTHORITATIVE_RUNTIME_RETRIEVAL_FAILED";
    return NextResponse.json({ error: message }, { status: 503 });
  }
}
