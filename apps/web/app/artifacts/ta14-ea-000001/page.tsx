"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type View = "inspection" | "chain" | "evidence" | "control" | "outcome" | "integrity" | "verify";
type VerificationState = "IDLE" | "RUNNING" | "VERIFIED";
type Determination = "ALLOW" | "HOLD" | "DENY" | "ESCALATE";
type GateResult = "PASS" | "FAIL" | "UNRESOLVED" | "NOT_APPLICABLE";

type ChainItem = {
  number: string;
  link: string;
  question: string;
  finding: string;
  proof: string;
  result: GateResult;
};

type EvidenceItem = {
  id: string;
  title: string;
  source: string;
  capturedAt: string;
  status: "ADMITTED" | "REJECTED" | "CONDITIONAL";
  disclosure: "PUBLIC" | "SELECTIVE" | "WITHHELD";
  hash: string;
  supports: string;
  limitation: string;
};

type VerificationCheck = {
  id: string;
  label: string;
  detail: string;
  level: number;
};

const ARTIFACT_ID = "TA14-EA-000001";
const ARTIFACT_TITLE = "Authorized Release With Verified Outcome";
const ROUTE_ID = "TA14-ROUTE-CANONICAL-ALLOW-001";
const ROUTE_VERSION = "1.0.0";
const RECORD_HASH = "sha256:6e6d18bd71f4a6b46f8507c167e3d752de8756fe95ed4b1d95ea0d3180f55bb8";
const PACKAGE_HASH = "sha256:48b4206b2c5c62161078ff7887b0e961fba1d55b8ed35a98670ce86104f451ad";
const RECEIPT_HASH = "sha256:11a6e9415506d3d6ff27df6756a50c52bb887c69cc4a16f7d11b52a0aee0ce7f";

const chain: ChainItem[] = [
  {
    number: "01",
    link: "Reality",
    question: "What condition existed before the route began?",
    finding: "One bounded execution request existed inside a controlled TA-14 demonstration environment.",
    proof: "Scenario declaration EA-000001-SC-01 identifies the action, consequence, target, scope, and simulation boundary.",
    result: "PASS",
  },
  {
    number: "02",
    link: "Record",
    question: "What attributable representation of that condition was preserved?",
    finding: "The proposed action, source declarations, route snapshot, and requested destination were recorded before evaluation.",
    proof: "Canonical input record EA-000001-RC-01 was sealed at 2026-07-31T19:00:00Z.",
    result: "PASS",
  },
  {
    number: "03",
    link: "Continuity",
    question: "Did identity, state, version, and custody remain connected?",
    finding: "No source, route, authority, model, tool, destination, or threshold changed between intake and commit.",
    proof: "Continuity ledger EA-000001-CT-01 reports CONTINUOUS across all mandatory dependencies.",
    result: "PASS",
  },
  {
    number: "04",
    link: "Admissibility",
    question: "Could the evidence and authority be relied upon for this exact consequence?",
    finding: "Every mandatory item was current, attributable, route-linked, and admitted for the declared demonstration purpose.",
    proof: "Admissibility record EA-000001-AD-01 contains six admitted items and zero unresolved mandatory items.",
    result: "PASS",
  },
  {
    number: "05",
    link: "Binding",
    question: "What rule and authority validly governed the consequence?",
    finding: "The route permitted one release to one reference adapter within the declared time and scope boundary.",
    proof: "Binding record EA-000001-BD-01 applies the TA-14 governing rule and route-specific release limits.",
    result: "PASS",
  },
  {
    number: "06",
    link: "Commit",
    question: "What determination was fixed before action?",
    finding: "ALLOW was committed before execution with an exact permitted next action and no broader delegation.",
    proof: "Commit record EA-000001-CM-01 was sealed at 2026-07-31T19:04:12Z.",
    result: "PASS",
  },
  {
    number: "07",
    link: "Execution",
    question: "Did the determination technically control the action path?",
    finding: "The reference adapter released only the committed action and rejected all fields outside the frozen request.",
    proof: "Execution receipt EA-000001-EX-01 records RELEASED, HTTP 202, scope parity, and zero bypass attempts.",
    result: "PASS",
  },
  {
    number: "08",
    link: "Outcome",
    question: "What bound to reality, and what did not?",
    finding: "The single authorized action completed; no additional action, destination, quantity, or privilege was released.",
    proof: "Outcome record EA-000001-OT-01 was independently checked against the execution receipt and target-state record.",
    result: "PASS",
  },
];

const evidence: EvidenceItem[] = [
  {
    id: "EA-000001-EV-01",
    title: "Proposed action declaration",
    source: "TA-14 Scenario Author",
    capturedAt: "2026-07-31 19:00:00 UTC",
    status: "ADMITTED",
    disclosure: "PUBLIC",
    hash: "9df0c1c8...37a4",
    supports: "Exact action, consequence, environment, destination, quantity, and declared limits.",
    limitation: "Demonstration declaration; it does not represent a production customer event.",
  },
  {
    id: "EA-000001-EV-02",
    title: "Frozen route snapshot",
    source: "TA-14 Route Resolver",
    capturedAt: "2026-07-31 19:00:08 UTC",
    status: "ADMITTED",
    disclosure: "PUBLIC",
    hash: "b22c95d0...a61f",
    supports: "Route identity, version, gate order, policy basis, thresholds, and revalidation triggers.",
    limitation: "Valid only for route version 1.0.0 and the declared institutional demonstration profile.",
  },
  {
    id: "EA-000001-EV-03",
    title: "Authority scope record",
    source: "TA-14 Authority Resolver",
    capturedAt: "2026-07-31 19:00:11 UTC",
    status: "ADMITTED",
    disclosure: "SELECTIVE",
    hash: "c1542c73...8e2b",
    supports: "Identity, role, delegation, valid time, scope, and absence of conflict or revocation.",
    limitation: "Authority is bounded to controlled demonstration artifacts and creates no external operational authority.",
  },
  {
    id: "EA-000001-EV-04",
    title: "Continuity and change ledger",
    source: "TA-14 Continuity Validator",
    capturedAt: "2026-07-31 19:03:54 UTC",
    status: "ADMITTED",
    disclosure: "PUBLIC",
    hash: "f7379d82...d731",
    supports: "Identity, evidence, route, model, tool, destination, threshold, and state continuity.",
    limitation: "Covers the preserved event window only.",
  },
  {
    id: "EA-000001-EV-05",
    title: "Execution adapter receipt",
    source: "TA-14 Reference Adapter",
    capturedAt: "2026-07-31 19:04:13 UTC",
    status: "ADMITTED",
    disclosure: "PUBLIC",
    hash: "11a6e941...ce7f",
    supports: "The committed ALLOW decision released exactly one bounded action.",
    limitation: "Proves control of the reference adapter, not every possible external system.",
  },
  {
    id: "EA-000001-EV-06",
    title: "Outcome closure record",
    source: "TA-14 Outcome Verifier",
    capturedAt: "2026-07-31 19:05:45 UTC",
    status: "ADMITTED",
    disclosure: "PUBLIC",
    hash: "4a97cc1e...f74d",
    supports: "The target reached the authorized state and no broader consequence occurred.",
    limitation: "Outcome verification is bounded to the observed target and event window.",
  },
];

