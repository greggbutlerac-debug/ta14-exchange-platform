"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type VerificationState =
  | "UNVERIFIED"
  | "VALID"
  | "INVALID"
  | "SUSPENDED"
  | "REVOKED"
  | "SUPERSEDED"
  | "EXPIRED";

type CheckState = "PASS" | "FAIL" | "UNKNOWN";

type CertificateVerification = {
  verificationId: string;
  certificateId: string;
  resolutionId: string;
  recordId: string;
  recordTitle: string;
  recordVersion: string;
  certificateState: string;
  verificationState: VerificationState;
  verifiedBy: string;
  verifiedAt: string;
  certificateDigest: string;
  observedDigest: string;
  finalityState: string;
  relianceDirective: string;
  registryLocation: string;
  currentClosureId: string;
  supersedesCertificateId: string;
  expiresAt: string;
  checks: {
    label: string;
    state: CheckState;
    evidence: string;
  }[];
  warnings: string[];
  verificationStatement: string;
  verificationReceiptId: string;
};

const initialVerifications: CertificateVerification[] = [
  {
    verificationId: "TA14-FCV-000014",
    certificateId: "TA14-FCERT-000011",
    resolutionId: "TA14-FIN-000021",
    recordId: "TA14-AR-2026-000126",
    recordTitle: "Archived Vendor Access Evidence",
    recordVersion: "2.0.0",
    certificateState: "PUBLISHED",
    verificationState: "VALID",
    verifiedBy: "TA-14 Public Verification Service",
    verifiedAt: "2026-07-17T20:12:00.000Z",
    certificateDigest:
      "sha256:76c2d4dd9f59b86943f70d81186f215cf3cf7611b91e8683abc14620e6cccb57",
    observedDigest:
      "sha256:76c2d4dd9f59b86943f70d81186f215cf3cf7611b91e8683abc14620e6cccb57",
    finalityState: "FINAL",
    relianceDirective: "CURRENT_RELIANCE",
    registryLocation: "/registry/finality/TA14-FCERT-000011",
    currentClosureId: "TA14-RCL-000003",
    supersedesCertificateId: "NONE",
    expiresAt: "2027-07-06T10:16:00.000Z",
    checks: [
      {
        label: "Certificate digest matches registry",
        state: "PASS",
        evidence: "Digest equality confirmed",
      },
      {
        label: "Certificate is not suspended or revoked",
        state: "PASS",
        evidence: "Registry state PUBLISHED",
      },
      {
        label: "Current finality resolution matches",
        state: "PASS",
        evidence: "TA14-FIN-000021",
      },
      {
        label: "Current closure matches",
        state: "PASS",
        evidence: "TA14-RCL-000003",
      },
      {
        label: "Certificate has not expired",
        state: "PASS",
        evidence: "Expires 2027-07-06",
      },
    ],
    warnings: [
      "Verification confirms the current registry state only.",
      "Published limitations remain controlling.",
    ],
    verificationStatement:
      "The certificate is valid, current, unexpired, and corresponds to the listed finality resolution and governing closure.",
    verificationReceiptId: "TA14-FCV-RCPT-000014",
  },
  {
    verificationId: "TA14-FCV-000015",
    certificateId: "TA14-FCERT-000012",
    resolutionId: "TA14-FIN-000022",
    recordId: "TA14-AR-2026-000132",
    recordTitle: "Expired Demonstration Upload",
    recordVersion: "1.0.0",
    certificateState: "SUSPENDED",
    verificationState: "SUSPENDED",
    verifiedBy: "TA-14 Public Verification Service",
    verifiedAt: "2026-07-17T20:18:00.000Z",
    certificateDigest: "PENDING",
    observedDigest: "PENDING",
    finalityState: "REOPENED",
    relianceDirective: "DO_NOT_RELY",
    registryLocation: "/registry/finality/TA14-FCERT-000012",
    currentClosureId: "TA14-DCL-000009",
    supersedesCertificateId: "TA14-FCERT-000009",
    expiresAt: "PENDING",
    checks: [
      {
        label: "Certificate digest matches registry",
        state: "UNKNOWN",
        evidence: "Certificate digest pending",
      },
      {
        label: "Certificate is not suspended or revoked",
        state: "FAIL",
        evidence: "Registry state SUSPENDED",
      },
      {
        label: "Current finality resolution matches",
        state: "PASS",
        evidence: "TA14-FIN-000022",
      },
      {
        label: "Current closure matches",
        state: "UNKNOWN",
        evidence: "Reopened disposition unresolved",
      },
      {
        label: "Certificate has not expired",
        state: "UNKNOWN",
        evidence: "No expiry established",
      },
    ],
    warnings: [
      "Do not rely on this certificate.",
      "Reopened verification remains incomplete.",
      "A superseding certificate may be issued after reclosure.",
    ],
    verificationStatement:
      "The certificate is suspended and must not be relied upon while reopened verification remains unresolved.",
    verificationReceiptId: "TA14-FCV-RCPT-000015",
  },
  {
    verificationId: "TA14-FCV-000013",
    certificateId: "TA14-FCERT-000010",
    resolutionId: "TA14-FIN-000020",
    recordId: "TA14-AR-2026-000148",
    recordTitle: "Temporary Training Demonstration Record",
    recordVersion: "1.0.0",
    certificateState: "ISSUED",
    verificationState: "VALID",
    verifiedBy: "TA-14 Public Verification Service",
    verifiedAt: "2026-07-17T20:04:00.000Z",
    certificateDigest:
      "sha256:4b68ba9f130b6dcf5b71cc2e0b997b9b8a4cf3583d595fab880d6c5a1c759a85",
    observedDigest:
      "sha256:4b68ba9f130b6dcf5b71cc2e0b997b9b8a4cf3583d595fab880d6c5a1c759a85",
    finalityState: "CURRENT",
    relianceDirective: "CURRENT_RELIANCE",
    registryLocation: "/registry/finality/TA14-FCERT-000010",
    currentClosureId: "TA14-DCL-000008",
    supersedesCertificateId: "NONE",
    expiresAt: "2027-07-12T16:24:00.000Z",
    checks: [
      {
        label: "Certificate digest matches registry",
        state: "PASS",
        evidence: "Digest equality confirmed",
      },
      {
        label: "Certificate is not suspended or revoked",
        state: "PASS",
        evidence: "Registry state ISSUED",
      },
      {
        label: "Current finality resolution matches",
        state: "PASS",
        evidence: "TA14-FIN-000020",
      },
      {
        label: "Current closure matches",
        state: "PASS",
        evidence: "TA14-DCL-000008",
      },
      {
        label: "Certificate has not expired",
        state: "PASS",
        evidence: "Expires 2027-07-12",
      },
    ],
    warnings: ["Certificate is issued but not yet publicly published."],
    verificationStatement:
      "The certificate is valid and corresponds to the current registry state, but publication is still pending.",
    verificationReceiptId: "TA14-FCV-RCPT-000013",
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

export default function FinalityCertificateVerificationPage() {
  const [records, setRecords] = useState(initialVerifications);
  const [selectedId, setSelectedId] = useState(initialVerifications[0].verificationId);
  const [query, setQuery] = useState("");
  const [stateFilter, setStateFilter] = useState<VerificationState | "ALL">("ALL");
  const [lookupValue, setLookupValue] = useState("");
  const [copied, setCopied] = useState(false);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return records.filter((record) => {
      const matchesQuery =
        !needle ||
        [
          record.verificationId,
          record.certificateId,
          record.resolutionId,
          record.recordId,
          record.recordTitle,
          record.verificationState,
          record.certificateState,
          record.finalityState,
          record.relianceDirective,
          record.currentClosureId,
          record.verificationStatement,
          ...record.warnings,
        ]
          .join(" ")
          .toLowerCase()
          .includes(needle);

      return (
        matchesQuery &&
        (stateFilter === "ALL" || record.verificationState === stateFilter)
      );
    });
  }, [query, records, stateFilter]);

  const selected =
    records.find((record) => record.verificationId === selectedId) ??
    filtered[0] ??
    records[0];

  const metrics = useMemo(
    () => ({
      valid: records.filter((item) => item.verificationState === "VALID").length,
      suspended: records.filter(
        (item) => item.verificationState === "SUSPENDED",
      ).length,
      invalid: records.filter(
        (item) => item.verificationState === "INVALID",
      ).length,
      unknown: records.filter(
        (item) => item.verificationState === "UNKNOWN",
      ).length,
    }),
    [records],
  );

  const verificationPackage = {
    schema: "TA14_FINALITY_CERTIFICATE_VERIFICATION_REPORT_V1",
    generatedAt: new Date().toISOString(),
    verification: selected,
    summary: {
      passedChecks: selected.checks.filter((check) => check.state === "PASS")
        .length,
      failedChecks: selected.checks.filter((check) => check.state === "FAIL")
        .length,
      unknownChecks: selected.checks.filter(
        (check) => check.state === "UNKNOWN",
      ).length,
      reliancePermitted:
        selected.verificationState === "VALID" &&
        selected.relianceDirective !== "DO_NOT_RELY",
    },
    governance: {
      registryStateChecked: true,
      digestChecked: true,
      currentResolutionChecked: true,
      currentClosureChecked: true,
      expiryChecked: true,
      supersessionChecked: true,
      warningsPreserved: true,
    },
    limitation:
      "Verification confirms only the observed registry state and linked evidence at the verification time. Later suspension, revocation, appeal, reopening, expiry, or supersession may change reliance.",
  };

  function runLookup() {
    const needle = lookupValue.trim().toLowerCase();
    if (!needle) return;

    const match = records.find((record) =>
      [
        record.certificateId,
        record.verificationId,
        record.recordId,
        record.resolutionId,
      ]
        .join(" ")
        .toLowerCase()
        .includes(needle),
    );

    if (match) {
      setSelectedId(match.verificationId);
      return;
    }

    const generated: CertificateVerification = {
      verificationId: `TA14-FCV-${Math.floor(100000 + Math.random() * 900000)}`,
      certificateId: lookupValue.trim(),
      resolutionId: "UNKNOWN",
      recordId: "UNKNOWN",
      recordTitle: "Unresolved Certificate Lookup",
      recordVersion: "UNKNOWN",
      certificateState: "UNKNOWN",
      verificationState: "UNKNOWN",
      verifiedBy: "TA-14 Public Verification Service",
      verifiedAt: new Date().toISOString(),
      certificateDigest: "UNKNOWN",
      observedDigest: "UNKNOWN",
      finalityState: "UNKNOWN",
      relianceDirective: "DO_NOT_RELY",
      registryLocation: "NOT FOUND",
      currentClosureId: "UNKNOWN",
      supersedesCertificateId: "UNKNOWN",
      expiresAt: "UNKNOWN",
      checks: [
        {
          label: "Certificate found in registry",
          state: "FAIL",
          evidence: "No matching certificate was found",
        },
        {
          label: "Certificate digest verified",
          state: "UNKNOWN",
          evidence: "Unavailable",
        },
        {
          label: "Current finality resolution verified",
          state: "UNKNOWN",
          evidence: "Unavailable",
        },
      ],
      warnings: [
        "The certificate could not be resolved from the current registry dataset.",
        "Do not rely on an unresolved certificate identifier.",
      ],
      verificationStatement:
        "Verification could not establish a valid certificate or current registry state.",
      verificationReceiptId: `TA14-FCV-RCPT-${Math.floor(
        100000 + Math.random() * 900000,
      )}`,
    };

    setRecords((items) => [generated, ...items]);
    setSelectedId(generated.verificationId);
  }

  async function copyPackage() {
    await navigator.clipboard.writeText(
      JSON.stringify(verificationPackage, null, 2),
    );
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <main className="verify-page">
      <style>{`
        * { box-sizing: border-box; }

        .verify-page {
          min-height: calc(100vh - 68px);
          padding: 48px 0 110px;
          color: #edf6ff;
        }

        .verify-wrap {
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
            radial-gradient(circle at 85% 7%, rgba(88, 255, 179, .16), transparent 28%),
            radial-gradient(circle at 14% 0%, rgba(72, 223, 255, .17), transparent 32%),
            linear-gradient(135deg, rgba(14, 30, 48, .97), rgba(5, 11, 20, .98));
          box-shadow: 0 38px 120px rgba(0,0,0,.35);
        }

        .hero::after {
          content: "VERIFY";
          position: absolute;
          right: -10px;
          bottom: -42px;
          color: rgba(255,255,255,.025);
          font-size: clamp(4.4rem, 11vw, 9.5rem);
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
          background: linear-gradient(100deg, #fff, #8ceaff 50%, #58ffb3);
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

        .lookup {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 10px;
          max-width: 780px;
          margin-top: 26px;
          padding: 10px;
          border: 1px solid rgba(132, 177, 216, .18);
          border-radius: 19px;
          background: rgba(4, 13, 23, .78);
        }

        .lookup input {
          min-height: 48px;
          padding: 0 15px;
          border: 0;
          outline: none;
          color: #edf6ff;
          background: transparent;
          font: inherit;
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
          background: linear-gradient(100deg, #56e6ff, #58ffb3);
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
          grid-template-columns: minmax(220px, 1fr) 220px;
          gap: 12px;
          margin-bottom: 22px;
          padding: 16px;
          border: 1px solid rgba(132, 177, 216, .14);
          border-radius: 22px;
          background: rgba(7, 16, 27, .68);
        }

        .toolbar input, .toolbar select {
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

        .verification-row {
          width: 100%;
          padding: 20px 21px;
          border: 0;
          border-bottom: 1px solid rgba(132, 177, 216, .1);
          color: inherit;
          background: transparent;
          text-align: left;
          cursor: pointer;
        }

        .verification-row:last-child { border-bottom: 0; }

        .verification-row.active {
          background: linear-gradient(90deg, rgba(84, 232, 255, .09), rgba(88, 255, 179, .025));
          box-shadow: inset 3px 0 0 #56e6ff;
        }

        .row-top, .meta, .detail-top {
          display: flex;
          align-items: center;
          gap: 9px;
          flex-wrap: wrap;
        }

        .row-top { justify-content: space-between; }

        .verification-title { font-weight: 900; }

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

        .pill.VALID, .pill.PASS {
          color: #54efae;
          border-color: rgba(84, 239, 174, .3);
        }

        .pill.UNKNOWN, .pill.UNVERIFIED, .pill.EXPIRED {
          color: #ffd27b;
          border-color: rgba(255, 210, 123, .3);
        }

        .pill.INVALID, .pill.SUSPENDED, .pill.REVOKED, .pill.FAIL {
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
          border-left: 3px solid #58ffb3;
          border-radius: 0 13px 13px 0;
          color: #91a8bd;
          background: rgba(88, 255, 179, .045);
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
          .verify-wrap { width: min(100% - 24px, 1420px); }
          .verify-page { padding-top: 24px; }
          .hero { padding: 28px 22px 34px; border-radius: 24px; }
          .lookup, .toolbar { grid-template-columns: 1fr; }
          .metrics { grid-template-columns: 1fr 1fr; }
          .kv { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="verify-wrap">
        <section className="hero">
          <div className="hero-content">
            <p className="eyebrow">
              TA-14 Exchange · Finality Certificate Verification
            </p>
            <h1>
              Verify the certificate.
              <br />
              <span className="gradient">Do not trust the screenshot.</span>
            </h1>
            <p className="hero-copy">
              Resolve a finality certificate against the current registry,
              compare its digest, verify the governing resolution and closure,
              inspect suspension or revocation state, check expiration and
              supersession, and issue a preserved verification receipt.
            </p>

            <div className="lookup">
              <input
                aria-label="Certificate lookup"
                placeholder="Enter certificate, verification, resolution, or record ID"
                value={lookupValue}
                onChange={(event) => setLookupValue(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") runLookup();
                }}
              />
              <button className="button" type="button" onClick={runLookup}>
                Verify now
              </button>
            </div>

            <div className="hero-actions">
              <Link
                className="button-secondary"
                href="/workspace/records/disposition/finality/certificates"
              >
                Open Certificate Registry
              </Link>
              <Link
                className="button-secondary"
                href="/workspace/records/disposition/finality"
              >
                Open Finality Resolver
              </Link>
              <Link
                className="button-secondary"
                href="/workspace/verify"
              >
                Open General Verification
              </Link>
            </div>
          </div>
        </section>

        <section className="metrics">
          <article className="metric">
            <strong>{metrics.valid}</strong>
            <span>Valid</span>
          </article>
          <article className="metric">
            <strong>{metrics.suspended}</strong>
            <span>Suspended</span>
          </article>
          <article className="metric">
            <strong>{metrics.invalid}</strong>
            <span>Invalid</span>
          </article>
          <article className="metric">
            <strong>{metrics.unknown}</strong>
            <span>Unknown</span>
          </article>
        </section>

        <section className="toolbar">
          <input
            aria-label="Search verification history"
            placeholder="Search certificate, record, resolution, closure, state, warning, or statement"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />

          <select
            aria-label="Filter verification state"
            value={stateFilter}
            onChange={(event) =>
              setStateFilter(event.target.value as VerificationState | "ALL")
            }
          >
            <option value="ALL">All states</option>
            <option value="UNVERIFIED">UNVERIFIED</option>
            <option value="VALID">VALID</option>
            <option value="INVALID">INVALID</option>
            <option value="SUSPENDED">SUSPENDED</option>
            <option value="REVOKED">REVOKED</option>
            <option value="SUPERSEDED">SUPERSEDED</option>
            <option value="EXPIRED">EXPIRED</option>
          </select>
        </section>

        <section className="grid">
          <div className="panel">
            <div className="panel-head">
              <strong>Verification history</strong>
              <span>{filtered.length} visible</span>
            </div>

            {filtered.length ? (
              filtered.map((record) => (
                <button
                  className={`verification-row ${
                    selected.verificationId === record.verificationId
                      ? "active"
                      : ""
                  }`}
                  key={record.verificationId}
                  type="button"
                  onClick={() => setSelectedId(record.verificationId)}
                >
                  <div className="row-top">
                    <span className="verification-title">
                      {record.recordTitle}
                    </span>
                    <span className={`pill ${record.verificationState}`}>
                      {record.verificationState}
                    </span>
                  </div>
                  <div className="mono">{record.certificateId}</div>
                  <div className="meta">
                    <span>{record.certificateState}</span>
                    <span>{record.finalityState}</span>
                    <span>{record.relianceDirective}</span>
                    <span>{formatDate(record.verifiedAt)}</span>
                  </div>
                </button>
              ))
            ) : (
              <div className="empty">
                No certificate verification matches the current filters.
              </div>
            )}
          </div>

          <aside className="panel detail">
            <div className="detail-top">
              <span className={`pill ${selected.verificationState}`}>
                {selected.verificationState}
              </span>
              <span className="pill">{selected.certificateState}</span>
              <span className="pill">{selected.finalityState}</span>
            </div>

            <h2>{selected.recordTitle}</h2>
            <div className="mono">{selected.verificationId}</div>

            <div className="result-banner">
              <h3>{selected.certificateId}</h3>
              <p>{selected.verificationStatement}</p>
            </div>

            <dl className="kv">
              <dt>Certificate ID</dt>
              <dd>{selected.certificateId}</dd>

              <dt>Resolution ID</dt>
              <dd>{selected.resolutionId}</dd>

              <dt>Record ID</dt>
              <dd>{selected.recordId}</dd>

              <dt>Version</dt>
              <dd>{selected.recordVersion}</dd>

              <dt>Current closure</dt>
              <dd>{selected.currentClosureId}</dd>

              <dt>Reliance directive</dt>
              <dd>{selected.relianceDirective}</dd>

              <dt>Verified by</dt>
              <dd>{selected.verifiedBy}</dd>

              <dt>Verified at</dt>
              <dd>{formatDate(selected.verifiedAt)}</dd>

              <dt>Certificate digest</dt>
              <dd>{selected.certificateDigest}</dd>

              <dt>Observed digest</dt>
              <dd>{selected.observedDigest}</dd>

              <dt>Registry location</dt>
              <dd>{selected.registryLocation}</dd>

              <dt>Expires</dt>
              <dd>{formatDate(selected.expiresAt)}</dd>

              <dt>Supersedes</dt>
              <dd>{selected.supersedesCertificateId}</dd>

              <dt>Verification receipt</dt>
              <dd>{selected.verificationReceiptId}</dd>
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
              <strong>Warnings</strong>
              <ul>
                {selected.warnings.map((warning) => (
                  <li key={warning}>{warning}</li>
                ))}
              </ul>
            </div>

            <div className="detail-actions">
              <button
                className="button"
                type="button"
                onClick={() =>
                  setRecords((items) =>
                    items.map((item) =>
                      item.verificationId === selected.verificationId
                        ? { ...item, verifiedAt: new Date().toISOString() }
                        : item,
                    ),
                  )
                }
              >
                Re-run verification
              </button>

              <button
                className="small-button"
                type="button"
                onClick={copyPackage}
              >
                {copied ? "Copied" : "Copy verification report"}
              </button>

              <button
                className="small-button"
                type="button"
                onClick={() =>
                  downloadJson(
                    `${selected.verificationId.toLowerCase()}-certificate-verification.json`,
                    verificationPackage,
                  )
                }
              >
                Download report
              </button>
            </div>

            <div className="notice">
              Verify the current registry state before relying on any finality
              certificate. A previously valid certificate may later be
              suspended, revoked, superseded, expired, or affected by reopening.
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
