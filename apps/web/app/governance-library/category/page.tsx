"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { getAllCategories } from "../../../lib/governance-library/filters";
import { getCategoryCounts } from "../../../lib/governance-library/statistics";

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function GovernanceCategoriesPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const categories = useMemo(() => {
    const counts = new Map(
      getCategoryCounts().map((item) => [
        item.category,
        item.count,
      ]),
    );

    return getAllCategories()
      .map((category: string) => ({
        name: category,
        count: counts.get(category) ?? 0,
        slug: slugify(category),
      }))
      .sort((a, b) => {
        if (b.count !== a.count) {
          return b.count - a.count;
        }

        return a.name.localeCompare(b.name);
      });
  }, []);

  const visibleCategories = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return categories;
    }

    return categories.filter((category) =>
      category.name.toLowerCase().includes(query),
    );
  }, [categories, searchQuery]);

  const totalRecords = categories.reduce(
    (total, category) => total + category.count,
    0,
  );

  const largestCategory = categories[0];

  return (
    <main className="categoryPage">
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
            Category index active
          </div>

          <Link
            href="/governance-library/topics"
            className="topbarAction"
          >
            View Topics →
          </Link>
        </div>

        <header className="hero">
          <div className="heroSeal">
            <span>GC</span>
            <small>Category index</small>
          </div>

          <p className="eyebrow">
            TA-14 AI GOVERNANCE LIBRARY
          </p>

          <h1>
            Governance
            <span> Categories</span>
          </h1>

          <p className="lead">
            Browse the governance library through its principal
            categories. Each category groups related laws,
            regulations, standards, frameworks, guidance,
            principles, and governance records without replacing the
            authority, jurisdiction, applicability, or record-type
            distinctions attached to each source.
          </p>

          <div className="heroMetrics">
            <article>
              <span>{categories.length}</span>
              <small>Categories indexed</small>
            </article>

            <article>
              <span>{totalRecords}</span>
              <small>Category assignments</small>
            </article>

            <article>
              <span>{largestCategory?.count ?? 0}</span>
              <small>Largest category</small>
            </article>

            <article>
              <span>{visibleCategories.length}</span>
              <small>Categories shown</small>
            </article>
          </div>
        </header>

        <section className="controlSection">
          <div className="sectionHeading">
            <div>
              <p className="eyebrow">
                CATEGORY CONTROL DESK
              </p>

              <h2>
                Find the governance domain you need.
              </h2>
            </div>

            <p>
              Categories organize records for navigation. They do not
              establish legal applicability, priority, authority,
              conformity, or permission to execute.
            </p>
          </div>

          <div className="searchPanel">
            <label>
              Search governance categories
              <input
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(event.target.value)
                }
                placeholder="Search by category name"
              />
            </label>

            <div className="searchSummary">
              <span>{visibleCategories.length}</span>
              <small>
                {visibleCategories.length === 1
                  ? "category found"
                  : "categories found"}
              </small>
            </div>

            <button
              type="button"
              onClick={() => setSearchQuery("")}
            >
              Clear search
            </button>
          </div>
        </section>

        <section className="categorySection">
          {visibleCategories.length > 0 ? (
            <div className="categoryGrid">
              {visibleCategories.map((category, index) => (
                <Link
                  key={category.name}
                  href={`/governance-library/category/${category.slug}`}
                  className="categoryCard"
                >
                  <div className="cardHeader">
                    <div className="categoryIndex">
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    <div className="recordCount">
                      <strong>{category.count}</strong>
                      <small>
                        {category.count === 1
                          ? "record"
                          : "records"}
                      </small>
                    </div>
                  </div>

                  <div className="cardBody">
                    <p>Governance category</p>
                    <h2>{category.name}</h2>

                    <span>
                      Open the category index to review the records,
                      authorities, jurisdictions, and governance
                      instruments assigned to this domain.
                    </span>
                  </div>

                  <div className="cardFooter">
                    <small>
                      /category/{category.slug}
                    </small>

                    <strong>View category →</strong>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="emptyState">
              <div className="emptySeal">0</div>

              <h2>No categories match this search.</h2>

              <p>
                Clear the search or enter a broader governance term.
              </p>

              <button
                type="button"
                onClick={() => setSearchQuery("")}
              >
                Reset category search
              </button>
            </div>
          )}
        </section>

        <section className="categoryBoundary">
          <div className="boundarySeal">
            <span>CB</span>
            <small>Category boundary</small>
          </div>

          <p className="eyebrow gold">
            GOVERNANCE CATEGORY BOUNDARY
          </p>

          <h2>
            Classification is not applicability.
          </h2>

          <p>
            A category helps users locate related governance
            materials. It does not determine whether a law,
            regulation, standard, framework, principle, or guidance
            document applies to a specific entity, AI system,
            jurisdiction, sector, lifecycle stage, or proposed
            action. Applicability must be separately established and
            preserved.
          </p>

          <div className="boundaryGrid">
            <article>
              <span>CATEGORY ESTABLISHES</span>
              <strong>
                A navigational grouping for records addressing a
                related governance domain
              </strong>
            </article>

            <article>
              <span>CATEGORY DOES NOT ESTABLISH</span>
              <strong>
                Authority, legal obligation, conformity, priority,
                certification, or permission to execute
              </strong>
            </article>

            <article>
              <span>GOVERNED USE REQUIRES</span>
              <strong>
                Source authority, jurisdiction, applicability,
                evidence, interpretation, and execution controls
              </strong>
            </article>
          </div>

          <div className="boundaryActions">
            <Link
              href="/governance-library/topics"
              className="secondaryAction"
            >
              Open Topics
            </Link>

            <Link
              href="/governance-library/type"
              className="secondaryAction"
            >
              Open Record Types
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
        .categoryPage {
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
          max-width: 1120px;
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
          max-width: 940px;
          margin: 27px auto 0;
          color: #afc1ca;
          font-size: 18px;
          line-height: 1.75;
        }

        .heroMetrics {
          margin-top: 36px;
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
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
        .categoryBoundary h2 {
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
          grid-template-columns: minmax(260px, 1fr) auto auto;
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

        .categorySection {
          padding-top: 25px;
        }

        .categoryGrid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
        }

        .categoryCard {
          min-height: 310px;
          padding: 22px;
          display: flex;
          flex-direction: column;
          border: 1px solid rgba(99, 230, 255, 0.11);
          border-radius: 22px;
          color: inherit;
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
          text-decoration: none;
          transition:
            transform 0.22s,
            border-color 0.22s,
            background 0.22s;
        }

        .categoryCard:hover {
          transform: translateY(-5px);
          border-color: rgba(99, 230, 255, 0.3);
          background:
            radial-gradient(
              circle at 0 0,
              rgba(99, 230, 255, 0.09),
              transparent 31%
            ),
            linear-gradient(
              145deg,
              rgba(10, 33, 50, 0.98),
              rgba(3, 13, 22, 0.98)
            );
        }

        .cardHeader {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
        }

        .categoryIndex {
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

        .recordCount {
          padding: 8px 11px;
          display: grid;
          justify-items: center;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 11px;
          background: rgba(0, 0, 0, 0.15);
        }

        .recordCount strong {
          color: #efcd85;
          font: 700 21px Georgia, serif;
        }

        .recordCount small {
          color: #718893;
          font-size: 7px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .cardBody {
          margin-top: 27px;
        }

        .cardBody p {
          margin: 0;
          color: #6edbeb;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .cardBody h2 {
          margin: 9px 0 0;
          color: #e6f0f3;
          font-size: 27px;
          line-height: 1.08;
        }

        .cardBody span {
          display: block;
          margin-top: 14px;
          color: #8da3ad;
          font-size: 11px;
          line-height: 1.65;
        }

        .cardFooter {
          margin-top: auto;
          padding-top: 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
        }

        .cardFooter small {
          overflow: hidden;
          color: #617984;
          font-size: 8px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .cardFooter strong {
          flex: 0 0 auto;
          color: #efc978;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.05em;
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

        .categoryBoundary {
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

        .categoryBoundary h2 {
          max-width: 1040px;
          margin: 14px auto 0;
        }

        .categoryBoundary > p:not(.eyebrow) {
          max-width: 970px;
          margin: 23px auto 0;
          color: #a4b4bc;
          font-size: 15px;
          line-height: 1.78;
        }

        .boundaryGrid {
          max-width: 1080px;
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
          .categoryGrid {
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

          .sectionHeading,
          .searchPanel {
            grid-template-columns: 1fr;
          }

          .boundaryGrid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 680px) {
          .pageShell {
            width: calc(100% - 22px);
          }

          .topbar,
          .heroMetrics,
          .categoryGrid {
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

          .categoryBoundary {
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
