"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  governanceLibraryRecords,
} from "../../../lib/governance-library";
import type {
  GovernanceLibraryRecord,
} from "../../../lib/governance-library/records-foundational";

type TopicRecord = {
  topic: string;
  count: number;
  records: GovernanceLibraryRecord[];
  recordTypes: string[];
  jurisdictions: string[];
  publishers: string[];
  categories: string[];
};

type TopicDomain = {
  id: string;
  label: string;
  description: string;
  tokens: string[];
};

const topicDomains: TopicDomain[] = [
  {
    id: "all",
    label: "All topics",
    description:
      "Every governed concept represented across the institutional library.",
    tokens: [],
  },
  {
    id: "ai",
    label: "AI Governance",
    description:
      "Models, agents, lifecycle, risk, transparency, oversight, assurance, and execution.",
    tokens: [
      "ai",
      "model",
      "agent",
      "algorithm",
      "risk",
      "bias",
      "transparency",
      "human oversight",
      "conformity",
      "trustworthiness",
      "lifecycle",
    ],
  },
  {
    id: "environment",
    label: "Environmental Integrity",
    description:
      "Air, water, land, buildings, HVAC, pollution, measurement, intervention, and outcome.",
    tokens: [
      "air",
      "water",
      "environment",
      "pollution",
      "building",
      "hvac",
      "atmospheric",
      "measurement",
      "sampling",
      "remediation",
      "emissions",
      "indoor",
    ],
  },
  {
    id: "law",
    label: "Law & Regulation",
    description:
      "Applicability, jurisdiction, authority, duties, enforcement, rights, and legal status.",
    tokens: [
      "law",
      "regulation",
      "jurisdiction",
      "authority",
      "enforcement",
      "compliance",
      "obligation",
      "rights",
      "liability",
      "applicability",
    ],
  },
  {
    id: "standards",
    label: "Standards & Codes",
    description:
      "Consensus standards, technical methods, codes, adoption, conformity, and accreditation.",
    tokens: [
      "standard",
      "code",
      "method",
      "certification",
      "accreditation",
      "conformity",
      "management system",
      "testing",
      "verification",
    ],
  },
  {
    id: "evidence",
    label: "Evidence & Execution",
    description:
      "Records, continuity, admissibility, binding, determinations, execution, and outcomes.",
    tokens: [
      "evidence",
      "record",
      "continuity",
      "admissibility",
      "binding",
      "commit",
      "execution",
      "outcome",
      "audit",
      "traceability",
      "documentation",
    ],
  },
  {
    id: "academy",
    label: "Academy & Readiness",
    description:
      "Learning, simulations, assessments, competency, review readiness, and institutional literacy.",
    tokens: [
      "education",
      "training",
      "learning",
      "competency",
      "assessment",
      "simulation",
      "readiness",
      "review",
    ],
  },
];

const topicQuestions = [
  {
    code: "01",
    title: "What does the topic mean?",
    text:
      "Preserve the term, source vocabulary, definition, version, and context before using it as a governance category.",
  },
  {
    code: "02",
    title: "Which instruments use it?",
    text:
      "Identify the laws, regulations, standards, frameworks, guidance, records, and architectures that rely on the topic.",
  },
  {
    code: "03",
    title: "Who has authority?",
    text:
      "Determine which legislature, regulator, standards body, court, organization, contract, or institutional reviewer gives it effect.",
  },
  {
    code: "04",
    title: "Where does it apply?",
    text:
      "Resolve jurisdiction, subject, role, activity, sector, system, location, version, threshold, and exclusions.",
  },
  {
    code: "05",
    title: "What evidence supports it?",
    text:
      "Bind the topic to records, methods, sources, measurements, continuity, evidence quality, and declared limitations.",
  },
  {
    code: "06",
    title: "What may it determine?",
    text:
      "Separate descriptive language from authority to allow, hold, deny, escalate, certify, restrict, intervene, or rely.",
  },
  {
    code: "07",
    title: "What does it leave out?",
    text:
      "Identify missing evidence, primitive assumptions, unresolved authority, execution gaps, and outcome failures.",
  },
  {
    code: "08",
    title: "What must be preserved?",
    text:
      "Preserve the source, interpretation, applicability, evidence, authority, determination, execution effect, outcome, and future-reliance boundary.",
  },
];

const governingChain = [
  "Reality",
  "Record",
  "Continuity",
  "Admissibility",
  "Binding",
  "Commit",
  "Execution",
  "Outcome",
];

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

