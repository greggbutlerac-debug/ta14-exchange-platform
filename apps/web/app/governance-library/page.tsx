"use client";

import Link from "next/link";

const architectures = [
  {
    code: "RE",
    title: "Runtime Execution",
    lane: "runtime-execution",
    eyebrow: "Execution Governance",
    description:
      "Govern whether an AI action remains admissible at the moment of execution.",
    gradient: "from-cyan-400/20 via-sky-400/10 to-transparent",
    glow: "shadow-cyan-500/10",
  },
  {
    code: "ME",
    title: "Model Evaluation",
    lane: "model-evaluation",
    eyebrow: "Model Governance",
    description:
      "Evaluate model identity, version, capability, limitations, and approved use.",
    gradient: "from-violet-400/20 via-fuchsia-400/10 to-transparent",
    glow: "shadow-violet-500/10",
  },
  {
    code: "DP",
    title: "Data Provenance",
    lane: "data-provenance",
    eyebrow: "Evidence Governance",
    description:
      "Preserve where governing data came from, who controlled it, and whether it changed.",
    gradient: "from-emerald-400/20 via-teal-400/10 to-transparent",
    glow: "shadow-emerald-500/10",
  },
  {
    code: "AT",
    title: "Agent & Tool Governance",
    lane: "agent-tools",
    eyebrow: "Delegated Authority",
    description:
      "Govern agent identity, delegated authority, tool access, and bounded action.",
    gradient: "from-amber-400/20 via-orange-400/10 to-transparent",
    glow: "shadow-amber-500/10",
  },
  {
    code: "HO",
    title: "Human Oversight",
    lane: "human-oversight",
    eyebrow: "Intervention Authority",
    description:
      "Preserve meaningful intervention, escalation, review, and override authority.",
    gradient: "from-rose-400/20 via-pink-400/10 to-transparent",
    glow: "shadow-rose-500/10",
  },
  {
    code: "PC",
    title: "Policy Controls",
    lane: "policy-controls",
    eyebrow: "Control Binding",
    description:
      "Bind proposed actions to applicable policies, control conditions, and failure states.",
    gradient: "from-blue-400/20 via-indigo-400/10 to-transparent",
    glow: "shadow-blue-500/10",
  },
  {
    code: "CR",
    title: "Compliance & Regulatory",
    lane: "compliance-regulatory",
    eyebrow: "Obligation Mapping",
    description:
      "Translate legal and regulatory duties into inspectable evidence and execution gates.",
    gradient: "from-lime-400/20 via-emerald-400/10 to-transparent",
    glow: "shadow-lime-500/10",
  },
  {
    code: "DG",
    title: "Decision Governance",
    lane: "decision",
    eyebrow: "Decision Integrity",
    description:
      "Separate the proposed decision, governing evidence, authority, determination, and result.",
    gradient: "from-purple-400/20 via-violet-400/10 to-transparent",
    glow: "shadow-purple-500/10",
  },
  {
    code: "RG",
    title: "Risk Governance",
    lane: "risk",
    eyebrow: "Risk Disposition",
    description:
      "Identify consequential risk, unresolved conditions, thresholds, and required dispositions.",
    gradient: "from-red-400/20 via-orange-400/10 to-transparent",
    glow: "shadow-red-500/10",
  },
  {
    code: "GG",
    title: "General Governance",
    lane: "general",
    eyebrow: "Complete Route",
    description:
      "Build and test a complete governed route when no narrower architecture is appropriate.",
    gradient: "from-slate-300/20 via-white/5 to-transparent",
    glow: "shadow-white/5",
  },
];

const chain = [
  "Reality",
  "Record",
  "Continuity",
  "Admissibility",
  "Binding",
  "Commit",
  "Execution",
  "Outcome",
];

