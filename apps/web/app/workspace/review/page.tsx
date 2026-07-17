"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type ReviewState =
  | "SUBMITTED"
  | "TRIAGE"
  | "IN_REVIEW"
  | "CORRECTION_REQUIRED"
  | "READY_TO_CLOSE"
  | "CLOSED";

type Priority = "STANDARD" | "ELEVATED" | "URGENT";
type Decision = "ALLOW" | "HOLD" | "DENY" | "ESCALATE";

type ReviewItem = {
  reviewId: string;
  routeId: string;
  routeName: string;
  submittedBy: string;
  submittedAt: string;
  state: ReviewState;
  priority: Priority;
  currentDecision: Decision;
  assignedReviewer: string;
  scope: string;
  evidenceCount: number;
  findings: string[];
  requestedOutcome: string;
  nextAction: string;
};

const initialReviews: ReviewItem[] = [
  {
    reviewId: "TA14-REV-41A92C",
    routeId: "TA14-RID-AI-0018",
    routeName: "Bounded AI Agent Action",
    submittedBy: "Example Organization",
    submittedAt: "2026-07-17T18:31:00.000Z",
    state: "IN_REVIEW",
    priority: "ELEVATED",
    currentDecision: "HOLD",
    assignedReviewer: "TA-14 Review Desk",
    scope:
      "Independent review of delegated authority, tool binding, evidence continuity, and outcome receipt design.",
    evidenceCount: 14,
    findings: [
      "Production authority source is not bound to the specific consequence.",
      "Outcome receipt issuer remains UNKNOWN.",
    ],
    requestedOutcome:
      "Determine whether the route can advance to a paid signed production test.",
    nextAction:
      "Submit the governing authority source and identify the authoritative outcome issuer.",
  },
  {
    reviewId: "TA14-REV-07D3E1",
    routeId: "TA14-RID-HVAC-0009",
    routeName: "Analyzer-Governed Refrigerant Intervention",
    submittedBy: "Transparent Air",
    submittedAt: "2026-07-17T15:28:00.000Z",
    state: "CORRECTION_REQUIRED",
    priority: "URGENT",
    currentDecision: "ESCALATE",
    assignedReviewer: "TA-14 Review Desk",
    scope:
      "Review technician signing, analyzer identity, intervention threshold, exception authority, and post-intervention verification.",
    evidenceCount: 22,
    findings: [
      "Field-device signing key is not registered.",
      "Exception authority is described but not independently bound.",
      "Execution correspondence remains UNKNOWN.",
    ],
    requestedOutcome:
      "Resolve the route for controlled field testing without weakening the intervention gate.",
    nextAction:
      "Register the trusted device key and resubmit the exception-authority record.",
  },
  {
    reviewId: "TA14-REV-883FA0",
    routeId: "TA14-RID-VP-0042",
    routeName: "Governed Vendor Payment",
    submittedBy: "TA-14 Exchange",
    submittedAt: "2026-07-16T20:10:00.000Z",
    state: "READY_TO_CLOSE",
    priority: "STANDARD",
    currentDecision: "ALLOW",
    assignedReviewer: "Independent Reviewer 02",
    scope:
      "Confirm route-to-commit, execution-to-commit, and settlement correspondence.",
    evidenceCount: 19,
    findings: [],
    requestedOutcome:
      "Close the independent review and preserve the final review record.",
    nextAction:
      "Reviewer signs the closure record and publishes the review receipt.",
  },
  {
    reviewId: "TA14-REV-512E0B",
    routeId: "TA14-RID-HR-0003",
    routeName: "Automated Candidate Rejection",
    submittedBy: "Example Organization",
    submittedAt: "2026-07-14T12:48:00.000Z",
    state: "CLOSED",
    priority: "ELEVATED",
    currentDecision: "DENY",
    assignedReviewer: "Independent Reviewer 01",
    scope:
      "Review whether the proposed automated rejection could be admitted under the submitted authority and evidence.",
    evidenceCount: 9,
    findings: [
      "Delegated authority exceeded the permitted scope.",
      "Evidence could not support the proposed employment consequence.",
      "Required human review was absent.",
    ],
    requestedOutcome:
      "Determine whether the route was admissible as submitted.",
    nextAction:
      "Closed as DENY. Replacement route must begin as a new version.",
  },
];

