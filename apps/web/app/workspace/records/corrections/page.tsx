"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type CorrectionState =
  | "DRAFT"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "PUBLISHED"
  | "REJECTED"
  | "WITHDRAWN";

type CorrectionType =
  | "FACTUAL_CORRECTION"
  | "CONTEXT_ADDITION"
  | "IDENTITY_CORRECTION"
  | "CUSTODY_CORRECTION"
  | "AUTHORITY_CORRECTION"
  | "REDACTION"
  | "DISPLAY_ONLY"
  | "OTHER";

type ImpactLevel = "MINOR" | "MATERIAL" | "CRITICAL";

type CorrectionRecord = {
  correctionId: string;
  sourceRecordId: string;
  sourceVersion: string;
  targetVersion: string;
  recordTitle: string;
  disputeId: string;
  correctionType: CorrectionType;
  impact: ImpactLevel;
  state: CorrectionState;
  requestedBy: string;
  preparedBy: string;
  reviewer: string;
  createdAt: string;
  updatedAt: string;
  reason: string;
  originalValue: string;
  correctedValue: string;
  unchangedEvidence: string[];
  newEvidence: string[];
  requiredActions: string[];
  sourcePackageDigest: string;
  correctedPackageDigest: string;
  supersessionReceiptId: string;
  publicationId: string;
};

