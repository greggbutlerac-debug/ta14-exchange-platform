"use client";

import Link from "next/link";

const cards = [
  {
    title: "Build Route",
    href: "/ai-governance/playground/runtime-execution/build",
    description: "Create and govern a Runtime execution route.",
    status: "Ready",
  },
  {
    title: "Attach Evidence",
    href: "/ai-governance/playground/runtime-execution/evidence",
    description: "Bind evidence to the Runtime route.",
    status: "Ready",
  },
  {
    title: "Run Scenarios",
    href: "/ai-governance/playground/runtime-execution/scenarios",
    description: "Execute governed Runtime scenarios.",
    status: "Ready",
  },
  {
    title: "Governed Record Candidates",
    href: "/ai-governance/playground/runtime-execution/records",
    description: "Review approved Runtime governed-record candidates.",
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
    description: "Browse preserved Runtime governed records.",
    status: "Ready",
  },
  {
    title: "Preservation Verification",
    href: "/ai-governance/playground/runtime-execution/verification",
    description:
      "Verify preserved records, preservation validity, and SHA-256 integrity envelopes across the Runtime record inventory.",
    status: "Ready",
  },
];

export default function RuntimeExecutionPage() {
  return (
    <main className="min-h-screen bg-[#03060b] p-8 text-white">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-4xl font-bold">Runtime Execution</h1>

        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {cards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition hover:border-white/20 hover:bg-white/[0.07]"
            >
              <div className="flex items-center justify-between gap-4">
                <h2 className="font-semibold">{card.title}</h2>

                <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2 py-1 text-xs text-emerald-100">
                  {card.status}
                </span>
              </div>

              <p className="mt-4 text-sm leading-6 text-white/65">
                {card.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
