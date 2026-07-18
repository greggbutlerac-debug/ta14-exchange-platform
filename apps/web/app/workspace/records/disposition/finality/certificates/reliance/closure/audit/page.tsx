"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type AuditState =
  | "PENDING"
  | "IN_REVIEW"
  | "VERIFIED_CLOSED"
  | "PARTIAL_FAILURE"
  | "FAILED"
  | "REOPENED"
  | "WAIVED";

type AuditTrigger =
  | "SCHEDULED"
  | "POST_CLOSURE_CONFIRMATION"
  | "DOWNSTREAM_USE_DETECTED"
  | "CERTIFICATE_CHANGE"
  | "DISPUTE"
  | "MANUAL";

type CheckState = "PASS" | "FAIL" | "UNKNOWN";

type ClosureAudit = {
  auditId: string;
  closureId: string;
  relianceReceiptId: string;
  monitorId: string;
  certificateId: string;
  verificationId: string;
  recordId: string;
  recordTitle: string;
  relyingParty: string;
  intendedUse: string;
  state: AuditState;
  trigger: AuditTrigger;
  auditedBy: string;
  initiatedAt: string;
  completedAt: string;
  closureStateObserved: string;
  certificateStateObserved: string;
  verificationStateObserved: string;
  finalityStateObserved: string;
  relianceDirectiveObserved: string;
  checks: {
    label: string;
    state: CheckState;
    evidence: string;
  }[];
  downstreamFindings: string[];
  correctiveActions: string[];
  residualObligations: string[];
  auditStatement: string;
  auditReceiptId: string;
  auditDigest: string;
};

