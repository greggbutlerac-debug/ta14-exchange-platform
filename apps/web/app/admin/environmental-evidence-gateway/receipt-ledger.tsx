'use client';

import { useEffect, useState } from 'react';

type ReceiptSeed = {
  record_id: string;
  replay_id: string;
  evidence_hash: string;
  determination_hash: string;
  determination: string;
  receipt_payload: unknown;
};

type Preserved = {
  record_id: string;
  replay_id: string;
  determination: string;
  preserved_at: string;
  replay_verification: { status: 'PASS' | 'FAIL'; recomputed_hash: string; stored_hash: string };
};

export default function ReceiptLedger({ seed }: { seed: ReceiptSeed }) {
  const [receipts, setReceipts] = useState<Preserved[]>([]);
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);

  async function load() {
    try {
      const response = await fetch('/api/admin/environmental-evidence-gateway/receipts', { cache: 'no-store' });
      const body = await response.json();
      if (response.ok) setReceipts(body.receipts ?? []);
      else setStatus(body.error ?? 'Receipt ledger unavailable.');
    } catch {
      setStatus('Receipt ledger unavailable.');
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function preserve() {
    setBusy(true);
    setStatus('Verifying and preserving...');
    try {
      const response = await fetch('/api/admin/environmental-evidence-gateway/receipts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(seed),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error ?? 'Preservation failed.');
      setStatus(`PRESERVED - replay verification ${body.replay_verification.status}`);
      await load();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Preservation failed.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <section style={{ marginTop: 34 }}>
      <button onClick={preserve} disabled={busy} style={{ padding: '12px 18px', fontWeight: 700, cursor: busy ? 'wait' : 'pointer' }}>
        Preserve verified private receipt
      </button>
      {status && <p><b>{status}</b></p>}
      <h2>Private preserved receipts</h2>
      {receipts.length ? (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr><th style={head}>Record</th><th style={head}>Determination</th><th style={head}>Replay</th><th style={head}>Verification</th><th style={head}>Preserved</th></tr></thead>
          <tbody>{receipts.map((receipt) => <tr key={receipt.replay_id}><td style={cell}>{receipt.record_id}</td><td style={cell}>{receipt.determination}</td><td style={cell}>{receipt.replay_id}</td><td style={cell}><b>{receipt.replay_verification.status}</b></td><td style={cell}>{new Date(receipt.preserved_at).toLocaleString()}</td></tr>)}</tbody>
        </table>
      ) : <p>No private receipts preserved yet.</p>}
    </section>
  );
}

const head = { textAlign: 'left' as const, padding: 10, border: '1px solid #d8dde3', background: '#17212b', color: '#fff' };
const cell = { padding: 10, border: '1px solid #d8dde3', wordBreak: 'break-word' as const };
