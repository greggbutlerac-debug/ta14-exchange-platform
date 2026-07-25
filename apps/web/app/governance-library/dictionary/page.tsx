import Link from "next/link";

type DictionaryEntry = {
  slug: string;
  term: string;
  acronym?: string;
  summary: string;
  category:
    | "role"
    | "risk"
    | "evidence"
    | "assurance"
    | "execution"
    | "oversight"
    | "documentation";
  relatedTerms: string[];
  frameworks: string[];
  evidence: string[];
  ta14Interpretation: string;
  popular?: boolean;
};

type DictionaryPageProps = {
  searchParams: Promise<{
    q?: string;
    category?: string;
    letter?: string;
  }>;
};

const dictionaryEntries: DictionaryEntry[] = [
  {
    slug: "accountability",
    term: "Accountability",
    summary:
      "The assignment and preservation of responsibility for AI decisions, controls, evidence, and outcomes.",
    category: "oversight",
    relatedTerms: ["Authority", "Responsibility", "Auditability"],
    frameworks: ["EU AI Act", "NIST AI RMF", "ISO/IEC 42001", "OECD AI Principles"],
    evidence: ["Authority record", "Approval record", "Audit record", "Outcome record"],
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
    relatedTerms: ["Evidence", "Binding", "Execution", "Continuity"],
    frameworks: ["TA-14 Admissible Execution Architecture"],
    evidence: ["Authority record", "Evidence package", "Continuity record", "Execution record"],
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
    relatedTerms: ["Validation", "Verification", "Audit", "Conformity Assessment"],
    frameworks: ["ISO/IEC 42001", "NIST AI RMF", "IEEE standards"],
    evidence: ["Test result", "Validation result", "Audit record", "Technical documentation"],
    ta14Interpretation:
      "Assurance is not a statement of trust; it is an evidence-bound basis for continued execution.",
    popular: true,
  },
  {
    slug: "bias",
    term: "Bias",
    summary:
      "A systematic tendency that can produce unfair, distorted, or unrepresentative AI behavior or outcomes.",
    category: "risk",
    relatedTerms: ["Fairness", "Discrimination", "Representativeness", "Impact Assessment"],
    frameworks: ["NIST AI RMF", "UNESCO AI Ethics", "OECD AI Principles"],
    evidence: ["Data record", "Evaluation result", "Impact assessment", "Monitoring record"],
    ta14Interpretation:
      "Bias claims must be linked to defined populations, evidence, thresholds, and preserved outcomes.",
    popular: true,
  },
  {
    slug: "conformity-assessment",
    term: "Conformity Assessment",
    summary:
      "A process used to determine whether a system, product, or organization satisfies specified requirements.",
    category: "assurance",
    relatedTerms: ["Certification", "Assessment", "Validation", "Technical Documentation"],
    frameworks: ["EU AI Act", "ISO standards"],
    evidence: ["Technical documentation", "Test result", "Audit record", "Approval record"],
    ta14Interpretation:
      "Conformity evidence may support admissibility, but it does not independently authorize every execution context.",
    popular: true,
  },
  {
    slug: "deployer",
    term: "Deployer",
    summary:
      "An entity that uses an AI system under its authority, excluding purely personal, non-professional use.",
    category: "role",
    relatedTerms: ["Provider", "Operator", "User", "Human Oversight"],
    frameworks: ["EU AI Act", "NIST AI RMF", "ISO/IEC 42001"],
    evidence: ["Use policy", "Authority record", "Monitoring record", "Human oversight record"],
    ta14Interpretation:
      "The deployer must demonstrate valid authority, bounded use, and continued admissibility at execution time.",
    popular: true,
  },
  {
    slug: "explainability",
    term: "Explainability",
    summary:
      "The extent to which the reasons, factors, or logic behind an AI output can be meaningfully communicated.",
    category: "documentation",
    relatedTerms: ["Transparency", "Interpretability", "Traceability"],
    frameworks: ["NIST AI RMF", "OECD AI Principles", "UNESCO AI Ethics"],
    evidence: ["Model record", "System card", "Decision record", "User notice"],
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
    relatedTerms: ["GPAI", "Model Provider", "Downstream System"],
    frameworks: ["EU AI Act", "NIST AI RMF"],
    evidence: ["Model record", "Training record", "Evaluation result", "Supplier record"],
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
    relatedTerms: ["Foundation Model", "GPAI Provider", "Systemic Risk"],
    frameworks: ["EU AI Act"],
    evidence: ["Model documentation", "Evaluation result", "Copyright policy", "Risk assessment"],
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
    relatedTerms: ["Risk Classification", "Conformity Assessment", "Post-Market Monitoring"],
    frameworks: ["EU AI Act"],
    evidence: ["Risk assessment", "Technical documentation", "Validation result", "Monitoring record"],
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
    relatedTerms: ["Intervention", "Override", "Escalation", "Accountability"],
    frameworks: ["EU AI Act", "NIST AI RMF", "ISO/IEC 42001"],
    evidence: ["Human oversight record", "Training record", "Approval record", "Incident record"],
    ta14Interpretation:
      "Human presence is not enough; the human must possess valid authority, usable evidence, and a defined intervention path.",
    popular: true,
  },
  {
    slug: "post-market-monitoring",
    term: "Post-Market Monitoring",
    summary:
      "The ongoing collection and evaluation of information about system performance after deployment.",
    category: "oversight",
    relatedTerms: ["Monitoring", "Incident Reporting", "Corrective Action", "Drift"],
    frameworks: ["EU AI Act", "ISO/IEC 42001"],
    evidence: ["Monitoring record", "Incident record", "Change record", "Outcome record"],
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
    relatedTerms: ["Deployer", "Importer", "Distributor", "GPAI Provider"],
    frameworks: ["EU AI Act", "ISO/IEC 42001", "NIST AI RMF"],
    evidence: ["Technical documentation", "Model record", "Risk assessment", "Validation result"],
    ta14Interpretation:
      "The provider is responsible for establishing a defensible evidence basis, but downstream execution must still be independently admissible.",
    popular: true,
  },
  {
    slug: "technical-documentation",
    term: "Technical Documentation",
    summary:
      "Structured records describing a system's design, intended purpose, capabilities, limitations, controls, testing, and changes.",
    category: "documentation",
    relatedTerms: ["System Card", "Model Card", "Instructions for Use", "Traceability"],
    frameworks: ["EU AI Act", "ISO/IEC 42001"],
    evidence: ["System record", "Model record", "Test result", "Change record"],
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
    relatedTerms: ["Verification", "Testing", "Evaluation", "Intended Purpose"],
    frameworks: ["NIST AI RMF", "ISO/IEC 42001", "EU AI Act"],
    evidence: ["Validation result", "Test result", "Evaluation result", "Approval record"],
    ta14Interpretation:
      "Validation must remain context-specific and cannot be inherited indefinitely after material change or drift.",
    popular: true,
  },
];

