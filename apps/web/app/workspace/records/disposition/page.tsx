"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type DispositionState =
  | "PROPOSED"
  | "UNDER_REVIEW"
  | "BLOCKED"
  | "AUTHORIZED"
  | "EXECUTED"
  | "REJECTED"
  | "CANCELLED";

type DispositionMethod =
  | "ARCHIVE"
  | "RESTRICT_ACCESS"
  | "REDACT_AND_ARCHIVE"
  | "CRYPTOGRAPHIC_TOMBSTONE"
  | "AUTHORIZED_DELETION";

type AuthorityLevel =
  | "RECORD_OWNER"
  | "CUSTODIAN"
  | "LEGAL"
  | "REGULATORY"
  | "MULTI_PARTY_APPROVAL";

type DispositionRecord = {
  dispositionId: string;
  retentionId: string;
  recordId: string;
  listingId: string;
  recordTitle: string;
  recordVersion: string;
  state: DispositionState;
  method: DispositionMethod;
  authorityLevel: AuthorityLevel;
  proposedBy: string;
  custodian: string;
  reviewer: string;
  approvers: string[];
  proposedAt: string;
  reviewedAt: string;
  authorizedAt: string;
  executedAt: string;
  authorityBasis: string;
  prerequisites: string[];
  preservedArtifacts: string[];
  destructionScope: string[];
  blockers: string[];
  executionEvidence: string[];
  dispositionReceiptId: string;
};

const initialRecords: DispositionRecord[] = [
  {
    dispositionId: "TA14-RDP-000021",
    retentionId: "TA14-RRT-000061",
    recordId: "TA14-AR-2026-000179",
    listingId: "TA14-ARX-000041",
    recordTitle: "Facility Moisture Excursion Record",
    recordVersion: "2.1.0",
    state: "BLOCKED",
    method: "ARCHIVE",
    authorityLevel: "MULTI_PARTY_APPROVAL",
    proposedBy: "North Basin Operations",
    custodian: "North Basin Operations",
    reviewer: "TA-14 Review Desk",
    approvers: ["Facility owner", "Legal reviewer", "Evidence custodian"],
    proposedAt: "2026-07-17T18:06:00.000Z",
    reviewedAt: "2026-07-17T18:14:00.000Z",
    authorizedAt: "PENDING",
    executedAt: "PENDING",
    authorityBasis:
      "Disposition review requested after operational closure, subject to investigation hold, reliance history, and correction lineage.",
    prerequisites: [
      "Resolve investigation hold.",
      "Close open dispute and correction review.",
      "Confirm no active reliance authorization remains.",
      "Confirm preservation package and dependency map are complete.",
    ],
    preservedArtifacts: [
      "Canonical package digest",
      "Verification report",
      "Custody history",
      "Correction and dispute lineage",
      "Access and reliance receipts",
      "Retention and disposition receipts",
    ],
    destructionScope: [],
    blockers: [
      "Active investigation hold",
      "Open contextual dispute",
      "Active third-party reliance",
    ],
    executionEvidence: [],
    dispositionReceiptId: "PENDING",
  },
  {
    dispositionId: "TA14-RDP-000020",
    retentionId: "TA14-RRT-000059",
    recordId: "TA14-AR-2026-000161",
    listingId: "TA14-ARX-000034",
    recordTitle: "Cold Storage Temperature Excursion Record",
    recordVersion: "1.0.0",
    state: "AUTHORIZED",
    method: "CRYPTOGRAPHIC_TOMBSTONE",
    authorityLevel: "CUSTODIAN",
    proposedBy: "TA-14 Preservation Vault",
    custodian: "TA-14 Preservation Vault",
    reviewer: "TA-14 Review Desk",
    approvers: ["Preservation custodian"],
    proposedAt: "2026-07-16T10:24:00.000Z",
    reviewedAt: "2026-07-16T10:31:00.000Z",
    authorizedAt: "2026-07-16T10:34:00.000Z",
    executedAt: "PENDING",
    authorityBasis:
      "Superseded source version will remain represented by immutable digest, lineage, and supersession references while ordinary public access is restricted.",
    prerequisites: [
      "Preserve source digest.",
      "Preserve correction and supersession references.",
      "Preserve revocation history.",
    ],
    preservedArtifacts: [
      "Source package digest",
      "Correction record TA14-ARC-000022",
      "Supersession receipt TA14-SUP-000018",
      "Revocation record TA14-ARR-000011",
    ],
    destructionScope: [
      "Remove ordinary public download package",
      "Remove duplicate presentation copies",
    ],
    blockers: [],
    executionEvidence: [],
    dispositionReceiptId: "PENDING",
  },
  {
    dispositionId: "TA14-RDP-000019",
    retentionId: "TA14-RRT-000058",
    recordId: "TA14-AR-2026-000148",
    listingId: "TA14-ARX-000028",
    recordTitle: "Temporary Training Demonstration Record",
    recordVersion: "1.0.0",
    state: "EXECUTED",
    method: "AUTHORIZED_DELETION",
    authorityLevel: "RECORD_OWNER",
    proposedBy: "TA-14 Academy",
    custodian: "TA-14 Academy",
    reviewer: "TA-14 Review Desk",
    approvers: ["Record owner"],
    proposedAt: "2026-07-10T12:00:00.000Z",
    reviewedAt: "2026-07-10T12:15:00.000Z",
    authorizedAt: "2026-07-10T12:19:00.000Z",
    executedAt: "2026-07-10T12:22:00.000Z",
    authorityBasis:
      "Synthetic training record completed its stated purpose and contained no production evidence, legal hold, or third-party reliance.",
    prerequisites: [
      "Confirm synthetic status.",
      "Confirm no active dependencies.",
      "Preserve disposition receipt.",
    ],
    preservedArtifacts: [
      "Record metadata",
      "Original digest",
      "Synthetic-data declaration",
      "Disposition authorization",
    ],
    destructionScope: [
      "Synthetic media package",
      "Temporary workspace copies",
      "Generated demonstration attachments",
    ],
    blockers: [],
    executionEvidence: [
      "Deletion job receipt",
      "Post-deletion storage scan",
      "Disposition receipt TA14-DSP-000019",
    ],
    dispositionReceiptId: "TA14-DSP-000019",
  },
];