const verificationChecks: VerificationCheck[] = [
  { id: "V1", label: "Package integrity", detail: "All exported components reproduce the published component hashes.", level: 1 },
  { id: "V2", label: "Signature validity", detail: "The integrity manifest validates against the declared TA-14 demonstration signing key.", level: 2 },
  { id: "V3", label: "Record parity", detail: "Inspection view, JSON, manifest, route snapshot, receipt, and outcome resolve to one frozen record.", level: 3 },
  { id: "V4", label: "Replay consistency", detail: "Disclosed inputs reproduce ALLOW under route version 1.0.0.", level: 4 },
  { id: "V5", label: "Execution effect", detail: "The adapter receipt proves RELEASED and confirms exact scope parity.", level: 5 },
  { id: "V6", label: "Outcome closure", detail: "The preserved target-state record supports the reported bounded outcome.", level: 6 },
];

const packageRecord = {
  schema: "ta14.execution-artifact.v2.1",
  engineVersion: "2.1.0",
  artifact: {
    artifactId: ARTIFACT_ID,
    title: ARTIFACT_TITLE,
    seriesId: "TA14-CANONICAL-FOUNDING",
    sequence: 1,
    classification: "CANONICAL EXECUTION PROOF",
    sector: "Cross-sector",
    publicationState: "PUBLISHED",
    determination: "ALLOW" as Determination,
    verificationLevel: 6,
    simulated: true,
  },
  scenario: {
    proposedAction: "Release one bounded reference execution after every mandatory condition survives review.",
    consequenceAtStake: "A consequential action may bind to the controlled target only within the exact authorized scope.",
    affectedSubjects: ["TA-14 demonstration environment", "designated reviewer", "reference execution target"],
    declaredLimits: [
      "No production customer system is affected.",
      "The record proves one bounded event only.",
      "The record does not certify every future route, adapter, or execution.",
    ],
  },
  route: {
    routeId: ROUTE_ID,
    routeVersion: ROUTE_VERSION,
    determination: "ALLOW",
    earliestFailure: null,
    permittedNextAction: "Release exactly one action to TA14-REFERENCE-ADAPTER within the committed request scope.",
  },
  execution: {
    adapterId: "TA14-REFERENCE-ADAPTER",
    effect: "RELEASED",
    receiptId: "EA-000001-EX-01",
    statusCode: 202,
    scopeParity: true,
    bypassAttempts: 0,
    receiptHash: RECEIPT_HASH,
  },
  outcome: {
    status: "CLOSED",
    actualResult: "One authorized action completed and no broader action was released.",
    residualRisk: "Demonstration evidence cannot establish production reliability outside this event.",
    independentlyChecked: true,
  },
  integrity: {
    canonicalRecordHash: RECORD_HASH,
    packageRootHash: PACKAGE_HASH,
    canonicalization: "ta14.c14n.v1",
    verifierVersion: "ta14.verifier.reference.v1",
  },
};

