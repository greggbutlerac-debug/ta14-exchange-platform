import { NextRequest, NextResponse } from 'next/server';

import { createClient } from '@supabase/supabase-js';

type NotificationDeliveryRow = {
  id: string;
  notification_key: string;
  notification_type: string;
  priority: string;
  state: string;
  registry_identifier: string | null;
  governance_name: string;
  claimant_name: string | null;
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
  if (row.notification_type === 'governance_registration_exception') {
    return `TA-14 Registry — ACTION REQUIRED — ${row.governance_name}`;
  }

  if (row.notification_type === 'governance_review_requested') {
    return `TA-14 Registry — Review requested — ${row.governance_name}`;
  }

  return `TA-14 Registry — ${row.governance_name} registered`;
}

function notificationHeadline(row: NotificationDeliveryRow): string {
  if (row.notification_type === 'governance_registration_exception') {
    return 'Registration exception requires attention';
  }

  if (row.notification_type === 'governance_review_requested') {
    return 'Governance review requested';
  }

  return 'New governance registered';
}

function notificationIntro(row: NotificationDeliveryRow): string {
  if (row.notification_type === 'governance_registration_exception') {
    return 'A governance registration could not complete its governed automatic-registration pathway and requires Registry attention.';
  }

  if (row.notification_type === 'governance_review_requested') {
    return 'A governance submission has entered a review pathway and is waiting for Registry attention.';
  }

  return 'A governance registration completed automatically in the TA-14 AI Governance Exchange. No manual registration action is required unless the Registry Inbox separately marks the event as requiring attention.';
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

async function getUndeliveredNotifications(
  limit: number,
  cutoffAt: string | null,
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
      'governance_registered',
      'governance_review_requested',
      'governance_registration_exception',
    ])
    .order('occurred_at', { ascending: true })
    .limit(limit);

  if (cutoffAt) {
    query = query.gte('occurred_at', cutoffAt);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(
      `Unable to read Registry notifications: ${error.message}`,
    );
  }

  return (data ?? []) as unknown as NotificationDeliveryRow[];
}

function authorizeRequest(request: NextRequest): boolean {
  const ta14Secret = getEnv(
    'TA14_REGISTRY_NOTIFICATION_CRON_SECRET',
  );

  const vercelCronSecret = getEnv('CRON_SECRET');

  if (!ta14Secret && !vercelCronSecret) {
    return false;
  }

  const bearer = request.headers
    .get('authorization')
    ?.replace(/^Bearer\s+/i, '')
    .trim();

  const explicitSecret = request.headers
    .get('x-ta14-registry-notification-secret')
    ?.trim();

  const acceptedSecrets = new Set(
    [ta14Secret, vercelCronSecret].filter(Boolean),
  );

  return Boolean(
    (bearer && acceptedSecrets.has(bearer)) ||
      (explicitSecret &&
        acceptedSecrets.has(explicitSecret)),
  );
}

async function deliver(request: NextRequest) {
  if (!authorizeRequest(request)) {
    return NextResponse.json(
      { error: 'Unauthorized.' },
      { status: 401 },
    );
  }

  const recipients = parseReviewerEmails();

  if (recipients.length === 0) {
    return NextResponse.json(
      {
        error:
          'TA14_REGISTRY_REVIEWER_EMAILS is not configured.',
      },
      { status: 503 },
    );
  }

  try {
    await ensureDeliveryTable();

    const requestedLimit = Number(
      new URL(request.url).searchParams.get('limit') ?? '25',
    );

    const limit = Number.isFinite(requestedLimit)
      ? Math.min(100, Math.max(1, Math.trunc(requestedLimit)))
      : 25;

    const cutoffAt = getEmailDeliveryCutoff();

    const notifications =
      await getUndeliveredNotifications(
        limit,
        cutoffAt,
      );

    const results: DeliveryResult[] = [];

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

    return NextResponse.json({
      ok: true,
      inspectedNotifications: notifications.length,
      recipients: recipients.length,
      emailDeliveryCutoffAt: cutoffAt,
      delivered: results.filter((item) => item.delivered).length,
      skipped: results.filter((item) => item.skipped).length,
      failed: results.filter(
        (item) => !item.delivered && !item.skipped,
      ).length,
      results,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Registry notification delivery failed.',
      },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  return deliver(request);
}

export async function POST(request: NextRequest) {
  return deliver(request);
}
