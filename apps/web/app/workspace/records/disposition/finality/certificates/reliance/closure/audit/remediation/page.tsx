"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type RemediationState =
  | "OPEN"
  | "PLANNED"
  | "IN_PROGRESS"
  | "READY_FOR_RETEST"
  | "VERIFIED_RESOLVED"
  | "REJECTED"
  | "WAIVED";

type Severity = "LOW" | "MODERATE" | "HIGH" | "CRITICAL";

type ActionState = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETE" | "BLOCKED";

type AuditRemediationCase = {
  caseId: string;
  auditId: string;
  closureId: string;
  relianceReceiptId: string;
  certificateId: string;
  verificationId: string;
  recordId: string;
  recordTitle: string;
  relyingParty: string;
  intendedUse: string;
  state: RemediationState;
  severity: Severity;
  openedBy: string;
  openedAt: string;
  targetCompletionAt: string;
  completedAt: string;
  rootCause: string;
  nonconformingUse: string[];
  containmentActions: string[];
  correctiveActions: {
    actionId: string;
    owner: string;
    description: string;
    state: ActionState;
    dueAt: string;
    evidenceReceipt: string;
  }[];
  retestRequirements: string[];
  residualRisk: string[];
  closureImpact: string;
  remediationStatement: string;
  remediationReceiptId: string;
  remediationDigest: string;
};

