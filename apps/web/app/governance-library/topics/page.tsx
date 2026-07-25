import Link from "next/link";
import {
  governanceLibraryRecords,
} from "../../../lib/governance-library";
import type {
  GovernanceLibraryRecord,
} from "../../../lib/governance-library/records-foundational";

export default function GovernanceLibraryTopicsPage() {
  const topics = Array.from(
    new Set(
      governanceLibraryRecords.flatMap(
        (record: GovernanceLibraryRecord) => record.keyTopics
      )
    )
  ).sort();

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <p className="text-sm uppercase tracking-[0.22em] text-sky-300">
          TA-14 AI Governance Library
        </p>

        <h1 className="mt-3 text-5xl font-bold">
          Governance Topics
        </h1>

        <p className="mt-6 max-w-3xl text-lg text-slate-300">
          Explore the major governance concepts represented throughout the
          library.
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          {topics.map((topic: string) => {
            const count = governanceLibraryRecords.filter(
              (record: GovernanceLibraryRecord) =>
                record.keyTopics.includes(topic)
            ).length;

            return (
              <Link
                key={topic}
                href="/governance-library/all"
                className="rounded-full border border-sky-400/30 bg-sky-400/10 px-4 py-2 transition hover:bg-sky-400/20"
              >
                {topic}
                <span className="ml-2 text-sky-300">({count})</span>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
