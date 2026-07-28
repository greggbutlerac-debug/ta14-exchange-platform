"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type GovernanceRoute = {
  name: string;
  summary: string;
  jurisdictions: string[];
  roles: string[];
  systemTypes: string[];
  objectives: string[];
  authorities: string[];
  complexity: "Foundation" | "Intermediate" | "Advanced";
  buildTime: string;
  decisionModes: string[];
  evidenceOutputs: string[];
};

const governanceRoutes: GovernanceRoute[] = [
  {
    name: "TA-14 Runtime Admissibility Route",
    summary:
      "Recommended for consequential AI decisions requiring admissible evidence, authority validation, and execution control before release.",
    jurisdictions: [
      "Global",
      "European Union",
      "United States",
      "United Kingdom",
      "Canada",
      "Australia",
    ],
    roles: ["Provider", "Deployer", "Integrator"],
    systemTypes: [
      "General-Purpose AI",
      "Foundation Model",
      "High-Risk AI",
      "Healthcare AI",
      "Financial AI",
      "Industrial AI",
    ],
    objectives: [
      "Runtime Governance",
      "Evidence Preservation",
      "Auditability",
      "Risk Management",
    ],
    authorities: ["EU AI Act", "ISO/IEC 42001", "NIST AI RMF"],
    complexity: "Advanced",
    buildTime: "15–20 minutes",
    decisionModes: ["ALLOW", "HOLD", "DENY", "ESCALATE"],
    evidenceOutputs: [
      "Admissibility record",
      "Authority record",
      "Execution receipt",
      "Outcome evidence",
    ],
  },
  {
    name: "TA-14 Human Oversight Route",
    summary:
      "Recommended where meaningful human review, approval, escalation, or intervention must be proven before execution.",
    jurisdictions: [
      "Global",
      "European Union",
      "United States",
      "United Kingdom",
      "Canada",
      "Australia",
    ],
    roles: ["Provider", "Deployer", "Integrator", "Customer"],
    systemTypes: [
      "General-Purpose AI",
      "Foundation Model",
      "High-Risk AI",
      "Healthcare AI",
      "Financial AI",
      "Industrial AI",
    ],
    objectives: [
      "Human Oversight",
      "Auditability",
      "Evidence Preservation",
      "Transparency",
    ],
    authorities: ["EU AI Act", "NIST AI RMF", "ISO/IEC 42001"],
    complexity: "Intermediate",
    buildTime: "10–15 minutes",
    decisionModes: ["ALLOW", "HOLD", "ESCALATE"],
    evidenceOutputs: [
      "Human review record",
      "Approval evidence",
      "Escalation record",
      "Decision trace",
    ],
  },
  {
    name: "TA-14 Transparency and Notice Route",
    summary:
      "Recommended where users, affected persons, operators, or reviewers must receive clear notice about AI involvement, limitations, and decision context.",
    jurisdictions: [
      "Global",
      "European Union",
      "United States",
      "United Kingdom",
      "Canada",
      "Australia",
    ],
    roles: ["Provider", "Deployer", "Distributor", "Customer"],
    systemTypes: [
      "General-Purpose AI",
      "Foundation Model",
      "High-Risk AI",
      "Healthcare AI",
      "Financial AI",
    ],
    objectives: ["Transparency", "Auditability", "Evidence Preservation"],
    authorities: ["EU AI Act", "OECD AI Principles", "NIST AI RMF"],
    complexity: "Foundation",
    buildTime: "8–12 minutes",
    decisionModes: ["ALLOW", "HOLD"],
    evidenceOutputs: [
      "Transparency notice",
      "Disclosure record",
      "User acknowledgment",
      "Communication evidence",
    ],
  },
  {
    name: "TA-14 Risk and Control Route",
    summary:
      "Recommended for organizations that need to bind identified AI risks to controls, responsible roles, evidence requirements, and review outcomes.",
    jurisdictions: [
      "Global",
      "European Union",
      "United States",
      "United Kingdom",
      "Canada",
      "Australia",
    ],
    roles: ["Provider", "Deployer", "Integrator"],
    systemTypes: [
      "General-Purpose AI",
      "Foundation Model",
      "High-Risk AI",
      "Healthcare AI",
      "Financial AI",
      "Industrial AI",
    ],
    objectives: [
      "Risk Management",
      "Runtime Governance",
      "Auditability",
      "Evidence Preservation",
    ],
    authorities: ["NIST AI RMF", "ISO/IEC 42001", "ISO/IEC 23894"],
    complexity: "Intermediate",
    buildTime: "12–18 minutes",
    decisionModes: ["ALLOW", "HOLD", "DENY", "ESCALATE"],
    evidenceOutputs: [
      "Risk determination",
      "Control binding record",
      "Residual risk record",
      "Review evidence",
    ],
  },
  {
    name: "TA-14 High-Risk AI Route",
    summary:
      "Recommended for high-risk or safety-significant AI systems requiring documented controls, technical evidence, human oversight, and preserved execution records.",
    jurisdictions: ["European Union", "Global"],
    roles: ["Provider", "Deployer", "Integrator", "Distributor"],
    systemTypes: ["High-Risk AI", "Healthcare AI", "Financial AI", "Industrial AI"],
    objectives: [
      "Risk Management",
      "Human Oversight",
      "Transparency",
      "Runtime Governance",
      "Evidence Preservation",
      "Auditability",
    ],
    authorities: ["EU AI Act", "ISO/IEC 42001", "NIST AI RMF"],
    complexity: "Advanced",
    buildTime: "18–25 minutes",
    decisionModes: ["ALLOW", "HOLD", "DENY", "ESCALATE"],
    evidenceOutputs: [
      "High-risk classification record",
      "Technical evidence package",
      "Human oversight record",
      "Execution and outcome receipt",
    ],
  },
  {
    name: "TA-14 Governed Record Route",
    summary:
      "Recommended where governance evidence must be preserved as a dated, attributable, reviewable, and exportable governed record.",
    jurisdictions: [
      "Global",
      "European Union",
      "United States",
      "United Kingdom",
      "Canada",
      "Australia",
    ],
    roles: [
      "Provider",
      "Deployer",
      "Integrator",
      "Distributor",
      "Customer",
    ],
    systemTypes: [
      "General-Purpose AI",
      "Foundation Model",
      "High-Risk AI",
      "Healthcare AI",
      "Financial AI",
      "Industrial AI",
    ],
    objectives: ["Evidence Preservation", "Auditability", "Transparency"],
    authorities: ["ISO/IEC 42001", "NIST AI RMF", "EU AI Act"],
    complexity: "Foundation",
    buildTime: "6–10 minutes",
    decisionModes: ["ALLOW", "HOLD"],
    evidenceOutputs: [
      "Governed record",
      "Attribution record",
      "Review history",
      "Export package",
    ],
  },
];

