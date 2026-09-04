import { NextRequest, NextResponse } from 'next/server';
import { createClient as createUserClient } from '@/lib/supabase/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function service() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('PROVENANCE_CONFIGURATION_MISSING');
  return createServiceClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

function clean(value: unknown, max = 5000) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

export async function GET() {
  try {
    const userClient = await createUserClient();
    const { data: { user } } = await userClient.auth.getUser();
    if (!user) return NextResponse.json({ error: 'AUTHENTICATION_REQUIRED' }, { status: 401 });
    const admin = service();
    const { data, error } = await admin.from('ta14_provenance_cases')
      .select('id,case_identifier,claimant_registry_identifier,claimant_governance_name,target_name,target_registry_identifier,target_is_registered,status,public_visibility,created_at,updated_at')
      .eq('owner_user_id', user.id).order('created_at', { ascending: false });
    if (error) throw error;
    return NextResponse.json({ cases: data ?? [] });
  } catch (error) {
    console.error('TA14_PROVENANCE_GET_ERROR', error);
    return NextResponse.json({ error: 'PROVENANCE_SERVICE_UNAVAILABLE' }, { status: 503 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userClient = await createUserClient();
    const { data: { user } } = await userClient.auth.getUser();
    if (!user) return NextResponse.json({ error: 'AUTHENTICATION_REQUIRED' }, { status: 401 });

    let body: any = {};
    try { body = await req.json(); } catch {}
    const claimantRegistryIdentifier = clean(body.claimantRegistryIdentifier, 180);
    const targetName = clean(body.targetName, 300);
    const targetRegistryIdentifier = clean(body.targetRegistryIdentifier, 180) || null;
    const targetContact = clean(body.targetContact, 500) || null;
    const concernSummary = clean(body.concernSummary, 12000);
    const disputedPropositions = clean(body.disputedPropositions, 12000) || null;
    const requestedResolution = clean(body.requestedResolution, 5000) || null;
    if (!claimantRegistryIdentifier || !targetName || !concernSummary) {
      return NextResponse.json({ error: 'CLAIMANT_TARGET_AND_CONCERN_REQUIRED' }, { status: 400 });
    }

    // Petitioner standing is resolved through the same authenticated Registry client
    // and Row Level Security boundary used by the account-scoped Registry workspace.
    // Do not bypass Registry ownership with the service role or assume a specific
    // ownership-column name in the Registry table.
    const { data: claimant, error: claimantError } = await userClient.from('ai_governance_registry_submissions')
      .select('id,governance_name,organization_name,registry_identifier,status')
      .eq('registry_identifier', claimantRegistryIdentifier).maybeSingle();
    if (claimantError) throw claimantError;
    const claimantStatus = String(claimant?.status ?? '').toLowerCase();
    if (!claimant || !['registered', 'published'].includes(claimantStatus)) {
      return NextResponse.json({
        error: 'REGISTERED_CLAIMANT_REQUIRED',
        boundary: 'Only an Exchange-registered architecture visible to the authenticated claimant through the Registry access boundary may initiate a provenance reconciliation case.'
      }, { status: 403 });
    }

    const admin = service();
    let targetRegistered = false;
    let targetArchitectureName = targetName;
    if (targetRegistryIdentifier) {
      const { data: target, error: targetError } = await admin.from('ai_governance_registry_submissions')
        .select('governance_name,status,registry_identifier').eq('registry_identifier', targetRegistryIdentifier).maybeSingle();
      if (targetError) throw targetError;
      if (target && ['registered', 'published'].includes(String(target.status).toLowerCase())) {
        targetRegistered = true;
        targetArchitectureName = target.governance_name || targetName;
      }
    }

    const { data: created, error: createError } = await admin.from('ta14_provenance_cases').insert({
      owner_user_id: user.id,
      claimant_registry_submission_id: claimant.id,
      claimant_registry_identifier: claimant.registry_identifier,
      claimant_governance_name: claimant.governance_name,
      target_name: targetArchitectureName,
      target_registry_identifier: targetRegistryIdentifier,
      target_is_registered: targetRegistered,
      target_contact: targetContact,
      concern_summary: concernSummary,
      disputed_propositions: disputedPropositions,
      requested_resolution: requestedResolution,
      status: 'EVIDENCE_GATHERING'
    }).select('id,case_identifier,status,created_at').single();
    if (createError) throw createError;

    const parties = [
      { case_id: created.id, party_role: 'CLAIMANT', organization_name: claimant.organization_name || claimant.governance_name, architecture_name: claimant.governance_name, registry_identifier: claimant.registry_identifier, registered_on_exchange: true, participation_status: 'PARTICIPATING' },
      { case_id: created.id, party_role: 'TARGET', organization_name: targetArchitectureName, architecture_name: targetArchitectureName, registry_identifier: targetRegistryIdentifier, registered_on_exchange: targetRegistered, contact_route: targetContact, participation_status: targetRegistered ? 'UNNOTIFIED' : 'EXTERNAL_ONLY' }
    ];
    const { error: partyError } = await admin.from('ta14_provenance_parties').insert(parties);
    if (partyError) throw partyError;
    await admin.from('ta14_provenance_events').insert({ case_id: created.id, event_type: 'CASE_OPENED', actor_label: claimant.governance_name, event_summary: 'Registered claimant opened a provenance reconciliation case. No adverse finding exists at intake.' });

    return NextResponse.json({
      case: created,
      targetStanding: targetRegistered ? 'EXCHANGE_REGISTERED' : 'EXTERNAL_ENTITY',
      boundary: 'Case opened for evidence gathering only. TA-14 has not contacted the target, accepted the accusation as true, or made an adverse finding. Exposure, overlap, and timing do not establish derivation.'
    }, { status: 201 });
  } catch (error) {
    console.error('TA14_PROVENANCE_POST_ERROR', error);
    return NextResponse.json({ error: 'PROVENANCE_SERVICE_UNAVAILABLE' }, { status: 503 });
  }
}
