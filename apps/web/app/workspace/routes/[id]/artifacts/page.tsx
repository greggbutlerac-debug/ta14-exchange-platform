"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import type { StoredRoute } from "../../../../../lib/route-library";
import { getSupabaseRoute } from "../../../../../lib/supabase-route-library";
import {
  CANONICAL_ROUTE_STAGES,
  ROUTE_ARTIFACT_TYPES,
  createSupabaseRouteArtifact,
  deleteSupabaseRouteArtifact,
  listSupabaseRouteArtifacts,
  updateSupabaseRouteArtifact,
  type CanonicalRouteStage,
  type RouteArtifact,
  type RouteArtifactType,
} from "../../../../../lib/supabase-route-artifacts";
import {
  openRouteArtifactFile,
  removeRouteArtifactFile,
  uploadRouteArtifactFile,
} from "../../../../../lib/route-artifact-storage";
import {
  createUnverifiedArtifactResult,
  listLatestArtifactVerificationReceipts,
  verifyRouteArtifactFile,
  type ArtifactVerificationResult,
} from "../../../../../lib/route-artifact-verification";
import {
  createRouteVerificationReceipt,
  getLatestRouteVerificationReceipt,
  type RouteVerificationReceipt,
} from "../../../../../lib/route-verification-receipts";
import {
  verifyRouteVerificationReceipt,
  type RouteReceiptVerificationResult,
} from "../../../../../lib/route-verification-receipt-validator";

type StageReadiness = {
  stage: CanonicalRouteStage;
  artifactCount: number;
  hasVerifiedIntegrity: boolean;
  hasRequirementBinding: boolean;
  hasStructuredRecord: boolean;
  score: number;
  maximumScore: number;
  status: "COMPLETE" | "INCOMPLETE" | "MISSING";
};

type RouteReadiness = {
  stages: StageReadiness[];
  score: number;
  maximumScore: number;
  percentage: number;
  status: "READY_FOR_REVIEW" | "NEEDS_EVIDENCE" | "NOT_READY";
};

function hasStructuredArtifactJson(artifact: RouteArtifact): boolean {
  return Object.keys(artifact.artifactJson ?? {}).length > 0;
}

function calculateRouteReadiness(
  artifacts: RouteArtifact[],
  verificationResults: Record<string, ArtifactVerificationResult>,
): RouteReadiness {
  const stages = CANONICAL_ROUTE_STAGES.map((stage) => {
    const stageArtifacts = artifacts.filter(
      (artifact) => artifact.canonicalStage === stage,
    );

    if (stageArtifacts.length === 0) {
      return {
        stage,
        artifactCount: 0,
        hasVerifiedIntegrity: false,
        hasRequirementBinding: false,
        hasStructuredRecord: false,
        score: 0,
        maximumScore: 4,
        status: "MISSING" as const,
      };
    }

    const hasVerifiedIntegrity = stageArtifacts.some(
      (artifact) => verificationResults[artifact.id]?.status === "VERIFIED",
    );
    const hasRequirementBinding = stageArtifacts.some((artifact) =>
      Boolean(artifact.requirementKey),
    );
    const hasStructuredRecord = stageArtifacts.some(hasStructuredArtifactJson);

    const score =
      1 +
      Number(hasVerifiedIntegrity) +
      Number(hasRequirementBinding) +
      Number(hasStructuredRecord);

    return {
      stage,
      artifactCount: stageArtifacts.length,
      hasVerifiedIntegrity,
      hasRequirementBinding,
      hasStructuredRecord,
      score,
      maximumScore: 4,
      status: score === 4 ? ("COMPLETE" as const) : ("INCOMPLETE" as const),
    };
  });

  const score = stages.reduce((total, stage) => total + stage.score, 0);
  const maximumScore = stages.reduce(
    (total, stage) => total + stage.maximumScore,
    0,
  );
  const percentage =
    maximumScore === 0 ? 0 : Math.round((score / maximumScore) * 100);

  const allStagesPresent = stages.every((stage) => stage.artifactCount > 0);
  const allStagesComplete = stages.every(
    (stage) => stage.status === "COMPLETE",
  );

  return {
    stages,
    score,
    maximumScore,
    percentage,
    status: allStagesComplete
      ? "READY_FOR_REVIEW"
      : allStagesPresent
        ? "NEEDS_EVIDENCE"
        : "NOT_READY",
  };
}

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function formatBytes(value: number | null): string {
  if (value === null) {
    return "Not recorded";
  }

  if (value < 1024) {
    return `${value} B`;
  }

  if (value < 1024 * 1024) {
    return `${(value / 1024).toFixed(1)} KB`;
  }

  return `${(value / (1024 * 1024)).toFixed(1)} MB`;
}

function getErrorMessage(error: unknown, fallbackMessage: string): string {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return fallbackMessage;
}

