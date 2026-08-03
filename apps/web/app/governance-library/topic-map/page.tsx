"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  governanceLibraryRecords,
} from "../../../lib/governance-library";
import type {
  GovernanceLibraryRecord,
} from "../../../lib/governance-library/records-foundational";

type TopicDomain =
  | "AI Governance"
  | "Environmental Integrity"
  | "Law & Regulation"
  | "Standards & Codes"
  | "Evidence & Execution"
  | "Academy & Readiness"
  | "Cross-Institutional";

type TopicSummary = {
  topic: string;
  count: number;
  records: GovernanceLibraryRecord[];
  publishers: string[];
  recordTypes: string[];
  domain: TopicDomain;
  relatedTopics: Array<{
    topic: string;
    count: number;
  }>;
};

const domains: Array<"All domains" | TopicDomain> = [
  "All domains",
  "AI Governance",
  "Environmental Integrity",
  "Law & Regulation",
  "Standards & Codes",
  "Evidence & Execution",
  "Academy & Readiness",
  "Cross-Institutional",
];

const domainDescriptions: Record<TopicDomain, string> = {
  "AI Governance":
    "Models, agents, systems, decision routes, AI authority, lifecycle controls, human oversight, and consequential execution.",
  "Environmental Integrity":
    "Air, water, land, buildings, HVAC, pollution, atmospheric records, environmental evidence, intervention, and verified outcome.",
  "Law & Regulation":
    "Statutes, regulations, jurisdiction, applicability, enforcement, public policy, delegated authority, and legal modernization.",
  "Standards & Codes":
    "Consensus standards, model codes, technical methods, accreditation, incorporation by reference, and adoption pathways.",
  "Evidence & Execution":
    "Records, continuity, admissibility, binding, commitment, execution, artifacts, verification, and outcome preservation.",
  "Academy & Readiness":
    "Learning pathways, simulations, assessments, credentials, guided review, readiness, and institutional literacy.",
  "Cross-Institutional":
    "Topics that materially connect multiple TA-14 divisions and cannot be reduced to a single institutional domain.",
};

const topicSignals: Array<{
  domain: TopicDomain;
  signals: string[];
}> = [
  {
    domain: "Environmental Integrity",
    signals: [
      "air",
      "water",
      "environment",
      "pollution",
      "atmosphere",
      "hvac",
      "building",
      "refriger",
      "ventilation",
      "indoor",
      "soil",
      "waste",
      "emission",
      "climate",
      "drinking",
      "contamination",
      "remediation",
      "particulate",
      "sensor",
    ],
  },
  {
    domain: "Law & Regulation",
    signals: [
      "law",
      "act",
      "regulation",
      "legal",
      "jurisdiction",
      "applicability",
      "enforcement",
      "authority",
      "statute",
      "rule",
      "policy",
      "rights",
      "obligation",
      "compliance",
    ],
  },
  {
    domain: "Standards & Codes",
    signals: [
      "standard",
      "code",
      "iso",
      "ansi",
      "ashrae",
      "ieee",
      "nfpa",
      "method",
      "certification",
      "accreditation",
      "conformity",
      "testing",
      "measurement",
    ],
  },
  {
    domain: "Evidence & Execution",
    signals: [
      "evidence",
      "record",
      "continuity",
      "admissibility",
      "binding",
      "commit",
      "execution",
      "outcome",
      "artifact",
      "verification",
      "traceability",
      "audit",
      "provenance",
      "integrity",
    ],
  },
  {
    domain: "Academy & Readiness",
    signals: [
      "academy",
      "learning",
      "training",
      "assessment",
      "credential",
      "readiness",
      "simulation",
      "education",
      "competency",
      "instructor",
      "accreditation",
    ],
  },
  {
    domain: "AI Governance",
    signals: [
      "ai",
      "artificial intelligence",
      "model",
      "agent",
      "algorithm",
      "machine learning",
      "automated",
      "human oversight",
      "bias",
      "transparency",
      "risk management",
      "lifecycle",
      "provider",
      "deployer",
    ],
  },
];

function classifyTopic(
  topic: string,
  records: GovernanceLibraryRecord[],
): TopicDomain {
  const searchable = [
    topic,
    ...records.map((record) => record.title),
    ...records.map((record) => record.recordType),
    ...records.map((record) => record.publisher),
  ]
    .join(" ")
    .toLowerCase();

  const scores = topicSignals.map(({ domain, signals }) => ({
    domain,
    score: signals.reduce(
      (total, signal) => total + (searchable.includes(signal) ? 1 : 0),
      0,
    ),
  }));

  scores.sort((a, b) => b.score - a.score);

  if (scores[0].score === 0) {
    return "Cross-Institutional";
  }

  if (
    scores.length > 1 &&
    scores[0].score === scores[1].score &&
    scores[0].score > 0
  ) {
    return "Cross-Institutional";
  }

  return scores[0].domain;
}

