import { createHash, timingSafeEqual } from 'node:crypto';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Successor attempt. The original V1 / A1 execution remains preserved unchanged.
const EXECUTION_KEY = 'TA14-INSTITUTIONAL-ACCEPTANCE-SUCCESSOR-PRODUCTION-RUN-V2';
const RECORD_ID = 'TA14-ACCEPTANCE-PRODUCTION-SUCCESSOR-2026-08-27-A2';
const GOVERNANCE_REGISTRY_IDENTIFIER = 'TA-14-AIGR-000007';
const GOVERNANCE_NAME = 'TA-14 AI Governance Exchange Architecture';
const GOVERNANCE_VERSION = '1.0';
const EXECUTOR_PATH = '/api/acceptance/institutional-finding/executor';
const PRODUCTION_ORIGIN = 'https://www.ta14authority.org';

function env(name: string) {
  return process.env[name]?.trim() ?? '';
}

function digest(value: string) {
  return createHash('sha256').update(value, 'utf8').digest();
}

function constantTimeEqual(left: string, right: string) {
  return timingSafeEqual(digest(left), digest(right));
}

function cronAuthorized(request: Request) {
  const configured = env('CRON_SECRET');
  const authorization = request.headers.get('authorization')?.trim() ?? '';
  if (!configured || !authorization.startsWith('Bearer ')) return false;
  return constantTimeEqual(authorization.slice('Bearer '.length).trim(), configured);
}

