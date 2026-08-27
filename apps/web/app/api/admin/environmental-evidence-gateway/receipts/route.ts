import { createHash } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

type Json = null | boolean | number | string | Json[] | { [key: string]: Json };
function stable(value: Json): Json { if (Array.isArray(value)) return value.map(stable); if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stable(value[key])])) as Json; return value; }
function sha256(value: Json) { return `sha256:${createHash('sha256').update(JSON.stringify(stable(value))).digest('hex')}`; }
function text(value: unknown, max = 512) { return typeof value === 'string' ? value.trim().slice(0, max) : ''; }

async function ownerAuth() {
  const ownerId = process.env.TA14_REVENUE_OWNER_USER_ID?.trim();
  if (!ownerId) return null;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id === ownerId ? { user, supabase } : null;
}

export async function GET(request: NextRequest) {
  const a = await ownerAuth(); if (!a) return NextResponse.json({ error: 'Not found.' }, { status: 404 });
  const replayId = text(request.nextUrl.searchParams.get('replay_id'));
  let query = a.supabase.from('ta14_private_environmental_gateway_receipts').select('record_id,replay_id,canonical_version,algorithm,evidence_hash,determination_hash,determination,receipt_payload,preserved_at').eq('owner_user_id', a.user.id).order('preserved_at', { ascending: false }).limit(replayId ? 1 : 25);
  if (replayId) query = query.eq('replay_id', replayId);
  const { data, error } = await query; if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  const receipts = (data ?? []).map((row) => {
    const payload = row.receipt_payload as Json;
    const recomputed = sha256(payload);
    return { ...row, replay_verification: { recomputed_hash: recomputed, stored_hash: row.determination_hash, status: recomputed === row.determination_hash ? 'PASS' : 'FAIL' } };
  });
  return NextResponse.json({ receipts }, { headers: { 'Cache-Control': 'no-store' } });
}

export async function POST(request: NextRequest) {
  const a = await ownerAuth(); if (!a) return NextResponse.json({ error: 'Not found.' }, { status: 404 });
  const body = await request.json();
  const recordId = text(body.record_id), replayId = text(body.replay_id), evidenceHash = text(body.evidence_hash), determinationHash = text(body.determination_hash), determination = text(body.determination, 20);
  const payload = body.receipt_payload as Json;
  if (!recordId || !replayId || !evidenceHash || !determinationHash || !payload || !['ALLOW','HOLD','DENY','ESCALATE'].includes(determination)) return NextResponse.json({ error: 'Incomplete or invalid receipt.' }, { status: 400 });
  const recomputed = sha256(payload);
  if (recomputed !== determinationHash) return NextResponse.json({ error: 'Receipt verification failed before preservation.', replay_verification: { status: 'FAIL', recomputed_hash: recomputed, submitted_hash: determinationHash } }, { status: 409 });
  const { data, error } = await a.supabase.from('ta14_private_environmental_gateway_receipts').upsert({ owner_user_id: a.user.id, record_id: recordId, replay_id: replayId, canonical_version: 'TA14.EEG.RECEIPT.v1', algorithm: 'SHA-256', evidence_hash: evidenceHash, determination_hash: determinationHash, determination, receipt_payload: payload }, { onConflict: 'owner_user_id,replay_id', ignoreDuplicates: true }).select('record_id,replay_id,preserved_at').maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true, receipt: data ?? { record_id: recordId, replay_id: replayId, duplicate: true }, replay_verification: { status: 'PASS', recomputed_hash: recomputed } });
}
