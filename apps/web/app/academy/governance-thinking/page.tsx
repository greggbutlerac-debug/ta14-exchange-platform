"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type FramingField = {
  id: "problem" | "consequence" | "actors" | "uncertainty" | "evidence" | "authority" | "boundary" | "question";
  number: string;
  title: string;
  prompt: string;
  guidance: string;
  placeholder: string;
};

type SavedFraming = {
  version: "1.0";
  updatedAt: string;
  values: Record<FramingField["id"], string>;
  unresolved: FramingField["id"][];
};

const STORAGE_KEY = "ta14-academy-governance-thinking-v1";

const fields: FramingField[] = [
  {
    id: "problem",
    number: "01",
    title: "Define the problem",
    prompt: "What decision or action needs governance?",
    guidance: "Describe the action without assuming that it should be approved or automated.",
    placeholder: "Example: Determine whether an AI agent may release a customer refund above the routine approval threshold.",
  },
  {
    id: "consequence",
    number: "02",
    title: "Name the consequence",
    prompt: "What could bind to reality if the action proceeds?",
    guidance: "Identify the real-world effect, the affected party, and what cannot be treated as merely informational.",
    placeholder: "Describe the financial, legal, operational, environmental, safety, or human consequence.",
  },
  {
    id: "actors",
    number: "03",
    title: "Map the actors",
    prompt: "Who requests, authorizes, executes, reviews, and is affected?",
    guidance: "Separate identity from role and role from authority. One person or system may occupy more than one role only when that overlap is valid and declared.",
    placeholder: "Requester, authorizer, executor, reviewer, affected persons, systems, or institutions.",
  },
  {
    id: "uncertainty",
    number: "04",
    title: "Declare uncertainty",
    prompt: "What is unknown, disputed, stale, incomplete, or likely to change?",
    guidance: "Uncertainty is a governed condition. Do not erase it to make the route easier to complete.",
    placeholder: "List unknown facts, disputed records, changing dependencies, timing risks, or unresolved assumptions.",
  },
  {
    id: "evidence",
    number: "05",
    title: "Identify required evidence",
    prompt: "What evidence would be necessary before consequence may proceed?",
    guidance: "Name the evidence requirements, not merely the documents that happen to be available.",
    placeholder: "Required observations, records, provenance, attribution, freshness, corroboration, or outcome evidence.",
  },
  {
    id: "authority",
    number: "06",
    title: "Identify authority",
    prompt: "What authority applies, to whom, for what action, and for how long?",
    guidance: "A policy, framework, credential, or job title is not automatically authority for this exact execution.",
    placeholder: "Authority source, scope, actor, effective dates, limitations, revocation, or escalation path.",
  },
  {
    id: "boundary",
    number: "07",
    title: "Locate the execution boundary",
    prompt: "At what point would the action become consequence-bearing?",
    guidance: "Distinguish analysis, recommendation, approval, binding, commit, and execution.",
    placeholder: "Describe the point after which the action changes a system, person, record, environment, right, obligation, or resource.",
  },
  {
    id: "question",
    number: "08",
    title: "Form the governing question",
    prompt: "What must be proven before this specific action may proceed now?",
    guidance: "The governing question should be answerable through evidence, authority, continuity, admissibility, and a declared determination.",
    placeholder: "Example: Has this refund earned the right to proceed now, under the current evidence, authority, continuity, and execution boundary?",
  },
];

const emptyValues = Object.fromEntries(fields.map((field) => [field.id, ""])) as Record<FramingField["id"], string>;

