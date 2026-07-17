"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type VerificationState =
  | "PENDING"
  | "VERIFIED"
  | "DIVERGENT"
  | "INCOMPLETE"
  | "FAILED"
  | "ESCALATED";

type ExecutionMethod =
  | "ARCHIVE"
  | "RESTRICT_ACCESS"
  | "REDACT_AND_ARCHIVE"
  | "CRYPTOGRAPHIC_TOMBSTONE"
  | "AUTHORIZED_DELETION";

type CheckState = "PASS" | "FAIL" | "UNKNOWN" | "NOT_APPLICABLE";

type VerificationCheck = {
  name: string;
  state: CheckState;
  expected: string;
  observed: string;
};

type DispositionVerification = {
  verificationId: string;
  dispositionId: string;
  retentionId: string;
  recordId: string;
  listingId: string;
  recordTitle: string;
  recordVersion: string;
  method: ExecutionMethod;
  state: VerificationState;
  executedBy: string;
  verifiedBy: string;
  executedAt: string;
  verifiedAt: string;
  authorizationReceiptId: string;
  executionReceiptId: string;
  preExecutionDigest: string;
  postExecutionDigest: string;
  storageTargets: string[];
  preservedArtifacts: string[];
  removedOrRestrictedArtifacts: string[];
  checks: VerificationCheck[];
  exceptions: string[];
  verificationStatement: string;
};

