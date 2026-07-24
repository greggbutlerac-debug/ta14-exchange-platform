"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import {
  RUNTIME_EXECUTION_LANE,
  RUNTIME_EXECUTION_SCENARIOS,
  SHARED_GATE_DEFINITIONS,
  createStoredScenarioRun,
  exportStoredScenarioRun,
  listStoredScenarioRuns,
  loadRuntimeTestSession,
  loadStoredScenarioRun,
  saveStoredScenarioRun,
  verifyScenarioRun,
  type FailureInjection,
  type GateResult,
  type GateResultStatus,
  type RouteDetermination,
  type ScenarioRun,
  type RuntimeTestSession,
  type ScenarioRunSummary,
  type StoredScenarioRun,
} from "../../../../../lib/governance-playgrounds";

type GateStatusDraft = Record<string, GateResultStatus>;

const statusOptions: readonly GateResultStatus[] = [
  "PASS",
  "FAIL",
  "UNRESOLVED",
  "ESCALATED",
  "NOT_APPLICABLE",
  "NOT_TESTED",
];

const determinationOptions: readonly RouteDetermination[] = [
  "ALLOW",
  "HOLD",
  "DENY",
  "ESCALATE",
];

const statusStyles: Record<GateResultStatus, string> = {
  PASS: "border-emerald-300/30 bg-emerald-300/10 text-emerald-200",
  FAIL: "border-rose-300/30 bg-rose-300/10 text-rose-200",
  UNRESOLVED: "border-amber-300/30 bg-amber-300/10 text-amber-200",
  ESCALATED: "border-sky-300/30 bg-sky-300/10 text-sky-200",
  NOT_APPLICABLE: "border-slate-300/20 bg-slate-300/5 text-slate-300",
  NOT_TESTED: "border-white/10 bg-white/[0.03] text-slate-500",
};

function nowIso(): string {
  return new Date().toISOString();
}

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

function createGateResult(
  gateId: string,
  status: GateResultStatus,
): GateResult {
  const gate = SHARED_GATE_DEFINITIONS.find(
    (candidate) => candidate.gateId === gateId,
  );

  return {
    gateId,
    status,
    requirementLevel: gate?.requirementLevel ?? "MANDATORY",
    summary: `Observed ${status} during scenario execution.`,
    findings: [],
    supportingEvidenceIds: [],
    conflictingEvidenceIds: [],
    evaluatedAt: nowIso(),
    evaluatedBy: { system: "TA14_EVALUATOR" },
    evaluatorVersion: "runtime-scenario-manual-v1",
  };
}

