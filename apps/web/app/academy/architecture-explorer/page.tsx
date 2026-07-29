"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type AnchorId =
  | "reality"
  | "record"
  | "continuity"
  | "admissibility"
  | "binding"
  | "commit"
  | "execution"
  | "outcome";

type ExplorerState = {
  version: "1.0";
  updatedAt: string;
  selectedAnchor: AnchorId;
  completedAnchors: AnchorId[];
  learnerNotes: Partial<Record<AnchorId, string>>;
};

type Anchor = {
  id: AnchorId;
  number: string;
  name: string;
  question: string;
  purpose: string;
  failure: string;
  evidence: string[];
  route: string;
};

const STORAGE_KEY = "ta14-academy-architecture-explorer-v1";

const anchors: Anchor[] = [
  {
    id: "reality",
    number: "01",
    name: "Reality",
    question: "What condition actually exists?",
    purpose:
      "Begin with the observed condition, event, request, or state that the route is intended to govern. Reality must be described before conclusions are introduced.",
    failure:
      "The route begins from assumption, preference, inherited narrative, or an unverified claim.",
    evidence: ["Direct observations", "Declared condition", "Time and place", "Known limitations"],
    route: "/academy/reality-and-record",
  },
  {
    id: "record",
    number: "02",
    name: "Record",
    question: "What preserved artifact represents that reality?",
    purpose:
      "Convert observed reality into an attributable, inspectable record with provenance, timing, scope, and custody sufficient for later challenge.",
    failure:
      "The route relies on memory, unpreserved output, unattributed data, or a record whose origin cannot be established.",
    evidence: ["Source identity", "Creation time", "Provenance", "Preserved content"],
    route: "/academy/reality-and-record",
  },
  {
    id: "continuity",
    number: "03",
    name: "Continuity",
    question: "Has the record remained intact and connected to the present decision?",
    purpose:
      "Establish that evidence has not been silently altered, detached from its source, superseded, or broken across time, systems, actors, or custody transitions.",
    failure:
      "A gap, substitution, stale dependency, missing handoff, or unexplained transformation breaks the evidentiary chain.",
    evidence: ["Custody history", "Version lineage", "Dependency state", "Change history"],
    route: "/academy/continuity",
  },
  {
    id: "admissibility",
    number: "04",
    name: "Admissibility",
    question: "May this evidence support this determination now?",
    purpose:
      "Test relevance, freshness, sufficiency, integrity, applicability, and required conditions before evidence is permitted to support consequence.",
    failure:
      "Evidence exists but is stale, incomplete, irrelevant, out of scope, contradicted, or otherwise unfit for the intended use.",
    evidence: ["Freshness test", "Scope test", "Sufficiency test", "Conflict resolution"],
    route: "/academy/admissibility",
  },
  {
    id: "binding",
    number: "05",
    name: "Binding",
    question: "What valid authority connects the determination to consequence?",
    purpose:
      "Identify the rule, permission, obligation, role, or authority that is valid for the actor, action, scope, jurisdiction, and effective period.",
    failure:
      "The actor is trusted or credentialed, but the specific authority required for this exact action is absent, expired, exceeded, or unclear.",
    evidence: ["Authority source", "Actor scope", "Effective period", "Applicable boundary"],
    route: "/academy/authority-and-binding",
  },
  {
    id: "commit",
    number: "06",
    name: "Commit",
    question: "What exact version and decision state is being fixed before action?",
    purpose:
      "Preserve the approved route state, determination, dependencies, conditions, and version so execution cannot silently drift from what was reviewed.",
    failure:
      "The action proceeds from a moving target, mutable instruction, unversioned route, or changed condition that was never revalidated.",
    evidence: ["Version identifier", "Decision state", "Boundary declaration", "Commit timestamp"],
    route: "/academy/commit-and-version-history",
  },
  {
    id: "execution",
    number: "07",
    name: "Execution",
    question: "Did the performed action correspond to the committed authorization?",
    purpose:
      "Control the transition from approved decision to real-world action and verify that execution remains within the declared route, actor, timing, and boundary.",
    failure:
      "The executed action differs from the committed action, exceeds scope, uses changed inputs, or continues after admissibility has drifted.",
    evidence: ["Execution identity", "Action trace", "Boundary checks", "Runtime revalidation"],
    route: "/academy/execution-correspondence",
  },
  {
    id: "outcome",
    number: "08",
    name: "Outcome",
    question: "What happened, and was the result preserved for verification?",
    purpose:
      "Capture the actual result, consequences, deviations, residual conditions, and evidence needed to verify whether execution produced the intended governed outcome.",
    failure:
      "The route records permission and action but not the resulting condition, leaving success, harm, deviation, and accountability unverifiable.",
    evidence: ["Observed result", "Expected-versus-actual", "Residual risk", "Outcome record"],
    route: "/academy/outcome-and-verification",
  },
];

