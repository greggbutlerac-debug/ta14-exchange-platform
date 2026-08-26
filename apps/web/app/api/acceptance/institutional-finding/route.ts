import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { runInstitutionalFindingAcceptanceControls } from '@/lib/ai-governance/institutional-examination-finding.acceptance';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    return NextResponse.json(
      { error: 'Authenticated institutional session required.' },
      { status: 401 },
    );
  }

  const controls = await runInstitutionalFindingAcceptanceControls();
  const passed = controls.filter((control) => control.pass).length;
  const failed = controls.length - passed;

  return NextResponse.json({
    schema: 'TA14-Institutional-Finding-Acceptance-v1',
    executedAt: new Date().toISOString(),
    operatorUserId: data.user.id,
    counts: { total: controls.length, passed, failed },
    determination: failed === 0 ? 'PASS' : 'FAIL',
    controls,
    boundary: 'This result exercises N02, N03, P04, P05, and the cryptographic portion of N04 only. It does not establish production persistence, chronology, public-projection, or admission-endpoint controls.',
  });
}
