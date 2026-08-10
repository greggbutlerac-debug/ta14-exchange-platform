"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import {
  TA14_24_LINKS,
  TA14_ROUTE_STATE_QUESTIONS,
  type TA14LinkId,
  type TA14RouteDecision,
} from "@/lib/academy/ta14-24-link-canon";

const decisions: readonly TA14RouteDecision[] = [
  "CONTINUE",
  "NARROW",
  "HOLD",
  "REFUSE",
  "ESCALATE",
];

const decisionCopy: Record<TA14RouteDecision, string> = {
  CONTINUE: "The next transition remains supportable.",
  NARROW: "Continuation is permitted only within a smaller supported scope.",
  HOLD: "Progression pauses until the missing condition is recovered.",
  REFUSE: "Continuation is not admissible under the current state.",
  ESCALATE:
    "The route requires higher or different governed authority before proceeding.",
};

const decisionTone: Record<TA14RouteDecision, string> = {
  CONTINUE: "continue",
  NARROW: "narrow",
  HOLD: "hold",
  REFUSE: "refuse",
  ESCALATE: "escalate",
};

function linkLabel(linkId: TA14LinkId | "") {
  if (!linkId) return "Not established";

  const link = TA14_24_LINKS.find((item) => item.linkId === linkId);

  return link
    ? `${String(link.order).padStart(2, "0")} · ${link.canonicalName}`
    : linkId;
}

function linkOrder(linkId: TA14LinkId | "") {
  if (!linkId) return null;

  return (
    TA14_24_LINKS.find((item) => item.linkId === linkId)?.order ?? null
  );
}

