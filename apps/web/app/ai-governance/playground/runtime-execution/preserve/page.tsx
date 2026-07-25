"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import {
  completeRuntimePreservation,
  evaluateRuntimePreservationReadiness,
  listGovernedRecordCandidates,
  loadGovernedRecordCandidate,
  type GovernedRecordCandidate,
  type GovernedRecordCandidateSummary,
  type RuntimePreservationReadiness,
} from "../../../../../lib/governance-playgrounds";

type PreservationSuccess = {
  recordId: string;
  digest: string;
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

export default function RuntimePreservationPage() {
  const [candidateSummaries, setCandidateSummaries] = useState<
    GovernedRecordCandidateSummary[]
  >([]);
  const [selectedCandidateId, setSelectedCandidateId] =
    useState("");
  const [candidate, setCandidate] =
    useState<GovernedRecordCandidate | null>(null);
  const [preserverName, setPreserverName] = useState("");
  const [preserverOrganization, setPreserverOrganization] =
    useState("TA-14 Authority Governance Institution");
  const [authorityBasis, setAuthorityBasis] = useState("");
  const [authorityDeclaration, setAuthorityDeclaration] =
    useState(
      "I declare that I hold authority to preserve this bounded Runtime governance record and understand that preservation does not establish real-world execution, certification, or regulatory compliance.",
    );
  const [preservationNote, setPreservationNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [success, setSuccess] =
    useState<PreservationSuccess | null>(null);

  useEffect(() => {
    const summaries = listGovernedRecordCandidates({
      status: "APPROVED_FOR_PRESERVATION",
    });

    setCandidateSummaries(summaries);

    if (summaries.length > 0) {
      setSelectedCandidateId(summaries[0].candidateId);
    }
  }, []);

  useEffect(() => {
    if (!selectedCandidateId) {
      setCandidate(null);
      return;
    }

    setCandidate(
      loadGovernedRecordCandidate(selectedCandidateId) ?? null,
    );
    setSuccess(null);
    setErrorMessage("");
  }, [selectedCandidateId]);

  const readiness = useMemo<RuntimePreservationReadiness | null>(
    () =>
      candidate
        ? evaluateRuntimePreservationReadiness(candidate)
        : null,
    [candidate],
  );

  const canPreserve =
    !!candidate &&
    !!readiness?.ready &&
    preserverName.trim().length > 0 &&
    authorityBasis.trim().length > 0 &&
    !submitting;

  async function handlePreserve(): Promise<void> {
    if (!candidate || !readiness?.ready) {
      return;
    }

    setSubmitting(true);
    setErrorMessage("");
    setSuccess(null);

    try {
      const result = await completeRuntimePreservation({
        candidate,
        preservedBy: {
          actorId: `runtime-preserver-${preserverName
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "") || "unknown"}`,
          displayName: preserverName.trim(),
          role: "RECORDS_CUSTODIAN",
          organization:
            preserverOrganization.trim() || undefined,
        },
        authorityBasis: authorityBasis.trim(),
        authorityDeclaration:
          authorityDeclaration.trim() || undefined,
        preservationNote:
          preservationNote.trim() || undefined,
        visibility: candidate.visibility,
        recordMetadata: {
          source: "runtime-preservation-workspace",
          candidateStatus: candidate.status,
        },
        envelopeMetadata: {
          source: "runtime-preservation-workspace",
          preservationFlow: "record-and-integrity-envelope",
        },
      });

      setSuccess({
        recordId: result.record.recordId,
        digest: result.envelope.integrity.digest,
      });
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "The Runtime record could not be preserved.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#03060b] px-5 py-10 text-white sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <header className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 shadow-2xl shadow-black/30 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-200/70">
            TA-14 Runtime Execution
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Preserve an Approved Candidate
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-white/65 sm:text-base">
            Preservation is a distinct authority-bound act. It creates a
            governed record and a SHA-256 integrity envelope from an approved,
            ready candidate. It does not initiate execution or establish
            certification, compliance, or truth beyond the preserved evidence
            boundaries.
          </p>
        </header>

        <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.035] p-6">
          <label
            htmlFor="candidate"
            className="text-sm font-semibold text-white/85"
          >
            Approved candidate
          </label>

          {candidateSummaries.length > 0 ? (
            <select
              id="candidate"
              value={selectedCandidateId}
              onChange={(event) =>
                setSelectedCandidateId(event.target.value)
              }
              className="mt-3 w-full rounded-xl border border-white/15 bg-[#080d14] px-4 py-3 text-sm text-white outline-none transition focus:border-sky-300/50"
            >
              {candidateSummaries.map((summary) => (
                <option
                  key={summary.candidateId}
                  value={summary.candidateId}
                >
                  {summary.title} — {summary.determination}
                </option>
              ))}
            </select>
          ) : (
            <div className="mt-4 rounded-2xl border border-dashed border-white/15 bg-black/20 p-6">
              <p className="text-sm text-white/60">
                No candidates are currently approved for preservation.
              </p>
              <Link
                href="/ai-governance/playground/runtime-execution/records"
                className="mt-4 inline-flex rounded-xl border border-white/15 bg-white/[0.05] px-4 py-2.5 text-sm font-semibold transition hover:border-white/30 hover:bg-white/[0.09]"
              >
                Review governed-record candidates
              </Link>
            </div>
          )}
        </section>

        {candidate && readiness ? (
          <>
            <section className="mt-6 grid gap-5 lg:grid-cols-2">
              <article className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
                <h2 className="text-lg font-semibold">
                  Candidate summary
                </h2>
                <dl className="mt-5 space-y-4 text-sm">
                  <div>
                    <dt className="text-xs uppercase tracking-[0.18em] text-white/40">
                      Candidate
                    </dt>
                    <dd className="mt-2 break-all font-mono text-xs text-white/65">
                      {candidate.candidateId}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-[0.18em] text-white/40">
                      Determination
                    </dt>
                    <dd className="mt-2 font-semibold text-white/85">
                      {candidate.payload.observedDetermination}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-[0.18em] text-white/40">
                      Evidence references
                    </dt>
                    <dd className="mt-2 text-white/75">
                      {candidate.payload.evidenceIds.length}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-[0.18em] text-white/40">
                      Last updated
                    </dt>
                    <dd className="mt-2 text-white/75">
                      {formatDate(candidate.updatedAt)}
                    </dd>
                  </div>
                </dl>
              </article>

              <article className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-lg font-semibold">
                    Preservation readiness
                  </h2>
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${
                      readiness.ready
                        ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
                        : "border-rose-400/30 bg-rose-400/10 text-rose-200"
                    }`}
                  >
                    {readiness.ready ? "Ready" : "Blocked"}
                  </span>
                </div>

                {readiness.reasons.length > 0 ? (
                  <ul className="mt-5 space-y-3">
                    {readiness.reasons.map((reason) => (
                      <li
                        key={reason}
                        className="rounded-xl border border-rose-400/20 bg-rose-400/[0.06] p-3 text-sm leading-6 text-rose-100/80"
                      >
                        {reason}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-5 text-sm leading-6 text-white/65">
                    The candidate is approved, contains valid scenario
                    verification, has no blocking issues, and includes the
                    required route, session, run, determination, and evidence
                    references.
                  </p>
                )}

                {readiness.warnings.length > 0 ? (
                  <div className="mt-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-200/70">
                      Non-blocking warnings
                    </p>
                    <ul className="mt-3 space-y-2">
                      {readiness.warnings.map((warning) => (
                        <li
                          key={warning.code}
                          className="text-sm leading-6 text-white/55"
                        >
                          {warning.message}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </article>
            </section>

            <section className="mt-6 rounded-3xl border border-white/10 bg-white/[0.035] p-6">
              <h2 className="text-lg font-semibold">
                Preservation authority
              </h2>

              <div className="mt-5 grid gap-5 md:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-medium text-white/75">
                    Preserver name
                  </span>
                  <input
                    value={preserverName}
                    onChange={(event) =>
                      setPreserverName(event.target.value)
                    }
                    className="mt-2 w-full rounded-xl border border-white/15 bg-[#080d14] px-4 py-3 text-sm text-white outline-none transition focus:border-sky-300/50"
                    placeholder="Name of records custodian"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-medium text-white/75">
                    Organization
                  </span>
                  <input
                    value={preserverOrganization}
                    onChange={(event) =>
                      setPreserverOrganization(event.target.value)
                    }
                    className="mt-2 w-full rounded-xl border border-white/15 bg-[#080d14] px-4 py-3 text-sm text-white outline-none transition focus:border-sky-300/50"
                  />
                </label>
              </div>

              <label className="mt-5 block">
                <span className="text-sm font-medium text-white/75">
                  Authority basis
                </span>
                <textarea
                  value={authorityBasis}
                  onChange={(event) =>
                    setAuthorityBasis(event.target.value)
                  }
                  rows={4}
                  className="mt-2 w-full rounded-xl border border-white/15 bg-[#080d14] px-4 py-3 text-sm leading-6 text-white outline-none transition focus:border-sky-300/50"
                  placeholder="State the organizational, delegated, contractual, legal, or custodial authority supporting preservation."
                />
              </label>

              <label className="mt-5 block">
                <span className="text-sm font-medium text-white/75">
                  Authority declaration
                </span>
                <textarea
                  value={authorityDeclaration}
                  onChange={(event) =>
                    setAuthorityDeclaration(event.target.value)
                  }
                  rows={4}
                  className="mt-2 w-full rounded-xl border border-white/15 bg-[#080d14] px-4 py-3 text-sm leading-6 text-white outline-none transition focus:border-sky-300/50"
                />
              </label>

              <label className="mt-5 block">
                <span className="text-sm font-medium text-white/75">
                  Preservation note
                </span>
                <textarea
                  value={preservationNote}
                  onChange={(event) =>
                    setPreservationNote(event.target.value)
                  }
                  rows={3}
                  className="mt-2 w-full rounded-xl border border-white/15 bg-[#080d14] px-4 py-3 text-sm leading-6 text-white outline-none transition focus:border-sky-300/50"
                  placeholder="Optional bounded note about this preservation act."
                />
              </label>

              {errorMessage ? (
                <div className="mt-5 rounded-xl border border-rose-400/25 bg-rose-400/[0.08] p-4 text-sm leading-6 text-rose-100/85">
                  {errorMessage}
                </div>
              ) : null}

              {success ? (
                <div className="mt-5 rounded-2xl border border-emerald-400/25 bg-emerald-400/[0.08] p-5">
                  <p className="text-sm font-semibold text-emerald-100">
                    Preservation completed
                  </p>
                  <p className="mt-2 break-all font-mono text-xs text-emerald-100/65">
                    Record: {success.recordId}
                  </p>
                  <p className="mt-2 break-all font-mono text-xs text-emerald-100/65">
                    SHA-256: {success.digest}
                  </p>
                  <Link
                    href={`/ai-governance/playground/runtime-execution/preserved/${encodeURIComponent(
                      success.recordId,
                    )}`}
                    className="mt-4 inline-flex rounded-xl border border-emerald-300/30 bg-emerald-300/10 px-4 py-2.5 text-sm font-semibold text-emerald-100 transition hover:border-emerald-200/50 hover:bg-emerald-300/15"
                  >
                    Open preserved record
                  </Link>
                </div>
              ) : null}

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => void handlePreserve()}
                  disabled={!canPreserve}
                  className="rounded-xl border border-sky-300/30 bg-sky-300/10 px-5 py-3 text-sm font-semibold text-sky-100 transition hover:border-sky-200/50 hover:bg-sky-300/15 disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-white/[0.03] disabled:text-white/30"
                >
                  {submitting
                    ? "Preserving…"
                    : "Preserve Record and Integrity Envelope"}
                </button>

                <Link
                  href="/ai-governance/playground/runtime-execution/preserved"
                  className="rounded-xl border border-white/15 bg-white/[0.05] px-5 py-3 text-sm font-semibold transition hover:border-white/30 hover:bg-white/[0.09]"
                >
                  View preserved records
                </Link>
              </div>
            </section>
          </>
        ) : null}
      </div>
    </main>
  );
}
