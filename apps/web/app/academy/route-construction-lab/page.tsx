"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type DecisionState = "ALLOW" | "HOLD" | "DENY" | "ESCALATE";
type AnchorKey =
  | "reality"
  | "record"
  | "continuity"
  | "admissibility"
  | "binding"
  | "commit"
  | "execution"
  | "outcome";

type RouteDraft = Record<AnchorKey, string> & {
  title: string;
  consequence: string;
  decision: DecisionState;
  rationale: string;
};

const STORAGE_KEY = "ta14-academy-route-construction-lab-v1";

const anchors: Array<{
  key: AnchorKey;
  label: string;
  question: string;
  placeholder: string;
}> = [
  {
    key: "reality",
    label: "Reality",
    question: "What condition actually exists now?",
    placeholder:
      "State the present condition without interpretation or recommendation.",
  },
  {
    key: "record",
    label: "Record",
    question: "What attributable evidence preserves that reality?",
    placeholder:
      "Identify the source, timestamp, author, instrument, or system record.",
  },
  {
    key: "continuity",
    label: "Continuity",
    question:
      "What proves the evidence still corresponds to the current condition?",
    placeholder:
      "Describe revalidation, elapsed time, custody, version, or material change checks.",
  },
  {
    key: "admissibility",
    label: "Admissibility",
    question: "Why is this evidence sufficient for this exact decision?",
    placeholder:
      "Define relevance, currency, sufficiency, conflict status, and unresolved limits.",
  },
  {
    key: "binding",
    label: "Binding",
    question: "Who or what has authority to bind this decision?",
    placeholder:
      "Name the role, policy, delegation, jurisdiction, and scope boundary.",
  },
  {
    key: "commit",
    label: "Commit",
    question: "What must be fixed before execution begins?",
    placeholder:
      "Preserve the approved state, limits, version, rationale, and responsible authority.",
  },
  {
    key: "execution",
    label: "Execution",
    question: "What exact action is permitted, prohibited, or paused?",
    placeholder:
      "Define the action, sequence, duration, limits, stop conditions, and operator.",
  },
  {
    key: "outcome",
    label: "Outcome",
    question: "What result must be verified and preserved afterward?",
    placeholder:
      "Define success, failure, observation period, evidence capture, and challenge path.",
  },
];

const initialDraft: RouteDraft = {
  title: "",
  consequence: "",
  reality: "",
  record: "",
  continuity: "",
  admissibility: "",
  binding: "",
  commit: "",
  execution: "",
  outcome: "",
  decision: "HOLD",
  rationale: "",
};

const decisionCopy: Record<DecisionState, string> = {
  ALLOW:
    "The chain is sufficiently developed for review of a supported progression decision.",
  HOLD:
    "The route remains paused until missing evidence, continuity, authority, scope, or another support condition is restored.",
  DENY:
    "The current chain does not support consequence-bearing progression under the declared conditions.",
  ESCALATE:
    "The route requires additional governed authority, evidence, review, or decision capacity before progression can be resolved.",
};

const decisionCode: Record<DecisionState, string> = {
  ALLOW: "ALW",
  HOLD: "HLD",
  DENY: "DNY",
  ESCALATE: "ESC",
};

