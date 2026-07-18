"use client";

import { useEffect, useState } from "react";
import {
  clearRouteLibrary,
  getRouteLibraryStorageReport,
  pruneInvalidRouteLibraryRecords,
  ROUTE_LIBRARY_UPDATE_EVENT,
  type RouteLibraryStorageReport,
} from "../../../lib/route-library-maintenance";

type Notice = {
  tone: "success" | "error" | "info";
  message: string;
} | null;

function emptyReport(): RouteLibraryStorageReport {
  return {
    routeCount: 0,
    estimatedBytes: 0,
    estimatedKilobytes: 0,
    lastUpdatedAt: null,
    available: false,
  };
}

function formatDate(value: string | null): string {
  if (!value) {
    return "No saved routes yet";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default function RouteLibraryMaintenancePanel() {
  const [report, setReport] =
    useState<RouteLibraryStorageReport>(emptyReport);
  const [notice, setNotice] = useState<Notice>(null);
  const [busy, setBusy] = useState(false);

  function refreshReport() {
    setReport(getRouteLibraryStorageReport());
  }

  useEffect(() => {
    refreshReport();

    function handleUpdate() {
      refreshReport();
    }

    window.addEventListener(
      ROUTE_LIBRARY_UPDATE_EVENT,
      handleUpdate,
    );
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener(
        ROUTE_LIBRARY_UPDATE_EVENT,
        handleUpdate,
      );
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  function handleRepair() {
    setBusy(true);
    setNotice({
      tone: "info",
      message: "Checking the local route library…",
    });

    try {
      const result = pruneInvalidRouteLibraryRecords();

      setNotice({
        tone: "success",
        message:
          result.removed > 0
            ? `Library repaired. ${result.removed} invalid record${
                result.removed === 1 ? "" : "s"
              } removed and ${result.remaining} valid route${
                result.remaining === 1 ? "" : "s"
              } preserved.`
            : `Library check complete. All ${result.remaining} stored route${
                result.remaining === 1 ? "" : "s"
              } are valid.`,
      });

      refreshReport();
    } catch (error) {
      setNotice({
        tone: "error",
        message:
          error instanceof Error
            ? error.message
            : "The route library could not be checked.",
      });
    } finally {
      setBusy(false);
    }
  }

  function handleClear() {
    if (
      !window.confirm(
        "Delete every route currently stored in My Routes on this browser? Export a backup first if these routes must be preserved.",
      )
    ) {
      setNotice({
        tone: "info",
        message: "Clear cancelled. No routes were deleted.",
      });
      return;
    }

    setBusy(true);

    try {
      const removed = clearRouteLibrary();

      setNotice({
        tone: "success",
        message: `${removed} route${
          removed === 1 ? "" : "s"
        } removed from this browser.`,
      });

      refreshReport();
    } catch (error) {
      setNotice({
        tone: "error",
        message:
          error instanceof Error
            ? error.message
            : "The route library could not be cleared.",
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="maintenancePanel">
      <div className="heading">
        <div>
          <p className="eyebrow">Local storage health</p>
          <h2>Maintain My Routes</h2>
          <p>
            Inspect the browser-local route library, remove damaged
            entries, or clear the library after exporting a backup.
          </p>
        </div>

        <span
          className="availability"
          data-available={report.available}
        >
          {report.available
            ? "Storage available"
            : "Storage unavailable"}
        </span>
      </div>

      <div className="metrics">
        <article>
          <span>Saved routes</span>
          <strong>{report.routeCount}</strong>
        </article>

        <article>
          <span>Estimated storage</span>
          <strong>{report.estimatedKilobytes} KB</strong>
        </article>

        <article>
          <span>Last route update</span>
          <strong>{formatDate(report.lastUpdatedAt)}</strong>
        </article>
      </div>

      <div className="actions">
        <button
          type="button"
          className="repairButton"
          onClick={handleRepair}
          disabled={busy || !report.available}
        >
          Check and repair library
        </button>

        <button
          type="button"
          className="clearButton"
          onClick={handleClear}
          disabled={
            busy ||
            !report.available ||
            report.routeCount === 0
          }
        >
          Clear My Routes
        </button>
      </div>

      {notice ? (
        <div className="notice" data-tone={notice.tone}>
          {notice.message}
        </div>
      ) : null}

      <p className="boundary">
        These controls affect only this browser&apos;s local route
        workspace. They do not delete committed evaluations,
        verification receipts, replay packages, or authoritative
        execution records.
      </p>

      <style jsx>{`
        .maintenancePanel {
          padding: 26px;
          border: 1px solid #dce4df;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.96);
          box-shadow: 0 20px 60px rgba(20, 47, 36, 0.06);
        }

        .heading {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 24px;
        }

        .eyebrow {
          margin: 0 0 9px;
          color: #0f7c5c;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }

        h2,
        p {
          margin-top: 0;
        }

        h2 {
          margin-bottom: 10px;
          font-size: 28px;
          letter-spacing: -0.04em;
        }

        .heading p {
          max-width: 720px;
          margin-bottom: 0;
          color: #68766f;
          line-height: 1.6;
        }

        .availability {
          flex: 0 0 auto;
          padding: 8px 11px;
          border: 1px solid #efc6c6;
          border-radius: 999px;
          background: #fff0f0;
          color: #9b3131;
          font-size: 11px;
          font-weight: 850;
        }

        .availability[data-available="true"] {
          border-color: #b7dfcf;
          background: #eaf8f2;
          color: #08724f;
        }

        .metrics {
          display: grid;
          grid-template-columns: 0.7fr 0.8fr 1.5fr;
          gap: 14px;
          margin-top: 22px;
        }

        .metrics article {
          min-height: 112px;
          padding: 17px;
          border: 1px solid #e0e7e3;
          border-radius: 15px;
          background: #f9fbfa;
        }

        .metrics span {
          display: block;
          margin-bottom: 12px;
          color: #74817b;
          font-size: 11px;
          font-weight: 850;
          letter-spacing: 0.07em;
          text-transform: uppercase;
        }

        .metrics strong {
          color: #173128;
          font-size: 19px;
          line-height: 1.35;
        }

        .actions {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 18px;
        }

        button {
          padding: 12px 15px;
          border-radius: 11px;
          font: inherit;
          font-weight: 850;
          cursor: pointer;
        }

        button:disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }

        .repairButton {
          border: 1px solid #bfd8cd;
          background: #edf8f3;
          color: #08724f;
        }

        .clearButton {
          border: 1px solid #ecc8c8;
          background: #fff3f3;
          color: #a13737;
        }

        .notice {
          margin-top: 16px;
          padding: 13px 15px;
          border: 1px solid #d8e4de;
          border-radius: 12px;
          background: #f5f8f6;
          color: #40574c;
          font-size: 13px;
          font-weight: 750;
        }

        .notice[data-tone="success"] {
          border-color: #b7dfcf;
          background: #eaf8f2;
          color: #08724f;
        }

        .notice[data-tone="error"] {
          border-color: #efc6c6;
          background: #fff0f0;
          color: #9b3131;
        }

        .boundary {
          margin: 16px 0 0;
          color: #7a8781;
          font-size: 12px;
          line-height: 1.55;
        }

        @media (max-width: 760px) {
          .heading {
            flex-direction: column;
          }

          .metrics {
            grid-template-columns: 1fr;
          }

          .actions button {
            width: 100%;
          }
        }
      `}</style>
    </section>
  );
}
