import Link from "next/link";

import {
  GOVERNANCE_PLAYGROUND_LANES,
  type GovernancePlaygroundLane,
} from "../../../lib/governance-playgrounds/lanes";

export const metadata = {
  title: "AI Governance Architecture Library | TA-14 Exchange",
  description:
    "Explore the TA-14 AI Governance Architecture Library and enter a bounded playground for each governance architecture.",
};

const laneDescriptions: Record<string, string> = {
  general:
    "Build and test a complete governance route when the work crosses multiple governance domains.",
  decision:
    "Govern consequential decisions through identity, evidence, authority, controls, commitment, execution, and outcome.",
  risk:
    "Test risk claims, thresholds, treatments, residual risk, acceptance authority, drift, and continuing validity.",
  "runtime-execution":
    "Govern the execution boundary where an approved route becomes a real consequence-bearing action.",
  "model-evaluation":
    "Test model identity, evaluation evidence, thresholds, limitations, change, deployment conditions, and outcome correspondence.",
  "data-provenance":
    "Trace data identity, source, custody, transformation, authority, quality, admissibility, and downstream reliance.",
  "agent-tools":
    "Govern agents, tools, permissions, delegated authority, calls, side effects, intervention, and execution receipts.",
  "human-oversight":
    "Test whether meaningful human review, intervention, stop authority, escalation, and accountability remain available.",
  "policy-controls":
    "Bind policy claims to enforceable rules, controls, evidence, exceptions, testing, and execution behavior.",
  "compliance-regulatory":
    "Translate legal and regulatory duties into inspectable applicability, evidence, control, review, and execution routes.",
  "security-third-party":
    "Govern security dependencies, suppliers, external services, inherited controls, incidents, and third-party execution risk.",
  "outcome-assurance":
    "Verify whether approved execution produced the claimed outcome and whether preserved evidence supports continuing reliance.",
};

const laneOrder = [
  "general",
  "decision",
  "risk",
  "runtime-execution",
  "model-evaluation",
  "data-provenance",
  "agent-tools",
  "human-oversight",
  "policy-controls",
  "compliance-regulatory",
  "security-third-party",
  "outcome-assurance",
];

function sortLanes(
  lanes: readonly GovernancePlaygroundLane[],
): GovernancePlaygroundLane[] {
  return [...lanes].sort((a, b) => {
    const aIndex = laneOrder.indexOf(a.laneId);
    const bIndex = laneOrder.indexOf(b.laneId);

    if (aIndex === -1 && bIndex === -1) {
      return a.name.localeCompare(b.name);
    }

    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;

    return aIndex - bIndex;
  });
}

function getLaneHref(laneId: string): string {
  return `/ai-governance/playground?lane=${encodeURIComponent(laneId)}`;
}

