"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type FinalityState =
  | "PROVISIONAL"
  | "CURRENT"
  | "SUSPENDED"
  | "UNDER_APPEAL"
  | "REOPENED"
  | "FINAL"
  | "SUPERSEDED";

type RelianceDirective =
  | "DO_NOT_RELY"
  | "LIMITED_RELIANCE"
  | "CONDITIONAL_RELIANCE"
  | "CURRENT_RELIANCE"
  | "HISTORICAL_ONLY";

type ResolutionSource =
  | "ORIGINAL_CLOSURE"
  | "APPEAL"
  | "REOPENED_VERIFICATION"
  | "AMENDED_CLOSURE"
  | "REVOCATION"
  | "MANUAL_REVIEW";

type StateResolution = {
  resolutionId: string;
  recordId: string;
  recordTitle: string;
  recordVersion: string;
  dispositionId: string;
  currentClosureId: string;
  priorClosureIds: string[];
  appealIds: string[];
  reclosureIds: string[];
  state: FinalityState;
  relianceDirective: RelianceDirective;
  source: ResolutionSource;
  resolvedBy: string;
  resolvedAt: string;
  nextReviewAt: string;
  currentStatement: string;
  currentLimitations: string[];
  bindingReceipts: string[];
  supersededReceipts: string[];
  unresolvedConditions: string[];
  stateChecks: {
    label: string;
    status: "PASS" | "FAIL" | "UNKNOWN";
    evidence: string;
  }[];
  finalityDigest: string;
  registryPublishedAt: string;
};

