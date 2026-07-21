"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";

type ReviewState = "IDLE" | "HOLD" | "READY";
type ContinuityStatus =
  | "DRAFT"
  | "READY_FOR_REVIEW"
  | "PRESERVED"
  | "SUPERSEDED"
  | "WITHDRAWN";

type ContinuityFinding = {
  findingId: string;
  category:
    | "TIME"
    | "CUSTODY"
    | "VERSION"
    | "IDENTITY"
    | "TRANSMISSION"
    | "CALIBRATION"
    | "SOURCE"
    | "OTHER";
  severity: "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
  statement: string;
  evidenceReference: string;
  boundary: string;
};

type ContinuityReviewRecord = {
  reviewId: string;
  sourceInterpretationId: string;
  sourceRecordId: string;
  title: string;
  reviewerName: string;
  reviewerOrganization: string;
  status: ContinuityStatus;
  version: string;
  declaredStart: string;
  declaredEnd: string;
  expectedDuration: string;
  capturedDuration: string;
  missingIntervals: string;
  custodyStatement: string;
  identityStatement: string;
  versionStatement: string;
  transmissionStatement: string;
  calibrationStatement: string;
  sourceAuthorityStatement: string;
  continuityDetermination:
    | "NOT_ASSESSED"
    | "CONTINUOUS"
    | "PARTIAL"
    | "BROKEN"
    | "DISPUTED";
  determinationReason: string;
  whatContinuitySupports: string;
  whatContinuityDoesNotSupport: string;
  requiredNextEvidence: string;
  findings: ContinuityFinding[];
  createdAt: string;
  updatedAt: string;
};

const WORKSPACE_KEY = "ta14-continuity-review-workspace-v1";
const LIBRARY_KEY = "ta14-continuity-review-library-v1";

const emptyReview: ContinuityReviewRecord = {
  reviewId: "",
  sourceInterpretationId: "",
  sourceRecordId: "",
  title: "",
  reviewerName: "",
  reviewerOrganization: "",
  status: "DRAFT",
  version: "1.0",
  declaredStart: "",
  declaredEnd: "",
  expectedDuration: "",
  capturedDuration: "",
  missingIntervals: "",
  custodyStatement: "",
  identityStatement: "",
  versionStatement: "",
  transmissionStatement: "",
  calibrationStatement: "",
  sourceAuthorityStatement: "",
  continuityDetermination: "NOT_ASSESSED",
  determinationReason: "",
  whatContinuitySupports: "",
  whatContinuityDoesNotSupport: "",
  requiredNextEvidence: "",
  findings: [],
  createdAt: "",
  updatedAt: "",
};

const determinationLabels: Record<
  ContinuityReviewRecord["continuityDetermination"],
  string
> = {
  NOT_ASSESSED: "Not Assessed",
  CONTINUOUS: "Continuous Within Declared Boundary",
  PARTIAL: "Partially Continuous",
  BROKEN: "Continuity Broken",
  DISPUTED: "Continuity Disputed",
};

const statusLabels: Record<ContinuityStatus, string> = {
  DRAFT: "Draft",
  READY_FOR_REVIEW: "Ready for Review",
  PRESERVED: "Preserved",
  SUPERSEDED: "Superseded",
  WITHDRAWN: "Withdrawn",
};

function createIdentifier(prefix: string) {
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

  return `TA-14-${prefix}-${date}-${time}-${random}`;
}

