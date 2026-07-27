"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type AuthorityResult = {
  id: string;
  name: string;
  className: string;
  status: "Likely Applicable" | "Review Required" | "Supporting Authority";
  why: string;
  evidence: string[];
  route: string;
  sourceHref: string;
  conditions: string[];
};

type DeterminationProfile = {
  role: string;
  jurisdiction: string;
  systemType: string;
  deployment: string;
  sector: string;
  impact: string;
  personalData: string;
  decisionEffect: string;
};

const initialProfile: DeterminationProfile = {
  role: "Provider",
  jurisdiction: "European Union",
  systemType: "High-Risk AI",
  deployment: "Customer Facing",
  sector: "General Enterprise",
  impact: "High",
  personalData: "Yes",
  decisionEffect: "Materially affects people",
};

const authorityCatalog: AuthorityResult[] = [
  {
    id: "eu-ai-act",
    name: "EU AI Act",
    className: "Binding Regulation",
    status: "Likely Applicable",
    why:
      "The selected profile indicates an AI system operating in or affecting the European Union, with a provider or deployer role and potential high-risk characteristics.",
    evidence: [
      "System Classification Record",
      "Technical Documentation",
      "Risk Management Record",
      "Data Governance Record",
      "Human Oversight Plan",
      "Accuracy and Robustness Evidence",
      "Logging and Traceability Record",
      "Post-Market Monitoring Plan",
    ],
    route: "TA-14 EU AI Act Admissibility Route",
    sourceHref: "/governance-library/regulations",
    conditions: [
      "European Union jurisdiction",
      "Provider or deployer role",
      "High-risk or regulated system profile",
    ],
  },
  {
    id: "iso-42001",
    name: "ISO/IEC 42001",
    className: "Management System Standard",
    status: "Supporting Authority",
    why:
      "The organization is developing, providing, integrating, or deploying AI and may benefit from a formal AI management system with defined governance responsibilities and review controls.",
    evidence: [
      "AI Policy",
      "Governance Roles",
      "AI Objectives",
      "Risk Treatment Plan",
      "Operational Controls",
      "Performance Evaluation",
      "Internal Audit Record",
      "Management Review Record",
    ],
    route: "TA-14 AI Management System Route",
    sourceHref: "/governance-library/standards",
    conditions: [
      "Organizational AI governance",
      "Management-system approach",
      "Repeatable oversight and review",
    ],
  },
  {
    id: "nist-ai-rmf",
    name: "NIST AI Risk Management Framework",
    className: "Voluntary Risk Framework",
    status: "Supporting Authority",
    why:
      "The selected profile requires structured risk identification, mapping, measurement, monitoring, and management across the AI lifecycle.",
    evidence: [
      "AI Risk Register",
      "Context Mapping",
      "Impact Assessment",
      "Validation Results",
      "Monitoring Record",
      "Testing Record",
      "Risk Acceptance Record",
      "Incident Response Plan",
    ],
    route: "TA-14 Risk and Evidence Route",
    sourceHref: "/governance-library/frameworks",
    conditions: [
      "Risk management objective",
      "Trustworthiness assessment",
      "Lifecycle monitoring",
    ],
  },
  {
    id: "iso-23894",
    name: "ISO/IEC 23894",
    className: "Risk Management Guidance",
    status: "Supporting Authority",
    why:
      "The profile indicates elevated AI risk requiring a documented process for identifying, analyzing, evaluating, treating, and monitoring risk.",
    evidence: [
      "Risk Identification Record",
      "Risk Analysis",
      "Risk Evaluation",
      "Risk Treatment Decision",
      "Residual Risk Record",
      "Monitoring Criteria",
    ],
    route: "TA-14 AI Risk Treatment Route",
    sourceHref: "/governance-library/standards",
    conditions: [
      "Medium or high impact",
      "Documented risk treatment",
      "Residual risk review",
    ],
  },
  {
    id: "iso-38507",
    name: "ISO/IEC 38507",
    className: "Governing-Body Guidance",
    status: "Review Required",
    why:
      "The use of AI may create governing-body responsibilities involving accountability, strategic alignment, authority, oversight, and organizational assurance.",
    evidence: [
      "Board Oversight Record",
      "Authority Assignment",
      "Accountability Matrix",
      "Strategic Alignment Record",
      "Executive Review",
      "Governance Assurance Record",
    ],
    route: "TA-14 Governing Authority Route",
    sourceHref: "/governance-library/standards",
    conditions: [
      "Material organizational impact",
      "Executive or board oversight",
      "Delegated AI authority",
    ],
  },
  {
    id: "oecd",
    name: "OECD AI Principles",
    className: "International Principles",
    status: "Supporting Authority",
    why:
      "The selected system may require broader trustworthy-AI considerations involving transparency, robustness, accountability, human-centered values, and inclusive benefit.",
    evidence: [
      "Transparency Statement",
      "Accountability Record",
      "Human-Centered Impact Review",
      "Robustness Evidence",
      "Responsible Stewardship Record",
    ],
    route: "TA-14 Trustworthy AI Principles Route",
    sourceHref: "/governance-library/principles",
    conditions: [
      "International governance context",
      "Trustworthy AI commitments",
      "Public-interest considerations",
    ],
  },
];