export default function RouteArtifactsPage() {
  const params = useParams<{ id: string }>();
  const routeRecordId = typeof params.id === "string" ? params.id : "";

  const [route, setRoute] = useState<StoredRoute | null>(null);
  const [artifacts, setArtifacts] = useState<RouteArtifact[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [editorOpen, setEditorOpen] = useState(false);
  const [savingArtifact, setSavingArtifact] = useState(false);
  const [editorMessage, setEditorMessage] = useState("");
  const [artifactType, setArtifactType] =
    useState<RouteArtifactType>("EVIDENCE");
  const [canonicalStage, setCanonicalStage] =
    useState<CanonicalRouteStage>("RECORD");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [requirementKey, setRequirementKey] = useState("");
  const [sha256, setSha256] = useState("");
  const [artifactJsonText, setArtifactJsonText] = useState("{}");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [openingArtifactId, setOpeningArtifactId] = useState<string | null>(
    null,
  );
  const [editingArtifactId, setEditingArtifactId] = useState<string | null>(
    null,
  );
  const [deletingArtifactId, setDeletingArtifactId] = useState<string | null>(
    null,
  );
  const [deleteErrorMessage, setDeleteErrorMessage] = useState("");
  const [verificationResults, setVerificationResults] = useState<
    Record<string, ArtifactVerificationResult>
  >({});
  const [verifyingArtifactId, setVerifyingArtifactId] = useState<string | null>(
    null,
  );
  const [verifyingAll, setVerifyingAll] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState("");
  const [latestRouteReceipt, setLatestRouteReceipt] =
    useState<RouteVerificationReceipt | null>(null);
  const [preservingRouteReceipt, setPreservingRouteReceipt] = useState(false);
  const [routeReceiptMessage, setRouteReceiptMessage] = useState("");
  const [routeReceiptVerification, setRouteReceiptVerification] =
    useState<RouteReceiptVerificationResult | null>(null);
  const [verifyingRouteReceipt, setVerifyingRouteReceipt] = useState(false);
  const [routeReceiptVerificationMessage, setRouteReceiptVerificationMessage] =
    useState("");

  const readiness = useMemo(
    () => calculateRouteReadiness(artifacts, verificationResults),
    [artifacts, verificationResults],
  );

  const loadWorkspace = useCallback(async (): Promise<void> => {
    if (!routeRecordId) {
      setErrorMessage("The route record ID is missing.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const [
        storedRoute,
        storedArtifacts,
        storedVerifications,
        storedRouteReceipt,
      ] = await Promise.all([
        getSupabaseRoute(routeRecordId),
        listSupabaseRouteArtifacts(routeRecordId),
        listLatestArtifactVerificationReceipts(routeRecordId),
        getLatestRouteVerificationReceipt(routeRecordId),
      ]);

      if (!storedRoute) {
        throw new Error(
          "The authenticated route could not be found or access was denied.",
        );
      }

      setRoute(storedRoute);
      setArtifacts(storedArtifacts);
      setVerificationResults(
        Object.fromEntries(
          storedArtifacts.map((artifact) => [
            artifact.id,
            storedVerifications[artifact.id] ??
              createUnverifiedArtifactResult(artifact),
          ]),
        ),
      );
      setVerificationMessage("");
      setLatestRouteReceipt(storedRouteReceipt);
      setRouteReceiptMessage("");
      setRouteReceiptVerification(null);
      setRouteReceiptVerificationMessage("");
    } catch (error) {
      setRoute(null);
      setArtifacts([]);
      setErrorMessage(
        getErrorMessage(
          error,
          "The Evidence & Records workspace could not be loaded.",
        ),
      );
    } finally {
      setLoading(false);
    }
  }, [routeRecordId]);

  const resetEditor = (): void => {
    setArtifactType("EVIDENCE");
    setCanonicalStage("RECORD");
    setTitle("");
    setDescription("");
    setRequirementKey("");
    setSha256("");
    setArtifactJsonText("{}");
    setSelectedFile(null);
    setEditorMessage("");
    setEditingArtifactId(null);
  };

  const startEditingArtifact = (artifact: RouteArtifact): void => {
    setArtifactType(artifact.artifactType);
    setCanonicalStage(artifact.canonicalStage);
    setTitle(artifact.title);
    setDescription(artifact.description ?? "");
    setRequirementKey(artifact.requirementKey ?? "");
    setSha256(artifact.sha256 ?? "");
    setArtifactJsonText(JSON.stringify(artifact.artifactJson ?? {}, null, 2));
    setSelectedFile(null);
    setEditingArtifactId(artifact.id);
    setEditorMessage("");
    setEditorOpen(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const saveArtifact = async (): Promise<void> => {
    if (!route) {
      return;
    }

    setSavingArtifact(true);
    setEditorMessage("");

    let uploadedStoragePath: string | null = null;

    try {
      let artifactJson: Record<string, unknown> = {};

      const normalizedJson = artifactJsonText.trim();

      if (normalizedJson) {
        const parsed: unknown = JSON.parse(normalizedJson);

        if (
          typeof parsed !== "object" ||
          parsed === null ||
          Array.isArray(parsed)
        ) {
          throw new Error("Artifact JSON must be a JSON object.");
        }

        artifactJson = parsed as Record<string, unknown>;
      }

      const existingArtifact = editingArtifactId
        ? (artifacts.find((artifact) => artifact.id === editingArtifactId) ??
          null)
        : null;

      const uploadedFile = selectedFile
        ? await uploadRouteArtifactFile({
            routeRecordId: route.id,
            file: selectedFile,
          })
        : null;

      uploadedStoragePath = uploadedFile?.storagePath ?? null;

      if (editingArtifactId) {
        await updateSupabaseRouteArtifact(editingArtifactId, {
          artifactType,
          canonicalStage,
          requirementKey: requirementKey || null,
          title,
          description: description || null,
          artifactJson,
          sha256: uploadedFile?.sha256 ?? (sha256 || null),
          ...(uploadedFile
            ? {
                originalFilename: uploadedFile.originalFilename,
                storagePath: uploadedFile.storagePath,
                mimeType: uploadedFile.mimeType,
                sizeBytes: uploadedFile.sizeBytes,
              }
            : {}),
        });

        if (
          uploadedFile &&
          existingArtifact?.storagePath &&
          existingArtifact.storagePath !== uploadedFile.storagePath
        ) {
          try {
            await removeRouteArtifactFile(existingArtifact.storagePath);
          } catch {
            // The updated record remains valid. Orphan cleanup can be
            // retried without reversing the governed record update.
          }
        }
      } else {
        await createSupabaseRouteArtifact({
          routeRecordId: route.id,
          routeId: route.route.routeId,
          artifactType,
          canonicalStage,
          requirementKey: requirementKey || null,
          title,
          description: description || null,
          artifactJson,
          sha256: uploadedFile?.sha256 ?? (sha256 || null),
          originalFilename: uploadedFile?.originalFilename ?? null,
          storagePath: uploadedFile?.storagePath ?? null,
          mimeType: uploadedFile?.mimeType ?? null,
          sizeBytes: uploadedFile?.sizeBytes ?? null,
        });
      }

      uploadedStoragePath = null;
      await loadWorkspace();
      resetEditor();
      setEditorOpen(false);
    } catch (error) {
      if (uploadedStoragePath) {
        try {
          await removeRouteArtifactFile(uploadedStoragePath);
        } catch {
          // Preserve the original error. Storage cleanup can be retried.
        }
      }

      setEditorMessage(
        getErrorMessage(
          error,
          editingArtifactId
            ? "The governed artifact could not be updated."
            : "The governed artifact could not be created.",
        ),
      );
    } finally {
      setSavingArtifact(false);
    }
  };

  const verifyArtifact = async (artifact: RouteArtifact): Promise<void> => {
    setVerifyingArtifactId(artifact.id);
    setVerificationMessage("");

    try {
      const result = await verifyRouteArtifactFile(artifact);

      setVerificationResults((current) => ({
        ...current,
        [artifact.id]: result,
      }));
    } catch (error) {
      setVerificationMessage(
        getErrorMessage(error, "The governed artifact could not be verified."),
      );
    } finally {
      setVerifyingArtifactId(null);
    }
  };

  const verifyAllArtifacts = async (): Promise<void> => {
    if (artifacts.length === 0) {
      return;
    }

    setVerifyingAll(true);
    setVerificationMessage("");

    try {
      const results: Record<string, ArtifactVerificationResult> = {};

      for (const artifact of artifacts) {
        results[artifact.id] = await verifyRouteArtifactFile(artifact);
      }

      setVerificationResults(results);
    } catch (error) {
      setVerificationMessage(
        getErrorMessage(
          error,
          "Route artifact verification could not be completed.",
        ),
      );
    } finally {
      setVerifyingAll(false);
    }
  };

  const preserveRouteReceipt = async (): Promise<void> => {
    if (!route || artifacts.length === 0) {
      return;
    }

    setPreservingRouteReceipt(true);
    setRouteReceiptMessage("");

    try {
      const receipt = await createRouteVerificationReceipt({
        routeRecordId,
        routeId: route.route.routeId,
        readinessStatus: readiness.status,
        readinessScore: readiness.score,
        readinessMaximumScore: readiness.maximumScore,
        readinessPercentage: readiness.percentage,
        artifactVerifications: artifacts.map(
          (artifact) =>
            verificationResults[artifact.id] ??
            createUnverifiedArtifactResult(artifact),
        ),
      });

      setLatestRouteReceipt(receipt);
      setRouteReceiptVerification(null);
      setRouteReceiptVerificationMessage("");
      setRouteReceiptMessage(
        "Route-level verification receipt preserved successfully.",
      );
    } catch (error) {
      setRouteReceiptMessage(
        getErrorMessage(
          error,
          "The route-level verification receipt could not be preserved.",
        ),
      );
    } finally {
      setPreservingRouteReceipt(false);
    }
  };

  const verifyLatestRouteReceipt = async (): Promise<void> => {
    if (!latestRouteReceipt) {
      return;
    }

    setVerifyingRouteReceipt(true);
    setRouteReceiptVerificationMessage("");

    try {
      const result = await verifyRouteVerificationReceipt(
        latestRouteReceipt,
      );

      setRouteReceiptVerification(result);
    } catch (error) {
      setRouteReceiptVerificationMessage(
        getErrorMessage(
          error,
          "The preserved route receipt could not be verified.",
        ),
      );
    } finally {
      setVerifyingRouteReceipt(false);
    }
  };

  const openArtifactFile = async (artifact: RouteArtifact): Promise<void> => {
    if (!artifact.storagePath) {
      return;
    }

    setOpeningArtifactId(artifact.id);
    setDeleteErrorMessage("");

    try {
      await openRouteArtifactFile(artifact.storagePath);
    } catch (error) {
      setDeleteErrorMessage(
        getErrorMessage(error, "The stored artifact file could not be opened."),
      );
    } finally {
      setOpeningArtifactId(null);
    }
  };

  const deleteArtifact = async (artifact: RouteArtifact): Promise<void> => {
    const confirmed = window.confirm(
      `Delete "${artifact.title}"? This removes the governed artifact record from this route. This action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    setDeletingArtifactId(artifact.id);
    setDeleteErrorMessage("");

    try {
      const deleted = await deleteSupabaseRouteArtifact(artifact.id);

      if (!deleted) {
        throw new Error(
          "The governed artifact was not found or access was denied.",
        );
      }

      if (artifact.storagePath) {
        try {
          await removeRouteArtifactFile(artifact.storagePath);
        } catch {
          // The governed record is deleted. Storage cleanup may be
          // retried separately if the object could not be removed.
        }
      }

      if (editingArtifactId === artifact.id) {
        resetEditor();
        setEditorOpen(false);
      }

      await loadWorkspace();
    } catch (error) {
      setDeleteErrorMessage(
        getErrorMessage(error, "The governed artifact could not be deleted."),
      );
    } finally {
      setDeletingArtifactId(null);
    }
  };

  useEffect(() => {
    void loadWorkspace();
  }, [loadWorkspace]);

  const artifactsByStage = useMemo(() => {
    return CANONICAL_ROUTE_STAGES.reduce<
      Record<CanonicalRouteStage, RouteArtifact[]>
    >(
      (result, stage) => {
        result[stage] = artifacts.filter(
          (artifact) => artifact.canonicalStage === stage,
        );

        return result;
      },
      {
        REALITY: [],
        RECORD: [],
        CONTINUITY: [],
        ADMISSIBILITY: [],
        BINDING: [],
        COMMIT: [],
        EXECUTION: [],
        OUTCOME: [],
      },
    );
  }, [artifacts]);

  if (loading) {
    return (
      <main className="page">
        <section className="statePanel">
          <span className="loadingMark" aria-hidden="true">
            TA-14
          </span>

          <h1>Loading Evidence & Records</h1>

          <p>Retrieving the authenticated route and its governed artifacts.</p>
        </section>

        <PageStyles />
      </main>
    );
  }

  if (errorMessage || !route) {
    return (
      <main className="page">
        <section className="statePanel errorState" role="alert">
          <p className="eyebrow">Evidence & Records</p>
          <h1>Workspace unavailable</h1>
          <p>{errorMessage || "The route could not be loaded."}</p>

          <div className="stateActions">
            <button
              type="button"
              onClick={() => {
                void loadWorkspace();
              }}
            >
              Try again
            </button>

            <Link href="/workspace/routes">← My Routes</Link>
          </div>
        </section>

        <PageStyles />
      </main>
    );
  }

  return (
    <main className="page">
      <header className="topbar">
        <div>
          <p className="eyebrow">TA-14 Exchange · Authenticated workspace</p>

          <h1>Evidence & Records</h1>

          <p className="intro">
            Create, classify, and review governed records bound to this
            authenticated route.
          </p>
        </div>

        <div className="topActions">
          <Link href="/workspace/routes" className="secondaryButton">
            ← My Routes
          </Link>

          <button
            type="button"
            className="secondaryButton"
            onClick={() => {
              if (editorOpen) {
                resetEditor();
                setEditorOpen(false);
                return;
              }

              resetEditor();
              setEditorOpen(true);
            }}
          >
            {editorOpen ? "Close editor" : "Add governed artifact"}
          </button>

          <Link href="/workspace/routes/new" className="primaryButton">
            Open Evaluation →
          </Link>
        </div>
      </header>

      {editorOpen ? (
        <section className="editorPanel">
          <div className="sectionHeading">
            <div>
              <p className="eyebrow">Governed Artifact Editor</p>
              <h2>
                {editingArtifactId
                  ? "Edit route-bound record"
                  : "Create a route-bound record"}
              </h2>
            </div>

            <span className="editorBadge">
              {editingArtifactId
                ? "Authenticated update"
                : "Authenticated write"}
            </span>
          </div>

          <div className="editorGrid">
            <label>
              <span>Artifact type</span>
              <select
                value={artifactType}
                onChange={(event) =>
                  setArtifactType(event.target.value as RouteArtifactType)
                }
                disabled={savingArtifact}
              >
                {ROUTE_ARTIFACT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type.replaceAll("_", " ")}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span>Canonical stage</span>
              <select
                value={canonicalStage}
                onChange={(event) =>
                  setCanonicalStage(event.target.value as CanonicalRouteStage)
                }
                disabled={savingArtifact}
              >
                {CANONICAL_ROUTE_STAGES.map((stage) => (
                  <option key={stage} value={stage}>
                    {stage}
                  </option>
                ))}
              </select>
            </label>

            <label className="wideField">
              <span>Artifact title</span>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Example: Procurement authority approval"
                disabled={savingArtifact}
              />
            </label>

            <label>
              <span>Requirement key</span>
              <input
                value={requirementKey}
                onChange={(event) => setRequirementKey(event.target.value)}
                placeholder="Optional requirement binding"
                disabled={savingArtifact}
              />
            </label>

            <label>
              <span>SHA-256</span>
              <input
                value={sha256}
                onChange={(event) => setSha256(event.target.value)}
                placeholder={
                  selectedFile
                    ? "Calculated automatically from selected file"
                    : "Optional 64-character digest"
                }
                disabled={savingArtifact || Boolean(selectedFile)}
              />
            </label>

            <label className="wideField">
              <span>Governed file</span>
              <input
                type="file"
                onChange={(event) =>
                  setSelectedFile(event.target.files?.[0] ?? null)
                }
                disabled={savingArtifact}
              />
              <small className="fileHelp">
                {selectedFile
                  ? `${selectedFile.name} · ${formatBytes(selectedFile.size)}`
                  : editingArtifactId
                    ? "Choose a file only to replace the existing stored object."
                    : "Optional. Maximum file size: 50 MB. SHA-256 is calculated automatically before upload."}
              </small>
            </label>

            <label className="wideField">
              <span>Description</span>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Describe what this record represents and why it belongs in this route."
                rows={4}
                disabled={savingArtifact}
              />
            </label>

            <label className="wideField">
              <span>Artifact JSON</span>
              <textarea
                value={artifactJsonText}
                onChange={(event) => setArtifactJsonText(event.target.value)}
                rows={8}
                spellCheck={false}
                disabled={savingArtifact}
              />
            </label>
          </div>

          {editorMessage ? (
            <p className="editorError" role="alert">
              {editorMessage}
            </p>
          ) : null}

          <div className="editorActions">
            <button
              type="button"
              className="secondaryButton"
              onClick={() => {
                resetEditor();
                setEditorOpen(false);
              }}
              disabled={savingArtifact}
            >
              Cancel
            </button>

            <button
              type="button"
              className="primaryButton"
              onClick={() => {
                void saveArtifact();
              }}
              disabled={savingArtifact || !title.trim()}
            >
              {savingArtifact
                ? editingArtifactId
                  ? "Updating governed artifact..."
                  : "Creating governed artifact..."
                : editingArtifactId
                  ? "Update governed artifact"
                  : "Create governed artifact"}
            </button>
          </div>

          <p className="editorBoundary">
            Creating or updating a record stores and classifies it. Storage
            alone does not establish admissibility, authority, truth,
            continuity, execution, or outcome.
          </p>
        </section>
      ) : null}

      <section className="readinessPanel">
        <div className="readinessHeader">
          <div>
            <p className="eyebrow">Governance Readiness Engine</p>
            <h2>Route readiness</h2>
            <p className="readinessIntro">
              Readiness is calculated from stage presence, verified
              stored-object integrity, requirement binding, and structured
              artifact records. It does not itself establish admissibility.
            </p>
          </div>

          <div className="readinessScore">
            <strong>{readiness.percentage}%</strong>
            <span>
              {readiness.score} / {readiness.maximumScore}
            </span>
          </div>
          <button
            type="button"
            className="verifyAllButton"
            onClick={() => {
              void verifyAllArtifacts();
            }}
            disabled={verifyingAll || artifacts.length === 0}
          >
            {verifyingAll
              ? "Verifying all artifacts..."
              : "Verify all artifacts"}
          </button>
          <button
            type="button"
            className="preserveReceiptButton"
            onClick={() => {
              void preserveRouteReceipt();
            }}
            disabled={preservingRouteReceipt || artifacts.length === 0}
          >
            {preservingRouteReceipt
              ? "Preserving route receipt..."
              : "Preserve route receipt"}
          </button>
        </div>

        <div className="readinessStatusRow">
          <span className={`readinessStatus ${readiness.status.toLowerCase()}`}>
            {readiness.status.replaceAll("_", " ")}
          </span>

          <span className="readinessBoundary">
            No admissible evidence. No admissible execution.
          </span>
        </div>
        {routeReceiptMessage ? (
          <p className="routeReceiptMessage" role="status">
            {routeReceiptMessage}
          </p>
        ) : null}

        {latestRouteReceipt ? (
          <article className="routeReceiptCard">
            <div className="routeReceiptTopline">
              <div>
                <span>Latest preserved route receipt</span>
                <strong>
                  {latestRouteReceipt.readinessStatus.replaceAll("_", " ")}
                </strong>
              </div>
              <time dateTime={latestRouteReceipt.createdAt}>
                {new Date(latestRouteReceipt.createdAt).toLocaleString()}
              </time>
            </div>

            <div className="routeReceiptMetrics">
              <span>Readiness: {latestRouteReceipt.readinessPercentage}%</span>
              <span>Verified: {latestRouteReceipt.verifiedCount}</span>
              <span>Mismatch: {latestRouteReceipt.mismatchCount}</span>
              <span>Missing: {latestRouteReceipt.missingCount}</span>
              <span>Unverified: {latestRouteReceipt.unverifiedCount}</span>
            </div>

            <code>Receipt SHA-256: {latestRouteReceipt.receiptSha256}</code>

            <div className="routeReceiptVerificationActions">
              <button
                type="button"
                className="verifyRouteReceiptButton"
                onClick={() => {
                  void verifyLatestRouteReceipt();
                }}
                disabled={verifyingRouteReceipt}
              >
                {verifyingRouteReceipt
                  ? "Verifying preserved receipt..."
                  : "Verify preserved route receipt"}
              </button>
            </div>

            {routeReceiptVerificationMessage ? (
              <p className="routeReceiptVerificationError" role="alert">
                {routeReceiptVerificationMessage}
              </p>
            ) : null}

            {routeReceiptVerification ? (
              <div
                className={`routeReceiptVerificationPanel ${routeReceiptVerification.status.toLowerCase()}`}
              >
                <div className="routeReceiptVerificationTopline">
                  <span>Independent receipt verification</span>
                  <strong>{routeReceiptVerification.status}</strong>
                </div>

                <p>{routeReceiptVerification.message}</p>

                <div className="routeReceiptVerificationMetrics">
                  <span>
                    Digest:{" "}
                    {routeReceiptVerification.hashMatches
                      ? "match"
                      : "mismatch"}
                  </span>
                  <span>
                    References:{" "}
                    {routeReceiptVerification.existingArtifactReceiptCount} /{" "}
                    {routeReceiptVerification.referencedArtifactReceiptCount}
                  </span>
                  <span>
                    Missing:{" "}
                    {routeReceiptVerification.missingArtifactReceiptIds.length}
                  </span>
                </div>

                <code>
                  Calculated SHA-256:{" "}
                  {routeReceiptVerification.calculatedSha256}
                </code>

                <time dateTime={routeReceiptVerification.checkedAt}>
                  Checked{" "}
                  {new Date(
                    routeReceiptVerification.checkedAt,
                  ).toLocaleString()}
                </time>
              </div>
            ) : null}
          </article>
        ) : null}

        <div className="readinessGrid">
          {readiness.stages.map((stage) => (
            <article
              key={stage.stage}
              className={`readinessCard ${stage.status.toLowerCase()}`}
            >
              <div className="readinessCardHeader">
                <div>
                  <span className="stageLabel">{stage.stage}</span>
                  <strong>
                    {stage.score} / {stage.maximumScore}
                  </strong>
                </div>

                <span className={`stageStatus ${stage.status.toLowerCase()}`}>
                  {stage.status}
                </span>
              </div>

              <dl className="readinessChecks">
                <div>
                  <dt>Artifact present</dt>
                  <dd>
                    {stage.artifactCount > 0
                      ? `Yes (${stage.artifactCount})`
                      : "No"}
                  </dd>
                </div>
                <div>
                  <dt>Verified integrity</dt>
                  <dd>{stage.hasVerifiedIntegrity ? "Yes" : "No"}</dd>
                </div>
                <div>
                  <dt>Requirement bound</dt>
                  <dd>{stage.hasRequirementBinding ? "Yes" : "No"}</dd>
                </div>
                <div>
                  <dt>Structured record</dt>
                  <dd>{stage.hasStructuredRecord ? "Yes" : "No"}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </section>

      <section className="routePanel">
        <div className="routeHeading">
          <div>
            <span className="status" data-state={route.route.status}>
              {route.route.status.replaceAll("_", " ")}
            </span>

            <h2>{route.route.metadata.name}</h2>

            <p>{route.route.metadata.domain}</p>
          </div>

          <div className="routeDates">
            <span>Last updated</span>
            <strong>{formatDate(route.updatedAt)}</strong>
          </div>
        </div>

        <div className="identityGrid">
          <article>
            <span>Database route record ID</span>
            <strong>{route.id}</strong>
          </article>

          <article>
            <span>TA-14 route ID</span>
            <strong>{route.route.routeId}</strong>
          </article>

          <article>
            <span>Owner</span>
            <strong>{route.route.metadata.owner}</strong>
          </article>

          <article>
            <span>Version</span>
            <strong>{route.route.metadata.version}</strong>
          </article>
        </div>
      </section>

      <section className="summaryGrid">
        <article>
          <span>Total artifacts</span>
          <strong>{artifacts.length}</strong>
        </article>

        <article>
          <span>Stages represented</span>
          <strong>
            {
              CANONICAL_ROUTE_STAGES.filter(
                (stage) => artifactsByStage[stage].length > 0,
              ).length
            }
          </strong>
        </article>

        <article>
          <span>Files referenced</span>
          <strong>
            {
              artifacts.filter(
                (artifact) => artifact.originalFilename || artifact.storagePath,
              ).length
            }
          </strong>
        </article>

        <article>
          <span>Hashes recorded</span>
          <strong>
            {artifacts.filter((artifact) => artifact.sha256).length}
          </strong>
        </article>
      </section>

      <section className="recordsPanel">
        <div className="sectionHeading">
          <div>
            <p className="eyebrow">Governed record inventory</p>
            <h2>Canonical route stages</h2>
          </div>

          <span className="readOnlyBadge">Governed inventory</span>
        </div>

        {deleteErrorMessage ? (
          <p className="deleteError" role="alert">
            {deleteErrorMessage}
          </p>
        ) : null}

        {verificationMessage ? (
          <p className="verificationError" role="alert">
            {verificationMessage}
          </p>
        ) : null}

        {artifacts.length === 0 ? (
          <div className="emptyState">
            <span className="emptyMark">01—08</span>

            <h2>No governed artifacts yet</h2>

            <p>
              This route is authenticated, but no evidence, authority, commit,
              execution, outcome, attachment, witness, signature, receipt,
              video, sensor record, AI output, or human approval has been added.
            </p>
          </div>
        ) : (
          <div className="stageList">
            {CANONICAL_ROUTE_STAGES.map((stage, index) => {
              const stageArtifacts = artifactsByStage[stage];

              return (
                <section className="stageCard" key={stage}>
                  <div className="stageHeader">
                    <div>
                      <span className="stageNumber">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <h3>{stage}</h3>
                    </div>

                    <span className="artifactCount">
                      {stageArtifacts.length}{" "}
                      {stageArtifacts.length === 1 ? "record" : "records"}
                    </span>
                  </div>

                  {stageArtifacts.length === 0 ? (
                    <p className="stageEmpty">
                      No governed records are currently assigned to this stage.
                    </p>
                  ) : (
                    <div className="artifactGrid">
                      {stageArtifacts.map((artifact) => {
                        const verification =
                          verificationResults[artifact.id] ??
                          createUnverifiedArtifactResult(artifact);

                        return (
                          <article className="artifactCard" key={artifact.id}>
                            <div className="artifactTopline">
                              <span className="artifactType">
                                {artifact.artifactType.replaceAll("_", " ")}
                              </span>

                              <span>{formatDate(artifact.createdAt)}</span>
                            </div>

                            <h4>{artifact.title}</h4>

                            {artifact.description ? (
                              <p>{artifact.description}</p>
                            ) : (
                              <p className="muted">No description recorded.</p>
                            )}

                            <dl>
                              <div>
                                <dt>Requirement</dt>
                                <dd>
                                  {artifact.requirementKey || "Not assigned"}
                                </dd>
                              </div>

                              <div>
                                <dt>Original file</dt>
                                <dd>
                                  {artifact.originalFilename || "Not recorded"}
                                </dd>
                              </div>

                              <div>
                                <dt>MIME type</dt>
                                <dd>{artifact.mimeType || "Not recorded"}</dd>
                              </div>

                              <div>
                                <dt>Size</dt>
                                <dd>{formatBytes(artifact.sizeBytes)}</dd>
                              </div>
                            </dl>

                            <div
                              className={`verificationPanel ${verification.status.toLowerCase()}`}
                            >
                              <div className="verificationTopline">
                                <span>Integrity verification</span>
                                <strong>{verification.status}</strong>
                              </div>

                              <p>{verification.message}</p>

                              <p className="verificationReceiptMeta">
                                {verification.receiptId &&
                                verification.checkedAt
                                  ? `Preserved receipt · ${formatDate(verification.checkedAt)}`
                                  : "No preserved verification receipt"}
                              </p>

                              <div className="verificationChecks">
                                <span>
                                  Object:{" "}
                                  {verification.storageObjectPresent
                                    ? "present"
                                    : "not confirmed"}
                                </span>
                                <span>
                                  Hash:{" "}
                                  {verification.hashMatches === null
                                    ? "not checked"
                                    : verification.hashMatches
                                      ? "match"
                                      : "mismatch"}
                                </span>
                                <span>
                                  Size:{" "}
                                  {verification.sizeMatches === null
                                    ? "not checked"
                                    : verification.sizeMatches
                                      ? "match"
                                      : "mismatch"}
                                </span>
                                <span>
                                  MIME:{" "}
                                  {verification.mimeTypeMatches === null
                                    ? "not checked"
                                    : verification.mimeTypeMatches
                                      ? "match"
                                      : "mismatch"}
                                </span>
                              </div>

                              {verification.calculatedSha256 ? (
                                <code>
                                  Calculated: {verification.calculatedSha256}
                                </code>
                              ) : null}
                            </div>

                            <div className="artifactActions">
                              <button
                                type="button"
                                className="verifyArtifactButton"
                                onClick={() => {
                                  void verifyArtifact(artifact);
                                }}
                                disabled={
                                  verifyingAll ||
                                  verifyingArtifactId === artifact.id ||
                                  deletingArtifactId === artifact.id
                                }
                              >
                                {verifyingArtifactId === artifact.id
                                  ? "Verifying..."
                                  : "Verify integrity"}
                              </button>

                              {artifact.storagePath ? (
                                <button
                                  type="button"
                                  className="openArtifactButton"
                                  onClick={() => {
                                    void openArtifactFile(artifact);
                                  }}
                                  disabled={
                                    openingArtifactId === artifact.id ||
                                    deletingArtifactId === artifact.id
                                  }
                                >
                                  {openingArtifactId === artifact.id
                                    ? "Opening..."
                                    : "Open stored file"}
                                </button>
                              ) : null}

                              <button
                                type="button"
                                className="editArtifactButton"
                                onClick={() => startEditingArtifact(artifact)}
                                disabled={deletingArtifactId === artifact.id}
                              >
                                Edit governed artifact
                              </button>

                              <button
                                type="button"
                                className="deleteArtifactButton"
                                onClick={() => {
                                  void deleteArtifact(artifact);
                                }}
                                disabled={deletingArtifactId === artifact.id}
                              >
                                {deletingArtifactId === artifact.id
                                  ? "Deleting..."
                                  : "Delete"}
                              </button>
                            </div>

                            <div className="hashBlock">
                              <span>SHA-256</span>
                              <code>
                                {artifact.sha256 || "No digest recorded"}
                              </code>
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        )}
      </section>

      <section className="boundaryNote">
        <strong>Governance boundary</strong>

        <p>
          This workspace displays authenticated route artifacts as stored
          records. Their presence does not independently prove truth,
          continuity, admissibility, authority, execution, or outcome. Those
          determinations require the applicable TA-14 evaluation and
          verification controls.
        </p>
      </section>

      <PageStyles />
    </main>
  );
}

function PageStyles() {
  return (
    <style jsx global>{`
      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
      }

      .page {
        min-height: 100vh;
        padding: 42px;
        background: radial-gradient(
            circle at top right,
            rgba(49, 209, 158, 0.1),
            transparent 31%
          ),
          #f5f7f8;
        color: #10201a;
        font-family:
          Inter,
          ui-sans-serif,
          system-ui,
          -apple-system,
          BlinkMacSystemFont,
          "Segoe UI",
          sans-serif;
      }

      .topbar,
      .routePanel,
      .summaryGrid,
      .recordsPanel,
      .boundaryNote,
      .statePanel {
        max-width: 1480px;
        margin-right: auto;
        margin-left: auto;
      }

      .topbar {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 28px;
        margin-bottom: 28px;
      }

      .eyebrow {
        margin: 0 0 9px;
        color: #0f7c5c;
        font-size: 11px;
        font-weight: 900;
        letter-spacing: 0.15em;
        text-transform: uppercase;
      }

      h1,
      h2,
      h3,
      h4,
      p {
        margin-top: 0;
      }

      h1 {
        margin-bottom: 12px;
        font-size: clamp(42px, 7vw, 78px);
        line-height: 0.94;
        letter-spacing: -0.065em;
      }

      .intro {
        max-width: 760px;
        margin-bottom: 0;
        color: #5b6b64;
        font-size: 17px;
        line-height: 1.65;
      }

      .topActions,
      .stateActions {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
      }

      .secondaryButton,
      .primaryButton,
      .stateActions a,
      .stateActions button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 12px 16px;
        border: 1px solid #ced8d2;
        border-radius: 11px;
        background: white;
        color: #20382d;
        font: inherit;
        font-weight: 850;
        text-decoration: none;
        cursor: pointer;
      }

      button.secondaryButton,
      button.primaryButton {
        appearance: none;
      }

      .secondaryButton:disabled,
      .primaryButton:disabled {
        cursor: not-allowed;
        opacity: 0.55;
      }

      .primaryButton {
        border-color: #123c2e;
        background: #123c2e;
        color: white;
      }

      .routePanel,
      .recordsPanel,
      .editorPanel,
      .readinessPanel,
      .boundaryNote,
      .statePanel {
        border: 1px solid #dce4df;
        background: rgba(255, 255, 255, 0.96);
        box-shadow: 0 20px 60px rgba(20, 47, 36, 0.06);
      }

      .editorPanel {
        max-width: 1480px;
        margin: 0 auto 18px;
        padding: 26px;
        border-radius: 22px;
      }

      .editorGrid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 14px;
      }

      .editorGrid label {
        display: grid;
        gap: 7px;
      }

      .editorGrid label > span {
        color: #68766f;
        font-size: 10px;
        font-weight: 900;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }

      .editorGrid input,
      .editorGrid select,
      .editorGrid textarea {
        width: 100%;
        border: 1px solid #ced8d2;
        border-radius: 11px;
        background: white;
        color: #10201a;
        font: inherit;
        font-size: 13px;
        outline: none;
      }

      .editorGrid input,
      .editorGrid select {
        min-height: 44px;
        padding: 0 12px;
      }

      .editorGrid textarea {
        padding: 12px;
        resize: vertical;
      }

      .fileHelp {
        color: #68766f;
        font-size: 11px;
        line-height: 1.45;
      }

      .editorGrid input:focus,
      .editorGrid select:focus,
      .editorGrid textarea:focus {
        border-color: #0f7c5c;
        box-shadow: 0 0 0 3px rgba(15, 124, 92, 0.1);
      }

      .wideField {
        grid-column: 1 / -1;
      }

      .editorBadge {
        display: inline-flex;
        padding: 7px 10px;
        border-radius: 999px;
        background: #eaf7f2;
        color: #08724f;
        font-size: 10px;
        font-weight: 900;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }

      .editorActions {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        margin-top: 16px;
      }

      .editorError {
        margin: 14px 0 0;
        padding: 11px 12px;
        border: 1px solid #efc1c1;
        border-radius: 10px;
        background: #fff8f8;
        color: #9b2929;
        font-size: 13px;
      }

      .editorBoundary {
        margin: 14px 0 0;
        color: #718078;
        font-size: 12px;
        line-height: 1.55;
      }

      .readinessPanel {
        max-width: 1480px;
        margin: 0 auto 18px;
        padding: 26px;
        border-radius: 22px;
      }

      .readinessHeader {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 20px;
        margin-bottom: 18px;
      }

      .readinessHeader h2 {
        margin: 4px 0 8px;
      }

      .readinessIntro {
        max-width: 760px;
        margin: 0;
        color: #68766f;
        font-size: 13px;
        line-height: 1.6;
      }

      .readinessScore {
        min-width: 128px;
        padding: 16px;
        border: 1px solid #cde4da;
        border-radius: 16px;
        background: #f3fbf7;
        text-align: center;
      }

      .readinessScore strong {
        display: block;
        color: #08724f;
        font-size: 34px;
        line-height: 1;
      }

      .readinessScore span {
        display: block;
        margin-top: 7px;
        color: #68766f;
        font-size: 11px;
        font-weight: 800;
      }

      .readinessStatusRow {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        margin-bottom: 18px;
      }

      .readinessStatus,
      .stageStatus {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 999px;
        font-weight: 900;
        letter-spacing: 0.06em;
        text-transform: uppercase;
      }

      .readinessStatus {
        padding: 8px 11px;
        font-size: 10px;
      }

      .stageStatus {
        padding: 6px 8px;
        font-size: 9px;
      }

      .ready_for_review,
      .stageStatus.complete {
        background: #e9f8f1;
        color: #08724f;
      }

      .needs_evidence,
      .stageStatus.incomplete {
        background: #fff7dd;
        color: #8a5a00;
      }

      .not_ready,
      .stageStatus.missing {
        background: #fff0f0;
        color: #a12d2d;
      }

      .readinessBoundary {
        color: #68766f;
        font-size: 12px;
        font-weight: 800;
      }

      .readinessGrid {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 12px;
      }

      .readinessCard {
        padding: 15px;
        border: 1px solid #dbe4df;
        border-radius: 14px;
        background: #fbfcfb;
      }

      .readinessCard.complete {
        border-color: #bfe0d2;
        background: #f6fcf9;
      }

      .readinessCard.incomplete {
        border-color: #ead9a5;
        background: #fffdf5;
      }

      .readinessCard.missing {
        border-color: #eccaca;
        background: #fffafa;
      }

      .readinessCardHeader {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 10px;
        margin-bottom: 12px;
      }

      .readinessCardHeader > div {
        display: grid;
        gap: 4px;
      }

      .stageLabel {
        color: #10201a;
        font-size: 12px;
        font-weight: 900;
        letter-spacing: 0.06em;
      }

      .readinessCardHeader strong {
        color: #68766f;
        font-size: 11px;
      }

      .readinessChecks {
        display: grid;
        gap: 8px;
        margin: 0;
      }

      .readinessChecks div {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        padding-top: 8px;
        border-top: 1px solid #e4ebe7;
      }

      .readinessChecks dt,
      .readinessChecks dd {
        margin: 0;
        font-size: 10px;
      }

      .readinessChecks dt {
        color: #68766f;
      }

      .readinessChecks dd {
        color: #10201a;
        font-weight: 900;
        text-align: right;
      }

      .routePanel {
        margin-bottom: 18px;
        padding: 26px;
        border-radius: 22px;
      }

      .routeHeading {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 24px;
        margin-bottom: 22px;
      }

      .routeHeading h2 {
        margin: 12px 0 6px;
        font-size: 32px;
        letter-spacing: -0.045em;
      }

      .routeHeading p {
        margin-bottom: 0;
        color: #68766f;
      }

      .status,
      .readOnlyBadge,
      .artifactType,
      .artifactCount {
        display: inline-flex;
        padding: 7px 10px;
        border-radius: 999px;
        font-size: 10px;
        font-weight: 900;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }

      .status {
        background: #edf2ef;
        color: #53635b;
      }

      .status[data-state="HOLD"] {
        background: #fff3d7;
        color: #8d5d00;
      }

      .status[data-state="READY_FOR_TEST"] {
        background: #dcf8eb;
        color: #08724f;
      }

      .routeDates {
        text-align: right;
      }

      .routeDates span {
        display: block;
        margin-bottom: 5px;
        color: #7a8781;
        font-size: 10px;
        font-weight: 850;
        letter-spacing: 0.07em;
        text-transform: uppercase;
      }

      .routeDates strong {
        font-size: 13px;
      }

      .identityGrid,
      .summaryGrid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 14px;
      }

      .identityGrid article,
      .summaryGrid article {
        min-width: 0;
        padding: 18px;
        border: 1px solid #dde5e0;
        border-radius: 15px;
        background: #fbfcfb;
      }

      .identityGrid span,
      .summaryGrid span {
        display: block;
        margin-bottom: 9px;
        color: #718078;
        font-size: 10px;
        font-weight: 850;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }

      .identityGrid strong {
        display: block;
        overflow-wrap: anywhere;
        font-size: 12px;
      }

      .summaryGrid {
        margin-bottom: 18px;
      }

      .summaryGrid strong {
        font-size: 37px;
        line-height: 1;
        letter-spacing: -0.05em;
      }

      .recordsPanel {
        padding: 26px;
        border-radius: 22px;
      }

      .sectionHeading {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 18px;
        margin-bottom: 24px;
      }

      .sectionHeading h2 {
        margin-bottom: 0;
        font-size: 29px;
        letter-spacing: -0.04em;
      }

      .readOnlyBadge {
        background: #eef4ff;
        color: #244f9e;
      }

      .stageList {
        display: grid;
        gap: 14px;
      }

      .stageCard {
        padding: 20px;
        border: 1px solid #dbe3de;
        border-radius: 17px;
        background: #fbfcfb;
      }

      .stageHeader {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
      }

      .stageHeader > div {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .stageNumber {
        color: #0f7c5c;
        font-size: 12px;
        font-weight: 900;
      }

      .stageHeader h3 {
        margin-bottom: 0;
        font-size: 19px;
        letter-spacing: -0.02em;
      }

      .artifactCount {
        background: #edf2ef;
        color: #53635b;
      }

      .stageEmpty {
        margin: 16px 0 0;
        color: #7a8781;
        font-size: 13px;
      }

      .artifactGrid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 12px;
        margin-top: 16px;
      }

      .artifactCard {
        min-width: 0;
        padding: 17px;
        border: 1px solid #e0e7e3;
        border-radius: 14px;
        background: white;
      }

      .artifactTopline {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 13px;
        color: #7a8781;
        font-size: 10px;
      }

      .artifactType {
        background: #eaf7f2;
        color: #08724f;
      }

      .artifactCard h4 {
        margin-bottom: 8px;
        font-size: 18px;
      }

      .artifactCard > p {
        margin-bottom: 15px;
        color: #5f6f67;
        font-size: 13px;
        line-height: 1.55;
      }

      .artifactCard .muted {
        color: #8a9690;
      }

      dl {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 9px;
        margin: 0 0 13px;
      }

      dl div {
        min-width: 0;
        padding: 10px;
        border: 1px solid #e7ece9;
        border-radius: 10px;
        background: #fbfcfb;
      }

      dt {
        margin-bottom: 4px;
        color: #7a8781;
        font-size: 9px;
        font-weight: 850;
        letter-spacing: 0.07em;
        text-transform: uppercase;
      }

      dd {
        overflow: hidden;
        margin: 0;
        font-size: 11px;
        font-weight: 750;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .verifyAllButton,
      .preserveReceiptButton {
        min-width: 170px;
        padding: 12px 14px;
        border: 1px solid #b9d9cc;
        border-radius: 12px;
        background: #eaf7f2;
        color: #08724f;
        font: inherit;
        font-size: 11px;
        font-weight: 900;
        cursor: pointer;
      }

      .verifyAllButton:disabled,
      .preserveReceiptButton:disabled {
        cursor: not-allowed;
        opacity: 0.55;
      }

      .preserveReceiptButton {
        padding: 12px 14px;
        border: 1px solid #c8d0dd;
        border-radius: 12px;
        background: #f4f6fa;
        color: #25344d;
        font: inherit;
        font-size: 11px;
        font-weight: 900;
        cursor: pointer;
      }

      .routeReceiptMessage {
        margin: 12px 0 0;
        padding: 10px 12px;
        border: 1px solid #d8e2dc;
        border-radius: 10px;
        background: #f7faf8;
        color: #405349;
        font-size: 12px;
      }

      .routeReceiptCard {
        margin-top: 14px;
        padding: 14px;
        border: 1px solid #d8e0dc;
        border-radius: 14px;
        background: #fbfcfb;
      }

      .routeReceiptTopline {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 16px;
      }

      .routeReceiptTopline span {
        display: block;
        margin-bottom: 4px;
        color: #6a776f;
        font-size: 9px;
        font-weight: 900;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }

      .routeReceiptTopline strong {
        color: #1f2d26;
        font-size: 13px;
      }

      .routeReceiptTopline time {
        color: #728078;
        font-size: 10px;
      }

      .routeReceiptMetrics {
        display: flex;
        flex-wrap: wrap;
        gap: 7px;
        margin: 12px 0;
      }

      .routeReceiptMetrics span {
        padding: 6px 8px;
        border: 1px solid #e0e7e3;
        border-radius: 999px;
        background: white;
        color: #526058;
        font-size: 9px;
        font-weight: 800;
      }

      .routeReceiptVerificationActions {
        margin-top: 14px;
      }

      .verifyRouteReceiptButton {
        width: 100%;
        padding: 11px 13px;
        border: 1px solid #b9d9cc;
        border-radius: 10px;
        background: #eaf7f2;
        color: #08724f;
        font: inherit;
        font-size: 10px;
        font-weight: 900;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        cursor: pointer;
      }

      .verifyRouteReceiptButton:hover:not(:disabled) {
        border-color: #87bda8;
        background: #def2ea;
      }

      .verifyRouteReceiptButton:disabled {
        cursor: not-allowed;
        opacity: 0.55;
      }

      .routeReceiptVerificationPanel {
        margin-top: 12px;
        padding: 12px;
        border: 1px solid #dce4e0;
        border-radius: 10px;
        background: #f8faf9;
      }

      .routeReceiptVerificationPanel.verified {
        border-color: #b9decf;
        background: #f1faf6;
      }

      .routeReceiptVerificationPanel.mismatch {
        border-color: #edc4c4;
        background: #fff6f6;
      }

      .routeReceiptVerificationPanel.missing_references {
        border-color: #ead5a3;
        background: #fffaf0;
      }

      .routeReceiptVerificationTopline {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
      }

      .routeReceiptVerificationTopline span,
      .routeReceiptVerificationTopline strong {
        font-size: 9px;
        font-weight: 900;
        letter-spacing: 0.07em;
        text-transform: uppercase;
      }

      .routeReceiptVerificationPanel.verified strong {
        color: #08724f;
      }

      .routeReceiptVerificationPanel.mismatch strong {
        color: #a12d2d;
      }

      .routeReceiptVerificationPanel.missing_references strong {
        color: #8a5a00;
      }

      .routeReceiptVerificationPanel p {
        margin: 8px 0;
        color: #68766f;
        font-size: 10px;
        line-height: 1.45;
      }

      .routeReceiptVerificationMetrics {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        margin-bottom: 8px;
      }

      .routeReceiptVerificationMetrics span {
        padding: 5px 7px;
        border: 1px solid #e1e8e4;
        border-radius: 999px;
        background: white;
        color: #53615a;
        font-size: 9px;
        font-weight: 800;
      }

      .routeReceiptVerificationPanel time {
        display: block;
        margin-top: 7px;
        color: #7a8780;
        font-size: 9px;
      }

      .routeReceiptVerificationError {
        margin: 10px 0 0;
        padding: 10px 11px;
        border: 1px solid #efc1c1;
        border-radius: 9px;
        background: #fff8f8;
        color: #9b2929;
        font-size: 11px;
      }

      .routeReceiptCard code {
        display: block;
        overflow-wrap: anywhere;
        color: #46544c;
        font-size: 9px;
        line-height: 1.45;
      }

      .verificationPanel {
        margin-bottom: 10px;
        padding: 11px;
        border: 1px solid #dce4e0;
        border-radius: 10px;
        background: #f8faf9;
      }

      .verificationPanel.verified {
        border-color: #b9decf;
        background: #f1faf6;
      }

      .verificationPanel.mismatch {
        border-color: #ead5a3;
        background: #fffaf0;
      }

      .verificationPanel.missing {
        border-color: #edc4c4;
        background: #fff6f6;
      }

      .verificationTopline {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
      }

      .verificationTopline span,
      .verificationTopline strong {
        font-size: 9px;
        font-weight: 900;
        letter-spacing: 0.07em;
        text-transform: uppercase;
      }

      .verificationPanel.verified strong {
        color: #08724f;
      }

      .verificationPanel.mismatch strong {
        color: #8a5a00;
      }

      .verificationPanel.missing strong {
        color: #a12d2d;
      }

      .verificationPanel p {
        margin: 8px 0;
        color: #68766f;
        font-size: 10px;
        line-height: 1.45;
      }

      .verificationReceiptMeta {
        margin-top: -2px !important;
        color: #53615a !important;
        font-size: 9px !important;
        font-weight: 800;
      }

      .verificationChecks {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        margin-bottom: 8px;
      }

      .verificationChecks span {
        padding: 5px 7px;
        border: 1px solid #e1e8e4;
        border-radius: 999px;
        background: white;
        color: #53615a;
        font-size: 9px;
        font-weight: 800;
      }

      .verificationPanel code {
        display: block;
        overflow-wrap: anywhere;
        color: #45524c;
        font-size: 9px;
        line-height: 1.45;
      }

      .verificationError {
        margin: 0 0 16px;
        padding: 11px 12px;
        border: 1px solid #efc1c1;
        border-radius: 10px;
        background: #fff8f8;
        color: #9b2929;
        font-size: 13px;
      }

      .artifactActions {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-end;
        gap: 8px;
        margin-bottom: 10px;
      }

      .artifactActions button {
        padding: 8px 10px;
        border-radius: 9px;
        font: inherit;
        font-size: 10px;
        font-weight: 900;
        cursor: pointer;
      }

      .artifactActions button:disabled {
        cursor: not-allowed;
        opacity: 0.55;
      }

      .verifyArtifactButton {
        border: 1px solid #b9d9cc;
        background: #eaf7f2;
        color: #08724f;
      }

      .verifyArtifactButton:hover:not(:disabled) {
        border-color: #87bda8;
        background: #def2ea;
      }

      .openArtifactButton {
        border: 1px solid #bfe0d2;
        background: #eefaf5;
        color: #08724f;
      }

      .openArtifactButton:hover:not(:disabled) {
        border-color: #8fc8b2;
        background: #e3f6ee;
      }

      .editArtifactButton {
        border: 1px solid #c8d5ef;
        background: #eef4ff;
        color: #244f9e;
      }

      .editArtifactButton:hover:not(:disabled) {
        border-color: #9eb5e3;
        background: #e4edff;
      }

      .deleteArtifactButton {
        border: 1px solid #efc1c1;
        background: #fff4f4;
        color: #a12d2d;
      }

      .deleteArtifactButton:hover:not(:disabled) {
        border-color: #df9999;
        background: #ffe9e9;
      }

      .deleteError {
        margin: 0 0 16px;
        padding: 11px 12px;
        border: 1px solid #efc1c1;
        border-radius: 10px;
        background: #fff8f8;
        color: #9b2929;
        font-size: 13px;
      }

      .hashBlock {
        padding: 10px;
        border: 1px solid #e7ece9;
        border-radius: 10px;
        background: #f7f9f8;
      }

      .hashBlock span {
        display: block;
        margin-bottom: 5px;
        color: #7a8781;
        font-size: 9px;
        font-weight: 850;
        letter-spacing: 0.07em;
        text-transform: uppercase;
      }

      .hashBlock code {
        display: block;
        overflow: hidden;
        color: #42554b;
        font-size: 10px;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .emptyState,
      .statePanel {
        display: grid;
        place-items: center;
        align-content: center;
        text-align: center;
      }

      .emptyState {
        min-height: 350px;
        padding: 44px 20px;
      }

      .statePanel {
        min-height: 470px;
        padding: 50px 24px;
        border-radius: 22px;
      }

      .emptyMark,
      .loadingMark {
        display: grid;
        width: 86px;
        height: 86px;
        margin-bottom: 18px;
        place-items: center;
        border: 1px solid #bcded0;
        border-radius: 50%;
        background: #eaf7f2;
        color: #0f7c5c;
        font-size: 13px;
        font-weight: 900;
        letter-spacing: 0.08em;
      }

      .loadingMark {
        animation: pulse 1.4s ease-in-out infinite;
      }

      .emptyState h2,
      .statePanel h1 {
        margin-bottom: 10px;
        font-size: 31px;
        letter-spacing: -0.045em;
      }

      .emptyState p,
      .statePanel p {
        max-width: 660px;
        color: #68766f;
        line-height: 1.65;
      }

      .errorState {
        border-color: #efc1c1;
        background: #fff8f8;
      }

      .boundaryNote {
        margin-top: 18px;
        padding: 18px 20px;
        border-radius: 15px;
      }

      .boundaryNote strong {
        display: block;
        margin-bottom: 5px;
        font-size: 12px;
        text-transform: uppercase;
      }

      .boundaryNote p {
        margin-bottom: 0;
        color: #68766f;
        font-size: 13px;
        line-height: 1.6;
      }

      @keyframes pulse {
        0%,
        100% {
          transform: scale(1);
          opacity: 1;
        }

        50% {
          transform: scale(0.96);
          opacity: 0.62;
        }
      }

      @media (max-width: 980px) {
        .identityGrid,
        .summaryGrid,
        .artifactGrid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }

      @media (max-width: 650px) {
        .page {
          padding: 22px 14px;
        }

        .topbar,
        .routeHeading,
        .sectionHeading {
          align-items: stretch;
          flex-direction: column;
        }

        .topActions {
          justify-content: flex-start;
        }

        .identityGrid,
        .summaryGrid,
        .artifactGrid,
        .editorGrid,
        .readinessGrid,
        dl {
          grid-template-columns: 1fr;
        }

        .wideField {
          grid-column: auto;
        }

        .routeDates {
          text-align: left;
        }

        .secondaryButton,
        .primaryButton,
        .stateActions a,
        .stateActions button {
          width: 100%;
        }

        .routePanel,
        .recordsPanel,
        .editorPanel,
        .readinessPanel {
          padding: 18px;
        }

        .readinessHeader {
          flex-direction: column;
        }

        .readinessScore,
        .verifyAllButton,
        .preserveReceiptButton {
          width: 100%;
        }

        .editorActions {
          flex-direction: column-reverse;
        }

        .editorActions button {
          width: 100%;
        }

        .stageHeader,
        .artifactTopline {
          align-items: flex-start;
          flex-direction: column;
        }
      }
    `}</style>
  );
}