function persistenceClient() {
  const url = env('NEXT_PUBLIC_SUPABASE_URL');
  const serviceRoleKey = env('SUPABASE_SERVICE_ROLE_KEY');
  if (!url || !serviceRoleKey) {
    throw new Error('Institutional acceptance trigger persistence is not configured.');
  }
  return createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

async function readiness() {
  const executorSecret = env('TA14_ACCEPTANCE_EXECUTOR_SECRET');
  const cronSecret = env('CRON_SECRET');
  const supabaseUrl = env('NEXT_PUBLIC_SUPABASE_URL');
  const serviceRoleKey = env('SUPABASE_SERVICE_ROLE_KEY');
  return {
    executorSecretConfigured: Boolean(executorSecret),
    cronSecretConfigured: Boolean(cronSecret),
    persistenceConfigured: Boolean(supabaseUrl && serviceRoleKey),
  };
}

export async function GET(request: Request) {
  if (!cronAuthorized(request)) {
    return NextResponse.json({ error: 'Authorized Vercel cron invocation required.' }, { status: 401 });
  }

  const prerequisites = await readiness();
  if (!prerequisites.executorSecretConfigured || !prerequisites.persistenceConfigured) {
    return NextResponse.json({
      schema: 'TA14-Institutional-Acceptance-One-Shot-Trigger-v1',
      executionPerformed: false,
      determination: 'INCOMPLETE',
      reason: 'Acceptance prerequisites are not configured; successor execution was not claimed.',
      prerequisites,
      deploymentCommit: process.env.VERCEL_GIT_COMMIT_SHA ?? null,
    }, { status: 503 });
  }

  const supabase = persistenceClient();

  // The insert is the irreversible successor-attempt lock. It occurs immediately
  // before execution. A duplicate means this successor attempt has already been
  // consumed, regardless of whether that attempt later passed, failed, or
  // ended incomplete. No rerun is permitted.
  const claimedAt = new Date().toISOString();
  const { error: claimError } = await supabase
    .from('ta14_institutional_acceptance_executions')
    .insert({
      execution_key: EXECUTION_KEY,
      fixture_record_id: RECORD_ID,
      state: 'CLAIMED',
      claimed_at: claimedAt,
      deployment_commit: process.env.VERCEL_GIT_COMMIT_SHA ?? null,
      trigger_identity: 'VERCEL_CRON',
    });

  if (claimError) {
    if (claimError.code === '23505') {
      const { data: existing } = await supabase
        .from('ta14_institutional_acceptance_executions')
        .select('execution_key,fixture_record_id,state,claimed_at,completed_at,deployment_commit,result_http_status,result_determination')
        .eq('execution_key', EXECUTION_KEY)
        .maybeSingle();
      return NextResponse.json({
        schema: 'TA14-Institutional-Acceptance-One-Shot-Trigger-v1',
        executionPerformed: false,
        successorExecutionAlreadyConsumed: true,
        existing: existing ?? null,
        boundary: 'The successor-attempt lock already exists. The acceptance fixture was not rerun.',
      }, { status: 409 });
    }

    return NextResponse.json({
      schema: 'TA14-Institutional-Acceptance-One-Shot-Trigger-v1',
      executionPerformed: false,
      determination: 'INCOMPLETE',
      reason: 'The durable successor-attempt lock could not be created. The acceptance fixture was not executed.',
      detail: claimError.message,
    }, { status: 503 });
  }

  const executorSecret = env('TA14_ACCEPTANCE_EXECUTOR_SECRET');
  // Do not inherit a deployment-specific Vercel hostname from the cron request.
  // The governed executor call crosses the canonical public production origin.
  const executorUrl = new URL(EXECUTOR_PATH, PRODUCTION_ORIGIN);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60_000);

  let resultHttpStatus: number | null = null;
  let resultBody: unknown = null;
  let resultDetermination = 'INCOMPLETE';
  let completionDetail: string | null = null;

  try {
    const response = await fetch(executorUrl, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-ta14-acceptance-executor': executorSecret,
        'x-ta14-acceptance-fixture': 'acceptance-only',
      },
      body: JSON.stringify({
        recordId: RECORD_ID,
        governanceRegistryIdentifier: GOVERNANCE_REGISTRY_IDENTIFIER,
        governanceName: GOVERNANCE_NAME,
        governanceVersion: GOVERNANCE_VERSION,
      }),
      cache: 'no-store',
      signal: controller.signal,
    });

    resultHttpStatus = response.status;
    resultBody = await response.json().catch(() => ({
      error: 'Executor returned a non-JSON response.',
    }));

    const body = resultBody as { technicalDetermination?: unknown; protocolDetermination?: unknown } | null;
    if (body?.technicalDetermination === 'PASS') resultDetermination = 'PASS';
    else if (body?.technicalDetermination === 'FAIL') resultDetermination = 'FAIL';
    else resultDetermination = 'INCOMPLETE';
  } catch (error) {
    completionDetail = error instanceof Error ? error.message : 'Unknown acceptance executor failure.';
    resultBody = { error: completionDetail };
    resultDetermination = 'INCOMPLETE';
  } finally {
    clearTimeout(timeout);
  }

  const completedAt = new Date().toISOString();
  const { error: preserveError } = await supabase
    .from('ta14_institutional_acceptance_executions')
    .update({
      state: 'COMPLETED',
      completed_at: completedAt,
      result_http_status: resultHttpStatus,
      result_determination: resultDetermination,
      result_body: resultBody,
      completion_detail: completionDetail,
    })
    .eq('execution_key', EXECUTION_KEY)
    .eq('state', 'CLAIMED');

  if (preserveError) {
    return NextResponse.json({
      schema: 'TA14-Institutional-Acceptance-One-Shot-Trigger-v1',
      executionPerformed: true,
      successorExecutionConsumed: true,
      determination: 'INCOMPLETE',
      preservationFailure: preserveError.message,
      observedExecutorStatus: resultHttpStatus,
      observedExecutorDetermination: resultDetermination,
      boundary: 'The successor acceptance fixture executed after the durable claim. The execution must not be rerun even though result preservation encountered an error.',
    }, { status: 500 });
  }

  return NextResponse.json({
    schema: 'TA14-Institutional-Acceptance-One-Shot-Trigger-v1',
    executionPerformed: true,
    successorExecutionConsumed: true,
    executionKey: EXECUTION_KEY,
    fixtureRecordId: RECORD_ID,
    claimedAt,
    completedAt,
    deploymentCommit: process.env.VERCEL_GIT_COMMIT_SHA ?? null,
    executorOrigin: PRODUCTION_ORIGIN,
    resultHttpStatus,
    resultDetermination,
    result: resultBody,
    boundary: 'This successor cron trigger executes one acceptance-only production fixture exactly once. It does not modify or rerun the preserved first production attempt.',
  });
}
