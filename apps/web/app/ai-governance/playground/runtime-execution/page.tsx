import Link from "next/link";

import GovernancePlaygroundsNav from "../../../../components/governance-playgrounds-nav";

import {
  RUNTIME_EXECUTION_LANE,
  RUNTIME_EXECUTION_SCENARIOS,
  SHARED_GATE_DEFINITIONS,
} from "../../../../lib/governance-playgrounds";

const outcomeStyles = {
  ALLOW:
    "border-emerald-400/40 bg-emerald-400/10 text-emerald-200",
  HOLD:
    "border-amber-400/40 bg-amber-400/10 text-amber-200",
  DENY:
    "border-rose-400/40 bg-rose-400/10 text-rose-200",
  ESCALATE:
    "border-sky-400/40 bg-sky-400/10 text-sky-200",
} as const;

export default function RuntimeExecutionPlaygroundPage() {
  const requiredScenarioCount = RUNTIME_EXECUTION_SCENARIOS.filter(
    (scenario) => scenario.required,
  ).length;

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto grid w-full max-w-[92rem] gap-6 px-5 py-6 lg:grid-cols-[310px_minmax(0,1fr)] lg:px-8">
        <GovernancePlaygroundsNav
          activeLaneId="runtime-execution"
          className="h-fit lg:sticky lg:top-6"
        />

        <div className="flex min-w-0 flex-col gap-10">
          <header className="rounded-3xl border border-white/10 bg-white/[0.04] p-7 shadow-2xl shadow-cyan-950/20 backdrop-blur md:p-10">
          <div className="mb-5 flex flex-wrap items-center gap-3 text-sm">
            <Link
              href="/ai-governance/playground"
              className="rounded-full border border-white/15 px-4 py-2 text-slate-200 transition hover:border-cyan-300/60 hover:text-cyan-100"
            >
              AI Governance Playground
            </Link>
            <span className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 font-semibold text-cyan-100">
              Reference lane
            </span>
            <span className="rounded-full border border-white/10 px-4 py-2 text-slate-300">
              Version {RUNTIME_EXECUTION_LANE.version}
            </span>
          </div>

          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
            TA-14 Governance-Specific Playgrounds
          </p>

          <h1 className="max-w-5xl text-4xl font-black tracking-tight text-white md:text-6xl">
            Runtime &amp; Execution Governance Playground
          </h1>

          <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-300">
            {RUNTIME_EXECUTION_LANE.description}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/ai-governance/playground/runtime-execution/new"
              className="rounded-xl bg-cyan-300 px-6 py-3 font-bold text-slate-950 transition hover:bg-cyan-200"
            >
              Build a Runtime Route
            </Link>
            <Link
              href="/ai-governance/playground/runtime-execution/scenarios"
              className="rounded-xl border border-cyan-300/30 bg-cyan-300/[0.06] px-6 py-3 font-semibold text-cyan-100 transition hover:border-cyan-300/60 hover:bg-cyan-300/10"
            >
              Run Governance Scenarios
            </Link>
            <a
              href="#how-it-works"
              className="rounded-xl border border-white/15 px-6 py-3 font-semibold text-white transition hover:border-white/35 hover:bg-white/5"
            >
              See How Testing Works
            </a>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-4">
          <StatCard
            label="Shared gates"
            value={String(RUNTIME_EXECUTION_LANE.gateIds.length)}
            detail="One common TA-14 evaluation spine"
          />
          <StatCard
            label="Required scenarios"
            value={String(requiredScenarioCount)}
            detail="Baseline, failure, adversarial, drift, and recovery"
          />
          <StatCard
            label="Intake sections"
            value={String(RUNTIME_EXECUTION_LANE.sections.length)}
            detail="From identity through replay"
          />
          <StatCard
            label="Bounded outcomes"
            value="4"
            detail="ALLOW · HOLD · DENY · ESCALATE"
          />
        </section>

        <section
          id="how-it-works"
          className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]"
        >
          <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-7 md:p-9">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
              What this lane tests
            </p>
            <h2 className="mt-3 text-3xl font-bold">
              Governance that must remain valid during execution
            </h2>

            <div className="mt-7 grid gap-4">
              {RUNTIME_EXECUTION_LANE.claimsGoverned.map((claim) => (
                <div
                  key={claim}
                  className="rounded-2xl border border-white/10 bg-slate-900/70 p-4"
                >
                  <div className="flex gap-3">
                    <span className="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-300/15 text-sm font-bold text-cyan-200">
                      ✓
                    </span>
                    <p className="leading-7 text-slate-200">{claim}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-7 md:p-9">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-300">
              Explicit boundaries
            </p>
            <h2 className="mt-3 text-3xl font-bold">
              What this result does not prove
            </h2>

            <div className="mt-7 space-y-4">
              {RUNTIME_EXECUTION_LANE.nonClaims.map((nonClaim) => (
                <div
                  key={nonClaim}
                  className="rounded-2xl border border-amber-300/15 bg-amber-300/[0.04] p-4"
                >
                  <p className="leading-7 text-slate-300">{nonClaim}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-7 md:p-9">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
                Shared evaluation spine
              </p>
              <h2 className="mt-3 text-3xl font-bold">
                Fourteen gates from identity through replay
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-slate-400">
              Every applicable mandatory gate must pass. Missing evidence,
              expired authority, unapproved dependencies, failed intervention,
              or material drift prevents an ALLOW result.
            </p>
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {SHARED_GATE_DEFINITIONS.map((gate) => (
              <article
                key={gate.gateId}
                className="rounded-2xl border border-white/10 bg-slate-900/70 p-5"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs font-bold tracking-[0.18em] text-cyan-300">
                    GATE {String(gate.order).padStart(2, "0")}
                  </span>
                  <span className="rounded-full border border-white/10 px-2.5 py-1 text-[11px] font-semibold text-slate-400">
                    {gate.requirementLevel}
                  </span>
                </div>
                <h3 className="mt-3 text-lg font-bold">{gate.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {gate.purpose}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-7 md:p-9">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
            Required test corpus
          </p>
          <h2 className="mt-3 text-3xl font-bold">
            The route must survive more than its ideal demonstration
          </h2>
          <p className="mt-4 max-w-4xl leading-7 text-slate-400">
            The Runtime Playground applies baseline, failure, adversarial,
            drift, mismatch, and recovery scenarios. Each scenario declares
            the expected gate behavior and bounded determination before the
            test runs.
          </p>

          <div className="mt-7 grid gap-4 lg:grid-cols-2">
            {RUNTIME_EXECUTION_SCENARIOS.map((scenario) => (
              <article
                key={scenario.scenarioId}
                className="rounded-2xl border border-white/10 bg-slate-900/70 p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                    {scenario.scenarioClass.replaceAll("_", " ")}
                  </span>
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-bold ${
                      outcomeStyles[scenario.expectedDetermination]
                    }`}
                  >
                    Expected {scenario.expectedDetermination}
                  </span>
                </div>

                <h3 className="mt-4 text-xl font-bold">{scenario.title}</h3>
                <p className="mt-2 leading-7 text-slate-400">
                  {scenario.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-300">
                  <span className="rounded-full border border-white/10 px-3 py-1.5">
                    {Object.keys(scenario.expectedGateStatuses).length} expected
                    gate results
                  </span>
                  <span className="rounded-full border border-white/10 px-3 py-1.5">
                    {scenario.injections.length} failure injection
                    {scenario.injections.length === 1 ? "" : "s"}
                  </span>
                  {scenario.required ? (
                    <span className="rounded-full border border-cyan-300/20 bg-cyan-300/[0.06] px-3 py-1.5 text-cyan-200">
                      Required
                    </span>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-cyan-300/20 bg-gradient-to-br from-cyan-300/10 via-slate-950 to-blue-500/10 p-8 md:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
                No admissible evidence. No admissible execution.
              </p>
              <h2 className="mt-3 max-w-3xl text-3xl font-black md:text-4xl">
                Build the route, apply the scenarios, preserve the result.
              </h2>
              <p className="mt-4 max-w-3xl leading-7 text-slate-300">
                An ALLOW result is bounded to the exact evidence, authority,
                dependencies, environment, time, evaluator version, and route
                tested. Material change requires replay.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Link
                href="/ai-governance/playground/runtime-execution/new"
                className="inline-flex min-w-56 justify-center rounded-xl bg-white px-6 py-3 font-bold text-slate-950 transition hover:bg-cyan-100"
              >
                Start Runtime Route
              </Link>
              <Link
                href="/ai-governance/playground/runtime-execution/scenarios"
                className="inline-flex min-w-56 justify-center rounded-xl border border-white/20 px-6 py-3 font-bold text-white transition hover:border-cyan-300/50 hover:bg-cyan-300/[0.06]"
              >
                Open Scenario Runner
              </Link>
            </div>
          </div>
        </section>
        </div>
      </div>
    </main>
  );
}

function StatCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <article className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
      <p className="text-sm font-semibold text-slate-400">{label}</p>
      <p className="mt-2 text-4xl font-black text-white">{value}</p>
      <p className="mt-2 text-sm leading-6 text-slate-500">{detail}</p>
    </article>
  );
}
