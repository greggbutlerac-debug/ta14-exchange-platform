"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import {
  TA14_24_LINKS,
  type TA14EvidenceHealthState,
  type TA14LinkId,
} from "@/lib/academy/ta14-24-link-canon";

type Assessment = {
  state: TA14EvidenceHealthState;
  evidence: string;
  note: string;
};

const STATES: readonly TA14EvidenceHealthState[] = [
  "supported",
  "partial",
  "held",
  "challenged",
  "untested",
  "outside_scope",
];

const LABEL: Record<TA14EvidenceHealthState, string> = {
  supported: "Supported",
  partial: "Partial",
  held: "Held",
  challenged: "Challenged",
  untested: "Untested",
  outside_scope: "Outside scope",
};

export default function TA14BuildAChainLabPage() {
  const [subject, setSubject] = useState("My governed system");
  const [selected, setSelected] = useState<TA14LinkId>("TA14-LINK-01");
  const [assessments, setAssessments] = useState<Record<TA14LinkId, Assessment>>(
    () =>
      Object.fromEntries(
        TA14_24_LINKS.map((item) => [
          item.linkId,
          { state: "untested", evidence: "", note: "" },
        ]),
      ) as Record<TA14LinkId, Assessment>,
  );

  const link = useMemo(
    () => TA14_24_LINKS.find((item) => item.linkId === selected)!,
    [selected],
  );

  const record = assessments[selected];

  const totals = useMemo(
    () =>
      STATES.reduce(
        (result, state) => {
          result[state] = TA14_24_LINKS.filter(
            (item) => assessments[item.linkId].state === state,
          ).length;
          return result;
        },
        {} as Record<TA14EvidenceHealthState, number>,
      ),
    [assessments],
  );

  function update(patch: Partial<Assessment>) {
    setAssessments((current) => ({
      ...current,
      [selected]: { ...current[selected], ...patch },
    }));
  }

  return (
    <main className="min-h-screen bg-[#030712] text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(168,85,247,0.15),transparent_38%),radial-gradient(circle_at_84%_10%,rgba(56,189,248,0.11),transparent_34%)]" />
        <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <Link
            href="/academy/24-link-architecture"
            className="text-sm font-semibold text-sky-300"
          >
            ← Back to 24-Link Explorer
          </Link>
          <p className="mt-10 text-xs font-semibold uppercase tracking-[0.26em] text-purple-300">
            TA-14 Academy · Applied Architecture Lab
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-6xl">
            Build-a-Chain Lab
          </h1>
          <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-300">
            Take a real AI system, workflow, environmental process, HVAC
            procedure, governance architecture, or other consequence-bearing
            system and map what its evidence actually supports across all 24
            TA-14 links.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <label className="block max-w-3xl">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            System or architecture being mapped
          </span>
          <input
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            className="mt-2 w-full rounded-xl border border-white/10 bg-[#07101f] px-4 py-3 text-lg font-semibold outline-none focus:border-purple-300/40"
          />
        </label>

        <div className="mt-8 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {STATES.map((state) => (
            <div
              key={state}
              className="rounded-2xl border border-white/10 bg-white/[0.035] p-4"
            >
              <p className="text-2xl font-semibold">{totals[state]}</p>
              <p className="mt-1 text-xs text-slate-400">{LABEL[state]}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-6 pb-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-300">
            24-Link map
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {TA14_24_LINKS.map((item) => {
              const state = assessments[item.linkId].state;
              return (
                <button
                  key={item.linkId}
                  type="button"
                  onClick={() => setSelected(item.linkId)}
                  className={[
                    "rounded-2xl border p-4 text-left transition",
                    selected === item.linkId
                      ? "border-purple-300/45 bg-purple-300/[0.09]"
                      : "border-white/10 bg-white/[0.03] hover:border-white/20",
                  ].join(" ")}
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-xs font-semibold text-sky-300">
                      {String(item.order).padStart(2, "0")}
                    </p>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                      {LABEL[state]}
                    </span>
                  </div>
                  <p className="mt-2 text-sm font-semibold">
                    {item.canonicalName}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        <aside className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-300">
            Link {String(link.order).padStart(2, "0")}
          </p>
          <h2 className="mt-2 text-2xl font-semibold">{link.canonicalName}</h2>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            {link.governingQuestion}
          </p>

          <div className="mt-6 space-y-5">
            <label className="block">
              <span className="text-sm font-semibold text-slate-200">
                Evidence state
              </span>
              <select
                value={record.state}
                onChange={(event) =>
                  update({
                    state: event.target.value as TA14EvidenceHealthState,
                  })
                }
                className="mt-2 w-full rounded-xl border border-white/10 bg-[#07101f] px-4 py-3 text-sm outline-none focus:border-purple-300/40"
              >
                {STATES.map((state) => (
                  <option key={state} value={state}>
                    {LABEL[state]}
                  </option>
                ))}
              </select>
            </label>

            <TextArea
              label="Evidence or artifact"
              value={record.evidence}
              onChange={(evidence) => update({ evidence })}
            />
            <TextArea
              label="Assessment note"
              value={record.note}
              onChange={(note) => update({ note })}
            />
          </div>

          <div className="mt-7 rounded-2xl border border-white/10 bg-black/15 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              What this link expects
            </p>
            <ul className="mt-3 space-y-2">
              {link.evidenceRequirements.slice(0, 4).map((requirement) => (
                <li
                  key={requirement}
                  className="text-sm leading-6 text-slate-300"
                >
                  • {requirement}
                </li>
              ))}
            </ul>
          </div>

          <Link
            href={`/academy/24-link-architecture/${String(link.order).padStart(
              2,
              "0",
            )}-${link.slug}`}
            className="mt-6 inline-flex text-sm font-semibold text-sky-300"
          >
            Study this canonical link →
          </Link>
        </aside>
      </section>

      <section className="border-t border-white/10 bg-white/[0.02]">
        <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-purple-300">
            Current chain-map finding
          </p>
          <h2 className="mt-3 text-3xl font-semibold">
            {subject || "Unnamed system"}
          </h2>
          <p className="mt-4 max-w-5xl leading-7 text-slate-300">
            This lab creates a working evidence map, not a certification or
            approval. A production Exchange submission should preserve the
            underlying artifacts, scope, version, reviewer basis, challenge
            state, and chronology behind every link-level determination.
          </p>
        </div>
      </section>
    </main>
  );
}

function TextArea({
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
        rows={4}
        className="mt-2 w-full resize-y rounded-xl border border-white/10 bg-[#07101f] px-4 py-3 text-sm leading-6 outline-none focus:border-purple-300/40"
      />
    </label>
  );
}
