"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type ActivationState =
  | "DRAFT"
  | "PENDING_VERIFICATION"
  | "READY"
  | "ACTIVATED"
  | "HELD"
  | "DENIED"
  | "EXPIRED"
  | "REVOKED"
  | "COMPLETED";

type RouteDecision = "ALLOW" | "HOLD" | "DENY" | "ESCALATE";

type CheckState = "PASS" | "FAIL" | "UNKNOWN";

type RelianceActivation = {
  activationId: string;
  reauthorizationVerificationId: string;
  reauthorizationId: string;
  newRelianceReceiptId: string;
  restorationVerificationId: string;
  certificateVerificationId: string;
  certificateId: string;
  closureId: string;
  recordId: string;
  recordTitle: string;
  relyingParty: string;
  intendedUse: string;
  authorityRole: string;
  state: ActivationState;
  routeDecision: RouteDecision;
  requestedBy: string;
  requestedAt: string;
  activatedAt: string;
  completedAt: string;
  expiresAt: string;
  executionRouteId: string;
  actionDescription: string;
  consequenceClass: string;
  targetSystem: string;
  targetResource: string;
  checks: {
    label: string;
    state: CheckState;
    evidence: string;
  }[];
  bindings: string[];
  conditions: string[];
  prohibitedActions: string[];
  evidenceReceipts: string[];
  activationStatement: string;
  activationReceiptId: string;
  activationDigest: string;
};

