"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type AppealState =
  | "FILED"
  | "SCREENING"
  | "ACCEPTED"
  | "REJECTED"
  | "UNDER_REVIEW"
  | "REOPENED"
  | "RESOLVED"
  | "WITHDRAWN";

type AppealGround =
  | "NEW_EVIDENCE"
  | "PROCESS_DEFECT"
  | "AUTHORITY_DEFECT"
  | "SCOPE_ERROR"
  | "MISREPRESENTATION"
  | "SYSTEMIC_FAILURE"
  | "OTHER";

type ReviewOutcome =
  | "PENDING"
  | "UPHOLD_CLOSURE"
  | "AMEND_CLOSURE"
  | "REOPEN_DISPOSITION"
  | "ESCALATE";

type ClosureAppeal = {
  appealId: string;
  closureId: string;
  dispositionId: string;
  verificationId: string;
  remediationId: string;
  recordId: string;
  recordTitle: string;
  recordVersion: string;
  state: AppealState;
  ground: AppealGround;
  filedBy: string;
  filerRole: string;
  filedAt: string;
  assignedReviewer: string;
  reviewDueAt: string;
  standingBasis: string;
  challengedStatement: string;
  appealSummary: string;
  requestedRelief: string[];
  supportingEvidence: string[];
  preservedDependencies: string[];
  screeningFindings: string[];
  reviewOutcome: ReviewOutcome;
  resolutionStatement: string;
  resolvedAt: string;
  reopeningReceiptId: string;
};

