"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import {
  TA14_24_LINKS,
  type TA14EvidenceHealthState,
  type TA14LinkId,
} from "@/lib/academy/ta14-24-link-canon";

type Assessment = {
  state: TA14EvidenceHealthState;
  evidence: string;
  note: string;
};

const STATES: readonly TA14EvidenceHealthState[] = [
  "supported",
  "partial",
  "held",
  "challenged",
  "untested",
  "outside_scope",
];

const LABEL: Record<TA14EvidenceHealthState, string> = {
  supported: "Supported",
  partial: "Partial",
  held: "Held",
  challenged: "Challenged",
  untested: "Untested",
  outside_scope: "Outside scope",
};

const STATE_COPY: Record<TA14EvidenceHealthState, string> = {
  supported:
    "Evidence currently supports this link within the declared working scope.",
  partial:
    "Some evidence supports the link, but the record remains incomplete.",
  held:
    "Progress is paused pending additional evidence, recovery, or resolution.",
  challenged:
    "A challenge exists against the evidence, interpretation, or current finding.",
  untested:
    "No working determination has yet been made for this link.",
  outside_scope:
    "This link is not included in the current declared mapping scope.",
};

const STATE_CODE: Record<TA14EvidenceHealthState, string> = {
  supported: "SUP",
  partial: "PAR",
  held: "HLD",
  challenged: "CHL",
  untested: "UNT",
  outside_scope: "OOS",
};