export default function GovernanceLibraryPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#020611] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-12rem] top-[-10rem] h-[32rem] w-[32rem] rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute right-[-10rem] top-[12rem] h-[30rem] w-[30rem] rounded-full bg-violet-500/10 blur-[120px]" />
        <div className="absolute bottom-[-14rem] left-1/3 h-[34rem] w-[34rem] rounded-full bg-amber-400/5 blur-[140px]" />

        <div
          className="absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)",
            backgroundSize: "54px 54px",
          }}
        />

        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/50 to-transparent" />
      </div>

      <section className="relative mx-auto w-full max-w-7xl px-5 pb-20 pt-8 sm:px-8 lg:px-10">
        <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.035] p-3 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-xs font-black uppercase tracking-[0.16em] text-white/70 transition hover:border-cyan-300/40 hover:bg-cyan-300/10 hover:text-white"
          >
            <span aria-hidden="true">←</span>
            Return to Exchange
          </Link>

          <div className="hidden items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-white/35 lg:flex">
            <span>Library</span>
            <span className="text-cyan-300/60">•</span>
            <span>Architecture</span>
            <span className="text-cyan-300/60">•</span>
            <span>Execution</span>
          </div>

          <Link
            href="/workspace/ai-governance"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-cyan-300/30 bg-cyan-300/10 px-4 py-3 text-xs font-black uppercase tracking-[0.16em] text-cyan-100 transition hover:border-cyan-200/60 hover:bg-cyan-200/20"
          >
            Enter AI Governance Workspace
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        <header className="relative mx-auto max-w-5xl pb-16 pt-20 text-center sm:pt-24">
          <div className="mx-auto inline-flex items-center gap-3 rounded-full border border-cyan-300/20 bg-cyan-300/[0.07] px-4 py-2 text-[10px] font-black uppercase tracking-[0.26em] text-cyan-100/80">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(103,232,249,0.9)]" />
            TA-14 AI Governance Exchange
          </div>

          <h1 className="mt-7 bg-gradient-to-b from-white via-white to-white/55 bg-clip-text font-serif text-5xl font-black tracking-[-0.04em] text-transparent sm:text-6xl lg:text-8xl">
            Governance Library
          </h1>

          <p className="mx-auto mt-7 max-w-3xl text-base leading-8 text-white/60 sm:text-lg sm:leading-9">
            Explore the governance architectures before building a route.
            Each lane preserves its own evidence boundary, authority,
            admissibility conditions, failure states, and execution purpose.
          </p>

          <div className="mx-auto mt-8 flex max-w-xl items-center gap-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-amber-200/40" />
            <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-100/80">
              No admissible evidence. No admissible execution.
            </p>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-amber-200/40" />
          </div>
        </header>

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {architectures.map((architecture, index) => (
            <article
              key={architecture.lane}
              className={`group relative flex min-h-[330px] overflow-hidden rounded-[28px] border border-white/10 bg-[#07101f]/85 p-6 shadow-2xl ${architecture.glow} backdrop-blur-xl transition duration-300 hover:-translate-y-1.5 hover:border-white/20 hover:bg-[#0a1425]`}
            >
              <div
                className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${architecture.gradient} opacity-80 transition duration-300 group-hover:opacity-100`}
              />
              <div className="pointer-events-none absolute inset-[1px] rounded-[27px] border border-white/[0.035]" />

              <div className="relative flex w-full flex-col">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/15 bg-black/25 text-xl font-black tracking-[0.1em] text-white shadow-lg">
                    {architecture.code}
                  </div>

                  <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.18em] text-white/40">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <p className="mt-7 text-[10px] font-black uppercase tracking-[0.2em] text-cyan-100/55">
                  {architecture.eyebrow}
                </p>

                <h2 className="mt-3 text-2xl font-black tracking-tight text-white sm:text-[1.7rem]">
                  {architecture.title}
                </h2>

                <p className="mt-4 flex-1 text-sm leading-7 text-white/58">
                  {architecture.description}
                </p>

                <Link
                  href={`/workspace/ai-governance/playground?lane=${architecture.lane}`}
                  className="mt-7 inline-flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3.5 text-sm font-black text-white transition hover:border-cyan-200/35 hover:bg-cyan-200/10 hover:text-cyan-100"
                >
                  Open governed lane
                  <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">
                    →
                  </span>
                </Link>
              </div>
            </article>
          ))}
        </section>

        <section className="relative mt-14 overflow-hidden rounded-[30px] border border-amber-200/20 bg-gradient-to-br from-amber-200/[0.08] via-white/[0.025] to-transparent p-6 shadow-2xl shadow-amber-500/5 sm:p-9">
          <div className="absolute right-[-8rem] top-[-8rem] h-64 w-64 rounded-full bg-amber-300/10 blur-3xl" />

          <div className="relative text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.26em] text-amber-100/60">
              TA-14 Governing Chain
            </p>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              {chain.map((item, index) => (
                <div key={item} className="flex items-center gap-3">
                  <span className="rounded-full border border-amber-100/15 bg-black/20 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-amber-50/90">
                    {item}
                  </span>
                  {index < chain.length - 1 ? (
                    <span className="text-amber-200/35" aria-hidden="true">
                      →
                    </span>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