const initialActivations: RelianceActivation[] = [
  {
    activationId: "TA14-FCRRA-000001",
    reauthorizationVerificationId: "TA14-FCRRV-000001",
    reauthorizationId: "TA14-FCRR-000001",
    newRelianceReceiptId: "TA14-FCR-000021",
    restorationVerificationId: "TA14-FCRCARRSV-000001",
    certificateVerificationId: "TA14-FCV-000019",
    certificateId: "TA14-FCERT-000014",
    closureId: "TA14-FCRC-000003",
    recordId: "TA14-AR-2026-000119",
    recordTitle: "Legacy Disclosure Approval",
    relyingParty: "External Communications Review",
    intendedUse: "PUBLIC_DISCLOSURE",
    authorityRole: "Publication Governance Authority",
    state: "ACTIVATED",
    routeDecision: "ALLOW",
    requestedBy: "External Communications Review",
    requestedAt: "2026-07-31T14:02:00.000Z",
    activatedAt: "2026-07-31T14:10:00.000Z",
    completedAt: "NONE",
    expiresAt: "2026-07-31T16:10:00.000Z",
    executionRouteId: "TA14-ROUTE-PUB-000021",
    actionDescription:
      "Release the approved disclosure package to the governed publication endpoint.",
    consequenceClass: "PUBLIC_EXTERNAL_EFFECT",
    targetSystem: "TA-14 Governed Publication Gateway",
    targetResource: "Approved Disclosure Package ADP-2026-071",
    checks: [
      {
        label: "Reauthorization verification is valid",
        state: "PASS",
        evidence: "TA14-FCRRV-000001 state VALID",
      },
      {
        label: "New reliance receipt is active",
        state: "PASS",
        evidence: "TA14-FCR-000021 active and unexpired",
      },
      {
        label: "Certificate verification is current",
        state: "PASS",
        evidence: "TA14-FCV-000019 state VALID",
      },
      {
        label: "Party matches authorized relying party",
        state: "PASS",
        evidence: "External Communications Review",
      },
      {
        label: "Purpose matches authorized intended use",
        state: "PASS",
        evidence: "PUBLIC_DISCLOSURE",
      },
      {
        label: "Target action is within approved scope",
        state: "PASS",
        evidence: "One governed publication decision",
      },
      {
        label: "Activation window is open",
        state: "PASS",
        evidence: "Two-hour execution window",
      },
    ],
    bindings: [
      "Bind execution to TA14-FCR-000021.",
      "Bind output to TA14-FCERT-000014.",
      "Bind action to TA14-ROUTE-PUB-000021.",
      "Bind actor to External Communications Review.",
      "Bind target to Approved Disclosure Package ADP-2026-071.",
    ],
    conditions: [
      "No content substitution after activation.",
      "Preserve the publication response and timestamp.",
      "Close the activation after the publication consequence is observed.",
    ],
    prohibitedActions: [
      "Publishing a different disclosure package.",
      "Reusing the activation for another publication.",
      "Transferring the activation to another party.",
      "Executing after activation expiry.",
    ],
    evidenceReceipts: [
      "TA14-FCRRV-RCPT-000001",
      "TA14-FCR-000021",
      "TA14-FCV-RCPT-000019",
    ],
    activationStatement:
      "The authorized reliance route is activated for one bounded publication action within the stated execution window.",
    activationReceiptId: "TA14-FCRRA-RCPT-000001",
    activationDigest:
      "sha256:9b63a281d81b5d4d480eeea97188ca044a432b0939aa9ee8bdbf67938f022f57",
  },
  {
    activationId: "TA14-FCRRA-000002",
    reauthorizationVerificationId: "TA14-FCRRV-000002",
    reauthorizationId: "TA14-FCRR-000002",
    newRelianceReceiptId: "PENDING",
    restorationVerificationId: "TA14-FCRCARRSV-000002",
    certificateVerificationId: "TA14-FCV-000013",
    certificateId: "TA14-FCERT-000010",
    closureId: "TA14-FCRC-000006",
    recordId: "TA14-AR-2026-000148",
    recordTitle: "Temporary Training Demonstration Record",
    relyingParty: "Training Governance Team",
    intendedUse: "INTERNAL_REVIEW",
    authorityRole: "Training Review Authority",
    state: "DENIED",
    routeDecision: "DENY",
    requestedBy: "Training Governance Team",
    requestedAt: "2026-08-20T20:34:00.000Z",
    activatedAt: "NONE",
    completedAt: "NONE",
    expiresAt: "NONE",
    executionRouteId: "TA14-ROUTE-TRN-000008",
    actionDescription:
      "Resume internal review activity using the previously expired training reliance route.",
    consequenceClass: "INTERNAL_GOVERNANCE_EFFECT",
    targetSystem: "TA-14 Training Review Workspace",
    targetResource: "Training Demonstration Record 000148",
    checks: [
      {
        label: "Reauthorization verification is valid",
        state: "FAIL",
        evidence: "TA14-FCRRV-000002 state INVALID",
      },
      {
        label: "New reliance receipt is active",
        state: "FAIL",
        evidence: "No new reliance receipt was issued",
      },
      {
        label: "Certificate verification is current",
        state: "PASS",
        evidence: "TA14-FCV-000013 state VALID",
      },
      {
        label: "Party matches requested relying party",
        state: "PASS",
        evidence: "Training Governance Team",
      },
      {
        label: "Purpose matches requested intended use",
        state: "PASS",
        evidence: "INTERNAL_REVIEW",
      },
      {
        label: "Activation window is open",
        state: "UNKNOWN",
        evidence: "No authorization window exists",
      },
    ],
    bindings: [
      "Requested route TA14-ROUTE-TRN-000008 preserved for denial review.",
    ],
    conditions: [
      "Obtain valid restoration verification.",
      "Obtain approved reauthorization.",
      "Issue a new reliance receipt.",
    ],
    prohibitedActions: [
      "Using the expired prior receipt.",
      "Beginning internal review before a new activation is issued.",
    ],
    evidenceReceipts: [
      "TA14-FCRRV-RCPT-000002",
      "TA14-FCV-RCPT-000013",
    ],
    activationStatement:
      "Activation is denied because the reauthorization verification is invalid and no new reliance receipt exists.",
    activationReceiptId: "TA14-FCRRA-RCPT-000002",
    activationDigest:
      "sha256:39132fd030dbf74b23d674ceef214204973a02fc1c20a04dfb5d92c3516a86ae",
  },
];