const initialCorrections: CorrectionRecord[] = [
  {
    correctionId: "TA14-ARC-000024",
    sourceRecordId: "TA14-AR-2026-000184",
    sourceVersion: "1.0.0",
    targetVersion: "1.1.0",
    recordTitle: "Field Equipment Condition Record",
    disputeId: "TA14-ARD-000031",
    correctionType: "CONTEXT_ADDITION",
    impact: "MATERIAL",
    state: "DRAFT",
    requestedBy: "Property representative",
    preparedBy: "Transparent Air",
    reviewer: "UNASSIGNED",
    createdAt: "2026-07-17T16:34:00.000Z",
    updatedAt: "2026-07-17T16:34:00.000Z",
    reason:
      "The original record omitted documented prior-repair context that may affect interpretation of the observed equipment condition.",
    originalValue:
      "Record describes compressor short cycling and intermittent condenser fan operation without prior-repair context.",
    correctedValue:
      "Record preserves the same field observations and adds that the condenser fan motor had reportedly been replaced by another contractor two days earlier. The prior-repair history is separately evidenced and does not alter the original measurements.",
    unchangedEvidence: [
      "Operating-condition video",
      "Voltage and current measurements",
      "Field analyzer output",
    ],
    newEvidence: [
      "Service invoice dated 2026-07-15",
      "Email confirmation from prior contractor",
    ],
    requiredActions: [
      "Preserve source version 1.0.0",
      "Create canonical version 1.1.0",
      "Generate new package digest",
      "Bind dispute and correction records",
      "Re-run verification",
      "Publish supersession notice",
    ],
    sourcePackageDigest:
      "sha256:48e489db4f4cc93d5dc2a0617fa8bd99b0b097d04910a5bc37e3058a4224a77b",
    correctedPackageDigest: "PENDING",
    supersessionReceiptId: "PENDING",
    publicationId: "TA14-ARX-000042",
  },
  {
    correctionId: "TA14-ARC-000023",
    sourceRecordId: "TA14-AR-2026-000179",
    sourceVersion: "2.1.0",
    targetVersion: "2.1.1",
    recordTitle: "Facility Moisture Excursion Record",
    disputeId: "TA14-ARD-000030",
    correctionType: "CONTEXT_ADDITION",
    impact: "MATERIAL",
    state: "UNDER_REVIEW",
    requestedBy: "North Basin Operations",
    preparedBy: "TA-14 Review Desk",
    reviewer: "Independent reviewer",
    createdAt: "2026-07-17T15:02:00.000Z",
    updatedAt: "2026-07-17T15:26:00.000Z",
    reason:
      "Public-facing summary must visibly disclose that the sensor outage overlapped the initial excursion window.",
    originalValue:
      "Summary states that a moisture excursion occurred and was later verified.",
    correctedValue:
      "Summary states that a moisture excursion occurred while also disclosing that measurement continuity was unavailable during part of the initial excursion window.",
    unchangedEvidence: [
      "Environmental sensor data",
      "Facility response log",
      "Post-intervention verification",
    ],
    newEvidence: [
      "Sensor availability log",
      "Device heartbeat record",
    ],
    requiredActions: [
      "Preserve source version",
      "Add visible limitation",
      "Re-run verification",
      "Publish linked correction notice",
    ],
    sourcePackageDigest:
      "sha256:5b6b4bd2061271c272554351ce72715032dc833f75c1edbabbe0ed3c4a24ffc9",
    correctedPackageDigest:
      "sha256:39f4caf7b0d01f4af922f1e4af737be32b90991825527d0b6870ff85034e3bd7",
    supersessionReceiptId: "PENDING",
    publicationId: "TA14-ARX-000041",
  },
  {
    correctionId: "TA14-ARC-000022",
    sourceRecordId: "TA14-AR-2026-000161",
    sourceVersion: "1.0.0",
    targetVersion: "1.0.1",
    recordTitle: "Cold Storage Temperature Excursion Record",
    disputeId: "TA14-ARD-000028",
    correctionType: "DISPLAY_ONLY",
    impact: "MINOR",
    state: "PUBLISHED",
    requestedBy: "Cold-chain auditor",
    preparedBy: "TA-14 Review Desk",
    reviewer: "TA-14 Review Desk",
    createdAt: "2026-07-15T20:11:00.000Z",
    updatedAt: "2026-07-16T10:22:00.000Z",
    reason:
      "A transposed device serial number appeared in the human-readable display.",
    originalValue: "Device serial: CSTR-48172",
    correctedValue: "Device serial: CSTR-41872",
    unchangedEvidence: [
      "Original preserved package",
      "Calibration certificate",
      "Device identity manifest",
    ],
    newEvidence: [],
    requiredActions: [
      "Preserve original package",
      "Correct display layer",
      "Link correction notice",
    ],
    sourcePackageDigest:
      "sha256:a499829ed27276b3e053f76119db9a84f10534ff4a3a30f8469f2cf16f27c031",
    correctedPackageDigest:
      "sha256:cec0c090d24527c3aee1195859be4c5553ea2d80a4a20d04a198e8bbde20ea42",
    supersessionReceiptId: "TA14-SUP-000018",
    publicationId: "TA14-ARX-000034",
  },
];

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "UNKNOWN";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function downloadJson(filename: string, value: unknown) {
  const blob = new Blob([JSON.stringify(value, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export default function RecordCorrectionAndSupersessionPage() {
  const [corrections, setCorrections] = useState(initialCorrections);
  const [selectedId, setSelectedId] = useState(initialCorrections[0].correctionId);
  const [query, setQuery] = useState("");
  const [stateFilter, setStateFilter] = useState<CorrectionState | "ALL">("ALL");
  const [impactFilter, setImpactFilter] = useState<ImpactLevel | "ALL">("ALL");
  const [copied, setCopied] = useState(false);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return corrections.filter((correction) => {
      const matchesQuery =
        !needle ||
        [
          correction.correctionId,
          correction.sourceRecordId,
          correction.recordTitle,
          correction.disputeId,
          correction.correctionType,
          correction.requestedBy,
          correction.preparedBy,
          correction.reviewer,
          correction.reason,
        ]
          .join(" ")
          .toLowerCase()
          .includes(needle);

      return (
        matchesQuery &&
        (stateFilter === "ALL" || correction.state === stateFilter) &&
        (impactFilter === "ALL" || correction.impact === impactFilter)
      );
    });
  }, [corrections, impactFilter, query, stateFilter]);

  const selected =
    corrections.find((correction) => correction.correctionId === selectedId) ??
    filtered[0] ??
    corrections[0];

  const readiness = useMemo(() => {
    const blockers: string[] = [];

    if (!selected.reason.trim()) blockers.push("Correction reason is missing.");
    if (!selected.originalValue.trim())
      blockers.push("Original value or representation is missing.");
    if (!selected.correctedValue.trim())
      blockers.push("Corrected value or representation is missing.");
    if (!selected.disputeId || selected.disputeId === "UNKNOWN")
      blockers.push("Linked dispute or correction basis is missing.");
    if (
      selected.impact !== "MINOR" &&
      selected.correctedPackageDigest === "PENDING"
    )
      blockers.push("Corrected canonical package digest is pending.");

    const readyForApproval = blockers.length === 0;
    const readyForPublication =
      readyForApproval &&
      selected.state === "APPROVED" &&
      selected.correctedPackageDigest !== "PENDING";

    return { blockers, readyForApproval, readyForPublication };
  }, [selected]);

  const correctionPackage = {
    schema: "TA14_ADMISSIBLE_RECORD_CORRECTION_PACKAGE_V1",
    generatedAt: new Date().toISOString(),
    correction: selected,
    readiness,
    continuityRules: {
      preserveSourceVersion: true,
      preserveSourceDigest: true,
      linkDispute: true,
      linkSupersedingVersion: true,
      prohibitSilentOverwrite: true,
      requireReverification:
        selected.impact === "MATERIAL" || selected.impact === "CRITICAL",
    },
    limitation:
      "A correction modifies or supplements a versioned representation while preserving the original record and its history. It does not erase the source version or retroactively alter what was originally submitted.",
  };

  function transition(nextState: CorrectionState) {
    setCorrections((items) =>
      items.map((item) =>
        item.correctionId === selected.correctionId
          ? {
              ...item,
              state: nextState,
              reviewer:
                nextState === "UNDER_REVIEW" && item.reviewer === "UNASSIGNED"
                  ? "TA-14 Review Desk"
                  : item.reviewer,
              supersessionReceiptId:
                nextState === "PUBLISHED" &&
                item.supersessionReceiptId === "PENDING"
                  ? `TA14-SUP-${Math.floor(100000 + Math.random() * 900000)}`
                  : item.supersessionReceiptId,
              updatedAt: new Date().toISOString(),
            }
          : item,
      ),
    );
  }

  function generateCorrectedDigest() {
    setCorrections((items) =>
      items.map((item) =>
        item.correctionId === selected.correctionId
          ? {
              ...item,
              correctedPackageDigest:
                "sha256:demo-corrected-package-digest-replace-with-server-generated-value",
              updatedAt: new Date().toISOString(),
            }
          : item,
      ),
    );
  }

  async function copyPackage() {
    await navigator.clipboard.writeText(
      JSON.stringify(correctionPackage, null, 2),
    );
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <main className="correction-page">
      <style>{`
        * { box-sizing: border-box; }

        .correction-page {
          min-height: calc(100vh - 68px);
          padding: 48px 0 110px;
          color: #edf6ff;
        }

        .correction-wrap {
          width: min(1420px, calc(100% - 48px));
          margin: 0 auto;
        }

        .hero {
          position: relative;
          overflow: hidden;
          padding: clamp(32px, 5vw, 68px);
          border: 1px solid rgba(132, 177, 216, .16);
          border-radius: 34px;
          background:
            radial-gradient(circle at 85% 7%, rgba(255, 193, 92, .17), transparent 28%),
            radial-gradient(circle at 14% 0%, rgba(72, 223, 255, .17), transparent 32%),
            linear-gradient(135deg, rgba(14, 30, 48, .97), rgba(5, 11, 20, .98));
          box-shadow: 0 38px 120px rgba(0,0,0,.35);
        }

        .hero::after {
          content: "CORRECT";
          position: absolute;
          right: -10px;
          bottom: -42px;
          color: rgba(255,255,255,.025);
          font-size: clamp(4.5rem, 12vw, 10rem);
          font-weight: 1000;
          letter-spacing: -.1em;
          pointer-events: none;
        }

        .hero-content {
          position: relative;
          z-index: 1;
          max-width: 980px;
        }

        .eyebrow {
          margin: 0 0 17px;
          color: #70e4fa;
          font-size: .72rem;
          font-weight: 950;
          letter-spacing: .16em;
          text-transform: uppercase;
        }

        h1 {
          margin: 0;
          font-size: clamp(3.2rem, 7vw, 7rem);
          line-height: .92;
          letter-spacing: -.07em;
        }

        .gradient {
          color: transparent;
          background: linear-gradient(100deg, #fff, #8ceaff 50%, #ffc15c);
          background-clip: text;
          -webkit-background-clip: text;
        }

        .hero-copy {
          max-width: 880px;
          margin: 24px 0 0;
          color: #9eb4c8;
          font-size: 1.08rem;
          line-height: 1.75;
        }

        .hero-actions, .detail-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 11px;
          margin-top: 28px;
        }

        .button, .button-secondary, .small-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          text-decoration: none;
          font-weight: 900;
          cursor: pointer;
          transition: transform .2s ease;
        }

        .button:hover, .button-secondary:hover, .small-button:hover {
          transform: translateY(-2px);
        }

        .button {
          min-height: 47px;
          padding: 0 19px;
          border: 0;
          color: #07100f;
          background: linear-gradient(100deg, #56e6ff, #ffc15c);
        }

        .button-secondary {
          min-height: 47px;
          padding: 0 19px;
          border: 1px solid rgba(136, 180, 219, .22);
          color: #dce9f5;
          background: rgba(7, 17, 29, .72);
        }

        .small-button {
          min-height: 40px;
          padding: 0 14px;
          border: 1px solid rgba(136, 180, 219, .2);
          color: #dce9f5;
          background: rgba(7, 17, 29, .75);
          font-size: .75rem;
        }

        .toolbar {
          display: grid;
          grid-template-columns: minmax(220px, 1fr) 220px 180px;
          gap: 12px;
          margin: 22px 0;
          padding: 16px;
          border: 1px solid rgba(132, 177, 216, .14);
          border-radius: 22px;
          background: rgba(7, 16, 27, .68);
        }

        input, select {
          width: 100%;
          min-height: 47px;
          padding: 0 15px;
          border: 1px solid rgba(135, 180, 220, .2);
          border-radius: 14px;
          outline: none;
          color: #edf6ff;
          background: rgba(2, 9, 16, .9);
          font: inherit;
        }

        .grid {
          display: grid;
          grid-template-columns: minmax(0, .78fr) minmax(0, 1.22fr);
          gap: 18px;
          align-items: start;
        }

        .panel {
          overflow: hidden;
          border: 1px solid rgba(132, 177, 216, .14);
          border-radius: 25px;
          background: rgba(6, 15, 25, .8);
          box-shadow: 0 24px 80px rgba(0,0,0,.22);
        }

        .panel-head {
          display: flex;
          justify-content: space-between;
          gap: 14px;
          padding: 19px 21px;
          border-bottom: 1px solid rgba(132, 177, 216, .12);
        }

        .correction-row {
          width: 100%;
          padding: 20px 21px;
          border: 0;
          border-bottom: 1px solid rgba(132, 177, 216, .1);
          color: inherit;
          background: transparent;
          text-align: left;
          cursor: pointer;
        }

        .correction-row:last-child { border-bottom: 0; }

        .correction-row.active {
          background: linear-gradient(90deg, rgba(84, 232, 255, .09), rgba(255, 193, 92, .025));
          box-shadow: inset 3px 0 0 #56e6ff;
        }

        .row-top, .meta, .detail-top {
          display: flex;
          align-items: center;
          gap: 9px;
          flex-wrap: wrap;
        }

        .row-top { justify-content: space-between; }

        .correction-title { font-weight: 900; }

        .mono {
          margin-top: 7px;
          overflow-wrap: anywhere;
          color: #6edff4;
          font: 700 .72rem ui-monospace, SFMono-Regular, Menlo, monospace;
        }

        .meta {
          margin-top: 12px;
          color: #8299ae;
          font-size: .74rem;
        }

        .pill {
          display: inline-flex;
          align-items: center;
          min-height: 26px;
          padding: 0 9px;
          border: 1px solid rgba(135, 180, 220, .18);
          border-radius: 999px;
          color: #b9c9d8;
          background: rgba(8, 18, 30, .72);
          font-size: .64rem;
          font-weight: 950;
          letter-spacing: .07em;
        }

        .pill.APPROVED, .pill.PUBLISHED, .pill.MINOR {
          color: #54efae;
          border-color: rgba(84, 239, 174, .3);
        }

        .pill.DRAFT, .pill.UNDER_REVIEW, .pill.MATERIAL {
          color: #ffd27b;
          border-color: rgba(255, 210, 123, .3);
        }

        .pill.REJECTED, .pill.WITHDRAWN, .pill.CRITICAL {
          color: #ff8e9b;
          border-color: rgba(255, 142, 155, .3);
        }

        .detail {
          position: sticky;
          top: 92px;
          padding: 25px;
        }

        .detail-top { justify-content: space-between; }

        .detail h2 {
          margin: 19px 0 7px;
          font-size: 1.9rem;
          letter-spacing: -.04em;
        }

        .detail p {
          color: #94aabd;
          line-height: 1.7;
        }

        .version-line {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 14px;
          margin: 20px 0;
        }

        .version-box {
          padding: 17px;
          border: 1px solid rgba(132, 177, 216, .12);
          border-radius: 17px;
          background: rgba(2, 9, 16, .52);
        }

        .version-box span {
          display: block;
          color: #718aa1;
          font-size: .65rem;
          font-weight: 900;
          letter-spacing: .08em;
          text-transform: uppercase;
        }

        .version-box strong {
          display: block;
          margin-top: 5px;
          font-size: 1.25rem;
        }

        .arrow {
          color: #ffc15c;
          font-size: 1.4rem;
          font-weight: 1000;
        }

        .kv {
          display: grid;
          grid-template-columns: 170px 1fr;
          gap: 10px 14px;
          margin-top: 20px;
          padding: 17px;
          border: 1px solid rgba(132, 177, 216, .12);
          border-radius: 17px;
          background: rgba(2, 9, 16, .52);
          font-size: .78rem;
        }

        .kv dt { color: #718aa1; }

        .kv dd {
          margin: 0;
          overflow-wrap: anywhere;
          color: #dce8f3;
        }

        .comparison {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-top: 17px;
        }

        .box {
          padding: 16px;
          border: 1px solid rgba(132, 177, 216, .12);
          border-radius: 17px;
          background: rgba(2, 9, 16, .52);
        }

        .box strong {
          display: block;
          color: #dce8f3;
          font-size: .76rem;
          letter-spacing: .07em;
          text-transform: uppercase;
        }

        .box p {
          margin: 10px 0 0;
          font-size: .8rem;
        }

        .box ul {
          margin: 10px 0 0;
          padding-left: 18px;
          color: #9fb1c1;
          line-height: 1.65;
        }

        .blockers {
          margin-top: 17px;
          border-color: rgba(255, 210, 123, .18);
          background: rgba(65, 43, 8, .15);
        }

        .blockers strong { color: #ffd27b; }

        .notice {
          margin-top: 18px;
          padding: 16px 18px;
          border-left: 3px solid #ffc15c;
          border-radius: 0 13px 13px 0;
          color: #91a8bd;
          background: rgba(255, 193, 92, .045);
          font-size: .82rem;
          line-height: 1.65;
        }

        .empty {
          padding: 42px 22px;
          color: #8399ad;
          text-align: center;
          line-height: 1.7;
        }

        @media (max-width: 1040px) {
          .grid { grid-template-columns: 1fr; }
          .detail { position: static; }
        }

        @media (max-width: 760px) {
          .correction-wrap { width: min(100% - 24px, 1420px); }
          .correction-page { padding-top: 24px; }
          .hero { padding: 28px 22px 34px; border-radius: 24px; }
          .toolbar, .comparison { grid-template-columns: 1fr; }
          .version-line { grid-template-columns: 1fr; }
          .arrow { transform: rotate(90deg); justify-self: center; }
          .kv { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="correction-wrap">
        <section className="hero">
          <div className="hero-content">
            <p className="eyebrow">
              TA-14 Exchange · Record Correction & Supersession
            </p>
            <h1>
              Correct the record.
              <br />
              <span className="gradient">Preserve what came before.</span>
            </h1>
            <p className="hero-copy">
              Create a linked, versioned correction without overwriting the
              original record. Preserve the source package, correction basis,
              changed representation, supporting evidence, review state, and
              supersession receipt.
            </p>

            <div className="hero-actions">
              <Link className="button" href="/workspace/records/disputes">
                Open Dispute Desk
              </Link>
              <Link
                className="button-secondary"
                href="/workspace/records/verify"
              >
                Re-Verify Record
              </Link>
              <Link
                className="button-secondary"
                href="/workspace/records/exchange"
              >
                Record Exchange
              </Link>
            </div>
          </div>
        </section>

        <section className="toolbar">
          <input
            aria-label="Search corrections"
            placeholder="Search correction, record, dispute, preparer, reviewer, or reason"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />

          <select
            aria-label="Filter correction state"
            value={stateFilter}
            onChange={(event) =>
              setStateFilter(event.target.value as CorrectionState | "ALL")
            }
          >
            <option value="ALL">All states</option>
            <option value="DRAFT">DRAFT</option>
            <option value="UNDER_REVIEW">UNDER_REVIEW</option>
            <option value="APPROVED">APPROVED</option>
            <option value="PUBLISHED">PUBLISHED</option>
            <option value="REJECTED">REJECTED</option>
            <option value="WITHDRAWN">WITHDRAWN</option>
          </select>

          <select
            aria-label="Filter correction impact"
            value={impactFilter}
            onChange={(event) =>
              setImpactFilter(event.target.value as ImpactLevel | "ALL")
            }
          >
            <option value="ALL">All impact</option>
            <option value="MINOR">MINOR</option>
            <option value="MATERIAL">MATERIAL</option>
            <option value="CRITICAL">CRITICAL</option>
          </select>
        </section>

        <section className="grid">
          <div className="panel">
            <div className="panel-head">
              <strong>Versioned corrections</strong>
              <span>{filtered.length} visible</span>
            </div>

            {filtered.length ? (
              filtered.map((correction) => (
                <button
                  className={`correction-row ${
                    selected.correctionId === correction.correctionId
                      ? "active"
                      : ""
                  }`}
                  key={correction.correctionId}
                  type="button"
                  onClick={() => setSelectedId(correction.correctionId)}
                >
                  <div className="row-top">
                    <span className="correction-title">
                      {correction.recordTitle}
                    </span>
                    <span className={`pill ${correction.state}`}>
                      {correction.state}
                    </span>
                  </div>
                  <div className="mono">{correction.correctionId}</div>
                  <div className="meta">
                    <span>{correction.correctionType}</span>
                    <span>{correction.impact}</span>
                    <span>
                      v{correction.sourceVersion} → v{correction.targetVersion}
                    </span>
                    <span>{formatDate(correction.updatedAt)}</span>
                  </div>
                </button>
              ))
            ) : (
              <div className="empty">
                No correction matches the current filters.
              </div>
            )}
          </div>

          <aside className="panel detail">
            <div className="detail-top">
              <span className={`pill ${selected.state}`}>{selected.state}</span>
              <span className={`pill ${selected.impact}`}>{selected.impact}</span>
              <span className="pill">{selected.correctionType}</span>
            </div>

            <h2>{selected.recordTitle}</h2>
            <div className="mono">{selected.correctionId}</div>
            <p>{selected.reason}</p>

            <div className="version-line">
              <div className="version-box">
                <span>Source version</span>
                <strong>v{selected.sourceVersion}</strong>
              </div>
              <div className="arrow">→</div>
              <div className="version-box">
                <span>Superseding version</span>
                <strong>v{selected.targetVersion}</strong>
              </div>
            </div>

            <dl className="kv">
              <dt>Record ID</dt>
              <dd>{selected.sourceRecordId}</dd>

              <dt>Dispute ID</dt>
              <dd>{selected.disputeId}</dd>

              <dt>Requested by</dt>
              <dd>{selected.requestedBy}</dd>

              <dt>Prepared by</dt>
              <dd>{selected.preparedBy}</dd>

              <dt>Reviewer</dt>
              <dd>{selected.reviewer}</dd>

              <dt>Source digest</dt>
              <dd>{selected.sourcePackageDigest}</dd>

              <dt>Corrected digest</dt>
              <dd>{selected.correctedPackageDigest}</dd>

              <dt>Supersession receipt</dt>
              <dd>{selected.supersessionReceiptId}</dd>
            </dl>

            <div className="comparison">
              <div className="box">
                <strong>Original representation</strong>
                <p>{selected.originalValue}</p>
              </div>
              <div className="box">
                <strong>Corrected representation</strong>
                <p>{selected.correctedValue}</p>
              </div>
            </div>

            <div className="comparison">
              <div className="box">
                <strong>Evidence preserved unchanged</strong>
                <ul>
                  {selected.unchangedEvidence.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="box">
                <strong>New supporting evidence</strong>
                {selected.newEvidence.length ? (
                  <ul>
                    {selected.newEvidence.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No new evidence added.</p>
                )}
              </div>
            </div>

            <div className="box blockers">
              <strong>Required actions</strong>
              <ul>
                {selected.requiredActions.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            {readiness.blockers.length ? (
              <div className="box blockers">
                <strong>Current blockers</strong>
                <ul>
                  {readiness.blockers.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="detail-actions">
              <button
                className="button"
                type="button"
                onClick={() => transition("UNDER_REVIEW")}
              >
                Submit for review
              </button>

              {selected.correctedPackageDigest === "PENDING" ? (
                <button
                  className="small-button"
                  type="button"
                  onClick={generateCorrectedDigest}
                >
                  Generate corrected digest
                </button>
              ) : null}

              <button
                className="small-button"
                type="button"
                onClick={() => transition("APPROVED")}
                disabled={!readiness.readyForApproval}
              >
                Approve correction
              </button>

              <button
                className="small-button"
                type="button"
                onClick={() => transition("PUBLISHED")}
                disabled={!readiness.readyForPublication}
              >
                Publish supersession
              </button>

              <button
                className="small-button"
                type="button"
                onClick={() => transition("REJECTED")}
              >
                Reject
              </button>

              <button
                className="small-button"
                type="button"
                onClick={copyPackage}
              >
                {copied ? "Copied" : "Copy correction package"}
              </button>

              <button
                className="small-button"
                type="button"
                onClick={() =>
                  downloadJson(
                    `${selected.correctionId.toLowerCase()}-correction-package.json`,
                    correctionPackage,
                  )
                }
              >
                Download package
              </button>
            </div>

            <div className="notice">
              A correction never silently replaces the source record. The
              original version, original package digest, dispute basis,
              superseding version, and re-verification history remain linked
              and independently inspectable.
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
