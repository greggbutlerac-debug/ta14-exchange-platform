"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import type { StoredRoute } from "../../../../../lib/route-library";
import { getSupabaseRoute } from "../../../../../lib/supabase-route-library";
import {
  CANONICAL_ROUTE_STAGES,
  listSupabaseRouteArtifacts,
  type CanonicalRouteStage,
  type RouteArtifact,
} from "../../../../../lib/supabase-route-artifacts";

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

function getErrorMessage(
  error: unknown,
  fallbackMessage: string,
): string {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return fallbackMessage;
}

export default function RouteArtifactsPage() {
  const params = useParams<{ id: string }>();
  const routeRecordId =
    typeof params.id === "string" ? params.id : "";

  const [route, setRoute] = useState<StoredRoute | null>(null);
  const [artifacts, setArtifacts] = useState<RouteArtifact[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const loadWorkspace = useCallback(async (): Promise<void> => {
    if (!routeRecordId) {
      setErrorMessage("The route record ID is missing.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const [storedRoute, storedArtifacts] = await Promise.all([
        getSupabaseRoute(routeRecordId),
        listSupabaseRouteArtifacts(routeRecordId),
      ]);

      if (!storedRoute) {
        throw new Error(
          "The authenticated route could not be found or access was denied.",
        );
      }

      setRoute(storedRoute);
      setArtifacts(storedArtifacts);
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

          <p>
            Retrieving the authenticated route and its governed
            artifacts.
          </p>
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
          <p className="eyebrow">
            TA-14 Exchange · Authenticated workspace
          </p>

          <h1>Evidence & Records</h1>

          <p className="intro">
            Review the governed records currently bound to this
            authenticated route. This checkpoint is read-only.
          </p>
        </div>

        <div className="topActions">
          <Link href="/workspace/routes" className="secondaryButton">
            ← My Routes
          </Link>

          <Link
            href="/workspace/routes/new"
            className="primaryButton"
          >
            Open Evaluation →
          </Link>
        </div>
      </header>

      <section className="routePanel">
        <div className="routeHeading">
          <div>
            <span
              className="status"
              data-state={route.route.status}
            >
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
                (artifact) =>
                  artifact.originalFilename ||
                  artifact.storagePath,
              ).length
            }
          </strong>
        </article>

        <article>
          <span>Hashes recorded</span>
          <strong>
            {
              artifacts.filter(
                (artifact) => artifact.sha256,
              ).length
            }
          </strong>
        </article>
      </section>

      <section className="recordsPanel">
        <div className="sectionHeading">
          <div>
            <p className="eyebrow">Governed record inventory</p>
            <h2>Canonical route stages</h2>
          </div>

          <span className="readOnlyBadge">Read-only checkpoint</span>
        </div>

        {artifacts.length === 0 ? (
          <div className="emptyState">
            <span className="emptyMark">01—08</span>

            <h2>No governed artifacts yet</h2>

            <p>
              This route is authenticated, but no evidence, authority,
              commit, execution, outcome, attachment, witness,
              signature, receipt, video, sensor record, AI output, or
              human approval has been added.
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
                      {stageArtifacts.length === 1
                        ? "record"
                        : "records"}
                    </span>
                  </div>

                  {stageArtifacts.length === 0 ? (
                    <p className="stageEmpty">
                      No governed records are currently assigned to
                      this stage.
                    </p>
                  ) : (
                    <div className="artifactGrid">
                      {stageArtifacts.map((artifact) => (
                        <article
                          className="artifactCard"
                          key={artifact.id}
                        >
                          <div className="artifactTopline">
                            <span className="artifactType">
                              {artifact.artifactType.replaceAll(
                                "_",
                                " ",
                              )}
                            </span>

                            <span>
                              {formatDate(artifact.createdAt)}
                            </span>
                          </div>

                          <h4>{artifact.title}</h4>

                          {artifact.description ? (
                            <p>{artifact.description}</p>
                          ) : (
                            <p className="muted">
                              No description recorded.
                            </p>
                          )}

                          <dl>
                            <div>
                              <dt>Requirement</dt>
                              <dd>
                                {artifact.requirementKey ||
                                  "Not assigned"}
                              </dd>
                            </div>

                            <div>
                              <dt>Original file</dt>
                              <dd>
                                {artifact.originalFilename ||
                                  "Not recorded"}
                              </dd>
                            </div>

                            <div>
                              <dt>MIME type</dt>
                              <dd>
                                {artifact.mimeType ||
                                  "Not recorded"}
                              </dd>
                            </div>

                            <div>
                              <dt>Size</dt>
                              <dd>
                                {formatBytes(
                                  artifact.sizeBytes,
                                )}
                              </dd>
                            </div>
                          </dl>

                          <div className="hashBlock">
                            <span>SHA-256</span>
                            <code>
                              {artifact.sha256 ||
                                "No digest recorded"}
                            </code>
                          </div>
                        </article>
                      ))}
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
          This workspace displays authenticated route artifacts as
          stored records. Their presence does not independently prove
          truth, continuity, admissibility, authority, execution, or
          outcome. Those determinations require the applicable TA-14
          evaluation and verification controls.
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
        background:
          radial-gradient(
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

      .primaryButton {
        border-color: #123c2e;
        background: #123c2e;
        color: white;
      }

      .routePanel,
      .recordsPanel,
      .boundaryNote,
      .statePanel {
        border: 1px solid #dce4df;
        background: rgba(255, 255, 255, 0.96);
        box-shadow: 0 20px 60px rgba(20, 47, 36, 0.06);
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
        dl {
          grid-template-columns: 1fr;
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
        .recordsPanel {
          padding: 18px;
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
