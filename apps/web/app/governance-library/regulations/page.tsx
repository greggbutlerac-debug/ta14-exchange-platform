"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type RegulationStatus =
  | "Active"
  | "Developing"
  | "Monitoring"
  | "Sector-specific";

type ApplicabilityLevel =
  | "High"
  | "Context-dependent"
  | "Jurisdiction-dependent";

type RegulationRecord = {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  jurisdiction: string;
  region: string;
  authority: string;
  sectors: string[];
  status: RegulationStatus;
  applicability: ApplicabilityLevel;
  crosswalkCoverage: number;
  relatedSources: string[];
  relatedRecords: number;
  lawsHref: string;
  crosswalkHref: string;
  applicabilityHref: string;
};

type CoverageRecord = {
  sector: string;
  coverage: number;
  regulations: number;
  status: "Strong" | "Developing" | "Limited";
};

const regulationRecords: RegulationRecord[] = [
  {
    id: "eu-ai-act",
    title: "European Union Artificial Intelligence Act",
    shortTitle: "EU AI Act",
    description:
      "Risk-based legal requirements for providers, deployers, importers, distributors, product manufacturers, and other actors across the AI lifecycle.",
    jurisdiction: "European Union",
    region: "Europe",
    authority: "European Union",
    sectors: [
      "General AI",
      "Employment",
      "Critical Infrastructure",
      "Healthcare",
      "Finance",
    ],
    status: "Active",
    applicability: "High",
    crosswalkCoverage: 94,
    relatedSources: [
      "ISO/IEC 42001",
      "ISO/IEC 23894",
      "NIST AI RMF",
      "OECD AI Principles",
    ],
    relatedRecords: 18,
    lawsHref: "/governance-library/laws",
    crosswalkHref: "/governance-library/crosswalks",
    applicabilityHref: "/governance-library/applicability",
  },
  {
    id: "us-federal",
    title: "United States Executive and Agency Requirements",
    shortTitle: "U.S. Federal Requirements",
    description:
      "Executive directives, agency rules, procurement requirements, administrative guidance, and sector-specific obligations affecting AI governance.",
    jurisdiction: "United States",
    region: "North America",
    authority: "Federal government and agencies",
    sectors: [
      "Government",
      "Procurement",
      "Healthcare",
      "Finance",
      "Critical Infrastructure",
    ],
    status: "Developing",
    applicability: "Context-dependent",
    crosswalkCoverage: 81,
    relatedSources: [
      "NIST AI RMF",
      "OMB Requirements",
      "Federal Agency Guidance",
      "Sector Rules",
    ],
    relatedRecords: 14,
    lawsHref: "/governance-library/laws",
    crosswalkHref: "/governance-library/crosswalks",
    applicabilityHref: "/governance-library/applicability",
  },
  {
    id: "state-local",
    title: "State and Local Artificial Intelligence Laws",
    shortTitle: "State and Local AI Laws",
    description:
      "Subnational requirements addressing automated decisions, employment tools, consumer protection, privacy, disclosure, and accountability.",
    jurisdiction: "United States — State and Local",
    region: "North America",
    authority: "State and local authorities",
    sectors: [
      "Employment",
      "Consumer Protection",
      "Privacy",
      "Education",
      "Government",
    ],
    status: "Developing",
    applicability: "Jurisdiction-dependent",
    crosswalkCoverage: 68,
    relatedSources: [
      "Employment AI Laws",
      "Privacy Statutes",
      "Consumer Protection Rules",
      "Disclosure Requirements",
    ],
    relatedRecords: 11,
    lawsHref: "/governance-library/laws",
    crosswalkHref: "/governance-library/crosswalks",
    applicabilityHref: "/governance-library/applicability",
  },
  {
    id: "privacy-data-protection",
    title: "Privacy and Data Protection Requirements",
    shortTitle: "Privacy and Data Protection",
    description:
      "Requirements governing personal data, lawful processing, transparency, access, correction, retention, profiling, and automated decision-making.",
    jurisdiction: "Multi-jurisdictional",
    region: "Global",
    authority: "Legislatures and data protection authorities",
    sectors: [
      "General AI",
      "Healthcare",
      "Finance",
      "Employment",
      "Consumer Services",
    ],
    status: "Active",
    applicability: "High",
    crosswalkCoverage: 89,
    relatedSources: [
      "GDPR",
      "State Privacy Laws",
      "Data Protection Principles",
      "Automated Decision Rules",
    ],
    relatedRecords: 21,
    lawsHref: "/governance-library/laws",
    crosswalkHref: "/governance-library/crosswalks",
    applicabilityHref: "/governance-library/applicability",
  },
  {
    id: "sector-regulation",
    title: "Sector-Specific Artificial Intelligence Regulation",
    shortTitle: "Sector-Specific Regulation",
    description:
      "Obligations applying to healthcare, finance, insurance, critical infrastructure, education, employment, and other regulated domains.",
    jurisdiction: "Multi-jurisdictional",
    region: "Global",
    authority: "Sector regulators",
    sectors: [
      "Healthcare",
      "Finance",
      "Insurance",
      "Critical Infrastructure",
      "Education",
      "Employment",
    ],
    status: "Sector-specific",
    applicability: "Context-dependent",
    crosswalkCoverage: 76,
    relatedSources: [
      "Medical Device Rules",
      "Financial Services Rules",
      "Critical Infrastructure Controls",
      "Employment Requirements",
    ],
    relatedRecords: 17,
    lawsHref: "/governance-library/laws",
    crosswalkHref: "/governance-library/crosswalks",
    applicabilityHref: "/governance-library/applicability",
  },
  {
    id: "product-safety-liability",
    title: "Product Safety and Artificial Intelligence Liability",
    shortTitle: "Product Safety and Liability",
    description:
      "Rules addressing safety, defects, foreseeable misuse, documentation, accountability, corrective action, and responsibility for AI-enabled products.",
    jurisdiction: "Multi-jurisdictional",
    region: "Global",
    authority: "Product safety and liability authorities",
    sectors: [
      "Manufacturing",
      "Consumer Products",
      "Healthcare",
      "Automotive",
      "Robotics",
    ],
    status: "Monitoring",
    applicability: "Context-dependent",
    crosswalkCoverage: 63,
    relatedSources: [
      "Product Safety Law",
      "Liability Rules",
      "Technical Documentation",
      "Risk Management Standards",
    ],
    relatedRecords: 9,
    lawsHref: "/governance-library/laws",
    crosswalkHref: "/governance-library/crosswalks",
    applicabilityHref: "/governance-library/applicability",
  },
];

