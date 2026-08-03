"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { governanceLibraryRecords } from "../../../lib/governance-library";
import type { GovernanceLibraryRecord } from "../../../lib/governance-library/records-foundational";

type SortDirection = "newest" | "oldest";
type YearStatus = "Current" | "Historical" | "Future" | "Unknown";

type NormalizedRecord = {
  slug: string;
  title: string;
  publisher: string;
  recordType: string;
  year: string;
  numericYear: number | null;
  status: YearStatus;
  summary: string;
  jurisdiction: string;
  domain: string;
};

type YearGroup = {
  year: string;
  numericYear: number | null;
  records: NormalizedRecord[];
};

const CURRENT_YEAR = new Date().getFullYear();

function readString(
  record: GovernanceLibraryRecord,
  keys: string[],
  fallback: string,
): string {
  const candidate = record as unknown as Record<string, unknown>;

  for (const key of keys) {
    const value = candidate[key];

    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim();
    }

    if (typeof value === "number" && Number.isFinite(value)) {
      return String(value);
    }
  }

  return fallback;
}

function normalizeYear(value: string): {
  year: string;
  numericYear: number | null;
} {
  const match = value.match(/\b(18|19|20|21)\d{2}\b/);

  if (!match) {
    return {
      year: "Unknown",
      numericYear: null,
    };
  }

  return {
    year: match[0],
    numericYear: Number(match[0]),
  };
}

function resolveYearStatus(numericYear: number | null): YearStatus {
  if (numericYear === null) {
    return "Unknown";
  }

  if (numericYear > CURRENT_YEAR) {
    return "Future";
  }

  if (numericYear < CURRENT_YEAR - 5) {
    return "Historical";
  }

  return "Current";
}

function normalizeRecord(record: GovernanceLibraryRecord): NormalizedRecord {
  const rawYear = readString(
    record,
    [
      "publicationYear",
      "year",
      "publishedYear",
      "date",
      "publicationDate",
      "effectiveDate",
    ],
    "Unknown",
  );
  const normalizedYear = normalizeYear(rawYear);

  return {
    slug: readString(record, ["slug"], "unknown-record"),
    title: readString(record, ["title", "name"], "Untitled governance record"),
    publisher: readString(
      record,
      ["publisher", "organization", "authority", "issuer"],
      "Publisher unresolved",
    ),
    recordType: readString(
      record,
      ["recordType", "type", "instrumentType"],
      "Governance record",
    ),
    year: normalizedYear.year,
    numericYear: normalizedYear.numericYear,
    status: resolveYearStatus(normalizedYear.numericYear),
    summary: readString(
      record,
      ["summary", "description", "purpose"],
      "Open the governed record to inspect its scope, authority, version, evidence, and applicability boundaries.",
    ),
    jurisdiction: readString(
      record,
      ["jurisdiction", "region", "country"],
      "Jurisdiction unresolved",
    ),
    domain: readString(
      record,
      ["domain", "category", "topic"],
      "Institutional governance",
    ),
  };
}

function statusClass(status: YearStatus): string {
  return status.toLowerCase();
}

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

