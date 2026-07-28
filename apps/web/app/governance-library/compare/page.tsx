"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  governanceLibraryRecords,
} from "../../../lib/governance-library";
import type {
  GovernanceLibraryRecord,
} from "../../../lib/governance-library/records-foundational";

type SortField =
  | "title"
  | "recordType"
  | "jurisdiction"
  | "publisher"
  | "status";

type SortDirection = "asc" | "desc";

function normalize(value: string | undefined) {
  return value?.trim() || "Unspecified";
}

function getRecordValue(
  record: GovernanceLibraryRecord,
  field: SortField,
) {
  return normalize(record[field]);
}

export default function GovernanceLibraryComparePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [recordTypeFilter, setRecordTypeFilter] =
    useState("All record types");
  const [jurisdictionFilter, setJurisdictionFilter] =
    useState("All jurisdictions");
  const [publisherFilter, setPublisherFilter] =
    useState("All publishers");
  const [statusFilter, setStatusFilter] =
    useState("All statuses");
  const [sortField, setSortField] =
    useState<SortField>("title");
  const [sortDirection, setSortDirection] =
    useState<SortDirection>("asc");
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>(
    [],
  );
  const [showSelectionOnly, setShowSelectionOnly] =
    useState(false);

  const records = useMemo(
    () =>
      [...governanceLibraryRecords] as GovernanceLibraryRecord[],
    [],
  );

  const recordTypes = useMemo(
    () => [
      "All record types",
      ...Array.from(
        new Set(
          records.map((record) =>
            normalize(record.recordType),
          ),
        ),
      ).sort(),
    ],
    [records],
  );

  const jurisdictions = useMemo(
    () => [
      "All jurisdictions",
      ...Array.from(
        new Set(
          records.map((record) =>
            normalize(record.jurisdiction),
          ),
        ),
      ).sort(),
    ],
    [records],
  );

  const publishers = useMemo(
    () => [
      "All publishers",
      ...Array.from(
        new Set(
          records.map((record) =>
            normalize(record.publisher),
          ),
        ),
      ).sort(),
    ],
    [records],
  );

  const statuses = useMemo(
    () => [
      "All statuses",
      ...Array.from(
        new Set(
          records.map((record) =>
            normalize(record.status),
          ),
        ),
      ).sort(),
    ],
    [records],
  );

  const visibleRecords = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return records
      .filter((record) => {
        const matchesQuery =
          query.length === 0 ||
          [
            record.title,
            record.recordType,
            record.jurisdiction,
            record.publisher,
            record.status,
            record.summary,
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase()
            .includes(query);

        const matchesRecordType =
          recordTypeFilter === "All record types" ||
          normalize(record.recordType) === recordTypeFilter;

        const matchesJurisdiction =
          jurisdictionFilter === "All jurisdictions" ||
          normalize(record.jurisdiction) === jurisdictionFilter;

        const matchesPublisher =
          publisherFilter === "All publishers" ||
          normalize(record.publisher) === publisherFilter;

        const matchesStatus =
          statusFilter === "All statuses" ||
          normalize(record.status) === statusFilter;

        const matchesSelection =
          !showSelectionOnly ||
          selectedSlugs.includes(record.slug);

        return (
          matchesQuery &&
          matchesRecordType &&
          matchesJurisdiction &&
          matchesPublisher &&
          matchesStatus &&
          matchesSelection
        );
      })
      .sort((a, b) => {
        const first = getRecordValue(
          a,
          sortField,
        ).toLowerCase();
        const second = getRecordValue(
          b,
          sortField,
        ).toLowerCase();

        const comparison = first.localeCompare(second);

        return sortDirection === "asc"
          ? comparison
          : comparison * -1;
      });
  }, [
    jurisdictionFilter,
    publisherFilter,
    recordTypeFilter,
    records,
    searchQuery,
    selectedSlugs,
    showSelectionOnly,
    sortDirection,
    sortField,
    statusFilter,
  ]);

  const selectedRecords = useMemo(
    () =>
      selectedSlugs
        .map((slug) =>
          records.find((record) => record.slug === slug),
        )
        .filter(
          (
            record,
          ): record is GovernanceLibraryRecord =>
            Boolean(record),
        ),
    [records, selectedSlugs],
  );

  const activeFilterCount = [
    searchQuery.trim().length > 0,
    recordTypeFilter !== "All record types",
    jurisdictionFilter !== "All jurisdictions",
    publisherFilter !== "All publishers",
    statusFilter !== "All statuses",
    showSelectionOnly,
  ].filter(Boolean).length;

  function toggleRecordSelection(slug: string) {
    setSelectedSlugs((current) => {
      if (current.includes(slug)) {
        return current.filter((item) => item !== slug);
      }

      if (current.length >= 4) {
        return current;
      }

      return [...current, slug];
    });
  }

  function changeSort(field: SortField) {
    if (sortField === field) {
      setSortDirection((current) =>
        current === "asc" ? "desc" : "asc",
      );
      return;
    }

    setSortField(field);
    setSortDirection("asc");
  }

  function clearFilters() {
    setSearchQuery("");
    setRecordTypeFilter("All record types");
    setJurisdictionFilter("All jurisdictions");
    setPublisherFilter("All publishers");
    setStatusFilter("All statuses");
    setShowSelectionOnly(false);
  }

  function clearSelection() {
    setSelectedSlugs([]);
    setShowSelectionOnly(false);
  }

  return (
    <main className="comparePage">
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
            Comparison matrix active
          </div>

          <Link
            href="/governance-library/crosswalks"
            className="topbarAction"
          >
            View Crosswalks →
          </Link>
        </div>

        <header className="hero">
          <div className="heroSeal">
            <span>CM</span>
            <small>Comparison matrix</small>
          </div>

          <p className="eyebrow">
            TA-14 AI GOVERNANCE LIBRARY
          </p>

          <h1>
            Governance Comparison
            <span> Matrix</span>
          </h1>

          <p className="lead">
            Compare laws, regulations, standards, frameworks,
            principles, recommendations, methodologies, and other
            governance records across type, jurisdiction, publisher,
            and status while preserving the distinctions between
            authority, applicability, obligation, and execution.
          </p>

          <div className="heroMetrics">
            <article>
              <span>{records.length}</span>
              <small>Records available</small>
            </article>

            <article>
              <span>{visibleRecords.length}</span>
              <small>Records shown</small>
            </article>

            <article>
              <span>{selectedRecords.length}</span>
              <small>Records selected</small>
            </article>

            <article>
              <span>{activeFilterCount}</span>
              <small>Active filters</small>
            </article>

            <article>
              <span>{jurisdictions.length - 1}</span>
              <small>Jurisdictions</small>
            </article>
          </div>
        </header>

        <section className="controlSection">
          <div className="sectionHeading">
            <div>
              <p className="eyebrow">
                COMPARISON CONTROL DESK
              </p>

              <h2>
                Filter, sort, select, and inspect.
              </h2>
            </div>

            <p>
              Select up to four records for a focused comparison.
              Similar labels do not prove equivalent authority,
              requirements, scope, evidence expectations, or legal
              effect.
            </p>
          </div>

          <div className="filterPanel">
            <label className="searchField">
              Search governance records
              <input
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(event.target.value)
                }
                placeholder="Search title, type, jurisdiction, publisher, status, or summary"
              />
            </label>

            <label>
              Record type
              <select
                value={recordTypeFilter}
                onChange={(event) =>
                  setRecordTypeFilter(event.target.value)
                }
              >
                {recordTypes.map((recordType) => (
                  <option
                    key={recordType}
                    value={recordType}
                  >
                    {recordType}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Jurisdiction
              <select
                value={jurisdictionFilter}
                onChange={(event) =>
                  setJurisdictionFilter(event.target.value)
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
              Publisher
              <select
                value={publisherFilter}
                onChange={(event) =>
                  setPublisherFilter(event.target.value)
                }
              >
                {publishers.map((publisher) => (
                  <option
                    key={publisher}
                    value={publisher}
                  >
                    {publisher}
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
              <small>Records shown</small>
            </div>

            <div>
              <span>{selectedRecords.length}/4</span>
              <small>Comparison slots</small>
            </div>

            <label className="selectionToggle">
              <input
                type="checkbox"
                checked={showSelectionOnly}
                disabled={selectedSlugs.length === 0}
                onChange={(event) =>
                  setShowSelectionOnly(event.target.checked)
                }
              />
              Show selected records only
            </label>

            <button
              type="button"
              onClick={clearSelection}
              disabled={selectedSlugs.length === 0}
            >
              Clear selection
            </button>
          </div>
        </section>

        {selectedRecords.length > 0 ? (
          <section className="focusedComparison">
            <div className="comparisonHeading">
              <div>
                <p className="eyebrow gold">
                  FOCUSED COMPARISON
                </p>

                <h2>Selected governance records</h2>
              </div>

              <p>
                The matrix below presents source metadata for direct
                inspection. It does not assert equivalence,
                precedence, conformity, or applicability.
              </p>
            </div>

            <div className="selectedGrid">
              {selectedRecords.map((record, index) => (
                <article
                  key={record.slug}
                  className="selectedCard"
                >
                  <div className="selectedHeader">
                    <div className="selectedIndex">
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        toggleRecordSelection(record.slug)
                      }
                    >
                      Remove
                    </button>
                  </div>

                  <p>{normalize(record.recordType)}</p>
                  <h3>{record.title}</h3>

                  <dl>
                    <div>
                      <dt>Jurisdiction</dt>
                      <dd>
                        {normalize(record.jurisdiction)}
                      </dd>
                    </div>

                    <div>
                      <dt>Publisher</dt>
                      <dd>{normalize(record.publisher)}</dd>
                    </div>

                    <div>
                      <dt>Status</dt>
                      <dd>{normalize(record.status)}</dd>
                    </div>
                  </dl>

                  <Link
                    href={`/governance-library/${record.slug}`}
                  >
                    Open complete record →
                  </Link>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        <section className="matrixSection">
          <div className="matrixShell">
            <div className="matrixHeader">
              <div>
                <p className="eyebrow">
                  COMPLETE RECORD MATRIX
                </p>

                <h2>Governance source comparison</h2>
              </div>

              <div className="sortStatus">
                Sorted by{" "}
                <strong>
                  {sortField === "recordType"
                    ? "record type"
                    : sortField}
                </strong>{" "}
                · {sortDirection === "asc"
                  ? "ascending"
                  : "descending"}
              </div>
            </div>

            <div className="tableScroll">
              <table>
                <thead>
                  <tr>
                    <th className="selectColumn">
                      Compare
                    </th>

                    <th>
                      <button
                        type="button"
                        onClick={() => changeSort("title")}
                      >
                        Title
                        <span>
                          {sortField === "title"
                            ? sortDirection === "asc"
                              ? "↑"
                              : "↓"
                            : "↕"}
                        </span>
                      </button>
                    </th>

                    <th>
                      <button
                        type="button"
                        onClick={() =>
                          changeSort("recordType")
                        }
                      >
                        Type
                        <span>
                          {sortField === "recordType"
                            ? sortDirection === "asc"
                              ? "↑"
                              : "↓"
                            : "↕"}
                        </span>
                      </button>
                    </th>

                    <th>
                      <button
                        type="button"
                        onClick={() =>
                          changeSort("jurisdiction")
                        }
                      >
                        Jurisdiction
                        <span>
                          {sortField === "jurisdiction"
                            ? sortDirection === "asc"
                              ? "↑"
                              : "↓"
                            : "↕"}
                        </span>
                      </button>
                    </th>

                    <th>
                      <button
                        type="button"
                        onClick={() =>
                          changeSort("publisher")
                        }
                      >
                        Publisher
                        <span>
                          {sortField === "publisher"
                            ? sortDirection === "asc"
                              ? "↑"
                              : "↓"
                            : "↕"}
                        </span>
                      </button>
                    </th>

                    <th>
                      <button
                        type="button"
                        onClick={() => changeSort("status")}
                      >
                        Status
                        <span>
                          {sortField === "status"
                            ? sortDirection === "asc"
                              ? "↑"
                              : "↓"
                            : "↕"}
                        </span>
                      </button>
                    </th>

                    <th className="actionColumn">
                      Record
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {visibleRecords.map((record) => {
                    const isSelected =
                      selectedSlugs.includes(record.slug);
                    const selectionIsFull =
                      selectedSlugs.length >= 4 &&
                      !isSelected;

                    return (
                      <tr
                        key={record.slug}
                        className={
                          isSelected ? "selectedRow" : ""
                        }
                      >
                        <td className="selectCell">
                          <button
                            type="button"
                            className={
                              isSelected
                                ? "selectionButton selected"
                                : "selectionButton"
                            }
                            disabled={selectionIsFull}
                            aria-label={
                              isSelected
                                ? `Remove ${record.title} from comparison`
                                : `Add ${record.title} to comparison`
                            }
                            onClick={() =>
                              toggleRecordSelection(
                                record.slug,
                              )
                            }
                          >
                            {isSelected ? "✓" : "+"}
                          </button>
                        </td>

                        <td className="titleCell">
                          <strong>{record.title}</strong>

                          {record.summary ? (
                            <p>{record.summary}</p>
                          ) : null}
                        </td>

                        <td>
                          <span className="typeBadge">
                            {normalize(record.recordType)}
                          </span>
                        </td>

                        <td>
                          {normalize(record.jurisdiction)}
                        </td>

                        <td>
                          {normalize(record.publisher)}
                        </td>

                        <td>
                          <span className="statusBadge">
                            {normalize(record.status)}
                          </span>
                        </td>

                        <td>
                          <Link
                            href={`/governance-library/${record.slug}`}
                            className="recordLink"
                          >
                            View →
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {visibleRecords.length === 0 ? (
              <div className="emptyState">
                <div className="emptySeal">0</div>

                <h3>
                  No governance records match the current
                  comparison criteria.
                </h3>

                <p>
                  Clear the filters or broaden the search terms to
                  restore the matrix.
                </p>

                <button
                  type="button"
                  onClick={clearFilters}
                >
                  Reset comparison matrix
                </button>
              </div>
            ) : null}
          </div>
        </section>

        <section className="comparisonBoundary">
          <div className="boundarySeal">
            <span>CB</span>
            <small>Comparison boundary</small>
          </div>

          <p className="eyebrow gold">
            GOVERNANCE COMPARISON BOUNDARY
          </p>

          <h2>
            Comparable does not mean interchangeable.
          </h2>

          <p>
            Governance records may address similar subjects while
            carrying different authority, scope, terminology,
            obligations, lifecycle expectations, evidence
            requirements, enforcement conditions, and legal effects.
            A comparison matrix supports structured review. It does
            not itself establish applicability, precedence,
            equivalence, compliance, certification, or permission to
            execute.
          </p>

          <div className="boundaryGrid">
            <article>
              <span>COMPARISON CAN SHOW</span>
              <strong>
                Shared metadata, source distinctions, overlapping
                domains, and structural differences
              </strong>
            </article>

            <article>
              <span>COMPARISON CANNOT PROVE</span>
              <strong>
                Legal equivalence, substituted compliance,
                applicability, conformity, or execution authority
              </strong>
            </article>

            <article>
              <span>GOVERNED USE REQUIRES</span>
              <strong>
                Source review, competent interpretation,
                applicability evidence, binding, and preserved
                execution records
              </strong>
            </article>
          </div>

          <div className="boundaryActions">
            <Link
              href="/governance-library/crosswalks"
              className="secondaryAction"
            >
              Open Crosswalks
            </Link>

            <Link
              href="/governance-library/relationships"
              className="secondaryAction"
            >
              Open Relationships
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
        .comparePage {
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
          width: min(1560px, calc(100% - 40px));
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
          font-size: clamp(52px, 6.1vw, 88px);
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
          max-width: 970px;
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

        .sectionHeading,
        .comparisonHeading {
          margin-bottom: 31px;
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          align-items: end;
          gap: 40px;
        }

        .sectionHeading h2,
        .comparisonHeading h2,
        .matrixHeader h2,
        .comparisonBoundary h2 {
          margin: 11px 0 0;
          font-size: clamp(38px, 4.2vw, 62px);
          line-height: 0.99;
          letter-spacing: -0.047em;
        }

        .sectionHeading > p,
        .comparisonHeading > p {
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
            repeat(4, minmax(150px, 0.7fr))
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
          gap: 26px;
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

        .selectionToggle {
          margin-left: auto;
          display: flex;
          grid-template-columns: none;
          align-items: center;
          gap: 9px;
          cursor: pointer;
        }

        .selectionToggle input {
          width: 16px;
          min-height: 16px;
          accent-color: #74e0ee;
        }

        .resultBar > button {
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

        .focusedComparison {
          padding-top: 80px;
        }

        .selectedGrid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 14px;
        }

        .selectedCard {
          min-width: 0;
          padding: 21px;
          border: 1px solid rgba(255, 198, 82, 0.18);
          border-radius: 20px;
          background:
            radial-gradient(
              circle at 0 0,
              rgba(255, 194, 69, 0.07),
              transparent 31%
            ),
            linear-gradient(
              145deg,
              rgba(10, 27, 39, 0.97),
              rgba(3, 12, 20, 0.99)
            );
        }

        .selectedHeader {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .selectedIndex {
          width: 45px;
          height: 45px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(255, 198, 82, 0.25);
          border-radius: 50%;
          color: #efc66f;
          font: 700 12px Georgia, serif;
        }

        .selectedHeader button {
          border: 0;
          color: #899fa8;
          background: none;
          cursor: pointer;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.07em;
          text-transform: uppercase;
        }

        .selectedCard > p {
          margin: 20px 0 0;
          color: #69ddeb;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .selectedCard h3 {
          margin: 8px 0 0;
          color: #e9f1f3;
          font-size: 22px;
          line-height: 1.18;
        }

        .selectedCard dl {
          margin: 20px 0 0;
          display: grid;
          gap: 10px;
        }

        .selectedCard dl div {
          padding-top: 10px;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
        }

        .selectedCard dt {
          color: #6e8792;
          font-size: 7px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .selectedCard dd {
          margin: 5px 0 0;
          color: #b5c6cd;
          font-size: 10px;
          line-height: 1.45;
        }

        .selectedCard > a {
          margin-top: 20px;
          display: inline-flex;
          color: #efc978;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.05em;
          text-decoration: none;
          text-transform: uppercase;
        }

        .matrixSection {
          padding-top: 80px;
        }

        .matrixShell {
          overflow: hidden;
          border: 1px solid rgba(99, 230, 255, 0.12);
          border-radius: 24px;
          background: linear-gradient(
            145deg,
            rgba(9, 29, 44, 0.95),
            rgba(3, 13, 22, 0.98)
          );
          box-shadow: 0 28px 75px rgba(0, 0, 0, 0.3);
        }

        .matrixHeader {
          padding: 25px;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 24px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.07);
        }

        .matrixHeader h2 {
          font-size: clamp(31px, 3.3vw, 48px);
        }

        .sortStatus {
          color: #718995;
          font-size: 9px;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .sortStatus strong {
          color: #b8cbd2;
        }

        .tableScroll {
          overflow-x: auto;
        }

        table {
          width: 100%;
          min-width: 1200px;
          border-collapse: collapse;
          text-align: left;
        }

        thead {
          background: rgba(255, 255, 255, 0.025);
        }

        th {
          padding: 14px;
          color: #718d99;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.09em;
          text-transform: uppercase;
          white-space: nowrap;
        }

        th button {
          width: 100%;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          border: 0;
          color: inherit;
          background: none;
          cursor: pointer;
          font: inherit;
          letter-spacing: inherit;
          text-transform: inherit;
        }

        th button span {
          color: #4f6c78;
        }

        td {
          padding: 16px 14px;
          border-top: 1px solid rgba(255, 255, 255, 0.055);
          color: #a9bbc3;
          font-size: 10px;
          line-height: 1.45;
          vertical-align: top;
        }

        tbody tr {
          transition:
            background 0.2s,
            box-shadow 0.2s;
        }

        tbody tr:hover {
          background: rgba(99, 230, 255, 0.025);
        }

        tbody tr.selectedRow {
          background: rgba(255, 195, 75, 0.035);
          box-shadow: inset 3px 0 #ddb45f;
        }

        .selectColumn,
        .selectCell {
          width: 72px;
          text-align: center;
        }

        .actionColumn {
          width: 90px;
        }

        .selectionButton {
          width: 31px;
          height: 31px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(99, 230, 255, 0.15);
          border-radius: 50%;
          color: #72ddeb;
          background: rgba(99, 230, 255, 0.04);
          cursor: pointer;
          font-size: 15px;
          font-weight: 900;
        }

        .selectionButton.selected {
          color: #06171e;
          border-color: #f0ce83;
          background: #f0ce83;
        }

        .titleCell {
          min-width: 330px;
          max-width: 430px;
        }

        .titleCell strong {
          color: #e5eef1;
          font: 700 16px/1.3 Georgia, serif;
        }

        .titleCell p {
          margin: 7px 0 0;
          color: #748b96;
          font-size: 9px;
          line-height: 1.55;
        }

        .typeBadge,
        .statusBadge {
          display: inline-flex;
          padding: 6px 8px;
          border: 1px solid rgba(99, 230, 255, 0.12);
          border-radius: 999px;
          color: #88dce8;
          background: rgba(99, 230, 255, 0.035);
          font-size: 7px;
          font-weight: 900;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .statusBadge {
          color: #e5c575;
          border-color: rgba(255, 198, 82, 0.14);
          background: rgba(255, 198, 82, 0.035);
        }

        .recordLink {
          color: #efc978;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.05em;
          text-decoration: none;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .emptyState {
          padding: 72px 25px;
          border-top: 1px dashed rgba(255, 255, 255, 0.09);
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

        .emptyState h3 {
          margin: 20px auto 0;
          max-width: 700px;
          font-size: 28px;
        }

        .emptyState p {
          margin: 13px 0 0;
          color: #849aa5;
          font-size: 12px;
        }

        .emptyState button {
          min-height: 43px;
          margin-top: 20px;
          padding: 0 15px;
          border: 1px solid rgba(99, 230, 255, 0.18);
          border-radius: 10px;
          color: #bfe4eb;
          background: rgba(99, 230, 255, 0.05);
          cursor: pointer;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .comparisonBoundary {
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

        .comparisonBoundary h2 {
          max-width: 1040px;
          margin: 14px auto 0;
        }

        .comparisonBoundary > p:not(.eyebrow) {
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

        @media (max-width: 1380px) {
          .filterPanel {
            grid-template-columns: repeat(
              3,
              minmax(0, 1fr)
            );
          }

          .searchField {
            grid-column: span 2;
          }
        }

        @media (max-width: 1120px) {
          .heroMetrics {
            grid-template-columns: repeat(
              3,
              minmax(0, 1fr)
            );
          }

          .selectedGrid {
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

          .sectionHeading,
          .comparisonHeading {
            grid-template-columns: 1fr;
          }

          .resultBar {
            align-items: flex-start;
            flex-wrap: wrap;
          }

          .selectionToggle {
            margin-left: 0;
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
          .filterPanel,
          .selectedGrid {
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

          .matrixHeader {
            align-items: flex-start;
            flex-direction: column;
          }

          .comparisonBoundary {
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
