"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  governanceLibraryRecords,
} from "../../../lib/governance-library";
import type {
  GovernanceLibraryRecord,
} from "../../../lib/governance-library/records-foundational";

type GlossaryEntry = {
  term: string;
  count: number;
  records: GovernanceLibraryRecord[];
  firstLetter: string;
};

function normalize(value: string | undefined) {
  return value?.trim() || "Unspecified";
}

function getFirstLetter(value: string) {
  const firstCharacter = value.trim().charAt(0).toUpperCase();

  return /^[A-Z]$/.test(firstCharacter)
    ? firstCharacter
    : "#";
}

export default function GovernanceLibraryGlossaryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeLetter, setActiveLetter] = useState("All");
  const [expandedTerms, setExpandedTerms] = useState<string[]>([]);

  const entries = useMemo<GlossaryEntry[]>(() => {
    const glossary = new Map<
      string,
      GovernanceLibraryRecord[]
    >();

    governanceLibraryRecords.forEach(
      (record: GovernanceLibraryRecord) => {
        record.keyTopics.forEach((topic: string) => {
          const normalizedTopic = topic.trim();

          if (!normalizedTopic) {
            return;
          }

          const existingRecords =
            glossary.get(normalizedTopic) ?? [];

          if (
            !existingRecords.some(
              (existingRecord) =>
                existingRecord.slug === record.slug,
            )
          ) {
            glossary.set(normalizedTopic, [
              ...existingRecords,
              record,
            ]);
          }
        });
      },
    );

    return [...glossary.entries()]
      .map(([term, records]) => ({
        term,
        count: records.length,
        records: [...records].sort((a, b) =>
          a.title.localeCompare(b.title),
        ),
        firstLetter: getFirstLetter(term),
      }))
      .sort((a, b) => a.term.localeCompare(b.term));
  }, []);

  const availableLetters = useMemo(
    () =>
      Array.from(
        new Set(entries.map((entry) => entry.firstLetter)),
      ).sort((a, b) => {
        if (a === "#") {
          return 1;
        }

        if (b === "#") {
          return -1;
        }

        return a.localeCompare(b);
      }),
    [entries],
  );

  const visibleEntries = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return entries.filter((entry) => {
      const matchesLetter =
        activeLetter === "All" ||
        entry.firstLetter === activeLetter;

      const matchesSearch =
        query.length === 0 ||
        entry.term.toLowerCase().includes(query) ||
        entry.records.some((record) =>
          [
            record.title,
            record.publisher,
            record.recordType,
            record.jurisdiction,
            record.status,
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase()
            .includes(query),
        );

      return matchesLetter && matchesSearch;
    });
  }, [activeLetter, entries, searchQuery]);

  const totalReferences = entries.reduce(
    (total, entry) => total + entry.count,
    0,
  );

  const largestEntry = [...entries].sort(
    (a, b) => b.count - a.count,
  )[0];

  const activeFilterCount = [
    searchQuery.trim().length > 0,
    activeLetter !== "All",
  ].filter(Boolean).length;

  function toggleTerm(term: string) {
    setExpandedTerms((current) =>
      current.includes(term)
        ? current.filter((item) => item !== term)
        : [...current, term],
    );
  }

  function clearFilters() {
    setSearchQuery("");
    setActiveLetter("All");
  }

  function expandVisibleTerms() {
    setExpandedTerms((current) =>
      Array.from(
        new Set([
          ...current,
          ...visibleEntries.map((entry) => entry.term),
        ]),
      ),
    );
  }

  function collapseAllTerms() {
    setExpandedTerms([]);
  }

  return (
    <main className="glossaryPage">
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
            Glossary index active
          </div>

          <Link
            href="/governance-library/dictionary"
            className="topbarAction"
          >
            Open Dictionary →
          </Link>
        </div>

        <header className="hero">
          <div className="heroSeal">
            <span>GG</span>
            <small>Governance glossary</small>
          </div>

          <p className="eyebrow">
            TA-14 AI GOVERNANCE LIBRARY
          </p>

          <h1>
            Governance
            <span> Glossary</span>
          </h1>

          <p className="lead">
            Browse governance concepts drawn from the key topics
            assigned to library records. Each term connects users to
            the laws, regulations, standards, frameworks,
            methodologies, principles, recommendations, and source
            records in which the concept appears.
          </p>

          <div className="heroMetrics">
            <article>
              <span>{entries.length}</span>
              <small>Terms indexed</small>
            </article>

            <article>
              <span>{totalReferences}</span>
              <small>Record references</small>
            </article>

            <article>
              <span>{availableLetters.length}</span>
              <small>Alphabet groups</small>
            </article>

            <article>
              <span>{largestEntry?.count ?? 0}</span>
              <small>Largest term cluster</small>
            </article>

            <article>
              <span>{visibleEntries.length}</span>
              <small>Terms shown</small>
            </article>
          </div>
        </header>

        <section className="controlSection">
          <div className="sectionHeading">
            <div>
              <p className="eyebrow">
                GLOSSARY CONTROL DESK
              </p>

              <h2>
                Find a term and trace its sources.
              </h2>
            </div>

            <p>
              Glossary terms support navigation and discovery. They
              do not replace the definitions, scope, authority,
              obligations, or interpretations contained in the
              underlying source records.
            </p>
          </div>

          <div className="searchPanel">
            <label>
              Search glossary terms and records
              <input
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(event.target.value)
                }
                placeholder="Search a term, title, publisher, type, jurisdiction, or status"
              />
            </label>

            <div className="searchSummary">
              <span>{visibleEntries.length}</span>
              <small>
                {visibleEntries.length === 1
                  ? "term found"
                  : "terms found"}
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
              <span>{activeFilterCount}</span>
              <small>Active filters</small>
            </div>

            <div>
              <span>{expandedTerms.length}</span>
              <small>Terms expanded</small>
            </div>

            <div className="resultActions">
              <button
                type="button"
                onClick={expandVisibleTerms}
                disabled={visibleEntries.length === 0}
              >
                Expand visible
              </button>

              <button
                type="button"
                onClick={collapseAllTerms}
                disabled={expandedTerms.length === 0}
              >
                Collapse all
              </button>
            </div>
          </div>
        </section>

        <section className="glossarySection">
          {visibleEntries.length > 0 ? (
            <div className="glossaryGrid">
              {visibleEntries.map((entry, index) => {
                const isExpanded =
                  expandedTerms.includes(entry.term);
                const visibleRecords = isExpanded
                  ? entry.records
                  : entry.records.slice(0, 3);
                const hiddenRecordCount =
                  entry.records.length - visibleRecords.length;

                return (
                  <article
                    key={entry.term}
                    className="glossaryCard"
                  >
                    <div className="cardHeader">
                      <div className="termIndex">
                        {String(index + 1).padStart(2, "0")}
                      </div>

                      <div className="termCount">
                        <strong>{entry.count}</strong>
                        <small>
                          {entry.count === 1
                            ? "record"
                            : "records"}
                        </small>
                      </div>
                    </div>

                    <div className="termHeading">
                      <span>
                        {entry.firstLetter} · Governance term
                      </span>

                      <h2>{entry.term}</h2>
                    </div>

                    <div className="recordList">
                      {visibleRecords.map((record) => (
                        <Link
                          key={record.slug}
                          href={`/governance-library/${record.slug}`}
                          className="recordCard"
                        >
                          <strong>{record.title}</strong>

                          <span>
                            {normalize(record.publisher)} ·{" "}
                            {normalize(record.recordType)}
                          </span>

                          <small>
                            {normalize(record.jurisdiction)} ·{" "}
                            {normalize(record.status)}
                          </small>
                        </Link>
                      ))}
                    </div>

                    <div className="cardFooter">
                      {entry.records.length > 3 ? (
                        <button
                          type="button"
                          onClick={() => toggleTerm(entry.term)}
                        >
                          {isExpanded
                            ? "Show fewer records"
                            : `Show ${hiddenRecordCount} more`}
                        </button>
                      ) : (
                        <span>
                          Complete source list shown
                        </span>
                      )}

                      <strong>
                        {entry.count} source{" "}
                        {entry.count === 1
                          ? "connection"
                          : "connections"}
                      </strong>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="emptyState">
              <div className="emptySeal">0</div>

              <h2>
                No glossary terms match the current search.
              </h2>

              <p>
                Clear the filters or enter a broader governance
                concept.
              </p>

              <button
                type="button"
                onClick={clearFilters}
              >
                Reset glossary
              </button>
            </div>
          )}
        </section>

        <section className="glossaryBoundary">
          <div className="boundarySeal">
            <span>GB</span>
            <small>Glossary boundary</small>
          </div>

          <p className="eyebrow gold">
            GOVERNANCE GLOSSARY BOUNDARY
          </p>

          <h2>
            A shared term does not establish a shared meaning.
          </h2>

          <p>
            The same governance term may carry different definitions,
            thresholds, scope, obligations, and legal effects across
            laws, regulations, standards, frameworks, sectors, and
            jurisdictions. The glossary reveals where concepts appear.
            The governing meaning must still be established from the
            applicable source, context, authority, and preserved
            interpretation.
          </p>

          <div className="boundaryGrid">
            <article>
              <span>THE GLOSSARY SHOWS</span>
              <strong>
                Terms assigned to records and the sources connected
                to each indexed concept
              </strong>
            </article>

            <article>
              <span>THE GLOSSARY DOES NOT PROVE</span>
              <strong>
                Universal definitions, semantic equivalence,
                applicability, conformity, or legal interpretation
              </strong>
            </article>

            <article>
              <span>GOVERNED USE REQUIRES</span>
              <strong>
                Source-specific definitions, authority review,
                contextual interpretation, and preserved evidence
              </strong>
            </article>
          </div>

          <div className="boundaryActions">
            <Link
              href="/governance-library/dictionary"
              className="secondaryAction"
            >
              Open Dictionary
            </Link>

            <Link
              href="/governance-library/topics"
              className="secondaryAction"
            >
              Open Topics
            </Link>

            <Link
              href="/governance-library/relationships"
              className="primaryAction"
            >
              Trace Relationships →
            </Link>
          </div>
        </section>
      </div>

      <style jsx>{`
        .glossaryPage {
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
        .glossaryBoundary h2 {
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
          transition:
            border-color 0.2s,
            color 0.2s,
            background 0.2s;
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
          gap: 26px;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 16px;
          background: rgba(5, 18, 30, 0.66);
        }

        .resultBar > div:not(.resultActions) {
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

        .resultActions {
          margin-left: auto;
          display: flex;
          gap: 8px;
        }

        .resultActions button {
          min-height: 38px;
          padding: 0 12px;
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 9px;
          color: #a9bbc3;
          background: rgba(0, 0, 0, 0.18);
          cursor: pointer;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.07em;
          text-transform: uppercase;
        }

        button:disabled {
          cursor: not-allowed;
          opacity: 0.42;
        }

        .glossarySection {
          padding-top: 27px;
        }

        .glossaryGrid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
          align-items: start;
        }

        .glossaryCard {
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
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
        }

        .termIndex {
          width: 48px;
          height: 48px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(255, 198, 82, 0.25);
          border-radius: 50%;
          color: #efc66f;
          background: rgba(255, 198, 82, 0.04);
          font: 700 12px Georgia, serif;
        }

        .termCount {
          padding: 8px 11px;
          display: grid;
          justify-items: center;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 11px;
          background: rgba(0, 0, 0, 0.15);
        }

        .termCount strong {
          color: #efcd85;
          font: 700 21px Georgia, serif;
        }

        .termCount small {
          color: #718893;
          font-size: 7px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .termHeading {
          margin-top: 24px;
        }

        .termHeading span {
          color: #6edbeb;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .termHeading h2 {
          margin: 8px 0 0;
          color: #e6f0f3;
          font-size: 29px;
          line-height: 1.08;
        }

        .recordList {
          margin-top: 20px;
          display: grid;
          gap: 9px;
        }

        .recordCard {
          padding: 14px;
          display: block;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 13px;
          color: inherit;
          background: rgba(0, 0, 0, 0.15);
          text-decoration: none;
          transition:
            border-color 0.2s,
            background 0.2s,
            transform 0.2s;
        }

        .recordCard:hover {
          transform: translateY(-2px);
          border-color: rgba(99, 230, 255, 0.24);
          background: rgba(99, 230, 255, 0.03);
        }

        .recordCard strong {
          display: block;
          color: #dbe7eb;
          font: 700 15px/1.35 Georgia, serif;
        }

        .recordCard span,
        .recordCard small {
          display: block;
          margin-top: 7px;
          color: #78909b;
          font-size: 8px;
          line-height: 1.45;
        }

        .recordCard small {
          margin-top: 4px;
          color: #5f7782;
          text-transform: uppercase;
        }

        .cardFooter {
          margin-top: 18px;
          padding-top: 17px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
        }

        .cardFooter button {
          padding: 0;
          border: 0;
          color: #78dce9;
          background: none;
          cursor: pointer;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .cardFooter span {
          color: #617984;
          font-size: 8px;
          text-transform: uppercase;
        }

        .cardFooter strong {
          color: #efc978;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.05em;
          text-align: right;
          text-transform: uppercase;
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

        .glossaryBoundary {
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

        .glossaryBoundary h2 {
          max-width: 1040px;
          margin: 14px auto 0;
        }

        .glossaryBoundary > p:not(.eyebrow) {
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

        @media (max-width: 1080px) {
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

          .glossaryGrid,
          .boundaryGrid {
            grid-template-columns: 1fr;
          }

          .resultBar {
            align-items: flex-start;
            flex-wrap: wrap;
          }

          .resultActions {
            width: 100%;
            margin-left: 0;
          }
        }

        @media (max-width: 680px) {
          .pageShell {
            width: calc(100% - 22px);
          }

          .topbar,
          .heroMetrics {
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

          .cardFooter {
            align-items: flex-start;
            flex-direction: column;
          }

          .cardFooter strong {
            text-align: left;
          }

          .resultActions {
            flex-direction: column;
          }

          .resultActions button {
            width: 100%;
          }

          .glossaryBoundary {
            padding: 22px;
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
