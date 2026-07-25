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

export default function RuntimeReplayPage() {
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
              Runtime Replay
            </h1>

            <p className="mt-4 max-w-4xl text-sm leading-7 text-white/65 sm:text-base">
              Select a preserved Runtime governed record and
              reconstruct its preserved governance context for review.
              Replay does not initiate, repeat, authorize, or approve a
              new execution.
            </p>
          </div>

          <Link
            href="/ai-governance/playground/runtime-execution"
            className="rounded-xl border border-white/15 bg-white/[0.05] px-5 py-3 text-sm font-semibold transition hover:border-white/30 hover:bg-white/[0.09]"
          >
            Runtime Workspace
          </Link>
        </div>

        <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.035] p-6 shadow-2xl shadow-black/30">
          <div>
            <h2 className="text-lg font-semibold">
              Select preserved record
            </h2>

            <p className="mt-2 text-sm leading-6 text-white/55">
              Choose the preserved record whose governance state you
              want to review.
            </p>
          </div>

          {records.length > 0 ? (
            <div className="mt-5">
              <label
                htmlFor="runtime-replay-record"
                className="block text-xs font-semibold uppercase tracking-[0.16em] text-white/45"
              >
                Preserved Runtime record
              </label>

              <select
                id="runtime-replay-record"
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
                No preserved Runtime records are available for replay.
              </p>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-white/50">
                A governed-record candidate must first be approved and
                preserved before its governance context can be
                reconstructed here.
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
                    <InfoCard
                      label="Determination"
                      value={selectedRecord.determination}
                    />

                    <InfoCard
                      label="Preserved"
                      value={formatDate(
                        selectedRecord.preservedAt,
                      )}
                    />

                    <InfoCard
                      label="Evidence References"
                      value={String(
                        selectedRecord.payload.evidenceIds.length,
                      )}
                    />

                    <InfoCard
                      label="Record Status"
                      value={selectedRecord.status}
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
                    Open Preserved Record
                  </Link>

                  <Link
                    href={`/ai-governance/playground/runtime-execution/preserved/${encodeURIComponent(
                      selectedRecord.recordId,
                    )}/envelope`}
                    className="rounded-xl border border-sky-300/30 bg-sky-300/10 px-4 py-2.5 text-sm font-semibold text-sky-100 transition hover:border-sky-200/50 hover:bg-sky-300/15"
                  >
                    Open Integrity Envelope
                  </Link>

                  <Link
                    href="/ai-governance/playground/runtime-execution/verification"
                    className="rounded-xl border border-white/15 bg-white/[0.05] px-4 py-2.5 text-sm font-semibold transition hover:border-white/30 hover:bg-white/[0.09]"
                  >
                    Open Verification
                  </Link>
                </div>
              </div>
            </section>

            <section className="mt-8 grid gap-6 lg:grid-cols-2">
              <article className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-200/65">
                  Preserved replay context
                </p>

                <h2 className="mt-3 text-xl font-semibold">
                  What this replay reconstructs
                </h2>

                <p className="mt-4 text-sm leading-7 text-white/65">
                  This workspace reconstructs the selected record's
                  preserved identity, determination, preservation
                  timestamp, record status, and referenced evidence
                  set. It provides a reviewable view of the governance
                  state that was preserved at that point in time.
                </p>

                <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/40">
                    Evidence references
                  </p>

                  {selectedRecord.payload.evidenceIds.length > 0 ? (
                    <ul className="mt-4 space-y-3">
                      {selectedRecord.payload.evidenceIds.map(
                        (evidenceId) => (
                          <li
                            key={evidenceId}
                            className="break-all rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 font-mono text-xs text-white/65"
                          >
                            {evidenceId}
                          </li>
                        ),
                      )}
                    </ul>
                  ) : (
                    <p className="mt-4 text-sm text-white/50">
                      No evidence references were preserved with this
                      record.
                    </p>
                  )}
                </div>
              </article>

              <article className="rounded-3xl border border-amber-400/20 bg-amber-400/[0.055] p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-100/65">
                  Replay boundary
                </p>

                <h2 className="mt-3 text-xl font-semibold text-amber-50">
                  What this replay does not do
                </h2>

                <p className="mt-4 text-sm leading-7 text-amber-50/70">
                  Replay does not execute the original action again,
                  create a new determination, refresh expired
                  authority, validate external evidence, or grant
                  permission for a present execution. Any new action
                  requires a new governed route, current evidence,
                  current authority, and a new admissibility
                  determination.
                </p>

                <div className="mt-5 rounded-2xl border border-amber-300/15 bg-black/20 p-5">
                  <p className="text-sm font-semibold text-amber-50">
                    Preserved context is historical context.
                  </p>

                  <p className="mt-3 text-sm leading-7 text-amber-50/65">
                    A prior ALLOW does not automatically authorize a
                    later execution. A prior HOLD, DENY, or ESCALATE
                    remains evidence of the earlier determination and
                    does not decide a changed present state.
                  </p>
                </div>
              </article>
            </section>
          </>
        ) : null}

        <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.035] p-6">
          <h2 className="text-lg font-semibold">
            Governing principle
          </h2>

          <p className="mt-4 max-w-5xl text-sm leading-7 text-white/65">
            A Runtime replay is a bounded reconstruction of preserved
            governance context. It is not a new execution request, a
            renewed authorization, a compliance certification, or
            proof that the original real-world action occurred exactly
            as proposed. New execution requires new admissibility.
          </p>
        </section>
      </div>
    </main>
  );
}

function InfoCard({
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
