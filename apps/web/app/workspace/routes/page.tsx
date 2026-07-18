"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  deleteStoredRoute,
  duplicateStoredRoute,
  listStoredRoutes,
  type StoredRoute,
} from "../../../lib/route-library";
import { savePendingRouteDraft } from "../../../lib/route-draft-transfer";
import OpenInBuilderButton from "./open-in-builder-button";
import RouteLibraryTransferPanel from "./route-library-transfer-panel";
import RouteLibraryMaintenancePanel from "./route-library-maintenance-panel";

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

function downloadRoute(item: StoredRoute): void {
  const blob = new Blob([JSON.stringify(item.route, null, 2)], {
    type: "application/json",
  });
  const href = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  const filename = item.route.metadata.name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "ta14-route";

  anchor.href = href;
  anchor.download = `${filename}.json`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(href);
}

export default function RouteLibraryPage() {
  const router = useRouter();
  const [routes, setRoutes] = useState<StoredRoute[]>([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [notice, setNotice] = useState("");

  function refreshRoutes() {
    setRoutes(listStoredRoutes());
  }

  useEffect(() => {
    refreshRoutes();

    const handleUpdate = () => refreshRoutes();
    window.addEventListener("ta14-route-library-updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener(
        "ta14-route-library-updated",
        handleUpdate,
      );
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const filteredRoutes = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return routes.filter((item) => {
      const matchesStatus =
        statusFilter === "ALL" || item.route.status === statusFilter;
      const searchable = [
        item.route.metadata.name,
        item.route.metadata.domain,
        item.route.metadata.owner,
        item.route.routeId,
      ]
        .join(" ")
        .toLowerCase();

      return (
        matchesStatus &&
        (!normalizedQuery || searchable.includes(normalizedQuery))
      );
    });
  }, [query, routes, statusFilter]);

  function evaluateRoute(item: StoredRoute) {
    savePendingRouteDraft(item.route);
    router.push("/workspace/routes/new");
  }

  function duplicateRoute(item: StoredRoute) {
    const duplicate = duplicateStoredRoute(item.id);

    if (duplicate) {
      setNotice(`Duplicated “${item.route.metadata.name}”.`);
      window.setTimeout(() => setNotice(""), 1800);
    }
  }

  function removeRoute(item: StoredRoute) {
    const confirmed = window.confirm(
      `Delete “${item.route.metadata.name}” from this browser? This cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    deleteStoredRoute(item.id);
    setNotice(`Deleted “${item.route.metadata.name}”.`);
    window.setTimeout(() => setNotice(""), 1800);
  }

  return (
    <main className="page">
      <header className="topbar">
        <div>
          <p className="eyebrow">TA-14 Exchange · Local workspace</p>
          <h1>My Routes</h1>
          <p className="intro">
            Review, search, duplicate, export, and send locally saved
            governance routes into the TA-14 evaluation workspace.
          </p>
        </div>

        <div className="topActions">
          <Link href="/workspace" className="secondaryButton">
            ← Workspace
          </Link>
          <Link href="/workspace/build" className="primaryButton">
            Build a route →
          </Link>
        </div>
      </header>

      {notice ? <div className="notice">{notice}</div> : null}

      <section className="summaryGrid">
        <article>
          <span>Saved routes</span>
          <strong>{routes.length}</strong>
        </article>
        <article>
          <span>Ready for test</span>
          <strong>
            {routes.filter((item) => item.route.status === "READY_FOR_TEST").length}
          </strong>
        </article>
        <article>
          <span>On hold</span>
          <strong>
            {routes.filter((item) => item.route.status === "HOLD").length}
          </strong>
        </article>
        <article>
          <span>Drafts</span>
          <strong>
            {routes.filter((item) => item.route.status === "DRAFT").length}
          </strong>
        </article>
      </section>

      <section className="libraryPanel">
        <div className="libraryHeader">
          <div>
            <p className="eyebrow">Route library</p>
            <h2>Saved in this browser</h2>
          </div>

          <div className="filters">
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search name, domain, owner…"
              aria-label="Search saved routes"
            />

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              aria-label="Filter routes by status"
            >
              <option value="ALL">All states</option>
              <option value="READY_FOR_TEST">Ready for test</option>
              <option value="HOLD">Hold</option>
              <option value="DRAFT">Draft</option>
            </select>
          </div>
        </div>

        {routes.length === 0 ? (
          <div className="emptyState">
            <span className="emptyMark">01—08</span>
            <h2>No saved routes yet</h2>
            <p>
              Build your first governed route, save it to the local route
              library, and it will appear here for reuse and evaluation.
            </p>
            <Link href="/workspace/build" className="primaryButton">
              Open Route Builder →
            </Link>
          </div>
        ) : filteredRoutes.length === 0 ? (
          <div className="emptyState compact">
            <h2>No routes match these filters</h2>
            <p>Change the search text or route-state filter.</p>
          </div>
        ) : (
          <div className="routeGrid">
            {filteredRoutes.map((item) => {
              const readiness = item.route.readiness;
              const percentage = Math.round(
                (readiness.completedStages / readiness.totalStages) * 100,
              );

              return (
                <article className="routeCard" key={item.id}>
                  <div className="cardTopline">
                    <span className="status" data-state={item.route.status}>
                      {item.route.status.replaceAll("_", " ")}
                    </span>
                    <span className="updated">
                      Updated {formatDate(item.updatedAt)}
                    </span>
                  </div>

                  <h3>{item.route.metadata.name}</h3>
                  <p className="routeId">{item.route.routeId}</p>

                  <div className="metadata">
                    <div>
                      <span>Domain</span>
                      <strong>{item.route.metadata.domain}</strong>
                    </div>
                    <div>
                      <span>Owner</span>
                      <strong>{item.route.metadata.owner}</strong>
                    </div>
                    <div>
                      <span>Version</span>
                      <strong>{item.route.metadata.version}</strong>
                    </div>
                  </div>

                  <div className="progressBlock">
                    <div>
                      <span>Route completeness</span>
                      <strong>
                        {readiness.completedStages} / {readiness.totalStages}
                      </strong>
                    </div>
                    <div className="progressTrack">
                      <div
                        className="progressFill"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>

                  <div className="cardActions">
                    <OpenInBuilderButton
                      route={item.route}
                      libraryRouteId={item.id}
                      className="editAction"
                    >
                      Edit in builder →
                    </OpenInBuilderButton>
                    <button
                      type="button"
                      className="primaryAction"
                      onClick={() => evaluateRoute(item)}
                    >
                      Evaluate →
                    </button>
                    <button
                      type="button"
                      onClick={() => downloadRoute(item)}
                    >
                      Download
                    </button>
                    <button
                      type="button"
                      onClick={() => duplicateRoute(item)}
                    >
                      Duplicate
                    </button>
                    <button
                      type="button"
                      className="deleteAction"
                      onClick={() => removeRoute(item)}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <div className="transferWrap">
        <RouteLibraryTransferPanel onImported={refreshRoutes} />
      </div>

      <div className="maintenanceWrap">
        <RouteLibraryMaintenancePanel />
      </div>

      <section className="boundaryNote">
        <strong>Local-storage boundary</strong>
        <p>
          Routes on this page remain in this browser. They are not an
          authoritative system record, live evaluation, certification, or
          proof that declared evidence exists.
        </p>
      </section>

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .page {
          min-height: 100vh;
          padding: 42px;
          background:
            radial-gradient(circle at top right, rgba(49, 209, 158, 0.1), transparent 31%),
            #f5f7f8;
          color: #10201a;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system,
            BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        .topbar,
        .summaryGrid,
        .libraryPanel,
        .boundaryNote,
        .notice {
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

        .topActions {
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-end;
          gap: 10px;
        }

        .secondaryButton,
        .primaryButton {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 12px 16px;
          border: 1px solid #ced8d2;
          border-radius: 11px;
          background: white;
          color: #20382d;
          font-weight: 850;
          text-decoration: none;
        }

        .primaryButton {
          border-color: #123c2e;
          background: #123c2e;
          color: white;
        }

        .notice {
          margin-bottom: 18px;
          padding: 13px 16px;
          border: 1px solid #bcded0;
          border-radius: 12px;
          background: #eaf7f2;
          color: #0c694d;
          font-size: 13px;
          font-weight: 850;
        }

        .summaryGrid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
          margin-bottom: 18px;
        }

        .summaryGrid article {
          padding: 20px;
          border: 1px solid #dde5e0;
          border-radius: 17px;
          background: rgba(255, 255, 255, 0.94);
          box-shadow: 0 16px 45px rgba(20, 47, 36, 0.045);
        }

        .summaryGrid span {
          display: block;
          margin-bottom: 10px;
          color: #718078;
          font-size: 11px;
          font-weight: 850;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .summaryGrid strong {
          font-size: 37px;
          line-height: 1;
          letter-spacing: -0.05em;
        }

        .libraryPanel {
          padding: 26px;
          border: 1px solid #dce4df;
          border-radius: 22px;
          background: rgba(255, 255, 255, 0.96);
          box-shadow: 0 20px 60px rgba(20, 47, 36, 0.06);
        }

        .libraryHeader {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 24px;
          margin-bottom: 24px;
        }

        .libraryHeader h2 {
          margin-bottom: 0;
          font-size: 29px;
          letter-spacing: -0.04em;
        }

        .filters {
          display: flex;
          gap: 10px;
        }

        .filters input,
        .filters select {
          min-height: 44px;
          padding: 10px 13px;
          border: 1px solid #ced8d2;
          border-radius: 11px;
          outline: none;
          background: #fbfcfb;
          color: #173128;
          font: inherit;
          font-size: 13px;
        }

        .filters input {
          min-width: 280px;
        }

        .filters input:focus,
        .filters select:focus {
          border-color: #4fae8d;
          box-shadow: 0 0 0 4px rgba(79, 174, 141, 0.11);
        }

        .routeGrid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
        }

        .routeCard {
          padding: 21px;
          border: 1px solid #dbe3de;
          border-radius: 17px;
          background: #fbfcfb;
        }

        .cardTopline {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 18px;
        }

        .status {
          display: inline-flex;
          padding: 7px 10px;
          border-radius: 999px;
          background: #edf2ef;
          color: #53635b;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.08em;
        }

        .status[data-state="HOLD"] {
          background: #fff3d7;
          color: #8d5d00;
        }

        .status[data-state="READY_FOR_TEST"] {
          background: #dcf8eb;
          color: #08724f;
        }

        .updated {
          color: #7a8781;
          font-size: 11px;
        }

        .routeCard h3 {
          margin-bottom: 6px;
          font-size: 24px;
          letter-spacing: -0.035em;
        }

        .routeId {
          overflow: hidden;
          margin-bottom: 20px;
          color: #819088;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco,
            Consolas, monospace;
          font-size: 11px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .metadata {
          display: grid;
          grid-template-columns: 1fr 1fr 0.55fr;
          gap: 10px;
          margin-bottom: 19px;
        }

        .metadata div {
          min-width: 0;
          padding: 12px;
          border: 1px solid #e1e7e3;
          border-radius: 12px;
          background: white;
        }

        .metadata span,
        .progressBlock span {
          display: block;
          margin-bottom: 5px;
          color: #7a8781;
          font-size: 10px;
          font-weight: 850;
          letter-spacing: 0.07em;
          text-transform: uppercase;
        }

        .metadata strong {
          display: block;
          overflow: hidden;
          font-size: 12px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .progressBlock > div:first-child {
          display: flex;
          justify-content: space-between;
          gap: 12px;
        }

        .progressTrack {
          height: 7px;
          margin-top: 9px;
          overflow: hidden;
          border-radius: 999px;
          background: #e8eeea;
        }

        .progressFill {
          height: 100%;
          border-radius: inherit;
          background: #14946d;
        }

        .cardActions {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 21px;
          padding-top: 17px;
          border-top: 1px solid #e2e8e4;
        }

        .cardActions button {
          padding: 9px 11px;
          border: 1px solid #d5ded8;
          border-radius: 9px;
          background: white;
          color: #30473d;
          font: inherit;
          font-size: 11px;
          font-weight: 850;
          cursor: pointer;
        }

        .cardActions .editAction {
          border-color: #bcded0;
          background: #eaf7f2;
          color: #08724f;
        }

        .cardActions .primaryAction {
          border-color: #123c2e;
          background: #123c2e;
          color: white;
        }

        .cardActions .deleteAction {
          color: #a33b3b;
        }

        .emptyState {
          display: grid;
          min-height: 390px;
          place-items: center;
          align-content: center;
          padding: 48px 20px;
          text-align: center;
        }

        .emptyState.compact {
          min-height: 250px;
        }

        .emptyMark {
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

        .emptyState h2 {
          margin-bottom: 10px;
          font-size: 29px;
          letter-spacing: -0.04em;
        }

        .emptyState p {
          max-width: 570px;
          margin-bottom: 20px;
          color: #68766f;
          line-height: 1.65;
        }

        .transferWrap {
          max-width: 1480px;
          margin: 18px auto 0;
        }

        .maintenanceWrap {
          max-width: 1480px;
          margin: 18px auto 0;
        }

        .boundaryNote {
          margin-top: 18px;
          padding: 18px 20px;
          border: 1px solid #dde5e0;
          border-radius: 15px;
          background: rgba(255, 255, 255, 0.88);
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

        @media (max-width: 900px) {
          .summaryGrid,
          .routeGrid {
            grid-template-columns: repeat(2, 1fr);
          }

          .libraryHeader {
            align-items: stretch;
            flex-direction: column;
          }

          .filters input {
            flex: 1;
            min-width: 0;
          }
        }

        @media (max-width: 650px) {
          .page {
            padding: 22px 14px;
          }

          .topbar,
          .filters {
            flex-direction: column;
          }

          .topActions {
            justify-content: flex-start;
          }

          .summaryGrid,
          .routeGrid,
          .metadata {
            grid-template-columns: 1fr;
          }

          .filters input,
          .filters select,
          .secondaryButton,
          .primaryButton {
            width: 100%;
          }

          .libraryPanel {
            padding: 18px;
          }

          .cardTopline {
            align-items: flex-start;
            flex-direction: column;
          }
        }
      `}</style>
    </main>
  );
}
