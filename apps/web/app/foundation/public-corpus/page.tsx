"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  CORPUS_CATEGORY_LABELS,
  CORPUS_COUNTS,
  CORPUS_TOTAL,
  TA14_PUBLIC_CORPUS,
  type CorpusCategory,
  type CorpusRecord,
} from "./corpus";

const categories: Array<"ALL" | CorpusCategory> = [
  "ALL",
  "BOOK",
  "ARTICLE",
  "ZENODO",
  "PATENT",
  "STANDARD",
  "REPOSITORY",
  "SITE",
  "IMPLEMENTATION",
  "CHRONOLOGY",
];

const categoryDescriptions: Record<CorpusCategory, string> = {
  BOOK:
    "Books, manuals, workbooks, and long-form publications documenting the TA-14 architecture and its applied domains.",
  ARTICLE:
    "Public articles, essays, industry publications, and chronological explanations of the TA-14 body of work.",
  ZENODO:
    "Persistent public deposits, DOI records, and architecture lineage preserved through Zenodo.",
  PATENT:
    "Patent applications, filing lineage, related inventions, and declared rights records.",
  STANDARD:
    "TA-14 standards, protocols, methods, and public implementation requirements.",
  REPOSITORY:
    "Public GitHub repositories preserving code, architecture, demonstrations, and implementation history.",
  SITE:
    "Public architecture, doctrine, patent-position, and institutional presentation sites.",
  IMPLEMENTATION:
    "Operational systems and reference implementations translating TA-14 architecture into usable public tools.",
  CHRONOLOGY:
    "Dated milestones showing the development of TA-14 from field evidence discipline to admissible execution governance.",
};

function formatStatus(status: string) {
  return status
    .split("_")
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(" ");
}

