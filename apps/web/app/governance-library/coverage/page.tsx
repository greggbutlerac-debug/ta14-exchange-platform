"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  governanceLibraryRecords,
} from "../../../lib/governance-library";
import type {
  GovernanceLibraryRecord,
} from "../../../lib/governance-library/records-foundational";

type CoverageFilter =
  | "All Records"
  | "Official Source Present"
  | "Official Source Missing";

type CoverageStatus =
  | "Source Verified"
  | "Source Required";

function normalizeValue(value: string | undefined) {
  return value?.trim() || "Unspecified";
}

function getCoverageStatus(
  record: GovernanceLibraryRecord,
): CoverageStatus {
  return record.officialUrl
    ? "Source Verified"
    : "Source Required";
}

export default function GovernanceLibraryCoveragePage() {
  const records: GovernanceLibraryRecord[] =
    governanceLibraryRecords;

  const [coverageFilter, setCoverageFilter] =
    useState<CoverageFilter>("All Records");

  const [recordTypeFilter, setRecordTypeFilter] =
    useState("All Record Types");

  const [publisherFilter, setPublisherFilter] =
    useState("All Publishers");

  const [searchTerm, setSearchTerm] = useState("");

  const totalRecords = records.length;

  const withOfficialSources = records.filter(
    (record) => Boolean(record.officialUrl),
  ).length;

  const missingOfficialSources =
    totalRecords - withOfficialSources;

  const sourceCoveragePercentage =
    totalRecords === 0
      ? 0
      : Math.round(
          (withOfficialSources / totalRecords) * 100,
        );

  const recordTypes = useMemo(
    () =>
      Array.from(
        new Set(
          records.map((record) =>
            normalizeValue(record.recordType),
          ),
        ),
      ).sort((a, b) => a.localeCompare(b)),
    [records],
  );

  const publishers = useMemo(
    () =>
      Array.from(
        new Set(
          records.map((record) =>
            normalizeValue(record.publisher),
          ),
        ),
      ).sort((a, b) => a.localeCompare(b)),
    [records],
  );

  const publisherCoverage = useMemo(() => {
    return publishers
      .map((publisher) => {
        const publisherRecords = records.filter(
          (record) =>
            normalizeValue(record.publisher) === publisher,
        );

        const sourcedRecords = publisherRecords.filter(
          (record) => Boolean(record.officialUrl),
        ).length;

        const percentage =
          publisherRecords.length === 0
            ? 0
            : Math.round(
                (sourcedRecords /
                  publisherRecords.length) *
                  100,
              );

        return {
          publisher,
          total: publisherRecords.length,
          sourced: sourcedRecords,
          missing:
            publisherRecords.length - sourcedRecords,
          percentage,
        };
      })
      .sort((a, b) => {
        if (a.percentage !== b.percentage) {
          return a.percentage - b.percentage;
        }

        return b.total - a.total;
      });
  }, [publishers, records]);

  const recordTypeCoverage = useMemo(() => {
    return recordTypes
      .map((recordType) => {
        const typeRecords = records.filter(
          (record) =>
            normalizeValue(record.recordType) === recordType,
        );

        const sourcedRecords = typeRecords.filter(
          (record) => Boolean(record.officialUrl),
        ).length;

        const percentage =
          typeRecords.length === 0
            ? 0
            : Math.round(
                (sourcedRecords / typeRecords.length) *
                  100,
              );

        return {
          recordType,
          total: typeRecords.length,
          sourced: sourcedRecords,
          missing:
            typeRecords.length - sourcedRecords,
          percentage,
        };
      })
      .sort((a, b) => {
        if (a.percentage !== b.percentage) {
          return a.percentage - b.percentage;
        }

        return b.total - a.total;
      });
  }, [recordTypes, records]);

  const filteredRecords = useMemo(() => {
    const normalizedSearch =
      searchTerm.trim().toLowerCase();

    return records.filter((record) => {
      const matchesCoverage =
        coverageFilter === "All Records" ||
        (coverageFilter ===
          "Official Source Present" &&
          Boolean(record.officialUrl)) ||
        (coverageFilter ===
          "Official Source Missing" &&
          !record.officialUrl);

      const matchesRecordType =
        recordTypeFilter === "All Record Types" ||
        normalizeValue(record.recordType) ===
          recordTypeFilter;

      const matchesPublisher =
        publisherFilter === "All Publishers" ||
        normalizeValue(record.publisher) ===
          publisherFilter;

      const searchableText = [
        record.title,
        record.publisher,
        record.recordType,
        record.slug,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        normalizedSearch.length === 0 ||
        searchableText.includes(normalizedSearch);

      return (
        matchesCoverage &&
        matchesRecordType &&
        matchesPublisher &&
        matchesSearch
      );
    });
  }, [
    coverageFilter,
    publisherFilter,
    recordTypeFilter,
    records,
    searchTerm,
  ]);

  const filteredMissingRecords = filteredRecords.filter(
    (record) => !record.officialUrl,
  );

  const resetFilters = () => {
    setCoverageFilter("All Records");
    setRecordTypeFilter("All Record Types");
    setPublisherFilter("All Publishers");
    setSearchTerm("");
  };

  return (
    <main className="coveragePage">
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
            Library integrity and source coverage
          </div>

          <Link
            href="/governance-library/dashboard"
            className="topbarAction"
          >
            Open Library Dashboard →
          </Link>
        </div>

        <header className="hero">
          <div className="heroMark">
            <div className="heroRing ringOne" />
            <div className="heroRing ringTwo" />

            <div className="heroSeal">
              <span>CR</span>
              <small>TA-14</small>
            </div>
          </div>

          <p className="eyebrow">
            TA-14 AI GOVERNANCE LIBRARY
          </p>

          <h1>
            Library Coverage
            <span> and Integrity Report</span>
          </h1>

          <p className="lead">
            Measure the current completeness of the governance
            library, identify records without official source
            references, inspect publisher and record-type coverage,
            and direct remediation before records are relied upon in
            governance interpretation or execution.
          </p>

          <div className="heroMetrics">
            <article>
              <span>{totalRecords}</span>
              <small>Total records</small>
            </article>

            <article>
              <span>{withOfficialSources}</span>
              <small>Official sources present</small>
            </article>

            <article>
              <span>{missingOfficialSources}</span>
              <small>Sources still required</small>
            </article>

            <article>
              <span>{sourceCoveragePercentage}%</span>
              <small>Current source coverage</small>
            </article>
          </div>
        </header>

        <section className="coverageOverview">
          <div className="sectionHeading">
            <div>
              <p className="eyebrow">
                STEP 01 · MEASURE COVERAGE
              </p>

              <h2>
                Determine whether the library can prove its sources.
              </h2>
            </div>

            <p>
              A governance record may be informative, but it should
              not be treated as source-grounded until the controlling
              or official reference is identified and preserved.
            </p>
          </div>

          <div className="coveragePanel">
            <div className="coverageGauge">
              <div
                className="gaugeRing"
                style={{
                  background: `conic-gradient(
                    #70dff1 0deg,
                    #70dff1 ${
                      sourceCoveragePercentage * 3.6
                    }deg,
                    rgba(255, 255, 255, 0.07) ${
                      sourceCoveragePercentage * 3.6
                    }deg,
                    rgba(255, 255, 255, 0.07) 360deg
                  )`,
                }}
              >
                <div className="gaugeCenter">
                  <strong>
                    {sourceCoveragePercentage}%
                  </strong>
                  <span>Official source coverage</span>
                </div>
              </div>
            </div>

            <div className="coverageNarrative">
              <p className="eyebrow">
                CURRENT LIBRARY CONDITION
              </p>

              <h3>
                {missingOfficialSources === 0
                  ? "Every record currently includes an official source."
                  : `${missingOfficialSources} ${
                      missingOfficialSources === 1
                        ? "record requires"
                        : "records require"
                    } source remediation.`}
              </h3>

              <p>
                Records without official references remain visible
                for library maintenance, but their authority,
                version, provenance, and controlling status cannot be
                independently confirmed from the current record.
              </p>

              <div className="coverageControls">
                <article>
                  <span>SOURCE-PRESENT RECORDS</span>
                  <strong>{withOfficialSources}</strong>
                </article>

                <article>
                  <span>SOURCE-MISSING RECORDS</span>
                  <strong>{missingOfficialSources}</strong>
                </article>

                <article>
                  <span>REMEDIATION PRIORITY</span>
                  <strong>
                    {missingOfficialSources === 0
                      ? "No open source gaps"
                      : "Official-source verification"}
                  </strong>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section className="filtersSection">
          <div className="sectionHeading">
            <div>
              <p className="eyebrow">
                STEP 02 · FILTER THE LIBRARY
              </p>

              <h2>
                Isolate the records requiring review.
              </h2>
            </div>

            <p>
              Search by title, publisher, record type, or slug, then
              narrow the report to records with or without official
              source references.
            </p>
          </div>

          <div className="filterPanel">
            <label>
              <span>Coverage Condition</span>

              <select
                value={coverageFilter}
                onChange={(event) =>
                  setCoverageFilter(
                    event.target.value as CoverageFilter,
                  )
                }
              >
                <option>All Records</option>
                <option>Official Source Present</option>
                <option>Official Source Missing</option>
              </select>
            </label>

            <label>
              <span>Record Type</span>

              <select
                value={recordTypeFilter}
                onChange={(event) =>
                  setRecordTypeFilter(event.target.value)
                }
              >
                <option>All Record Types</option>

                {recordTypes.map((recordType) => (
                  <option
                    value={recordType}
                    key={recordType}
                  >
                    {recordType}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span>Publisher</span>

              <select
                value={publisherFilter}
                onChange={(event) =>
                  setPublisherFilter(event.target.value)
                }
              >
                <option>All Publishers</option>

                {publishers.map((publisher) => (
                  <option
                    value={publisher}
                    key={publisher}
                  >
                    {publisher}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span>Search Library</span>

              <input
                type="search"
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
                placeholder="Title, publisher, type..."
              />
            </label>

            <button
              type="button"
              onClick={resetFilters}
              className="resetButton"
            >
              Reset Filters
            </button>
          </div>

          <div className="activeResults">
            <span>{filteredRecords.length}</span>
            <p>
              records match the current coverage and metadata
              filters.
            </p>
          </div>
        </section>

        <section className="attentionSection">
          <div className="sectionHeading">
            <div>
              <p className="eyebrow">
                STEP 03 · REMEDIATE SOURCE GAPS
              </p>

              <h2>
                Records requiring official-source attention.
              </h2>
            </div>

            <p>
              These records do not currently contain an official URL.
              Open each record to review its metadata and add the
              controlling source before relying on it as grounded
              authority.
            </p>
          </div>

          {filteredMissingRecords.length > 0 ? (
            <div className="attentionGrid">
              {filteredMissingRecords.map(
                (
                  record: GovernanceLibraryRecord,
                  index,
                ) => (
                  <article
                    className="attentionCard"
                    key={record.slug}
                  >
                    <div className="cardTop">
                      <span className="recordNumber">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <span className="sourceRequired">
                        Source Required
                      </span>
                    </div>

                    <div className="cardContent">
                      <p>
                        {normalizeValue(record.recordType)}
                      </p>

                      <h3>{record.title}</h3>

                      <div className="recordMetadata">
                        <article>
                          <span>Publisher</span>
                          <strong>
                            {normalizeValue(record.publisher)}
                          </strong>
                        </article>

                        <article>
                          <span>Record Type</span>
                          <strong>
                            {normalizeValue(record.recordType)}
                          </strong>
                        </article>

                        <article>
                          <span>Source Status</span>
                          <strong>Official URL missing</strong>
                        </article>
                      </div>
                    </div>

                    <div className="cardActions">
                      <Link
                        href={`/governance-library/${record.slug}`}
                        className="primaryAction"
                      >
                        Open Record →
                      </Link>

                      <Link
                        href="/governance-library/sources"
                        className="secondaryAction"
                      >
                        Review Source Department
                      </Link>
                    </div>
                  </article>
                ),
              )}
            </div>
          ) : (
            <div className="clearState">
              <div className="clearSeal">
                <span>✓</span>
              </div>

              <p className="eyebrow">
                NO SOURCE GAPS IN CURRENT VIEW
              </p>

              <h3>
                No matching records require official-source
                remediation.
              </h3>

              <p>
                Reset the filters to inspect the complete library or
                select another publisher or record type.
              </p>

              <button
                type="button"
                onClick={resetFilters}
              >
                Review All Records
              </button>
            </div>
          )}
        </section>

        <section className="analysisSection">
          <div className="sectionHeading">
            <div>
              <p className="eyebrow">
                STEP 04 · INSPECT DISTRIBUTION
              </p>

              <h2>
                Coverage by publisher and record type.
              </h2>
            </div>

            <p>
              Distribution analysis reveals concentrated gaps that
              may be hidden by the overall library percentage.
            </p>
          </div>

          <div className="analysisGrid">
            <article className="analysisPanel">
              <div className="panelHeading">
                <div>
                  <span>Publisher analysis</span>
                  <h3>Official-source coverage by publisher</h3>
                </div>

                <small>{publishers.length} publishers</small>
              </div>

              <div className="coverageRows">
                {publisherCoverage.map((item) => (
                  <div
                    className="coverageRow"
                    key={item.publisher}
                  >
                    <div className="coverageRowTop">
                      <div>
                        <strong>{item.publisher}</strong>
                        <span>
                          {item.sourced} of {item.total} sourced
                        </span>
                      </div>

                      <b>{item.percentage}%</b>
                    </div>

                    <div className="progressTrack">
                      <div
                        className="progressFill"
                        style={{
                          width: `${item.percentage}%`,
                        }}
                      />
                    </div>

                    {item.missing > 0 ? (
                      <small>
                        {item.missing}{" "}
                        {item.missing === 1
                          ? "source gap"
                          : "source gaps"}
                      </small>
                    ) : (
                      <small className="complete">
                        Complete official-source coverage
                      </small>
                    )}
                  </div>
                ))}
              </div>
            </article>

            <article className="analysisPanel">
              <div className="panelHeading">
                <div>
                  <span>Record-type analysis</span>
                  <h3>
                    Official-source coverage by record class
                  </h3>
                </div>

                <small>{recordTypes.length} record types</small>
              </div>

              <div className="coverageRows">
                {recordTypeCoverage.map((item) => (
                  <div
                    className="coverageRow"
                    key={item.recordType}
                  >
                    <div className="coverageRowTop">
                      <div>
                        <strong>{item.recordType}</strong>
                        <span>
                          {item.sourced} of {item.total} sourced
                        </span>
                      </div>

                      <b>{item.percentage}%</b>
                    </div>

                    <div className="progressTrack">
                      <div
                        className="progressFill"
                        style={{
                          width: `${item.percentage}%`,
                        }}
                      />
                    </div>

                    {item.missing > 0 ? (
                      <small>
                        {item.missing}{" "}
                        {item.missing === 1
                          ? "source gap"
                          : "source gaps"}
                      </small>
                    ) : (
                      <small className="complete">
                        Complete official-source coverage
                      </small>
                    )}
                  </div>
                ))}
              </div>
            </article>
          </div>
        </section>

        <section className="recordInventorySection">
          <div className="sectionHeading">
            <div>
              <p className="eyebrow">
                COMPLETE FILTERED INVENTORY
              </p>

              <h2>
                Inspect every record in the current view.
              </h2>
            </div>

            <p>
              The inventory preserves the distinction between a
              record that exists and a record whose official source
              has been documented.
            </p>
          </div>

          <div className="inventoryPanel">
            <div className="tableScroll">
              <table>
                <thead>
                  <tr>
                    <th>Record</th>
                    <th>Publisher</th>
                    <th>Record Type</th>
                    <th>Source Condition</th>
                    <th>Record Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredRecords.map((record, index) => {
                    const status =
                      getCoverageStatus(record);

                    return (
                      <tr key={record.slug}>
                        <td>
                          <div className="recordIdentity">
                            <span>
                              {String(index + 1).padStart(
                                2,
                                "0",
                              )}
                            </span>

                            <div>
                              <strong>{record.title}</strong>
                              <small>{record.slug}</small>
                            </div>
                          </div>
                        </td>

                        <td>
                          {normalizeValue(record.publisher)}
                        </td>

                        <td>
                          {normalizeValue(record.recordType)}
                        </td>

                        <td>
                          <span
                            className={`statusBadge ${
                              record.officialUrl
                                ? "sourceVerified"
                                : "sourceMissing"
                            }`}
                          >
                            {status}
                          </span>
                        </td>

                        <td>
                          <Link
                            href={`/governance-library/${record.slug}`}
                            className="tableAction"
                          >
                            Open Record →
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filteredRecords.length === 0 ? (
              <div className="emptyInventory">
                <span>No matching records</span>

                <h3>
                  The current filters returned no library records.
                </h3>

                <button
                  type="button"
                  onClick={resetFilters}
                >
                  Reset Filters
                </button>
              </div>
            ) : null}
          </div>
        </section>

        <section className="boundarySection">
          <div className="boundarySeal">
            <span>CB</span>
            <small>Coverage boundary</small>
          </div>

          <p className="eyebrow gold">
            LIBRARY COVERAGE BOUNDARY
          </p>

          <h2>
            Presence in the library does not prove controlling
            authority.
          </h2>

          <p>
            A complete library record should preserve the official
            source, publisher, record classification, identity, and
            access path necessary for independent review. Even then,
            the record does not prove current applicability,
            conformity, legal interpretation, or satisfaction of an
            execution requirement.
          </p>

          <div className="boundaryGrid">
            <article>
              <span>COVERAGE REPORT PROVES</span>
              <strong>
                Which records currently contain an official source
                reference
              </strong>
            </article>

            <article>
              <span>COVERAGE REPORT DOES NOT PROVE</span>
              <strong>
                Applicability, compliance, conformity, or source
                currency
              </strong>
            </article>

            <article>
              <span>REQUIRED NEXT CONTROL</span>
              <strong>
                Source verification, interpretation, and authorized
                determination
              </strong>
            </article>
          </div>

          <div className="boundaryActions">
            <Link
              href="/governance-library/sources"
              className="secondaryAction"
            >
              Review Source Records
            </Link>

            <Link
              href="/governance-library/applicability"
              className="secondaryAction"
            >
              Run Applicability Engine
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
        .coveragePage {
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
        .secondaryAction,
        .tableAction {
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
        .secondaryAction:hover,
        .tableAction:hover {
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
          max-width: 1100px;
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
          max-width: 920px;
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

        .coverageOverview,
        .filtersSection,
        .attentionSection,
        .analysisSection,
        .recordInventorySection {
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

        .coveragePanel {
          padding: 32px;
          display: grid;
          grid-template-columns: 330px 1fr;
          align-items: center;
          gap: 38px;
          border: 1px solid rgba(99, 230, 255, 0.14);
          border-radius: 28px;
          background:
            radial-gradient(
              circle at 0 0,
              rgba(99, 230, 255, 0.07),
              transparent 29%
            ),
            linear-gradient(
              145deg,
              rgba(10, 31, 47, 0.94),
              rgba(4, 14, 24, 0.98)
            );
          box-shadow: 0 26px 66px rgba(0, 0, 0, 0.28);
        }

        .coverageGauge {
          display: grid;
          place-items: center;
        }

        .gaugeRing {
          width: 244px;
          height: 244px;
          padding: 15px;
          border-radius: 50%;
          box-shadow: 0 0 60px rgba(99, 230, 255, 0.09);
        }

        .gaugeCenter {
          width: 100%;
          height: 100%;
          display: grid;
          place-items: center;
          align-content: center;
          gap: 8px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 50%;
          background:
            radial-gradient(
              circle at 50% 35%,
              rgba(99, 230, 255, 0.08),
              transparent 40%
            ),
            #061522;
          text-align: center;
        }

        .gaugeCenter strong {
          color: #e8fbff;
          font: 700 55px Georgia, serif;
          line-height: 1;
        }

        .gaugeCenter span {
          max-width: 120px;
          color: #7e9aa6;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.1em;
          line-height: 1.5;
          text-transform: uppercase;
        }

        .coverageNarrative h3 {
          margin: 12px 0 0;
          font-size: clamp(31px, 3vw, 48px);
          line-height: 1.05;
        }

        .coverageNarrative > p:not(.eyebrow) {
          max-width: 810px;
          margin: 19px 0 0;
          color: #9fb2bb;
          font-size: 15px;
          line-height: 1.75;
        }

        .coverageControls {
          margin-top: 26px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .coverageControls article {
          padding: 17px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 14px;
          background: rgba(0, 0, 0, 0.17);
        }

        .coverageControls span {
          display: block;
          color: #718995;
          font-size: 7px;
          font-weight: 900;
          letter-spacing: 0.09em;
        }

        .coverageControls strong {
          display: block;
          margin-top: 8px;
          color: #d7e7eb;
          font-size: 12px;
          line-height: 1.4;
        }

        .filterPanel {
          padding: 25px;
          display: grid;
          grid-template-columns:
            minmax(0, 1fr)
            minmax(0, 1fr)
            minmax(0, 1fr)
            minmax(0, 1.1fr)
            auto;
          gap: 15px;
          align-items: end;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 23px;
          background: rgba(6, 20, 32, 0.72);
        }

        .filterPanel label {
          display: flex;
          flex-direction: column;
          gap: 9px;
        }

        .filterPanel label span {
          color: #9db1bb;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .filterPanel select,
        .filterPanel input {
          width: 100%;
          min-height: 52px;
          padding: 0 13px;
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 12px;
          outline: none;
          color: #edf8fb;
          background: #071421;
          font: inherit;
          font-size: 13px;
        }

        .filterPanel input::placeholder {
          color: #5f7682;
        }

        .filterPanel select:focus,
        .filterPanel input:focus {
          border-color: rgba(99, 230, 255, 0.55);
          box-shadow: 0 0 0 3px rgba(99, 230, 255, 0.08);
        }

        .resetButton,
        .clearState button,
        .emptyInventory button {
          min-height: 52px;
          padding: 0 16px;
          border: 1px solid rgba(255, 255, 255, 0.11);
          border-radius: 11px;
          color: #cadbe1;
          background: rgba(0, 0, 0, 0.18);
          cursor: pointer;
          font: inherit;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.07em;
          text-transform: uppercase;
        }

        .activeResults {
          margin-top: 15px;
          padding: 15px 18px;
          display: flex;
          align-items: center;
          gap: 10px;
          border: 1px solid rgba(99, 230, 255, 0.09);
          border-radius: 13px;
          background: rgba(99, 230, 255, 0.03);
        }

        .activeResults span {
          color: #75e0f2;
          font: 700 24px Georgia, serif;
        }

        .activeResults p {
          margin: 0;
          color: #839ba6;
          font-size: 12px;
        }

        .attentionGrid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
        }

        .attentionCard {
          min-height: 100%;
          padding: 23px;
          display: flex;
          flex-direction: column;
          border: 1px solid rgba(255, 197, 82, 0.15);
          border-radius: 22px;
          background:
            radial-gradient(
              circle at 100% 0,
              rgba(255, 197, 82, 0.06),
              transparent 30%
            ),
            linear-gradient(
              145deg,
              rgba(11, 28, 42, 0.94),
              rgba(4, 14, 24, 0.98)
            );
          box-shadow: 0 22px 54px rgba(0, 0, 0, 0.25);
        }

        .cardTop {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
        }

        .recordNumber {
          width: 45px;
          height: 45px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(99, 230, 255, 0.22);
          border-radius: 12px;
          color: #72e2f4;
          background: rgba(0, 0, 0, 0.18);
          font-size: 10px;
          font-weight: 900;
        }

        .sourceRequired {
          padding: 8px 10px;
          border: 1px solid rgba(255, 197, 82, 0.28);
          border-radius: 999px;
          color: #ffd27c;
          background: rgba(255, 197, 82, 0.07);
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .cardContent {
          flex: 1;
          padding-top: 23px;
        }

        .cardContent > p {
          margin: 0;
          color: #6fd6e7;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.11em;
          text-transform: uppercase;
        }

        .cardContent h3 {
          margin: 9px 0 0;
          font-size: 26px;
          line-height: 1.06;
        }

        .recordMetadata {
          margin-top: 22px;
          display: grid;
          gap: 9px;
        }

        .recordMetadata article {
          padding: 12px;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 11px;
          background: rgba(0, 0, 0, 0.15);
        }

        .recordMetadata span {
          display: block;
          color: #6e8490;
          font-size: 7px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .recordMetadata strong {
          display: block;
          margin-top: 6px;
          color: #c8d8de;
          font-size: 11px;
          line-height: 1.4;
        }

        .cardActions {
          margin-top: 22px;
          padding-top: 20px;
          display: flex;
          flex-wrap: wrap;
          gap: 9px;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
        }

        .cardActions .primaryAction,
        .cardActions .secondaryAction {
          flex: 1;
          justify-self: auto;
        }

        .clearState {
          padding: 60px 30px;
          border: 1px dashed rgba(99, 230, 255, 0.2);
          border-radius: 24px;
          background: rgba(5, 18, 29, 0.58);
          text-align: center;
        }

        .clearSeal {
          width: 70px;
          height: 70px;
          margin: 0 auto 20px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(114, 230, 178, 0.28);
          border-radius: 50%;
          color: #8ef2c5;
          background: rgba(114, 230, 178, 0.06);
          font-size: 25px;
        }

        .clearState h3,
        .emptyInventory h3 {
          margin: 12px 0 0;
          font-size: 31px;
        }

        .clearState > p:not(.eyebrow) {
          margin: 13px auto 0;
          color: #899fa9;
        }

        .clearState button,
        .emptyInventory button {
          margin-top: 20px;
        }

        .analysisGrid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
        }

        .analysisPanel {
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

        .coverageRows {
          margin-top: 18px;
          display: grid;
          gap: 14px;
        }

        .coverageRow {
          padding: 15px;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 13px;
          background: rgba(0, 0, 0, 0.15);
        }

        .coverageRowTop {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
        }

        .coverageRowTop strong {
          display: block;
          color: #d9e7eb;
          font-size: 12px;
        }

        .coverageRowTop span {
          display: block;
          margin-top: 5px;
          color: #758d98;
          font-size: 9px;
        }

        .coverageRowTop b {
          color: #edca80;
          font: 700 18px Georgia, serif;
        }

        .progressTrack {
          height: 6px;
          margin-top: 12px;
          overflow: hidden;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.07);
        }

        .progressFill {
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(
            90deg,
            #3eb2ca,
            #7de6f3
          );
        }

        .coverageRow > small {
          display: block;
          margin-top: 9px;
          color: #d8ad5b;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .coverageRow > small.complete {
          color: #75dcae;
        }

        .inventoryPanel {
          overflow: hidden;
          border: 1px solid rgba(99, 230, 255, 0.12);
          border-radius: 23px;
          background: linear-gradient(
            145deg,
            rgba(9, 28, 43, 0.96),
            rgba(3, 12, 21, 0.99)
          );
          box-shadow: 0 28px 70px rgba(0, 0, 0, 0.31);
        }

        .tableScroll {
          overflow-x: auto;
        }

        table {
          width: 100%;
          min-width: 1000px;
          border-collapse: collapse;
        }

        th {
          padding: 17px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          color: #83dcea;
          background: rgba(255, 255, 255, 0.035);
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-align: left;
          text-transform: uppercase;
        }

        td {
          padding: 18px 17px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          color: #a9bbc3;
          font-size: 12px;
          vertical-align: middle;
        }

        tbody tr:last-child td {
          border-bottom: 0;
        }

        tbody tr:hover {
          background: rgba(99, 230, 255, 0.025);
        }

        .recordIdentity {
          min-width: 310px;
          display: flex;
          align-items: center;
          gap: 13px;
        }

        .recordIdentity > span {
          width: 40px;
          height: 40px;
          flex: 0 0 40px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(99, 230, 255, 0.2);
          border-radius: 11px;
          color: #70dff1;
          background: rgba(0, 0, 0, 0.18);
          font-size: 9px;
          font-weight: 900;
        }

        .recordIdentity strong {
          display: block;
          color: #e1ecef;
          font-size: 13px;
        }

        .recordIdentity small {
          display: block;
          margin-top: 5px;
          color: #647b87;
          font-size: 9px;
        }

        .statusBadge {
          display: inline-flex;
          min-width: 112px;
          padding: 8px 10px;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 999px;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.07em;
          text-transform: uppercase;
        }

        .sourceVerified {
          color: #8ff4c6;
          border-color: rgba(114, 230, 178, 0.3);
          background: rgba(114, 230, 178, 0.08);
        }

        .sourceMissing {
          color: #ffd580;
          border-color: rgba(255, 197, 82, 0.3);
          background: rgba(255, 197, 82, 0.08);
        }

        .tableAction {
          min-height: 36px;
          color: #061920;
          border: 1px solid #9cecf8;
          background: linear-gradient(
            135deg,
            #d8faff,
            #69d6e8
          );
        }

        .emptyInventory {
          padding: 56px 30px;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          text-align: center;
        }

        .emptyInventory > span {
          color: #6edff2;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
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
          .filterPanel {
            grid-template-columns: repeat(
              2,
              minmax(0, 1fr)
            );
          }

          .resetButton {
            width: 100%;
          }

          .attentionGrid {
            grid-template-columns: repeat(
              2,
              minmax(0, 1fr)
            );
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
          .coveragePanel {
            grid-template-columns: 1fr;
          }

          .coverageGauge {
            justify-content: start;
          }

          .heroMetrics,
          .coverageControls,
          .boundaryGrid {
            grid-template-columns: repeat(2, 1fr);
          }

          .analysisGrid {
            grid-template-columns: 1fr;
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
          .coverageControls,
          .filterPanel,
          .attentionGrid,
          .boundaryGrid {
            grid-template-columns: 1fr;
          }

          .coveragePanel,
          .analysisPanel,
          .boundarySection {
            padding: 22px;
          }

          .coverageGauge {
            justify-content: center;
          }

          .gaugeRing {
            width: 215px;
            height: 215px;
          }

          .boundaryActions,
          .cardActions {
            flex-direction: column;
            align-items: stretch;
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