function formatDate(value: string) {
  if (value === "NONE" || value === "PENDING" || value === "UNKNOWN") {
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

export default function PostRestorationRelianceActivationPage() {
  const [records, setRecords] = useState(initialActivations);
  const [selectedId, setSelectedId] = useState(initialActivations[0].activationId);
  const [query, setQuery] = useState("");
  const [stateFilter, setStateFilter] = useState<ActivationState | "ALL">("ALL");
  const [decisionFilter, setDecisionFilter] = useState<RouteDecision | "ALL">("ALL");
  const [copied, setCopied] = useState(false);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return records.filter((record) => {
      const matchesQuery =
        !needle ||
        [
          record.activationId,
          record.reauthorizationVerificationId,
          record.reauthorizationId,
          record.newRelianceReceiptId,
          record.restorationVerificationId,
          record.certificateVerificationId,
          record.certificateId,
          record.closureId,
          record.recordId,
          record.recordTitle,
          record.relyingParty,
          record.intendedUse,
          record.authorityRole,
          record.state,
          record.routeDecision,
          record.executionRouteId,
          record.actionDescription,
          record.targetSystem,
          record.targetResource,
          record.activationStatement,
          ...record.bindings,
          ...record.conditions,
          ...record.prohibitedActions,
        ]
          .join(" ")
          .toLowerCase()
          .includes(needle);

      return (
        matchesQuery &&
        (stateFilter === "ALL" || record.state === stateFilter) &&
        (decisionFilter === "ALL" || record.routeDecision === decisionFilter)
      );
    });
  }, [decisionFilter, query, records, stateFilter]);

  const selected =
    records.find((record) => record.activationId === selectedId) ??
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
      activated: records.filter((item) => item.state === "ACTIVATED").length,
      held: records.filter((item) => item.state === "HELD").length,
      denied: records.filter((item) => item.state === "DENIED").length,
      completed: records.filter((item) => item.state === "COMPLETED").length,
    }),
    [records],
  );

  const activationPackage = {
    schema: "TA14_POST_RESTORATION_RELIANCE_ACTIVATION_RECEIPT_V1",
    generatedAt: new Date().toISOString(),
    activation: selected,
    evaluation: {
      passedChecks: selected.checks.filter((check) => check.state === "PASS")
        .length,
      failedChecks: failedChecks.length,
      unknownChecks: unknownChecks.length,
      routeAdmissible:
        failedChecks.length === 0 &&
        unknownChecks.length === 0 &&
        selected.routeDecision === "ALLOW",
      activationCurrent:
        selected.state === "ACTIVATED" &&
        selected.routeDecision === "ALLOW",
    },
    governance: {
      reauthorizationVerificationBound: true,
      newRelianceReceiptBound: true,
      certificateVerificationBound: true,
      restorationVerificationBound: true,
      actorBound: true,
      purposeBound: true,
      targetBound: true,
      executionRouteBound: true,
      activationWindowBound: true,
      prohibitedActionsBound: true,
      evidenceReceiptsPreserved: true,
    },
    limitation:
      "Activation authorizes only the single bound route, actor, purpose, target, and execution window identified in the receipt. It may not be reused, transferred, widened, or executed after expiration.",
  };

  function activateRoute() {
    if (
      failedChecks.length > 0 ||
      unknownChecks.length > 0 ||
      selected.routeDecision !== "ALLOW"
    ) {
      return;
    }

    const now = new Date();
    const expires = new Date(now.getTime() + 2 * 60 * 60 * 1000);

    setRecords((items) =>
      items.map((item) =>
        item.activationId === selected.activationId
          ? {
              ...item,
              state: "ACTIVATED",
              activatedAt: now.toISOString(),
              expiresAt: expires.toISOString(),
              activationStatement:
                "The authorized reliance route is activated for one bounded consequence-bearing action.",
              activationDigest: makeDigest(
                JSON.stringify({
                  activationId: item.activationId,
                  reauthorizationVerificationId:
                    item.reauthorizationVerificationId,
                  newRelianceReceiptId: item.newRelianceReceiptId,
                  executionRouteId: item.executionRouteId,
                  relyingParty: item.relyingParty,
                  intendedUse: item.intendedUse,
                  targetSystem: item.targetSystem,
                  targetResource: item.targetResource,
                  activatedAt: now.toISOString(),
                  expiresAt: expires.toISOString(),
                }),
              ),
            }
          : item,
      ),
    );
  }

  function completeRoute() {
    if (selected.state !== "ACTIVATED") return;

    const now = new Date().toISOString();

    setRecords((items) =>
      items.map((item) =>
        item.activationId === selected.activationId
          ? {
              ...item,
              state: "COMPLETED",
              completedAt: now,
              activationStatement:
                "The bounded reliance activation completed and is closed against further execution.",
            }
          : item,
      ),
    );
  }

  async function copyPackage() {
    await navigator.clipboard.writeText(
      JSON.stringify(activationPackage, null, 2),
    );
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <main className="activation-page">
      <style>{`
        * { box-sizing: border-box; }

        .activation-page {
          min-height: calc(100vh - 68px);
          padding: 48px 0 110px;
          color: #edf6ff;
        }

        .activation-wrap {
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
            radial-gradient(circle at 85% 7%, rgba(255, 208, 86, .16), transparent 28%),
            radial-gradient(circle at 14% 0%, rgba(88, 255, 179, .17), transparent 32%),
            linear-gradient(135deg, rgba(14, 30, 48, .97), rgba(5, 11, 20, .98));
          box-shadow: 0 38px 120px rgba(0,0,0,.35);
        }

        .hero::after {
          content: "ACTIVATE";
          position: absolute;
          right: -10px;
          bottom: -42px;
          color: rgba(255,255,255,.025);
          font-size: clamp(4rem, 9vw, 8.5rem);
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
          background: linear-gradient(100deg, #fff, #8ceaff 50%, #ffd056);
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
          background: linear-gradient(100deg, #58ffb3, #ffd056);
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
          grid-template-columns: minmax(220px, 1fr) 240px 220px;
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

        .activation-row {
          width: 100%;
          padding: 20px 21px;
          border: 0;
          border-bottom: 1px solid rgba(132, 177, 216, .1);
          color: inherit;
          background: transparent;
          text-align: left;
          cursor: pointer;
        }

        .activation-row:last-child { border-bottom: 0; }

        .activation-row.active {
          background: linear-gradient(90deg, rgba(88, 255, 179, .09), rgba(255, 208, 86, .025));
          box-shadow: inset 3px 0 0 #58ffb3;
        }

        .row-top, .meta, .detail-top {
          display: flex;
          align-items: center;
          gap: 9px;
          flex-wrap: wrap;
        }

        .row-top { justify-content: space-between; }

        .activation-title { font-weight: 900; }

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

        .pill.ACTIVATED, .pill.COMPLETED, .pill.ALLOW, .pill.PASS {
          color: #54efae;
          border-color: rgba(84, 239, 174, .3);
        }

        .pill.DRAFT, .pill.PENDING_VERIFICATION, .pill.READY,
        .pill.HELD, .pill.HOLD, .pill.ESCALATE, .pill.EXPIRED,
        .pill.UNKNOWN {
          color: #ffd27b;
          border-color: rgba(255, 210, 123, .3);
        }

        .pill.DENIED, .pill.REVOKED, .pill.DENY, .pill.FAIL {
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
          grid-template-columns: 230px 1fr;
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
          border-left: 3px solid #ffd056;
          border-radius: 0 13px 13px 0;
          color: #91a8bd;
          background: rgba(255, 208, 86, .045);
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
          .activation-wrap { width: min(100% - 24px, 1420px); }
          .activation-page { padding-top: 24px; }
          .hero { padding: 28px 22px 34px; border-radius: 24px; }
          .toolbar { grid-template-columns: 1fr; }
          .metrics { grid-template-columns: 1fr 1fr; }
          .kv { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="activation-wrap">
        <section className="hero">
          <div className="hero-content">
            <p className="eyebrow">
              TA-14 Exchange · Post-Restoration Reliance Activation
            </p>
            <h1>
              Authority is not execution.
              <br />
              <span className="gradient">Activate the exact route.</span>
            </h1>
            <p className="hero-copy">
              Convert verified post-restoration reliance authority into one
              bounded execution route by binding the actor, purpose, target,
              certificate, reliance receipt, consequence class, conditions,
              prohibited actions, and activation window before consequence can
              occur.
            </p>

            <div className="hero-actions">
              <Link
                className="button"
                href="/workspace/records/disposition/finality/certificates/reliance/closure/audit/remediation/retest/restoration/reauthorization/verify"
              >
                Verify Reauthorization
              </Link>
              <Link
                className="button-secondary"
                href="/workspace/records/disposition/finality/certificates/reliance/closure/audit/remediation/retest/restoration/reauthorization"
              >
                Open Reauthorization Desk
              </Link>
              <Link
                className="button-secondary"
                href="/workspace/records/disposition/finality/certificates/reliance"
              >
                Open Reliance Desk
              </Link>
            </div>
          </div>
        </section>

        <section className="metrics">
          <article className="metric">
            <strong>{metrics.activated}</strong>
            <span>Activated</span>
          </article>
          <article className="metric">
            <strong>{metrics.held}</strong>
            <span>Held</span>
          </article>
          <article className="metric">
            <strong>{metrics.denied}</strong>
            <span>Denied</span>
          </article>
          <article className="metric">
            <strong>{metrics.completed}</strong>
            <span>Completed</span>
          </article>
        </section>

        <section className="toolbar">
          <input
            aria-label="Search activation records"
            placeholder="Search activation, route, receipt, certificate, party, target, condition, or statement"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />

          <select
            aria-label="Filter activation state"
            value={stateFilter}
            onChange={(event) =>
              setStateFilter(event.target.value as ActivationState | "ALL")
            }
          >
            <option value="ALL">All states</option>
            <option value="DRAFT">DRAFT</option>
            <option value="PENDING_VERIFICATION">PENDING_VERIFICATION</option>
            <option value="READY">READY</option>
            <option value="ACTIVATED">ACTIVATED</option>
            <option value="HELD">HELD</option>
            <option value="DENIED">DENIED</option>
            <option value="EXPIRED">EXPIRED</option>
            <option value="REVOKED">REVOKED</option>
            <option value="COMPLETED">COMPLETED</option>
          </select>

          <select
            aria-label="Filter route decision"
            value={decisionFilter}
            onChange={(event) =>
              setDecisionFilter(event.target.value as RouteDecision | "ALL")
            }
          >
            <option value="ALL">All decisions</option>
            <option value="ALLOW">ALLOW</option>
            <option value="HOLD">HOLD</option>
            <option value="DENY">DENY</option>
            <option value="ESCALATE">ESCALATE</option>
          </select>
        </section>

        <section className="grid">
          <div className="panel">
            <div className="panel-head">
              <strong>Activation records</strong>
              <span>{filtered.length} visible</span>
            </div>

            {filtered.length ? (
              filtered.map((record) => (
                <button
                  className={`activation-row ${
                    selected.activationId === record.activationId
                      ? "active"
                      : ""
                  }`}
                  key={record.activationId}
                  type="button"
                  onClick={() => setSelectedId(record.activationId)}
                >
                  <div className="row-top">
                    <span className="activation-title">
                      {record.recordTitle}
                    </span>
                    <span className={`pill ${record.state}`}>
                      {record.state}
                    </span>
                  </div>
                  <div className="mono">{record.activationId}</div>
                  <div className="meta">
                    <span>{record.routeDecision}</span>
                    <span>{record.relyingParty}</span>
                    <span>{record.executionRouteId}</span>
                    <span>{formatDate(record.activatedAt)}</span>
                  </div>
                </button>
              ))
            ) : (
              <div className="empty">
                No activation record matches the current filters.
              </div>
            )}
          </div>

          <aside className="panel detail">
            <div className="detail-top">
              <span className={`pill ${selected.state}`}>{selected.state}</span>
              <span className={`pill ${selected.routeDecision}`}>
                {selected.routeDecision}
              </span>
              <span className="pill">{selected.intendedUse}</span>
            </div>

            <h2>{selected.recordTitle}</h2>
            <div className="mono">{selected.activationId}</div>

            <div className="result-banner">
              <h3>{selected.executionRouteId}</h3>
              <p>{selected.activationStatement}</p>
            </div>

            <dl className="kv">
              <dt>Reauthorization verification</dt>
              <dd>{selected.reauthorizationVerificationId}</dd>

              <dt>Reauthorization ID</dt>
              <dd>{selected.reauthorizationId}</dd>

              <dt>New reliance receipt</dt>
              <dd>{selected.newRelianceReceiptId}</dd>

              <dt>Restoration verification</dt>
              <dd>{selected.restorationVerificationId}</dd>

              <dt>Certificate verification</dt>
              <dd>{selected.certificateVerificationId}</dd>

              <dt>Certificate ID</dt>
              <dd>{selected.certificateId}</dd>

              <dt>Closure ID</dt>
              <dd>{selected.closureId}</dd>

              <dt>Record ID</dt>
              <dd>{selected.recordId}</dd>

              <dt>Relying party</dt>
              <dd>{selected.relyingParty}</dd>

              <dt>Authority role</dt>
              <dd>{selected.authorityRole}</dd>

              <dt>Consequence class</dt>
              <dd>{selected.consequenceClass}</dd>

              <dt>Target system</dt>
              <dd>{selected.targetSystem}</dd>

              <dt>Target resource</dt>
              <dd>{selected.targetResource}</dd>

              <dt>Requested</dt>
              <dd>{formatDate(selected.requestedAt)}</dd>

              <dt>Activated</dt>
              <dd>{formatDate(selected.activatedAt)}</dd>

              <dt>Completed</dt>
              <dd>{formatDate(selected.completedAt)}</dd>

              <dt>Expires</dt>
              <dd>{formatDate(selected.expiresAt)}</dd>

              <dt>Activation receipt</dt>
              <dd>{selected.activationReceiptId}</dd>

              <dt>Activation digest</dt>
              <dd>{selected.activationDigest}</dd>
            </dl>

            <div className="box">
              <strong>Action description</strong>
              <p>{selected.actionDescription}</p>
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

            <div className="box">
              <strong>Execution bindings</strong>
              <ul>
                {selected.bindings.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="box">
              <strong>Conditions</strong>
              <ul>
                {selected.conditions.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="box">
              <strong>Prohibited actions</strong>
              <ul>
                {selected.prohibitedActions.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="box">
              <strong>Evidence receipts</strong>
              <ul>
                {selected.evidenceReceipts.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="detail-actions">
              <button
                className="button"
                type="button"
                onClick={activateRoute}
                disabled={
                  failedChecks.length > 0 ||
                  unknownChecks.length > 0 ||
                  selected.routeDecision !== "ALLOW"
                }
              >
                Activate route
              </button>

              <button
                className="small-button"
                type="button"
                onClick={() =>
                  setRecords((items) =>
                    items.map((item) =>
                      item.activationId === selected.activationId
                        ? {
                            ...item,
                            state: "HELD",
                            routeDecision: "HOLD",
                            activationStatement:
                              "Activation is held pending renewed admissibility verification.",
                          }
                        : item,
                    ),
                  )
                }
              >
                Hold
              </button>

              <button
                className="small-button"
                type="button"
                onClick={() =>
                  setRecords((items) =>
                    items.map((item) =>
                      item.activationId === selected.activationId
                        ? {
                            ...item,
                            state: "DENIED",
                            routeDecision: "DENY",
                            activationStatement:
                              "Activation is denied and no consequence-bearing execution is permitted.",
                          }
                        : item,
                    ),
                  )
                }
              >
                Deny
              </button>

              <button
                className="small-button"
                type="button"
                onClick={completeRoute}
                disabled={selected.state !== "ACTIVATED"}
              >
                Complete and close
              </button>

              <button
                className="small-button"
                type="button"
                onClick={copyPackage}
              >
                {copied ? "Copied" : "Copy activation receipt"}
              </button>

              <button
                className="small-button"
                type="button"
                onClick={() =>
                  downloadJson(
                    `${selected.activationId.toLowerCase()}-reliance-activation.json`,
                    activationPackage,
                  )
                }
              >
                Download receipt
              </button>
            </div>

            <div className="notice">
              Verified reliance authority cannot execute by itself. Activation
              binds that authority to one route, actor, target, purpose,
              consequence class, and time window. Any deviation returns the
              route to HOLD or DENY.
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
