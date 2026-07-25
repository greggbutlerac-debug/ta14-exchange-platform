import Link from "next/link";
import {
  governanceLibraryRecords,
} from "../../../lib/governance-library";
import type {
  GovernanceLibraryRecord,
} from "../../../lib/governance-library/records-foundational";

export default function GovernancePublishersPage() {
  const publishers = Array.from(
    new Set(
      governanceLibraryRecords.map(
        (record: GovernanceLibraryRecord) => record.publisher
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
          Governance Publishers
        </h1>

        <p className="mt-6 max-w-3xl text-lg text-slate-300">
          Browse governance records by issuing organization, standards body,
          regulator, or publisher.
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {publishers.map((publisher: string) => {
            const count = governanceLibraryRecords.filter(
              (record: GovernanceLibraryRecord) =>
                record.publisher === publisher
            ).length;

            return (
              <div
                key={publisher}
                className="rounded-xl border border-white/10 bg-white/5 p-6"
              >
                <h2 className="text-xl font-semibold">{publisher}</h2>

                <p className="mt-3 text-slate-300">
                  {count} record{count === 1 ? "" : "s"}
                </p>

                <Link
                  href={`/governance-library/all`}
                  className="mt-5 inline-block text-sm font-semibold text-sky-300"
                >
                  View Records →
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