function RecordCard({ record }: { record: CorpusRecord }) {
  return (
    <article className="recordCard">
      <div className="recordHeader">
        <span className={`categoryPill category-${record.category.toLowerCase()}`}>
          {record.category}
        </span>
        <span className="statusPill">{formatStatus(record.status)}</span>
      </div>

      <h3>{record.title}</h3>

      <div className="recordDetails">
        {record.date ? (
          <span>
            <strong>Date</strong>
            {record.date}
          </span>
        ) : (
          <span>
            <strong>Year</strong>
            {record.year}
          </span>
        )}

        {record.author ? (
          <span>
            <strong>Author / steward</strong>
            {record.author}
          </span>
        ) : null}

        {record.platform ? (
          <span>
            <strong>Platform</strong>
            {record.platform}
          </span>
        ) : null}

        {record.identifier ? (
          <span>
            <strong>Identifier</strong>
            <code>{record.identifier}</code>
          </span>
        ) : null}
      </div>

      {record.description ? <p className="description">{record.description}</p> : null}

      {record.relationship ? (
        <div className="relationship">
          <strong>Relationship to the TA-14 corpus</strong>
          <p>{record.relationship}</p>
        </div>
      ) : null}

      {record.tags?.length ? (
        <div className="tags">
          {record.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      ) : null}

      <div className="recordFooter">
        <span>{record.id}</span>
        {record.href ? (
          <a href={record.href} target="_blank" rel="noreferrer">
            Open public record ↗
          </a>
        ) : (
          <span className="pending">Direct public link pending</span>
        )}
      </div>
    </article>
  );
}

export default function PublicCorpusPage() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] =
    useState<"ALL" | CorpusCategory>("ALL");
  const [activeYear, setActiveYear] = useState("ALL");
  const [sortOrder, setSortOrder] = useState<"NEWEST" | "OLDEST" | "TITLE">(
    "NEWEST",
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requestedCategory = params.get("category")?.toUpperCase();
    const requestedYear = params.get("year");
    const requestedQuery = params.get("q");

    if (
      requestedCategory &&
      categories.includes(requestedCategory as "ALL" | CorpusCategory)
    ) {
      setActiveCategory(requestedCategory as "ALL" | CorpusCategory);
    }

    if (requestedYear) {
      setActiveYear(requestedYear);
    }

    if (requestedQuery) {
      setQuery(requestedQuery);
    }
  }, []);

  const years = useMemo(
    () =>
      Array.from(new Set(TA14_PUBLIC_CORPUS.map((record) => record.year))).sort(
        (a, b) => b - a,
      ),
    [],
  );

  const filteredRecords = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    const matching = TA14_PUBLIC_CORPUS.filter((record) => {
      const categoryMatch =
        activeCategory === "ALL" || record.category === activeCategory;
      const yearMatch =
        activeYear === "ALL" || record.year === Number(activeYear);

      const searchable = [
        record.title,
        record.date,
        record.year,
        record.author,
        record.platform,
        record.status,
        record.identifier,
        record.description,
        record.relationship,
        record.sourceClass,
        ...(record.tags ?? []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const queryMatch = !normalized || searchable.includes(normalized);

      return categoryMatch && yearMatch && queryMatch;
    });

    return [...matching].sort((a, b) => {
      if (sortOrder === "TITLE") {
        return a.title.localeCompare(b.title);
      }

      const aDate = a.date ?? `${a.year}-01-01`;
      const bDate = b.date ?? `${b.year}-01-01`;

      return sortOrder === "NEWEST"
        ? bDate.localeCompare(aDate)
        : aDate.localeCompare(bDate);
    });
  }, [activeCategory, activeYear, query, sortOrder]);

  const groupedRecords = useMemo(() => {
    if (activeCategory !== "ALL") {
      return [
        {
          category: activeCategory,
          records: filteredRecords,
        },
      ];
    }

    return categories
      .filter((category): category is CorpusCategory => category !== "ALL")
      .map((category) => ({
        category,
        records: filteredRecords.filter(
          (record) => record.category === category,
        ),
      }))
      .filter((group) => group.records.length > 0);
  }, [activeCategory, filteredRecords]);

  return (
    <main className="page">
      <div className="cosmos" aria-hidden="true">
        <div className="stars starsOne" />
        <div className="stars starsTwo" />
        <div className="glow glowBlue" />
        <div className="glow glowGold" />
        <div className="orbit orbitOne" />
        <div className="orbit orbitTwo" />
        <div className="line lineOne" />
        <div className="line lineTwo" />
      </div>

      <header className="topbar">
        <Link href="/foundation" className="brand">
          <span className="brandMark">TA-14</span>
          <span>
            <strong>TA-14 Public Corpus</strong>
            <small>Complete institutional evidence ledger</small>
          </span>
        </Link>

        <nav aria-label="Public corpus navigation">
          <a href="#search">Search</a>
          <a href="#records">All Records</a>
          <a href="#categories">Categories</a>
          <Link href="/foundation">Credentials</Link>
          <Link href="/registry">Registry</Link>
        </nav>

        <Link className="topAction" href="/workspace">
          Open Exchange
        </Link>
      </header>

      <section className="hero shell">
        <p className="eyebrow">TA-14 FOUNDATION • COMPLETE PUBLIC CORPUS</p>

        <h1>
          The whole body of work,
          <em> in one searchable place.</em>
        </h1>

        <p className="heroLead">
          This is the master institutional ledger for TA-14 books, articles,
          public deposits, patent applications, standards, repositories,
          implementations, architecture sites, and dated milestones. Visitors
          should not have to search the internet one document at a time to
          understand the size, chronology, or lineage of the work.
        </p>

        <div className="heroActions">
          <a className="button gold" href="#search">
            Search the complete corpus <span>↓</span>
          </a>
          <a className="button primary" href="#categories">
            Browse by category <span>↓</span>
          </a>
          <Link className="button glass" href="/foundation">
            Return to credentials <span>↗</span>
          </Link>
        </div>

        <div className="summaryGrid">
          <article>
            <strong>{CORPUS_TOTAL}</strong>
            <span>structured public records currently entered</span>
          </article>
          <article>
            <strong>{CORPUS_COUNTS.BOOK}</strong>
            <span>books and long-form publications</span>
          </article>
          <article>
            <strong>{CORPUS_COUNTS.ARTICLE}</strong>
            <span>articles and public essays</span>
          </article>
          <article>
            <strong>{CORPUS_COUNTS.ZENODO}</strong>
            <span>Zenodo and DOI records</span>
          </article>
          <article>
            <strong>{CORPUS_COUNTS.PATENT}</strong>
            <span>patent and filing records</span>
          </article>
          <article>
            <strong>
              {CORPUS_COUNTS.REPOSITORY +
                CORPUS_COUNTS.SITE +
                CORPUS_COUNTS.IMPLEMENTATION}
            </strong>
            <span>repositories, sites, and implementations</span>
          </article>
        </div>
      </section>

      <section id="search" className="searchSection shell">
        <div className="sectionHeading">
          <p className="eyebrow">SEARCH & FILTER</p>
          <h2>Find any entered TA-14 record by title, date, identifier, or subject.</h2>
          <p>
            Search terms are matched against titles, authors, platforms,
            identifiers, descriptions, relationships, and tags.
          </p>
        </div>

        <div className="searchPanel">
          <label className="searchField">
            <span>Search the complete corpus</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              type="search"
              placeholder="Try: admissibility, AIR, EU AI Act, refrigerant, evidence, execution…"
            />
          </label>

          <div className="controlRow">
            <label>
              <span>Category</span>
              <select
                value={activeCategory}
                onChange={(event) =>
                  setActiveCategory(
                    event.target.value as "ALL" | CorpusCategory,
                  )
                }
              >
                <option value="ALL">All categories</option>
                {categories
                  .filter(
                    (category): category is CorpusCategory =>
                      category !== "ALL",
                  )
                  .map((category) => (
                    <option key={category} value={category}>
                      {CORPUS_CATEGORY_LABELS[category]}
                    </option>
                  ))}
              </select>
            </label>

            <label>
              <span>Year</span>
              <select
                value={activeYear}
                onChange={(event) => setActiveYear(event.target.value)}
              >
                <option value="ALL">All years</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span>Sort</span>
              <select
                value={sortOrder}
                onChange={(event) =>
                  setSortOrder(
                    event.target.value as "NEWEST" | "OLDEST" | "TITLE",
                  )
                }
              >
                <option value="NEWEST">Newest first</option>
                <option value="OLDEST">Oldest first</option>
                <option value="TITLE">Title A–Z</option>
              </select>
            </label>
          </div>

          <div className="activeSummary">
            <span>
              {filteredRecords.length} of {CORPUS_TOTAL} records shown
            </span>
            {(query ||
              activeCategory !== "ALL" ||
              activeYear !== "ALL" ||
              sortOrder !== "NEWEST") && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setActiveCategory("ALL");
                  setActiveYear("ALL");
                  setSortOrder("NEWEST");
                }}
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>
      </section>

      <section id="categories" className="categorySection shell">
        <div className="sectionHeading">
          <p className="eyebrow">PUBLIC CORPUS CATEGORIES</p>
          <h2>Open the part of the record you need.</h2>
        </div>

        <div className="categoryGrid">
          {categories
            .filter(
              (category): category is CorpusCategory => category !== "ALL",
            )
            .map((category, index) => (
              <button
                type="button"
                key={category}
                onClick={() => {
                  setActiveCategory(category);
                  document
                    .getElementById("records")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <strong>{CORPUS_CATEGORY_LABELS[category]}</strong>
                  <p>{categoryDescriptions[category]}</p>
                </div>
                <b>{CORPUS_COUNTS[category]}</b>
              </button>
            ))}
        </div>
      </section>

      <section id="records" className="recordsSection shell">
        <div className="recordsHeading">
          <div>
            <p className="eyebrow">MASTER RECORD LIST</p>
            <h2>
              {activeCategory === "ALL"
                ? "All entered public records"
                : CORPUS_CATEGORY_LABELS[activeCategory]}
            </h2>
          </div>
          <span>{filteredRecords.length} visible records</span>
        </div>

        {filteredRecords.length === 0 ? (
          <div className="emptyState">
            <h3>No matching public record was found.</h3>
            <p>
              Clear the filters or search a broader term. This result only means
              the current structured corpus does not contain a matching entry.
            </p>
          </div>
        ) : (
          <div className="recordGroups">
            {groupedRecords.map((group) => (
              <section className="recordGroup" key={group.category}>
                <div className="groupHeading">
                  <div>
                    <span>{group.category}</span>
                    <h3>{CORPUS_CATEGORY_LABELS[group.category]}</h3>
                  </div>
                  <strong>{group.records.length}</strong>
                </div>

                <div className="recordGrid">
                  {group.records.map((record) => (
                    <RecordCard record={record} key={record.id} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </section>

      <section className="boundary shell">
        <div>
          <p className="eyebrow">PUBLIC CORPUS BOUNDARY</p>
          <h2>This ledger preserves what TA-14 claims, published, filed, and implemented.</h2>
          <p>
            Inclusion in this corpus is a public-record function. It does not
            automatically establish legal priority, patent validity,
            certification, accreditation, regulatory approval, independent
            validation, or proof that every implementation performs as claimed.
            Those determinations require their own evidence and review.
          </p>
        </div>

        <div className="boundaryCards">
          <article>
            <strong>What this page does</strong>
            <p>
              Makes titles, dates, identifiers, chronology, links, scope, and
              relationships visible and searchable.
            </p>
          </article>
          <article>
            <strong>What the Registry does</strong>
            <p>
              Preserves governance registrations, claims, non-claims, evidence,
              status, disputes, and version history.
            </p>
          </article>
          <article>
            <strong>What verification must do</strong>
            <p>
              Determine whether a particular claim, route, execution, or
              outcome remains supported by admissible evidence.
            </p>
          </article>
        </div>
      </section>

      <section className="closing shell">
        <p className="eyebrow">TA-14 FOUNDATION</p>
        <h2>A visitor should be able to see the lineage without being told to go find it.</h2>

        <div className="heroActions">
          <a className="button gold" href="#search">
            Search again <span>↑</span>
          </a>
          <Link className="button primary" href="/foundation">
            Open credentials home <span>↗</span>
          </Link>
          <Link className="button glass" href="/registry">
            Open Registry <span>↗</span>
          </Link>
        </div>

        <strong>No admissible evidence. No admissible execution.</strong>
      </section>

      <footer className="shell">
        <span>TA-14 Complete Public Corpus</span>
        <span>
          Books • Articles • DOI Records • Patents • Standards • Repositories •
          Implementations
        </span>
      </footer>

      <style jsx global>{`
        :root {
          color-scheme: dark;
          --bg: #020711;
          --text: #f5f9ff;
          --muted: #a7b9c5;
          --blue: #73dff0;
          --gold: #f1c36d;
        }

        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
          background: var(--bg);
        }

        body {
          margin: 0;
          color: var(--text);
          background: var(--bg);
          font-family: Inter, ui-sans-serif, system-ui, -apple-system,
            BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        button,
        input,
        select {
          font: inherit;
        }

        .page {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          isolation: isolate;
          background:
            radial-gradient(circle at 50% 0%, rgba(29, 105, 166, 0.2), transparent 32%),
            linear-gradient(180deg, #020711, #07121e 52%, #020711);
        }

        .shell {
          width: min(1380px, calc(100% - 40px));
          margin-inline: auto;
          position: relative;
          z-index: 2;
        }

        .cosmos {
          position: fixed;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
          z-index: -2;
        }

        .stars {
          position: absolute;
          inset: -15%;
        }

        .starsOne {
          background-image: radial-gradient(
            circle,
            rgba(255, 255, 255, 0.82) 0 1px,
            transparent 1.4px
          );
          background-size: 92px 92px;
          animation: drift 54s linear infinite;
        }

        .starsTwo {
          background-image: radial-gradient(
            circle,
            rgba(103, 216, 241, 0.76) 0 1px,
            transparent 1.5px
          );
          background-size: 157px 157px;
          animation: drift 70s linear infinite reverse;
        }

        .glow {
          position: absolute;
          width: 720px;
          height: 720px;
          border-radius: 50%;
          filter: blur(130px);
          opacity: 0.14;
        }

        .glowBlue {
          left: -330px;
          top: 8%;
          background: #087ed2;
        }

        .glowGold {
          right: -350px;
          top: 42%;
          background: #c78220;
        }

        .orbit {
          position: absolute;
          width: 480px;
          height: 480px;
          border-radius: 50%;
          border: 1px solid rgba(116, 221, 242, 0.12);
        }

        .orbitOne {
          left: -220px;
          top: 24%;
          animation: spin 32s linear infinite;
        }

        .orbitTwo {
          right: -250px;
          top: 61%;
          width: 620px;
          height: 620px;
          border-color: rgba(241, 195, 109, 0.11);
          animation: spin 44s linear infinite reverse;
        }

        .line {
          position: absolute;
          width: 90vw;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(111, 218, 239, 0.5),
            rgba(242, 191, 109, 0.42),
            transparent
          );
        }

        .lineOne {
          top: 31%;
          left: -35%;
          transform: rotate(-8deg);
          animation: routeMove 20s linear infinite;
        }

        .lineTwo {
          top: 73%;
          right: -40%;
          transform: rotate(10deg);
          animation: routeMove 26s linear infinite reverse;
        }

        .topbar {
          width: min(1500px, calc(100% - 36px));
          min-height: 76px;
          margin: 18px auto 0;
          padding: 12px 14px 12px 18px;
          position: relative;
          z-index: 5;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          border: 1px solid rgba(123, 208, 232, 0.18);
          border-radius: 20px;
          background: rgba(2, 10, 19, 0.76);
          backdrop-filter: blur(18px);
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 13px;
        }

        .brandMark {
          width: 54px;
          height: 54px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          border: 1px solid rgba(242, 191, 109, 0.44);
          color: var(--gold);
          background: rgba(117, 72, 13, 0.18);
          font-size: 12px;
          font-weight: 950;
        }

        .brand > span:last-child {
          display: grid;
          gap: 3px;
        }

        .brand strong {
          font-family: Georgia, serif;
          font-size: 17px;
        }

        .brand small {
          color: #8fa7b7;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .topbar nav {
          display: flex;
          gap: 7px;
        }

        .topbar nav a {
          padding: 10px 12px;
          border-radius: 11px;
          color: #b6c8d4;
          font-size: 11px;
          font-weight: 850;
        }

        .topbar nav a:hover {
          color: white;
          background: rgba(109, 216, 255, 0.08);
        }

        .topAction {
          min-height: 44px;
          display: inline-flex;
          align-items: center;
          padding: 0 17px;
          border-radius: 13px;
          border: 1px solid rgba(137, 205, 255, 0.27);
          background: linear-gradient(
            180deg,
            rgba(34, 79, 112, 0.76),
            rgba(8, 27, 43, 0.88)
          );
          font-size: 11px;
          font-weight: 900;
        }

        .hero {
          padding: 118px 0 92px;
          text-align: center;
        }

        .eyebrow {
          margin: 0;
          color: var(--gold);
          font-size: 10px;
          font-weight: 950;
          letter-spacing: 0.22em;
        }

        h1,
        h2,
        h3,
        p {
          margin-top: 0;
        }

        .hero h1,
        .sectionHeading h2,
        .recordsHeading h2,
        .boundary h2,
        .closing h2 {
          font-family: Georgia, "Times New Roman", serif;
          letter-spacing: -0.048em;
          text-wrap: balance;
        }

        .hero h1 {
          max-width: 1180px;
          margin: 18px auto 23px;
          font-size: clamp(54px, 7.6vw, 104px);
          line-height: 0.94;
          font-weight: 500;
        }

        .hero h1 em {
          color: #ffc95c;
          font-style: italic;
        }

        .heroLead {
          max-width: 1000px;
          margin: 0 auto;
          color: #c0d0da;
          font-size: 18px;
          line-height: 1.75;
        }

        .heroActions {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 12px;
          margin-top: 32px;
        }

        .button {
          min-height: 52px;
          padding: 0 21px;
          display: inline-flex;
          align-items: center;
          gap: 13px;
          border-radius: 14px;
          border: 1px solid transparent;
          font-size: 12px;
          font-weight: 950;
          transition: transform 0.22s ease;
        }

        .button:hover {
          transform: translateY(-3px);
        }

        .button.primary {
          color: #031019;
          border-color: #a8effa;
          background: linear-gradient(
            135deg,
            #c7f5ff,
            #68d2ec 62%,
            #339fc1
          );
        }

        .button.gold {
          color: #281600;
          border-color: #f6d487;
          background: linear-gradient(
            135deg,
            #fff0b0,
            #efbd58 62%,
            #b66e12
          );
        }

        .button.glass {
          color: #e8f8ff;
          border-color: rgba(124, 215, 236, 0.28);
          background: linear-gradient(
            180deg,
            rgba(18, 49, 68, 0.9),
            rgba(7, 24, 38, 0.92)
          );
        }

        .summaryGrid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 10px;
          margin-top: 58px;
        }

        .summaryGrid article {
          min-height: 132px;
          padding: 18px 14px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border-radius: 18px;
          border: 1px solid rgba(109, 216, 255, 0.15);
          background: rgba(6, 22, 35, 0.76);
        }

        .summaryGrid strong {
          color: var(--gold);
          font-family: Georgia, serif;
          font-size: 42px;
          font-weight: 500;
        }

        .summaryGrid span {
          margin-top: 7px;
          color: #93a8b7;
          font-size: 10px;
          line-height: 1.45;
          font-weight: 850;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .searchSection,
        .categorySection,
        .recordsSection {
          padding: 100px 0;
        }

        .sectionHeading {
          max-width: 980px;
        }

        .sectionHeading h2,
        .recordsHeading h2,
        .boundary h2,
        .closing h2 {
          margin: 12px 0 16px;
          font-size: clamp(40px, 5vw, 70px);
          line-height: 1;
          font-weight: 500;
        }

        .sectionHeading > p:last-child,
        .boundary > div:first-child > p:last-child {
          color: var(--muted);
          line-height: 1.75;
        }

        .searchPanel {
          margin-top: 38px;
          padding: 24px;
          display: grid;
          gap: 20px;
          border: 1px solid rgba(112, 210, 234, 0.18);
          border-radius: 24px;
          background: linear-gradient(
            145deg,
            rgba(11, 31, 47, 0.92),
            rgba(4, 15, 25, 0.96)
          );
        }

        .searchField,
        .controlRow label {
          display: grid;
          gap: 9px;
        }

        .searchField > span,
        .controlRow label > span {
          color: #b8cad6;
          font-size: 10px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.09em;
        }

        input,
        select {
          width: 100%;
          min-height: 54px;
          padding: 0 16px;
          color: white;
          border: 1px solid rgba(109, 216, 255, 0.22);
          border-radius: 13px;
          background: rgba(2, 10, 18, 0.86);
          outline: none;
        }

        input:focus,
        select:focus {
          border-color: var(--gold);
          box-shadow: 0 0 0 3px rgba(241, 195, 109, 0.1);
        }

        .controlRow {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .activeSummary {
          min-height: 44px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          color: #8fa4b2;
          font-size: 11px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.07em;
        }

        .activeSummary button {
          min-height: 38px;
          padding: 0 12px;
          color: #ffe1a0;
          border: 1px solid rgba(241, 195, 109, 0.28);
          border-radius: 999px;
          background: rgba(99, 62, 10, 0.16);
          cursor: pointer;
          font-size: 10px;
          font-weight: 900;
        }

        .categoryGrid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
          margin-top: 40px;
        }

        .categoryGrid button {
          min-height: 250px;
          padding: 24px;
          display: grid;
          grid-template-columns: 42px 1fr auto;
          gap: 15px;
          align-items: start;
          color: white;
          text-align: left;
          border-radius: 22px;
          border: 1px solid rgba(109, 216, 255, 0.16);
          background:
            radial-gradient(
              circle at 100% 0%,
              rgba(109, 216, 255, 0.08),
              transparent 38%
            ),
            linear-gradient(
              155deg,
              rgba(12, 35, 54, 0.92),
              rgba(4, 15, 26, 0.97)
            );
          cursor: pointer;
          transition:
            transform 0.24s ease,
            border-color 0.24s ease;
        }

        .categoryGrid button:hover {
          transform: translateY(-6px);
          border-color: rgba(242, 191, 109, 0.44);
        }

        .categoryGrid button > span {
          width: 40px;
          height: 40px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          border: 1px solid rgba(109, 216, 255, 0.28);
          color: var(--blue);
          font-size: 9px;
          font-weight: 950;
        }

        .categoryGrid strong {
          display: block;
          margin-bottom: 11px;
          font-family: Georgia, serif;
          font-size: 25px;
          font-weight: 500;
        }

        .categoryGrid p {
          margin: 0;
          color: #9fb1bc;
          font-size: 12px;
          line-height: 1.66;
        }

        .categoryGrid b {
          min-width: 35px;
          height: 35px;
          display: grid;
          place-items: center;
          border-radius: 999px;
          color: #241600;
          background: linear-gradient(135deg, #fff0b0, #efbd58);
          font-size: 11px;
        }

        .recordsHeading {
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: 24px;
          margin-bottom: 35px;
        }

        .recordsHeading > div {
          max-width: 1000px;
        }

        .recordsHeading > span {
          color: #91a6b5;
          font-size: 11px;
          font-weight: 900;
          white-space: nowrap;
        }

        .recordGroups {
          display: grid;
          gap: 68px;
        }

        .recordGroup {
          display: grid;
          gap: 20px;
        }

        .groupHeading {
          min-height: 78px;
          padding: 0 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          border-bottom: 1px solid rgba(109, 216, 255, 0.18);
        }

        .groupHeading span {
          color: var(--gold);
          font-size: 9px;
          font-weight: 950;
          letter-spacing: 0.16em;
        }

        .groupHeading h3 {
          margin: 5px 0 0;
          font-family: Georgia, serif;
          font-size: 31px;
          font-weight: 500;
        }

        .groupHeading > strong {
          width: 46px;
          height: 46px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          color: var(--blue);
          border: 1px solid rgba(109, 216, 255, 0.25);
          font-size: 12px;
        }

        .recordGrid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 13px;
        }

        .recordCard {
          min-width: 0;
          padding: 22px;
          display: flex;
          flex-direction: column;
          border-radius: 20px;
          border: 1px solid rgba(109, 216, 255, 0.13);
          background: linear-gradient(
            145deg,
            rgba(11, 31, 47, 0.86),
            rgba(4, 15, 25, 0.95)
          );
        }

        .recordHeader {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          gap: 8px;
        }

        .categoryPill,
        .statusPill {
          min-height: 27px;
          padding: 0 9px;
          display: inline-flex;
          align-items: center;
          border-radius: 999px;
          font-size: 8px;
          font-weight: 950;
          letter-spacing: 0.08em;
        }

        .categoryPill {
          color: #041117;
          background: linear-gradient(135deg, #c7f5ff, #68d2ec);
        }

        .statusPill {
          color: #ffe4a6;
          border: 1px solid rgba(241, 195, 109, 0.24);
          background: rgba(91, 58, 12, 0.16);
        }

        .recordCard h3 {
          margin: 20px 0 18px;
          font-family: Georgia, serif;
          font-size: 26px;
          line-height: 1.18;
          font-weight: 500;
        }

        .recordDetails {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 8px;
        }

        .recordDetails > span {
          min-width: 0;
          padding: 11px;
          display: grid;
          gap: 5px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.035);
          color: #b9c9d3;
          font-size: 11px;
          overflow-wrap: anywhere;
        }

        .recordDetails strong {
          color: #778f9f;
          font-size: 8px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .recordDetails code {
          color: #c2e4f2;
          font-size: 10px;
          overflow-wrap: anywhere;
        }

        .description {
          margin: 16px 0 0;
          color: #aebfca;
          font-size: 12px;
          line-height: 1.65;
        }

        .relationship {
          margin-top: 16px;
          padding: 14px;
          border-left: 2px solid rgba(241, 195, 109, 0.5);
          background: rgba(102, 63, 10, 0.09);
        }

        .relationship strong {
          color: #f4d58e;
          font-size: 9px;
          text-transform: uppercase;
          letter-spacing: 0.07em;
        }

        .relationship p {
          margin: 7px 0 0;
          color: #b4c3cc;
          font-size: 11px;
          line-height: 1.55;
        }

        .tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 16px;
        }

        .tags span {
          padding: 6px 8px;
          border-radius: 999px;
          color: #91a9b8;
          background: rgba(255, 255, 255, 0.04);
          font-size: 9px;
          font-weight: 800;
        }

        .recordFooter {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-top: auto;
          padding-top: 20px;
        }

        .recordFooter > span:first-child {
          color: #6e8594;
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 8px;
          overflow-wrap: anywhere;
        }

        .recordFooter a,
        .pending {
          min-height: 39px;
          padding: 0 11px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 11px;
          font-size: 9px;
          font-weight: 900;
          text-align: center;
        }

        .recordFooter a {
          color: #ffe1a0;
          border: 1px solid rgba(241, 195, 109, 0.27);
          background: rgba(100, 64, 14, 0.16);
        }

        .pending {
          color: #758894;
          border: 1px solid rgba(117, 136, 148, 0.14);
          background: rgba(255, 255, 255, 0.025);
        }

        .emptyState {
          padding: 70px 24px;
          text-align: center;
          border: 1px solid rgba(109, 216, 255, 0.15);
          border-radius: 22px;
          background: rgba(5, 18, 30, 0.75);
        }

        .emptyState h3 {
          font-family: Georgia, serif;
          font-size: 34px;
          font-weight: 500;
        }

        .emptyState p {
          max-width: 680px;
          margin: 0 auto;
          color: var(--muted);
          line-height: 1.7;
        }

        .boundary {
          margin-top: 80px;
          padding: 72px 42px;
          border-radius: 30px;
          border: 1px solid rgba(242, 191, 109, 0.22);
          background:
            radial-gradient(
              circle at 0 0,
              rgba(183, 112, 26, 0.14),
              transparent 35%
            ),
            linear-gradient(
              145deg,
              rgba(11, 28, 43, 0.95),
              rgba(4, 13, 23, 0.98)
            );
        }

        .boundary > div:first-child {
          max-width: 980px;
        }

        .boundaryCards {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-top: 34px;
        }

        .boundaryCards article {
          padding: 22px;
          border-radius: 17px;
          border: 1px solid rgba(109, 216, 255, 0.14);
          background: rgba(5, 20, 33, 0.73);
        }

        .boundaryCards strong {
          font-family: Georgia, serif;
          font-size: 20px;
        }

        .boundaryCards p {
          color: #9fb0bc;
          font-size: 12px;
          line-height: 1.65;
        }

        .closing {
          margin-top: 110px;
          padding: 80px 32px;
          text-align: center;
          border-radius: 30px;
          border: 1px solid rgba(242, 191, 109, 0.22);
          background:
            radial-gradient(
              circle at 50% 0%,
              rgba(242, 191, 109, 0.12),
              transparent 40%
            ),
            linear-gradient(
              145deg,
              rgba(24, 25, 29, 0.94),
              rgba(5, 15, 25, 0.98)
            );
        }

        .closing > strong {
          display: block;
          margin-top: 30px;
          color: #f4dfa7;
          font-family: Georgia, serif;
        }

        footer {
          min-height: 100px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #768c9b;
          font-size: 11px;
        }

        @keyframes drift {
          to {
            transform: translate3d(120px, 90px, 0);
          }
        }

        @keyframes routeMove {
          from {
            translate: -30vw 0;
            opacity: 0;
          }

          20% {
            opacity: 0.5;
          }

          80% {
            opacity: 0.35;
          }

          to {
            translate: 120vw 0;
            opacity: 0;
          }
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 1180px) {
          .topbar nav {
            display: none;
          }

          .summaryGrid {
            grid-template-columns: repeat(3, 1fr);
          }

          .categoryGrid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 860px) {
          .recordGrid {
            grid-template-columns: 1fr;
          }

          .controlRow,
          .boundaryCards {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 700px) {
          .shell {
            width: min(100% - 24px, 1380px);
          }

          .topbar {
            width: min(100% - 22px, 1500px);
          }

          .brand small,
          .topAction {
            display: none;
          }

          .hero {
            padding: 82px 0 78px;
          }

          .heroLead {
            font-size: 16px;
          }

          .heroActions .button {
            width: 100%;
            justify-content: center;
          }

          .summaryGrid,
          .categoryGrid,
          .recordDetails {
            grid-template-columns: 1fr;
          }

          .searchPanel,
          .boundary,
          .closing {
            padding: 28px 20px;
          }

          .categoryGrid button {
            grid-template-columns: 42px 1fr;
          }

          .categoryGrid b {
            grid-column: 1 / -1;
          }

          .recordsHeading {
            align-items: flex-start;
            flex-direction: column;
          }

          .recordFooter,
          .activeSummary {
            align-items: flex-start;
            flex-direction: column;
          }

          .recordFooter a,
          .pending {
            width: 100%;
          }

          footer {
            flex-direction: column;
            align-items: flex-start;
            justify-content: center;
            gap: 6px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.001ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.001ms !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>
    </main>
  );
}
