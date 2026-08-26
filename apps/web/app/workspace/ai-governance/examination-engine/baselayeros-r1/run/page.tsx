import { createClient } from '@/lib/supabase/server';
import { baseLayerTechnicalFreezeRecord as freeze } from '@/lib/governance/technical-freeze-record';
import { startBaseLayerExaminationRun } from './actions';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'BaseLayerOS R1 Examination Runner | TA-14 Exchange' };

export default async function RunGatePage() {
  const supabase = await createClient();
  const { data, error } = await supabase.from('consequence_technical_freezes').select('status,freeze_sha256,issued_at').eq('record_id', freeze.recordId).maybeSingle();
  const ready = !error && data?.status === 'TECHNICAL_FREEZE_ISSUED' && !!data.freeze_sha256 && !!data.issued_at;
  return <main style={{ maxWidth: 900, margin: '0 auto', padding: '48px 24px', color: '#e5e7eb' }}>
    <p style={{ color: '#94a3b8', letterSpacing: '.14em', fontSize: 12 }}>TA-14 CONSEQUENCE EXAMINATION RUNNER</p>
    <h1>BaseLayerOS / TA-14 R1 Execution Gate</h1>
    <p>The runner does not accept a browser-supplied freeze identity. It resolves the issued Technical Freeze from persistent storage at execution time.</p>
    <p style={{ fontWeight: 900, color: ready ? '#86efac' : '#fca5a5' }}>{ready ? 'EXECUTION ELIGIBLE — PERSISTED FREEZE VERIFIED' : 'EXECUTION LOCKED — NO VERIFIED ISSUED FREEZE'}</p>
    {ready && <><p style={{ overflowWrap: 'anywhere' }}><strong>Freeze SHA-256:</strong> {data.freeze_sha256}</p><form action={startBaseLayerExaminationRun}><button type="submit" style={{ padding: '12px 18px', borderRadius: 10, fontWeight: 850 }}>Start New Examination Run</button></form></>}
    {!ready && <p>No run can be created until the Technical Freeze is legitimately issued.</p>}
  </main>;
}
