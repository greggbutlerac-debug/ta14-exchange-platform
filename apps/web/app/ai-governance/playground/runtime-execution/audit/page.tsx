"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { listPreservedRuntimeGovernedRecords } from "../../../../../lib/governance-playgrounds";

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

export default function RuntimeAuditPage() {
  const records = useMemo(
    () => listPreservedRuntimeGovernedRecords(),
    [],
  );

  const [selectedRecordId, setSelectedRecordId] = useState(
    records[0]?.recordId ?? "",
  );

  const selectedRecord = useMemo(
    () =>
      records.find(
        (record) => record.recordId === selectedRecordId,
      ) ?? null,
    [records, selectedRecordId],
  );

  return (
    <main className="min-h-screen bg-[#03060b] px-5 py-10 text-white sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-200/70">
              TA-14 Runtime Execution
            </p>

            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Runtime Audit
            </h1>

            <p className="mt-4 max-w-4xl text-sm leading-7 text-white/65 sm:text-base">
              Inspect the preserved governance state of a Runtime
              record, review its audit dimensions, and follow direct
              links to the source record, integrity envelope,
              verification workspace, evidence explorer, timeline, and
              replay workspace.
            </p>
          </div>

          <Link
            href="/ai-governance/playground/runtime-execution"
            className="rounded-xl border border-white/15 bg-white/[0.05] px-5 py-3 text-sm font-semibold transition hover:border-white/30 hover:bg-white/[0.09]"
          >
            Runtime Workspace
          </Link>
        </div>

        <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.035] p-6">
          <h2 className="text-lg font-semibold">
            Select preserved record
          </h2>

          <p className="mt-2 text-sm leading-6 text-white/55">
            Choose the Runtime governed record to inspect.
          </p>

          {records.length > 0 ? (
            <div className="mt-5">
              <label
                htmlFor="runtime-audit-record"
                className="block text-xs font-semibold uppercase tracking-[0.16em] text-white/45"
              >
                Preserved Runtime record
              </label>

              <select
                id="runtime-audit-record"
                value={selectedRecordId}
                onChange={(event) =>
                  setSelectedRecordId(event.target.value)
                }
                className="mt-3 w-full rounded-2xl border border-white/10 bg-[#08101a] px-4 py-3 text-sm text-white outline-none transition focus:border-sky-300/40"
              >
                {records.map((record) => (
                  <option
                    key={record.recordId}
                    value={record.recordId}
                  >
                    {record.title} — {record.determination}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="mt-5 rounded-2xl border border-dashed border-white/15 bg-black/20 p-8">
              <p className="text-sm font-semibold text-white/75">
                No preserved Runtime records are available.
              </p>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-white/50">
                Preserve an approved governed-record candidate before
                opening an audit view.
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

        {selectedRecord ? (
          <>
            <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.035] p-6">
              <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-white/15 bg-white/[0.05] px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-white/65">
                      {selectedRecord.status}
                    </span>

                    <span className="rounded-full border border-sky-400/25 bg-sky-400/[0.08] px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-sky-200/85">
                      {selectedRecord.determination}
                    </span>
                  </div>

                  <h2 className="mt-4 text-2xl font-semibold text-white/90">
                    {selectedRecord.title}
                  </h2>

                  <p className="mt-2 break-all font-mono text-xs text-white/40">
                    {selectedRecord.recordId}
                  </p>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <AuditMetric
                      label="Determination"
                      value={selectedRecord.determination}
                    />

                    <AuditMetric
                      label="Record Status"
                      value={selectedRecord.status}
                    />

                    <AuditMetric
                      label="Preserved"
                      value={formatDate(
                        selectedRecord.preservedAt,
                      )}
                    />

                    <AuditMetric
                      label="Evidence Count"
                      value={String(
                        selectedRecord.payload.evidenceIds.length,
                      )}
                    />
                  </div>
                </div>

                <div className="flex shrink-0 flex-wrap gap-3">
                  <Link
                    href={`/ai-governance/playground/runtime-execution/preserved/${encodeURIComponent(
                      selectedRecord.recordId,
                    )}`}
                    className="rounded-xl border border-white/15 bg-white/[0.05] px-4 py-2.5 text-sm font-semibold transition hover:border-white/30 hover:bg-white/[0.09]"
                  >
                    Open Record
                  </Link>

                  <Link
                    href={`/ai-governance/playground/runtime-execution/preserved/${encodeURIComponent(
                      selectedRecord.recordId,
                    )}/envelope`}
                    className="rounded-xl border border-sky-300/30 bg-sky-300/10 px-4 py-2.5 text-sm font-semibold text-sky-100 transition hover:border-sky-200/50 hover:bg-sky-300/15"
                  >
                    Open Envelope
                  </Link>
                </div>
              </div>
            </section>

            <section className="mt-8 grid gap-6 lg:grid-cols-2">
              <article className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-200/65">
                  Audit dimensions
                </p>

                <h2 className="mt-3 text-xl font-semibold">
                  Preserved governance review
                </h2>

                <div className="mt-5 space-y-4">
                  <AuditDimension
                    title="Identity"
                    description="Confirm the preserved record ID and title match the record being reviewed."
                  />

                  <AuditDimension
                    title="Determination"
                    description={`Review the preserved ${selectedRecord.determination} determination as historical governance context, not as present authorization.`}
                  />

                  <AuditDimension
                    title="Continuity"
                    description="Use the preservation timestamp and record status to confirm which preserved state is under review."
                  />

                  <AuditDimension
                    title="Evidence binding"
                    description={`Confirm the record preserves ${selectedRecord.payload.evidenceIds.length} evidence reference${selectedRecord.payload.evidenceIds.length === 1 ? "" : "s"} and follow those references through the Evidence Explorer.`}
                  />

                  <AuditDimension
                    title="Integrity"
                    description="Open the integrity envelope and verification workspace to review structural and hash-based preservation checks."
                  />

                  <AuditDimension
                    title="Execution boundary"
                    description="Treat this audit as a review of preserved context only. It does not execute, renew, or authorize an action."
                  />
                </div>
              </article>

              <article className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-200/65">
                  Audit trail
                </p>

                <h2 className="mt-3 text-xl font-semibold">
                  Linked review workspaces
                </h2>

                <div className="mt-5 grid gap-3">
                  <AuditLink
                    href="/ai-governance/playground/runtime-execution/verification"
                    title="Preservation Verification"
                    description="Review record and integrity-envelope verification results."
                  />

                  <AuditLink
                    href="/ai-governance/playground/runtime-execution/integrity"
                    title="Integrity Dashboard"
                    description="Review aggregate integrity health across the preserved Runtime corpus."
                  />

                  <AuditLink
                    href="/ai-governance/playground/runtime-execution/evidence-explorer"
                    title="Evidence Explorer"
                    description="Trace preserved evidence references across records."
                  />

                  <AuditLink
                    href="/ai-governance/playground/runtime-execution/timeline"
                    title="Preservation Timeline"
                    description="Place this record within the chronological preservation sequence."
                  />

                  <AuditLink
                    href="/ai-governance/playground/runtime-execution/replay"
                    title="Runtime Replay"
                    description="Reconstruct the bounded governance context without initiating a new execution."
                  />
                </div>
              </article>
            </section>

            <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.035] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-200/65">
                Preserved evidence references
              </p>

              <h2 className="mt-3 text-xl font-semibold">
                Evidence bound to this record
              </h2>

              {selectedRecord.payload.evidenceIds.length > 0 ? (
                <ul className="mt-5 grid gap-3 md:grid-cols-2">
                  {selectedRecord.payload.evidenceIds.map(
                    (evidenceId) => (
                      <li
                        key={evidenceId}
                        className="break-all rounded-2xl border border-white/10 bg-black/20 px-4 py-3 font-mono text-xs text-white/65"
                      >
                        {evidenceId}
                      </li>
                    ),
                  )}
                </ul>
              ) : (
                <p className="mt-5 text-sm text-white/50">
                  No evidence references were preserved with this
                  record.
                </p>
              )}
            </section>
          </>
        ) : null}

        <section className="mt-8 rounded-3xl border border-amber-400/20 bg-amber-400/[0.055] p-6">
          <h2 className="text-lg font-semibold text-amber-50">
            Audit boundary
          </h2>

          <p className="mt-4 max-w-5xl text-sm leading-7 text-amber-50/70">
            This workspace supports review of preserved Runtime
            governance records. It does not prove that an external
            action occurred, certify regulatory compliance, validate
            evidence outside the preserved record, or create present
            authority. Any new execution requires a new route, current
            evidence, current authority, and a new determination.
          </p>
        </section>
      </div>
    </main>
  );
}

function AuditMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <p className="text-xs uppercase tracking-[0.16em] text-white/35">
        {label}
      </p>

      <p className="mt-2 break-words text-sm text-white/75">
        {value}
      </p>
    </div>
  );
}

function AuditDimension({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
      <h3 className="text-sm font-semibold text-white/85">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-white/55">
        {description}
      </p>
    </div>
  );
}

function AuditLink({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-white/10 bg-black/20 p-5 transition hover:border-sky-300/25 hover:bg-white/[0.05]"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-white/85 transition group-hover:text-sky-100">
            {title}
          </h3>

          <p className="mt-2 text-sm leading-6 text-white/55">
            {description}
          </p>
        </div>

        <span className="text-sky-200/60 transition group-hover:text-sky-100">
          →
        </span>
      </div>
    </Link>
  );
}
