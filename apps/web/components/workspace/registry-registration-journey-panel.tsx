"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

type JourneyState =
  | "account_only"
  | "opened"
  | "started"
  | "draft_saved"
  | "submitted"
  | "registered"
  | "failed";

type AttentionState =
  | "none"
  | "failed"
  | "stalled"
  | "in_progress";

type RegistrationJourney = {
  userId: string;
  accountEmail: string | null;
  accountCreatedAt: string | null;
  lastSignInAt: string | null;
  firstRegistrationPageOpenedAt: string | null;
  firstRegistrationStartedAt: string | null;
  latestDraftSavedAt: string | null;
  latestSubmissionSubmittedAt: string | null;
  latestRegistrationCompletedAt: string | null;
  latestRegistrationFailedAt: string | null;
  lifecycleEventCount: number;
  governanceSubmissionCount: number;
  latestSubmissionId: string | null;
  latestSubmissionStatus: string | null;
  latestSubmissionCreatedAt: string | null;
  latestSubmissionUpdatedAt: string | null;
  latestSubmissionAcceptedAt: string | null;
  registryIdentifier: string | null;
  governanceName: string | null;
  organizationName: string | null;
  claimantName: string | null;
  contactEmail: string | null;
  requestedReviewPathway: string | null;
  journeyState: JourneyState;
  latestJourneyAt: string | null;
  attentionState: AttentionState;
  needsAttention: boolean;
};

type JourneyResponse = {
  ok?: boolean;
  summary?: {
    totalAccounts: number;
    accountOnly: number;
    opened: number;
    started: number;
    draftSaved: number;
    submitted: number;
    registered: number;
    failed: number;
    stalled: number;
    inProgress: number;
    needsAttention: number;
  };
  journeys?: RegistrationJourney[];
  attentionPolicy?: {
    stalledAfterHours?: number;
    explanation?: string;
  };
  error?: string;
};

type FilterMode =
  | "attention"
  | "all"
  | "failed"
  | "stalled"
  | "in_progress"
  | "submitted"
  | "registered";

