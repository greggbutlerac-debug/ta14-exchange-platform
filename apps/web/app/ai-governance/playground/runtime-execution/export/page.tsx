"use client";

import Link from "next/link";

export default function RuntimeExportPage() {
  return (
    <main className="min-h-screen bg-[#03060b] px-5 py-10 text-white sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-200/70">
          TA-14 Runtime Execution
        </p>

        <h1 className="mt-3 text-3xl font-semibold">Runtime Export</h1>

        <p className="mt-4 max-w-4xl text-sm leading-7 text-white/65">
          Prepare preserved Runtime governance records for external review.
          This workspace defines export scope and explains that exported
          artifacts are snapshots of preserved governance records rather than
          live authorization.
        </p>

        <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.035] p-6">
          <h2 className="text-xl font-semibold">Planned export package</h2>

          <ul className="mt-5 list-disc space-y-3 pl-6 text-sm leading-7 text-white/65">
            <li>Preserved Runtime record</li>
            <li>Integrity envelope</li>
            <li>Verification summary</li>
            <li>Evidence reference inventory</li>
            <li>Replay and audit metadata</li>
          </ul>
        </section>

        <section className="mt-8 rounded-3xl border border-amber-400/20 bg-amber-400/[0.055] p-6">
          <h2 className="text-lg font-semibold text-amber-50">
            Export boundary
          </h2>

          <p className="mt-4 text-sm leading-7 text-amber-50/70">
            Exported packages document preserved governance history. They do
            not authorize execution, certify compliance, or replace a new
            Runtime determination.
          </p>
        </section>

        <div className="mt-8">
          <Link
            href="/ai-governance/playground/runtime-execution"
            className="rounded-xl border border-white/15 bg-white/[0.05] px-5 py-3 text-sm font-semibold"
          >
            Back to Runtime Workspace
          </Link>
        </div>
      </div>
    </main>
  );
}