const initialResolutions: StateResolution[] = [
  {
    resolutionId: "TA14-FIN-000021",
    recordId: "TA14-AR-2026-000126",
    recordTitle: "Archived Vendor Access Evidence",
    recordVersion: "2.0.0",
    dispositionId: "TA14-RDP-000015",
    currentClosureId: "TA14-RCL-000003",
    priorClosureIds: ["TA14-DCL-000007"],
    appealIds: ["TA14-DCA-000004"],
    reclosureIds: ["TA14-RCL-000003"],
    state: "FINAL",
    relianceDirective: "CURRENT_RELIANCE",
    source: "AMENDED_CLOSURE",
    resolvedBy: "TA-14 Finality Resolver",
    resolvedAt: "2026-07-06T10:08:00.000Z",
    nextReviewAt: "2027-07-06T10:08:00.000Z",
    currentStatement:
      "The technical disposition was completed and independently verified. A required affected-party notice occurred after the original closure attestation and remains preserved as a process defect.",
    currentLimitations: [
      "The late-notice process defect remains part of the permanent record.",
      "Technical verification applies only to tested systems.",
    ],
    bindingReceipts: [
      "TA14-RCL-000003",
      "TA14-DCA-RES-000004",
      "TA14-DVR-000015",
      "TA14-DRM-000008",
    ],
    supersededReceipts: ["TA14-DCL-000007"],
    unresolvedConditions: [],
    stateChecks: [
      {
        label: "Current closure identified",
        status: "PASS",
        evidence: "TA14-RCL-000003",
      },
      {
        label: "Appeal resolved",
        status: "PASS",
        evidence: "TA14-DCA-RES-000004",
      },
      {
        label: "Reliance restored",
        status: "PASS",
        evidence: "Reliance restoration receipt",
      },
      {
        label: "No active reopening",
        status: "PASS",
        evidence: "Registry scan completed",
      },
    ],
    finalityDigest:
      "sha256:73df05891d0d50f40170f7928ddb940741247b1ed968e74b7e55bf31b30f73bf",
    registryPublishedAt: "2026-07-06T10:12:00.000Z",
  },
  {
    resolutionId: "TA14-FIN-000022",
    recordId: "TA14-AR-2026-000132",
    recordTitle: "Expired Demonstration Upload",
    recordVersion: "1.0.0",
    dispositionId: "TA14-RDP-000016",
    currentClosureId: "TA14-DCL-000009",
    priorClosureIds: ["TA14-DCL-000009"],
    appealIds: ["TA14-DCA-000006"],
    reclosureIds: ["TA14-RCL-000004"],
    state: "REOPENED",
    relianceDirective: "DO_NOT_RELY",
    source: "APPEAL",
    resolvedBy: "TA-14 Finality Resolver",
    resolvedAt: "2026-07-17T19:26:00.000Z",
    nextReviewAt: "2026-07-24T17:00:00.000Z",
    currentStatement:
      "The prior closure remains preserved, but current reliance is suspended while a newly identified storage replica is tested.",
    currentLimitations: [
      "The original closure may not have covered replica-east-03.",
      "No amended closure may be published until reopened verification is complete.",
    ],
    bindingReceipts: [
      "TA14-DCA-000006",
      "TA14-RCL-000004",
      "TA14-DCL-000009",
    ],
    supersededReceipts: [],
    unresolvedConditions: [
      "Complete verification of replica-east-03.",
      "Determine whether remediation is required.",
      "Issue an amended closure or restore the prior closure with added limitation.",
    ],
    stateChecks: [
      {
        label: "Appeal materially accepted",
        status: "PASS",
        evidence: "TA14-DCA-000006",
      },
      {
        label: "Reopened verification complete",
        status: "FAIL",
        evidence: "PENDING",
      },
      {
        label: "Current closure statement resolved",
        status: "UNKNOWN",
        evidence: "TA14-RCL-000004 remains DRAFT",
      },
      {
        label: "Reliance suspended",
        status: "PASS",
        evidence: "DO_NOT_RELY directive",
      },
    ],
    finalityDigest: "PENDING",
    registryPublishedAt: "2026-07-17T19:31:00.000Z",
  },
  {
    resolutionId: "TA14-FIN-000020",
    recordId: "TA14-AR-2026-000148",
    recordTitle: "Temporary Training Demonstration Record",
    recordVersion: "1.0.0",
    dispositionId: "TA14-RDP-000019",
    currentClosureId: "TA14-DCL-000008",
    priorClosureIds: [],
    appealIds: ["TA14-DCA-000005"],
    reclosureIds: [],
    state: "CURRENT",
    relianceDirective: "CURRENT_RELIANCE",
    source: "ORIGINAL_CLOSURE",
    resolvedBy: "TA-14 Finality Resolver",
    resolvedAt: "2026-07-12T16:14:00.000Z",
    nextReviewAt: "2027-07-12T16:14:00.000Z",
    currentStatement:
      "The authorized disposition corresponded to the approved scope and required lineage remains preserved.",
    currentLimitations: [
      "Verification does not establish deletion from uncontrolled third-party copies.",
    ],
    bindingReceipts: [
      "TA14-DCL-000008",
      "TA14-DCA-000005",
      "TA14-DVR-000019",
    ],
    supersededReceipts: [],
    unresolvedConditions: [],
    stateChecks: [
      {
        label: "Closure attested",
        status: "PASS",
        evidence: "TA14-DCL-000008",
      },
      {
        label: "Appeal resolved",
        status: "PASS",
        evidence: "Appeal rejected at screening",
      },
      {
        label: "No unresolved conditions",
        status: "PASS",
        evidence: "Registry scan completed",
      },
    ],
    finalityDigest:
      "sha256:5fcd12f9c49f5ad6f3494702788887215e32c35cfbe871d0e5de56459e586c89",
    registryPublishedAt: "2026-07-12T16:20:00.000Z",
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

export default function DispositionFinalityResolverPage() {
  const [records, setRecords] = useState(initialResolutions);
  const [selectedId, setSelectedId] = useState(initialResolutions[0].resolutionId);
  const [query, setQuery] = useState("");
  const [stateFilter, setStateFilter] = useState<FinalityState | "ALL">("ALL");
  const [relianceFilter, setRelianceFilter] = useState<
    RelianceDirective | "ALL"
  >("ALL");
  const [copied, setCopied] = useState(false);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return records.filter((record) => {
      const matchesQuery =
        !needle ||
        [
          record.resolutionId,
          record.recordId,
          record.recordTitle,
          record.dispositionId,
          record.currentClosureId,
          record.state,
          record.relianceDirective,
          record.source,
          record.resolvedBy,
          record.currentStatement,
          ...record.bindingReceipts,
          ...record.unresolvedConditions,
        ]
          .join(" ")
          .toLowerCase()
          .includes(needle);

      return (
        matchesQuery &&
        (stateFilter === "ALL" || record.state === stateFilter) &&
        (relianceFilter === "ALL" ||
          record.relianceDirective === relianceFilter)
      );
    });
  }, [query, records, relianceFilter, stateFilter]);

  const selected =
    records.find((record) => record.resolutionId === selectedId) ??
    filtered[0] ??
    records[0];

  const failedChecks = selected.stateChecks.filter(
    (check) => check.status === "FAIL",
  );
  const unknownChecks = selected.stateChecks.filter(
    (check) => check.status === "UNKNOWN",
  );

  const metrics = useMemo(
    () => ({
      final: records.filter((item) => item.state === "FINAL").length,
      current: records.filter((item) => item.state === "CURRENT").length,
      reopened: records.filter((item) => item.state === "REOPENED").length,
      suspended: records.filter(
        (item) => item.relianceDirective === "DO_NOT_RELY",
      ).length,
    }),
    [records],
  );

  const finalityPackage = {
    schema: "TA14_DISPOSITION_FINALITY_RESOLUTION_V1",
    generatedAt: new Date().toISOString(),
    resolution: selected,
    evaluation: {
      passedChecks: selected.stateChecks.filter(
        (check) => check.status === "PASS",
      ).length,
      failedChecks: failedChecks.length,
      unknownChecks: unknownChecks.length,
      unresolvedConditions: selected.unresolvedConditions.length,
      finalityEligible:
        failedChecks.length === 0 &&
        unknownChecks.length === 0 &&
        selected.unresolvedConditions.length === 0,
    },
    governance: {
      canonicalCurrentStateResolved: true,
      historicalClosuresPreserved: true,
      appealsPreserved: true,
      reclosuresPreserved: true,
      relianceDirectiveExplicit: true,
      supersededReceiptsRetained: true,
      unresolvedConditionsDisclosed: true,
    },
    limitation:
      "Finality identifies the current governing state within the preserved TA-14 record chain. It does not prevent later challenge, newly discovered evidence, lawful reopening, or supersession.",
  };

  function resolveCurrent() {
    const hasOpenConditions =
      failedChecks.length > 0 ||
      unknownChecks.length > 0 ||
      selected.unresolvedConditions.length > 0;

    setRecords((items) =>
      items.map((item) =>
        item.resolutionId === selected.resolutionId
          ? {
              ...item,
              state: hasOpenConditions ? "PROVISIONAL" : "CURRENT",
              relianceDirective: hasOpenConditions
                ? "CONDITIONAL_RELIANCE"
                : "CURRENT_RELIANCE",
              resolvedAt: new Date().toISOString(),
              finalityDigest: makeDigest(
                JSON.stringify({
                  resolutionId: item.resolutionId,
                  currentClosureId: item.currentClosureId,
                  stateChecks: item.stateChecks,
                  unresolvedConditions: item.unresolvedConditions,
                }),
              ),
            }
          : item,
      ),
    );
  }

  function declareFinal() {
    if (
      failedChecks.length > 0 ||
      unknownChecks.length > 0 ||
      selected.unresolvedConditions.length > 0
    ) {
      return;
    }

    setRecords((items) =>
      items.map((item) =>
        item.resolutionId === selected.resolutionId
          ? {
              ...item,
              state: "FINAL",
              relianceDirective: "CURRENT_RELIANCE",
              resolvedAt: new Date().toISOString(),
              finalityDigest: makeDigest(
                JSON.stringify({
                  resolutionId: item.resolutionId,
                  currentClosureId: item.currentClosureId,
                  bindingReceipts: item.bindingReceipts,
                  currentStatement: item.currentStatement,
                  currentLimitations: item.currentLimitations,
                }),
              ),
              registryPublishedAt: new Date().toISOString(),
            }
          : item,
      ),
    );
  }

  async function copyPackage() {
    await navigator.clipboard.writeText(JSON.stringify(finalityPackage, null, 2));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <main className="finality-page">
      <style>{`
        * { box-sizing: border-box; }

        .finality-page {
          min-height: calc(100vh - 68px);
          padding: 48px 0 110px;
          color: #edf6ff;
        }

        .finality-wrap {
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
            radial-gradient(circle at 85% 7%, rgba(97, 255, 202, .15), transparent 28%),
            radial-gradient(circle at 14% 0%, rgba(72, 223, 255, .17), transparent 32%),
            linear-gradient(135deg, rgba(14, 30, 48, .97), rgba(5, 11, 20, .98));
          box-shadow: 0 38px 120px rgba(0,0,0,.35);
        }

        .hero::after {
          content: "CURRENT";
          position: absolute;
          right: -10px;
          bottom: -42px;
          color: rgba(255,255,255,.025);
          font-size: clamp(4.2rem, 11vw, 9.4rem);
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
          background: linear-gradient(100deg, #fff, #8ceaff 50%, #61ffca);
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
          background: linear-gradient(100deg, #56e6ff, #61ffca);
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

        .resolution-row {
          width: 100%;
          padding: 20px 21px;
          border: 0;
          border-bottom: 1px solid rgba(132, 177, 216, .1);
          color: inherit;
          background: transparent;
          text-align: left;
          cursor: pointer;
        }

        .resolution-row:last-child { border-bottom: 0; }

        .resolution-row.active {
          background: linear-gradient(90deg, rgba(84, 232, 255, .09), rgba(97, 255, 202, .025));
          box-shadow: inset 3px 0 0 #56e6ff;
        }

        .row-top, .meta, .detail-top {
          display: flex;
          align-items: center;
          gap: 9px;
          flex-wrap: wrap;
        }

        .row-top { justify-content: space-between; }

        .resolution-title { font-weight: 900; }

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

        .pill.FINAL, .pill.CURRENT, .pill.CURRENT_RELIANCE, .pill.PASS {
          color: #54efae;
          border-color: rgba(84, 239, 174, .3);
        }

        .pill.PROVISIONAL, .pill.CONDITIONAL_RELIANCE, .pill.UNKNOWN {
          color: #ffd27b;
          border-color: rgba(255, 210, 123, .3);
        }

        .pill.REOPENED, .pill.UNDER_APPEAL, .pill.SUSPENDED,
        .pill.DO_NOT_RELY, .pill.REVOKED, .pill.FAIL {
          color: #ff8e9b;
          border-color: rgba(255, 142, 155, .3);
        }

        .pill.SUPERSEDED, .pill.HISTORICAL_ONLY {
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
          border-left: 3px solid #61ffca;
          border-radius: 0 13px 13px 0;
          color: #91a8bd;
          background: rgba(97, 255, 202, .045);
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
          .finality-wrap { width: min(100% - 24px, 1420px); }
          .finality-page { padding-top: 24px; }
          .hero { padding: 28px 22px 34px; border-radius: 24px; }
          .toolbar { grid-template-columns: 1fr; }
          .metrics { grid-template-columns: 1fr 1fr; }
          .kv { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="finality-wrap">
        <section className="hero">
          <div className="hero-content">
            <p className="eyebrow">
              TA-14 Exchange · Disposition Finality Resolver
            </p>
            <h1>
              One current state.
              <br />
              <span className="gradient">Every prior state preserved.</span>
            </h1>
            <p className="hero-copy">
              Resolve the canonical current disposition state across original
              closures, appeals, reopened verification, amended closures,
              superseded receipts, unresolved conditions, and reliance
              directives without collapsing the preserved history.
            </p>

            <div className="hero-actions">
              <Link
                className="button"
                href="/workspace/records/disposition/closure/amended"
              >
                Open Amended Closures
              </Link>
              <Link
                className="button-secondary"
                href="/workspace/records/disposition/closure/appeals"
              >
                Open Closure Appeals
              </Link>
              <Link
                className="button-secondary"
                href="/workspace/records/reliance"
              >
                Open Reliance Ledger
              </Link>
            </div>
          </div>
        </section>

        <section className="metrics">
          <article className="metric">
            <strong>{metrics.final}</strong>
            <span>Final</span>
          </article>
          <article className="metric">
            <strong>{metrics.current}</strong>
            <span>Current</span>
          </article>
          <article className="metric">
            <strong>{metrics.reopened}</strong>
            <span>Reopened</span>
          </article>
          <article className="metric">
            <strong>{metrics.suspended}</strong>
            <span>Reliance suspended</span>
          </article>
        </section>

        <section className="toolbar">
          <input
            aria-label="Search finality resolutions"
            placeholder="Search record, closure, appeal, receipt, state, source, condition, or statement"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />

          <select
            aria-label="Filter finality state"
            value={stateFilter}
            onChange={(event) =>
              setStateFilter(event.target.value as FinalityState | "ALL")
            }
          >
            <option value="ALL">All states</option>
            <option value="PROVISIONAL">PROVISIONAL</option>
            <option value="CURRENT">CURRENT</option>
            <option value="SUSPENDED">SUSPENDED</option>
            <option value="UNDER_APPEAL">UNDER_APPEAL</option>
            <option value="REOPENED">REOPENED</option>
            <option value="FINAL">FINAL</option>
            <option value="SUPERSEDED">SUPERSEDED</option>
          </select>

          <select
            aria-label="Filter reliance directive"
            value={relianceFilter}
            onChange={(event) =>
              setRelianceFilter(
                event.target.value as RelianceDirective | "ALL",
              )
            }
          >
            <option value="ALL">All reliance directives</option>
            <option value="DO_NOT_RELY">DO_NOT_RELY</option>
            <option value="LIMITED_RELIANCE">LIMITED_RELIANCE</option>
            <option value="CONDITIONAL_RELIANCE">
              CONDITIONAL_RELIANCE
            </option>
            <option value="CURRENT_RELIANCE">CURRENT_RELIANCE</option>
            <option value="HISTORICAL_ONLY">HISTORICAL_ONLY</option>
          </select>
        </section>

        <section className="grid">
          <div className="panel">
            <div className="panel-head">
              <strong>Finality resolutions</strong>
              <span>{filtered.length} visible</span>
            </div>

            {filtered.length ? (
              filtered.map((record) => (
                <button
                  className={`resolution-row ${
                    selected.resolutionId === record.resolutionId
                      ? "active"
                      : ""
                  }`}
                  key={record.resolutionId}
                  type="button"
                  onClick={() => setSelectedId(record.resolutionId)}
                >
                  <div className="row-top">
                    <span className="resolution-title">{record.recordTitle}</span>
                    <span className={`pill ${record.state}`}>{record.state}</span>
                  </div>
                  <div className="mono">{record.resolutionId}</div>
                  <div className="meta">
                    <span>{record.relianceDirective}</span>
                    <span>{record.source}</span>
                    <span>{record.currentClosureId}</span>
                    <span>v{record.recordVersion}</span>
                  </div>
                </button>
              ))
            ) : (
              <div className="empty">
                No finality resolution matches the current filters.
              </div>
            )}
          </div>

          <aside className="panel detail">
            <div className="detail-top">
              <span className={`pill ${selected.state}`}>{selected.state}</span>
              <span className={`pill ${selected.relianceDirective}`}>
                {selected.relianceDirective}
              </span>
              <span className="pill">{selected.source}</span>
            </div>

            <h2>{selected.recordTitle}</h2>
            <div className="mono">{selected.resolutionId}</div>
            <p>{selected.currentStatement}</p>

            <dl className="kv">
              <dt>Record ID</dt>
              <dd>{selected.recordId}</dd>

              <dt>Version</dt>
              <dd>{selected.recordVersion}</dd>

              <dt>Disposition ID</dt>
              <dd>{selected.dispositionId}</dd>

              <dt>Current closure</dt>
              <dd>{selected.currentClosureId}</dd>

              <dt>Prior closures</dt>
              <dd>{selected.priorClosureIds.join(", ") || "NONE"}</dd>

              <dt>Appeals</dt>
              <dd>{selected.appealIds.join(", ") || "NONE"}</dd>

              <dt>Reclosures</dt>
              <dd>{selected.reclosureIds.join(", ") || "NONE"}</dd>

              <dt>Resolved by</dt>
              <dd>{selected.resolvedBy}</dd>

              <dt>Resolved</dt>
              <dd>{formatDate(selected.resolvedAt)}</dd>

              <dt>Next review</dt>
              <dd>{formatDate(selected.nextReviewAt)}</dd>

              <dt>Finality digest</dt>
              <dd>{selected.finalityDigest}</dd>

              <dt>Registry published</dt>
              <dd>{formatDate(selected.registryPublishedAt)}</dd>
            </dl>

            <div className="box">
              <strong>Current limitations</strong>
              <ul>
                {selected.currentLimitations.map((item) => (
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
              <strong>Superseded receipts</strong>
              {selected.supersededReceipts.length ? (
                <ul>
                  {selected.supersededReceipts.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p>No receipt is superseded.</p>
              )}
            </div>

            <div className="box">
              <strong>Unresolved conditions</strong>
              {selected.unresolvedConditions.length ? (
                <ul>
                  {selected.unresolvedConditions.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p>No unresolved condition remains.</p>
              )}
            </div>

            {selected.stateChecks.map((check) => (
              <div className="check" key={check.label}>
                <span className={`pill ${check.status}`}>{check.status}</span>
                <div>
                  <strong>{check.label}</strong>
                  <p>{check.evidence}</p>
                </div>
              </div>
            ))}

            <div className="detail-actions">
              <button className="button" type="button" onClick={resolveCurrent}>
                Resolve current state
              </button>

              <button
                className="small-button"
                type="button"
                onClick={declareFinal}
                disabled={
                  failedChecks.length > 0 ||
                  unknownChecks.length > 0 ||
                  selected.unresolvedConditions.length > 0
                }
              >
                Declare final
              </button>

              <button
                className="small-button"
                type="button"
                onClick={() =>
                  setRecords((items) =>
                    items.map((item) =>
                      item.resolutionId === selected.resolutionId
                        ? {
                            ...item,
                            state: "SUSPENDED",
                            relianceDirective: "DO_NOT_RELY",
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
                      item.resolutionId === selected.resolutionId
                        ? {
                            ...item,
                            state: "SUPERSEDED",
                            relianceDirective: "HISTORICAL_ONLY",
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
                {copied ? "Copied" : "Copy finality package"}
              </button>

              <button
                className="small-button"
                type="button"
                onClick={() =>
                  downloadJson(
                    `${selected.resolutionId.toLowerCase()}-finality-resolution.json`,
                    finalityPackage,
                  )
                }
              >
                Download resolution
              </button>
            </div>

            <div className="notice">
              Finality resolves the current governing state; it does not erase
              prior closures or prevent a later lawful challenge based on new
              evidence, authority, or material process defects.
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
