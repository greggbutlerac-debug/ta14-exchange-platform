import Link from "next/link";

import {
  getGovernanceLibraryStats,
  searchGovernanceLibrary,
} from "@/lib/governance-library/search";
import type {
  GovernanceAuthorityLevel,
  GovernanceLibraryCategory,
  GovernanceLibraryFilter,
} from "@/lib/governance-library/types";

type SearchParams = Record<
  string,
  string | string[] | undefined
>;

type GovernanceLibraryPageProps = {
  searchParams?: SearchParams | Promise<SearchParams>;
};

const categoryOptions: Array<{
  value: GovernanceLibraryCategory;
  label: string;
}> = [
  { value: "law", label: "Laws" },
  { value: "regulation", label: "Regulations" },
  { value: "standard", label: "Standards" },
  { value: "framework", label: "Frameworks" },
  { value: "principles", label: "Principles" },
  { value: "guidance", label: "Guidance" },
  { value: "assurance", label: "Assurance" },
  { value: "testing", label: "Testing" },
  { value: "risk-management", label: "Risk management" },
  { value: "management-system", label: "Management systems" },
  { value: "sector-overlay", label: "Sector overlays" },
];

const authorityOptions: Array<{
  value: GovernanceAuthorityLevel;
  label: string;
}> = [
  { value: "binding-law", label: "Binding law" },
  { value: "binding-regulation", label: "Binding regulation" },
  { value: "contractual", label: "Contractual" },
  { value: "certifiable-standard", label: "Certifiable standard" },
  { value: "voluntary-standard", label: "Voluntary standard" },
  { value: "official-guidance", label: "Official guidance" },
  { value: "industry-guidance", label: "Industry guidance" },
  { value: "organizational-control", label: "Organizational control" },
  { value: "informational", label: "Informational" },
];

const getSingleParam = (
  value: string | string[] | undefined,
): string => {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
};

const parseCommaSeparated = <T extends string>(
  value: string,
): T[] =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean) as T[];

const toTitleCase = (value: string): string =>
  value
    .split("-")
    .map(
      (part) =>
        part.charAt(0).toUpperCase() + part.slice(1),
    )
    .join(" ");

const authorityBadgeClass = (
  authorityLevel: GovernanceAuthorityLevel,
): string => {
  switch (authorityLevel) {
    case "binding-law":
    case "binding-regulation":
      return "border-rose-400/40 bg-rose-500/10 text-rose-100";
    case "certifiable-standard":
      return "border-sky-400/40 bg-sky-500/10 text-sky-100";
    case "official-guidance":
      return "border-amber-400/40 bg-amber-500/10 text-amber-100";
    default:
      return "border-white/15 bg-white/5 text-slate-200";
  }
};

