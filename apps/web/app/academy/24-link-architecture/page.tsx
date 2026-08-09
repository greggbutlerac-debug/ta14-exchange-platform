import Link from "next/link";

import {
  TA14_24_LINKS,
  TA14_CHAIN_OF_EIGHT,
} from "@/lib/academy/ta14-24-link-canon";

export const metadata = {
  title: "24-Link Architecture Explorer | TA-14 Academy",
  description:
    "Explore the TA-14 24-Link Admissible Execution Architecture as a governed route from Admissible Reality through Future Chain.",
};

const regions = [
  {
    id: "reality-evidence",
    number: "01",
    title: "Reality & Evidence",
    range: [1, 6] as const,
    signal: "Establish",
    question:
      "What is real, what was recorded, and what evidence may become admissible?",
    description:
      "Establish the observable state, preserve it as a record, protect continuity, govern the evidence, and determine what may be treated as admissible truth.",
  },
  {
    id: "reliance-authority",
    number: "02",
    title: "Reliance, Authority & Consequence",
    range: [7, 12] as const,
    signal: "Authorize",
    question:
      "May the evidence be relied upon, by whom, and with what consequence beginning to form?",
    description:
      "Determine whether evidence may be relied upon, whether authority exists and is legitimate, and how consequence begins to form, attach, and approach binding.",
  },
  {
    id: "binding-execution",
    number: "03",
    title: "Binding, Commit & Execution",
    range: [13, 19] as const,
    signal: "Control",
    question:
      "Has the route become binding, may it cross commit, and should execution occur at all?",
    description:
      "Govern binding, commitment, current execution reality, admissible non-occurrence, prevented consequence, and consequence-bearing execution.",
  },
  {
    id: "outcome-recursion",
    number: "04",
    title: "Outcome, Recursion & Memory",
    range: [20, 24] as const,
    signal: "Recur",
    question:
      "What happened, what is true now, what must be remembered, and what may begin next?",
    description:
      "Observe outcome reality, determine the governed outcome, establish the new reality, preserve memory, and govern entry into a future chain.",
  },
] as const;

const primaryExperiences = [
  {
    href: "/academy/24-link-architecture/route-state",
    index: "01",
    eyebrow: "ROUTE STATE",
    title: "Locate the live chain",
    body: "Identify current state, last admissible state, first broken link, required recovery, and the consequence already beginning to form.",
    action: "Open Route State Lab",
  },
  {
    href: "/academy/24-link-architecture/simulator",
    index: "02",
    eyebrow: "PRESSURE TEST",
    title: "Break it safely",
    body: "Pressure evidence, authority, continuity, execution, outcome, and memory without confusing technical completion with admissible execution.",
    action: "Enter Failure Simulator",
  },
  {
    href: "/academy/24-link-architecture/build-a-chain",
    index: "03",
    eyebrow: "APPLICATION",
    title: "Map a real system",
    body: "Take a real architecture or workflow and map the evidence it actually supports across all 24 canonical links.",
    action: "Open Build-a-Chain",
  },
  {
    href: "/academy/24-link-architecture/passport",
    index: "04",
    eyebrow: "MASTERY",
    title: "Demonstrate competency",
    body: "Progress from recognition through explanation, evidence mapping, diagnosis, application, replay, and mastery.",
    action: "Open Chain Passport",
  },
] as const;

const secondaryExperiences = [
  {
    href: "/academy/24-link-architecture/health",
    label: "Architecture Health",
    code: "HL",
    text: "Project bounded evidence states without collapsing uncertainty into a single score.",
  },
  {
    href: "/academy/24-link-architecture/views",
    label: "Architecture Navigator",
    code: "NV",
    text: "Switch between chain, dependency, evidence, failure, Academy, and chronology views.",
  },
  {
    href: "/academy/24-link-architecture/recursion",
    label: "Recursion Lab",
    code: "RC",
    text: "Carry Outcome Reality through New Reality, Memory, and Future Chain.",
  },
  {
    href: "/academy/24-link-architecture/provenance",
    label: "Provenance Map",
    code: "PV",
    text: "Trace chronology, publications, artifacts, reviews, and governed source relationships.",
  },
  {
    href: "/academy/24-link-architecture/provenance/patents",
    label: "Patent Portfolio",
    code: "PP",
    text: "Explore documented application records and bounded patent-position relationships.",
  },
  {
    href: "/academy/24-link-architecture/provenance/patents/families",
    label: "Eight Patent Families",
    code: "PF",
    text: "Study the portfolio by family while preserving application-level boundaries.",
  },
] as const;

