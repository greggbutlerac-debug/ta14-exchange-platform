"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

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
  ["01", "Learn", "Understand the TA-14 chain and the difference between a claim and a governed route."],
  ["02", "Choose", "Enter the workspace that matches the evidence or consequence you need to govern."],
  ["03", "Build or upload", "Construct a route, bring a record, or submit a system for bounded review."],
  ["04", "Run", "Expose missing evidence, stale authority, continuity breaks, and binding failures."],
  ["05", "Correct", "Repair HOLD conditions without erasing the original result or uncertainty."],
  ["06", "Preserve", "Create a governed record that keeps identity, boundaries, decisions, and outcome visible."],
  ["07", "Verify", "Replay the route and test whether the preserved package still corresponds to execution."],
  ["08", "Publish", "Optionally share a bounded result for others to inspect, challenge, and learn from."],
] as const;

const playgrounds = [
  {
    badge: "AI",
    title: "AI Governance",
    text: "Build, test, correct, and verify consequential AI routes across identity, delegated authority, evidence, tools, payloads, commitments, execution, and outcome.",
    href: "/workspace",
    action: "Enter AI Governance",
  },
  {
    badge: "GR",
    title: "Governed Records",
    text: "Bring an existing record and receive a bounded interpretation that preserves what the evidence proves, what it does not prove, and which conclusions remain inadmissible.",
    href: "/workspace/governed-records",
    action: "Enter Governed Records",
  },
  {
    badge: "ER",
    title: "Environmental Records",
    text: "Interpret land, water, air, atmospheric, building, hospital, laboratory, HVAC, sensor, and environmental evidence without reducing reality to an unsupported score.",
    href: "/workspace/environmental-records",
    action: "Enter Environmental Records",
  },
  {
    badge: "◎",
    title: "Entity Review Center",
    text: "Submit an organization, governance program, AI system, operational architecture, or consequential route for bounded full-chain review.",
    href: "/workspace/entity-review",
    action: "Enter Entity Review Center",
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
    summary: "Current procurement and finance authority were missing before commitment.",
    standing: "Illustrative result",
  },
  {
    domain: "Healthcare AI",
    title: "Model-supported treatment prioritization",
    state: "ESCALATE",
    summary: "Accountable human authority was required before consequence-bearing action.",
    standing: "Illustrative result",
  },
  {
    domain: "Autonomous Agent",
    title: "External tool execution request",
    state: "DENY",
    summary: "The destination binding did not match the approved execution route.",
    standing: "Illustrative result",
  },
  {
    domain: "Built Environment",
    title: "Time-bounded building override",
    state: "ALLOW",
    summary: "Authority, duration, release condition, command binding, and outcome were established.",
    standing: "Illustrative result",
  },
];

const routeGallery = [
  ["AI", "Autonomous Agent Tool Call", "Identity → authority → tool → payload → destination → outcome"],
  ["BAS", "Critical Room Override", "Environmental evidence → operator authority → override → release → restoration"],
  ["Environmental", "Atmospheric Integrity Record", "Observation → qualification → interpretation → intervention → verified outcome"],
  ["Healthcare", "Human Authority Escalation", "Model recommendation → evidence freshness → accountable review → action"],
  ["Finance", "Vendor Payment", "Invoice → dual authority → beneficiary binding → commit → payment outcome"],
  ["Refrigeration", "Non-Invasive Entry Threshold", "Baseline → evidence → threshold → intervention → performance record"],
] as const;

