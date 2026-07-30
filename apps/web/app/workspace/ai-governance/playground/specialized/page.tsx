"use client";

import Link from "next/link";
import { useMemo, useState, type CSSProperties } from "react";

type Lane = {
  code: string;
  number: string;
  title: string;
  slug: string;
  accent: string;
  family: "Execution" | "System" | "Institution" | "Assurance";
  description: string;
  boundary: string;
  claim: string;
  evidence: string[];
  gates: string[];
  nonClaim: string;
};

const lanes: Lane[] = [
  {
    code: "RX",
    number: "01",
    title: "Runtime & Execution",
    slug: "runtime-execution",
    accent: "#63e6ff",
    family: "Execution",
    description: "Live authority, commit, permissions, intervention, execution, drift, and outcome correspondence.",
    boundary: "Controls whether a proposed action has earned the right to bind to reality now.",
    claim: "This exact execution remains authorized, current, bounded, and supported at commit time.",
    evidence: ["Authority state", "Commit context", "Permission continuity", "Execution receipt"],
    gates: ["Authority", "Boundary", "Continuity", "Commit", "Outcome"],
    nonClaim: "Does not prove model quality, regulatory compliance, or beneficial outcome by itself.",
  },
  {
    code: "MG",
    number: "02",
    title: "Model Governance",
    slug: "model",
    accent: "#b58cff",
    family: "System",
    description: "Model identity, approved purpose, evaluation, thresholds, limitations, version, change, and retirement.",
    boundary: "Controls the declared model artifact and its approved lifecycle conditions.",
    claim: "The identified model version remains approved for the declared purpose and operating envelope.",
    evidence: ["Model identity", "Evaluation record", "Threshold basis", "Change history"],
    gates: ["Identity", "Purpose", "Evaluation", "Change", "Retirement"],
    nonClaim: "Does not authorize a particular execution or establish data rights.",
  },
  {
    code: "DP",
    number: "03",
    title: "Data & Provenance",
    slug: "data-provenance",
    accent: "#72e6b2",
    family: "System",
    description: "Origin, rights, consent or basis, lineage, quality, access, transformation, retention, and geography.",
    boundary: "Controls whether declared data may be relied upon for the stated governed use.",
    claim: "The data is attributable, lawful, sufficiently complete, current, and traceable for this use.",
    evidence: ["Source record", "Rights basis", "Lineage manifest", "Quality assessment"],
    gates: ["Origin", "Rights", "Lineage", "Quality", "Retention"],
    nonClaim: "Does not prove that a model, decision, or execution is admissible.",
  },
  {
    code: "AT",
    number: "04",
    title: "Agent & Tool",
    slug: "agent-tools",
    accent: "#ffc65c",
    family: "Execution",
    description: "Delegation, objective, tools, memory, sub-agents, communications, financial limits, and termination.",
    boundary: "Controls delegated agency and the tools through which objectives may be pursued.",
    claim: "The agent remains within its delegated objective, tool, memory, communication, and spend boundaries.",
    evidence: ["Delegation record", "Tool inventory", "Memory boundary", "Termination control"],
    gates: ["Delegation", "Objective", "Tools", "Limits", "Termination"],
    nonClaim: "Does not make every agent action correct, lawful, or execution-authorized.",
  },
  {
    code: "DG",
    number: "05",
    title: "Decision Governance",
    slug: "decision",
    accent: "#c68cff",
    family: "Institution",
    description: "Consequential decision basis, authority, affected party, notice, review, appeal, and traceability.",
    boundary: "Controls the institutional basis and challengeability of consequential decisions.",
    claim: "This consequential decision has a supported basis, valid authority, notice, review, and appeal path.",
    evidence: ["Decision basis", "Authority record", "Affected-party notice", "Appeal history"],
    gates: ["Basis", "Authority", "Notice", "Review", "Appeal"],
    nonClaim: "Does not prove the underlying model, data, or execution was independently admissible.",
  },
  {
    code: "PC",
    number: "06",
    title: "Policy & Controls",
    slug: "policy-controls",
    accent: "#7da6ff",
    family: "Institution",
    description: "Translation of written policy into owned, enforceable, evidenced operational control.",
    boundary: "Controls the conversion of institutional intent into operating mechanisms.",
    claim: "The policy requirement is implemented as an owned, enforceable, evidenced operational control.",
    evidence: ["Policy source", "Control owner", "Enforcement proof", "Exception record"],
    gates: ["Translation", "Ownership", "Enforcement", "Evidence", "Remediation"],
    nonClaim: "Written policy and control design do not prove execution authority.",
  },
  {
    code: "RG",
    number: "07",
    title: "Risk Governance",
    slug: "risk",
    accent: "#ff826f",
    family: "Institution",
    description: "Risk ownership, treatment, residual acceptance, expiration, triggers, and monitoring.",
    boundary: "Controls risk identification, treatment, acceptance, duration, and revalidation.",
    claim: "The identified risk is treated or accepted within declared authority, duration, and triggers.",
    evidence: ["Risk statement", "Treatment plan", "Acceptance authority", "Monitoring history"],
    gates: ["Identification", "Treatment", "Acceptance", "Expiration", "Trigger"],
    nonClaim: "Risk acceptance cannot legalize or authorize an otherwise prohibited action.",
  },
  {
    code: "CR",
    number: "08",
    title: "Compliance & Regulation",
    slug: "compliance",
    accent: "#b7ef68",
    family: "Institution",
    description: "Applicability, regulated actor, obligation, control, evidence, interpretation, and continuing duty.",
    boundary: "Controls bounded determinations against identified legal and regulatory duties.",
    claim: "The declared regulated actor satisfies the identified obligation for this scope and period.",
    evidence: ["Source authority", "Applicability analysis", "Control mapping", "Performance evidence"],
    gates: ["Applicability", "Actor", "Obligation", "Performance", "Continuing duty"],
    nonClaim: "Does not provide universal legal clearance or replace competent counsel.",
  },
  {
    code: "SG",
    number: "09",
    title: "Security Governance",
    slug: "security",
    accent: "#ff8db5",
    family: "System",
    description: "Environment, credentials, permissions, dependencies, incidents, containment, restoration, and proof.",
    boundary: "Controls whether the declared technical environment remains supportable and trusted.",
    claim: "The environment remains within the declared security boundary and supports governed operation.",
    evidence: ["Asset inventory", "Credential state", "Permission graph", "Incident evidence"],
    gates: ["Boundary", "Identity", "Access", "Incident", "Restoration"],
    nonClaim: "Security approval alone does not establish execution admissibility.",
  },
  {
    code: "HO",
    number: "10",
    title: "Human Oversight",
    slug: "human-oversight",
    accent: "#87d8ff",
    family: "Assurance",
    description: "Qualification, information, time, intervention power, conflict, escalation, and decision record.",
    boundary: "Controls whether human review is meaningful rather than symbolic.",
    claim: "The assigned reviewer is qualified, informed, timely, independent, and able to intervene.",
    evidence: ["Reviewer identity", "Qualification", "Information supplied", "Intervention record"],
    gates: ["Qualification", "Information", "Time", "Power", "Independence"],
    nonClaim: "A human click or approval does not automatically create meaningful oversight.",
  },
  {
    code: "VT",
    number: "11",
    title: "Vendor & Third Party",
    slug: "vendor-third-party",
    accent: "#f0a86e",
    family: "Assurance",
    description: "Contracts, versions, access, subprocessors, evidence, change notice, incidents, and exit.",
    boundary: "Controls continuing reliance on external providers and their material dependencies.",
    claim: "The third-party relationship remains bounded, evidenced, current, and safely exit-capable.",
    evidence: ["Contract scope", "Version record", "Subprocessor list", "Exit evidence"],
    gates: ["Contract", "Access", "Change", "Incident", "Exit"],
    nonClaim: "Vendor approval does not transfer accountability or authorize every downstream use.",
  },
  {
    code: "OA",
    number: "12",
    title: "Outcome & Assurance",
    slug: "outcome-assurance",
    accent: "#dce8f3",
    family: "Assurance",
    description: "Execution-result correspondence, success measures, adverse effects, independence, and monitoring.",
    boundary: "Controls whether claimed results correspond to execution and withstand independent challenge.",
    claim: "The declared outcome is supported, attributable, monitored, and independently challengeable.",
    evidence: ["Execution receipt", "Outcome measure", "Adverse-effect record", "Independent finding"],
    gates: ["Correspondence", "Measure", "Attribution", "Independence", "Monitoring"],
    nonClaim: "Assurance reports do not retroactively create authority for an execution.",
  },
];

