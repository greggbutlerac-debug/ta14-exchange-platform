"use client";

import Link from "next/link";
import { useMemo } from "react";

import { listPreservedRuntimeGovernedRecords } from "../../../../../lib/governance-playgrounds";

export default function RuntimeTimelinePage() {
  const timeline = useMemo(() => {
    return [...listPreservedRuntimeGovernedRecords()].sort(
      (a, b) =>
        new Date(b.preservedAt).getTime() -
        new Date(a.preservedAt).getTime(),
    );
  }, []);

  return (
    <main className="min-h-screen bg-[#03060b] px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-200/70">
              TA-14 Runtime Execution
            </p>

            <h1 className="mt-3 text-4xl font-bold">
              Runtime Preservation Timeline
            </h1>

            <p className="mt-4 max-w-3xl text-white/65">
              View every preserved Runtime governed record in
              chronological order to understand preservation history,
              execution continuity, and evidence progression.
            </p>
          </div>

          <Link
            href="/ai-governance/playground/runtime-execution"
            className="rounded-xl border border-white/15 bg-white/[0.05] px-5 py-3 font-semibold hover:bg-white/[0.08]"
          >
            Runtime Workspace
          </Link>
        </div>

        <section className="mt-8 space-y-5">
          {timeline.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-white/15 bg-white/[0.03] p-10 text-center text-white/50">
              No preserved Runtime records exist yet.
            </div>
          ) : (
            timeline.map((record) => (
              <article
                key={record.recordId}
                className="rounded-3xl border border-white/10 bg-white/[0.04] p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-5">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full border border-white/15 bg-white/[0.05] px-3 py-1 text-xs uppercase tracking-[0.14em]">
                        {record.status}
                      </span>

                      <span className="rounded-full border border-sky-300/30 bg-sky-300/10 px-3 py-1 text-xs uppercase tracking-[0.14em] text-sky-100">
                        {record.determination}
                      </span>
                    </div>

                    <h2 className="mt-4 text-2xl font-semibold">
                      {record.title}
                    </h2>

                    <p className="mt-2 break-all font-mono text-xs text-white/40">
                      {record.recordId}
                    </p>

                    <div className="mt-5 grid gap-4 md:grid-cols-3">
                      <Info
                        label="Preserved"
                        value={new Date(
                          record.preservedAt,
                        ).toLocaleString()}
                      />

                      <Info
                        label="Evidence References"
                        value={String(
                          record.payload.evidenceIds.length,
                        )}
                      />

                      <Info
                        label="Record Status"
                        value={record.status}
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Link
                      href={`/ai-governance/playground/runtime-execution/preserved/${encodeURIComponent(
                        record.recordId,
                      )}`}
                      className="rounded-xl border border-white/15 bg-white/[0.05] px-4 py-2.5 font-semibold hover:bg-white/[0.08]"
                    >
                      Open Record
                    </Link>

                    <Link
                      href={`/ai-governance/playground/runtime-execution/preserved/${encodeURIComponent(
                        record.recordId,
                      )}/envelope`}
                      className="rounded-xl border border-sky-300/30 bg-sky-300/10 px-4 py-2.5 font-semibold text-sky-100 hover:border-sky-200/50 hover:bg-sky-300/15"
                    >
                      Integrity Envelope
                    </Link>
                  </div>
                </div>
              </article>
            ))
          )}
        </section>
      </div>
    </main>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <p className="text-xs uppercase tracking-[0.16em] text-white/40">
        {label}
      </p>

      <p className="mt-2 text-sm text-white/75">{value}</p>
    </div>
  );
}
