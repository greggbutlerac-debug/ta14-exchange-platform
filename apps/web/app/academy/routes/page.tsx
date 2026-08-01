"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type ReactNode } from "react";

type RouteState = "ALLOW" | "HOLD" | "DENY" | "ESCALATE";
type AnchorStatus = "supported" | "limited" | "failed";

type RouteExample = {
  id: string;
  title: string;
  domain: string;
  consequence: string;
  state: RouteState;
  summary: string;
  failure?: string;
  repair: string;
  lesson: string;
  anchors: Array<{
    label: string;
    value: string;
    status: AnchorStatus;
  }>;
};

type SavedProgress = {
  version: "2.0";
  completed: string[];
  notes: Record<string, string>;
  updatedAt: string;
};

const STORAGE_KEY = "ta14-academy-route-reading-center-v2";

const routeExamples: RouteExample[] = [
  {
    id: "allow",
    title: "Bounded equipment restart",
    domain: "Facilities operations",
    consequence: "Restore one air-handling unit after a verified protective trip.",
    state: "ALLOW",
    summary:
      "Current evidence, valid authority, preserved continuity, and a bounded execution plan support one controlled restart with post-action verification.",
    repair: "No repair is required. The route must still preserve outcome evidence after the restart.",
    lesson: "ALLOW is permission for the exact committed action only. It is never a general authorization.",
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
    failure: "Continuity is the earliest failed condition: the present identity state was not revalidated.",
    repair: "Refresh the identity state, establish current suspension authority, and rerun dependent gates.",
    lesson: "HOLD preserves the route while repair remains possible. It is not a soft approval.",
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
    failure: "Record is the earliest failed condition: the mandatory source evidence is absent.",
    repair: "A new request may be initiated only when the required source documentation exists and can be validated.",
    lesson: "DENY means the present action is prohibited under the preserved state. Later evidence cannot rewrite the original decision.",
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
    failure: "Binding is the decisive limit: the current reviewer lacks authority to resolve the conflict.",
    repair: "Route the preserved conflict to a named qualified authority and require an attributable resolution.",
    lesson: "ESCALATE transfers judgment. It does not convert uncertainty into permission.",
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

const stateVisual: Record<RouteState, { badge: string; glow: string; ring: string; label: string; index: string }> = {
  ALLOW: {
    badge: "border-emerald-300/35 bg-emerald-300/10 text-emerald-100",
    glow: "from-emerald-400/20 via-emerald-400/5 to-transparent",
    ring: "border-emerald-300/30",
    label: "Authorized boundary",
    index: "text-emerald-200",
  },
  HOLD: {
    badge: "border-amber-300/35 bg-amber-300/10 text-amber-100",
    glow: "from-amber-400/20 via-amber-400/5 to-transparent",
    ring: "border-amber-300/30",
    label: "Repair required",
    index: "text-amber-200",
  },
  DENY: {
    badge: "border-rose-300/35 bg-rose-300/10 text-rose-100",
    glow: "from-rose-400/20 via-rose-400/5 to-transparent",
    ring: "border-rose-300/30",
    label: "Execution prohibited",
    index: "text-rose-200",
  },
  ESCALATE: {
    badge: "border-violet-300/35 bg-violet-300/10 text-violet-100",
    glow: "from-violet-400/20 via-violet-400/5 to-transparent",
    ring: "border-violet-300/30",
    label: "Qualified judgment required",
    index: "text-violet-200",
  },
};

const anchorVisual: Record<AnchorStatus, { card: string; dot: string; word: string }> = {
  supported: {
    card: "border-emerald-300/20 bg-emerald-300/[0.045] hover:border-emerald-300/35",
    dot: "bg-emerald-300 shadow-[0_0_18px_rgba(110,231,183,0.55)]",
    word: "text-emerald-200",
  },
  limited: {
    card: "border-amber-300/20 bg-amber-300/[0.045] hover:border-amber-300/35",
    dot: "bg-amber-300 shadow-[0_0_18px_rgba(252,211,77,0.55)]",
    word: "text-amber-200",
  },
  failed: {
    card: "border-rose-300/20 bg-rose-300/[0.045] hover:border-rose-300/35",
    dot: "bg-rose-300 shadow-[0_0_18px_rgba(253,164,175,0.55)]",
    word: "text-rose-200",
  },
};

function MetricCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <article className="group relative overflow-hidden rounded-[26px] border border-white/10 bg-white/[0.045] p-5 shadow-[0_22px_60px_rgba(0,0,0,0.24)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-cyan-300/25">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/55 to-transparent opacity-70" />
      <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-500">{label}</p>
      <p className="mt-3 text-3xl font-black tracking-tight text-white">{value}</p>
      <p className="mt-2 text-xs leading-5 text-slate-400">{detail}</p>
    </article>
  );
}

function AcademyLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="rounded-full border border-white/10 bg-white/[0.035] px-4 py-2 text-xs font-bold text-slate-300 transition hover:border-cyan-300/35 hover:bg-cyan-300/[0.07] hover:text-white"
    >
      {children}
    </Link>
  );
}

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
      if (saved.version !== "2.0") return;
      setCompleted(saved.completed ?? []);
      setNotes(saved.notes ?? {});
    } catch {
      setSaveState("error");
    }
  }, []);

  const activeRoute = useMemo(
    () => routeExamples.find((route) => route.id === activeId) ?? routeExamples[0],
    [activeId],
  );

  const progress = Math.round((completed.length / routeExamples.length) * 100);
  const supportedCount = activeRoute.anchors.filter((anchor) => anchor.status === "supported").length;
  const limitedCount = activeRoute.anchors.filter((anchor) => anchor.status === "limited").length;
  const failedCount = activeRoute.anchors.filter((anchor) => anchor.status === "failed").length;
  const activeVisual = stateVisual[activeRoute.state];

  function toggleCompleted(id: string) {
    setCompleted((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
    setSaveState("idle");
  }

  function saveProgress() {
    try {
      const payload: SavedProgress = {
        version: "2.0",
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
    <main className="relative min-h-screen overflow-hidden bg-[#020711] text-slate-100">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.022)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.022)_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:linear-gradient(to_bottom,black,transparent_82%)]" />
        <div className="absolute -left-28 top-8 h-[460px] w-[460px] rounded-full bg-cyan-500/12 blur-[130px]" />
        <div className="absolute right-[-140px] top-[28%] h-[500px] w-[500px] rounded-full bg-violet-500/10 blur-[145px]" />
        <div className="absolute bottom-[-140px] left-[35%] h-[430px] w-[430px] rounded-full bg-emerald-500/8 blur-[145px]" />
      </div>

      <div className="relative mx-auto max-w-[1480px] px-4 py-6 sm:px-7 lg:px-10 lg:py-9">
        <header className="rounded-[28px] border border-white/10 bg-[#07111f]/75 px-5 py-4 shadow-[0_28px_100px_rgba(0,0,0,0.35)] backdrop-blur-2xl sm:px-7">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-center gap-4">
              <div className="grid h-12 w-12 place-items-center rounded-2xl border border-cyan-300/30 bg-cyan-300/10 text-sm font-black tracking-[0.12em] text-cyan-100 shadow-[0_0_30px_rgba(34,211,238,0.12)]">
                T14
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.26em] text-cyan-300">TA-14 Academy</p>
                <p className="mt-1 text-sm font-bold text-white">Route Reading Center</p>
              </div>
            </div>

            <nav className="flex flex-wrap gap-2" aria-label="Academy navigation">
              <AcademyLink href="/academy/mission-control">Mission Control</AcademyLink>
              <AcademyLink href="/academy/architecture-explorer">Architecture Explorer</AcademyLink>
              <AcademyLink href="/academy/simulator">Simulation Center</AcademyLink>
            </nav>
          </div>
        </header>

        <section className="relative mt-6 overflow-hidden rounded-[36px] border border-white/10 bg-[#07111f]/78 px-6 py-10 shadow-[0_36px_110px_rgba(0,0,0,0.38)] backdrop-blur-2xl sm:px-9 lg:px-12 lg:py-14">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_0%,rgba(34,211,238,0.16),transparent_34%),radial-gradient(circle_at_88%_34%,rgba(139,92,246,0.13),transparent_32%)]" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent" />

          <div className="relative grid gap-10 xl:grid-cols-[1.25fr_0.75fr] xl:items-end">
            <div>
              <div className="inline-flex items-center gap-3 rounded-full border border-cyan-300/20 bg-cyan-300/[0.07] px-4 py-2">
                <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_16px_rgba(103,232,249,0.7)]" />
                <span className="text-[10px] font-black uppercase tracking-[0.28em] text-cyan-100">Read before you build</span>
              </div>
              <h1 className="mt-6 max-w-5xl text-4xl font-black leading-[0.98] tracking-[-0.045em] text-white sm:text-5xl lg:text-7xl">
                Learn to read the route before you trust the result.
              </h1>
              <p className="mt-6 max-w-4xl text-base leading-8 text-slate-300 sm:text-lg">
                Inspect complete and defective routes across all four determination states. Follow the chain from reality to outcome, find the earliest unsupported condition, and distinguish permission from completion.
              </p>
            </div>

            <aside className="rounded-[28px] border border-white/10 bg-black/20 p-6 shadow-inner shadow-black/20">
              <p className="text-[10px] font-black uppercase tracking-[0.26em] text-slate-500">Governing principle</p>
              <blockquote className="mt-4 text-2xl font-black leading-tight text-white">
                No admissible evidence.
                <br />
                <span className="text-cyan-200">No admissible execution.</span>
              </blockquote>
              <p className="mt-4 text-sm leading-6 text-slate-400">
                The first unsupported link controls the route. Later confidence cannot repair an earlier failure.
              </p>
            </aside>
          </div>

          <div className="relative mt-9 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard label="Examples reviewed" value={`${completed.length}/${routeExamples.length}`} detail="Four canonical decision states" />
            <MetricCard label="Learning progress" value={`${progress}%`} detail="Preserved locally in this browser" />
            <MetricCard label="Active route support" value={`${supportedCount}/8`} detail={`${limitedCount} limited · ${failedCount} failed`} />
            <MetricCard label="Reading discipline" value="Earliest failure" detail="Read from reality forward" />
          </div>

          <div className="relative mt-5 overflow-hidden rounded-full border border-white/10 bg-black/25 p-1">
            <div className="h-2 rounded-full bg-gradient-to-r from-cyan-300 via-sky-300 to-violet-300 transition-all duration-700" style={{ width: `${Math.max(progress, 2)}%` }} />
          </div>
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
          <aside className="xl:sticky xl:top-6 xl:self-start">
            <div className="rounded-[30px] border border-white/10 bg-[#07111f]/78 p-4 shadow-[0_28px_90px_rgba(0,0,0,0.32)] backdrop-blur-2xl">
              <div className="px-2 pb-4 pt-2">
                <p className="text-[10px] font-black uppercase tracking-[0.26em] text-cyan-300">Demonstration routes</p>
                <p className="mt-2 text-sm leading-6 text-slate-400">Compare the same execution chain across four final states.</p>
              </div>

              <div className="space-y-3">
                {routeExamples.map((route, index) => {
                  const isActive = route.id === activeRoute.id;
                  const isComplete = completed.includes(route.id);
                  const visual = stateVisual[route.state];

                  return (
                    <button
                      key={route.id}
                      type="button"
                      onClick={() => setActiveId(route.id)}
                      className={`group relative w-full overflow-hidden rounded-[24px] border p-4 text-left transition-all duration-300 ${
                        isActive
                          ? `${visual.ring} bg-white/[0.075] shadow-[0_20px_55px_rgba(0,0,0,0.24)]`
                          : "border-white/8 bg-black/15 hover:-translate-y-0.5 hover:border-white/18 hover:bg-white/[0.045]"
                      }`}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${visual.glow} transition-opacity group-hover:opacity-70 ${isActive ? "opacity-100" : "opacity-0"}`} />
                      <div className="relative">
                        <div className="flex items-center justify-between gap-3">
                          <span className={`text-xs font-black tracking-[0.2em] ${visual.index}`}>{String(index + 1).padStart(2, "0")}</span>
                          <span className={`rounded-full border px-2.5 py-1 text-[9px] font-black tracking-[0.16em] ${visual.badge}`}>{route.state}</span>
                        </div>
                        <h2 className="mt-4 text-base font-black leading-snug text-white">{route.title}</h2>
                        <p className="mt-1.5 text-xs leading-5 text-slate-400">{route.domain}</p>
                        <div className="mt-4 flex items-center justify-between border-t border-white/8 pt-3">
                          <span className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">{visual.label}</span>
                          {isComplete ? <span className="text-xs font-bold text-emerald-200">Reviewed ✓</span> : <span className="text-xs text-slate-600">Open →</span>}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          <div className="min-w-0 space-y-6">
            <article className="relative overflow-hidden rounded-[34px] border border-white/10 bg-[#07111f]/80 p-6 shadow-[0_28px_90px_rgba(0,0,0,0.32)] backdrop-blur-2xl sm:p-8 lg:p-10">
              <div className={`absolute inset-0 bg-gradient-to-br ${activeVisual.glow}`} />
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/45 to-transparent" />

              <div className="relative">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.28em] text-cyan-300">{activeRoute.domain}</p>
                    <h2 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">{activeRoute.title}</h2>
                  </div>
                  <div className="flex flex-col items-start gap-2 lg:items-end">
                    <span className={`rounded-full border px-5 py-2.5 text-xs font-black tracking-[0.2em] ${activeVisual.badge}`}>{activeRoute.state}</span>
                    <span className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">{activeVisual.label}</span>
                  </div>
                </div>

                <div className="mt-8 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                  <section className="rounded-[25px] border border-white/10 bg-black/22 p-5 sm:p-6">
                    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">Proposed consequence</p>
                    <p className="mt-3 text-lg font-bold leading-8 text-white">{activeRoute.consequence}</p>
                  </section>
                  <section className="rounded-[25px] border border-white/10 bg-white/[0.04] p-5 sm:p-6">
                    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">Reading result</p>
                    <p className="mt-3 text-sm leading-7 text-slate-300">{activeRoute.summary}</p>
                  </section>
                </div>

                {activeRoute.failure ? (
                  <div className="mt-5 rounded-[24px] border border-amber-300/20 bg-amber-300/[0.055] p-5">
                    <div className="flex items-start gap-4">
                      <div className="mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-amber-300/25 bg-amber-300/10 text-sm font-black text-amber-100">!</div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-200">Earliest controlling condition</p>
                        <p className="mt-2 text-sm leading-6 text-amber-50">{activeRoute.failure}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mt-5 rounded-[24px] border border-emerald-300/20 bg-emerald-300/[0.055] p-5">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-200">Route integrity</p>
                    <p className="mt-2 text-sm leading-6 text-emerald-50">Every required link is supported for the exact bounded action.</p>
                  </div>
                )}
              </div>
            </article>

            <section className="rounded-[34px] border border-white/10 bg-[#07111f]/72 p-5 shadow-[0_28px_90px_rgba(0,0,0,0.28)] backdrop-blur-2xl sm:p-7 lg:p-9">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.26em] text-cyan-300">Architecture correspondence</p>
                  <h2 className="mt-3 text-2xl font-black tracking-tight text-white sm:text-3xl">Read the eight-link chain in order.</h2>
                </div>
                <div className="flex flex-wrap gap-2 text-[10px] font-black uppercase tracking-[0.14em]">
                  <span className="rounded-full border border-emerald-300/20 bg-emerald-300/[0.06] px-3 py-1.5 text-emerald-200">{supportedCount} supported</span>
                  <span className="rounded-full border border-amber-300/20 bg-amber-300/[0.06] px-3 py-1.5 text-amber-200">{limitedCount} limited</span>
                  <span className="rounded-full border border-rose-300/20 bg-rose-300/[0.06] px-3 py-1.5 text-rose-200">{failedCount} failed</span>
                </div>
              </div>

              <div className="relative mt-7 grid gap-4 md:grid-cols-2">
                <div className="pointer-events-none absolute bottom-0 left-7 top-0 hidden w-px bg-gradient-to-b from-cyan-300/40 via-white/10 to-transparent md:block" />
                {activeRoute.anchors.map((anchor, index) => {
                  const visual = anchorVisual[anchor.status];
                  return (
                    <article key={anchor.label} className={`group relative rounded-[24px] border p-5 transition duration-300 hover:-translate-y-0.5 ${visual.card}`}>
                      <div className="flex items-start gap-4">
                        <div className="relative z-10 grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-white/10 bg-[#07111f] text-xs font-black text-cyan-100 shadow-[0_12px_30px_rgba(0,0,0,0.24)]">
                          {String(index + 1).padStart(2, "0")}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <h3 className="text-lg font-black text-white">{anchor.label}</h3>
                            <span className={`inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.16em] ${visual.word}`}>
                              <span className={`h-2 w-2 rounded-full ${visual.dot}`} />
                              {anchor.status}
                            </span>
                          </div>
                          <p className="mt-2 text-sm leading-6 text-slate-300">{anchor.value}</p>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-2">
              <article className="rounded-[30px] border border-white/10 bg-[#07111f]/75 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.25)] backdrop-blur-2xl sm:p-7">
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-cyan-300">Repair condition</p>
                <h2 className="mt-3 text-2xl font-black text-white">What must change?</h2>
                <p className="mt-4 text-sm leading-7 text-slate-300">{activeRoute.repair}</p>
              </article>
              <article className="rounded-[30px] border border-white/10 bg-[#07111f]/75 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.25)] backdrop-blur-2xl sm:p-7">
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-violet-300">Learning objective</p>
                <h2 className="mt-3 text-2xl font-black text-white">What does this state teach?</h2>
                <p className="mt-4 text-sm leading-7 text-slate-300">{activeRoute.lesson}</p>
              </article>
            </section>

            <section className="rounded-[34px] border border-white/10 bg-[#07111f]/80 p-6 shadow-[0_28px_90px_rgba(0,0,0,0.3)] backdrop-blur-2xl sm:p-8 lg:p-10">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.26em] text-cyan-300">Learner analysis</p>
                  <h2 className="mt-3 text-2xl font-black text-white sm:text-3xl">Preserve your reading of the route.</h2>
                </div>
                <span className="text-xs font-bold text-slate-500">Saved locally</span>
              </div>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-400">
                Identify the earliest failed or limited condition, explain why the final state follows, and state what evidence or authority would be required to change it.
              </p>

              <textarea
                id="route-notes"
                value={notes[activeRoute.id] ?? ""}
                onChange={(event) => {
                  setNotes((current) => ({ ...current, [activeRoute.id]: event.target.value }));
                  setSaveState("idle");
                }}
                rows={8}
                className="mt-6 w-full resize-y rounded-[24px] border border-white/10 bg-black/25 p-5 text-sm leading-7 text-white shadow-inner shadow-black/20 outline-none transition placeholder:text-slate-600 focus:border-cyan-300/40 focus:ring-4 focus:ring-cyan-300/[0.06]"
                placeholder="Example: The route cannot proceed because continuity was not revalidated after the identity state changed. The repair condition is..."
              />

              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={() => toggleCompleted(activeRoute.id)}
                  className={`rounded-2xl border px-5 py-3 text-sm font-black transition ${
                    completed.includes(activeRoute.id)
                      ? "border-emerald-300/30 bg-emerald-300/10 text-emerald-100"
                      : "border-white/10 bg-white/[0.04] text-white hover:border-cyan-300/35 hover:bg-cyan-300/[0.07]"
                  }`}
                >
                  {completed.includes(activeRoute.id) ? "Reviewed ✓" : "Mark example reviewed"}
                </button>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  {saveState === "saved" ? <span className="text-xs font-bold text-emerald-200">Progress preserved.</span> : null}
                  {saveState === "error" ? <span className="text-xs font-bold text-rose-200">Progress could not be saved.</span> : null}
                  <button
                    type="button"
                    onClick={saveProgress}
                    className="rounded-2xl bg-gradient-to-r from-cyan-300 to-sky-300 px-6 py-3 text-sm font-black text-slate-950 shadow-[0_16px_45px_rgba(34,211,238,0.2)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_55px_rgba(34,211,238,0.28)]"
                  >
                    Save progress
                  </button>
                </div>
              </div>
            </section>

            <section className="relative overflow-hidden rounded-[34px] border border-cyan-300/15 bg-gradient-to-br from-cyan-300/[0.08] via-[#07111f] to-violet-300/[0.07] p-7 shadow-[0_28px_90px_rgba(0,0,0,0.3)] sm:p-9">
              <div className="absolute right-0 top-0 h-44 w-44 rounded-full bg-cyan-300/10 blur-3xl" />
              <div className="relative grid gap-7 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.26em] text-cyan-300">Reading discipline</p>
                  <h2 className="mt-3 text-3xl font-black tracking-tight text-white">Do not begin with the desired outcome.</h2>
                  <p className="mt-4 max-w-4xl text-sm leading-7 text-slate-300">
                    Read from reality forward. A favorable objective cannot repair missing evidence, broken continuity, invalid authority, or execution beyond the committed boundary.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                  <Link href="/academy/governance-thinking" className="rounded-2xl border border-white/12 bg-white/[0.05] px-5 py-3 text-center text-sm font-black text-white transition hover:border-cyan-300/35 hover:bg-cyan-300/[0.07]">
                    Return to Governance Thinking
                  </Link>
                  <Link href="/academy/simulator" className="rounded-2xl bg-white px-5 py-3 text-center text-sm font-black text-slate-950 transition hover:-translate-y-0.5">
                    Continue to Simulation Center →
                  </Link>
                </div>
              </div>
            </section>
          </div>
        </section>

        <footer className="mt-8 border-t border-white/10 py-7 text-center">
          <p className="text-sm font-black text-white">No admissible evidence. No admissible execution.</p>
          <p className="mt-2 text-xs leading-6 text-slate-500">Route completion reflects learner analysis and does not grant operational authority.</p>
        </footer>
      </div>
    </main>
  );
}