const families = ["All", "Execution", "System", "Institution", "Assurance"] as const;
type FamilyFilter = (typeof families)[number];

export default function SpecializedPlaygroundCatalogPage() {
  const [query, setQuery] = useState("");
  const [family, setFamily] = useState<FamilyFilter>("All");
  const [expanded, setExpanded] = useState<string | null>(null);

  const visibleLanes = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return lanes.filter((lane) => {
      const familyMatch = family === "All" || lane.family === family;
      const queryMatch =
        !normalized ||
        [lane.code, lane.title, lane.description, lane.boundary, lane.claim, ...lane.evidence, ...lane.gates]
          .join(" ")
          .toLowerCase()
          .includes(normalized);
      return familyMatch && queryMatch;
    });
  }, [family, query]);

  return (
    <main className="catalogPage">
      <div className="stars starsOne" />
      <div className="stars starsTwo" />

      <section className="shell">
        <nav className="topbar" aria-label="Specialized playground navigation">
          <Link href="/workspace/ai-governance/playground" className="button quiet">
            ← AI Governance Playground
          </Link>
          <div className="navActions">
            <Link href="/workspace/ai-governance" className="button quiet">
              Workspace Home
            </Link>
            <Link href="/governance-library" className="button goldButton">
              Open Governance Library →
            </Link>
          </div>
        </nav>

        <header className="hero">
          <div className="heroSeal" aria-hidden="true">
            <span>12</span>
            <small>LANES</small>
          </div>
          <p className="eyebrow">TA-14 SPECIALIZED PLAYGROUND CATALOG</p>
          <h1>Twelve governance doors. Twelve independent determinations.</h1>
          <p className="lead">
            Select the exact operational layer an architecture claims to govern. Every lane preserves its own boundary,
            evidence contract, gates, scenarios, non-claims, challenge path, and replayable result.
          </p>
          <div className="statusRow" aria-label="Available determinations">
            <span className="allow">ALLOW</span>
            <span className="hold">HOLD</span>
            <span className="deny">DENY</span>
            <span className="escalate">ESCALATE</span>
          </div>
        </header>

        <section className="institutionalRule">
          <div className="ruleMark">IR</div>
          <div>
            <p className="eyebrow gold">INSTITUTIONAL RULE</p>
            <h2>Governance boundaries do not merge.</h2>
            <p>
              ALLOW in one specialized lane never automatically produces ALLOW in another. Cross-lane handoffs may
              preserve evidence and continuity, but they never transfer authority or collapse separate determinations.
            </p>
          </div>
        </section>

        <section className="catalogSection">
          <div className="sectionHeading">
            <div>
              <p className="eyebrow">SPECIALIZED GOVERNANCE WORKSPACES</p>
              <h2>Choose the layer to test.</h2>
            </div>
            <p>
              Search by governance concept or filter by operating family. Open any lane to enter its bounded test shell.
            </p>
          </div>

          <div className="controls">
            <label className="searchBox">
              <span>Search catalog</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search authority, provenance, oversight, vendor, outcome…"
              />
            </label>
            <div className="filterGroup" aria-label="Filter governance lanes">
              {families.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={family === item ? "filter active" : "filter"}
                  onClick={() => setFamily(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="resultBar">
            <span>{visibleLanes.length} of 12 lanes visible</span>
            {(query || family !== "All") && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setFamily("All");
                }}
              >
                Clear filters
              </button>
            )}
          </div>

          {visibleLanes.length > 0 ? (
            <div className="laneGrid">
              {visibleLanes.map((lane) => {
                const isExpanded = expanded === lane.slug;
                return (
                  <article
                    key={lane.slug}
                    className="laneCard"
                    style={{ "--accent": lane.accent } as CSSProperties}
                  >
                    <div className="cardGlow" />
                    <div className="cardTop">
                      <div className="codeBlock">
                        <span>{lane.code}</span>
                        <small>{lane.number}</small>
                      </div>
                      <span className="familyTag">{lane.family}</span>
                    </div>

                    <p className="cardEyebrow">Governance-specific playground</p>
                    <h3>{lane.title}</h3>
                    <p className="description">{lane.description}</p>

                    <div className="boundaryBox">
                      <span>Boundary</span>
                      <p>{lane.boundary}</p>
                    </div>

                    <div className="gatePath" aria-label={`${lane.title} gate path`}>
                      {lane.gates.slice(0, 3).map((gate, index) => (
                        <div key={gate} className="gateNode">
                          <span>{gate}</span>
                          {index < 2 && <i />}
                        </div>
                      ))}
                    </div>

                    <div className={isExpanded ? "details expanded" : "details"}>
                      <div className="detailBlock">
                        <span>Bounded claim</span>
                        <p>{lane.claim}</p>
                      </div>
                      <div className="detailBlock">
                        <span>Required evidence</span>
                        <ul>
                          {lane.evidence.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="detailBlock warningBlock">
                        <span>Unsupported-layer warning</span>
                        <p>{lane.nonClaim}</p>
                      </div>
                    </div>

                    <div className="cardActions">
                      <button type="button" className="inspectButton" onClick={() => setExpanded(isExpanded ? null : lane.slug)}>
                        {isExpanded ? "Close boundary" : "Inspect boundary"}
                      </button>
                      <Link href={`/workspace/ai-governance/playground/specialized/${lane.slug}`} className="enterButton">
                        Enter lane →
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="emptyState">
              <span>NO MATCHING LANE</span>
              <h3>The catalog found no governance lane for that search.</h3>
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setFamily("All");
                }}
              >
                Restore all twelve lanes
              </button>
            </div>
          )}
        </section>

        <section className="contractSection">
          <div className="contractIntro">
            <p className="eyebrow gold">SHARED GOVERNANCE TEST CONTRACT</p>
            <h2>One typed shell. Twelve bounded configurations.</h2>
            <p>
              The interaction model remains consistent while each lane protects its own authority, evidence, and
              determination boundary.
            </p>
          </div>
          <div className="contractGrid">
            {[
              ["01", "Claim", "One bounded governance claim plus an unsupported-layer warning."],
              ["02", "Evidence", "Provenance, integrity, freshness, visibility, and unavailable states."],
              ["03", "Scenarios", "Baseline, failure, drift, adversarial, recovery, and compound tests."],
              ["04", "Determination", "ALLOW, HOLD, DENY, or ESCALATE with scope and invalidation triggers."],
              ["05", "Preserve", "Governed record, evidence manifest, route receipt, export, and replay."],
              ["06", "Challenge", "Counterevidence, response, review finding, correction, and supersession."],
            ].map(([number, title, text]) => (
              <article key={title}>
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="handoffSection">
          <div>
            <p className="eyebrow">CROSS-LANE HANDOFF</p>
            <h2>Preserve evidence. Never merge authority.</h2>
          </div>
          <div className="handoffFlow" aria-label="Cross-lane governance handoff flow">
            <span>Lane determination</span>
            <i>→</i>
            <span>Evidence manifest</span>
            <i>→</i>
            <span>Independent intake</span>
            <i>→</i>
            <span>New determination</span>
          </div>
          <Link href="/workspace/ai-governance/playground" className="button primaryButton">
            Return to AI Governance Playground →
          </Link>
        </section>
      </section>

      <style jsx>{`
        .catalogPage {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          color: #f5fbff;
          background:
            radial-gradient(circle at 50% -8%, rgba(49, 145, 215, 0.18), transparent 34%),
            radial-gradient(circle at 8% 30%, rgba(30, 205, 232, 0.07), transparent 24%),
            radial-gradient(circle at 92% 58%, rgba(176, 118, 255, 0.07), transparent 25%),
            #020914;
        }
        .stars { position: fixed; inset: 0; pointer-events: none; opacity: 0.33; }
        .starsOne { background-image: radial-gradient(circle, rgba(255,255,255,.72) 1px, transparent 1px); background-size: 92px 92px; }
        .starsTwo { background-image: radial-gradient(circle, rgba(104,225,255,.62) 1px, transparent 1px); background-size: 157px 157px; background-position: 31px 47px; }
        .shell { position: relative; z-index: 1; width: min(1500px, calc(100% - 40px)); margin: 0 auto; padding: 24px 0 90px; }
        .topbar { display: flex; align-items: center; justify-content: space-between; gap: 14px; padding: 12px; border: 1px solid rgba(255,255,255,.09); border-radius: 18px; background: rgba(4,17,29,.78); box-shadow: 0 20px 50px rgba(0,0,0,.22); backdrop-filter: blur(18px); }
        .navActions { display: flex; gap: 10px; }
        .button { min-height: 46px; display: inline-flex; align-items: center; justify-content: center; padding: 0 17px; border-radius: 12px; text-decoration: none; font-size: 10px; font-weight: 950; letter-spacing: .09em; text-transform: uppercase; transition: transform .2s ease, border-color .2s ease; }
        .button:hover { transform: translateY(-2px); }
        .quiet { color: #c4d5de; border: 1px solid rgba(255,255,255,.1); background: rgba(0,0,0,.18); }
        .goldButton { color: #281a04; border: 1px solid #ffe09a; background: linear-gradient(135deg,#fff1bf,#eeb84b); }
        .primaryButton { color: #041a23; border: 1px solid #aaf2ff; background: linear-gradient(135deg,#d9fbff,#76deef 64%,#38aeca); }
        .hero { max-width: 1180px; margin: 0 auto; padding: 92px 0 72px; text-align: center; }
        .heroSeal { width: 118px; height: 118px; margin: 0 auto 28px; display: grid; place-content: center; border: 1px solid rgba(99,230,255,.42); border-radius: 50%; background: radial-gradient(circle,rgba(99,230,255,.16),rgba(4,18,30,.9) 67%); box-shadow: 0 0 60px rgba(99,230,255,.09), inset 0 0 28px rgba(99,230,255,.08); }
        .heroSeal span { color: #c9f8ff; font: 900 37px/1 Georgia,serif; }
        .heroSeal small { margin-top: 7px; color: #6fe8ff; font-size: 8px; font-weight: 950; letter-spacing: .22em; }
        .eyebrow { margin: 0; color: #6fe8ff; font-size: 10px; font-weight: 950; letter-spacing: .22em; text-transform: uppercase; }
        .eyebrow.gold { color: #efbd59; }
        h1,h2,h3 { font-family: Georgia,"Times New Roman",serif; }
        .hero h1 { max-width: 1160px; margin: 15px auto 0; font-size: clamp(50px,6.4vw,92px); line-height: .96; letter-spacing: -.052em; }
        .lead { max-width: 930px; margin: 28px auto 0; color: #b3c6cf; font-size: 18px; line-height: 1.72; }
        .statusRow { margin-top: 34px; display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; }
        .statusRow span { min-width: 104px; padding: 11px 15px; border-radius: 999px; font-size: 10px; font-weight: 950; letter-spacing: .12em; border: 1px solid rgba(255,255,255,.12); background: rgba(255,255,255,.04); }
        .statusRow .allow { color: #72e6b2; border-color: rgba(114,230,178,.28); }
        .statusRow .hold { color: #ffd27a; border-color: rgba(255,210,122,.28); }
        .statusRow .deny { color: #ff8f83; border-color: rgba(255,143,131,.28); }
        .statusRow .escalate { color: #c7a0ff; border-color: rgba(199,160,255,.28); }
        .institutionalRule { display: grid; grid-template-columns: 94px 1fr; gap: 26px; align-items: center; max-width: 1160px; margin: 0 auto 82px; padding: 28px 32px; border: 1px solid rgba(255,197,82,.22); border-radius: 24px; background: linear-gradient(100deg,rgba(255,190,63,.1),rgba(6,20,32,.86)); box-shadow: 0 24px 70px rgba(0,0,0,.26); }
        .ruleMark { width: 72px; height: 72px; display: grid; place-items: center; border: 1px solid rgba(255,216,132,.52); border-radius: 18px; color: #ffd984; background: rgba(255,198,92,.07); font: 800 22px Georgia,serif; }
        .institutionalRule h2 { margin: 9px 0 6px; font-size: clamp(28px,3vw,44px); letter-spacing: -.035em; }
        .institutionalRule p:last-child { margin: 0; color: #b5c4cb; line-height: 1.7; }
        .sectionHeading { display: grid; grid-template-columns: 1.18fr .82fr; align-items: end; gap: 42px; margin-bottom: 28px; }
        .sectionHeading h2, .contractIntro h2, .handoffSection h2 { margin: 12px 0 0; font-size: clamp(40px,4.6vw,68px); line-height: 1; letter-spacing: -.047em; }
        .sectionHeading > p { margin: 0; color: #9fb2bc; font-size: 15px; line-height: 1.7; }
        .controls { display: grid; grid-template-columns: minmax(280px,1fr) auto; gap: 16px; align-items: end; padding: 16px; border: 1px solid rgba(255,255,255,.08); border-radius: 20px; background: rgba(5,17,29,.76); }
        .searchBox { display: grid; gap: 8px; }
        .searchBox span { color: #87a3b0; font-size: 9px; font-weight: 950; letter-spacing: .16em; text-transform: uppercase; }
        .searchBox input { width: 100%; min-height: 50px; box-sizing: border-box; padding: 0 16px; color: #eefaff; border: 1px solid rgba(99,230,255,.17); border-radius: 13px; outline: none; background: rgba(0,0,0,.22); font: inherit; }
        .searchBox input:focus { border-color: rgba(99,230,255,.65); box-shadow: 0 0 0 3px rgba(99,230,255,.07); }
        .filterGroup { display: flex; flex-wrap: wrap; gap: 8px; }
        .filter { min-height: 42px; padding: 0 14px; color: #aabdc6; border: 1px solid rgba(255,255,255,.09); border-radius: 11px; background: rgba(255,255,255,.025); font-size: 9px; font-weight: 950; letter-spacing: .08em; text-transform: uppercase; cursor: pointer; }
        .filter.active { color: #041820; border-color: #91ebf7; background: linear-gradient(135deg,#d8fbff,#72ddeb); }
        .resultBar { min-height: 50px; display: flex; justify-content: space-between; align-items: center; color: #7f98a4; font-size: 10px; font-weight: 900; letter-spacing: .1em; text-transform: uppercase; }
        .resultBar button { color: #7ae7f5; border: 0; background: transparent; font: inherit; cursor: pointer; }
        .laneGrid { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 18px; }
        .laneCard { --accent: #63e6ff; position: relative; overflow: hidden; min-height: 610px; display: flex; flex-direction: column; padding: 25px; border: 1px solid color-mix(in srgb,var(--accent) 28%,rgba(255,255,255,.05)); border-radius: 27px; background: linear-gradient(145deg,rgba(10,29,46,.97),rgba(4,13,23,.995)); box-shadow: 0 24px 58px rgba(0,0,0,.31); transition: transform .25s ease,border-color .25s ease,box-shadow .25s ease; }
        .laneCard:hover { transform: translateY(-6px); border-color: color-mix(in srgb,var(--accent) 72%,transparent); box-shadow: 0 31px 72px rgba(0,0,0,.4),0 0 30px color-mix(in srgb,var(--accent) 16%,transparent); }
        .cardGlow { position: absolute; width: 230px; height: 230px; right: -100px; top: -110px; border-radius: 50%; background: var(--accent); opacity: .075; filter: blur(12px); }
        .cardTop { position: relative; display: flex; justify-content: space-between; align-items: flex-start; }
        .codeBlock { width: 72px; height: 72px; display: grid; place-content: center; text-align: center; border: 1px solid var(--accent); border-radius: 18px; color: var(--accent); background: rgba(0,0,0,.2); }
        .codeBlock span { font-size: 20px; font-weight: 950; }
        .codeBlock small { margin-top: 4px; color: #75909c; font-size: 8px; font-weight: 900; letter-spacing: .16em; }
        .familyTag { padding: 8px 10px; color: color-mix(in srgb,var(--accent) 76%,white); border: 1px solid color-mix(in srgb,var(--accent) 25%,transparent); border-radius: 999px; background: color-mix(in srgb,var(--accent) 7%,transparent); font-size: 8px; font-weight: 950; letter-spacing: .12em; text-transform: uppercase; }
        .cardEyebrow { margin: 25px 0 0; color: var(--accent); font-size: 9px; font-weight: 950; letter-spacing: .17em; text-transform: uppercase; }
        .laneCard h3 { margin: 10px 0 0; font-size: 31px; line-height: 1.04; letter-spacing: -.025em; }
        .description { min-height: 70px; margin: 14px 0 0; color: #9cafb9; font-size: 14px; line-height: 1.65; }
        .boundaryBox { margin-top: 17px; padding: 16px; border: 1px solid color-mix(in srgb,var(--accent) 18%,rgba(255,255,255,.04)); border-radius: 16px; background: color-mix(in srgb,var(--accent) 4%,rgba(0,0,0,.2)); }
        .boundaryBox span,.detailBlock span { color: color-mix(in srgb,var(--accent) 74%,white); font-size: 8px; font-weight: 950; letter-spacing: .15em; text-transform: uppercase; }
        .boundaryBox p { margin: 8px 0 0; color: #bac9d0; font-size: 12px; line-height: 1.6; }
        .gatePath { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 7px; margin-top: 17px; }
        .gateNode { display: flex; align-items: center; gap: 7px; min-width: 0; }
        .gateNode span { flex: 1; min-width: 0; padding: 8px 6px; overflow: hidden; color: color-mix(in srgb,var(--accent) 70%,white); border: 1px solid color-mix(in srgb,var(--accent) 20%,transparent); border-radius: 8px; background: rgba(0,0,0,.18); font-size: 7px; font-weight: 950; letter-spacing: .06em; text-align: center; text-overflow: ellipsis; text-transform: uppercase; white-space: nowrap; }
        .gateNode i { width: 9px; height: 1px; background: color-mix(in srgb,var(--accent) 45%,transparent); }
        .details { max-height: 0; overflow: hidden; opacity: 0; transition: max-height .35s ease,opacity .28s ease,margin .28s ease; }
        .details.expanded { max-height: 520px; margin-top: 18px; opacity: 1; }
        .detailBlock { padding: 14px 0; border-top: 1px solid rgba(255,255,255,.07); }
        .detailBlock p { margin: 8px 0 0; color: #9fb2bc; font-size: 12px; line-height: 1.6; }
        .detailBlock ul { margin: 9px 0 0; padding: 0; display: grid; grid-template-columns: 1fr 1fr; gap: 7px; list-style: none; }
        .detailBlock li { position: relative; padding-left: 13px; color: #9fb2bc; font-size: 11px; line-height: 1.45; }
        .detailBlock li::before { content: ""; position: absolute; left: 0; top: 7px; width: 5px; height: 5px; border-radius: 50%; background: var(--accent); }
        .warningBlock span { color: #ffd27a; }
        .cardActions { margin-top: auto; padding-top: 20px; display: grid; grid-template-columns: 1fr 1fr; gap: 9px; }
        .inspectButton,.enterButton { min-height: 46px; display: inline-flex; align-items: center; justify-content: center; border-radius: 12px; font-size: 9px; font-weight: 950; letter-spacing: .08em; text-decoration: none; text-transform: uppercase; cursor: pointer; }
        .inspectButton { color: #b9cbd3; border: 1px solid rgba(255,255,255,.1); background: rgba(0,0,0,.2); }
        .enterButton { color: #04171e; border: 1px solid color-mix(in srgb,var(--accent) 80%,white); background: linear-gradient(135deg,color-mix(in srgb,var(--accent) 38%,white),var(--accent)); }
        .emptyState { padding: 80px 28px; text-align: center; border: 1px solid rgba(255,255,255,.08); border-radius: 26px; background: rgba(5,17,29,.7); }
        .emptyState span { color: #6fe8ff; font-size: 9px; font-weight: 950; letter-spacing: .2em; }
        .emptyState h3 { max-width: 650px; margin: 14px auto 24px; font-size: 36px; }
        .emptyState button { min-height: 46px; padding: 0 18px; color: #041820; border: 1px solid #91ebf7; border-radius: 12px; background: linear-gradient(135deg,#d8fbff,#72ddeb); font-weight: 950; cursor: pointer; }
        .contractSection { margin-top: 92px; padding: 38px; border: 1px solid rgba(239,189,89,.17); border-radius: 30px; background: linear-gradient(145deg,rgba(23,22,20,.8),rgba(5,16,27,.95)); }
        .contractIntro { display: grid; grid-template-columns: 1.1fr .9fr; gap: 35px; align-items: end; }
        .contractIntro .eyebrow,.contractIntro h2 { grid-column: 1; }
        .contractIntro > p:last-child { grid-column: 2; grid-row: 1 / 3; margin: 0; color: #a9bac2; line-height: 1.7; align-self: end; }
        .contractGrid { margin-top: 34px; display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 12px; }
        .contractGrid article { min-height: 165px; padding: 21px; border: 1px solid rgba(255,255,255,.075); border-radius: 18px; background: rgba(255,255,255,.025); }
        .contractGrid article > span { color: #efbd59; font-size: 9px; font-weight: 950; letter-spacing: .14em; }
        .contractGrid h3 { margin: 16px 0 8px; font-size: 24px; }
        .contractGrid p { margin: 0; color: #9eafb7; font-size: 13px; line-height: 1.62; }
        .handoffSection { margin-top: 22px; padding: 36px; display: grid; grid-template-columns: .9fr 1.3fr auto; gap: 28px; align-items: center; border: 1px solid rgba(99,230,255,.14); border-radius: 28px; background: linear-gradient(110deg,rgba(7,26,41,.96),rgba(4,14,24,.96)); }
        .handoffSection h2 { font-size: clamp(32px,3.6vw,54px); }
        .handoffFlow { display: flex; align-items: center; justify-content: center; gap: 10px; flex-wrap: wrap; }
        .handoffFlow span { padding: 10px 12px; color: #aed0da; border: 1px solid rgba(99,230,255,.13); border-radius: 10px; background: rgba(99,230,255,.04); font-size: 8px; font-weight: 950; letter-spacing: .08em; text-transform: uppercase; }
        .handoffFlow i { color: #6fe8ff; font-style: normal; }
        @media (max-width: 1120px) {
          .laneGrid { grid-template-columns: repeat(2,minmax(0,1fr)); }
          .handoffSection { grid-template-columns: 1fr; }
          .handoffFlow { justify-content: flex-start; }
          .handoffSection .button { justify-self: start; }
        }
        @media (max-width: 820px) {
          .shell { width: min(100% - 24px,1500px); }
          .topbar,.navActions { align-items: stretch; flex-direction: column; }
          .hero { padding: 65px 0 55px; }
          .institutionalRule,.sectionHeading,.controls,.contractIntro { grid-template-columns: 1fr; }
          .ruleMark { display: none; }
          .contractIntro > p:last-child { grid-column: 1; grid-row: auto; }
          .contractGrid { grid-template-columns: repeat(2,minmax(0,1fr)); }
        }
        @media (max-width: 620px) {
          .laneGrid,.contractGrid { grid-template-columns: 1fr; }
          .laneCard { min-height: 0; }
          .filterGroup { display: grid; grid-template-columns: repeat(2,1fr); }
          .cardActions { grid-template-columns: 1fr; }
          .institutionalRule,.contractSection,.handoffSection { padding: 24px 20px; }
          .hero h1 { font-size: clamp(43px,13vw,62px); }
          .statusRow span { min-width: 0; flex: 1 1 40%; }
        }
      `}</style>
    </main>
  );
}
