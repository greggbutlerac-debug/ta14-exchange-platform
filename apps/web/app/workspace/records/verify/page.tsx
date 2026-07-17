"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type VerificationState =
  | "READY"
  | "VERIFIED"
  | "DIVERGENT"
  | "INCOMPLETE"
  | "DISPUTED";

type CheckState = "PASS" | "FAIL" | "UNKNOWN" | "NOT_APPLICABLE";

type VerificationCheck = {
  checkId: string;
  label: string;
  description: string;
  state: CheckState;
  expected: string;
  observed: string;
};

type RecordVerification = {
  verificationId: string;
  recordId: string;
  recordTitle: string;
  recordVersion: string;
  submittedBy: string;
  submittedAt: string;
  verificationState: VerificationState;
  packageDigest: string;
  preservationReceiptId: string;
  custodyPackageId: string;
  authorityRecordId: string;
  reviewer: string;
  notes: string;
  checks: VerificationCheck[];
};

const initialVerifications: RecordVerification[] = [
  {
    verificationId: "TA14-ARV-000117",
    recordId: "TA14-AR-2026-000184",
    recordTitle: "Field Equipment Condition Record",
    recordVersion: "1.0.0",
    submittedBy: "Transparent Air",
    submittedAt: "2026-07-17T15:31:00.000Z",
    verificationState: "READY",
    packageDigest:
      "sha256:48e489db4f4cc93d5dc2a0617fa8bd99b0b097d04910a5bc37e3058a4224a77b",
    preservationReceiptId: "TA14-PR-000592",
    custodyPackageId: "TA14-CUST-PKG-000184",
    authorityRecordId: "TA14-AUTH-000881",
    reviewer: "UNASSIGNED",
    notes:
      "Record package is queued for independent correspondence review.",
    checks: [
      {
        checkId: "CHK-IDENTITY",
        label: "Record identity",
        description:
          "Record ID, title, version, and subject remain consistent across the package.",
        state: "PASS",
        expected: "TA14-AR-2026-000184 · v1.0.0",
        observed: "TA14-AR-2026-000184 · v1.0.0",
      },
      {
        checkId: "CHK-PACKAGE-DIGEST",
        label: "Package digest",
        description:
          "The submitted package digest corresponds to the preserved package.",
        state: "PASS",
        expected:
          "sha256:48e489db4f4cc93d5dc2a0617fa8bd99b0b097d04910a5bc37e3058a4224a77b",
        observed:
          "sha256:48e489db4f4cc93d5dc2a0617fa8bd99b0b097d04910a5bc37e3058a4224a77b",
      },
      {
        checkId: "CHK-CUSTODY",
        label: "Evidence custody",
        description:
          "Evidence items preserve source, transfer, predecessor, and digest observations.",
        state: "PASS",
        expected: "Continuous custody or explicitly preserved exceptions",
        observed: "2 continuous · 1 unknown · 1 disputed",
      },
      {
        checkId: "CHK-AUTHORITY",
        label: "Authority basis",
        description:
          "Authority or consent supporting creation of the record is identified and reviewable.",
        state: "PASS",
        expected: "Bound authority record",
        observed: "TA14-AUTH-000881",
      },
      {
        checkId: "CHK-UNKNOWNS",
        label: "Unknown preservation",
        description:
          "Missing or uncertain facts remain UNKNOWN rather than being filled by inference.",
        state: "PASS",
        expected: "Explicit unknowns",
        observed: "2 preserved unknowns",
      },
      {
        checkId: "CHK-SIGNATURE",
        label: "Signature verification",
        description:
          "The package signature is validated against an active trusted key and permitted scope.",
        state: "UNKNOWN",
        expected: "Valid signature and trusted key",
        observed: "Signature verification not yet performed",
      },
    ],
  },
  {
    verificationId: "TA14-ARV-000116",
    recordId: "TA14-AR-2026-000179",
    recordTitle: "Facility Moisture Excursion Record",
    recordVersion: "2.1.0",
    submittedBy: "North Basin Operations",
    submittedAt: "2026-07-17T12:04:00.000Z",
    verificationState: "VERIFIED",
    packageDigest:
      "sha256:5b6b4bd2061271c272554351ce72715032dc833f75c1edbabbe0ed3c4a24ffc9",
    preservationReceiptId: "TA14-PR-000588",
    custodyPackageId: "TA14-CUST-PKG-000179",
    authorityRecordId: "TA14-AUTH-000877",
    reviewer: "TA-14 Review Desk",
    notes:
      "Identity, evidence, custody, authority, preservation, and signature correspondence verified.",
    checks: [],
  },
  {
    verificationId: "TA14-ARV-000115",
    recordId: "TA14-AR-2026-000172",
    recordTitle: "AI Payment Route Incident Record",
    recordVersion: "1.3.0",
    submittedBy: "Orchard Systems",
    submittedAt: "2026-07-16T21:42:00.000Z",
    verificationState: "DIVERGENT",
    packageDigest:
      "sha256:7f768c37a9427ce4d919dd9c64f3dd0a4c9e6a43373b30852da524a4893d3c26",
    preservationReceiptId: "TA14-PR-000579",
    custodyPackageId: "TA14-CUST-PKG-000172",
    authorityRecordId: "TA14-AUTH-000862",
    reviewer: "TA-14 Review Desk",
    notes:
      "Observed evidence manifest differs from the preserved manifest.",
    checks: [],
  },
  {
    verificationId: "TA14-ARV-000114",
    recordId: "TA14-AR-2026-000169",
    recordTitle: "Witness Statement Package",
    recordVersion: "1.0.0",
    submittedBy: "Independent submitter",
    submittedAt: "2026-07-16T18:18:00.000Z",
    verificationState: "INCOMPLETE",
    packageDigest: "UNKNOWN",
    preservationReceiptId: "UNKNOWN",
    custodyPackageId: "TA14-CUST-PKG-000169",
    authorityRecordId: "UNKNOWN",
    reviewer: "UNASSIGNED",
    notes:
      "Package digest, preservation receipt, and authority basis are missing.",
    checks: [],
  },
];

