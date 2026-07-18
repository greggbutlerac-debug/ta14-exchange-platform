"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type RestorationState =
  | "DRAFT"
  | "PENDING_APPROVAL"
  | "RESTORED"
  | "PARTIALLY_RESTORED"
  | "DENIED"
  | "REVOKED"
  | "SUPERSEDED";

type ApprovalState = "APPROVED" | "PENDING" | "REJECTED";

type ClosureRestoration = {
  restorationId: string;
  retestId: string;
  remediationCaseId: string;
  auditId: string;
  closureId: string;
  relianceReceiptId: string;
  certificateId: string;
  verificationId: string;
  recordId: string;
  recordTitle: string;
  relyingParty: string;
  intendedUse: string;
  state: RestorationState;
  requestedBy: string;
  requestedAt: string;
  effectiveAt: string;
  priorClosureState: string;
  retestStateObserved: string;
  restorationScope: string;
  restoredClosureState: string;
  restorationStatement: string;
  approvals: {
    authority: string;
    role: string;
    state: ApprovalState;
    decidedAt: string;
    note: string;
  }[];
  preservedLimitations: string[];
  residualObligations: string[];
  prohibitedInterpretations: string[];
  evidenceReceipts: string[];
  restorationReceiptId: string;
  restorationDigest: string;
};

