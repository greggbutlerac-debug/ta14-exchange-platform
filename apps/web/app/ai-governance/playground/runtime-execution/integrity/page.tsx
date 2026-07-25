"use client";

import Link from "next/link";
import { useMemo } from "react";

import {
  listPreservedRuntimeGovernedRecords,
  verifyPreservedRuntimeGovernedRecord,
} from "../../../../../lib/governance-playgrounds";

export default function RuntimeIntegrityDashboardPage() {
  const records = listPreservedRuntimeGovernedRecords();

  const summary = useMemo(() => {
    let valid = 0;
    let invalid = 0;
    let warnings = 0;
    let errors = 0;

    for (const record of records) {
      const verification = verifyPreservedRuntimeGovernedRecord(record);

      warnings += verification.summary.warnings;
      errors += verification.summary.errors;

      if (
        verification.structurallyValid &&
        verification.preservationValid
      ) {
        valid += 1;
      } else {
        invalid += 1;
      }
    }

    return {
      total: records.length,
      valid,
      invalid,
      warnings,
      errors,
    };
  }, [records]);

  return (
    <main className="min-h-screen bg-[#03060b] px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-200/70">
              TA-14 Runtime Execution
            </p>

            <h1 className="mt-3 text-4xl font-bold">
              Integrity Dashboard
            </h1>

            <p className="mt-4 max-w-3xl text-white/65">
              View the overall integrity health of every preserved
              Runtime governed record.
            </p>
          </div>

          <Link
            href="/ai-governance/playground/runtime-execution"
            className="rounded-xl border border-white/15 bg-white/[0.05] px-5 py-3 font-semibold hover:bg-white/[0.08]"
          >
            Runtime Workspace
          </Link>
        </div>

        <section className="mt-8 grid gap-5 md:grid-cols-5">
          <StatCard title="Records" value={summary.total} />
          <StatCard title="Valid" value={summary.valid} />
          <StatCard title="Issues" value={summary.invalid} />
          <StatCard title="Warnings" value={summary.warnings} />
          <StatCard title="Errors" value={summary.errors} />
        </section>

        <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.035] p-6">
          <h2 className="text-xl font-semibold">
            Runtime Integrity Status
          </h2>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b border-white/10 text-sm text-white/55">
                <tr>
                  <th className="pb-3">Title</th>
                  <th className="pb-3">Determination</th>
                  <th className="pb-3">Integrity</th>
                  <th className="pb-3">Warnings</th>
                  <th className="pb-3">Errors</th>
                </tr>
              </thead>

              <tbody>
                {records.map((record) => {
                  const verification =
                    verifyPreservedRuntimeGovernedRecord(record);

                  return (
                    <tr
                      key={record.recordId}
                      className="border-b border-white/5"
                    >
                      <td className="py-4">
                        <Link
                          href={`/ai-governance/playground/runtime-execution/preserved/${encodeURIComponent(
                            record.recordId,
                          )}`}
                          className="hover:text-sky-200"
                        >
                          {record.title}
                        </Link>
                      </td>

                      <td>{record.determination}</td>

                      <td>
                        {verification.structurallyValid &&
                        verification.preservationValid
                          ? "Healthy"
                          : "Issue"}
                      </td>

                      <td>{verification.summary.warnings}</td>

                      <td>{verification.summary.errors}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}

function StatCard({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
      <p className="text-xs uppercase tracking-[0.18em] text-white/45">
        {title}
      </p>

      <p className="mt-3 text-3xl font-bold">{value}</p>
    </div>
  );
}