const css = `
  :root {
    --ea-bg: #050811;
    --ea-panel: rgba(13, 21, 37, .82);
    --ea-panel-strong: rgba(16, 27, 47, .96);
    --ea-line: rgba(130, 167, 207, .18);
    --ea-line-bright: rgba(113, 227, 193, .42);
    --ea-text: #eef6ff;
    --ea-muted: #96a9be;
    --ea-green: #71e3c1;
    --ea-blue: #74b8ff;
    --ea-gold: #ffc66d;
    --ea-red: #ff7f91;
    --ea-shadow: 0 28px 80px rgba(0, 0, 0, .38);
  }

  * { box-sizing: border-box; }
  html { scroll-behavior: smooth; }
  body { margin: 0; }
  button, input { font: inherit; }

  .ea-page {
    min-height: 100vh;
    color: var(--ea-text);
    background:
      radial-gradient(circle at 14% 3%, rgba(35, 119, 166, .22), transparent 34rem),
      radial-gradient(circle at 86% 12%, rgba(29, 126, 103, .18), transparent 30rem),
      linear-gradient(180deg, #07101d 0%, #050811 44%, #03050b 100%);
    position: relative;
    overflow: hidden;
  }

  .ea-page::before {
    content: "";
    position: fixed;
    inset: 0;
    pointer-events: none;
    opacity: .26;
    background-image:
      linear-gradient(rgba(126, 169, 210, .045) 1px, transparent 1px),
      linear-gradient(90deg, rgba(126, 169, 210, .045) 1px, transparent 1px);
    background-size: 36px 36px;
    mask-image: linear-gradient(to bottom, black, transparent 86%);
  }

  .ea-shell { width: min(1540px, calc(100% - 38px)); margin: 0 auto; padding: 22px 0 74px; position: relative; z-index: 1; }
  .ea-topbar { display: flex; align-items: center; justify-content: space-between; gap: 18px; min-height: 62px; padding: 10px 14px 10px 18px; border: 1px solid var(--ea-line); border-radius: 18px; background: rgba(7, 13, 24, .72); backdrop-filter: blur(18px); box-shadow: 0 18px 50px rgba(0,0,0,.26); position: sticky; top: 12px; z-index: 40; }
  .ea-brand { display: flex; align-items: center; gap: 13px; min-width: 0; }
  .ea-brandmark { width: 39px; height: 39px; border-radius: 12px; display: grid; place-items: center; color: #04110e; font-weight: 950; letter-spacing: -.04em; background: linear-gradient(145deg, #b9ffe9, #62dab8); box-shadow: 0 0 0 1px rgba(255,255,255,.26) inset, 0 11px 34px rgba(58,215,170,.22); }
  .ea-brandtext strong { display: block; font-size: 13px; letter-spacing: .12em; text-transform: uppercase; }
  .ea-brandtext span { display: block; margin-top: 2px; color: var(--ea-muted); font-size: 11px; letter-spacing: .08em; text-transform: uppercase; }
  .ea-toplinks { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; justify-content: flex-end; }
  .ea-toplink { color: #c8d8e8; text-decoration: none; font-size: 12px; font-weight: 800; padding: 9px 12px; border-radius: 10px; border: 1px solid transparent; }
  .ea-toplink:hover { color: white; border-color: var(--ea-line); background: rgba(255,255,255,.04); }
  .ea-toplink.primary { color: #03110e; background: linear-gradient(135deg, #a8f5dc, #67d8b7); }

  .ea-hero { margin-top: 22px; border: 1px solid rgba(123,171,214,.22); border-radius: 30px; overflow: hidden; background: linear-gradient(150deg, rgba(13,25,44,.98), rgba(7,12,22,.96)); box-shadow: var(--ea-shadow); position: relative; }
  .ea-hero::before { content: ""; position: absolute; width: 520px; height: 520px; border-radius: 50%; right: -210px; top: -280px; background: radial-gradient(circle, rgba(97,224,185,.25), transparent 68%); }
  .ea-hero::after { content: ""; position: absolute; inset: auto 0 0; height: 1px; background: linear-gradient(90deg, transparent, rgba(113,227,193,.7), transparent); }
  .ea-hero-grid { display: grid; grid-template-columns: minmax(0, 1.45fr) minmax(320px, .75fr); gap: 26px; padding: clamp(28px, 5vw, 70px); position: relative; z-index: 1; }
  .ea-kicker { display: inline-flex; align-items: center; gap: 9px; color: #b7cce1; font-size: 11px; font-weight: 900; letter-spacing: .16em; text-transform: uppercase; }
  .ea-kicker::before { content: ""; width: 34px; height: 1px; background: var(--ea-green); box-shadow: 0 0 16px var(--ea-green); }
  .ea-title { margin: 22px 0 12px; font-size: clamp(44px, 6.2vw, 94px); line-height: .91; letter-spacing: -.065em; max-width: 980px; }
  .ea-title span { display: block; color: var(--ea-green); font-size: .42em; letter-spacing: .1em; text-transform: uppercase; margin-bottom: 13px; }
  .ea-lead { max-width: 810px; margin: 20px 0 0; color: #b5c5d6; font-size: clamp(16px, 1.5vw, 21px); line-height: 1.65; }
  .ea-hero-actions { display: flex; flex-wrap: wrap; gap: 11px; margin-top: 30px; }
  .ea-button { appearance: none; border: 1px solid var(--ea-line); color: #dceaf7; background: rgba(255,255,255,.035); text-decoration: none; padding: 12px 16px; border-radius: 12px; font-weight: 900; font-size: 12px; letter-spacing: .04em; cursor: pointer; transition: transform .2s ease, border-color .2s ease, background .2s ease; }
  .ea-button:hover { transform: translateY(-2px); border-color: rgba(113,227,193,.48); background: rgba(113,227,193,.08); }
  .ea-button.primary { color: #03120e; border-color: transparent; background: linear-gradient(135deg, #b8f9e5, #62d6b5); box-shadow: 0 15px 36px rgba(69,216,172,.18); }

  .ea-decision { align-self: stretch; border: 1px solid rgba(113,227,193,.34); border-radius: 24px; background: linear-gradient(160deg, rgba(17,42,43,.84), rgba(8,15,25,.92)); padding: 24px; display: flex; flex-direction: column; justify-content: space-between; min-height: 355px; box-shadow: inset 0 1px rgba(255,255,255,.05), 0 22px 60px rgba(0,0,0,.28); position: relative; overflow: hidden; }
  .ea-decision::before { content: ""; position: absolute; inset: 0; background: linear-gradient(110deg, transparent 18%, rgba(255,255,255,.05) 48%, transparent 72%); transform: translateX(-100%); animation: scan 7s linear infinite; }
  @keyframes scan { to { transform: translateX(100%); } }
  .ea-decision-label { font-size: 10px; font-weight: 900; letter-spacing: .17em; text-transform: uppercase; color: #a8c2c0; }
  .ea-decision-word { margin: 18px 0 4px; font-size: clamp(58px, 7vw, 98px); font-weight: 950; letter-spacing: -.075em; color: #8ff1d2; text-shadow: 0 0 34px rgba(113,227,193,.28); }
  .ea-decision p { color: #bad0d1; line-height: 1.55; margin: 0; position: relative; }
  .ea-decision-meta { margin-top: 22px; display: grid; grid-template-columns: 1fr 1fr; gap: 9px; position: relative; }
  .ea-mini { border: 1px solid rgba(141,193,192,.16); border-radius: 12px; padding: 11px; background: rgba(1,8,12,.32); }
  .ea-mini span { display: block; color: #769493; font-size: 9px; font-weight: 900; letter-spacing: .13em; text-transform: uppercase; }
  .ea-mini strong { display: block; margin-top: 5px; font-size: 13px; }

  .ea-stats { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 10px; margin: 14px 0 0; }
  .ea-stat { border: 1px solid var(--ea-line); border-radius: 15px; padding: 15px; background: rgba(10,17,29,.78); box-shadow: inset 0 1px rgba(255,255,255,.03); }
  .ea-stat span { display: block; color: #74899f; font-size: 9px; letter-spacing: .13em; text-transform: uppercase; font-weight: 900; }
  .ea-stat strong { display: block; margin-top: 8px; font-size: 16px; }

  .ea-tabs { margin: 22px 0 0; display: flex; gap: 8px; overflow-x: auto; padding: 8px; border: 1px solid var(--ea-line); border-radius: 16px; background: rgba(8,14,25,.76); position: sticky; top: 88px; z-index: 30; backdrop-filter: blur(16px); }
  .ea-tab { flex: 0 0 auto; border: 1px solid transparent; background: transparent; color: #8ea3b8; padding: 10px 13px; border-radius: 10px; font-size: 11px; font-weight: 900; letter-spacing: .06em; text-transform: uppercase; cursor: pointer; }
  .ea-tab:hover { color: #d9e8f5; background: rgba(255,255,255,.035); }
  .ea-tab.active { color: #061511; border-color: rgba(113,227,193,.25); background: linear-gradient(135deg, #b6f6e2, #70dbbb); }

  .ea-workspace { margin-top: 14px; display: grid; grid-template-columns: minmax(0, 1fr) 330px; gap: 14px; align-items: start; }
  .ea-main { min-width: 0; }
  .ea-side { position: sticky; top: 156px; display: grid; gap: 12px; }
  .ea-panel { border: 1px solid var(--ea-line); border-radius: 20px; background: linear-gradient(150deg, rgba(13,22,38,.9), rgba(7,12,22,.9)); box-shadow: 0 20px 56px rgba(0,0,0,.25), inset 0 1px rgba(255,255,255,.035); overflow: hidden; }
  .ea-panel-head { padding: 20px 22px; border-bottom: 1px solid var(--ea-line); display: flex; align-items: flex-end; justify-content: space-between; gap: 16px; }
  .ea-panel-head h2, .ea-panel-head h3 { margin: 0; letter-spacing: -.025em; }
  .ea-panel-head p { margin: 7px 0 0; color: var(--ea-muted); line-height: 1.55; max-width: 820px; }
  .ea-panel-body { padding: 22px; }
  .ea-overline { color: var(--ea-green); font-size: 9px; font-weight: 950; letter-spacing: .16em; text-transform: uppercase; }

  .ea-summary-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
  .ea-card { border: 1px solid rgba(130,167,207,.16); border-radius: 16px; padding: 18px; background: rgba(255,255,255,.025); }
  .ea-card.wide { grid-column: 1 / -1; }
  .ea-card span { display: block; color: #7f93a8; font-size: 9px; font-weight: 900; text-transform: uppercase; letter-spacing: .13em; }
  .ea-card strong { display: block; margin-top: 7px; line-height: 1.4; }
  .ea-card p { color: #adbed0; line-height: 1.62; margin: 9px 0 0; }

  .ea-chain { display: grid; gap: 10px; }
  .ea-chain-item { display: grid; grid-template-columns: 64px 160px minmax(0, 1fr) 90px; gap: 15px; align-items: start; padding: 16px; border: 1px solid rgba(130,167,207,.15); border-radius: 16px; background: rgba(255,255,255,.024); transition: transform .2s ease, border-color .2s ease; }
  .ea-chain-item:hover { transform: translateX(3px); border-color: rgba(113,227,193,.35); }
  .ea-chain-no { font-size: 28px; font-weight: 950; letter-spacing: -.05em; color: #43647f; }
  .ea-chain-link strong { display: block; font-size: 16px; }
  .ea-chain-link span { display: block; margin-top: 5px; color: #71869b; font-size: 10px; text-transform: uppercase; letter-spacing: .1em; }
  .ea-chain-copy b { display: block; color: #dce9f5; }
  .ea-chain-copy p { margin: 6px 0; color: #aabccd; line-height: 1.55; }
  .ea-proof { color: #7890a6 !important; font-size: 12px; }
  .ea-pass { justify-self: end; color: #072017; background: #83e6c8; border-radius: 999px; padding: 7px 10px; font-size: 9px; font-weight: 950; letter-spacing: .1em; }

  .ea-evidence { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 12px; }
  .ea-evidence-card { border: 1px solid rgba(130,167,207,.16); border-radius: 17px; padding: 17px; background: rgba(255,255,255,.024); }
  .ea-evidence-top { display: flex; justify-content: space-between; gap: 12px; }
  .ea-evidence-id { color: var(--ea-green); font-size: 9px; font-weight: 950; letter-spacing: .12em; }
  .ea-badges { display: flex; gap: 5px; flex-wrap: wrap; justify-content: flex-end; }
  .ea-badge { border: 1px solid rgba(130,167,207,.2); padding: 5px 7px; border-radius: 999px; color: #96aabd; font-size: 8px; font-weight: 950; letter-spacing: .08em; }
  .ea-badge.good { color: #8ce9ce; border-color: rgba(113,227,193,.3); }
  .ea-evidence-card h3 { margin: 15px 0 5px; }
  .ea-evidence-card p { color: #a9bbcc; line-height: 1.55; font-size: 13px; }
  .ea-evidence-meta { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin: 14px 0; }
  .ea-evidence-meta div { border: 1px solid rgba(130,167,207,.11); padding: 9px; border-radius: 10px; }
  .ea-evidence-meta span { display: block; color: #6f8398; font-size: 8px; text-transform: uppercase; font-weight: 900; letter-spacing: .1em; }
  .ea-evidence-meta strong { display: block; margin-top: 4px; font-size: 11px; overflow-wrap: anywhere; }

  .ea-effect-stage { display: grid; grid-template-columns: 1fr 80px 1fr; gap: 20px; align-items: stretch; }
  .ea-effect-box { border: 1px solid rgba(130,167,207,.18); border-radius: 18px; padding: 22px; background: rgba(255,255,255,.025); }
  .ea-effect-box.success { border-color: rgba(113,227,193,.35); background: linear-gradient(145deg, rgba(41,113,94,.19), rgba(255,255,255,.02)); }
  .ea-effect-arrow { display: grid; place-items: center; color: var(--ea-green); font-size: 36px; }
  .ea-effect-box span { color: #71869a; font-size: 9px; font-weight: 950; letter-spacing: .13em; text-transform: uppercase; }
  .ea-effect-box h3 { margin: 11px 0; font-size: 25px; }
  .ea-effect-box p { color: #a9bccd; line-height: 1.62; }
  .ea-receipt { margin-top: 14px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
  .ea-receipt div { border: 1px solid rgba(130,167,207,.12); border-radius: 10px; padding: 10px; }
  .ea-receipt span { display: block; color: #71869b; font-size: 8px; letter-spacing: .1em; text-transform: uppercase; }
  .ea-receipt strong { display: block; margin-top: 5px; font-size: 11px; }

  .ea-timeline { position: relative; display: grid; gap: 14px; }
  .ea-timeline::before { content: ""; position: absolute; left: 19px; top: 9px; bottom: 9px; width: 1px; background: linear-gradient(var(--ea-green), rgba(116,184,255,.3)); }
  .ea-event { position: relative; padding-left: 52px; }
  .ea-event::before { content: ""; position: absolute; left: 13px; top: 6px; width: 13px; height: 13px; border-radius: 50%; background: #84e8ca; box-shadow: 0 0 0 5px rgba(113,227,193,.08), 0 0 22px rgba(113,227,193,.35); }
  .ea-event time { color: #71879d; font-size: 10px; font-weight: 900; letter-spacing: .09em; }
  .ea-event strong { display: block; margin-top: 4px; }
  .ea-event p { margin: 5px 0 0; color: #a7b8c8; line-height: 1.55; }

  .ea-integrity-grid { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 12px; }
  .ea-hash { border: 1px solid rgba(130,167,207,.15); border-radius: 15px; padding: 16px; background: rgba(0,0,0,.18); }
  .ea-hash span { display: block; color: #70859a; font-size: 9px; letter-spacing: .12em; text-transform: uppercase; font-weight: 900; }
  .ea-hash code { display: block; margin-top: 8px; color: #aeeed9; font-size: 11px; line-height: 1.5; overflow-wrap: anywhere; }

  .ea-verify-stage { border: 1px solid rgba(113,227,193,.28); border-radius: 22px; padding: 22px; background: linear-gradient(150deg, rgba(25,70,61,.2), rgba(6,12,21,.4)); }
  .ea-verify-head { display: flex; align-items: center; justify-content: space-between; gap: 20px; }
  .ea-verify-result { font-size: clamp(30px, 4vw, 56px); font-weight: 950; letter-spacing: -.05em; color: #8ce9cc; }
  .ea-progress { height: 8px; background: rgba(255,255,255,.06); border-radius: 999px; overflow: hidden; margin: 16px 0 20px; }
  .ea-progress i { display: block; height: 100%; background: linear-gradient(90deg, #6fd9b8, #8ef0d3); transition: width .5s ease; box-shadow: 0 0 18px rgba(113,227,193,.4); }
  .ea-checks { display: grid; gap: 9px; }
  .ea-check { display: grid; grid-template-columns: 44px minmax(0,1fr) auto; gap: 12px; align-items: center; border: 1px solid rgba(130,167,207,.14); border-radius: 13px; padding: 12px; background: rgba(255,255,255,.022); }
  .ea-check-no { width: 34px; height: 34px; display: grid; place-items: center; border-radius: 10px; color: #7ce1c3; background: rgba(113,227,193,.09); font-weight: 950; }
  .ea-check p { margin: 3px 0 0; color: #879daf; font-size: 12px; }
  .ea-check-state { color: #80e2c4; font-size: 9px; font-weight: 950; letter-spacing: .1em; }

  .ea-side-card { border: 1px solid var(--ea-line); border-radius: 17px; padding: 17px; background: rgba(10,17,29,.9); box-shadow: 0 18px 42px rgba(0,0,0,.23); }
  .ea-side-card h3 { margin: 0; }
  .ea-side-card p { color: #91a5b8; line-height: 1.55; font-size: 12px; }
  .ea-side-list { display: grid; gap: 8px; margin-top: 13px; }
  .ea-side-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; border-top: 1px solid rgba(130,167,207,.1); padding-top: 9px; color: #93a7ba; font-size: 11px; }
  .ea-side-row strong { color: #e3eef8; text-align: right; }
  .ea-downloads { display: grid; gap: 8px; }
  .ea-download { width: 100%; text-align: left; display: flex; align-items: center; justify-content: space-between; gap: 10px; border: 1px solid rgba(130,167,207,.16); border-radius: 11px; padding: 11px; color: #d7e5f2; background: rgba(255,255,255,.025); cursor: pointer; font-weight: 800; font-size: 11px; }
  .ea-download:hover { border-color: rgba(113,227,193,.38); background: rgba(113,227,193,.07); }
  .ea-download span { color: var(--ea-green); }

  .ea-boundary { border-color: rgba(255,198,109,.25); background: linear-gradient(145deg, rgba(95,67,26,.15), rgba(10,17,29,.9)); }
  .ea-boundary h3 { color: #ffd38f; }
  .ea-footer { margin-top: 24px; border-top: 1px solid var(--ea-line); padding: 26px 4px 0; display: flex; justify-content: space-between; gap: 18px; color: #73879b; font-size: 11px; }

  @media (max-width: 1120px) {
    .ea-hero-grid { grid-template-columns: 1fr; }
    .ea-decision { min-height: 290px; }
    .ea-stats { grid-template-columns: repeat(3,1fr); }
    .ea-workspace { grid-template-columns: 1fr; }
    .ea-side { position: static; grid-template-columns: repeat(2,minmax(0,1fr)); }
  }
  @media (max-width: 780px) {
    .ea-shell { width: min(100% - 22px, 1540px); }
    .ea-topbar { position: relative; top: 0; align-items: flex-start; }
    .ea-toplinks { display: none; }
    .ea-title { font-size: clamp(42px, 15vw, 70px); }
    .ea-stats { grid-template-columns: repeat(2,1fr); }
    .ea-tabs { top: 8px; }
    .ea-summary-grid, .ea-evidence, .ea-integrity-grid { grid-template-columns: 1fr; }
    .ea-chain-item { grid-template-columns: 48px 1fr 74px; }
    .ea-chain-copy { grid-column: 2 / -1; }
    .ea-effect-stage { grid-template-columns: 1fr; }
    .ea-effect-arrow { transform: rotate(90deg); }
    .ea-side { grid-template-columns: 1fr; }
    .ea-receipt { grid-template-columns: 1fr; }
    .ea-footer { flex-direction: column; }
  }
`;

