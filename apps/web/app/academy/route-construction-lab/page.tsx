"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type DecisionState = "ALLOW" | "HOLD" | "DENY" | "ESCALATE";
type AnchorKey =
  | "reality"
  | "record"
  | "continuity"
  | "admissibility"
  | "binding"
  | "commit"
  | "execution"
  | "outcome";

type RouteDraft = Record<AnchorKey, string> & {
  title: string;
  consequence: string;
  decision: DecisionState;
  rationale: string;
};

const STORAGE_KEY = "ta14-academy-route-construction-lab-v1";

const anchors: Array<{
  key: AnchorKey;
  label: string;
  question: string;
  placeholder: string;
}> = [
  {
    key: "reality",
    label: "Reality",
    question: "What condition actually exists now?",
    placeholder: "State the present condition without interpretation or recommendation.",
  },
  {
    key: "record",
    label: "Record",
    question: "What attributable evidence preserves that reality?",
    placeholder: "Identify the source, timestamp, author, instrument, or system record.",
  },
  {
    key: "continuity",
    label: "Continuity",
    question: "What proves the evidence still corresponds to the current condition?",
    placeholder: "Describe revalidation, elapsed time, custody, version, or material change checks.",
  },
  {
    key: "admissibility",
    label: "Admissibility",
    question: "Why is this evidence sufficient for this exact decision?",
    placeholder: "Define relevance, currency, sufficiency, conflict status, and unresolved limits.",
  },
  {
    key: "binding",
    label: "Binding",
    question: "Who or what has authority to bind this decision?",
    placeholder: "Name the role, policy, delegation, jurisdiction, and scope boundary.",
  },
  {
    key: "commit",
    label: "Commit",
    question: "What must be fixed before execution begins?",
    placeholder: "Preserve the approved state, limits, version, rationale, and responsible authority.",
  },
  {
    key: "execution",
    label: "Execution",
    question: "What exact action is permitted, prohibited, or paused?",
    placeholder: "Define the action, sequence, duration, limits, stop conditions, and operator.",
  },
  {
    key: "outcome",
    label: "Outcome",
    question: "What result must be verified and preserved afterward?",
    placeholder: "Define success, failure, observation period, evidence capture, and challenge path.",
  },
];

const initialDraft: RouteDraft = {
  title: "",
  consequence: "",
  reality: "",
  record: "",
  continuity: "",
  admissibility: "",
  binding: "",
  commit: "",
  execution: "",
  outcome: "",
  decision: "HOLD",
  rationale: "",
};

const decisionStyles: Record<DecisionState, string> = {
  ALLOW: "border-emerald-300/40 bg-emerald-300/10 text-emerald-100",
  HOLD: "border-amber-300/40 bg-amber-300/10 text-amber-100",
  DENY: "border-rose-300/40 bg-rose-300/10 text-rose-100",
  ESCALATE: "border-violet-300/40 bg-violet-300/10 text-violet-100",
};

