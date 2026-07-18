"use client";

import {
  type ChangeEvent,
  type DragEvent,
  useRef,
  useState,
} from "react";
import {
  downloadRouteLibraryBackup,
  importRouteLibraryBackup,
  parseRouteLibraryBackup,
  type RouteLibraryImportMode,
} from "../../../lib/route-library-transfer";

type Notice = {
  tone: "success" | "error" | "info";
  message: string;
} | null;

type RouteLibraryTransferPanelProps = {
  onImported?: () => void;
};

export default function RouteLibraryTransferPanel({
  onImported,
}: RouteLibraryTransferPanelProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] =
    useState<RouteLibraryImportMode>("MERGE");
  const [dragActive, setDragActive] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);
  const [busy, setBusy] = useState(false);

  async function importFile(file: File) {
    setBusy(true);
    setNotice({
      tone: "info",
      message: "Validating route library backup…",
    });

    try {
      const text = await file.text();
      const backup = parseRouteLibraryBackup(text);

      if (
        mode === "REPLACE" &&
        !window.confirm(
          "Replace your current My Routes library with this backup? This cannot be undone unless you export the current library first.",
        )
      ) {
        setNotice({
          tone: "info",
          message: "Import cancelled. No routes were changed.",
        });
        return;
      }

      const result = importRouteLibraryBackup(backup, mode);

      setNotice({
        tone: "success",
        message:
          mode === "REPLACE"
            ? `Library replaced. ${result.total} routes are now available.`
            : `Backup merged. ${result.imported} added, ${result.updated} updated, and ${result.skipped} skipped.`,
      });

      onImported?.();
    } catch (error) {
      setNotice({
        tone: "error",
        message:
          error instanceof Error
            ? error.message
            : "The route library backup could not be imported.",
      });
    } finally {
      setBusy(false);

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  }

  function handleBrowse(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];

    if (file) {
      void importFile(file);
    }
  }

  function handleDragOver(
    event: DragEvent<HTMLDivElement>,
  ) {
    event.preventDefault();
    setDragActive(true);
  }

  function handleDragLeave(
    event: DragEvent<HTMLDivElement>,
  ) {
    if (
      event.currentTarget.contains(
        event.relatedTarget as Node | null,
      )
    ) {
      return;
    }

    setDragActive(false);
  }

  function handleDrop(
    event: DragEvent<HTMLDivElement>,
  ) {
    event.preventDefault();
    setDragActive(false);

    const file = event.dataTransfer.files?.[0];

    if (file) {
      void importFile(file);
    }
  }

  return (
    <section className="transferPanel">
      <div className="heading">
        <div>
          <p className="eyebrow">Library portability</p>
          <h2>Back up or restore My Routes</h2>
          <p>
            Export all locally saved routes as one TA-14 backup
            file, or restore a previous backup into this browser.
          </p>
        </div>

        <button
          type="button"
          className="exportButton"
          onClick={downloadRouteLibraryBackup}
        >
          Export library
        </button>
      </div>

      <div className="importGrid">
        <div
          className={`dropZone ${
            dragActive ? "active" : ""
          }`}
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(event) => {
            if (
              event.key === "Enter" ||
              event.key === " "
            ) {
              event.preventDefault();
              inputRef.current?.click();
            }
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <strong>
            {busy
              ? "Importing backup…"
              : "Drop a TA-14 route library backup here"}
          </strong>
          <span>or click to choose a JSON file</span>

          <input
            ref={inputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleBrowse}
            disabled={busy}
          />
        </div>

        <div className="modeCard">
          <span>Import mode</span>

          <label>
            <input
              type="radio"
              name="route-library-import-mode"
              value="MERGE"
              checked={mode === "MERGE"}
              onChange={() => setMode("MERGE")}
            />
            <div>
              <strong>Merge with My Routes</strong>
              <p>
                Add new routes and replace older copies only
                when the backup contains a newer version.
              </p>
            </div>
          </label>

          <label>
            <input
              type="radio"
              name="route-library-import-mode"
              value="REPLACE"
              checked={mode === "REPLACE"}
              onChange={() => setMode("REPLACE")}
            />
            <div>
              <strong>Replace My Routes</strong>
              <p>
                Remove the current local library and restore only
                the routes contained in the backup.
              </p>
            </div>
          </label>
        </div>
      </div>

      {notice ? (
        <div className="notice" data-tone={notice.tone}>
          {notice.message}
        </div>
      ) : null}

      <p className="warning">
        My Routes is browser-local storage, not an authoritative
        execution record. Export backups before clearing browser
        data or moving to another device.
      </p>

      <style jsx>{`
        .transferPanel {
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

        button,
        input {
          font: inherit;
        }

        .exportButton {
          flex: 0 0 auto;
          padding: 12px 16px;
          border: 1px solid #123c2e;
          border-radius: 11px;
          background: #123c2e;
          color: white;
          font-weight: 850;
          cursor: pointer;
        }

        .importGrid {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 16px;
          margin-top: 22px;
        }

        .dropZone {
          display: grid;
          min-height: 190px;
          place-items: center;
          align-content: center;
          gap: 8px;
          padding: 28px;
          border: 2px dashed #bfd1c8;
          border-radius: 16px;
          background: #f8fbf9;
          text-align: center;
          cursor: pointer;
          transition:
            border-color 160ms ease,
            background 160ms ease,
            transform 160ms ease;
        }

        .dropZone:hover,
        .dropZone.active {
          border-color: #2f9b76;
          background: #edf8f3;
          transform: translateY(-1px);
        }

        .dropZone strong {
          color: #173128;
          font-size: 17px;
        }

        .dropZone span {
          color: #6f7d76;
          font-size: 13px;
        }

        .dropZone input {
          display: none;
        }

        .modeCard {
          padding: 18px;
          border: 1px solid #dfe7e2;
          border-radius: 16px;
          background: #fbfcfb;
        }

        .modeCard > span {
          display: block;
          margin-bottom: 12px;
          color: #75827c;
          font-size: 11px;
          font-weight: 850;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .modeCard label {
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 11px;
          padding: 13px 0;
          border-top: 1px solid #e6ebe8;
          cursor: pointer;
        }

        .modeCard label:first-of-type {
          border-top: 0;
        }

        .modeCard input {
          margin-top: 3px;
          accent-color: #0f7c5c;
        }

        .modeCard strong {
          display: block;
          margin-bottom: 5px;
          color: #173128;
          font-size: 14px;
        }

        .modeCard p {
          margin-bottom: 0;
          color: #6c7972;
          font-size: 12px;
          line-height: 1.55;
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

        .warning {
          margin: 16px 0 0;
          color: #7a8781;
          font-size: 12px;
          line-height: 1.55;
        }

        @media (max-width: 760px) {
          .heading {
            flex-direction: column;
          }

          .exportButton {
            width: 100%;
          }

          .importGrid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
