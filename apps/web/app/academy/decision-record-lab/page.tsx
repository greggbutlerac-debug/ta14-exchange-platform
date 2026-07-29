"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type DecisionState = "ALLOW" | "HOLD" | "DENY" | "ESCALATE";

type DecisionRecord = {
  title: string;
  matter: string;
  evidence: string;
  authority: string;
  boundary: string;
  decision: DecisionState;
  rationale: string;
  conditions: string;
  reviewer: string;
};

const STORAGE_KEY = "ta14-academy-decision-record-lab-v1";

const initialRecord: DecisionRecord = {
  title: "",
  matter: "",
  evidence: "",
  authority: "",
  boundary: "",
  decision: "HOLD",
  rationale: "",
  conditions: "",
  reviewer: "",
};

const decisionGuidance: Record<DecisionState, { heading: string; description: string }> = {
  ALLOW: {
    heading: "Execution may proceed within the recorded boundary.",
    description:
      "Use ALLOW only when the evidence is current, authority is valid, continuity is preserved, and the requested execution remains bounded.",
  },
  HOLD: {
    heading: "Execution pauses while a remediable condition remains unresolved.",
    description:
      "Use HOLD when the route may become admissible after revalidation, additional evidence, corrected authority, or dependency resolution.",
  },
  DENY: {
    heading: "The requested execution is not admissible.",
    description:
      "Use DENY when a mandatory requirement is absent, prohibited, outside authority, or incapable of correction within the requested route.",
  },
  ESCALATE: {
    heading: "A qualified authority must resolve the matter.",
    description:
      "Use ESCALATE when the current reviewer lacks authority, evidence conflicts materially, or the consequence exceeds the permitted decision boundary.",
  },
};

const fieldChecks = [
  { key: "matter", label: "Matter defined" },
  { key: "evidence", label: "Evidence basis preserved" },
  { key: "authority", label: "Authority identified" },
  { key: "boundary", label: "Execution boundary stated" },
  { key: "rationale", label: "Rationale recorded" },
  { key: "reviewer", label: "Reviewer attributable" },
] as const;

