"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";

import {
  TA14_24_LINKS,
  type TA14LinkId,
} from "@/lib/academy/ta14-24-link-canon";
import {
  listTA14CanonicalLinkSources,
  listTA14CanonicalSources,
  type TA14CanonicalLinkSourceRecord,
  type TA14CanonicalSourceRecord,
} from "@/lib/academy/ta14-canonical-registry";

type PatentFamily = {
  number: number;
  name: string;
  applications: TA14CanonicalSourceRecord[];
};

function patentFamilyNumber(
  source: TA14CanonicalSourceRecord,
): number | null {
  const value = source.metadata?.patent_family;

  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

function patentFamilyName(
  source: TA14CanonicalSourceRecord,
): string {
  const value = source.metadata?.patent_family_name;

  return typeof value === "string" && value.trim()
    ? value
    : "Unclassified Patent Family";
}

export default function TA14PatentPortfolioMapPage() {
  return (
    <Suspense fallback={<PatentPortfolioRouteLoading />}>
      <TA14PatentPortfolioMapContent />
    </Suspense>
  );
}

function TA14PatentPortfolioMapContent() {
  const searchParams = useSearchParams();
  const requestedApplication = searchParams.get("application");

  const [sources, setSources] = useState<TA14CanonicalSourceRecord[]>([]);
  const [relations, setRelations] = useState<
    TA14CanonicalLinkSourceRecord[]
  >([]);
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const [sourceRecords, relationRecords] = await Promise.all([
          listTA14CanonicalSources(),
          listTA14CanonicalLinkSources(),
        ]);

        if (cancelled) return;

        const patentSources = sourceRecords.filter(
          (source) => source.sourceType === "patent_application",
        );

        setSources(patentSources);
        setRelations(
          relationRecords.filter(
            (relation) => relation.relationType === "patent_position",
          ),
        );

        if (patentSources.length > 0) {
          const requested = requestedApplication
            ? patentSources.find(
                (source) =>
                  source.sourceIdentifier === requestedApplication ||
                  source.id === requestedApplication,
              )
            : null;

          setSelectedSourceId(
            requested?.id ?? patentSources[0].id,
          );
        }
      } catch (caught) {
        if (!cancelled) {
          setError(
            caught instanceof Error
              ? caught.message
              : "Unable to load TA-14 patent portfolio.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [requestedApplication]);

  const families = useMemo<PatentFamily[]>(() => {
    const grouped = new Map<number, PatentFamily>();

    for (const source of sources) {
      const number = patentFamilyNumber(source);

      if (number == null) continue;

      const existing = grouped.get(number);

      if (existing) {
        existing.applications.push(source);
      } else {
        grouped.set(number, {
          number,
          name: patentFamilyName(source),
          applications: [source],
        });
      }
    }

    return [...grouped.values()]
      .sort((a, b) => a.number - b.number)
      .map((family) => ({
        ...family,
        applications: [...family.applications].sort((a, b) => {
          const aOrder =
            typeof a.metadata?.portfolio_order === "number"
              ? a.metadata.portfolio_order
              : 999;
          const bOrder =
            typeof b.metadata?.portfolio_order === "number"
              ? b.metadata.portfolio_order
              : 999;

          return aOrder - bOrder;
        }),
      }));
  }, [sources]);

  const selectedSource = useMemo(
    () =>
      sources.find((source) => source.id === selectedSourceId) ?? null,
    [sources, selectedSourceId],
  );

  const selectedRelations = useMemo(
    () =>
      selectedSource
        ? relations
            .filter(
              (relation) => relation.sourceId === selectedSource.id,
            )
            .sort((a, b) => {
              const aLink = TA14_24_LINKS.find(
                (link) => link.linkId === a.linkId,
              );
              const bLink = TA14_24_LINKS.find(
                (link) => link.linkId === b.linkId,
              );

              return (aLink?.order ?? 999) - (bLink?.order ?? 999);
            })
        : [],
    [relations, selectedSource],
  );

  const coveredLinks = useMemo(() => {
    const ids = new Set<TA14LinkId>(
      relations.map((relation) => relation.linkId),
    );

    return TA14_24_LINKS.filter((link) => ids.has(link.linkId));
  }, [relations]);

  return (
    <main className="min-h-screen bg-[#030712] text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(251,191,36,0.13),transparent_36%),radial-gradient(circle_at_82%_12%,rgba(56,189,248,0.11),transparent_34%)]" />
        <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link
              href="/academy/24-link-architecture/provenance"
              className="text-sm font-semibold text-sky-300"
            >
              ← Back to Provenance Map
            </Link>

            <Link
              href="/academy/24-link-architecture/provenance/patents/families"
              className="inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/[0.06] px-4 py-2 text-xs font-semibold text-amber-200 transition hover:border-amber-300/40 hover:bg-amber-300/[0.1]"
            >
              Explore eight patent families
            </Link>
          </div>

          <p className="mt-10 text-xs font-semibold uppercase tracking-[0.26em] text-amber-300">
            TA-14 Patent Position · Architecture Map
          </p>

          <h1 className="mt-3 max-w-5xl text-4xl font-semibold tracking-tight sm:text-6xl">
            Eight patent families. Thirty-two application records. One bounded map.
          </h1>

          <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-300">
            Explore the documented TA-14 patent portfolio by family and see
            which canonical links each application is currently related to in
            the institutional patent-position record.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Metric value={String(families.length)} label="Patent families" />
            <Metric value={String(sources.length)} label="Applications" />
            <Metric
              value={String(coveredLinks.length)}
              label="24-link positions represented"
            />
            <Metric
              value={String(relations.length)}
              label="Bounded relationships"
            />
          </div>
        </div>
      </section>

      {loading ? (
        <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <p className="text-slate-400">Loading patent portfolio…</p>
        </section>
      ) : error ? (
        <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="rounded-2xl border border-rose-300/20 bg-rose-300/[0.05] p-6">
            <p className="font-semibold text-rose-200">
              Patent portfolio unavailable
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-300">{error}</p>
          </div>
        </section>
      ) : (
        <>
          <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
              {TA14_24_LINKS.map((link) => {
                const count = relations.filter(
                  (relation) => relation.linkId === link.linkId,
                ).length;

                return (
                  <Link
                    key={link.linkId}
                    href={`/academy/24-link-architecture/${String(
                      link.order,
                    ).padStart(2, "0")}-${link.slug}`}
                    className={[
                      "rounded-2xl border p-4 transition",
                      count > 0
                        ? "border-amber-300/25 bg-amber-300/[0.055]"
                        : "border-white/10 bg-white/[0.025] opacity-60",
                    ].join(" ")}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="text-xs font-semibold text-sky-300">
                        {String(link.order).padStart(2, "0")}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-500">
                        {count}
                      </span>
                    </div>
                    <p className="mt-2 text-sm font-semibold leading-5">
                      {link.canonicalName}
                    </p>
                  </Link>
                );
              })}
            </div>
          </section>

          <section className="mx-auto grid max-w-7xl gap-8 px-6 pb-20 lg:grid-cols-[1.12fr_0.88fr] lg:px-8">
            <div className="space-y-8">
              {families.map((family) => (
                <section
                  key={family.number}
                  className="rounded-3xl border border-white/10 bg-white/[0.025] p-6"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">
                    Patent Family {family.number}
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold">
                    {family.name}
                  </h2>
                  <p className="mt-2 text-sm text-slate-500">
                    {family.applications.length} application
                    {family.applications.length === 1 ? "" : "s"}
                  </p>

                  <div className="mt-6 grid gap-3">
                    {family.applications.map((source) => {
                      const active = source.id === selectedSourceId;
                      const relationshipCount = relations.filter(
                        (relation) => relation.sourceId === source.id,
                      ).length;

                      return (
                        <button
                          key={source.id}
                          type="button"
                          onClick={() => setSelectedSourceId(source.id)}
                          className={[
                            "rounded-2xl border p-5 text-left transition",
                            active
                              ? "border-amber-300/40 bg-amber-300/[0.075]"
                              : "border-white/10 bg-black/10 hover:border-white/20",
                          ].join(" ")}
                        >
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <span className="text-xs font-semibold text-sky-300">
                              {source.sourceIdentifier ?? "Identifier pending"}
                            </span>
                            <span className="rounded-full border border-white/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] text-slate-500">
                              {relationshipCount} mapped link
                              {relationshipCount === 1 ? "" : "s"}
                            </span>
                          </div>

                          <p className="mt-3 text-sm font-semibold leading-6 text-white">
                            {source.title}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>

            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 sm:p-8">
                {selectedSource ? (
                  <>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">
                      Selected application
                    </p>

                    <p className="mt-3 text-sm font-semibold text-sky-300">
                      {selectedSource.sourceIdentifier}
                    </p>

                    <h2 className="mt-3 text-2xl font-semibold leading-tight">
                      {selectedSource.title}
                    </h2>

                    {selectedSource.publicSummary ? (
                      <p className="mt-5 text-sm leading-7 text-slate-300">
                        {selectedSource.publicSummary}
                      </p>
                    ) : null}

                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                      <Detail
                        label="Jurisdiction"
                        value={selectedSource.jurisdiction ?? "Not stated"}
                      />
                      <Detail
                        label="Status"
                        value={selectedSource.status ?? "Not stated"}
                      />
                      <Detail
                        label="Filing date"
                        value={selectedSource.filingDate ?? "Not stated"}
                      />
                      <Detail
                        label="Priority date"
                        value={selectedSource.priorityDate ?? "Not stated"}
                      />
                    </div>

                    <div className="mt-8 border-t border-white/10 pt-6">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                        Bounded 24-link patent-position relationships
                      </p>

                      {selectedRelations.length === 0 ? (
                        <p className="mt-4 text-sm leading-6 text-slate-400">
                          No bounded patent-position relationship has been
                          recorded yet for this application.
                        </p>
                      ) : (
                        <div className="mt-4 space-y-3">
                          {selectedRelations.map((relation) => {
                            const link = TA14_24_LINKS.find(
                              (item) => item.linkId === relation.linkId,
                            );

                            return (
                              <article
                                key={relation.id}
                                className="rounded-2xl border border-white/10 bg-black/15 p-4"
                              >
                                <Link
                                  href={`/academy/24-link-architecture/${String(
                                    link?.order ?? 0,
                                  ).padStart(2, "0")}-${link?.slug ?? ""}`}
                                  className="text-sm font-semibold text-sky-300"
                                >
                                  {String(link?.order ?? 0).padStart(2, "0")}{" "}
                                  {link?.canonicalName ?? relation.linkId}
                                </Link>

                                {relation.relationSummary ? (
                                  <p className="mt-2 text-sm leading-6 text-slate-300">
                                    {relation.relationSummary}
                                  </p>
                                ) : null}
                              </article>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {selectedSource.sourceUrl ? (
                      <a
                        href={selectedSource.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-7 inline-flex text-sm font-semibold text-amber-200"
                      >
                        Open public patent-position source →
                      </a>
                    ) : null}
                  </>
                ) : (
                  <p className="text-sm text-slate-400">
                    Select an application to inspect its architecture mapping.
                  </p>
                )}
              </div>
            </aside>
          </section>
        </>
      )}

      <section className="border-t border-white/10 bg-white/[0.02]">
        <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-200">
            Patent-position boundary
          </p>
          <h2 className="mt-3 text-3xl font-semibold">
            Architecture mapping is not patent claim construction.
          </h2>
          <p className="mt-4 max-w-5xl leading-7 text-slate-300">
            This view records how the public TA-14 patent portfolio is
            architecturally positioned against the 24-link canon. It does not
            determine patent validity, grant status, infringement, ownership,
            or the legal scope of any claim.
          </p>
        </div>
      </section>
    </main>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="min-w-36 rounded-2xl border border-white/10 bg-black/15 px-5 py-4">
      <div className="text-2xl font-semibold">{value}</div>
      <div className="mt-1 text-xs text-slate-400">{label}</div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/15 p-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-sm text-slate-200">{value}</p>
    </div>
  );
}


function PatentPortfolioRouteLoading() {
  return (
    <main className="min-h-screen bg-[#030712] text-white">
      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-300">
            TA-14 Patent Position · Architecture Map
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">
            Resolving patent application…
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">
            Loading the requested application and its bounded relationships to
            the canonical 24-link architecture.
          </p>
        </div>
      </section>
    </main>
  );
}