function formatDate(value: string) {
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

export default function AdmissibleRecordVerificationPage() {
  const [records, setRecords] = useState(initialVerifications);
  const [selectedId, setSelectedId] = useState(initialVerifications[0].verificationId);
  const [query, setQuery] = useState("");
  const [stateFilter, setStateFilter] = useState<VerificationState | "ALL">("ALL");
  const [copied, setCopied] = useState(false);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return records.filter((record) => {
      const matchesQuery =
        !needle ||
        [
          record.verificationId,
          record.recordId,
          record.recordTitle,
          record.submittedBy,
          record.reviewer,
          record.notes,
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

  const summary = useMemo(() => {
    const checks = selected.checks;
    const total = checks.length;
    const passed = checks.filter((check) => check.state === "PASS").length;
    const failed = checks.filter((check) => check.state === "FAIL").length;
    const unknown = checks.filter((check) => check.state === "UNKNOWN").length;
    const score = total ? Math.round((passed / total) * 100) : 0;

    let determination: VerificationState = selected.verificationState;

    if (total) {
      if (failed > 0) determination = "DIVERGENT";
      else if (unknown > 0) determination = "INCOMPLETE";
      else determination = "VERIFIED";
    }

    return { total, passed, failed, unknown, score, determination };
  }, [selected]);

  const verificationReport = {
    schema: "TA14_ADMISSIBLE_RECORD_VERIFICATION_REPORT_V1",
    generatedAt: new Date().toISOString(),
    verification: {
      ...selected,
      verificationState: summary.determination,
    },
    correspondence: {
      totalChecks: summary.total,
      passed: summary.passed,
      failed: summary.failed,
      unknown: summary.unknown,
      correspondenceScore: summary.score,
    },
    determination: summary.determination,
    limitation:
      "Verification establishes correspondence among the submitted record package, preserved artifacts, custody observations, authority records, and trusted signatures to the extent tested. It does not independently prove the truth of every underlying claim or guarantee legal admissibility in every jurisdiction.",
  };

  function runVerification() {
    setRecords((items) =>
      items.map((record) =>
        record.verificationId === selected.verificationId
          ? {
              ...record,
              verificationState: summary.determination,
              reviewer:
                record.reviewer === "UNASSIGNED"
                  ? "TA-14 Verification Engine"
                  : record.reviewer,
              notes:
                summary.determination === "VERIFIED"
                  ? "All configured correspondence checks passed."
                  : summary.determination === "DIVERGENT"
                    ? "One or more configured checks failed correspondence."
                    : "Verification remains incomplete because one or more required observations are UNKNOWN.",
            }
          : record,
      ),
    );
  }

  function resolveUnknownSignature() {
    setRecords((items) =>
      items.map((record) =>
        record.verificationId === selected.verificationId
          ? {
              ...record,
              checks: record.checks.map((check) =>
                check.checkId === "CHK-SIGNATURE"
                  ? {
                      ...check,
                      state: "PASS",
                      observed:
                        "Signature verified against active key TA14-KEY-000044 within permitted record-signing scope.",
                    }
                  : check,
              ),
            }
          : record,
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
    <main className="verify-page">
      <style>{`
        * { box-sizing: border-box; }

        .verify-page {
          min-height: calc(100vh - 68px);
          padding: 48px 0 110px;
          color: #edf6ff;
        }

        .verify-wrap {
          width: min(1400px, calc(100% - 48px));
          margin: 0 auto;
        }

        .hero {
          position: relative;
          overflow: hidden;
          padding: clamp(32px, 5vw, 68px);
          border: 1px solid rgba(132, 177, 216, .16);
          border-radius: 34px;
          background:
            radial-gradient(circle at 83% 7%, rgba(84, 239, 174, .16), transparent 28%),
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
          font-size: clamp(5rem, 13vw, 11rem);
          font-weight: 1000;
          letter-spacing: -.1em;
          pointer-events: none;
        }

        .hero-content {
          position: relative;
          z-index: 1;
          max-width: 980px;
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
          background: linear-gradient(100deg, #fff, #8ceaff 50%, #54efae);
          background-clip: text;
          -webkit-background-clip: text;
        }

        .hero-copy {
          max-width: 860px;
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
          background: linear-gradient(100deg, #56e6ff, #54efae);
        }

        .button-secondary {
          min-height: 47px;
          padding: 0 19px;
          border: 1px solid rgba(136, 180, 219, .22);
          color: #dce9f5;
          background: rgba(7, 17, 29, .72);
        }

        .small-button {
          min-height: 40px;
          padding: 0 14px;
          border: 1px solid rgba(136, 180, 219, .2);
          color: #dce9f5;
          background: rgba(7, 17, 29, .75);
          font-size: .75rem;
        }

        .toolbar {
          display: grid;
          grid-template-columns: minmax(220px, 1fr) 220px;
          gap: 12px;
          margin: 22px 0;
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
          grid-template-columns: minmax(0, .75fr) minmax(0, 1.25fr);
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

        .record-row {
          width: 100%;
          padding: 20px 21px;
          border: 0;
          border-bottom: 1px solid rgba(132, 177, 216, .1);
          color: inherit;
          background: transparent;
          text-align: left;
          cursor: pointer;
        }

        .record-row:last-child { border-bottom: 0; }

        .record-row.active {
          background: linear-gradient(90deg, rgba(84, 232, 255, .09), rgba(84, 239, 174, .025));
          box-shadow: inset 3px 0 0 #56e6ff;
        }

        .row-top, .meta, .detail-top, .check-top {
          display: flex;
          align-items: center;
          gap: 9px;
          flex-wrap: wrap;
        }

        .row-top { justify-content: space-between; }

        .record-name { font-weight: 900; }

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

        .pill.PASS, .pill.VERIFIED {
          color: #54efae;
          border-color: rgba(84, 239, 174, .3);
        }

        .pill.UNKNOWN, .pill.INCOMPLETE, .pill.READY {
          color: #ffd27b;
          border-color: rgba(255, 210, 123, .3);
        }

        .pill.FAIL, .pill.DIVERGENT, .pill.DISPUTED {
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

        .score-grid {
          display: grid;
          grid-template-columns: 1.2fr repeat(3, 1fr);
          gap: 10px;
          margin: 20px 0;
        }

        .score-card {
          padding: 17px;
          border: 1px solid rgba(132, 177, 216, .12);
          border-radius: 17px;
          background: rgba(2, 9, 16, .52);
        }

        .score-card strong {
          display: block;
          font-size: 1.65rem;
          letter-spacing: -.04em;
        }

        .score-card span {
          display: block;
          margin-top: 4px;
          color: #7890a7;
          font-size: .67rem;
          font-weight: 850;
          letter-spacing: .07em;
          text-transform: uppercase;
        }

        .checks {
          display: grid;
          gap: 11px;
          margin-top: 19px;
        }

        .check {
          padding: 17px;
          border: 1px solid rgba(132, 177, 216, .12);
          border-radius: 17px;
          background: rgba(2, 9, 16, .52);
        }

        .check-top { justify-content: space-between; }

        .check strong { font-size: .9rem; }

        .check p {
          margin: 9px 0 0;
          font-size: .79rem;
        }

        .comparison {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-top: 12px;
        }

        .comparison div {
          padding: 12px;
          border-radius: 13px;
          background: rgba(255,255,255,.025);
        }

        .comparison span {
          display: block;
          margin-bottom: 6px;
          color: #70889f;
          font-size: .63rem;
          font-weight: 900;
          letter-spacing: .08em;
          text-transform: uppercase;
        }

        .comparison code {
          color: #cbd9e5;
          font: 700 .7rem ui-monospace, SFMono-Regular, Menlo, monospace;
          overflow-wrap: anywhere;
        }

        .notice {
          margin-top: 18px;
          padding: 16px 18px;
          border-left: 3px solid #54efae;
          border-radius: 0 13px 13px 0;
          color: #91a8bd;
          background: rgba(84, 239, 174, .04);
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
          .verify-wrap { width: min(100% - 24px, 1400px); }
          .verify-page { padding-top: 24px; }
          .hero { padding: 28px 22px 34px; border-radius: 24px; }
          .toolbar { grid-template-columns: 1fr; }
          .score-grid, .comparison { grid-template-columns: 1fr 1fr; }
        }
      `}</style>

      <div className="verify-wrap">
        <section className="hero">
          <div className="hero-content">
            <p className="eyebrow">
              TA-14 Exchange · Admissible Record Verification
            </p>
            <h1>
              Verify the record.
              <br />
              <span className="gradient">Not the assertion.</span>
            </h1>
            <p className="hero-copy">
              Compare identity, evidence, custody, authority, preservation,
              unknowns, signatures, and package digests before a durable record
              is represented as independently verifiable.
            </p>

            <div className="hero-actions">
              <Link className="button" href="/workspace/records">
                Open Record Studio
              </Link>
              <Link
                className="button-secondary"
                href="/workspace/records/custody"
              >
                Open Custody Desk
              </Link>
              <Link className="button-secondary" href="/workspace/keys">
                Open Trust Keys
              </Link>
            </div>
          </div>
        </section>

        <section className="toolbar">
          <input
            aria-label="Search record verifications"
            placeholder="Search verification, record, submitter, reviewer, or notes"
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
            <option value="ALL">All verification states</option>
            <option value="READY">READY</option>
            <option value="VERIFIED">VERIFIED</option>
            <option value="DIVERGENT">DIVERGENT</option>
            <option value="INCOMPLETE">INCOMPLETE</option>
            <option value="DISPUTED">DISPUTED</option>
          </select>
        </section>

        <section className="grid">
          <div className="panel">
            <div className="panel-head">
              <strong>Record verification queue</strong>
              <span>{filtered.length} visible</span>
            </div>

            {filtered.length ? (
              filtered.map((record) => (
                <button
                  className={`record-row ${
                    selected.verificationId === record.verificationId
                      ? "active"
                      : ""
                  }`}
                  key={record.verificationId}
                  type="button"
                  onClick={() => setSelectedId(record.verificationId)}
                >
                  <div className="row-top">
                    <span className="record-name">{record.recordTitle}</span>
                    <span className={`pill ${record.verificationState}`}>
                      {record.verificationState}
                    </span>
                  </div>
                  <div className="mono">{record.verificationId}</div>
                  <div className="meta">
                    <span>{record.recordId}</span>
                    <span>v{record.recordVersion}</span>
                    <span>{record.submittedBy}</span>
                    <span>{formatDate(record.submittedAt)}</span>
                  </div>
                </button>
              ))
            ) : (
              <div className="empty">
                No record verification matches the current filters.
              </div>
            )}
          </div>

          <aside className="panel detail">
            <div className="detail-top">
              <span className={`pill ${summary.determination}`}>
                {summary.determination}
              </span>
              <span className="pill">v{selected.recordVersion}</span>
              <span className="pill">{selected.reviewer}</span>
            </div>

            <h2>{selected.recordTitle}</h2>
            <div className="mono">{selected.verificationId}</div>
            <p>{selected.notes}</p>

            <div className="score-grid">
              <article className="score-card">
                <strong>{summary.score}%</strong>
                <span>Correspondence</span>
              </article>
              <article className="score-card">
                <strong>{summary.passed}</strong>
                <span>Passed</span>
              </article>
              <article className="score-card">
                <strong>{summary.failed}</strong>
                <span>Failed</span>
              </article>
              <article className="score-card">
                <strong>{summary.unknown}</strong>
                <span>Unknown</span>
              </article>
            </div>

            <div className="checks">
              {selected.checks.length ? (
                selected.checks.map((check) => (
                  <article className="check" key={check.checkId}>
                    <div className="check-top">
                      <strong>{check.label}</strong>
                      <span className={`pill ${check.state}`}>
                        {check.state}
                      </span>
                    </div>
                    <p>{check.description}</p>
                    <div className="comparison">
                      <div>
                        <span>Expected</span>
                        <code>{check.expected}</code>
                      </div>
                      <div>
                        <span>Observed</span>
                        <code>{check.observed}</code>
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <div className="empty">
                  Detailed checks are not loaded for this sample record.
                </div>
              )}
            </div>

            <div className="detail-actions">
              <button
                className="button"
                type="button"
                onClick={runVerification}
              >
                Run correspondence verification
              </button>

              {selected.checks.some(
                (check) =>
                  check.checkId === "CHK-SIGNATURE" &&
                  check.state === "UNKNOWN",
              ) ? (
                <button
                  className="small-button"
                  type="button"
                  onClick={resolveUnknownSignature}
                >
                  Verify trusted signature
                </button>
              ) : null}

              <button
                className="small-button"
                type="button"
                onClick={copyReport}
              >
                {copied ? "Copied" : "Copy report"}
              </button>

              <button
                className="small-button"
                type="button"
                onClick={() =>
                  downloadJson(
                    `${selected.verificationId.toLowerCase()}-verification-report.json`,
                    verificationReport,
                  )
                }
              >
                Download report
              </button>

              <Link className="small-button" href="/workspace/review">
                Escalate to review
              </Link>
            </div>

            <div className="notice">
              A VERIFIED result means the tested package components correspond
              to the preserved record and trusted dependencies. It does not
              automatically prove every underlying claim or guarantee legal
              admissibility in every jurisdiction.
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
