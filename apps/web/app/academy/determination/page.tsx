"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Decision = "ALLOW" | "HOLD" | "DENY" | "ESCALATE";
type Confidence = "High" | "Moderate" | "Low" | "Unresolved";

type DeterminationRecord = {
  version: "1.0";
  updatedAt: string;
  observableFacts: string;
  interpretedEvidence: string;
  conflictingEvidence: string;
  missingEvidence: string;
  primaryDetermination: string;
  secondaryDetermination: string;
  confidence: Confidence;
  decision: Decision;
  rationale: string;
};

const STORAGE_KEY = "ta14-academy-determination-v1";

const emptyRecord: Omit<DeterminationRecord, "version" | "updatedAt"> = {
  observableFacts: "",
  interpretedEvidence: "",
  conflictingEvidence: "",
  missingEvidence: "",
  primaryDetermination: "",
  secondaryDetermination: "",
  confidence: "Unresolved",
  decision: "HOLD",
  rationale: "",
};

const decisionCards: Array<{
  value: Decision;
  title: string;
  description: string;
  guardrail: string;
}> = [
  {
    value: "ALLOW",
    title: "ALLOW",
    description: "The specific action may proceed within the declared boundary.",
    guardrail: "Use only when evidence, continuity, authority, and conditions remain admissible now.",
  },
  {
    value: "HOLD",
    title: "HOLD",
    description: "The action must pause while a curable condition is resolved.",
    guardrail: "Use when evidence is missing, stale, disputed, incomplete, or awaiting revalidation.",
  },
  {
    value: "DENY",
    title: "DENY",
    description: "The action must not proceed under the present route or condition.",
    guardrail: "Use when the action is prohibited, outside the boundary, or cannot be made admissible.",
  },
  {
    value: "ESCALATE",
    title: "ESCALATE",
    description: "The action requires a different authority, reviewer, or decision path.",
    guardrail: "Use when the determination exceeds the actor's authority or unresolved consequence requires review.",
  },
];

const lessonCards = [
  {
    number: "01",
    title: "Observation is not determination",
    text: "Observable facts describe what was directly recorded. A determination states what those facts support under a defined standard and boundary.",
  },
  {
    number: "02",
    title: "Interpretation must remain traceable",
    text: "Every conclusion should point back to the evidence that supports it, including provenance, timing, conditions, and unresolved limitations.",
  },
  {
    number: "03",
    title: "Uncertainty is preserved",
    text: "A governed determination does not erase uncertainty. It declares what is known, what remains unresolved, and what consequence that uncertainty creates.",
  },
  {
    number: "04",
    title: "Determination is not execution",
    text: "A valid determination may support a later execution decision, but it does not itself create authority, binding, commit, or permission to act.",
  },
];

