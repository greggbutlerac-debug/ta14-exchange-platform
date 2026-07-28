"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { governanceLibraryRecords } from "../../../lib/governance-library";
import type { GovernanceLibraryRecord } from "../../../lib/governance-library/records-foundational";

type ReferenceRecord = GovernanceLibraryRecord & {
  officialUrl: string;
};

export default function GovernanceLibraryReferencesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeType, setActiveType] = useState("All Record Types");
  const [activePublisher, setActivePublisher] = useState("All Publishers");
  const [sortMode, setSortMode] = useState("Title");

  const referenceRecords = useMemo<ReferenceRecord[]>(
    () =>
      governanceLibraryRecords.filter(
        (record: GovernanceLibraryRecord): record is ReferenceRecord =>
          typeof record.officialUrl === "string" &&
          record.officialUrl.trim().length > 0,
      ),
    [],
  );

  const recordTypes = useMemo(
    () => [
      "All Record Types",
      ...Array.from(
        new Set(referenceRecords.map((record) => record.recordType)),
      ).sort(),
    ],
    [referenceRecords],
  );

  const publishers = useMemo(
    () => [
      "All Publishers",
      ...Array.from(
        new Set(referenceRecords.map((record) => record.publisher)),
      ).sort(),
    ],
    [referenceRecords],
  );

  const visibleRecords = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const filtered = referenceRecords.filter((record) => {
      const matchesType =
        activeType === "All Record Types" ||
        record.recordType === activeType;

      const matchesPublisher =
        activePublisher === "All Publishers" ||
        record.publisher === activePublisher;

      const matchesSearch =
        query.length === 0 ||
        [
          record.title,
          record.summary,
          record.publisher,
          record.recordType,
          record.officialUrl,
        ]
          .join(" ")
          .toLowerCase()
          .includes(query);

      return matchesType && matchesPublisher && matchesSearch;
    });

    return [...filtered].sort((a, b) => {
      if (sortMode === "Publisher") {
        return (
          a.publisher.localeCompare(b.publisher) ||
          a.title.localeCompare(b.title)
        );
      }

      if (sortMode === "Record Type") {
        return (
          a.recordType.localeCompare(b.recordType) ||
          a.title.localeCompare(b.title)
        );
      }

      return a.title.localeCompare(b.title);
    });
  }, [
    activePublisher,
    activeType,
    referenceRecords,
    searchQuery,
    sortMode,
  ]);

  const activeFilterCount = [
    searchQuery.trim().length > 0,
    activeType !== "All Record Types",
    activePublisher !== "All Publishers",
    sortMode !== "Title",
  ].filter(Boolean).length;

  function clearFilters() {
    setSearchQuery("");
    setActiveType("All Record Types");
    setActivePublisher("All Publishers");
    setSortMode("Title");
  }

  return (
    <main className="referencesPage">
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
            Official references indexed
          </div>

          <Link
            href="/governance-library/sources"
            className="topbarAction"
          >
            Browse Sources →
          </Link>
        </div>

        <header className="hero">
          <div className="heroSeal">
            <span>OR</span>
            <small>Official references</small>
          </div>

          <p className="eyebrow">TA-14 AI GOVERNANCE LIBRARY</p>

          <h1>
            Official
            <span> References</span>
          </h1>

          <p className="lead">
            Access the authoritative publications, laws, regulations,
            standards, frameworks, and institutional materials connected to
            governance library records.
          </p>

          <div className="heroMetrics">
            <article>
              <span>{referenceRecords.length}</span>
              <small>Official references</small>
            </article>

            <article>
              <span>{publishers.length - 1}</span>
              <small>Issuing publishers</small>
            </article>

            <article>
              <span>{recordTypes.length - 1}</span>
              <small>Record types</small>
            </article>

            <article>
              <span>{visibleRecords.length}</span>
              <small>References displayed</small>
            </article>

            <article>
              <span>{activeFilterCount}</span>
              <small>Active filters</small>
            </article>
          </div>
        </header>

        <section className="definitionSection">
          <div className="definitionSeal">
            <span>AR</span>
            <small>Authoritative record</small>
          </div>

          <div>
            <p className="eyebrow gold">SOURCE PROVENANCE</p>

            <h2>
              An official reference connects a library record to the
              publication issued by the originating authority.
            </h2>
          </div>

          <p>
            Official-source access supports provenance, verification, and
            independent review. It does not by itself prove that the referenced
            material applies to a specific entity, system, jurisdiction,
            lifecycle stage, role, or proposed execution.
          </p>
        </section>

        <section className="controlSection">
          <div className="sectionHeading">
            <div>
              <p className="eyebrow">REFERENCE CONTROL DESK</p>

              <h2>
                Search the authoritative materials behind the governance
                library.
              </h2>
            </div>

            <p>
              Filter official references by title, publisher, publication type,
              source address, or record summary.
            </p>
          </div>

          <div className="filterPanel">
            <label className="searchField">
              Search references
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search title, publisher, source, law, standard..."
              />
            </label>

            <label>
              Record type
              <select
                value={activeType}
                onChange={(event) => setActiveType(event.target.value)}
              >
                {recordTypes.map((recordType) => (
                  <option key={recordType} value={recordType}>
                    {recordType}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Publisher
              <select
                value={activePublisher}
                onChange={(event) =>
                  setActivePublisher(event.target.value)
                }
              >
                {publishers.map((publisher) => (
                  <option key={publisher} value={publisher}>
                    {publisher}
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
                <option>Title</option>
                <option>Publisher</option>
                <option>Record Type</option>
              </select>
            </label>

            <button type="button" onClick={clearFilters}>
              Clear filters
            </button>
          </div>

          <div className="resultBar">
            <div>
              <span>{visibleRecords.length}</span>
              <small>References shown</small>
            </div>

            <div>
              <span>{referenceRecords.length}</span>
              <small>Total official sources</small>
            </div>

            <div>
              <span>{activeFilterCount}</span>
              <small>Filters applied</small>
            </div>
          </div>
        </section>

        <section className="referencesSection">
          {visibleRecords.length > 0 ? (
            <div className="referenceGrid">
              {visibleRecords.map((record, index) => (
                <article key={record.slug} className="referenceCard">
                  <div className="referenceHeader">
                    <div className="referenceNumber">
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    <span className="officialBadge">
                      Official source
                    </span>
                  </div>

                  <div className="referenceTags">
                    <span>{record.recordType}</span>
                    <span>{record.publisher}</span>
                  </div>

                  <h2>{record.title}</h2>

                  <p className="summary">{record.summary}</p>

                  <div className="sourceIdentity">
                    <span>Issuing authority</span>
                    <strong>{record.publisher}</strong>
                  </div>

                  <div className="sourceAddress">
                    <span>Official reference address</span>
                    <strong>{record.officialUrl}</strong>
                  </div>

                  <div className="referenceBoundary">
                    <span>Reference function</span>

                    <p>
                      Supports source verification, provenance review, and
                      direct access to the originating publication.
                    </p>
                  </div>

                  <div className="referenceActions">
                    <Link
                      href={`/governance-library/${record.slug}`}
                      className="secondaryAction"
                    >
                      View Library Record
                    </Link>

                    <a
                      href={record.officialUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="primaryAction"
                    >
                      Open Official Source →
                    </a>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="emptyState">
              <div className="emptySeal">0</div>

              <h2>No official references match the current filters.</h2>

              <p>
                Reset the reference controls or search for a broader title,
                publisher, record type, or source address.
              </p>

              <button type="button" onClick={clearFilters}>
                Reset reference directory
              </button>
            </div>
          )}
        </section>

        <section className="referenceModelSection">
          <p className="eyebrow gold">REFERENCE REVIEW MODEL</p>

          <h2>
            Official material should remain connected to provenance,
            applicability, interpretation, evidence, and execution.
          </h2>

          <div className="modelGrid">
            <article>
              <span>01</span>
              <strong>Identify the issuer</strong>
              <p>
                Confirm the institution, regulator, legislature, standards
                body, or technical authority responsible for the publication.
              </p>
            </article>

            <article>
              <span>02</span>
              <strong>Confirm the publication</strong>
              <p>
                Verify the official title, source location, publication type,
                and authoritative version of the referenced material.
              </p>
            </article>

            <article>
              <span>03</span>
              <strong>Determine applicability</strong>
              <p>
                Establish whether the material governs the relevant
                jurisdiction, organization, system, role, sector, or use case.
              </p>
            </article>

            <article>
              <span>04</span>
              <strong>Interpret the requirement</strong>
              <p>
                Identify the obligation, expectation, control, principle,
                prohibition, or evidence requirement created by the source.
              </p>
            </article>

            <article>
              <span>05</span>
              <strong>Bind required evidence</strong>
              <p>
                Define what must be demonstrated before the proposed activity
                can be accepted, reviewed, or permitted to proceed.
              </p>
            </article>

            <article>
              <span>06</span>
              <strong>Preserve the outcome</strong>
              <p>
                Record how the source was applied, what decision followed, and
                whether the governed result satisfied the required condition.
              </p>
            </article>
          </div>
        </section>

        <section className="sourceClassesSection">
          <div className="sectionHeading">
            <div>
              <p className="eyebrow">OFFICIAL SOURCE CLASSES</p>

              <h2>
                Different publication classes carry different forms of
                authority.
              </h2>
            </div>

            <p>
              The source class helps explain how the material should be
              interpreted, but the actual effect depends on mandate,
              jurisdiction, adoption, contractual use, and operating context.
            </p>
          </div>

          <div className="classGrid">
            <article>
              <span>LAW</span>
              <strong>Legislatively enacted legal authority</strong>
              <p>
                Establishes rights, duties, prohibitions, powers, or
                enforcement structures within a defined jurisdiction.
              </p>
            </article>

            <article>
              <span>REGULATION</span>
              <strong>Binding regulatory requirements</strong>
              <p>
                Converts statutory authority into enforceable obligations,
                procedural requirements, and supervisory expectations.
              </p>
            </article>

            <article>
              <span>STANDARD</span>
              <strong>Consensus technical or management criteria</strong>
              <p>
                Defines repeatable requirements, controls, processes,
                measurements, or conformity-assessment structures.
              </p>
            </article>

            <article>
              <span>FRAMEWORK</span>
              <strong>Structured governance methodology</strong>
              <p>
                Organizes functions, outcomes, practices, and implementation
                pathways for managing AI systems and associated risks.
              </p>
            </article>

            <article>
              <span>GUIDANCE</span>
              <strong>Interpretive or implementation direction</strong>
              <p>
                Explains expected practices, recommended controls,
                implementation methods, or supervisory interpretation.
              </p>
            </article>

            <article>
              <span>PRINCIPLE</span>
              <strong>High-level governance expectation</strong>
              <p>
                Establishes values, objectives, or public-interest commitments
                that may later be translated into more specific requirements.
              </p>
            </article>
          </div>
        </section>

        <section className="admissibilitySection">
          <div className="admissibilitySeal">
            <span>SR</span>
            <small>Source record</small>
          </div>

          <p className="eyebrow gold">REFERENCE-TO-EXECUTION BOUNDARY</p>

          <h2>
            An official source proves where the governing material came from.
            Admissibility requires proof that it governs the proposed action.
          </h2>

          <p>
            Source authority, applicability, requirement interpretation,
            evidence validation, and execution control must remain distinct.
            A valid publication can still be irrelevant to a particular
            decision, entity, system, or operational condition.
          </p>

          <div className="governingChain">
            <span>OFFICIAL SOURCE</span>
            <strong>→</strong>
            <span>PROVENANCE</span>
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
              href="/governance-library/sources"
              className="secondaryAction"
            >
              Sources
            </Link>

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
              href="/governance-library/all"
              className="primaryAction"
            >
              Browse All Records →
            </Link>
          </div>
        </section>
      </div>

      <style jsx>{`
        .referencesPage {
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

        .controlSection,
        .sourceClassesSection {
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
        .referenceModelSection h2,
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
            minmax(280px, 1.25fr)
            minmax(190px, 0.6fr)
            minmax(210px, 0.7fr)
            minmax(150px, 0.4fr)
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

        .referencesSection {
          padding-top: 27px;
        }

        .referenceGrid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
          align-items: start;
        }

        .referenceCard {
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

        .referenceHeader {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .referenceNumber {
          width: 54px;
          height: 54px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(255, 198, 82, 0.3);
          border-radius: 50%;
          color: #f1ce83;
          background: rgba(255, 198, 82, 0.05);
          font: 700 15px Georgia, serif;
        }

        .officialBadge {
          padding: 7px 10px;
          border: 1px solid rgba(113, 229, 181, 0.18);
          border-radius: 999px;
          color: #8fe0ba;
          background: rgba(113, 229, 181, 0.04);
          font-size: 7px;
          font-weight: 900;
          letter-spacing: 0.09em;
          text-transform: uppercase;
        }

        .referenceTags {
          margin-top: 19px;
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
        }

        .referenceTags span {
          padding: 6px 8px;
          border: 1px solid rgba(99, 230, 255, 0.11);
          border-radius: 999px;
          color: #9fc4cd;
          background: rgba(99, 230, 255, 0.03);
          font-size: 7px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .referenceCard h2 {
          margin: 15px 0 0;
          color: #e7f0f3;
          font-size: 30px;
          line-height: 1.08;
        }

        .summary {
          margin: 14px 0 0;
          color: #9aafb9;
          font-size: 12px;
          line-height: 1.68;
        }

        .sourceIdentity,
        .sourceAddress,
        .referenceBoundary {
          margin-top: 16px;
          padding: 14px;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 13px;
          background: rgba(0, 0, 0, 0.14);
        }

        .sourceIdentity span,
        .sourceAddress span,
        .referenceBoundary span {
          color: #6c8793;
          font-size: 7px;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .sourceIdentity strong,
        .sourceAddress strong {
          display: block;
          margin-top: 7px;
          color: #d4e1e5;
          font-size: 10px;
          line-height: 1.45;
        }

        .sourceAddress strong {
          overflow-wrap: anywhere;
          color: #80cfdb;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
            monospace;
          font-size: 8px;
        }

        .referenceBoundary p {
          margin: 7px 0 0;
          color: #9caeb6;
          font-size: 10px;
          line-height: 1.55;
        }

        .referenceActions {
          margin-top: 18px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        .referenceActions .primaryAction,
        .referenceActions .secondaryAction {
          justify-self: stretch;
          padding: 0 10px;
          text-align: center;
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

        .referenceModelSection {
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

        .referenceModelSection h2 {
          max-width: 1080px;
          margin-left: auto;
          margin-right: auto;
        }

        .modelGrid,
        .classGrid {
          margin-top: 32px;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
        }

        .modelGrid article,
        .classGrid article {
          padding: 21px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 16px;
          background: rgba(0, 0, 0, 0.16);
          text-align: left;
        }

        .modelGrid article > span,
        .classGrid article > span {
          color: #efc66f;
          font: 700 18px Georgia, serif;
        }

        .modelGrid strong,
        .classGrid strong {
          display: block;
          margin-top: 10px;
          color: #dce8ec;
          font-size: 12px;
        }

        .modelGrid p,
        .classGrid p {
          margin: 8px 0 0;
          color: #879ea8;
          font-size: 10px;
          line-height: 1.55;
        }

        .classGrid article > span {
          font-family: inherit;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.1em;
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

          .referenceGrid {
            grid-template-columns: 1fr;
          }

          .modelGrid,
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
          .modelGrid,
          .classGrid,
          .referenceActions {
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

          .referenceModelSection,
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
