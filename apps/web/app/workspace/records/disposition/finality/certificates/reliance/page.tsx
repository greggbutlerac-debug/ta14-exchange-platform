"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type RelianceState =
  | "DRAFT"
  | "AUTHORIZED"
  | "CONDITIONAL"
  | "DECLINED"
  | "SUSPENDED"
  | "EXPIRED"
  | "REVOKED";

type IntendedUse =
  | "INTERNAL_REVIEW"
  | "CONTRACTUAL_DECISION"
  | "REGULATORY_SUBMISSION"
  | "PUBLIC_DISCLOSURE"
  | "SYSTEM_EXECUTION"
  | "OTHER";

type CheckState = "PASS" | "FAIL" | "UNKNOWN";

type CertificateRelianceReceipt = {
  relianceReceiptId: string;
  certificateId: string;
  verificationId: string;
  resolutionId: string;
  recordId: string;
  recordTitle: string;
  state: RelianceState;
  intendedUse: IntendedUse;
  relyingParty: string;
  relyingPartyRole: string;
  authorizedBy: string;
  createdAt: string;
  authorizedAt: string;
  expiresAt: string;
  certificateStateAtReliance: string;
  verificationStateAtReliance: string;
  relianceDirectiveAtReliance: string;
  governingStatement: string;
  acceptedLimitations: string[];
  prohibitedUses: string[];
  conditions: string[];
  checks: {
    label: string;
    state: CheckState;
    evidence: string;
  }[];
  relianceStatement: string;
  revocationReason: string;
  receiptDigest: string;
};