const initialAppeals: ClosureAppeal[] = [
  {
    appealId: "TA14-DCA-000006",
    closureId: "TA14-DCL-000009",
    dispositionId: "TA14-RDP-000016",
    verificationId: "TA14-DVR-000016",
    remediationId: "TA14-DRM-000009",
    recordId: "TA14-AR-2026-000132",
    recordTitle: "Expired Demonstration Upload",
    recordVersion: "1.0.0",
    state: "FILED",
    ground: "NEW_EVIDENCE",
    filedBy: "Workspace Operations",
    filerRole: "Former storage administrator",
    filedAt: "2026-07-17T19:02:00.000Z",
    assignedReviewer: "TA-14 Closure Review Panel",
    reviewDueAt: "2026-07-24T17:00:00.000Z",
    standingBasis:
      "The filer administered a storage replica that may have retained an additional derivative after closure publication.",
    challengedStatement:
      "The authorized disposition was completed after documented remediation and independent retesting.",
    appealSummary:
      "A previously undocumented backup replica may contain a derivative thumbnail that was outside the systems tested during closure.",
    requestedRelief: [
      "Suspend public reliance on the closure receipt.",
      "Reopen disposition verification for the newly identified replica.",
      "Amend the closure statement if the replica is confirmed.",
    ],
    supportingEvidence: [
      "Backup inventory export dated 2026-07-06",
      "Storage topology note identifying replica-east-03",
      "Administrator declaration",
    ],
    preservedDependencies: [
      "TA14-DCL-000009",
      "TA14-DVR-000016",
      "TA14-DRM-000009",
      "TA14-DSP-000016",
    ],
    screeningFindings: [
      "Filer standing appears sufficient.",
      "Evidence was not included in the original verification package.",
      "Claim is material to the published closure scope.",
    ],
    reviewOutcome: "PENDING",
    resolutionStatement: "PENDING",
    resolvedAt: "PENDING",
    reopeningReceiptId: "PENDING",
  },
  {
    appealId: "TA14-DCA-000005",
    closureId: "TA14-DCL-000008",
    dispositionId: "TA14-RDP-000019",
    verificationId: "TA14-DVR-000019",
    remediationId: "NONE",
    recordId: "TA14-AR-2026-000148",
    recordTitle: "Temporary Training Demonstration Record",
    recordVersion: "1.0.0",
    state: "REJECTED",
    ground: "SCOPE_ERROR",
    filedBy: "External observer",
    filerRole: "Public registry user",
    filedAt: "2026-07-12T14:33:00.000Z",
    assignedReviewer: "TA-14 Closure Review Panel",
    reviewDueAt: "2026-07-19T17:00:00.000Z",
    standingBasis:
      "The filer cited the public closure statement but provided no relationship to the underlying record or affected systems.",
    challengedStatement:
      "The authorized disposition corresponded to the approved scope and required lineage remains preserved.",
    appealSummary:
      "The filer asserted that deletion could not be proven globally, but did not identify any additional system, artifact, or contradictory evidence.",
    requestedRelief: ["Withdraw the closure receipt."],
    supportingEvidence: ["Public comment without supporting artifact"],
    preservedDependencies: [
      "TA14-DCL-000008",
      "TA14-DVR-000019",
      "TA14-DSP-000019",
    ],
    screeningFindings: [
      "The closure already states that uncontrolled third-party copies were outside the tested scope.",
      "No new evidence or specific process defect was identified.",
      "Requested relief was unsupported.",
    ],
    reviewOutcome: "UPHOLD_CLOSURE",
    resolutionStatement:
      "Appeal rejected at screening. The challenged limitation was already disclosed, and no new evidence or material defect was established.",
    resolvedAt: "2026-07-12T16:10:00.000Z",
    reopeningReceiptId: "NONE",
  },
  {
    appealId: "TA14-DCA-000004",
    closureId: "TA14-DCL-000007",
    dispositionId: "TA14-RDP-000015",
    verificationId: "TA14-DVR-000015",
    remediationId: "TA14-DRM-000008",
    recordId: "TA14-AR-2026-000126",
    recordTitle: "Archived Vendor Access Evidence",
    recordVersion: "2.0.0",
    state: "RESOLVED",
    ground: "PROCESS_DEFECT",
    filedBy: "Vendor Security Office",
    filerRole: "Affected party",
    filedAt: "2026-07-05T11:04:00.000Z",
    assignedReviewer: "TA-14 Closure Review Panel",
    reviewDueAt: "2026-07-12T17:00:00.000Z",
    standingBasis:
      "The filer was an affected party and identified a missing notification step required by the disposition agreement.",
    challengedStatement:
      "All required disposition conditions were completed.",
    appealSummary:
      "The technical disposition was complete, but the required affected-party notice was sent after closure attestation.",
    requestedRelief: [
      "Amend the closure statement.",
      "Preserve the late-notice evidence.",
      "Record the process defect without reopening technical disposition.",
    ],
    supportingEvidence: [
      "Disposition agreement notice clause",
      "Late notification email receipt",
      "Closure attestation timeline",
    ],
    preservedDependencies: [
      "TA14-DCL-000007",
      "TA14-DVR-000015",
      "TA14-DRM-000008",
      "TA14-DSP-000015",
    ],
    screeningFindings: [
      "Standing established.",
      "Process defect confirmed.",
      "No technical execution divergence found.",
    ],
    reviewOutcome: "AMEND_CLOSURE",
    resolutionStatement:
      "Closure amended to disclose late affected-party notice. Technical disposition remains closed; the process defect and corrective notice receipt are preserved.",
    resolvedAt: "2026-07-06T09:21:00.000Z",
    reopeningReceiptId: "TA14-DCA-RES-000004",
  },
];

