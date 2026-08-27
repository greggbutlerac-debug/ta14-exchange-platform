import { NextResponse } from 'next/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

const OFFER_VIEWED = 'Registered Trial Offer Viewed';
const CTA_CLICKED = 'Start 60-Day TA-14 Workspace';

export async function GET() {
  const auth = await createServerClient();
  const { data: { user } } = await auth.auth.getUser();
  if (!user) return NextResponse.json({ error: 'AUTH_REQUIRED' }, { status: 401 });

  const ownerId = (process.env.TA14_SEO_OWNER_USER_ID || process.env.TA14_REVENUE_OWNER_USER_ID || '').trim();
  const adminEmails = new Set(
    (process.env.TA14_SEO_ADMIN_EMAILS || process.env.NEXT_PUBLIC_TA14_MISSION_CONTROL_ADMIN_EMAILS || 'ta14admissibleexecution@gmail.com,greggbutlerac@gmail.com')
      .split(',')
      .map((value) => value.trim().toLowerCase())
      .filter(Boolean),
  );
  const email = (user.email || '').trim().toLowerCase();
  const allowed = (ownerId && user.id === ownerId) || (email && adminEmails.has(email));
  if (!allowed) return NextResponse.json({ error: 'OWNER_ACCESS_REQUIRED' }, { status: 403 });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return NextResponse.json({ error: 'NOT_CONFIGURED' }, { status: 503 });

  const db = createServiceClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  const since = new Date(Date.now() - 30 * 86400000).toISOString();

  const [eventsResult, bindingsResult, trialsResult, subscriptionsResult] = await Promise.all([
    db.from('ta14_seo_intelligence_events')
      .select('occurred_at,event_type,visit_id,page_path,target_href,target_text,metadata')
      .gte('occurred_at', since)
      .in('target_text', [OFFER_VIEWED, CTA_CLICKED])
      .order('occurred_at', { ascending: false })
      .limit(5000),
    db.from('ta14_seo_user_attribution')
      .select('user_id,first_visit_id,latest_visit_id')
      .limit(5000),
    db.from('ta14_commercial_trials')
      .select('user_id,status,started_at,ends_at,converted_at,converted_subscription_id,source_visit_id,source_page')
      .gte('started_at', since)
      .limit(5000),
    db.from('ta14_billing_subscriptions')
      .select('owner_user_id,status,created_at,updated_at')
      .limit(5000),
  ]);

  if (eventsResult.error || bindingsResult.error || trialsResult.error || subscriptionsResult.error) {
    console.error('COMMERCIAL_HANDOFF_QUERY_FAILED', {
      events: eventsResult.error,
      bindings: bindingsResult.error,
      trials: trialsResult.error,
      subscriptions: subscriptionsResult.error,
    });
    return NextResponse.json({ error: 'COMMERCIAL_HANDOFF_QUERY_FAILED' }, { status: 500 });
  }

  const bindings = bindingsResult.data || [];
  const events = eventsResult.data || [];
  const trials = trialsResult.data || [];
  const subscriptions = subscriptionsResult.data || [];

  const authEmailById = new Map<string, string>();
  const boundUserIds = [...new Set(bindings.map((row) => String(row.user_id || '')).filter(Boolean))];
  if (boundUserIds.length) {
    const { data: authUsers } = await db.schema('auth').from('users').select('id,email').in('id', boundUserIds);
    for (const authUser of authUsers || []) authEmailById.set(String(authUser.id), String(authUser.email || '').trim().toLowerCase());
  }

  const adminUserIds = new Set<string>();
  if (ownerId) adminUserIds.add(ownerId);
  for (const [id, boundEmail] of authEmailById) if (adminEmails.has(boundEmail)) adminUserIds.add(id);
  if (adminEmails.has(email)) adminUserIds.add(String(user.id));

  const visitToUser = new Map<string, string>();
  for (const binding of bindings) {
    const userId = String(binding.user_id || '');
    if (!userId || adminUserIds.has(userId)) continue;
    if (binding.first_visit_id) visitToUser.set(String(binding.first_visit_id), userId);
    if (binding.latest_visit_id) visitToUser.set(String(binding.latest_visit_id), userId);
  }

  const participantEvents = events.filter((event) => {
    const visitId = String(event.visit_id || '');
    const userId = visitToUser.get(visitId);
    if (userId && adminUserIds.has(userId)) return false;
    const metadata = event.metadata && typeof event.metadata === 'object' ? event.metadata as Record<string, unknown> : {};
    return metadata.operator !== true;
  });

  const offerViewedEvents = participantEvents.filter((event) => event.event_type === 'page_view' && event.target_text === OFFER_VIEWED);
  const ctaClickEvents = participantEvents.filter((event) => event.event_type === 'click' && event.target_text === CTA_CLICKED);
  const offerViewedVisitors = new Set(offerViewedEvents.map((event) => event.visit_id).filter(Boolean)).size;
  const ctaClickVisitors = new Set(ctaClickEvents.map((event) => event.visit_id).filter(Boolean)).size;

  const externalTrials = trials.filter((trial) => !adminUserIds.has(String(trial.user_id || '')));
  const activeTrials = externalTrials.filter((trial) => String(trial.status || '').toLowerCase() === 'active' && !trial.converted_at);
  const convertedTrials = externalTrials.filter((trial) => Boolean(trial.converted_at) || String(trial.status || '').toLowerCase() === 'converted');
  const externalSubscriptions = subscriptions.filter((subscription) => !adminUserIds.has(String(subscription.owner_user_id || '')));
  const paidStatuses = new Set(['ACTIVE', 'APPROVAL_PENDING', 'APPROVED']);
  const paidSubscriptions = externalSubscriptions.filter((subscription) => paidStatuses.has(String(subscription.status || '').toUpperCase()));

  const clickThroughRate = offerViewedVisitors > 0 ? Number(((ctaClickVisitors / offerViewedVisitors) * 100).toFixed(1)) : null;
  const clickToTrialRate = ctaClickVisitors > 0 ? Number(((externalTrials.length / ctaClickVisitors) * 100).toFixed(1)) : null;

  return NextResponse.json({
    generatedAt: new Date().toISOString(),
    windowDays: 30,
    summary: {
      offerViewedEvents: offerViewedEvents.length,
      offerViewedVisitors,
      ctaClickEvents: ctaClickEvents.length,
      ctaClickVisitors,
      trialActivated: externalTrials.length,
      activeTrials: activeTrials.length,
      convertedTrials: convertedTrials.length,
      paidSubscriptions: paidSubscriptions.length,
      clickThroughRate,
      clickToTrialRate,
    },
    boundary: 'Offer views and clicks are behavioral telemetry. Trial activation comes from ta14_commercial_trials. Paid subscription state comes from the authoritative billing subscription surface. Rolling-window stage counts are not asserted as a closed cohort unless both numerator and denominator are independently observed for the same stage transition.',
  }, { headers: { 'Cache-Control': 'no-store, max-age=0' } });
}
