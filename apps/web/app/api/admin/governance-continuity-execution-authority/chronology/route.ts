import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sha256, verifyChronology, type GceaChronologyEvent } from '@/lib/governance-continuity-execution-authority-chronology';

export const dynamic = 'force-dynamic';

function text(value: unknown, max = 512) { return typeof value === 'string' ? value.trim().slice(0, max) : ''; }
function integer(value: unknown) { const n = Number(value); return Number.isInteger(n) && n > 0 ? n : 0; }

async function ownerAuth() {
  const ownerId = process.env.TA14_REVENUE_OWNER_USER_ID?.trim();
  if (!ownerId) return null;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id === ownerId ? { user, supabase } : null;
}

function fromRow(row: Record<string, unknown>): GceaChronologyEvent {
  return {
    runId: String(row.run_id), sequenceNo: Number(row.sequence_no), eventType: row.event_type as GceaChronologyEvent['eventType'],
    assetId: String(row.asset_id), assetVersion: String(row.asset_version), routeId: String(row.route_id),
    determination: row.determination as GceaChronologyEvent['determination'], standing: row.standing as GceaChronologyEvent['standing'],
    receiptHash: String(row.receipt_hash), replayId: String(row.replay_id), eventPayload: row.event_payload,
    previousEventHash: row.previous_event_hash ? String(row.previous_event_hash) : null, eventHash: String(row.event_hash),
  };
}

export async function GET(request: NextRequest) {
  const a = await ownerAuth(); if (!a) return NextResponse.json({ error: 'Not found.' }, { status: 404 });
  const runId = text(request.nextUrl.searchParams.get('run_id'));
  if (!runId) return NextResponse.json({ error: 'run_id required.' }, { status: 400 });
  const { data, error } = await a.supabase.from('ta14_private_gcea_events').select('*').eq('owner_user_id', a.user.id).eq('run_id', runId).order('sequence_no', { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  const events = (data ?? []).map((row) => fromRow(row as Record<string, unknown>));
  return NextResponse.json({ run_id: runId, events, verification: verifyChronology(events) }, { headers: { 'Cache-Control': 'no-store' } });
}

export async function POST(request: NextRequest) {
  const a = await ownerAuth(); if (!a) return NextResponse.json({ error: 'Not found.' }, { status: 404 });
  const body = await request.json();
  const runId = text(body.run_id), sequenceNo = integer(body.sequence_no), eventType = text(body.event_type, 40), assetId = text(body.asset_id), assetVersion = text(body.asset_version), routeId = text(body.route_id), receiptHash = text(body.receipt_hash), replayId = text(body.replay_id), eventHash = text(body.event_hash), previousEventHash = body.previous_event_hash == null ? null : text(body.previous_event_hash);
  const determination = body.determination == null ? null : text(body.determination, 20), standing = body.standing == null ? null : text(body.standing, 20), eventPayload = body.event_payload;
  const eventTypes = ['BASELINE','MATERIAL_CHANGE','AUTHORITY_CHALLENGE','BOUNDARY_DETERMINATION','REAUTHORIZATION','RESTORATION','REPLAY_VERIFICATION'];
  if (!runId || !sequenceNo || !eventTypes.includes(eventType) || !assetId || !assetVersion || !routeId || !receiptHash || !replayId || !eventHash || !eventPayload) return NextResponse.json({ error: 'Incomplete chronology event.' }, { status: 400 });
  if (determination && !['ALLOW','HOLD','DENY','ESCALATE'].includes(determination)) return NextResponse.json({ error: 'Invalid determination.' }, { status: 400 });
  if (standing && !['CURRENT','CHALLENGED','EXPIRED','REVOKED'].includes(standing)) return NextResponse.json({ error: 'Invalid standing.' }, { status: 400 });
  const receiptPayload = eventPayload?.receipt;
  if (!receiptPayload || sha256(receiptPayload) !== receiptHash) return NextResponse.json({ error: 'Receipt replay verification failed before preservation.' }, { status: 409 });
  const base = { runId, sequenceNo, eventType, assetId, assetVersion, routeId, determination, standing, receiptHash, replayId, eventPayload, previousEventHash };
  if (sha256(base) !== eventHash) return NextResponse.json({ error: 'Event hash verification failed before preservation.' }, { status: 409 });
  const { data: prior, error: priorError } = await a.supabase.from('ta14_private_gcea_events').select('sequence_no,event_hash').eq('owner_user_id', a.user.id).eq('run_id', runId).order('sequence_no', { ascending: false }).limit(1).maybeSingle();
  if (priorError) return NextResponse.json({ error: priorError.message }, { status: 400 });
  const expectedSequence = prior ? Number(prior.sequence_no) + 1 : 1;
  const expectedPrevious = prior ? String(prior.event_hash) : null;
  if (sequenceNo !== expectedSequence || previousEventHash !== expectedPrevious) return NextResponse.json({ error: 'Chronology continuity verification failed.', expected_sequence_no: expectedSequence, expected_previous_event_hash: expectedPrevious }, { status: 409 });
  const { error } = await a.supabase.from('ta14_private_gcea_events').insert({ owner_user_id: a.user.id, run_id: runId, sequence_no: sequenceNo, event_type: eventType, asset_id: assetId, asset_version: assetVersion, route_id: routeId, determination, standing, receipt_hash: receiptHash, replay_id: replayId, event_payload: eventPayload, previous_event_hash: previousEventHash, event_hash: eventHash });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true, run_id: runId, sequence_no: sequenceNo, event_hash: eventHash, verification: 'PASS' });
}
