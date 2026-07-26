import Link from "next/link";
import GovernanceLibraryQuickLinks from "../../../components/governance-library/GovernanceLibraryQuickLinks";
import { governanceLibraryRecords } from "../../../lib/governance-library";

export default function GovernanceLibraryAllPage() {
  const records = [...governanceLibraryRecords].sort((a, b) =>
    a.title.localeCompare(b.title)
  );

  return (
    <div>
      <section className="rounded-2xl border border-white/10 bg-white/5 p-8 md:p-10">
        <p className="text-sm uppercase tracking-[0.22em] text-sky-300">
          TA-14 AI Governance Library
        </p>

        <h1 className="mt-3 text-4xl font-bold md:text-5xl">
          All Governance Records
        </h1>

        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
          Browse the complete collection of governance laws, standards,
          frameworks, guidance, methodologies, and TA-14 records currently
          indexed in the library.
        </p>

        <p className="mt-4 text-sm text-slate-400">
          {records.length} records indexed
        </p>
      </section>

      <div className="mt-8">
        <GovernanceLibraryQuickLinks />
      </div>

      <section className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {records.map((record) => (
          <Link
            key={record.slug}
            href={`/governance-library/${record.slug}`}
            className="rounded-xl border border-white/10 bg-white/5 p-6 transition hover:border-sky-400/40 hover:bg-white/[0.07]"
          >
            <p className="text-xs uppercase tracking-[0.16em] text-sky-300">
              {record.recordType}
            </p>

            <h2 className="mt-3 text-xl font-semibold text-white">
              {record.title}
            </h2>

            <p className="mt-3 line-clamp-4 text-sm leading-6 text-slate-300">
              {record.summary}
            </p>

            <div className="mt-5 flex flex-wrap gap-2 text-xs text-slate-400">
              <span>{record.publisher}</span>
              <span aria-hidden="true">·</span>
              <span>{record.jurisdiction}</span>
              <span aria-hidden="true">·</span>
              <span>{record.status}</span>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}
