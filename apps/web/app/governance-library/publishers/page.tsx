"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { governanceLibraryRecords } from "../../../lib/governance-library";
import type { GovernanceLibraryRecord } from "../../../lib/governance-library/records-foundational";

type PublisherSummary = {
  name: string;
  records: GovernanceLibraryRecord[];
  recordTypes: string[];
  statuses: string[];
};

export default function GovernancePublishersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeRecordType, setActiveRecordType] = useState("All Record Types");
  const [activeStatus, setActiveStatus] = useState("All Statuses");
  const [sortMode, setSortMode] = useState("Alphabetical");

  const publisherSummaries = useMemo<PublisherSummary[]>(() => {
    const names = Array.from(
      new Set(
        governanceLibraryRecords.map(
          (record: GovernanceLibraryRecord) => record.publisher,
        ),
      ),
    );

    return names.map((name) => {
      const records = governanceLibraryRecords.filter(
        (record: GovernanceLibraryRecord) => record.publisher === name,
      );

      return {
        name,
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
          governanceLibraryRecords.map(
            (record: GovernanceLibraryRecord) => record.recordType,
          ),
        ),
      ).sort(),
    ],
    [],
  );

  const statuses = useMemo(
    () => [
      "All Statuses",
      ...Array.from(
        new Set(
          governanceLibraryRecords.map(
            (record: GovernanceLibraryRecord) => record.status,
          ),
        ),
      ).sort(),
    ],
    [],
  );

  const visiblePublishers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const filtered = publisherSummaries.filter((publisher) => {
      const matchingRecords = publisher.records.filter((record) => {
        const matchesRecordType =
          activeRecordType === "All Record Types" ||
          record.recordType === activeRecordType;

        const matchesStatus =
          activeStatus === "All Statuses" ||
          record.status === activeStatus;

        return matchesRecordType && matchesStatus;
      });

      const matchesSearch =
        query.length === 0 ||
        [
          publisher.name,
          ...publisher.recordTypes,
          ...publisher.statuses,
          ...publisher.records.map((record) => record.title),
        ]
          .join(" ")
          .toLowerCase()
          .includes(query);

      return matchesSearch && matchingRecords.length > 0;
    });

    return [...filtered].sort((a, b) => {
      if (sortMode === "Most Records") {
        return b.records.length - a.records.length || a.name.localeCompare(b.name);
      }

      if (sortMode === "Fewest Records") {
        return a.records.length - b.records.length || a.name.localeCompare(b.name);
      }

      return a.name.localeCompare(b.name);
    });
  }, [
    activeRecordType,
    activeStatus,
    publisherSummaries,
    searchQuery,
    sortMode,
  ]);

  const activeFilterCount = [
    searchQuery.trim().length > 0,
    activeRecordType !== "All Record Types",
    activeStatus !== "All Statuses",
    sortMode !== "Alphabetical",
  ].filter(Boolean).length;

  const totalVisibleRecords = visiblePublishers.reduce(
    (total, publisher) => total + publisher.records.length,
    0,
  );

  function clearFilters() {
    setSearchQuery("");
    setActiveRecordType("All Record Types");
    setActiveStatus("All Statuses");
    setSortMode("Alphabetical");
  }

  return (
    <main className="publishersPage">
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
            Publisher directory active
          </div>

          <Link
            href="/governance-library/publisher-matrix"
            className="topbarAction"
          >
            Open Publisher Matrix →
          </Link>
        </div>

        <header className="hero">
          <div className="heroSeal">
            <span>GP</span>
            <small>Governance publishers</small>
          </div>

          <p className="eyebrow">TA-14 AI GOVERNANCE LIBRARY</p>

          <h1>
            Governance
            <span> Publishers</span>
          </h1>

          <p className="lead">
            Browse the organizations, regulators, standards bodies,
            institutions, technical authorities, and policy organizations that
            issue the records shaping AI governance.
          </p>

          <div className="heroMetrics">
            <article>
              <span>{publisherSummaries.length}</span>
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
              <small>Statuses represented</small>
            </article>

            <article>
              <span>{visiblePublishers.length}</span>
              <small>Publishers shown</small>
            </article>
          </div>
        </header>

        <section className="definitionSection">
          <div className="definitionSeal">
            <span>IA</span>
            <small>Issuing authority</small>
          </div>

          <div>
            <p className="eyebrow gold">PUBLISHER IDENTITY</p>

            <h2>
              The issuing organization helps establish a governance record’s
              provenance, authority, mandate, and interpretive weight.
            </h2>
          </div>

          <p>
            Publisher identity does not automatically establish applicability.
            A record may be legally binding, voluntary, advisory, technical, or
            institutional depending on who issued it, why it was issued, and
            how it connects to a specific jurisdiction, sector, role, or
            governed system.
          </p>
        </section>

        <section className="controlSection">
          <div className="sectionHeading">
            <div>
              <p className="eyebrow">PUBLISHER CONTROL DESK</p>

              <h2>
                Search and compare the institutions behind AI governance
                records.
              </h2>
            </div>

            <p>
              Filter the publisher directory by organization name, indexed
              publication, record type, status, or portfolio size.
            </p>
          </div>

          <div className="filterPanel">
            <label>
              Search publishers
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

            <label>
              Sort
              <select
                value={sortMode}
                onChange={(event) => setSortMode(event.target.value)}
              >
                <option>Alphabetical</option>
                <option>Most Records</option>
                <option>Fewest Records</option>
              </select>
            </label>

            <button type="button" onClick={clearFilters}>
              Clear filters
            </button>
          </div>

          <div className="resultBar">
            <div>
              <span>{visiblePublishers.length}</span>
              <small>Publishers displayed</small>
            </div>

            <div>
              <span>{totalVisibleRecords}</span>
              <small>Indexed records</small>
            </div>

            <div>
              <span>{activeFilterCount}</span>
              <small>Active filters</small>
            </div>
          </div>
        </section>

        <section className="publisherSection">
          {visiblePublishers.length > 0 ? (
            <div className="publisherGrid">
              {visiblePublishers.map((publisher, index) => (
                <article key={publisher.name} className="publisherCard">
                  <div className="publisherHeader">
                    <div className="publisherSeal">
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    <div className="recordCount">
                      {publisher.records.length}{" "}
                      {publisher.records.length === 1 ? "record" : "records"}
                    </div>
                  </div>

                  <p className="publisherLabel">Issuing organization</p>

                  <h2>{publisher.name}</h2>

                  <div className="publisherMetrics">
                    <div>
                      <span>Records</span>
                      <strong>{publisher.records.length}</strong>
                    </div>

                    <div>
                      <span>Record types</span>
                      <strong>{publisher.recordTypes.length}</strong>
                    </div>

                    <div>
                      <span>Statuses</span>
                      <strong>{publisher.statuses.length}</strong>
                    </div>
                  </div>

                  <div className="tagBlock">
                    <span>Publication types</span>

                    <div className="tagList">
                      {publisher.recordTypes.map((recordType) => (
                        <strong key={recordType}>{recordType}</strong>
                      ))}
                    </div>
                  </div>

                  <div className="statusBlock">
                    <span>Record statuses</span>

                    <div className="tagList">
                      {publisher.statuses.map((status) => (
                        <strong key={status}>{status}</strong>
                      ))}
                    </div>
                  </div>

                  <div className="recordPreview">
                    <div className="previewHeading">
                      <span>Indexed publication preview</span>
                      <strong>
                        {Math.min(publisher.records.length, 3)} shown
                      </strong>
                    </div>

                    <div className="previewList">
                      {publisher.records.slice(0, 3).map((record) => (
                        <Link
                          key={record.slug}
                          href={`/governance-library/${record.slug}`}
                          className="previewLink"
                        >
                          <div>
                            <strong>{record.title}</strong>

                            <span>
                              {record.recordType} · {record.status}
                            </span>
                          </div>

                          <span className="previewArrow">→</span>
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="publisherActions">
                    <Link
                      href="/governance-library/all"
                      className="secondaryAction"
                    >
                      Browse All Records
                    </Link>

                    <Link
                      href="/governance-library/publisher-matrix"
                      className="primaryAction"
                    >
                      Open Matrix →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="emptyState">
              <div className="emptySeal">0</div>

              <h2>No publishers match the current filters.</h2>

              <p>
                Reset the publisher directory or search for a broader
                organization, publication title, record type, or status.
              </p>

              <button type="button" onClick={clearFilters}>
                Reset publisher directory
              </button>
            </div>
          )}
        </section>

        <section className="publisherClasses">
          <p className="eyebrow gold">PUBLISHER CLASSES</p>

          <h2>
            Different publishers contribute different forms of governance
            authority.
          </h2>

          <div className="classGrid">
            <article>
              <span>REGULATORS</span>
              <strong>
                Issue binding rules, supervisory expectations, enforcement
                requirements, official interpretations, and compliance
                obligations.
              </strong>
            </article>

            <article>
              <span>STANDARDS BODIES</span>
              <strong>
                Develop consensus standards, technical requirements,
                management systems, and conformity-assessment structures.
              </strong>
            </article>

            <article>
              <span>POLICY ORGANIZATIONS</span>
              <strong>
                Publish principles, recommendations, public-interest
                frameworks, and international governance expectations.
              </strong>
            </article>

            <article>
              <span>TECHNICAL INSTITUTIONS</span>
              <strong>
                Produce risk frameworks, implementation methods, testing
                practices, scientific guidance, and operational resources.
              </strong>
            </article>

            <article>
              <span>LEGISLATIVE AUTHORITIES</span>
              <strong>
                Enact laws, establish legal duties, define rights, assign
                responsibilities, and create enforcement structures.
              </strong>
            </article>

            <article>
              <span>SECTOR AUTHORITIES</span>
              <strong>
                Translate broader governance expectations into sector-specific
                obligations, controls, evidence requirements, and review paths.
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
            PUBLISHER-TO-EXECUTION BOUNDARY
          </p>

          <h2>
            Publisher identity establishes provenance. Applicability
            establishes whether the record governs the proposed action.
          </h2>

          <p>
            A recognized publisher may create authoritative governance
            material, but the organization must still prove that the record
            applies to the relevant entity, jurisdiction, system, role, use
            case, lifecycle stage, and execution decision.
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
              href="/governance-library/sources"
              className="secondaryAction"
            >
              Sources
            </Link>

            <Link
              href="/governance-library/applicability"
              className="secondaryAction"
            >
              Applicability
            </Link>

            <Link
              href="/governance-library/publisher-matrix"
              className="primaryAction"
            >
              Publisher Matrix →
            </Link>
          </div>
        </section>
      </div>

      <style jsx>{`
        .publishersPage {
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
        .publisherClasses h2,
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
            minmax(250px, 1fr)
            minmax(190px, 0.55fr)
            minmax(170px, 0.45fr)
            minmax(160px, 0.4fr)
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

        .publisherSection {
          padding-top: 27px;
        }

        .publisherGrid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
          align-items: start;
        }

        .publisherCard {
          min-width: 0;
          padding: 22px;
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
          font-size: 27px;
          line-height: 1.08;
        }

        .publisherMetrics {
          margin-top: 19px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 7px;
        }

        .publisherMetrics div {
          padding: 10px;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 10px;
          background: rgba(0, 0, 0, 0.13);
        }

        .publisherMetrics span {
          display: block;
          color: #6d8692;
          font-size: 6px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .publisherMetrics strong {
          display: block;
          margin-top: 5px;
          color: #efca7d;
          font: 700 18px Georgia, serif;
        }

        .tagBlock,
        .statusBlock,
        .recordPreview {
          margin-top: 16px;
          padding: 13px;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 13px;
          background: rgba(0, 0, 0, 0.14);
        }

        .tagBlock > span,
        .statusBlock > span,
        .previewHeading span {
          color: #6c8793;
          font-size: 7px;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .tagList {
          margin-top: 9px;
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

        .previewHeading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .previewHeading strong {
          color: #d1ae67;
          font-size: 7px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .previewList {
          margin-top: 9px;
          display: grid;
          gap: 7px;
        }

        .previewLink {
          padding: 10px;
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: center;
          gap: 10px;
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 9px;
          color: inherit;
          background: rgba(255, 255, 255, 0.012);
          text-decoration: none;
          transition:
            transform 0.2s,
            border-color 0.2s;
        }

        .previewLink:hover {
          transform: translateY(-2px);
          border-color: rgba(99, 230, 255, 0.22);
        }

        .previewLink strong {
          display: block;
          color: #cbd8dd;
          font-size: 9px;
          line-height: 1.4;
        }

        .previewLink div > span {
          display: block;
          margin-top: 4px;
          color: #6f8792;
          font-size: 7px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .previewArrow {
          color: #72dce9;
          font-size: 14px;
        }

        .publisherActions {
          margin-top: 17px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        .publisherActions .primaryAction,
        .publisherActions .secondaryAction {
          justify-self: stretch;
          padding: 0 10px;
          font-size: 8px;
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

        .publisherClasses {
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

        .publisherClasses h2 {
          max-width: 1040px;
          margin-left: auto;
          margin-right: auto;
        }

        .classGrid {
          margin-top: 32px;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
        }

        .classGrid article {
          padding: 20px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 16px;
          background: rgba(0, 0, 0, 0.16);
        }

        .classGrid span {
          color: #efc66f;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.1em;
        }

        .classGrid strong {
          display: block;
          margin-top: 9px;
          color: #d6e1e5;
          font-size: 11px;
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

          .filterPanel {
            grid-template-columns: repeat(2, 1fr);
          }

          .filterPanel button {
            grid-column: 1 / -1;
          }

          .publisherGrid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
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

          .classGrid {
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
          .filterPanel,
          .publisherGrid,
          .classGrid {
            grid-template-columns: 1fr;
          }

          .filterPanel button {
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

          .resultBar {
            align-items: flex-start;
            flex-direction: column;
          }

          .publisherMetrics,
          .publisherActions {
            grid-template-columns: 1fr;
          }

          .publisherClasses,
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
