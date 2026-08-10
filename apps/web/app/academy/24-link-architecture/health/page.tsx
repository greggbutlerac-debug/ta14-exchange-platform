"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import {
  TA14_24_LINKS,
  TA14_ARCHITECTURE_REGIONS,
  type TA14EvidenceHealthState,
  type TA14LinkId,
} from "@/lib/academy/ta14-24-link-canon";

const HEALTH_STATES: readonly TA14EvidenceHealthState[] = [
  "supported",
  "partial",
  "held",
  "challenged",
  "untested",
  "outside_scope",
];

const HEALTH_LABELS: Record<TA14EvidenceHealthState, string> = {
  supported: "Supported",
  partial: "Partial",
  held: "Held",
  challenged: "Challenged",
  untested: "Untested",
  outside_scope: "Outside scope",
};

const HEALTH_COPY: Record<TA14EvidenceHealthState, string> = {
  supported:
    "Evidence currently supports the declared link within the bounded review scope.",
  partial:
    "Some elements are supported, but route-complete evidence remains incomplete.",
  held:
    "A determination is paused pending additional evidence, recovery, or resolution.",
  challenged:
    "A recorded challenge exists against the evidence, interpretation, or determination.",
  untested:
    "No governed review has tested this link within the current record.",
  outside_scope:
    "This link was not included in the declared review scope.",
};

const HEALTH_SHORT: Record<TA14EvidenceHealthState, string> = {
  supported: "Support",
  partial: "Partial",
  held: "Hold",
  challenged: "Challenge",
  untested: "Untested",
  outside_scope: "Out of scope",
};

type LinkEvidenceRecord = {
  state: TA14EvidenceHealthState;
  artifact: string;
  scope: string;
  version: string;
  challenge: string;
  visibility: "public" | "private" | "mixed";
};

function defaultRecord(): LinkEvidenceRecord {
  return {
    state: "untested",
    artifact: "",
    scope: "",
    version: "Current record",
    challenge: "",
    visibility: "public",
  };
}

