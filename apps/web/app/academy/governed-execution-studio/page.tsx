"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type GateStatus = "PASS" | "HOLD" | "UNRESOLVED";

type ExecutionStep = {
  id: string;
  label: string;
  prompt: string;
  guidance: string;
};

type SavedStudioState = {
  version: "1.0";
  updatedAt: string;
  title: string;
  objective: string;
  authority: string;
  boundary: string;
  evidence: string;
  dependency: string;
  execution: string;
  outcome: string;
  statuses: Record<string, GateStatus>;
  notes: Record<string, string>;
};

const STORAGE_KEY = "ta14-academy-governed-execution-studio-v1";

const steps: ExecutionStep[] = [
  {
    id: "reality",
    label: "Reality",
    prompt: "What condition presently exists?",
    guidance: "State the condition without converting observation into assumption or diagnosis.",
  },
  {
    id: "record",
    label: "Record",
    prompt: "What evidence preserves that condition?",
    guidance: "Identify attributable measurements, records, timestamps, sources, and supporting artifacts.",
  },
  {
    id: "continuity",
    label: "Continuity",
    prompt: "Has the evidence remained intact and current?",
    guidance: "Confirm version, custody, timing, dependencies, and whether material conditions have changed.",
  },
  {
    id: "admissibility",
    label: "Admissibility",
    prompt: "Is the evidence sufficient for this exact decision?",
    guidance: "Evaluate relevance, completeness, currency, contradiction, uncertainty, and scope.",
  },
  {
    id: "binding",
    label: "Binding",
    prompt: "Who or what has authority to bind the decision?",
    guidance: "Separate technical capability, identity, permission, and role from valid decision authority.",
  },
  {
    id: "commit",
    label: "Commit",
    prompt: "What exact decision state will be preserved?",
    guidance: "Define the approved version, decision basis, conditions, exceptions, and expiration point.",
  },
  {
    id: "execution",
    label: "Execution",
    prompt: "What action corresponds to the committed decision?",
    guidance: "Confirm the action remains inside the approved boundary and has not drifted in scope.",
  },
  {
    id: "outcome",
    label: "Outcome",
    prompt: "What result must be verified and preserved?",
    guidance: "Define expected result, verification method, exceptions, challenge path, and final evidence.",
  },
];

const statusStyles: Record<GateStatus, string> = {
  PASS: "border-emerald-300/40 bg-emerald-300/10 text-emerald-100",
  HOLD: "border-amber-300/40 bg-amber-300/10 text-amber-100",
  UNRESOLVED: "border-slate-300/20 bg-white/5 text-slate-300",
};

