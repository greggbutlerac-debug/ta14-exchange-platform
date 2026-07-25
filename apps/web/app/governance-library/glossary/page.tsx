import Link from "next/link";
import {
  governanceLibraryRecords,
} from "../../../lib/governance-library";
import type {
  GovernanceLibraryRecord,
} from "../../../lib/governance-library/records-foundational";

type GlossaryEntry = {
  term: string;
  count: number;
  records: GovernanceLibraryRecord[];
};

export default function GovernanceLibraryGlossaryPage() {
  const glossary = new Map<string, GovernanceLibraryRecord[]>();

  governanceLibraryRecords.forEach((record: GovernanceLibraryRecord) => {
    record.keyTopics.forEach((topic: string) => {
      if (!glossary.has(topic)) {
        glossary.set(topic, []);
      }

      glossary.get(topic)!.push(record);
    });
  });

  const entries: GlossaryEntry[] = [...glossary.entries()]
    .map(([term, records]) => ({
      term,
      count: records.length,
      records,
    }))
    .sort((a, b) => a.term.localeCompare(b.term));

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <p className="text-sm uppercase tracking-[0.22em] text-sky-300">
          TA-14 AI Governance Library
        </p>

        <h1 className="mt-3 text-5xl font-bold">
          Governance Glossary
        </h1>

        <p className="mt-6 max-w-3xl text-lg text-slate-300">
          Browse governance terms and the library records in which each concept
          appears.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {entries.map((entry) => (
            <section
              key={entry.term}
              className="rounded-xl border border-white/10 bg-white/5 p-6"
            >
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-2xl font-semibold">
                  {entry.term}
                </h2>

                <span className="rounded-full bg-sky-400/10 px-3 py-1 text-sm text-sky-300">
                  {entry.count}
                </span>
              </div>

              <div className="mt-5 space-y-3">
                {entry.records.map((record) => (
                  <Link
                    key={record.slug}
                    href={`/governance-library/${record.slug}`}
                    className="block rounded-lg border border-white/10 p-4 transition hover:border-sky-400/40"
                  >
                    <div className="font-semibold">
                      {record.title}
                    </div>

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
