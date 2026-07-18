"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type ReauthorizationState =
  | "DRAFT"
  | "PENDING_VERIFICATION"
  | "PENDING_APPROVAL"
  | "AUTHORIZED"
  | "CONDITIONAL"
  | "DECLINED"
  | "SUSPENDED"
  | "EXPIRED"
  | "REVOKED";

type IntendedUse =
  | "INTERNAL_REVIEW"
  | "CONTRACTUAL_DECISION"
  | "PUBLIC_DISCLOSURE"
  | "REGULATORY_SUBMISSION"
  | "OPERATIONAL_EXECUTION"
  | "OTHER";

type ApprovalState = "APPROVED" | "PENDING" | "REJECTED";

type PostRestorationReauthorization = {
  reauthorizationId: string;
  restorationVerificationId: string;
  restorationId: string;
  priorRelianceReceiptId: string;
  newRelianceReceiptId: string;
  certificateId: string;
  certificateVerificationId: string;
  closureId: string;
  recordId: string;
  recordTitle: string;
  relyingParty: string;
  authorityRole: string;
  intendedUse: IntendedUse;
  state: ReauthorizationState;
  requestedBy: string;
  requestedAt: string;
  authorizedAt: string;
  expiresAt: string;
  restorationVerificationState: string;
  certificateVerificationState: string;
  relianceDirectiveObserved: string;
  requestedScope: string[];
  approvedScope: string[];
  conditions: string[];
  prohibitedUses: string[];
  approvals: {
    authority: string;
    role: string;
    state: ApprovalState;
    decidedAt: string;
    note: string;
  }[];
  statement: string;
  receiptDigest: string;
};

