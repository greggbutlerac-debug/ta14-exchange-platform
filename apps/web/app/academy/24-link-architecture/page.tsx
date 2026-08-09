import Link from "next/link";
import {
  TA14_24_LINKS,
  TA14_FOUNDATIONAL_CHAIN,
} from "@/lib/academy/ta14-24-link-canon";

export const metadata = {
  title: "24-Link Architecture Explorer | TA-14 Academy",
  description:
    "Explore the full TA-14 Admissible Execution Architecture from Admissible Reality through Future Chain.",
};

const regions = [
  {
    title: "Reality & Evidence",
    range: [1, 6],
    description:
      "Establish what is real, preserve it as a record, protect continuity, govern evidence, and determine what may be treated as admissible truth.",
  },
  {
    title: "Reliance, Authority & Consequence",
    range: [7, 12],
    description:
      "Determine whether evidence may be relied upon, who may act, whether authority is legitimate, and how consequence begins to form and attach.",
  },
  {
    title: "Binding, Commit & Execution",
    range: [13, 19],
    description:
      "Govern binding and commitment boundaries, current execution reality, admissible non-occurrence, prevented consequence, and execution itself.",
  },
  {
    title: "Outcome, Recursion & Memory",
    range: [20, 24],
    description:
      "Observe outcome reality, determine the outcome, establish the new reality, preserve memory, and govern entry into the future chain.",
  },
] as const;

function getRegionLinks(start: number, end: number) {
  return TA14_24_LINKS.filter((item) => item.number >= start && item.number <= end);
}

export default function TA1424LinkExplorerPage() {
  return (
    <main className="min-h-screen bg-[#030712] text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(56,189,248,0.16),transparent_42%)]" />
        <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
          <div className="max-w-4xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.28em] text-sky-300">
              TA-14 Academy · Canon Explorer
            </p>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
              The 24-Link Admissible Execution Architecture
            </h1>
            <p className="mt-7 max-w-3xl text-lg leading-8 text-slate-300">
              Learn the architecture as a governed route, not a vocabulary list.
              Every link has a purpose, evidence burden, failure condition,
              transition rule, and consequence for what may happen next.
            </p>

            <div className="mt-10 rounded-2xl border border-amber-300/25 bg-amber-300/5 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-200">
                Provenance rule
              </p>
              <p className="mt-3 leading-7 text-slate-200">
                The foundational Chain of Eight was created and publicly
                published on May 1, 2025. The 24-link architecture is the
                subsequent deeper-resolution expansion of that already-existing
                parent route; it does not move the origin of the original eight.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {TA14_FOUNDATIONAL_CHAIN.map((name, index) => (
                  <span
                    key={`${name}-${index}`}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300"
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <Metric value="24" label="Canonical links" />
          <Metric value="8" label="Foundational anchors" />
          <Metric value="4" label="Architecture regions" />
          <Metric value="1" label="Governed route" />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-8">
        <div className="space-y-16">
          {regions.map((region) => {
            const [start, end] = region.range;
            const links = getRegionLinks(start, end);

            return (
              <section key={region.title}>
                <div className="mb-7 max-w-3xl">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-300">
                    Links {start}–{end}
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">
                    {region.title}
                  </h2>
                  <p className="mt-3 leading-7 text-slate-400">
                    {region.description}
                  </p>
                </div>

                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {links.map((item) => (
                    <article
                      key={item.id}
                      className="group rounded-2xl border border-white/10 bg-white/[0.035] p-6 transition hover:-translate-y-1 hover:border-sky-300/35 hover:bg-white/[0.055]"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-300">
                            Link {String(item.number).padStart(2, "0")}
                          </p>
                          <h3 className="mt-2 text-xl font-semibold">
                            {item.name}
                          </h3>
                        </div>
                        <span className="rounded-full border border-white/10 px-2.5 py-1 text-xs text-slate-400">
                          {item.parentAnchor}
                        </span>
                      </div>

                      <p className="mt-5 line-clamp-4 text-sm leading-6 text-slate-300">
                        {item.canonicalDefinition}
                      </p>

                      <div className="mt-6 border-t border-white/10 pt-5">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                          Governing question
                        </p>
                        <p className="mt-2 text-sm leading-6 text-slate-300">
                          {item.governingQuestion}
                        </p>
                      </div>

                      <Link
                        href={`/academy/24-link-architecture/${String(
                          item.number,
                        ).padStart(2, "0")}-${item.slug}`}
                        className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-sky-300 transition group-hover:text-sky-200"
                      >
                        Enter link
                        <span aria-hidden="true">→</span>
                      </Link>
                    </article>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </section>

      <section className="border-t border-white/10 bg-white/[0.025]">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-300">
                Academy objective
              </p>
              <h2 className="mt-3 text-3xl font-semibold">
                Learn where execution becomes supportable — and where it must stop.
              </h2>
              <p className="mt-4 max-w-3xl leading-7 text-slate-300">
                The Explorer is the front door to link-level doctrine,
                evidence mapping, failure diagnosis, transition testing,
                Route State, simulations, replay, and eventual Chain Passport
                mastery.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#07101f] p-6">
              <p className="text-sm font-semibold text-white">
                Core learner questions
              </p>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
                <li>What must be true at this link?</li>
                <li>What evidence proves it?</li>
                <li>What failure invalidates progression?</li>
                <li>What may happen next?</li>
                <li>When must the route hold, refuse, or escalate?</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-6">
      <div className="text-3xl font-semibold text-white">{value}</div>
      <div className="mt-2 text-sm text-slate-400">{label}</div>
    </div>
  );
}
