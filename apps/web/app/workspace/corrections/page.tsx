"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Decision = "ALLOW" | "HOLD" | "DENY" | "ESCALATE";
type Severity = "BLOCKING" | "WARNING" | "INFO";
type CorrectionState =
  | "OPEN"
  | "IN_PROGRESS"
  | "READY_TO_RETEST"
  | "RESOLVED"
  | "REJECTED";

type Finding = {
  findingId: string;
  routeId: string;
  routeName: string;
  stage:
    | "Reality"
    | "Record"
    | "Continuity"
    | "Admissibility"
    | "Binding"
    | "Commit"
    | "Execution"
    | "Outcome";
  severity: Severity;
  decision: Decision;
  state: CorrectionState;
  title: string;
  description: string;
  evidenceRequired: string;
  correctionPlan: string;
  owner: string;
  openedAt: string;
  source: string;
};

const initialFindings: Finding[] = [
  {
    findingId: "TA14-FIND-5B19D2",
    routeId: "TA14-RID-AI-0018",
    routeName: "Bounded AI Agent Action",
    stage: "Binding",
    severity: "BLOCKING",
    decision: "HOLD",
    state: "IN_PROGRESS",
    title: "Authority is not bound to the exact tool consequence",
    description:
      "The route identifies a general delegation but does not bind the actor, tool, action, object, destination, and consequence to one current authority record.",
    evidenceRequired:
      "A consequence-specific authority record identifying the permitted actor, tool, action, target object, scope, expiration, and revocation conditions.",
    correctionPlan:
      "Replace the general delegation with a route-bound authority object and require the runtime gate to validate its current state before commit.",
    owner: "Example Organization",
    openedAt: "2026-07-17T18:41:00.000Z",
    source: "TA14-REV-41A92C",
  },
  {
    findingId: "TA14-FIND-C8820A",
    routeId: "TA14-RID-HVAC-0009",
    routeName: "Analyzer-Governed Refrigerant Intervention",
    stage: "Continuity",
    severity: "BLOCKING",
    decision: "ESCALATE",
    state: "OPEN",
    title: "Trusted field-device key is not registered",
    description:
      "The analyzer can produce a local record, but the route cannot yet prove that the record originated from a trusted registered device.",
    evidenceRequired:
      "Device identity, trusted public key, key-registration event, active status, and revocation-check source.",
    correctionPlan:
      "Register the analyzer key, bind it to the device identity, and add a current revocation check to the pre-execution route.",
    owner: "Transparent Air",
    openedAt: "2026-07-17T15:34:00.000Z",
    source: "TA14-REV-07D3E1",
  },
  {
    findingId: "TA14-FIND-119AE4",
    routeId: "TA14-RID-VP-0042",
    routeName: "Governed Vendor Payment",
    stage: "Outcome",
    severity: "WARNING",
    decision: "ALLOW",
    state: "READY_TO_RETEST",
    title: "Settlement receipt timing tolerance is undefined",
    description:
      "The route verifies settlement correspondence but does not state how long the outcome may remain pending before the route becomes incomplete.",
    evidenceRequired:
      "A written outcome-timing rule and a deterministic transition for pending settlement.",
    correctionPlan:
      "Define a 24-hour pending window, then transition to ESCALATE when an authoritative settlement receipt remains unavailable.",
    owner: "TA-14 Exchange",
    openedAt: "2026-07-16T20:24:00.000Z",
    source: "TA14-REPLAY-72A91F",
  },
  {
    findingId: "TA14-FIND-7D31F0",
    routeId: "TA14-RID-HR-0003",
    routeName: "Automated Candidate Rejection",
    stage: "Admissibility",
    severity: "BLOCKING",
    decision: "DENY",
    state: "REJECTED",
    title: "Proposed correction would weaken required human review",
    description:
      "The submitted correction attempted to remove the required human review step instead of supplying missing authority and evidence.",
    evidenceRequired:
      "A lawful authority source, complete decision evidence, and a preserved human-review record.",
    correctionPlan:
      "Rejected. Create a new route version that preserves human review and does not permit autonomous rejection.",
    owner: "Example Organization",
    openedAt: "2026-07-14T13:05:00.000Z",
    source: "TA14-REV-512E0B",
  },
];

