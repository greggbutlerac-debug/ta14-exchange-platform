"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type RemediationState =
  | "OPEN"
  | "PLANNED"
  | "IN_PROGRESS"
  | "READY_FOR_RETEST"
  | "VERIFIED_CLOSED"
  | "REJECTED"
  | "WAIVED";

type Severity = "LOW" | "MODERATE" | "HIGH" | "CRITICAL";

type RemediationActionState =
  | "NOT_STARTED"
  | "IN_PROGRESS"
  | "COMPLETE"
  | "BLOCKED";

type RemediationAction = {
  actionId: string;
  description: string;
  owner: string;
  dueAt: string;
  state: RemediationActionState;
  evidence: string[];
};

type DispositionRemediation = {
  remediationId: string;
  verificationId: string;
  dispositionId: string;
  recordId: string;
  recordTitle: string;
  recordVersion: string;
  state: RemediationState;
  severity: Severity;
  openedAt: string;
  openedBy: string;
  assignedTo: string;
  dueAt: string;
  divergenceSummary: string;
  affectedSystems: string[];
  containmentActions: string[];
  correctiveActions: RemediationAction[];
  retestRequirements: string[];
  closureAuthority: string;
  closureStatement: string;
  closedAt: string;
  closureReceiptId: string;
};

const initialRemediations: DispositionRemediation[] = [
  {
    remediationId: "TA14-DRM-000011",
    verificationId: "TA14-DVR-000018",
    dispositionId: "TA14-RDP-000018",
    recordId: "TA14-AR-2026-000142",
    recordTitle: "Legacy Sensor Export Record",
    recordVersion: "3.4.2",
    state: "IN_PROGRESS",
    severity: "HIGH",
    openedAt: "2026-07-09T16:20:00.000Z",
    openedBy: "TA-14 Review Desk",
    assignedTo: "Legacy Migration Service",
    dueAt: "2026-07-18T18:00:00.000Z",
    divergenceSummary:
      "One personal email remained visible in an embedded CSV preview and one stale public cache remained addressable after the approved redaction-and-archive disposition.",
    affectedSystems: [
      "Public presentation store",
      "Embedded CSV preview renderer",
      "Edge cache",
    ],
    containmentActions: [
      "Suspend public reliance on the record.",
      "Disable public preview access.",
      "Preserve the divergent preview and cache evidence.",
    ],
    correctiveActions: [
      {
        actionId: "TA14-DRM-ACT-000031",
        description:
          "Remove the personal email from the embedded CSV preview and regenerate the redacted derivative.",
        owner: "Legacy Migration Service",
        dueAt: "2026-07-18T15:00:00.000Z",
        state: "IN_PROGRESS",
        evidence: [
          "Replacement preview digest pending",
          "Redaction diff pending",
        ],
      },
      {
        actionId: "TA14-DRM-ACT-000032",
        description:
          "Purge the stale public cache and verify that the restricted preview is no longer addressable.",
        owner: "Platform Operations",
        dueAt: "2026-07-18T16:00:00.000Z",
        state: "NOT_STARTED",
        evidence: [],
      },
      {
        actionId: "TA14-DRM-ACT-000033",
        description:
          "Add embedded-preview inspection to future disposition verification checks.",
        owner: "TA-14 Review Desk",
        dueAt: "2026-07-19T12:00:00.000Z",
        state: "NOT_STARTED",
        evidence: [],
      },
    ],
    retestRequirements: [
      "Re-run public presentation scan.",
      "Re-run edge-cache scan from an unauthenticated session.",
      "Confirm all personal email addresses are absent.",
      "Compare the regenerated derivative to the authorized redaction scope.",
      "Issue a new disposition verification report.",
    ],
    closureAuthority: "TA-14 Review Desk",
    closureStatement: "PENDING",
    closedAt: "PENDING",
    closureReceiptId: "PENDING",
  },
  {
    remediationId: "TA14-DRM-000010",
    verificationId: "TA14-DVR-000017",
    dispositionId: "TA14-RDP-000017",
    recordId: "TA14-AR-2026-000137",
    recordTitle: "Temporary Contractor Access Record",
    recordVersion: "1.1.0",
    state: "READY_FOR_RETEST",
    severity: "MODERATE",
    openedAt: "2026-07-08T14:11:00.000Z",
    openedBy: "TA-14 Review Desk",
    assignedTo: "Identity Operations",
    dueAt: "2026-07-17T20:00:00.000Z",
    divergenceSummary:
      "The record package was archived correctly, but one temporary access token remained active beyond the authorized restriction window.",
    affectedSystems: ["Identity provider", "Access-token registry"],
    containmentActions: [
      "Disable the temporary token.",
      "Suspend further access authorization for the identity.",
    ],
    correctiveActions: [
      {
        actionId: "TA14-DRM-ACT-000028",
        description: "Revoke the remaining temporary access token.",
        owner: "Identity Operations",
        dueAt: "2026-07-17T17:00:00.000Z",
        state: "COMPLETE",
        evidence: ["Token revocation receipt TA14-IAM-REV-000044"],
      },
      {
        actionId: "TA14-DRM-ACT-000029",
        description:
          "Add token-registry reconciliation to restriction execution.",
        owner: "Identity Operations",
        dueAt: "2026-07-17T18:00:00.000Z",
        state: "COMPLETE",
        evidence: ["Updated reconciliation job v1.2.0"],
      },
    ],
    retestRequirements: [
      "Confirm the token is inactive.",
      "Confirm no replacement token exists.",
      "Confirm the archived record remains accessible only to authorized custodians.",
    ],
    closureAuthority: "TA-14 Review Desk",
    closureStatement: "Awaiting independent retest.",
    closedAt: "PENDING",
    closureReceiptId: "PENDING",
  },
  {
    remediationId: "TA14-DRM-000009",
    verificationId: "TA14-DVR-000016",
    dispositionId: "TA14-RDP-000016",
    recordId: "TA14-AR-2026-000132",
    recordTitle: "Expired Demonstration Upload",
    recordVersion: "1.0.0",
    state: "VERIFIED_CLOSED",
    severity: "LOW",
    openedAt: "2026-07-07T10:04:00.000Z",
    openedBy: "TA-14 Review Desk",
    assignedTo: "Workspace Operations",
    dueAt: "2026-07-07T18:00:00.000Z",
    divergenceSummary:
      "A duplicate thumbnail remained in a temporary presentation cache after the authorized deletion.",
    affectedSystems: ["Presentation cache"],
    containmentActions: ["Restrict the cache object."],
    correctiveActions: [
      {
        actionId: "TA14-DRM-ACT-000026",
        description:
          "Remove the duplicate thumbnail and verify cache invalidation.",
        owner: "Workspace Operations",
        dueAt: "2026-07-07T15:00:00.000Z",
        state: "COMPLETE",
        evidence: [
          "Cache purge receipt TA14-CACHE-000112",
          "Post-purge scan TA14-SCAN-000274",
        ],
      },
    ],
    retestRequirements: [
      "Verify the thumbnail is inaccessible.",
      "Verify the disposition lineage remains preserved.",
    ],
    closureAuthority: "TA-14 Review Desk",
    closureStatement:
      "Corrective action completed. Independent retest found no remaining scoped cache object, and the required lineage remained preserved.",
    closedAt: "2026-07-07T15:21:00.000Z",
    closureReceiptId: "TA14-DRM-CLOSE-000009",
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

export default function DispositionRemediationClosurePage() {
  const [records, setRecords] = useState(initialRemediations);
  const [selectedId, setSelectedId] = useState(initialRemediations[0].remediationId);
  const [query, setQuery] = useState("");
  const [stateFilter, setStateFilter] = useState<RemediationState | "ALL">("ALL");
  const [severityFilter, setSeverityFilter] = useState<Severity | "ALL">("ALL");
  const [copied, setCopied] = useState(false);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return records.filter((record) => {
      const matchesQuery =
        !needle ||
        [
          record.remediationId,
          record.verificationId,
          record.dispositionId,
          record.recordId,
          record.recordTitle,
          record.state,
          record.severity,
          record.openedBy,
          record.assignedTo,
          record.divergenceSummary,
          ...record.affectedSystems,
        ]
          .join(" ")
          .toLowerCase()
          .includes(needle);

      return (
        matchesQuery &&
        (stateFilter === "ALL" || record.state === stateFilter) &&
        (severityFilter === "ALL" || record.severity === severityFilter)
      );
    });
  }, [query, records, severityFilter, stateFilter]);

  const selected =
    records.find((record) => record.remediationId === selectedId) ??
    filtered[0] ??
    records[0];

  const metrics = useMemo(
    () => ({
      open: records.filter((item) =>
        ["OPEN", "PLANNED", "IN_PROGRESS"].includes(item.state),
      ).length,
      retest: records.filter((item) => item.state === "READY_FOR_RETEST").length,
      closed: records.filter((item) => item.state === "VERIFIED_CLOSED").length,
      critical: records.filter((item) => item.severity === "CRITICAL").length,
    }),
    [records],
  );

  const incompleteActions = selected.correctiveActions.filter(
    (action) => action.state !== "COMPLETE",
  );

  const closurePackage = {
    schema: "TA14_DISPOSITION_REMEDIATION_CLOSURE_PACKAGE_V1",
    generatedAt: new Date().toISOString(),
    remediation: selected,
    readiness: {
      totalActions: selected.correctiveActions.length,
      completedActions: selected.correctiveActions.filter(
        (action) => action.state === "COMPLETE",
      ).length,
      incompleteActions: incompleteActions.length,
      readyForRetest: incompleteActions.length === 0,
      readyForClosure:
        incompleteActions.length === 0 &&
        selected.state === "READY_FOR_RETEST",
    },
    governance: {
      divergencePreserved: true,
      containmentPreserved: true,
      correctiveEvidenceRequired: true,
      independentRetestRequired: true,
      closureAuthorityRequired: true,
      originalVerificationNotOverwritten: true,
    },
    limitation:
      "Closure records that specified remediation and retesting were completed. It does not erase the original divergence or permit claims beyond the tested systems, scope, and evidence.",
  };

  function updateAction(actionId: string, state: RemediationActionState) {
    setRecords((items) =>
      items.map((item) =>
        item.remediationId === selected.remediationId
          ? {
              ...item,
              correctiveActions: item.correctiveActions.map((action) =>
                action.actionId === actionId ? { ...action, state } : action,
              ),
            }
          : item,
      ),
    );
  }

  function markReadyForRetest() {
    if (incompleteActions.length > 0) return;

    setRecords((items) =>
      items.map((item) =>
        item.remediationId === selected.remediationId
          ? {
              ...item,
              state: "READY_FOR_RETEST",
              closureStatement: "Awaiting independent retest.",
            }
          : item,
      ),
    );
  }

  function closeRemediation() {
    if (incompleteActions.length > 0 || selected.state !== "READY_FOR_RETEST") {
      return;
    }

    setRecords((items) =>
      items.map((item) =>
        item.remediationId === selected.remediationId
          ? {
              ...item,
              state: "VERIFIED_CLOSED",
              closedAt: new Date().toISOString(),
              closureReceiptId: `TA14-DRM-CLOSE-${Math.floor(
                100000 + Math.random() * 900000,
              )}`,
              closureStatement:
                "Corrective actions were completed, required evidence was preserved, and independent retesting confirmed correspondence with the authorized disposition scope.",
            }
          : item,
      ),
    );
  }

  async function copyPackage() {
    await navigator.clipboard.writeText(JSON.stringify(closurePackage, null, 2));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <main className="remediation-page">
      <style>{`
        * { box-sizing: border-box; }

        .remediation-page {
          min-height: calc(100vh - 68px);
          padding: 48px 0 110px;
          color: #edf6ff;
        }

        .remediation-wrap {
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
            radial-gradient(circle at 85% 7%, rgba(255, 101, 126, .17), transparent 28%),
            radial-gradient(circle at 14% 0%, rgba(72, 223, 255, .17), transparent 32%),
            linear-gradient(135deg, rgba(14, 30, 48, .97), rgba(5, 11, 20, .98));
          box-shadow: 0 38px 120px rgba(0,0,0,.35);
        }

        .hero::after {
          content: "REMEDIATE";
          position: absolute;
          right: -10px;
          bottom: -42px;
          color: rgba(255,255,255,.025);
          font-size: clamp(4rem, 10vw, 8.8rem);
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
          background: linear-gradient(100deg, #fff, #8ceaff 50%, #ff657e);
          background-clip: text;
          -webkit-background-clip: text;
        }

        .hero-copy {
          max-width: 920px;
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
          background: linear-gradient(100deg, #56e6ff, #ff657e);
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
          grid-template-columns: minmax(220px, 1fr) 240px 180px;
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

        .remediation-row {
          width: 100%;
          padding: 20px 21px;
          border: 0;
          border-bottom: 1px solid rgba(132, 177, 216, .1);
          color: inherit;
          background: transparent;
          text-align: left;
          cursor: pointer;
        }

        .remediation-row:last-child { border-bottom: 0; }

        .remediation-row.active {
          background: linear-gradient(90deg, rgba(84, 232, 255, .09), rgba(255, 101, 126, .025));
          box-shadow: inset 3px 0 0 #56e6ff;
        }

        .row-top, .meta, .detail-top, .action-actions {
          display: flex;
          align-items: center;
          gap: 9px;
          flex-wrap: wrap;
        }

        .row-top { justify-content: space-between; }

        .remediation-title { font-weight: 900; }

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

        .pill.VERIFIED_CLOSED, .pill.COMPLETE {
          color: #54efae;
          border-color: rgba(84, 239, 174, .3);
        }

        .pill.OPEN, .pill.PLANNED, .pill.IN_PROGRESS,
        .pill.READY_FOR_RETEST, .pill.NOT_STARTED {
          color: #ffd27b;
          border-color: rgba(255, 210, 123, .3);
        }

        .pill.REJECTED, .pill.WAIVED, .pill.BLOCKED,
        .pill.HIGH, .pill.CRITICAL {
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

        .box, .action {
          margin-top: 17px;
          padding: 16px;
          border: 1px solid rgba(132, 177, 216, .12);
          border-radius: 17px;
          background: rgba(2, 9, 16, .52);
        }

        .box strong, .action strong {
          display: block;
          color: #dce8f3;
          font-size: .76rem;
          letter-spacing: .07em;
          text-transform: uppercase;
        }

        .box p, .action p {
          margin: 10px 0 0;
          font-size: .8rem;
        }

        .box ul, .action ul {
          margin: 10px 0 0;
          padding-left: 18px;
          color: #9fb1c1;
          line-height: 1.65;
        }

        .action-head {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          align-items: flex-start;
        }

        .action-meta {
          margin-top: 10px;
          color: #7e96aa;
          font-size: .72rem;
        }

        .action-actions { margin-top: 12px; }

        .notice {
          margin-top: 18px;
          padding: 16px 18px;
          border-left: 3px solid #ff657e;
          border-radius: 0 13px 13px 0;
          color: #91a8bd;
          background: rgba(255, 101, 126, .045);
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
          .remediation-wrap { width: min(100% - 24px, 1420px); }
          .remediation-page { padding-top: 24px; }
          .hero { padding: 28px 22px 34px; border-radius: 24px; }
          .toolbar { grid-template-columns: 1fr; }
          .metrics { grid-template-columns: 1fr 1fr; }
          .kv { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="remediation-wrap">
        <section className="hero">
          <div className="hero-content">
            <p className="eyebrow">
              TA-14 Exchange · Disposition Remediation & Closure
            </p>
            <h1>
              Preserve the divergence.
              <br />
              <span className="gradient">Prove the correction.</span>
            </h1>
            <p className="hero-copy">
              Convert failed disposition verification into governed containment,
              assigned corrective action, preserved evidence, independent
              retesting, and closure without erasing the original divergence.
            </p>

            <div className="hero-actions">
              <Link
                className="button"
                href="/workspace/records/disposition/verify"
              >
                Open Disposition Verification
              </Link>
              <Link
                className="button-secondary"
                href="/workspace/records/disposition"
              >
                Open Disposition Authorization
              </Link>
              <Link
                className="button-secondary"
                href="/workspace/records/disputes"
              >
                Open Dispute Desk
              </Link>
            </div>
          </div>
        </section>

        <section className="metrics">
          <article className="metric">
            <strong>{metrics.open}</strong>
            <span>Open remediation</span>
          </article>
          <article className="metric">
            <strong>{metrics.retest}</strong>
            <span>Ready for retest</span>
          </article>
          <article className="metric">
            <strong>{metrics.closed}</strong>
            <span>Verified closed</span>
          </article>
          <article className="metric">
            <strong>{metrics.critical}</strong>
            <span>Critical</span>
          </article>
        </section>

        <section className="toolbar">
          <input
            aria-label="Search remediation records"
            placeholder="Search record, divergence, owner, system, verification, or disposition"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />

          <select
            aria-label="Filter remediation state"
            value={stateFilter}
            onChange={(event) =>
              setStateFilter(event.target.value as RemediationState | "ALL")
            }
          >
            <option value="ALL">All states</option>
            <option value="OPEN">OPEN</option>
            <option value="PLANNED">PLANNED</option>
            <option value="IN_PROGRESS">IN_PROGRESS</option>
            <option value="READY_FOR_RETEST">READY_FOR_RETEST</option>
            <option value="VERIFIED_CLOSED">VERIFIED_CLOSED</option>
            <option value="REJECTED">REJECTED</option>
            <option value="WAIVED">WAIVED</option>
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
              <strong>Disposition remediation cases</strong>
              <span>{filtered.length} visible</span>
            </div>

            {filtered.length ? (
              filtered.map((record) => (
                <button
                  className={`remediation-row ${
                    selected.remediationId === record.remediationId
                      ? "active"
                      : ""
                  }`}
                  key={record.remediationId}
                  type="button"
                  onClick={() => setSelectedId(record.remediationId)}
                >
                  <div className="row-top">
                    <span className="remediation-title">
                      {record.recordTitle}
                    </span>
                    <span className={`pill ${record.state}`}>{record.state}</span>
                  </div>
                  <div className="mono">{record.remediationId}</div>
                  <div className="meta">
                    <span>{record.severity}</span>
                    <span>{record.assignedTo}</span>
                    <span>{record.verificationId}</span>
                    <span>v{record.recordVersion}</span>
                  </div>
                </button>
              ))
            ) : (
              <div className="empty">
                No remediation case matches the current filters.
              </div>
            )}
          </div>

          <aside className="panel detail">
            <div className="detail-top">
              <span className={`pill ${selected.state}`}>{selected.state}</span>
              <span className={`pill ${selected.severity}`}>
                {selected.severity}
              </span>
              <span className="pill">
                {selected.correctiveActions.length - incompleteActions.length}/
                {selected.correctiveActions.length} complete
              </span>
            </div>

            <h2>{selected.recordTitle}</h2>
            <div className="mono">{selected.remediationId}</div>
            <p>{selected.divergenceSummary}</p>

            <dl className="kv">
              <dt>Verification ID</dt>
              <dd>{selected.verificationId}</dd>

              <dt>Disposition ID</dt>
              <dd>{selected.dispositionId}</dd>

              <dt>Record ID</dt>
              <dd>{selected.recordId}</dd>

              <dt>Version</dt>
              <dd>{selected.recordVersion}</dd>

              <dt>Opened by</dt>
              <dd>{selected.openedBy}</dd>

              <dt>Assigned to</dt>
              <dd>{selected.assignedTo}</dd>

              <dt>Opened</dt>
              <dd>{formatDate(selected.openedAt)}</dd>

              <dt>Due</dt>
              <dd>{formatDate(selected.dueAt)}</dd>

              <dt>Closure authority</dt>
              <dd>{selected.closureAuthority}</dd>

              <dt>Closed</dt>
              <dd>{formatDate(selected.closedAt)}</dd>

              <dt>Closure receipt</dt>
              <dd>{selected.closureReceiptId}</dd>
            </dl>

            <div className="box">
              <strong>Affected systems</strong>
              <ul>
                {selected.affectedSystems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="box">
              <strong>Containment actions</strong>
              <ul>
                {selected.containmentActions.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            {selected.correctiveActions.map((action) => (
              <div className="action" key={action.actionId}>
                <div className="action-head">
                  <div>
                    <strong>{action.actionId}</strong>
                    <p>{action.description}</p>
                  </div>
                  <span className={`pill ${action.state}`}>{action.state}</span>
                </div>

                <div className="action-meta">
                  Owner: {action.owner} · Due: {formatDate(action.dueAt)}
                </div>

                {action.evidence.length ? (
                  <ul>
                    {action.evidence.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}

                <div className="action-actions">
                  <button
                    className="small-button"
                    type="button"
                    onClick={() => updateAction(action.actionId, "IN_PROGRESS")}
                  >
                    Start
                  </button>
                  <button
                    className="small-button"
                    type="button"
                    onClick={() => updateAction(action.actionId, "COMPLETE")}
                  >
                    Complete
                  </button>
                  <button
                    className="small-button"
                    type="button"
                    onClick={() => updateAction(action.actionId, "BLOCKED")}
                  >
                    Block
                  </button>
                </div>
              </div>
            ))}

            <div className="box">
              <strong>Retest requirements</strong>
              <ul>
                {selected.retestRequirements.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="box">
              <strong>Closure statement</strong>
              <p>{selected.closureStatement}</p>
            </div>

            <div className="detail-actions">
              <button
                className="button"
                type="button"
                onClick={markReadyForRetest}
                disabled={incompleteActions.length > 0}
              >
                Mark ready for retest
              </button>

              <button
                className="small-button"
                type="button"
                onClick={closeRemediation}
                disabled={
                  incompleteActions.length > 0 ||
                  selected.state !== "READY_FOR_RETEST"
                }
              >
                Verify and close
              </button>

              <button
                className="small-button"
                type="button"
                onClick={() =>
                  setRecords((items) =>
                    items.map((item) =>
                      item.remediationId === selected.remediationId
                        ? { ...item, state: "REJECTED" }
                        : item,
                    ),
                  )
                }
              >
                Reject closure
              </button>

              <button
                className="small-button"
                type="button"
                onClick={copyPackage}
              >
                {copied ? "Copied" : "Copy closure package"}
              </button>

              <button
                className="small-button"
                type="button"
                onClick={() =>
                  downloadJson(
                    `${selected.remediationId.toLowerCase()}-remediation-closure.json`,
                    closurePackage,
                  )
                }
              >
                Download package
              </button>
            </div>

            <div className="notice">
              Remediation closes the divergence only after corrective evidence
              and independent retesting establish correspondence. The original
              failed verification remains preserved as part of the permanent
              record lineage.
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
