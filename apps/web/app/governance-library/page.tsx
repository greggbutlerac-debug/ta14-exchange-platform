"use client";

import Link from "next/link";

const governanceArchitectures = [
  { acronym: "RE", title: "Runtime Execution", lane: "runtime-execution", description: "Govern whether an AI action remains admissible at the moment of execution." },
  { acronym: "ME", title: "Model Evaluation", lane: "model-evaluation", description: "Evaluate model identity, version, capability, limitations, and approved use." },
  { acronym: "DP", title: "Data Provenance", lane: "data-provenance", description: "Preserve where governing data came from, who controlled it, and whether it changed." },
  { acronym: "AT", title: "Agent & Tool Governance", lane: "agent-tools", description: "Govern agent identity, delegated authority, tool access, and bounded action." },
  { acronym: "HO", title: "Human Oversight", lane: "human-oversight", description: "Preserve meaningful human intervention, escalation, review, and override authority." },
  { acronym: "PC", title: "Policy Controls", lane: "policy-controls", description: "Bind proposed actions to applicable policies, control conditions, and failure states." },
  { acronym: "CR", title: "Compliance & Regulatory", lane: "compliance-regulatory", description: "Translate legal and regulatory duties into inspectable evidence and execution gates." },
  { acronym: "DR", title: "Decision Governance", lane: "decision", description: "Separate the proposed decision, governing evidence, authority, determination, and result." },
  { acronym: "RG", title: "Risk Governance", lane: "risk", description: "Identify consequential risk, unresolved conditions, thresholds, and required dispositions." },
  { acronym: "GG", title: "General Governance", lane: "general", description: "Build and test a complete governed route when no narrower architecture is appropriate." },
];

export default function GovernanceLibraryPage() {
  return (
    <main className="min-h-screen bg-[#05070d] text-white">
      <section className="mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-10">
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <Link href="/" className="rounded-full border border-white/15 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-white/70 transition hover:border-white/35 hover:text-white">
            ← Return to Exchange
          </Link>
          <Link href="/workspace/ai-governance" className="rounded-full border border-cyan-300/40 bg-cyan-300/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-cyan-100 transition hover:bg-cyan-300/20">
            Enter AI Governance Workspace
          </Link>
        </div>

        <div className="max-w-4xl">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-200/80">TA-14 AI Governance Exchange</p>
          <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">AI Governance Architecture Library</h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-white/65 sm:text-lg">
            Choose the governance architecture that matches the control boundary you need to examine. Each architecture opens a bounded playground lane for testing evidence, authority, continuity, admissibility, commitment, execution, and outcome.
          </p>
          <p className="mt-4 text-sm font-semibold text-white/50">No admissible evidence. No admissible execution.</p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {governanceArchitectures.map((architecture) => (
            <article key={architecture.lane} className="group flex min-h-[280px] flex-col rounded-3xl border border-white/10 bg-white/[0.035] p-6 shadow-2xl shadow-black/20 transition hover:-translate-y-1 hover:border-cyan-200/35 hover:bg-white/[0.055]">
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-200/25 bg-cyan-200/10 text-lg font-black tracking-[0.12em] text-cyan-100">{architecture.acronym}</div>
                <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white/40">Architecture</span>
              </div>
              <h2 className="mt-6 text-2xl font-black tracking-tight">{architecture.title}</h2>
              <p className="mt-3 flex-1 text-sm leading-7 text-white/60">{architecture.description}</p>
              <Link href={`/workspace/ai-governance/playground?lane=${architecture.lane}`} className="mt-6 inline-flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm font-bold text-white transition group-hover:border-cyan-200/30 group-hover:text-cyan-100">
                Open governed lane <span aria-hidden="true">→</span>
              </Link>
            </article>
          ))}
        </div>

        <section className="mt-12 rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-white/45">Governing sequence</p>
          <p className="mt-4 text-lg font-bold leading-9 text-white/80">Reality → Record → Continuity → Admissibility → Binding → Commit → Execution → Outcome</p>
        </section>
      </section>
    </main>
  );
}
