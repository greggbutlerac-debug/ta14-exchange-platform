import { NextResponse } from 'next/server';
import { createClient } from '../../../../../lib/supabase/server';
import { verifyTA14InstitutionalFindingSeal, type TA14SealedInstitutionalFinding } from '../../../../../lib/ai-governance/institutional-examination-finding';
import { createTA14InstitutionalFindingRecord } from '../../../../../lib/ai-governance/institutional-finding-record';
import { mapInstitutionalFindingToGovernedArtifact } from '../../../../../lib/ai-governance/institutional-finding-governed-artifact';

export const runtime = 'nodejs';

async function authenticatedClient() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  return { supabase, user: error ? null : data.user };
}

export async function GET(request: Request) {
  try {
    const { supabase, user } = await authenticatedClient();
    if (!user) return NextResponse.json({ error: 'Authenticated institutional session required.' }, { status: 401 });
    const artifactIdentifier = new URL(request.url).searchParams.get('artifactIdentifier')?.trim();
    if (!artifactIdentifier) return NextResponse.json({ error: 'artifactIdentifier is required.' }, { status: 400 });
    const { data: artifact, error } = await supabase.from('ta14_governed_artifact_records').select('*').eq('artifact_identifier', artifactIdentifier).eq('artifact_type', 'INSTITUTIONAL_EXAMINATION_FINDING').maybeSingle();
    if (error) return NextResponse.json({ error: 'Institutional finding retrieval failed.', detail: error.message }, { status: 500 });
    if (!artifact) return NextResponse.json({ error: 'Institutional finding record not found or not accessible.' }, { status: 404 });
    const { data: events, error: eventError } = await supabase.from('ta14_governed_artifact_events').select('event_key,event_type,event_at,title,summary,sequence_number,metadata').eq('artifact_record_id', artifact.id).order('sequence_number', { ascending: true });
    if (eventError) return NextResponse.json({ error: 'Institutional chronology retrieval failed.', detail: eventError.message }, { status: 500 });
    return NextResponse.json({ artifact, chronology: events ?? [] });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Institutional finding retrieval failed.' }, { status: 400 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as { recordId?: string; governanceRegistryIdentifier?: string; governanceName?: string; finding?: TA14SealedInstitutionalFinding; };
    if (!body.finding || !body.recordId || !body.governanceRegistryIdentifier || !body.governanceName) return NextResponse.json({ error: 'recordId, governanceRegistryIdentifier, governanceName, and sealed finding are required.' }, { status: 400 });
    const sealVerified = await verifyTA14InstitutionalFindingSeal(body.finding);
    if (!sealVerified) return NextResponse.json({ error: 'Finding seal verification failed. Nothing was recorded.' }, { status: 422 });
    const record = createTA14InstitutionalFindingRecord({ recordId: body.recordId, sealedFinding: body.finding, findingSealVerified: true });
    const artifact = mapInstitutionalFindingToGovernedArtifact({ record, finding: body.finding, governanceRegistryIdentifier: body.governanceRegistryIdentifier, governanceName: body.governanceName });
    const { supabase, user } = await authenticatedClient();
    if (!user) return NextResponse.json({ error: 'Authenticated institutional session required.' }, { status: 401 });
    const { data, error } = await supabase.from('ta14_governed_artifact_records').insert(artifact).select('id, artifact_identifier, artifact_series_identifier, registered_at').single();
    if (error) { const duplicate = error.code === '23505'; return NextResponse.json({ error: duplicate ? 'Institutional record identifier already exists; immutable records are not overwritten.' : 'Authoritative persistence failed.', detail: error.message }, { status: duplicate ? 409 : 500 }); }
    const eventKey = `${data.artifact_identifier}:RECORDED:1`;
    const { error: eventError } = await supabase.from('ta14_governed_artifact_events').insert({ artifact_record_id:data.id,event_key:eventKey,event_type:'INSTITUTIONAL_FINDING_RECORDED',event_at:data.registered_at,title:'Institutional examination finding admitted to governed artifact record',summary:`${body.finding.determination}: ${body.finding.boundedProposition}`,sequence_number:1,metadata:{actor_user_id:user.id,finding_id:body.finding.findingId,finding_digest:body.finding.canonicalDigest,receipt_id:body.finding.receiptId,receipt_digest:body.finding.receiptDigest,seal_schema:body.finding.sealSchema,preservation_standing:record.preservationStanding} });
    if (eventError) { await supabase.from('ta14_governed_artifact_records').delete().eq('id', data.id); return NextResponse.json({ error: 'Institutional chronology event failed; record admission was rolled back.', detail: eventError.message }, { status: 500 }); }
    return NextResponse.json({ ok:true,sealVerified:true,preservationStanding:record.preservationStanding,artifact:{artifact_identifier:data.artifact_identifier,artifact_series_identifier:data.artifact_series_identifier,registered_at:data.registered_at},eventKey }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Institutional finding admission failed.' }, { status: 400 });
  }
}
