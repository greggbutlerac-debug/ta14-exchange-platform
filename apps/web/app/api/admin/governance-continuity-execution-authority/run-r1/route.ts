import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { buildPrivateGceaDemonstration } from '@/lib/governance-continuity-execution-authority';
import { makeChronologyEvent, verifyChronology } from '@/lib/governance-continuity-execution-authority-chronology';

export const dynamic = 'force-dynamic';

async function ownerAuth() {
  const ownerId = process.env.TA14_REVENUE_OWNER_USER_ID?.trim();
  if (!ownerId) return null;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id === ownerId ? { user, supabase } : null;
}

export async function POST() {
  const a = await ownerAuth();
  if (!a) return NextResponse.json({ error: 'Not found.' }, { status: 404 });
  const now = new Date();
  const runId = `TA14-GCEA-R1-${now.toISOString().replace(/[-:.TZ]/g, '').slice(0, 14)}`;
  const demo = buildPrivateGceaDemonstration(now);
  const e1 = makeChronologyEvent({ runId, sequenceNo: 1, eventType: 'BASELINE', asset: demo.asset, evaluation: demo.baseline, authorityInput: demo.baselineInput });
  const e2 = makeChronologyEvent({ runId, sequenceNo: 2, eventType: 'MATERIAL_CHANGE', asset: demo.asset, evaluation: demo.challenged, authorityInput: demo.challengedInput, previousEventHash: e1.eventHash, additionalPayload: demo.change });
  const e3 = makeChronologyEvent({ runId, sequenceNo: 3, eventType: 'AUTHORITY_CHALLENGE', asset: demo.asset, evaluation: demo.challenged, authorityInput: demo.challengedInput, previousEventHash: e2.eventHash, additionalPayload: { boundary: demo.asset.consequence, progressionPermitted: false, executionAttempt: demo.deniedAttempt } });
  const e4 = makeChronologyEvent({ runId, sequenceNo: 4, eventType: 'REAUTHORIZATION', asset: demo.reauthorizedAsset, evaluation: demo.restored, authorityInput: demo.restoredInput, previousEventHash: e3.eventHash, additionalPayload: { authority: demo.reauthorizedAuthority } });
  const e5 = makeChronologyEvent({ runId, sequenceNo: 5, eventType: 'RESTORATION', asset: demo.reauthorizedAsset, evaluation: demo.restored, authorityInput: demo.restoredInput, previousEventHash: e4.eventHash, additionalPayload: { progressionPermitted: true } });
  const events = [e1, e2, e3, e4, e5];
  const verification = verifyChronology(events);
  if (verification.status !== 'PASS' || verification.semanticReplayCount !== events.length) return NextResponse.json({ error: 'Pre-preservation semantic replay verification failed.', verification }, { status: 409 });

  const rows = events.map((event) => ({ owner_user_id: a.user.id, run_id: event.runId, sequence_no: event.sequenceNo, event_type: event.eventType, asset_id: event.assetId, asset_version: event.assetVersion, route_id: event.routeId, determination: event.determination, standing: event.standing, receipt_hash: event.receiptHash, replay_id: event.replayId, event_payload: event.eventPayload, previous_event_hash: event.previousEventHash, event_hash: event.eventHash }));
  const { error } = await a.supabase.from('ta14_private_gcea_events').insert(rows);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  const { data, error: readError } = await a.supabase.from('ta14_private_gcea_events').select('*').eq('owner_user_id', a.user.id).eq('run_id', runId).order('sequence_no', { ascending: true });
  if (readError) return NextResponse.json({ error: readError.message, run_id: runId, preservation: 'COMMITTED_BUT_REPLAY_UNVERIFIED' }, { status: 500 });
  const replay = (data ?? []).map((row) => ({ runId: row.run_id, sequenceNo: row.sequence_no, eventType: row.event_type, assetId: row.asset_id, assetVersion: row.asset_version, routeId: row.route_id, determination: row.determination, standing: row.standing, receiptHash: row.receipt_hash, replayId: row.replay_id, eventPayload: row.event_payload, previousEventHash: row.previous_event_hash, eventHash: row.event_hash }));
  const postPreservationVerification = verifyChronology(replay);
  const ok = postPreservationVerification.status === 'PASS' && postPreservationVerification.semanticReplayCount === replay.length;
  return NextResponse.json({ ok, run_id: runId, preserved_events: replay.length, execution_attempt: { determination: demo.deniedAttempt.determination, permitted: demo.deniedAttempt.executionPermitted, receipt_hash: demo.deniedAttempt.receipt.hash }, pre_preservation_verification: verification, post_preservation_verification: postPreservationVerification }, { status: ok ? 200 : 409 });
}
