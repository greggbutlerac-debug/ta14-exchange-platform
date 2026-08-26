import { NextResponse } from 'next/server';
import { createClient } from '../../../../../lib/supabase/server';
import { verifyTA14InstitutionalFindingSeal, type TA14SealedInstitutionalFinding } from '../../../../../lib/ai-governance/institutional-examination-finding';
import { createTA14InstitutionalFindingRecord } from '../../../../../lib/ai-governance/institutional-finding-record';
import { mapInstitutionalFindingToGovernedArtifact } from '../../../../../lib/ai-governance/institutional-finding-governed-artifact';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const body = await request.json() as {
      recordId?: string;
      governanceRegistryIdentifier?: string;
      governanceName?: string;
      finding?: TA14SealedInstitutionalFinding;
    };
    if (!body.finding || !body.recordId || !body.governanceRegistryIdentifier || !body.governanceName) {
      return NextResponse.json({ error: 'recordId, governanceRegistryIdentifier, governanceName, and sealed finding are required.' }, { status: 400 });
    }
    const sealVerified = await verifyTA14InstitutionalFindingSeal(body.finding);
    if (!sealVerified) return NextResponse.json({ error: 'Finding seal verification failed. Nothing was recorded.' }, { status: 422 });
    const record = createTA14InstitutionalFindingRecord({ recordId: body.recordId, sealedFinding: body.finding, findingSealVerified: true });
    const artifact = mapInstitutionalFindingToGovernedArtifact({ record, finding: body.finding, governanceRegistryIdentifier: body.governanceRegistryIdentifier, governanceName: body.governanceName });
    const supabase = await createClient();
    const { data: userData, error: authError } = await supabase.auth.getUser();
    if (authError || !userData.user) return NextResponse.json({ error: 'Authenticated institutional session required.' }, { status: 401 });
    const { data, error } = await supabase.from('ta14_governed_artifact_records').insert(artifact).select('artifact_identifier, artifact_series_identifier, registered_at').single();
    if (error) {
      const duplicate = error.code === '23505';
      return NextResponse.json({ error: duplicate ? 'Institutional record identifier already exists; immutable records are not overwritten.' : 'Authoritative persistence failed.', detail: error.message }, { status: duplicate ? 409 : 500 });
    }
    return NextResponse.json({ ok: true, sealVerified: true, preservationStanding: record.preservationStanding, artifact: data }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Institutional finding admission failed.' }, { status: 400 });
  }
}
