"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { TA14ProvenanceAdminLink } from "@/components/academy/ta14-provenance-admin-link";
import {
  TA14_24_LINKS,
  type TA14LinkId,
} from "@/lib/academy/ta14-24-link-canon";
import {
  loadTA14FullProvenanceMap,
  summarizeTA14Provenance,
  type TA14LinkProvenanceBundle,
} from "@/lib/academy/ta14-canonical-registry";

export default function TA14ProvenanceMapPage() {
  const [bundles, setBundles] = useState<TA14LinkProvenanceBundle[]>([]);
  const [selectedLinkId, setSelectedLinkId] =
    useState<TA14LinkId>("TA14-LINK-01");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const result = await loadTA14FullProvenanceMap();

        if (!cancelled) {
          setBundles(result);
        }
      } catch (caught) {
        if (!cancelled) {
          setError(
            caught instanceof Error
              ? caught.message
              : "Unable to load TA-14 provenance map.",
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

  const summary = useMemo(
    () => summarizeTA14Provenance(bundles),
    [bundles],
  );

  const selected = useMemo(
    () =>
      bundles.find((bundle) => bundle.linkId === selectedLinkId) ?? {
        linkId: selectedLinkId,
        order:
          TA14_24_LINKS.find((item) => item.linkId === selectedLinkId)?.order ??
          1,
        canonicalName:
          TA14_24_LINKS.find((item) => item.linkId === selectedLinkId)
            ?.canonicalName ?? "Unknown link",
        sources: [],
      },
    [bundles, selectedLinkId],
  );

  return (
    <main className="min-h-screen bg-[#030712] text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_0%,rgba(59,130,246,0.16),transparent_36%),radial-gradient(circle_at_84%_10%,rgba(168,85,247,0.11),transparent_34%)]" />
        <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link
              href="/academy/24-link-architecture"
              className="text-sm font-semibold text-sky-300"
            >
              ← Back to 24-Link Explorer
            </Link>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/academy/24-link-architecture/provenance/patents"
                className="inline-flex items-center gap-2 rounded-full border border-sky-300/20 bg-sky-300/[0.06] px-4 py-2 text-xs font-semibold text-sky-200 transition hover:border-sky-300/40 hover:bg-sky-300/[0.1]"
              >
                Explore patent portfolio
              </Link>

              <TA14ProvenanceAdminLink />
            </div>
          </div>

          <p className="mt-10 text-xs font-semibold uppercase tracking-[0.26em] text-indigo-300">
            TA-14 Academy · Provenance Map
          </p>

          <h1 className="mt-3 max-w-5xl text-4xl font-semibold tracking-tight sm:text-6xl">
            Show the evidence behind the architecture.
          </h1>

          <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-300">
            Each canonical link can be connected to its public chronology,
            publications, patent applications, patents, artifacts, reviews,
            and other provenance-bearing records without collapsing those
            sources into a single claim.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <Metric
            value={String(summary.linksWithSources)}
            label="Links with sources"
          />
          <Metric
            value={String(summary.totalRelationships)}
            label="Total relationships"
          />
          <Metric
            value={String(summary.primaryProvenanceRelationships)}
            label="Primary provenance"
          />
          <Metric
            value={String(summary.patentRelationships)}
            label="Patent relationships"
          />
          <Metric
            value={String(summary.publicationRelationships)}
            label="Publication relationships"
          />
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-6 pb-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <section className="rounded-3xl border border-white/10 bg-white/[0.025] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-300">
            24-Link provenance coverage
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {TA14_24_LINKS.map((item) => {
              const bundle = bundles.find(
                (candidate) => candidate.linkId === item.linkId,
              );
              const sourceCount = bundle?.sources.length ?? 0;

              return (
                <button
                  key={item.linkId}
                  type="button"
                  onClick={() => setSelectedLinkId(item.linkId)}
                  className={[
                    "rounded-2xl border p-4 text-left transition",
                    selectedLinkId === item.linkId
                      ? "border-indigo-300/45 bg-indigo-300/[0.09]"
                      : "border-white/10 bg-white/[0.03] hover:border-white/20",
                  ].join(" ")}
                >
                  <div className="flex items-start justify-between gap-4">
                    <p className="text-xs font-semibold text-sky-300">
                      {String(item.order).padStart(2, "0")}
                    </p>
                    <span className="rounded-full border border-white/10 px-2 py-1 text-[10px] font-semibold text-slate-500">
                      {sourceCount} source{sourceCount === 1 ? "" : "s"}
                    </span>
                  </div>

                  <p className="mt-2 text-sm font-semibold">
                    {item.canonicalName}
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        <aside className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-300">
            Link {String(selected.order).padStart(2, "0")}
          </p>

          <h2 className="mt-2 text-2xl font-semibold">
            {selected.canonicalName}
          </h2>

          {loading ? (
            <p className="mt-6 text-sm text-slate-400">
              Loading provenance relationships…
            </p>
          ) : error ? (
            <div className="mt-6 rounded-2xl border border-rose-300/20 bg-rose-300/[0.05] p-5">
              <p className="text-sm font-semibold text-rose-200">
                Provenance map unavailable
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                {error}
              </p>
            </div>
          ) : selected.sources.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-white/10 bg-black/15 p-5">
              <p className="text-sm font-semibold text-white">
                No source relationship recorded yet.
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                This does not mean the link lacks provenance. It means no
                public source relationship has yet been entered into the
                canonical registry for this link.
              </p>

              <div className="mt-4">
                <TA14ProvenanceAdminLink linkId={selected.linkId} />
              </div>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {selected.sources.map(({ relation, source }) => (
                <article
                  key={`${relation.id}-${source.id}`}
                  className="rounded-2xl border border-white/10 bg-black/15 p-5"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-sky-300/20 bg-sky-300/[0.07] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-sky-200">
                      {relation.relationType.replaceAll("_", " ")}
                    </span>

                    <span className="rounded-full border border-white/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                      {source.sourceType.replaceAll("_", " ")}
                    </span>

                    {relation.isPrimaryProvenance ? (
                      <span className="rounded-full border border-amber-300/20 bg-amber-300/[0.06] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-amber-200">
                        Primary provenance
                      </span>
                    ) : null}
                  </div>

                  <h3 className="mt-4 font-semibold text-white">
                    {source.title}
                  </h3>

                  {relation.relationSummary ? (
                    <p className="mt-3 text-sm leading-6 text-slate-300">
                      {relation.relationSummary}
                    </p>
                  ) : null}

                  {source.publicSummary ? (
                    <p className="mt-3 text-sm leading-6 text-slate-400">
                      {source.publicSummary}
                    </p>
                  ) : null}

                  <div className="mt-4 grid gap-2 text-xs text-slate-500 sm:grid-cols-2">
                    {source.publicationDate ? (
                      <p>Published: {source.publicationDate}</p>
                    ) : null}
                    {source.filingDate ? (
                      <p>Filed: {source.filingDate}</p>
                    ) : null}
                    {source.priorityDate ? (
                      <p>Priority: {source.priorityDate}</p>
                    ) : null}
                    {source.sourceIdentifier ? (
                      <p>ID: {source.sourceIdentifier}</p>
                    ) : null}
                  </div>

                  {source.sourceUrl ? (
                    <a
                      href={source.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 inline-flex text-sm font-semibold text-sky-300"
                    >
                      Open public source →
                    </a>
                  ) : null}
                </article>
              ))}
            </div>
          )}

          <Link
            href={`/academy/24-link-architecture/${String(
              selected.order,
            ).padStart(2, "0")}-${TA14_24_LINKS.find(
              (item) => item.linkId === selected.linkId,
            )?.slug ?? ""}`}
            className="mt-7 inline-flex text-sm font-semibold text-sky-300"
          >
            Open canonical lesson →
          </Link>
        </aside>
      </section>

      <section className="border-t border-white/10 bg-white/[0.02]">
        <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-200">
            Provenance rule
          </p>

          <h2 className="mt-3 text-3xl font-semibold">
            Chronology, patent position, and architectural doctrine remain distinct records.
          </h2>

          <p className="mt-4 max-w-5xl leading-7 text-slate-300">
            A publication can establish public chronology. A patent application
            can establish a filing record and patent-position relationship. An
            artifact can demonstrate implementation. A review can establish a
            bounded finding. The Academy should show these relationships
            together without claiming that one source automatically proves all
            of the others.
          </p>
        </div>
      </section>
    </main>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
      <div className="text-3xl font-semibold">{value}</div>
      <div className="mt-2 text-xs leading-5 text-slate-400">{label}</div>
    </div>
  );
}
