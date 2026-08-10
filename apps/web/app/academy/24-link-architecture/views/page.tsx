"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import {
  TA14_24_LINKS,
  TA14_ARCHITECTURE_REGIONS,
} from "@/lib/academy/ta14-24-link-canon";

type ViewMode =
  | "chain"
  | "dependency"
  | "evidence"
  | "failure"
  | "academy"
  | "chronology";

const VIEWS: readonly {
  id: ViewMode;
  label: string;
  short: string;
  code: string;
  description: string;
}[] = [
  {
    id: "chain",
    label: "Chain View",
    short: "Chain",
    code: "01",
    description: "See the canonical 24-link route in execution order.",
  },
  {
    id: "dependency",
    label: "Dependency View",
    short: "Dependency",
    code: "02",
    description:
      "See what each link depends on before progression is supportable.",
  },
  {
    id: "evidence",
    label: "Evidence View",
    short: "Evidence",
    code: "03",
    description:
      "See the evidence burden and proof object associated with every link.",
  },
  {
    id: "failure",
    label: "Failure View",
    short: "Failure",
    code: "04",
    description:
      "See the failure modes that can break or hold the governed route.",
  },
  {
    id: "academy",
    label: "Academy View",
    short: "Academy",
    code: "05",
    description: "Enter the canonical lesson for any link.",
  },
  {
    id: "chronology",
    label: "Chronology View",
    short: "Chronology",
    code: "06",
    description:
      "Preserve the May 1, 2025 Chain-of-Eight origin and later 24-link expansion.",
  },
];

