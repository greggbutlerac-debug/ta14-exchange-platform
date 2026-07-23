import Link from "next/link";

import {
  GOVERNANCE_PLAYGROUND_REGISTRY,
  type GovernanceLaneId,
} from "../lib/governance-playgrounds";

export interface GovernancePlaygroundsNavProps {
  activeLaneId?: GovernanceLaneId;
  className?: string;
}

const badgeStyles = {
  FOUNDATION:
    "border-violet-300/25 bg-violet-300/10 text-violet-200",
  REFERENCE:
    "border-cyan-300/25 bg-cyan-300/10 text-cyan-200",
  NEW:
    "border-emerald-300/25 bg-emerald-300/10 text-emerald-200",
  COMING_SOON:
    "border-white/10 bg-white/[0.04] text-slate-500",
} as const;

export function GovernancePlaygroundsNav({
  activeLaneId,
  className = "",
}: GovernancePlaygroundsNavProps) {
  const generalPlayground =
    GOVERNANCE_PLAYGROUND_REGISTRY.find(
      (entry) => entry.laneId === "general",
    );

  const specializedPlaygrounds =
    GOVERNANCE_PLAYGROUND_REGISTRY.filter(
      (entry) => entry.laneId !== "general",
    );

  return (
    <nav
      aria-label="Governance testing spaces"
      className={`rounded-3xl border border-white/10 bg-white/[0.04] p-5 ${className}`}
    >
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">
          AI Governance Playground
        </p>
        <h2 className="mt-2 text-xl font-black text-white">
          Testing Spaces
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Build broadly or enter the governance layer the
          architecture claims to control.
        </p>
      </div>

      {generalPlayground ? (
        <div className="mt-6">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-600">
            General
          </p>

          <NavEntry
            entry={generalPlayground}
            active={activeLaneId === "general"}
          />
        </div>
      ) : null}

      <div className="mt-6">
        <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-600">
          Governance-specific playgrounds
        </p>

        <div className="space-y-2">
          {specializedPlaygrounds.map((entry) => (
            <NavEntry
              key={entry.laneId}
              entry={entry}
              active={activeLaneId === entry.laneId}
            />
          ))}
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/70 p-4">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
          Governing rule
        </p>
        <p className="mt-2 text-sm font-semibold leading-6 text-slate-300">
          No admissible evidence. No admissible execution.
        </p>
      </div>
    </nav>
  );
}

function NavEntry({
  entry,
  active,
}: {
  entry: (typeof GOVERNANCE_PLAYGROUND_REGISTRY)[number];
  active: boolean;
}) {
  const badgeClass = entry.badge
    ? badgeStyles[entry.badge]
    : badgeStyles.COMING_SOON;

  const content = (
    <>
      <div className="flex items-start justify-between gap-3">
        <span
          className={`text-sm font-bold leading-5 ${
            active ? "text-cyan-100" : "text-slate-200"
          }`}
        >
          {entry.name}
        </span>

        {entry.badge ? (
          <span
            className={`shrink-0 rounded-full border px-2 py-1 text-[9px] font-black uppercase tracking-[0.12em] ${badgeClass}`}
          >
            {entry.badge.replaceAll("_", " ")}
          </span>
        ) : null}
      </div>

      <p className="mt-2 text-xs leading-5 text-slate-500">
        {entry.shortDescription}
      </p>
    </>
  );

  if (!entry.enabled) {
    return (
      <div
        aria-disabled="true"
        className="cursor-not-allowed rounded-2xl border border-white/[0.06] bg-white/[0.015] p-4 opacity-65"
      >
        {content}
      </div>
    );
  }

  return (
    <Link
      href={entry.href}
      aria-current={active ? "page" : undefined}
      className={`block rounded-2xl border p-4 transition ${
        active
          ? "border-cyan-300/50 bg-cyan-300/10"
          : "border-white/10 bg-slate-950/60 hover:border-cyan-300/30 hover:bg-cyan-300/[0.04]"
      }`}
    >
      {content}
    </Link>
  );
}

export default GovernancePlaygroundsNav;