const initialRecords: PostRestorationReauthorization[] = [
  {
    reauthorizationId: "TA14-FCRR-000001",
    restorationVerificationId: "TA14-FCRCARRSV-000001",
    restorationId: "TA14-FCRCARRS-000001",
    priorRelianceReceiptId: "TA14-FCR-000006",
    newRelianceReceiptId: "TA14-FCR-000021",
    certificateId: "TA14-FCERT-000014",
    certificateVerificationId: "TA14-FCV-000019",
    closureId: "TA14-FCRC-000003",
    recordId: "TA14-AR-2026-000119",
    recordTitle: "Legacy Disclosure Approval",
    relyingParty: "External Communications Review",
    authorityRole: "Publication Governance Authority",
    intendedUse: "PUBLIC_DISCLOSURE",
    state: "AUTHORIZED",
    requestedBy: "External Communications Review",
    requestedAt: "2026-07-31T13:10:00.000Z",
    authorizedAt: "2026-07-31T13:32:00.000Z",
    expiresAt: "2026-08-31T13:32:00.000Z",
    restorationVerificationState: "VALID",
    certificateVerificationState: "VALID",
    relianceDirectiveObserved: "CURRENT_RELIANCE",
    requestedScope: [
      "Use the restored closure for one governed publication decision.",
      "Publish only the approved disclosure package.",
      "Bind all output to TA14-FCERT-000014.",
    ],
    approvedScope: [
      "One publication decision.",
      "Named relying party only.",
      "Thirty-day authorization window.",
    ],
    conditions: [
      "Verify the certificate immediately before publication.",
      "Preserve the publication receipt.",
      "Close the new reliance receipt after the publication decision.",
    ],
    prohibitedUses: [
      "Reuse of TA14-FCR-000006.",
      "Transfer to another relying party.",
      "Use for operational execution.",
      "Use after expiration.",
    ],
    approvals: [
      {
        authority: "TA-14 Restoration Verification Desk",
        role: "Restoration verifier",
        state: "APPROVED",
        decidedAt: "2026-07-31T13:20:00.000Z",
        note: "Restoration verification remains valid.",
      },
      {
        authority: "TA-14 Certificate Verification Desk",
        role: "Certificate verifier",
        state: "APPROVED",
        decidedAt: "2026-07-31T13:25:00.000Z",
        note: "Current certificate verification passed.",
      },
      {
        authority: "TA-14 Reliance Authority",
        role: "Reliance authorizer",
        state: "APPROVED",
        decidedAt: "2026-07-31T13:32:00.000Z",
        note: "New bounded reliance authorized.",
      },
    ],
    statement:
      "A new reliance receipt is authorized for one bounded public-disclosure decision. The prior reliance receipt remains closed.",
    receiptDigest:
      "sha256:7f8ea859e58b51d569f7f6c7459967a86c498097b74f15943c55c664a0508c22",
  },
  {
    reauthorizationId: "TA14-FCRR-000002",
    restorationVerificationId: "TA14-FCRCARRSV-000002",
    restorationId: "TA14-FCRCARRS-000002",
    priorRelianceReceiptId: "TA14-FCR-000007",
    newRelianceReceiptId: "PENDING",
    certificateId: "TA14-FCERT-000010",
    certificateVerificationId: "TA14-FCV-000013",
    closureId: "TA14-FCRC-000006",
    recordId: "TA14-AR-2026-000148",
    recordTitle: "Temporary Training Demonstration Record",
    relyingParty: "Training Governance Team",
    authorityRole: "Training Review Authority",
    intendedUse: "INTERNAL_REVIEW",
    state: "DECLINED",
    requestedBy: "Training Governance Team",
    requestedAt: "2026-08-20T20:05:00.000Z",
    authorizedAt: "NONE",
    expiresAt: "NONE",
    restorationVerificationState: "UNKNOWN",
    certificateVerificationState: "VALID",
    relianceDirectiveObserved: "CURRENT_RELIANCE",
    requestedScope: [
      "Resume internal review activity.",
      "Permit renewed use of the restored closure.",
    ],
    approvedScope: [],
    conditions: [
      "Complete restoration verification.",
      "Resolve lineage-preservation retest.",
    ],
    prohibitedUses: [
      "Use of the expired prior reliance receipt.",
      "Any review activity before valid restoration verification.",
    ],
    approvals: [
      {
        authority: "TA-14 Restoration Verification Desk",
        role: "Restoration verifier",
        state: "REJECTED",
        decidedAt: "2026-08-20T20:12:00.000Z",
        note: "Restoration verification is UNKNOWN.",
      },
      {
        authority: "TA-14 Certificate Verification Desk",
        role: "Certificate verifier",
        state: "APPROVED",
        decidedAt: "2026-08-20T20:14:00.000Z",
        note: "Certificate verification is valid.",
      },
      {
        authority: "TA-14 Reliance Authority",
        role: "Reliance authorizer",
        state: "REJECTED",
        decidedAt: "2026-08-20T20:16:00.000Z",
        note: "Reliance cannot be authorized without valid restoration verification.",
      },
    ],
    statement:
      "Reauthorization is declined because restoration verification is unresolved. No new reliance receipt was issued.",
    receiptDigest:
      "sha256:8d08ee961f804a5eaa049081af55de54bdf1b8be6634ffefba7e0e2936f80ea8",
  },
];

