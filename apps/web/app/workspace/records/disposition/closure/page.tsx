"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type ClosureState =
  | "PENDING_REVIEW"
  | "ATTESTED"
  | "PUBLISHED"
  | "WITHDRAWN"
  | "SUPERSEDED"
  | "DISPUTED";

type ClosureOutcome =
  | "CLOSED_AS_AUTHORIZED"
  | "CLOSED_AFTER_REMEDIATION"
  | "CLOSED_WITH_LIMITATIONS"
  | "NOT_CLOSED";

type PublicationScope =
  | "PRIVATE"
  | "PARTIES_ONLY"
  | "REGISTRY_SUMMARY"
  | "PUBLIC_RECEIPT";

type ClosureRecord = {
  closureId: string;
  remediationId: string;
  verificationId: string;
  dispositionId: string;
  retentionId: string;
  recordId: string;
  recordTitle: string;
  recordVersion: string;
  state: ClosureState;
  outcome: ClosureOutcome;
  publicationScope: PublicationScope;
  attestedBy: string;
  attesterRole: string;
  attestedAt: string;
  publishedAt: string;
  closureBasis: string;
  governingReceipts: string[];
  preservedLineage: string[];
  residualLimitations: string[];
  finalChecks: {
    label: string;
    passed: boolean;
    evidence: string;
  }[];
  publicStatement: string;
  closureDigest: string;
  priorClosureId: string;
};