export default function GovernanceLibraryYearIndexPage() {
  const normalizedRecords = useMemo(
    () => governanceLibraryRecords.map(normalizeRecord),
    [],
  );

  const [query, setQuery] = useState("");
  const [recordType, setRecordType] = useState("All record types");
  const [publisher, setPublisher] = useState("All publishers");
  const [sortDirection, setSortDirection] = useState<SortDirection>("newest");
  const [selectedYear, setSelectedYear] = useState("All years");
  const [expandedYears, setExpandedYears] = useState<string[]>([]);

  const recordTypes = useMemo(
    () => [
      "All record types",
      ...Array.from(new Set(normalizedRecords.map((record) => record.recordType))).sort(),
    ],
    [normalizedRecords],
  );

  const publishers = useMemo(
    () => [
      "All publishers",
      ...Array.from(new Set(normalizedRecords.map((record) => record.publisher))).sort(),
    ],
    [normalizedRecords],
  );

  const yearOptions = useMemo(
    () => [
      "All years",
      ...Array.from(new Set(normalizedRecords.map((record) => record.year))).sort(
        (a, b) => {
          if (a === "Unknown") {
            return 1;
          }

          if (b === "Unknown") {
            return -1;
          }

          return Number(b) - Number(a);
        },
      ),
    ],
    [normalizedRecords],
  );

  const filteredRecords = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return normalizedRecords.filter((record) => {
      const queryMatches =
        normalizedQuery.length === 0 ||
        [
          record.title,
          record.publisher,
          record.recordType,
          record.year,
          record.summary,
          record.jurisdiction,
          record.domain,
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);

      const typeMatches =
        recordType === "All record types" || record.recordType === recordType;
      const publisherMatches =
        publisher === "All publishers" || record.publisher === publisher;
      const yearMatches = selectedYear === "All years" || record.year === selectedYear;

      return queryMatches && typeMatches && publisherMatches && yearMatches;
    });
  }, [normalizedRecords, publisher, query, recordType, selectedYear]);

  const yearGroups = useMemo<YearGroup[]>(() => {
    const groups = new Map<string, NormalizedRecord[]>();

    filteredRecords.forEach((record) => {
      const existing = groups.get(record.year) ?? [];
      existing.push(record);
      groups.set(record.year, existing);
    });

    return Array.from(groups.entries())
      .map(([year, records]) => ({
        year,
        numericYear: year === "Unknown" ? null : Number(year),
        records: records.sort((a, b) => a.title.localeCompare(b.title)),
      }))
      .sort((a, b) => {
        if (a.numericYear === null) {
          return 1;
        }

        if (b.numericYear === null) {
          return -1;
        }

        return sortDirection === "newest"
          ? b.numericYear - a.numericYear
          : a.numericYear - b.numericYear;
      });
  }, [filteredRecords, sortDirection]);

  const metrics = useMemo(() => {
    const knownYears = normalizedRecords
      .map((record) => record.numericYear)
      .filter((year): year is number => year !== null);

    return {
      records: normalizedRecords.length,
      years: new Set(knownYears).size,
      earliest: knownYears.length > 0 ? Math.min(...knownYears) : null,
      latest: knownYears.length > 0 ? Math.max(...knownYears) : null,
      publishers: new Set(normalizedRecords.map((record) => record.publisher)).size,
      unresolved: normalizedRecords.filter((record) => record.numericYear === null).length,
    };
  }, [normalizedRecords]);

  function toggleYear(year: string) {
    setExpandedYears((current) =>
      current.includes(year)
        ? current.filter((item) => item !== year)
        : [...current, year],
    );
  }

  function clearFilters() {
    setQuery("");
    setRecordType("All record types");
    setPublisher("All publishers");
    setSelectedYear("All years");
    setSortDirection("newest");
  }

  return (
    <main className="yearPage">
      <div className="background" aria-hidden="true">
        <div className="grid" />
        <div className="glow glowOne" />
        <div className="glow glowTwo" />
        <div className="timelineLine" />
      </div>

      <div className="pageShell">
        <header className="topbar">
          <Link href="/governance-library" className="topbarLink">
            ← Governance Library
          </Link>

          <div className="topbarStatus">
            <span />
            Institutional chronology index
          </div>

          <Link href="/governance-library/timeline" className="topbarAction">
            Open Governance Timeline <Arrow />
          </Link>
        </header>

        <section className="hero">
          <div className="heroSeal">
            <span>YR</span>
            <small>TA-14</small>
          </div>

          <p className="eyebrow">TA-14 INSTITUTIONAL GOVERNANCE LIBRARY</p>

          <h1>
            Governance
            <em> Year Index</em>
          </h1>

          <p className="heroLead">
            Browse laws, regulations, standards, codes, frameworks, guidance,
            governed records, and TA-14 proposals by their preserved publication
            year. A year is not merely a date label. It identifies the edition,
            authority state, historical context, and version that may govern a
            later determination.
          </p>

          <div className="heroActions">
            <a href="#year-index" className="primaryAction">
              Browse the Year Index <span>↓</span>
            </a>
            <Link href="/governance-library/status" className="secondaryAction">
              Resolve Status <Arrow />
            </Link>
            <Link href="/governance-library/applicability" className="secondaryAction">
              Determine Applicability <Arrow />
            </Link>
          </div>

          <div className="heroMetrics">
            <article>
              <strong>{metrics.records}</strong>
              <span>Governed records</span>
            </article>
            <article>
              <strong>{metrics.years}</strong>
              <span>Distinct known years</span>
            </article>
            <article>
              <strong>{metrics.earliest ?? "—"}</strong>
              <span>Earliest preserved year</span>
            </article>
            <article>
              <strong>{metrics.latest ?? "—"}</strong>
              <span>Latest preserved year</span>
            </article>
            <article>
              <strong>{metrics.publishers}</strong>
              <span>Publishers represented</span>
            </article>
          </div>
        </section>

        <section className="principleBand">
          <article>
            <span>PUBLICATION YEAR</span>
            <strong>When an instrument or governed record was issued</strong>
            <p>
              Publication establishes chronology, but it does not alone prove
              adoption, legal effect, current applicability, or supersession.
            </p>
          </article>

          <article>
            <span>APPLICABLE EDITION</span>
            <strong>The version actually controlling the governed route</strong>
            <p>
              A newer edition may exist while an older edition remains the one
              incorporated into law, code, contract, policy, or certification.
            </p>
          </article>

          <article>
            <span>TA-14 RULE</span>
            <strong>No unresolved version. No final authority determination.</strong>
            <p>
              Year, edition, amendment state, adoption source, and effective date
              must remain distinct and attributable.
            </p>
          </article>
        </section>

        <section className="indexSection" id="year-index">
          <div className="sectionHeading">
            <div>
              <p className="eyebrow">YEAR CONTROL DESK</p>
              <h2>Find the year. Inspect the record. Preserve the edition boundary.</h2>
            </div>

            <p>
              Search the institutional library by title, publisher, type,
              jurisdiction, domain, or year. Expand a year to inspect all records
              associated with that chronological point.
            </p>
          </div>

          <div className="filterPanel">
            <label className="searchField">
              Search records
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search Clean Air Act, ASHRAE, EPA, AI Act..."
              />
            </label>

            <label>
              Record type
              <select
                value={recordType}
                onChange={(event) => setRecordType(event.target.value)}
              >
                {recordTypes.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Publisher
              <select
                value={publisher}
                onChange={(event) => setPublisher(event.target.value)}
              >
                {publishers.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Year
              <select
                value={selectedYear}
                onChange={(event) => setSelectedYear(event.target.value)}
              >
                {yearOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Sort direction
              <select
                value={sortDirection}
                onChange={(event) =>
                  setSortDirection(event.target.value as SortDirection)
                }
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
              </select>
            </label>

            <button type="button" className="clearButton" onClick={clearFilters}>
              Clear filters
            </button>
          </div>

          <div className="resultsSummary">
            <div>
              <span>{filteredRecords.length}</span>
              <strong>matching records</strong>
            </div>
            <p>
              {yearGroups.length} year groups · {metrics.unresolved} records with
              unresolved or unavailable year metadata
            </p>
          </div>

          <div className="yearGroups">
            {yearGroups.map((group, groupIndex) => {
              const isExpanded =
                expandedYears.includes(group.year) ||
                yearGroups.length <= 4 ||
                groupIndex === 0;

              return (
                <section className="yearGroup" key={group.year}>
                  <button
                    type="button"
                    className="yearHeader"
                    onClick={() => toggleYear(group.year)}
                    aria-expanded={isExpanded}
                  >
                    <div className="yearIdentity">
                      <span className="yearMarker">
                        {group.year === "Unknown" ? "?" : group.year.slice(-2)}
                      </span>
                      <div>
                        <small>PUBLICATION YEAR</small>
                        <h3>{group.year}</h3>
                      </div>
                    </div>

                    <div className="yearMeta">
                      <span>{group.records.length} records</span>
                      <strong>{isExpanded ? "Collapse" : "Inspect year"}</strong>
                      <i>{isExpanded ? "−" : "+"}</i>
                    </div>
                  </button>

                  {isExpanded ? (
                    <div className="recordGrid">
                      {group.records.map((record, index) => (
                        <Link
                          href={`/governance-library/${record.slug}`}
                          className="recordCard"
                          key={`${group.year}-${record.slug}-${index}`}
                        >
                          <div className="recordTopline">
                            <span>{String(index + 1).padStart(2, "0")}</span>
                            <small className={statusClass(record.status)}>
                              {record.status}
                            </small>
                          </div>

                          <p>{record.recordType}</p>
                          <h4>{record.title}</h4>
                          <div className="recordPublisher">
                            <strong>{record.publisher}</strong>
                            <span>{record.jurisdiction}</span>
                          </div>
                          <p className="recordSummary">{record.summary}</p>
                          <div className="recordFooter">
                            <span>{record.domain}</span>
                            <b>Open governed record <Arrow /></b>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </section>
              );
            })}

            {yearGroups.length === 0 ? (
              <div className="emptyState">
                <span>00</span>
                <h3>No year group matched the current filters.</h3>
                <p>
                  Clear one or more filters, search a broader term, or open the
                  Governance Timeline to inspect chronology across the institution.
                </p>
                <button type="button" onClick={clearFilters}>
                  Reset the Year Index
                </button>
              </div>
            ) : null}
          </div>
        </section>

        <section className="resolutionSection">
          <div className="sectionHeading">
            <div>
              <p className="eyebrow">YEAR AND VERSION RESOLUTION</p>
              <h2>A date becomes governable only when its meaning is preserved.</h2>
            </div>

            <p>
              TA-14 separates publication, adoption, effective date, amendment,
              implementation, supersession, and outcome chronology so that no date
              silently substitutes for another.
            </p>
          </div>

          <div className="resolutionSteps">
            {[
              ["01", "Identify", "Identify the official title, publisher, edition, and displayed publication year."],
              ["02", "Verify", "Verify the year against the official source or an attributable authoritative record."],
              ["03", "Distinguish", "Separate publication year from adoption, effective, compliance, amendment, and enforcement dates."],
              ["04", "Locate", "Determine which jurisdiction, organization, contract, permit, or code adopted the edition."],
              ["05", "Compare", "Identify later editions, amendments, corrigenda, withdrawals, and superseding instruments."],
              ["06", "Apply", "Determine which edition governed the actual subject, activity, place, and time."],
              ["07", "Bind", "Bind the resolved edition to the authority, evidence, determination, and permitted execution."],
              ["08", "Preserve", "Preserve the source, year, edition, adoption path, unresolved facts, and revalidation trigger."],
            ].map(([code, title, text]) => (
              <article key={code}>
                <span>{code}</span>
                <strong>{title}</strong>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="failureSection">
          <div className="sectionHeading centered">
            <div>
              <p className="eyebrow">CHRONOLOGY FAILURE MODES</p>
              <h2>Most date errors are authority errors waiting to happen.</h2>
            </div>
          </div>

          <div className="failureGrid">
            {[
              ["Latest-is-applicable error", "Treating the newest published edition as controlling without proving adoption."],
              ["Publication-effective collapse", "Using publication year as though it were the date legal obligations began."],
              ["Historical erasure", "Replacing a prior edition without preserving the authority and evidence relied upon at the time."],
              ["Amendment blindness", "Citing the original act or standard while omitting material amendments or corrigenda."],
              ["Proposal inflation", "Presenting a future, draft, or proposed instrument as current authority."],
              ["Unknown-year acceptance", "Allowing a record with unresolved chronology to support final consequential reliance."],
              ["Cross-jurisdiction substitution", "Applying the adoption date from one jurisdiction to another without authority."],
              ["Outcome-date omission", "Recording the decision date but failing to preserve when reality changed afterward."],
            ].map(([title, text], index) => (
              <article key={title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="academySection">
          <div className="academySeal" aria-hidden="true">
            <small>TA-14</small>
            <strong>ACADEMY</strong>
            <span>YEAR · VERSION · AUTHORITY</span>
          </div>

          <div className="academyCopy">
            <p className="eyebrow">TIMELINE AND VERSION LITERACY ACADEMY</p>
            <h2>Learn why the right instrument with the wrong year can produce the wrong authority.</h2>
            <p>
              The Academy teaches learners to distinguish publication, effective,
              adoption, amendment, enforcement, implementation, supersession, and
              outcome dates. Learners inspect examples, resolve competing editions,
              run chronology simulations, and prepare a review-ready version package.
            </p>

            <div className="academyGrid">
              {[
                ["01", "Read official chronology", "Locate official editions, amendments, adoption records, and effective dates."],
                ["02", "Compare editions", "Inspect what changed and whether the difference affects duty, evidence, or execution."],
                ["03", "Resolve adoption", "Determine which authority adopted which edition for which jurisdiction and activity."],
                ["04", "Detect supersession", "Identify withdrawal, replacement, transition periods, and preserved historical reliance."],
                ["05", "Build the package", "Preserve the chronology evidence required for Applicability and Entity Review."],
                ["06", "Revalidate", "Trigger review when law, regulation, standard, code, contract, or operating context changes."],
              ].map(([code, title, text]) => (
                <article key={code}>
                  <span>{code}</span>
                  <div>
                    <strong>{title}</strong>
                    <p>{text}</p>
                  </div>
                </article>
              ))}
            </div>

            <div className="academyActions">
              <Link href="/academy" className="academyAction">
                Enter TA-14 Academy <Arrow />
              </Link>
              <Link href="/governance-library/timeline" className="secondaryAction">
                Open Governance Timeline <Arrow />
              </Link>
              <Link href="/governance-library/applicability" className="secondaryAction">
                Resolve Applicability <Arrow />
              </Link>
            </div>
          </div>
        </section>

        <section className="boundarySection">
          <p className="eyebrow gold">YEAR INDEX BOUNDARY</p>
          <h2>A publication year is evidence of chronology—not automatic proof of current authority.</h2>
          <p>
            This index organizes governance records using the year metadata preserved
            in the TA-14 Governance Library. It does not independently establish legal
            effect, official adoption, amendment status, current applicability,
            certification, conformity, or permission to execute. Official sources,
            jurisdiction-specific adoption records, contracts, permits, and qualified
            review remain controlling.
          </p>

          <div className="boundaryGrid">
            <article>
              <span>INDEX PROVIDES</span>
              <strong>Chronological navigation, record discovery, and edition-awareness prompts</strong>
            </article>
            <article>
              <span>INDEX DOES NOT PROVIDE</span>
              <strong>Automatic legal applicability, current-authority confirmation, or official source substitution</strong>
            </article>
            <article>
              <span>FINAL RELIANCE REQUIRES</span>
              <strong>Source verification, adoption evidence, authority resolution, applicability, and revalidation</strong>
            </article>
          </div>
        </section>

        <footer>
          <span>TA-14 Authority Governance Institution</span>
          <span>Governance Library · Institutional Year Index</span>
        </footer>
      </div>

      <style jsx>{`
        :global(*) {
          box-sizing: border-box;
        }

        :global(html) {
          background: #020813;
          scroll-behavior: smooth;
        }

        :global(body) {
          margin: 0;
          background: #020813;
          color: #f7fbff;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system,
            BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        :global(a) {
          color: inherit;
        }

        .yearPage {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          isolation: isolate;
          background:
            radial-gradient(circle at 50% -10%, rgba(59, 151, 212, 0.16), transparent 34%),
            linear-gradient(180deg, #030b16 0%, #020813 58%, #01050b 100%);
        }

        .background {
          position: fixed;
          inset: 0;
          z-index: -2;
          overflow: hidden;
          pointer-events: none;
        }

        .grid {
          position: absolute;
          inset: 0;
          opacity: 0.14;
          background-image:
            linear-gradient(rgba(255, 255, 255, 0.022) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.022) 1px, transparent 1px);
          background-size: 64px 64px;
          mask-image: linear-gradient(to bottom, black, transparent 92%);
        }

        .glow {
          position: absolute;
          width: 680px;
          height: 680px;
          border-radius: 50%;
          filter: blur(110px);
          opacity: 0.14;
        }

        .glowOne {
          left: -260px;
          top: 18%;
          background: #168cd0;
        }

        .glowTwo {
          right: -290px;
          top: 58%;
          background: #d59b32;
        }

        .timelineLine {
          position: absolute;
          left: 50%;
          top: 0;
          bottom: 0;
          width: 1px;
          background: linear-gradient(
            180deg,
            transparent,
            rgba(107, 221, 246, 0.24),
            rgba(241, 190, 86, 0.2),
            transparent
          );
        }

        .pageShell {
          width: min(1500px, calc(100% - 40px));
          margin: auto;
          padding: 22px 0 88px;
          position: relative;
          z-index: 2;
        }

        .topbar {
          min-height: 68px;
          padding: 11px;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 16px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 18px;
          background: rgba(7, 21, 36, 0.82);
          backdrop-filter: blur(16px);
          box-shadow: 0 18px 44px rgba(0, 0, 0, 0.24);
        }

        .topbarLink,
        .topbarAction,
        .primaryAction,
        .secondaryAction,
        .academyAction {
          min-height: 46px;
          padding: 0 16px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          border-radius: 11px;
          text-decoration: none;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          transition: transform 0.22s, border-color 0.22s;
        }

        .topbarLink,
        .secondaryAction {
          color: #c3d4dc;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(0, 0, 0, 0.16);
        }

        .topbarLink {
          justify-self: start;
        }

        .topbarAction,
        .primaryAction {
          color: #031923;
          border: 1px solid #a8efff;
          background: linear-gradient(135deg, #defbff, #77dcec 65%, #359fbf);
        }

        .topbarAction {
          justify-self: end;
        }

        .academyAction {
          color: #041811;
          border: 1px solid #9bf3c4;
          background: linear-gradient(135deg, #d8ffe9, #65e5a6 65%, #269264);
        }

        .topbarLink:hover,
        .topbarAction:hover,
        .primaryAction:hover,
        .secondaryAction:hover,
        .academyAction:hover {
          transform: translateY(-3px);
        }

        .topbarStatus {
          display: flex;
          align-items: center;
          gap: 9px;
          color: #89a4b1;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.13em;
          text-transform: uppercase;
        }

        .topbarStatus span {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #71e3b0;
          box-shadow: 0 0 14px rgba(113, 227, 176, 0.84);
        }

        .hero {
          max-width: 1180px;
          margin: auto;
          padding: 88px 0 74px;
          text-align: center;
        }

        .heroSeal {
          width: 108px;
          height: 108px;
          margin: 0 auto 28px;
          display: grid;
          align-content: center;
          justify-items: center;
          gap: 3px;
          border: 1px solid rgba(244, 197, 95, 0.4);
          border-radius: 50%;
          background: radial-gradient(circle, rgba(245, 199, 101, 0.11), rgba(4, 19, 33, 0.96));
          box-shadow: 0 0 60px rgba(244, 193, 82, 0.09);
        }

        .heroSeal span {
          color: #ffe3a1;
          font: 900 32px Georgia, serif;
        }

        .heroSeal small {
          color: #78939f;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.17em;
        }

        .eyebrow {
          margin: 0;
          color: #6fe6fa;
          font-size: 10px;
          font-weight: 950;
          letter-spacing: 0.22em;
          text-transform: uppercase;
        }

        .eyebrow.gold {
          color: #efbd5d;
        }

        h1,
        h2,
        h3,
        h4 {
          font-family: Georgia, "Times New Roman", serif;
        }

        .hero h1 {
          margin: 15px auto 0;
          font-size: clamp(54px, 6.5vw, 94px);
          line-height: 0.94;
          letter-spacing: -0.058em;
        }

        .hero h1 em {
          display: block;
          color: #f1c66d;
          font-style: italic;
          font-weight: 500;
        }

        .heroLead {
          max-width: 980px;
          margin: 27px auto 0;
          color: #afc1ca;
          font-size: 18px;
          line-height: 1.74;
        }

        .heroActions,
        .academyActions {
          margin-top: 30px;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 10px;
        }

        .heroMetrics {
          margin-top: 40px;
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 11px;
        }

        .heroMetrics article {
          padding: 18px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 16px;
          background: rgba(7, 24, 38, 0.68);
        }

        .heroMetrics strong {
          display: block;
          color: #f3d38d;
          font: 700 27px Georgia, serif;
        }

        .heroMetrics span {
          display: block;
          margin-top: 5px;
          color: #728b97;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .principleBand {
          padding-bottom: 84px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
        }

        .principleBand article {
          padding: 24px;
          border: 1px solid rgba(105, 221, 245, 0.13);
          border-radius: 19px;
          background: linear-gradient(145deg, rgba(8, 31, 46, 0.82), rgba(3, 15, 26, 0.9));
        }

        .principleBand span {
          color: #6ed9ee;
          font-size: 8px;
          font-weight: 950;
          letter-spacing: 0.13em;
        }

        .principleBand strong {
          display: block;
          margin: 13px 0 9px;
          font: 700 21px Georgia, serif;
        }

        .principleBand p {
          margin: 0;
          color: #8ea4ae;
          font-size: 12px;
          line-height: 1.62;
        }

        .indexSection,
        .resolutionSection,
        .failureSection,
        .academySection,
        .boundarySection {
          padding-top: 88px;
        }

        .sectionHeading {
          margin-bottom: 30px;
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 40px;
          align-items: end;
        }

        .sectionHeading.centered {
          display: block;
          max-width: 980px;
          margin-inline: auto;
          text-align: center;
        }

        .sectionHeading h2,
        .academyCopy h2,
        .boundarySection h2 {
          margin: 11px 0 0;
          font-size: clamp(40px, 4.5vw, 68px);
          line-height: 0.98;
          letter-spacing: -0.05em;
        }

        .sectionHeading > p,
        .academyCopy > p,
        .boundarySection > p:not(.eyebrow) {
          margin: 0;
          color: #9db1ba;
          font-size: 15px;
          line-height: 1.74;
        }

        .filterPanel {
          padding: 18px;
          display: grid;
          grid-template-columns: minmax(250px, 1.25fr) repeat(4, minmax(150px, 0.7fr)) auto;
          align-items: end;
          gap: 10px;
          border: 1px solid rgba(108, 224, 247, 0.13);
          border-radius: 20px;
          background: linear-gradient(145deg, rgba(8, 29, 43, 0.95), rgba(3, 13, 23, 0.98));
        }

        label {
          display: grid;
          gap: 7px;
          color: #7694a2;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        input,
        select {
          width: 100%;
          min-height: 46px;
          padding: 0 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          outline: none;
          color: #ecf5f8;
          background: rgba(0, 0, 0, 0.19);
          font: inherit;
          text-transform: none;
        }

        select option {
          color: #eaf4f8;
          background: #071520;
        }

        .clearButton,
        .emptyState button {
          min-height: 46px;
          padding: 0 15px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          color: #bdcdd4;
          background: rgba(0, 0, 0, 0.19);
          cursor: pointer;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .resultsSummary {
          margin-top: 15px;
          padding: 15px 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 14px;
          background: rgba(4, 17, 29, 0.7);
        }

        .resultsSummary div {
          display: flex;
          align-items: baseline;
          gap: 8px;
        }

        .resultsSummary span {
          color: #f1cb79;
          font: 700 22px Georgia, serif;
        }

        .resultsSummary strong {
          color: #c0d0d7;
          font-size: 10px;
        }

        .resultsSummary p {
          margin: 0;
          color: #748c97;
          font-size: 9px;
        }

        .yearGroups {
          margin-top: 18px;
          display: grid;
          gap: 15px;
        }

        .yearGroup {
          overflow: hidden;
          border: 1px solid rgba(106, 221, 245, 0.13);
          border-radius: 22px;
          background: linear-gradient(145deg, rgba(8, 29, 43, 0.92), rgba(3, 13, 23, 0.97));
          box-shadow: 0 24px 58px rgba(0, 0, 0, 0.2);
        }

        .yearHeader {
          width: 100%;
          padding: 19px 22px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          border: 0;
          color: inherit;
          background: transparent;
          cursor: pointer;
          text-align: left;
        }

        .yearIdentity {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .yearMarker {
          width: 54px;
          height: 54px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(242, 196, 94, 0.32);
          border-radius: 50%;
          color: #f1ce82;
          font: 700 18px Georgia, serif;
        }

        .yearIdentity small {
          color: #6fddee;
          font-size: 7px;
          font-weight: 900;
          letter-spacing: 0.12em;
        }

        .yearIdentity h3 {
          margin: 3px 0 0;
          font-size: 35px;
        }

        .yearMeta {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .yearMeta span {
          color: #758e99;
          font-size: 9px;
          font-weight: 800;
        }

        .yearMeta strong {
          color: #b9cbd2;
          font-size: 9px;
        }

        .yearMeta i {
          width: 34px;
          height: 34px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          color: #70dff1;
          font-style: normal;
        }

        .recordGrid {
          padding: 18px;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
        }

        .recordCard {
          min-height: 320px;
          padding: 19px;
          display: flex;
          flex-direction: column;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 16px;
          background: rgba(0, 0, 0, 0.16);
          text-decoration: none;
          transition: transform 0.24s, border-color 0.24s;
        }

        .recordCard:hover {
          transform: translateY(-5px);
          border-color: rgba(103, 225, 246, 0.3);
        }

        .recordTopline {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .recordTopline > span {
          color: #5f8290;
          font-size: 8px;
          font-weight: 900;
        }

        .recordTopline small {
          padding: 6px 8px;
          border-radius: 999px;
          font-size: 7px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .recordTopline small.current {
          color: #7de6b5;
          background: rgba(79, 213, 151, 0.09);
        }

        .recordTopline small.historical {
          color: #e4bd69;
          background: rgba(228, 189, 105, 0.08);
        }

        .recordTopline small.future {
          color: #b99aff;
          background: rgba(163, 126, 255, 0.09);
        }

        .recordTopline small.unknown {
          color: #9aabb3;
          background: rgba(255, 255, 255, 0.05);
        }

        .recordCard > p:first-of-type {
          margin: 22px 0 0;
          color: #6fddee;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .recordCard h4 {
          margin: 9px 0 0;
          font-size: 24px;
          line-height: 1.08;
        }

        .recordPublisher {
          margin-top: 15px;
          padding-top: 13px;
          display: grid;
          gap: 5px;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
        }

        .recordPublisher strong {
          color: #cbd9df;
          font-size: 10px;
        }

        .recordPublisher span {
          color: #6f8792;
          font-size: 8px;
        }

        .recordSummary {
          margin: 15px 0 0;
          color: #899fa9;
          font-size: 10px;
          line-height: 1.58;
        }

        .recordFooter {
          margin-top: auto;
          padding-top: 17px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .recordFooter > span {
          color: #68838f;
          font-size: 8px;
        }

        .recordFooter b {
          color: #efca7b;
          font-size: 8px;
        }

        .emptyState {
          padding: 60px 24px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 22px;
          background: rgba(5, 20, 32, 0.75);
          text-align: center;
        }

        .emptyState > span {
          color: #efc979;
          font: 700 42px Georgia, serif;
        }

        .emptyState h3 {
          margin: 12px 0 0;
          font-size: 28px;
        }

        .emptyState p {
          max-width: 640px;
          margin: 12px auto 20px;
          color: #879da7;
          font-size: 12px;
          line-height: 1.65;
        }

        .resolutionSteps {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 11px;
        }

        .resolutionSteps article {
          min-height: 210px;
          padding: 20px;
          border: 1px solid rgba(105, 221, 245, 0.11);
          border-radius: 17px;
          background: rgba(7, 26, 39, 0.72);
        }

        .resolutionSteps article > span {
          width: 39px;
          height: 39px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(239, 190, 86, 0.25);
          border-radius: 50%;
          color: #efc76f;
          font-size: 8px;
        }

        .resolutionSteps strong {
          display: block;
          margin-top: 25px;
          font: 700 20px Georgia, serif;
        }

        .resolutionSteps p {
          margin: 10px 0 0;
          color: #8299a3;
          font-size: 10px;
          line-height: 1.58;
        }

        .failureGrid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 11px;
        }

        .failureGrid article {
          min-height: 225px;
          padding: 21px;
          border: 1px solid rgba(255, 132, 145, 0.11);
          border-radius: 17px;
          background: linear-gradient(145deg, rgba(46, 18, 27, 0.38), rgba(5, 20, 31, 0.84));
        }

        .failureGrid span {
          color: #df8090;
          font-size: 9px;
          font-weight: 900;
        }

        .failureGrid h3 {
          margin: 28px 0 0;
          font-size: 23px;
        }

        .failureGrid p {
          margin: 12px 0 0;
          color: #8fa1a9;
          font-size: 10px;
          line-height: 1.62;
        }

        .academySection {
          display: grid;
          grid-template-columns: 360px 1fr;
          gap: 54px;
          align-items: center;
        }

        .academySeal {
          width: 320px;
          height: 320px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border: 2px solid rgba(100, 239, 181, 0.7);
          border-radius: 50%;
          background: radial-gradient(circle, rgba(92, 229, 168, 0.15), rgba(3, 25, 28, 0.96));
          box-shadow: 0 0 80px rgba(81, 218, 157, 0.15);
        }

        .academySeal small {
          color: #75ad98;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.16em;
        }

        .academySeal strong {
          color: #b9ffda;
          font: 700 46px Georgia, serif;
        }

        .academySeal span {
          margin-top: 9px;
          color: #62d5a5;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.13em;
        }

        .academyGrid {
          margin-top: 25px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 9px;
        }

        .academyGrid article {
          padding: 15px;
          display: grid;
          grid-template-columns: 42px 1fr;
          gap: 12px;
          border: 1px solid rgba(99, 231, 175, 0.13);
          border-radius: 13px;
          background: rgba(255, 255, 255, 0.024);
        }

        .academyGrid article > span {
          width: 40px;
          height: 40px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(99, 231, 175, 0.32);
          border-radius: 10px;
          color: #77e6b6;
          font-size: 8px;
        }

        .academyGrid strong {
          font-size: 11px;
        }

        .academyGrid p {
          margin: 5px 0 0;
          color: #78928a;
          font-size: 9px;
          line-height: 1.45;
        }

        .academyActions {
          justify-content: flex-start;
        }

        .boundarySection {
          margin-top: 88px;
          padding: 54px 34px;
          border: 1px solid rgba(240, 191, 86, 0.23);
          border-radius: 30px;
          background: rgba(7, 19, 31, 0.96);
          text-align: center;
        }

        .boundarySection > p:not(.eyebrow) {
          max-width: 980px;
          margin: 22px auto 0;
        }

        .boundaryGrid {
          max-width: 1080px;
          margin: 30px auto 0;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 11px;
        }

        .boundaryGrid article {
          padding: 20px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 15px;
        }

        .boundaryGrid span {
          color: #e7b95e;
          font-size: 8px;
          font-weight: 900;
        }

        .boundaryGrid strong {
          display: block;
          margin-top: 9px;
          font-size: 11px;
          line-height: 1.5;
        }

        footer {
          min-height: 82px;
          margin-top: 76px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.07);
          color: #5f7985;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.07em;
        }

        @media (max-width: 1180px) {
          .filterPanel {
            grid-template-columns: 1fr 1fr 1fr;
          }

          .searchField {
            grid-column: 1 / -1;
          }

          .recordGrid {
            grid-template-columns: repeat(2, 1fr);
          }

          .resolutionSteps,
          .failureGrid {
            grid-template-columns: repeat(2, 1fr);
          }

          .academySection {
            grid-template-columns: 1fr;
          }

          .academySeal {
            margin: auto;
          }
        }

        @media (max-width: 760px) {
          .pageShell {
            width: calc(100% - 22px);
          }

          .topbar {
            grid-template-columns: 1fr 1fr;
          }

          .topbarStatus {
            display: none;
          }

          .hero {
            padding: 66px 0 58px;
          }

          .hero h1 {
            font-size: 52px;
          }

          .heroLead {
            font-size: 15px;
          }

          .heroMetrics,
          .principleBand,
          .sectionHeading,
          .filterPanel,
          .recordGrid,
          .resolutionSteps,
          .failureGrid,
          .academyGrid,
          .boundaryGrid {
            grid-template-columns: 1fr;
          }

          .sectionHeading {
            gap: 14px;
          }

          .resultsSummary,
          .yearHeader {
            align-items: flex-start;
            flex-direction: column;
          }

          .yearMeta {
            width: 100%;
            justify-content: space-between;
          }

          .recordCard {
            min-height: 280px;
          }

          .academySeal {
            width: 260px;
            height: 260px;
          }

          .academySeal strong {
            font-size: 38px;
          }

          .heroActions,
          .academyActions {
            flex-direction: column;
          }

          .primaryAction,
          .secondaryAction,
          .academyAction {
            width: 100%;
          }

          footer {
            flex-direction: column;
            justify-content: center;
            text-align: center;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            scroll-behavior: auto !important;
            transition: none !important;
          }
        }
      `}</style>
    </main>
  );
}
