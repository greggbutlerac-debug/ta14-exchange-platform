/**
 * Server binding for owner alerts: Supabase outbox, Resend email, configuration from environment.
 *
 * Configuration reuses the existing owner/admin mechanisms; no address is hard-coded here.
 *   Recipients: TA14_OWNER_ALERT_EMAILS, else TA14_REGISTRY_REVIEWER_EMAILS (the registry alert recipients).
 *   Sender:     TA14_OWNER_ALERT_FROM, else TA14_REGISTRY_NOTIFICATION_FROM, else the registry default sender.
 *   Operators (test/admin detection): TA14_SEO_OWNER_USER_ID / TA14_REVENUE_OWNER_USER_ID and
 *               TA14_SEO_ADMIN_EMAILS / NEXT_PUBLIC_TA14_MISSION_CONTROL_ADMIN_EMAILS, plus the recipients.
 *   TA14_OWNER_ALERTS_SEND_TEST=true sends test/operator alerts (prefixed [TA-14 TEST]) instead of suppressing them.
 */
import { after } from 'next/server';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { CANONICAL_EXCHANGE_ORIGIN } from '@/lib/site/canonical-origin';
import {
  deliverOwnerAlert,
  recordOwnerAlert,
  type EmailSender,
  type NewOwnerAlert,
  type OwnerAlertConfig,
  type OwnerAlertRecord,
  type OwnerAlertStore,
} from './service';

const TABLE = 'ta14_owner_alerts';
const COLUMNS = 'id,alert_key,alert_type,facts,is_test,occurred_at,delivery_state,attempts,last_error';
const DEFAULT_FROM = 'TA-14 Registry <registry@ta14authority.org>';

const env = (name: string) => process.env[name]?.trim() ?? '';
const list = (value: string) => value.split(',').map((v) => v.trim().toLowerCase()).filter(Boolean);

export function ownerAlertConfig(): OwnerAlertConfig {
  const retry = Number(env('TA14_OWNER_ALERT_RETRY_MINUTES'));
  return {
    recipients: list(env('TA14_OWNER_ALERT_EMAILS') || env('TA14_REGISTRY_REVIEWER_EMAILS')),
    from: env('TA14_OWNER_ALERT_FROM') || env('TA14_REGISTRY_NOTIFICATION_FROM') || DEFAULT_FROM,
    sendTestAlerts: env('TA14_OWNER_ALERTS_SEND_TEST').toLowerCase() === 'true',
    retryCooldownMinutes: Number.isFinite(retry) && retry >= 5 ? Math.min(retry, 24 * 60) : 15,
    staleClaimMinutes: 15,
    maxAttempts: 12,
  };
}

/** True when the identity belongs to the owner/operators, so the event is a test/admin event. */
export function isOperatorIdentity(identity: { userId?: string | null; email?: string | null }): boolean {
  const ownerIds = [env('TA14_SEO_OWNER_USER_ID'), env('TA14_REVENUE_OWNER_USER_ID')].filter(Boolean);
  const emails = new Set([
    ...list(env('TA14_SEO_ADMIN_EMAILS') || env('NEXT_PUBLIC_TA14_MISSION_CONTROL_ADMIN_EMAILS')),
    ...ownerAlertConfig().recipients,
  ]);
  const email = identity.email?.trim().toLowerCase() ?? '';
  return Boolean((identity.userId && ownerIds.includes(identity.userId)) || (email && emails.has(email)));
}

/** Sandbox payments are never real revenue. */
export function isPaymentSandbox(): boolean {
  return env('PAYPAL_ENVIRONMENT').toLowerCase() === 'sandbox';
}

export function ownerRecordUrl(path: string): string {
  const base = (env('TA14_PUBLIC_APP_URL') || CANONICAL_EXCHANGE_ORIGIN).replace(/\/+$/, '');
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

function serviceClient(): SupabaseClient {
  const url = env('NEXT_PUBLIC_SUPABASE_URL');
  const key = env('SUPABASE_SECRET_KEY') || env('SUPABASE_SERVICE_ROLE_KEY');
  if (!url || !key) throw new Error('Owner alerts require Supabase server configuration.');
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } });
}

type Row = { id: string; alert_key: string; alert_type: OwnerAlertRecord['alertType']; facts: OwnerAlertRecord['facts']; is_test: boolean; occurred_at: string; delivery_state: OwnerAlertRecord['deliveryState']; attempts: number; last_error: string | null };
const toRecord = (r: Row): OwnerAlertRecord => ({
  id: r.id,
  alertKey: r.alert_key,
  alertType: r.alert_type,
  facts: r.facts,
  isTest: r.is_test,
  occurredAt: r.occurred_at,
  deliveryState: r.delivery_state,
  attempts: r.attempts,
  lastError: r.last_error,
});