export default function RouteConstructionLabPage() {
  const [draft, setDraft] = useState<RouteDraft>(initialDraft);
  const [activeAnchor, setActiveAnchor] = useState<AnchorKey>("reality");
  const [saveState, setSaveState] = useState<"idle" | "saved" | "error">("idle");

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<RouteDraft>;
      setDraft({ ...initialDraft, ...parsed });
    } catch {
      setSaveState("error");
    }
  }, []);

  const completedAnchors = useMemo(
    () => anchors.filter((anchor) => draft[anchor.key].trim().length >= 20).length,
    [draft],
  );

  const readiness = Math.round((completedAnchors / anchors.length) * 100);
  const active = anchors.find((anchor) => anchor.key === activeAnchor) ?? anchors[0];
  const canFinalize =
    draft.title.trim().length >= 4 &&
    draft.consequence.trim().length >= 20 &&
    completedAnchors === anchors.length &&
    draft.rationale.trim().length >= 30;

  function updateField<K extends keyof RouteDraft>(key: K, value: RouteDraft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
    setSaveState("idle");
  }

  function saveDraft() {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
      setSaveState("saved");
    } catch {
      setSaveState("error");
    }
  }

  function resetDraft() {
    setDraft(initialDraft);
    setActiveAnchor("reality");
    setSaveState("idle");
    window.localStorage.removeItem(STORAGE_KEY);
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030812] text-slate-100">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute left-[4%] top-20 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute right-[8%] top-56 h-96 w-96 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-[40%] h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
        <header className="flex flex-col gap-5 border-b border-white/10 pb-7 lg:flex-row lg:items-center lg:justify-between">
          <Link href="/academy" className="flex items-center gap-3">
            <span className="rounded-xl border border-cyan-300/30 bg-cyan-300/10 px-3 py-2 text-sm font-black tracking-[0.18em] text-cyan-200">
              TA-14
            </span>
            <span>
              <strong className="block text-sm text-white">Academy</strong>
              <small className="text-xs text-slate-400">Route Construction Lab</small>
            </span>
          </Link>
          <nav className="flex flex-wrap gap-2 text-sm" aria-label="Academy navigation">
            <Link href="/academy/routes" className="rounded-full border border-white/10 px-4 py-2 text-slate-300 transition hover:border-cyan-300/40 hover:text-white">
              Route Reading Center
            </Link>
            <Link href="/academy/simulator" className="rounded-full border border-white/10 px-4 py-2 text-slate-300 transition hover:border-cyan-300/40 hover:text-white">
              Simulator
            </Link>
            <Link href="/academy/dashboard" className="rounded-full border border-white/10 px-4 py-2 text-slate-300 transition hover:border-cyan-300/40 hover:text-white">
              Mission Control
            </Link>
          </nav>
        </header>

        <section className="py-12 lg:py-16">
          <p className="mb-4 text-xs font-black uppercase tracking-[0.28em] text-cyan-300">Construct before consequence</p>
          <h1 className="max-w-5xl text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
            Build a governed route one admissible anchor at a time.
          </h1>
          <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-300">
            Convert a consequential request into a bounded, reviewable route. This laboratory does not authorize execution. It teaches the structure required before an execution decision can be defended.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <SummaryCard label="Anchors complete" value={`${completedAnchors}/${anchors.length}`} />
            <SummaryCard label="Route readiness" value={`${readiness}%`} />
            <SummaryCard label="Current decision" value={draft.decision} className={decisionStyles[draft.decision]} />
          </div>
          <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-cyan-300 transition-all" style={{ width: `${readiness}%` }} />
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[340px_1fr]">
          <aside className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">Route identity</p>
              <label className="mt-5 block text-sm font-bold text-white" htmlFor="route-title">Route title</label>
              <input
                id="route-title"
                value={draft.title}
                onChange={(event) => updateField("title", event.target.value)}
                placeholder="Example: Bounded equipment restart"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/40"
              />

              <label className="mt-5 block text-sm font-bold text-white" htmlFor="route-consequence">Consequence</label>
              <textarea
                id="route-consequence"
                rows={5}
                value={draft.consequence}
                onChange={(event) => updateField("consequence", event.target.value)}
                placeholder="What will bind to reality if this route executes?"
                className="mt-2 w-full resize-none rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/40"
              />
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl">
              <p className="px-2 pb-3 text-xs font-black uppercase tracking-[0.22em] text-slate-400">Eight anchors</p>
              <div className="space-y-2">
                {anchors.map((anchor, index) => {
                  const complete = draft[anchor.key].trim().length >= 20;
                  const selected = activeAnchor === anchor.key;
                  return (
                    <button
                      key={anchor.key}
                      type="button"
                      onClick={() => setActiveAnchor(anchor.key)}
                      className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition ${
                        selected
                          ? "border-cyan-300/40 bg-cyan-300/10"
                          : "border-white/10 bg-black/10 hover:border-white/20"
                      }`}
                    >
                      <span>
                        <small className="block text-[10px] font-black tracking-[0.18em] text-cyan-200">{String(index + 1).padStart(2, "0")}</small>
                        <strong className="mt-1 block text-sm text-white">{anchor.label}</strong>
                      </span>
                      <span className={`h-2.5 w-2.5 rounded-full ${complete ? "bg-emerald-300" : "bg-slate-700"}`} aria-label={complete ? "Complete" : "Incomplete"} />
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          <div className="space-y-6">
            <article className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl sm:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-300">Active anchor</p>
                  <h2 className="mt-2 text-3xl font-black text-white">{active.label}</h2>
                  <p className="mt-3 max-w-3xl text-base leading-7 text-slate-300">{active.question}</p>
                </div>
                <span className={`rounded-full border px-3 py-2 text-xs font-black tracking-[0.15em] ${draft[active.key].trim().length >= 20 ? "border-emerald-300/40 bg-emerald-300/10 text-emerald-100" : "border-white/10 bg-white/[0.04] text-slate-400"}`}>
                  {draft[active.key].trim().length >= 20 ? "SUFFICIENT DETAIL" : "IN DEVELOPMENT"}
                </span>
              </div>

              <textarea
                rows={10}
                value={draft[active.key]}
                onChange={(event) => updateField(active.key, event.target.value)}
                placeholder={active.placeholder}
                className="mt-7 w-full resize-y rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-base leading-7 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/40"
              />
              <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                <span>Minimum learning threshold: 20 characters</span>
                <span>{draft[active.key].trim().length} characters</span>
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                {anchors.map((anchor, index) =>
                  anchor.key === activeAnchor ? null : (
                    <button
                      key={anchor.key}
                      type="button"
                      onClick={() => setActiveAnchor(anchor.key)}
                      className="rounded-full border border-white/10 px-4 py-2 text-xs font-bold text-slate-300 transition hover:border-cyan-300/40 hover:text-white"
                    >
                      {index + 1}. {anchor.label}
                    </button>
                  ),
                )}
              </div>
            </article>

            <article className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl sm:p-8">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-300">Decision discipline</p>
              <h2 className="mt-2 text-2xl font-black text-white">Choose the route state supported by the chain.</h2>
              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {(["ALLOW", "HOLD", "DENY", "ESCALATE"] as DecisionState[]).map((decision) => (
                  <button
                    key={decision}
                    type="button"
                    onClick={() => updateField("decision", decision)}
                    className={`rounded-2xl border px-4 py-4 text-sm font-black tracking-[0.14em] transition ${
                      draft.decision === decision ? decisionStyles[decision] : "border-white/10 bg-black/10 text-slate-400 hover:border-white/20"
                    }`}
                  >
                    {decision}
                  </button>
                ))}
              </div>

              <label className="mt-7 block text-sm font-bold text-white" htmlFor="route-rationale">Decision rationale</label>
              <textarea
                id="route-rationale"
                rows={6}
                value={draft.rationale}
                onChange={(event) => updateField("rationale", event.target.value)}
                placeholder="Explain why this state is supported, which gaps remain, and what would change the decision."
                className="mt-2 w-full resize-y rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-sm leading-7 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/40"
              />
            </article>

            <article className={`rounded-3xl border p-6 backdrop-blur-xl sm:p-8 ${canFinalize ? "border-emerald-300/30 bg-emerald-300/[0.07]" : "border-amber-300/25 bg-amber-300/[0.06]"}`}>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-300">Construction review</p>
              <h2 className="mt-2 text-2xl font-black text-white">{canFinalize ? "Route draft structurally complete" : "Route draft remains incomplete"}</h2>
              <p className="mt-3 max-w-4xl leading-7 text-slate-300">
                {canFinalize
                  ? "All eight anchors contain a developed response, the consequence is defined, and the decision includes a rationale. Structural completion is not execution authorization."
                  : "Complete the route identity, consequence, all eight anchors, and decision rationale before treating this as a reviewable draft."}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <button type="button" onClick={saveDraft} className="rounded-full bg-cyan-300 px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-cyan-200">
                  Save route draft
                </button>
                <button type="button" onClick={resetDraft} className="rounded-full border border-white/15 px-5 py-3 text-sm font-bold text-slate-300 transition hover:border-white/30 hover:text-white">
                  Reset laboratory
                </button>
                <Link href="/academy/review" className="rounded-full border border-white/15 px-5 py-3 text-sm font-bold text-slate-300 transition hover:border-cyan-300/40 hover:text-white">
                  Continue to Review Workspace
                </Link>
              </div>
              {saveState === "saved" ? <p className="mt-4 text-sm font-bold text-emerald-200">Draft saved on this device.</p> : null}
              {saveState === "error" ? <p className="mt-4 text-sm font-bold text-rose-200">The draft could not be stored in this browser.</p> : null}
            </article>
          </div>
        </section>

        <footer className="mt-14 border-t border-white/10 py-8 text-sm text-slate-500">
          No admissible evidence. No admissible execution.
        </footer>
      </div>
    </main>
  );
}

function SummaryCard({
  label,
  value,
  className = "border-white/10 bg-white/[0.04] text-white",
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={`rounded-2xl border p-5 backdrop-blur-xl ${className}`}>
      <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">{label}</p>
      <strong className="mt-2 block text-2xl font-black">{value}</strong>
    </div>
  );
}
