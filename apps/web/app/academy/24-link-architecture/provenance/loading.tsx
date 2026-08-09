"use client";

import Link from "next/link";

export default function TA14ProvenanceLoading() {
  return (
    <main className="min-h-screen bg-[#030712] text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_0%,rgba(59,130,246,0.16),transparent_36%),radial-gradient(circle_at_84%_10%,rgba(168,85,247,0.11),transparent_34%)]" />

        <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <Link
            href="/academy/24-link-architecture"
            className="text-sm font-semibold text-sky-300"
          >
            ← Back to 24-Link Explorer
          </Link>

          <p className="mt-10 text-xs font-semibold uppercase tracking-[0.26em] text-indigo-300">
            TA-14 Academy · Provenance Map
          </p>

          <h1 className="mt-3 max-w-5xl text-4xl font-semibold tracking-tight sm:text-6xl">
            Resolving the architecture evidence graph…
          </h1>

          <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-400">
            Loading canonical chronology, publications, patent-position
            relationships, artifacts, reviews, and link-level provenance.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {Array.from({ length: 5 }, (_, index) => (
            <div
              key={index}
              className="rounded-2xl border border-white/10 bg-white/[0.035] p-5"
            >
              <div className="h-8 w-16 animate-pulse rounded bg-white/10" />
              <div className="mt-3 h-3 w-28 animate-pulse rounded bg-white/10" />
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-6 pb-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <section className="rounded-3xl border border-white/10 bg-white/[0.025] p-6">
          <div className="h-3 w-44 animate-pulse rounded bg-indigo-300/10" />

          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 24 }, (_, index) => (
              <div
                key={index}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
              >
                <div className="flex justify-between gap-4">
                  <div className="h-3 w-8 animate-pulse rounded bg-sky-300/10" />
                  <div className="h-5 w-14 animate-pulse rounded-full bg-white/10" />
                </div>
                <div className="mt-3 h-4 w-4/5 animate-pulse rounded bg-white/10" />
              </div>
            ))}
          </div>
        </section>

        <aside className="rounded-3xl border border-white/10 bg-white/[0.035] p-8 lg:self-start">
          <div className="h-3 w-20 animate-pulse rounded bg-sky-300/10" />
          <div className="mt-4 h-8 w-3/4 animate-pulse rounded bg-white/10" />

          <div className="mt-7 space-y-4">
            {Array.from({ length: 4 }, (_, index) => (
              <div
                key={index}
                className="rounded-2xl border border-white/10 bg-black/15 p-5"
              >
                <div className="flex gap-2">
                  <div className="h-5 w-24 animate-pulse rounded-full bg-sky-300/10" />
                  <div className="h-5 w-20 animate-pulse rounded-full bg-white/10" />
                </div>
                <div className="mt-4 h-4 w-full animate-pulse rounded bg-white/10" />
                <div className="mt-2 h-4 w-5/6 animate-pulse rounded bg-white/10" />
              </div>
            ))}
          </div>
        </aside>
      </section>
    </main>
  );
}