export function supabaseOwnerAlertStore(db: SupabaseClient = serviceClient()): OwnerAlertStore {
  return {
    async insertIfAbsent(alert) {
      const { data, error } = await db
        .from(TABLE)
        .upsert(
          {
            alert_key: alert.alertKey,
            alert_type: alert.alertType,
            facts: alert.facts,
            is_test: alert.isTest,
            occurred_at: alert.facts.occurredAt,
            delivery_state: alert.deliveryState,
          },
          { onConflict: 'alert_key', ignoreDuplicates: true },
        )
        .select(COLUMNS);
      if (error) throw new Error(`Owner alert insert failed: ${error.message}`);
      const row = (data as Row[] | null)?.[0];
      return { created: Boolean(row), alert: row ? toRecord(row) : null };
    },
    async claim(id, now, staleBefore) {
      const claim = { delivery_state: 'sending', claimed_at: now.toISOString() };
      const fresh = await db.from(TABLE).update(claim).eq('id', id).in('delivery_state', ['pending', 'failed']).select(COLUMNS).maybeSingle();
      if (fresh.error) throw new Error(fresh.error.message);
      if (fresh.data) return toRecord(fresh.data as Row);
      const stale = await db.from(TABLE).update(claim).eq('id', id).eq('delivery_state', 'sending').lt('claimed_at', staleBefore.toISOString()).select(COLUMNS).maybeSingle();
      if (stale.error) throw new Error(stale.error.message);
      return stale.data ? toRecord(stale.data as Row) : null;
    },
    async markDelivered(id, attempts, providerMessageId, now) {
      const { error } = await db
        .from(TABLE)
        .update({ delivery_state: 'delivered', attempts, last_attempt_at: now.toISOString(), delivered_at: now.toISOString(), provider_message_id: providerMessageId, last_error: null })
        .eq('id', id);
      if (error) throw new Error(error.message);
    },
    async markFailed(id, attempts, message, now) {
      const { error } = await db.from(TABLE).update({ delivery_state: 'failed', attempts, last_attempt_at: now.toISOString(), last_error: message }).eq('id', id);
      if (error) throw new Error(error.message);
    },
    async listDeliverable(limit, retryBefore, staleBefore, maxAttempts) {
      const { data, error } = await db
        .from(TABLE)
        .select(COLUMNS)
        .or(
          [
            'delivery_state.eq.pending',
            `and(delivery_state.eq.failed,last_attempt_at.lt.${retryBefore.toISOString()},attempts.lt.${maxAttempts})`,
            `and(delivery_state.eq.sending,claimed_at.lt.${staleBefore.toISOString()})`,
          ].join(','),
        )
        .order('occurred_at', { ascending: true })
        .limit(limit);
      if (error) throw new Error(`Owner alert query failed: ${error.message}`);
      return ((data as Row[] | null) ?? []).map(toRecord);
    },
    async resetForRetry(id) {
      const { data, error } = await db.from(TABLE).update({ delivery_state: 'pending', claimed_at: null }).eq('id', id).in('delivery_state', ['failed', 'suppressed']).select(COLUMNS).maybeSingle();
      if (error) throw new Error(error.message);
      return data ? toRecord(data as Row) : null;
    },
  };
}

export function resendSender(): EmailSender {
  return {
    async send(message) {
      const apiKey = env('RESEND_API_KEY');
      if (!apiKey) throw new Error('RESEND_API_KEY is not configured.');
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          // Resend de-duplicates sends with the same key, a second guard against duplicate emails.
          'Idempotency-Key': message.idempotencyKey.slice(0, 256),
        },
        body: JSON.stringify({ from: message.from, to: message.to, subject: message.subject, text: message.text, html: message.html }),
      });
      const payload = (await response.json().catch(() => null)) as { id?: string; message?: string; name?: string } | null;
      if (!response.ok) throw new Error(payload?.message || payload?.name || `Resend returned HTTP ${response.status}.`);
      return { id: payload?.id ?? null };
    },
  };
}

/**
 * Records an alert for a business event that has ALREADY been persisted, then schedules delivery after
 * the response. Never throws: a recording or delivery problem must not fail or roll back the business
 * event. Recording failures are logged; delivery failures are stored on the alert and retried.
 */
export async function raiseOwnerAlert(alert: NewOwnerAlert): Promise<void> {
  try {
    const config = ownerAlertConfig();
    const store = supabaseOwnerAlertStore();
    const { created, alert: record } = await recordOwnerAlert(store, alert, config);
    if (!created || !record || record.deliveryState !== 'pending') return;
    const deliver = () => deliverOwnerAlert(store, resendSender(), record.id, config).then(() => undefined);
    try {
      after(deliver);
    } catch {
      // Outside a request scope (scripts/tests): deliver inline. The retry job covers any failure.
      await deliver();
    }
  } catch (error) {
    console.error('TA14_OWNER_ALERT_RECORD_FAILED', { alertKey: alert.alertKey, alertType: alert.alertType, message: error instanceof Error ? error.message : String(error) });
  }
}
