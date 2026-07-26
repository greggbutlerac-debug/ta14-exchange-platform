import Link from "next/link";
import GovernanceLibraryQuickLinks from "../../components/governance-library/GovernanceLibraryQuickLinks";
import {
  governanceLibraryRecords,
} from "../../lib/governance-library";
import type {
  GovernanceLibraryRecord,
} from "../../lib/governance-library/records-foundational";

export default function GovernanceLibraryPage() {
  const featuredRecords: GovernanceLibraryRecord[] =
    governanceLibraryRecords.slice(0, 6);

  return (
    <div>
      <section className="rounded-2xl border border-white/10 bg-white/5 p-8 md:p-12">
        <p className="text-sm uppercase tracking-[0.22em] text-sky-300">
          TA-14 AI Governance Exchange
        </p>

        <h1 className="mt-4 max-w-4xl text-4xl font-bold md:text-6xl">
          AI Governance Library
        </h1>

        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
          A structured public library of AI governance laws, standards,
          frameworks, guidance, methodologies, and TA-14 governance records.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/governance-library/all"
            className="rounded-lg bg-sky-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-sky-300"
          >
            Explore All Records
          </Link>

          <Link
            href="/governance-library/dashboard"
            className="rounded-lg border border-white/15 px-5 py-3 font-semibold text-white transition hover:border-sky-400/40 hover:bg-sky-400/10"
          >
            View Library Dashboard
          </Link>
        </div>
      </section>

      <div className="mt-8">
        <GovernanceLibraryQuickLinks />
      </div>

      <section className="mt-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-sky-300">
              Featured Records
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              Begin with the governance foundations
            </h2>
          </div>

          <p className="text-sm text-slate-400">
            {governanceLibraryRecords.length} records currently indexed
          </p>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {featuredRecords.map((record: GovernanceLibraryRecord) => (
            <Link
              key={record.slug}
              href={`/governance-library/${record.slug}`}
              className="rounded-xl border border-white/10 bg-white/5 p-6 transition hover:border-sky-400/40 hover:bg-white/[0.07]"
            >
              <p className="text-xs uppercase tracking-[0.16em] text-sky-300">
                {record.recordType}
              </p>

              <h3 className="mt-3 text-xl font-semibold">
                {record.title}
              </h3>

              <p className="mt-3 line-clamp-4 text-sm leading-6 text-slate-300">
                {record.summary}
              </p>

              <p className="mt-5 text-xs text-slate-400">
                {record.publisher} · {record.jurisdiction}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
