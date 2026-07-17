"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type RevocationState =
  | "REQUESTED"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "ACTIVE"
  | "REJECTED"
  | "LIFTED";

type RevocationGround =
  | "AUTHORITY_WITHDRAWN"
  | "KEY_COMPROMISE"
  | "PACKAGE_CORRUPTION"
  | "FALSE_REPRESENTATION"
  | "PRIVACY_OR_SAFETY"
  | "SUPERSEDED"
  | "COURT_OR_REGULATORY_ORDER"
  | "OTHER";

type Scope =
  | "LISTING_ONLY"
  | "VERIFICATION_ONLY"
  | "SIGNATURE_ONLY"
  | "PUBLIC_ACCESS"
  | "FULL_RECORD";

type RevocationRecord = {
  revocationId: string;
  recordId: string;
  listingId: string;
  recordTitle: string;
  recordVersion: string;
  state: RevocationState;
  ground: RevocationGround;
  scope: Scope;
  requestedBy: string;
  authorityBasis: string;
  reviewer: string;
  requestedAt: string;
  reviewedAt: string;
  activatedAt: string;
  expiresAt: string;
  reason: string;
  affectedDependencies: string[];
  preservedReferences: string[];
  publicNotice: string;
  revocationReceiptId: string;
};

const initialRevocations: RevocationRecord[] = [
  {
    revocationId: "TA14-ARR-000012",
    recordId: "TA14-AR-2026-000172",
    listingId: "TA14-ARX-000039",
    recordTitle: "AI Payment Route Incident Record",
    recordVersion: "1.3.0",
    state: "UNDER_REVIEW",
    ground: "PACKAGE_CORRUPTION",
    scope: "FULL_RECORD",
    requestedBy: "Orchard Systems",
    authorityBasis:
      "Record owner requested emergency revocation after a preserved manifest mismatch was confirmed during verification.",
    reviewer: "TA-14 Review Desk",
    requestedAt: "2026-07-17T17:03:00.000Z",
    reviewedAt: "PENDING",
    activatedAt: "PENDING",
    expiresAt: "NO EXPIRATION",
    reason:
      "The package represented as preserved may not correspond to the package originally reviewed. Public access and reliance should halt until a corrected package is independently verified.",
    affectedDependencies: [
      "TA14-ARV-000115",
      "TA14-PR-000579",
      "TA14-CUST-PKG-000172",
      "TA14-AUTH-000862",
    ],
    preservedReferences: [
      "Original listing metadata",
      "Original package digest",
      "Verification report",
      "Dispute package",
    ],
    publicNotice:
      "This record is under revocation review. Do not rely on the current package for execution, certification, or final adjudication.",
    revocationReceiptId: "PENDING",
  },
  {
    revocationId: "TA14-ARR-000011",
    recordId: "TA14-AR-2026-000161",
    listingId: "TA14-ARX-000034",
    recordTitle: "Cold Storage Temperature Excursion Record",
    recordVersion: "1.0.0",
    state: "ACTIVE",
    ground: "SUPERSEDED",
    scope: "LISTING_ONLY",
    requestedBy: "TA-14 Review Desk",
    authorityBasis:
      "Supersession receipt TA14-SUP-000018 replaced the public listing with corrected version 1.0.1.",
    reviewer: "TA-14 Review Desk",
    requestedAt: "2026-07-16T10:20:00.000Z",
    reviewedAt: "2026-07-16T10:21:00.000Z",
    activatedAt: "2026-07-16T10:22:00.000Z",
    expiresAt: "NO EXPIRATION",
    reason:
      "The prior public listing contains a transposed device serial number and has been superseded by a linked corrected version.",
    affectedDependencies: ["TA14-ARX-000034"],
    preservedReferences: [
      "Source record version 1.0.0",
      "Correction record TA14-ARC-000022",
      "Supersession receipt TA14-SUP-000018",
    ],
    publicNotice:
      "This listing has been superseded. The preserved source remains available for historical inspection, but version 1.0.1 is the current public representation.",
    revocationReceiptId: "TA14-REV-000011",
  },
  {
    revocationId: "TA14-ARR-000010",
    recordId: "TA14-AR-2026-000154",
    listingId: "TA14-ARX-000031",
    recordTitle: "Restricted Personnel Access Record",
    recordVersion: "1.0.0",
    state: "APPROVED",
    ground: "PRIVACY_OR_SAFETY",
    scope: "PUBLIC_ACCESS",
    requestedBy: "Record subject",
    authorityBasis:
      "Verified identity request supported by applicable privacy and safety restrictions.",
    reviewer: "Independent Privacy Reviewer",
    requestedAt: "2026-07-15T09:18:00.000Z",
    reviewedAt: "2026-07-16T14:02:00.000Z",
    activatedAt: "PENDING",
    expiresAt: "NO EXPIRATION",
    reason:
      "Continued public access could expose sensitive location and personnel information without serving the stated record purpose.",
    affectedDependencies: ["TA14-ARX-000031"],
    preservedReferences: [
      "Private preservation copy",
      "Access-history ledger",
      "Authority record",
    ],
    publicNotice:
      "Public access has been approved for revocation. The preserved record remains available only to authorized reviewers.",
    revocationReceiptId: "PENDING",
  },
];