const emptyNotes: Partial<Record<AnchorId, string>> = {};

export default function ArchitectureExplorerPage() {
  const [selectedAnchor, setSelectedAnchor] = useState<AnchorId>("reality");
  const [completedAnchors, setCompletedAnchors] = useState<AnchorId[]>([]);
  const [learnerNotes, setLearnerNotes] = useState<Partial<Record<AnchorId, string>>>(emptyNotes);
  const [saveState, setSaveState] = useState<"idle" | "saved" | "error">("idle");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as ExplorerState;
        if (parsed?.version === "1.0") {
          setSelectedAnchor(parsed.selectedAnchor ?? "reality");
          setCompletedAnchors(Array.isArray(parsed.completedAnchors) ? parsed.completedAnchors : []);
          setLearnerNotes(parsed.learnerNotes ?? emptyNotes);
        }
      }
    } catch {
      setSaveState("error");
    } finally {
      setHydrated(true);
    }
  }, []);

  const selected = useMemo(
    () => anchors.find((anchor) => anchor.id === selectedAnchor) ?? anchors[0],
    [selectedAnchor],
  );

  const progress = Math.round((completedAnchors.length / anchors.length) * 100);

  function selectAnchor(id: AnchorId) {
    setSelectedAnchor(id);
    setSaveState("idle");
  }

  function toggleComplete(id: AnchorId) {
    setCompletedAnchors((current) =>
      current.includes(id) ? current.filter((anchorId) => anchorId !== id) : [...current, id],
    );
    setSaveState("idle");
  }

  function updateNote(id: AnchorId, value: string) {
    setLearnerNotes((current) => ({ ...current, [id]: value }));
    setSaveState("idle");
  }

  function saveProgress() {
    try {
      const payload: ExplorerState = {
        version: "1.0",
        updatedAt: new Date().toISOString(),
        selectedAnchor,
        completedAnchors,
        learnerNotes,
      };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      setSaveState("saved");
    } catch {
      setSaveState("error");
    }
  }

  function resetProgress() {
    setSelectedAnchor("reality");
    setCompletedAnchors([]);
    setLearnerNotes(emptyNotes);
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
        <div className="absolute right-[8%] top-56 h-96 w-96 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-[38%] h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
        <header className="flex flex-col gap-5 border-b border-white/10 pb-7 lg:flex-row lg:items-center lg:justify-between">
          <Link href="/academy" className="group flex items-center gap-3">
            <span className="rounded-xl border border-cyan-300/30 bg-cyan-300/10 px-3 py-2 text-sm font-black tracking-[0.18em] text-cyan-200">
              TA-14
            </span>
            <span>
              <strong className="block text-sm text-white">Academy</strong>
              <small className="text-xs text-slate-400">Architecture Explorer</small>
            </span>
          </Link>

          <nav className="flex flex-wrap gap-2 text-sm" aria-label="Academy navigation">
            <Link className="rounded-full border border-white/10 px-4 py-2 text-slate-300 transition hover:border-cyan-300/40 hover:text-white" href="/academy/dashboard">
              Mission Control
            </Link>
            <Link className="rounded-full border border-white/10 px-4 py-2 text-slate-300 transition hover:border-cyan-300/40 hover:text-white" href="/academy/governance-thinking">
              Governance Thinking
            </Link>
            <Link className="rounded-full border border-white/10 px-4 py-2 text-slate-300 transition hover:border-cyan-300/40 hover:text-white" href="/academy/determination">
              Determination
            </Link>
          </nav>
        </header>

        <section className="grid gap-8 py-14 lg:grid-cols-[1.35fr_.65fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-300">
              TA-14 Academy · Read and explore
            </p>
            <h1 className="mt-5 max-w-5xl text-4xl font-black tracking-tight text-white sm:text-6xl">
              Follow the governed route from reality to verified outcome.
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
              Inspect the eight anchor architecture as one continuous control chain. Each anchor answers a different question, preserves a different class of evidence, and prevents a different form of governance failure.
            </p>
          </div>

          <aside className="rounded-3xl border border-cyan-300/20 bg-cyan-300/[0.06] p-6 shadow-2xl shadow-black/20">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-200">Controlling principle</p>
            <p className="mt-3 text-2xl font-black leading-8 text-white">No admissible evidence. No admissible execution.</p>
            <p className="mt-4 text-sm leading-6 text-slate-300">
              The explorer teaches the public eight-anchor architecture. It does not substitute for the official 24-link canon or authorize execution.
            </p>
          </aside>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-5 shadow-2xl shadow-black/20 sm:p-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Explorer progress</p>
              <p className="mt-2 text-2xl font-black text-white">{completedAnchors.length} of {anchors.length} anchors reviewed</p>
            </div>
            <div className="min-w-56">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>{hydrated ? "Saved locally when requested" : "Loading progress"}</span>
                <span>{progress}%</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-emerald-300 transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[.78fr_1.22fr]">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {anchors.map((anchor) => {
              const active = anchor.id === selectedAnchor;
              const complete = completedAnchors.includes(anchor.id);
              return (
                <button
                  key={anchor.id}
                  type="button"
                  onClick={() => selectAnchor(anchor.id)}
                  className={`group w-full rounded-2xl border p-4 text-left transition ${
                    active
                      ? "border-cyan-300/50 bg-cyan-300/[0.09] shadow-lg shadow-cyan-950/20"
                      : "border-white/10 bg-white/[0.025] hover:border-white/20 hover:bg-white/[0.05]"
                  }`}
                  aria-pressed={active}
                >
                  <div className="flex items-center gap-4">
                    <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border text-sm font-black ${
                      active ? "border-cyan-300/40 bg-cyan-300/10 text-cyan-200" : "border-white/10 bg-black/20 text-slate-400"
                    }`}>
                      {anchor.number}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-black text-white">{anchor.name}</span>
                      <span className="mt-1 block truncate text-xs text-slate-400">{anchor.question}</span>
                    </span>
                    <span className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] ${
                      complete ? "bg-emerald-300/15 text-emerald-200" : "bg-white/5 text-slate-500"
                    }`}>
                      {complete ? "Reviewed" : "Open"}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <article className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-6 shadow-2xl shadow-black/25 sm:p-8">
            <div className="flex flex-col gap-5 border-b border-white/10 pb-6 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-300">Anchor {selected.number}</p>
                <h2 className="mt-2 text-3xl font-black text-white sm:text-4xl">{selected.name}</h2>
                <p className="mt-3 text-lg font-semibold text-slate-200">{selected.question}</p>
              </div>
              <button
                type="button"
                onClick={() => toggleComplete(selected.id)}
                className={`rounded-xl border px-4 py-3 text-sm font-black transition ${
                  completedAnchors.includes(selected.id)
                    ? "border-emerald-300/40 bg-emerald-300/10 text-emerald-200"
                    : "border-white/15 bg-white/[0.04] text-slate-200 hover:border-cyan-300/40 hover:text-white"
                }`}
              >
                {completedAnchors.includes(selected.id) ? "Reviewed ✓" : "Mark reviewed"}
              </button>
            </div>

            <div className="grid gap-6 py-7 md:grid-cols-2">
              <section className="rounded-2xl border border-emerald-300/15 bg-emerald-300/[0.05] p-5">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-200">Purpose</p>
                <p className="mt-3 text-sm leading-7 text-slate-200">{selected.purpose}</p>
              </section>
              <section className="rounded-2xl border border-rose-300/15 bg-rose-300/[0.05] p-5">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-rose-200">Failure condition</p>
                <p className="mt-3 text-sm leading-7 text-slate-200">{selected.failure}</p>
              </section>
            </div>

            <section>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-violet-200">Evidence to inspect</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {selected.evidence.map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-slate-200">
                    <span className="h-2 w-2 rounded-full bg-violet-300" aria-hidden="true" />
                    {item}
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-7">
              <label htmlFor={`note-${selected.id}`} className="text-xs font-black uppercase tracking-[0.2em] text-slate-300">
                Learner inspection note
              </label>
              <textarea
                id={`note-${selected.id}`}
                value={learnerNotes[selected.id] ?? ""}
                onChange={(event) => updateNote(selected.id, event.target.value)}
                rows={5}
                placeholder={`Describe what must be established at the ${selected.name} anchor and what would force a HOLD.`}
                className="mt-3 w-full rounded-2xl border border-white/10 bg-[#07111f] px-4 py-4 text-sm leading-6 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/40 focus:ring-2 focus:ring-cyan-300/10"
              />
            </section>

            <div className="mt-7 flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <Link href={selected.route} className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-cyan-100">
                Open full lesson →
              </Link>
              <p className="text-xs leading-5 text-slate-500">Review status indicates learning progress only. It does not establish competency or execution authority.</p>
            </div>
          </article>
        </section>

        <section className="mt-8 rounded-3xl border border-amber-300/20 bg-amber-300/[0.055] p-6 sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-amber-200">Architecture discipline</p>
              <h2 className="mt-3 text-2xl font-black text-white">An anchor cannot repair a failure hidden upstream.</h2>
              <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-300">
                A valid authority cannot cure broken continuity. A clean commit cannot make stale evidence admissible. A preserved outcome cannot retroactively authorize an execution. The route must survive challenge in sequence, and changed conditions require revalidation at the earliest affected point.
              </p>
            </div>
            <Link href="/academy/simulator" className="inline-flex items-center justify-center rounded-xl border border-amber-200/30 bg-amber-200/10 px-5 py-3 text-sm font-black text-amber-100 transition hover:bg-amber-200/15">
              Test the chain
            </Link>
          </div>
        </section>

        <section className="mt-8 flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Local learner record</p>
            <p className="mt-2 text-sm text-slate-300">
              {saveState === "saved" && "Progress saved in this browser."}
              {saveState === "error" && "Progress could not be saved in this browser."}
              {saveState === "idle" && "Save your reviewed anchors and inspection notes before leaving."}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={resetProgress} className="rounded-xl border border-white/10 px-4 py-3 text-sm font-bold text-slate-400 transition hover:border-rose-300/30 hover:text-rose-200">
              Reset
            </button>
            <button type="button" onClick={saveProgress} className="rounded-xl bg-cyan-300 px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-cyan-200">
              Save progress
            </button>
          </div>
        </section>

        <footer className="mt-10 flex flex-col gap-4 border-t border-white/10 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>TA-14 Academy · Architecture Explorer</p>
          <div className="flex flex-wrap gap-4">
            <Link className="transition hover:text-white" href="/academy/governance-thinking">← Governance Thinking</Link>
            <Link className="transition hover:text-white" href="/academy/what-is-a-route">What Is a Route →</Link>
          </div>
        </footer>
      </div>
    </main>
  );
}
