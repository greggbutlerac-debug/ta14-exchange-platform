import Link from "next/link";
import {
  governanceLibraryRecords,
} from "../../../lib/governance-library";
import type {
  GovernanceLibraryRecord,
} from "../../../lib/governance-library/records-foundational";

export default function GovernanceLibraryRelationshipsPage() {
  const records: GovernanceLibraryRecord[] = governanceLibraryRecords.filter(
    (record) => record.relatedSlugs.length > 0
  );

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <p className="text-sm uppercase tracking-[0.22em] text-sky-300">
          TA-14 AI Governance Library
        </p>

        <h1 className="mt-3 text-5xl font-bold">
          Governance Relationships
        </h1>

        <p className="mt-6 max-w-3xl text-lg text-slate-300">
          Explore how governance frameworks, laws, standards, regulations,
          methodologies, and TA-14 records relate to one another.
        </p>

        <div className="mt-10 space-y-6">
          {records.map((record: GovernanceLibraryRecord) => (
            <div
              key={record.slug}
              className="rounded-xl border border-white/10 bg-white/5 p-6"
            >
              <Link
                href={`/governance-library/${record.slug}`}
                className="text-2xl font-semibold text-white hover:text-sky-300"
              >
                {record.title}
              </Link>

              <p className="mt-3 text-slate-300">
                {record.summary}
              </p>

              <div className="mt-6">
                <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-300">
                  Related Records
                </h3>

                <div className="mt-3 flex flex-wrap gap-2">
                  {record.relatedSlugs.map((slug: string) => (
                    <Link
                      key={slug}
                      href={`/governance-library/${slug}`}
                      className="rounded-full border border-sky-400/30 bg-sky-400/10 px-3 py-1 text-sm text-sky-300 transition hover:bg-sky-400/20"
                    >
                      {slug}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
