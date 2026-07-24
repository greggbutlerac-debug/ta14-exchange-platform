"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import {
  RUNTIME_EXECUTION_LANE,
  deleteStoredScenarioRun,
  exportStoredScenarioRun,
  listStoredScenarioRuns,
  loadStoredScenarioRun,
  type ScenarioRunSummary,
  type StoredScenarioRun,
} from "../../../../../lib/governance-playgrounds";

type ValidityFilter = "ALL" | "VALID" | "INVALID";

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

export default function RuntimeScenarioHistoryPage() {
  const [runs, setRuns] = useState<ScenarioRunSummary[]>([]);
  const [selectedRunId, setSelectedRunId] = useState("");
  const [selectedRun, setSelectedRun] =
    useState<StoredScenarioRun | null>(null);
  const [filter, setFilter] =
    useState<ValidityFilter>("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState(
    "Loading locally stored Runtime scenario runs.",
  );

  function refreshRuns(preferredRunId?: string) {
    const nextRuns = listStoredScenarioRuns(
      RUNTIME_EXECUTION_LANE.laneId,
    );

    setRuns(nextRuns);

    const nextSelectedId =
      preferredRunId ??
      (nextRuns.some(
        (run) => run.storedRunId === selectedRunId,
      )
        ? selectedRunId
        : nextRuns[0]?.storedRunId ?? "");

    setSelectedRunId(nextSelectedId);
    setSelectedRun(
      nextSelectedId
        ? loadStoredScenarioRun(
            RUNTIME_EXECUTION_LANE.laneId,
            nextSelectedId,
          ) ?? null
        : null,
    );

    setMessage(
      nextRuns.length > 0
        ? `${nextRuns.length} locally stored run${
            nextRuns.length === 1 ? "" : "s"
          }.`
        : "No Runtime scenario runs are stored in this browser.",
    );
  }

  useEffect(() => {
    refreshRuns();
    // This page intentionally hydrates local browser storage once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredRuns = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return runs.filter((run) => {
      const validityMatches =
        filter === "ALL" ||
        (filter === "VALID" && run.valid) ||
        (filter === "INVALID" && !run.valid);

      if (!validityMatches) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      return [
        run.scenarioTitle,
        run.scenarioId,
        run.routeTitle ?? "",
        run.expectedDetermination,
        run.observedDetermination,
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch);
    });
  }, [filter, runs, searchTerm]);

  const validCount = runs.filter((run) => run.valid).length;
  const invalidCount = runs.length - validCount;

  function selectRun(storedRunId: string) {
    const run = loadStoredScenarioRun(
      RUNTIME_EXECUTION_LANE.laneId,
      storedRunId,
    );

    setSelectedRunId(storedRunId);
    setSelectedRun(run ?? null);

    if (!run) {
      setMessage("The selected run could not be loaded.");
    }
  }

  function exportSelectedRun() {
    if (!selectedRun) {
      setMessage("Select a stored run before exporting.");
      return;
    }

    const safeTitle = selectedRun.scenarioTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    downloadJson(
      `${safeTitle || "runtime-scenario"}-run.json`,
      exportStoredScenarioRun(selectedRun),
    );
    setMessage("Selected scenario run exported as JSON.");
  }

  function deleteSelectedRun() {
    if (!selectedRun) {
      return;
    }

    deleteStoredScenarioRun(
      RUNTIME_EXECUTION_LANE.laneId,
      selectedRun.storedRunId,
    );

    refreshRuns();
    setMessage(
      "Selected local scenario run deleted. No governed record was affected.",
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
              Runtime Test-Run History
            </h1>
            <p className="mt-3 max-w-3xl leading-7 text-slate-400">
              Review locally preserved scenario observations,
              mismatches, and verification outcomes.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/ai-governance/playground/runtime-execution/scenarios"
              className="rounded-xl bg-cyan-300 px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-cyan-200"
            >
              Run Another Scenario
            </Link>
            <button
              type="button"
              onClick={exportSelectedRun}
              disabled={!selectedRun}
              className="rounded-xl border border-white/15 px-5 py-3 text-sm font-bold text-white transition hover:border-cyan-300/40 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Export Selected
            </button>
          </div>
        </div>

        <section className="grid gap-4 md:grid-cols-3">
          <Metric label="Stored runs" value={runs.length} />
          <Metric label="Valid runs" value={validCount} />
          <Metric label="Invalid runs" value={invalidCount} />
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-[390px_minmax(0,1fr)]">
          <aside className="h-fit rounded-3xl border border-white/10 bg-white/[0.04] p-5 lg:sticky lg:top-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-300">
                  Stored runs
                </p>
                <p className="mt-2 text-xs leading-5 text-slate-600">
                  {message}
                </p>
              </div>
              <button
                type="button"
                onClick={() => refreshRuns()}
                className="rounded-lg border border-white/10 px-3 py-2 text-xs font-bold text-slate-300 transition hover:border-cyan-300/40"
              >
                Refresh
              </button>
            </div>

            <input
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
              placeholder="Search scenario, route, or outcome"
              className="mt-5 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-700 focus:border-cyan-300/50"
            />

            <div className="mt-3 grid grid-cols-3 gap-2">
              {(["ALL", "VALID", "INVALID"] as const).map(
                (option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setFilter(option)}
                    className={`rounded-lg border px-3 py-2 text-xs font-black transition ${
                      filter === option
                        ? "border-cyan-300/50 bg-cyan-300/10 text-cyan-100"
                        : "border-white/10 text-slate-500 hover:border-white/20"
                    }`}
                  >
                    {option}
                  </button>
                ),
              )}
            </div>

            <div className="mt-5 max-h-[62vh] space-y-2 overflow-y-auto pr-1">
              {filteredRuns.map((run) => (
                <button
                  key={run.storedRunId}
                  type="button"
                  onClick={() => selectRun(run.storedRunId)}
                  className={`w-full rounded-2xl border p-4 text-left transition ${
                    selectedRunId === run.storedRunId
                      ? "border-cyan-300/50 bg-cyan-300/[0.08]"
                      : "border-white/10 bg-slate-950/60 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-sm font-bold leading-5 text-slate-200">
                      {run.scenarioTitle}
                    </span>
                    <span
                      className={`rounded-full border px-2 py-1 text-[9px] font-black ${
                        run.valid
                          ? "border-emerald-300/30 text-emerald-200"
                          : "border-rose-300/30 text-rose-200"
                      }`}
                    >
                      {run.valid ? "VALID" : "INVALID"}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-slate-500">
                    {run.expectedDetermination} expected ·{" "}
                    {run.observedDetermination} observed
                  </p>
                  <p className="mt-1 text-xs text-slate-700">
                    {new Date(run.updatedAt).toLocaleString()}
                  </p>
                </button>
              ))}

              {filteredRuns.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/10 p-5 text-sm leading-6 text-slate-600">
                  No stored runs match the current filters.
                </div>
              ) : null}
            </div>
          </aside>

          <section className="min-w-0">
            {selectedRun ? (
              <div className="space-y-6">
                <article className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 md:p-8">
                  <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-300">
                        Stored scenario run
                      </p>
                      <h2 className="mt-3 text-3xl font-black">
                        {selectedRun.scenarioTitle}
                      </h2>
                      <p className="mt-3 text-sm text-slate-500">
                        Saved{" "}
                        {new Date(
                          selectedRun.updatedAt,
                        ).toLocaleString()}
                      </p>
                    </div>

                    <span
                      className={`rounded-full border px-4 py-2 text-sm font-black ${
                        selectedRun.verification.valid
                          ? "border-emerald-300/30 bg-emerald-300/10 text-emerald-200"
                          : "border-rose-300/30 bg-rose-300/10 text-rose-200"
                      }`}
                    >
                      {selectedRun.verification.valid
                        ? "VALID"
                        : "INVALID"}
                    </span>
                  </div>

                  <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <Detail
                      label="Expected"
                      value={
                        selectedRun.expectedDetermination
                      }
                    />
                    <Detail
                      label="Observed"
                      value={
                        selectedRun.observedDetermination
                      }
                    />
                    <Detail
                      label="Matched gates"
                      value={String(
                        selectedRun.verification
                          .matchedGateIds.length,
                      )}
                    />
                    <Detail
                      label="Issues"
                      value={String(
                        selectedRun.verification.issues.length,
                      )}
                    />
                  </div>
                </article>

                <article className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 md:p-8">
                  <h3 className="text-xl font-black">
                    Verification issues
                  </h3>

                  {selectedRun.verification.issues.length > 0 ? (
                    <div className="mt-5 space-y-3">
                      {selectedRun.verification.issues.map(
                        (issue, index) => (
                          <div
                            key={`${issue.code}-${issue.gateId ?? "general"}-${index}`}
                            className="rounded-2xl border border-white/10 bg-slate-950/70 p-4"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-3">
                              <p className="font-bold text-slate-200">
                                {issue.message}
                              </p>
                              <span className="rounded-full border border-white/10 px-2.5 py-1 text-[10px] font-black text-slate-500">
                                {issue.code.replaceAll("_", " ")}
                              </span>
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  ) : (
                    <p className="mt-4 leading-7 text-emerald-100/75">
                      The observed determination and declared gate
                      results matched the scenario definition.
                    </p>
                  )}
                </article>

                <article className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 md:p-8">
                  <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                      <h3 className="text-xl font-black">
                        Local-storage controls
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-slate-500">
                        Deleting this entry removes only the local test
                        run. It does not delete a governed record.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={deleteSelectedRun}
                      className="rounded-xl border border-rose-300/25 px-5 py-3 text-sm font-bold text-rose-200 transition hover:border-rose-300/50 hover:bg-rose-300/[0.05]"
                    >
                      Delete Selected Run
                    </button>
                  </div>
                </article>
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.02] p-10 text-center">
                <h2 className="text-2xl font-black">
                  No stored run selected
                </h2>
                <p className="mx-auto mt-3 max-w-xl leading-7 text-slate-500">
                  Run and save a Runtime scenario, then return here to
                  review its observed gate behavior.
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
      <p className="mt-2 font-bold text-slate-200">{value}</p>
    </div>
  );
}
