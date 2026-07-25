"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import {
  exportPreservedRuntimeRecordById,
  getPreservedRuntimeGovernedRecord,
  verifyPreservedRuntimeGovernedRecord,
  type PreservedRuntimeGovernedRecord,
} from "../../../../../../lib/governance-playgrounds";

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "long",
  }).format(date);
}

function downloadJson(filename: string, contents: string): void {
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

export default function RuntimePreservedRecordDetailPage() {
  const params = useParams<{ recordId: string }>();
  const recordId = decodeURIComponent(params.recordId);
  const [record, setRecord] =
    useState<PreservedRuntimeGovernedRecord | null | undefined>(
      undefined,
    );

  useEffect(() => {
    setRecord(
      getPreservedRuntimeGovernedRecord(recordId) ?? null,
    );
  }, [recordId]);

  const verification = useMemo(
    () =>
      record
        ? verifyPreservedRuntimeGovernedRecord(record)
        : null,
    [record],
  );

  function handleExport(): void {
    if (!record) {
      return;
    }

    downloadJson(
      `${record.recordId}.json`,
      exportPreservedRuntimeRecordById(record.recordId),
    );
  }

  if (record === undefined) {
    return (
      <main className="min-h-screen bg-[#03060b] px-5 py-12 text-white">
        <div className="mx-auto max-w-5xl rounded-3xl border border-white/10 bg-white/[0.035] p-8">
          <p className="text-sm text-white/60">
            Loading preserved governed record…
          </p>
        </div>
      </main>
    );
  }

  if (record === null) {
    return (
      <main className="min-h-screen bg-[#03060b] px-5 py-12 text-white">
        <div className="mx-auto max-w-5xl rounded-3xl border border-white/10 bg-white/[0.035] p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-rose-200/70">
            Record unavailable
          </p>
          <h1 className="mt-3 text-3xl font-semibold">
            Preserved record not found
          </h1>
          <p className="mt-4 break-all font-mono text-sm text-white/50">
            {recordId}
          </p>
          <Link
            href="/ai-governance/playground/runtime-execution/preserved"
            className="mt-6 inline-flex rounded-xl border border-white/15 bg-white/[0.05] px-4 py-2.5 text-sm font-semibold transition hover:border-white/30 hover:bg-white/[0.09]"
          >
            Return to preserved records
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#03060b] px-5 py-10 text-white sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/ai-governance/playground/runtime-execution/preserved"
            className="text-sm font-semibold text-sky-200/80 transition hover:text-sky-100"
          >
            ← Preserved records
          </Link>

          <div className="flex flex-wrap gap-3">
            <Link
              href={`/ai-governance/playground/runtime-execution/preserved/${encodeURIComponent(
                recordId,
              )}/envelope`}
              className="rounded-xl border border-sky-300/30 bg-sky-300/10 px-4 py-2.5 text-sm font-semibold text-sky-100 transition hover:border-sky-200/50 hover:bg-sky-300/15"
            >
              Open Integrity Envelope
            </Link>

            <button
              type="button"
              onClick={handleExport}
              className="rounded-xl border border-white/15 bg-white/[0.05] px-4 py-2.5 text-sm font-semibold transition hover:border-white/30 hover:bg-white/[0.09]"
            >
              Export JSON
            </button>
          </div>
        </div>

        <header className="mt-5 rounded-3xl border border-white/10 bg-white/[0.035] p-6 shadow-2xl shadow-black/30 sm:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-white/15 bg-white/[0.05] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-white/70">
              {record.status}
            </span>

            <span
              className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${
                verification?.preservationValid
                  ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
                  : "border-rose-400/30 bg-rose-400/10 text-rose-200"
              }`}
            >
              {verification?.preservationValid
                ? "Verified"
                : "Verification issue"}
            </span>
          </div>

          <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
            {record.title}
          </h1>

          <p className="mt-3 break-all font-mono text-xs text-white/45">
            {record.recordId}
          </p>

          <p className="mt-5 max-w-4xl text-sm leading-7 text-white/65">
            This route presents the preserved record exactly as stored, together
            with an independent structural and preservation verification. It
            does not convert the record into proof of real-world execution,
            certification, or compliance.
          </p>
        </header>

        <section className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-white/40">
              Preserved at
            </p>
            <p className="mt-3 text-sm text-white/80">
              {formatDate(record.preservedAt)}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-white/40">
              Determination
            </p>
            <p className="mt-3 text-lg font-semibold">
              {record.determination}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-white/40">
              Evidence references
            </p>
            <p className="mt-3 text-lg font-semibold tabular-nums">
              {record.payload.evidenceIds.length}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-white/40">
              Verification
            </p>
            <p className="mt-3 text-sm text-white/80">
              {verification?.summary.errors ?? 0} errors ·{" "}
              {verification?.summary.warnings ?? 0} warnings
            </p>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <article className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
            <h2 className="text-lg font-semibold">
              Preservation authority
            </h2>

            <dl className="mt-5 space-y-4">
              <div>
                <dt className="text-xs uppercase tracking-[0.18em] text-white/40">
                  Authority basis
                </dt>
                <dd className="mt-2 text-sm leading-6 text-white/75">
                  {record.authority.authorityBasis}
                </dd>
              </div>

              <div>
                <dt className="text-xs uppercase tracking-[0.18em] text-white/40">
                  Declaration
                </dt>
                <dd className="mt-2 text-sm leading-6 text-white/60">
                  {record.authority.declaration}
                </dd>
              </div>

              <div>
                <dt className="text-xs uppercase tracking-[0.18em] text-white/40">
                  Authority evidence
                </dt>
                <dd className="mt-2 text-sm text-white/70">
                  {record.authority.authorityEvidenceIds.length > 0
                    ? record.authority.authorityEvidenceIds.join(", ")
                    : "No separate authority evidence identifiers were preserved."}
                </dd>
              </div>
            </dl>
          </article>

          <article className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
            <h2 className="text-lg font-semibold">
              Record lineage
            </h2>

            <dl className="mt-5 space-y-4 font-mono text-xs text-white/60">
              <div>
                <dt className="text-white/35">Candidate</dt>
                <dd className="mt-1 break-all">
                  {record.lineage.sourceCandidateId}
                </dd>
              </div>
              <div>
                <dt className="text-white/35">Route draft</dt>
                <dd className="mt-1 break-all">
                  {record.lineage.routeDraftId}
                </dd>
              </div>
              <div>
                <dt className="text-white/35">Test session</dt>
                <dd className="mt-1 break-all">
                  {record.lineage.testSessionId}
                </dd>
              </div>
              <div>
                <dt className="text-white/35">Stored run</dt>
                <dd className="mt-1 break-all">
                  {record.lineage.storedRunId}
                </dd>
              </div>
            </dl>
          </article>
        </section>

        <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.035] p-6">
          <h2 className="text-lg font-semibold">
            Evidence references
          </h2>

          {record.payload.evidenceIds.length > 0 ? (
            <ul className="mt-5 grid gap-3 md:grid-cols-2">
              {record.payload.evidenceIds.map((evidenceId) => (
                <li
                  key={evidenceId}
                  className="break-all rounded-xl border border-white/10 bg-black/20 p-3 font-mono text-xs text-white/60"
                >
                  {evidenceId}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-white/55">
              No evidence references were preserved.
            </p>
          )}
        </section>

        <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.035] p-6">
          <h2 className="text-lg font-semibold">
            Preserved boundaries
          </h2>

          <ul className="mt-5 space-y-3">
            {record.boundaries.map((boundary, index) => (
              <li
                key={`${boundary.category}-${index}`}
                className="rounded-xl border border-white/10 bg-black/20 p-4 text-sm leading-6 text-white/65"
              >
                <span className="mr-2 font-semibold text-white/85">
                  {boundary.category}:
                </span>
                {boundary.statement}
              </li>
            ))}
          </ul>
        </section>

        {verification && verification.findings.length > 0 ? (
          <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.035] p-6">
            <h2 className="text-lg font-semibold">
              Verification findings
            </h2>

            <ul className="mt-5 space-y-3">
              {verification.findings.map((finding, index) => (
                <li
                  key={`${finding.code}-${index}`}
                  className="rounded-xl border border-white/10 bg-black/20 p-4"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-[0.14em] text-white/70">
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
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </main>
  );
}
