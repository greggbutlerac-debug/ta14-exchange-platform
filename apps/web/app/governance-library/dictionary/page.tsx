"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type DictionaryCategory =
  | "role"
  | "risk"
  | "evidence"
  | "assurance"
  | "execution"
  | "oversight"
  | "documentation";

type DictionaryEntry = {
  slug: string;
  term: string;
  acronym?: string;
  summary: string;
  category: DictionaryCategory;
  relatedTerms: string[];
  frameworks: string[];
  evidence: string[];
  ta14Interpretation: string;
  popular?: boolean;
};

const dictionaryEntries: DictionaryEntry[] = [
  {
    slug: "accountability",
    term: "Accountability",
    summary:
      "The assignment and preservation of responsibility for AI decisions, controls, evidence, and outcomes.",
    category: "oversight",
    relatedTerms: [
      "Authority",
      "Responsibility",
      "Auditability",
    ],
    frameworks: [
      "EU AI Act",
      "NIST AI RMF",
      "ISO/IEC 42001",
      "OECD AI Principles",
    ],
    evidence: [
      "Authority record",
      "Approval record",
      "Audit record",
      "Outcome record",
    ],
    ta14Interpretation:
      "Accountability must remain bound to a valid authority and a preserved execution record.",
    popular: true,
  },
  {
    slug: "admissibility",
    term: "Admissibility",
    summary:
      "The condition under which evidence, authority, continuity, and execution requirements are sufficient for a consequential action to proceed.",
    category: "execution",
    relatedTerms: [
      "Evidence",
      "Binding",
      "Execution",
      "Continuity",
    ],
    frameworks: [
      "TA-14 Admissible Execution Architecture",
    ],
    evidence: [
      "Authority record",
      "Evidence package",
      "Continuity record",
      "Execution record",
    ],
    ta14Interpretation:
      "No admissible evidence means no admissible execution.",
    popular: true,
  },
  {
    slug: "assurance",
    term: "Assurance",
    summary:
      "A structured basis for confidence that an AI system, process, or control satisfies defined requirements.",
    category: "assurance",
    relatedTerms: [
      "Validation",
      "Verification",
      "Audit",
      "Conformity Assessment",
    ],
    frameworks: [
      "ISO/IEC 42001",
      "NIST AI RMF",
      "IEEE standards",
    ],
    evidence: [
      "Test result",
      "Validation result",
      "Audit record",
      "Technical documentation",
    ],
    ta14Interpretation:
      "Assurance is not a statement of trust; it is an evidence-bound basis for continued execution.",
    popular: true,
  },
  {
    slug: "authority",
    term: "Authority",
    summary:
      "The valid and attributable basis by which an actor, system, reviewer, or institution is permitted to make or approve a consequential decision.",
    category: "execution",
    relatedTerms: [
      "Accountability",
      "Delegation",
      "Approval",
      "Binding",
    ],
    frameworks: [
      "TA-14 Admissible Execution Architecture",
      "EU AI Act",
      "ISO/IEC 42001",
    ],
    evidence: [
      "Delegation record",
      "Role assignment",
      "Approval record",
      "Policy authority",
    ],
    ta14Interpretation:
      "Authority must be proven, current, attributable, and bounded to the proposed action before execution.",
    popular: true,
  },
  {
    slug: "bias",
    term: "Bias",
    summary:
      "A systematic tendency that can produce unfair, distorted, or unrepresentative AI behavior or outcomes.",
    category: "risk",
    relatedTerms: [
      "Fairness",
      "Discrimination",
      "Representativeness",
      "Impact Assessment",
    ],
    frameworks: [
      "NIST AI RMF",
      "UNESCO AI Ethics",
      "OECD AI Principles",
    ],
    evidence: [
      "Data record",
      "Evaluation result",
      "Impact assessment",
      "Monitoring record",
    ],
    ta14Interpretation:
      "Bias claims must be linked to defined populations, evidence, thresholds, and preserved outcomes.",
    popular: true,
  },
  {
    slug: "binding",
    term: "Binding",
    summary:
      "The act of connecting a proposed decision or execution to the exact identity, evidence, authority, conditions, and controls used to evaluate it.",
    category: "execution",
    relatedTerms: [
      "Admissibility",
      "Continuity",
      "Execution",
      "Evidence",
    ],
    frameworks: [
      "TA-14 Admissible Execution Architecture",
    ],
    evidence: [
      "Decision receipt",
      "Evidence manifest",
      "Identity record",
      "Control configuration",
    ],
    ta14Interpretation:
      "A decision cannot inherit admissibility from evidence that is not bound to the exact action being released.",
    popular: true,
  },
  {
    slug: "conformity-assessment",
    term: "Conformity Assessment",
    summary:
      "A process used to determine whether a system, product, or organization satisfies specified requirements.",
    category: "assurance",
    relatedTerms: [
      "Certification",
      "Assessment",
      "Validation",
      "Technical Documentation",
    ],
    frameworks: ["EU AI Act", "ISO standards"],
    evidence: [
      "Technical documentation",
      "Test result",
      "Audit record",
      "Approval record",
    ],
    ta14Interpretation:
      "Conformity evidence may support admissibility, but it does not independently authorize every execution context.",
    popular: true,
  },
  {
    slug: "continuity",
    term: "Continuity",
    summary:
      "The preserved connection between the system, evidence, authority, controls, decision state, execution, and outcome over time.",
    category: "evidence",
    relatedTerms: [
      "Traceability",
      "Binding",
      "Provenance",
      "Chain of Custody",
    ],
    frameworks: [
      "TA-14 Admissible Execution Architecture",
      "NIST AI RMF",
      "ISO/IEC 42001",
    ],
    evidence: [
      "Version history",
      "Evidence manifest",
      "Execution receipt",
      "Outcome record",
    ],
    ta14Interpretation:
      "When continuity breaks, prior evidence cannot automatically support the current execution state.",
    popular: true,
  },
  {
    slug: "deployer",
    term: "Deployer",
    summary:
      "An entity that uses an AI system under its authority, excluding purely personal, non-professional use.",
    category: "role",
    relatedTerms: [
      "Provider",
      "Operator",
      "User",
      "Human Oversight",
    ],
    frameworks: [
      "EU AI Act",
      "NIST AI RMF",
      "ISO/IEC 42001",
    ],
    evidence: [
      "Use policy",
      "Authority record",
      "Monitoring record",
      "Human oversight record",
    ],
    ta14Interpretation:
      "The deployer must demonstrate valid authority, bounded use, and continued admissibility at execution time.",
    popular: true,
  },
  {
    slug: "drift",
    term: "Drift",
    summary:
      "A material change in data, system behavior, operating conditions, controls, or outcomes that may invalidate prior evidence or determinations.",
    category: "risk",
    relatedTerms: [
      "Monitoring",
      "Change Control",
      "Validation",
      "Reassessment",
    ],
    frameworks: [
      "NIST AI RMF",
      "ISO/IEC 42001",
      "EU AI Act",
    ],
    evidence: [
      "Baseline record",
      "Monitoring record",
      "Change record",
      "Revalidation result",
    ],
    ta14Interpretation:
      "Material drift creates admissibility drift and may require HOLD until evidence and controls are revalidated.",
    popular: true,
  },
  {
    slug: "evidence",
    term: "Evidence",
    summary:
      "Recorded information used to support a claim, determination, authority, control, decision, execution, or outcome.",
    category: "evidence",
    relatedTerms: [
      "Admissibility",
      "Provenance",
      "Continuity",
      "Verification",
    ],
    frameworks: [
      "TA-14 Admissible Execution Architecture",
      "ISO/IEC 42001",
      "NIST AI RMF",
    ],
    evidence: [
      "Source record",
      "Measurement",
      "Test result",
      "Decision record",
    ],
    ta14Interpretation:
      "Evidence becomes admissible only when its identity, provenance, relevance, continuity, integrity, and authority are sufficient for the proposed action.",
    popular: true,
  },
  {
    slug: "explainability",
    term: "Explainability",
    summary:
      "The extent to which the reasons, factors, or logic behind an AI output can be meaningfully communicated.",
    category: "documentation",
    relatedTerms: [
      "Transparency",
      "Interpretability",
      "Traceability",
    ],
    frameworks: [
      "NIST AI RMF",
      "OECD AI Principles",
      "UNESCO AI Ethics",
    ],
    evidence: [
      "Model record",
      "System card",
      "Decision record",
      "User notice",
    ],
    ta14Interpretation:
      "An explanation must remain tied to the actual evidence and decision state that existed at execution time.",
    popular: true,
  },
  {
    slug: "foundation-model",
    term: "Foundation Model",
    summary:
      "A broadly capable model trained on extensive data and adaptable to many downstream tasks.",
    category: "risk",
    relatedTerms: [
      "GPAI",
      "Model Provider",
      "Downstream System",
    ],
    frameworks: ["EU AI Act", "NIST AI RMF"],
    evidence: [
      "Model record",
      "Training record",
      "Evaluation result",
      "Supplier record",
    ],
    ta14Interpretation:
      "Foundation-model evidence must be bounded from downstream deployment evidence and execution authority.",
    popular: true,
  },
  {
    slug: "gpai",
    term: "General-Purpose AI",
    acronym: "GPAI",
    summary:
      "An AI model capable of performing a broad range of tasks and being integrated into multiple downstream systems.",
    category: "risk",
    relatedTerms: [
      "Foundation Model",
      "GPAI Provider",
      "Systemic Risk",
    ],
    frameworks: ["EU AI Act"],
    evidence: [
      "Model documentation",
      "Evaluation result",
      "Copyright policy",
      "Risk assessment",
    ],
    ta14Interpretation:
      "General capability does not establish admissibility for a specific consequential use.",
    popular: true,
  },
  {
    slug: "high-risk-ai",
    term: "High-Risk AI",
    summary:
      "An AI use or system category subject to heightened governance obligations because of its potential effects on safety or fundamental rights.",
    category: "risk",
    relatedTerms: [
      "Risk Classification",
      "Conformity Assessment",
      "Post-Market Monitoring",
    ],
    frameworks: ["EU AI Act"],
    evidence: [
      "Risk assessment",
      "Technical documentation",
      "Validation result",
      "Monitoring record",
    ],
    ta14Interpretation:
      "High-risk classification increases the evidence, authority, continuity, and oversight conditions required before execution.",
    popular: true,
  },
  {
    slug: "human-oversight",
    term: "Human Oversight",
    summary:
      "Human involvement designed to understand, supervise, interrupt, override, or otherwise govern AI operation.",
    category: "oversight",
    relatedTerms: [
      "Intervention",
      "Override",
      "Escalation",
      "Accountability",
    ],
    frameworks: [
      "EU AI Act",
      "NIST AI RMF",
      "ISO/IEC 42001",
    ],
    evidence: [
      "Human oversight record",
      "Training record",
      "Approval record",
      "Incident record",
    ],
    ta14Interpretation:
      "Human presence is not enough; the human must possess valid authority, usable evidence, and a defined intervention path.",
    popular: true,
  },
  {
    slug: "outcome-evidence",
    term: "Outcome Evidence",
    summary:
      "Preserved evidence showing what happened after a governed action was executed and whether the intended control or intervention worked.",
    category: "evidence",
    relatedTerms: [
      "Execution Record",
      "Performance",
      "Monitoring",
      "Corrective Action",
    ],
    frameworks: [
      "TA-14 Admissible Execution Architecture",
      "NIST AI RMF",
      "ISO/IEC 42001",
    ],
    evidence: [
      "Post-execution measurement",
      "Outcome receipt",
      "Incident record",
      "Performance comparison",
    ],
    ta14Interpretation:
      "Controlled execution is incomplete until the resulting condition is preserved and evaluated.",
    popular: true,
  },
  {
    slug: "post-market-monitoring",
    term: "Post-Market Monitoring",
    summary:
      "The ongoing collection and evaluation of information about system performance after deployment.",
    category: "oversight",
    relatedTerms: [
      "Monitoring",
      "Incident Reporting",
      "Corrective Action",
      "Drift",
    ],
    frameworks: ["EU AI Act", "ISO/IEC 42001"],
    evidence: [
      "Monitoring record",
      "Incident record",
      "Change record",
      "Outcome record",
    ],
    ta14Interpretation:
      "New evidence must trigger revalidation when it changes the admissibility of continued execution.",
    popular: true,
  },
  {
    slug: "provider",
    term: "Provider",
    summary:
      "An entity that develops an AI system or general-purpose AI model and places it on the market or puts it into service under its own name or trademark.",
    category: "role",
    relatedTerms: [
      "Deployer",
      "Importer",
      "Distributor",
      "GPAI Provider",
    ],
    frameworks: [
      "EU AI Act",
      "ISO/IEC 42001",
      "NIST AI RMF",
    ],
    evidence: [
      "Technical documentation",
      "Model record",
      "Risk assessment",
      "Validation result",
    ],
    ta14Interpretation:
      "The provider is responsible for establishing a defensible evidence basis, but downstream execution must still be independently admissible.",
    popular: true,
  },
  {
    slug: "provenance",
    term: "Provenance",
    summary:
      "The attributable history of where evidence, data, documentation, or a decision originated and how it changed over time.",
    category: "evidence",
    relatedTerms: [
      "Traceability",
      "Chain of Custody",
      "Continuity",
      "Attribution",
    ],
    frameworks: [
      "NIST AI RMF",
      "ISO/IEC 42001",
      "TA-14 Admissible Execution Architecture",
    ],
    evidence: [
      "Source identifier",
      "Creation record",
      "Modification history",
      "Custody record",
    ],
    ta14Interpretation:
      "Unproven provenance weakens evidence identity and can prevent admissibility.",
    popular: true,
  },
  {
    slug: "technical-documentation",
    term: "Technical Documentation",
    summary:
      "Structured records describing a system's design, intended purpose, capabilities, limitations, controls, testing, and changes.",
    category: "documentation",
    relatedTerms: [
      "System Card",
      "Model Card",
      "Instructions for Use",
      "Traceability",
    ],
    frameworks: ["EU AI Act", "ISO/IEC 42001"],
    evidence: [
      "System record",
      "Model record",
      "Test result",
      "Change record",
    ],
    ta14Interpretation:
      "Documentation supports admissibility only when it is current, attributable, complete enough for the decision, and bound to the executing system.",
    popular: true,
  },
  {
    slug: "validation",
    term: "Validation",
    summary:
      "Evidence that a system is suitable for its intended use and performs acceptably in the relevant context.",
    category: "assurance",
    relatedTerms: [
      "Verification",
      "Testing",
      "Evaluation",
      "Intended Purpose",
    ],
    frameworks: [
      "NIST AI RMF",
      "ISO/IEC 42001",
      "EU AI Act",
    ],
    evidence: [
      "Validation result",
      "Test result",
      "Evaluation result",
      "Approval record",
    ],
    ta14Interpretation:
      "Validation must remain context-specific and cannot be inherited indefinitely after material change or drift.",
    popular: true,
  },
];

