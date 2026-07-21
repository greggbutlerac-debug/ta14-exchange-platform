"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type ReviewState = "IDLE" | "HOLD" | "READY";
type InterpretationStatus = "DRAFT" | "PRESERVED" | "SUPERSEDED" | "WITHDRAWN";

type InterpretationRecord = {
  interpretationId: string;
  status: InterpretationStatus;
  version: string;
  recordClass: string;
  interpretationQuestion: string;
  sourceRecordText: string;
  resultSummary: string;
  supportedFinding: string;
  continuityFinding: string;
  calibrationFinding: string;
  timeBoundaryFinding: string;
  refusedConclusion: string;
  nextAdmissibleStep: string;
  hasGap: boolean;
  hasCalibrationConcern: boolean;
  hasTimeBoundary: boolean;
  createdAt: string;
  updatedAt: string;
};

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

const WORKSPACE_KEY = "ta14-governed-record-interpreter-workspace-v2";
const LIBRARY_KEY = "ta14-governed-record-interpreter-library-v2";

function createIdentifier() {
  const now = new Date();
  const date = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("");
  const time = [
    String(now.getHours()).padStart(2, "0"),
    String(now.getMinutes()).padStart(2, "0"),
    String(now.getSeconds()).padStart(2, "0"),
  ].join("");
  const random = Math.random().toString(36).slice(2, 7).toUpperCase();

  return `TA-14-GIR-${date}-${time}-${random}`;
}

