"use client";

import { useMemo, useState } from "react";

type Decision = "ALLOW" | "HOLD" | "DENY" | "ESCALATE";

type Scenario = {
  id: string;
  title: string;
  description: string;
  consequence: string;
  evidence: boolean;
  authority: boolean;
  continuity: boolean;
  boundary: boolean;
  dependencies: boolean;
};

const scenarios: Scenario[] = [
  {
    id: "vendor-payment",
    title: "Vendor payment above $25,000",
    description:
      "Evaluate whether a high-value vendor payment may proceed when beneficiary proof and dual authority are required.",
    consequence: "Funds leave the governed organization.",
    evidence: false,
    authority: false,
    continuity: true,
    boundary: true,
    dependencies: true,
  },
  {
    id: "autonomous-building",
    title: "Autonomous building control change",
    description:
      "Evaluate a consequential setpoint change requested by an AI agent operating across a building-control stack.",
    consequence: "A physical environment changes without direct human intervention.",
    evidence: true,
    authority: true,
    continuity: false,
    boundary: true,
    dependencies: false,
  },
  {
    id: "regulated-record",
    title: "Regulated record release",
    description:
      "Evaluate whether a governed record may be released after evidence, scope, and authority are revalidated.",
    consequence: "A regulated record becomes externally binding.",
    evidence: true,
    authority: true,
    continuity: true,
    boundary: true,
    dependencies: true,
  },
];

function evaluate(scenario: Scenario): {
  decision: Decision;
  reason: string;
  failed: string[];
} {
  const failed: string[] = [];

  if (!scenario.evidence) failed.push("Admissible evidence is incomplete.");
  if (!scenario.authority) failed.push("Required authority is not established.");
  if (!scenario.continuity) failed.push("Continuity has not been preserved.");
  if (!scenario.boundary) failed.push("The action exceeds its approved boundary.");
  if (!scenario.dependencies) failed.push("A required dependency has changed or failed.");

  if (!scenario.boundary) {
    return {
      decision: "DENY",
      reason: "The execution exceeds the approved boundary.",
      failed,
    };
  }

  if (!scenario.authority) {
    return {
      decision: "ESCALATE",
      reason: "The execution requires an authorized human or institutional decision.",
      failed,
    };
  }

  if (failed.length > 0) {
    return {
      decision: "HOLD",
      reason: "The execution is not yet admissible and must not bind to reality.",
      failed,
    };
  }

  return {
    decision: "ALLOW",
    reason: "All required admissibility conditions are currently satisfied.",
    failed,
  };
}

const decisionClasses: Record<Decision, string> = {
  ALLOW: "border-emerald-400/50 bg-emerald-400/10 text-emerald-200",
  HOLD: "border-amber-400/50 bg-amber-400/10 text-amber-100",
  DENY: "border-rose-400/50 bg-rose-400/10 text-rose-100",
  ESCALATE: "border-violet-400/50 bg-violet-400/10 text-violet-100",
};

function Check({
  label,
  checked,
  onChange,
  explanation,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  explanation: string;
}) {
  return (
    <label className="flex cursor-pointer gap-4 rounded-2xl border border-white/10 bg-white/[0.035] p-4 transition hover:border-cyan-300/30 hover:bg-white/[0.055]">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-1 h-5 w-5 accent-cyan-400"
      />
      <span>
        <span className="block font-semibold text-white">{label}</span>
        <span className="mt-1 block text-sm leading-6 text-slate-400">
          {explanation}
        </span>
      </span>
    </label>
  );
}

