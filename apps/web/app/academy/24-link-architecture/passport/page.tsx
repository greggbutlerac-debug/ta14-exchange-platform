"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { TA14_24_LINKS } from "@/lib/academy/ta14-24-link-canon";

type MasteryStage =
  | "NOT STARTED"
  | "RECOGNIZED"
  | "EXPLAINED"
  | "EVIDENCE-MAPPED"
  | "DIAGNOSED"
  | "APPLIED"
  | "REPLAYED"
  | "MASTERED";

const STAGES: readonly MasteryStage[] = [
  "NOT STARTED",
  "RECOGNIZED",
  "EXPLAINED",
  "EVIDENCE-MAPPED",
  "DIAGNOSED",
  "APPLIED",
  "REPLAYED",
  "MASTERED",
];

const stageDescriptions: Record<MasteryStage, string> = {
  "NOT STARTED": "No competency evidence has been recorded yet.",
  RECOGNIZED: "Correctly identifies the link in an unfamiliar scenario.",
  EXPLAINED: "Explains why the link exists and what it protects.",
  "EVIDENCE-MAPPED": "Identifies evidence that would support or fail the link.",
  DIAGNOSED: "Finds ambiguity, drift, insufficiency, or invalidity.",
  APPLIED: "Makes the correct continue, narrow, hold, refuse, or escalate decision.",
  REPLAYED: "Reconstructs the route and identifies last admissible and first broken state.",
  MASTERED: "Demonstrates all required competency dimensions for the link.",
};

const stageShort: Record<MasteryStage, string> = {
  "NOT STARTED": "Not started",
  RECOGNIZED: "Recognize",
  EXPLAINED: "Explain",
  "EVIDENCE-MAPPED": "Evidence-map",
  DIAGNOSED: "Diagnose",
  APPLIED: "Apply",
  REPLAYED: "Replay",
  MASTERED: "Mastered",
};

const stageCode: Record<MasteryStage, string> = {
  "NOT STARTED": "00",
  RECOGNIZED: "01",
  EXPLAINED: "02",
  "EVIDENCE-MAPPED": "03",
  DIAGNOSED: "04",
  APPLIED: "05",
  REPLAYED: "06",
  MASTERED: "07",
};

