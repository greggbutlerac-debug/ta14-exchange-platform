"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type RouteState = "ALLOW" | "HOLD" | "DENY" | "ESCALATE";

type RouteExample = {
  id: string;
  title: string;
  domain: string;
  consequence: string;
  state: RouteState;
  summary: string;
  failure?: string;
  anchors: Array<{
    label: string;
    value: string;
    status: "supported" | "limited" | "failed";
  }>;
};

type SavedProgress = {
  version: "1.0";
  completed: string[];
  notes: Record<string, string>;
  updatedAt: string;
};

const STORAGE_KEY = "ta14-academy-route-reading-center-v1";

const routeExamples: RouteExample[] = [
  {
    id: "allow",
    title: "Bounded equipment restart",
    domain: "Facilities operations",
    consequence: "Restore one air-handling unit after a verified protective trip.",
    state: "ALLOW",
    summary:
      "Current evidence, valid authority, preserved continuity, and a bounded execution plan support one controlled restart with post-action verification.",
    anchors: [
      { label: "Reality", value: "Protective trip occurred; no active fault remains.", status: "supported" },
      { label: "Record", value: "Timestamped controller history and technician measurements preserved.", status: "supported" },
      { label: "Continuity", value: "No material condition changed after inspection.", status: "supported" },
      { label: "Admissibility", value: "Evidence is current and sufficient for one restart decision.", status: "supported" },
      { label: "Binding", value: "Authorized facilities supervisor approved the bounded action.", status: "supported" },
      { label: "Commit", value: "Decision version and operating limits recorded before execution.", status: "supported" },
      { label: "Execution", value: "One restart only; no parameter changes permitted.", status: "supported" },
      { label: "Outcome", value: "Stable operation must be verified and preserved for 20 minutes.", status: "supported" },
    ],
  },
  {
    id: "hold",
    title: "Automated account suspension",
    domain: "Identity governance",
    consequence: "Suspend a user account based on an anomaly alert.",
    state: "HOLD",
    summary:
      "The alert is relevant, but the evidence is stale and the current authority boundary is incomplete. Execution must pause until the gaps are resolved.",
    failure: "Evidence currency and binding authority are unresolved.",
    anchors: [
      { label: "Reality", value: "Anomaly alert indicates unusual access behavior.", status: "supported" },
      { label: "Record", value: "Alert and source events are attributable.", status: "supported" },
      { label: "Continuity", value: "Latest identity state was not revalidated.", status: "failed" },
      { label: "Admissibility", value: "Evidence may no longer describe the present condition.", status: "limited" },
      { label: "Binding", value: "System role permits review but not automatic suspension.", status: "failed" },
      { label: "Commit", value: "No valid decision may be committed yet.", status: "limited" },
      { label: "Execution", value: "Suspension is blocked pending revalidation.", status: "failed" },
      { label: "Outcome", value: "No consequence is allowed to bind while held.", status: "supported" },
    ],
  },
  {
    id: "deny",
    title: "Unsupported reimbursement approval",
    domain: "Financial operations",
    consequence: "Release a reimbursement without required source documentation.",
    state: "DENY",
    summary:
      "The required evidence does not exist, and policy does not authorize a substitute. The requested execution is outside the admissible boundary.",
    failure: "Required evidence is absent and cannot be inferred.",
    anchors: [
      { label: "Reality", value: "A reimbursement request exists.", status: "supported" },
      { label: "Record", value: "Required receipt and approval record are absent.", status: "failed" },
      { label: "Continuity", value: "There is no preserved source chain to validate.", status: "failed" },
      { label: "Admissibility", value: "The request cannot satisfy the evidence threshold.", status: "failed" },
      { label: "Binding", value: "No authority exists to waive the mandatory record.", status: "failed" },
      { label: "Commit", value: "A valid approval state cannot be created.", status: "failed" },
      { label: "Execution", value: "Payment release is prohibited.", status: "failed" },
      { label: "Outcome", value: "Denial and reason are preserved for challenge and correction.", status: "supported" },
    ],
  },
  {
    id: "escalate",
    title: "Conflicting clinical routing evidence",
    domain: "High-consequence workflow",
    consequence: "Route a case where two authoritative records materially conflict.",
    state: "ESCALATE",
    summary:
      "The system cannot resolve the conflict within its authorized scope. The case must move to a qualified decision authority without silently favoring either record.",
    failure: "Conflicting admissible sources require higher authority review.",
    anchors: [
      { label: "Reality", value: "A consequential routing decision is pending.", status: "supported" },
      { label: "Record", value: "Two attributable records contain incompatible instructions.", status: "limited" },
      { label: "Continuity", value: "Both records are current and preserved.", status: "supported" },
      { label: "Admissibility", value: "Each record is relevant; neither can be silently displaced.", status: "limited" },
      { label: "Binding", value: "Current reviewer lacks authority to resolve the conflict.", status: "failed" },
      { label: "Commit", value: "Escalation state and conflict are preserved.", status: "supported" },
      { label: "Execution", value: "No downstream action occurs before qualified review.", status: "supported" },
      { label: "Outcome", value: "Resolution must return with attributable authority and rationale.", status: "supported" },
    ],
  },
];

