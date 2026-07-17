"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type RetentionState =
  | "ACTIVE"
  | "HOLD"
  | "REVIEW_DUE"
  | "ELIGIBLE_FOR_DISPOSITION"
  | "DISPOSITION_BLOCKED"
  | "ARCHIVED";

type HoldType =
  | "NONE"
  | "LEGAL"
  | "REGULATORY"
  | "INVESTIGATION"
  | "CONTRACTUAL"
  | "OWNER_DIRECTIVE"
  | "SAFETY";

type DispositionMethod =
  | "NONE"
  | "ARCHIVE"
  | "REDACT_AND_ARCHIVE"
  | "RESTRICT_ACCESS"
  | "CRYPTOGRAPHIC_TOMBSTONE"
  | "AUTHORIZED_DELETION";

type RetentionRecord = {
  retentionId: string;
  recordId: string;
  listingId: string;
  recordTitle: string;
  recordVersion: string;
  state: RetentionState;
  holdType: HoldType;
  retentionClass: string;
  retentionStart: string;
  minimumRetentionUntil: string;
  nextReviewAt: string;
  dispositionMethod: DispositionMethod;
  authorityBasis: string;
  custodian: string;
  jurisdictions: string[];
  dependencies: string[];
  holdReasons: string[];
  dispositionConditions: string[];
  lastReviewedBy: string;
  lastReviewedAt: string;
  retentionReceiptId: string;
};

const initialRecords: RetentionRecord[] = [
  {
    retentionId: "TA14-RRT-000061",
    recordId: "TA14-AR-2026-000179",
    listingId: "TA14-ARX-000041",
    recordTitle: "Facility Moisture Excursion Record",
    recordVersion: "2.1.0",
    state: "HOLD",
    holdType: "INVESTIGATION",
    retentionClass: "Operational incident evidence — extended",
    retentionStart: "2026-07-17T13:11:00.000Z",
    minimumRetentionUntil: "2033-07-17T13:11:00.000Z",
    nextReviewAt: "2027-01-17T13:11:00.000Z",
    dispositionMethod: "ARCHIVE",
    authorityBasis:
      "Record is connected to an active facility investigation and remains subject to preserved reliance and access history.",
    custodian: "North Basin Operations",
    jurisdictions: ["United States", "Florida"],
    dependencies: [
      "TA14-ARV-000116",
      "TA14-CUST-PKG-000179",
      "TA14-PR-000588",
      "TA14-RRL-000051",
      "TA14-RAL-000081",
    ],
    holdReasons: [
      "Active independent review",
      "Open contextual dispute",
      "Potential insurance reliance",
    ],
    dispositionConditions: [
      "All disputes must be resolved.",
      "No active reliance or access authorization may remain.",
      "Revocation and supersession history must remain inspectable.",
    ],
    lastReviewedBy: "TA-14 Review Desk",
    lastReviewedAt: "2026-07-17T17:44:00.000Z",
    retentionReceiptId: "TA14-RET-000061",
  },
  {
    retentionId: "TA14-RRT-000060",
    recordId: "TA14-AR-2026-000184",
    listingId: "TA14-ARX-000042",
    recordTitle: "Field Equipment Condition Record",
    recordVersion: "1.0.0",
    state: "ACTIVE",
    holdType: "CONTRACTUAL",
    retentionClass: "Service evidence — standard",
    retentionStart: "2026-07-17T15:44:00.000Z",
    minimumRetentionUntil: "2031-07-17T15:44:00.000Z",
    nextReviewAt: "2027-07-17T15:44:00.000Z",
    dispositionMethod: "ARCHIVE",
    authorityBasis:
      "Retention required by service-record policy, customer relationship, correction history, and workmanship documentation.",
    custodian: "Transparent Air",
    jurisdictions: ["United States", "Florida"],
    dependencies: [
      "TA14-ARV-000117",
      "TA14-CUST-PKG-000184",
      "TA14-ARC-000024",
      "TA14-RAL-000080",
    ],
    holdReasons: [
      "Contractual service documentation",
      "Open correction review",
    ],
    dispositionConditions: [
      "Correction process must be complete.",
      "Warranty period and contractual retention term must expire.",
      "No unresolved claim may remain.",
    ],
    lastReviewedBy: "Transparent Air",
    lastReviewedAt: "2026-07-17T17:50:00.000Z",
    retentionReceiptId: "TA14-RET-000060",
  },
  {
    retentionId: "TA14-RRT-000059",
    recordId: "TA14-AR-2026-000161",
    listingId: "TA14-ARX-000034",
    recordTitle: "Cold Storage Temperature Excursion Record",
    recordVersion: "1.0.0",
    state: "ARCHIVED",
    holdType: "NONE",
    retentionClass: "Superseded record — permanent lineage",
    retentionStart: "2026-07-15T19:18:00.000Z",
    minimumRetentionUntil: "PERMANENT",
    nextReviewAt: "2027-07-15T19:18:00.000Z",
    dispositionMethod: "CRYPTOGRAPHIC_TOMBSTONE",
    authorityBasis:
      "Source version is permanently retained as part of the correction and supersession lineage.",
    custodian: "TA-14 Preservation Vault",
    jurisdictions: ["United States"],
    dependencies: [
      "TA14-ARC-000022",
      "TA14-SUP-000018",
      "TA14-ARR-000011",
    ],
    holdReasons: [],
    dispositionConditions: [
      "Source digest and supersession links must remain permanently available.",
      "Public access may remain restricted.",
    ],
    lastReviewedBy: "TA-14 Preservation Vault",
    lastReviewedAt: "2026-07-16T10:22:00.000Z",
    retentionReceiptId: "TA14-RET-000059",
  },
];

