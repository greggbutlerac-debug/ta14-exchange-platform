import Link from "next/link";
import {
  governanceLibraryRecords,
} from "../../../lib/governance-library";
import type {
  GovernanceLibraryRecord,
} from "../../../lib/governance-library/records-foundational";

type YearGroup = {
  year: string;
  records: GovernanceLibraryRecord[];
};

export default function GovernanceLibraryYearIndexPage() {
  const groups = new Map<string, GovernanceLibraryRecord[]>();

  governanceLibraryRecords.forEach((record: GovernanceLibraryRecord) => {
    const year =
      String((record as any).publicationYear ?? (record as any).year ?? "Unknown");

    if (!groups.has(year)) {
      groups.set(year, []);
    }

    groups.get(year)!.push(record);
  });

  const years: YearGroup[] = [...groups.entries()]
    .map(([year, records]) => ({ year, records }))
    .sort((a, b) => b.year.localeCompare(a.year));

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <p className="text-sm uppercase tracking-[0.22em] text-sky-300">
          TA-14 AI Governance Library
        </p>

        <h1 className="mt-3 text-5xl font-bold">
          Publication Year Index
        </h1>

        <p className="mt-6 max-w-3xl text-lg text-slate-300">
          Browse governance records organized by publication year.
        </p>

        <div className="mt-10 space-y-8">
          {years.map(({ year, records }) => (
            <section
              key={year}
              className="rounded-xl border border-white/10 bg-white/5 p-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-semibold">{year}</h2>
                <span className="rounded-full bg-sky-400/10 px-3 py-1 text-sm text-sky-300">
                  {records.length}
                </span>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {records.map((record) => (
                  <Link
                    key={record.slug}
                    href={`/governance-library/${record.slug}`}
                    className="rounded-lg border border-white/10 p-4 transition hover:border-sky-400/40"
                  >
                    <div className="font-semibold">{record.title}</div>
                    <div className="mt-2 text-sm text-slate-400">
                      {record.publisher} · {record.recordType}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