const useCases = [
  ["AI Agents and Autonomous Systems", "Bind identity, delegated authority, tools, payloads, destinations, commands, and outcomes before autonomous action."],
  ["Finance and Enterprise", "Govern vendor payments, procurement, approvals, identity, beneficiary binding, and execution correspondence."],
  ["Healthcare and Critical Operations", "Preserve accountable human authority, evidence freshness, model version, escalation, intervention, and outcome."],
  ["Built Environment", "Govern BAS overrides, AI optimization, critical-space validity, commissioning, alarm resolution, energy, and emergency operation."],
  ["Environmental Systems", "Govern atmospheric integrity, refrigerant intervention, moisture, pressure, air, remediation, and verified restoration."],
  ["Manufacturing and Infrastructure", "Govern process release, restart, robotics, utilities, quality, critical execution, and recovery."],
  ["Government and Public Authority", "Create reconstructable records for public authority, administrative action, evidence, boundaries, and consequence."],
  ["Governance Research and Education", "Build route libraries, break dependencies, repair HOLD conditions, study decisions, and teach governance through use."],
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
      <header className="site-header">
        <Link className="brand" href="/" aria-label="TA-14 AI Governance Exchange home">
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
          <a href="#start">Start Here</a>
          <a href="#map">Exchange Map</a>
          <a href="#playgrounds">Playgrounds</a>
          <a href="#results">Results</a>
          <a href="#gallery">Route Gallery</a>
          <Link href="/account">Sign In</Link>
          <Link className="nav-cta" href="/workspace">Open Workspace</Link>
        </nav>
      </header>

      <section className="hero section-wrap">
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
            <Link className="button primary" href="/workspace">Open the Free Workspace</Link>
            <a className="button secondary" href="#start">Start Here</a>
            <Link className="button ghost" href="/account">Sign In</Link>
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
              <div><dt>Build access</dt><dd>Free and unlimited</dd></div>
              <div><dt>Decision lanes</dt><dd>ALLOW · HOLD · DENY · ESCALATE</dd></div>
              <div><dt>Governance depth</dt><dd>Eight linked stages</dd></div>
              <div><dt>Verification</dt><dd>Independent replay surface</dd></div>
            </dl>
          </div>
          <div className="motion-list">
            {resultCards.map((result) => (
              <div key={result.title}>
                <span>{result.domain}</span>
                <strong className={`state state-${result.state.toLowerCase()}`}>{result.state}</strong>
                <small>{result.summary}</small>
              </div>
            ))}
          </div>
          <p className="console-note">
            Visual exchange preview. Results shown here are illustrative; production
            activity remains governed by its actual route evidence and execution state.
          </p>
        </div>
      </section>

      <section className="section-wrap start-here" id="start">
        <div className="section-heading split-heading">
          <div>
            <p className="eyebrow">New to TA-14?</p>
            <h2>Start here. Never wonder where to go next.</h2>
          </div>
          <p>
            Every visitor follows the same understandable journey—from learning the
            chain to optionally publishing a bounded result for the governance community.
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
            Workspace Directory sends each visitor into the correct operating surface.
          </p>
        </div>

        <div className="map-board">
          <div className="map-node top-node">
            <small>Front gate</small>
            <strong>TA-14 AI Governance Exchange</strong>
            <span>Understand the institution and the complete governing chain.</span>
          </div>
          <div className="map-connector">↓</div>
          <div className="map-node middle-node">
            <small>Visitor center</small>
            <strong>Start Here + Workspace Directory</strong>
            <span>Learn the journey, choose the evidence class, and enter the right workspace.</span>
          </div>
          <div className="map-connector">↓</div>
          <div className="map-workspaces">
            {playgrounds.map((item) => (
              <Link href={item.href} key={item.title}>
                <span>{item.badge}</span>
                <strong>{item.title}</strong>
                <small>Open workspace</small>
              </Link>
            ))}
          </div>
          <div className="map-connector">↓</div>
          <div className="map-shared">
            {chain.map((stage) => <span key={stage}>{stage}</span>)}
          </div>
          <p className="map-caption">
            Different doors. One constitutional chain. Every workspace should show
            where the visitor is, what can be done there, what happens next, and how
            to return later.
          </p>
        </div>
      </section>

      <section className="section-wrap" id="playgrounds">
        <div className="section-heading split-heading">
          <div>
            <p className="eyebrow">Four connected playgrounds</p>
            <h2>Choose where your work begins.</h2>
          </div>
          <p>
            Each playground applies the same TA-14 discipline to a different class
            of consequential evidence and execution. The structure remains familiar
            even when the domain changes.
          </p>
        </div>
        <div className="playground-grid">
          {playgrounds.map((item) => (
            <article className="playground-card" key={item.title}>
              <span className="playground-badge">{item.badge}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <Link href={item.href}>{item.action} <span>→</span></Link>
            </article>
          ))}
        </div>
        <p className="public-principle">
          <strong>Public access principle:</strong> the playgrounds are open for
          education, experimentation, and route development. A favorable result
          cannot be purchased. Pricing and professional operations appear only after
          the visitor chooses a lane.
        </p>
      </section>

      <section className="section-wrap chain-section" id="architecture">
        <div className="section-heading centered">
          <p className="eyebrow">The governing chain</p>
          <h2>Governance must remain visible from Reality to Outcome.</h2>
          <p>
            Policies, approvals, and models can be valuable while an execution route
            still breaks. TA-14 evaluates whether evidence, continuity, authority,
            binding, commitment, execution, and measured outcome remain admissible together.
          </p>
        </div>
        <div className="chain-row">
          {chain.map((stage, index) => (
            <div key={stage}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{stage}</strong>
            </div>
          ))}
        </div>
        <div className="three-principles">
          <article><span>◇</span><h3>Build</h3><p>Model boundaries, actors, authority, evidence, dependencies, rules, commit conditions, execution, and expected outcomes.</p></article>
          <article><span>⚡</span><h3>Challenge</h3><p>Inject missing evidence, stale authority, continuity breaks, beneficiary mismatches, bypass attempts, and outcome failures.</p></article>
          <article><span>✓</span><h3>Verify</h3><p>Preserve route identity, decision history, correction, receipts, execution correspondence, and replayable proof.</p></article>
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
            beneficiary binding, preserve the HOLD, then correct and rerun the route.
          </p>
        </div>

        <div className="demo-grid">
          <article className="route-card">
            <div className="route-card-head">
              <div><p className="eyebrow">Vendor Payment Route</p><h3>Procurement Agent v4.2</h3></div>
              <strong>USD 32,500</strong>
            </div>
            <dl className="route-data">
              <div><dt>Organization</dt><dd>Northstar Procurement Group</dd></div>
              <div><dt>Supplier</dt><dd>Apex Industrial Supply</dd></div>
              <div><dt>Invoice</dt><dd>INV-2026-0716</dd></div>
              <div><dt>Procurement authority</dt><dd>{authorityCorrected ? "Current" : "Missing"}</dd></div>
              <div><dt>Finance authority</dt><dd>{authorityCorrected ? "Current" : "Missing"}</dd></div>
              <div><dt>Beneficiary binding</dt><dd>{authorityCorrected ? "Bound" : "Unproven"}</dd></div>
            </dl>
          </article>

          <article className={`receipt receipt-${routeState.toLowerCase()}`}>
            <div className="receipt-head">
              <div><p className="eyebrow">TA-14 decision receipt</p><small>{authorityCorrected ? "CORRECTED VERSION" : "VERSION 1"}</small></div>
              <strong>{stateLabel}</strong>
            </div>
            <p className="receipt-copy">
              {routeState === "IDLE" && "The route is ready for deterministic evaluation."}
              {routeState === "RUNNING" && `Evaluating ${chain[Math.max(activeStage, 0)] ?? "route"}...`}
              {routeState === "HOLD" && "Required proof is incomplete but correctable. Current dual authority and beneficiary binding are missing."}
              {routeState === "ALLOW" && "All mandatory deterministic requirements are satisfied within the stated route scope."}
            </p>
            <div className="receipt-chain">
              {chain.map((stage, index) => {
                const complete = routeState === "ALLOW" || (routeState === "RUNNING" && index < activeStage);
                const active = routeState === "RUNNING" && index === activeStage;
                const failed = routeState === "HOLD" && index >= 3 && index <= 4;
                return <span className={complete ? "complete" : active ? "active" : failed ? "failed" : ""} key={stage}>{stage}</span>;
              })}
            </div>
            <pre>
              {routeState === "IDLE" && "ROUTE: Vendor payment above USD 25,000\nSTATUS: TESTABLE\nNEXT ACTION: RUN TA-14 ENGINE"}
              {routeState === "RUNNING" && `ROUTE: Vendor payment above USD 25,000\nTESTING: ${chain[Math.max(activeStage, 0)] ?? "Reality"}\nSTATE: EVALUATING`}
              {routeState === "HOLD" && "RESULT: HOLD\nTA-14-AUTH-PROC: CURRENT PROCUREMENT AUTHORITY MISSING\nTA-14-AUTH-FIN: CURRENT FINANCE AUTHORITY MISSING\nTA-14-BIND-BEN: BENEFICIARY NOT BOUND\nNEXT ACTION: CORRECT FREE AND RERUN"}
              {routeState === "ALLOW" && "RESULT: ALLOW\nTA-14-REQ-ALL: SATISFIED\nAUTHORITY: CURRENT DUAL APPROVAL\nBENEFICIARY: BOUND\nCOMMIT CORRESPONDENCE: SATISFIED"}
            </pre>
            <div className="button-row">
              {routeState === "IDLE" && <button className="button primary" type="button" onClick={runRoute}>Run Route</button>}
              {routeState === "RUNNING" && <button className="button primary" type="button" disabled>Testing Route…</button>}
              {routeState === "HOLD" && <><button className="button primary" type="button" onClick={correctAndRerun}>Correct Route and Rerun</button><button className="button secondary" type="button" onClick={resetRoute}>Reset</button></>}
              {routeState === "ALLOW" && <><button className="button primary" type="button" onClick={() => setRecordOpen(true)}>Open AER Preview</button><button className="button secondary" type="button" onClick={resetRoute}>Run Again</button></>}
            </div>
          </article>
        </div>

        {recordOpen && rid ? (
          <article className="record-preview">
            <div><p className="eyebrow">Self-declared AER preview generated</p><h3>TA-14 Admissible Execution Record</h3></div>
            <span>SIGNED PREVIEW</span>
            <dl>
              <div><dt>Route identity</dt><dd>{rid}</dd></div>
              <div><dt>Current state</dt><dd>ALLOW</dd></div>
              <div><dt>Manifest hash</dt><dd>{manifestHash}</dd></div>
              <div><dt>Authority basis</dt><dd>Current dual authority</dd></div>
              <div><dt>Boundary</dt><dd>Self-declared demonstration</dd></div>
              <div><dt>Next action</dt><dd>Preserve durable route record</dd></div>
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
            Published results should become a bounded public evidence library where
            people can inspect outcomes, learn from adverse decisions, compare corrections,
            and distinguish self-declared work from independently verified work.
          </p>
        </div>

        <div className="results-grid">
          {resultCards.map((result) => (
            <article className="result-card" key={result.title}>
              <div className="result-meta"><span>{result.domain}</span><strong className={`state state-${result.state.toLowerCase()}`}>{result.state}</strong></div>
              <h3>{result.title}</h3>
              <p>{result.summary}</p>
              <div className="standing"><span>{result.standing}</span><span>Replay unavailable</span></div>
            </article>
          ))}
        </div>

        <div className="results-path">
          <div><strong>Published Results</strong><span>Bounded public outcomes</span></div>
          <div><strong>Open Challenges</strong><span>Invite qualified scrutiny</span></div>
          <div><strong>Corrections & Retests</strong><span>Preserve the route from failure to repair</span></div>
          <div><strong>Verified Results</strong><span>Separate independent verification from declaration</span></div>
        </div>

        <div className="coming-panel">
          <div><p className="eyebrow">Planned public destination</p><h3>/workspace/ai-governance/results</h3></div>
          <p>
            This homepage previews the Results Exchange without pretending the public
            publishing backend is already live. Build the dedicated workspace only after
            publication boundaries, sanitization, standing labels, moderation, and replay
            links are implemented.
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
            Reusable examples shorten the distance between curiosity and participation.
            Each route should eventually support inspection, copying, testing, replay,
            and verification according to its standing.
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
            The Exchange turns governance from a document into a testable, correctable,
            preservable, independently reviewable execution system.
          </p>
        </div>
        <div className="surface-grid">
          {[
            ["⌘", "Route Construction", "Build bounded consequential routes and map the complete Reality-to-Outcome chain."],
            ["↯", "Runtime Testing", "Run routes, expose exact HOLD and DENY reasons, correct defects, and rerun without hiding adverse results."],
            ["◎", "Governed Records", "Preserve route identity, provenance, continuity, authority, decisions, execution, boundaries, and outcome."],
            ["◇", "Independent Review", "Submit routes, systems, architectures, and enterprise processes for bounded full-chain review."],
            ["#", "Verification and Replay", "Verify signatures, hashes, dependencies, continuity, commit integrity, and execution-to-outcome correspondence."],
            ["API", "Integration Layer", "Connect evidence sources, registries, reviewers, policies, agents, and execution environments."],
          ].map(([icon, title, text]) => <article key={title}><span>{icon}</span><h3>{title}</h3><p>{text}</p></article>)}
        </div>
      </section>

      <section className="section-wrap governed-records">
        <div className="section-heading centered">
          <p className="eyebrow">Governed records</p>
          <h2>A record should prove more than what someone typed.</h2>
          <p>
            A conventional record may capture an event. A governed record preserves
            the route that made the event admissible—or the exact reasons it was held,
            denied, or escalated.
          </p>
        </div>
        <div className="comparison-grid">
          <article className="ordinary">
            <p className="eyebrow">Ordinary record</p>
            <h3>What happened was recorded.</h3>
            <ul><li>Timestamp and event data</li><li>Submitted documents</li><li>Declared approval state</li><li>Limited reconstruction</li></ul>
          </article>
          <article className="governed">
            <p className="eyebrow">TA-14 governed record</p>
            <h3>Why the consequence was—or was not—admissible.</h3>
            <ul><li>Stable route identity and manifest</li><li>Evidence provenance and continuity</li><li>Authority and exact-object binding</li><li>Decision, correction, commit, execution, and outcome history</li><li>Independent verification and replay surface</li><li>Preserved HOLD, DENY, ALLOW, or ESCALATE result</li></ul>
          </article>
        </div>
      </section>

      <section className="section-wrap domains-section" id="domains">
        <div className="section-heading centered">
          <p className="eyebrow">Applied governance domains</p>
          <h2>AI governance is the entrance—not the limit.</h2>
          <p>
            The TA-14 AI Governance Exchange supports every domain where authority,
            evidence, execution, and outcome must remain reconstructable.
          </p>
        </div>
        <div className="domain-grid">
          {useCases.map(([title, text]) => <article key={title}><h3>{title}</h3><p>{text}</p></article>)}
        </div>
      </section>

      <section className="section-wrap built-environment">
        <div className="section-heading split-heading">
          <div><p className="eyebrow">Built environment spotlight</p><h2>Govern what the building does—and preserve what the atmosphere actually was.</h2></div>
          <p>
            BAS, analytics, digital twins, commissioning, TAB, cybersecurity,
            sensors, equipment platforms, and operators each hold part of the operational truth.
          </p>
        </div>
        <div className="built-grid">
          <article>
            <p className="eyebrow">Governed building execution</p>
            <h3>From command to verified restoration.</h3>
            <div className="mini-route"><span>Room warming observed</span><i>→</i><span>Evidence and operator identity captured</span><i>→</i><strong>HOLD</strong><i>→</i><span>Route corrected and command bound</span><i>→</i><strong>ALLOW</strong><i>→</i><span>Control restored and outcome verified</span></div>
          </article>
          <article>
            <p className="eyebrow">Atmospheric Integrity Record</p>
            <h3>Thirteen atmospheric evidence channels. One governed record.</h3>
            <div className="sensor-cloud">
              {["Dry-bulb", "Wet-bulb", "Relative humidity", "Dew point", "Enthalpy", "Humidity ratio", "Specific volume", "Pressure", "VOCs", "Radon", "Sound dB", "Particulate matter", "CO₂"].map((sensor) => <span key={sensor}>{sensor}</span>)}
            </div>
          </article>
        </div>
        <p className="boundary-note">
          Connected but distinct: BAS explains what the building system sensed,
          commanded, and executed. The Atmospheric Integrity Record preserves whether
          atmospheric reality was valid for the intended activity and whether the
          intervention produced a verified environmental outcome.
        </p>
      </section>

      <section className="final-cta section-wrap">
        <p className="eyebrow">TA-14 Authority Governance Institution</p>
        <h2>No admissible evidence. No admissible execution.</h2>
        <p>
          The Exchange is where governance systems become testable, governed records
          become verifiable, qualified reviewers work within declared boundaries, and
          organizations obtain full-chain scrutiny.
        </p>
        <div className="button-row centered-buttons">
          <Link className="button primary" href="/workspace">Open the Free Workspace</Link>
          <a className="button secondary" href="mailto:ta14admissibleexecution@gmail.com">Contact TA-14</a>
        </div>
      </section>

      <footer className="site-footer">
        <div>
          <Link className="brand" href="/"><span className="brand-mark">TA-14</span><span>TA-14 AI GOVERNANCE EXCHANGE</span></Link>
          <p>Build governance routes. Create governed records. Verify consequential execution.</p>
        </div>
        <div><h3>Exchange</h3><a href="#start">Start Here</a><a href="#map">Exchange Map</a><a href="#playgrounds">Playgrounds</a><a href="#results">Results Exchange</a><a href="#gallery">Route Gallery</a></div>
        <div><h3>Operate</h3><Link href="/workspace">Open Workspace</Link><Link href="/workspace/governed-records">Governed Records</Link><Link href="/workspace/entity-review">Entity Review Center</Link><Link href="/account">Sign In</Link></div>
        <div><h3>Contact</h3><a href="mailto:ta14admissibleexecution@gmail.com">ta14admissibleexecution@gmail.com</a><a href="https://github.com/greggbutlerac-debug/ta14-exchange-platform" target="_blank" rel="noreferrer">GitHub</a><a href="https://ta14-architecture.netlify.app" target="_blank" rel="noreferrer">Public Architecture</a></div>
        <p className="footer-chain">Reality → Record → Continuity → Admissibility → Binding → Commit → Execution → Outcome</p>
        <p className="footer-canon">No admissible evidence. No admissible execution.</p>
      </footer>

      <style jsx>{`
        :global(*) { box-sizing: border-box; }
        :global(html) { scroll-behavior: smooth; }
        :global(body) { margin: 0; background: #050811; color: #f4f7ff; }
        :global(a) { color: inherit; }
        .page-shell { min-height: 100vh; overflow: hidden; background: radial-gradient(circle at 10% 5%, rgba(76, 109, 255, .18), transparent 28%), radial-gradient(circle at 86% 3%, rgba(47, 226, 181, .12), transparent 24%), linear-gradient(180deg, #070a13 0%, #09101d 42%, #050811 100%); }
        .site-header { position: sticky; top: 0; z-index: 50; display: flex; align-items: center; justify-content: space-between; gap: 24px; min-height: 76px; padding: 14px clamp(18px, 4vw, 64px); border-bottom: 1px solid rgba(158, 178, 217, .14); background: rgba(5, 8, 17, .86); backdrop-filter: blur(18px); }
        .brand { display: inline-flex; align-items: center; gap: 12px; color: #eaf1ff; text-decoration: none; font-size: .78rem; font-weight: 850; letter-spacing: .08em; }
        .brand-mark { display: inline-grid; place-items: center; min-width: 54px; height: 38px; padding: 0 8px; border: 1px solid rgba(112, 226, 193, .42); border-radius: 10px; color: #72e2c1; background: rgba(114, 226, 193, .08); }
        .main-nav { display: flex; align-items: center; gap: 18px; }
        .main-nav a { color: #afbdd3; text-decoration: none; font-size: .84rem; font-weight: 700; }
        .main-nav a:hover { color: #fff; }
        .main-nav .nav-cta { padding: 10px 14px; border: 1px solid #72e2c1; border-radius: 999px; color: #06120e; background: #72e2c1; }
        .menu-button { display: none; width: 42px; height: 42px; border: 1px solid rgba(160, 181, 219, .2); border-radius: 10px; color: #fff; background: rgba(14, 22, 38, .8); }
        .section-wrap { width: min(1480px, calc(100% - 32px)); margin: 0 auto; padding: 88px 0; }
        .hero { display: grid; grid-template-columns: minmax(0, 1.04fr) minmax(420px, .96fr); gap: clamp(32px, 6vw, 90px); align-items: center; min-height: calc(100vh - 76px); }
        .eyebrow { margin: 0 0 10px; color: #72e2c1; font-size: .72rem; font-weight: 900; letter-spacing: .16em; text-transform: uppercase; }
        h1, h2, h3, p { margin-top: 0; }
        h1 { max-width: 920px; margin-bottom: 28px; font-size: clamp(3.3rem, 7.4vw, 7.2rem); line-height: .92; letter-spacing: -.07em; }
        h1 span { display: block; color: #72e2c1; }
        h2 { margin-bottom: 18px; font-size: clamp(2.1rem, 4.5vw, 4.7rem); line-height: 1; letter-spacing: -.05em; }
        h3 { margin-bottom: 10px; font-size: 1.18rem; }
        p { color: #a8b5c9; line-height: 1.7; }
        .hero-text { max-width: 790px; font-size: clamp(1rem, 1.5vw, 1.22rem); }
        .button-row { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 28px; }
        .button { display: inline-flex; align-items: center; justify-content: center; min-height: 46px; padding: 0 18px; border-radius: 12px; text-decoration: none; font-weight: 850; transition: transform .16s ease, border-color .16s ease; }
        .button:hover { transform: translateY(-2px); }
        button.button { font: inherit; cursor: pointer; }
        button.button:disabled { cursor: wait; opacity: .7; }
        .primary { border: 1px solid #72e2c1; color: #07130f; background: #72e2c1; }
        .secondary { border: 1px solid rgba(159, 183, 225, .3); color: #e8f0ff; background: rgba(18, 27, 46, .8); }
        .ghost { border: 1px solid transparent; color: #b7c3d7; }
        .trust-row { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 28px; }
        .trust-row span { padding: 7px 10px; border: 1px solid rgba(147, 172, 216, .17); border-radius: 999px; color: #a6b5cb; background: rgba(10, 16, 29, .62); font-size: .76rem; font-weight: 760; }
        .hero-console, .panel, .map-board, .route-card, .receipt, .record-preview, .coming-panel { border: 1px solid rgba(149, 174, 216, .17); border-radius: 24px; background: rgba(10, 16, 29, .82); box-shadow: 0 35px 110px rgba(0, 0, 0, .34); backdrop-filter: blur(18px); }
        .hero-console { position: relative; padding: 24px; overflow: hidden; }
        .hero-console::before { content: ""; position: absolute; inset: -40% auto auto -20%; width: 420px; height: 420px; border-radius: 50%; background: rgba(68, 103, 255, .16); filter: blur(50px); }
        .console-core { position: relative; display: grid; place-items: center; width: 132px; height: 132px; margin: 2px auto 26px; border: 1px solid rgba(114, 226, 193, .45); border-radius: 50%; background: radial-gradient(circle, rgba(114, 226, 193, .18), rgba(36, 72, 83, .06) 58%, transparent 60%); box-shadow: 0 0 55px rgba(114, 226, 193, .16); }
        .console-core span { font-size: 1.3rem; font-weight: 950; }
        .console-core strong { margin-top: -26px; color: #72e2c1; font-size: .68rem; letter-spacing: .2em; }
        .console-core small { position: absolute; bottom: -24px; width: 220px; color: #7f8da4; text-align: center; }
        .console-status { position: relative; margin-top: 44px; }
        .console-status h2 { font-size: 1.75rem; }
        dl { margin: 0; }
        .console-status dl, .route-data { display: grid; gap: 1px; overflow: hidden; border: 1px solid rgba(145, 169, 209, .12); border-radius: 14px; background: rgba(145, 169, 209, .08); }
        .console-status dl div, .route-data div { display: flex; justify-content: space-between; gap: 18px; padding: 11px 12px; background: rgba(6, 10, 19, .78); }
        dt { color: #77859b; font-size: .74rem; font-weight: 850; letter-spacing: .06em; text-transform: uppercase; }
        dd { margin: 0; color: #d9e4f6; text-align: right; }
        .motion-list { display: grid; gap: 8px; margin-top: 18px; }
        .motion-list > div { display: grid; grid-template-columns: minmax(110px, .8fr) auto minmax(0, 1.6fr); gap: 12px; align-items: center; padding: 10px 12px; border: 1px solid rgba(147, 171, 214, .11); border-radius: 12px; background: rgba(6, 10, 19, .62); }
        .motion-list span { color: #d7e2f4; font-size: .78rem; font-weight: 800; }
        .motion-list small { color: #7f8da3; line-height: 1.4; }
        .state { display: inline-flex; width: fit-content; padding: 5px 8px; border-radius: 7px; font-size: .68rem; font-weight: 950; letter-spacing: .08em; }
        .state-allow { color: #72e2c1; background: rgba(114, 226, 193, .11); }
        .state-hold { color: #ffc56a; background: rgba(255, 197, 106, .11); }
        .state-deny { color: #ff7d8e; background: rgba(255, 125, 142, .11); }
        .state-escalate { color: #9db7ff; background: rgba(157, 183, 255, .11); }
        .console-note { margin: 16px 0 0; color: #69778c; font-size: .72rem; line-height: 1.55; }
        .section-heading { max-width: 980px; margin-bottom: 34px; }
        .section-heading > p:last-child { max-width: 820px; margin-bottom: 0; font-size: 1.03rem; }
        .split-heading { display: grid; grid-template-columns: minmax(0, 1.1fr) minmax(340px, .9fr); gap: 50px; max-width: none; align-items: end; }
        .split-heading h2 { margin-bottom: 0; }
        .centered { margin-left: auto; margin-right: auto; text-align: center; }
        .centered > p:last-child { margin-left: auto; margin-right: auto; }
        .start-here { border-top: 1px solid rgba(145, 170, 213, .11); }
        .journey-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 14px; }
        .journey-card, .playground-card, .result-card, .gallery-card, .surface-grid article, .comparison-grid article, .domain-grid article, .built-grid article, .three-principles article { border: 1px solid rgba(149, 174, 216, .14); border-radius: 18px; background: rgba(10, 16, 29, .68); }
        .journey-card { min-height: 210px; padding: 18px; }
        .journey-card > span { display: inline-grid; place-items: center; width: 38px; height: 38px; margin-bottom: 22px; border: 1px solid rgba(114, 226, 193, .34); border-radius: 10px; color: #72e2c1; font-weight: 900; }
        .journey-card p { margin-bottom: 0; font-size: .88rem; }
        .journey-line { display: flex; flex-wrap: wrap; justify-content: center; gap: 14px; margin-top: 24px; padding: 17px; border: 1px solid rgba(148, 172, 214, .12); border-radius: 16px; background: rgba(7, 12, 23, .75); }
        .journey-line div { display: flex; align-items: center; gap: 14px; color: #cbd7e9; font-size: .78rem; }
        .journey-line span { color: #56657c; }
        .map-board { padding: clamp(20px, 4vw, 46px); }
        .map-node { max-width: 690px; margin: auto; padding: 18px; border: 1px solid rgba(145, 171, 216, .17); border-radius: 16px; text-align: center; background: rgba(6, 11, 21, .76); }
        .map-node small, .map-node span { display: block; }
        .map-node small { margin-bottom: 6px; color: #72e2c1; font-weight: 850; letter-spacing: .1em; text-transform: uppercase; }
        .map-node strong { display: block; margin-bottom: 6px; font-size: 1.2rem; }
        .map-node span { color: #8492a8; font-size: .86rem; }
        .map-connector { padding: 12px; color: #72e2c1; text-align: center; font-size: 1.3rem; }
        .map-workspaces { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; }
        .map-workspaces a { display: grid; min-height: 150px; padding: 18px; border: 1px solid rgba(145, 171, 216, .16); border-radius: 16px; text-decoration: none; background: linear-gradient(145deg, rgba(19, 29, 50, .9), rgba(7, 12, 23, .8)); }
        .map-workspaces a:hover { border-color: rgba(114, 226, 193, .48); }
        .map-workspaces span { color: #72e2c1; font-weight: 950; }
        .map-workspaces strong { margin-top: auto; }
        .map-workspaces small { color: #74839a; }
        .map-shared { display: grid; grid-template-columns: repeat(8, minmax(0, 1fr)); gap: 8px; }
        .map-shared span { padding: 11px 5px; border: 1px solid rgba(114, 226, 193, .18); border-radius: 10px; color: #b7c8df; text-align: center; background: rgba(114, 226, 193, .04); font-size: .72rem; font-weight: 800; }
        .map-caption { max-width: 850px; margin: 24px auto 0; text-align: center; }
        .playground-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 14px; }
        .playground-card { display: flex; flex-direction: column; min-height: 340px; padding: 22px; }
        .playground-badge { display: inline-grid; place-items: center; width: 46px; height: 46px; margin-bottom: 38px; border: 1px solid rgba(114, 226, 193, .34); border-radius: 13px; color: #72e2c1; font-weight: 950; }
        .playground-card p { font-size: .91rem; }
        .playground-card a { display: flex; justify-content: space-between; margin-top: auto; padding-top: 18px; border-top: 1px solid rgba(147, 172, 215, .12); color: #e9f1ff; text-decoration: none; font-weight: 850; }
        .public-principle, .boundary-note { margin: 18px 0 0; padding: 16px 18px; border-left: 3px solid #72e2c1; background: rgba(114, 226, 193, .05); }
        .chain-row { display: grid; grid-template-columns: repeat(8, minmax(0, 1fr)); gap: 8px; }
        .chain-row div { min-height: 110px; padding: 13px; border: 1px solid rgba(145, 170, 212, .15); border-radius: 14px; background: rgba(8, 14, 26, .7); }
        .chain-row span { display: block; margin-bottom: 25px; color: #72e2c1; font-size: .7rem; font-weight: 900; }
        .chain-row strong { font-size: .82rem; }
        .three-principles { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; margin-top: 18px; }
        .three-principles article { padding: 22px; }
        .three-principles article > span { color: #72e2c1; font-size: 1.5rem; }
        .demo-grid { display: grid; grid-template-columns: minmax(0, .8fr) minmax(0, 1.2fr); gap: 18px; }
        .route-card, .receipt { padding: 22px; }
        .route-card-head, .receipt-head, .result-meta, .standing { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; }
        .route-card-head > strong { font-size: 1.5rem; }
        .route-data { margin-top: 22px; }
        .route-data dd { max-width: 55%; }
        .receipt { border-top-width: 4px; }
        .receipt-idle { border-top-color: #72819b; }
        .receipt-running { border-top-color: #9db7ff; }
        .receipt-hold { border-top-color: #ffc56a; }
        .receipt-allow { border-top-color: #72e2c1; }
        .receipt-head > strong { padding: 8px 10px; border: 1px solid currentColor; border-radius: 9px; letter-spacing: .1em; }
        .receipt-copy { min-height: 55px; }
        .receipt-chain { display: grid; grid-template-columns: repeat(8, minmax(0, 1fr)); gap: 5px; }
        .receipt-chain span { padding: 8px 2px; border: 1px solid rgba(146, 171, 213, .13); border-radius: 8px; color: #65748a; text-align: center; font-size: .62rem; }
        .receipt-chain .complete { color: #72e2c1; border-color: rgba(114, 226, 193, .35); background: rgba(114, 226, 193, .08); }
        .receipt-chain .active { color: #9db7ff; border-color: rgba(157, 183, 255, .4); background: rgba(157, 183, 255, .08); }
        .receipt-chain .failed { color: #ffc56a; border-color: rgba(255, 197, 106, .4); background: rgba(255, 197, 106, .08); }
        pre { min-height: 130px; margin: 18px 0 0; padding: 15px; overflow: auto; border: 1px solid rgba(145, 170, 212, .13); border-radius: 13px; color: #9fb0c8; background: #04070d; font-size: .73rem; line-height: 1.65; white-space: pre-wrap; }
        .record-preview { display: grid; grid-template-columns: 1fr auto; gap: 18px; margin-top: 18px; padding: 22px; }
        .record-preview > span { padding: 8px 10px; border: 1px solid rgba(114, 226, 193, .34); border-radius: 9px; color: #72e2c1; font-size: .7rem; font-weight: 900; }
        .record-preview dl { grid-column: 1 / -1; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; }
        .record-preview dl div { padding: 12px; border: 1px solid rgba(146, 171, 213, .12); border-radius: 11px; background: rgba(5, 9, 17, .65); }
        .record-preview dd { margin-top: 6px; text-align: left; word-break: break-word; }
        .results-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 14px; }
        .result-card { min-height: 280px; padding: 20px; }
        .result-card h3 { margin-top: 34px; }
        .result-card p { font-size: .9rem; }
        .standing { margin-top: 24px; padding-top: 14px; border-top: 1px solid rgba(145, 171, 213, .12); color: #6f7f96; font-size: .7rem; }
        .results-path { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px; margin-top: 18px; }
        .results-path div { padding: 16px; border: 1px solid rgba(145, 171, 213, .12); border-radius: 14px; background: rgba(7, 12, 23, .7); }
        .results-path strong, .results-path span { display: block; }
        .results-path span { margin-top: 5px; color: #718097; font-size: .76rem; }
        .coming-panel { display: grid; grid-template-columns: minmax(260px, .6fr) minmax(0, 1.4fr); gap: 30px; align-items: center; margin-top: 18px; padding: 22px; }
        .coming-panel h3 { margin-bottom: 0; word-break: break-word; }
        .coming-panel p { margin-bottom: 0; }
        .gallery-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; }
        .gallery-card { min-height: 230px; padding: 20px; }
        .gallery-card > span { color: #72e2c1; font-size: .72rem; font-weight: 900; letter-spacing: .1em; text-transform: uppercase; }
        .gallery-card h3 { margin-top: 40px; }
        .gallery-card small { color: #67768c; }
        .surface-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; }
        .surface-grid article { min-height: 240px; padding: 22px; }
        .surface-grid article > span { color: #72e2c1; font-size: 1.25rem; font-weight: 900; }
        .surface-grid h3 { margin-top: 38px; }
        .comparison-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px; }
        .comparison-grid article { padding: 26px; }
        .comparison-grid .governed { border-color: rgba(114, 226, 193, .3); background: linear-gradient(145deg, rgba(17, 41, 42, .72), rgba(9, 16, 29, .8)); }
        ul { margin: 20px 0 0; padding-left: 20px; color: #aebbd0; line-height: 1.8; }
        .domain-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 14px; }
        .domain-grid article { min-height: 200px; padding: 20px; }
        .domain-grid p { margin-bottom: 0; font-size: .88rem; }
        .built-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px; }
        .built-grid article { padding: 24px; }
        .mini-route { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; margin-top: 22px; color: #8291a8; font-size: .76rem; }
        .mini-route span, .mini-route strong { padding: 8px 10px; border: 1px solid rgba(146, 171, 213, .13); border-radius: 9px; }
        .mini-route strong { color: #72e2c1; }
        .sensor-cloud { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 22px; }
        .sensor-cloud span { padding: 8px 10px; border: 1px solid rgba(114, 226, 193, .16); border-radius: 999px; color: #b9c9dd; background: rgba(114, 226, 193, .04); font-size: .76rem; }
        .final-cta { text-align: center; }
        .final-cta > p { max-width: 820px; margin-left: auto; margin-right: auto; }
        .centered-buttons { justify-content: center; }
        .site-footer { display: grid; grid-template-columns: 1.4fr repeat(3, .7fr); gap: 34px; padding: 54px clamp(18px, 4vw, 64px) 28px; border-top: 1px solid rgba(145, 170, 213, .13); background: #04070d; }
        .site-footer h3 { color: #8492a8; font-size: .72rem; letter-spacing: .12em; text-transform: uppercase; }
        .site-footer > div { display: flex; flex-direction: column; gap: 10px; }
        .site-footer a { color: #aab8cd; text-decoration: none; font-size: .82rem; }
        .site-footer p { margin-bottom: 0; font-size: .82rem; }
        .footer-chain, .footer-canon { grid-column: 1 / -1; padding-top: 18px; border-top: 1px solid rgba(145, 170, 213, .1); text-align: center; }
        .footer-canon { padding-top: 0; border-top: 0; color: #72e2c1 !important; font-weight: 850; }
        @media (max-width: 1180px) {
          .hero { grid-template-columns: 1fr; padding-top: 58px; }
          .hero-console { max-width: 840px; }
          .journey-grid, .playground-grid, .results-grid, .domain-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .map-workspaces { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .chain-row, .map-shared { grid-template-columns: repeat(4, minmax(0, 1fr)); }
          .site-footer { grid-template-columns: repeat(3, 1fr); }
          .site-footer > div:first-child { grid-column: 1 / -1; }
        }
        @media (max-width: 900px) {
          .menu-button { display: inline-grid; place-items: center; }
          .main-nav { position: absolute; top: 76px; left: 16px; right: 16px; display: none; flex-direction: column; align-items: stretch; padding: 16px; border: 1px solid rgba(145, 170, 213, .18); border-radius: 16px; background: rgba(5, 8, 17, .97); }
          .main-nav.open { display: flex; }
          .main-nav a { padding: 10px; }
          .split-heading, .demo-grid, .coming-panel { grid-template-columns: 1fr; gap: 18px; }
          .three-principles, .gallery-grid, .surface-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .record-preview dl { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .results-path { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        @media (max-width: 650px) {
          .site-header { min-height: 68px; }
          .brand > span:last-child { display: none; }
          .main-nav { top: 68px; }
          .section-wrap { width: min(100% - 24px, 1480px); padding: 64px 0; }
          .hero { min-height: auto; }
          h1 { font-size: clamp(3rem, 17vw, 5rem); }
          .motion-list > div { grid-template-columns: 1fr auto; }
          .motion-list small { grid-column: 1 / -1; }
          .journey-grid, .playground-grid, .results-grid, .gallery-grid, .surface-grid, .domain-grid, .three-principles, .comparison-grid, .built-grid { grid-template-columns: 1fr; }
          .map-workspaces, .chain-row, .map-shared { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .results-path { grid-template-columns: 1fr; }
          .receipt-chain { grid-template-columns: repeat(4, minmax(0, 1fr)); }
          .record-preview { grid-template-columns: 1fr; }
          .record-preview dl { grid-column: auto; grid-template-columns: 1fr; }
          .site-footer { grid-template-columns: 1fr; }
          .site-footer > div:first-child { grid-column: auto; }
          .footer-chain, .footer-canon { grid-column: auto; }
        }
      `}</style>
    </main>
  );
}