const objectiveOptions = [
  "Risk Management",
  "Human Oversight",
  "Transparency",
  "Runtime Governance",
  "Evidence Preservation",
  "Auditability",
];

export default function GovernanceRouteRecommendationsPage() {
  const [jurisdiction, setJurisdiction] = useState("Global");
  const [organizationRole, setOrganizationRole] = useState("Provider");
  const [systemType, setSystemType] = useState("General-Purpose AI");
  const [selectedObjectives, setSelectedObjectives] = useState<string[]>([
    "Runtime Governance",
    "Evidence Preservation",
  ]);
  const [complexityFilter, setComplexityFilter] = useState("All Complexity");
  const [searchQuery, setSearchQuery] = useState("");

  const rankedRoutes = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return governanceRoutes
      .map((route) => {
        let score = 0;
        const matches: string[] = [];

        if (route.jurisdictions.includes(jurisdiction)) {
          score += 3;
          matches.push(jurisdiction);
        }

        if (route.roles.includes(organizationRole)) {
          score += 3;
          matches.push(organizationRole);
        }

        if (route.systemTypes.includes(systemType)) {
          score += 4;
          matches.push(systemType);
        }

        const matchedObjectives = selectedObjectives.filter((objective) =>
          route.objectives.includes(objective),
        );

        score += matchedObjectives.length * 2;
        matches.push(...matchedObjectives);

        return {
          ...route,
          score,
          matches: Array.from(new Set(matches)),
        };
      })
      .filter((route) => {
        const matchesComplexity =
          complexityFilter === "All Complexity" ||
          route.complexity === complexityFilter;

        const matchesSearch =
          query.length === 0 ||
          [
            route.name,
            route.summary,
            ...route.authorities,
            ...route.objectives,
            ...route.evidenceOutputs,
          ]
            .join(" ")
            .toLowerCase()
            .includes(query);

        return matchesComplexity && matchesSearch;
      })
      .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
  }, [
    complexityFilter,
    jurisdiction,
    organizationRole,
    searchQuery,
    selectedObjectives,
    systemType,
  ]);

  const activeProfileCount = [
    jurisdiction !== "Global",
    organizationRole !== "Provider",
    systemType !== "General-Purpose AI",
    selectedObjectives.length > 0,
    complexityFilter !== "All Complexity",
    searchQuery.trim().length > 0,
  ].filter(Boolean).length;

  const topScore = rankedRoutes[0]?.score ?? 0;

  function toggleObjective(objective: string) {
    setSelectedObjectives((current) =>
      current.includes(objective)
        ? current.filter((item) => item !== objective)
        : [...current, objective],
    );
  }

  function resetProfile() {
    setJurisdiction("Global");
    setOrganizationRole("Provider");
    setSystemType("General-Purpose AI");
    setSelectedObjectives([
      "Runtime Governance",
      "Evidence Preservation",
    ]);
    setComplexityFilter("All Complexity");
    setSearchQuery("");
  }

  return (
    <main className="recommendationsPage">
      <div className="backgroundGrid" />
      <div className="backgroundGlow glowOne" />
      <div className="backgroundGlow glowTwo" />

      <div className="pageShell">
        <div className="topbar">
          <Link href="/governance-library" className="topbarLink">
            ← Governance Library
          </Link>

          <div className="topbarStatus">
            <span />
            Recommendation engine active
          </div>

          <Link
            href="/ai-governance/build-a-route"
            className="topbarAction"
          >
            Build a Route →
          </Link>
        </div>

        <header className="hero">
          <div className="heroSeal">
            <span>GR</span>
            <small>Governance routes</small>
          </div>

          <p className="eyebrow">TA-14 AI GOVERNANCE LIBRARY</p>

          <h1>
            Governance Route
            <span> Recommendations</span>
          </h1>

          <p className="lead">
            Define the jurisdiction, organizational role, AI system type, and
            governance objectives. The recommendation engine ranks TA-14
            admissible execution routes against that operating profile.
          </p>

          <div className="heroMetrics">
            <article>
              <span>{governanceRoutes.length}</span>
              <small>Routes available</small>
            </article>

            <article>
              <span>{rankedRoutes.length}</span>
              <small>Routes displayed</small>
            </article>

            <article>
              <span>{selectedObjectives.length}</span>
              <small>Objectives selected</small>
            </article>

            <article>
              <span>{topScore}</span>
              <small>Highest match score</small>
            </article>

            <article>
              <span>{activeProfileCount}</span>
              <small>Profile controls active</small>
            </article>
          </div>
        </header>

        <section className="definitionSection">
          <div className="definitionSeal">
            <span>RR</span>
            <small>Route recommendation</small>
          </div>

          <div>
            <p className="eyebrow gold">GOVERNANCE ROUTING</p>

            <h2>
              A route recommendation connects governance objectives to the
              evidence, authority, review, and execution controls needed for
              the proposed AI activity.
            </h2>
          </div>

          <p>
            Recommendations are not certifications or automatic legal
            conclusions. They are structured starting points for building an
            admissible execution route that can be tested, reviewed,
            challenged, preserved, and adapted to the actual governed system.
          </p>
        </section>

        <section className="profileSection">
          <div className="sectionHeading">
            <div>
              <p className="eyebrow">GOVERNANCE PROFILE</p>

              <h2>
                Define the operating conditions the route must govern.
              </h2>
            </div>

            <p>
              The recommendation engine prioritizes routes that align with the
              selected jurisdiction, organizational role, system type, and
              governance objectives.
            </p>
          </div>

          <div className="profilePanel">
            <label>
              Jurisdiction
              <select
                value={jurisdiction}
                onChange={(event) => setJurisdiction(event.target.value)}
              >
                <option>Global</option>
                <option>European Union</option>
                <option>United States</option>
                <option>United Kingdom</option>
                <option>Canada</option>
                <option>Australia</option>
              </select>
            </label>

            <label>
              Organization role
              <select
                value={organizationRole}
                onChange={(event) =>
                  setOrganizationRole(event.target.value)
                }
              >
                <option>Provider</option>
                <option>Deployer</option>
                <option>Integrator</option>
                <option>Distributor</option>
                <option>Customer</option>
              </select>
            </label>

            <label>
              AI system type
              <select
                value={systemType}
                onChange={(event) => setSystemType(event.target.value)}
              >
                <option>General-Purpose AI</option>
                <option>Foundation Model</option>
                <option>High-Risk AI</option>
                <option>Healthcare AI</option>
                <option>Financial AI</option>
                <option>Industrial AI</option>
              </select>
            </label>

            <label>
              Complexity
              <select
                value={complexityFilter}
                onChange={(event) =>
                  setComplexityFilter(event.target.value)
                }
              >
                <option>All Complexity</option>
                <option>Foundation</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </label>

            <label className="searchField">
              Search route content
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search authority, objective, evidence output..."
              />
            </label>

            <button type="button" onClick={resetProfile}>
              Reset profile
            </button>
          </div>

          <div className="objectivePanel">
            <div className="objectiveHeading">
              <div>
                <span>Governance objectives</span>
                <strong>
                  Select every objective the route must address.
                </strong>
              </div>

              <small>{selectedObjectives.length} selected</small>
            </div>

            <div className="objectiveGrid">
              {objectiveOptions.map((objective) => {
                const isSelected = selectedObjectives.includes(objective);

                return (
                  <button
                    key={objective}
                    type="button"
                    className={isSelected ? "selectedObjective" : ""}
                    onClick={() => toggleObjective(objective)}
                  >
                    <span>{isSelected ? "✓" : "+"}</span>
                    {objective}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="profileSummary">
            <div>
              <span>Jurisdiction</span>
              <strong>{jurisdiction}</strong>
            </div>

            <div>
              <span>Role</span>
              <strong>{organizationRole}</strong>
            </div>

            <div>
              <span>System type</span>
              <strong>{systemType}</strong>
            </div>

            <div>
              <span>Objectives</span>
              <strong>{selectedObjectives.length}</strong>
            </div>
          </div>
        </section>

        <section className="recommendationSection">
          <div className="sectionHeading">
            <div>
              <p className="eyebrow">RECOMMENDED ROUTES</p>

              <h2>
                Ranked governance routes for the selected operating profile.
              </h2>
            </div>

            <p>
              Higher scores indicate stronger alignment with the selected
              jurisdiction, role, system type, and governance objectives.
            </p>
          </div>

          {rankedRoutes.length > 0 ? (
            <div className="routeGrid">
              {rankedRoutes.map((route, index) => {
                const matchPercentage = Math.min(
                  100,
                  Math.round((route.score / 22) * 100),
                );

                return (
                  <article key={route.name} className="routeCard">
                    <div className="routeHeader">
                      <div className="routeRank">
                        <span>{String(index + 1).padStart(2, "0")}</span>
                        <small>Rank</small>
                      </div>

                      <div className="scoreBlock">
                        <strong>{matchPercentage}%</strong>
                        <span>Profile match</span>
                      </div>
                    </div>

                    <div className="scoreTrack">
                      <span style={{ width: `${matchPercentage}%` }} />
                    </div>

                    <p className="routeClass">{route.complexity} route</p>

                    <h3>{route.name}</h3>

                    <p className="routeSummary">{route.summary}</p>

                    <div className="routeMetrics">
                      <div>
                        <span>Match score</span>
                        <strong>{route.score}</strong>
                      </div>

                      <div>
                        <span>Build time</span>
                        <strong>{route.buildTime}</strong>
                      </div>

                      <div>
                        <span>Decision modes</span>
                        <strong>{route.decisionModes.length}</strong>
                      </div>
                    </div>

                    <div className="matchBlock">
                      <span>Profile alignment</span>

                      <div className="tagList">
                        {route.matches.length > 0 ? (
                          route.matches.map((match) => (
                            <strong key={match}>{match}</strong>
                          ))
                        ) : (
                          <strong>General governance alignment</strong>
                        )}
                      </div>
                    </div>

                    <div className="routeColumns">
                      <div>
                        <span>Governance objectives</span>

                        <ul>
                          {route.objectives.map((objective) => (
                            <li key={objective}>{objective}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <span>Authorities</span>

                        <ul>
                          {route.authorities.map((authority) => (
                            <li key={authority}>{authority}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="evidenceBlock">
                      <span>Expected governed outputs</span>

                      <div className="evidenceGrid">
                        {route.evidenceOutputs.map((output) => (
                          <strong key={output}>{output}</strong>
                        ))}
                      </div>
                    </div>

                    <div className="decisionBlock">
                      <span>Available decision outcomes</span>

                      <div className="decisionList">
                        {route.decisionModes.map((mode) => (
                          <strong key={mode}>{mode}</strong>
                        ))}
                      </div>
                    </div>

                    <div className="routeActions">
                      <Link
                        href="/ai-governance/build-a-route"
                        className="primaryAction"
                      >
                        Build Route →
                      </Link>

                      <Link
                        href="/ai-governance/playground"
                        className="secondaryAction"
                      >
                        Test in Playground
                      </Link>

                      <Link
                        href="/governance-library/governed-records"
                        className="secondaryAction"
                      >
                        Governed Records
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="emptyState">
              <div className="emptySeal">0</div>

              <h2>No routes match the current profile filters.</h2>

              <p>
                Reset the profile or broaden the route complexity and search
                criteria.
              </p>

              <button type="button" onClick={resetProfile}>
                Reset recommendation profile
              </button>
            </div>
          )}
        </section>

        <section className="routeModelSection">
          <p className="eyebrow gold">TA-14 ROUTE MODEL</p>

          <h2>
            Every recommended route should move from claimed governance to
            evidence-bound execution control.
          </h2>

          <div className="routeModelGrid">
            <article>
              <span>01</span>
              <strong>Define the governed reality</strong>
              <p>
                Identify the AI system, proposed action, affected entity,
                jurisdiction, role, and operational context.
              </p>
            </article>

            <article>
              <span>02</span>
              <strong>Establish authority</strong>
              <p>
                Connect applicable laws, standards, frameworks, policies, and
                internal authorities to the proposed activity.
              </p>
            </article>

            <article>
              <span>03</span>
              <strong>Specify required evidence</strong>
              <p>
                Determine what must be proven before the proposed execution can
                be considered admissible.
              </p>
            </article>

            <article>
              <span>04</span>
              <strong>Bind control conditions</strong>
              <p>
                Convert requirements into explicit gates, review paths,
                escalation conditions, and decision outcomes.
              </p>
            </article>

            <article>
              <span>05</span>
              <strong>Control execution</strong>
              <p>
                Permit, hold, deny, or escalate the proposed action according
                to the preserved evidence and governing conditions.
              </p>
            </article>

            <article>
              <span>06</span>
              <strong>Preserve the outcome</strong>
              <p>
                Record what happened, what changed, who acted, and whether the
                intended control produced the required result.
              </p>
            </article>
          </div>
        </section>

        <section className="admissibilitySection">
          <div className="admissibilitySeal">
            <span>AE</span>
            <small>Admissible execution</small>
          </div>

          <p className="eyebrow gold">RECOMMENDATION BOUNDARY</p>

          <h2>
            A recommended route becomes governance only when its evidence,
            authority, controls, and execution conditions are bound to the
            actual proposed action.
          </h2>

          <p>
            The route recommendation narrows the governing path. It does not
            replace applicability analysis, evidence validation, human review,
            system testing, or preserved outcome proof.
          </p>

          <div className="governingChain">
            <span>PROFILE</span>
            <strong>→</strong>
            <span>RECOMMENDATION</span>
            <strong>→</strong>
            <span>AUTHORITY</span>
            <strong>→</strong>
            <span>EVIDENCE</span>
            <strong>→</strong>
            <span>ADMISSIBILITY</span>
            <strong>→</strong>
            <span>EXECUTION</span>
            <strong>→</strong>
            <span>OUTCOME</span>
          </div>

          <div className="admissibilityActions">
            <Link
              href="/governance-library/applicability"
              className="secondaryAction"
            >
              Applicability
            </Link>

            <Link
              href="/governance-library/authorities"
              className="secondaryAction"
            >
              Authorities
            </Link>

            <Link
              href="/governance-library/crosswalks"
              className="secondaryAction"
            >
              Crosswalks
            </Link>

            <Link
              href="/ai-governance/build-a-route"
              className="primaryAction"
            >
              Build a Route →
            </Link>
          </div>
        </section>
      </div>

      <style jsx>{`
        .recommendationsPage {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          color: #f4fbff;
          background:
            radial-gradient(
              circle at 50% -10%,
              rgba(33, 154, 203, 0.18),
              transparent 36%
            ),
            radial-gradient(
              circle at 7% 44%,
              rgba(83, 225, 241, 0.06),
              transparent 26%
            ),
            radial-gradient(
              circle at 94% 74%,
              rgba(236, 180, 68, 0.06),
              transparent 28%
            ),
            linear-gradient(
              180deg,
              #04101b 0%,
              #020913 52%,
              #01060c 100%
            );
        }

        .backgroundGrid,
        .backgroundGlow {
          position: fixed;
          inset: 0;
          pointer-events: none;
        }

        .backgroundGrid {
          opacity: 0.16;
          background-image:
            linear-gradient(
              rgba(255, 255, 255, 0.018) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.018) 1px,
              transparent 1px
            );
          background-size: 48px 48px;
          mask-image: linear-gradient(to bottom, black, transparent 88%);
        }

        .glowOne {
          background: radial-gradient(
            circle at 17% 20%,
            rgba(99, 230, 255, 0.07),
            transparent 26%
          );
        }

        .glowTwo {
          background: radial-gradient(
            circle at 84% 55%,
            rgba(255, 196, 79, 0.05),
            transparent 24%
          );
        }

        .pageShell {
          position: relative;
          z-index: 2;
          width: min(1480px, calc(100% - 40px));
          margin: auto;
          padding: 24px 0 90px;
        }

        .topbar {
          padding: 12px;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 16px;
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 19px;
          background: linear-gradient(
            180deg,
            rgba(8, 26, 42, 0.88),
            rgba(4, 15, 26, 0.76)
          );
          box-shadow:
            0 16px 50px rgba(0, 0, 0, 0.28),
            inset 0 1px rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(18px);
        }

        .topbarLink,
        .topbarAction,
        .primaryAction,
        .secondaryAction {
          min-height: 44px;
          padding: 0 15px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 11px;
          text-decoration: none;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          transition:
            transform 0.22s,
            border-color 0.22s,
            background 0.22s;
        }

        .topbarLink {
          justify-self: start;
          color: #c4d5de;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(0, 0, 0, 0.18);
        }

        .topbarAction,
        .primaryAction {
          justify-self: end;
          color: #041a23;
          border: 1px solid #aaf2ff;
          background: linear-gradient(
            135deg,
            #d9fbff,
            #76deef 64%,
            #38aeca
          );
        }

        .secondaryAction {
          color: #c2d5dd;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(0, 0, 0, 0.18);
        }

        .topbarLink:hover,
        .topbarAction:hover,
        .primaryAction:hover,
        .secondaryAction:hover {
          transform: translateY(-2px);
        }

        .topbarStatus {
          display: flex;
          align-items: center;
          gap: 9px;
          color: #8fa9b6;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.13em;
          text-transform: uppercase;
        }

        .topbarStatus span {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #72e6b2;
          box-shadow: 0 0 15px rgba(114, 230, 178, 0.9);
        }

        .hero {
          max-width: 1160px;
          margin: auto;
          padding: 88px 0 72px;
          text-align: center;
        }

        .heroSeal,
        .definitionSeal,
        .admissibilitySeal {
          width: 106px;
          height: 106px;
          margin: 0 auto 27px;
          display: grid;
          place-items: center;
          align-content: center;
          gap: 3px;
          border: 1px solid rgba(255, 198, 82, 0.37);
          border-radius: 50%;
          background:
            radial-gradient(
              circle at 50% 35%,
              rgba(255, 220, 146, 0.16),
              transparent 36%
            ),
            rgba(4, 18, 30, 0.96);
          box-shadow:
            0 0 60px rgba(255, 193, 64, 0.09),
            inset 0 0 28px rgba(255, 255, 255, 0.03);
        }

        .heroSeal span,
        .definitionSeal span,
        .admissibilitySeal span {
          color: #ffe3a0;
          font: 900 30px Georgia, serif;
        }

        .heroSeal small,
        .definitionSeal small,
        .admissibilitySeal small {
          color: #8199a4;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.17em;
          text-transform: uppercase;
        }

        .eyebrow {
          margin: 0;
          color: #6fe8ff;
          font-size: 10px;
          font-weight: 950;
          letter-spacing: 0.21em;
          text-transform: uppercase;
        }

        .eyebrow.gold {
          color: #efbd59;
        }

        h1,
        h2,
        h3 {
          font-family: Georgia, "Times New Roman", serif;
        }

        .hero h1 {
          margin: 15px auto 0;
          font-size: clamp(52px, 6.3vw, 90px);
          line-height: 0.94;
          letter-spacing: -0.055em;
        }

        .hero h1 span {
          display: block;
          color: #9fb4bf;
          font-style: italic;
          font-weight: 500;
        }

        .lead {
          max-width: 960px;
          margin: 27px auto 0;
          color: #afc1ca;
          font-size: 18px;
          line-height: 1.75;
        }

        .heroMetrics {
          margin-top: 36px;
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 12px;
        }

        .heroMetrics article {
          padding: 18px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 16px;
          background: rgba(6, 20, 32, 0.58);
        }

        .heroMetrics span {
          display: block;
          color: #f0d28f;
          font: 700 27px Georgia, serif;
        }

        .heroMetrics small {
          display: block;
          margin-top: 5px;
          color: #788f9a;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.09em;
          text-transform: uppercase;
        }

        .definitionSection {
          padding: 34px;
          display: grid;
          grid-template-columns: auto 1.15fr 0.85fr;
          align-items: center;
          gap: 30px;
          border: 1px solid rgba(255, 198, 82, 0.17);
          border-radius: 25px;
          background:
            radial-gradient(
              circle at 0 50%,
              rgba(255, 190, 59, 0.07),
              transparent 30%
            ),
            rgba(5, 18, 30, 0.78);
        }

        .definitionSeal {
          width: 82px;
          height: 82px;
          margin: 0;
        }

        .definitionSeal span {
          font-size: 23px;
        }

        .definitionSeal small {
          font-size: 6px;
        }

        .definitionSection h2 {
          margin: 10px 0 0;
          font-size: clamp(31px, 3.2vw, 48px);
          line-height: 1.02;
          letter-spacing: -0.04em;
        }

        .definitionSection > p {
          margin: 0;
          color: #9fb2bb;
          font-size: 14px;
          line-height: 1.75;
        }

        .profileSection,
        .recommendationSection {
          padding-top: 82px;
        }

        .sectionHeading {
          margin-bottom: 31px;
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          align-items: end;
          gap: 40px;
        }

        .sectionHeading h2,
        .routeModelSection h2,
        .admissibilitySection h2 {
          margin: 11px 0 0;
          font-size: clamp(38px, 4.3vw, 64px);
          line-height: 0.99;
          letter-spacing: -0.047em;
        }

        .sectionHeading > p {
          margin: 0;
          color: #98adb7;
          font-size: 15px;
          line-height: 1.75;
        }

        .profilePanel {
          padding: 19px;
          display: grid;
          grid-template-columns:
            repeat(4, minmax(150px, 1fr))
            minmax(230px, 1.35fr)
            auto;
          align-items: end;
          gap: 12px;
          border: 1px solid rgba(99, 230, 255, 0.12);
          border-radius: 21px;
          background: linear-gradient(
            145deg,
            rgba(9, 29, 44, 0.95),
            rgba(3, 13, 22, 0.98)
          );
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.27);
        }

        label {
          display: grid;
          gap: 8px;
          color: #80a1af;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.09em;
          text-transform: uppercase;
        }

        input,
        select {
          width: 100%;
          min-height: 46px;
          box-sizing: border-box;
          padding: 0 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 11px;
          outline: none;
          color: #e8f2f5;
          background: rgba(0, 0, 0, 0.2);
          font: inherit;
          text-transform: none;
        }

        select option {
          color: #e8f2f5;
          background: #06131f;
        }

        input:focus,
        select:focus {
          border-color: rgba(99, 230, 255, 0.42);
          box-shadow: 0 0 0 3px rgba(99, 230, 255, 0.06);
        }

        .profilePanel button,
        .emptyState button {
          min-height: 46px;
          padding: 0 15px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 11px;
          color: #b5c7cf;
          background: rgba(0, 0, 0, 0.19);
          cursor: pointer;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.07em;
          text-transform: uppercase;
        }

        .objectivePanel {
          margin-top: 12px;
          padding: 18px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 18px;
          background: rgba(5, 18, 30, 0.72);
        }

        .objectiveHeading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .objectiveHeading span {
          display: block;
          color: #77ddea;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .objectiveHeading strong {
          display: block;
          margin-top: 5px;
          color: #a6b9c2;
          font-size: 11px;
        }

        .objectiveHeading small {
          color: #e4bf70;
          font-size: 8px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .objectiveGrid {
          margin-top: 14px;
          display: grid;
          grid-template-columns: repeat(6, minmax(0, 1fr));
          gap: 8px;
        }

        .objectiveGrid button {
          min-height: 46px;
          padding: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 11px;
          color: #91a9b4;
          background: rgba(0, 0, 0, 0.16);
          cursor: pointer;
          font-size: 8px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .objectiveGrid button span {
          color: #65ddea;
          font-size: 12px;
        }

        .objectiveGrid button.selectedObjective {
          border-color: rgba(99, 230, 255, 0.35);
          color: #d9f8fc;
          background: rgba(99, 230, 255, 0.08);
        }

        .profileSummary {
          margin-top: 12px;
          padding: 15px 17px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 16px;
          background: rgba(5, 18, 30, 0.66);
        }

        .profileSummary div {
          padding: 10px;
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 10px;
          background: rgba(0, 0, 0, 0.1);
        }

        .profileSummary span {
          display: block;
          color: #718a95;
          font-size: 7px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .profileSummary strong {
          display: block;
          margin-top: 5px;
          color: #efcb7f;
          font-size: 11px;
        }

        .routeGrid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
          align-items: start;
        }

        .routeCard {
          min-width: 0;
          padding: 24px;
          border: 1px solid rgba(99, 230, 255, 0.11);
          border-radius: 22px;
          background:
            radial-gradient(
              circle at 0 0,
              rgba(99, 230, 255, 0.05),
              transparent 28%
            ),
            linear-gradient(
              145deg,
              rgba(9, 29, 44, 0.95),
              rgba(3, 13, 22, 0.98)
            );
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.24);
        }

        .routeHeader {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .routeRank {
          width: 58px;
          height: 58px;
          display: grid;
          place-items: center;
          align-content: center;
          border: 1px solid rgba(255, 198, 82, 0.3);
          border-radius: 50%;
          background: rgba(255, 198, 82, 0.05);
        }

        .routeRank span {
          color: #f1ce83;
          font: 700 16px Georgia, serif;
        }

        .routeRank small {
          color: #7c8f98;
          font-size: 6px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .scoreBlock {
          text-align: right;
        }

        .scoreBlock strong {
          display: block;
          color: #7ce6ba;
          font: 700 28px Georgia, serif;
        }

        .scoreBlock span {
          display: block;
          color: #718a95;
          font-size: 7px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .scoreTrack {
          height: 5px;
          margin-top: 17px;
          overflow: hidden;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.05);
        }

        .scoreTrack span {
          display: block;
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(90deg, #42bed4, #7ee4b7);
        }

        .routeClass {
          margin: 20px 0 0;
          color: #70dce9;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .routeCard h3 {
          margin: 8px 0 0;
          color: #e9f2f5;
          font-size: 30px;
          line-height: 1.08;
        }

        .routeSummary {
          margin: 13px 0 0;
          color: #9aafb9;
          font-size: 12px;
          line-height: 1.68;
        }

        .routeMetrics {
          margin-top: 18px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
        }

        .routeMetrics div {
          padding: 11px;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 11px;
          background: rgba(0, 0, 0, 0.13);
        }

        .routeMetrics span {
          display: block;
          color: #6d8692;
          font-size: 6px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .routeMetrics strong {
          display: block;
          margin-top: 5px;
          color: #efca7d;
          font-size: 11px;
        }

        .matchBlock,
        .evidenceBlock,
        .decisionBlock {
          margin-top: 16px;
          padding: 14px;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 13px;
          background: rgba(0, 0, 0, 0.14);
        }

        .matchBlock > span,
        .evidenceBlock > span,
        .decisionBlock > span,
        .routeColumns > div > span {
          color: #6c8793;
          font-size: 7px;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .tagList,
        .decisionList {
          margin-top: 9px;
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .tagList strong,
        .decisionList strong {
          padding: 6px 8px;
          border: 1px solid rgba(99, 230, 255, 0.11);
          border-radius: 999px;
          color: #9fc4cd;
          background: rgba(99, 230, 255, 0.03);
          font-size: 7px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .decisionList strong {
          color: #edca80;
          border-color: rgba(255, 198, 82, 0.15);
          background: rgba(255, 198, 82, 0.04);
        }

        .routeColumns {
          margin-top: 16px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 9px;
        }

        .routeColumns > div {
          padding: 14px;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 13px;
          background: rgba(0, 0, 0, 0.14);
        }

        .routeColumns ul {
          margin: 10px 0 0;
          padding: 0;
          display: grid;
          gap: 7px;
          list-style: none;
        }

        .routeColumns li {
          position: relative;
          padding-left: 13px;
          color: #bdccd2;
          font-size: 9px;
          line-height: 1.4;
        }

        .routeColumns li::before {
          position: absolute;
          left: 0;
          color: #69dbe9;
          content: "•";
        }

        .evidenceGrid {
          margin-top: 9px;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 7px;
        }

        .evidenceGrid strong {
          padding: 9px;
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 9px;
          color: #b9c9cf;
          background: rgba(255, 255, 255, 0.012);
          font-size: 8px;
          line-height: 1.35;
        }

        .routeActions {
          margin-top: 18px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
        }

        .routeActions .primaryAction,
        .routeActions .secondaryAction {
          justify-self: stretch;
          padding: 0 10px;
          font-size: 8px;
          text-align: center;
        }

        .emptyState {
          padding: 72px 25px;
          border: 1px dashed rgba(255, 255, 255, 0.12);
          border-radius: 24px;
          background: rgba(5, 18, 30, 0.67);
          text-align: center;
        }

        .emptySeal {
          width: 70px;
          height: 70px;
          margin: auto;
          display: grid;
          place-items: center;
          border: 1px solid rgba(255, 198, 82, 0.25);
          border-radius: 50%;
          color: #efc66f;
          font: 700 24px Georgia, serif;
        }

        .emptyState h2 {
          margin: 20px 0 0;
          font-size: 29px;
        }

        .emptyState p {
          margin: 13px 0 0;
          color: #849aa5;
          font-size: 12px;
        }

        .emptyState button {
          margin-top: 20px;
        }

        .routeModelSection {
          margin-top: 88px;
          padding: 50px 34px;
          border: 1px solid rgba(99, 230, 255, 0.13);
          border-radius: 28px;
          background:
            radial-gradient(
              circle at 50% 0,
              rgba(99, 230, 255, 0.08),
              transparent 39%
            ),
            rgba(4, 16, 27, 0.88);
          text-align: center;
        }

        .routeModelSection h2 {
          max-width: 1050px;
          margin-left: auto;
          margin-right: auto;
        }

        .routeModelGrid {
          margin-top: 32px;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
        }

        .routeModelGrid article {
          padding: 21px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 16px;
          background: rgba(0, 0, 0, 0.16);
          text-align: left;
        }

        .routeModelGrid article > span {
          color: #efc66f;
          font: 700 18px Georgia, serif;
        }

        .routeModelGrid strong {
          display: block;
          margin-top: 10px;
          color: #dce8ec;
          font-size: 12px;
        }

        .routeModelGrid p {
          margin: 8px 0 0;
          color: #879ea8;
          font-size: 10px;
          line-height: 1.55;
        }

        .admissibilitySection {
          margin-top: 88px;
          padding: 56px 34px;
          border: 1px solid rgba(255, 197, 82, 0.24);
          border-radius: 31px;
          background:
            radial-gradient(
              circle at 50% 0,
              rgba(255, 185, 44, 0.12),
              transparent 42%
            ),
            linear-gradient(
              180deg,
              rgba(8, 20, 33, 0.97),
              rgba(3, 10, 18, 0.99)
            );
          box-shadow:
            0 28px 78px rgba(0, 0, 0, 0.35),
            inset 0 1px rgba(255, 255, 255, 0.025);
          text-align: center;
        }

        .admissibilitySeal {
          width: 82px;
          height: 82px;
          margin-bottom: 22px;
        }

        .admissibilitySeal span {
          font-size: 23px;
        }

        .admissibilitySeal small {
          font-size: 6px;
        }

        .admissibilitySection h2 {
          max-width: 1060px;
          margin: 14px auto 0;
        }

        .admissibilitySection > p:not(.eyebrow) {
          max-width: 1010px;
          margin: 23px auto 0;
          color: #a4b4bc;
          font-size: 15px;
          line-height: 1.78;
        }

        .governingChain {
          max-width: 1180px;
          margin: 29px auto 0;
          padding: 17px;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          gap: 10px;
          border: 1px solid rgba(99, 230, 255, 0.11);
          border-radius: 15px;
          background: rgba(0, 0, 0, 0.17);
        }

        .governingChain span {
          color: #acd3dc;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.08em;
        }

        .governingChain strong {
          color: #dfb65c;
          font-size: 12px;
        }

        .admissibilityActions {
          margin-top: 29px;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 10px;
        }

        @media (max-width: 1280px) {
          .profilePanel {
            grid-template-columns: repeat(3, 1fr);
          }

          .searchField {
            grid-column: span 2;
          }

          .objectiveGrid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 1180px) {
          .heroMetrics {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }

          .definitionSection {
            grid-template-columns: auto 1fr;
          }

          .definitionSection > p {
            grid-column: 1 / -1;
          }

          .routeGrid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 900px) {
          .topbar {
            grid-template-columns: 1fr 1fr;
          }

          .topbarStatus {
            display: none;
          }

          .sectionHeading {
            grid-template-columns: 1fr;
          }

          .profilePanel {
            grid-template-columns: 1fr 1fr;
          }

          .searchField {
            grid-column: span 2;
          }

          .routeModelGrid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 680px) {
          .pageShell {
            width: calc(100% - 22px);
          }

          .topbar,
          .heroMetrics,
          .definitionSection,
          .profilePanel,
          .objectiveGrid,
          .profileSummary,
          .routeMetrics,
          .routeColumns,
          .evidenceGrid,
          .routeActions,
          .routeModelGrid {
            grid-template-columns: 1fr;
          }

          .searchField {
            grid-column: auto;
          }

          .topbarLink,
          .topbarAction {
            justify-self: stretch;
          }

          .hero {
            padding: 62px 0;
          }

          .hero h1 {
            font-size: clamp(45px, 14vw, 68px);
          }

          .definitionSeal {
            margin: auto;
          }

          .definitionSection {
            text-align: center;
          }

          .objectiveHeading {
            align-items: flex-start;
            flex-direction: column;
          }

          .routeModelSection,
          .admissibilitySection {
            padding: 30px 20px;
          }

          .admissibilityActions {
            align-items: stretch;
            flex-direction: column;
          }

          .primaryAction,
          .secondaryAction {
            width: 100%;
          }
        }
      `}</style>
    </main>
  );
}