export default function RouteConstructionLabPage() {
  const [draft, setDraft] = useState<RouteDraft>(initialDraft);
  const [activeAnchor, setActiveAnchor] = useState<AnchorKey>("reality");
  const [saveState, setSaveState] = useState<"idle" | "saved" | "error">(
    "idle",
  );

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<RouteDraft>;
      setDraft({ ...initialDraft, ...parsed });
    } catch {
      setSaveState("error");
    }
  }, []);

  const completedAnchors = useMemo(
    () =>
      anchors.filter((anchor) => draft[anchor.key].trim().length >= 20).length,
    [draft],
  );

  const readiness = Math.round((completedAnchors / anchors.length) * 100);

  const active =
    anchors.find((anchor) => anchor.key === activeAnchor) ?? anchors[0];

  const activeIndex = anchors.findIndex((anchor) => anchor.key === activeAnchor);

  const canFinalize =
    draft.title.trim().length >= 4 &&
    draft.consequence.trim().length >= 20 &&
    completedAnchors === anchors.length &&
    draft.rationale.trim().length >= 30;

  const routeIdentityReady =
    draft.title.trim().length >= 4 && draft.consequence.trim().length >= 20;

  const rationaleReady = draft.rationale.trim().length >= 30;

  const totalRequiredBlocks = 11;
  const totalReadyBlocks =
    completedAnchors +
    (draft.title.trim().length >= 4 ? 1 : 0) +
    (draft.consequence.trim().length >= 20 ? 1 : 0) +
    (rationaleReady ? 1 : 0);

  const structuralReadiness = Math.round(
    (totalReadyBlocks / totalRequiredBlocks) * 100,
  );

  function updateField<K extends keyof RouteDraft>(
    key: K,
    value: RouteDraft[K],
  ) {
    setDraft((current) => ({ ...current, [key]: value }));
    setSaveState("idle");
  }

  function saveDraft() {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
      setSaveState("saved");
    } catch {
      setSaveState("error");
    }
  }

  function resetDraft() {
    setDraft(initialDraft);
    setActiveAnchor("reality");
    setSaveState("idle");
    window.localStorage.removeItem(STORAGE_KEY);
  }

  function moveAnchor(direction: "previous" | "next") {
    const nextIndex =
      direction === "next"
        ? Math.min(activeIndex + 1, anchors.length - 1)
        : Math.max(activeIndex - 1, 0);

    setActiveAnchor(anchors[nextIndex].key);
  }

  return (
    <main className="lab">
      <style>{`
        .lab {
          --bg: #020711;
          --panel: rgba(8, 20, 32, .88);
          --panel2: rgba(11, 27, 42, .78);
          --line: rgba(129, 176, 210, .14);
          --lineStrong: rgba(84, 232, 255, .28);
          --cyan: #54e8ff;
          --cyanSoft: #c4f8ff;
          --green: #45eaa6;
          --greenSoft: #c8f7df;
          --amber: #f1c769;
          --amberSoft: #ffe9b0;
          --rose: #ff8fa9;
          --roseSoft: #ffd2dc;
          --violet: #b39cff;
          --violetSoft: #e5ddff;
          --text: #eff8ff;
          --muted: #93a8ba;
          --dim: #647b8f;
          min-height: 100vh;
          overflow: hidden;
          color: var(--text);
          background:
            radial-gradient(circle at 8% 0%, rgba(84,232,255,.11), transparent 24%),
            radial-gradient(circle at 92% 5%, rgba(179,156,255,.10), transparent 26%),
            linear-gradient(180deg, #020711 0%, #030a13 55%, #020711 100%);
        }

        .lab * { box-sizing: border-box; }

        .lab-shell {
          width: min(1460px, calc(100% - 48px));
          margin: 0 auto;
        }

        .lab-hero {
          position: relative;
          overflow: hidden;
          border-bottom: 1px solid var(--line);
        }

        .lab-hero::before {
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

        .lab-topbar {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          padding-top: 20px;
        }

        .lab-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          color: var(--text);
          text-decoration: none;
        }

        .lab-brand-mark {
          display: grid;
          place-items: center;
          min-width: 58px;
          height: 34px;
          padding: 0 10px;
          border: 1px solid rgba(84,232,255,.22);
          border-radius: 10px;
          background: rgba(84,232,255,.055);
          color: var(--cyanSoft);
          font-size: .58rem;
          font-weight: 950;
          letter-spacing: .14em;
        }

        .lab-brand-copy strong {
          display: block;
          font-size: .70rem;
        }

        .lab-brand-copy small {
          display: block;
          margin-top: 2px;
          color: var(--dim);
          font-size: .54rem;
        }

        .lab-nav {
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-end;
          gap: 8px;
        }

        .lab-nav a {
          min-height: 34px;
          display: inline-flex;
          align-items: center;
          padding: 0 10px;
          border: 1px solid var(--line);
          border-radius: 999px;
          background: rgba(255,255,255,.02);
          color: var(--muted);
          font-size: .55rem;
          font-weight: 850;
          text-decoration: none;
          transition: 150ms ease;
        }

        .lab-nav a:hover {
          border-color: rgba(84,232,255,.24);
          color: var(--cyanSoft);
          transform: translateY(-1px);
        }

        .lab-hero-grid {
          position: relative;
          display: grid;
          grid-template-columns: minmax(0, 1.08fr) minmax(420px, .92fr);
          gap: 64px;
          align-items: center;
          padding: 74px 0 86px;
        }

        .lab-kicker {
          color: var(--cyan);
          font-size: .64rem;
          font-weight: 950;
          letter-spacing: .20em;
          text-transform: uppercase;
        }

        .lab-title {
          max-width: 980px;
          margin: 14px 0 0;
          font-size: clamp(3.2rem, 6vw, 6.25rem);
          line-height: .95;
          letter-spacing: -.06em;
        }

        .lab-title span {
          display: block;
          color: var(--cyanSoft);
        }

        .lab-lead {
          max-width: 900px;
          margin: 26px 0 0;
          color: #c8d8e4;
          font-size: clamp(1rem, 1.35vw, 1.18rem);
          line-height: 1.8;
        }

        .lab-rules {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 24px;
        }

        .lab-rule {
          padding: 7px 10px;
          border: 1px solid var(--line);
          border-radius: 999px;
          background: rgba(255,255,255,.026);
          color: var(--muted);
          font-size: .56rem;
          font-weight: 850;
        }

        .lab-orbit {
          position: relative;
          width: min(510px, 100%);
          aspect-ratio: 1;
          margin: 0 auto;
        }

        .lab-ring {
          position: absolute;
          inset: 50% auto auto 50%;
          transform: translate(-50%, -50%);
          border: 1px solid rgba(129,176,210,.10);
          border-radius: 50%;
        }

        .lab-ring.r1 { width: 96%; height: 96%; }
        .lab-ring.r2 {
          width: 76%;
          height: 76%;
          border-color: rgba(84,232,255,.13);
        }
        .lab-ring.r3 {
          width: 56%;
          height: 56%;
          border-color: rgba(179,156,255,.13);
        }
        .lab-ring.r4 {
          width: 36%;
          height: 36%;
          border-color: rgba(69,234,166,.12);
        }

        .lab-axis-h,
        .lab-axis-v {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }

        .lab-axis-h {
          width: 88%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(84,232,255,.15), transparent);
        }

        .lab-axis-v {
          width: 1px;
          height: 88%;
          background: linear-gradient(180deg, transparent, rgba(179,156,255,.14), transparent);
        }

        .lab-core {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 184px;
          height: 184px;
          transform: translate(-50%, -50%);
          display: grid;
          place-items: center;
          border: 1px solid rgba(84,232,255,.27);
          border-radius: 50%;
          background:
            radial-gradient(circle at 30% 25%, rgba(84,232,255,.12), transparent 44%),
            rgba(5,16,27,.96);
          box-shadow: 0 0 90px rgba(84,232,255,.10);
          text-align: center;
        }

        .lab-core small {
          display: block;
          color: var(--cyan);
          font-size: .57rem;
          font-weight: 950;
          letter-spacing: .18em;
        }

        .lab-core strong {
          display: block;
          margin-top: 6px;
          font-size: 3.35rem;
          line-height: 1;
          letter-spacing: -.06em;
        }

        .lab-core span {
          display: block;
          margin-top: 7px;
          color: var(--muted);
          font-size: .63rem;
        }

        .lab-node {
          position: absolute;
          min-width: 120px;
          padding: 10px 12px;
          border: 1px solid var(--line);
          border-radius: 13px;
          background: rgba(5,16,27,.93);
          box-shadow: 0 12px 34px rgba(0,0,0,.24);
        }

        .lab-node b {
          display: block;
          color: var(--cyan);
          font-size: .55rem;
          letter-spacing: .12em;
        }

        .lab-node span {
          display: block;
          margin-top: 4px;
          color: #d7e5ef;
          font-size: .66rem;
          font-weight: 850;
        }

        .lab-node.n1 { left: 0; top: 18%; }
        .lab-node.n2 { right: 0; top: 24%; }
        .lab-node.n3 { right: 4%; bottom: 18%; }
        .lab-node.n4 { left: 0; bottom: 18%; }
        .lab-node.n5 { left: 50%; top: 0; transform: translateX(-50%); }

        .lab-node.ready b { color: var(--green); }
        .lab-node.decision b { color: var(--amber); }
        .lab-node.structural b { color: var(--violet); }

        .lab-metrics {
          border-bottom: 1px solid var(--line);
          background: rgba(4,12,20,.76);
        }

        .lab-metric-grid {
          display: grid;
          grid-template-columns: repeat(5, minmax(0,1fr));
        }

        .lab-metric {
          min-height: 98px;
          padding: 20px;
          border-right: 1px solid var(--line);
        }

        .lab-metric:last-child { border-right: 0; }

        .lab-metric strong {
          display: block;
          font-size: 2rem;
          line-height: 1;
          letter-spacing: -.04em;
        }

        .lab-metric span {
          display: block;
          margin-top: 8px;
          color: var(--dim);
          font-size: .58rem;
          font-weight: 900;
          letter-spacing: .10em;
          text-transform: uppercase;
        }

        .lab-section {
          padding: 72px 0 90px;
        }

        .lab-section.alt {
          border-top: 1px solid var(--line);
          border-bottom: 1px solid var(--line);
          background: rgba(4,12,20,.66);
        }

        .lab-section-head {
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: 28px;
          margin-bottom: 28px;
        }

        .lab-eyebrow {
          color: var(--cyan);
          font-size: .62rem;
          font-weight: 950;
          letter-spacing: .16em;
          text-transform: uppercase;
        }

        .lab-h2 {
          margin: 9px 0 0;
          font-size: clamp(2rem, 3.4vw, 3.7rem);
          line-height: 1;
          letter-spacing: -.045em;
        }

        .lab-section-copy {
          max-width: 620px;
          margin: 0;
          color: var(--muted);
          font-size: .78rem;
          line-height: 1.7;
        }

        .lab-workspace {
          display: grid;
          grid-template-columns: minmax(300px, .34fr) minmax(0, .66fr);
          gap: 20px;
          align-items: start;
        }

        .lab-sidebar {
          display: grid;
          gap: 16px;
          position: sticky;
          top: 22px;
        }

        .lab-card {
          overflow: hidden;
          border: 1px solid var(--line);
          border-radius: 22px;
          background: rgba(255,255,255,.024);
        }

        .lab-card-head {
          padding: 18px 20px 16px;
          border-bottom: 1px solid var(--line);
          background:
            radial-gradient(circle at 100% 0%, rgba(84,232,255,.06), transparent 42%),
            rgba(255,255,255,.01);
        }

        .lab-card-head small {
          display: block;
          color: var(--cyan);
          font-size: .53rem;
          font-weight: 950;
          letter-spacing: .12em;
          text-transform: uppercase;
        }

        .lab-card-head h3 {
          margin: 7px 0 0;
          font-size: 1.15rem;
          letter-spacing: -.02em;
        }

        .lab-card-body { padding: 18px 20px 20px; }

        .lab-field {
          display: grid;
          gap: 7px;
          margin-top: 14px;
        }

        .lab-field:first-child { margin-top: 0; }

        .lab-field label,
        .lab-field-label {
          color: #dceaf4;
          font-size: .64rem;
          font-weight: 900;
        }

        .lab-input,
        .lab-textarea {
          width: 100%;
          border: 1px solid var(--line);
          border-radius: 11px;
          background: #07111e;
          color: var(--text);
          outline: none;
          font-size: .67rem;
        }

        .lab-input {
          min-height: 44px;
          padding: 0 11px;
        }

        .lab-textarea {
          min-height: 110px;
          padding: 11px 12px;
          resize: vertical;
          line-height: 1.62;
        }

        .lab-input:focus,
        .lab-textarea:focus {
          border-color: rgba(84,232,255,.37);
          box-shadow: 0 0 0 3px rgba(84,232,255,.06);
        }

        .lab-anchor-stack {
          display: grid;
          gap: 8px;
        }

        .lab-anchor-button {
          min-height: 66px;
          display: grid;
          grid-template-columns: 42px 1fr auto;
          gap: 11px;
          align-items: center;
          width: 100%;
          padding: 9px 11px;
          border: 1px solid var(--line);
          border-radius: 13px;
          background: rgba(0,0,0,.10);
          color: var(--text);
          text-align: left;
          cursor: pointer;
          transition: 150ms ease;
        }

        .lab-anchor-button:hover {
          border-color: rgba(84,232,255,.22);
          transform: translateX(2px);
        }

        .lab-anchor-button.active {
          border-color: rgba(84,232,255,.35);
          background:
            radial-gradient(circle at 100% 0%, rgba(84,232,255,.07), transparent 44%),
            rgba(84,232,255,.045);
        }

        .lab-anchor-button.complete {
          box-shadow: inset 2px 0 0 rgba(69,234,166,.33);
        }

        .lab-anchor-number {
          width: 38px;
          height: 38px;
          display: grid;
          place-items: center;
          border: 1px solid var(--line);
          border-radius: 50%;
          color: var(--cyan);
          font-size: .54rem;
          font-weight: 950;
        }

        .lab-anchor-name {
          font-size: .68rem;
          font-weight: 900;
        }

        .lab-anchor-sub {
          display: block;
          margin-top: 3px;
          color: var(--dim);
          font-size: .50rem;
        }

        .lab-anchor-status {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: #334155;
        }

        .lab-anchor-status.complete {
          background: var(--green);
          box-shadow: 0 0 12px rgba(69,234,166,.30);
        }

        .lab-main {
          display: grid;
          gap: 18px;
        }

        .lab-active {
          overflow: hidden;
          border: 1px solid var(--line);
          border-radius: 24px;
          background: rgba(255,255,255,.024);
        }

        .lab-active-head {
          display: grid;
          grid-template-columns: minmax(0,1fr) auto;
          gap: 20px;
          align-items: start;
          padding: 24px;
          border-bottom: 1px solid var(--line);
          background:
            radial-gradient(circle at 100% 0%, rgba(84,232,255,.08), transparent 42%),
            rgba(255,255,255,.01);
        }

        .lab-active-head small {
          display: block;
          color: var(--cyan);
          font-size: .54rem;
          font-weight: 950;
          letter-spacing: .13em;
          text-transform: uppercase;
        }

        .lab-active-head h2 {
          margin: 8px 0 0;
          font-size: 2rem;
          line-height: 1.08;
          letter-spacing: -.035em;
        }

        .lab-active-head p {
          max-width: 760px;
          margin: 10px 0 0;
          color: var(--muted);
          font-size: .72rem;
          line-height: 1.65;
        }

        .lab-active-badge {
          min-width: 126px;
          padding: 7px 10px;
          border: 1px solid var(--line);
          border-radius: 999px;
          background: rgba(0,0,0,.10);
          color: var(--muted);
          font-size: .50rem;
          font-weight: 950;
          letter-spacing: .08em;
          text-transform: uppercase;
          text-align: center;
        }

        .lab-active-badge.complete {
          border-color: rgba(69,234,166,.22);
          background: rgba(69,234,166,.055);
          color: var(--greenSoft);
        }

        .lab-active-body { padding: 24px; }

        .lab-question {
          padding: 15px;
          border: 1px solid rgba(84,232,255,.14);
          border-radius: 14px;
          background: rgba(84,232,255,.035);
        }

        .lab-question small {
          display: block;
          color: var(--cyan);
          font-size: .49rem;
          font-weight: 950;
          letter-spacing: .10em;
          text-transform: uppercase;
        }

        .lab-question strong {
          display: block;
          margin-top: 7px;
          font-size: .80rem;
          line-height: 1.45;
        }

        .lab-anchor-textarea {
          width: 100%;
          min-height: 250px;
          margin-top: 16px;
          padding: 14px 15px;
          resize: vertical;
          border: 1px solid var(--line);
          border-radius: 13px;
          background: #07111e;
          color: var(--text);
          outline: none;
          font-size: .72rem;
          line-height: 1.68;
        }

        .lab-anchor-textarea:focus {
          border-color: rgba(84,232,255,.37);
          box-shadow: 0 0 0 3px rgba(84,232,255,.06);
        }

        .lab-threshold-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-top: 10px;
          color: var(--dim);
          font-size: .54rem;
          font-weight: 850;
        }

        .lab-threshold-track {
          overflow: hidden;
          height: 8px;
          margin-top: 8px;
          border: 1px solid rgba(255,255,255,.05);
          border-radius: 999px;
          background: rgba(255,255,255,.035);
        }

        .lab-threshold-fill {
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(90deg, rgba(84,232,255,.48), rgba(69,234,166,.72));
          transition: width 150ms ease;
        }

        .lab-anchor-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-top: 18px;
          padding-top: 16px;
          border-top: 1px solid var(--line);
        }

        .lab-anchor-nav button {
          min-height: 40px;
          padding: 0 12px;
          border: 1px solid var(--line);
          border-radius: 10px;
          background: rgba(255,255,255,.022);
          color: #dceaf4;
          cursor: pointer;
          font-size: .60rem;
          font-weight: 900;
          transition: 150ms ease;
        }

        .lab-anchor-nav button:hover:not(:disabled) {
          transform: translateY(-1px);
          border-color: rgba(84,232,255,.24);
        }

        .lab-anchor-nav button:disabled {
          opacity: .28;
          cursor: not-allowed;
        }

        .lab-anchor-counter {
          color: var(--dim);
          font-size: .55rem;
          font-weight: 850;
        }

        .lab-decision {
          overflow: hidden;
          border: 1px solid var(--line);
          border-radius: 24px;
          background: rgba(255,255,255,.024);
        }

        .lab-decision-head {
          padding: 22px 24px 20px;
          border-bottom: 1px solid var(--line);
          background:
            radial-gradient(circle at 100% 0%, rgba(241,199,105,.06), transparent 42%),
            rgba(255,255,255,.01);
        }

        .lab-decision-head small {
          display: block;
          color: var(--amber);
          font-size: .54rem;
          font-weight: 950;
          letter-spacing: .12em;
          text-transform: uppercase;
        }

        .lab-decision-head h2 {
          margin: 8px 0 0;
          font-size: 1.65rem;
          letter-spacing: -.03em;
        }

        .lab-decision-body { padding: 22px 24px 24px; }

        .lab-decision-grid {
          display: grid;
          grid-template-columns: repeat(4,minmax(0,1fr));
          gap: 9px;
        }

        .lab-decision-button {
          min-height: 76px;
          display: grid;
          align-content: center;
          gap: 6px;
          padding: 10px;
          border: 1px solid var(--line);
          border-radius: 13px;
          background: rgba(0,0,0,.10);
          color: var(--muted);
          cursor: pointer;
          text-align: center;
          transition: 150ms ease;
        }

        .lab-decision-button:hover {
          transform: translateY(-2px);
          border-color: rgba(241,199,105,.22);
        }

        .lab-decision-button strong {
          font-size: .67rem;
          letter-spacing: .08em;
        }

        .lab-decision-button span {
          font-size: .47rem;
          letter-spacing: .09em;
        }

        .lab-decision-button.active.allow {
          border-color: rgba(69,234,166,.28);
          background: rgba(69,234,166,.06);
          color: var(--greenSoft);
        }

        .lab-decision-button.active.hold {
          border-color: rgba(241,199,105,.28);
          background: rgba(241,199,105,.06);
          color: var(--amberSoft);
        }

        .lab-decision-button.active.deny {
          border-color: rgba(255,143,169,.28);
          background: rgba(255,143,169,.06);
          color: var(--roseSoft);
        }

        .lab-decision-button.active.escalate {
          border-color: rgba(179,156,255,.28);
          background: rgba(179,156,255,.06);
          color: var(--violetSoft);
        }

        .lab-decision-summary {
          margin-top: 16px;
          padding: 14px;
          border: 1px solid var(--line);
          border-radius: 13px;
          background: rgba(0,0,0,.10);
        }

        .lab-decision-summary small {
          display: block;
          color: var(--dim);
          font-size: .48rem;
          font-weight: 950;
          letter-spacing: .10em;
          text-transform: uppercase;
        }

        .lab-decision-summary p {
          margin: 7px 0 0;
          color: var(--muted);
          font-size: .64rem;
          line-height: 1.58;
        }

        .lab-review {
          overflow: hidden;
          border: 1px solid var(--line);
          border-radius: 24px;
          background: rgba(255,255,255,.024);
        }

        .lab-review.complete {
          border-color: rgba(69,234,166,.24);
          background:
            radial-gradient(circle at 100% 0%, rgba(69,234,166,.08), transparent 42%),
            rgba(69,234,166,.03);
        }

        .lab-review.incomplete {
          border-color: rgba(241,199,105,.20);
          background:
            radial-gradient(circle at 100% 0%, rgba(241,199,105,.06), transparent 42%),
            rgba(241,199,105,.025);
        }

        .lab-review-head {
          display: grid;
          grid-template-columns: minmax(0,1fr) auto;
          gap: 18px;
          align-items: center;
          padding: 22px 24px 20px;
          border-bottom: 1px solid var(--line);
        }

        .lab-review-head small {
          display: block;
          color: var(--dim);
          font-size: .53rem;
          font-weight: 950;
          letter-spacing: .12em;
          text-transform: uppercase;
        }

        .lab-review-head h2 {
          margin: 7px 0 0;
          font-size: 1.6rem;
          letter-spacing: -.03em;
        }

        .lab-review-score {
          text-align: right;
        }

        .lab-review-score strong {
          display: block;
          font-size: 2.2rem;
          letter-spacing: -.05em;
        }

        .lab-review-score span {
          display: block;
          margin-top: 3px;
          color: var(--dim);
          font-size: .48rem;
          font-weight: 900;
          letter-spacing: .09em;
          text-transform: uppercase;
        }

        .lab-review-body { padding: 22px 24px 24px; }

        .lab-review-body > p {
          margin: 0;
          color: var(--muted);
          font-size: .72rem;
          line-height: 1.65;
        }

        .lab-check-grid {
          display: grid;
          grid-template-columns: repeat(4,minmax(0,1fr));
          gap: 9px;
          margin-top: 16px;
        }

        .lab-check {
          min-height: 94px;
          padding: 11px;
          border: 1px solid var(--line);
          border-radius: 12px;
          background: rgba(0,0,0,.08);
        }

        .lab-check small {
          display: block;
          color: var(--dim);
          font-size: .47rem;
          font-weight: 950;
          letter-spacing: .09em;
          text-transform: uppercase;
        }

        .lab-check strong {
          display: block;
          margin-top: 7px;
          font-size: .64rem;
          line-height: 1.4;
        }

        .lab-check.ready strong { color: var(--greenSoft); }
        .lab-check.open strong { color: var(--amberSoft); }

        .lab-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 9px;
          margin-top: 18px;
        }

        .lab-action-primary,
        .lab-action-secondary,
        .lab-action-link {
          min-height: 42px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0 14px;
          border-radius: 11px;
          font-size: .62rem;
          font-weight: 900;
          transition: 150ms ease;
          text-decoration: none;
        }

        .lab-action-primary {
          border: 1px solid rgba(84,232,255,.28);
          background: rgba(84,232,255,.10);
          color: var(--cyanSoft);
          cursor: pointer;
        }

        .lab-action-secondary,
        .lab-action-link {
          border: 1px solid var(--line);
          background: rgba(255,255,255,.022);
          color: #dceaf4;
          cursor: pointer;
        }

        .lab-action-primary:hover,
        .lab-action-secondary:hover,
        .lab-action-link:hover {
          transform: translateY(-2px);
        }

        .lab-save-state {
          margin-top: 12px;
          font-size: .60rem;
          font-weight: 850;
        }

        .lab-save-state.saved { color: var(--greenSoft); }
        .lab-save-state.error { color: var(--roseSoft); }

        .lab-doctrine {
          border-top: 1px solid var(--line);
          border-bottom: 1px solid var(--line);
          background: rgba(4,12,20,.72);
        }

        .lab-doctrine-grid {
          display: grid;
          grid-template-columns: minmax(0,.88fr) minmax(0,1.12fr);
          gap: 34px;
          align-items: start;
          padding: 72px 0;
        }

        .lab-doctrine h2 {
          margin: 9px 0 0;
          font-size: clamp(2rem,3.4vw,3.4rem);
          line-height: 1.04;
          letter-spacing: -.045em;
        }

        .lab-doctrine p {
          margin: 18px 0 0;
          color: var(--muted);
          font-size: .78rem;
          line-height: 1.75;
        }

        .lab-doctrine-cards {
          display: grid;
          grid-template-columns: repeat(2,minmax(0,1fr));
          gap: 11px;
        }

        .lab-doctrine-card {
          min-height: 150px;
          padding: 16px;
          border: 1px solid var(--line);
          border-radius: 15px;
          background: rgba(255,255,255,.022);
        }

        .lab-doctrine-card b {
          color: var(--cyan);
          font-size: .56rem;
          letter-spacing: .12em;
        }

        .lab-doctrine-card strong {
          display: block;
          margin-top: 8px;
          font-size: .76rem;
        }

        .lab-doctrine-card span {
          display: block;
          margin-top: 7px;
          color: var(--muted);
          font-size: .64rem;
          line-height: 1.55;
        }

        .lab-close {
          padding: 74px 0 90px;
          text-align: center;
        }

        .lab-close h2 {
          max-width: 900px;
          margin: 10px auto 0;
          font-size: clamp(2.3rem,4.2vw,4.6rem);
          line-height: 1;
          letter-spacing: -.05em;
        }

        .lab-close p {
          max-width: 760px;
          margin: 18px auto 0;
          color: var(--muted);
          font-size: .76rem;
          line-height: 1.7;
        }

        .lab-close-actions {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 10px;
          margin-top: 24px;
        }

        .lab-close-actions a {
          min-height: 42px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0 14px;
          border: 1px solid var(--line);
          border-radius: 11px;
          background: rgba(255,255,255,.022);
          color: #dceaf4;
          font-size: .63rem;
          font-weight: 900;
          text-decoration: none;
          transition: 150ms ease;
        }

        .lab-close-actions a.primary {
          border-color: rgba(84,232,255,.25);
          background: rgba(84,232,255,.065);
          color: var(--cyanSoft);
        }

        .lab-close-actions a:hover {
          transform: translateY(-2px);
          border-color: var(--lineStrong);
        }

        @media (max-width: 1180px) {
          .lab-hero-grid { grid-template-columns: 1fr; }
          .lab-orbit { max-width: 500px; }
          .lab-workspace { grid-template-columns: 1fr; }
          .lab-sidebar { position: static; grid-template-columns: repeat(2,minmax(0,1fr)); }
        }

        @media (max-width: 900px) {
          .lab-shell { width: min(100% - 28px,1460px); }
          .lab-topbar,
          .lab-section-head,
          .lab-active-head,
          .lab-review-head {
            display: grid;
            align-items: start;
          }
          .lab-nav { justify-content: flex-start; }
          .lab-title { font-size: clamp(2.8rem,13vw,4.8rem); }
          .lab-metric-grid { grid-template-columns: repeat(2,minmax(0,1fr)); }
          .lab-metric { border-bottom: 1px solid var(--line); }
          .lab-metric:nth-child(2n) { border-right: 0; }
          .lab-sidebar { grid-template-columns: 1fr; }
          .lab-check-grid { grid-template-columns: repeat(2,minmax(0,1fr)); }
          .lab-doctrine-grid { grid-template-columns: 1fr; }
          .lab-review-score { text-align: left; }
        }

        @media (max-width: 640px) {
          .lab-decision-grid,
          .lab-check-grid,
          .lab-doctrine-cards { grid-template-columns: 1fr; }
          .lab-node { display: none; }
          .lab-anchor-nav { display: grid; }
          .lab-actions,
          .lab-close-actions { display: grid; }
        }
      `}</style>

      <section className="lab-hero">
        <div className="lab-shell lab-topbar">
          <Link href="/academy" className="lab-brand">
            <span className="lab-brand-mark">TA-14</span>
            <span className="lab-brand-copy">
              <strong>Academy</strong>
              <small>Route Construction Lab</small>
            </span>
          </Link>

          <nav className="lab-nav" aria-label="Academy navigation">
            <Link href="/academy/routes">Route Reading Center</Link>
            <Link href="/academy/simulator">Simulator</Link>
            <Link href="/academy/dashboard">Mission Control</Link>
          </nav>
        </div>

        <div className="lab-shell lab-hero-grid">
          <div>
            <div className="lab-kicker">Construct before consequence</div>

            <h1 className="lab-title">
              Build a governed route
              <span>one admissible anchor at a time.</span>
            </h1>

            <p className="lab-lead">
              Convert a consequential request into a bounded, reviewable route.
              This laboratory does not authorize execution. It teaches the
              structure required before an execution decision can be defended.
            </p>

            <div className="lab-rules">
              <span className="lab-rule">Reality before interpretation</span>
              <span className="lab-rule">Evidence before reliance</span>
              <span className="lab-rule">Continuity before progression</span>
              <span className="lab-rule">Authority before binding</span>
              <span className="lab-rule">Outcome after consequence</span>
            </div>
          </div>

          <div className="lab-orbit" aria-label="TA-14 route construction motif">
            <div className="lab-ring r1" />
            <div className="lab-ring r2" />
            <div className="lab-ring r3" />
            <div className="lab-ring r4" />
            <div className="lab-axis-h" />
            <div className="lab-axis-v" />

            <div className="lab-core">
              <div>
                <small>ROUTE READINESS</small>
                <strong>{readiness}%</strong>
                <span>{completedAnchors}/8 anchors complete</span>
              </div>
            </div>

            <div className="lab-node n1 ready">
              <b>{completedAnchors}/8</b>
              <span>Anchors complete</span>
            </div>

            <div className="lab-node n2 decision">
              <b>{draft.decision}</b>
              <span>Current decision</span>
            </div>

            <div className="lab-node n3 structural">
              <b>{structuralReadiness}%</b>
              <span>Structural readiness</span>
            </div>

            <div className="lab-node n4">
              <b>{String(activeIndex + 1).padStart(2, "0")}</b>
              <span>Active anchor</span>
            </div>

            <div className="lab-node n5">
              <b>{canFinalize ? "READY" : "DRAFT"}</b>
              <span>Review state</span>
            </div>
          </div>
        </div>
      </section>

      <section className="lab-metrics">
        <div className="lab-shell lab-metric-grid">
          <Metric value={`${completedAnchors}/8`} label="Anchors complete" />
          <Metric value={`${readiness}%`} label="Anchor readiness" />
          <Metric value={`${structuralReadiness}%`} label="Structural readiness" />
          <Metric value={draft.decision} label="Current decision" />
          <Metric value={canFinalize ? "Ready" : "Draft"} label="Review state" />
        </div>
      </section>

      <section className="lab-section alt">
        <div className="lab-shell">
          <div className="lab-section-head">
            <div>
              <div className="lab-eyebrow">Route construction workspace</div>
              <h2 className="lab-h2">Build the chain before you defend the decision.</h2>
            </div>

            <p className="lab-section-copy">
              The lab separates route identity, consequence, the eight foundational anchors,
              decision discipline, and structural review so learners can see exactly what is
              missing before a draft becomes reviewable.
            </p>
          </div>

          <div className="lab-workspace">
            <aside className="lab-sidebar">
              <section className="lab-card">
                <div className="lab-card-head">
                  <small>Route identity</small>
                  <h3>Declare what this route is for.</h3>
                </div>

                <div className="lab-card-body">
                  <div className="lab-field">
                    <label htmlFor="route-title">Route title</label>
                    <input
                      id="route-title"
                      value={draft.title}
                      onChange={(event) => updateField("title", event.target.value)}
                      placeholder="Example: Bounded equipment restart"
                      className="lab-input"
                    />
                  </div>

                  <div className="lab-field">
                    <label htmlFor="route-consequence">Consequence</label>
                    <textarea
                      id="route-consequence"
                      rows={5}
                      value={draft.consequence}
                      onChange={(event) =>
                        updateField("consequence", event.target.value)
                      }
                      placeholder="What will bind to reality if this route executes?"
                      className="lab-textarea"
                    />
                  </div>
                </div>
              </section>

              <section className="lab-card">
                <div className="lab-card-head">
                  <small>Eight anchors</small>
                  <h3>Move through the parent route.</h3>
                </div>

                <div className="lab-card-body">
                  <div className="lab-anchor-stack">
                    {anchors.map((anchor, index) => {
                      const complete = draft[anchor.key].trim().length >= 20;
                      const selected = activeAnchor === anchor.key;

                      return (
                        <button
                          key={anchor.key}
                          type="button"
                          onClick={() => setActiveAnchor(anchor.key)}
                          className={[
                            "lab-anchor-button",
                            selected ? "active" : "",
                            complete ? "complete" : "",
                          ]
                            .filter(Boolean)
                            .join(" ")}
                        >
                          <span className="lab-anchor-number">
                            {String(index + 1).padStart(2, "0")}
                          </span>

                          <span>
                            <span className="lab-anchor-name">{anchor.label}</span>
                            <span className="lab-anchor-sub">
                              {complete ? "Threshold reached" : "Needs development"}
                            </span>
                          </span>

                          <span
                            className={[
                              "lab-anchor-status",
                              complete ? "complete" : "",
                            ]
                              .filter(Boolean)
                              .join(" ")}
                            aria-label={complete ? "Complete" : "Incomplete"}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </section>
            </aside>

            <div className="lab-main">
              <section className="lab-active">
                <div className="lab-active-head">
                  <div>
                    <small>Active anchor · {String(activeIndex + 1).padStart(2, "0")}</small>
                    <h2>{active.label}</h2>
                    <p>
                      Develop the anchor in enough detail that another reviewer could
                      understand what the route claims and what remains uncertain.
                    </p>
                  </div>

                  <span
                    className={[
                      "lab-active-badge",
                      draft[active.key].trim().length >= 20 ? "complete" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    {draft[active.key].trim().length >= 20
                      ? "Sufficient detail"
                      : "In development"}
                  </span>
                </div>

                <div className="lab-active-body">
                  <div className="lab-question">
                    <small>Governing question</small>
                    <strong>{active.question}</strong>
                  </div>

                  <textarea
                    rows={10}
                    value={draft[active.key]}
                    onChange={(event) =>
                      updateField(active.key, event.target.value)
                    }
                    placeholder={active.placeholder}
                    className="lab-anchor-textarea"
                  />

                  <div className="lab-threshold-row">
                    <span>Minimum learning threshold: 20 characters</span>
                    <span>{draft[active.key].trim().length} characters</span>
                  </div>

                  <div className="lab-threshold-track">
                    <div
                      className="lab-threshold-fill"
                      style={{
                        width: `${Math.min(
                          100,
                          (draft[active.key].trim().length / 20) * 100,
                        )}%`,
                      }}
                    />
                  </div>

                  <div className="lab-anchor-nav">
                    <button
                      type="button"
                      onClick={() => moveAnchor("previous")}
                      disabled={activeIndex === 0}
                    >
                      ← Previous anchor
                    </button>

                    <span className="lab-anchor-counter">
                      {activeIndex + 1} of {anchors.length}
                    </span>

                    <button
                      type="button"
                      onClick={() => moveAnchor("next")}
                      disabled={activeIndex === anchors.length - 1}
                    >
                      Next anchor →
                    </button>
                  </div>
                </div>
              </section>

              <section className="lab-decision">
                <div className="lab-decision-head">
                  <small>Decision discipline</small>
                  <h2>Choose the route state supported by the chain.</h2>
                </div>

                <div className="lab-decision-body">
                  <div className="lab-decision-grid">
                    {(["ALLOW", "HOLD", "DENY", "ESCALATE"] as DecisionState[]).map(
                      (decision) => (
                        <button
                          key={decision}
                          type="button"
                          onClick={() => updateField("decision", decision)}
                          className={[
                            "lab-decision-button",
                            draft.decision === decision ? "active" : "",
                            draft.decision === decision
                              ? decision.toLowerCase()
                              : "",
                          ]
                            .filter(Boolean)
                            .join(" ")}
                        >
                          <strong>{decision}</strong>
                          <span>{decisionCode[decision]}</span>
                        </button>
                      ),
                    )}
                  </div>

                  <div className="lab-decision-summary">
                    <small>Current decision meaning</small>
                    <p>{decisionCopy[draft.decision]}</p>
                  </div>

                  <div className="lab-field" style={{ marginTop: 16 }}>
                    <label htmlFor="route-rationale">Decision rationale</label>
                    <textarea
                      id="route-rationale"
                      rows={6}
                      value={draft.rationale}
                      onChange={(event) =>
                        updateField("rationale", event.target.value)
                      }
                      placeholder="Explain why this state is supported, which gaps remain, and what would change the decision."
                      className="lab-textarea"
                    />
                  </div>
                </div>
              </section>

              <section
                className={[
                  "lab-review",
                  canFinalize ? "complete" : "incomplete",
                ].join(" ")}
              >
                <div className="lab-review-head">
                  <div>
                    <small>Construction review</small>
                    <h2>
                      {canFinalize
                        ? "Route draft structurally complete"
                        : "Route draft remains incomplete"}
                    </h2>
                  </div>

                  <div className="lab-review-score">
                    <strong>{structuralReadiness}%</strong>
                    <span>Structural readiness</span>
                  </div>
                </div>

                <div className="lab-review-body">
                  <p>
                    {canFinalize
                      ? "All eight anchors contain a developed response, the consequence is defined, and the decision includes a rationale. Structural completion is not execution authorization."
                      : "Complete the route identity, consequence, all eight anchors, and decision rationale before treating this as a reviewable draft."}
                  </p>

                  <div className="lab-check-grid">
                    <CheckCard
                      label="Route identity"
                      ready={routeIdentityReady}
                      text={routeIdentityReady ? "Declared" : "Incomplete"}
                    />
                    <CheckCard
                      label="Eight anchors"
                      ready={completedAnchors === anchors.length}
                      text={`${completedAnchors}/8 complete`}
                    />
                    <CheckCard
                      label="Decision rationale"
                      ready={rationaleReady}
                      text={rationaleReady ? "Developed" : "Needs detail"}
                    />
                    <CheckCard
                      label="Reviewability"
                      ready={canFinalize}
                      text={canFinalize ? "Structurally ready" : "Not yet ready"}
                    />
                  </div>

                  <div className="lab-actions">
                    <button
                      type="button"
                      onClick={saveDraft}
                      className="lab-action-primary"
                    >
                      Save route draft
                    </button>

                    <button
                      type="button"
                      onClick={resetDraft}
                      className="lab-action-secondary"
                    >
                      Reset laboratory
                    </button>

                    <Link href="/academy/review" className="lab-action-link">
                      Continue to Review Workspace →
                    </Link>
                  </div>

                  {saveState === "saved" ? (
                    <p className="lab-save-state saved">
                      Draft saved on this device.
                    </p>
                  ) : null}

                  {saveState === "error" ? (
                    <p className="lab-save-state error">
                      The draft could not be stored in this browser.
                    </p>
                  ) : null}
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>

      <section className="lab-doctrine">
        <div className="lab-shell lab-doctrine-grid">
          <div>
            <div className="lab-eyebrow" style={{ color: "var(--amber)" }}>
              Construction doctrine
            </div>

            <h2>Completeness is not permission.</h2>

            <p>
              This lab teaches disciplined route construction. A completed draft can
              become reviewable, but it does not become authorized merely because all
              fields are filled. Evidence, continuity, authority, decision basis, and
              consequence boundaries still require governed review.
            </p>
          </div>

          <div className="lab-doctrine-cards">
            <DoctrineCard
              code="01"
              title="Reality before interpretation"
              text="The route begins by stating what condition actually exists before recommendation, inference, or policy consequence is added."
            />

            <DoctrineCard
              code="02"
              title="Record must be attributable"
              text="Evidence should identify its source, timing, instrument, author, system, or other basis for later reconstruction."
            />

            <DoctrineCard
              code="03"
              title="Continuity must survive"
              text="Evidence that was once valid can become stale, detached, superseded, or materially changed before the next transition."
            />

            <DoctrineCard
              code="04"
              title="Decision does not equal execution"
              text="ALLOW, HOLD, DENY, or ESCALATE is a governed route state; the lab itself does not authorize consequence-bearing execution."
            />
          </div>
        </div>
      </section>

      <section className="lab-close">
        <div className="lab-shell">
          <div className="lab-eyebrow">No admissible evidence. No admissible execution.</div>

          <h2>
            Construct the route.
            <br />
            Then make it reviewable.
          </h2>

          <p>
            Use the Route Construction Lab to make the parent eight-anchor chain
            explicit before entering review, simulation, assessment, or deeper 24-link
            analysis.
          </p>

          <div className="lab-close-actions">
            <Link href="/academy/review" className="primary">
              Continue to Review Workspace →
            </Link>
            <Link href="/academy/routes">Return to Learning Routes</Link>
            <Link href="/academy/24-link-architecture">
              Open 24-Link Architecture
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
    <div className="lab-metric">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function CheckCard({
  label,
  ready,
  text,
}: {
  label: string;
  ready: boolean;
  text: string;
}) {
  return (
    <div className={["lab-check", ready ? "ready" : "open"].join(" ")}>
      <small>{label}</small>
      <strong>{text}</strong>
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
    <article className="lab-doctrine-card">
      <b>{code}</b>
      <strong>{title}</strong>
      <span>{text}</span>
    </article>
  );
}
