"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import {
  TA14_24_LINKS,
  type TA14LinkId,
  type TA14RouteDecision,
} from "@/lib/academy/ta14-24-link-canon";

type Scenario = {
  id: string;
  title: string;
  pressure: string;
  prompt: string;
  firstBrokenLink: TA14LinkId;
  lastAdmissibleLink: TA14LinkId;
  decision: TA14RouteDecision;
  recovery: string;
  rationale: string;
};

const SCENARIOS: readonly Scenario[] = [
  {
    id: "evidence-decay",
    title: "Evidence Decay Before Commit",
    pressure:
      "A measurement that supported the earlier decision becomes stale before consequence-bearing commitment.",
    prompt:
      "Locate the earliest unsupported state and decide whether the route may continue.",
    firstBrokenLink: "TA14-LINK-14",
    lastAdmissibleLink: "TA14-LINK-13",
    decision: "HOLD",
    recovery:
      "Re-establish Commit Reality with fresh evidence and reassess any materially affected authority, scope, or consequence assumptions.",
    rationale:
      "Binding may remain historically valid while the reality required for commitment has changed. The route must not inherit stale assumptions into Commit.",
  },
  {
    id: "authority-drift",
    title: "Authority Drift",
    pressure:
      "The approving authority expires after evidence remains valid but before the action is committed.",
    prompt:
      "Separate evidence validity from authority validity and determine the correct route decision.",
    firstBrokenLink: "TA14-LINK-08",
    lastAdmissibleLink: "TA14-LINK-07",
    decision: "HOLD",
    recovery:
      "Re-establish current authority and legitimacy before allowing downstream consequence formation, binding, or commitment.",
    rationale:
      "Valid evidence does not create authority. The chain must stop at the first point where the actor or system can no longer prove permission to act.",
  },
  {
    id: "runtime-dependency",
    title: "Runtime Dependency Change",
    pressure:
      "A critical runtime dependency changes after Commit but before Execution.",
    prompt:
      "Determine whether the committed route remains executable under the new live state.",
    firstBrokenLink: "TA14-LINK-16",
    lastAdmissibleLink: "TA14-LINK-15",
    decision: "HOLD",
    recovery:
      "Re-establish Execution Reality and return upstream if the dependency change materially alters the committed scope or safeguards.",
    rationale:
      "Commit does not guarantee execution. Execution Reality must still match the conditions under which commitment became admissible.",
  },
  {
    id: "correct-refusal",
    title: "Correct Refusal",
    pressure:
      "A required execution condition cannot be proven at runtime.",
    prompt:
      "Determine whether non-execution is failure or the correct governed result.",
    firstBrokenLink: "TA14-LINK-16",
    lastAdmissibleLink: "TA14-LINK-15",
    decision: "REFUSE",
    recovery:
      "Preserve the refusal basis as Admissible Non-Occurrence and document any consequence that was intentionally prevented.",
    rationale:
      "The objective is admissibility, not forced execution. When execution conditions are unsupported, correct non-occurrence can be a governed success.",
  },
  {
    id: "outcome-divergence",
    title: "Outcome Divergence",
    pressure:
      "Execution remains within authorized scope, but direct post-action observation shows an unexpected result.",
    prompt:
      "Identify where the chain must focus after execution and what must be preserved for the next cycle.",
    firstBrokenLink: "TA14-LINK-21",
    lastAdmissibleLink: "TA14-LINK-20",
    decision: "HOLD",
    recovery:
      "Classify the actual Outcome, establish New Reality, preserve relevant Memory, and govern Future Chain entry conditions.",
    rationale:
      "Authorized execution does not prove a successful outcome. The actual result must be evaluated before closure or recurrence.",
  },
  {
    id: "memory-conflict",
    title: "Memory Conflict",
    pressure:
      "Two preserved records support conflicting rules for the next governed cycle.",
    prompt:
      "Prevent uncontrolled reuse of conflicting institutional memory.",
    firstBrokenLink: "TA14-LINK-23",
    lastAdmissibleLink: "TA14-LINK-22",
    decision: "ESCALATE",
    recovery:
      "Govern the conflict, determine version or supersession state, and prevent Future Chain from inheriting unresolved doctrine.",
    rationale:
      "Memory is not automatically admissible because it was preserved. Conflicting or superseded memory must be governed before reuse.",
  },
];

const DECISIONS: readonly TA14RouteDecision[] = [
  "CONTINUE",
  "NARROW",
  "HOLD",
  "REFUSE",
  "ESCALATE",
];

function label(linkId: TA14LinkId) {
  const link = TA14_24_LINKS.find((item) => item.linkId === linkId);
  return link
    ? `${String(link.order).padStart(2, "0")} · ${link.canonicalName}`
    : linkId;
}

