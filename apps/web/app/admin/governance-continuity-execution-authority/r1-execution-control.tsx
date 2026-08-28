'use client';

import { useState } from 'react';

type RunResult = { ok?: boolean; gate?: string; run_id?: string; preserved_events?: number; execution_attempt?: { determination?: string; permitted?: boolean; receipt_hash?: string }; post_preservation_verification?: { status?: string; terminalHash?: string; semanticReplayCount?: number }; error?: string };

export default function R1ExecutionControl() {
  const [state, setState] = useState<'idle' | 'running' | 'done' | 'error'>('idle');
  const [result, setResult] = useState<RunResult | null>(null);

  async function execute() {
    if (state === 'running') return;
    setState('running'); setResult(null);
    try {
      const response = await fetch('/api/admin/governance-continuity-execution-authority/run-r2', { method: 'POST', credentials: 'same-origin' });
      const body = (await response.json()) as RunResult;
      setResult(body); setState(response.ok && body.ok ? 'done' : 'error');
    } catch (error) {
      setResult({ error: error instanceof Error ? error.message : 'Execution request failed.' }); setState('error');
    }
  }

  return <section style={{ marginTop: 34, border: '2px solid #17212b', borderRadius: 14, padding: 24, background: '#fff' }}>
    <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.12em' }}>R2 · SEMANTIC REPLAY + EXECUTION ENFORCEMENT</div>
    <h2 style={{ margin: '8px 0 10px' }}>Production R2 execution</h2>
    <p style={{ maxWidth: 820, lineHeight: 1.65 }}>R1 remains historically frozen. R2 preserves the exact authority inputs, semantically re-runs the authority engine, deliberately attempts the governed consequence while standing is challenged, requires an explicit DENY at the execution boundary, preserves the append-only chronology, reads it back, and verifies the persisted semantic replay.</p>
    <button onClick={execute} disabled={state === 'running'} style={{ padding: '13px 20px', fontSize: 16, fontWeight: 800, cursor: state === 'running' ? 'wait' : 'pointer', borderRadius: 9 }}>{state === 'running' ? 'Executing R2...' : 'Execute & Preserve R2'}</button>
    {state === 'done' && result && <div style={{ marginTop: 18, padding: 16, border: '1px solid #5f7d61', borderRadius: 10 }}><b>PASS - R2 semantic replay and execution-boundary refusal preserved.</b><br/>Run: {result.run_id}<br/>Events: {result.preserved_events}<br/>Persisted replay: {result.post_preservation_verification?.status}<br/>Semantic replays: {result.post_preservation_verification?.semanticReplayCount}<br/>Challenged execution: {result.execution_attempt?.determination} · permitted = {String(result.execution_attempt?.permitted)}<br/><small>Terminal hash: {result.post_preservation_verification?.terminalHash}</small></div>}
    {state === 'error' && result && <div style={{ marginTop: 18, padding: 16, border: '1px solid #9b4d4d', borderRadius: 10 }}><b>R2 NOT PASSED.</b><br/>{result.error ?? 'The server did not return a verified R2 PASS.'}</div>}
  </section>;
}
