import Link from "next/link";
import {
  governanceLibraryRecords,
} from "../../../lib/governance-library";
import type {
  GovernanceLibraryRecord,
} from "../../../lib/governance-library/records-foundational";

export default function GovernanceLibraryStatusPage() {
  const statusGroups = governanceLibraryRecords.reduce(
    (
      groups: Record<string, GovernanceLibraryRecord[]>,
      record: GovernanceLibraryRecord
    ) => {
      const status = record.status || "Unspecified";

      if (!groups[status]) {
        groups[status] = [];
      }

      groups[status].push(record);
      return groups;
    },
    {}
  );

  const statuses = Object.keys(statusGroups).sort((a, b) =>
    a.localeCompare(b)
  );

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <p className="text-sm uppercase tracking-[0.22em] text-sky-300">
          TA-14 AI Governance Library
        </p>

        <h1 className="mt-3 text-5xl font-bold">
          Governance Status Index
        </h1>

        <p className="mt-6 max-w-3xl text-lg text-slate-300">
          Browse governance records grouped by their current publication,
          adoption, proposal, guidance, or implementation status.
        </p>

        <div className="mt-12 space-y-8">
          {statuses.map((status: string) => (
            <section
              key={status}
              className="rounded-xl border border-white/10 bg-white/5 p-6"
            >
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-2xl font-semibold">{status}</h2>

                <span className="rounded-full bg-sky-400/10 px-3 py-1 text-sm text-sky-300">
                  {statusGroups[status].length}
                </span>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {statusGroups[status].map(
                  (record: GovernanceLibraryRecord) => (
                    <Link
                      key={record.slug}
                      href={`/governance-library/${record.slug}`}
                      className="rounded-lg border border-white/10 p-5 transition hover:border-sky-400/40"
                    >
                      <p className="text-xs uppercase tracking-[0.16em] text-sky-300">
                        {record.recordType}
                      </p>

                      <h3 className="mt-2 text-lg font-semibold">
                        {record.title}
                      </h3>

                      <p className="mt-3 text-sm leading-6 text-slate-300">
                        {record.summary}
                      </p>

                      <p className="mt-4 text-xs text-slate-400">
                        {record.publisher} · {record.jurisdiction}
                      </p>
                    </Link>
                  )
                )}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