function orderOf(linkId: TA14LinkId) {
  return (
    TA14_24_LINKS.find((item) => item.linkId === linkId)?.order ?? 1
  );
}

export default function TA14ChainFailureSimulatorPage() {
  const [scenarioId, setScenarioId] = useState(SCENARIOS[0].id);
  const [firstBroken, setFirstBroken] = useState<TA14LinkId>(
    SCENARIOS[0].firstBrokenLink,
  );
  const [lastAdmissible, setLastAdmissible] = useState<TA14LinkId>(
    SCENARIOS[0].lastAdmissibleLink,
  );
  const [decision, setDecision] = useState<TA14RouteDecision>(
    SCENARIOS[0].decision,
  );
  const [submitted, setSubmitted] = useState(false);

  const scenario = useMemo(
    () => SCENARIOS.find((item) => item.id === scenarioId) ?? SCENARIOS[0],
    [scenarioId],
  );

  const score = useMemo(() => {
    if (!submitted) return 0;
    let value = 0;
    if (firstBroken === scenario.firstBrokenLink) value += 35;
    if (lastAdmissible === scenario.lastAdmissibleLink) value += 30;
    if (decision === scenario.decision) value += 35;
    return value;
  }, [submitted, firstBroken, lastAdmissible, decision, scenario]);

  const firstBrokenOrder = orderOf(firstBroken);
  const lastAdmissibleOrder = orderOf(lastAdmissible);
  const expectedBrokenOrder = orderOf(scenario.firstBrokenLink);

  function chooseScenario(id: string) {
    const next = SCENARIOS.find((item) => item.id === id) ?? SCENARIOS[0];
    setScenarioId(next.id);
    setFirstBroken(next.firstBrokenLink);
    setLastAdmissible(next.lastAdmissibleLink);
    setDecision(next.decision);
    setSubmitted(false);
  }

  return (
    <main className="sim">
      <style>{`
        .sim {
          --bg: #020711;
          --panel: rgba(8, 20, 32, .86);
          --panel2: rgba(11, 28, 43, .78);
          --line: rgba(129, 176, 210, .14);
          --line-strong: rgba(84, 232, 255, .26);
          --cyan: #54e8ff;
          --cyan-soft: #c4f8ff;
          --rose: #ff829e;
          --rose-soft: #ffd0da;
          --green: #45eaa6;
          --amber: #f1c769;
          --indigo: #a8b2ff;
          --text: #eff8ff;
          --muted: #93a8ba;
          --dim: #647b8f;
          min-height: 100vh;
          overflow: hidden;
          color: var(--text);
          background:
            radial-gradient(circle at 9% 0%, rgba(255,130,158,.11), transparent 25%),
            radial-gradient(circle at 93% 8%, rgba(84,232,255,.09), transparent 25%),
            linear-gradient(180deg, #020711 0%, #030a13 55%, #020711 100%);
        }

        .sim * { box-sizing: border-box; }

        .sim-shell {
          width: min(1460px, calc(100% - 48px));
          margin: 0 auto;
        }

        .sim-hero {
          position: relative;
          overflow: hidden;
          border-bottom: 1px solid var(--line);
        }

        .sim-hero::before {
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

        .sim-topline {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          padding-top: 20px;
        }

        .sim-back {
          color: var(--cyan-soft);
          font-size: .72rem;
          font-weight: 900;
          text-decoration: none;
        }

        .sim-mode {
          padding: 7px 11px;
          border: 1px solid rgba(255,130,158,.18);
          border-radius: 999px;
          background: rgba(255,130,158,.045);
          color: var(--rose-soft);
          font-size: .56rem;
          font-weight: 950;
          letter-spacing: .12em;
          text-transform: uppercase;
        }

        .sim-hero-grid {
          position: relative;
          display: grid;
          grid-template-columns: minmax(0, 1.08fr) minmax(420px, .92fr);
          gap: 62px;
          align-items: center;
          padding: 70px 0 80px;
        }

        .sim-kicker {
          color: var(--rose);
          font-size: .64rem;
          font-weight: 950;
          letter-spacing: .20em;
          text-transform: uppercase;
        }

        .sim-title {
          max-width: 980px;
          margin: 14px 0 0;
          font-size: clamp(3.2rem, 6vw, 6.2rem);
          line-height: .95;
          letter-spacing: -.06em;
        }

        .sim-title span {
          display: block;
          color: var(--rose-soft);
        }

        .sim-lead {
          max-width: 900px;
          margin: 26px 0 0;
          color: #c8d8e4;
          font-size: clamp(1rem, 1.35vw, 1.18rem);
          line-height: 1.8;
        }

        .sim-rules {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 24px;
        }

        .sim-rule {
          padding: 7px 10px;
          border: 1px solid var(--line);
          border-radius: 999px;
          background: rgba(255,255,255,.026);
          color: var(--muted);
          font-size: .56rem;
          font-weight: 850;
        }

        .sim-radar {
          position: relative;
          width: min(500px, 100%);
          aspect-ratio: 1;
          margin: 0 auto;
        }

        .sim-ring {
          position: absolute;
          inset: 50% auto auto 50%;
          transform: translate(-50%, -50%);
          border: 1px solid rgba(129,176,210,.10);
          border-radius: 50%;
        }

        .sim-ring.r1 { width: 96%; height: 96%; }
        .sim-ring.r2 { width: 75%; height: 75%; border-color: rgba(255,130,158,.12); }
        .sim-ring.r3 { width: 54%; height: 54%; border-color: rgba(84,232,255,.12); }
        .sim-ring.r4 { width: 34%; height: 34%; border-color: rgba(241,199,105,.12); }

        .sim-axis-h,
        .sim-axis-v {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }

        .sim-axis-h {
          width: 88%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,130,158,.15), transparent);
        }

        .sim-axis-v {
          width: 1px;
          height: 88%;
          background: linear-gradient(180deg, transparent, rgba(84,232,255,.13), transparent);
        }

        .sim-core {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 176px;
          height: 176px;
          transform: translate(-50%, -50%);
          display: grid;
          place-items: center;
          border: 1px solid rgba(255,130,158,.24);
          border-radius: 50%;
          background:
            radial-gradient(circle at 30% 25%, rgba(255,130,158,.12), transparent 44%),
            rgba(5,16,27,.95);
          box-shadow: 0 0 90px rgba(255,130,158,.08);
          text-align: center;
        }

        .sim-core small {
          display: block;
          color: var(--rose);
          font-size: .58rem;
          font-weight: 950;
          letter-spacing: .18em;
        }

        .sim-core strong {
          display: block;
          margin-top: 4px;
          font-size: 3.4rem;
          line-height: 1;
          letter-spacing: -.06em;
        }

        .sim-core span {
          display: block;
          margin-top: 6px;
          color: var(--muted);
          font-size: .64rem;
        }

        .sim-node {
          position: absolute;
          min-width: 112px;
          padding: 10px 12px;
          border: 1px solid var(--line);
          border-radius: 13px;
          background: rgba(5,16,27,.92);
          box-shadow: 0 12px 34px rgba(0,0,0,.24);
        }

        .sim-node b {
          display: block;
          color: var(--rose);
          font-size: .55rem;
          letter-spacing: .12em;
        }

        .sim-node span {
          display: block;
          margin-top: 4px;
          color: #d7e5ef;
          font-size: .66rem;
          font-weight: 850;
        }

        .sim-node.n1 { left: 0; top: 18%; }
        .sim-node.n2 { right: 0; top: 24%; }
        .sim-node.n3 { right: 5%; bottom: 18%; }
        .sim-node.n4 { left: 0; bottom: 18%; }
        .sim-node.n5 { left: 50%; top: 0; transform: translateX(-50%); }

        .sim-metrics {
          border-bottom: 1px solid var(--line);
          background: rgba(4,12,20,.76);
        }

        .sim-metric-grid {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
        }

        .sim-metric {
          min-height: 92px;
          padding: 19px 20px;
          border-right: 1px solid var(--line);
        }

        .sim-metric:last-child { border-right: 0; }

        .sim-metric strong {
          display: block;
          font-size: 1.9rem;
          line-height: 1;
          letter-spacing: -.04em;
        }

        .sim-metric span {
          display: block;
          margin-top: 7px;
          color: var(--dim);
          font-size: .56rem;
          font-weight: 900;
          letter-spacing: .09em;
          text-transform: uppercase;
        }

        .sim-section {
          padding: 72px 0 88px;
        }

        .sim-section.alt {
          border-top: 1px solid var(--line);
          border-bottom: 1px solid var(--line);
          background: rgba(4,12,20,.66);
        }

        .sim-section-head {
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: 28px;
          margin-bottom: 28px;
        }

        .sim-eyebrow {
          color: var(--cyan);
          font-size: .62rem;
          font-weight: 950;
          letter-spacing: .16em;
          text-transform: uppercase;
        }

        .sim-h2 {
          margin: 9px 0 0;
          font-size: clamp(2rem, 3.4vw, 3.7rem);
          line-height: 1;
          letter-spacing: -.045em;
        }

        .sim-copy {
          max-width: 620px;
          margin: 0;
          color: var(--muted);
          font-size: .78rem;
          line-height: 1.7;
        }

        .sim-scenarios {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
        }

        .sim-scenario {
          min-height: 188px;
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

        .sim-scenario:hover {
          transform: translateY(-2px);
          border-color: rgba(255,130,158,.22);
          background: rgba(255,130,158,.03);
        }

        .sim-scenario.active {
          border-color: rgba(255,130,158,.34);
          background:
            radial-gradient(circle at 100% 0%, rgba(255,130,158,.09), transparent 44%),
            rgba(255,130,158,.045);
        }

        .sim-scenario-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 10px;
        }

        .sim-scenario-code {
          color: var(--rose);
          font-size: .56rem;
          font-weight: 950;
          letter-spacing: .12em;
          text-transform: uppercase;
        }

        .sim-scenario-index {
          color: rgba(255,255,255,.09);
          font-size: 2.5rem;
          line-height: .9;
          font-weight: 950;
        }

        .sim-scenario h3 {
          margin: 0;
          font-size: .95rem;
          line-height: 1.3;
        }

        .sim-scenario p {
          margin: 0;
          color: var(--muted);
          font-size: .68rem;
          line-height: 1.6;
        }

        .sim-scenario-action {
          margin-top: auto;
          padding-top: 13px;
          border-top: 1px solid var(--line);
          color: var(--rose-soft);
          font-size: .60rem;
          font-weight: 900;
        }

        .sim-workspace {
          display: grid;
          grid-template-columns: minmax(0, .92fr) minmax(0, 1.08fr);
          gap: 20px;
          align-items: start;
        }

        .sim-console,
        .sim-analysis {
          overflow: hidden;
          border: 1px solid var(--line);
          border-radius: 24px;
          background: rgba(255,255,255,.024);
        }

        .sim-console-head,
        .sim-analysis-head {
          padding: 22px 24px 20px;
          border-bottom: 1px solid var(--line);
        }

        .sim-console-head {
          background:
            radial-gradient(circle at 100% 0%, rgba(255,130,158,.08), transparent 42%),
            rgba(255,255,255,.01);
        }

        .sim-analysis-head {
          background:
            radial-gradient(circle at 100% 0%, rgba(84,232,255,.07), transparent 42%),
            rgba(255,255,255,.01);
        }

        .sim-panel-kicker {
          color: var(--rose);
          font-size: .56rem;
          font-weight: 950;
          letter-spacing: .14em;
          text-transform: uppercase;
        }

        .sim-analysis .sim-panel-kicker {
          color: var(--cyan);
        }

        .sim-console h2,
        .sim-analysis h2 {
          margin: 8px 0 0;
          font-size: 1.8rem;
          line-height: 1.08;
          letter-spacing: -.035em;
        }

        .sim-pressure {
          margin: 13px 0 0;
          color: var(--muted);
          font-size: .76rem;
          line-height: 1.7;
        }

        .sim-task {
          margin-top: 16px;
          padding: 14px;
          border: 1px solid rgba(84,232,255,.14);
          border-radius: 13px;
          background: rgba(84,232,255,.035);
        }

        .sim-task small {
          display: block;
          color: var(--cyan);
          font-size: .52rem;
          font-weight: 950;
          letter-spacing: .12em;
          text-transform: uppercase;
        }

        .sim-task p {
          margin: 7px 0 0;
          color: #dceaf4;
          font-size: .70rem;
          line-height: 1.55;
        }

        .sim-console-body,
        .sim-analysis-body {
          padding: 22px 24px 24px;
        }

        .sim-field {
          display: grid;
          gap: 7px;
          margin-top: 15px;
        }

        .sim-field:first-child { margin-top: 0; }

        .sim-field label {
          color: #dceaf4;
          font-size: .67rem;
          font-weight: 900;
        }

        .sim-select {
          width: 100%;
          min-height: 46px;
          padding: 0 12px;
          border: 1px solid var(--line);
          border-radius: 12px;
          background: #07111e;
          color: var(--text);
          outline: none;
          font-size: .68rem;
        }

        .sim-select:focus {
          border-color: rgba(255,130,158,.38);
          box-shadow: 0 0 0 3px rgba(255,130,158,.06);
        }

        .sim-decision-grid {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 7px;
        }

        .sim-decision {
          min-height: 44px;
          border: 1px solid var(--line);
          border-radius: 11px;
          background: rgba(255,255,255,.025);
          color: var(--muted);
          cursor: pointer;
          font-size: .58rem;
          font-weight: 950;
          letter-spacing: .06em;
          transition: 150ms ease;
        }

        .sim-decision:hover {
          border-color: rgba(255,130,158,.22);
          color: #fff;
        }

        .sim-decision.active {
          border-color: rgba(255,130,158,.34);
          background: rgba(255,130,158,.075);
          color: var(--rose-soft);
        }

        .sim-evaluate {
          width: 100%;
          min-height: 48px;
          margin-top: 18px;
          border: 1px solid rgba(255,130,158,.30);
          border-radius: 12px;
          background: rgba(255,130,158,.09);
          color: var(--rose-soft);
          cursor: pointer;
          font-size: .69rem;
          font-weight: 950;
          transition: 160ms ease;
        }

        .sim-evaluate:hover {
          transform: translateY(-1px);
          background: rgba(255,130,158,.13);
          border-color: rgba(255,130,158,.42);
        }

        .sim-route-map {
          margin-top: 20px;
          padding-top: 18px;
          border-top: 1px solid var(--line);
        }

        .sim-route-map-label {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          color: var(--dim);
          font-size: .52rem;
          font-weight: 900;
          letter-spacing: .10em;
          text-transform: uppercase;
        }

        .sim-route-track {
          display: grid;
          grid-template-columns: repeat(24, minmax(0, 1fr));
          gap: 4px;
          margin-top: 10px;
        }

        .sim-route-segment {
          height: 9px;
          border: 1px solid rgba(255,255,255,.05);
          border-radius: 999px;
          background: rgba(255,255,255,.035);
        }

        .sim-route-segment.preserved {
          border-color: rgba(69,234,166,.13);
          background: rgba(69,234,166,.14);
        }

        .sim-route-segment.break {
          border-color: rgba(255,130,158,.28);
          background: rgba(255,130,158,.27);
          box-shadow: 0 0 14px rgba(255,130,158,.15);
        }

        .sim-route-segment.downstream {
          border-color: rgba(241,199,105,.08);
          background: rgba(241,199,105,.055);
        }

        .sim-analysis-placeholder {
          min-height: 350px;
          display: grid;
          place-items: center;
          padding: 24px;
          text-align: center;
        }

        .sim-analysis-placeholder strong {
          display: block;
          font-size: 1rem;
        }

        .sim-analysis-placeholder p {
          max-width: 420px;
          margin: 10px auto 0;
          color: var(--muted);
          font-size: .72rem;
          line-height: 1.65;
        }

        .sim-score-row {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 18px;
        }

        .sim-score strong {
          display: block;
          font-size: 4.3rem;
          line-height: .9;
          letter-spacing: -.07em;
        }

        .sim-score span {
          display: block;
          margin-top: 8px;
          color: var(--muted);
          font-size: .64rem;
        }

        .sim-status {
          padding: 7px 10px;
          border: 1px solid rgba(241,199,105,.22);
          border-radius: 999px;
          background: rgba(241,199,105,.055);
          color: var(--amber);
          font-size: .56rem;
          font-weight: 950;
          letter-spacing: .08em;
        }

        .sim-status.perfect {
          border-color: rgba(69,234,166,.22);
          background: rgba(69,234,166,.055);
          color: var(--green);
        }

        .sim-results {
          display: grid;
          gap: 10px;
          margin-top: 22px;
        }

        .sim-result {
          padding: 14px;
          border: 1px solid var(--line);
          border-radius: 13px;
          background: rgba(0,0,0,.10);
        }

        .sim-result-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .sim-result-label {
          color: var(--dim);
          font-size: .52rem;
          font-weight: 900;
          letter-spacing: .10em;
          text-transform: uppercase;
        }

        .sim-result-state {
          font-size: .54rem;
          font-weight: 950;
          letter-spacing: .06em;
        }

        .sim-result-state.correct { color: var(--green); }
        .sim-result-state.reassess { color: var(--amber); }

        .sim-result p {
          margin: 8px 0 0;
          color: #dceaf4;
          font-size: .67rem;
          line-height: 1.5;
        }

        .sim-result .expected {
          color: var(--muted);
        }

        .sim-recovery {
          margin-top: 20px;
          overflow: hidden;
          border: 1px solid rgba(69,234,166,.16);
          border-radius: 16px;
          background: rgba(69,234,166,.035);
        }

        .sim-recovery-head {
          padding: 14px 16px;
          border-bottom: 1px solid rgba(69,234,166,.12);
          color: var(--green);
          font-size: .56rem;
          font-weight: 950;
          letter-spacing: .12em;
          text-transform: uppercase;
        }

        .sim-recovery-body {
          padding: 16px;
        }

        .sim-recovery-body p {
          margin: 0;
          color: #d9e9e1;
          font-size: .70rem;
          line-height: 1.65;
        }

        .sim-why {
          margin-top: 14px;
          padding-top: 14px;
          border-top: 1px solid rgba(255,255,255,.08);
        }

        .sim-why small {
          display: block;
          color: var(--dim);
          font-size: .50rem;
          font-weight: 900;
          letter-spacing: .10em;
          text-transform: uppercase;
        }

        .sim-why p {
          margin-top: 7px;
          color: var(--muted);
        }

        .sim-doctrine-grid {
          display: grid;
          grid-template-columns: minmax(0, .85fr) minmax(0, 1.15fr);
          gap: 34px;
          align-items: start;
        }

        .sim-doctrine h2 {
          margin: 9px 0 0;
          font-size: clamp(2rem, 3.4vw, 3.4rem);
          line-height: 1.04;
          letter-spacing: -.045em;
        }

        .sim-doctrine p {
          margin: 18px 0 0;
          color: var(--muted);
          font-size: .78rem;
          line-height: 1.75;
        }

        .sim-doctrine-cards {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 11px;
        }

        .sim-doctrine-card {
          min-height: 148px;
          padding: 16px;
          border: 1px solid var(--line);
          border-radius: 15px;
          background: rgba(255,255,255,.022);
        }

        .sim-doctrine-card b {
          color: var(--rose);
          font-size: .56rem;
          letter-spacing: .12em;
        }

        .sim-doctrine-card strong {
          display: block;
          margin-top: 8px;
          font-size: .76rem;
        }

        .sim-doctrine-card span {
          display: block;
          margin-top: 7px;
          color: var(--muted);
          font-size: .64rem;
          line-height: 1.55;
        }

        @media (max-width: 1180px) {
          .sim-hero-grid { grid-template-columns: 1fr; }
          .sim-radar { max-width: 500px; }
          .sim-workspace { grid-template-columns: 1fr; }
        }

        @media (max-width: 900px) {
          .sim-scenarios { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .sim-doctrine-grid { grid-template-columns: 1fr; }
        }

        @media (max-width: 760px) {
          .sim-shell { width: min(100% - 28px, 1460px); }
          .sim-topline,
          .sim-section-head { display: grid; align-items: start; }
          .sim-title { font-size: clamp(2.8rem, 13vw, 4.8rem); }
          .sim-metric-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .sim-metric { border-bottom: 1px solid var(--line); }
          .sim-metric:nth-child(2n) { border-right: 0; }
          .sim-decision-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .sim-doctrine-cards { grid-template-columns: 1fr; }
        }

        @media (max-width: 560px) {
          .sim-scenarios { grid-template-columns: 1fr; }
          .sim-node { display: none; }
          .sim-score-row { display: grid; }
        }
      `}</style>

      <section className="sim-hero">
        <div className="sim-shell sim-topline">
          <Link
            href="/academy/24-link-architecture"
            className="sim-back"
          >
            ← Back to 24-Link Explorer
          </Link>

          <span className="sim-mode">
            Pressure Lab · governed simulation
          </span>
        </div>

        <div className="sim-shell sim-hero-grid">
          <div>
            <div className="sim-kicker">
              TA-14 Academy · Pressure Lab
            </div>

            <h1 className="sim-title">
              Chain Failure
              <span>Simulator.</span>
            </h1>

            <p className="sim-lead">
              The learner is scored on preservation of the admissible route,
              not on whether the scenario reaches execution. Find the first
              broken link, preserve the last admissible state, and make the
              correct governed decision.
            </p>

            <div className="sim-rules">
              <span className="sim-rule">Locate first failure</span>
              <span className="sim-rule">Preserve last admissible state</span>
              <span className="sim-rule">Choose governed response</span>
              <span className="sim-rule">Protect consequence boundary</span>
            </div>
          </div>

          <div className="sim-radar" aria-label="TA-14 simulator pressure motif">
            <div className="sim-ring r1" />
            <div className="sim-ring r2" />
            <div className="sim-ring r3" />
            <div className="sim-ring r4" />
            <div className="sim-axis-h" />
            <div className="sim-axis-v" />

            <div className="sim-core">
              <div>
                <small>PRESSURE LAB</small>
                <strong>24</strong>
                <span>links under governed pressure</span>
              </div>
            </div>

            <div className="sim-node n1"><b>01</b><span>Evidence</span></div>
            <div className="sim-node n2"><b>08</b><span>Authority</span></div>
            <div className="sim-node n3"><b>16</b><span>Runtime</span></div>
            <div className="sim-node n4"><b>21</b><span>Outcome</span></div>
            <div className="sim-node n5"><b>23</b><span>Memory</span></div>
          </div>
        </div>
      </section>

      <section className="sim-metrics">
        <div className="sim-shell sim-metric-grid">
          <Metric value="6" label="Pressure scenarios" />
          <Metric value="24" label="Canonical links" />
          <Metric value="5" label="Governed decisions" />
          <Metric value="3" label="Scored judgments" />
          <Metric value="100" label="Maximum route score" />
        </div>
      </section>

      <section className="sim-section alt">
        <div className="sim-shell">
          <div className="sim-section-head">
            <div>
              <div className="sim-eyebrow" style={{ color: "var(--rose)" }}>
                Pressure cases
              </div>
              <h2 className="sim-h2">
                Choose the condition that breaks the route.
              </h2>
            </div>

            <p className="sim-copy">
              Each scenario isolates a different admissibility pressure:
              evidence decay, authority drift, runtime change, correct refusal,
              outcome divergence, or institutional-memory conflict.
            </p>
          </div>

          <div className="sim-scenarios">
            {SCENARIOS.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => chooseScenario(item.id)}
                className={[
                  "sim-scenario",
                  scenario.id === item.id ? "active" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <div className="sim-scenario-top">
                  <span className="sim-scenario-code">Scenario</span>
                  <span className="sim-scenario-index">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <h3>{item.title}</h3>
                <p>{item.pressure}</p>

                <span className="sim-scenario-action">
                  {scenario.id === item.id
                    ? "Active pressure case"
                    : "Load scenario →"}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="sim-section">
        <div className="sim-shell">
          <div className="sim-section-head">
            <div>
              <div className="sim-eyebrow">
                Live simulation console
              </div>
              <h2 className="sim-h2">
                Find the first unsupported state before consequence attaches.
              </h2>
            </div>

            <p className="sim-copy">
              Your answer is evaluated on three separate judgments: where the
              route first breaks, what the last still-admissible state was, and
              which governed decision correctly preserves the chain.
            </p>
          </div>

          <div className="sim-workspace">
            <section className="sim-console">
              <div className="sim-console-head">
                <div className="sim-panel-kicker">
                  Active pressure case
                </div>
                <h2>{scenario.title}</h2>
                <p className="sim-pressure">{scenario.pressure}</p>

                <div className="sim-task">
                  <small>Your task</small>
                  <p>{scenario.prompt}</p>
                </div>
              </div>

              <div className="sim-console-body">
                <LinkSelect
                  labelText="First broken link"
                  value={firstBroken}
                  onChange={(value) => {
                    setFirstBroken(value);
                    setSubmitted(false);
                  }}
                />

                <LinkSelect
                  labelText="Last admissible link"
                  value={lastAdmissible}
                  onChange={(value) => {
                    setLastAdmissible(value);
                    setSubmitted(false);
                  }}
                />

                <div className="sim-field">
                  <label>Governed decision</label>
                  <div className="sim-decision-grid">
                    {DECISIONS.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => {
                          setDecision(item);
                          setSubmitted(false);
                        }}
                        className={[
                          "sim-decision",
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

                <div className="sim-route-map">
                  <div className="sim-route-map-label">
                    <span>Current diagnosis</span>
                    <span>
                      break at {String(firstBrokenOrder).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="sim-route-track" aria-label="24-link route diagnosis">
                    {TA14_24_LINKS.map((item) => {
                      const state =
                        item.order < firstBrokenOrder
                          ? "preserved"
                          : item.order === firstBrokenOrder
                            ? "break"
                            : "downstream";

                      return (
                        <span
                          key={item.linkId}
                          className={`sim-route-segment ${state}`}
                          title={`${String(item.order).padStart(2, "0")} ${item.canonicalName}`}
                        />
                      );
                    })}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSubmitted(true)}
                  className="sim-evaluate"
                >
                  Evaluate route decision
                </button>
              </div>
            </section>

            <section className="sim-analysis">
              <div className="sim-analysis-head">
                <div className="sim-panel-kicker">
                  Route analysis
                </div>
                <h2>
                  {submitted
                    ? "Governed evaluation"
                    : "Analysis remains sealed until submission"}
                </h2>
              </div>

              <div className="sim-analysis-body">
                {!submitted ? (
                  <div className="sim-analysis-placeholder">
                    <div>
                      <strong>
                        Submit your route decision to reveal the governed analysis.
                      </strong>
                      <p>
                        The simulator withholds the answer until you commit to
                        a first broken link, last admissible state, and governed
                        response.
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="sim-score-row">
                      <div className="sim-score">
                        <strong>{score}</strong>
                        <span>route-preservation score / 100</span>
                      </div>

                      <span
                        className={[
                          "sim-status",
                          score === 100 ? "perfect" : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                      >
                        {score === 100
                          ? "ROUTE PRESERVED"
                          : "REASSESS"}
                      </span>
                    </div>

                    <div className="sim-results">
                      <ResultRow
                        labelText="First broken link"
                        chosen={label(firstBroken)}
                        expected={label(scenario.firstBrokenLink)}
                        correct={firstBroken === scenario.firstBrokenLink}
                      />

                      <ResultRow
                        labelText="Last admissible link"
                        chosen={label(lastAdmissible)}
                        expected={label(scenario.lastAdmissibleLink)}
                        correct={lastAdmissible === scenario.lastAdmissibleLink}
                      />

                      <ResultRow
                        labelText="Decision"
                        chosen={decision}
                        expected={scenario.decision}
                        correct={decision === scenario.decision}
                      />
                    </div>

                    <div className="sim-route-map">
                      <div className="sim-route-map-label">
                        <span>Expected pressure boundary</span>
                        <span>
                          break at {String(expectedBrokenOrder).padStart(2, "0")}
                        </span>
                      </div>

                      <div className="sim-route-track">
                        {TA14_24_LINKS.map((item) => {
                          const state =
                            item.order < expectedBrokenOrder
                              ? "preserved"
                              : item.order === expectedBrokenOrder
                                ? "break"
                                : "downstream";

                          return (
                            <span
                              key={item.linkId}
                              className={`sim-route-segment ${state}`}
                              title={`${String(item.order).padStart(2, "0")} ${item.canonicalName}`}
                            />
                          );
                        })}
                      </div>
                    </div>

                    <section className="sim-recovery">
                      <div className="sim-recovery-head">
                        Governed recovery
                      </div>

                      <div className="sim-recovery-body">
                        <p>{scenario.recovery}</p>

                        <div className="sim-why">
                          <small>Why</small>
                          <p>{scenario.rationale}</p>
                        </div>
                      </div>
                    </section>
                  </>
                )}
              </div>
            </section>
          </div>
        </div>
      </section>

      <section className="sim-section alt sim-doctrine">
        <div className="sim-shell sim-doctrine-grid">
          <div>
            <div className="sim-eyebrow" style={{ color: "var(--rose)" }}>
              Simulator doctrine
            </div>

            <h2>
              Reaching Execution is not the highest score.
            </h2>

            <p>
              Preserving admissibility is the goal. A correct HOLD, REFUSE,
              NARROW, or ESCALATE decision can be the successful result when
              the evidence, authority, runtime state, or consequence conditions
              no longer support continuation.
            </p>
          </div>

          <div className="sim-doctrine-cards">
            <DoctrineCard
              code="HOLD"
              title="Stop without abandoning the route"
              text="Use HOLD when the route may become admissible again after evidence, authority, runtime conditions, or another support state is restored."
            />
            <DoctrineCard
              code="REFUSE"
              title="Correct non-occurrence can be success"
              text="Use REFUSE when execution conditions are not supportable and non-execution is the governed result."
            />
            <DoctrineCard
              code="NARROW"
              title="Reduce consequence-bearing scope"
              text="NARROW preserves only the portion of the route still supported by evidence, authority, and current conditions."
            />
            <DoctrineCard
              code="ESC"
              title="Escalate unresolved governance conflict"
              text="ESCALATE when the system cannot safely resolve authority, evidence, memory, or consequence conflict within the current route."
            />
          </div>
        </div>
      </section>
    </main>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="sim-metric">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function LinkSelect({
  labelText,
  value,
  onChange,
}: {
  labelText: string;
  value: TA14LinkId;
  onChange: (value: TA14LinkId) => void;
}) {
  return (
    <div className="sim-field">
      <label>{labelText}</label>
      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value as TA14LinkId)
        }
        className="sim-select"
      >
        {TA14_24_LINKS.map((item) => (
          <option key={item.linkId} value={item.linkId}>
            {String(item.order).padStart(2, "0")} · {item.canonicalName}
          </option>
        ))}
      </select>
    </div>
  );
}

function ResultRow({
  labelText,
  chosen,
  expected,
  correct,
}: {
  labelText: string;
  chosen: string;
  expected: string;
  correct: boolean;
}) {
  return (
    <div className="sim-result">
      <div className="sim-result-top">
        <span className="sim-result-label">{labelText}</span>
        <span
          className={[
            "sim-result-state",
            correct ? "correct" : "reassess",
          ].join(" ")}
        >
          {correct ? "CORRECT" : "REASSESS"}
        </span>
      </div>

      <p>Chosen: {chosen}</p>

      {!correct ? (
        <p className="expected">Expected: {expected}</p>
      ) : null}
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
    <article className="sim-doctrine-card">
      <b>{code}</b>
      <strong>{title}</strong>
      <span>{text}</span>
    </article>
  );
}