const stateOrder: CorrectionState[] = [
  "OPEN",
  "IN_PROGRESS",
  "READY_TO_RETEST",
  "RESOLVED",
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

export default function RouteCorrectionStudioPage() {
  const [findings, setFindings] = useState(initialFindings);
  const [selectedId, setSelectedId] = useState(initialFindings[0].findingId);
  const [query, setQuery] = useState("");
  const [state, setState] = useState<CorrectionState | "ALL">("ALL");
  const [copied, setCopied] = useState(false);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return findings.filter((finding) => {
      const matchesQuery =
        !needle ||
        [
          finding.findingId,
          finding.routeId,
          finding.routeName,
          finding.title,
          finding.stage,
          finding.owner,
          finding.source,
        ]
          .join(" ")
          .toLowerCase()
          .includes(needle);

      return matchesQuery && (state === "ALL" || finding.state === state);
    });
  }, [findings, query, state]);

  const selected =
    findings.find((finding) => finding.findingId === selectedId) ??
    filtered[0] ??
    findings[0];

  const metrics = useMemo(
    () => ({
      open: findings.filter(
        (item) => item.state === "OPEN" || item.state === "IN_PROGRESS",
      ).length,
      retest: findings.filter((item) => item.state === "READY_TO_RETEST")
        .length,
      resolved: findings.filter((item) => item.state === "RESOLVED").length,
      blocking: findings.filter(
        (item) =>
          item.severity === "BLOCKING" &&
          item.state !== "RESOLVED" &&
          item.state !== "REJECTED",
      ).length,
    }),
    [findings],
  );

  const correctionPackage = {
    schema: "TA14_ROUTE_CORRECTION_PACKAGE_V1",
    generatedAt: new Date().toISOString(),
    finding: selected,
    correctionBoundary: {
      preservesOriginalFinding: true,
      requiresNewRouteVersion:
        selected.state === "READY_TO_RETEST" ||
        selected.state === "RESOLVED",
      runtimeRetestRequired: selected.state !== "REJECTED",
    },
    limitation:
      "A correction plan does not clear a route. The corrected route must be independently retested, and prior findings remain preserved in route history.",
  };

  function advanceCorrection() {
    if (selected.state === "REJECTED" || selected.state === "RESOLVED") return;

    const index = stateOrder.indexOf(selected.state);
    if (index < 0 || index >= stateOrder.length - 1) return;

    const nextState = stateOrder[index + 1];

    setFindings((items) =>
      items.map((item) =>
        item.findingId === selected.findingId
          ? { ...item, state: nextState }
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
            radial-gradient(circle at 85% 8%, rgba(255, 178, 84, .16), transparent 28%),
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
          font-size: clamp(5rem, 14vw, 12rem);
          font-weight: 1000;
          letter-spacing: -.1em;
          pointer-events: none;
        }

        .hero-content { position: relative; z-index: 1; max-width: 930px; }

        .eyebrow {
          margin: 0 0 17px;
          color: #71e4fa;
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
          background: linear-gradient(100deg, #fff, #8ceaff 50%, #ffbd72);
          background-clip: text;
          -webkit-background-clip: text;
        }

        .hero-copy {
          max-width: 830px;
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
          background: linear-gradient(100deg, #56e6ff, #ffbd72);
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

        .finding-row {
          width: 100%;
          padding: 20px 21px;
          border: 0;
          border-bottom: 1px solid rgba(132, 177, 216, .1);
          color: inherit;
          background: transparent;
          text-align: left;
          cursor: pointer;
        }

        .finding-row:last-child { border-bottom: 0; }

        .finding-row.active {
          background: linear-gradient(90deg, rgba(84, 232, 255, .09), rgba(255, 189, 114, .025));
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

        .pill.BLOCKING { color: #ff8e9b; border-color: rgba(255, 142, 155, .3); }
        .pill.WARNING { color: #ffd27b; border-color: rgba(255, 210, 123, .3); }
        .pill.INFO { color: #7bd9ff; border-color: rgba(123, 217, 255, .3); }
        .pill.RESOLVED { color: #54efae; border-color: rgba(84, 239, 174, .3); }
        .pill.READY_TO_RETEST { color: #b8a5ff; border-color: rgba(184, 165, 255, .3); }
        .pill.REJECTED { color: #ff8e9b; border-color: rgba(255, 142, 155, .3); }

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
          grid-template-columns: 145px 1fr;
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

        .correction-box {
          margin-top: 18px;
          padding: 17px;
          border: 1px solid rgba(132, 177, 216, .12);
          border-radius: 17px;
          background: rgba(2, 9, 16, .52);
        }

        .correction-box strong {
          display: block;
          margin-bottom: 8px;
          color: #ffbd72;
          font-size: .75rem;
          letter-spacing: .08em;
          text-transform: uppercase;
        }

        .correction-box p {
          margin: 0;
          color: #a4b6c6;
          line-height: 1.65;
        }

        .notice {
          margin-top: 18px;
          padding: 16px 18px;
          border-left: 3px solid #ffbd72;
          border-radius: 0 13px 13px 0;
          color: #91a8bd;
          background: rgba(255, 189, 114, .045);
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
          .correction-wrap { width: min(100% - 24px, 1380px); }
          .correction-page { padding-top: 24px; }
          .hero { padding: 28px 22px 34px; border-radius: 24px; }
          .toolbar { grid-template-columns: 1fr; }
          .metrics { grid-template-columns: 1fr 1fr; }
          .kv { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="correction-wrap">
        <section className="hero">
          <div className="hero-content">
            <p className="eyebrow">TA-14 Exchange · Route Correction Studio</p>
            <h1>
              Correct the defect.
              <br />
              <span className="gradient">Preserve the finding.</span>
            </h1>
            <p className="hero-copy">
              Convert scanner, testing, replay, and review findings into bounded
              correction work without erasing the original failure. Every
              corrected route advances as a new version and returns to testing
              before it can be treated as admissible.
            </p>

            <div className="hero-actions">
              <Link className="button" href="/workspace/testing">
                Retest a route
              </Link>
              <Link className="button-secondary" href="/workspace/review">
                Open Review Desk
              </Link>
              <Link className="button-secondary" href="/workspace/registry">
                Open registry
              </Link>
            </div>
          </div>
        </section>

        <section className="metrics">
          <article className="metric">
            <strong>{metrics.open}</strong>
            <span>Open corrections</span>
          </article>
          <article className="metric">
            <strong>{metrics.retest}</strong>
            <span>Ready to retest</span>
          </article>
          <article className="metric">
            <strong>{metrics.resolved}</strong>
            <span>Resolved findings</span>
          </article>
          <article className="metric">
            <strong>{metrics.blocking}</strong>
            <span>Blocking defects</span>
          </article>
        </section>

        <section className="toolbar">
          <input
            aria-label="Search correction findings"
            placeholder="Search finding, route, stage, owner, or source"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <select
            aria-label="Filter correction state"
            value={state}
            onChange={(event) =>
              setState(event.target.value as CorrectionState | "ALL")
            }
          >
            <option value="ALL">All correction states</option>
            <option value="OPEN">OPEN</option>
            <option value="IN_PROGRESS">IN_PROGRESS</option>
            <option value="READY_TO_RETEST">READY_TO_RETEST</option>
            <option value="RESOLVED">RESOLVED</option>
            <option value="REJECTED">REJECTED</option>
          </select>
        </section>

        <section className="grid">
          <div className="panel">
            <div className="panel-head">
              <strong>Correction queue</strong>
              <span>{filtered.length} visible</span>
            </div>

            {filtered.length ? (
              filtered.map((finding) => (
                <button
                  className={`finding-row ${
                    selected.findingId === finding.findingId ? "active" : ""
                  }`}
                  key={finding.findingId}
                  type="button"
                  onClick={() => setSelectedId(finding.findingId)}
                >
                  <div className="row-top">
                    <span className="route-name">{finding.routeName}</span>
                    <span className={`pill ${finding.severity}`}>
                      {finding.severity}
                    </span>
                  </div>
                  <div className="mono">{finding.findingId}</div>
                  <div className="meta">
                    <span>{finding.stage}</span>
                    <span>{finding.state}</span>
                    <span>{finding.decision}</span>
                    <span>{formatDate(finding.openedAt)}</span>
                  </div>
                </button>
              ))
            ) : (
              <div className="empty">
                No correction finding matches the current filters.
              </div>
            )}
          </div>

          <aside className="panel detail">
            <div className="detail-top">
              <span className={`pill ${selected.severity}`}>
                {selected.severity}
              </span>
              <span className={`pill ${selected.state}`}>{selected.state}</span>
              <span className="pill">{selected.decision}</span>
            </div>

            <h2>{selected.title}</h2>
            <div className="mono">{selected.findingId}</div>
            <p>{selected.description}</p>

            <dl className="kv">
              <dt>Route</dt>
              <dd>{selected.routeName}</dd>

              <dt>Route ID</dt>
              <dd>{selected.routeId}</dd>

              <dt>Stage</dt>
              <dd>{selected.stage}</dd>

              <dt>Owner</dt>
              <dd>{selected.owner}</dd>

              <dt>Opened</dt>
              <dd>{formatDate(selected.openedAt)}</dd>

              <dt>Source record</dt>
              <dd>{selected.source}</dd>
            </dl>

            <div className="correction-box">
              <strong>Evidence required</strong>
              <p>{selected.evidenceRequired}</p>
            </div>

            <div className="correction-box">
              <strong>Correction plan</strong>
              <p>{selected.correctionPlan}</p>
            </div>

            <div className="detail-actions">
              <button
                className="small-button"
                type="button"
                onClick={advanceCorrection}
                disabled={
                  selected.state === "RESOLVED" ||
                  selected.state === "REJECTED"
                }
              >
                {selected.state === "RESOLVED"
                  ? "Resolved"
                  : selected.state === "REJECTED"
                    ? "Correction rejected"
                    : "Advance correction"}
              </button>
              <button
                className="small-button"
                type="button"
                onClick={copyPackage}
              >
                {copied ? "Copied" : "Copy package"}
              </button>
              <button
                className="small-button"
                type="button"
                onClick={() =>
                  downloadJson(
                    `${selected.findingId.toLowerCase()}-correction.json`,
                    correctionPackage,
                  )
                }
              >
                Download package
              </button>
              <Link className="small-button" href="/workspace/testing">
                Retest route
              </Link>
            </div>

            <div className="notice">
              Advancing a correction does not clear the route. The original
              finding remains part of route history, the corrected route
              requires a new version, and the complete route must pass testing
              again before execution.
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
