"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const WORKSPACE_ROUTES = {
  build: "/workspace/build",
  registry: "/workspace/registry",
  verify: "/workspace/verify",
} as const;

type Decision = "ALLOW" | "HOLD" | "DENY" | "ESCALATE";
type TestMode = "SIMULATION" | "SIGNED";
type RouteKey = "vendor" | "agent" | "hvac";

type Finding = {
  code: string;
  stage: string;
  severity: "INFO" | "WARNING" | "BLOCKING";
  message: string;
};

type TestResult = {
  testId: string;
  routeId: string;
  routeName: string;
  mode: TestMode;
  decision: Decision;
  score: number;
  createdAt: string;
  findings: Finding[];
  receipt: Record<string, unknown>;
};

const routes = {
  vendor: {
    rid: "TA-14-RID-VP-0042",
    name: "Governed Vendor Payment",
    domain: "Finance",
    description:
      "Tests invoice, purchase-order, supplier-account, approver, commit, execution, and settlement correspondence.",
  },
  agent: {
    rid: "TA-14-RID-AI-0018",
    name: "Bounded AI Agent Action",
    domain: "AI Governance",
    description:
      "Tests delegated authority, tool scope, evidence continuity, action binding, execution correspondence, and outcome verification.",
  },
  hvac: {
    rid: "TA-14-RID-HVAC-0009",
    name: "Analyzer-Governed Refrigerant Intervention",
    domain: "HVAC",
    description:
      "Tests equipment identity, technician authority, analyzer evidence, intervention threshold, governed execution, and post-intervention performance.",
  },
} satisfies Record<
  RouteKey,
  { rid: string; name: string; domain: string; description: string }
>;

const initialHistory: TestResult[] = [
  {
    testId: "TA-14-TEST-9F21C4",
    routeId: "TA-14-RID-VP-0042",
    routeName: "Governed Vendor Payment",
    mode: "SIMULATION",
    decision: "ALLOW",
    score: 100,
    createdAt: "2026-07-17T18:14:00.000Z",
    findings: [],
    receipt: {},
  },
  {
    testId: "TA-14-TEST-7A11B8",
    routeId: "TA-14-RID-AI-0018",
    routeName: "Bounded AI Agent Action",
    mode: "SIMULATION",
    decision: "HOLD",
    score: 75,
    createdAt: "2026-07-17T17:40:00.000Z",
    findings: [
      {
        code: "AUTHORITY_SOURCE_UNKNOWN",
        stage: "Binding",
        severity: "BLOCKING",
        message: "Production authority source remains UNKNOWN.",
      },
    ],
    receipt: {},
  },
];

