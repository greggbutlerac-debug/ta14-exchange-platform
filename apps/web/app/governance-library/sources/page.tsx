import Link from "next/link";
import {
  governanceLibraryRecords,
} from "../../../lib/governance-library";
import type {
  GovernanceLibraryRecord,
} from "../../../lib/governance-library/records-foundational";

export default function GovernanceLibrarySourceIndexPage() {
  const withSources = governanceLibraryRecords.filter(
    (record: GovernanceLibraryRecord) =>
      record.officialUrl || (record as any).sourceUrl
  );

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <p className="text-sm uppercase tracking-[0.22em] text-sky-300">
          TA-14 AI Governance Library
        </p>

        <h1 className="mt-3 text-5xl font-bold">
          Official Source Index
        </h1>

        <p className="mt-6 max-w-3xl text-lg text-slate-300">
          Access governance records alongside their originating standards,
          regulations, guidance documents, or official publications.
        </p>

        <div className="mt-10 grid gap-5">
          {withSources.map((record: GovernanceLibraryRecord) => {
            const source =
              record.officialUrl ?? (record as any).sourceUrl;

            return (
              <div
                key={record.slug}
                className="rounded-xl border border-white/10 bg-white/5 p-6"
              >
                <Link
                  href={`/governance-library/${record.slug}`}
                  className="text-xl font-semibold hover:text-sky-300"
                >
                  {record.title}
                </Link>

                <p className="mt-2 text-slate-300">
                  {record.summary}
                </p>

                <div className="mt-4 flex flex-wrap gap-3 text-sm">
                  <span className="rounded-full bg-sky-400/10 px-3 py-1 text-sky-300">
                    {record.publisher}
                  </span>

                  <span className="rounded-full bg-white/10 px-3 py-1">
                    {record.recordType}
                  </span>

                  <a
                    href={source}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-sky-400/30 px-3 py-1 text-sky-300 hover:bg-sky-400/10"
                  >
                    Official Source →
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