const initialAudits: ClosureAudit[] = [
  {
    auditId: "TA14-FCRCA-000003",
    closureId: "TA14-FCRC-000004",
    relianceReceiptId: "TA14-FCR-000008",
    monitorId: "TA14-FCRM-000005",
    certificateId: "TA14-FCERT-000011",
    verificationId: "TA14-FCV-000014",
    recordId: "TA14-AR-2026-000126",
    recordTitle: "Archived Vendor Access Evidence",
    relyingParty: "Vendor Risk Committee",
    intendedUse: "CONTRACTUAL_DECISION",
    state: "VERIFIED_CLOSED",
    trigger: "POST_CLOSURE_CONFIRMATION",
    auditedBy: "TA-14 Post-Closure Audit Service",
    initiatedAt: "2026-08-09T15:10:00.000Z",
    completedAt: "2026-08-09T15:42:00.000Z",
    closureStateObserved: "CLOSED",
    certificateStateObserved: "PUBLISHED",
    verificationStateObserved: "VALID",
    finalityStateObserved: "FINAL",
    relianceDirectiveObserved: "CURRENT_RELIANCE",
    checks: [
      {
        label: "Original reliance receipt no longer active",
        state: "PASS",
        evidence: "TA14-FCR-000008 state CLOSED",
      },
      {
        label: "Monitoring process terminated",
        state: "PASS",
        evidence: "TA14-FCRM-000005 closed",
      },
      {
        label: "No downstream reuse detected",
        state: "PASS",
        evidence: "Registry and execution scan complete",
      },
      {
        label: "Residual obligations preserved",
        state: "PASS",
        evidence: "Closure package TA14-FCRC-000004",
      },
      {
        label: "Post-closure prohibitions acknowledged",
        state: "PASS",
        evidence: "Relying-party confirmation",
      },
    ],
    downstreamFindings: [],
    correctiveActions: [],
    residualObligations: [
      "Preserve closure and audit receipts.",
      "Require a new verification and reliance receipt for any future use.",
    ],
    auditStatement:
      "The reliance authority is verified closed. No unauthorized post-closure use was detected.",
    auditReceiptId: "TA14-FCRCA-RCPT-000003",
    auditDigest:
      "sha256:b719a7edc1fd6600204cd27f58a65f02b3588b18c2d55492aa62d881992e5509",
  },
  {
    auditId: "TA14-FCRCA-000004",
    closureId: "TA14-FCRC-000005",
    relianceReceiptId: "TA14-FCR-000009",
    monitorId: "TA14-FCRM-000007",
    certificateId: "TA14-FCERT-000012",
    verificationId: "TA14-FCV-000015",
    recordId: "TA14-AR-2026-000132",
    recordTitle: "Expired Demonstration Upload",
    relyingParty: "Registry Publisher",
    intendedUse: "PUBLIC_DISCLOSURE",
    state: "VERIFIED_CLOSED",
    trigger: "CERTIFICATE_CHANGE",
    auditedBy: "TA-14 Post-Closure Audit Service",
    initiatedAt: "2026-07-18T12:00:00.000Z",
    completedAt: "2026-07-18T12:21:00.000Z",
    closureStateObserved: "CLOSED",
    certificateStateObserved: "SUSPENDED",
    verificationStateObserved: "SUSPENDED",
    finalityStateObserved: "REOPENED",
    relianceDirectiveObserved: "DO_NOT_RELY",
    checks: [
      {
        label: "Publication route disabled",
        state: "PASS",
        evidence: "Registry publication block active",
      },
      {
        label: "Reliance receipt remains declined",
        state: "PASS",
        evidence: "TA14-FCR-000009 state DECLINED",
      },
      {
        label: "No public disclosure detected",
        state: "PASS",
        evidence: "Publication audit complete",
      },
      {
        label: "Suspended certificate not reused",
        state: "PASS",
        evidence: "No downstream receipt references",
      },
    ],
    downstreamFindings: [],
    correctiveActions: [],
    residualObligations: [
      "Continue monitoring until a superseding certificate is issued.",
      "Reject reuse of TA14-FCERT-000012.",
    ],
    auditStatement:
      "The closed reliance request remains inactive and the suspended certificate has not been reused.",
    auditReceiptId: "TA14-FCRCA-RCPT-000004",
    auditDigest:
      "sha256:67d78fb80f7e39073b014b79c4fbcaeea879071bcbb2b58f3956af3cadb36fac",
  },
  {
    auditId: "TA14-FCRCA-000005",
    closureId: "TA14-FCRC-000006",
    relianceReceiptId: "TA14-FCR-000007",
    monitorId: "TA14-FCRM-000006",
    certificateId: "TA14-FCERT-000010",
    verificationId: "TA14-FCV-000013",
    recordId: "TA14-AR-2026-000148",
    recordTitle: "Temporary Training Demonstration Record",
    relyingParty: "Training Governance Team",
    intendedUse: "INTERNAL_REVIEW",
    state: "PARTIAL_FAILURE",
    trigger: "DOWNSTREAM_USE_DETECTED",
    auditedBy: "TA-14 Post-Closure Audit Service",
    initiatedAt: "2026-08-18T11:05:00.000Z",
    completedAt: "2026-08-18T11:33:00.000Z",
    closureStateObserved: "PENDING_CONFIRMATION",
    certificateStateObserved: "ISSUED",
    verificationStateObserved: "VALID",
    finalityStateObserved: "CURRENT",
    relianceDirectiveObserved: "CURRENT_RELIANCE",
    checks: [
      {
        label: "Original reliance receipt no longer active",
        state: "PASS",
        evidence: "TA14-FCR-000007 expired",
      },
      {
        label: "Relying-party confirmation complete",
        state: "UNKNOWN",
        evidence: "Confirmation pending",
      },
      {
        label: "No post-expiry use detected",
        state: "FAIL",
        evidence: "One internal review event occurred after expiry",
      },
      {
        label: "External disclosure absent",
        state: "PASS",
        evidence: "No external route detected",
      },
    ],
    downstreamFindings: [
      "One internal review event occurred 3 hours after the reliance receipt expired.",
      "No public disclosure or execution occurred.",
    ],
    correctiveActions: [
      "Suspend all use under TA14-FCR-000007.",
      "Obtain relying-party acknowledgment.",
      "Create a new verification and reliance request before renewed review.",
      "Preserve the post-expiry event as a nonconforming reliance occurrence.",
    ],
    residualObligations: [
      "Complete closure confirmation.",
      "Resolve the nonconforming post-expiry use.",
    ],
    auditStatement:
      "Closure cannot yet be verified. A limited post-expiry use was detected and requires remediation before final closure.",
    auditReceiptId: "TA14-FCRCA-RCPT-000005",
    auditDigest:
      "sha256:6ab503905fce9b8fd27db326ccf729cf70e56ea9c018bece82f5e1ea6996dc33",
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

export default function FinalityCertificateRelianceClosureAuditPage() {
  const [records, setRecords] = useState(initialAudits);
  const [selectedId, setSelectedId] = useState(initialAudits[0].auditId);
  const [query, setQuery] = useState("");
  const [stateFilter, setStateFilter] = useState<AuditState | "ALL">("ALL");
  const [triggerFilter, setTriggerFilter] = useState<AuditTrigger | "ALL">("ALL");
  const [copied, setCopied] = useState(false);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return records.filter((record) => {
      const matchesQuery =
        !needle ||
        [
          record.auditId,
          record.closureId,
          record.relianceReceiptId,
          record.monitorId,
          record.certificateId,
          record.verificationId,
          record.recordId,
          record.recordTitle,
          record.relyingParty,
          record.intendedUse,
          record.state,
          record.trigger,
          record.auditStatement,
          ...record.downstreamFindings,
          ...record.correctiveActions,
          ...record.residualObligations,
        ]
          .join(" ")
          .toLowerCase()
          .includes(needle);

      return (
        matchesQuery &&
        (stateFilter === "ALL" || record.state === stateFilter) &&
        (triggerFilter === "ALL" || record.trigger === triggerFilter)
      );
    });
  }, [query, records, stateFilter, triggerFilter]);

  const selected =
    records.find((record) => record.auditId === selectedId) ??
    filtered[0] ??
    records[0];

  const failedChecks = selected.checks.filter(
    (check) => check.state === "FAIL",
  );
  const unknownChecks = selected.checks.filter(
    (check) => check.state === "UNKNOWN",
  );

  const metrics = useMemo(
    () => ({
      verified: records.filter((item) => item.state === "VERIFIED_CLOSED").length,
      partial: records.filter((item) => item.state === "PARTIAL_FAILURE").length,
      failed: records.filter((item) => item.state === "FAILED").length,
      reopened: records.filter((item) => item.state === "REOPENED").length,
    }),
    [records],
  );

  const auditPackage = {
    schema: "TA14_FINALITY_CERTIFICATE_RELIANCE_CLOSURE_AUDIT_REPORT_V1",
    generatedAt: new Date().toISOString(),
    audit: selected,
    evaluation: {
      passedChecks: selected.checks.filter((check) => check.state === "PASS")
        .length,
      failedChecks: failedChecks.length,
      unknownChecks: unknownChecks.length,
      closureVerified:
        failedChecks.length === 0 &&
        unknownChecks.length === 0 &&
        selected.closureStateObserved === "CLOSED",
      remediationRequired:
        failedChecks.length > 0 || selected.downstreamFindings.length > 0,
    },
    governance: {
      closurePackageBound: true,
      relianceReceiptBound: true,
      monitorBound: true,
      downstreamUseChecked: true,
      certificateStateObserved: true,
      finalityStateObserved: true,
      residualObligationsPreserved: true,
      correctiveActionsPreserved: true,
    },
    limitation:
      "Post-closure audit verifies only the observed period, systems, and evidence sources. Later-discovered downstream use, dispute, reopening, or certificate-state changes may require a new audit or reopened closure.",
  };

  function runAudit() {
    let nextState: AuditState = "VERIFIED_CLOSED";
    if (failedChecks.length > 0) {
      nextState =
        selected.downstreamFindings.length > 0 ? "PARTIAL_FAILURE" : "FAILED";
    } else if (unknownChecks.length > 0) {
      nextState = "IN_REVIEW";
    }

    setRecords((items) =>
      items.map((item) =>
        item.auditId === selected.auditId
          ? {
              ...item,
              state: nextState,
              completedAt: new Date().toISOString(),
              auditStatement:
                nextState === "VERIFIED_CLOSED"
                  ? "The reliance authority is verified closed and no unauthorized post-closure use was detected."
                  : nextState === "IN_REVIEW"
                    ? "The post-closure audit remains open because one or more checks are unresolved."
                    : "Closure verification failed or partially failed and corrective action is required.",
              auditDigest: makeDigest(
                JSON.stringify({
                  auditId: item.auditId,
                  closureId: item.closureId,
                  checks: item.checks,
                  findings: item.downstreamFindings,
                  correctiveActions: item.correctiveActions,
                  nextState,
                }),
              ),
            }
          : item,
      ),
    );
  }

  async function copyPackage() {
    await navigator.clipboard.writeText(JSON.stringify(auditPackage, null, 2));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <main className="audit-page">
      <style>{`
        * { box-sizing: border-box; }

        .audit-page {
          min-height: calc(100vh - 68px);
          padding: 48px 0 110px;
          color: #edf6ff;
        }

        .audit-wrap {
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
            radial-gradient(circle at 85% 7%, rgba(255, 78, 107, .15), transparent 28%),
            radial-gradient(circle at 14% 0%, rgba(72, 223, 255, .17), transparent 32%),
            linear-gradient(135deg, rgba(14, 30, 48, .97), rgba(5, 11, 20, .98));
          box-shadow: 0 38px 120px rgba(0,0,0,.35);
        }

        .hero::after {
          content: "AUDIT";
          position: absolute;
          right: -10px;
          bottom: -42px;
          color: rgba(255,255,255,.025);
          font-size: clamp(4.8rem, 12vw, 10rem);
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
          background: linear-gradient(100deg, #fff, #8ceaff 50%, #ff4e6b);
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
          background: linear-gradient(100deg, #56e6ff, #ff4e6b);
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

        .audit-row {
          width: 100%;
          padding: 20px 21px;
          border: 0;
          border-bottom: 1px solid rgba(132, 177, 216, .1);
          color: inherit;
          background: transparent;
          text-align: left;
          cursor: pointer;
        }

        .audit-row:last-child { border-bottom: 0; }

        .audit-row.active {
          background: linear-gradient(90deg, rgba(84, 232, 255, .09), rgba(255, 78, 107, .025));
          box-shadow: inset 3px 0 0 #56e6ff;
        }

        .row-top, .meta, .detail-top {
          display: flex;
          align-items: center;
          gap: 9px;
          flex-wrap: wrap;
        }

        .row-top { justify-content: space-between; }

        .audit-title { font-weight: 900; }

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

        .pill.VERIFIED_CLOSED, .pill.PASS {
          color: #54efae;
          border-color: rgba(84, 239, 174, .3);
        }

        .pill.PENDING, .pill.IN_REVIEW, .pill.PARTIAL_FAILURE, .pill.UNKNOWN, .pill.WAIVED {
          color: #ffd27b;
          border-color: rgba(255, 210, 123, .3);
        }

        .pill.FAILED, .pill.REOPENED, .pill.FAIL {
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

        .box, .check {
          margin-top: 17px;
          padding: 16px;
          border: 1px solid rgba(132, 177, 216, .12);
          border-radius: 17px;
          background: rgba(2, 9, 16, .52);
        }

        .box strong, .check strong {
          display: block;
          color: #dce8f3;
          font-size: .76rem;
          letter-spacing: .07em;
          text-transform: uppercase;
        }

        .box p, .check p {
          margin: 10px 0 0;
          font-size: .8rem;
        }

        .box ul {
          margin: 10px 0 0;
          padding-left: 18px;
          color: #9fb1c1;
          line-height: 1.65;
        }

        .check {
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 12px;
          align-items: start;
        }

        .notice {
          margin-top: 18px;
          padding: 16px 18px;
          border-left: 3px solid #ff4e6b;
          border-radius: 0 13px 13px 0;
          color: #91a8bd;
          background: rgba(255, 78, 107, .045);
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
          .audit-wrap { width: min(100% - 24px, 1420px); }
          .audit-page { padding-top: 24px; }
          .hero { padding: 28px 22px 34px; border-radius: 24px; }
          .toolbar { grid-template-columns: 1fr; }
          .metrics { grid-template-columns: 1fr 1fr; }
          .kv { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="audit-wrap">
        <section className="hero">
          <div className="hero-content">
            <p className="eyebrow">
              TA-14 Exchange · Reliance Closure Verification
            </p>
            <h1>
              Closed is a claim.
              <br />
              <span className="gradient">Audit whether reliance actually stopped.</span>
            </h1>
            <p className="hero-copy">
              Verify that the reliance receipt ended, monitoring ceased,
              prohibited post-closure use did not occur, residual obligations
              remain preserved, and any nonconforming downstream use is
              captured, remediated, and prevented from disappearing into a
              closure label.
            </p>

            <div className="hero-actions">
              <Link
                className="button"
                href="/workspace/records/disposition/finality/certificates/reliance/closure"
              >
                Open Reliance Closure
              </Link>
              <Link
                className="button-secondary"
                href="/workspace/records/disposition/finality/certificates/reliance/monitoring"
              >
                Open Reliance Monitoring
              </Link>
              <Link
                className="button-secondary"
                href="/workspace/records/disposition/finality/certificates/verify"
              >
                Verify Certificate
              </Link>
            </div>
          </div>
        </section>

        <section className="metrics">
          <article className="metric">
            <strong>{metrics.verified}</strong>
            <span>Verified closed</span>
          </article>
          <article className="metric">
            <strong>{metrics.partial}</strong>
            <span>Partial failure</span>
          </article>
          <article className="metric">
            <strong>{metrics.failed}</strong>
            <span>Failed</span>
          </article>
          <article className="metric">
            <strong>{metrics.reopened}</strong>
            <span>Reopened</span>
          </article>
        </section>

        <section className="toolbar">
          <input
            aria-label="Search closure audits"
            placeholder="Search audit, closure, reliance receipt, certificate, party, finding, action, or statement"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />

          <select
            aria-label="Filter audit state"
            value={stateFilter}
            onChange={(event) =>
              setStateFilter(event.target.value as AuditState | "ALL")
            }
          >
            <option value="ALL">All states</option>
            <option value="PENDING">PENDING</option>
            <option value="IN_REVIEW">IN_REVIEW</option>
            <option value="VERIFIED_CLOSED">VERIFIED_CLOSED</option>
            <option value="PARTIAL_FAILURE">PARTIAL_FAILURE</option>
            <option value="FAILED">FAILED</option>
            <option value="REOPENED">REOPENED</option>
            <option value="WAIVED">WAIVED</option>
          </select>

          <select
            aria-label="Filter audit trigger"
            value={triggerFilter}
            onChange={(event) =>
              setTriggerFilter(event.target.value as AuditTrigger | "ALL")
            }
          >
            <option value="ALL">All triggers</option>
            <option value="SCHEDULED">SCHEDULED</option>
            <option value="POST_CLOSURE_CONFIRMATION">
              POST_CLOSURE_CONFIRMATION
            </option>
            <option value="DOWNSTREAM_USE_DETECTED">
              DOWNSTREAM_USE_DETECTED
            </option>
            <option value="CERTIFICATE_CHANGE">
              CERTIFICATE_CHANGE
            </option>
            <option value="DISPUTE">DISPUTE</option>
            <option value="MANUAL">MANUAL</option>
          </select>
        </section>

        <section className="grid">
          <div className="panel">
            <div className="panel-head">
              <strong>Post-closure audits</strong>
              <span>{filtered.length} visible</span>
            </div>

            {filtered.length ? (
              filtered.map((record) => (
                <button
                  className={`audit-row ${
                    selected.auditId === record.auditId ? "active" : ""
                  }`}
                  key={record.auditId}
                  type="button"
                  onClick={() => setSelectedId(record.auditId)}
                >
                  <div className="row-top">
                    <span className="audit-title">{record.recordTitle}</span>
                    <span className={`pill ${record.state}`}>{record.state}</span>
                  </div>
                  <div className="mono">{record.auditId}</div>
                  <div className="meta">
                    <span>{record.trigger}</span>
                    <span>{record.relyingParty}</span>
                    <span>{record.closureId}</span>
                    <span>{formatDate(record.completedAt)}</span>
                  </div>
                </button>
              ))
            ) : (
              <div className="empty">
                No post-closure audit matches the current filters.
              </div>
            )}
          </div>

          <aside className="panel detail">
            <div className="detail-top">
              <span className={`pill ${selected.state}`}>{selected.state}</span>
              <span className="pill">{selected.trigger}</span>
              <span className="pill">{selected.intendedUse}</span>
            </div>

            <h2>{selected.recordTitle}</h2>
            <div className="mono">{selected.auditId}</div>

            <div className="result-banner">
              <h3>{selected.relyingParty}</h3>
              <p>{selected.auditStatement}</p>
            </div>

            <dl className="kv">
              <dt>Closure ID</dt>
              <dd>{selected.closureId}</dd>

              <dt>Reliance receipt</dt>
              <dd>{selected.relianceReceiptId}</dd>

              <dt>Monitor ID</dt>
              <dd>{selected.monitorId}</dd>

              <dt>Certificate ID</dt>
              <dd>{selected.certificateId}</dd>

              <dt>Verification ID</dt>
              <dd>{selected.verificationId}</dd>

              <dt>Record ID</dt>
              <dd>{selected.recordId}</dd>

              <dt>Closure state</dt>
              <dd>{selected.closureStateObserved}</dd>

              <dt>Certificate state</dt>
              <dd>{selected.certificateStateObserved}</dd>

              <dt>Verification state</dt>
              <dd>{selected.verificationStateObserved}</dd>

              <dt>Finality state</dt>
              <dd>{selected.finalityStateObserved}</dd>

              <dt>Reliance directive</dt>
              <dd>{selected.relianceDirectiveObserved}</dd>

              <dt>Audited by</dt>
              <dd>{selected.auditedBy}</dd>

              <dt>Initiated</dt>
              <dd>{formatDate(selected.initiatedAt)}</dd>

              <dt>Completed</dt>
              <dd>{formatDate(selected.completedAt)}</dd>

              <dt>Audit receipt</dt>
              <dd>{selected.auditReceiptId}</dd>

              <dt>Audit digest</dt>
              <dd>{selected.auditDigest}</dd>
            </dl>

            {selected.checks.map((check) => (
              <div className="check" key={check.label}>
                <span className={`pill ${check.state}`}>{check.state}</span>
                <div>
                  <strong>{check.label}</strong>
                  <p>{check.evidence}</p>
                </div>
              </div>
            ))}

            <div className="box">
              <strong>Downstream findings</strong>
              {selected.downstreamFindings.length ? (
                <ul>
                  {selected.downstreamFindings.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p>No downstream nonconforming use was detected.</p>
              )}
            </div>

            <div className="box">
              <strong>Corrective actions</strong>
              {selected.correctiveActions.length ? (
                <ul>
                  {selected.correctiveActions.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p>No corrective action is currently required.</p>
              )}
            </div>

            <div className="box">
              <strong>Residual obligations</strong>
              <ul>
                {selected.residualObligations.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="detail-actions">
              <button className="button" type="button" onClick={runAudit}>
                Run closure audit
              </button>

              <button
                className="small-button"
                type="button"
                onClick={() =>
                  setRecords((items) =>
                    items.map((item) =>
                      item.auditId === selected.auditId
                        ? {
                            ...item,
                            state: "REOPENED",
                            auditStatement:
                              "Closure has been reopened because post-closure evidence requires renewed review.",
                          }
                        : item,
                    ),
                  )
                }
              >
                Reopen closure
              </button>

              <button
                className="small-button"
                type="button"
                onClick={() =>
                  setRecords((items) =>
                    items.map((item) =>
                      item.auditId === selected.auditId
                        ? {
                            ...item,
                            state: "WAIVED",
                            auditStatement:
                              "Further audit activity was waived by documented authority. Existing findings remain preserved.",
                          }
                        : item,
                    ),
                  )
                }
              >
                Waive further audit
              </button>

              <button
                className="small-button"
                type="button"
                onClick={copyPackage}
              >
                {copied ? "Copied" : "Copy audit report"}
              </button>

              <button
                className="small-button"
                type="button"
                onClick={() =>
                  downloadJson(
                    `${selected.auditId.toLowerCase()}-closure-audit.json`,
                    auditPackage,
                  )
                }
              >
                Download report
              </button>
            </div>

            <div className="notice">
              Closure verification is independent from closure creation. A
              closure receipt may exist while post-closure conduct still fails
              the governing conditions. The audit must govern what happened
              after the claim of closure.
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
