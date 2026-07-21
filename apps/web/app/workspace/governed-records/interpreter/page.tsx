"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type ReviewState = "IDLE" | "HOLD" | "READY";

const SAMPLE_RECORD = `Record ID: AIR-2026-07-20-118
Record class: Atmospheric Integrity Record
Declared source: Building sensor network
Declared location: Mechanical room and occupied zone
Declared period: 2026-07-19 00:00–23:59 ET
Measurements: temperature, relative humidity, dew point, CO2, PM2.5, VOC
Continuity: 23h 41m captured
Missing interval: 14:11–14:29 ET
Calibration status: current for four of six sensing nodes
Requested interpretation: Determine whether the record proves acceptable atmospheric conditions for the entire declared period.`;

export default function GovernedRecordInterpreterPage() {
  const [recordText, setRecordText] = useState("");
  const [recordClass, setRecordClass] = useState("");
  const [question, setQuestion] = useState("");
  const [state, setState] = useState<ReviewState>("IDLE");

  const hasGap = useMemo(
    () => /missing|gap|interruption|unavailable/i.test(recordText),
    [recordText],
  );

  const hasCalibrationConcern = useMemo(
    () => /calibration.*(missing|expired|partial|four of six|unknown)/i.test(
      recordText,
    ),
    [recordText],
  );

  const hasTimeBoundary = useMemo(
    () => /period|from|through|00:00|23:59|ET|UTC/i.test(recordText),
    [recordText],
  );

  function loadSample() {
    setRecordText(SAMPLE_RECORD);
    setRecordClass("Atmospheric Integrity Record");
    setQuestion(
      "Does this record prove acceptable atmospheric conditions for the entire declared period?",
    );
    setState("IDLE");
  }

  function clearAll() {
    setRecordText("");
    setRecordClass("");
    setQuestion("");
    setState("IDLE");
  }

  function interpretRecord() {
    if (!recordText.trim() || !recordClass.trim() || !question.trim()) {
      setState("HOLD");
      return;
    }

    setState("READY");
  }

  return (
    <>
      <style>{`
        :root {
          --gri-bg: #02090b;
          --gri-panel: rgba(5, 20, 22, 0.9);
          --gri-border: rgba(114, 240, 189, 0.15);
          --gri-text: #f5fbf9;
          --gri-muted: #8ca7a1;
          --gri-teal: #72f0bd;
          --gri-cyan: #65e4ff;
          --gri-gold: #ffd27a;
          --gri-violet: #b79fff;
        }

        .gri-page {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          color: var(--gri-text);
          background:
            radial-gradient(circle at 14% 8%, rgba(101,228,255,0.12), transparent 28%),
            radial-gradient(circle at 86% 12%, rgba(114,240,189,0.11), transparent 28%),
            radial-gradient(circle at 52% 88%, rgba(183,159,255,0.08), transparent 30%),
            linear-gradient(180deg, #02090b 0%, #031315 54%, #020709 100%);
        }

        .gri-page *,
        .gri-page *::before,
        .gri-page *::after {
          box-sizing: border-box;
        }

        .gri-space {
          position: fixed;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .gri-grid {
          position: absolute;
          inset: 0;
          opacity: 0.12;
          background-image:
            linear-gradient(rgba(101,228,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(101,228,255,0.05) 1px, transparent 1px);
          background-size: 70px 70px;
          animation: griGrid 24s linear infinite;
          mask-image: radial-gradient(circle at center, black, transparent 87%);
        }

        .gri-orbit {
          position: absolute;
          top: 10%;
          right: 3%;
          width: 390px;
          height: 390px;
          border: 1px solid rgba(114,240,189,0.14);
          border-radius: 50%;
          animation: griOrbit 22s linear infinite;
        }

        .gri-orbit::before,
        .gri-orbit::after {
          content: "";
          position: absolute;
          border-radius: 50%;
        }

        .gri-orbit::before {
          inset: 18%;
          border: 1px solid rgba(101,228,255,0.14);
        }

        .gri-orbit::after {
          top: 50%;
          left: -6px;
          width: 12px;
          height: 12px;
          background: var(--gri-cyan);
          box-shadow: 0 0 22px var(--gri-cyan);
        }

        .gri-shell {
          position: relative;
          z-index: 1;
          width: min(1280px, calc(100% - 28px));
          margin: 0 auto;
          padding: 24px 0 68px;
        }

        .gri-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          padding-bottom: 22px;
          border-bottom: 1px solid rgba(114,240,189,0.1);
        }

        .gri-brand,
        .gri-return {
          color: inherit;
          text-decoration: none;
        }

        .gri-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          font-weight: 900;
        }

        .gri-mark {
          display: grid;
          width: 44px;
          height: 44px;
          place-items: center;
          border: 1px solid rgba(114,240,189,0.26);
          border-radius: 14px;
          color: var(--gri-teal);
          background: rgba(114,240,189,0.07);
          font-size: 11px;
        }

        .gri-return {
          color: #a3b7b2;
          font-size: 13px;
          font-weight: 800;
        }

        .gri-hero {
          padding: 54px 0 32px;
        }

        .gri-kicker {
          color: var(--gri-teal);
          font-size: 10px;
          font-weight: 950;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .gri-hero h1 {
          max-width: 1000px;
          margin: 18px 0 16px;
          font-size: clamp(3rem, 7vw, 6.8rem);
          line-height: 0.94;
          letter-spacing: -0.065em;
        }

        .gri-hero h1 span {
          display: block;
          color: transparent;
          background: linear-gradient(90deg, white, var(--gri-teal), var(--gri-cyan));
          background-clip: text;
          -webkit-background-clip: text;
        }

        .gri-hero p {
          max-width: 870px;
          margin: 0;
          color: var(--gri-muted);
          font-size: 16px;
          line-height: 1.75;
        }

        .gri-layout {
          display: grid;
          grid-template-columns: minmax(0, 1.1fr) minmax(340px, 0.9fr);
          gap: 18px;
        }

        .gri-panel {
          border: 1px solid var(--gri-border);
          border-radius: 24px;
          background: var(--gri-panel);
          box-shadow: 0 26px 70px rgba(0,0,0,0.25);
          backdrop-filter: blur(22px);
        }

        .gri-panel-head {
          padding: 22px 22px 0;
        }

        .gri-panel-head h2 {
          margin: 0;
          font-size: 1.7rem;
          letter-spacing: -0.04em;
        }

        .gri-panel-head p {
          margin: 9px 0 0;
          color: var(--gri-muted);
          font-size: 12px;
          line-height: 1.62;
        }

        .gri-editor {
          padding: 20px 22px 22px;
        }

        .gri-textarea {
          width: 100%;
          min-height: 430px;
          padding: 17px;
          border: 1px solid rgba(114,240,189,0.14);
          border-radius: 15px;
          color: #eaf7f3;
          background: rgba(2,10,12,0.82);
          resize: vertical;
          outline: none;
          font: 12px/1.72 ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        }

        .gri-textarea:focus,
        .gri-input:focus {
          border-color: rgba(101,228,255,0.42);
          box-shadow: 0 0 0 3px rgba(101,228,255,0.06);
        }

        .gri-fields {
          display: grid;
          gap: 14px;
          padding: 20px 22px 22px;
        }

        .gri-label {
          display: grid;
          gap: 7px;
          color: #a9bdb8;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.09em;
          text-transform: uppercase;
        }

        .gri-input {
          width: 100%;
          height: 48px;
          padding: 0 13px;
          border: 1px solid rgba(114,240,189,0.14);
          border-radius: 12px;
          color: white;
          background: rgba(2,10,12,0.78);
          outline: none;
        }

        .gri-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          padding: 0 22px 22px;
        }

        .gri-button,
        .gri-link {
          display: inline-flex;
          min-height: 44px;
          align-items: center;
          justify-content: center;
          padding: 0 16px;
          border: 1px solid var(--gri-border);
          border-radius: 12px;
          color: white;
          background: rgba(255,255,255,0.04);
          font-size: 12px;
          font-weight: 900;
          cursor: pointer;
          text-decoration: none;
        }

        .gri-button.primary {
          color: #03110d;
          border-color: transparent;
          background: linear-gradient(135deg, var(--gri-teal), var(--gri-cyan));
        }

        .gri-boundary {
          margin: 0 22px 22px;
          padding: 16px;
          border: 1px solid rgba(183,159,255,0.17);
          border-radius: 16px;
          background: rgba(183,159,255,0.05);
        }

        .gri-boundary strong {
          display: block;
          color: #e6e0ff;
          font-size: 12px;
        }

        .gri-boundary p {
          margin: 8px 0 0;
          color: #938dab;
          font-size: 11px;
          line-height: 1.62;
        }

        .gri-result {
          margin-top: 18px;
          padding: 24px;
          border: 1px solid var(--gri-border);
          border-radius: 24px;
          background: rgba(5,20,22,0.9);
        }

        .gri-result.hold {
          border-color: rgba(255,210,122,0.22);
          background: rgba(40,29,12,0.5);
        }

        .gri-result.ready {
          border-color: rgba(114,240,189,0.25);
        }

        .gri-result h3 {
          margin: 0;
          font-size: 1.5rem;
        }

        .gri-result p {
          margin: 10px 0 0;
          color: var(--gri-muted);
          line-height: 1.72;
        }

        .gri-findings {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
          margin-top: 18px;
        }

        .gri-finding {
          padding: 16px;
          border: 1px solid rgba(114,240,189,0.12);
          border-radius: 16px;
          background: rgba(255,255,255,0.025);
        }

        .gri-finding small {
          display: block;
          color: #6f8b85;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .gri-finding strong {
          display: block;
          margin-top: 8px;
          font-size: 13px;
        }

        .gri-finding span {
          display: block;
          margin-top: 6px;
          color: var(--gri-muted);
          font-size: 11px;
          line-height: 1.55;
        }

        @keyframes griGrid {
          from { transform: translateX(0); }
          to { transform: translateX(70px); }
        }

        @keyframes griOrbit {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 950px) {
          .gri-layout {
            grid-template-columns: 1fr;
          }

          .gri-findings {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 680px) {
          .gri-shell {
            width: min(100% - 18px, 1280px);
          }

          .gri-topbar {
            align-items: flex-start;
            flex-direction: column;
          }

          .gri-hero h1 {
            font-size: clamp(3.1rem, 15vw, 5rem);
          }

          .gri-button,
          .gri-link {
            width: 100%;
          }
        }
      `}</style>

      <div className="gri-page">
        <div className="gri-space" aria-hidden="true">
          <div className="gri-grid" />
          <div className="gri-orbit" />
        </div>

        <main className="gri-shell">
          <header className="gri-topbar">
            <Link className="gri-brand" href="/workspace/governed-records">
              <span className="gri-mark">TA-14</span>
              <span>Governed Records</span>
            </Link>

            <Link className="gri-return" href="/workspace/governed-records">
              Return to Governed Records Playground
            </Link>
          </header>

          <section className="gri-hero">
            <div className="gri-kicker">Governed Record Interpreter</div>
            <h1>
              Interpret the record
              <span>without rewriting reality.</span>
            </h1>
            <p>
              The Governed Record Interpreter separates the original record
              from the interpretation, identifies evidence limits, and refuses
              conclusions that exceed the record&apos;s actual standing.
            </p>
          </section>

          <section className="gri-layout">
            <article className="gri-panel">
              <div className="gri-panel-head">
                <h2>Record under interpretation.</h2>
                <p>
                  Paste the preserved source exactly as received. Do not repair
                  gaps, remove contradictions, or add missing authority.
                </p>
              </div>

              <div className="gri-editor">
                <textarea
                  className="gri-textarea"
                  value={recordText}
                  onChange={(event) => {
                    setRecordText(event.target.value);
                    setState("IDLE");
                  }}
                  placeholder="Paste the governed record here..."
                />
              </div>
            </article>

            <aside className="gri-panel">
              <div className="gri-panel-head">
                <h2>Interpretation boundary.</h2>
                <p>
                  Define what the record is and the precise question being
                  asked of it.
                </p>
              </div>

              <div className="gri-fields">
                <label className="gri-label">
                  Record class
                  <input
                    className="gri-input"
                    value={recordClass}
                    onChange={(event) => {
                      setRecordClass(event.target.value);
                      setState("IDLE");
                    }}
                    placeholder="Atmospheric, environmental, diagnostic..."
                  />
                </label>

                <label className="gri-label">
                  Interpretation question
                  <input
                    className="gri-input"
                    value={question}
                    onChange={(event) => {
                      setQuestion(event.target.value);
                      setState("IDLE");
                    }}
                    placeholder="What must the record be allowed or refused to support?"
                  />
                </label>
              </div>

              <div className="gri-boundary">
                <strong>Interpretation is not diagnosis or optimization.</strong>
                <p>
                  The interpreter identifies what the record supports, what it
                  does not support, and what remains unresolved. It does not
                  alter the source or manufacture admissibility.
                </p>
              </div>

              <div className="gri-actions">
                <button
                  className="gri-button primary"
                  type="button"
                  onClick={interpretRecord}
                >
                  Generate Governed Interpretation
                </button>

                <button
                  className="gri-button"
                  type="button"
                  onClick={loadSample}
                >
                  Load Sample
                </button>

                <button
                  className="gri-button"
                  type="button"
                  onClick={clearAll}
                >
                  Clear
                </button>
              </div>
            </aside>
          </section>

          {state === "HOLD" ? (
            <section className="gri-result hold">
              <h3>HOLD — interpretation boundary incomplete.</h3>
              <p>
                The original record, record class, and interpretation question
                must all be present before a bounded interpretation can be
                generated.
              </p>
            </section>
          ) : null}

          {state === "READY" ? (
            <section className="gri-result ready">
              <h3>Governed Interpretation</h3>
              <p>
                The submitted record provides evidence relevant to the declared
                question, but it does not prove the requested conclusion for the
                entire declared period. The interpretation remains bounded by
                continuity, calibration, and time-boundary limitations present
                in the source.
              </p>

              <div className="gri-findings">
                <div className="gri-finding">
                  <small>Supported</small>
                  <strong>Partial evidence exists</strong>
                  <span>
                    The record contains measurements and a declared period that
                    can support limited review.
                  </span>
                </div>

                <div className="gri-finding">
                  <small>Continuity</small>
                  <strong>{hasGap ? "Gap detected" : "No explicit gap detected"}</strong>
                  <span>
                    {hasGap
                      ? "The record contains an interruption or missing interval that prevents whole-period proof."
                      : "No explicit continuity gap was found in the submitted text, but continuity is not independently verified."}
                  </span>
                </div>

                <div className="gri-finding">
                  <small>Calibration</small>
                  <strong>
                    {hasCalibrationConcern
                      ? "Calibration standing limited"
                      : "Calibration standing undeclared"}
                  </strong>
                  <span>
                    {hasCalibrationConcern
                      ? "The source identifies incomplete or uncertain calibration coverage."
                      : "The record does not provide enough calibration evidence to support unrestricted reliance."}
                  </span>
                </div>

                <div className="gri-finding">
                  <small>Time boundary</small>
                  <strong>{hasTimeBoundary ? "Declared" : "Insufficiently declared"}</strong>
                  <span>
                    The interpretation applies only to the period actually
                    represented by the record.
                  </span>
                </div>

                <div className="gri-finding">
                  <small>Refused conclusion</small>
                  <strong>Whole-period proof</strong>
                  <span>
                    The record cannot support an unrestricted claim covering
                    intervals or sensing nodes without admissible evidence.
                  </span>
                </div>

                <div className="gri-finding">
                  <small>Next admissible step</small>
                  <strong>Continuity review</strong>
                  <span>
                    Review sequence, missing intervals, calibration standing,
                    and source authority before any stronger conclusion.
                  </span>
                </div>
              </div>

              <div className="gri-actions" style={{ padding: "20px 0 0" }}>
                <Link
                  className="gri-link"
                  href="/workspace/governed-records/continuity-review"
                >
                  Continue to Continuity Review
                </Link>

                <Link
                  className="gri-link"
                  href="/workspace/governed-records"
                >
                  Return to Playground
                </Link>
              </div>
            </section>
          ) : null}
        </main>
      </div>
    </>
  );
}
