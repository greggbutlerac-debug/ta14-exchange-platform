"use client";

import Link from "next/link";

const librarySections = [
  {
    title: "Runtime Execution",
    description:
      "Build governed execution routes, bind evidence, run scenarios, preserve governed records, and verify integrity.",
    href: "/ai-governance/playground/runtime-execution",
  },
  {
    title: "Preserved Records",
    description:
      "Browse preserved Runtime governed records and inspect their bounded payloads, lineage, authority, and limitations.",
    href: "/ai-governance/playground/runtime-execution/preserved",
  },
  {
    title: "Preservation Verification",
    description:
      "Verify preserved records against their structural requirements and SHA-256 integrity envelopes.",
    href: "/ai-governance/playground/runtime-execution/verification",
  },
  {
    title: "Integrity Dashboard",
    description:
      "Review the aggregate integrity health of the preserved Runtime record inventory.",
    href: "/ai-governance/playground/runtime-execution/integrity",
  },
  {
    title: "Evidence Explorer",
    description:
      "Trace preserved evidence references back to the governed records in which they were relied upon.",
    href: "/ai-governance/playground/runtime-execution/evidence-explorer",
  },
  {
    title: "Preservation Timeline",
    description:
      "Review preserved Runtime governed records in chronological order.",
    href: "/ai-governance/playground/runtime-execution/timeline",
  },
  {
    title: "Runtime Search",
    description:
      "Search preserved Runtime governed records by title, record ID, determination, status, or evidence reference.",
    href: "/ai-governance/playground/runtime-execution/search",
  },
  {
    title: "AI Governance Registry",
    description:
      "Open the registry for dated, attributable, searchable, reviewable, and challengeable governance records.",
    href: "/registry",
  },
  {
    title: "EU AI Act Workspace",
    description:
      "Explore actor roles, applicability, legal duties, evidence dependencies, and governed implementation routes.",
    href: "/eu-ai-act",
  },
];

export default function AiGovernanceLibraryPage() {
  return (
    <main className="min-h-screen bg-[#03060b] px-5 py-10 text-white sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-200/70">
              TA-14 AI Governance Workspace
            </p>

            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Governance Library
            </h1>

            <p className="mt-4 max-w-4xl text-sm leading-7 text-white/65 sm:text-base">
              Open the principal TA-14 AI governance workspaces for
              governed execution, preserved records, evidence review,
              verification, registry access, and EU AI Act
              implementation.
            </p>
          </div>

          <Link
            href="/workspace/ai-governance"
            className="rounded-xl border border-white/15 bg-white/[0.05] px-5 py-3 text-sm font-semibold transition hover:border-white/30 hover:bg-white/[0.09]"
          >
            AI Governance Workspace
          </Link>
        </div>

        <section className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {librarySections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="group rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition hover:-translate-y-0.5 hover:border-sky-300/25 hover:bg-white/[0.07]"
            >
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-lg font-semibold text-white/90 transition group-hover:text-sky-100">
                  {section.title}
                </h2>

                <span className="shrink-0 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-emerald-100">
                  Open
                </span>
              </div>

              <p className="mt-4 text-sm leading-7 text-white/60">
                {section.description}
              </p>

              <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-sky-200/65 transition group-hover:text-sky-100">
                Enter workspace →
              </p>
            </Link>
          ))}
        </section>

        <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.035] p-6">
          <h2 className="text-lg font-semibold">
            Governing boundary
          </h2>

          <p className="mt-4 max-w-5xl text-sm leading-7 text-white/65">
            The library provides access to governance workspaces and
            preserved records. A page, route, record, verification
            result, or registry entry does not by itself establish
            certification, legal compliance, regulatory approval, or
            proof that a real-world execution occurred. Each claim
            remains bounded by its evidence, authority, continuity,
            declared scope, limitations, and preserved outcome.
          </p>
        </section>
      </div>
    </main>
  );
}