function formatDate(value: string) {
  if (value === "PENDING" || value === "NONE") return value;
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

export default function ClosureAppealReopeningPage() {
  const [appeals, setAppeals] = useState(initialAppeals);
  const [selectedId, setSelectedId] = useState(initialAppeals[0].appealId);
  const [query, setQuery] = useState("");
  const [stateFilter, setStateFilter] = useState<AppealState | "ALL">("ALL");
  const [groundFilter, setGroundFilter] = useState<AppealGround | "ALL">("ALL");
  const [copied, setCopied] = useState(false);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return appeals.filter((appeal) => {
      const matchesQuery =
        !needle ||
        [
          appeal.appealId,
          appeal.closureId,
          appeal.dispositionId,
          appeal.recordId,
          appeal.recordTitle,
          appeal.state,
          appeal.ground,
          appeal.filedBy,
          appeal.filerRole,
          appeal.assignedReviewer,
          appeal.standingBasis,
          appeal.challengedStatement,
          appeal.appealSummary,
          ...appeal.supportingEvidence,
        ]
          .join(" ")
          .toLowerCase()
          .includes(needle);

      return (
        matchesQuery &&
        (stateFilter === "ALL" || appeal.state === stateFilter) &&
        (groundFilter === "ALL" || appeal.ground === groundFilter)
      );
    });
  }, [appeals, groundFilter, query, stateFilter]);

  const selected =
    appeals.find((appeal) => appeal.appealId === selectedId) ??
    filtered[0] ??
    appeals[0];

  const metrics = useMemo(
    () => ({
      filed: appeals.filter((item) =>
        ["FILED", "SCREENING", "ACCEPTED", "UNDER_REVIEW"].includes(item.state),
      ).length,
      reopened: appeals.filter((item) => item.state === "REOPENED").length,
      resolved: appeals.filter((item) => item.state === "RESOLVED").length,
      rejected: appeals.filter((item) => item.state === "REJECTED").length,
    }),
    [appeals],
  );

  const appealPackage = {
    schema: "TA14_DISPOSITION_CLOSURE_APPEAL_REOPENING_PACKAGE_V1",
    generatedAt: new Date().toISOString(),
    appeal: selected,
    governance: {
      standingRequired: true,
      challengedStatementBound: true,
      supportingEvidencePreserved: true,
      originalClosurePreserved: true,
      reopeningRequiresMaterialBasis: true,
      outcomeMustBeReceipted: true,
      silentWithdrawalProhibited: true,
    },
    limitation:
      "An appeal preserves and reviews a challenge to a closure attestation. Filing does not itself invalidate the closure. Reopening requires a material basis within the stated scope and authority.",
  };

  function transition(nextState: AppealState) {
    setAppeals((items) =>
      items.map((item) =>
        item.appealId === selected.appealId
          ? {
              ...item,
              state: nextState,
              assignedReviewer:
                nextState === "SCREENING" &&
                item.assignedReviewer === "PENDING"
                  ? "TA-14 Closure Review Panel"
                  : item.assignedReviewer,
            }
          : item,
      ),
    );
  }

  function resolve(outcome: ReviewOutcome) {
    const state: AppealState =
      outcome === "REOPEN_DISPOSITION"
        ? "REOPENED"
        : outcome === "PENDING"
          ? selected.state
          : "RESOLVED";

    setAppeals((items) =>
      items.map((item) =>
        item.appealId === selected.appealId
          ? {
              ...item,
              state,
              reviewOutcome: outcome,
              resolvedAt: new Date().toISOString(),
              reopeningReceiptId: `TA14-DCA-RES-${Math.floor(
                100000 + Math.random() * 900000,
              )}`,
              resolutionStatement:
                outcome === "UPHOLD_CLOSURE"
                  ? "Review completed. The closure is upheld because the appeal did not establish a material defect requiring amendment or reopening."
                  : outcome === "AMEND_CLOSURE"
                    ? "Review completed. The closure must be amended to preserve the established limitation, defect, or corrected statement."
                    : outcome === "REOPEN_DISPOSITION"
                      ? "Review established a material basis to reopen disposition verification. Prior closure remains preserved but reliance is suspended pending a new outcome."
                      : "Appeal escalated for additional authority or independent review.",
            }
          : item,
      ),
    );
  }

  async function copyPackage() {
    await navigator.clipboard.writeText(JSON.stringify(appealPackage, null, 2));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <main className="appeal-page">
      <style>{`
        * { box-sizing: border-box; }

        .appeal-page {
          min-height: calc(100vh - 68px);
          padding: 48px 0 110px;
          color: #edf6ff;
        }

        .appeal-wrap {
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
            radial-gradient(circle at 85% 7%, rgba(185, 139, 255, .17), transparent 28%),
            radial-gradient(circle at 14% 0%, rgba(72, 223, 255, .17), transparent 32%),
            linear-gradient(135deg, rgba(14, 30, 48, .97), rgba(5, 11, 20, .98));
          box-shadow: 0 38px 120px rgba(0,0,0,.35);
        }

        .hero::after {
          content: "REOPEN";
          position: absolute;
          right: -10px;
          bottom: -42px;
          color: rgba(255,255,255,.025);
          font-size: clamp(4.5rem, 11vw, 9.7rem);
          font-weight: 1000;
          letter-spacing: -.1em;
          pointer-events: none;
        }

        .hero-content {
          position: relative;
          z-index: 1;
          max-width: 1000px;
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
          background: linear-gradient(100deg, #fff, #8ceaff 50%, #b98bff);
          background-clip: text;
          -webkit-background-clip: text;
        }

        .hero-copy {
          max-width: 930px;
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
          background: linear-gradient(100deg, #56e6ff, #b98bff);
        }

        .button-secondary {
          min-height: 47px;
          padding: 0 19px;
          border: 1px solid rgba(136, 180, 219, .22);
          color: #dce9f5;
          background: rgba(7, 17, 29, .72);
        }

        .small-button {
          min-height: 38px;
          padding: 0 13px;
          border: 1px solid rgba(136, 180, 219, .2);
          color: #dce9f5;
          background: rgba(7, 17, 29, .75);
          font-size: .72rem;
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

        .appeal-row {
          width: 100%;
          padding: 20px 21px;
          border: 0;
          border-bottom: 1px solid rgba(132, 177, 216, .1);
          color: inherit;
          background: transparent;
          text-align: left;
          cursor: pointer;
        }

        .appeal-row:last-child { border-bottom: 0; }

        .appeal-row.active {
          background: linear-gradient(90deg, rgba(84, 232, 255, .09), rgba(185, 139, 255, .025));
          box-shadow: inset 3px 0 0 #56e6ff;
        }

        .row-top, .meta, .detail-top {
          display: flex;
          align-items: center;
          gap: 9px;
          flex-wrap: wrap;
        }

        .row-top { justify-content: space-between; }

        .appeal-title { font-weight: 900; }

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

        .pill.RESOLVED, .pill.ACCEPTED {
          color: #54efae;
          border-color: rgba(84, 239, 174, .3);
        }

        .pill.FILED, .pill.SCREENING, .pill.UNDER_REVIEW {
          color: #ffd27b;
          border-color: rgba(255, 210, 123, .3);
        }

        .pill.REOPENED {
          color: #b98bff;
          border-color: rgba(185, 139, 255, .35);
        }

        .pill.REJECTED, .pill.WITHDRAWN {
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
          grid-template-columns: 190px 1fr;
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
          border-left: 3px solid #b98bff;
          border-radius: 0 13px 13px 0;
          color: #91a8bd;
          background: rgba(185, 139, 255, .045);
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
          .appeal-wrap { width: min(100% - 24px, 1420px); }
          .appeal-page { padding-top: 24px; }
          .hero { padding: 28px 22px 34px; border-radius: 24px; }
          .toolbar { grid-template-columns: 1fr; }
          .metrics { grid-template-columns: 1fr 1fr; }
          .kv { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="appeal-wrap">
        <section className="hero">
          <div className="hero-content">
            <p className="eyebrow">
              TA-14 Exchange · Closure Appeal & Reopening Desk
            </p>
            <h1>
              Closure can be challenged.
              <br />
              <span className="gradient">History cannot be erased.</span>
            </h1>
            <p className="hero-copy">
              File, screen, review, resolve, or reopen a disposition closure
              when new evidence, process defects, authority defects, scope
              errors, misrepresentation, or systemic failure materially affect
              the published attestation.
            </p>

            <div className="hero-actions">
              <Link
                className="button"
                href="/workspace/records/disposition/closure"
              >
                Open Closure Registry
              </Link>
              <Link
                className="button-secondary"
                href="/workspace/records/disposition/verify"
              >
                Open Disposition Verification
              </Link>
              <Link
                className="button-secondary"
                href="/workspace/records/disputes"
              >
                Open Record Dispute Desk
              </Link>
            </div>
          </div>
        </section>

        <section className="metrics">
          <article className="metric">
            <strong>{metrics.filed}</strong>
            <span>Open appeals</span>
          </article>
          <article className="metric">
            <strong>{metrics.reopened}</strong>
            <span>Reopened</span>
          </article>
          <article className="metric">
            <strong>{metrics.resolved}</strong>
            <span>Resolved</span>
          </article>
          <article className="metric">
            <strong>{metrics.rejected}</strong>
            <span>Rejected</span>
          </article>
        </section>

        <section className="toolbar">
          <input
            aria-label="Search closure appeals"
            placeholder="Search record, closure, filer, ground, evidence, reviewer, or challenged statement"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />

          <select
            aria-label="Filter appeal state"
            value={stateFilter}
            onChange={(event) =>
              setStateFilter(event.target.value as AppealState | "ALL")
            }
          >
            <option value="ALL">All states</option>
            <option value="FILED">FILED</option>
            <option value="SCREENING">SCREENING</option>
            <option value="ACCEPTED">ACCEPTED</option>
            <option value="REJECTED">REJECTED</option>
            <option value="UNDER_REVIEW">UNDER_REVIEW</option>
            <option value="REOPENED">REOPENED</option>
            <option value="RESOLVED">RESOLVED</option>
            <option value="WITHDRAWN">WITHDRAWN</option>
          </select>

          <select
            aria-label="Filter appeal ground"
            value={groundFilter}
            onChange={(event) =>
              setGroundFilter(event.target.value as AppealGround | "ALL")
            }
          >
            <option value="ALL">All grounds</option>
            <option value="NEW_EVIDENCE">NEW_EVIDENCE</option>
            <option value="PROCESS_DEFECT">PROCESS_DEFECT</option>
            <option value="AUTHORITY_DEFECT">AUTHORITY_DEFECT</option>
            <option value="SCOPE_ERROR">SCOPE_ERROR</option>
            <option value="MISREPRESENTATION">MISREPRESENTATION</option>
            <option value="SYSTEMIC_FAILURE">SYSTEMIC_FAILURE</option>
            <option value="OTHER">OTHER</option>
          </select>
        </section>

        <section className="grid">
          <div className="panel">
            <div className="panel-head">
              <strong>Closure appeals</strong>
              <span>{filtered.length} visible</span>
            </div>

            {filtered.length ? (
              filtered.map((appeal) => (
                <button
                  className={`appeal-row ${
                    selected.appealId === appeal.appealId ? "active" : ""
                  }`}
                  key={appeal.appealId}
                  type="button"
                  onClick={() => setSelectedId(appeal.appealId)}
                >
                  <div className="row-top">
                    <span className="appeal-title">{appeal.recordTitle}</span>
                    <span className={`pill ${appeal.state}`}>{appeal.state}</span>
                  </div>
                  <div className="mono">{appeal.appealId}</div>
                  <div className="meta">
                    <span>{appeal.ground}</span>
                    <span>{appeal.filedBy}</span>
                    <span>{appeal.closureId}</span>
                    <span>v{appeal.recordVersion}</span>
                  </div>
                </button>
              ))
            ) : (
              <div className="empty">
                No closure appeal matches the current filters.
              </div>
            )}
          </div>

          <aside className="panel detail">
            <div className="detail-top">
              <span className={`pill ${selected.state}`}>{selected.state}</span>
              <span className="pill">{selected.ground}</span>
              <span className="pill">{selected.reviewOutcome}</span>
            </div>

            <h2>{selected.recordTitle}</h2>
            <div className="mono">{selected.appealId}</div>
            <p>{selected.appealSummary}</p>

            <dl className="kv">
              <dt>Closure ID</dt>
              <dd>{selected.closureId}</dd>

              <dt>Disposition ID</dt>
              <dd>{selected.dispositionId}</dd>

              <dt>Verification ID</dt>
              <dd>{selected.verificationId}</dd>

              <dt>Remediation ID</dt>
              <dd>{selected.remediationId}</dd>

              <dt>Record ID</dt>
              <dd>{selected.recordId}</dd>

              <dt>Version</dt>
              <dd>{selected.recordVersion}</dd>

              <dt>Filed by</dt>
              <dd>{selected.filedBy}</dd>

              <dt>Filer role</dt>
              <dd>{selected.filerRole}</dd>

              <dt>Filed</dt>
              <dd>{formatDate(selected.filedAt)}</dd>

              <dt>Reviewer</dt>
              <dd>{selected.assignedReviewer}</dd>

              <dt>Review due</dt>
              <dd>{formatDate(selected.reviewDueAt)}</dd>

              <dt>Resolved</dt>
              <dd>{formatDate(selected.resolvedAt)}</dd>

              <dt>Resolution receipt</dt>
              <dd>{selected.reopeningReceiptId}</dd>
            </dl>

            <div className="box">
              <strong>Standing basis</strong>
              <p>{selected.standingBasis}</p>
            </div>

            <div className="box">
              <strong>Challenged closure statement</strong>
              <p>{selected.challengedStatement}</p>
            </div>

            <div className="box">
              <strong>Requested relief</strong>
              <ul>
                {selected.requestedRelief.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
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
              <strong>Preserved dependencies</strong>
              <ul>
                {selected.preservedDependencies.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="box">
              <strong>Screening findings</strong>
              <ul>
                {selected.screeningFindings.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="box">
              <strong>Resolution statement</strong>
              <p>{selected.resolutionStatement}</p>
            </div>

            <div className="detail-actions">
              <button
                className="button"
                type="button"
                onClick={() => transition("SCREENING")}
              >
                Begin screening
              </button>

              <button
                className="small-button"
                type="button"
                onClick={() => transition("UNDER_REVIEW")}
              >
                Accept for review
              </button>

              <button
                className="small-button"
                type="button"
                onClick={() => resolve("UPHOLD_CLOSURE")}
              >
                Uphold closure
              </button>

              <button
                className="small-button"
                type="button"
                onClick={() => resolve("AMEND_CLOSURE")}
              >
                Amend closure
              </button>

              <button
                className="small-button"
                type="button"
                onClick={() => resolve("REOPEN_DISPOSITION")}
              >
                Reopen disposition
              </button>

              <button
                className="small-button"
                type="button"
                onClick={() => resolve("ESCALATE")}
              >
                Escalate
              </button>

              <button
                className="small-button"
                type="button"
                onClick={() => transition("WITHDRAWN")}
              >
                Withdraw
              </button>

              <button
                className="small-button"
                type="button"
                onClick={copyPackage}
              >
                {copied ? "Copied" : "Copy appeal package"}
              </button>

              <button
                className="small-button"
                type="button"
                onClick={() =>
                  downloadJson(
                    `${selected.appealId.toLowerCase()}-closure-appeal.json`,
                    appealPackage,
                  )
                }
              >
                Download package
              </button>
            </div>

            <div className="notice">
              Filing an appeal does not silently invalidate closure. A closure
              remains part of the preserved record while its authority, scope,
              evidence, process, or factual basis is independently reviewed.
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
