import { NextRequest, NextResponse } from 'next/server';
import { deliverPendingOwnerAlerts } from '@/lib/owner-alerts/service';
import { ownerAlertConfig, resendSender, supabaseOwnerAlertStore } from '@/lib/owner-alerts/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/** Retry job for owner alerts (Vercel cron). Sends pending alerts and retries failed ones after a cooldown. */
function authorized(request: NextRequest): boolean {
  const secrets = [process.env.TA14_OWNER_ALERT_CRON_SECRET?.trim(), process.env.CRON_SECRET?.trim()].filter(Boolean) as string[];
  if (!secrets.length) return false;
  const bearer = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '').trim();
  return Boolean(bearer && secrets.includes(bearer));
}

async function run(request: NextRequest) {
  if (!authorized(request)) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  try {
    const outcomes = await deliverPendingOwnerAlerts(supabaseOwnerAlertStore(), resendSender(), ownerAlertConfig());
    const count = (o: string) => outcomes.filter((x) => x.outcome === o).length;
    return NextResponse.json(
      { ok: true, attempted: outcomes.length, delivered: count('delivered'), failed: count('failed'), skipped: count('skipped'), outcomes },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch (error) {
    console.error('TA14_OWNER_ALERT_RETRY_JOB_FAILED', error);
    return NextResponse.json({ error: 'OWNER_ALERT_RETRY_FAILED' }, { status: 500 });
  }
}

export const GET = run;
export const POST = run;