export default function GovernanceLibraryPage() {
  const lanes = sortLanes(GOVERNANCE_PLAYGROUND_LANES);

  return (
    <main className="min-h-screen bg-[#05070b] text-white">
      <section className="border-b border-white/10 px-6 py-20 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.34em] text-cyan-300">
            TA-14 AI Governance Exchange
          </p>

          <h1 className="max-w-5xl text-4xl font-black uppercase leading-[0.95] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
            AI Governance
            <span className="block text-cyan-300">
              Architecture Library
            </span>
          </h1>

          <p className="mt-8 max-w-4xl text-lg leading-8 text-white/70">
            Choose the exact architecture you need to test. Each library
            entrance opens a bounded governance playground with its own
            claims, evidence requirements, gates, failure injections,
            determinations, recovery conditions, and replay requirements.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/ai-governance"
              className="rounded-full border border-cyan-300/50 bg-cyan-300 px-6 py-3 text-sm font-black uppercase tracking-[0.18em] text-black transition hover:bg-white"
            >
              AI Governance Home
            </Link>

            <Link
              href="/workspace"
              className="rounded-full border border-white/20 px-6 py-3 text-sm font-black uppercase tracking-[0.18em] text-white transition hover:border-cyan-300 hover:text-cyan-300"
            >
              Open Workspace
            </Link>
          </div>
        </div>
      </section>

      <section className="px-6 py-16 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col justify-between gap-5 border-b border-white/10 pb-8 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/45">
                Registered architectures
              </p>
              <h2 className="mt-3 text-3xl font-black uppercase tracking-[-0.03em] sm:text-4xl">
                {lanes.length} playground lanes available
              </h2>
            </div>

            <p className="max-w-xl text-sm leading-6 text-white/55">
              The library is generated from the live lane registry. A lane
              becomes visible here when its complete definition is registered.
            </p>
          </div>

          {lanes.length === 0 ? (
            <div className="rounded-3xl border border-amber-300/30 bg-amber-300/5 p-8">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-amber-200">
                No registered governance lanes were found
              </p>
              <p className="mt-4 max-w-3xl leading-7 text-white/65">
                Confirm that the lane registry exports
                GOVERNANCE_PLAYGROUND_LANES and that complete lane files are
                registered in apps/web/lib/governance-playgrounds/lanes.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {lanes.map((lane, index) => (
                <article
                  key={lane.laneId}
                  className="group flex min-h-[370px] flex-col rounded-3xl border border-white/10 bg-white/[0.035] p-7 transition duration-300 hover:-translate-y-1 hover:border-cyan-300/60 hover:bg-cyan-300/[0.055]"
                >
                  <div className="flex items-start justify-between gap-5">
                    <span className="text-xs font-black uppercase tracking-[0.25em] text-cyan-300">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white/50">
                      {lane.laneId}
                    </span>
                  </div>

                  <h3 className="mt-8 text-2xl font-black uppercase leading-tight tracking-[-0.025em]">
                    {lane.name}
                  </h3>

                  <p className="mt-5 flex-1 text-sm leading-7 text-white/62">
                    {laneDescriptions[lane.laneId] ?? lane.description}
                  </p>

                  <div className="mt-8 grid grid-cols-3 gap-3 border-y border-white/10 py-5 text-center">
                    <div>
                      <div className="text-xl font-black text-white">
                        {lane.gateIds.length}
                      </div>
                      <div className="mt-1 text-[9px] font-bold uppercase tracking-[0.18em] text-white/40">
                        Gates
                      </div>
                    </div>

                    <div>
                      <div className="text-xl font-black text-white">
                        {lane.evidenceTypes.length}
                      </div>
                      <div className="mt-1 text-[9px] font-bold uppercase tracking-[0.18em] text-white/40">
                        Evidence
                      </div>
                    </div>

                    <div>
                      <div className="text-xl font-black text-white">
                        {lane.scenarioIds.length}
                      </div>
                      <div className="mt-1 text-[9px] font-bold uppercase tracking-[0.18em] text-white/40">
                        Tests
                      </div>
                    </div>
                  </div>

                  <Link
                    href={getLaneHref(lane.laneId)}
                    className="mt-6 inline-flex items-center justify-between rounded-2xl border border-white/15 px-5 py-4 text-xs font-black uppercase tracking-[0.2em] transition group-hover:border-cyan-300 group-hover:bg-cyan-300 group-hover:text-black"
                  >
                    Enter playground
                    <span aria-hidden="true">→</span>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="border-t border-white/10 px-6 py-16 sm:px-10 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-cyan-300/25 bg-cyan-300/[0.045] p-8 sm:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">
              Governing principle
            </p>
            <h2 className="mt-5 text-3xl font-black uppercase leading-tight tracking-[-0.03em]">
              No admissible evidence.
              <span className="block">No admissible execution.</span>
            </h2>
            <p className="mt-6 max-w-3xl leading-7 text-white/65">
              Every architecture remains distinct, but each route must preserve
              the same governing chain: Reality, Record, Continuity,
              Admissibility, Binding, Commit, Execution, and Outcome.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 sm:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/45">
              Missing a lane?
            </p>
            <h2 className="mt-5 text-2xl font-black uppercase tracking-[-0.025em]">
              Registration controls visibility
            </h2>
            <p className="mt-5 leading-7 text-white/60">
              Complete the lane file, export it from the lane registry, and add
              it to GOVERNANCE_PLAYGROUND_LANES. The architecture will then
              appear in this library automatically.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
