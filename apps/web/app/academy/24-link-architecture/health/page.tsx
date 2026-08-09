"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import {
  TA14_24_LINKS,
  TA14_ARCHITECTURE_REGIONS,
  type TA14EvidenceHealthState,
  type TA14LinkId,
} from "@/lib/academy/ta14-24-link-canon";

const HEALTH_STATES: readonly TA14EvidenceHealthState[] = [
  "supported",
  "partial",
  "held",
  "challenged",
  "untested",
  "outside_scope",
];

const HEALTH_LABELS: Record<TA14EvidenceHealthState, string> = {
  supported: "Supported",
  partial: "Partial",
  held: "Held",
  challenged: "Challenged",
  untested: "Untested",
  outside_scope: "Outside scope",
};

const HEALTH_COPY: Record<TA14EvidenceHealthState, string> = {
  supported:
    "Evidence currently supports the declared link within the bounded review scope.",
  partial:
    "Some elements are supported, but route-complete evidence remains incomplete.",
  held:
    "A determination is paused pending additional evidence, recovery, or resolution.",
  challenged:
    "A recorded challenge exists against the evidence, interpretation, or determination.",
  untested:
    "No governed review has tested this link within the current record.",
  outside_scope:
    "This link was not included in the declared review scope.",
};

const HEALTH_CLASS: Record<TA14EvidenceHealthState, string> = {
  supported: "border-emerald-300/35 bg-emerald-300/10 text-emerald-100",
  partial: "border-amber-300/35 bg-amber-300/10 text-amber-100",
  held: "border-orange-300/35 bg-orange-300/10 text-orange-100",
  challenged: "border-rose-300/35 bg-rose-300/10 text-rose-100",
  untested: "border-slate-300/15 bg-white/[0.035] text-slate-300",
  outside_scope: "border-white/5 bg-white/[0.015] text-slate-500",
};

type LinkEvidenceRecord = {
  state: TA14EvidenceHealthState;
  artifact: string;
  scope: string;
  version: string;
  challenge: string;
  visibility: "public" | "private" | "mixed";
};

function defaultRecord(): LinkEvidenceRecord {
  return {
    state: "untested",
    artifact: "",
    scope: "",
    version: "Current record",
    challenge: "",
    visibility: "public",
  };
}