export default function TA14ArchitectureViewsPage() {
  const [view, setView] = useState<ViewMode>("chain");

  const active = useMemo(
    () => VIEWS.find((item) => item.id === view) ?? VIEWS[0],
    [view],
  );

  return (
    <main className="nav24">
      <style>{`
        .nav24 {
          --bg: #020711;
          --panel: rgba(8, 20, 32, .86);
          --panel-2: rgba(10, 26, 40, .76);
          --line: rgba(129, 176, 210, .14);
          --line-strong: rgba(84, 232, 255, .26);
          --cyan: #54e8ff;
          --cyan-soft: #c4f8ff;
          --indigo: #a8b2ff;
          --indigo-soft: #e0e4ff;
          --green: #45eaa6;
          --green-soft: #c8f7df;
          --amber: #f1c769;
          --amber-soft: #ffe8aa;
          --rose: #ff96ad;
          --rose-soft: #ffd1dc;
          --text: #eff8ff;
          --muted: #93a8ba;
          --dim: #647b8f;
          min-height: 100vh;
          overflow: hidden;
          color: var(--text);
          background:
            radial-gradient(circle at 10% 0%, rgba(168,178,255,.12), transparent 24%),
            radial-gradient(circle at 92% 5%, rgba(84,232,255,.09), transparent 25%),
            linear-gradient(180deg, #020711 0%, #030a13 55%, #020711 100%);
        }

        .nav24 * {
          box-sizing: border-box;
        }

        .nav24-shell {
          width: min(1460px, calc(100% - 48px));
          margin: 0 auto;
        }

        .nav24-hero {
          position: relative;
          overflow: hidden;
          border-bottom: 1px solid var(--line);
        }

        .nav24-hero::before {
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

        .nav24-topline {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          padding-top: 20px;
        }

        .nav24-back {
          color: var(--cyan-soft);
          font-size: .72rem;
          font-weight: 900;
          text-decoration: none;
        }

        .nav24-badge {
          display: inline-flex;
          align-items: center;
          min-height: 34px;
          padding: 0 12px;
          border: 1px solid rgba(168,178,255,.20);
          border-radius: 999px;
          background: rgba(168,178,255,.05);
          color: var(--indigo-soft);
          font-size: .56rem;
          font-weight: 950;
          letter-spacing: .12em;
          text-transform: uppercase;
        }

        .nav24-hero-grid {
          position: relative;
          display: grid;
          grid-template-columns: minmax(0, 1.08fr) minmax(420px, .92fr);
          gap: 64px;
          align-items: center;
          padding: 72px 0 84px;
        }

        .nav24-kicker {
          color: var(--indigo);
          font-size: .64rem;
          font-weight: 950;
          letter-spacing: .20em;
          text-transform: uppercase;
        }

        .nav24-title {
          max-width: 980px;
          margin: 14px 0 0;
          font-size: clamp(3.2rem, 6vw, 6.2rem);
          line-height: .95;
          letter-spacing: -.06em;
        }

        .nav24-title span {
          display: block;
          color: var(--indigo-soft);
        }

        .nav24-lead {
          max-width: 900px;
          margin: 26px 0 0;
          color: #c8d8e4;
          font-size: clamp(1rem, 1.35vw, 1.18rem);
          line-height: 1.8;
        }

        .nav24-rules {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 24px;
        }

        .nav24-rule {
          padding: 7px 10px;
          border: 1px solid var(--line);
          border-radius: 999px;
          background: rgba(255,255,255,.026);
          color: var(--muted);
          font-size: .56rem;
          font-weight: 850;
        }

        .nav24-orbit {
          position: relative;
          width: min(510px, 100%);
          aspect-ratio: 1;
          margin: 0 auto;
        }

        .nav24-ring {
          position: absolute;
          inset: 50% auto auto 50%;
          transform: translate(-50%, -50%);
          border: 1px solid rgba(129,176,210,.10);
          border-radius: 50%;
        }

        .nav24-ring.r1 {
          width: 96%;
          height: 96%;
        }

        .nav24-ring.r2 {
          width: 76%;
          height: 76%;
          border-color: rgba(168,178,255,.14);
        }

        .nav24-ring.r3 {
          width: 56%;
          height: 56%;
          border-color: rgba(84,232,255,.12);
        }

        .nav24-ring.r4 {
          width: 36%;
          height: 36%;
          border-color: rgba(69,234,166,.12);
        }

        .nav24-axis-h,
        .nav24-axis-v {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }

        .nav24-axis-h {
          width: 88%;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(168,178,255,.16),
            transparent
          );
        }

        .nav24-axis-v {
          width: 1px;
          height: 88%;
          background: linear-gradient(
            180deg,
            transparent,
            rgba(84,232,255,.13),
            transparent
          );
        }

        .nav24-core {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 182px;
          height: 182px;
          transform: translate(-50%, -50%);
          display: grid;
          place-items: center;
          border: 1px solid rgba(168,178,255,.27);
          border-radius: 50%;
          background:
            radial-gradient(circle at 30% 25%, rgba(168,178,255,.13), transparent 44%),
            rgba(5,16,27,.95);
          box-shadow: 0 0 90px rgba(168,178,255,.09);
          text-align: center;
        }

        .nav24-core small {
          display: block;
          color: var(--indigo);
          font-size: .58rem;
          font-weight: 950;
          letter-spacing: .18em;
        }

        .nav24-core strong {
          display: block;
          margin-top: 5px;
          font-size: 3.4rem;
          line-height: 1;
          letter-spacing: -.06em;
        }

        .nav24-core span {
          display: block;
          margin-top: 7px;
          color: var(--muted);
          font-size: .64rem;
        }

        .nav24-node {
          position: absolute;
          min-width: 116px;
          padding: 10px 12px;
          border: 1px solid var(--line);
          border-radius: 13px;
          background: rgba(5,16,27,.92);
          box-shadow: 0 12px 34px rgba(0,0,0,.24);
        }

        .nav24-node b {
          display: block;
          color: var(--indigo);
          font-size: .55rem;
          letter-spacing: .12em;
        }

        .nav24-node span {
          display: block;
          margin-top: 4px;
          color: #d7e5ef;
          font-size: .66rem;
          font-weight: 850;
        }

        .nav24-node.n1 {
          left: 0;
          top: 18%;
        }

        .nav24-node.n2 {
          right: 0;
          top: 24%;
        }

        .nav24-node.n3 {
          right: 4%;
          bottom: 18%;
        }

        .nav24-node.n4 {
          left: 0;
          bottom: 18%;
        }

        .nav24-node.n5 {
          left: 50%;
          top: 0;
          transform: translateX(-50%);
        }

        .nav24-metrics {
          border-bottom: 1px solid var(--line);
          background: rgba(4,12,20,.76);
        }

        .nav24-metric-grid {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
        }

        .nav24-metric {
          min-height: 98px;
          padding: 20px;
          border-right: 1px solid var(--line);
        }

        .nav24-metric:last-child {
          border-right: 0;
        }

        .nav24-metric strong {
          display: block;
          font-size: 2rem;
          line-height: 1;
          letter-spacing: -.04em;
        }

        .nav24-metric span {
          display: block;
          margin-top: 8px;
          color: var(--dim);
          font-size: .58rem;
          font-weight: 900;
          letter-spacing: .10em;
          text-transform: uppercase;
        }

        .nav24-section {
          padding: 72px 0 90px;
        }

        .nav24-section.alt {
          border-top: 1px solid var(--line);
          border-bottom: 1px solid var(--line);
          background: rgba(4,12,20,.66);
        }

        .nav24-section-head {
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: 28px;
          margin-bottom: 28px;
        }

        .nav24-eyebrow {
          color: var(--cyan);
          font-size: .62rem;
          font-weight: 950;
          letter-spacing: .16em;
          text-transform: uppercase;
        }

        .nav24-h2 {
          margin: 9px 0 0;
          font-size: clamp(2rem, 3.4vw, 3.7rem);
          line-height: 1;
          letter-spacing: -.045em;
        }

        .nav24-section-copy {
          max-width: 620px;
          margin: 0;
          color: var(--muted);
          font-size: .78rem;
          line-height: 1.7;
        }

        .nav24-view-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
        }

        .nav24-view {
          min-height: 190px;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          gap: 14px;
          padding: 18px;
          border: 1px solid var(--line);
          border-radius: 18px;
          background: rgba(255,255,255,.024);
          color: var(--text);
          text-align: left;
          cursor: pointer;
          transition: 170ms ease;
        }

        .nav24-view:hover {
          transform: translateY(-3px);
          border-color: rgba(168,178,255,.26);
          background: rgba(168,178,255,.035);
        }

        .nav24-view.active {
          border-color: rgba(168,178,255,.38);
          background:
            radial-gradient(circle at 100% 0%, rgba(168,178,255,.10), transparent 44%),
            rgba(168,178,255,.05);
        }

        .nav24-view::before {
          content: "";
          position: absolute;
          inset: 0 0 auto 0;
          height: 2px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(168,178,255,.55),
            transparent
          );
          opacity: 0;
          transition: 170ms ease;
        }

        .nav24-view.active::before {
          opacity: 1;
        }

        .nav24-view-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 10px;
        }

        .nav24-view-code {
          color: var(--indigo);
          font-size: .57rem;
          font-weight: 950;
          letter-spacing: .12em;
        }

        .nav24-view-index {
          color: rgba(255,255,255,.10);
          font-size: 2.7rem;
          line-height: .9;
          font-weight: 950;
        }

        .nav24-view h3 {
          margin: 0;
          font-size: 1.02rem;
          line-height: 1.3;
        }

        .nav24-view p {
          margin: 0;
          color: var(--muted);
          font-size: .68rem;
          line-height: 1.6;
        }

        .nav24-view-action {
          margin-top: auto;
          padding-top: 13px;
          border-top: 1px solid var(--line);
          color: var(--indigo-soft);
          font-size: .60rem;
          font-weight: 900;
        }

        .nav24-console {
          overflow: hidden;
          border: 1px solid var(--line);
          border-radius: 24px;
          background: rgba(255,255,255,.024);
        }

        .nav24-console-head {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 22px;
          align-items: center;
          padding: 22px 24px 20px;
          border-bottom: 1px solid var(--line);
          background:
            radial-gradient(circle at 100% 0%, rgba(168,178,255,.07), transparent 42%),
            rgba(255,255,255,.01);
        }

        .nav24-console-head small {
          display: block;
          color: var(--indigo);
          font-size: .56rem;
          font-weight: 950;
          letter-spacing: .13em;
          text-transform: uppercase;
        }

        .nav24-console-head h2 {
          margin: 8px 0 0;
          font-size: 1.75rem;
          line-height: 1.08;
          letter-spacing: -.035em;
        }

        .nav24-console-head p {
          margin: 9px 0 0;
          color: var(--muted);
          font-size: .70rem;
          line-height: 1.6;
        }

        .nav24-console-pill {
          display: inline-flex;
          align-items: center;
          min-height: 34px;
          padding: 0 11px;
          border: 1px solid rgba(84,232,255,.16);
          border-radius: 999px;
          background: rgba(84,232,255,.04);
          color: var(--cyan-soft);
          font-size: .55rem;
          font-weight: 950;
          letter-spacing: .09em;
          text-transform: uppercase;
        }

        .nav24-console-body {
          padding: 20px;
        }

        .nav24-region-stack {
          display: grid;
          gap: 16px;
        }

        .nav24-region {
          overflow: hidden;
          border: 1px solid var(--line);
          border-radius: 20px;
          background: rgba(0,0,0,.08);
        }

        .nav24-region-head {
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: 18px;
          padding: 17px 18px;
          border-bottom: 1px solid var(--line);
          background:
            radial-gradient(circle at 100% 0%, rgba(84,232,255,.04), transparent 44%),
            rgba(255,255,255,.01);
        }

        .nav24-region-head small {
          display: block;
          color: var(--cyan);
          font-size: .51rem;
          font-weight: 950;
          letter-spacing: .11em;
          text-transform: uppercase;
        }

        .nav24-region-head h3 {
          margin: 6px 0 0;
          font-size: 1.15rem;
          line-height: 1.2;
        }

        .nav24-region-count {
          color: var(--dim);
          font-size: .58rem;
          font-weight: 850;
        }

        .nav24-link-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 10px;
          padding: 14px;
        }

        .nav24-card {
          min-height: 244px;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          gap: 13px;
          padding: 16px;
          border: 1px solid var(--line);
          border-radius: 16px;
          background: rgba(255,255,255,.018);
          transition: 160ms ease;
        }

        .nav24-card:hover {
          transform: translateY(-2px);
          border-color: rgba(84,232,255,.23);
          background:
            radial-gradient(circle at 100% 0%, rgba(84,232,255,.05), transparent 44%),
            rgba(84,232,255,.026);
        }

        .nav24-card-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 10px;
        }

        .nav24-card-index {
          color: var(--cyan);
          font-size: .58rem;
          font-weight: 950;
          letter-spacing: .10em;
        }

        .nav24-card-anchor {
          max-width: 112px;
          padding: 5px 7px;
          border: 1px solid var(--line);
          border-radius: 999px;
          color: var(--dim);
          font-size: .46rem;
          font-weight: 900;
          text-align: center;
        }

        .nav24-card h4 {
          margin: 0;
          font-size: 1rem;
          line-height: 1.26;
          letter-spacing: -.015em;
        }

        .nav24-content {
          margin-top: 2px;
        }

        .nav24-content p {
          margin: 0;
          color: var(--muted);
          font-size: .67rem;
          line-height: 1.62;
        }

        .nav24-mini-label {
          display: block;
          color: var(--dim);
          font-size: .49rem;
          font-weight: 950;
          letter-spacing: .10em;
          text-transform: uppercase;
        }

        .nav24-dependencies {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 9px;
        }

        .nav24-dependency {
          padding: 5px 7px;
          border: 1px solid var(--line);
          border-radius: 999px;
          background: rgba(255,255,255,.025);
          color: #dceaf4;
          font-size: .52rem;
          font-weight: 850;
        }

        .nav24-transition {
          margin-top: 12px !important;
          padding-top: 12px;
          border-top: 1px solid var(--line);
        }

        .nav24-proof {
          margin-top: 9px !important;
          color: #dceaf4 !important;
        }

        .nav24-evidence-list,
        .nav24-failure-list {
          display: grid;
          gap: 7px;
          margin: 11px 0 0;
          padding: 0;
          list-style: none;
        }

        .nav24-evidence-list li,
        .nav24-failure-list li {
          display: grid;
          grid-template-columns: 16px 1fr;
          gap: 7px;
          align-items: start;
          color: var(--muted);
          font-size: .62rem;
          line-height: 1.5;
        }

        .nav24-evidence-list li::before {
          content: "•";
          color: var(--green);
          font-weight: 950;
        }

        .nav24-failure-list li::before {
          content: "×";
          color: var(--rose);
          font-weight: 950;
        }

        .nav24-hold-rule {
          margin-top: 12px !important;
          padding-top: 12px;
          border-top: 1px solid rgba(255,150,173,.11);
          color: #d8c4c8 !important;
        }

        .nav24-academy-task {
          color: #dceaf4 !important;
        }

        .nav24-open {
          display: inline-flex;
          margin-top: 13px;
          color: var(--cyan);
          font-size: .63rem;
          font-weight: 900;
          text-decoration: none;
        }

        .nav24-card-footer {
          margin-top: auto;
          padding-top: 12px;
          border-top: 1px solid var(--line);
        }

        .nav24-card-track {
          width: 34px;
          height: 2px;
          border-radius: 999px;
          background: rgba(255,255,255,.08);
          transition: width 160ms ease;
        }

        .nav24-card:hover .nav24-card-track {
          width: 100%;
          background: rgba(84,232,255,.30);
        }

        .nav24-chronology-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
        }

        .nav24-chronology-card {
          min-height: 360px;
          position: relative;
          overflow: hidden;
          padding: 24px;
          border: 1px solid var(--line);
          border-radius: 20px;
          background: rgba(255,255,255,.022);
        }

        .nav24-chronology-card.origin {
          border-color: rgba(241,199,105,.22);
          background:
            radial-gradient(circle at 100% 0%, rgba(241,199,105,.08), transparent 44%),
            rgba(241,199,105,.03);
        }

        .nav24-chronology-card.expansion {
          border-color: rgba(84,232,255,.20);
          background:
            radial-gradient(circle at 100% 0%, rgba(84,232,255,.07), transparent 44%),
            rgba(84,232,255,.028);
        }

        .nav24-chronology-card small {
          display: block;
          font-size: .55rem;
          font-weight: 950;
          letter-spacing: .13em;
          text-transform: uppercase;
        }

        .nav24-chronology-card.origin small {
          color: var(--amber);
        }

        .nav24-chronology-card.expansion small {
          color: var(--cyan);
        }

        .nav24-chronology-card h3 {
          margin: 10px 0 0;
          font-size: 1.75rem;
          line-height: 1.08;
          letter-spacing: -.035em;
        }

        .nav24-chain-eight {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 8px;
          margin-top: 20px;
        }

        .nav24-eight {
          min-height: 88px;
          display: grid;
          align-content: space-between;
          padding: 11px;
          border: 1px solid rgba(241,199,105,.12);
          border-radius: 12px;
          background: rgba(0,0,0,.08);
        }

        .nav24-eight b {
          color: var(--amber);
          font-size: .50rem;
          letter-spacing: .10em;
        }

        .nav24-eight span {
          font-size: .62rem;
          font-weight: 850;
        }

        .nav24-chronology-card p {
          margin: 18px 0 0;
          color: var(--muted);
          font-size: .70rem;
          line-height: 1.7;
        }

        .nav24-expansion-facts {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 9px;
          margin-top: 20px;
        }

        .nav24-expansion-fact {
          min-height: 92px;
          padding: 12px;
          border: 1px solid rgba(84,232,255,.11);
          border-radius: 12px;
          background: rgba(0,0,0,.08);
        }

        .nav24-expansion-fact b {
          display: block;
          color: var(--cyan);
          font-size: .50rem;
          letter-spacing: .10em;
        }

        .nav24-expansion-fact span {
          display: block;
          margin-top: 7px;
          color: #dceaf4;
          font-size: .62rem;
          line-height: 1.5;
        }

        .nav24-doctrine {
          border-top: 1px solid var(--line);
          border-bottom: 1px solid var(--line);
          background: rgba(4,12,20,.72);
        }

        .nav24-doctrine-grid {
          display: grid;
          grid-template-columns: minmax(0, .88fr) minmax(0, 1.12fr);
          gap: 34px;
          align-items: start;
          padding: 72px 0;
        }

        .nav24-doctrine h2 {
          margin: 9px 0 0;
          font-size: clamp(2rem, 3.4vw, 3.4rem);
          line-height: 1.04;
          letter-spacing: -.045em;
        }

        .nav24-doctrine p {
          margin: 18px 0 0;
          color: var(--muted);
          font-size: .78rem;
          line-height: 1.75;
        }

        .nav24-doctrine-cards {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 11px;
        }

        .nav24-doctrine-card {
          min-height: 148px;
          padding: 16px;
          border: 1px solid var(--line);
          border-radius: 15px;
          background: rgba(255,255,255,.022);
        }

        .nav24-doctrine-card b {
          color: var(--amber);
          font-size: .56rem;
          letter-spacing: .12em;
        }

        .nav24-doctrine-card strong {
          display: block;
          margin-top: 8px;
          font-size: .76rem;
        }

        .nav24-doctrine-card span {
          display: block;
          margin-top: 7px;
          color: var(--muted);
          font-size: .64rem;
          line-height: 1.55;
        }

        .nav24-close {
          padding: 76px 0 98px;
          text-align: center;
        }

        .nav24-close h2 {
          max-width: 900px;
          margin: 10px auto 0;
          font-size: clamp(2.3rem, 4.2vw, 4.6rem);
          line-height: 1;
          letter-spacing: -.05em;
        }

        .nav24-close p {
          max-width: 760px;
          margin: 18px auto 0;
          color: var(--muted);
          font-size: .76rem;
          line-height: 1.7;
        }

        .nav24-close-actions {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 10px;
          margin-top: 26px;
        }

        .nav24-button {
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

        .nav24-button.primary {
          border-color: rgba(168,178,255,.26);
          background: rgba(168,178,255,.07);
          color: var(--indigo-soft);
        }

        .nav24-button:hover {
          transform: translateY(-2px);
          border-color: var(--line-strong);
        }

        @media (max-width: 1180px) {
          .nav24-hero-grid {
            grid-template-columns: 1fr;
          }

          .nav24-orbit {
            max-width: 500px;
          }

          .nav24-link-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 900px) {
          .nav24-shell {
            width: min(100% - 28px, 1460px);
          }

          .nav24-topline,
          .nav24-section-head,
          .nav24-console-head,
          .nav24-region-head {
            display: grid;
            align-items: start;
          }

          .nav24-title {
            font-size: clamp(2.8rem, 13vw, 4.8rem);
          }

          .nav24-metric-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .nav24-metric {
            border-bottom: 1px solid var(--line);
          }

          .nav24-metric:nth-child(2n) {
            border-right: 0;
          }

          .nav24-view-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .nav24-chronology-grid,
          .nav24-doctrine-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 640px) {
          .nav24-view-grid,
          .nav24-link-grid,
          .nav24-doctrine-cards {
            grid-template-columns: 1fr;
          }

          .nav24-chain-eight,
          .nav24-expansion-facts {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .nav24-node {
            display: none;
          }

          .nav24-close-actions {
            display: grid;
          }
        }
      `}</style>

      <section className="nav24-hero">
        <div className="nav24-shell nav24-topline">
          <Link
            href="/academy/24-link-architecture"
            className="nav24-back"
          >
            ← Back to 24-Link Explorer
          </Link>

          <span className="nav24-badge">
            Architecture Navigator · Six governed lenses
          </span>
        </div>

        <div className="nav24-shell nav24-hero-grid">
          <div>
            <div className="nav24-kicker">
              TA-14 Academy · Architecture Navigator
            </div>

            <h1 className="nav24-title">
              24-Link Architecture
              <span>Views.</span>
            </h1>

            <p className="nav24-lead">
              One canon, multiple governed views. Change the lens without
              changing the underlying architecture.
            </p>

            <div className="nav24-rules">
              <span className="nav24-rule">One canonical route</span>
              <span className="nav24-rule">Six governed lenses</span>
              <span className="nav24-rule">No doctrine mutation by view</span>
              <span className="nav24-rule">Chronology preserved</span>
            </div>
          </div>

          <div
            className="nav24-orbit"
            aria-label="TA-14 Architecture Navigator motif"
          >
            <div className="nav24-ring r1" />
            <div className="nav24-ring r2" />
            <div className="nav24-ring r3" />
            <div className="nav24-ring r4" />
            <div className="nav24-axis-h" />
            <div className="nav24-axis-v" />

            <div className="nav24-core">
              <div>
                <small>ACTIVE LENS</small>
                <strong>{active.code}</strong>
                <span>{active.short}</span>
              </div>
            </div>

            <div className="nav24-node n1">
              <b>CHAIN</b>
              <span>Execution order</span>
            </div>

            <div className="nav24-node n2">
              <b>DEP</b>
              <span>Dependencies</span>
            </div>

            <div className="nav24-node n3">
              <b>EVD</b>
              <span>Evidence</span>
            </div>

            <div className="nav24-node n4">
              <b>FAIL</b>
              <span>Failure</span>
            </div>

            <div className="nav24-node n5">
              <b>TIME</b>
              <span>Chronology</span>
            </div>
          </div>
        </div>
      </section>

      <section className="nav24-metrics">
        <div className="nav24-shell nav24-metric-grid">
          <Metric value="24" label="Canonical links" />
          <Metric value="6" label="Governed views" />
          <Metric
            value={String(TA14_ARCHITECTURE_REGIONS.length)}
            label="Architecture regions"
          />
          <Metric value="8" label="Foundational parent anchors" />
          <Metric value={active.short} label="Active lens" />
        </div>
      </section>

      <section className="nav24-section alt">
        <div className="nav24-shell">
          <div className="nav24-section-head">
            <div>
              <div
                className="nav24-eyebrow"
                style={{ color: "var(--indigo)" }}
              >
                Choose the lens
              </div>

              <h2 className="nav24-h2">
                Change what you inspect without changing what TA-14 is.
              </h2>
            </div>

            <p className="nav24-section-copy">
              Each view exposes a different relationship inside the same
              canonical architecture: route order, dependency, evidence,
              failure, learning, or chronology.
            </p>
          </div>

          <div className="nav24-view-grid">
            {VIEWS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setView(item.id)}
                className={[
                  "nav24-view",
                  view === item.id ? "active" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <div className="nav24-view-top">
                  <span className="nav24-view-code">
                    {item.code}
                  </span>

                  <span className="nav24-view-index">
                    {item.code}
                  </span>
                </div>

                <h3>{item.label}</h3>
                <p>{item.description}</p>

                <span className="nav24-view-action">
                  {view === item.id ? "Active lens" : "Switch view →"}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="nav24-section">
        <div className="nav24-shell">
          <div className="nav24-section-head">
            <div>
              <div className="nav24-eyebrow">
                Navigator workspace
              </div>

              <h2 className="nav24-h2">
                Read the architecture through the selected lens.
              </h2>
            </div>

            <p className="nav24-section-copy">
              The underlying 24-link canon does not change when the view
              changes. Only the relationship being emphasized changes.
            </p>
          </div>

          <section className="nav24-console">
            <div className="nav24-console-head">
              <div>
                <small>{active.label}</small>
                <h2>{active.description}</h2>
                <p>
                  Active lens: {active.short}. Switch views above at any time
                  without losing the canonical route.
                </p>
              </div>

              <span className="nav24-console-pill">
                Lens {active.code} · {active.short}
              </span>
            </div>

            <div className="nav24-console-body">
              {view === "chronology" ? (
                <ChronologyView />
              ) : (
                <LinkGrid view={view} />
              )}
            </div>
          </section>
        </div>
      </section>

      <section className="nav24-doctrine">
        <div className="nav24-shell nav24-doctrine-grid">
          <div>
            <div
              className="nav24-eyebrow"
              style={{ color: "var(--amber)" }}
            >
              Navigator doctrine
            </div>

            <h2>
              A new view is not a new architecture.
            </h2>

            <p>
              The Architecture Navigator is a governed interpretation layer
              over one canonical 24-link route. Dependency, evidence, failure,
              Academy, and chronology views must not silently redefine the
              canonical links or imply a different provenance history.
            </p>
          </div>

          <div className="nav24-doctrine-cards">
            <DoctrineCard
              code="01"
              title="Chain remains canonical"
              text="Execution order remains the reference route even when another lens emphasizes dependency, evidence, failure, learning, or chronology."
            />

            <DoctrineCard
              code="02"
              title="Dependencies remain bounded"
              text="A dependency view exposes prerequisites and transition burdens; it does not create new upstream doctrine."
            />

            <DoctrineCard
              code="03"
              title="Evidence remains distinct"
              text="Proof objects and evidence requirements explain what supports a link without turning evidence display into approval."
            />

            <DoctrineCard
              code="04"
              title="Chronology remains preserved"
              text="The May 1, 2025 Chain-of-Eight origin remains the parent provenance anchor while the 24-link architecture represents later deeper-resolution maturation."
            />
          </div>
        </div>
      </section>

      <section className="nav24-close">
        <div className="nav24-shell">
          <div
            className="nav24-eyebrow"
            style={{ color: "var(--indigo)" }}
          >
            Navigate without distortion
          </div>

          <h2>
            Change the lens.
            <br />
            Preserve the canon.
          </h2>

          <p>
            Use the Navigator to inspect route order, dependencies, proof
            burdens, failure conditions, Academy tasks, and chronology while
            keeping the same TA-14 architecture underneath every view.
          </p>

          <div className="nav24-close-actions">
            <Link
              href="/academy/24-link-architecture"
              className="nav24-button primary"
            >
              Return to 24-Link Explorer →
            </Link>

            <Link
              href="/academy/24-link-architecture/provenance"
              className="nav24-button"
            >
              Trace Provenance
            </Link>

            <Link
              href="/academy/24-link-architecture/simulator"
              className="nav24-button"
            >
              Enter Failure Simulator
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
    <div className="nav24-metric">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function LinkGrid({
  view,
}: {
  view: Exclude<ViewMode, "chronology">;
}) {
  return (
    <div className="nav24-region-stack">
      {TA14_ARCHITECTURE_REGIONS.map((region) => {
        const links = region.linkIds
          .map((id) =>
            TA14_24_LINKS.find((item) => item.linkId === id),
          )
          .filter(
            (
              item,
            ): item is (typeof TA14_24_LINKS)[number] =>
              Boolean(item),
          );

        return (
          <section
            key={region.id}
            className="nav24-region"
          >
            <div className="nav24-region-head">
              <div>
                <small>Architecture region</small>
                <h3>{region.label}</h3>
              </div>

              <span className="nav24-region-count">
                {links.length} canonical link
                {links.length === 1 ? "" : "s"}
              </span>
            </div>

            <div className="nav24-link-grid">
              {links.map((item) => (
                <article
                  key={item.linkId}
                  className="nav24-card"
                >
                  <div className="nav24-card-top">
                    <span className="nav24-card-index">
                      {String(item.order).padStart(2, "0")}
                    </span>

                    <span className="nav24-card-anchor">
                      {item.parentAnchor}
                    </span>
                  </div>

                  <h4>{item.canonicalName}</h4>

                  <ViewContent
                    item={item}
                    view={view}
                  />

                  <div className="nav24-card-footer">
                    <div className="nav24-card-track" />
                  </div>
                </article>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function ViewContent({
  item,
  view,
}: {
  item: (typeof TA14_24_LINKS)[number];
  view: Exclude<ViewMode, "chronology">;
}) {
  if (view === "chain") {
    return (
      <div className="nav24-content">
        <span className="nav24-mini-label">
          Canonical definition
        </span>
        <p className="nav24-proof">
          {item.definition}
        </p>
      </div>
    );
  }

  if (view === "dependency") {
    return (
      <div className="nav24-content">
        <span className="nav24-mini-label">
          Upstream dependencies
        </span>

        <div className="nav24-dependencies">
          {item.upstreamDependencies.length ? (
            item.upstreamDependencies.map((id) => {
              const dependency = TA14_24_LINKS.find(
                (candidate) => candidate.linkId === id,
              );

              return (
                <span
                  key={id}
                  className="nav24-dependency"
                >
                  {dependency
                    ? `${String(dependency.order).padStart(2, "0")} ${dependency.canonicalName}`
                    : id}
                </span>
              );
            })
          ) : (
            <span className="nav24-dependency">
              Entry state · no prior chain link
            </span>
          )}
        </div>

        <p className="nav24-transition">
          {item.transitionRule}
        </p>
      </div>
    );
  }

  if (view === "evidence") {
    return (
      <div className="nav24-content">
        <span className="nav24-mini-label">
          Proof object
        </span>

        <p className="nav24-proof">
          {item.proofObject}
        </p>

        <span
          className="nav24-mini-label"
          style={{ marginTop: 13 }}
        >
          Evidence requirements
        </span>

        <ul className="nav24-evidence-list">
          {item.evidenceRequirements.slice(0, 3).map((value) => (
            <li key={value}>
              <span>{value}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (view === "failure") {
    return (
      <div className="nav24-content">
        <span className="nav24-mini-label">
          Failure modes
        </span>

        <ul className="nav24-failure-list">
          {item.failureModes.slice(0, 3).map((value) => (
            <li key={value}>
              <span>{value}</span>
            </li>
          ))}
        </ul>

        <p className="nav24-hold-rule">
          {item.holdRefuseEscalateRule}
        </p>
      </div>
    );
  }

  return (
    <div className="nav24-content">
      <span className="nav24-mini-label">
        Mastery task
      </span>

      <p className="nav24-academy-task">
        {item.masteryTask}
      </p>

      <Link
        href={`/academy/24-link-architecture/${String(
          item.order,
        ).padStart(2, "0")}-${item.slug}`}
        className="nav24-open"
      >
        Enter canonical lesson →
      </Link>
    </div>
  );
}

function ChronologyView() {
  const chain = [
    "Reality",
    "Record",
    "Continuity",
    "Admissibility",
    "Binding",
    "Commit",
    "Execution",
    "Outcome",
  ];

  return (
    <div className="nav24-chronology-grid">
      <section className="nav24-chronology-card origin">
        <small>
          May 1, 2025 · Foundational publication
        </small>

        <h3>
          Chain of Eight already exists.
        </h3>

        <div className="nav24-chain-eight">
          {chain.map((item, index) => (
            <div
              key={item}
              className="nav24-eight"
            >
              <b>{String(index + 1).padStart(2, "0")}</b>
              <span>{item}</span>
            </div>
          ))}
        </div>

        <p>
          The Exchange must not imply that these eight foundational anchors
          were developed later. The parent route was already created and
          publicly published on May 1, 2025.
        </p>
      </section>

      <section className="nav24-chronology-card expansion">
        <small>
          Subsequent architectural maturation
        </small>

        <h3>
          Deeper resolution into 24 links.
        </h3>

        <div className="nav24-expansion-facts">
          <div className="nav24-expansion-fact">
            <b>EVIDENCE</b>
            <span>
              Additional evidence-governance and admissible-evidence states.
            </span>
          </div>

          <div className="nav24-expansion-fact">
            <b>AUTHORITY</b>
            <span>
              Explicit reliance, authority, legitimacy, and consequence formation.
            </span>
          </div>

          <div className="nav24-expansion-fact">
            <b>RUNTIME</b>
            <span>
              Binding, commit, execution reality, refusal, and prevented consequence.
            </span>
          </div>

          <div className="nav24-expansion-fact">
            <b>RECURSION</b>
            <span>
              Outcome reality, new reality, memory, and future-chain continuation.
            </span>
          </div>
        </div>

        <p>
          Expansion increases architectural resolution; it does not move the
          provenance date of the original Chain of Eight.
        </p>
      </section>
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
    <article className="nav24-doctrine-card">
      <b>{code}</b>
      <strong>{title}</strong>
      <span>{text}</span>
    </article>
  );
}
