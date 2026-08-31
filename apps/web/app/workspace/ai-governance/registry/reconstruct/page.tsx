'use client';

import { useEffect, useMemo, useState } from 'react';

type Reconstruction = {
  id: string;
  recovery_record_id: string;
  status: string;
  original_attempt_at: string;
  original_failure_type: string;
  reconstructed_payload: Record<string, unknown>;
  participant_confirmed_at: string | null;
};

const fields = [
  ['governanceName', 'Governance / architecture name'],
  ['organization', 'Organization'],
  ['currentVersion', 'Current version'],
  ['claimantName', 'Claimant / owner'],
  ['plainDescription', 'Plain-language description'],
  ['claims', 'Formal claims'],
  ['nonClaims', 'Explicit non-claims'],
  ['limitations', 'Known limitations'],
  ['publicEvidenceRoute', 'Public evidence route'],
] as const;

export default function LegacyRegistrationReconstructionPage() {
  const [items, setItems] = useState<Reconstruction[]>([]);
  const [recoveryRecordId, setRecoveryRecordId] = useState('');
  const [payload, setPayload] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  async function load() {
    const response = await fetch('/api/ai-governance/registry/legacy-reconstruction', { cache: 'no-store' });
    if (!response.ok) return;
    const data = await response.json();
    setItems(data.reconstructions ?? []);
  }

  useEffect(() => { void load(); }, []);

  const active = useMemo(() => items.find(item => item.status !== 'CLOSED') ?? null, [items]);

  async function preserve() {
    if (!recoveryRecordId.trim() && !active?.recovery_record_id) {
      setMessage('A TA-14 recovery record must be associated with this reconstruction.');
      return;
    }
    setBusy(true);
    setMessage('');
    const response = await fetch('/api/ai-governance/registry/legacy-reconstruction', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recoveryRecordId: active?.recovery_record_id ?? recoveryRecordId.trim(), reconstructedPayload: payload }),
    });
    const data = await response.json();
    setBusy(false);
    setMessage(response.ok ? data.notice : data.error ?? 'Unable to preserve reconstruction.');
    if (response.ok) await load();
  }

  async function confirm() {
    if (!active?.id) return;
    setBusy(true);
    const response = await fetch('/api/ai-governance/registry/legacy-reconstruction', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: active.id, action: 'confirm' }),
    });
    const data = await response.json();
    setBusy(false);
    setMessage(response.ok ? 'Reconstruction confirmed. This confirmation does not itself create Registry standing.' : data.error ?? 'Unable to confirm reconstruction.');
    if (response.ok) await load();
  }

  return (
    <main className="mx-auto max-w-4xl space-y-8 px-6 py-12">
      <header className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">TA-14 Registry recovery</p>
        <h1 className="text-3xl font-semibold">Legacy registration reconstruction</h1>
        <p className="max-w-3xl text-slate-600">Use this pathway only when TA-14 has preserved a historical registration persistence failure for your signed-in account. You are reconstructing the missing substantive information; TA-14 is not representing these answers as the original lost server record.</p>
      </header>

      <section className="rounded-xl border border-amber-300 bg-amber-50 p-5 text-sm text-amber-950">
        <strong>Provenance boundary:</strong> the original attempt date remains historically preserved. The reconstruction date is separately preserved. Participant confirmation establishes what you now attest the missing registration contained or should contain; it does not retroactively manufacture the lost payload.
      </section>

      {!active && (
        <label className="block space-y-2">
          <span className="font-medium">TA-14 recovery record ID</span>
          <input className="w-full rounded-lg border px-3 py-2" value={recoveryRecordId} onChange={event => setRecoveryRecordId(event.target.value)} placeholder="Provided by TA-14 for the documented failed intake" />
        </label>
      )}

      {active && (
        <section className="rounded-xl border p-5 text-sm">
          <div><strong>Status:</strong> {active.status}</div>
          <div><strong>Original attempt:</strong> {new Date(active.original_attempt_at).toLocaleString()}</div>
          <div><strong>Failure type:</strong> {active.original_failure_type}</div>
        </section>
      )}

      <section className="space-y-5">
        {fields.map(([key, label]) => (
          <label key={key} className="block space-y-2">
            <span className="font-medium">{label}</span>
            {['plainDescription', 'claims', 'nonClaims', 'limitations'].includes(key) ? (
              <textarea className="min-h-28 w-full rounded-lg border px-3 py-2" value={payload[key] ?? ''} onChange={event => setPayload(current => ({ ...current, [key]: event.target.value }))} />
            ) : (
              <input className="w-full rounded-lg border px-3 py-2" value={payload[key] ?? ''} onChange={event => setPayload(current => ({ ...current, [key]: event.target.value }))} />
            )}
          </label>
        ))}
      </section>

      <div className="flex flex-wrap gap-3">
        <button disabled={busy || active?.status === 'PARTICIPANT_CONFIRMED'} onClick={preserve} className="rounded-lg bg-slate-950 px-4 py-2 font-medium text-white disabled:opacity-50">Preserve reconstruction</button>
        {active?.status === 'RECONSTRUCTION_IN_PROGRESS' && <button disabled={busy} onClick={confirm} className="rounded-lg border border-slate-950 px-4 py-2 font-medium disabled:opacity-50">Confirm reconstructed record</button>}
      </div>

      {message && <p className="rounded-lg border p-4 text-sm">{message}</p>}

      <p className="text-sm text-slate-500">Confirmation does not certify, validate, approve, or register the architecture. Promotion into a Registry draft is a separate controlled transition.</p>
    </main>
  );
}
