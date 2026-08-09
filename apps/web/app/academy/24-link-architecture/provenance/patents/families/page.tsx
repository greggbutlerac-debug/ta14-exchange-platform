"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

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

type FamilyView = {
  number: number;
  name: string;
  applications: TA14CanonicalSourceRecord[];
  coveredLinks: TA14LinkId[];
  relationshipCount: number;
};

function familyNumber(source: TA14CanonicalSourceRecord): number | null {
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

function familyName(source: TA14CanonicalSourceRecord): string {
  const value = source.metadata?.patent_family_name;

  return typeof value === "string" && value.trim()
    ? value
    : "Unclassified Patent Family";
}

export default function TA14PatentFamiliesPage() {
  const [sources, setSources] = useState<TA14CanonicalSourceRecord[]>([]);
  const [relations, setRelations] = useState<TA14CanonicalLinkSourceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const [sourceRows, relationRows] = await Promise.all([
          listTA14CanonicalSources(),
          listTA14CanonicalLinkSources(),
        ]);

        if (cancelled) return;

        setSources(
          sourceRows.filter(
            (source) => source.sourceType === "patent_application",
          ),
        );

        setRelations(
          relationRows.filter(
            (relation) => relation.relationType === "patent_position",
          ),
        );
      } catch (caught) {
        if (!cancelled) {
          setError(
            caught instanceof Error
              ? caught.message
              : "Unable to load patent families.",
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
  }, []);

  const families = useMemo<FamilyView[]>(() => {
    const grouped = new Map<number, TA14CanonicalSourceRecord[]>();

    for (const source of sources) {
      const number = familyNumber(source);
      if (number == null) continue;

      const list = grouped.get(number) ?? [];
      list.push(source);
      grouped.set(number, list);
    }

    return [...grouped.entries()]
      .sort(([a], [b]) => a - b)
      .map(([number, applications]) => {
        const sourceIds = new Set(applications.map((item) => item.id));
        const familyRelations = relations.filter((relation) =>
          sourceIds.has(relation.sourceId),
        );
        const coveredLinks = [...new Set(familyRelations.map((r) => r.linkId))];

        return {
          number,
          name: familyName(applications[0]),
          applications: [...applications].sort((a, b) => {
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
          coveredLinks,
          relationshipCount: familyRelations.length,
        };
      });
  }, [relations, sources]);

  return (
    <main className="min-h-screen bg-[#030712] text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(251,191,36,0.13),transparent_36%),radial-gradient(circle_at_82%_10%,rgba(99,102,241,0.11),transparent_34%)]" />
        <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <Link
            href="/academy/24-link-architecture/provenance/patents"
            className="text-sm font-semibold text-sky-300"
          >
            ← Patent Portfolio Map
          </Link>

          <p className="mt-10 text-xs font-semibold uppercase tracking-[0.26em] text-amber-300">
            TA-14 Patent Portfolio · Family View
          </p>

          <h1 className="mt-3 max-w-5xl text-4xl font-semibold tracking-tight sm:text-6xl">
            Eight patent families across the admissible-execution architecture.
          </h1>

          <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-300">
            Each family groups related application records while preserving the
            bounded 24-link architecture relationships recorded for the
            individual filings inside that family.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        {loading ? (
          <p className="text-slate-400">Loading patent families…</p>
        ) : error ? (
          <div className="rounded-2xl border border-rose-300/20 bg-rose-300/[0.05] p-6">
            <p className="font-semibold text-rose-200">
              Patent families unavailable
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-300">{error}</p>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {families.map((family) => (
              <article
                key={family.number}
                className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">
                      Patent Family {family.number}
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold">
                      {family.name}
                    </h2>
                  </div>

                  <div className="flex gap-2">
                    <Badge
                      value={String(family.applications.length)}
                      label="apps"
                    />
                    <Badge
                      value={String(family.coveredLinks.length)}
                      label="links"
                    />
                    <Badge
                      value={String(family.relationshipCount)}
                      label="maps"
                    />
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  {family.coveredLinks
                    .map((linkId) =>
                      TA14_24_LINKS.find((link) => link.linkId === linkId),
                    )
                    .filter(
                      (link): link is (typeof TA14_24_LINKS)[number] =>
                        Boolean(link),
                    )
                    .sort((a, b) => a.order - b.order)
                    .map((link) => (
                      <Link
                        key={link.linkId}
                        href={`/academy/24-link-architecture/${String(
                          link.order,
                        ).padStart(2, "0")}-${link.slug}`}
                        className="rounded-full border border-sky-300/15 bg-sky-300/[0.04] px-2.5 py-1 text-[10px] font-semibold text-sky-200"
                      >
                        {String(link.order).padStart(2, "0")}{" "}
                        {link.canonicalName}
                      </Link>
                    ))}
                </div>

                <div className="mt-7 space-y-3">
                  {family.applications.map((application) => (
                    <Link
                      key={application.id}
                      href={`/academy/24-link-architecture/provenance/patents?application=${encodeURIComponent(
                        application.sourceIdentifier ?? application.id,
                      )}`}
                      className="block rounded-2xl border border-white/10 bg-black/10 p-4 transition hover:border-amber-300/25"
                    >
                      <p className="text-xs font-semibold text-sky-300">
                        {application.sourceIdentifier ?? "Identifier pending"}
                      </p>
                      <p className="mt-2 text-sm font-semibold leading-6 text-slate-100">
                        {application.title}
                      </p>
                    </Link>
                  ))}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="border-t border-white/10 bg-white/[0.02]">
        <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-200">
            Family-level boundary
          </p>
          <p className="mt-4 max-w-5xl leading-7 text-slate-300">
            Family grouping helps explain the structure of the public TA-14
            patent portfolio, but it does not convert a family label into a
            claim that every application within the family covers every
            architecture link shown by the family aggregate.
          </p>
        </div>
      </section>
    </main>
  );
}

function Badge({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/15 px-3 py-2 text-center">
      <div className="text-sm font-semibold">{value}</div>
      <div className="text-[9px] uppercase tracking-[0.12em] text-slate-500">
        {label}
      </div>
    </div>
  );
}
