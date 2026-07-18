"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type ClosureState =
  | "DRAFT"
  | "PENDING_CONFIRMATION"
  | "CLOSED"
  | "PARTIALLY_CLOSED"
  | "DISPUTED"
  | "REOPENED"
  | "VOID";

type ClosureReason =
  | "PURPOSE_COMPLETED"
  | "CERTIFICATE_SUSPENDED"
  | "CERTIFICATE_REVOKED"
  | "RELIANCE_EXPIRED"
  | "SCOPE_CHANGED"
  | "PARTY_WITHDREW"
  | "SUPERSEDED"
  | "OTHER";

type ConfirmationState = "CONFIRMED" | "PENDING" | "DECLINED";

type RelianceClosure = {
  closureId: string;
  relianceReceiptId: string;
  monitorId: string;
  certificateId: string;
  verificationId: string;
  recordId: string;
  recordTitle: string;
  relyingParty: string;
  intendedUse: string;
  state: ClosureState;
  reason: ClosureReason;
  initiatedBy: string;
  initiatedAt: string;
  effectiveAt: string;
  confirmedAt: string;
  priorRelianceState: string;
  finalCertificateState: string;
  finalVerificationState: string;
  finalFinalityState: string;
  finalRelianceDirective: string;
  closureStatement: string;
  completedActions: string[];
  residualObligations: string[];
  prohibitedPostClosureUses: string[];
  confirmations: {
    party: string;
    role: string;
    state: ConfirmationState;
    confirmedAt: string;
    note: string;
  }[];
  evidenceReceipts: string[];
  closureDigest: string;
  reopeningConditions: string[];
};