export default async function GovernanceLibraryPage({
  searchParams,
}: GovernanceLibraryPageProps) {
  const resolvedSearchParams = await Promise.resolve(
    searchParams ?? {},
  );

  const query = getSingleParam(resolvedSearchParams.q);
  const categoryParam = getSingleParam(
    resolvedSearchParams.category,
  );
  const authorityParam = getSingleParam(
    resolvedSearchParams.authority,
  );

  const filter: GovernanceLibraryFilter = {
    query,
    categories: categoryParam
      ? parseCommaSeparated<GovernanceLibraryCategory>(
          categoryParam,
        )
      : undefined,
    authorityLevels: authorityParam
      ? parseCommaSeparated<GovernanceAuthorityLevel>(
          authorityParam,
        )
      : undefined,
  };

  const results = searchGovernanceLibrary(filter);
  const stats = getGovernanceLibraryStats();
  const hasActiveFilters = Boolean(
    query || categoryParam || authorityParam,
  );

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.18),transparent_38%),radial-gradient(circle_at_top_right,rgba(168,85,247,0.14),transparent_36%),linear-gradient(to_bottom,rgba(15,23,42,0.2),rgba(5,8,22,0.96))]" />

        <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
          <div className="max-w-4xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.28em] text-sky-300">
              TA-14 AI Governance Exchange
            </p>

            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              AI Governance Library
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
              Decode the acronyms. Identify the issuing
              authority. Understand what is binding, voluntary,
              certifiable, or advisory. Then connect each
              governance instrument to evidence, applicability,
              and admissible execution.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <span className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-slate-200">
                {stats.totalRecords} governed records
              </span>
              <span className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-slate-200">
                Acronyms and full names
              </span>
              <span className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-slate-200">
                Authority and legal force
              </span>
              <span className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-slate-200">
                TA-14 route mapping
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="h-fit rounded-2xl border border-white/10 bg-white/[0.035] p-5 lg:sticky lg:top-6">
            <form action="/governance-library" method="get">
              <div>
                <label
                  htmlFor="q"
                  className="text-sm font-medium text-slate-200"
                >
                  Search the library
                </label>
                <input
                  id="q"
                  name="q"
                  type="search"
                  defaultValue={query}
                  placeholder="EU AI Act, NIST, ISO, ethics..."
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-sky-400/70"
                />
              </div>

              <div className="mt-6">
                <label
                  htmlFor="category"
                  className="text-sm font-medium text-slate-200"
                >
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  defaultValue={categoryParam}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-[#0b1022] px-4 py-3 text-sm text-white outline-none focus:border-sky-400/70"
                >
                  <option value="">All categories</option>
                  {categoryOptions.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-5">
                <label
                  htmlFor="authority"
                  className="text-sm font-medium text-slate-200"
                >
                  Authority level
                </label>
                <select
                  id="authority"
                  name="authority"
                  defaultValue={authorityParam}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-[#0b1022] px-4 py-3 text-sm text-white outline-none focus:border-sky-400/70"
                >
                  <option value="">All authority levels</option>
                  {authorityOptions.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="mt-6 w-full rounded-xl bg-sky-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-300"
              >
                Search library
              </button>

              {hasActiveFilters ? (
                <Link
                  href="/governance-library"
                  className="mt-3 block w-full rounded-xl border border-white/10 px-4 py-3 text-center text-sm font-medium text-slate-300 transition hover:border-white/20 hover:bg-white/5 hover:text-white"
                >
                  Clear filters
                </Link>
              ) : null}
            </form>

            <div className="mt-8 border-t border-white/10 pt-6">
              <h2 className="text-sm font-semibold text-white">
                What each record explains
              </h2>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-400">
                <li>Acronym and complete official name</li>
                <li>Issuing authority and jurisdiction</li>
                <li>Binding, certifiable, or voluntary force</li>
                <li>Actors and lifecycle stages affected</li>
                <li>Evidence expected or required</li>
                <li>Related standards and crosswalks</li>
                <li>TA-14 admissible-execution actions</li>
              </ul>
            </div>
          </aside>

          <div>
            <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.18em] text-slate-500">
                  Library results
                </p>
                <h2 className="mt-1 text-2xl font-semibold">
                  {results.length}{" "}
                  {results.length === 1 ? "record" : "records"}
                </h2>
              </div>

              {stats.lastUpdatedAt ? (
                <p className="text-sm text-slate-500">
                  Catalog updated {stats.lastUpdatedAt}
                </p>
              ) : null}
            </div>

            {results.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.025] p-10 text-center">
                <h3 className="text-xl font-semibold">
                  No governed record matched
                </h3>
                <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-400">
                  Try the acronym, complete framework name,
                  issuing authority, or a broader category. The
                  catalog will expand as additional laws,
                  standards, frameworks, assurance systems, and
                  sector overlays are added.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {results.map(({ record, matchedFields }) => (
                  <article
                    key={record.id}
                    className="group rounded-2xl border border-white/10 bg-white/[0.035] p-6 transition hover:border-sky-400/30 hover:bg-white/[0.05]"
                  >
                    <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`rounded-full border px-3 py-1 text-xs font-medium ${authorityBadgeClass(
                              record.authorityLevel,
                            )}`}
                          >
                            {toTitleCase(record.authorityLevel)}
                          </span>

                          {record.categories
                            .slice(0, 3)
                            .map((category) => (
                              <span
                                key={category}
                                className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-slate-300"
                              >
                                {toTitleCase(category)}
                              </span>
                            ))}
                        </div>

                        <h3 className="mt-4 text-2xl font-semibold tracking-tight text-white">
                          {record.acronym}
                        </h3>

                        <p className="mt-1 text-sm font-medium text-sky-200">
                          {record.fullName}
                        </p>

                        <p className="mt-4 max-w-3xl leading-7 text-slate-300">
                          {record.plainLanguagePurpose}
                        </p>

                        <div className="mt-5 grid gap-4 sm:grid-cols-2">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                              Issuing authority
                            </p>
                            <p className="mt-1 text-sm leading-6 text-slate-300">
                              {record.source.issuingAuthority}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                              Geography
                            </p>
                            <p className="mt-1 text-sm leading-6 text-slate-300">
                              {record.geographies
                                .map(toTitleCase)
                                .join(", ")}
                            </p>
                          </div>
                        </div>

                        {query && matchedFields.length > 0 ? (
                          <p className="mt-4 text-xs text-slate-500">
                            Matched:{" "}
                            {matchedFields
                              .map(toTitleCase)
                              .join(", ")}
                          </p>
                        ) : null}
                      </div>

                      <div className="shrink-0">
                        <Link
                          href={`/governance-library/${record.slug}`}
                          className="inline-flex rounded-xl border border-sky-400/35 bg-sky-400/10 px-4 py-2.5 text-sm font-semibold text-sky-100 transition hover:border-sky-300/60 hover:bg-sky-400/20"
                        >
                          Open governed record
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

            <div className="mt-10 rounded-2xl border border-amber-300/20 bg-amber-300/[0.05] p-5">
              <p className="text-sm leading-6 text-amber-100/80">
                The TA-14 AI Governance Library is an
                educational and governance-navigation system.
                It does not replace official source material,
                qualified legal advice, certification,
                conformity assessment, or regulator
                determinations. Each route must remain bound to
                the actual system, role, jurisdiction,
                authority, evidence, and execution context.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