export default function DecisionRecordLabPage() {
  const [record, setRecord] = useState<DecisionRecord>(initialRecord);
  const [savedAt, setSavedAt] = useState<string>("");
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as { record?: DecisionRecord; savedAt?: string };
      if (parsed.record) setRecord(parsed.record);
      if (parsed.savedAt) setSavedAt(parsed.savedAt);
    } catch {
      setStatus("error");
    }
  }, []);

  const completedChecks = useMemo(
    () => fieldChecks.filter(({ key }) => record[key].trim().length > 0).length,
    [record],
  );

  const completion = Math.round((completedChecks / fieldChecks.length) * 100);
  const guidance = decisionGuidance[record.decision];

  function updateField<K extends keyof DecisionRecord>(key: K, value: DecisionRecord[K]) {
    setRecord((current) => ({ ...current, [key]: value }));
    setStatus("idle");
  }

  function saveRecord() {
    try {
      const timestamp = new Date().toISOString();
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ record, savedAt: timestamp }));
      setSavedAt(timestamp);
      setStatus("saved");
    } catch {
      setStatus("error");
    }
  }

  function resetRecord() {
    setRecord(initialRecord);
    setSavedAt("");
    setStatus("idle");
    window.localStorage.removeItem(STORAGE_KEY);
  }

  function exportRecord() {
    const lines = [
      "TA-14 ACADEMY — DECISION RECORD",
      "",
      `Title: ${record.title || "Untitled"}`,
      `Matter: ${record.matter || "Not recorded"}`,
      `Decision: ${record.decision}`,
      `Reviewer: ${record.reviewer || "Not recorded"}`,
      `Recorded: ${savedAt || new Date().toISOString()}`,
      "",
      "EVIDENCE BASIS",
      record.evidence || "Not recorded",
      "",
      "AUTHORITY",
      record.authority || "Not recorded",
      "",
      "EXECUTION BOUNDARY",
      record.boundary || "Not recorded",
      "",
      "RATIONALE",
      record.rationale || "Not recorded",
      "",
      "CONDITIONS / NEXT ACTION",
      record.conditions || "None recorded",
      "",
      "GOVERNING PRINCIPLE",
      "No admissible evidence. No admissible execution.",
    ];

    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `ta14-decision-record-${record.decision.toLowerCase()}.txt`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030812] text-slate-100">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute left-[5%] top-20 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute right-[5%] top-56 h-96 w-96 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-[38%] h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
        <header className="flex flex-col gap-5 border-b border-white/10 pb-7 lg:flex-row lg:items-center lg:justify-between">
          <Link href="/academy" className="flex items-center gap-3">
            <span className="rounded-xl border border-cyan-300/30 bg-cyan-300/10 px-3 py-2 text-sm font-black tracking-[0.18em] text-cyan-200">
              TA-14
            </span>
            <span>
              <strong className="block text-sm text-white">Academy</strong>
              <small className="text-xs text-slate-400">Decision Record Lab</small>
            </span>
          </Link>

          <nav className="flex flex-wrap gap-2 text-sm" aria-label="Academy navigation">
            <Link href="/academy/dashboard" className="rounded-full border border-white/10 px-4 py-2 text-slate-300 transition hover:border-cyan-300/40 hover:text-white">
              Mission Control
            </Link>
            <Link href="/academy/review" className="rounded-full border border-white/10 px-4 py-2 text-slate-300 transition hover:border-cyan-300/40 hover:text-white">
              Review Workspace
            </Link>
            <Link href="/academy/assessment" className="rounded-full border border-white/10 px-4 py-2 text-slate-300 transition hover:border-cyan-300/40 hover:text-white">
              Assessment Center
            </Link>
          </nav>
        </header>

        <section className="py-12 lg:py-16">
          <p className="mb-4 text-xs font-black uppercase tracking-[0.28em] text-cyan-300">Preserve the decision before consequence</p>
          <h1 className="max-w-5xl text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
            Build an attributable decision record that can survive challenge.
          </h1>
          <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-300">
            A decision is not governed merely because a result was selected. The evidence basis, authority, execution boundary, rationale, conditions, and reviewer must be preserved before the decision binds to reality.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <SummaryCard label="Record completion" value={`${completion}%`} />
            <SummaryCard label="Current state" value={record.decision} />
            <SummaryCard label="Governing rule" value="Decision before execution" />
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.72fr_1.28fr]">
          <aside className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/20">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-300">Readiness</p>
              <div className="mt-5 space-y-3">
                {fieldChecks.map(({ key, label }) => {
                  const complete = record[key].trim().length > 0;
                  return (
                    <div key={key} className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                      <span className="text-sm text-slate-300">{label}</span>
                      <span className={`rounded-full px-2.5 py-1 text-[11px] font-black uppercase tracking-[0.12em] ${complete ? "bg-emerald-300/10 text-emerald-200" : "bg-amber-300/10 text-amber-200"}`}>
                        {complete ? "Ready" : "Open"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-3xl border border-cyan-300/20 bg-cyan-300/[0.06] p-6">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-200">Selected state</p>
              <h2 className="mt-3 text-xl font-black text-white">{guidance.heading}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-300">{guidance.description}</p>
            </div>

            <div className="rounded-3xl border border-amber-300/20 bg-amber-300/[0.06] p-6">
              <p className="text-sm font-bold text-amber-100">Completion is not authorization.</p>
              <p className="mt-2 text-sm leading-6 text-amber-50/75">
                This Academy exercise teaches record construction. It does not grant operational authority or approve a real-world execution.
              </p>
            </div>
          </aside>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/20 sm:p-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Record title">
                <input value={record.title} onChange={(event) => updateField("title", event.target.value)} className="input" placeholder="Example: Bounded restart decision" />
              </Field>
              <Field label="Reviewer / decision authority">
                <input value={record.reviewer} onChange={(event) => updateField("reviewer", event.target.value)} className="input" placeholder="Name, role, or attributable identifier" />
              </Field>
            </div>

            <div className="mt-5 grid gap-5">
              <Field label="Matter under review">
                <textarea value={record.matter} onChange={(event) => updateField("matter", event.target.value)} className="input min-h-28 resize-y" placeholder="Define the exact matter, requested action, and consequence." />
              </Field>
              <Field label="Admissible evidence basis">
                <textarea value={record.evidence} onChange={(event) => updateField("evidence", event.target.value)} className="input min-h-32 resize-y" placeholder="Identify current, attributable, relevant, and preserved evidence." />
              </Field>
              <Field label="Authority basis">
                <textarea value={record.authority} onChange={(event) => updateField("authority", event.target.value)} className="input min-h-28 resize-y" placeholder="State who may decide, under what authority, and for which action." />
              </Field>
              <Field label="Execution boundary">
                <textarea value={record.boundary} onChange={(event) => updateField("boundary", event.target.value)} className="input min-h-28 resize-y" placeholder="Define what may occur, what may not occur, duration, scope, and stop conditions." />
              </Field>
            </div>

            <fieldset className="mt-7">
              <legend className="text-sm font-black uppercase tracking-[0.18em] text-slate-300">Decision state</legend>
              <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {(["ALLOW", "HOLD", "DENY", "ESCALATE"] as DecisionState[]).map((state) => (
                  <button
                    key={state}
                    type="button"
                    onClick={() => updateField("decision", state)}
                    className={`rounded-2xl border px-4 py-4 text-sm font-black tracking-[0.12em] transition ${record.decision === state ? "border-cyan-300/60 bg-cyan-300/15 text-white" : "border-white/10 bg-black/20 text-slate-400 hover:border-white/25 hover:text-white"}`}
                  >
                    {state}
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="mt-7 grid gap-5">
              <Field label="Decision rationale">
                <textarea value={record.rationale} onChange={(event) => updateField("rationale", event.target.value)} className="input min-h-36 resize-y" placeholder="Explain why the selected state follows from the evidence, authority, continuity, and boundary." />
              </Field>
              <Field label="Conditions, remediation, or next action">
                <textarea value={record.conditions} onChange={(event) => updateField("conditions", event.target.value)} className="input min-h-28 resize-y" placeholder="Record required controls, revalidation, escalation destination, or corrective action." />
              </Field>
            </div>

            <div className="mt-8 flex flex-wrap gap-3 border-t border-white/10 pt-6">
              <button type="button" onClick={saveRecord} className="rounded-full bg-cyan-300 px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-cyan-200">
                Save decision record
              </button>
              <button type="button" onClick={exportRecord} className="rounded-full border border-white/15 px-5 py-3 text-sm font-bold text-white transition hover:border-cyan-300/40 hover:bg-white/[0.05]">
                Export record
              </button>
              <button type="button" onClick={resetRecord} className="rounded-full border border-rose-300/20 px-5 py-3 text-sm font-bold text-rose-200 transition hover:border-rose-300/40 hover:bg-rose-300/[0.06]">
                Reset
              </button>
            </div>

            <p className="mt-4 text-sm text-slate-400" aria-live="polite">
              {status === "saved" && `Saved locally${savedAt ? ` at ${new Date(savedAt).toLocaleString()}` : ""}.`}
              {status === "error" && "The browser could not save this record locally."}
              {status === "idle" && "Progress remains in this browser only after you save."}
            </p>
          </div>
        </section>

        <section className="mt-12 rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-transparent p-7 sm:p-9">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-300">Final test</p>
          <h2 className="mt-3 text-3xl font-black text-white">Can another reviewer reconstruct why this consequence was permitted, paused, denied, or escalated?</h2>
          <p className="mt-4 max-w-4xl text-base leading-7 text-slate-300">
            A defensible record makes the decision attributable, bounded, reviewable, and challengeable. If the path from evidence to consequence cannot be reconstructed, the record is not complete.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/academy/review" className="rounded-full bg-white px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-cyan-100">
              Continue to Review Workspace
            </Link>
            <Link href="/academy/dashboard" className="rounded-full border border-white/15 px-5 py-3 text-sm font-bold text-white transition hover:border-cyan-300/40">
              Return to Mission Control
            </Link>
          </div>
        </section>
      </div>

      <style jsx>{`
        .input {
          width: 100%;
          border-radius: 1rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(0, 0, 0, 0.22);
          padding: 0.9rem 1rem;
          color: white;
          outline: none;
          transition: border-color 160ms ease, background 160ms ease, box-shadow 160ms ease;
        }
        .input::placeholder { color: rgb(100 116 139); }
        .input:focus {
          border-color: rgba(103, 232, 249, 0.55);
          background: rgba(8, 47, 73, 0.18);
          box-shadow: 0 0 0 3px rgba(34, 211, 238, 0.08);
        }
      `}</style>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-black uppercase tracking-[0.14em] text-slate-300">{label}</span>
      {children}
    </label>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-2 text-xl font-black text-white">{value}</p>
    </div>
  );
}
