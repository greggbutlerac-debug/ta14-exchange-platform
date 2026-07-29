import React from "react";

export default function SimulatorPage() {
  const states = ["PASS","HOLD","DENY","ESCALATE"];
  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-4xl font-bold">Execution Simulator</h1>
        <p className="mt-3 text-lg">
          Simulate governed execution without producing real-world consequence.
        </p>

        <div className="grid gap-6 mt-8 md:grid-cols-2">
          <section className="rounded-xl border p-6">
            <h2 className="text-2xl font-semibold">Evaluation</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {states.map(s => (
                <button key={s} className="rounded-lg border px-4 py-2">{s}</button>
              ))}
            </div>
          </section>

          <section className="rounded-xl border p-6">
            <h2 className="text-2xl font-semibold">Trace</h2>
            <ul className="mt-4 list-disc pl-5">
              <li>Evidence Trace</li>
              <li>Authority Trace</li>
              <li>Continuity Check</li>
              <li>Changed Condition Test</li>
              <li>Preserved History</li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
