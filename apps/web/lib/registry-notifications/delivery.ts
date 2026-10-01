/**
 * TA-14 Registry administrative notification delivery (Resend).
 *
 * Moved from app/api/ai-governance/registry/admin-notifications/deliver/route.ts so the same delivery can
 * run immediately after a registration is committed as well as from the 5-minute cron.
 */
import { createClient } from '@supabase/supabase-js';

import { isOperatorIdentity } from '@/lib/owner-alerts/server';

type NotificationDeliveryRow = {
  id: string;
  notification_key: string;
  notification_type: string;
  priority: string;
  state: string;
  submission_id: string | null;
  registry_identifier: string | null;
  governance_name: string;
  claimant_name: string | null;
  contact_email?: string | null;
  organization_name: string | null;
  requested_review_pathway: string | null;
  title: string;
  message: string;
  occurred_at: string;
  event_payload: Record<string, unknown> | null;
};

type DeliveryResult = {
  notificationId: string;
  registryIdentifier: string | null;
  governanceName: string;
  delivered: boolean;
  skipped: boolean;
  reason?: string;
};

const DELIVERY_PROVIDER = 'resend';
const DELIVERY_CHANNEL = 'email';

function getEnv(name: string): string {
  return process.env[name]?.trim() ?? '';
}

function getServiceClient() {
  const supabaseUrl = getEnv('NEXT_PUBLIC_SUPABASE_URL');
  const serviceRoleKey = getEnv('SUPABASE_SERVICE_ROLE_KEY');

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      'Registry notification delivery is missing Supabase server configuration.',
    );
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

function parseReviewerEmails(): string[] {
  return getEnv('TA14_REGISTRY_REVIEWER_EMAILS')
    .split(',')
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
}

function getEmailDeliveryCutoff(): string | null {
  const raw = getEnv(
    'TA14_REGISTRY_NOTIFICATION_EMAIL_CUTOFF_AT',
  );

  if (!raw) {
    return null;
  }

  const parsed = new Date(raw);

  if (Number.isNaN(parsed.getTime())) {
    throw new Error(
      'TA14_REGISTRY_NOTIFICATION_EMAIL_CUTOFF_AT must be a valid ISO-8601 timestamp.',
    );
  }

  return parsed.toISOString();
}