export default function ContinuityReviewPage() {
  const [review, setReview] = useState<ContinuityReviewRecord>(emptyReview);
  const [library, setLibrary] = useState<ContinuityReviewRecord[]>([]);
  const [state, setState] = useState<ReviewState>("IDLE");
  const [notice, setNotice] = useState("");
  const [findingDraft, setFindingDraft] = useState({
    category: "TIME" as ContinuityFinding["category"],
    severity: "MODERATE" as ContinuityFinding["severity"],
    statement: "",
    evidenceReference: "",
    boundary: "",
  });

  useEffect(() => {
    const savedWorkspace = window.localStorage.getItem(WORKSPACE_KEY);
    const savedLibrary = window.localStorage.getItem(LIBRARY_KEY);

    if (savedWorkspace) {
      try {
        const parsed = JSON.parse(savedWorkspace) as ContinuityReviewRecord;
        setReview(parsed);
        setState(
          parsed.continuityDetermination !== "NOT_ASSESSED" ? "READY" : "IDLE",
        );
      } catch {
        window.localStorage.removeItem(WORKSPACE_KEY);
      }
    }

    if (savedLibrary) {
      try {
        const parsed = JSON.parse(savedLibrary) as ContinuityReviewRecord[];
        setLibrary(Array.isArray(parsed) ? parsed : []);
      } catch {
        window.localStorage.removeItem(LIBRARY_KEY);
      }
    }
  }, []);

  const updateReview = <K extends keyof ContinuityReviewRecord>(
    field: K,
    value: ContinuityReviewRecord[K],
  ) => {
    setReview((current) => ({
      ...current,
      [field]: value,
    }));
    setState("IDLE");
  };

  const continuityScore = useMemo(() => {
    const fields = [
      review.declaredStart,
      review.declaredEnd,
      review.expectedDuration,
      review.capturedDuration,
      review.custodyStatement,
      review.identityStatement,
      review.versionStatement,
      review.transmissionStatement,
      review.calibrationStatement,
      review.sourceAuthorityStatement,
    ];

    return Math.round(
      (fields.filter((field) => field.trim()).length / fields.length) * 100,
    );
  }, [review]);

  const hasExplicitGap = useMemo(
    () =>
      /missing|gap|interruption|unavailable|lost|broken/i.test(
        review.missingIntervals,
      ),
    [review.missingIntervals],
  );

  function loadSample() {
    setReview({
      ...emptyReview,
      title: "Continuity Review — AIR-2026-07-20-118",
      sourceInterpretationId: "TA-14-GIR-SAMPLE",
      sourceRecordId: "AIR-2026-07-20-118",
      reviewerName: "",
      reviewerOrganization: "",
      declaredStart: "2026-07-19 00:00 ET",
      declaredEnd: "2026-07-19 23:59 ET",
      expectedDuration: "23h 59m",
      capturedDuration: "23h 41m",
      missingIntervals: "Missing interval: 14:11–14:29 ET",
      custodyStatement:
        "The submitted record declares a building sensor network as source, but does not provide a complete custody log from capture through interpretation.",
      identityStatement:
        "The record identifies six sensing nodes, but node-level identity and device binding are not fully preserved in the submitted text.",
      versionStatement:
        "No explicit version history or supersession statement was included with the source record.",
      transmissionStatement:
        "Transmission path, export method, and transformation history are not declared.",
      calibrationStatement:
        "Calibration is current for four of six sensing nodes; two nodes remain unresolved.",
      sourceAuthorityStatement:
        "The source is declared as a building sensor network. Authority to make a whole-period atmospheric claim is not independently established.",
      continuityDetermination: "PARTIAL",
      determinationReason:
        "The declared period contains an 18-minute missing interval, incomplete calibration coverage, and unresolved custody and transmission history.",
      whatContinuitySupports:
        "The record can support bounded interpretation of the intervals and sensing nodes for which data, identity, and calibration standing are adequately preserved.",
      whatContinuityDoesNotSupport:
        "The record does not support unrestricted proof for the entire declared period or for sensing nodes whose calibration and identity remain unresolved.",
      requiredNextEvidence:
        "Provide node-level identity, complete timestamps, missing-interval explanation, export history, custody log, and calibration evidence for all six sensing nodes.",
      findings: [],
      createdAt: "",
      updatedAt: "",
    });
    setState("READY");
    setNotice("Sample continuity review loaded.");
  }

  function evaluateContinuity() {
    const required = [
      review.title,
      review.declaredStart,
      review.declaredEnd,
      review.expectedDuration,
      review.capturedDuration,
      review.determinationReason,
    ];

    if (required.some((field) => !field.trim())) {
      setState("HOLD");
      setNotice(
        "Continuity review placed on HOLD because required boundary and determination fields are incomplete.",
      );
      return;
    }

    setState("READY");
    setNotice(
      "Continuity review generated. The determination remains bounded to the declarations and evidence entered here.",
    );
  }

  function saveDraft() {
    const timestamp = new Date().toISOString();
    const next: ContinuityReviewRecord = {
      ...review,
      reviewId: review.reviewId || createIdentifier("CR"),
      status: "DRAFT",
      createdAt: review.createdAt || timestamp,
      updatedAt: timestamp,
    };

    setReview(next);
    window.localStorage.setItem(WORKSPACE_KEY, JSON.stringify(next));
    setNotice(`${next.reviewId} has been saved as a browser-local draft.`);
  }

  function preserveReview() {
    if (state !== "READY") {
      setNotice("Generate the continuity review before preserving it.");
      return;
    }

    const timestamp = new Date().toISOString();
    const next: ContinuityReviewRecord = {
      ...review,
      reviewId: review.reviewId || createIdentifier("CR"),
      status: review.status === "DRAFT" ? "PRESERVED" : review.status,
      createdAt: review.createdAt || timestamp,
      updatedAt: timestamp,
    };

    const exists = library.some((item) => item.reviewId === next.reviewId);
    const nextLibrary = exists
      ? library.map((item) => (item.reviewId === next.reviewId ? next : item))
      : [next, ...library];

    setReview(next);
    setLibrary(nextLibrary);
    window.localStorage.setItem(WORKSPACE_KEY, JSON.stringify(next));
    window.localStorage.setItem(LIBRARY_KEY, JSON.stringify(nextLibrary));
    setNotice(
      `${next.reviewId} has been preserved in this browser. Preservation does not independently establish continuity or admissibility.`,
    );
  }

  function clearWorkspace() {
    setReview(emptyReview);
    setState("IDLE");
    setFindingDraft({
      category: "TIME",
      severity: "MODERATE",
      statement: "",
      evidenceReference: "",
      boundary: "",
    });
    window.localStorage.removeItem(WORKSPACE_KEY);
    setNotice(
      "The working continuity review has been cleared. Preserved reviews remain available below.",
    );
  }

  function addFinding(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!findingDraft.statement.trim()) {
      setNotice("Continuity finding statement is required.");
      return;
    }

    const finding: ContinuityFinding = {
      findingId: createIdentifier("CF"),
      category: findingDraft.category,
      severity: findingDraft.severity,
      statement: findingDraft.statement.trim(),
      evidenceReference: findingDraft.evidenceReference.trim(),
      boundary: findingDraft.boundary.trim(),
    };

    setReview((current) => ({
      ...current,
      findings: [...current.findings, finding],
    }));

    setFindingDraft({
      category: "TIME",
      severity: "MODERATE",
      statement: "",
      evidenceReference: "",
      boundary: "",
    });

    setNotice(`${finding.findingId} has been added.`);
  }

  function removeFinding(findingId: string) {
    setReview((current) => ({
      ...current,
      findings: current.findings.filter(
        (item) => item.findingId !== findingId,
      ),
    }));
    setNotice(`${findingId} has been removed.`);
  }

  function openReview(item: ContinuityReviewRecord) {
    setReview(item);
    setState(
      item.continuityDetermination !== "NOT_ASSESSED" ? "READY" : "IDLE",
    );
    window.localStorage.setItem(WORKSPACE_KEY, JSON.stringify(item));
    setNotice(`${item.reviewId} has been reopened.`);
    document.getElementById("review")?.scrollIntoView({ behavior: "smooth" });
  }

  function removeReview(reviewId: string) {
    const nextLibrary = library.filter((item) => item.reviewId !== reviewId);
    setLibrary(nextLibrary);
    window.localStorage.setItem(LIBRARY_KEY, JSON.stringify(nextLibrary));
    setNotice(`${reviewId} has been removed from this browser.`);
  }

  function exportReview(item: ContinuityReviewRecord) {
    const blob = new Blob([JSON.stringify(item, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${item.reviewId}.json`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <style>{`
        :root {
          --cr-bg: #05070a;
          --cr-panel: rgba(10, 15, 21, 0.9);
          --cr-border: rgba(102, 190, 255, 0.16);
          --cr-text: #f6f9fc;
          --cr-muted: #93a1ae;
          --cr-blue: #66beff;
          --cr-cyan: #6ce7e0;
          --cr-gold: #ffd27a;
          --cr-red: #ff9898;
          --cr-green: #8be0b1;
        }

        .cr-page {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          color: var(--cr-text);
          background:
            radial-gradient(circle at 12% 8%, rgba(102,190,255,0.13), transparent 29%),
            radial-gradient(circle at 88% 13%, rgba(108,231,224,0.09), transparent 26%),
            linear-gradient(180deg, #05070a 0%, #081018 52%, #040609 100%);
        }

        .cr-page *,
        .cr-page *::before,
        .cr-page *::after {
          box-sizing: border-box;
        }

        .cr-space {
          position: fixed;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .cr-grid {
          position: absolute;
          inset: 0;
          opacity: 0.11;
          background-image:
            linear-gradient(rgba(102,190,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(102,190,255,0.05) 1px, transparent 1px);
          background-size: 72px 72px;
          animation: crGrid 25s linear infinite;
          mask-image: radial-gradient(circle at center, black, transparent 86%);
        }

        .cr-line {
          position: absolute;
          top: 28%;
          left: -20%;
          width: 70vw;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--cr-blue), transparent);
          opacity: 0.22;
          transform: rotate(12deg);
          animation: crLine 18s linear infinite;
        }

        .cr-orbit {
          position: absolute;
          right: -140px;
          top: 90px;
          width: 430px;
          height: 430px;
          border: 1px solid rgba(102,190,255,0.14);
          border-radius: 50%;
          animation: crOrbit 30s linear infinite;
        }

        .cr-orbit::after {
          content: "";
          position: absolute;
          top: 50%;
          left: -6px;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: var(--cr-cyan);
          box-shadow: 0 0 22px var(--cr-cyan);
        }

        .cr-shell {
          position: relative;
          z-index: 1;
          width: min(1260px, calc(100% - 28px));
          margin: 0 auto;
          padding: 24px 0 70px;
        }

        .cr-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding-bottom: 22px;
          border-bottom: 1px solid rgba(102,190,255,0.11);
        }

        .cr-brand,
        .cr-return {
          color: inherit;
          text-decoration: none;
        }

        .cr-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          font-weight: 900;
        }

        .cr-mark {
          display: grid;
          width: 46px;
          height: 46px;
          place-items: center;
          border: 1px solid rgba(102,190,255,0.26);
          border-radius: 14px;
          color: var(--cr-blue);
          background: rgba(102,190,255,0.07);
          font-size: 11px;
        }

        .cr-return {
          color: #a9b5c0;
          font-size: 13px;
          font-weight: 800;
        }

        .cr-hero {
          display: grid;
          grid-template-columns: minmax(0, 1.15fr) minmax(310px, 0.85fr);
          gap: 60px;
          align-items: center;
          padding: 70px 0 54px;
        }

        .cr-kicker {
          color: var(--cr-blue);
          font-size: 10px;
          font-weight: 950;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .cr-hero h1 {
          max-width: 880px;
          margin: 18px 0 18px;
          font-size: clamp(3rem, 7vw, 6.7rem);
          line-height: 0.94;
          letter-spacing: -0.065em;
        }

        .cr-hero h1 span {
          display: block;
          color: transparent;
          background: linear-gradient(90deg, white, var(--cr-blue), var(--cr-cyan));
          background-clip: text;
          -webkit-background-clip: text;
        }

        .cr-hero p {
          max-width: 790px;
          margin: 0;
          color: var(--cr-muted);
          font-size: 16px;
          line-height: 1.76;
        }

        .cr-score {
          padding: 28px;
          border: 1px solid var(--cr-border);
          border-radius: 24px;
          background: var(--cr-panel);
          box-shadow: 0 28px 70px rgba(0,0,0,0.26);
          backdrop-filter: blur(22px);
        }

        .cr-score small {
          color: var(--cr-blue);
          font-size: 10px;
          font-weight: 950;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .cr-score strong {
          display: block;
          margin: 12px 0;
          font-size: 4.4rem;
          line-height: 1;
          letter-spacing: -0.07em;
        }

        .cr-progress {
          height: 8px;
          overflow: hidden;
          border-radius: 999px;
          background: rgba(255,255,255,0.07);
        }

        .cr-progress span {
          display: block;
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(90deg, var(--cr-blue), var(--cr-cyan));
        }

        .cr-score p {
          margin-top: 16px;
          font-size: 12px;
        }

        .cr-notice {
          margin-bottom: 18px;
          padding: 14px 16px;
          border: 1px solid rgba(102,190,255,0.2);
          border-radius: 14px;
          color: #c9e8ff;
          background: rgba(102,190,255,0.055);
          font-size: 12px;
          line-height: 1.65;
        }

        .cr-section {
          padding: 58px 0;
        }

        .cr-section-head {
          max-width: 850px;
          margin-bottom: 24px;
        }

        .cr-section-head small {
          color: var(--cr-blue);
          font-size: 10px;
          font-weight: 950;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .cr-section-head h2 {
          margin: 10px 0 10px;
          font-size: clamp(2rem, 4.2vw, 4rem);
          line-height: 1.03;
          letter-spacing: -0.05em;
        }

        .cr-section-head p {
          margin: 0;
          color: var(--cr-muted);
          line-height: 1.72;
        }

        .cr-panel,
        .cr-card,
        .cr-finding,
        .cr-record-card,
        .cr-result,
        .cr-empty {
          border: 1px solid var(--cr-border);
          background: var(--cr-panel);
          box-shadow: 0 24px 65px rgba(0,0,0,0.22);
          backdrop-filter: blur(20px);
        }

        .cr-panel {
          border-radius: 24px;
          padding: 22px;
        }

        .cr-form-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
        }

        .cr-wide {
          grid-column: 1 / -1;
        }

        .cr-label {
          display: grid;
          gap: 8px;
          color: #b8c3cd;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .cr-input,
        .cr-textarea,
        .cr-select {
          width: 100%;
          border: 1px solid rgba(102,190,255,0.14);
          border-radius: 12px;
          color: white;
          background: rgba(3,8,12,0.76);
          outline: none;
        }

        .cr-input,
        .cr-select {
          min-height: 48px;
          padding: 0 13px;
        }

        .cr-textarea {
          min-height: 145px;
          padding: 13px;
          resize: vertical;
          line-height: 1.65;
        }

        .cr-input:focus,
        .cr-textarea:focus,
        .cr-select:focus {
          border-color: rgba(102,190,255,0.46);
          box-shadow: 0 0 0 3px rgba(102,190,255,0.06);
        }

        .cr-select option {
          color: white;
          background: #081018;
        }

        .cr-grid-cards {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
        }

        .cr-card {
          border-radius: 20px;
          padding: 19px;
        }

        .cr-card textarea {
          min-height: 190px;
        }

        .cr-actions,
        .cr-card-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 18px;
        }

        .cr-button,
        .cr-link {
          display: inline-flex;
          min-height: 44px;
          align-items: center;
          justify-content: center;
          padding: 0 16px;
          border: 1px solid var(--cr-border);
          border-radius: 12px;
          color: white;
          background: rgba(255,255,255,0.04);
          font-size: 12px;
          font-weight: 900;
          cursor: pointer;
          text-decoration: none;
        }

        .cr-button.primary {
          color: #061019;
          border-color: transparent;
          background: linear-gradient(135deg, var(--cr-blue), var(--cr-cyan));
        }

        .cr-button.danger {
          color: #ffc6c6;
          border-color: rgba(255,130,130,0.18);
        }

        .cr-result {
          margin-top: 18px;
          border-radius: 22px;
          padding: 22px;
        }

        .cr-result.hold {
          border-color: rgba(255,210,122,0.22);
          background: rgba(43,31,12,0.52);
        }

        .cr-result.ready {
          border-color: rgba(139,224,177,0.22);
        }

        .cr-result h3 {
          margin: 0 0 9px;
          font-size: 1.45rem;
        }

        .cr-result p {
          margin: 0;
          color: var(--cr-muted);
          line-height: 1.7;
        }

        .cr-finding-list {
          display: grid;
          gap: 14px;
          margin-top: 18px;
        }

        .cr-finding {
          display: grid;
          grid-template-columns: 48px 1fr;
          gap: 16px;
          border-radius: 18px;
          padding: 18px;
        }

        .cr-finding-index {
          width: 44px;
          height: 44px;
          display: grid;
          place-items: center;
          border-radius: 12px;
          color: var(--cr-blue);
          background: rgba(102,190,255,0.09);
          font-size: 11px;
          font-weight: 950;
        }

        .cr-finding-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .cr-finding-top span {
          color: var(--cr-blue);
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .cr-finding-top button {
          border: 0;
          padding: 0;
          color: var(--cr-red);
          background: transparent;
          cursor: pointer;
          font-size: 10px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .cr-finding h3 {
          margin: 10px 0 11px;
          font-size: 1.08rem;
        }

        .cr-finding p {
          margin: 7px 0 0;
          color: var(--cr-muted);
          font-size: 12px;
          line-height: 1.6;
        }

        .cr-library-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
        }

        .cr-record-card {
          border-radius: 20px;
          padding: 20px;
        }

        .cr-record-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          color: var(--cr-blue);
          font-size: 10px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .cr-record-id {
          margin-top: 12px;
          color: #72808c;
          font: 10px/1.5 ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          overflow-wrap: anywhere;
        }

        .cr-record-card h3 {
          margin: 10px 0 8px;
          font-size: 1.2rem;
        }

        .cr-record-card > p {
          color: var(--cr-muted);
          font-size: 12px;
          line-height: 1.65;
        }

        .cr-meta {
          display: grid;
          gap: 7px;
          margin-top: 15px;
        }

        .cr-meta div {
          display: grid;
          grid-template-columns: 112px 1fr;
          gap: 10px;
          font-size: 11px;
        }

        .cr-meta dt {
          color: #72808c;
          font-weight: 900;
          text-transform: uppercase;
        }

        .cr-meta dd {
          margin: 0;
          color: #d9e4eb;
        }

        .cr-empty {
          border-radius: 20px;
          padding: 34px;
          color: var(--cr-muted);
          text-align: center;
        }

        @keyframes crGrid {
          from { transform: translateX(0); }
          to { transform: translateX(72px); }
        }

        @keyframes crLine {
          from { translate: -15vw 0; }
          to { translate: 60vw 0; }
        }

        @keyframes crOrbit {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 940px) {
          .cr-hero {
            grid-template-columns: 1fr;
            gap: 30px;
          }

          .cr-score {
            max-width: 620px;
          }
        }

        @media (max-width: 760px) {
          .cr-form-grid,
          .cr-grid-cards,
          .cr-library-grid {
            grid-template-columns: 1fr;
          }

          .cr-wide {
            grid-column: auto;
          }
        }

        @media (max-width: 680px) {
          .cr-shell {
            width: min(100% - 18px, 1260px);
          }

          .cr-topbar {
            align-items: flex-start;
            flex-direction: column;
          }

          .cr-hero h1 {
            font-size: clamp(3rem, 15vw, 5rem);
          }

          .cr-actions,
          .cr-card-actions {
            display: grid;
            grid-template-columns: 1fr;
          }

          .cr-button,
          .cr-link {
            width: 100%;
          }

          .cr-finding {
            grid-template-columns: 1fr;
          }

          .cr-meta div {
            grid-template-columns: 95px 1fr;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .cr-grid,
          .cr-line,
          .cr-orbit {
            animation: none;
          }
        }
      `}</style>

      <div className="cr-page">
        <div className="cr-space" aria-hidden="true">
          <div className="cr-grid" />
          <div className="cr-line" />
          <div className="cr-orbit" />
        </div>

        <main className="cr-shell">
          <header className="cr-topbar">
            <Link className="cr-brand" href="/workspace/governed-records">
              <span className="cr-mark">TA-14</span>
              <span>Continuity Review</span>
            </Link>

            <Link
              className="cr-return"
              href="/workspace/governed-records/interpreter"
            >
              Return to Governed Record Interpreter
            </Link>
          </header>

          <section className="cr-hero">
            <div>
              <div className="cr-kicker">Governed Continuity Review</div>
              <h1>
                Determine whether the record
                <span>remained intact across time.</span>
              </h1>
              <p>
                Review time coverage, custody, identity, version history,
                transmission, calibration, and source authority before any
                record is permitted to support a stronger admissibility claim.
              </p>
            </div>

            <aside className="cr-score">
              <small>Continuity Field Completion</small>
              <strong>{continuityScore}%</strong>
              <div className="cr-progress">
                <span style={{ width: `${continuityScore}%` }} />
              </div>
              <p>
                Completion means fields contain declarations. It does not prove
                continuity, authenticity, custody, or admissibility.
              </p>
            </aside>
          </section>

          {notice ? (
            <div className="cr-notice" role="status">
              {notice}
            </div>
          ) : null}

          <section className="cr-section" id="review">
            <div className="cr-section-head">
              <small>01 — Review Identity</small>
              <h2>Identify the review and its source artifacts.</h2>
            </div>

            <div className="cr-panel">
              <div className="cr-form-grid">
                <label className="cr-label cr-wide">
                  Review title
                  <input
                    className="cr-input"
                    value={review.title}
                    onChange={(event) =>
                      updateReview("title", event.target.value)
                    }
                    placeholder="Continuity Review of..."
                  />
                </label>

                <label className="cr-label">
                  Source interpretation ID
                  <input
                    className="cr-input"
                    value={review.sourceInterpretationId}
                    onChange={(event) =>
                      updateReview(
                        "sourceInterpretationId",
                        event.target.value,
                      )
                    }
                    placeholder="TA-14-GIR-..."
                  />
                </label>

                <label className="cr-label">
                  Source record ID
                  <input
                    className="cr-input"
                    value={review.sourceRecordId}
                    onChange={(event) =>
                      updateReview("sourceRecordId", event.target.value)
                    }
                    placeholder="AIR-..., GR-..., AER-..."
                  />
                </label>

                <label className="cr-label">
                  Reviewer name
                  <input
                    className="cr-input"
                    value={review.reviewerName}
                    onChange={(event) =>
                      updateReview("reviewerName", event.target.value)
                    }
                    placeholder="Reviewer"
                  />
                </label>

                <label className="cr-label">
                  Reviewer organization
                  <input
                    className="cr-input"
                    value={review.reviewerOrganization}
                    onChange={(event) =>
                      updateReview(
                        "reviewerOrganization",
                        event.target.value,
                      )
                    }
                    placeholder="Organization"
                  />
                </label>

                <label className="cr-label">
                  Status
                  <select
                    className="cr-select"
                    value={review.status}
                    onChange={(event) =>
                      updateReview(
                        "status",
                        event.target.value as ContinuityStatus,
                      )
                    }
                  >
                    {Object.entries(statusLabels).map(([value, label]) => (
                      <option value={value} key={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="cr-label">
                  Version
                  <input
                    className="cr-input"
                    value={review.version}
                    onChange={(event) =>
                      updateReview("version", event.target.value)
                    }
                    placeholder="1.0"
                  />
                </label>
              </div>

              <div className="cr-actions">
                <button
                  className="cr-button"
                  type="button"
                  onClick={loadSample}
                >
                  Load Sample
                </button>
              </div>
            </div>
          </section>

          <section className="cr-section">
            <div className="cr-section-head">
              <small>02 — Time Continuity</small>
              <h2>Compare the declared period with the period actually captured.</h2>
            </div>

            <div className="cr-panel">
              <div className="cr-form-grid">
                <label className="cr-label">
                  Declared start
                  <input
                    className="cr-input"
                    value={review.declaredStart}
                    onChange={(event) =>
                      updateReview("declaredStart", event.target.value)
                    }
                    placeholder="Start timestamp"
                  />
                </label>

                <label className="cr-label">
                  Declared end
                  <input
                    className="cr-input"
                    value={review.declaredEnd}
                    onChange={(event) =>
                      updateReview("declaredEnd", event.target.value)
                    }
                    placeholder="End timestamp"
                  />
                </label>

                <label className="cr-label">
                  Expected duration
                  <input
                    className="cr-input"
                    value={review.expectedDuration}
                    onChange={(event) =>
                      updateReview("expectedDuration", event.target.value)
                    }
                    placeholder="Expected capture duration"
                  />
                </label>

                <label className="cr-label">
                  Captured duration
                  <input
                    className="cr-input"
                    value={review.capturedDuration}
                    onChange={(event) =>
                      updateReview("capturedDuration", event.target.value)
                    }
                    placeholder="Actual captured duration"
                  />
                </label>

                <label className="cr-label cr-wide">
                  Missing intervals, interruptions, or unavailable periods
                  <textarea
                    className="cr-textarea"
                    value={review.missingIntervals}
                    onChange={(event) =>
                      updateReview("missingIntervals", event.target.value)
                    }
                    placeholder="List every missing interval or state that none were declared."
                  />
                </label>
              </div>
            </div>
          </section>

          <section className="cr-section">
            <div className="cr-section-head">
              <small>03 — Continuity Dimensions</small>
              <h2>Keep each continuity question separate.</h2>
            </div>

            <div className="cr-grid-cards">
              {[
                {
                  label: "Custody continuity",
                  field: "custodyStatement" as const,
                  value: review.custodyStatement,
                  placeholder:
                    "Who held, stored, transferred, or controlled the record from capture through review?",
                },
                {
                  label: "Identity continuity",
                  field: "identityStatement" as const,
                  value: review.identityStatement,
                  placeholder:
                    "How were devices, people, entities, systems, and source records bound to stable identities?",
                },
                {
                  label: "Version continuity",
                  field: "versionStatement" as const,
                  value: review.versionStatement,
                  placeholder:
                    "Which version was reviewed, and how were amendments, replacements, and supersession preserved?",
                },
                {
                  label: "Transmission continuity",
                  field: "transmissionStatement" as const,
                  value: review.transmissionStatement,
                  placeholder:
                    "How was the record exported, transmitted, transformed, copied, or imported?",
                },
                {
                  label: "Calibration continuity",
                  field: "calibrationStatement" as const,
                  value: review.calibrationStatement,
                  placeholder:
                    "Was calibration standing preserved across all relevant devices and periods?",
                },
                {
                  label: "Source authority continuity",
                  field: "sourceAuthorityStatement" as const,
                  value: review.sourceAuthorityStatement,
                  placeholder:
                    "Did the source retain authority to support the declared record and requested conclusion?",
                },
              ].map((item) => (
                <label className="cr-card cr-label" key={item.label}>
                  {item.label}
                  <textarea
                    className="cr-textarea"
                    value={item.value}
                    onChange={(event) =>
                      updateReview(item.field, event.target.value)
                    }
                    placeholder={item.placeholder}
                  />
                </label>
              ))}
            </div>
          </section>

          <section className="cr-section">
            <div className="cr-section-head">
              <small>04 — Continuity Determination</small>
              <h2>State the determination without hiding the reason.</h2>
            </div>

            <div className="cr-panel">
              <div className="cr-form-grid">
                <label className="cr-label cr-wide">
                  Continuity determination
                  <select
                    className="cr-select"
                    value={review.continuityDetermination}
                    onChange={(event) =>
                      updateReview(
                        "continuityDetermination",
                        event.target
                          .value as ContinuityReviewRecord["continuityDetermination"],
                      )
                    }
                  >
                    {Object.entries(determinationLabels).map(
                      ([value, label]) => (
                        <option value={value} key={value}>
                          {label}
                        </option>
                      ),
                    )}
                  </select>
                </label>

                <label className="cr-label cr-wide">
                  Determination reason
                  <textarea
                    className="cr-textarea"
                    value={review.determinationReason}
                    onChange={(event) =>
                      updateReview(
                        "determinationReason",
                        event.target.value,
                      )
                    }
                    placeholder="Explain exactly why this continuity determination was reached."
                  />
                </label>

                <label className="cr-label">
                  What continuity supports
                  <textarea
                    className="cr-textarea"
                    value={review.whatContinuitySupports}
                    onChange={(event) =>
                      updateReview(
                        "whatContinuitySupports",
                        event.target.value,
                      )
                    }
                    placeholder="State the bounded claims that continuity permits."
                  />
                </label>

                <label className="cr-label">
                  What continuity does not support
                  <textarea
                    className="cr-textarea"
                    value={review.whatContinuityDoesNotSupport}
                    onChange={(event) =>
                      updateReview(
                        "whatContinuityDoesNotSupport",
                        event.target.value,
                      )
                    }
                    placeholder="State the conclusions continuity cannot support."
                  />
                </label>

                <label className="cr-label cr-wide">
                  Required next evidence
                  <textarea
                    className="cr-textarea"
                    value={review.requiredNextEvidence}
                    onChange={(event) =>
                      updateReview(
                        "requiredNextEvidence",
                        event.target.value,
                      )
                    }
                    placeholder="List the evidence needed to cure gaps or support a stronger determination."
                  />
                </label>
              </div>

              <div className="cr-actions">
                <button
                  className="cr-button primary"
                  type="button"
                  onClick={evaluateContinuity}
                >
                  Generate Continuity Review
                </button>
              </div>
            </div>

            {state === "HOLD" ? (
              <div className="cr-result hold">
                <h3>HOLD — continuity boundary incomplete.</h3>
                <p>
                  Required time, duration, title, and determination fields must
                  be present before a bounded continuity review can be generated.
                </p>
              </div>
            ) : null}

            {state === "READY" ? (
              <div className="cr-result ready">
                <h3>
                  {determinationLabels[review.continuityDetermination]}
                </h3>
                <p>{review.determinationReason}</p>
                {hasExplicitGap ? (
                  <p>
                    An explicit interruption, missing interval, or continuity
                    gap is present in the declared review record.
                  </p>
                ) : null}
              </div>
            ) : null}
          </section>

          <section className="cr-section">
            <div className="cr-section-head">
              <small>05 — Structured Findings</small>
              <h2>Preserve every continuity issue as a separate finding.</h2>
            </div>

            <form className="cr-panel" onSubmit={addFinding}>
              <div className="cr-form-grid">
                <label className="cr-label">
                  Category
                  <select
                    className="cr-select"
                    value={findingDraft.category}
                    onChange={(event) =>
                      setFindingDraft((current) => ({
                        ...current,
                        category: event.target
                          .value as ContinuityFinding["category"],
                      }))
                    }
                  >
                    <option value="TIME">Time</option>
                    <option value="CUSTODY">Custody</option>
                    <option value="VERSION">Version</option>
                    <option value="IDENTITY">Identity</option>
                    <option value="TRANSMISSION">Transmission</option>
                    <option value="CALIBRATION">Calibration</option>
                    <option value="SOURCE">Source Authority</option>
                    <option value="OTHER">Other</option>
                  </select>
                </label>

                <label className="cr-label">
                  Severity
                  <select
                    className="cr-select"
                    value={findingDraft.severity}
                    onChange={(event) =>
                      setFindingDraft((current) => ({
                        ...current,
                        severity: event.target
                          .value as ContinuityFinding["severity"],
                      }))
                    }
                  >
                    <option value="LOW">Low</option>
                    <option value="MODERATE">Moderate</option>
                    <option value="HIGH">High</option>
                    <option value="CRITICAL">Critical</option>
                  </select>
                </label>

                <label className="cr-label cr-wide">
                  Finding statement
                  <textarea
                    className="cr-textarea"
                    value={findingDraft.statement}
                    onChange={(event) =>
                      setFindingDraft((current) => ({
                        ...current,
                        statement: event.target.value,
                      }))
                    }
                    placeholder="State the continuity finding."
                  />
                </label>

                <label className="cr-label cr-wide">
                  Evidence reference
                  <input
                    className="cr-input"
                    value={findingDraft.evidenceReference}
                    onChange={(event) =>
                      setFindingDraft((current) => ({
                        ...current,
                        evidenceReference: event.target.value,
                      }))
                    }
                    placeholder="Timestamp, evidence ID, source field, log entry, version, or file"
                  />
                </label>

                <label className="cr-label cr-wide">
                  Finding boundary
                  <textarea
                    className="cr-textarea"
                    value={findingDraft.boundary}
                    onChange={(event) =>
                      setFindingDraft((current) => ({
                        ...current,
                        boundary: event.target.value,
                      }))
                    }
                    placeholder="State what this finding does not establish."
                  />
                </label>
              </div>

              <div className="cr-actions">
                <button className="cr-button primary" type="submit">
                  Add Continuity Finding
                </button>
              </div>
            </form>

            <div className="cr-finding-list">
              {review.findings.map((item, index) => (
                <article className="cr-finding" key={item.findingId}>
                  <div className="cr-finding-index">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <div>
                    <div className="cr-finding-top">
                      <span>
                        {item.category} · {item.severity}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeFinding(item.findingId)}
                      >
                        Remove
                      </button>
                    </div>
                    <h3>{item.statement}</h3>
                    <p>Evidence: {item.evidenceReference || "Not declared"}</p>
                    <p>Boundary: {item.boundary || "Not declared"}</p>
                  </div>
                </article>
              ))}

              {review.findings.length === 0 ? (
                <div className="cr-empty">
                  No structured continuity findings have been added.
                </div>
              ) : null}
            </div>
          </section>

          <section className="cr-section">
            <div className="cr-section-head">
              <small>06 — Preserve Review</small>
              <h2>Preserve the continuity artifact separately.</h2>
              <p>
                A continuity review does not rewrite the source record or the
                governed interpretation. It creates a distinct review artifact.
              </p>
            </div>

            <div className="cr-actions">
              <button className="cr-button" type="button" onClick={saveDraft}>
                Save Working Review
              </button>
              <button
                className="cr-button primary"
                type="button"
                onClick={preserveReview}
              >
                Preserve Continuity Review
              </button>
              <button
                className="cr-button danger"
                type="button"
                onClick={clearWorkspace}
              >
                Clear Working Review
              </button>
              <Link
                className="cr-link"
                href="/workspace/governed-records/interpreter"
              >
                Return to Interpreter
              </Link>
            </div>
          </section>

          <section className="cr-section">
            <div className="cr-section-head">
              <small>07 — Preserved Reviews</small>
              <h2>Browser-local continuity review history.</h2>
            </div>

            {library.length ? (
              <div className="cr-library-grid">
                {library.map((item) => (
                  <article className="cr-record-card" key={item.reviewId}>
                    <div className="cr-record-top">
                      <span>{item.status}</span>
                      <span>v{item.version}</span>
                    </div>

                    <div className="cr-record-id">{item.reviewId}</div>
                    <h3>{item.title}</h3>
                    <p>{item.determinationReason}</p>

                    <dl className="cr-meta">
                      <div>
                        <dt>Determination</dt>
                        <dd>
                          {determinationLabels[item.continuityDetermination]}
                        </dd>
                      </div>
                      <div>
                        <dt>Source record</dt>
                        <dd>{item.sourceRecordId || "Not declared"}</dd>
                      </div>
                      <div>
                        <dt>Findings</dt>
                        <dd>{item.findings.length}</dd>
                      </div>
                      <div>
                        <dt>Updated</dt>
                        <dd>{new Date(item.updatedAt).toLocaleString()}</dd>
                      </div>
                    </dl>

                    <div className="cr-card-actions">
                      <button
                        className="cr-button primary"
                        type="button"
                        onClick={() => openReview(item)}
                      >
                        Open
                      </button>
                      <button
                        className="cr-button"
                        type="button"
                        onClick={() => exportReview(item)}
                      >
                        Export JSON
                      </button>
                      <button
                        className="cr-button danger"
                        type="button"
                        onClick={() => removeReview(item.reviewId)}
                      >
                        Remove
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="cr-empty">
                No continuity reviews have been preserved in this browser.
              </div>
            )}
          </section>
        </main>
      </div>
    </>
  );
}
