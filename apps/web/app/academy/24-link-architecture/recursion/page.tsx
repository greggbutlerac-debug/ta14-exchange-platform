"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { TA14_24_LINKS } from "@/lib/academy/ta14-24-link-canon";

const RECURSION_ORDERS = [20, 21, 22, 23, 24] as const;

type RecursionRecord = {
  outcomeReality: string;
  outcome: string;
  newReality: string;
  memory: string;
  futureTrigger: string;
  inheritedConstraints: string;
};

const EMPTY_RECORD: RecursionRecord = {
  outcomeReality: "",
  outcome: "",
  newReality: "",
  memory: "",
  futureTrigger: "",
  inheritedConstraints: "",
};

const RECURSION_FIELDS: readonly {
  key: keyof RecursionRecord;
  number: string;
  title: string;
  prompt: string;
  stateLabel: string;
  empty: string;
}[] = [
  {
    key: "outcomeReality",
    number: "20",
    title: "Outcome Reality",
    prompt: "What real state now exists after execution or non-execution?",
    stateLabel: "Observed reality",
    empty: "Outcome Reality not yet established.",
  },
  {
    key: "outcome",
    number: "21",
    title: "Outcome",
    prompt: "What governed result did the chain actually produce?",
    stateLabel: "Governed result",
    empty: "Outcome not yet classified.",
  },
  {
    key: "newReality",
    number: "22",
    title: "New Reality",
    prompt: "What changed world must the next decision inherit?",
    stateLabel: "New starting reality",
    empty: "New Reality not yet declared.",
  },
  {
    key: "memory",
    number: "23",
    title: "Memory",
    prompt:
      "What governed knowledge, lineage, finding, doctrine, or lesson must survive?",
    stateLabel: "Preserved memory",
    empty: "Memory state not yet defined.",
  },
  {
    key: "futureTrigger",
    number: "24",
    title: "Future Chain",
    prompt:
      "What event or condition is allowed to trigger the next governed cycle?",
    stateLabel: "Future-chain trigger",
    empty: "Future Chain entry condition not yet defined.",
  },
];