function determineAuthorities(
  profile: DeterminationProfile,
): AuthorityResult[] {
  const selected = new Map<string, AuthorityResult>();

  const addAuthority = (id: string) => {
    const authority = authorityCatalog.find(
      (item) => item.id === id,
    );

    if (authority) {
      selected.set(id, authority);
    }
  };

  if (
    profile.jurisdiction === "European Union" ||
    profile.jurisdiction === "Global"
  ) {
    addAuthority("eu-ai-act");
  }

  addAuthority("iso-42001");
  addAuthority("nist-ai-rmf");

  if (
    profile.impact === "High" ||
    profile.impact === "Medium" ||
    profile.systemType === "High-Risk AI"
  ) {
    addAuthority("iso-23894");
  }

  if (
    profile.impact === "High" ||
    profile.decisionEffect === "Materially affects people" ||
    profile.deployment === "Public"
  ) {
    addAuthority("iso-38507");
  }

  if (
    profile.jurisdiction === "Global" ||
    profile.deployment === "Public" ||
    profile.decisionEffect === "Materially affects people"
  ) {
    addAuthority("oecd");
  }

  return Array.from(selected.values());
}

export default function ApplicabilityEnginePage() {
  const [profile, setProfile] =
    useState<DeterminationProfile>(initialProfile);

  const [hasDetermined, setHasDetermined] = useState(false);

  const results = useMemo(
    () => determineAuthorities(profile),
    [profile],
  );

  const updateProfile = (
    field: keyof DeterminationProfile,
    value: string,
  ) => {
    setProfile((current) => ({
      ...current,
      [field]: value,
    }));

    setHasDetermined(false);
  };

  const resetProfile = () => {
    setProfile(initialProfile);
    setHasDetermined(false);
  };

  return (
    <main className="applicabilityPage">
      <div className="backgroundGrid" />
      <div className="backgroundGlow glowOne" />
      <div className="backgroundGlow glowTwo" />

      <div className="pageShell">
        <div className="topbar">
          <Link
            href="/governance-library"
            className="topbarLink"
          >
            ← Governance Library
          </Link>

          <div className="topbarStatus">
            <span />
            Applicability determination workspace
          </div>

          <Link
            href="/workspace/ai-governance"
            className="topbarAction"
          >
            Open Route Builder →
          </Link>
        </div>

        <header className="hero">
          <div className="heroMark">
            <div className="heroRing ringOne" />
            <div className="heroRing ringTwo" />

            <div className="heroSeal">
              <span>AE</span>
              <small>TA-14</small>
            </div>
          </div>

          <p className="eyebrow">
            TA-14 AI GOVERNANCE LIBRARY
          </p>

          <h1>
            AI Governance
            <span> Applicability Engine</span>
          </h1>

          <p className="lead">
            Build a preliminary governance profile before execution.
            The engine identifies likely authorities, review
            conditions, evidence expectations, and the TA-14 route
            most closely aligned with the declared system context.
          </p>

          <div className="boundaryNotice">
            <strong>Determination boundary</strong>

            <p>
              This engine produces a preliminary applicability
              assessment. It does not provide legal advice,
              certification, conformity assessment, or a final
              regulatory determination.
            </p>
          </div>
        </header>

        <section className="workflow">
          <div className="sectionHeading">
            <div>
              <p className="eyebrow">
                STEP 01 · DECLARE THE SYSTEM CONTEXT
              </p>

              <h2>
                Establish the facts before selecting authority.
              </h2>
            </div>

            <p>
              Applicability depends on who is acting, where the
              system operates, what the system does, who it affects,
              and the consequences of its decisions.
            </p>
          </div>

          <div className="profilePanel">
            <div className="profileGrid">
              <label>
                <span>Organization Role</span>

                <select
                  value={profile.role}
                  onChange={(event) =>
                    updateProfile("role", event.target.value)
                  }
                >
                  <option>Provider</option>
                  <option>Deployer</option>
                  <option>Integrator</option>
                  <option>Distributor</option>
                  <option>Importer</option>
                  <option>Customer</option>
                  <option>Public Authority</option>
                </select>
              </label>

              <label>
                <span>Primary Jurisdiction</span>

                <select
                  value={profile.jurisdiction}
                  onChange={(event) =>
                    updateProfile(
                      "jurisdiction",
                      event.target.value,
                    )
                  }
                >
                  <option>European Union</option>
                  <option>United States</option>
                  <option>United Kingdom</option>
                  <option>Canada</option>
                  <option>Global</option>
                  <option>Other</option>
                </select>
              </label>

              <label>
                <span>AI System Classification</span>

                <select
                  value={profile.systemType}
                  onChange={(event) =>
                    updateProfile(
                      "systemType",
                      event.target.value,
                    )
                  }
                >
                  <option>High-Risk AI</option>
                  <option>General-Purpose AI</option>
                  <option>Foundation Model</option>
                  <option>Decision Support System</option>
                  <option>Autonomous Agent</option>
                  <option>Embedded AI System</option>
                  <option>Unknown or Undetermined</option>
                </select>
              </label>

              <label>
                <span>Deployment Context</span>

                <select
                  value={profile.deployment}
                  onChange={(event) =>
                    updateProfile(
                      "deployment",
                      event.target.value,
                    )
                  }
                >
                  <option>Customer Facing</option>
                  <option>Internal</option>
                  <option>Public</option>
                  <option>Government</option>
                  <option>Critical Infrastructure</option>
                  <option>Research or Testing</option>
                </select>
              </label>

              <label>
                <span>Sector</span>

                <select
                  value={profile.sector}
                  onChange={(event) =>
                    updateProfile("sector", event.target.value)
                  }
                >
                  <option>General Enterprise</option>
                  <option>Healthcare</option>
                  <option>Financial Services</option>
                  <option>Employment</option>
                  <option>Education</option>
                  <option>Buildings and Infrastructure</option>
                  <option>Insurance</option>
                  <option>Public Services</option>
                  <option>Law Enforcement</option>
                  <option>Manufacturing</option>
                </select>
              </label>

              <label>
                <span>Potential Impact</span>

                <select
                  value={profile.impact}
                  onChange={(event) =>
                    updateProfile("impact", event.target.value)
                  }
                >
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                  <option>Undetermined</option>
                </select>
              </label>

              <label>
                <span>Personal Data Processing</span>

                <select
                  value={profile.personalData}
                  onChange={(event) =>
                    updateProfile(
                      "personalData",
                      event.target.value,
                    )
                  }
                >
                  <option>Yes</option>
                  <option>No</option>
                  <option>Unknown</option>
                </select>
              </label>

              <label>
                <span>Decision Effect</span>

                <select
                  value={profile.decisionEffect}
                  onChange={(event) =>
                    updateProfile(
                      "decisionEffect",
                      event.target.value,
                    )
                  }
                >
                  <option>Materially affects people</option>
                  <option>Advisory only</option>
                  <option>Operational automation</option>
                  <option>No direct human effect</option>
                  <option>Undetermined</option>
                </select>
              </label>
            </div>

            <div className="profileActions">
              <button
                type="button"
                className="determineButton"
                onClick={() => setHasDetermined(true)}
              >
                Determine Likely Applicability →
              </button>

              <button
                type="button"
                className="resetButton"
                onClick={resetProfile}
              >
                Reset Profile
              </button>
            </div>
          </div>
        </section>

        <section className="declaredProfile">
          <div className="sectionHeading compact">
            <div>
              <p className="eyebrow">
                DECLARED PROFILE
              </p>

              <h2>
                The facts currently driving the determination.
              </h2>
            </div>
          </div>

          <div className="profileSummary">
            {Object.entries(profile).map(([field, value]) => (
              <article key={field}>
                <span>
                  {field
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (character) =>
                      character.toUpperCase(),
                    )}
                </span>

                <strong>{value}</strong>
              </article>
            ))}
          </div>
        </section>

        <section className="resultsSection">
          <div className="sectionHeading">
            <div>
              <p className="eyebrow">
                STEP 02 · PRELIMINARY DETERMINATION
              </p>

              <h2>
                Likely applicable governance authorities.
              </h2>
            </div>

            <p>
              Each result identifies why the authority may apply,
              what conditions triggered the result, the evidence
              likely required, and the recommended TA-14 route.
            </p>
          </div>

          {!hasDetermined ? (
            <div className="pendingState">
              <span>Determination not yet committed</span>

              <h3>
                Review the declared profile, then run the engine.
              </h3>

              <p>
                Results remain provisional until the applicability
                action is executed.
              </p>
            </div>
          ) : (
            <>
              <div className="resultSummary">
                <article>
                  <span>{results.length}</span>
                  <small>Authorities identified</small>
                </article>

                <article>
                  <span>
                    {
                      results.filter(
                        (result) =>
                          result.status ===
                          "Likely Applicable",
                      ).length
                    }
                  </span>
                  <small>Likely applicable</small>
                </article>

                <article>
                  <span>
                    {
                      results.filter(
                        (result) =>
                          result.status ===
                          "Review Required",
                      ).length
                    }
                  </span>
                  <small>Require review</small>
                </article>

                <article>
                  <span>
                    {
                      results.filter(
                        (result) =>
                          result.status ===
                          "Supporting Authority",
                      ).length
                    }
                  </span>
                  <small>Supporting authorities</small>
                </article>
              </div>

              <div className="resultsList">
                {results.map((authority, index) => (
                  <article
                    className="authorityCard"
                    key={authority.id}
                  >
                    <div className="authorityTop">
                      <div className="authorityIdentity">
                        <span className="authorityNumber">
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        <div>
                          <p>{authority.className}</p>
                          <h3>{authority.name}</h3>
                        </div>
                      </div>

                      <span
                        className={`statusBadge ${authority.status
                          .toLowerCase()
                          .replaceAll(" ", "-")}`}
                      >
                        {authority.status}
                      </span>
                    </div>

                    <div className="authorityBody">
                      <div className="authorityReason">
                        <h4>Why it appears</h4>
                        <p>{authority.why}</p>

                        <h4>Trigger conditions</h4>

                        <div className="conditionList">
                          {authority.conditions.map(
                            (condition) => (
                              <span key={condition}>
                                {condition}
                              </span>
                            ),
                          )}
                        </div>
                      </div>

                      <div className="evidencePanel">
                        <h4>Recommended evidence</h4>

                        <div className="evidenceList">
                          {authority.evidence.map(
                            (evidence) => (
                              <div
                                className="evidenceItem"
                                key={evidence}
                              >
                                <span aria-hidden="true">◆</span>
                                <strong>{evidence}</strong>
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="routeRecommendation">
                      <div>
                        <span>Recommended TA-14 route</span>
                        <strong>{authority.route}</strong>
                      </div>

                      <div className="cardActions">
                        <Link
                          href={authority.sourceHref}
                          className="secondaryAction"
                        >
                          Open Source Department
                        </Link>

                        <Link
                          href="/governance-library/compare"
                          className="secondaryAction"
                        >
                          Compare Authority
                        </Link>

                        <Link
                          href="/workspace/ai-governance"
                          className="primaryAction"
                        >
                          Build TA-14 Route →
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </section>

        <section className="determinationBoundary">
          <div className="boundarySeal">
            <span>DB</span>
            <small>Determination boundary</small>
          </div>

          <p className="eyebrow gold">
            APPLICABILITY AND AUTHORITY BOUNDARY
          </p>

          <h2>
            A likely match is not yet an admissible determination.
          </h2>

          <p>
            Final applicability requires verified facts, current
            source versions, jurisdictional review, actor-role
            confirmation, system classification, documented
            interpretation, and an authorized determination. The
            engine organizes the review. It does not replace it.
          </p>

          <div className="boundaryGrid">
            <article>
              <span>ENGINE OUTPUT</span>
              <strong>
                Preliminary authority and evidence mapping
              </strong>
            </article>

            <article>
              <span>NOT YET PROVED</span>
              <strong>
                Final legal applicability or conformity
              </strong>
            </article>

            <article>
              <span>NEXT CONTROL</span>
              <strong>
                Authorized review and admissible route creation
              </strong>
            </article>
          </div>

          <div className="boundaryActions">
            <Link
              href="/governance-library/authorities"
              className="secondaryAction"
            >
              Review Source Authorities
            </Link>

            <Link
              href="/governance-library/crosswalks"
              className="secondaryAction"
            >
              Open Crosswalk Engine
            </Link>

            <Link
              href="/workspace/ai-governance"
              className="primaryAction"
            >
              Build the Execution Route →
            </Link>
          </div>
        </section>
      </div>

      <style jsx>{`
        .applicabilityPage {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          color: #f7fbff;
          background:
            radial-gradient(
              circle at 50% -10%,
              rgba(34, 133, 183, 0.17),
              transparent 35%
            ),
            radial-gradient(
              circle at 8% 42%,
              rgba(83, 220, 241, 0.07),
              transparent 25%
            ),
            radial-gradient(
              circle at 92% 70%,
              rgba(236, 179, 68, 0.07),
              transparent 27%
            ),
            linear-gradient(
              180deg,
              #04101b 0%,
              #020913 50%,
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
          mask-image: linear-gradient(
            to bottom,
            black,
            transparent 84%
          );
        }

        .glowOne {
          background: radial-gradient(
            circle at 16% 18%,
            rgba(91, 224, 246, 0.07),
            transparent 25%
          );
        }

        .glowTwo {
          background: radial-gradient(
            circle at 84% 46%,
            rgba(255, 197, 82, 0.055),
            transparent 24%
          );
        }

        .pageShell {
          position: relative;
          z-index: 2;
          width: min(1420px, calc(100% - 40px));
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
        .secondaryAction,
        .primaryAction {
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

        .topbarLink:hover,
        .topbarAction:hover,
        .secondaryAction:hover,
        .primaryAction:hover {
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
          max-width: 1050px;
          margin: auto;
          padding: 90px 0 72px;
          text-align: center;
        }

        .heroMark {
          position: relative;
          width: 146px;
          height: 146px;
          margin: 0 auto 28px;
          display: grid;
          place-items: center;
        }

        .heroRing {
          position: absolute;
          inset: 0;
          border: 1px solid rgba(99, 230, 255, 0.18);
          border-radius: 50%;
        }

        .ringOne {
          transform: rotate(18deg) scaleX(1.15);
        }

        .ringTwo {
          transform: rotate(-30deg) scaleY(1.11);
          border-color: rgba(255, 199, 82, 0.15);
        }

        .heroSeal {
          position: relative;
          z-index: 2;
          width: 108px;
          height: 108px;
          display: grid;
          place-items: center;
          align-content: center;
          gap: 3px;
          border: 1px solid rgba(255, 199, 82, 0.4);
          border-radius: 50%;
          background:
            radial-gradient(
              circle at 50% 35%,
              rgba(255, 220, 146, 0.17),
              transparent 34%
            ),
            rgba(4, 18, 30, 0.96);
          box-shadow:
            0 0 60px rgba(255, 193, 64, 0.1),
            inset 0 0 28px rgba(255, 255, 255, 0.03);
        }

        .heroSeal span {
          color: #ffe5a0;
          font: 900 31px Georgia, serif;
        }

        .heroSeal small {
          color: #8da6b2;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.19em;
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
        h3,
        h4 {
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
          max-width: 900px;
          margin: 27px auto 0;
          color: #afc1ca;
          font-size: 18px;
          line-height: 1.75;
        }

        .boundaryNotice {
          max-width: 850px;
          margin: 32px auto 0;
          padding: 18px 21px;
          display: grid;
          grid-template-columns: auto 1fr;
          align-items: center;
          gap: 18px;
          border: 1px solid rgba(255, 197, 82, 0.18);
          border-radius: 16px;
          background: rgba(255, 185, 44, 0.045);
          text-align: left;
        }

        .boundaryNotice strong {
          color: #efc56e;
          font-size: 10px;
          letter-spacing: 0.09em;
          text-transform: uppercase;
        }

        .boundaryNotice p {
          margin: 0;
          color: #9cafb8;
          font-size: 13px;
          line-height: 1.6;
        }

        .workflow,
        .declaredProfile,
        .resultsSection {
          padding-top: 80px;
        }

        .sectionHeading {
          margin-bottom: 31px;
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          align-items: end;
          gap: 40px;
        }

        .sectionHeading.compact {
          grid-template-columns: 1fr;
        }

        .sectionHeading h2,
        .determinationBoundary h2 {
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
          padding: 28px;
          border: 1px solid rgba(99, 230, 255, 0.14);
          border-radius: 27px;
          background:
            radial-gradient(
              circle at 0 0,
              rgba(99, 230, 255, 0.07),
              transparent 29%
            ),
            linear-gradient(
              145deg,
              rgba(10, 31, 47, 0.94),
              rgba(4, 14, 24, 0.98)
            );
          box-shadow: 0 26px 66px rgba(0, 0, 0, 0.28);
        }

        .profileGrid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 16px;
        }

        .profileGrid label {
          display: flex;
          flex-direction: column;
          gap: 9px;
        }

        .profileGrid label span {
          color: #9db1bb;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .profileGrid select {
          width: 100%;
          min-height: 52px;
          padding: 0 13px;
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 12px;
          outline: none;
          color: #edf8fb;
          background: #071421;
          font: inherit;
          font-size: 13px;
        }

        .profileGrid select:focus {
          border-color: rgba(99, 230, 255, 0.55);
          box-shadow: 0 0 0 3px rgba(99, 230, 255, 0.08);
        }

        .profileActions {
          margin-top: 24px;
          padding-top: 22px;
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
        }

        .determineButton,
        .resetButton {
          min-height: 48px;
          padding: 0 18px;
          border-radius: 11px;
          cursor: pointer;
          font: inherit;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          transition:
            transform 0.22s,
            border-color 0.22s;
        }

        .determineButton {
          border: 1px solid #aaf2ff;
          color: #041a23;
          background: linear-gradient(
            135deg,
            #d9fbff,
            #76deef 64%,
            #38aeca
          );
        }

        .resetButton {
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #c2d3dc;
          background: rgba(0, 0, 0, 0.18);
        }

        .determineButton:hover,
        .resetButton:hover {
          transform: translateY(-2px);
        }

        .profileSummary {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 12px;
        }

        .profileSummary article {
          padding: 18px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 15px;
          background: rgba(5, 18, 29, 0.72);
        }

        .profileSummary span {
          display: block;
          color: #6f8793;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.09em;
          text-transform: uppercase;
        }

        .profileSummary strong {
          display: block;
          margin-top: 8px;
          color: #dce9ed;
          font-size: 12px;
          line-height: 1.4;
        }

        .pendingState {
          padding: 56px 30px;
          border: 1px dashed rgba(99, 230, 255, 0.24);
          border-radius: 24px;
          background: rgba(5, 18, 29, 0.55);
          text-align: center;
        }

        .pendingState span {
          color: #72def0;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .pendingState h3 {
          margin: 13px 0 0;
          font-size: 31px;
        }

        .pendingState p {
          margin: 12px 0 0;
          color: #8fa4af;
        }

        .resultSummary {
          margin-bottom: 20px;
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 12px;
        }

        .resultSummary article {
          padding: 18px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 16px;
          background: rgba(5, 18, 29, 0.68);
          text-align: center;
        }

        .resultSummary span {
          display: block;
          color: #f0d28f;
          font: 700 27px Georgia, serif;
        }

        .resultSummary small {
          display: block;
          margin-top: 5px;
          color: #758c97;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .resultsList {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .authorityCard {
          padding: 27px;
          border: 1px solid rgba(99, 230, 255, 0.13);
          border-radius: 27px;
          background:
            radial-gradient(
              circle at 100% 0,
              rgba(99, 230, 255, 0.06),
              transparent 28%
            ),
            linear-gradient(
              145deg,
              rgba(10, 31, 47, 0.95),
              rgba(4, 14, 24, 0.98)
            );
          box-shadow:
            0 24px 58px rgba(0, 0, 0, 0.28),
            inset 0 1px rgba(255, 255, 255, 0.025);
        }

        .authorityTop {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 18px;
        }

        .authorityIdentity {
          display: flex;
          align-items: center;
          gap: 17px;
        }

        .authorityNumber {
          flex: 0 0 60px;
          width: 60px;
          height: 60px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(99, 230, 255, 0.32);
          border-radius: 16px;
          color: #73e5f7;
          background: rgba(0, 0, 0, 0.2);
          font-size: 13px;
          font-weight: 900;
        }

        .authorityIdentity p {
          margin: 0;
          color: #6ecfe0;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.13em;
          text-transform: uppercase;
        }

        .authorityIdentity h3 {
          margin: 7px 0 0;
          font-size: 33px;
          line-height: 1;
        }

        .statusBadge {
          padding: 9px 11px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 999px;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.09em;
          text-transform: uppercase;
        }

        .likely-applicable {
          color: #8ff4c6;
          border-color: rgba(114, 230, 178, 0.3);
          background: rgba(114, 230, 178, 0.08);
        }

        .review-required {
          color: #ffd580;
          border-color: rgba(255, 197, 82, 0.3);
          background: rgba(255, 197, 82, 0.08);
        }

        .supporting-authority {
          color: #9adff0;
          border-color: rgba(99, 230, 255, 0.27);
          background: rgba(99, 230, 255, 0.07);
        }

        .authorityBody {
          margin-top: 25px;
          display: grid;
          grid-template-columns: 0.95fr 1.05fr;
          gap: 28px;
        }

        .authorityReason,
        .evidencePanel {
          padding: 21px;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 17px;
          background: rgba(0, 0, 0, 0.16);
        }

        .authorityBody h4 {
          margin: 0;
          color: #f0d28f;
          font-size: 14px;
        }

        .authorityReason p {
          margin: 11px 0 20px;
          color: #9fb2bb;
          font-size: 14px;
          line-height: 1.68;
        }

        .conditionList {
          margin-top: 12px;
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .conditionList span {
          padding: 8px 10px;
          border: 1px solid rgba(99, 230, 255, 0.13);
          border-radius: 999px;
          color: #9fddea;
          background: rgba(99, 230, 255, 0.045);
          font-size: 9px;
          font-weight: 800;
        }

        .evidenceList {
          margin-top: 15px;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 9px;
        }

        .evidenceItem {
          min-height: 48px;
          padding: 10px 12px;
          display: flex;
          align-items: center;
          gap: 10px;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 11px;
          background: rgba(5, 18, 29, 0.66);
        }

        .evidenceItem span {
          color: #69dff2;
          font-size: 8px;
        }

        .evidenceItem strong {
          color: #cbdbe1;
          font-size: 10px;
          line-height: 1.35;
        }

        .routeRecommendation {
          margin-top: 22px;
          padding-top: 22px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
        }

        .routeRecommendation > div:first-child span {
          display: block;
          color: #728995;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .routeRecommendation > div:first-child strong {
          display: block;
          margin-top: 7px;
          color: #f0d28f;
          font-size: 13px;
        }

        .cardActions,
        .boundaryActions {
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-end;
          gap: 10px;
        }

        .secondaryAction {
          color: #c2d5dd;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(0, 0, 0, 0.18);
        }

        .determinationBoundary {
          position: relative;
          margin-top: 88px;
          padding: 56px 34px;
          overflow: hidden;
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

        .boundarySeal {
          width: 82px;
          height: 82px;
          margin: 0 auto 22px;
          display: grid;
          place-items: center;
          align-content: center;
          gap: 3px;
          border: 1px solid rgba(255, 197, 82, 0.32);
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.18);
        }

        .boundarySeal span {
          color: #f2ca75;
          font: 700 23px Georgia, serif;
        }

        .boundarySeal small {
          color: #788b94;
          font-size: 6px;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .determinationBoundary h2 {
          max-width: 1020px;
          margin: 14px auto 0;
        }

        .determinationBoundary > p:not(.eyebrow) {
          max-width: 960px;
          margin: 23px auto 0;
          color: #a4b4bc;
          font-size: 15px;
          line-height: 1.78;
        }

        .boundaryGrid {
          max-width: 1060px;
          margin: 31px auto 0;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .boundaryGrid article {
          padding: 20px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 16px;
          background: rgba(0, 0, 0, 0.17);
        }

        .boundaryGrid span {
          display: block;
          color: #e3b759;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.12em;
        }

        .boundaryGrid strong {
          display: block;
          margin-top: 9px;
          color: #d9e4e8;
          font-size: 12px;
          line-height: 1.45;
        }

        .boundaryActions {
          margin-top: 29px;
          justify-content: center;
        }

        @media (max-width: 1120px) {
          .profileGrid,
          .profileSummary {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .authorityBody {
            grid-template-columns: 1fr;
          }

          .routeRecommendation {
            align-items: flex-start;
            flex-direction: column;
          }

          .cardActions {
            justify-content: flex-start;
          }
        }

        @media (max-width: 880px) {
          .topbar {
            grid-template-columns: 1fr 1fr;
          }

          .topbarStatus {
            display: none;
          }

          .sectionHeading {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .resultSummary,
          .boundaryGrid {
            grid-template-columns: repeat(2, 1fr);
          }

          .boundaryNotice {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 620px) {
          .pageShell {
            width: calc(100% - 22px);
          }

          .topbar {
            grid-template-columns: 1fr;
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

          .profileGrid,
          .profileSummary,
          .resultSummary,
          .boundaryGrid,
          .evidenceList {
            grid-template-columns: 1fr;
          }

          .profilePanel,
          .authorityCard,
          .determinationBoundary {
            padding: 22px;
          }

          .authorityTop {
            flex-direction: column;
          }

          .routeRecommendation,
          .cardActions,
          .boundaryActions {
            align-items: stretch;
            flex-direction: column;
          }

          .secondaryAction,
          .primaryAction {
            width: 100%;
          }
        }
      `}</style>
    </main>
  );
}