const coverageRecords: CoverageRecord[] = [
  {
    sector: "Healthcare",
    coverage: 92,
    regulations: 14,
    status: "Strong",
  },
  {
    sector: "Finance",
    coverage: 88,
    regulations: 12,
    status: "Strong",
  },
  {
    sector: "Employment",
    coverage: 82,
    regulations: 11,
    status: "Strong",
  },
  {
    sector: "Critical Infrastructure",
    coverage: 74,
    regulations: 9,
    status: "Developing",
  },
  {
    sector: "Consumer Protection",
    coverage: 70,
    regulations: 8,
    status: "Developing",
  },
  {
    sector: "Education",
    coverage: 57,
    regulations: 6,
    status: "Limited",
  },
];

const activityRecords = [
  {
    title: "Regulatory applicability reviewed",
    detail:
      "European Union actor and lifecycle scope mapped to the Applicability Engine.",
    type: "Applicability",
  },
  {
    title: "Crosswalk coverage updated",
    detail:
      "Privacy and data-protection sources connected to standards and governance frameworks.",
    type: "Crosswalk",
  },
  {
    title: "Sector coverage condition identified",
    detail:
      "Education governance remains less developed than healthcare, finance, and employment coverage.",
    type: "Coverage",
  },
  {
    title: "Route relationship established",
    detail:
      "Regulatory sources may now be carried into governed route analysis with declared limitations.",
    type: "Route Builder",
  },
];

function statusClass(value: string) {
  return value.toLowerCase().replaceAll(" ", "-");
}

export default function GovernanceLibraryRegulationsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [jurisdictionFilter, setJurisdictionFilter] =
    useState("All jurisdictions");
  const [sectorFilter, setSectorFilter] =
    useState("All sectors");
  const [statusFilter, setStatusFilter] =
    useState("All statuses");
  const [selectedRecordId, setSelectedRecordId] =
    useState<string | null>("eu-ai-act");

  const jurisdictions = useMemo(
    () => [
      "All jurisdictions",
      ...Array.from(
        new Set(
          regulationRecords.map(
            (record) => record.jurisdiction,
          ),
        ),
      ).sort(),
    ],
    [],
  );

  const sectors = useMemo(
    () => [
      "All sectors",
      ...Array.from(
        new Set(
          regulationRecords.flatMap(
            (record) => record.sectors,
          ),
        ),
      ).sort(),
    ],
    [],
  );

  const statuses = useMemo(
    () => [
      "All statuses",
      ...Array.from(
        new Set(
          regulationRecords.map(
            (record) => record.status,
          ),
        ),
      ).sort(),
    ],
    [],
  );

  const visibleRecords = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return regulationRecords.filter((record) => {
      const matchesSearch =
        query.length === 0 ||
        [
          record.title,
          record.shortTitle,
          record.description,
          record.jurisdiction,
          record.region,
          record.authority,
          record.status,
          record.applicability,
          ...record.sectors,
          ...record.relatedSources,
        ]
          .join(" ")
          .toLowerCase()
          .includes(query);

      const matchesJurisdiction =
        jurisdictionFilter === "All jurisdictions" ||
        record.jurisdiction === jurisdictionFilter;

      const matchesSector =
        sectorFilter === "All sectors" ||
        record.sectors.includes(sectorFilter);

      const matchesStatus =
        statusFilter === "All statuses" ||
        record.status === statusFilter;

      return (
        matchesSearch &&
        matchesJurisdiction &&
        matchesSector &&
        matchesStatus
      );
    });
  }, [
    jurisdictionFilter,
    searchQuery,
    sectorFilter,
    statusFilter,
  ]);

  const selectedRecord =
    regulationRecords.find(
      (record) => record.id === selectedRecordId,
    ) ?? null;

  const totalRelatedRecords = regulationRecords.reduce(
    (total, record) => total + record.relatedRecords,
    0,
  );

  const averageCoverage = Math.round(
    regulationRecords.reduce(
      (total, record) =>
        total + record.crosswalkCoverage,
      0,
    ) / regulationRecords.length,
  );

  const activeFilterCount = [
    searchQuery.trim().length > 0,
    jurisdictionFilter !== "All jurisdictions",
    sectorFilter !== "All sectors",
    statusFilter !== "All statuses",
  ].filter(Boolean).length;

  function clearFilters() {
    setSearchQuery("");
    setJurisdictionFilter("All jurisdictions");
    setSectorFilter("All sectors");
    setStatusFilter("All statuses");
  }

  return (
    <main className="page">
      <div className="backgroundGrid" />
      <div className="backgroundGlow glowOne" />
      <div className="backgroundGlow glowTwo" />

      <div className="shell">
        <div className="topbar">
          <Link
            href="/governance-library"
            className="topbarLink"
          >
            ← Governance Library
          </Link>

          <div className="topbarStatus">
            <span />
            Regulatory intelligence active
          </div>

          <Link
            href="/governance-library/applicability"
            className="topbarAction"
          >
            Determine Applicability →
          </Link>
        </div>

        <header className="hero">
          <div className="heroSeal">
            <span>AR</span>
            <small>TA-14</small>
          </div>

          <p className="eyebrow">
            TA-14 AI GOVERNANCE LIBRARY
          </p>

          <h1>
            AI Regulations
            <span> Intelligence Center</span>
          </h1>

          <p className="lead">
            Explore binding requirements, regulatory
            obligations, jurisdictional conditions,
            sector-specific rules, source relationships,
            and applicability boundaries affecting
            artificial intelligence governance and
            execution.
          </p>

          <div className="heroMetrics">
            <article>
              <span>{regulationRecords.length}</span>
              <small>Regulatory domains</small>
            </article>

            <article>
              <span>{jurisdictions.length - 1}</span>
              <small>Jurisdiction groups</small>
            </article>

            <article>
              <span>{sectors.length - 1}</span>
              <small>Covered sectors</small>
            </article>

            <article>
              <span>{averageCoverage}%</span>
              <small>Crosswalk coverage</small>
            </article>

            <article>
              <span>{totalRelatedRecords}</span>
              <small>Related records</small>
            </article>
          </div>
        </header>

        <section className="controlSection">
          <div className="sectionHeading">
            <div>
              <p className="eyebrow">
                REGULATORY EXPLORER
              </p>

              <h2>
                Find the regulatory sources that may
                govern an intended action.
              </h2>
            </div>

            <p>
              Search and filtering identify candidate
              sources. They do not independently establish
              legal applicability, actor scope, conformity,
              compliance, or authority to execute.
            </p>
          </div>

          <div className="filterPanel">
            <label className="searchField">
              Search regulations
              <input
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(event.target.value)
                }
                placeholder="Search regulation, jurisdiction, sector, authority, or related source"
              />
            </label>

            <label>
              Jurisdiction
              <select
                value={jurisdictionFilter}
                onChange={(event) =>
                  setJurisdictionFilter(
                    event.target.value,
                  )
                }
              >
                {jurisdictions.map((jurisdiction) => (
                  <option
                    key={jurisdiction}
                    value={jurisdiction}
                  >
                    {jurisdiction}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Sector
              <select
                value={sectorFilter}
                onChange={(event) =>
                  setSectorFilter(event.target.value)
                }
              >
                {sectors.map((sector) => (
                  <option key={sector} value={sector}>
                    {sector}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Status
              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value)
                }
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>

            <button
              type="button"
              className="clearButton"
              onClick={clearFilters}
            >
              Clear filters
            </button>
          </div>

          <div className="resultBar">
            <div>
              <span>{visibleRecords.length}</span>
              <small>Domains shown</small>
            </div>

            <div>
              <span>{activeFilterCount}</span>
              <small>Active filters</small>
            </div>

            <div>
              <span>
                {
                  visibleRecords.filter(
                    (record) =>
                      record.status === "Active",
                  ).length
                }
              </span>
              <small>Active domains</small>
            </div>
          </div>
        </section>

        <section className="directorySection">
          <div className="sectionHeading">
            <div>
              <p className="eyebrow">
                REGULATORY DIRECTORY
              </p>

              <h2>
                Inspect scope, status, coverage, and
                related governance sources.
              </h2>
            </div>

            <p>
              Select a regulatory domain for a focused
              intelligence view or move directly into
              source records, crosswalks, and
              applicability analysis.
            </p>
          </div>

          <div className="directoryGrid">
            <div className="recordGrid">
              {visibleRecords.map((record) => {
                const active =
                  selectedRecord?.id === record.id;

                return (
                  <button
                    type="button"
                    key={record.id}
                    className={`recordCard ${
                      active ? "active" : ""
                    }`}
                    onClick={() =>
                      setSelectedRecordId(record.id)
                    }
                  >
                    <div className="recordTopline">
                      <span
                        className={`statusBadge ${statusClass(
                          record.status,
                        )}`}
                      >
                        {record.status}
                      </span>

                      <span>
                        {record.crosswalkCoverage}%
                        crosswalk
                      </span>
                    </div>

                    <p className="recordJurisdiction">
                      {record.jurisdiction}
                    </p>

                    <h3>{record.shortTitle}</h3>

                    <p className="recordDescription">
                      {record.description}
                    </p>

                    <div className="sectorList">
                      {record.sectors
                        .slice(0, 4)
                        .map((sector) => (
                          <span key={sector}>
                            {sector}
                          </span>
                        ))}
                    </div>

                    <div className="recordFooter">
                      <div>
                        <strong>
                          {record.relatedRecords}
                        </strong>
                        <small>Related records</small>
                      </div>

                      <span className="inspectAction">
                        Inspect →
                      </span>
                    </div>
                  </button>
                );
              })}

              {visibleRecords.length === 0 ? (
                <div className="emptyState">
                  No regulatory domains match the current
                  filters.
                </div>
              ) : null}
            </div>

            <aside className="inspectionPanel">
              {selectedRecord ? (
                <>
                  <div className="inspectionHeader">
                    <div>
                      <p className="eyebrow">
                        FOCUSED REGULATORY REVIEW
                      </p>

                      <h3>{selectedRecord.shortTitle}</h3>
                    </div>

                    <span
                      className={`statusBadge ${statusClass(
                        selectedRecord.status,
                      )}`}
                    >
                      {selectedRecord.status}
                    </span>
                  </div>

                  <p className="inspectionDescription">
                    {selectedRecord.description}
                  </p>

                  <div className="inspectionMetrics">
                    <article>
                      <span>
                        {
                          selectedRecord
                            .crosswalkCoverage
                        }
                        %
                      </span>
                      <small>Crosswalk coverage</small>
                    </article>

                    <article>
                      <span>
                        {selectedRecord.relatedRecords}
                      </span>
                      <small>Related records</small>
                    </article>

                    <article>
                      <span>
                        {selectedRecord.sectors.length}
                      </span>
                      <small>Sectors represented</small>
                    </article>
                  </div>

                  <div className="factGrid">
                    <article>
                      <span>Jurisdiction</span>
                      <strong>
                        {selectedRecord.jurisdiction}
                      </strong>
                    </article>

                    <article>
                      <span>Authority</span>
                      <strong>
                        {selectedRecord.authority}
                      </strong>
                    </article>

                    <article>
                      <span>Applicability posture</span>
                      <strong>
                        {selectedRecord.applicability}
                      </strong>
                    </article>

                    <article>
                      <span>Regional scope</span>
                      <strong>
                        {selectedRecord.region}
                      </strong>
                    </article>
                  </div>

                  <div className="relatedBlock">
                    <p>Related governance sources</p>

                    <div>
                      {selectedRecord.relatedSources.map(
                        (source) => (
                          <span key={source}>
                            {source}
                          </span>
                        ),
                      )}
                    </div>
                  </div>

                  <div className="inspectionBoundary">
                    <span>
                      Regulatory intelligence boundary
                    </span>

                    <p>
                      This domain identifies candidate
                      legal and regulatory sources. It
                      does not establish that every source
                      applies to every actor, system,
                      jurisdiction, lifecycle stage, or
                      intended action.
                    </p>
                  </div>

                  <div className="inspectionActions">
                    <Link
                      href={selectedRecord.lawsHref}
                      className="secondaryAction"
                    >
                      View Source Records
                    </Link>

                    <Link
                      href={
                        selectedRecord.crosswalkHref
                      }
                      className="secondaryAction"
                    >
                      Open Crosswalks
                    </Link>

                    <Link
                      href={
                        selectedRecord.applicabilityHref
                      }
                      className="primaryAction"
                    >
                      Determine Applicability →
                    </Link>
                  </div>
                </>
              ) : (
                <div className="inspectionEmpty">
                  Select a regulatory domain to inspect its
                  scope and connected governance sources.
                </div>
              )}
            </aside>
          </div>
        </section>

        <section className="coverageSection">
          <div className="sectionHeading">
            <div>
              <p className="eyebrow">
                REGULATORY COVERAGE
              </p>

              <h2>
                See where the Library is strong and where
                coverage remains incomplete.
              </h2>
            </div>

            <p>
              Coverage indicates the current depth of
              Library records and connections. It does not
              measure legal sufficiency or guarantee that
              all applicable obligations are represented.
            </p>
          </div>

          <div className="coverageGrid">
            {coverageRecords.map((record) => (
              <article key={record.sector}>
                <div className="coverageHeading">
                  <div>
                    <span>{record.sector}</span>
                    <small>
                      {record.regulations} connected
                      records
                    </small>
                  </div>

                  <strong>{record.coverage}%</strong>
                </div>

                <div
                  className="coverageTrack"
                  aria-label={`${record.sector} coverage ${record.coverage}%`}
                >
                  <span
                    style={{
                      width: `${record.coverage}%`,
                    }}
                  />
                </div>

                <p
                  className={`coverageStatus ${record.status.toLowerCase()}`}
                >
                  {record.status} coverage
                </p>
              </article>
            ))}
          </div>

          <div className="coverageActionRow">
            <Link
              href="/governance-library/coverage"
              className="secondaryAction"
            >
              Open Full Coverage Analysis →
            </Link>
          </div>
        </section>

        <section className="relationshipSection">
          <div className="sectionHeading">
            <div>
              <p className="eyebrow">
                REGULATORY RELATIONSHIPS
              </p>

              <h2>
                Follow regulation into standards,
                frameworks, evidence, and governed routes.
              </h2>
            </div>

            <p>
              Relationships support navigation and
              analysis. They do not establish equivalence,
              incorporation, substituted compliance, or
              execution permission.
            </p>
          </div>

          <div className="relationshipMap">
            <Link
              href="/governance-library/regulations"
              className="mapNode primaryNode"
            >
              <span>01</span>
              <strong>Regulations</strong>
              <small>
                Binding and sector-specific obligations
              </small>
            </Link>

            <div className="mapConnector">→</div>

            <Link
              href="/governance-library/standards"
              className="mapNode"
            >
              <span>02</span>
              <strong>Standards</strong>
              <small>
                Management and technical controls
              </small>
            </Link>

            <div className="mapConnector">→</div>

            <Link
              href="/governance-library/crosswalks"
              className="mapNode"
            >
              <span>03</span>
              <strong>Crosswalks</strong>
              <small>
                Conceptual alignment and boundary analysis
              </small>
            </Link>

            <div className="mapConnector">→</div>

            <Link
              href="/governance-library/applicability"
              className="mapNode"
            >
              <span>04</span>
              <strong>Applicability</strong>
              <small>
                Actor, scope, jurisdiction, and time
              </small>
            </Link>

            <div className="mapConnector">→</div>

            <Link
              href="/workspace/ai-governance/routes"
              className="mapNode finalNode"
            >
              <span>05</span>
              <strong>Governed Route</strong>
              <small>
                Evidence-bound execution analysis
              </small>
            </Link>
          </div>
        </section>

        <section className="activitySection">
          <div className="sectionHeading">
            <div>
              <p className="eyebrow">
                REGULATORY ACTIVITY
              </p>

              <h2>
                Activity tied to governance work—not
                generic traffic.
              </h2>
            </div>

            <p>
              Activity records show how regulatory
              intelligence is being reviewed, connected,
              tested, and carried into the wider Exchange.
            </p>
          </div>

          <div className="activityGrid">
            {activityRecords.map((record, index) => (
              <article key={record.title}>
                <span className="activityIndex">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div>
                  <small>{record.type}</small>
                  <strong>{record.title}</strong>
                  <p>{record.detail}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="boundarySection">
          <div className="boundarySeal">
            <span>RB</span>
            <small>Regulatory boundary</small>
          </div>

          <p className="eyebrow gold">
            GOVERNANCE BOUNDARY
          </p>

          <h2>
            A regulation is not self-executing permission.
          </h2>

          <p>
            Regulatory sources may establish obligations,
            restrictions, duties, rights, documentation
            requirements, and enforcement consequences.
            They do not independently determine whether a
            specific source applies to a specific actor,
            system, jurisdiction, time, lifecycle stage,
            or intended action. Governed use requires
            authoritative source review, applicability
            analysis, admissible evidence, continuity,
            bounded interpretation, and controlled
            execution.
          </p>

          <div className="boundaryGrid">
            <article>
              <span>REGULATIONS MAY ESTABLISH</span>
              <strong>
                Legal obligations, prohibitions, duties,
                actor requirements, documentation, and
                enforcement conditions
              </strong>
            </article>

            <article>
              <span>REGULATIONS DO NOT AUTOMATICALLY PROVE</span>
              <strong>
                Applicability, conformity, compliance,
                evidence sufficiency, technical safety, or
                execution authority
              </strong>
            </article>

            <article>
              <span>GOVERNED PROGRESSION REQUIRES</span>
              <strong>
                Applicable authority, admissible evidence,
                continuity, determination, preserved
                reasoning, and controlled execution
              </strong>
            </article>
          </div>

          <div className="boundaryActions">
            <Link
              href="/governance-library/laws"
              className="secondaryAction"
            >
              View Laws
            </Link>

            <Link
              href="/governance-library/crosswalks"
              className="secondaryAction"
            >
              Open Crosswalks
            </Link>

            <Link
              href="/governance-library/applicability"
              className="primaryAction"
            >
              Determine Applicability →
            </Link>
          </div>
        </section>
      </div>

      <style jsx>{`
        .page {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          color: #f4f9fc;
          background:
            radial-gradient(
              circle at 50% -8%,
              rgba(35, 137, 181, 0.18),
              transparent 34%
            ),
            radial-gradient(
              circle at 8% 48%,
              rgba(91, 223, 241, 0.06),
              transparent 25%
            ),
            radial-gradient(
              circle at 92% 77%,
              rgba(231, 174, 65, 0.06),
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
          mask-image: linear-gradient(
            to bottom,
            black,
            transparent 88%
          );
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

        .shell {
          position: relative;
          z-index: 2;
          width: min(1520px, calc(100% - 40px));
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

        .topbarLink,
        .secondaryAction {
          color: #c4d5de;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(0, 0, 0, 0.18);
        }

        .topbarAction,
        .primaryAction {
          color: #041a23;
          border: 1px solid #aaf2ff;
          background: linear-gradient(
            135deg,
            #d9fbff,
            #76deef 64%,
            #38aeca
          );
        }

        .topbarLink {
          justify-self: start;
        }

        .topbarAction {
          justify-self: end;
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
          max-width: 1180px;
          margin: auto;
          padding: 88px 0 72px;
          text-align: center;
        }

        .heroSeal,
        .boundarySeal {
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
        .boundarySeal span {
          color: #ffe3a0;
          font: 900 30px Georgia, serif;
        }

        .heroSeal small,
        .boundarySeal small {
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
          font-size: clamp(52px, 6.2vw, 90px);
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
          max-width: 990px;
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

        .heroMetrics article,
        .inspectionMetrics article {
          padding: 18px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 16px;
          background: rgba(6, 20, 32, 0.58);
        }

        .heroMetrics span,
        .inspectionMetrics span {
          display: block;
          color: #f0d28f;
          font: 700 27px Georgia, serif;
        }

        .heroMetrics small,
        .inspectionMetrics small {
          display: block;
          margin-top: 5px;
          color: #788f9a;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.09em;
          text-transform: uppercase;
        }

        .controlSection,
        .directorySection,
        .coverageSection,
        .relationshipSection,
        .activitySection {
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

        .filterPanel {
          padding: 19px;
          display: grid;
          grid-template-columns:
            minmax(300px, 1.5fr)
            repeat(3, minmax(170px, 0.75fr))
            auto;
          gap: 12px;
          align-items: end;
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

        input:focus,
        select:focus {
          border-color: rgba(99, 230, 255, 0.42);
          box-shadow: 0 0 0 3px rgba(99, 230, 255, 0.06);
        }

        select option {
          color: #e8f2f5;
          background: #071520;
        }

        .clearButton {
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

        .resultBar {
          margin-top: 12px;
          padding: 15px 17px;
          display: flex;
          align-items: center;
          gap: 28px;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 16px;
          background: rgba(5, 18, 30, 0.66);
        }

        .resultBar > div {
          display: flex;
          align-items: baseline;
          gap: 8px;
        }

        .resultBar span {
          color: #efcc82;
          font: 700 23px Georgia, serif;
        }

        .resultBar small {
          color: #7c939e;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .directoryGrid {
          display: grid;
          grid-template-columns: minmax(0, 1.35fr) 430px;
          gap: 18px;
          align-items: start;
        }

        .recordGrid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
        }

        .recordCard,
        .inspectionPanel {
          border: 1px solid rgba(99, 230, 255, 0.12);
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
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.27);
        }

        .recordCard {
          padding: 22px;
          color: inherit;
          cursor: pointer;
          text-align: left;
          transition:
            transform 0.22s,
            border-color 0.22s,
            background 0.22s;
        }

        .recordCard:hover,
        .recordCard.active {
          transform: translateY(-3px);
          border-color: rgba(99, 230, 255, 0.32);
          background:
            radial-gradient(
              circle at 0 0,
              rgba(99, 230, 255, 0.09),
              transparent 30%
            ),
            linear-gradient(
              145deg,
              rgba(10, 33, 49, 0.98),
              rgba(3, 13, 22, 0.98)
            );
        }

        .recordTopline,
        .recordFooter,
        .inspectionHeader,
        .coverageHeading {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 14px;
        }

        .recordTopline > span:last-child {
          color: #8098a3;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.07em;
          text-transform: uppercase;
        }

        .statusBadge {
          display: inline-flex;
          padding: 6px 8px;
          border: 1px solid rgba(255, 255, 255, 0.11);
          border-radius: 999px;
          font-size: 7px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .statusBadge.active {
          color: #87edbd;
          border-color: rgba(114, 230, 178, 0.27);
          background: rgba(114, 230, 178, 0.06);
        }

        .statusBadge.developing {
          color: #f1cc7b;
          border-color: rgba(239, 199, 110, 0.25);
          background: rgba(239, 199, 110, 0.06);
        }

        .statusBadge.monitoring,
        .statusBadge.sector-specific {
          color: #8edff0;
          border-color: rgba(99, 230, 255, 0.23);
          background: rgba(99, 230, 255, 0.05);
        }

        .recordJurisdiction {
          margin: 20px 0 0;
          color: #69dcea;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .recordCard h3 {
          margin: 8px 0 0;
          font-size: 27px;
          line-height: 1.04;
        }

        .recordDescription {
          min-height: 92px;
          margin: 14px 0 0;
          color: #95aab4;
          font-size: 12px;
          line-height: 1.65;
        }

        .sectorList {
          margin-top: 17px;
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
        }

        .sectorList span,
        .relatedBlock div span {
          padding: 6px 8px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 999px;
          color: #91a8b2;
          background: rgba(0, 0, 0, 0.16);
          font-size: 7px;
          font-weight: 900;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .recordFooter {
          margin-top: 21px;
          padding-top: 16px;
          align-items: end;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
        }

        .recordFooter div {
          display: grid;
          gap: 3px;
        }

        .recordFooter strong {
          color: #efcc82;
          font: 700 23px Georgia, serif;
        }

        .recordFooter small {
          color: #738b96;
          font-size: 7px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .inspectAction {
          color: #eac778;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.07em;
          text-transform: uppercase;
        }

        .inspectionPanel {
          position: sticky;
          top: 20px;
          padding: 25px;
        }

        .inspectionHeader h3 {
          margin: 8px 0 0;
          font-size: 37px;
          line-height: 1;
        }

        .inspectionDescription {
          margin: 20px 0 0;
          color: #99adb6;
          font-size: 13px;
          line-height: 1.7;
        }

        .inspectionMetrics {
          margin-top: 20px;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 9px;
        }

        .inspectionMetrics article {
          padding: 14px 10px;
          text-align: center;
        }

        .inspectionMetrics span {
          font-size: 22px;
        }

        .factGrid {
          margin-top: 18px;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 9px;
        }

        .factGrid article {
          padding: 14px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 13px;
          background: rgba(0, 0, 0, 0.15);
        }

        .factGrid span,
        .relatedBlock > p,
        .inspectionBoundary span {
          color: #68dce9;
          font-size: 7px;
          font-weight: 900;
          letter-spacing: 0.09em;
          text-transform: uppercase;
        }

        .factGrid strong {
          display: block;
          margin-top: 7px;
          color: #d9e6ea;
          font-size: 11px;
          line-height: 1.4;
        }

        .relatedBlock {
          margin-top: 18px;
          padding: 16px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 14px;
          background: rgba(0, 0, 0, 0.13);
        }

        .relatedBlock > p {
          margin: 0;
        }

        .relatedBlock div {
          margin-top: 11px;
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
        }

        .inspectionBoundary {
          margin-top: 17px;
          padding: 16px;
          border: 1px solid rgba(239, 199, 110, 0.15);
          border-radius: 14px;
          background: rgba(239, 199, 110, 0.045);
        }

        .inspectionBoundary span {
          color: #ebc36d;
        }

        .inspectionBoundary p {
          margin: 8px 0 0;
          color: #9cadb5;
          font-size: 10px;
          line-height: 1.55;
        }

        .inspectionActions {
          margin-top: 18px;
          display: grid;
          gap: 9px;
        }

        .inspectionEmpty {
          min-height: 500px;
          display: grid;
          place-items: center;
          color: #7f96a1;
          text-align: center;
        }

        .emptyState {
          grid-column: 1 / -1;
          padding: 70px 25px;
          border: 1px dashed rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          color: #768e99;
          text-align: center;
        }

        .coverageGrid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
        }

        .coverageGrid article {
          padding: 21px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 18px;
          background: rgba(6, 20, 32, 0.68);
        }

        .coverageHeading span {
          color: #dce8ec;
          font-size: 13px;
          font-weight: 800;
        }

        .coverageHeading small {
          display: block;
          margin-top: 5px;
          color: #738b96;
          font-size: 8px;
          text-transform: uppercase;
        }

        .coverageHeading strong {
          color: #efcc82;
          font: 700 29px Georgia, serif;
        }

        .coverageTrack {
          height: 8px;
          margin-top: 18px;
          overflow: hidden;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.06);
        }

        .coverageTrack span {
          display: block;
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(
            90deg,
            #3fabc1,
            #88e3ed
          );
        }

        .coverageStatus {
          margin: 11px 0 0;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .coverageStatus.strong {
          color: #82e7b7;
        }

        .coverageStatus.developing {
          color: #efc774;
        }

        .coverageStatus.limited {
          color: #e89b78;
        }

        .coverageActionRow {
          margin-top: 17px;
          display: flex;
          justify-content: flex-end;
        }

        .relationshipMap {
          padding: 28px;
          display: grid;
          grid-template-columns:
            minmax(150px, 1fr)
            auto
            minmax(150px, 1fr)
            auto
            minmax(150px, 1fr)
            auto
            minmax(150px, 1fr)
            auto
            minmax(150px, 1fr);
          align-items: center;
          gap: 10px;
          border: 1px solid rgba(99, 230, 255, 0.12);
          border-radius: 24px;
          background: linear-gradient(
            145deg,
            rgba(9, 29, 44, 0.95),
            rgba(3, 13, 22, 0.98)
          );
        }

        .mapNode {
          min-height: 160px;
          padding: 18px;
          display: grid;
          align-content: center;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 17px;
          color: inherit;
          background: rgba(0, 0, 0, 0.14);
          text-decoration: none;
          text-align: center;
          transition:
            transform 0.22s,
            border-color 0.22s;
        }

        .mapNode:hover {
          transform: translateY(-3px);
          border-color: rgba(99, 230, 255, 0.3);
        }

        .mapNode.primaryNode,
        .mapNode.finalNode {
          border-color: rgba(239, 199, 110, 0.22);
          background: rgba(239, 199, 110, 0.045);
        }

        .mapNode span {
          color: #67dbe9;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.1em;
        }

        .mapNode strong {
          margin-top: 9px;
          font: 700 20px Georgia, serif;
        }

        .mapNode small {
          margin-top: 8px;
          color: #7e95a0;
          font-size: 9px;
          line-height: 1.45;
        }

        .mapConnector {
          color: #70919c;
          font-size: 20px;
          text-align: center;
        }

        .activityGrid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }

        .activityGrid article {
          padding: 21px;
          display: grid;
          grid-template-columns: 46px minmax(0, 1fr);
          gap: 15px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 18px;
          background: rgba(6, 20, 32, 0.68);
        }

        .activityIndex {
          width: 46px;
          height: 46px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(99, 230, 255, 0.17);
          border-radius: 12px;
          color: #68dce9;
          font-size: 8px;
          font-weight: 900;
        }

        .activityGrid small {
          color: #68dce9;
          font-size: 7px;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .activityGrid strong {
          display: block;
          margin-top: 5px;
          color: #dce8ec;
          font-size: 13px;
        }

        .activityGrid p {
          margin: 8px 0 0;
          color: #849ba5;
          font-size: 10px;
          line-height: 1.55;
        }

        .boundarySection {
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

        .boundarySeal {
          width: 82px;
          height: 82px;
          margin-bottom: 22px;
        }

        .boundarySeal span {
          font-size: 23px;
        }

        .boundarySeal small {
          font-size: 6px;
        }

        .boundarySection h2 {
          max-width: 1040px;
          margin: 14px auto 0;
        }

        .boundarySection > p:not(.eyebrow) {
          max-width: 1020px;
          margin: 23px auto 0;
          color: #a4b4bc;
          font-size: 15px;
          line-height: 1.78;
        }

        .boundaryGrid {
          max-width: 1120px;
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

        @media (max-width: 1320px) {
          .filterPanel {
            grid-template-columns: repeat(
              3,
              minmax(0, 1fr)
            );
          }

          .searchField {
            grid-column: span 2;
          }

          .relationshipMap {
            grid-template-columns: repeat(
              5,
              minmax(0, 1fr)
            );
          }

          .mapConnector {
            display: none;
          }
        }

        @media (max-width: 1120px) {
          .heroMetrics {
            grid-template-columns: repeat(
              3,
              minmax(0, 1fr)
            );
          }

          .directoryGrid {
            grid-template-columns: 1fr;
          }

          .inspectionPanel {
            position: static;
          }

          .coverageGrid {
            grid-template-columns: repeat(
              2,
              minmax(0, 1fr)
            );
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

          .relationshipMap {
            grid-template-columns: repeat(
              2,
              minmax(0, 1fr)
            );
          }

          .boundaryGrid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 700px) {
          .shell {
            width: calc(100% - 22px);
          }

          .topbar,
          .heroMetrics,
          .filterPanel,
          .recordGrid,
          .coverageGrid,
          .activityGrid,
          .relationshipMap,
          .inspectionMetrics,
          .factGrid {
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
            font-size: clamp(43px, 13vw, 66px);
          }

          .resultBar {
            align-items: flex-start;
            flex-direction: column;
          }

          .inspectionPanel,
          .boundarySection,
          .relationshipMap {
            padding: 21px;
          }

          .coverageActionRow {
            justify-content: stretch;
          }

          .coverageActionRow a {
            width: 100%;
          }

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
