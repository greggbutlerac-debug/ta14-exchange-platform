'use client';

import { useEffect, useState } from 'react';

type IntakeFields = {
  proposedConsequence: string;
  actor: string;
  domain: string;
  jurisdictionScope: string;
  evidenceBasis: string;
  authorityBasis: string;
  standingBasis: string;
};
const initial: IntakeFields = {
  proposedConsequence: '', actor: '', domain: '', jurisdictionScope: '',
  evidenceBasis: '', authorityBasis: '', standingBasis: '',
};
const labels: Record<keyof IntakeFields, string> = {
  proposedConsequence: 'Proposed consequence',
  actor: 'Actor proposing the consequence',
  domain: 'Domain or system',
  jurisdictionScope: 'Jurisdiction and scope',
  evidenceBasis: 'Available evidence and its provenance',
  authorityBasis: 'Applicable authority basis',
  standingBasis: 'Established standing basis',
};
const keys = Object.keys(initial) as (keyof IntakeFields)[];

async function postJson(path: string, payload: unknown) {
  const response = await fetch(path, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload), cache: 'no-store',
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || result.error || 'Request failed');
  return result;
}

export default function ExaminationCheckoutPage() {
  const [fields, setFields] = useState<IntakeFields>(initial);
  const [intakeId, setIntakeId] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [uploaded, setUploaded] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [receipt, setReceipt] = useState<{ queueId?: string; intakeId?: string } | null>(null);
  const [returnOrder, setReturnOrder] = useState('');

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const orderId = query.get('token') || '';
    const saved = window.sessionStorage.getItem('ta14-cex-pending');
    if (!orderId || !saved) return;
    try {
      const pending = JSON.parse(saved) as { intakeId: string; orderId: string };
      if (pending.orderId !== orderId || !/^TA14-CEX-\d{8}-[A-Z0-9]{10}$/.test(pending.intakeId)) {
        setError('The PayPal return does not match this examination. No payment will be captured.');
        return;
      }
      setIntakeId(pending.intakeId);
      setReturnOrder(orderId);
    } catch {
      setError('The saved payment reference is invalid. Contact support before attempting another payment.');
    }
  }, []);

  async function createIntake() {
    setBusy(true); setError('');
    try {
      const result = await postJson('/api/consequence-examination/intake', {
        ...fields, candidateFilenames: files.map(f => f.name),
        materialChangeDeclared: false, escalationDeclared: false,
        sourcePage: '/examination-checkout',
      });
      setIntakeId(result.intakeId);
    } catch (e) { setError(e instanceof Error ? e.message : 'Unable to preserve intake'); }
    finally { setBusy(false); }
  }

  async function uploadEvidence() {
    if (!intakeId || !files.length) return;
    setBusy(true); setError('');
    try {
      for (const file of files) {
        if (uploaded.includes(file.name)) continue;
        const form = new FormData();
        form.append('intakeId', intakeId);
        form.append('file', file);
        const response = await fetch('/api/consequence-examination/evidence', { method: 'POST', body: form });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Evidence upload failed');
        setUploaded(prev => [...prev, file.name]);
      }
    } catch (e) { setError(e instanceof Error ? e.message : 'Evidence upload failed'); }
    finally { setBusy(false); }
  }

  async function beginPayment() {
    if (!intakeId || files.some(f => !uploaded.includes(f.name))) {
      setError('Preserve every selected evidence file before proceeding to payment.');
      return;
    }
    setBusy(true); setError('');
    try {
      const order = await postJson('/api/paypal/create-order', {
        productId: 'governed-consequence-examination', customerReference: intakeId,
      });
      if (!order.approvalUrl || !order.orderId) throw new Error('PayPal approval link unavailable');
      const approval = new URL(order.approvalUrl);
      if (!['www.paypal.com', 'www.sandbox.paypal.com'].includes(approval.hostname)) {
        throw new Error('Unexpected PayPal approval destination');
      }
      window.sessionStorage.setItem('ta14-cex-pending', JSON.stringify({ intakeId, orderId: order.orderId }));
      window.location.assign(approval.toString());
    } catch (e) { setError(e instanceof Error ? e.message : 'Unable to start payment'); setBusy(false); }
  }

  async function finishPayment() {
    if (!returnOrder || !intakeId) return;
    setBusy(true); setError('');
    try {
      await postJson('/api/paypal/capture-order', { orderId: returnOrder });
      const finalized = await postJson('/api/consequence-examination/payment', { intakeId, orderId: returnOrder });
      setReceipt(finalized);
      window.sessionStorage.removeItem('ta14-cex-pending');
      window.history.replaceState(null, '', '/examination-checkout');
      setReturnOrder('');
    } catch (e) {
      setError((e instanceof Error ? e.message : 'Payment finalization failed') +
        '. If PayPal already charged you, do not pay again. Keep your intake ID and contact TA-14 support.');
    } finally { setBusy(false); }
  }

  return (
    <main style={{ maxWidth: 760, margin: '0 auto', padding: '48px 20px', lineHeight: 1.55 }}>
      <p>TA-14 AUTHORITY GOVERNANCE INSTITUTION</p>
      <h1>Governed Consequence Examination</h1>
      <p><strong>$149 USD · One bounded examination</strong></p>
      <p>Does this proposed consequence have sufficient Admissible Evidence, Applicable Authority, and Established Standing to become reality NOW?</p>
      <p>Payment purchases examination and a preserved record, not ALLOW, certification, compliance, execution authority, endorsement, or a favorable result.</p>
      {error && <p role="alert" style={{ color: '#b42318' }}>{error}</p>}
      {receipt ? (
        <section aria-live="polite">
          <h2>Payment verified · Examination queued</h2>
          <p>Intake: <strong>{receipt.intakeId || intakeId}</strong></p>
          <p>Queue: <strong>{receipt.queueId || 'Recorded'}</strong></p>
          <p>Keep your intake ID for future correspondence.</p>
        </section>
      ) : returnOrder ? (
        <section>
          <h2>Return from PayPal</h2>
          <p>Intake: <strong>{intakeId}</strong></p>
          <p>Complete the capture and independently verify the payment to enter the examination queue.</p>
          <button type="button" disabled={busy} onClick={finishPayment}>
            {busy ? 'Verifying…' : 'Complete and verify payment'}
          </button>
        </section>
      ) : (
        <>
          {!intakeId ? (
            <form onSubmit={e => { e.preventDefault(); void createIntake(); }}>
              <h2>1. Preserve the proposed consequence</h2>
              {keys.map(key => (
                <label key={key} style={{ display: 'block', marginBottom: 18 }}>
                  <strong>{labels[key]}</strong>
                  <textarea required rows={key === 'proposedConsequence' ? 4 : 2}
                    value={fields[key]}
                    onChange={e => setFields(prev => ({ ...prev, [key]: e.target.value }))}
                    maxLength={8000}
                    style={{ display: 'block', width: '100%', boxSizing: 'border-box' }} />
                </label>
              ))}
              <button type="submit" disabled={busy}>{busy ? 'Preserving…' : 'Preserve intake'}</button>
            </form>
          ) : (
            <section>
              <h2>2. Preserve supporting evidence</h2>
              <p>Intake: <strong>{intakeId}</strong></p>
              <p>Submitted evidence is not automatically admissible. Uploaded files become frozen after payment verification.</p>
              <input type="file" multiple disabled={busy || uploaded.length > 0}
                onChange={e => setFiles(Array.from(e.target.files || []))} />
              {files.length > 0 && <p>{uploaded.length} of {files.length} files preserved.</p>}
              {files.some(f => !uploaded.includes(f.name)) &&
                <button type="button" disabled={busy} onClick={uploadEvidence}>Preserve selected files</button>}
              <h2>3. Pay $149 securely through PayPal</h2>
              <button type="button" disabled={busy || files.some(f => !uploaded.includes(f.name))}
                onClick={beginPayment}>{busy ? 'Preparing…' : 'Continue to PayPal · $149'}</button>
              <p>Evidence files are optional. Once payment is verified, the evidence set is frozen and the examination is queued.</p>
            </section>
          )}
        </>
      )}
    </main>
  );
}