export default function TA14RouteStateLabPage() {
  const [currentLink, setCurrentLink] =
    useState<TA14LinkId>("TA14-LINK-14");

  const [lastAdmissibleLink, setLastAdmissibleLink] =
    useState<TA14LinkId | "">("TA14-LINK-13");

  const [firstBrokenLink, setFirstBrokenLink] =
    useState<TA14LinkId | "">("TA14-LINK-14");

  const [decision, setDecision] =
    useState<TA14RouteDecision>("HOLD");

  const [reason, setReason] = useState(
    "New evidence changed the relevant risk state after binding.",
  );

  const [recovery, setRecovery] = useState(
    "Re-establish Commit Reality and reassess authority or scope if the change is material.",
  );

  const [formingConsequence, setFormingConsequence] = useState(
    "Premature commitment against stale assumptions.",
  );

  const current = useMemo(
    () => TA14_24_LINKS.find((item) => item.linkId === currentLink)!,
    [currentLink],
  );

  const brokenOrder = useMemo(
    () => linkOrder(firstBrokenLink),
    [firstBrokenLink],
  );

  const lastOrder = useMemo(
    () => linkOrder(lastAdmissibleLink),
    [lastAdmissibleLink],
  );

  const admissibleCount = lastOrder ?? 0;

  const downstreamCount = useMemo(() => {
    if (!brokenOrder) return 0;
    return TA14_24_LINKS.filter((item) => item.order > brokenOrder).length;
  }, [brokenOrder]);

  const currentRegion = useMemo(() => {
    if (current.order <= 6) return "Reality & Evidence";
    if (current.order <= 11) return "Reliance, Authority & Consequence";
    if (current.order <= 15) return "Binding & Commit";
    if (current.order <= 19) return "Execution & Non-Occurrence";
    return "Outcome, Memory & Future Chain";
  }, [current.order]);

  function cellState(order: number) {
    if (brokenOrder && order === brokenOrder) return "broken";
    if (lastOrder && order <= lastOrder) return "admissible";
    if (order === current.order) return "current";
    if (brokenOrder && order > brokenOrder) return "downstream";
    return "pending";
  }

  return (
    <main className="route">
      <style>{`
        .route {
          --bg: #020711;
          --panel: rgba(8,20,32,.86);
          --panel2: rgba(10,26,40,.76);
          --line: rgba(129,176,210,.14);
          --lineStrong: rgba(84,232,255,.26);
          --cyan: #54e8ff;
          --cyanSoft: #c4f8ff;
          --green: #45eaa6;
          --greenSoft: #c8f7df;
          --amber: #f1c769;
          --amberSoft: #ffe8aa;
          --rose: #ff879f;
          --roseSoft: #ffd1da;
          --indigo: #a8b2ff;
          --text: #eff8ff;
          --muted: #93a8ba;
          --dim: #647b8f;
          min-height: 100vh;
          overflow: hidden;
          color: var(--text);
          background:
            radial-gradient(circle at 9% 0%, rgba(84,232,255,.11), transparent 24%),
            radial-gradient(circle at 92% 5%, rgba(255,135,159,.09), transparent 25%),
            linear-gradient(180deg, #020711 0%, #030a13 55%, #020711 100%);
        }

        .route * { box-sizing: border-box; }

        .route-shell {
          width: min(1460px, calc(100% - 48px));
          margin: 0 auto;
        }

        .route-hero {
          position: relative;
          overflow: hidden;
          border-bottom: 1px solid var(--line);
        }

        .route-hero::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            linear-gradient(rgba(255,255,255,.018) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.018) 1px, transparent 1px);
          background-size: 56px 56px;
          mask-image: linear-gradient(to bottom, #000, transparent 90%);
          opacity: .38;
        }

        .route-topline {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          padding-top: 20px;
        }

        .route-back {
          color: var(--cyanSoft);
          font-size: .72rem;
          font-weight: 900;
          text-decoration: none;
        }

        .route-badge {
          display: inline-flex;
          align-items: center;
          min-height: 34px;
          padding: 0 12px;
          border: 1px solid rgba(84,232,255,.18);
          border-radius: 999px;
          background: rgba(84,232,255,.045);
          color: var(--cyanSoft);
          font-size: .56rem;
          font-weight: 950;
          letter-spacing: .12em;
          text-transform: uppercase;
        }

        .route-hero-grid {
          position: relative;
          display: grid;
          grid-template-columns: minmax(0,1.08fr) minmax(420px,.92fr);
          gap: 64px;
          align-items: center;
          padding: 72px 0 84px;
        }

        .route-kicker {
          color: var(--cyan);
          font-size: .64rem;
          font-weight: 950;
          letter-spacing: .20em;
          text-transform: uppercase;
        }

        .route-title {
          max-width: 980px;
          margin: 14px 0 0;
          font-size: clamp(3.2rem,6vw,6.2rem);
          line-height: .95;
          letter-spacing: -.06em;
        }

        .route-title span {
          display: block;
          color: var(--cyanSoft);
        }

        .route-lead {
          max-width: 920px;
          margin: 26px 0 0;
          color: #c8d8e4;
          font-size: clamp(1rem,1.35vw,1.18rem);
          line-height: 1.8;
        }

        .route-rules {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 24px;
        }

        .route-rule {
          padding: 7px 10px;
          border: 1px solid var(--line);
          border-radius: 999px;
          background: rgba(255,255,255,.026);
          color: var(--muted);
          font-size: .56rem;
          font-weight: 850;
        }

        .route-radar {
          position: relative;
          width: min(510px,100%);
          aspect-ratio: 1;
          margin: 0 auto;
        }

        .route-ring {
          position: absolute;
          inset: 50% auto auto 50%;
          transform: translate(-50%,-50%);
          border: 1px solid rgba(129,176,210,.10);
          border-radius: 50%;
        }

        .route-ring.r1 { width: 96%; height: 96%; }
        .route-ring.r2 {
          width: 76%;
          height: 76%;
          border-color: rgba(84,232,255,.12);
        }
        .route-ring.r3 {
          width: 56%;
          height: 56%;
          border-color: rgba(69,234,166,.12);
        }
        .route-ring.r4 {
          width: 36%;
          height: 36%;
          border-color: rgba(255,135,159,.12);
        }

        .route-axis-h,
        .route-axis-v {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%,-50%);
        }

        .route-axis-h {
          width: 88%;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(84,232,255,.15),
            transparent
          );
        }

        .route-axis-v {
          width: 1px;
          height: 88%;
          background: linear-gradient(
            180deg,
            transparent,
            rgba(255,135,159,.13),
            transparent
          );
        }

        .route-core {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 182px;
          height: 182px;
          transform: translate(-50%,-50%);
          display: grid;
          place-items: center;
          border: 1px solid rgba(84,232,255,.25);
          border-radius: 50%;
          background:
            radial-gradient(circle at 30% 25%, rgba(84,232,255,.12), transparent 44%),
            rgba(5,16,27,.95);
          box-shadow: 0 0 90px rgba(84,232,255,.09);
          text-align: center;
        }

        .route-core small {
          display: block;
          color: var(--cyan);
          font-size: .58rem;
          font-weight: 950;
          letter-spacing: .18em;
        }

        .route-core strong {
          display: block;
          margin-top: 5px;
          font-size: 3.4rem;
          line-height: 1;
          letter-spacing: -.06em;
        }

        .route-core span {
          display: block;
          margin-top: 7px;
          color: var(--muted);
          font-size: .64rem;
        }

        .route-node {
          position: absolute;
          min-width: 118px;
          padding: 10px 12px;
          border: 1px solid var(--line);
          border-radius: 13px;
          background: rgba(5,16,27,.92);
          box-shadow: 0 12px 34px rgba(0,0,0,.24);
        }

        .route-node b {
          display: block;
          font-size: .55rem;
          letter-spacing: .12em;
        }

        .route-node span {
          display: block;
          margin-top: 4px;
          color: #d7e5ef;
          font-size: .66rem;
          font-weight: 850;
        }

        .route-node.n1 { left: 0; top: 18%; }
        .route-node.n2 { right: 0; top: 24%; }
        .route-node.n3 { right: 4%; bottom: 18%; }
        .route-node.n4 { left: 0; bottom: 18%; }
        .route-node.n5 {
          left: 50%;
          top: 0;
          transform: translateX(-50%);
        }

        .route-node.current b { color: var(--cyan); }
        .route-node.admissible b { color: var(--green); }
        .route-node.broken b { color: var(--rose); }
        .route-node.decision b { color: var(--amber); }
        .route-node.downstream b { color: var(--dim); }

        .route-metrics {
          border-bottom: 1px solid var(--line);
          background: rgba(4,12,20,.76);
        }

        .route-metric-grid {
          display: grid;
          grid-template-columns: repeat(5,minmax(0,1fr));
        }

        .route-metric {
          min-height: 98px;
          padding: 20px;
          border-right: 1px solid var(--line);
        }

        .route-metric:last-child { border-right: 0; }

        .route-metric strong {
          display: block;
          font-size: 2rem;
          line-height: 1;
          letter-spacing: -.04em;
        }

        .route-metric span {
          display: block;
          margin-top: 8px;
          color: var(--dim);
          font-size: .58rem;
          font-weight: 900;
          letter-spacing: .10em;
          text-transform: uppercase;
        }

        .route-section {
          padding: 72px 0 90px;
        }

        .route-section.alt {
          border-top: 1px solid var(--line);
          border-bottom: 1px solid var(--line);
          background: rgba(4,12,20,.66);
        }

        .route-section-head {
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: 28px;
          margin-bottom: 28px;
        }

        .route-eyebrow {
          color: var(--cyan);
          font-size: .62rem;
          font-weight: 950;
          letter-spacing: .16em;
          text-transform: uppercase;
        }

        .route-h2 {
          margin: 9px 0 0;
          font-size: clamp(2rem,3.4vw,3.7rem);
          line-height: 1;
          letter-spacing: -.045em;
        }

        .route-section-copy {
          max-width: 620px;
          margin: 0;
          color: var(--muted);
          font-size: .78rem;
          line-height: 1.7;
        }

        .route-map {
          overflow: hidden;
          border: 1px solid var(--line);
          border-radius: 24px;
          background: rgba(255,255,255,.024);
        }

        .route-map-head {
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: 18px;
          padding: 22px 24px 20px;
          border-bottom: 1px solid var(--line);
          background:
            radial-gradient(circle at 100% 0%, rgba(84,232,255,.06), transparent 42%),
            rgba(255,255,255,.01);
        }

        .route-map-head small {
          display: block;
          color: var(--cyan);
          font-size: .55rem;
          font-weight: 950;
          letter-spacing: .12em;
          text-transform: uppercase;
        }

        .route-map-head h3 {
          margin: 7px 0 0;
          font-size: 1.35rem;
          letter-spacing: -.025em;
        }

        .route-map-head p {
          max-width: 520px;
          margin: 0;
          color: var(--muted);
          font-size: .65rem;
          line-height: 1.55;
        }

        .route-link-grid {
          display: grid;
          grid-template-columns: repeat(6,minmax(0,1fr));
          gap: 9px;
          padding: 16px;
        }

        .route-link {
          min-height: 148px;
          display: grid;
          align-content: space-between;
          gap: 13px;
          padding: 13px;
          border: 1px solid var(--line);
          border-radius: 14px;
          background: rgba(0,0,0,.10);
          color: var(--text);
          text-decoration: none;
          transition: 160ms ease;
        }

        .route-link:hover {
          transform: translateY(-2px);
          border-color: rgba(84,232,255,.24);
        }

        .route-link.admissible {
          border-color: rgba(69,234,166,.22);
          background: rgba(69,234,166,.035);
        }

        .route-link.current {
          border-color: rgba(84,232,255,.35);
          background:
            radial-gradient(circle at 100% 0%, rgba(84,232,255,.08), transparent 44%),
            rgba(84,232,255,.045);
        }

        .route-link.broken {
          border-color: rgba(255,135,159,.38);
          background:
            radial-gradient(circle at 100% 0%, rgba(255,135,159,.09), transparent 44%),
            rgba(255,135,159,.05);
        }

        .route-link.downstream {
          opacity: .48;
        }

        .route-link.pending {
          border-color: var(--line);
        }

        .route-link-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 8px;
        }

        .route-link-index {
          color: var(--cyan);
          font-size: .56rem;
          font-weight: 950;
          letter-spacing: .10em;
        }

        .route-link-state {
          max-width: 88px;
          padding: 5px 7px;
          border: 1px solid var(--line);
          border-radius: 999px;
          color: var(--muted);
          font-size: .43rem;
          font-weight: 950;
          letter-spacing: .06em;
          text-transform: uppercase;
          text-align: center;
        }

        .route-link.admissible .route-link-state {
          border-color: rgba(69,234,166,.18);
          color: var(--greenSoft);
        }

        .route-link.current .route-link-state {
          border-color: rgba(84,232,255,.18);
          color: var(--cyanSoft);
        }

        .route-link.broken .route-link-state {
          border-color: rgba(255,135,159,.20);
          color: var(--roseSoft);
        }

        .route-link-name {
          font-size: .69rem;
          font-weight: 850;
          line-height: 1.38;
        }

        .route-link-track {
          width: 34px;
          height: 2px;
          border-radius: 999px;
          background: rgba(255,255,255,.08);
          transition: width 160ms ease;
        }

        .route-link:hover .route-link-track {
          width: 100%;
          background: rgba(84,232,255,.30);
        }

        .route-legend {
          display: flex;
          flex-wrap: wrap;
          gap: 9px;
          padding: 0 16px 16px;
        }

        .route-legend-item {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 6px 9px;
          border: 1px solid var(--line);
          border-radius: 999px;
          background: rgba(255,255,255,.018);
          color: var(--muted);
          font-size: .53rem;
          font-weight: 850;
        }

        .route-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .route-dot.admissible { background: var(--green); }
        .route-dot.current { background: var(--cyan); }
        .route-dot.broken { background: var(--rose); }
        .route-dot.downstream { background: rgba(255,255,255,.28); }

        .route-workspace {
          display: grid;
          grid-template-columns: minmax(0,.92fr) minmax(0,1.08fr);
          gap: 20px;
          align-items: start;
        }

        .route-console,
        .route-record {
          overflow: hidden;
          border: 1px solid var(--line);
          border-radius: 24px;
          background: rgba(255,255,255,.024);
        }

        .route-console-head,
        .route-record-head {
          padding: 22px 24px 20px;
          border-bottom: 1px solid var(--line);
        }

        .route-console-head {
          background:
            radial-gradient(circle at 100% 0%, rgba(84,232,255,.07), transparent 42%),
            rgba(255,255,255,.01);
        }

        .route-record-head {
          background:
            radial-gradient(circle at 100% 0%, rgba(69,234,166,.06), transparent 42%),
            rgba(255,255,255,.01);
        }

        .route-panel-kicker {
          color: var(--cyan);
          font-size: .56rem;
          font-weight: 950;
          letter-spacing: .14em;
          text-transform: uppercase;
        }

        .route-record .route-panel-kicker {
          color: var(--green);
        }

        .route-console h2,
        .route-record h2 {
          margin: 8px 0 0;
          font-size: 1.75rem;
          line-height: 1.08;
          letter-spacing: -.035em;
        }

        .route-console-head p,
        .route-record-head p {
          margin: 10px 0 0;
          color: var(--muted);
          font-size: .70rem;
          line-height: 1.6;
        }

        .route-console-body,
        .route-record-body {
          padding: 22px 24px 24px;
        }

        .route-fields {
          display: grid;
          gap: 15px;
        }

        .route-field {
          display: grid;
          gap: 7px;
        }

        .route-field label,
        .route-field-label {
          color: #dceaf4;
          font-size: .64rem;
          font-weight: 900;
        }

        .route-select,
        .route-textarea {
          width: 100%;
          border: 1px solid var(--line);
          border-radius: 11px;
          background: #07111e;
          color: var(--text);
          outline: none;
          font-size: .66rem;
        }

        .route-select {
          min-height: 44px;
          padding: 0 11px;
        }

        .route-textarea {
          min-height: 106px;
          padding: 11px 12px;
          resize: vertical;
          line-height: 1.6;
        }

        .route-select:focus,
        .route-textarea:focus {
          border-color: rgba(84,232,255,.36);
          box-shadow: 0 0 0 3px rgba(84,232,255,.06);
        }

        .route-decision-grid {
          display: grid;
          grid-template-columns: repeat(5,minmax(0,1fr));
          gap: 7px;
        }

        .route-decision {
          min-height: 44px;
          border: 1px solid var(--line);
          border-radius: 11px;
          background: rgba(255,255,255,.025);
          color: var(--muted);
          cursor: pointer;
          font-size: .55rem;
          font-weight: 950;
          letter-spacing: .05em;
          transition: 150ms ease;
        }

        .route-decision:hover {
          border-color: rgba(84,232,255,.22);
          color: #fff;
        }

        .route-decision.active {
          border-color: rgba(241,199,105,.28);
          background: rgba(241,199,105,.06);
          color: var(--amberSoft);
        }

        .route-state-grid {
          display: grid;
          grid-template-columns: repeat(2,minmax(0,1fr));
          gap: 10px;
        }

        .route-state-value {
          min-height: 110px;
          padding: 14px;
          border: 1px solid var(--line);
          border-radius: 14px;
          background: rgba(0,0,0,.10);
        }

        .route-state-value small {
          display: block;
          color: var(--dim);
          font-size: .49rem;
          font-weight: 950;
          letter-spacing: .10em;
          text-transform: uppercase;
        }

        .route-state-value strong {
          display: block;
          margin-top: 8px;
          font-size: .72rem;
          line-height: 1.45;
        }

        .route-decision-summary {
          margin-top: 14px;
          overflow: hidden;
          border: 1px solid rgba(241,199,105,.16);
          border-radius: 15px;
          background: rgba(241,199,105,.03);
        }

        .route-decision-summary-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 12px 14px;
          border-bottom: 1px solid rgba(241,199,105,.10);
        }

        .route-decision-summary-head small {
          color: var(--amber);
          font-size: .49rem;
          font-weight: 950;
          letter-spacing: .10em;
          text-transform: uppercase;
        }

        .route-decision-pill {
          padding: 5px 8px;
          border: 1px solid rgba(241,199,105,.18);
          border-radius: 999px;
          color: var(--amberSoft);
          font-size: .48rem;
          font-weight: 950;
          letter-spacing: .07em;
        }

        .route-decision-summary-body {
          padding: 14px;
        }

        .route-decision-summary-body strong {
          display: block;
          font-size: .74rem;
        }

        .route-decision-summary-body p {
          margin: 8px 0 0;
          color: var(--muted);
          font-size: .66rem;
          line-height: 1.62;
        }

        .route-recovery {
          display: grid;
          gap: 12px;
          margin-top: 14px;
        }

        .route-recovery-card {
          padding: 15px;
          border: 1px solid var(--line);
          border-radius: 15px;
          background: rgba(0,0,0,.10);
        }

        .route-recovery-card.recovery {
          border-color: rgba(69,234,166,.16);
        }

        .route-recovery-card.consequence {
          border-color: rgba(255,135,159,.16);
        }

        .route-recovery-card small {
          display: block;
          font-size: .49rem;
          font-weight: 950;
          letter-spacing: .10em;
          text-transform: uppercase;
        }

        .route-recovery-card.recovery small { color: var(--green); }
        .route-recovery-card.consequence small { color: var(--rose); }

        .route-recovery-card p {
          margin: 8px 0 0;
          color: #dceaf4;
          font-size: .68rem;
          line-height: 1.62;
        }

        .route-rule-card {
          margin-top: 14px;
          padding: 15px;
          border: 1px solid rgba(241,199,105,.16);
          border-radius: 15px;
          background: rgba(241,199,105,.03);
        }

        .route-rule-card small {
          display: block;
          color: var(--amber);
          font-size: .49rem;
          font-weight: 950;
          letter-spacing: .10em;
          text-transform: uppercase;
        }

        .route-rule-card p {
          margin: 8px 0 0;
          color: var(--muted);
          font-size: .66rem;
          line-height: 1.62;
        }

        .route-questions {
          display: grid;
          grid-template-columns: repeat(3,minmax(0,1fr));
          gap: 12px;
        }

        .route-question {
          min-height: 178px;
          padding: 17px;
          border: 1px solid var(--line);
          border-radius: 17px;
          background: rgba(255,255,255,.024);
        }

        .route-question small {
          color: var(--cyan);
          font-size: .54rem;
          font-weight: 950;
          letter-spacing: .11em;
        }

        .route-question strong {
          display: block;
          margin-top: 12px;
          font-size: .80rem;
          line-height: 1.5;
        }

        .route-question span {
          display: block;
          margin-top: 13px;
          padding-top: 13px;
          border-top: 1px solid var(--line);
          color: var(--dim);
          font-size: .57rem;
          line-height: 1.5;
        }

        .route-close {
          padding: 76px 0 98px;
          text-align: center;
        }

        .route-close h2 {
          max-width: 900px;
          margin: 10px auto 0;
          font-size: clamp(2.3rem,4.2vw,4.6rem);
          line-height: 1;
          letter-spacing: -.05em;
        }

        .route-close p {
          max-width: 760px;
          margin: 18px auto 0;
          color: var(--muted);
          font-size: .76rem;
          line-height: 1.7;
        }

        .route-close-actions {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 10px;
          margin-top: 26px;
        }

        .route-button {
          min-height: 42px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0 14px;
          border: 1px solid var(--line);
          border-radius: 11px;
          background: rgba(255,255,255,.025);
          color: #dceaf4;
          font-size: .64rem;
          font-weight: 900;
          text-decoration: none;
          transition: 160ms ease;
        }

        .route-button.primary {
          border-color: rgba(84,232,255,.24);
          background: rgba(84,232,255,.065);
          color: var(--cyanSoft);
        }

        .route-button:hover {
          transform: translateY(-2px);
          border-color: var(--lineStrong);
        }

        @media (max-width: 1180px) {
          .route-hero-grid { grid-template-columns: 1fr; }
          .route-radar { max-width: 500px; }
          .route-link-grid { grid-template-columns: repeat(4,minmax(0,1fr)); }
          .route-workspace { grid-template-columns: 1fr; }
        }

        @media (max-width: 900px) {
          .route-shell {
            width: min(100% - 28px,1460px);
          }

          .route-topline,
          .route-section-head,
          .route-map-head {
            display: grid;
            align-items: start;
          }

          .route-title {
            font-size: clamp(2.8rem,13vw,4.8rem);
          }

          .route-metric-grid {
            grid-template-columns: repeat(2,minmax(0,1fr));
          }

          .route-metric {
            border-bottom: 1px solid var(--line);
          }

          .route-metric:nth-child(2n) {
            border-right: 0;
          }

          .route-link-grid {
            grid-template-columns: repeat(3,minmax(0,1fr));
          }

          .route-questions {
            grid-template-columns: repeat(2,minmax(0,1fr));
          }
        }

        @media (max-width: 640px) {
          .route-link-grid,
          .route-state-grid,
          .route-questions {
            grid-template-columns: 1fr;
          }

          .route-decision-grid {
            grid-template-columns: repeat(2,minmax(0,1fr));
          }

          .route-node { display: none; }

          .route-close-actions { display: grid; }
        }
      `}</style>

      <section className="route-hero">
        <div className="route-shell route-topline">
          <Link
            href="/academy/24-link-architecture"
            className="route-back"
          >
            ← Back to 24-Link Explorer
          </Link>

          <span className="route-badge">
            Operational Lab · Live Route State
          </span>
        </div>

        <div className="route-shell route-hero-grid">
          <div>
            <div className="route-kicker">
              TA-14 Academy · Operational Lab
            </div>

            <h1 className="route-title">
              Route
              <span>State.</span>
            </h1>

            <p className="route-lead">
              Locate a live governance process inside the 24-link architecture,
              preserve the last admissible state, identify the first broken
              link, and determine what must become true before
              consequence-bearing progression is allowed.
            </p>

            <div className="route-rules">
              <span className="route-rule">Locate current state</span>
              <span className="route-rule">Preserve last admissible state</span>
              <span className="route-rule">Identify first broken link</span>
              <span className="route-rule">Choose governed decision</span>
              <span className="route-rule">Name forming consequence</span>
            </div>
          </div>

          <div
            className="route-radar"
            aria-label="TA-14 live route state motif"
          >
            <div className="route-ring r1" />
            <div className="route-ring r2" />
            <div className="route-ring r3" />
            <div className="route-ring r4" />
            <div className="route-axis-h" />
            <div className="route-axis-v" />

            <div className="route-core">
              <div>
                <small>LIVE ROUTE</small>
                <strong>
                  {String(current.order).padStart(2, "0")}
                </strong>
                <span>{current.canonicalName}</span>
              </div>
            </div>

            <div className="route-node n1 current">
              <b>{String(current.order).padStart(2, "0")}</b>
              <span>Current state</span>
            </div>

            <div className="route-node n2 admissible">
              <b>{lastOrder ? String(lastOrder).padStart(2, "0") : "—"}</b>
              <span>Last admissible</span>
            </div>

            <div className="route-node n3 broken">
              <b>{brokenOrder ? String(brokenOrder).padStart(2, "0") : "—"}</b>
              <span>First broken</span>
            </div>

            <div className="route-node n4 decision">
              <b>{decision}</b>
              <span>Route decision</span>
            </div>

            <div className="route-node n5 downstream">
              <b>{downstreamCount}</b>
              <span>Downstream blocked</span>
            </div>
          </div>
        </div>
      </section>

      <section className="route-metrics">
        <div className="route-shell route-metric-grid">
          <Metric
            value={String(current.order).padStart(2, "0")}
            label="Current canonical link"
          />
          <Metric
            value={lastOrder ? String(lastOrder).padStart(2, "0") : "—"}
            label="Last admissible link"
          />
          <Metric
            value={brokenOrder ? String(brokenOrder).padStart(2, "0") : "—"}
            label="First broken link"
          />
          <Metric
            value={String(admissibleCount)}
            label="Admissibly established"
          />
          <Metric
            value={decision}
            label="Current route decision"
          />
        </div>
      </section>

      <section className="route-section alt">
        <div className="route-shell">
          <div className="route-section-head">
            <div>
              <div className="route-eyebrow">
                Full-chain route state
              </div>

              <h2 className="route-h2">
                See exactly where support ends.
              </h2>
            </div>

            <p className="route-section-copy">
              The chain view distinguishes what has been admissibly
              established, where the live route currently sits, the first state
              that is no longer supportable, and every downstream link that
              cannot inherit an unsupported pass.
            </p>
          </div>

          <section className="route-map">
            <div className="route-map-head">
              <div>
                <small>24-Link live state map</small>
                <h3>{currentRegion}</h3>
              </div>

              <p>
                Current route: {linkLabel(currentLink)} · Decision: {decision}
              </p>
            </div>

            <div className="route-link-grid">
              {TA14_24_LINKS.map((item) => {
                const state = cellState(item.order);

                return (
                  <Link
                    key={item.linkId}
                    href={`/academy/24-link-architecture/${String(
                      item.order,
                    ).padStart(2, "0")}-${item.slug}`}
                    className={`route-link ${state}`}
                  >
                    <div className="route-link-top">
                      <span className="route-link-index">
                        {String(item.order).padStart(2, "0")}
                      </span>

                      <span className="route-link-state">
                        {state}
                      </span>
                    </div>

                    <div>
                      <div className="route-link-name">
                        {item.canonicalName}
                      </div>

                      <div className="route-link-track" />
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="route-legend">
              <Legend label="Admissibly established" tone="admissible" />
              <Legend label="Current state" tone="current" />
              <Legend label="First broken link" tone="broken" />
              <Legend label="Downstream not supportable" tone="downstream" />
            </div>
          </section>
        </div>
      </section>

      <section className="route-section">
        <div className="route-shell">
          <div className="route-section-head">
            <div>
              <div
                className="route-eyebrow"
                style={{ color: "var(--green)" }}
              >
                Route-state console
              </div>

              <h2 className="route-h2">
                Establish the governed state before progression.
              </h2>
            </div>

            <p className="route-section-copy">
              Route State is not a workflow-status field. It is the governed
              statement of where the route is, what remains admissible, what
              broke, what decision follows, and what consequence is already
              beginning to form.
            </p>
          </div>

          <div className="route-workspace">
            <section className="route-console">
              <div className="route-console-head">
                <div className="route-panel-kicker">
                  Route-state inputs
                </div>

                <h2>Establish the governed state</h2>

                <p>
                  Update the route only when the evidence supports the
                  transition you are declaring.
                </p>
              </div>

              <div className="route-console-body">
                <div className="route-fields">
                  <SelectField
                    label="Current link"
                    value={currentLink}
                    onChange={(value) =>
                      setCurrentLink(value as TA14LinkId)
                    }
                    allowNone={false}
                  />

                  <SelectField
                    label="Last admissibly established link"
                    value={lastAdmissibleLink}
                    onChange={(value) =>
                      setLastAdmissibleLink(value as TA14LinkId | "")
                    }
                  />

                  <SelectField
                    label="First broken link"
                    value={firstBrokenLink}
                    onChange={(value) =>
                      setFirstBrokenLink(value as TA14LinkId | "")
                    }
                  />

                  <div className="route-field">
                    <span className="route-field-label">
                      Route decision
                    </span>

                    <div className="route-decision-grid">
                      {decisions.map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => setDecision(item)}
                          className={[
                            "route-decision",
                            decision === item ? "active" : "",
                          ]
                            .filter(Boolean)
                            .join(" ")}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>

                  <TextField
                    label="Reason"
                    value={reason}
                    onChange={setReason}
                  />

                  <TextField
                    label="Required recovery"
                    value={recovery}
                    onChange={setRecovery}
                  />

                  <TextField
                    label="Forming consequence"
                    value={formingConsequence}
                    onChange={setFormingConsequence}
                  />
                </div>
              </div>
            </section>

            <section className="route-record">
              <div className="route-record-head">
                <div className="route-panel-kicker">
                  Live route-state record
                </div>

                <h2>
                  {String(current.order).padStart(2, "0")} ·{" "}
                  {current.canonicalName}
                </h2>

                <p>
                  This panel mirrors the operational route as currently
                  declared in the lab.
                </p>
              </div>

              <div className="route-record-body">
                <div className="route-state-grid">
                  <StateValue
                    label="Current link"
                    value={linkLabel(currentLink)}
                  />

                  <StateValue
                    label="Last admissible"
                    value={linkLabel(lastAdmissibleLink)}
                  />

                  <StateValue
                    label="First broken"
                    value={linkLabel(firstBrokenLink)}
                  />

                  <StateValue
                    label="Decision"
                    value={decision}
                  />
                </div>

                <div className="route-decision-summary">
                  <div className="route-decision-summary-head">
                    <small>Governed decision</small>

                    <span
                      className={`route-decision-pill ${decisionTone[decision]}`}
                    >
                      {decision}
                    </span>
                  </div>

                  <div className="route-decision-summary-body">
                    <strong>{decisionCopy[decision]}</strong>
                    <p>{reason}</p>
                  </div>
                </div>

                <div className="route-recovery">
                  <div className="route-recovery-card recovery">
                    <small>Recovery requirement</small>
                    <p>{recovery}</p>
                  </div>

                  <div className="route-recovery-card consequence">
                    <small>
                      Consequence forming if progression continues
                    </small>
                    <p>{formingConsequence}</p>
                  </div>
                </div>

                <div className="route-rule-card">
                  <small>Canonical state rule</small>
                  <p>
                    A downstream link does not become admissible merely because
                    a workflow reaches it. Progression remains supportable only
                    while the required upstream states and evidence remain
                    valid.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>

      <section className="route-section alt">
        <div className="route-shell">
          <div className="route-section-head">
            <div>
              <div
                className="route-eyebrow"
                style={{ color: "var(--amber)" }}
              >
                Six Route-State Questions
              </div>

              <h2 className="route-h2">
                Ask these before consequence-bearing progression.
              </h2>
            </div>

            <p className="route-section-copy">
              These six questions turn the 24-link canon into an operational
              diagnostic instrument rather than a static architecture diagram.
            </p>
          </div>

          <div className="route-questions">
            {TA14_ROUTE_STATE_QUESTIONS.map((question, index) => (
              <article
                key={question}
                className="route-question"
              >
                <small>
                  Q{String(index + 1).padStart(2, "0")}
                </small>

                <strong>{question}</strong>

                <span>
                  Route-state question {index + 1} of{" "}
                  {TA14_ROUTE_STATE_QUESTIONS.length}
                </span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="route-close">
        <div className="route-shell">
          <div className="route-eyebrow">
            Operational route discipline
          </div>

          <h2>
            Do not ask only where the workflow is.
            <br />
            Ask where admissibility still exists.
          </h2>

          <p>
            Route State makes the architecture operational by forcing the live
            process to identify its current coordinate, last admissible state,
            first unsupported state, required recovery, governed decision, and
            forming consequence before progression is allowed.
          </p>

          <div className="route-close-actions">
            <Link
              href="/academy/24-link-architecture"
              className="route-button primary"
            >
              Return to 24-Link Explorer →
            </Link>

            <Link
              href="/academy/24-link-architecture/simulator"
              className="route-button"
            >
              Pressure This Route
            </Link>

            <Link
              href="/academy/24-link-architecture/build-a-chain"
              className="route-button"
            >
              Open Build-a-Chain
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function Metric({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="route-metric">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  allowNone = true,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  allowNone?: boolean;
}) {
  return (
    <div className="route-field">
      <label>{label}</label>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="route-select"
      >
        {allowNone ? (
          <option value="">
            Not established
          </option>
        ) : null}

        {TA14_24_LINKS.map((item) => (
          <option
            key={item.linkId}
            value={item.linkId}
          >
            {String(item.order).padStart(2, "0")} ·{" "}
            {item.canonicalName}
          </option>
        ))}
      </select>
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="route-field">
      <span className="route-field-label">
        {label}
      </span>

      <textarea
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        rows={3}
        className="route-textarea"
      />
    </div>
  );
}

function StateValue({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="route-state-value">
      <small>{label}</small>
      <strong>{value}</strong>
    </div>
  );
}

function Legend({
  label,
  tone,
}: {
  label: string;
  tone: "admissible" | "current" | "broken" | "downstream";
}) {
  return (
    <span className="route-legend-item">
      <span className={`route-dot ${tone}`} />
      {label}
    </span>
  );
}
