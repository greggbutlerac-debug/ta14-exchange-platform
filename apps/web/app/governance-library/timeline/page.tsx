import Link from "next/link";
import {
  governanceLibraryRecords,
} from "../../../lib/governance-library";
import type {
  GovernanceLibraryRecord,
} from "../../../lib/governance-library/records-foundational";

export default function GovernanceLibraryTimelinePage() {
  const records: GovernanceLibraryRecord[] = [...governanceLibraryRecords].sort(
    (a, b) => {
      const left = a.status ?? "";
      const right = b.status ?? "";
      return left.localeCompare(right);
    }
  );

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <p className="text-sm uppercase tracking-[0.22em] text-sky-300">
          TA-14 AI Governance Library
        </p>

        <h1 className="mt-3 text-5xl font-bold">
          Governance Timeline
        </h1>

        <p className="mt-6 max-w-3xl text-lg text-slate-300">
          A chronological-style view of governance records showing publication
          status, jurisdiction, publisher, and governance artifact.
        </p>

        <div className="mt-12 space-y-5">
          {records.map((record: GovernanceLibraryRecord) => (
            <Link
              key={record.slug}
              href={`/governance-library/${record.slug}`}
              className="block rounded-xl border border-white/10 bg-white/5 p-6 transition hover:border-sky-400/40"
            >
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-sky-400/10 px-3 py-1 text-xs uppercase text-sky-300">
                  {record.recordType}
                </span>

                <span className="rounded-full border border-white/10 px-3 py-1 text-xs">
                  {record.status}
                </span>

                <span className="rounded-full border border-white/10 px-3 py-1 text-xs">
                  {record.jurisdiction}
                </span>
              </div>

              <h2 className="mt-4 text-2xl font-semibold">
                {record.title}
              </h2>

              <p className="mt-3 leading-7 text-slate-300">
                {record.summary}
              </p>

              <div className="mt-4 text-sm text-slate-400">
                {record.publisher}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