export default function TA14ChainPassportPage() {
  const [passport, setPassport] = useState<Record<string, MasteryStage>>(
    Object.fromEntries(
      TA14_24_LINKS.map((item) => [item.linkId, "NOT STARTED" as MasteryStage]),
    ),
  );

  const mastered = useMemo(
    () =>
      TA14_24_LINKS.filter(
        (item) => passport[item.linkId] === "MASTERED",
      ).length,
    [passport],
  );

  const progressed = useMemo(
    () =>
      TA14_24_LINKS.filter(
        (item) => passport[item.linkId] !== "NOT STARTED",
      ).length,
    [passport],
  );

  const completion = Math.round((mastered / TA14_24_LINKS.length) * 100);

  const totalStagePoints = useMemo(
    () =>
      TA14_24_LINKS.reduce((sum, item) => {
        const stage = passport[item.linkId] ?? "NOT STARTED";
        return sum + Math.max(STAGES.indexOf(stage), 0);
      }, 0),
    [passport],
  );

  const possibleStagePoints =
    TA14_24_LINKS.length * (STAGES.length - 1);

  const competencyProgress = Math.round(
    (totalStagePoints / possibleStagePoints) * 100,
  );

  const stageCounts = useMemo(() => {
    return STAGES.reduce(
      (record, stage) => {
        record[stage] = TA14_24_LINKS.filter(
          (item) => passport[item.linkId] === stage,
        ).length;
        return record;
      },
      {} as Record<MasteryStage, number>,
    );
  }, [passport]);

  const highestActiveStage = useMemo<MasteryStage>(() => {
    for (let index = STAGES.length - 1; index >= 0; index -= 1) {
      const stage = STAGES[index];
      if ((stageCounts[stage] ?? 0) > 0) {
        return stage;
      }
    }

    return "NOT STARTED";
  }, [stageCounts]);

  function updateStage(linkId: string, stage: MasteryStage) {
    setPassport((current) => ({
      ...current,
      [linkId]: stage,
    }));
  }

  function resetPassport() {
    setPassport(
      Object.fromEntries(
        TA14_24_LINKS.map((item) => [item.linkId, "NOT STARTED" as MasteryStage]),
      ),
    );
  }

  return (
    <main className="passport">
      <style>{`
        .passport {
          --bg: #020711;
          --panel: rgba(8, 20, 32, .86);
          --panel-2: rgba(10, 26, 40, .76);
          --line: rgba(129, 176, 210, .14);
          --line-strong: rgba(84, 232, 255, .26);
          --cyan: #54e8ff;
          --cyan-soft: #c4f8ff;
          --green: #45eaa6;
          --green-soft: #c8f7df;
          --amber: #f1c769;
          --amber-soft: #ffe8aa;
          --indigo: #a8b2ff;
          --rose: #ff96ad;
          --text: #eff8ff;
          --muted: #93a8ba;
          --dim: #647b8f;
          min-height: 100vh;
          overflow: hidden;
          color: var(--text);
          background:
            radial-gradient(circle at 10% 0%, rgba(69,234,166,.11), transparent 24%),
            radial-gradient(circle at 92% 6%, rgba(84,232,255,.09), transparent 25%),
            linear-gradient(180deg, #020711 0%, #030a13 55%, #020711 100%);
        }

        .passport * {
          box-sizing: border-box;
        }

        .passport-shell {
          width: min(1460px, calc(100% - 48px));
          margin: 0 auto;
        }

        .passport-hero {
          position: relative;
          overflow: hidden;
          border-bottom: 1px solid var(--line);
        }

        .passport-hero::before {
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

        .passport-topline {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          padding-top: 20px;
        }

        .passport-back {
          color: var(--cyan-soft);
          font-size: .72rem;
          font-weight: 900;
          text-decoration: none;
        }

        .passport-badge {
          display: inline-flex;
          align-items: center;
          min-height: 34px;
          padding: 0 12px;
          border: 1px solid rgba(69,234,166,.20);
          border-radius: 999px;
          background: rgba(69,234,166,.05);
          color: var(--green-soft);
          font-size: .57rem;
          font-weight: 950;
          letter-spacing: .12em;
          text-transform: uppercase;
        }

        .passport-hero-grid {
          position: relative;
          display: grid;
          grid-template-columns: minmax(0, 1.08fr) minmax(420px, .92fr);
          gap: 64px;
          align-items: center;
          padding: 72px 0 84px;
        }

        .passport-kicker {
          color: var(--green);
          font-size: .64rem;
          font-weight: 950;
          letter-spacing: .20em;
          text-transform: uppercase;
        }

        .passport-title {
          max-width: 980px;
          margin: 14px 0 0;
          font-size: clamp(3.2rem, 6vw, 6.2rem);
          line-height: .95;
          letter-spacing: -.06em;
        }

        .passport-title span {
          display: block;
          color: var(--green-soft);
        }

        .passport-lead {
          max-width: 900px;
          margin: 26px 0 0;
          color: #c8d8e4;
          font-size: clamp(1rem, 1.35vw, 1.18rem);
          line-height: 1.8;
        }

        .passport-rules {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 24px;
        }

        .passport-rule {
          padding: 7px 10px;
          border: 1px solid var(--line);
          border-radius: 999px;
          background: rgba(255,255,255,.026);
          color: var(--muted);
          font-size: .56rem;
          font-weight: 850;
        }

        .passport-orbit {
          position: relative;
          width: min(510px, 100%);
          aspect-ratio: 1;
          margin: 0 auto;
        }

        .passport-ring {
          position: absolute;
          inset: 50% auto auto 50%;
          transform: translate(-50%, -50%);
          border: 1px solid rgba(129,176,210,.10);
          border-radius: 50%;
        }

        .passport-ring.r1 {
          width: 96%;
          height: 96%;
        }

        .passport-ring.r2 {
          width: 76%;
          height: 76%;
          border-color: rgba(69,234,166,.13);
        }

        .passport-ring.r3 {
          width: 56%;
          height: 56%;
          border-color: rgba(84,232,255,.12);
        }

        .passport-ring.r4 {
          width: 36%;
          height: 36%;
          border-color: rgba(168,178,255,.12);
        }

        .passport-axis-h,
        .passport-axis-v {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }

        .passport-axis-h {
          width: 88%;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(69,234,166,.15),
            transparent
          );
        }

        .passport-axis-v {
          width: 1px;
          height: 88%;
          background: linear-gradient(
            180deg,
            transparent,
            rgba(84,232,255,.13),
            transparent
          );
        }

        .passport-core {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 182px;
          height: 182px;
          transform: translate(-50%, -50%);
          display: grid;
          place-items: center;
          border: 1px solid rgba(69,234,166,.26);
          border-radius: 50%;
          background:
            radial-gradient(circle at 30% 25%, rgba(69,234,166,.12), transparent 44%),
            rgba(5,16,27,.95);
          box-shadow: 0 0 90px rgba(69,234,166,.09);
          text-align: center;
        }

        .passport-core small {
          display: block;
          color: var(--green);
          font-size: .58rem;
          font-weight: 950;
          letter-spacing: .18em;
        }

        .passport-core strong {
          display: block;
          margin-top: 5px;
          font-size: 3.4rem;
          line-height: 1;
          letter-spacing: -.06em;
        }

        .passport-core span {
          display: block;
          margin-top: 7px;
          color: var(--muted);
          font-size: .64rem;
        }

        .passport-node {
          position: absolute;
          min-width: 116px;
          padding: 10px 12px;
          border: 1px solid var(--line);
          border-radius: 13px;
          background: rgba(5,16,27,.92);
          box-shadow: 0 12px 34px rgba(0,0,0,.24);
        }

        .passport-node b {
          display: block;
          color: var(--green);
          font-size: .55rem;
          letter-spacing: .12em;
        }

        .passport-node span {
          display: block;
          margin-top: 4px;
          color: #d7e5ef;
          font-size: .66rem;
          font-weight: 850;
        }

        .passport-node.n1 {
          left: 0;
          top: 18%;
        }

        .passport-node.n2 {
          right: 0;
          top: 24%;
        }

        .passport-node.n3 {
          right: 4%;
          bottom: 18%;
        }

        .passport-node.n4 {
          left: 0;
          bottom: 18%;
        }

        .passport-node.n5 {
          left: 50%;
          top: 0;
          transform: translateX(-50%);
        }

        .passport-metrics {
          border-bottom: 1px solid var(--line);
          background: rgba(4,12,20,.76);
        }

        .passport-metric-grid {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
        }

        .passport-metric {
          min-height: 98px;
          padding: 20px;
          border-right: 1px solid var(--line);
        }

        .passport-metric:last-child {
          border-right: 0;
        }

        .passport-metric strong {
          display: block;
          font-size: 2rem;
          line-height: 1;
          letter-spacing: -.04em;
        }

        .passport-metric span {
          display: block;
          margin-top: 8px;
          color: var(--dim);
          font-size: .58rem;
          font-weight: 900;
          letter-spacing: .10em;
          text-transform: uppercase;
        }

        .passport-section {
          padding: 72px 0 90px;
        }

        .passport-section.alt {
          border-top: 1px solid var(--line);
          border-bottom: 1px solid var(--line);
          background: rgba(4,12,20,.66);
        }

        .passport-section-head {
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: 28px;
          margin-bottom: 28px;
        }

        .passport-eyebrow {
          color: var(--cyan);
          font-size: .62rem;
          font-weight: 950;
          letter-spacing: .16em;
          text-transform: uppercase;
        }

        .passport-h2 {
          margin: 9px 0 0;
          font-size: clamp(2rem, 3.4vw, 3.7rem);
          line-height: 1;
          letter-spacing: -.045em;
        }

        .passport-section-copy {
          max-width: 620px;
          margin: 0;
          color: var(--muted);
          font-size: .78rem;
          line-height: 1.7;
        }

        .passport-progress-panel {
          overflow: hidden;
          border: 1px solid var(--line);
          border-radius: 24px;
          background: rgba(255,255,255,.024);
        }

        .passport-progress-top {
          display: grid;
          grid-template-columns: minmax(0, 1.1fr) minmax(320px, .9fr);
          gap: 24px;
          align-items: center;
          padding: 24px;
          border-bottom: 1px solid var(--line);
          background:
            radial-gradient(circle at 100% 0%, rgba(69,234,166,.07), transparent 42%),
            rgba(255,255,255,.01);
        }

        .passport-progress-title small {
          display: block;
          color: var(--green);
          font-size: .56rem;
          font-weight: 950;
          letter-spacing: .13em;
          text-transform: uppercase;
        }

        .passport-progress-title h3 {
          margin: 8px 0 0;
          font-size: 1.45rem;
          letter-spacing: -.025em;
        }

        .passport-progress-title p {
          margin: 9px 0 0;
          color: var(--muted);
          font-size: .68rem;
          line-height: 1.6;
        }

        .passport-progress-actions {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 10px;
        }

        .passport-reset {
          min-height: 40px;
          padding: 0 13px;
          border: 1px solid var(--line);
          border-radius: 11px;
          background: rgba(255,255,255,.025);
          color: #dceaf4;
          cursor: pointer;
          font-size: .62rem;
          font-weight: 900;
          transition: 160ms ease;
        }

        .passport-reset:hover {
          transform: translateY(-1px);
          border-color: rgba(255,150,173,.24);
          background: rgba(255,150,173,.04);
        }

        .passport-progress-body {
          padding: 22px 24px 24px;
        }

        .passport-progress-labels {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          color: var(--dim);
          font-size: .54rem;
          font-weight: 900;
          letter-spacing: .09em;
          text-transform: uppercase;
        }

        .passport-track {
          position: relative;
          overflow: hidden;
          height: 14px;
          margin-top: 10px;
          border: 1px solid rgba(255,255,255,.06);
          border-radius: 999px;
          background: rgba(255,255,255,.035);
        }

        .passport-track-fill {
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(
            90deg,
            rgba(69,234,166,.48),
            rgba(84,232,255,.78)
          );
          transition: width 180ms ease;
        }

        .passport-stage-rail {
          display: grid;
          grid-template-columns: repeat(8, minmax(0, 1fr));
          gap: 8px;
          margin-top: 18px;
        }

        .passport-stage-chip {
          min-height: 92px;
          display: grid;
          align-content: space-between;
          gap: 8px;
          padding: 11px;
          border: 1px solid var(--line);
          border-radius: 13px;
          background: rgba(0,0,0,.10);
        }

        .passport-stage-chip.active {
          border-color: rgba(69,234,166,.20);
          background: rgba(69,234,166,.035);
        }

        .passport-stage-chip small {
          color: var(--green);
          font-size: .48rem;
          font-weight: 950;
          letter-spacing: .10em;
        }

        .passport-stage-chip strong {
          font-size: .60rem;
          line-height: 1.35;
        }

        .passport-stage-chip span {
          color: var(--dim);
          font-size: .56rem;
        }

        .passport-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
        }

        .passport-card {
          min-height: 340px;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          gap: 15px;
          padding: 18px;
          border: 1px solid var(--line);
          border-radius: 19px;
          background: rgba(255,255,255,.024);
          transition: 170ms ease;
        }

        .passport-card:hover {
          transform: translateY(-3px);
          border-color: rgba(84,232,255,.22);
          background:
            radial-gradient(circle at 100% 0%, rgba(84,232,255,.06), transparent 44%),
            rgba(84,232,255,.028);
        }

        .passport-card.mastered {
          border-color: rgba(69,234,166,.28);
          background:
            radial-gradient(circle at 100% 0%, rgba(69,234,166,.09), transparent 42%),
            rgba(69,234,166,.04);
        }

        .passport-card.in-progress {
          border-color: rgba(84,232,255,.17);
        }

        .passport-card::before {
          content: "";
          position: absolute;
          inset: 0 0 auto 0;
          height: 2px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(69,234,166,.52),
            transparent
          );
          opacity: 0;
          transition: 170ms ease;
        }

        .passport-card.mastered::before {
          opacity: 1;
        }

        .passport-card-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
        }

        .passport-link-index {
          color: var(--cyan);
          font-size: .58rem;
          font-weight: 950;
          letter-spacing: .12em;
          text-transform: uppercase;
        }

        .passport-card h3 {
          margin: 7px 0 0;
          font-size: 1.12rem;
          line-height: 1.22;
          letter-spacing: -.02em;
        }

        .passport-stage-badge {
          flex: 0 0 auto;
          max-width: 132px;
          padding: 6px 8px;
          border: 1px solid var(--line);
          border-radius: 999px;
          background: rgba(0,0,0,.10);
          color: var(--muted);
          font-size: .48rem;
          font-weight: 950;
          letter-spacing: .07em;
          text-transform: uppercase;
          text-align: center;
        }

        .passport-card.mastered .passport-stage-badge {
          border-color: rgba(69,234,166,.22);
          background: rgba(69,234,166,.055);
          color: var(--green-soft);
        }

        .passport-card-progress {
          display: grid;
          grid-template-columns: repeat(8, minmax(0, 1fr));
          gap: 4px;
        }

        .passport-card-segment {
          height: 8px;
          border: 1px solid rgba(255,255,255,.05);
          border-radius: 999px;
          background: rgba(255,255,255,.035);
        }

        .passport-card-segment.done {
          border-color: rgba(69,234,166,.15);
          background: rgba(69,234,166,.30);
        }

        .passport-stage-copy {
          min-height: 68px;
          margin: 0;
          color: var(--muted);
          font-size: .69rem;
          line-height: 1.62;
        }

        .passport-field {
          display: grid;
          gap: 7px;
          margin-top: auto;
        }

        .passport-field label {
          color: var(--dim);
          font-size: .51rem;
          font-weight: 950;
          letter-spacing: .10em;
          text-transform: uppercase;
        }

        .passport-select {
          width: 100%;
          min-height: 44px;
          padding: 0 11px;
          border: 1px solid var(--line);
          border-radius: 11px;
          background: #07111e;
          color: var(--text);
          outline: none;
          font-size: .67rem;
        }

        .passport-select:focus {
          border-color: rgba(69,234,166,.36);
          box-shadow: 0 0 0 3px rgba(69,234,166,.06);
        }

        .passport-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding-top: 13px;
          border-top: 1px solid var(--line);
        }

        .passport-stage-number {
          color: var(--dim);
          font-size: .52rem;
          font-weight: 900;
        }

        .passport-open {
          color: var(--cyan);
          font-size: .62rem;
          font-weight: 900;
          text-decoration: none;
        }

        .passport-open:hover {
          color: var(--cyan-soft);
        }

        .passport-standards {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
        }

        .passport-standard {
          min-height: 208px;
          padding: 19px;
          border: 1px solid var(--line);
          border-radius: 17px;
          background: rgba(255,255,255,.024);
        }

        .passport-standard small {
          color: var(--indigo);
          font-size: .54rem;
          font-weight: 950;
          letter-spacing: .12em;
          text-transform: uppercase;
        }

        .passport-standard h3 {
          margin: 9px 0 0;
          font-size: 1.25rem;
          letter-spacing: -.025em;
        }

        .passport-standard p {
          margin: 12px 0 0;
          color: var(--muted);
          font-size: .70rem;
          line-height: 1.65;
        }

        .passport-boundary {
          overflow: hidden;
          margin-top: 28px;
          border: 1px solid rgba(241,199,105,.18);
          border-radius: 18px;
          background:
            radial-gradient(circle at 100% 0%, rgba(241,199,105,.07), transparent 40%),
            rgba(241,199,105,.03);
        }

        .passport-boundary-head {
          padding: 14px 17px;
          border-bottom: 1px solid rgba(241,199,105,.12);
          color: var(--amber);
          font-size: .56rem;
          font-weight: 950;
          letter-spacing: .12em;
          text-transform: uppercase;
        }

        .passport-boundary-body {
          padding: 17px;
        }

        .passport-boundary-body p {
          margin: 0;
          color: #d8dfd7;
          font-size: .72rem;
          line-height: 1.7;
        }

        .passport-boundary-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 9px;
          margin-top: 16px;
        }

        .passport-boundary-item {
          min-height: 116px;
          padding: 12px;
          border: 1px solid rgba(241,199,105,.12);
          border-radius: 13px;
          background: rgba(0,0,0,.08);
        }

        .passport-boundary-item small {
          color: var(--amber);
          font-size: .49rem;
          font-weight: 950;
          letter-spacing: .09em;
          text-transform: uppercase;
        }

        .passport-boundary-item strong {
          display: block;
          margin-top: 7px;
          font-size: .66rem;
        }

        .passport-boundary-item span {
          display: block;
          margin-top: 6px;
          color: var(--muted);
          font-size: .59rem;
          line-height: 1.5;
        }

        .passport-close {
          padding: 76px 0 98px;
          text-align: center;
        }

        .passport-close h2 {
          max-width: 900px;
          margin: 10px auto 0;
          font-size: clamp(2.3rem, 4.2vw, 4.6rem);
          line-height: 1;
          letter-spacing: -.05em;
        }

        .passport-close p {
          max-width: 760px;
          margin: 18px auto 0;
          color: var(--muted);
          font-size: .76rem;
          line-height: 1.7;
        }

        .passport-close-actions {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 10px;
          margin-top: 26px;
        }

        .passport-button {
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

        .passport-button.primary {
          border-color: rgba(69,234,166,.24);
          background: rgba(69,234,166,.065);
          color: var(--green-soft);
        }

        .passport-button:hover {
          transform: translateY(-2px);
          border-color: var(--line-strong);
        }

        @media (max-width: 1180px) {
          .passport-hero-grid {
            grid-template-columns: 1fr;
          }

          .passport-orbit {
            max-width: 500px;
          }

          .passport-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .passport-stage-rail {
            grid-template-columns: repeat(4, minmax(0, 1fr));
          }

          .passport-boundary-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 860px) {
          .passport-shell {
            width: min(100% - 28px, 1460px);
          }

          .passport-topline,
          .passport-section-head,
          .passport-progress-top {
            display: grid;
            align-items: start;
          }

          .passport-progress-actions {
            justify-content: flex-start;
          }

          .passport-title {
            font-size: clamp(2.8rem, 13vw, 4.8rem);
          }

          .passport-metric-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .passport-metric {
            border-bottom: 1px solid var(--line);
          }

          .passport-metric:nth-child(2n) {
            border-right: 0;
          }

          .passport-standards {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 620px) {
          .passport-grid,
          .passport-standards,
          .passport-boundary-grid {
            grid-template-columns: 1fr;
          }

          .passport-stage-rail {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .passport-node {
            display: none;
          }

          .passport-close-actions {
            display: grid;
          }
        }
      `}</style>

      <section className="passport-hero">
        <div className="passport-shell passport-topline">
          <Link
            href="/academy/24-link-architecture"
            className="passport-back"
          >
            ← Back to 24-Link Explorer
          </Link>

          <span className="passport-badge">
            Mastery Record · Academy interaction layer
          </span>
        </div>

        <div className="passport-shell passport-hero-grid">
          <div>
            <div className="passport-kicker">
              TA-14 Academy · Mastery Record
            </div>

            <h1 className="passport-title">
              24-Link Chain
              <span>Passport.</span>
            </h1>

            <p className="passport-lead">
              A link is not completed because a learner opened a lesson. The
              passport records demonstrated competency across recognition,
              explanation, evidence mapping, diagnosis, application, replay,
              and mastery.
            </p>

            <div className="passport-rules">
              <span className="passport-rule">
                Opening a lesson ≠ competency
              </span>
              <span className="passport-rule">
                Local selection ≠ credential
              </span>
              <span className="passport-rule">
                Mastery requires demonstrated capability
              </span>
              <span className="passport-rule">
                Governed evidence remains separate
              </span>
            </div>
          </div>

          <div
            className="passport-orbit"
            aria-label="TA-14 Chain Passport mastery motif"
          >
            <div className="passport-ring r1" />
            <div className="passport-ring r2" />
            <div className="passport-ring r3" />
            <div className="passport-ring r4" />
            <div className="passport-axis-h" />
            <div className="passport-axis-v" />

            <div className="passport-core">
              <div>
                <small>CHAIN PASSPORT</small>
                <strong>{mastered}/24</strong>
                <span>links mastered</span>
              </div>
            </div>

            <div className="passport-node n1">
              <b>01</b>
              <span>Recognize</span>
            </div>
            <div className="passport-node n2">
              <b>03</b>
              <span>Evidence-map</span>
            </div>
            <div className="passport-node n3">
              <b>05</b>
              <span>Apply</span>
            </div>
            <div className="passport-node n4">
              <b>06</b>
              <span>Replay</span>
            </div>
            <div className="passport-node n5">
              <b>07</b>
              <span>Master</span>
            </div>
          </div>
        </div>
      </section>

      <section className="passport-metrics">
        <div className="passport-shell passport-metric-grid">
          <Metric value={`${mastered}/24`} label="Links mastered" />
          <Metric value={`${progressed}/24`} label="Links in progress" />
          <Metric value={`${completion}%`} label="Mastery completion" />
          <Metric
            value={`${competencyProgress}%`}
            label="Competency-stage progress"
          />
          <Metric
            value={stageShort[highestActiveStage]}
            label="Highest active stage"
          />
        </div>
      </section>

      <section className="passport-section alt">
        <div className="passport-shell">
          <div className="passport-section-head">
            <div>
              <div
                className="passport-eyebrow"
                style={{ color: "var(--green)" }}
              >
                Passport progress
              </div>
              <h2 className="passport-h2">
                See the competency state of the entire chain.
              </h2>
            </div>

            <p className="passport-section-copy">
              Only MASTERED links count toward completion. Intermediate stages
              show learning progress, but they do not by themselves establish
              credential eligibility or governed evidence.
            </p>
          </div>

          <div className="passport-progress-panel">
            <div className="passport-progress-top">
              <div className="passport-progress-title">
                <small>Chain-wide mastery</small>
                <h3>
                  {mastered} mastered · {progressed} progressed ·{" "}
                  {TA14_24_LINKS.length - progressed} not started
                </h3>
                <p>
                  The primary bar counts only full mastery. The stage rail
                  shows where the learner is currently accumulating
                  demonstrated capability.
                </p>
              </div>

              <div className="passport-progress-actions">
                <button
                  type="button"
                  onClick={resetPassport}
                  className="passport-reset"
                >
                  Reset local passport
                </button>
              </div>
            </div>

            <div className="passport-progress-body">
              <div className="passport-progress-labels">
                <span>Mastery completion</span>
                <span>{completion}%</span>
              </div>

              <div className="passport-track">
                <div
                  className="passport-track-fill"
                  style={{ width: `${completion}%` }}
                />
              </div>

              <div className="passport-stage-rail">
                {STAGES.map((stage) => (
                  <div
                    key={stage}
                    className={[
                      "passport-stage-chip",
                      (stageCounts[stage] ?? 0) > 0 ? "active" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    <small>{stageCode[stage]}</small>
                    <strong>{stageShort[stage]}</strong>
                    <span>{stageCounts[stage] ?? 0} links</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="passport-section">
        <div className="passport-shell">
          <div className="passport-section-head">
            <div>
              <div className="passport-eyebrow">
                24-Link competency ledger
              </div>
              <h2 className="passport-h2">
                Advance each link only as demonstrated capability grows.
              </h2>
            </div>

            <p className="passport-section-copy">
              Every card preserves the current local stage, a visible stage
              progression rail, the meaning of that stage, and a direct path
              back to the canonical lesson.
            </p>
          </div>

          <div className="passport-grid">
            {TA14_24_LINKS.map((item) => {
              const stage = passport[item.linkId] ?? "NOT STARTED";
              const stageIndex = STAGES.indexOf(stage);
              const className = [
                "passport-card",
                stage === "MASTERED" ? "mastered" : "",
                stage !== "NOT STARTED" && stage !== "MASTERED"
                  ? "in-progress"
                  : "",
              ]
                .filter(Boolean)
                .join(" ");

              return (
                <article
                  key={item.linkId}
                  className={className}
                >
                  <div className="passport-card-top">
                    <div>
                      <div className="passport-link-index">
                        Link {String(item.order).padStart(2, "0")}
                      </div>
                      <h3>{item.canonicalName}</h3>
                    </div>

                    <span className="passport-stage-badge">
                      {stageShort[stage]}
                    </span>
                  </div>

                  <div
                    className="passport-card-progress"
                    aria-label={`${item.canonicalName} mastery progression`}
                  >
                    {STAGES.map((candidate, index) => (
                      <span
                        key={candidate}
                        title={candidate}
                        className={[
                          "passport-card-segment",
                          index <= stageIndex && stage !== "NOT STARTED"
                            ? "done"
                            : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                      />
                    ))}
                  </div>

                  <p className="passport-stage-copy">
                    {stageDescriptions[stage]}
                  </p>

                  <div className="passport-field">
                    <label htmlFor={`stage-${item.linkId}`}>
                      Demonstrated stage
                    </label>

                    <select
                      id={`stage-${item.linkId}`}
                      value={stage}
                      onChange={(event) =>
                        updateStage(
                          item.linkId,
                          event.target.value as MasteryStage,
                        )
                      }
                      className="passport-select"
                    >
                      {STAGES.map((candidate) => (
                        <option key={candidate} value={candidate}>
                          {candidate}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="passport-card-footer">
                    <span className="passport-stage-number">
                      Stage {stageCode[stage]} of 07
                    </span>

                    <Link
                      href={`/academy/24-link-architecture/${String(
                        item.order,
                      ).padStart(2, "0")}-${item.slug}`}
                      className="passport-open"
                    >
                      Open canonical lesson →
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="passport-section alt">
        <div className="passport-shell">
          <div className="passport-section-head">
            <div>
              <div
                className="passport-eyebrow"
                style={{ color: "var(--indigo)" }}
              >
                Mastery standard
              </div>
              <h2 className="passport-h2">
                Completion represents demonstrated capability, not seat time.
              </h2>
            </div>

            <p className="passport-section-copy">
              The Passport distinguishes recognition from explanation,
              explanation from evidence mapping, evidence mapping from
              diagnosis, diagnosis from application, and application from
              replay. Mastery sits beyond all of them.
            </p>
          </div>

          <div className="passport-standards">
            <Standard
              code="01"
              title="Recognize"
              body="Identify the correct link in an unfamiliar scenario."
            />

            <Standard
              code="02"
              title="Explain"
              body="Explain why the link exists and what it protects."
            />

            <Standard
              code="03"
              title="Evidence-map"
              body="Identify evidence that supports, weakens, or fails the link."
            />

            <Standard
              code="04"
              title="Diagnose"
              body="Find ambiguity, drift, insufficiency, or invalidity."
            />

            <Standard
              code="05"
              title="Apply"
              body="Choose the correct continue, narrow, hold, refuse, or escalate action."
            />

            <Standard
              code="06"
              title="Replay"
              body="Reconstruct the route, last admissible state, and first broken link."
            />
          </div>

          <div className="passport-boundary">
            <div className="passport-boundary-head">
              Academy interaction boundary
            </div>

            <div className="passport-boundary-body">
              <p>
                This first Passport page is an Academy interaction layer only.
                Persisted learner identity, signed assessment evidence,
                reviewer verification, and credential issuance should be added
                as separate governed records rather than inferred from a local
                UI selection.
              </p>

              <div className="passport-boundary-grid">
                <BoundaryItem
                  code="ID"
                  title="Learner identity"
                  text="A local stage selection is not a persistent identity record."
                />
                <BoundaryItem
                  code="EV"
                  title="Assessment evidence"
                  text="Competency claims require attributable evidence separate from this UI."
                />
                <BoundaryItem
                  code="RV"
                  title="Reviewer verification"
                  text="Independent or authorized review must remain an explicit governed record."
                />
                <BoundaryItem
                  code="CR"
                  title="Credential issuance"
                  text="A credential is not created merely because every local selector says MASTERED."
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="passport-close">
        <div className="passport-shell">
          <div
            className="passport-eyebrow"
            style={{ color: "var(--green)" }}
          >
            Continue the mastery route
          </div>

          <h2>
            Learn the link.
            <br />
            Prove the capability.
          </h2>

          <p>
            Use the canonical lessons to understand the architecture, the
            simulator to pressure your reasoning, and the Passport to visualize
            local competency progression without confusing that interaction
            with a governed credential.
          </p>

          <div className="passport-close-actions">
            <Link
              href="/academy/24-link-architecture"
              className="passport-button primary"
            >
              Open 24-Link Explorer →
            </Link>

            <Link
              href="/academy/24-link-architecture/simulator"
              className="passport-button"
            >
              Enter Failure Simulator
            </Link>

            <Link
              href="/academy/24-link-architecture/route-state"
              className="passport-button"
            >
              Open Route State Lab
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
    <div className="passport-metric">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function Standard({
  code,
  title,
  body,
}: {
  code: string;
  title: string;
  body: string;
}) {
  return (
    <article className="passport-standard">
      <small>{code} · Mastery dimension</small>
      <h3>{title}</h3>
      <p>{body}</p>
    </article>
  );
}

function BoundaryItem({
  code,
  title,
  text,
}: {
  code: string;
  title: string;
  text: string;
}) {
  return (
    <article className="passport-boundary-item">
      <small>{code}</small>
      <strong>{title}</strong>
      <span>{text}</span>
    </article>
  );
}
