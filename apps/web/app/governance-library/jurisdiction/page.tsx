"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  governanceLibraryRecords,
} from "../../../lib/governance-library";
import { getAllJurisdictions } from "../../../lib/governance-library/filters";
import type {
  GovernanceLibraryRecord,
} from "../../../lib/governance-library/records-foundational";

type JurisdictionEntry = {
  name: string;
  slug: string;
  count: number;
  firstLetter: string;
  recordTypes: string[];
  publishers: string[];
  records: GovernanceLibraryRecord[];
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function getFirstLetter(value: string) {
  const firstCharacter = value.trim().charAt(0).toUpperCase();

  return /^[A-Z]$/.test(firstCharacter)
    ? firstCharacter
    : "#";
}

export default function GovernanceJurisdictionsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeLetter, setActiveLetter] = useState("All");
  const [expandedJurisdictions, setExpandedJurisdictions] =
    useState<string[]>([]);

  const jurisdictions = useMemo<JurisdictionEntry[]>(() => {
    return getAllJurisdictions()
      .map((jurisdiction: string) => {
        const records = governanceLibraryRecords
          .filter(
            (record: GovernanceLibraryRecord) =>
              record.jurisdiction === jurisdiction,
          )
          .sort((a, b) => a.title.localeCompare(b.title));

        return {
          name: jurisdiction,
          slug: slugify(jurisdiction),
          count: records.length,
          firstLetter: getFirstLetter(jurisdiction),
          recordTypes: Array.from(
            new Set(records.map((record) => record.recordType)),
          ).sort(),
          publishers: Array.from(
            new Set(records.map((record) => record.publisher)),
          ).sort(),
          records,
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  const availableLetters = useMemo(
    () =>
      Array.from(
        new Set(
          jurisdictions.map(
            (jurisdiction) => jurisdiction.firstLetter,
          ),
        ),
      ).sort((a, b) => {
        if (a === "#") {
          return 1;
        }

        if (b === "#") {
          return -1;
        }

        return a.localeCompare(b);
      }),
    [jurisdictions],
  );

  const visibleJurisdictions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return jurisdictions.filter((jurisdiction) => {
      const matchesLetter =
        activeLetter === "All" ||
        jurisdiction.firstLetter === activeLetter;

      const matchesSearch =
        query.length === 0 ||
        jurisdiction.name.toLowerCase().includes(query) ||
        jurisdiction.recordTypes.some((recordType) =>
          recordType.toLowerCase().includes(query),
        ) ||
        jurisdiction.publishers.some((publisher) =>
          publisher.toLowerCase().includes(query),
        ) ||
        jurisdiction.records.some((record) =>
          record.title.toLowerCase().includes(query),
        );

      return matchesLetter && matchesSearch;
    });
  }, [activeLetter, jurisdictions, searchQuery]);

  const totalRecordConnections = jurisdictions.reduce(
    (total, jurisdiction) => total + jurisdiction.count,
    0,
  );

  const totalPublishers = new Set(
    jurisdictions.flatMap(
      (jurisdiction) => jurisdiction.publishers,
    ),
  ).size;

  const largestJurisdiction = [...jurisdictions].sort(
    (a, b) => b.count - a.count,
  )[0];

  const activeFilterCount = [
    searchQuery.trim().length > 0,
    activeLetter !== "All",
  ].filter(Boolean).length;

  function toggleJurisdiction(name: string) {
    setExpandedJurisdictions((current) =>
      current.includes(name)
        ? current.filter((item) => item !== name)
        : [...current, name],
    );
  }

  function clearFilters() {
    setSearchQuery("");
    setActiveLetter("All");
  }

  return (
    <main className="jurisdictionsPage">
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
            Jurisdiction index active
          </div>

          <Link
            href="/governance-library/authorities"
            className="topbarAction"
          >
            Open Authorities →
          </Link>
        </div>

        <header className="hero">
          <div className="heroSeal">
            <span>JX</span>
            <small>Jurisdiction index</small>
          </div>

          <p className="eyebrow">
            TA-14 AI GOVERNANCE LIBRARY
          </p>

          <h1>
            Governance
            <span> Jurisdictions</span>
          </h1>

          <p className="lead">
            Browse governance records by country, region,
            international body, standards jurisdiction, or governing
            authority context while preserving the source boundaries
            that determine where each instrument applies.
          </p>

          <div className="heroMetrics">
            <article>
              <span>{jurisdictions.length}</span>
              <small>Jurisdictions indexed</small>
            </article>

            <article>
              <span>{totalRecordConnections}</span>
              <small>Record connections</small>
            </article>

            <article>
              <span>{totalPublishers}</span>
              <small>Publishers represented</small>
            </article>

            <article>
              <span>{largestJurisdiction?.count ?? 0}</span>
              <small>Largest jurisdiction set</small>
            </article>

            <article>
              <span>{visibleJurisdictions.length}</span>
              <small>Jurisdictions shown</small>
            </article>
          </div>
        </header>

        <section className="controlSection">
          <div className="sectionHeading">
            <div>
              <p className="eyebrow">
                JURISDICTION CONTROL DESK
              </p>

              <h2>
                Find where governance authority originates.
              </h2>
            </div>

            <p>
              Jurisdiction affects applicability, legal force,
              oversight, enforcement, interpretation, conformity,
              reporting, and the authority required to make a
              governance determination.
            </p>
          </div>

          <div className="searchPanel">
            <label>
              Search jurisdictions and records
              <input
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(event.target.value)
                }
                placeholder="Search a country, region, authority, publisher, or source"
              />
            </label>

            <div className="searchSummary">
              <span>{visibleJurisdictions.length}</span>
              <small>
                {visibleJurisdictions.length === 1
                  ? "jurisdiction found"
                  : "jurisdictions found"}
              </small>
            </div>

            <button
              type="button"
              onClick={clearFilters}
            >
              Clear filters
            </button>
          </div>

          <div className="alphabetPanel">
            <button
              type="button"
              className={
                activeLetter === "All"
                  ? "letterButton active"
                  : "letterButton"
              }
              onClick={() => setActiveLetter("All")}
            >
              All
            </button>

            {availableLetters.map((letter) => (
              <button
                key={letter}
                type="button"
                className={
                  activeLetter === letter
                    ? "letterButton active"
                    : "letterButton"
                }
                onClick={() => setActiveLetter(letter)}
              >
                {letter}
              </button>
            ))}
          </div>

          <div className="resultBar">
            <div>
              <span>{visibleJurisdictions.length}</span>
              <small>Jurisdictions displayed</small>
            </div>

            <div>
              <span>{activeFilterCount}</span>
              <small>Active filters</small>
            </div>

            <div>
              <span>{expandedJurisdictions.length}</span>
              <small>Jurisdictions expanded</small>
            </div>
          </div>
        </section>

        <section className="jurisdictionsSection">
          {visibleJurisdictions.length > 0 ? (
            <div className="jurisdictionsGrid">
              {visibleJurisdictions.map(
                (jurisdiction, index) => {
                  const isExpanded =
                    expandedJurisdictions.includes(
                      jurisdiction.name,
                    );

                  const visibleRecords = isExpanded
                    ? jurisdiction.records
                    : jurisdiction.records.slice(0, 3);

                  const hiddenRecordCount =
                    jurisdiction.records.length -
                    visibleRecords.length;

                  return (
                    <article
                      key={jurisdiction.name}
                      className="jurisdictionCard"
                    >
                      <div className="cardHeader">
                        <div className="jurisdictionSeal">
                          {jurisdiction.firstLetter}
                        </div>

                        <div className="jurisdictionNumber">
                          {String(index + 1).padStart(2, "0")}
                        </div>
                      </div>

                      <div className="jurisdictionMeta">
                        <span>Governance jurisdiction</span>

                        <strong>
                          {jurisdiction.count}{" "}
                          {jurisdiction.count === 1
                            ? "record"
                            : "records"}
                        </strong>
                      </div>

                      <h2>{jurisdiction.name}</h2>

                      <div className="statGrid">
                        <div>
                          <span>
                            {jurisdiction.recordTypes.length}
                          </span>
                          <small>Record types</small>
                        </div>

                        <div>
                          <span>
                            {jurisdiction.publishers.length}
                          </span>
                          <small>Publishers</small>
                        </div>

                        <div>
                          <span>{jurisdiction.count}</span>
                          <small>Sources</small>
                        </div>
                      </div>

                      {jurisdiction.recordTypes.length > 0 ? (
                        <div className="typeBlock">
                          <span>Record types represented</span>

                          <div className="tagList">
                            {jurisdiction.recordTypes
                              .slice(0, 5)
                              .map((recordType) => (
                                <strong key={recordType}>
                                  {recordType}
                                </strong>
                              ))}
                          </div>
                        </div>
                      ) : null}

                      <div className="recordHeading">
                        <span>Connected records</span>

                        <strong>
                          {jurisdiction.records.length}
                        </strong>
                      </div>

                      <div className="recordList">
                        {visibleRecords.map((record) => (
                          <Link
                            key={record.slug}
                            href={`/governance-library/${record.slug}`}
                            className="recordLink"
                          >
                            <strong>{record.title}</strong>

                            <span>
                              {record.publisher} ·{" "}
                              {record.recordType}
                            </span>
                          </Link>
                        ))}
                      </div>

                      {jurisdiction.records.length > 3 ? (
                        <button
                          type="button"
                          className="expandButton"
                          onClick={() =>
                            toggleJurisdiction(
                              jurisdiction.name,
                            )
                          }
                        >
                          {isExpanded
                            ? "Show fewer records"
                            : `Show ${hiddenRecordCount} more records`}
                        </button>
                      ) : null}

                      <div className="cardActions">
                        <Link
                          href={`/governance-library/jurisdiction/${jurisdiction.slug}`}
                          className="primaryAction"
                        >
                          View Jurisdiction →
                        </Link>
                      </div>
                    </article>
                  );
                },
              )}
            </div>
          ) : (
            <div className="emptyState">
              <div className="emptySeal">0</div>

              <h2>
                No jurisdictions match the current search.
              </h2>

              <p>
                Clear the filters or enter a broader jurisdiction,
                publisher, record type, or source name.
              </p>

              <button
                type="button"
                onClick={clearFilters}
              >
                Reset jurisdiction search
              </button>
            </div>
          )}
        </section>

        <section className="jurisdictionSequence">
          <p className="eyebrow gold">
            JURISDICTION REVIEW SEQUENCE
          </p>

          <h2>
            Governance begins by establishing which authority can
            govern the matter.
          </h2>

          <div className="sequenceGrid">
            {[
              [
                "01",
                "Location",
                "Establish where the system, provider, deployer, action, and affected parties are located.",
              ],
              [
                "02",
                "Authority",
                "Identify the institution, legislature, regulator, standards body, or governing organization.",
              ],
              [
                "03",
                "Instrument",
                "Determine whether the source is law, regulation, standard, framework, principle, or guidance.",
              ],
              [
                "04",
                "Applicability",
                "Evaluate scope, role, sector, activity, risk class, exclusions, and effective dates.",
              ],
              [
                "05",
                "Obligation",
                "Identify the duties, controls, evidence, reporting, testing, and oversight required.",
              ],
              [
                "06",
                "Interpretation",
                "Preserve how the source was interpreted and which boundaries remain unresolved.",
              ],
              [
                "07",
                "Authority Decision",
                "Validate who may issue, approve, challenge, or rely on the determination.",
              ],
              [
                "08",
                "Execution Route",
                "Bind applicable authority and evidence to the governed action before execution.",
              ],
            ].map(([number, title, description]) => (
              <article key={title}>
                <span>{number}</span>
                <strong>{title}</strong>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="jurisdictionBoundary">
          <div className="boundarySeal">
            <span>JB</span>
            <small>Jurisdiction boundary</small>
          </div>

          <p className="eyebrow gold">
            GOVERNANCE JURISDICTION BOUNDARY
          </p>

          <h2>
            A source can be relevant without being legally
            applicable.
          </h2>

          <p>
            Geographic reach, institutional authority, organizational
            role, sector, system classification, activity, effective
            date, contractual adoption, and cross-border conditions
            can all change whether a governance source applies.
            Listing a record under a jurisdiction does not establish
            legal applicability, compliance, conformity, or
            enforcement authority.
          </p>

          <div className="boundaryGrid">
            <article>
              <span>JURISDICTION INDEX PROVES</span>
              <strong>
                Which source records are associated with a declared
                country, region, body, or governing authority context
              </strong>
            </article>

            <article>
              <span>JURISDICTION INDEX DOES NOT PROVE</span>
              <strong>
                Legal applicability, extraterritorial reach,
                conformity, compliance, equivalence, or enforceability
              </strong>
            </article>

            <article>
              <span>AUTHORIZED USE REQUIRES</span>
              <strong>
                Applicability review, source verification, role and
                scope analysis, interpretation, and preserved
                determination
              </strong>
            </article>
          </div>

          <div className="boundaryActions">
            <Link
              href="/governance-library/applicability"
              className="secondaryAction"
            >
              Open Applicability
            </Link>

            <Link
              href="/governance-library/authorities"
              className="secondaryAction"
            >
              Review Authorities
            </Link>

            <Link
              href="/governance-library/crosswalks"
              className="primaryAction"
            >
              Compare Jurisdictions →
            </Link>
          </div>
        </section>
      </div>

      <style jsx>{`
        .jurisdictionsPage {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          color: #f5fbff;
          background:
            radial-gradient(
              circle at 50% -8%,
              rgba(37, 145, 192, 0.18),
              transparent 35%
            ),
            radial-gradient(
              circle at 8% 48%,
              rgba(81, 224, 242, 0.06),
              transparent 25%
            ),
            radial-gradient(
              circle at 92% 76%,
              rgba(235, 177, 66, 0.06),
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
          max-width: 1140px;
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
          max-width: 950px;
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

        .controlSection {
          padding-top: 78px;
        }

        .sectionHeading {
          margin-bottom: 31px;
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          align-items: end;
          gap: 40px;
        }

        .sectionHeading h2,
        .jurisdictionSequence h2,
        .jurisdictionBoundary h2 {
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

        .searchPanel {
          padding: 19px;
          display: grid;
          grid-template-columns: minmax(280px, 1fr) auto auto;
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

        input {
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

        input:focus {
          border-color: rgba(99, 230, 255, 0.42);
          box-shadow: 0 0 0 3px rgba(99, 230, 255, 0.06);
        }

        .searchSummary {
          min-height: 46px;
          padding: 0 16px;
          display: flex;
          align-items: center;
          gap: 8px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 11px;
          background: rgba(0, 0, 0, 0.15);
        }

        .searchSummary span {
          color: #efcc82;
          font: 700 23px Georgia, serif;
        }

        .searchSummary small {
          color: #78909b;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .searchPanel button,
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

        .alphabetPanel {
          margin-top: 12px;
          padding: 13px;
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 17px;
          background: rgba(5, 18, 30, 0.66);
        }

        .letterButton {
          min-width: 38px;
          height: 38px;
          padding: 0 10px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 9px;
          color: #839aa5;
          background: rgba(0, 0, 0, 0.16);
          cursor: pointer;
          font-size: 9px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .letterButton:hover {
          color: #b9d5dd;
          border-color: rgba(99, 230, 255, 0.22);
        }

        .letterButton.active {
          color: #061820;
          border-color: #b8f5ff;
          background: #88e5f2;
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

        .jurisdictionsSection {
          padding-top: 27px;
        }

        .jurisdictionsGrid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
          align-items: start;
        }

        .jurisdictionCard {
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

        .cardHeader {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .jurisdictionSeal {
          width: 52px;
          height: 52px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(255, 198, 82, 0.3);
          border-radius: 50%;
          color: #f1ce83;
          background: rgba(255, 198, 82, 0.05);
          font: 700 17px Georgia, serif;
        }

        .jurisdictionNumber {
          color: #607985;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.1em;
        }

        .jurisdictionMeta {
          margin-top: 22px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .jurisdictionMeta span,
        .jurisdictionMeta strong {
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.09em;
          text-transform: uppercase;
        }

        .jurisdictionMeta span {
          color: #70dce9;
        }

        .jurisdictionMeta strong {
          color: #b19a68;
        }

        .jurisdictionCard h2 {
          margin: 10px 0 0;
          color: #e6f0f3;
          font-size: 29px;
          line-height: 1.08;
        }

        .statGrid {
          margin-top: 20px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
        }

        .statGrid div {
          padding: 12px 8px;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 11px;
          background: rgba(0, 0, 0, 0.14);
          text-align: center;
        }

        .statGrid span {
          display: block;
          color: #efcc82;
          font: 700 20px Georgia, serif;
        }

        .statGrid small {
          display: block;
          margin-top: 4px;
          color: #6f8792;
          font-size: 7px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .typeBlock {
          margin-top: 18px;
          padding: 14px;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 13px;
          background: rgba(0, 0, 0, 0.14);
        }

        .typeBlock > span,
        .recordHeading span {
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

        .recordHeading {
          margin-top: 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .recordHeading strong {
          color: #d1ae67;
          font-size: 9px;
          font-weight: 900;
        }

        .recordList {
          margin-top: 10px;
          display: grid;
          gap: 8px;
        }

        .recordLink {
          padding: 12px;
          display: block;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 11px;
          color: inherit;
          background: rgba(0, 0, 0, 0.13);
          text-decoration: none;
          transition:
            transform 0.2s,
            border-color 0.2s,
            background 0.2s;
        }

        .recordLink:hover {
          transform: translateY(-2px);
          border-color: rgba(99, 230, 255, 0.24);
          background: rgba(99, 230, 255, 0.03);
        }

        .recordLink strong {
          display: block;
          color: #d5e1e5;
          font: 700 13px/1.4 Georgia, serif;
        }

        .recordLink span {
          display: block;
          margin-top: 6px;
          color: #718994;
          font-size: 8px;
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

        .cardActions {
          margin-top: 18px;
        }

        .cardActions .primaryAction {
          width: 100%;
          box-sizing: border-box;
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

        .jurisdictionSequence {
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

        .jurisdictionSequence h2 {
          max-width: 1050px;
          margin-left: auto;
          margin-right: auto;
        }

        .sequenceGrid {
          margin-top: 32px;
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 12px;
        }

        .sequenceGrid article {
          padding: 19px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 15px;
          background: rgba(0, 0, 0, 0.16);
        }

        .sequenceGrid span {
          color: #efc66f;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.1em;
        }

        .sequenceGrid strong {
          display: block;
          margin-top: 7px;
          color: #dce7eb;
          font: 700 18px Georgia, serif;
        }

        .sequenceGrid p {
          margin: 8px 0 0;
          color: #788f9a;
          font-size: 10px;
          line-height: 1.5;
        }

        .jurisdictionBoundary {
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

        .jurisdictionBoundary h2 {
          max-width: 1040px;
          margin: 14px auto 0;
        }

        .jurisdictionBoundary > p:not(.eyebrow) {
          max-width: 990px;
          margin: 23px auto 0;
          color: #a4b4bc;
          font-size: 15px;
          line-height: 1.78;
        }

        .boundaryGrid {
          max-width: 1100px;
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
          .jurisdictionsGrid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .heroMetrics {
            grid-template-columns: repeat(
              3,
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

          .sectionHeading,
          .searchPanel {
            grid-template-columns: 1fr;
          }

          .sequenceGrid,
          .boundaryGrid {
            grid-template-columns: repeat(2, 1fr);
          }

          .resultBar {
            flex-wrap: wrap;
          }
        }

        @media (max-width: 680px) {
          .pageShell {
            width: calc(100% - 22px);
          }

          .topbar,
          .heroMetrics,
          .jurisdictionsGrid,
          .sequenceGrid,
          .boundaryGrid {
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

          .statGrid {
            grid-template-columns: 1fr;
          }

          .resultBar {
            align-items: flex-start;
            flex-direction: column;
          }

          .jurisdictionSequence,
          .jurisdictionBoundary {
            padding: 30px 20px;
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