function getRetryCooldownMinutes(): number {
  const raw = getEnv(
    'TA14_REGISTRY_NOTIFICATION_RETRY_MINUTES',
  );

  if (!raw) {
    return 30;
  }

  const parsed = Number(raw);

  if (!Number.isFinite(parsed)) {
    return 30;
  }

  return Math.min(
    24 * 60,
    Math.max(5, Math.trunc(parsed)),
  );
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function buildRecordUrl(row: NotificationDeliveryRow): string {
  const baseUrl =
    getEnv('TA14_PUBLIC_APP_URL') ||
    getEnv('NEXT_PUBLIC_SITE_URL') ||
    'https://ta14authority.org';

  const normalizedBase = baseUrl.replace(/\/+$/, '');

  if (row.registry_identifier) {
    return `${normalizedBase}/workspace/ai-governance/registry/inbox?registry=${encodeURIComponent(
      row.registry_identifier,
    )}`;
  }

  return `${normalizedBase}/workspace/ai-governance/registry/inbox`;
}

function notificationSubject(row: NotificationDeliveryRow): string {
  if (row.notification_type === 'governance_submission_received') {
    return `TA-14 Registry — Submission received — ${row.governance_name}`;
  }

  if (row.notification_type === 'governance_registration_failed') {
    return `TA-14 Registry — REGISTRATION FAILED — ${row.governance_name}`;
  }

  if (row.notification_type === 'governance_registration_exception') {
    return `TA-14 Registry — ACTION REQUIRED — ${row.governance_name}`;
  }

  if (row.notification_type === 'governance_review_requested') {
    return `TA-14 Registry — Review requested — ${row.governance_name}`;
  }

  return `[TA-14] GOVERNANCE REGISTERED — ACTION REQUIRED — ${row.governance_name}`;
}

function notificationHeadline(row: NotificationDeliveryRow): string {
  if (row.notification_type === 'governance_submission_received') {
    return 'New Governance Entity Registration submitted';
  }

  if (row.notification_type === 'governance_registration_failed') {
    return 'Governance registration failed';
  }

  if (row.notification_type === 'governance_registration_exception') {
    return 'Registration exception requires attention';
  }

  if (row.notification_type === 'governance_review_requested') {
    return 'Governance review requested';
  }

  return 'New governance registered';
}

function notificationIntro(row: NotificationDeliveryRow): string {
  if (row.notification_type === 'governance_submission_received') {
    return 'A participant completed and submitted a Governance Entity Registration record. This is the immediate administrative-awareness event; registration completion and public publication remain separate governed states.';
  }

  if (row.notification_type === 'governance_registration_failed') {
    return 'A participant encountered a recorded failure while attempting Governance Entity Registration. The failure has been preserved as an administrative-awareness event and requires Registry attention.';
  }

  if (row.notification_type === 'governance_registration_exception') {
    return 'A governance registration could not complete its governed automatic-registration pathway and requires Registry attention.';
  }

  if (row.notification_type === 'governance_review_requested') {
    return 'A governance submission has entered a review pathway and is waiting for Registry attention.';
  }

  return 'A governance registration was committed in the TA-14 AI Governance Exchange. ACTION: review the record in the Registry Inbox and contact the registrant to arrange the $0 Founding Demonstration that every registered governance receives. Registration itself requires no approval step.';
}

function buildEmailHtml(row: NotificationDeliveryRow): string {
  const recordUrl = buildRecordUrl(row);
  const identifier =
    row.registry_identifier ?? 'Identifier pending';
  const claimant = row.claimant_name ?? 'Not specified';
  const organization =
    row.organization_name ?? 'Not specified';
  const pathway =
    row.requested_review_pathway ?? 'Not specified';

  return `
<!doctype html>
<html>
  <body style="margin:0;background:#07101f;color:#edf4ff;font-family:Arial,Helvetica,sans-serif;">
    <div style="max-width:720px;margin:0 auto;padding:32px 20px;">
      <div style="border:1px solid rgba(255,255,255,.16);border-radius:22px;background:#0d1729;padding:28px;">
        <div style="font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#9fb1c9;">
          TA-14 AI Governance Exchange
        </div>

        <h1 style="margin:12px 0 8px;font-size:26px;line-height:1.2;color:#ffffff;">
          ${escapeHtml(notificationHeadline(row))}
        </h1>

        <p style="margin:0 0 24px;color:#b9c8da;line-height:1.65;">
          ${escapeHtml(notificationIntro(row))}
        </p>

        <div style="border:1px solid rgba(255,255,255,.1);border-radius:16px;background:#091321;padding:18px;">
          <div style="margin-bottom:12px;">
            <strong style="color:#ffffff;">Governance:</strong>
            ${escapeHtml(row.governance_name)}
          </div>
          <div style="margin-bottom:12px;">
            <strong style="color:#ffffff;">Identifier:</strong>
            ${escapeHtml(identifier)}
          </div>
          <div style="margin-bottom:12px;">
            <strong style="color:#ffffff;">Claimant:</strong>
            ${escapeHtml(claimant)}
          </div>
          <div style="margin-bottom:12px;">
            <strong style="color:#ffffff;">Organization:</strong>
            ${escapeHtml(organization)}
          </div>
          <div style="margin-bottom:12px;">
            <strong style="color:#ffffff;">Contact email:</strong>
            ${escapeHtml(row.contact_email ?? 'Not available')}
          </div>
          <div style="margin-bottom:12px;">
            <strong style="color:#ffffff;">Event time:</strong>
            ${escapeHtml(row.occurred_at)}
          </div>
          <div>
            <strong style="color:#ffffff;">Pathway:</strong>
            ${escapeHtml(pathway)}
          </div>
        </div>

        <div style="margin-top:24px;">
          <a
            href="${escapeHtml(recordUrl)}"
            style="display:inline-block;border-radius:12px;background:#edf4ff;color:#07101f;text-decoration:none;font-weight:700;padding:12px 18px;"
          >
            Open Registry Inbox
          </a>
        </div>

        <p style="margin:24px 0 0;font-size:12px;line-height:1.6;color:#8193aa;">
          Registration records an attributable governance identity and declared information.
          It is not certification, endorsement, technical validation, legal approval,
          regulatory approval, ownership adjudication, or proof of performance.
        </p>
      </div>
    </div>
  </body>
</html>
  `.trim();
}

async function ensureDeliveryTable() {
  const supabase = getServiceClient();

  const { error } = await supabase
    .from('ta14_registry_admin_notification_deliveries')
    .select('id')
    .limit(1);

  if (error) {
    throw new Error(
      `Registry notification delivery table is unavailable: ${error.message}`,
    );
  }
}

async function alreadyDelivered(
  notificationId: string,
  recipient: string,
): Promise<boolean> {
  const supabase = getServiceClient();

  const { data, error } = await supabase
    .from('ta14_registry_admin_notification_deliveries')
    .select('id')
    .eq('notification_id', notificationId)
    .eq('channel', DELIVERY_CHANNEL)
    .eq('recipient', recipient)
    .eq('delivery_state', 'delivered')
    .maybeSingle();

  if (error) {
    throw new Error(
      `Unable to inspect prior notification delivery: ${error.message}`,
    );
  }

  return Boolean(data?.id);
}

async function recentlyFailed(
  notificationId: string,
  recipient: string,
  cooldownMinutes: number,
): Promise<boolean> {
  const supabase = getServiceClient();

  const cutoff = new Date(
    Date.now() - cooldownMinutes * 60 * 1000,
  ).toISOString();

  const { data, error } = await supabase
    .from('ta14_registry_admin_notification_deliveries')
    .select('id,attempted_at')
    .eq('notification_id', notificationId)
    .eq('channel', DELIVERY_CHANNEL)
    .eq('recipient', recipient)
    .eq('delivery_state', 'failed')
    .gte('attempted_at', cutoff)
    .order('attempted_at', { ascending: false })
    .limit(1);

  if (error) {
    throw new Error(
      `Unable to inspect recent notification delivery failures: ${error.message}`,
    );
  }

  return Array.isArray(data) && data.length > 0;
}


async function recordDelivery(args: {
  notificationId: string;
  recipient: string;
  deliveryState: 'delivered' | 'failed';
  providerMessageId?: string | null;
  failureReason?: string | null;
}) {
  const supabase = getServiceClient();

  const { error } = await supabase
    .from('ta14_registry_admin_notification_deliveries')
    .insert({
      notification_id: args.notificationId,
      channel: DELIVERY_CHANNEL,
      provider: DELIVERY_PROVIDER,
      recipient: args.recipient,
      delivery_state: args.deliveryState,
      provider_message_id: args.providerMessageId ?? null,
      failure_reason: args.failureReason ?? null,
      attempted_at: new Date().toISOString(),
      delivered_at:
        args.deliveryState === 'delivered'
          ? new Date().toISOString()
          : null,
    });

  if (error) {
    if (args.deliveryState === 'delivered' && error.code === '23505') {
      return; // already recorded as delivered by a concurrent deliverer
    }
    throw new Error(
      `Unable to preserve notification delivery record: ${error.message}`,
    );
  }
}

async function sendWithResend(
  row: NotificationDeliveryRow,
  recipient: string,
) {
  const apiKey = getEnv('RESEND_API_KEY');
  const fromAddress =
    getEnv('TA14_REGISTRY_NOTIFICATION_FROM') ||
    'TA-14 Registry <registry@ta14authority.org>';

  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not configured.');
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      // Same notification + recipient → Resend sends at most once, even if two deliverers race.
      'Idempotency-Key': `ta14-registry-notification:${row.id}:${recipient}`.slice(0, 256),
    },
    body: JSON.stringify({
      from: fromAddress,
      to: [recipient],
      subject: notificationSubject(row),
      html: buildEmailHtml(row),
    }),
  });

  const payload = (await response.json().catch(() => null)) as
    | { id?: string; message?: string; name?: string }
    | null;

  if (!response.ok) {
    throw new Error(
      payload?.message ||
        payload?.name ||
        `Resend returned HTTP ${response.status}.`,
    );
  }

  return payload?.id ?? null;
}

