"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  governanceLibraryRecords,
} from "../../../lib/governance-library";
import type {
  GovernanceLibraryRecord,
} from "../../../lib/governance-library/records-foundational";

type DirectionFilter =
  | "All relationships"
  | "Outbound"
  | "Inbound"
  | "Reciprocal";

type IntegrityLevel =
  | "Connected"
  | "Reciprocal"
  | "One-directional"
  | "Unresolved";

type Relationship = {
  source: GovernanceLibraryRecord;
  target?: GovernanceLibraryRecord;
  targetSlug: string;
  reciprocal: boolean;
};

function normalize(value: string | undefined) {
  return value?.trim() || "Unspecified";
}

function createRecordMap(
  records: GovernanceLibraryRecord[],
) {
  return new Map(
    records.map((record) => [record.slug, record]),
  );
}

function getIntegrityLevel(
  relationships: Relationship[],
): IntegrityLevel {
  if (
    relationships.some(
      (relationship) => !relationship.target,
    )
  ) {
    return "Unresolved";
  }

  if (
    relationships.some(
      (relationship) => relationship.reciprocal,
    )
  ) {
    return "Reciprocal";
  }

  if (relationships.length > 0) {
    return "One-directional";
  }

  return "Connected";
}

function statusClass(value: string) {
  return value
    .toLowerCase()
    .replaceAll(" ", "-")
    .replaceAll("/", "-");
}

export default function GovernanceLibraryRelationshipsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [recordTypeFilter, setRecordTypeFilter] =
    useState("All record types");
  const [jurisdictionFilter, setJurisdictionFilter] =
    useState("All jurisdictions");
  const [directionFilter, setDirectionFilter] =
    useState<DirectionFilter>("All relationships");
  const [selectedSlug, setSelectedSlug] =
    useState<string | null>(null);

  const records = useMemo(
    () =>
      [...governanceLibraryRecords] as GovernanceLibraryRecord[],
    [],
  );

  const recordMap = useMemo(
    () => createRecordMap(records),
    [records],
  );

  const relationships = useMemo<Relationship[]>(
    () =>
      records.flatMap((record) =>
        record.relatedSlugs.map((targetSlug) => {
          const target = recordMap.get(targetSlug);

          return {
            source: record,
            target,
            targetSlug,
            reciprocal:
              target?.relatedSlugs.includes(record.slug) ??
              false,
          };
        }),
      ),
    [recordMap, records],
  );

  const inboundMap = useMemo(() => {
    const map = new Map<
      string,
      GovernanceLibraryRecord[]
    >();

    relationships.forEach((relationship) => {
      if (!relationship.target) {
        return;
      }

      const current =
        map.get(relationship.target.slug) ?? [];

      map.set(relationship.target.slug, [
        ...current,
        relationship.source,
      ]);
    });

    return map;
  }, [relationships]);

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

  const connectedRecords = useMemo(
    () =>
      records.filter(
        (record) =>
          record.relatedSlugs.length > 0 ||
          (inboundMap.get(record.slug)?.length ?? 0) > 0,
      ),
    [inboundMap, records],
  );

  const visibleRecords = useMemo(() => {
    const normalizedQuery =
      searchQuery.trim().toLowerCase();

    return connectedRecords
      .filter((record) => {
        const outbound = record.relatedSlugs
          .map((slug) => recordMap.get(slug))
          .filter(
            (
              item,
            ): item is GovernanceLibraryRecord =>
              Boolean(item),
          );

        const inbound = inboundMap.get(record.slug) ?? [];

        const reciprocalCount = outbound.filter(
          (target) =>
            target.relatedSlugs.includes(record.slug),
        ).length;

        const matchesSearch =
          normalizedQuery.length === 0 ||
          [
            record.title,
            record.summary,
            record.recordType,
            record.jurisdiction,
            record.publisher,
            ...outbound.map((item) => item.title),
            ...inbound.map((item) => item.title),
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase()
            .includes(normalizedQuery);

        const matchesRecordType =
          recordTypeFilter === "All record types" ||
          normalize(record.recordType) ===
            recordTypeFilter;

        const matchesJurisdiction =
          jurisdictionFilter === "All jurisdictions" ||
          normalize(record.jurisdiction) ===
            jurisdictionFilter;

        const matchesDirection =
          directionFilter === "All relationships" ||
          (directionFilter === "Outbound" &&
            outbound.length > 0) ||
          (directionFilter === "Inbound" &&
            inbound.length > 0) ||
          (directionFilter === "Reciprocal" &&
            reciprocalCount > 0);

        return (
          matchesSearch &&
          matchesRecordType &&
          matchesJurisdiction &&
          matchesDirection
        );
      })
      .sort((a, b) =>
        a.title.localeCompare(b.title),
      );
  }, [
    connectedRecords,
    directionFilter,
    inboundMap,
    jurisdictionFilter,
    recordMap,
    recordTypeFilter,
    searchQuery,
  ]);

  const selectedRecord =
    records.find(
      (record) => record.slug === selectedSlug,
    ) ?? null;

  const selectedOutbound = useMemo(() => {
    if (!selectedRecord) {
      return [];
    }

    return selectedRecord.relatedSlugs.map(
      (targetSlug) => {
        const target = recordMap.get(targetSlug);

        return {
          source: selectedRecord,
          target,
          targetSlug,
          reciprocal:
            target?.relatedSlugs.includes(
              selectedRecord.slug,
            ) ?? false,
        };
      },
    );
  }, [recordMap, selectedRecord]);

  const selectedInbound = selectedRecord
    ? inboundMap.get(selectedRecord.slug) ?? []
    : [];

  const unresolvedRelationships =
    relationships.filter(
      (relationship) => !relationship.target,
    );

  const reciprocalRelationships =
    relationships.filter(
      (relationship) => relationship.reciprocal,
    );

  const oneDirectionalRelationships =
    relationships.filter(
      (relationship) =>
        relationship.target &&
        !relationship.reciprocal,
    );

  const isolatedRecords = records.filter(
    (record) =>
      record.relatedSlugs.length === 0 &&
      (inboundMap.get(record.slug)?.length ?? 0) === 0,
  );

  const activeFilterCount = [
    searchQuery.trim().length > 0,
    recordTypeFilter !== "All record types",
    jurisdictionFilter !== "All jurisdictions",
    directionFilter !== "All relationships",
  ].filter(Boolean).length;

  function clearFilters() {
    setSearchQuery("");
    setRecordTypeFilter("All record types");
    setJurisdictionFilter("All jurisdictions");
    setDirectionFilter("All relationships");
  }

  return (
    <main className="relationshipsPage">
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
            Relationship graph active
          </div>

          <Link
            href="/governance-library/compare"
            className="topbarAction"
          >
            Open Comparison →
          </Link>
        </div>

        <header className="hero">
          <div className="heroSeal">
            <span>GR</span>
            <small>TA-14</small>
          </div>

          <p className="eyebrow">
            TA-14 AI GOVERNANCE LIBRARY
          </p>

          <h1>
            Governance
            <span> Relationships Engine</span>
          </h1>

          <p className="lead">
            Inspect how laws, standards, frameworks,
            principles, methodologies, and TA-14
            architectures are connected while preserving
            the distinctions between conceptual
            relationship, authority, applicability,
            obligation, conformity, and execution.
          </p>

          <div className="heroMetrics">
            <article>
              <span>{records.length}</span>
              <small>Total records</small>
            </article>

            <article>
              <span>{relationships.length}</span>
              <small>Declared links</small>
            </article>

            <article>
              <span>
                {reciprocalRelationships.length}
              </span>
              <small>Reciprocal links</small>
            </article>

            <article>
              <span>
                {oneDirectionalRelationships.length}
              </span>
              <small>One-directional links</small>
            </article>

            <article>
              <span>
                {unresolvedRelationships.length}
              </span>
              <small>Unresolved links</small>
            </article>
          </div>
        </header>

        <section className="controlSection">
          <div className="sectionHeading">
            <div>
              <p className="eyebrow">
                RELATIONSHIP CONTROL DESK
              </p>

              <h2>
                Search, filter, and inspect the graph.
              </h2>
            </div>

            <p>
              Relationship declarations identify
              documented connections between governance
              records. They do not establish equivalence,
              precedence, substituted compliance, or
              automatic applicability.
            </p>
          </div>

          <div className="filterPanel">
            <label className="searchField">
              Search connected records
              <input
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(event.target.value)
                }
                placeholder="Search titles, summaries, authorities, or connected records"
              />
            </label>

            <label>
              Record type
              <select
                value={recordTypeFilter}
                onChange={(event) =>
                  setRecordTypeFilter(
                    event.target.value,
                  )
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
                  setJurisdictionFilter(
                    event.target.value,
                  )
                }
              >
                {jurisdictions.map(
                  (jurisdiction) => (
                    <option
                      key={jurisdiction}
                      value={jurisdiction}
                    >
                      {jurisdiction}
                    </option>
                  ),
                )}
              </select>
            </label>

            <label>
              Relationship direction
              <select
                value={directionFilter}
                onChange={(event) =>
                  setDirectionFilter(
                    event.target
                      .value as DirectionFilter,
                  )
                }
              >
                {[
                  "All relationships",
                  "Outbound",
                  "Inbound",
                  "Reciprocal",
                ].map((direction) => (
                  <option
                    key={direction}
                    value={direction}
                  >
                    {direction}
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
              <small>Connected records shown</small>
            </div>

            <div>
              <span>{activeFilterCount}</span>
              <small>Active filters</small>
            </div>

            <div>
              <span>{isolatedRecords.length}</span>
              <small>Isolated records</small>
            </div>
          </div>
        </section>

        <section className="relationshipSection">
          <div className="sectionHeading">
            <div>
              <p className="eyebrow">
                RELATIONSHIP DIRECTORY
              </p>

              <h2>
                Governance records and their connections.
              </h2>
            </div>

            <p>
              Select a record to inspect its outbound,
              inbound, reciprocal, and unresolved
              relationships in a focused evidence view.
            </p>
          </div>

          <div className="relationshipGrid">
            <aside className="recordDirectory">
              <div className="directoryHeading">
                <span>Connected records</span>
                <strong>{visibleRecords.length}</strong>
              </div>

              <div className="recordList">
                {visibleRecords.map((record, index) => {
                  const outboundCount =
                    record.relatedSlugs.length;
                  const inboundCount =
                    inboundMap.get(record.slug)?.length ??
                    0;
                  const active =
                    selectedRecord?.slug === record.slug;

                  return (
                    <button
                      type="button"
                      key={record.slug}
                      className={`recordButton ${
                        active ? "active" : ""
                      }`}
                      onClick={() =>
                        setSelectedSlug(record.slug)
                      }
                    >
                      <span className="recordIndex">
                        {String(index + 1).padStart(
                          2,
                          "0",
                        )}
                      </span>

                      <span className="recordIdentity">
                        <small>
                          {normalize(
                            record.recordType,
                          )}
                        </small>

                        <strong>
                          {record.title}
                        </strong>

                        <span>
                          {outboundCount} outbound ·{" "}
                          {inboundCount} inbound
                        </span>
                      </span>

                      <span className="recordArrow">
                        →
                      </span>
                    </button>
                  );
                })}

                {visibleRecords.length === 0 ? (
                  <div className="emptyState compact">
                    No connected records match the current
                    filters.
                  </div>
                ) : null}
              </div>
            </aside>

            <section className="relationshipDesk">
              {selectedRecord ? (
                <>
                  <div className="deskHeader">
                    <div>
                      <p className="eyebrow">
                        FOCUSED RELATIONSHIP REVIEW
                      </p>

                      <h3>{selectedRecord.title}</h3>

                      <span>
                        {normalize(
                          selectedRecord.recordType,
                        )}{" "}
                        ·{" "}
                        {normalize(
                          selectedRecord.jurisdiction,
                        )}
                      </span>
                    </div>

                    <Link
                      href={`/governance-library/${selectedRecord.slug}`}
                      className="recordAction"
                    >
                      Open full record →
                    </Link>
                  </div>

                  <p className="recordSummary">
                    {selectedRecord.summary}
                  </p>

                  <div className="relationshipSummary">
                    <article>
                      <span>
                        {selectedOutbound.length}
                      </span>
                      <small>Outbound</small>
                    </article>

                    <article>
                      <span>
                        {selectedInbound.length}
                      </span>
                      <small>Inbound</small>
                    </article>

                    <article>
                      <span>
                        {
                          selectedOutbound.filter(
                            (item) =>
                              item.reciprocal,
                          ).length
                        }
                      </span>
                      <small>Reciprocal</small>
                    </article>

                    <article>
                      <span>
                        {
                          selectedOutbound.filter(
                            (item) => !item.target,
                          ).length
                        }
                      </span>
                      <small>Unresolved</small>
                    </article>
                  </div>

                  <div className="connectionColumns">
                    <article className="connectionCard">
                      <div className="cardHeading">
                        <div>
                          <span>
                            Outbound relationships
                          </span>
                          <strong>
                            Records declared by this
                            source
                          </strong>
                        </div>

                        <b>
                          {selectedOutbound.length}
                        </b>
                      </div>

                      <div className="connectionList">
                        {selectedOutbound.map(
                          (relationship) => (
                            <div
                              key={
                                relationship.targetSlug
                              }
                              className="connectionItem"
                            >
                              <div>
                                <span
                                  className={`integrityBadge ${statusClass(
                                    getIntegrityLevel([
                                      relationship,
                                    ]),
                                  )}`}
                                >
                                  {relationship.target
                                    ? relationship.reciprocal
                                      ? "Reciprocal"
                                      : "One-directional"
                                    : "Unresolved"}
                                </span>

                                <strong>
                                  {relationship.target
                                    ?.title ??
                                    relationship.targetSlug}
                                </strong>

                                <p>
                                  {relationship.target
                                    ? `${normalize(
                                        relationship
                                          .target
                                          .recordType,
                                      )} · ${normalize(
                                        relationship
                                          .target
                                          .jurisdiction,
                                      )}`
                                    : "The referenced slug does not resolve to a current governance record."}
                                </p>
                              </div>

                              {relationship.target ? (
                                <Link
                                  href={`/governance-library/${relationship.target.slug}`}
                                >
                                  View →
                                </Link>
                              ) : (
                                <span className="missingMark">
                                  Missing
                                </span>
                              )}
                            </div>
                          ),
                        )}

                        {selectedOutbound.length ===
                        0 ? (
                          <div className="emptyState compact">
                            This record declares no
                            outbound relationships.
                          </div>
                        ) : null}
                      </div>
                    </article>

                    <article className="connectionCard">
                      <div className="cardHeading">
                        <div>
                          <span>
                            Inbound relationships
                          </span>
                          <strong>
                            Records that reference this
                            source
                          </strong>
                        </div>

                        <b>
                          {selectedInbound.length}
                        </b>
                      </div>

                      <div className="connectionList">
                        {selectedInbound.map(
                          (source) => {
                            const reciprocal =
                              selectedRecord.relatedSlugs.includes(
                                source.slug,
                              );

                            return (
                              <div
                                key={source.slug}
                                className="connectionItem"
                              >
                                <div>
                                  <span
                                    className={`integrityBadge ${
                                      reciprocal
                                        ? "reciprocal"
                                        : "one-directional"
                                    }`}
                                  >
                                    {reciprocal
                                      ? "Reciprocal"
                                      : "Inbound only"}
                                  </span>

                                  <strong>
                                    {source.title}
                                  </strong>

                                  <p>
                                    {normalize(
                                      source.recordType,
                                    )}{" "}
                                    ·{" "}
                                    {normalize(
                                      source.jurisdiction,
                                    )}
                                  </p>
                                </div>

                                <Link
                                  href={`/governance-library/${source.slug}`}
                                >
                                  View →
                                </Link>
                              </div>
                            );
                          },
                        )}

                        {selectedInbound.length ===
                        0 ? (
                          <div className="emptyState compact">
                            No other records currently
                            reference this source.
                          </div>
                        ) : null}
                      </div>
                    </article>
                  </div>
                </>
              ) : (
                <div className="deskEmpty">
                  <div className="deskSeal">GR</div>

                  <p className="eyebrow">
                    SELECT A GOVERNANCE RECORD
                  </p>

                  <h3>
                    Inspect the structure of a documented
                    relationship.
                  </h3>

                  <p>
                    Choose a record from the directory to
                    view its resolved titles, inbound
                    references, reciprocal links, and
                    unresolved relationship declarations.
                  </p>
                </div>
              )}
            </section>
          </div>
        </section>

        <section className="integritySection">
          <div className="sectionHeading">
            <div>
              <p className="eyebrow">
                GRAPH INTEGRITY
              </p>

              <h2>
                Validate the relationship structure.
              </h2>
            </div>

            <p>
              Integrity checks identify structural
              conditions in the current record graph. They
              do not determine whether a relationship is
              legally correct or substantively sufficient.
            </p>
          </div>

          <div className="integrityGrid">
            <article>
              <span>Resolved links</span>
              <strong>
                {relationships.length -
                  unresolvedRelationships.length}
              </strong>
              <p>
                Declared relationships resolving to an
                existing governance record.
              </p>
            </article>

            <article>
              <span>Reciprocal links</span>
              <strong>
                {reciprocalRelationships.length}
              </strong>
              <p>
                Relationships declared by both connected
                records.
              </p>
            </article>

            <article>
              <span>One-directional links</span>
              <strong>
                {oneDirectionalRelationships.length}
              </strong>
              <p>
                Valid links declared by only one side of
                the relationship.
              </p>
            </article>

            <article>
              <span>Unresolved links</span>
              <strong>
                {unresolvedRelationships.length}
              </strong>
              <p>
                Referenced slugs that do not resolve to a
                current record.
              </p>
            </article>

            <article>
              <span>Isolated records</span>
              <strong>{isolatedRecords.length}</strong>
              <p>
                Records with no inbound or outbound
                relationship declarations.
              </p>
            </article>
          </div>
        </section>

        <section className="boundarySection">
          <div className="boundarySeal">
            <span>RB</span>
            <small>Relationship boundary</small>
          </div>

          <p className="eyebrow gold">
            GOVERNANCE RELATIONSHIP BOUNDARY
          </p>

          <h2>
            A documented relationship does not create
            equivalent authority.
          </h2>

          <p>
            Governance records may be connected because
            they share concepts, support implementation,
            address related risks, operate in the same
            lifecycle, or inform a common governance
            problem. A relationship does not by itself
            establish legal hierarchy, incorporation,
            conformity, applicability, substituted
            compliance, certification, or permission to
            execute.
          </p>

          <div className="boundaryGrid">
            <article>
              <span>RELATIONSHIPS CAN SHOW</span>
              <strong>
                Documented connections, graph structure,
                reciprocal references, and related
                governance domains
              </strong>
            </article>

            <article>
              <span>RELATIONSHIPS CANNOT PROVE</span>
              <strong>
                Equivalence, legal precedence,
                applicability, conformity, compliance, or
                execution authority
              </strong>
            </article>

            <article>
              <span>GOVERNED USE REQUIRES</span>
              <strong>
                Source review, competent interpretation,
                evidence mapping, applicability
                determination, and controlled execution
              </strong>
            </article>
          </div>

          <div className="boundaryActions">
            <Link
              href="/governance-library/compare"
              className="secondaryAction"
            >
              Open Comparison
            </Link>

            <Link
              href="/governance-library/crosswalks"
              className="secondaryAction"
            >
              Open Crosswalks
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
        .relationshipsPage {
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
          width: min(1520px, calc(100% - 40px));
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
        .recordAction,
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

        .secondaryAction,
        .recordAction {
          color: #c2d5dd;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(0, 0, 0, 0.18);
        }

        .topbarLink:hover,
        .topbarAction:hover,
        .recordAction:hover,
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
          font-size: clamp(52px, 6.2vw, 90px);
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

        .heroMetrics article,
        .relationshipSummary article {
          padding: 18px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 16px;
          background: rgba(6, 20, 32, 0.58);
        }

        .heroMetrics span,
        .relationshipSummary span {
          display: block;
          color: #f0d28f;
          font: 700 27px Georgia, serif;
        }

        .heroMetrics small,
        .relationshipSummary small {
          display: block;
          margin-top: 5px;
          color: #788f9a;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.09em;
          text-transform: uppercase;
        }

        .controlSection,
        .relationshipSection,
        .integritySection {
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

        .filterPanel {
          padding: 19px;
          display: grid;
          grid-template-columns:
            minmax(300px, 1.5fr)
            repeat(3, minmax(170px, 0.75fr))
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

        .relationshipGrid {
          display: grid;
          grid-template-columns: 390px minmax(0, 1fr);
          gap: 18px;
          align-items: start;
        }

        .recordDirectory,
        .relationshipDesk {
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

        .recordDirectory {
          position: sticky;
          top: 20px;
          padding: 18px;
        }

        .directoryHeading {
          padding-bottom: 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(255, 255, 255, 0.07);
        }

        .directoryHeading span {
          color: #77dce9;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .directoryHeading strong {
          color: #efcc82;
          font: 700 21px Georgia, serif;
        }

        .recordList {
          max-height: 760px;
          margin-top: 15px;
          padding-right: 3px;
          display: grid;
          gap: 9px;
          overflow-y: auto;
        }

        .recordButton {
          width: 100%;
          padding: 13px;
          display: grid;
          grid-template-columns: 39px minmax(0, 1fr) auto;
          align-items: center;
          gap: 11px;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 13px;
          color: inherit;
          background: rgba(0, 0, 0, 0.15);
          cursor: pointer;
          text-align: left;
          transition:
            transform 0.2s,
            border-color 0.2s,
            background 0.2s;
        }

        .recordButton:hover,
        .recordButton.active {
          transform: translateX(3px);
          border-color: rgba(99, 230, 255, 0.28);
          background: rgba(99, 230, 255, 0.05);
        }

        .recordIndex {
          width: 39px;
          height: 39px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(99, 230, 255, 0.16);
          border-radius: 10px;
          color: #6bd9eb;
          font-size: 8px;
          font-weight: 900;
        }

        .recordIdentity {
          min-width: 0;
          display: grid;
          gap: 4px;
        }

        .recordIdentity small {
          color: #69dcea;
          font-size: 7px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .recordIdentity strong {
          overflow: hidden;
          color: #dce8ec;
          font-size: 11px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .recordIdentity > span {
          color: #728995;
          font-size: 8px;
        }

        .recordArrow {
          color: #75909b;
          font-size: 14px;
        }

        .relationshipDesk {
          min-height: 640px;
          padding: 26px;
        }

        .deskHeader {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 18px;
        }

        .deskHeader h3,
        .deskEmpty h3 {
          margin: 8px 0 0;
          font-size: clamp(31px, 3.4vw, 49px);
          line-height: 1;
        }

        .deskHeader > div > span {
          display: block;
          margin-top: 9px;
          color: #8097a1;
          font-size: 9px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .recordSummary {
          margin: 22px 0 0;
          color: #99adb6;
          font-size: 14px;
          line-height: 1.72;
        }

        .relationshipSummary {
          margin-top: 22px;
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 10px;
        }

        .relationshipSummary article {
          text-align: center;
        }

        .connectionColumns {
          margin-top: 18px;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
        }

        .connectionCard {
          padding: 19px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 18px;
          background: rgba(0, 0, 0, 0.14);
        }

        .cardHeading {
          padding-bottom: 14px;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 15px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }

        .cardHeading span {
          color: #69dcea;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .cardHeading strong {
          display: block;
          margin-top: 5px;
          color: #dce8ec;
          font-size: 12px;
        }

        .cardHeading b {
          color: #efcc82;
          font: 700 22px Georgia, serif;
        }

        .connectionList {
          margin-top: 13px;
          display: grid;
          gap: 9px;
        }

        .connectionItem {
          padding: 13px;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 14px;
          border: 1px solid rgba(255, 255, 255, 0.055);
          border-radius: 13px;
          background: rgba(0, 0, 0, 0.14);
        }

        .connectionItem > div {
          min-width: 0;
        }

        .connectionItem strong {
          display: block;
          margin-top: 8px;
          color: #dce7eb;
          font-size: 12px;
          line-height: 1.35;
        }

        .connectionItem p {
          margin: 6px 0 0;
          color: #778e99;
          font-size: 9px;
          line-height: 1.45;
        }

        .connectionItem a {
          flex: 0 0 auto;
          color: #efc978;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.05em;
          text-decoration: none;
          text-transform: uppercase;
        }

        .integrityBadge {
          display: inline-flex;
          padding: 5px 7px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 999px;
          font-size: 7px;
          font-weight: 900;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .integrityBadge.reciprocal {
          color: #88efc1;
          border-color: rgba(114, 230, 178, 0.25);
          background: rgba(114, 230, 178, 0.06);
        }

        .integrityBadge.one-directional,
        .integrityBadge.inbound-only {
          color: #f1ca75;
          border-color: rgba(239, 199, 110, 0.25);
          background: rgba(239, 199, 110, 0.06);
        }

        .integrityBadge.unresolved {
          color: #ef9e79;
          border-color: rgba(239, 158, 121, 0.25);
          background: rgba(239, 158, 121, 0.06);
        }

        .missingMark {
          color: #ef9e79;
          font-size: 8px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .deskEmpty {
          min-height: 585px;
          display: grid;
          place-items: center;
          align-content: center;
          text-align: center;
        }

        .deskSeal {
          width: 80px;
          height: 80px;
          margin-bottom: 22px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(255, 198, 82, 0.25);
          border-radius: 50%;
          color: #efc66f;
          font: 700 23px Georgia, serif;
        }

        .deskEmpty h3 {
          max-width: 720px;
        }

        .deskEmpty > p:last-child {
          max-width: 680px;
          margin: 18px auto 0;
          color: #8298a3;
          font-size: 13px;
          line-height: 1.65;
        }

        .emptyState {
          padding: 35px 20px;
          color: #748b96;
          font-size: 11px;
          line-height: 1.5;
          text-align: center;
        }

        .emptyState.compact {
          padding: 22px 14px;
          border: 1px dashed rgba(255, 255, 255, 0.09);
          border-radius: 12px;
        }

        .integrityGrid {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 12px;
        }

        .integrityGrid article {
          padding: 22px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 18px;
          background: rgba(6, 20, 32, 0.68);
        }

        .integrityGrid span {
          color: #77dce9;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .integrityGrid strong {
          display: block;
          margin-top: 10px;
          color: #efcd85;
          font: 700 38px Georgia, serif;
        }

        .integrityGrid p {
          margin: 10px 0 0;
          color: #859ca6;
          font-size: 11px;
          line-height: 1.55;
        }

        .boundarySection {
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

        .boundarySection h2 {
          max-width: 1040px;
          margin: 14px auto 0;
        }

        .boundarySection > p:not(.eyebrow) {
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

        @media (max-width: 1300px) {
          .filterPanel {
            grid-template-columns: repeat(
              3,
              minmax(0, 1fr)
            );
          }

          .searchField {
            grid-column: span 2;
          }

          .integrityGrid {
            grid-template-columns: repeat(
              3,
              minmax(0, 1fr)
            );
          }
        }

        @media (max-width: 1080px) {
          .heroMetrics {
            grid-template-columns: repeat(
              3,
              minmax(0, 1fr)
            );
          }

          .relationshipGrid {
            grid-template-columns: 330px minmax(0, 1fr);
          }

          .connectionColumns {
            grid-template-columns: 1fr;
          }

          .relationshipSummary {
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
          .relationshipGrid {
            grid-template-columns: 1fr;
          }

          .recordDirectory {
            position: static;
          }

          .recordList {
            max-height: none;
            grid-template-columns: repeat(
              2,
              minmax(0, 1fr)
            );
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
          .recordList,
          .relationshipSummary,
          .integrityGrid {
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

          .resultBar,
          .deskHeader {
            align-items: flex-start;
            flex-direction: column;
          }

          .relationshipDesk,
          .recordDirectory,
          .boundarySection {
            padding: 21px;
          }

          .recordAction {
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