const learnerQuestions = [
  "What must be true here?",
  "What evidence supports it?",
  "What breaks this state?",
  "What consequence is forming?",
  "What may happen next?",
  "When must the route hold, refuse, narrow, or escalate?",
] as const;

function getRegionLinks(start: number, end: number) {
  return TA14_24_LINKS.filter(
    (item) => item.order >= start && item.order <= end,
  );
}

export default function TA1424LinkExplorerPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#020611] text-white">
      <Hero />
      <SignalBar />
      <ArchitectureSpine />
      <RegionExplorer />
      <PressureDeck />
      <ProvenanceGateway />
      <CanonicalMatrix />
      <OriginSection />
      <ClosingSection />
    </main>
  );
}

function Hero() {
  return (
    <section className="relative isolate min-h-[760px] overflow-hidden border-b border-white/10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_8%,rgba(14,165,233,0.20),transparent_30%),radial-gradient(circle_at_82%_10%,rgba(99,102,241,0.17),transparent_31%),radial-gradient(circle_at_52%_88%,rgba(16,185,129,0.09),transparent_32%)]" />
      <div className="absolute left-1/2 top-0 h-full w-px bg-gradient-to-b from-transparent via-sky-300/10 to-transparent" />
      <div className="absolute left-[7%] right-[7%] top-32 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute -left-28 top-48 h-80 w-80 rounded-full border border-sky-300/[0.08]" />
      <div className="absolute -right-24 top-24 h-96 w-96 rounded-full border border-indigo-300/[0.08]" />

      <div className="relative mx-auto grid max-w-7xl gap-16 px-6 pb-20 pt-20 lg:grid-cols-[1.02fr_0.98fr] lg:px-8 lg:pb-28 lg:pt-28">
        <div className="flex flex-col justify-center">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-sky-300/20 bg-sky-300/[0.06] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.24em] text-sky-200">
              TA-14 Academy
            </span>
            <span className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
              Canon Explorer
            </span>
          </div>

          <h1 className="mt-8 max-w-4xl text-5xl font-semibold tracking-[-0.045em] sm:text-6xl lg:text-7xl">
            The architecture of
            <span className="block bg-gradient-to-r from-sky-200 via-white to-indigo-200 bg-clip-text text-transparent">
              admissible execution.
            </span>
          </h1>

          <p className="mt-7 max-w-3xl text-lg leading-8 text-slate-300 sm:text-xl">
            Twenty-four linked states govern the route from reality and evidence
            through authority, consequence, binding, commit, execution,
            outcome, memory, and the next chain.
          </p>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-500">
            TA-14 treats the architecture as a consequence-bearing route, not
            a vocabulary list. Every link has an evidence burden, failure
            condition, transition rule, and downstream effect.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="#architecture-spine"
              className="group inline-flex items-center gap-3 rounded-2xl bg-white px-5 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-sky-100"
            >
              Enter the architecture
              <span className="transition group-hover:translate-x-1">↓</span>
            </Link>
            <Link
              href="/academy/24-link-architecture/route-state"
              className="group inline-flex items-center gap-3 rounded-2xl border border-sky-300/20 bg-sky-300/[0.055] px-5 py-3.5 text-sm font-semibold text-sky-100 transition hover:border-sky-300/35 hover:bg-sky-300/[0.09]"
            >
              Open Route State
              <span className="transition group-hover:translate-x-1">→</span>
            </Link>
            <Link
              href="/academy/24-link-architecture/provenance"
              className="group inline-flex items-center gap-3 rounded-2xl border border-indigo-300/20 bg-indigo-300/[0.055] px-5 py-3.5 text-sm font-semibold text-indigo-100 transition hover:border-indigo-300/35 hover:bg-indigo-300/[0.09]"
            >
              Trace Provenance
              <span className="transition group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>

        <div className="relative flex min-h-[520px] items-center justify-center">
          <div className="absolute h-[430px] w-[430px] rounded-full border border-white/[0.07]" />
          <div className="absolute h-[345px] w-[345px] rounded-full border border-sky-300/[0.10]" />
          <div className="absolute h-[260px] w-[260px] rounded-full border border-indigo-300/[0.11]" />
          <div className="absolute h-[175px] w-[175px] rounded-full border border-emerald-300/[0.11]" />

          <div className="absolute h-[390px] w-px rotate-45 bg-gradient-to-b from-transparent via-sky-300/15 to-transparent" />
          <div className="absolute h-[390px] w-px -rotate-45 bg-gradient-to-b from-transparent via-indigo-300/15 to-transparent" />
          <div className="absolute h-px w-[390px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          <div className="relative z-10 flex h-44 w-44 flex-col items-center justify-center rounded-full border border-sky-200/25 bg-[#061123]/95 text-center shadow-[0_0_110px_rgba(56,189,248,0.13)] backdrop-blur-xl">
            <span className="text-[10px] font-semibold uppercase tracking-[0.26em] text-sky-300">
              TA-14
            </span>
            <span className="mt-2 text-5xl font-semibold tracking-tight">
              24
            </span>
            <span className="mt-1 text-xs text-slate-400">
              linked states
            </span>
          </div>

          <OrbitNode className="left-7 top-16" number="01" label="Reality" />
          <OrbitNode className="right-2 top-28" number="06" label="Truth" />
          <OrbitNode className="right-7 bottom-20" number="15" label="Commit" />
          <OrbitNode className="left-0 bottom-24" number="19" label="Execution" />
          <OrbitNode
            className="left-1/2 top-1 -translate-x-1/2"
            number="24"
            label="Future"
          />
        </div>
      </div>
    </section>
  );
}

