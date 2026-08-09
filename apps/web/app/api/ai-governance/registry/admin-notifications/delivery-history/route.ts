import { NextRequest, NextResponse } from 'next/server';

import { createClient } from '@supabase/supabase-js';

type DeliveryHistoryRow = {
  id: string;
  notification_id: string;
  channel: string;
  provider: string;
  recipient: string;
  delivery_state: 'delivered' | 'failed';
  provider_message_id: string | null;
  failure_reason: string | null;
  attempted_at: string;
  delivered_at: string | null;
  created_at: string;
};

type RegistryAdminNotificationRow = {
  id: string;
  notification_type: string;
  registry_identifier: string | null;
  governance_name: string;
  occurred_at: string;
};

function env(name: string): string {
  return process.env[name]?.trim() ?? '';
}

function createAdminClient() {
  const supabaseUrl = env('NEXT_PUBLIC_SUPABASE_URL');
  const serviceRoleKey = env('SUPABASE_SERVICE_ROLE_KEY');

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      'Registry delivery history is missing Supabase server configuration.',
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

function parseReviewerEmails(): Set<string> {
  return new Set(
    env('TA14_REGISTRY_REVIEWER_EMAILS')
      .split(',')
      .map((value) => value.trim().toLowerCase())
      .filter(Boolean),
  );
}

async function getBearerUserEmail(
  request: NextRequest,
): Promise<string | null> {
  const supabaseUrl = env('NEXT_PUBLIC_SUPABASE_URL');
  const anonKey = env('NEXT_PUBLIC_SUPABASE_ANON_KEY');

  if (!supabaseUrl || !anonKey) {
    return null;
  }

  const authorization = request.headers.get('authorization');

  if (!authorization?.toLowerCase().startsWith('bearer ')) {
    return null;
  }

  const accessToken = authorization
    .replace(/^Bearer\s+/i, '')
    .trim();

  if (!accessToken) {
    return null;
  }

  const supabase = createClient(supabaseUrl, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(accessToken);

  if (error || !user?.email) {
    return null;
  }

  return user.email.trim().toLowerCase();
}

async function getCookieUserEmail(): Promise<string | null> {
  const { cookies } = await import('next/headers');

  const cookieStore = await cookies();

  const possibleAccessTokenNames = [
    'sb-access-token',
    'supabase-auth-token',
  ];

  for (const name of possibleAccessTokenNames) {
    const token = cookieStore.get(name)?.value?.trim();

    if (!token) {
      continue;
    }

    const supabaseUrl = env('NEXT_PUBLIC_SUPABASE_URL');
    const anonKey = env('NEXT_PUBLIC_SUPABASE_ANON_KEY');

    if (!supabaseUrl || !anonKey) {
      return null;
    }

    const supabase = createClient(supabaseUrl, anonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (!error && user?.email) {
      return user.email.trim().toLowerCase();
    }
  }

  return null;
}

async function authorizeReviewer(
  request: NextRequest,
): Promise<string | null> {
  const reviewers = parseReviewerEmails();

  if (reviewers.size === 0) {
    return null;
  }

  const email =
    (await getBearerUserEmail(request)) ??
    (await getCookieUserEmail());

  if (!email || !reviewers.has(email)) {
    return null;
  }

  return email;
}

function readNotificationId(request: NextRequest): string | null {
  const raw = request.nextUrl.searchParams
    .get('notificationId')
    ?.trim();

  if (!raw) {
    return null;
  }

  return raw;
}

function readLimit(request: NextRequest): number {
  const raw = request.nextUrl.searchParams.get('limit');

  if (!raw) {
    return 25;
  }

  const parsed = Number(raw);

  if (!Number.isFinite(parsed)) {
    return 25;
  }

  return Math.min(100, Math.max(1, Math.trunc(parsed)));
}

export async function GET(request: NextRequest) {
  try {
    const administratorEmail =
      await authorizeReviewer(request);

    if (!administratorEmail) {
      return NextResponse.json(
        {
          error:
            'Registry delivery history is restricted to authorized Registry reviewers.',
        },
        {
          status: 401,
          headers: {
            'Cache-Control': 'no-store',
          },
        },
      );
    }

    const notificationId = readNotificationId(request);

    if (!notificationId) {
      return NextResponse.json(
        {
          error: 'notificationId is required.',
        },
        {
          status: 400,
          headers: {
            'Cache-Control': 'no-store',
          },
        },
      );
    }

    const limit = readLimit(request);
    const supabase = createAdminClient();

    const {
      data: notification,
      error: notificationError,
    } = await supabase
      .from('ta14_registry_admin_notifications')
      .select(
        [
          'id',
          'notification_type',
          'registry_identifier',
          'governance_name',
          'occurred_at',
        ].join(','),
      )
      .eq('id', notificationId)
      .maybeSingle();

    if (notificationError) {
      return NextResponse.json(
        {
          error:
            'The Registry notification could not be verified.',
          detail: notificationError.message,
        },
        {
          status: 500,
          headers: {
            'Cache-Control': 'no-store',
          },
        },
      );
    }

    if (!notification) {
      return NextResponse.json(
        {
          error: 'Registry notification not found.',
        },
        {
          status: 404,
          headers: {
            'Cache-Control': 'no-store',
          },
        },
      );
    }

    const verifiedNotification =
      notification as unknown as RegistryAdminNotificationRow;

    const { data, error } = await supabase.rpc(
      'ta14_registry_admin_notification_delivery_history_v1',
      {
        p_notification_id: notificationId,
        p_limit: limit,
      },
    );

    if (error) {
      return NextResponse.json(
        {
          error:
            'Unable to read notification delivery history.',
          detail: error.message,
        },
        {
          status: 500,
          headers: {
            'Cache-Control': 'no-store',
          },
        },
      );
    }

    const history =
      (data ?? []) as unknown as DeliveryHistoryRow[];

    const deliveredAttempts = history.filter(
      (row) => row.delivery_state === 'delivered',
    );

    const failedAttempts = history.filter(
      (row) => row.delivery_state === 'failed',
    );

    const recipientsDelivered = Array.from(
      new Set(
        deliveredAttempts.map((row) =>
          row.recipient.trim().toLowerCase(),
        ),
      ),
    );

    const status =
      deliveredAttempts.length > 0
        ? 'delivered'
        : failedAttempts.length > 0
          ? 'failed'
          : 'not_attempted';

    return NextResponse.json(
      {
        ok: true,
        administrator: {
          email: administratorEmail,
        },
        notification: {
          id: verifiedNotification.id,
          notificationType: verifiedNotification.notification_type,
          registryIdentifier:
            verifiedNotification.registry_identifier ?? null,
          governanceName: verifiedNotification.governance_name,
          occurredAt: verifiedNotification.occurred_at,
        },
        delivery: {
          status,
          deliveredCount: deliveredAttempts.length,
          failedCount: failedAttempts.length,
          recipientsDelivered,
          latestAttemptAt:
            history[0]?.attempted_at ?? null,
          latestDeliveredAt:
            deliveredAttempts[0]?.delivered_at ?? null,
        },
        history,
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store',
        },
      },
    );
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Registry delivery history failed.',
      },
      {
        status: 500,
        headers: {
          'Cache-Control': 'no-store',
        },
      },
    );
  }
}
