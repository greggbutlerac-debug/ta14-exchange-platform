'use client';

import { useState, useTransition } from 'react';
import { issueBaseLayerTechnicalFreeze } from './actions';

export function IssueFreezeForm({ ready, issued }: { ready: boolean; issued: boolean }) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState('');
  const disabled = !ready || issued || pending;

  return <div style={{ marginTop: 18 }}>
    <button
      type="button"
      disabled={disabled}
      onClick={() => startTransition(async () => {
        const result = await issueBaseLayerTechnicalFreeze();
        setMessage(result.ok && result.sha256 ? `${result.message} SHA-256: ${result.sha256}` : result.message);
      })}
      style={{ padding: '12px 16px', borderRadius: 10, border: '1px solid rgba(255,255,255,.18)', fontWeight: 850, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? .5 : 1 }}
    >
      {issued ? 'Technical Freeze Issued' : pending ? 'Issuing…' : 'Issue Technical Freeze'}
    </button>
    {!ready && !issued && <p style={{ color: '#fbbf24' }}>Issuance disabled until all persisted freeze gates are satisfied and the participant factual review is complete.</p>}
    {message && <p aria-live="polite" style={{ overflowWrap: 'anywhere' }}>{message}</p>}
  </div>;
}
