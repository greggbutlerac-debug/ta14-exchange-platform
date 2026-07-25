import Link from "next/link";
import {
  governanceLibraryRecords,
} from "../../../lib/governance-library";
import type {
  GovernanceLibraryRecord,
} from "../../../lib/governance-library/records-foundational";

export default function GovernanceLibraryComparePage() {
  const records: GovernanceLibraryRecord[] = [...governanceLibraryRecords].sort(
    (a, b) => a.title.localeCompare(b.title)
  );

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <p className="text-sm uppercase tracking-[0.22em] text-sky-300">
          TA-14 AI Governance Library
        </p>

        <h1 className="mt-3 text-5xl font-bold">
          Governance Comparison Matrix
        </h1>

        <p className="mt-6 max-w-3xl text-lg text-slate-300">
          Compare governance frameworks, laws, standards, regulations, and
          methodologies across jurisdiction, publisher, status, and record type.
        </p>

        <div className="mt-10 overflow-x-auto rounded-xl border border-white/10">
          <table className="min-w-full text-left">
            <thead className="border-b border-white/10 bg-white/5">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Jurisdiction</th>
                <th className="px-4 py-3">Publisher</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>

            <tbody>
              {records.map((record: GovernanceLibraryRecord) => (
                <tr
                  key={record.slug}
                  className="border-b border-white/5 hover:bg-white/[0.03]"
                >
                  <td className="px-4 py-4">{record.title}</td>
                  <td className="px-4 py-4">{record.recordType}</td>
                  <td className="px-4 py-4">{record.jurisdiction}</td>
                  <td className="px-4 py-4">{record.publisher}</td>
                  <td className="px-4 py-4">{record.status}</td>
                  <td className="px-4 py-4">
                    <Link
                      href={`/governance-library/${record.slug}`}
                      className="font-semibold text-sky-300"
                    >
                      View →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