const initialCases: AuditRemediationCase[] = [
  {
    caseId: "TA14-FCRCAR-000002",
    auditId: "TA14-FCRCA-000005",
    closureId: "TA14-FCRC-000006",
    relianceReceiptId: "TA14-FCR-000007",
    certificateId: "TA14-FCERT-000010",
    verificationId: "TA14-FCV-000013",
    recordId: "TA14-AR-2026-000148",
    recordTitle: "Temporary Training Demonstration Record",
    relyingParty: "Training Governance Team",
    intendedUse: "INTERNAL_REVIEW",
    state: "IN_PROGRESS",
    severity: "MODERATE",
    openedBy: "TA-14 Closure Audit Remediation Desk",
    openedAt: "2026-08-18T11:40:00.000Z",
    targetCompletionAt: "2026-08-20T18:00:00.000Z",
    completedAt: "PENDING",
    rootCause:
      "The relying party continued one internal review session after the reliance receipt expired because the local workflow did not enforce receipt expiration at session start.",
    nonconformingUse: [
      "One internal review event occurred three hours after receipt expiry.",
      "No external disclosure occurred.",
      "No system execution or contractual decision occurred.",
    ],
    containmentActions: [
      "Disabled the expired reliance receipt.",
      "Blocked new review sessions using TA14-FCR-000007.",
      "Preserved the post-expiry review event.",
      "Notified the relying party and closure authority.",
    ],
    correctiveActions: [
      {
        actionId: "TA14-FCRCAR-ACT-00001",
        owner: "Training Governance Team",
        description:
          "Acknowledge the post-expiry use and certify that no external disclosure occurred.",
        state: "COMPLETE",
        dueAt: "2026-08-18T18:00:00.000Z",
        evidenceReceipt: "TA14-ACK-000441",
      },
      {
        actionId: "TA14-FCRCAR-ACT-00002",
        owner: "Workspace Engineering",
        description:
          "Enforce receipt-expiry validation before every governed review session begins.",
        state: "IN_PROGRESS",
        dueAt: "2026-08-19T18:00:00.000Z",
        evidenceReceipt: "PENDING",
      },
      {
        actionId: "TA14-FCRCAR-ACT-00003",
        owner: "TA-14 Reliance Desk",
        description:
          "Require a new certificate verification and reliance receipt before renewed use.",
        state: "NOT_STARTED",
        dueAt: "2026-08-20T18:00:00.000Z",
        evidenceReceipt: "PENDING",
      },
    ],
    retestRequirements: [
      "Attempt to start a governed review session using the expired receipt.",
      "Confirm the session is blocked before content access.",
      "Confirm a new valid receipt permits only the authorized use.",
      "Verify the original post-expiry event remains preserved.",
    ],
    residualRisk: [
      "Historical internal notes produced during the post-expiry session remain preserved.",
      "Renewed use remains prohibited until retest succeeds.",
    ],
    closureImpact:
      "The prior closure remains unverified and reopened for remediation.",
    remediationStatement:
      "Containment is complete. Corrective implementation and independent retest remain required before closure may be verified.",
    remediationReceiptId: "TA14-FCRCAR-RCPT-000002",
    remediationDigest:
      "sha256:6b0c13c66bc50dfa686c8c20d95af2bd0127394f3fbc61ea8fcfa0b14a1c8ed9",
  },
  {
    caseId: "TA14-FCRCAR-000001",
    auditId: "TA14-FCRCA-000002",
    closureId: "TA14-FCRC-000003",
    relianceReceiptId: "TA14-FCR-000006",
    certificateId: "TA14-FCERT-000009",
    verificationId: "TA14-FCV-000012",
    recordId: "TA14-AR-2026-000119",
    recordTitle: "Legacy Disclosure Approval",
    relyingParty: "External Communications Review",
    intendedUse: "PUBLIC_DISCLOSURE",
    state: "VERIFIED_RESOLVED",
    severity: "HIGH",
    openedBy: "TA-14 Closure Audit Remediation Desk",
    openedAt: "2026-07-28T14:05:00.000Z",
    targetCompletionAt: "2026-07-30T20:00:00.000Z",
    completedAt: "2026-07-30T19:12:00.000Z",
    rootCause:
      "A cached publication draft retained a stale certificate reference after the governing certificate had been superseded.",
    nonconformingUse: [
      "A stale certificate identifier appeared in one unpublished draft.",
      "The draft was never publicly released.",
    ],
    containmentActions: [
      "Removed the stale certificate reference.",
      "Quarantined the unpublished draft.",
      "Scanned publication routes for the superseded identifier.",
    ],
    correctiveActions: [
      {
        actionId: "TA14-FCRCAR-ACT-00004",
        owner: "Publication Engineering",
        description:
          "Reject superseded certificate identifiers during publication validation.",
        state: "COMPLETE",
        dueAt: "2026-07-29T18:00:00.000Z",
        evidenceReceipt: "TA14-ENG-TEST-000711",
      },
      {
        actionId: "TA14-FCRCAR-ACT-00005",
        owner: "External Communications Review",
        description:
          "Replace cached templates with registry-resolved certificate references.",
        state: "COMPLETE",
        dueAt: "2026-07-30T12:00:00.000Z",
        evidenceReceipt: "TA14-TPL-000212",
      },
    ],
    retestRequirements: [
      "Attempt publication with a superseded certificate identifier.",
      "Confirm the route is denied.",
      "Resolve and publish only with the current valid certificate.",
    ],
    residualRisk: [
      "Historical drafts remain preserved as nonpublic records.",
    ],
    closureImpact:
      "The closure was re-audited and verified after successful remediation.",
    remediationStatement:
      "All corrective actions passed independent retest. The reliance closure is verified resolved.",
    remediationReceiptId: "TA14-FCRCAR-RCPT-000001",
    remediationDigest:
      "sha256:82a77936df72d7163efab047fd5469a1f423327fbf70b71ade81a1967d20708a",
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

export default function ClosureAuditRemediationPage() {
  const [records, setRecords] = useState(initialCases);
  const [selectedId, setSelectedId] = useState(initialCases[0].caseId);
  const [query, setQuery] = useState("");
  const [stateFilter, setStateFilter] = useState<RemediationState | "ALL">("ALL");
  const [severityFilter, setSeverityFilter] = useState<Severity | "ALL">("ALL");
  const [copied, setCopied] = useState(false);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return records.filter((record) => {
      const matchesQuery =
        !needle ||
        [
          record.caseId,
          record.auditId,
          record.closureId,
          record.relianceReceiptId,
          record.certificateId,
          record.verificationId,
          record.recordId,
          record.recordTitle,
          record.relyingParty,
          record.intendedUse,
          record.state,
          record.severity,
          record.rootCause,
          record.closureImpact,
          record.remediationStatement,
          ...record.nonconformingUse,
          ...record.containmentActions,
          ...record.retestRequirements,
          ...record.residualRisk,
          ...record.correctiveActions.flatMap((action) => [
            action.actionId,
            action.owner,
            action.description,
            action.state,
            action.evidenceReceipt,
          ]),
        ]
          .join(" ")
          .toLowerCase()
          .includes(needle);

      return (
        matchesQuery &&
        (stateFilter === "ALL" || record.state === stateFilter) &&
        (severityFilter === "ALL" || record.severity === severityFilter)
      );
    });
  }, [query, records, severityFilter, stateFilter]);

  const selected =
    records.find((record) => record.caseId === selectedId) ??
    filtered[0] ??
    records[0];

  const incompleteActions = selected.correctiveActions.filter(
    (action) => action.state !== "COMPLETE",
  );

  const blockedActions = selected.correctiveActions.filter(
    (action) => action.state === "BLOCKED",
  );

  const metrics = useMemo(
    () => ({
      open: records.filter((item) => item.state === "OPEN").length,
      active: records.filter(
        (item) =>
          item.state === "PLANNED" ||
          item.state === "IN_PROGRESS" ||
          item.state === "READY_FOR_RETEST",
      ).length,
      resolved: records.filter(
        (item) => item.state === "VERIFIED_RESOLVED",
      ).length,
      blocked: records.reduce(
        (count, item) =>
          count +
          item.correctiveActions.filter((action) => action.state === "BLOCKED")
            .length,
        0,
      ),
    }),
    [records],
  );

  const remediationPackage = {
    schema: "TA14_FINALITY_CERTIFICATE_RELIANCE_CLOSURE_AUDIT_REMEDIATION_PACKAGE_V1",
    generatedAt: new Date().toISOString(),
    remediation: selected,
    evaluation: {
      totalActions: selected.correctiveActions.length,
      completedActions: selected.correctiveActions.filter(
        (action) => action.state === "COMPLETE",
      ).length,
      incompleteActions: incompleteActions.length,
      blockedActions: blockedActions.length,
      readyForRetest:
        incompleteActions.length === 0 && selected.retestRequirements.length > 0,
      closureMayBeVerified:
        selected.state === "VERIFIED_RESOLVED" &&
        incompleteActions.length === 0,
    },
    governance: {
      auditBound: true,
      closureBound: true,
      relianceReceiptBound: true,
      rootCausePreserved: true,
      containmentPreserved: true,
      correctiveActionsPreserved: true,
      retestRequired: true,
      failureHistoryPreserved: true,
    },
    limitation:
      "Remediation does not erase the failed or partial audit. Closure may be verified only after corrective actions are complete and independent retest demonstrates that the nonconforming reliance path is no longer available.",
  };

  function updateAction(actionId: string, state: ActionState) {
    setRecords((items) =>
      items.map((item) =>
        item.caseId === selected.caseId
          ? {
              ...item,
              state:
                state === "IN_PROGRESS" && item.state === "OPEN"
                  ? "IN_PROGRESS"
                  : item.state,
              correctiveActions: item.correctiveActions.map((action) =>
                action.actionId === actionId
                  ? {
                      ...action,
                      state,
                      evidenceReceipt:
                        state === "COMPLETE" &&
                        action.evidenceReceipt === "PENDING"
                          ? `TA14-REMED-EVID-${Math.floor(
                              100000 + Math.random() * 900000,
                            )}`
                          : action.evidenceReceipt,
                    }
                  : action,
              ),
            }
          : item,
      ),
    );
  }

  function markReadyForRetest() {
    if (incompleteActions.length > 0) return;

    setRecords((items) =>
      items.map((item) =>
        item.caseId === selected.caseId
          ? {
              ...item,
              state: "READY_FOR_RETEST",
              remediationStatement:
                "All corrective actions are complete. Independent retest is now required before closure may be verified.",
              remediationDigest: makeDigest(
                JSON.stringify({
                  caseId: item.caseId,
                  auditId: item.auditId,
                  correctiveActions: item.correctiveActions,
                  retestRequirements: item.retestRequirements,
                  state: "READY_FOR_RETEST",
                }),
              ),
            }
          : item,
      ),
    );
  }

  function verifyResolved() {
    if (
      selected.state !== "READY_FOR_RETEST" ||
      incompleteActions.length > 0
    ) {
      return;
    }

    setRecords((items) =>
      items.map((item) =>
        item.caseId === selected.caseId
          ? {
              ...item,
              state: "VERIFIED_RESOLVED",
              completedAt: new Date().toISOString(),
              closureImpact:
                "The prior closure may now return to verified-closed status.",
              remediationStatement:
                "Corrective actions completed and independent retest passed. The nonconforming reliance path is verified resolved.",
              remediationDigest: makeDigest(
                JSON.stringify({
                  caseId: item.caseId,
                  auditId: item.auditId,
                  closureId: item.closureId,
                  correctiveActions: item.correctiveActions,
                  retestRequirements: item.retestRequirements,
                  result: "VERIFIED_RESOLVED",
                }),
              ),
            }
          : item,
      ),
    );
  }

  async function copyPackage() {
    await navigator.clipboard.writeText(
      JSON.stringify(remediationPackage, null, 2),
    );
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <main className="remediation-page">
      <style>{`
        * { box-sizing: border-box; }

        .remediation-page {
          min-height: calc(100vh - 68px);
          padding: 48px 0 110px;
          color: #edf6ff;
        }

        .remediation-wrap {
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
            radial-gradient(circle at 85% 7%, rgba(255, 200, 87, .16), transparent 28%),
            radial-gradient(circle at 14% 0%, rgba(72, 223, 255, .17), transparent 32%),
            linear-gradient(135deg, rgba(14, 30, 48, .97), rgba(5, 11, 20, .98));
          box-shadow: 0 38px 120px rgba(0,0,0,.35);
        }

        .hero::after {
          content: "REMEDIATE";
          position: absolute;
          right: -10px;
          bottom: -42px;
          color: rgba(255,255,255,.025);
          font-size: clamp(3.5rem, 8.5vw, 8rem);
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
          background: linear-gradient(100deg, #fff, #8ceaff 50%, #ffc857);
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

        .hero-actions, .detail-actions, .action-controls {
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
          background: linear-gradient(100deg, #56e6ff, #ffc857);
        }

        .button-secondary {
          min-height: 47px;
          padding: 0 19px;
          border: 1px solid rgba(136, 180, 219, .22);
          color: #dce9f5;
          background: rgba(7, 17, 29, .72);
        }

        .small-button {
          min-height: 36px;
          padding: 0 12px;
          border: 1px solid rgba(136, 180, 219, .2);
          color: #dce9f5;
          background: rgba(7, 17, 29, .75);
          font-size: .7rem;
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
          grid-template-columns: minmax(220px, 1fr) 240px 200px;
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

        .case-row {
          width: 100%;
          padding: 20px 21px;
          border: 0;
          border-bottom: 1px solid rgba(132, 177, 216, .1);
          color: inherit;
          background: transparent;
          text-align: left;
          cursor: pointer;
        }

        .case-row:last-child { border-bottom: 0; }

        .case-row.active {
          background: linear-gradient(90deg, rgba(84, 232, 255, .09), rgba(255, 200, 87, .025));
          box-shadow: inset 3px 0 0 #56e6ff;
        }

        .row-top, .meta, .detail-top {
          display: flex;
          align-items: center;
          gap: 9px;
          flex-wrap: wrap;
        }

        .row-top { justify-content: space-between; }

        .case-title { font-weight: 900; }

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

        .pill.VERIFIED_RESOLVED, .pill.COMPLETE, .pill.LOW {
          color: #54efae;
          border-color: rgba(84, 239, 174, .3);
        }

        .pill.OPEN, .pill.PLANNED, .pill.IN_PROGRESS, .pill.READY_FOR_RETEST,
        .pill.NOT_STARTED, .pill.MODERATE, .pill.WAIVED {
          color: #ffd27b;
          border-color: rgba(255, 210, 123, .3);
        }

        .pill.REJECTED, .pill.BLOCKED, .pill.HIGH, .pill.CRITICAL {
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

        .box, .action {
          margin-top: 17px;
          padding: 16px;
          border: 1px solid rgba(132, 177, 216, .12);
          border-radius: 17px;
          background: rgba(2, 9, 16, .52);
        }

        .box strong, .action strong {
          display: block;
          color: #dce8f3;
          font-size: .76rem;
          letter-spacing: .07em;
          text-transform: uppercase;
        }

        .box p, .action p {
          margin: 10px 0 0;
          font-size: .8rem;
        }

        .box ul {
          margin: 10px 0 0;
          padding-left: 18px;
          color: #9fb1c1;
          line-height: 1.65;
        }

        .action-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
        }

        .action-controls {
          margin-top: 12px;
        }

        .notice {
          margin-top: 18px;
          padding: 16px 18px;
          border-left: 3px solid #ffc857;
          border-radius: 0 13px 13px 0;
          color: #91a8bd;
          background: rgba(255, 200, 87, .045);
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
          .remediation-wrap { width: min(100% - 24px, 1420px); }
          .remediation-page { padding-top: 24px; }
          .hero { padding: 28px 22px 34px; border-radius: 24px; }
          .toolbar { grid-template-columns: 1fr; }
          .metrics { grid-template-columns: 1fr 1fr; }
          .kv { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="remediation-wrap">
        <section className="hero">
          <div className="hero-content">
            <p className="eyebrow">
              TA-14 Exchange · Closure Audit Remediation
            </p>
            <h1>
              A failed closure audit
              <br />
              <span className="gradient">must produce correction.</span>
            </h1>
            <p className="hero-copy">
              Bind every post-closure failure to root cause, containment,
              corrective ownership, evidence receipts, retest requirements,
              residual risk, and a preserved resolution decision. No failed
              reliance path disappears behind a revised status label.
            </p>

            <div className="hero-actions">
              <Link
                className="button"
                href="/workspace/records/disposition/finality/certificates/reliance/closure/audit"
              >
                Open Closure Audit
              </Link>
              <Link
                className="button-secondary"
                href="/workspace/records/disposition/finality/certificates/reliance/closure"
              >
                Open Reliance Closure
              </Link>
              <Link
                className="button-secondary"
                href="/workspace/records/disposition/finality/certificates/reliance/monitoring"
              >
                Open Reliance Monitoring
              </Link>
            </div>
          </div>
        </section>

        <section className="metrics">
          <article className="metric">
            <strong>{metrics.open}</strong>
            <span>Open</span>
          </article>
          <article className="metric">
            <strong>{metrics.active}</strong>
            <span>Active remediation</span>
          </article>
          <article className="metric">
            <strong>{metrics.resolved}</strong>
            <span>Verified resolved</span>
          </article>
          <article className="metric">
            <strong>{metrics.blocked}</strong>
            <span>Blocked actions</span>
          </article>
        </section>

        <section className="toolbar">
          <input
            aria-label="Search remediation cases"
            placeholder="Search case, audit, closure, receipt, party, root cause, action, risk, or statement"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />

          <select
            aria-label="Filter remediation state"
            value={stateFilter}
            onChange={(event) =>
              setStateFilter(event.target.value as RemediationState | "ALL")
            }
          >
            <option value="ALL">All states</option>
            <option value="OPEN">OPEN</option>
            <option value="PLANNED">PLANNED</option>
            <option value="IN_PROGRESS">IN_PROGRESS</option>
            <option value="READY_FOR_RETEST">READY_FOR_RETEST</option>
            <option value="VERIFIED_RESOLVED">VERIFIED_RESOLVED</option>
            <option value="REJECTED">REJECTED</option>
            <option value="WAIVED">WAIVED</option>
          </select>

          <select
            aria-label="Filter severity"
            value={severityFilter}
            onChange={(event) =>
              setSeverityFilter(event.target.value as Severity | "ALL")
            }
          >
            <option value="ALL">All severities</option>
            <option value="LOW">LOW</option>
            <option value="MODERATE">MODERATE</option>
            <option value="HIGH">HIGH</option>
            <option value="CRITICAL">CRITICAL</option>
          </select>
        </section>

        <section className="grid">
          <div className="panel">
            <div className="panel-head">
              <strong>Remediation cases</strong>
              <span>{filtered.length} visible</span>
            </div>

            {filtered.length ? (
              filtered.map((record) => (
                <button
                  className={`case-row ${
                    selected.caseId === record.caseId ? "active" : ""
                  }`}
                  key={record.caseId}
                  type="button"
                  onClick={() => setSelectedId(record.caseId)}
                >
                  <div className="row-top">
                    <span className="case-title">{record.recordTitle}</span>
                    <span className={`pill ${record.state}`}>{record.state}</span>
                  </div>
                  <div className="mono">{record.caseId}</div>
                  <div className="meta">
                    <span>{record.severity}</span>
                    <span>{record.relyingParty}</span>
                    <span>{record.auditId}</span>
                    <span>{formatDate(record.targetCompletionAt)}</span>
                  </div>
                </button>
              ))
            ) : (
              <div className="empty">
                No remediation case matches the current filters.
              </div>
            )}
          </div>

          <aside className="panel detail">
            <div className="detail-top">
              <span className={`pill ${selected.state}`}>{selected.state}</span>
              <span className={`pill ${selected.severity}`}>
                {selected.severity}
              </span>
              <span className="pill">{selected.intendedUse}</span>
            </div>

            <h2>{selected.recordTitle}</h2>
            <div className="mono">{selected.caseId}</div>

            <div className="result-banner">
              <h3>{selected.relyingParty}</h3>
              <p>{selected.remediationStatement}</p>
            </div>

            <dl className="kv">
              <dt>Audit ID</dt>
              <dd>{selected.auditId}</dd>

              <dt>Closure ID</dt>
              <dd>{selected.closureId}</dd>

              <dt>Reliance receipt</dt>
              <dd>{selected.relianceReceiptId}</dd>

              <dt>Certificate ID</dt>
              <dd>{selected.certificateId}</dd>

              <dt>Verification ID</dt>
              <dd>{selected.verificationId}</dd>

              <dt>Record ID</dt>
              <dd>{selected.recordId}</dd>

              <dt>Opened by</dt>
              <dd>{selected.openedBy}</dd>

              <dt>Opened</dt>
              <dd>{formatDate(selected.openedAt)}</dd>

              <dt>Target completion</dt>
              <dd>{formatDate(selected.targetCompletionAt)}</dd>

              <dt>Completed</dt>
              <dd>{formatDate(selected.completedAt)}</dd>

              <dt>Remediation receipt</dt>
              <dd>{selected.remediationReceiptId}</dd>

              <dt>Remediation digest</dt>
              <dd>{selected.remediationDigest}</dd>
            </dl>

            <div className="box">
              <strong>Root cause</strong>
              <p>{selected.rootCause}</p>
            </div>

            <div className="box">
              <strong>Nonconforming use</strong>
              <ul>
                {selected.nonconformingUse.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="box">
              <strong>Containment actions</strong>
              <ul>
                {selected.containmentActions.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            {selected.correctiveActions.map((action) => (
              <div className="action" key={action.actionId}>
                <div className="action-head">
                  <strong>
                    {action.actionId} · {action.owner}
                  </strong>
                  <span className={`pill ${action.state}`}>{action.state}</span>
                </div>
                <p>{action.description}</p>
                <p>
                  Due {formatDate(action.dueAt)} · Evidence{" "}
                  {action.evidenceReceipt}
                </p>
                <div className="action-controls">
                  <button
                    className="small-button"
                    type="button"
                    onClick={() => updateAction(action.actionId, "IN_PROGRESS")}
                  >
                    Start
                  </button>
                  <button
                    className="small-button"
                    type="button"
                    onClick={() => updateAction(action.actionId, "COMPLETE")}
                  >
                    Complete
                  </button>
                  <button
                    className="small-button"
                    type="button"
                    onClick={() => updateAction(action.actionId, "BLOCKED")}
                  >
                    Block
                  </button>
                </div>
              </div>
            ))}

            <div className="box">
              <strong>Retest requirements</strong>
              <ul>
                {selected.retestRequirements.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="box">
              <strong>Residual risk</strong>
              <ul>
                {selected.residualRisk.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="box">
              <strong>Closure impact</strong>
              <p>{selected.closureImpact}</p>
            </div>

            <div className="detail-actions">
              <button
                className="button"
                type="button"
                onClick={markReadyForRetest}
                disabled={incompleteActions.length > 0}
              >
                Mark ready for retest
              </button>

              <button
                className="small-button"
                type="button"
                onClick={verifyResolved}
                disabled={
                  selected.state !== "READY_FOR_RETEST" ||
                  incompleteActions.length > 0
                }
              >
                Verify resolved
              </button>

              <button
                className="small-button"
                type="button"
                onClick={() =>
                  setRecords((items) =>
                    items.map((item) =>
                      item.caseId === selected.caseId
                        ? {
                            ...item,
                            state: "REJECTED",
                            remediationStatement:
                              "The proposed remediation was rejected. The closure remains unverified.",
                          }
                        : item,
                    ),
                  )
                }
              >
                Reject remediation
              </button>

              <button
                className="small-button"
                type="button"
                onClick={copyPackage}
              >
                {copied ? "Copied" : "Copy remediation package"}
              </button>

              <button
                className="small-button"
                type="button"
                onClick={() =>
                  downloadJson(
                    `${selected.caseId.toLowerCase()}-audit-remediation.json`,
                    remediationPackage,
                  )
                }
              >
                Download package
              </button>
            </div>

            <div className="notice">
              Remediation may correct the failed path, but it may not rewrite the
              failed audit. The original closure claim, audit result,
              nonconforming use, containment, corrective actions, and retest
              outcome remain preserved as one continuous lineage.
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
