"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type CertificateState =
  | "DRAFT"
  | "ISSUED"
  | "PUBLISHED"
  | "SUSPENDED"
  | "REVOKED"
  | "SUPERSEDED";

type CertificateScope =
  | "PRIVATE"
  | "PARTIES_ONLY"
  | "REGISTRY_SUMMARY"
  | "PUBLIC_CERTIFICATE";

type ValidationState = "VALID" | "INVALID" | "UNKNOWN" | "EXPIRED";

type FinalityCertificate = {
  certificateId: string;
  resolutionId: string;
  recordId: string;
  recordTitle: string;
  recordVersion: string;
  dispositionId: string;
  currentClosureId: string;
  state: CertificateState;
  scope: CertificateScope;
  validationState: ValidationState;
  issuedBy: string;
  issuerRole: string;
  issuedAt: string;
  publishedAt: string;
  expiresAt: string;
  finalityState: string;
  relianceDirective: string;
  governingStatement: string;
  limitations: string[];
  bindingReceipts: string[];
  historicalReceipts: string[];
  verificationChecks: {
    label: string;
    status: ValidationState;
    evidence: string;
  }[];
  certificateDigest: string;
  publicRegistryUrl: string;
  supersedesCertificateId: string;
};

const initialCertificates: FinalityCertificate[] = [
  {
    certificateId: "TA14-FCERT-000011",
    resolutionId: "TA14-FIN-000021",
    recordId: "TA14-AR-2026-000126",
    recordTitle: "Archived Vendor Access Evidence",
    recordVersion: "2.0.0",
    dispositionId: "TA14-RDP-000015",
    currentClosureId: "TA14-RCL-000003",
    state: "PUBLISHED",
    scope: "PUBLIC_CERTIFICATE",
    validationState: "VALID",
    issuedBy: "TA-14 Finality Registry",
    issuerRole: "Finality certificate authority",
    issuedAt: "2026-07-06T10:16:00.000Z",
    publishedAt: "2026-07-06T10:18:00.000Z",
    expiresAt: "2027-07-06T10:16:00.000Z",
    finalityState: "FINAL",
    relianceDirective: "CURRENT_RELIANCE",
    governingStatement:
      "The technical disposition was completed and independently verified. A required affected-party notice occurred after the original closure attestation and remains preserved as a process defect.",
    limitations: [
      "The late-notice process defect remains part of the permanent record.",
      "Technical verification applies only to tested systems.",
    ],
    bindingReceipts: [
      "TA14-FIN-000021",
      "TA14-RCL-000003",
      "TA14-DCA-RES-000004",
      "TA14-DVR-000015",
    ],
    historicalReceipts: [
      "TA14-DCL-000007",
      "TA14-DCA-000004",
      "TA14-DRM-000008",
    ],
    verificationChecks: [
      {
        label: "Finality resolution digest",
        status: "VALID",
        evidence: "TA14-FIN-000021",
      },
      {
        label: "Current closure correspondence",
        status: "VALID",
        evidence: "TA14-RCL-000003",
      },
      {
        label: "Reliance directive correspondence",
        status: "VALID",
        evidence: "CURRENT_RELIANCE",
      },
      {
        label: "Historical lineage preserved",
        status: "VALID",
        evidence: "Registry lineage scan",
      },
    ],
    certificateDigest:
      "sha256:76c2d4dd9f59b86943f70d81186f215cf3cf7611b91e8683abc14620e6cccb57",
    publicRegistryUrl: "/registry/finality/TA14-FCERT-000011",
    supersedesCertificateId: "NONE",
  },
  {
    certificateId: "TA14-FCERT-000012",
    resolutionId: "TA14-FIN-000022",
    recordId: "TA14-AR-2026-000132",
    recordTitle: "Expired Demonstration Upload",
    recordVersion: "1.0.0",
    dispositionId: "TA14-RDP-000016",
    currentClosureId: "TA14-DCL-000009",
    state: "SUSPENDED",
    scope: "REGISTRY_SUMMARY",
    validationState: "INVALID",
    issuedBy: "TA-14 Finality Registry",
    issuerRole: "Finality certificate authority",
    issuedAt: "2026-07-17T19:35:00.000Z",
    publishedAt: "2026-07-17T19:36:00.000Z",
    expiresAt: "PENDING",
    finalityState: "REOPENED",
    relianceDirective: "DO_NOT_RELY",
    governingStatement:
      "The prior closure remains preserved, but current reliance is suspended while a newly identified storage replica is tested.",
    limitations: [
      "The original closure may not have covered replica-east-03.",
      "No finality claim may be relied upon while reopened verification remains incomplete.",
    ],
    bindingReceipts: [
      "TA14-FIN-000022",
      "TA14-DCA-000006",
      "TA14-RCL-000004",
    ],
    historicalReceipts: [
      "TA14-DCL-000009",
      "TA14-DVR-000016",
      "TA14-DRM-000009",
    ],
    verificationChecks: [
      {
        label: "Finality resolution digest",
        status: "UNKNOWN",
        evidence: "PENDING",
      },
      {
        label: "Reopened verification complete",
        status: "INVALID",
        evidence: "PENDING",
      },
      {
        label: "Reliance directive correspondence",
        status: "VALID",
        evidence: "DO_NOT_RELY",
      },
      {
        label: "Historical lineage preserved",
        status: "VALID",
        evidence: "Registry lineage scan",
      },
    ],
    certificateDigest: "PENDING",
    publicRegistryUrl: "/registry/finality/TA14-FCERT-000012",
    supersedesCertificateId: "TA14-FCERT-000009",
  },
  {
    certificateId: "TA14-FCERT-000010",
    resolutionId: "TA14-FIN-000020",
    recordId: "TA14-AR-2026-000148",
    recordTitle: "Temporary Training Demonstration Record",
    recordVersion: "1.0.0",
    dispositionId: "TA14-RDP-000019",
    currentClosureId: "TA14-DCL-000008",
    state: "ISSUED",
    scope: "REGISTRY_SUMMARY",
    validationState: "VALID",
    issuedBy: "TA-14 Finality Registry",
    issuerRole: "Finality certificate authority",
    issuedAt: "2026-07-12T16:24:00.000Z",
    publishedAt: "PENDING",
    expiresAt: "2027-07-12T16:24:00.000Z",
    finalityState: "CURRENT",
    relianceDirective: "CURRENT_RELIANCE",
    governingStatement:
      "The authorized disposition corresponded to the approved scope and required lineage remains preserved.",
    limitations: [
      "Verification does not establish deletion from uncontrolled third-party copies.",
    ],
    bindingReceipts: [
      "TA14-FIN-000020",
      "TA14-DCL-000008",
      "TA14-DVR-000019",
    ],
    historicalReceipts: ["TA14-DCA-000005"],
    verificationChecks: [
      {
        label: "Finality resolution digest",
        status: "VALID",
        evidence: "TA14-FIN-000020",
      },
      {
        label: "Current closure correspondence",
        status: "VALID",
        evidence: "TA14-DCL-000008",
      },
      {
        label: "Appeal status resolved",
        status: "VALID",
        evidence: "TA14-DCA-000005",
      },
    ],
    certificateDigest:
      "sha256:4b68ba9f130b6dcf5b71cc2e0b997b9b8a4cf3583d595fab880d6c5a1c759a85",
    publicRegistryUrl: "/registry/finality/TA14-FCERT-000010",
    supersedesCertificateId: "NONE",
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

export default function FinalityCertificateRegistryPage() {
  const [records, setRecords] = useState(initialCertificates);
  const [selectedId, setSelectedId] = useState(initialCertificates[0].certificateId);
  const [query, setQuery] = useState("");
  const [stateFilter, setStateFilter] = useState<CertificateState | "ALL">("ALL");
  const [validationFilter, setValidationFilter] = useState<
    ValidationState | "ALL"
  >("ALL");
  const [copied, setCopied] = useState(false);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return records.filter((record) => {
      const matchesQuery =
        !needle ||
        [
          record.certificateId,
          record.resolutionId,
          record.recordId,
          record.recordTitle,
          record.dispositionId,
          record.currentClosureId,
          record.state,
          record.scope,
          record.validationState,
          record.finalityState,
          record.relianceDirective,
          record.issuedBy,
          record.governingStatement,
          ...record.bindingReceipts,
          ...record.historicalReceipts,
        ]
          .join(" ")
          .toLowerCase()
          .includes(needle);

      return (
        matchesQuery &&
        (stateFilter === "ALL" || record.state === stateFilter) &&
        (validationFilter === "ALL" ||
          record.validationState === validationFilter)
      );
    });
  }, [query, records, stateFilter, validationFilter]);

  const selected =
    records.find((record) => record.certificateId === selectedId) ??
    filtered[0] ??
    records[0];

  const invalidChecks = selected.verificationChecks.filter(
    (check) => check.status === "INVALID",
  );
  const unknownChecks = selected.verificationChecks.filter(
    (check) => check.status === "UNKNOWN",
  );

  const metrics = useMemo(
    () => ({
      published: records.filter((item) => item.state === "PUBLISHED").length,
      issued: records.filter((item) => item.state === "ISSUED").length,
      suspended: records.filter((item) => item.state === "SUSPENDED").length,
      valid: records.filter((item) => item.validationState === "VALID").length,
    }),
    [records],
  );

  const certificatePackage = {
    schema: "TA14_DISPOSITION_FINALITY_CERTIFICATE_V1",
    generatedAt: new Date().toISOString(),
    certificate: selected,
    validation: {
      validChecks: selected.verificationChecks.filter(
        (check) => check.status === "VALID",
      ).length,
      invalidChecks: invalidChecks.length,
      unknownChecks: unknownChecks.length,
      issueEligible:
        invalidChecks.length === 0 &&
        unknownChecks.length === 0 &&
        selected.finalityState !== "REOPENED",
      publishEligible:
        invalidChecks.length === 0 &&
        unknownChecks.length === 0 &&
        ["ISSUED", "PUBLISHED"].includes(selected.state),
    },
    governance: {
      finalityResolutionBound: true,
      currentClosureBound: true,
      relianceDirectiveBound: true,
      historicalReceiptsPreserved: true,
      limitationsPublished: true,
      supersessionExplicit: true,
      certificateRevocationSupported: true,
    },
    limitation:
      "A finality certificate represents the current registry state and listed evidence at issuance. It does not erase preserved history or prevent later suspension, revocation, appeal, reopening, or supersession.",
  };

  function issueCertificate() {
    if (
      invalidChecks.length > 0 ||
      unknownChecks.length > 0 ||
      selected.finalityState === "REOPENED"
    ) {
      return;
    }

    setRecords((items) =>
      items.map((item) =>
        item.certificateId === selected.certificateId
          ? {
              ...item,
              state: "ISSUED",
              validationState: "VALID",
              issuedAt: new Date().toISOString(),
              certificateDigest: makeDigest(
                JSON.stringify({
                  certificateId: item.certificateId,
                  resolutionId: item.resolutionId,
                  currentClosureId: item.currentClosureId,
                  governingStatement: item.governingStatement,
                  limitations: item.limitations,
                  bindingReceipts: item.bindingReceipts,
                }),
              ),
            }
          : item,
      ),
    );
  }

  function publishCertificate() {
    if (
      invalidChecks.length > 0 ||
      unknownChecks.length > 0 ||
      !["ISSUED", "PUBLISHED"].includes(selected.state)
    ) {
      return;
    }

    setRecords((items) =>
      items.map((item) =>
        item.certificateId === selected.certificateId
          ? {
              ...item,
              state: "PUBLISHED",
              publishedAt: new Date().toISOString(),
              validationState: "VALID",
            }
          : item,
      ),
    );
  }

  async function copyPackage() {
    await navigator.clipboard.writeText(
      JSON.stringify(certificatePackage, null, 2),
    );
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <main className="certificate-page">
      <style>{`
        * { box-sizing: border-box; }

        .certificate-page {
          min-height: calc(100vh - 68px);
          padding: 48px 0 110px;
          color: #edf6ff;
        }

        .certificate-wrap {
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
            radial-gradient(circle at 85% 7%, rgba(255, 214, 92, .16), transparent 28%),
            radial-gradient(circle at 14% 0%, rgba(72, 223, 255, .17), transparent 32%),
            linear-gradient(135deg, rgba(14, 30, 48, .97), rgba(5, 11, 20, .98));
          box-shadow: 0 38px 120px rgba(0,0,0,.35);
        }

        .hero::after {
          content: "CERTIFIED";
          position: absolute;
          right: -10px;
          bottom: -42px;
          color: rgba(255,255,255,.025);
          font-size: clamp(3.8rem, 9vw, 8.6rem);
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
          background: linear-gradient(100deg, #fff, #8ceaff 50%, #ffd65c);
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
          background: linear-gradient(100deg, #56e6ff, #ffd65c);
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
          grid-template-columns: minmax(220px, 1fr) 220px 220px;
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

        .certificate-row {
          width: 100%;
          padding: 20px 21px;
          border: 0;
          border-bottom: 1px solid rgba(132, 177, 216, .1);
          color: inherit;
          background: transparent;
          text-align: left;
          cursor: pointer;
        }

        .certificate-row:last-child { border-bottom: 0; }

        .certificate-row.active {
          background: linear-gradient(90deg, rgba(84, 232, 255, .09), rgba(255, 214, 92, .025));
          box-shadow: inset 3px 0 0 #56e6ff;
        }

        .row-top, .meta, .detail-top {
          display: flex;
          align-items: center;
          gap: 9px;
          flex-wrap: wrap;
        }

        .row-top { justify-content: space-between; }

        .certificate-title { font-weight: 900; }

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

        .pill.PUBLISHED, .pill.ISSUED, .pill.VALID {
          color: #54efae;
          border-color: rgba(84, 239, 174, .3);
        }

        .pill.DRAFT, .pill.UNKNOWN, .pill.EXPIRED {
          color: #ffd27b;
          border-color: rgba(255, 210, 123, .3);
        }

        .pill.SUSPENDED, .pill.REVOKED, .pill.INVALID {
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

        .certificate-card {
          margin-top: 20px;
          padding: 22px;
          border: 1px solid rgba(255, 214, 92, .24);
          border-radius: 21px;
          background:
            linear-gradient(135deg, rgba(255, 214, 92, .07), rgba(86, 230, 255, .035)),
            rgba(2, 9, 16, .65);
        }

        .certificate-card h3 {
          margin: 0;
          font-size: 1.2rem;
          letter-spacing: -.025em;
        }

        .certificate-card p {
          margin: 13px 0 0;
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
          border-left: 3px solid #ffd65c;
          border-radius: 0 13px 13px 0;
          color: #91a8bd;
          background: rgba(255, 214, 92, .045);
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
          .certificate-wrap { width: min(100% - 24px, 1420px); }
          .certificate-page { padding-top: 24px; }
          .hero { padding: 28px 22px 34px; border-radius: 24px; }
          .toolbar { grid-template-columns: 1fr; }
          .metrics { grid-template-columns: 1fr 1fr; }
          .kv { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="certificate-wrap">
        <section className="hero">
          <div className="hero-content">
            <p className="eyebrow">
              TA-14 Exchange · Finality Certificate Registry
            </p>
            <h1>
              Publish the current truth.
              <br />
              <span className="gradient">Keep the entire history attached.</span>
            </h1>
            <p className="hero-copy">
              Issue, validate, publish, suspend, revoke, or supersede a finality
              certificate that binds the current resolution, governing closure,
              reliance directive, limitations, and preserved historical receipts
              into one independently reviewable registry artifact.
            </p>

            <div className="hero-actions">
              <Link
                className="button"
                href="/workspace/records/disposition/finality"
              >
                Open Finality Resolver
              </Link>
              <Link
                className="button-secondary"
                href="/workspace/records/disposition/closure/amended"
              >
                Open Amended Closures
              </Link>
              <Link
                className="button-secondary"
                href="/workspace/registry"
              >
                Open Registry
              </Link>
            </div>
          </div>
        </section>

        <section className="metrics">
          <article className="metric">
            <strong>{metrics.published}</strong>
            <span>Published</span>
          </article>
          <article className="metric">
            <strong>{metrics.issued}</strong>
            <span>Issued</span>
          </article>
          <article className="metric">
            <strong>{metrics.suspended}</strong>
            <span>Suspended</span>
          </article>
          <article className="metric">
            <strong>{metrics.valid}</strong>
            <span>Valid</span>
          </article>
        </section>

        <section className="toolbar">
          <input
            aria-label="Search finality certificates"
            placeholder="Search record, certificate, resolution, closure, receipt, issuer, state, or statement"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />

          <select
            aria-label="Filter certificate state"
            value={stateFilter}
            onChange={(event) =>
              setStateFilter(event.target.value as CertificateState | "ALL")
            }
          >
            <option value="ALL">All states</option>
            <option value="DRAFT">DRAFT</option>
            <option value="ISSUED">ISSUED</option>
            <option value="PUBLISHED">PUBLISHED</option>
            <option value="SUSPENDED">SUSPENDED</option>
            <option value="REVOKED">REVOKED</option>
            <option value="SUPERSEDED">SUPERSEDED</option>
          </select>

          <select
            aria-label="Filter validation state"
            value={validationFilter}
            onChange={(event) =>
              setValidationFilter(
                event.target.value as ValidationState | "ALL",
              )
            }
          >
            <option value="ALL">All validation states</option>
            <option value="VALID">VALID</option>
            <option value="INVALID">INVALID</option>
            <option value="UNKNOWN">UNKNOWN</option>
            <option value="EXPIRED">EXPIRED</option>
          </select>
        </section>

        <section className="grid">
          <div className="panel">
            <div className="panel-head">
              <strong>Finality certificates</strong>
              <span>{filtered.length} visible</span>
            </div>

            {filtered.length ? (
              filtered.map((record) => (
                <button
                  className={`certificate-row ${
                    selected.certificateId === record.certificateId
                      ? "active"
                      : ""
                  }`}
                  key={record.certificateId}
                  type="button"
                  onClick={() => setSelectedId(record.certificateId)}
                >
                  <div className="row-top">
                    <span className="certificate-title">{record.recordTitle}</span>
                    <span className={`pill ${record.state}`}>{record.state}</span>
                  </div>
                  <div className="mono">{record.certificateId}</div>
                  <div className="meta">
                    <span>{record.validationState}</span>
                    <span>{record.scope}</span>
                    <span>{record.resolutionId}</span>
                    <span>v{record.recordVersion}</span>
                  </div>
                </button>
              ))
            ) : (
              <div className="empty">
                No finality certificate matches the current filters.
              </div>
            )}
          </div>

          <aside className="panel detail">
            <div className="detail-top">
              <span className={`pill ${selected.state}`}>{selected.state}</span>
              <span className={`pill ${selected.validationState}`}>
                {selected.validationState}
              </span>
              <span className="pill">{selected.scope}</span>
            </div>

            <h2>{selected.recordTitle}</h2>
            <div className="mono">{selected.certificateId}</div>

            <div className="certificate-card">
              <h3>Finality Certificate</h3>
              <p>{selected.governingStatement}</p>
            </div>

            <dl className="kv">
              <dt>Resolution ID</dt>
              <dd>{selected.resolutionId}</dd>

              <dt>Record ID</dt>
              <dd>{selected.recordId}</dd>

              <dt>Version</dt>
              <dd>{selected.recordVersion}</dd>

              <dt>Disposition ID</dt>
              <dd>{selected.dispositionId}</dd>

              <dt>Current closure</dt>
              <dd>{selected.currentClosureId}</dd>

              <dt>Finality state</dt>
              <dd>{selected.finalityState}</dd>

              <dt>Reliance directive</dt>
              <dd>{selected.relianceDirective}</dd>

              <dt>Issued by</dt>
              <dd>{selected.issuedBy}</dd>

              <dt>Issuer role</dt>
              <dd>{selected.issuerRole}</dd>

              <dt>Issued</dt>
              <dd>{formatDate(selected.issuedAt)}</dd>

              <dt>Published</dt>
              <dd>{formatDate(selected.publishedAt)}</dd>

              <dt>Expires</dt>
              <dd>{formatDate(selected.expiresAt)}</dd>

              <dt>Certificate digest</dt>
              <dd>{selected.certificateDigest}</dd>

              <dt>Registry URL</dt>
              <dd>{selected.publicRegistryUrl}</dd>

              <dt>Supersedes</dt>
              <dd>{selected.supersedesCertificateId}</dd>
            </dl>

            <div className="box">
              <strong>Published limitations</strong>
              <ul>
                {selected.limitations.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="box">
              <strong>Binding receipts</strong>
              <ul>
                {selected.bindingReceipts.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="box">
              <strong>Historical receipts</strong>
              <ul>
                {selected.historicalReceipts.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            {selected.verificationChecks.map((check) => (
              <div className="check" key={check.label}>
                <span className={`pill ${check.status}`}>{check.status}</span>
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
                onClick={issueCertificate}
                disabled={
                  invalidChecks.length > 0 ||
                  unknownChecks.length > 0 ||
                  selected.finalityState === "REOPENED"
                }
              >
                Issue certificate
              </button>

              <button
                className="small-button"
                type="button"
                onClick={publishCertificate}
                disabled={
                  invalidChecks.length > 0 ||
                  unknownChecks.length > 0 ||
                  !["ISSUED", "PUBLISHED"].includes(selected.state)
                }
              >
                Publish certificate
              </button>

              <button
                className="small-button"
                type="button"
                onClick={() =>
                  setRecords((items) =>
                    items.map((item) =>
                      item.certificateId === selected.certificateId
                        ? {
                            ...item,
                            state: "SUSPENDED",
                            validationState: "INVALID",
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
                      item.certificateId === selected.certificateId
                        ? {
                            ...item,
                            state: "REVOKED",
                            validationState: "INVALID",
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
                onClick={() =>
                  setRecords((items) =>
                    items.map((item) =>
                      item.certificateId === selected.certificateId
                        ? {
                            ...item,
                            state: "SUPERSEDED",
                          }
                        : item,
                    ),
                  )
                }
              >
                Mark superseded
              </button>

              <button
                className="small-button"
                type="button"
                onClick={copyPackage}
              >
                {copied ? "Copied" : "Copy certificate package"}
              </button>

              <button
                className="small-button"
                type="button"
                onClick={() =>
                  downloadJson(
                    `${selected.certificateId.toLowerCase()}-finality-certificate.json`,
                    certificatePackage,
                  )
                }
              >
                Download certificate
              </button>
            </div>

            <div className="notice">
              A finality certificate is a current-state registry artifact, not
              an erasure of history. Appeals, prior closures, superseded
              receipts, limitations, and later lawful reopening remain
              permanently reviewable.
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
