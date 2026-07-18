"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type VerificationState =
  | "PENDING"
  | "VALID"
  | "INVALID"
  | "UNKNOWN"
  | "SUSPENDED"
  | "REVOKED"
  | "SUPERSEDED";

type RestorationState =
  | "DRAFT"
  | "PENDING_APPROVAL"
  | "RESTORED"
  | "PARTIALLY_RESTORED"
  | "DENIED"
  | "REVOKED"
  | "SUPERSEDED";

type CheckState = "PASS" | "FAIL" | "UNKNOWN";

type RestorationVerification = {
  verificationId: string;
  restorationId: string;
  retestId: string;
  remediationCaseId: string;
  auditId: string;
  closureId: string;
  relianceReceiptId: string;
  certificateId: string;
  recordId: string;
  recordTitle: string;
  relyingParty: string;
  intendedUse: string;
  state: VerificationState;
  restorationStateObserved: RestorationState;
  restoredClosureStateObserved: string;
  verifiedBy: string;
  verifiedAt: string;
  registryVersion: string;
  expectedRestorationDigest: string;
  observedRestorationDigest: string;
  checks: {
    label: string;
    state: CheckState;
    evidence: string;
  }[];
  warnings: string[];
  unresolvedConditions: string[];
  verificationStatement: string;
  verificationReceiptId: string;
  verificationDigest: string;
};

