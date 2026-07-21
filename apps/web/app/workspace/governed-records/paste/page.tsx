"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type PasteState = "EMPTY" | "READY" | "HOLD" | "ACCEPTED";

const SAMPLE_RECORD = `Record ID: PAIR-2026-07-20-004
Record class: Personal Atmospheric Integrity Record
Declared source: Wearable and room sensor package
Declared period: 2026-07-19 06:00–22:00 ET
Measurements: temperature, relative humidity, dew point, CO2, PM2.5, VOC, sound level
Continuity: 15h 42m captured
Missing interval: 14:11–14:29 ET
Calibration record: attached for room node only
Requested interpretation: Determine whether the record proves a safe exposure day.`;

export default function PasteGovernedRecordPage() {
  const [recordText, setRecordText] = useState("");
  const [recordTitle, setRecordTitle] = useState("");
  const [source, setSource] = useState("");
  const [purpose, setPurpose] = useState("");
  const [state, setState] = useState<PasteState>("EMPTY");

  const characterCount = recordText.length;
  const lineCount = useMemo(
    () => (recordText.trim() ? recordText.trim().split(/\r?\n/).length : 0),
    [recordText],
  );

  function loadSample() {
    setRecordText(SAMPLE_RECORD);
    setRecordTitle("Personal Atmospheric Integrity Record");
    setSource("Wearable and room sensor package");
    setPurpose("Governed interpretation of exposure evidence");
    setState("READY");
  }

  function clearAll() {
    setRecordText("");
    setRecordTitle("");
    setSource("");
    setPurpose("");
    setState("EMPTY");
  }

  function reviewPaste() {
    if (!recordText.trim()) {
      setState("EMPTY");
      return;
    }

    if (!recordTitle.trim() || !source.trim() || !purpose.trim()) {
      setState("HOLD");
      return;
    }

    setState("ACCEPTED");
  }

  return (
    <>
      <style>{`
        :root {
          --paste-bg: #02090b;
          --paste-panel: rgba(5, 20, 22, 0.88);
          --paste-border: rgba(114, 240, 189, 0.15);
          --paste-text: #f5fbf9;
          --paste-muted: #8ca7a1;
          --paste-teal: #72f0bd;
          --paste-cyan: #65e4ff;
          --paste-violet: #b79fff;
          --paste-gold: #ffd27a;
        }

        .paste-page {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          color: var(--paste-text);
          background:
            radial-gradient(circle at 14% 12%, rgba(101,228,255,0.12), transparent 28%),
            radial-gradient(circle at 86% 16%, rgba(183,159,255,0.11), transparent 29%),
            radial-gradient(circle at 52% 86%, rgba(114,240,189,0.09), transparent 30%),
            linear-gradient(180deg, #02090b 0%, #031315 54%, #020709 100%);
        }

        .paste-page *,
        .paste-page *::before,
        .paste-page *::after {
          box-sizing: border-box;
        }

        .paste-cosmos {
          position: fixed;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .paste-grid {
          position: absolute;
          inset: 0;
          opacity: 0.13;
          background-image:
            linear-gradient(rgba(101,228,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(101,228,255,0.05) 1px, transparent 1px);
          background-size: 64px 64px;
          animation: pasteGrid 22s linear infinite;
          mask-image: radial-gradient(circle at center, black, transparent 86%);
        }

        .paste-orbit {
          position: absolute;
          top: 8%;
          right: 3%;
          width: 360px;
          height: 360px;
          border: 1px solid rgba(114,240,189,0.14);
          border-radius: 50%;
          animation: pasteOrbit 20s linear infinite;
        }

        .paste-orbit::before,
        .paste-orbit::after {
          content: "";
          position: absolute;
          border-radius: 50%;
        }

        .paste-orbit::before {
          inset: 17%;
          border: 1px solid rgba(101,228,255,0.14);
        }

        .paste-orbit::after {
          top: 50%;
          left: -6px;
          width: 12px;
          height: 12px;
          background: var(--paste-cyan);
          box-shadow: 0 0 20px var(--paste-cyan);
        }

        .paste-shoot {
          position: absolute;
          top: var(--top);
          left: -20%;
          width: 170px;
          height: 2px;
          opacity: 0;
          background: linear-gradient(90deg, transparent, white, var(--paste-cyan));
          transform: rotate(-18deg);
          filter: drop-shadow(0 0 8px rgba(101,228,255,0.9));
          animation: pasteShoot var(--duration) linear infinite;
          animation-delay: var(--delay);
        }

        .paste-shell {
          position: relative;
          z-index: 1;
          width: min(1260px, calc(100% - 28px));
          margin: 0 auto;
          padding: 24px 0 64px;
        }

        .paste-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          padding-bottom: 22px;
          border-bottom: 1px solid rgba(114,240,189,0.1);
        }

        .paste-brand,
        .paste-return {
          color: inherit;
          text-decoration: none;
        }

        .paste-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          font-weight: 900;
        }

        .paste-mark {
          display: grid;
          width: 44px;
          height: 44px;
          place-items: center;
          border: 1px solid rgba(114,240,189,0.26);
          border-radius: 14px;
          color: var(--paste-teal);
          background: rgba(114,240,189,0.07);
          font-size: 11px;
        }

        .paste-return {
          color: #a3b7b2;
          font-size: 13px;
          font-weight: 800;
        }

        .paste-hero {
          padding: 54px 0 32px;
        }

        .paste-kicker {
          color: var(--paste-teal);
          font-size: 10px;
          font-weight: 950;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .paste-hero h1 {
          max-width: 980px;
          margin: 18px 0 16px;
          font-size: clamp(3rem, 7vw, 6.8rem);
          line-height: 0.94;
          letter-spacing: -0.065em;
        }

        .paste-hero h1 span {
          display: block;
          color: transparent;
          background: linear-gradient(90deg, white, var(--paste-teal), var(--paste-cyan));
          background-clip: text;
          -webkit-background-clip: text;
        }

        .paste-hero p {
          max-width: 850px;
          margin: 0;
          color: var(--paste-muted);
          font-size: 16px;
          line-height: 1.75;
        }

        .paste-grid-layout {
          display: grid;
          grid-template-columns: minmax(0, 1.25fr) minmax(320px, 0.75fr);
          gap: 18px;
        }

        .paste-panel {
          border: 1px solid var(--paste-border);
          border-radius: 24px;
          background: var(--paste-panel);
          backdrop-filter: blur(22px);
          box-shadow: 0 26px 70px rgba(0,0,0,0.25);
        }

        .paste-panel-head {
          padding: 22px 22px 0;
        }

        .paste-panel-head h2 {
          margin: 0;
          font-size: 1.7rem;
          letter-spacing: -0.04em;
        }

        .paste-panel-head p {
          margin: 9px 0 0;
          color: var(--paste-muted);
          font-size: 12px;
          line-height: 1.62;
        }

        .paste-editor {
          padding: 20px 22px 22px;
        }

        .paste-textarea {
          width: 100%;
          min-height: 430px;
          padding: 17px;
          border: 1px solid rgba(114,240,189,0.14);
          border-radius: 15px;
          color: #eaf7f3;
          background: rgba(2,10,12,0.8);
          resize: vertical;
          outline: none;
          font: 12px/1.72 ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        }

        .paste-textarea:focus {
          border-color: rgba(101,228,255,0.42);
          box-shadow: 0 0 0 3px rgba(101,228,255,0.06);
        }

        .paste-editor-foot {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          margin-top: 12px;
          color: #6f8b85;
          font-size: 10px;
          font-weight: 800;
        }

        .paste-fields {
          display: grid;
          gap: 14px;
          padding: 20px 22px 22px;
        }

        .paste-label {
          display: grid;
          gap: 7px;
          color: #a9bdb8;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.09em;
          text-transform: uppercase;
        }

        .paste-input {
          width: 100%;
          height: 48px;
          padding: 0 13px;
          border: 1px solid rgba(114,240,189,0.14);
          border-radius: 12px;
          color: white;
          background: rgba(2,10,12,0.78);
          outline: none;
        }

        .paste-input:focus {
          border-color: rgba(101,228,255,0.42);
          box-shadow: 0 0 0 3px rgba(101,228,255,0.06);
        }

        .paste-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          padding: 0 22px 22px;
        }

        .paste-button,
        .paste-link {
          display: inline-flex;
          min-height: 44px;
          align-items: center;
          justify-content: center;
          padding: 0 16px;
          border: 1px solid var(--paste-border);
          border-radius: 12px;
          color: white;
          background: rgba(255,255,255,0.04);
          font-size: 12px;
          font-weight: 900;
          cursor: pointer;
          text-decoration: none;
        }

        .paste-button.primary {
          color: #03110d;
          border-color: transparent;
          background: linear-gradient(135deg, var(--paste-teal), var(--paste-cyan));
        }

        .paste-boundary {
          margin: 0 22px 22px;
          padding: 16px;
          border: 1px solid rgba(183,159,255,0.17);
          border-radius: 16px;
          background: rgba(183,159,255,0.05);
        }

        .paste-boundary strong {
          display: block;
          color: #e6e0ff;
          font-size: 12px;
        }

        .paste-boundary p {
          margin: 8px 0 0;
          color: #938dab;
          font-size: 11px;
          line-height: 1.62;
        }

        .paste-result {
          margin-top: 18px;
          padding: 24px;
          border: 1px solid var(--paste-border);
          border-radius: 24px;
          background: rgba(5,20,22,0.88);
        }

        .paste-result.hold {
          border-color: rgba(255,210,122,0.22);
          background: rgba(40,29,12,0.48);
        }

        .paste-result.accepted {
          border-color: rgba(114,240,189,0.24);
        }

        .paste-result strong {
          display: block;
          font-size: 20px;
        }

        .paste-result p {
          margin: 9px 0 0;
          color: var(--paste-muted);
          line-height: 1.7;
        }

        @keyframes pasteGrid {
          from { transform: translateX(0); }
          to { transform: translateX(64px); }
        }

        @keyframes pasteOrbit {
          to { transform: rotate(360deg); }
        }

        @keyframes pasteShoot {
          0%, 8% { opacity: 0; transform: translateX(0) translateY(0) rotate(-18deg); }
          10% { opacity: 1; }
          38% { opacity: 0; transform: translateX(135vw) translateY(34vh) rotate(-18deg); }
          100% { opacity: 0; transform: translateX(135vw) translateY(34vh) rotate(-18deg); }
        }

        @media (max-width: 900px) {
          .paste-grid-layout {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 680px) {
          .paste-shell {
            width: min(100% - 18px, 1260px);
          }

          .paste-topbar {
            align-items: flex-start;
            flex-direction: column;
          }

          .paste-hero h1 {
            font-size: clamp(3.1rem, 15vw, 5rem);
          }

          .paste-editor-foot {
            align-items: flex-start;
            flex-direction: column;
          }

          .paste-button,
          .paste-link {
            width: 100%;
          }
        }
      `}</style>

      <div className="paste-page">
        <div className="paste-cosmos" aria-hidden="true">
          <div className="paste-grid" />
          <div className="paste-orbit" />
          <span
            className="paste-shoot"
            style={
              {
                "--top": "14%",
                "--duration": "10s",
                "--delay": "-3s",
              } as React.CSSProperties
            }
          />
          <span
            className="paste-shoot"
            style={
              {
                "--top": "51%",
                "--duration": "14s",
                "--delay": "-9s",
              } as React.CSSProperties
            }
          />
        </div>

        <main className="paste-shell">
          <header className="paste-topbar">
            <Link className="paste-brand" href="/workspace/governed-records">
              <span className="paste-mark">TA-14</span>
              <span>Governed Records</span>
            </Link>

            <Link
              className="paste-return"
              href="/workspace/governed-records"
            >
              Return to Governed Records Playground
            </Link>
          </header>

          <section className="paste-hero">
            <div className="paste-kicker">Paste a Record</div>
            <h1>
              Bring the evidence
              <span>without manufacturing the conclusion.</span>
            </h1>
            <p>
              Paste a report, transcript, sensor export, diagnostic narrative,
              or other consequential evidence directly into the Governed
              Records workspace. TA-14 preserves the submitted text as the
              starting state and keeps every later interpretation bounded to it.
            </p>
          </section>

          <section className="paste-grid-layout">
            <article className="paste-panel">
              <div className="paste-panel-head">
                <h2>Paste the original record.</h2>
                <p>
                  Do not rewrite the source to make it appear complete. Missing
                  evidence, uncertainty, and contradictions belong in the
                  preserved record.
                </p>
              </div>

              <div className="paste-editor">
                <textarea
                  className="paste-textarea"
                  value={recordText}
                  onChange={(event) => {
                    setRecordText(event.target.value);
                    setState(event.target.value.trim() ? "READY" : "EMPTY");
                  }}
                  placeholder="Paste the complete record here..."
                />

                <div className="paste-editor-foot">
                  <span>{characterCount.toLocaleString()} characters</span>
                  <span>{lineCount.toLocaleString()} lines</span>
                  <span>Original text remains separate from interpretation</span>
                </div>
              </div>
            </article>

            <aside className="paste-panel">
              <div className="paste-panel-head">
                <h2>Declare the record context.</h2>
                <p>
                  The record title, source, and requested review purpose must be
                  known before interpretation begins.
                </p>
              </div>

              <div className="paste-fields">
                <label className="paste-label">
                  Record title or class
                  <input
                    className="paste-input"
                    value={recordTitle}
                    onChange={(event) => setRecordTitle(event.target.value)}
                    placeholder="What is this record?"
                  />
                </label>

                <label className="paste-label">
                  Declared source
                  <input
                    className="paste-input"
                    value={source}
                    onChange={(event) => setSource(event.target.value)}
                    placeholder="Where did the record originate?"
                  />
                </label>

                <label className="paste-label">
                  Requested review purpose
                  <input
                    className="paste-input"
                    value={purpose}
                    onChange={(event) => setPurpose(event.target.value)}
                    placeholder="What question is being asked of it?"
                  />
                </label>
              </div>

              <div className="paste-boundary">
                <strong>Pasting does not make a record admissible.</strong>
                <p>
                  Provenance, continuity, authority, measurement quality, and
                  requested conclusions remain subject to independent review.
                </p>
              </div>

              <div className="paste-actions">
                <button
                  className="paste-button primary"
                  type="button"
                  onClick={reviewPaste}
                >
                  Preserve Pasted Record
                </button>

                <button
                  className="paste-button"
                  type="button"
                  onClick={loadSample}
                >
                  Load Sample
                </button>

                <button
                  className="paste-button"
                  type="button"
                  onClick={clearAll}
                >
                  Clear
                </button>
              </div>
            </aside>
          </section>

          {state === "HOLD" ? (
            <section className="paste-result hold">
              <strong>HOLD — the record context is incomplete.</strong>
              <p>
                The pasted text is present, but the title or class, declared
                source, and requested review purpose must all be identified
                before a bounded interpretation can begin.
              </p>
            </section>
          ) : null}

          {state === "ACCEPTED" ? (
            <section className="paste-result accepted">
              <strong>PASTED RECORD PRESERVED FOR REVIEW</strong>
              <p>
                The submitted text and declared context are now present as a
                bounded starting state. No conclusion, diagnosis, or authority
                has been admitted merely because the record was preserved.
              </p>

              <div className="paste-actions" style={{ padding: "18px 0 0" }}>
                <Link
                  className="paste-link"
                  href="/workspace/governed-records"
                >
                  Return to Playground
                </Link>

                <Link
                  className="paste-link"
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
