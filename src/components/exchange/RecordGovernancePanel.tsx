"use client";

import { useEffect, useMemo, useState } from "react";
import ChallengeThisRecord from "./ChallengeThisRecord";
import { createClient } from "../../lib/supabase/client";

type RecordGovernancePanelProps = {
  recordType: string;
  recordKey: string;
  recordVersion?: string | null;
  recordTitle?: string;
};

type CurrentState = {
  current_record_type: string;
  current_record_key: string;
  current_record_version: string | null;
  state_status:
    | "CURRENT"
    | "HELD"
    | "UNDER_RECONSIDERATION"
    | "WITHDRAWN"
    | "ESCALATED";
  authority_name: string;
  authority_basis: string;
  effective_at: string;
};

type LineageEvent = {
  lineage_id: string;
  event_type: string;
  record_type: string;
  record_key: string;
  record_version: string | null;
  related_record_type: string | null;
  related_record_key: string | null;
  event_summary: string;
  authority_name: string | null;
  occurred_at: string;
};

export default function RecordGovernancePanel({
  recordType,
  recordKey,
  recordVersion,
  recordTitle,
}: RecordGovernancePanelProps) {
  const supabase = useMemo(() => createClient(), []);

  const [currentState, setCurrentState] = useState<CurrentState | null>(
    null
  );
  const [lineage, setLineage] = useState<LineageEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadGovernanceState() {
      setLoading(true);
      setLoadError("");

      const [stateResult, lineageResult] = await Promise.all([
        supabase
          .from("ta14_current_authoritative_state")
          .select(
            [
              "current_record_type",
              "current_record_key",
              "current_record_version",
              "state_status",
              "authority_name",
              "authority_basis",
              "effective_at",
            ].join(",")
          )
          .eq("subject_type", recordType)
          .eq("subject_key", recordKey)
          .maybeSingle(),

        supabase
          .from("ta14_public_record_lineage")
          .select(
            [
              "lineage_id",
              "event_type",
              "record_type",
              "record_key",
              "record_version",
              "related_record_type",
              "related_record_key",
              "event_summary",
              "authority_name",
              "occurred_at",
            ].join(",")
          )
          .eq("subject_type", recordType)
          .eq("subject_key", recordKey)
          .order("occurred_at", { ascending: true }),
      ]);

      if (!active) return;

      if (stateResult.error || lineageResult.error) {
        setLoadError(
          stateResult.error?.message ||
            lineageResult.error?.message ||
            "Governance state could not be loaded."
        );
      } else {
        setCurrentState(
          (stateResult.data as CurrentState | null) ?? null
        );
        setLineage(
          (lineageResult.data as LineageEvent[] | null) ?? []
        );
      }

      setLoading(false);
    }

    loadGovernanceState();

    return () => {
      active = false;
    };
  }, [recordKey, recordType, supabase]);

  const effectiveState = currentState ?? {
    current_record_type: recordType,
    current_record_key: recordKey,
    current_record_version: recordVersion ?? null,
    state_status: "CURRENT" as const,
    authority_name: "Baseline record",
    authority_basis:
      "No superseding authoritative state is registered.",
    effective_at: "",
  };

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 shadow-2xl backdrop-blur-xl md:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">
              Governed Record State
            </p>

            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white md:text-3xl">
              Current authoritative state
            </h2>

            <p className="mt-3 max-w-3xl text-sm leading-7 text-white/60 md:text-base">
              Historical records remain preserved. If an admitted
              challenge changes the governing determination, the new
              state is linked here without overwriting the baseline.
            </p>
          </div>

          <StateBadge status={effectiveState.state_status} />
        </div>

        {loading ? (
          <div className="mt-7 rounded-2xl border border-white/10 bg-black/20 p-5 text-sm text-white/50">
            Loading governed state...
          </div>
        ) : loadError ? (
          <div className="mt-7 rounded-2xl border border-red-400/20 bg-red-400/[0.06] p-5 text-sm text-red-100">
            {loadError}
          </div>
        ) : (
          <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <InfoCard
              label="Current record"
              value={effectiveState.current_record_key}
            />
            <InfoCard
              label="Record type"
              value={effectiveState.current_record_type}
            />
            <InfoCard
              label="Version"
              value={
                effectiveState.current_record_version ||
                "Not declared"
              }
            />
            <InfoCard
              label="Authority"
              value={effectiveState.authority_name}
            />
          </div>
        )}

        <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-5">
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-white/40">
            Authority basis
          </div>
          <p className="mt-2 text-sm leading-6 text-white/70">
            {effectiveState.authority_basis}
          </p>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 shadow-2xl backdrop-blur-xl md:p-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">
              Institutional Lineage
            </p>

            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
              Preserved governance history
            </h2>
          </div>

          <p className="text-xs text-white/40">
            {lineage.length} preserved{" "}
            {lineage.length === 1 ? "event" : "events"}
          </p>
        </div>

        {loading ? (
          <div className="mt-6 text-sm text-white/50">
            Loading lineage...
          </div>
        ) : lineage.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-white/15 bg-black/10 p-6">
            <p className="text-sm font-medium text-white/75">
              No challenge or supersession lineage has been recorded
              yet.
            </p>
            <p className="mt-2 text-sm leading-6 text-white/45">
              This baseline remains the current record unless a
              governed challenge, reconsideration, or superseding
              finding is later preserved.
            </p>
          </div>
        ) : (
          <ol className="mt-7 space-y-4">
            {lineage.map((event, index) => (
              <li
                key={event.lineage_id}
                className="relative rounded-2xl border border-white/10 bg-black/20 p-5"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div className="flex gap-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-cyan-300/25 bg-cyan-300/10 text-xs font-semibold text-cyan-100">
                      {index + 1}
                    </div>

                    <div>
                      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-200">
                        {formatEventType(event.event_type)}
                      </div>

                      <p className="mt-2 text-sm leading-6 text-white/75">
                        {event.event_summary}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/40">
                        <span>{event.lineage_id}</span>
                        <span>
                          {event.record_key}
                          {event.record_version
                            ? ` · ${event.record_version}`
                            : ""}
                        </span>
                        {event.authority_name && (
                          <span>{event.authority_name}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <time className="shrink-0 text-xs text-white/35">
                    {formatTimestamp(event.occurred_at)}
                  </time>
                </div>
              </li>
            ))}
          </ol>
        )}

        <div className="mt-7 rounded-2xl border border-white/10 bg-black/20 p-5">
          <p className="text-sm font-medium text-white/75">
            Baseline → Challenge → Admitted Evidence →
            Reconsideration → Authorized Change → Superseding State →
            Preserved Lineage
          </p>
          <p className="mt-2 text-xs leading-5 text-white/40">
            No correction by overwrite. A later state may supersede a
            prior state, but it does not erase it.
          </p>
        </div>
      </div>

      <ChallengeThisRecord
        recordType={recordType}
        recordKey={recordKey}
        recordVersion={recordVersion}
        recordTitle={recordTitle}
      />
    </section>
  );
}

function InfoCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <div className="text-xs uppercase tracking-[0.14em] text-white/35">
        {label}
      </div>
      <div className="mt-2 break-words text-sm font-semibold text-white/85">
        {value}
      </div>
    </div>
  );
}

function StateBadge({
  status,
}: {
  status: CurrentState["state_status"];
}) {
  const label = status.replaceAll("_", " ");

  return (
    <div className="inline-flex w-fit items-center rounded-full border border-cyan-300/25 bg-cyan-300/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-cyan-100">
      {label}
    </div>
  );
}

function formatEventType(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatTimestamp(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}
