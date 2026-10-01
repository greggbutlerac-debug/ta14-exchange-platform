import { NextRequest, NextResponse } from 'next/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { deliverOwnerAlert } from '@/lib/owner-alerts/service';
import { isOperatorIdentity, ownerAlertConfig, resendSender, supabaseOwnerAlertStore } from '@/lib/owner-alerts/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

async function requireOwner() {
  const auth = await createServerClient();
  const { data: { user } } = await auth.auth.getUser();
  if (!user) return { error: NextResponse.json({ error: 'AUTH_REQUIRED' }, { status: 401 }) };
  if (!isOperatorIdentity({ userId: user.id, email: user.email })) return { error: NextResponse.json({ error: 'OWNER_ACCESS_REQUIRED' }, { status: 403 }) };
  return { user };
}

/** Owner view of alerts: recent alerts with delivery state, plus every failed/undelivered alert. */
export async function GET() {
  const gate = await requireOwner();
  if (gate.error) return gate.error;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim(), key = process.env.SUPABASE_SECRET_KEY?.trim() || process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) return NextResponse.json({ error: 'NOT_CONFIGURED' }, { status: 503 });
  const db = createServiceClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  const cols = 'id,alert_key,alert_type,is_test,occurred_at,delivery_state,attempts,last_attempt_at,delivered_at,last_error,facts';
  const [recent, attention] = await Promise.all([
    db.from('ta14_owner_alerts').select(cols).order('occurred_at', { ascending: false }).limit(100),
    db.from('ta14_owner_alerts').select(cols).in('delivery_state', ['failed', 'pending', 'sending']).order('occurred_at', { ascending: false }).limit(200),
  ]);
  if (recent.error || attention.error) return NextResponse.json({ error: 'OWNER_ALERT_QUERY_FAILED' }, { status: 500 });
  const config = ownerAlertConfig();
  return NextResponse.json(
    {
      generatedAt: new Date().toISOString(),
      configuration: { recipientsConfigured: config.recipients.length, sendTestAlerts: config.sendTestAlerts, resendConfigured: Boolean(process.env.RESEND_API_KEY?.trim()) },
      needsAttention: attention.data,
      recent: recent.data,
    },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}

/** Owner-requested retry of one alert: { "alertId": "<uuid>" }. Also sends a suppressed test alert on request. */
export async function POST(request: NextRequest) {
  const gate = await requireOwner();
  if (gate.error) return gate.error;
  let body: { alertId?: unknown } = {};
  try { body = await request.json(); } catch { /* empty */ }
  const alertId = typeof body.alertId === 'string' ? body.alertId.trim() : '';
  if (!/^[0-9a-f-]{36}$/i.test(alertId)) return NextResponse.json({ error: 'VALID_ALERT_ID_REQUIRED' }, { status: 400 });
  const store = supabaseOwnerAlertStore();
  const reset = await store.resetForRetry(alertId);
  if (!reset) return NextResponse.json({ error: 'ALERT_NOT_RETRYABLE', detail: 'Only failed or suppressed alerts can be retried.' }, { status: 409 });
  const outcome = await deliverOwnerAlert(store, resendSender(), alertId, ownerAlertConfig());
  return NextResponse.json({ ok: outcome.outcome === 'delivered', outcome });
}