function shouldDeliverNotification(
  row: NotificationDeliveryRow,
): boolean {
  /*
   * Completed registration is a durable awareness event and remains eligible
   * for external delivery even if its Inbox state was acknowledged quickly.
   *
   * Review requests and registration exceptions represent current attention
   * conditions. Once resolved in the Administration Inbox, they should not
   * generate a stale action email afterward.
   */
  if (
    row.notification_type === 'governance_registered' ||
    row.notification_type === 'governance_submission_received' ||
    row.notification_type === 'governance_registration_failed'
  ) {
    return true;
  }

  return row.state !== 'resolved';
}

async function getUndeliveredNotifications(
  limit: number,
  cutoffAt: string | null,
  submissionId: string | null = null,
): Promise<NotificationDeliveryRow[]> {
  const supabase = getServiceClient();

  let query = supabase
    .from('ta14_registry_admin_notifications')
    .select(
      [
        'id',
        'notification_key',
        'notification_type',
        'priority',
        'state',
        'submission_id',
        'registry_identifier',
        'governance_name',
        'claimant_name',
        'organization_name',
        'requested_review_pathway',
        'title',
        'message',
        'occurred_at',
        'event_payload',
      ].join(','),
    )
    .in('notification_type', [
      'governance_submission_received',
      'governance_registration_failed',
      'governance_registered',
      'governance_review_requested',
      'governance_registration_exception',
    ])
    .order('occurred_at', { ascending: false })
    /*
     * Read a bounded candidate window larger than the requested delivery
     * batch. Successful delivery is preserved in a separate audit table, so
     * limiting the notification query to exactly `limit` can otherwise let
     * already-delivered historical rows permanently starve newer undelivered
     * notifications.
     */
    .limit(Math.min(Math.max(limit * 10, 100), 1000));

  if (cutoffAt) {
    query = query.gte('occurred_at', cutoffAt);
  }

  if (submissionId) {
    query = query.eq('submission_id', submissionId);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(
      `Unable to read Registry notifications: ${error.message}`,
    );
  }

  return (
    (data ?? []) as unknown as NotificationDeliveryRow[]
  )
    .filter(shouldDeliverNotification)
    .slice(0, limit);
}

