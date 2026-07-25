"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import {
  listPreservedRuntimeGovernedRecords,
  verifyPreservedRuntimeGovernedRecord,
  type PreservedRuntimeGovernedRecord,
} from "../../../../../lib/governance-playgrounds";

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default function RuntimePreservedRecordsPage() {
  const [records, setRecords] = useState<
    PreservedRuntimeGovernedRecord[]
  >([]);

  useEffect(() => {
    setRecords(listPreservedRuntimeGovernedRecords());
  }, []);

  const verifiedRecords = useMemo(
    () =>
      records.map((record) => ({
        record,
        verification:
          verifyPreservedRuntimeGovernedRecord(record),
      })),
    [records],
  );

  return (
    <main className="min-h-screen bg-[#03060b] px-5 py-10 text-white sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-200/70">
              TA-14 Runtime Execution
            </p>

            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Preserved Runtime Records
            </h1>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-white/65 sm:text-base">
              These records were preserved from approved Runtime
              governed-record candidates. Each record remains bounded
              by its evidence, authority, lineage, and preserved
              limitations.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/ai-governance/playground/runtime-execution/preserve"
              className="rounded-xl border border-sky-300/30 bg-sky-300/10 px-4 py-2.5 text-sm font-semibold text-sky-100 transition hover:border-sky-200/50 hover:bg-sky-300/15"
            >
              Preserve Record
            </Link>

            <Link
              href="/ai-governance/playground/runtime-execution"
              className="rounded-xl border border-white/15 bg-white/[0.05] px-4 py-2.5 text-sm font-semibold transition hover:border-white/30 hover:bg-white/[0.09]"
            >
              Runtime Workspace
            </Link>
          </div>
        </div>

        <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.035] p-6 shadow-2xl shadow-black/30">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">
                Preserved record inventory
              </h2>

              <p className="mt-2 text-sm text-white/55">
                {records.length} preserved{" "}
                {records.length === 1 ? "record" : "records"}
              </p>
            </div>

            <span className="rounded-full border border-white/15 bg-white/[0.05] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-white/65">
              Local browser storage
            </span>
          </div>

          {verifiedRecords.length > 0 ? (
            <div className="mt-6 space-y-4">
              {verifiedRecords.map(
                ({ record, verification }) => (
                  <article
                    key={record.recordId}
                    className="rounded-2xl border border-white/10 bg-black/20 p-5"
                  >
                    <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full border border-white/15 bg-white/[0.05] px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-white/65">
                            {record.status}
                          </span>

                          <span
                            className={`rounded-full border px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] ${
                              verification.preservationValid
                                ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
                                : "border-rose-400/30 bg-rose-400/10 text-rose-200"
                            }`}
                          >
                            {verification.preservationValid
                              ? "Verified"
                              : "Verification issue"}
                          </span>

                          <span className="rounded-full border border-sky-400/25 bg-sky-400/[0.08] px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-sky-200/85">
                            {record.determination}
                          </span>
                        </div>

                        <h3 className="mt-4 text-xl font-semibold text-white/90">
                          {record.title}
                        </h3>

                        <p className="mt-2 break-all font-mono text-xs text-white/40">
                          {record.recordId}
                        </p>

                        <div className="mt-5 grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
                          <div>
                            <p className="text-xs uppercase tracking-[0.16em] text-white/35">
                              Preserved
                            </p>
                            <p className="mt-2 text-white/70">
                              {formatDate(record.preservedAt)}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs uppercase tracking-[0.16em] text-white/35">
                              Evidence
                            </p>
                            <p className="mt-2 text-white/70">
                              {record.payload.evidenceIds.length}{" "}
                              {record.payload.evidenceIds.length ===
                              1
                                ? "reference"
                                : "references"}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs uppercase tracking-[0.16em] text-white/35">
                              Errors
                            </p>
                            <p className="mt-2 text-white/70">
                              {verification.summary.errors}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs uppercase tracking-[0.16em] text-white/35">
                              Warnings
                            </p>
                            <p className="mt-2 text-white/70">
                              {verification.summary.warnings}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex shrink-0 flex-wrap gap-3">
                        <Link
                          href={`/ai-governance/playground/runtime-execution/preserved/${encodeURIComponent(
                            record.recordId,
                          )}`}
                          className="rounded-xl border border-white/15 bg-white/[0.05] px-4 py-2.5 text-sm font-semibold transition hover:border-white/30 hover:bg-white/[0.09]"
                        >
                          Open Record
                        </Link>

                        <Link
                          href={`/ai-governance/playground/runtime-execution/preserved/${encodeURIComponent(
                            record.recordId,
                          )}/envelope`}
                          className="rounded-xl border border-sky-300/30 bg-sky-300/10 px-4 py-2.5 text-sm font-semibold text-sky-100 transition hover:border-sky-200/50 hover:bg-sky-300/15"
                        >
                          Integrity Envelope
                        </Link>
                      </div>
                    </div>
                  </article>
                ),
              )}
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-dashed border-white/15 bg-black/20 p-8">
              <p className="text-sm font-semibold text-white/75">
                No Runtime governed records have been preserved.
              </p>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-white/50">
                A candidate must first be reviewed and approved for
                preservation. The preservation workspace then creates
                the immutable governed record and its separate
                integrity envelope.
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href="/ai-governance/playground/runtime-execution/records"
                  className="rounded-xl border border-white/15 bg-white/[0.05] px-4 py-2.5 text-sm font-semibold transition hover:border-white/30 hover:bg-white/[0.09]"
                >
                  Review Candidates
                </Link>

                <Link
                  href="/ai-governance/playground/runtime-execution/preserve"
                  className="rounded-xl border border-sky-300/30 bg-sky-300/10 px-4 py-2.5 text-sm font-semibold text-sky-100 transition hover:border-sky-200/50 hover:bg-sky-300/15"
                >
                  Open Preservation Workspace
                </Link>
              </div>
            </div>
          )}
        </section>

        <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.035] p-6">
          <h2 className="text-lg font-semibold">
            Preservation boundary
          </h2>

          <p className="mt-4 max-w-5xl text-sm leading-7 text-white/65">
            A preserved Runtime governed record proves what was
            recorded, reviewed, approved, and preserved within the
            declared evidence and authority boundaries. It does not,
            by itself, prove that a real-world execution occurred,
            that every source assertion was true, or that a
            certification or regulatory obligation was satisfied.
          </p>
        </section>
      </div>
    </main>
  );
}
