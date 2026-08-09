"use client";

import Link from "next/link";

export default function TA14PatentFamiliesLoading() {
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
            Loading the eight TA-14 patent families…
          </h1>

          <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-400">
            Resolving application membership, family-level architecture
            coverage, and bounded patent-position relationships.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-2">
          {Array.from({ length: 8 }, (_, familyIndex) => (
            <article
              key={familyIndex}
              className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8"
            >
              <div className="flex items-start justify-between gap-5">
                <div className="min-w-0 flex-1">
                  <div className="h-3 w-28 animate-pulse rounded bg-amber-300/10" />
                  <div className="mt-4 h-7 w-4/5 animate-pulse rounded bg-white/10" />
                  <div className="mt-2 h-7 w-3/5 animate-pulse rounded bg-white/10" />
                </div>

                <div className="flex gap-2">
                  {Array.from({ length: 3 }, (_, badgeIndex) => (
                    <div
                      key={badgeIndex}
                      className="h-12 w-12 animate-pulse rounded-xl border border-white/10 bg-black/15"
                    />
                  ))}
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {Array.from(
                  { length: 5 + (familyIndex % 4) },
                  (_, linkIndex) => (
                    <div
                      key={linkIndex}
                      className="h-6 w-20 animate-pulse rounded-full border border-white/10 bg-white/[0.025]"
                    />
                  ),
                )}
              </div>

              <div className="mt-7 space-y-3">
                {Array.from(
                  { length: familyIndex === 2 ? 5 : 2 },
                  (_, applicationIndex) => (
                    <div
                      key={applicationIndex}
                      className="rounded-2xl border border-white/10 bg-black/10 p-4"
                    >
                      <div className="h-3 w-28 animate-pulse rounded bg-sky-300/10" />
                      <div className="mt-3 h-4 w-full animate-pulse rounded bg-white/10" />
                      <div className="mt-2 h-4 w-4/5 animate-pulse rounded bg-white/10" />
                    </div>
                  ),
                )}
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