function formatDate(value: string) {
  if (value === "PERMANENT") return value;
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

export default function RecordRetentionLegalHoldPage() {
  const [records, setRecords] = useState(initialRecords);
  const [selectedId, setSelectedId] = useState(initialRecords[0].retentionId);
  const [query, setQuery] = useState("");
  const [stateFilter, setStateFilter] = useState<RetentionState | "ALL">("ALL");
  const [holdFilter, setHoldFilter] = useState<HoldType | "ALL">("ALL");
  const [copied, setCopied] = useState(false);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return records.filter((record) => {
      const matchesQuery =
        !needle ||
        [
          record.retentionId,
          record.recordId,
          record.listingId,
          record.recordTitle,
          record.retentionClass,
          record.holdType,
          record.authorityBasis,
          record.custodian,
          ...record.jurisdictions,
        ]
          .join(" ")
          .toLowerCase()
          .includes(needle);

      return (
        matchesQuery &&
        (stateFilter === "ALL" || record.state === stateFilter) &&
        (holdFilter === "ALL" || record.holdType === holdFilter)
      );
    });
  }, [holdFilter, query, records, stateFilter]);

  const selected =
    records.find((record) => record.retentionId === selectedId) ??
    filtered[0] ??
    records[0];

  const metrics = useMemo(
    () => ({
      holds: records.filter((item) => item.state === "HOLD").length,
      active: records.filter((item) => item.state === "ACTIVE").length,
      archived: records.filter((item) => item.state === "ARCHIVED").length,
      reviewDue: records.filter((item) => item.state === "REVIEW_DUE").length,
    }),
    [records],
  );

  const retentionPackage = {
    schema: "TA14_RECORD_RETENTION_HOLD_PACKAGE_V1",
    generatedAt: new Date().toISOString(),
    retention: selected,
    governance: {
      preserveDependencies: true,
      preserveLineage: true,
      blockDispositionDuringHold: selected.holdType !== "NONE",
      requireAuthorityForDisposition: true,
      requireReceiptForDisposition: true,
      prohibitSilentDeletion: true,
    },
    limitation:
      "A retention or hold record governs preservation and disposition eligibility. It does not independently determine every applicable legal duty and must be interpreted with the controlling contract, policy, jurisdiction, or order.",
  };

  function transition(nextState: RetentionState) {
    setRecords((items) =>
      items.map((item) =>
        item.retentionId === selected.retentionId
          ? {
              ...item,
              state: nextState,
              lastReviewedAt: new Date().toISOString(),
              lastReviewedBy: "TA-14 Review Desk",
            }
          : item,
      ),
    );
  }

  function applyLegalHold() {
    setRecords((items) =>
      items.map((item) =>
        item.retentionId === selected.retentionId
          ? {
              ...item,
              state: "HOLD",
              holdType: "LEGAL",
              lastReviewedAt: new Date().toISOString(),
              lastReviewedBy: "TA-14 Review Desk",
              holdReasons: Array.from(
                new Set([...item.holdReasons, "Legal hold applied"]),
              ),
            }
          : item,
      ),
    );
  }

  async function copyPackage() {
    await navigator.clipboard.writeText(
      JSON.stringify(retentionPackage, null, 2),
    );
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <main className="retention-page">
      <style>{`
        * { box-sizing: border-box; }

        .retention-page {
          min-height: calc(100vh - 68px);
          padding: 48px 0 110px;
          color: #edf6ff;
        }

        .retention-wrap {
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
            radial-gradient(circle at 85% 7%, rgba(181, 132, 255, .17), transparent 28%),
            radial-gradient(circle at 14% 0%, rgba(72, 223, 255, .17), transparent 32%),
            linear-gradient(135deg, rgba(14, 30, 48, .97), rgba(5, 11, 20, .98));
          box-shadow: 0 38px 120px rgba(0,0,0,.35);
        }

        .hero::after {
          content: "RETAIN";
          position: absolute;
          right: -10px;
          bottom: -42px;
          color: rgba(255,255,255,.025);
          font-size: clamp(4.6rem, 12vw, 10rem);
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
          background: linear-gradient(100deg, #fff, #8ceaff 50%, #b584ff);
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
          background: linear-gradient(100deg, #56e6ff, #b584ff);
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
          grid-template-columns: minmax(220px, 1fr) 240px 220px;
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

        .retention-row {
          width: 100%;
          padding: 20px 21px;
          border: 0;
          border-bottom: 1px solid rgba(132, 177, 216, .1);
          color: inherit;
          background: transparent;
          text-align: left;
          cursor: pointer;
        }

        .retention-row:last-child { border-bottom: 0; }

        .retention-row.active {
          background: linear-gradient(90deg, rgba(84, 232, 255, .09), rgba(181, 132, 255, .025));
          box-shadow: inset 3px 0 0 #56e6ff;
        }

        .row-top, .meta, .detail-top {
          display: flex;
          align-items: center;
          gap: 9px;
          flex-wrap: wrap;
        }

        .row-top { justify-content: space-between; }

        .retention-title { font-weight: 900; }

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

        .pill.ACTIVE, .pill.ARCHIVED {
          color: #54efae;
          border-color: rgba(84, 239, 174, .3);
        }

        .pill.HOLD, .pill.REVIEW_DUE, .pill.DISPOSITION_BLOCKED {
          color: #ffd27b;
          border-color: rgba(255, 210, 123, .3);
        }

        .pill.ELIGIBLE_FOR_DISPOSITION {
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
          border-left: 3px solid #b584ff;
          border-radius: 0 13px 13px 0;
          color: #91a8bd;
          background: rgba(181, 132, 255, .045);
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
          .retention-wrap { width: min(100% - 24px, 1420px); }
          .retention-page { padding-top: 24px; }
          .hero { padding: 28px 22px 34px; border-radius: 24px; }
          .toolbar { grid-template-columns: 1fr; }
          .metrics { grid-template-columns: 1fr 1fr; }
          .kv { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="retention-wrap">
        <section className="hero">
          <div className="hero-content">
            <p className="eyebrow">
              TA-14 Exchange · Record Retention & Legal Hold
            </p>
            <h1>
              Preserve by rule.
              <br />
              <span className="gradient">Dispose only by authority.</span>
            </h1>
            <p className="hero-copy">
              Govern how long a record must remain preserved, which holds block
              disposition, what dependencies must survive, who has custody, and
              which authority must approve archival, restriction, tombstoning,
              or deletion.
            </p>

            <div className="hero-actions">
              <Link className="button" href="/workspace/preservation">
                Open Preservation Vault
              </Link>
              <Link
                className="button-secondary"
                href="/workspace/records/access"
              >
                Open Access Ledger
              </Link>
              <Link
                className="button-secondary"
                href="/workspace/records/revocations"
              >
                Open Revocations
              </Link>
            </div>
          </div>
        </section>

        <section className="metrics">
          <article className="metric">
            <strong>{metrics.holds}</strong>
            <span>Active holds</span>
          </article>
          <article className="metric">
            <strong>{metrics.active}</strong>
            <span>Active retention</span>
          </article>
          <article className="metric">
            <strong>{metrics.reviewDue}</strong>
            <span>Review due</span>
          </article>
          <article className="metric">
            <strong>{metrics.archived}</strong>
            <span>Archived</span>
          </article>
        </section>

        <section className="toolbar">
          <input
            aria-label="Search retention records"
            placeholder="Search record, retention class, hold, custodian, jurisdiction, or authority"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />

          <select
            aria-label="Filter retention state"
            value={stateFilter}
            onChange={(event) =>
              setStateFilter(event.target.value as RetentionState | "ALL")
            }
          >
            <option value="ALL">All states</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="HOLD">HOLD</option>
            <option value="REVIEW_DUE">REVIEW_DUE</option>
            <option value="ELIGIBLE_FOR_DISPOSITION">
              ELIGIBLE_FOR_DISPOSITION
            </option>
            <option value="DISPOSITION_BLOCKED">DISPOSITION_BLOCKED</option>
            <option value="ARCHIVED">ARCHIVED</option>
          </select>

          <select
            aria-label="Filter hold type"
            value={holdFilter}
            onChange={(event) =>
              setHoldFilter(event.target.value as HoldType | "ALL")
            }
          >
            <option value="ALL">All hold types</option>
            <option value="NONE">NONE</option>
            <option value="LEGAL">LEGAL</option>
            <option value="REGULATORY">REGULATORY</option>
            <option value="INVESTIGATION">INVESTIGATION</option>
            <option value="CONTRACTUAL">CONTRACTUAL</option>
            <option value="OWNER_DIRECTIVE">OWNER_DIRECTIVE</option>
            <option value="SAFETY">SAFETY</option>
          </select>
        </section>

        <section className="grid">
          <div className="panel">
            <div className="panel-head">
              <strong>Retention and hold records</strong>
              <span>{filtered.length} visible</span>
            </div>

            {filtered.length ? (
              filtered.map((record) => (
                <button
                  className={`retention-row ${
                    selected.retentionId === record.retentionId ? "active" : ""
                  }`}
                  key={record.retentionId}
                  type="button"
                  onClick={() => setSelectedId(record.retentionId)}
                >
                  <div className="row-top">
                    <span className="retention-title">
                      {record.recordTitle}
                    </span>
                    <span className={`pill ${record.state}`}>{record.state}</span>
                  </div>
                  <div className="mono">{record.retentionId}</div>
                  <div className="meta">
                    <span>{record.retentionClass}</span>
                    <span>{record.holdType}</span>
                    <span>{record.custodian}</span>
                    <span>v{record.recordVersion}</span>
                  </div>
                </button>
              ))
            ) : (
              <div className="empty">
                No retention record matches the current filters.
              </div>
            )}
          </div>

          <aside className="panel detail">
            <div className="detail-top">
              <span className={`pill ${selected.state}`}>{selected.state}</span>
              <span className="pill">{selected.holdType}</span>
              <span className="pill">{selected.dispositionMethod}</span>
            </div>

            <h2>{selected.recordTitle}</h2>
            <div className="mono">{selected.retentionId}</div>
            <p>{selected.authorityBasis}</p>

            <dl className="kv">
              <dt>Record ID</dt>
              <dd>{selected.recordId}</dd>

              <dt>Listing ID</dt>
              <dd>{selected.listingId}</dd>

              <dt>Version</dt>
              <dd>{selected.recordVersion}</dd>

              <dt>Retention class</dt>
              <dd>{selected.retentionClass}</dd>

              <dt>Retention start</dt>
              <dd>{formatDate(selected.retentionStart)}</dd>

              <dt>Minimum retention</dt>
              <dd>{formatDate(selected.minimumRetentionUntil)}</dd>

              <dt>Next review</dt>
              <dd>{formatDate(selected.nextReviewAt)}</dd>

              <dt>Custodian</dt>
              <dd>{selected.custodian}</dd>

              <dt>Last reviewed by</dt>
              <dd>{selected.lastReviewedBy}</dd>

              <dt>Last reviewed</dt>
              <dd>{formatDate(selected.lastReviewedAt)}</dd>

              <dt>Receipt</dt>
              <dd>{selected.retentionReceiptId}</dd>
            </dl>

            <div className="box">
              <strong>Jurisdictions</strong>
              <ul>
                {selected.jurisdictions.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="box">
              <strong>Dependent records and receipts</strong>
              <ul>
                {selected.dependencies.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="box">
              <strong>Hold reasons</strong>
              {selected.holdReasons.length ? (
                <ul>
                  {selected.holdReasons.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p>No active hold reason.</p>
              )}
            </div>

            <div className="box">
              <strong>Disposition conditions</strong>
              <ul>
                {selected.dispositionConditions.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="detail-actions">
              <button className="button" type="button" onClick={applyLegalHold}>
                Apply legal hold
              </button>

              <button
                className="small-button"
                type="button"
                onClick={() => transition("REVIEW_DUE")}
              >
                Mark review due
              </button>

              <button
                className="small-button"
                type="button"
                onClick={() => transition("DISPOSITION_BLOCKED")}
              >
                Block disposition
              </button>

              <button
                className="small-button"
                type="button"
                onClick={() => transition("ELIGIBLE_FOR_DISPOSITION")}
                disabled={selected.holdType !== "NONE"}
              >
                Mark eligible
              </button>

              <button
                className="small-button"
                type="button"
                onClick={() => transition("ARCHIVED")}
              >
                Archive
              </button>

              <button
                className="small-button"
                type="button"
                onClick={copyPackage}
              >
                {copied ? "Copied" : "Copy retention package"}
              </button>

              <button
                className="small-button"
                type="button"
                onClick={() =>
                  downloadJson(
                    `${selected.retentionId.toLowerCase()}-retention-package.json`,
                    retentionPackage,
                  )
                }
              >
                Download package
              </button>
            </div>

            <div className="notice">
              Retention governs preservation. Disposition requires affirmative
              authority, completed conditions, preserved dependency lineage,
              and a receipt. No record should disappear through silent deletion.
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