function formatDate(value: string) {
  if (value === "PENDING" || value === "NO EXPIRATION") return value;
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

export default function RecordRevocationRegistryPage() {
  const [records, setRecords] = useState(initialRevocations);
  const [selectedId, setSelectedId] = useState(initialRevocations[0].revocationId);
  const [query, setQuery] = useState("");
  const [stateFilter, setStateFilter] = useState<RevocationState | "ALL">("ALL");
  const [scopeFilter, setScopeFilter] = useState<Scope | "ALL">("ALL");
  const [copied, setCopied] = useState(false);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return records.filter((record) => {
      const matchesQuery =
        !needle ||
        [
          record.revocationId,
          record.recordId,
          record.listingId,
          record.recordTitle,
          record.ground,
          record.scope,
          record.requestedBy,
          record.authorityBasis,
          record.reviewer,
          record.reason,
          record.publicNotice,
        ]
          .join(" ")
          .toLowerCase()
          .includes(needle);

      return (
        matchesQuery &&
        (stateFilter === "ALL" || record.state === stateFilter) &&
        (scopeFilter === "ALL" || record.scope === scopeFilter)
      );
    });
  }, [query, records, scopeFilter, stateFilter]);

  const selected =
    records.find((record) => record.revocationId === selectedId) ??
    filtered[0] ??
    records[0];

  const metrics = useMemo(
    () => ({
      active: records.filter((item) => item.state === "ACTIVE").length,
      review: records.filter((item) => item.state === "UNDER_REVIEW").length,
      approved: records.filter((item) => item.state === "APPROVED").length,
      full: records.filter((item) => item.scope === "FULL_RECORD").length,
    }),
    [records],
  );

  const revocationPackage = {
    schema: "TA14_ADMISSIBLE_RECORD_REVOCATION_PACKAGE_V1",
    generatedAt: new Date().toISOString(),
    revocation: selected,
    enforcement: {
      haltPublicReliance: ["PUBLIC_ACCESS", "FULL_RECORD"].includes(
        selected.scope,
      ),
      haltVerificationReliance: ["VERIFICATION_ONLY", "FULL_RECORD"].includes(
        selected.scope,
      ),
      haltSignatureReliance: ["SIGNATURE_ONLY", "FULL_RECORD"].includes(
        selected.scope,
      ),
      preserveHistoricalRecord: true,
      preserveRevocationHistory: true,
      prohibitSilentDeletion: true,
    },
    limitation:
      "Revocation changes permitted reliance, access, or status. It does not erase the historical record, destroy preserved evidence, or rewrite what occurred before revocation.",
  };

  function transition(nextState: RevocationState) {
    setRecords((items) =>
      items.map((item) =>
        item.revocationId === selected.revocationId
          ? {
              ...item,
              state: nextState,
              reviewedAt:
                nextState === "APPROVED" ||
                nextState === "REJECTED" ||
                nextState === "ACTIVE"
                  ? item.reviewedAt === "PENDING"
                    ? new Date().toISOString()
                    : item.reviewedAt
                  : item.reviewedAt,
              activatedAt:
                nextState === "ACTIVE"
                  ? new Date().toISOString()
                  : item.activatedAt,
              revocationReceiptId:
                nextState === "ACTIVE" && item.revocationReceiptId === "PENDING"
                  ? `TA14-REV-${Math.floor(100000 + Math.random() * 900000)}`
                  : item.revocationReceiptId,
            }
          : item,
      ),
    );
  }

  async function copyPackage() {
    await navigator.clipboard.writeText(
      JSON.stringify(revocationPackage, null, 2),
    );
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <main className="revocation-page">
      <style>{`
        * { box-sizing: border-box; }

        .revocation-page {
          min-height: calc(100vh - 68px);
          padding: 48px 0 110px;
          color: #edf6ff;
        }

        .revocation-wrap {
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
            radial-gradient(circle at 85% 7%, rgba(255, 112, 135, .16), transparent 28%),
            radial-gradient(circle at 14% 0%, rgba(72, 223, 255, .17), transparent 32%),
            linear-gradient(135deg, rgba(14, 30, 48, .97), rgba(5, 11, 20, .98));
          box-shadow: 0 38px 120px rgba(0,0,0,.35);
        }

        .hero::after {
          content: "REVOKE";
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
          background: linear-gradient(100deg, #fff, #8ceaff 50%, #ff7087);
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
          background: linear-gradient(100deg, #56e6ff, #ff7087);
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
          grid-template-columns: minmax(220px, 1fr) 220px 220px;
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

        .revocation-row {
          width: 100%;
          padding: 20px 21px;
          border: 0;
          border-bottom: 1px solid rgba(132, 177, 216, .1);
          color: inherit;
          background: transparent;
          text-align: left;
          cursor: pointer;
        }

        .revocation-row:last-child { border-bottom: 0; }

        .revocation-row.active {
          background: linear-gradient(90deg, rgba(84, 232, 255, .09), rgba(255, 112, 135, .025));
          box-shadow: inset 3px 0 0 #56e6ff;
        }

        .row-top, .meta, .detail-top {
          display: flex;
          align-items: center;
          gap: 9px;
          flex-wrap: wrap;
        }

        .row-top { justify-content: space-between; }

        .revocation-title { font-weight: 900; }

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

        .pill.LIFTED {
          color: #54efae;
          border-color: rgba(84, 239, 174, .3);
        }

        .pill.REQUESTED, .pill.UNDER_REVIEW, .pill.APPROVED {
          color: #ffd27b;
          border-color: rgba(255, 210, 123, .3);
        }

        .pill.ACTIVE, .pill.REJECTED, .pill.FULL_RECORD {
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
          border-left: 3px solid #ff7087;
          border-radius: 0 13px 13px 0;
          color: #91a8bd;
          background: rgba(255, 112, 135, .045);
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
          .revocation-wrap { width: min(100% - 24px, 1420px); }
          .revocation-page { padding-top: 24px; }
          .hero { padding: 28px 22px 34px; border-radius: 24px; }
          .toolbar { grid-template-columns: 1fr; }
          .metrics { grid-template-columns: 1fr 1fr; }
          .kv { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="revocation-wrap">
        <section className="hero">
          <div className="hero-content">
            <p className="eyebrow">
              TA-14 Exchange · Record Revocation Registry
            </p>
            <h1>
              Revoke reliance.
              <br />
              <span className="gradient">Never erase the record.</span>
            </h1>
            <p className="hero-copy">
              Withdraw access, verification reliance, signature trust, or the
              full record state while preserving the historical package,
              authority basis, affected dependencies, public notice, and
              revocation receipt.
            </p>

            <div className="hero-actions">
              <Link className="button" href="/workspace/records/exchange">
                Open Record Exchange
              </Link>
              <Link
                className="button-secondary"
                href="/workspace/records/corrections"
              >
                Open Corrections
              </Link>
              <Link className="button-secondary" href="/workspace/keys">
                Open Trust Keys
              </Link>
            </div>
          </div>
        </section>

        <section className="metrics">
          <article className="metric">
            <strong>{metrics.active}</strong>
            <span>Active revocations</span>
          </article>
          <article className="metric">
            <strong>{metrics.review}</strong>
            <span>Under review</span>
          </article>
          <article className="metric">
            <strong>{metrics.approved}</strong>
            <span>Approved</span>
          </article>
          <article className="metric">
            <strong>{metrics.full}</strong>
            <span>Full-record scope</span>
          </article>
        </section>

        <section className="toolbar">
          <input
            aria-label="Search revocations"
            placeholder="Search revocation, record, ground, scope, requester, reviewer, or notice"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />

          <select
            aria-label="Filter revocation state"
            value={stateFilter}
            onChange={(event) =>
              setStateFilter(event.target.value as RevocationState | "ALL")
            }
          >
            <option value="ALL">All states</option>
            <option value="REQUESTED">REQUESTED</option>
            <option value="UNDER_REVIEW">UNDER_REVIEW</option>
            <option value="APPROVED">APPROVED</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="REJECTED">REJECTED</option>
            <option value="LIFTED">LIFTED</option>
          </select>

          <select
            aria-label="Filter revocation scope"
            value={scopeFilter}
            onChange={(event) =>
              setScopeFilter(event.target.value as Scope | "ALL")
            }
          >
            <option value="ALL">All scope</option>
            <option value="LISTING_ONLY">LISTING_ONLY</option>
            <option value="VERIFICATION_ONLY">VERIFICATION_ONLY</option>
            <option value="SIGNATURE_ONLY">SIGNATURE_ONLY</option>
            <option value="PUBLIC_ACCESS">PUBLIC_ACCESS</option>
            <option value="FULL_RECORD">FULL_RECORD</option>
          </select>
        </section>

        <section className="grid">
          <div className="panel">
            <div className="panel-head">
              <strong>Revocation records</strong>
              <span>{filtered.length} visible</span>
            </div>

            {filtered.length ? (
              filtered.map((record) => (
                <button
                  className={`revocation-row ${
                    selected.revocationId === record.revocationId ? "active" : ""
                  }`}
                  key={record.revocationId}
                  type="button"
                  onClick={() => setSelectedId(record.revocationId)}
                >
                  <div className="row-top">
                    <span className="revocation-title">
                      {record.recordTitle}
                    </span>
                    <span className={`pill ${record.state}`}>{record.state}</span>
                  </div>
                  <div className="mono">{record.revocationId}</div>
                  <div className="meta">
                    <span>{record.ground}</span>
                    <span>{record.scope}</span>
                    <span>v{record.recordVersion}</span>
                    <span>{formatDate(record.requestedAt)}</span>
                  </div>
                </button>
              ))
            ) : (
              <div className="empty">
                No revocation record matches the current filters.
              </div>
            )}
          </div>

          <aside className="panel detail">
            <div className="detail-top">
              <span className={`pill ${selected.state}`}>{selected.state}</span>
              <span className={`pill ${selected.scope}`}>{selected.scope}</span>
              <span className="pill">{selected.ground}</span>
            </div>

            <h2>{selected.recordTitle}</h2>
            <div className="mono">{selected.revocationId}</div>
            <p>{selected.reason}</p>

            <dl className="kv">
              <dt>Record ID</dt>
              <dd>{selected.recordId}</dd>

              <dt>Listing ID</dt>
              <dd>{selected.listingId}</dd>

              <dt>Version</dt>
              <dd>{selected.recordVersion}</dd>

              <dt>Requested by</dt>
              <dd>{selected.requestedBy}</dd>

              <dt>Reviewer</dt>
              <dd>{selected.reviewer}</dd>

              <dt>Requested</dt>
              <dd>{formatDate(selected.requestedAt)}</dd>

              <dt>Reviewed</dt>
              <dd>{formatDate(selected.reviewedAt)}</dd>

              <dt>Activated</dt>
              <dd>{formatDate(selected.activatedAt)}</dd>

              <dt>Expires</dt>
              <dd>{formatDate(selected.expiresAt)}</dd>

              <dt>Receipt</dt>
              <dd>{selected.revocationReceiptId}</dd>
            </dl>

            <div className="box">
              <strong>Authority basis</strong>
              <p>{selected.authorityBasis}</p>
            </div>

            <div className="box">
              <strong>Affected dependencies</strong>
              <ul>
                {selected.affectedDependencies.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="box">
              <strong>Preserved references</strong>
              <ul>
                {selected.preservedReferences.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="box">
              <strong>Public notice</strong>
              <p>{selected.publicNotice}</p>
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
                onClick={() => transition("APPROVED")}
              >
                Approve
              </button>

              <button
                className="small-button"
                type="button"
                onClick={() => transition("ACTIVE")}
                disabled={selected.state !== "APPROVED"}
              >
                Activate revocation
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
                onClick={() => transition("LIFTED")}
                disabled={selected.state !== "ACTIVE"}
              >
                Lift revocation
              </button>

              <button
                className="small-button"
                type="button"
                onClick={copyPackage}
              >
                {copied ? "Copied" : "Copy revocation package"}
              </button>

              <button
                className="small-button"
                type="button"
                onClick={() =>
                  downloadJson(
                    `${selected.revocationId.toLowerCase()}-revocation-package.json`,
                    revocationPackage,
                  )
                }
              >
                Download package
              </button>
            </div>

            <div className="notice">
              Revocation changes what may be accessed, trusted, cited, or relied
              upon. It does not silently delete the historical record or alter
              what was previously preserved.
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
