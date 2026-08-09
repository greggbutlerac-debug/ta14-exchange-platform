import Link from "next/link";

import {
  TA14_24_LINKS,
  TA14_CHAIN_OF_EIGHT,
} from "@/lib/academy/ta14-24-link-canon";

export const metadata = {
  title: "24-Link Academy | TA-14 Academy",
  description:
    "Learn, test, map, replay, and apply the full TA-14 24-Link Admissible Execution Architecture.",
};

const labs = [
  {
    href: "/academy/24-link-architecture",
    title: "24-Link Explorer",
    eyebrow: "Learn",
    body: "Enter the canonical architecture and study every link in sequence.",
  },
  {
    href: "/academy/24-link-architecture/route-state",
    title: "Route State Lab",
    eyebrow: "Locate",
    body: "Identify current state, last admissible state, first broken link, recovery, and forming consequence.",
  },
  {
    href: "/academy/24-link-architecture/simulator",
    title: "Chain Failure Simulator",
    eyebrow: "Pressure",
    body: "Diagnose evidence decay, authority drift, runtime change, refusal, outcome divergence, and memory conflict.",
  },
  {
    href: "/academy/24-link-architecture/passport",
    title: "Chain Passport",
    eyebrow: "Master",
    body: "Progress from recognition through evidence mapping, diagnosis, application, replay, and mastery.",
  },
  {
    href: "/academy/24-link-architecture/build-a-chain",
    title: "Build-a-Chain Lab",
    eyebrow: "Apply",
    body: "Map a real system or architecture against all 24 links and its actual evidence.",
  },
  {
    href: "/academy/24-link-architecture/health",
    title: "Architecture Health Overlay",
    eyebrow: "Evaluate",
    body: "Project bounded evidence states across the full chain without collapsing them into a single score.",
  },
  {
    href: "/academy/24-link-architecture/views",
    title: "Architecture Navigator",
    eyebrow: "Navigate",
    body: "Switch among chain, dependency, evidence, failure, Academy, and chronology views.",
  },
  {
    href: "/academy/24-link-architecture/recursion",
    title: "Recursion Lab",
    eyebrow: "Continue",
    body: "Govern Outcome Reality through Future Chain so execution never becomes the end of the architecture.",
  },
] as const;

export default function TA1424LinkAcademyHubPage() {
  return (
    <main className="min-h-screen bg-[#030712] text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(56,189,248,0.18),transparent_38%),radial-gradient(circle_at_15%_25%,rgba(168,85,247,0.10),transparent_28%),radial-gradient(circle_at_85%_25%,rgba(16,185,129,0.09),transparent_28%)]" />
        <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-300">
            TA-14 Academy · Flagship Architecture Program
          </p>
          <h1 className="mt-4 max-w-5xl text-4xl font-semibold tracking-tight sm:text-6xl">
            Learn the 24 links. Pressure them. Prove them. Apply them.
          </h1>
          <p className="mt-7 max-w-4xl text-lg leading-8 text-slate-300">
            The TA-14 24-Link Academy is an integrated learning and application
            environment for admissible execution. The architecture is taught as
            a governed route with evidence burdens, transition conditions,
            failure states, refusal pathways, outcomes, memory, and recursion.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/academy/24-link-architecture"
              className="rounded-xl border border-sky-300/30 bg-sky-300/10 px-5 py-3 text-sm font-semibold text-sky-100 transition hover:bg-sky-300/15"
            >
              Enter the 24-Link Explorer
            </Link>
            <Link
              href="/academy/24-link-architecture/simulator"
              className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
            >
              Enter the Failure Simulator
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
        <div className="rounded-3xl border border-amber-300/20 bg-amber-300/[0.045] p-7 sm:p-9">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-200">
            Provenance preserved
          </p>
          <h2 className="mt-3 text-2xl font-semibold">
            The Chain of Eight was already created and publicly published May 1, 2025.
          </h2>
          <div className="mt-5 flex flex-wrap gap-2">
            {TA14_CHAIN_OF_EIGHT.map((item, index) => (
              <span
                key={`${item}-${index}`}
                className="rounded-full border border-white/10 bg-black/10 px-3 py-2 text-xs text-slate-300"
              >
                {item}
              </span>
            ))}
          </div>
          <p className="mt-5 max-w-5xl text-sm leading-7 text-slate-300">
            The 24-link architecture represents the subsequent deeper-resolution
            expansion and maturation of that already-existing parent route. The
            Academy must never imply that the original eight anchors were
            developed later.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20 lg:px-8">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-300">
            Academy engine
          </p>
          <h2 className="mt-3 text-3xl font-semibold">
            Eight ways to work with one canonical architecture
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {labs.map((lab) => (
            <Link
              key={lab.href}
              href={lab.href}
              className="group rounded-3xl border border-white/10 bg-white/[0.035] p-6 transition hover:-translate-y-1 hover:border-sky-300/30 hover:bg-white/[0.055]"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-300">
                {lab.eyebrow}
              </p>
              <h3 className="mt-3 text-xl font-semibold">{lab.title}</h3>
              <p className="mt-4 text-sm leading-7 text-slate-400">
                {lab.body}
              </p>
              <p className="mt-6 text-sm font-semibold text-sky-300">
                Enter experience →
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.02]">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-300">
            Canonical route
          </p>
          <div className="mt-7 grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {TA14_24_LINKS.map((item) => (
              <Link
                key={item.linkId}
                href={`/academy/24-link-architecture/${String(
                  item.order,
                ).padStart(2, "0")}-${item.slug}`}
                className="rounded-2xl border border-white/10 bg-black/10 p-4 transition hover:border-emerald-300/30"
              >
                <p className="text-xs font-semibold text-sky-300">
                  {String(item.order).padStart(2, "0")}
                </p>
                <p className="mt-2 text-sm font-semibold leading-5">
                  {item.canonicalName}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <Pillar
            title="Learn"
            body="Understand what each link governs, why it exists, what evidence it requires, and what must become true before progression."
          />
          <Pillar
            title="Diagnose"
            body="Find the last admissible state, first broken link, failure mode, forming consequence, and correct hold, refusal, narrowing, or escalation response."
          />
          <Pillar
            title="Demonstrate"
            body="Map real evidence, replay routes, complete simulations, and build competency records that can later support governed credentials."
          />
        </div>
      </section>
    </main>
  );
}

function Pillar({ title, body }: { title: string; body: string }) {
  return (
    <article className="rounded-3xl border border-white/10 bg-white/[0.035] p-7">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <p className="mt-4 leading-7 text-slate-300">{body}</p>
    </article>
  );
}
