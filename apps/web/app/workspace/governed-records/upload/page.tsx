"use client";

import Link from "next/link";
import { ChangeEvent, DragEvent, useMemo, useState } from "react";

type UploadState = "EMPTY" | "READY" | "ACCEPTED" | "HOLD";

type UploadedRecord = {
  name: string;
  size: number;
  type: string;
};

const ACCEPTED_TYPES = [
  "PDF",
  "CSV",
  "JSON",
  "TXT",
  "XLSX",
  "DOCX",
  "Sensor export",
] as const;

export default function UploadGovernedRecordPage() {
  const [record, setRecord] = useState<UploadedRecord | null>(null);
  const [state, setState] = useState<UploadState>("EMPTY");
  const [isDragging, setIsDragging] = useState(false);
  const [purpose, setPurpose] = useState("");
  const [authority, setAuthority] = useState("");
  const [period, setPeriod] = useState("");

  const formattedSize = useMemo(() => {
    if (!record) return "";
    if (record.size < 1024) return `${record.size} B`;
    if (record.size < 1024 * 1024)
      return `${(record.size / 1024).toFixed(1)} KB`;
    return `${(record.size / (1024 * 1024)).toFixed(1)} MB`;
  }, [record]);

  function acceptFile(file?: File) {
    if (!file) return;

    setRecord({
      name: file.name,
      size: file.size,
      type: file.type || "Unknown file type",
    });
    setState("READY");
  }

  function handleInput(event: ChangeEvent<HTMLInputElement>) {
    acceptFile(event.target.files?.[0]);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    acceptFile(event.dataTransfer.files?.[0]);
  }

  function reviewUpload() {
    if (!record) {
      setState("EMPTY");
      return;
    }

    if (!purpose.trim() || !authority.trim() || !period.trim()) {
      setState("HOLD");
      return;
    }

    setState("ACCEPTED");
  }

  function clearUpload() {
    setRecord(null);
    setPurpose("");
    setAuthority("");
    setPeriod("");
    setState("EMPTY");
  }

  return (
    <>
      <style>{`
        :root {
          --upload-bg: #02090b;
          --upload-panel: rgba(5, 20, 22, 0.88);
          --upload-border: rgba(114, 240, 189, 0.15);
          --upload-text: #f5fbf9;
          --upload-muted: #8ca7a1;
          --upload-teal: #72f0bd;
          --upload-cyan: #65e4ff;
          --upload-gold: #ffd27a;
          --upload-red: #ff9b9b;
        }

        .upload-page {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          color: var(--upload-text);
          background:
            radial-gradient(circle at 16% 12%, rgba(101,228,255,0.12), transparent 29%),
            radial-gradient(circle at 84% 18%, rgba(114,240,189,0.12), transparent 28%),
            linear-gradient(180deg, #02090b 0%, #031315 54%, #020709 100%);
        }

        .upload-page *,
        .upload-page *::before,
        .upload-page *::after {
          box-sizing: border-box;
        }

        .upload-stars {
          position: fixed;
          inset: 0;
          pointer-events: none;
          opacity: 0.48;
          background-image:
            radial-gradient(circle at 12% 18%, white 0 1px, transparent 2px),
            radial-gradient(circle at 28% 64%, white 0 1px, transparent 2px),
            radial-gradient(circle at 44% 22%, #9cf2ff 0 1px, transparent 2px),
            radial-gradient(circle at 67% 41%, white 0 1px, transparent 2px),
            radial-gradient(circle at 78% 73%, #9ff4cf 0 1px, transparent 2px),
            radial-gradient(circle at 91% 11%, white 0 1px, transparent 2px);
          background-size: 280px 280px;
          animation: starDrift 20s linear infinite;
        }

        .upload-shell {
          position: relative;
          z-index: 1;
          width: min(1180px, calc(100% - 28px));
          margin: 0 auto;
          padding: 24px 0 60px;
        }

        .upload-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          padding-bottom: 22px;
          border-bottom: 1px solid rgba(114,240,189,0.1);
        }

        .upload-brand,
        .upload-return {
          color: inherit;
          text-decoration: none;
        }

        .upload-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          font-weight: 900;
        }

        .upload-mark {
          display: grid;
          width: 44px;
          height: 44px;
          place-items: center;
          border: 1px solid rgba(114,240,189,0.26);
          border-radius: 14px;
          color: var(--upload-teal);
          background: rgba(114,240,189,0.07);
          font-size: 11px;
        }

        .upload-return {
          color: #a3b7b2;
          font-size: 13px;
          font-weight: 800;
        }

        .upload-hero {
          padding: 54px 0 32px;
        }

        .upload-kicker {
          color: var(--upload-teal);
          font-size: 10px;
          font-weight: 950;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .upload-hero h1 {
          max-width: 900px;
          margin: 18px 0 16px;
          font-size: clamp(3rem, 7vw, 6.8rem);
          line-height: 0.94;
          letter-spacing: -0.065em;
        }

        .upload-hero h1 span {
          display: block;
          color: transparent;
          background: linear-gradient(90deg, white, var(--upload-teal), var(--upload-cyan));
          background-clip: text;
          -webkit-background-clip: text;
        }

        .upload-hero p {
          max-width: 820px;
          margin: 0;
          color: var(--upload-muted);
          font-size: 16px;
          line-height: 1.75;
        }

        .upload-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.18fr) minmax(320px, 0.82fr);
          gap: 18px;
        }

        .upload-panel {
          border: 1px solid var(--upload-border);
          border-radius: 24px;
          background: var(--upload-panel);
          backdrop-filter: blur(22px);
          box-shadow: 0 26px 70px rgba(0,0,0,0.25);
        }

        .upload-panel-head {
          padding: 22px 22px 0;
        }

        .upload-panel-head h2 {
          margin: 0;
          font-size: 1.7rem;
          letter-spacing: -0.04em;
        }

        .upload-panel-head p {
          margin: 9px 0 0;
          color: var(--upload-muted);
          font-size: 12px;
          line-height: 1.62;
        }

        .upload-dropzone {
          margin: 20px 22px;
          min-height: 310px;
          display: grid;
          place-items: center;
          padding: 26px;
          border: 1px dashed rgba(114,240,189,0.28);
          border-radius: 20px;
          text-align: center;
          background:
            linear-gradient(135deg, rgba(114,240,189,0.05), rgba(101,228,255,0.035));
          transition:
            border-color 160ms ease,
            background 160ms ease,
            transform 160ms ease;
        }

        .upload-dropzone.dragging {
          border-color: var(--upload-cyan);
          background:
            linear-gradient(135deg, rgba(101,228,255,0.1), rgba(114,240,189,0.08));
          transform: scale(1.01);
        }

        .upload-dropzone input {
          display: none;
        }

        .upload-icon {
          display: grid;
          width: 78px;
          height: 78px;
          margin: 0 auto 18px;
          place-items: center;
          border: 1px solid rgba(101,228,255,0.24);
          border-radius: 24px;
          color: var(--upload-cyan);
          background: rgba(101,228,255,0.06);
          font-size: 30px;
          box-shadow: 0 0 34px rgba(101,228,255,0.08);
        }

        .upload-dropzone strong {
          display: block;
          font-size: 18px;
        }

        .upload-dropzone span {
          display: block;
          margin-top: 8px;
          color: var(--upload-muted);
          font-size: 12px;
          line-height: 1.6;
        }

        .upload-choose {
          display: inline-flex;
          min-height: 44px;
          align-items: center;
          justify-content: center;
          margin-top: 18px;
          padding: 0 16px;
          border-radius: 12px;
          color: #03110d;
          background: linear-gradient(135deg, var(--upload-teal), var(--upload-cyan));
          font-size: 12px;
          font-weight: 900;
          cursor: pointer;
        }

        .upload-file-card {
          margin: 0 22px 22px;
          padding: 16px;
          border: 1px solid rgba(114,240,189,0.15);
          border-radius: 16px;
          background: rgba(255,255,255,0.025);
        }

        .upload-file-card strong {
          display: block;
          overflow-wrap: anywhere;
        }

        .upload-file-card span {
          display: block;
          margin-top: 6px;
          color: var(--upload-muted);
          font-size: 11px;
        }

        .upload-fields {
          display: grid;
          gap: 14px;
          padding: 20px 22px 22px;
        }

        .upload-label {
          display: grid;
          gap: 7px;
          color: #a9bdb8;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.09em;
          text-transform: uppercase;
        }

        .upload-input {
          width: 100%;
          height: 48px;
          padding: 0 13px;
          border: 1px solid rgba(114,240,189,0.14);
          border-radius: 12px;
          color: white;
          background: rgba(2,10,12,0.78);
          outline: none;
        }

        .upload-input:focus {
          border-color: rgba(101,228,255,0.42);
          box-shadow: 0 0 0 3px rgba(101,228,255,0.06);
        }

        .upload-types {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          padding: 0 22px 20px;
        }

        .upload-type {
          padding: 7px 10px;
          border: 1px solid rgba(114,240,189,0.12);
          border-radius: 999px;
          color: #9db2ad;
          background: rgba(255,255,255,0.025);
          font-size: 10px;
          font-weight: 800;
        }

        .upload-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          padding: 0 22px 22px;
        }

        .upload-button,
        .upload-link {
          display: inline-flex;
          min-height: 44px;
          align-items: center;
          justify-content: center;
          padding: 0 16px;
          border: 1px solid var(--upload-border);
          border-radius: 12px;
          color: white;
          background: rgba(255,255,255,0.04);
          font-size: 12px;
          font-weight: 900;
          cursor: pointer;
          text-decoration: none;
        }

        .upload-button.primary {
          color: #03110d;
          border-color: transparent;
          background: linear-gradient(135deg, var(--upload-teal), var(--upload-cyan));
        }

        .upload-result {
          margin-top: 18px;
          padding: 24px;
          border: 1px solid var(--upload-border);
          border-radius: 24px;
          background: rgba(5,20,22,0.88);
        }

        .upload-result.hold {
          border-color: rgba(255,210,122,0.22);
          background: rgba(40,29,12,0.48);
        }

        .upload-result.accepted {
          border-color: rgba(114,240,189,0.24);
        }

        .upload-result strong {
          display: block;
          font-size: 20px;
        }

        .upload-result p {
          margin: 9px 0 0;
          color: var(--upload-muted);
          line-height: 1.7;
        }

        @keyframes starDrift {
          from { transform: translateY(0); }
          to { transform: translateY(40px); }
        }

        @media (max-width: 900px) {
          .upload-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 680px) {
          .upload-shell {
            width: min(100% - 18px, 1180px);
          }

          .upload-topbar {
            align-items: flex-start;
            flex-direction: column;
          }

          .upload-hero h1 {
            font-size: clamp(3.1rem, 15vw, 5rem);
          }

          .upload-button,
          .upload-link {
            width: 100%;
          }
        }
      `}</style>

      <div className="upload-page">
        <div className="upload-stars" aria-hidden="true" />

        <main className="upload-shell">
          <header className="upload-topbar">
            <Link className="upload-brand" href="/workspace/governed-records">
              <span className="upload-mark">TA-14</span>
              <span>Governed Records</span>
            </Link>

            <Link
              className="upload-return"
              href="/workspace/governed-records"
            >
              Return to Governed Records Playground
            </Link>
          </header>

          <section className="upload-hero">
            <div className="upload-kicker">Upload a Record</div>
            <h1>
              Preserve the original
              <span>before interpretation begins.</span>
            </h1>
            <p>
              Bring a document, sensor export, report, or other consequential
              record into the Governed Records workspace. The original file
              remains separate from every later finding, limitation, and
              governed interpretation.
            </p>
          </section>

          <section className="upload-grid">
            <article className="upload-panel">
              <div className="upload-panel-head">
                <h2>Select the original record.</h2>
                <p>
                  This demonstration captures the file identity and declared
                  context without altering the source.
                </p>
              </div>

              <div
                className={`upload-dropzone ${isDragging ? "dragging" : ""}`}
                onDragEnter={(event) => {
                  event.preventDefault();
                  setIsDragging(true);
                }}
                onDragOver={(event) => event.preventDefault()}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
              >
                <div>
                  <div className="upload-icon">↑</div>
                  <strong>Drop a record here</strong>
                  <span>
                    or choose a file from your device. The file is not treated
                    as admissible merely because it was uploaded.
                  </span>

                  <label className="upload-choose">
                    Choose Record
                    <input type="file" onChange={handleInput} />
                  </label>
                </div>
              </div>

              {record ? (
                <div className="upload-file-card">
                  <strong>{record.name}</strong>
                  <span>
                    {formattedSize} · {record.type}
                  </span>
                </div>
              ) : null}

              <div className="upload-types">
                {ACCEPTED_TYPES.map((type) => (
                  <span className="upload-type" key={type}>
                    {type}
                  </span>
                ))}
              </div>
            </article>

            <aside className="upload-panel">
              <div className="upload-panel-head">
                <h2>Declare the record boundary.</h2>
                <p>
                  A file without declared purpose, authority, and time boundary
                  cannot support a governed interpretation.
                </p>
              </div>

              <div className="upload-fields">
                <label className="upload-label">
                  Declared purpose
                  <input
                    className="upload-input"
                    value={purpose}
                    onChange={(event) => setPurpose(event.target.value)}
                    placeholder="What is this record being reviewed for?"
                  />
                </label>

                <label className="upload-label">
                  Declared authority
                  <input
                    className="upload-input"
                    value={authority}
                    onChange={(event) => setAuthority(event.target.value)}
                    placeholder="Who is authorized to submit or rely on it?"
                  />
                </label>

                <label className="upload-label">
                  Time boundary
                  <input
                    className="upload-input"
                    value={period}
                    onChange={(event) => setPeriod(event.target.value)}
                    placeholder="What period does the record cover?"
                  />
                </label>
              </div>

              <div className="upload-actions">
                <button
                  className="upload-button primary"
                  type="button"
                  onClick={reviewUpload}
                >
                  Review Upload Boundary
                </button>

                <button
                  className="upload-button"
                  type="button"
                  onClick={clearUpload}
                >
                  Clear
                </button>
              </div>
            </aside>
          </section>

          {state === "HOLD" ? (
            <section className="upload-result hold">
              <strong>HOLD — the upload boundary is incomplete.</strong>
              <p>
                The original file may be present, but purpose, authority, and
                time boundary must all be declared before the record can move
                into governed interpretation.
              </p>
            </section>
          ) : null}

          {state === "ACCEPTED" ? (
            <section className="upload-result accepted">
              <strong>RECORD ACCEPTED FOR BOUNDED REVIEW</strong>
              <p>
                The original file identity and declared review boundary are now
                present. This does not certify the record, prove continuity, or
                admit any requested conclusion.
              </p>

              <div className="upload-actions" style={{ padding: "18px 0 0" }}>
                <Link
                  className="upload-link"
                  href="/workspace/governed-records"
                >
                  Return to Playground
                </Link>
                <Link
                  className="upload-link"
                  href="/workspace/governed-records/interpreter"
                >
                  Continue to Record Interpreter
                </Link>
              </div>
            </section>
          ) : null}
        </main>
      </div>
    </>
  );
}