const categoryOptions = [
  { value: "", label: "All categories" },
  { value: "role", label: "Roles" },
  { value: "risk", label: "Risk and classification" },
  { value: "evidence", label: "Evidence" },
  { value: "assurance", label: "Assurance" },
  { value: "execution", label: "Execution" },
  { value: "oversight", label: "Oversight" },
  { value: "documentation", label: "Documentation" },
];

const normalize = (value: string): string =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

const titleCase = (value: string): string =>
  value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

export default async function GovernanceDictionaryPage({
  searchParams,
}: DictionaryPageProps) {
  const params = await searchParams;
  const query = params.q?.trim() ?? "";
  const category = params.category?.trim() ?? "";
  const letter = params.letter?.trim().toUpperCase() ?? "";

  const normalizedQuery = normalize(query);

  const filteredEntries = dictionaryEntries
    .filter((entry) => {
      if (category && entry.category !== category) return false;
      if (letter && !entry.term.toUpperCase().startsWith(letter)) return false;

      if (!normalizedQuery) return true;

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

      return normalizedQuery
        .split(" ")
        .every((token) => searchable.includes(token));
    })
    .sort((a, b) => a.term.localeCompare(b.term));

  const popularEntries = dictionaryEntries.filter((entry) => entry.popular);
  const availableLetters = Array.from(
    new Set(dictionaryEntries.map((entry) => entry.term.charAt(0).toUpperCase())),
  ).sort();

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.18),transparent_38%),radial-gradient(circle_at_top_right,rgba(168,85,247,0.14),transparent_36%),linear-gradient(to_bottom,rgba(15,23,42,0.2),rgba(5,8,22,0.96))]" />

        <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
          <Link
            href="/governance-library"
            className="text-sm font-medium text-sky-300 transition hover:text-sky-200"
          >
            ← Back to AI Governance Library
          </Link>

          <div className="mt-8 max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-300">
              TA-14 Governed Knowledge System
            </p>

            <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              AI Governance Dictionary
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
              Search the roles, terms, evidence concepts, assurance methods,
              risk classifications, and execution principles used across AI
              governance. Each entry connects terminology to authority,
              frameworks, evidence, and TA-14 admissible execution.
            </p>
          </div>

          <form
            action="/governance-library/dictionary"
            method="get"
            className="mt-10 grid max-w-4xl gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 backdrop-blur sm:grid-cols-[minmax(0,1fr)_230px_auto]"
          >
            <input
              type="search"
              name="q"
              defaultValue={query}
              placeholder="Search Provider, GPAI, assurance, validation..."
              className="rounded-xl border border-white/10 bg-[#0b1022] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-sky-400/70"
            />

            <select
              name="category"
              defaultValue={category}
              className="rounded-xl border border-white/10 bg-[#0b1022] px-4 py-3 text-sm text-white outline-none focus:border-sky-400/70"
            >
              {categoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="rounded-xl bg-sky-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-300"
            >
              Search dictionary
            </button>
          </form>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        {!query && !category && !letter ? (
          <section className="rounded-2xl border border-white/10 bg-white/[0.035] p-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Start here
                </p>
                <h2 className="mt-1 text-2xl font-semibold">Popular terms</h2>
              </div>

              <p className="text-sm text-slate-500">
                {dictionaryEntries.length} starter entries
              </p>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {popularEntries.map((entry) => (
                <a
                  key={entry.slug}
                  href={`#${entry.slug}`}
                  className="rounded-xl border border-white/10 bg-black/15 p-4 transition hover:border-sky-400/30 hover:bg-sky-400/[0.06]"
                >
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="font-semibold text-white">{entry.term}</h3>
                    {entry.acronym ? (
                      <span className="rounded-full border border-sky-400/20 bg-sky-400/10 px-2.5 py-1 text-xs text-sky-100">
                        {entry.acronym}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-400">
                    {entry.summary}
                  </p>
                </a>
              ))}
            </div>
          </section>
        ) : null}

        <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.025] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Browse alphabetically
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/governance-library/dictionary"
              className={`rounded-lg border px-3 py-2 text-sm transition ${
                !letter
                  ? "border-sky-400/30 bg-sky-400/10 text-white"
                  : "border-white/10 text-slate-400 hover:text-white"
              }`}
            >
              All
            </Link>

            {availableLetters.map((availableLetter) => (
              <Link
                key={availableLetter}
                href={`/governance-library/dictionary?letter=${availableLetter}`}
                className={`rounded-lg border px-3 py-2 text-sm transition ${
                  letter === availableLetter
                    ? "border-sky-400/30 bg-sky-400/10 text-white"
                    : "border-white/10 text-slate-400 hover:text-white"
                }`}
              >
                {availableLetter}
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-slate-500">
                Dictionary results
              </p>
              <h2 className="mt-1 text-2xl font-semibold">
                {filteredEntries.length}{" "}
                {filteredEntries.length === 1 ? "term" : "terms"}
              </h2>
            </div>

            {query || category || letter ? (
              <Link
                href="/governance-library/dictionary"
                className="text-sm font-medium text-sky-300 transition hover:text-sky-200"
              >
                Clear search and filters
              </Link>
            ) : null}
          </div>

          {filteredEntries.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.025] p-10 text-center">
              <h3 className="text-xl font-semibold">No dictionary term matched</h3>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-400">
                Try an acronym, official role, governance concept, evidence
                type, framework name, or broader category.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {filteredEntries.map((entry) => (
                <article
                  id={entry.slug}
                  key={entry.slug}
                  className="scroll-mt-8 rounded-2xl border border-white/10 bg-white/[0.035] p-6"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-slate-300">
                          {titleCase(entry.category)}
                        </span>

                        {entry.acronym ? (
                          <span className="rounded-full border border-sky-400/25 bg-sky-400/10 px-3 py-1 text-xs font-medium text-sky-100">
                            {entry.acronym}
                          </span>
                        ) : null}
                      </div>

                      <h3 className="mt-4 text-2xl font-semibold tracking-tight">
                        {entry.term}
                      </h3>

                      <p className="mt-4 max-w-4xl leading-7 text-slate-300">
                        {entry.summary}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-5 border-t border-white/10 pt-6 md:grid-cols-2 xl:grid-cols-4">
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                        Frameworks using it
                      </h4>
                      <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-300">
                        {entry.frameworks.map((framework) => (
                          <li key={framework}>{framework}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                        Related terms
                      </h4>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {entry.relatedTerms.map((relatedTerm) => (
                          <span
                            key={relatedTerm}
                            className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-slate-300"
                          >
                            {relatedTerm}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                        Evidence normally associated
                      </h4>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {entry.evidence.map((evidence) => (
                          <span
                            key={evidence}
                            className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-slate-300"
                          >
                            {evidence}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-300">
                        TA-14 interpretation
                      </h4>
                      <p className="mt-3 text-sm leading-6 text-sky-100/85">
                        {entry.ta14Interpretation}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="mt-10 rounded-2xl border border-amber-300/20 bg-amber-300/[0.05] p-5">
          <p className="text-sm leading-6 text-amber-100/80">
            Dictionary entries are governance-navigation aids. Definitions can
            vary by law, jurisdiction, standard, version, system role, and
            context. The official source and applicable authority remain
            controlling. TA-14 interpretations explain admissible-execution
            implications and do not replace legal advice, certification, or
            regulator determinations.
          </p>
        </section>
      </section>
    </main>
  );
}
