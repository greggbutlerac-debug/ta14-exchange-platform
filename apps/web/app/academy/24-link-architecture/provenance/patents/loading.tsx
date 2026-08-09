"use client";

import Link from "next/link";

export default function TA14PatentPortfolioMapLoading() {
  return (
    <main className="min-h-screen bg-[#030712] text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(251,191,36,0.13),transparent_36%),radial-gradient(circle_at_82%_12%,rgba(56,189,248,0.11),transparent_34%)]" />

        <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <Link
            href="/academy/24-link-architecture/provenance"
            className="text-sm font-semibold text-sky-300"
          >
            ← Back to Provenance Map
          </Link>

          <p className="mt-10 text-xs font-semibold uppercase tracking-[0.26em] text-amber-300">
            TA-14 Patent Position · Architecture Map
          </p>

          <h1 className="mt-3 max-w-5xl text-4xl font-semibold tracking-tight sm:text-6xl">
            Loading the TA-14 patent architecture…
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-400">
            Resolving patent families, application records, and bounded
            relationships to the canonical 24-link architecture.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {["Patent families", "Applications", "Mapped links", "Relationships"].map(
              (label) => (
                <div
                  key={label}
                  className="min-w-36 rounded-2xl border border-white/10 bg-black/15 px-5 py-4"
                >
                  <div className="h-7 w-14 animate-pulse rounded-lg bg-white/10" />
                  <div className="mt-3 text-xs text-slate-500">{label}</div>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {Array.from({ length: 24 }, (_, index) => (
            <div
              key={index}
              className="rounded-2xl border border-white/10 bg-white/[0.025] p-4"
            >
              <div className="h-3 w-8 animate-pulse rounded bg-white/10" />
              <div className="mt-3 h-4 w-4/5 animate-pulse rounded bg-white/10" />
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-6 pb-20 lg:grid-cols-[1.12fr_0.88fr] lg:px-8">
        <div className="space-y-6">
          {Array.from({ length: 3 }, (_, index) => (
            <div
              key={index}
              className="rounded-3xl border border-white/10 bg-white/[0.025] p-6"
            >
              <div className="h-3 w-28 animate-pulse rounded bg-amber-300/10" />
              <div className="mt-4 h-7 w-2/3 animate-pulse rounded bg-white/10" />
              <div className="mt-6 space-y-3">
                {Array.from({ length: 3 }, (_, row) => (
                  <div
                    key={row}
                    className="rounded-2xl border border-white/10 bg-black/10 p-5"
                  >
                    <div className="h-3 w-32 animate-pulse rounded bg-sky-300/10" />
                    <div className="mt-4 h-4 w-full animate-pulse rounded bg-white/10" />
                    <div className="mt-2 h-4 w-4/5 animate-pulse rounded bg-white/10" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <aside className="rounded-3xl border border-white/10 bg-white/[0.035] p-8 lg:self-start">
          <div className="h-3 w-36 animate-pulse rounded bg-amber-300/10" />
          <div className="mt-5 h-4 w-28 animate-pulse rounded bg-sky-300/10" />
          <div className="mt-4 h-7 w-full animate-pulse rounded bg-white/10" />
          <div className="mt-3 h-7 w-4/5 animate-pulse rounded bg-white/10" />

          <div className="mt-8 space-y-3">
            {Array.from({ length: 4 }, (_, index) => (
              <div
                key={index}
                className="rounded-2xl border border-white/10 bg-black/15 p-4"
              >
                <div className="h-4 w-2/3 animate-pulse rounded bg-white/10" />
                <div className="mt-3 h-3 w-full animate-pulse rounded bg-white/10" />
                <div className="mt-2 h-3 w-5/6 animate-pulse rounded bg-white/10" />
              </div>
            ))}
          </div>
        </aside>
      </section>
    </main>
  );
}