const initialReceipts: CertificateRelianceReceipt[] = [
  {
    relianceReceiptId: "TA14-FCR-000008",
    certificateId: "TA14-FCERT-000011",
    verificationId: "TA14-FCV-000014",
    resolutionId: "TA14-FIN-000021",
    recordId: "TA14-AR-2026-000126",
    recordTitle: "Archived Vendor Access Evidence",
    state: "AUTHORIZED",
    intendedUse: "CONTRACTUAL_DECISION",
    relyingParty: "Vendor Risk Committee",
    relyingPartyRole: "Contract decision authority",
    authorizedBy: "TA-14 Reliance Desk",
    createdAt: "2026-07-17T20:26:00.000Z",
    authorizedAt: "2026-07-17T20:31:00.000Z",
    expiresAt: "2026-10-17T20:31:00.000Z",
    certificateStateAtReliance: "PUBLISHED",
    verificationStateAtReliance: "VALID",
    relianceDirectiveAtReliance: "CURRENT_RELIANCE",
    governingStatement:
      "The technical disposition was completed and independently verified. A required affected-party notice occurred after the original closure attestation and remains preserved as a process defect.",
    acceptedLimitations: [
      "The late-notice process defect remains part of the permanent record.",
      "Technical verification applies only to tested systems.",
    ],
    prohibitedUses: [
      "Representing that no process defect occurred.",
      "Extending the verification to systems outside the tested scope.",
      "Treating this receipt as a substitute for current certificate verification.",
    ],
    conditions: [
      "Re-verify the certificate before any later contractual execution.",
      "Suspend reliance if the certificate state changes.",
    ],
    checks: [
      {
        label: "Certificate valid at reliance time",
        state: "PASS",
        evidence: "TA14-FCV-000014",
      },
      {
        label: "Reliance directive permits use",
        state: "PASS",
        evidence: "CURRENT_RELIANCE",
      },
      {
        label: "Limitations accepted",
        state: "PASS",
        evidence: "Relying-party acknowledgment",
      },
      {
        label: "Intended use within scope",
        state: "PASS",
        evidence: "Contractual decision scope",
      },
    ],
    relianceStatement:
      "Reliance is authorized for the stated contractual decision, subject to the listed limitations, prohibited uses, expiry, and continuous certificate-state validity.",
    revocationReason: "NONE",
    receiptDigest:
      "sha256:75ff2b58abf46e724cb10fb164ec10933786f610f70ab69d20dfac0244a86a8b",
  },
  {
    relianceReceiptId: "TA14-FCR-000009",
    certificateId: "TA14-FCERT-000012",
    verificationId: "TA14-FCV-000015",
    resolutionId: "TA14-FIN-000022",
    recordId: "TA14-AR-2026-000132",
    recordTitle: "Expired Demonstration Upload",
    state: "DECLINED",
    intendedUse: "PUBLIC_DISCLOSURE",
    relyingParty: "Registry Publisher",
    relyingPartyRole: "Public disclosure operator",
    authorizedBy: "TA-14 Reliance Desk",
    createdAt: "2026-07-17T20:34:00.000Z",
    authorizedAt: "2026-07-17T20:35:00.000Z",
    expiresAt: "NONE",
    certificateStateAtReliance: "SUSPENDED",
    verificationStateAtReliance: "SUSPENDED",
    relianceDirectiveAtReliance: "DO_NOT_RELY",
    governingStatement:
      "The prior closure remains preserved, but current reliance is suspended while a newly identified storage replica is tested.",
    acceptedLimitations: [
      "Reopened verification is incomplete.",
      "The original closure may not cover replica-east-03.",
    ],
    prohibitedUses: [
      "Publishing the certificate as valid.",
      "Representing the disposition as final.",
      "Using the certificate to authorize execution.",
    ],
    conditions: [
      "Wait for reclosure and a superseding valid certificate.",
    ],
    checks: [
      {
        label: "Certificate valid at reliance time",
        state: "FAIL",
        evidence: "Certificate state SUSPENDED",
      },
      {
        label: "Reliance directive permits use",
        state: "FAIL",
        evidence: "DO_NOT_RELY",
      },
      {
        label: "Verification complete",
        state: "FAIL",
        evidence: "Reopened verification incomplete",
      },
    ],
    relianceStatement:
      "Reliance is declined. The certificate is suspended and may not support public disclosure, execution, or any finality claim.",
    revocationReason: "NONE",
    receiptDigest:
      "sha256:9f729ce3bf74d7bcc550938a917b678a4c11734f68299a1ca0f133ce26fa31d7",
  },
  {
    relianceReceiptId: "TA14-FCR-000007",
    certificateId: "TA14-FCERT-000010",
    verificationId: "TA14-FCV-000013",
    resolutionId: "TA14-FIN-000020",
    recordId: "TA14-AR-2026-000148",
    recordTitle: "Temporary Training Demonstration Record",
    state: "CONDITIONAL",
    intendedUse: "INTERNAL_REVIEW",
    relyingParty: "Training Governance Team",
    relyingPartyRole: "Internal reviewer",
    authorizedBy: "TA-14 Reliance Desk",
    createdAt: "2026-07-17T20:20:00.000Z",
    authorizedAt: "2026-07-17T20:22:00.000Z",
    expiresAt: "2026-08-17T20:22:00.000Z",
    certificateStateAtReliance: "ISSUED",
    verificationStateAtReliance: "VALID",
    relianceDirectiveAtReliance: "CURRENT_RELIANCE",
    governingStatement:
      "The authorized disposition corresponded to the approved scope and required lineage remains preserved.",
    acceptedLimitations: [
      "Verification does not establish deletion from uncontrolled third-party copies.",
      "Certificate publication remains pending.",
    ],
    prohibitedUses: [
      "Public representation that the certificate is published.",
      "Use outside internal review.",
    ],
    conditions: [
      "Internal use only.",
      "Re-verify before external disclosure.",
    ],
    checks: [
      {
        label: "Certificate valid at reliance time",
        state: "PASS",
        evidence: "TA14-FCV-000013",
      },
      {
        label: "Certificate published",
        state: "UNKNOWN",
        evidence: "Certificate state ISSUED",
      },
      {
        label: "Intended use remains internal",
        state: "PASS",
        evidence: "INTERNAL_REVIEW",
      },
    ],
    relianceStatement:
      "Conditional reliance is permitted for internal review only. External use requires publication and a new verification receipt.",
    revocationReason: "NONE",
    receiptDigest:
      "sha256:1b85670c21a3cb19dd045912325f126495d87a58b8bd6ac21257a90d23e09b4a",
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

export default function FinalityCertificateRelianceDeskPage() {
  const [records, setRecords] = useState(initialReceipts);
  const [selectedId, setSelectedId] = useState(initialReceipts[0].relianceReceiptId);
  const [query, setQuery] = useState("");
  const [stateFilter, setStateFilter] = useState<RelianceState | "ALL">("ALL");
  const [useFilter, setUseFilter] = useState<IntendedUse | "ALL">("ALL");
  const [copied, setCopied] = useState(false);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return records.filter((record) => {
      const matchesQuery =
        !needle ||
        [
          record.relianceReceiptId,
          record.certificateId,
          record.verificationId,
          record.resolutionId,
          record.recordId,
          record.recordTitle,
          record.state,
          record.intendedUse,
          record.relyingParty,
          record.relyingPartyRole,
          record.relianceDirectiveAtReliance,
          record.relianceStatement,
          ...record.acceptedLimitations,
          ...record.prohibitedUses,
          ...record.conditions,
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
    records.find((record) => record.relianceReceiptId === selectedId) ??
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
      authorized: records.filter((item) => item.state === "AUTHORIZED").length,
      conditional: records.filter((item) => item.state === "CONDITIONAL").length,
      declined: records.filter((item) => item.state === "DECLINED").length,
      suspended: records.filter((item) => item.state === "SUSPENDED").length,
    }),
    [records],
  );

  const reliancePackage = {
    schema: "TA14_FINALITY_CERTIFICATE_RELIANCE_RECEIPT_V1",
    generatedAt: new Date().toISOString(),
    receipt: selected,
    evaluation: {
      passedChecks: selected.checks.filter((check) => check.state === "PASS")
        .length,
      failedChecks: failedChecks.length,
      unknownChecks: unknownChecks.length,
      relianceEligible:
        failedChecks.length === 0 &&
        selected.relianceDirectiveAtReliance !== "DO_NOT_RELY",
      conditionalOnly:
        unknownChecks.length > 0 && failedChecks.length === 0,
    },
    governance: {
      certificateBound: true,
      verificationBound: true,
      intendedUseBound: true,
      relyingPartyBound: true,
      limitationsAccepted: true,
      prohibitedUsesDeclared: true,
      expiryDeclared: true,
      laterRevocationSupported: true,
    },
    limitation:
      "A reliance receipt authorizes or declines only the named relying party, intended use, time window, conditions, and limitations. It does not transfer reliance authority to another party or survive a later certificate suspension, revocation, expiry, reopening, or supersession.",
  };

  function authorizeReliance() {
    if (
      failedChecks.length > 0 ||
      selected.relianceDirectiveAtReliance === "DO_NOT_RELY"
    ) {
      return;
    }

    const nextState: RelianceState =
      unknownChecks.length > 0 ? "CONDITIONAL" : "AUTHORIZED";

    setRecords((items) =>
      items.map((item) =>
        item.relianceReceiptId === selected.relianceReceiptId
          ? {
              ...item,
              state: nextState,
              authorizedAt: new Date().toISOString(),
              relianceStatement:
                nextState === "AUTHORIZED"
                  ? "Reliance is authorized for the named party and stated use, subject to the listed limitations, conditions, prohibited uses, and expiry."
                  : "Reliance is conditionally authorized for the named party and stated use because one or more checks remain unknown.",
              receiptDigest: makeDigest(
                JSON.stringify({
                  relianceReceiptId: item.relianceReceiptId,
                  certificateId: item.certificateId,
                  verificationId: item.verificationId,
                  intendedUse: item.intendedUse,
                  relyingParty: item.relyingParty,
                  conditions: item.conditions,
                  prohibitedUses: item.prohibitedUses,
                }),
              ),
            }
          : item,
      ),
    );
  }

  async function copyPackage() {
    await navigator.clipboard.writeText(JSON.stringify(reliancePackage, null, 2));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <main className="reliance-page">
      <style>{`
        * { box-sizing: border-box; }

        .reliance-page {
          min-height: calc(100vh - 68px);
          padding: 48px 0 110px;
          color: #edf6ff;
        }

        .reliance-wrap {
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
            radial-gradient(circle at 85% 7%, rgba(255, 125, 187, .15), transparent 28%),
            radial-gradient(circle at 14% 0%, rgba(72, 223, 255, .17), transparent 32%),
            linear-gradient(135deg, rgba(14, 30, 48, .97), rgba(5, 11, 20, .98));
          box-shadow: 0 38px 120px rgba(0,0,0,.35);
        }

        .hero::after {
          content: "RELY";
          position: absolute;
          right: -10px;
          bottom: -42px;
          color: rgba(255,255,255,.025);
          font-size: clamp(5rem, 13vw, 10.5rem);
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
          background: linear-gradient(100deg, #fff, #8ceaff 50%, #ff7dbb);
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
          background: linear-gradient(100deg, #56e6ff, #ff7dbb);
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

        .receipt-row {
          width: 100%;
          padding: 20px 21px;
          border: 0;
          border-bottom: 1px solid rgba(132, 177, 216, .1);
          color: inherit;
          background: transparent;
          text-align: left;
          cursor: pointer;
        }

        .receipt-row:last-child { border-bottom: 0; }

        .receipt-row.active {
          background: linear-gradient(90deg, rgba(84, 232, 255, .09), rgba(255, 125, 187, .025));
          box-shadow: inset 3px 0 0 #56e6ff;
        }

        .row-top, .meta, .detail-top {
          display: flex;
          align-items: center;
          gap: 9px;
          flex-wrap: wrap;
        }

        .row-top { justify-content: space-between; }

        .receipt-title { font-weight: 900; }

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

        .pill.AUTHORIZED, .pill.PASS {
          color: #54efae;
          border-color: rgba(84, 239, 174, .3);
        }

        .pill.CONDITIONAL, .pill.DRAFT, .pill.UNKNOWN, .pill.EXPIRED {
          color: #ffd27b;
          border-color: rgba(255, 210, 123, .3);
        }

        .pill.DECLINED, .pill.SUSPENDED, .pill.REVOKED, .pill.FAIL {
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
          border-left: 3px solid #ff7dbb;
          border-radius: 0 13px 13px 0;
          color: #91a8bd;
          background: rgba(255, 125, 187, .045);
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
          .reliance-wrap { width: min(100% - 24px, 1420px); }
          .reliance-page { padding-top: 24px; }
          .hero { padding: 28px 22px 34px; border-radius: 24px; }
          .toolbar { grid-template-columns: 1fr; }
          .metrics { grid-template-columns: 1fr 1fr; }
          .kv { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="reliance-wrap">
        <section className="hero">
          <div className="hero-content">
            <p className="eyebrow">
              TA-14 Exchange · Finality Certificate Reliance Desk
            </p>
            <h1>
              Verification is not reliance.
              <br />
              <span className="gradient">Reliance must be bounded.</span>
            </h1>
            <p className="hero-copy">
              Convert a valid certificate verification into an explicit,
              use-specific reliance decision that binds the relying party,
              intended use, accepted limitations, prohibited uses, conditions,
              expiry, and later suspension or revocation.
            </p>

            <div className="hero-actions">
              <Link
                className="button"
                href="/workspace/records/disposition/finality/certificates/verify"
              >
                Verify Certificate
              </Link>
              <Link
                className="button-secondary"
                href="/workspace/records/disposition/finality/certificates"
              >
                Open Certificate Registry
              </Link>
              <Link
                className="button-secondary"
                href="/workspace/records/reliance"
              >
                Open Record Reliance Ledger
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
            <strong>{metrics.suspended}</strong>
            <span>Suspended</span>
          </article>
        </section>

        <section className="toolbar">
          <input
            aria-label="Search reliance receipts"
            placeholder="Search receipt, certificate, party, role, use, condition, limitation, or statement"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />

          <select
            aria-label="Filter reliance state"
            value={stateFilter}
            onChange={(event) =>
              setStateFilter(event.target.value as RelianceState | "ALL")
            }
          >
            <option value="ALL">All states</option>
            <option value="DRAFT">DRAFT</option>
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
            <option value="CONTRACTUAL_DECISION">
              CONTRACTUAL_DECISION
            </option>
            <option value="REGULATORY_SUBMISSION">
              REGULATORY_SUBMISSION
            </option>
            <option value="PUBLIC_DISCLOSURE">PUBLIC_DISCLOSURE</option>
            <option value="SYSTEM_EXECUTION">SYSTEM_EXECUTION</option>
            <option value="OTHER">OTHER</option>
          </select>
        </section>

        <section className="grid">
          <div className="panel">
            <div className="panel-head">
              <strong>Reliance receipts</strong>
              <span>{filtered.length} visible</span>
            </div>

            {filtered.length ? (
              filtered.map((record) => (
                <button
                  className={`receipt-row ${
                    selected.relianceReceiptId === record.relianceReceiptId
                      ? "active"
                      : ""
                  }`}
                  key={record.relianceReceiptId}
                  type="button"
                  onClick={() => setSelectedId(record.relianceReceiptId)}
                >
                  <div className="row-top">
                    <span className="receipt-title">{record.recordTitle}</span>
                    <span className={`pill ${record.state}`}>{record.state}</span>
                  </div>
                  <div className="mono">{record.relianceReceiptId}</div>
                  <div className="meta">
                    <span>{record.intendedUse}</span>
                    <span>{record.relyingParty}</span>
                    <span>{record.certificateId}</span>
                    <span>{record.relianceDirectiveAtReliance}</span>
                  </div>
                </button>
              ))
            ) : (
              <div className="empty">
                No reliance receipt matches the current filters.
              </div>
            )}
          </div>

          <aside className="panel detail">
            <div className="detail-top">
              <span className={`pill ${selected.state}`}>{selected.state}</span>
              <span className="pill">{selected.intendedUse}</span>
              <span className="pill">
                {selected.relianceDirectiveAtReliance}
              </span>
            </div>

            <h2>{selected.recordTitle}</h2>
            <div className="mono">{selected.relianceReceiptId}</div>

            <div className="result-banner">
              <h3>{selected.relyingParty}</h3>
              <p>{selected.relianceStatement}</p>
            </div>

            <dl className="kv">
              <dt>Certificate ID</dt>
              <dd>{selected.certificateId}</dd>

              <dt>Verification ID</dt>
              <dd>{selected.verificationId}</dd>

              <dt>Resolution ID</dt>
              <dd>{selected.resolutionId}</dd>

              <dt>Record ID</dt>
              <dd>{selected.recordId}</dd>

              <dt>Relying party</dt>
              <dd>{selected.relyingParty}</dd>

              <dt>Party role</dt>
              <dd>{selected.relyingPartyRole}</dd>

              <dt>Intended use</dt>
              <dd>{selected.intendedUse}</dd>

              <dt>Authorized by</dt>
              <dd>{selected.authorizedBy}</dd>

              <dt>Created</dt>
              <dd>{formatDate(selected.createdAt)}</dd>

              <dt>Authorized</dt>
              <dd>{formatDate(selected.authorizedAt)}</dd>

              <dt>Expires</dt>
              <dd>{formatDate(selected.expiresAt)}</dd>

              <dt>Certificate state</dt>
              <dd>{selected.certificateStateAtReliance}</dd>

              <dt>Verification state</dt>
              <dd>{selected.verificationStateAtReliance}</dd>

              <dt>Revocation reason</dt>
              <dd>{selected.revocationReason}</dd>

              <dt>Receipt digest</dt>
              <dd>{selected.receiptDigest}</dd>
            </dl>

            <div className="box">
              <strong>Governing statement</strong>
              <p>{selected.governingStatement}</p>
            </div>

            <div className="box">
              <strong>Accepted limitations</strong>
              <ul>
                {selected.acceptedLimitations.map((item) => (
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

            <div className="box">
              <strong>Reliance conditions</strong>
              <ul>
                {selected.conditions.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            {selected.checks.map((check) => (
              <div className="check" key={check.label}>
                <span className={`pill ${check.state}`}>{check.state}</span>
                <div>
                  <strong>{check.label}</strong>
                  <p>{check.evidence}</p>
                </div>
              </div>
            ))}

            <div className="detail-actions">
              <button
                className="button"
                type="button"
                onClick={authorizeReliance}
                disabled={
                  failedChecks.length > 0 ||
                  selected.relianceDirectiveAtReliance === "DO_NOT_RELY"
                }
              >
                Authorize reliance
              </button>

              <button
                className="small-button"
                type="button"
                onClick={() =>
                  setRecords((items) =>
                    items.map((item) =>
                      item.relianceReceiptId === selected.relianceReceiptId
                        ? {
                            ...item,
                            state: "DECLINED",
                            relianceStatement:
                              "Reliance is declined for the stated party and intended use.",
                          }
                        : item,
                    ),
                  )
                }
              >
                Decline
              </button>

              <button
                className="small-button"
                type="button"
                onClick={() =>
                  setRecords((items) =>
                    items.map((item) =>
                      item.relianceReceiptId === selected.relianceReceiptId
                        ? {
                            ...item,
                            state: "SUSPENDED",
                            relianceStatement:
                              "Reliance is suspended pending a new certificate verification or governing-state review.",
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
                      item.relianceReceiptId === selected.relianceReceiptId
                        ? {
                            ...item,
                            state: "REVOKED",
                            revocationReason:
                              "Reliance authority withdrawn by the Reliance Desk.",
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
                {copied ? "Copied" : "Copy reliance receipt"}
              </button>

              <button
                className="small-button"
                type="button"
                onClick={() =>
                  downloadJson(
                    `${selected.relianceReceiptId.toLowerCase()}-certificate-reliance.json`,
                    reliancePackage,
                  )
                }
              >
                Download receipt
              </button>
            </div>

            <div className="notice">
              A valid certificate does not create unlimited reliance. The
              relying party, intended use, accepted limitations, conditions,
              prohibited uses, and time window must all remain explicit and
              reviewable.
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