const stateOrder: ReviewState[] = [
  "SUBMITTED",
  "TRIAGE",
  "IN_REVIEW",
  "CORRECTION_REQUIRED",
  "READY_TO_CLOSE",
  "CLOSED",
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

export default function GovernanceReviewDeskPage() {
  const [reviews, setReviews] = useState(initialReviews);
  const [selectedId, setSelectedId] = useState(initialReviews[0].reviewId);
  const [query, setQuery] = useState("");
  const [state, setState] = useState<ReviewState | "ALL">("ALL");
  const [copied, setCopied] = useState(false);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return reviews.filter((review) => {
      const matchesQuery =
        !needle ||
        [
          review.reviewId,
          review.routeId,
          review.routeName,
          review.submittedBy,
          review.assignedReviewer,
          review.scope,
        ]
          .join(" ")
          .toLowerCase()
          .includes(needle);

      return matchesQuery && (state === "ALL" || review.state === state);
    });
  }, [query, reviews, state]);

  const selected =
    reviews.find((review) => review.reviewId === selectedId) ??
    filtered[0] ??
    reviews[0];

  const metrics = useMemo(
    () => ({
      open: reviews.filter((item) => item.state !== "CLOSED").length,
      correction: reviews.filter(
        (item) => item.state === "CORRECTION_REQUIRED",
      ).length,
      ready: reviews.filter((item) => item.state === "READY_TO_CLOSE").length,
      closed: reviews.filter((item) => item.state === "CLOSED").length,
    }),
    [reviews],
  );

  const reviewRecord = {
    schema: "TA14_GOVERNANCE_REVIEW_RECORD_V1",
    exportedAt: new Date().toISOString(),
    review: selected,
    limitation:
      "A review record documents the review scope, evidence considered, findings, and disposition. It does not replace runtime admissibility at the moment of execution.",
  };

  function advanceReview() {
    const index = stateOrder.indexOf(selected.state);
    if (index === -1 || index === stateOrder.length - 1) return;

    const nextState = stateOrder[index + 1];
    setReviews((items) =>
      items.map((item) =>
        item.reviewId === selected.reviewId
          ? {
              ...item,
              state: nextState,
              nextAction:
                nextState === "CLOSED"
                  ? "Review closed. Preserve the final review receipt and route version."
                  : `Continue the documented workflow for ${nextState.replaceAll(
                      "_",
                      " ",
                    )}.`,
            }
          : item,
      ),
    );
  }

  async function copyRecord() {
    await navigator.clipboard.writeText(
      JSON.stringify(reviewRecord, null, 2),
    );
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <main className="review-page">
      <style>{`
        * { box-sizing: border-box; }

        .review-page {
          min-height: calc(100vh - 68px);
          padding: 48px 0 110px;
          color: #edf6ff;
        }

        .review-wrap {
          width: min(1380px, calc(100% - 48px));
          margin: 0 auto;
        }

        .hero {
          position: relative;
          overflow: hidden;
          padding: clamp(32px, 5vw, 68px);
          border: 1px solid rgba(132, 177, 216, .16);
          border-radius: 34px;
          background:
            radial-gradient(circle at 84% 8%, rgba(194, 145, 255, .17), transparent 28%),
            radial-gradient(circle at 14% 0%, rgba(72, 223, 255, .17), transparent 32%),
            linear-gradient(135deg, rgba(14, 30, 48, .97), rgba(5, 11, 20, .98));
          box-shadow: 0 38px 120px rgba(0,0,0,.35);
        }

        .hero::after {
          content: "REVIEW";
          position: absolute;
          right: -10px;
          bottom: -42px;
          color: rgba(255,255,255,.025);
          font-size: clamp(6rem, 16vw, 14rem);
          font-weight: 1000;
          letter-spacing: -.1em;
          pointer-events: none;
        }

        .hero-content { position: relative; z-index: 1; max-width: 930px; }

        .eyebrow {
          margin: 0 0 17px;
          color: #72e2f7;
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
          background: linear-gradient(100deg, #fff, #91eaff 50%, #c09dff);
          background-clip: text;
          -webkit-background-clip: text;
        }

        .hero-copy {
          max-width: 820px;
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
          background: linear-gradient(100deg, #56e6ff, #b899ff);
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
          grid-template-columns: minmax(220px, 1fr) 220px;
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

        .review-row {
          width: 100%;
          padding: 20px 21px;
          border: 0;
          border-bottom: 1px solid rgba(132, 177, 216, .1);
          color: inherit;
          background: transparent;
          text-align: left;
          cursor: pointer;
        }

        .review-row:last-child { border-bottom: 0; }

        .review-row.active {
          background: linear-gradient(90deg, rgba(84, 232, 255, .09), rgba(184, 153, 255, .025));
          box-shadow: inset 3px 0 0 #56e6ff;
        }

        .row-top, .meta, .detail-top {
          display: flex;
          align-items: center;
          gap: 9px;
          flex-wrap: wrap;
        }

        .row-top { justify-content: space-between; }

        .route-name { font-weight: 900; }

        .mono {
          margin-top: 7px;
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

        .pill.URGENT { color: #ff8e9b; border-color: rgba(255, 142, 155, .3); }
        .pill.ELEVATED { color: #ffd27b; border-color: rgba(255, 210, 123, .3); }
        .pill.STANDARD { color: #7bd9ff; border-color: rgba(123, 217, 255, .3); }
        .pill.CLOSED { color: #54efae; border-color: rgba(84, 239, 174, .3); }
        .pill.CORRECTION_REQUIRED { color: #ffad7d; border-color: rgba(255, 173, 125, .3); }
        .pill.READY_TO_CLOSE { color: #b8a5ff; border-color: rgba(184, 165, 255, .3); }

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
          grid-template-columns: 150px 1fr;
          gap: 10px 14px;
          margin-top: 20px;
          padding: 17px;
          border: 1px solid rgba(132, 177, 216, .12);
          border-radius: 17px;
          background: rgba(2, 9, 16, .52);
          font-size: .78rem;
        }

        .kv dt { color: #718aa1; }
        .kv dd { margin: 0; color: #dce8f3; }

        .finding-box {
          margin-top: 18px;
          padding: 17px;
          border: 1px solid rgba(255, 210, 123, .16);
          border-radius: 17px;
          background: rgba(65, 43, 8, .15);
        }

        .finding-box strong {
          color: #ffd27b;
          font-size: .75rem;
          letter-spacing: .08em;
          text-transform: uppercase;
        }

        .finding-box ul {
          margin: 10px 0 0;
          padding-left: 18px;
          color: #b8c7d4;
          line-height: 1.65;
        }

        .clear-box {
          border-color: rgba(84, 239, 174, .16);
          background: rgba(14, 62, 44, .13);
        }

        .clear-box strong { color: #54efae; }

        .next-action {
          margin-top: 18px;
          padding: 16px 18px;
          border-left: 3px solid #b899ff;
          border-radius: 0 13px 13px 0;
          color: #9caec0;
          background: rgba(184, 153, 255, .05);
          font-size: .82rem;
          line-height: 1.65;
        }

        .empty {
          padding: 42px 22px;
          color: #8399ad;
          text-align: center;
          line-height: 1.7;
        }

        @media (max-width: 1000px) {
          .grid { grid-template-columns: 1fr; }
          .detail { position: static; }
        }

        @media (max-width: 760px) {
          .review-wrap { width: min(100% - 24px, 1380px); }
          .review-page { padding-top: 24px; }
          .hero { padding: 28px 22px 34px; border-radius: 24px; }
          .toolbar { grid-template-columns: 1fr; }
          .metrics { grid-template-columns: 1fr 1fr; }
          .kv { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="review-wrap">
        <section className="hero">
          <div className="hero-content">
            <p className="eyebrow">TA-14 Exchange · Governance Review Desk</p>
            <h1>
              Route uncertainty
              <br />
              <span className="gradient">into written review.</span>
            </h1>
            <p className="hero-copy">
              Submit routes, evidence packages, replay findings, and unresolved
              authority questions into a bounded review workflow with explicit
              scope, findings, correction requests, reviewer identity, and
              closure state.
            </p>

            <div className="hero-actions">
              <Link className="button" href="/workspace/scanner">
                Scan before review
              </Link>
              <Link className="button-secondary" href="/workspace/registry">
                Open registry
              </Link>
              <Link className="button-secondary" href="/workspace/replay">
                Open replay console
              </Link>
            </div>
          </div>
        </section>

        <section className="metrics">
          <article className="metric">
            <strong>{metrics.open}</strong>
            <span>Open reviews</span>
          </article>
          <article className="metric">
            <strong>{metrics.correction}</strong>
            <span>Correction required</span>
          </article>
          <article className="metric">
            <strong>{metrics.ready}</strong>
            <span>Ready to close</span>
          </article>
          <article className="metric">
            <strong>{metrics.closed}</strong>
            <span>Closed reviews</span>
          </article>
        </section>

        <section className="toolbar">
          <input
            aria-label="Search reviews"
            placeholder="Search review, route, submitter, reviewer, or scope"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <select
            aria-label="Filter review state"
            value={state}
            onChange={(event) =>
              setState(event.target.value as ReviewState | "ALL")
            }
          >
            <option value="ALL">All review states</option>
            {stateOrder.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </section>

        <section className="grid">
          <div className="panel">
            <div className="panel-head">
              <strong>Review queue</strong>
              <span>{filtered.length} visible</span>
            </div>

            {filtered.length ? (
              filtered.map((review) => (
                <button
                  className={`review-row ${
                    selected.reviewId === review.reviewId ? "active" : ""
                  }`}
                  key={review.reviewId}
                  type="button"
                  onClick={() => setSelectedId(review.reviewId)}
                >
                  <div className="row-top">
                    <span className="route-name">{review.routeName}</span>
                    <span className={`pill ${review.priority}`}>
                      {review.priority}
                    </span>
                  </div>
                  <div className="mono">{review.reviewId}</div>
                  <div className="meta">
                    <span>{review.state}</span>
                    <span>{review.currentDecision}</span>
                    <span>{review.evidenceCount} evidence items</span>
                    <span>{formatDate(review.submittedAt)}</span>
                  </div>
                </button>
              ))
            ) : (
              <div className="empty">
                No review matches the current search and state filters.
              </div>
            )}
          </div>

          <aside className="panel detail">
            <div className="detail-top">
              <span className={`pill ${selected.state}`}>{selected.state}</span>
              <span className={`pill ${selected.priority}`}>
                {selected.priority}
              </span>
              <span className="pill">{selected.currentDecision}</span>
            </div>

            <h2>{selected.routeName}</h2>
            <div className="mono">{selected.reviewId}</div>
            <p>{selected.scope}</p>

            <dl className="kv">
              <dt>Route ID</dt>
              <dd>{selected.routeId}</dd>

              <dt>Submitted by</dt>
              <dd>{selected.submittedBy}</dd>

              <dt>Submitted</dt>
              <dd>{formatDate(selected.submittedAt)}</dd>

              <dt>Reviewer</dt>
              <dd>{selected.assignedReviewer}</dd>

              <dt>Evidence items</dt>
              <dd>{selected.evidenceCount}</dd>

              <dt>Requested outcome</dt>
              <dd>{selected.requestedOutcome}</dd>
            </dl>

            {selected.findings.length ? (
              <div className="finding-box">
                <strong>Review findings</strong>
                <ul>
                  {selected.findings.map((finding) => (
                    <li key={finding}>{finding}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="finding-box clear-box">
                <strong>No unresolved review findings</strong>
                <p>
                  The review can proceed to documented closure. Runtime
                  admissibility remains a separate execution-time requirement.
                </p>
              </div>
            )}

            <div className="next-action">
              <strong>Next action:</strong> {selected.nextAction}
            </div>

            <div className="detail-actions">
              <button
                className="small-button"
                type="button"
                onClick={advanceReview}
                disabled={selected.state === "CLOSED"}
              >
                {selected.state === "CLOSED"
                  ? "Review closed"
                  : "Advance workflow"}
              </button>
              <button
                className="small-button"
                type="button"
                onClick={copyRecord}
              >
                {copied ? "Copied" : "Copy record"}
              </button>
              <button
                className="small-button"
                type="button"
                onClick={() =>
                  downloadJson(
                    `${selected.reviewId.toLowerCase()}-record.json`,
                    reviewRecord,
                  )
                }
              >
                Download record
              </button>
              <Link className="small-button" href="/workspace/verify">
                Verify evidence
              </Link>
            </div>

            <div className="next-action">
              A governance review documents what was examined and what must be
              corrected. It does not permanently authorize future execution and
              cannot replace current evidence, authority, continuity, binding,
              and outcome verification.
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