const initialVerifications: RestorationVerification[] = [
  {
    verificationId: "TA14-FCRCARRSV-000001",
    restorationId: "TA14-FCRCARRS-000001",
    retestId: "TA14-FCRCARR-000001",
    remediationCaseId: "TA14-FCRCAR-000001",
    auditId: "TA14-FCRCA-000002",
    closureId: "TA14-FCRC-000003",
    relianceReceiptId: "TA14-FCR-000006",
    certificateId: "TA14-FCERT-000009",
    recordId: "TA14-AR-2026-000119",
    recordTitle: "Legacy Disclosure Approval",
    relyingParty: "External Communications Review",
    intendedUse: "PUBLIC_DISCLOSURE",
    state: "VALID",
    restorationStateObserved: "RESTORED",
    restoredClosureStateObserved: "VERIFIED_CLOSED",
    verifiedBy: "TA-14 Restoration Verification Surface",
    verifiedAt: "2026-07-30T19:26:00.000Z",
    registryVersion: "restoration-registry-v2026.07.30.2",
    expectedRestorationDigest:
      "sha256:ad715539af98e8a1bb4bc164765f1fd9f78c6390a85e1567d66b4db5974f3587",
    observedRestorationDigest:
      "sha256:ad715539af98e8a1bb4bc164765f1fd9f78c6390a85e1567d66b4db5974f3587",
    checks: [
      {
        label: "Restoration attestation exists",
        state: "PASS",
        evidence: "TA14-FCRCARRS-000001 located in registry",
      },
      {
        label: "Restoration digest matches",
        state: "PASS",
        evidence: "Observed digest equals issued attestation digest",
      },
      {
        label: "Independent retest fully passed",
        state: "PASS",
        evidence: "TA14-FCRCARR-000001 state PASSED",
      },
      {
        label: "All restoration approvals completed",
        state: "PASS",
        evidence: "Retest, audit, and closure authorities approved",
      },
      {
        label: "Closure state restored correctly",
        state: "PASS",
        evidence: "Current closure state VERIFIED_CLOSED",
      },
      {
        label: "Original reliance receipt remains inactive",
        state: "PASS",
        evidence: "TA14-FCR-000006 remains closed",
      },
      {
        label: "Failure lineage remains preserved",
        state: "PASS",
        evidence: "Audit, remediation, and retest receipts remain linked",
      },
    ],
    warnings: [
      "Restoration does not authorize new reliance.",
      "Any new use requires current certificate verification and a new reliance receipt.",
    ],
    unresolvedConditions: [],
    verificationStatement:
      "The restoration attestation is valid, digest-matched, fully approved, and corresponds to a verified-closed reliance closure.",
    verificationReceiptId: "TA14-FCRCARRSV-RCPT-000001",
    verificationDigest:
      "sha256:f54474f07db0b7869696911c15b796e959b7c4db512b705c15dd7a2e0894741d",
  },
  {
    verificationId: "TA14-FCRCARRSV-000002",
    restorationId: "TA14-FCRCARRS-000002",
    retestId: "TA14-FCRCARR-000002",
    remediationCaseId: "TA14-FCRCAR-000002",
    auditId: "TA14-FCRCA-000005",
    closureId: "TA14-FCRC-000006",
    relianceReceiptId: "TA14-FCR-000007",
    certificateId: "TA14-FCERT-000010",
    recordId: "TA14-AR-2026-000148",
    recordTitle: "Temporary Training Demonstration Record",
    relyingParty: "Training Governance Team",
    intendedUse: "INTERNAL_REVIEW",
    state: "UNKNOWN",
    restorationStateObserved: "PENDING_APPROVAL",
    restoredClosureStateObserved: "PENDING",
    verifiedBy: "TA-14 Restoration Verification Surface",
    verifiedAt: "2026-08-20T19:18:00.000Z",
    registryVersion: "restoration-registry-v2026.08.20.1",
    expectedRestorationDigest: "PENDING",
    observedRestorationDigest: "PENDING",
    checks: [
      {
        label: "Restoration attestation exists",
        state: "PASS",
        evidence: "TA14-FCRCARRS-000002 located in registry",
      },
      {
        label: "Restoration digest matches",
        state: "UNKNOWN",
        evidence: "Digest not issued",
      },
      {
        label: "Independent retest fully passed",
        state: "FAIL",
        evidence: "TA14-FCRCARR-000002 state PARTIAL_PASS",
      },
      {
        label: "All restoration approvals completed",
        state: "UNKNOWN",
        evidence: "Approvals remain pending",
      },
      {
        label: "Closure state restored correctly",
        state: "UNKNOWN",
        evidence: "Closure remains reopened",
      },
      {
        label: "Original reliance receipt remains inactive",
        state: "PASS",
        evidence: "TA14-FCR-000007 remains expired",
      },
    ],
    warnings: [
      "Pending restoration must not be represented as verified closure.",
      "Partial retest passage does not support restoration.",
    ],
    unresolvedConditions: [
      "Lineage-preservation retest remains incomplete.",
      "Restoration approvals remain pending.",
      "No restoration digest has been issued.",
    ],
    verificationStatement:
      "Restoration cannot be verified because the retest did not fully pass and approval remains incomplete.",
    verificationReceiptId: "TA14-FCRCARRSV-RCPT-000002",
    verificationDigest:
      "sha256:455a0e04c45f34dd75667fd91b4b572f51bbd55165b99d81203fd3185c8d0012",
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

function deriveVerificationState(
  record: RestorationVerification,
): VerificationState {
  if (record.restorationStateObserved === "REVOKED") return "REVOKED";
  if (record.restorationStateObserved === "SUPERSEDED") return "SUPERSEDED";

  const failed = record.checks.some((check) => check.state === "FAIL");
  const unknown = record.checks.some((check) => check.state === "UNKNOWN");

  if (failed) return "INVALID";
  if (unknown) return "UNKNOWN";

  if (
    record.restorationStateObserved === "RESTORED" &&
    record.restoredClosureStateObserved === "VERIFIED_CLOSED"
  ) {
    return "VALID";
  }

  return "PENDING";
}

export default function ClosureRestorationVerificationPage() {
  const [records, setRecords] = useState(initialVerifications);
  const [selectedId, setSelectedId] = useState(
    initialVerifications[0].verificationId,
  );
  const [query, setQuery] = useState("");
  const [stateFilter, setStateFilter] = useState<VerificationState | "ALL">(
    "ALL",
  );
  const [lookupValue, setLookupValue] = useState("");
  const [copied, setCopied] = useState(false);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return records.filter((record) => {
      const matchesQuery =
        !needle ||
        [
          record.verificationId,
          record.restorationId,
          record.retestId,
          record.remediationCaseId,
          record.auditId,
          record.closureId,
          record.relianceReceiptId,
          record.certificateId,
          record.recordId,
          record.recordTitle,
          record.relyingParty,
          record.intendedUse,
          record.state,
          record.restorationStateObserved,
          record.restoredClosureStateObserved,
          record.verificationStatement,
          ...record.warnings,
          ...record.unresolvedConditions,
        ]
          .join(" ")
          .toLowerCase()
          .includes(needle);

      return (
        matchesQuery &&
        (stateFilter === "ALL" || record.state === stateFilter)
      );
    });
  }, [query, records, stateFilter]);

  const selected =
    records.find((record) => record.verificationId === selectedId) ??
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
      valid: records.filter((item) => item.state === "VALID").length,
      unknown: records.filter((item) => item.state === "UNKNOWN").length,
      invalid: records.filter((item) => item.state === "INVALID").length,
      pending: records.filter((item) => item.state === "PENDING").length,
    }),
    [records],
  );

  const verificationPackage = {
    schema:
      "TA14_FINALITY_CERTIFICATE_RELIANCE_CLOSURE_RESTORATION_VERIFICATION_REPORT_V1",
    generatedAt: new Date().toISOString(),
    verification: selected,
    evaluation: {
      passedChecks: selected.checks.filter((check) => check.state === "PASS")
        .length,
      failedChecks: failedChecks.length,
      unknownChecks: unknownChecks.length,
      digestMatches:
        selected.expectedRestorationDigest !== "PENDING" &&
        selected.expectedRestorationDigest ===
          selected.observedRestorationDigest,
      restorationVerified:
        selected.state === "VALID" &&
        failedChecks.length === 0 &&
        unknownChecks.length === 0,
    },
    governance: {
      restorationAttestationBound: true,
      retestBound: true,
      remediationBound: true,
      failedAuditBound: true,
      closureBound: true,
      originalRelianceReceiptStateChecked: true,
      failureLineageChecked: true,
      limitationsPreserved: true,
    },
    limitation:
      "Verification confirms the observed restoration registry state only. It does not reactivate the original reliance receipt or authorize any new use, party, disclosure, execution, or decision.",
  };

  function runLookup() {
    const needle = lookupValue.trim().toLowerCase();
    if (!needle) return;

    const match = records.find((record) =>
      [
        record.verificationId,
        record.restorationId,
        record.retestId,
        record.closureId,
        record.recordId,
      ]
        .join(" ")
        .toLowerCase()
        .includes(needle),
    );

    if (match) {
      setSelectedId(match.verificationId);
      return;
    }

    const verificationId = `TA14-FCRCARRSV-${Math.floor(
      100000 + Math.random() * 900000,
    )}`;

    const generated: RestorationVerification = {
      verificationId,
      restorationId: lookupValue.trim(),
      retestId: "UNKNOWN",
      remediationCaseId: "UNKNOWN",
      auditId: "UNKNOWN",
      closureId: "UNKNOWN",
      relianceReceiptId: "UNKNOWN",
      certificateId: "UNKNOWN",
      recordId: "UNKNOWN",
      recordTitle: "Unresolved Restoration Lookup",
      relyingParty: "UNKNOWN",
      intendedUse: "UNKNOWN",
      state: "UNKNOWN",
      restorationStateObserved: "DRAFT",
      restoredClosureStateObserved: "UNKNOWN",
      verifiedBy: "TA-14 Restoration Verification Surface",
      verifiedAt: new Date().toISOString(),
      registryVersion: "current",
      expectedRestorationDigest: "UNKNOWN",
      observedRestorationDigest: "UNKNOWN",
      checks: [
        {
          label: "Restoration attestation exists",
          state: "FAIL",
          evidence: "No matching restoration attestation was located",
        },
        {
          label: "Restoration digest matches",
          state: "UNKNOWN",
          evidence: "Unavailable",
        },
        {
          label: "Independent retest fully passed",
          state: "UNKNOWN",
          evidence: "Unavailable",
        },
        {
          label: "Closure state restored correctly",
          state: "UNKNOWN",
          evidence: "Unavailable",
        },
      ],
      warnings: [
        "The restoration identifier could not be resolved.",
        "Do not represent unresolved restoration as verified closure.",
      ],
      unresolvedConditions: [
        "Restoration identity unresolved.",
        "Retest lineage unresolved.",
        "Closure state unresolved.",
      ],
      verificationStatement:
        "Verification is unknown because the restoration attestation and its governing lineage could not be resolved.",
      verificationReceiptId: `TA14-FCRCARRSV-RCPT-${Math.floor(
        100000 + Math.random() * 900000,
      )}`,
      verificationDigest: makeDigest(
        JSON.stringify({
          verificationId,
          restorationId: lookupValue.trim(),
          state: "UNKNOWN",
        }),
      ),
    };

    setRecords((items) => [generated, ...items]);
    setSelectedId(generated.verificationId);
  }

  function rerunVerification() {
    const nextState = deriveVerificationState(selected);
    const now = new Date().toISOString();

    setRecords((items) =>
      items.map((item) =>
        item.verificationId === selected.verificationId
          ? {
              ...item,
              state: nextState,
              verifiedAt: now,
              verificationStatement:
                nextState === "VALID"
                  ? "The restoration attestation is valid, digest-matched, fully approved, and corresponds to a verified-closed reliance closure."
                  : nextState === "INVALID"
                    ? "Restoration verification failed because one or more required governing checks did not pass."
                    : nextState === "UNKNOWN"
                      ? "Restoration verification remains unknown because one or more required facts could not be resolved."
                      : nextState === "REVOKED"
                        ? "The restoration attestation has been revoked and may not support verified-closed status."
                        : nextState === "SUPERSEDED"
                          ? "The restoration attestation has been superseded and is historical only."
                          : "Restoration verification remains pending.",
              verificationDigest: makeDigest(
                JSON.stringify({
                  verificationId: item.verificationId,
                  restorationId: item.restorationId,
                  checks: item.checks,
                  state: nextState,
                  verifiedAt: now,
                }),
              ),
            }
          : item,
      ),
    );
  }

  async function copyPackage() {
    await navigator.clipboard.writeText(
      JSON.stringify(verificationPackage, null, 2),
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
            radial-gradient(circle at 85% 7%, rgba(132, 113, 255, .16), transparent 28%),
            radial-gradient(circle at 14% 0%, rgba(73, 239, 172, .17), transparent 32%),
            linear-gradient(135deg, rgba(14, 30, 48, .97), rgba(5, 11, 20, .98));
          box-shadow: 0 38px 120px rgba(0,0,0,.35);
        }

        .hero::after {
          content: "PROVE";
          position: absolute;
          right: -10px;
          bottom: -42px;
          color: rgba(255,255,255,.025);
          font-size: clamp(4.8rem, 12vw, 10rem);
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
          background: linear-gradient(100deg, #fff, #8ceaff 50%, #8471ff);
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
          max-width: 820px;
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
          background: linear-gradient(100deg, #56e6ff, #8471ff);
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
          grid-template-columns: minmax(220px, 1fr) 240px;
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
          background: linear-gradient(90deg, rgba(84, 232, 255, .09), rgba(132, 113, 255, .025));
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

        .pill.PENDING, .pill.UNKNOWN {
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
          border-left: 3px solid #8471ff;
          border-radius: 0 13px 13px 0;
          color: #91a8bd;
          background: rgba(132, 113, 255, .045);
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
          .lookup, .toolbar { grid-template-columns: 1fr; }
          .metrics { grid-template-columns: 1fr 1fr; }
          .kv { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="verification-wrap">
        <section className="hero">
          <div className="hero-content">
            <p className="eyebrow">
              TA-14 Exchange · Restoration Verification
            </p>
            <h1>
              Restored is another claim.
              <br />
              <span className="gradient">Verify the restoration itself.</span>
            </h1>
            <p className="hero-copy">
              Resolve a restoration attestation against the registry, compare
              its digest, verify full retest passage and multi-authority
              approval, confirm the closure returned to verified-closed status,
              and prove the original reliance receipt remained inactive.
            </p>

            <div className="lookup">
              <input
                aria-label="Restoration lookup"
                placeholder="Enter restoration, verification, retest, closure, or record ID"
                value={lookupValue}
                onChange={(event) => setLookupValue(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") runLookup();
                }}
              />
              <button className="button" type="button" onClick={runLookup}>
                Verify restoration
              </button>
            </div>

            <div className="hero-actions">
              <Link
                className="button-secondary"
                href="/workspace/records/disposition/finality/certificates/reliance/closure/audit/remediation/retest/restoration"
              >
                Open Restoration Desk
              </Link>
              <Link
                className="button-secondary"
                href="/workspace/records/disposition/finality/certificates/reliance/closure/audit/remediation/retest"
              >
                Open Independent Retest
              </Link>
              <Link
                className="button-secondary"
                href="/workspace/records/disposition/finality/certificates/reliance/closure"
              >
                Open Reliance Closure
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
            <strong>{metrics.unknown}</strong>
            <span>Unknown</span>
          </article>
          <article className="metric">
            <strong>{metrics.invalid}</strong>
            <span>Invalid</span>
          </article>
          <article className="metric">
            <strong>{metrics.pending}</strong>
            <span>Pending</span>
          </article>
        </section>

        <section className="toolbar">
          <input
            aria-label="Search restoration verifications"
            placeholder="Search verification, restoration, retest, closure, party, warning, or statement"
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
            <option value="VALID">VALID</option>
            <option value="INVALID">INVALID</option>
            <option value="UNKNOWN">UNKNOWN</option>
            <option value="SUSPENDED">SUSPENDED</option>
            <option value="REVOKED">REVOKED</option>
            <option value="SUPERSEDED">SUPERSEDED</option>
          </select>
        </section>

        <section className="grid">
          <div className="panel">
            <div className="panel-head">
              <strong>Restoration verifications</strong>
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
                    <span className={`pill ${record.state}`}>
                      {record.state}
                    </span>
                  </div>
                  <div className="mono">{record.restorationId}</div>
                  <div className="meta">
                    <span>{record.restorationStateObserved}</span>
                    <span>{record.restoredClosureStateObserved}</span>
                    <span>{record.relyingParty}</span>
                    <span>{formatDate(record.verifiedAt)}</span>
                  </div>
                </button>
              ))
            ) : (
              <div className="empty">
                No restoration verification matches the current filters.
              </div>
            )}
          </div>

          <aside className="panel detail">
            <div className="detail-top">
              <span className={`pill ${selected.state}`}>{selected.state}</span>
              <span className="pill">
                {selected.restorationStateObserved}
              </span>
              <span className="pill">
                {selected.restoredClosureStateObserved}
              </span>
            </div>

            <h2>{selected.recordTitle}</h2>
            <div className="mono">{selected.verificationId}</div>

            <div className="result-banner">
              <h3>{selected.restorationId}</h3>
              <p>{selected.verificationStatement}</p>
            </div>

            <dl className="kv">
              <dt>Restoration ID</dt>
              <dd>{selected.restorationId}</dd>

              <dt>Retest ID</dt>
              <dd>{selected.retestId}</dd>

              <dt>Remediation case</dt>
              <dd>{selected.remediationCaseId}</dd>

              <dt>Audit ID</dt>
              <dd>{selected.auditId}</dd>

              <dt>Closure ID</dt>
              <dd>{selected.closureId}</dd>

              <dt>Reliance receipt</dt>
              <dd>{selected.relianceReceiptId}</dd>

              <dt>Certificate ID</dt>
              <dd>{selected.certificateId}</dd>

              <dt>Record ID</dt>
              <dd>{selected.recordId}</dd>

              <dt>Relying party</dt>
              <dd>{selected.relyingParty}</dd>

              <dt>Intended use</dt>
              <dd>{selected.intendedUse}</dd>

              <dt>Verified by</dt>
              <dd>{selected.verifiedBy}</dd>

              <dt>Verified at</dt>
              <dd>{formatDate(selected.verifiedAt)}</dd>

              <dt>Registry version</dt>
              <dd>{selected.registryVersion}</dd>

              <dt>Expected digest</dt>
              <dd>{selected.expectedRestorationDigest}</dd>

              <dt>Observed digest</dt>
              <dd>{selected.observedRestorationDigest}</dd>

              <dt>Verification receipt</dt>
              <dd>{selected.verificationReceiptId}</dd>

              <dt>Verification digest</dt>
              <dd>{selected.verificationDigest}</dd>
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
              {selected.warnings.length ? (
                <ul>
                  {selected.warnings.map((warning) => (
                    <li key={warning}>{warning}</li>
                  ))}
                </ul>
              ) : (
                <p>No active warning was recorded.</p>
              )}
            </div>

            <div className="box">
              <strong>Unresolved conditions</strong>
              {selected.unresolvedConditions.length ? (
                <ul>
                  {selected.unresolvedConditions.map((condition) => (
                    <li key={condition}>{condition}</li>
                  ))}
                </ul>
              ) : (
                <p>No unresolved condition remains.</p>
              )}
            </div>

            <div className="detail-actions">
              <button
                className="button"
                type="button"
                onClick={rerunVerification}
              >
                Re-run verification
              </button>

              <button
                className="small-button"
                type="button"
                onClick={() =>
                  setRecords((items) =>
                    items.map((item) =>
                      item.verificationId === selected.verificationId
                        ? {
                            ...item,
                            state: "SUSPENDED",
                            verificationStatement:
                              "Restoration verification has been suspended pending registry review.",
                          }
                        : item,
                    ),
                  )
                }
              >
                Suspend verification
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
                    `${selected.verificationId.toLowerCase()}-restoration-verification.json`,
                    verificationPackage,
                  )
                }
              >
                Download report
              </button>
            </div>

            <div className="notice">
              A valid restoration verification proves only that the closure
              returned to verified-closed status under the observed registry
              state. It does not revive the old reliance receipt or authorize a
              new consequence-bearing use.
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