export default function TA14BuildAChainLabPage() {
  const [subject, setSubject] = useState("My governed system");
  const [selected, setSelected] = useState<TA14LinkId>("TA14-LINK-01");

  const [assessments, setAssessments] = useState<
    Record<TA14LinkId, Assessment>
  >(
    () =>
      Object.fromEntries(
        TA14_24_LINKS.map((item) => [
          item.linkId,
          { state: "untested", evidence: "", note: "" },
        ]),
      ) as Record<TA14LinkId, Assessment>,
  );

  const link = useMemo(
    () => TA14_24_LINKS.find((item) => item.linkId === selected)!,
    [selected],
  );

  const record = assessments[selected];

  const totals = useMemo(
    () =>
      STATES.reduce(
        (result, state) => {
          result[state] = TA14_24_LINKS.filter(
            (item) => assessments[item.linkId].state === state,
          ).length;
          return result;
        },
        {} as Record<TA14EvidenceHealthState, number>,
      ),
    [assessments],
  );

  const reviewed = useMemo(
    () =>
      totals.supported +
      totals.partial +
      totals.held +
      totals.challenged,
    [totals],
  );

  const mappedArtifacts = useMemo(
    () =>
      TA14_24_LINKS.filter(
        (item) => assessments[item.linkId].evidence.trim().length > 0,
      ).length,
    [assessments],
  );

  const notedLinks = useMemo(
    () =>
      TA14_24_LINKS.filter(
        (item) => assessments[item.linkId].note.trim().length > 0,
      ).length,
    [assessments],
  );

  const coverage = Math.round((reviewed / TA14_24_LINKS.length) * 100);

  function update(patch: Partial<Assessment>) {
    setAssessments((current) => ({
      ...current,
      [selected]: { ...current[selected], ...patch },
    }));
  }

  return (
    <main className="build">
      <style>{`
        .build {
          --bg: #020711;
          --panel: rgba(8, 20, 32, .86);
          --panel-2: rgba(10, 26, 40, .76);
          --line: rgba(129, 176, 210, .14);
          --line-strong: rgba(84, 232, 255, .26);
          --purple: #c084fc;
          --purple-soft: #ead8ff;
          --cyan: #54e8ff;
          --cyan-soft: #c4f8ff;
          --green: #45eaa6;
          --green-soft: #c8f7df;
          --amber: #f1c769;
          --orange: #f1a35e;
          --rose: #ff96ad;
          --indigo: #a8b2ff;
          --text: #eff8ff;
          --muted: #93a8ba;
          --dim: #647b8f;
          min-height: 100vh;
          overflow: hidden;
          color: var(--text);
          background:
            radial-gradient(circle at 10% 0%, rgba(192,132,252,.13), transparent 24%),
            radial-gradient(circle at 92% 5%, rgba(84,232,255,.09), transparent 25%),
            linear-gradient(180deg, #020711 0%, #030a13 55%, #020711 100%);
        }

        .build * {
          box-sizing: border-box;
        }

        .build-shell {
          width: min(1460px, calc(100% - 48px));
          margin: 0 auto;
        }

        .build-hero {
          position: relative;
          overflow: hidden;
          border-bottom: 1px solid var(--line);
        }

        .build-hero::before {
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

        .build-topline {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          padding-top: 20px;
        }

        .build-back {
          color: var(--cyan-soft);
          font-size: .72rem;
          font-weight: 900;
          text-decoration: none;
        }

        .build-badge {
          display: inline-flex;
          align-items: center;
          min-height: 34px;
          padding: 0 12px;
          border: 1px solid rgba(192,132,252,.22);
          border-radius: 999px;
          background: rgba(192,132,252,.05);
          color: var(--purple-soft);
          font-size: .56rem;
          font-weight: 950;
          letter-spacing: .12em;
          text-transform: uppercase;
        }

        .build-hero-grid {
          position: relative;
          display: grid;
          grid-template-columns: minmax(0, 1.08fr) minmax(420px, .92fr);
          gap: 64px;
          align-items: center;
          padding: 72px 0 84px;
        }

        .build-kicker {
          color: var(--purple);
          font-size: .64rem;
          font-weight: 950;
          letter-spacing: .20em;
          text-transform: uppercase;
        }

        .build-title {
          max-width: 980px;
          margin: 14px 0 0;
          font-size: clamp(3.2rem, 6vw, 6.2rem);
          line-height: .95;
          letter-spacing: -.06em;
        }

        .build-title span {
          display: block;
          color: var(--purple-soft);
        }

        .build-lead {
          max-width: 920px;
          margin: 26px 0 0;
          color: #c8d8e4;
          font-size: clamp(1rem, 1.35vw, 1.18rem);
          line-height: 1.8;
        }

        .build-rules {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 24px;
        }

        .build-rule {
          padding: 7px 10px;
          border: 1px solid var(--line);
          border-radius: 999px;
          background: rgba(255,255,255,.026);
          color: var(--muted);
          font-size: .56rem;
          font-weight: 850;
        }

        .build-orbit {
          position: relative;
          width: min(510px, 100%);
          aspect-ratio: 1;
          margin: 0 auto;
        }

        .build-ring {
          position: absolute;
          inset: 50% auto auto 50%;
          transform: translate(-50%, -50%);
          border: 1px solid rgba(129,176,210,.10);
          border-radius: 50%;
        }

        .build-ring.r1 {
          width: 96%;
          height: 96%;
        }

        .build-ring.r2 {
          width: 76%;
          height: 76%;
          border-color: rgba(192,132,252,.14);
        }

        .build-ring.r3 {
          width: 56%;
          height: 56%;
          border-color: rgba(84,232,255,.12);
        }

        .build-ring.r4 {
          width: 36%;
          height: 36%;
          border-color: rgba(69,234,166,.12);
        }

        .build-axis-h,
        .build-axis-v {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }

        .build-axis-h {
          width: 88%;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(192,132,252,.17),
            transparent
          );
        }

        .build-axis-v {
          width: 1px;
          height: 88%;
          background: linear-gradient(
            180deg,
            transparent,
            rgba(84,232,255,.13),
            transparent
          );
        }

        .build-core {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 182px;
          height: 182px;
          transform: translate(-50%, -50%);
          display: grid;
          place-items: center;
          border: 1px solid rgba(192,132,252,.27);
          border-radius: 50%;
          background:
            radial-gradient(circle at 30% 25%, rgba(192,132,252,.13), transparent 44%),
            rgba(5,16,27,.95);
          box-shadow: 0 0 90px rgba(192,132,252,.09);
          text-align: center;
        }

        .build-core small {
          display: block;
          color: var(--purple);
          font-size: .58rem;
          font-weight: 950;
          letter-spacing: .18em;
        }

        .build-core strong {
          display: block;
          margin-top: 5px;
          font-size: 3.4rem;
          line-height: 1;
          letter-spacing: -.06em;
        }

        .build-core span {
          display: block;
          margin-top: 7px;
          color: var(--muted);
          font-size: .64rem;
        }

        .build-node {
          position: absolute;
          min-width: 116px;
          padding: 10px 12px;
          border: 1px solid var(--line);
          border-radius: 13px;
          background: rgba(5,16,27,.92);
          box-shadow: 0 12px 34px rgba(0,0,0,.24);
        }

        .build-node b {
          display: block;
          color: var(--purple);
          font-size: .55rem;
          letter-spacing: .12em;
        }

        .build-node span {
          display: block;
          margin-top: 4px;
          color: #d7e5ef;
          font-size: .66rem;
          font-weight: 850;
        }

        .build-node.n1 {
          left: 0;
          top: 18%;
        }

        .build-node.n2 {
          right: 0;
          top: 24%;
        }

        .build-node.n3 {
          right: 4%;
          bottom: 18%;
        }

        .build-node.n4 {
          left: 0;
          bottom: 18%;
        }

        .build-node.n5 {
          left: 50%;
          top: 0;
          transform: translateX(-50%);
        }

        .build-metrics {
          border-bottom: 1px solid var(--line);
          background: rgba(4,12,20,.76);
        }

        .build-metric-grid {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
        }

        .build-metric {
          min-height: 98px;
          padding: 20px;
          border-right: 1px solid var(--line);
        }

        .build-metric:last-child {
          border-right: 0;
        }

        .build-metric strong {
          display: block;
          font-size: 2rem;
          line-height: 1;
          letter-spacing: -.04em;
        }

        .build-metric span {
          display: block;
          margin-top: 8px;
          color: var(--dim);
          font-size: .58rem;
          font-weight: 900;
          letter-spacing: .10em;
          text-transform: uppercase;
        }

        .build-section {
          padding: 72px 0 90px;
        }

        .build-section.alt {
          border-top: 1px solid var(--line);
          border-bottom: 1px solid var(--line);
          background: rgba(4,12,20,.66);
        }

        .build-section-head {
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: 28px;
          margin-bottom: 28px;
        }

        .build-eyebrow {
          color: var(--cyan);
          font-size: .62rem;
          font-weight: 950;
          letter-spacing: .16em;
          text-transform: uppercase;
        }

        .build-h2 {
          margin: 9px 0 0;
          font-size: clamp(2rem, 3.4vw, 3.7rem);
          line-height: 1;
          letter-spacing: -.045em;
        }

        .build-section-copy {
          max-width: 620px;
          margin: 0;
          color: var(--muted);
          font-size: .78rem;
          line-height: 1.7;
        }

        .build-subject {
          overflow: hidden;
          border: 1px solid var(--line);
          border-radius: 22px;
          background:
            radial-gradient(circle at 100% 0%, rgba(192,132,252,.07), transparent 42%),
            rgba(255,255,255,.024);
        }

        .build-subject-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 18px;
          align-items: center;
          padding: 22px 24px;
        }

        .build-subject-copy small {
          display: block;
          color: var(--purple);
          font-size: .55rem;
          font-weight: 950;
          letter-spacing: .12em;
          text-transform: uppercase;
        }

        .build-subject-copy h3 {
          margin: 8px 0 0;
          font-size: 1.4rem;
          line-height: 1.2;
          letter-spacing: -.025em;
        }

        .build-subject-copy p {
          margin: 8px 0 0;
          color: var(--muted);
          font-size: .68rem;
          line-height: 1.6;
        }

        .build-subject-input {
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

        .build-subject-input:focus {
          border-color: rgba(192,132,252,.38);
          box-shadow: 0 0 0 3px rgba(192,132,252,.07);
        }

        .build-state-grid {
          display: grid;
          grid-template-columns: repeat(6, minmax(0, 1fr));
          gap: 10px;
          margin-top: 18px;
        }

        .build-state {
          min-height: 154px;
          position: relative;
          overflow: hidden;
          padding: 16px;
          border: 1px solid var(--line);
          border-radius: 17px;
          background: rgba(255,255,255,.024);
        }

        .build-state::before {
          content: "";
          position: absolute;
          inset: 0 0 auto 0;
          height: 2px;
          opacity: .72;
        }

        .build-state.supported::before { background: var(--green); }
        .build-state.partial::before { background: var(--amber); }
        .build-state.held::before { background: var(--orange); }
        .build-state.challenged::before { background: var(--rose); }
        .build-state.untested::before { background: var(--dim); }
        .build-state.outside_scope::before { background: rgba(255,255,255,.18); }

        .build-state strong {
          display: block;
          font-size: 2.5rem;
          line-height: .9;
          letter-spacing: -.06em;
        }

        .build-state h3 {
          margin: 14px 0 0;
          font-size: .82rem;
        }

        .build-state p {
          margin: 7px 0 0;
          color: var(--muted);
          font-size: .60rem;
          line-height: 1.55;
        }

        .build-state.supported strong { color: var(--green); }
        .build-state.partial strong { color: var(--amber); }
        .build-state.held strong { color: var(--orange); }
        .build-state.challenged strong { color: var(--rose); }
        .build-state.untested strong { color: #9baabd; }
        .build-state.outside_scope strong { color: #718398; }

        .build-workspace {
          display: grid;
          grid-template-columns: minmax(0, 1.08fr) minmax(390px, .92fr);
          gap: 20px;
          align-items: start;
        }

        .build-map,
        .build-editor {
          overflow: hidden;
          border: 1px solid var(--line);
          border-radius: 24px;
          background: rgba(255,255,255,.024);
        }

        .build-map-head,
        .build-editor-head {
          padding: 22px 24px 20px;
          border-bottom: 1px solid var(--line);
        }

        .build-map-head {
          background:
            radial-gradient(circle at 100% 0%, rgba(192,132,252,.07), transparent 42%),
            rgba(255,255,255,.01);
        }

        .build-editor-head {
          background:
            radial-gradient(circle at 100% 0%, rgba(84,232,255,.07), transparent 42%),
            rgba(255,255,255,.01);
        }

        .build-panel-kicker {
          color: var(--purple);
          font-size: .56rem;
          font-weight: 950;
          letter-spacing: .14em;
          text-transform: uppercase;
        }

        .build-editor .build-panel-kicker {
          color: var(--cyan);
        }

        .build-map h2,
        .build-editor h2 {
          margin: 8px 0 0;
          font-size: 1.75rem;
          line-height: 1.08;
          letter-spacing: -.035em;
        }

        .build-map-head p,
        .build-editor-head p {
          margin: 10px 0 0;
          color: var(--muted);
          font-size: .70rem;
          line-height: 1.6;
        }

        .build-map-body,
        .build-editor-body {
          padding: 18px;
        }

        .build-link-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 10px;
        }

        .build-link {
          min-height: 148px;
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

        .build-link:hover {
          transform: translateY(-2px);
          border-color: rgba(192,132,252,.26);
          background: rgba(192,132,252,.035);
        }

        .build-link.selected {
          border-color: rgba(192,132,252,.40);
          box-shadow: inset 0 0 0 1px rgba(192,132,252,.07);
          background:
            radial-gradient(circle at 100% 0%, rgba(192,132,252,.09), transparent 44%),
            rgba(192,132,252,.045);
        }

        .build-link.state-supported { border-color: rgba(69,234,166,.21); }
        .build-link.state-partial { border-color: rgba(241,199,105,.21); }
        .build-link.state-held { border-color: rgba(241,163,94,.21); }
        .build-link.state-challenged { border-color: rgba(255,150,173,.21); }
        .build-link.state-outside_scope { opacity: .58; }

        .build-link-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 9px;
        }

        .build-link-index {
          color: var(--cyan);
          font-size: .58rem;
          font-weight: 950;
          letter-spacing: .10em;
        }

        .build-link-state {
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

        .build-link-name {
          font-size: .72rem;
          font-weight: 850;
          line-height: 1.4;
        }

        .build-link-evidence {
          margin-top: 7px;
          color: var(--dim);
          font-size: .56rem;
          line-height: 1.4;
        }

        .build-link-track {
          width: 34px;
          height: 2px;
          border-radius: 999px;
          background: rgba(255,255,255,.08);
          transition: width 160ms ease;
        }

        .build-link:hover .build-link-track,
        .build-link.selected .build-link-track {
          width: 100%;
          background: rgba(192,132,252,.34);
        }

        .build-editor {
          position: sticky;
          top: 22px;
        }

        .build-editor-id {
          margin-top: 9px;
          color: var(--dim);
          font-size: .61rem;
          font-weight: 850;
        }

        .build-question {
          margin-top: 16px;
          padding: 14px;
          border: 1px solid rgba(84,232,255,.14);
          border-radius: 14px;
          background: rgba(84,232,255,.035);
        }

        .build-question small {
          display: block;
          color: var(--cyan);
          font-size: .50rem;
          font-weight: 950;
          letter-spacing: .11em;
          text-transform: uppercase;
        }

        .build-question p {
          margin: 7px 0 0;
          color: #dceaf4;
          font-size: .70rem;
          line-height: 1.55;
        }

        .build-fields {
          display: grid;
          gap: 15px;
          margin-top: 18px;
        }

        .build-field {
          display: grid;
          gap: 7px;
        }

        .build-field label,
        .build-field-label {
          color: #dceaf4;
          font-size: .64rem;
          font-weight: 900;
        }

        .build-select,
        .build-textarea {
          width: 100%;
          border: 1px solid var(--line);
          border-radius: 11px;
          background: #07111e;
          color: var(--text);
          outline: none;
          font-size: .66rem;
        }

        .build-select {
          min-height: 44px;
          padding: 0 11px;
        }

        .build-textarea {
          min-height: 112px;
          padding: 11px 12px;
          resize: vertical;
          line-height: 1.6;
        }

        .build-select:focus,
        .build-textarea:focus {
          border-color: rgba(192,132,252,.38);
          box-shadow: 0 0 0 3px rgba(192,132,252,.07);
        }

        .build-expects {
          margin-top: 18px;
          overflow: hidden;
          border: 1px solid var(--line);
          border-radius: 15px;
          background: rgba(0,0,0,.10);
        }

        .build-expects-head {
          padding: 12px 14px;
          border-bottom: 1px solid var(--line);
          color: var(--dim);
          font-size: .50rem;
          font-weight: 900;
          letter-spacing: .10em;
          text-transform: uppercase;
        }

        .build-expects-body {
          display: grid;
          gap: 8px;
          padding: 14px;
        }

        .build-expectation {
          display: grid;
          grid-template-columns: 22px 1fr;
          gap: 8px;
          align-items: start;
          color: var(--muted);
          font-size: .65rem;
          line-height: 1.5;
        }

        .build-expectation span:first-child {
          color: var(--green);
          font-weight: 950;
        }

        .build-current {
          margin-top: 18px;
          overflow: hidden;
          border: 1px solid var(--line);
          border-radius: 15px;
          background: rgba(0,0,0,.10);
        }

        .build-current-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 12px 14px;
          border-bottom: 1px solid var(--line);
        }

        .build-current-head small {
          color: var(--dim);
          font-size: .50rem;
          font-weight: 900;
          letter-spacing: .10em;
          text-transform: uppercase;
        }

        .build-current-head strong {
          color: var(--purple-soft);
          font-size: .70rem;
        }

        .build-current-body {
          padding: 14px;
        }

        .build-current-body p {
          margin: 0;
          color: var(--muted);
          font-size: .67rem;
          line-height: 1.6;
        }

        .build-open {
          display: inline-flex;
          margin-top: 18px;
          color: var(--cyan);
          font-size: .66rem;
          font-weight: 900;
          text-decoration: none;
        }

        .build-finding {
          border-top: 1px solid var(--line);
          border-bottom: 1px solid var(--line);
          background: rgba(4,12,20,.72);
        }

        .build-finding-grid {
          display: grid;
          grid-template-columns: minmax(0, .82fr) minmax(0, 1.18fr);
          gap: 34px;
          align-items: start;
          padding: 72px 0;
        }

        .build-finding h2 {
          margin: 9px 0 0;
          font-size: clamp(2rem, 3.4vw, 3.4rem);
          line-height: 1.04;
          letter-spacing: -.045em;
        }

        .build-finding p {
          margin: 18px 0 0;
          color: var(--muted);
          font-size: .78rem;
          line-height: 1.75;
        }

        .build-finding-cards {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 11px;
        }

        .build-finding-card {
          min-height: 148px;
          padding: 16px;
          border: 1px solid var(--line);
          border-radius: 15px;
          background: rgba(255,255,255,.022);
        }

        .build-finding-card b {
          color: var(--amber);
          font-size: .56rem;
          letter-spacing: .12em;
        }

        .build-finding-card strong {
          display: block;
          margin-top: 8px;
          font-size: .76rem;
        }

        .build-finding-card span {
          display: block;
          margin-top: 7px;
          color: var(--muted);
          font-size: .64rem;
          line-height: 1.55;
        }

        .build-close {
          padding: 76px 0 98px;
          text-align: center;
        }

        .build-close h2 {
          max-width: 900px;
          margin: 10px auto 0;
          font-size: clamp(2.3rem, 4.2vw, 4.6rem);
          line-height: 1;
          letter-spacing: -.05em;
        }

        .build-close p {
          max-width: 760px;
          margin: 18px auto 0;
          color: var(--muted);
          font-size: .76rem;
          line-height: 1.7;
        }

        .build-close-actions {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 10px;
          margin-top: 26px;
        }

        .build-button {
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

        .build-button.primary {
          border-color: rgba(192,132,252,.26);
          background: rgba(192,132,252,.07);
          color: var(--purple-soft);
        }

        .build-button:hover {
          transform: translateY(-2px);
          border-color: var(--line-strong);
        }

        @media (max-width: 1180px) {
          .build-hero-grid {
            grid-template-columns: 1fr;
          }

          .build-orbit {
            max-width: 500px;
          }

          .build-state-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }

          .build-workspace {
            grid-template-columns: 1fr;
          }

          .build-editor {
            position: static;
          }
        }

        @media (max-width: 900px) {
          .build-shell {
            width: min(100% - 28px, 1460px);
          }

          .build-topline,
          .build-section-head,
          .build-subject-grid {
            display: grid;
            align-items: start;
          }

          .build-subject-input {
            min-width: 0;
            width: 100%;
          }

          .build-title {
            font-size: clamp(2.8rem, 13vw, 4.8rem);
          }

          .build-metric-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .build-metric {
            border-bottom: 1px solid var(--line);
          }

          .build-metric:nth-child(2n) {
            border-right: 0;
          }

          .build-link-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .build-finding-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 640px) {
          .build-state-grid,
          .build-link-grid,
          .build-finding-cards {
            grid-template-columns: 1fr;
          }

          .build-node {
            display: none;
          }

          .build-close-actions {
            display: grid;
          }
        }
      `}</style>

      <section className="build-hero">
        <div className="build-shell build-topline">
          <Link
            href="/academy/24-link-architecture"
            className="build-back"
          >
            ← Back to 24-Link Explorer
          </Link>

          <span className="build-badge">
            Applied Architecture Lab
          </span>
        </div>

        <div className="build-shell build-hero-grid">
          <div>
            <div className="build-kicker">
              TA-14 Academy · Applied Architecture Lab
            </div>

            <h1 className="build-title">
              Build-a-Chain
              <span>Lab.</span>
            </h1>

            <p className="build-lead">
              Take a real AI system, workflow, environmental process, HVAC
              procedure, governance architecture, or other consequence-bearing
              system and map what its evidence actually supports across all 24
              TA-14 links.
            </p>

            <div className="build-rules">
              <span className="build-rule">
                Map actual evidence
              </span>
              <span className="build-rule">
                Preserve uncertainty
              </span>
              <span className="build-rule">
                Keep outside-scope visible
              </span>
              <span className="build-rule">
                Working map ≠ certification
              </span>
            </div>
          </div>

          <div
            className="build-orbit"
            aria-label="TA-14 Build-a-Chain architecture mapping motif"
          >
            <div className="build-ring r1" />
            <div className="build-ring r2" />
            <div className="build-ring r3" />
            <div className="build-ring r4" />
            <div className="build-axis-h" />
            <div className="build-axis-v" />

            <div className="build-core">
              <div>
                <small>BUILD-A-CHAIN</small>
                <strong>{reviewed}/24</strong>
                <span>links mapped</span>
              </div>
            </div>

            <div className="build-node n1">
              <b>{totals.supported}</b>
              <span>Supported</span>
            </div>

            <div className="build-node n2">
              <b>{totals.partial}</b>
              <span>Partial</span>
            </div>

            <div className="build-node n3">
              <b>{mappedArtifacts}</b>
              <span>Artifacts mapped</span>
            </div>

            <div className="build-node n4">
              <b>{notedLinks}</b>
              <span>Notes recorded</span>
            </div>

            <div className="build-node n5">
              <b>{coverage}%</b>
              <span>Working coverage</span>
            </div>
          </div>
        </div>
      </section>

      <section className="build-metrics">
        <div className="build-shell build-metric-grid">
          <Metric value={String(reviewed)} label="Links assessed" />
          <Metric value={`${coverage}%`} label="Working coverage" />
          <Metric value={String(mappedArtifacts)} label="Evidence-bearing links" />
          <Metric value={String(notedLinks)} label="Assessment notes" />
          <Metric value={String(totals.untested)} label="Untested links" />
        </div>
      </section>

      <section className="build-section alt">
        <div className="build-shell">
          <div className="build-section-head">
            <div>
              <div
                className="build-eyebrow"
                style={{ color: "var(--purple)" }}
              >
                Governed subject
              </div>

              <h2 className="build-h2">
                Name what you are actually mapping.
              </h2>
            </div>

            <p className="build-section-copy">
              The lab is only meaningful when the subject remains bounded.
              Name the system, architecture, workflow, process, or procedure
              whose evidence you are evaluating across the canonical route.
            </p>
          </div>

          <div className="build-subject">
            <div className="build-subject-grid">
              <div className="build-subject-copy">
                <small>System or architecture being mapped</small>
                <h3>{subject || "Unnamed governed system"}</h3>
                <p>
                  This working subject name stays local to the lab interaction.
                </p>
              </div>

              <input
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
                className="build-subject-input"
                aria-label="System or architecture being mapped"
              />
            </div>
          </div>

          <div className="build-state-grid">
            {STATES.map((state) => (
              <article
                key={state}
                className={`build-state ${state}`}
              >
                <strong>{totals[state]}</strong>
                <h3>{LABEL[state]}</h3>
                <p>{STATE_COPY[state]}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="build-section">
        <div className="build-shell">
          <div className="build-section-head">
            <div>
              <div className="build-eyebrow">
                24-Link map
              </div>

              <h2 className="build-h2">
                Select a coordinate. Attach the evidence that actually exists.
              </h2>
            </div>

            <p className="build-section-copy">
              Every link can carry its own state, evidence or artifact, and
              assessment note. The lab keeps those determinations separate so
              a strong link does not hide a weak one.
            </p>
          </div>

          <div className="build-workspace">
            <section className="build-map">
              <div className="build-map-head">
                <div className="build-panel-kicker">
                  Full-chain evidence map
                </div>

                <h2>{subject || "Unnamed governed system"}</h2>

                <p>
                  Choose any canonical link to inspect or update its current
                  working evidence state.
                </p>
              </div>

              <div className="build-map-body">
                <div className="build-link-grid">
                  {TA14_24_LINKS.map((item) => {
                    const itemRecord = assessments[item.linkId];

                    return (
                      <button
                        key={item.linkId}
                        type="button"
                        onClick={() => setSelected(item.linkId)}
                        className={[
                          "build-link",
                          `state-${itemRecord.state}`,
                          selected === item.linkId ? "selected" : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                      >
                        <div className="build-link-top">
                          <span className="build-link-index">
                            {String(item.order).padStart(2, "0")}
                          </span>

                          <span className="build-link-state">
                            {STATE_CODE[itemRecord.state]}
                          </span>
                        </div>

                        <div>
                          <div className="build-link-name">
                            {item.canonicalName}
                          </div>

                          <div className="build-link-evidence">
                            {itemRecord.evidence.trim()
                              ? "Evidence attached"
                              : LABEL[itemRecord.state]}
                          </div>

                          <div className="build-link-track" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>

            <aside className="build-editor">
              <div className="build-editor-head">
                <div className="build-panel-kicker">
                  Selected coordinate
                </div>

                <div className="build-editor-id">
                  {link.linkId}
                </div>

                <h2>
                  {String(link.order).padStart(2, "0")}{" "}
                  {link.canonicalName}
                </h2>

                <p>
                  Map only what the current record actually supports.
                </p>
              </div>

              <div className="build-editor-body">
                <div className="build-question">
                  <small>Governing question</small>
                  <p>{link.governingQuestion}</p>
                </div>

                <div className="build-fields">
                  <div className="build-field">
                    <span className="build-field-label">
                      Evidence state
                    </span>

                    <select
                      value={record.state}
                      onChange={(event) =>
                        update({
                          state:
                            event.target.value as TA14EvidenceHealthState,
                        })
                      }
                      className="build-select"
                    >
                      {STATES.map((state) => (
                        <option key={state} value={state}>
                          {LABEL[state]}
                        </option>
                      ))}
                    </select>
                  </div>

                  <TextArea
                    label="Evidence or artifact"
                    value={record.evidence}
                    onChange={(evidence) => update({ evidence })}
                  />

                  <TextArea
                    label="Assessment note"
                    value={record.note}
                    onChange={(note) => update({ note })}
                  />
                </div>

                <div className="build-expects">
                  <div className="build-expects-head">
                    What this link expects
                  </div>

                  <div className="build-expects-body">
                    {link.evidenceRequirements
                      .slice(0, 4)
                      .map((requirement, index) => (
                        <div
                          key={requirement}
                          className="build-expectation"
                        >
                          <span>
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <span>{requirement}</span>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="build-current">
                  <div className="build-current-head">
                    <small>Current working finding</small>
                    <strong>{LABEL[record.state]}</strong>
                  </div>

                  <div className="build-current-body">
                    <p>{STATE_COPY[record.state]}</p>
                  </div>
                </div>

                <Link
                  href={`/academy/24-link-architecture/${String(
                    link.order,
                  ).padStart(2, "0")}-${link.slug}`}
                  className="build-open"
                >
                  Study this canonical link →
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="build-finding">
        <div className="build-shell build-finding-grid">
          <div>
            <div
              className="build-eyebrow"
              style={{ color: "var(--amber)" }}
            >
              Current chain-map finding
            </div>

            <h2>
              {subject || "Unnamed system"}
            </h2>

            <p>
              This lab creates a working evidence map, not a certification or
              approval. A production Exchange submission should preserve the
              underlying artifacts, scope, version, reviewer basis, challenge
              state, and chronology behind every link-level determination.
            </p>
          </div>

          <div className="build-finding-cards">
            <FindingCard
              code="EV"
              title="Artifacts stay separate"
              text="A written evidence note in the lab is not the underlying artifact itself. Production records should preserve the actual source material."
            />

            <FindingCard
              code="SC"
              title="Scope stays bounded"
              text="A Supported state applies only to the declared subject and scope being mapped here."
            />

            <FindingCard
              code="VR"
              title="Version stays explicit"
              text="A chain map can become stale when the implementation, architecture, dependency, or environment changes."
            />

            <FindingCard
              code="RV"
              title="Review stays attributable"
              text="A production determination should preserve who reviewed the evidence, when, against what version, and under which review pathway."
            />
          </div>
        </div>
      </section>

      <section className="build-close">
        <div className="build-shell">
          <div
            className="build-eyebrow"
            style={{ color: "var(--purple)" }}
          >
            Applied architecture practice
          </div>

          <h2>
            Map the system.
            <br />
            Do not overstate the evidence.
          </h2>

          <p>
            Build-a-Chain is useful because it forces a real system to confront
            every canonical link separately. The result should show where the
            record is strong, where it is weak, where it is held, and where
            nothing has yet been tested.
          </p>

          <div className="build-close-actions">
            <Link
              href="/academy/24-link-architecture"
              className="build-button primary"
            >
              Return to 24-Link Explorer →
            </Link>

            <Link
              href="/academy/24-link-architecture/health"
              className="build-button"
            >
              Open Health Overlay
            </Link>

            <Link
              href="/academy/24-link-architecture/simulator"
              className="build-button"
            >
              Pressure the Chain
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
    <div className="build-metric">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="build-field">
      <span className="build-field-label">{label}</span>

      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={4}
        className="build-textarea"
      />
    </div>
  );
}

function FindingCard({
  code,
  title,
  text,
}: {
  code: string;
  title: string;
  text: string;
}) {
  return (
    <article className="build-finding-card">
      <b>{code}</b>
      <strong>{title}</strong>
      <span>{text}</span>
    </article>
  );
}