export default function GovernedRecordInterpreterPage() {
  const [recordText, setRecordText] = useState("");
  const [recordClass, setRecordClass] = useState("");
  const [question, setQuestion] = useState("");
  const [state, setState] = useState<ReviewState>("IDLE");
  const [interpretationId, setInterpretationId] = useState("");
  const [status, setStatus] = useState<InterpretationStatus>("DRAFT");
  const [version, setVersion] = useState("1.0");
  const [createdAt, setCreatedAt] = useState("");
  const [updatedAt, setUpdatedAt] = useState("");
  const [library, setLibrary] = useState<InterpretationRecord[]>([]);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const savedWorkspace = window.localStorage.getItem(WORKSPACE_KEY);
    const savedLibrary = window.localStorage.getItem(LIBRARY_KEY);

    if (savedWorkspace) {
      try {
        const parsed = JSON.parse(savedWorkspace) as InterpretationRecord;
        setInterpretationId(parsed.interpretationId || "");
        setStatus(parsed.status || "DRAFT");
        setVersion(parsed.version || "1.0");
        setRecordClass(parsed.recordClass || "");
        setQuestion(parsed.interpretationQuestion || "");
        setRecordText(parsed.sourceRecordText || "");
        setCreatedAt(parsed.createdAt || "");
        setUpdatedAt(parsed.updatedAt || "");
        setState(parsed.resultSummary ? "READY" : "IDLE");
      } catch {
        window.localStorage.removeItem(WORKSPACE_KEY);
      }
    }

    if (savedLibrary) {
      try {
        const parsed = JSON.parse(savedLibrary) as InterpretationRecord[];
        setLibrary(Array.isArray(parsed) ? parsed : []);
      } catch {
        window.localStorage.removeItem(LIBRARY_KEY);
      }
    }
  }, []);

  const hasGap = useMemo(
    () => /missing|gap|interruption|unavailable/i.test(recordText),
    [recordText],
  );

  const hasCalibrationConcern = useMemo(
    () =>
      /calibration.*(missing|expired|partial|four of six|unknown)/i.test(
        recordText,
      ),
    [recordText],
  );

  const hasTimeBoundary = useMemo(
    () => /period|from|through|00:00|23:59|ET|UTC/i.test(recordText),
    [recordText],
  );

  const interpretation = useMemo(() => {
    const continuityFinding = hasGap
      ? "The source contains an interruption or missing interval that prevents unrestricted whole-period proof."
      : "No explicit continuity gap was detected in the submitted text, but continuity has not been independently verified.";

    const calibrationFinding = hasCalibrationConcern
      ? "The source identifies incomplete, partial, expired, missing, or uncertain calibration coverage."
      : "The source does not provide enough calibration evidence to support unrestricted reliance.";

    const timeBoundaryFinding = hasTimeBoundary
      ? "A time boundary appears to be declared. The interpretation applies only to the period actually represented by the record."
      : "The submitted source does not contain a sufficiently clear time boundary for unrestricted interpretation.";

    return {
      resultSummary:
        "The submitted record provides evidence relevant to the declared question, but it does not prove the requested conclusion for the entire declared period. The interpretation remains bounded by continuity, calibration, authority, and time-boundary limitations present in the source.",
      supportedFinding:
        "The record contains measurements, a declared record class, and contextual information that can support a limited, bounded interpretation.",
      continuityFinding,
      calibrationFinding,
      timeBoundaryFinding,
      refusedConclusion:
        "The record cannot support an unrestricted whole-period claim covering missing intervals, unverified sensing nodes, undeclared authority, or evidence outside the submitted source.",
      nextAdmissibleStep:
        "Review sequence continuity, missing intervals, calibration standing, source authority, and the exact declared period before permitting any stronger conclusion.",
    };
  }, [hasCalibrationConcern, hasGap, hasTimeBoundary]);

  function resetResult() {
    setState("IDLE");
    setNotice("");
  }

  function loadSample() {
    setRecordText(SAMPLE_RECORD);
    setRecordClass("Atmospheric Integrity Record");
    setQuestion(
      "Does this record prove acceptable atmospheric conditions for the entire declared period?",
    );
    setState("IDLE");
    setNotice("Sample governed record loaded.");
  }

  function clearAll() {
    setRecordText("");
    setRecordClass("");
    setQuestion("");
    setState("IDLE");
    setInterpretationId("");
    setStatus("DRAFT");
    setVersion("1.0");
    setCreatedAt("");
    setUpdatedAt("");
    window.localStorage.removeItem(WORKSPACE_KEY);
    setNotice(
      "The working interpretation has been cleared. Preserved records remain available below.",
    );
  }

  function interpretRecord() {
    if (!recordText.trim() || !recordClass.trim() || !question.trim()) {
      setState("HOLD");
      setNotice(
        "Interpretation placed on HOLD because the source record, record class, or interpretation question is missing.",
      );
      return;
    }

    setState("READY");
    setNotice(
      "A bounded governed interpretation has been generated. It remains separate from diagnosis, optimization, certification, and execution.",
    );
  }

  function buildRecord(nextStatus: InterpretationStatus): InterpretationRecord {
    const timestamp = new Date().toISOString();

    return {
      interpretationId: interpretationId || createIdentifier(),
      status: nextStatus,
      version: version.trim() || "1.0",
      recordClass: recordClass.trim(),
      interpretationQuestion: question.trim(),
      sourceRecordText: recordText,
      resultSummary: state === "READY" ? interpretation.resultSummary : "",
      supportedFinding:
        state === "READY" ? interpretation.supportedFinding : "",
      continuityFinding:
        state === "READY" ? interpretation.continuityFinding : "",
      calibrationFinding:
        state === "READY" ? interpretation.calibrationFinding : "",
      timeBoundaryFinding:
        state === "READY" ? interpretation.timeBoundaryFinding : "",
      refusedConclusion:
        state === "READY" ? interpretation.refusedConclusion : "",
      nextAdmissibleStep:
        state === "READY" ? interpretation.nextAdmissibleStep : "",
      hasGap,
      hasCalibrationConcern,
      hasTimeBoundary,
      createdAt: createdAt || timestamp,
      updatedAt: timestamp,
    };
  }

  function saveWorkingInterpretation() {
    if (!recordText.trim() && !recordClass.trim() && !question.trim()) {
      setNotice("There is no working interpretation to save.");
      return;
    }

    const record = buildRecord("DRAFT");

    setInterpretationId(record.interpretationId);
    setStatus(record.status);
    setCreatedAt(record.createdAt);
    setUpdatedAt(record.updatedAt);
    window.localStorage.setItem(WORKSPACE_KEY, JSON.stringify(record));
    setNotice(
      `${record.interpretationId} has been saved as a browser-local working interpretation.`,
    );
  }

  function preserveInterpretation() {
    if (state !== "READY") {
      setNotice(
        "Generate the governed interpretation before preserving the interpretation record.",
      );
      return;
    }

    const record = buildRecord("PRESERVED");
    const exists = library.some(
      (item) => item.interpretationId === record.interpretationId,
    );

    const nextLibrary = exists
      ? library.map((item) =>
          item.interpretationId === record.interpretationId ? record : item,
        )
      : [record, ...library];

    setInterpretationId(record.interpretationId);
    setStatus(record.status);
    setCreatedAt(record.createdAt);
    setUpdatedAt(record.updatedAt);
    setLibrary(nextLibrary);

    window.localStorage.setItem(WORKSPACE_KEY, JSON.stringify(record));
    window.localStorage.setItem(LIBRARY_KEY, JSON.stringify(nextLibrary));

    setNotice(
      `${record.interpretationId} has been preserved in this browser. Preservation does not establish truth, diagnosis, certification, or regulatory acceptance.`,
    );
  }

  function openInterpretation(item: InterpretationRecord) {
    setInterpretationId(item.interpretationId);
    setStatus(item.status);
    setVersion(item.version);
    setRecordClass(item.recordClass);
    setQuestion(item.interpretationQuestion);
    setRecordText(item.sourceRecordText);
    setCreatedAt(item.createdAt);
    setUpdatedAt(item.updatedAt);
    setState(item.resultSummary ? "READY" : "IDLE");

    window.localStorage.setItem(WORKSPACE_KEY, JSON.stringify(item));
    setNotice(`${item.interpretationId} has been reopened.`);
    document
      .getElementById("interpreter")
      ?.scrollIntoView({ behavior: "smooth" });
  }

  function removeInterpretation(id: string) {
    const nextLibrary = library.filter(
      (item) => item.interpretationId !== id,
    );
    setLibrary(nextLibrary);
    window.localStorage.setItem(LIBRARY_KEY, JSON.stringify(nextLibrary));
    setNotice(`${id} has been removed from this browser.`);
  }

  function exportInterpretation(item: InterpretationRecord) {
    const blob = new Blob([JSON.stringify(item, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${item.interpretationId}.json`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
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

        .gri-notice {
          margin-bottom: 18px;
          padding: 14px 16px;
          border: 1px solid rgba(101,228,255,0.2);
          border-radius: 14px;
          color: #c8eff7;
          background: rgba(101,228,255,0.055);
          font-size: 12px;
          line-height: 1.65;
        }

        .gri-active {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 18px;
          padding: 15px 17px;
          border: 1px solid rgba(255,210,122,0.18);
          border-radius: 16px;
          background: rgba(255,210,122,0.045);
        }

        .gri-active strong {
          display: block;
          color: var(--gri-gold);
          font-size: 12px;
        }

        .gri-active span {
          color: #a99d86;
          font-size: 11px;
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
        .gri-input:focus,
        .gri-select:focus {
          border-color: rgba(101,228,255,0.42);
          box-shadow: 0 0 0 3px rgba(101,228,255,0.06);
        }

        .gri-fields {
          display: grid;
          gap: 14px;
          padding: 20px 22px 22px;
        }

        .gri-two {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
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

        .gri-input,
        .gri-select {
          width: 100%;
          height: 48px;
          padding: 0 13px;
          border: 1px solid rgba(114,240,189,0.14);
          border-radius: 12px;
          color: white;
          background: rgba(2,10,12,0.78);
          outline: none;
        }

        .gri-select option {
          color: white;
          background: #031315;
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

        .gri-button.danger {
          color: #ffc8c8;
          border-color: rgba(255,120,120,0.18);
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

        .gri-library {
          margin-top: 72px;
        }

        .gri-library-head {
          margin-bottom: 18px;
        }

        .gri-library-head small {
          color: var(--gri-teal);
          font-size: 10px;
          font-weight: 950;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .gri-library-head h2 {
          margin: 9px 0 8px;
          font-size: clamp(2rem, 4vw, 3.8rem);
          letter-spacing: -0.05em;
        }

        .gri-library-head p {
          max-width: 780px;
          margin: 0;
          color: var(--gri-muted);
          line-height: 1.7;
        }

        .gri-library-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
        }

        .gri-record-card {
          padding: 20px;
          border: 1px solid var(--gri-border);
          border-radius: 20px;
          background: rgba(5,20,22,0.83);
        }

        .gri-record-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 12px;
        }

        .gri-record-top span {
          color: var(--gri-teal);
          font-size: 10px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .gri-record-id {
          color: #6f8b85;
          font: 10px/1.5 ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          overflow-wrap: anywhere;
        }

        .gri-record-card h3 {
          margin: 10px 0 8px;
          font-size: 1.2rem;
        }

        .gri-record-card > p {
          color: var(--gri-muted);
          font-size: 12px;
          line-height: 1.65;
        }

        .gri-record-meta {
          display: grid;
          gap: 7px;
          margin-top: 16px;
        }

        .gri-record-meta div {
          display: grid;
          grid-template-columns: 95px 1fr;
          gap: 10px;
          font-size: 11px;
        }

        .gri-record-meta dt {
          color: #6f8b85;
          font-weight: 900;
          text-transform: uppercase;
        }

        .gri-record-meta dd {
          margin: 0;
          color: #d6e5e1;
        }

        .gri-card-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 18px;
        }

        .gri-empty {
          padding: 32px;
          border: 1px dashed rgba(114,240,189,0.18);
          border-radius: 20px;
          color: var(--gri-muted);
          text-align: center;
          background: rgba(255,255,255,0.02);
        }

        @keyframes griGrid {
          from { transform: translateX(0); }
          to { transform: translateX(70px); }
        }

        @keyframes griOrbit {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 950px) {
          .gri-layout,
          .gri-library-grid {
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

          .gri-two {
            grid-template-columns: 1fr;
          }

          .gri-button,
          .gri-link {
            width: 100%;
          }

          .gri-active {
            align-items: flex-start;
            flex-direction: column;
          }

          .gri-record-meta div {
            grid-template-columns: 82px 1fr;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .gri-grid,
          .gri-orbit {
            animation: none;
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

          {notice ? (
            <div className="gri-notice" role="status">
              {notice}
            </div>
          ) : null}

          {interpretationId ? (
            <div className="gri-active">
              <div>
                <strong>{interpretationId}</strong>
                <span>
                  Active browser-local interpretation · {status} · v{version}
                </span>
              </div>
              <span>
                Updated{" "}
                {updatedAt ? new Date(updatedAt).toLocaleString() : "not yet"}
              </span>
            </div>
          ) : null}

          <section className="gri-layout" id="interpreter">
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
                    resetResult();
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
                      resetResult();
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
                      resetResult();
                    }}
                    placeholder="What must the record be allowed or refused to support?"
                  />
                </label>

                <div className="gri-two">
                  <label className="gri-label">
                    Version
                    <input
                      className="gri-input"
                      value={version}
                      onChange={(event) => setVersion(event.target.value)}
                      placeholder="1.0"
                    />
                  </label>

                  <label className="gri-label">
                    Status
                    <select
                      className="gri-select"
                      value={status}
                      onChange={(event) =>
                        setStatus(
                          event.target.value as InterpretationStatus,
                        )
                      }
                    >
                      <option value="DRAFT">Draft</option>
                      <option value="PRESERVED">Preserved</option>
                      <option value="SUPERSEDED">Superseded</option>
                      <option value="WITHDRAWN">Withdrawn</option>
                    </select>
                  </label>
                </div>
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
                  onClick={saveWorkingInterpretation}
                >
                  Save Working Interpretation
                </button>

                <button
                  className="gri-button danger"
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
              <p>{interpretation.resultSummary}</p>

              <div className="gri-findings">
                <div className="gri-finding">
                  <small>Supported</small>
                  <strong>Partial evidence exists</strong>
                  <span>{interpretation.supportedFinding}</span>
                </div>

                <div className="gri-finding">
                  <small>Continuity</small>
                  <strong>
                    {hasGap ? "Gap detected" : "No explicit gap detected"}
                  </strong>
                  <span>{interpretation.continuityFinding}</span>
                </div>

                <div className="gri-finding">
                  <small>Calibration</small>
                  <strong>
                    {hasCalibrationConcern
                      ? "Calibration standing limited"
                      : "Calibration standing undeclared"}
                  </strong>
                  <span>{interpretation.calibrationFinding}</span>
                </div>

                <div className="gri-finding">
                  <small>Time boundary</small>
                  <strong>
                    {hasTimeBoundary
                      ? "Declared"
                      : "Insufficiently declared"}
                  </strong>
                  <span>{interpretation.timeBoundaryFinding}</span>
                </div>

                <div className="gri-finding">
                  <small>Refused conclusion</small>
                  <strong>Whole-period proof</strong>
                  <span>{interpretation.refusedConclusion}</span>
                </div>

                <div className="gri-finding">
                  <small>Next admissible step</small>
                  <strong>Continuity review</strong>
                  <span>{interpretation.nextAdmissibleStep}</span>
                </div>
              </div>

              <div className="gri-actions" style={{ padding: "20px 0 0" }}>
                <button
                  className="gri-button primary"
                  type="button"
                  onClick={preserveInterpretation}
                >
                  Preserve Governed Interpretation
                </button>

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

          <section className="gri-library">
            <div className="gri-library-head">
              <small>Preserved Interpretation Records</small>
              <h2>Browser-local governed interpretation history.</h2>
              <p>
                Each preserved interpretation remains separate from the source
                record and from any later diagnosis, optimization, approval,
                certification, or execution artifact.
              </p>
            </div>

            {library.length ? (
              <div className="gri-library-grid">
                {library.map((item) => (
                  <article
                    className="gri-record-card"
                    key={item.interpretationId}
                  >
                    <div className="gri-record-top">
                      <span>{item.status}</span>
                      <span>v{item.version}</span>
                    </div>

                    <div className="gri-record-id">
                      {item.interpretationId}
                    </div>

                    <h3>{item.recordClass}</h3>
                    <p>{item.interpretationQuestion}</p>

                    <dl className="gri-record-meta">
                      <div>
                        <dt>Continuity</dt>
                        <dd>{item.hasGap ? "Gap detected" : "No explicit gap"}</dd>
                      </div>
                      <div>
                        <dt>Calibration</dt>
                        <dd>
                          {item.hasCalibrationConcern
                            ? "Limited"
                            : "Undeclared"}
                        </dd>
                      </div>
                      <div>
                        <dt>Time boundary</dt>
                        <dd>{item.hasTimeBoundary ? "Declared" : "Insufficient"}</dd>
                      </div>
                      <div>
                        <dt>Updated</dt>
                        <dd>{new Date(item.updatedAt).toLocaleString()}</dd>
                      </div>
                    </dl>

                    <div className="gri-card-actions">
                      <button
                        className="gri-button primary"
                        type="button"
                        onClick={() => openInterpretation(item)}
                      >
                        Open
                      </button>
                      <button
                        className="gri-button"
                        type="button"
                        onClick={() => exportInterpretation(item)}
                      >
                        Export JSON
                      </button>
                      <button
                        className="gri-button danger"
                        type="button"
                        onClick={() =>
                          removeInterpretation(item.interpretationId)
                        }
                      >
                        Remove
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="gri-empty">
                No governed interpretation records have been preserved in this
                browser.
              </div>
            )}
          </section>
        </main>
      </div>
    </>
  );
}