function makeTopicMap(): TopicSummary[] {
  const map = new Map<string, GovernanceLibraryRecord[]>();

  governanceLibraryRecords.forEach((record) => {
    record.keyTopics.forEach((topic) => {
      if (!map.has(topic)) {
        map.set(topic, []);
      }

      map.get(topic)!.push(record);
    });
  });

  return [...map.entries()]
    .map(([topic, records]) => {
      const relationMap = new Map<string, number>();

      records.forEach((record) => {
        record.keyTopics.forEach((relatedTopic) => {
          if (relatedTopic === topic) {
            return;
          }

          relationMap.set(
            relatedTopic,
            (relationMap.get(relatedTopic) ?? 0) + 1,
          );
        });
      });

      return {
        topic,
        count: records.length,
        records,
        publishers: Array.from(
          new Set(records.map((record) => record.publisher)),
        ).sort(),
        recordTypes: Array.from(
          new Set(records.map((record) => record.recordType)),
        ).sort(),
        domain: classifyTopic(topic, records),
        relatedTopics: [...relationMap.entries()]
          .map(([relatedTopic, count]) => ({
            topic: relatedTopic,
            count,
          }))
          .sort((a, b) => b.count - a.count || a.topic.localeCompare(b.topic))
          .slice(0, 12),
      };
    })
    .sort((a, b) => b.count - a.count || a.topic.localeCompare(b.topic));
}

function domainCode(domain: TopicDomain): string {
  const codes: Record<TopicDomain, string> = {
    "AI Governance": "AI",
    "Environmental Integrity": "EI",
    "Law & Regulation": "LAW",
    "Standards & Codes": "STD",
    "Evidence & Execution": "EXE",
    "Academy & Readiness": "AC",
    "Cross-Institutional": "X",
  };

  return codes[domain];
}

