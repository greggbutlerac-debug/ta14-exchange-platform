"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import {
  TA14_24_LINKS,
  type TA14LinkId,
  type TA14RouteDecision,
} from "@/lib/academy/ta14-24-link-canon";

type Scenario = {
  id: string;
  title: string;
  pressure: string;
  prompt: string;
  firstBrokenLink: TA14LinkId;
  lastAdmissibleLink: TA14LinkId;
  decision: TA14RouteDecision;
  recovery: string;
  rationale: string;
};

const SCENARIOS: readonly Scenario[] = [
  {
    id: "evidence-decay",
    title: "Evidence Decay Before Commit",
    pressure:
      "A measurement that supported the earlier decision becomes stale before consequence-bearing commitment.",
    prompt:
      "Locate the earliest unsupported state and decide whether the route may continue.",
    firstBrokenLink: "TA14-LINK-14",
    lastAdmissibleLink: "TA14-LINK-13",
    decision: "HOLD",
    recovery:
      "Re-establish Commit Reality with fresh evidence and reassess any materially affected authority, scope, or consequence assumptions.",
    rationale:
      "Binding may remain historically valid while the reality required for commitment has changed. The route must not inherit stale assumptions into Commit.",
  },
  {
    id: "authority-drift",
    title: "Authority Drift",
    pressure:
      "The approving authority expires after evidence remains valid but before the action is committed.",
    prompt:
      "Separate evidence validity from authority validity and determine the correct route decision.",
    firstBrokenLink: "TA14-LINK-08",
    lastAdmissibleLink: "TA14-LINK-07",
    decision: "HOLD",
    recovery:
      "Re-establish current authority and legitimacy before allowing downstream consequence formation, binding, or commitment.",
    rationale:
      "Valid evidence does not create authority. The chain must stop at the first point where the actor or system can no longer prove permission to act.",
  },
  {
    id: "runtime-dependency",
    title: "Runtime Dependency Change",
    pressure:
      "A critical runtime dependency changes after Commit but before Execution.",
    prompt:
      "Determine whether the committed route remains executable under the new live state.",
    firstBrokenLink: "TA14-LINK-16",
    lastAdmissibleLink: "TA14-LINK-15",
    decision: "HOLD",
    recovery:
      "Re-establish Execution Reality and return upstream if the dependency change materially alters the committed scope or safeguards.",
    rationale:
      "Commit does not guarantee execution. Execution Reality must still match the conditions under which commitment became admissible.",
  },
  {
    id: "correct-refusal",
    title: "Correct Refusal",
    pressure:
      "A required execution condition cannot be proven at runtime.",
    prompt:
      "Determine whether non-execution is failure or the correct governed result.",
    firstBrokenLink: "TA14-LINK-16",
    lastAdmissibleLink: "TA14-LINK-15",
    decision: "REFUSE",
    recovery:
      "Preserve the refusal basis as Admissible Non-Occurrence and document any consequence that was intentionally prevented.",
    rationale:
      "The objective is admissibility, not forced execution. When execution conditions are unsupported, correct non-occurrence can be a governed success.",
  },
  {
    id: "outcome-divergence",
    title: "Outcome Divergence",
    pressure:
      "Execution remains within authorized scope, but direct post-action observation shows an unexpected result.",
    prompt:
      "Identify where the chain must focus after execution and what must be preserved for the next cycle.",
    firstBrokenLink: "TA14-LINK-21",
    lastAdmissibleLink: "TA14-LINK-20",
    decision: "HOLD",
    recovery:
      "Classify the actual Outcome, establish New Reality, preserve relevant Memory, and govern Future Chain entry conditions.",
    rationale:
      "Authorized execution does not prove a successful outcome. The actual result must be evaluated before closure or recurrence.",
  },
  {
    id: "memory-conflict",
    title: "Memory Conflict",
    pressure:
      "Two preserved records support conflicting rules for the next governed cycle.",
    prompt:
      "Prevent uncontrolled reuse of conflicting institutional memory.",
    firstBrokenLink: "TA14-LINK-23",
    lastAdmissibleLink: "TA14-LINK-22",
    decision: "ESCALATE",
    recovery:
      "Govern the conflict, determine version or supersession state, and prevent Future Chain from inheriting unresolved doctrine.",
    rationale:
      "Memory is not automatically admissible because it was preserved. Conflicting or superseded memory must be governed before reuse.",
  },
];

