import { NextRequest, NextResponse } from 'next/server';

import { createClient } from '@supabase/supabase-js';

type DeliverySummaryRow = {
  delivered_count: number | null;
  failed_count: number | null;
  unique_notifications_delivered: number | null;
  latest_attempt_at: string | null;
  latest_delivery_at: string | null;
};

function getEnv(name: string): string {
  return process.env[name]?.trim() ?? '';
}

function getSupabaseAdmin() {
  const supabaseUrl = getEnv('NEXT_PUBLIC_SUPABASE_URL');
  const serviceRoleKey = getEnv('SUPABASE_SERVICE_ROLE_KEY');

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      'Registry delivery health is missing Supabase server configuration.',
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
    getEnv('TA14_REGISTRY_REVIEWER_EMAILS')
      .split(',')
      .map((value) => value.trim().toLowerCase())
      .filter(Boolean),
  );
}

async function getAuthenticatedEmail(
  request: NextRequest,
): Promise<string | null> {
  const supabaseUrl = getEnv('NEXT_PUBLIC_SUPABASE_URL');
  const anonKey = getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY');

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
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
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

async function authorizeReviewer(
  request: NextRequest,
): Promise<boolean> {
  const reviewerEmails = parseReviewerEmails();

  if (reviewerEmails.size === 0) {
    return false;
  }

  const authenticatedEmail =
    await getAuthenticatedEmail(request);

  if (!authenticatedEmail) {
    return false;
  }

  return reviewerEmails.has(authenticatedEmail);
}

function normalizeCount(value: unknown): number {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return Math.max(0, Math.trunc(value));
  }

  if (typeof value === 'string') {
    const parsed = Number(value);

    if (Number.isFinite(parsed)) {
      return Math.max(0, Math.trunc(parsed));
    }
  }

  return 0;
}

export async function GET(request: NextRequest) {
  try {
    const authorized = await authorizeReviewer(request);

    if (!authorized) {
      return NextResponse.json(
        { error: 'Unauthorized.' },
        { status: 401 },
      );
    }

    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase.rpc(
      'ta14_registry_admin_notification_delivery_summary_v1',
    );

    if (error) {
      return NextResponse.json(
        {
          error:
            'Unable to read Registry notification delivery health.',
          detail: error.message,
        },
        { status: 500 },
      );
    }

    const row = (
      Array.isArray(data) ? data[0] : data
    ) as DeliverySummaryRow | null;

    const deliveredCount = normalizeCount(
      row?.delivered_count,
    );

    const failedCount = normalizeCount(
      row?.failed_count,
    );

    const uniqueNotificationsDelivered = normalizeCount(
      row?.unique_notifications_delivered,
    );

    const health =
      failedCount > 0
        ? 'attention'
        : deliveredCount > 0
          ? 'healthy'
          : 'idle';

    return NextResponse.json(
      {
        ok: true,
        health,
        summary: {
          deliveredCount,
          failedCount,
          uniqueNotificationsDelivered,
          latestAttemptAt:
            row?.latest_attempt_at ?? null,
          latestDeliveryAt:
            row?.latest_delivery_at ?? null,
        },
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
            : 'Registry delivery health failed.',
      },
      { status: 500 },
    );
  }
}
