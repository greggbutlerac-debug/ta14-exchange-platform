import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function configured(name: string) {
  return Boolean(process.env[name]?.trim());
}

export async function GET() {
  return NextResponse.json({
    schema: 'TA14-Institutional-Acceptance-Environment-Diagnostic-v1',
    cronSecretConfigured: configured('CRON_SECRET'),
    executorSecretConfigured: configured('TA14_ACCEPTANCE_EXECUTOR_SECRET'),
    supabaseUrlConfigured: configured('NEXT_PUBLIC_SUPABASE_URL'),
    supabaseServiceRoleConfigured: configured('SUPABASE_SERVICE_ROLE_KEY'),
    deploymentCommit: process.env.VERCEL_GIT_COMMIT_SHA ?? null,
    boundary: 'Configuration presence only. No secret values are returned and no acceptance execution is performed.',
  });
}