function formatDate(value: string) {
  if (value === "PENDING" || value === "NONE" || value === "UNKNOWN") {
    return value;
  }

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

export default function PostRestorationRelianceReauthorizationPage() {
  const [records, setRecords] = useState(initialRecords);
  const [selectedId, setSelectedId] = useState(initialRecords[0].reauthorizationId);
  const [query, setQuery] = useState("");
  const [stateFilter, setStateFilter] = useState<ReauthorizationState | "ALL">("ALL");
  const [useFilter, setUseFilter] = useState<IntendedUse | "ALL">("ALL");
  const [copied, setCopied] = useState(false);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return records.filter((record) => {
      const matchesQuery =
        !needle ||
        [
          record.reauthorizationId,
          record.restorationVerificationId,
          record.restorationId,
          record.priorRelianceReceiptId,
          record.newRelianceReceiptId,
          record.certificateId,
          record.certificateVerificationId,
          record.closureId,
          record.recordId,
          record.recordTitle,
          record.relyingParty,
          record.authorityRole,
          record.intendedUse,
          record.state,
          record.statement,
          ...record.requestedScope,
          ...record.approvedScope,
          ...record.conditions,
          ...record.prohibitedUses,
        ]
          .join(" ")
          .toLowerCase()
          .includes(needle);

      return (
        matchesQuery &&
        (stateFilter === "ALL" || record.state === stateFilter) &&
        (useFilter === "ALL" || record.intendedUse === useFilter)
      );
    });
  }, [query, records, stateFilter, useFilter]);

  const selected =
    records.find((record) => record.reauthorizationId === selectedId) ??
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
      authorized: records.filter((item) => item.state === "AUTHORIZED").length,
      conditional: records.filter((item) => item.state === "CONDITIONAL").length,
      declined: records.filter((item) => item.state === "DECLINED").length,
      pending: records.filter(
        (item) =>
          item.state === "PENDING_APPROVAL" ||
          item.state === "PENDING_VERIFICATION",
      ).length,
    }),
    [records],
  );

  const reauthorizationPackage = {
    schema:
      "TA14_POST_RESTORATION_RELIANCE_REAUTHORIZATION_RECEIPT_V1",
    generatedAt: new Date().toISOString(),
    reauthorization: selected,
    evaluation: {
      restorationVerificationValid:
        selected.restorationVerificationState === "VALID",
      certificateVerificationValid:
        selected.certificateVerificationState === "VALID",
      relianceDirectivePermitsUse:
        selected.relianceDirectiveObserved !== "DO_NOT_RELY",
      approvalsComplete: pendingApprovals.length === 0,
      approvalsRejected: rejectedApprovals.length,
      authorizationEligible:
        selected.restorationVerificationState === "VALID" &&
        selected.certificateVerificationState === "VALID" &&
        selected.relianceDirectiveObserved !== "DO_NOT_RELY" &&
        pendingApprovals.length === 0 &&
        rejectedApprovals.length === 0,
    },
    governance: {
      priorRelianceReceiptRemainsClosed: true,
      restorationVerificationBound: true,
      certificateVerificationBound: true,
      intendedUseBound: true,
      relyingPartyBound: true,
      conditionsBound: true,
      prohibitedUsesBound: true,
      expirationRequired: true,
      newReceiptRequired: true,
    },
    limitation:
      "Restored closure status does not revive prior reliance. Any post-restoration use requires a new, independently verified, party-bound, purpose-bound, time-bound reliance receipt.",
  };

  function authorize() {
    if (
      selected.restorationVerificationState !== "VALID" ||
      selected.certificateVerificationState !== "VALID" ||
      selected.relianceDirectiveObserved === "DO_NOT_RELY" ||
      pendingApprovals.length > 0 ||
      rejectedApprovals.length > 0
    ) {
      return;
    }

    const now = new Date();
    const expires = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    setRecords((items) =>
      items.map((item) =>
        item.reauthorizationId === selected.reauthorizationId
          ? {
              ...item,
              state: "AUTHORIZED",
              authorizedAt: now.toISOString(),
              expiresAt: expires.toISOString(),
              newRelianceReceiptId:
                item.newRelianceReceiptId === "PENDING"
                  ? `TA14-FCR-${Math.floor(100000 + Math.random() * 900000)}`
                  : item.newRelianceReceiptId,
              approvedScope:
                item.approvedScope.length > 0
                  ? item.approvedScope
                  : [
                      "Named relying party only.",
                      `Intended use limited to ${item.intendedUse}.`,
                      "Thirty-day authorization window.",
                    ],
              statement:
                "A new bounded reliance receipt is authorized. The prior reliance receipt remains permanently closed.",
              receiptDigest: makeDigest(
                JSON.stringify({
                  reauthorizationId: item.reauthorizationId,
                  restorationVerificationId:
                    item.restorationVerificationId,
                  certificateVerificationId:
                    item.certificateVerificationId,
                  relyingParty: item.relyingParty,
                  intendedUse: item.intendedUse,
                  approvedScope: item.approvedScope,
                  authorizedAt: now.toISOString(),
                  expiresAt: expires.toISOString(),
                }),
              ),
            }
          : item,
      ),
    );
  }

  async function copyPackage() {
    await navigator.clipboard.writeText(
      JSON.stringify(reauthorizationPackage, null, 2),
    );
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <main className="reauthorization-page">
      <style>{`
        * { box-sizing: border-box; }

        .reauthorization-page {
          min-height: calc(100vh - 68px);
          padding: 48px 0 110px;
          color: #edf6ff;
        }

        .reauthorization-wrap {
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
            radial-gradient(circle at 85% 7%, rgba(255, 174, 72, .16), transparent 28%),
            radial-gradient(circle at 14% 0%, rgba(72, 223, 255, .17), transparent 32%),
            linear-gradient(135deg, rgba(14, 30, 48, .97), rgba(5, 11, 20, .98));
          box-shadow: 0 38px 120px rgba(0,0,0,.35);
        }

        .hero::after {
          content: "REAUTHORIZE";
          position: absolute;
          right: -10px;
          bottom: -42px;
          color: rgba(255,255,255,.025);
          font-size: clamp(3rem, 7.5vw, 7.4rem);
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
          background: linear-gradient(100deg, #fff, #8ceaff 50%, #ffae48);
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
          background: linear-gradient(100deg, #56e6ff, #ffae48);
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
          grid-template-columns: minmax(220px, 1fr) 250px 240px;
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

        .reauthorization-row {
          width: 100%;
          padding: 20px 21px;
          border: 0;
          border-bottom: 1px solid rgba(132, 177, 216, .1);
          color: inherit;
          background: transparent;
          text-align: left;
          cursor: pointer;
        }

        .reauthorization-row:last-child { border-bottom: 0; }

        .reauthorization-row.active {
          background: linear-gradient(90deg, rgba(84, 232, 255, .09), rgba(255, 174, 72, .025));
          box-shadow: inset 3px 0 0 #56e6ff;
        }

        .row-top, .meta, .detail-top {
          display: flex;
          align-items: center;
          gap: 9px;
          flex-wrap: wrap;
        }

        .row-top { justify-content: space-between; }

        .reauthorization-title { font-weight: 900; }

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

        .pill.AUTHORIZED, .pill.APPROVED {
          color: #54efae;
          border-color: rgba(84, 239, 174, .3);
        }

        .pill.DRAFT, .pill.PENDING_VERIFICATION, .pill.PENDING_APPROVAL,
        .pill.CONDITIONAL, .pill.PENDING, .pill.EXPIRED {
          color: #ffd27b;
          border-color: rgba(255, 210, 123, .3);
        }

        .pill.DECLINED, .pill.SUSPENDED, .pill.REVOKED, .pill.REJECTED {
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
          grid-template-columns: 220px 1fr;
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
          border-left: 3px solid #ffae48;
          border-radius: 0 13px 13px 0;
          color: #91a8bd;
          background: rgba(255, 174, 72, .045);
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
          .reauthorization-wrap { width: min(100% - 24px, 1420px); }
          .reauthorization-page { padding-top: 24px; }
          .hero { padding: 28px 22px 34px; border-radius: 24px; }
          .toolbar { grid-template-columns: 1fr; }
          .metrics { grid-template-columns: 1fr 1fr; }
          .kv { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="reauthorization-wrap">
        <section className="hero">
          <div className="hero-content">
            <p className="eyebrow">
              TA-14 Exchange · Post-Restoration Reliance Reauthorization
            </p>
            <h1>
              Restored closure is not
              <br />
              <span className="gradient">restored reliance.</span>
            </h1>
            <p className="hero-copy">
              Require a new certificate verification, a valid restoration
              verification, a named relying party, an explicit intended use,
              bounded scope, conditions, expiration, and a new reliance receipt
              before any post-restoration consequence-bearing use may occur.
            </p>

            <div className="hero-actions">
              <Link
                className="button"
                href="/workspace/records/disposition/finality/certificates/reliance/closure/audit/remediation/retest/restoration/verify"
              >
                Verify Restoration
              </Link>
              <Link
                className="button-secondary"
                href="/workspace/records/disposition/finality/certificates/verify"
              >
                Verify Certificate
              </Link>
              <Link
                className="button-secondary"
                href="/workspace/records/disposition/finality/certificates/reliance"
              >
                Open Reliance Desk
              </Link>
            </div>
          </div>
        </section>

        <section className="metrics">
          <article className="metric">
            <strong>{metrics.authorized}</strong>
            <span>Authorized</span>
          </article>
          <article className="metric">
            <strong>{metrics.conditional}</strong>
            <span>Conditional</span>
          </article>
          <article className="metric">
            <strong>{metrics.declined}</strong>
            <span>Declined</span>
          </article>
          <article className="metric">
            <strong>{metrics.pending}</strong>
            <span>Pending</span>
          </article>
        </section>

        <section className="toolbar">
          <input
            aria-label="Search reauthorization records"
            placeholder="Search reauthorization, restoration, receipt, certificate, party, purpose, condition, or statement"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />

          <select
            aria-label="Filter reauthorization state"
            value={stateFilter}
            onChange={(event) =>
              setStateFilter(event.target.value as ReauthorizationState | "ALL")
            }
          >
            <option value="ALL">All states</option>
            <option value="DRAFT">DRAFT</option>
            <option value="PENDING_VERIFICATION">PENDING_VERIFICATION</option>
            <option value="PENDING_APPROVAL">PENDING_APPROVAL</option>
            <option value="AUTHORIZED">AUTHORIZED</option>
            <option value="CONDITIONAL">CONDITIONAL</option>
            <option value="DECLINED">DECLINED</option>
            <option value="SUSPENDED">SUSPENDED</option>
            <option value="EXPIRED">EXPIRED</option>
            <option value="REVOKED">REVOKED</option>
          </select>

          <select
            aria-label="Filter intended use"
            value={useFilter}
            onChange={(event) =>
              setUseFilter(event.target.value as IntendedUse | "ALL")
            }
          >
            <option value="ALL">All intended uses</option>
            <option value="INTERNAL_REVIEW">INTERNAL_REVIEW</option>
            <option value="CONTRACTUAL_DECISION">CONTRACTUAL_DECISION</option>
            <option value="PUBLIC_DISCLOSURE">PUBLIC_DISCLOSURE</option>
            <option value="REGULATORY_SUBMISSION">REGULATORY_SUBMISSION</option>
            <option value="OPERATIONAL_EXECUTION">OPERATIONAL_EXECUTION</option>
            <option value="OTHER">OTHER</option>
          </select>
        </section>

        <section className="grid">
          <div className="panel">
            <div className="panel-head">
              <strong>Reauthorization records</strong>
              <span>{filtered.length} visible</span>
            </div>

            {filtered.length ? (
              filtered.map((record) => (
                <button
                  className={`reauthorization-row ${
                    selected.reauthorizationId === record.reauthorizationId
                      ? "active"
                      : ""
                  }`}
                  key={record.reauthorizationId}
                  type="button"
                  onClick={() => setSelectedId(record.reauthorizationId)}
                >
                  <div className="row-top">
                    <span className="reauthorization-title">
                      {record.recordTitle}
                    </span>
                    <span className={`pill ${record.state}`}>
                      {record.state}
                    </span>
                  </div>
                  <div className="mono">{record.reauthorizationId}</div>
                  <div className="meta">
                    <span>{record.intendedUse}</span>
                    <span>{record.relyingParty}</span>
                    <span>{record.restorationVerificationState}</span>
                    <span>{formatDate(record.authorizedAt)}</span>
                  </div>
                </button>
              ))
            ) : (
              <div className="empty">
                No reauthorization record matches the current filters.
              </div>
            )}
          </div>

          <aside className="panel detail">
            <div className="detail-top">
              <span className={`pill ${selected.state}`}>{selected.state}</span>
              <span className="pill">{selected.intendedUse}</span>
              <span className="pill">
                {selected.restorationVerificationState}
              </span>
            </div>

            <h2>{selected.recordTitle}</h2>
            <div className="mono">{selected.reauthorizationId}</div>

            <div className="result-banner">
              <h3>{selected.relyingParty}</h3>
              <p>{selected.statement}</p>
            </div>

            <dl className="kv">
              <dt>Restoration verification</dt>
              <dd>{selected.restorationVerificationId}</dd>

              <dt>Restoration ID</dt>
              <dd>{selected.restorationId}</dd>

              <dt>Prior reliance receipt</dt>
              <dd>{selected.priorRelianceReceiptId}</dd>

              <dt>New reliance receipt</dt>
              <dd>{selected.newRelianceReceiptId}</dd>

              <dt>Certificate ID</dt>
              <dd>{selected.certificateId}</dd>

              <dt>Certificate verification</dt>
              <dd>{selected.certificateVerificationId}</dd>

              <dt>Closure ID</dt>
              <dd>{selected.closureId}</dd>

              <dt>Record ID</dt>
              <dd>{selected.recordId}</dd>

              <dt>Authority role</dt>
              <dd>{selected.authorityRole}</dd>

              <dt>Requested by</dt>
              <dd>{selected.requestedBy}</dd>

              <dt>Requested</dt>
              <dd>{formatDate(selected.requestedAt)}</dd>

              <dt>Authorized</dt>
              <dd>{formatDate(selected.authorizedAt)}</dd>

              <dt>Expires</dt>
              <dd>{formatDate(selected.expiresAt)}</dd>

              <dt>Certificate verification state</dt>
              <dd>{selected.certificateVerificationState}</dd>

              <dt>Reliance directive</dt>
              <dd>{selected.relianceDirectiveObserved}</dd>

              <dt>Receipt digest</dt>
              <dd>{selected.receiptDigest}</dd>
            </dl>

            <div className="box">
              <strong>Requested scope</strong>
              <ul>
                {selected.requestedScope.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="box">
              <strong>Approved scope</strong>
              {selected.approvedScope.length ? (
                <ul>
                  {selected.approvedScope.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p>No scope was approved.</p>
              )}
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
              <strong>Conditions</strong>
              <ul>
                {selected.conditions.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="box">
              <strong>Prohibited uses</strong>
              <ul>
                {selected.prohibitedUses.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="detail-actions">
              <button
                className="button"
                type="button"
                onClick={authorize}
                disabled={
                  selected.restorationVerificationState !== "VALID" ||
                  selected.certificateVerificationState !== "VALID" ||
                  selected.relianceDirectiveObserved === "DO_NOT_RELY" ||
                  pendingApprovals.length > 0 ||
                  rejectedApprovals.length > 0
                }
              >
                Issue new reliance receipt
              </button>

              <button
                className="small-button"
                type="button"
                onClick={() =>
                  setRecords((items) =>
                    items.map((item) =>
                      item.reauthorizationId === selected.reauthorizationId
                        ? {
                            ...item,
                            state: "SUSPENDED",
                            statement:
                              "Post-restoration reliance is suspended pending renewed verification.",
                          }
                        : item,
                    ),
                  )
                }
              >
                Suspend
              </button>

              <button
                className="small-button"
                type="button"
                onClick={() =>
                  setRecords((items) =>
                    items.map((item) =>
                      item.reauthorizationId === selected.reauthorizationId
                        ? {
                            ...item,
                            state: "REVOKED",
                            statement:
                              "The new post-restoration reliance authority is revoked.",
                          }
                        : item,
                    ),
                  )
                }
              >
                Revoke
              </button>

              <button
                className="small-button"
                type="button"
                onClick={copyPackage}
              >
                {copied ? "Copied" : "Copy reauthorization receipt"}
              </button>

              <button
                className="small-button"
                type="button"
                onClick={() =>
                  downloadJson(
                    `${selected.reauthorizationId.toLowerCase()}-post-restoration-reliance.json`,
                    reauthorizationPackage,
                  )
                }
              >
                Download receipt
              </button>
            </div>

            <div className="notice">
              Restored closure status never revives prior reliance. A new
              consequence-bearing use requires a new receipt with current
              verification, explicit purpose, bounded scope, named authority,
              conditions, prohibited uses, and expiration.
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
