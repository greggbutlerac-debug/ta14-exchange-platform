/* TA-14 ANIMATED HOMEPAGE V10 - EU AI ACT FRONT DOOR + POLISH PASS - 2026-07-21 */
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import EuAiActHomepageSection from "../components/eu-ai-act-homepage-section";

type RouteState = "IDLE" | "RUNNING" | "HOLD" | "ALLOW";
type ResultState = "ALLOW" | "HOLD" | "DENY" | "ESCALATE";

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

const journey = [
  [
    "01",
    "Learn",
    "Understand the TA-14 chain and the difference between a claim and a governed route.",
  ],
  [
    "02",
    "Choose",
    "Enter the workspace that matches the evidence or consequence you need to govern.",
  ],
  [
    "03",
    "Build or upload",
    "Construct a route, bring a record, or submit a system for bounded review.",
  ],
  [
    "04",
    "Run",
    "Expose missing evidence, stale authority, continuity breaks, and binding failures.",
  ],
  [
    "05",
    "Correct",
    "Repair HOLD conditions without erasing the original result or uncertainty.",
  ],
  [
    "06",
    "Preserve",
    "Create a governed record that keeps identity, boundaries, decisions, and outcome visible.",
  ],
  [
    "07",
    "Verify",
    "Replay the route and test whether the preserved package still corresponds to execution.",
  ],
  [
    "08",
    "Publish",
    "Optionally share a bounded result for others to inspect, challenge, and learn from.",
  ],
] as const;

const playgrounds = [
  {
    badge: "AI",
    title: "AI Governance",
    text: "Build, test, correct, and verify consequential AI routes across identity, delegated authority, evidence, tools, payloads, commitments, execution, and outcome.",
    href: "/workspace/ai-governance",
    action: "Enter AI Governance",
    bullets: [
      "AI agents",
      "Tools and APIs",
      "Payloads",
      "Commitments",
      "Outcomes",
    ],
  },
  {
    badge: "GR",
    title: "Governed Records",
    text: "Bring an existing record and receive a bounded interpretation that preserves what the evidence proves, what it does not prove, and which conclusions remain inadmissible.",
    href: "/workspace/governed-records",
    action: "Enter Governed Records",
    bullets: [
      "Upload records",
      "Bounded interpretation",
      "Preserve uncertainty",
      "Compare",
      "Export record",
    ],
  },
  {
    badge: "ER",
    title: "Environmental Records",
    text: "Interpret land, water, air, atmospheric, building, hospital, laboratory, HVAC, sensor, and environmental evidence without reducing reality to an unsupported score.",
    href: "/workspace/environmental-records",
    action: "Enter Environmental Records",
    bullets: [
      "Atmospheric integrity",
      "Environmental data",
      "Building systems",
      "IAQ and sensors",
      "Land, water, air",
    ],
  },
  {
    badge: "◎",
    title: "Entity Review Center",
    text: "Submit an organization, governance program, AI system, operational architecture, or consequential route for bounded full-chain review.",
    href: "/workspace/entity-review",
    action: "Enter Entity Review Center",
    bullets: [
      "Organizations",
      "AI systems",
      "Architectures",
      "Route reviews",
      "Certification status",
    ],
  },
] as const;

const resultCards: Array<{
  domain: string;
  title: string;
  state: ResultState;
  summary: string;
  standing: string;
}> = [
  {
    domain: "Finance",
    title: "Vendor payment above authority threshold",
    state: "HOLD",
    summary:
      "Current procurement and finance authority were missing before commitment.",
    standing: "Illustrative result",
  },
  {
    domain: "Healthcare AI",
    title: "Model-supported treatment prioritization",
    state: "ESCALATE",
    summary:
      "Accountable human authority was required before consequence-bearing action.",
    standing: "Illustrative result",
  },
  {
    domain: "Autonomous Agent",
    title: "External tool execution request",
    state: "DENY",
    summary:
      "The destination binding did not match the approved execution route.",
    standing: "Illustrative result",
  },
  {
    domain: "Built Environment",
    title: "Time-bounded building override",
    state: "ALLOW",
    summary:
      "Authority, duration, release condition, command binding, and outcome were established.",
    standing: "Illustrative result",
  },
];

const routeGallery = [
  [
    "AI",
    "Autonomous Agent Tool Call",
    "Identity → authority → tool → payload → destination → outcome",
  ],
  [
    "BAS",
    "Critical Room Override",
    "Environmental evidence → operator authority → override → release → restoration",
  ],
  [
    "Environmental",
    "Atmospheric Integrity Record",
    "Observation → qualification → interpretation → intervention → verified outcome",
  ],
  [
    "Healthcare",
    "Human Authority Escalation",
    "Model recommendation → evidence freshness → accountable review → action",
  ],
  [
    "Finance",
    "Vendor Payment",
    "Invoice → dual authority → beneficiary binding → commit → payment outcome",
  ],
  [
    "Refrigeration",
    "Non-Invasive Entry Threshold",
    "Baseline → evidence → threshold → intervention → performance record",
  ],
] as const;

const useCases = [
  [
    "AI Agents and Autonomous Systems",
    "Bind identity, delegated authority, tools, payloads, destinations, commands, and outcomes before autonomous action.",
  ],
  [
    "Finance and Enterprise",
    "Govern vendor payments, procurement, approvals, identity, beneficiary binding, and execution correspondence.",
  ],
  [
    "Healthcare and Critical Operations",
    "Preserve accountable human authority, evidence freshness, model version, escalation, intervention, and outcome.",
  ],
  [
    "Built Environment",
    "Govern BAS overrides, AI optimization, critical-space validity, commissioning, alarm resolution, energy, and emergency operation.",
  ],
  [
    "Environmental Systems",
    "Govern atmospheric integrity, refrigerant intervention, moisture, pressure, air, remediation, and verified restoration.",
  ],
  [
    "Manufacturing and Infrastructure",
    "Govern process release, restart, robotics, utilities, quality, critical execution, and recovery.",
  ],
  [
    "Government and Public Authority",
    "Create reconstructable records for public authority, administrative action, evidence, boundaries, and consequence.",
  ],
  [
    "Governance Research and Education",
    "Build route libraries, break dependencies, repair HOLD conditions, study decisions, and teach governance through use.",
  ],
] as const;

function makeRid() {
  return `TA-14-RID-${Date.now().toString(36).toUpperCase()}`;
}

function makeHash(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0").toUpperCase();
}

