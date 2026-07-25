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

export default async function JurisdictionPage({ params }: Props) {
  const { slug } = await params;

  const records: GovernanceLibraryRecord[] =
    governanceLibraryRecords.filter(
      (record) => slugify(record.jurisdiction) === slug
    );

  const title =
    records.length > 0
      ? records[0].jurisdiction
      : slug
          .split("-")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ");

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <p className="text-sm uppercase tracking-[0.22em] text-sky-300">
          Jurisdiction
        </p>

        <h1 className="mt-3 text-5xl font-bold">{title}</h1>

        <p className="mt-6 text-lg text-slate-300">
          {records.length} governance {records.length === 1 ? "record" : "records"} available.
        </p>

        <div className="mt-8 flex gap-4">
          <Link
            href="/governance-library/jurisdiction"
            className="rounded-lg border border-white/15 bg-white/5 px-5 py-3 font-semibold"
          >
            All Jurisdictions
          </Link>

          <Link
            href="/governance-library/all"
            className="rounded-lg bg-sky-400 px-5 py-3 font-semibold text-slate-950"
          >
            Browse Library
          </Link>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {records.map((record: GovernanceLibraryRecord) => (
            <Link
              key={record.slug}
              href={`/governance-library/${record.slug}`}
              className="rounded-xl border border-white/10 bg-white/5 p-6 transition hover:border-sky-400/40"
            >
              <p className="text-xs uppercase tracking-[0.16em] text-sky-300">
                {record.recordType}
              </p>

              <h2 className="mt-3 text-xl font-semibold">
                {record.title}
              </h2>

              <p className="mt-3 leading-7 text-slate-300">
                {record.summary}
              </p>

              <div className="mt-4 text-sm text-slate-400">
                {record.publisher}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
