"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { TA14_24_LINKS } from "@/lib/academy/ta14-24-link-canon";

const RECURSION_ORDERS = [20, 21, 22, 23, 24] as const;

type RecursionRecord = {
  outcomeReality: string;
  outcome: string;
  newReality: string;
  memory: string;
  futureTrigger: string;
  inheritedConstraints: string;
};

const EMPTY_RECORD: RecursionRecord = {
  outcomeReality: "",
  outcome: "",
  newReality: "",
  memory: "",
  futureTrigger: "",
  inheritedConstraints: "",
};

export default function TA14RecursionLabPage() {
  const [record, setRecord] = useState<RecursionRecord>(EMPTY_RECORD);
  const [activeOrder, setActiveOrder] = useState<number>(20);

  const recursionLinks = useMemo(
    () =>
      RECURSION_ORDERS.map((order) =>
        TA14_24_LINKS.find((item) => item.order === order),
      ).filter(
        (item): item is (typeof TA14_24_LINKS)[number] => Boolean(item),
      ),
    [],
  );

  const completed = [
    record.outcomeReality,
    record.outcome,
    record.newReality,
    record.memory,
    record.futureTrigger,
  ].filter((value) => value.trim().length > 0).length;

  function update<K extends keyof RecursionRecord>(
    field: K,
    value: RecursionRecord[K],
  ) {
    setRecord((current) => ({
      ...current,
      [field]: value,
    }));
  }

  return (
    <main className="min-h-screen bg-[#030712] text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(14,165,233,0.16),transparent_38%),radial-gradient(circle_at_84%_10%,rgba(16,185,129,0.11),transparent_34%)]" />
        <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <Link
            href="/academy/24-link-architecture"
            className="text-sm font-semibold text-sky-300 transition hover:text-sky-200"
          >
            ← Back to 24-Link Explorer
          </Link>

          <p className="mt-10 text-xs font-semibold uppercase tracking-[0.26em] text-emerald-300">
            TA-14 Academy · Recursion Lab
          </p>

          <h1 className="mt-3 max-w-5xl text-4xl font-semibold tracking-tight sm:text-6xl">
            Outcome Does Not End the Chain
          </h1>

          <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-300">
            Govern the transition from what happened to what becomes true next.
            The closing links preserve post-action reality, determine the
            outcome, establish the new reality, retain controlled memory, and
            define the conditions for the future chain.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
          <div className="grid gap-3 md:grid-cols-5">
            {recursionLinks.map((item) => {
              const active = activeOrder === item.order;

              return (
                <button
                  key={item.linkId}
                  type="button"
                  onClick={() => setActiveOrder(item.order)}
                  className={[
                    "relative rounded-2xl border p-5 text-left transition",
                    active
                      ? "border-emerald-300/40 bg-emerald-300/[0.09]"
                      : "border-white/10 bg-white/[0.025] hover:border-white/20",
                  ].join(" ")}
                >
                  <p className="text-xs font-semibold text-sky-300">
                    {String(item.order).padStart(2, "0")}
                  </p>
                  <p className="mt-2 text-sm font-semibold">
                    {item.canonicalName}
                  </p>
                  <p className="mt-3 text-xs leading-5 text-slate-500">
                    {item.governingQuestion}
                  </p>
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-slate-500">
            <span>{completed}/5 recursion stages described</span>
            <span>•</span>
            <span>Future Chain inherits governed New Reality + Memory</span>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-6 pb-20 lg:grid-cols-[1fr_1fr] lg:px-8">
        <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-300">
            Post-action record
          </p>
          <h2 className="mt-3 text-2xl font-semibold">
            Convert consequence into governed future state
          </h2>

          <div className="mt-7 space-y-6">
            <RecursionField
              number="20"
              title="Outcome Reality"
              prompt="What real state now exists after execution or non-execution?"
              value={record.outcomeReality}
              onChange={(value) => update("outcomeReality", value)}
            />

            <RecursionField
              number="21"
              title="Outcome"
              prompt="What governed result did the chain actually produce?"
              value={record.outcome}
              onChange={(value) => update("outcome", value)}
            />

            <RecursionField
              number="22"
              title="New Reality"
              prompt="What changed world must the next decision inherit?"
              value={record.newReality}
              onChange={(value) => update("newReality", value)}
            />

            <RecursionField
              number="23"
              title="Memory"
              prompt="What governed knowledge, lineage, finding, doctrine, or lesson must survive?"
              value={record.memory}
              onChange={(value) => update("memory", value)}
            />

            <RecursionField
              number="24"
              title="Future Chain"
              prompt="What event or condition is allowed to trigger the next governed cycle?"
              value={record.futureTrigger}
              onChange={(value) => update("futureTrigger", value)}
            />

            <RecursionField
              number="→"
              title="Inherited Constraints"
              prompt="What constraints, unresolved challenges, or prior determinations must the next chain carry forward?"
              value={record.inheritedConstraints}
              onChange={(value) => update("inheritedConstraints", value)}
            />
          </div>
        </section>

        <div className="space-y-6">
          <section className="rounded-3xl border border-emerald-300/20 bg-emerald-300/[0.05] p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-200">
              Recursion state
            </p>

            <div className="mt-6 space-y-4">
              <StateBlock
                label="Observed reality"
                value={record.outcomeReality}
                empty="Outcome Reality not yet established."
              />
              <StateBlock
                label="Governed result"
                value={record.outcome}
                empty="Outcome not yet classified."
              />
              <StateBlock
                label="New starting reality"
                value={record.newReality}
                empty="New Reality not yet declared."
              />
              <StateBlock
                label="Preserved memory"
                value={record.memory}
                empty="Memory state not yet defined."
              />
              <StateBlock
                label="Future-chain trigger"
                value={record.futureTrigger}
                empty="Future Chain entry condition not yet defined."
              />
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-300">
              Recursion doctrine
            </p>
            <h2 className="mt-3 text-2xl font-semibold">
              Every governed outcome changes what the next chain is allowed to assume.
            </h2>
            <p className="mt-4 leading-7 text-slate-300">
              A later workflow should not restart from the old world. It must
              inherit the New Reality actually created by the prior chain and
              the governed Memory preserved from that chain.
            </p>

            <div className="mt-6 rounded-2xl border border-amber-300/20 bg-amber-300/[0.045] p-5">
              <p className="text-sm font-semibold text-amber-100">
                No uncontrolled recurrence.
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Future Chain should not begin until its trigger, inherited
                state, memory references, and constraints are explicit enough
                to govern.
              </p>
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
              Canon links
            </p>

            <div className="mt-5 grid gap-3">
              {recursionLinks.map((item) => (
                <Link
                  key={item.linkId}
                  href={`/academy/24-link-architecture/${String(
                    item.order,
                  ).padStart(2, "0")}-${item.slug}`}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-black/10 px-4 py-3 text-sm transition hover:border-sky-300/30"
                >
                  <span>
                    {String(item.order).padStart(2, "0")}{" "}
                    {item.canonicalName}
                  </span>
                  <span className="text-sky-300">→</span>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </section>

      <section className="border-t border-white/10 bg-white/[0.02]">
        <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-300">
            Academy requirement
          </p>
          <h2 className="mt-3 text-3xl font-semibold">
            Advanced scenarios should continue beyond Outcome.
          </h2>
          <p className="mt-4 max-w-5xl leading-7 text-slate-300">
            Learners should be required to observe Outcome Reality, classify
            Outcome, update New Reality, determine what enters Memory, identify
            conflict or supersession, and define Future Chain entry conditions.
            This prevents TA-14 from being taught as a one-way compliance
            checklist.
          </p>
        </div>
      </section>
    </main>
  );
}

function RecursionField({
  number,
  title,
  prompt,
  value,
  onChange,
}: {
  number: string;
  title: string;
  prompt: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block rounded-2xl border border-white/10 bg-black/10 p-5">
      <div className="flex items-start gap-4">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-sky-300/25 bg-sky-300/10 text-xs font-semibold text-sky-200">
          {number}
        </span>
        <div className="min-w-0 flex-1">
          <span className="font-semibold text-white">{title}</span>
          <p className="mt-1 text-sm leading-6 text-slate-400">{prompt}</p>
          <textarea
            value={value}
            onChange={(event) => onChange(event.target.value)}
            rows={3}
            className="mt-4 w-full resize-y rounded-xl border border-white/10 bg-[#07101f] px-4 py-3 text-sm leading-6 text-white outline-none transition focus:border-emerald-300/40"
          />
        </div>
      </div>
    </label>
  );
}

function StateBlock({
  label,
  value,
  empty,
}: {
  label: string;
  value: string;
  empty: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/15 p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
        {label}
      </p>
      <p
        className={[
          "mt-2 text-sm leading-6",
          value.trim() ? "text-slate-200" : "text-slate-500",
        ].join(" ")}
      >
        {value.trim() || empty}
      </p>
    </div>
  );
}
