"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type MonitoringState =
  | "ACTIVE"
  | "DUE"
  | "REVALIDATING"
  | "REVALIDATED"
  | "SUSPENDED"
  | "EXPIRED"
  | "REVOKED";

type TriggerType =
  | "SCHEDULED"
  | "CERTIFICATE_STATE_CHANGE"
  | "NEW_APPEAL"
  | "REOPENING"
  | "EXPIRY_WINDOW"
  | "MANUAL_REVIEW";

type CheckState = "PASS" | "FAIL" | "UNKNOWN";

type RelianceMonitor = {
  monitorId: string;
  relianceReceiptId: string;
  certificateId: string;
  verificationId: string;
  recordId: string;
  recordTitle: string;
  relyingParty: string;
  intendedUse: string;
  state: MonitoringState;
  trigger: TriggerType;
  monitoredBy: string;
  createdAt: string;
  lastCheckedAt: string;
  nextCheckAt: string;
  relianceExpiresAt: string;
  observedCertificateState: string;
  observedVerificationState: string;
  observedFinalityState: string;
  observedRelianceDirective: string;
  priorAuthorizedState: string;
  revalidationChecks: {
    label: string;
    state: CheckState;
    evidence: string;
  }[];
  changesDetected: string[];
  requiredActions: string[];
  revalidationStatement: string;
  revalidationReceiptId: string;
  receiptDigest: string;
};