function SignalBar() {
  return (
    <section className="border-b border-white/10 bg-[#030916]">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px bg-white/10 px-px sm:grid-cols-3 lg:grid-cols-6">
        <Signal value="24" label="Canonical links" />
        <Signal value="8" label="Foundational anchors" />
        <Signal value="4" label="Architecture regions" />
        <Signal value="6" label="Learner questions" />
        <Signal value="11" label="Academy experiences" />
        <Signal value="1" label="Governed route" />
      </div>
    </section>
  );
}

function ArchitectureSpine() {
  return (
    <section
      id="architecture-spine"
      className="relative border-b border-white/10 bg-[#030916]"
    >
      <div className="mx-auto max-w-[1500px] px-6 py-20 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300">
              Canonical architecture spine
            </p>
            <h2 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight">
              Follow the route before you enter the detail.
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-slate-400">
            The chain is directional. Evidence and authority accumulate,
            consequences form, boundaries attach, execution either becomes
            admissible or is correctly prevented, and outcome creates a new
            reality that the future chain must inherit.
          </p>
        </div>

        <div className="relative mt-14 overflow-x-auto pb-6">
          <div className="min-w-[1480px]">
            <div className="absolute left-5 right-5 top-5 h-px bg-gradient-to-r from-sky-300/10 via-emerald-300/40 to-indigo-300/10" />

            <div className="relative grid grid-cols-24 gap-2">
              {TA14_24_LINKS.map((item) => (
                <Link
                  key={item.linkId}
                  href={`/academy/24-link-architecture/${String(
                    item.order,
                  ).padStart(2, "0")}-${item.slug}`}
                  className="group flex min-w-0 flex-col items-center text-center"
                >
                  <span className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-[#071326] text-[11px] font-semibold text-sky-200 shadow-[0_0_0_6px_rgba(3,9,22,1)] transition duration-300 group-hover:scale-110 group-hover:border-sky-300/50 group-hover:bg-sky-300/10">
                    {String(item.order).padStart(2, "0")}
                  </span>
                  <span className="mt-4 max-w-[78px] text-[10px] font-semibold leading-4 text-slate-500 transition group-hover:text-slate-200">
                    {item.canonicalName}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mx-auto mt-10 grid max-w-7xl gap-4 lg:grid-cols-4">
          {regions.map((region) => (
            <a
              key={region.id}
              href={`#${region.id}`}
              className="group rounded-3xl border border-white/10 bg-white/[0.025] p-5 transition hover:border-sky-300/25 hover:bg-white/[0.04]"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-300">
                  Region {region.number}
                </span>
                <span className="text-xs text-slate-600">
                  {region.range[0]}–{region.range[1]}
                </span>
              </div>
              <h3 className="mt-3 text-lg font-semibold">{region.title}</h3>
              <p className="mt-3 text-xs leading-5 text-slate-500">
                {region.question}
              </p>
              <p className="mt-5 text-xs font-semibold text-sky-300 opacity-0 transition group-hover:opacity-100">
                Enter region ↓
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function RegionExplorer() {
  return (
    <section className="relative mx-auto max-w-7xl px-6 py-24 lg:px-8">
      <div className="space-y-24">
        {regions.map((region, regionIndex) => {
          const [start, end] = region.range;
          const links = getRegionLinks(start, end);

          return (
            <section
              key={region.id}
              id={region.id}
              className="scroll-mt-28"
            >
              <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr]">
                <div className="lg:sticky lg:top-28 lg:self-start">
                  <div className="flex items-center gap-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full border border-sky-300/20 bg-sky-300/[0.06] text-sm font-semibold text-sky-200">
                      {region.number}
                    </span>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                        Links {start}–{end}
                      </p>
                      <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">
                        {region.signal}
                      </p>
                    </div>
                  </div>

                  <h2 className="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">
                    {region.title}
                  </h2>

                  <p className="mt-5 max-w-lg text-base leading-8 text-slate-300">
                    {region.description}
                  </p>

                  <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.025] p-5">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                      Region question
                    </p>
                    <p className="mt-3 text-sm font-semibold leading-6 text-white">
                      {region.question}
                    </p>
                  </div>

                  {regionIndex === 2 ? (
                    <div className="mt-4 rounded-2xl border border-rose-300/15 bg-rose-300/[0.035] p-5">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-rose-200">
                        Execution boundary
                      </p>
                      <p className="mt-3 text-sm leading-6 text-slate-300">
                        Technical ability to execute is not enough. The route
                        must remain admissible through the consequence-bearing
                        boundary.
                      </p>
                    </div>
                  ) : null}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {links.map((item) => (
                    <Link
                      key={item.linkId}
                      href={`/academy/24-link-architecture/${String(
                        item.order,
                      ).padStart(2, "0")}-${item.slug}`}
                      className="group relative isolate min-h-[310px] overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03] p-6 transition duration-300 hover:-translate-y-1 hover:border-sky-300/30 hover:bg-white/[0.05]"
                    >
                      <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full border border-white/[0.05] transition duration-500 group-hover:scale-125 group-hover:border-sky-300/[0.09]" />

                      <div className="relative flex h-full flex-col">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-sky-300">
                              Link {String(item.order).padStart(2, "0")}
                            </p>
                            <h3 className="mt-3 text-xl font-semibold">
                              {item.canonicalName}
                            </h3>
                          </div>
                          <span className="rounded-full border border-white/10 bg-black/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-500">
                            {item.parentAnchor}
                          </span>
                        </div>

                        <p className="mt-5 line-clamp-4 text-sm leading-7 text-slate-400">
                          {item.definition}
                        </p>

                        <div className="mt-auto pt-7">
                          <div className="border-t border-white/10 pt-5">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-600">
                              Governing question
                            </p>
                            <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-300">
                              {item.governingQuestion}
                            </p>
                          </div>

                          <div className="mt-5 flex items-center justify-between">
                            <span className="text-xs font-semibold text-sky-300">
                              Enter canonical link
                            </span>
                            <span className="text-sky-300 transition group-hover:translate-x-1">
                              →
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </section>
  );
}

function PressureDeck() {
  return (
    <section className="relative border-y border-white/10 bg-[#040a17]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_18%,rgba(244,63,94,0.06),transparent_28%),radial-gradient(circle_at_82%_78%,rgba(56,189,248,0.07),transparent_30%)]" />

      <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-rose-300">
              Applied Academy
            </p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight">
              Don&apos;t just read the chain.
              <span className="block text-slate-500">
                Put it under pressure.
              </span>
            </h2>
            <p className="mt-5 max-w-xl leading-7 text-slate-400">
              The architecture becomes useful when a learner can locate a live
              route, detect degradation before consequence attaches, and
              explain why continuation, narrowing, holding, refusal, or
              escalation is the correct governed response.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-3">
              {learnerQuestions.map((question, index) => (
                <div
                  key={question}
                  className="rounded-2xl border border-white/10 bg-black/10 p-4"
                >
                  <span className="text-[10px] font-semibold text-sky-300">
                    Q{String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="mt-2 text-xs leading-5 text-slate-400">
                    {question}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {primaryExperiences.map((experience) => (
              <Link
                key={experience.href}
                href={experience.href}
                className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03] p-6 transition duration-300 hover:-translate-y-1 hover:border-rose-300/20 hover:bg-white/[0.05]"
              >
                <div className="flex items-start justify-between gap-5">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-rose-200">
                    {experience.eyebrow}
                  </span>
                  <span className="text-4xl font-semibold text-white/[0.06]">
                    {experience.index}
                  </span>
                </div>

                <h3 className="mt-8 text-2xl font-semibold">
                  {experience.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-slate-400">
                  {experience.body}
                </p>

                <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-5">
                  <span className="text-xs font-semibold text-rose-200">
                    {experience.action}
                  </span>
                  <span className="text-rose-200 transition group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {secondaryExperiences.map((experience) => (
            <Link
              key={experience.href}
              href={experience.href}
              className="group flex items-start gap-4 rounded-2xl border border-white/10 bg-black/10 p-5 transition hover:border-sky-300/20 hover:bg-white/[0.035]"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-sky-300/15 bg-sky-300/[0.05] text-[10px] font-semibold text-sky-200">
                {experience.code}
              </span>
              <div>
                <h3 className="text-sm font-semibold text-white">
                  {experience.label}
                </h3>
                <p className="mt-2 text-xs leading-5 text-slate-500">
                  {experience.text}
                </p>
              </div>
              <span className="ml-auto text-slate-700 transition group-hover:translate-x-1 group-hover:text-sky-300">
                →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProvenanceGateway() {
  return (
    <section className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8">
      <div className="relative overflow-hidden rounded-[38px] border border-indigo-300/15 bg-[#070b15] p-8 shadow-[0_40px_120px_rgba(0,0,0,0.30)] sm:p-10 lg:p-12">
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full border border-indigo-300/[0.08]" />
        <div className="absolute -left-28 bottom-0 h-72 w-72 rounded-full border border-amber-300/[0.06]" />

        <div className="relative grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-indigo-300">
              Provenance layer
            </p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight">
              Architecture should be traceable.
            </h2>
            <p className="mt-5 max-w-xl leading-7 text-slate-400">
              The Explorer does not ask learners to accept the 24 links as an
              unsupported diagram. The provenance system connects the
              architecture to chronology, publications, patent position,
              implementation artifacts, and bounded review records.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/academy/24-link-architecture/provenance"
                className="rounded-xl border border-indigo-300/20 bg-indigo-300/[0.06] px-4 py-3 text-sm font-semibold text-indigo-100 transition hover:bg-indigo-300/[0.10]"
              >
                Open Provenance Map
              </Link>
              <Link
                href="/academy/24-link-architecture/provenance/patents"
                className="rounded-xl border border-amber-300/20 bg-amber-300/[0.06] px-4 py-3 text-sm font-semibold text-amber-100 transition hover:bg-amber-300/[0.10]"
              >
                Patent Portfolio
              </Link>
              <Link
                href="/academy/24-link-architecture/provenance/patents/families"
                className="rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/[0.06]"
              >
                Eight Patent Families
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <EvidencePanel
              code="CH"
              title="Chronology"
              body="Public dates and source records show when architecture entered the public record."
            />
            <EvidencePanel
              code="PP"
              title="Patent Position"
              body="Applications are mapped through bounded relationships without pretending architecture mapping is legal claim construction."
            />
            <EvidencePanel
              code="AR"
              title="Artifacts"
              body="Implementations and demonstrations show what has actually been built, recorded, or evidenced."
            />
            <EvidencePanel
              code="RV"
              title="Reviews"
              body="Review records preserve scope, evidence basis, findings, challenges, and correction boundaries."
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function CanonicalMatrix() {
  return (
    <section className="border-y border-white/10 bg-[#030916]">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300">
              Direct access
            </p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight">
              Enter anywhere. Keep the whole chain visible.
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-slate-400">
            Each canonical lesson exposes the link&apos;s definition, governing
            question, evidence expectations, failure modes, transition logic,
            mastery task, and provenance pathway.
          </p>
        </div>

        <div className="mt-12 grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {TA14_24_LINKS.map((item) => (
            <Link
              key={item.linkId}
              href={`/academy/24-link-architecture/${String(
                item.order,
              ).padStart(2, "0")}-${item.slug}`}
              className="group relative min-h-[150px] overflow-hidden rounded-2xl border border-white/10 bg-black/10 p-4 transition hover:border-emerald-300/30 hover:bg-emerald-300/[0.035]"
            >
              <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full border border-white/[0.04] transition group-hover:border-emerald-300/[0.08]" />
              <div className="relative flex h-full flex-col">
                <div className="flex items-start justify-between gap-3">
                  <span className="text-xs font-semibold text-sky-300">
                    {String(item.order).padStart(2, "0")}
                  </span>
                  <span className="text-xs text-slate-700 transition group-hover:text-emerald-300">
                    ↗
                  </span>
                </div>
                <p className="mt-4 text-sm font-semibold leading-5 text-slate-100">
                  {item.canonicalName}
                </p>
                <div className="mt-auto pt-5">
                  <div className="h-px w-8 bg-white/10 transition-all duration-300 group-hover:w-full group-hover:bg-emerald-300/25" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function OriginSection() {
  return (
    <section className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="relative overflow-hidden rounded-[34px] border border-amber-300/20 bg-amber-300/[0.04] p-8 sm:p-10">
          <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full border border-amber-300/[0.08]" />

          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-200">
            Provenance preserved
          </p>
          <h2 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight">
            The foundational Chain of Eight was already created and publicly
            published May 1, 2025.
          </h2>

          <div className="mt-8 flex flex-wrap items-center gap-2">
            {TA14_CHAIN_OF_EIGHT.map((name, index) => (
              <div key={`${name}-${index}`} className="flex items-center gap-2">
                <span className="rounded-full border border-amber-200/15 bg-black/15 px-3 py-2 text-xs font-semibold text-amber-50">
                  {name}
                </span>
                {index < TA14_CHAIN_OF_EIGHT.length - 1 ? (
                  <span className="text-xs text-amber-300/50">→</span>
                ) : null}
              </div>
            ))}
          </div>

          <p className="mt-7 max-w-3xl text-sm leading-7 text-slate-300">
            The 24-link architecture is the subsequent deeper-resolution
            expansion and maturation of that already-existing parent route.
            The expansion increases architectural resolution; it does not move
            the public origin date of the foundational eight anchors.
          </p>
        </div>

        <div className="rounded-[34px] border border-white/10 bg-white/[0.025] p-8 sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-300">
            Read the expansion correctly
          </p>
          <div className="mt-7 space-y-6">
            <OriginPoint
              number="01"
              title="Parent route remains intact"
              body="Reality, Record, Continuity, Admissibility, Binding, Commit, Execution, and Outcome remain the foundational route."
            />
            <OriginPoint
              number="02"
              title="Resolution increased"
              body="Later work decomposed evidence, authority, consequence, runtime, non-occurrence, outcome, memory, and recursion into explicit governed states."
            />
            <OriginPoint
              number="03"
              title="Chronology stays visible"
              body="The Academy distinguishes origin, expansion, patent position, implementation evidence, and bounded review findings."
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function ClosingSection() {
  return (
    <section className="relative overflow-hidden border-t border-white/10 bg-[#030916]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_110%,rgba(56,189,248,0.14),transparent_36%)]" />

      <div className="relative mx-auto max-w-7xl px-6 py-24 text-center lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-300">
          Academy objective
        </p>
        <h2 className="mx-auto mt-4 max-w-4xl text-4xl font-semibold tracking-tight sm:text-5xl">
          Learn where execution becomes supportable —
          <span className="block text-slate-500">
            and where the route must stop.
          </span>
        </h2>
        <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-slate-400">
          TA-14 Academy is designed to move a learner from recognition to
          governed judgment: what is true, what is supported, what is allowed,
          what is forming, what should execute, what should not occur, and what
          the resulting reality requires next.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link
            href="/academy/24-link-architecture/route-state"
            className="rounded-2xl bg-white px-5 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-sky-100"
          >
            Start with Route State
          </Link>
          <Link
            href="/academy/24-link-architecture/simulator"
            className="rounded-2xl border border-rose-300/20 bg-rose-300/[0.05] px-5 py-3.5 text-sm font-semibold text-rose-100 transition hover:bg-rose-300/[0.09]"
          >
            Pressure the Chain
          </Link>
          <Link
            href="/academy/24-link-architecture/provenance"
            className="rounded-2xl border border-indigo-300/20 bg-indigo-300/[0.05] px-5 py-3.5 text-sm font-semibold text-indigo-100 transition hover:bg-indigo-300/[0.09]"
          >
            Trace the Record
          </Link>
        </div>

        <p className="mx-auto mt-12 max-w-3xl text-xs leading-6 text-slate-600">
          Academy learning, architecture mapping, simulation, provenance
          display, patent-position mapping, and evidence-state views do not by
          themselves constitute certification, legal determination, production
          validation, endorsement, or authorization to execute.
        </p>
      </div>
    </section>
  );
}

function Signal({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-[#030916] px-5 py-5">
      <div className="text-2xl font-semibold tracking-tight text-white">
        {value}
      </div>
      <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-600">
        {label}
      </div>
    </div>
  );
}

function OrbitNode({
  className,
  number,
  label,
}: {
  className: string;
  number: string;
  label: string;
}) {
  return (
    <div className={`absolute ${className}`}>
      <div className="rounded-2xl border border-white/10 bg-[#07101f]/90 px-4 py-3 shadow-xl backdrop-blur">
        <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-sky-300">
          {number}
        </p>
        <p className="mt-1 text-xs font-semibold text-slate-200">{label}</p>
      </div>
    </div>
  );
}

function EvidencePanel({
  code,
  title,
  body,
}: {
  code: string;
  title: string;
  body: string;
}) {
  return (
    <article className="rounded-3xl border border-white/10 bg-black/15 p-5">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-300/15 bg-indigo-300/[0.05] text-[10px] font-semibold text-indigo-200">
        {code}
      </div>
      <h3 className="mt-5 text-lg font-semibold">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-400">{body}</p>
    </article>
  );
}

function OriginPoint({
  number,
  title,
  body,
}: {
  number: string;
  title: string;
  body: string;
}) {
  return (
    <div className="grid grid-cols-[42px_1fr] gap-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-sky-300/15 bg-sky-300/[0.05] text-[10px] font-semibold text-sky-200">
        {number}
      </div>
      <div>
        <h3 className="text-sm font-semibold text-white">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-400">{body}</p>
      </div>
    </div>
  );
}