const initialRestorations: ClosureRestoration[] = [
  {
    restorationId: "TA14-FCRCARRS-000001",
    retestId: "TA14-FCRCARR-000001",
    remediationCaseId: "TA14-FCRCAR-000001",
    auditId: "TA14-FCRCA-000002",
    closureId: "TA14-FCRC-000003",
    relianceReceiptId: "TA14-FCR-000006",
    certificateId: "TA14-FCERT-000009",
    verificationId: "TA14-FCV-000012",
    recordId: "TA14-AR-2026-000119",
    recordTitle: "Legacy Disclosure Approval",
    relyingParty: "External Communications Review",
    intendedUse: "PUBLIC_DISCLOSURE",
    state: "RESTORED",
    requestedBy: "TA-14 Independent Retest Desk",
    requestedAt: "2026-07-30T19:04:00.000Z",
    effectiveAt: "2026-07-30T19:18:00.000Z",
    priorClosureState: "REOPENED",
    retestStateObserved: "PASSED",
    restorationScope:
      "Restore the reliance closure to VERIFIED_CLOSED for the original party and original intended use only.",
    restoredClosureState: "VERIFIED_CLOSED",
    restorationStatement:
      "The reliance closure is restored to verified-closed status after successful remediation and independent retest.",
    approvals: [
      {
        authority: "TA-14 Independent Retest Desk",
        role: "Retest authority",
        state: "APPROVED",
        decidedAt: "2026-07-30T19:05:00.000Z",
        note: "All retest requirements passed.",
      },
      {
        authority: "TA-14 Closure Audit Authority",
        role: "Audit authority",
        state: "APPROVED",
        decidedAt: "2026-07-30T19:12:00.000Z",
        note: "Failed path is no longer available.",
      },
      {
        authority: "TA-14 Reliance Closure Desk",
        role: "Closure authority",
        state: "APPROVED",
        decidedAt: "2026-07-30T19:18:00.000Z",
        note: "Closure restored with original limitations preserved.",
      },
    ],
    preservedLimitations: [
      "Restoration applies only to the original relying party.",
      "Restoration applies only to PUBLIC_DISCLOSURE.",
      "Any new use requires a new verification and reliance receipt.",
    ],
    residualObligations: [
      "Preserve the failed audit, remediation, and retest lineage.",
      "Continue rejecting superseded certificate identifiers.",
    ],
    prohibitedInterpretations: [
      "Restoration does not erase the original closure failure.",
      "Restoration does not reactivate the original reliance receipt.",
      "Restoration does not authorize new downstream use.",
    ],
    evidenceReceipts: [
      "TA14-FCRCA-RCPT-000002",
      "TA14-FCRCAR-RCPT-000001",
      "TA14-FCRCARR-RCPT-000001",
      "TA14-RETEST-EVID-000904",
      "TA14-RETEST-EVID-000905",
      "TA14-RETEST-EVID-000906",
    ],
    restorationReceiptId: "TA14-FCRCARRS-RCPT-000001",
    restorationDigest:
      "sha256:ad715539af98e8a1bb4bc164765f1fd9f78c6390a85e1567d66b4db5974f3587",
  },
  {
    restorationId: "TA14-FCRCARRS-000002",
    retestId: "TA14-FCRCARR-000002",
    remediationCaseId: "TA14-FCRCAR-000002",
    auditId: "TA14-FCRCA-000005",
    closureId: "TA14-FCRC-000006",
    relianceReceiptId: "TA14-FCR-000007",
    certificateId: "TA14-FCERT-000010",
    verificationId: "TA14-FCV-000013",
    recordId: "TA14-AR-2026-000148",
    recordTitle: "Temporary Training Demonstration Record",
    relyingParty: "Training Governance Team",
    intendedUse: "INTERNAL_REVIEW",
    state: "PENDING_APPROVAL",
    requestedBy: "TA-14 Independent Retest Desk",
    requestedAt: "2026-08-20T19:10:00.000Z",
    effectiveAt: "PENDING",
    priorClosureState: "REOPENED",
    retestStateObserved: "PARTIAL_PASS",
    restorationScope:
      "No restoration may occur until lineage-preservation verification passes.",
    restoredClosureState: "PENDING",
    restorationStatement:
      "Restoration remains pending because the retest did not fully pass.",
    approvals: [
      {
        authority: "TA-14 Independent Retest Desk",
        role: "Retest authority",
        state: "PENDING",
        decidedAt: "PENDING",
        note: "Historical-lineage verification remains unresolved.",
      },
      {
        authority: "TA-14 Closure Audit Authority",
        role: "Audit authority",
        state: "PENDING",
        decidedAt: "PENDING",
        note: "Awaiting complete retest evidence.",
      },
      {
        authority: "TA-14 Reliance Closure Desk",
        role: "Closure authority",
        state: "PENDING",
        decidedAt: "PENDING",
        note: "Closure remains reopened.",
      },
    ],
    preservedLimitations: [
      "No reliance authority is restored.",
      "The expired receipt remains unusable.",
      "Renewed internal review requires a new reliance receipt.",
    ],
    residualObligations: [
      "Complete lineage-preservation retest.",
      "Preserve the nonconforming post-expiry review event.",
    ],
    prohibitedInterpretations: [
      "Partial passage is not verified closure.",
      "Pending approval is not restored status.",
    ],
    evidenceReceipts: [
      "TA14-FCRCA-RCPT-000005",
      "TA14-FCRCAR-RCPT-000002",
      "TA14-FCRCARR-RCPT-000002",
    ],
    restorationReceiptId: "PENDING",
    restorationDigest: "PENDING",
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

function makeDigest(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  const base = (hash >>> 0).toString(16).padStart(8, "0");
  return `sha256:demo:${base.repeat(8)}`;
}

export default function ClosureRestorationPage() {
  const [records, setRecords] = useState(initialRestorations);
  const [selectedId, setSelectedId] = useState(initialRestorations[0].restorationId);
  const [query, setQuery] = useState("");
  const [stateFilter, setStateFilter] = useState<RestorationState | "ALL">("ALL");
  const [copied, setCopied] = useState(false);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return records.filter((record) => {
      const matchesQuery =
        !needle ||
        [
          record.restorationId,
          record.retestId,
          record.remediationCaseId,
          record.auditId,
          record.closureId,
          record.relianceReceiptId,
          record.certificateId,
          record.verificationId,
          record.recordId,
          record.recordTitle,
          record.relyingParty,
          record.intendedUse,
          record.state,
          record.restorationScope,
          record.restorationStatement,
          ...record.preservedLimitations,
          ...record.residualObligations,
          ...record.prohibitedInterpretations,
          ...record.evidenceReceipts,
        ]
          .join(" ")
          .toLowerCase()
          .includes(needle);

      return (
        matchesQuery &&
        (stateFilter === "ALL" || record.state === stateFilter)
      );
    });
  }, [query, records, stateFilter]);

  const selected =
    records.find((record) => record.restorationId === selectedId) ??
    filtered[0] ??
    records[0];

  const pendingApprovals = selected.approvals.filter(
    (approval) => approval.state === "PENDING",
  );
  const rejectedApprovals = selected.approvals.filter(
    (approval) => approval.state === "REJECTED",
  );

  const metrics = useMemo(
    () => ({
      restored: records.filter((item) => item.state === "RESTORED").length,
      pending: records.filter((item) => item.state === "PENDING_APPROVAL").length,
      denied: records.filter((item) => item.state === "DENIED").length,
      partial: records.filter((item) => item.state === "PARTIALLY_RESTORED").length,
    }),
    [records],
  );

  const restorationPackage = {
    schema:
      "TA14_FINALITY_CERTIFICATE_RELIANCE_CLOSURE_RESTORATION_ATTESTATION_V1",
    generatedAt: new Date().toISOString(),
    restoration: selected,
    evaluation: {
      approvalsComplete: pendingApprovals.length === 0,
      approvalsRejected: rejectedApprovals.length,
      retestFullyPassed: selected.retestStateObserved === "PASSED",
      eligibleForRestoration:
        selected.retestStateObserved === "PASSED" &&
        pendingApprovals.length === 0 &&
        rejectedApprovals.length === 0,
    },
    governance: {
      retestBound: true,
      remediationBound: true,
      failedAuditBound: true,
      priorClosureBound: true,
      originalRelianceReceiptPreserved: true,
      originalFailurePreserved: true,
      limitationsPreserved: true,
      residualObligationsPreserved: true,
      restorationReceiptPreserved: true,
    },
    limitation:
      "Restoration changes the current closure status only. It does not erase the original failure, reactivate the original reliance receipt, or authorize any new party, purpose, execution, or disclosure.",
  };

  function approvePending() {
    if (selected.retestStateObserved !== "PASSED") return;

    const now = new Date().toISOString();

    setRecords((items) =>
      items.map((item) =>
        item.restorationId === selected.restorationId
          ? {
              ...item,
              approvals: item.approvals.map((approval) =>
                approval.state === "PENDING"
                  ? {
                      ...approval,
                      state: "APPROVED",
                      decidedAt: now,
                      note: "Restoration approved after full retest passage.",
                    }
                  : approval,
              ),
            }
          : item,
      ),
    );
  }

  function finalizeRestoration() {
    if (
      selected.retestStateObserved !== "PASSED" ||
      pendingApprovals.length > 0 ||
      rejectedApprovals.length > 0
    ) {
      return;
    }

    const now = new Date().toISOString();

    setRecords((items) =>
      items.map((item) =>
        item.restorationId === selected.restorationId
          ? {
              ...item,
              state: "RESTORED",
              effectiveAt: now,
              restoredClosureState: "VERIFIED_CLOSED",
              restorationStatement:
                "The reliance closure is restored to verified-closed status after successful remediation, independent retest, and approval.",
              restorationReceiptId:
                item.restorationReceiptId === "PENDING"
                  ? `TA14-FCRCARRS-RCPT-${Math.floor(
                      100000 + Math.random() * 900000,
                    )}`
                  : item.restorationReceiptId,
              restorationDigest: makeDigest(
                JSON.stringify({
                  restorationId: item.restorationId,
                  retestId: item.retestId,
                  remediationCaseId: item.remediationCaseId,
                  closureId: item.closureId,
                  approvals: item.approvals,
                  restoredClosureState: "VERIFIED_CLOSED",
                  effectiveAt: now,
                }),
              ),
            }
          : item,
      ),
    );
  }

  async function copyPackage() {
    await navigator.clipboard.writeText(
      JSON.stringify(restorationPackage, null, 2),
    );
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <main className="restoration-page">
      <style>{`
        * { box-sizing: border-box; }

        .restoration-page {
          min-height: calc(100vh - 68px);
          padding: 48px 0 110px;
          color: #edf6ff;
        }

        .restoration-wrap {
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
            radial-gradient(circle at 85% 7%, rgba(87, 196, 255, .16), transparent 28%),
            radial-gradient(circle at 14% 0%, rgba(73, 239, 172, .17), transparent 32%),
            linear-gradient(135deg, rgba(14, 30, 48, .97), rgba(5, 11, 20, .98));
          box-shadow: 0 38px 120px rgba(0,0,0,.35);
        }

        .hero::after {
          content: "RESTORE";
          position: absolute;
          right: -10px;
          bottom: -42px;
          color: rgba(255,255,255,.025);
          font-size: clamp(4rem, 10vw, 9rem);
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
          background: linear-gradient(100deg, #fff, #8ceaff 50%, #49efac);
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
          background: linear-gradient(100deg, #56e6ff, #49efac);
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

        button:disabled {
          cursor: not-allowed;
          opacity: .45;
          transform: none !important;
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
          grid-template-columns: minmax(220px, 1fr) 240px;
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

        .restoration-row {
          width: 100%;
          padding: 20px 21px;
          border: 0;
          border-bottom: 1px solid rgba(132, 177, 216, .1);
          color: inherit;
          background: transparent;
          text-align: left;
          cursor: pointer;
        }

        .restoration-row:last-child { border-bottom: 0; }

        .restoration-row.active {
          background: linear-gradient(90deg, rgba(84, 232, 255, .09), rgba(73, 239, 172, .025));
          box-shadow: inset 3px 0 0 #56e6ff;
        }

        .row-top, .meta, .detail-top {
          display: flex;
          align-items: center;
          gap: 9px;
          flex-wrap: wrap;
        }

        .row-top { justify-content: space-between; }

        .restoration-title { font-weight: 900; }

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

        .pill.RESTORED, .pill.APPROVED {
          color: #54efae;
          border-color: rgba(84, 239, 174, .3);
        }

        .pill.DRAFT, .pill.PENDING_APPROVAL, .pill.PARTIALLY_RESTORED, .pill.PENDING {
          color: #ffd27b;
          border-color: rgba(255, 210, 123, .3);
        }

        .pill.DENIED, .pill.REVOKED, .pill.REJECTED {
          color: #ff8e9b;
          border-color: rgba(255, 142, 155, .3);
        }

        .pill.SUPERSEDED {
          color: #a9b5c0;
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

        .result-banner {
          margin-top: 20px;
          padding: 20px;
          border: 1px solid rgba(132, 177, 216, .14);
          border-radius: 20px;
          background: rgba(2, 9, 16, .58);
        }

        .result-banner h3 {
          margin: 0;
          font-size: 1.1rem;
        }

        .result-banner p {
          margin: 10px 0 0;
        }

        .kv {
          display: grid;
          grid-template-columns: 210px 1fr;
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

        .box, .approval {
          margin-top: 17px;
          padding: 16px;
          border: 1px solid rgba(132, 177, 216, .12);
          border-radius: 17px;
          background: rgba(2, 9, 16, .52);
        }

        .box strong, .approval strong {
          display: block;
          color: #dce8f3;
          font-size: .76rem;
          letter-spacing: .07em;
          text-transform: uppercase;
        }

        .box p, .approval p {
          margin: 10px 0 0;
          font-size: .8rem;
        }

        .box ul {
          margin: 10px 0 0;
          padding-left: 18px;
          color: #9fb1c1;
          line-height: 1.65;
        }

        .approval {
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 12px;
          align-items: start;
        }

        .notice {
          margin-top: 18px;
          padding: 16px 18px;
          border-left: 3px solid #49efac;
          border-radius: 0 13px 13px 0;
          color: #91a8bd;
          background: rgba(73, 239, 172, .045);
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
          .restoration-wrap { width: min(100% - 24px, 1420px); }
          .restoration-page { padding-top: 24px; }
          .hero { padding: 28px 22px 34px; border-radius: 24px; }
          .toolbar { grid-template-columns: 1fr; }
          .metrics { grid-template-columns: 1fr 1fr; }
          .kv { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="restoration-wrap">
        <section className="hero">
          <div className="hero-content">
            <p className="eyebrow">
              TA-14 Exchange · Verified Closure Restoration
            </p>
            <h1>
              A closure may be restored.
              <br />
              <span className="gradient">Its failure may not be erased.</span>
            </h1>
            <p className="hero-copy">
              Restore verified-closed status only after remediation, complete
              independent retest, and approval by the retest, audit, and closure
              authorities—while preserving the original failure, limitations,
              residual obligations, and prohibition against reactivating the
              original reliance receipt.
            </p>

            <div className="hero-actions">
              <Link
                className="button"
                href="/workspace/records/disposition/finality/certificates/reliance/closure/audit/remediation/retest"
              >
                Open Independent Retest
              </Link>
              <Link
                className="button-secondary"
                href="/workspace/records/disposition/finality/certificates/reliance/closure/audit/remediation"
              >
                Open Audit Remediation
              </Link>
              <Link
                className="button-secondary"
                href="/workspace/records/disposition/finality/certificates/reliance/closure"
              >
                Open Reliance Closure
              </Link>
            </div>
          </div>
        </section>

        <section className="metrics">
          <article className="metric">
            <strong>{metrics.restored}</strong>
            <span>Restored</span>
          </article>
          <article className="metric">
            <strong>{metrics.pending}</strong>
            <span>Pending approval</span>
          </article>
          <article className="metric">
            <strong>{metrics.denied}</strong>
            <span>Denied</span>
          </article>
          <article className="metric">
            <strong>{metrics.partial}</strong>
            <span>Partially restored</span>
          </article>
        </section>

        <section className="toolbar">
          <input
            aria-label="Search closure restorations"
            placeholder="Search restoration, retest, remediation, closure, receipt, party, limitation, obligation, or statement"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />

          <select
            aria-label="Filter restoration state"
            value={stateFilter}
            onChange={(event) =>
              setStateFilter(event.target.value as RestorationState | "ALL")
            }
          >
            <option value="ALL">All states</option>
            <option value="DRAFT">DRAFT</option>
            <option value="PENDING_APPROVAL">PENDING_APPROVAL</option>
            <option value="RESTORED">RESTORED</option>
            <option value="PARTIALLY_RESTORED">PARTIALLY_RESTORED</option>
            <option value="DENIED">DENIED</option>
            <option value="REVOKED">REVOKED</option>
            <option value="SUPERSEDED">SUPERSEDED</option>
          </select>
        </section>

        <section className="grid">
          <div className="panel">
            <div className="panel-head">
              <strong>Closure restorations</strong>
              <span>{filtered.length} visible</span>
            </div>

            {filtered.length ? (
              filtered.map((record) => (
                <button
                  className={`restoration-row ${
                    selected.restorationId === record.restorationId
                      ? "active"
                      : ""
                  }`}
                  key={record.restorationId}
                  type="button"
                  onClick={() => setSelectedId(record.restorationId)}
                >
                  <div className="row-top">
                    <span className="restoration-title">
                      {record.recordTitle}
                    </span>
                    <span className={`pill ${record.state}`}>
                      {record.state}
                    </span>
                  </div>
                  <div className="mono">{record.restorationId}</div>
                  <div className="meta">
                    <span>{record.retestStateObserved}</span>
                    <span>{record.relyingParty}</span>
                    <span>{record.closureId}</span>
                    <span>{formatDate(record.effectiveAt)}</span>
                  </div>
                </button>
              ))
            ) : (
              <div className="empty">
                No closure restoration matches the current filters.
              </div>
            )}
          </div>

          <aside className="panel detail">
            <div className="detail-top">
              <span className={`pill ${selected.state}`}>{selected.state}</span>
              <span className="pill">{selected.retestStateObserved}</span>
              <span className="pill">{selected.intendedUse}</span>
            </div>

            <h2>{selected.recordTitle}</h2>
            <div className="mono">{selected.restorationId}</div>

            <div className="result-banner">
              <h3>{selected.relyingParty}</h3>
              <p>{selected.restorationStatement}</p>
            </div>

            <dl className="kv">
              <dt>Retest ID</dt>
              <dd>{selected.retestId}</dd>

              <dt>Remediation case</dt>
              <dd>{selected.remediationCaseId}</dd>

              <dt>Audit ID</dt>
              <dd>{selected.auditId}</dd>

              <dt>Closure ID</dt>
              <dd>{selected.closureId}</dd>

              <dt>Reliance receipt</dt>
              <dd>{selected.relianceReceiptId}</dd>

              <dt>Certificate ID</dt>
              <dd>{selected.certificateId}</dd>

              <dt>Verification ID</dt>
              <dd>{selected.verificationId}</dd>

              <dt>Record ID</dt>
              <dd>{selected.recordId}</dd>

              <dt>Requested by</dt>
              <dd>{selected.requestedBy}</dd>

              <dt>Requested</dt>
              <dd>{formatDate(selected.requestedAt)}</dd>

              <dt>Effective</dt>
              <dd>{formatDate(selected.effectiveAt)}</dd>

              <dt>Prior closure state</dt>
              <dd>{selected.priorClosureState}</dd>

              <dt>Restored closure state</dt>
              <dd>{selected.restoredClosureState}</dd>

              <dt>Restoration receipt</dt>
              <dd>{selected.restorationReceiptId}</dd>

              <dt>Restoration digest</dt>
              <dd>{selected.restorationDigest}</dd>
            </dl>

            <div className="box">
              <strong>Restoration scope</strong>
              <p>{selected.restorationScope}</p>
            </div>

            {selected.approvals.map((approval) => (
              <div
                className="approval"
                key={`${approval.authority}-${approval.role}`}
              >
                <span className={`pill ${approval.state}`}>
                  {approval.state}
                </span>
                <div>
                  <strong>
                    {approval.authority} · {approval.role}
                  </strong>
                  <p>
                    {approval.note} · {formatDate(approval.decidedAt)}
                  </p>
                </div>
              </div>
            ))}

            <div className="box">
              <strong>Preserved limitations</strong>
              <ul>
                {selected.preservedLimitations.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="box">
              <strong>Residual obligations</strong>
              <ul>
                {selected.residualObligations.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="box">
              <strong>Prohibited interpretations</strong>
              <ul>
                {selected.prohibitedInterpretations.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="box">
              <strong>Evidence receipts</strong>
              <ul>
                {selected.evidenceReceipts.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="detail-actions">
              <button
                className="button"
                type="button"
                onClick={approvePending}
                disabled={selected.retestStateObserved !== "PASSED"}
              >
                Approve pending authorities
              </button>

              <button
                className="small-button"
                type="button"
                onClick={finalizeRestoration}
                disabled={
                  selected.retestStateObserved !== "PASSED" ||
                  pendingApprovals.length > 0 ||
                  rejectedApprovals.length > 0
                }
              >
                Restore verified closure
              </button>

              <button
                className="small-button"
                type="button"
                onClick={() =>
                  setRecords((items) =>
                    items.map((item) =>
                      item.restorationId === selected.restorationId
                        ? {
                            ...item,
                            state: "DENIED",
                            restorationStatement:
                              "Closure restoration was denied. The closure remains reopened and the denial is preserved.",
                          }
                        : item,
                    ),
                  )
                }
              >
                Deny restoration
              </button>

              <button
                className="small-button"
                type="button"
                onClick={copyPackage}
              >
                {copied ? "Copied" : "Copy restoration attestation"}
              </button>

              <button
                className="small-button"
                type="button"
                onClick={() =>
                  downloadJson(
                    `${selected.restorationId.toLowerCase()}-closure-restoration.json`,
                    restorationPackage,
                  )
                }
              >
                Download attestation
              </button>
            </div>

            <div className="notice">
              Restored closure status confirms that the corrected path passed
              retest. It does not reactivate the old reliance receipt, erase the
              failed audit, or authorize any new use beyond the original
              boundaries.
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
