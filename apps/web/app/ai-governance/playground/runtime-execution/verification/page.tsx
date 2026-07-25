"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  getPreservedRuntimeRecordEnvelope,
  listPreservedRuntimeGovernedRecords,
  verifyPreservedRuntimeGovernedRecord,
  verifyStoredPreservedRuntimeRecordEnvelope,
  type PreservedRuntimeGovernedRecord,
} from "../../../../../lib/governance-playgrounds";

type EnvelopeVerificationResult = Awaited<
  ReturnType<typeof verifyStoredPreservedRuntimeRecordEnvelope>
>;

type RecordVerificationRow = {
  record: PreservedRuntimeGovernedRecord;
  envelopeAvailable: boolean;
  envelopeVerification: EnvelopeVerificationResult | null;
  verifying: boolean;
  errorMessage: string;
};

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

export default function RuntimeVerificationPage() {
  const [rows, setRows] = useState<RecordVerificationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [verifyingAll, setVerifyingAll] = useState(false);

  useEffect(() => {
    const records = listPreservedRuntimeGovernedRecords();

    setRows(
      records.map((record) => ({
        record,
        envelopeAvailable:
          getPreservedRuntimeRecordEnvelope(record.recordId) !==
          undefined,
        envelopeVerification: null,
        verifying: false,
        errorMessage: "",
      })),
    );

    setLoading(false);
  }, []);

  const verifyRecord = useCallback(
    async (recordId: string): Promise<void> => {
      setRows((currentRows) =>
        currentRows.map((row) =>
          row.record.recordId === recordId
            ? {
                ...row,
                verifying: true,
                errorMessage: "",
              }
            : row,
        ),
      );

      try {
        const envelope =
          getPreservedRuntimeRecordEnvelope(recordId);

        if (!envelope) {
          setRows((currentRows) =>
            currentRows.map((row) =>
              row.record.recordId === recordId
                ? {
                    ...row,
                    envelopeAvailable: false,
                    envelopeVerification: null,
                    verifying: false,
                    errorMessage:
                      "No stored integrity envelope was found for this record.",
                  }
                : row,
            ),
          );
          return;
        }

        const result =
          await verifyStoredPreservedRuntimeRecordEnvelope(
            recordId,
          );

        setRows((currentRows) =>
          currentRows.map((row) =>
            row.record.recordId === recordId
              ? {
                  ...row,
                  envelopeAvailable: true,
                  envelopeVerification: result,
                  verifying: false,
                  errorMessage: "",
                }
              : row,
          ),
        );
      } catch (error) {
        setRows((currentRows) =>
          currentRows.map((row) =>
            row.record.recordId === recordId
              ? {
                  ...row,
                  envelopeVerification: null,
                  verifying: false,
                  errorMessage:
                    error instanceof Error
                      ? error.message
                      : "Verification could not be completed.",
                }
              : row,
          ),
        );
      }
    },
    [],
  );

  const handleVerifyAll = useCallback(async (): Promise<void> => {
    if (rows.length === 0) {
      return;
    }

    setVerifyingAll(true);

    try {
      for (const row of rows) {
        await verifyRecord(row.record.recordId);
      }
    } finally {
      setVerifyingAll(false);
    }
  }, [rows, verifyRecord]);

  const summary = useMemo(() => {
    let verified = 0;
    let issues = 0;
    let pending = 0;
    let warnings = 0;
    let missingEnvelopes = 0;

    for (const row of rows) {
      const structuralVerification =
        verifyPreservedRuntimeGovernedRecord(row.record);

      warnings += structuralVerification.summary.warnings;

      if (!row.envelopeAvailable) {
        missingEnvelopes += 1;
      }

      if (!row.envelopeVerification) {
        pending += 1;
        continue;
      }

      if (row.envelopeVerification.envelopeValid) {
        verified += 1;
      } else {
        issues += 1;
      }
    }

    return {
      total: rows.length,
      verified,
      issues,
      pending,
      warnings,
      missingEnvelopes,
    };
  }, [rows]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#03060b] px-5 py-12 text-white">
        <div className="mx-auto max-w-7xl rounded-3xl border border-white/10 bg-white/[0.035] p-8">
          <p className="text-sm text-white/60">
            Loading Runtime verification workspace…
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#03060b] px-5 py-10 text-white sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-200/70">
              TA-14 Runtime Execution
            </p>

            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Preservation Verification
            </h1>

            <p className="mt-4 max-w-4xl text-sm leading-7 text-white/65 sm:text-base">
              Verify the structural validity, preservation validity,
              and SHA-256 integrity envelope of every preserved
              Runtime governed record. Verification confirms whether
              the locally stored record still matches its preserved
              envelope. It does not establish certification,
              regulatory compliance, or real-world execution.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => void handleVerifyAll()}
              disabled={verifyingAll || rows.length === 0}
              className="rounded-xl border border-sky-300/30 bg-sky-300/10 px-5 py-3 text-sm font-semibold text-sky-100 transition hover:border-sky-200/50 hover:bg-sky-300/15 disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-white/[0.03] disabled:text-white/30"
            >
              {verifyingAll
                ? "Verifying All…"
                : "Verify All Records"}
            </button>

            <Link
              href="/ai-governance/playground/runtime-execution/preserved"
              className="rounded-xl border border-white/15 bg-white/[0.05] px-5 py-3 text-sm font-semibold transition hover:border-white/30 hover:bg-white/[0.09]"
            >
              Preserved Records
            </Link>
          </div>
        </div>

        <section className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-6">
          <article className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-white/40">
              Total records
            </p>
            <p className="mt-3 text-3xl font-semibold tabular-nums">
              {summary.total}
            </p>
          </article>

          <article className="rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.06] p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-emerald-100/55">
              Verified
            </p>
            <p className="mt-3 text-3xl font-semibold tabular-nums text-emerald-100">
              {summary.verified}
            </p>
          </article>

          <article className="rounded-2xl border border-rose-400/20 bg-rose-400/[0.06] p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-rose-100/55">
              Issues
            </p>
            <p className="mt-3 text-3xl font-semibold tabular-nums text-rose-100">
              {summary.issues}
            </p>
          </article>

          <article className="rounded-2xl border border-amber-400/20 bg-amber-400/[0.06] p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-amber-100/55">
              Pending
            </p>
            <p className="mt-3 text-3xl font-semibold tabular-nums text-amber-100">
              {summary.pending}
            </p>
          </article>

          <article className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-white/40">
              Warnings
            </p>
            <p className="mt-3 text-3xl font-semibold tabular-nums">
              {summary.warnings}
            </p>
          </article>

          <article className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-white/40">
              Missing envelopes
            </p>
            <p className="mt-3 text-3xl font-semibold tabular-nums">
              {summary.missingEnvelopes}
            </p>
          </article>
        </section>

        <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.035] p-6 shadow-2xl shadow-black/30">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">
                Verification inventory
              </h2>

              <p className="mt-2 text-sm text-white/55">
                Each record is verified independently against its
                locally stored integrity envelope.
              </p>
            </div>

            <span className="rounded-full border border-white/15 bg-white/[0.05] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-white/65">
              Local browser storage
            </span>
          </div>

          {rows.length > 0 ? (
            <div className="mt-6 space-y-4">
              {rows.map((row) => {
                const structuralVerification =
                  verifyPreservedRuntimeGovernedRecord(
                    row.record,
                  );

                const envelopeStatus = row.envelopeVerification
                  ? row.envelopeVerification.envelopeValid
                    ? "Verified"
                    : "Verification issue"
                  : row.envelopeAvailable
                    ? "Pending verification"
                    : "Envelope missing";

                return (
                  <article
                    key={row.record.recordId}
                    className="rounded-2xl border border-white/10 bg-black/20 p-5"
                  >
                    <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full border border-white/15 bg-white/[0.05] px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-white/65">
                            {row.record.status}
                          </span>

                          <span
                            className={`rounded-full border px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] ${
                              row.envelopeVerification
                                ? row.envelopeVerification
                                    .envelopeValid
                                  ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
                                  : "border-rose-400/30 bg-rose-400/10 text-rose-200"
                                : row.envelopeAvailable
                                  ? "border-amber-400/30 bg-amber-400/10 text-amber-200"
                                  : "border-white/15 bg-white/[0.05] text-white/55"
                            }`}
                          >
                            {envelopeStatus}
                          </span>

                          <span className="rounded-full border border-sky-400/25 bg-sky-400/[0.08] px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-sky-200/85">
                            {row.record.determination}
                          </span>
                        </div>

                        <h3 className="mt-4 text-xl font-semibold text-white/90">
                          {row.record.title}
                        </h3>

                        <p className="mt-2 break-all font-mono text-xs text-white/40">
                          {row.record.recordId}
                        </p>

                        <div className="mt-5 grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-5">
                          <div>
                            <p className="text-xs uppercase tracking-[0.16em] text-white/35">
                              Preserved
                            </p>
                            <p className="mt-2 text-white/70">
                              {formatDate(
                                row.record.preservedAt,
                              )}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs uppercase tracking-[0.16em] text-white/35">
                              Structure
                            </p>
                            <p className="mt-2 text-white/70">
                              {structuralVerification.structurallyValid
                                ? "Valid"
                                : "Invalid"}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs uppercase tracking-[0.16em] text-white/35">
                              Preservation
                            </p>
                            <p className="mt-2 text-white/70">
                              {structuralVerification.preservationValid
                                ? "Valid"
                                : "Invalid"}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs uppercase tracking-[0.16em] text-white/35">
                              Integrity
                            </p>
                            <p className="mt-2 text-white/70">
                              {row.envelopeVerification
                                ? row.envelopeVerification
                                    .integrityValid
                                  ? "Valid"
                                  : "Invalid"
                                : "Not checked"}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs uppercase tracking-[0.16em] text-white/35">
                              Findings
                            </p>
                            <p className="mt-2 text-white/70">
                              {
                                structuralVerification.summary
                                  .errors
                              }{" "}
                              errors ·{" "}
                              {
                                structuralVerification.summary
                                  .warnings
                              }{" "}
                              warnings
                            </p>
                          </div>
                        </div>

                        {row.errorMessage ? (
                          <div className="mt-5 rounded-xl border border-rose-400/25 bg-rose-400/[0.08] p-4 text-sm leading-6 text-rose-100/85">
                            {row.errorMessage}
                          </div>
                        ) : null}

                        {row.envelopeVerification &&
                        row.envelopeVerification.reasons.length >
                          0 ? (
                          <ul className="mt-5 space-y-3">
                            {row.envelopeVerification.reasons.map(
                              (reason) => (
                                <li
                                  key={reason}
                                  className="rounded-xl border border-white/10 bg-black/20 p-4 text-sm leading-6 text-white/60"
                                >
                                  {reason}
                                </li>
                              ),
                            )}
                          </ul>
                        ) : null}
                      </div>

                      <div className="flex shrink-0 flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            void verifyRecord(
                              row.record.recordId,
                            )
                          }
                          disabled={row.verifying}
                          className="rounded-xl border border-sky-300/30 bg-sky-300/10 px-4 py-2.5 text-sm font-semibold text-sky-100 transition hover:border-sky-200/50 hover:bg-sky-300/15 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {row.verifying
                            ? "Verifying…"
                            : "Re-Verify"}
                        </button>

                        <Link
                          href={`/ai-governance/playground/runtime-execution/preserved/${encodeURIComponent(
                            row.record.recordId,
                          )}`}
                          className="rounded-xl border border-white/15 bg-white/[0.05] px-4 py-2.5 text-sm font-semibold transition hover:border-white/30 hover:bg-white/[0.09]"
                        >
                          Open Record
                        </Link>

                        <Link
                          href={`/ai-governance/playground/runtime-execution/preserved/${encodeURIComponent(
                            row.record.recordId,
                          )}/envelope`}
                          className="rounded-xl border border-white/15 bg-white/[0.05] px-4 py-2.5 text-sm font-semibold transition hover:border-white/30 hover:bg-white/[0.09]"
                        >
                          Open Envelope
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-dashed border-white/15 bg-black/20 p-8">
              <p className="text-sm font-semibold text-white/75">
                No preserved Runtime records are available for
                verification.
              </p>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-white/50">
                Preserve an approved governed-record candidate before
                opening the verification workspace.
              </p>

              <Link
                href="/ai-governance/playground/runtime-execution/preserve"
                className="mt-5 inline-flex rounded-xl border border-sky-300/30 bg-sky-300/10 px-4 py-2.5 text-sm font-semibold text-sky-100 transition hover:border-sky-200/50 hover:bg-sky-300/15"
              >
                Open Preservation Workspace
              </Link>
            </div>
          )}
        </section>

        <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.035] p-6">
          <h2 className="text-lg font-semibold">
            Verification boundary
          </h2>

          <p className="mt-4 max-w-5xl text-sm leading-7 text-white/65">
            A successful Runtime verification confirms that the
            locally stored record remains structurally valid,
            satisfies the preservation checks, and matches the
            SHA-256 digest in its integrity envelope. It does not
            independently prove the truth of every source assertion,
            external execution, certification, legal authority, or
            regulatory compliance.
          </p>
        </section>
      </div>
    </main>
  );
}