export default function TA14ArchitectureHealthOverlayPage() {
  const [architectureName, setArchitectureName] = useState(
    "Example Registered Architecture",
  );
  const [records, setRecords] = useState<Record<TA14LinkId, LinkEvidenceRecord>>(
    () =>
      Object.fromEntries(
        TA14_24_LINKS.map((item) => [item.linkId, defaultRecord()]),
      ) as Record<TA14LinkId, LinkEvidenceRecord>,
  );
  const [selectedLinkId, setSelectedLinkId] =
    useState<TA14LinkId>("TA14-LINK-01");

  const selectedLink = useMemo(
    () => TA14_24_LINKS.find((item) => item.linkId === selectedLinkId)!,
    [selectedLinkId],
  );

  const selectedRecord = records[selectedLinkId];

  const counts = useMemo(() => {
    return HEALTH_STATES.reduce(
      (acc, state) => {
        acc[state] = TA14_24_LINKS.filter(
          (item) => records[item.linkId].state === state,
        ).length;
        return acc;
      },
      {} as Record<TA14EvidenceHealthState, number>,
    );
  }, [records]);

  function updateRecord(
    linkId: TA14LinkId,
    patch: Partial<LinkEvidenceRecord>,
  ) {
    setRecords((current) => ({
      ...current,
      [linkId]: {
        ...current[linkId],
        ...patch,
      },
    }));
  }

  return (
    <main className="min-h-screen bg-[#030712] text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(56,189,248,0.17),transparent_38%),radial-gradient(circle_at_84%_8%,rgba(16,185,129,0.10),transparent_34%)]" />
        <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <Link
            href="/academy/24-link-architecture"
            className="text-sm font-semibold text-sky-300 transition hover:text-sky-200"
          >
            ← Back to 24-Link Explorer
          </Link>

          <p className="mt-10 text-xs font-semibold uppercase tracking-[0.26em] text-sky-300">
            TA-14 Exchange · Evidence Coordinate System
          </p>
          <h1 className="mt-3 max-w-5xl text-4xl font-semibold tracking-tight sm:text-6xl">
            24-Link Architecture Health Overlay
          </h1>
          <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-300">
            Project submitted and reviewed evidence across the full TA-14 route
            while preserving scope, version, challenge state, and visibility.
            Mapping does not equal endorsement, certification, or approval.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <label className="block max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Registered architecture / governed subject
          </span>
          <input
            value={architectureName}
            onChange={(event) => setArchitectureName(event.target.value)}
            className="mt-2 w-full rounded-xl border border-white/10 bg-[#07101f] px-4 py-3 text-base font-semibold text-white outline-none transition focus:border-sky-300/40"
          />
        </label>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {HEALTH_STATES.map((state) => (
            <div
              key={state}
              className={`rounded-2xl border p-5 ${HEALTH_CLASS[state]}`}
            >
              <div className="text-3xl font-semibold">{counts[state]}</div>
              <div className="mt-2 text-sm font-semibold">
                {HEALTH_LABELS[state]}
              </div>
              <p className="mt-2 text-xs leading-5 opacity-75">
                {HEALTH_COPY[state]}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-12 lg:px-8">
        <div className="space-y-8">
          {TA14_ARCHITECTURE_REGIONS.map((region) => {
            const regionLinks = region.linkIds
              .map((linkId) =>
                TA14_24_LINKS.find((item) => item.linkId === linkId),
              )
              .filter(
                (
                  item,
                ): item is (typeof TA14_24_LINKS)[number] => Boolean(item),
              );

            return (
              <section
                key={region.id}
                className="rounded-3xl border border-white/10 bg-white/[0.025] p-6"
              >
                <div className="mb-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">
                    Architecture region
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold">
                    {region.label}
                  </h2>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                  {regionLinks.map((item) => {
                    const record = records[item.linkId];

                    return (
                      <button
                        key={item.linkId}
                        type="button"
                        onClick={() => setSelectedLinkId(item.linkId)}
                        className={[
                          "rounded-2xl border p-4 text-left transition hover:-translate-y-0.5",
                          HEALTH_CLASS[record.state],
                          selectedLinkId === item.linkId
                            ? "ring-2 ring-sky-300/35"
                            : "",
                        ].join(" ")}
                      >
                        <p className="text-xs font-semibold opacity-65">
                          {String(item.order).padStart(2, "0")}
                        </p>
                        <p className="mt-2 text-sm font-semibold leading-5">
                          {item.canonicalName}
                        </p>
                        <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.13em] opacity-70">
                          {HEALTH_LABELS[record.state]}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-6 pb-20 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
        <aside className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-300">
            Selected coordinate
          </p>
          <p className="mt-3 text-sm text-slate-500">
            {selectedLink.linkId}
          </p>
          <h2 className="mt-2 text-2xl font-semibold">
            {String(selectedLink.order).padStart(2, "0")}{" "}
            {selectedLink.canonicalName}
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            {selectedLink.definition}
          </p>

          <Link
            href={`/academy/24-link-architecture/${String(
              selectedLink.order,
            ).padStart(2, "0")}-${selectedLink.slug}`}
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-sky-300"
          >
            Open canonical lesson <span aria-hidden="true">→</span>
          </Link>
        </aside>

        <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-300">
            Evidence-state record
          </p>
          <h2 className="mt-3 text-2xl font-semibold">
            {architectureName || "Unnamed architecture"}
          </h2>

          <div className="mt-7 grid gap-5 sm:grid-cols-2">
            <label className="block">
              <FieldLabel>Evidence health</FieldLabel>
              <select
                value={selectedRecord.state}
                onChange={(event) =>
                  updateRecord(selectedLinkId, {
                    state: event.target.value as TA14EvidenceHealthState,
                  })
                }
                className="mt-2 w-full rounded-xl border border-white/10 bg-[#07101f] px-4 py-3 text-sm text-white outline-none focus:border-emerald-300/40"
              >
                {HEALTH_STATES.map((state) => (
                  <option key={state} value={state}>
                    {HEALTH_LABELS[state]}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <FieldLabel>Visibility boundary</FieldLabel>
              <select
                value={selectedRecord.visibility}
                onChange={(event) =>
                  updateRecord(selectedLinkId, {
                    visibility: event.target.value as
                      | "public"
                      | "private"
                      | "mixed",
                  })
                }
                className="mt-2 w-full rounded-xl border border-white/10 bg-[#07101f] px-4 py-3 text-sm text-white outline-none focus:border-emerald-300/40"
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
                <option value="mixed">Mixed</option>
              </select>
            </label>

            <TextField
              label="Supporting artifact / evidence"
              value={selectedRecord.artifact}
              onChange={(artifact) =>
                updateRecord(selectedLinkId, { artifact })
              }
            />
            <TextField
              label="Declared review scope"
              value={selectedRecord.scope}
              onChange={(scope) => updateRecord(selectedLinkId, { scope })}
            />
            <TextField
              label="Version / continuity state"
              value={selectedRecord.version}
              onChange={(version) =>
                updateRecord(selectedLinkId, { version })
              }
            />
            <TextField
              label="Challenge / correction state"
              value={selectedRecord.challenge}
              onChange={(challenge) =>
                updateRecord(selectedLinkId, { challenge })
              }
            />
          </div>

          <div className="mt-7 rounded-2xl border border-white/10 bg-black/15 p-5">
            <p className="text-sm font-semibold text-white">
              {HEALTH_LABELS[selectedRecord.state]}
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              {HEALTH_COPY[selectedRecord.state]}
            </p>
          </div>
        </section>
      </section>

      <section className="border-t border-white/10 bg-white/[0.02]">
        <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-200">
            Review boundary
          </p>
          <h2 className="mt-3 text-3xl font-semibold">
            A mapped link is not an approved architecture.
          </h2>
          <p className="mt-4 max-w-5xl leading-7 text-slate-300">
            Each cell represents a bounded evidence state within a declared
            scope and version. The overlay must preserve separate artifact,
            review, challenge, correction, and visibility records. Unsupported,
            partial, held, challenged, untested, and outside-scope states remain
            visible rather than being collapsed into a single score.
          </p>
        </div>
      </section>
    </main>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-sm font-semibold text-slate-200">{children}</span>
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
      <FieldLabel>{label}</FieldLabel>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={3}
        className="mt-2 w-full resize-y rounded-xl border border-white/10 bg-[#07101f] px-4 py-3 text-sm leading-6 text-white outline-none transition focus:border-emerald-300/40"
      />
    </label>
  );
}
