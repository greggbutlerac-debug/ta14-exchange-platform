'use client';

import { useState } from 'react';

type Result = {
  ok?: boolean;
  verification_id?: string;
  preservation?: string;
  verification?: { status?: string; checks?: Record<string, boolean>; failures?: string[] };
  error?: string;
};

export default function LifecycleVerificationControl() {
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  async function execute() {
    setRunning(true);
    setResult(null);
    try {
      const response = await fetch('/api/admin/governance-continuity-execution-authority/verify-lifecycle', {
        method: 'POST',
        credentials: 'same-origin',
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: error instanceof Error ? error.message : 'Lifecycle verification failed.' });
    } finally {
      setRunning(false);
    }
  }

  const passedChecks = result?.verification?.checks ? Object.values(result.verification.checks).filter(Boolean).length : 0;
  const totalChecks = result?.verification?.checks ? Object.keys(result.verification.checks).length : 0;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Complete canonical lifecycle</p>
          <h2 className="mt-1 text-xl font-semibold text-slate-950">Authenticated lifecycle verification</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">Runs the complete Reality → Record → Continuity → Admissibility → Binding → Commit → Execution → Outcome verifier. This control does not claim durable preservation until a separate append-only evidence path is established.</p>
        </div>
        <button type="button" onClick={execute} disabled={running} className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">
          {running ? 'Verifying…' : 'Verify Complete Lifecycle'}
        </button>
      </div>

      {result && (
        <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
          {result.error ? <p className="font-semibold text-red-700">{result.error}</p> : (
            <div className="space-y-2">
              <p className={result.ok ? 'font-semibold text-emerald-700' : 'font-semibold text-red-700'}>{result.ok ? 'PASS — authenticated complete lifecycle verification.' : 'FAIL — complete lifecycle verification not established.'}</p>
              <p>Verification: <span className="font-mono">{result.verification_id}</span></p>
              <p>Checks: {passedChecks}/{totalChecks}</p>
              <p>Preservation: <strong>{result.preservation}</strong></p>
              {result.verification?.failures?.length ? <p>Failures: {result.verification.failures.join(', ')}</p> : null}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