const stateStyles: Record<RouteState, string> = {
  ALLOW: "border-emerald-300/40 bg-emerald-300/10 text-emerald-100",
  HOLD: "border-amber-300/40 bg-amber-300/10 text-amber-100",
  DENY: "border-rose-300/40 bg-rose-300/10 text-rose-100",
  ESCALATE: "border-violet-300/40 bg-violet-300/10 text-violet-100",
};

const anchorStyles = {
  supported: "border-emerald-300/25 bg-emerald-300/[0.07]",
  limited: "border-amber-300/25 bg-amber-300/[0.07]",
  failed: "border-rose-300/25 bg-rose-300/[0.07]",
};

export default function RouteReadingCenterPage() {
  const [activeId, setActiveId] = useState(routeExamples[0].id);
  const [completed, setCompleted] = useState<string[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [saveState, setSaveState] = useState<"idle" | "saved" | "error">("idle");

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as SavedProgress;
      if (saved.version !== "1.0") return;
      setCompleted(saved.completed || []);
      setNotes(saved.notes || {});
    } catch {
      setSaveState("error");
    }
  }, []);

  const activeRoute = useMemo(
    () => routeExamples.find((route) => route.id === activeId) ?? routeExamples[0],
    [activeId],
  );

  const progress = Math.round((completed.length / routeExamples.length) * 100);

  function toggleCompleted(id: string) {
    setCompleted((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
    setSaveState("idle");
  }

  function saveProgress() {
    try {
      const payload: SavedProgress = {
        version: "1.0",
        completed,
        notes,
        updatedAt: new Date().toISOString(),
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
        <div className="absolute left-[6%] top-20 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute right-[5%] top-60 h-96 w-96 rounded-full bg-violet-500/10 blur-3xl" />
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
              <small className="text-xs text-slate-400">Route Reading Center</small>
            </span>
          </Link>
          <nav className="flex flex-wrap gap-2 text-sm" aria-label="Academy navigation">
            <Link href="/academy/dashboard" className="rounded-full border border-white/10 px-4 py-2 text-slate-300 transition hover:border-cyan-300/40 hover:text-white">
              Mission Control
            </Link>
            <Link href="/academy/architecture-explorer" className="rounded-full border border-white/10 px-4 py-2 text-slate-300 transition hover:border-cyan-300/40 hover:text-white">
              Architecture Explorer
            </Link>
            <Link href="/academy/simulator" className="rounded-full border border-white/10 px-4 py-2 text-slate-300 transition hover:border-cyan-300/40 hover:text-white">
              Simulator
            </Link>
          </nav>
        </header>

        <section className="py-12 lg:py-16">
          <p className="mb-4 text-xs font-black uppercase tracking-[0.28em] text-cyan-300">Read before you build</p>
          <h1 className="max-w-5xl text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
            Learn to read a governed route before constructing one.
          </h1>
          <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-300">
            Inspect complete and defective routes across four decision states. Identify where evidence, continuity, authority, or execution boundaries support the result—and where the chain must stop.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <SummaryCard label="Examples reviewed" value={`${completed.length}/${routeExamples.length}`} />
            <SummaryCard label="Learning progress" value={`${progress}%`} />
            <SummaryCard label="Governing rule" value="Evidence before consequence" wide />
          </div>
          <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-cyan-300 transition-all" style={{ width: `${progress}%` }} />
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[330px_1fr]">
          <aside className="rounded-3xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl">
            <p className="px-2 pb-3 text-xs font-black uppercase tracking-[0.22em] text-slate-400">Demonstration routes</p>
            <div className="space-y-2">
              {routeExamples.map((route, index) => {
                const isActive = route.id === activeRoute.id;
                const isComplete = completed.includes(route.id);
                return (
                  <button
                    key={route.id}
                    type="button"
                    onClick={() => setActiveId(route.id)}
                    className={`w-full rounded-2xl border p-4 text-left transition ${
                      isActive
                        ? "border-cyan-300/40 bg-cyan-300/10"
                        : "border-white/10 bg-black/10 hover:border-white/20 hover:bg-white/[0.04]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs font-black tracking-[0.18em] text-cyan-200">{String(index + 1).padStart(2, "0")}</span>
                      <span className={`rounded-full border px-2 py-1 text-[10px] font-black tracking-[0.12em] ${stateStyles[route.state]}`}>
                        {route.state}
                      </span>
                    </div>
                    <strong className="mt-3 block text-sm text-white">{route.title}</strong>
                    <span className="mt-1 block text-xs leading-5 text-slate-400">{route.domain}</span>
                    {isComplete ? <span className="mt-3 block text-xs font-bold text-emerald-200">Reviewed</span> : null}
                  </button>
                );
              })}
            </div>
          </aside>

          <div className="space-y-6">
            <article className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl sm:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-300">{activeRoute.domain}</p>
                  <h2 className="mt-3 text-3xl font-black text-white">{activeRoute.title}</h2>
                </div>
                <span className={`w-fit rounded-full border px-4 py-2 text-xs font-black tracking-[0.16em] ${stateStyles[activeRoute.state]}`}>
                  {activeRoute.state}
                </span>
              </div>

              <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-5">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Proposed consequence</p>
                <p className="mt-2 leading-7 text-slate-200">{activeRoute.consequence}</p>
              </div>

              <p className="mt-6 text-base leading-7 text-slate-300">{activeRoute.summary}</p>
              {activeRoute.failure ? (
                <div className="mt-5 rounded-2xl border border-amber-300/25 bg-amber-300/[0.07] p-4">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-200">Decisive condition</p>
                  <p className="mt-2 text-sm leading-6 text-amber-50">{activeRoute.failure}</p>
                </div>
              ) : null}
            </article>

            <section className="grid gap-4 md:grid-cols-2" aria-label="Route anchors">
              {activeRoute.anchors.map((anchor, index) => (
                <article key={anchor.label} className={`rounded-2xl border p-5 ${anchorStyles[anchor.status]}`}>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-black tracking-[0.18em] text-cyan-200">{String(index + 1).padStart(2, "0")}</span>
                    <span className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-300">{anchor.status}</span>
                  </div>
                  <h3 className="mt-3 text-lg font-black text-white">{anchor.label}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{anchor.value}</p>
                </article>
              ))}
            </section>

            <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl sm:p-8">
              <label htmlFor="route-notes" className="text-xs font-black uppercase tracking-[0.22em] text-cyan-300">
                Learner analysis
              </label>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Record the earliest failed or limited condition, the reason for the final state, and what would be required to change it.
              </p>
              <textarea
                id="route-notes"
                value={notes[activeRoute.id] || ""}
                onChange={(event) => {
                  setNotes((current) => ({ ...current, [activeRoute.id]: event.target.value }));
                  setSaveState("idle");
                }}
                rows={7}
                className="mt-4 w-full rounded-2xl border border-white/10 bg-black/20 p-4 text-sm leading-6 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/40"
                placeholder="Example: The route cannot proceed because continuity was not revalidated after the identity state changed..."
              />

              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={() => toggleCompleted(activeRoute.id)}
                  className={`rounded-xl border px-5 py-3 text-sm font-black transition ${
                    completed.includes(activeRoute.id)
                      ? "border-emerald-300/35 bg-emerald-300/10 text-emerald-100"
                      : "border-cyan-300/35 bg-cyan-300/10 text-cyan-100 hover:bg-cyan-300/15"
                  }`}
                >
                  {completed.includes(activeRoute.id) ? "Reviewed ✓" : "Mark example reviewed"}
                </button>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400" role="status">
                    {saveState === "saved" ? "Progress saved locally." : saveState === "error" ? "Progress could not be saved." : ""}
                  </span>
                  <button type="button" onClick={saveProgress} className="rounded-xl bg-white px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-cyan-100">
                    Save progress
                  </button>
                </div>
              </div>
            </section>
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-cyan-300/20 bg-cyan-300/[0.06] p-7 sm:p-9">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-200">Reading discipline</p>
          <h2 className="mt-3 text-2xl font-black text-white">Do not begin with the desired outcome.</h2>
          <p className="mt-4 max-w-4xl leading-7 text-slate-300">
            Read from reality forward. The first unsupported condition controls the route. A favorable objective cannot repair missing evidence, stale continuity, invalid authority, or execution beyond the committed boundary.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/academy/governance-thinking" className="rounded-xl border border-white/15 px-5 py-3 text-sm font-black text-white transition hover:border-cyan-300/40 hover:bg-white/[0.04]">
              Return to Governance Thinking
            </Link>
            <Link href="/academy/simulator" className="rounded-xl bg-cyan-200 px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-cyan-100">
              Continue to Simulator
            </Link>
          </div>
        </section>

        <footer className="mt-10 border-t border-white/10 py-8 text-center text-xs leading-6 text-slate-500">
          No admissible evidence. No admissible execution. Route completion reflects learner analysis and does not grant operational authority.
        </footer>
      </div>
    </main>
  );
}

function SummaryCard({ label, value, wide = false }: { label: string; value: string; wide?: boolean }) {
  return (
    <div className={`rounded-2xl border border-white/10 bg-white/[0.04] p-5 ${wide ? "md:col-span-1" : ""}`}>
      <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">{label}</p>
      <p className="mt-2 text-xl font-black text-white">{value}</p>
    </div>
  );
}