export default function RuntimeScenarioRunnerPage() {
  type RuntimeScenarioId =
    (typeof RUNTIME_EXECUTION_SCENARIOS)[number]["scenarioId"];

  const [selectedScenarioId, setSelectedScenarioId] =
    useState<RuntimeScenarioId>(
      RUNTIME_EXECUTION_SCENARIOS[0]?.scenarioId ??
        "RUNTIME-BASELINE-ALLOW",
    );
  const [observedDetermination, setObservedDetermination] =
    useState<RouteDetermination>(
      RUNTIME_EXECUTION_SCENARIOS[0]?.expectedDetermination ??
        "HOLD",
    );
  const [gateStatuses, setGateStatuses] =
    useState<GateStatusDraft>(() => {
      const firstScenario = RUNTIME_EXECUTION_SCENARIOS[0];

      return firstScenario
        ? Object.fromEntries(
            Object.entries(
              firstScenario.expectedGateStatuses,
            ).map(([gateId, status]) => [
              gateId,
              status ?? "NOT_TESTED",
            ]),
          )
        : {};
    });
  const [storedRuns, setStoredRuns] = useState<
    ScenarioRunSummary[]
  >([]);
  const [selectedStoredRunId, setSelectedStoredRunId] =
    useState("");
  const [storageMessage, setStorageMessage] = useState(
    "Scenario runs are stored locally and remain separate from governed records.",
  );
  const [testSession, setTestSession] =
    useState<RuntimeTestSession | null>(null);

  const selectedScenario =
    RUNTIME_EXECUTION_SCENARIOS.find(
      (scenario) => scenario.scenarioId === selectedScenarioId,
    ) ?? RUNTIME_EXECUTION_SCENARIOS[0];

  const scenarioRun = useMemo<ScenarioRun | null>(() => {
    if (!selectedScenario) {
      return null;
    }

    return {
      scenarioRunId: `manual-${selectedScenario.scenarioId}`,
      scenarioId: selectedScenario.scenarioId,
      routeId: "runtime-route-preview",
      status: "COMPLETED",
      startedAt: nowIso(),
      completedAt: nowIso(),
      injectionsApplied: selectedScenario.injections,
      gateResults: Object.entries(gateStatuses).map(
        ([gateId, status]) => createGateResult(gateId, status),
      ),
      determination: observedDetermination,
    };
  }, [gateStatuses, observedDetermination, selectedScenario]);

  const verification = useMemo(() => {
    if (!selectedScenario || !scenarioRun) {
      return null;
    }

    return verifyScenarioRun(selectedScenario, scenarioRun);
  }, [scenarioRun, selectedScenario]);

  useEffect(() => {
    setStoredRuns(
      listStoredScenarioRuns(RUNTIME_EXECUTION_LANE.laneId),
    );
    setTestSession(loadRuntimeTestSession() ?? null);
  }, []);

  function saveCurrentRun() {
    if (!scenarioRun || !verification) {
      setStorageMessage(
        "The current scenario run is not ready to be stored.",
      );
      return;
    }

    const storedRun = saveStoredScenarioRun(
      createStoredScenarioRun({
        laneId: RUNTIME_EXECUTION_LANE.laneId,
        laneVersion: RUNTIME_EXECUTION_LANE.version,
        routeDraftId: testSession?.routeDraftId,
        routeTitle: testSession?.routeTitle,
        scenarioTitle: selectedScenario.title,
        expectedDetermination:
          selectedScenario.expectedDetermination,
        scenarioRun,
        verification,
        metadata: {
          source: "runtime-scenario-runner",
          preservationClass: "LOCAL_TEST_RUN",
          activeTestSessionId: testSession?.sessionId ?? null,
          routeValuesSnapshot:
            testSession?.routeValues ?? {},
        },
      }),
    );

    setStoredRuns(
      listStoredScenarioRuns(RUNTIME_EXECUTION_LANE.laneId),
    );
    setSelectedStoredRunId(storedRun.storedRunId);
    setStorageMessage(
      `Saved ${verification.valid ? "verified" : "invalid"} run locally at ${new Date(
        storedRun.updatedAt,
      ).toLocaleTimeString()}.`,
    );
  }

  function restoreStoredRun(storedRunId: string) {
    const storedRun = loadStoredScenarioRun(
      RUNTIME_EXECUTION_LANE.laneId,
      storedRunId,
    );

    if (!storedRun) {
      setStorageMessage("The selected scenario run could not be loaded.");
      return;
    }

    const matchingScenario = RUNTIME_EXECUTION_SCENARIOS.find(
      (scenario) => scenario.scenarioId === storedRun.scenarioId,
    );

    if (!matchingScenario) {
      setStorageMessage(
        "The stored run references a scenario that is no longer available.",
      );
      return;
    }

    setSelectedScenarioId(matchingScenario.scenarioId);
    setObservedDetermination(
      storedRun.observedDetermination,
    );
    setGateStatuses(
      Object.fromEntries(
        storedRun.scenarioRun.gateResults.map((result) => [
          result.gateId,
          result.status,
        ]),
      ),
    );
    setSelectedStoredRunId(storedRun.storedRunId);
    setStorageMessage(
      `Loaded run saved ${new Date(
        storedRun.updatedAt,
      ).toLocaleString()}.`,
    );
  }

  function exportSelectedRun() {
    const storedRun: StoredScenarioRun | undefined =
      selectedStoredRunId
        ? loadStoredScenarioRun(
            RUNTIME_EXECUTION_LANE.laneId,
            selectedStoredRunId,
          )
        : undefined;

    if (!storedRun) {
      setStorageMessage(
        "Save or select a stored scenario run before exporting.",
      );
      return;
    }

    const safeTitle = storedRun.scenarioTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    downloadJson(
      `${safeTitle || "runtime-scenario"}-run.json`,
      exportStoredScenarioRun(storedRun),
    );
    setStorageMessage("Stored scenario run exported as JSON.");
  }

  function selectScenario(scenarioId: string) {
    const nextScenario = RUNTIME_EXECUTION_SCENARIOS.find(
      (scenario) => scenario.scenarioId === scenarioId,
    );

    if (!nextScenario) {
      return;
    }

    setSelectedScenarioId(nextScenario.scenarioId);
    setObservedDetermination(nextScenario.expectedDetermination);
    setGateStatuses(
      Object.fromEntries(
        Object.entries(nextScenario.expectedGateStatuses).map(
          ([gateId, status]) => [
            gateId,
            status ?? "NOT_TESTED",
          ],
        ),
      ),
    );
  }

  if (!selectedScenario || !scenarioRun || !verification) {
    return null;
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto w-full max-w-[92rem] px-5 py-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link
              href="/ai-governance/playground/runtime-execution"
              className="text-sm font-semibold text-cyan-300 transition hover:text-cyan-200"
            >
              ← Runtime Playground
            </Link>
            <h1 className="mt-3 text-3xl font-black md:text-5xl">
              Runtime Scenario Runner
            </h1>
            <p className="mt-3 max-w-3xl leading-7 text-slate-400">
              Compare observed gate behavior against the scenario
              definition before a run can be treated as valid.
            </p>
          </div>

          <span className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-bold text-slate-300">
            {RUNTIME_EXECUTION_SCENARIOS.length} required scenarios
          </span>
        </div>

        <section className="mb-6 rounded-3xl border border-cyan-300/20 bg-cyan-300/[0.05] p-5 md:p-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-300">
                Active route under test
              </p>
              <h2 className="mt-2 text-xl font-black">
                {testSession?.routeTitle ??
                  "No Runtime route selected"}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {testSession
                  ? `Draft ${testSession.routeDraftId} selected ${new Date(
                      testSession.selectedAt,
                    ).toLocaleString()}.`
                  : "Build a ready Runtime route and send it to testing before preserving route-linked scenario runs."}
              </p>
            </div>

            {testSession ? (
              <span className="rounded-full border border-emerald-300/30 bg-emerald-300/10 px-4 py-2 text-sm font-black text-emerald-200">
                ROUTE LINKED
              </span>
            ) : (
              <Link
                href="/ai-governance/playground/runtime-execution/new"
                className="rounded-xl border border-cyan-300/30 px-5 py-3 text-sm font-bold text-cyan-100 transition hover:border-cyan-300/60 hover:bg-cyan-300/[0.06]"
              >
                Build and Select Route
              </Link>
            )}
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="h-fit rounded-3xl border border-white/10 bg-white/[0.04] p-5 lg:sticky lg:top-6">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-300">
              Scenario catalog
            </p>

            <div className="mt-4 space-y-2">
              {RUNTIME_EXECUTION_SCENARIOS.map((scenario) => {
                const active =
                  scenario.scenarioId === selectedScenario.scenarioId;

                return (
                  <button
                    key={scenario.scenarioId}
                    type="button"
                    onClick={() =>
                      selectScenario(scenario.scenarioId)
                    }
                    className={`w-full rounded-2xl border p-4 text-left transition ${
                      active
                        ? "border-cyan-300/50 bg-cyan-300/10"
                        : "border-white/10 bg-slate-950/60 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="text-sm font-bold leading-5 text-slate-200">
                        {scenario.title}
                      </span>
                      <span className="rounded-full border border-white/10 px-2 py-1 text-[9px] font-black text-slate-500">
                        {scenario.expectedDetermination}
                      </span>
                    </div>
                    <p className="mt-2 text-xs leading-5 text-slate-500">
                      {scenario.scenarioClass.replaceAll("_", " ")}
                    </p>
                  </button>
                );
              })}
            </div>
          </aside>

          <section className="min-w-0 space-y-6">
            <article className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 md:p-8">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-300">
                    {selectedScenario.scenarioClass.replaceAll(
                      "_",
                      " ",
                    )}
                  </p>
                  <h2 className="mt-3 text-3xl font-black">
                    {selectedScenario.title}
                  </h2>
                  <p className="mt-4 max-w-4xl leading-7 text-slate-400">
                    {selectedScenario.description}
                  </p>
                </div>

                <span className="rounded-full border border-white/10 bg-slate-950 px-4 py-2 text-sm font-bold text-slate-300">
                  Expected{" "}
                  {selectedScenario.expectedDetermination}
                </span>
              </div>

              {selectedScenario.injections.length > 0 ? (
                <div className="mt-7">
                  <h3 className="text-sm font-black uppercase tracking-[0.16em] text-slate-400">
                    Failure injections
                  </h3>
                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    {(selectedScenario.injections as readonly FailureInjection[]).map((injection) => (
                      <div
                        key={injection.injectionId}
                        className="rounded-2xl border border-white/10 bg-slate-950/70 p-4"
                      >
                        <p className="font-bold text-slate-200">
                          {injection.title}
                        </p>
                        <p className="mt-2 text-sm leading-6 text-slate-500">
                          {injection.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </article>

            <article className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 md:p-8">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-300">
                    Observed results
                  </p>
                  <h2 className="mt-3 text-2xl font-black">
                    Record the gate behavior
                  </h2>
                </div>

                <label className="text-sm font-bold text-slate-300">
                  Observed determination
                  <select
                    value={observedDetermination}
                    onChange={(event) =>
                      setObservedDetermination(
                        event.target
                          .value as RouteDetermination,
                      )
                    }
                    className="ml-3 rounded-xl border border-white/10 bg-slate-950 px-4 py-2 text-white outline-none focus:border-cyan-300/50"
                  >
                    {determinationOptions.map((determination) => (
                      <option
                        key={determination}
                        value={determination}
                      >
                        {determination}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="mt-6 space-y-3">
                {Object.entries(
                  selectedScenario.expectedGateStatuses,
                ).map(([gateId, expectedStatus]) => {
                  const gate = SHARED_GATE_DEFINITIONS.find(
                    (candidate) =>
                      candidate.gateId === gateId,
                  );
                  const observedStatus =
                    gateStatuses[gateId] ?? "NOT_TESTED";

                  return (
                    <div
                      key={gateId}
                      className="grid gap-4 rounded-2xl border border-white/10 bg-slate-950/70 p-4 md:grid-cols-[1fr_auto_auto] md:items-center"
                    >
                      <div>
                        <p className="font-bold text-slate-200">
                          {gate?.title ?? gateId}
                        </p>
                        <p className="mt-1 text-xs text-slate-600">
                          {gateId}
                        </p>
                      </div>

                      <span
                        className={`rounded-full border px-3 py-1.5 text-xs font-bold ${
                          statusStyles[
                            expectedStatus ?? "NOT_TESTED"
                          ]
                        }`}
                      >
                        Expected {expectedStatus}
                      </span>

                      <select
                        value={observedStatus}
                        onChange={(event) =>
                          setGateStatuses((current) => ({
                            ...current,
                            [gateId]: event.target
                              .value as GateResultStatus,
                          }))
                        }
                        className="rounded-xl border border-white/10 bg-slate-900 px-4 py-2 text-sm text-white outline-none focus:border-cyan-300/50"
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>
                  );
                })}
              </div>
            </article>

            <article className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 md:p-8">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-300">
                    Local test-run storage
                  </p>
                  <h2 className="mt-2 text-2xl font-black">
                    Preserve this observed run
                  </h2>
                  <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500">
                    Stored runs preserve what was observed and whether it
                    matched the scenario. They are not governed records,
                    evidence of real execution, or certification.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={saveCurrentRun}
                    className="rounded-xl bg-cyan-300 px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-cyan-200"
                  >
                    Save Current Run
                  </button>
                  <button
                    type="button"
                    onClick={exportSelectedRun}
                    className="rounded-xl border border-white/15 px-5 py-3 text-sm font-bold text-white transition hover:border-cyan-300/40"
                  >
                    Export Selected
                  </button>
                </div>
              </div>

              <p className="mt-4 text-sm text-slate-500">
                {storageMessage}
              </p>

              {storedRuns.length > 0 ? (
                <div className="mt-6 grid gap-3 md:grid-cols-2">
                  {storedRuns.map((run) => (
                    <button
                      key={run.storedRunId}
                      type="button"
                      onClick={() =>
                        restoreStoredRun(run.storedRunId)
                      }
                      className={`rounded-2xl border p-4 text-left transition ${
                        selectedStoredRunId === run.storedRunId
                          ? "border-cyan-300/50 bg-cyan-300/[0.08]"
                          : "border-white/10 bg-slate-950/60 hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <span className="font-bold text-slate-200">
                          {run.scenarioTitle}
                        </span>
                        <span
                          className={`rounded-full border px-2.5 py-1 text-[10px] font-black ${
                            run.valid
                              ? "border-emerald-300/30 text-emerald-200"
                              : "border-rose-300/30 text-rose-200"
                          }`}
                        >
                          {run.valid ? "VALID" : "INVALID"}
                        </span>
                      </div>
                      <p className="mt-2 text-xs leading-5 text-slate-500">
                        Expected {run.expectedDetermination} · Observed{" "}
                        {run.observedDetermination}
                      </p>
                      <p className="mt-1 text-xs text-slate-600">
                        {run.issueCount} issue
                        {run.issueCount === 1 ? "" : "s"} ·{" "}
                        {new Date(
                          run.updatedAt,
                        ).toLocaleString()}
                      </p>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="mt-6 rounded-2xl border border-dashed border-white/10 p-6 text-sm text-slate-600">
                  No Runtime scenario runs have been stored in this
                  browser.
                </div>
              )}
            </article>

            <article
              className={`rounded-3xl border p-6 md:p-8 ${
                verification.valid
                  ? "border-emerald-300/25 bg-emerald-300/[0.06]"
                  : "border-rose-300/25 bg-rose-300/[0.06]"
              }`}
            >
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                    Verification result
                  </p>
                  <h2 className="mt-2 text-2xl font-black">
                    {verification.valid
                      ? "Scenario behavior verified"
                      : "Scenario behavior does not match"}
                  </h2>
                </div>

                <span
                  className={`rounded-full border px-4 py-2 text-sm font-black ${
                    verification.valid
                      ? "border-emerald-300/30 text-emerald-200"
                      : "border-rose-300/30 text-rose-200"
                  }`}
                >
                  {verification.valid ? "VALID" : "INVALID"}
                </span>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-4">
                <Metric
                  label="Matched gates"
                  value={verification.matchedGateIds.length}
                />
                <Metric
                  label="Mismatched gates"
                  value={verification.mismatchedGateIds.length}
                />
                <Metric
                  label="Missing gates"
                  value={verification.missingGateIds.length}
                />
                <Metric
                  label="Issues"
                  value={verification.issues.length}
                />
              </div>

              {verification.issues.length > 0 ? (
                <div className="mt-6 space-y-3">
                  {verification.issues.map((issue, index) => (
                    <div
                      key={`${issue.code}-${issue.gateId ?? "general"}-${index}`}
                      className="rounded-xl border border-white/10 bg-slate-950/70 p-4"
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
                  ))}
                </div>
              ) : (
                <p className="mt-6 leading-7 text-emerald-100/80">
                  The observed determination and all declared expected
                  gate results match the scenario definition.
                </p>
              )}
            </article>
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
    <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-3xl font-black text-white">
        {value}
      </p>
    </div>
  );
}
