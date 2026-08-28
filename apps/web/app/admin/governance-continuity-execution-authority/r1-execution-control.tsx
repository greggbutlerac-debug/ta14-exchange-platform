'use client';

import { useState } from 'react';

type RunResult = { ok?: boolean; run_id?: string; preserved_events?: number; post_preservation_verification?: { status?: string; terminalHash?: string }; error?: string };

export default function R1ExecutionControl() {
  const [state, setState] = useState<'idle' | 'running' | 'done' | 'error'>('idle');
  const [result, setResult] = useState<RunResult | null>(null);

  async function execute() {
    if (state === 'running') return;
    setState('running'); setResult(null);
    try {
      const response = await fetch('/api/admin/governance-continuity-execution-authority/run-r1', { method: 'POST', credentials: 'same-origin' });
      const body = (await response.json()) as RunResult;
      setResult(body); setState(response.ok && body.ok ? 'done' : 'error');
    } catch (error) {
      setResult({ error: error instanceof Error ? error.message : 'Execution request failed.' }); setState('error');
    }
  }

  return <section style={{ marginTop: 34, border: '2px solid #17212b', padding: 22 }}>
    <h2 style={{ marginTop: 0 }}>Production R1 execution</h2>
    <p>This owner-only control creates the durable GCEA R1 chronology in production. The server generates the demonstration, preserves the append-only event chain, reads it back, and verifies the persisted replay.</p>
    <button onClick={execute} disabled={state === 'running'} style={{ padding: '12px 18px', fontSize: 16, fontWeight: 700, cursor: state === 'running' ? 'wait' : 'pointer' }}>{state === 'running' ? 'Executing R1...' : 'Execute & Preserve R1'}</button>
    {state === 'done' && result && <div style={{ marginTop: 18, padding: 14, border: '1px solid #5f7d61' }}><b>PASS - production chronology preserved and replay verified.</b><br/>Run: {result.run_id}<br/>Events: {result.preserved_events}<br/>Replay: {result.post_preservation_verification?.status}<br/><small>Terminal hash: {result.post_preservation_verification?.terminalHash}</small></div>}
    {state === 'error' && result && <div style={{ marginTop: 18, padding: 14, border: '1px solid #9b4d4d' }}><b>NOT PASSED.</b><br/>{result.error ?? 'The server did not return a verified PASS.'}</div>}
  </section>;
}
