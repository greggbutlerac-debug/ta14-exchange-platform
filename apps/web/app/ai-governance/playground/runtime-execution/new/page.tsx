"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  RUNTIME_EXECUTION_LANE,
  createGovernanceDraft,
  deleteGovernanceDraft,
  exportGovernanceDraft,
  evaluateRouteReadiness,
  listGovernanceDrafts,
  loadGovernanceDraft,
  saveGovernanceDraft,
  selectRuntimeDraftForTesting,
  type GovernanceDraftPayload,
  type GovernanceDraftSummary,
  type JsonValue,
  type PlaygroundFieldDefinition,
} from "../../../../../lib/governance-playgrounds";

type FormState = Record<string, JsonValue>;

const RUNTIME_DRAFT_ID_STORAGE_KEY =
  "ta14:runtime-execution:last-draft-id";

function downloadTextFile(
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

function initialValueForField(
  field: PlaygroundFieldDefinition,
): JsonValue {
  if (field.defaultValue !== undefined) {
    return field.defaultValue;
  }

  switch (field.type) {
    case "boolean":
      return false;
    case "multiselect":
      return [];
    case "number":
      return null;
    default:
      return "";
  }
}

function buildInitialState(): FormState {
  const entries = RUNTIME_EXECUTION_LANE.sections.flatMap((section) =>
    section.fields.map(
      (field) =>
        [field.key, initialValueForField(field)] as const,
    ),
  );

  return Object.fromEntries(entries);
}

function fieldIsVisible(
  field: PlaygroundFieldDefinition,
  values: FormState,
): boolean {
  if (!field.appliesWhen || field.appliesWhen.length === 0) {
    return true;
  }

  return field.appliesWhen.every((rule) => {
    const currentValue = values[rule.field];

    switch (rule.operator) {
      case "equals":
        return currentValue === rule.expected;
      case "not_equals":
        return currentValue !== rule.expected;
      case "exists":
        return (
          currentValue !== undefined &&
          currentValue !== null &&
          currentValue !== ""
        );
      case "not_exists":
        return (
          currentValue === undefined ||
          currentValue === null ||
          currentValue === ""
        );
      case "includes":
        return Array.isArray(currentValue)
          ? currentValue.includes(rule.expected as never)
          : String(currentValue ?? "").includes(
              String(rule.expected ?? ""),
            );
      case "not_includes":
        return Array.isArray(currentValue)
          ? !currentValue.includes(rule.expected as never)
          : !String(currentValue ?? "").includes(
              String(rule.expected ?? ""),
            );
      case "greater_than":
        return (
          typeof currentValue === "number" &&
          typeof rule.expected === "number" &&
          currentValue > rule.expected
        );
      case "less_than":
        return (
          typeof currentValue === "number" &&
          typeof rule.expected === "number" &&
          currentValue < rule.expected
        );
    }
  });
}

function fieldIsComplete(
  field: PlaygroundFieldDefinition,
  values: FormState,
): boolean {
  if (!fieldIsVisible(field, values)) {
    return true;
  }

  if (!field.required) {
    return true;
  }

  const value = values[field.key];

  if (Array.isArray(value)) {
    return value.length > 0;
  }

  if (typeof value === "boolean") {
    return true;
  }

  return value !== undefined && value !== null && String(value).trim() !== "";
}

export default function NewRuntimeExecutionRoutePage() {
  const [values, setValues] = useState<FormState>(buildInitialState);
  type RuntimeSectionId =
    (typeof RUNTIME_EXECUTION_LANE.sections)[number]["sectionId"];

  const [activeSectionId, setActiveSectionId] =
    useState<RuntimeSectionId>(
      RUNTIME_EXECUTION_LANE.sections[0]?.sectionId ??
        "route-identity",
    );
  const [showPreview, setShowPreview] = useState(false);
  const [draft, setDraft] =
    useState<GovernanceDraftPayload | null>(null);
  const [draftSummaries, setDraftSummaries] = useState<
    GovernanceDraftSummary[]
  >([]);
  const [saveStatus, setSaveStatus] = useState<
    "RESTORING" | "SAVED" | "SAVING" | "UNSAVED"
  >("RESTORING");
  const [draftMessage, setDraftMessage] = useState(
    "Checking for a saved Runtime route draft.",
  );
  const initializedRef = useRef(false);

  const activeSection =
    RUNTIME_EXECUTION_LANE.sections.find(
      (section) => section.sectionId === activeSectionId,
    ) ?? RUNTIME_EXECUTION_LANE.sections[0];

  useEffect(() => {
    const lastDraftId = window.localStorage.getItem(
      RUNTIME_DRAFT_ID_STORAGE_KEY,
    );

    const existingDraft =
      lastDraftId
        ? loadGovernanceDraft(
            RUNTIME_EXECUTION_LANE.laneId,
            lastDraftId,
          )
        : undefined;

    const nextDraft =
      existingDraft ??
      createGovernanceDraft({
        laneId: RUNTIME_EXECUTION_LANE.laneId,
        laneVersion: RUNTIME_EXECUTION_LANE.version,
        title: "Untitled Runtime route",
        values: buildInitialState(),
      });

    if (existingDraft) {
      setValues({
        ...buildInitialState(),
        ...existingDraft.values,
      });
      setDraftMessage(
        `Restored draft saved ${new Date(
          existingDraft.updatedAt,
        ).toLocaleString()}.`,
      );
    } else {
      const savedDraft = saveGovernanceDraft(nextDraft);
      window.localStorage.setItem(
        RUNTIME_DRAFT_ID_STORAGE_KEY,
        savedDraft.draftId,
      );
      setDraftMessage("New Runtime route draft created.");
    }

    setDraft(existingDraft ?? nextDraft);
    setDraftSummaries(
      listGovernanceDrafts(RUNTIME_EXECUTION_LANE.laneId),
    );
    setSaveStatus("SAVED");
    initializedRef.current = true;
  }, []);

  const readiness = useMemo(
    () => evaluateRouteReadiness(RUNTIME_EXECUTION_LANE, values),
    [values],
  );

  const completion = {
    completed: readiness.completedRequiredFields,
    total: readiness.totalRequiredFields,
    percentage: readiness.completionPercentage,
  };

  useEffect(() => {
    if (!initializedRef.current || !draft) {
      return;
    }

    setSaveStatus("SAVING");

    const timeoutId = window.setTimeout(() => {
      const titleValue = values.routeTitle;
      const title =
        typeof titleValue === "string" &&
        titleValue.trim().length > 0
          ? titleValue.trim()
          : "Untitled Runtime route";

      const savedDraft = saveGovernanceDraft({
        ...draft,
        title,
        lifecycleState:
          readiness.ready ? "READY_FOR_TEST" : "DRAFT",
        values,
      });

      setDraft(savedDraft);
      setDraftSummaries(
        listGovernanceDrafts(RUNTIME_EXECUTION_LANE.laneId),
      );
      window.localStorage.setItem(
        RUNTIME_DRAFT_ID_STORAGE_KEY,
        savedDraft.draftId,
      );
      setSaveStatus("SAVED");
      setDraftMessage(
        `Saved locally ${new Date(
          savedDraft.updatedAt,
        ).toLocaleTimeString()}.`,
      );
    }, 700);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [draft, readiness.ready, values]);

  function updateValue(key: string, value: JsonValue) {
    setValues((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function restoreDraft(draftId: string) {
    const restoredDraft = loadGovernanceDraft(
      RUNTIME_EXECUTION_LANE.laneId,
      draftId,
    );

    if (!restoredDraft) {
      setDraftMessage("That local draft could not be restored.");
      return;
    }

    setValues({
      ...buildInitialState(),
      ...restoredDraft.values,
    });
    setDraft(restoredDraft);
    setDraftMessage(
      `Restored "${restoredDraft.title}" from ${new Date(
        restoredDraft.updatedAt,
      ).toLocaleString()}.`,
    );
    setSaveStatus("SAVED");
    window.localStorage.setItem(
      RUNTIME_DRAFT_ID_STORAGE_KEY,
      restoredDraft.draftId,
    );
  }

  function startNewDraft() {
    const newDraft = saveGovernanceDraft(
      createGovernanceDraft({
        laneId: RUNTIME_EXECUTION_LANE.laneId,
        laneVersion: RUNTIME_EXECUTION_LANE.version,
        title: "Untitled Runtime route",
        values: buildInitialState(),
      }),
    );

    setValues(buildInitialState());
    setDraft(newDraft);
    setDraftSummaries(
      listGovernanceDrafts(RUNTIME_EXECUTION_LANE.laneId),
    );
    setDraftMessage("New local draft created.");
    setSaveStatus("SAVED");
    window.localStorage.setItem(
      RUNTIME_DRAFT_ID_STORAGE_KEY,
      newDraft.draftId,
    );
  }

  function exportCurrentDraft() {
    if (!draft) {
      return;
    }

    const titleValue = values.routeTitle;
    const safeTitle =
      typeof titleValue === "string" &&
      titleValue.trim().length > 0
        ? titleValue
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "")
        : "runtime-route";

    downloadTextFile(
      `${safeTitle || "runtime-route"}-draft.json`,
      exportGovernanceDraft({
        ...draft,
        values,
        lifecycleState:
          readiness.ready ? "READY_FOR_TEST" : "DRAFT",
      }),
    );

    setDraftMessage("Draft exported as JSON.");
  }

  function deleteCurrentDraft() {
    if (!draft) {
      return;
    }

    deleteGovernanceDraft(
      RUNTIME_EXECUTION_LANE.laneId,
      draft.draftId,
    );
    window.localStorage.removeItem(
      RUNTIME_DRAFT_ID_STORAGE_KEY,
    );
    startNewDraft();
    setDraftMessage(
      "Previous local draft deleted. A new blank draft was created.",
    );
  }

  function sendRouteToTesting() {
    if (!draft || !readiness.ready) {
      setDraftMessage(
        "Resolve all readiness issues before sending this route to testing.",
      );
      setShowPreview(true);
      return;
    }

    const titleValue = values.routeTitle;
    const title =
      typeof titleValue === "string" &&
      titleValue.trim().length > 0
        ? titleValue.trim()
        : "Untitled Runtime route";

    const savedDraft = saveGovernanceDraft({
      ...draft,
      title,
      lifecycleState: "READY_FOR_TEST",
      values: readiness.normalizedValues,
    });

    selectRuntimeDraftForTesting(savedDraft);
    setDraft(savedDraft);
    setSaveStatus("SAVED");
    setDraftMessage(
      `"${savedDraft.title}" is now the active route under test.`,
    );

    router.push(
      "/ai-governance/playground/runtime-execution/scenarios",
    );
  }

  function goToSection(direction: "previous" | "next") {
    const currentIndex =
      RUNTIME_EXECUTION_LANE.sections.findIndex(
        (section) => section.sectionId === activeSectionId,
      );

    const nextIndex =
      direction === "next"
        ? Math.min(
            currentIndex + 1,
            RUNTIME_EXECUTION_LANE.sections.length - 1,
          )
        : Math.max(currentIndex - 1, 0);

    const nextSection =
      RUNTIME_EXECUTION_LANE.sections[nextIndex];

    if (nextSection) {
      setActiveSectionId(nextSection.sectionId);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  if (!activeSection) {
    return null;
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto grid w-full max-w-7xl gap-6 px-5 py-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-8">
        <aside className="h-fit rounded-3xl border border-white/10 bg-white/[0.04] p-5 lg:sticky lg:top-6">
          <Link
            href="/ai-governance/playground/runtime-execution"
            className="text-sm font-semibold text-cyan-300 transition hover:text-cyan-200"
          >
            ← Runtime Playground
          </Link>

          <h1 className="mt-5 text-2xl font-black">
            Build a Runtime Route
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-400">
            Complete the route from identity through replay. Required
            fields are evaluated before testing can begin.
          </p>

          <div className="mt-6 rounded-2xl border border-cyan-300/15 bg-cyan-300/[0.04] p-4">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-200">
                Local draft
              </span>
              <span className="text-xs font-semibold text-slate-400">
                {saveStatus === "SAVING"
                  ? "Saving..."
                  : saveStatus === "RESTORING"
                    ? "Restoring..."
                    : "Saved"}
              </span>
            </div>
            <p className="mt-2 text-xs leading-5 text-slate-500">
              {draftMessage}
            </p>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={startNewDraft}
                className="rounded-lg border border-white/10 px-3 py-2 text-xs font-bold text-slate-200 transition hover:border-cyan-300/40"
              >
                New Draft
              </button>
              <button
                type="button"
                onClick={exportCurrentDraft}
                disabled={!draft}
                className="rounded-lg border border-white/10 px-3 py-2 text-xs font-bold text-slate-200 transition hover:border-cyan-300/40 disabled:opacity-40"
              >
                Export JSON
              </button>
            </div>

            {draftSummaries.length > 1 ? (
              <select
                value={draft?.draftId ?? ""}
                onChange={(event) =>
                  restoreDraft(event.target.value)
                }
                className="mt-3 w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-xs text-slate-200 outline-none focus:border-cyan-300/50"
              >
                {draftSummaries.map((summary) => (
                  <option
                    key={summary.draftId}
                    value={summary.draftId}
                  >
                    {summary.title} ·{" "}
                    {new Date(
                      summary.updatedAt,
                    ).toLocaleDateString()}
                  </option>
                ))}
              </select>
            ) : null}

            <button
              type="button"
              onClick={deleteCurrentDraft}
              disabled={!draft}
              className="mt-3 w-full rounded-lg border border-rose-300/15 px-3 py-2 text-xs font-bold text-rose-200 transition hover:border-rose-300/40 hover:bg-rose-300/[0.05] disabled:opacity-40"
            >
              Delete Current Draft
            </button>

            <p className="mt-3 text-[11px] leading-5 text-slate-600">
              Local drafts are editable browser data. They are not
              governed records, evidence, determinations, or proof of
              execution.
            </p>
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-slate-900/70 p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-slate-300">
                Required intake
              </span>
              <span className="font-black text-cyan-300">
                {completion.percentage}%
              </span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-cyan-300 transition-all"
                style={{ width: `${completion.percentage}%` }}
              />
            </div>
            <p className="mt-3 text-xs text-slate-500">
              {completion.completed} of {completion.total} required
              fields complete
            </p>
          </div>

          <nav className="mt-6 space-y-2">
            {RUNTIME_EXECUTION_LANE.sections.map((section) => {
              const sectionFields = section.fields.filter((field) =>
                fieldIsVisible(field, values),
              );
              const requiredFields = sectionFields.filter(
                (field) => field.required,
              );
              const completeCount = requiredFields.filter((field) =>
                fieldIsComplete(field, values),
              ).length;
              const isActive =
                section.sectionId === activeSection.sectionId;

              return (
                <button
                  key={section.sectionId}
                  type="button"
                  onClick={() =>
                    setActiveSectionId(section.sectionId)
                  }
                  className={`w-full rounded-2xl border p-3 text-left transition ${
                    isActive
                      ? "border-cyan-300/50 bg-cyan-300/10"
                      : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span
                      className={`text-sm font-bold ${
                        isActive
                          ? "text-cyan-100"
                          : "text-slate-300"
                      }`}
                    >
                      {section.title}
                    </span>
                    <span className="text-xs text-slate-500">
                      {completeCount}/{requiredFields.length}
                    </span>
                  </div>
                </button>
              );
            })}
          </nav>

          <button
            type="button"
            onClick={() => setShowPreview((current) => !current)}
            className="mt-6 w-full rounded-xl border border-white/15 px-4 py-3 text-sm font-bold transition hover:border-cyan-300/50 hover:bg-cyan-300/5"
          >
            {showPreview ? "Hide Route Preview" : "Preview Route Data"}
          </button>
        </aside>

        <section className="min-w-0">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 md:p-9">
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
                  Section {activeSection.order / 10} of{" "}
                  {RUNTIME_EXECUTION_LANE.sections.length}
                </p>
                <h2 className="mt-3 text-3xl font-black md:text-4xl">
                  {activeSection.title}
                </h2>
                <p className="mt-4 max-w-3xl leading-7 text-slate-400">
                  {activeSection.description}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-slate-400">
                Version {RUNTIME_EXECUTION_LANE.version}
              </div>
            </div>

            <div className="mt-8 space-y-6">
              {activeSection.fields
                .filter((field) => fieldIsVisible(field, values))
                .map((field) => (
                  <FieldControl
                    key={field.key}
                    field={field}
                    value={values[field.key]}
                    onChange={(value) =>
                      updateValue(field.key, value)
                    }
                  />
                ))}
            </div>

            <div className="mt-10 flex flex-col-reverse gap-3 border-t border-white/10 pt-6 sm:flex-row sm:justify-between">
              <button
                type="button"
                onClick={() => goToSection("previous")}
                disabled={
                  activeSection.sectionId ===
                  RUNTIME_EXECUTION_LANE.sections[0]?.sectionId
                }
                className="rounded-xl border border-white/15 px-5 py-3 font-bold transition hover:border-white/30 disabled:cursor-not-allowed disabled:opacity-35"
              >
                Previous Section
              </button>

              {activeSection.sectionId ===
              RUNTIME_EXECUTION_LANE.sections.at(-1)?.sectionId ? (
                <button
                  type="button"
                  onClick={() => setShowPreview(true)}
                  className="rounded-xl bg-cyan-300 px-6 py-3 font-black text-slate-950 transition hover:bg-cyan-200"
                >
                  Review Route
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => goToSection("next")}
                  className="rounded-xl bg-cyan-300 px-6 py-3 font-black text-slate-950 transition hover:bg-cyan-200"
                >
                  Next Section
                </button>
              )}
            </div>
          </div>

          {showPreview ? (
            <div className="mt-6 rounded-3xl border border-cyan-300/20 bg-cyan-300/[0.05] p-6 md:p-8">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
                    Route preview
                  </p>
                  <h2 className="mt-2 text-2xl font-black">
                    Current configuration
                  </h2>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={sendRouteToTesting}
                    disabled={!readiness.ready || !draft}
                    className="rounded-xl bg-cyan-300 px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Send Route to Testing
                  </button>

                  <span
                  className={`rounded-full border px-4 py-2 text-sm font-bold ${
                    readiness.ready
                      ? "border-emerald-300/30 bg-emerald-300/10 text-emerald-200"
                      : readiness.status === "INVALID"
                        ? "border-rose-300/30 bg-rose-300/10 text-rose-200"
                        : "border-amber-300/30 bg-amber-300/10 text-amber-200"
                  }`}
                >
                  {readiness.ready
                    ? "Ready for testing"
                    : readiness.status === "INVALID"
                      ? "Validation errors"
                      : "Intake incomplete"}
                  </span>
                </div>
              </div>

              {readiness.issues.length > 0 ? (
                <div className="mt-6 rounded-2xl border border-rose-300/20 bg-rose-300/[0.05] p-5">
                  <h3 className="text-sm font-black uppercase tracking-[0.16em] text-rose-200">
                    Readiness issues
                  </h3>
                  <div className="mt-4 space-y-3">
                    {readiness.issues.map((item, index) => (
                      <button
                        key={`${item.fieldKey}-${item.code}-${index}`}
                        type="button"
                        onClick={() => {
                          const section =
                            RUNTIME_EXECUTION_LANE.sections.find(
                              (candidate) =>
                                candidate.sectionId ===
                                item.sectionId,
                            );

                          if (section) {
                            setActiveSectionId(section.sectionId);
                            window.scrollTo({
                              top: 0,
                              behavior: "smooth",
                            });
                          }
                        }}
                        className="block w-full rounded-xl border border-white/10 bg-slate-950/70 p-4 text-left transition hover:border-rose-300/30"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <span className="text-sm font-bold text-slate-200">
                            {item.message}
                          </span>
                          <span className="rounded-full border border-white/10 px-2.5 py-1 text-[10px] font-bold text-slate-500">
                            {item.code.replaceAll("_", " ")}
                          </span>
                        </div>
                        <p className="mt-2 text-xs text-slate-600">
                          Field: {item.fieldKey}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              <pre className="mt-6 max-h-[34rem] overflow-auto rounded-2xl border border-white/10 bg-slate-950 p-5 text-xs leading-6 text-slate-300">
                {JSON.stringify(
                  {
                    laneId: RUNTIME_EXECUTION_LANE.laneId,
                    laneVersion: RUNTIME_EXECUTION_LANE.version,
                    lifecycleState: readiness.ready
                      ? "READY_FOR_TEST"
                      : "DRAFT",
                    readiness: {
                      status: readiness.status,
                      completionPercentage:
                        readiness.completionPercentage,
                      issueCount: readiness.issues.length,
                    },
                    values: readiness.normalizedValues,
                  },
                  null,
                  2,
                )}
              </pre>

              <div className="mt-5 rounded-2xl border border-white/10 bg-slate-900/60 p-4 text-sm leading-6 text-slate-400">
                Draft persistence and structural readiness validation are
                active. Evidence upload, gate evaluation, scenario execution,
                and governed-record preservation remain separate later stages.
              </div>
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}

function FieldControl({
  field,
  value,
  onChange,
}: {
  field: PlaygroundFieldDefinition;
  value: JsonValue;
  onChange: (value: JsonValue) => void;
}) {
  const baseInputClass =
    "mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/10";

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <label
          htmlFor={field.key}
          className="text-sm font-bold text-slate-200"
        >
          {field.label}
        </label>
        {field.required ? (
          <span className="rounded-full border border-cyan-300/20 bg-cyan-300/[0.06] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-cyan-200">
            Required
          </span>
        ) : (
          <span className="text-xs text-slate-600">Optional</span>
        )}
      </div>

      {field.description ? (
        <p className="mt-1 text-sm leading-6 text-slate-500">
          {field.description}
        </p>
      ) : null}

      {field.type === "textarea" ? (
        <textarea
          id={field.key}
          value={String(value ?? "")}
          onChange={(event) => onChange(event.target.value)}
          placeholder={field.placeholder}
          rows={5}
          className={baseInputClass}
        />
      ) : field.type === "select" ? (
        <select
          id={field.key}
          value={String(value ?? "")}
          onChange={(event) => onChange(event.target.value)}
          className={baseInputClass}
        >
          <option value="">Select an option</option>
          {field.options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : field.type === "multiselect" ? (
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {field.options?.map((option) => {
            const selectedValues = Array.isArray(value)
              ? value.map(String)
              : [];
            const checked = selectedValues.includes(option.value);

            return (
              <label
                key={option.value}
                className={`cursor-pointer rounded-xl border p-4 transition ${
                  checked
                    ? "border-cyan-300/50 bg-cyan-300/10"
                    : "border-white/10 bg-slate-950 hover:border-white/20"
                }`}
              >
                <div className="flex gap-3">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => {
                      const nextValues = checked
                        ? selectedValues.filter(
                            (item) => item !== option.value,
                          )
                        : [...selectedValues, option.value];

                      onChange(nextValues);
                    }}
                    className="mt-1 h-4 w-4 accent-cyan-300"
                  />
                  <div>
                    <span className="text-sm font-bold text-slate-200">
                      {option.label}
                    </span>
                    {option.description ? (
                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        {option.description}
                      </p>
                    ) : null}
                  </div>
                </div>
              </label>
            );
          })}
        </div>
      ) : field.type === "boolean" ? (
        <button
          id={field.key}
          type="button"
          onClick={() => onChange(!Boolean(value))}
          className={`mt-3 flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition ${
            Boolean(value)
              ? "border-cyan-300/50 bg-cyan-300/10"
              : "border-white/10 bg-slate-950"
          }`}
        >
          <span className="font-semibold text-slate-200">
            {Boolean(value) ? "Yes" : "No"}
          </span>
          <span
            className={`h-6 w-11 rounded-full p-1 transition ${
              Boolean(value) ? "bg-cyan-300" : "bg-slate-700"
            }`}
          >
            <span
              className={`block h-4 w-4 rounded-full bg-slate-950 transition ${
                Boolean(value) ? "translate-x-5" : ""
              }`}
            />
          </span>
        </button>
      ) : field.type === "json" ? (
        <textarea
          id={field.key}
          value={String(value ?? "")}
          onChange={(event) => onChange(event.target.value)}
          placeholder={field.placeholder}
          rows={6}
          spellCheck={false}
          className={`${baseInputClass} font-mono text-sm`}
        />
      ) : (
        <input
          id={field.key}
          type={
            field.type === "number"
              ? "number"
              : field.type === "date"
                ? "date"
                : field.type === "datetime"
                  ? "datetime-local"
                  : field.type === "email"
                    ? "email"
                    : field.type === "url"
                      ? "url"
                      : "text"
          }
          value={
            typeof value === "number"
              ? value
              : String(value ?? "")
          }
          onChange={(event) =>
            onChange(
              field.type === "number"
                ? event.target.value === ""
                  ? null
                  : Number(event.target.value)
                : event.target.value,
            )
          }
          placeholder={field.placeholder}
          min={field.validation?.minimum}
          max={field.validation?.maximum}
          minLength={field.validation?.minLength}
          maxLength={field.validation?.maxLength}
          pattern={field.validation?.pattern}
          className={baseInputClass}
        />
      )}
    </div>
  );
}
