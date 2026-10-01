import { NextRequest, NextResponse } from 'next/server';

import { runRegistryNotificationDelivery } from '@/lib/registry-notifications/delivery';

function getEnv(name: string): string {
  return process.env[name]?.trim() ?? '';
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

  const requestedLimit = Number(
    new URL(request.url).searchParams.get('limit') ?? '25',
  );

  const limit = Number.isFinite(requestedLimit)
    ? Math.min(100, Math.max(1, Math.trunc(requestedLimit)))
    : 25;

  const run = await runRegistryNotificationDelivery({ limit });

  return run.ok
    ? NextResponse.json(run.body)
    : NextResponse.json({ error: run.error }, { status: run.status });
}

export async function GET(request: NextRequest) {
  return deliver(request);
}

export async function POST(request: NextRequest) {
  return deliver(request);
}
