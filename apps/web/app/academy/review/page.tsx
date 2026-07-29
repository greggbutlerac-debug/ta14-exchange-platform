"use client";

import { useMemo, useState } from "react";

type Finding = {
  id: number;
  category: string;
  severity: "Low" | "Medium" | "High";
  note: string;
};

export default function ReviewWorkspacePage() {
  const [findings, setFindings] = useState<Finding[]>([]);
  const [category, setCategory] = useState("Evidence");
  const [severity, setSeverity] = useState<Finding["severity"]>("Medium");
  const [note, setNote] = useState("");

  const summary = useMemo(() => ({
    total: findings.length,
    high: findings.filter(f => f.severity === "High").length,
  }), [findings]);

  function addFinding() {
    if (!note.trim()) return;
    setFindings([{ id: Date.now(), category, severity, note }, ...findings]);
    setNote("");
  }

  return (
    <main className="min-h-screen bg-[#030812] text-white p-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-4xl font-bold">Academy Review Workspace</h1>
        <p className="mt-2 text-slate-300">
          Review governed submissions, record findings, and preserve review history.
        </p>

        <div className="grid gap-6 mt-8 lg:grid-cols-2">
          <section className="rounded-2xl border border-white/10 p-6">
            <h2 className="text-2xl font-semibold">New Finding</h2>

            <select className="mt-4 w-full rounded border bg-transparent p-2"
              value={category} onChange={e=>setCategory(e.target.value)}>
              <option>Evidence</option>
              <option>Authority</option>
              <option>Continuity</option>
              <option>Boundary</option>
              <option>Dependencies</option>
            </select>

            <select className="mt-3 w-full rounded border bg-transparent p-2"
              value={severity} onChange={e=>setSeverity(e.target.value as Finding["severity"])}>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>

            <textarea
              className="mt-3 w-full rounded border bg-transparent p-3"
              rows={5}
              placeholder="Record review finding..."
              value={note}
              onChange={e=>setNote(e.target.value)}
            />

            <button
              onClick={addFinding}
              className="mt-4 rounded bg-cyan-400 px-5 py-3 font-bold text-black">
              Preserve Finding
            </button>
          </section>

          <section className="rounded-2xl border border-white/10 p-6">
            <h2 className="text-2xl font-semibold">Review Summary</h2>
            <p className="mt-4">Findings: {summary.total}</p>
            <p>High Severity: {summary.high}</p>

            <div className="mt-6 space-y-3">
              {findings.length === 0 && (
                <div className="rounded border border-dashed p-4 text-slate-400">
                  No findings preserved.
                </div>
              )}
              {findings.map(f=>(
                <article key={f.id} className="rounded border border-white/10 p-4">
                  <div className="flex justify-between">
                    <strong>{f.category}</strong>
                    <span>{f.severity}</span>
                  </div>
                  <p className="mt-2 text-slate-300">{f.note}</p>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