const initialClosures: RelianceClosure[] = [
  {
    closureId: "TA14-FCRC-000004",
    relianceReceiptId: "TA14-FCR-000008",
    monitorId: "TA14-FCRM-000005",
    certificateId: "TA14-FCERT-000011",
    verificationId: "TA14-FCV-000014",
    recordId: "TA14-AR-2026-000126",
    recordTitle: "Archived Vendor Access Evidence",
    relyingParty: "Vendor Risk Committee",
    intendedUse: "CONTRACTUAL_DECISION",
    state: "CLOSED",
    reason: "PURPOSE_COMPLETED",
    initiatedBy: "TA-14 Reliance Closure Desk",
    initiatedAt: "2026-08-02T16:10:00.000Z",
    effectiveAt: "2026-08-02T16:15:00.000Z",
    confirmedAt: "2026-08-02T17:04:00.000Z",
    priorRelianceState: "AUTHORIZED",
    finalCertificateState: "PUBLISHED",
    finalVerificationState: "VALID",
    finalFinalityState: "FINAL",
    finalRelianceDirective: "CURRENT_RELIANCE",
    closureStatement:
      "The authorized contractual decision was completed. No further reliance remains authorized under the original receipt.",
    completedActions: [
      "Recorded completion of the contractual decision.",
      "Closed the active reliance monitor.",
      "Preserved the certificate and verification state observed at closure.",
      "Notified the relying party that reuse requires a new verification and reliance receipt.",
    ],
    residualObligations: [
      "Preserve the reliance receipt and closure package.",
      "Retain limitations and prohibited uses in all downstream records.",
    ],
    prohibitedPostClosureUses: [
      "Reuse of the original reliance receipt for a later decision.",
      "Transfer of reliance authority to another party.",
      "Representation that reliance remains active.",
    ],
    confirmations: [
      {
        party: "Vendor Risk Committee",
        role: "Relying party",
        state: "CONFIRMED",
        confirmedAt: "2026-08-02T16:58:00.000Z",
        note: "Purpose completed and closure acknowledged.",
      },
      {
        party: "TA-14 Reliance Desk",
        role: "Closure authority",
        state: "CONFIRMED",
        confirmedAt: "2026-08-02T17:04:00.000Z",
        note: "Closure package reviewed and published.",
      },
    ],
    evidenceReceipts: [
      "TA14-FCR-000008",
      "TA14-FCRM-RCPT-000005",
      "TA14-FCV-RCPT-000014",
      "TA14-FCERT-000011",
    ],
    closureDigest:
      "sha256:b24aac58e0ef2d2044a1e6df27ffb9542a3c73b408cfb66076d9ffdcacdb6422",
    reopeningConditions: [
      "A new use is requested.",
      "The closure is challenged with material evidence.",
      "A downstream action claims active reliance after closure.",
    ],
  },
  {
    closureId: "TA14-FCRC-000005",
    relianceReceiptId: "TA14-FCR-000009",
    monitorId: "TA14-FCRM-000007",
    certificateId: "TA14-FCERT-000012",
    verificationId: "TA14-FCV-000015",
    recordId: "TA14-AR-2026-000132",
    recordTitle: "Expired Demonstration Upload",
    relyingParty: "Registry Publisher",
    intendedUse: "PUBLIC_DISCLOSURE",
    state: "CLOSED",
    reason: "CERTIFICATE_SUSPENDED",
    initiatedBy: "TA-14 Reliance Closure Desk",
    initiatedAt: "2026-07-17T20:48:00.000Z",
    effectiveAt: "2026-07-17T20:48:00.000Z",
    confirmedAt: "2026-07-17T20:54:00.000Z",
    priorRelianceState: "DECLINED",
    finalCertificateState: "SUSPENDED",
    finalVerificationState: "SUSPENDED",
    finalFinalityState: "REOPENED",
    finalRelianceDirective: "DO_NOT_RELY",
    closureStatement:
      "Reliance was never authorized and the attempted public-disclosure use is closed while the certificate remains suspended.",
    completedActions: [
      "Preserved the declined reliance receipt.",
      "Closed the monitoring record as suspended.",
      "Blocked publication under the certificate.",
      "Recorded the reopened finality state.",
    ],
    residualObligations: [
      "Continue monitoring the underlying reclosure process.",
      "Issue a new certificate verification before any future reliance request.",
    ],
    prohibitedPostClosureUses: [
      "Public disclosure based on the suspended certificate.",
      "Representation that finality has been restored.",
      "Execution based on the closed reliance request.",
    ],
    confirmations: [
      {
        party: "Registry Publisher",
        role: "Requesting party",
        state: "CONFIRMED",
        confirmedAt: "2026-07-17T20:52:00.000Z",
        note: "Publication request withdrawn.",
      },
      {
        party: "TA-14 Reliance Desk",
        role: "Closure authority",
        state: "CONFIRMED",
        confirmedAt: "2026-07-17T20:54:00.000Z",
        note: "Closure confirmed and publication block retained.",
      },
    ],
    evidenceReceipts: [
      "TA14-FCR-000009",
      "TA14-FCRM-RCPT-000007",
      "TA14-FCV-RCPT-000015",
      "TA14-FCERT-000012",
    ],
    closureDigest:
      "sha256:7a4ade7fb70ac4ef2bf68e2db2eb4124201d65cba581e87df1b24fead2aa58ea",
    reopeningConditions: [
      "A superseding valid certificate is issued.",
      "A new relying party submits a new intended-use request.",
    ],
  },
  {
    closureId: "TA14-FCRC-000006",
    relianceReceiptId: "TA14-FCR-000007",
    monitorId: "TA14-FCRM-000006",
    certificateId: "TA14-FCERT-000010",
    verificationId: "TA14-FCV-000013",
    recordId: "TA14-AR-2026-000148",
    recordTitle: "Temporary Training Demonstration Record",
    relyingParty: "Training Governance Team",
    intendedUse: "INTERNAL_REVIEW",
    state: "PENDING_CONFIRMATION",
    reason: "RELIANCE_EXPIRED",
    initiatedBy: "TA-14 Reliance Closure Desk",
    initiatedAt: "2026-08-17T20:23:00.000Z",
    effectiveAt: "2026-08-17T20:22:00.000Z",
    confirmedAt: "PENDING",
    priorRelianceState: "CONDITIONAL",
    finalCertificateState: "ISSUED",
    finalVerificationState: "VALID",
    finalFinalityState: "CURRENT",
    finalRelianceDirective: "CURRENT_RELIANCE",
    closureStatement:
      "The internal-review reliance window expired. Confirmation is pending that no continued use occurred after expiry.",
    completedActions: [
      "Marked the reliance receipt expired.",
      "Closed the scheduled monitoring interval.",
      "Requested relying-party confirmation.",
    ],
    residualObligations: [
      "Confirm whether any post-expiry use occurred.",
      "Issue a new verification and reliance receipt before renewed use.",
    ],
    prohibitedPostClosureUses: [
      "Continued internal review under the expired receipt.",
      "External disclosure using the expired authorization.",
    ],
    confirmations: [
      {
        party: "Training Governance Team",
        role: "Relying party",
        state: "PENDING",
        confirmedAt: "PENDING",
        note: "Awaiting acknowledgment.",
      },
      {
        party: "TA-14 Reliance Desk",
        role: "Closure authority",
        state: "CONFIRMED",
        confirmedAt: "2026-08-17T20:25:00.000Z",
        note: "Expiry closure initiated.",
      },
    ],
    evidenceReceipts: [
      "TA14-FCR-000007",
      "TA14-FCRM-RCPT-000006",
      "TA14-FCV-RCPT-000013",
    ],
    closureDigest: "PENDING",
    reopeningConditions: [
      "The relying party requests renewed internal use.",
      "A dispute identifies post-expiry reliance.",
    ],
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

export default function FinalityCertificateRelianceClosurePage() {
  const [records, setRecords] = useState(initialClosures);
  const [selectedId, setSelectedId] = useState(initialClosures[0].closureId);
  const [query, setQuery] = useState("");
  const [stateFilter, setStateFilter] = useState<ClosureState | "ALL">("ALL");
  const [reasonFilter, setReasonFilter] = useState<ClosureReason | "ALL">("ALL");
  const [copied, setCopied] = useState(false);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return records.filter((record) => {
      const matchesQuery =
        !needle ||
        [
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
          record.reason,
          record.closureStatement,
          ...record.completedActions,
          ...record.residualObligations,
          ...record.prohibitedPostClosureUses,
          ...record.evidenceReceipts,
        ]
          .join(" ")
          .toLowerCase()
          .includes(needle);

      return (
        matchesQuery &&
        (stateFilter === "ALL" || record.state === stateFilter) &&
        (reasonFilter === "ALL" || record.reason === reasonFilter)
      );
    });
  }, [query, records, stateFilter, reasonFilter]);

  const selected =
    records.find((record) => record.closureId === selectedId) ??
    filtered[0] ??
    records[0];

  const pendingConfirmations = selected.confirmations.filter(
    (item) => item.state === "PENDING",
  );
  const declinedConfirmations = selected.confirmations.filter(
    (item) => item.state === "DECLINED",
  );

  const metrics = useMemo(
    () => ({
      closed: records.filter((item) => item.state === "CLOSED").length,
      pending: records.filter(
        (item) => item.state === "PENDING_CONFIRMATION",
      ).length,
      disputed: records.filter((item) => item.state === "DISPUTED").length,
      reopened: records.filter((item) => item.state === "REOPENED").length,
    }),
    [records],
  );

  const closurePackage = {
    schema: "TA14_FINALITY_CERTIFICATE_RELIANCE_CLOSURE_PACKAGE_V1",
    generatedAt: new Date().toISOString(),
    closure: selected,
    evaluation: {
      confirmationsComplete: pendingConfirmations.length === 0,
      confirmationsDeclined: declinedConfirmations.length,
      closurePublishable:
        pendingConfirmations.length === 0 &&
        declinedConfirmations.length === 0 &&
        selected.state !== "VOID",
    },
    governance: {
      relianceReceiptBound: true,
      monitorBound: true,
      certificateStateAtClosurePreserved: true,
      verificationStateAtClosurePreserved: true,
      finalityStateAtClosurePreserved: true,
      residualObligationsDeclared: true,
      prohibitedPostClosureUsesDeclared: true,
      reopeningConditionsDeclared: true,
    },
    limitation:
      "Closure ends the named reliance authority for the stated party and intended use. It does not erase the original reliance receipt, monitoring history, certificate, verification, finality record, or downstream obligations.",
  };

  function confirmClosure() {
    if (
      pendingConfirmations.length > 0 ||
      declinedConfirmations.length > 0
    ) {
      return;
    }

    setRecords((items) =>
      items.map((item) =>
        item.closureId === selected.closureId
          ? {
              ...item,
              state: "CLOSED",
              confirmedAt: new Date().toISOString(),
              closureDigest: makeDigest(
                JSON.stringify({
                  closureId: item.closureId,
                  relianceReceiptId: item.relianceReceiptId,
                  certificateId: item.certificateId,
                  reason: item.reason,
                  closureStatement: item.closureStatement,
                  residualObligations: item.residualObligations,
                  prohibitedPostClosureUses: item.prohibitedPostClosureUses,
                  confirmations: item.confirmations,
                }),
              ),
            }
          : item,
      ),
    );
  }

  function confirmPendingParties() {
    const now = new Date().toISOString();

    setRecords((items) =>
      items.map((item) =>
        item.closureId === selected.closureId
          ? {
              ...item,
              confirmations: item.confirmations.map((confirmation) =>
                confirmation.state === "PENDING"
                  ? {
                      ...confirmation,
                      state: "CONFIRMED",
                      confirmedAt: now,
                      note:
                        confirmation.note === "Awaiting acknowledgment."
                          ? "Closure acknowledged."
                          : confirmation.note,
                    }
                  : confirmation,
              ),
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
    <main className="closure-page">
      <style>{`
        * { box-sizing: border-box; }

        .closure-page {
          min-height: calc(100vh - 68px);
          padding: 48px 0 110px;
          color: #edf6ff;
        }

        .closure-wrap {
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
            radial-gradient(circle at 85% 7%, rgba(255, 145, 84, .16), transparent 28%),
            radial-gradient(circle at 14% 0%, rgba(72, 223, 255, .17), transparent 32%),
            linear-gradient(135deg, rgba(14, 30, 48, .97), rgba(5, 11, 20, .98));
          box-shadow: 0 38px 120px rgba(0,0,0,.35);
        }

        .hero::after {
          content: "CLOSED";
          position: absolute;
          right: -10px;
          bottom: -42px;
          color: rgba(255,255,255,.025);
          font-size: clamp(4.4rem, 11vw, 9.4rem);
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
          background: linear-gradient(100deg, #fff, #8ceaff 50%, #ff9154);
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
          background: linear-gradient(100deg, #56e6ff, #ff9154);
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
          grid-template-columns: minmax(220px, 1fr) 230px 250px;
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

        .closure-row {
          width: 100%;
          padding: 20px 21px;
          border: 0;
          border-bottom: 1px solid rgba(132, 177, 216, .1);
          color: inherit;
          background: transparent;
          text-align: left;
          cursor: pointer;
        }

        .closure-row:last-child { border-bottom: 0; }

        .closure-row.active {
          background: linear-gradient(90deg, rgba(84, 232, 255, .09), rgba(255, 145, 84, .025));
          box-shadow: inset 3px 0 0 #56e6ff;
        }

        .row-top, .meta, .detail-top {
          display: flex;
          align-items: center;
          gap: 9px;
          flex-wrap: wrap;
        }

        .row-top { justify-content: space-between; }

        .closure-title { font-weight: 900; }

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

        .pill.CLOSED, .pill.CONFIRMED {
          color: #54efae;
          border-color: rgba(84, 239, 174, .3);
        }

        .pill.DRAFT, .pill.PENDING_CONFIRMATION, .pill.PARTIALLY_CLOSED, .pill.PENDING {
          color: #ffd27b;
          border-color: rgba(255, 210, 123, .3);
        }

        .pill.DISPUTED, .pill.REOPENED, .pill.VOID, .pill.DECLINED {
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

        .box, .confirmation {
          margin-top: 17px;
          padding: 16px;
          border: 1px solid rgba(132, 177, 216, .12);
          border-radius: 17px;
          background: rgba(2, 9, 16, .52);
        }

        .box strong, .confirmation strong {
          display: block;
          color: #dce8f3;
          font-size: .76rem;
          letter-spacing: .07em;
          text-transform: uppercase;
        }

        .box p, .confirmation p {
          margin: 10px 0 0;
          font-size: .8rem;
        }

        .box ul {
          margin: 10px 0 0;
          padding-left: 18px;
          color: #9fb1c1;
          line-height: 1.65;
        }

        .confirmation {
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 12px;
          align-items: start;
        }

        .notice {
          margin-top: 18px;
          padding: 16px 18px;
          border-left: 3px solid #ff9154;
          border-radius: 0 13px 13px 0;
          color: #91a8bd;
          background: rgba(255, 145, 84, .045);
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
          .closure-wrap { width: min(100% - 24px, 1420px); }
          .closure-page { padding-top: 24px; }
          .hero { padding: 28px 22px 34px; border-radius: 24px; }
          .toolbar { grid-template-columns: 1fr; }
          .metrics { grid-template-columns: 1fr 1fr; }
          .kv { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="closure-wrap">
        <section className="hero">
          <div className="hero-content">
            <p className="eyebrow">
              TA-14 Exchange · Reliance Closure & Termination
            </p>
            <h1>
              Authorized reliance must end.
              <br />
              <span className="gradient">And its ending must be provable.</span>
            </h1>
            <p className="hero-copy">
              Close, confirm, partially close, dispute, reopen, or void a
              reliance authority while preserving the final observed
              certificate, verification, finality, reliance directive,
              residual obligations, prohibited post-closure uses, and all
              confirmation receipts.
            </p>

            <div className="hero-actions">
              <Link
                className="button"
                href="/workspace/records/disposition/finality/certificates/reliance/monitoring"
              >
                Open Reliance Monitoring
              </Link>
              <Link
                className="button-secondary"
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
            </div>
          </div>
        </section>

        <section className="metrics">
          <article className="metric">
            <strong>{metrics.closed}</strong>
            <span>Closed</span>
          </article>
          <article className="metric">
            <strong>{metrics.pending}</strong>
            <span>Pending confirmation</span>
          </article>
          <article className="metric">
            <strong>{metrics.disputed}</strong>
            <span>Disputed</span>
          </article>
          <article className="metric">
            <strong>{metrics.reopened}</strong>
            <span>Reopened</span>
          </article>
        </section>

        <section className="toolbar">
          <input
            aria-label="Search reliance closures"
            placeholder="Search closure, reliance receipt, certificate, party, reason, action, obligation, or statement"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />

          <select
            aria-label="Filter closure state"
            value={stateFilter}
            onChange={(event) =>
              setStateFilter(event.target.value as ClosureState | "ALL")
            }
          >
            <option value="ALL">All states</option>
            <option value="DRAFT">DRAFT</option>
            <option value="PENDING_CONFIRMATION">
              PENDING_CONFIRMATION
            </option>
            <option value="CLOSED">CLOSED</option>
            <option value="PARTIALLY_CLOSED">PARTIALLY_CLOSED</option>
            <option value="DISPUTED">DISPUTED</option>
            <option value="REOPENED">REOPENED</option>
            <option value="VOID">VOID</option>
          </select>

          <select
            aria-label="Filter closure reason"
            value={reasonFilter}
            onChange={(event) =>
              setReasonFilter(event.target.value as ClosureReason | "ALL")
            }
          >
            <option value="ALL">All reasons</option>
            <option value="PURPOSE_COMPLETED">PURPOSE_COMPLETED</option>
            <option value="CERTIFICATE_SUSPENDED">
              CERTIFICATE_SUSPENDED
            </option>
            <option value="CERTIFICATE_REVOKED">
              CERTIFICATE_REVOKED
            </option>
            <option value="RELIANCE_EXPIRED">RELIANCE_EXPIRED</option>
            <option value="SCOPE_CHANGED">SCOPE_CHANGED</option>
            <option value="PARTY_WITHDREW">PARTY_WITHDREW</option>
            <option value="SUPERSEDED">SUPERSEDED</option>
            <option value="OTHER">OTHER</option>
          </select>
        </section>

        <section className="grid">
          <div className="panel">
            <div className="panel-head">
              <strong>Reliance closures</strong>
              <span>{filtered.length} visible</span>
            </div>

            {filtered.length ? (
              filtered.map((record) => (
                <button
                  className={`closure-row ${
                    selected.closureId === record.closureId ? "active" : ""
                  }`}
                  key={record.closureId}
                  type="button"
                  onClick={() => setSelectedId(record.closureId)}
                >
                  <div className="row-top">
                    <span className="closure-title">{record.recordTitle}</span>
                    <span className={`pill ${record.state}`}>{record.state}</span>
                  </div>
                  <div className="mono">{record.closureId}</div>
                  <div className="meta">
                    <span>{record.reason}</span>
                    <span>{record.relyingParty}</span>
                    <span>{record.relianceReceiptId}</span>
                    <span>{formatDate(record.effectiveAt)}</span>
                  </div>
                </button>
              ))
            ) : (
              <div className="empty">
                No reliance closure matches the current filters.
              </div>
            )}
          </div>

          <aside className="panel detail">
            <div className="detail-top">
              <span className={`pill ${selected.state}`}>{selected.state}</span>
              <span className="pill">{selected.reason}</span>
              <span className="pill">{selected.intendedUse}</span>
            </div>

            <h2>{selected.recordTitle}</h2>
            <div className="mono">{selected.closureId}</div>

            <div className="result-banner">
              <h3>{selected.relyingParty}</h3>
              <p>{selected.closureStatement}</p>
            </div>

            <dl className="kv">
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

              <dt>Prior reliance state</dt>
              <dd>{selected.priorRelianceState}</dd>

              <dt>Final certificate state</dt>
              <dd>{selected.finalCertificateState}</dd>

              <dt>Final verification state</dt>
              <dd>{selected.finalVerificationState}</dd>

              <dt>Final finality state</dt>
              <dd>{selected.finalFinalityState}</dd>

              <dt>Final reliance directive</dt>
              <dd>{selected.finalRelianceDirective}</dd>

              <dt>Initiated by</dt>
              <dd>{selected.initiatedBy}</dd>

              <dt>Initiated</dt>
              <dd>{formatDate(selected.initiatedAt)}</dd>

              <dt>Effective</dt>
              <dd>{formatDate(selected.effectiveAt)}</dd>

              <dt>Confirmed</dt>
              <dd>{formatDate(selected.confirmedAt)}</dd>

              <dt>Closure digest</dt>
              <dd>{selected.closureDigest}</dd>
            </dl>

            <div className="box">
              <strong>Completed actions</strong>
              <ul>
                {selected.completedActions.map((item) => (
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
              <strong>Prohibited post-closure uses</strong>
              <ul>
                {selected.prohibitedPostClosureUses.map((item) => (
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

            <div className="box">
              <strong>Reopening conditions</strong>
              <ul>
                {selected.reopeningConditions.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            {selected.confirmations.map((confirmation) => (
              <div
                className="confirmation"
                key={`${confirmation.party}-${confirmation.role}`}
              >
                <span className={`pill ${confirmation.state}`}>
                  {confirmation.state}
                </span>
                <div>
                  <strong>
                    {confirmation.party} · {confirmation.role}
                  </strong>
                  <p>
                    {confirmation.note} ·{" "}
                    {formatDate(confirmation.confirmedAt)}
                  </p>
                </div>
              </div>
            ))}

            <div className="detail-actions">
              <button
                className="button"
                type="button"
                onClick={confirmClosure}
                disabled={
                  pendingConfirmations.length > 0 ||
                  declinedConfirmations.length > 0
                }
              >
                Confirm closure
              </button>

              <button
                className="small-button"
                type="button"
                onClick={confirmPendingParties}
                disabled={pendingConfirmations.length === 0}
              >
                Confirm pending parties
              </button>

              <button
                className="small-button"
                type="button"
                onClick={() =>
                  setRecords((items) =>
                    items.map((item) =>
                      item.closureId === selected.closureId
                        ? {
                            ...item,
                            state: "PARTIALLY_CLOSED",
                            closureStatement:
                              "Reliance is partially closed. Residual scope remains under review.",
                          }
                        : item,
                    ),
                  )
                }
              >
                Mark partial
              </button>

              <button
                className="small-button"
                type="button"
                onClick={() =>
                  setRecords((items) =>
                    items.map((item) =>
                      item.closureId === selected.closureId
                        ? {
                            ...item,
                            state: "DISPUTED",
                            closureStatement:
                              "Closure is disputed and may not be treated as final until the dispute is resolved.",
                          }
                        : item,
                    ),
                  )
                }
              >
                Dispute closure
              </button>

              <button
                className="small-button"
                type="button"
                onClick={() =>
                  setRecords((items) =>
                    items.map((item) =>
                      item.closureId === selected.closureId
                        ? {
                            ...item,
                            state: "REOPENED",
                            closureStatement:
                              "Closure has been reopened under a preserved reopening condition.",
                          }
                        : item,
                    ),
                  )
                }
              >
                Reopen
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
                    `${selected.closureId.toLowerCase()}-reliance-closure.json`,
                    closurePackage,
                  )
                }
              >
                Download package
              </button>
            </div>

            <div className="notice">
              Reliance closure terminates a specific authority, not the record
              of that authority. The original receipt, monitoring events,
              evidence, confirmations, limitations, and residual obligations
              remain permanently preserved.
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
