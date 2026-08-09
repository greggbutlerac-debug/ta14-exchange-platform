"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { TA14_24_LINKS } from "@/lib/academy/ta14-24-link-canon";

type MasteryStage =
  | "NOT STARTED"
  | "RECOGNIZED"
  | "EXPLAINED"
  | "EVIDENCE-MAPPED"
  | "DIAGNOSED"
  | "APPLIED"
  | "REPLAYED"
  | "MASTERED";

const STAGES: readonly MasteryStage[] = [
  "NOT STARTED",
  "RECOGNIZED",
  "EXPLAINED",
  "EVIDENCE-MAPPED",
  "DIAGNOSED",
  "APPLIED",
  "REPLAYED",
  "MASTERED",
];

const stageDescriptions: Record<MasteryStage, string> = {
  "NOT STARTED": "No competency evidence has been recorded yet.",
  RECOGNIZED: "Correctly identifies the link in an unfamiliar scenario.",
  EXPLAINED: "Explains why the link exists and what it protects.",
  "EVIDENCE-MAPPED": "Identifies evidence that would support or fail the link.",
  DIAGNOSED: "Finds ambiguity, drift, insufficiency, or invalidity.",
  APPLIED: "Makes the correct continue, narrow, hold, refuse, or escalate decision.",
  REPLAYED: "Reconstructs the route and identifies last admissible and first broken state.",
  MASTERED: "Demonstrates all required competency dimensions for the link.",
};

