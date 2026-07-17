"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type ReclosureState =
  | "DRAFT"
  | "UNDER_REVIEW"
  | "ATTESTED"
  | "PUBLISHED"
  | "SUPERSEDED"
  | "WITHDRAWN"
  | "DISPUTED";

type ReclosureBasis =
  | "APPEAL_AMENDMENT"
  | "REOPENED_DISPOSITION"
  | "NEW_VERIFICATION"
  | "NEW_REMEDIATION"
  | "LIMITATION_UPDATE"
  | "AUTHORITY_CORRECTION";

type RelianceState =
  | "SUSPENDED"
  | "CONDITIONAL"
  | "RESTORED"
  | "REVOKED";

type ReclosureRecord = {
  reclosureId: string;
  priorClosureId: string;
  appealId: string;
  dispositionId: string;
  verificationId: string;
  remediationId: string;
  recordId: string;
  recordTitle: string;
  recordVersion: string;
  state: ReclosureState;
  basis: ReclosureBasis;
  relianceState: RelianceState;
  preparedBy: string;
  reviewedBy: string;
  attestedBy: string;
  preparedAt: string;
  reviewedAt: string;
  attestedAt: string;
  publishedAt: string;
  priorStatement: string;
  amendedStatement: string;
  amendmentReasons: string[];
  preservedReceipts: string[];
  supersededClaims: string[];
  continuingLimitations: string[];
  newEvidence: string[];
  finalChecks: {
    label: string;
    passed: boolean;
    evidence: string;
  }[];
  reclosureDigest: string;
  publicationReceiptId: string;
};