export default function TA14ArchitectureHealthOverlayPage() {
  const [architectureName, setArchitectureName] = useState(
    "Example Registered Architecture",
  );

  const [records, setRecords] = useState<Record<TA14LinkId, LinkEvidenceRecord>>(
    () =>
      Object.fromEntries(
        TA14_24_LINKS.map((item) => [item.linkId, defaultRecord()]),
      ) as Record<TA14LinkId, LinkEvidenceRecord>,
  );

  const [selectedLinkId, setSelectedLinkId] =
    useState<TA14LinkId>("TA14-LINK-01");

  const selectedLink = useMemo(
    () => TA14_24_LINKS.find((item) => item.linkId === selectedLinkId)!,
    [selectedLinkId],
  );

  const selectedRecord = records[selectedLinkId];

  const counts = useMemo(() => {
    return HEALTH_STATES.reduce(
      (acc, state) => {
        acc[state] = TA14_24_LINKS.filter(
          (item) => records[item.linkId].state === state,
        ).length;
        return acc;
      },
      {} as Record<TA14EvidenceHealthState, number>,
    );
  }, [records]);

  const reviewedCount = useMemo(
    () =>
      counts.supported +
      counts.partial +
      counts.held +
      counts.challenged,
    [counts],
  );

  const coveragePercent = Math.round(
    ((TA14_24_LINKS.length - counts.untested - counts.outside_scope) /
      TA14_24_LINKS.length) *
      100,
  );

  const visibleCount = useMemo(
    () =>
      TA14_24_LINKS.filter(
        (item) => records[item.linkId].visibility === "public",
      ).length,
    [records],
  );

  function updateRecord(
    linkId: TA14LinkId,
    patch: Partial<LinkEvidenceRecord>,
  ) {
    setRecords((current) => ({
      ...current,
      [linkId]: {
        ...current[linkId],
        ...patch,
      },
    }));
  }

  return (
    <main className="health">
      <style>{`
        .health {
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
          --orange: #f1a35e;
          --rose: #ff96ad;
          --rose-soft: #ffd1dc;
          --indigo: #a8b2ff;
          --text: #eff8ff;
          --muted: #93a8ba;
          --dim: #647b8f;
          min-height: 100vh;
          overflow: hidden;
          color: var(--text);
          background:
            radial-gradient(circle at 10% 0%, rgba(84,232,255,.11), transparent 24%),
            radial-gradient(circle at 92% 5%, rgba(69,234,166,.09), transparent 25%),
            linear-gradient(180deg, #020711 0%, #030a13 55%, #020711 100%);
        }

        .health * {
          box-sizing: border-box;
        }

        .health-shell {
          width: min(1460px, calc(100% - 48px));
          margin: 0 auto;
        }

        .health-hero {
          position: relative;
          overflow: hidden;
          border-bottom: 1px solid var(--line);
        }

        .health-hero::before {
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

        .health-topline {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          padding-top: 20px;
        }

        .health-back {
          color: var(--cyan-soft);
          font-size: .72rem;
          font-weight: 900;
          text-decoration: none;
        }

        .health-badge {
          display: inline-flex;
          align-items: center;
          min-height: 34px;
          padding: 0 12px;
          border: 1px solid rgba(84,232,255,.18);
          border-radius: 999px;
          background: rgba(84,232,255,.045);
          color: var(--cyan-soft);
          font-size: .56rem;
          font-weight: 950;
          letter-spacing: .12em;
          text-transform: uppercase;
        }

        .health-hero-grid {
          position: relative;
          display: grid;
          grid-template-columns: minmax(0, 1.08fr) minmax(420px, .92fr);
          gap: 64px;
          align-items: center;
          padding: 72px 0 84px;
        }

        .health-kicker {
          color: var(--cyan);
          font-size: .64rem;
          font-weight: 950;
          letter-spacing: .20em;
          text-transform: uppercase;
        }

        .health-title {
          max-width: 980px;
          margin: 14px 0 0;
          font-size: clamp(3.1rem, 6vw, 6.1rem);
          line-height: .95;
          letter-spacing: -.06em;
        }

        .health-title span {
          display: block;
          color: var(--cyan-soft);
        }

        .health-lead {
          max-width: 920px;
          margin: 26px 0 0;
          color: #c8d8e4;
          font-size: clamp(1rem, 1.35vw, 1.18rem);
          line-height: 1.8;
        }

        .health-rules {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 24px;
        }

        .health-rule {
          padding: 7px 10px;
          border: 1px solid var(--line);
          border-radius: 999px;
          background: rgba(255,255,255,.026);
          color: var(--muted);
          font-size: .56rem;
          font-weight: 850;
        }

        .health-orbit {
          position: relative;
          width: min(510px, 100%);
          aspect-ratio: 1;
          margin: 0 auto;
        }

        .health-ring {
          position: absolute;
          inset: 50% auto auto 50%;
          transform: translate(-50%, -50%);
          border: 1px solid rgba(129,176,210,.10);
          border-radius: 50%;
        }

        .health-ring.r1 {
          width: 96%;
          height: 96%;
        }

        .health-ring.r2 {
          width: 76%;
          height: 76%;
          border-color: rgba(84,232,255,.12);
        }

        .health-ring.r3 {
          width: 56%;
          height: 56%;
          border-color: rgba(69,234,166,.12);
        }

        .health-ring.r4 {
          width: 36%;
          height: 36%;
          border-color: rgba(168,178,255,.12);
        }

        .health-axis-h,
        .health-axis-v {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }

        .health-axis-h {
          width: 88%;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(84,232,255,.15),
            transparent
          );
        }

        .health-axis-v {
          width: 1px;
          height: 88%;
          background: linear-gradient(
            180deg,
            transparent,
            rgba(69,234,166,.14),
            transparent
          );
        }

        .health-core {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 182px;
          height: 182px;
          transform: translate(-50%, -50%);
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

        .health-core small {
          display: block;
          color: var(--cyan);
          font-size: .58rem;
          font-weight: 950;
          letter-spacing: .18em;
        }

        .health-core strong {
          display: block;
          margin-top: 5px;
          font-size: 3.4rem;
          line-height: 1;
          letter-spacing: -.06em;
        }

        .health-core span {
          display: block;
          margin-top: 7px;
          color: var(--muted);
          font-size: .64rem;
        }

        .health-node {
          position: absolute;
          min-width: 116px;
          padding: 10px 12px;
          border: 1px solid var(--line);
          border-radius: 13px;
          background: rgba(5,16,27,.92);
          box-shadow: 0 12px 34px rgba(0,0,0,.24);
        }

        .health-node b {
          display: block;
          font-size: .55rem;
          letter-spacing: .12em;
        }

        .health-node span {
          display: block;
          margin-top: 4px;
          color: #d7e5ef;
          font-size: .66rem;
          font-weight: 850;
        }

        .health-node.n1 {
          left: 0;
          top: 18%;
        }

        .health-node.n2 {
          right: 0;
          top: 24%;
        }

        .health-node.n3 {
          right: 4%;
          bottom: 18%;
        }

        .health-node.n4 {
          left: 0;
          bottom: 18%;
        }

        .health-node.n5 {
          left: 50%;
          top: 0;
          transform: translateX(-50%);
        }

        .health-node.supported b { color: var(--green); }
        .health-node.partial b { color: var(--amber); }
        .health-node.held b { color: var(--orange); }
        .health-node.challenged b { color: var(--rose); }
        .health-node.untested b { color: var(--dim); }

        .health-metrics {
          border-bottom: 1px solid var(--line);
          background: rgba(4,12,20,.76);
        }

        .health-metric-grid {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
        }

        .health-metric {
          min-height: 98px;
          padding: 20px;
          border-right: 1px solid var(--line);
        }

        .health-metric:last-child {
          border-right: 0;
        }

        .health-metric strong {
          display: block;
          font-size: 2rem;
          line-height: 1;
          letter-spacing: -.04em;
        }

        .health-metric span {
          display: block;
          margin-top: 8px;
          color: var(--dim);
          font-size: .58rem;
          font-weight: 900;
          letter-spacing: .10em;
          text-transform: uppercase;
        }

        .health-section {
          padding: 72px 0 90px;
        }

        .health-section.alt {
          border-top: 1px solid var(--line);
          border-bottom: 1px solid var(--line);
          background: rgba(4,12,20,.66);
        }

        .health-section-head {
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: 28px;
          margin-bottom: 28px;
        }

        .health-eyebrow {
          color: var(--cyan);
          font-size: .62rem;
          font-weight: 950;
          letter-spacing: .16em;
          text-transform: uppercase;
        }

        .health-h2 {
          margin: 9px 0 0;
          font-size: clamp(2rem, 3.4vw, 3.7rem);
          line-height: 1;
          letter-spacing: -.045em;
        }

        .health-section-copy {
          max-width: 620px;
          margin: 0;
          color: var(--muted);
          font-size: .78rem;
          line-height: 1.7;
        }

        .health-subject {
          overflow: hidden;
          border: 1px solid var(--line);
          border-radius: 22px;
          background:
            radial-gradient(circle at 100% 0%, rgba(84,232,255,.06), transparent 42%),
            rgba(255,255,255,.024);
        }

        .health-subject-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 18px;
          align-items: center;
          padding: 22px 24px;
        }

        .health-subject-copy small {
          display: block;
          color: var(--cyan);
          font-size: .55rem;
          font-weight: 950;
          letter-spacing: .12em;
          text-transform: uppercase;
        }

        .health-subject-copy h3 {
          margin: 8px 0 0;
          font-size: 1.4rem;
          line-height: 1.2;
          letter-spacing: -.025em;
        }

        .health-subject-copy p {
          margin: 8px 0 0;
          color: var(--muted);
          font-size: .68rem;
          line-height: 1.6;
        }

        .health-subject-input {
          min-width: 390px;
          min-height: 46px;
          padding: 0 13px;
          border: 1px solid var(--line);
          border-radius: 12px;
          background: #07111e;
          color: var(--text);
          outline: none;
          font-size: .70rem;
          font-weight: 850;
        }

        .health-subject-input:focus {
          border-color: rgba(84,232,255,.36);
          box-shadow: 0 0 0 3px rgba(84,232,255,.06);
        }

        .health-state-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
          margin-top: 18px;
        }

        .health-state {
          min-height: 176px;
          position: relative;
          overflow: hidden;
          padding: 18px;
          border: 1px solid var(--line);
          border-radius: 18px;
          background: rgba(255,255,255,.024);
        }

        .health-state::before {
          content: "";
          position: absolute;
          inset: 0 0 auto 0;
          height: 2px;
          opacity: .65;
        }

        .health-state.supported::before { background: var(--green); }
        .health-state.partial::before { background: var(--amber); }
        .health-state.held::before { background: var(--orange); }
        .health-state.challenged::before { background: var(--rose); }
        .health-state.untested::before { background: var(--dim); }
        .health-state.outside_scope::before { background: rgba(255,255,255,.16); }

        .health-state-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
        }

        .health-state-value {
          font-size: 2.6rem;
          line-height: .9;
          letter-spacing: -.06em;
          font-weight: 950;
        }

        .health-state-code {
          color: rgba(255,255,255,.11);
          font-size: 1.9rem;
          font-weight: 950;
        }

        .health-state h3 {
          margin: 14px 0 0;
          font-size: .92rem;
        }

        .health-state p {
          margin: 8px 0 0;
          color: var(--muted);
          font-size: .66rem;
          line-height: 1.6;
        }

        .health-state.supported .health-state-value { color: var(--green); }
        .health-state.partial .health-state-value { color: var(--amber); }
        .health-state.held .health-state-value { color: var(--orange); }
        .health-state.challenged .health-state-value { color: var(--rose); }
        .health-state.untested .health-state-value { color: #9baabd; }
        .health-state.outside_scope .health-state-value { color: #718398; }

        .health-region-stack {
          display: grid;
          gap: 16px;
        }

        .health-region {
          overflow: hidden;
          border: 1px solid var(--line);
          border-radius: 22px;
          background: rgba(255,255,255,.024);
        }

        .health-region-head {
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: 18px;
          padding: 20px 22px;
          border-bottom: 1px solid var(--line);
          background:
            radial-gradient(circle at 100% 0%, rgba(84,232,255,.05), transparent 44%),
            rgba(255,255,255,.01);
        }

        .health-region-head small {
          display: block;
          color: var(--cyan);
          font-size: .54rem;
          font-weight: 950;
          letter-spacing: .12em;
          text-transform: uppercase;
        }

        .health-region-head h3 {
          margin: 7px 0 0;
          font-size: 1.28rem;
          line-height: 1.2;
        }

        .health-region-count {
          color: var(--dim);
          font-size: .59rem;
          font-weight: 850;
        }

        .health-region-grid {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 10px;
          padding: 16px;
        }

        .health-link {
          min-height: 144px;
          display: grid;
          align-content: space-between;
          gap: 14px;
          padding: 14px;
          border: 1px solid var(--line);
          border-radius: 15px;
          background: rgba(0,0,0,.10);
          color: var(--text);
          text-align: left;
          cursor: pointer;
          transition: 160ms ease;
        }

        .health-link:hover {
          transform: translateY(-2px);
          border-color: rgba(84,232,255,.24);
          background: rgba(84,232,255,.035);
        }

        .health-link.selected {
          border-color: rgba(84,232,255,.36);
          box-shadow: inset 0 0 0 1px rgba(84,232,255,.06);
          background:
            radial-gradient(circle at 100% 0%, rgba(84,232,255,.08), transparent 44%),
            rgba(84,232,255,.04);
        }

        .health-link.state-supported {
          border-color: rgba(69,234,166,.22);
        }

        .health-link.state-partial {
          border-color: rgba(241,199,105,.22);
        }

        .health-link.state-held {
          border-color: rgba(241,163,94,.22);
        }

        .health-link.state-challenged {
          border-color: rgba(255,150,173,.22);
        }

        .health-link.state-outside_scope {
          opacity: .58;
        }

        .health-link-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 9px;
        }

        .health-link-index {
          color: var(--cyan);
          font-size: .58rem;
          font-weight: 950;
          letter-spacing: .10em;
        }

        .health-link-state {
          max-width: 96px;
          padding: 5px 7px;
          border: 1px solid var(--line);
          border-radius: 999px;
          color: var(--muted);
          font-size: .46rem;
          font-weight: 950;
          letter-spacing: .06em;
          text-transform: uppercase;
          text-align: center;
        }

        .health-link-name {
          font-size: .71rem;
          font-weight: 850;
          line-height: 1.4;
        }

        .health-link-track {
          width: 34px;
          height: 2px;
          border-radius: 999px;
          background: rgba(255,255,255,.08);
          transition: width 160ms ease;
        }

        .health-link:hover .health-link-track,
        .health-link.selected .health-link-track {
          width: 100%;
          background: rgba(84,232,255,.30);
        }

        .health-workspace {
          display: grid;
          grid-template-columns: minmax(0, .82fr) minmax(0, 1.18fr);
          gap: 20px;
          align-items: start;
        }

        .health-coordinate,
        .health-record {
          overflow: hidden;
          border: 1px solid var(--line);
          border-radius: 24px;
          background: rgba(255,255,255,.024);
        }

        .health-coordinate {
          position: sticky;
          top: 22px;
        }

        .health-coordinate-head,
        .health-record-head {
          padding: 22px 24px 20px;
          border-bottom: 1px solid var(--line);
        }

        .health-coordinate-head {
          background:
            radial-gradient(circle at 100% 0%, rgba(84,232,255,.07), transparent 42%),
            rgba(255,255,255,.01);
        }

        .health-record-head {
          background:
            radial-gradient(circle at 100% 0%, rgba(69,234,166,.07), transparent 42%),
            rgba(255,255,255,.01);
        }

        .health-panel-kicker {
          color: var(--cyan);
          font-size: .56rem;
          font-weight: 950;
          letter-spacing: .14em;
          text-transform: uppercase;
        }

        .health-record .health-panel-kicker {
          color: var(--green);
        }

        .health-coordinate-id {
          margin-top: 9px;
          color: var(--dim);
          font-size: .62rem;
          font-weight: 850;
        }

        .health-coordinate h2,
        .health-record h2 {
          margin: 9px 0 0;
          font-size: 1.75rem;
          line-height: 1.08;
          letter-spacing: -.035em;
        }

        .health-coordinate-body,
        .health-record-body {
          padding: 22px 24px 24px;
        }

        .health-coordinate-copy {
          margin: 0;
          color: var(--muted);
          font-size: .73rem;
          line-height: 1.7;
        }

        .health-coordinate-state {
          margin-top: 18px;
          padding: 14px;
          border: 1px solid var(--line);
          border-radius: 14px;
          background: rgba(0,0,0,.10);
        }

        .health-coordinate-state small {
          display: block;
          color: var(--dim);
          font-size: .50rem;
          font-weight: 900;
          letter-spacing: .10em;
          text-transform: uppercase;
        }

        .health-coordinate-state strong {
          display: block;
          margin-top: 7px;
          font-size: .88rem;
        }

        .health-coordinate-state p {
          margin: 7px 0 0;
          color: var(--muted);
          font-size: .65rem;
          line-height: 1.55;
        }

        .health-open-lesson {
          display: inline-flex;
          margin-top: 18px;
          color: var(--cyan);
          font-size: .66rem;
          font-weight: 900;
          text-decoration: none;
        }

        .health-fields {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
        }

        .health-field {
          display: grid;
          gap: 7px;
        }

        .health-field label,
        .health-field-label {
          color: #dceaf4;
          font-size: .64rem;
          font-weight: 900;
        }

        .health-select,
        .health-textarea {
          width: 100%;
          border: 1px solid var(--line);
          border-radius: 11px;
          background: #07111e;
          color: var(--text);
          outline: none;
          font-size: .66rem;
        }

        .health-select {
          min-height: 44px;
          padding: 0 11px;
        }

        .health-textarea {
          min-height: 112px;
          padding: 11px 12px;
          resize: vertical;
          line-height: 1.6;
        }

        .health-select:focus,
        .health-textarea:focus {
          border-color: rgba(69,234,166,.36);
          box-shadow: 0 0 0 3px rgba(69,234,166,.06);
        }

        .health-current-state {
          margin-top: 18px;
          overflow: hidden;
          border: 1px solid var(--line);
          border-radius: 15px;
          background: rgba(0,0,0,.10);
        }

        .health-current-state-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 12px 14px;
          border-bottom: 1px solid var(--line);
        }

        .health-current-state-head small {
          color: var(--dim);
          font-size: .50rem;
          font-weight: 900;
          letter-spacing: .10em;
          text-transform: uppercase;
        }

        .health-current-state-head strong {
          font-size: .72rem;
        }

        .health-current-state-body {
          padding: 14px;
        }

        .health-current-state-body p {
          margin: 0;
          color: var(--muted);
          font-size: .68rem;
          line-height: 1.6;
        }

        .health-boundary {
          border-top: 1px solid var(--line);
          border-bottom: 1px solid var(--line);
          background: rgba(4,12,20,.72);
        }

        .health-boundary-grid {
          display: grid;
          grid-template-columns: minmax(0, .88fr) minmax(0, 1.12fr);
          gap: 34px;
          align-items: start;
          padding: 72px 0;
        }

        .health-boundary h2 {
          margin: 9px 0 0;
          font-size: clamp(2rem, 3.4vw, 3.4rem);
          line-height: 1.04;
          letter-spacing: -.045em;
        }

        .health-boundary p {
          margin: 18px 0 0;
          color: var(--muted);
          font-size: .78rem;
          line-height: 1.75;
        }

        .health-boundary-cards {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 11px;
        }

        .health-boundary-card {
          min-height: 148px;
          padding: 16px;
          border: 1px solid var(--line);
          border-radius: 15px;
          background: rgba(255,255,255,.022);
        }

        .health-boundary-card b {
          color: var(--amber);
          font-size: .56rem;
          letter-spacing: .12em;
        }

        .health-boundary-card strong {
          display: block;
          margin-top: 8px;
          font-size: .76rem;
        }

        .health-boundary-card span {
          display: block;
          margin-top: 7px;
          color: var(--muted);
          font-size: .64rem;
          line-height: 1.55;
        }

        .health-close {
          padding: 76px 0 98px;
          text-align: center;
        }

        .health-close h2 {
          max-width: 900px;
          margin: 10px auto 0;
          font-size: clamp(2.3rem, 4.2vw, 4.6rem);
          line-height: 1;
          letter-spacing: -.05em;
        }

        .health-close p {
          max-width: 760px;
          margin: 18px auto 0;
          color: var(--muted);
          font-size: .76rem;
          line-height: 1.7;
        }

        .health-close-actions {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 10px;
          margin-top: 26px;
        }

        .health-button {
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

        .health-button.primary {
          border-color: rgba(84,232,255,.24);
          background: rgba(84,232,255,.06);
          color: var(--cyan-soft);
        }

        .health-button:hover {
          transform: translateY(-2px);
          border-color: var(--line-strong);
        }

        @media (max-width: 1180px) {
          .health-hero-grid {
            grid-template-columns: 1fr;
          }

          .health-orbit {
            max-width: 500px;
          }

          .health-region-grid {
            grid-template-columns: repeat(4, minmax(0, 1fr));
          }

          .health-workspace {
            grid-template-columns: 1fr;
          }

          .health-coordinate {
            position: static;
          }
        }

        @media (max-width: 900px) {
          .health-shell {
            width: min(100% - 28px, 1460px);
          }

          .health-topline,
          .health-section-head,
          .health-subject-grid,
          .health-region-head {
            display: grid;
            align-items: start;
          }

          .health-subject-input {
            min-width: 0;
            width: 100%;
          }

          .health-title {
            font-size: clamp(2.8rem, 13vw, 4.8rem);
          }

          .health-metric-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .health-metric {
            border-bottom: 1px solid var(--line);
          }

          .health-metric:nth-child(2n) {
            border-right: 0;
          }

          .health-state-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .health-region-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }

          .health-boundary-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 640px) {
          .health-state-grid,
          .health-region-grid,
          .health-fields,
          .health-boundary-cards {
            grid-template-columns: 1fr;
          }

          .health-node {
            display: none;
          }

          .health-close-actions {
            display: grid;
          }
        }
      `}</style>

      <section className="health-hero">
        <div className="health-shell health-topline">
          <Link
            href="/academy/24-link-architecture"
            className="health-back"
          >
            ← Back to 24-Link Explorer
          </Link>

          <span className="health-badge">
            Evidence Coordinate System
          </span>
        </div>

        <div className="health-shell health-hero-grid">
          <div>
            <div className="health-kicker">
              TA-14 Exchange · Evidence Coordinate System
            </div>

            <h1 className="health-title">
              24-Link Architecture
              <span>Health Overlay.</span>
            </h1>

            <p className="health-lead">
              Project submitted and reviewed evidence across the full TA-14
              route while preserving scope, version, challenge state, and
              visibility. Mapping does not equal endorsement, certification,
              or approval.
            </p>

            <div className="health-rules">
              <span className="health-rule">Scope remains explicit</span>
              <span className="health-rule">Version remains explicit</span>
              <span className="health-rule">Challenges remain visible</span>
              <span className="health-rule">No single-score collapse</span>
            </div>
          </div>

          <div
            className="health-orbit"
            aria-label="TA-14 architecture health overlay motif"
          >
            <div className="health-ring r1" />
            <div className="health-ring r2" />
            <div className="health-ring r3" />
            <div className="health-ring r4" />
            <div className="health-axis-h" />
            <div className="health-axis-v" />

            <div className="health-core">
              <div>
                <small>HEALTH OVERLAY</small>
                <strong>{coveragePercent}%</strong>
                <span>reviewed coverage</span>
              </div>
            </div>

            <div className="health-node n1 supported">
              <b>{counts.supported}</b>
              <span>Supported</span>
            </div>
            <div className="health-node n2 partial">
              <b>{counts.partial}</b>
              <span>Partial</span>
            </div>
            <div className="health-node n3 held">
              <b>{counts.held}</b>
              <span>Held</span>
            </div>
            <div className="health-node n4 challenged">
              <b>{counts.challenged}</b>
              <span>Challenged</span>
            </div>
            <div className="health-node n5 untested">
              <b>{counts.untested}</b>
              <span>Untested</span>
            </div>
          </div>
        </div>
      </section>

      <section className="health-metrics">
        <div className="health-shell health-metric-grid">
          <Metric value={String(reviewedCount)} label="Links reviewed" />
          <Metric
            value={`${coveragePercent}%`}
            label="Reviewed route coverage"
          />
          <Metric value={String(counts.supported)} label="Supported links" />
          <Metric value={String(counts.challenged)} label="Challenged links" />
          <Metric value={String(visibleCount)} label="Public visibility states" />
        </div>
      </section>

      <section className="health-section alt">
        <div className="health-shell">
          <div className="health-section-head">
            <div>
              <div className="health-eyebrow">
                Governed subject
              </div>
              <h2 className="health-h2">
                Name the architecture before projecting evidence across it.
              </h2>
            </div>

            <p className="health-section-copy">
              The overlay is only meaningful when the subject, review scope,
              version state, and evidence boundaries remain identifiable. This
              interaction does not create a Registry record by itself.
            </p>
          </div>

          <div className="health-subject">
            <div className="health-subject-grid">
              <div className="health-subject-copy">
                <small>Registered architecture / governed subject</small>
                <h3>{architectureName || "Unnamed architecture"}</h3>
                <p>
                  Edit the working subject name for this local evidence-state
                  projection.
                </p>
              </div>

              <input
                value={architectureName}
                onChange={(event) => setArchitectureName(event.target.value)}
                className="health-subject-input"
                aria-label="Registered architecture or governed subject"
              />
            </div>
          </div>

          <div className="health-state-grid">
            {HEALTH_STATES.map((state, index) => (
              <article
                key={state}
                className={`health-state ${state}`}
              >
                <div className="health-state-top">
                  <strong className="health-state-value">
                    {counts[state]}
                  </strong>
                  <span className="health-state-code">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <h3>{HEALTH_LABELS[state]}</h3>
                <p>{HEALTH_COPY[state]}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="health-section">
        <div className="health-shell">
          <div className="health-section-head">
            <div>
              <div
                className="health-eyebrow"
                style={{ color: "var(--green)" }}
              >
                Full-chain evidence map
              </div>
              <h2 className="health-h2">
                Inspect the evidence state of every canonical coordinate.
              </h2>
            </div>

            <p className="health-section-copy">
              Each region preserves the health state of its own links. Select a
              coordinate to inspect or edit the bounded evidence record without
              collapsing the route into a single architecture score.
            </p>
          </div>

          <div className="health-region-stack">
            {TA14_ARCHITECTURE_REGIONS.map((region) => {
              const regionLinks = region.linkIds
                .map((linkId) =>
                  TA14_24_LINKS.find((item) => item.linkId === linkId),
                )
                .filter(
                  (
                    item,
                  ): item is (typeof TA14_24_LINKS)[number] => Boolean(item),
                );

              const regionReviewed = regionLinks.filter(
                (item) =>
                  records[item.linkId].state !== "untested" &&
                  records[item.linkId].state !== "outside_scope",
              ).length;

              return (
                <section
                  key={region.id}
                  className="health-region"
                >
                  <div className="health-region-head">
                    <div>
                      <small>Architecture region</small>
                      <h3>{region.label}</h3>
                    </div>

                    <span className="health-region-count">
                      {regionReviewed} of {regionLinks.length} reviewed
                    </span>
                  </div>

                  <div className="health-region-grid">
                    {regionLinks.map((item) => {
                      const record = records[item.linkId];

                      return (
                        <button
                          key={item.linkId}
                          type="button"
                          onClick={() => setSelectedLinkId(item.linkId)}
                          className={[
                            "health-link",
                            `state-${record.state}`,
                            selectedLinkId === item.linkId ? "selected" : "",
                          ]
                            .filter(Boolean)
                            .join(" ")}
                        >
                          <div className="health-link-top">
                            <span className="health-link-index">
                              {String(item.order).padStart(2, "0")}
                            </span>

                            <span className="health-link-state">
                              {HEALTH_SHORT[record.state]}
                            </span>
                          </div>

                          <div>
                            <div className="health-link-name">
                              {item.canonicalName}
                            </div>
                            <div className="health-link-track" />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </section>

      <section className="health-section alt">
        <div className="health-shell">
          <div className="health-section-head">
            <div>
              <div
                className="health-eyebrow"
                style={{ color: "var(--indigo)" }}
              >
                Selected coordinate
              </div>
              <h2 className="health-h2">
                Inspect the link. Preserve its evidence boundary.
              </h2>
            </div>

            <p className="health-section-copy">
              The selected coordinate panel separates canonical doctrine from
              the local evidence-state record. Change the state, visibility,
              artifact, scope, version, or challenge information without
              altering the canonical link itself.
            </p>
          </div>

          <div className="health-workspace">
            <aside className="health-coordinate">
              <div className="health-coordinate-head">
                <div className="health-panel-kicker">
                  Selected coordinate
                </div>
                <div className="health-coordinate-id">
                  {selectedLink.linkId}
                </div>
                <h2>
                  {String(selectedLink.order).padStart(2, "0")}{" "}
                  {selectedLink.canonicalName}
                </h2>
              </div>

              <div className="health-coordinate-body">
                <p className="health-coordinate-copy">
                  {selectedLink.definition}
                </p>

                <div className="health-coordinate-state">
                  <small>Current evidence state</small>
                  <strong>
                    {HEALTH_LABELS[selectedRecord.state]}
                  </strong>
                  <p>
                    {HEALTH_COPY[selectedRecord.state]}
                  </p>
                </div>

                <Link
                  href={`/academy/24-link-architecture/${String(
                    selectedLink.order,
                  ).padStart(2, "0")}-${selectedLink.slug}`}
                  className="health-open-lesson"
                >
                  Open canonical lesson →
                </Link>
              </div>
            </aside>

            <section className="health-record">
              <div className="health-record-head">
                <div className="health-panel-kicker">
                  Evidence-state record
                </div>
                <h2>{architectureName || "Unnamed architecture"}</h2>
              </div>

              <div className="health-record-body">
                <div className="health-fields">
                  <div className="health-field">
                    <span className="health-field-label">
                      Evidence health
                    </span>

                    <select
                      value={selectedRecord.state}
                      onChange={(event) =>
                        updateRecord(selectedLinkId, {
                          state:
                            event.target.value as TA14EvidenceHealthState,
                        })
                      }
                      className="health-select"
                    >
                      {HEALTH_STATES.map((state) => (
                        <option key={state} value={state}>
                          {HEALTH_LABELS[state]}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="health-field">
                    <span className="health-field-label">
                      Visibility boundary
                    </span>

                    <select
                      value={selectedRecord.visibility}
                      onChange={(event) =>
                        updateRecord(selectedLinkId, {
                          visibility: event.target.value as
                            | "public"
                            | "private"
                            | "mixed",
                        })
                      }
                      className="health-select"
                    >
                      <option value="public">Public</option>
                      <option value="private">Private</option>
                      <option value="mixed">Mixed</option>
                    </select>
                  </div>

                  <TextField
                    label="Supporting artifact / evidence"
                    value={selectedRecord.artifact}
                    onChange={(artifact) =>
                      updateRecord(selectedLinkId, { artifact })
                    }
                  />

                  <TextField
                    label="Declared review scope"
                    value={selectedRecord.scope}
                    onChange={(scope) =>
                      updateRecord(selectedLinkId, { scope })
                    }
                  />

                  <TextField
                    label="Version / continuity state"
                    value={selectedRecord.version}
                    onChange={(version) =>
                      updateRecord(selectedLinkId, { version })
                    }
                  />

                  <TextField
                    label="Challenge / correction state"
                    value={selectedRecord.challenge}
                    onChange={(challenge) =>
                      updateRecord(selectedLinkId, { challenge })
                    }
                  />
                </div>

                <div className="health-current-state">
                  <div className="health-current-state-head">
                    <small>Bounded interpretation</small>
                    <strong>
                      {HEALTH_LABELS[selectedRecord.state]}
                    </strong>
                  </div>

                  <div className="health-current-state-body">
                    <p>{HEALTH_COPY[selectedRecord.state]}</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>

      <section className="health-boundary">
        <div className="health-shell health-boundary-grid">
          <div>
            <div
              className="health-eyebrow"
              style={{ color: "var(--amber)" }}
            >
              Review boundary
            </div>

            <h2>
              A mapped link is not an approved architecture.
            </h2>

            <p>
              Each cell represents a bounded evidence state within a declared
              scope and version. The overlay must preserve separate artifact,
              review, challenge, correction, and visibility records.
              Unsupported, partial, held, challenged, untested, and
              outside-scope states remain visible rather than being collapsed
              into a single score.
            </p>
          </div>

          <div className="health-boundary-cards">
            <BoundaryCard
              code="SC"
              title="Scope remains bounded"
              text="A Supported state applies only to the declared review scope and does not automatically extend to the entire architecture."
            />

            <BoundaryCard
              code="VR"
              title="Version remains explicit"
              text="Evidence health can change when the architecture, dependency, implementation, or reviewed version changes."
            />

            <BoundaryCard
              code="CH"
              title="Challenges remain visible"
              text="A challenge or correction should remain an attributable record rather than being silently absorbed into a new status."
            />

            <BoundaryCard
              code="NS"
              title="No single score"
              text="TA-14 preserves the state of each link independently so gaps, uncertainty, and outside-scope areas remain inspectable."
            />
          </div>
        </div>
      </section>

      <section className="health-close">
        <div className="health-shell">
          <div
            className="health-eyebrow"
            style={{ color: "var(--green)" }}
          >
            Evidence health as coordinate state
          </div>

          <h2>
            Show what is supported.
            <br />
            Show what is not.
          </h2>

          <p>
            The overlay is useful because it refuses to convert a complex
            governance architecture into a reassuring percentage. It preserves
            the actual evidence condition of every canonical link.
          </p>

          <div className="health-close-actions">
            <Link
              href="/academy/24-link-architecture"
              className="health-button primary"
            >
              Return to 24-Link Explorer →
            </Link>

            <Link
              href="/academy/24-link-architecture/build-a-chain"
              className="health-button"
            >
              Open Build-a-Chain Lab
            </Link>

            <Link
              href="/academy/24-link-architecture/provenance"
              className="health-button"
            >
              Trace Provenance
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
    <div className="health-metric">
      <strong>{value}</strong>
      <span>{label}</span>
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
    <div className="health-field">
      <span className="health-field-label">{label}</span>

      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={4}
        className="health-textarea"
      />
    </div>
  );
}

function BoundaryCard({
  code,
  title,
  text,
}: {
  code: string;
  title: string;
  text: string;
}) {
  return (
    <article className="health-boundary-card">
      <b>{code}</b>
      <strong>{title}</strong>
      <span>{text}</span>
    </article>
  );
}
