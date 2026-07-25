import Link from "next/link";
import {
  governanceLibraryRecords,
} from "../../../lib/governance-library";
import type {
  GovernanceLibraryRecord,
} from "../../../lib/governance-library/records-foundational";

export default function GovernanceLibraryCoveragePage() {
  const records: GovernanceLibraryRecord[] = governanceLibraryRecords;

  const missingReferences = records.filter((r) => !r.officialUrl).length;
  const withReferences = records.length - missingReferences;

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <p className="text-sm uppercase tracking-[0.22em] text-sky-300">
          TA-14 AI Governance Library
        </p>

        <h1 className="mt-3 text-5xl font-bold">
          Library Coverage Report
        </h1>

        <p className="mt-6 max-w-3xl text-lg text-slate-300">
          Review the current completeness of the governance library and identify
          records that still need additional source material, metadata, or
          cross-reference expansion.
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <Metric title="Total Records" value={records.length} />
          <Metric title="With Official Sources" value={withReferences} />
          <Metric title="Missing Sources" value={missingReferences} />
        </div>

        <div className="mt-12 rounded-xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-2xl font-semibold">Records Needing Attention</h2>

          <div className="mt-6 space-y-4">
            {records
              .filter((record: GovernanceLibraryRecord) => !record.officialUrl)
              .map((record: GovernanceLibraryRecord) => (
                <Link
                  key={record.slug}
                  href={`/governance-library/${record.slug}`}
                  className="block rounded-lg border border-white/10 p-4 transition hover:border-sky-400/40"
                >
                  <div className="font-semibold">{record.title}</div>
                  <div className="mt-2 text-sm text-slate-400">
                    {record.publisher} • {record.recordType}
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </main>
  );
}

function Metric({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-6">
      <div className="text-4xl font-bold text-sky-300">{value}</div>
      <div className="mt-2 text-slate-300">{title}</div>
    </div>
  );
}