const initialMonitors: RelianceMonitor[] = [
  {
    monitorId: "TA14-FCRM-000005",
    relianceReceiptId: "TA14-FCR-000008",
    certificateId: "TA14-FCERT-000011",
    verificationId: "TA14-FCV-000014",
    recordId: "TA14-AR-2026-000126",
    recordTitle: "Archived Vendor Access Evidence",
    relyingParty: "Vendor Risk Committee",
    intendedUse: "CONTRACTUAL_DECISION",
    state: "ACTIVE",
    trigger: "SCHEDULED",
    monitoredBy: "TA-14 Reliance Monitoring Service",
    createdAt: "2026-07-17T20:36:00.000Z",
    lastCheckedAt: "2026-07-17T20:41:00.000Z",
    nextCheckAt: "2026-08-17T20:31:00.000Z",
    relianceExpiresAt: "2026-10-17T20:31:00.000Z",
    observedCertificateState: "PUBLISHED",
    observedVerificationState: "VALID",
    observedFinalityState: "FINAL",
    observedRelianceDirective: "CURRENT_RELIANCE",
    priorAuthorizedState: "AUTHORIZED",
    revalidationChecks: [
      {
        label: "Certificate remains valid",
        state: "PASS",
        evidence: "TA14-FCERT-000011 remains PUBLISHED",
      },
      {
        label: "No appeal or reopening detected",
        state: "PASS",
        evidence: "Registry scan complete",
      },
      {
        label: "Reliance receipt remains unexpired",
        state: "PASS",
        evidence: "Expires 2026-10-17",
      },
      {
        label: "Intended use remains unchanged",
        state: "PASS",
        evidence: "CONTRACTUAL_DECISION",
      },
    ],
    changesDetected: [],
    requiredActions: [
      "Re-verify before contractual execution.",
      "Suspend immediately if the certificate state changes.",
    ],
    revalidationStatement:
      "Reliance remains active and within the originally authorized scope.",
    revalidationReceiptId: "TA14-FCRM-RCPT-000005",
    receiptDigest:
      "sha256:61c2a50a7648d7f82f7546e35de5bd86da8e7c98011b21e91fbe88dd27d91ab8",
  },
  {
    monitorId: "TA14-FCRM-000006",
    relianceReceiptId: "TA14-FCR-000007",
    certificateId: "TA14-FCERT-000010",
    verificationId: "TA14-FCV-000013",
    recordId: "TA14-AR-2026-000148",
    recordTitle: "Temporary Training Demonstration Record",
    relyingParty: "Training Governance Team",
    intendedUse: "INTERNAL_REVIEW",
    state: "DUE",
    trigger: "EXPIRY_WINDOW",
    monitoredBy: "TA-14 Reliance Monitoring Service",
    createdAt: "2026-07-17T20:38:00.000Z",
    lastCheckedAt: "2026-07-17T20:40:00.000Z",
    nextCheckAt: "2026-08-10T20:22:00.000Z",
    relianceExpiresAt: "2026-08-17T20:22:00.000Z",
    observedCertificateState: "ISSUED",
    observedVerificationState: "VALID",
    observedFinalityState: "CURRENT",
    observedRelianceDirective: "CURRENT_RELIANCE",
    priorAuthorizedState: "CONDITIONAL",
    revalidationChecks: [
      {
        label: "Certificate remains valid",
        state: "PASS",
        evidence: "TA14-FCERT-000010 remains ISSUED",
      },
      {
        label: "Certificate publication completed",
        state: "UNKNOWN",
        evidence: "Publication pending",
      },
      {
        label: "Reliance receipt remains unexpired",
        state: "PASS",
        evidence: "Expires 2026-08-17",
      },
      {
        label: "Use remains internal",
        state: "PASS",
        evidence: "INTERNAL_REVIEW",
      },
    ],
    changesDetected: [
      "Reliance receipt entered the configured expiry window.",
    ],
    requiredActions: [
      "Revalidate before 2026-08-17.",
      "Do not expand use beyond internal review.",
      "Issue a new receipt if external disclosure is requested.",
    ],
    revalidationStatement:
      "Conditional reliance remains available, but revalidation is due before expiry.",
    revalidationReceiptId: "TA14-FCRM-RCPT-000006",
    receiptDigest:
      "sha256:87947d758a9f24e52f3df9ca3e31343905c7303df8db0b38a76e670218ac3772",
  },
  {
    monitorId: "TA14-FCRM-000007",
    relianceReceiptId: "TA14-FCR-000009",
    certificateId: "TA14-FCERT-000012",
    verificationId: "TA14-FCV-000015",
    recordId: "TA14-AR-2026-000132",
    recordTitle: "Expired Demonstration Upload",
    relyingParty: "Registry Publisher",
    intendedUse: "PUBLIC_DISCLOSURE",
    state: "SUSPENDED",
    trigger: "CERTIFICATE_STATE_CHANGE",
    monitoredBy: "TA-14 Reliance Monitoring Service",
    createdAt: "2026-07-17T20:39:00.000Z",
    lastCheckedAt: "2026-07-17T20:42:00.000Z",
    nextCheckAt: "2026-07-18T20:42:00.000Z",
    relianceExpiresAt: "NONE",
    observedCertificateState: "SUSPENDED",
    observedVerificationState: "SUSPENDED",
    observedFinalityState: "REOPENED",
    observedRelianceDirective: "DO_NOT_RELY",
    priorAuthorizedState: "DECLINED",
    revalidationChecks: [
      {
        label: "Certificate remains valid",
        state: "FAIL",
        evidence: "Certificate state SUSPENDED",
      },
      {
        label: "Reliance directive permits use",
        state: "FAIL",
        evidence: "DO_NOT_RELY",
      },
      {
        label: "Reopened verification complete",
        state: "FAIL",
        evidence: "PENDING",
      },
    ],
    changesDetected: [
      "Finality state is REOPENED.",
      "Certificate is SUSPENDED.",
      "Reliance directive is DO_NOT_RELY.",
    ],
    requiredActions: [
      "Maintain suspension.",
      "Do not publish or execute based on this certificate.",
      "Wait for reclosure and a superseding valid certificate.",
    ],
    revalidationStatement:
      "Reliance remains unavailable. No revalidation may authorize use while the certificate remains suspended.",
    revalidationReceiptId: "TA14-FCRM-RCPT-000007",
    receiptDigest:
      "sha256:8138d9d9d52cbc62bc696bf0de2479bb247644b9546a542a248d7f00ead56ad2",
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

export default function FinalityCertificateRelianceMonitoringPage() {
  const [records, setRecords] = useState(initialMonitors);
  const [selectedId, setSelectedId] = useState(initialMonitors[0].monitorId);
  const [query, setQuery] = useState("");
  const [stateFilter, setStateFilter] = useState<MonitoringState | "ALL">("ALL");
  const [triggerFilter, setTriggerFilter] = useState<TriggerType | "ALL">("ALL");
  const [copied, setCopied] = useState(false);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return records.filter((record) => {
      const matchesQuery =
        !needle ||
        [
          record.monitorId,
          record.relianceReceiptId,
          record.certificateId,
          record.verificationId,
          record.recordId,
          record.recordTitle,
          record.relyingParty,
          record.intendedUse,
          record.state,
          record.trigger,
          record.observedCertificateState,
          record.observedFinalityState,
          record.observedRelianceDirective,
          record.revalidationStatement,
          ...record.changesDetected,
          ...record.requiredActions,
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
    records.find((record) => record.monitorId === selectedId) ??
    filtered[0] ??
    records[0];

  const failedChecks = selected.revalidationChecks.filter(
    (check) => check.state === "FAIL",
  );
  const unknownChecks = selected.revalidationChecks.filter(
    (check) => check.state === "UNKNOWN",
  );

  const metrics = useMemo(
    () => ({
      active: records.filter((item) => item.state === "ACTIVE").length,
      due: records.filter((item) => item.state === "DUE").length,
      suspended: records.filter((item) => item.state === "SUSPENDED").length,
      revalidated: records.filter((item) => item.state === "REVALIDATED").length,
    }),
    [records],
  );

  const monitoringPackage = {
    schema: "TA14_FINALITY_CERTIFICATE_RELIANCE_REVALIDATION_REPORT_V1",
    generatedAt: new Date().toISOString(),
    monitor: selected,
    evaluation: {
      passedChecks: selected.revalidationChecks.filter(
        (check) => check.state === "PASS",
      ).length,
      failedChecks: failedChecks.length,
      unknownChecks: unknownChecks.length,
      continuedRelianceEligible:
        failedChecks.length === 0 &&
        selected.observedRelianceDirective !== "DO_NOT_RELY",
      conditionalOnly:
        failedChecks.length === 0 && unknownChecks.length > 0,
    },
    governance: {
      originalRelianceReceiptBound: true,
      currentCertificateStateObserved: true,
      currentVerificationStateObserved: true,
      currentFinalityStateObserved: true,
      expiryWindowObserved: true,
      changesPreserved: true,
      revalidationReceiptIssued: true,
    },
    limitation:
      "Revalidation confirms only the observed state at the time of the monitoring event. Continued reliance remains subject to later certificate changes, appeal, reopening, expiry, revocation, supersession, or intended-use drift.",
  };

  function runRevalidation() {
    const now = new Date().toISOString();

    let nextState: MonitoringState = "REVALIDATED";
    if (
      failedChecks.length > 0 ||
      selected.observedRelianceDirective === "DO_NOT_RELY"
    ) {
      nextState = "SUSPENDED";
    } else if (unknownChecks.length > 0) {
      nextState = "DUE";
    }

    setRecords((items) =>
      items.map((item) =>
        item.monitorId === selected.monitorId
          ? {
              ...item,
              state: nextState,
              lastCheckedAt: now,
              revalidationStatement:
                nextState === "REVALIDATED"
                  ? "Reliance has been revalidated for the original party, intended use, conditions, and expiry window."
                  : nextState === "SUSPENDED"
                    ? "Reliance is suspended because the current governing state does not permit continued use."
                    : "Revalidation remains due because one or more governing conditions are unresolved.",
              revalidationReceiptId:
                item.revalidationReceiptId === "PENDING"
                  ? `TA14-FCRM-RCPT-${Math.floor(
                      100000 + Math.random() * 900000,
                    )}`
                  : item.revalidationReceiptId,
              receiptDigest: makeDigest(
                JSON.stringify({
                  monitorId: item.monitorId,
                  relianceReceiptId: item.relianceReceiptId,
                  certificateId: item.certificateId,
                  observedCertificateState: item.observedCertificateState,
                  observedFinalityState: item.observedFinalityState,
                  revalidationChecks: item.revalidationChecks,
                  nextState,
                }),
              ),
            }
          : item,
      ),
    );
  }

  async function copyPackage() {
    await navigator.clipboard.writeText(
      JSON.stringify(monitoringPackage, null, 2),
    );
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <main className="monitor-page">
      <style>{`
        * { box-sizing: border-box; }

        .monitor-page {
          min-height: calc(100vh - 68px);
          padding: 48px 0 110px;
          color: #edf6ff;
        }

        .monitor-wrap {
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
            radial-gradient(circle at 85% 7%, rgba(154, 113, 255, .16), transparent 28%),
            radial-gradient(circle at 14% 0%, rgba(72, 223, 255, .17), transparent 32%),
            linear-gradient(135deg, rgba(14, 30, 48, .97), rgba(5, 11, 20, .98));
          box-shadow: 0 38px 120px rgba(0,0,0,.35);
        }

        .hero::after {
          content: "REVALIDATE";
          position: absolute;
          right: -10px;
          bottom: -42px;
          color: rgba(255,255,255,.025);
          font-size: clamp(3.4rem, 8vw, 8rem);
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
          background: linear-gradient(100deg, #fff, #8ceaff 50%, #9a71ff);
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
          background: linear-gradient(100deg, #56e6ff, #9a71ff);
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
          grid-template-columns: minmax(220px, 1fr) 220px 250px;
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

        .monitor-row {
          width: 100%;
          padding: 20px 21px;
          border: 0;
          border-bottom: 1px solid rgba(132, 177, 216, .1);
          color: inherit;
          background: transparent;
          text-align: left;
          cursor: pointer;
        }

        .monitor-row:last-child { border-bottom: 0; }

        .monitor-row.active {
          background: linear-gradient(90deg, rgba(84, 232, 255, .09), rgba(154, 113, 255, .025));
          box-shadow: inset 3px 0 0 #56e6ff;
        }

        .row-top, .meta, .detail-top {
          display: flex;
          align-items: center;
          gap: 9px;
          flex-wrap: wrap;
        }

        .row-top { justify-content: space-between; }

        .monitor-title { font-weight: 900; }

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

        .pill.ACTIVE, .pill.REVALIDATED, .pill.PASS {
          color: #54efae;
          border-color: rgba(84, 239, 174, .3);
        }

        .pill.DUE, .pill.REVALIDATING, .pill.UNKNOWN, .pill.EXPIRED {
          color: #ffd27b;
          border-color: rgba(255, 210, 123, .3);
        }

        .pill.SUSPENDED, .pill.REVOKED, .pill.FAIL {
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
          border-left: 3px solid #9a71ff;
          border-radius: 0 13px 13px 0;
          color: #91a8bd;
          background: rgba(154, 113, 255, .045);
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
          .monitor-wrap { width: min(100% - 24px, 1420px); }
          .monitor-page { padding-top: 24px; }
          .hero { padding: 28px 22px 34px; border-radius: 24px; }
          .toolbar { grid-template-columns: 1fr; }
          .metrics { grid-template-columns: 1fr 1fr; }
          .kv { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="monitor-wrap">
        <section className="hero">
          <div className="hero-content">
            <p className="eyebrow">
              TA-14 Exchange · Reliance Monitoring & Revalidation
            </p>
            <h1>
              Reliance must remain valid.
              <br />
              <span className="gradient">Not merely begin valid.</span>
            </h1>
            <p className="hero-copy">
              Continuously re-evaluate reliance receipts against certificate
              state, verification state, finality, reopening, appeal, expiry,
              intended-use drift, and changed limitations—then preserve every
              continued, conditional, suspended, expired, or revoked decision.
            </p>

            <div className="hero-actions">
              <Link
                className="button"
                href="/workspace/records/disposition/finality/certificates/reliance"
              >
                Open Reliance Desk
              </Link>
              <Link
                className="button-secondary"
                href="/workspace/records/disposition/finality/certificates/verify"
              >
                Verify Certificate
              </Link>
              <Link
                className="button-secondary"
                href="/workspace/records/disposition/finality"
              >
                Open Finality Resolver
              </Link>
            </div>
          </div>
        </section>

        <section className="metrics">
          <article className="metric">
            <strong>{metrics.active}</strong>
            <span>Active</span>
          </article>
          <article className="metric">
            <strong>{metrics.due}</strong>
            <span>Due</span>
          </article>
          <article className="metric">
            <strong>{metrics.suspended}</strong>
            <span>Suspended</span>
          </article>
          <article className="metric">
            <strong>{metrics.revalidated}</strong>
            <span>Revalidated</span>
          </article>
        </section>

        <section className="toolbar">
          <input
            aria-label="Search reliance monitoring"
            placeholder="Search monitor, reliance receipt, certificate, party, trigger, change, action, or statement"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />

          <select
            aria-label="Filter monitoring state"
            value={stateFilter}
            onChange={(event) =>
              setStateFilter(event.target.value as MonitoringState | "ALL")
            }
          >
            <option value="ALL">All states</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="DUE">DUE</option>
            <option value="REVALIDATING">REVALIDATING</option>
            <option value="REVALIDATED">REVALIDATED</option>
            <option value="SUSPENDED">SUSPENDED</option>
            <option value="EXPIRED">EXPIRED</option>
            <option value="REVOKED">REVOKED</option>
          </select>

          <select
            aria-label="Filter monitoring trigger"
            value={triggerFilter}
            onChange={(event) =>
              setTriggerFilter(event.target.value as TriggerType | "ALL")
            }
          >
            <option value="ALL">All triggers</option>
            <option value="SCHEDULED">SCHEDULED</option>
            <option value="CERTIFICATE_STATE_CHANGE">
              CERTIFICATE_STATE_CHANGE
            </option>
            <option value="NEW_APPEAL">NEW_APPEAL</option>
            <option value="REOPENING">REOPENING</option>
            <option value="EXPIRY_WINDOW">EXPIRY_WINDOW</option>
            <option value="MANUAL_REVIEW">MANUAL_REVIEW</option>
          </select>
        </section>

        <section className="grid">
          <div className="panel">
            <div className="panel-head">
              <strong>Reliance monitors</strong>
              <span>{filtered.length} visible</span>
            </div>

            {filtered.length ? (
              filtered.map((record) => (
                <button
                  className={`monitor-row ${
                    selected.monitorId === record.monitorId ? "active" : ""
                  }`}
                  key={record.monitorId}
                  type="button"
                  onClick={() => setSelectedId(record.monitorId)}
                >
                  <div className="row-top">
                    <span className="monitor-title">{record.recordTitle}</span>
                    <span className={`pill ${record.state}`}>{record.state}</span>
                  </div>
                  <div className="mono">{record.monitorId}</div>
                  <div className="meta">
                    <span>{record.trigger}</span>
                    <span>{record.relyingParty}</span>
                    <span>{record.certificateId}</span>
                    <span>{formatDate(record.nextCheckAt)}</span>
                  </div>
                </button>
              ))
            ) : (
              <div className="empty">
                No reliance monitor matches the current filters.
              </div>
            )}
          </div>

          <aside className="panel detail">
            <div className="detail-top">
              <span className={`pill ${selected.state}`}>{selected.state}</span>
              <span className="pill">{selected.trigger}</span>
              <span className="pill">
                {selected.observedRelianceDirective}
              </span>
            </div>

            <h2>{selected.recordTitle}</h2>
            <div className="mono">{selected.monitorId}</div>

            <div className="result-banner">
              <h3>{selected.relyingParty}</h3>
              <p>{selected.revalidationStatement}</p>
            </div>

            <dl className="kv">
              <dt>Reliance receipt</dt>
              <dd>{selected.relianceReceiptId}</dd>

              <dt>Certificate ID</dt>
              <dd>{selected.certificateId}</dd>

              <dt>Verification ID</dt>
              <dd>{selected.verificationId}</dd>

              <dt>Record ID</dt>
              <dd>{selected.recordId}</dd>

              <dt>Intended use</dt>
              <dd>{selected.intendedUse}</dd>

              <dt>Prior authorized state</dt>
              <dd>{selected.priorAuthorizedState}</dd>

              <dt>Certificate state</dt>
              <dd>{selected.observedCertificateState}</dd>

              <dt>Verification state</dt>
              <dd>{selected.observedVerificationState}</dd>

              <dt>Finality state</dt>
              <dd>{selected.observedFinalityState}</dd>

              <dt>Monitored by</dt>
              <dd>{selected.monitoredBy}</dd>

              <dt>Created</dt>
              <dd>{formatDate(selected.createdAt)}</dd>

              <dt>Last checked</dt>
              <dd>{formatDate(selected.lastCheckedAt)}</dd>

              <dt>Next check</dt>
              <dd>{formatDate(selected.nextCheckAt)}</dd>

              <dt>Reliance expires</dt>
              <dd>{formatDate(selected.relianceExpiresAt)}</dd>

              <dt>Revalidation receipt</dt>
              <dd>{selected.revalidationReceiptId}</dd>

              <dt>Receipt digest</dt>
              <dd>{selected.receiptDigest}</dd>
            </dl>

            {selected.revalidationChecks.map((check) => (
              <div className="check" key={check.label}>
                <span className={`pill ${check.state}`}>{check.state}</span>
                <div>
                  <strong>{check.label}</strong>
                  <p>{check.evidence}</p>
                </div>
              </div>
            ))}

            <div className="box">
              <strong>Changes detected</strong>
              {selected.changesDetected.length ? (
                <ul>
                  {selected.changesDetected.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p>No material change was detected.</p>
              )}
            </div>

            <div className="box">
              <strong>Required actions</strong>
              <ul>
                {selected.requiredActions.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="detail-actions">
              <button className="button" type="button" onClick={runRevalidation}>
                Run revalidation
              </button>

              <button
                className="small-button"
                type="button"
                onClick={() =>
                  setRecords((items) =>
                    items.map((item) =>
                      item.monitorId === selected.monitorId
                        ? {
                            ...item,
                            state: "SUSPENDED",
                            revalidationStatement:
                              "Reliance is suspended pending governing-state review.",
                          }
                        : item,
                    ),
                  )
                }
              >
                Suspend reliance
              </button>

              <button
                className="small-button"
                type="button"
                onClick={() =>
                  setRecords((items) =>
                    items.map((item) =>
                      item.monitorId === selected.monitorId
                        ? {
                            ...item,
                            state: "REVOKED",
                            revalidationStatement:
                              "Reliance authority has been revoked and may not be resumed without a new receipt.",
                          }
                        : item,
                    ),
                  )
                }
              >
                Revoke reliance
              </button>

              <button
                className="small-button"
                type="button"
                onClick={copyPackage}
              >
                {copied ? "Copied" : "Copy revalidation report"}
              </button>

              <button
                className="small-button"
                type="button"
                onClick={() =>
                  downloadJson(
                    `${selected.monitorId.toLowerCase()}-revalidation-report.json`,
                    monitoringPackage,
                  )
                }
              >
                Download report
              </button>
            </div>

            <div className="notice">
              Reliance is a continuing governed state. A previously authorized
              use must close when its certificate, verification, finality,
              scope, conditions, or expiry no longer remain admissible.
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