const DECISIONS: readonly TA14RouteDecision[] = [
  "CONTINUE",
  "NARROW",
  "HOLD",
  "REFUSE",
  "ESCALATE",
];

function label(linkId: TA14LinkId) {
  const link = TA14_24_LINKS.find((item) => item.linkId === linkId);
  return link
    ? `${String(link.order).padStart(2, "0")} · ${link.canonicalName}`
    : linkId;
}

export default function TA14ChainFailureSimulatorPage() {
  const [scenarioId, setScenarioId] = useState(SCENARIOS[0].id);
  const [firstBroken, setFirstBroken] = useState<TA14LinkId>(
    SCENARIOS[0].firstBrokenLink,
  );
  const [lastAdmissible, setLastAdmissible] = useState<TA14LinkId>(
    SCENARIOS[0].lastAdmissibleLink,
  );
  const [decision, setDecision] = useState<TA14RouteDecision>(
    SCENARIOS[0].decision,
  );
  const [submitted, setSubmitted] = useState(false);

  const scenario = useMemo(
    () => SCENARIOS.find((item) => item.id === scenarioId) ?? SCENARIOS[0],
    [scenarioId],
  );

  const score = useMemo(() => {
    if (!submitted) return 0;
    let value = 0;
    if (firstBroken === scenario.firstBrokenLink) value += 35;
    if (lastAdmissible === scenario.lastAdmissibleLink) value += 30;
    if (decision === scenario.decision) value += 35;
    return value;
  }, [submitted, firstBroken, lastAdmissible, decision, scenario]);

  function chooseScenario(id: string) {
    const next = SCENARIOS.find((item) => item.id === id) ?? SCENARIOS[0];
    setScenarioId(next.id);
    setFirstBroken(next.firstBrokenLink);
    setLastAdmissible(next.lastAdmissibleLink);
    setDecision(next.decision);
    setSubmitted(false);
  }

  return (
    <main className="min-h-screen bg-[#030712] text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(244,63,94,0.14),transparent_36%),radial-gradient(circle_at_82%_12%,rgba(56,189,248,0.12),transparent_34%)]" />
        <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <Link
            href="/academy/24-link-architecture"
            className="text-sm font-semibold text-sky-300 transition hover:text-sky-200"
          >
            ← Back to 24-Link Explorer
          </Link>
          <p className="mt-10 text-xs font-semibold uppercase tracking-[0.26em] text-rose-300">
            TA-14 Academy · Pressure Lab
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-6xl">
            Chain Failure Simulator
          </h1>
          <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-300">
            The learner is scored on preservation of the admissible route, not
            on whether the scenario reaches execution. Find the first broken
            link, preserve the last admissible state, and make the correct
            governed decision.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {SCENARIOS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => chooseScenario(item.id)}
              className={[
                "rounded-2xl border p-5 text-left transition",
                scenario.id === item.id
                  ? "border-rose-300/35 bg-rose-300/[0.08]"
                  : "border-white/10 bg-white/[0.035] hover:border-white/20",
              ].join(" ")}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Scenario
              </p>
              <p className="mt-2 font-semibold text-white">{item.title}</p>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                {item.pressure}
              </p>
            </button>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-6 pb-20 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
        <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-rose-300">
            Active pressure case
          </p>
          <h2 className="mt-3 text-2xl font-semibold">{scenario.title}</h2>
          <p className="mt-4 leading-7 text-slate-300">{scenario.pressure}</p>

          <div className="mt-6 rounded-2xl border border-white/10 bg-black/15 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">
              Your task
            </p>
            <p className="mt-2 text-sm leading-7 text-slate-200">
              {scenario.prompt}
            </p>
          </div>

          <div className="mt-7 space-y-5">
            <LinkSelect
              labelText="First broken link"
              value={firstBroken}
              onChange={setFirstBroken}
            />
            <LinkSelect
              labelText="Last admissible link"
              value={lastAdmissible}
              onChange={setLastAdmissible}
            />

            <label className="block">
              <span className="text-sm font-semibold text-slate-200">
                Governed decision
              </span>
              <select
                value={decision}
                onChange={(event) =>
                  setDecision(event.target.value as TA14RouteDecision)
                }
                className="mt-2 w-full rounded-xl border border-white/10 bg-[#07101f] px-4 py-3 text-sm text-white outline-none focus:border-rose-300/40"
              >
                {DECISIONS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <button
              type="button"
              onClick={() => setSubmitted(true)}
              className="w-full rounded-xl border border-rose-300/30 bg-rose-300/10 px-5 py-3 text-sm font-semibold text-rose-100 transition hover:bg-rose-300/15"
            >
              Evaluate route decision
            </button>
          </div>
        </section>

        <div className="space-y-6">
          <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-300">
              Route analysis
            </p>

            {!submitted ? (
              <p className="mt-4 leading-7 text-slate-400">
                Submit your route decision to reveal the governed analysis.
              </p>
            ) : (
              <>
                <div className="mt-5 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-5xl font-semibold">{score}</p>
                    <p className="mt-1 text-sm text-slate-400">
                      route-preservation score / 100
                    </p>
                  </div>
                  <span
                    className={[
                      "rounded-full border px-3 py-1 text-xs font-semibold",
                      score === 100
                        ? "border-emerald-300/30 bg-emerald-300/10 text-emerald-200"
                        : "border-amber-300/30 bg-amber-300/10 text-amber-200",
                    ].join(" ")}
                  >
                    {score === 100 ? "ROUTE PRESERVED" : "REASSESS"}
                  </span>
                </div>

                <div className="mt-7 grid gap-4">
                  <ResultRow
                    labelText="First broken link"
                    chosen={label(firstBroken)}
                    expected={label(scenario.firstBrokenLink)}
                    correct={firstBroken === scenario.firstBrokenLink}
                  />
                  <ResultRow
                    labelText="Last admissible link"
                    chosen={label(lastAdmissible)}
                    expected={label(scenario.lastAdmissibleLink)}
                    correct={lastAdmissible === scenario.lastAdmissibleLink}
                  />
                  <ResultRow
                    labelText="Decision"
                    chosen={decision}
                    expected={scenario.decision}
                    correct={decision === scenario.decision}
                  />
                </div>
              </>
            )}
          </section>

          {submitted ? (
            <section className="rounded-3xl border border-emerald-300/20 bg-emerald-300/[0.045] p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-200">
                Governed recovery
              </p>
              <p className="mt-3 leading-7 text-slate-200">
                {scenario.recovery}
              </p>

              <div className="mt-6 border-t border-white/10 pt-6">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                  Why
                </p>
                <p className="mt-3 leading-7 text-slate-300">
                  {scenario.rationale}
                </p>
              </div>
            </section>
          ) : null}
        </div>
      </section>

      <section className="border-t border-white/10 bg-white/[0.02]">
        <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-rose-300">
            Simulator doctrine
          </p>
          <h2 className="mt-3 text-3xl font-semibold">
            Reaching Execution is not the highest score.
          </h2>
          <p className="mt-4 max-w-4xl leading-7 text-slate-300">
            Preserving admissibility is the goal. A correct HOLD, REFUSE,
            NARROW, or ESCALATE decision can be the successful result when the
            evidence, authority, runtime state, or consequence conditions no
            longer support continuation.
          </p>
        </div>
      </section>
    </main>
  );
}

function LinkSelect({
  labelText,
  value,
  onChange,
}: {
  labelText: string;
  value: TA14LinkId;
  onChange: (value: TA14LinkId) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-200">{labelText}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as TA14LinkId)}
        className="mt-2 w-full rounded-xl border border-white/10 bg-[#07101f] px-4 py-3 text-sm text-white outline-none focus:border-rose-300/40"
      >
        {TA14_24_LINKS.map((item) => (
          <option key={item.linkId} value={item.linkId}>
            {String(item.order).padStart(2, "0")} · {item.canonicalName}
          </option>
        ))}
      </select>
    </label>
  );
}

function ResultRow({
  labelText,
  chosen,
  expected,
  correct,
}: {
  labelText: string;
  chosen: string;
  expected: string;
  correct: boolean;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/15 p-5">
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          {labelText}
        </p>
        <span
          className={
            correct
              ? "text-xs font-semibold text-emerald-300"
              : "text-xs font-semibold text-amber-300"
          }
        >
          {correct ? "CORRECT" : "REASSESS"}
        </span>
      </div>
      <p className="mt-3 text-sm text-slate-200">Chosen: {chosen}</p>
      {!correct ? (
        <p className="mt-2 text-sm text-slate-400">Expected: {expected}</p>
      ) : null}
    </div>
  );
}
