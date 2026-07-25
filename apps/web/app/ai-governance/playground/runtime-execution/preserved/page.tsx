"use client";

import { useEffect, useMemo, useState } from "react";

import {
  exportPreservedRuntimeRecordById,
  listPreservedRuntimeGovernedRecords,
  verifyPreservedRuntimeGovernedRecord,
  type PreservedRuntimeGovernedRecord,
  type PreservedRuntimeRecordVerification,
} from "../../../../../lib/governance-playgrounds";

type VerifiedRecord = {
  record: PreservedRuntimeGovernedRecord;
  verification: PreservedRuntimeRecordVerification;
};

const statusClasses = {
  PRESERVED:
    "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
  SUPERSEDED:
    "border-amber-400/30 bg-amber-400/10 text-amber-200",
  REVOKED:
    "border-rose-400/30 bg-rose-400/10 text-rose-200",
} as const;

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

function downloadJson(
  filename: string,
  contents: string,
): void {
  const blob = new Blob([contents], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  URL.revokeObjectURL(url);
}

export default function RuntimePreservedRecordsPage() {
  const [records, setRecords] = useState<
    PreservedRuntimeGovernedRecord[]
  >([]);

  useEffect(() => {
    setRecords(listPreservedRuntimeGovernedRecords());
  }, []);

  const verifiedRecords = useMemo<VerifiedRecord[]>(
    () =>
      records.map((record) => ({
        record,
        verification:
          verifyPreservedRuntimeGovernedRecord(record),
      })),
    [records],
  );

  function handleExport(
    record: PreservedRuntimeGovernedRecord,
  ): void {
    const json = exportPreservedRuntimeRecordById(
      record.recordId,
    );

    downloadJson(
      `${record.recordId}.json`,
      json,
    );
  }

  return (
    <main className="min-h-screen bg-[#03060b] px-5 py-10 text-white sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <header className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 shadow-2xl shadow-black/30 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-200/70">
            TA-14 Runtime Execution
          </p>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Preserved Governed Records
          </h1>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-white/65 sm:text-base">
            This library contains records that crossed the
            explicit preservation boundary. A stored record is
            independently verified before display and remains
            separate from its source candidate, real-world
            execution, certification, and compliance claims.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
              <p className="text-2xl font-semibold tabular-nums">
                {verifiedRecords.length}
              </p>
              <p className="mt-1 text-xs uppercase tracking-[0.2em] text-white/45">
                Preserved records
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
              <p className="text-2xl font-semibold tabular-nums">
                {
                  verifiedRecords.filter(
                    ({ verification }) =>
                      verification.preservationValid,
                  ).length
                }
              </p>
              <p className="mt-1 text-xs uppercase tracking-[0.2em] text-white/45">
                Valid for active reliance
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
              <p className="text-2xl font-semibold tabular-nums">
                {
                  verifiedRecords.filter(
                    ({ verification }) =>
                      !verification.preservationValid,
                  ).length
                }
              </p>
              <p className="mt-1 text-xs uppercase tracking-[0.2em] text-white/45">
                Requires attention
              </p>
            </div>
          </div>
        </header>

        <section className="mt-8 space-y-5">
          {verifiedRecords.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-white/15 bg-white/[0.025] p-10 text-center">
              <h2 className="text-xl font-semibold">
                No preserved Runtime records yet
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-white/55">
                Approving a candidate does not create a preserved
                record. A candidate must pass preservation
                readiness and then be preserved through an explicit
                authority-bound act.
              </p>
            </div>
          ) : (
            verifiedRecords.map(
              ({ record, verification }) => (
                <article
                  key={record.recordId}
                  className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 shadow-xl shadow-black/20"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${
                            statusClasses[record.status]
                          }`}
                        >
                          {record.status}
                        </span>

                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${
                            verification.preservationValid
                              ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
                              : "border-rose-400/30 bg-rose-400/10 text-rose-200"
                          }`}
                        >
                          {verification.preservationValid
                            ? "Verified"
                            : "Verification issue"}
                        </span>
                      </div>

                      <h2 className="mt-4 text-2xl font-semibold">
                        {record.title}
                      </h2>

                      <p className="mt-2 break-all font-mono text-xs text-white/45">
                        {record.recordId}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleExport(record)}
                      className="rounded-xl border border-white/15 bg-white/[0.05] px-4 py-2.5 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/[0.09]"
                    >
                      Export JSON
                    </button>
                  </div>

                  <dl className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <dt className="text-xs uppercase tracking-[0.18em] text-white/40">
                        Preserved
                      </dt>
                      <dd className="mt-2 text-sm text-white/80">
                        {formatDate(record.preservedAt)}
                      </dd>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <dt className="text-xs uppercase tracking-[0.18em] text-white/40">
                        Determination
                      </dt>
                      <dd className="mt-2 text-sm font-semibold text-white/85">
                        {record.determination}
                      </dd>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <dt className="text-xs uppercase tracking-[0.18em] text-white/40">
                        Evidence references
                      </dt>
                      <dd className="mt-2 text-sm font-semibold tabular-nums text-white/85">
                        {record.payload.evidenceIds.length}
                      </dd>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <dt className="text-xs uppercase tracking-[0.18em] text-white/40">
                        Verification findings
                      </dt>
                      <dd className="mt-2 text-sm text-white/80">
                        {verification.summary.errors} errors ·{" "}
                        {verification.summary.warnings} warnings
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-6 grid gap-5 lg:grid-cols-2">
                    <section className="rounded-2xl border border-white/10 bg-black/20 p-5">
                      <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-white/55">
                        Preservation authority
                      </h3>
                      <p className="mt-3 text-sm leading-6 text-white/75">
                        {record.authority.authorityBasis}
                      </p>
                      <p className="mt-3 text-xs leading-5 text-white/45">
                        {record.authority.declaration}
                      </p>
                    </section>

                    <section className="rounded-2xl border border-white/10 bg-black/20 p-5">
                      <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-white/55">
                        Record lineage
                      </h3>
                      <div className="mt-3 space-y-2 font-mono text-xs text-white/55">
                        <p className="break-all">
                          Candidate:{" "}
                          {record.lineage.sourceCandidateId}
                        </p>
                        <p className="break-all">
                          Route: {record.lineage.routeDraftId}
                        </p>
                        <p className="break-all">
                          Session: {record.lineage.testSessionId}
                        </p>
                        <p className="break-all">
                          Run: {record.lineage.storedRunId}
                        </p>
                      </div>
                    </section>
                  </div>

                  {verification.findings.length > 0 ? (
                    <section className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-5">
                      <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-white/55">
                        Verification findings
                      </h3>
                      <ul className="mt-4 space-y-3">
                        {verification.findings.map(
                          (finding, index) => (
                            <li
                              key={`${finding.code}-${index}`}
                              className="rounded-xl border border-white/10 bg-white/[0.025] p-3"
                            >
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-white/65">
                                  {finding.severity}
                                </span>
                                <span className="font-mono text-[0.68rem] text-white/35">
                                  {finding.code}
                                </span>
                              </div>
                              <p className="mt-2 text-sm leading-6 text-white/65">
                                {finding.message}
                              </p>
                            </li>
                          ),
                        )}
                      </ul>
                    </section>
                  ) : null}

                  <section className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-5">
                    <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-white/55">
                      Preserved boundaries
                    </h3>
                    <ul className="mt-4 space-y-3">
                      {record.boundaries.map(
                        (boundary, index) => (
                          <li
                            key={`${boundary.category}-${index}`}
                            className="text-sm leading-6 text-white/65"
                          >
                            <span className="mr-2 font-semibold text-white/80">
                              {boundary.category}:
                            </span>
                            {boundary.statement}
                          </li>
                        ),
                      )}
                    </ul>
                  </section>
                </article>
              ),
            )
          )}
        </section>
      </div>
    </main>
  );
}