function domainClass(domain: TopicDomain): string {
  return domain
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function GovernanceLibraryTopicMapPage() {
  const topics = useMemo(() => makeTopicMap(), []);
  const [query, setQuery] = useState("");
  const [domain, setDomain] = useState<"All domains" | TopicDomain>(
    "All domains",
  );
  const [minimumRecords, setMinimumRecords] = useState("1");
  const [selectedTopic, setSelectedTopic] = useState(
    topics[0]?.topic ?? "",
  );
  const [sort, setSort] = useState<"Most connected" | "Alphabetical">(
    "Most connected",
  );

  const filteredTopics = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const minimum = Number.parseInt(minimumRecords, 10) || 1;

    const result = topics.filter((topic) => {
      const queryMatches =
        normalized.length === 0 ||
        [
          topic.topic,
          topic.domain,
          ...topic.publishers,
          ...topic.recordTypes,
          ...topic.records.map((record) => record.title),
          ...topic.relatedTopics.map((related) => related.topic),
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalized);

      const domainMatches =
        domain === "All domains" || topic.domain === domain;

      return queryMatches && domainMatches && topic.count >= minimum;
    });

    return [...result].sort((a, b) => {
      if (sort === "Alphabetical") {
        return a.topic.localeCompare(b.topic);
      }

      return b.count - a.count || a.topic.localeCompare(b.topic);
    });
  }, [domain, minimumRecords, query, sort, topics]);

  const selected =
    topics.find((topic) => topic.topic === selectedTopic) ??
    filteredTopics[0] ??
    topics[0];

  const metrics = useMemo(() => {
    const publisherCount = new Set(
      topics.flatMap((topic) => topic.publishers),
    ).size;
    const typeCount = new Set(
      topics.flatMap((topic) => topic.recordTypes),
    ).size;
    const connectedRecords = new Set(
      topics.flatMap((topic) => topic.records.map((record) => record.slug)),
    ).size;

    return {
      topics: topics.length,
      connectedRecords,
      publisherCount,
      typeCount,
      relationships: topics.reduce(
        (total, topic) => total + topic.relatedTopics.length,
        0,
      ),
    };
  }, [topics]);

  function clearFilters() {
    setQuery("");
    setDomain("All domains");
    setMinimumRecords("1");
    setSort("Most connected");
  }

  return (
    <main className="topicMapPage">
      <div className="background" aria-hidden="true">
        <div className="grid" />
        <div className="glow glowOne" />
        <div className="glow glowTwo" />
        <div className="route routeOne" />
        <div className="route routeTwo" />
      </div>

      <div className="pageShell">
        <div className="topbar">
          <Link href="/governance-library" className="topbarLink">
            ← Governance Library
          </Link>

          <div className="topbarStatus">
            <span />
            Institutional topic relationship system
          </div>

          <Link href="/governance-library/topics" className="topbarAction">
            Open Topic Index →
          </Link>
        </div>

        <header className="hero">
          <div className="heroSeal">
            <span>TM</span>
            <small>TA-14</small>
          </div>

          <p className="eyebrow">TA-14 AUTHORITY GOVERNANCE INSTITUTION</p>

          <h1>
            Institutional Governance
            <span> Topic Map</span>
          </h1>

          <p className="lead">
            Inspect how laws, regulations, standards, frameworks, evidence,
            authorities, environmental systems, AI governance, Academy pathways,
            and execution records connect through shared governance topics.
          </p>

          <div className="heroMetrics">
            <article>
              <span>{metrics.topics}</span>
              <small>Governance topics</small>
            </article>
            <article>
              <span>{metrics.connectedRecords}</span>
              <small>Connected records</small>
            </article>
            <article>
              <span>{metrics.publisherCount}</span>
              <small>Publishers represented</small>
            </article>
            <article>
              <span>{metrics.typeCount}</span>
              <small>Record types</small>
            </article>
            <article>
              <span>{metrics.relationships}</span>
              <small>Mapped relationships</small>
            </article>
          </div>
        </header>

        <section className="domainSection">
          <div className="sectionHeading">
            <div>
              <p className="eyebrow">THE FOUR-DOOR INSTITUTIONAL MAP</p>
              <h2>Every topic belongs somewhere. Many topics cross boundaries.</h2>
            </div>
            <p>
              Topic classification supports navigation; it does not erase the
              distinctions between law, standards, environmental evidence, AI
              governance, Academy instruction, and executable authority.
            </p>
          </div>

          <div className="domainGrid">
            {domains
              .filter((item): item is TopicDomain => item !== "All domains")
              .map((item) => {
                const count = topics.filter(
                  (topic) => topic.domain === item,
                ).length;

                return (
                  <button
                    type="button"
                    key={item}
                    className={`domainCard ${domainClass(item)} ${
                      domain === item ? "active" : ""
                    }`}
                    onClick={() => setDomain(item)}
                  >
                    <span>{domainCode(item)}</span>
                    <strong>{item}</strong>
                    <p>{domainDescriptions[item]}</p>
                    <small>{count} mapped topics</small>
                  </button>
                );
              })}
          </div>
        </section>

        <section className="workspaceSection">
          <div className="sectionHeading">
            <div>
              <p className="eyebrow">TOPIC RESOLUTION WORKSPACE</p>
              <h2>Find the topic. Inspect its records. Follow its relationships.</h2>
            </div>
            <p>
              Search by topic, publisher, record title, record type, institutional
              domain, or connected concept. Then inspect the records and topics
              that give the selected concept its actual governance meaning.
            </p>
          </div>

          <div className="filterPanel">
            <label className="searchField">
              Search topic relationships
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search air, authority, execution, AI, standards..."
              />
            </label>

            <label>
              Institutional domain
              <select
                value={domain}
                onChange={(event) =>
                  setDomain(event.target.value as "All domains" | TopicDomain)
                }
              >
                {domains.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>

            <label>
              Minimum connected records
              <select
                value={minimumRecords}
                onChange={(event) => setMinimumRecords(event.target.value)}
              >
                {["1", "2", "3", "5", "10"].map((item) => (
                  <option key={item} value={item}>
                    {item}+
                  </option>
                ))}
              </select>
            </label>

            <label>
              Sort topics
              <select
                value={sort}
                onChange={(event) =>
                  setSort(
                    event.target.value as "Most connected" | "Alphabetical",
                  )
                }
              >
                <option>Most connected</option>
                <option>Alphabetical</option>
              </select>
            </label>

            <button type="button" className="clearButton" onClick={clearFilters}>
              Clear filters
            </button>
          </div>

          <div className="workspaceGrid">
            <aside className="topicIndex">
              <div className="indexHeading">
                <div>
                  <span>Topic map index</span>
                  <strong>{filteredTopics.length}</strong>
                </div>
                <small>
                  Select a topic to inspect connected records, publishers, record
                  types, and co-occurring governance concepts.
                </small>
              </div>

              <div className="topicList">
                {filteredTopics.map((topic, index) => (
                  <button
                    type="button"
                    key={topic.topic}
                    className={
                      selected?.topic === topic.topic
                        ? "topicButton active"
                        : "topicButton"
                    }
                    onClick={() => setSelectedTopic(topic.topic)}
                  >
                    <span className="topicNumber">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="topicIdentity">
                      <small>{topic.domain}</small>
                      <strong>{topic.topic}</strong>
                      <em>
                        {topic.count} record{topic.count === 1 ? "" : "s"} ·{" "}
                        {topic.relatedTopics.length} relationships
                      </em>
                    </span>
                    <span className="topicCode">{domainCode(topic.domain)}</span>
                  </button>
                ))}

                {filteredTopics.length === 0 ? (
                  <div className="emptyState">
                    <span>00</span>
                    <strong>No mapped topic matched.</strong>
                    <p>Broaden the search or clear the active filters.</p>
                  </div>
                ) : null}
              </div>
            </aside>

            {selected ? (
              <section className="topicRecord">
                <div className="recordHeader">
                  <div className="recordSeal">
                    {domainCode(selected.domain)}
                  </div>
                  <div>
                    <p>{selected.domain}</p>
                    <h3>{selected.topic}</h3>
                    <span>
                      A governance topic connected to {selected.count} preserved
                      library record{selected.count === 1 ? "" : "s"}.
                    </span>
                  </div>
                </div>

                <div className="recordMetrics">
                  <article>
                    <span>Connected records</span>
                    <strong>{selected.count}</strong>
                  </article>
                  <article>
                    <span>Publishers</span>
                    <strong>{selected.publishers.length}</strong>
                  </article>
                  <article>
                    <span>Record types</span>
                    <strong>{selected.recordTypes.length}</strong>
                  </article>
                  <article>
                    <span>Related topics</span>
                    <strong>{selected.relatedTopics.length}</strong>
                  </article>
                </div>

                <article className="boundaryCard">
                  <span>TOPIC CLASSIFICATION BOUNDARY</span>
                  <strong>{domainDescriptions[selected.domain]}</strong>
                  <p>
                    Topic membership supports discovery and comparison. It does
                    not independently prove legal applicability, current adoption,
                    authority, evidence sufficiency, conformity, or permission to
                    execute.
                  </p>
                </article>

                <div className="recordColumns">
                  <article className="recordCard">
                    <div className="cardHeading">
                      <span>Publishers represented</span>
                      <strong>{selected.publishers.length}</strong>
                    </div>
                    <div className="tagGrid">
                      {selected.publishers.map((publisher) => (
                        <span key={publisher}>{publisher}</span>
                      ))}
                    </div>
                  </article>

                  <article className="recordCard">
                    <div className="cardHeading">
                      <span>Record types represented</span>
                      <strong>{selected.recordTypes.length}</strong>
                    </div>
                    <div className="tagGrid">
                      {selected.recordTypes.map((recordType) => (
                        <span key={recordType}>{recordType}</span>
                      ))}
                    </div>
                  </article>
                </div>

                <article className="relatedCard">
                  <div className="cardHeading">
                    <span>Related governance topics</span>
                    <strong>{selected.relatedTopics.length}</strong>
                  </div>
                  <div className="relatedGrid">
                    {selected.relatedTopics.map((related) => (
                      <button
                        type="button"
                        key={related.topic}
                        onClick={() => {
                          setSelectedTopic(related.topic);
                          setQuery("");
                          setDomain("All domains");
                          setMinimumRecords("1");
                        }}
                      >
                        <span>{related.count}</span>
                        <strong>{related.topic}</strong>
                        <small>shared record connections</small>
                      </button>
                    ))}
                  </div>
                </article>

                <article className="connectedRecords">
                  <div className="cardHeading">
                    <span>Connected governed records</span>
                    <strong>{selected.records.length}</strong>
                  </div>
                  <div className="recordList">
                    {selected.records.map((record, index) => (
                      <Link
                        href={`/governance-library/${record.slug}`}
                        key={record.slug}
                      >
                        <span>{String(index + 1).padStart(2, "0")}</span>
                        <div>
                          <small>
                            {record.recordType} · {record.publisher}
                          </small>
                          <strong>{record.title}</strong>
                          <p>
                            Open the governed record to inspect its source,
                            authority, scope, topics, relationships, and execution
                            boundary.
                          </p>
                        </div>
                        <b>↗</b>
                      </Link>
                    ))}
                  </div>
                </article>

                <div className="recordActions">
                  <Link href="/governance-library/topics" className="secondaryAction">
                    Open Topic Index
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
                    Resolve Applicability →
                  </Link>
                </div>
              </section>
            ) : null}
          </div>
        </section>

        <section className="methodSection">
          <div className="sectionHeading">
            <div>
              <p className="eyebrow">TOPIC RESOLUTION METHOD</p>
              <h2>A topic is an entry point—not a final authority determination.</h2>
            </div>
            <p>
              TA-14 preserves the path from a concept to the actual instrument,
              publisher, jurisdiction, version, evidence duty, authority, and
              governed consequence.
            </p>
          </div>

          <div className="methodGrid">
            {[
              [
                "01",
                "Name the topic",
                "Use the precise governance, environmental, legal, technical, or execution concept being investigated.",
              ],
              [
                "02",
                "Find the records",
                "Identify the laws, regulations, standards, frameworks, methods, records, and proposals connected to it.",
              ],
              [
                "03",
                "Separate instrument types",
                "Do not treat statutes, rules, standards, guidance, methods, and TA-14 proposals as equivalent authority.",
              ],
              [
                "04",
                "Resolve publisher",
                "Preserve who issued the instrument and what authority or institutional role that publisher actually holds.",
              ],
              [
                "05",
                "Resolve jurisdiction",
                "Determine territory, sector, subject, activity, role, adoption, contract, and temporal reach.",
              ],
              [
                "06",
                "Inspect evidence duty",
                "Identify what records, measurements, controls, methods, findings, and outcomes the topic requires.",
              ],
              [
                "07",
                "Determine applicability",
                "Issue a bounded finding, preserve unresolved facts, and HOLD when controlling facts are missing.",
              ],
              [
                "08",
                "Bind execution",
                "Translate the resolved topic into ALLOW, HOLD, DENY, or ESCALATE conditions before consequence occurs.",
              ],
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
          <div className="sectionHeading">
            <div>
              <p className="eyebrow">TOPIC-MAP FAILURE MODES</p>
              <h2>Navigation fails when a shared word is mistaken for shared authority.</h2>
            </div>
            <p>
              Two records may discuss the same topic while imposing different
              duties, using different definitions, applying in different places,
              or carrying entirely different legal and technical force.
            </p>
          </div>

          <div className="failureGrid">
            {[
              [
                "Terminology collision",
                "The same word carries different definitions across law, standards, science, policy, and technical practice.",
              ],
              [
                "Authority collapse",
                "A topic shared by a law and voluntary standard is treated as though both instruments carry equal force.",
              ],
              [
                "Jurisdiction drift",
                "A relevant topic is assumed to apply despite unresolved territory, role, sector, adoption, or contractual scope.",
              ],
              [
                "Version substitution",
                "A current topic summary silently replaces the older edition or rule that actually controls the matter.",
              ],
              [
                "Evidence flattening",
                "Different measurements, records, methods, observations, and outcome evidence are collapsed into one generic category.",
              ],
              [
                "Proposal confusion",
                "A TA-14 proposal or developing instrument is presented as enacted law, adopted code, or published consensus standard.",
              ],
              [
                "Execution leap",
                "Topic relevance is treated as permission to act without resolving authority, admissibility, binding, and limits.",
              ],
              [
                "Outcome omission",
                "The topic is mapped to policy or process but not to evidence showing what actually happened after intervention.",
              ],
            ].map(([title, text], index) => (
              <article key={title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{title}</strong>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="academySection">
          <div className="academySeal">
            <small>TA-14</small>
            <strong>ACADEMY</strong>
            <span>TOPIC & RELATIONSHIP LITERACY</span>
          </div>

          <div className="academyCopy">
            <p className="eyebrow">THE ACADEMY INSIDE THE TOPIC MAP</p>
            <h2>Learn why related records are connected—and why they remain distinct.</h2>
            <p>
              The Academy teaches learners how to move from a broad concept to
              official instruments, controlling authority, evidence requirements,
              jurisdiction, applicability, execution conditions, and verified
              outcomes without overstating what the map proves.
            </p>

            <div className="academyGrid">
              {[
                [
                  "01",
                  "Topic literacy",
                  "Define the concept and identify competing meanings across domains.",
                ],
                [
                  "02",
                  "Instrument literacy",
                  "Separate law, regulation, standard, code, framework, guidance, method, and proposal.",
                ],
                [
                  "03",
                  "Authority literacy",
                  "Understand who issued each record and what power the issuer possesses.",
                ],
                [
                  "04",
                  "Relationship literacy",
                  "Inspect incorporation, adoption, delegation, cross-reference, and evidentiary support.",
                ],
                [
                  "05",
                  "Applicability literacy",
                  "Resolve jurisdiction, role, activity, version, exclusion, and temporal reach.",
                ],
                [
                  "06",
                  "Execution literacy",
                  "Translate a resolved governance topic into bounded action and preserved outcome proof.",
                ],
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
                Enter TA-14 Academy →
              </Link>
              <Link
                href="/governance-library/applicability"
                className="secondaryAction"
              >
                Practice Applicability
              </Link>
            </div>
          </div>
        </section>

        <section className="boundarySection">
          <div className="boundarySealLarge">TM</div>
          <p className="eyebrow gold">TOPIC MAP BOUNDARY</p>
          <h2>A relationship is not authority. A topic match is not applicability.</h2>
          <p>
            This page provides institutional navigation and relationship mapping.
            It does not reproduce official source text, determine legal advice,
            establish certification, prove conformity, resolve every jurisdiction,
            or authorize execution. Official instruments, adopted editions,
            qualified evidence, current authority, and governed review remain
            controlling.
          </p>

          <div className="boundaryActions">
            <Link href="/governance-library/sources" className="secondaryAction">
              Verify Official Sources
            </Link>
            <Link
              href="/governance-library/authorities"
              className="secondaryAction"
            >
              Resolve Authority
            </Link>
            <Link
              href="/governance-library/applicability"
              className="primaryAction"
            >
              Resolve Applicability →
            </Link>
          </div>
        </section>
      </div>

      <style jsx>{`
        :global(*) {
          box-sizing: border-box;
        }

        :global(html) {
          background: #020812;
          scroll-behavior: smooth;
        }

        :global(body) {
          margin: 0;
          color: #f4f9fc;
          background: #020812;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system,
            BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        :global(a) {
          color: inherit;
        }

        .topicMapPage {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          isolation: isolate;
          background:
            radial-gradient(
              circle at 50% -8%,
              rgba(42, 145, 192, 0.16),
              transparent 34%
            ),
            linear-gradient(180deg, #04101b, #020812 52%, #01050a);
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
          opacity: 0.13;
          background-image:
            linear-gradient(
              rgba(110, 222, 242, 0.18) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(110, 222, 242, 0.18) 1px,
              transparent 1px
            );
          background-size: 62px 62px;
          mask-image: linear-gradient(to bottom, black, transparent 90%);
        }

        .glow {
          position: absolute;
          width: 760px;
          height: 760px;
          border-radius: 50%;
          filter: blur(110px);
          opacity: 0.13;
        }

        .glowOne {
          left: -280px;
          top: 15%;
          background: #0b88b8;
        }

        .glowTwo {
          right: -280px;
          top: 50%;
          background: #b08028;
        }

        .route {
          position: absolute;
          width: 75vw;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(105, 225, 244, 0.6),
            rgba(244, 188, 76, 0.48),
            transparent
          );
        }

        .route::after {
          content: "";
          position: absolute;
          left: 10%;
          top: -3px;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #fff0a4;
          box-shadow: 0 0 18px rgba(255, 218, 106, 0.9);
          animation: packet 8s linear infinite;
        }

        .routeOne {
          left: -12%;
          top: 24%;
          transform: rotate(-8deg);
        }

        .routeTwo {
          right: -16%;
          top: 72%;
          transform: rotate(9deg);
        }

        .pageShell {
          width: min(1500px, calc(100% - 40px));
          margin: 0 auto;
          padding: 24px 0 90px;
          position: relative;
          z-index: 2;
        }

        .topbar {
          padding: 12px;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 16px;
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 18px;
          background: linear-gradient(
            180deg,
            rgba(8, 27, 43, 0.9),
            rgba(4, 15, 26, 0.82)
          );
          box-shadow: 0 18px 48px rgba(0, 0, 0, 0.26);
          backdrop-filter: blur(16px);
        }

        .topbarLink,
        .topbarAction,
        .primaryAction,
        .secondaryAction,
        .academyAction {
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
            transform 0.2s,
            border-color 0.2s,
            box-shadow 0.2s;
        }

        .topbarLink,
        .secondaryAction {
          color: #c2d5dd;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(0, 0, 0, 0.18);
        }

        .topbarLink {
          justify-self: start;
        }

        .topbarAction,
        .primaryAction {
          justify-self: end;
          color: #041920;
          border: 1px solid #a6f0fb;
          background: linear-gradient(135deg, #d8fbff, #75deee 64%, #36acc6);
        }

        .academyAction {
          color: #041711;
          border: 1px solid #a5f5c8;
          background: linear-gradient(135deg, #d8ffe8, #71e8a7 65%, #29925f);
        }

        .topbarLink:hover,
        .topbarAction:hover,
        .primaryAction:hover,
        .secondaryAction:hover,
        .academyAction:hover {
          transform: translateY(-2px);
        }

        .topbarStatus {
          display: flex;
          align-items: center;
          gap: 9px;
          color: #8ea5b0;
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
          box-shadow: 0 0 14px rgba(114, 230, 178, 0.88);
        }

        .hero {
          max-width: 1160px;
          margin: 0 auto;
          padding: 88px 0 78px;
          text-align: center;
        }

        .heroSeal {
          width: 108px;
          height: 108px;
          margin: 0 auto 28px;
          display: grid;
          place-items: center;
          align-content: center;
          gap: 3px;
          border: 1px solid rgba(255, 198, 82, 0.38);
          border-radius: 50%;
          background: rgba(4, 18, 30, 0.96);
          box-shadow: 0 0 62px rgba(255, 193, 64, 0.1);
        }

        .heroSeal span {
          color: #ffe3a0;
          font: 900 31px Georgia, serif;
        }

        .heroSeal small {
          color: #829aa5;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.17em;
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
          font-size: clamp(52px, 6.2vw, 92px);
          line-height: 0.94;
          letter-spacing: -0.055em;
        }

        .hero h1 span {
          display: block;
          color: #a9bdc6;
          font-style: italic;
          font-weight: 500;
        }

        .lead {
          max-width: 980px;
          margin: 27px auto 0;
          color: #afc1ca;
          font-size: 18px;
          line-height: 1.75;
        }

        .heroMetrics {
          margin-top: 37px;
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 12px;
        }

        .heroMetrics article {
          padding: 18px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 16px;
          background: rgba(6, 20, 32, 0.62);
        }

        .heroMetrics span {
          display: block;
          color: #f0d28f;
          font: 700 28px Georgia, serif;
        }

        .heroMetrics small {
          display: block;
          margin-top: 5px;
          color: #778e99;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.09em;
          text-transform: uppercase;
        }

        .domainSection,
        .workspaceSection,
        .methodSection,
        .failureSection,
        .academySection,
        .boundarySection {
          padding-top: 88px;
        }

        .sectionHeading {
          margin-bottom: 32px;
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          align-items: end;
          gap: 42px;
        }

        .sectionHeading h2,
        .academyCopy h2,
        .boundarySection h2 {
          margin: 11px 0 0;
          font-size: clamp(39px, 4.4vw, 65px);
          line-height: 0.99;
          letter-spacing: -0.048em;
        }

        .sectionHeading > p,
        .academyCopy > p,
        .boundarySection > p:not(.eyebrow) {
          margin: 0;
          color: #99adb7;
          font-size: 15px;
          line-height: 1.76;
        }

        .domainGrid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 13px;
        }

        .domainCard {
          min-height: 246px;
          padding: 22px;
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 19px;
          color: inherit;
          background: linear-gradient(
            145deg,
            rgba(10, 31, 46, 0.84),
            rgba(3, 14, 24, 0.94)
          );
          cursor: pointer;
          text-align: left;
          transition:
            transform 0.22s,
            border-color 0.22s,
            box-shadow 0.22s;
        }

        .domainCard:hover,
        .domainCard.active {
          transform: translateY(-5px);
          border-color: rgba(105, 226, 244, 0.42);
          box-shadow: 0 22px 46px rgba(0, 0, 0, 0.24);
        }

        .domainCard > span {
          width: 48px;
          height: 48px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(106, 226, 244, 0.28);
          border-radius: 12px;
          color: #7ce6f5;
          font-size: 10px;
          font-weight: 950;
        }

        .domainCard strong {
          display: block;
          margin-top: 25px;
          font: 700 20px Georgia, serif;
        }

        .domainCard p {
          margin: 11px 0 0;
          color: #879da7;
          font-size: 11px;
          line-height: 1.58;
        }

        .domainCard small {
          display: block;
          margin-top: 18px;
          color: #e8c878;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .filterPanel {
          padding: 18px;
          display: grid;
          grid-template-columns: minmax(0, 1fr) 220px 185px 185px auto;
          align-items: end;
          gap: 11px;
          border: 1px solid rgba(99, 230, 255, 0.12);
          border-radius: 21px;
          background: linear-gradient(
            145deg,
            rgba(9, 29, 44, 0.96),
            rgba(3, 13, 22, 0.98)
          );
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
          min-height: 47px;
          box-sizing: border-box;
          padding: 0 13px;
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
          background: #071520;
        }

        .clearButton {
          min-height: 47px;
          padding: 0 15px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 11px;
          color: #b6c8d0;
          background: rgba(0, 0, 0, 0.18);
          cursor: pointer;
          font-size: 8px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .workspaceGrid {
          margin-top: 17px;
          display: grid;
          grid-template-columns: 400px minmax(0, 1fr);
          gap: 17px;
          align-items: start;
        }

        .topicIndex,
        .topicRecord {
          border: 1px solid rgba(99, 230, 255, 0.12);
          border-radius: 24px;
          background: linear-gradient(
            145deg,
            rgba(9, 29, 44, 0.95),
            rgba(3, 13, 22, 0.98)
          );
        }

        .topicIndex {
          position: sticky;
          top: 20px;
          padding: 18px;
          max-height: calc(100vh - 40px);
          overflow: auto;
        }

        .indexHeading {
          padding: 4px 3px 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }

        .indexHeading div {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .indexHeading span {
          color: #70ddec;
          font-size: 8px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .indexHeading strong {
          color: #edca80;
          font: 700 17px Georgia, serif;
        }

        .indexHeading small {
          display: block;
          margin-top: 8px;
          color: #718995;
          font-size: 9px;
          line-height: 1.52;
        }

        .topicList {
          margin-top: 14px;
          display: grid;
          gap: 8px;
        }

        .topicButton {
          width: 100%;
          padding: 13px;
          display: grid;
          grid-template-columns: 40px minmax(0, 1fr) 38px;
          align-items: center;
          gap: 11px;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 13px;
          color: inherit;
          background: rgba(0, 0, 0, 0.15);
          cursor: pointer;
          text-align: left;
        }

        .topicButton:hover,
        .topicButton.active {
          border-color: rgba(99, 230, 255, 0.3);
          background: rgba(99, 230, 255, 0.055);
        }

        .topicNumber,
        .topicCode {
          width: 40px;
          height: 40px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(99, 230, 255, 0.14);
          border-radius: 10px;
          color: #68d9ea;
          font-size: 7px;
          font-weight: 900;
        }

        .topicCode {
          width: 38px;
          height: 38px;
          color: #e9c778;
          border-color: rgba(239, 199, 110, 0.18);
        }

        .topicIdentity {
          min-width: 0;
          display: grid;
          gap: 4px;
        }

        .topicIdentity small {
          color: #718994;
          font-size: 7px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .topicIdentity strong {
          color: #dce8ec;
          font-size: 11px;
        }

        .topicIdentity em {
          color: #70858f;
          font-size: 8px;
          font-style: normal;
        }

        .emptyState {
          padding: 38px 18px;
          text-align: center;
        }

        .emptyState span {
          color: #e4bf68;
          font: 700 32px Georgia, serif;
        }

        .emptyState strong {
          display: block;
          margin-top: 12px;
        }

        .emptyState p {
          color: #78909b;
          font-size: 10px;
        }

        .topicRecord {
          padding: 27px;
        }

        .recordHeader {
          display: flex;
          align-items: center;
          gap: 18px;
        }

        .recordSeal {
          width: 76px;
          height: 76px;
          flex: 0 0 76px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(255, 198, 82, 0.3);
          border-radius: 50%;
          color: #f1cb7c;
          font: 700 18px Georgia, serif;
        }

        .recordHeader p {
          margin: 0;
          color: #69dcef;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .recordHeader h3 {
          margin: 6px 0 0;
          font-size: clamp(31px, 3vw, 46px);
        }

        .recordHeader span {
          display: block;
          margin-top: 8px;
          color: #8399a3;
          font-size: 11px;
        }

        .recordMetrics {
          margin-top: 24px;
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 9px;
        }

        .recordMetrics article,
        .boundaryCard,
        .recordCard,
        .relatedCard,
        .connectedRecords {
          padding: 18px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 16px;
          background: rgba(0, 0, 0, 0.14);
        }

        .recordMetrics span {
          display: block;
          color: #70ddec;
          font-size: 7px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .recordMetrics strong {
          display: block;
          margin-top: 8px;
          color: #efcf85;
          font: 700 24px Georgia, serif;
        }

        .boundaryCard {
          margin-top: 14px;
          border-color: rgba(255, 198, 82, 0.18);
        }

        .boundaryCard > span {
          color: #e6bb61;
          font-size: 8px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .boundaryCard > strong {
          display: block;
          margin-top: 9px;
          font: 700 18px Georgia, serif;
          line-height: 1.4;
        }

        .boundaryCard p {
          margin: 11px 0 0;
          color: #99adb6;
          font-size: 11px;
          line-height: 1.63;
        }

        .recordColumns {
          margin-top: 14px;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 13px;
        }

        .cardHeading {
          padding-bottom: 13px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }

        .cardHeading span {
          color: #72ddeb;
          font-size: 8px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .cardHeading strong {
          color: #edca80;
          font: 700 18px Georgia, serif;
        }

        .tagGrid {
          margin-top: 14px;
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .tagGrid span {
          padding: 8px 10px;
          border: 1px solid rgba(99, 230, 255, 0.12);
          border-radius: 999px;
          color: #a9c1ca;
          background: rgba(99, 230, 255, 0.035);
          font-size: 9px;
        }

        .relatedCard,
        .connectedRecords {
          margin-top: 14px;
        }

        .relatedGrid {
          margin-top: 14px;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 9px;
        }

        .relatedGrid button {
          min-height: 112px;
          padding: 13px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 12px;
          color: inherit;
          background: rgba(255, 255, 255, 0.02);
          cursor: pointer;
          text-align: left;
        }

        .relatedGrid button:hover {
          border-color: rgba(99, 230, 255, 0.28);
        }

        .relatedGrid span {
          color: #e8c36e;
          font: 700 17px Georgia, serif;
        }

        .relatedGrid strong {
          display: block;
          margin-top: 8px;
          font-size: 10px;
        }

        .relatedGrid small {
          display: block;
          margin-top: 7px;
          color: #718894;
          font-size: 8px;
        }

        .recordList {
          margin-top: 14px;
          display: grid;
          gap: 9px;
        }

        .recordList a {
          padding: 14px;
          display: grid;
          grid-template-columns: 40px minmax(0, 1fr) 18px;
          gap: 13px;
          align-items: start;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 13px;
          text-decoration: none;
          background: rgba(255, 255, 255, 0.018);
          transition:
            transform 0.2s,
            border-color 0.2s;
        }

        .recordList a:hover {
          transform: translateY(-2px);
          border-color: rgba(99, 230, 255, 0.26);
        }

        .recordList a > span {
          width: 40px;
          height: 40px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(99, 230, 255, 0.14);
          border-radius: 10px;
          color: #67d7e8;
          font-size: 8px;
        }

        .recordList small {
          color: #6f8792;
          font-size: 7px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .recordList strong {
          display: block;
          margin-top: 5px;
          font-size: 12px;
        }

        .recordList p {
          margin: 7px 0 0;
          color: #8499a3;
          font-size: 9px;
          line-height: 1.5;
        }

        .recordList b {
          color: #69dceb;
        }

        .recordActions,
        .academyActions,
        .boundaryActions {
          margin-top: 18px;
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-end;
          gap: 9px;
        }

        .methodGrid,
        .failureGrid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 11px;
        }

        .methodGrid article,
        .failureGrid article {
          min-height: 214px;
          padding: 20px;
          border: 1px solid rgba(99, 230, 255, 0.1);
          border-radius: 17px;
          background: rgba(9, 29, 43, 0.7);
        }

        .methodGrid article > span,
        .failureGrid article > span {
          width: 38px;
          height: 38px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(255, 197, 82, 0.2);
          border-radius: 50%;
          color: #efc66f;
          font-size: 8px;
        }

        .methodGrid strong,
        .failureGrid strong {
          display: block;
          margin-top: 24px;
          font: 700 19px Georgia, serif;
        }

        .methodGrid p,
        .failureGrid p {
          margin: 11px 0 0;
          color: #8298a2;
          font-size: 10px;
          line-height: 1.6;
        }

        .failureGrid article {
          border-color: rgba(255, 126, 126, 0.11);
          background: linear-gradient(
            145deg,
            rgba(42, 17, 24, 0.45),
            rgba(4, 17, 25, 0.9)
          );
        }

        .academySection {
          display: grid;
          grid-template-columns: 360px minmax(0, 1fr);
          gap: 56px;
          align-items: center;
        }

        .academySeal {
          width: 300px;
          height: 300px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border: 2px solid #65eeb2;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(100, 239, 179, 0.17),
            rgba(3, 27, 28, 0.96)
          );
          box-shadow: 0 0 80px rgba(78, 225, 170, 0.18);
        }

        .academySeal small {
          color: #73baa3;
          font-weight: 950;
          letter-spacing: 0.16em;
        }

        .academySeal strong {
          color: #bdffdb;
          font: 900 47px Georgia, serif;
        }

        .academySeal span {
          margin-top: 8px;
          color: #69d8af;
          font-size: 8px;
          font-weight: 950;
          letter-spacing: 0.13em;
        }

        .academyGrid {
          margin-top: 25px;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 9px;
        }

        .academyGrid article {
          padding: 14px;
          display: grid;
          grid-template-columns: 46px minmax(0, 1fr);
          gap: 12px;
          border: 1px solid rgba(100, 230, 190, 0.14);
          border-radius: 13px;
          background: rgba(255, 255, 255, 0.024);
        }

        .academyGrid article > span {
          width: 44px;
          height: 44px;
          display: grid;
          place-items: center;
          border: 1px solid #62efb5;
          border-radius: 10px;
          color: #82f3c1;
          font-size: 9px;
          font-weight: 950;
        }

        .academyGrid strong {
          font-size: 11px;
        }

        .academyGrid p {
          margin: 5px 0 0;
          color: #7e9995;
          font-size: 9px;
          line-height: 1.43;
        }

        .academyActions {
          justify-content: flex-start;
        }

        .boundarySection {
          margin-top: 88px;
          padding: 58px 35px;
          border: 1px solid rgba(255, 197, 82, 0.24);
          border-radius: 31px;
          background: rgba(8, 20, 33, 0.97);
          text-align: center;
        }

        .boundarySealLarge {
          width: 86px;
          height: 86px;
          margin: 0 auto 25px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(255, 198, 82, 0.32);
          border-radius: 50%;
          color: #edc873;
          font: 700 24px Georgia, serif;
        }

        .boundarySection > p:not(.eyebrow) {
          max-width: 980px;
          margin: 23px auto 0;
        }

        .boundaryActions {
          justify-content: center;
        }

        @keyframes packet {
          from {
            left: 0;
          }
          to {
            left: 100%;
          }
        }

        @media (max-width: 1180px) {
          .domainGrid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .filterPanel {
            grid-template-columns: 1fr 1fr;
          }

          .searchField {
            grid-column: 1 / -1;
          }

          .workspaceGrid {
            grid-template-columns: 1fr;
          }

          .topicIndex {
            position: static;
            max-height: none;
          }

          .topicList {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .methodGrid,
          .failureGrid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 900px) {
          .sectionHeading,
          .academySection {
            grid-template-columns: 1fr;
          }

          .heroMetrics,
          .recordMetrics {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .recordColumns,
          .academyGrid {
            grid-template-columns: 1fr;
          }

          .relatedGrid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 700px) {
          .pageShell {
            width: calc(100% - 22px);
          }

          .topbar,
          .domainGrid,
          .filterPanel,
          .topicList,
          .heroMetrics,
          .recordMetrics,
          .methodGrid,
          .failureGrid,
          .relatedGrid {
            grid-template-columns: 1fr;
          }

          .topbarStatus {
            display: none;
          }

          .hero {
            padding-top: 64px;
          }

          .hero h1 {
            font-size: 48px;
          }

          .lead {
            font-size: 15px;
          }

          .recordHeader {
            align-items: flex-start;
          }

          .recordActions,
          .academyActions,
          .boundaryActions {
            flex-direction: column;
          }

          .primaryAction,
          .secondaryAction,
          .academyAction {
            width: 100%;
          }

          .academySeal {
            width: 250px;
            height: 250px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            animation: none !important;
            transition: none !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>
    </main>
  );
}
