import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { verifyCompleteGceaLifecycle } from '@/lib/governance-continuity-complete-lifecycle';

export const dynamic = 'force-dynamic';

async function ownerAuth() {
  const ownerId = process.env.TA14_REVENUE_OWNER_USER_ID?.trim();
  if (!ownerId) return null;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id === ownerId ? { user } : null;
}

export async function POST() {
  const owner = await ownerAuth();
  if (!owner) return NextResponse.json({ error: 'Not found.' }, { status: 404 });

  const now = new Date();
  const verificationId = `TA14-GCEA-LIFECYCLE-${now.toISOString().replace(/[-:.TZ]/g, '').slice(0, 14)}`;
  const verification = verifyCompleteGceaLifecycle(now);

  return NextResponse.json({
    ok: verification.status === 'PASS',
    gate: 'GCEA_COMPLETE_CANONICAL_LIFECYCLE_VERIFICATION',
    verification_id: verificationId,
    canonical_chain: ['Reality', 'Record', 'Continuity', 'Admissibility', 'Binding', 'Commit', 'Execution', 'Outcome'],
    verification,
    preservation: 'NOT_YET_DURABLY_PRESERVED',
    claim_boundary: 'Authenticated production execution of the complete lifecycle verifier only. This response does not by itself establish append-only durable evidence.',
  }, { status: verification.status === 'PASS' ? 200 : 409 });
}