export default function GovernedExecutionStudioPage() {
  const [activeStep, setActiveStep] = useState(steps[0].id);
  const [title, setTitle] = useState("");
  const [objective, setObjective] = useState("");
  const [authority, setAuthority] = useState("");
  const [boundary, setBoundary] = useState("");
  const [evidence, setEvidence] = useState("");
  const [dependency, setDependency] = useState("");
  const [execution, setExecution] = useState("");
  const [outcome, setOutcome] = useState("");
  const [statuses, setStatuses] = useState<Record<string, GateStatus>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [saveState, setSaveState] = useState<"idle" | "saved" | "error">("idle");

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as SavedStudioState;
      if (saved.version !== "1.0") return;
      setTitle(saved.title || "");
      setObjective(saved.objective || "");
      setAuthority(saved.authority || "");
      setBoundary(saved.boundary || "");
      setEvidence(saved.evidence || "");
      setDependency(saved.dependency || "");
      setExecution(saved.execution || "");
      setOutcome(saved.outcome || "");
      setStatuses(saved.statuses || {});
      setNotes(saved.notes || {});
    } catch {
      setSaveState("error");
    }
  }, []);

  const step = useMemo(
    () => steps.find((item) => item.id === activeStep) ?? steps[0],
    [activeStep],
  );

  const resolvedCount = steps.filter((item) => (statuses[item.id] || "UNRESOLVED") !== "UNRESOLVED").length;
  const holdCount = steps.filter((item) => statuses[item.id] === "HOLD").length;
  const passCount = steps.filter((item) => statuses[item.id] === "PASS").length;
  const progress = Math.round((resolvedCount / steps.length) * 100);
  const finalDecision = holdCount > 0 ? "HOLD" : passCount === steps.length ? "ALLOW" : "UNRESOLVED";

  function updateStatus(status: GateStatus) {
    setStatuses((current) => ({ ...current, [step.id]: status }));
    setSaveState("idle");
  }

  function saveStudio() {
    try {
      const payload: SavedStudioState = {
        version: "1.0",
        updatedAt: new Date().toISOString(),
        title,
        objective,
        authority,
        boundary,
        evidence,
        dependency,
        execution,
        outcome,
        statuses,
        notes,
      };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      setSaveState("saved");
    } catch {
      setSaveState("error");
    }
  }

  function resetStudio() {
    setActiveStep(steps[0].id);
    setTitle("");
    setObjective("");
    setAuthority("");
    setBoundary("");
    setEvidence("");
    setDependency("");
    setExecution("");
    setOutcome("");
    setStatuses({});
    setNotes({});
    setSaveState("idle");
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      setSaveState("error");
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030812] text-slate-100">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute left-[4%] top-24 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute right-[5%] top-72 h-96 w-96 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-[42%] h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
        <header className="flex flex-col gap-5 border-b border-white/10 pb-7 lg:flex-row lg:items-center lg:justify-between">
          <Link href="/academy" className="flex items-center gap-3">
            <span className="rounded-xl border border-cyan-300/30 bg-cyan-300/10 px-3 py-2 text-sm font-black tracking-[0.18em] text-cyan-200">TA-14</span>
            <span>
              <strong className="block text-sm text-white">Academy</strong>
              <small className="text-xs text-slate-400">Governed Execution Studio</small>
            </span>
          </Link>
          <nav className="flex flex-wrap gap-2 text-sm" aria-label="Academy navigation">
            <Link href="/academy/dashboard" className="rounded-full border border-white/10 px-4 py-2 text-slate-300 transition hover:border-cyan-300/40 hover:text-white">Mission Control</Link>
            <Link href="/academy/runtime-governance-lab" className="rounded-full border border-white/10 px-4 py-2 text-slate-300 transition hover:border-cyan-300/40 hover:text-white">Runtime Lab</Link>
            <Link href="/academy/review" className="rounded-full border border-white/10 px-4 py-2 text-slate-300 transition hover:border-cyan-300/40 hover:text-white">Review Workspace</Link>
          </nav>
        </header>

        <section className="py-12 lg:py-16">
          <p className="mb-4 text-xs font-black uppercase tracking-[0.28em] text-cyan-300">Build the governed route</p>
          <h1 className="max-w-5xl text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">Assemble an execution that can explain, survive challenge, and preserve its outcome.</h1>
          <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-300">Use the eight-anchor chain to define the evidence, authority, boundary, commitment, execution, and verification conditions for one consequential action. Completion records the learner's analysis; it does not independently grant operational authority.</p>

          <div className="mt-8 grid gap-4 md:grid-cols-4">
            <SummaryCard label="Resolved gates" value={`${resolvedCount}/${steps.length}`} />
            <SummaryCard label="Passed" value={String(passCount)} />
            <SummaryCard label="Held" value={String(holdCount)} />
            <SummaryCard label="Route state" value={finalDecision} emphasis />
          </div>

          <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-cyan-300 transition-all" style={{ width: `${progress}%` }} />
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[330px_1fr]">
          <aside className="rounded-3xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl">
            <p className="px-2 pb-3 text-xs font-black uppercase tracking-[0.22em] text-slate-400">Execution chain</p>
            <div className="space-y-2">
              {steps.map((item, index) => {
                const status = statuses[item.id] || "UNRESOLVED";
                const active = item.id === step.id;
                return (
                  <button key={item.id} type="button" onClick={() => setActiveStep(item.id)} className={`w-full rounded-2xl border p-4 text-left transition ${active ? "border-cyan-300/40 bg-cyan-300/10" : "border-white/10 bg-black/10 hover:border-white/20 hover:bg-white/[0.04]"}`}>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs font-black tracking-[0.18em] text-cyan-200">{String(index + 1).padStart(2, "0")}</span>
                      <span className={`rounded-full border px-2 py-1 text-[10px] font-black tracking-[0.12em] ${statusStyles[status]}`}>{status}</span>
                    </div>
                    <strong className="mt-3 block text-sm text-white">{item.label}</strong>
                    <span className="mt-1 block text-xs leading-5 text-slate-400">{item.prompt}</span>
                  </button>
                );
              })}
            </div>
          </aside>

          <div className="space-y-6">
            <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl sm:p-8">
              <div className="grid gap-5 lg:grid-cols-2">
                <Field label="Execution title" value={title} onChange={setTitle} placeholder="Name the action under review" />
                <Field label="Governed objective" value={objective} onChange={setObjective} placeholder="State the exact result being sought" />
                <Field label="Authority source" value={authority} onChange={setAuthority} placeholder="Identify who or what may bind the decision" />
                <Field label="Execution boundary" value={boundary} onChange={setBoundary} placeholder="Define what is inside and outside scope" />
                <Field label="Evidence basis" value={evidence} onChange={setEvidence} placeholder="List the evidence that supports the route" multiline />
                <Field label="Material dependencies" value={dependency} onChange={setDependency} placeholder="List systems, records, conditions, or authorities that must remain valid" multiline />
                <Field label="Permitted execution" value={execution} onChange={setExecution} placeholder="Describe the exact action that may occur" multiline />
                <Field label="Outcome verification" value={outcome} onChange={setOutcome} placeholder="Define how the result will be verified and preserved" multiline />
              </div>
            </section>

            <section className="rounded-3xl border border-cyan-300/20 bg-cyan-300/[0.05] p-6 sm:p-8">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-300">Active gate</p>
                  <h2 className="mt-2 text-3xl font-black text-white">{step.label}</h2>
                  <p className="mt-3 text-lg text-slate-200">{step.prompt}</p>
                  <p className="mt-3 max-w-3xl leading-7 text-slate-400">{step.guidance}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(["PASS", "HOLD", "UNRESOLVED"] as GateStatus[]).map((status) => (
                    <button key={status} type="button" onClick={() => updateStatus(status)} className={`rounded-full border px-4 py-2 text-xs font-black tracking-[0.14em] transition ${statuses[step.id] === status ? statusStyles[status] : "border-white/10 bg-black/10 text-slate-400 hover:border-white/25 hover:text-white"}`}>{status}</button>
                  ))}
                </div>
              </div>

              <label className="mt-6 block">
                <span className="text-sm font-bold text-white">Gate analysis</span>
                <textarea value={notes[step.id] || ""} onChange={(event) => setNotes((current) => ({ ...current, [step.id]: event.target.value }))} rows={7} placeholder="Record the evidence, uncertainty, conflict, authority condition, or corrective action for this gate." className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/40" />
              </label>
            </section>

            <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-bold text-white">Governance statement</p>
                  <p className="mt-1 text-sm leading-6 text-slate-400">No admissible evidence. No admissible execution. A route remains unresolved or held until every required condition has earned the right to proceed.</p>
                </div>
                <span className={`w-fit rounded-full border px-4 py-2 text-xs font-black tracking-[0.16em] ${finalDecision === "ALLOW" ? statusStyles.PASS : finalDecision === "HOLD" ? statusStyles.HOLD : statusStyles.UNRESOLVED}`}>{finalDecision}</span>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button type="button" onClick={saveStudio} className="rounded-full bg-cyan-300 px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-cyan-200">Save studio</button>
                <button type="button" onClick={resetStudio} className="rounded-full border border-white/15 px-5 py-3 text-sm font-bold text-slate-300 transition hover:border-white/30 hover:text-white">Reset</button>
                <Link href="/academy/assessment" className="rounded-full border border-violet-300/30 bg-violet-300/10 px-5 py-3 text-sm font-bold text-violet-100 transition hover:border-violet-300/50">Continue to Assessment</Link>
              </div>
              {saveState === "saved" && <p className="mt-4 text-sm text-emerald-300">Studio saved on this device.</p>}
              {saveState === "error" && <p className="mt-4 text-sm text-rose-300">The browser could not save the studio state.</p>}
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}

function SummaryCard({ label, value, emphasis = false }: { label: string; value: string; emphasis?: boolean }) {
  return (
    <div className={`rounded-2xl border p-5 ${emphasis ? "border-cyan-300/30 bg-cyan-300/[0.08]" : "border-white/10 bg-white/[0.04]"}`}>
      <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <p className={`mt-2 text-2xl font-black ${emphasis ? "text-cyan-200" : "text-white"}`}>{value}</p>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, multiline = false }: { label: string; value: string; onChange: (value: string) => void; placeholder: string; multiline?: boolean }) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-white">{label}</span>
      {multiline ? (
        <textarea value={value} onChange={(event) => onChange(event.target.value)} rows={5} placeholder={placeholder} className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/40" />
      ) : (
        <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/40" />
      )}
    </label>
  );
}