function makeId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
  }

  return `${prefix}-${Date.now().toString(16).slice(-8).toUpperCase()}`;
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

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "UNKNOWN";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export default function RouteTestingDeskPage() {
  const [routeKey, setRouteKey] = useState<RouteKey>("vendor");
  const [mode, setMode] = useState<TestMode>("SIMULATION");
  const [authorityPresent, setAuthorityPresent] = useState(true);
  const [evidenceComplete, setEvidenceComplete] = useState(true);
  const [continuityIntact, setContinuityIntact] = useState(true);
  const [bindingExact, setBindingExact] = useState(true);
  const [outcomeVerifiable, setOutcomeVerifiable] = useState(true);
  const [history, setHistory] = useState<TestResult[]>(initialHistory);
  const [current, setCurrent] = useState<TestResult | null>(null);
  const [copied, setCopied] = useState(false);

  const selectedRoute = routes[routeKey];

  const preview = useMemo(() => {
    const findings: Finding[] = [];

    if (!authorityPresent) {
      findings.push({
        code: "AUTHORITY_NOT_PROVEN",
        stage: "Admissibility",
        severity: "BLOCKING",
        message:
          "The proposed actor is not bound to a current, consequence-specific authority source.",
      });
    }

    if (!evidenceComplete) {
      findings.push({
        code: "REQUIRED_EVIDENCE_MISSING",
        stage: "Record",
        severity: "BLOCKING",
        message:
          "At least one evidence artifact required by the route is absent or UNKNOWN.",
      });
    }

    if (!continuityIntact) {
      findings.push({
        code: "CONTINUITY_BROKEN",
        stage: "Continuity",
        severity: "BLOCKING",
        message:
          "The route cannot prove an intact chain from evidence origin through the proposed execution.",
      });
    }

    if (!bindingExact) {
      findings.push({
        code: "ROUTE_BINDING_MISMATCH",
        stage: "Binding",
        severity: "BLOCKING",
        message:
          "Actor, beneficiary, destination, object, amount, tool, or environment does not match the admitted route.",
      });
    }

    if (!outcomeVerifiable) {
      findings.push({
        code: "OUTCOME_SOURCE_UNRESOLVED",
        stage: "Outcome",
        severity: "WARNING",
        message:
          "The route does not identify an authoritative outcome receipt or post-execution verification source.",
      });
    }

    const blocking = findings.filter((item) => item.severity === "BLOCKING");
    const warnings = findings.filter((item) => item.severity === "WARNING");

    let decision: Decision = "ALLOW";
    if (!authorityPresent && !continuityIntact) decision = "DENY";
    else if (blocking.length) decision = "HOLD";
    else if (warnings.length) decision = "ESCALATE";

    const score = Math.max(
      0,
      100 -
        blocking.length * 22 -
        warnings.length * 10,
    );

    return { findings, decision, score };
  }, [
    authorityPresent,
    evidenceComplete,
    continuityIntact,
    bindingExact,
    outcomeVerifiable,
  ]);

  function runTest() {
    const createdAt = new Date().toISOString();
    const testId = makeId("TA-14-TEST");

    const receipt = {
      schema: "TA_14_ROUTE_TEST_RECEIPT_V1",
      testId,
      route: {
        rid: selectedRoute.rid,
        name: selectedRoute.name,
        domain: selectedRoute.domain,
      },
      mode,
      createdAt,
      inputAssertions: {
        authorityPresent,
        evidenceComplete,
        continuityIntact,
        bindingExact,
        outcomeVerifiable,
      },
      determination: {
        decision: preview.decision,
        readinessScore: preview.score,
        findings: preview.findings,
      },
      paymentBoundary:
        mode === "SIGNED"
          ? {
              feeUsd: 9,
              status: "PAYMENT_REQUIRED",
              note:
                "This interface models the signed-test boundary. It does not process payment or issue a production cryptographic signature.",
            }
          : {
              feeUsd: 0,
              status: "FREE_SIMULATION",
              note:
                "Simulation tests are repeatable and do not create a production-admissible execution receipt.",
            },
      limitation:
        "A test result evaluates supplied assertions. It does not prove that the assertions are true without independently verifiable evidence and trusted production signing.",
    };

    const result: TestResult = {
      testId,
      routeId: selectedRoute.rid,
      routeName: selectedRoute.name,
      mode,
      decision: preview.decision,
      score: preview.score,
      createdAt,
      findings: preview.findings,
      receipt,
    };

    setCurrent(result);
    setHistory((items) => [result, ...items]);
  }

  async function copyReceipt() {
    if (!current) return;
    await navigator.clipboard.writeText(
      JSON.stringify(current.receipt, null, 2),
    );
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <main className="testing-page">
      <style>{`
        * { box-sizing: border-box; }

        .testing-page {
          min-height: calc(100vh - 68px);
          padding: 48px 0 110px;
          color: #edf6ff;
        }

        .testing-wrap {
          width: min(1360px, calc(100% - 48px));
          margin: 0 auto;
        }

        .hero {
          position: relative;
          overflow: hidden;
          padding: clamp(32px, 5vw, 68px);
          border: 1px solid rgba(130, 178, 218, .16);
          border-radius: 34px;
          background:
            radial-gradient(circle at 86% 8%, rgba(139, 111, 255, .18), transparent 27%),
            radial-gradient(circle at 13% 2%, rgba(72, 223, 255, .17), transparent 31%),
            linear-gradient(135deg, rgba(14, 30, 48, .97), rgba(5, 11, 20, .98));
          box-shadow: 0 38px 120px rgba(0,0,0,.35);
        }

        .hero::after {
          content: "TEST";
          position: absolute;
          right: 0;
          bottom: -48px;
          color: rgba(255,255,255,.025);
          font-size: clamp(7rem, 19vw, 16rem);
          font-weight: 1000;
          letter-spacing: -.1em;
          pointer-events: none;
        }

        .hero-content { position: relative; z-index: 1; max-width: 930px; }
        .eyebrow {
          margin: 0 0 17px;
          color: #6ce9ff;
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
          background: linear-gradient(100deg, #fff, #8ceaff 52%, #b5a6ff);
          background-clip: text;
          -webkit-background-clip: text;
        }

        .hero-copy {
          max-width: 820px;
          margin: 24px 0 0;
          color: #9eb4c8;
          font-size: 1.08rem;
          line-height: 1.75;
        }

        .hero-actions, .result-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 11px;
          margin-top: 28px;
        }

        .button, .button-secondary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 47px;
          padding: 0 19px;
          border-radius: 999px;
          text-decoration: none;
          font-weight: 900;
          cursor: pointer;
          transition: transform .2s ease, filter .2s ease;
        }

        .button:hover, .button-secondary:hover { transform: translateY(-2px); }

        .button:focus-visible,
        .button-secondary:focus-visible,
        .choice:focus-within,
        .switch:focus-visible,
        select:focus-visible {
          outline: 3px solid rgba(108, 233, 255, .72);
          outline-offset: 4px;
        }

        .button {
          border: 0;
          color: #07100f;
          background: linear-gradient(100deg, #56e6ff, #9d8bff);
        }

        .button-secondary {
          border: 1px solid rgba(136, 180, 219, .22);
          color: #dce9f5;
          background: rgba(7, 17, 29, .72);
        }

        .pricing-strip {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          margin: 22px 0;
        }

        .price-card {
          padding: 21px;
          border: 1px solid rgba(132, 177, 216, .14);
          border-radius: 22px;
          background: rgba(7, 16, 27, .74);
        }

        .price-card strong { display: block; font-size: 1.45rem; }
        .price-card span {
          display: block;
          margin-top: 7px;
          color: #839aaf;
          line-height: 1.55;
        }

        .grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(360px, .82fr);
          gap: 18px;
          align-items: start;
        }

        .panel {
          border: 1px solid rgba(132, 177, 216, .14);
          border-radius: 25px;
          background: rgba(6, 15, 25, .8);
          box-shadow: 0 24px 80px rgba(0,0,0,.22);
        }

        .panel-inner { padding: 24px; }

        .section-label {
          margin: 0 0 8px;
          color: #70dff4;
          font-size: .7rem;
          font-weight: 950;
          letter-spacing: .12em;
          text-transform: uppercase;
        }

        .panel h2 {
          margin: 0;
          font-size: 1.75rem;
          letter-spacing: -.04em;
        }

        .panel-copy {
          margin: 10px 0 0;
          color: #8fa6ba;
          line-height: 1.65;
        }

        .field { margin-top: 20px; }
        .field label {
          display: block;
          margin-bottom: 8px;
          color: #bdd0df;
          font-size: .78rem;
          font-weight: 850;
        }

        select {
          width: 100%;
          min-height: 48px;
          padding: 0 14px;
          border: 1px solid rgba(135, 180, 220, .2);
          border-radius: 14px;
          outline: none;
          color: #edf6ff;
          background: rgba(2, 9, 16, .9);
          font: inherit;
        }

        .route-preview {
          margin-top: 14px;
          padding: 17px;
          border: 1px solid rgba(132, 177, 216, .12);
          border-radius: 17px;
          background: rgba(2, 9, 16, .52);
        }

        .route-preview strong { display: block; }
        .route-preview span {
          display: block;
          margin-top: 5px;
          color: #718ba2;
          font: 700 .72rem ui-monospace, SFMono-Regular, Menlo, monospace;
        }
        .route-preview p { margin: 10px 0 0; color: #90a7bb; line-height: 1.6; }

        .mode-grid, .check-grid {
          display: grid;
          gap: 10px;
          margin-top: 12px;
        }

        .mode-grid { grid-template-columns: 1fr 1fr; }

        .choice {
          position: relative;
          padding: 16px;
          border: 1px solid rgba(132, 177, 216, .14);
          border-radius: 17px;
          background: rgba(2, 9, 16, .52);
          cursor: pointer;
        }

        .choice.active {
          border-color: rgba(90, 225, 255, .48);
          box-shadow: inset 0 0 0 1px rgba(90, 225, 255, .12);
          background: rgba(69, 198, 226, .075);
        }

        .choice input {
          position: absolute;
          opacity: 0;
          pointer-events: none;
        }

        .choice strong { display: block; font-size: .82rem; }
        .choice span {
          display: block;
          margin-top: 6px;
          color: #7f97ad;
          font-size: .73rem;
          line-height: 1.5;
        }

        .check-row {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 15px;
          align-items: center;
          padding: 15px 16px;
          border: 1px solid rgba(132, 177, 216, .12);
          border-radius: 16px;
          background: rgba(2, 9, 16, .5);
        }

        .check-row strong { display: block; font-size: .82rem; }
        .check-row span {
          display: block;
          margin-top: 4px;
          color: #758da3;
          font-size: .72rem;
        }

        .switch {
          width: 45px;
          height: 25px;
          padding: 3px;
          border: 0;
          border-radius: 999px;
          background: #392630;
          cursor: pointer;
        }

        .switch::after {
          content: "";
          display: block;
          width: 19px;
          height: 19px;
          border-radius: 50%;
          background: #ff9ca8;
          transition: transform .2s ease, background .2s ease;
        }

        .switch.on { background: rgba(58, 225, 157, .22); }
        .switch.on::after {
          transform: translateX(20px);
          background: #4cebad;
        }

        .run-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          margin-top: 22px;
          padding-top: 20px;
          border-top: 1px solid rgba(132, 177, 216, .12);
        }

        .decision {
          display: inline-flex;
          min-height: 29px;
          align-items: center;
          padding: 0 10px;
          border: 1px solid rgba(135, 180, 220, .18);
          border-radius: 999px;
          font-size: .7rem;
          font-weight: 950;
          letter-spacing: .08em;
        }

        .decision.ALLOW { color: #53efae; border-color: rgba(83, 239, 174, .28); }
        .decision.HOLD { color: #ffd27b; border-color: rgba(255, 210, 123, .28); }
        .decision.DENY { color: #ff8e9b; border-color: rgba(255, 142, 155, .28); }
        .decision.ESCALATE { color: #b8a5ff; border-color: rgba(184, 165, 255, .28); }

        .sticky { position: sticky; top: 92px; }

        .score {
          margin-top: 20px;
          font-size: 3.8rem;
          font-weight: 950;
          letter-spacing: -.08em;
        }

        .score small {
          font-size: 1rem;
          color: #7590a8;
          letter-spacing: 0;
        }

        .progress {
          height: 9px;
          margin-top: 8px;
          overflow: hidden;
          border-radius: 999px;
          background: rgba(255,255,255,.055);
        }

        .progress div {
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(90deg, #55e7ff, #9c8cff);
        }

        .findings { display: grid; gap: 9px; margin-top: 18px; }

        .finding {
          padding: 14px;
          border: 1px solid rgba(132, 177, 216, .12);
          border-radius: 15px;
          background: rgba(2, 9, 16, .52);
        }

        .finding strong {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          font-size: .75rem;
        }

        .finding p { margin: 8px 0 0; color: #8ca3b8; font-size: .77rem; line-height: 1.55; }

        .clear {
          margin-top: 18px;
          padding: 16px;
          border: 1px solid rgba(83, 239, 174, .16);
          border-radius: 16px;
          color: #a8d9c4;
          background: rgba(20, 73, 52, .14);
          line-height: 1.6;
        }

        .history {
          margin-top: 22px;
          overflow: hidden;
          border: 1px solid rgba(132, 177, 216, .14);
          border-radius: 24px;
          background: rgba(6, 15, 25, .78);
        }

        .history-head {
          display: flex;
          justify-content: space-between;
          gap: 15px;
          padding: 18px 21px;
          border-bottom: 1px solid rgba(132, 177, 216, .12);
        }

        .history-row {
          display: grid;
          grid-template-columns: 1.2fr 1fr .7fr .5fr .7fr;
          gap: 12px;
          align-items: center;
          padding: 16px 21px;
          border-bottom: 1px solid rgba(132, 177, 216, .09);
          font-size: .78rem;
        }

        .history-row:last-child { border-bottom: 0; }
        .mono { color: #6edff4; font: 700 .72rem ui-monospace, SFMono-Regular, Menlo, monospace; }
        .muted { color: #7e95aa; }

        .notice {
          margin-top: 18px;
          padding: 16px 18px;
          border-left: 3px solid #9c8cff;
          border-radius: 0 13px 13px 0;
          color: #91a8bd;
          background: rgba(156, 140, 255, .05);
          font-size: .82rem;
          line-height: 1.65;
        }

        @media (max-width: 980px) {
          .grid { grid-template-columns: 1fr; }
          .sticky { position: static; }
          .history-row { grid-template-columns: 1fr 1fr; }
        }

        @media (max-width: 700px) {
          .testing-wrap { width: min(100% - 24px, 1360px); }
          .testing-page { padding-top: 24px; }
          .hero { padding: 28px 22px 34px; border-radius: 24px; }
          .pricing-strip, .mode-grid { grid-template-columns: 1fr; }
          .run-row { align-items: stretch; flex-direction: column; }
          .history-row { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="testing-wrap">
        <section className="hero">
          <div className="hero-content">
            <p className="eyebrow">TA-14 Exchange · Route Testing Desk</p>
            <h1>
              Test the route.
              <br />
              <span className="gradient">Not the dashboard.</span>
            </h1>
            <p className="hero-copy">
              Run unlimited simulations against the TA-14 admissibility chain.
              When a route is ready for a production-grade signed test, cross
              the explicit paid boundary without pretending a free simulation
              created real-world authority.
            </p>
            <div className="hero-actions">
              <Link className="button" href={WORKSPACE_ROUTES.build}>
                Build a route
              </Link>
              <Link className="button-secondary" href={WORKSPACE_ROUTES.registry}>
                Open registry
              </Link>
              <Link className="button-secondary" href={WORKSPACE_ROUTES.verify}>
                Verify a receipt
              </Link>
            </div>
          </div>
        </section>

        <section className="pricing-strip">
          <article className="price-card">
            <strong>Unlimited simulations · $0</strong>
            <span>
              Explore, fail, correct, rerun, compare, and improve without
              creating a production execution receipt.
            </span>
          </article>
          <article className="price-card">
            <strong>Signed production test · $9</strong>
            <span>
              A clearly bounded paid path for a trusted test receipt. This page
              models the boundary but does not process payment.
            </span>
          </article>
        </section>

        <section className="grid">
          <div className="panel">
            <div className="panel-inner">
              <p className="section-label">Test configuration</p>
              <h2>Choose a route and define the asserted condition.</h2>
              <p className="panel-copy">
                These controls intentionally expose the exact facts the test is
                evaluating. Unsupported facts should remain false or UNKNOWN.
              </p>

              <div className="field">
                <label htmlFor="route">Route</label>
                <select
                  id="route"
                  value={routeKey}
                  onChange={(event) =>
                    setRouteKey(event.target.value as RouteKey)
                  }
                >
                  {Object.entries(routes).map(([key, route]) => (
                    <option key={key} value={key}>
                      {route.name}
                    </option>
                  ))}
                </select>

                <div className="route-preview">
                  <strong>{selectedRoute.name}</strong>
                  <span>{selectedRoute.rid} · {selectedRoute.domain}</span>
                  <p>{selectedRoute.description}</p>
                </div>
              </div>

              <div className="field">
                <label>Test mode</label>
                <div className="mode-grid">
                  {(["SIMULATION", "SIGNED"] as TestMode[]).map((item) => (
                    <label
                      className={`choice ${mode === item ? "active" : ""}`}
                      key={item}
                    >
                      <input
                        type="radio"
                        name="test-mode"
                        value={item}
                        checked={mode === item}
                        onChange={() => setMode(item)}
                      />
                      <strong>
                        {item === "SIMULATION"
                          ? "Free simulation"
                          : "Signed test · $9"}
                      </strong>
                      <span>
                        {item === "SIMULATION"
                          ? "Repeatable learning and route correction."
                          : "Production boundary requiring payment and trusted signing."}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="field">
                <label>Assertions under test</label>
                <div className="check-grid">
                  {[
                    {
                      title: "Authority is current and consequence-specific",
                      detail: "The actor is actually permitted to initiate this action.",
                      value: authorityPresent,
                      set: setAuthorityPresent,
                    },
                    {
                      title: "Required evidence is complete",
                      detail: "No required artifact is absent, substituted, or UNKNOWN.",
                      value: evidenceComplete,
                      set: setEvidenceComplete,
                    },
                    {
                      title: "Continuity is intact",
                      detail: "Origin, transformations, versions, and dependencies remain traceable.",
                      value: continuityIntact,
                      set: setContinuityIntact,
                    },
                    {
                      title: "Binding is exact",
                      detail: "The admitted actor, object, destination, tool, and environment match.",
                      value: bindingExact,
                      set: setBindingExact,
                    },
                    {
                      title: "Outcome can be independently verified",
                      detail: "An authoritative post-execution source is defined.",
                      value: outcomeVerifiable,
                      set: setOutcomeVerifiable,
                    },
                  ].map((item) => (
                    <div className="check-row" key={item.title}>
                      <div>
                        <strong>{item.title}</strong>
                        <span>{item.detail}</span>
                      </div>
                      <button
                        aria-label={`${item.title}: ${
                          item.value ? "asserted true" : "asserted false"
                        }`}
                        aria-pressed={item.value}
                        className={`switch ${item.value ? "on" : ""}`}
                        type="button"
                        onClick={() => item.set(!item.value)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="run-row">
                <div>
                  <span className={`decision ${preview.decision}`}>
                    PREVIEW · {preview.decision}
                  </span>
                </div>
                <button className="button" type="button" onClick={runTest}>
                  {mode === "SIGNED"
                    ? "Prepare $9 signed test"
                    : "Run free simulation"}
                </button>
              </div>
            </div>
          </div>

          <aside className="panel sticky">
            <div className="panel-inner">
              <p className="section-label">Latest determination</p>
              <h2>{current ? current.routeName : "No test run yet"}</h2>
              <p className="panel-copy">
                {current
                  ? `${current.testId} · ${formatDate(current.createdAt)}`
                  : "Configure the asserted route condition, then run a test."}
              </p>

              <div className="score">
                {current ? current.score : preview.score}
                <small>/100</small>
              </div>
              <div
                aria-label="Route readiness score"
                aria-valuemax={100}
                aria-valuemin={0}
                aria-valuenow={current ? current.score : preview.score}
                className="progress"
                role="progressbar"
              >
                <div
                  style={{
                    width: `${current ? current.score : preview.score}%`,
                  }}
                />
              </div>

              <div style={{ marginTop: 18 }}>
                <span
                  className={`decision ${
                    current ? current.decision : preview.decision
                  }`}
                >
                  {current ? current.decision : preview.decision}
                </span>
              </div>

              {(current ? current.findings : preview.findings).length ? (
                <div className="findings">
                  {(current ? current.findings : preview.findings).map(
                    (finding) => (
                      <article className="finding" key={finding.code}>
                        <strong>
                          <span>{finding.code}</span>
                          <span>{finding.stage}</span>
                        </strong>
                        <p>{finding.message}</p>
                      </article>
                    ),
                  )}
                </div>
              ) : (
                <div className="clear">
                  No simulated defect is currently present. An ALLOW result
                  still depends on the truth and independent verifiability of
                  the supplied evidence.
                </div>
              )}

              {current ? (
                <div className="result-actions">
                  <button
                    className="button-secondary"
                    type="button"
                    onClick={copyReceipt}
                  >
                    {copied ? "Copied" : "Copy receipt"}
                  </button>
                  <button
                    className="button-secondary"
                    type="button"
                    onClick={() =>
                      downloadJson(
                        `${current.testId.toLowerCase()}-receipt.json`,
                        current.receipt,
                      )
                    }
                  >
                    Download JSON
                  </button>
                </div>
              ) : null}

              <div className="notice">
                A signed-test selection does not automatically create a signed
                receipt. It marks the paid production boundary. Real signing
                requires payment confirmation, canonicalization, trusted keys,
                and server-side issuance.
              </div>
            </div>
          </aside>
        </section>

        <section className="history">
          <div className="history-head">
            <strong>Recent route tests</strong>
            <span className="muted">{history.length} receipts</span>
          </div>

          {history.map((item) => (
            <div className="history-row" key={item.testId}>
              <div>
                <strong>{item.routeName}</strong>
                <div className="mono">{item.testId}</div>
              </div>
              <div className="muted">{item.routeId}</div>
              <div>{item.mode}</div>
              <div>
                <span className={`decision ${item.decision}`}>
                  {item.decision}
                </span>
              </div>
              <div className="muted">
                {item.score}/100 · {formatDate(item.createdAt)}
              </div>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