function titleCase(value: string): string {
  return value
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function recordTypeLabel(value: GovernanceLibraryRecord["recordType"]): string {
  const labels: Record<GovernanceLibraryRecord["recordType"], string> = {
    law: "Law",
    regulation: "Regulation",
    standard: "Standard",
    framework: "Framework",
    principle: "Principle",
    guidance: "Guidance",
    architecture: "Architecture",
  };

  return labels[value];
}

function statusLabel(value: GovernanceLibraryRecord["status"]): string {
  return titleCase(value.replace(/-/g, " "));
}

function domainMatches(topic: string, domain: TopicDomain): boolean {
  if (domain.id === "all") {
    return true;
  }

  const candidate = normalize(topic);
  return domain.tokens.some((token) => candidate.includes(normalize(token)));
}

export default function GovernanceLibraryTopicsPage() {
  const [query, setQuery] = useState("");
  const [activeDomain, setActiveDomain] = useState("all");
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [sortMode, setSortMode] = useState<"alphabetical" | "coverage">(
    "coverage",
  );

  const topics = useMemo<TopicRecord[]>(() => {
    const topicMap = new Map<string, GovernanceLibraryRecord[]>();

    governanceLibraryRecords.forEach((record: GovernanceLibraryRecord) => {
      record.keyTopics.forEach((topic) => {
        const existing = topicMap.get(topic) ?? [];
        existing.push(record);
        topicMap.set(topic, existing);
      });
    });

    return Array.from(topicMap.entries()).map(([topic, records]) => ({
      topic,
      count: records.length,
      records,
      recordTypes: Array.from(
        new Set(records.map((record) => record.recordType)),
      ).sort(),
      jurisdictions: Array.from(
        new Set(records.map((record) => record.jurisdiction)),
      ).sort(),
      publishers: Array.from(
        new Set(records.map((record) => record.publisher)),
      ).sort(),
      categories: Array.from(
        new Set(records.flatMap((record) => record.categories)),
      ).sort(),
    }));
  }, []);

  const activeDomainRecord =
    topicDomains.find((domain) => domain.id === activeDomain) ?? topicDomains[0];

  const filteredTopics = useMemo(() => {
    const search = normalize(query);

    const filtered = topics.filter((topic) => {
      const domainMatch = domainMatches(topic.topic, activeDomainRecord);
      const searchable = normalize(
        [
          topic.topic,
          ...topic.recordTypes,
          ...topic.jurisdictions,
          ...topic.publishers,
          ...topic.categories,
          ...topic.records.flatMap((record) => [
            record.title,
            record.shortTitle,
            record.summary,
            record.whyItMatters,
          ]),
        ].join(" "),
      );

      const searchMatch =
        search.length === 0 ||
        search.split(/\s+/).every((token) => searchable.includes(token));

      return domainMatch && searchMatch;
    });

    return [...filtered].sort((left, right) => {
      if (sortMode === "coverage") {
        return right.count - left.count || left.topic.localeCompare(right.topic);
      }

      return left.topic.localeCompare(right.topic);
    });
  }, [activeDomainRecord, query, sortMode, topics]);

  const selected =
    topics.find((topic) => topic.topic === selectedTopic) ??
    filteredTopics[0] ??
    topics[0];

  const metrics = useMemo(
    () => ({
      topics: topics.length,
      records: governanceLibraryRecords.length,
      jurisdictions: new Set(
        governanceLibraryRecords.map((record) => record.jurisdiction),
      ).size,
      publishers: new Set(
        governanceLibraryRecords.map((record) => record.publisher),
      ).size,
      categories: new Set(
        governanceLibraryRecords.flatMap((record) => record.categories),
      ).size,
    }),
    [topics.length],
  );

  const selectedRecordTypes = selected?.recordTypes ?? [];
  const selectedJurisdictions = selected?.jurisdictions ?? [];
  const selectedPublishers = selected?.publishers ?? [];
  const selectedCategories = selected?.categories ?? [];

  return (
    <main className="topicsPage">
      <div className="background" aria-hidden="true">
        <div className="grid" />
        <div className="glow glowOne" />
        <div className="glow glowTwo" />
        <div className="route routeOne" />
        <div className="route routeTwo" />
      </div>

      <div className="pageShell">
        <header className="topbar">
          <Link href="/governance-library" className="backLink">
            ← Governance Library
          </Link>

          <div className="topbarIdentity">
            <span />
            TA-14 Institutional Topic Resolution
          </div>

          <div className="topbarActions">
            <Link href="/governance-library/topic-map">Topic Map</Link>
            <Link href="/governance-library/applicability">Applicability</Link>
          </div>
        </header>

        <section className="hero">
          <div className="heroSeal" aria-hidden="true">
            <span>GT</span>
            <small>TA-14</small>
          </div>

          <p className="eyebrow">TA-14 AUTHORITY GOVERNANCE INSTITUTION</p>

          <h1>
            Institutional Governance
            <em> Topics</em>
          </h1>

          <p className="heroLead">
            Explore the governed concepts that connect law, regulation,
            standards, frameworks, environmental integrity, AI governance,
            evidence, authority, execution, and outcome. A topic is not merely
            a keyword. It is a route into the instruments, jurisdictions,
            publishers, records, boundaries, and decisions that give the term
            institutional meaning.
          </p>

          <div className="heroActions">
            <a href="#topic-workspace" className="primaryButton">
              Explore Governance Topics <span>↓</span>
            </a>
            <Link href="/governance-library/topic-map" className="secondaryButton">
              Open Topic Map <span>↗</span>
            </Link>
            <Link href="/academy" className="secondaryButton">
              Enter TA-14 Academy <span>↗</span>
            </Link>
          </div>

          <div className="metricGrid">
            <article>
              <strong>{metrics.topics}</strong>
              <span>Governance topics</span>
            </article>
            <article>
              <strong>{metrics.records}</strong>
              <span>Library records</span>
            </article>
            <article>
              <strong>{metrics.jurisdictions}</strong>
              <span>Jurisdictions</span>
            </article>
            <article>
              <strong>{metrics.publishers}</strong>
              <span>Publishers</span>
            </article>
            <article>
              <strong>{metrics.categories}</strong>
              <span>Categories</span>
            </article>
          </div>
        </section>

        <section className="definitionBand">
          <article>
            <span>TOPIC</span>
            <strong>A governed concept with an inspectable source and use</strong>
            <p>
              The topic preserves its language, context, related instruments,
              authority, evidence, applicability, and declared limits.
            </p>
          </article>
          <article>
            <span>RELATIONSHIP</span>
            <strong>One topic may cross many institutional instruments</strong>
            <p>
              The same concept may appear differently in statutes,
              regulations, standards, guidance, frameworks, contracts, and
              TA-14 architectures.
            </p>
          </article>
          <article>
            <span>BOUNDARY</span>
            <strong>A topic does not create authority by itself</strong>
            <p>
              The term must still be connected to an applicable source,
              current version, responsible authority, evidence package, and
              bounded governance determination.
            </p>
          </article>
        </section>

        <section className="domainSection">
          <div className="sectionHeading centered">
            <p className="eyebrow">THE FOUR-DOOR INSTITUTIONAL TOPIC MAP</p>
            <h2>Choose the governed world in which the topic must be understood.</h2>
            <p>
              Topics may cross institutional doors, but their authority and
              operational meaning must remain attributable to the correct
              division, instrument, and evidence route.
            </p>
          </div>

          <div className="domainGrid">
            {topicDomains.map((domain, index) => (
              <button
                type="button"
                key={domain.id}
                onClick={() => {
                  setActiveDomain(domain.id);
                  setSelectedTopic(null);
                }}
                className={activeDomain === domain.id ? "active" : ""}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{domain.label}</strong>
                <p>{domain.description}</p>
                <small>
                  {topics.filter((topic) => domainMatches(topic.topic, domain)).length}
                  {" "}topics
                </small>
              </button>
            ))}
          </div>
        </section>

        <section className="workspaceSection" id="topic-workspace">
          <div className="sectionHeading">
            <div>
              <p className="eyebrow">TOPIC RESOLUTION WORKSPACE</p>
              <h2>Find the term. Inspect the instruments. Preserve the boundary.</h2>
            </div>
            <p>
              Search across topic names, record titles, summaries, publishers,
              jurisdictions, categories, and institutional relevance. Select a
              topic to inspect the records that actually support its use.
            </p>
          </div>

          <div className="filterPanel">
            <label className="searchField">
              Search governance topics
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search evidence, air quality, authority, risk, execution..."
              />
            </label>

            <label>
              Institutional domain
              <select
                value={activeDomain}
                onChange={(event) => {
                  setActiveDomain(event.target.value);
                  setSelectedTopic(null);
                }}
              >
                {topicDomains.map((domain) => (
                  <option key={domain.id} value={domain.id}>
                    {domain.label}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Sort topics
              <select
                value={sortMode}
                onChange={(event) =>
                  setSortMode(event.target.value as "alphabetical" | "coverage")
                }
              >
                <option value="coverage">Most connected</option>
                <option value="alphabetical">Alphabetical</option>
              </select>
            </label>

            <button
              type="button"
              className="clearButton"
              onClick={() => {
                setQuery("");
                setActiveDomain("all");
                setSortMode("coverage");
                setSelectedTopic(null);
              }}
            >
              Clear filters
            </button>
          </div>

          <div className="workspaceGrid">
            <aside className="topicIndex">
              <div className="indexHeading">
                <div>
                  <span>{activeDomainRecord.label}</span>
                  <strong>{filteredTopics.length} topics</strong>
                </div>
                <p>{activeDomainRecord.description}</p>
              </div>

              <div className="topicList">
                {filteredTopics.map((topic, index) => (
                  <button
                    type="button"
                    key={topic.topic}
                    className={selected?.topic === topic.topic ? "active" : ""}
                    onClick={() => setSelectedTopic(topic.topic)}
                  >
                    <span className="topicNumber">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="topicIdentity">
                      <strong>{titleCase(topic.topic)}</strong>
                      <small>
                        {topic.count} record{topic.count === 1 ? "" : "s"} ·{" "}
                        {topic.recordTypes.length} type
                        {topic.recordTypes.length === 1 ? "" : "s"}
                      </small>
                    </span>
                    <span className="topicArrow">→</span>
                  </button>
                ))}

                {filteredTopics.length === 0 ? (
                  <div className="emptyState">
                    <span>00</span>
                    <strong>No topic matched the current route.</strong>
                    <p>
                      Broaden the search, choose another domain, or clear the
                      filters.
                    </p>
                  </div>
                ) : null}
              </div>
            </aside>

            {selected ? (
              <article className="topicRecord">
                <div className="recordHeader">
                  <div className="recordSeal">
                    {selected.topic
                      .split(/\s+/)
                      .map((word) => word.charAt(0))
                      .join("")
                      .slice(0, 3)
                      .toUpperCase()}
                  </div>

                  <div>
                    <p>INSTITUTIONAL GOVERNANCE TOPIC</p>
                    <h3>{titleCase(selected.topic)}</h3>
                    <span>
                      Connected to {selected.count} governed library record
                      {selected.count === 1 ? "" : "s"}.
                    </span>
                  </div>
                </div>

                <div className="recordMetrics">
                  <article>
                    <span>Records</span>
                    <strong>{selected.count}</strong>
                  </article>
                  <article>
                    <span>Instrument types</span>
                    <strong>{selectedRecordTypes.length}</strong>
                  </article>
                  <article>
                    <span>Jurisdictions</span>
                    <strong>{selectedJurisdictions.length}</strong>
                  </article>
                  <article>
                    <span>Publishers</span>
                    <strong>{selectedPublishers.length}</strong>
                  </article>
                </div>

                <section className="topicMeaning">
                  <span>TOPIC RESOLUTION</span>
                  <h4>Understand the term through the records that use it.</h4>
                  <p>
                    TA-14 does not assign a universal meaning to this topic
                    without preserving the instrument, publisher,
                    jurisdiction, record type, version, purpose, and
                    applicability context in which it appears.
                  </p>
                </section>

                <div className="classificationGrid">
                  <section>
                    <div className="cardHeading">
                      <span>Instrument types</span>
                      <strong>{selectedRecordTypes.length}</strong>
                    </div>
                    <div className="chipGrid">
                      {selectedRecordTypes.map((type) => (
                        <span key={type}>
                          {recordTypeLabel(
                            type as GovernanceLibraryRecord["recordType"],
                          )}
                        </span>
                      ))}
                    </div>
                  </section>

                  <section>
                    <div className="cardHeading">
                      <span>Jurisdictions</span>
                      <strong>{selectedJurisdictions.length}</strong>
                    </div>
                    <div className="chipGrid">
                      {selectedJurisdictions.map((jurisdiction) => (
                        <span key={jurisdiction}>{jurisdiction}</span>
                      ))}
                    </div>
                  </section>

                  <section>
                    <div className="cardHeading">
                      <span>Publishers</span>
                      <strong>{selectedPublishers.length}</strong>
                    </div>
                    <div className="chipGrid">
                      {selectedPublishers.map((publisher) => (
                        <span key={publisher}>{publisher}</span>
                      ))}
                    </div>
                  </section>

                  <section>
                    <div className="cardHeading">
                      <span>Library categories</span>
                      <strong>{selectedCategories.length}</strong>
                    </div>
                    <div className="chipGrid">
                      {selectedCategories.map((category) => (
                        <span key={category}>{titleCase(category)}</span>
                      ))}
                    </div>
                  </section>
                </div>

                <section className="connectedRecords">
                  <div className="cardHeading">
                    <span>Connected governed records</span>
                    <strong>{selected.records.length}</strong>
                  </div>

                  <div className="recordList">
                    {selected.records.map((record, index) => (
                      <Link
                        key={record.slug}
                        href={`/governance-library/${record.slug}`}
                      >
                        <span className="recordNumber">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <div className="recordCopy">
                          <small>
                            {recordTypeLabel(record.recordType)} ·{" "}
                            {record.jurisdiction}
                          </small>
                          <strong>{record.shortTitle}</strong>
                          <p>{record.summary}</p>
                          <div>
                            <span>{record.publisher}</span>
                            <span>{statusLabel(record.status)}</span>
                          </div>
                        </div>
                        <b>↗</b>
                      </Link>
                    ))}
                  </div>
                </section>

                <section className="topicBoundary">
                  <div className="boundarySeal">T14</div>
                  <div>
                    <span>TA-14 TOPIC BOUNDARY</span>
                    <p>
                      A topic may support navigation, classification, research,
                      crosswalking, and Academy instruction. It does not by
                      itself establish legal applicability, technical
                      conformity, certification, authority to act, admissible
                      evidence, or permission to execute.
                    </p>
                  </div>
                </section>

                <div className="recordActions">
                  <Link href="/governance-library/topic-map">
                    Open Topic Map
                  </Link>
                  <Link href="/governance-library/crosswalks">
                    Open Crosswalks
                  </Link>
                  <Link
                    href="/governance-library/applicability"
                    className="primaryAction"
                  >
                    Resolve Applicability →
                  </Link>
                </div>
              </article>
            ) : null}
          </div>
        </section>

        <section className="questionsSection">
          <div className="sectionHeading centered">
            <p className="eyebrow">THE TOPIC RESOLUTION METHOD</p>
            <h2>Eight questions prevent a governance term from becoming an unsupported claim.</h2>
            <p>
              TA-14 treats vocabulary as part of the evidence route. Before a
              topic influences a decision, its meaning, authority,
              applicability, and execution effect must remain inspectable.
            </p>
          </div>

          <div className="questionGrid">
            {topicQuestions.map((question) => (
              <article key={question.code}>
                <span>{question.code}</span>
                <strong>{question.title}</strong>
                <p>{question.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="chainSection">
          <div className="sectionHeading">
            <div>
              <p className="eyebrow">TOPICS INSIDE THE GOVERNING CHAIN</p>
              <h2>A term must remain attributable from reality through outcome.</h2>
            </div>
            <p>
              Topics help people find and compare governance material. They do
              not replace the preserved route that determines whether evidence
              and authority support consequential action.
            </p>
          </div>

          <div className="chainTrack">
            {governingChain.map((stage, index) => (
              <div key={stage}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{stage}</strong>
                {index < governingChain.length - 1 ? <i>→</i> : null}
              </div>
            ))}
          </div>

          <div className="chainExplanation">
            <article>
              <span>AT THE RECORD LAYER</span>
              <strong>Preserve the source language and context.</strong>
              <p>
                Record exactly which instrument, publisher, version, section,
                definition, method, or institutional source used the topic.
              </p>
            </article>
            <article>
              <span>AT THE ADMISSIBILITY LAYER</span>
              <strong>Determine what proposition the topic may support.</strong>
              <p>
                A term may describe a concern without proving a violation,
                conformity result, safety condition, technical outcome, or
                authority to intervene.
              </p>
            </article>
            <article>
              <span>AT THE EXECUTION LAYER</span>
              <strong>Bind the concept to an accountable action route.</strong>
              <p>
                Preserve who acted, under which authority, upon what evidence,
                within what scope, and with which outcome-verification duty.
              </p>
            </article>
          </div>
        </section>

        <section className="academySection">
          <div className="academyVisual" aria-hidden="true">
            <div className="academySeal">
              <small>TA-14</small>
              <strong>ACADEMY</strong>
              <span>TOPIC LITERACY</span>
            </div>
            <i className="academyOrbit orbitA" />
            <i className="academyOrbit orbitB" />
            <i className="academyOrbit orbitC" />
          </div>

          <div className="academyCopy">
            <p className="eyebrow">THE ACADEMY INSIDE THE TOPIC SYSTEM</p>
            <h2>Learn what a governance term means before relying on what it appears to promise.</h2>
            <p>
              The Topic Academy teaches learners how the same word changes
              across law, regulation, standards, guidance, environmental
              science, AI governance, technical systems, contracts, and TA-14
              execution architecture.
            </p>

            <div className="academyGrid">
              {[
                [
                  "01",
                  "Definition laboratory",
                  "Compare official definitions, common usage, institutional interpretation, and prohibited overstatement.",
                ],
                [
                  "02",
                  "Instrument comparison",
                  "Inspect how statutes, regulations, standards, frameworks, guidance, and architectures use the topic differently.",
                ],
                [
                  "03",
                  "Authority resolution",
                  "Identify who may define, adopt, enforce, interpret, certify, review, or challenge the topic in context.",
                ],
                [
                  "04",
                  "Evidence boundary",
                  "Determine which records support the topic and which conclusions remain outside the evidence.",
                ],
                [
                  "05",
                  "Applicability simulation",
                  "Practice resolving jurisdiction, role, activity, system, sector, version, threshold, and exclusions.",
                ],
                [
                  "06",
                  "Execution scenario",
                  "Test whether the topic supports ALLOW, HOLD, DENY, or ESCALATE before consequence is bound.",
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
              <Link href="/academy" className="academyButton">
                Enter TA-14 Academy <span>↗</span>
              </Link>
              <Link href="/governance-library/glossary">
                Open Governance Glossary <span>↗</span>
              </Link>
            </div>
          </div>
        </section>

        <section className="closingSection">
          <div className="closingGlow" aria-hidden="true" />
          <p className="eyebrow">TA-14 INSTITUTIONAL GOVERNANCE TOPICS</p>
          <h2>Find the term. Preserve the source. Resolve the authority. Govern the consequence.</h2>
          <p>
            Use the Topic System to enter the correct institutional record,
            inspect its relationships, learn its boundaries, and continue into
            applicability, authority, evidence, and execution review.
          </p>

          <div className="closingActions">
            <a href="#topic-workspace" className="primaryButton">
              Return to Topic Workspace <span>↑</span>
            </a>
            <Link href="/governance-library" className="secondaryButton">
              Governance Library <span>↗</span>
            </Link>
            <Link href="/" className="secondaryButton">
              TA14Authority.org <span>↗</span>
            </Link>
          </div>

          <div className="closingChain">
            {governingChain.map((stage, index) => (
              <span key={stage}>
                {stage}
                {index < governingChain.length - 1 ? <i>→</i> : null}
              </span>
            ))}
          </div>

          <strong className="finalRule">
            No admissible evidence. No admissible execution.
          </strong>
        </section>

        <footer>
          <span>TA-14 Authority Governance Institution</span>
          <span>Governance Topics · Law · Standards · Environment · AI · Academy</span>
        </footer>
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
          color: #f5fbff;
          background: #020812;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system,
            BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        :global(a) {
          color: inherit;
        }

        .topicsPage {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          isolation: isolate;
          background:
            radial-gradient(circle at 50% -8%, rgba(38, 139, 190, 0.16), transparent 35%),
            linear-gradient(180deg, #020a14 0%, #04101b 52%, #02070d 100%);
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
          opacity: 0.12;
          background-image:
            linear-gradient(rgba(109, 224, 239, 0.24) 1px, transparent 1px),
            linear-gradient(90deg, rgba(109, 224, 239, 0.24) 1px, transparent 1px);
          background-size: 64px 64px;
          mask-image: linear-gradient(to bottom, transparent, black 20%, black 80%, transparent);
        }

        .glow {
          position: absolute;
          width: 680px;
          height: 680px;
          border-radius: 50%;
          filter: blur(120px);
          opacity: 0.14;
          animation: drift 18s ease-in-out infinite alternate;
        }

        .glowOne {
          left: -250px;
          top: 18%;
          background: #0879be;
        }

        .glowTwo {
          right: -260px;
          top: 58%;
          background: #8c5bd1;
          animation-delay: -8s;
        }

        .route {
          position: absolute;
          width: 76vw;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(99, 224, 243, 0.58), rgba(255, 203, 93, 0.46), transparent);
          filter: drop-shadow(0 0 8px rgba(99, 224, 243, 0.38));
        }

        .route::after {
          content: "";
          position: absolute;
          top: -3px;
          left: 12%;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #fff0af;
          box-shadow: 0 0 16px rgba(255, 224, 131, 0.9);
          animation: packet 8s linear infinite;
        }

        .routeOne {
          left: -15%;
          top: 28%;
          transform: rotate(-8deg);
        }

        .routeTwo {
          right: -18%;
          top: 72%;
          transform: rotate(10deg);
        }

        .pageShell {
          width: min(1500px, calc(100% - 36px));
          margin-inline: auto;
          position: relative;
          z-index: 2;
          padding: 18px 0 90px;
        }

        .topbar {
          min-height: 68px;
          padding: 11px 13px;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 16px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 18px;
          background: linear-gradient(180deg, rgba(9, 29, 45, 0.9), rgba(4, 15, 25, 0.82));
          box-shadow: 0 18px 48px rgba(0, 0, 0, 0.26);
          backdrop-filter: blur(16px);
        }

        .backLink,
        .topbarActions a,
        .primaryButton,
        .secondaryButton,
        .recordActions a,
        .academyActions a {
          min-height: 44px;
          padding: 0 15px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 11px;
          border-radius: 11px;
          text-decoration: none;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.05em;
          transition: transform 0.22s, border-color 0.22s, box-shadow 0.22s;
        }

        .backLink,
        .topbarActions a,
        .secondaryButton,
        .recordActions a,
        .academyActions a {
          color: #c5d7de;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(0, 0, 0, 0.18);
        }

        .primaryButton,
        .recordActions .primaryAction {
          color: #03161d;
          border: 1px solid #a9f1ff;
          background: linear-gradient(135deg, #d8fbff, #73dded 64%, #39afc9);
          box-shadow: 0 14px 28px rgba(62, 190, 215, 0.18);
        }

        .backLink:hover,
        .topbarActions a:hover,
        .primaryButton:hover,
        .secondaryButton:hover,
        .recordActions a:hover,
        .academyActions a:hover {
          transform: translateY(-2px);
        }

        .topbarIdentity {
          display: flex;
          align-items: center;
          gap: 9px;
          color: #819aa5;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .topbarIdentity span {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #72e8b5;
          box-shadow: 0 0 14px rgba(114, 232, 181, 0.9);
        }

        .topbarActions {
          justify-self: end;
          display: flex;
          gap: 8px;
        }

        .hero {
          max-width: 1180px;
          margin: 0 auto;
          padding: 84px 0 72px;
          text-align: center;
        }

        .heroSeal {
          width: 112px;
          height: 112px;
          margin: 0 auto 26px;
          display: grid;
          place-items: center;
          align-content: center;
          gap: 3px;
          border: 1px solid rgba(255, 202, 92, 0.4);
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255, 211, 113, 0.12), rgba(4, 21, 35, 0.94) 66%);
          box-shadow: 0 0 62px rgba(255, 191, 56, 0.1), inset 0 0 30px rgba(93, 219, 240, 0.06);
        }

        .heroSeal span {
          color: #ffe29a;
          font: 900 32px Georgia, serif;
        }

        .heroSeal small {
          color: #758e99;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.16em;
        }

        .eyebrow {
          margin: 0;
          color: #6fe3f5;
          font-size: 10px;
          font-weight: 950;
          letter-spacing: 0.22em;
          text-transform: uppercase;
        }

        h1,
        h2,
        h3,
        h4 {
          font-family: Georgia, "Times New Roman", serif;
        }

        .hero h1 {
          margin: 15px auto 0;
          font-size: clamp(54px, 6.6vw, 98px);
          line-height: 0.94;
          letter-spacing: -0.057em;
          text-wrap: balance;
        }

        .hero h1 em {
          display: block;
          color: #ffd15c;
          font-weight: 500;
          text-shadow: 0 0 35px rgba(255, 209, 92, 0.14);
        }

        .heroLead {
          max-width: 1010px;
          margin: 28px auto 0;
          color: #b4c7cf;
          font-size: 18px;
          line-height: 1.75;
        }

        .heroActions,
        .closingActions {
          margin-top: 31px;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 11px;
        }

        .metricGrid {
          margin-top: 39px;
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 11px;
        }

        .metricGrid article {
          padding: 18px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 16px;
          background: rgba(7, 25, 38, 0.64);
        }

        .metricGrid strong {
          display: block;
          color: #f1d38b;
          font: 700 28px Georgia, serif;
        }

        .metricGrid span {
          display: block;
          margin-top: 6px;
          color: #778f99;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .definitionBand {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
          padding-bottom: 80px;
        }

        .definitionBand article {
          padding: 24px;
          border: 1px solid rgba(111, 218, 235, 0.14);
          border-radius: 19px;
          background: linear-gradient(145deg, rgba(10, 34, 49, 0.76), rgba(4, 18, 28, 0.84));
          box-shadow: 0 18px 42px rgba(0, 0, 0, 0.15);
        }

        .definitionBand span {
          color: #739daa;
          font-size: 9px;
          font-weight: 950;
          letter-spacing: 0.14em;
        }

        .definitionBand strong {
          display: block;
          margin: 13px 0 9px;
          font: 700 21px Georgia, serif;
        }

        .definitionBand p {
          margin: 0;
          color: #93aab3;
          font-size: 13px;
          line-height: 1.62;
        }

        .domainSection,
        .workspaceSection,
        .questionsSection,
        .chainSection,
        .academySection,
        .closingSection {
          padding: 90px 0;
        }

        .sectionHeading {
          margin-bottom: 34px;
          display: grid;
          grid-template-columns: 1.18fr 0.82fr;
          align-items: end;
          gap: 42px;
        }

        .sectionHeading.centered {
          max-width: 1100px;
          margin: 0 auto 38px;
          display: block;
          text-align: center;
        }

        .sectionHeading h2,
        .academyCopy h2,
        .closingSection h2 {
          margin: 12px 0 0;
          font-size: clamp(40px, 4.9vw, 72px);
          line-height: 0.98;
          letter-spacing: -0.05em;
          text-wrap: balance;
        }

        .sectionHeading > p,
        .sectionHeading.centered > p:last-child,
        .academyCopy > p,
        .closingSection > p:not(.eyebrow) {
          margin: 0;
          color: #9eb3bc;
          font-size: 16px;
          line-height: 1.72;
        }

        .sectionHeading.centered > p:last-child {
          max-width: 920px;
          margin: 18px auto 0;
        }

        .domainGrid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 13px;
        }

        .domainGrid button {
          min-height: 220px;
          padding: 22px;
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 19px;
          color: #eff8fa;
          background: linear-gradient(145deg, rgba(11, 37, 52, 0.78), rgba(3, 17, 27, 0.9));
          text-align: left;
          cursor: pointer;
          transition: transform 0.24s, border-color 0.24s, box-shadow 0.24s;
        }

        .domainGrid button::before {
          content: "";
          position: absolute;
          inset: auto -30% -50% 20%;
          height: 190px;
          border-radius: 50%;
          background: #32bcd5;
          filter: blur(60px);
          opacity: 0.08;
        }

        .domainGrid button:hover,
        .domainGrid button.active {
          transform: translateY(-5px);
          border-color: rgba(105, 227, 245, 0.38);
          box-shadow: 0 18px 45px rgba(18, 140, 169, 0.12);
        }

        .domainGrid button.active {
          background: linear-gradient(145deg, rgba(14, 55, 70, 0.88), rgba(4, 22, 33, 0.94));
        }

        .domainGrid button > span {
          color: #60909d;
          font-size: 9px;
          font-weight: 950;
        }

        .domainGrid button > strong {
          display: block;
          margin-top: 29px;
          font: 700 23px Georgia, serif;
        }

        .domainGrid button > p {
          margin: 12px 0 0;
          color: #8fa7b0;
          font-size: 12px;
          line-height: 1.58;
        }

        .domainGrid button > small {
          display: block;
          margin-top: 18px;
          color: #e8c979;
          font-size: 8px;
          font-weight: 950;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .filterPanel {
          padding: 19px;
          display: grid;
          grid-template-columns: minmax(0, 1fr) 230px 190px auto;
          align-items: end;
          gap: 12px;
          border: 1px solid rgba(99, 224, 241, 0.13);
          border-radius: 20px;
          background: linear-gradient(145deg, rgba(8, 29, 43, 0.95), rgba(3, 14, 23, 0.98));
        }

        label {
          display: grid;
          gap: 8px;
          color: #799ca9;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.1em;
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
          color: #ebf6f8;
          background: rgba(0, 0, 0, 0.2);
          font: inherit;
          text-transform: none;
        }

        select option {
          color: #ebf6f8;
          background: #071722;
        }

        .clearButton {
          min-height: 47px;
          padding: 0 16px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 11px;
          color: #b7c9cf;
          background: rgba(0, 0, 0, 0.18);
          cursor: pointer;
          font-size: 8px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .workspaceGrid {
          margin-top: 17px;
          display: grid;
          grid-template-columns: 390px minmax(0, 1fr);
          gap: 17px;
          align-items: start;
        }

        .topicIndex,
        .topicRecord {
          border: 1px solid rgba(99, 224, 241, 0.13);
          border-radius: 24px;
          background: linear-gradient(145deg, rgba(8, 29, 43, 0.95), rgba(3, 14, 23, 0.98));
          box-shadow: 0 26px 70px rgba(0, 0, 0, 0.24);
        }

        .topicIndex {
          position: sticky;
          top: 18px;
          padding: 18px;
          max-height: calc(100vh - 36px);
          overflow: auto;
        }

        .indexHeading {
          padding: 4px 3px 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }

        .indexHeading > div {
          display: flex;
          justify-content: space-between;
          gap: 12px;
        }

        .indexHeading span {
          color: #6fddea;
          font-size: 8px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .indexHeading strong {
          color: #eacb83;
          font: 700 16px Georgia, serif;
        }

        .indexHeading p {
          margin: 8px 0 0;
          color: #6f8893;
          font-size: 9px;
          line-height: 1.5;
        }

        .topicList {
          margin-top: 14px;
          display: grid;
          gap: 8px;
        }

        .topicList > button {
          width: 100%;
          padding: 12px;
          display: grid;
          grid-template-columns: 40px minmax(0, 1fr) 14px;
          align-items: center;
          gap: 11px;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 12px;
          color: inherit;
          background: rgba(0, 0, 0, 0.15);
          cursor: pointer;
          text-align: left;
          transition: border-color 0.2s, background 0.2s, transform 0.2s;
        }

        .topicList > button:hover,
        .topicList > button.active {
          transform: translateX(4px);
          border-color: rgba(99, 224, 241, 0.3);
          background: rgba(99, 224, 241, 0.05);
        }

        .topicNumber {
          width: 40px;
          height: 40px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(99, 224, 241, 0.14);
          border-radius: 10px;
          color: #6ad7e7;
          font-size: 8px;
          font-weight: 900;
        }

        .topicIdentity {
          min-width: 0;
        }

        .topicIdentity strong,
        .topicIdentity small {
          display: block;
        }

        .topicIdentity strong {
          color: #dce9ed;
          font-size: 11px;
          line-height: 1.35;
        }

        .topicIdentity small {
          margin-top: 5px;
          color: #718a95;
          font-size: 8px;
        }

        .topicArrow {
          color: #64dcea;
          font-size: 12px;
        }

        .emptyState {
          padding: 36px 18px;
          text-align: center;
        }

        .emptyState span {
          color: #5c7c88;
          font: 700 26px Georgia, serif;
        }

        .emptyState strong {
          display: block;
          margin-top: 12px;
        }

        .emptyState p {
          color: #718993;
          font-size: 10px;
          line-height: 1.5;
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
          border: 1px solid rgba(255, 204, 93, 0.32);
          border-radius: 50%;
          color: #f0ce82;
          font: 700 20px Georgia, serif;
          background: rgba(255, 204, 93, 0.03);
        }

        .recordHeader p {
          margin: 0;
          color: #69ddea;
          font-size: 8px;
          font-weight: 950;
          letter-spacing: 0.14em;
        }

        .recordHeader h3 {
          margin: 6px 0 0;
          font-size: clamp(31px, 3.3vw, 48px);
          line-height: 1;
        }

        .recordHeader > div:last-child > span {
          display: block;
          margin-top: 8px;
          color: #8299a3;
          font-size: 11px;
        }

        .recordMetrics {
          margin-top: 23px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 9px;
        }

        .recordMetrics article {
          padding: 15px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 13px;
          background: rgba(0, 0, 0, 0.14);
        }

        .recordMetrics span {
          color: #6f8c97;
          font-size: 7px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .recordMetrics strong {
          display: block;
          margin-top: 7px;
          color: #eed18a;
          font: 700 23px Georgia, serif;
        }

        .topicMeaning {
          margin-top: 14px;
          padding: 20px;
          border: 1px solid rgba(99, 224, 241, 0.1);
          border-radius: 15px;
          background: rgba(0, 0, 0, 0.14);
        }

        .topicMeaning > span,
        .cardHeading span,
        .topicBoundary span {
          color: #6fdde9;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.11em;
          text-transform: uppercase;
        }

        .topicMeaning h4 {
          margin: 9px 0 0;
          font-size: 21px;
        }

        .topicMeaning p {
          margin: 10px 0 0;
          color: #9eb2ba;
          font-size: 12px;
          line-height: 1.65;
        }

        .classificationGrid {
          margin-top: 14px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .classificationGrid > section,
        .connectedRecords {
          padding: 18px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 15px;
          background: rgba(0, 0, 0, 0.14);
        }

        .cardHeading {
          padding-bottom: 12px;
          display: flex;
          justify-content: space-between;
          gap: 12px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }

        .cardHeading strong {
          color: #e8ca83;
          font: 700 17px Georgia, serif;
        }

        .chipGrid {
          margin-top: 12px;
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
        }

        .chipGrid span {
          padding: 8px 10px;
          border: 1px solid rgba(99, 224, 241, 0.11);
          border-radius: 999px;
          color: #9db4bc;
          background: rgba(99, 224, 241, 0.025);
          font-size: 8px;
          font-weight: 800;
        }

        .connectedRecords {
          margin-top: 14px;
        }

        .recordList {
          margin-top: 13px;
          display: grid;
          gap: 9px;
        }

        .recordList > a {
          padding: 14px;
          display: grid;
          grid-template-columns: 42px minmax(0, 1fr) 16px;
          gap: 12px;
          align-items: start;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 13px;
          background: rgba(255, 255, 255, 0.018);
          text-decoration: none;
          transition: transform 0.22s, border-color 0.22s;
        }

        .recordList > a:hover {
          transform: translateY(-3px);
          border-color: rgba(99, 224, 241, 0.24);
        }

        .recordNumber {
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(255, 204, 93, 0.16);
          border-radius: 10px;
          color: #e5be67;
          font-size: 8px;
        }

        .recordCopy small {
          color: #6fd9e7;
          font-size: 7px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .recordCopy > strong {
          display: block;
          margin-top: 5px;
          font-size: 12px;
        }

        .recordCopy > p {
          margin: 7px 0 0;
          color: #879da6;
          font-size: 10px;
          line-height: 1.5;
        }

        .recordCopy > div {
          margin-top: 8px;
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
        }

        .recordCopy > div span {
          padding: 5px 7px;
          border-radius: 7px;
          color: #738c96;
          background: rgba(255, 255, 255, 0.025);
          font-size: 7px;
        }

        .recordList > a > b {
          color: #67dbe8;
        }

        .topicBoundary {
          margin-top: 14px;
          padding: 19px;
          display: grid;
          grid-template-columns: 62px 1fr;
          gap: 16px;
          border: 1px solid rgba(255, 204, 93, 0.2);
          border-radius: 15px;
          background: rgba(255, 204, 93, 0.025);
        }

        .boundarySeal {
          width: 62px;
          height: 62px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(255, 204, 93, 0.25);
          border-radius: 50%;
          color: #efc976;
          font-size: 11px;
          font-weight: 900;
        }

        .topicBoundary p {
          margin: 8px 0 0;
          color: #cbd9dd;
          font-size: 12px;
          line-height: 1.62;
        }

        .recordActions {
          margin-top: 16px;
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-end;
          gap: 8px;
        }

        .questionGrid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }

        .questionGrid article {
          min-height: 220px;
          padding: 21px;
          border: 1px solid rgba(99, 224, 241, 0.11);
          border-radius: 17px;
          background: linear-gradient(145deg, rgba(10, 33, 47, 0.74), rgba(3, 16, 25, 0.88));
        }

        .questionGrid span {
          width: 39px;
          height: 39px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(255, 204, 93, 0.2);
          border-radius: 50%;
          color: #e8c470;
          font-size: 8px;
        }

        .questionGrid strong {
          display: block;
          margin-top: 25px;
          font: 700 20px Georgia, serif;
          line-height: 1.15;
        }

        .questionGrid p {
          margin: 11px 0 0;
          color: #8298a2;
          font-size: 10px;
          line-height: 1.6;
        }

        .chainTrack {
          display: grid;
          grid-template-columns: repeat(8, 1fr);
          border: 1px solid rgba(99, 224, 241, 0.15);
          border-radius: 18px;
          overflow: hidden;
          background: rgba(3, 18, 28, 0.82);
        }

        .chainTrack > div {
          min-width: 0;
          min-height: 110px;
          padding: 18px 8px;
          position: relative;
          display: grid;
          place-items: center;
          align-content: center;
          border-right: 1px solid rgba(255, 255, 255, 0.06);
          text-align: center;
        }

        .chainTrack > div:last-child {
          border-right: 0;
        }

        .chainTrack span {
          color: #5f8490;
          font-size: 8px;
        }

        .chainTrack strong {
          margin-top: 8px;
          color: #dbe8eb;
          font-size: 10px;
        }

        .chainTrack i {
          position: absolute;
          right: -7px;
          top: 50%;
          z-index: 2;
          color: #d6ac4d;
          font-style: normal;
        }

        .chainExplanation {
          margin-top: 14px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .chainExplanation article {
          padding: 22px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 16px;
          background: rgba(6, 24, 35, 0.72);
        }

        .chainExplanation span {
          color: #69dbe8;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.12em;
        }

        .chainExplanation strong {
          display: block;
          margin-top: 11px;
          font: 700 20px Georgia, serif;
        }

        .chainExplanation p {
          margin: 10px 0 0;
          color: #879da6;
          font-size: 11px;
          line-height: 1.6;
        }

        .academySection {
          display: grid;
          grid-template-columns: 0.8fr 1.2fr;
          gap: 58px;
          align-items: center;
          border-top: 1px solid rgba(99, 224, 241, 0.12);
          border-bottom: 1px solid rgba(99, 224, 241, 0.12);
        }

        .academyVisual {
          height: 520px;
          position: relative;
          display: grid;
          place-items: center;
        }

        .academySeal {
          width: 250px;
          height: 250px;
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border: 2px solid #65eeb5;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(98, 240, 180, 0.16), rgba(3, 27, 28, 0.95));
          box-shadow: 0 0 70px rgba(75, 232, 172, 0.18);
        }

        .academySeal small {
          color: #73bca4;
          font-size: 10px;
          font-weight: 950;
          letter-spacing: 0.16em;
        }

        .academySeal strong {
          color: #baffda;
          font: 700 42px Georgia, serif;
        }

        .academySeal span {
          margin-top: 8px;
          color: #68d8b0;
          font-size: 8px;
          font-weight: 950;
          letter-spacing: 0.14em;
        }

        .academyOrbit {
          position: absolute;
          border: 1px solid rgba(98, 240, 180, 0.25);
          border-radius: 50%;
          animation: orbitSpin 24s linear infinite;
        }

        .academyOrbit.orbitA {
          width: 330px;
          height: 440px;
        }

        .academyOrbit.orbitB {
          width: 460px;
          height: 270px;
          transform: rotate(35deg);
          animation-direction: reverse;
        }

        .academyOrbit.orbitC {
          width: 500px;
          height: 500px;
          border-color: rgba(255, 209, 92, 0.13);
          animation-duration: 36s;
        }

        .academyCopy > p {
          margin-top: 18px;
        }

        .academyGrid {
          margin-top: 25px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 9px;
        }

        .academyGrid article {
          padding: 14px;
          display: grid;
          grid-template-columns: 46px 1fr;
          gap: 12px;
          border: 1px solid rgba(99, 232, 184, 0.14);
          border-radius: 13px;
          background: rgba(255, 255, 255, 0.022);
        }

        .academyGrid article > span {
          width: 44px;
          height: 44px;
          display: grid;
          place-items: center;
          border: 1px solid #62eeb5;
          border-radius: 10px;
          color: #83f3c1;
          font-size: 8px;
          font-weight: 950;
        }

        .academyGrid strong {
          font-size: 11px;
        }

        .academyGrid p {
          margin: 5px 0 0;
          color: #7e9995;
          font-size: 9px;
          line-height: 1.42;
        }

        .academyActions {
          margin-top: 22px;
          display: flex;
          flex-wrap: wrap;
          gap: 9px;
        }

        .academyActions .academyButton {
          color: #031611;
          border-color: #9cf3c8;
          background: linear-gradient(135deg, #c9ffe8, #59eeab 65%, #219c6b);
        }

        .closingSection {
          position: relative;
          text-align: center;
          padding-bottom: 78px;
        }

        .closingGlow {
          position: absolute;
          left: 50%;
          top: 20px;
          width: 850px;
          height: 360px;
          transform: translateX(-50%);
          background: radial-gradient(ellipse, rgba(92, 222, 239, 0.13), transparent 68%);
          filter: blur(22px);
          pointer-events: none;
        }

        .closingSection > p:not(.eyebrow) {
          max-width: 870px;
          margin: 20px auto 0;
        }

        .closingChain {
          margin-top: 38px;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 8px;
        }

        .closingChain span {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #879fa8;
          font-size: 10px;
          font-weight: 900;
        }

        .closingChain i {
          color: #e6b94e;
          font-style: normal;
        }

        .finalRule {
          display: block;
          margin-top: 24px;
          color: #ffe39b;
          font: 700 21px Georgia, serif;
        }

        footer {
          min-height: 80px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          border-top: 1px solid rgba(99, 224, 241, 0.12);
          color: #607d88;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.08em;
        }

        @keyframes drift {
          to {
            transform: translate3d(60px, -35px, 0) scale(1.08);
          }
        }

        @keyframes packet {
          from {
            left: 0;
          }
          to {
            left: 100%;
          }
        }

        @keyframes orbitSpin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 1180px) {
          .domainGrid {
            grid-template-columns: repeat(2, 1fr);
          }

          .workspaceGrid {
            grid-template-columns: 1fr;
          }

          .topicIndex {
            position: static;
            max-height: none;
          }

          .topicList {
            grid-template-columns: 1fr 1fr;
          }

          .questionGrid {
            grid-template-columns: repeat(2, 1fr);
          }

          .chainTrack {
            grid-template-columns: repeat(4, 1fr);
          }

          .chainTrack > div:nth-child(4) {
            border-right: 0;
          }

          .academySection {
            grid-template-columns: 1fr;
          }

          .academyVisual {
            height: 430px;
          }
        }

        @media (max-width: 900px) {
          .topbar {
            grid-template-columns: 1fr auto;
          }

          .topbarIdentity {
            display: none;
          }

          .metricGrid {
            grid-template-columns: repeat(3, 1fr);
          }

          .definitionBand,
          .sectionHeading,
          .chainExplanation {
            grid-template-columns: 1fr;
          }

          .filterPanel {
            grid-template-columns: 1fr 1fr;
          }

          .searchField {
            grid-column: 1 / -1;
          }

          .recordMetrics {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 700px) {
          .pageShell {
            width: calc(100% - 22px);
          }

          .topbarActions a:first-child {
            display: none;
          }

          .hero {
            padding: 62px 0 56px;
          }

          .hero h1 {
            font-size: 50px;
          }

          .heroLead {
            font-size: 15px;
          }

          .metricGrid,
          .domainGrid,
          .topicList,
          .filterPanel,
          .classificationGrid,
          .questionGrid,
          .chainExplanation,
          .academyGrid {
            grid-template-columns: 1fr;
          }

          .metricGrid {
            grid-template-columns: repeat(2, 1fr);
          }

          .recordHeader {
            align-items: flex-start;
            flex-direction: column;
          }

          .recordMetrics {
            grid-template-columns: 1fr 1fr;
          }

          .recordList > a {
            grid-template-columns: 40px minmax(0, 1fr);
          }

          .recordList > a > b {
            display: none;
          }

          .topicBoundary {
            grid-template-columns: 1fr;
          }

          .recordActions,
          .academyActions,
          .heroActions,
          .closingActions {
            flex-direction: column;
          }

          .recordActions a,
          .academyActions a,
          .heroActions a,
          .closingActions a {
            width: 100%;
          }

          .chainTrack {
            grid-template-columns: 1fr 1fr;
          }

          .academyVisual {
            height: 390px;
            transform: scale(0.82);
            margin: -35px 0;
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
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </main>
  );
}
