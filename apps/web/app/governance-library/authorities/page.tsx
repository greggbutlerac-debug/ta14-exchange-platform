"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  governanceLibraryRecords,
} from "../../../lib/governance-library";
import type {
  GovernanceLibraryRecord,
} from "../../../lib/governance-library/records-foundational";

type AuthorityRecord = {
  name: string;
  records: GovernanceLibraryRecord[];
  jurisdictions: string[];
  recordTypes: string[];
};

function getAuthority(record: GovernanceLibraryRecord) {
  return (
    ((record as GovernanceLibraryRecord & { authority?: string })
      .authority ?? record.publisher) ||
    "Unspecified authority"
  );
}

function normalize(value: string | undefined) {
  return value?.trim() || "Unspecified";
}

export default function GovernanceLibraryAuthorityIndexPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [jurisdictionFilter, setJurisdictionFilter] =
    useState("All jurisdictions");
  const [recordTypeFilter, setRecordTypeFilter] =
    useState("All record types");
  const [expandedAuthority, setExpandedAuthority] =
    useState<string | null>(null);

  const authorities = useMemo<AuthorityRecord[]>(() => {
    const authorityMap = new Map<
      string,
      GovernanceLibraryRecord[]
    >();

    governanceLibraryRecords.forEach(
      (record: GovernanceLibraryRecord) => {
        const authority = getAuthority(record);
        const existing = authorityMap.get(authority) ?? [];

        existing.push(record);
        authorityMap.set(authority, existing);
      },
    );

    return Array.from(authorityMap.entries())
      .map(([name, records]) => ({
        name,
        records: [...records].sort((a, b) =>
          a.title.localeCompare(b.title),
        ),
        jurisdictions: Array.from(
          new Set(
            records.map((record) =>
              normalize(record.jurisdiction),
            ),
          ),
        ).sort(),
        recordTypes: Array.from(
          new Set(
            records.map((record) =>
              normalize(record.recordType),
            ),
          ),
        ).sort(),
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  const jurisdictions = useMemo(
    () => [
      "All jurisdictions",
      ...Array.from(
        new Set(
          governanceLibraryRecords.map(
            (record: GovernanceLibraryRecord) =>
              normalize(record.jurisdiction),
          ),
        ),
      ).sort(),
    ],
    [],
  );

  const recordTypes = useMemo(
    () => [
      "All record types",
      ...Array.from(
        new Set(
          governanceLibraryRecords.map(
            (record: GovernanceLibraryRecord) =>
              normalize(record.recordType),
          ),
        ),
      ).sort(),
    ],
    [],
  );

  const visibleAuthorities = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return authorities
      .map((authority) => {
        const filteredRecords = authority.records.filter(
          (record) => {
            const matchesJurisdiction =
              jurisdictionFilter === "All jurisdictions" ||
              normalize(record.jurisdiction) ===
                jurisdictionFilter;

            const matchesRecordType =
              recordTypeFilter === "All record types" ||
              normalize(record.recordType) === recordTypeFilter;

            const matchesQuery =
              query.length === 0 ||
              [
                authority.name,
                record.title,
                record.recordType,
                record.jurisdiction,
                record.publisher,
                record.summary,
              ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase()
                .includes(query);

            return (
              matchesJurisdiction &&
              matchesRecordType &&
              matchesQuery
            );
          },
        );

        return {
          ...authority,
          records: filteredRecords,
        };
      })
      .filter((authority) => authority.records.length > 0);
  }, [
    authorities,
    jurisdictionFilter,
    recordTypeFilter,
    searchQuery,
  ]);

  const totalAuthorities = authorities.length;
  const totalRecords = governanceLibraryRecords.length;
  const visibleRecordCount = visibleAuthorities.reduce(
    (total, authority) => total + authority.records.length,
    0,
  );

  const largestAuthority = useMemo(() => {
    return [...authorities].sort(
      (a, b) => b.records.length - a.records.length,
    )[0];
  }, [authorities]);

  function clearFilters() {
    setSearchQuery("");
    setJurisdictionFilter("All jurisdictions");
    setRecordTypeFilter("All record types");
  }

  return (
    <main className="authorityPage">
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
            Authority index active
          </div>

          <Link
            href="/governance-library/publishers"
            className="topbarAction"
          >
            View Publishers →
          </Link>
        </div>

        <header className="hero">
          <div className="heroSeal">
            <span>GA</span>
            <small>Authority index</small>
          </div>

          <p className="eyebrow">
            TA-14 AI GOVERNANCE LIBRARY
          </p>

          <h1>
            Governing
            <span> Authorities</span>
          </h1>

          <p className="lead">
            Browse the institutions, public bodies, standards
            organizations, regulators, publishers, and governance
            stewards responsible for issuing, maintaining, or
            overseeing the records represented in the library.
          </p>

          <div className="heroMetrics">
            <article>
              <span>{totalAuthorities}</span>
              <small>Authorities indexed</small>
            </article>

            <article>
              <span>{totalRecords}</span>
              <small>Governance records</small>
            </article>

            <article>
              <span>{jurisdictions.length - 1}</span>
              <small>Jurisdictions</small>
            </article>

            <article>
              <span>{recordTypes.length - 1}</span>
              <small>Record types</small>
            </article>

            <article>
              <span>{largestAuthority?.records.length ?? 0}</span>
              <small>Largest authority set</small>
            </article>
          </div>
        </header>

        <section className="controlSection">
          <div className="sectionHeading">
            <div>
              <p className="eyebrow">
                AUTHORITY CONTROL DESK
              </p>

              <h2>
                Find the source of governance authority.
              </h2>
            </div>

            <p>
              Authority is not interchangeable with popularity,
              publication volume, or market recognition. Every record
              should remain attributable to the body that issued,
              adopted, maintained, interpreted, or enforced it.
            </p>
          </div>

          <div className="filterPanel">
            <label>
              Search authority or record
              <input
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(event.target.value)
                }
                placeholder="Search authority, title, publisher, jurisdiction, or record type"
              />
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
              Record type
              <select
                value={recordTypeFilter}
                onChange={(event) =>
                  setRecordTypeFilter(event.target.value)
                }
              >
                {recordTypes.map((recordType) => (
                  <option key={recordType} value={recordType}>
                    {recordType}
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
              <span>{visibleAuthorities.length}</span>
              <small>Authorities shown</small>
            </div>

            <div>
              <span>{visibleRecordCount}</span>
              <small>Records shown</small>
            </div>

            <p>
              Results are derived from the current governance library
              record set.
            </p>
          </div>
        </section>

        <section className="authoritySection">
          {visibleAuthorities.length > 0 ? (
            <div className="authorityGrid">
              {visibleAuthorities.map((authority, index) => {
                const isExpanded =
                  expandedAuthority === authority.name;

                const recordsToShow = isExpanded
                  ? authority.records
                  : authority.records.slice(0, 4);

                return (
                  <article
                    key={authority.name}
                    className="authorityCard"
                  >
                    <div className="authorityHeader">
                      <div className="authorityIdentity">
                        <div className="authorityIndex">
                          {String(index + 1).padStart(2, "0")}
                        </div>

                        <div>
                          <p>Governing authority</p>
                          <h3>{authority.name}</h3>
                        </div>
                      </div>

                      <div className="recordCount">
                        <strong>{authority.records.length}</strong>
                        <small>
                          {authority.records.length === 1
                            ? "record"
                            : "records"}
                        </small>
                      </div>
                    </div>

                    <div className="authorityMetadata">
                      <div>
                        <span>Jurisdictions</span>
                        <p>
                          {authority.jurisdictions.join(" · ")}
                        </p>
                      </div>

                      <div>
                        <span>Record types</span>
                        <p>{authority.recordTypes.join(" · ")}</p>
                      </div>
                    </div>

                    <div className="recordList">
                      {recordsToShow.map((record) => (
                        <Link
                          key={record.slug}
                          href={`/governance-library/${record.slug}`}
                          className="recordCard"
                        >
                          <div className="recordTopline">
                            <span>
                              {normalize(record.recordType)}
                            </span>

                            <small>
                              {normalize(record.jurisdiction)}
                            </small>
                          </div>

                          <strong>{record.title}</strong>

                          {record.summary ? (
                            <p>{record.summary}</p>
                          ) : (
                            <p>
                              Open the complete governance library
                              record.
                            </p>
                          )}

                          <div className="recordFooter">
                            <span>
                              {record.publisher ||
                                getAuthority(record)}
                            </span>

                            <b>Open record →</b>
                          </div>
                        </Link>
                      ))}
                    </div>

                    {authority.records.length > 4 ? (
                      <button
                        type="button"
                        className="expandButton"
                        onClick={() =>
                          setExpandedAuthority(
                            isExpanded ? null : authority.name,
                          )
                        }
                      >
                        {isExpanded
                          ? "Show fewer records"
                          : `Show all ${authority.records.length} records`}
                      </button>
                    ) : null}
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="emptyState">
              <div className="emptySeal">0</div>

              <h3>No authorities match the current filters.</h3>

              <p>
                Clear the filters or search using a broader authority,
                jurisdiction, publisher, or record term.
              </p>

              <button type="button" onClick={clearFilters}>
                Reset authority search
              </button>
            </div>
          )}
        </section>

        <section className="authorityBoundary">
          <div className="boundarySeal">
            <span>AB</span>
            <small>Authority boundary</small>
          </div>

          <p className="eyebrow gold">
            GOVERNANCE AUTHORITY BOUNDARY
          </p>

          <h2>
            Issuance does not automatically establish applicability.
          </h2>

          <p>
            A governance authority may issue, maintain, interpret, or
            enforce a law, regulation, standard, framework, guidance
            document, or governance instrument. Whether that record
            applies to a specific entity, system, action, sector, or
            jurisdiction requires a separate applicability
            determination supported by evidence and competent review.
          </p>

          <div className="boundaryGrid">
            <article>
              <span>AUTHORITY ESTABLISHES</span>
              <strong>
                Who issued, adopted, maintains, interprets, or
                enforces the governance record
              </strong>
            </article>

            <article>
              <span>APPLICABILITY ESTABLISHES</span>
              <strong>
                Whether the record governs the identified entity,
                system, activity, jurisdiction, or lifecycle stage
              </strong>
            </article>

            <article>
              <span>EXECUTION REQUIRES</span>
              <strong>
                Applicable authority, admissible evidence, binding,
                runtime control, and preserved outcome evidence
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
              href="/governance-library/publisher-matrix"
              className="secondaryAction"
            >
              Open Publisher Matrix
            </Link>

            <Link
              href="/governance-library/relationships"
              className="primaryAction"
            >
              Explore Relationships →
            </Link>
          </div>
        </section>
      </div>

      <style jsx>{`
        .authorityPage {
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
          max-width: 940px;
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
        .authorityBoundary h2 {
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
            minmax(260px, 1.5fr)
            minmax(180px, 0.75fr)
            minmax(180px, 0.75fr)
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
          transition:
            border-color 0.2s,
            box-shadow 0.2s;
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

        .resultBar div {
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

        .resultBar p {
          margin: 0 0 0 auto;
          color: #718893;
          font-size: 10px;
        }

        .authoritySection {
          padding-top: 25px;
        }

        .authorityGrid {
          display: grid;
          gap: 18px;
        }

        .authorityCard {
          padding: 25px;
          border: 1px solid rgba(99, 230, 255, 0.12);
          border-radius: 24px;
          background:
            radial-gradient(
              circle at 0 0,
              rgba(99, 230, 255, 0.05),
              transparent 26%
            ),
            linear-gradient(
              145deg,
              rgba(9, 29, 44, 0.95),
              rgba(3, 13, 22, 0.98)
            );
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.27);
        }

        .authorityHeader {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
        }

        .authorityIdentity {
          min-width: 0;
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .authorityIndex {
          width: 58px;
          height: 58px;
          flex: 0 0 58px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(255, 198, 82, 0.25);
          border-radius: 50%;
          color: #efc66f;
          background: rgba(255, 198, 82, 0.04);
          font: 700 15px Georgia, serif;
        }

        .authorityIdentity p {
          margin: 0;
          color: #69dcef;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .authorityIdentity h3 {
          margin: 7px 0 0;
          color: #edf5f7;
          font-size: clamp(24px, 3vw, 38px);
          line-height: 1.05;
        }

        .recordCount {
          min-width: 82px;
          padding: 11px 13px;
          display: grid;
          justify-items: center;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 13px;
          background: rgba(0, 0, 0, 0.17);
        }

        .recordCount strong {
          color: #efcd85;
          font: 700 25px Georgia, serif;
        }

        .recordCount small {
          margin-top: 2px;
          color: #718893;
          font-size: 7px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .authorityMetadata {
          margin-top: 19px;
          padding: 15px;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 13px;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 14px;
          background: rgba(0, 0, 0, 0.14);
        }

        .authorityMetadata span {
          color: #7396a3;
          font-size: 7px;
          font-weight: 900;
          letter-spacing: 0.09em;
          text-transform: uppercase;
        }

        .authorityMetadata p {
          margin: 6px 0 0;
          color: #b8c8cf;
          font-size: 10px;
          line-height: 1.5;
        }

        .recordList {
          margin-top: 17px;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }

        .recordCard {
          min-width: 0;
          padding: 18px;
          display: flex;
          flex-direction: column;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 16px;
          color: inherit;
          background: rgba(0, 0, 0, 0.16);
          text-decoration: none;
          transition:
            transform 0.22s,
            border-color 0.22s,
            background 0.22s;
        }

        .recordCard:hover {
          transform: translateY(-3px);
          border-color: rgba(99, 230, 255, 0.27);
          background: rgba(99, 230, 255, 0.04);
        }

        .recordTopline {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .recordTopline span {
          color: #72ddeb;
          font-size: 7px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .recordTopline small {
          color: #718893;
          font-size: 8px;
        }

        .recordCard > strong {
          margin-top: 12px;
          color: #e2edf0;
          font: 700 18px/1.25 Georgia, serif;
        }

        .recordCard > p {
          margin: 10px 0 0;
          color: #879da7;
          font-size: 11px;
          line-height: 1.58;
        }

        .recordFooter {
          margin-top: auto;
          padding-top: 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
        }

        .recordFooter span {
          overflow: hidden;
          color: #6f8792;
          font-size: 8px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .recordFooter b {
          flex: 0 0 auto;
          color: #e8c77f;
          font-size: 8px;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .expandButton {
          width: 100%;
          min-height: 44px;
          margin-top: 13px;
          border: 1px solid rgba(99, 230, 255, 0.12);
          border-radius: 12px;
          color: #a9c7d1;
          background: rgba(99, 230, 255, 0.03);
          cursor: pointer;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .emptyState {
          padding: 70px 25px;
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

        .emptyState h3 {
          margin: 20px 0 0;
          font-size: 29px;
        }

        .emptyState p {
          max-width: 600px;
          margin: 13px auto 0;
          color: #849aa5;
          font-size: 12px;
          line-height: 1.65;
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

        .authorityBoundary {
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

        .authorityBoundary h2 {
          max-width: 1040px;
          margin: 14px auto 0;
        }

        .authorityBoundary > p:not(.eyebrow) {
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

        @media (max-width: 1180px) {
          .heroMetrics {
            grid-template-columns: repeat(
              3,
              minmax(0, 1fr)
            );
          }

          .filterPanel {
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

          .recordList {
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
          .filterPanel,
          .heroMetrics,
          .authorityMetadata {
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

          .resultBar,
          .authorityHeader {
            align-items: flex-start;
            flex-direction: column;
          }

          .resultBar p {
            margin-left: 0;
          }

          .authorityCard,
          .authorityBoundary {
            padding: 21px;
          }

          .authorityIdentity {
            align-items: flex-start;
          }

          .recordCount {
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
