"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import {
  RUNTIME_EXECUTION_LANE,
  SHARED_GATE_DEFINITIONS,
  createRuntimeEvidenceAttachment,
  deleteRuntimeEvidenceAttachment,
  listRuntimeEvidenceAttachments,
  loadRuntimeEvidenceAttachment,
  loadRuntimeTestSession,
  saveRuntimeEvidenceAttachment,
  type EvidenceRelationship,
  type EvidenceSourceType,
  type EvidenceStatus,
  type EvidenceVisibility,
  type RuntimeEvidenceAttachment,
  type RuntimeEvidenceSummary,
  type RuntimeTestSession,
} from "../../../../../lib/governance-playgrounds";

type EvidenceFormState = {
  title: string;
  description: string;
  gateId: string;
  relationship: EvidenceRelationship;
  sourceType: EvidenceSourceType;
  sourceUrl: string;
  fileName: string;
  mediaType: string;
  contentText: string;
  contentHash: string;
  status: EvidenceStatus;
  visibility: EvidenceVisibility;
};

const initialForm: EvidenceFormState = {
  title: "",
  description: "",
  gateId: "",
  relationship: "SUPPORTING",
  sourceType: "TEXT",
  sourceUrl: "",
  fileName: "",
  mediaType: "",
  contentText: "",
  contentHash: "",
  status: "UPLOADED",
  visibility: "OWNER_ONLY",
};

const relationshipOptions: readonly EvidenceRelationship[] = [
  "SUPPORTING",
  "CONFLICTING",
  "CONTEXT_ONLY",
];

const sourceTypeOptions: readonly EvidenceSourceType[] = [
  "TEXT",
  "URL",
  "FILE",
  "SYSTEM_RECORD",
  "EXTERNAL_RECORD",
];

const statusOptions: readonly EvidenceStatus[] = [
  "DECLARED",
  "UPLOADED",
  "LINKED",
  "VERIFIED",
  "CONFLICTED",
  "UNAVAILABLE",
  "EXPIRED",
  "REVOKED",
];

const visibilityOptions: readonly EvidenceVisibility[] = [
  "OWNER_ONLY",
  "AUTHORIZED_REVIEWERS",
  "SELECTIVE",
  "PUBLIC",
];

function relationshipClass(
  relationship: EvidenceRelationship,
): string {
  switch (relationship) {
    case "SUPPORTING":
      return "border-emerald-300/30 bg-emerald-300/10 text-emerald-200";
    case "CONFLICTING":
      return "border-rose-300/30 bg-rose-300/10 text-rose-200";
    case "CONTEXT_ONLY":
      return "border-sky-300/30 bg-sky-300/10 text-sky-200";
  }
}

