"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import {
  RUNTIME_EXECUTION_LANE,
  approveGovernedRecordCandidateForPreservation,
  assembleGovernedRecordCandidate,
  deleteGovernedRecordCandidate,
  exportGovernedRecordCandidate,
  listGovernedRecordCandidates,
  listRuntimeEvidenceAttachments,
  listStoredScenarioRuns,
  loadGovernedRecordCandidate,
  loadRuntimeTestSession,
  loadStoredScenarioRun,
  rejectGovernedRecordCandidate,
  saveGovernedRecordCandidate,
  type GovernedRecordCandidate,
  type GovernedRecordCandidateStatus,
  type GovernedRecordCandidateSummary,
  type RuntimeEvidenceSummary,
  type RuntimeTestSession,
  type ScenarioRunSummary,
} from "../../../../../lib/governance-playgrounds";

type CandidateFilter = "ALL" | GovernedRecordCandidateStatus;

function downloadJson(
  filename: string,
  content: string,
): void {
  const blob = new Blob([content], {
    type: "application/json;charset=utf-8",
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

export default function RuntimeRecordCandidateReviewPage() {
  const [testSession, setTestSession] =
    useState<RuntimeTestSession | null>(null);
  const [storedRuns, setStoredRuns] = useState<
    ScenarioRunSummary[]
  >([]);
  const [selectedRunId, setSelectedRunId] = useState("");
  const [candidates, setCandidates] = useState<
    GovernedRecordCandidateSummary[]
  >([]);
  const [selectedCandidateId, setSelectedCandidateId] =
    useState("");
  const [selectedCandidate, setSelectedCandidate] =
    useState<GovernedRecordCandidate | null>(null);
  const [filter, setFilter] =
    useState<CandidateFilter>("ALL");
  const [message, setMessage] = useState(
    "Loading Runtime record-review context.",
  );

  function refreshCandidates(
    preferredCandidateId?: string,
  ) {
    const nextCandidates =
      listGovernedRecordCandidates();

    setCandidates(nextCandidates);

    const nextSelectedId =
      preferredCandidateId ??
      (nextCandidates.some(
        (item) =>
          item.candidateId === selectedCandidateId,
      )
        ? selectedCandidateId
        : nextCandidates[0]?.candidateId ?? "");

    setSelectedCandidateId(nextSelectedId);
    setSelectedCandidate(
      nextSelectedId
        ? loadGovernedRecordCandidate(nextSelectedId) ?? null
        : null,
    );
  }

  useEffect(() => {
    const session = loadRuntimeTestSession() ?? null;
    const runs = listStoredScenarioRuns(
      RUNTIME_EXECUTION_LANE.laneId,
    );

    setTestSession(session);
    setStoredRuns(runs);
    setSelectedRunId(runs[0]?.storedRunId ?? "");
    refreshCandidates();

    setMessage(
      runs.length > 0
        ? `${runs.length} stored Runtime test run${
            runs.length === 1 ? "" : "s"
          } available for record-candidate assembly.`
        : "No stored Runtime test runs are available.",
    );
    // Browser-local hydration intentionally runs once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredCandidates = useMemo(
    () =>
      candidates.filter(
        (candidate) =>
          filter === "ALL" ||
          candidate.status === filter,
      ),
    [candidates, filter],
  );

  const statusCounts = useMemo(
    () => ({
      incomplete: candidates.filter(
        (item) => item.status === "INCOMPLETE",
      ).length,
      ready: candidates.filter(
        (item) => item.status === "READY_FOR_REVIEW",
      ).length,
      approved: candidates.filter(
        (item) =>
          item.status === "APPROVED_FOR_PRESERVATION",
      ).length,
    }),
    [candidates],
  );

  function assembleCandidate() {
    if (!selectedRunId) {
      setMessage(
        "Select a stored Runtime scenario run first.",
      );
      return;
    }

    const storedRun = loadStoredScenarioRun(
      RUNTIME_EXECUTION_LANE.laneId,
      selectedRunId,
    );

    if (!storedRun) {
      setMessage(
        "The selected stored scenario run could not be loaded.",
      );
      return;
    }

    const evidence: RuntimeEvidenceSummary[] =
      listRuntimeEvidenceAttachments(
        RUNTIME_EXECUTION_LANE.laneId,
        {
          routeDraftId:
            storedRun.routeDraftId ??
            testSession?.routeDraftId,
        },
      );

    const candidate = saveGovernedRecordCandidate(
      assembleGovernedRecordCandidate({
        testSession:
          testSession &&
          testSession.routeDraftId ===
            storedRun.routeDraftId
            ? testSession
            : undefined,
        storedRun,
        evidence,
        visibility: "PRIVATE",
      }),
    );

    refreshCandidates(candidate.candidateId);
    setMessage(
      candidate.status === "READY_FOR_REVIEW"
        ? "Governed-record candidate assembled and ready for review."
        : `Candidate assembled with ${
            candidate.issues.filter(
              (issue) => issue.blocking,
            ).length
          } blocking issue(s).`,
    );
  }

  function selectCandidate(candidateId: string) {
    setSelectedCandidateId(candidateId);
    setSelectedCandidate(
      loadGovernedRecordCandidate(candidateId) ?? null,
    );
  }

  function approveCandidate() {
    if (!selectedCandidate) {
      return;
    }

    try {
      const approved = saveGovernedRecordCandidate(
        approveGovernedRecordCandidateForPreservation(
          selectedCandidate,
        ),
      );

      refreshCandidates(approved.candidateId);
      setMessage(
        "Candidate approved for preservation review. It is still not a final preserved record.",
      );
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "The candidate could not be approved.",
      );
    }
  }

  function rejectCandidate() {
    if (!selectedCandidate) {
      return;
    }

    const rejected = saveGovernedRecordCandidate(
      rejectGovernedRecordCandidate(selectedCandidate),
    );

    refreshCandidates(rejected.candidateId);
    setMessage("Candidate rejected and retained for review history.");
  }

  function exportCandidate() {
    if (!selectedCandidate) {
      return;
    }

    const safeTitle = selectedCandidate.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    downloadJson(
      `${safeTitle || "runtime-record-candidate"}.json`,
      exportGovernedRecordCandidate(selectedCandidate),
    );
    setMessage("Governed-record candidate exported as JSON.");
  }

  function deleteCandidate() {
    if (!selectedCandidate) {
      return;
    }

    deleteGovernedRecordCandidate(
      selectedCandidate.candidateId,
    );
    refreshCandidates();
    setMessage(
      "Selected local candidate deleted. No final preserved record was affected.",
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto w-full max-w-[92rem] px-5 py-6 lg:px-8">
        <div className="mb-6 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <Link
              href="/ai-governance/playground/runtime-execution"
              className="text-sm font-semibold text-cyan-300 transition hover:text-cyan-200"
            >
              ← Runtime Playground
            </Link>
            <h1 className="mt-3 text-3xl font-black md:text-5xl">
              Governed-Record Candidate Review
            </h1>
            <p className="mt-3 max-w-3xl leading-7 text-slate-400">
              Assemble and review a route-linked test record before
              any preservation step.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/ai-governance/playground/runtime-execution/history"
              className="rounded-xl border border-white/15 px-5 py-3 text-sm font-bold text-white transition hover:border-cyan-300/40"
            >
              Review Run History
            </Link>
            <button
              type="button"
              onClick={assembleCandidate}
              disabled={!selectedRunId}
              className="rounded-xl bg-cyan-300 px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Assemble Candidate
            </button>
          </div>
        </div>

        <section className="grid gap-4 md:grid-cols-3">
          <Metric
            label="Incomplete"
            value={statusCounts.incomplete}
          />
          <Metric
            label="Ready for review"
            value={statusCounts.ready}
          />
          <Metric
            label="Approved"
            value={statusCounts.approved}
          />
        </section>

        <section className="mt-6 rounded-3xl border border-cyan-300/20 bg-cyan-300/[0.05] p-5 md:p-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-300">
                Source run
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {message}
              </p>
            </div>

            <select
              value={selectedRunId}
              onChange={(event) =>
                setSelectedRunId(event.target.value)
              }
              className="min-w-72 rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-cyan-300/50"
            >
              <option value="">
                Select a stored scenario run
              </option>
              {storedRuns.map((run) => (
                <option
                  key={run.storedRunId}
                  value={run.storedRunId}
                >
                  {run.scenarioTitle} ·{" "}
                  {run.observedDetermination} ·{" "}
                  {run.valid ? "VALID" : "INVALID"}
                </option>
              ))}
            </select>
          </div>
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-[390px_minmax(0,1fr)]">
          <aside className="h-fit rounded-3xl border border-white/10 bg-white/[0.04] p-5 lg:sticky lg:top-6">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-300">
              Record candidates
            </p>

            <div className="mt-4 grid grid-cols-2 gap-2">
              {(
                [
                  "ALL",
                  "INCOMPLETE",
                  "READY_FOR_REVIEW",
                  "APPROVED_FOR_PRESERVATION",
                ] as const
              ).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setFilter(option)}
                  className={`rounded-lg border px-3 py-2 text-[10px] font-black transition ${
                    filter === option
                      ? "border-cyan-300/50 bg-cyan-300/10 text-cyan-100"
                      : "border-white/10 text-slate-500 hover:border-white/20"
                  }`}
                >
                  {option.replaceAll("_", " ")}
                </button>
              ))}
            </div>

            <div className="mt-5 max-h-[65vh] space-y-2 overflow-y-auto pr-1">
              {filteredCandidates.map((candidate) => (
                <button
                  key={candidate.candidateId}
                  type="button"
                  onClick={() =>
                    selectCandidate(candidate.candidateId)
                  }
                  className={`w-full rounded-2xl border p-4 text-left transition ${
                    selectedCandidateId ===
                    candidate.candidateId
                      ? "border-cyan-300/50 bg-cyan-300/[0.08]"
                      : "border-white/10 bg-slate-950/60 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-sm font-bold leading-5 text-slate-200">
                      {candidate.title}
                    </span>
                    <span className="rounded-full border border-white/10 px-2 py-1 text-[9px] font-black text-slate-500">
                      {candidate.status.replaceAll("_", " ")}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-slate-500">
                    {candidate.determination} ·{" "}
                    {candidate.evidenceCount} evidence ·{" "}
                    {candidate.blockingIssueCount} blocking
                  </p>
                </button>
              ))}

              {filteredCandidates.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/10 p-5 text-sm leading-6 text-slate-600">
                  No candidates match this filter.
                </div>
              ) : null}
            </div>
          </aside>

          <section className="min-w-0">
            {selectedCandidate ? (
              <div className="space-y-6">
                <article className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 md:p-8">
                  <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-300">
                        Governed-record candidate
                      </p>
                      <h2 className="mt-3 text-3xl font-black">
                        {selectedCandidate.title}
                      </h2>
                      <p className="mt-3 text-sm text-slate-500">
                        {selectedCandidate.status.replaceAll(
                          "_",
                          " ",
                        )}
                      </p>
                    </div>

                    <span className="rounded-full border border-white/10 bg-slate-950 px-4 py-2 text-sm font-black text-slate-300">
                      {
                        selectedCandidate.payload
                          .observedDetermination
                      }
                    </span>
                  </div>

                  <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <Detail
                      label="Route"
                      value={
                        selectedCandidate.payload.routeTitle
                      }
                    />
                    <Detail
                      label="Scenario"
                      value={
                        selectedCandidate.payload
                          .scenarioTitle
                      }
                    />
                    <Detail
                      label="Evidence"
                      value={String(
                        selectedCandidate.payload.evidenceIds
                          .length,
                      )}
                    />
                    <Detail
                      label="Blocking issues"
                      value={String(
                        selectedCandidate.issues.filter(
                          (issue) => issue.blocking,
                        ).length,
                      )}
                    />
                  </div>
                </article>

                <article className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 md:p-8">
                  <h3 className="text-xl font-black">
                    Review issues
                  </h3>

                  {selectedCandidate.issues.length > 0 ? (
                    <div className="mt-5 space-y-3">
                      {selectedCandidate.issues.map(
                        (issue, index) => (
                          <div
                            key={`${issue.code}-${index}`}
                            className={`rounded-2xl border p-4 ${
                              issue.blocking
                                ? "border-rose-300/20 bg-rose-300/[0.05]"
                                : "border-amber-300/20 bg-amber-300/[0.05]"
                            }`}
                          >
                            <div className="flex flex-wrap items-center justify-between gap-3">
                              <p className="font-bold text-slate-200">
                                {issue.message}
                              </p>
                              <span className="rounded-full border border-white/10 px-2.5 py-1 text-[10px] font-black text-slate-500">
                                {issue.blocking
                                  ? "BLOCKING"
                                  : "WARNING"}
                              </span>
                            </div>
                            <p className="mt-2 text-xs text-slate-600">
                              {issue.code.replaceAll("_", " ")}
                            </p>
                          </div>
                        ),
                      )}
                    </div>
                  ) : (
                    <p className="mt-4 leading-7 text-emerald-100/75">
                      No review issues were identified by the
                      candidate assembler.
                    </p>
                  )}
                </article>

                <article className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 md:p-8">
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={approveCandidate}
                      disabled={
                        selectedCandidate.status !==
                          "READY_FOR_REVIEW" ||
                        selectedCandidate.issues.some(
                          (issue) => issue.blocking,
                        )
                      }
                      className="rounded-xl bg-emerald-300 px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-emerald-200 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Approve for Preservation Review
                    </button>
                    <button
                      type="button"
                      onClick={rejectCandidate}
                      className="rounded-xl border border-amber-300/25 px-5 py-3 text-sm font-bold text-amber-100 transition hover:border-amber-300/50"
                    >
                      Reject Candidate
                    </button>
                    <button
                      type="button"
                      onClick={exportCandidate}
                      className="rounded-xl border border-white/15 px-5 py-3 text-sm font-bold text-white transition hover:border-cyan-300/40"
                    >
                      Export JSON
                    </button>
                    <button
                      type="button"
                      onClick={deleteCandidate}
                      className="rounded-xl border border-rose-300/25 px-5 py-3 text-sm font-bold text-rose-200 transition hover:border-rose-300/50"
                    >
                      Delete Candidate
                    </button>
                  </div>

                  <p className="mt-5 text-xs leading-6 text-slate-600">
                    Approval here means approved to enter a future
                    preservation workflow. It does not create an
                    immutable governed record or prove real-world
                    execution.
                  </p>
                </article>
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.02] p-10 text-center">
                <h2 className="text-2xl font-black">
                  No candidate selected
                </h2>
                <p className="mx-auto mt-3 max-w-xl leading-7 text-slate-500">
                  Assemble a candidate from a stored Runtime test run
                  or select one from the review list.
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

function Metric({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-3xl font-black">{value}</p>
    </div>
  );
}

function Detail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-600">
        {label}
      </p>
      <p className="mt-2 break-words font-bold text-slate-200">
        {value}
      </p>
    </div>
  );
}