const initialClosures: ClosureRecord[] = [
  {
    closureId: "TA14-DCL-000009",
    remediationId: "TA14-DRM-000009",
    verificationId: "TA14-DVR-000016",
    dispositionId: "TA14-RDP-000016",
    retentionId: "TA14-RRT-000057",
    recordId: "TA14-AR-2026-000132",
    recordTitle: "Expired Demonstration Upload",
    recordVersion: "1.0.0",
    state: "PUBLISHED",
    outcome: "CLOSED_AFTER_REMEDIATION",
    publicationScope: "PUBLIC_RECEIPT",
    attestedBy: "TA-14 Review Desk",
    attesterRole: "Independent closure reviewer",
    attestedAt: "2026-07-07T15:25:00.000Z",
    publishedAt: "2026-07-07T15:31:00.000Z",
    closureBasis:
      "Authorized deletion was remediated after a duplicate thumbnail remained in a temporary cache. Independent retesting confirmed removal and preserved disposition lineage.",
    governingReceipts: [
      "TA14-DSP-000016",
      "TA14-DVR-000016",
      "TA14-DRM-CLOSE-000009",
      "TA14-CACHE-000112",
      "TA14-SCAN-000274",
    ],
    preservedLineage: [
      "Original record digest",
      "Disposition authorization",
      "Divergent verification report",
      "Remediation case",
      "Closure receipt",
    ],
    residualLimitations: [
      "Verification applies only to tested TA-14-controlled storage and cache systems.",
    ],
    finalChecks: [
      {
        label: "Disposition authorization preserved",
        passed: true,
        evidence: "TA14-DSP-000016",
      },
      {
        label: "Corrective actions complete",
        passed: true,
        evidence: "TA14-DRM-CLOSE-000009",
      },
      {
        label: "Independent retest passed",
        passed: true,
        evidence: "TA14-SCAN-000274",
      },
      {
        label: "Original divergence preserved",
        passed: true,
        evidence: "TA14-DVR-000016",
      },
    ],
    publicStatement:
      "The authorized disposition was completed after documented remediation and independent retesting. Required lineage remains preserved.",
    closureDigest:
      "sha256:5f0dd36488b9c13f0d4f6c4f693b492c266f424f36f6a0d8ce5d24fb56a28b2e",
    priorClosureId: "NONE",
  },
  {
    closureId: "TA14-DCL-000010",
    remediationId: "TA14-DRM-000010",
    verificationId: "TA14-DVR-000017",
    dispositionId: "TA14-RDP-000017",
    retentionId: "TA14-RRT-000056",
    recordId: "TA14-AR-2026-000137",
    recordTitle: "Temporary Contractor Access Record",
    recordVersion: "1.1.0",
    state: "PENDING_REVIEW",
    outcome: "NOT_CLOSED",
    publicationScope: "PARTIES_ONLY",
    attestedBy: "PENDING",
    attesterRole: "PENDING",
    attestedAt: "PENDING",
    publishedAt: "PENDING",
    closureBasis:
      "Corrective actions are complete and the case is ready for independent retesting.",
    governingReceipts: [
      "TA14-DSP-000017",
      "TA14-DVR-000017",
      "TA14-IAM-REV-000044",
    ],
    preservedLineage: [
      "Disposition authorization",
      "Verification divergence",
      "Token revocation receipt",
      "Remediation case",
    ],
    residualLimitations: [
      "Closure cannot be attested until independent token and archive checks pass.",
    ],
    finalChecks: [
      {
        label: "Corrective actions complete",
        passed: true,
        evidence: "TA14-IAM-REV-000044",
      },
      {
        label: "Independent retest passed",
        passed: false,
        evidence: "PENDING",
      },
      {
        label: "No replacement token exists",
        passed: false,
        evidence: "PENDING",
      },
      {
        label: "Archive access is correctly restricted",
        passed: false,
        evidence: "PENDING",
      },
    ],
    publicStatement: "Closure has not yet been established.",
    closureDigest: "PENDING",
    priorClosureId: "NONE",
  },
  {
    closureId: "TA14-DCL-000008",
    remediationId: "NONE",
    verificationId: "TA14-DVR-000019",
    dispositionId: "TA14-RDP-000019",
    retentionId: "TA14-RRT-000058",
    recordId: "TA14-AR-2026-000148",
    recordTitle: "Temporary Training Demonstration Record",
    recordVersion: "1.0.0",
    state: "ATTESTED",
    outcome: "CLOSED_AS_AUTHORIZED",
    publicationScope: "REGISTRY_SUMMARY",
    attestedBy: "TA-14 Review Desk",
    attesterRole: "Disposition closure reviewer",
    attestedAt: "2026-07-10T12:29:00.000Z",
    publishedAt: "PENDING",
    closureBasis:
      "Authorized deletion corresponded to the approved method and scope. Required metadata, digest, synthetic-data declaration, and receipts remain preserved.",
    governingReceipts: [
      "TA14-DSP-AUTH-000019",
      "TA14-DSP-000019",
      "TA14-DVR-000019",
    ],
    preservedLineage: [
      "Original record metadata",
      "Original digest",
      "Synthetic-data declaration",
      "Disposition authorization",
      "Execution receipt",
      "Verification report",
    ],
    residualLimitations: [
      "Verification does not establish deletion from uncontrolled third-party copies.",
    ],
    finalChecks: [
      {
        label: "Authorization correspondence",
        passed: true,
        evidence: "TA14-DVR-000019",
      },
      {
        label: "Required artifacts preserved",
        passed: true,
        evidence: "TA14-DSP-000019",
      },
      {
        label: "Scoped objects inaccessible",
        passed: true,
        evidence: "TA14-DVR-000019",
      },
    ],
    publicStatement:
      "The authorized disposition corresponded to the approved scope and required lineage remains preserved.",
    closureDigest:
      "sha256:9a5dbf0e0d26e82c58d4dd9e831f836f3ac141f91a58a75afcf71c1f03a183a4",
    priorClosureId: "NONE",
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

export default function DispositionClosureRegistryPage() {
  const [records, setRecords] = useState(initialClosures);
  const [selectedId, setSelectedId] = useState(initialClosures[0].closureId);
  const [query, setQuery] = useState("");
  const [stateFilter, setStateFilter] = useState<ClosureState | "ALL">("ALL");
  const [scopeFilter, setScopeFilter] = useState<PublicationScope | "ALL">("ALL");
  const [copied, setCopied] = useState(false);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return records.filter((record) => {
      const matchesQuery =
        !needle ||
        [
          record.closureId,
          record.remediationId,
          record.verificationId,
          record.dispositionId,
          record.recordId,
          record.recordTitle,
          record.state,
          record.outcome,
          record.publicationScope,
          record.attestedBy,
          record.attesterRole,
          record.closureBasis,
          record.publicStatement,
          ...record.governingReceipts,
        ]
          .join(" ")
          .toLowerCase()
          .includes(needle);

      return (
        matchesQuery &&
        (stateFilter === "ALL" || record.state === stateFilter) &&
        (scopeFilter === "ALL" || record.publicationScope === scopeFilter)
      );
    });
  }, [query, records, scopeFilter, stateFilter]);

  const selected =
    records.find((record) => record.closureId === selectedId) ??
    filtered[0] ??
    records[0];

  const metrics = useMemo(
    () => ({
      pending: records.filter((item) => item.state === "PENDING_REVIEW").length,
      attested: records.filter((item) => item.state === "ATTESTED").length,
      published: records.filter((item) => item.state === "PUBLISHED").length,
      disputed: records.filter((item) => item.state === "DISPUTED").length,
    }),
    [records],
  );

  const failedFinalChecks = selected.finalChecks.filter(
    (check) => !check.passed,
  );

  const closurePackage = {
    schema: "TA14_DISPOSITION_CLOSURE_ATTESTATION_V1",
    generatedAt: new Date().toISOString(),
    closure: selected,
    readiness: {
      finalChecksPassed:
        selected.finalChecks.length - failedFinalChecks.length,
      finalChecksTotal: selected.finalChecks.length,
      closureReady: failedFinalChecks.length === 0,
      publicationReady:
        failedFinalChecks.length === 0 &&
        ["ATTESTED", "PUBLISHED"].includes(selected.state),
    },
    governance: {
      originalRecordVersionBound: true,
      dispositionBound: true,
      verificationBound: true,
      remediationBound: selected.remediationId !== "NONE",
      residualLimitationsPreserved: true,
      priorDivergencePreserved: true,
      silentClosureProhibited: true,
    },
    limitation:
      "A closure attestation establishes that the listed checks, receipts, and evidence support closure within the stated scope. It does not erase prior divergence or extend beyond tested systems and preserved evidence.",
  };

  function attestClosure() {
    if (failedFinalChecks.length > 0) return;

    setRecords((items) =>
      items.map((item) =>
        item.closureId === selected.closureId
          ? {
              ...item,
              state: "ATTESTED",
              outcome:
                item.remediationId === "NONE"
                  ? "CLOSED_AS_AUTHORIZED"
                  : "CLOSED_AFTER_REMEDIATION",
              attestedBy: "TA-14 Review Desk",
              attesterRole: "Disposition closure reviewer",
              attestedAt: new Date().toISOString(),
              closureDigest: makeDigest(
                JSON.stringify({
                  closureId: item.closureId,
                  dispositionId: item.dispositionId,
                  verificationId: item.verificationId,
                  remediationId: item.remediationId,
                  finalChecks: item.finalChecks,
                }),
              ),
              publicStatement:
                item.remediationId === "NONE"
                  ? "The authorized disposition corresponded to the approved scope and required lineage remains preserved."
                  : "The disposition was closed after documented remediation, completed corrective evidence, and independent retesting.",
            }
          : item,
      ),
    );
  }

  function publishClosure() {
    if (
      failedFinalChecks.length > 0 ||
      !["ATTESTED", "PUBLISHED"].includes(selected.state)
    ) {
      return;
    }

    setRecords((items) =>
      items.map((item) =>
        item.closureId === selected.closureId
          ? {
              ...item,
              state: "PUBLISHED",
              publishedAt: new Date().toISOString(),
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
            radial-gradient(circle at 85% 7%, rgba(91, 239, 177, .16), transparent 28%),
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
          font-size: clamp(4.6rem, 12vw, 10rem);
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
          background: linear-gradient(100deg, #fff, #8ceaff 50%, #5befb1);
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
          background: linear-gradient(100deg, #56e6ff, #5befb1);
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
          background: linear-gradient(90deg, rgba(84, 232, 255, .09), rgba(91, 239, 177, .025));
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

        .pill.ATTESTED, .pill.PUBLISHED, .pill.pass {
          color: #54efae;
          border-color: rgba(84, 239, 174, .3);
        }

        .pill.PENDING_REVIEW {
          color: #ffd27b;
          border-color: rgba(255, 210, 123, .3);
        }

        .pill.WITHDRAWN, .pill.SUPERSEDED, .pill.DISPUTED, .pill.fail {
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

        .check-copy p { margin-top: 7px; }

        .notice {
          margin-top: 18px;
          padding: 16px 18px;
          border-left: 3px solid #5befb1;
          border-radius: 0 13px 13px 0;
          color: #91a8bd;
          background: rgba(91, 239, 177, .045);
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
              TA-14 Exchange · Disposition Closure Registry
            </p>
            <h1>
              Close the process.
              <br />
              <span className="gradient">Preserve the proof.</span>
            </h1>
            <p className="hero-copy">
              Attest and publish the final disposition outcome only after the
              authorization, execution, verification, remediation, retesting,
              preserved lineage, residual limitations, and closure authority
              have been bound into one reviewable receipt.
            </p>

            <div className="hero-actions">
              <Link
                className="button"
                href="/workspace/records/disposition/remediation"
              >
                Open Remediation & Closure
              </Link>
              <Link
                className="button-secondary"
                href="/workspace/records/disposition/verify"
              >
                Open Disposition Verification
              </Link>
              <Link
                className="button-secondary"
                href="/workspace/records/history"
              >
                Open Record History
              </Link>
            </div>
          </div>
        </section>

        <section className="metrics">
          <article className="metric">
            <strong>{metrics.pending}</strong>
            <span>Pending review</span>
          </article>
          <article className="metric">
            <strong>{metrics.attested}</strong>
            <span>Attested</span>
          </article>
          <article className="metric">
            <strong>{metrics.published}</strong>
            <span>Published</span>
          </article>
          <article className="metric">
            <strong>{metrics.disputed}</strong>
            <span>Disputed</span>
          </article>
        </section>

        <section className="toolbar">
          <input
            aria-label="Search closure registry"
            placeholder="Search record, closure, disposition, receipt, attester, outcome, or statement"
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
            <option value="PENDING_REVIEW">PENDING_REVIEW</option>
            <option value="ATTESTED">ATTESTED</option>
            <option value="PUBLISHED">PUBLISHED</option>
            <option value="WITHDRAWN">WITHDRAWN</option>
            <option value="SUPERSEDED">SUPERSEDED</option>
            <option value="DISPUTED">DISPUTED</option>
          </select>

          <select
            aria-label="Filter publication scope"
            value={scopeFilter}
            onChange={(event) =>
              setScopeFilter(event.target.value as PublicationScope | "ALL")
            }
          >
            <option value="ALL">All publication scopes</option>
            <option value="PRIVATE">PRIVATE</option>
            <option value="PARTIES_ONLY">PARTIES_ONLY</option>
            <option value="REGISTRY_SUMMARY">REGISTRY_SUMMARY</option>
            <option value="PUBLIC_RECEIPT">PUBLIC_RECEIPT</option>
          </select>
        </section>

        <section className="grid">
          <div className="panel">
            <div className="panel-head">
              <strong>Disposition closure records</strong>
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
                    <span>{record.outcome}</span>
                    <span>{record.publicationScope}</span>
                    <span>{record.attestedBy}</span>
                    <span>v{record.recordVersion}</span>
                  </div>
                </button>
              ))
            ) : (
              <div className="empty">
                No closure record matches the current filters.
              </div>
            )}
          </div>

          <aside className="panel detail">
            <div className="detail-top">
              <span className={`pill ${selected.state}`}>{selected.state}</span>
              <span className="pill">{selected.outcome}</span>
              <span className="pill">{selected.publicationScope}</span>
            </div>

            <h2>{selected.recordTitle}</h2>
            <div className="mono">{selected.closureId}</div>
            <p>{selected.closureBasis}</p>

            <dl className="kv">
              <dt>Record ID</dt>
              <dd>{selected.recordId}</dd>

              <dt>Version</dt>
              <dd>{selected.recordVersion}</dd>

              <dt>Disposition ID</dt>
              <dd>{selected.dispositionId}</dd>

              <dt>Verification ID</dt>
              <dd>{selected.verificationId}</dd>

              <dt>Remediation ID</dt>
              <dd>{selected.remediationId}</dd>

              <dt>Retention ID</dt>
              <dd>{selected.retentionId}</dd>

              <dt>Attested by</dt>
              <dd>{selected.attestedBy}</dd>

              <dt>Attester role</dt>
              <dd>{selected.attesterRole}</dd>

              <dt>Attested</dt>
              <dd>{formatDate(selected.attestedAt)}</dd>

              <dt>Published</dt>
              <dd>{formatDate(selected.publishedAt)}</dd>

              <dt>Closure digest</dt>
              <dd>{selected.closureDigest}</dd>

              <dt>Prior closure</dt>
              <dd>{selected.priorClosureId}</dd>
            </dl>

            <div className="box">
              <strong>Governing receipts</strong>
              <ul>
                {selected.governingReceipts.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="box">
              <strong>Preserved lineage</strong>
              <ul>
                {selected.preservedLineage.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            {selected.finalChecks.map((check) => (
              <div className="check" key={check.label}>
                <span className={`pill ${check.passed ? "pass" : "fail"}`}>
                  {check.passed ? "PASS" : "FAIL"}
                </span>
                <div className="check-copy">
                  <strong>{check.label}</strong>
                  <p>{check.evidence}</p>
                </div>
              </div>
            ))}

            <div className="box">
              <strong>Residual limitations</strong>
              <ul>
                {selected.residualLimitations.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="box">
              <strong>Public statement</strong>
              <p>{selected.publicStatement}</p>
            </div>

            <div className="detail-actions">
              <button
                className="button"
                type="button"
                onClick={attestClosure}
                disabled={failedFinalChecks.length > 0}
              >
                Attest closure
              </button>

              <button
                className="small-button"
                type="button"
                onClick={publishClosure}
                disabled={
                  failedFinalChecks.length > 0 ||
                  !["ATTESTED", "PUBLISHED"].includes(selected.state)
                }
              >
                Publish receipt
              </button>

              <button
                className="small-button"
                type="button"
                onClick={() =>
                  setRecords((items) =>
                    items.map((item) =>
                      item.closureId === selected.closureId
                        ? { ...item, state: "DISPUTED" }
                        : item,
                    ),
                  )
                }
              >
                Mark disputed
              </button>

              <button
                className="small-button"
                type="button"
                onClick={() =>
                  setRecords((items) =>
                    items.map((item) =>
                      item.closureId === selected.closureId
                        ? { ...item, state: "WITHDRAWN" }
                        : item,
                    ),
                  )
                }
              >
                Withdraw
              </button>

              <button
                className="small-button"
                type="button"
                onClick={copyPackage}
              >
                {copied ? "Copied" : "Copy closure attestation"}
              </button>

              <button
                className="small-button"
                type="button"
                onClick={() =>
                  downloadJson(
                    `${selected.closureId.toLowerCase()}-closure-attestation.json`,
                    closurePackage,
                  )
                }
              >
                Download attestation
              </button>
            </div>

            <div className="notice">
              Closure is a governed attestation, not erasure. The original
              record, authorization, divergence, remediation, limitations, and
              evidence chain remain preserved and independently reviewable.
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