function download(name: string, value: unknown) {
  const text = typeof value === "string" ? value : JSON.stringify(value, null, 2);
  const blob = new Blob([text], { type: name.endsWith(".json") ? "application/json" : "text/plain" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = name;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function Panel({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section className="ea-panel">
      <header className="ea-panel-head">
        <div>
          <div className="ea-overline">{ARTIFACT_ID}</div>
          <h2>{title}</h2>
          {subtitle ? <p>{subtitle}</p> : null}
        </div>
      </header>
      <div className="ea-panel-body">{children}</div>
    </section>
  );
}

export default function ExecutionArtifact000001Page() {
  const [view, setView] = useState<View>("inspection");
  const [verificationState, setVerificationState] = useState<VerificationState>("IDLE");
  const [verifiedCount, setVerifiedCount] = useState(0);

  const manifest = useMemo(
    () => ({
      artifactId: ARTIFACT_ID,
      generatedFrom: RECORD_HASH,
      packageRootHash: PACKAGE_HASH,
      canonicalizationVersion: "ta14.c14n.v1",
      verifierVersion: "ta14.verifier.reference.v1",
      components: [
        { name: "artifact.json", hash: "sha256:0e637ca8...61ea" },
        { name: "route-snapshot.json", hash: "sha256:b22c95d0...a61f" },
        { name: "evidence-manifest.json", hash: "sha256:150180bf...ea27" },
        { name: "execution-receipt.json", hash: RECEIPT_HASH },
        { name: "outcome-record.json", hash: "sha256:4a97cc1e...f74d" },
      ],
      signature: {
        method: "TA14-DEMONSTRATION-SIGNATURE-V1",
        keyReference: "ta14://keys/demonstration/2026-01",
        status: "VALID",
      },
    }),
    [],
  );

  function runVerification() {
    setVerificationState("RUNNING");
    setVerifiedCount(0);
    verificationChecks.forEach((_, index) => {
      window.setTimeout(() => {
        setVerifiedCount(index + 1);
        if (index === verificationChecks.length - 1) setVerificationState("VERIFIED");
      }, 420 * (index + 1));
    });
  }

  const verificationPercent = Math.round((verifiedCount / verificationChecks.length) * 100);

  return (
    <main className="ea-page">
      <style>{css}</style>
      <div className="ea-shell">
        <nav className="ea-topbar" aria-label="Execution artifact navigation">
          <div className="ea-brand">
            <div className="ea-brandmark">14</div>
            <div className="ea-brandtext">
              <strong>TA-14 Execution Artifacts</strong>
              <span>Eighth major door · Public proof environment</span>
            </div>
          </div>
          <div className="ea-toplinks">
            <Link className="ea-toplink" href="/artifacts">Artifact library</Link>
            <Link className="ea-toplink" href="/workspace/artifacts/build">Artifact Studio</Link>
            <Link className="ea-toplink" href="/workspace">Workspace</Link>
            <Link className="ea-toplink primary" href="/">Return to Exchange</Link>
          </div>
        </nav>

        <header className="ea-hero">
          <div className="ea-hero-grid">
            <div>
              <div className="ea-kicker">Canonical execution artifact 01 of 12</div>
              <h1 className="ea-title"><span>{ARTIFACT_ID}</span>{ARTIFACT_TITLE}</h1>
              <p className="ea-lead">
                This bounded demonstration record proves that an ALLOW determination was committed before action,
                technically enforced by the reference adapter, and closed with preserved outcome evidence.
              </p>
              <div className="ea-hero-actions">
                <button className="ea-button primary" onClick={() => setView("verify")}>Verify this artifact</button>
                <button className="ea-button" onClick={() => download(`${ARTIFACT_ID}.json`, packageRecord)}>Download canonical JSON</button>
                <button className="ea-button" onClick={() => download(`${ARTIFACT_ID}-integrity-manifest.json`, manifest)}>Download integrity manifest</button>
              </div>
            </div>
            <aside className="ea-decision" aria-label="Committed determination">
              <div>
                <div className="ea-decision-label">Committed determination</div>
                <div className="ea-decision-word">ALLOW</div>
                <p>Every mandatory condition survived evaluation. The exact bounded action was released—nothing broader.</p>
              </div>
              <div className="ea-decision-meta">
                <div className="ea-mini"><span>Earliest failure</span><strong>None</strong></div>
                <div className="ea-mini"><span>Execution effect</span><strong>RELEASED</strong></div>
                <div className="ea-mini"><span>Outcome state</span><strong>CLOSED</strong></div>
                <div className="ea-mini"><span>Verification</span><strong>LEVEL 6</strong></div>
              </div>
            </aside>
          </div>
        </header>

        <section className="ea-stats" aria-label="Artifact facts">
          <div className="ea-stat"><span>Publication state</span><strong>PUBLISHED</strong></div>
          <div className="ea-stat"><span>Route</span><strong>{ROUTE_ID}</strong></div>
          <div className="ea-stat"><span>Route version</span><strong>{ROUTE_VERSION}</strong></div>
          <div className="ea-stat"><span>Mandatory gates</span><strong>8 / 8 PASS</strong></div>
          <div className="ea-stat"><span>Evidence</span><strong>6 ADMITTED</strong></div>
          <div className="ea-stat"><span>Record class</span><strong>DEMONSTRATION</strong></div>
        </section>

        <div className="ea-tabs" role="tablist" aria-label="Artifact views">
          {([
            ["inspection", "60-second inspection"], ["chain", "Execution chain"], ["evidence", "Evidence manifest"],
            ["control", "Control effect"], ["outcome", "Outcome closure"], ["integrity", "Integrity package"], ["verify", "Verification center"],
          ] as [View, string][]).map(([key, label]) => (
            <button key={key} className={`ea-tab ${view === key ? "active" : ""}`} onClick={() => setView(key)}>{label}</button>
          ))}
        </div>

        <div className="ea-workspace">
          <div className="ea-main">
            {view === "inspection" ? (
              <Panel title="Sixty-second inspection" subtitle="The minimum public path for determining what was proposed, what governed it, what happened, and what this record does not prove.">
                <div className="ea-summary-grid">
                  <div className="ea-card"><span>What was proposed?</span><strong>Release one bounded reference execution.</strong><p>The request specified the target, tool, destination, quantity, model, time window, and demonstration boundary before evaluation.</p></div>
                  <div className="ea-card"><span>What was at risk?</span><strong>An execution could bind outside its admitted scope.</strong><p>The route had to prove that no unresolved condition, authority gap, continuity break, or boundary mismatch remained.</p></div>
                  <div className="ea-card"><span>What governed it?</span><strong>{ROUTE_ID} · version {ROUTE_VERSION}</strong><p>No admissible evidence. No admissible execution. Commit before action. Fail closed on unresolved mandatory conditions.</p></div>
                  <div className="ea-card"><span>What determination occurred?</span><strong>ALLOW</strong><p>All mandatory gates passed. No earliest failure existed. The committed next action was limited to one exact release.</p></div>
                  <div className="ea-card"><span>Did governance control execution?</span><strong>Yes—receipt EA-000001-EX-01 records RELEASED.</strong><p>The adapter accepted the committed fields, rejected broader fields, and reported scope parity with zero bypass attempts.</p></div>
                  <div className="ea-card"><span>What outcome followed?</span><strong>The single action completed and the target state was preserved.</strong><p>No additional action, destination, quantity, or privilege was released.</p></div>
                  <div className="ea-card wide"><span>What does this prove?</span><strong>For this bounded demonstration event, admissible evidence and valid authority survived the complete route; the committed ALLOW determination controlled the reference adapter; and outcome evidence closed the event.</strong></div>
                  <div className="ea-card wide"><span>What does this not prove?</span><strong>It does not establish production reliability, universal legal compliance, performance of every adapter, validity of undisclosed external evidence, or the behavior of any future route or event.</strong></div>
                </div>
              </Panel>
            ) : null}

            {view === "chain" ? (
              <Panel title="Complete governing chain" subtitle="Every public anchor is preserved. A complete record may report no failure, but it may not silently omit the links that earned release.">
                <div className="ea-chain">
                  {chain.map((item) => (
                    <article className="ea-chain-item" key={item.number}>
                      <div className="ea-chain-no">{item.number}</div>
                      <div className="ea-chain-link"><strong>{item.link}</strong><span>{item.question}</span></div>
                      <div className="ea-chain-copy"><b>{item.finding}</b><p className="ea-proof">{item.proof}</p></div>
                      <div className="ea-pass">{item.result}</div>
                    </article>
                  ))}
                </div>
              </Panel>
            ) : null}

            {view === "evidence" ? (
              <Panel title="Evidence manifest" subtitle="The public manifest discloses source identity, capture time, status, commitments, support, and limitations without claiming more than the record can establish.">
                <div className="ea-evidence">
                  {evidence.map((item) => (
                    <article className="ea-evidence-card" key={item.id}>
                      <div className="ea-evidence-top"><div className="ea-evidence-id">{item.id}</div><div className="ea-badges"><span className="ea-badge good">{item.status}</span><span className="ea-badge">{item.disclosure}</span></div></div>
                      <h3>{item.title}</h3>
                      <p>{item.supports}</p>
                      <div className="ea-evidence-meta"><div><span>Source</span><strong>{item.source}</strong></div><div><span>Captured</span><strong>{item.capturedAt}</strong></div><div><span>Hash</span><strong>{item.hash}</strong></div><div><span>Route linked</span><strong>YES</strong></div></div>
                      <p><strong>Limitation:</strong> {item.limitation}</p>
                    </article>
                  ))}
                </div>
              </Panel>
            ) : null}

            {view === "control" ? (
              <Panel title="Proof of control" subtitle="An execution-governance claim requires a recorded technical effect—not monitoring, recommendation, or a policy statement after the fact.">
                <div className="ea-effect-stage">
                  <div className="ea-effect-box"><span>Committed request</span><h3>One bounded action</h3><p>Target: TA-14 reference execution adapter. Quantity: one. Destination, model, tool, and event window frozen before release.</p></div>
                  <div className="ea-effect-arrow">→</div>
                  <div className="ea-effect-box success"><span>Technical effect</span><h3>RELEASED</h3><p>The adapter accepted only the committed action. The receipt confirms exact field parity and no additional privilege.</p><div className="ea-receipt"><div><span>Status</span><strong>HTTP 202</strong></div><div><span>Receipt</span><strong>EA-000001-EX-01</strong></div><div><span>Bypass</span><strong>0 ATTEMPTS</strong></div></div></div>
                </div>
              </Panel>
            ) : null}

            {view === "outcome" ? (
              <Panel title="Outcome closure" subtitle="Completion is not presumed from a successful technical response. The resulting state and residual boundary were observed and preserved.">
                <div className="ea-timeline">
                  <article className="ea-event"><time>19:00:00 UTC</time><strong>Scenario intake sealed</strong><p>The exact proposed action, consequence, target, and limits entered the frozen record.</p></article>
                  <article className="ea-event"><time>19:03:54 UTC</time><strong>Pre-execution continuity revalidated</strong><p>No material evidence, authority, route, destination, model, tool, or threshold changed.</p></article>
                  <article className="ea-event"><time>19:04:12 UTC</time><strong>ALLOW committed</strong><p>The permitted next action was fixed before the adapter was invoked.</p></article>
                  <article className="ea-event"><time>19:04:13 UTC</time><strong>Execution released</strong><p>Receipt EA-000001-EX-01 recorded exact scope parity and status 202.</p></article>
                  <article className="ea-event"><time>19:05:45 UTC</time><strong>Outcome closed</strong><p>The authorized state was observed. No broader consequence, additional action, or uncommitted destination was found.</p></article>
                  <article className="ea-event"><time>19:07:10 UTC</time><strong>Package parity verified</strong><p>The public page, canonical JSON, route snapshot, evidence manifest, receipt, and outcome record resolved to one root.</p></article>
                </div>
              </Panel>
            ) : null}

            {view === "integrity" ? (
              <Panel title="Integrity package" subtitle="The frozen record is represented by component hashes, a canonical record hash, a package-root hash, a declared signature method, and versioned verification instructions.">
                <div className="ea-integrity-grid">
                  <div className="ea-hash"><span>Canonical record hash</span><code>{RECORD_HASH}</code></div>
                  <div className="ea-hash"><span>Package root hash</span><code>{PACKAGE_HASH}</code></div>
                  <div className="ea-hash"><span>Execution receipt hash</span><code>{RECEIPT_HASH}</code></div>
                  <div className="ea-hash"><span>Canonicalization</span><code>ta14.c14n.v1</code></div>
                  <div className="ea-hash"><span>Verifier version</span><code>ta14.verifier.reference.v1</code></div>
                  <div className="ea-hash"><span>Signing key reference</span><code>ta14://keys/demonstration/2026-01</code></div>
                </div>
              </Panel>
            ) : null}

            {view === "verify" ? (
              <Panel title="Verification center" subtitle="Run the bounded reference verification sequence. This page simulates the disclosed verification path and exposes the expected result for each level.">
                <div className="ea-verify-stage">
                  <div className="ea-verify-head"><div><div className="ea-overline">Reference verifier</div><div className="ea-verify-result">{verificationState === "VERIFIED" ? "VERIFIED" : verificationState === "RUNNING" ? "VERIFYING" : "READY"}</div></div><button className="ea-button primary" onClick={runVerification} disabled={verificationState === "RUNNING"}>{verificationState === "RUNNING" ? "Verification running" : "Run verification"}</button></div>
                  <div className="ea-progress"><i style={{ width: `${verificationPercent}%` }} /></div>
                  <div className="ea-checks">
                    {verificationChecks.map((check, index) => (
                      <div className="ea-check" key={check.id}><div className="ea-check-no">L{check.level}</div><div><strong>{check.label}</strong><p>{check.detail}</p></div><div className="ea-check-state">{index < verifiedCount ? "PASS" : "PENDING"}</div></div>
                    ))}
                  </div>
                </div>
              </Panel>
            ) : null}
          </div>

          <aside className="ea-side">
            <section className="ea-side-card">
              <div className="ea-overline">Artifact identity</div>
              <h3>{ARTIFACT_ID}</h3>
              <div className="ea-side-list">
                <div className="ea-side-row"><span>Series</span><strong>Canonical founding</strong></div>
                <div className="ea-side-row"><span>Sequence</span><strong>01 of 12</strong></div>
                <div className="ea-side-row"><span>Owner</span><strong>TA-14 Authority</strong></div>
                <div className="ea-side-row"><span>Published</span><strong>July 2026</strong></div>
                <div className="ea-side-row"><span>Status</span><strong>PUBLISHED</strong></div>
              </div>
            </section>

            <section className="ea-side-card">
              <div className="ea-overline">Download package</div>
              <h3>Inspect offline</h3>
              <p>Download the public representations generated from the bounded record.</p>
              <div className="ea-downloads">
                <button className="ea-download" onClick={() => download(`${ARTIFACT_ID}.json`, packageRecord)}>Canonical JSON <span>↓</span></button>
                <button className="ea-download" onClick={() => download(`${ARTIFACT_ID}-integrity-manifest.json`, manifest)}>Integrity manifest <span>↓</span></button>
                <button className="ea-download" onClick={() => download(`${ARTIFACT_ID}-execution-receipt.json`, packageRecord.execution)}>Execution receipt <span>↓</span></button>
                <button className="ea-download" onClick={() => download(`${ARTIFACT_ID}-verification.txt`, `Artifact: ${ARTIFACT_ID}\nExpected result: VERIFIED\nVerification level: 6\nRecord hash: ${RECORD_HASH}\nPackage hash: ${PACKAGE_HASH}\n`)}>Verification instructions <span>↓</span></button>
              </div>
            </section>

            <section className="ea-side-card ea-boundary">
              <div className="ea-overline">Claims boundary</div>
              <h3>Demonstration record</h3>
              <p>This artifact proves one controlled event generated by the TA-14 reference engine. It does not claim that a production organization, external adapter, regulator, or independent reviewer has certified universal performance.</p>
            </section>
          </aside>
        </div>

        <footer className="ea-footer">
          <span>TA-14 Authority · Admissible Execution Architecture · Execution Artifact {ARTIFACT_ID}</span>
          <span>No admissible evidence. No admissible execution.</span>
        </footer>
      </div>
    </main>
  );
}