const initialRecords: ReclosureRecord[] = [
  {
    reclosureId: "TA14-RCL-000003",
    priorClosureId: "TA14-DCL-000007",
    appealId: "TA14-DCA-000004",
    dispositionId: "TA14-RDP-000015",
    verificationId: "TA14-DVR-000015",
    remediationId: "TA14-DRM-000008",
    recordId: "TA14-AR-2026-000126",
    recordTitle: "Archived Vendor Access Evidence",
    recordVersion: "2.0.0",
    state: "PUBLISHED",
    basis: "APPEAL_AMENDMENT",
    relianceState: "RESTORED",
    preparedBy: "TA-14 Closure Review Panel",
    reviewedBy: "TA-14 Review Desk",
    attestedBy: "TA-14 Review Desk",
    preparedAt: "2026-07-06T09:32:00.000Z",
    reviewedAt: "2026-07-06T09:47:00.000Z",
    attestedAt: "2026-07-06T09:54:00.000Z",
    publishedAt: "2026-07-06T10:02:00.000Z",
    priorStatement:
      "All required disposition conditions were completed.",
    amendedStatement:
      "The technical disposition was completed and independently verified. A required affected-party notice occurred after the original closure attestation and is preserved as a process defect.",
    amendmentReasons: [
      "Appeal established a material process defect.",
      "Technical execution remained valid.",
      "The original statement overstated completion of all procedural conditions.",
    ],
    preservedReceipts: [
      "TA14-DCL-000007",
      "TA14-DCA-000004",
      "TA14-DVR-000015",
      "TA14-DRM-000008",
      "Late notification receipt",
    ],
    supersededClaims: [
      "All required disposition conditions were completed.",
    ],
    continuingLimitations: [
      "Reclosure does not erase the late-notice defect.",
      "Technical verification remains limited to tested systems.",
    ],
    newEvidence: [
      "Disposition agreement notice clause",
      "Late notification email receipt",
      "Appeal resolution TA14-DCA-RES-000004",
    ],
    finalChecks: [
      {
        label: "Prior closure preserved",
        passed: true,
        evidence: "TA14-DCL-000007",
      },
      {
        label: "Appeal resolution preserved",
        passed: true,
        evidence: "TA14-DCA-RES-000004",
      },
      {
        label: "Amended statement matches findings",
        passed: true,
        evidence: "Closure panel review memorandum",
      },
      {
        label: "Reliance state updated",
        passed: true,
        evidence: "Reliance restoration receipt",
      },
    ],
    reclosureDigest:
      "sha256:4e86ca540fcbd37d1840da544431d32d5c3768776e2c90787e4af0902b78a5a1",
    publicationReceiptId: "TA14-RCL-PUB-000003",
  },
  {
    reclosureId: "TA14-RCL-000004",
    priorClosureId: "TA14-DCL-000009",
    appealId: "TA14-DCA-000006",
    dispositionId: "TA14-RDP-000016",
    verificationId: "TA14-DVR-000016",
    remediationId: "TA14-DRM-000009",
    recordId: "TA14-AR-2026-000132",
    recordTitle: "Expired Demonstration Upload",
    recordVersion: "1.0.0",
    state: "DRAFT",
    basis: "REOPENED_DISPOSITION",
    relianceState: "SUSPENDED",
    preparedBy: "TA-14 Closure Review Panel",
    reviewedBy: "PENDING",
    attestedBy: "PENDING",
    preparedAt: "2026-07-17T19:20:00.000Z",
    reviewedAt: "PENDING",
    attestedAt: "PENDING",
    publishedAt: "PENDING",
    priorStatement:
      "The authorized disposition was completed after documented remediation and independent retesting.",
    amendedStatement:
      "PENDING — reopened verification must determine whether the newly identified storage replica retained a scoped derivative.",
    amendmentReasons: [
      "Appeal introduced previously undocumented backup-replica evidence.",
      "The original verification scope may have been incomplete.",
      "Public reliance remains suspended pending retest.",
    ],
    preservedReceipts: [
      "TA14-DCL-000009",
      "TA14-DCA-000006",
      "TA14-DVR-000016",
      "TA14-DRM-000009",
    ],
    supersededClaims: [],
    continuingLimitations: [
      "No amended closure statement may be published before reopened verification is complete.",
    ],
    newEvidence: [
      "Backup inventory export dated 2026-07-06",
      "Storage topology note identifying replica-east-03",
      "Administrator declaration",
    ],
    finalChecks: [
      {
        label: "Reopened verification complete",
        passed: false,
        evidence: "PENDING",
      },
      {
        label: "New replica tested",
        passed: false,
        evidence: "PENDING",
      },
      {
        label: "Remediation completed if required",
        passed: false,
        evidence: "PENDING",
      },
      {
        label: "Reliance state determined",
        passed: true,
        evidence: "SUSPENDED",
      },
    ],
    reclosureDigest: "PENDING",
    publicationReceiptId: "PENDING",
  },
  {
    reclosureId: "TA14-RCL-000002",
    priorClosureId: "TA14-DCL-000006",
    appealId: "TA14-DCA-000003",
    dispositionId: "TA14-RDP-000014",
    verificationId: "TA14-DVR-000014-R2",
    remediationId: "TA14-DRM-000007",
    recordId: "TA14-AR-2026-000118",
    recordTitle: "Restricted Identity Export",
    recordVersion: "1.3.0",
    state: "ATTESTED",
    basis: "NEW_VERIFICATION",
    relianceState: "CONDITIONAL",
    preparedBy: "TA-14 Closure Review Panel",
    reviewedBy: "TA-14 Review Desk",
    attestedBy: "TA-14 Review Desk",
    preparedAt: "2026-07-04T12:22:00.000Z",
    reviewedAt: "2026-07-04T13:02:00.000Z",
    attestedAt: "2026-07-04T13:11:00.000Z",
    publishedAt: "PENDING",
    priorStatement:
      "The restricted export is no longer available through ordinary access paths.",
    amendedStatement:
      "The restricted export is inaccessible through tested ordinary and privileged access paths. Reliance remains conditional because one external processor was not within the verification scope.",
    amendmentReasons: [
      "Reopened verification expanded the tested access paths.",
      "An external processor remained outside the tested boundary.",
    ],
    preservedReceipts: [
      "TA14-DCL-000006",
      "TA14-DCA-000003",
      "TA14-DVR-000014-R2",
      "TA14-DRM-000007",
    ],
    supersededClaims: [
      "The restricted export is no longer available through ordinary access paths.",
    ],
    continuingLimitations: [
      "One external processor remains outside the verified boundary.",
      "Reliance is conditional on that disclosed limitation.",
    ],
    newEvidence: [
      "Privileged-access retest receipt",
      "External processor scope declaration",
    ],
    finalChecks: [
      {
        label: "Expanded verification complete",
        passed: true,
        evidence: "TA14-DVR-000014-R2",
      },
      {
        label: "External limitation disclosed",
        passed: true,
        evidence: "Processor scope declaration",
      },
      {
        label: "Prior closure preserved",
        passed: true,
        evidence: "TA14-DCL-000006",
      },
    ],
    reclosureDigest:
      "sha256:54b60a7f47ca38aee774a88adb9901d7cb87bfbfb90751841926882ac5d66491",
    publicationReceiptId: "PENDING",
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

export default function AmendedClosureReclosurePage() {
  const [records, setRecords] = useState(initialRecords);
  const [selectedId, setSelectedId] = useState(initialRecords[0].reclosureId);
  const [query, setQuery] = useState("");
  const [stateFilter, setStateFilter] = useState<ReclosureState | "ALL">("ALL");
  const [basisFilter, setBasisFilter] = useState<ReclosureBasis | "ALL">("ALL");
  const [copied, setCopied] = useState(false);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return records.filter((record) => {
      const matchesQuery =
        !needle ||
        [
          record.reclosureId,
          record.priorClosureId,
          record.appealId,
          record.dispositionId,
          record.recordId,
          record.recordTitle,
          record.state,
          record.basis,
          record.relianceState,
          record.preparedBy,
          record.reviewedBy,
          record.attestedBy,
          record.priorStatement,
          record.amendedStatement,
          ...record.amendmentReasons,
          ...record.newEvidence,
        ]
          .join(" ")
          .toLowerCase()
          .includes(needle);

      return (
        matchesQuery &&
        (stateFilter === "ALL" || record.state === stateFilter) &&
        (basisFilter === "ALL" || record.basis === basisFilter)
      );
    });
  }, [basisFilter, query, records, stateFilter]);

  const selected =
    records.find((record) => record.reclosureId === selectedId) ??
    filtered[0] ??
    records[0];

  const failedChecks = selected.finalChecks.filter((check) => !check.passed);

  const metrics = useMemo(
    () => ({
      draft: records.filter((item) => item.state === "DRAFT").length,
      review: records.filter((item) => item.state === "UNDER_REVIEW").length,
      attested: records.filter((item) => item.state === "ATTESTED").length,
      published: records.filter((item) => item.state === "PUBLISHED").length,
    }),
    [records],
  );

  const reclosurePackage = {
    schema: "TA14_AMENDED_DISPOSITION_CLOSURE_PACKAGE_V1",
    generatedAt: new Date().toISOString(),
    reclosure: selected,
    readiness: {
      passedChecks: selected.finalChecks.length - failedChecks.length,
      failedChecks: failedChecks.length,
      attestationReady: failedChecks.length === 0,
      publicationReady:
        failedChecks.length === 0 &&
        ["ATTESTED", "PUBLISHED"].includes(selected.state),
    },
    governance: {
      priorClosurePreserved: true,
      appealBound: true,
      newEvidencePreserved: true,
      supersededClaimsExplicit: true,
      relianceStateExplicit: true,
      amendedStatementVersioned: true,
      silentReplacementProhibited: true,
    },
    limitation:
      "An amended closure or reclosure supersedes only the identified claims and publication state. It does not erase the prior closure, appeal, divergence, or preserved historical record.",
  };

  function transition(nextState: ReclosureState) {
    setRecords((items) =>
      items.map((item) =>
        item.reclosureId === selected.reclosureId
          ? {
              ...item,
              state: nextState,
              reviewedBy:
                nextState === "UNDER_REVIEW"
                  ? "TA-14 Review Desk"
                  : item.reviewedBy,
              reviewedAt:
                nextState === "UNDER_REVIEW"
                  ? new Date().toISOString()
                  : item.reviewedAt,
            }
          : item,
      ),
    );
  }

  function attest() {
    if (failedChecks.length > 0) return;

    setRecords((items) =>
      items.map((item) =>
        item.reclosureId === selected.reclosureId
          ? {
              ...item,
              state: "ATTESTED",
              attestedBy: "TA-14 Review Desk",
              attestedAt: new Date().toISOString(),
              reclosureDigest: makeDigest(
                JSON.stringify({
                  reclosureId: item.reclosureId,
                  priorClosureId: item.priorClosureId,
                  appealId: item.appealId,
                  amendedStatement: item.amendedStatement,
                  finalChecks: item.finalChecks,
                  relianceState: item.relianceState,
                }),
              ),
            }
          : item,
      ),
    );
  }

  function publish() {
    if (
      failedChecks.length > 0 ||
      !["ATTESTED", "PUBLISHED"].includes(selected.state)
    ) {
      return;
    }

    setRecords((items) =>
      items.map((item) =>
        item.reclosureId === selected.reclosureId
          ? {
              ...item,
              state: "PUBLISHED",
              publishedAt: new Date().toISOString(),
              publicationReceiptId:
                item.publicationReceiptId === "PENDING"
                  ? `TA14-RCL-PUB-${Math.floor(
                      100000 + Math.random() * 900000,
                    )}`
                  : item.publicationReceiptId,
            }
          : item,
      ),
    );
  }

  async function copyPackage() {
    await navigator.clipboard.writeText(
      JSON.stringify(reclosurePackage, null, 2),
    );
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <main className="reclosure-page">
      <style>{`
        * { box-sizing: border-box; }

        .reclosure-page {
          min-height: calc(100vh - 68px);
          padding: 48px 0 110px;
          color: #edf6ff;
        }

        .reclosure-wrap {
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
            radial-gradient(circle at 85% 7%, rgba(255, 176, 87, .17), transparent 28%),
            radial-gradient(circle at 14% 0%, rgba(72, 223, 255, .17), transparent 32%),
            linear-gradient(135deg, rgba(14, 30, 48, .97), rgba(5, 11, 20, .98));
          box-shadow: 0 38px 120px rgba(0,0,0,.35);
        }

        .hero::after {
          content: "RECLOSE";
          position: absolute;
          right: -10px;
          bottom: -42px;
          color: rgba(255,255,255,.025);
          font-size: clamp(4.3rem, 11vw, 9.5rem);
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
          background: linear-gradient(100deg, #fff, #8ceaff 50%, #ffb057);
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
          background: linear-gradient(100deg, #56e6ff, #ffb057);
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

        .reclosure-row {
          width: 100%;
          padding: 20px 21px;
          border: 0;
          border-bottom: 1px solid rgba(132, 177, 216, .1);
          color: inherit;
          background: transparent;
          text-align: left;
          cursor: pointer;
        }

        .reclosure-row:last-child { border-bottom: 0; }

        .reclosure-row.active {
          background: linear-gradient(90deg, rgba(84, 232, 255, .09), rgba(255, 176, 87, .025));
          box-shadow: inset 3px 0 0 #56e6ff;
        }

        .row-top, .meta, .detail-top {
          display: flex;
          align-items: center;
          gap: 9px;
          flex-wrap: wrap;
        }

        .row-top { justify-content: space-between; }

        .reclosure-title { font-weight: 900; }

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

        .pill.ATTESTED, .pill.PUBLISHED, .pill.RESTORED, .pill.pass {
          color: #54efae;
          border-color: rgba(84, 239, 174, .3);
        }

        .pill.DRAFT, .pill.UNDER_REVIEW, .pill.CONDITIONAL {
          color: #ffd27b;
          border-color: rgba(255, 210, 123, .3);
        }

        .pill.SUSPENDED, .pill.REVOKED, .pill.SUPERSEDED,
        .pill.WITHDRAWN, .pill.DISPUTED, .pill.fail {
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

        .box, .statement, .check {
          margin-top: 17px;
          padding: 16px;
          border: 1px solid rgba(132, 177, 216, .12);
          border-radius: 17px;
          background: rgba(2, 9, 16, .52);
        }

        .box strong, .statement strong, .check strong {
          display: block;
          color: #dce8f3;
          font-size: .76rem;
          letter-spacing: .07em;
          text-transform: uppercase;
        }

        .box p, .statement p, .check p {
          margin: 10px 0 0;
          font-size: .8rem;
        }

        .box ul {
          margin: 10px 0 0;
          padding-left: 18px;
          color: #9fb1c1;
          line-height: 1.65;
        }

        .statement-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 13px;
          margin-top: 12px;
        }

        .statement-grid div {
          padding: 13px;
          border-radius: 13px;
          background: rgba(8, 18, 30, .72);
        }

        .statement-grid span {
          color: #718aa1;
          font-size: .66rem;
          font-weight: 900;
          letter-spacing: .08em;
          text-transform: uppercase;
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
          border-left: 3px solid #ffb057;
          border-radius: 0 13px 13px 0;
          color: #91a8bd;
          background: rgba(255, 176, 87, .045);
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
          .reclosure-wrap { width: min(100% - 24px, 1420px); }
          .reclosure-page { padding-top: 24px; }
          .hero { padding: 28px 22px 34px; border-radius: 24px; }
          .toolbar, .statement-grid { grid-template-columns: 1fr; }
          .metrics { grid-template-columns: 1fr 1fr; }
          .kv { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="reclosure-wrap">
        <section className="hero">
          <div className="hero-content">
            <p className="eyebrow">
              TA-14 Exchange · Amended Closure & Reclosure
            </p>
            <h1>
              Amend the conclusion.
              <br />
              <span className="gradient">Never overwrite the history.</span>
            </h1>
            <p className="hero-copy">
              Issue an amended closure after appeal, reopened verification,
              remediation, authority correction, or limitation update while
              preserving the prior closure, superseded claims, reliance state,
              new evidence, and every governing receipt.
            </p>

            <div className="hero-actions">
              <Link
                className="button"
                href="/workspace/records/disposition/closure/appeals"
              >
                Open Closure Appeals
              </Link>
              <Link
                className="button-secondary"
                href="/workspace/records/disposition/closure"
              >
                Open Closure Registry
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
            <strong>{metrics.draft}</strong>
            <span>Draft</span>
          </article>
          <article className="metric">
            <strong>{metrics.review}</strong>
            <span>Under review</span>
          </article>
          <article className="metric">
            <strong>{metrics.attested}</strong>
            <span>Attested</span>
          </article>
          <article className="metric">
            <strong>{metrics.published}</strong>
            <span>Published</span>
          </article>
        </section>

        <section className="toolbar">
          <input
            aria-label="Search amended closures"
            placeholder="Search record, appeal, closure, basis, statement, evidence, reviewer, or reliance state"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />

          <select
            aria-label="Filter reclosure state"
            value={stateFilter}
            onChange={(event) =>
              setStateFilter(event.target.value as ReclosureState | "ALL")
            }
          >
            <option value="ALL">All states</option>
            <option value="DRAFT">DRAFT</option>
            <option value="UNDER_REVIEW">UNDER_REVIEW</option>
            <option value="ATTESTED">ATTESTED</option>
            <option value="PUBLISHED">PUBLISHED</option>
            <option value="SUPERSEDED">SUPERSEDED</option>
            <option value="WITHDRAWN">WITHDRAWN</option>
            <option value="DISPUTED">DISPUTED</option>
          </select>

          <select
            aria-label="Filter reclosure basis"
            value={basisFilter}
            onChange={(event) =>
              setBasisFilter(event.target.value as ReclosureBasis | "ALL")
            }
          >
            <option value="ALL">All bases</option>
            <option value="APPEAL_AMENDMENT">APPEAL_AMENDMENT</option>
            <option value="REOPENED_DISPOSITION">REOPENED_DISPOSITION</option>
            <option value="NEW_VERIFICATION">NEW_VERIFICATION</option>
            <option value="NEW_REMEDIATION">NEW_REMEDIATION</option>
            <option value="LIMITATION_UPDATE">LIMITATION_UPDATE</option>
            <option value="AUTHORITY_CORRECTION">AUTHORITY_CORRECTION</option>
          </select>
        </section>

        <section className="grid">
          <div className="panel">
            <div className="panel-head">
              <strong>Amended closures</strong>
              <span>{filtered.length} visible</span>
            </div>

            {filtered.length ? (
              filtered.map((record) => (
                <button
                  className={`reclosure-row ${
                    selected.reclosureId === record.reclosureId ? "active" : ""
                  }`}
                  key={record.reclosureId}
                  type="button"
                  onClick={() => setSelectedId(record.reclosureId)}
                >
                  <div className="row-top">
                    <span className="reclosure-title">{record.recordTitle}</span>
                    <span className={`pill ${record.state}`}>{record.state}</span>
                  </div>
                  <div className="mono">{record.reclosureId}</div>
                  <div className="meta">
                    <span>{record.basis}</span>
                    <span>{record.relianceState}</span>
                    <span>{record.appealId}</span>
                    <span>v{record.recordVersion}</span>
                  </div>
                </button>
              ))
            ) : (
              <div className="empty">
                No amended closure matches the current filters.
              </div>
            )}
          </div>

          <aside className="panel detail">
            <div className="detail-top">
              <span className={`pill ${selected.state}`}>{selected.state}</span>
              <span className="pill">{selected.basis}</span>
              <span className={`pill ${selected.relianceState}`}>
                {selected.relianceState}
              </span>
            </div>

            <h2>{selected.recordTitle}</h2>
            <div className="mono">{selected.reclosureId}</div>

            <dl className="kv">
              <dt>Prior closure</dt>
              <dd>{selected.priorClosureId}</dd>

              <dt>Appeal ID</dt>
              <dd>{selected.appealId}</dd>

              <dt>Disposition ID</dt>
              <dd>{selected.dispositionId}</dd>

              <dt>Verification ID</dt>
              <dd>{selected.verificationId}</dd>

              <dt>Remediation ID</dt>
              <dd>{selected.remediationId}</dd>

              <dt>Record ID</dt>
              <dd>{selected.recordId}</dd>

              <dt>Version</dt>
              <dd>{selected.recordVersion}</dd>

              <dt>Prepared by</dt>
              <dd>{selected.preparedBy}</dd>

              <dt>Reviewed by</dt>
              <dd>{selected.reviewedBy}</dd>

              <dt>Attested by</dt>
              <dd>{selected.attestedBy}</dd>

              <dt>Prepared</dt>
              <dd>{formatDate(selected.preparedAt)}</dd>

              <dt>Reviewed</dt>
              <dd>{formatDate(selected.reviewedAt)}</dd>

              <dt>Attested</dt>
              <dd>{formatDate(selected.attestedAt)}</dd>

              <dt>Published</dt>
              <dd>{formatDate(selected.publishedAt)}</dd>

              <dt>Digest</dt>
              <dd>{selected.reclosureDigest}</dd>

              <dt>Publication receipt</dt>
              <dd>{selected.publicationReceiptId}</dd>
            </dl>

            <div className="statement">
              <strong>Statement comparison</strong>
              <div className="statement-grid">
                <div>
                  <span>Prior statement</span>
                  <p>{selected.priorStatement}</p>
                </div>
                <div>
                  <span>Amended statement</span>
                  <p>{selected.amendedStatement}</p>
                </div>
              </div>
            </div>

            <div className="box">
              <strong>Amendment reasons</strong>
              <ul>
                {selected.amendmentReasons.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="box">
              <strong>New evidence</strong>
              <ul>
                {selected.newEvidence.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="box">
              <strong>Preserved receipts</strong>
              <ul>
                {selected.preservedReceipts.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="box">
              <strong>Superseded claims</strong>
              {selected.supersededClaims.length ? (
                <ul>
                  {selected.supersededClaims.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p>No claim has yet been superseded.</p>
              )}
            </div>

            <div className="box">
              <strong>Continuing limitations</strong>
              <ul>
                {selected.continuingLimitations.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            {selected.finalChecks.map((check) => (
              <div className="check" key={check.label}>
                <span className={`pill ${check.passed ? "pass" : "fail"}`}>
                  {check.passed ? "PASS" : "FAIL"}
                </span>
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
                onClick={() => transition("UNDER_REVIEW")}
              >
                Begin review
              </button>

              <button
                className="small-button"
                type="button"
                onClick={attest}
                disabled={failedChecks.length > 0}
              >
                Attest reclosure
              </button>

              <button
                className="small-button"
                type="button"
                onClick={publish}
                disabled={
                  failedChecks.length > 0 ||
                  !["ATTESTED", "PUBLISHED"].includes(selected.state)
                }
              >
                Publish amended closure
              </button>

              <button
                className="small-button"
                type="button"
                onClick={() => transition("DISPUTED")}
              >
                Mark disputed
              </button>

              <button
                className="small-button"
                type="button"
                onClick={() => transition("WITHDRAWN")}
              >
                Withdraw
              </button>

              <button
                className="small-button"
                type="button"
                onClick={copyPackage}
              >
                {copied ? "Copied" : "Copy reclosure package"}
              </button>

              <button
                className="small-button"
                type="button"
                onClick={() =>
                  downloadJson(
                    `${selected.reclosureId.toLowerCase()}-amended-closure.json`,
                    reclosurePackage,
                  )
                }
              >
                Download package
              </button>
            </div>

            <div className="notice">
              Reclosure changes the current governing conclusion without
              rewriting the prior record. The original closure, appeal, evidence,
              superseded claims, limitations, and reliance changes remain
              permanently linked.
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