export default function SimulatorPage() {
  const [selectedId, setSelectedId] = useState(scenarios[0].id);
  const selectedTemplate =
    scenarios.find((scenario) => scenario.id === selectedId) ?? scenarios[0];

  const [scenario, setScenario] = useState<Scenario>(selectedTemplate);
  const [history, setHistory] = useState<
    Array<{
      id: number;
      title: string;
      decision: Decision;
      reason: string;
      timestamp: string;
    }>
  >([]);

  const result = useMemo(() => evaluate(scenario), [scenario]);

  function selectScenario(id: string) {
    const next = scenarios.find((item) => item.id === id) ?? scenarios[0];
    setSelectedId(id);
    setScenario({ ...next });
  }

  function update<K extends keyof Scenario>(key: K, value: Scenario[K]) {
    setScenario((current) => ({ ...current, [key]: value }));
  }

  function preserveRun() {
    setHistory((current) => [
      {
        id: Date.now(),
        title: scenario.title,
        decision: result.decision,
        reason: result.reason,
        timestamp: new Date().toLocaleString(),
      },
      ...current,
    ]);
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030812] text-slate-100">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[8%] top-20 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute right-[5%] top-36 h-96 w-96 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgba(255,255,255,.5) 0 1px, transparent 1px), radial-gradient(circle at 80% 30%, rgba(255,255,255,.35) 0 1px, transparent 1px), radial-gradient(circle at 60% 80%, rgba(255,255,255,.3) 0 1px, transparent 1px)",
            backgroundSize: "160px 160px, 220px 220px, 280px 280px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
        <header className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-300">
            TA-14 Academy · Governed Simulation
          </p>
          <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="max-w-4xl text-4xl font-black tracking-tight text-white sm:text-5xl">
                Execution Simulator
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
                Test whether a consequential action has earned the right to proceed
                before consequence binds to reality.
              </p>
            </div>

            <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/[0.06] px-5 py-4 text-sm text-cyan-100">
              <span className="font-semibold">Governing rule:</span>{" "}
              No admissible evidence. No admissible execution.
            </div>
          </div>
        </header>

        <section className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
          <div className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 shadow-2xl shadow-black/20 backdrop-blur">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                    Step 1
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-white">
                    Select a governed scenario
                  </h2>
                </div>
                <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-400">
                  Training only
                </span>
              </div>

              <div className="mt-5 grid gap-3">
                {scenarios.map((item) => {
                  const active = item.id === selectedId;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => selectScenario(item.id)}
                      className={`rounded-2xl border p-4 text-left transition ${
                        active
                          ? "border-cyan-300/50 bg-cyan-300/10"
                          : "border-white/10 bg-white/[0.025] hover:border-white/20 hover:bg-white/[0.045]"
                      }`}
                    >
                      <span className="block font-semibold text-white">
                        {item.title}
                      </span>
                      <span className="mt-1 block text-sm leading-6 text-slate-400">
                        {item.description}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 shadow-2xl shadow-black/20 backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                Step 2
              </p>
              <h2 className="mt-2 text-2xl font-bold text-white">
                Revalidate execution conditions
              </h2>

              <div className="mt-5 space-y-3">
                <Check
                  label="Evidence is current and admissible"
                  checked={scenario.evidence}
                  onChange={(value) => update("evidence", value)}
                  explanation="The record is attributable, current, relevant, and sufficient for this exact action."
                />
                <Check
                  label="Authority is valid for this action"
                  checked={scenario.authority}
                  onChange={(value) => update("authority", value)}
                  explanation="The actor, role, scope, and approval remain valid at the moment of execution."
                />
                <Check
                  label="Continuity has been preserved"
                  checked={scenario.continuity}
                  onChange={(value) => update("continuity", value)}
                  explanation="The chain from reality to record to determination remains intact and challengeable."
                />
                <Check
                  label="Execution remains inside the approved boundary"
                  checked={scenario.boundary}
                  onChange={(value) => update("boundary", value)}
                  explanation="The proposed action has not expanded beyond its original purpose, scope, or consequence."
                />
                <Check
                  label="Dependencies remain valid"
                  checked={scenario.dependencies}
                  onChange={(value) => update("dependencies", value)}
                  explanation="Required systems, policies, records, and environmental conditions have not materially changed."
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-black/25 backdrop-blur">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                    Determination
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-white">
                    Runtime admissibility result
                  </h2>
                </div>
                <div
                  className={`rounded-2xl border px-5 py-3 text-lg font-black tracking-[0.16em] ${decisionClasses[result.decision]}`}
                >
                  {result.decision}
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.035] p-5">
                <p className="font-semibold text-white">{result.reason}</p>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Consequence: {scenario.consequence}
                </p>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  ["Reality", "The present condition being governed."],
                  ["Record", "The preserved evidence describing reality."],
                  ["Continuity", "The unbroken relationship between evidence and action."],
                  ["Admissibility", "The determination that the action may proceed."],
                  ["Binding", "The point where the decision becomes consequential."],
                  ["Commit", "The preserved authorization to act."],
                  ["Execution", "The controlled action itself."],
                  ["Outcome", "The preserved result and post-action evidence."],
                ].map(([title, body], index) => (
                  <div
                    key={title}
                    className="rounded-2xl border border-white/10 bg-white/[0.025] p-4"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full border border-cyan-300/30 bg-cyan-300/10 text-xs font-bold text-cyan-200">
                        {index + 1}
                      </span>
                      <span className="font-semibold text-white">{title}</span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-400">{body}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Failed conditions
                </h3>
                {result.failed.length === 0 ? (
                  <p className="mt-3 rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.07] p-4 text-sm text-emerald-100">
                    No failed conditions were detected.
                  </p>
                ) : (
                  <ul className="mt-3 space-y-2">
                    {result.failed.map((item) => (
                      <li
                        key={item}
                        className="rounded-2xl border border-amber-400/20 bg-amber-400/[0.07] p-4 text-sm text-amber-100"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <button
                type="button"
                onClick={preserveRun}
                className="mt-6 w-full rounded-2xl bg-cyan-300 px-5 py-4 font-bold text-slate-950 transition hover:bg-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-slate-950"
              >
                Preserve simulation run
              </button>

              <p className="mt-3 text-center text-xs leading-5 text-slate-500">
                This simulator creates a training record only. It does not grant
                authority or execute a real-world action.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 shadow-2xl shadow-black/20 backdrop-blur">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                    Preserved history
                  </p>
                  <h2 className="mt-2 text-xl font-bold text-white">
                    Simulation record
                  </h2>
                </div>
                <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-400">
                  {history.length} run{history.length === 1 ? "" : "s"}
                </span>
              </div>

              {history.length === 0 ? (
                <div className="mt-5 rounded-2xl border border-dashed border-white/15 p-6 text-center text-sm text-slate-500">
                  Preserve a run to create the first simulation record.
                </div>
              ) : (
                <div className="mt-5 space-y-3">
                  {history.map((item) => (
                    <article
                      key={item.id}
                      className="rounded-2xl border border-white/10 bg-white/[0.025] p-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <h3 className="font-semibold text-white">{item.title}</h3>
                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-bold ${decisionClasses[item.decision]}`}
                        >
                          {item.decision}
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-slate-400">
                        {item.reason}
                      </p>
                      <p className="mt-2 text-xs text-slate-600">{item.timestamp}</p>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