export default function HomePage() {
  const [routeState, setRouteState] = useState<RouteState>("IDLE");
  const [activeStage, setActiveStage] = useState(-1);
  const [authorityCorrected, setAuthorityCorrected] = useState(false);
  const [recordOpen, setRecordOpen] = useState(false);
  const [rid, setRid] = useState("");
  const [manifestHash, setManifestHash] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const stateLabel = useMemo(
    () => (routeState === "IDLE" ? "READY" : routeState),
    [routeState],
  );

  useEffect(() => {
    if (routeState !== "RUNNING") return;

    if (activeStage >= chain.length - 1) {
      const timer = window.setTimeout(() => {
        if (authorityCorrected) {
          const nextRid = makeRid();
          setRouteState("ALLOW");
          setRecordOpen(true);
          setRid(nextRid);
          setManifestHash(
            makeHash(
              `${nextRid}|vendor-payment|dual-authority|beneficiary-binding|allow`,
            ),
          );
        } else {
          setRouteState("HOLD");
        }
      }, 650);
      return () => window.clearTimeout(timer);
    }

    const timer = window.setTimeout(() => {
      setActiveStage((current) => current + 1);
    }, 420);

    return () => window.clearTimeout(timer);
  }, [routeState, activeStage, authorityCorrected]);

  function runRoute() {
    setRecordOpen(false);
    setRid("");
    setManifestHash("");
    setActiveStage(0);
    setRouteState("RUNNING");
  }

  function correctAndRerun() {
    setAuthorityCorrected(true);
    setRecordOpen(false);
    setRid("");
    setManifestHash("");
    setActiveStage(0);
    setRouteState("RUNNING");
  }

  function resetRoute() {
    setRouteState("IDLE");
    setActiveStage(-1);
    setAuthorityCorrected(false);
    setRecordOpen(false);
    setRid("");
    setManifestHash("");
  }

  return (
    <main className="page-shell">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <div className="cosmic-background" aria-hidden="true">
        <div className="star-field star-field-one" />
        <div className="star-field star-field-two" />
        <div className="orbit orbit-one">
          <span />
        </div>
        <div className="orbit orbit-two">
          <span />
        </div>
        <div className="orbit orbit-three">
          <span />
        </div>
        <div className="moving-line line-one" />
        <div className="moving-line line-two" />
        <div className="moving-line line-three" />
        <div className="nova nova-one" />
        <div className="nova nova-two" />
      </div>
      <header className="site-header">
        <Link
          className="brand"
          href="/"
          aria-label="TA-14 AI Governance Exchange home"
        >
          <span className="brand-mark">TA-14</span>
          <span>TA-14 AI GOVERNANCE EXCHANGE</span>
        </Link>

        <button
          className="menu-button"
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen((open) => !open)}
        >
          ☰
        </button>

        <nav className={mobileMenuOpen ? "main-nav open" : "main-nav"}>
          <a href="#start" onClick={() => setMobileMenuOpen(false)}>
            Start Here
          </a>
          <a href="#map" onClick={() => setMobileMenuOpen(false)}>
            Exchange Map
          </a>
          <a href="#map" onClick={() => setMobileMenuOpen(false)}>
            Workspaces
          </a>
          <a href="#eu-ai-act" onClick={() => setMobileMenuOpen(false)}>
            EU AI Act
          </a>
          <a href="#results" onClick={() => setMobileMenuOpen(false)}>
            Results
          </a>
          <a href="#gallery" onClick={() => setMobileMenuOpen(false)}>
            Route Gallery
          </a>
          <a
            href="#partner-review-network"
            onClick={() => setMobileMenuOpen(false)}
          >
            Partner Network
          </a>
          <Link href="/account" onClick={() => setMobileMenuOpen(false)}>
            Sign In
          </Link>
          <Link
            className="nav-cta"
            href="/workspace"
            onClick={() => setMobileMenuOpen(false)}
          >
            Open Workspace
          </Link>
        </nav>
      </header>

      <section className="hero section-wrap" id="main-content">
        <div className="hero-copy">
          <p className="eyebrow">Free AI Governance Playground and Workspace</p>
          <h1>
            Build governance.
            <span>Test it free.</span>
            Prove the consequence.
          </h1>
          <p className="hero-text">
            Enter the TA-14 AI Governance Exchange free—no credit card required.
            Learn where to begin, choose the right workspace, test consequential
            routes, preserve adverse results, and see why execution was allowed,
            held, denied, or escalated.
          </p>
          <div className="button-row">
            <Link className="button primary" href="/workspace">
              Open the Free Workspace
            </Link>
            <a className="button secondary" href="#start">
              Start Here
            </a>
            <Link className="button eu-act-hero-button" href="/eu-ai-act">
              EU AI Act Requirements
            </Link>
            <Link className="button ghost" href="/account">
              Sign In
            </Link>
          </div>
          <div className="trust-row">
            <span>Evidence Bound</span>
            <span>Route Verifiable</span>
            <span>Adverse Results Preserved</span>
          </div>
        </div>

        <div className="hero-console">
          <div className="console-core">
            <span>TA-14</span>
            <strong>CORE</strong>
            <small>Full-chain admissible execution</small>
          </div>
          <div className="console-status">
            <p className="eyebrow">The Exchange is active</p>
            <h2>Governance moving through the chain.</h2>
            <dl>
              <div>
                <dt>Build access</dt>
                <dd>Free and unlimited</dd>
              </div>
              <div>
                <dt>Decision lanes</dt>
                <dd>ALLOW · HOLD · DENY · ESCALATE</dd>
              </div>
              <div>
                <dt>Governance depth</dt>
                <dd>Eight linked stages</dd>
              </div>
              <div>
                <dt>Verification</dt>
                <dd>Independent replay surface</dd>
              </div>
            </dl>
          </div>
          <div className="motion-list">
            {resultCards.map((result) => (
              <div key={result.title}>
                <span>{result.domain}</span>
                <strong className={`state state-${result.state.toLowerCase()}`}>
                  {result.state}
                </strong>
                <small>{result.summary}</small>
              </div>
            ))}
          </div>
          <p className="console-note">
            Visual exchange preview. Results shown here are illustrative;
            production activity remains governed by its actual route evidence
            and execution state.
          </p>
        </div>
      </section>

      <div id="eu-ai-act" className="eu-ai-act-homepage-anchor">
        <EuAiActHomepageSection />
      </div>

      <section className="section-wrap start-here" id="start">
        <div className="section-heading split-heading">
          <div>
            <p className="eyebrow">New to TA-14?</p>
            <h2>Start here. Never wonder where to go next.</h2>
          </div>
          <p>
            Every visitor follows the same understandable journey—from learning
            the chain to optionally publishing a bounded result for the
            governance community.
          </p>
        </div>
        <div className="journey-grid">
          {journey.map(([number, title, text]) => (
            <article className="journey-card" key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
        <div className="journey-line" aria-label="TA-14 visitor journey">
          {journey.map(([, title], index) => (
            <div key={title}>
              <strong>{title}</strong>
              {index < journey.length - 1 ? <span>→</span> : null}
            </div>
          ))}
        </div>
      </section>

      <section className="section-wrap exchange-map" id="map">
        <div className="section-heading centered">
          <p className="eyebrow">Exchange Map</p>
          <h2>See the whole system before choosing a door.</h2>
          <p>
            Home explains the institution. Start Here introduces the route. The
            Workspace Directory sends each visitor into the correct operating
            surface.
          </p>
        </div>

        <div className="map-board">
          <a
            className="map-node map-node-link top-node"
            href="#main-content"
            aria-label="Return to the TA-14 AI Governance Exchange front gate"
          >
            <small>Front gate</small>
            <strong>TA-14 AI Governance Exchange</strong>
            <span>
              Understand the institution and the complete governing chain.
            </span>
            <b className="map-node-action">
              Return to the front gate <i>↑</i>
            </b>
          </a>
          <div className="map-connector" aria-hidden="true">
            ↓
          </div>
          <a
            className="map-node map-node-link middle-node"
            href="#start"
            aria-label="Open Start Here and the Workspace Directory"
          >
            <small>Visitor center</small>
            <strong>Start Here + Workspace Directory</strong>
            <span>
              Learn the journey, choose the evidence class, and enter the right
              workspace.
            </span>
            <b className="map-node-action">
              Open Start Here <i>→</i>
            </b>
          </a>
          <div className="map-connector">↓</div>
          <div className="map-workspaces">
            {playgrounds.map((item, index) => (
              <a
                className="gateway-link"
                href={item.href}
                key={item.title}
                aria-label={`${item.action}. ${item.text}`}
              >
                <article className={`gateway gateway-${index + 1}`}>
                  <div className="gateway-head">
                    <span className="gateway-badge">{item.badge}</span>
                    <div>
                      <strong>{item.title}</strong>
                      <small>{item.text}</small>
                    </div>
                  </div>
                  <div className="gateway-body">
                    <ul>
                      {item.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                    <div className="door-frame" aria-hidden="true">
                      <div className="door-rays" />
                      <div className="door-glow" />
                      <div className="door-interior">
                        <span className="portal-particle particle-one" />
                        <span className="portal-particle particle-two" />
                        <span className="portal-particle particle-three" />
                        <span className="portal-horizon" />
                      </div>
                      <div className="door-arch" />
                      <div className="door-panel">
                        <span>{item.badge}</span>
                        <i className="door-knob" />
                      </div>
                      <div className="door-threshold" />
                      <div className="door-step" />
                    </div>
                  </div>
                  <span className="gateway-action">
                    <span className="gateway-action-default">
                      {item.action}
                    </span>
                    <span className="gateway-action-hover">
                      Enter workspace
                    </span>
                    <b>→</b>
                  </span>
                </article>
              </a>
            ))}
          </div>
          <div className="map-connector">↓</div>
          <div className="map-shared">
            {chain.map((stage) => (
              <span key={stage}>{stage}</span>
            ))}
          </div>
          <p className="map-caption">
            Different doors. One constitutional chain. Every workspace should
            show where the visitor is, what can be done there, what happens
            next, and how to return later.
          </p>
        </div>
      </section>

      <section className="section-wrap chain-section" id="architecture">
        <div className="section-heading centered">
          <p className="eyebrow">The governing chain</p>
          <h2>Governance must remain visible from Reality to Outcome.</h2>
          <p>
            Policies, approvals, and models can be valuable while an execution
            route still breaks. TA-14 evaluates whether evidence, continuity,
            authority, binding, commitment, execution, and measured outcome
            remain admissible together.
          </p>
        </div>
        <div className="ta14-chain-track" aria-label="TA-14 governing chain">
          {chain.map((stage, index) => (
            <div className="ta14-chain-stage" key={stage}>
              <span className="ta14-chain-number">
                {String(index + 1).padStart(2, "0")}
              </span>
              <strong>{stage}</strong>
              {index < chain.length - 1 ? (
                <i className="ta14-chain-arrow" aria-hidden="true">
                  →
                </i>
              ) : null}
            </div>
          ))}
        </div>
        <div className="ta14-principles-grid">
          <article>
            <span>◇</span>
            <h3>Build</h3>
            <p>
              Model boundaries, actors, authority, evidence, dependencies,
              rules, commit conditions, execution, and expected outcomes.
            </p>
          </article>
          <article>
            <span>⚡</span>
            <h3>Challenge</h3>
            <p>
              Inject missing evidence, stale authority, continuity breaks,
              beneficiary mismatches, bypass attempts, and outcome failures.
            </p>
          </article>
          <article>
            <span>✓</span>
            <h3>Verify</h3>
            <p>
              Preserve route identity, decision history, correction, receipts,
              execution correspondence, and replayable proof.
            </p>
          </article>
        </div>
      </section>

      <section className="section-wrap live-demo" id="demo">
        <div className="section-heading split-heading">
          <div>
            <p className="eyebrow">Live route demonstration</p>
            <h2>Watch a route fail, correct, and become admissible.</h2>
          </div>
          <p>
            Submit a consequential vendor payment, expose missing authority and
            beneficiary binding, preserve the HOLD, then correct and rerun the
            route.
          </p>
        </div>

        <div className="demo-grid">
          <article className="route-card">
            <div className="route-card-head">
              <div>
                <p className="eyebrow">Vendor Payment Route</p>
                <h3>Procurement Agent v4.2</h3>
              </div>
              <strong>USD 32,500</strong>
            </div>
            <dl className="route-data">
              <div>
                <dt>Organization</dt>
                <dd>Northstar Procurement Group</dd>
              </div>
              <div>
                <dt>Supplier</dt>
                <dd>Apex Industrial Supply</dd>
              </div>
              <div>
                <dt>Invoice</dt>
                <dd>INV-2026-0716</dd>
              </div>
              <div>
                <dt>Procurement authority</dt>
                <dd>{authorityCorrected ? "Current" : "Missing"}</dd>
              </div>
              <div>
                <dt>Finance authority</dt>
                <dd>{authorityCorrected ? "Current" : "Missing"}</dd>
              </div>
              <div>
                <dt>Beneficiary binding</dt>
                <dd>{authorityCorrected ? "Bound" : "Unproven"}</dd>
              </div>
            </dl>
          </article>

          <article className={`receipt receipt-${routeState.toLowerCase()}`}>
            <div className="receipt-head">
              <div>
                <p className="eyebrow">TA-14 decision receipt</p>
                <small>
                  {authorityCorrected ? "CORRECTED VERSION" : "VERSION 1"}
                </small>
              </div>
              <strong>{stateLabel}</strong>
            </div>
            <p className="receipt-copy">
              {routeState === "IDLE" &&
                "The route is ready for deterministic evaluation."}
              {routeState === "RUNNING" &&
                `Evaluating ${chain[Math.max(activeStage, 0)] ?? "route"}...`}
              {routeState === "HOLD" &&
                "Required proof is incomplete but correctable. Current dual authority and beneficiary binding are missing."}
              {routeState === "ALLOW" &&
                "All mandatory deterministic requirements are satisfied within the stated route scope."}
            </p>
            <div className="receipt-chain">
              {chain.map((stage, index) => {
                const complete =
                  routeState === "ALLOW" ||
                  (routeState === "RUNNING" && index < activeStage);
                const active =
                  routeState === "RUNNING" && index === activeStage;
                const failed =
                  routeState === "HOLD" && index >= 3 && index <= 4;
                return (
                  <span
                    className={
                      complete
                        ? "complete"
                        : active
                          ? "active"
                          : failed
                            ? "failed"
                            : ""
                    }
                    key={stage}
                  >
                    {stage}
                  </span>
                );
              })}
            </div>
            <pre>
              {routeState === "IDLE" &&
                "ROUTE: Vendor payment above USD 25,000\nSTATUS: TESTABLE\nNEXT ACTION: RUN TA-14 ENGINE"}
              {routeState === "RUNNING" &&
                `ROUTE: Vendor payment above USD 25,000\nTESTING: ${chain[Math.max(activeStage, 0)] ?? "Reality"}\nSTATE: EVALUATING`}
              {routeState === "HOLD" &&
                "RESULT: HOLD\nTA-14-AUTH-PROC: CURRENT PROCUREMENT AUTHORITY MISSING\nTA-14-AUTH-FIN: CURRENT FINANCE AUTHORITY MISSING\nTA-14-BIND-BEN: BENEFICIARY NOT BOUND\nNEXT ACTION: CORRECT FREE AND RERUN"}
              {routeState === "ALLOW" &&
                "RESULT: ALLOW\nTA-14-REQ-ALL: SATISFIED\nAUTHORITY: CURRENT DUAL APPROVAL\nBENEFICIARY: BOUND\nCOMMIT CORRESPONDENCE: SATISFIED"}
            </pre>
            <div className="button-row">
              {routeState === "IDLE" && (
                <button
                  className="button primary"
                  type="button"
                  onClick={runRoute}
                >
                  Run Route
                </button>
              )}
              {routeState === "RUNNING" && (
                <button className="button primary" type="button" disabled>
                  Testing Route…
                </button>
              )}
              {routeState === "HOLD" && (
                <>
                  <button
                    className="button primary"
                    type="button"
                    onClick={correctAndRerun}
                  >
                    Correct Route and Rerun
                  </button>
                  <button
                    className="button secondary"
                    type="button"
                    onClick={resetRoute}
                  >
                    Reset
                  </button>
                </>
              )}
              {routeState === "ALLOW" && (
                <>
                  <button
                    className="button primary"
                    type="button"
                    onClick={() => setRecordOpen(true)}
                  >
                    Open AER Preview
                  </button>
                  <button
                    className="button secondary"
                    type="button"
                    onClick={resetRoute}
                  >
                    Run Again
                  </button>
                </>
              )}
            </div>
          </article>
        </div>

        {recordOpen && rid ? (
          <article className="record-preview">
            <div>
              <p className="eyebrow">Self-declared AER preview generated</p>
              <h3>TA-14 Admissible Execution Record</h3>
            </div>
            <span>SIGNED PREVIEW</span>
            <dl>
              <div>
                <dt>Route identity</dt>
                <dd>{rid}</dd>
              </div>
              <div>
                <dt>Current state</dt>
                <dd>ALLOW</dd>
              </div>
              <div>
                <dt>Manifest hash</dt>
                <dd>{manifestHash}</dd>
              </div>
              <div>
                <dt>Authority basis</dt>
                <dd>Current dual authority</dd>
              </div>
              <div>
                <dt>Boundary</dt>
                <dd>Self-declared demonstration</dd>
              </div>
              <div>
                <dt>Next action</dt>
                <dd>Preserve durable route record</dd>
              </div>
            </dl>
          </article>
        ) : null}
      </section>

      <section className="section-wrap results-section" id="results">
        <div className="section-heading split-heading">
          <div>
            <p className="eyebrow">Governance Results Exchange</p>
            <h2>See what people tested—not merely what they claimed.</h2>
          </div>
          <p>
            Published results should become a bounded public evidence library
            where people can inspect outcomes, learn from adverse decisions,
            compare corrections, and distinguish self-declared work from
            independently verified work.
          </p>
        </div>

        <div className="results-grid">
          {resultCards.map((result) => (
            <article className="result-card" key={result.title}>
              <div className="result-meta">
                <span>{result.domain}</span>
                <strong className={`state state-${result.state.toLowerCase()}`}>
                  {result.state}
                </strong>
              </div>
              <h3>{result.title}</h3>
              <p>{result.summary}</p>
              <div className="standing">
                <span>{result.standing}</span>
                <span>Replay unavailable</span>
              </div>
            </article>
          ))}
        </div>

        <div className="results-path">
          <div>
            <strong>Published Results</strong>
            <span>Bounded public outcomes</span>
          </div>
          <div>
            <strong>Open Challenges</strong>
            <span>Invite qualified scrutiny</span>
          </div>
          <div>
            <strong>Corrections & Retests</strong>
            <span>Preserve the route from failure to repair</span>
          </div>
          <div>
            <strong>Verified Results</strong>
            <span>Separate independent verification from declaration</span>
          </div>
        </div>

        <div className="coming-panel">
          <div>
            <p className="eyebrow">Planned public destination</p>
            <h3>/workspace/ai-governance/results</h3>
          </div>
          <p>
            This homepage previews the Results Exchange without pretending the
            public publishing backend is already live. Build the dedicated
            workspace only after publication boundaries, sanitization, standing
            labels, moderation, and replay links are implemented.
          </p>
        </div>
      </section>

      <section className="section-wrap" id="gallery">
        <div className="section-heading split-heading">
          <div>
            <p className="eyebrow">Route Gallery</p>
            <h2>Learn governance by opening a route.</h2>
          </div>
          <p>
            Reusable examples shorten the distance between curiosity and
            participation. Each route should eventually support inspection,
            copying, testing, replay, and verification according to its
            standing.
          </p>
        </div>
        <div className="gallery-grid">
          {routeGallery.map(([domain, title, route]) => (
            <article className="gallery-card" key={title}>
              <span>{domain}</span>
              <h3>{title}</h3>
              <p>{route}</p>
              <small>Illustrative route template</small>
            </article>
          ))}
        </div>
      </section>

      <section className="section-wrap operating-surface">
        <div className="section-heading centered">
          <p className="eyebrow">One exchange, complete operating surface</p>
          <h2>From governance idea to governed execution record.</h2>
          <p>
            The Exchange turns governance from a document into a testable,
            correctable, preservable, independently reviewable execution system.
          </p>
        </div>
        <div className="surface-grid">
          {[
            [
              "⌘",
              "Route Construction",
              "Build bounded consequential routes and map the complete Reality-to-Outcome chain.",
            ],
            [
              "↯",
              "Runtime Testing",
              "Run routes, expose exact HOLD and DENY reasons, correct defects, and rerun without hiding adverse results.",
            ],
            [
              "◎",
              "Governed Records",
              "Preserve route identity, provenance, continuity, authority, decisions, execution, boundaries, and outcome.",
            ],
            [
              "◇",
              "Independent Review",
              "Submit routes, systems, architectures, and enterprise processes for bounded full-chain review.",
            ],
            [
              "#",
              "Verification and Replay",
              "Verify signatures, hashes, dependencies, continuity, commit integrity, and execution-to-outcome correspondence.",
            ],
            [
              "API",
              "Integration Layer",
              "Connect evidence sources, registries, reviewers, policies, agents, and execution environments.",
            ],
          ].map(([icon, title, text]) => (
            <article key={title}>
              <span>{icon}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-wrap governed-records">
        <div className="section-heading centered">
          <p className="eyebrow">Governed records</p>
          <h2>A record should prove more than what someone typed.</h2>
          <p>
            A conventional record may capture an event. A governed record
            preserves the route that made the event admissible—or the exact
            reasons it was held, denied, or escalated.
          </p>
        </div>
        <div className="governed-records-entry">
          <a className="button primary" href="/workspace/governed-records">
            Enter Governed Records
          </a>
          <a className="button secondary" href="/workspace/governed-records/build">
            Build the Record
          </a>
        </div>
        <div className="comparison-grid">
          <article className="ordinary">
            <p className="eyebrow">Ordinary record</p>
            <h3>What happened was recorded.</h3>
            <ul>
              <li>Timestamp and event data</li>
              <li>Submitted documents</li>
              <li>Declared approval state</li>
              <li>Limited reconstruction</li>
            </ul>
          </article>
          <article className="governed">
            <p className="eyebrow">TA-14 governed record</p>
            <h3>Why the consequence was—or was not—admissible.</h3>
            <ul>
              <li>Stable route identity and manifest</li>
              <li>Evidence provenance and continuity</li>
              <li>Authority and exact-object binding</li>
              <li>
                Decision, correction, commit, execution, and outcome history
              </li>
              <li>Independent verification and replay surface</li>
              <li>Preserved HOLD, DENY, ALLOW, or ESCALATE result</li>
            </ul>
          </article>
        </div>
      </section>

      <section className="section-wrap domains-section" id="domains">
        <div className="section-heading centered">
          <p className="eyebrow">Applied governance domains</p>
          <h2>AI governance is the entrance—not the limit.</h2>
          <p>
            The TA-14 AI Governance Exchange supports every domain where
            authority, evidence, execution, and outcome must remain
            reconstructable.
          </p>
        </div>
        <div className="domain-grid">
          {useCases.map(([title, text]) => (
            <article key={title}>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section
        className="section-wrap partner-network"
        id="partner-review-network"
      >
        <div className="partner-network-shell">
          <div className="partner-network-copy">
            <p className="eyebrow">TA-14 Partner Review Network</p>
            <h2>
              Do you believe your governance can stand up to bounded review?
            </h2>
            <p className="partner-lead">
              The Partner Review Network is for governance organizations,
              evidence specialists, cybersecurity teams, controls professionals,
              runtime systems, and domain experts that can perform
              consequence-bearing review within clearly declared boundaries.
            </p>
            <p>
              Applicants are evaluated for demonstrated governance discipline,
              evidence practices, declared scope, review boundaries, and their
              ability to preserve uncertainty rather than conceal it. Acceptance
              is never automatic and cannot be purchased.
            </p>
            <div className="partner-actions">
              <Link
                className="button primary"
                href="/workspace/entity-review/partner-review-network/pricing"
              >
                Explore Qualification & Pricing
              </Link>
              <Link
                className="button secondary partner-apply-button"
                href="/workspace/entity-review/partner-review-network/pricing"
              >
                Begin Partner Qualification
              </Link>
            </div>
            <p className="partner-route-note">
              Continue to the Partner Review Network pricing and qualification
              page to review the fee, readiness requirements, and submission
              process.
            </p>
            <p className="partner-boundary">
              Application requirements, review terms, and any applicable fees
              are presented only inside the relevant review area—not on the
              public homepage. Payment never guarantees acceptance,
              certification, favorable findings, or review work.
            </p>
          </div>

          <aside
            className="partner-network-panel"
            aria-label="Partner Review Network process"
          >
            <p className="eyebrow">Bounded participation</p>
            <ol>
              <li>
                <span>01</span>
                <div>
                  <strong>Declare your domain</strong>
                  <p>Identify exactly what you are qualified to review.</p>
                </div>
              </li>
              <li>
                <span>02</span>
                <div>
                  <strong>Submit supporting material</strong>
                  <p>
                    Provide evidence of methods, boundaries, and prior work.
                  </p>
                </div>
              </li>
              <li>
                <span>03</span>
                <div>
                  <strong>Receive bounded evaluation</strong>
                  <p>
                    TA-14 reviews the material without guaranteeing acceptance.
                  </p>
                </div>
              </li>
              <li>
                <span>04</span>
                <div>
                  <strong>Enter an approved lane</strong>
                  <p>
                    Accepted participants work only within declared authority.
                  </p>
                </div>
              </li>
            </ol>
          </aside>
        </div>
      </section>

      <section className="section-wrap built-environment">
        <div className="section-heading split-heading">
          <div>
            <p className="eyebrow">Built environment spotlight</p>
            <h2>
              Govern what the building does—and preserve what the atmosphere
              actually was.
            </h2>
          </div>
          <p>
            BAS, analytics, digital twins, commissioning, TAB, cybersecurity,
            sensors, equipment platforms, and operators each hold part of the
            operational truth.
          </p>
        </div>
        <div className="built-grid">
          <article>
            <p className="eyebrow">Governed building execution</p>
            <h3>From command to verified restoration.</h3>
            <div className="mini-route">
              <span>Room warming observed</span>
              <i>→</i>
              <span>Evidence and operator identity captured</span>
              <i>→</i>
              <strong>HOLD</strong>
              <i>→</i>
              <span>Route corrected and command bound</span>
              <i>→</i>
              <strong>ALLOW</strong>
              <i>→</i>
              <span>Control restored and outcome verified</span>
            </div>
          </article>
          <article>
            <p className="eyebrow">Atmospheric Integrity Record</p>
            <h3>
              Thirteen atmospheric evidence channels. One governed record.
            </h3>
            <div className="sensor-cloud">
              {[
                "Dry-bulb",
                "Wet-bulb",
                "Relative humidity",
                "Dew point",
                "Enthalpy",
                "Humidity ratio",
                "Specific volume",
                "Pressure",
                "VOCs",
                "Radon",
                "Sound dB",
                "Particulate matter",
                "CO₂",
              ].map((sensor) => (
                <span key={sensor}>{sensor}</span>
              ))}
            </div>
          </article>
        </div>
        <p className="boundary-note">
          Connected but distinct: BAS explains what the building system sensed,
          commanded, and executed. The Atmospheric Integrity Record preserves
          whether atmospheric reality was valid for the intended activity and
          whether the intervention produced a verified environmental outcome.
        </p>
      </section>

      <section className="final-cta section-wrap">
        <p className="eyebrow">TA-14 Authority Governance Institution</p>
        <h2>No admissible evidence. No admissible execution.</h2>
        <p>
          The Exchange is where governance systems become testable, governed
          records become verifiable, qualified reviewers work within declared
          boundaries, and organizations obtain full-chain scrutiny.
        </p>
        <div className="button-row centered-buttons">
          <Link className="button primary" href="/workspace">
            Open the Free Workspace
          </Link>
          <a
            className="button secondary"
            href="mailto:ta14admissibleexecution@gmail.com"
          >
            Contact TA-14
          </a>
        </div>
      </section>

      <footer className="site-footer">
        <div>
          <Link className="brand" href="/">
            <span className="brand-mark">TA-14</span>
            <span>TA-14 AI GOVERNANCE EXCHANGE</span>
          </Link>
          <p>
            Build governance routes. Create governed records. Verify
            consequential execution.
          </p>
        </div>
        <div>
          <h3>Exchange</h3>
          <a href="#start" onClick={() => setMobileMenuOpen(false)}>
            Start Here
          </a>
          <a href="#map" onClick={() => setMobileMenuOpen(false)}>
            Exchange Map
          </a>
          <a href="#map" onClick={() => setMobileMenuOpen(false)}>
            Workspaces
          </a>
          <a href="#results">Results Exchange</a>
          <Link href="/eu-ai-act">EU AI Act</Link>
          <Link href="/eu-ai-act/requirements">EU AI Act Requirements</Link>
          <a href="#gallery" onClick={() => setMobileMenuOpen(false)}>
            Route Gallery
          </a>
          <a
            href="#partner-review-network"
            onClick={() => setMobileMenuOpen(false)}
          >
            Partner Review Network
          </a>
        </div>
        <div>
          <h3>Operate</h3>
          <Link href="/workspace">Open Workspace</Link>
          <Link href="/workspace/governed-records">Governed Records</Link>
          <Link href="/workspace/entity-review">Entity Review Center</Link>
          <Link href="/eu-ai-act/article-50">Article 50 Transparency</Link>
          <Link href="/eu-ai-act/high-risk">High-Risk AI Systems</Link>
          <Link href="/eu-ai-act/fundamental-rights">
            Fundamental Rights Assessment
          </Link>
          <Link href="/account" onClick={() => setMobileMenuOpen(false)}>
            Sign In
          </Link>
        </div>
        <div>
          <h3>Contact</h3>
          <a href="mailto:ta14admissibleexecution@gmail.com">
            ta14admissibleexecution@gmail.com
          </a>
          <a
            href="https://github.com/greggbutlerac-debug/ta14-exchange-platform"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
          <a
            href="https://ta14-architecture.netlify.app"
            target="_blank"
            rel="noreferrer"
          >
            Public Architecture
          </a>
        </div>
        <p className="footer-chain">
          Reality → Record → Continuity → Admissibility → Binding → Commit →
          Execution → Outcome
        </p>
        <p className="footer-canon">
          No admissible evidence. No admissible execution.
        </p>
      </footer>

      <style>{`
        * {
          box-sizing: border-box;
        }
        html {
          scroll-behavior: smooth;
        }
        body {
          margin: 0;
          background: #050811;
          color: #f4f7ff;
        }
        a {
          color: inherit;
          text-decoration: none;
          text-decoration-thickness: 0;
          text-underline-offset: 0;
        }
        a:focus-visible,
        button:focus-visible {
          outline: 2px solid #72e2c1;
          outline-offset: 4px;
        }
        .page-shell {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          isolation: isolate;
          background: radial-gradient(
              circle at 10% 5%,
              rgba(76, 109, 255, 0.18),
              transparent 28%
            ),
            radial-gradient(
              circle at 86% 3%,
              rgba(47, 226, 181, 0.12),
              transparent 24%
            ),
            linear-gradient(180deg, #070a13 0%, #09101d 42%, #050811 100%);
        }
        .page-shell > :not(.cosmic-background) {
          position: relative;
          z-index: 2;
        }
        .cosmic-background {
          position: fixed;
          inset: 0;
          z-index: 0;
          overflow: hidden;
          pointer-events: none;
          background: radial-gradient(
            circle at 50% 18%,
            rgba(42, 94, 138, 0.12),
            transparent 34%
          );
        }
        .skip-link {
          position: fixed;
          top: 12px;
          left: 12px;
          z-index: 1000;
          padding: 10px 14px;
          border: 1px solid rgba(109, 240, 207, 0.75);
          border-radius: 10px;
          color: #061019;
          background: #6df0cf;
          font-weight: 900;
          transform: translateY(-160%);
          transition: transform 0.2s ease;
        }
        .skip-link:focus {
          transform: translateY(0);
        }
        .star-field {
          position: absolute;
          inset: -20%;
          background-repeat: repeat;
          opacity: 0.28;
        }
        .star-field-one {
          background-image: radial-gradient(
            circle,
            rgba(255, 255, 255, 0.9) 0 1px,
            transparent 1.6px
          );
          background-size: 112px 112px;
          animation: starDrift 55s linear infinite;
        }
        .star-field-two {
          background-image: radial-gradient(
            circle,
            rgba(114, 226, 193, 0.9) 0 1px,
            transparent 1.8px
          );
          background-size: 176px 176px;
          animation: starDriftReverse 78s linear infinite;
          opacity: 0.2;
        }
        .star-field-three {
          background-image: radial-gradient(
            circle,
            rgba(157, 183, 255, 0.85) 0 1.2px,
            transparent 2px
          );
          background-size: 190px 190px;
          animation: starPulse 9s ease-in-out infinite alternate;
          opacity: 0.22;
        }
        .orbit {
          position: absolute;
          border: 1px solid rgba(114, 226, 193, 0.12);
          border-radius: 50%;
          animation: orbitSpin 38s linear infinite;
        }
        .orbit span {
          position: absolute;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #72e2c1;
          box-shadow:
            0 0 18px #72e2c1,
            0 0 42px rgba(114, 226, 193, 0.55);
        }
        .orbit-one {
          width: 560px;
          height: 560px;
          top: 8%;
          left: -190px;
        }
        .orbit-one span {
          top: 49%;
          right: -4px;
        }
        .orbit-two {
          width: 760px;
          height: 760px;
          right: -320px;
          top: 30%;
          animation-duration: 52s;
          animation-direction: reverse;
          border-color: rgba(157, 183, 255, 0.1);
        }
        .orbit-two span {
          left: 18%;
          top: 8%;
          background: #9db7ff;
          box-shadow:
            0 0 18px #9db7ff,
            0 0 42px rgba(157, 183, 255, 0.5);
        }
        .orbit-three {
          width: 360px;
          height: 360px;
          left: 42%;
          bottom: -210px;
          animation-duration: 29s;
          border-color: rgba(196, 108, 255, 0.1);
        }
        .orbit-three span {
          right: 7%;
          bottom: 18%;
          background: #c46cff;
          box-shadow:
            0 0 18px #c46cff,
            0 0 42px rgba(196, 108, 255, 0.48);
        }
        .moving-line {
          position: absolute;
          width: 42vw;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(114, 226, 193, 0.7),
            transparent
          );
          filter: drop-shadow(0 0 8px rgba(114, 226, 193, 0.5));
          animation: lineSweep 16s ease-in-out infinite;
          opacity: 0.36;
        }
        .line-one {
          top: 18%;
          left: -45vw;
          transform: rotate(18deg);
        }
        .line-two {
          top: 58%;
          right: -48vw;
          transform: rotate(-13deg);
          animation-delay: -6s;
        }
        .line-three {
          bottom: 8%;
          left: -45vw;
          transform: rotate(6deg);
          animation-delay: -11s;
        }
        .nova {
          position: absolute;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #fff;
          box-shadow:
            0 0 16px #fff,
            0 0 36px #72e2c1,
            0 0 80px rgba(114, 226, 193, 0.75);
          animation: novaBurst 7.5s ease-in-out infinite;
        }
        .nova-one {
          left: 74%;
          top: 14%;
        }
        .nova-two {
          left: 18%;
          top: 68%;
          animation-delay: -3.8s;
        }
        @keyframes starDrift {
          to {
            transform: translate3d(160px, 110px, 0);
          }
        }
        @keyframes starDriftReverse {
          to {
            transform: translate3d(-180px, 145px, 0);
          }
        }
        @keyframes starPulse {
          from {
            opacity: 0.12;
            transform: scale(0.98);
          }
          to {
            opacity: 0.38;
            transform: scale(1.02);
          }
        }
        @keyframes orbitSpin {
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes lineSweep {
          0%,
          15% {
            transform: translateX(0) rotate(18deg);
            opacity: 0;
          }
          35% {
            opacity: 0.45;
          }
          80%,
          100% {
            transform: translateX(165vw) rotate(18deg);
            opacity: 0;
          }
        }
        @keyframes novaBurst {
          0%,
          84%,
          100% {
            transform: scale(0.2);
            opacity: 0.1;
          }
          88% {
            transform: scale(1.4);
            opacity: 1;
          }
          92% {
            transform: scale(5);
            opacity: 0.24;
          }
        }
        .site-header {
          position: sticky;
          top: 0;
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          min-height: 76px;
          padding: 14px clamp(18px, 4vw, 64px);
          border-bottom: 1px solid rgba(158, 178, 217, 0.14);
          background: rgba(5, 8, 17, 0.86);
          backdrop-filter: blur(18px);
        }
        .brand {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          color: #eaf1ff;
          text-decoration: none;
          font-size: 0.78rem;
          font-weight: 850;
          letter-spacing: 0.08em;
        }
        .brand-mark {
          display: inline-grid;
          place-items: center;
          min-width: 54px;
          height: 38px;
          padding: 0 8px;
          border: 1px solid rgba(112, 226, 193, 0.42);
          border-radius: 10px;
          color: #72e2c1;
          background: rgba(114, 226, 193, 0.08);
        }
        .main-nav {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 5px;
          border: 1px solid rgba(145, 170, 213, 0.13);
          border-radius: 999px;
          background: rgba(8, 14, 26, 0.62);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.035);
        }
        .main-nav a {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 38px;
          padding: 0 12px;
          border: 1px solid transparent;
          border-radius: 999px;
          color: #b8c5d9;
          text-decoration: none !important;
          font-size: 0.77rem;
          font-weight: 800;
          letter-spacing: 0.01em;
          transition: color 0.2s ease, background 0.2s ease, border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
        }
        .main-nav a::after {
          content: "";
          position: absolute;
          right: 16px;
          bottom: 6px;
          left: 16px;
          height: 1px;
          background: linear-gradient(90deg, transparent, #72e2c1, transparent);
          transform: scaleX(0);
          transition: transform 0.2s ease;
        }
        .main-nav a:hover {
          color: #ffffff;
          border-color: rgba(114, 226, 193, 0.2);
          background: rgba(114, 226, 193, 0.07);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.22);
          transform: translateY(-1px);
        }
        .main-nav a:hover::after {
          transform: scaleX(1);
        }
        .main-nav .nav-cta {
          padding: 0 16px;
          border: 1px solid rgba(114, 226, 193, 0.9);
          color: #06120e;
          background: linear-gradient(135deg, #83f4d7, #45cba8);
          box-shadow: 0 8px 26px rgba(69, 203, 168, 0.2);
        }
        .main-nav .nav-cta::after {
          display: none;
        }
        .main-nav .nav-cta:hover {
          color: #04100d;
          background: linear-gradient(135deg, #a2ffe7, #5ce0bd);
          box-shadow: 0 12px 34px rgba(69, 203, 168, 0.32);
        }
        .menu-button {
          display: none;
          width: 42px;
          height: 42px;
          border: 1px solid rgba(160, 181, 219, 0.2);
          border-radius: 10px;
          color: #fff;
          background: rgba(14, 22, 38, 0.8);
        }
        .section-wrap {
          width: min(1480px, calc(100% - 32px));
          margin: 0 auto;
          padding: 88px 0;
        }
        .hero {
          display: grid;
          grid-template-columns: minmax(0, 1.04fr) minmax(420px, 0.96fr);
          gap: clamp(32px, 6vw, 90px);
          align-items: center;
          min-height: calc(100vh - 76px);
        }
        .eyebrow {
          margin: 0 0 10px;
          color: #72e2c1;
          font-size: 0.72rem;
          font-weight: 900;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }
        h1,
        h2,
        h3,
        p {
          margin-top: 0;
        }
        h1 {
          max-width: 920px;
          margin-bottom: 28px;
          font-size: clamp(3.3rem, 7.4vw, 7.2rem);
          line-height: 0.92;
          letter-spacing: -0.07em;
        }
        h1 span {
          display: block;
          color: #72e2c1;
        }
        h2 {
          margin-bottom: 18px;
          font-size: clamp(2.1rem, 4.5vw, 4.7rem);
          line-height: 1;
          letter-spacing: -0.05em;
        }
        h3 {
          margin-bottom: 10px;
          font-size: 1.18rem;
        }
        p {
          color: #a8b5c9;
          line-height: 1.7;
        }
        .hero-text {
          max-width: 790px;
          font-size: clamp(1rem, 1.5vw, 1.22rem);
        }
        .button-row {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 28px;
        }
        .button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 46px;
          padding: 0 18px;
          border-radius: 12px;
          text-decoration: none;
          font-weight: 850;
          transition:
            transform 0.16s ease,
            border-color 0.16s ease;
        }
        .button:hover {
          transform: translateY(-2px);
        }
        button.button {
          font: inherit;
          cursor: pointer;
        }
        button.button:disabled {
          cursor: wait;
          opacity: 0.7;
        }
        .primary {
          border: 1px solid #72e2c1;
          color: #07130f;
          background: #72e2c1;
        }
        .secondary {
          border: 1px solid rgba(159, 183, 225, 0.3);
          color: #e8f0ff;
          background: rgba(18, 27, 46, 0.8);
        }
        .ghost {
          border: 1px solid transparent;
          color: #b7c3d7;
        }
        .eu-act-hero-button {
          border: 1px solid rgba(240, 202, 110, 0.78);
          color: #ffe7a7;
          background:
            linear-gradient(
              135deg,
              rgba(240, 202, 110, 0.16),
              rgba(240, 168, 65, 0.055)
            ),
            rgba(18, 27, 46, 0.82);
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.08),
            0 12px 34px rgba(214, 156, 44, 0.11);
        }
        .eu-act-hero-button:hover {
          border-color: #f4d47e;
          color: #fff1c5;
          background:
            linear-gradient(
              135deg,
              rgba(240, 202, 110, 0.25),
              rgba(240, 168, 65, 0.09)
            ),
            rgba(18, 27, 46, 0.9);
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.12),
            0 16px 42px rgba(214, 156, 44, 0.19);
        }
        .eu-ai-act-homepage-anchor {
          position: relative;
          scroll-margin-top: 76px;
        }
        .trust-row {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 28px;
        }
        .trust-row span {
          padding: 7px 10px;
          border: 1px solid rgba(147, 172, 216, 0.17);
          border-radius: 999px;
          color: #a6b5cb;
          background: rgba(10, 16, 29, 0.62);
          font-size: 0.76rem;
          font-weight: 760;
        }
        .hero-console,
        .panel,
        .map-board,
        .route-card,
        .receipt,
        .record-preview,
        .coming-panel {
          border: 1px solid rgba(149, 174, 216, 0.17);
          border-radius: 24px;
          background: rgba(10, 16, 29, 0.82);
          box-shadow: 0 35px 110px rgba(0, 0, 0, 0.34);
          backdrop-filter: blur(18px);
        }
        .hero-console {
          position: relative;
          padding: 24px;
          overflow: hidden;
        }
        .hero-console::before {
          content: "";
          position: absolute;
          inset: -40% auto auto -20%;
          width: 420px;
          height: 420px;
          border-radius: 50%;
          background: rgba(68, 103, 255, 0.16);
          filter: blur(50px);
        }
        .console-core {
          position: relative;
          display: grid;
          place-items: center;
          width: 132px;
          height: 132px;
          margin: 2px auto 26px;
          border: 1px solid rgba(114, 226, 193, 0.45);
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(114, 226, 193, 0.18),
            rgba(36, 72, 83, 0.06) 58%,
            transparent 60%
          );
          box-shadow: 0 0 55px rgba(114, 226, 193, 0.16);
        }
        .console-core span {
          font-size: 1.3rem;
          font-weight: 950;
        }
        .console-core strong {
          margin-top: -26px;
          color: #72e2c1;
          font-size: 0.68rem;
          letter-spacing: 0.2em;
        }
        .console-core small {
          position: absolute;
          bottom: -24px;
          width: 220px;
          color: #7f8da4;
          text-align: center;
        }
        .console-status {
          position: relative;
          margin-top: 44px;
        }
        .console-status h2 {
          font-size: 1.75rem;
        }
        dl {
          margin: 0;
        }
        .console-status dl,
        .route-data {
          display: grid;
          gap: 1px;
          overflow: hidden;
          border: 1px solid rgba(145, 169, 209, 0.12);
          border-radius: 14px;
          background: rgba(145, 169, 209, 0.08);
        }
        .console-status dl div,
        .route-data div {
          display: flex;
          justify-content: space-between;
          gap: 18px;
          padding: 11px 12px;
          background: rgba(6, 10, 19, 0.78);
        }
        dt {
          color: #77859b;
          font-size: 0.74rem;
          font-weight: 850;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        dd {
          margin: 0;
          color: #d9e4f6;
          text-align: right;
        }
        .motion-list {
          display: grid;
          gap: 8px;
          margin-top: 18px;
        }
        .motion-list > div {
          display: grid;
          grid-template-columns: minmax(110px, 0.8fr) auto minmax(0, 1.6fr);
          gap: 12px;
          align-items: center;
          padding: 10px 12px;
          border: 1px solid rgba(147, 171, 214, 0.11);
          border-radius: 12px;
          background: rgba(6, 10, 19, 0.62);
        }
        .motion-list span {
          color: #d7e2f4;
          font-size: 0.78rem;
          font-weight: 800;
        }
        .motion-list small {
          color: #7f8da3;
          line-height: 1.4;
        }
        .state {
          display: inline-flex;
          width: fit-content;
          padding: 5px 8px;
          border-radius: 7px;
          font-size: 0.68rem;
          font-weight: 950;
          letter-spacing: 0.08em;
        }
        .state-allow {
          color: #72e2c1;
          background: rgba(114, 226, 193, 0.11);
        }
        .state-hold {
          color: #ffc56a;
          background: rgba(255, 197, 106, 0.11);
        }
        .state-deny {
          color: #ff7d8e;
          background: rgba(255, 125, 142, 0.11);
        }
        .state-escalate {
          color: #9db7ff;
          background: rgba(157, 183, 255, 0.11);
        }
        .console-note {
          margin: 16px 0 0;
          color: #69778c;
          font-size: 0.72rem;
          line-height: 1.55;
        }
        .section-heading {
          max-width: 980px;
          margin-bottom: 34px;
        }
        .section-heading > p:last-child {
          max-width: 820px;
          margin-bottom: 0;
          font-size: 1.03rem;
        }
        .split-heading {
          display: grid;
          grid-template-columns: minmax(0, 1.1fr) minmax(340px, 0.9fr);
          gap: 50px;
          max-width: none;
          align-items: end;
        }
        .split-heading h2 {
          margin-bottom: 0;
        }
        .centered {
          margin-left: auto;
          margin-right: auto;
          text-align: center;
        }
        .centered > p:last-child {
          margin-left: auto;
          margin-right: auto;
        }
        .start-here {
          border-top: 1px solid rgba(145, 170, 213, 0.11);
        }
        .journey-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 14px;
        }
        .journey-card,
        .playground-card,
        .result-card,
        .gallery-card,
        .surface-grid article,
        .comparison-grid article,
        .domain-grid article,
        .built-grid article,
        .ta14-principles-grid article {
          border: 1px solid rgba(149, 174, 216, 0.14);
          border-radius: 18px;
          background: rgba(10, 16, 29, 0.68);
        }
        .journey-card {
          min-height: 210px;
          padding: 18px;
        }
        .journey-card > span {
          display: inline-grid;
          place-items: center;
          width: 38px;
          height: 38px;
          margin-bottom: 22px;
          border: 1px solid rgba(114, 226, 193, 0.34);
          border-radius: 10px;
          color: #72e2c1;
          font-weight: 900;
        }
        .journey-card p {
          margin-bottom: 0;
          font-size: 0.88rem;
        }
        .journey-line {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 14px;
          margin-top: 24px;
          padding: 17px;
          border: 1px solid rgba(148, 172, 214, 0.12);
          border-radius: 16px;
          background: rgba(7, 12, 23, 0.75);
        }
        .journey-line div {
          display: flex;
          align-items: center;
          gap: 14px;
          color: #cbd7e9;
          font-size: 0.78rem;
        }
        .journey-line span {
          color: #56657c;
        }
        .map-board {
          padding: clamp(20px, 4vw, 46px);
        }
        .map-node {
          max-width: 690px;
          margin: auto;
          padding: 18px;
          border: 1px solid rgba(145, 171, 216, 0.17);
          border-radius: 16px;
          text-align: center;
          background: rgba(6, 11, 21, 0.76);
        }
        .map-node small,
        .map-node span {
          display: block;
        }
        .map-node small {
          margin-bottom: 6px;
          color: #72e2c1;
          font-weight: 850;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        .map-node strong {
          display: block;
          margin-bottom: 6px;
          font-size: 1.2rem;
        }
        .map-node span {
          color: #8492a8;
          font-size: 0.86rem;
        }
        .map-node-link {
          position: relative;
          display: block;
          color: inherit;
          text-decoration: none;
          cursor: pointer;
          overflow: hidden;
          box-shadow: 0 16px 50px rgba(0, 0, 0, 0.24);
          transition: transform 0.25s ease, border-color 0.25s ease,
            box-shadow 0.25s ease, background 0.25s ease;
        }
        .map-node-link::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(110deg, transparent 30%, rgba(114, 226, 193, 0.1) 48%, transparent 66%);
          transform: translateX(-120%);
          transition: transform 0.7s ease;
        }
        .map-node-link:hover,
        .map-node-link:focus-visible {
          transform: translateY(-4px);
          border-color: rgba(114, 226, 193, 0.52);
          background: rgba(10, 18, 31, 0.92);
          box-shadow: 0 22px 70px rgba(0, 0, 0, 0.34), 0 0 35px rgba(114, 226, 193, 0.08);
        }
        .map-node-link:hover::before,
        .map-node-link:focus-visible::before { transform: translateX(120%); }
        .map-node-action {
          position: relative;
          z-index: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          margin-top: 14px;
          padding: 8px 13px;
          border: 1px solid rgba(114, 226, 193, 0.18);
          border-radius: 999px;
          color: #c9f8e8;
          background: rgba(114, 226, 193, 0.06);
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.04em;
        }
        .map-node-action i { color: #72e2c1; font-style: normal; transition: transform 0.2s ease; }
        .map-node-link:hover .map-node-action i,
        .map-node-link:focus-visible .map-node-action i { transform: translateX(3px); }
        .map-connector {
          padding: 12px;
          color: #72e2c1;
          text-align: center;
          font-size: 1.3rem;
        }
        .map-workspaces {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 20px;
          align-items: stretch;
        }
        .gateway-link {
          display: block;
          min-width: 0;
          color: inherit;
          text-decoration: none;
        }
        .gateway {
          --accent: #72e2c1;
          --accent-rgb: 114, 226, 193;
          --gold: #ffc857;
          --gold-bright: #fff0a8;
          --gold-rgb: 255, 200, 87;
          position: relative;
          display: flex;
          min-height: 470px;
          height: 100%;
          flex-direction: column;
          padding: 22px;
          overflow: hidden;
          border: 1px solid rgba(var(--accent-rgb), 0.34);
          border-radius: 24px;
          color: #f7f9ff;
          background: radial-gradient(
              circle at 74% 58%,
              rgba(var(--gold-rgb), 0.11),
              transparent 30%
            ),
            linear-gradient(
              160deg,
              rgba(var(--accent-rgb), 0.09),
              rgba(7, 12, 23, 0.96) 43%,
              rgba(3, 7, 14, 0.99)
            );
          box-shadow:
            0 20px 70px rgba(0, 0, 0, 0.42),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
          transition:
            transform 0.35s ease,
            border-color 0.35s ease,
            box-shadow 0.35s ease;
        }
        .gateway::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            115deg,
            transparent 36%,
            rgba(255, 255, 255, 0.08) 49%,
            transparent 62%
          );
          transform: translateX(-115%);
          transition: transform 0.9s ease;
        }
        .gateway::after {
          content: "";
          position: absolute;
          inset: auto 8% 0;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(var(--gold-rgb), 0.85),
            transparent
          );
          box-shadow: 0 0 20px rgba(var(--gold-rgb), 0.55);
        }
        .gateway-link:hover .gateway,
        .gateway-link:focus-visible .gateway {
          transform: translateY(-10px) scale(1.012);
          border-color: rgba(var(--gold-rgb), 0.76);
          box-shadow:
            0 30px 100px rgba(var(--gold-rgb), 0.13),
            0 18px 70px rgba(0, 0, 0, 0.5);
        }
        .gateway-link:hover .gateway::before,
        .gateway-link:focus-visible .gateway::before {
          transform: translateX(115%);
        }
        .gateway-2 {
          --accent: #4aa3ff;
          --accent-rgb: 74, 163, 255;
        }
        .gateway-3 {
          --accent: #c46cff;
          --accent-rgb: 196, 108, 255;
        }
        .gateway-4 {
          --accent: #ffad32;
          --accent-rgb: 255, 173, 50;
        }
        .gateway-head,
        .gateway-body,
        .gateway-action {
          position: relative;
          z-index: 2;
        }
        .gateway-head {
          display: flex;
          gap: 14px;
          align-items: flex-start;
        }
        .gateway-badge {
          display: grid;
          width: 54px;
          height: 54px;
          flex: 0 0 54px;
          place-items: center;
          border: 1px solid rgba(var(--accent-rgb), 0.82);
          border-radius: 14px;
          color: var(--accent);
          background: rgba(var(--accent-rgb), 0.09);
          box-shadow: 0 0 24px rgba(var(--accent-rgb), 0.15);
          font-size: 1.2rem;
          font-weight: 950;
        }
        .gateway-head strong {
          display: block;
          margin-top: 2px;
          font-size: 1.08rem;
        }
        .gateway-head small {
          display: block;
          margin-top: 7px;
          color: #9baac0;
          font-size: 0.77rem;
          line-height: 1.5;
        }
        .gateway-body {
          display: grid;
          grid-template-columns: 0.9fr 1.1fr;
          gap: 10px;
          align-items: end;
          flex: 1;
          margin-top: 20px;
        }
        .gateway-body ul {
          margin: 0 0 18px;
          padding: 0;
          list-style: none;
        }
        .gateway-body li {
          position: relative;
          margin: 0 0 11px;
          padding-left: 18px;
          color: #c8d3e3;
          font-size: 0.75rem;
        }
        .gateway-body li::before {
          content: "✦";
          position: absolute;
          left: 0;
          color: var(--accent);
          font-size: 0.62rem;
        }
        .door-frame {
          position: relative;
          min-height: 250px;
          align-self: end;
          perspective: 900px;
        }
        .door-rays {
          position: absolute;
          left: 50%;
          bottom: 20px;
          width: 210px;
          height: 230px;
          transform: translateX(-50%);
          background: repeating-conic-gradient(
            from 180deg at 50% 100%,
            rgba(var(--gold-rgb), 0.13) 0 3deg,
            transparent 3deg 14deg
          );
          filter: blur(1px);
          opacity: 0.52;
          animation: raysBreathe 4.8s ease-in-out infinite;
        }
        .door-glow {
          position: absolute;
          left: 50%;
          bottom: 16px;
          width: 150px;
          height: 220px;
          transform: translateX(-50%);
          border-radius: 76px 76px 10px 10px;
          background: rgba(var(--gold-rgb), 0.24);
          filter: blur(30px);
          animation: doorPulse 3.8s ease-in-out infinite;
        }
        .door-interior {
          position: absolute;
          left: 50%;
          bottom: 24px;
          width: 118px;
          height: 194px;
          overflow: hidden;
          transform: translateX(-50%);
          border-radius: 58px 58px 6px 6px;
          background:
            radial-gradient(circle at 50% 62%, rgba(255, 247, 205, 0.9) 0 3%, transparent 4%),
            radial-gradient(circle at 50% 76%, rgba(var(--accent-rgb), 0.36), transparent 54%),
            linear-gradient(180deg, #030915 0%, rgba(var(--accent-rgb), 0.22) 58%, rgba(var(--gold-rgb), 0.26) 100%);
          box-shadow:
            inset 0 0 34px rgba(var(--accent-rgb), 0.25),
            0 0 30px rgba(var(--gold-rgb), 0.34);
        }
        .portal-horizon {
          position: absolute;
          left: 12%;
          right: 12%;
          bottom: 24%;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(255, 240, 177, 0.9), transparent);
          box-shadow: 0 0 15px rgba(var(--gold-rgb), 0.9);
        }
        .portal-particle {
          position: absolute;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #fff6c8;
          box-shadow: 0 0 10px rgba(var(--gold-rgb), 1);
          animation: portalDrift 3.6s ease-in-out infinite;
        }
        .particle-one { left: 24%; top: 34%; animation-delay: -0.8s; }
        .particle-two { right: 22%; top: 48%; animation-delay: -2.1s; }
        .particle-three { left: 52%; top: 20%; animation-delay: -1.4s; }
        .door-arch {
          position: absolute;
          left: 50%;
          bottom: 22px;
          width: 142px;
          height: 216px;
          transform: translateX(-50%);
          border: 2px solid rgba(var(--gold-rgb), 0.72);
          border-bottom: 0;
          border-radius: 74px 74px 4px 4px;
          box-shadow:
            0 0 18px rgba(var(--gold-rgb), 0.55),
            inset 0 0 20px rgba(var(--gold-rgb), 0.12);
        }
        .door-panel {
          position: absolute;
          left: 50%;
          bottom: 22px;
          width: 124px;
          height: 200px;
          transform: translateX(-50%) rotateY(-4deg);
          transform-origin: left center;
          border: 3px solid var(--gold);
          border-bottom-width: 6px;
          border-radius: 64px 64px 7px 7px / 54px 54px 7px 7px;
          background: linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.08),
              transparent 18%,
              transparent 82%,
              rgba(255, 255, 255, 0.06)
            ),
            linear-gradient(
              180deg,
              rgba(var(--gold-rgb), 0.42),
              rgba(65, 36, 4, 0.92) 48%,
              rgba(17, 10, 2, 0.98)
            );
          box-shadow:
            0 0 14px rgba(var(--gold-rgb), 0.95),
            0 0 44px rgba(var(--gold-rgb), 0.55),
            inset 0 0 34px rgba(var(--gold-rgb), 0.24);
          transition:
            transform 0.55s cubic-bezier(0.2, 0.8, 0.2, 1),
            box-shadow 0.45s ease;
        }
        .gateway-link:hover .door-panel,
        .gateway-link:focus-visible .door-panel {
          transform: translateX(-50%) rotateY(-26deg) translateZ(10px);
          box-shadow:
            0 0 24px rgba(var(--gold-rgb), 1),
            0 0 76px rgba(var(--gold-rgb), 0.78),
            inset 0 0 42px rgba(var(--gold-rgb), 0.34);
        }
        .door-panel::before {
          content: "";
          position: absolute;
          inset: 15px;
          border: 1px solid rgba(255, 235, 165, 0.58);
          border-radius: 49px 49px 4px 4px / 42px 42px 4px 4px;
          box-shadow: inset 0 0 18px rgba(var(--gold-rgb), 0.2);
        }
        .door-panel::after {
          content: "";
          position: absolute;
          left: 50%;
          top: 14px;
          bottom: 14px;
          width: 1px;
          background: linear-gradient(
            transparent,
            rgba(255, 239, 183, 0.5),
            transparent
          );
        }
        .door-panel span {
          position: absolute;
          left: 50%;
          top: 52%;
          display: grid;
          width: 58px;
          height: 58px;
          transform: translate(-50%, -50%);
          place-items: center;
          border: 2px solid var(--gold-bright);
          border-radius: 50%;
          color: #fff7d1;
          background: rgba(74, 42, 4, 0.7);
          box-shadow: 0 0 26px rgba(var(--gold-rgb), 0.72);
          font-size: 1.2rem;
          font-weight: 950;
        }
        .door-knob {
          position: absolute;
          right: 14px;
          top: 54%;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #fff0a8;
          box-shadow: 0 0 9px rgba(var(--gold-rgb), 1);
        }
        .door-threshold {
          position: absolute;
          left: 50%;
          bottom: 15px;
          width: 168px;
          height: 22px;
          transform: translateX(-50%) perspective(100px) rotateX(55deg);
          border: 1px solid rgba(var(--gold-rgb), 0.72);
          background: linear-gradient(
            180deg,
            rgba(var(--gold-rgb), 0.48),
            rgba(var(--gold-rgb), 0.06)
          );
          box-shadow: 0 0 30px rgba(var(--gold-rgb), 0.5);
        }
        .door-step {
          position: absolute;
          left: 50%;
          bottom: 5px;
          width: 182px;
          height: 15px;
          transform: translateX(-50%);
          border: 1px solid rgba(var(--gold-rgb), 0.7);
          border-radius: 50%;
          background: rgba(var(--gold-rgb), 0.2);
          box-shadow: 0 0 34px rgba(var(--gold-rgb), 0.45);
        }
        .gateway-action {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 10px;
          padding: 14px 15px;
          border: 1px solid rgba(var(--gold-rgb), 0.78);
          border-radius: 11px;
          color: #fff8dc;
          background: linear-gradient(
            180deg,
            rgba(var(--gold-rgb), 0.48),
            rgba(88, 49, 4, 0.62)
          );
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.2),
            0 8px 28px rgba(var(--gold-rgb), 0.14);
          font-size: 0.84rem;
          font-weight: 900;
        }
        .gateway-action-default,
        .gateway-action-hover {
          transition:
            opacity 0.22s ease,
            transform 0.22s ease;
        }
        .gateway-action-hover {
          position: absolute;
          left: 15px;
          opacity: 0;
          transform: translateY(7px);
        }
        .gateway-action b {
          margin-left: auto;
          font-size: 1.2rem;
          transition: transform 0.25s ease;
        }
        .gateway-link:hover .gateway-action-default,
        .gateway-link:focus-visible .gateway-action-default {
          opacity: 0;
          transform: translateY(-7px);
        }
        .gateway-link:hover .gateway-action-hover,
        .gateway-link:focus-visible .gateway-action-hover {
          opacity: 1;
          transform: translateY(0);
        }
        .gateway-link:hover .gateway-action b,
        .gateway-link:focus-visible .gateway-action b {
          transform: translateX(6px);
        }
        .chain-section { overflow: hidden; }
        .ta14-chain-track {
          display: grid;
          grid-template-columns: repeat(8, minmax(0, 1fr));
          gap: 10px;
          margin: 42px 0 24px;
        }
        .ta14-chain-stage {
          position: relative;
          display: flex;
          min-height: 112px;
          flex-direction: column;
          justify-content: space-between;
          padding: 16px 14px;
          border: 1px solid rgba(114, 226, 193, 0.18);
          border-radius: 16px;
          background: radial-gradient(circle at 20% 0%, rgba(114, 226, 193, 0.1), transparent 42%), rgba(8, 15, 27, 0.82);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.03);
        }
        .ta14-chain-number { color: #72e2c1; font-size: 0.72rem; font-weight: 900; letter-spacing: 0.12em; }
        .ta14-chain-stage strong { color: #f5f8ff; font-size: 0.9rem; line-height: 1.2; }
        .ta14-chain-arrow {
          position: absolute;
          top: 50%;
          right: -11px;
          z-index: 3;
          display: grid;
          width: 20px;
          height: 20px;
          place-items: center;
          transform: translateY(-50%);
          border: 1px solid rgba(114, 226, 193, 0.22);
          border-radius: 50%;
          color: #72e2c1;
          background: #08101d;
          font-size: 0.68rem;
          font-style: normal;
        }
        .ta14-principles-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; }
        .ta14-principles-grid article {
          position: relative;
          min-height: 190px;
          padding: 24px;
          overflow: hidden;
          background: linear-gradient(145deg, rgba(114, 226, 193, 0.055), transparent 52%), rgba(8, 14, 25, 0.8);
        }
        .ta14-principles-grid article > span {
          display: grid;
          width: 42px;
          height: 42px;
          margin-bottom: 28px;
          place-items: center;
          border: 1px solid rgba(114, 226, 193, 0.24);
          border-radius: 12px;
          color: #72e2c1;
          background: rgba(114, 226, 193, 0.07);
          font-size: 1.1rem;
        }
        .ta14-principles-grid h3 { margin: 0 0 10px; font-size: 1.05rem; }
        .ta14-principles-grid p { margin: 0; color: #9aa9bf; font-size: 0.9rem; line-height: 1.7; }
        @keyframes doorPulse {
          0%,
          100% {
            opacity: 0.45;
            transform: translateX(-50%) scale(0.96);
          }
          50% {
            opacity: 0.9;
            transform: translateX(-50%) scale(1.04);
          }
        }
        @keyframes raysBreathe {
          0%,
          100% {
            opacity: 0.28;
            transform: translateX(-50%) scale(0.96);
          }
          50% {
            opacity: 0.65;
            transform: translateX(-50%) scale(1.04);
          }
        }
        @keyframes portalDrift {
          0%, 100% { transform: translate3d(0, 8px, 0) scale(0.8); opacity: 0.25; }
          50% { transform: translate3d(3px, -16px, 0) scale(1.25); opacity: 1; }
        }
        .map-shared {
          display: grid;
          grid-template-columns: repeat(8, minmax(0, 1fr));
          gap: 8px;
        }
        .map-shared span {
          padding: 11px 5px;
          border: 1px solid rgba(114, 226, 193, 0.18);
          border-radius: 10px;
          color: #b7c8df;
          text-align: center;
          background: rgba(114, 226, 193, 0.04);
          font-size: 0.72rem;
          font-weight: 800;
        }
        .map-caption {
          max-width: 850px;
          margin: 24px auto 0;
          text-align: center;
        }
        .results-path {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 10px;
          margin-top: 18px;
        }
        .results-path div {
          padding: 16px;
          border: 1px solid rgba(145, 171, 213, 0.12);
          border-radius: 14px;
          background: rgba(7, 12, 23, 0.7);
        }
        .results-path strong,
        .results-path span {
          display: block;
        }
        .results-path span {
          margin-top: 5px;
          color: #718097;
          font-size: 0.76rem;
        }
        .coming-panel {
          display: grid;
          grid-template-columns: minmax(260px, 0.6fr) minmax(0, 1.4fr);
          gap: 30px;
          align-items: center;
          margin-top: 18px;
          padding: 22px;
        }
        .coming-panel h3 {
          margin-bottom: 0;
          word-break: break-word;
        }
        .coming-panel p {
          margin-bottom: 0;
        }
        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
        }
        .gallery-card {
          min-height: 230px;
          padding: 20px;
        }
        .gallery-card > span {
          color: #72e2c1;
          font-size: 0.72rem;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        .gallery-card h3 {
          margin-top: 40px;
        }
        .gallery-card small {
          color: #67768c;
        }
        .surface-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
        }
        .surface-grid article {
          min-height: 240px;
          padding: 22px;
        }
        .surface-grid article > span {
          color: #72e2c1;
          font-size: 1.25rem;
          font-weight: 900;
        }
        .surface-grid h3 {
          margin-top: 38px;
        }
        .governed-records-entry {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 12px;
          margin: -10px 0 28px;
        }
        .comparison-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
        }
        .comparison-grid article {
          padding: 26px;
        }
        .comparison-grid .governed {
          border-color: rgba(114, 226, 193, 0.3);
          background: linear-gradient(
            145deg,
            rgba(17, 41, 42, 0.72),
            rgba(9, 16, 29, 0.8)
          );
        }
        ul {
          margin: 20px 0 0;
          padding-left: 20px;
          color: #aebbd0;
          line-height: 1.8;
        }
        .domain-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 14px;
        }
        .domain-grid article {
          min-height: 200px;
          padding: 20px;
        }
        .domain-grid p {
          margin-bottom: 0;
          font-size: 0.88rem;
        }
        .built-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
        }
        .built-grid article {
          padding: 24px;
        }
        .mini-route {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          align-items: center;
          margin-top: 22px;
          color: #8291a8;
          font-size: 0.76rem;
        }
        .mini-route span,
        .mini-route strong {
          padding: 8px 10px;
          border: 1px solid rgba(146, 171, 213, 0.13);
          border-radius: 9px;
        }
        .mini-route strong {
          color: #72e2c1;
        }
        .sensor-cloud {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 22px;
        }
        .sensor-cloud span {
          padding: 8px 10px;
          border: 1px solid rgba(114, 226, 193, 0.16);
          border-radius: 999px;
          color: #b9c9dd;
          background: rgba(114, 226, 193, 0.04);
          font-size: 0.76rem;
        }
        .partner-network-shell {
          position: relative;
          display: grid;
          grid-template-columns: minmax(0, 1.2fr) minmax(330px, 0.8fr);
          gap: clamp(24px, 4vw, 52px);
          overflow: hidden;
          padding: clamp(26px, 5vw, 58px);
          border: 1px solid rgba(224, 183, 88, 0.3);
          border-radius: 28px;
          background:
            radial-gradient(circle at 12% 10%, rgba(224, 183, 88, 0.12), transparent 34%),
            linear-gradient(135deg, rgba(13, 19, 32, 0.96), rgba(6, 10, 19, 0.95));
          box-shadow: 0 28px 90px rgba(0, 0, 0, 0.34);
        }
        .partner-network-shell::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: linear-gradient(110deg, transparent 30%, rgba(255, 228, 151, 0.05), transparent 70%);
          transform: translateX(-100%);
          animation: partnerSweep 9s ease-in-out infinite;
        }
        .partner-network-copy,
        .partner-network-panel {
          position: relative;
          z-index: 1;
        }
        .partner-network-copy h2 {
          max-width: 900px;
          margin-bottom: 18px;
        }
        .partner-lead {
          color: #d4deec;
          font-size: clamp(1rem, 1.6vw, 1.18rem);
        }
        .partner-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin: 28px 0 18px;
        }
        .partner-boundary {
          max-width: 880px;
          margin-bottom: 0;
          padding: 14px 16px;
          border-left: 3px solid rgba(224, 183, 88, 0.72);
          color: #98a7bb;
          background: rgba(224, 183, 88, 0.05);
          font-size: 0.84rem;
        }
        .partner-network-panel {
          padding: 22px;
          border: 1px solid rgba(224, 183, 88, 0.2);
          border-radius: 20px;
          background: rgba(4, 8, 16, 0.68);
        }
        .partner-network-panel ol {
          display: grid;
          gap: 12px;
          margin: 18px 0 0;
          padding: 0;
          list-style: none;
        }
        .partner-network-panel li {
          display: grid;
          grid-template-columns: 42px 1fr;
          gap: 12px;
          padding: 14px;
          border: 1px solid rgba(149, 174, 216, 0.12);
          border-radius: 14px;
          background: rgba(12, 18, 30, 0.64);
        }
        .partner-network-panel li > span {
          display: grid;
          width: 36px;
          height: 36px;
          place-items: center;
          border: 1px solid rgba(224, 183, 88, 0.5);
          border-radius: 10px;
          color: #f0ca6e;
          font-size: 0.74rem;
          font-weight: 900;
        }

        .button {
          text-decoration: none !important;
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease, background 0.2s ease;
        }
        .button:hover {
          transform: translateY(-2px);
        }
        .button.primary:hover {
          box-shadow: 0 14px 36px rgba(62, 216, 177, 0.26), inset 0 1px 0 rgba(255, 255, 255, 0.18);
        }
        .button.secondary:hover,
        .button.ghost:hover {
          border-color: rgba(114, 226, 193, 0.52);
          background: rgba(114, 226, 193, 0.09);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.22);
        }
        .partner-apply-button {
          border-color: rgba(240, 202, 110, 0.72) !important;
          color: #ffe5a0 !important;
          background: linear-gradient(135deg, rgba(240, 202, 110, 0.14), rgba(240, 168, 65, 0.06)) !important;
          box-shadow: 0 12px 34px rgba(222, 167, 55, 0.12);
        }
        .partner-apply-button:hover {
          border-color: #f0ca6e !important;
          background: linear-gradient(135deg, rgba(240, 202, 110, 0.24), rgba(240, 168, 65, 0.1)) !important;
          box-shadow: 0 16px 42px rgba(222, 167, 55, 0.2);
        }
        .partner-route-note {
          max-width: 780px;
          margin: 14px 0 0;
          padding: 12px 14px;
          border-left: 2px solid rgba(240, 202, 110, 0.75);
          border-radius: 0 10px 10px 0;
          color: #c7d1e1;
          background: rgba(240, 202, 110, 0.055);
          font-size: 0.86rem;
        }
        .partner-network-panel strong {
          color: #edf3fb;
        }
        .partner-network-panel p {
          margin: 4px 0 0;
          font-size: 0.8rem;
        }
        @keyframes partnerSweep {
          0%, 72%, 100% { transform: translateX(-100%); opacity: 0; }
          82% { opacity: 1; }
          94% { transform: translateX(100%); opacity: 0; }
        }
        .final-cta {
          text-align: center;
        }
        .final-cta > p {
          max-width: 820px;
          margin-left: auto;
          margin-right: auto;
        }
        .centered-buttons {
          justify-content: center;
        }
        .site-footer {
          display: grid;
          grid-template-columns: 1.4fr repeat(3, 0.7fr);
          gap: 34px;
          padding: 54px clamp(18px, 4vw, 64px) 28px;
          border-top: 1px solid rgba(145, 170, 213, 0.13);
          background: #04070d;
        }
        .site-footer h3 {
          color: #8492a8;
          font-size: 0.72rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }
        .site-footer > div {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .site-footer a {
          position: relative;
          display: inline-flex;
          width: fit-content;
          align-items: center;
          min-height: 30px;
          padding: 4px 8px;
          margin-left: -8px;
          border-radius: 8px;
          color: #aab8cd;
          text-decoration: none !important;
          font-size: 0.82rem;
          font-weight: 650;
          transition: color 0.2s ease, background 0.2s ease, transform 0.2s ease;
        }
        .site-footer a:hover {
          color: #ffffff;
          background: rgba(114, 226, 193, 0.07);
          transform: translateX(3px);
        }
        .site-footer p {
          margin-bottom: 0;
          font-size: 0.82rem;
        }
        .footer-chain,
        .footer-canon {
          grid-column: 1 / -1;
          padding-top: 18px;
          border-top: 1px solid rgba(145, 170, 213, 0.1);
          text-align: center;
        }
        .footer-canon {
          padding-top: 0;
          border-top: 0;
          color: #72e2c1 !important;
          font-weight: 850;
        }
        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            scroll-behavior: auto !important;
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
        @media (max-width: 1320px) {
          .site-header {
            padding-right: 24px;
            padding-left: 24px;
          }
          .main-nav {
            gap: 3px;
          }
          .main-nav a {
            padding-right: 9px;
            padding-left: 9px;
            font-size: 0.73rem;
          }
        }
        @media (max-width: 1180px) {
          .hero {
            grid-template-columns: 1fr;
            padding-top: 58px;
          }
          .hero-console {
            max-width: 840px;
          }
          .journey-grid,
          .results-grid,
          .domain-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
          .map-workspaces {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
          .ta14-chain-track,
          .map-shared {
            grid-template-columns: repeat(4, minmax(0, 1fr));
          }
          .site-footer {
            grid-template-columns: repeat(3, 1fr);
          }
          .site-footer > div:first-child {
            grid-column: 1 / -1;
          }
        }
        @media (max-width: 1060px) {
          .menu-button {
            display: inline-grid;
            place-items: center;
          }
          .main-nav {
            position: absolute;
            top: 76px;
            left: 16px;
            right: 16px;
            display: none;
            flex-direction: column;
            align-items: stretch;
            padding: 16px;
            border: 1px solid rgba(145, 170, 213, 0.18);
            border-radius: 16px;
            background: rgba(5, 8, 17, 0.97);
          }
          .main-nav.open {
            display: flex;
          }
          .main-nav a {
            padding: 10px;
          }
          .split-heading,
          .demo-grid,
          .coming-panel,
          .partner-network-shell {
            grid-template-columns: 1fr;
            gap: 18px;
          }
          .ta14-principles-grid,
          .gallery-grid,
          .surface-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
          .ta14-chain-track { grid-template-columns: repeat(4, minmax(0, 1fr)); }
          .ta14-chain-stage:nth-child(4n) .ta14-chain-arrow { display: none; }
          .record-preview dl {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
          .results-path {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
        @media (max-width: 650px) {
          .site-header {
            min-height: 68px;
          }
          .brand > span:last-child {
            display: none;
          }
          .main-nav {
            top: 68px;
          }
          .section-wrap {
            width: min(100% - 24px, 1480px);
            padding: 64px 0;
          }
          .hero {
            min-height: auto;
          }
          h1 {
            font-size: clamp(3rem, 17vw, 5rem);
          }
          .motion-list > div {
            grid-template-columns: 1fr auto;
          }
          .motion-list small {
            grid-column: 1 / -1;
          }
          .journey-grid,
          .results-grid,
          .gallery-grid,
          .surface-grid,
          .domain-grid,
          .ta14-principles-grid,
          .comparison-grid,
          .built-grid {
            grid-template-columns: 1fr;
          }
          .map-workspaces,
          .ta14-chain-track,
          .map-shared {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
          .ta14-chain-stage:nth-child(2n) .ta14-chain-arrow { display: none; }
          .ta14-chain-stage { min-height: 96px; }
          .results-path {
            grid-template-columns: 1fr;
          }
          .receipt-chain {
            grid-template-columns: repeat(4, minmax(0, 1fr));
          }
          .record-preview {
            grid-template-columns: 1fr;
          }
          .record-preview dl {
            grid-column: auto;
            grid-template-columns: 1fr;
          }
          .site-footer {
            grid-template-columns: 1fr;
          }
          .site-footer > div:first-child {
            grid-column: auto;
          }
          .footer-chain,
          .footer-canon {
            grid-column: auto;
          }
        }
      `}</style>
    </main>
  );
}
