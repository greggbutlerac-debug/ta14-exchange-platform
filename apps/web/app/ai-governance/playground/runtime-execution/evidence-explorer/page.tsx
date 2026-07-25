"use client";

import Link from "next/link";
import { useMemo } from "react";

import { listPreservedRuntimeGovernedRecords } from "../../../../../lib/governance-playgrounds";

export default function RuntimeEvidenceExplorerPage() {
  const records = listPreservedRuntimeGovernedRecords();

  const evidence = useMemo(() => {
    return records.flatMap((record) =>
      record.payload.evidenceIds.map((id) => ({
        recordId: record.recordId,
        title: record.title,
        determination: record.determination,
        evidenceId: id,
        preservedAt: record.preservedAt,
      })),
    );
  }, [records]);

  return (
    <main className="min-h-screen bg-[#03060b] px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-200/70">
              TA-14 Runtime Execution
            </p>

            <h1 className="mt-3 text-4xl font-bold">
              Runtime Evidence Explorer
            </h1>

            <p className="mt-4 max-w-3xl text-white/65">
              Browse every evidence reference preserved inside Runtime governed
              records and jump directly to the associated record.
            </p>
          </div>

          <Link
            href="/ai-governance/playground/runtime-execution"
            className="rounded-xl border border-white/15 bg-white/[0.05] px-5 py-3 font-semibold hover:bg-white/[0.08]"
          >
            Runtime Workspace
          </Link>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <StatCard title="Preserved Records" value={records.length} />
          <StatCard title="Evidence References" value={evidence.length} />
          <StatCard
            title="Average / Record"
            value={
              records.length
                ? Number((evidence.length / records.length).toFixed(1))
                : 0
            }
          />
        </div>

        <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b border-white/10 text-sm text-white/55">
                <tr>
                  <th className="pb-3">Evidence ID</th>
                  <th className="pb-3">Record</th>
                  <th className="pb-3">Determination</th>
                  <th className="pb-3">Preserved</th>
                  <th className="pb-3">Action</th>
                </tr>
              </thead>

              <tbody>
                {evidence.map((item) => (
                  <tr
                    key={`${item.recordId}-${item.evidenceId}`}
                    className="border-b border-white/5"
                  >
                    <td className="py-4 font-mono text-xs">
                      {item.evidenceId}
                    </td>

                    <td>{item.title}</td>

                    <td>{item.determination}</td>

                    <td>
                      {new Date(item.preservedAt).toLocaleString()}
                    </td>

                    <td>
                      <Link
                        href={`/ai-governance/playground/runtime-execution/preserved/${encodeURIComponent(
                          item.recordId,
                        )}`}
                        className="rounded-lg border border-sky-300/30 bg-sky-300/10 px-3 py-2 text-xs font-semibold text-sky-100 hover:border-sky-200/50 hover:bg-sky-300/15"
                      >
                        Open Record
                      </Link>
                    </td>
                  </tr>
                ))}

                {evidence.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-10 text-center text-white/45"
                    >
                      No preserved evidence references were found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}

function StatCard({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
      <p className="text-xs uppercase tracking-[0.18em] text-white/45">
        {title}
      </p>

      <p className="mt-3 text-3xl font-bold">{value}</p>
    </div>
  );
}