/**
 * Adds the registrant's contact email to each notification and removes registrations made by the
 * owner/operators (test or admin registrations), which must not produce an owner alert.
 */
async function withSubmitterContext(
  rows: NotificationDeliveryRow[],
  results: DeliveryResult[],
): Promise<NotificationDeliveryRow[]> {
  const ids = [...new Set(rows.map((row) => row.submission_id).filter(Boolean))] as string[];
  if (!ids.length) return rows;

  const { data, error } = await getServiceClient()
    .from('ai_governance_registry_submissions')
    .select('id,contact_email,owner_user_id')
    .in('id', ids);

  if (error) {
    // Context is best-effort; the alert itself must still go out.
    console.error('TA14_REGISTRY_NOTIFICATION_CONTEXT_FAILED', error.message);
    return rows;
  }

  const byId = new Map(
    (data ?? []).map((s: { id: string; contact_email: string | null; owner_user_id: string | null }) => [s.id, s]),
  );

  return rows.filter((row) => {
    const submission = row.submission_id ? byId.get(row.submission_id) : undefined;
    row.contact_email = submission?.contact_email ?? null;
    if (submission && isOperatorIdentity({ userId: submission.owner_user_id, email: submission.contact_email })) {
      results.push({
        notificationId: row.id,
        registryIdentifier: row.registry_identifier,
        governanceName: row.governance_name,
        delivered: false,
        skipped: true,
        reason: 'Operator/test registration: no owner alert is sent.',
      });
      return false;
    }
    return true;
  });
}

export type RegistryDeliveryRun =
  | { ok: true; body: Record<string, unknown> }
  | { ok: false; status: number; error: string };

