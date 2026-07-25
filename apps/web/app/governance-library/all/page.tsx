import Link from "next/link";
import { governanceLibraryRecords } from "../../../lib/governance-library";
import type { GovernanceLibraryRecord } from "../../../lib/governance-library/records-foundational";

export default function GovernanceLibraryAllPage() {
  const records: GovernanceLibraryRecord[] = [...governanceLibraryRecords].sort(
    (a, b) => a.title.localeCompare(b.title)
  );

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <p className="text-sm uppercase tracking-[0.22em] text-sky-300">
          TA-14 AI Governance Library
        </p>

        <h1 className="mt-3 text-5xl font-bold">
          Browse All Governance Records
        </h1>

        <p className="mt-6 max-w-3xl text-lg text-slate-300">
          Review every governance record currently available in the TA-14 AI
          Governance Library.
        </p>

        <div className="mt-8">
          <Link
            href="/governance-library"
            className="inline-block rounded-lg border border-white/15 bg-white/5 px-5 py-3 font-semibold text-white transition hover:border-sky-400/50"
          >
            Return to Library
          </Link>
        </div>

        <div className="mt-10 grid gap-4">
          {records.map((record: GovernanceLibraryRecord) => (
            <Link
              key={record.slug}
              href={`/governance-library/${record.slug}`}
              className="rounded-xl border border-white/10 bg-white/5 p-5 transition hover:border-sky-400/40"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold">{record.title}</h2>

                  <p className="mt-2 text-sm text-slate-400">
                    {record.publisher} · {record.jurisdiction} · {record.status}
                  </p>
                </div>

                <span className="shrink-0 rounded-full bg-sky-400/10 px-3 py-1 text-xs uppercase text-sky-300">
                  {record.recordType}
                </span>
              </div>

              <p className="mt-4 leading-7 text-slate-300">
                {record.summary}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {record.categories.map((category: string) => (
                  <span
                    key={category}
                    className="rounded-full border border-white/10 px-2 py-1 text-xs text-slate-300"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
