import Link from "next/link";
import {
  governanceLibraryRecords,
} from "../../../lib/governance-library";
import type {
  GovernanceLibraryRecord,
} from "../../../lib/governance-library/records-foundational";

type TopicSummary = {
  topic: string;
  count: number;
  records: GovernanceLibraryRecord[];
};

export default function GovernanceLibraryTopicMapPage() {
  const map = new Map<string, GovernanceLibraryRecord[]>();

  governanceLibraryRecords.forEach((record: GovernanceLibraryRecord) => {
    record.keyTopics.forEach((topic: string) => {
      if (!map.has(topic)) {
        map.set(topic, []);
      }

      map.get(topic)!.push(record);
    });
  });

  const topics: TopicSummary[] = [...map.entries()]
    .map(([topic, records]) => ({
      topic,
      count: records.length,
      records,
    }))
    .sort((a, b) => b.count - a.count);

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <p className="text-sm uppercase tracking-[0.22em] text-sky-300">
          TA-14 AI Governance Library
        </p>

        <h1 className="mt-3 text-5xl font-bold">
          Governance Topic Map
        </h1>

        <p className="mt-6 max-w-3xl text-lg text-slate-300">
          Explore every governance topic and the records connected to it.
        </p>

        <div className="mt-10 space-y-8">
          {topics.map((topic) => (
            <section
              key={topic.topic}
              className="rounded-xl border border-white/10 bg-white/5 p-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">
                  {topic.topic}
                </h2>

                <span className="rounded-full bg-sky-400/10 px-3 py-1 text-sm text-sky-300">
                  {topic.count}
                </span>
              </div>

              <div className="mt-6 grid gap-3 md:grid-cols-2">
                {topic.records.map((record) => (
                  <Link
                    key={record.slug}
                    href={`/governance-library/${record.slug}`}
                    className="rounded-lg border border-white/10 p-4 transition hover:border-sky-400/40"
                  >
                    <div className="font-semibold">
                      {record.title}
                    </div>

                    <div className="mt-2 text-sm text-slate-400">
                      {record.recordType} · {record.publisher}
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