export default function GovernanceThinkingPage() {
  const [values, setValues] = useState<Record<FramingField["id"], string>>(emptyValues);
  const [unresolved, setUnresolved] = useState<FramingField["id"][]>([]);
  const [saveState, setSaveState] = useState<"idle" | "saved" | "error">("idle");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as SavedFraming;
        if (parsed?.version === "1.0" && parsed.values) {
          setValues({ ...emptyValues, ...parsed.values });
          setUnresolved(Array.isArray(parsed.unresolved) ? parsed.unresolved : []);
        }
      }
    } catch {
      setSaveState("error");
    } finally {
      setHydrated(true);
    }
  }, []);

  const completedCount = useMemo(
    () => fields.filter((field) => values[field.id].trim().length > 0 || unresolved.includes(field.id)).length,
    [values, unresolved],
  );

  const ready = completedCount === fields.length;
  const unresolvedCount = unresolved.length;
  const progress = Math.round((completedCount / fields.length) * 100);

  function updateValue(id: FramingField["id"], value: string) {
    setValues((current) => ({ ...current, [id]: value }));
    if (value.trim()) setUnresolved((current) => current.filter((item) => item !== id));
    setSaveState("idle");
  }

  function toggleUnresolved(id: FramingField["id"]) {
    setUnresolved((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
    setValues((current) => ({ ...current, [id]: "" }));
    setSaveState("idle");
  }

  function saveFraming() {
    try {
      const payload: SavedFraming = {
        version: "1.0",
        updatedAt: new Date().toISOString(),
        values,
        unresolved,
      };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      setSaveState("saved");
    } catch {
      setSaveState("error");
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030812] text-slate-100">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute left-[5%] top-20 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute right-[8%] top-72 h-96 w-96 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
        <header className="flex flex-col gap-5 border-b border-white/10 pb-7 lg:flex-row lg:items-center lg:justify-between">
          <Link href="/academy" className="group flex items-center gap-3">
            <span className="rounded-xl border border-cyan-300/30 bg-cyan-300/10 px-3 py-2 text-sm font-black tracking-[0.18em] text-cyan-200">TA-14</span>
            <span>
              <strong className="block text-sm text-white">Academy</strong>
              <small className="text-xs text-slate-400">Governance Thinking</small>
            </span>
          </Link>
          <nav className="flex flex-wrap gap-2 text-sm" aria-label="Academy navigation">
            <Link className="rounded-full border border-white/10 px-4 py-2 text-slate-300 transition hover:border-cyan-300/40 hover:text-white" href="/academy/start">Start Here</Link>
            <Link className="rounded-full border border-white/10 px-4 py-2 text-slate-300 transition hover:border-cyan-300/40 hover:text-white" href="/academy/dashboard">Mission Control</Link>
            <Link className="rounded-full border border-white/10 px-4 py-2 text-slate-300 transition hover:border-cyan-300/40 hover:text-white" href="/academy/what-is-a-route">Route Lessons</Link>
          </nav>
        </header>

        <section className="grid gap-8 py-14 lg:grid-cols-[1.35fr_.65fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-300">TA-14 Academy · Pre-build framing</p>
            <h1 className="mt-5 max-w-4xl text-4xl font-black tracking-tight text-white sm:text-6xl">Govern the problem before you automate the answer.</h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">Frame the consequence, actors, uncertainty, evidence, authority, and execution boundary before entering guided route construction. This is educational preparation, not an operational authorization.</p>
          </div>
          <aside className="rounded-3xl border border-emerald-300/20 bg-emerald-300/[0.06] p-6 shadow-2xl shadow-black/20">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-emerald-200">Governing principle</p>
            <p className="mt-3 text-xl font-black leading-8 text-white">No admissible evidence. No admissible execution.</p>
            <p className="mt-4 text-sm leading-6 text-slate-300">Completion records framing progress. It does not establish competence, authority, admissibility, or permission to execute.</p>
          </aside>
        </section>

        <section className="sticky top-3 z-20 mb-8 rounded-2xl border border-white/10 bg-[#07101f]/90 p-4 shadow-2xl shadow-black/30 backdrop-blur-xl" aria-label="Framing progress">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="font-semibold text-white">Framing progress</span>
                <span className="text-slate-400">{completedCount} of {fields.length} conditions addressed</span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10" aria-label={`${progress}% complete`}>
                <div className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-blue-400 to-emerald-300 transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {unresolvedCount > 0 && <span className="rounded-full border border-amber-300/25 bg-amber-300/10 px-3 py-2 text-xs font-bold text-amber-100">{unresolvedCount} unresolved</span>}
              <button type="button" onClick={saveFraming} className="rounded-full bg-white px-5 py-2.5 text-sm font-black text-slate-950 transition hover:bg-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-300">Save framing</button>
            </div>
          </div>
          {hydrated && saveState === "saved" && <p className="mt-3 text-sm text-emerald-200" role="status">Saved locally on this device with the current framing version.</p>}
          {saveState === "error" && <p className="mt-3 text-sm text-rose-200" role="alert">The framing could not be preserved. Do not treat this work as saved.</p>}
        </section>

        <section className="space-y-5" aria-label="Governance framing conditions">
          {fields.map((field) => {
            const isUnresolved = unresolved.includes(field.id);
            return (
              <article key={field.id} className="grid overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] shadow-xl shadow-black/10 lg:grid-cols-[180px_1fr]">
                <div className="border-b border-white/10 bg-white/[0.025] p-6 lg:border-b-0 lg:border-r">
                  <span className="text-4xl font-black text-cyan-300/80">{field.number}</span>
                  <p className="mt-3 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Framing condition</p>
                </div>
                <div className="p-6 sm:p-8">
                  <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                    <div>
                      <h2 className="text-2xl font-black text-white">{field.title}</h2>
                      <p className="mt-2 text-lg font-semibold text-cyan-100">{field.prompt}</p>
                      <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-400">{field.guidance}</p>
                    </div>
                    <button type="button" aria-pressed={isUnresolved} onClick={() => toggleUnresolved(field.id)} className={`shrink-0 rounded-full border px-4 py-2 text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-amber-300 ${isUnresolved ? "border-amber-300/50 bg-amber-300/15 text-amber-100" : "border-white/15 text-slate-300 hover:border-amber-300/40 hover:text-white"}`}>{isUnresolved ? "Marked unresolved" : "I do not know"}</button>
                  </div>
                  <label className="mt-6 block">
                    <span className="sr-only">Response for {field.title}</span>
                    <textarea value={values[field.id]} disabled={isUnresolved} onChange={(event) => updateValue(field.id, event.target.value)} placeholder={isUnresolved ? "This condition is explicitly unresolved." : field.placeholder} rows={5} className="w-full resize-y rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-base leading-7 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/50 focus:ring-2 focus:ring-cyan-300/20 disabled:cursor-not-allowed disabled:border-amber-300/20 disabled:bg-amber-300/[0.04] disabled:text-amber-100" />
                  </label>
                </div>
              </article>
            );
          })}
        </section>

        <section className="mt-10 grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center rounded-3xl border border-cyan-300/20 bg-cyan-300/[0.05] p-7 sm:p-9">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-200">Next governed step</p>
            <h2 className="mt-3 text-2xl font-black text-white">{ready ? "Your framing is complete enough to continue." : "Address every condition before guided construction."}</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">Unresolved conditions remain visible and must travel forward as gaps. The next interface may explain their consequence, but it may not fabricate support or silently select a favorable determination.</p>
          </div>
          {ready ? (
            <Link href="/academy/what-is-a-route" className="rounded-full bg-cyan-200 px-6 py-3 text-center text-sm font-black text-slate-950 transition hover:bg-white">Continue to route foundations</Link>
          ) : (
            <a href="#top" onClick={(event) => { event.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="rounded-full border border-white/15 px-6 py-3 text-center text-sm font-black text-white transition hover:border-cyan-300/50">Review framing</a>
          )}
        </section>

        <footer className="mt-12 flex flex-col gap-3 border-t border-white/10 py-7 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>TA-14 Academy · Governance Thinking · Version 1.0</p>
          <p>Education and preserved framing are not execution permission.</p>
        </footer>
      </div>
    </main>
  );
}
