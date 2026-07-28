"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { governanceLibraryRecords } from "../../../lib/governance-library";
import type { GovernanceLibraryRecord } from "../../../lib/governance-library/records-foundational";

type PublisherGroup = {
  publisher: string;
  records: GovernanceLibraryRecord[];
  recordTypes: string[];
  statuses: string[];
};

export default function GovernanceLibraryPublishersMatrixPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeRecordType, setActiveRecordType] = useState("All Record Types");
  const [activeStatus, setActiveStatus] = useState("All Statuses");
  const [expandedPublishers, setExpandedPublishers] = useState<string[]>([]);

  const publisherGroups = useMemo<PublisherGroup[]>(() => {
    const publisherNames = Array.from(
      new Set(governanceLibraryRecords.map((record) => record.publisher)),
    ).sort((a, b) => a.localeCompare(b));

    return publisherNames.map((publisher) => {
      const records = governanceLibraryRecords
        .filter((record) => record.publisher === publisher)
        .sort((a, b) => a.title.localeCompare(b.title));

      return {
        publisher,
        records,
        recordTypes: Array.from(
          new Set(records.map((record) => record.recordType)),
        ).sort(),
        statuses: Array.from(
          new Set(records.map((record) => record.status)),
        ).sort(),
      };
    });
  }, []);

  const recordTypes = useMemo(
    () => [
      "All Record Types",
      ...Array.from(
        new Set(
          governanceLibraryRecords.map((record) => record.recordType),
        ),
      ).sort(),
    ],
    [],
  );

  const statuses = useMemo(
    () => [
      "All Statuses",
      ...Array.from(
        new Set(governanceLibraryRecords.map((record) => record.status)),
      ).sort(),
    ],
    [],
  );

  const visiblePublisherGroups = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return publisherGroups
      .map((group) => {
        const records = group.records.filter((record) => {
          const matchesSearch =
            query.length === 0 ||
            [
              group.publisher,
              record.title,
              record.recordType,
              record.status,
              record.slug,
            ]
              .join(" ")
              .toLowerCase()
              .includes(query);

          const matchesRecordType =
            activeRecordType === "All Record Types" ||
            record.recordType === activeRecordType;

          const matchesStatus =
            activeStatus === "All Statuses" ||
            record.status === activeStatus;

          return matchesSearch && matchesRecordType && matchesStatus;
        });

        return {
          ...group,
          records,
          recordTypes: Array.from(
            new Set(records.map((record) => record.recordType)),
          ).sort(),
          statuses: Array.from(
            new Set(records.map((record) => record.status)),
          ).sort(),
        };
      })
      .filter((group) => group.records.length > 0);
  }, [
    activeRecordType,
    activeStatus,
    publisherGroups,
    searchQuery,
  ]);

  const visibleRecordCount = visiblePublisherGroups.reduce(
    (total, group) => total + group.records.length,
    0,
  );

  const activeFilterCount = [
    searchQuery.trim().length > 0,
    activeRecordType !== "All Record Types",
    activeStatus !== "All Statuses",
  ].filter(Boolean).length;

  function clearFilters() {
    setSearchQuery("");
    setActiveRecordType("All Record Types");
    setActiveStatus("All Statuses");
  }

  function togglePublisher(publisher: string) {
    setExpandedPublishers((current) =>
      current.includes(publisher)
        ? current.filter((item) => item !== publisher)
        : [...current, publisher],
    );
  }

  return (
    <main className="publisherMatrixPage">
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
            Publisher matrix indexed
          </div>

          <Link
            href="/governance-library/publishers"
            className="topbarAction"
          >
            Publisher Directory →
          </Link>
        </div>

        <header className="hero">
          <div className="heroSeal">
            <span>PM</span>
            <small>Publisher matrix</small>
          </div>

          <p className="eyebrow">TA-14 AI GOVERNANCE LIBRARY</p>

          <h1>
            Publisher
            <span> Matrix</span>
          </h1>

          <p className="lead">
            Explore governance publications grouped by issuing organization,
            standards body, regulator, public authority, research institution,
            or international governance organization.
          </p>

          <div className="heroMetrics">
            <article>
              <span>{publisherGroups.length}</span>
              <small>Publishers indexed</small>
            </article>

            <article>
              <span>{governanceLibraryRecords.length}</span>
              <small>Total records</small>
            </article>

            <article>
              <span>{recordTypes.length - 1}</span>
              <small>Record types</small>
            </article>

            <article>
              <span>{statuses.length - 1}</span>
              <small>Publication statuses</small>
            </article>

            <article>
              <span>{visibleRecordCount}</span>
              <small>Records shown</small>
            </article>
          </div>
        </header>

        <section className="definitionSection">
          <div className="definitionSeal">
            <span>IA</span>
            <small>Issuing authority</small>
          </div>

          <div>
            <p className="eyebrow gold">PUBLISHER GOVERNANCE</p>

            <h2>
              Every governance publication carries the authority, scope,
              mandate, and institutional limits of the body that issued it.
            </h2>
          </div>

          <p>
            The publisher matrix reveals who produced each law, standard,
            framework, principle set, recommendation, or guidance record. It
            helps distinguish regulatory authority from voluntary guidance,
            standards development, policy coordination, and institutional
            interpretation.
          </p>
        </section>

        <section className="controlSection">
          <div className="sectionHeading">
            <div>
              <p className="eyebrow">PUBLISHER CONTROL DESK</p>

              <h2>
                Search the institutions shaping AI governance worldwide.
              </h2>
            </div>

            <p>
              Filter publishers and their records by title, publisher name,
              record type, status, or library slug. Expand individual
              publisher groups to review their complete indexed publication
              portfolios.
            </p>
          </div>

          <div className="filterPanel">
            <label>
              Search publishers and records
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search NIST, ISO, OECD, European Union, framework..."
              />
            </label>

            <label>
              Record type
              <select
                value={activeRecordType}
                onChange={(event) =>
                  setActiveRecordType(event.target.value)
                }
              >
                {recordTypes.map((recordType) => (
                  <option key={recordType} value={recordType}>
                    {recordType}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Status
              <select
                value={activeStatus}
                onChange={(event) => setActiveStatus(event.target.value)}
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>

            <button type="button" onClick={clearFilters}>
              Clear filters
            </button>
          </div>

          <div className="resultBar">
            <div>
              <span>{visiblePublisherGroups.length}</span>
              <small>Publishers displayed</small>
            </div>

            <div>
              <span>{visibleRecordCount}</span>
              <small>Records displayed</small>
            </div>

            <div>
              <span>{activeFilterCount}</span>
              <small>Active filters</small>
            </div>
          </div>
        </section>

        <section className="matrixSection">
          {visiblePublisherGroups.length > 0 ? (
            <div className="publisherGrid">
              {visiblePublisherGroups.map((group, index) => {
                const isExpanded = expandedPublishers.includes(
                  group.publisher,
                );

                const visibleRecords = isExpanded
                  ? group.records
                  : group.records.slice(0, 4);

                return (
                  <section
                    key={group.publisher}
                    className="publisherCard"
                  >
                    <div className="publisherHeader">
                      <div className="publisherSeal">
                        {String(index + 1).padStart(2, "0")}
                      </div>

                      <div className="recordCount">
                        {group.records.length}{" "}
                        {group.records.length === 1 ? "record" : "records"}
                      </div>
                    </div>

                    <p className="publisherLabel">Issuing organization</p>

                    <h2>{group.publisher}</h2>

                    <div className="publisherMetadata">
                      <div>
                        <span>Record types</span>
                        <strong>{group.recordTypes.length}</strong>
                      </div>

                      <div>
                        <span>Statuses</span>
                        <strong>{group.statuses.length}</strong>
                      </div>

                      <div>
                        <span>Library records</span>
                        <strong>{group.records.length}</strong>
                      </div>
                    </div>

                    <div className="tagSection">
                      <span>Publication types</span>

                      <div className="tagList">
                        {group.recordTypes.map((recordType) => (
                          <strong key={recordType}>{recordType}</strong>
                        ))}
                      </div>
                    </div>

                    <div className="recordsHeading">
                      <span>Indexed publications</span>
                      <strong>
                        Showing {visibleRecords.length} of{" "}
                        {group.records.length}
                      </strong>
                    </div>

                    <div className="recordList">
                      {visibleRecords.map((record) => (
                        <Link
                          key={record.slug}
                          href={`/governance-library/${record.slug}`}
                          className="recordLink"
                        >
                          <div className="recordIcon">
                            {record.recordType.slice(0, 2).toUpperCase()}
                          </div>

                          <div className="recordContent">
                            <strong>{record.title}</strong>

                            <div>
                              <span>{record.recordType}</span>
                              <span>•</span>
                              <span>{record.status}</span>
                            </div>
                          </div>

                          <span className="recordArrow">→</span>
                        </Link>
                      ))}
                    </div>

                    {group.records.length > 4 ? (
                      <button
                        type="button"
                        className="expandButton"
                        onClick={() => togglePublisher(group.publisher)}
                      >
                        {isExpanded
                          ? "Show fewer records"
                          : `Show ${
                              group.records.length - 4
                            } more records`}
                      </button>
                    ) : null}

                    <div className="publisherActions">
                      <Link
                        href="/governance-library/publishers"
                        className="secondaryAction"
                      >
                        Publisher Directory
                      </Link>

                      <Link
                        href="/governance-library/crosswalks"
                        className="primaryAction"
                      >
                        View Crosswalks →
                      </Link>
                    </div>
                  </section>
                );
              })}
            </div>
          ) : (
            <div className="emptyState">
              <div className="emptySeal">0</div>

              <h2>No publishers match the current filters.</h2>

              <p>
                Reset the publisher control desk or search for a broader
                institution, record type, publication title, or status.
              </p>

              <button type="button" onClick={clearFilters}>
                Reset publisher matrix
              </button>
            </div>
          )}
        </section>

        <section className="authoritySection">
          <p className="eyebrow gold">PUBLISHER AUTHORITY MODEL</p>

          <h2>
            The identity of the publisher helps determine how a governance
            record should be interpreted and applied.
          </h2>

          <div className="authorityGrid">
            <article>
              <span>REGULATORY AUTHORITIES</span>
              <strong>
                Issue binding rules, official interpretations, compliance
                obligations, enforcement expectations, or supervisory
                guidance.
              </strong>
            </article>

            <article>
              <span>STANDARDS ORGANIZATIONS</span>
              <strong>
                Publish consensus standards, management-system requirements,
                technical specifications, and conformity structures.
              </strong>
            </article>

            <article>
              <span>POLICY INSTITUTIONS</span>
              <strong>
                Coordinate principles, recommendations, public policy,
                international alignment, and responsible-use expectations.
              </strong>
            </article>

            <article>
              <span>RESEARCH AND TECHNICAL BODIES</span>
              <strong>
                Develop risk frameworks, measurement methods, technical
                guidance, testing practices, and implementation resources.
              </strong>
            </article>
          </div>
        </section>

        <section className="admissibilitySection">
          <div className="admissibilitySeal">
            <span>PA</span>
            <small>Publisher authority</small>
          </div>

          <p className="eyebrow gold">
            PUBLICATION-TO-EXECUTION BOUNDARY
          </p>

          <h2>
            A publisher can establish authority, but a publication still must
            be connected to applicability, evidence, and execution conditions.
          </h2>

          <p>
            Publisher identity helps establish provenance and interpretive
            weight. It does not, by itself, prove that a publication applies to
            a specific entity, system, role, jurisdiction, or proposed action.
            Governance requires the record to be connected to the governed
            reality before it can support an admissibility decision.
          </p>

          <div className="governingChain">
            <span>PUBLISHER</span>
            <strong>→</strong>
            <span>PUBLICATION</span>
            <strong>→</strong>
            <span>AUTHORITY</span>
            <strong>→</strong>
            <span>APPLICABILITY</span>
            <strong>→</strong>
            <span>REQUIREMENT</span>
            <strong>→</strong>
            <span>EVIDENCE</span>
            <strong>→</strong>
            <span>EXECUTION</span>
          </div>

          <div className="admissibilityActions">
            <Link
              href="/governance-library/authorities"
              className="secondaryAction"
            >
              Authorities
            </Link>

            <Link
              href="/governance-library/applicability"
              className="secondaryAction"
            >
              Applicability
            </Link>

            <Link
              href="/governance-library/sources"
              className="secondaryAction"
            >
              Sources
            </Link>

            <Link
              href="/governance-library/governed-records"
              className="primaryAction"
            >
              Governed Records →
            </Link>
          </div>
        </section>
      </div>

      <style jsx>{`
        .publisherMatrixPage {
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
        h2 {
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

        .controlSection {
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
        .authoritySection h2,
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

        .filterPanel {
          padding: 19px;
          display: grid;
          grid-template-columns:
            minmax(260px, 1fr)
            minmax(210px, 0.55fr)
            minmax(180px, 0.42fr)
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

        .filterPanel button,
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

        .matrixSection {
          padding-top: 27px;
        }

        .publisherGrid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
          align-items: start;
        }

        .publisherCard {
          min-width: 0;
          padding: 23px;
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

        .publisherHeader {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .publisherSeal {
          width: 52px;
          height: 52px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(255, 198, 82, 0.3);
          border-radius: 50%;
          color: #f1ce83;
          background: rgba(255, 198, 82, 0.05);
          font: 700 14px Georgia, serif;
        }

        .recordCount {
          padding: 7px 9px;
          border: 1px solid rgba(113, 229, 181, 0.16);
          border-radius: 999px;
          color: #8fe0ba;
          background: rgba(113, 229, 181, 0.04);
          font-size: 7px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .publisherLabel {
          margin: 22px 0 0;
          color: #70dce9;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .publisherCard h2 {
          margin: 9px 0 0;
          color: #e6f0f3;
          font-size: 30px;
          line-height: 1.08;
        }

        .publisherMetadata {
          margin-top: 19px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
        }

        .publisherMetadata div {
          padding: 11px;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 11px;
          background: rgba(0, 0, 0, 0.13);
        }

        .publisherMetadata span {
          display: block;
          color: #6d8692;
          font-size: 6px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .publisherMetadata strong {
          display: block;
          margin-top: 5px;
          color: #efca7d;
          font: 700 19px Georgia, serif;
        }

        .tagSection {
          margin-top: 18px;
          padding: 14px;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 13px;
          background: rgba(0, 0, 0, 0.15);
        }

        .tagSection > span,
        .recordsHeading span {
          color: #6c8793;
          font-size: 7px;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .tagList {
          margin-top: 10px;
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .tagList strong {
          padding: 6px 8px;
          border: 1px solid rgba(99, 230, 255, 0.11);
          border-radius: 999px;
          color: #9fc4cd;
          background: rgba(99, 230, 255, 0.03);
          font-size: 7px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .recordsHeading {
          margin-top: 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .recordsHeading strong {
          color: #d1ae67;
          font-size: 8px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .recordList {
          margin-top: 10px;
          display: grid;
          gap: 8px;
        }

        .recordLink {
          padding: 12px;
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 11px;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 11px;
          color: inherit;
          background: rgba(0, 0, 0, 0.14);
          text-decoration: none;
          transition:
            transform 0.2s,
            border-color 0.2s,
            background 0.2s;
        }

        .recordLink:hover {
          transform: translateY(-2px);
          border-color: rgba(99, 230, 255, 0.25);
          background: rgba(99, 230, 255, 0.035);
        }

        .recordIcon {
          width: 36px;
          height: 36px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(255, 198, 82, 0.2);
          border-radius: 10px;
          color: #e8c476;
          background: rgba(255, 198, 82, 0.04);
          font-size: 8px;
          font-weight: 900;
        }

        .recordContent {
          min-width: 0;
        }

        .recordContent > strong {
          display: block;
          color: #d6e2e6;
          font-size: 11px;
          line-height: 1.4;
        }

        .recordContent div {
          margin-top: 5px;
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          color: #718b96;
          font-size: 7px;
          font-weight: 900;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .recordArrow {
          color: #72dce9;
          font-size: 15px;
        }

        .expandButton {
          margin-top: 12px;
          padding: 0;
          border: 0;
          color: #79dce9;
          background: none;
          cursor: pointer;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .publisherActions {
          margin-top: 18px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 9px;
        }

        .publisherActions .primaryAction,
        .publisherActions .secondaryAction {
          justify-self: stretch;
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

        .authoritySection {
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

        .authoritySection h2 {
          max-width: 1050px;
          margin-left: auto;
          margin-right: auto;
        }

        .authorityGrid {
          margin-top: 32px;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }

        .authorityGrid article {
          padding: 20px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 16px;
          background: rgba(0, 0, 0, 0.16);
        }

        .authorityGrid span {
          color: #efc66f;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.1em;
        }

        .authorityGrid strong {
          display: block;
          margin-top: 9px;
          color: #d6e1e5;
          font-size: 12px;
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
        }

        @media (max-width: 980px) {
          .filterPanel {
            grid-template-columns: 1fr 1fr;
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

          .publisherGrid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 680px) {
          .pageShell {
            width: calc(100% - 22px);
          }

          .topbar,
          .heroMetrics,
          .definitionSection,
          .filterPanel,
          .authorityGrid {
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

          .definitionSeal {
            margin: auto;
          }

          .definitionSection {
            text-align: center;
          }

          .resultBar {
            align-items: flex-start;
            flex-direction: column;
          }

          .publisherMetadata,
          .publisherActions {
            grid-template-columns: 1fr;
          }

          .authoritySection,
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
