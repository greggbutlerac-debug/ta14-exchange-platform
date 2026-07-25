"use client";

import Link from "next/link";

const cards = [
  {
    title: "Build Route",
    href: "/ai-governance/playground/runtime-execution/build",
    description:
      "Create a Runtime execution route and define the governed action, participants, boundaries, and intended execution state.",
    status: "Ready",
  },
  {
    title: "Attach Evidence",
    href: "/ai-governance/playground/runtime-execution/evidence",
    description:
      "Attach and bind evidence references to a Runtime route before scenario evaluation or execution determination.",
    status: "Ready",
  },
  {
    title: "Run Scenarios",
    href: "/ai-governance/playground/runtime-execution/scenarios",
    description:
      "Run governed Runtime scenarios and evaluate whether the proposed action results in ALLOW, HOLD, DENY, or ESCALATE.",
    status: "Ready",
  },
  {
    title: "Governed Record Candidates",
    href: "/ai-governance/playground/runtime-execution/records",
    description:
      "Review Runtime governed-record candidates created from scenario runs before approving them for preservation.",
    status: "Ready",
  },
  {
    title: "Preserve Record",
    href: "/ai-governance/playground/runtime-execution/preserve",
    description:
      "Preserve an approved Runtime governed-record candidate, generate its SHA-256 integrity envelope, and create an immutable preserved record.",
    status: "Ready",
  },
  {
    title: "Preserved Records",
    href: "/ai-governance/playground/runtime-execution/preserved",
    description:
      "Browse preserved Runtime governed records, inspect their bounded payloads, and open their integrity envelopes.",
    status: "Ready",
  },
  {
    title: "Preservation Verification",
    href: "/ai-governance/playground/runtime-execution/verification",
    description:
      "Verify preserved records, preservation validity, and SHA-256 integrity envelopes across the Runtime record inventory.",
    status: "Ready",
  },
  {
    title: "Integrity Dashboard",
    href: "/ai-governance/playground/runtime-execution/integrity",
    description:
      "Review the aggregate structural and preservation health of every preserved Runtime governed record.",
    status: "Ready",
  },
  {
    title: "Evidence Explorer",
    href: "/ai-governance/playground/runtime-execution/evidence-explorer",
    description:
      "Browse every evidence reference preserved across Runtime governed records and trace each reference back to its record.",
    status: "Ready",
  },
  {
    title: "Preservation Timeline",
    href: "/ai-governance/playground/runtime-execution/timeline",
    description:
      "View preserved Runtime governed records in chronological order and inspect the progression of preserved evidence and determinations.",
    status: "Ready",
  },
  {
    title: "Runtime Search",
    href: "/ai-governance/playground/runtime-execution/search",
    description:
      "Search preserved Runtime governed records by title, record ID, determination, status, or evidence reference.",
    status: "Ready",
  },
];

export default function RuntimeExecutionPage() {
  return (
    <main className="min-h-screen bg-[#03060b] px-5 py-10 text-white sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-200/70">
            TA-14 AI Governance Playground
          </p>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Runtime Execution
          </h1>

          <p className="mt-4 max-w-4xl text-sm leading-7 text-white/65 sm:text-base">
            Build a governed Runtime route, bind its evidence, test
            execution scenarios, review resulting governed-record
            candidates, preserve approved records, and verify the
            integrity of the preserved Runtime corpus.
          </p>
        </div>

        <section className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {cards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="group rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition hover:-translate-y-0.5 hover:border-sky-300/25 hover:bg-white/[0.07]"
            >
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-lg font-semibold text-white/90 transition group-hover:text-sky-100">
                  {card.title}
                </h2>

                <span className="shrink-0 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-emerald-100">
                  {card.status}
                </span>
              </div>

              <p className="mt-4 text-sm leading-7 text-white/60">
                {card.description}
              </p>

              <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-sky-200/65 transition group-hover:text-sky-100">
                Open workspace →
              </p>
            </Link>
          ))}
        </section>

        <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.035] p-6">
          <h2 className="text-lg font-semibold">
            Runtime governing sequence
          </h2>

          <p className="mt-4 max-w-5xl text-sm leading-7 text-white/65">
            Runtime execution proceeds from route definition to
            evidence binding, scenario determination, governed-record
            candidacy, preservation approval, immutable record
            creation, integrity-envelope generation, independent
            verification, searchable review, and chronological
            inspection. No preserved Runtime record should be treated
            as proof beyond the evidence, authority, continuity,
            limitations, and execution boundaries contained within
            that record.
          </p>
        </section>
      </div>
    </main>
  );
}
