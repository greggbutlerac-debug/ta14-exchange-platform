import Link from "next/link";
import {
  governanceLibraryRecords,
} from "../../../../lib/governance-library";
import type {
  GovernanceLibraryRecord,
} from "../../../../lib/governance-library/records-foundational";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default async function GovernancePublisherPage({
  params,
}: Props) {
  const { slug } = await params;

  const records: GovernanceLibraryRecord[] =
    governanceLibraryRecords.filter(
      (record: GovernanceLibraryRecord) =>
        slugify(record.publisher) === slug
    );

  const publisher =
    records.length > 0
      ? records[0].publisher
      : slug
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <p className="text-sm uppercase tracking-[0.22em] text-sky-300">
          Governance Publisher
        </p>

        <h1 className="mt-3 text-5xl font-bold">{publisher}</h1>

        <p className="mt-6 text-lg text-slate-300">
          {records.length} governance{" "}
          {records.length === 1 ? "record" : "records"} available.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/governance-library/publishers"
            className="rounded-lg border border-white/15 bg-white/5 px-5 py-3 font-semibold transition hover:border-sky-400/50"
          >
            All Publishers
          </Link>

          <Link
            href="/governance-library/all"
            className="rounded-lg bg-sky-400 px-5 py-3 font-semibold text-slate-950"
          >
            Browse All Records
          </Link>
        </div>

        {records.length > 0 ? (
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {records.map((record: GovernanceLibraryRecord) => (
              <Link
                key={record.slug}
                href={`/governance-library/${record.slug}`}
                className="rounded-xl border border-white/10 bg-white/5 p-6 transition hover:border-sky-400/40"
              >
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-sky-400/10 px-3 py-1 text-xs uppercase text-sky-300">
                    {record.recordType}
                  </span>

                  <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">
                    {record.jurisdiction}
                  </span>
                </div>

                <h2 className="mt-4 text-xl font-semibold">
                  {record.title}
                </h2>

                <p className="mt-3 leading-7 text-slate-300">
                  {record.summary}
                </p>

                <p className="mt-4 text-sm text-slate-400">
                  {record.status}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-xl border border-white/10 bg-white/5 p-8">
            <h2 className="text-2xl font-semibold">No records found</h2>
            <p className="mt-3 text-slate-300">
              This publisher does not currently have any published governance
              records in the library.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