export default function TA14ChainPassportPage() {
  const [passport, setPassport] = useState<Record<string, MasteryStage>>(
    Object.fromEntries(
      TA14_24_LINKS.map((item) => [item.linkId, "NOT STARTED" as MasteryStage]),
    ),
  );

  const mastered = useMemo(
    () =>
      TA14_24_LINKS.filter(
        (item) => passport[item.linkId] === "MASTERED",
      ).length,
    [passport],
  );

  const progressed = useMemo(
    () =>
      TA14_24_LINKS.filter(
        (item) => passport[item.linkId] !== "NOT STARTED",
      ).length,
    [passport],
  );

  const completion = Math.round((mastered / TA14_24_LINKS.length) * 100);

  function updateStage(linkId: string, stage: MasteryStage) {
    setPassport((current) => ({
      ...current,
      [linkId]: stage,
    }));
  }

  function resetPassport() {
    setPassport(
      Object.fromEntries(
        TA14_24_LINKS.map((item) => [item.linkId, "NOT STARTED" as MasteryStage]),
      ),
    );
  }

  return (
    <main className="min-h-screen bg-[#030712] text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(16,185,129,0.16),transparent_38%),radial-gradient(circle_at_85%_10%,rgba(56,189,248,0.10),transparent_32%)]" />
        <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <Link
            href="/academy/24-link-architecture"
            className="text-sm font-semibold text-sky-300 transition hover:text-sky-200"
          >
            ← Back to 24-Link Explorer
          </Link>

          <p className="mt-10 text-xs font-semibold uppercase tracking-[0.26em] text-emerald-300">
            TA-14 Academy · Mastery Record
          </p>
          <h1 className="mt-3 max-w-5xl text-4xl font-semibold tracking-tight sm:text-6xl">
            24-Link Chain Passport
          </h1>
          <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-300">
            A link is not completed because a learner opened a lesson. The
            passport records demonstrated competency across recognition,
            explanation, evidence mapping, diagnosis, application, and replay.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid gap-5 md:grid-cols-3">
          <Metric value={`${mastered}/24`} label="Links mastered" />
          <Metric value={`${progressed}/24`} label="Links in progress" />
          <Metric value={`${completion}%`} label="Mastery completion" />
        </div>

        <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.035] p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Passport progress
              </p>
              <p className="mt-2 text-sm text-slate-300">
                Only MASTERED links count toward credential completion.
              </p>
            </div>
            <button
              type="button"
              onClick={resetPassport}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:border-white/20 hover:bg-white/10"
            >
              Reset local passport
            </button>
          </div>

          <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-emerald-300 transition-all"
              style={{ width: `${completion}%` }}
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20 lg:px-8">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {TA14_24_LINKS.map((item) => {
            const stage = passport[item.linkId] ?? "NOT STARTED";
            const stageIndex = STAGES.indexOf(stage);

            return (
              <article
                key={item.linkId}
                className={[
                  "rounded-3xl border p-6 transition",
                  stage === "MASTERED"
                    ? "border-emerald-300/35 bg-emerald-300/[0.07]"
                    : "border-white/10 bg-white/[0.035]",
                ].join(" ")}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-300">
                      Link {String(item.order).padStart(2, "0")}
                    </p>
                    <h2 className="mt-2 text-xl font-semibold">
                      {item.canonicalName}
                    </h2>
                  </div>
                  <span className="rounded-full border border-white/10 bg-black/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                    {stage}
                  </span>
                </div>

                <div className="mt-5 grid grid-cols-8 gap-1.5">
                  {STAGES.map((candidate, index) => (
                    <div
                      key={candidate}
                      title={candidate}
                      className={[
                        "h-2 rounded-full",
                        index <= stageIndex && stage !== "NOT STARTED"
                          ? "bg-emerald-300/80"
                          : "bg-white/10",
                      ].join(" ")}
                    />
                  ))}
                </div>

                <p className="mt-5 min-h-14 text-sm leading-6 text-slate-300">
                  {stageDescriptions[stage]}
                </p>

                <label className="mt-5 block">
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Demonstrated stage
                  </span>
                  <select
                    value={stage}
                    onChange={(event) =>
                      updateStage(
                        item.linkId,
                        event.target.value as MasteryStage,
                      )
                    }
                    className="mt-2 w-full rounded-xl border border-white/10 bg-[#07101f] px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-300/40"
                  >
                    {STAGES.map((candidate) => (
                      <option key={candidate} value={candidate}>
                        {candidate}
                      </option>
                    ))}
                  </select>
                </label>

                <Link
                  href={`/academy/24-link-architecture/${String(
                    item.order,
                  ).padStart(2, "0")}-${item.slug}`}
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-sky-300 transition hover:text-sky-200"
                >
                  Open canonical lesson
                  <span aria-hidden="true">→</span>
                </Link>
              </article>
            );
          })}
        </div>
      </section>

      <section className="border-t border-white/10 bg-white/[0.02]">
        <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-300">
            Mastery standard
          </p>
          <h2 className="mt-3 text-3xl font-semibold">
            Completion represents demonstrated capability, not seat time.
          </h2>

          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Standard
              title="Recognize"
              body="Identify the correct link in an unfamiliar scenario."
            />
            <Standard
              title="Explain"
              body="Explain why the link exists and what it protects."
            />
            <Standard
              title="Evidence-map"
              body="Identify evidence that supports, weakens, or fails the link."
            />
            <Standard
              title="Diagnose"
              body="Find ambiguity, drift, insufficiency, or invalidity."
            />
            <Standard
              title="Apply"
              body="Choose the correct continue, narrow, hold, refuse, or escalate action."
            />
            <Standard
              title="Replay"
              body="Reconstruct the route, last admissible state, and first broken link."
            />
          </div>

          <div className="mt-8 rounded-2xl border border-amber-300/20 bg-amber-300/[0.045] p-6">
            <p className="text-sm leading-7 text-slate-300">
              This first Passport page is an Academy interaction layer only.
              Persisted learner identity, signed assessment evidence, reviewer
              verification, and credential issuance should be added as separate
              governed records rather than inferred from a local UI selection.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-6">
      <div className="text-3xl font-semibold">{value}</div>
      <div className="mt-2 text-sm text-slate-400">{label}</div>
    </div>
  );
}

function Standard({ title, body }: { title: string; body: string }) {
  return (
    <article className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
      <h3 className="font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-300">{body}</p>
    </article>
  );
}