function formatDate(value: string) {
  if (value === "PENDING") return value;
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

export default function RecordDispositionAuthorizationPage() {
  const [records, setRecords] = useState(initialRecords);
  const [selectedId, setSelectedId] = useState(initialRecords[0].dispositionId);
  const [query, setQuery] = useState("");
  const [stateFilter, setStateFilter] = useState<DispositionState | "ALL">("ALL");
  const [methodFilter, setMethodFilter] = useState<DispositionMethod | "ALL">("ALL");
  const [copied, setCopied] = useState(false);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return records.filter((record) => {
      const matchesQuery =
        !needle ||
        [
          record.dispositionId,
          record.retentionId,
          record.recordId,
          record.listingId,
          record.recordTitle,
          record.method,
          record.authorityLevel,
          record.proposedBy,
          record.custodian,
          record.reviewer,
          record.authorityBasis,
          ...record.approvers,
        ]
          .join(" ")
          .toLowerCase()
          .includes(needle);

      return (
        matchesQuery &&
        (stateFilter === "ALL" || record.state === stateFilter) &&
        (methodFilter === "ALL" || record.method === methodFilter)
      );
    });
  }, [methodFilter, query, records, stateFilter]);

  const selected =
    records.find((record) => record.dispositionId === selectedId) ??
    filtered[0] ??
    records[0];

  const metrics = useMemo(
    () => ({
      blocked: records.filter((item) => item.state === "BLOCKED").length,
      review: records.filter((item) => item.state === "UNDER_REVIEW").length,
      authorized: records.filter((item) => item.state === "AUTHORIZED").length,
      executed: records.filter((item) => item.state === "EXECUTED").length,
    }),
    [records],
  );

  const readiness = useMemo(() => {
    const blockers = [...selected.blockers];
    if (!selected.authorityBasis.trim()) blockers.push("Authority basis is missing.");
    if (!selected.approvers.length) blockers.push("No approving authority is listed.");
    if (!selected.preservedArtifacts.length)
      blockers.push("No preserved artifacts are defined.");

    return {
      blockers,
      readyForAuthorization: blockers.length === 0,
      readyForExecution:
        blockers.length === 0 && selected.state === "AUTHORIZED",
    };
  }, [selected]);

  const dispositionPackage = {
    schema: "TA14_RECORD_DISPOSITION_AUTHORIZATION_PACKAGE_V1",
    generatedAt: new Date().toISOString(),
    disposition: selected,
    readiness,
    governance: {
      retentionChecked: true,
      holdChecked: true,
      dependencyChecked: true,
      preservedArtifactsEnumerated: true,
      destructionScopeEnumerated: true,
      authorityRequired: true,
      executionEvidenceRequired: true,
      silentDeletionProhibited: true,
    },
    limitation:
      "Disposition authorization governs a specific method, scope, record version, and authority basis. It does not permit deletion or restriction beyond the approved scope and does not erase preserved lineage, receipts, or required historical evidence.",
  };

  function transition(nextState: DispositionState) {
    setRecords((items) =>
      items.map((item) =>
        item.dispositionId === selected.dispositionId
          ? {
              ...item,
              state: nextState,
              reviewedAt:
                ["UNDER_REVIEW", "AUTHORIZED", "REJECTED"].includes(nextState)
                  ? new Date().toISOString()
                  : item.reviewedAt,
              authorizedAt:
                nextState === "AUTHORIZED"
                  ? new Date().toISOString()
                  : item.authorizedAt,
              executedAt:
                nextState === "EXECUTED"
                  ? new Date().toISOString()
                  : item.executedAt,
              dispositionReceiptId:
                nextState === "EXECUTED" &&
                item.dispositionReceiptId === "PENDING"
                  ? `TA14-DSP-${Math.floor(100000 + Math.random() * 900000)}`
                  : item.dispositionReceiptId,
              executionEvidence:
                nextState === "EXECUTED" && !item.executionEvidence.length
                  ? [
                      "Disposition execution event",
                      "Post-execution verification scan",
                    ]
                  : item.executionEvidence,
            }
          : item,
      ),
    );
  }

  async function copyPackage() {
    await navigator.clipboard.writeText(
      JSON.stringify(dispositionPackage, null, 2),
    );
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <main className="disposition-page">
      <style>{`
        * { box-sizing: border-box; }

        .disposition-page {
          min-height: calc(100vh - 68px);
          padding: 48px 0 110px;
          color: #edf6ff;
        }

        .disposition-wrap {
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
            radial-gradient(circle at 85% 7%, rgba(255, 154, 92, .17), transparent 28%),
            radial-gradient(circle at 14% 0%, rgba(72, 223, 255, .17), transparent 32%),
            linear-gradient(135deg, rgba(14, 30, 48, .97), rgba(5, 11, 20, .98));
          box-shadow: 0 38px 120px rgba(0,0,0,.35);
        }

        .hero::after {
          content: "DISPOSE";
          position: absolute;
          right: -10px;
          bottom: -42px;
          color: rgba(255,255,255,.025);
          font-size: clamp(4.4rem, 11vw, 9.5rem);
          font-weight: 1000;
          letter-spacing: -.1em;
          pointer-events: none;
        }

        .hero-content {
          position: relative;
          z-index: 1;
          max-width: 990px;
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
          background: linear-gradient(100deg, #fff, #8ceaff 50%, #ff9a5c);
          background-clip: text;
          -webkit-background-clip: text;
        }

        .hero-copy {
          max-width: 900px;
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
          background: linear-gradient(100deg, #56e6ff, #ff9a5c);
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

        .metrics {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 13px;
          margin: 22px 0;
        }

        .metric {
          padding: 21px;
          border: 1px solid rgba(132, 177, 216, .14);
          border-radius: 21px;
          background: rgba(7, 16, 27, .74);
        }

        .metric strong {
          display: block;
          font-size: 1.75rem;
          letter-spacing: -.045em;
        }

        .metric span {
          display: block;
          margin-top: 5px;
          color: #7890a7;
          font-size: .72rem;
          font-weight: 850;
          letter-spacing: .08em;
          text-transform: uppercase;
        }

        .toolbar {
          display: grid;
          grid-template-columns: minmax(220px, 1fr) 220px 260px;
          gap: 12px;
          margin-bottom: 22px;
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

        .disposition-row {
          width: 100%;
          padding: 20px 21px;
          border: 0;
          border-bottom: 1px solid rgba(132, 177, 216, .1);
          color: inherit;
          background: transparent;
          text-align: left;
          cursor: pointer;
        }

        .disposition-row:last-child { border-bottom: 0; }

        .disposition-row.active {
          background: linear-gradient(90deg, rgba(84, 232, 255, .09), rgba(255, 154, 92, .025));
          box-shadow: inset 3px 0 0 #56e6ff;
        }

        .row-top, .meta, .detail-top {
          display: flex;
          align-items: center;
          gap: 9px;
          flex-wrap: wrap;
        }

        .row-top { justify-content: space-between; }

        .disposition-title { font-weight: 900; }

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

        .pill.AUTHORIZED, .pill.EXECUTED {
          color: #54efae;
          border-color: rgba(84, 239, 174, .3);
        }

        .pill.PROPOSED, .pill.UNDER_REVIEW, .pill.BLOCKED {
          color: #ffd27b;
          border-color: rgba(255, 210, 123, .3);
        }

        .pill.REJECTED, .pill.CANCELLED {
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

        .kv {
          display: grid;
          grid-template-columns: 180px 1fr;
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

        .box {
          margin-top: 17px;
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

        .notice {
          margin-top: 18px;
          padding: 16px 18px;
          border-left: 3px solid #ff9a5c;
          border-radius: 0 13px 13px 0;
          color: #91a8bd;
          background: rgba(255, 154, 92, .045);
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
          .disposition-wrap { width: min(100% - 24px, 1420px); }
          .disposition-page { padding-top: 24px; }
          .hero { padding: 28px 22px 34px; border-radius: 24px; }
          .toolbar { grid-template-columns: 1fr; }
          .metrics { grid-template-columns: 1fr 1fr; }
          .kv { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="disposition-wrap">
        <section className="hero">
          <div className="hero-content">
            <p className="eyebrow">
              TA-14 Exchange · Record Disposition Authorization
            </p>
            <h1>
              No silent deletion.
              <br />
              <span className="gradient">No disposition without authority.</span>
            </h1>
            <p className="hero-copy">
              Review, authorize, execute, and prove archival, restriction,
              redaction, cryptographic tombstoning, or deletion while preserving
              the required lineage, receipts, dependencies, and execution
              evidence.
            </p>

            <div className="hero-actions">
              <Link className="button" href="/workspace/records/retention">
                Open Retention & Holds
              </Link>
              <Link
                className="button-secondary"
                href="/workspace/preservation"
              >
                Open Preservation Vault
              </Link>
              <Link
                className="button-secondary"
                href="/workspace/records/history"
              >
                Open Record History
              </Link>
            </div>
          </div>
        </section>

        <section className="metrics">
          <article className="metric">
            <strong>{metrics.blocked}</strong>
            <span>Blocked</span>
          </article>
          <article className="metric">
            <strong>{metrics.review}</strong>
            <span>Under review</span>
          </article>
          <article className="metric">
            <strong>{metrics.authorized}</strong>
            <span>Authorized</span>
          </article>
          <article className="metric">
            <strong>{metrics.executed}</strong>
            <span>Executed</span>
          </article>
        </section>

        <section className="toolbar">
          <input
            aria-label="Search disposition records"
            placeholder="Search record, disposition, method, authority, custodian, reviewer, or approver"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />

          <select
            aria-label="Filter disposition state"
            value={stateFilter}
            onChange={(event) =>
              setStateFilter(event.target.value as DispositionState | "ALL")
            }
          >
            <option value="ALL">All states</option>
            <option value="PROPOSED">PROPOSED</option>
            <option value="UNDER_REVIEW">UNDER_REVIEW</option>
            <option value="BLOCKED">BLOCKED</option>
            <option value="AUTHORIZED">AUTHORIZED</option>
            <option value="EXECUTED">EXECUTED</option>
            <option value="REJECTED">REJECTED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>

          <select
            aria-label="Filter disposition method"
            value={methodFilter}
            onChange={(event) =>
              setMethodFilter(event.target.value as DispositionMethod | "ALL")
            }
          >
            <option value="ALL">All methods</option>
            <option value="ARCHIVE">ARCHIVE</option>
            <option value="RESTRICT_ACCESS">RESTRICT_ACCESS</option>
            <option value="REDACT_AND_ARCHIVE">REDACT_AND_ARCHIVE</option>
            <option value="CRYPTOGRAPHIC_TOMBSTONE">
              CRYPTOGRAPHIC_TOMBSTONE
            </option>
            <option value="AUTHORIZED_DELETION">AUTHORIZED_DELETION</option>
          </select>
        </section>

        <section className="grid">
          <div className="panel">
            <div className="panel-head">
              <strong>Disposition proposals</strong>
              <span>{filtered.length} visible</span>
            </div>

            {filtered.length ? (
              filtered.map((record) => (
                <button
                  className={`disposition-row ${
                    selected.dispositionId === record.dispositionId
                      ? "active"
                      : ""
                  }`}
                  key={record.dispositionId}
                  type="button"
                  onClick={() => setSelectedId(record.dispositionId)}
                >
                  <div className="row-top">
                    <span className="disposition-title">
                      {record.recordTitle}
                    </span>
                    <span className={`pill ${record.state}`}>{record.state}</span>
                  </div>
                  <div className="mono">{record.dispositionId}</div>
                  <div className="meta">
                    <span>{record.method}</span>
                    <span>{record.authorityLevel}</span>
                    <span>{record.custodian}</span>
                    <span>v{record.recordVersion}</span>
                  </div>
                </button>
              ))
            ) : (
              <div className="empty">
                No disposition proposal matches the current filters.
              </div>
            )}
          </div>

          <aside className="panel detail">
            <div className="detail-top">
              <span className={`pill ${selected.state}`}>{selected.state}</span>
              <span className="pill">{selected.method}</span>
              <span className="pill">{selected.authorityLevel}</span>
            </div>

            <h2>{selected.recordTitle}</h2>
            <div className="mono">{selected.dispositionId}</div>
            <p>{selected.authorityBasis}</p>

            <dl className="kv">
              <dt>Retention ID</dt>
              <dd>{selected.retentionId}</dd>

              <dt>Record ID</dt>
              <dd>{selected.recordId}</dd>

              <dt>Listing ID</dt>
              <dd>{selected.listingId}</dd>

              <dt>Version</dt>
              <dd>{selected.recordVersion}</dd>

              <dt>Proposed by</dt>
              <dd>{selected.proposedBy}</dd>

              <dt>Custodian</dt>
              <dd>{selected.custodian}</dd>

              <dt>Reviewer</dt>
              <dd>{selected.reviewer}</dd>

              <dt>Proposed</dt>
              <dd>{formatDate(selected.proposedAt)}</dd>

              <dt>Reviewed</dt>
              <dd>{formatDate(selected.reviewedAt)}</dd>

              <dt>Authorized</dt>
              <dd>{formatDate(selected.authorizedAt)}</dd>

              <dt>Executed</dt>
              <dd>{formatDate(selected.executedAt)}</dd>

              <dt>Receipt</dt>
              <dd>{selected.dispositionReceiptId}</dd>
            </dl>

            <div className="box">
              <strong>Approving authorities</strong>
              <ul>
                {selected.approvers.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="box">
              <strong>Prerequisites</strong>
              <ul>
                {selected.prerequisites.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="box">
              <strong>Artifacts preserved after disposition</strong>
              <ul>
                {selected.preservedArtifacts.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="box">
              <strong>Disposition scope</strong>
              {selected.destructionScope.length ? (
                <ul>
                  {selected.destructionScope.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p>No destructive scope defined.</p>
              )}
            </div>

            {readiness.blockers.length ? (
              <div className="box">
                <strong>Blocking conditions</strong>
                <ul>
                  {readiness.blockers.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="box">
              <strong>Execution evidence</strong>
              {selected.executionEvidence.length ? (
                <ul>
                  {selected.executionEvidence.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p>No execution evidence recorded.</p>
              )}
            </div>

            <div className="detail-actions">
              <button
                className="button"
                type="button"
                onClick={() => transition("UNDER_REVIEW")}
              >
                Begin review
              </button>

              <button
                className="small-button"
                type="button"
                onClick={() => transition("AUTHORIZED")}
                disabled={!readiness.readyForAuthorization}
              >
                Authorize disposition
              </button>

              <button
                className="small-button"
                type="button"
                onClick={() => transition("EXECUTED")}
                disabled={!readiness.readyForExecution}
              >
                Record execution
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
                onClick={() => transition("CANCELLED")}
              >
                Cancel
              </button>

              <button
                className="small-button"
                type="button"
                onClick={copyPackage}
              >
                {copied ? "Copied" : "Copy disposition package"}
              </button>

              <button
                className="small-button"
                type="button"
                onClick={() =>
                  downloadJson(
                    `${selected.dispositionId.toLowerCase()}-disposition-package.json`,
                    dispositionPackage,
                  )
                }
              >
                Download package
              </button>
            </div>

            <div className="notice">
              Disposition is a governed execution, not an administrative
              shortcut. The approved method, exact scope, authority, preserved
              lineage, and post-execution evidence must remain reviewable.
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
