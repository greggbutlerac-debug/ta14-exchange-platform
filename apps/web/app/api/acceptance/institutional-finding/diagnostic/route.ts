import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function value(name: string) {
  return process.env[name]?.trim() ?? '';
}

function configured(name: string) {
  return Boolean(value(name));
}

export async function GET() {
  const supabaseUrl = value('NEXT_PUBLIC_SUPABASE_URL');
  const serviceRoleKey = value('SUPABASE_SERVICE_ROLE_KEY');

  let supabaseConnectivity: 'PASS' | 'FAIL' | 'NOT_CONFIGURED' = 'NOT_CONFIGURED';
  let supabaseConnectivityCode: string | null = null;
  let supabaseConnectivityDetail: string | null = null;

  if (supabaseUrl && serviceRoleKey) {
    try {
      const supabase = createClient(supabaseUrl, serviceRoleKey, {
        auth: { autoRefreshToken: false, persistSession: false },
      });
      const { error } = await supabase
        .from('ta14_institutional_acceptance_executions')
        .select('execution_key', { head: true, count: 'exact' });

      if (error) {
        supabaseConnectivity = 'FAIL';
        supabaseConnectivityCode = error.code ?? null;
        supabaseConnectivityDetail = error.message;
      } else {
        supabaseConnectivity = 'PASS';
      }
    } catch (error) {
      supabaseConnectivity = 'FAIL';
      supabaseConnectivityDetail = error instanceof Error ? error.message : 'Unknown Supabase connectivity failure.';
    }
  }

  return NextResponse.json({
    schema: 'TA14-Institutional-Acceptance-Environment-Diagnostic-v2',
    cronSecretConfigured: configured('CRON_SECRET'),
    executorSecretConfigured: configured('TA14_ACCEPTANCE_EXECUTOR_SECRET'),
    supabaseUrlConfigured: Boolean(supabaseUrl),
    supabaseServiceRoleConfigured: Boolean(serviceRoleKey),
    supabaseConnectivity,
    supabaseConnectivityCode,
    supabaseConnectivityDetail,
    deploymentCommit: process.env.VERCEL_GIT_COMMIT_SHA ?? null,
    boundary: 'Configuration presence and read-only Supabase connectivity only. No secret values are returned, no rows are inserted or changed, and no acceptance execution is performed.',
  });
}