export default function TA14RecursionLabPage() {
  const [record, setRecord] = useState<RecursionRecord>(EMPTY_RECORD);
  const [activeOrder, setActiveOrder] = useState<number>(20);

  const recursionLinks = useMemo(
    () =>
      RECURSION_ORDERS.map((order) =>
        TA14_24_LINKS.find((item) => item.order === order),
      ).filter(
        (item): item is (typeof TA14_24_LINKS)[number] => Boolean(item),
      ),
    [],
  );

  const completed = RECURSION_FIELDS.filter(
    (field) => record[field.key].trim().length > 0,
  ).length;

  const completion = Math.round((completed / RECURSION_FIELDS.length) * 100);

  const activeLink = useMemo(
    () =>
      recursionLinks.find((item) => item.order === activeOrder) ??
      recursionLinks[0],
    [recursionLinks, activeOrder],
  );

  const hasInheritedConstraints =
    record.inheritedConstraints.trim().length > 0;

  function update<K extends keyof RecursionRecord>(
    field: K,
    value: RecursionRecord[K],
  ) {
    setRecord((current) => ({
      ...current,
      [field]: value,
    }));
  }

  return (
    <main className="rec">
      <style>{`
        .rec {
          --bg: #020711;
          --panel: rgba(8, 20, 32, .86);
          --panel2: rgba(10, 26, 40, .76);
          --line: rgba(129, 176, 210, .14);
          --lineStrong: rgba(84, 232, 255, .26);
          --cyan: #54e8ff;
          --cyanSoft: #c4f8ff;
          --green: #45eaa6;
          --greenSoft: #c9f7df;
          --amber: #f1c769;
          --amberSoft: #ffe8aa;
          --indigo: #a8b2ff;
          --rose: #ff96ad;
          --text: #eff8ff;
          --muted: #93a8ba;
          --dim: #647b8f;
          min-height: 100vh;
          overflow: hidden;
          color: var(--text);
          background:
            radial-gradient(circle at 9% 0%, rgba(69,234,166,.11), transparent 24%),
            radial-gradient(circle at 92% 5%, rgba(84,232,255,.09), transparent 25%),
            linear-gradient(180deg, #020711 0%, #030a13 55%, #020711 100%);
        }

        .rec * {
          box-sizing: border-box;
        }

        .rec-shell {
          width: min(1460px, calc(100% - 48px));
          margin: 0 auto;
        }

        .rec-hero {
          position: relative;
          overflow: hidden;
          border-bottom: 1px solid var(--line);
        }

        .rec-hero::before {
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

        .rec-topline {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          padding-top: 20px;
        }

        .rec-back {
          color: var(--cyanSoft);
          font-size: .72rem;
          font-weight: 900;
          text-decoration: none;
        }

        .rec-badge {
          display: inline-flex;
          align-items: center;
          min-height: 34px;
          padding: 0 12px;
          border: 1px solid rgba(69,234,166,.20);
          border-radius: 999px;
          background: rgba(69,234,166,.05);
          color: var(--greenSoft);
          font-size: .56rem;
          font-weight: 950;
          letter-spacing: .12em;
          text-transform: uppercase;
        }

        .rec-hero-grid {
          position: relative;
          display: grid;
          grid-template-columns: minmax(0, 1.08fr) minmax(420px, .92fr);
          gap: 64px;
          align-items: center;
          padding: 72px 0 84px;
        }

        .rec-kicker {
          color: var(--green);
          font-size: .64rem;
          font-weight: 950;
          letter-spacing: .20em;
          text-transform: uppercase;
        }

        .rec-title {
          max-width: 980px;
          margin: 14px 0 0;
          font-size: clamp(3.2rem, 6vw, 6.2rem);
          line-height: .95;
          letter-spacing: -.06em;
        }

        .rec-title span {
          display: block;
          color: var(--greenSoft);
        }

        .rec-lead {
          max-width: 920px;
          margin: 26px 0 0;
          color: #c8d8e4;
          font-size: clamp(1rem, 1.35vw, 1.18rem);
          line-height: 1.8;
        }

        .rec-rules {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 24px;
        }

        .rec-rule {
          padding: 7px 10px;
          border: 1px solid var(--line);
          border-radius: 999px;
          background: rgba(255,255,255,.026);
          color: var(--muted);
          font-size: .56rem;
          font-weight: 850;
        }

        .rec-orbit {
          position: relative;
          width: min(510px, 100%);
          aspect-ratio: 1;
          margin: 0 auto;
        }

        .rec-ring {
          position: absolute;
          inset: 50% auto auto 50%;
          transform: translate(-50%, -50%);
          border: 1px solid rgba(129,176,210,.10);
          border-radius: 50%;
        }

        .rec-ring.r1 { width: 96%; height: 96%; }
        .rec-ring.r2 {
          width: 76%;
          height: 76%;
          border-color: rgba(69,234,166,.13);
        }
        .rec-ring.r3 {
          width: 56%;
          height: 56%;
          border-color: rgba(84,232,255,.12);
        }
        .rec-ring.r4 {
          width: 36%;
          height: 36%;
          border-color: rgba(168,178,255,.12);
        }

        .rec-axis-h,
        .rec-axis-v {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }

        .rec-axis-h {
          width: 88%;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(69,234,166,.16),
            transparent
          );
        }

        .rec-axis-v {
          width: 1px;
          height: 88%;
          background: linear-gradient(
            180deg,
            transparent,
            rgba(84,232,255,.13),
            transparent
          );
        }

        .rec-core {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 182px;
          height: 182px;
          transform: translate(-50%, -50%);
          display: grid;
          place-items: center;
          border: 1px solid rgba(69,234,166,.27);
          border-radius: 50%;
          background:
            radial-gradient(circle at 30% 25%, rgba(69,234,166,.13), transparent 44%),
            rgba(5,16,27,.95);
          box-shadow: 0 0 90px rgba(69,234,166,.09);
          text-align: center;
        }

        .rec-core small {
          display: block;
          color: var(--green);
          font-size: .58rem;
          font-weight: 950;
          letter-spacing: .18em;
        }

        .rec-core strong {
          display: block;
          margin-top: 5px;
          font-size: 3.4rem;
          line-height: 1;
          letter-spacing: -.06em;
        }

        .rec-core span {
          display: block;
          margin-top: 7px;
          color: var(--muted);
          font-size: .64rem;
        }

        .rec-node {
          position: absolute;
          min-width: 118px;
          padding: 10px 12px;
          border: 1px solid var(--line);
          border-radius: 13px;
          background: rgba(5,16,27,.92);
          box-shadow: 0 12px 34px rgba(0,0,0,.24);
        }

        .rec-node b {
          display: block;
          color: var(--green);
          font-size: .55rem;
          letter-spacing: .12em;
        }

        .rec-node span {
          display: block;
          margin-top: 4px;
          color: #d7e5ef;
          font-size: .66rem;
          font-weight: 850;
        }

        .rec-node.n1 { left: 0; top: 18%; }
        .rec-node.n2 { right: 0; top: 24%; }
        .rec-node.n3 { right: 4%; bottom: 18%; }
        .rec-node.n4 { left: 0; bottom: 18%; }
        .rec-node.n5 {
          left: 50%;
          top: 0;
          transform: translateX(-50%);
        }

        .rec-metrics {
          border-bottom: 1px solid var(--line);
          background: rgba(4,12,20,.76);
        }

        .rec-metric-grid {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
        }

        .rec-metric {
          min-height: 98px;
          padding: 20px;
          border-right: 1px solid var(--line);
        }

        .rec-metric:last-child {
          border-right: 0;
        }

        .rec-metric strong {
          display: block;
          font-size: 2rem;
          line-height: 1;
          letter-spacing: -.04em;
        }

        .rec-metric span {
          display: block;
          margin-top: 8px;
          color: var(--dim);
          font-size: .58rem;
          font-weight: 900;
          letter-spacing: .10em;
          text-transform: uppercase;
        }

        .rec-section {
          padding: 72px 0 90px;
        }

        .rec-section.alt {
          border-top: 1px solid var(--line);
          border-bottom: 1px solid var(--line);
          background: rgba(4,12,20,.66);
        }

        .rec-section-head {
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: 28px;
          margin-bottom: 28px;
        }

        .rec-eyebrow {
          color: var(--cyan);
          font-size: .62rem;
          font-weight: 950;
          letter-spacing: .16em;
          text-transform: uppercase;
        }

        .rec-h2 {
          margin: 9px 0 0;
          font-size: clamp(2rem, 3.4vw, 3.7rem);
          line-height: 1;
          letter-spacing: -.045em;
        }

        .rec-section-copy {
          max-width: 620px;
          margin: 0;
          color: var(--muted);
          font-size: .78rem;
          line-height: 1.7;
        }

        .rec-stage-grid {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 12px;
        }

        .rec-stage {
          min-height: 204px;
          display: flex;
          flex-direction: column;
          gap: 14px;
          padding: 17px;
          border: 1px solid var(--line);
          border-radius: 17px;
          background: rgba(255,255,255,.024);
          color: var(--text);
          text-align: left;
          cursor: pointer;
          transition: 170ms ease;
        }

        .rec-stage:hover {
          transform: translateY(-3px);
          border-color: rgba(69,234,166,.24);
          background: rgba(69,234,166,.03);
        }

        .rec-stage.active {
          border-color: rgba(69,234,166,.36);
          background:
            radial-gradient(circle at 100% 0%, rgba(69,234,166,.09), transparent 44%),
            rgba(69,234,166,.045);
        }

        .rec-stage.done {
          border-color: rgba(84,232,255,.20);
        }

        .rec-stage-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 10px;
        }

        .rec-stage-index {
          color: var(--green);
          font-size: .58rem;
          font-weight: 950;
          letter-spacing: .11em;
        }

        .rec-stage-state {
          padding: 5px 7px;
          border: 1px solid var(--line);
          border-radius: 999px;
          color: var(--dim);
          font-size: .47rem;
          font-weight: 950;
          letter-spacing: .06em;
          text-transform: uppercase;
        }

        .rec-stage.done .rec-stage-state {
          border-color: rgba(84,232,255,.18);
          color: var(--cyanSoft);
        }

        .rec-stage h3 {
          margin: 0;
          font-size: .94rem;
          line-height: 1.28;
        }

        .rec-stage p {
          margin: 0;
          color: var(--muted);
          font-size: .65rem;
          line-height: 1.58;
        }

        .rec-stage-action {
          margin-top: auto;
          padding-top: 13px;
          border-top: 1px solid var(--line);
          color: var(--greenSoft);
          font-size: .59rem;
          font-weight: 900;
        }

        .rec-progress {
          margin-top: 18px;
          overflow: hidden;
          border: 1px solid var(--line);
          border-radius: 16px;
          background: rgba(0,0,0,.10);
        }

        .rec-progress-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 12px 14px;
          border-bottom: 1px solid var(--line);
        }

        .rec-progress-head small {
          color: var(--dim);
          font-size: .50rem;
          font-weight: 900;
          letter-spacing: .10em;
          text-transform: uppercase;
        }

        .rec-progress-head strong {
          color: var(--greenSoft);
          font-size: .68rem;
        }

        .rec-progress-body {
          padding: 14px;
        }

        .rec-progress-track {
          overflow: hidden;
          height: 12px;
          border: 1px solid rgba(255,255,255,.06);
          border-radius: 999px;
          background: rgba(255,255,255,.035);
        }

        .rec-progress-fill {
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(
            90deg,
            rgba(69,234,166,.55),
            rgba(84,232,255,.78)
          );
          transition: width 180ms ease;
        }

        .rec-progress-note {
          margin-top: 10px;
          color: var(--muted);
          font-size: .62rem;
          line-height: 1.5;
        }

        .rec-workspace {
          display: grid;
          grid-template-columns: minmax(0, 1.08fr) minmax(390px, .92fr);
          gap: 20px;
          align-items: start;
        }

        .rec-record,
        .rec-state-panel {
          overflow: hidden;
          border: 1px solid var(--line);
          border-radius: 24px;
          background: rgba(255,255,255,.024);
        }

        .rec-record-head,
        .rec-state-head {
          padding: 22px 24px 20px;
          border-bottom: 1px solid var(--line);
        }

        .rec-record-head {
          background:
            radial-gradient(circle at 100% 0%, rgba(69,234,166,.07), transparent 42%),
            rgba(255,255,255,.01);
        }

        .rec-state-head {
          background:
            radial-gradient(circle at 100% 0%, rgba(84,232,255,.07), transparent 42%),
            rgba(255,255,255,.01);
        }

        .rec-panel-kicker {
          color: var(--green);
          font-size: .56rem;
          font-weight: 950;
          letter-spacing: .14em;
          text-transform: uppercase;
        }

        .rec-state-panel .rec-panel-kicker {
          color: var(--cyan);
        }

        .rec-record h2,
        .rec-state-panel h2 {
          margin: 8px 0 0;
          font-size: 1.75rem;
          line-height: 1.08;
          letter-spacing: -.035em;
        }

        .rec-record-head p,
        .rec-state-head p {
          margin: 10px 0 0;
          color: var(--muted);
          font-size: .70rem;
          line-height: 1.6;
        }

        .rec-record-body,
        .rec-state-body {
          padding: 20px 22px 22px;
        }

        .rec-field-list {
          display: grid;
          gap: 14px;
        }

        .rec-field {
          display: block;
          padding: 16px;
          border: 1px solid var(--line);
          border-radius: 16px;
          background: rgba(0,0,0,.10);
          transition: 160ms ease;
        }

        .rec-field.active {
          border-color: rgba(69,234,166,.28);
          background:
            radial-gradient(circle at 100% 0%, rgba(69,234,166,.06), transparent 42%),
            rgba(69,234,166,.025);
        }

        .rec-field.done {
          box-shadow: inset 2px 0 0 rgba(84,232,255,.30);
        }

        .rec-field-head {
          display: grid;
          grid-template-columns: 42px 1fr;
          gap: 12px;
          align-items: start;
        }

        .rec-field-number {
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(84,232,255,.20);
          border-radius: 50%;
          background: rgba(84,232,255,.055);
          color: var(--cyanSoft);
          font-size: .58rem;
          font-weight: 950;
        }

        .rec-field h3 {
          margin: 0;
          font-size: .82rem;
        }

        .rec-field p {
          margin: 5px 0 0;
          color: var(--muted);
          font-size: .64rem;
          line-height: 1.55;
        }

        .rec-textarea {
          width: 100%;
          min-height: 104px;
          margin-top: 12px;
          padding: 11px 12px;
          resize: vertical;
          border: 1px solid var(--line);
          border-radius: 11px;
          background: #07111e;
          color: var(--text);
          outline: none;
          font-size: .67rem;
          line-height: 1.6;
        }

        .rec-textarea:focus {
          border-color: rgba(69,234,166,.36);
          box-shadow: 0 0 0 3px rgba(69,234,166,.06);
        }

        .rec-constraint {
          margin-top: 14px;
          border-color: rgba(241,199,105,.18);
        }

        .rec-constraint .rec-field-number {
          border-color: rgba(241,199,105,.20);
          background: rgba(241,199,105,.055);
          color: var(--amberSoft);
        }

        .rec-state-panel {
          position: sticky;
          top: 22px;
        }

        .rec-live-stage {
          display: grid;
          gap: 10px;
        }

        .rec-state-block {
          padding: 14px;
          border: 1px solid var(--line);
          border-radius: 14px;
          background: rgba(0,0,0,.10);
        }

        .rec-state-block.ready {
          border-color: rgba(84,232,255,.18);
          background: rgba(84,232,255,.025);
        }

        .rec-state-block small {
          display: block;
          color: var(--dim);
          font-size: .49rem;
          font-weight: 950;
          letter-spacing: .10em;
          text-transform: uppercase;
        }

        .rec-state-block p {
          margin: 7px 0 0;
          color: var(--muted);
          font-size: .65rem;
          line-height: 1.55;
        }

        .rec-state-block.ready p {
          color: #dceaf4;
        }

        .rec-active-focus {
          margin-top: 18px;
          overflow: hidden;
          border: 1px solid rgba(69,234,166,.16);
          border-radius: 15px;
          background: rgba(69,234,166,.03);
        }

        .rec-active-focus-head {
          padding: 12px 14px;
          border-bottom: 1px solid rgba(69,234,166,.11);
          color: var(--green);
          font-size: .50rem;
          font-weight: 950;
          letter-spacing: .10em;
          text-transform: uppercase;
        }

        .rec-active-focus-body {
          padding: 14px;
        }

        .rec-active-focus-body strong {
          display: block;
          font-size: .74rem;
        }

        .rec-active-focus-body p {
          margin: 7px 0 0;
          color: var(--muted);
          font-size: .64rem;
          line-height: 1.55;
        }

        .rec-canon {
          margin-top: 18px;
          overflow: hidden;
          border: 1px solid var(--line);
          border-radius: 15px;
          background: rgba(0,0,0,.10);
        }

        .rec-canon-head {
          padding: 12px 14px;
          border-bottom: 1px solid var(--line);
          color: var(--dim);
          font-size: .50rem;
          font-weight: 950;
          letter-spacing: .10em;
          text-transform: uppercase;
        }

        .rec-canon-list {
          display: grid;
          gap: 8px;
          padding: 12px;
        }

        .rec-canon-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          min-height: 42px;
          padding: 0 11px;
          border: 1px solid var(--line);
          border-radius: 10px;
          background: rgba(255,255,255,.018);
          color: #dceaf4;
          font-size: .61rem;
          font-weight: 850;
          text-decoration: none;
          transition: 150ms ease;
        }

        .rec-canon-link:hover {
          transform: translateX(2px);
          border-color: rgba(84,232,255,.22);
          background: rgba(84,232,255,.03);
        }

        .rec-canon-link span:last-child {
          color: var(--cyan);
        }

        .rec-doctrine {
          border-top: 1px solid var(--line);
          border-bottom: 1px solid var(--line);
          background: rgba(4,12,20,.72);
        }

        .rec-doctrine-grid {
          display: grid;
          grid-template-columns: minmax(0, .86fr) minmax(0, 1.14fr);
          gap: 34px;
          align-items: start;
          padding: 72px 0;
        }

        .rec-doctrine h2 {
          margin: 9px 0 0;
          font-size: clamp(2rem, 3.4vw, 3.4rem);
          line-height: 1.04;
          letter-spacing: -.045em;
        }

        .rec-doctrine p {
          margin: 18px 0 0;
          color: var(--muted);
          font-size: .78rem;
          line-height: 1.75;
        }

        .rec-doctrine-cards {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 11px;
        }

        .rec-doctrine-card {
          min-height: 148px;
          padding: 16px;
          border: 1px solid var(--line);
          border-radius: 15px;
          background: rgba(255,255,255,.022);
        }

        .rec-doctrine-card b {
          color: var(--amber);
          font-size: .56rem;
          letter-spacing: .12em;
        }

        .rec-doctrine-card strong {
          display: block;
          margin-top: 8px;
          font-size: .76rem;
        }

        .rec-doctrine-card span {
          display: block;
          margin-top: 7px;
          color: var(--muted);
          font-size: .64rem;
          line-height: 1.55;
        }

        .rec-warning {
          margin-top: 18px;
          overflow: hidden;
          border: 1px solid rgba(241,199,105,.18);
          border-radius: 16px;
          background: rgba(241,199,105,.035);
        }

        .rec-warning-head {
          padding: 13px 15px;
          border-bottom: 1px solid rgba(241,199,105,.12);
          color: var(--amber);
          font-size: .52rem;
          font-weight: 950;
          letter-spacing: .10em;
          text-transform: uppercase;
        }

        .rec-warning-body {
          padding: 15px;
        }

        .rec-warning-body strong {
          display: block;
          color: var(--amberSoft);
          font-size: .76rem;
        }

        .rec-warning-body p {
          margin: 7px 0 0;
          color: #d8d1bb;
          font-size: .66rem;
          line-height: 1.6;
        }

        .rec-close {
          padding: 76px 0 98px;
          text-align: center;
        }

        .rec-close h2 {
          max-width: 920px;
          margin: 10px auto 0;
          font-size: clamp(2.3rem, 4.2vw, 4.6rem);
          line-height: 1;
          letter-spacing: -.05em;
        }

        .rec-close p {
          max-width: 760px;
          margin: 18px auto 0;
          color: var(--muted);
          font-size: .76rem;
          line-height: 1.7;
        }

        .rec-close-actions {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 10px;
          margin-top: 26px;
        }

        .rec-button {
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

        .rec-button.primary {
          border-color: rgba(69,234,166,.24);
          background: rgba(69,234,166,.065);
          color: var(--greenSoft);
        }

        .rec-button:hover {
          transform: translateY(-2px);
          border-color: var(--lineStrong);
        }

        @media (max-width: 1180px) {
          .rec-hero-grid {
            grid-template-columns: 1fr;
          }

          .rec-orbit {
            max-width: 500px;
          }

          .rec-stage-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }

          .rec-workspace {
            grid-template-columns: 1fr;
          }

          .rec-state-panel {
            position: static;
          }
        }

        @media (max-width: 900px) {
          .rec-shell {
            width: min(100% - 28px, 1460px);
          }

          .rec-topline,
          .rec-section-head {
            display: grid;
            align-items: start;
          }

          .rec-title {
            font-size: clamp(2.8rem, 13vw, 4.8rem);
          }

          .rec-metric-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .rec-metric {
            border-bottom: 1px solid var(--line);
          }

          .rec-metric:nth-child(2n) {
            border-right: 0;
          }

          .rec-stage-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .rec-doctrine-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 640px) {
          .rec-stage-grid,
          .rec-doctrine-cards {
            grid-template-columns: 1fr;
          }

          .rec-node {
            display: none;
          }

          .rec-close-actions {
            display: grid;
          }
        }
      `}</style>

      <section className="rec-hero">
        <div className="rec-shell rec-topline">
          <Link
            href="/academy/24-link-architecture"
            className="rec-back"
          >
            ← Back to 24-Link Explorer
          </Link>

          <span className="rec-badge">
            Recursion Lab · Outcome → Future Chain
          </span>
        </div>

        <div className="rec-shell rec-hero-grid">
          <div>
            <div className="rec-kicker">
              TA-14 Academy · Recursion Lab
            </div>

            <h1 className="rec-title">
              Outcome Does Not
              <span>End the Chain.</span>
            </h1>

            <p className="rec-lead">
              Govern the transition from what happened to what becomes true
              next. The closing links preserve post-action reality, determine
              the outcome, establish the new reality, retain controlled memory,
              and define the conditions for the future chain.
            </p>

            <div className="rec-rules">
              <span className="rec-rule">Observe actual outcome reality</span>
              <span className="rec-rule">Classify governed result</span>
              <span className="rec-rule">Establish New Reality</span>
              <span className="rec-rule">Preserve controlled Memory</span>
              <span className="rec-rule">Govern Future Chain entry</span>
            </div>
          </div>

          <div
            className="rec-orbit"
            aria-label="TA-14 recursion architecture motif"
          >
            <div className="rec-ring r1" />
            <div className="rec-ring r2" />
            <div className="rec-ring r3" />
            <div className="rec-ring r4" />
            <div className="rec-axis-h" />
            <div className="rec-axis-v" />

            <div className="rec-core">
              <div>
                <small>RECURSION STATE</small>
                <strong>{completed}/5</strong>
                <span>closing stages described</span>
              </div>
            </div>

            <div className="rec-node n1">
              <b>20</b>
              <span>Outcome Reality</span>
            </div>
            <div className="rec-node n2">
              <b>21</b>
              <span>Outcome</span>
            </div>
            <div className="rec-node n3">
              <b>22</b>
              <span>New Reality</span>
            </div>
            <div className="rec-node n4">
              <b>23</b>
              <span>Memory</span>
            </div>
            <div className="rec-node n5">
              <b>24</b>
              <span>Future Chain</span>
            </div>
          </div>
        </div>
      </section>

      <section className="rec-metrics">
        <div className="rec-shell rec-metric-grid">
          <Metric value={`${completed}/5`} label="Recursion stages described" />
          <Metric value={`${completion}%`} label="Recursion completion" />
          <Metric value={activeLink ? String(activeLink.order) : "20"} label="Active closing link" />
          <Metric value={hasInheritedConstraints ? "Defined" : "Open"} label="Inherited constraints" />
          <Metric value="1" label="Next governed cycle" />
        </div>
      </section>

      <section className="rec-section alt">
        <div className="rec-shell">
          <div className="rec-section-head">
            <div>
              <div
                className="rec-eyebrow"
                style={{ color: "var(--green)" }}
              >
                Closing architecture
              </div>

              <h2 className="rec-h2">
                Five stages convert consequence into the next governed reality.
              </h2>
            </div>

            <p className="rec-section-copy">
              Select any closing link to focus the lab. These five states are
              not an appendix to execution; they determine what the next chain
              is allowed to inherit.
            </p>
          </div>

          <div className="rec-stage-grid">
            {recursionLinks.map((item) => {
              const field = RECURSION_FIELDS.find(
                (candidate) => Number(candidate.number) === item.order,
              );

              const value =
                field && field.key !== "inheritedConstraints"
                  ? record[field.key]
                  : "";

              const done = value.trim().length > 0;

              return (
                <button
                  key={item.linkId}
                  type="button"
                  onClick={() => setActiveOrder(item.order)}
                  className={[
                    "rec-stage",
                    activeOrder === item.order ? "active" : "",
                    done ? "done" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <div className="rec-stage-top">
                    <span className="rec-stage-index">
                      {String(item.order).padStart(2, "0")}
                    </span>

                    <span className="rec-stage-state">
                      {done ? "Described" : "Open"}
                    </span>
                  </div>

                  <h3>{item.canonicalName}</h3>
                  <p>{item.governingQuestion}</p>

                  <span className="rec-stage-action">
                    {activeOrder === item.order
                      ? "Active recursion coordinate"
                      : "Focus this stage →"}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="rec-progress">
            <div className="rec-progress-head">
              <small>Recursion completion</small>
              <strong>{completion}%</strong>
            </div>

            <div className="rec-progress-body">
              <div className="rec-progress-track">
                <div
                  className="rec-progress-fill"
                  style={{ width: `${completion}%` }}
                />
              </div>

              <div className="rec-progress-note">
                {completed}/5 recursion stages described · Future Chain inherits
                governed New Reality + Memory.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="rec-section">
        <div className="rec-shell">
          <div className="rec-section-head">
            <div>
              <div className="rec-eyebrow">
                Post-action record
              </div>

              <h2 className="rec-h2">
                Convert consequence into governed future state.
              </h2>
            </div>

            <p className="rec-section-copy">
              Describe the state that actually exists now, the governed
              classification of what happened, what changed, what must be
              remembered, and what is allowed to trigger the next cycle.
            </p>
          </div>

          <div className="rec-workspace">
            <section className="rec-record">
              <div className="rec-record-head">
                <div className="rec-panel-kicker">
                  Recursion record
                </div>

                <h2>
                  Outcome Reality → Future Chain
                </h2>

                <p>
                  Complete the closing states without allowing the next chain
                  to inherit assumptions from the old world.
                </p>
              </div>

              <div className="rec-record-body">
                <div className="rec-field-list">
                  {RECURSION_FIELDS.map((field) => {
                    const numericOrder = Number(field.number);
                    const done = record[field.key].trim().length > 0;

                    return (
                      <RecursionField
                        key={field.key}
                        number={field.number}
                        title={field.title}
                        prompt={field.prompt}
                        value={record[field.key]}
                        active={activeOrder === numericOrder}
                        done={done}
                        onFocus={() => setActiveOrder(numericOrder)}
                        onChange={(value) => update(field.key, value)}
                      />
                    );
                  })}

                  <RecursionField
                    number="→"
                    title="Inherited Constraints"
                    prompt="What constraints, unresolved challenges, or prior determinations must the next chain carry forward?"
                    value={record.inheritedConstraints}
                    active={false}
                    done={hasInheritedConstraints}
                    constraint
                    onChange={(value) =>
                      update("inheritedConstraints", value)
                    }
                  />
                </div>
              </div>
            </section>

            <aside className="rec-state-panel">
              <div className="rec-state-head">
                <div className="rec-panel-kicker">
                  Recursion state
                </div>

                <h2>
                  What the next chain currently knows.
                </h2>

                <p>
                  This mirror makes missing closing states visible before
                  Future Chain is allowed to inherit them.
                </p>
              </div>

              <div className="rec-state-body">
                <div className="rec-live-stage">
                  {RECURSION_FIELDS.map((field) => (
                    <StateBlock
                      key={field.key}
                      label={field.stateLabel}
                      value={record[field.key]}
                      empty={field.empty}
                    />
                  ))}
                </div>

                <div className="rec-active-focus">
                  <div className="rec-active-focus-head">
                    Active closing coordinate
                  </div>

                  <div className="rec-active-focus-body">
                    <strong>
                      {activeLink
                        ? `${String(activeLink.order).padStart(2, "0")} ${activeLink.canonicalName}`
                        : "20 Outcome Reality"}
                    </strong>

                    <p>
                      {activeLink?.governingQuestion ??
                        "What real state exists after execution or non-execution?"}
                    </p>
                  </div>
                </div>

                <div className="rec-canon">
                  <div className="rec-canon-head">
                    Canon links
                  </div>

                  <div className="rec-canon-list">
                    {recursionLinks.map((item) => (
                      <Link
                        key={item.linkId}
                        href={`/academy/24-link-architecture/${String(
                          item.order,
                        ).padStart(2, "0")}-${item.slug}`}
                        className="rec-canon-link"
                      >
                        <span>
                          {String(item.order).padStart(2, "0")}{" "}
                          {item.canonicalName}
                        </span>

                        <span>→</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="rec-doctrine">
        <div className="rec-shell rec-doctrine-grid">
          <div>
            <div
              className="rec-eyebrow"
              style={{ color: "var(--amber)" }}
            >
              Recursion doctrine
            </div>

            <h2>
              Every governed outcome changes what the next chain is allowed to assume.
            </h2>

            <p>
              A later workflow should not restart from the old world. It must
              inherit the New Reality actually created by the prior chain and
              the governed Memory preserved from that chain.
            </p>

            <div className="rec-warning">
              <div className="rec-warning-head">
                No uncontrolled recurrence
              </div>

              <div className="rec-warning-body">
                <strong>
                  Future Chain does not begin merely because another workflow is ready.
                </strong>

                <p>
                  Its trigger, inherited state, memory references, and
                  constraints must be explicit enough to govern before the next
                  consequence-bearing route begins.
                </p>
              </div>
            </div>
          </div>

          <div className="rec-doctrine-cards">
            <DoctrineCard
              code="20"
              title="Observe the state that actually exists"
              text="Outcome Reality is grounded in the post-action or post-non-occurrence world, not in the intended result."
            />

            <DoctrineCard
              code="21"
              title="Classify the governed result"
              text="Outcome determines what the chain actually produced and whether that result remained within the intended and permitted consequence."
            />

            <DoctrineCard
              code="22"
              title="Establish New Reality"
              text="The next decision must begin from the changed world created by the prior chain rather than from its old starting assumptions."
            />

            <DoctrineCard
              code="23–24"
              title="Preserve Memory and govern recurrence"
              text="Controlled Memory carries forward only governed knowledge, while Future Chain requires explicit entry conditions and inherited constraints."
            />
          </div>
        </div>
      </section>

      <section className="rec-section alt">
        <div className="rec-shell">
          <div className="rec-section-head">
            <div>
              <div
                className="rec-eyebrow"
                style={{ color: "var(--green)" }}
              >
                Academy requirement
              </div>

              <h2 className="rec-h2">
                Advanced scenarios should continue beyond Outcome.
              </h2>
            </div>

            <p className="rec-section-copy">
              Learners should be required to observe Outcome Reality, classify
              Outcome, update New Reality, determine what enters Memory,
              identify conflict or supersession, and define Future Chain entry
              conditions.
            </p>
          </div>

          <div className="rec-doctrine-cards">
            <DoctrineCard
              code="A1"
              title="Do not stop at execution"
              text="Execution is a transition into consequence, not the end of governance."
            />

            <DoctrineCard
              code="A2"
              title="Do not stop at outcome classification"
              text="Outcome must still become New Reality before another governed decision begins."
            />

            <DoctrineCard
              code="A3"
              title="Do not preserve uncontrolled memory"
              text="Conflicted, superseded, or unsupported memory should not silently seed the next chain."
            />

            <DoctrineCard
              code="A4"
              title="Do not allow automatic recurrence"
              text="Future Chain requires an admissible entry trigger, inherited constraints, and governed continuity."
            />
          </div>
        </div>
      </section>

      <section className="rec-close">
        <div className="rec-shell">
          <div
            className="rec-eyebrow"
            style={{ color: "var(--green)" }}
          >
            Close one chain. Govern the next.
          </div>

          <h2>
            Outcome changes reality.
            <br />
            Reality governs recurrence.
          </h2>

          <p>
            The Recursion Lab exists so TA-14 is never taught as a one-way
            compliance checklist. Every consequence-bearing route must leave
            behind a governed reality, a governed memory, and governed
            conditions for whatever comes next.
          </p>

          <div className="rec-close-actions">
            <Link
              href="/academy/24-link-architecture"
              className="rec-button primary"
            >
              Return to 24-Link Explorer →
            </Link>

            <Link
              href="/academy/24-link-architecture/24-future-chain"
              className="rec-button"
            >
              Study Future Chain
            </Link>

            <Link
              href="/academy/24-link-architecture/views"
              className="rec-button"
            >
              Open Architecture Navigator
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
    <div className="rec-metric">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function RecursionField({
  number,
  title,
  prompt,
  value,
  active,
  done,
  constraint = false,
  onFocus,
  onChange,
}: {
  number: string;
  title: string;
  prompt: string;
  value: string;
  active: boolean;
  done: boolean;
  constraint?: boolean;
  onFocus?: () => void;
  onChange: (value: string) => void;
}) {
  return (
    <label
      className={[
        "rec-field",
        active ? "active" : "",
        done ? "done" : "",
        constraint ? "rec-constraint" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="rec-field-head">
        <span className="rec-field-number">
          {number}
        </span>

        <div>
          <h3>{title}</h3>
          <p>{prompt}</p>
        </div>
      </div>

      <textarea
        value={value}
        onFocus={onFocus}
        onChange={(event) => onChange(event.target.value)}
        rows={3}
        className="rec-textarea"
      />
    </label>
  );
}

function StateBlock({
  label,
  value,
  empty,
}: {
  label: string;
  value: string;
  empty: string;
}) {
  const ready = value.trim().length > 0;

  return (
    <div
      className={[
        "rec-state-block",
        ready ? "ready" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <small>{label}</small>
      <p>{ready ? value : empty}</p>
    </div>
  );
}

function DoctrineCard({
  code,
  title,
  text,
}: {
  code: string;
  title: string;
  text: string;
}) {
  return (
    <article className="rec-doctrine-card">
      <b>{code}</b>
      <strong>{title}</strong>
      <span>{text}</span>
    </article>
  );
}
