import Link from "next/link";
import { governanceLibraryRecords } from "../../../lib/governance-library";
import type { GovernanceLibraryRecord } from "../../../lib/governance-library/records-foundational";

export default function GovernanceLibraryReferencesPage() {
  const records: GovernanceLibraryRecord[] = governanceLibraryRecords.filter(
    (record: GovernanceLibraryRecord) => Boolean(record.officialUrl)
  );

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <p className="text-sm uppercase tracking-[0.22em] text-sky-300">
          TA-14 AI Governance Library
        </p>

        <h1 className="mt-3 text-5xl font-bold">
          Official References
        </h1>

        <p className="mt-6 max-w-3xl text-lg text-slate-300">
          Browse governance records that include official publications,
          standards, laws, regulations, or authoritative source material.
        </p>

        <div className="mt-10 grid gap-5">
          {records.map((record: GovernanceLibraryRecord) => (
            <div
              key={record.slug}
              className="rounded-xl border border-white/10 bg-white/5 p-6"
            >
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-sky-400/10 px-3 py-1 text-xs uppercase text-sky-300">
                  {record.recordType}
                </span>

                <span className="rounded-full border border-white/10 px-3 py-1 text-xs">
                  {record.publisher}
                </span>
              </div>

              <h2 className="mt-4 text-2xl font-semibold">
                {record.title}
              </h2>

              <p className="mt-3 leading-7 text-slate-300">
                {record.summary}
              </p>

              <div className="mt-6 flex flex-wrap gap-4">
                <Link
                  href={`/governance-library/${record.slug}`}
                  className="rounded-lg border border-white/15 bg-white/5 px-5 py-3 font-semibold transition hover:border-sky-400/50"
                >
                  View Record
                </Link>

                <a
                  href={record.officialUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg bg-sky-400 px-5 py-3 font-semibold text-slate-950"
                >
                  Official Source
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
