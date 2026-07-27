import Link from "next/link";
import {
  getGovernanceLibraryStatistics,
  getCategoryCounts,
  getJurisdictionCounts,
} from "../../../lib/governance-library/statistics";
import {
  governanceLibraryRecords,
} from "../../../lib/governance-library";
import type {
  GovernanceLibraryRecord,
} from "../../../lib/governance-library/records-foundational";

type OperationalModule = {
  title: string;
  description: string;
  href: string;
  action: string;
  code: string;
  status: string;
};

type CoverageCondition = {
  label: string;
  value: number;
  total: number;
  percentage: number;
};

const operationalModules: OperationalModule[] = [
  {
    title: "Applicability Engine",
    description:
      "Evaluate whether an authority may apply to a declared entity, system, role, jurisdiction, and operating condition.",
    href: "/governance-library/applicability",
    action: "Run determination",
    code: "AP",
    status: "Operational",
  },
  {
    title: "Crosswalk Engine",
    description:
      "Compare governance concepts across major authorities without overstating equivalence, conformity, or compliance.",
    href: "/governance-library/crosswalks",
    action: "Compare sources",
    code: "CW",
    status: "Operational",
  },
  {
    title: "Coverage Analysis",
    description:
      "Measure official-source completeness, locate source gaps, and inspect publisher and record-type integrity.",
    href: "/governance-library/coverage",
    action: "Inspect coverage",
    code: "CR",
    status: "Operational",
  },
  {
    title: "Governance Testing",
    description:
      "Move governance claims into structured tests, evidence requirements, review thresholds, and bounded outcomes.",
    href: "/governance-library/testing",
    action: "Open testing",
    code: "GT",
    status: "Operational",
  },
  {
    title: "Laws and Regulations",
    description:
      "Review binding authorities separately from standards, principles, guidance, and voluntary frameworks.",
    href: "/governance-library/laws",
    action: "Review laws",
    code: "LR",
    status: "Source library",
  },
  {
    title: "TA-14 Route Builder",
    description:
      "Translate authority, evidence, controls, review, and execution conditions into a governed TA-14 route.",
    href: "/workspace/ai-governance",
    action: "Build route",
    code: "RB",
    status: "Execution workspace",
  },
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function normalizeValue(value: string | undefined) {
  return value?.trim() || "Unspecified";
}

function percentage(value: number, total: number) {
  if (total === 0) {
    return 0;
  }

  return Math.round((value / total) * 100);
}

export default function GovernanceLibraryDashboardPage() {
  const stats = getGovernanceLibraryStatistics();
  const topCategories = getCategoryCounts().slice(0, 10);
  const topJurisdictions = getJurisdictionCounts().slice(0, 10);

  const records: GovernanceLibraryRecord[] =
    governanceLibraryRecords;

  const recordsWithSources = records.filter(
    (record) => Boolean(record.officialUrl),
  ).length;

  const recordsMissingSources =
    records.length - recordsWithSources;

  const publishers = new Set(
    records.map((record) =>
      normalizeValue(record.publisher),
    ),
  );

  const coverageConditions: CoverageCondition[] = [
    {
      label: "Official source present",
      value: recordsWithSources,
      total: records.length,
      percentage: percentage(
        recordsWithSources,
        records.length,
      ),
    },
    {
      label: "Official source missing",
      value: recordsMissingSources,
      total: records.length,
      percentage: percentage(
        recordsMissingSources,
        records.length,
      ),
    },
    {
      label: "Jurisdiction coverage",
      value: stats.totalJurisdictions,
      total: Math.max(stats.totalJurisdictions, 1),
      percentage:
        stats.totalJurisdictions > 0 ? 100 : 0,
    },
    {
      label: "Record-type coverage",
      value: stats.totalRecordTypes,
      total: Math.max(stats.totalRecordTypes, 1),
      percentage:
        stats.totalRecordTypes > 0 ? 100 : 0,
    },
  ];

  const largestCategory =
    topCategories.length > 0 ? topCategories[0] : null;

  const largestJurisdiction =
    topJurisdictions.length > 0
      ? topJurisdictions[0]
      : null;

  return (
    <main className="dashboardPage">
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
            Institutional governance command center
          </div>

          <Link
            href="/workspace/ai-governance"
            className="topbarAction"
          >
            Build TA-14 Route →
          </Link>
        </div>

        <header className="hero">
          <div className="heroMark">
            <div className="heroRing ringOne" />
            <div className="heroRing ringTwo" />

            <div className="heroSeal">
              <span>DC</span>
              <small>TA-14</small>
            </div>
          </div>

          <p className="eyebrow">
            TA-14 AI GOVERNANCE LIBRARY
          </p>

          <h1>
            Governance Library
            <span> Command Center</span>
          </h1>

          <p className="lead">
            Monitor the structure, coverage, source integrity, and
            operational readiness of the TA-14 AI Governance Library.
            Move from authority discovery to applicability,
            crosswalks, testing, evidence review, and governed
            execution without collapsing those functions into one
            unsupported conclusion.
          </p>

          <div className="heroMetrics">
            <article>
              <span>{stats.totalRecords}</span>
              <small>Library records</small>
            </article>

            <article>
              <span>{stats.totalCategories}</span>
              <small>Governance categories</small>
            </article>

            <article>
              <span>{stats.totalJurisdictions}</span>
              <small>Jurisdictions represented</small>
            </article>

            <article>
              <span>{stats.totalRecordTypes}</span>
              <small>Record classifications</small>
            </article>

            <article>
              <span>{publishers.size}</span>
              <small>Publishers represented</small>
            </article>
          </div>
        </header>

        <section className="conditionSection">
          <div className="sectionHeading">
            <div>
              <p className="eyebrow">
                LIBRARY CONDITION
              </p>

              <h2>
                Current institutional readiness.
              </h2>
            </div>

            <p>
              The command center measures what the library currently
              contains. It does not infer applicability, legal
              effect, source currency, conformity, or execution
              authority from record volume alone.
            </p>
          </div>

          <div className="conditionGrid">
            <article className="primaryCondition">
              <div className="conditionHeading">
                <div>
                  <span>Official-source integrity</span>

                  <strong>
                    {percentage(
                      recordsWithSources,
                      records.length,
                    )}
                    %
                  </strong>
                </div>

                <div className="conditionStatus">
                  {recordsMissingSources === 0
                    ? "Complete"
                    : "Remediation open"}
                </div>
              </div>

              <div className="largeProgress">
                <div
                  style={{
                    width: `${percentage(
                      recordsWithSources,
                      records.length,
                    )}%`,
                  }}
                />
              </div>

              <p>
                {recordsWithSources} of {records.length} records
                currently preserve an official source reference.
                {recordsMissingSources > 0
                  ? ` ${recordsMissingSources} ${
                      recordsMissingSources === 1
                        ? "record requires"
                        : "records require"
                    } source remediation.`
                  : " No official-source gaps are currently recorded."}
              </p>

              <div className="conditionActions">
                <Link
                  href="/governance-library/coverage"
                  className="primaryAction"
                >
                  Open Coverage Analysis →
                </Link>

                <Link
                  href="/governance-library/sources"
                  className="secondaryAction"
                >
                  Review Source Records
                </Link>
              </div>
            </article>

            <article className="secondaryCondition">
              <p className="eyebrow">
                CURRENT DISTRIBUTION
              </p>

              <div className="distributionList">
                <div>
                  <span>Largest category</span>
                  <strong>
                    {largestCategory?.category ??
                      "No category data"}
                  </strong>
                  <small>
                    {largestCategory
                      ? `${largestCategory.count} records`
                      : "No records available"}
                  </small>
                </div>

                <div>
                  <span>Largest jurisdiction</span>
                  <strong>
                    {largestJurisdiction?.jurisdiction ??
                      "No jurisdiction data"}
                  </strong>
                  <small>
                    {largestJurisdiction
                      ? `${largestJurisdiction.count} records`
                      : "No records available"}
                  </small>
                </div>

                <div>
                  <span>Open integrity condition</span>
                  <strong>
                    {recordsMissingSources > 0
                      ? "Official-source gaps"
                      : "No source gaps"}
                  </strong>
                  <small>
                    {recordsMissingSources} open records
                  </small>
                </div>
              </div>
            </article>
          </div>
        </section>

        <section className="operationsSection">
          <div className="sectionHeading">
            <div>
              <p className="eyebrow">
                OPERATIONAL WORKSPACES
              </p>

              <h2>
                Move through the governance sequence.
              </h2>
            </div>

            <p>
              Each workspace performs a different institutional
              function. Discovery does not prove applicability.
              Applicability does not prove satisfaction. Testing does
              not authorize execution without evidence, authority,
              binding, and control.
            </p>
          </div>

          <div className="operationsGrid">
            {operationalModules.map((module, index) => (
              <Link
                href={module.href}
                className="operationCard"
                key={module.title}
              >
                <div className="operationTop">
                  <span className="operationNumber">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span className="operationStatus">
                    {module.status}
                  </span>
                </div>

                <div className="operationSeal">
                  <span>{module.code}</span>
                </div>

                <h3>{module.title}</h3>

                <p>{module.description}</p>

                <div className="operationAction">
                  {module.action} →
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="analyticsSection">
          <div className="sectionHeading">
            <div>
              <p className="eyebrow">
                LIBRARY DISTRIBUTION
              </p>

              <h2>
                Inspect concentration across the corpus.
              </h2>
            </div>

            <p>
              Category and jurisdiction counts reveal where the
              library is concentrated. They do not prove balanced
              coverage, completeness, or legal sufficiency.
            </p>
          </div>

          <div className="analyticsGrid">
            <article className="analyticsPanel">
              <div className="panelHeading">
                <div>
                  <span>Category distribution</span>
                  <h3>Top governance categories</h3>
                </div>

                <small>
                  {stats.totalCategories} total categories
                </small>
              </div>

              <div className="rankedList">
                {topCategories.map((item, index) => {
                  const maximum =
                    topCategories[0]?.count || 1;

                  const width = Math.max(
                    6,
                    Math.round(
                      (item.count / maximum) * 100,
                    ),
                  );

                  return (
                    <Link
                      key={item.category}
                      href={`/governance-library/category/${slugify(
                        item.category,
                      )}`}
                      className="rankedRow"
                    >
                      <span className="rank">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <div className="rankedContent">
                        <div className="rankedHeading">
                          <strong>{item.category}</strong>
                          <b>{item.count}</b>
                        </div>

                        <div className="progressTrack">
                          <div
                            className="progressFill"
                            style={{
                              width: `${width}%`,
                            }}
                          />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </article>

            <article className="analyticsPanel">
              <div className="panelHeading">
                <div>
                  <span>Jurisdiction distribution</span>
                  <h3>Top represented jurisdictions</h3>
                </div>

                <small>
                  {stats.totalJurisdictions} jurisdictions
                </small>
              </div>

              <div className="rankedList">
                {topJurisdictions.map((item, index) => {
                  const maximum =
                    topJurisdictions[0]?.count || 1;

                  const width = Math.max(
                    6,
                    Math.round(
                      (item.count / maximum) * 100,
                    ),
                  );

                  return (
                    <div
                      className="rankedRow static"
                      key={item.jurisdiction}
                    >
                      <span className="rank">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <div className="rankedContent">
                        <div className="rankedHeading">
                          <strong>
                            {item.jurisdiction}
                          </strong>
                          <b>{item.count}</b>
                        </div>

                        <div className="progressTrack">
                          <div
                            className="progressFill goldFill"
                            style={{
                              width: `${width}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </article>
          </div>
        </section>

        <section className="coverageSection">
          <div className="sectionHeading">
            <div>
              <p className="eyebrow">
                INTEGRITY SIGNALS
              </p>

              <h2>
                Read the condition behind the totals.
              </h2>
            </div>

            <p>
              Dashboard metrics are navigation signals. Each signal
              requires record-level review before it can support a
              governance determination.
            </p>
          </div>

          <div className="coverageGrid">
            {coverageConditions.map((condition) => (
              <article key={condition.label}>
                <div className="coverageTop">
                  <span>{condition.label}</span>

                  <strong>
                    {condition.percentage}%
                  </strong>
                </div>

                <div className="progressTrack">
                  <div
                    className="progressFill"
                    style={{
                      width: `${condition.percentage}%`,
                    }}
                  />
                </div>

                <small>
                  {condition.value} of {condition.total}
                </small>
              </article>
            ))}
          </div>
        </section>

        <section className="sequenceSection">
          <div className="sectionHeading">
            <div>
              <p className="eyebrow">
                TA-14 GOVERNANCE SEQUENCE
              </p>

              <h2>
                The library informs execution. It does not replace
                it.
              </h2>
            </div>
          </div>

          <div className="sequenceTrack">
            {[
              {
                code: "01",
                title: "Authority",
                description:
                  "Identify the controlling or relevant source.",
              },
              {
                code: "02",
                title: "Applicability",
                description:
                  "Determine whether the source may govern the declared condition.",
              },
              {
                code: "03",
                title: "Evidence",
                description:
                  "Identify what must be proven and by which records.",
              },
              {
                code: "04",
                title: "Testing",
                description:
                  "Evaluate evidence against defined requirements and boundaries.",
              },
              {
                code: "05",
                title: "Admissibility",
                description:
                  "Confirm identity, continuity, authority, relevance, and integrity.",
              },
              {
                code: "06",
                title: "Execution",
                description:
                  "Permit, hold, deny, or escalate under governed conditions.",
              },
              {
                code: "07",
                title: "Outcome",
                description:
                  "Preserve whether the controlled action actually worked.",
              },
            ].map((step) => (
              <article key={step.code}>
                <span>{step.code}</span>

                <strong>{step.title}</strong>

                <p>{step.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="boundarySection">
          <div className="boundarySeal">
            <span>DB</span>
            <small>Dashboard boundary</small>
          </div>

          <p className="eyebrow gold">
            COMMAND CENTER BOUNDARY
          </p>

          <h2>
            Library visibility is not governance authority.
          </h2>

          <p>
            This dashboard proves what the library currently records
            and how that corpus is distributed. It does not prove
            that a source is current, applicable, controlling,
            satisfied, legally interpreted, or sufficient to
            authorize execution. Those determinations require
            source-level review, evidence, validated authority, and
            governed decision controls.
          </p>

          <div className="boundaryGrid">
            <article>
              <span>DASHBOARD PROVES</span>
              <strong>
                Current library structure, counts, distribution, and
                recorded source condition
              </strong>
            </article>

            <article>
              <span>DASHBOARD DOES NOT PROVE</span>
              <strong>
                Applicability, compliance, conformity, legal effect,
                or execution authority
              </strong>
            </article>

            <article>
              <span>REQUIRED NEXT STEP</span>
              <strong>
                Open the relevant authority, run applicability, test
                evidence, and build the governed route
              </strong>
            </article>
          </div>

          <div className="boundaryActions">
            <Link
              href="/governance-library/applicability"
              className="secondaryAction"
            >
              Run Applicability Engine
            </Link>

            <Link
              href="/governance-library/testing"
              className="secondaryAction"
            >
              Open Governance Testing
            </Link>

            <Link
              href="/workspace/ai-governance"
              className="primaryAction"
            >
              Build TA-14 Route →
            </Link>
          </div>
        </section>
      </div>

      <style jsx>{`
        .dashboardPage {
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
          max-width: 1120px;
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
          max-width: 940px;
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

        .conditionSection,
        .operationsSection,
        .analyticsSection,
        .coverageSection,
        .sequenceSection {
          padding-top: 80px;
        }

        .sectionHeading {
          margin-bottom: 31px;
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          align-items: end;
          gap: 40px;
        }

        .sectionHeading h2,
        .boundarySection h2 {
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

        .conditionGrid {
          display: grid;
          grid-template-columns: 1.35fr 0.65fr;
          gap: 18px;
        }

        .primaryCondition,
        .secondaryCondition {
          padding: 28px;
          border: 1px solid rgba(99, 230, 255, 0.13);
          border-radius: 25px;
          background:
            radial-gradient(
              circle at 0 0,
              rgba(99, 230, 255, 0.06),
              transparent 30%
            ),
            linear-gradient(
              145deg,
              rgba(10, 31, 47, 0.94),
              rgba(4, 14, 24, 0.98)
            );
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.27);
        }

        .conditionHeading {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 18px;
        }

        .conditionHeading span {
          display: block;
          color: #7ed9e9;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.09em;
          text-transform: uppercase;
        }

        .conditionHeading strong {
          display: block;
          margin-top: 7px;
          color: #f0d28f;
          font: 700 46px Georgia, serif;
        }

        .conditionStatus {
          padding: 8px 10px;
          border: 1px solid rgba(255, 197, 82, 0.25);
          border-radius: 999px;
          color: #ffd27b;
          background: rgba(255, 197, 82, 0.07);
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .largeProgress,
        .progressTrack {
          overflow: hidden;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.07);
        }

        .largeProgress {
          height: 10px;
          margin-top: 20px;
        }

        .largeProgress div,
        .progressFill {
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(
            90deg,
            #3eb2ca,
            #7de6f3
          );
        }

        .primaryCondition > p {
          margin: 19px 0 0;
          color: #9bb0b9;
          font-size: 14px;
          line-height: 1.72;
        }

        .conditionActions {
          margin-top: 22px;
          display: flex;
          flex-wrap: wrap;
          gap: 9px;
        }

        .conditionActions .primaryAction,
        .conditionActions .secondaryAction {
          justify-self: auto;
        }

        .distributionList {
          margin-top: 18px;
          display: grid;
          gap: 12px;
        }

        .distributionList div {
          padding: 16px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 14px;
          background: rgba(0, 0, 0, 0.16);
        }

        .distributionList span {
          display: block;
          color: #708793;
          font-size: 7px;
          font-weight: 900;
          letter-spacing: 0.09em;
          text-transform: uppercase;
        }

        .distributionList strong {
          display: block;
          margin-top: 7px;
          color: #dce8ec;
          font-size: 13px;
        }

        .distributionList small {
          display: block;
          margin-top: 5px;
          color: #78909b;
          font-size: 9px;
        }

        .operationsGrid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
        }

        .operationCard {
          min-height: 100%;
          padding: 24px;
          display: flex;
          flex-direction: column;
          border: 1px solid rgba(99, 230, 255, 0.11);
          border-radius: 22px;
          color: inherit;
          background:
            radial-gradient(
              circle at 100% 0,
              rgba(99, 230, 255, 0.05),
              transparent 30%
            ),
            linear-gradient(
              145deg,
              rgba(10, 28, 43, 0.94),
              rgba(4, 14, 24, 0.98)
            );
          box-shadow: 0 22px 54px rgba(0, 0, 0, 0.24);
          text-decoration: none;
          transition:
            transform 0.22s,
            border-color 0.22s,
            box-shadow 0.22s;
        }

        .operationCard:hover {
          transform: translateY(-5px);
          border-color: rgba(99, 230, 255, 0.3);
          box-shadow: 0 28px 68px rgba(0, 0, 0, 0.31);
        }

        .operationTop {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .operationNumber {
          color: #6c8793;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.08em;
        }

        .operationStatus {
          padding: 7px 9px;
          border: 1px solid rgba(114, 230, 178, 0.22);
          border-radius: 999px;
          color: #8cefc2;
          background: rgba(114, 230, 178, 0.06);
          font-size: 7px;
          font-weight: 900;
          letter-spacing: 0.07em;
          text-transform: uppercase;
        }

        .operationSeal {
          width: 66px;
          height: 66px;
          margin-top: 30px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(255, 197, 82, 0.25);
          border-radius: 50%;
          background: rgba(255, 197, 82, 0.04);
        }

        .operationSeal span {
          color: #f0cc7d;
          font: 700 19px Georgia, serif;
        }

        .operationCard h3 {
          margin: 21px 0 0;
          font-size: 28px;
          line-height: 1.04;
        }

        .operationCard p {
          flex: 1;
          margin: 15px 0 0;
          color: #91a6b0;
          font-size: 13px;
          line-height: 1.68;
        }

        .operationAction {
          margin-top: 23px;
          padding-top: 17px;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          color: #72dff1;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.07em;
          text-transform: uppercase;
        }

        .analyticsGrid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
        }

        .analyticsPanel {
          padding: 25px;
          border: 1px solid rgba(99, 230, 255, 0.11);
          border-radius: 23px;
          background: linear-gradient(
            145deg,
            rgba(9, 28, 43, 0.94),
            rgba(3, 12, 21, 0.98)
          );
        }

        .panelHeading {
          padding-bottom: 19px;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 18px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }

        .panelHeading span {
          color: #6dd9eb;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .panelHeading h3 {
          margin: 7px 0 0;
          font-size: 24px;
        }

        .panelHeading small {
          color: #758b96;
          font-size: 9px;
        }

        .rankedList {
          margin-top: 17px;
          display: grid;
          gap: 10px;
        }

        .rankedRow {
          padding: 13px;
          display: flex;
          align-items: center;
          gap: 13px;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 13px;
          color: inherit;
          background: rgba(0, 0, 0, 0.15);
          text-decoration: none;
          transition:
            transform 0.2s,
            border-color 0.2s;
        }

        .rankedRow:not(.static):hover {
          transform: translateX(4px);
          border-color: rgba(99, 230, 255, 0.24);
        }

        .rank {
          width: 38px;
          height: 38px;
          flex: 0 0 38px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(99, 230, 255, 0.16);
          border-radius: 10px;
          color: #6bd9eb;
          font-size: 8px;
          font-weight: 900;
        }

        .rankedContent {
          flex: 1;
          min-width: 0;
        }

        .rankedHeading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
        }

        .rankedHeading strong {
          overflow: hidden;
          color: #d5e3e7;
          font-size: 11px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .rankedHeading b {
          color: #edca80;
          font: 700 16px Georgia, serif;
        }

        .progressTrack {
          height: 5px;
          margin-top: 9px;
        }

        .goldFill {
          background: linear-gradient(
            90deg,
            #b8842c,
            #edc96d
          );
        }

        .coverageGrid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 14px;
        }

        .coverageGrid article {
          padding: 20px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 17px;
          background: rgba(6, 20, 32, 0.67);
        }

        .coverageTop {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
        }

        .coverageTop span {
          color: #9fb1b9;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.06em;
          line-height: 1.4;
          text-transform: uppercase;
        }

        .coverageTop strong {
          color: #f0ce86;
          font: 700 20px Georgia, serif;
        }

        .coverageGrid small {
          display: block;
          margin-top: 10px;
          color: #718995;
          font-size: 9px;
        }

        .sequenceTrack {
          display: grid;
          grid-template-columns: repeat(7, minmax(0, 1fr));
          gap: 10px;
        }

        .sequenceTrack article {
          position: relative;
          min-height: 220px;
          padding: 19px;
          border: 1px solid rgba(99, 230, 255, 0.1);
          border-radius: 17px;
          background:
            linear-gradient(
              180deg,
              rgba(10, 30, 45, 0.9),
              rgba(3, 12, 20, 0.96)
            );
        }

        .sequenceTrack article:not(:last-child)::after {
          position: absolute;
          z-index: 3;
          top: 50%;
          right: -9px;
          width: 16px;
          height: 16px;
          display: grid;
          place-items: center;
          content: "›";
          color: #7dddec;
          background: #071723;
          font-size: 16px;
        }

        .sequenceTrack article > span {
          width: 37px;
          height: 37px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(255, 197, 82, 0.2);
          border-radius: 50%;
          color: #efc66f;
          font-size: 8px;
          font-weight: 900;
        }

        .sequenceTrack strong {
          display: block;
          margin-top: 24px;
          color: #e1ecef;
          font: 700 19px Georgia, serif;
        }

        .sequenceTrack p {
          margin: 12px 0 0;
          color: #8298a2;
          font-size: 11px;
          line-height: 1.55;
        }

        .boundarySection {
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

        .boundarySection h2 {
          max-width: 1020px;
          margin: 14px auto 0;
        }

        .boundarySection > p:not(.eyebrow) {
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
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 10px;
        }

        @media (max-width: 1180px) {
          .heroMetrics {
            grid-template-columns: repeat(
              3,
              minmax(0, 1fr)
            );
          }

          .operationsGrid {
            grid-template-columns: repeat(
              2,
              minmax(0, 1fr)
            );
          }

          .coverageGrid {
            grid-template-columns: repeat(
              2,
              minmax(0, 1fr)
            );
          }

          .sequenceTrack {
            grid-template-columns: repeat(
              4,
              minmax(0, 1fr)
            );
          }

          .sequenceTrack article::after {
            display: none !important;
          }
        }

        @media (max-width: 920px) {
          .topbar {
            grid-template-columns: 1fr 1fr;
          }

          .topbarStatus {
            display: none;
          }

          .sectionHeading,
          .conditionGrid {
            grid-template-columns: 1fr;
          }

          .analyticsGrid {
            grid-template-columns: 1fr;
          }

          .boundaryGrid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 680px) {
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

          .heroMetrics,
          .operationsGrid,
          .coverageGrid,
          .sequenceTrack,
          .boundaryGrid {
            grid-template-columns: 1fr;
          }

          .primaryCondition,
          .secondaryCondition,
          .analyticsPanel,
          .boundarySection {
            padding: 22px;
          }

          .conditionHeading {
            flex-direction: column;
          }

          .conditionActions,
          .boundaryActions {
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
