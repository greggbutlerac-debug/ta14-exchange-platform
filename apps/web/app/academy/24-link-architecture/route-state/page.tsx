"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import {
  TA14_24_LINKS,
  TA14_ROUTE_STATE_QUESTIONS,
  type TA14LinkId,
  type TA14RouteDecision,
} from "@/lib/academy/ta14-24-link-canon";

const decisions: readonly TA14RouteDecision[] = [
  "CONTINUE",
  "NARROW",
  "HOLD",
  "REFUSE",
  "ESCALATE",
];

const decisionCopy: Record<TA14RouteDecision, string> = {
  CONTINUE: "The next transition remains supportable.",
  NARROW: "Continuation is permitted only within a smaller supported scope.",
  HOLD: "Progression pauses until the missing condition is recovered.",
  REFUSE: "Continuation is not admissible under the current state.",
  ESCALATE: "The route requires higher or different governed authority before proceeding.",
};

function linkLabel(linkId: TA14LinkId | "") {
  if (!linkId) return "Not established";
  const link = TA14_24_LINKS.find((item) => item.linkId === linkId);
  return link
    ? `${String(link.order).padStart(2, "0")} · ${link.canonicalName}`
    : linkId;
}

export default function TA14RouteStateLabPage() {
  const [currentLink, setCurrentLink] =
    useState<TA14LinkId>("TA14-LINK-14");
  const [lastAdmissibleLink, setLastAdmissibleLink] =
    useState<TA14LinkId | "">("TA14-LINK-13");
  const [firstBrokenLink, setFirstBrokenLink] =
    useState<TA14LinkId | "">("TA14-LINK-14");
  const [decision, setDecision] =
    useState<TA14RouteDecision>("HOLD");
  const [reason, setReason] = useState(
    "New evidence changed the relevant risk state after binding.",
  );
  const [recovery, setRecovery] = useState(
    "Re-establish Commit Reality and reassess authority or scope if the change is material.",
  );
  const [formingConsequence, setFormingConsequence] = useState(
    "Premature commitment against stale assumptions.",
  );

  const current = useMemo(
    () => TA14_24_LINKS.find((item) => item.linkId === currentLink)!,
    [currentLink],
  );

  const brokenOrder = useMemo(() => {
    if (!firstBrokenLink) return null;
    return TA14_24_LINKS.find((item) => item.linkId === firstBrokenLink)?.order ?? null;
  }, [firstBrokenLink]);

  const lastOrder = useMemo(() => {
    if (!lastAdmissibleLink) return null;
    return (
      TA14_24_LINKS.find((item) => item.linkId === lastAdmissibleLink)?.order ??
      null
    );
  }, [lastAdmissibleLink]);

  function cellState(order: number) {
    if (brokenOrder && order === brokenOrder) return "broken";
    if (lastOrder && order <= lastOrder) return "admissible";
    if (order === current.order) return "current";
    if (brokenOrder && order > brokenOrder) return "downstream";
    return "pending";
  }

  return (
    <main className="min-h-screen bg-[#030712] text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(56,189,248,0.18),transparent_38%),radial-gradient(circle_at_85%_10%,rgba(244,114,182,0.10),transparent_32%)]" />
        <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <Link
            href="/academy/24-link-architecture"
            className="text-sm font-semibold text-sky-300 transition hover:text-sky-200"
          >
            ← Back to 24-Link Explorer
          </Link>

          <p className="mt-10 text-xs font-semibold uppercase tracking-[0.26em] text-sky-300">
            TA-14 Academy · Operational Lab
          </p>
          <h1 className="mt-3 max-w-5xl text-4xl font-semibold tracking-tight sm:text-6xl">
            Route State
          </h1>
          <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-300">
            Locate a live governance process inside the 24-link architecture,
            preserve the last admissible state, identify the first broken link,
            and determine what must become true before consequence-bearing
            progression is allowed.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-5 sm:p-7">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
            {TA14_24_LINKS.map((item) => {
              const state = cellState(item.order);

              return (
                <Link
                  key={item.linkId}
                  href={`/academy/24-link-architecture/${String(
                    item.order,
                  ).padStart(2, "0")}-${item.slug}`}
                  className={[
                    "rounded-2xl border p-4 transition hover:-translate-y-0.5",
                    state === "admissible"
                      ? "border-emerald-300/30 bg-emerald-300/10"
                      : "",
                    state === "current"
                      ? "border-sky-300/50 bg-sky-300/15 ring-1 ring-sky-300/20"
                      : "",
                    state === "broken"
                      ? "border-rose-300/50 bg-rose-300/15 ring-1 ring-rose-300/20"
                      : "",
                    state === "downstream"
                      ? "border-white/5 bg-white/[0.02] opacity-45"
                      : "",
                    state === "pending"
                      ? "border-white/10 bg-white/[0.035]"
                      : "",
                  ].join(" ")}
                >
                  <p className="text-xs font-semibold text-slate-500">
                    {String(item.order).padStart(2, "0")}
                  </p>
                  <p className="mt-2 text-sm font-semibold leading-5">
                    {item.canonicalName}
                  </p>
                  <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                    {state}
                  </p>
                </Link>
              );
            })}
          </div>

          <div className="mt-6 flex flex-wrap gap-4 text-xs text-slate-400">
            <Legend label="Admissibly established" className="bg-emerald-300/70" />
            <Legend label="Current state" className="bg-sky-300/70" />
            <Legend label="First broken link" className="bg-rose-300/70" />
            <Legend label="Downstream not supportable" className="bg-white/25" />
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-6 pb-16 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-300">
            Route-state inputs
          </p>
          <h2 className="mt-3 text-2xl font-semibold">
            Establish the governed state
          </h2>

          <div className="mt-7 space-y-5">
            <SelectField
              label="Current link"
              value={currentLink}
              onChange={(value) => setCurrentLink(value as TA14LinkId)}
              allowNone={false}
            />
            <SelectField
              label="Last admissibly established link"
              value={lastAdmissibleLink}
              onChange={(value) =>
                setLastAdmissibleLink(value as TA14LinkId | "")
              }
            />
            <SelectField
              label="First broken link"
              value={firstBrokenLink}
              onChange={(value) =>
                setFirstBrokenLink(value as TA14LinkId | "")
              }
            />

            <label className="block">
              <span className="text-sm font-semibold text-slate-200">
                Route decision
              </span>
              <select
                value={decision}
                onChange={(event) =>
                  setDecision(event.target.value as TA14RouteDecision)
                }
                className="mt-2 w-full rounded-xl border border-white/10 bg-[#07101f] px-4 py-3 text-sm text-white outline-none transition focus:border-sky-300/40"
              >
                {decisions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <TextField label="Reason" value={reason} onChange={setReason} />
            <TextField
              label="Required recovery"
              value={recovery}
              onChange={setRecovery}
            />
            <TextField
              label="Forming consequence"
              value={formingConsequence}
              onChange={setFormingConsequence}
            />
          </div>
        </div>

        <div className="space-y-6">
          <section className="rounded-3xl border border-sky-300/20 bg-sky-300/[0.055] p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-200">
              Live route-state record
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <StateValue label="Current link" value={linkLabel(currentLink)} />
              <StateValue
                label="Last admissible"
                value={linkLabel(lastAdmissibleLink)}
              />
              <StateValue
                label="First broken"
                value={linkLabel(firstBrokenLink)}
              />
              <StateValue label="Decision" value={decision} />
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-black/15 p-5">
              <p className="text-sm font-semibold text-white">
                {decisionCopy[decision]}
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-300">{reason}</p>
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
              Recovery requirement
            </p>
            <p className="mt-3 leading-7 text-slate-200">{recovery}</p>

            <div className="mt-6 border-t border-white/10 pt-6">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-rose-300">
                Consequence forming if progression continues
              </p>
              <p className="mt-3 leading-7 text-slate-200">
                {formingConsequence}
              </p>
            </div>
          </section>

          <section className="rounded-3xl border border-amber-300/20 bg-amber-300/[0.045] p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-200">
              Canonical state rule
            </p>
            <p className="mt-3 leading-7 text-slate-300">
              A downstream link does not become admissible merely because a
              workflow reaches it. Progression remains supportable only while
              the required upstream states and evidence remain valid.
            </p>
          </section>
        </div>
      </section>

      <section className="border-t border-white/10 bg-white/[0.02]">
        <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-300">
            Six Route-State Questions
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {TA14_ROUTE_STATE_QUESTIONS.map((question, index) => (
              <article
                key={question}
                className="rounded-2xl border border-white/10 bg-white/[0.035] p-5"
              >
                <p className="text-xs font-semibold text-slate-500">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <p className="mt-3 text-sm font-semibold leading-6 text-slate-200">
                  {question}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function SelectField({
  label,
  value,
  onChange,
  allowNone = true,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  allowNone?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-200">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-xl border border-white/10 bg-[#07101f] px-4 py-3 text-sm text-white outline-none transition focus:border-sky-300/40"
      >
        {allowNone ? <option value="">Not established</option> : null}
        {TA14_24_LINKS.map((item) => (
          <option key={item.linkId} value={item.linkId}>
            {String(item.order).padStart(2, "0")} · {item.canonicalName}
          </option>
        ))}
      </select>
    </label>
  );
}

function TextField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-200">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={3}
        className="mt-2 w-full resize-y rounded-xl border border-white/10 bg-[#07101f] px-4 py-3 text-sm leading-6 text-white outline-none transition focus:border-sky-300/40"
      />
    </label>
  );
}

function StateValue({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/15 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-sm font-semibold leading-6 text-slate-100">
        {value}
      </p>
    </div>
  );
}

function Legend({
  label,
  className,
}: {
  label: string;
  className: string;
}) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className={`h-2.5 w-2.5 rounded-full ${className}`} />
      {label}
    </span>
  );
}