const categoryOptions: Array<{
  value: "all" | DictionaryCategory;
  label: string;
}> = [
  { value: "all", label: "All categories" },
  { value: "role", label: "Roles" },
  { value: "risk", label: "Risk and classification" },
  { value: "evidence", label: "Evidence" },
  { value: "assurance", label: "Assurance" },
  { value: "execution", label: "Execution" },
  { value: "oversight", label: "Oversight" },
  { value: "documentation", label: "Documentation" },
];

function titleCase(value: string) {
  return value
    .split("-")
    .map(
      (part) =>
        part.charAt(0).toUpperCase() + part.slice(1),
    )
    .join(" ");
}

function normalize(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export default function GovernanceDictionaryPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<
    "all" | DictionaryCategory
  >("all");
  const [letter, setLetter] = useState("ALL");
  const [expandedSlug, setExpandedSlug] = useState<
    string | null
  >(dictionaryEntries[0]?.slug ?? null);

  const availableLetters = useMemo(
    () =>
      Array.from(
        new Set(
          dictionaryEntries.map((entry) =>
            entry.term.charAt(0).toUpperCase(),
          ),
        ),
      ).sort(),
    [],
  );

  const filteredEntries = useMemo(() => {
    const normalizedQuery = normalize(query);

    return dictionaryEntries
      .filter((entry) => {
        const categoryMatches =
          category === "all" ||
          entry.category === category;

        const letterMatches =
          letter === "ALL" ||
          entry.term
            .toUpperCase()
            .startsWith(letter);

        const searchable = normalize(
          [
            entry.term,
            entry.acronym ?? "",
            entry.summary,
            entry.category,
            ...entry.relatedTerms,
            ...entry.frameworks,
            ...entry.evidence,
            entry.ta14Interpretation,
          ].join(" "),
        );

        const queryMatches =
          normalizedQuery.length === 0 ||
          normalizedQuery
            .split(" ")
            .every((token) =>
              searchable.includes(token),
            );

        return (
          categoryMatches &&
          letterMatches &&
          queryMatches
        );
      })
      .sort((a, b) =>
        a.term.localeCompare(b.term),
      );
  }, [category, letter, query]);

  const categoryCounts = useMemo(
    () =>
      categoryOptions
        .filter(
          (
            option,
          ): option is {
            value: DictionaryCategory;
            label: string;
          } => option.value !== "all",
        )
        .map((option) => ({
          ...option,
          count: dictionaryEntries.filter(
            (entry) =>
              entry.category === option.value,
          ).length,
        })),
    [],
  );

  const frameworkCount = useMemo(
    () =>
      new Set(
        dictionaryEntries.flatMap(
          (entry) => entry.frameworks,
        ),
      ).size,
    [],
  );

  const evidenceTypeCount = useMemo(
    () =>
      new Set(
        dictionaryEntries.flatMap(
          (entry) => entry.evidence,
        ),
      ).size,
    [],
  );

  function clearFilters() {
    setQuery("");
    setCategory("all");
    setLetter("ALL");
  }

  return (
    <main className="dictionaryPage">
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
            Governed terminology workspace
          </div>

          <Link
            href="/governance-library/applicability"
            className="topbarAction"
          >
            Run Applicability →
          </Link>
        </div>

        <header className="hero">
          <div className="heroSeal">
            <span>GD</span>
            <small>TA-14</small>
          </div>

          <p className="eyebrow">
            TA-14 GOVERNED KNOWLEDGE SYSTEM
          </p>

          <h1>
            AI Governance
            <span> Dictionary</span>
          </h1>

          <p className="lead">
            Navigate the roles, evidence concepts,
            assurance methods, risk classifications,
            documentation duties, and execution
            principles used across AI governance. Each
            entry separates general terminology from
            the TA-14 admissible-execution
            interpretation.
          </p>

          <div className="heroMetrics">
            <article>
              <span>{dictionaryEntries.length}</span>
              <small>Governance terms</small>
            </article>

            <article>
              <span>{categoryCounts.length}</span>
              <small>Knowledge categories</small>
            </article>

            <article>
              <span>{frameworkCount}</span>
              <small>Referenced authorities</small>
            </article>

            <article>
              <span>{evidenceTypeCount}</span>
              <small>Evidence types</small>
            </article>

            <article>
              <span>{availableLetters.length}</span>
              <small>Indexed letters</small>
            </article>
          </div>
        </header>

        <section className="searchSection">
          <div className="sectionHeading">
            <div>
              <p className="eyebrow">
                TERMINOLOGY CONTROL DESK
              </p>

              <h2>
                Find the term. Inspect its boundary.
              </h2>
            </div>

            <p>
              Definitions can change by jurisdiction,
              authority, version, system role, and use
              context. Dictionary entries support
              navigation; the controlling source remains
              authoritative.
            </p>
          </div>

          <div className="searchPanel">
            <label className="searchField">
              Search the dictionary
              <input
                type="search"
                value={query}
                onChange={(event) =>
                  setQuery(event.target.value)
                }
                placeholder="Search provider, GPAI, evidence, validation, authority..."
              />
            </label>

            <label>
              Governance category
              <select
                value={category}
                onChange={(event) =>
                  setCategory(
                    event.target.value as
                      | "all"
                      | DictionaryCategory,
                  )
                }
              >
                {categoryOptions.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <button
              type="button"
              onClick={clearFilters}
              className="clearButton"
            >
              Clear filters
            </button>
          </div>

          <div className="alphabetPanel">
            <div>
              <span>Alphabetical index</span>
              <small>
                Select a letter to constrain the
                dictionary record set.
              </small>
            </div>

            <div className="alphabetList">
              <button
                type="button"
                className={
                  letter === "ALL" ? "active" : ""
                }
                onClick={() => setLetter("ALL")}
              >
                All
              </button>

              {availableLetters.map(
                (availableLetter) => (
                  <button
                    key={availableLetter}
                    type="button"
                    className={
                      letter === availableLetter
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      setLetter(availableLetter)
                    }
                  >
                    {availableLetter}
                  </button>
                ),
              )}
            </div>
          </div>
        </section>

        <section className="categorySection">
          <div className="sectionHeading compact">
            <div>
              <p className="eyebrow">
                KNOWLEDGE DISTRIBUTION
              </p>

              <h2>
                Browse by governance function.
              </h2>
            </div>
          </div>

          <div className="categoryGrid">
            {categoryCounts.map((item) => (
              <button
                key={item.value}
                type="button"
                className={
                  category === item.value
                    ? "categoryCard active"
                    : "categoryCard"
                }
                onClick={() =>
                  setCategory(item.value)
                }
              >
                <span>
                  {String(item.count).padStart(2, "0")}
                </span>

                <strong>{item.label}</strong>

                <small>
                  Review terminology classified under{" "}
                  {item.label.toLowerCase()}.
                </small>
              </button>
            ))}
          </div>
        </section>

        <section className="resultsSection">
          <div className="resultsHeading">
            <div>
              <p className="eyebrow">
                DICTIONARY RESULTS
              </p>

              <h2>
                {filteredEntries.length}{" "}
                {filteredEntries.length === 1
                  ? "term"
                  : "terms"}{" "}
                available
              </h2>
            </div>

            <div className="filterCondition">
              <span>Current condition</span>
              <strong>
                {category === "all"
                  ? "All categories"
                  : titleCase(category)}
                {" · "}
                {letter === "ALL"
                  ? "All letters"
                  : `Letter ${letter}`}
              </strong>
            </div>
          </div>

          {filteredEntries.length === 0 ? (
            <div className="emptyState">
              <div className="emptySeal">00</div>

              <h3>No dictionary term matched.</h3>

              <p>
                Broaden the search, select another
                category, or return to the complete
                alphabetical index.
              </p>

              <button
                type="button"
                onClick={clearFilters}
              >
                Restore dictionary
              </button>
            </div>
          ) : (
            <div className="dictionaryGrid">
              {filteredEntries.map(
                (entry, index) => {
                  const expanded =
                    expandedSlug === entry.slug;

                  return (
                    <article
                      id={entry.slug}
                      key={entry.slug}
                      className={
                        expanded
                          ? "entryCard expanded"
                          : "entryCard"
                      }
                    >
                      <button
                        type="button"
                        className="entryHeader"
                        onClick={() =>
                          setExpandedSlug(
                            expanded
                              ? null
                              : entry.slug,
                          )
                        }
                      >
                        <span className="entryNumber">
                          {String(index + 1).padStart(
                            2,
                            "0",
                          )}
                        </span>

                        <span className="entryIdentity">
                          <small>
                            {titleCase(
                              entry.category,
                            )}
                          </small>

                          <strong>
                            {entry.term}
                          </strong>

                          {entry.acronym ? (
                            <em>
                              {entry.acronym}
                            </em>
                          ) : null}
                        </span>

                        <span className="entryToggle">
                          {expanded ? "−" : "+"}
                        </span>
                      </button>

                      <div className="entrySummary">
                        <p>{entry.summary}</p>
                      </div>

                      {expanded ? (
                        <div className="entryDetails">
                          <div className="detailGrid">
                            <section>
                              <div className="detailHeading">
                                <span>Frameworks</span>
                                <strong>
                                  {
                                    entry.frameworks
                                      .length
                                  }
                                </strong>
                              </div>

                              <ul>
                                {entry.frameworks.map(
                                  (framework) => (
                                    <li
                                      key={framework}
                                    >
                                      {framework}
                                    </li>
                                  ),
                                )}
                              </ul>
                            </section>

                            <section>
                              <div className="detailHeading">
                                <span>
                                  Related terms
                                </span>
                                <strong>
                                  {
                                    entry.relatedTerms
                                      .length
                                  }
                                </strong>
                              </div>

                              <div className="tagList">
                                {entry.relatedTerms.map(
                                  (relatedTerm) => (
                                    <span
                                      key={
                                        relatedTerm
                                      }
                                    >
                                      {relatedTerm}
                                    </span>
                                  ),
                                )}
                              </div>
                            </section>

                            <section>
                              <div className="detailHeading">
                                <span>
                                  Associated evidence
                                </span>
                                <strong>
                                  {
                                    entry.evidence
                                      .length
                                  }
                                </strong>
                              </div>

                              <div className="evidenceList">
                                {entry.evidence.map(
                                  (
                                    evidence,
                                    evidenceIndex,
                                  ) => (
                                    <div
                                      key={evidence}
                                    >
                                      <span>
                                        {String(
                                          evidenceIndex +
                                            1,
                                        ).padStart(
                                          2,
                                          "0",
                                        )}
                                      </span>

                                      <p>
                                        {evidence}
                                      </p>
                                    </div>
                                  ),
                                )}
                              </div>
                            </section>
                          </div>

                          <section className="ta14Interpretation">
                            <div className="interpretationSeal">
                              T14
                            </div>

                            <div>
                              <span>
                                TA-14 interpretation
                              </span>

                              <p>
                                {
                                  entry.ta14Interpretation
                                }
                              </p>
                            </div>
                          </section>

                          <div className="entryActions">
                            <Link
                              href="/governance-library/crosswalks"
                              className="secondaryAction"
                            >
                              Compare Authorities
                            </Link>

                            <Link
                              href="/governance-library/testing"
                              className="secondaryAction"
                            >
                              Open Testing
                            </Link>

                            <Link
                              href="/workspace/ai-governance"
                              className="primaryAction"
                            >
                              Build Governed Route →
                            </Link>
                          </div>
                        </div>
                      ) : null}
                    </article>
                  );
                },
              )}
            </div>
          )}
        </section>

        <section className="sequenceSection">
          <div className="sectionHeading">
            <div>
              <p className="eyebrow">
                TERMINOLOGY GOVERNANCE SEQUENCE
              </p>

              <h2>
                Definitions inform the route. They do
                not control it alone.
              </h2>
            </div>
          </div>

          <div className="sequenceGrid">
            {[
              {
                code: "01",
                title: "Identify",
                description:
                  "Locate the governing term and its apparent source context.",
              },
              {
                code: "02",
                title: "Distinguish",
                description:
                  "Separate similar terms, roles, evidence types, and legal effects.",
              },
              {
                code: "03",
                title: "Verify",
                description:
                  "Review the controlling authority, version, jurisdiction, and scope.",
              },
              {
                code: "04",
                title: "Apply",
                description:
                  "Determine whether the term governs the declared entity and use.",
              },
              {
                code: "05",
                title: "Bind",
                description:
                  "Bind the meaning to the evidence, authority, decision, and action.",
              },
              {
                code: "06",
                title: "Preserve",
                description:
                  "Preserve the interpretation used at decision and execution time.",
              },
            ].map((step) => (
              <article key={step.code}>
                <span>{step.code}</span>
                <strong>{step.title}</strong>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="boundarySection">
          <div className="boundarySeal">
            <span>DB</span>
            <small>Dictionary boundary</small>
          </div>

          <p className="eyebrow gold">
            TERMINOLOGY BOUNDARY
          </p>

          <h2>
            A definition is not a legal or execution
            determination.
          </h2>

          <p>
            Dictionary entries organize governance
            language and explain TA-14
            admissible-execution implications. They do
            not independently establish applicability,
            conformity, compliance, certification,
            authority, admissibility, or permission to
            execute. The controlling source,
            jurisdiction, version, role, evidence, and
            declared operating context must still be
            reviewed.
          </p>

          <div className="boundaryGrid">
            <article>
              <span>DICTIONARY PROVIDES</span>
              <strong>
                Structured terminology, related
                concepts, evidence associations, and
                TA-14 interpretation
              </strong>
            </article>

            <article>
              <span>DICTIONARY DOES NOT PROVIDE</span>
              <strong>
                Legal advice, certification, conformity,
                compliance, or execution authority
              </strong>
            </article>

            <article>
              <span>REQUIRED NEXT STEP</span>
              <strong>
                Verify the source, determine
                applicability, test the evidence, and
                govern execution
              </strong>
            </article>
          </div>

          <div className="boundaryActions">
            <Link
              href="/governance-library/applicability"
              className="secondaryAction"
            >
              Run Applicability
            </Link>

            <Link
              href="/governance-library/crosswalks"
              className="secondaryAction"
            >
              Open Crosswalk Engine
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
        .dictionaryPage {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          color: #f5fbff;
          background:
            radial-gradient(
              circle at 50% -8%,
              rgba(37, 145, 192, 0.17),
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
          border: 1px solid
            rgba(255, 255, 255, 0.09);
          border-radius: 19px;
          background: linear-gradient(
            180deg,
            rgba(8, 26, 42, 0.88),
            rgba(4, 15, 26, 0.76)
          );
          box-shadow:
            0 16px 50px rgba(0, 0, 0, 0.28),
            inset 0 1px
              rgba(255, 255, 255, 0.03);
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
          border: 1px solid
            rgba(255, 255, 255, 0.1);
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
          border: 1px solid
            rgba(255, 255, 255, 0.1);
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
          box-shadow: 0 0 15px
            rgba(114, 230, 178, 0.9);
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
          border: 1px solid
            rgba(255, 198, 82, 0.37);
          border-radius: 50%;
          background:
            radial-gradient(
              circle at 50% 35%,
              rgba(255, 220, 146, 0.16),
              transparent 36%
            ),
            rgba(4, 18, 30, 0.96);
          box-shadow:
            0 0 60px
              rgba(255, 193, 64, 0.09),
            inset 0 0 28px
              rgba(255, 255, 255, 0.03);
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
          font-family: Georgia, "Times New Roman",
            serif;
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
          grid-template-columns: repeat(
            5,
            minmax(0, 1fr)
          );
          gap: 12px;
        }

        .heroMetrics article {
          padding: 18px;
          border: 1px solid
            rgba(255, 255, 255, 0.07);
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

        .searchSection,
        .categorySection,
        .resultsSection,
        .sequenceSection {
          padding-top: 80px;
        }

        .sectionHeading {
          margin-bottom: 31px;
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          align-items: end;
          gap: 40px;
        }

        .sectionHeading.compact {
          grid-template-columns: 1fr;
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

        .searchPanel {
          padding: 20px;
          display: grid;
          grid-template-columns:
            minmax(0, 1fr) 280px auto;
          align-items: end;
          gap: 13px;
          border: 1px solid
            rgba(99, 230, 255, 0.12);
          border-radius: 21px;
          background: linear-gradient(
            145deg,
            rgba(9, 29, 44, 0.95),
            rgba(3, 13, 22, 0.98)
          );
          box-shadow: 0 24px 60px
            rgba(0, 0, 0, 0.27);
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
          min-height: 48px;
          box-sizing: border-box;
          padding: 0 13px;
          border: 1px solid
            rgba(255, 255, 255, 0.1);
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
          border-color: rgba(
            99,
            230,
            255,
            0.42
          );
          box-shadow: 0 0 0 3px
            rgba(99, 230, 255, 0.06);
        }

        select option {
          color: #e8f2f5;
          background: #071520;
        }

        .clearButton {
          min-height: 48px;
          padding: 0 17px;
          border: 1px solid
            rgba(255, 255, 255, 0.1);
          border-radius: 11px;
          color: #b7c9d1;
          background: rgba(0, 0, 0, 0.18);
          cursor: pointer;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.07em;
          text-transform: uppercase;
        }

        .alphabetPanel {
          margin-top: 14px;
          padding: 18px;
          display: grid;
          grid-template-columns: 240px minmax(0, 1fr);
          align-items: center;
          gap: 18px;
          border: 1px solid
            rgba(255, 255, 255, 0.07);
          border-radius: 18px;
          background: rgba(6, 20, 32, 0.58);
        }

        .alphabetPanel > div:first-child {
          display: grid;
          gap: 6px;
        }

        .alphabetPanel span {
          color: #79ddeb;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .alphabetPanel small {
          color: #718995;
          font-size: 9px;
          line-height: 1.5;
        }

        .alphabetList {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
        }

        .alphabetList button {
          width: 40px;
          height: 40px;
          border: 1px solid
            rgba(255, 255, 255, 0.08);
          border-radius: 10px;
          color: #8ea3ad;
          background: rgba(0, 0, 0, 0.17);
          cursor: pointer;
          font-size: 9px;
          font-weight: 900;
          transition:
            border-color 0.2s,
            color 0.2s,
            background 0.2s;
        }

        .alphabetList button:first-child {
          width: 54px;
        }

        .alphabetList button:hover,
        .alphabetList button.active {
          color: #e7f7fa;
          border-color: rgba(
            99,
            230,
            255,
            0.32
          );
          background: rgba(99, 230, 255, 0.08);
        }

        .categoryGrid {
          display: grid;
          grid-template-columns: repeat(
            4,
            minmax(0, 1fr)
          );
          gap: 13px;
        }

        .categoryCard {
          min-height: 180px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          border: 1px solid
            rgba(99, 230, 255, 0.1);
          border-radius: 18px;
          color: inherit;
          background: linear-gradient(
            145deg,
            rgba(9, 28, 43, 0.92),
            rgba(3, 12, 21, 0.98)
          );
          cursor: pointer;
          text-align: left;
          transition:
            transform 0.22s,
            border-color 0.22s;
        }

        .categoryCard:hover,
        .categoryCard.active {
          transform: translateY(-4px);
          border-color: rgba(
            99,
            230,
            255,
            0.3
          );
        }

        .categoryCard > span {
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;
          border: 1px solid
            rgba(255, 198, 82, 0.22);
          border-radius: 50%;
          color: #efc875;
          font-size: 8px;
          font-weight: 900;
        }

        .categoryCard strong {
          margin-top: 25px;
          color: #e0eaee;
          font: 700 18px Georgia, serif;
        }

        .categoryCard small {
          margin-top: 10px;
          color: #7e949e;
          font-size: 10px;
          line-height: 1.5;
        }

        .resultsHeading {
          margin-bottom: 23px;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 25px;
        }

        .resultsHeading h2 {
          margin: 10px 0 0;
          font-size: clamp(34px, 4vw, 55px);
          line-height: 1;
          letter-spacing: -0.04em;
        }

        .filterCondition {
          min-width: 235px;
          padding: 15px;
          border: 1px solid
            rgba(255, 255, 255, 0.07);
          border-radius: 14px;
          background: rgba(0, 0, 0, 0.16);
        }

        .filterCondition span {
          display: block;
          color: #718995;
          font-size: 7px;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .filterCondition strong {
          display: block;
          margin-top: 6px;
          color: #d7e5e9;
          font-size: 10px;
        }

        .dictionaryGrid {
          display: grid;
          gap: 13px;
        }

        .entryCard {
          overflow: hidden;
          border: 1px solid
            rgba(255, 255, 255, 0.08);
          border-radius: 19px;
          background: linear-gradient(
            145deg,
            rgba(8, 27, 42, 0.93),
            rgba(3, 12, 21, 0.98)
          );
          transition:
            border-color 0.22s,
            box-shadow 0.22s;
        }

        .entryCard.expanded {
          border-color: rgba(
            99,
            230,
            255,
            0.23
          );
          box-shadow: 0 24px 60px
            rgba(0, 0, 0, 0.25);
        }

        .entryHeader {
          width: 100%;
          padding: 20px;
          display: grid;
          grid-template-columns:
            47px minmax(0, 1fr) 42px;
          align-items: center;
          gap: 15px;
          border: 0;
          color: inherit;
          background: transparent;
          cursor: pointer;
          text-align: left;
        }

        .entryNumber {
          width: 47px;
          height: 47px;
          display: grid;
          place-items: center;
          border: 1px solid
            rgba(99, 230, 255, 0.14);
          border-radius: 12px;
          color: #6fdced;
          font-size: 8px;
          font-weight: 900;
        }

        .entryIdentity {
          min-width: 0;
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 8px 11px;
        }

        .entryIdentity small {
          width: 100%;
          color: #70909c;
          font-size: 7px;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .entryIdentity strong {
          color: #e2edef;
          font: 700 24px Georgia, serif;
        }

        .entryIdentity em {
          padding: 5px 8px;
          border: 1px solid
            rgba(255, 198, 82, 0.2);
          border-radius: 999px;
          color: #efc875;
          background: rgba(
            255,
            198,
            82,
            0.05
          );
          font-size: 8px;
          font-style: normal;
          font-weight: 900;
          letter-spacing: 0.08em;
        }

        .entryToggle {
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;
          border: 1px solid
            rgba(255, 255, 255, 0.08);
          border-radius: 50%;
          color: #8bddec;
          background: rgba(0, 0, 0, 0.15);
          font-size: 19px;
        }

        .entrySummary {
          padding: 0 20px 20px 82px;
        }

        .entrySummary p {
          max-width: 1030px;
          margin: 0;
          color: #9db0b9;
          font-size: 13px;
          line-height: 1.65;
        }

        .entryDetails {
          padding: 22px;
          border-top: 1px solid
            rgba(255, 255, 255, 0.06);
          background: rgba(0, 0, 0, 0.12);
        }

        .detailGrid {
          display: grid;
          grid-template-columns: repeat(
            3,
            minmax(0, 1fr)
          );
          gap: 13px;
        }

        .detailGrid > section {
          padding: 18px;
          border: 1px solid
            rgba(255, 255, 255, 0.07);
          border-radius: 16px;
          background: rgba(0, 0, 0, 0.14);
        }

        .detailHeading {
          padding-bottom: 13px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          border-bottom: 1px solid
            rgba(255, 255, 255, 0.06);
        }

        .detailHeading span {
          color: #76ddec;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .detailHeading strong {
          color: #edca80;
          font: 700 18px Georgia, serif;
        }

        .detailGrid ul {
          margin: 14px 0 0;
          padding-left: 18px;
          color: #a0b2ba;
          font-size: 11px;
          line-height: 1.75;
        }

        .tagList {
          margin-top: 14px;
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
        }

        .tagList span {
          padding: 7px 9px;
          border: 1px solid
            rgba(255, 255, 255, 0.07);
          border-radius: 999px;
          color: #9fb2bb;
          background: rgba(0, 0, 0, 0.16);
          font-size: 8px;
        }

        .evidenceList {
          margin-top: 13px;
          display: grid;
          gap: 8px;
        }

        .evidenceList div {
          display: grid;
          grid-template-columns: 30px minmax(0, 1fr);
          align-items: center;
          gap: 9px;
        }

        .evidenceList div span {
          width: 30px;
          height: 30px;
          display: grid;
          place-items: center;
          border: 1px solid
            rgba(99, 230, 255, 0.12);
          border-radius: 8px;
          color: #69d9ea;
          font-size: 7px;
          font-weight: 900;
        }

        .evidenceList p {
          margin: 0;
          color: #9eb1b9;
          font-size: 10px;
        }

        .ta14Interpretation {
          margin-top: 13px;
          padding: 19px;
          display: grid;
          grid-template-columns: 58px minmax(0, 1fr);
          align-items: center;
          gap: 16px;
          border: 1px solid
            rgba(255, 198, 82, 0.19);
          border-radius: 16px;
          background:
            radial-gradient(
              circle at 0 0,
              rgba(255, 198, 82, 0.07),
              transparent 34%
            ),
            rgba(0, 0, 0, 0.16);
        }

        .interpretationSeal {
          width: 58px;
          height: 58px;
          display: grid;
          place-items: center;
          border: 1px solid
            rgba(255, 198, 82, 0.25);
          border-radius: 50%;
          color: #efc875;
          font: 700 15px Georgia, serif;
        }

        .ta14Interpretation span {
          color: #e4b95e;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .ta14Interpretation p {
          margin: 8px 0 0;
          color: #d3e0e4;
          font-size: 13px;
          line-height: 1.6;
        }

        .entryActions {
          margin-top: 16px;
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-end;
          gap: 9px;
        }

        .emptyState {
          padding: 55px 25px;
          border: 1px dashed
            rgba(255, 255, 255, 0.13);
          border-radius: 22px;
          background: rgba(5, 18, 30, 0.6);
          text-align: center;
        }

        .emptySeal {
          width: 65px;
          height: 65px;
          margin: auto;
          display: grid;
          place-items: center;
          border: 1px solid
            rgba(255, 198, 82, 0.24);
          border-radius: 50%;
          color: #efc875;
          font: 700 18px Georgia, serif;
        }

        .emptyState h3 {
          margin: 20px 0 0;
          font-size: 29px;
        }

        .emptyState p {
          max-width: 540px;
          margin: 12px auto 0;
          color: #8da3ad;
          font-size: 13px;
          line-height: 1.65;
        }

        .emptyState button {
          min-height: 43px;
          margin-top: 20px;
          padding: 0 15px;
          border: 1px solid #aaf2ff;
          border-radius: 10px;
          color: #041a23;
          background: linear-gradient(
            135deg,
            #d9fbff,
            #76deef 64%,
            #38aeca
          );
          cursor: pointer;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.07em;
          text-transform: uppercase;
        }

        .sequenceGrid {
          display: grid;
          grid-template-columns: repeat(
            6,
            minmax(0, 1fr)
          );
          gap: 10px;
        }

        .sequenceGrid article {
          min-height: 205px;
          padding: 19px;
          border: 1px solid
            rgba(99, 230, 255, 0.1);
          border-radius: 17px;
          background: linear-gradient(
            180deg,
            rgba(10, 30, 45, 0.9),
            rgba(3, 12, 20, 0.96)
          );
        }

        .sequenceGrid article > span {
          width: 37px;
          height: 37px;
          display: grid;
          place-items: center;
          border: 1px solid
            rgba(255, 197, 82, 0.2);
          border-radius: 50%;
          color: #efc66f;
          font-size: 8px;
          font-weight: 900;
        }

        .sequenceGrid strong {
          display: block;
          margin-top: 23px;
          color: #e1ecef;
          font: 700 19px Georgia, serif;
        }

        .sequenceGrid p {
          margin: 11px 0 0;
          color: #8298a2;
          font-size: 11px;
          line-height: 1.55;
        }

        .boundarySection {
          margin-top: 88px;
          padding: 56px 34px;
          border: 1px solid
            rgba(255, 197, 82, 0.24);
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
            inset 0 1px
              rgba(255, 255, 255, 0.025);
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

        .boundarySection
          > p:not(.eyebrow) {
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
          border: 1px solid
            rgba(255, 255, 255, 0.07);
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

          .categoryGrid {
            grid-template-columns: repeat(
              2,
              minmax(0, 1fr)
            );
          }

          .sequenceGrid {
            grid-template-columns: repeat(
              3,
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
          .searchPanel,
          .alphabetPanel {
            grid-template-columns: 1fr;
          }

          .detailGrid {
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
            font-size: clamp(
              45px,
              14vw,
              68px
            );
          }

          .heroMetrics,
          .categoryGrid,
          .sequenceGrid {
            grid-template-columns: 1fr;
          }

          .resultsHeading {
            align-items: stretch;
            flex-direction: column;
          }

          .filterCondition {
            min-width: 0;
          }

          .entryHeader {
            grid-template-columns:
              42px minmax(0, 1fr) 38px;
            padding: 16px;
          }

          .entrySummary {
            padding: 0 16px 17px;
          }

          .entryDetails,
          .boundarySection {
            padding: 21px;
          }

          .ta14Interpretation {
            grid-template-columns: 1fr;
          }

          .entryActions,
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
