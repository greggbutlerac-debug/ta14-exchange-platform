"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type DisputeState =
  | "OPEN"
  | "UNDER_REVIEW"
  | "EVIDENCE_REQUESTED"
  | "RESOLVED"
  | "REJECTED"
  | "ESCALATED";

type Severity = "LOW" | "MODERATE" | "HIGH" | "CRITICAL";

type DisputeGround =
  | "IDENTITY"
  | "AUTHORITY"
  | "CUSTODY"
  | "INTEGRITY"
  | "CONTEXT"
  | "OMISSION"
  | "MISREPRESENTATION"
  | "OTHER";

type DisputeItem = {
  disputeId: string;
  recordId: string;
  listingId: string;
  recordTitle: string;
  submittedBy: string;
  submitterRole: string;
  submittedAt: string;
  state: DisputeState;
  severity: Severity;
  ground: DisputeGround;
  summary: string;
  challengedClaim: string;
  supportingEvidence: string[];
  requestedRemedy: string;
  reviewer: string;
  resolution: string;
  resolutionAt: string;
};

const initialDisputes: DisputeItem[] = [
  {
    disputeId: "TA14-ARD-000031",
    recordId: "TA14-AR-2026-000184",
    listingId: "TA14-ARX-000042",
    recordTitle: "Field Equipment Condition Record",
    submittedBy: "Property representative",
    submitterRole: "Authorized site representative",
    submittedAt: "2026-07-17T16:12:00.000Z",
    state: "OPEN",
    severity: "MODERATE",
    ground: "CONTEXT",
    summary:
      "The record does not include the fact that the condenser fan motor had been replaced by another contractor two days before the documented service visit.",
    challengedClaim:
      "Observed equipment condition may be interpreted without the prior-repair context.",
    supportingEvidence: [
      "Service invoice dated 2026-07-15",
      "Email confirmation from prior contractor",
    ],
    requestedRemedy:
      "Append prior-repair context and preserve the original version as superseded.",
    reviewer: "UNASSIGNED",
    resolution: "PENDING",
    resolutionAt: "PENDING",
  },
  {
    disputeId: "TA14-ARD-000030",
    recordId: "TA14-AR-2026-000179",
    listingId: "TA14-ARX-000041",
    recordTitle: "Facility Moisture Excursion Record",
    submittedBy: "North Basin Operations",
    submitterRole: "Record owner",
    submittedAt: "2026-07-17T14:48:00.000Z",
    state: "UNDER_REVIEW",
    severity: "HIGH",
    ground: "OMISSION",
    summary:
      "A sensor outage interval was preserved as UNKNOWN, but the public summary does not visibly state that the outage overlapped the initial excursion window.",
    challengedClaim:
      "Public summary may overstate the continuity of environmental measurement.",
    supportingEvidence: [
      "Sensor availability log",
      "Preserved device heartbeat record",
    ],
    requestedRemedy:
      "Add a visible limitation to the public listing and verification report.",
    reviewer: "TA-14 Review Desk",
    resolution: "PENDING",
    resolutionAt: "PENDING",
  },
  {
    disputeId: "TA14-ARD-000029",
    recordId: "TA14-AR-2026-000172",
    listingId: "TA14-ARX-000039",
    recordTitle: "AI Payment Route Incident Record",
    submittedBy: "Orchard Systems",
    submitterRole: "Route operator",
    submittedAt: "2026-07-16T22:40:00.000Z",
    state: "EVIDENCE_REQUESTED",
    severity: "CRITICAL",
    ground: "INTEGRITY",
    summary:
      "The evidence manifest digest does not correspond to the preserved manifest associated with the listed record version.",
    challengedClaim:
      "The package represented as preserved may not be the same package reviewed during incident analysis.",
    supportingEvidence: [
      "Original manifest digest",
      "Preservation receipt TA14-PR-000579",
      "Verification report TA14-ARV-000115",
    ],
    requestedRemedy:
      "Freeze publication, request the original package, and perform independent re-verification.",
    reviewer: "TA-14 Review Desk",
    resolution: "PENDING",
    resolutionAt: "PENDING",
  },
  {
    disputeId: "TA14-ARD-000028",
    recordId: "TA14-AR-2026-000161",
    listingId: "TA14-ARX-000034",
    recordTitle: "Cold Storage Temperature Excursion Record",
    submittedBy: "Cold-chain auditor",
    submitterRole: "Independent reviewer",
    submittedAt: "2026-07-15T19:18:00.000Z",
    state: "RESOLVED",
    severity: "LOW",
    ground: "IDENTITY",
    summary:
      "A device serial number was transposed in the human-readable record.",
    challengedClaim:
      "The listed device identity did not match the source-device manifest.",
    supportingEvidence: [
      "Device identity manifest",
      "Calibration certificate",
    ],
    requestedRemedy:
      "Correct the display value without altering the preserved original package.",
    reviewer: "TA-14 Review Desk",
    resolution:
      "Display-layer correction issued in version 1.0.1. Original version remains preserved and linked.",
    resolutionAt: "2026-07-16T10:22:00.000Z",
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

export default function RecordDisputeDeskPage() {
  const [disputes, setDisputes] = useState(initialDisputes);
  const [selectedId, setSelectedId] = useState(initialDisputes[0].disputeId);
  const [query, setQuery] = useState("");
  const [stateFilter, setStateFilter] = useState<DisputeState | "ALL">("ALL");
  const [severityFilter, setSeverityFilter] = useState<Severity | "ALL">("ALL");
  const [copied, setCopied] = useState(false);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return disputes.filter((dispute) => {
      const matchesQuery =
        !needle ||
        [
          dispute.disputeId,
          dispute.recordId,
          dispute.listingId,
          dispute.recordTitle,
          dispute.submittedBy,
          dispute.submitterRole,
          dispute.summary,
          dispute.challengedClaim,
          dispute.requestedRemedy,
          dispute.reviewer,
          dispute.ground,
        ]
          .join(" ")
          .toLowerCase()
          .includes(needle);

      return (
        matchesQuery &&
        (stateFilter === "ALL" || dispute.state === stateFilter) &&
        (severityFilter === "ALL" || dispute.severity === severityFilter)
      );
    });
  }, [disputes, query, severityFilter, stateFilter]);

  const selected =
    disputes.find((dispute) => dispute.disputeId === selectedId) ??
    filtered[0] ??
    disputes[0];

  const metrics = useMemo(
    () => ({
      open: disputes.filter((item) =>
        ["OPEN", "UNDER_REVIEW", "EVIDENCE_REQUESTED", "ESCALATED"].includes(
          item.state,
        ),
      ).length,
      critical: disputes.filter((item) => item.severity === "CRITICAL").length,
      resolved: disputes.filter((item) => item.state === "RESOLVED").length,
      evidenceRequested: disputes.filter(
        (item) => item.state === "EVIDENCE_REQUESTED",
      ).length,
    }),
    [disputes],
  );

  const disputePackage = {
    schema: "TA14_ADMISSIBLE_RECORD_DISPUTE_PACKAGE_V1",
    generatedAt: new Date().toISOString(),
    dispute: selected,
    governanceActions: {
      preserveOriginalRecord: true,
      preserveChallengeSubmission: true,
      preventSilentOverwrite: true,
      requireVersionedCorrection:
        selected.state !== "REJECTED" && selected.state !== "RESOLVED",
      requireIndependentReview:
        selected.severity === "HIGH" || selected.severity === "CRITICAL",
    },
    limitation:
      "A dispute records a challenge and preserves its supporting basis. Filing a dispute does not by itself prove the challenged record false, invalidate a preservation receipt, or establish the requested remedy.",
  };

  function transition(nextState: DisputeState) {
    setDisputes((items) =>
      items.map((item) =>
        item.disputeId === selected.disputeId
          ? {
              ...item,
              state: nextState,
              reviewer:
                item.reviewer === "UNASSIGNED"
                  ? "TA-14 Review Desk"
                  : item.reviewer,
              resolutionAt:
                nextState === "RESOLVED" || nextState === "REJECTED"
                  ? new Date().toISOString()
                  : item.resolutionAt,
              resolution:
                nextState === "RESOLVED"
                  ? "Challenge reviewed. A versioned correction, visible limitation, or preserved response is required before closure."
                  : nextState === "REJECTED"
                    ? "Challenge rejected because the submitted basis did not establish a material correspondence or integrity defect."
                    : item.resolution,
            }
          : item,
      ),
    );
  }

  async function copyPackage() {
    await navigator.clipboard.writeText(JSON.stringify(disputePackage, null, 2));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <main className="dispute-page">
      <style>{`
        * { box-sizing: border-box; }

        .dispute-page {
          min-height: calc(100vh - 68px);
          padding: 48px 0 110px;
          color: #edf6ff;
        }

        .dispute-wrap {
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
          content: "CHALLENGE";
          position: absolute;
          right: -10px;
          bottom: -42px;
          color: rgba(255,255,255,.025);
          font-size: clamp(4.2rem, 11vw, 9.5rem);
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
          grid-template-columns: minmax(220px, 1fr) 220px 180px;
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

        .dispute-row {
          width: 100%;
          padding: 20px 21px;
          border: 0;
          border-bottom: 1px solid rgba(132, 177, 216, .1);
          color: inherit;
          background: transparent;
          text-align: left;
          cursor: pointer;
        }

        .dispute-row:last-child { border-bottom: 0; }

        .dispute-row.active {
          background: linear-gradient(90deg, rgba(84, 232, 255, .09), rgba(255, 112, 135, .025));
          box-shadow: inset 3px 0 0 #56e6ff;
        }

        .row-top, .meta, .detail-top, .tag-row {
          display: flex;
          align-items: center;
          gap: 9px;
          flex-wrap: wrap;
        }

        .row-top { justify-content: space-between; }

        .dispute-title { font-weight: 900; }

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

        .pill.RESOLVED, .pill.LOW {
          color: #54efae;
          border-color: rgba(84, 239, 174, .3);
        }

        .pill.OPEN, .pill.UNDER_REVIEW, .pill.EVIDENCE_REQUESTED,
        .pill.MODERATE, .pill.HIGH {
          color: #ffd27b;
          border-color: rgba(255, 210, 123, .3);
        }

        .pill.CRITICAL, .pill.REJECTED, .pill.ESCALATED {
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
          .dispute-wrap { width: min(100% - 24px, 1420px); }
          .dispute-page { padding-top: 24px; }
          .hero { padding: 28px 22px 34px; border-radius: 24px; }
          .toolbar { grid-template-columns: 1fr; }
          .metrics { grid-template-columns: 1fr 1fr; }
          .kv { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="dispute-wrap">
        <section className="hero">
          <div className="hero-content">
            <p className="eyebrow">
              TA-14 Exchange · Record Challenge & Dispute Desk
            </p>
            <h1>
              Challenge the record.
              <br />
              <span className="gradient">Never erase the history.</span>
            </h1>
            <p className="hero-copy">
              Preserve challenges to identity, authority, custody, integrity,
              context, omission, and representation without silently altering
              the original record or treating an allegation as a proven fact.
            </p>

            <div className="hero-actions">
              <Link className="button" href="/workspace/records/exchange">
                Open Record Exchange
              </Link>
              <Link
                className="button-secondary"
                href="/workspace/records/verify"
              >
                Open Verification
              </Link>
              <Link className="button-secondary" href="/workspace/corrections">
                Open Correction Studio
              </Link>
            </div>
          </div>
        </section>

        <section className="metrics">
          <article className="metric">
            <strong>{metrics.open}</strong>
            <span>Active disputes</span>
          </article>
          <article className="metric">
            <strong>{metrics.critical}</strong>
            <span>Critical</span>
          </article>
          <article className="metric">
            <strong>{metrics.evidenceRequested}</strong>
            <span>Evidence requested</span>
          </article>
          <article className="metric">
            <strong>{metrics.resolved}</strong>
            <span>Resolved</span>
          </article>
        </section>

        <section className="toolbar">
          <input
            aria-label="Search disputes"
            placeholder="Search dispute, record, submitter, ground, reviewer, or remedy"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />

          <select
            aria-label="Filter dispute state"
            value={stateFilter}
            onChange={(event) =>
              setStateFilter(event.target.value as DisputeState | "ALL")
            }
          >
            <option value="ALL">All states</option>
            <option value="OPEN">OPEN</option>
            <option value="UNDER_REVIEW">UNDER_REVIEW</option>
            <option value="EVIDENCE_REQUESTED">EVIDENCE_REQUESTED</option>
            <option value="RESOLVED">RESOLVED</option>
            <option value="REJECTED">REJECTED</option>
            <option value="ESCALATED">ESCALATED</option>
          </select>

          <select
            aria-label="Filter severity"
            value={severityFilter}
            onChange={(event) =>
              setSeverityFilter(event.target.value as Severity | "ALL")
            }
          >
            <option value="ALL">All severity</option>
            <option value="LOW">LOW</option>
            <option value="MODERATE">MODERATE</option>
            <option value="HIGH">HIGH</option>
            <option value="CRITICAL">CRITICAL</option>
          </select>
        </section>

        <section className="grid">
          <div className="panel">
            <div className="panel-head">
              <strong>Record disputes</strong>
              <span>{filtered.length} visible</span>
            </div>

            {filtered.length ? (
              filtered.map((dispute) => (
                <button
                  className={`dispute-row ${
                    selected.disputeId === dispute.disputeId ? "active" : ""
                  }`}
                  key={dispute.disputeId}
                  type="button"
                  onClick={() => setSelectedId(dispute.disputeId)}
                >
                  <div className="row-top">
                    <span className="dispute-title">{dispute.recordTitle}</span>
                    <span className={`pill ${dispute.state}`}>
                      {dispute.state}
                    </span>
                  </div>
                  <div className="mono">{dispute.disputeId}</div>
                  <div className="meta">
                    <span>{dispute.ground}</span>
                    <span>{dispute.severity}</span>
                    <span>{dispute.submittedBy}</span>
                    <span>{formatDate(dispute.submittedAt)}</span>
                  </div>
                </button>
              ))
            ) : (
              <div className="empty">
                No record dispute matches the current filters.
              </div>
            )}
          </div>

          <aside className="panel detail">
            <div className="detail-top">
              <span className={`pill ${selected.state}`}>{selected.state}</span>
              <span className={`pill ${selected.severity}`}>
                {selected.severity}
              </span>
              <span className="pill">{selected.ground}</span>
            </div>

            <h2>{selected.recordTitle}</h2>
            <div className="mono">{selected.disputeId}</div>
            <p>{selected.summary}</p>

            <dl className="kv">
              <dt>Record ID</dt>
              <dd>{selected.recordId}</dd>

              <dt>Listing ID</dt>
              <dd>{selected.listingId}</dd>

              <dt>Submitted by</dt>
              <dd>{selected.submittedBy}</dd>

              <dt>Submitter role</dt>
              <dd>{selected.submitterRole}</dd>

              <dt>Submitted</dt>
              <dd>{formatDate(selected.submittedAt)}</dd>

              <dt>Reviewer</dt>
              <dd>{selected.reviewer}</dd>

              <dt>Resolution date</dt>
              <dd>{formatDate(selected.resolutionAt)}</dd>
            </dl>

            <div className="box">
              <strong>Challenged claim or representation</strong>
              <p>{selected.challengedClaim}</p>
            </div>

            <div className="box">
              <strong>Supporting evidence</strong>
              <ul>
                {selected.supportingEvidence.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="box">
              <strong>Requested remedy</strong>
              <p>{selected.requestedRemedy}</p>
            </div>

            <div className="box">
              <strong>Current resolution</strong>
              <p>{selected.resolution}</p>
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
                onClick={() => transition("EVIDENCE_REQUESTED")}
              >
                Request evidence
              </button>

              <button
                className="small-button"
                type="button"
                onClick={() => transition("ESCALATED")}
              >
                Escalate
              </button>

              <button
                className="small-button"
                type="button"
                onClick={() => transition("RESOLVED")}
              >
                Resolve
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
                {copied ? "Copied" : "Copy dispute package"}
              </button>

              <button
                className="small-button"
                type="button"
                onClick={() =>
                  downloadJson(
                    `${selected.disputeId.toLowerCase()}-dispute-package.json`,
                    disputePackage,
                  )
                }
              >
                Download package
              </button>
            </div>

            <div className="notice">
              Filing a dispute preserves a challenge and its supporting basis.
              It does not automatically invalidate the original record or prove
              the challenged representation false. Corrections must be
              versioned, linked, and independently reviewable.
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