function formatDate(value: string | null): string {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function relativeAge(value: string | null): string {
  if (!value) return "time unavailable";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "time unavailable";

  const diffMs = Date.now() - date.getTime();
  const minutes = Math.max(0, Math.floor(diffMs / 60_000));

  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 48) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function stateLabel(state: JourneyState): string {
  switch (state) {
    case "account_only":
      return "Account only";
    case "opened":
      return "Opened registration";
    case "started":
      return "Started registration";
    case "draft_saved":
      return "Draft saved";
    case "submitted":
      return "Submitted";
    case "registered":
      return "Registered";
    case "failed":
      return "Failed";
  }
}

function attentionLabel(state: AttentionState): string {
  switch (state) {
    case "failed":
      return "Failed — act now";
    case "stalled":
      return "Stalled";
    case "in_progress":
      return "In progress";
    case "none":
      return "No attention needed";
  }
}

function displayName(journey: RegistrationJourney): string {
  return (
    journey.governanceName ||
    journey.organizationName ||
    journey.claimantName ||
    journey.contactEmail ||
    journey.accountEmail ||
    "Unidentified registration journey"
  );
}

function detailLine(journey: RegistrationJourney): string {
  const parts = [
    journey.claimantName,
    journey.organizationName &&
    journey.organizationName !== journey.governanceName
      ? journey.organizationName
      : null,
    journey.contactEmail || journey.accountEmail,
  ].filter(Boolean);

  return parts.join(" · ");
}

function submissionHref(journey: RegistrationJourney): string | null {
  if (!journey.latestSubmissionId) return null;

  if (
    journey.journeyState === "submitted" ||
    journey.journeyState === "registered"
  ) {
    return `/workspace/ai-governance/registry/review/${encodeURIComponent(
      journey.latestSubmissionId,
    )}`;
  }

  return `/workspace/ai-governance/registry/register/${encodeURIComponent(
    journey.latestSubmissionId,
  )}`;
}

function stageReached(
  journey: RegistrationJourney,
  stage:
    | "account"
    | "opened"
    | "started"
    | "draft"
    | "submitted"
    | "registered",
): boolean {
  switch (stage) {
    case "account":
      return Boolean(journey.accountCreatedAt);
    case "opened":
      return Boolean(journey.firstRegistrationPageOpenedAt);
    case "started":
      return Boolean(journey.firstRegistrationStartedAt);
    case "draft":
      return Boolean(journey.latestDraftSavedAt);
    case "submitted":
      return Boolean(journey.latestSubmissionSubmittedAt);
    case "registered":
      return Boolean(journey.latestRegistrationCompletedAt);
  }
}

export function RegistryRegistrationJourneyPanel() {
  const [payload, setPayload] = useState<JourneyResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterMode>("attention");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "/api/ai-governance/registry/admin-registration-journeys?limit=500",
        {
          credentials: "same-origin",
          cache: "no-store",
          headers: { Accept: "application/json" },
        },
      );

      const next = (await response.json()) as JourneyResponse;

      if (!response.ok) {
        throw new Error(
          next.error || "Unable to load registration journeys.",
        );
      }

      setPayload(next);
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Unable to load registration journeys.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const journeys = useMemo(() => {
    const rows = payload?.journeys ?? [];
    const needle = search.trim().toLowerCase();

    return rows.filter((row) => {
      const filterMatch =
        filter === "all"
          ? true
          : filter === "attention"
            ? row.needsAttention
            : filter === "submitted"
              ? row.journeyState === "submitted"
              : filter === "registered"
                ? row.journeyState === "registered"
                : row.attentionState === filter;

      if (!filterMatch) return false;
      if (!needle) return true;

      return [
        row.governanceName,
        row.organizationName,
        row.claimantName,
        row.contactEmail,
        row.accountEmail,
        row.registryIdentifier,
        row.latestSubmissionId,
        row.latestSubmissionStatus,
        row.requestedReviewPathway,
        stateLabel(row.journeyState),
        attentionLabel(row.attentionState),
      ]
        .filter(Boolean)
        .some((value) =>
          String(value).toLowerCase().includes(needle),
        );
    });
  }, [filter, payload, search]);

  const summary = payload?.summary;

  return (
    <section className="journeyPanel">
      <div className="journeyHeader">
        <div>
          <span className="eyebrow">
            Registration awareness · left-behind detection
          </span>
          <h2>Who is trying to register?</h2>
          <p>
            See every registration journey by identity and exact stage.
            Failed attempts are immediate attention. Incomplete journeys
            become stalled after 24 hours without newer activity.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void load()}
          disabled={loading}
        >
          {loading ? "Checking…" : "Refresh journeys"}
        </button>
      </div>

      {summary && summary.needsAttention > 0 ? (
        <div className="leftBehindAlert" role="alert">
          <div>
            <span>Registration intervention required</span>
            <strong>
              {summary.needsAttention} registrant{summary.needsAttention === 1 ? "" : "s"} have not reached a completed submission.
            </strong>
          </div>
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setFilter("attention");

              window.requestAnimationFrame(() => {
                const target = document.getElementById(
                  "ta14-left-behind-registrants",
                );

                target?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });

                target?.focus({ preventScroll: true });
              });
            }}
          >
            Show left-behind registrants
          </button>
        </div>
      ) : null}

      {summary ? (
        <div className="attentionHero">
          <div>
            <span>Needs attention now</span>
            <strong>{summary.needsAttention}</strong>
            <p>
              People who have not reached submitted or registered state.
            </p>
          </div>

          <div className="attentionBreakdown">
            <article className="dangerMetric">
              <span>Failed</span>
              <strong>{summary.failed}</strong>
            </article>
            <article className="warningMetric">
              <span>Stalled</span>
              <strong>{summary.stalled}</strong>
            </article>
            <article>
              <span>In progress</span>
              <strong>{summary.inProgress}</strong>
            </article>
            <article className="successMetric">
              <span>Submitted</span>
              <strong>{summary.submitted}</strong>
            </article>
            <article className="successMetric">
              <span>Registered</span>
              <strong>{summary.registered}</strong>
            </article>
          </div>
        </div>
      ) : null}

      {summary ? (
        <div className="summaryGrid">
          <article>
            <span>Accounts</span>
            <strong>{summary.totalAccounts}</strong>
          </article>
          <article>
            <span>Account only</span>
            <strong>{summary.accountOnly}</strong>
          </article>
          <article>
            <span>Opened</span>
            <strong>{summary.opened}</strong>
          </article>
          <article>
            <span>Started</span>
            <strong>{summary.started}</strong>
          </article>
          <article>
            <span>Draft saved</span>
            <strong>{summary.draftSaved}</strong>
          </article>
        </div>
      ) : null}

      <div className="toolbar">
        <div className="filters" role="group" aria-label="Journey filter">
          {(
            [
              ["attention", "Needs attention"],
              ["failed", "Failed"],
              ["stalled", "Stalled"],
              ["in_progress", "In progress"],
              ["submitted", "Submitted"],
              ["registered", "Registered"],
              ["all", "All journeys"],
            ] as Array<[FilterMode, string]>
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setFilter(value)}
              className={filter === value ? "activeFilter" : ""}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="searchRow">
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search name, email, Registry ID, submission ID, status…"
            aria-label="Search registration journeys"
          />
          <span>{journeys.length} visible</span>
        </div>
      </div>

      {payload?.attentionPolicy?.explanation ? (
        <div className="policyBox">
          <strong>Attention policy</strong>
          <span>{payload.attentionPolicy.explanation}</span>
        </div>
      ) : null}

      {error ? <div className="errorBox">{error}</div> : null}

      {!loading && !error && journeys.length === 0 ? (
        <div className="emptyBox">
          No registration journeys match this view.
        </div>
      ) : null}

      <div
        id="ta14-left-behind-registrants"
        className="journeyList"
        tabIndex={-1}
        aria-label="Registration journeys matching the current filter"
      >
        {journeys.map((journey) => {
          const href = submissionHref(journey);
          const detail = detailLine(journey);

          return (
            <article
              className={[
                "journeyCard",
                journey.needsAttention ? "needsAttention" : "",
                journey.attentionState === "failed" ? "isFailed" : "",
                journey.attentionState === "stalled" ? "isStalled" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              key={journey.userId}
            >
              <div className="cardTop">
                <div className="identity">
                  <div className="identitySignal">
                    {journey.governanceName
                      ? journey.governanceName.slice(0, 2).toUpperCase()
                      : "RG"}
                  </div>

                  <div>
                    <strong>{displayName(journey)}</strong>
                    {detail ? <span>{detail}</span> : null}

                    <div className="identityTags">
                      {journey.registryIdentifier ? (
                        <span className="registryTag">
                          {journey.registryIdentifier}
                        </span>
                      ) : null}
                      {journey.latestSubmissionStatus ? (
                        <span>
                          submission: {journey.latestSubmissionStatus}
                        </span>
                      ) : null}
                      {journey.requestedReviewPathway ? (
                        <span>{journey.requestedReviewPathway}</span>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="statusStack">
                  <span
                    className={`attention attention-${journey.attentionState}`}
                  >
                    {attentionLabel(journey.attentionState)}
                  </span>
                  <span className={`state state-${journey.journeyState}`}>
                    {stateLabel(journey.journeyState)}
                  </span>
                </div>
              </div>

              <div className="lastActivity">
                <span>Latest journey activity</span>
                <strong>
                  {formatDate(journey.latestJourneyAt)}
                  {" · "}
                  {relativeAge(journey.latestJourneyAt)}
                </strong>
              </div>

              <div className="timeline" aria-label="Registration journey">
                {(
                  [
                    ["account", "Account", journey.accountCreatedAt],
                    [
                      "opened",
                      "Opened",
                      journey.firstRegistrationPageOpenedAt,
                    ],
                    [
                      "started",
                      "Started",
                      journey.firstRegistrationStartedAt,
                    ],
                    ["draft", "Draft", journey.latestDraftSavedAt],
                    [
                      "submitted",
                      "Submitted",
                      journey.latestSubmissionSubmittedAt,
                    ],
                    [
                      "registered",
                      "Registered",
                      journey.latestRegistrationCompletedAt,
                    ],
                  ] as const
                ).map(([stage, label, timestamp]) => (
                  <div
                    key={stage}
                    className={
                      stageReached(journey, stage) ? "complete" : ""
                    }
                  >
                    <i aria-hidden="true" />
                    <span>{label}</span>
                    <strong>{formatDate(timestamp)}</strong>
                  </div>
                ))}
              </div>

              {journey.latestRegistrationFailedAt ? (
                <div className="failure">
                  <strong>Registration failure recorded</strong>
                  <span>
                    {formatDate(journey.latestRegistrationFailedAt)}
                  </span>
                </div>
              ) : null}

              <div className="cardFooter">
                <div className="recordFacts">
                  <span>
                    Lifecycle events:{" "}
                    <strong>{journey.lifecycleEventCount}</strong>
                  </span>
                  <span>
                    Submission records:{" "}
                    <strong>{journey.governanceSubmissionCount}</strong>
                  </span>
                  <span>
                    Last sign-in:{" "}
                    <strong>{formatDate(journey.lastSignInAt)}</strong>
                  </span>
                  {journey.latestSubmissionId ? (
                    <span>
                      Submission ID:{" "}
                      <strong>{journey.latestSubmissionId}</strong>
                    </span>
                  ) : null}
                </div>

                {href ? (
                  <Link href={href} className="openRecord">
                    {journey.journeyState === "submitted" ||
                    journey.journeyState === "registered"
                      ? "Open submission record"
                      : "Open registration record"}
                    <span>→</span>
                  </Link>
                ) : (
                  <span className="noRecord">
                    No submission record exists yet
                  </span>
                )}
              </div>
            </article>
          );
        })}
      </div>

      <div className="boundary">
        Registration journey telemetry is an administrative awareness layer.
        It helps locate people who are failing or stalling, but it does not
        itself create, approve, register, publish, certify, or validate a
        governance entity.
      </div>

      <style jsx>{`
        .journeyPanel {
          display: grid;
          gap: 18px;
          padding: 22px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 22px;
          background: rgba(255, 255, 255, 0.025);
        }

        .journeyHeader {
          display: flex;
          justify-content: space-between;
          gap: 18px;
          align-items: flex-start;
        }

        .journeyHeader h2 {
          margin: 4px 0 7px;
          font-size: 26px;
        }

        .journeyHeader p {
          margin: 0;
          max-width: 780px;
          opacity: 0.68;
          line-height: 1.6;
          font-size: 12px;
        }

        .eyebrow {
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          opacity: 0.5;
        }

        button {
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: 12px;
          padding: 9px 13px;
          background: rgba(255, 255, 255, 0.045);
          color: inherit;
          cursor: pointer;
          font-weight: 800;
        }

        button:hover {
          border-color: rgba(92, 220, 255, 0.3);
          background: rgba(92, 220, 255, 0.06);
        }

        button:disabled {
          opacity: 0.5;
          cursor: default;
        }

        .leftBehindAlert {
          display: flex;
          justify-content: space-between;
          gap: 14px;
          align-items: center;
          padding: 14px 16px;
          border: 1px solid rgba(255, 92, 118, 0.24);
          border-radius: 16px;
          background: rgba(255, 92, 118, 0.055);
        }

        .leftBehindAlert > div {
          display: grid;
          gap: 4px;
        }

        .leftBehindAlert span {
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #ffd4dc;
        }

        .leftBehindAlert strong {
          font-size: 12px;
          line-height: 1.45;
        }

        .leftBehindAlert button {
          flex: 0 0 auto;
          border-color: rgba(255, 92, 118, 0.24);
          background: rgba(255, 92, 118, 0.07);
        }

        .attentionHero {
          display: grid;
          grid-template-columns: minmax(220px, 0.7fr) minmax(0, 1.3fr);
          gap: 12px;
          padding: 16px;
          border: 1px solid rgba(255, 185, 92, 0.18);
          border-radius: 18px;
          background: rgba(255, 185, 92, 0.035);
        }

        .attentionHero > div:first-child {
          display: grid;
          align-content: center;
        }

        .attentionHero span {
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          opacity: 0.58;
        }

        .attentionHero > div:first-child > strong {
          margin-top: 4px;
          font-size: 38px;
          line-height: 1;
        }

        .attentionHero p {
          margin: 7px 0 0;
          max-width: 360px;
          font-size: 11px;
          line-height: 1.5;
          opacity: 0.65;
        }

        .attentionBreakdown {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 8px;
        }

        .attentionBreakdown article,
        .summaryGrid article {
          display: grid;
          gap: 5px;
          padding: 11px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 13px;
          background: rgba(0, 0, 0, 0.08);
        }

        .attentionBreakdown strong,
        .summaryGrid strong {
          font-size: 20px;
        }

        .dangerMetric {
          border-color: rgba(255, 92, 118, 0.2) !important;
          background: rgba(255, 92, 118, 0.04) !important;
        }

        .warningMetric {
          border-color: rgba(255, 185, 92, 0.2) !important;
          background: rgba(255, 185, 92, 0.04) !important;
        }

        .successMetric {
          border-color: rgba(85, 225, 162, 0.14) !important;
        }

        .summaryGrid {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 8px;
        }

        .summaryGrid span {
          font-size: 8px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          opacity: 0.48;
          font-weight: 900;
        }

        .toolbar {
          display: grid;
          gap: 10px;
        }

        .filters {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
        }

        .filters button {
          padding: 7px 10px;
          font-size: 10px;
        }

        .filters .activeFilter {
          border-color: rgba(92, 220, 255, 0.35);
          background: rgba(92, 220, 255, 0.09);
          color: #dff9ff;
        }

        .searchRow {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .searchRow input {
          min-width: 0;
          flex: 1;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 12px;
          padding: 11px 12px;
          background: rgba(0, 0, 0, 0.16);
          color: inherit;
          outline: none;
        }

        .searchRow input:focus {
          border-color: rgba(92, 220, 255, 0.34);
        }

        .searchRow > span {
          white-space: nowrap;
          font-size: 10px;
          opacity: 0.48;
        }

        .policyBox,
        .errorBox,
        .emptyBox,
        .boundary {
          border-radius: 13px;
          padding: 12px 14px;
          font-size: 10px;
          line-height: 1.55;
        }

        .policyBox {
          display: flex;
          gap: 8px;
          border: 1px solid rgba(92, 220, 255, 0.11);
          background: rgba(92, 220, 255, 0.025);
        }

        .policyBox strong {
          flex: 0 0 auto;
        }

        .policyBox span {
          opacity: 0.68;
        }

        .errorBox {
          border: 1px solid rgba(255, 92, 118, 0.22);
          background: rgba(255, 92, 118, 0.05);
        }

        .emptyBox {
          border: 1px dashed rgba(255, 255, 255, 0.12);
          opacity: 0.6;
        }

        .journeyList {
          display: grid;
          gap: 12px;
          scroll-margin-top: 110px;
          outline: none;
        }

        .journeyList:focus-visible {
          border-radius: 16px;
          box-shadow: 0 0 0 2px rgba(92, 220, 255, 0.2);
        }

        .journeyCard {
          display: grid;
          gap: 15px;
          padding: 17px;
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 17px;
          background: rgba(0, 0, 0, 0.11);
        }

        .journeyCard.needsAttention {
          border-color: rgba(255, 185, 92, 0.18);
        }

        .journeyCard.isFailed {
          border-color: rgba(255, 92, 118, 0.24);
          background: rgba(255, 92, 118, 0.025);
        }

        .journeyCard.isStalled {
          border-color: rgba(255, 185, 92, 0.22);
        }

        .cardTop {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          align-items: flex-start;
        }

        .identity {
          display: flex;
          gap: 12px;
          min-width: 0;
        }

        .identitySignal {
          width: 42px;
          height: 42px;
          flex: 0 0 auto;
          display: grid;
          place-items: center;
          border: 1px solid rgba(92, 220, 255, 0.15);
          border-radius: 12px;
          background: rgba(92, 220, 255, 0.04);
          font-size: 11px;
          font-weight: 900;
        }

        .identity > div:last-child {
          min-width: 0;
        }

        .identity strong {
          display: block;
          font-size: 14px;
          overflow-wrap: anywhere;
        }

        .identity > div:last-child > span {
          display: block;
          margin-top: 4px;
          font-size: 10px;
          opacity: 0.62;
          overflow-wrap: anywhere;
        }

        .identityTags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 8px;
        }

        .identityTags span {
          margin: 0 !important;
          padding: 4px 7px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 999px;
          font-size: 8px !important;
          font-weight: 800;
          opacity: 0.66 !important;
        }

        .identityTags .registryTag {
          border-color: rgba(85, 225, 162, 0.14);
          color: #c8f7df;
        }

        .statusStack {
          display: grid;
          gap: 6px;
          justify-items: end;
          flex: 0 0 auto;
        }

        .attention,
        .state {
          display: inline-flex;
          align-items: center;
          min-height: 24px;
          padding: 0 9px;
          border-radius: 999px;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .attention-none {
          border: 1px solid rgba(85, 225, 162, 0.15);
          background: rgba(85, 225, 162, 0.04);
          color: #c8f7df;
        }

        .attention-failed {
          border: 1px solid rgba(255, 92, 118, 0.22);
          background: rgba(255, 92, 118, 0.07);
          color: #ffd4dc;
        }

        .attention-stalled {
          border: 1px solid rgba(255, 185, 92, 0.22);
          background: rgba(255, 185, 92, 0.06);
          color: #ffe5b9;
        }

        .attention-in_progress {
          border: 1px solid rgba(92, 220, 255, 0.16);
          background: rgba(92, 220, 255, 0.04);
          color: #dff9ff;
        }

        .state {
          border: 1px solid rgba(255, 255, 255, 0.09);
          opacity: 0.58;
        }

        .lastActivity {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          padding: 9px 11px;
          border-radius: 11px;
          background: rgba(255, 255, 255, 0.025);
          font-size: 9px;
        }

        .lastActivity span {
          opacity: 0.5;
          text-transform: uppercase;
          letter-spacing: 0.07em;
          font-weight: 900;
        }

        .timeline {
          position: relative;
          display: grid;
          grid-template-columns: repeat(6, minmax(0, 1fr));
          gap: 6px;
        }

        .timeline::before {
          content: "";
          position: absolute;
          left: 6%;
          right: 6%;
          top: 8px;
          height: 1px;
          background: rgba(255, 255, 255, 0.08);
        }

        .timeline > div {
          position: relative;
          z-index: 1;
          display: grid;
          gap: 5px;
          text-align: center;
          opacity: 0.35;
        }

        .timeline > div.complete {
          opacity: 1;
        }

        .timeline i {
          width: 16px;
          height: 16px;
          margin: 0 auto;
          border: 1px solid rgba(255, 255, 255, 0.13);
          border-radius: 50%;
          background: #08111b;
        }

        .timeline .complete i {
          border-color: rgba(85, 225, 162, 0.26);
          background: rgba(85, 225, 162, 0.12);
          box-shadow: 0 0 0 3px #08111b;
        }

        .timeline span {
          font-size: 8px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .timeline strong {
          font-size: 8px;
          font-weight: 600;
          line-height: 1.35;
        }

        .failure {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          padding: 10px 12px;
          border: 1px solid rgba(255, 92, 118, 0.2);
          border-radius: 11px;
          background: rgba(255, 92, 118, 0.045);
          color: #ffd4dc;
          font-size: 9px;
        }

        .cardFooter {
          display: flex;
          justify-content: space-between;
          gap: 14px;
          align-items: flex-end;
          padding-top: 12px;
          border-top: 1px solid rgba(255, 255, 255, 0.07);
        }

        .recordFacts {
          display: flex;
          flex-wrap: wrap;
          gap: 6px 12px;
          min-width: 0;
        }

        .recordFacts span {
          font-size: 8px;
          opacity: 0.48;
          overflow-wrap: anywhere;
        }

        .recordFacts strong {
          font-weight: 800;
        }

        .openRecord {
          flex: 0 0 auto;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 9px 11px;
          border: 1px solid rgba(92, 220, 255, 0.18);
          border-radius: 11px;
          background: rgba(92, 220, 255, 0.045);
          color: #dff9ff;
          text-decoration: none;
          font-size: 9px;
          font-weight: 900;
        }

        .openRecord:hover {
          border-color: rgba(92, 220, 255, 0.34);
          background: rgba(92, 220, 255, 0.08);
        }

        .noRecord {
          flex: 0 0 auto;
          font-size: 9px;
          opacity: 0.4;
        }

        .boundary {
          border: 1px solid rgba(255, 255, 255, 0.07);
          opacity: 0.5;
        }

        @media (max-width: 1100px) {
          .attentionHero {
            grid-template-columns: 1fr;
          }

          .attentionBreakdown,
          .summaryGrid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        @media (max-width: 760px) {
          .journeyHeader,
          .leftBehindAlert,
          .cardTop,
          .cardFooter,
          .lastActivity,
          .failure {
            display: grid;
          }

          .statusStack {
            justify-items: start;
          }

          .attentionBreakdown,
          .summaryGrid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .timeline {
            grid-template-columns: repeat(3, minmax(0, 1fr));
            row-gap: 15px;
          }

          .timeline::before {
            display: none;
          }

          .searchRow {
            display: grid;
          }

          .openRecord,
          .noRecord {
            justify-self: start;
          }
        }
      `}</style>
    </section>
  );
}