/**
 * Sends undelivered Registry notifications. Used by the cron route (all notifications) and right after a
 * registration is committed (one submission). Safe to run concurrently: the per-recipient delivery
 * ledger, its unique success index and the Resend idempotency key prevent duplicate emails.
 */
export async function runRegistryNotificationDelivery(options: {
  limit: number;
  submissionId?: string | null;
}): Promise<RegistryDeliveryRun> {
  const recipients = parseReviewerEmails();

  if (recipients.length === 0) {
    return { ok: false, status: 503, error: 'TA14_REGISTRY_REVIEWER_EMAILS is not configured.' };
  }

  try {
    await ensureDeliveryTable();

    const limit = options.limit;

    const cutoffAt = getEmailDeliveryCutoff();
    const retryCooldownMinutes =
      getRetryCooldownMinutes();

    const candidates =
      await getUndeliveredNotifications(
        limit,
        cutoffAt,
        options.submissionId ?? null,
      );

    const results: DeliveryResult[] = [];
    const notifications = await withSubmitterContext(candidates, results);

    for (const notification of notifications) {
      for (const recipient of recipients) {
        const wasDelivered = await alreadyDelivered(
          notification.id,
          recipient,
        );

        if (wasDelivered) {
          results.push({
            notificationId: notification.id,
            registryIdentifier:
              notification.registry_identifier,
            governanceName: notification.governance_name,
            delivered: false,
            skipped: true,
            reason: `Already delivered to ${recipient}.`,
          });

          continue;
        }

        const failedRecently = await recentlyFailed(
          notification.id,
          recipient,
          retryCooldownMinutes,
        );

        if (failedRecently) {
          results.push({
            notificationId: notification.id,
            registryIdentifier:
              notification.registry_identifier,
            governanceName: notification.governance_name,
            delivered: false,
            skipped: true,
            reason:
              `Recent failed attempt is inside the ${retryCooldownMinutes}-minute retry cooldown for ${recipient}.`,
          });

          continue;
        }

        try {
          const providerMessageId = await sendWithResend(
            notification,
            recipient,
          );

          await recordDelivery({
            notificationId: notification.id,
            recipient,
            deliveryState: 'delivered',
            providerMessageId,
          });

          results.push({
            notificationId: notification.id,
            registryIdentifier:
              notification.registry_identifier,
            governanceName: notification.governance_name,
            delivered: true,
            skipped: false,
          });
        } catch (error) {
          const reason =
            error instanceof Error
              ? error.message
              : 'Unknown delivery failure.';

          await recordDelivery({
            notificationId: notification.id,
            recipient,
            deliveryState: 'failed',
            failureReason: reason,
          });

          results.push({
            notificationId: notification.id,
            registryIdentifier:
              notification.registry_identifier,
            governanceName: notification.governance_name,
            delivered: false,
            skipped: false,
            reason,
          });
        }
      }
    }

    return { ok: true, body: {
      ok: true,
      inspectedNotifications: candidates.length,
      recipients: recipients.length,
      emailDeliveryCutoffAt: cutoffAt,
      retryCooldownMinutes,
      delivered: results.filter((item) => item.delivered).length,
      skipped: results.filter((item) => item.skipped).length,
      failed: results.filter(
        (item) => !item.delivered && !item.skipped,
      ).length,
      results,
    } };
  } catch (error) {
    return {
      ok: false,
      status: 500,
      error: error instanceof Error ? error.message : 'Registry notification delivery failed.',
    };
  }
}

/**
 * Immediate, server-side delivery for a registration that has just been committed. Scheduled after the
 * response so it never delays or fails the registration; the 5-minute cron remains the retry path.
 */
export async function deliverRegistrationNotificationsNow(submissionId: string): Promise<void> {
  try {
    const run = await runRegistryNotificationDelivery({ limit: 10, submissionId });
    if (!run.ok) console.error('TA14_REGISTRY_IMMEDIATE_NOTIFICATION_FAILED', { submissionId, status: run.status, error: run.error });
  } catch (error) {
    console.error('TA14_REGISTRY_IMMEDIATE_NOTIFICATION_FAILED', { submissionId, message: error instanceof Error ? error.message : String(error) });
  }
}