export default function DeterminationPage() {
  const [record, setRecord] = useState(emptyRecord);
  const [saveState, setSaveState] = useState<"idle" | "saved" | "error">("idle");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as DeterminationRecord;
        if (parsed?.version === "1.0") {
          setRecord({
            observableFacts: parsed.observableFacts ?? "",
            interpretedEvidence: parsed.interpretedEvidence ?? "",
            conflictingEvidence: parsed.conflictingEvidence ?? "",
            missingEvidence: parsed.missingEvidence ?? "",
            primaryDetermination: parsed.primaryDetermination ?? "",
            secondaryDetermination: parsed.secondaryDetermination ?? "",
            confidence: parsed.confidence ?? "Unresolved",
            decision: parsed.decision ?? "HOLD",
            rationale: parsed.rationale ?? "",
          });
        }
      }
    } catch {
      setSaveState("error");
    } finally {
      setHydrated(true);
    }
  }, []);

  const completedFields = useMemo(() => {
    const required = [
      record.observableFacts,
      record.interpretedEvidence,
      record.primaryDetermination,
      record.rationale,
    ];
    return required.filter((value) => value.trim().length > 0).length;
  }, [record]);

  const progress = Math.round((completedFields / 4) * 100);
  const ready = completedFields === 4 && record.confidence !== "Unresolved";

  function updateField<K extends keyof typeof emptyRecord>(key: K, value: (typeof emptyRecord)[K]) {
    setRecord((current) => ({ ...current, [key]: value }));
    setSaveState("idle");
  }

  function saveRecord() {
    try {
      const payload: DeterminationRecord = {
        version: "1.0",
        updatedAt: new Date().toISOString(),
        ...record,
      };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      setSaveState("saved");
    } catch {
      setSaveState("error");
    }
  }

  function resetRecord() {
    setRecord(emptyRecord);
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
        <div className="absolute left-[5%] top-20 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute right-[6%] top-64 h-96 w-96 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
        <header className="flex flex-col gap-5 border-b border-white/10 pb-7 lg:flex-row lg:items-center lg:justify-between">
          <Link href="/academy" className="group flex items-center gap-3">
            <span className="rounded-xl border border-cyan-300/30 bg-cyan-300/10 px-3 py-2 text-sm font-black tracking-[0.18em] text-cyan-200">
              TA-14
            </span>
            <span>
              <strong className="block text-sm text-white">Academy</strong>
              <small className="text-xs text-slate-400">Determination Discipline</small>
            </span>
          </Link>

          <nav className="flex flex-wrap gap-2 text-sm" aria-label="Academy navigation">
            <Link className="rounded-full border border-white/10 px-4 py-2 text-slate-300 transition hover:border-cyan-300/40 hover:text-white" href="/academy/dashboard">
              Mission Control
            </Link>
            <Link className="rounded-full border border-white/10 px-4 py-2 text-slate-300 transition hover:border-cyan-300/40 hover:text-white" href="/academy/governance-thinking">
              Governance Thinking
            </Link>
            <Link className="rounded-full border border-white/10 px-4 py-2 text-slate-300 transition hover:border-cyan-300/40 hover:text-white" href="/academy/admissibility">
              Admissibility
            </Link>
          </nav>
        </header>

        <section className="grid gap-8 py-14 lg:grid-cols-[1.35fr_.65fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-300">
              TA-14 Academy · Evidence-bound reasoning
            </p>
            <h1 className="mt-5 max-w-4xl text-4xl font-black tracking-tight text-white sm:text-6xl">
              A determination must say what the evidence supports—and no more.
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
              Separate observation from interpretation, preserve uncertainty, identify conflicting evidence, and declare the decision state without confusing analysis with authorization.
            </p>
          </div>

          <aside className="rounded-3xl border border-emerald-300/20 bg-emerald-300/[0.06] p-6 shadow-2xl shadow-black/20">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-emerald-200">Diagnostic truth</p>
            <p className="mt-3 text-xl font-black leading-8 text-white">A diagnostic determination is evidence-bound.</p>
            <p className="mt-4 text-sm leading-6 text-slate-300">
              It remains challengeable, attributable, limited to its boundary, and subject to revalidation when conditions change.
            </p>
          </aside>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {lessonCards.map((card) => (
            <article key={card.number} className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
              <span className="text-xs font-black tracking-[0.22em] text-cyan-300">{card.number}</span>
              <h2 className="mt-4 text-xl font-black text-white">{card.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-400">{card.text}</p>
            </article>
          ))}
        </section>

        <section className="sticky top-3 z-20 my-8 rounded-2xl border border-white/10 bg-[#07101f]/90 p-4 shadow-2xl shadow-black/30 backdrop-blur-xl" aria-label="Determination progress">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Record progress</p>
              <p className="mt-1 text-lg font-black text-white">{progress}% complete</p>
            </div>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10 sm:max-w-xl">
              <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-400 to-emerald-400 transition-all" style={{ width: `${progress}%` }} />
            </div>
            <span className={`rounded-full border px-4 py-2 text-xs font-black uppercase tracking-[0.16em] ${ready ? "border-emerald-300/30 bg-emerald-300/10 text-emerald-200" : "border-amber-300/30 bg-amber-300/10 text-amber-200"}`}>
              {ready ? "Framing complete" : "Determination incomplete"}
            </span>
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-[1.15fr_.85fr]">
          <div className="space-y-6">
            <DeterminationField
              label="Observable facts"
              description="Record only what was directly observed, measured, received, or preserved. Do not add interpretation here."
              value={record.observableFacts}
              onChange={(value) => updateField("observableFacts", value)}
              placeholder="What was directly observed or recorded? Include timing, source, measurement, and condition where known."
            />

            <DeterminationField
              label="Interpreted evidence"
              description="Explain what the observable facts support when interpreted under the applicable method, rule, or governing requirement."
              value={record.interpretedEvidence}
              onChange={(value) => updateField("interpretedEvidence", value)}
              placeholder="What does the evidence support, and what method or standard connects the evidence to that conclusion?"
            />

            <DeterminationField
              label="Conflicting evidence"
              description="Preserve evidence that disagrees with, weakens, or complicates the emerging conclusion."
              value={record.conflictingEvidence}
              onChange={(value) => updateField("conflictingEvidence", value)}
              placeholder="Identify any contradictory records, measurements, testimony, dependencies, or alternative explanations."
              optional
            />

            <DeterminationField
              label="Missing or insufficient evidence"
              description="Declare what remains unavailable, stale, disputed, or inadequate. Missing evidence must not be silently treated as satisfied."
              value={record.missingEvidence}
              onChange={(value) => updateField("missingEvidence", value)}
              placeholder="What still needs to be obtained, verified, refreshed, or resolved?"
              optional
            />

            <DeterminationField
              label="Primary determination"
              description="State the main evidence-bound conclusion in precise, bounded language."
              value={record.primaryDetermination}
              onChange={(value) => updateField("primaryDetermination", value)}
              placeholder="Example: The preserved evidence supports that the dependency changed after approval and requires revalidation before execution."
            />

            <DeterminationField
              label="Secondary determination"
              description="Record a subordinate, conditional, or alternative conclusion that may affect the route."
              value={record.secondaryDetermination}
              onChange={(value) => updateField("secondaryDetermination", value)}
              placeholder="Record any conditional or secondary conclusion."
              optional
            />
          </div>

          <div className="space-y-6">
            <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">Confidence declaration</p>
              <h2 className="mt-3 text-2xl font-black text-white">How strongly does the evidence support the determination?</h2>
              <div className="mt-5 grid grid-cols-2 gap-3">
                {(["High", "Moderate", "Low", "Unresolved"] as Confidence[]).map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => updateField("confidence", value)}
                    className={`rounded-2xl border px-4 py-4 text-left transition ${record.confidence === value ? "border-cyan-300/60 bg-cyan-300/10 text-white" : "border-white/10 bg-black/10 text-slate-400 hover:border-white/20 hover:text-white"}`}
                  >
                    <span className="text-sm font-black">{value}</span>
                  </button>
                ))}
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-400">
                Confidence describes support strength. It does not replace admissibility, authority, or execution controls.
              </p>
            </section>

            <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-violet-300">Decision state</p>
              <h2 className="mt-3 text-2xl font-black text-white">What should happen now?</h2>
              <div className="mt-5 space-y-3">
                {decisionCards.map((card) => (
                  <button
                    key={card.value}
                    type="button"
                    onClick={() => updateField("decision", card.value)}
                    className={`w-full rounded-2xl border p-4 text-left transition ${record.decision === card.value ? "border-violet-300/60 bg-violet-300/10" : "border-white/10 bg-black/10 hover:border-white/20"}`}
                  >
                    <span className="text-sm font-black text-white">{card.title}</span>
                    <span className="mt-1 block text-sm leading-6 text-slate-300">{card.description}</span>
                    <span className="mt-2 block text-xs leading-5 text-slate-500">{card.guardrail}</span>
                  </button>
                ))}
              </div>
            </section>

            <DeterminationField
              label="Decision rationale"
              description="Explain why the selected state follows from the evidence, uncertainty, authority, and present conditions."
              value={record.rationale}
              onChange={(value) => updateField("rationale", value)}
              placeholder="Why is this the correct present-state determination? What would have to change before a different state could be justified?"
              rows={8}
            />

            <section className="rounded-3xl border border-amber-300/20 bg-amber-300/[0.06] p-6">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-200">Boundary warning</p>
              <p className="mt-3 text-lg font-black text-white">This record is educational and nonbinding.</p>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Saving this page does not establish authority, legal standing, operational approval, competence, or permission to execute. It preserves a learning record only.
              </p>
            </section>
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-white/10 bg-[#07101f]/80 p-6 sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Local learning record</p>
              <h2 className="mt-2 text-2xl font-black text-white">Preserve this determination exercise.</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
                The record is stored only in this browser using local storage. No backend, certification, or execution approval is implied.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={resetRecord} className="rounded-full border border-white/10 px-5 py-3 text-sm font-black text-slate-300 transition hover:border-white/25 hover:text-white">
                Reset exercise
              </button>
              <button type="button" onClick={saveRecord} disabled={!hydrated} className="rounded-full border border-cyan-300/40 bg-cyan-300/10 px-5 py-3 text-sm font-black text-cyan-100 transition hover:border-cyan-300/70 disabled:cursor-not-allowed disabled:opacity-50">
                Save determination
              </button>
              <Link href="/academy/admissibility" className="rounded-full bg-white px-5 py-3 text-sm font-black text-[#07101f] transition hover:bg-cyan-100">
                Continue to admissibility
              </Link>
            </div>
          </div>

          {saveState !== "idle" && (
            <p className={`mt-5 text-sm font-semibold ${saveState === "saved" ? "text-emerald-300" : "text-rose-300"}`}>
              {saveState === "saved" ? "Determination exercise saved in this browser." : "The browser could not save this exercise."}
            </p>
          )}
        </section>

        <footer className="mt-12 flex flex-col gap-3 border-t border-white/10 py-7 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>TA-14 Academy · Determination Discipline · Version 1.0</p>
          <p>No admissible evidence. No admissible execution.</p>
        </footer>
      </div>
    </main>
  );
}

function DeterminationField({
  label,
  description,
  value,
  onChange,
  placeholder,
  optional = false,
  rows = 6,
}: {
  label: string;
  description: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  optional?: boolean;
  rows?: number;
}) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-black text-white">{label}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">{description}</p>
        </div>
        <span className={`rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] ${optional ? "border-white/10 text-slate-500" : "border-cyan-300/20 text-cyan-300"}`}>
          {optional ? "Optional" : "Required"}
        </span>
      </div>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="mt-5 w-full resize-y rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-sm leading-6 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/50 focus:ring-2 focus:ring-cyan-300/10"
      />
    </section>
  );
}
