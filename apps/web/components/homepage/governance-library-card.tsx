"use client";

import Link from "next/link";

export function GovernanceLibraryCard() {
  return (
    <Link
      href="/governance-library"
      className="group relative flex min-h-[260px] flex-col justify-between overflow-hidden rounded-3xl border border-cyan-200/20 bg-white/[0.035] p-6 text-white shadow-2xl shadow-black/20 transition hover:-translate-y-1 hover:border-cyan-200/45 hover:bg-white/[0.06]"
    >
      <div>
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-200/25 bg-cyan-200/10 text-lg font-black tracking-[0.12em] text-cyan-100">
          GL
        </div>

        <p className="mt-6 text-xs font-black uppercase tracking-[0.22em] text-cyan-200/70">
          Public entrance
        </p>

        <h2 className="mt-3 text-3xl font-black tracking-tight">
          Governance Library
        </h2>

        <p className="mt-4 max-w-xl text-sm leading-7 text-white/60">
          Enter the TA-14 AI Governance Architecture Library and open the
          Runtime Execution, Model Evaluation, Data Provenance, Agent & Tool,
          Human Oversight, Policy Control, Compliance, Decision, Risk, and
          General Governance lanes.
        </p>
      </div>

      <div className="mt-8 flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm font-bold transition group-hover:border-cyan-200/30 group-hover:text-cyan-100">
        Open Governance Library
        <span aria-hidden="true">→</span>
      </div>
    </Link>
  );
}

export default GovernanceLibraryCard;