export default function RuntimeEvidenceWorkspacePage() {
  const [testSession, setTestSession] =
    useState<RuntimeTestSession | null>(null);
  const [attachments, setAttachments] = useState<
    RuntimeEvidenceSummary[]
  >([]);
  const [selectedAttachmentId, setSelectedAttachmentId] =
    useState("");
  const [selectedAttachment, setSelectedAttachment] =
    useState<RuntimeEvidenceAttachment | null>(null);
  const [form, setForm] =
    useState<EvidenceFormState>(initialForm);
  const [message, setMessage] = useState(
    "Loading the active Runtime route and its evidence candidates.",
  );

  function refreshAttachments(
    session: RuntimeTestSession | null = testSession,
    preferredAttachmentId?: string,
  ) {
    const nextAttachments = listRuntimeEvidenceAttachments(
      RUNTIME_EXECUTION_LANE.laneId,
      session
        ? {
            routeDraftId: session.routeDraftId,
            testSessionId: session.sessionId,
          }
        : {},
    );

    setAttachments(nextAttachments);

    const nextSelectedId =
      preferredAttachmentId ??
      (nextAttachments.some(
        (item) =>
          item.attachmentId === selectedAttachmentId,
      )
        ? selectedAttachmentId
        : nextAttachments[0]?.attachmentId ?? "");

    setSelectedAttachmentId(nextSelectedId);
    setSelectedAttachment(
      nextSelectedId
        ? loadRuntimeEvidenceAttachment(
            RUNTIME_EXECUTION_LANE.laneId,
            nextSelectedId,
          ) ?? null
        : null,
    );

    setMessage(
      nextAttachments.length > 0
        ? `${nextAttachments.length} evidence candidate${
            nextAttachments.length === 1 ? "" : "s"
          } attached to this testing context.`
        : "No evidence candidates are attached to this testing context.",
    );
  }

  useEffect(() => {
    const session = loadRuntimeTestSession() ?? null;
    setTestSession(session);
    refreshAttachments(session);
    // Browser-local hydration intentionally runs once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const supportingCount = attachments.filter(
    (item) => item.relationship === "SUPPORTING",
  ).length;

  const conflictingCount = attachments.filter(
    (item) => item.relationship === "CONFLICTING",
  ).length;

  const gateBoundCount = attachments.filter(
    (item) => Boolean(item.gateId),
  ).length;

  const canAttach = useMemo(
    () =>
      Boolean(
        testSession &&
          form.title.trim() &&
          (form.sourceType !== "URL" ||
            form.sourceUrl.trim()) &&
          (form.sourceType !== "TEXT" ||
            form.contentText.trim()) &&
          (form.sourceType !== "FILE" ||
            form.fileName.trim()),
      ),
    [form, testSession],
  );

  function updateForm<K extends keyof EvidenceFormState>(
    key: K,
    value: EvidenceFormState[K],
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function attachEvidenceCandidate() {
    if (!testSession || !canAttach) {
      setMessage(
        "Select an active Runtime route and complete the required evidence fields.",
      );
      return;
    }

    const attachment = saveRuntimeEvidenceAttachment(
      createRuntimeEvidenceAttachment({
        laneId: RUNTIME_EXECUTION_LANE.laneId,
        routeDraftId: testSession.routeDraftId,
        testSessionId: testSession.sessionId,
        gateId: form.gateId || undefined,
        relationship: form.relationship,
        sourceType: form.sourceType,
        title: form.title.trim(),
        description:
          form.description.trim() || undefined,
        sourceUrl: form.sourceUrl.trim() || undefined,
        fileName: form.fileName.trim() || undefined,
        mediaType: form.mediaType.trim() || undefined,
        contentText: form.contentText.trim() || undefined,
        contentHash: form.contentHash.trim() || undefined,
        status: form.status,
        visibility: form.visibility,
        metadata: {
          sourceWorkspace:
            "runtime-evidence-workspace",
          admissibilityClaim: false,
        },
      }),
    );

    setForm(initialForm);
    refreshAttachments(testSession, attachment.attachmentId);
    setMessage(
      `"${attachment.title}" attached as an evidence candidate. No admissibility determination was made.`,
    );
  }

  function selectAttachment(attachmentId: string) {
    setSelectedAttachmentId(attachmentId);
    setSelectedAttachment(
      loadRuntimeEvidenceAttachment(
        RUNTIME_EXECUTION_LANE.laneId,
        attachmentId,
      ) ?? null,
    );
  }

  function deleteSelectedAttachment() {
    if (!selectedAttachment) {
      return;
    }

    deleteRuntimeEvidenceAttachment(
      RUNTIME_EXECUTION_LANE.laneId,
      selectedAttachment.attachmentId,
    );

    refreshAttachments(testSession);
    setMessage(
      "The selected local evidence candidate was deleted. No governed record was affected.",
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
              Runtime Evidence Workspace
            </h1>
            <p className="mt-3 max-w-3xl leading-7 text-slate-400">
              Attach evidence candidates to the active route and
              specific gates before scenario evaluation.
            </p>
          </div>

          <Link
            href="/ai-governance/playground/runtime-execution/scenarios"
            className="rounded-xl bg-cyan-300 px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-cyan-200"
          >
            Open Scenario Runner
          </Link>
        </div>

        <section className="rounded-3xl border border-cyan-300/20 bg-cyan-300/[0.05] p-5 md:p-6">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-300">
            Active testing context
          </p>

          {testSession ? (
            <div className="mt-3 flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <h2 className="text-2xl font-black">
                  {testSession.routeTitle}
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  Draft {testSession.routeDraftId} · Session{" "}
                  {testSession.sessionId}
                </p>
              </div>
              <span className="rounded-full border border-emerald-300/30 bg-emerald-300/10 px-4 py-2 text-sm font-black text-emerald-200">
                ROUTE LINKED
              </span>
            </div>
          ) : (
            <div className="mt-4 flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <p className="max-w-2xl leading-7 text-slate-500">
                No Runtime route is active. Build a ready route and
                send it to testing before attaching route-bound
                evidence candidates.
              </p>
              <Link
                href="/ai-governance/playground/runtime-execution/new"
                className="rounded-xl border border-cyan-300/30 px-5 py-3 text-sm font-bold text-cyan-100 transition hover:border-cyan-300/60"
              >
                Build and Select Route
              </Link>
            </div>
          )}
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-3">
          <Metric
            label="Supporting"
            value={supportingCount}
          />
          <Metric
            label="Conflicting"
            value={conflictingCount}
          />
          <Metric
            label="Gate-bound"
            value={gateBoundCount}
          />
        </section>

        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_390px]">
          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 md:p-8">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-300">
              Attach evidence candidate
            </p>
            <h2 className="mt-3 text-2xl font-black">
              Describe what is being offered
            </h2>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <Field label="Title">
                <input
                  value={form.title}
                  onChange={(event) =>
                    updateForm("title", event.target.value)
                  }
                  className="input"
                  placeholder="Authority record, execution log, policy text..."
                />
              </Field>

              <Field label="Gate">
                <select
                  value={form.gateId}
                  onChange={(event) =>
                    updateForm("gateId", event.target.value)
                  }
                  className="input"
                >
                  <option value="">Route-level evidence</option>
                  {SHARED_GATE_DEFINITIONS.map((gate) => (
                    <option
                      key={gate.gateId}
                      value={gate.gateId}
                    >
                      {gate.gateId} — {gate.title}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Relationship">
                <select
                  value={form.relationship}
                  onChange={(event) =>
                    updateForm(
                      "relationship",
                      event.target
                        .value as EvidenceRelationship,
                    )
                  }
                  className="input"
                >
                  {relationshipOptions.map((option) => (
                    <option key={option} value={option}>
                      {option.replaceAll("_", " ")}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Source type">
                <select
                  value={form.sourceType}
                  onChange={(event) =>
                    updateForm(
                      "sourceType",
                      event.target.value as EvidenceSourceType,
                    )
                  }
                  className="input"
                >
                  {sourceTypeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option.replaceAll("_", " ")}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Status">
                <select
                  value={form.status}
                  onChange={(event) =>
                    updateForm(
                      "status",
                      event.target.value as EvidenceStatus,
                    )
                  }
                  className="input"
                >
                  {statusOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Visibility">
                <select
                  value={form.visibility}
                  onChange={(event) =>
                    updateForm(
                      "visibility",
                      event.target
                        .value as EvidenceVisibility,
                    )
                  }
                  className="input"
                >
                  {visibilityOptions.map((option) => (
                    <option key={option} value={option}>
                      {option.replaceAll("_", " ")}
                    </option>
                  ))}
                </select>
              </Field>

              {form.sourceType === "URL" ? (
                <Field label="Source URL">
                  <input
                    value={form.sourceUrl}
                    onChange={(event) =>
                      updateForm(
                        "sourceUrl",
                        event.target.value,
                      )
                    }
                    className="input"
                    placeholder="https://..."
                  />
                </Field>
              ) : null}

              {form.sourceType === "FILE" ? (
                <>
                  <Field label="File name">
                    <input
                      value={form.fileName}
                      onChange={(event) =>
                        updateForm(
                          "fileName",
                          event.target.value,
                        )
                      }
                      className="input"
                      placeholder="execution-log.json"
                    />
                  </Field>
                  <Field label="Media type">
                    <input
                      value={form.mediaType}
                      onChange={(event) =>
                        updateForm(
                          "mediaType",
                          event.target.value,
                        )
                      }
                      className="input"
                      placeholder="application/json"
                    />
                  </Field>
                </>
              ) : null}

              <Field label="Content hash">
                <input
                  value={form.contentHash}
                  onChange={(event) =>
                    updateForm(
                      "contentHash",
                      event.target.value,
                    )
                  }
                  className="input"
                  placeholder="Optional SHA-256 or equivalent"
                />
              </Field>

              <div className="md:col-span-2">
                <Field label="Description">
                  <textarea
                    value={form.description}
                    onChange={(event) =>
                      updateForm(
                        "description",
                        event.target.value,
                      )
                    }
                    className="input min-h-28"
                    placeholder="What does this candidate claim to establish?"
                  />
                </Field>
              </div>

              {form.sourceType === "TEXT" ||
              form.sourceType === "SYSTEM_RECORD" ||
              form.sourceType === "EXTERNAL_RECORD" ? (
                <div className="md:col-span-2">
                  <Field label="Evidence text or record excerpt">
                    <textarea
                      value={form.contentText}
                      onChange={(event) =>
                        updateForm(
                          "contentText",
                          event.target.value,
                        )
                      }
                      className="input min-h-40 font-mono text-xs"
                      placeholder="Paste the bounded record, declaration, or relevant excerpt."
                    />
                  </Field>
                </div>
              ) : null}
            </div>

            <button
              type="button"
              onClick={attachEvidenceCandidate}
              disabled={!canAttach}
              className="mt-6 rounded-xl bg-cyan-300 px-6 py-3 font-black text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Attach Evidence Candidate
            </button>

            <p className="mt-4 text-xs leading-6 text-slate-600">
              Attachment establishes only that material was offered
              for consideration. It does not establish authenticity,
              continuity, sufficiency, admissibility, or execution.
            </p>
          </section>

          <aside className="h-fit rounded-3xl border border-white/10 bg-white/[0.04] p-5 xl:sticky xl:top-6">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-300">
              Attached candidates
            </p>
            <p className="mt-2 text-xs leading-5 text-slate-600">
              {message}
            </p>

            <div className="mt-5 max-h-[55vh] space-y-2 overflow-y-auto pr-1">
              {attachments.map((attachment) => (
                <button
                  key={attachment.attachmentId}
                  type="button"
                  onClick={() =>
                    selectAttachment(
                      attachment.attachmentId,
                    )
                  }
                  className={`w-full rounded-2xl border p-4 text-left transition ${
                    selectedAttachmentId ===
                    attachment.attachmentId
                      ? "border-cyan-300/50 bg-cyan-300/[0.08]"
                      : "border-white/10 bg-slate-950/60 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-sm font-bold leading-5 text-slate-200">
                      {attachment.title}
                    </span>
                    <span
                      className={`rounded-full border px-2 py-1 text-[9px] font-black ${relationshipClass(
                        attachment.relationship,
                      )}`}
                    >
                      {attachment.relationship.replaceAll(
                        "_",
                        " ",
                      )}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-slate-500">
                    {attachment.gateId ??
                      "ROUTE LEVEL"}{" "}
                    · {attachment.status}
                  </p>
                </button>
              ))}

              {attachments.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/10 p-5 text-sm leading-6 text-slate-600">
                  No evidence candidates have been attached.
                </div>
              ) : null}
            </div>

            {selectedAttachment ? (
              <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                <p className="font-bold text-slate-200">
                  {selectedAttachment.title}
                </p>
                <p className="mt-2 text-xs leading-5 text-slate-500">
                  {selectedAttachment.description ??
                    "No description supplied."}
                </p>
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  <Detail
                    label="Source"
                    value={selectedAttachment.sourceType}
                  />
                  <Detail
                    label="Visibility"
                    value={selectedAttachment.visibility}
                  />
                  <Detail
                    label="Status"
                    value={selectedAttachment.status}
                  />
                  <Detail
                    label="Gate"
                    value={
                      selectedAttachment.gateId ??
                      "ROUTE LEVEL"
                    }
                  />
                </div>

                <button
                  type="button"
                  onClick={deleteSelectedAttachment}
                  className="mt-4 w-full rounded-xl border border-rose-300/25 px-4 py-2 text-xs font-bold text-rose-200 transition hover:border-rose-300/50"
                >
                  Delete Candidate
                </button>
              </div>
            ) : null}
          </aside>
        </div>
      </div>

      <style jsx>{`
        .input {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid rgb(255 255 255 / 0.1);
          background: rgb(2 6 23 / 0.85);
          padding: 0.75rem 1rem;
          color: white;
          outline: none;
        }

        .input:focus {
          border-color: rgb(103 232 249 / 0.5);
        }
      `}</style>
    </main>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-slate-500">
        {label}
      </span>
      {children}
    </label>
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
    <div className="rounded-xl border border-white/10 p-3">
      <p className="text-[9px] font-black uppercase tracking-[0.12em] text-slate-700">
        {label}
      </p>
      <p className="mt-1 break-words font-bold text-slate-300">
        {value}
      </p>
    </div>
  );
}
