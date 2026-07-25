import Link from "next/link";
import { getAllRecordTypes } from "../../../lib/governance-library/filters";

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function GovernanceRecordTypesPage() {
  const recordTypes = getAllRecordTypes();

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <p className="text-sm uppercase tracking-[0.22em] text-sky-300">
          TA-14 AI Governance Library
        </p>

        <h1 className="mt-3 text-5xl font-bold">
          Governance Record Types
        </h1>

        <p className="mt-6 max-w-3xl text-lg text-slate-300">
          Browse governance resources grouped by record type, including laws,
          standards, frameworks, guidance, principles, methodologies, and other
          governance artifacts.
        </p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {recordTypes.map((recordType: string) => (
            <Link
              key={recordType}
              href={`/governance-library/type/${slugify(recordType)}`}
              className="rounded-xl border border-white/10 bg-white/5 p-6 transition hover:border-sky-400/40"
            >
              <h2 className="text-xl font-semibold">{recordType}</h2>

              <div className="mt-5 text-sm font-semibold text-sky-300">
                View Records →
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
