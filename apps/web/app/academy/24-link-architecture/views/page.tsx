"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import {
  TA14_24_LINKS,
  TA14_ARCHITECTURE_REGIONS,
} from "@/lib/academy/ta14-24-link-canon";

type ViewMode =
  | "chain"
  | "dependency"
  | "evidence"
  | "failure"
  | "academy"
  | "chronology";

const VIEWS: readonly {
  id: ViewMode;
  label: string;
  description: string;
}[] = [
  {
    id: "chain",
    label: "Chain View",
    description: "See the canonical 24-link route in execution order.",
  },
  {
    id: "dependency",
    label: "Dependency View",
    description: "See what each link depends on before progression is supportable.",
  },
  {
    id: "evidence",
    label: "Evidence View",
    description: "See the evidence burden and proof object associated with every link.",
  },
  {
    id: "failure",
    label: "Failure View",
    description: "See the failure modes that can break or hold the governed route.",
  },
  {
    id: "academy",
    label: "Academy View",
    description: "Enter the canonical lesson for any link.",
  },
  {
    id: "chronology",
    label: "Chronology View",
    description: "Preserve the May 1, 2025 Chain-of-Eight origin and later 24-link expansion.",
  },
];

export default function TA14ArchitectureViewsPage() {
  const [view, setView] = useState<ViewMode>("chain");

  const active = useMemo(
    () => VIEWS.find((item) => item.id === view) ?? VIEWS[0],
    [view],
  );

  return (
    <main className="min-h-screen bg-[#030712] text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(99,102,241,0.15),transparent_38%),radial-gradient(circle_at_84%_10%,rgba(56,189,248,0.12),transparent_34%)]" />
        <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <Link
            href="/academy/24-link-architecture"
            className="text-sm font-semibold text-sky-300 transition hover:text-sky-200"
          >
            ← Back to 24-Link Explorer
          </Link>
          <p className="mt-10 text-xs font-semibold uppercase tracking-[0.26em] text-indigo-300">
            TA-14 Academy · Architecture Navigator
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-6xl">
            24-Link Architecture Views
          </h1>
          <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-300">
            One canon, multiple governed views. Change the lens without
            changing the underlying architecture.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {VIEWS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setView(item.id)}
              className={[
                "rounded-2xl border p-5 text-left transition",
                view === item.id
                  ? "border-indigo-300/40 bg-indigo-300/[0.09]"
                  : "border-white/10 bg-white/[0.035] hover:border-white/20",
              ].join(" ")}
            >
              <p className="font-semibold">{item.label}</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                {item.description}
              </p>
            </button>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20 lg:px-8">
        <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-indigo-300">
            {active.label}
          </p>
          <p className="mt-3 max-w-4xl leading-7 text-slate-300">
            {active.description}
          </p>

          <div className="mt-8">
            {view === "chronology" ? (
              <ChronologyView />
            ) : (
              <LinkGrid view={view} />
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

function LinkGrid({ view }: { view: Exclude<ViewMode, "chronology"> }) {
  return (
    <div className="space-y-10">
      {TA14_ARCHITECTURE_REGIONS.map((region) => {
        const links = region.linkIds
          .map((id) => TA14_24_LINKS.find((item) => item.linkId === id))
          .filter(
            (item): item is (typeof TA14_24_LINKS)[number] => Boolean(item),
          );

        return (
          <section key={region.id}>
            <h2 className="text-xl font-semibold">{region.label}</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {links.map((item) => (
                <article
                  key={item.linkId}
                  className="rounded-2xl border border-white/10 bg-black/15 p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold text-sky-300">
                        {String(item.order).padStart(2, "0")}
                      </p>
                      <h3 className="mt-2 font-semibold">
                        {item.canonicalName}
                      </h3>
                    </div>
                    <span className="rounded-full border border-white/10 px-2 py-1 text-[10px] text-slate-500">
                      {item.parentAnchor}
                    </span>
                  </div>

                  <ViewContent item={item} view={view} />
                </article>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function ViewContent({
  item,
  view,
}: {
  item: (typeof TA14_24_LINKS)[number];
  view: Exclude<ViewMode, "chronology">;
}) {
  if (view === "chain") {
    return (
      <p className="mt-4 text-sm leading-6 text-slate-300">
        {item.definition}
      </p>
    );
  }

  if (view === "dependency") {
    return (
      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
          Upstream dependencies
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {item.upstreamDependencies.length ? (
            item.upstreamDependencies.map((id) => {
              const dependency = TA14_24_LINKS.find(
                (candidate) => candidate.linkId === id,
              );
              return (
                <span
                  key={id}
                  className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-slate-300"
                >
                  {dependency
                    ? `${String(dependency.order).padStart(2, "0")} ${dependency.canonicalName}`
                    : id}
                </span>
              );
            })
          ) : (
            <span className="text-sm text-slate-400">
              Entry state: no prior chain link.
            </span>
          )}
        </div>
        <p className="mt-4 text-sm leading-6 text-slate-300">
          {item.transitionRule}
        </p>
      </div>
    );
  }

  if (view === "evidence") {
    return (
      <div className="mt-4 space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            Proof object
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            {item.proofObject}
          </p>
        </div>
        <ul className="space-y-2">
          {item.evidenceRequirements.slice(0, 3).map((value) => (
            <li key={value} className="text-sm leading-6 text-slate-400">
              • {value}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (view === "failure") {
    return (
      <div className="mt-4">
        <ul className="space-y-2">
          {item.failureModes.slice(0, 3).map((value) => (
            <li key={value} className="text-sm leading-6 text-rose-200/80">
              • {value}
            </li>
          ))}
        </ul>
        <p className="mt-4 border-t border-white/10 pt-4 text-sm leading-6 text-slate-400">
          {item.holdRefuseEscalateRule}
        </p>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <p className="text-sm leading-6 text-slate-300">{item.masteryTask}</p>
      <Link
        href={`/academy/24-link-architecture/${String(item.order).padStart(
          2,
          "0",
        )}-${item.slug}`}
        className="mt-4 inline-flex text-sm font-semibold text-sky-300"
      >
        Enter canonical lesson →
      </Link>
    </div>
  );
}

function ChronologyView() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="rounded-3xl border border-amber-300/25 bg-amber-300/[0.055] p-7">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-200">
          May 1, 2025 · Foundational publication
        </p>
        <h2 className="mt-3 text-2xl font-semibold">
          Chain of Eight already exists
        </h2>
        <p className="mt-4 leading-7 text-slate-300">
          Reality → Record → Continuity → Admissibility → Binding → Commit →
          Execution → Outcome
        </p>
        <p className="mt-5 text-sm leading-7 text-slate-400">
          The Exchange must not imply that these eight foundational anchors
          were developed later.
        </p>
      </section>

      <section className="rounded-3xl border border-sky-300/25 bg-sky-300/[0.055] p-7">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-200">
          Subsequent architectural maturation
        </p>
        <h2 className="mt-3 text-2xl font-semibold">
          Deeper resolution into 24 links
        </h2>
        <p className="mt-4 leading-7 text-slate-300">
          The expanded architecture develops additional evidence, authority,
          consequence, runtime, non-occurrence, outcome, memory, and future-chain
          states around the already-published parent route.
        </p>
        <p className="mt-5 text-sm leading-7 text-slate-400">
          Expansion increases architectural resolution; it does not move the
          provenance date of the original Chain of Eight.
        </p>
      </section>
    </div>
  );
}