const initialVerifications: DispositionVerification[] = [
  {
    verificationId: "TA14-DVR-000019",
    dispositionId: "TA14-RDP-000019",
    retentionId: "TA14-RRT-000058",
    recordId: "TA14-AR-2026-000148",
    listingId: "TA14-ARX-000028",
    recordTitle: "Temporary Training Demonstration Record",
    recordVersion: "1.0.0",
    method: "AUTHORIZED_DELETION",
    state: "VERIFIED",
    executedBy: "TA-14 Academy Workspace",
    verifiedBy: "TA-14 Review Desk",
    executedAt: "2026-07-10T12:22:00.000Z",
    verifiedAt: "2026-07-10T12:27:00.000Z",
    authorizationReceiptId: "TA14-DSP-AUTH-000019",
    executionReceiptId: "TA14-DSP-000019",
    preExecutionDigest:
      "sha256:58cf49de6c7d4a51ef2e7bf977932d78b70fc0d69f476df2bb91da9c4d8a00d1",
    postExecutionDigest:
      "sha256:tombstone:9a5dbf0e0d26e82c58d4dd9e831f836f3ac141f91a58a75afcf71c1f03a183a4",
    storageTargets: [
      "Training workspace object store",
      "Temporary attachment cache",
      "Demonstration media bucket",
    ],
    preservedArtifacts: [
      "Record metadata",
      "Original digest",
      "Synthetic-data declaration",
      "Disposition authorization",
      "Execution receipt",
    ],
    removedOrRestrictedArtifacts: [
      "Synthetic media package",
      "Temporary workspace copies",
      "Generated demonstration attachments",
    ],
    checks: [
      {
        name: "Authorization correspondence",
        state: "PASS",
        expected: "Execution method and scope match TA14-RDP-000019.",
        observed: "Authorized deletion executed within the approved scope.",
      },
      {
        name: "Hold clearance",
        state: "PASS",
        expected: "No active legal, regulatory, or investigation hold.",
        observed: "No active hold found at execution time.",
      },
      {
        name: "Artifact removal",
        state: "PASS",
        expected: "All scoped synthetic artifacts become inaccessible.",
        observed: "Post-execution scans returned no scoped objects.",
      },
      {
        name: "Lineage preservation",
        state: "PASS",
        expected: "Required metadata, digest, and receipts remain preserved.",
        observed: "All required lineage artifacts remain available.",
      },
    ],
    exceptions: [],
    verificationStatement:
      "The authorized deletion corresponded to the approved method and scope. Required lineage and receipts remain preserved.",
  },
  {
    verificationId: "TA14-DVR-000020",
    dispositionId: "TA14-RDP-000020",
    retentionId: "TA14-RRT-000059",
    recordId: "TA14-AR-2026-000161",
    listingId: "TA14-ARX-000034",
    recordTitle: "Cold Storage Temperature Excursion Record",
    recordVersion: "1.0.0",
    method: "CRYPTOGRAPHIC_TOMBSTONE",
    state: "PENDING",
    executedBy: "PENDING",
    verifiedBy: "PENDING",
    executedAt: "PENDING",
    verifiedAt: "PENDING",
    authorizationReceiptId: "TA14-DSP-AUTH-000020",
    executionReceiptId: "PENDING",
    preExecutionDigest:
      "sha256:4dd518d12ea2f04ec9bd20dfe2b32d26f2d09f7ee7f5f2b5b5408b3ccf230fe4",
    postExecutionDigest: "PENDING",
    storageTargets: [
      "Public record package store",
      "Presentation-cache replicas",
      "Preservation vault",
    ],
    preservedArtifacts: [
      "Source package digest",
      "Correction record TA14-ARC-000022",
      "Supersession receipt TA14-SUP-000018",
      "Revocation record TA14-ARR-000011",
    ],
    removedOrRestrictedArtifacts: [
      "Ordinary public download package",
      "Duplicate presentation copies",
    ],
    checks: [
      {
        name: "Authorization correspondence",
        state: "UNKNOWN",
        expected: "Tombstone execution matches TA14-RDP-000020.",
        observed: "Execution has not yet been recorded.",
      },
      {
        name: "Public package restriction",
        state: "UNKNOWN",
        expected: "Ordinary public package is no longer downloadable.",
        observed: "Not yet tested.",
      },
      {
        name: "Digest persistence",
        state: "UNKNOWN",
        expected: "Source digest remains independently inspectable.",
        observed: "Not yet tested.",
      },
      {
        name: "Lineage continuity",
        state: "UNKNOWN",
        expected: "Correction, supersession, and revocation links remain intact.",
        observed: "Not yet tested.",
      },
    ],
    exceptions: [],
    verificationStatement:
      "Disposition is authorized but not yet executed or independently verified.",
  },
  {
    verificationId: "TA14-DVR-000018",
    dispositionId: "TA14-RDP-000018",
    retentionId: "TA14-RRT-000057",
    recordId: "TA14-AR-2026-000142",
    listingId: "TA14-ARX-000026",
    recordTitle: "Legacy Sensor Export Record",
    recordVersion: "3.4.2",
    method: "REDACT_AND_ARCHIVE",
    state: "DIVERGENT",
    executedBy: "Legacy Migration Service",
    verifiedBy: "TA-14 Review Desk",
    executedAt: "2026-07-09T16:04:00.000Z",
    verifiedAt: "2026-07-09T16:18:00.000Z",
    authorizationReceiptId: "TA14-DSP-AUTH-000018",
    executionReceiptId: "TA14-DSP-000018",
    preExecutionDigest:
      "sha256:50389d7f0ddad0a71090bbbdde182a83f50916895a1fac574398f224955ad4a7",
    postExecutionDigest:
      "sha256:b3c61df3d65955553af72f0b39e1587889eecf18ecda8ab03dc26333ef569412",
    storageTargets: ["Legacy archive", "Public presentation store"],
    preservedArtifacts: [
      "Canonical source digest",
      "Archive package",
      "Disposition authorization",
    ],
    removedOrRestrictedArtifacts: [
      "Personal email addresses",
      "Internal device labels",
    ],
    checks: [
      {
        name: "Authorization correspondence",
        state: "PASS",
        expected: "Redact and archive the authorized fields only.",
        observed: "Approved method executed.",
      },
      {
        name: "Redaction completeness",
        state: "FAIL",
        expected: "All personal email addresses are removed.",
        observed: "One personal email remains in an embedded CSV preview.",
      },
      {
        name: "Archive preservation",
        state: "PASS",
        expected: "Canonical source remains preserved in restricted archive.",
        observed: "Restricted archive package is intact.",
      },
      {
        name: "Public presentation",
        state: "FAIL",
        expected: "Public presentation exposes no restricted identifiers.",
        observed: "Cached preview remains publicly addressable.",
      },
    ],
    exceptions: [
      "Embedded CSV preview contains one unredacted email address.",
      "A stale public cache remains accessible.",
    ],
    verificationStatement:
      "Execution diverged from the authorized redaction scope. Public reliance must remain suspended until remediation is verified.",
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

export default function RecordDispositionVerificationPage() {
  const [records, setRecords] = useState(initialVerifications);
  const [selectedId, setSelectedId] = useState(
    initialVerifications[0].verificationId,
  );
  const [query, setQuery] = useState("");
  const [stateFilter, setStateFilter] = useState<VerificationState | "ALL">(
    "ALL",
  );
  const [methodFilter, setMethodFilter] = useState<ExecutionMethod | "ALL">(
    "ALL",
  );
  const [copied, setCopied] = useState(false);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return records.filter((record) => {
      const matchesQuery =
        !needle ||
        [
          record.verificationId,
          record.dispositionId,
          record.retentionId,
          record.recordId,
          record.listingId,
          record.recordTitle,
          record.method,
          record.executedBy,
          record.verifiedBy,
          record.authorizationReceiptId,
          record.executionReceiptId,
          record.verificationStatement,
          ...record.exceptions,
        ]
          .join(" ")
          .toLowerCase()
          .includes(needle);

      return (
        matchesQuery &&
        (stateFilter === "ALL" || record.state === stateFilter) &&
        (methodFilter === "ALL" || record.method === methodFilter)
      );
    });
  }, [methodFilter, query, records, stateFilter]);

  const selected =
    records.find((record) => record.verificationId === selectedId) ??
    filtered[0] ??
    records[0];

  const metrics = useMemo(
    () => ({
      verified: records.filter((item) => item.state === "VERIFIED").length,
      pending: records.filter((item) => item.state === "PENDING").length,
      divergent: records.filter((item) => item.state === "DIVERGENT").length,
      failedChecks: records.reduce(
        (sum, item) =>
          sum + item.checks.filter((check) => check.state === "FAIL").length,
        0,
      ),
    }),
    [records],
  );

  const failedChecks = selected.checks.filter(
    (check) => check.state === "FAIL",
  );
  const unknownChecks = selected.checks.filter(
    (check) => check.state === "UNKNOWN",
  );

  const verificationReport = {
    schema: "TA14_RECORD_DISPOSITION_VERIFICATION_REPORT_V1",
    generatedAt: new Date().toISOString(),
    verification: selected,
    summary: {
      passedChecks: selected.checks.filter((check) => check.state === "PASS")
        .length,
      failedChecks: failedChecks.length,
      unknownChecks: unknownChecks.length,
      totalChecks: selected.checks.length,
      correspondenceEstablished: selected.state === "VERIFIED",
    },
    governance: {
      authorizationCompared: true,
      executionScopeCompared: true,
      preservedArtifactsChecked: true,
      removalOrRestrictionChecked: true,
      postExecutionEvidenceRequired: true,
      divergenceRequiresRemediation: true,
    },
    limitation:
      "A verified disposition report establishes tested correspondence between authorization, execution, and observed post-execution state. It does not prove that every inaccessible copy has ceased to exist outside the tested systems.",
  };

  function updateCheck(index: number, state: CheckState) {
    setRecords((items) =>
      items.map((item) =>
        item.verificationId === selected.verificationId
          ? {
              ...item,
              checks: item.checks.map((check, checkIndex) =>
                checkIndex === index ? { ...check, state } : check,
              ),
            }
          : item,
      ),
    );
  }

  function finalizeVerification() {
    const current =
      records.find((record) => record.verificationId === selected.verificationId) ??
      selected;
    const hasFail = current.checks.some((check) => check.state === "FAIL");
    const hasUnknown = current.checks.some((check) => check.state === "UNKNOWN");

    const nextState: VerificationState = hasFail
      ? "DIVERGENT"
      : hasUnknown
        ? "INCOMPLETE"
        : "VERIFIED";

    setRecords((items) =>
      items.map((item) =>
        item.verificationId === selected.verificationId
          ? {
              ...item,
              state: nextState,
              verifiedAt: new Date().toISOString(),
              verifiedBy: "TA-14 Review Desk",
              verificationStatement:
                nextState === "VERIFIED"
                  ? "The observed post-execution state corresponds to the authorized method, scope, preserved lineage, and execution evidence."
                  : nextState === "DIVERGENT"
                    ? "The observed post-execution state diverges from the authorized method or scope. Remediation and re-verification are required."
                    : "Verification remains incomplete because one or more required checks are unknown.",
            }
          : item,
      ),
    );
  }

  async function copyReport() {
    await navigator.clipboard.writeText(
      JSON.stringify(verificationReport, null, 2),
    );
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <main className="verification-page">
      <style>{`
        * { box-sizing: border-box; }

        .verification-page {
          min-height: calc(100vh - 68px);
          padding: 48px 0 110px;
          color: #edf6ff;
        }

        .verification-wrap {
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
            radial-gradient(circle at 85% 7%, rgba(255, 194, 92, .16), transparent 28%),
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
          font-size: clamp(4.7rem, 12vw, 10rem);
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
          background: linear-gradient(100deg, #fff, #8ceaff 50%, #ffc25c);
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
          background: linear-gradient(100deg, #56e6ff, #ffc25c);
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
          background: linear-gradient(90deg, rgba(84, 232, 255, .09), rgba(255, 194, 92, .025));
          box-shadow: inset 3px 0 0 #56e6ff;
        }

        .row-top, .meta, .detail-top, .check-actions {
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

        .pill.VERIFIED, .pill.PASS {
          color: #54efae;
          border-color: rgba(84, 239, 174, .3);
        }

        .pill.PENDING, .pill.INCOMPLETE, .pill.UNKNOWN {
          color: #ffd27b;
          border-color: rgba(255, 210, 123, .3);
        }

        .pill.DIVERGENT, .pill.FAILED, .pill.ESCALATED, .pill.FAIL {
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

        .check-head {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          align-items: flex-start;
        }

        .check-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-top: 12px;
        }

        .check-grid div {
          padding: 12px;
          border-radius: 12px;
          background: rgba(9, 20, 34, .7);
        }

        .check-grid span {
          display: block;
          color: #728ca3;
          font-size: .66rem;
          font-weight: 900;
          letter-spacing: .08em;
          text-transform: uppercase;
        }

        .check-grid p { margin-top: 6px; }

        .check-actions { margin-top: 12px; }

        .notice {
          margin-top: 18px;
          padding: 16px 18px;
          border-left: 3px solid #ffc25c;
          border-radius: 0 13px 13px 0;
          color: #91a8bd;
          background: rgba(255, 194, 92, .045);
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
          .verification-wrap { width: min(100% - 24px, 1420px); }
          .verification-page { padding-top: 24px; }
          .hero { padding: 28px 22px 34px; border-radius: 24px; }
          .toolbar { grid-template-columns: 1fr; }
          .metrics { grid-template-columns: 1fr 1fr; }
          .kv, .check-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="verification-wrap">
        <section className="hero">
          <div className="hero-content">
            <p className="eyebrow">
              TA-14 Exchange · Disposition Execution Verification
            </p>
            <h1>
              Verify what changed.
              <br />
              <span className="gradient">Preserve what remained.</span>
            </h1>
            <p className="hero-copy">
              Compare the authorized disposition with the observed
              post-execution state. Confirm the exact scope, preserved lineage,
              removed or restricted artifacts, execution receipts, storage
              targets, and any divergence requiring remediation.
            </p>

            <div className="hero-actions">
              <Link className="button" href="/workspace/records/disposition">
                Open Disposition Authorization
              </Link>
              <Link
                className="button-secondary"
                href="/workspace/records/retention"
              >
                Open Retention & Holds
              </Link>
              <Link
                className="button-secondary"
                href="/workspace/preservation"
              >
                Open Preservation Vault
              </Link>
            </div>
          </div>
        </section>

        <section className="metrics">
          <article className="metric">
            <strong>{metrics.verified}</strong>
            <span>Verified</span>
          </article>
          <article className="metric">
            <strong>{metrics.pending}</strong>
            <span>Pending</span>
          </article>
          <article className="metric">
            <strong>{metrics.divergent}</strong>
            <span>Divergent</span>
          </article>
          <article className="metric">
            <strong>{metrics.failedChecks}</strong>
            <span>Failed checks</span>
          </article>
        </section>

        <section className="toolbar">
          <input
            aria-label="Search disposition verification"
            placeholder="Search record, disposition, receipt, executor, verifier, method, or exception"
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
            <option value="PENDING">PENDING</option>
            <option value="VERIFIED">VERIFIED</option>
            <option value="DIVERGENT">DIVERGENT</option>
            <option value="INCOMPLETE">INCOMPLETE</option>
            <option value="FAILED">FAILED</option>
            <option value="ESCALATED">ESCALATED</option>
          </select>

          <select
            aria-label="Filter disposition method"
            value={methodFilter}
            onChange={(event) =>
              setMethodFilter(event.target.value as ExecutionMethod | "ALL")
            }
          >
            <option value="ALL">All methods</option>
            <option value="ARCHIVE">ARCHIVE</option>
            <option value="RESTRICT_ACCESS">RESTRICT_ACCESS</option>
            <option value="REDACT_AND_ARCHIVE">REDACT_AND_ARCHIVE</option>
            <option value="CRYPTOGRAPHIC_TOMBSTONE">
              CRYPTOGRAPHIC_TOMBSTONE
            </option>
            <option value="AUTHORIZED_DELETION">AUTHORIZED_DELETION</option>
          </select>
        </section>

        <section className="grid">
          <div className="panel">
            <div className="panel-head">
              <strong>Disposition verifications</strong>
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
                    <span className={`pill ${record.state}`}>{record.state}</span>
                  </div>
                  <div className="mono">{record.verificationId}</div>
                  <div className="meta">
                    <span>{record.method}</span>
                    <span>{record.dispositionId}</span>
                    <span>v{record.recordVersion}</span>
                    <span>{formatDate(record.verifiedAt)}</span>
                  </div>
                </button>
              ))
            ) : (
              <div className="empty">
                No verification matches the current filters.
              </div>
            )}
          </div>

          <aside className="panel detail">
            <div className="detail-top">
              <span className={`pill ${selected.state}`}>{selected.state}</span>
              <span className="pill">{selected.method}</span>
              <span className="pill">
                {failedChecks.length} failed / {unknownChecks.length} unknown
              </span>
            </div>

            <h2>{selected.recordTitle}</h2>
            <div className="mono">{selected.verificationId}</div>
            <p>{selected.verificationStatement}</p>

            <dl className="kv">
              <dt>Disposition ID</dt>
              <dd>{selected.dispositionId}</dd>

              <dt>Retention ID</dt>
              <dd>{selected.retentionId}</dd>

              <dt>Record ID</dt>
              <dd>{selected.recordId}</dd>

              <dt>Listing ID</dt>
              <dd>{selected.listingId}</dd>

              <dt>Version</dt>
              <dd>{selected.recordVersion}</dd>

              <dt>Executed by</dt>
              <dd>{selected.executedBy}</dd>

              <dt>Verified by</dt>
              <dd>{selected.verifiedBy}</dd>

              <dt>Executed</dt>
              <dd>{formatDate(selected.executedAt)}</dd>

              <dt>Verified</dt>
              <dd>{formatDate(selected.verifiedAt)}</dd>

              <dt>Authorization receipt</dt>
              <dd>{selected.authorizationReceiptId}</dd>

              <dt>Execution receipt</dt>
              <dd>{selected.executionReceiptId}</dd>

              <dt>Pre-execution digest</dt>
              <dd>{selected.preExecutionDigest}</dd>

              <dt>Post-execution digest</dt>
              <dd>{selected.postExecutionDigest}</dd>
            </dl>

            <div className="box">
              <strong>Storage targets tested</strong>
              <ul>
                {selected.storageTargets.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="box">
              <strong>Preserved artifacts</strong>
              <ul>
                {selected.preservedArtifacts.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="box">
              <strong>Removed or restricted artifacts</strong>
              <ul>
                {selected.removedOrRestrictedArtifacts.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            {selected.checks.map((check, index) => (
              <div className="check" key={`${check.name}-${index}`}>
                <div className="check-head">
                  <strong>{check.name}</strong>
                  <span className={`pill ${check.state}`}>{check.state}</span>
                </div>

                <div className="check-grid">
                  <div>
                    <span>Expected</span>
                    <p>{check.expected}</p>
                  </div>
                  <div>
                    <span>Observed</span>
                    <p>{check.observed}</p>
                  </div>
                </div>

                <div className="check-actions">
                  <button
                    className="small-button"
                    type="button"
                    onClick={() => updateCheck(index, "PASS")}
                  >
                    Pass
                  </button>
                  <button
                    className="small-button"
                    type="button"
                    onClick={() => updateCheck(index, "FAIL")}
                  >
                    Fail
                  </button>
                  <button
                    className="small-button"
                    type="button"
                    onClick={() => updateCheck(index, "UNKNOWN")}
                  >
                    Unknown
                  </button>
                </div>
              </div>
            ))}

            <div className="box">
              <strong>Exceptions</strong>
              {selected.exceptions.length ? (
                <ul>
                  {selected.exceptions.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p>No exception recorded.</p>
              )}
            </div>

            <div className="detail-actions">
              <button
                className="button"
                type="button"
                onClick={finalizeVerification}
              >
                Finalize verification
              </button>

              <button
                className="small-button"
                type="button"
                onClick={() =>
                  setRecords((items) =>
                    items.map((item) =>
                      item.verificationId === selected.verificationId
                        ? { ...item, state: "ESCALATED" }
                        : item,
                    ),
                  )
                }
              >
                Escalate
              </button>

              <button
                className="small-button"
                type="button"
                onClick={copyReport}
              >
                {copied ? "Copied" : "Copy verification report"}
              </button>

              <button
                className="small-button"
                type="button"
                onClick={() =>
                  downloadJson(
                    `${selected.verificationId.toLowerCase()}-disposition-verification.json`,
                    verificationReport,
                  )
                }
              >
                Download report
              </button>
            </div>

            <div className="notice">
              Verification tests correspondence across known systems and
              evidence. It must not overstate that every uncontrolled copy,
              external cache, or undiscovered replica has ceased to exist.
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
